import { Button, DialogActions } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import * as React from 'react';

class PostModal extends React.Component<any, any> {
  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.close} aria-labelledby="form-dialog-title">
        {this.props.children}
        <DialogActions>
          <Button onClick={this.props.close} color="primary">
            Cancel
          </Button>
          <Button onClick={this.props.close} color="primary">
            Post
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export { PostModal };
