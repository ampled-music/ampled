import './artist-header.scss';

import * as React from 'react';
import { ReactSVG } from 'react-svg';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core/';
import Play from '../../../images/icons/Icon_Play.svg';

import tear from '../../../images/paper_header.png';

import { theme } from './theme';

interface Props {
  artist: any;
  openVideoModal: any;
}

export class FeaturedVideo extends React.Component<Props, any> {
  render() {
    const { artist } = this.props;

    const PlayButton = withStyles({
      root: {
        color: 'inherit',
        backgroundColor: 'inherit',
        '&:hover': {
          backgroundColor: 'inherit',
        },
      },
    })(IconButton);

    if (artist.video_url) {
      return (
        <MuiThemeProvider theme={theme}>
          <div
            className="artist-header__message_container video-message"
            style={{ borderColor: artist.accent_color }}
          >
            <PlayButton
              onClick={this.props.openVideoModal}
              className="artist-header__play"
              aria-label="Play video message"
            >
              <ReactSVG
                className="icon_white artist-header__play_svg "
                src={Play}
              />
            </PlayButton>
            <div className="artist-header__message_video">
              <img className="artist-header__message_tear" src={tear} alt="" />
              <div className="artist-header__message_image_container">
                <img
                  className="artist-header__message_image"
                  src={artist.video_screenshot_url}
                  alt="Video message thumbnail"
                />
              </div>
            </div>
          </div>
        </MuiThemeProvider>
      );
    } else {
      return null;
    }
  }
}
