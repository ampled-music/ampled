import * as React from 'react';

import { Nav } from '../nav/Nav';

import { HomeHeader } from './HomeHeader';
import { HomeFor } from './HomeFor';
import { HomeHow } from './HomeHow';
import { HomeArtists } from './HomeArtists';

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
      </div>
    );
  }
}

export { Home };
