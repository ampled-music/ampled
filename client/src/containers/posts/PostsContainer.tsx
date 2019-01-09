import * as React from 'react';
import { connect } from 'react-redux';
import { addComment } from 'src/api/post/add-comment';
import { Comment } from './Comment';
import { CommentForm } from './CommentForm';
import { Post } from './Post';

interface Comment {
  id: string;
  author: string;
  text: string;
}

interface Post {
  id: string;
  author: string;
  title: string;
  body: string;
  comments: Comment[];
  created_ago: string;
}
interface Props {
  posts: Post[];
  accentColor: string;
  authentication: {
    authenticated: boolean;
  };
}

class PostsContainerComponent extends React.Component<Props, any> {
  constructor(props) {
    super(props);
  }

  handleSubmit = async (comment) => {
    await addComment(comment);
  };

  render() {
    const { accentColor, authentication, posts } = this.props;

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
                  return <Comment comment={comment} />;
                })}
                {authentication.authenticated && <CommentForm handleSubmit={this.handleSubmit} postId={post.id} />}
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
