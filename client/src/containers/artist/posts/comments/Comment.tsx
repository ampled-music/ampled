import * as React from 'react';

import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider } from '@material-ui/core';

const Comment = ({ comment, isLogged, deleteComment } = this.props) => {
  return (
    <div className="comment" key={`comment-${comment.id}`} id={`comment-${comment.id}`}>
      <div className="comment-header">
        <b>{comment.author}</b>
        <span>{comment.created_ago} ago</span>
      </div>
      <p>{comment.text}</p>
      {isLogged && (
        <span onClick={() => deleteComment(comment.id)}>
          <FontAwesomeIcon className="delete-icon" icon={faTrashAlt} title="Delete comment" />
        </span>
      )}
      <Divider />
    </div>
  );
};

export { Comment };
