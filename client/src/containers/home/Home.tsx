import './home.scss';

import * as React from 'react';

import { Footer } from '../footer/Footer';
import { HomeArtists } from './HomeArtists';
import { HomeFor } from './HomeFor';
import { HomeHeader } from './HomeHeader';
import { HomeHow } from './HomeHow';
import { Texture } from '../shared/texture/Texture';

class Home extends React.Component<any> {

  randomColor = () => {
    const bgColor = ['#e9c7c6', '#eddfbd', '#baddac', '#cae4e7'];
    return bgColor[Math.floor(Math.random() * bgColor.length)];
  };
  
  render() {
    const randomColor = this.randomColor();

    return (
      <div className="home-section">
        <HomeHeader
          bgColor={randomColor}
        />
        <Texture 
          positionTop25={false}
          positionTop50={true}
          positionFlip={false}
        />
        <HomeFor />
        <HomeHow 
          bgColor={randomColor}
        />
        {/* <Texture 
          positionTop25={true}
          positionTop50={false}
          positionFlip={true}
        /> */}
        <HomeArtists 
          bgColor={randomColor}
        />
        <Footer 
          bgColor={randomColor}
        />
      </div>
    )
  };
}

export { Home };
