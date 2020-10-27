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
            A platform designed to put artists first.
          </p>
          <hr className="hr__thick" />
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-4">
          <img
            className="home-for__image"
            src={owned_by}
            alt="Artist Owned Co-op"
          />
          <h3 className="home-for__sub-title">Artist Owned Co-op</h3>
          <p className="home-for__copy">
            100% owned by artists and workers - not vulture capitalists.
          </p>
          <a href="https://docs.ampled.com/coop/">
            <button className="home-for__button btn btn-ampled">
              Read More
            </button>
          </a>
        </div>
        <div className="col-md-4">
          <img
            className="home-for__image"
            src={transparent}
            alt="Transparent"
          />
          <h3 className="home-for__sub-title">Transparent</h3>
          <p className="home-for__copy">
            We’ve opened up our books to stay accountable to our members.
          </p>
          <a href="/page/open-dashboard">
            <button className="home-for__button btn btn-ampled">
              Learn More
            </button>
          </a>
        </div>
        <div className="col-md-4">
          <img className="home-for__image" src={mission} alt="Mission-Driven" />
          <h3 className="home-for__sub-title">Mission-Driven</h3>
          <p className="home-for__copy">
            We’re making music more equitable for artists in an ethical and
            transparent way.
          </p>
          <a href="/page/who-we-are/">
            <button className="home-for__button btn btn-ampled">
              Our Vision
            </button>
          </a>
        </div>
      </div>
    </div>
  </div>
);
