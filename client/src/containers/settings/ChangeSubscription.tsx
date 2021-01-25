import * as React from 'react';

import { Card, CardContent } from '@material-ui/core';
import { PaymentStep } from '../artist/support/PaymentStep';

interface Props {
  subscription: any;
  userData: any;
}

export class ChangeSubscription extends React.Component<Props, any> {
  render() {
    const { subscription } = this.props;
    return (
      <Card>
        <CardContent>
          <p>
            Would you like to change your support amount for {subscription.name}
            ?
          </p>
          <PaymentStep
            artistName={subscription.name}
            subscriptions={subscription} // @todo: status and some other subscription info is not coming in.
            userData={this.props.userData}
          />
        </CardContent>
      </Card>
    );
  }
}
