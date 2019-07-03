import './checkout-form.scss';

import * as React from 'react';
import { injectStripe, CardCVCElement, CardExpiryElement, CardNumberElement } from 'react-stripe-elements';
import { showToastMessage, MessageType } from 'src/containers/shared/toast/toast';

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
  state = {
    disableActions: false,
  };

  submit = async (event) => {
    this.setState({ disableActions: true });

    event.preventDefault();

    let { token: paymentToken, error } = await this.props.stripe.createToken();

    if (error) {
      showToastMessage(error.message, MessageType.ERROR);
      this.setState({ disableActions: false });
    } else {
      this.createSubscription(paymentToken);
    }
  };

  createSubscription = (paymentToken: { id: string }) => {
    const { artistPageId, subscriptionLevelValue } = this.props;

    paymentToken &&
      this.props.createSubscription({ paymentToken: paymentToken.id, artistPageId, subscriptionLevelValue });
  };

  render() {
    return (
      <div className="container checkout-form-container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <form onSubmit={this.submit}>
              <p>ENTER YOUR PAYMENT DETAILS</p>
              <label>
                Card Number
                <CardNumberElement />
              </label>
              <label>
                Expiration Date
                <CardExpiryElement />
              </label>
              <label>
                CVC
                <CardCVCElement />
              </label>
              <div className="actions">
                <button disabled={this.state.disableActions} className="btn" onClick={this.props.declineStep}>
                  CHANGE AMOUNT
                </button>
                <button disabled={this.state.disableActions} className="btn btn-support-action" type="submit">
                  SUPPORT!
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const CheckoutForm = injectStripe(CheckoutFormComponent);

export { CheckoutForm };
