import * as React from 'react';

import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider } from '@material-ui/core';

const renderHeader = ({ author, createdDate }) => (
  <div className="comment-header">
    <b>{author}</b>
    <span>{createdDate} ago</span>
  </div>
);

const renderBody = (text: string) => <p>{text}</p>;

const renderDeleteButton = ({ deleteComment, commentId }) => (
  <span onClick={() => deleteComment(commentId)}>
    <FontAwesomeIcon className="delete-icon" icon={faTrashAlt} title="Delete comment" />
  </span>
);

const Comment = ({ comment, canDelete, deleteComment } = this.props) => {
  return (
    <div className="comment" key={`comment-${comment.id}`} id={`comment-${comment.id}`}>
      {renderHeader({ author: comment.author, createdDate: comment.created_ago })}
      {renderBody(comment.text)}
      {canDelete && renderDeleteButton({ deleteComment, commentId: comment.id })}
      <Divider />
    </div>
  );
};

export { Comment };
