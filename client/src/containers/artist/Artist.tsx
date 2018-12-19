import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Nav } from '../nav/Nav';
import { PostsContainer } from '../posts/PostsContainer';
import { ArtistHeader } from './ArtistHeader';
import { ArtistInfo } from './ArtistInfo';

import { getArtistData } from '../../redux/ducks/get-artist';

class ArtistComponent extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
    };
  }

  componentDidMount() {
    this.props.getArtist(this.state.id);
  }

  render() {
    const artist = this.props.artist.artist;
    const loading = this.props.artist.loading;

    return loading ? (
      <span>Loading...</span>
    ) : (
      <div className="App">
        <Nav />
        <ArtistHeader name={artist.name} id={artist.id} accentColor={artist.accent_color} />
        <ArtistInfo location={artist.location} />
        <PostsContainer posts={artist.posts} accentColor={artist.accent_color} />
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
