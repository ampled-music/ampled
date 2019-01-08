import * as React from 'react';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import atticus_ross from '../../test/atticus_ross.jpg';
import nin_video from '../../test/nin_video.jpg';
import nine_inch_nails_1 from '../../test/nine_inch_nails_1.jpg';
import nine_inch_nails_2 from '../../test/nine_inch_nails_2.jpg';
import nine_inch_nails_3 from '../../test/nine_inch_nails_3.jpg';
import nine_inch_nails_4 from '../../test/nine_inch_nails_4.jpg';
import trent_reznor from '../../test/trent_reznor.jpg';

import './artist.scss';

interface Props {
  name: string;
  id: number;
  accentColor: string;
  openPostModal: React.MouseEventHandler;
  userAuthenticated: boolean;
}

class ArtistHeader extends React.Component<Props, any> {
  constructor(props) {
    super(props);

    this.state = {
      showConfirmationDialog: false,
    };
  }

  render() {
    const { name, accentColor, userAuthenticated } = this.props;

    return (
      <div className="artist-header container">
        {' '}
        {/* Main Section */}
        <div className="row">
          <div className="col-md-8">
            {/* Left Side */}
            <div className="artist-header__title">{name}</div>

            <div className="row">
              <div className="col-3 artist-header__members" style={{ borderColor: accentColor }}>
                <img className="artist-header__member" style={{ borderColor: accentColor }} src={trent_reznor} />
                <img className="artist-header__member" style={{ borderColor: accentColor }} src={atticus_ross} />
              </div>
              <div className="col-9 artist-header__photos" style={{ borderColor: accentColor }}>
                <img className="artist-header__photo" src={nine_inch_nails_4} />
                <img className="artist-header__photo" src={nine_inch_nails_3} />
                <img className="artist-header__photo" src={nine_inch_nails_2} />
                <img className="artist-header__photo" src={nine_inch_nails_1} />
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
              <img className="artist-header__message-image" src={nin_video} />
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
