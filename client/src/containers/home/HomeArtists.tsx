import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import { config } from '../../config';
import { Image, Transformation } from 'cloudinary-react';

import { artistsPages } from '../../redux/ducks/get-artists-pages';
import tear_2 from '../../images/home/home_tear_2.png';

interface Props {
  getArtistsPages: Function;
  artistsPages: {
    loading: boolean;
    pages: {
      pages: [];
      count: number;
    };
  };
}

class HomeArtistsComponent extends React.Component<Props> {
  componentDidMount() {
    this.props.getArtistsPages();
  }

  render() {
    const loading = this.props.artistsPages.loading;
    const artistsPages = this.props.artistsPages.pages.pages;
    const artistCount = this.props.artistsPages.pages.count;

    if (loading) {
      return <div className="loading">Loading Artists...</div>;
    }

    return (
      <div>
        <img className="tear tear_2" src={tear_2} alt="" />
        <div className="home-artists">
          <h1 className="home-artists__title">
            Join {artistCount} artists on Ampled
          </h1>
          <hr className="hr__thick" />
          <h3 className="home-artists__sub-title">Artist Owners</h3>
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
      </div>
    );
  }

  private getArtistsList(artistsPages: any) {
    return (
      artistsPages &&
      artistsPages.length &&
      artistsPages.map((page) => {
        return (
          <div className="col-sm-6 col-md-3 home-artists__item" key={page.id}>
            <Link to={`/artist/${page.slug}`}>
              <div className="home-artists__item_title">{page.name}</div>
              <div
                className="home-artists__item_image_hover"
                style={{ backgroundColor: page.accent_color }}
              >
                <Image
                  className="home-artists__item_image"
                  publicId={page.cloudinaryImage.public_id}
                  key={page.cloudinaryImage.id}
                >
                  <Transformation
                    fetchFormat="auto"
                    quality="auto"
                    crop="fill"
                    width={800}
                    height={800}
                    responsive_placeholder="blank"
                  />
                </Image>

                {/* <img src={page.image} alt={page.name} /> */}
              </div>
              <div className="home-artists__item_border"></div>
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
