import * as React from 'react';

import header_collage from '../../images/home/home_header_collage_2.png';

export const HomeHeader = () => (
  <div className="home-header">
    <div className="container">
      <div className="home-header__support">Support for Artists</div>
      <div className="home-header__bg-image" style={{backgroundImage: `url(${header_collage}`}}>
        <div className="row">
          <div className="col-md-4">
            <div className="home-header__info">
              Ampled is a space where music artists post unreleased, unique, or exclusive content and are directly
              supported on a monthly basis by their audience.
            </div>
            <button className="home-header__button btn">Create an Artist Page</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
