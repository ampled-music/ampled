import * as React from 'react';

import mission from '../../images/home/home_for_mission.png';
import owned_by from '../../images/home/home_for_owned_by.png';
import transparent from '../../images/home/home_for_transparent.png';

export const HomeFor = () => (
  <div className="home-for">
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <h1 className="home-for__title">Built For Music</h1>
          <p className="home-for__mission">
            Ampled is a mission-driven platform created by and for artists.  That means we do some things differently.
          </p>
          <hr className="hr__thick"/>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-4">
          <img className="home-for__image" src={owned_by} />
          <h3 className="home-for__sub-title">Artist Owned Co-op</h3>
          <p className="home-for__copy">
            We’re a platform 100% owned and governed by our artists and members - not VC investors.  Join us and become a member-owner.
          </p>
          <a href="http://ampled.com/coop"><button className="home-for__button btn btn-ampled">Read More</button></a>
        </div>
        <div className="col-md-4">
          <img className="home-for__image" src={transparent} />
          <h3 className="home-for__sub-title">Radically Transparent</h3>
          <p className="home-for__copy">
            We’ve made our finances transparent to stay accountable to our members.  View our revenue, expenses, salaries, and more.
          </p>
          <a href="http://ampled.com/transparency"><button className="home-for__button btn btn-ampled">Learn More</button></a>
        </div>
        <div className="col-md-4">
          <img className="home-for__image" src={mission} />
          <h3 className="home-for__sub-title">Mission-Driven</h3>
          <p className="home-for__copy">
            Our mission is to make music more equitable for artists and to operate ethically and transparently. Let’s work together.
          </p>
          <a href="http://ampled.com/our-mission"><button className="home-for__button btn btn-ampled">Our Vision</button></a>
        </div>
      </div>
    </div>
  </div>
);
