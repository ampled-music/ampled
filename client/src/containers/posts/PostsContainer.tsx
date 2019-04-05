import './post-container.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { addComment } from 'src/api/post/add-comment';
import { deleteComment } from 'src/api/post/delete-comment';

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
interface Props {
  posts: PostProps[];
  accentColor: string;
  authentication: {
    authenticated: boolean;
  };

  updateArtist: Function;
}

class PostsContainerComponent extends React.Component<Props, any> {
  constructor(props) {
    super(props);
  }

  handleSubmit = async (comment) => {
    await addComment(comment);
    this.props.updateArtist();
  };

  deleteComment = async (commentId) => {
    await deleteComment(commentId);
    this.props.updateArtist();
  };

  sortItemsByCreationDate(items) {
    return items.sort((a, b) => b.created_at - a.created_at);
  }

  renderComments = (post) => {
    const isLogged = this.props.authentication.authenticated;

    return (
      <div className="comments-list">
        <span>COMMENTS</span>
        {this.sortItemsByCreationDate(post.comments).map((comment) => {
          return <Comment key={comment.id} comment={comment} isLogged={isLogged} deleteComment={this.deleteComment} />;
        })}
        {isLogged && <CommentForm handleSubmit={this.handleSubmit} postId={post.id} />}
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

const mapStateToProps = (state) => ({
  authentication: state.authentication,
});

const PostsContainer = connect(mapStateToProps)(PostsContainerComponent);

export { PostsContainer };
