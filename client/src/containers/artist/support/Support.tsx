import './../artist.scss';
import './support.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { routePaths } from '../../route-paths';
import { getArtistAction } from '../../../redux/artists/get-details';
import { openAuthModalAction } from '../../../redux/authentication/authentication-modal';
import { Store } from '../../../redux/configure-store';
import { getMeAction } from '../../../redux/me/get-me';
import { showToastAction } from '../../../redux/toast/toast-modal';
import { createSubscriptionAction } from '../../../redux/subscriptions/create';
import { declineStepAction } from '../../../redux/subscriptions/decline-step';
import { startSubscriptionAction } from '../../../redux/subscriptions/start-subscription';
import { Helmet } from 'react-helmet';

import { UserImage } from '../../user-details/UserImage';

import {
  initialState as artistsInitialState,
  ArtistModel,
} from '../../../redux/artists/initial-state';
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
    supportLevelValue: null,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getArtistInfo();
  }

  isAmpled = () => {
    return this.props.artists.artist.slug === 'community';
  };

  componentDidUpdate(prevProps) {
    const { me, subscriptions, getMe } = this.props;

    if (!prevProps.me.userData && me.userData) {
      this.getArtistInfo();
    }

    if (subscriptions.status === SubscriptionStep.Finished) {
      // getMe();
      this.redirectToArtistsPage();
    }

    if (
      me.userData &&
      me.userData &&
      me.userData.subscriptions &&
      me.userData.subscriptions.find(
        (sub) =>
          Number(sub.artistPageId) === Number(this.props.match.params.id),
      )
    ) {
      this.redirectToArtistsPage();
    }

    if (
      me.userData &&
      me.userData &&
      me.userData.subscriptions &&
      me.userData.subscriptions.find(
        (sub) => sub.artistSlug === this.props.match.params.id,
      )
    ) {
      this.redirectToArtistsPage();
    }

    if (
      subscriptions &&
      subscriptions.hasError &&
      !prevProps.subscriptions.hasError
    ) {
      getMe();
      this.props.showToast({
        message: subscriptions.error,
        type: 'error',
      });
    }
  }

  ColorLuminance = (hex, lum) => {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    let rgb = '#',
      c,
      i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
      rgb += ('00' + c).substr(c.length);
    }

    return rgb;
  };

  returnFirstName = (name) => {
    const spacePosition = name.indexOf(' ');
    if (spacePosition === -1) {
      return name;
    } else {
      return name.substr(0, spacePosition);
    }
  };

  redirectToArtistsPage = () => {
    const {
      match,
      subscriptions,
      artists: { artist },
    } = this.props;

    const flash =
      subscriptions.status === SubscriptionStep.Finished
        ? '?flash=supported'
        : '';

    if (artist && artist.id) {
      if (artist.slug && artist.slug.length > 0) {
        window.location.href = routePaths.slugs.replace(
          ':slug',
          artist.slug + flash,
        );
      } else {
        window.location.href = routePaths.artists.replace(
          ':id',
          String(artist.id) + flash,
        );
      }
    } else {
      if (Number.isNaN(Number(match.params.id))) {
        window.location.href = routePaths.slugs.replace(
          ':slug',
          String(match.params.id) + flash,
        );
      } else {
        window.location.href = routePaths.artists.replace(
          ':id',
          String(match.params.id) + flash,
        );
      }
    }
  };

  getArtistInfo = () => {
    if (Number.isNaN(Number(this.props.match.params.id))) {
      this.props.getArtist(null, this.props.match.params.id);
    } else {
      this.props.getArtist(this.props.match.params.id);
    }
  };

  handleChange = (event) => {
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

    if (!this.props.me.userData) {
      this.props.openAuthModal({ modalPage: 'signup' });
    } else {
      this.startSubscription();
    }
  };

  startSubscription = () => {
    const {
      match: { params },
      artists: { artist },
    } = this.props;
    const artistPageId = artist && artist.id ? artist.id : params.id;
    this.props.startSubscription({
      artistPageId,
      subscriptionLevelValue: this.state.supportLevelValue * 100,
      supportLevelValue: this.state.supportLevelValue * 100,
    });
  };

  renderSupportHeader = (artistName) =>
    this.isAmpled() ? (
      <div className="support__header">
        <h2 className="support__header_artist-name">
          Become a Community Member
        </h2>
      </div>
    ) : (
      <div className="support__header">
        <div className="support__header_support">Support</div>
        <h2 className="support__header_artist-name">{artistName}</h2>
      </div>
    );

  renderArtistImage = (images) => {
    const placeholderImage =
      'https://images.pexels.com/photos/1749822/pexels-photo-1749822.jpeg?cs=srgb&dl=backlit-band-concert-1749822.jpg';

    return (
      <img
        className="support__artist-image"
        src={images.length ? images[0] : placeholderImage}
        alt="Artist"
      />
    );
  };

  renderArtists = (owners) => (
    <div key="artists" className="support__artists">
      {owners.map((owner, index) => (
        <div key={index} className="support__artist-info">
          <UserImage
            image={owner.image}
            className="support__artist-info_image"
            alt={owner.name}
            width={60}
          />

          <p>{this.returnFirstName(owner.name)}</p>
        </div>
      ))}
    </div>
  );

  calculateSupportTotal = (supportLevel) =>
    (Math.round((supportLevel * 100 + 30) / 0.971) / 100).toFixed(2);

  renderSupportLevelForm = (artistName) => (
    <div className="row justify-content-center" key={artistName}>
      <div className="col-md-5">
        <div key="support__level-form" className="support__level-form">
          <h3>Support What You Want</h3>
          <div className="support__value-field">
            <input
              aria-label="Support level"
              type="number"
              name="supportLevelValue"
              onChange={this.handleChange}
              value={this.state.supportLevelValue || ''}
              placeholder="3 min"
            />
          </div>
          {this.state.supportLevelValue && this.state.supportLevelValue >= 3 ? (
            <p className="support__value-description">
              Your total charge will be{' '}
              <strong>
                ${this.calculateSupportTotal(this.state.supportLevelValue)}
              </strong>
              .
              <br />
              <br />
              This is due to our payment processor's service fee. More details
              can be found{' '}
              <a
                href="https://docs.ampled.com/finances/pricing"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
              .
            </p>
          ) : (
            <p className="support__value-description">
              {this.isAmpled()
                ? 'Join the co-op as a Community Member to help Ampled stay independent and accountable to members.'
                : `Support ${artistName} directly for $3 (or more) per month to unlock
              access to all of their posts and get notifications when they post
              anything new.`}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  renderStartSubscriptionAction = (artistName) => {
    const buttonLabel = this.props.me.userData
      ? this.isAmpled()
        ? 'BECOME A MEMBER'
        : `SUPPORT ${artistName.toUpperCase()}`
      : 'SIGNUP OR LOGIN TO SUPPORT';

    return (
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="support__action">
            <button
              disabled={!this.state.supportLevelValue}
              onClick={this.handleSupportClick}
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    );
  };

  renderPaymentStep = (artist: ArtistModel) => {
    const {
      subscriptions,
      createSubscription,
      declineStep,
      me: { userData },
    } = this.props;

    const { artistPageId, subscriptionLevelValue } = subscriptions;

    switch (subscriptions.status) {
      case SubscriptionStep.SupportLevel:
        return [
          !artist.hide_members &&
            !this.isAmpled() &&
            this.renderArtists(artist.owners),
          this.renderSupportLevelForm(artist.name),
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
        {artist && artist.name && (
          <Helmet>
            <title>
              Support {artist.name} on Ampled | Direct Community Support For
              Music Artists
            </title>
          </Helmet>
        )}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          body {
            background-color: ${artist.accent_color}20 !important;
          }
          .support__action button {
            background-color: ${artist.accent_color};
            color: white;
          }
          .support__action button:hover {
            background-color: ${this.ColorLuminance(artist.accent_color, -0.2)};
          }
          .support__level-form,
          .support__artist-info_image {
            border-color: ${artist.accent_color};
          }`,
          }}
        />
        <div className="row no-gutters justify-content-center">
          <div className="col-md-8">{this.renderSupportHeader(artistName)}</div>
        </div>
        <div className="row no-gutters justify-content-center">
          <div className="col-md-8">
            <div className="stripe" />
          </div>
        </div>
        <div className="row no-gutters justify-content-center">
          <div className="col-md-12">
            <div className="support__content">
              {this.renderPaymentStep(artist)}
            </div>
          </div>
        </div>
        {subscriptions.status === SubscriptionStep.SupportLevel &&
          this.renderStartSubscriptionAction(artistName)}
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
    showToast: bindActionCreators(showToastAction, dispatch),
  };
};

const Support = connect(mapStateToProps, mapDispatchToProps)(SupportComponent);

export { Support };
