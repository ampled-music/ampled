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
            <button className="home-artists__button btn btn-ampled center" onClick={() => openInNewTab(config.menuUrls.createArtist)}>
              Create Your Artist Page
            </button>
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
            <img className="home-artists__featured_image" src="https://res.cloudinary.com/ampled-web/image/upload/v1574456240/Zane6.png" />
            <div className="home-artists__featured_border"></div>
          </Link>
        </div>
        <div className="col-md-5 home-artists__featured_right">
          <div className="home-artists__featured_info">
            Thanks Light… is tough to pin down with a few sentences; our sound has evolved over the years but has always kept good songwriting and psychedelia at the fore-front of the creative process. Our cast of wild and talented characters has grown as well, however with each new transformation Thanks Light… finds new sonic ground to cultivate.
          </div>
          <Link to={`/artist/thankslight`} className="home-artists__featured_link">
            Explore Their Page
          </Link> &#10142;
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
