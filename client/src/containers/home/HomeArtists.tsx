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
      <div className="home-artists bg-texture bg-texture__flip">
        <h1 className="home-artists__title">Artists on Ampled</h1>
        <div className="container">
          <div className="row">
            {this.getArtistsList(artistsPages)}
          </div>
        </div>
      </div>
    );
  }

  private getArtistsList(artistsPages: any) {
    return (
      artistsPages &&
      artistsPages.length &&
      artistsPages.map((page) => {
        return (
          <div className="col-md-4" key={page.id}>
            <Link to={`/artists/${page.id}`}>
              <div className="home-artists__item" style={{ borderColor: page.accent_color }} key={page.id}>
                <div className="home-artists__item_title">{page.name}</div>
                <img className="home-artists__item_image" src={page.banner_image_url} />
              </div>
            </Link>
          </div>
        );
      })
    );
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
