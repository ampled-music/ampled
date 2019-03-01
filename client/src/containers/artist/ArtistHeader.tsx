import * as React from 'react';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './artist.scss';


interface OwnersProps {
  id: string;
  name: string;
  profile_image_url: string;
}
interface SupportersProps {
  id: string;
  name: string;
  profile_image_url: string;
}
interface Props {
  name: string;
  id: number;
  accentColor: string;
  bannerImageUrl: string;
  videoUrl: string;
  openVideoModal: React.MouseEventHandler;
  openPostModal: React.MouseEventHandler;
  userAuthenticated: boolean;
  owners: OwnersProps[];
  supporters: SupportersProps[];
}


class ArtistHeader extends React.Component<Props, any> {
  constructor(props) {
    super(props);

    this.state = {
      showConfirmationDialog: false,
    };
  }

  render() {
    const { 
      name,
      accentColor,
      bannerImageUrl,
      videoUrl,
      owners,
      supporters,
      userAuthenticated
    } = this.props;

    return (
      <div className="artist-header container">
        {' '}
        {/* Main Section */}
        <div className="row">
          <div className="col-md-8">
            {/* Left Side */}
            <div className="artist-header__title">{name}</div>
            <div className="artist-header__photo-container" style={{ borderColor: accentColor }} >
              <div className="artist-header__persons">
                {owners.map((owner) => {
                  return (
                    <div key={`owner-${owner.id}`} id={`owner-${owner.id}`} className="artist-header__person">
                      {owner.profile_image_url ? (
                        <img className="artist-header__person_image" src={owner.profile_image_url} alt={owner.name} style={{ borderColor: accentColor }} />
                      ) :
                        <FontAwesomeIcon className="artist-header__person_svg" icon={faUserCircle} style={{ borderColor: accentColor }} />
                      }
                    </div>
                  );
                })}
              </div>
              <div className="artist-header__photos">
                <img className="artist-header__photo" src={bannerImageUrl} />
              </div>
            </div>
          </div>
          {/* Close Left Side */}

          <div className="col-md-4">
            {/* Right Side */}
            <div className="artist-header__message">A Message From The Band</div>

            {userAuthenticated && (
              <div className="new-post">
                <button onClick={this.props.openPostModal}>
                  <span>New Post</span>
                  <FontAwesomeIcon icon={faPlus} color="#ffffff" />
                </button>
              </div>
            )}

            <div className="artist-header__message-container" style={{ borderColor: accentColor }}>
              <button onClick={this.props.openVideoModal} className="artist-header__play">
                <FontAwesomeIcon className="artist-header__play_svg" icon={faPlay} style={{ color: accentColor }} />
              </button>
              <img className="artist-header__message-image" src={videoUrl} />
            </div>

            <div className="artist-header__supporters">

              <div className="artist-header__supporter-title">{supporters.length} Supporters</div>

              {supporters.slice(0,2).map((supporter) => {
                return (
                  <div className="row align-items-center">
                    <div className="col-3">
                      <div key={`supporter-${supporter.id}`} id={`supporter-${supporter.id}`} className="artist-header__person">
                        {supporter.profile_image_url ? (
                          <img className="artist-header__person_image" src={supporter.profile_image_url} alt={supporter.name} style={{ borderColor: accentColor }} />
                        ) :
                          <FontAwesomeIcon className="artist-header__person_svg" icon={faUserCircle} style={{ borderColor: accentColor }} />
                        }
                      </div>
                    </div>
                    <div className="col-9">
                      <div className="artist-header__person_name">{supporter.name}</div>
                      <div className="artist-header__person_quote"></div>
                    </div>
                  </div>
                );
              })}

              <div className="row justify-content-start no-gutters">
                {supporters.slice(2,24).map((supporter) => {
                  return (
                    <div className="col-2">
                      <div key={`supporter-${supporter.id}`} id={`supporter-${supporter.id}`} className="artist-header__person_small">
                        {supporter.profile_image_url ? (
                          <img className="artist-header__person_image" src={supporter.profile_image_url} alt={supporter.name} style={{ borderColor: accentColor }} />
                        ) :
                          <FontAwesomeIcon className="artist-header__person_svg" icon={faUserCircle} style={{ borderColor: accentColor }} />
                        }
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
          {/* Close Right Side */}
        </div>
      </div>
    );
  }
}

export { ArtistHeader };
