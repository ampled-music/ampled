import './home.scss';

import * as React from 'react';

import { Footer } from '../footer/Footer';
import { HomeArtists } from './HomeArtists';
import { HomeFor } from './HomeFor';
import { HomeHeader } from './HomeHeader';
import { HomeHow } from './HomeHow';
import { Texture } from '../shared/texture/Texture';

class Home extends React.Component<any> {
  render() {
    return (
      <div className="home-section">
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
