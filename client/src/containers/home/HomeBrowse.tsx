import './home.scss';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { apiAxios } from '../../api/setup-axios';
import { Image, Transformation } from 'cloudinary-react';

class HomeBrowse extends React.Component {
  state = {
    artists: [],
    loading: true,
    canLoadMore: true,
    page: 1,
    seed: Math.random(),
  };

  componentDidMount() {
    this.loadData(this.state.page);
  }

  loadData = async (page) => {
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

  loadMore = () => {
    this.loadData(+this.state.page + 1);
  };

  handlePublicID = (image: string) => {
    const url = image.split('/');
    const part_1 = url[url.length - 2];
    const part_2 = url[url.length - 1];
    return part_1 + '/' + part_2;
  };

  render() {
    const { artists, loading, canLoadMore } = this.state;

    const loadMore = (
      <button
        onClick={this.loadMore}
        className="home-artists__button btn btn-ampled center"
      >
        Load More
      </button>
    );

    return (
      <div>
        <div className="home-artists">
          <h1 className="home-artists__title">All Artists</h1>
          <div className="container">
            <div className="row justify-content-center">
              {this.getArtistsList(artists)}
            </div>
            <div className="row justify-content-center">
              {canLoadMore && !loading ? loadMore : ''}
              {loading ? <div className="loading">Loading...</div> : ''}
            </div>
          </div>
        </div>
      </div>
    );
  }

  private getArtistsList(artistsPages: any) {
    return artistsPages && artistsPages.length
      ? artistsPages.map((page) => {
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
                    publicId={this.handlePublicID(page.image)}
                    key={page.image}
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
                <div className="home-artists__item_border"></div>
              </Link>
            </div>
          );
        })
      : '';
  }
}

export { HomeBrowse };
