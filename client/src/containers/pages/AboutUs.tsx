import './../artist/posts/post-container.scss';
import './../artist/posts/post/post.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import { Link } from 'react-router-dom';

import { Store } from '../../redux/configure-store';

import { showToastAction } from '../../redux/toast/toast-modal';
import { createCommentAction } from '../../redux/comments/create';
import { deleteCommentAction } from '../../redux/comments/delete';
// import { Post } from '../artist/posts/post/Post';

import { apiAxios } from '../../api/setup-axios';
import { Loading } from '../shared/loading/Loading';

class AboutUs extends React.Component<any> {
  state = {
    content: '',
    title: '',
    loading: true,
    page: 1,
  };

  componentDidMount = () => {
    this.loadData(this.state.page);
  };

  nextPage = () => {
    this.loadData(+this.state.page + 1);
  };

  prevPage = () => {
    if (this.state.page === 1) {
      return;
    }
    this.loadData(+this.state.page - 1);
  };

  loadData = async (page) => {
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
      <div
        className="post-container"
        style={{ maxWidth: '525px', width: '525px', margin: '0 auto' }}
      >
        <h1
          style={{
            textAlign: 'center',
            fontFamily: "'LL Replica Bold Web', sans-serif",
          }}
        >
          POSTS
        </h1>
        <div
          className="container"
          dangerouslySetInnerHTML={{ __html: this.state.content }}
        ></div>
      </div>
    );
  }
}

const mapStateToProps = (state: Store) => {
  return {
    me: state.me,
  };
};

const mapDispatchToProps = (dispatch) => ({
  showToast: bindActionCreators(showToastAction, dispatch),
  addComment: bindActionCreators(createCommentAction, dispatch),
  deleteComment: bindActionCreators(deleteCommentAction, dispatch),
});

const connectAboutUs = connect(mapStateToProps, mapDispatchToProps)(AboutUs);

export { connectAboutUs as AboutUs };
