import './home.scss';

import * as React from 'react';

import { Footer } from '../footer/Footer';
import { HomeArtists } from './HomeArtists';
import { HomeFor } from './HomeFor';
import { HomeHeader } from './HomeHeader';
import { HomeHow } from './HomeHow';
import { Texture } from '../shared/texture/Texture';

class Home extends React.Component<any> {

  renderSticky = (message: any) => (
    <div className="artistAlertHeader">{message}</div>
  );

  render() {
    return (
      <div className="home-section">
        {this.renderSticky(
          <span>
            As a response to COVID-19, artists will receive 100% of support
            through the platform. We will waive artist membership dues for the
            rest of 2020.{' '}
            <a
              href="https://app.ampled.com/zine/ampled-artist-membership-is-now-open-join-today"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
            </a>
            .
          </span>,
        )}
        <HomeHeader />
        <Texture
          positionTop25={false}
          positionTop50={true}
          positionFlip={false}
        />
        <HomeFor />
        <HomeHow />
        <Texture
          positionTop25={true}
          positionTop50={false}
          positionFlip={true}
        />
        <HomeArtists />
        {/* <HomeBrowse /> */}
        <Footer />
      </div>
    );
  }
}

export { Home };
