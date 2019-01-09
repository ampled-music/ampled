import * as React from 'react';

const Post = (postData) => {
  const { post } = postData;

  return (
    <div>
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
