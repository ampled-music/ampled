import * as React from 'react';
import { Card, CardContent } from '@material-ui/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrello } from '@fortawesome/free-brands-svg-icons';
import ArtistHandbook from '../../images/icons/Icon_Artist-Handbook.png';

export const CardRoadMap = () => {
  return (
    <Card className="dashboard__home_card_roadmap">
      <CardContent>
        <div className="dashboard__home_card_title">Learn More</div>
        <div className="row">
          <div className="col-6">
            <img src={ArtistHandbook} alt="Artist Handbook" />
          </div>
          <div className="col-6">
            <h5>Roadmap</h5>
            <p>See what Ampled contributors are working on.</p>
            <div className="dashboard__home_card_by">
              Powered by
              <FontAwesomeIcon
                className="dashboard__home_card_by_icon"
                icon={faTrello}
                size="2x"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardRoadMap;
