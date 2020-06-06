import * as React from 'react';

import npr from '../../images/logos/npr-logo.png';
import salon from '../../images/logos/salon-logo.png';
import vice from '../../images/logos/vice-logo.png';
import adhoc from '../../images/logos/adhoc-logo.png';
import pitchfork from '../../images/logos/pitchfork-logo.png';

export const HomeGarden = () => (
  <div className="home-garden">
    <div className="container">
      <h3 className="home-garden__title">Featured In</h3>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="row justify-content-center">
            <div className="col-md-4 home-garden__logo_contain">
              <a
                href="https://www.marketplace.org/2020/04/27/musicians-virtual-concerts-covid19-pandemic/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="home-garden__logo">
                  <img
                    className="home-garden__logo_image"
                    src={npr}
                    alt="NPR"
                  />
                </div>
              </a>
            </div>
            <div className="col-md-4 home-garden__logo_contain">
              <a
                href="https://www.salon.com/2020/01/18/how-apunk-inspired-collective-beat-the-streaming-giants-at-their-own-game/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="home-garden__logo">
                  <img
                    className="home-garden__logo_image"
                    src={salon}
                    alt="Salon"
                  />
                </div>
              </a>
            </div>
            <div className="col-md-4 home-garden__logo_contain">
              <a
                href="https://www.vice.com/en_us/article/v749p3/theres-no-such-thing-s-independent-music-in-the-age-of-coronavirus"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="home-garden__logo">
                  <img
                    className="home-garden__logo_image"
                    src={vice}
                    alt="Vice"
                  />
                </div>
              </a>
            </div>
            <div className="col-md-4 home-garden__logo_contain">
              <a
                href="https://www.adhoc.fm/post/ampled-helps-support-artists/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="home-garden__logo">
                  <img
                    className="home-garden__logo_image"
                    src={adhoc}
                    alt="AdHoc"
                  />
                </div>
              </a>
            </div>
            <div className="col-md-4 home-garden__logo_contain">
              <a
                href="https://pitchfork.com/thepitch/how-much-more-money-artists-earn-from-bandcamp-compared-to-spotify-apple-music-youtube/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="home-garden__logo">
                  <img
                    className="home-garden__logo_image"
                    src={pitchfork}
                    alt="Pitchfork"
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
