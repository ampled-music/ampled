import './home.scss';

import * as React from 'react';
import cx from 'classnames';

import { Footer } from '../footer/Footer';
import { HomeArtists } from './HomeArtists';
import { HomeFor } from './HomeFor';
import { HomeHeader } from './HomeHeader';
import { HomeHow } from './HomeHow';
import { HomeGarden } from './HomeGarden';
import { Texture } from '../shared/texture/Texture';

import { IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

class Home extends React.Component<any> {
  state = {
    showBanner: window.localStorage.getItem('close-banner') ? false : true,
  };

  renderSticky = () => (
    <div className={cx('artistAlertHeader', { active: this.state.showBanner })}>
      <span>
        As a response to COVID-19, artists will receive 100% of support through
        Ampled. We will waive artist membership dues for the rest of 2020.{' '}
        <a
          href="https://app.ampled.com/zine/ampled-artist-membership-is-now-open-join-today"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more
        </a>
        .
      </span>
      <IconButton
        className="artistAlertHeader__close-button"
        aria-label="close"
        onClick={this.closeBanner}
        style={{ width: '30px', height: '30px' }}
      >
        <FontAwesomeIcon icon={faTimes} />
      </IconButton>
    </div>
  );

  closeBanner = () => {
    window.localStorage.setItem('close-banner', 'true');
    this.setState({ showBanner: false });
  };

  render() {
    return (
      <div className="home-section">
        {this.renderSticky()}
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
        {/* <HomeBrowse /> */}
        <Footer />
      </div>
    );
  }
}

export { Home };
