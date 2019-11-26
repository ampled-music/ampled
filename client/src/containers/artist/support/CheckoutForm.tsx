import './checkout-form.scss';

import * as React from 'react';
import { injectStripe, CardCVCElement, CardExpiryElement, CardNumberElement } from 'react-stripe-elements';
import { showToastMessage, MessageType } from 'src/containers/shared/toast/toast';
import { Link } from 'react-router-dom';

interface Props {
  artistPageId: number;
  subscriptionLevelValue: number;
  stripe: any;
  createSubscription: (
    subscription: { artistPageId: number; subscriptionLevelValue: number; paymentToken: string },
  ) => void;
  declineStep: () => void;
  userData?: any;
}

class CheckoutFormComponent extends React.Component<Props, any> {
  state = {
    disableActions: false,
  };

  submit = async (event) => {
    const {
      userData: { cardInfo },
    } = this.props;

    this.setState({ disableActions: true });

    event.preventDefault();

    if (cardInfo) {
      this.createSavedSubscription();
    } else {
      let { token: paymentToken, error } = await this.props.stripe.createToken();

      if (error) {
        showToastMessage(error.message, MessageType.ERROR);
        this.setState({ disableActions: false });
      } else {
        this.createSubscription(paymentToken);
      }  
    }
  };

  calculateSupportTotal = (supportLevel) => (Math.round((supportLevel * 100 + 30) / .971) / 100).toFixed(2);

  createSubscription = (paymentToken: { id: string }) => {
    const { artistPageId, subscriptionLevelValue } = this.props;

    paymentToken &&
      this.props.createSubscription({ paymentToken: paymentToken.id, artistPageId, subscriptionLevelValue });
  };

  createSavedSubscription = () => {
    const { artistPageId, subscriptionLevelValue } = this.props;

    this.props.createSubscription({ paymentToken: null, artistPageId, subscriptionLevelValue });
  };


  render() {
    const {
      userData: { cardInfo },
    } = this.props;
    return (
      <div className="container checkout-form-container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <form className="form-group support__level-form" onSubmit={this.submit}>
              {!cardInfo && (
                <>
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
                </>
              )}
              {cardInfo && (
                <>
                  <h3>Use your existing card</h3>
                  <div className="form-row">
                    <div className="col">
                      {cardInfo.brand} ending with {cardInfo.last4}
                      <br /><br />
                      <Link to="/user-details">Edit your card</Link>
                    </div>
                  </div>
                </>
              )}

              <div className="form-row" style={{ display: 'inline-block' }}>
                <p className="transparency">
                  Your total charge will be
                  <br />
                </p>
                <h2 className="transparency">${this.calculateSupportTotal(this.props.subscriptionLevelValue / 100)}</h2>
              </div>
              <div className="actions">
                <button
                  disabled={this.state.disableActions}
                  className="btn btn-secondary"
                  type="button"
                  onClick={this.props.declineStep}
                >
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
