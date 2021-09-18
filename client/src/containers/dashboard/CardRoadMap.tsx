import * as React from 'react';
import { Card, CardContent } from '@material-ui/core';

import ArtistHandbook from '../../images/icons/Icon_Artist-Handbook.png';

export const CardRoadMap = () => {
  return (
    <Card className="dashboard__home_card_roadmap">
      <CardContent>
        <div className="dashboard__home_card_title">Learn More</div>
        <div className="row dashboard__home_card_roadmap_content">
          <div className="col-12 col-sm-6">
            <a href="https://docs.ampled.com/artist-handbook/">
              <img src={ArtistHandbook} alt="Artist Handbook" />
            </a>
          </div>
          {/* <div className="col-12 col-sm-6">
            <div className="dashboard__home_card_roadmap_info">
              <h5>Roadmap</h5>
              <p>See what Ampled contributors are working on.</p>
              <div className="dashboard__home_card_by">
                Powered by Notion
              </div>
            </div>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default CardRoadMap;
