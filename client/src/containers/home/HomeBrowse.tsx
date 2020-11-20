import './home.scss';
import * as React from 'react';
import { ReactSVG } from 'react-svg';
import { Link } from 'react-router-dom';
import { apiAxios } from '../../api/setup-axios';

import { Image, Transformation } from 'cloudinary-react';
import { ArtistSearch } from '../shared/artist-search/ArtistSearch';

import tear from '../../images/full_page_tear.png';
import Location from '../../images/icons/Icon_Location.svg';

class HomeBrowse extends React.Component {
  state = {
    artistOwners: [],
    artists: [],
    loading: true,
    canLoadMore: true,
    artistOwnersPage: 1,
    artistsPage: 1,
    seed: Math.random(),
  };

  componentDidMount() {
    this.loadArtistOwners(this.state.artistOwnersPage);
    this.loadArtists(this.state.artistsPage);
  }

  loadArtistOwners = async (page) => {
    let { canLoadMore } = this.state;
    this.setState({ loading: true });
    const {
      data: { pages: data },
    } = await apiAxios({
      method: 'get',
      url: `/artists/browse.json?page=${page}&seed=${this.state.seed}&artist_owners`,
    });
    if (data.length < 8) {
      canLoadMore = false;
    }
    this.setState({
      loading: false,
      canLoadMore,
      artistOwners: [...this.state.artistOwners, ...data],
      page,
    });
  };

  loadArtists = async (page) => {
    let { canLoadMore } = this.state;
    this.setState({ loading: true });
    const {
      data: { pages: data },
    } = await apiAxios({
      method: 'get',
      url: `/artists/browse.json?page=${page}&seed=${this.state.seed}`,
    });
    if (data.length < 8) {
      canLoadMore = false;
    }
    this.setState({
      loading: false,
      canLoadMore,
      artists: [...this.state.artists, ...data],
      page,
    });
  };

  loadMoreArtistOwners = () => {
    this.loadArtistOwners(+this.state.artistOwnersPage + 1);
  };

  render() {
    const { artists, artistOwners, loading, canLoadMore } = this.state;

    const loadMore = (
      <button
        onClick={this.loadMoreArtistOwners}
        className="home-artists__button btn btn-ampled center"
      >
        View More
      </button>
    );

    return (
      <div className="home-artists">
        <div className="home-artists__owners">
          <h1 className="home-artists__title">Artists Owners</h1>
          <div className="container">
            <div className="row justify-content-center">
              {this.getArtistList(artistOwners)}
            </div>
            <div className="row justify-content-center">
              {canLoadMore && !loading ? loadMore : ''}
              {loading ? <div className="loading">Loading...</div> : ''}
            </div>
          </div>
        </div>
        <img className="home-artists__tear" src={tear} alt="" />
        <div className="home-artists__artists">
          <h1 className="home-artists__title">All Artists</h1>
          <div className="container">
            <ArtistSearch imageSize={800} />

            <div className="row justify-content-center">
              {artists &&
                artists.length > 0 &&
                artists.map((page) => (
                  <div className="home-artists__artists_artist col-3">
                    <Link to={`/artist/${page.slug}`}>{page.name}</Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  private getArtistList(artistsPages: any) {
    return (
      artistsPages &&
      artistsPages.length > 0 &&
      artistsPages.map((page) => (
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
            </div>
            <div className="home-artists__item_location">
              <ReactSVG className="icon icon_black icon_sm" src={Location} />
              {page.location}
            </div>
            <div className="home-artists__item_border"></div>
          </Link>
        </div>
      ))
    );
  }
}

export { HomeBrowse };
