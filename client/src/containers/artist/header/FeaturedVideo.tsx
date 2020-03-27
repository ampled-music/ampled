import './artist-header.scss';

import * as React from 'react';
import { IconButton } from '@material-ui/core/';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import tear from '../../../images/paper_header.png';

interface Props {
  artist: any;
  openVideoModal: any;
}

export class FeaturedVideo extends React.Component<Props, any> {
  renderVideoContainer = () => {
    const { artist } = this.props;

    if (artist.video_url) {
      return (
        <div>
          <div
            className="artist-header__message_container"
            style={{ borderColor: artist.accent_color }}
          >
            <IconButton
              onClick={this.props.openVideoModal}
              className="artist-header__play"
              aria-label="Play video message"
            >
              <FontAwesomeIcon
                className="artist-header__play_svg"
                icon={faPlay}
              />
            </IconButton>
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
        </div>
      );
    }
  };

  render() {
    return <div>{this.renderVideoContainer()}</div>;
  }
}
