import './comment.scss';

import * as React from 'react';
import { ReactSVG } from 'react-svg';

import Arrow from '../../../../images/icons/Icon_Arrow.svg';
import { InputAdornment, InputBase, Button } from '@material-ui/core';

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
      <form onSubmit={this.handleSubmit} className="action-buttons">
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
              <Button
                type="submit"
                aria-label="Send comment"
                title="Send comment"
                disabled={this.state.comment.length > 0 ? false : true}
                className="publish-button"
              >
                Post <ReactSVG className="icon" src={Arrow} />
              </Button>
            </InputAdornment>
          }
        />
      </form>
    );
  }
}

export { CommentForm };
