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

  calculateSupportTotal = (supportLevel) => (Math.round((supportLevel * 100 + 30) / .971) / 100).toFixed(2);

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
            <form className="form-group support__level-form" onSubmit={this.submit}>
              <h3>Enter your payment details</h3>
              <div className="form-row">
                <div className="col">
                  <label>Credit Card Number</label>
                  <CardNumberElement />
                </div>
              </div>
              <div className="form-row">
                <div className="col">
                  <label>Expiration Date</label>
                  <CardExpiryElement />
                </div>
                <div className="col">
                  <label>CVC</label>
                  <CardCVCElement />
                </div>
              </div>
              <div className="form-row">
                <p className="transparency">
                Your total charge will be<br />
                <h2>${this.calculateSupportTotal(this.props.subscriptionLevelValue/100)}</h2>
                </p>
              </div>
              <div className="actions">
                <button disabled={this.state.disableActions} className="btn btn-secondary" type="button" onClick={this.props.declineStep}>
                  Change amount
                </button>
                <button disabled={this.state.disableActions} className="btn btn-primary" type="submit">
                  Support
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
