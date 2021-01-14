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

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@material-ui/core';
import { UserImage } from '../../user-details/UserImage';

import { lightOrDark } from '../../../styles/utils';

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

  renderArtists = (owners) => (
    <div key="artists" className="support__artists">
      {owners.map((owner, index) => (
        <div key={index} className="support__artist-info">
          <Avatar>
            <UserImage image={owner.image} alt={owner.name} width={80} />
          </Avatar>
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
        <Card>
          <CardContent>
            <Typography variant="h5" component="h5">
              Support What You Want
            </Typography>
            <TextField
              aria-label="Support level"
              type="number"
              name="supportLevelValue"
              onChange={this.handleChange}
              value={this.state.supportLevelValue || ''}
              placeholder="3 min"
            />
            {this.state.supportLevelValue &&
            this.state.supportLevelValue >= 3 ? (
              <Typography component="p" className="support__value-description">
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
              </Typography>
            ) : (
              <Typography component="p" className="support__value-description">
                {this.isAmpled()
                  ? 'Join the co-op as a Community Member to help Ampled stay independent and accountable to members.'
                  : `Support ${artistName} directly for $3 (or more) per month to unlock
                access to all of their posts and get notifications when they post
                anything new.`}
              </Typography>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  renderStartSubscriptionAction = (artistName) => {
    const buttonLabel = this.props.me.userData
      ? this.isAmpled()
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

    const theme = createMuiTheme({
      palette: {
        primary: { main: artist.accent_color },
      },
      overrides: {
        MuiButton: {
          root: {
            borderRadius: '0',
            width: '100%',
            marginTop: '2rem',
            minHeight: '45px',
            color: lightOrDark(artist.accent_color),
            fontSize: '1rem',
          },
        },
        MuiInput: {
          root: {
            fontSize: '3rem',
            borderRadius: '0',
            margin: '1rem auto',
            outline: 'none',
            width: '100%',
          },
          input: {
            textAlign: 'center',
          },
        },
        MuiFormControl: {
          root: {
            '&:before': {
              content: '"$"',
              position: 'absolute',
              left: '10%',
              marginBottom: '2rem',
              fontSize: '1.5rem',
            },
            '&:after': {
              content: '"/Month"',
              position: 'absolute',
              right: '20px',
              bottom: '20px',
              fontSize: '.9rem',
            },
          },
        },
        MuiCard: {
          root: {
            borderRadius: '0',
            borderTop: `5px solid ${artist.accent_color}`,
            boxShadow:
              '0 20px 20px 0 rgba(10,31,68,.1),0 0 1px 0 rgba(10,31,68,.08)',
          },
        },
        MuiTypography: {
          root: {
            textAlign: 'center',
          },
          h5: {
            fontFamily: "'LL Replica Bold Web', sans-serif",
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
          },
        },
        MuiAvatar: {
          root: {
            width: '80px',
            height: '80px',
            backgroundColor: '#fff',
            border: `2px solid ${artist.accent_color}`,
          },
          colorDefault: {
            backgroundColor: '#fff',
          },
        },
      },
      typography: {
        fontFamily: "'Courier', Courier, monospace",
      },
    });

    return (
      <ThemeProvider theme={theme}>
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
            `,
            }}
          />
          <div className="row no-gutters justify-content-center">
            <div className="col-md-8">
              {this.renderSupportHeader(artist.name)}
            </div>
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
            this.renderStartSubscriptionAction(artist.name)}
        </div>
      </ThemeProvider>
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
