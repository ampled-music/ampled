import * as React from 'react';

import tear from '../../../../images/backgrounds/background_tear.png';
import Remove from '../../../../images/icons/Icon_Remove-Delete.svg';
import { Divider, Button, IconButton } from '@material-ui/core';
import { Modal } from '../../../shared/modal/Modal';
import Linkify from 'react-linkify';

const renderHeader = ({ author, createdDate }) => (
  <div className="comment__header">
    <span className="comment__header_name">{author}</span>
    <span className="comment__header_date">{createdDate}</span>
  </div>
);

const renderBody = (text: string) => (
  <div className="comment__copy">
    <Linkify
      componentDecorator={(
        decoratedHref: string,
        decoratedText: string,
        key: number,
      ) => (
        <a
          href={decoratedHref}
          key={key}
          target="_blank"
          rel="noopener noreferrer"
        >
          {decoratedText}
        </a>
      )}
    >
      {text}
    </Linkify>
  </div>
);

const renderDeleteModal = ({ deleteComment, commentId, setShowModal }) => (
  <div className="delete-post-modal__container">
    <img className="tear tear__topper" src={tear} alt="" />
    <div className="delete-post-modal">
      <div className="delete-post-modal__title">
        <h4>Are you sure?</h4>
      </div>
      <div className="delete-post-modal__actions action-buttons">
        <Button className="cancel-button" onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button
          className="delete-button"
          onClick={() => {
            deleteComment(commentId);
            setShowModal(false);
          }}
        >
          Delete Comment
        </Button>
      </div>
    </div>
  </div>
);

const renderDeleteButton = ({ setShowModal }) => (
  <IconButton onClick={() => setShowModal(true)} className="comment__delete">
    <img className="delete-icon" src={Remove} title="Delete comment" />
  </IconButton>
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
