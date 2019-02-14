import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getArtistData } from '../../redux/ducks/get-artist';
import { Nav } from '../nav/Nav';
import { ArtistHeader } from './ArtistHeader';
import { ArtistInfo } from './ArtistInfo';
import { PostsContainer } from '../posts/PostsContainer';
import { PostForm } from '../posts/PostForm';
import { PostModal } from '../shared/post-modal/PostModal';
import { ConfirmationDialog } from '../shared/confirmation-dialog/ConfirmationDialog';

interface Props {
  match: {
    params: {
      id: string;
    };
  };
  getArtist: Function;
  artist: {
    loading: boolean;
    artist: {
      name: string;
      id: number;
      accent_color: string;
      banner_image_url: string;
      // video_url: string;
      location: string;
      twitter_handle: string;
      instagram_handle: string;
      posts: [];
      owners: [];
      supporters: [];
    };
  };
  userAuthenticated: boolean;
}

class ArtistComponent extends React.Component<Props, any> {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      openModal: false,
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
    this.closeModal();
  };

  openModal = () => {
    this.setState({ openModal: true });
  };

  closeModal = () => {
    this.setState({ openModal: false });
  };

  render() {
    const { artist, userAuthenticated } = this.props;
    const artistData = artist.artist;
    const loading = artist.loading;

    return loading ? (
      <span>Loading...</span>
    ) : (
      <div className="App">
        <Nav />
        <ArtistHeader
          name={artistData.name}
          accentColor={artistData.accent_color}
          id={artistData.id}
          bannerImageUrl={artistData.banner_image_url}
          // videoUrl={artistData.video_url}
          owners={artistData.owners}
          supporters={artistData.supporters}
          openPostModal={this.openModal}
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
        <PostModal close={this.getUserConfirmation} open={this.state.openModal}>
          <PostForm
            artistId={artistData.id}
            close={this.getUserConfirmation}
            discardChanges={this.discardChanges}
            updateArtist={this.getArtistInfo}
          />
        </PostModal>
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
