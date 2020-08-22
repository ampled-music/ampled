import './artist-header.scss';

import * as React from 'react';
import Swipe from 'react-easy-swipe';
import { isMobile } from 'react-device-detect';
import cx from 'classnames';

import { Image, Transformation } from 'cloudinary-react';
import { UserImage } from '../../user-details/UserImage';

interface Props {
  artist: any;
  loggedUserAccess: { role: string; artistId: number };
  isSupporter: boolean;
  handleSupportClick: Function;
  imageWidth: number;
  imageHeight: number;
}

export class FeaturedImages extends React.Component<Props, any> {
  onSwipeLeft = () => {
    this.cycleBanners('forewords');
  };

  onSwipeRight = () => {
    this.cycleBanners('backwards');
  };

  cycleBanners = (direction) => {
    const bannerImages = document.getElementsByClassName(
      'artist-header__photo',
    );
    const bannerIcons = document.getElementsByClassName(
      'artist-header__banner-icons_icon',
    );
    let index;

    for (index = 0; index < bannerImages.length; ++index) {
      if (bannerImages[index].classList.contains('active')) {
        bannerImages[index].classList.toggle('active');
        bannerIcons[index].classList.toggle('active');

        const change = direction === 'backwards' ? -1 : 1;
        index += change;
        index =
          index < 0
            ? bannerImages.length - 1
            : (index = index % bannerImages.length);

        bannerImages[index].classList.add('active');
        bannerIcons[index].classList.add('active');
      }
    }
  };

  selectBanner = (currentIndex) => {
    const bannerImages = document.getElementsByClassName(
      'artist-header__photo',
    );
    const bannerIcons = document.getElementsByClassName(
      'artist-header__banner-icons_icon',
    );

    for (let index = 0; index < bannerImages.length; ++index) {
      if (bannerImages[index].classList.contains('active')) {
        bannerImages[index].classList.toggle('active');
        bannerIcons[index].classList.toggle('active');
      }
    }
    bannerImages[currentIndex].classList.add('active');
    bannerIcons[currentIndex].classList.add('active');
  };

  renderOwnerHover = ({ owner }) => {
    return (
      <div className="supporter__hover-card">
        <div className="supporter__hover-card_header">
          <div className="supporter__hover-card_header_info">
            <div className="supporter__hover-card_header_info_name">
              {owner.name}
              {owner.last_initial && <span> {owner.last_initial}.</span>}
            </div>
            {owner.instrument && (
              <div className="supporter__hover-card_header_info_role">
                {owner.instrument}
              </div>
            )}
            {owner.joined_since && (
              <div className="supporter__hover-card_header_info_since">
                Joined Ampled {owner.joined_since}
              </div>
            )}
          </div>
        </div>
        {owner.supports.length > 0 && (
          <div className="supporter__hover-card_bands">
            <div className="supporter__hover-card_bands_section">
              <h6>Also Supports</h6>
              {owner.supports.map((artist) => (
                <div
                  className="supporter__hover-card_bands_name"
                  key={artist.name}
                >
                  <a href={artist.slug}>{artist.name}</a>
                </div>
              ))}
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
            <div
              key={`owner-${owner.id}`}
              id={`owner-${owner.id}`}
              className="artist-header__person supporter"
            >
              <div className="member-image">
                <RenderOwnerHover owner={owner} />
                <UserImage
                  image={owner.image}
                  className="artist-header__person_image member"
                  alt={owner.name}
                  width={60}
                  style={{ borderColor: artist.accent_color }}
                />
              </div>
            </div>
          ))}
      </div>
    );
  };

  renderBanners = () => {
    const { artist, imageWidth, imageHeight } = this.props;
    let mobileImageWidth, mobileImageHeight;
    if (window.screen.width < 768) {
      mobileImageWidth = 800;
      mobileImageHeight = 800;
    }
    return (
      <div className="artist-header__photos">
        {artist.images &&
          artist.images.map((image, index) => {
            return (
              <div
                key={index}
                className={cx('artist-header__photo', { active: index === 0 })}
              >
                <Image publicId={image.public_id} key={image.public_id}>
                  <Transformation
                    fetchFormat="auto"
                    crop="fill"
                    width={mobileImageWidth ? mobileImageWidth : imageWidth}
                    height={mobileImageHeight ? mobileImageHeight : imageHeight}
                    responsive_placeholder="blank"
                    gravity="faces"
                  />
                </Image>
              </div>
            );
          })}
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
              return (
                <span
                  key={index}
                  className={cx('artist-header__banner-icons_icon', {
                    active: index === 0,
                  })}
                  onClick={() => this.selectBanner(index)}
                ></span>
              );
            } else {
              return null;
            }
          })}
      </div>
    );
  };

  render() {
    const { artist, imageWidth, imageHeight } = this.props;
    let mobileImageWidth, mobileImageHeight;
    if (window.screen.width < 768) {
      mobileImageWidth = 800;
      mobileImageHeight = 800;
    }
    return (
      <div
        className="artist-header__photo-container"
        style={{ borderColor: artist.accent_color }}
      >
        {!artist.hide_members && this.renderOwners()}
        {artist.images && (
          <div className="artist-header__photo_spacer">
            <Image
              publicId={artist.images[0].public_id}
              key={artist.images[0].public_id}
            >
              <Transformation
                fetchFormat="auto"
                crop="fill"
                width={mobileImageWidth ? mobileImageWidth : imageWidth}
                height={mobileImageHeight ? mobileImageHeight : imageHeight}
                responsive_placeholder="blank"
                gravity="faces:center"
              />
            </Image>
          </div>
        )}
        {this.renderBanners()}
        {artist.images && (
          <div
            onClick={
              !isMobile && artist.images.length > 1
                ? this.cycleBanners
                : undefined
            }
            className="artist-header__photo-container_border"
            style={{ borderColor: artist.accent_color }}
          >
            <Swipe
              onSwipeLeft={
                artist.images.length > 1 ? this.onSwipeLeft : undefined
              }
              onSwipeRight={
                artist.images.length > 1 ? this.onSwipeRight : undefined
              }
              allowMouseEvents={true}
              tolerance={25}
              className="artist-header__photo-container_border_swipe"
            ></Swipe>
          </div>
        )}
        {this.renderBannerIcons()}
      </div>
    );
  }
}
