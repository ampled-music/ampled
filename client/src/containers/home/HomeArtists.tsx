import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import { config } from '../../config';

import { artistsPages } from '../../redux/ducks/get-artists-pages';

interface Props {
  getArtistsPages: Function;
  artistsPages: {
    loading: boolean;
    pages: [];
  };
  bgColor: string;
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
      return <div className="loading">Loading Artists...</div>;
    }

    return (
      <div
        className="home-artists"
        style={{ backgroundColor: this.props.bgColor }}
      >
        <h1 className="home-artists__title">Featured Artists</h1>
        <div className="container">
          <div className="row justify-content-center">
            {this.getArtistsList(artistsPages)}
          </div>
          <div className="row">
            <a
              href={config.menuUrls.createArtist}
              className="home-artists__button btn btn-ampled center"
            >
              Create Your Artist Page
            </a>
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
          <div className="col-sm-6 col-md-4 home-artists__item" key={page.id}>
            <Link to={`/artist/${page.slug}`}>
              <div className="home-artists__item_title">{page.name}</div>
              <div
                className="home-artists__item_image_hover"
                style={{ backgroundColor: page.accent_color }}
              >
                <img
                  className="home-artists__item_image"
                  src={page.image}
                  alt={page.name}
                />
              </div>
              <div
                className="home-artists__item_border"
                style={{ borderColor: page.accent_color }}
              ></div>
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
