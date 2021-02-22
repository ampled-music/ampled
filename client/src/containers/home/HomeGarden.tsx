import * as React from 'react';
// import { Link } from 'react-router-dom';

import npr from '../../images/logos/npr-logo.png';
import salon from '../../images/logos/salon-logo.png';
import vice from '../../images/logos/vice-logo.png';
import adhoc from '../../images/logos/adhoc-logo.png';
import pitchfork from '../../images/logos/pitchfork-logo.png';
import fastcompany from '../../images/logos/fastcompany-logo.png';

import newinc from '../../images/logos/newinc-logo.png';
import newschool from '../../images/logos/new-school-logo.png';
import startcoop from '../../images/logos/startcoop-logo.png';
import cci from '../../images/logos/cci-logo.png';
import creativecommons from '../../images/logos/creative-commons-logo.png';
import mozilla from '../../images/logos/mozilla-logo.png';
import gftw from '../../images/logos/gftw-logo.png';
import cuny from '../../images/logos/cuny-logo.png';
import usdac from '../../images/logos/usdac-logo.png';
import seedclub from '../../images/logos/seed-club-logo.png';

export const HomeGarden = () => (
  <div className="home-garden">
    <div className="container">
      <h3 className="home-garden__title">Featured In</h3>
      <div className="home-garden__feature">
        <a
          href="https://www.marketplace.org/2020/04/27/musicians-virtual-concerts-covid19-pandemic/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="home-garden__feature_logo">
            <img src={npr} alt="NPR" />
          </div>
        </a>
        <a
          href="https://www.salon.com/2020/01/18/how-apunk-inspired-collective-beat-the-streaming-giants-at-their-own-game/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="home-garden__feature_logo">
            <img src={salon} alt="Salon" />
          </div>
        </a>
        <a
          href="https://www.vice.com/en_us/article/v749p3/theres-no-such-thing-s-independent-music-in-the-age-of-coronavirus"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="home-garden__feature_logo">
            <img src={vice} alt="Vice" />
          </div>
        </a>
        <a
          href="https://www.adhoc.fm/post/ampled-helps-support-artists/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="home-garden__feature_logo">
            <img src={adhoc} alt="AdHoc" />
          </div>
        </a>
        <a
          href="https://pitchfork.com/thepitch/how-much-more-money-artists-earn-from-bandcamp-compared-to-spotify-apple-music-youtube/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="home-garden__feature_logo">
            <img src={pitchfork} alt="Pitchfork" />
          </div>
        </a>
        <a
          href="https://www.fastcompany.com/90513685/we-must-turn-technology-into-a-force-for-justice"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="home-garden__feature_logo">
            <img src={fastcompany} alt="Fastcompany" />
          </div>
        </a>
      </div>

      <h3 className="home-garden__title">Supported By</h3>
      <div className="home-garden__supported">
        <div className="home-garden__supported_logo">
          <img src={newinc} alt="New INC" />
        </div>
        <div className="home-garden__supported_logo">
          <img src={startcoop} alt="Start.coop" />
        </div>
        <div className="home-garden__supported_logo">
          <img src={newschool} alt="New School" />
        </div>
        <div className="home-garden__supported_logo">
          <img src={cci} alt="Center for Cultural Innovation" />
        </div>
        <div className="home-garden__supported_logo">
          <img src={creativecommons} alt="Creative Commons" />
        </div>
        <div className="home-garden__supported_logo">
          <img src={mozilla} alt="Mozilla" />
        </div>
        <div className="home-garden__supported_logo">
          <img src={gftw} alt="Great for the Web" />
        </div>
        <div className="home-garden__supported_logo">
          <img src={cuny} alt="Cuny School of Law" />
        </div>
        <div className="home-garden__supported_logo">
          <img src={usdac} alt="US Department of Arts and Culture" />
        </div>
        <div className="home-garden__supported_logo">
          <img src={seedclub} alt="Seed Club" />
        </div>
      </div>
      {/* todo: Connect to community page to get current amount of supporters */}
      {/* <div className="home-garden__supported_copy">
        And 356 <Link to={`/artist/community`}>Community Members</Link>
      </div> */}
    </div>
  </div>
);
