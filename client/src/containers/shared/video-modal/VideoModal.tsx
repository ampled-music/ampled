import * as React from 'react';

import { MuiThemeProvider } from '@material-ui/core/styles';
import { Dialog } from '@material-ui/core';

import ReactPlayer from 'react-player';

import './video-modal.scss';
import { theme } from './theme';

interface Props {
  open: boolean;
  onClose: Function;
  videoUrl: string;
}

class VideoModalComponent extends React.Component<Props, any> {

  render() {

    return (
      <MuiThemeProvider theme={theme}>
        <Dialog
          open={this.props.open}
          fullWidth={true}
          maxWidth={"md"}
          aria-labelledby="videoStuff"
          onClose={(e) => this.props.onClose(e)}
        >
          <div className="videoStuff">
            <ReactPlayer
              className='react-player'
              url={this.props.videoUrl}
              width='100%'
              height='100%'
              playing
            />
          </div>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

const VideoModal = VideoModalComponent;

export { VideoModal };
