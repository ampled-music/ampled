import './post-container.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openAuthModalAction } from 'src/redux/authentication/authentication-modal';
import { createCommentAction } from 'src/redux/comments/create';
import { deleteCommentAction } from 'src/redux/comments/delete';
import { Store } from 'src/redux/configure-store';

import { initialState as authenticationInitialState } from '../../../redux/authentication/initial-state';
import { initialState as commentsInitialState } from '../../../redux/comments/initial-state';
import { Post } from './post/Post';

interface CommentProps {
  id: string;
  author: string;
  text: string;
  created_at: number;
  created_ago: string;
}

interface PostProps {
  id: string;
  author: string;
  title: string;
  body: string;
  comments: CommentProps[];
  created_at: number;
  created_ago: string;
}

interface PostsProps {
  posts: PostProps[];
  accentColor: string;
  authentication: typeof authenticationInitialState;
  updateArtist: Function;
  comments: typeof commentsInitialState;
  me: { id: number; artistPages: any[] };
  match: any;
  loggedUserAccess: { role: string; artistId: number };
  artistName: string;
  artistId: number;
}

type Dispatchers = ReturnType<typeof mapDispatchToProps>;

type Props = PostsProps & Dispatchers;

class PostsContainerComponent extends React.Component<Props, any> {
  handleExpandClick = () => {
    this.setState((state) => ({ expanded: !state.expanded }));
  };

  sortItemsByCreationDate(items) {
    return items.sort((a, b) => b.created_at - a.created_at);
  }

  renderPosts = () => {
    const { posts, accentColor, artistName, me, openAuthModal, artistId, loggedUserAccess } = this.props;

    if (!posts) {
      return null;
    }

    return this.sortItemsByCreationDate(posts).map((post) => (
      <div key={`post-${post.id}`} id={`post-${post.id}`} className="col-md-4">
        <Post
          me={me}
          post={post}
          accentColor={accentColor}
          artistName={artistName}
          artistId={artistId}
          loggedUserAccess={loggedUserAccess}
          openAuthModal={openAuthModal}
          addComment={this.props.addComment}
          deleteComment={this.props.deleteComment}
          updateArtist={this.props.updateArtist}
        />
      </div>
    ));
  };

  render() {
    return (
      <div className="post-container">
        <div className="container ">
          <div className="row justify-content-center">{this.renderPosts()}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: Store) => ({
  authentication: state.authentication,
  comments: state.comments,
  me: state.me.userData,
});

const mapDispatchToProps = (dispatch) => {
  return {
    addComment: bindActionCreators(createCommentAction, dispatch),
    openAuthModal: bindActionCreators(openAuthModalAction, dispatch),
    deleteComment: bindActionCreators(deleteCommentAction, dispatch),
  };
};

const PostsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostsContainerComponent);

export { PostsContainer };
