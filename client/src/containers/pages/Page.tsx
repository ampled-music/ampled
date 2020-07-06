import * as React from 'react';

import { apiAxios } from '../../api/setup-axios';
import { Loading } from '../shared/loading/Loading';

interface PageProps {
  match: {
    params: {
      slug: string;
    };
  };
}

class Page extends React.Component<PageProps, any> {
  state = {
    content: '',
    title: '',
    excerpt: '',
    loading: true,
  };

  componentDidMount = () => {
    this.loadPages();
  };

  loadPages = async () => {
    this.setState({ loading: true });
    const { data } = await apiAxios({
      method: 'get',
      url: `http://cms.ampled.com/wp-json/wp/v2/pages/`,
    });

    data.map(
      (page) =>
        page.slug === this.props.match.params.slug &&
        this.setState({
          loading: false,
          title: page.title.rendered,
          content: page.content.rendered,
          excerpt: page.excerpt.rendered,
        }),
    );
  };

  render() {
    if (this.state.loading) {
      return <Loading artistLoading={true} />;
    }
    return (
      <div className="page-container">
        <h1 className="page__title">{this.state.title}</h1>
        <div
          className="page__content"
          dangerouslySetInnerHTML={{ __html: this.state.content }}
        ></div>
      </div>
    );
  }
}

export { Page };
