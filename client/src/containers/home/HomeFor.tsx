import * as React from 'react';

import mission from '../../images/home/home_for_mission.png';
import owned_by from '../../images/home/home_for_owned_by_2.png';
import transparent from '../../images/home/home_for_transparent.png';
import fair from '../../images/home/home_for_fair.png';

export const HomeFor = () => (
  <div className="home-for">
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <h1 className="home-for__title">Made for music</h1>
          <p className="home-for__mission">How Ampled puts artists first</p>
          <hr className="hr__thick" />
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-3">
          <img
            className="home-for__image"
            src={owned_by}
            alt="Artist Owned Co-op"
          />
          <h3 className="home-for__sub-title">Artist Owned</h3>
          <p className="home-for__copy">
            Artists and workers own 100% of Ampled — not venture capitalists –
            and determine how it grows.
          </p>
          <a href="https://docs.ampled.com/coop/">
            <button className="home-for__button btn btn-ampled">
              Our Co-op
            </button>
          </a>
        </div>
        <div className="col-md-3">
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
              Take a look
            </button>
          </a>
        </div>
        <div className="col-md-3">
          <img className="home-for__image" src={mission} alt="Mission-Driven" />
          <h3 className="home-for__sub-title">Mission-Driven</h3>
          <p className="home-for__copy">
            We’re a supportive community of musicians organizing together for a
            more equitable future.
          </p>
          <a href="/page/who-we-are/">
            <button className="home-for__button btn btn-ampled">
              Our Vision
            </button>
          </a>
        </div>
        <div className="col-md-3">
          <img className="home-for__image" src={fair} alt="Fair" />
          <h3 className="home-for__sub-title">Fair</h3>
          <p className="home-for__copy">
            Artists choose what % of their support goes towards our operating
            expenses.
          </p>
          <a href="/page/who-we-are/">
            <button className="home-for__button btn btn-ampled">
              Read More
            </button>
          </a>
        </div>
      </div>
    </div>
  </div>
);
