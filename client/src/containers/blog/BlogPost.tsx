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
    content: '',
    title: '',
    excerpt: '',
    loading: true,
  };

  componentDidMount = () => {
    this.loadPost();
  };

  loadPost = async () => {
    this.setState({ loading: true });
    const { data } = await apiAxios({
      method: 'get',
      url: `http://cms.ampled.com/wp-json/wp/v2/post/`,
    });

    data.map(
      (post) =>
        post.slug === this.props.match.params.slug &&
        this.setState({
          loading: false,
          title: post.title.rendered,
          content: post.content.rendered,
          excerpt: post.excerpt.rendered,
        }),
    );
  };

  render() {
    if (this.state.loading) {
      return <Loading artistLoading={true} />;
    }
    return (
      <div className="page-container">
        <h1 className="post__title">{this.state.title}</h1>
        <div
          className="post__content"
          dangerouslySetInnerHTML={{ __html: this.state.content }}
        ></div>
      </div>
    );
  }
}

export { BlogPost };
