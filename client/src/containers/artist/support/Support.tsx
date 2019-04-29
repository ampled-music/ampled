import './support.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { routePaths } from 'src/containers/route-paths';
import { getArtistAction } from 'src/redux/artists/get-details';
import { openAuthModalAction } from 'src/redux/authentication/authentication-modal';
import { Store } from 'src/redux/configure-store';
import { getMeAction } from 'src/redux/me/get-me';
import { createSubscriptionAction } from 'src/redux/subscriptions/create';
import { declineStepAction } from 'src/redux/subscriptions/decline-step';
import { startSubscriptionAction } from 'src/redux/subscriptions/start-subscription';

import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { initialState as artistsInitialState, ArtistModel } from '../../../redux/artists/initial-state';
import { initialState as authenticateInitialState } from '../../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../../redux/me/initial-state';
import {
  initialState as subscriptionsInitialState,
  SubscriptionStep,
} from '../../../redux/subscriptions/initial-state';
import { StripePaymentProvider } from './StripePaymentProvider';

interface ArtistProps {
  match: {
    params: {
      id: string;
    };
  };
  artists: typeof artistsInitialState;
  me: typeof meInitialState;
  authentication: typeof authenticateInitialState;
  subscriptions: typeof subscriptionsInitialState;
  history: any;
}

type Dispatchers = ReturnType<typeof mapDispatchToProps>;
type Props = Dispatchers & ArtistProps;

export class SupportComponent extends React.Component<Props, any> {
  state = {
    supportLevelValue: 3,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getArtistInfo();
  }

  componentDidUpdate(prevProps) {
    const { me, artists, subscriptions, getMe } = this.props;

    if (!prevProps.me.userData && me.userData) {
      this.getArtistInfo();
    }

    if (subscriptions.status === SubscriptionStep.Finished) {
      getMe();
      this.redirectToArtistsPage();
    }

    if (artists.artist.supporters && artists.artist.supporters.find((supporter) => supporter.id === me.userData.id)) {
      this.redirectToArtistsPage();
    }
  }

  redirectToArtistsPage = () => {
    const { history, match } = this.props;

    history.push(routePaths.artists.replace(':id', match.params.id));
  };

  getArtistInfo = () => {
    this.props.getArtist(this.props.match.params.id);
  };

  handleChange = (event) => {
    const { value } = event.target;
    this.setState({ supportLevelValue: value });
  };

  handleSupportClick = () => {
    if (!this.props.me.userData) {
      this.props.openAuthModal({ modalPage: 'signup' });
    } else {
      this.startSubscription();
    }
  };

  startSubscription = () => {
    const artistPageId = this.props.match.params.id;
    this.props.startSubscription({
      artistPageId,
      supportLevelValue: this.state.supportLevelValue,
    });
  };

  renderSupportHeader = (artistName) => (
    <div className="support-header">
      Support
      <h2>{artistName}</h2>
    </div>
  );

  renderArtistImage = (images) => {
    const placeholderImage =
      'https://images.pexels.com/photos/1749822/pexels-photo-1749822.jpeg?cs=srgb&dl=backlit-band-concert-1749822.jpg';

    return <img className="support-artist-image" src={images.length ? images[0] : placeholderImage} />;
  };

  renderArtists = (owners) => (
    <div key="artists" className="support-artists">
      {owners.map((owner, index) => (
        <div key={index} className="support-artist-info">
          {owner.profile_image_url ? (
            <img className="artist-image" src={owner.profile_image_url} />
          ) : (
            <FontAwesomeIcon className="artist-image" icon={faUserCircle} />
          )}
          <p>{owner.name}</p>
        </div>
      ))}
    </div>
  );

  renderSupportLevelForm = (artistName) => (
    <div key="support-level-form" className="support-level-form">
      <h3>ENTER YOUR SUPPORT LEVEL</h3>
      <div className="support-value-field">
        <p>$</p>
        <input
          type="number"
          name="supportLevelValue"
          onChange={this.handleChange}
          value={this.state.supportLevelValue}
        />
        <p className="month-text">/Month</p>
      </div>
      <p className="support-value-description">
        $3 is the average monthly support amount for {artistName}, but whatever your support level; the band certainly
        appreciates it. However, the minimum is $3 to cover the costs and keep the lights on at Ampled.
      </p>
    </div>
  );

  renderStartSubscriptionAction = (artistName) => {
    const buttonLabel = this.props.me.userData ? `SUPPORT ${artistName.toUpperCase()}` : 'SIGNUP OR LOGIN TO SUPPORT';

    return (
      <div className="support-action">
        <button disabled={!this.state.supportLevelValue} onClick={this.handleSupportClick}>
          {buttonLabel}
        </button>
      </div>
    );
  };

  renderPaymentStep = (artist: ArtistModel) => {
    const { subscriptions, createSubscription, declineStep } = this.props;

    const { artistPageId, subscriptionLevelValue } = subscriptions;

    switch (subscriptions.status) {
      case SubscriptionStep.SupportLevel:
        return [this.renderArtists(artist.owners), this.renderSupportLevelForm(artist.name)];
      case SubscriptionStep.PaymentDetails:
        return (
          <StripePaymentProvider
            artistPageId={artistPageId}
            subscriptionLevelValue={subscriptionLevelValue}
            createSubscription={createSubscription}
            declineStep={declineStep}
          />
        );
      default:
        break;
    }
  };

  render() {
    const { artists, subscriptions } = this.props;

    const artist = artists.artist;

    if (!Object.keys(artist).length) {
      return null;
    }

    const artistName = artist.name;

    return (
      <div className="support-container">
        {this.renderSupportHeader(artistName)}
        <div className="stripe" />
        <div className="support-content">
          {this.renderArtistImage(artist.images)}
          <div className="support-central-area">{this.renderPaymentStep(artist)}</div>
        </div>
        {subscriptions.status === SubscriptionStep.SupportLevel && this.renderStartSubscriptionAction(artistName)}
      </div>
    );
  }
}

const mapStateToProps = (state: Store) => {
  return {
    artists: state.artists,
    me: state.me,
    authentication: state.authentication,
    subscriptions: state.subscriptions,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getArtist: bindActionCreators(getArtistAction, dispatch),
    getMe: bindActionCreators(getMeAction, dispatch),
    openAuthModal: bindActionCreators(openAuthModalAction, dispatch),
    startSubscription: bindActionCreators(startSubscriptionAction, dispatch),
    createSubscription: bindActionCreators(createSubscriptionAction, dispatch),
    declineStep: bindActionCreators(declineStepAction, dispatch),
  };
};

const Support = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SupportComponent);

export { Support };
