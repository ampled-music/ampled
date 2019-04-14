import './home.scss';

import * as React from 'react';

import { Footer } from '../footer/Footer';
import { HomeArtists } from './HomeArtists';
import { HomeFor } from './HomeFor';
import { HomeHeader } from './HomeHeader';
import { HomeHow } from './HomeHow';

export const Home = () => (
  <div>
    <HomeHeader />
    <HomeFor />
    <HomeHow />
    <HomeArtists />
    <Footer />
  </div>
);
