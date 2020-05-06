import './home.scss';

import * as React from 'react';

import { Footer } from '../footer/Footer';
import { HomeArtists } from './HomeArtists';
import { HomeFor } from './HomeFor';
import { HomeHeader } from './HomeHeader';
import { HomeHow } from './HomeHow';
import { Texture } from '../shared/texture/Texture';

import { IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

class Home extends React.Component<any> {

  renderSticky = (message: any) => (
    <div className="artistAlertHeader">{message}</div>
  );

  closeBanner = () => {
    // Set cookie and prop?
  };

  render() {
    return (
      <div className="home-section">
        {this.renderSticky(
          <div>
            <span>
              As a response to COVID-19, artists will receive 100% of support
              through the platform. We will waive artist membership dues for the
              rest of 2020.{' '}
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
              style={{ width: '50px', height: '50px' }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </div>,
        )}
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
        {/* <HomeBrowse /> */}
        <Footer />
      </div>
    );
  }
}

export { Home };
