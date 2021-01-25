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
import { JoinModal } from '../shared/join-modal/JoinModal';
import { MessageModal } from '../shared/message-modal/MessageModal';
import StyleOverride from './StyleOverride';

import { ArtistHeader } from './ArtistHeader';
import { ArtistHeaderMinimal } from './ArtistHeaderMinimal';
import { PostForm } from './posts/post-form/PostForm';
import { ArtistComingSoon } from '../shared/no-artist/ArtistComingSoon';
import { NoArtist } from '../shared/no-artist/NoArtist';
import { routePaths } from '../route-paths';

import { isAmpled } from '../shared/utils';

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
    openJoinModal: false,
    showConfirmationDialog: false,
    successfulSupport: false,
    requestedApproval: false,
    isAmpled: false,
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
    isAmpled(this.props.artists.artist.slug) &&
      this.setState({ isAmpled: true });
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

  openJoinModal = () => {
    this.setState({ openJoinModal: true });
  };

  closeJoinModal = () => {
    this.setState({ openJoinModal: false });
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
        artistSlug: this.props.artists.artist.slug,
        redirectTo: supportUrl,
      });
      this.setState({ openWhyModal: false, openJoinModal: false });
    }
  };

  renderSticky = (message: any) => (
    <div className="artistAlertHeader active">{message}</div>
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

    const { successfulSupport, isAmpled } = this.state;
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
        <StyleOverride
          accentColor={artist.accent_color}
          isSupporter={isSupporter}
          bgColor={false}
        />
        {artist && artist.name && (
          <Helmet>
            <title>
              {artist.name} | Ampled | Direct Community Support For Music
              Artists
            </title>
            {!artist.approved && (
              <meta name="robots" content="noindex, nofollow" />
            )}
          </Helmet>
        )}
        {artist &&
          !artist.approved &&
          artist.isStripeSetup &&
          loggedUserAccess &&
          this.renderSticky(
            <div className="artistAlertHeader__container">
              {!this.state.requestedApproval && (
                <span>
                  Congrats! Your page is now eligible for approval. When you’re
                  ready for us to take a look,{' '}
                  <button
                    className="link link__banner"
                    onClick={this.requestApproval}
                  >
                    click here to submit your page
                  </button>
                  .
                </span>
              )}
            </div>,
          )}
        {artist &&
          !artist.approved &&
          !artist.isStripeSetup &&
          loggedUserAccess &&
          this.renderSticky(
            <div className="artistAlertHeader__container">
              The Ampled team does a quick spot check of all pages before they
              become visible to the general public.{' '}
              <a href={loggedUserAccess.stripeSignup}>Set up payouts</a> to help
              us approve your page faster.
            </div>,
          )}
        {artist.style_type === 'minimal' ? (
          <ArtistHeaderMinimal
            artist={artist}
            openVideoModal={this.openVideoModal}
            openMessageModal={this.openMessageModal}
            openPostModal={this.openPostModal}
            openWhyModal={this.openWhyModal}
            openJoinModal={this.openJoinModal}
            loggedUserAccess={loggedUserAccess}
            isSupporter={isSupporter}
            isAmpled={isAmpled}
            handleSupportClick={this.handleSupportClick}
          />
        ) : (
          <ArtistHeader
            artist={artist}
            openVideoModal={this.openVideoModal}
            openMessageModal={this.openMessageModal}
            openPostModal={this.openPostModal}
            openWhyModal={this.openWhyModal}
            openJoinModal={this.openJoinModal}
            loggedUserAccess={loggedUserAccess}
            isSupporter={isSupporter}
            isAmpled={isAmpled}
            handleSupportClick={this.handleSupportClick}
          />
        )}

        <PostsContainer
          match={this.props.match}
          hash={this.props.history.location.hash}
          posts={artist.posts}
          artistName={artist.name}
          artistId={artist.id}
          artistSlug={artist.slug}
          hideMembers={artist.hide_members}
          accentColor={artist.accent_color}
          updateArtist={this.getArtistInfo}
          loading={artists.loading || loadingMe}
          loggedUserAccess={loggedUserAccess}
          playerCallback={this.playerCallback}
          openPostModal={this.openPostModal}
        />
        <Modal
          open={this.state.openPostModal}
          onClose={this.closePostModal}
          className="post-modal"
          disableBackdropClick={true}
        >
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
        <JoinModal
          open={this.state.openJoinModal}
          onClose={this.closeJoinModal}
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
        <Loading isLoading={artists.loading || loadingMe} />
      </div>
    );
  }
}

const Artist = connect(mapStateToProps, mapDispatchToProps)(ArtistComponent);

export { Artist };
