import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Confetti from 'react-dom-confetti';
import { getArtistAction } from 'src/redux/artists/get-details';
import { openAuthModalAction } from 'src/redux/authentication/authentication-modal';
import { Store } from 'src/redux/configure-store';

import { initialState as artistsInitialState } from '../../redux/artists/initial-state';
import { initialState as authenticateInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';
import { initialState as subscriptionsInitialState, SubscriptionStep } from '../../redux/subscriptions/initial-state';
import { PostsContainer } from '../artist/posts/PostsContainer';
import { ConfirmationDialog } from '../shared/confirmation-dialog/ConfirmationDialog';
import { Modal } from '../shared/modal/Modal';
import { showToastMessage, MessageType } from '../shared/toast/toast';
import { VideoModal } from '../shared/video-modal/VideoModal';
import { ArtistHeader } from './ArtistHeader';
import { ArtistInfo } from './ArtistInfo';
import { PostForm } from './posts/post-form/PostForm';
import { routePaths } from '../route-paths';


interface ArtistProps {
  match: {
    params: {
      id: string;
    };
    path: string;
  };
  history: any;
  artists: typeof artistsInitialState;
  me: typeof meInitialState;
  authentication: typeof authenticateInitialState;
  subscriptions: typeof subscriptionsInitialState;
}

const confettiConfig = {
  angle: 90,
  spread: 45,
  startVelocity: 45,
  elementCount: 50,
  dragFriction: 0.1,
  duration: 3000,
  stagger: 0,
  width: "10px",
  height: "10px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
};

type Dispatchers = ReturnType<typeof mapDispatchToProps>;
type Props = Dispatchers & ArtistProps;

class ArtistComponent extends React.Component<Props, any> {
  state = {
    openPostModal: false,
    openVideoModal: false,
    showConfirmationDialog: false,
    successfulSupport: false
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getArtistInfo();
  }

  componentDidUpdate(prevProps: Props, prevState) {
    if (!prevProps.me.userData && this.props.me.userData) {
      this.getArtistInfo();
    }

    console.log(prevState.successfulSupport);

    if (this.props.subscriptions.status === SubscriptionStep.Finished) {
      showToastMessage(`Thanks for supporting ${this.props.artists.artist.name}!`, MessageType.SUCCESS);
      // Confetti
      if (prevState.successfulSupport === false) {
        this.setState({ successfulSupport: true });
      }
    }

  }


  getArtistInfo = () => {
    this.props.getArtist(this.props.match.params.id);
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

  getLoggedUserPageAccess = () => {
    const { me, match } = this.props;

    return me.userData && me.userData.artistPages.find((page) => page.artistId === +match.params.id);
  };

  ColorLuminance = (hex, lum) => {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum || 0;
  
    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i*2,2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00"+c).substr(c.length);
    }
  
    return rgb;
  }

  handleSupportClick = () => {
    if (this.props.me && this.props.me.userData) {
      this.props.history.push(routePaths.support.replace(':id', this.props.match.params.id));
    } else {
      this.props.openAuthModal({
        modalPage: 'signup',
        showSupportMessage: 'artist',
        artistName: this.props.artists.artist.name,
        redirectTo: routePaths.support.replace(':id', this.props.match.params.id),
      });
    }
  };

  render() {
    const { artists, me: { userData } } = this.props;
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
  

    return (
      <div className="App">
        <style
          dangerouslySetInnerHTML={{
          __html: `
            .btn-support, .private-support-btn > .btn {
              border-color: unset;
              background-color: ${artist.accent_color};
              color: white;
            }
            .btn-support:hover, .private-support-btn > .btn:hover {
              background-color: ${this.ColorLuminance(artist.accent_color, -0.2)};
            }
            ${isSupporter && `
              .user-image { border: 1px solid ${artist.accent_color}; }
              header .supporter-message { display: inline-block !important; color: ${artist.accent_color}; }
            `}
          `
          }}
        />
        <ArtistHeader
          artist={artist}
          openVideoModal={this.openVideoModal}
          openPostModal={this.openPostModal}
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
          posts={artist.posts}
          artistName={artist.name}
          artistId={artist.id}
          accentColor={artist.accent_color}
          updateArtist={this.getArtistInfo}
          loggedUserAccess={loggedUserAccess}
        />
        <Modal open={this.state.openPostModal}>
          <PostForm close={this.getUserConfirmation} discardChanges={this.discardChanges} />
        </Modal>
        <VideoModal open={this.state.openVideoModal} videoUrl={artist.video_url} onClose={this.closeVideoModal} />
        <ConfirmationDialog
          open={this.state.showConfirmationDialog}
          closeConfirmationDialog={this.closeConfirmationDialog}
          discardChanges={this.discardChanges}
        />
        <div className="confetti-overlay">
          <Confetti
            active={ this.state.successfulSupport } 
            config={ confettiConfig } 
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: Store) => {
  return {
    artists: state.artists,
    me: state.me,
    posts: state.posts,
    authentication: state.authentication,
    subscriptions: state.subscriptions
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getArtist: bindActionCreators(getArtistAction, dispatch),
    openAuthModal: bindActionCreators(openAuthModalAction, dispatch),
  };
};

const Artist = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ArtistComponent);

export { Artist };
