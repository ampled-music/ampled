import { Button, Dialog, DialogActions, Divider } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import classnames from 'classnames';
import * as React from 'react';

import './post-modal.scss';
import { theme } from './theme';

class PostModalComponent extends React.Component<any, any> {
  tabs = {
    newPost: 'newPost',
    yourPosts: 'yourPosts',
  };

  state = {
    selectedTab: this.tabs.newPost,
  };

  selectTab = (name) => {
    this.setState({ selectedTab: name });
  };

  render() {
    const { newPost, yourPosts } = this.tabs;
    const { selectedTab } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <Dialog open={this.props.open} onClose={this.props.close} aria-labelledby="form-dialog-title">
          <div className="tabs">
            <Button
              className={classnames({
                selected: selectedTab === newPost,
                disabled: selectedTab !== newPost,
              })}
              onClick={() => this.selectTab(newPost)}
            >
              NEW POST
            </Button>
            <Button
              className={classnames({
                selected: selectedTab === yourPosts,
                disabled: selectedTab !== yourPosts,
              })}
              onClick={() => this.selectTab(yourPosts)}
            >
              YOUR POSTS
            </Button>
          </div>
          <Divider />
          {this.props.children}
          <DialogActions className="action-buttons">
            <Button className="cancel-button" onClick={this.props.close}>
              Cancel
            </Button>
            <Button className="post-button" onClick={this.props.close}>
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
