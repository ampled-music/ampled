import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Confetti from 'react-dom-confetti';
import { getArtistAction } from '../../redux/artists/get-details';
import { openAuthModalAction } from '../../redux/authentication/authentication-modal';
import { showToastAction } from '../../redux/toast/toast-modal';
import { Store } from '../../redux/configure-store';
import { Helmet } from 'react-helmet';

import { initialState as artistsInitialState } from '../../redux/artists/initial-state';
import { initialState as authenticateInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';
import {
  initialState as subscriptionsInitialState,
  SubscriptionStep,
} from '../../redux/subscriptions/initial-state';
import { CloudinaryContext } from 'cloudinary-react';
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
  };
  players: Set<any>;

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getArtistInfo();
    this.players = new Set();
  }

  componentDidUpdate(prevProps: Props, prevState) {
    if (!prevProps.me.userData && this.props.me.userData) {
      this.getArtistInfo();
    }

    if (this.props.subscriptions.status === SubscriptionStep.Finished) {
      this.props.showToast({
        message: `Thanks for supporting ${this.props.artists.artist.name}!`,
        type: 'success',
      });
      // Confetti
      if (prevState.successfulSupport === false) {
        this.setState({ successfulSupport: true });
      }
    }
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

  ColorLuminance = (hex, lum) => {
    if (!hex) {
      return '#fff';
    }
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    let rgb = '#',
      c,
      i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
      rgb += ('00' + c).substr(c.length);
    }

    return rgb;
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

  render() {
    const {
      artists,
      me: { userData, loadingMe },
    } = this.props;
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

    if (artists && !artists.loading && artists.error) {
      return <NoArtist />;
    }

    return (
      <div className="App">
        <CloudinaryContext cloudName="ampled-web">
          <style
            dangerouslySetInnerHTML={{
              __html: `
              .btn.btn-read-more,
              .btn.btn-support,
              .private-support__btn > .btn {
                border-width: 0px;
                background-color: ${artist.accent_color};
                color: white;
              }
              .new-post button,
              .edit-page button,
              .post__change button,
              .artist-header__photo,
              .artist-header__title_flair,
              .artist-header__banner-icons_icon.active {
                background-color: ${artist.accent_color};
              }
              .btn.btn-read-more:hover,
              .btn.btn-support:hover,
              .private-support__btn > .btn:hover,
              .new-post button:hover,
              .edit-page button:hover {
                background-color: ${this.ColorLuminance(
                  artist.accent_color,
                  -0.2,
                )};
              }
              .supporter__hover-card_bands_name a:hover {
                color: ${artist.accent_color};
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
                Your page is pending a quick approval.{' '}
                {/* eslint-disable-next-line react/jsx-no-target-blank */}
                <a href="https://app.ampled.com/approval" target="_blank">
                  Learn more here
                </a>
                .
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
            <Confetti
              active={this.state.successfulSupport}
              config={this.getConfettiConfig()}
            />
          </div>
          <Loading artistLoading={artists.loading || loadingMe} />
        </CloudinaryContext>
      </div>
    );
  }
}

const Artist = connect(mapStateToProps, mapDispatchToProps)(ArtistComponent);

export { Artist };
