import './checkout-form.scss';

import * as React from 'react';
import { injectStripe, CardCVCElement, CardExpiryElement, CardNumberElement } from 'react-stripe-elements';
import { showToastMessage, MessageType } from 'src/containers/shared/toast/toast';

interface Props {
  stripe: any;
  updateCard: Function;
  declineStep: Function;
}

class EditCardFormComponent extends React.Component<Props, any> {
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
      this.props.updateCard(paymentToken.id);
    }
  };

  calculateSupportTotal = (supportLevel) => (Math.round((supportLevel * 100 + 30) / .971) / 100).toFixed(2);

  render() {
    return (
      <div className="container checkout-form-container">
        <div className="row justify-content-center">
          <div className="col-md-12">
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
              <div className="actions">
                <button disabled={this.state.disableActions} className="btn btn-primary" type="submit">
                  Update
                </button>
                <button disabled={this.state.disableActions} className="btn btn-secondary" onClick={() => this.props.declineStep()}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const EditCardForm = injectStripe(EditCardFormComponent);

export { EditCardForm };
