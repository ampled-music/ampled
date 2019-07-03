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

import { showToastMessage, MessageType } from 'src/containers/shared/toast/toast';
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
    const { me, subscriptions, getMe } = this.props;

    if (!prevProps.me.userData && me.userData) {
      this.getArtistInfo();
    }

    if (subscriptions.status === SubscriptionStep.Finished) {
      getMe();
      this.redirectToArtistsPage();
    }

    if (me.userData && me.userData && me.userData.subscriptions && me.userData.subscriptions.find(sub => Number(sub.artistPageId) === Number(this.props.match.params.id))) {
      this.redirectToArtistsPage();
    }
  }

  returnFirstName = (name) => {
    let spacePosition = name.indexOf(' ');
    if (spacePosition === -1) {
      return name;
    } else {
      return name.substr(0, spacePosition);
    }
  };

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
    if (this.state.supportLevelValue < 3) {
      showToastMessage('Sorry, but you need to insert a value equal or bigger than $ 3.00.', MessageType.ERROR);

      return;
    }

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
      supportLevelValue: this.state.supportLevelValue * 100,
    });
  };

  renderSupportHeader = (artistName) => (
    <div className="support__header">
      <div className="support__header_support">Support</div>
      <h2 className="support__header_artist-name">{artistName}</h2>
    </div>
  );

  renderArtistImage = (images) => {
    const placeholderImage =
      'https://images.pexels.com/photos/1749822/pexels-photo-1749822.jpeg?cs=srgb&dl=backlit-band-concert-1749822.jpg';

    return <img className="support__artist-image" src={images.length ? images[0] : placeholderImage} />;
  };

  renderArtists = (owners) => (
    <div key="artists" className="support__artists">
      {owners.map((owner, index) => (
        <div key={index} className="support__artist-info">
          {owner.profile_image_url ? (
            <img className="support__artist-info_image" src={owner.profile_image_url} />
          ) : (
            <FontAwesomeIcon className="support__artist-info_image" icon={faUserCircle} />
          )}
          <p>{this.returnFirstName(owner.name)}</p>
        </div>
      ))}
    </div>
  );

  renderSupportLevelForm = (artistName) => (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div key="support__level-form" className="support__level-form">
          <h3>Support What You Want</h3>
          <div className="support__value-field">
            <input
              type="number"
              name="supportLevelValue"
              onChange={this.handleChange}
              value={this.state.supportLevelValue}
              placeholder="3 min"
            />
          </div>
          <p className="support__value-description">
            Support {artistName} directly for $3 (or more) per month to unlock access to all of their posts and get
            notifications when they post anything new.
          </p>
        </div>
      </div>
    </div>
  );

  renderStartSubscriptionAction = (artistName) => {
    const buttonLabel = this.props.me.userData ? `SUPPORT ${artistName.toUpperCase()}` : 'SIGNUP OR LOGIN TO SUPPORT';

    return (
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="support__action">
            <button disabled={!this.state.supportLevelValue} onClick={this.handleSupportClick}>
              {buttonLabel}
            </button>
          </div>
        </div>
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
      <div className="container support__container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            {this.renderSupportHeader(artistName)}
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="stripe" />
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-12">
            <div className="support__content">
              {this.renderPaymentStep(artist)}
            </div>
          </div>
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
