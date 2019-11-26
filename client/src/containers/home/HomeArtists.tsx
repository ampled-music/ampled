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
    // const artistsPages = this.props.artistsPages.pages;

    if (loading) {
      return <div className="loading">Loading Artists...</div>;
    }

    return (
      <div className="home-artists" style={{ backgroundColor: this.props.bgColor }}>
        <h1 className="home-artists__title">Featured Artist</h1>
        <div className="container">
          <div className="row justify-content-center">
            {/* {this.getArtistsList(artistsPages)} */}
            {this.getFeaturedArtist()}
          </div>
          <div className="row">
            <a href={config.menuUrls.createArtist} className="home-artists__button btn btn-ampled center">
              Create Your Artist Page
            </a>
          </div>
        </div>
      </div>
    );
  }

  // private getArtistsList(artistsPages: any) {
  //   return (
  //     artistsPages &&
  //     artistsPages.length &&
  //     artistsPages.map((page) => {
  //       return (
  //         <div className="col-sm-6 col-md-4 home-artists__item" key={page.id}>
  //           <Link to={`/artists/${page.id}`}>
  //             <div className="home-artists__item_title">{page.name}</div>
  //             <div className="home-artists__item_image_hover" style={{ backgroundColor: page.accent_color }}>
  //               <img className="home-artists__item_image" src={page.banner_image_url} />
  //             </div>
  //             <div className="home-artists__item_border" style={{ borderColor: page.accent_color }} ></div>
  //           </Link>
  //         </div>
  //       );
  //     })
  //   );
  // }

  private getFeaturedArtist() {
    return (
      <div className="row justify-content-center home-artists__featured">
        <div className="col-md-5">
          <Link to={`/artist/thankslight`} className="home-artists__featured_left">
            <div className="home-artists__featured_title">Thanks Light...</div>
            <img
              className="home-artists__featured_image"
              src="https://res.cloudinary.com/ampled-web/image/upload/v1574456240/Zane6.png"
              alt="Thanks Light..."
            />
            <div className="home-artists__featured_border"></div>
          </Link>
        </div>
        <div className="col-md-5 home-artists__featured_right">
          <div className="home-artists__featured_info">
            Grown under a moontower, deep in the heart of Austin, Texas, Thanks Light is a mutant country, graveyard
            stomp, and drunken gospel group exploring the microcosms of psychedelic music. On Ampled, Thanks Light...
            are sharing demos of unreleased songs, alternate versions of album art, first dibs on exclusive merch, and
            behind the scenes footage.
          </div>
          <Link to={`/artist/thankslight`} className="home-artists__featured_link">
            Explore Their Page
          </Link>{' '}
          &#10142;
        </div>
      </div>
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
