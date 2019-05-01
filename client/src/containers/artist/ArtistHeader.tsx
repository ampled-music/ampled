import './artist.scss';

import * as React from 'react';

import { faPlay, faPlus, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ArtistModel } from 'src/redux/artists/initial-state';
import { UserRoles } from '../shared/user-roles';

interface Props {
  openVideoModal: React.MouseEventHandler;
  openPostModal: React.MouseEventHandler;
  artist: ArtistModel;
  loggedUserAccess: { role: string; artistId: number };
}

export class ArtistHeader extends React.Component<Props, any> {
  state = {
    showConfirmationDialog: false,
  };

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
                  className="artist-header__person_image"
                  src={owner.profile_image_url}
                  alt={owner.name}
                  style={{ borderColor: artist.accent_color }}
                />
              ) : (
                <FontAwesomeIcon
                  className="artist-header__person_svg"
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
        <img className="artist-header__message-image" src={artist.video_screenshot_url} />
      </div>
    );
  };

  renderSupporter = ({ supporter, borderColor, isSmall = false }) => {
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
            alt={supporter.name}
            style={{ borderColor }}
          />
        ) : (
          <FontAwesomeIcon className="artist-header__person_svg" icon={faUserCircle} style={{ borderColor }} />
        )}
      </div>
    );
  };

  renderSupportersContainer = () => {
    const { artist } = this.props;

    if (!artist.supporters) {
      return null;
    }

    const borderColor = artist.accent_color;

    const mostRecentSupporter = artist.supporters.find(
      (supporter) => +supporter.id === artist.most_recent_supporter_user_id,
    );

    return (
      <div className="artist-header__supporters">
        <div className="artist-header__supporter-title">{artist.supporters.length} Supporter(s)</div>

        {mostRecentSupporter && (
          <div key={mostRecentSupporter.id} className="row align-items-center">
            <div className="col-3">{this.renderSupporter({ supporter: mostRecentSupporter, borderColor })}</div>
            <div className="col-9">
              <b className="most-recent-supporter-tag">MOST RECENT SUPPORTER</b>
              <div className="artist-header__person_name">{mostRecentSupporter.name}</div>
              <div className="artist-header__person_quote" />
            </div>
          </div>
        )}

        <div className="row justify-content-start no-gutters">
          {artist.supporters
            .filter((supporter) => +supporter.id !== artist.most_recent_supporter_user_id)
            .map((supporter) => (
              <div key={supporter.id} className="col-2">
                {this.renderSupporter({ supporter, borderColor, isSmall: true })}
              </div>
            ))}
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="artist-header container">
        <div className="row">
          <div className="col-md-8">
            {this.renderArtistName()}
            {this.renderPhotoContainer()}
          </div>
          <div className="col-md-4">
            <div className="artist-header__message">A Message From The Band</div>
            {this.renderFloatingNewPostButton()}
            {this.renderMessageContainer()}
            {this.renderSupportersContainer()}
          </div>
        </div>
      </div>
    );
  }
}
