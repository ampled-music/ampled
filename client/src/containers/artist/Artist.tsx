import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Confetti from 'react-dom-confetti';
import { getArtistAction } from '../../redux/artists/get-details';
import { openAuthModalAction } from '../../redux/authentication/authentication-modal';
import { showToastAction } from '../../redux/toast/toast-modal';
import { Store } from '../../redux/configure-store';
import { Helmet } from 'react-helmet';
import { apiAxios } from '../../api/setup-axios';

import { initialState as artistsInitialState } from '../../redux/artists/initial-state';
import { initialState as authenticateInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';
import { initialState as subscriptionsInitialState } from '../../redux/subscriptions/initial-state';
import { PostsContainer } from '../artist/posts/PostsContainer';
import { ConfirmationDialog } from '../shared/confirmation-dialog/ConfirmationDialog';
import { Modal } from '../shared/modal/Modal';
import { Loading } from '../shared/loading/Loading';
import { VideoModal } from '../shared/video-modal/VideoModal';
import { WhyModal } from '../shared/why-modal/WhyModal';
import { MessageModal } from '../shared/message-modal/MessageModal';
import { Texture } from '../shared/texture/Texture';

import { ArtistHeader } from './ArtistHeader';
import { ArtistInfo } from './ArtistInfo';
import { PostForm } from './posts/post-form/PostForm';
import { ArtistComingSoon } from '../shared/no-artist/ArtistComingSoon';
import { NoArtist } from '../shared/no-artist/NoArtist';
import { routePaths } from '../route-paths';

const mapStateToProps = (state: Store) => {
  return {
    artists: state.artists,
    me: state.me,
    posts: state.posts,
    authentication: state.authentication,
    subscriptions: state.subscriptions,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getArtist: bindActionCreators(getArtistAction, dispatch),
    openAuthModal: bindActionCreators(openAuthModalAction, dispatch),
    showToast: bindActionCreators(showToastAction, dispatch),
  };
};

interface ArtistProps {
  match: {
    params: {
      id: string;
      slug: string;
    };
    path: string;
  };
  location: {
    search: string;
    pathname: string;
  };
  history: any;
  artists: typeof artistsInitialState;
  me: typeof meInitialState;
  authentication: typeof authenticateInitialState;
  subscriptions: typeof subscriptionsInitialState;
}

type Dispatchers = ReturnType<typeof mapDispatchToProps>;
type Props = Dispatchers & ArtistProps;

class ArtistComponent extends React.Component<Props, any> {
  state = {
    openPostModal: false,
    openVideoModal: false,
    openMessageModal: false,
    openWhyModal: false,
    showConfirmationDialog: false,
    successfulSupport: false,
    requestedApproval: false,
  };
  players: Set<any>;

  componentDidMount() {
    const {
      location: { search },
    } = this.props;
    window.scrollTo(0, 0);
    this.getArtistInfo();
    this.players = new Set();
    const successfulSupport = /flash=supported/gi.test(search);
    this.setState({ successfulSupport });
    if (successfulSupport) {
      this.props.showToast({
        message: 'Thanks for your support!',
        type: 'success',
      });
      this.props.history.replace(this.props.location.pathname);
    }
  }

  componentDidUpdate(prevProps: Props, prevState) {
    if (!prevProps.me.userData && this.props.me.userData) {
      this.getArtistInfo();
    }

    // if (this.props.subscriptions.status === SubscriptionStep.Finished) {
    //   this.props.showToast({
    //     message: `Thanks for supporting ${this.props.artists.artist.name}!`,
    //     type: 'success',
    //   });
    //   // Confetti
    //   if (prevState.successfulSupport === false) {
    //     this.setState({ successfulSupport: true });
    //   }
    // }
  }

  playerCallback = (action: string, instance: any) => {
    const { players } = this;
    if (action === 'play') {
      // Pause all active players
      players.forEach((player) => {
        // handlePause instance method both pauses audio *and* triggers
        // the 'pause' callback below
        player.handlePause();
      });

      // Add newly active player to set
      players.add(instance);
    } else if (action === 'pause') {
      // Triggered after player has already been paused;
      // remove paused player from set
      players.delete(instance);
    }
  };

  getConfettiConfig = () => {
    const confettiConfig = {
      angle: 90,
      spread: 70,
      startVelocity: 70,
      elementCount: 250,
      duration: 5000,
      colors: [
        this.props.artists.artist.accent_color,
        this.props.artists.artist.accent_color + '33',
      ],
    };
    return confettiConfig;
  };

  getArtistInfo = () => {
    if (this.props.match.params.slug) {
      this.props.getArtist(null, this.props.match.params.slug);
    } else {
      this.props.getArtist(this.props.match.params.id);
    }
  };

  getUserConfirmation = (hasUnsavedChanges) => {
    if (hasUnsavedChanges) {
      this.setState({ showConfirmationDialog: true });
    } else {
      this.discardChanges();
    }
  };

  closeConfirmationDialog = () => {
    this.setState({ showConfirmationDialog: false });
  };

  discardChanges = () => {
    this.closeConfirmationDialog();
    this.closePostModal();
  };

  openPostModal = () => {
    this.setState({ openPostModal: true });
  };

  closePostModal = () => {
    this.setState({ openPostModal: false });
  };

  openVideoModal = () => {
    this.setState({ openVideoModal: true });
  };

  closeVideoModal = () => {
    this.setState({ openVideoModal: false });
  };

  openWhyModal = () => {
    this.setState({ openWhyModal: true });
  };

  closeWhyModal = () => {
    this.setState({ openWhyModal: false });
  };

  openMessageModal = () => {
    this.setState({ openMessageModal: true });
  };

  closeMessageModal = () => {
    this.setState({ openMessageModal: false });
  };

  getLoggedUserPageAccess = () => {
    const {
      me: { userData },
    } = this.props;

    if (userData?.admin) {
      return {
        artistId: +this.props.artists.artist.id,
        role: 'admin',
      };
    }

    return (
      userData &&
      userData?.ownedPages.find(
        (page) => page.artistId === +this.props.artists.artist.id,
      )
    );
  };

  lightOrDark = (color) => {
    // Variables for red, green, blue values
    let r, g, b;

    if (color) {
      // Check the format of the color, HEX or RGB?
      if (color.match(/^rgb/)) {
        // If HEX --> store the red, green, blue values in separate variables
        color = color.match(
          /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/,
        );

        r = color[1];
        g = color[2];
        b = color[3];
      } else {
        // If RGB --> Convert it to HEX: http://gist.github.com/983661
        color = +(
          '0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&')
        );

        r = color >> 16;
        g = (color >> 8) & 255;
        b = color & 255;
      }

      // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
      const hsp = Math.sqrt(
        0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b),
      );

      // Using the HSP value, determine whether the color is light or dark
      if (hsp > 127.5) {
        return '#1E1E1E';
      } else {
        return '#ffffff';
      }
    }
  };

  hexToRGB = (hex, alpha) => {
    if (hex) {
      const r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

      if (alpha) {
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
      } else {
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
      }
    }
  };

  handleSupportClick = () => {
    let supportUrl;
    if (this.props.artists.artist.slug) {
      supportUrl = routePaths.support.replace(
        ':id',
        this.props.artists.artist.slug,
      );
    } else {
      supportUrl = routePaths.support.replace(
        ':id',
        String(this.props.artists.artist.id),
      );
    }

    if (this.props.me && this.props.me.userData) {
      this.props.history.push(supportUrl);
    } else {
      this.props.openAuthModal({
        modalPage: 'signup',
        showSupportMessage: 'artist',
        artistName: this.props.artists.artist.name,
        redirectTo: supportUrl,
      });
      this.setState({ openWhyModal: false });
    }
  };

  renderSticky = (message: any) => (
    <div className="artistAlertHeader">{message}</div>
  );

  requestApproval = async () => {
    try {
      const { data } = await apiAxios({
        method: 'post',
        url: `/artist/${this.props.artists.artist.slug}/request_approval.json`,
        data: {},
      });
      if (data.status === 'ok') {
        this.props.showToast({
          message: data.message,
          type: 'success',
        });
        this.setState({ requestedApproval: true });
      } else {
        this.props.showToast({
          message: data.message,
          type: 'error',
        });
      }
    } catch {
      this.props.showToast({
        message: 'Sorry, something went wrong.',
        type: 'error',
      });
    }
  };

  render() {
    const {
      artists,
      me: { userData, loadingMe },
    } = this.props;

    const { successfulSupport } = this.state;
    const showConfetti =
      successfulSupport && artists && !artists.loading && !artists.error;

    const artist = artists.artist;
    const loggedUserAccess = this.getLoggedUserPageAccess();
    let isSupporter = false;
    if (userData) {
      for (const subscription of userData.subscriptions) {
        if (subscription.artistPageId === artist.id) {
          isSupporter = true;
          break;
        }
      }
    }

    // console.log(loggedUserAccess);

    if (
      !artists.artist.approved &&
      !loggedUserAccess &&
      !artists.loading &&
      !artists.error &&
      !loadingMe
    ) {
      return <ArtistComingSoon artist={artist} />;
    } else if (artists && !artists.loading && artists.error) {
      return <NoArtist />;
    }

    return (
      <div className="App">
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .btn.btn-read-more,
              .btn.btn-support,
              .private-support__btn > .btn {
                border-width: 0px;
                background-color: ${artist.accent_color};
                color: ${this.lightOrDark(artist.accent_color)};
              }
              .artist-header__title_flair,
              .artist-header__banner-icons_icon.active  {
                background-color: ${artist.accent_color};
                color: ${this.lightOrDark(artist.accent_color)};
              }
              .new-post button,
              .edit-page button,
              .new-post svg,
              .edit-page svg,
              .post__change button,
              .artist-header__photo {
                background-color: ${artist.accent_color};
                color: ${this.lightOrDark(artist.accent_color)};
              }
              .btn.btn-read-more:hover,
              .btn.btn-support:hover,
              .private-support__btn > .btn:hover,
              .new-post button:hover,
              .edit-page button:hover {
                background-color: ${artist.accent_color};
              }
              .supporter__hover-card_bands_name a:hover {
                color: ${artist.accent_color};
              }
              .audio-player__play-pause button,
              .artist-header__message_container button {
                background-color: ${this.hexToRGB(artist.accent_color, '.5')};
                color: ${this.lightOrDark(artist.accent_color)};
              }
              .audio-player__play-pause button:hover,
              .artist-header__message_container button:hover {
                background-color: ${this.hexToRGB(artist.accent_color, '.7')};
              }
              ${isSupporter &&
                `
                .user-image { 
                  border: 1px solid ${artist.accent_color}; 
                }
                header .supporter-message { 
                  display: inline-block !important; 
                  color: ${artist.accent_color}; 
                }
              `}
            `,
          }}
        />

        <Texture
          positionTop25={false}
          positionTop50={false}
          positionFlip={false}
        />
        {artist && artist.name && (
          <Helmet>
            <title>
              {artist.name} | Ampled | Direct Community Support For Music
              Artists
            </title>
          </Helmet>
        )}
        {artist &&
          !artist.approved &&
          loggedUserAccess &&
          this.renderSticky(
            <span>
              Your page is pending a quick approval.
              <br />
              {!this.state.requestedApproval && (
                <span>
                  When you&apos;re ready to go,{' '}
                  <a
                    role="button"
                    onClick={this.requestApproval}
                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    click here
                  </a>{' '}
                  to let us know.
                </span>
              )}
            </span>,
          )}
        {artist &&
          !artist.isStripeSetup &&
          loggedUserAccess &&
          this.renderSticky(
            <span>
              Right now you can&#39;t be supported until you{' '}
              <a href={loggedUserAccess.stripeSignup}>
                set up your Stripe Account
              </a>
              .
            </span>,
          )}
        <ArtistHeader
          artist={artist}
          openVideoModal={this.openVideoModal}
          openMessageModal={this.openMessageModal}
          openPostModal={this.openPostModal}
          openWhyModal={this.openWhyModal}
          loggedUserAccess={loggedUserAccess}
          isSupporter={isSupporter}
          handleSupportClick={this.handleSupportClick}
        />
        <ArtistInfo
          location={artist.location}
          accentColor={artist.accent_color}
          twitterHandle={artist.twitter_handle}
          instagramHandle={artist.instagram_handle}
        />
        <PostsContainer
          match={this.props.match}
          hash={this.props.history.location.hash}
          posts={artist.posts}
          artistName={artist.name}
          artistId={artist.id}
          artistSlug={artist.slug}
          accentColor={artist.accent_color}
          updateArtist={this.getArtistInfo}
          loading={artists.loading || loadingMe}
          loggedUserAccess={loggedUserAccess}
          playerCallback={this.playerCallback}
        />
        <Modal open={this.state.openPostModal} onClose={this.closePostModal}>
          <PostForm
            close={this.getUserConfirmation}
            discardChanges={this.discardChanges}
          />
        </Modal>
        <VideoModal
          open={this.state.openVideoModal}
          videoUrl={artist.video_url}
          onClose={this.closeVideoModal}
        />
        <WhyModal
          open={this.state.openWhyModal}
          onClose={this.closeWhyModal}
          handleSupportClick={this.handleSupportClick}
        />
        <MessageModal
          accentColor={artist.accent_color}
          artistBio={artist.bio}
          open={this.state.openMessageModal}
          handleSupportClick={this.handleSupportClick}
          onClose={this.closeMessageModal}
          showSupport={!isSupporter}
        />
        <ConfirmationDialog
          open={this.state.showConfirmationDialog}
          closeConfirmationDialog={this.closeConfirmationDialog}
          discardChanges={this.discardChanges}
        />
        <div className="confetti-overlay">
          <Confetti active={showConfetti} config={this.getConfettiConfig()} />
        </div>
        <Loading artistLoading={artists.loading || loadingMe} />
      </div>
    );
  }
}

const Artist = connect(mapStateToProps, mapDispatchToProps)(ArtistComponent);

export { Artist };
