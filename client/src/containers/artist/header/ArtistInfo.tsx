import * as React from 'react';
import { ReactSVG } from 'react-svg';

import Instagram from '../../../images/icons/Icon_Instagram.svg';
import Twitter from '../../../images/icons/Icon_Twitter.svg';
import Bandcamp from '../../../images/icons/Icon_Bandcamp.svg';
import Youtube from '../../../images/icons/Icon_Youtube.svg';
import Link1 from '../../../images/icons/Icon_Link_1.svg';
import Location from '../../../images/icons/Icon_Location.svg';

interface Props {
  location: string;
  twitterHandle?: string;
  instagramHandle?: string;
  bandcampHandle?: string;
  youtubeHandle?: string;
  external?: string;
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
        <div className="artist-info__social_item">
          <a
            href={`https://twitter.com/${twitterHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${twitterHandle} on Twitter`}
          >
            <ReactSVG className="icon icon_black" src={Twitter} />
          </a>
        </div>
      );
    }
  };

  renderInstagram = () => {
    const { instagramHandle } = this.props;
    if (instagramHandle) {
      return (
        <div className="artist-info__social_item">
          <a
            href={`https://instagram.com/${instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${instagramHandle} on Instagram`}
          >
            <ReactSVG className="icon icon_black" src={Instagram} />
          </a>
        </div>
      );
    }
  };

  renderBandcamp = () => {
    const { bandcampHandle } = this.props;
    if (bandcampHandle) {
      return (
        <div className="artist-info__social_item">
          <a
            href={`https://${bandcampHandle}.bandcamp.com/`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${bandcampHandle} on Bandcamp`}
          >
            <ReactSVG className="icon icon_black" src={Bandcamp} />
          </a>
        </div>
      );
    }
  };

  renderYoutube = () => {
    const { youtubeHandle } = this.props;
    if (youtubeHandle) {
      return (
        <div className="artist-info__social_item">
          <a
            href={`${youtubeHandle}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ReactSVG className="icon icon_black" src={Youtube} />
          </a>
        </div>
      );
    }
  };

  renderExternal = () => {
    const { external } = this.props;
    if (external) {
      return (
        <div className="artist-info__social_item">
          <a href={external} target="_blank" rel="noopener noreferrer">
            <ReactSVG className="icon icon_black" src={Link1} />
          </a>
        </div>
      );
    }
  };

  renderSocialInfo = () => {
    return (
      <div className="artist-info__social">
        {this.renderBandcamp()}
        {this.renderTwitter()}
        {this.renderInstagram()}
        {this.renderYoutube()}
        {this.renderExternal()}
      </div>
    );
  };

  render() {
    return (
      <div className="artist-info container">
        {this.renderArtistLocation()}
        {this.renderSocialInfo()}
      </div>
    );
  }
}