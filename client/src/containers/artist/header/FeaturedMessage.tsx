import './artist-header.scss';

import * as React from 'react';
import TextTruncate from 'react-text-truncate';

interface Props {
  artist: any;
  openMessageModal: any;
}

export class FeaturedMessage extends React.Component<Props, any> {
  render() {
    const { artist } = this.props;

    if (artist.bio) {
      return (
        <div
          className="artist-header__message_container text-message"
          style={{ borderColor: artist.accent_color }}
        >
          <div className="artist-header__message_title">Message</div>
          <div className="artist-header__message_text">
            <TextTruncate
              line={5}
              element="span"
              truncateText="&#8230;"
              text={artist.bio}
              textTruncateChild={
                <span
                  className="read-more"
                  onClick={this.props.openMessageModal}
                >
                  &#8230;Read More
                </span>
              }
            />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}
