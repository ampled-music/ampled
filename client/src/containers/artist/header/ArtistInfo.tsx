import * as React from 'react';
import { ReactSVG } from 'react-svg';
import { UserRoles } from '../../shared/user-roles';

import Instagram from '../../../images/icons/Icon_Instagram.svg';
import Twitter from '../../../images/icons/Icon_Twitter.svg';
import Bandcamp from '../../../images/icons/Icon_Bandcamp.svg';
import Youtube from '../../../images/icons/Icon_Youtube.svg';
import Link1 from '../../../images/icons/Icon_Link_1.svg';
import Location from '../../../images/icons/Icon_Location.svg';

interface Props {
  artist: any;
  isSupporter: boolean;
  isAmpled: boolean;
  openWhyModal: any;
  openJoinModal: any;
  loggedUserAccess: { role: string; artistId: number };
  handleSupportClick: Function;
}

export class ArtistInfo extends React.Component<Props, any> {
  canLoggedUserPost = () => {
    return (
      this.props.loggedUserAccess &&
      (this.props.loggedUserAccess.role === UserRoles.Admin ||
        this.props.loggedUserAccess.role === UserRoles.Member ||
        this.props.loggedUserAccess.role === UserRoles.Owner)
    );
  };

  renderArtistLocation = () => (
    <div className="artist-info__location">
      <ReactSVG className="icon icon_black" src={Location} />
      {this.props.artist.location}
    </div>
  );

  renderTwitter = () => {
    const { twitter_handle } = this.props.artist;
    if (twitter_handle) {
      return (
        <div className="artist-info__social_item">
          <a
            href={`https://twitter.com/${twitter_handle}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${twitter_handle} on Twitter`}
          >
            <ReactSVG className="icon icon_black" src={Twitter} />
          </a>
        </div>
      );
    }
  };

  renderInstagram = () => {
    const { instagram_handle } = this.props.artist;
    if (instagram_handle) {
      return (
        <div className="artist-info__social_item">
          <a
            href={`https://instagram.com/${instagram_handle}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${instagram_handle} on Instagram`}
          >
            <ReactSVG className="icon icon_black" src={Instagram} />
          </a>
        </div>
      );
    }
  };

  renderBandcamp = () => {
    const { bandcamp_handle } = this.props.artist;
    if (bandcamp_handle) {
      return (
        <div className="artist-info__social_item">
          <a
            href={`https://${bandcamp_handle}.bandcamp.com/`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${bandcamp_handle} on Bandcamp`}
          >
            <ReactSVG className="icon icon_black" src={Bandcamp} />
          </a>
        </div>
      );
    }
  };

  renderYoutube = () => {
    const { youtube_handle } = this.props.artist;
    if (youtube_handle) {
      return (
        <div className="artist-info__social_item">
          <a
            href={`${youtube_handle}`}
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
    const { external } = this.props.artist;
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

  renderSupportButton = () => {
    return (
      <>
        {this.props.isAmpled ? (
          <button onClick={this.props.openJoinModal} className="link link__why">
            Why join?
          </button>
        ) : (
          <button onClick={this.props.openWhyModal} className="link link__why">
            Why support?
          </button>
        )}
      </>
    );
  };

  render() {
    const { isStripeSetup, style_type } = this.props.artist;

    return (
      <div className="artist-info container">
        {this.renderArtistLocation()}
        {!this.props.isSupporter &&
          !this.canLoggedUserPost() &&
          isStripeSetup &&
          style_type === 'minimal' &&
          this.renderSupportButton()}
        {this.renderSocialInfo()}
      </div>
    );
  }
}
