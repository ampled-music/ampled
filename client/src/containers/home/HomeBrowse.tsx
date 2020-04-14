import * as React from 'react';
import { Link } from 'react-router-dom';
import { apiAxios } from '../../api/setup-axios';
import { Image, Transformation } from 'cloudinary-react';

class HomeBrowse extends React.Component {
  state = {
    artists: [],
    loading: true,
    page: 1,
  };

  componentDidMount() {
    this.loadData(this.state.page);
  }

  loadData = async (page) => {
    this.setState({ loading: true });
    const { data } = await apiAxios({
      method: 'get',
      url: `/artists/browse.json?page=${page}`,
    });
    this.setState({
      loading: false,
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
    const { artists, loading } = this.state;
    const canLoadMore = artists.length % 6 === 0;

    const loadMore = (
      <a
        onClick={this.loadMore}
        className="home-artists__button btn btn-ampled center"
      >
        Load More
      </a>
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
            <div className="col-sm-6 col-md-4 home-artists__item" key={page.id}>
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
