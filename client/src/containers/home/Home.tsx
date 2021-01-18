import './home.scss';

import * as React from 'react';
import cx from 'classnames';
import * as store from 'store';
import { ReactSVG } from 'react-svg';

import { HomeArtists } from './HomeArtists';
import { HomeFor } from './HomeFor';
import { HomeHeader } from './HomeHeader';
import { HomeHow } from './HomeHow';
import { HomeGarden } from './HomeGarden';
import { Texture } from '../shared/texture/Texture';

class Home extends React.Component<any> {
  state = {
    showBanner: store.get('close-banner') ? false : true,
  };

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
        <HomeGarden />
      </div>
    );
  }
}

export { Home };
