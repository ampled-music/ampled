import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openAuthModalAction } from '../../../redux/authentication/authentication-modal';
import { Store } from '../../../redux/configure-store';
import { showToastAction } from '../../../redux/toast/toast-modal';
import { createSubscriptionAction } from '../../../redux/subscriptions/create';
import { declineStepAction } from '../../../redux/subscriptions/decline-step';
import { startSubscriptionAction } from '../../../redux/subscriptions/start-subscription';
import { ArtistModel } from '../../../redux/artists/initial-state';
import {
  initialState as subscriptionsInitialState,
  SubscriptionStep,
} from '../../../redux/subscriptions/initial-state';

import { Avatar, Button } from '@material-ui/core';
import { UserImage } from '../../user-details/UserImage';

import { StripePaymentProvider } from './StripePaymentProvider';
import { SupportLevelForm } from './SupportLevelForm';

interface PaymentProps {
  artist: ArtistModel;
  subscriptions?: typeof subscriptionsInitialState;
  userData: any;
}

type Dispatchers = ReturnType<typeof mapDispatchToProps>;
type Props = Dispatchers & PaymentProps;

export class PaymentStepComponent extends React.Component<Props, any> {
  state = {
    supportLevelValue: null,
    isAmpled: false,
  };

  handleSupportChange = (event) => {
    const { value } = event.target;
    this.setState({ supportLevelValue: Number(value) });
  };

  handleSupportClick = () => {
    if (this.state.supportLevelValue < 3) {
      this.props.showToast({
        message:
          'Sorry, but you need to insert a value equal or bigger than $3.00.',
        type: 'error',
      });

      return;
    }

    if (!this.props.userData) {
      this.props.openAuthModal({ modalPage: 'signup' });
    } else {
      this.startSubscription();
    }
  };

  startSubscription = () => {
    const { artist } = this.props;
    const artistPageId = artist.id;

    this.props.startSubscription({
      artistPageId,
      subscriptionLevelValue: this.state.supportLevelValue * 100,
      supportLevelValue: this.state.supportLevelValue * 100,
    });
  };

  renderStartSubscriptionAction = (artistName) => {
    const buttonLabel = this.props.userData
      ? this.state.isAmpled
        ? 'Become a member'
        : `Support ${artistName}`
      : 'Signup or login to support';

    return (
      <div className="row justify-content-center">
        <div className="col-md-5">
          <Button
            disabled={
              !this.state.supportLevelValue || this.state.supportLevelValue < 3
            }
            onClick={this.handleSupportClick}
            variant="contained"
            color="primary"
          >
            {buttonLabel}
          </Button>
        </div>
      </div>
    );
  };

  renderArtists = (owners) => (
    <div key="artists" className="support__artists">
      {owners.map((owner, index) => (
        <div key={index} className="support__artist-info">
          <Avatar>
            <UserImage image={owner.image} alt={owner.name} width={80} />
          </Avatar>
          <p>{owner.name}</p>
        </div>
      ))}
    </div>
  );

  render() {
    const {
      artist,
      subscriptions,
      createSubscription,
      declineStep,
      userData,
    } = this.props;
    console.log('subscriptions', subscriptions);

    const { artistPageId, subscriptionLevelValue } = subscriptions;

    switch (subscriptions.status) {
      case SubscriptionStep.SupportLevel:
        return [
          !artist.hide_members &&
            !this.state.isAmpled &&
            this.renderArtists(artist.owners),
          <SupportLevelForm
            supportLevelValue={this.state.supportLevelValue}
            supportClick={this.handleSupportClick}
            supportChange={this.handleSupportChange}
            artistName={artist.name}
            isAmpled={this.state.isAmpled}
          />,
        ];
      case SubscriptionStep.PaymentDetails:
        return (
          <StripePaymentProvider
            artistPageId={artistPageId}
            subscriptionLevelValue={subscriptionLevelValue}
            createSubscription={createSubscription}
            declineStep={declineStep}
            formType="checkout"
            userData={userData}
            showToast={this.props.showToast}
          />
        );
      default:
        break;
    }
  }
}

const mapStateToProps = (state: Store) => {
  return {
    artists: state.artists,
    me: state.me,
    authentication: state.authentication,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    startSubscription: bindActionCreators(startSubscriptionAction, dispatch),
    createSubscription: bindActionCreators(createSubscriptionAction, dispatch),
    declineStep: bindActionCreators(declineStepAction, dispatch),
    openAuthModal: bindActionCreators(openAuthModalAction, dispatch),
    showToast: bindActionCreators(showToastAction, dispatch),
  };
};

const PaymentStep = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentStepComponent);

export { PaymentStep };
