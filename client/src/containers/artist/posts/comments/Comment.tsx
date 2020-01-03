import * as React from 'react';

import tear from '../../../../images/background_tear.png';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider } from '@material-ui/core';
import { Modal } from '../../../shared/modal/Modal';

const renderHeader = ({ author, createdDate }) => (
  <div className="comment__header">
    <span className="comment__header_name">{author}</span>
    <span className="comment__header_date">{createdDate}</span>
  </div>
);

const renderBody = (text: string) => (
  <div className="comment__copy">{text}</div>
);

const renderDeleteModal = ({ deleteComment, commentId, setShowModal }) => (
  <div className="delete-post-modal__container">
    <img className="tear tear__topper" src={tear} alt="" />
    <div className="delete-post-modal">
      <div className="delete-post-modal__title">
        <h4>Are you sure?</h4>
      </div>
      <div className="delete-post-modal__actions action-buttons">
        <button className="cancel-button" onClick={() => setShowModal(false)}>
          Cancel
        </button>
        <button
          className="delete-button"
          onClick={() => {
            deleteComment(commentId);
            setShowModal(false);
          }}
        >
          Delete Comment
        </button>
      </div>
    </div>
  </div>
);

const renderDeleteButton = ({ setShowModal }) => (
  <span onClick={() => setShowModal(true)} className="comment__delete">
    <FontAwesomeIcon
      className="delete-icon"
      icon={faTrashAlt}
      title="Delete comment"
    />
  </span>
);

const Comment = ({ comment, canDelete, deleteComment } = this.props) => {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <div
      className="comment"
      key={`comment-${comment.id}`}
      id={`comment-${comment.id}`}
    >
      {renderHeader({
        author: comment.author,
        createdDate: comment.created_ago,
      })}
      {renderBody(comment.text)}
      {canDelete && renderDeleteButton({ setShowModal })}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        {renderDeleteModal({
          deleteComment,
          commentId: comment.id,
          setShowModal,
        })}
      </Modal>
      <Divider />
    </div>
  );
};

export { Comment };
