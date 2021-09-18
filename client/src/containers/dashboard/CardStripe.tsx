import * as React from 'react';
import { Card, CardContent } from '@material-ui/core';

import { CheckCircleOutline, ErrorOutline } from '@material-ui/icons';

interface CardStripeProps {
  selectedArtist: any;
}

export const CardStripe = ({ selectedArtist }: CardStripeProps) => {
  const { isStripeSetup, stripeSignup } = selectedArtist;

  return (
        <div className="dashboard__home_card_stripe">
          {isStripeSetup ? (
            <div className="dashboard__home_card_stripe">
              <div className="dashboard__home_card_stripe_message success">
                <CheckCircleOutline fontSize="large" /> You’re payouts are all
                set up!
              </div>
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
        </div>
  );
};

export default CardStripe;
