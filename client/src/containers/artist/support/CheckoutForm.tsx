import './checkout-form.scss';

import * as React from 'react';
import {
  injectStripe,
  CardCVCElement,
  CardExpiryElement,
  CardNumberElement,
} from 'react-stripe-elements';
import { Link } from 'react-router-dom';
import { SingleCardDisplay } from '../../user-details/UserDetails';

interface Props {
  artistPageId: number;
  subscriptionLevelValue: number;
  stripe?: any;
  createSubscription: (subscription: {
    artistPageId: number;
    subscriptionLevelValue: number;
    paymentToken: string;
  }) => void;
  declineStep: () => void;
  userData?: any;
  showToast: Function;
}

class CheckoutFormComponent extends React.Component<Props, any> {
  state = {
    disableActions: false,
    invalidCard: false,
  };

  componentDidMount = () => {
    const {
      userData: { cardInfo },
    } = this.props;

    if (cardInfo && !cardInfo.is_valid) {
      this.setState({ disableActions: true, invalidCard: true });
    }
  };

  componentDidUpdate = (prevProps) => {
    const {
      userData: { cardInfo },
    } = this.props;

    if (!prevProps.userData && cardInfo) {
      if (!cardInfo.is_valid) {
        this.setState({ disableActions: true, invalidCard: true });
      }
    }
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
      let {
        token: paymentToken,
        error,
      } = await this.props.stripe.createToken();

      if (error) {
        this.props.showToast({
          message: error.message,
          type: 'error',
        });
        this.setState({ disableActions: false });
      } else {
        this.createSubscription(paymentToken);
      }
    }
  };

  calculateSupportTotal = (supportLevel) =>
    (Math.round((supportLevel * 100 + 30) / 0.971) / 100).toFixed(2);

  createSubscription = (paymentToken: { id: string }) => {
    const { artistPageId, subscriptionLevelValue } = this.props;

    paymentToken &&
      this.props.createSubscription({
        paymentToken: paymentToken.id,
        artistPageId,
        subscriptionLevelValue,
      });
  };

  createSavedSubscription = () => {
    const { artistPageId, subscriptionLevelValue } = this.props;

    this.props.createSubscription({
      paymentToken: null,
      artistPageId,
      subscriptionLevelValue,
    });
  };

  render() {
    const {
      userData: { cardInfo },
    } = this.props;
    const { invalidCard } = this.state;

    return (
      <div className="container checkout-form-container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <form
              className="form-group support__level-form"
              onSubmit={this.submit}
            >
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
                      <div style={{ textAlign: 'left' }}>
                        <SingleCardDisplay {...cardInfo} />
                      </div>
                      <br />
                      {invalidCard && (
                        <Link
                          to="/user-details"
                          className="btn btn-link btn-edit-card"
                        >
                          Replace your card with
                          <br />a valid one to proceed
                        </Link>
                      )}
                      {!invalidCard && (
                        <Link
                          to="/user-details"
                          className="btn btn-link btn-edit-card"
                        >
                          Edit your card
                        </Link>
                      )}
                    </div>
                  </div>
                </>
              )}

              {!invalidCard && (
                <>
                  <div className="form-row" style={{ display: 'inline-block' }}>
                    <p className="transparency">
                      Your total charge will be
                      <br />
                    </p>
                    <h2 className="transparency">
                      $
                      {this.calculateSupportTotal(
                        this.props.subscriptionLevelValue / 100,
                      )}
                    </h2>
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
                    <button
                      disabled={this.state.disableActions}
                      className="btn btn-primary"
                      type="submit"
                    >
                      Support
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const CheckoutForm = injectStripe(CheckoutFormComponent);

export { CheckoutForm };
