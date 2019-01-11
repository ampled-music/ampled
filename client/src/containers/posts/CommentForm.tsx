import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, InputAdornment, InputBase } from '@material-ui/core';
import * as React from 'react';

import './comment.scss';

interface Props {
  handleSubmit: Function;
  postId: string;
}

class CommentForm extends React.Component<Props, any> {
  state = {
    comment: '',
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const comment = {
      postId: this.props.postId,
      text: this.state.comment,
    };

    this.props.handleSubmit(comment);
    this.setState({ comment: '' });
  };

  handleChange = (e) => {
    const { name, value } = e.target;

    this.setState({ [name]: value });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <InputBase
          type="text"
          name="comment"
          className="comment-input"
          value={this.state.comment}
          onChange={this.handleChange}
          inputProps={{
            maxLength: 2200,
          }}
          multiline
          rowsMax={5}
          fullWidth
          placeholder="Write a comment"
          required
          endAdornment={
            <InputAdornment className="sendCommentIcon" position="end">
              <IconButton type="submit" aria-label="Send comment" title="Send comment">
                <FontAwesomeIcon icon={faPaperPlane} />
              </IconButton>
            </InputAdornment>
          }
        />
      </form>
    );
  }
}

export { CommentForm };
