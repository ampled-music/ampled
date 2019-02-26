import { Dialog } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import * as React from 'react';
// import ReactPlayer from 'react-player';

import './video-modal.scss';
import { theme } from './theme';

class VideoModalComponent extends React.Component<any, any> {

  render() {

    return (
      <MuiThemeProvider theme={theme}>
        <Dialog open={this.props.open} aria-labelledby="form-dialog-title">
          <div className="videoStuff">
            {/* <ReactPlayer /> */}
          </div>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

const VideoModal = VideoModalComponent;

export { VideoModal };
