import * as React from 'react';

import { Nav } from '../nav/Nav';
import { Footer } from '../footer/Footer';

import { HomeHeader } from './HomeHeader';
import { HomeFor } from './HomeFor';
import { HomeHow } from './HomeHow';
import { HomeArtists } from './HomeArtists';

import './home.scss';

interface Props {
}

interface State {
}

class Home extends React.Component<Props, State> {

  render() {

    return (
      <div>
        <Nav />
        <HomeHeader />
        <HomeFor />
        <HomeHow />
        <HomeArtists />
        <Footer />
      </div>
    );
  }
}

export { Home };
