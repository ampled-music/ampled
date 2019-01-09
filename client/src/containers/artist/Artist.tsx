import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Nav } from '../nav/Nav';
import { PostsContainer } from '../posts/PostsContainer';
import { ArtistHeader } from './ArtistHeader';
import { ArtistInfo } from './ArtistInfo';

import { getArtistData } from '../../redux/ducks/get-artist';

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
    };
  }

  componentDidMount() {
    this.getArtistInfo();
  }

  getArtistInfo = () => {
    this.props.getArtist(this.state.id);
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
        <ArtistHeader name={artistData.name} id={artistData.id} accentColor={artistData.accent_color} />
        <ArtistInfo location={artistData.location} />
        <PostsContainer
          posts={artistData.posts}
          accentColor={artistData.accent_color}
          updateArtist={this.getArtistInfo}
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
