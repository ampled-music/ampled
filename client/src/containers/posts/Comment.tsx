import * as React from 'react';

const Comment = (commentData) => {
  const { comment } = commentData;

  return (
    <div key={`comment-${comment.id}`} id={`comment-${comment.id}`}>
      <b>{comment.author}</b>
      <span style={{ float: 'right' }}>{comment.created_ago} ago</span>
      <p>{comment.text}</p>
    </div>
  );
};

export { Comment };
