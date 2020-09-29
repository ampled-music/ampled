import './artist-header.scss';

import * as React from 'react';
import * as R from 'ramda';
import { UserRoles } from '../../shared/user-roles';
import { UserImage } from '../../user-details/UserImage';

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

  isAmpled = () => {
    return this.props.artist.slug === 'community';
  };

  renderSupporterHover = ({ supporter }) => {
    const artist_name = this.props.artist.name;
    return (
      <div className="supporter__hover-card">
        <div className="supporter__hover-card_header">
          {supporter.image?.public_id && (
            <div className="supporter__hover-card_header_photo">
              <UserImage
                image={supporter.image}
                className="supporter__hover-card_header_photo_image"
                alt={supporter.name}
                width={60}
                key={`hover-${supporter.name}`}
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
          <UserImage
            image={supporter.image}
            className="artist-header__person_image"
            alt={supporter.name}
            width={60}
            style={style}
          />
        </div>
      </div>
    );
  };

  render() {
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
          <>
            <div className="artist-header__supporters_title">
              {artist.supporter_count}{' '}
              {this.isAmpled()
                ? `Member${artist.supporters.length > 1 ? 's' : ''}`
                : `Supporter${artist.supporters.length > 1 ? 's' : ''}`}
            </div>
            <div className="artist-header__supporters_recent">
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
            <div className="artist-header__supporters_all">
              {artist.supporters
                .filter(
                  (supporter) =>
                    !R.equals(
                      R.path(['most_recent_supporter', 'id'], artist),
                      +supporter.id,
                    ),
                )
                .map((supporter) => (
                  <RenderSupporter
                    key={`minisupporter-${supporter.id}`}
                    supporter={supporter}
                    borderColor
                    isSmall
                  />
                ))}
            </div>
          </>
        )}
      </div>
    );
  }
}
