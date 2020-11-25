import './home.scss';
import * as React from 'react';
import { ReactSVG } from 'react-svg';
import { Link } from 'react-router-dom';
import { apiAxios } from '../../api/setup-axios';

import { Image, Transformation } from 'cloudinary-react';
import { ArtistSearch } from '../shared/artist-search/ArtistSearch';
import StackGrid from 'react-stack-grid';

import tear from '../../images/full_page_tear.png';
import Location from '../../images/icons/Icon_Location.svg';

class HomeBrowse extends React.Component {
  state = {
    artistOwners: [],
    artists: [],
    artistsUnderConstruction: null,
    height: window.innerHeight,
    width: window.innerWidth,
    loading: true,
    canLoadMore: true,
    artistOwnersPage: 1,
    artistsPage: 1,
    seed: Math.random(),
  };

  constructor(props) {
    super(props);
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    this.loadArtistOwners(this.state.artistOwnersPage);
    this.loadArtists();
    window.addEventListener('resize', this.updateDimensions);
  }

  updateDimensions() {
    this.setState({
      height: window.innerHeight,
      width: window.innerWidth,
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
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

  loadArtists = async () => {
    const { data } = await apiAxios({
      method: 'get',
      url: `/artists/all_artists.json`,
    });
    this.setState({
      artists: [...this.state.artists, ...data.pages],
      artistsUnderConstruction: data.count,
    });
  };

  loadMoreArtistOwners = () => {
    this.loadArtistOwners(+this.state.artistOwnersPage + 1);
  };

  getArtistSections = (artists) => {
    if (artists.length === 0) {
      return [];
    }
    return Object.values(
      artists.reduce((acc, artist) => {
        let firstLetter = artist.name.charAt(0).toLocaleUpperCase();
        let isLetter = /[a-zA-Z]/.test(firstLetter);
        if (!isLetter) {
          if (!acc['Misc']) {
            acc['Misc'] = { title: 'Misc', artists: [artist] };
          } else {
            acc['Misc'].artists.push(artist);
          }
        } else if (!acc[firstLetter]) {
          acc[firstLetter] = { title: firstLetter, artists: [artist] };
        } else {
          acc[firstLetter].artists.push(artist);
        }
        return acc;
      }, {}),
    );
  };

  renderAllArtists = () => {
    const cleanArtists = this.getArtistSections(this.state.artists);
    return cleanArtists.map((group: any) => (
      <div
        className="home-artists__artists_all_group"
        key={`key-${group.title}`}
      >
        <h4>{group.title}</h4>
        {group.artists.map((artist) => (
          <Link
            to={`/artist/${artist.slug}`}
            className="name"
            key={`key-${artist.slug}`}
          >
            {artist.name}
          </Link>
        ))}
      </div>
    ));
  };

  renderStackedArtists = () => {
    let columnWidth;

    if (this.state.width <= 768) {
      columnWidth = '50%';
    } else if (this.state.width <= 1024) {
      columnWidth = '33.33%';
    } else {
      columnWidth = '20%';
    }

    return (
      <StackGrid
        columnWidth={columnWidth}
        gutterWidth={15}
        gutterHeight={15}
        monitorImagesLoaded={true}
      >
        {this.renderAllArtists()}
      </StackGrid>
    );
  };

  render() {
    const { artistOwners, loading, canLoadMore } = this.state;

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
        {this.state.artists.length > 0 && (
          <div>
            <img className="home-artists__tear" src={tear} alt="" />
            <div className="home-artists__artists">
              <div className="home-artists__artists_title">
                <h1>All Artists</h1>
                <h5>
                  {this.state.artistsUnderConstruction} Under Construction
                </h5>
              </div>
              <div className="container">
                <ArtistSearch imageSize={800} />
                <div className="home-artists__artists_all">
                  {this.renderStackedArtists()}
                </div>
              </div>
            </div>
          </div>
        )}
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
