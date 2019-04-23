import './stripe-payment-provider.scss';

import * as React from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';

import { config } from 'src/config';
import { CheckoutForm } from './CheckoutForm';

export const StripePaymentProvider = (
  { createSubscription, declineStep, artistPageId, subscriptionLevelValue } = this.props,
) => (
  <StripeProvider apiKey={config.stripeApiKey}>
    <Elements>
      <CheckoutForm
        artistPageId={artistPageId}
        subscriptionLevelValue={subscriptionLevelValue}
        createSubscription={createSubscription}
        declineStep={declineStep}
      />
    </Elements>
  </StripeProvider>
);
