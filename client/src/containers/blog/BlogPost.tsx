import './blog.scss';

import * as React from 'react';

import { apiAxios } from '../../api/setup-axios';
import { Loading } from '../shared/loading/Loading';
import Moment from 'moment';
import { ReactSVG } from 'react-svg';
import PhotoIcon from '../../images/icons/Icon_Photo.svg';

interface PostProps {
  match: {
    params: {
      slug: string;
    };
  };
}

class BlogPost extends React.Component<PostProps, any> {
  state = {
    title: '',
    body: '',
    author: '',
    excerpt: '',
    date: '',
    featured_image: '',
    photo_credit: {
      photo_by: '',
      site: '',
    },
    loading: true,
  };

  componentDidMount = () => {
    this.loadPost();
  };

  loadPost = async () => {
    try {
      this.setState({ loading: true });
      const { data } = await apiAxios({
        method: 'get',
        url: `http://cms.ampled.com/wp-json/wp/v2/posts?slug=${this.props.match.params.slug}&_embed`,
      });
      const content = data[0];

      if (content.slug === this.props.match.params.slug) {
        console.log(content);
        this.setState({
          loading: false,
          title: content.title.rendered,
          body: content.content.rendered,
          author: content._embedded.author[0].name,
          excerpt: content.excerpt.rendered,
          date: content.date,
          featured_image: content._embedded['wp:featuredmedia'][0].source_url,
          photo_credit: {
            photo_by: content.acf.photo_by,
            site: content.acf.site,
          },
        });
      }
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
    }
  };

  render() {
    if (this.state.loading) {
      return <Loading artistLoading={true} />;
    }
    return (
      <div>
        <div
          className="blog-post__featured-image"
          style={{ backgroundImage: `url(${this.state.featured_image})` }}
        ></div>
        <div className="container blog-post">
          <div className="blog-post__content">
            <h1
              className="blog-post__title"
              dangerouslySetInnerHTML={{ __html: this.state.title }}
            />
            {this.state.excerpt && (
              <div
                className="blog-post__excerpt"
                dangerouslySetInnerHTML={{ __html: this.state.excerpt }}
              />
            )}

            <div className="blog-post__info">
              <div className="blog-post__info_author">{this.state.author}</div>
              <div className="blog-post__info_date">
                {Moment(this.state.date).format('MMMM do, YYYY')}
              </div>
            </div>

            {this.state.photo_credit.photo_by && (
              <div className="blog-post__photo_credit">
                <ReactSVG className="icon icon_black" src={PhotoIcon} />
                {this.state.photo_credit.site ? (
                  <a href={this.state.photo_credit.site}>
                    {this.state.photo_credit.photo_by}
                  </a>
                ) : (
                  this.state.photo_credit.photo_by
                )}
              </div>
            )}
            <div
              className="blog-post__body"
              dangerouslySetInnerHTML={{ __html: this.state.body }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export { BlogPost };
