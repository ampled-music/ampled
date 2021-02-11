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

import { Button, Card, CardContent, Typography } from '@material-ui/core';

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
              <Card>
                <CardContent>
                  {!cardInfo && (
                    <>
                      <Typography variant="h5" component="h5">
                        Enter your payment details
                      </Typography>
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
                      <Typography variant="h5" component="h5">
                        Use your existing card
                      </Typography>
                      <SingleCardDisplay {...cardInfo} />
                      <Typography component="p" className="transparency">
                        {invalidCard && (
                          <Link className="edit-card" to="/user-details">
                            Replace your card with
                            <br />a valid one to proceed
                          </Link>
                        )}
                        {!invalidCard && (
                          <Link className="edit-card" to="/user-details">
                            Edit your card
                          </Link>
                        )}
                      </Typography>
                    </>
                  )}

                  {!invalidCard && (
                    <>
                      <Typography component="p" className="transparency">
                        Your total charge will be
                      </Typography>
                      <Typography variant="h4" component="h4">
                        $
                        {this.calculateSupportTotal(
                          this.props.subscriptionLevelValue / 100,
                        )}
                      </Typography>
                      <div className="action-buttons">
                        <Button
                          disabled={this.state.disableActions}
                          className="cancel-button"
                          type="button"
                          style={{ width: '50%' }}
                          onClick={this.props.declineStep}
                        >
                          Change amount
                        </Button>
                        <Button
                          disabled={this.state.disableActions}
                          className="publish-button"
                          type="submit"
                          style={{ width: '50%' }}
                        >
                          Support
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const CheckoutForm = injectStripe(CheckoutFormComponent);

export { CheckoutForm };
