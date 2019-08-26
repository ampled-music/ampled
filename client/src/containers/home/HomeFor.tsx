import * as React from 'react';

import mission from '../../images/home/home_for_mission.png';
import owned_by from '../../images/home/home_for_owned_by.png';
import transparent from '../../images/home/home_for_transparent.png';

export const HomeFor = () => (
  <div className="home-for">
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <h1 className="home-for__title">Made for music</h1>
          <p className="home-for__mission">
            We’re an ethical platform owned by its users.
          </p>
          <hr className="hr__thick"/>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-4">
          <img className="home-for__image" src={owned_by} />
          <h3 className="home-for__sub-title">Artist Owned Co-op</h3>
          <p className="home-for__copy">
            100% owned by artists, workers, and community - not reptilian overlords.
          </p>
          <a href="http://app.ampled.com/coop"><button className="home-for__button btn btn-ampled">Read More</button></a>
        </div>
        <div className="col-md-4">
          <img className="home-for__image" src={transparent} />
          <h3 className="home-for__sub-title">Transparent</h3>
          <p className="home-for__copy">
            We’ve opened up our books to stay accountable to our members.
          </p>
          <a href="http://app.ampled.com/transparency"><button className="home-for__button btn btn-ampled">Learn More</button></a>
        </div>
        <div className="col-md-4">
          <img className="home-for__image" src={mission} />
          <h3 className="home-for__sub-title">Mission-Driven</h3>
          <p className="home-for__copy">
            We’re making music more equitable for artists in an ethical and transparent way.
          </p>
          <a href="http://app.ampled.com/our-mission"><button className="home-for__button btn btn-ampled">Our Vision</button></a>
        </div>
      </div>
    </div>
  </div>
);
