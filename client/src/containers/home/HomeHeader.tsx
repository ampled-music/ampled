import * as React from 'react';

import { config } from 'src/config';
import header_collage from '../../images/home/home_header_collage_4.png';

const openInNewTab = (url: string) => {
  var win = window.open(url, '_blank');
  win.focus();
};

interface Props {
  bgColor: string;
}

class HomeHeader extends React.Component<Props, any> {

  render() {
    return (
      <div className="home-header container-fluid" style={{ backgroundColor: this.props.bgColor }}>
        <div className="row align-items-center justify-content-xl-center">
          <div className="col-lg-4 col-xl-3">
            <div className="home-header__support">Own your creative freedom</div>
            <div className="home-header__info">
              For artists of any sound or size. Receive support via direct payments from your community and sustainably make music.
            </div>
            <button className="home-header__button btn btn-ampled" onClick={() => openInNewTab(config.menuUrls.createArtist)}>
              Create Your Page
            </button>
          </div>
          <div className="col-lg-8 col-xl-6">
            <img className="home-header__image" src={header_collage} />
          </div>
        </div>
      </div>
    );
  }
}

export { HomeHeader };
