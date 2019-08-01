import * as React from 'react';

import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider } from '@material-ui/core';

const renderHeader = ({ author, createdDate }) => (
  <div className="comment__header">
    <span className="comment__header_name" >{author}</span>
    <span className="comment__header_date">{createdDate}</span>
  </div>
);

const renderBody = (text: string) => <div className="comment__copy">{text}</div>;

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
