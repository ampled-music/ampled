import './page.scss';

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
    try {
      this.setState({ loading: true });
      const { data } = await apiAxios({
        method: 'get',
        url: `https://cms.ampled.com/wp-json/wp/v2/pages?slug=${this.props.match.params.slug}`,
      });
      if (data[0].slug === this.props.match.params.slug) {
        this.setState({
          loading: false,
          title: data[0].title.rendered,
          content: data[0].content.rendered,
          excerpt: data[0].excerpt.rendered,
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
      <div className="container page">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h1 className="page__title">{this.state.title}</h1>
            <div
              className="page__content"
              dangerouslySetInnerHTML={{ __html: this.state.content }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export { Page };
