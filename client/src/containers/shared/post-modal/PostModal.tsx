import { Button, Dialog, DialogActions } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import * as React from 'react';

// import './post-modal.scss';

// const styles = {
//   dialogContainer: {
//     backgroundImage: 'url(../../../images/background_post.svg)',
//     backgroundRepeat: 'no-repeat',
//     paddingTop: '93px',
//   },
// };

const theme = createMuiTheme({
  overrides: {
    // Name of the component ⚛️ / style sheet
    MuiPaper: {
      // Name of the rule
      root: {
        // Some CSS
        background: "url('../../../images/background_post.svg')",
        backgroundRepeat: 'no-repeat',
      },
      elevation24: {
        boxShadow: 'none',
      },
    },
  },
  typography: { useNextVariants: true },
});

class PostModalComponent extends React.Component<any, any> {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
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
      </MuiThemeProvider>
    );
  }
}

const PostModal = PostModalComponent;

export { PostModal };
