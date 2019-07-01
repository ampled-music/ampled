import './artist.scss';

import * as React from 'react';
import path from 'ramda/src/path';

import { faPlay, faPlus, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ArtistModel } from 'src/redux/artists/initial-state';
import { UserRoles } from '../shared/user-roles';
import * as R from 'ramda';

interface Props {
  openVideoModal: React.MouseEventHandler;
  openPostModal: React.MouseEventHandler;
  artist: ArtistModel;
  loggedUserAccess: { role: string; artistId: number };
  isSupporter: Boolean;
  handleSupportClick: Function;
}

export class ArtistHeader extends React.Component<Props, any> {
  state = {
    showConfirmationDialog: false,
    screenshotURL: this.props.artist.video_screenshot_url
  };

  componentDidUpdate = async (prevProps) => {
    const { artist: { video_url } } = this.props;
    if (video_url === prevProps.artist.video_url) {
      return;
    } else if (video_url) {
      this.setState({
        screenshotURL: await this.getThumbnailURLFromVideoURL(video_url)
      });
    }
  }

  getThumbnailURLFromVideoURL = async (videoURL: string) => {
    if (/vimeo/i.test(videoURL)) {
      const vimeoId = videoURL.match(/vimeo.com\/([\d\w]+)/)[1];
      const vimeoJSON = await (await fetch(`http://vimeo.com/api/v2/video/${vimeoId}.json`)).json();
      const vimeoURL = path([0, 'thumbnail_large'], vimeoJSON);
      if (vimeoURL) {
        return vimeoURL;
      }
    } else if (/youtu/i.test(videoURL)) {
      const youtubeId = videoURL.match(/(youtube\.com\/watch\?v\=|youtu.be\/)(.+)/i)[2];
      return `https://img.youtube.com/vi/${youtubeId}/0.jpg`;
    }
    return this.state.screenshotURL;
  }
  
  renderArtistName = () => <div className="artist-header__title">{this.props.artist.name}</div>;

  renderOwners = () => {
    const { artist } = this.props;

    return (
      <div className="artist-header__persons">
        {artist.owners &&
          artist.owners.map((owner) => (
            <div key={`owner-${owner.id}`} id={`owner-${owner.id}`} className="artist-header__person">
              {owner.profile_image_url ? (
                <img
                  className="artist-header__person_image member"
                  src={owner.profile_image_url}
                  alt={owner.name}
                  style={{ borderColor: artist.accent_color }}
                />
              ) : (
                <FontAwesomeIcon
                  className="artist-header__person_svg member"
                  icon={faUserCircle}
                  style={{ borderColor: artist.accent_color }}
                />
              )}
            </div>
          ))}
      </div>
    );
  };

  renderBanners = () => {
    const { artist } = this.props;

    return (
      <div className="artist-header__photos">
        {artist.images &&
          artist.images.map((image, index) => {
            return <img key={index} className="artist-header__photo" src={image} />;
          })}
      </div>
    );
  };

  renderPhotoContainer = () => (
    <div className="artist-header__photo-container" style={{ borderColor: this.props.artist.accent_color }}>
      {this.renderOwners()}
      {this.renderBanners()}
      <div className="artist-header__photo-container_border" style={{ borderColor: this.props.artist.accent_color }} />
    </div>
  );

  canLoggedUserPost = () => {
    return this.props.loggedUserAccess && this.props.loggedUserAccess.role === UserRoles.Owner;
  };

  renderFloatingNewPostButton = () =>
    this.canLoggedUserPost() && (
      <div className="new-post">
        <button onClick={this.props.openPostModal}>
          <span>New Post</span>
          <FontAwesomeIcon icon={faPlus} color="#ffffff" />
        </button>
      </div>
    );

  renderMessageContainer = () => {
    const { artist } = this.props;

    return (
      <div className="artist-header__message-container" style={{ borderColor: artist.accent_color }}>
        <button onClick={this.props.openVideoModal} className="artist-header__play">
          <FontAwesomeIcon className="artist-header__play_svg" icon={faPlay} style={{ color: artist.accent_color }} />
        </button>
        <img className="artist-header__message-image" src={this.state.screenshotURL} />
      </div>
    );
  };

  anonymizeSupporterName = name => {
    const nameParts = name.split(' ');
    if (nameParts.length < 2) {
      return name;
    } else {
      nameParts[nameParts.length - 1] = nameParts[nameParts.length - 1].slice(0, 1);
      return nameParts.join(' ') + '.';
    }
  }

  renderSupporter = ({ supporter, borderColor, isSmall = false }) => {
    let style = { borderColor, maxWidth: 'auto', maxHeight: 'auto' };
    if (isSmall) {
      style.maxWidth = '36px';
      style.maxHeight = '36px';
    }
    return (
      <div
        key={`supporter-${supporter.id}`}
        id={`supporter-${supporter.id}`}
        className={isSmall ? 'artist-header__person_small' : 'artist-header__person'}
      >
        {supporter.profile_image_url ? (
          <img
            className="artist-header__person_image"
            src={supporter.profile_image_url}
            alt={this.anonymizeSupporterName(supporter.name)}
            style={style}
          />
        ) : (
          <FontAwesomeIcon className="artist-header__person_svg" icon={faUserCircle} style={style} />
        )}
      </div>
    );
  };

  renderSupportButton = () => {

    const { artist } = this.props;
    const borderColor = artist.accent_color;
    
    return (
      <div>
        <button className="btn btn-support" style={{ borderColor }} onClick={(e) => this.props.handleSupportClick()}> 
          Become a Supporter 
        </button>
        <a href="https://www.ampled.com/why-support" target="_blank" className="link link__why">
          Why support?
        </a>
      </div>

    );
  };

  renderSupportersContainer = () => {
    const { artist } = this.props;
    const RenderSupporter = this.renderSupporter;

    if (!artist.supporters) {
      return null;
    }

    const borderColor = artist.accent_color;
    const mostRecentSupporter = artist.most_recent_supporter;

    return (
      <div className="artist-header__supporters">

        {mostRecentSupporter && (
          <div>
            <div className="artist-header__supporters_title">Most Recent Supporter</div>
            <div className="artist-header__supporters_recent">
              <RenderSupporter
                supporter={mostRecentSupporter}
                borderColor={borderColor}
              />
              <div className="artist-header__person_info">
                <div className="artist-header__person_name">{this.anonymizeSupporterName(mostRecentSupporter.name)}</div>
                <div className="artist-header__person_quote" /></div>
              </div>
            </div>
        )}
        <div className="artist-header__supporters_title">{artist.supporters.length} Supporter(s)</div>

        <div className="artist-header__supporters_all">
          {artist.supporters
            .filter((supporter) => !R.equals(R.path('most_recent_supporter','id', artist), +supporter.id))
            .map((supporter) => (
              <div key={`minisupporter-${supporter.id}`}>
                <RenderSupporter
                  supporter={supporter}
                  borderColor
                  isSmall
                />
              </div>
            ))}
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="artist-header container">
        <div className="row justify-content-between">
          <div className="col-md-7">
            {this.renderArtistName()}
            {this.renderPhotoContainer()}
          </div>
          <div className="col-md-4 artist-header artist-header__message-col">
            <div className="artist-header__message">Message from the Artist</div>
            {this.renderFloatingNewPostButton()}
            {this.renderMessageContainer()}
            {this.renderSupportersContainer()}
            {!this.props.isSupporter && this.renderSupportButton()}
          </div>
        </div>
      </div>
    );
  }
}
