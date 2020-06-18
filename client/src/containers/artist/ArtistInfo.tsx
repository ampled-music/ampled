import * as React from 'react';
import { ReactSVG } from 'react-svg';

import Instagram from '../../images/icons/Icon_Instagram.svg';
import Twitter from '../../images/icons/Icon_Twitter.svg';
import Location from '../../images/icons/Icon_Location.svg';

interface Props {
  location: string;
  twitterHandle: string;
  instagramHandle: string;
  accentColor: string;
}

export class ArtistInfo extends React.Component<Props, any> {
  renderArtistLocation = () => (
    <div className="artist-info__location">
      <ReactSVG className="icon icon_black" src={Location} />
      {this.props.location}
    </div>
  );

  renderTwitter = () => {
    const { twitterHandle } = this.props;
    if (twitterHandle) {
      return (
        <div className="artist-info__social_twitter">
          <a
            href={`https://twitter.com/${twitterHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'black' }}
            aria-label={`${twitterHandle} on Twitter`}
          >
            <ReactSVG className="icon icon_black" src={Twitter} />
            <span>@{twitterHandle}</span>
          </a>
        </div>
      );
    }
  };

  renderInstagram = () => {
    const { instagramHandle } = this.props;
    if (instagramHandle) {
      return (
        <div className="artist-info__social_instagram">
          <a
            href={`https://instagram.com/${instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'black' }}
            aria-label={`${instagramHandle} on Instagram`}
          >
            <ReactSVG className="icon icon_black" src={Instagram} />
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
