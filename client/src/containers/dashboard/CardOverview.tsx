import * as React from 'react';
import { Card, CardActions, CardContent } from '@material-ui/core';

interface CardOverviewProps {
  selectedArtist: any;
}

export const CardOverview = ({ selectedArtist }: CardOverviewProps) => {
  const { supportersCount, monthlyTotal } = selectedArtist;

  return (
    <Card>
      <CardContent>
        <div className="dashboard__home_card_title">Overview</div>
        <div className="dashboard__home_card_flex-row">
          <div className="dashboard__home_card_numbers">
            <div className="dashboard__home_card_total">
              {supportersCount || 0}
            </div>
            <div className="dashboard__home_card_description">Supporters</div>
          </div>
          {supportersCount > 0 && (
            <div className="dashboard__home_card_numbers">
              <div className="dashboard__home_card_total">
                ${(monthlyTotal / supportersCount / 100).toFixed(2)}
              </div>
              <div className="dashboard__home_card_description">
                Avg Per Supporter
              </div>
            </div>
          )}
          <div className="dashboard__home_card_numbers">
            <div className="dashboard__home_card_total">
              ${(monthlyTotal / 100).toFixed(2)}
            </div>
            <div className="dashboard__home_card_description">/Month</div>
          </div>
        </div>
      </CardContent>
      <CardActions>
        {/* <a className="dashboard__home_link">View More Income Metrics</a> */}
      </CardActions>
    </Card>
  );
};

export default CardOverview;
