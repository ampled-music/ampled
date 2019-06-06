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

class HomeHeader extends React.Component<Props,any> {

  render() {
    return (
      <div className="home-header container-fluid" style={{ backgroundColor: this.props.bgColor }}>
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-3">
            <div className="home-header__support">Support for any sound</div>
            <div className="home-header__info">
              Receive support via direct payments from your community. Own your creative freedom and sustainably continue making art for the people who love it. Join us and become a member-owner of an alternative platform that puts artists first.
            </div>
            <button className="home-header__button btn" onClick={() => openInNewTab(config.menuUrls.createArtist)}>
              Create Your Page
            </button>
          </div>
          <div className="col-lg-6">
            <img className="home-header__image" src={header_collage} />
          </div>
        </div>
      </div>
    );
  }
}

export { HomeHeader };
