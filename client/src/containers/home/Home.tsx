import './home.scss';

import * as React from 'react';

import { Footer } from '../footer/Footer';
import { HomeArtists } from './HomeArtists';
import { HomeFor } from './HomeFor';
import { HomeHeader } from './HomeHeader';
import { HomeHow } from './HomeHow';
import { HomeTexture } from './HomeTexture';


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
        <HomeTexture />
        <HomeFor />
        <HomeHow 
          bgColor={randomColor}
        />
        <HomeTexture />
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
