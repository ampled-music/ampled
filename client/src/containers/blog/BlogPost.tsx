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
      photo_url: '',
    },
    guest_author: {
      guest_by: '',
      guest_url: '',
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
        url: `https://cms.ampled.com/wp-json/wp/v2/posts?slug=${this.props.match.params.slug}&_embed`,
      });
      const content = data[0];

      if (content.slug === this.props.match.params.slug) {
        this.setState({
          loading: false,
          title: content.title.rendered,
          body: content.content.rendered,
          author: content._embedded.author[0].name,
          excerpt: content.custom_excerpt,
          date: content.date,
          featured_image: content.featured_image_url,
          photo_credit: {
            photo_by: content.acf.photo_by,
            photo_url: content.acf.photo_url,
          },
          guest_author: {
            guest_by: content.acf.guest_author,
            guest_url: content.acf.guest_url,
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
      return <Loading isLoading={true} />;
    }
    return (
      <div>
        {this.state.featured_image && (
          <div
            className="blog-post__featured-image"
            style={{ backgroundImage: `url(${this.state.featured_image})` }}
          ></div>
        )}
        <div
          className={
            this.state.featured_image
              ? 'container blog-post fi-margin'
              : 'container blog-post'
          }
        >
          <div className="blog-post__content">
            <h1
              className="blog-post__title"
              dangerouslySetInnerHTML={{ __html: this.state.title }}
            />
            {this.state.excerpt && (
              <div className="blog-post__excerpt">
                <p>{this.state.excerpt}</p>
              </div>
            )}

            <div className="blog-post__info">
              {this.state.guest_author.guest_by ? (
                <div className="blog-post__info_author">
                  {this.state.guest_author.guest_url ? (
                    <>
                      by{' '}
                      <a href={this.state.guest_author.guest_url}>
                        {this.state.guest_author.guest_by}
                      </a>
                    </>
                  ) : (
                    <>by {this.state.guest_author.guest_by}</>
                  )}
                </div>
              ) : (
                <div className="blog-post__info_author">
                  by {this.state.author}
                </div>
              )}

              <div className="blog-post__info_date">
                {Moment(this.state.date).format('MMMM Do, YYYY')}
              </div>
            </div>

            {this.state.photo_credit.photo_by && (
              <div className="blog-post__photo_credit">
                <ReactSVG className="icon icon_black" src={PhotoIcon} />
                {this.state.photo_credit.photo_url ? (
                  <a href={this.state.photo_credit.photo_url}>
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
