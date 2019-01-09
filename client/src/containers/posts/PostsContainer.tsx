import * as React from 'react';
import { connect } from 'react-redux';
import { addComment } from 'src/api/post/add-comment';
import { deleteComment } from 'src/api/post/delete-comment';
import { Comment } from './Comment';
import { CommentForm } from './CommentForm';
import { Post } from './Post';

interface CommentProps {
  id: string;
  author: string;
  text: string;
  created_ago: string;
}

interface PostProps {
  id: string;
  author: string;
  title: string;
  body: string;
  comments: CommentProps[];
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

  render() {
    const { accentColor, authentication, posts } = this.props;

    const isLogged = authentication.authenticated;

    return (
      <div className="container">
        <div className="row">
          {posts.map((post) => {
            return (
              <div
                key={`post-${post.id}`}
                id={`post-${post.id}`}
                className="col-md-4"
                style={{ border: `2px solid ${accentColor}` }}
              >
                <Post post={post} />

                {post.comments.map((comment) => {
                  return <Comment comment={comment} isLogged={isLogged} deleteComment={this.deleteComment} />;
                })}
                {isLogged && <CommentForm handleSubmit={this.handleSubmit} postId={post.id} />}
              </div>
            );
          })}
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
