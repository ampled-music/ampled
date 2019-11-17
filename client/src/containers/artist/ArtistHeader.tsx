import './artist.scss';

import * as React from 'react';
import path from 'ramda/src/path';
import Swipe from 'react-easy-swipe';
import { isMobile } from 'react-device-detect';
import cx from 'classnames';

import { Image, Transformation } from 'cloudinary-react';
import { faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ArtistModel } from 'src/redux/artists/initial-state';
import { UserRoles } from '../shared/user-roles';
import TextTruncate from 'react-text-truncate';
import * as R from 'ramda';

import avatar from '../../images/ampled_avatar.svg';
import tear from '../../images/paper_header.png';
import paper from '../../images/background_paper_sm.png';

interface Props {
  openVideoModal: React.MouseEventHandler;
  openPostModal: React.MouseEventHandler;
  openWhyModal: React.MouseEventHandler;
  openMessageModal: React.MouseEventHandler;
  artist: ArtistModel;
  loggedUserAccess: { role: string; artistId: number };
  isSupporter: Boolean;
  handleSupportClick: Function;
}

export class ArtistHeader extends React.Component<Props, any> {
  state = {
    showConfirmationDialog: false,
    screenshotURL: ''
  };

  componentDidUpdate = async (prevProps) => {
    const { artist: { video_url } } = this.props;
    if (video_url === prevProps.artist.video_url && this.state.screenshotURL) {
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
      const vimeoJSON = await (await fetch(`//vimeo.com/api/v2/video/${vimeoId}.json`)).json();
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

  onSwipeLeft = () => {
    this.cycleBanners('forewords')
  }

  onSwipeRight = () => {
    this.cycleBanners('backwards')
  }

  cycleBanners = (direction) => {

    const bannerImages = document.getElementsByClassName("artist-header__photo");
    const bannerIcons = document.getElementsByClassName("artist-header__banner-icons_icon");
    var index;

    for (index = 0; index < bannerImages.length; ++index) {

      if (bannerImages[index].classList.contains('active')) {

        bannerImages[index].classList.toggle('active');
        bannerIcons[index].classList.toggle('active');

        const change = direction === 'backwards' ? -1 : 1;
        index += change;
        index = index < 0 ? bannerImages.length - 1 : index = index % bannerImages.length;

        bannerImages[index].classList.add('active');
        bannerIcons[index].classList.add('active');
      }
    }
  }

  selectBanner = (currentIndex) => {

    const bannerImages = document.getElementsByClassName("artist-header__photo");
    const bannerIcons = document.getElementsByClassName("artist-header__banner-icons_icon");

    for (var index = 0; index < bannerImages.length; ++index) {
      if (bannerImages[index].classList.contains('active')) {
        bannerImages[index].classList.toggle('active');
        bannerIcons[index].classList.toggle('active');
      }
    }
    bannerImages[currentIndex].classList.add('active');
    bannerIcons[currentIndex].classList.add('active');
  }

  renderArtistName = () => <div className="artist-header__title"><span className="artist-header__title_flair"></span>{this.props.artist.name}</div>;

  renderOwnerHover = ({ owner }) => {
    return (
      <div className="supporter__hover-card">
        <div className="supporter__hover-card_header">
          <div className="supporter__hover-card_header_info">
            <div className="supporter__hover-card_header_info_name">{owner.name}</div>
          </div>
        </div>
        {owner.also_supports && (
          <div className="supporter__hover-card_bands">
            <div className="supporter__hover-card_bands_section">
              <h6>Also Supports</h6>
              <div className="supporter__hover-card_bands_name">Dilly Dally</div>
              <div className="supporter__hover-card_bands_name">Culture Abuse</div>
            </div>
          </div>
        )}
      </div>
    );
  };
  renderOwners = () => {
    const { artist } = this.props;
    const RenderOwnerHover = this.renderOwnerHover;

    return (
      <div className="artist-header__persons">
        {artist.owners &&
          artist.owners.map((owner) => (
            <div key={`owner-${owner.id}`} id={`owner-${owner.id}`} className="artist-header__person supporter">
              <div className="member-image">
                <RenderOwnerHover
                  owner={owner}
                />
                {owner.profile_image_url ? (
                  <img
                    className="artist-header__person_image member"
                    src={this.renderPhoto(owner.profile_image_url, 150)}
                    alt={owner.name}
                    style={{ borderColor: artist.accent_color }}
                  />
                ) : (
                    <img
                      className="artist-header__person_image member"
                      src={avatar}
                      alt={owner.name}
                      style={{ borderColor: artist.accent_color }}
                    />
                  )}
              </div>
            </div>
          ))}
      </div>
    );
  };

  renderPhoto = (image: string, crop: number) => {
    const crop_url_path = `w_${crop},h_${crop},c_fill`;
    if (image.includes('https://res.cloudinary')) {
      return image.replace('upload/', `upload/${crop_url_path}/`);
    } else {
      return `https://res.cloudinary.com/ampled-web/image/fetch/${crop_url_path}/${image}`;
    }
  };

  renderCloudinaryPhoto = (image: string, crop: number, ) => {
    const crop_url_path = `w_${crop},h_${crop},c_fill`;
    const cloudinary_id = image.substring(image.lastIndexOf("/") + 1, image.lastIndexOf("."));
    if (image.includes('https://res.cloudinary')) {
      return (
        <Image publicId={cloudinary_id}>
          <Transformation crop="fill" width={crop} height={crop} responsive_placeholder="blank" />
        </Image>
      )
    } else {
      const img_src = `https://res.cloudinary.com/ampled-web/image/fetch/${crop_url_path}/${image}`;
      return <img src={img_src} />;
    }
  };

  renderBanners = () => {
    const { artist } = this.props;
    return (
      <div className="artist-header__photos">
        {artist.images &&
          artist.images.map((image, index) => {
            return <div key={index} className={cx('artist-header__photo', { 'active': index === 0 })}>{this.renderCloudinaryPhoto(image, 800)}</div>;
          })
        }
      </div>
    );
  };

  renderBannerIcons = () => {
    const { artist } = this.props;

    return (
      <div className="artist-header__banner-icons">
        {artist.images &&
          artist.images.map((_image, index) => {
            if (artist.images.length > 1) {
              return <span key={index} className={cx('artist-header__banner-icons_icon', { 'active': index === 0 })} onClick={() => this.selectBanner(index)}></span>
            }
          })
        }
      </div>
    );
  };

  renderPhotoContainer = () => (
    <div className="artist-header__photo-container" style={{ borderColor: this.props.artist.accent_color }}>
      {this.renderOwners()}
      {this.renderBanners()}
      <div
        onClick={!isMobile && (this.cycleBanners)}
        className="artist-header__photo-container_border"
        style={{ borderColor: this.props.artist.accent_color }}>
        <Swipe
          onSwipeLeft={this.onSwipeLeft}
          onSwipeRight={this.onSwipeRight}
          allowMouseEvents={true}
          tolerance={25}
          className="artist-header__photo-container_border_swipe"
        >
        </Swipe>
      </div>
      {this.renderBannerIcons()}
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

  renderVideoContainer = () => {
    const { artist } = this.props;

    if (artist.video_url) {
      return (
        <div>
          <div className="artist-header__message_container" style={{ borderColor: artist.accent_color }}>
            <button onClick={this.props.openVideoModal} className="artist-header__play">
              <FontAwesomeIcon className="artist-header__play_svg" icon={faPlay} style={{ color: artist.accent_color }} />
            </button>
            <div className="artist-header__message_video">
              <img className="artist-header__message_tear" src={tear} />
              <div className="artist-header__message_image_container">
                <img className="artist-header__message_image" src={this.state.screenshotURL} />
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
          <div className="artist-header__message_container paper" style={{ borderColor: artist.accent_color }}>
            <div className="artist-header__message_text">
              <img className="artist-header__message_paper-bg" src={paper} />
              <TextTruncate
                line={artist.video_url ? 5 : 10}
                element="span"
                truncateText="&#8230;"
                text={artist.bio}
              />
            </div>
            <button className="btn btn-ampled btn-read-more" style={{ borderColor }} onClick={this.props.openMessageModal}>
              Read More
            </button>
          </div>
        </div>
      );
    }
  };

  renderSupporterHover = ({ supporter }) => {
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
            <div className="supporter__hover-card_header_info_name">{supporter.name}</div>
            {supporter.since && (
              <div className="supporter__hover-card_header_info_since">Supporter since {supporter.since}</div>
            )}
          </div>
        </div>
        {supporter.also_supports || supporter.member_of && (
          <div className="supporter__hover-card_bands">
            {supporter.also_supports && (
              <div className="supporter__hover-card_bands_section">
                <h6>Also Supports</h6>
                <div className="supporter__hover-card_bands_name">Dilly Dally</div>
                <div className="supporter__hover-card_bands_name">Culture Abuse</div>
              </div>
            )}
            {supporter.member_of && (
              <div className="supporter__hover-card_bands_section">
                <h6>Member of</h6>
                <div className="supporter__hover-card_bands_name">Fake Dad</div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  renderSupporter = ({ supporter, borderColor, isSmall = false }) => {
    let style = { borderColor, maxWidth: 'auto', maxHeight: 'auto' };
    const RenderSupporterHover = this.renderSupporterHover;
    if (isSmall) {
      style.maxWidth = '36px';
      style.maxHeight = '36px';
    }
    return (
      <div className="supporter">
        <RenderSupporterHover
          supporter={supporter}
        />
        <div
          key={`supporter-${supporter.id}`}
          id={`supporter-${supporter.id}`}
          className={isSmall ? 'supporter-image artist-header__person_small' : 'supporter-image artist-header__person'}
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
      <div>
        <button className="btn btn-ampled btn-support" style={{ borderColor }} onClick={(e) => this.props.handleSupportClick()}>
          Become a Supporter
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
            <div className="artist-header__supporters_title">{artist.supporters.length} Supporters</div>
            <div className="row">
              <div className="artist-header__supporters_recent col-4">
                <RenderSupporter
                  supporter={mostRecentSupporter}
                  borderColor={borderColor}
                />
                <div className="artist-header__person_info">
                  <div className="artist-header__person_name">{mostRecentSupporter.name}</div>
                  <div className="artist-header__person_mr">Most Recent</div>
                </div>
              </div>
              <div className="artist-header__supporters_all col-8">
                {artist.supporters
                  .filter((supporter) => !R.equals(R.path('most_recent_supporter', 'id', artist), +supporter.id))
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
            {this.renderPhotoContainer()}
          </div>
          <div className="col-md-4 artist-header__message-col">
            {this.renderVideoContainer()}
            {this.renderMessageContainer()}
            {this.renderFloatingNewPostButton()}
            {this.renderSupportersContainer()}
            {!this.props.isSupporter && !this.canLoggedUserPost() && isStripeSetup && this.renderSupportButton()}
          </div>
        </div>
      </div>
    );
  }
}
