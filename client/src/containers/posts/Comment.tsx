import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';

const Comment = ({ comment, isLogged, deleteComment } = this.props) => {
  return (
    <div key={`comment-${comment.id}`} id={`comment-${comment.id}`}>
      <b>{comment.author}</b>
      <span style={{ float: 'right' }}>{comment.created_ago} ago</span>
      <p>{comment.text}</p>
      {isLogged && (
        <span onClick={() => deleteComment(comment.id)}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </span>
      )}
    </div>
  );
};

export { Comment };
