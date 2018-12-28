import * as React from 'react';

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

  render() {
    return (
      <div className="container">
        <div className="row">
          {this.props.posts.map((post) => {
            return (
              <div className="col-md-4" style={{ border: `2px solid ${this.props.accentColor}` }} key={post.id}>
                <div>
                  <div>
                    <span>{post.author}</span>
                    <span style={{ float: 'right' }}>{post.created_ago} ago</span>
                  </div>
                  <h4>{post.title}</h4>
                </div>
                <p>{post.body}</p>
                <div>
                  {post.comments.map((comment) => {
                    return (
                      <div id={comment.id}>
                        <b>{comment.author}</b>
                        <span style={{ float: 'right' }}>{post.created_ago} ago</span>
                        <p>{comment.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export { PostsContainer };
