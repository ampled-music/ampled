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

  renderTwitter = () => {
    const { twitterHandle } = this.props;
    if ( twitterHandle ) {
      return (
        <div className="artist-info__social_twitter">
          <a
            href={`https://twitter.com/${twitterHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'black' }}
          >
            <FontAwesomeIcon className="icon" icon={faTwitter} />
            <span>@{twitterHandle}</span>
          </a>
        </div>
      );
    }
  };

  renderInstagram = () => {
    const { instagramHandle } = this.props;
    if ( instagramHandle ) {
      return (
        <div className="artist-info__social_instagram">
          <a
            href={`https://instagram.com/${instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'black' }}
          >
            <FontAwesomeIcon className="icon" icon={faInstagram} />
            <span>@{instagramHandle}</span>
          </a>
        </div>
      );
    }
  };

  renderSocialInfo = () => {
    return (
      <div className="artist-info__social">
        {this.renderTwitter()}
        {this.renderInstagram()}
      </div>
    );
  };

  render() {
    return (
      <div className="artist-info container">
        <div className="row justify-content-between">
          <div className="col-auto">{this.renderArtistLocation()}</div>
          <div className="col-auto col-md-6">{this.renderSocialInfo()}</div>
        </div>
      </div>
    );
  }
}
