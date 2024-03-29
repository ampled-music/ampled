import * as React from 'react';

import { MuiThemeProvider } from '@material-ui/core/styles';
import { Dialog } from '@material-ui/core';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import IconButton from '@material-ui/core/IconButton';
import Close from '../../../images/icons/Icon_Close-Cancel.svg';
import { ReactSVG } from 'react-svg';

import YouTubePlayer from 'react-player/youtube';
import VimeoPlayer from 'react-player/vimeo';

import './video-modal.scss';
import { theme } from './theme';

interface Props {
  open: boolean;
  onClose: Function;
  videoUrl: string;
  fullScreen: boolean;
}

class VideoModalComponent extends React.Component<Props, any> {
  render() {
    let VideoComponent;
    if (/vimeo/i.test(this.props.videoUrl)) {
      VideoComponent = VimeoPlayer;
    } else if (/youtu/i.test(this.props.videoUrl)) {
      VideoComponent = YouTubePlayer;
    }

    return (
      <MuiThemeProvider theme={theme}>
        <Dialog
          open={this.props.open}
          fullWidth={true}
          fullScreen={this.props.fullScreen}
          maxWidth={'md'}
          aria-labelledby="video"
          onClose={(e) => this.props.onClose(e)}
        >
          <div className="video">
            {this.props.videoUrl && (
              <VideoComponent
                className="react-player"
                url={this.props.videoUrl}
                width="100%"
                height="100%"
                playing
              />
            )}
          </div>
          {this.props.fullScreen && (
            <IconButton
              className="fullscreen-close"
              aria-label="close"
              onClick={(e) => this.props.onClose(e)}
            >
              <ReactSVG className="icon" src={Close} />
            </IconButton>
          )}
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

const VideoModal = withMobileDialog()(VideoModalComponent);

export { VideoModal };
