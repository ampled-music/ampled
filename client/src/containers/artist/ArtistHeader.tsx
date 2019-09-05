import './artist.scss';

import * as React from 'react';
import path from 'ramda/src/path';
import Swipe from 'react-easy-swipe';

import { faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ArtistModel } from 'src/redux/artists/initial-state';
import { UserRoles } from '../shared/user-roles';
import * as R from 'ramda';

import avatar from '../../images/ampled_avatar.svg';
import tear from '../../images/paper_header.png';

interface Props {
  openVideoModal: React.MouseEventHandler;
  openPostModal: React.MouseEventHandler;
  openWhyModal: React.MouseEventHandler;
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
    this.cycleBanners('backwards')
  }

  onSwipeRight = () => {
    this.cycleBanners('forwards')
  }

  cycleBanners = (direction) => {

    const bannerImages = document.getElementsByClassName("artist-header__photo");
    const bannerIcons = document.getElementsByClassName("artist-header__banner-icons_icon");
    var index;

    console.log(index);

    for (index = 0; index < bannerImages.length; ++index) {
      const change = direction === 'backwards' ? -1 : 1;
      index += change;
      index = index < 0 ? bannerImages.length - 1 : index = index % bannerImages.length;

      if (bannerImages[index].classList.contains('active')) {
        bannerImages[index].classList.toggle('active');
        bannerIcons[index].classList.toggle('active');
        if (index + 1 === bannerImages.length) {
          index = 0;
        } else {
          ++index;
        }
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
                <img
                  className="artist-header__person_image member"
                  src={avatar}
                  alt={owner.name}
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
            if (index === 0) {
              return <div key={index} className="artist-header__photo active"><img src={image} /></div>;
            } else {              
              return <div key={index} className="artist-header__photo"><img src={image} /></div>;
            }
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
            if (index === 0) {
              return <span key={index} className="artist-header__banner-icons_icon active" onClick={() => this.selectBanner(index)}></span>
            } else {
              return <span key={index} className="artist-header__banner-icons_icon" onClick={() => this.selectBanner(index)}></span>
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
        onClick={this.cycleBanners}
        className="artist-header__photo-container_border"
        style={{ borderColor: this.props.artist.accent_color }}>
        <Swipe
          onSwipeLeft={this.onSwipeLeft}
          onSwipeRight={this.onSwipeRight}
          allowMouseEvents={true}
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

  renderMessageContainer = () => {
    const { artist } = this.props;

    if (artist.video_url) {
      return (
        <div>
          <div className="artist-header__message">Message from the Artist</div>
          <div className="artist-header__message-container" style={{ borderColor: artist.accent_color }}>
            <button onClick={this.props.openVideoModal} className="artist-header__play">
              <FontAwesomeIcon className="artist-header__play_svg" icon={faPlay} style={{ color: artist.accent_color }} />
            </button>
            <div className="artist-header__message-video">
              <img className="artist-header__message-tear" src={tear} />
              <div className="artist-header__message-image_container">
                <img className="artist-header__message-image" src={this.state.screenshotURL} />
              </div>
            </div>
          </div>
        </div>
      );
    }
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

  renderSupporterHover = ({supporter}) => {
    return (
      <div className="supporter__hover-card">
        <div className="supporter__hover-card_header">
          {supporter.profile_image_url && (
            <div className="supporter__hover-card_header_photo">
              <img
                className="supporter__hover-card_header_photo_image"
                src={supporter.profile_image_url}
                alt={this.anonymizeSupporterName(supporter.name)}
              />
            </div>
          )}
          <div className="supporter__hover-card_header_info">
            <div className="supporter__hover-card_header_info_name">{this.anonymizeSupporterName(supporter.name)}</div>
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
              src={supporter.profile_image_url}
              alt={this.anonymizeSupporterName(supporter.name)}
              style={style}
            />
          ) : (
            <img
              className="artist-header__person_svg"
              src={avatar}
              alt={this.anonymizeSupporterName(supporter.name)}
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
        {artist.supporters.length > 0 && (
          <div>
            <div className="artist-header__supporters_title">{artist.supporters.length} Supporters</div>

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
        )}
        
      </div>
    );
  };

  render() {
    return (
      <div className="artist-header container">
        {this.renderArtistName()}
        <div className="row justify-content-between">
          <div className="col-md-7">
            {this.renderPhotoContainer()}
          </div>
          <div className="col-md-4 artist-header__message-col">
            {this.renderMessageContainer()}
            {this.renderFloatingNewPostButton()}
            {this.renderSupportersContainer()}
            {!this.props.isSupporter && !this.canLoggedUserPost() && this.renderSupportButton()}
          </div>
        </div>
      </div>
    );
  }
}
