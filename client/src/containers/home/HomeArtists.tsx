import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import { artistsPages } from '../../redux/ducks/get-artists-pages';

interface Props {
  getArtistsPages: Function;
  artistsPages: {
    loading: boolean;
    pages: [];
  };
}

interface State {
  artistPages: [];
}

class HomeArtistsComponent extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      artistPages: [],
    };
  }

  componentDidMount() {
    this.props.getArtistsPages();
  }

  render() {

    const loading = this.props.artistsPages.loading;
    const artistsPages = this.props.artistsPages.pages;

    if (loading) {
      return <span>Loading...</span>;
    }

    return (
      <div className="home-artists">
        <div className="container">
          {this.getArtistsList(artistsPages)}
        </div>
      </div>
    );
  }

  private getArtistsList(artistsPages: any) {
    return artistsPages.map((page) => {
      return (
        <div key={page.id}>
          <Link to={`/artists/${page.id}`}>{page.name}</Link>
        </div>
      );
    });
  }

}

const mapStateToProps = (state) => {
  return {
    artistsPages: state.pages,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getArtistsPages: bindActionCreators(artistsPages, dispatch),
  };
};

const HomeArtists = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeArtistsComponent);

export { HomeArtists };
