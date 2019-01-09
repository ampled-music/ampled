import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, Input, InputAdornment } from '@material-ui/core';
import * as React from 'react';

import './comment.scss';

interface Props {
  handleSubmit: Function;
}

class CommentForm extends React.Component<Props, any> {
  state = {
    comment: '',
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.handleSubmit(this.state.comment);
    this.setState({ comment: '' });
  };

  handleChange = (e) => {
    const { name, value } = e.target;

    this.setState({ [name]: value });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Input
          type="text"
          name="comment"
          value={this.state.comment}
          onChange={this.handleChange}
          inputProps={{
            maxLength: 2200,
          }}
          multiline
          rowsMax={5}
          fullWidth
          endAdornment={
            <InputAdornment className="sendCommentIcon" position="end">
              <IconButton type="submit" aria-label="Send comment" title="Send comment">
                <FontAwesomeIcon icon={faPaperPlane} size="xs" />
              </IconButton>
            </InputAdornment>
          }
        />
      </form>
    );
  }
}

export { CommentForm };
