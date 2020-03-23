import './artist-header.scss';

import * as React from 'react';
import * as R from 'ramda';
import { Image, Transformation } from 'cloudinary-react';
import { UserRoles } from '../../shared/user-roles';
import avatar from '../../../images/ampled_avatar.svg';

interface Props {
  artist: any;
  openWhyModal: any;
  isSupporter: boolean;
  loggedUserAccess: { role: string; artistId: number };
  handleSupportClick: Function;
}

export class Supporters extends React.Component<Props, any> {
  canLoggedUserPost = () => {
    return (
      this.props.loggedUserAccess &&
      (this.props.loggedUserAccess.role === UserRoles.Admin ||
        this.props.loggedUserAccess.role === UserRoles.Member ||
        this.props.loggedUserAccess.role === UserRoles.Owner)
    );
  };

  handlePublicID = (image: string) => {
    const url = image.split('/');
    const part_1 = url[url.length - 2];
    const part_2 = url[url.length - 1];
    return part_1 + '/' + part_2;
  };

  renderSupporterHover = ({ supporter }) => {
    const artist_name = this.props.artist.name;
    return (
      <div className="supporter__hover-card">
        <div className="supporter__hover-card_header">
          {supporter.profile_image_url && (
            <div className="supporter__hover-card_header_photo">
              <Image
                publicId={this.handlePublicID(supporter.profile_image_url)}
                alt={supporter.name}
                className="supporter__hover-card_header_photo_image"
              >
                <Transformation
                  crop="fill"
                  width={100}
                  height={100}
                  responsive_placeholder="blank"
                />
              </Image>
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
            <Image
              publicId={this.handlePublicID(supporter.profile_image_url)}
              alt={supporter.name}
              className="artist-header__person_image"
              style={style}
            >
              <Transformation
                crop="fill"
                width={60}
                height={60}
                responsive_placeholder="blank"
              />
            </Image>
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
      <div>
        {this.renderSupportersContainer()}
        {!this.props.isSupporter &&
          !this.canLoggedUserPost() &&
          isStripeSetup &&
          this.renderSupportButton()}
      </div>
    );
  }
}
