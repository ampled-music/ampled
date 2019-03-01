import * as React from 'react';

import owned_by from '../../images/home/home_for_owned_by.png';
import transparent from '../../images/home/home_for_transparent.png';
import mission from '../../images/home/home_for_mission.png';


interface Props {
}

class HomeFor extends React.Component<Props, any> {
  render() {
    return (
      <section className="home-for">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="home-for__title">
                Built For Artists
                            </h1>
              <p className="home-for__mission">
                Ampled is a mission-driven company created by artists. That means we do things differently.
                            </p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <img className="home-for__image" src={owned_by} />
              <h3 className="home-for__sub-title">
                Owned By Artists
                            </h3>
              <p className="home-for__copy">
                Create an artist page and earn an ownership stake in the company. We believe artists should share in the value extracted from their content.
                            </p>
              <button className="home-for__button btn">
                Read More
                            </button>
            </div>
            <div className="col-md-4">
              <img className="home-for__image" src={transparent} />
              <h3 className="home-for__sub-title">
                Transparent Financials
                            </h3>
              <p className="home-for__copy">
                Every cent that goes through Ampled is public and can be tracked to an exact expense as we believe in accountability and fairness.
                            </p>
              <button className="home-for__button btn">
                Learn More
                            </button>
            </div>
            <div className="col-md-4">
              <img className="home-for__image" src={mission} />
              <h3 className="home-for__sub-title">
                Missions Driven
                            </h3>
              <p className="home-for__copy">
                We can care about people and profits. We give 1% of revenue to grassroots music organizations in Brooklyn.
                            </p>
              <button className="home-for__button btn">
                Read Our Charter
                            </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export { HomeFor };
