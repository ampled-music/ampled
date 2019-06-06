import './home.scss';

import * as React from 'react';

import { Footer } from '../footer/Footer';
import { HomeArtists } from './HomeArtists';
import { HomeFor } from './HomeFor';
import { HomeHeader } from './HomeHeader';
import { HomeHow } from './HomeHow';
import { HomeTexture } from './HomeTexture';

export const Home = () => (
  <div className="home-section">
    <HomeHeader />
    <HomeTexture />
    <HomeFor />
    <HomeHow />
    <HomeArtists />
    <Footer />
  </div>
);
