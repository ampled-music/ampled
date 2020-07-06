import './blog.scss';

import * as React from 'react';

import { apiAxios } from '../../api/setup-axios';
import { Loading } from '../shared/loading/Loading';

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
    content: '',
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
        url: `http://cms.ampled.com/wp-json/wp/v2/posts?slug=${this.props.match.params.slug}`,
      });

      if (data[0].slug === this.props.match.params.slug) {
        this.setState({
          loading: false,
          title: data[0].title.rendered,
          content: data[0].content.rendered,
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
      <div className="container post">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h1
              className="post__title"
              dangerouslySetInnerHTML={{ __html: this.state.title }}
            />
            <div
              className="post__content"
              dangerouslySetInnerHTML={{ __html: this.state.content }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export { BlogPost };
