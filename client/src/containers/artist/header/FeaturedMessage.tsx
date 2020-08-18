import './artist-header.scss';

import * as React from 'react';
import cx from 'classnames';
import TextTruncate from 'react-text-truncate';
import paper_sm from '../../../images/backgrounds/background_paper_sm.png';
import paper_md from '../../../images/backgrounds/background_paper_md.png';

interface Props {
  artist: any;
  openMessageModal: any;
}

export class FeaturedMessage extends React.Component<Props, any> {
  renderMessageContainer = () => {
    const { artist } = this.props;
    const borderColor = artist.accent_color;

    if (artist.bio) {
      return (
        <div>
          <div
            className={cx('artist-header__message_container', {
              paper_md: !artist.video_url,
            })}
            style={{ borderColor: artist.accent_color }}
          >
            <div className="artist-header__message_text">
              <TextTruncate
                line={artist.video_url ? 5 : 9}
                element="span"
                truncateText="&#8230;"
                text={artist.bio}
              />
            </div>
            {artist.bio.length > 130 && (
              <button
                className="btn btn-ampled btn-read-more"
                style={{ borderColor }}
                onClick={this.props.openMessageModal}
              >
                Read More
              </button>
            )}
          </div>
        </div>
      );
    }
  };

  render() {
    return <div>{this.renderMessageContainer()}</div>;
  }
}
