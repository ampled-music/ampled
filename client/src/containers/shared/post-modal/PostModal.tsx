import { Button, Dialog, DialogActions, Divider } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import * as React from 'react';
import background from '../../../images/background_post.svg';

import './post-modal.scss';

const theme = createMuiTheme({
  overrides: {
    MuiPaper: {
      root: {
        background: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        paddingTop: '93px',
        backgroundColor: 'initial',
      },
      elevation24: {
        boxShadow: 'none',
      },
      rounded: {
        borderRadius: '0px',
      },
    },
    MuiDialog: {
      paperWidthSm: {
        maxWidth: '670px',
      },
    },
  },
  typography: {
    fontFamily: 'Courier, Courier New, monospace',
  },
});

class PostModalComponent extends React.Component<any, any> {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Dialog open={this.props.open} onClose={this.props.close} aria-labelledby="form-dialog-title">
          <div className="tabs">
            <Button className="selected">NEW POST</Button>
            <Button className="disabled">YOUR POSTS</Button>
          </div>
          <Divider />
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
      </MuiThemeProvider>
    );
  }
}

const PostModal = PostModalComponent;

export { PostModal };
