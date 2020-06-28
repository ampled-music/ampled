import './../artist/posts/post-container.scss';
import './../artist/posts/post/post.scss';

import * as React from 'react';

import { apiAxios } from '../../api/setup-axios';
import { Loading } from '../shared/loading/Loading';

class AboutUs extends React.Component<any> {
  state = {
    content: '',
    title: '',
    loading: true,
  };

  componentDidMount = () => {
    this.loadData();
  };

  loadData = async () => {
    this.setState({ loading: true });
    const { data } = await apiAxios({
      method: 'get',
      url: `http://3.17.10.215/wp-json/wp/v2/pages/21`,
    });
    console.log(data);
    this.setState({
      loading: false,
      title: data.title.rendered,
      content: data.content.rendered,
    });
  };

  render() {
    if (this.state.loading) {
      return <Loading artistLoading={true} />;
    }
    return (
      <div className="post-container">
        <h1>{this.state.title}</h1>
        <div
          className="container"
          dangerouslySetInnerHTML={{ __html: this.state.content }}
        ></div>
      </div>
    );
  }
}

export { AboutUs };
