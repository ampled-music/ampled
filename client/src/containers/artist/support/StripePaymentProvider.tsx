import './stripe-payment-provider.scss';

import * as React from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';

import { config } from 'src/config';
import { CheckoutForm } from './CheckoutForm';

interface Props {
  createSubscription: Function;
  declineStep: any;
  artistPageId: any;
  subscriptionLevelValue: any;
  formType: String;
}

declare global {
  interface Window {
    Stripe: any;
  }
}

export class StripePaymentProvider extends React.Component<Props, any> {
  constructor(props) {
    super(props);
    this.state = { stripe: null };
  }

  componentDidMount() {
    if (window.Stripe) {
      this.setState({ stripe: window.Stripe(config.stripeApiKey) });
    } else {
      document.querySelector('#stripe-js').addEventListener('load', () => {
        // Create Stripe instance once Stripe.js loads
        this.setState({ stripe: window.Stripe(config.stripeApiKey) });
      });
    }
  }
  render() {
    const { createSubscription, declineStep, artistPageId, subscriptionLevelValue, formType } = this.props;

    return (
      <StripeProvider stripe={this.state.stripe}>
        <Elements>
          {
            formType === 'checkout' && (<CheckoutForm
              artistPageId={artistPageId}
              subscriptionLevelValue={subscriptionLevelValue}
              createSubscription={createSubscription}
              declineStep={declineStep}
            />)
          }
        </Elements>
      </StripeProvider>
    );
  }
}
