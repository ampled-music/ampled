import * as React from 'react';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import atticus_ross from '../../test/atticus_ross.jpg';
import trent_reznor from '../../test/trent_reznor.jpg';

import './artist.scss';


interface OwnersProps {
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
  openPostModal: React.MouseEventHandler;
  userAuthenticated: boolean;
  owners: OwnersProps[];
}


class ArtistHeader extends React.Component<Props, any> {
  constructor(props) {
    super(props);

    this.state = {
      showConfirmationDialog: false,
    };
  }

  getOwnerImage(owner) {
    return owner.profile_image_url ? owner.profile_image_url : 'poop' ;
  }

  render() {
    const { name, accentColor, bannerImageUrl, videoUrl, owners, userAuthenticated } = this.props;
                
    console.log(owners);

    return (
      <div className="artist-header container">
        {' '}
        {/* Main Section */}
        <div className="row">
          <div className="col-md-8">
            {/* Left Side */}
            <div className="artist-header__title">{name}</div>
            <div className="artist-header__photo-container" style={{ borderColor: accentColor }} >
              <div className="artist-header__members">
                {owners.map((owner) => {
                  return (
                    <div key={`owner-${owner.id}`} id={`owner-${owner.id}`} className="artist-header__member">
                      {owner.profile_image_url ? (
                        <img className="artist-header__member_image" src={owner.profile_image_url} alt={owner.name} style={{ borderColor: accentColor }} />
                      ) : 
                        <FontAwesomeIcon className="artist-header__member_svg" icon={faUserCircle} style={{ borderColor: accentColor }} />
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
              <img className="artist-header__message-image" src={videoUrl} />
            </div>

            <div className="artist-header__supporters">
              <div className="artist-header__supporter-title">2 Supporters</div>

              <div className="row align-items-center">
                <div className="col-3">
                  <img className="artist-header__member" style={{ borderColor: accentColor }} src={trent_reznor} />
                </div>
                <div className="col-9">
                  <div className="artist-header__member_name">Trent R.</div>
                  <div className="artist-header__member_quote">
                    I think there's something strangely musical about noise.
                  </div>
                </div>
              </div>

              <div className="row align-items-center">
                <div className="col-3">
                  <img className="artist-header__member" style={{ borderColor: accentColor }} src={atticus_ross} />
                </div>
                <div className="col-9">
                  <div className="artist-header__member_name">Atticus R.</div>
                  <div className="artist-header__member_quote">Sure Trent, whatever.</div>
                </div>
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
