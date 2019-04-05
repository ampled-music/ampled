import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getArtistData } from '../../redux/ducks/get-artist';
import { Nav } from '../nav/Nav';
import { PostsContainer } from '../posts/PostsContainer';
import { ConfirmationDialog } from '../shared/confirmation-dialog/ConfirmationDialog';
import { PostModal } from '../shared/post-modal/PostModal';
import { VideoModal } from '../shared/video-modal/VideoModal';
import { ArtistHeader } from './ArtistHeader';
import { ArtistInfo } from './ArtistInfo';

export interface ArtistModel {
  name: string;
  id: number;
  accent_color: string;
  video_url: string;
  video_screenshot_url: string;
  location: string;
  twitter_handle: string;
  instagram_handle: string;
  posts: [];
  images: [];
  owners: OwnersProps[];
  supporters: SupportersProps[];
}

interface OwnersProps {
  id: string;
  name: string;
  profile_image_url: string;
}
interface SupportersProps {
  id: string;
  name: string;
  profile_image_url: string;
}
interface Props {
  match: {
    params: {
      id: string;
    };
  };
  getArtist: Function;
  artist: { artist: ArtistModel; loading: boolean };
  userAuthenticated: boolean;
}

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
    const { artist, userAuthenticated } = this.props;
    const artistData = artist.artist;

    if (artist.loading) {
      return <span>Loading...</span>;
    }

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

const mapStateToProps = (state) => {
  return {
    artist: state.artist,
    userAuthenticated: state.authentication.authenticated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getArtist: bindActionCreators(getArtistData, dispatch),
  };
};

const Artist = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ArtistComponent);

export { Artist };
