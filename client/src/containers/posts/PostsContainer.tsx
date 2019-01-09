import * as React from 'react';
import { Comment } from './Comment';
import { Post } from './Post';
import { CommentForm } from './CommentForm';

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
}

class PostsContainer extends React.Component<Props, any> {
  constructor(props) {
    super(props);
  }

  handleSubmit = (comment) => {
    alert(`Submitted - ${comment}`);
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          {this.props.posts.map((post) => {
            return (
              <div
                key={`post-${post.id}`}
                id={`post-${post.id}`}
                className="col-md-4"
                style={{ border: `2px solid ${this.props.accentColor}` }}
              >
                <Post post={post} />

                {post.comments.map((comment) => {
                  return <Comment comment={comment} />;
                })}

                <CommentForm handleSubmit={this.handleSubmit} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export { PostsContainer };
