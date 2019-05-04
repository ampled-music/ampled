import * as React from 'react';

import { config } from 'src/config';
import header_collage from '../../images/home/home_header_collage_2.png';

const openInNewTab = (url: string) => {
  var win = window.open(url, '_blank');
  win.focus();
};

export const HomeHeader = () => (
  <div className="home-header container-fluid">
    <div className="home-header__bg-image row justify-content-center" style={{backgroundImage: `url(${header_collage}`}}>
    <div className="home-header__support">Direct Community Support for Artists</div>
      <div className="col-md-6 align-self-end">
        <div className="home-header__info">
          Simple recurring payments directly to music artists on a platform owned by artists.  Own your creative freedom and sustainably continue making art for the people that love it. Join us and become a member-owner of an alternative platform that values artists.
        </div>
        <button className="home-header__button btn" onClick={() => openInNewTab(config.menuUrls.createArtist)}>
          Create an Artist Page
        </button>
      </div>
    </div>
  </div>
);
