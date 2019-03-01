import * as React from 'react';

import { MuiThemeProvider } from '@material-ui/core/styles';
import { Dialog } from '@material-ui/core';

import ReactPlayer from 'react-player';

import './video-modal.scss';
import { theme } from './theme';

class VideoModalComponent extends React.Component<any, any> {

  render() {

    return (
      <MuiThemeProvider theme={theme}>
        <Dialog
          open={this.props.open} 
          fullWidth={true} 
          maxWidth={"md"} 
          aria-labelledby="videoStuff"
        >
          <div className="videoStuff">
            <ReactPlayer
              className='react-player'
              url='https://www.youtube.com/watch?v=PTFwQP86BRs'
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
