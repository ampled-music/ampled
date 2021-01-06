import './blog.scss';

import * as React from 'react';

import { apiAxios } from '../../api/setup-axios';
import { Loading } from '../shared/loading/Loading';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import tear_1 from '../../images/home/home_tear_1.png';

interface PostsProps {
  match: {
    params: {
      slug: string;
    };
  };
}

class BlogPosts extends React.Component<PostsProps, any> {
  state = {
    posts: [],
    loading: true,
    page: 1,
  };

  componentDidMount = () => {
    this.loadPosts(this.state.page);
  };

  nextPage = () => {
    this.loadPosts(+this.state.page + 1);
  };

  prevPage = () => {
    if (this.state.page === 1) {
      return;
    }
    this.loadPosts(+this.state.page - 1);
  };

  loadPosts = async (page) => {
    try {
      this.setState({ loading: true });
      const { data } = await apiAxios({
        method: 'get',
        url: `https://cms.ampled.com/wp-json/wp/v2/posts?page=${page}&_embed`,
      });

      this.setState({
        loading: false,
        posts: data,
      });
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
      <div className="blog-posts">
        <div className="blog-posts__header">
          <h1>Blog Posts</h1>

          <img className="tear tear_1" src={tear_1} alt="" />
        </div>
        <div className="row">
          {this.state.posts.map(
            (post, index) =>
              index === 0 && (
                <div className="col-12 blog-posts__tease main" key={post.id}>
                  <div
                    className="blog-posts__tease_image"
                    style={{
                      backgroundImage: `url(${post.featured_image_url})`,
                    }}
                  />
                  <div className="container">
                    <div className="row">
                      <div className="blog-posts__info">
                        <Link to={`/blog/${post.slug}`}>
                          <h2
                            className="blog-posts__tease_title"
                            dangerouslySetInnerHTML={{
                              __html: post.title.rendered,
                            }}
                          />
                        </Link>
                        <div className="blog-posts__info_border">
                          {post.acf && post.acf.guest_author ? (
                            <div className="blog-posts__info_author">
                              {post.acf.guest_url ? (
                                <>
                                  by{' '}
                                  <a href={post.acf.guest_url}>
                                    {post.acf.guest_author}
                                  </a>
                                </>
                              ) : (
                                <>by {post.acf.guest_author}</>
                              )}
                            </div>
                          ) : (
                            <div className="blog-posts__info_author">
                              by {post._embedded.author[0].name}
                            </div>
                          )}
                          <div className="blog-posts__info_date">
                            <Moment format="MMMM Do, YYYY">{post.date}</Moment>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ),
          )}
          <div className="container">
            <div className="row">
              {this.state.posts.map(
                (post, index) =>
                  index > 0 && (
                    <div className="col-md-4 blog-posts__tease" key={post.id}>
                      <div
                        className="blog-posts__tease_image"
                        style={{
                          backgroundImage: `url(${post.featured_image_url})`,
                        }}
                      />
                      <Link to={`/blog/${post.slug}`}>
                        <div className="blog-posts__tease_border"></div>
                      </Link>
                      <div className="blog-posts__info">
                        <Link to={`/blog/${post.slug}`}>
                          <h4
                            className="blog-posts__tease_title"
                            dangerouslySetInnerHTML={{
                              __html: post.title.rendered,
                            }}
                          />
                        </Link>
                        {post.acf && post.acf.guest_author ? (
                          <div className="blog-posts__info_author">
                            {post.acf.guest_url ? (
                              <>
                                by{' '}
                                <a href={post.acf.guest_url}>
                                  {post.acf.guest_author}
                                </a>
                              </>
                            ) : (
                              <>by {post.acf.guest_author}</>
                            )}
                          </div>
                        ) : (
                          <div className="blog-posts__info_author">
                            by {post._embedded.author[0].name}
                          </div>
                        )}
                        <div className="blog-posts__info_date">
                          <Moment format="MMMM Do, YYYY">{post.date}</Moment>
                        </div>
                      </div>
                    </div>
                  ),
              )}
            </div>
          </div>
        </div>

        {this.state.page > 1 && (
          <button onClick={this.prevPage} className="btn btn-ampled">
            Prev Page
          </button>
        )}
        {this.state.posts.length === 10 && (
          <button onClick={this.nextPage} className="btn btn-ampled">
            Next Page
          </button>
        )}
      </div>
    );
  }
}

export { BlogPosts };
