import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getArtistAction } from 'src/redux/artists/get-details';
import { Store } from 'src/redux/configure-store';

import { initialState as artistsInitialState } from '../../redux/artists/initial-state';
import { initialState as authenticateInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';
import { PostsContainer } from '../artist/posts/PostsContainer';
import { ConfirmationDialog } from '../shared/confirmation-dialog/ConfirmationDialog';
import { Modal } from '../shared/modal/Modal';
import { VideoModal } from '../shared/video-modal/VideoModal';
import { ArtistHeader } from './ArtistHeader';
import { ArtistInfo } from './ArtistInfo';
import { PostForm } from './posts/post-form/PostForm';
interface ArtistProps {
  match: {
    params: {
      id: string;
    };
  };
  artists: typeof artistsInitialState;
  me: typeof meInitialState;
  authentication: typeof authenticateInitialState;
}

type Dispatchers = ReturnType<typeof mapDispatchToProps>;
type Props = Dispatchers & ArtistProps;

class ArtistComponent extends React.Component<Props, any> {
  state = {
    openPostModal: false,
    openVideoModal: false,
    showConfirmationDialog: false,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getArtistInfo();
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.me.userData && this.props.me.userData) {
      this.getArtistInfo();
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

  render() {
    const { artists } = this.props;
    const artist = artists.artist;
    const loggedUserAccess = this.getLoggedUserPageAccess();

    return (
      <div className="App">
        <ArtistHeader
          artist={artist}
          openVideoModal={this.openVideoModal}
          openPostModal={this.openPostModal}
          loggedUserAccess={loggedUserAccess}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getArtist: bindActionCreators(getArtistAction, dispatch),
  };
};

const Artist = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ArtistComponent);

export { Artist };
