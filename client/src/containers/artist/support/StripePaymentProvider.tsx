import './stripe-payment-provider.scss';

import * as React from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';

import { CheckoutForm } from './CheckoutForm';

export const StripePaymentProvider = (
  { createSubscription, declineStep, artistPageId, subscriptionLevelValue } = this.props,
) => (
  <StripeProvider apiKey="pk_test_TYooMQauvdEDq54NiTphI7jx">
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
