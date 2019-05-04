import * as React from 'react';

import { config } from 'src/config';
import support from '../../images/home/home_header_support.png';
import header_collage from '../../images/home/home_header_collage_2.png';

const openInNewTab = (url: string) => {
  var win = window.open(url, '_blank');
  win.focus();
};

export const HomeHeader = () => (
  <div className="home-header">
    <div className="container">
      <div className="home-header__support">Direct Community Support <br/> for Artists</div>
      <div className="home-header__bg-image" style={{backgroundImage: `url(${header_collage}`}}>
        <div className="row">
          <div className="col-md-4">
            <div className="home-header__info">
            Simple recurring payments directly to music artists on a platform owned by artists.  Own your creative freedom and sustainably continue making art for the people that love it. Join us and become a member-owner of an alternative platform that values artists.
            </div>
            <button className="home-header__button btn">Create an Artist Page</button>
          </div>
          <button className="home-header__button btn" onClick={() => openInNewTab(config.menuUrls.createArtist)}>
            Create an Artist Page
          </button>
        </div>
      </div>
    </div>
  </div>
);
