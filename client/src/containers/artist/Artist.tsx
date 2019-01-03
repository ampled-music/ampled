import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getArtistData } from '../../redux/ducks/get-artist';
import { Nav } from '../nav/Nav';
import { PostForm } from '../posts/PostForm';
import { PostsContainer } from '../posts/PostsContainer';
import { ConfirmationDialog } from '../shared/confirmation-dialog/ConfirmationDialog';
import { PostModal } from '../shared/post-modal/PostModal';
import { ArtistHeader } from './ArtistHeader';
import { ArtistInfo } from './ArtistInfo';

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
      location: string;
      posts: [];
      accent_color: string;
    };
  };
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
    this.props.getArtist(this.state.id);
  }

  getUserConfirmation = () => {
    this.setState({ showConfirmationDialog: true });
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
    const { artist } = this.props;
    const artistData = artist.artist;
    const loading = artist.loading;

    return loading ? (
      <span>Loading...</span>
    ) : (
      <div className="App">
        <Nav />
        <ArtistHeader
          name={artistData.name}
          id={artistData.id}
          accentColor={artistData.accent_color}
          openModal={this.openModal}
        />
        <ArtistInfo location={artistData.location} />
        <PostsContainer posts={artistData.posts} accentColor={artistData.accent_color} />

        <PostModal close={this.getUserConfirmation} open={this.state.openModal}>
          <PostForm artistId={artistData.id} close={this.getUserConfirmation} />
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
