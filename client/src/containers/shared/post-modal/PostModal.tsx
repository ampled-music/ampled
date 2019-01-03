import { Button, Dialog, Divider } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import cx from 'classnames';
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
        <Dialog open={this.props.open} aria-labelledby="form-dialog-title">
          <div className="tabs">
            <Button
              className={cx({
                selected: selectedTab === newPost,
                disabled: selectedTab !== newPost,
              })}
              onClick={() => this.selectTab(newPost)}
            >
              NEW POST
            </Button>
            <Button
              className={cx({
                selected: selectedTab === yourPosts,
                disabled: selectedTab !== yourPosts,
              })}
              onClick={() => this.selectTab(yourPosts)}
              disabled
            >
              YOUR POSTS
            </Button>
          </div>
          <Divider />
          {this.props.children}
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

const PostModal = PostModalComponent;

export { PostModal };
