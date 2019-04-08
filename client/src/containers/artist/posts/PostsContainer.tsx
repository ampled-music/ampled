import './post-container.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createCommentAction } from 'src/redux/comments/create';
import { deleteCommentAction } from 'src/redux/comments/delete';
import { Store } from 'src/redux/configure-store';

import { initialState as authenticationInitialState } from '../../../redux/authentication/initial-state';
import { initialState as commentsInitialState } from '../../../redux/comments/initial-state';
import { Comment } from './comments/Comment';
import { CommentForm } from './comments/CommentForm';
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
}

type Dispatchers = ReturnType<typeof mapDispatchToProps>;

type Props = PostsProps & Dispatchers;

class PostsContainerComponent extends React.Component<Props, any> {
  handleSubmit = async (comment) => {
    await this.props.addComment(comment);
    this.props.updateArtist();
  };

  deleteComment = async (commentId) => {
    await this.props.deleteComment(commentId);
    this.props.updateArtist();
  };

  sortItemsByCreationDate(items) {
    return items.sort((a, b) => b.created_at - a.created_at);
  }

  renderComments = (post) => {
    const hasCommentAccess = this.props.authentication.token;

    return (
      <div className="comments-list">
        <span>COMMENTS</span>
        {this.sortItemsByCreationDate(post.comments).map((comment) => {
          return (
            <Comment
              key={comment.id}
              comment={comment}
              canDelete={hasCommentAccess}
              deleteComment={this.deleteComment}
            />
          );
        })}
        {hasCommentAccess && <CommentForm handleSubmit={this.handleSubmit} postId={post.id} />}
      </div>
    );
  };

  renderPosts = () => {
    const { posts, accentColor } = this.props;

    if (!posts) {
      return null;
    }

    return this.sortItemsByCreationDate(posts).map((post) => (
      <div key={`post-${post.id}`} id={`post-${post.id}`} className="col-md-4">
        <Post post={post} accentColor={accentColor} />
        {this.renderComments(post)}
      </div>
    ));
  };

  render() {
    return (
      <div className="post-container">
        <div className="container ">
          <div className="row">{this.renderPosts()}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: Store) => ({
  authentication: state.authentication,
  comments: state.comments,
});

const mapDispatchToProps = (dispatch) => {
  return {
    addComment: bindActionCreators(createCommentAction, dispatch),
    deleteComment: bindActionCreators(deleteCommentAction, dispatch),
  };
};

const PostsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostsContainerComponent);

export { PostsContainer };
