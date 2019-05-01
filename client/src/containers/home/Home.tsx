import './home.scss';

import * as React from 'react';

import { Footer } from '../footer/Footer';
import { HomeArtists } from './HomeArtists';
import { HomeFor } from './HomeFor';
import { HomeHeader } from './HomeHeader';
import { HomeHow } from './HomeHow';
import { HomeMembership } from './HomeMembership';

export const Home = () => (
  <div className="home-section">
    <HomeHeader />
    <HomeFor />
    <HomeHow />
    <HomeArtists />
    <HomeMembership />
    <Footer />
  </div>
);
