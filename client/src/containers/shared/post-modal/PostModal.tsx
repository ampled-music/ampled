import './post-modal.scss';

import * as React from 'react';
import { PostForm } from 'src/containers/posts/post-form/PostForm';

import { Dialog } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import { theme } from './theme';

interface Props {
  close: any;
  open: any;
  artistId: any;
  discardChanges: any;
  updateArtist: any;
}

export class PostModal extends React.Component<Props, any> {
  render() {
    const { artistId, close, discardChanges } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <Dialog open={this.props.open} aria-labelledby="form-dialog-title">
          <PostForm artistId={artistId} close={close} discardChanges={discardChanges} />
        </Dialog>
      </MuiThemeProvider>
    );
  }
}
