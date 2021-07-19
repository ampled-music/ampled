import * as React from 'react';
import { Card, CardActions, CardContent } from '@material-ui/core';
import { faStripe } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface CardOverviewProps {
  selectedArtist: any;
}

export const CardOverview = ({ selectedArtist }: CardOverviewProps) => {
  const { supportersCount, monthlyTotal, stripeDashboard } = selectedArtist;

  return (
    <Card>
      <CardContent>
        <div className="dashboard__home_card_title">Overview</div>
        <div className="dashboard__home_card_flex-row">
          <div className="dashboard__home_card_numbers">
            <div className="dashboard__home_card_total">
              {supportersCount || 0}
            </div>
            <div className="dashboard__home_card_description">Supporter{supportersCount > 1 ? 's' : ''}</div>
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
        <div className="dashboard__home_card_flex-col">
          {stripeDashboard && (
            <a
              href={stripeDashboard}
              className="dashboard__home_link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Edit Payout Details
            </a>
          )}
          <div
            className="dashboard__home_card_by"
          >
            Powered by
            <FontAwesomeIcon
              className="dashboard__home_card_by_icon"
              icon={faStripe}
              size="3x"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardOverview;
