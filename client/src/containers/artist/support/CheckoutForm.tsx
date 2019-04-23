import * as React from 'react';
import { injectStripe, CardElement } from 'react-stripe-elements';

interface Props {
  artistPageId: number;
  subscriptionLevelValue: number;
  stripe: any;
  createSubscription: (
    subscription: { artistPageId: number; subscriptionLevelValue: number; paymentToken: string },
  ) => void;
  declineStep: () => void;
}

class CheckoutFormComponent extends React.Component<Props, any> {
  submit = async (event) => {
    event.preventDefault();

    let { token: paymentToken } = await this.props.stripe.createToken();

    const { artistPageId, subscriptionLevelValue } = this.props;

    paymentToken &&
      this.props.createSubscription({ paymentToken: paymentToken.id, artistPageId, subscriptionLevelValue });
  };

  render() {
    return (
      <div className="checkout">
        <p>Would you like to complete the purchase?</p>
        <form onSubmit={this.submit}>
          <CardElement />
          <button type="cancel" onClick={this.props.declineStep}>
            CHANGE AMOUNT
          </button>
          <button type="submit">YEAH, SUPPORT!</button>
        </form>
      </div>
    );
  }
}

const CheckoutForm = injectStripe(CheckoutFormComponent);

export { CheckoutForm };
