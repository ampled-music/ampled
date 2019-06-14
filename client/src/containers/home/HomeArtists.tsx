import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import { config } from 'src/config';

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


const openInNewTab = (url: string) => {
  var win = window.open(url, '_blank');
  win.focus();
};

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
      <div className="home-artists">
        <h1 className="home-artists__title">Artists on Ampled</h1>
        <div className="container">
          <div className="row">
            {this.getArtistsList(artistsPages)}
          </div>
          <div className="row">
            <button className="home-artists__button btn center" onClick={() => openInNewTab(config.menuUrls.createArtist)}>
              Create Your Artist Page
            </button>
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
            <Link to={`/artists/${page.id}`}>
              <div className="home-artists__item_title">{page.name}</div>
              <div className="home-artists__item_image_hover" style={{ backgroundColor: page.accent_color }}>
                <img className="home-artists__item_image" src={page.banner_image_url} />
              </div>
              <div className="home-artists__item_border" style={{ borderColor: page.accent_color }} ></div>
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
