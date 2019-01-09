import * as React from 'react';

const Post = ({ post, accentColor } = this.props) => {
  return (
    <div style={{ border: `2px solid ${accentColor}` }}>
      <div>
        <span>{post.author}</span>
        <span style={{ float: 'right' }}>{post.created_ago} ago</span>
      </div>
      <h4>{post.title}</h4>
      <p>{post.body}</p>
    </div>
  );
};

export { Post };
