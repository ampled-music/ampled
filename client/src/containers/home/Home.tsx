import './home.scss';

import * as React from 'react';

import { Footer } from '../footer/Footer';
import { HomeArtists } from './HomeArtists';
import { HomeFor } from './HomeFor';
import { HomeHeader } from './HomeHeader';
import { HomeHow } from './HomeHow';
import { Texture } from '../shared/texture/Texture';

class Home extends React.Component<any> {
  state = {
    randomColor: undefined,
  };

  randomColor = () => {
    const bgColor = ['#e9c7c6', '#eddfbd', '#baddac', '#cae4e7'];
    return bgColor[Math.floor(Math.random() * bgColor.length)];
  };

  constructor(props) {
    super(props);
    this.state = {
      randomColor: this.randomColor(),
    };
  }

  render() {
    const { randomColor } = this.state;

    return (
      <div className="home-section">
        <HomeHeader bgColor={randomColor} />
        <Texture
          positionTop25={false}
          positionTop50={true}
          positionFlip={false}
        />
        <HomeFor />
        <HomeHow bgColor={randomColor} />
        <Texture
          positionTop25={true}
          positionTop50={false}
          positionFlip={true}
        />
        <HomeArtists bgColor={randomColor} />
        <Footer />
      </div>
    );
  }
}

export { Home };
