import * as React from 'react';
import { Card, CardContent } from '@material-ui/core';

import { CheckCircleOutline, ErrorOutline } from '@material-ui/icons';
import { faStripe } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface CardStripeProps {
  selectedArtist: any;
}

export const CardStripe = ({ selectedArtist }: CardStripeProps) => {
  const { isStripeSetup, stripeDashboard, stripeSignup } = selectedArtist;

  return (
    <Card>
      <CardContent>
        <div className="dashboard__home_card_stripe">
          {isStripeSetup ? (
            <div className="dashboard__home_card_stripe">
              <div className="dashboard__home_card_stripe_message success">
                <CheckCircleOutline fontSize="large" /> You’re payouts are all
                set up!
              </div>
              {stripeDashboard && (
                <a
                  href={stripeDashboard}
                  className="dashboard__home_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginLeft: '45px' }}
                >
                  Edit Payout Details
                </a>
              )}
            </div>
          ) : (
            <div className="dashboard__home_card_stripe">
              <div className="dashboard__home_card_stripe_message warning">
                <ErrorOutline fontSize="large" /> You still need to set up
                payouts
              </div>
              {stripeSignup && (
                <a
                  href={stripeSignup}
                  className="dashboard__home_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginLeft: '45px' }}
                >
                  Set Up Payouts
                </a>
              )}
            </div>
          )}
          <div
            className="dashboard__home_card_by"
            style={{ marginLeft: '45px' }}
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

export default CardStripe;
