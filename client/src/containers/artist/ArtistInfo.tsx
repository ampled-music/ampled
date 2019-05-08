import * as React from 'react';

import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  location: string;
  twitterHandle: string;
  instagramHandle: string;
  accentColor: string;
}

export class ArtistInfo extends React.Component<Props, any> {
  renderArtistLocation = () => (
    <div className="artist-info__location">
      <FontAwesomeIcon className="icon" icon={faMapMarkerAlt} />
      {this.props.location}
    </div>
  );

  renderSocialInfo = () => {
    const { accentColor, instagramHandle, twitterHandle } = this.props;

    return (
      <div className="artist-info__social">
        <div className="artist-info__social_twitter">
          <FontAwesomeIcon className="icon" icon={faTwitter} />
          <a href="https://twitter.com/{twitterHandle}" target="_blank" style={{ color: accentColor }}>
            {twitterHandle}
          </a>
        </div>
        <div className="artist-info__social_instagram">
          <FontAwesomeIcon className="icon" icon={faInstagram} />
          <a href="https://instagram.com/{instagramHandle}" target="_blank" style={{ color: accentColor }}>
            {instagramHandle}
          </a>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="artist-info container">
        <div className="row justify-content-between">
          <div className="col-sm-6">{this.renderArtistLocation()}</div>
          <div className="col-sm-6">{this.renderSocialInfo()}</div>
        </div>
      </div>
    );
  }
}
