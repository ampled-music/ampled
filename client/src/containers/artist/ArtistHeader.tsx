import './artist.scss';

import * as React from 'react';
import cx from 'classnames';

import { Image, Transformation } from 'cloudinary-react';
import { faPlay, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ArtistModel } from '../../redux/artists/initial-state';
import { UserRoles } from '../shared/user-roles';
import TextTruncate from 'react-text-truncate';
import * as R from 'ramda';

import avatar from '../../images/ampled_avatar.svg';
import tear from '../../images/paper_header.png';
import paper_sm from '../../images/background_paper_sm.png';
import paper_md from '../../images/background_paper_md.png';

import { FeaturedImages } from './header/FeaturedImages';

interface Props {
  openVideoModal: React.MouseEventHandler;
  openPostModal: React.MouseEventHandler;
  openWhyModal: React.MouseEventHandler;
  openMessageModal: React.MouseEventHandler;
  artist: ArtistModel;
  loggedUserAccess: { role: string; artistId: number };
  isSupporter: boolean;
  handleSupportClick: Function;
}

export class ArtistHeader extends React.Component<Props, any> {
  state = {
    showConfirmationDialog: false,
  };

  renderArtistName = () => (
    <div className="artist-header__title">
      <span className="artist-header__title_flair"></span>
      {this.props.artist.name}
    </div>
  );

  canLoggedUserPost = () => {
    return (
      this.props.loggedUserAccess &&
      (this.props.loggedUserAccess.role === UserRoles.Admin ||
        this.props.loggedUserAccess.role === UserRoles.Member ||
        this.props.loggedUserAccess.role === UserRoles.Owner)
    );
  };

  canLoggedUserAdmin = () => {
    return (
      this.props.loggedUserAccess &&
      (this.props.loggedUserAccess.role === UserRoles.Admin ||
        this.props.loggedUserAccess.role === UserRoles.Owner)
    );
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

  renderFloatingEditButton = () =>
    this.canLoggedUserAdmin() && (
      <div className="edit-page">
        <button
          onClick={() => {
            window.location.href = `${window.location.pathname}/edit`;
          }}
        >
          <span>Edit Page</span>
          <FontAwesomeIcon icon={faEdit} color="#ffffff" />
        </button>
      </div>
    );

  renderPhoto = (image: string, crop: number) => {
    const crop_url_path = `w_${crop},h_${crop},c_fill`;
    if (image.includes('https://res.cloudinary')) {
      return image.replace('upload/', `upload/${crop_url_path}/`);
    } else {
      return `https://res.cloudinary.com/ampled-web/image/fetch/${crop_url_path}/${image}`;
    }
  };

  renderCloudinaryPhoto = (image: string, crop: number, altText: string) => {
    const crop_url_path = `w_${crop},h_${crop},c_fill`;
    const cloudinary_id = image.substring(
      image.lastIndexOf('/') + 1,
      image.lastIndexOf('.'),
    );
    if (image.includes('https://res.cloudinary')) {
      return (
        <Image publicId={cloudinary_id} alt={altText}>
          <Transformation
            crop="fill"
            width={crop}
            height={crop}
            responsive_placeholder="blank"
          />
        </Image>
      );
    } else {
      const img_src = `https://res.cloudinary.com/ampled-web/image/fetch/${crop_url_path}/${image}`;
      return <img src={img_src} alt={altText} />;
    }
  };

  renderVideoContainer = () => {
    const { artist } = this.props;

    if (artist.video_url) {
      return (
        <div>
          <div
            className="artist-header__message_container"
            style={{ borderColor: artist.accent_color }}
          >
            <button
              onClick={this.props.openVideoModal}
              className="artist-header__play"
              aria-label="Play video message"
            >
              <FontAwesomeIcon
                className="artist-header__play_svg"
                icon={faPlay}
                style={{ color: artist.accent_color }}
              />
            </button>
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
              <img
                className="artist-header__message_paper-bg"
                src={artist.video_url ? paper_sm : paper_md}
                alt=""
              />
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

  renderSupporterHover = ({ supporter }) => {
    const artist_name = this.props.artist.name;
    return (
      <div className="supporter__hover-card">
        <div className="supporter__hover-card_header">
          {supporter.profile_image_url && (
            <div className="supporter__hover-card_header_photo">
              <img
                className="supporter__hover-card_header_photo_image"
                src={this.renderPhoto(supporter.profile_image_url, 150)}
                alt={supporter.name}
              />
            </div>
          )}
          <div className="supporter__hover-card_header_info">
            <div className="supporter__hover-card_header_info_name">
              {supporter.name}
              {supporter.last_initial && (
                <span> {supporter.last_initial}.</span>
              )}
            </div>
            {supporter.supports && (
              <div className="supporter__hover-card_header_info_since">
                Supporter since
                {supporter.supports
                  .filter((artists) => R.equals(artists.name, artist_name))
                  .map((artists) => (
                    <span key={artists.name}> {artists.supporter_since}</span>
                  ))}
              </div>
            )}
          </div>
        </div>
        {(supporter.supports.length > 1 || supporter.member_of.length > 0) && (
          <div className="supporter__hover-card_bands">
            {supporter.supports.length > 1 && (
              <div className="supporter__hover-card_bands_section">
                <h6>Also Supports</h6>
                {supporter.supports
                  .filter((artist) => !R.equals(artist.name, artist_name))
                  .map((artist) => (
                    <div
                      className="supporter__hover-card_bands_name"
                      key={artist.slug}
                    >
                      <a href={artist.slug}>{artist.name}</a>
                    </div>
                  ))}
              </div>
            )}
            {supporter.member_of.length > 0 && (
              <div className="supporter__hover-card_bands_section">
                <h6>Member of</h6>
                {supporter.member_of.map((artist) => (
                  <div
                    className="supporter__hover-card_bands_name"
                    key={artist.name}
                  >
                    <a href={artist.slug}>{artist.name}</a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  renderSupporter = ({ supporter, borderColor, isSmall = false }) => {
    const style = { borderColor, maxWidth: 'auto', maxHeight: 'auto' };
    const RenderSupporterHover = this.renderSupporterHover;
    if (isSmall) {
      style.maxWidth = '36px';
      style.maxHeight = '36px';
    }
    return (
      <div className="supporter">
        <RenderSupporterHover supporter={supporter} />
        <div
          key={`supporter-${supporter.id}`}
          id={`supporter-${supporter.id}`}
          className={
            isSmall
              ? 'supporter-image artist-header__person_small'
              : 'supporter-image artist-header__person'
          }
        >
          {supporter.profile_image_url ? (
            <img
              className="artist-header__person_image"
              src={this.renderPhoto(supporter.profile_image_url, 200)}
              alt={supporter.name}
              style={style}
            />
          ) : (
            <img
              className="artist-header__person_svg"
              src={avatar}
              alt={supporter.name}
              style={style}
            />
          )}
        </div>
      </div>
    );
  };

  renderSupportButton = () => {
    const { artist } = this.props;
    const borderColor = artist.accent_color;

    return (
      <div
        className="artist-header__message_container"
        style={{ border: 'unset', minHeight: 'auto' }}
      >
        <button
          className="btn btn-ampled btn-support"
          style={{ borderColor, maxWidth: '100%' }}
          onClick={() => this.props.handleSupportClick()}
        >
          Support What You Want
        </button>
        <button onClick={this.props.openWhyModal} className="link link__why">
          Why support?
        </button>
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
        {artist.supporters.length > 0 && (
          <div>
            <div className="artist-header__supporters_title">
              {artist.supporters.length} Supporters
            </div>
            <div className="row">
              <div className="artist-header__supporters_recent col-4">
                <RenderSupporter
                  supporter={mostRecentSupporter}
                  borderColor={borderColor}
                />
                <div className="artist-header__person_info">
                  <div className="artist-header__person_name">
                    {mostRecentSupporter.name}
                  </div>
                  <div className="artist-header__person_mr">Most Recent</div>
                </div>
              </div>
              <div className="artist-header__supporters_all col-8">
                {artist.supporters
                  .filter(
                    (supporter) =>
                      !R.equals(
                        R.path(['most_recent_supporter', 'id'], artist),
                        +supporter.id,
                      ),
                  )
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
          </div>
        )}
      </div>
    );
  };

  render() {
    const { isStripeSetup } = this.props.artist;
    return (
      <div className="artist-header container">
        {this.renderArtistName()}
        <div className="row justify-content-between">
          <div className="col-md-7">
            <FeaturedImages
              artist={this.props.artist}
              loggedUserAccess={this.props.loggedUserAccess}
              isSupporter={this.props.isSupporter}
              handleSupportClick={this.props.handleSupportClick}
            />
          </div>
          <div className="col-md-4 artist-header__message-col">
            {this.renderVideoContainer()}
            {this.renderMessageContainer()}
            {this.renderFloatingNewPostButton()}
            {this.renderFloatingEditButton()}
            {this.renderSupportersContainer()}
            {!this.props.isSupporter &&
              !this.canLoggedUserPost() &&
              isStripeSetup &&
              this.renderSupportButton()}
          </div>
        </div>
      </div>
    );
  }
}
