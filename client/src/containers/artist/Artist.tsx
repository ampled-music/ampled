import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getArtistAction } from 'src/redux/artists/get-details';
import { Store } from 'src/redux/configure-store';

import { initialState as artistsInitialState } from '../../redux/artists/initial-state';
import { initialState as authenticateInitialState } from '../../redux/ducks/authenticate-initial-state';
import { Nav } from '../nav/Nav';
import { PostsContainer } from '../posts/PostsContainer';
import { ConfirmationDialog } from '../shared/confirmation-dialog/ConfirmationDialog';
import { PostModal } from '../shared/post-modal/PostModal';
import { VideoModal } from '../shared/video-modal/VideoModal';
import { ArtistHeader } from './ArtistHeader';
import { ArtistInfo } from './ArtistInfo';
interface ArtistProps {
  match: {
    params: {
      id: string;
    };
  };
  userAuthenticated: boolean;
  artists: typeof artistsInitialState;
}

type Dispatchers = ReturnType<typeof mapDispatchToProps>;
type Props = typeof authenticateInitialState & Dispatchers & ArtistProps;

class ArtistComponent extends React.Component<Props, any> {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      openPostModal: false,
      openVideoModal: false,
      showConfirmationDialog: false,
    };
  }

  componentDidMount() {
    this.getArtistInfo();
  }

  getArtistInfo = () => {
    this.props.getArtist(this.state.id);
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

  render() {
    const { artists, userAuthenticated } = this.props;
    const artistData = artists.artist;

    return (
      <div className="App">
        <Nav />
        <ArtistHeader
          artist={artistData}
          openVideoModal={this.openVideoModal}
          openPostModal={this.openPostModal}
          userAuthenticated={userAuthenticated}
        />
        <ArtistInfo
          location={artistData.location}
          accentColor={artistData.accent_color}
          twitterHandle={artistData.twitter_handle}
          instagramHandle={artistData.instagram_handle}
        />
        <PostsContainer
          posts={artistData.posts}
          accentColor={artistData.accent_color}
          updateArtist={this.getArtistInfo}
        />
        <PostModal
          close={this.getUserConfirmation}
          open={this.state.openPostModal}
          artistId={artistData.id}
          discardChanges={this.discardChanges}
          updateArtist={this.getArtistInfo}
        />
        <VideoModal open={this.state.openVideoModal} videoUrl={artistData.video_url} onClose={this.closeVideoModal} />
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
    userAuthenticated: state.authentication.authenticated,
    posts: state.posts,
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
