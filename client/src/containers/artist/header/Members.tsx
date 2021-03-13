import './artist-header.scss';

import * as React from 'react';
import { UserImage } from '../../user-details/UserImage';

interface Props {
  artist: any;
}

export class Members extends React.Component<Props, any> {
  isAmpled = () => {
    return this.props.artist.slug === 'community';
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

  render() {
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
              <div className="member-name">{owner.name}</div>
            </div>
          ))}
      </div>
    );
  }
}
