import { Dialog } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import * as React from 'react';

import './video-modal.scss';
import { theme } from './theme';

class VideoModalComponent extends React.Component<any, any> {

  render() {

    return (
      <MuiThemeProvider theme={theme}>
        <Dialog open={this.props.open} aria-labelledby="form-dialog-title">
          <div className="videoStuff">
            
          </div>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

const VideoModal = VideoModalComponent;

export { VideoModal };
