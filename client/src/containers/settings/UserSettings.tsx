import './../artist/artist.scss';
import './user-settings.scss';

import * as React from 'react';
import { ReactSVG } from 'react-svg';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  closeAuthModalAction,
  openAuthModalAction,
} from '../../redux/authentication/authentication-modal';
import { Store } from '../../redux/configure-store';
import { getMeAction } from '../../redux/me/get-me';
import { setUserDataAction } from '../../redux/me/set-me';
import { updateMeAction } from '../../redux/me/update-me';
import { showToastAction } from '../../redux/toast/toast-modal';
import { cancelSubscriptionAction } from '../../redux/subscriptions/cancel';

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Button, Card, CardContent, CardActions } from '@material-ui/core';
import { apiAxios } from '../../api/setup-axios';

import Close from '../../images/icons/Icon_Close-Cancel.svg';

import { initialState as loginInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';
import { initialState as subscriptionsInitialState } from '../../redux/subscriptions/initial-state';
import { routePaths } from '../route-paths';
import { Modal } from '../shared/modal/Modal';
import { ResetPassword } from '../connect/ResetPassword';
import { Loading } from '../shared/loading/Loading';
import { Sticky } from '../shared/sticky/Sticky';
import { PaymentStep } from '../artist/support/PaymentStep';

import { UserInfo } from './UserInfo';
import { OwnedPages } from './OwnedPages';
import { SupportedPages } from './SupportedPages';

const mapDispatchToProps = (dispatch) => ({
  getMe: bindActionCreators(getMeAction, dispatch),
  setMe: bindActionCreators(setUserDataAction, dispatch),
  openAuthModal: bindActionCreators(openAuthModalAction, dispatch),
  closeAuthModal: bindActionCreators(closeAuthModalAction, dispatch),
  cancelSubscription: bindActionCreators(cancelSubscriptionAction, dispatch),
  // editSubscription: bindActionCreators(editSubscriptionAction, dispatch),
  updateMe: bindActionCreators(updateMeAction, dispatch),
  showToast: bindActionCreators(showToastAction, dispatch),
});

type Dispatchers = ReturnType<typeof mapDispatchToProps>;

type Props = typeof loginInitialState &
  typeof meInitialState &
  Dispatchers & {
    history: any;
    location: any;
    subscriptions: typeof subscriptionsInitialState;
  };

class UserSettingsComponent extends React.Component<Props, any> {
  state = {
    showCancelModal: false,
    showChangeModal: false,
    showPasswordModal: false,
    subscription: undefined,
  };

  componentDidMount() {
    this.props.getMe();
    const {
      location: { search },
    } = this.props;

    if (!this.props.loadingMe && this.props.userData) {
      if (/stripesuccess=true/gi.test(search)) {
        this.props.showToast({
          message: "Great! You're all set up for payments.",
          type: 'success',
        });
      } else if (/stripesuccess=duplicate/gi.test(search)) {
        this.props.showToast({
          message:
            'This Stripe account is already used by an artist page. Please create a new Stripe account for each artist you wish to receive payouts for.',
          type: 'error',
        });
      }
      this.props.history.replace(this.props.location.pathname);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search },
    } = this.props;

    if (
      this.props.token &&
      !this.props.error &&
      !this.props.userData &&
      !this.props.loadingMe
    ) {
      this.props.getMe();
    }

    if (this.props.subscriptions.cancelled && !this.props.loadingMe) {
      this.showCancelledSuccessMessage();
      this.props.getMe();
    }

    if (!this.props.loadingMe && this.props.userData && prevProps.loadingMe) {
      if (/stripesuccess=true/gi.test(search)) {
        this.props.showToast({
          message: "Great! You're all set up for payments.",
          type: 'success',
        });
      } else if (/stripesuccess=duplicate/gi.test(search)) {
        this.props.showToast({
          message:
            'This Stripe account is already used by an artist page. Please create a new Stripe account for each artist you wish to receive payouts for.',
          type: 'error',
        });
      }
      this.props.history.replace(this.props.location.pathname);
    }
  }

  showCancelledSuccessMessage = () => {
    const { artistSlug, artistPageId, artistName } = this.props.subscriptions;
    const artistPageLink = routePaths.support.replace(
      ':id',
      artistSlug && artistSlug.length ? artistSlug : artistPageId.toString(),
    );

    this.props.showToast({
      message: (
        <>
          We are sad to see you leaving. Remember that you can always support{' '}
          <a href={artistPageLink}>{artistName}</a> with a different value!
        </>
      ),
      type: 'success',
    });
  };

  openModal = (event, subscription?) => {
    event.preventDefault();
    const { name } = event.target;
    console.log(name);
    this.setState({ [`show${name}Modal`]: true, subscription });
  };
  closeModal = (name) => {
    this.setState({ [`show${name}Modal`]: false, subscription: undefined });
  };

  cancelSubscription = () => {
    this.props.cancelSubscription({
      subscriptionId: this.state.subscription.subscriptionId,
      artistPageId: this.state.subscription.artistPageId,
      artistSlug: this.state.subscription.artistSlug,
      artistName: this.state.subscription.name,
    });
    this.closeModal('Cancel');
  };

  changeSubscription = () => {
    this.props.cancelSubscription({
      subscriptionId: this.state.subscription.subscriptionId,
      artistPageId: this.state.subscription.artistPageId,
      artistSlug: this.state.subscription.artistSlug,
      artistName: this.state.subscription.name,
    });
    this.closeModal('Change');
  };

  requestApproval = async (artistSlug) => {
    try {
      const { data } = await apiAxios({
        method: 'post',
        url: `/artist/${artistSlug}/request_approval.json`,
        data: {},
      });
      if (data.status === 'ok') {
        this.props.showToast({
          message: data.message,
          type: 'success',
        });
      } else {
        this.props.showToast({
          message: data.message,
          type: 'error',
        });
      }
    } catch {
      this.props.showToast({
        message: 'Sorry, something went wrong.',
        type: 'error',
      });
    }
  };

  renderCancelSubscriptionModal = () => {
    if (!this.state.subscription) {
      return null;
    }

    return (
      <Modal
        open={this.state.showCancelModal}
        onClose={() => this.closeModal('Cancel')}
      >
        <div className="user-settings-cancel-modal">
          <p>
            Are you sure you want to stop supporting{' '}
            {this.state.subscription.name}?
          </p>
          <div className="action-buttons">
            <Button
              className="cancel-button"
              onClick={() => this.closeModal('Cancel')}
              style={{ width: '50%' }}
            >
              Of Course Not!
            </Button>
            <Button
              className="publish-button"
              onClick={this.cancelSubscription}
              style={{ width: '50%' }}
            >
              Yes
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  renderChangeSubscriptionModal = () => {
    if (!this.state.subscription) {
      return null;
    }
    return (
      <Modal
        open={this.state.showChangeModal}
        onClose={() => this.closeModal('Change')}
      >
        <Card>
          <CardContent>
            <p>
              Would you like to change your support amount for{' '}
              {this.state.subscription.name}?
            </p>
            <PaymentStep
              artistName={this.state.subscription.name}
              subscriptions={this.state.subscription} // @todo: status and some other subscription info is not coming in.
              userData={this.props.userData}
            />
          </CardContent>
          <CardActions className="action-buttons">
            <Button
              aria-label="Cancel Change Subscription"
              className="cancel-button"
              onClick={() => this.closeModal('Change')}
              size="small"
            >
              <ReactSVG className="icon" src={Close} />
            </Button>
            <Button
              className="publish-button"
              onClick={this.cancelSubscription}
              style={{ marginLeft: 0 }}
            >
              Change support for {this.state.subscription.name}
            </Button>
          </CardActions>
        </Card>
      </Modal>
    );
  };

  renderSetUpBanner = () => {
    const { ownedPages } = this.props.userData;
    const noStripe = ownedPages.filter((ownedPage) => !ownedPage.isStripeSetup);
    const notApproved = ownedPages
      .filter((ownedPage) => ownedPage.isStripeSetup)
      .filter((ownedPage) => !ownedPage.approved);

    return (
      <>
        {noStripe.length > 0 && (
          <Sticky>
            <div className="artistAlertHeader__container">
              The Ampled team does a quick spot check of all pages before they
              become visible to the general public. Set up payout for{' '}
              {noStripe.map((page, index) => {
                if (noStripe.length > 1 && noStripe.length === index + 1) {
                  return (
                    <span key={`stripe-${index}`}>
                      {' '}
                      and <a href={page.stripeSignup}>{page.name}</a>
                    </span>
                  );
                } else if (
                  noStripe.length > 2 &&
                  noStripe.length !== index + 1
                ) {
                  return (
                    <span key={`stripe-${index}`}>
                      <a href={page.stripeSignup}>{page.name}</a>,{' '}
                    </span>
                  );
                } else {
                  return (
                    <a key={`stripe-${index}`} href={page.stripeSignup}>
                      {page.name}
                    </a>
                  );
                }
              })}{' '}
              to help us approve your page faster.
            </div>
          </Sticky>
        )}
        {notApproved.length > 0 && (
          <Sticky>
            <div className="artistAlertHeader__container">
              Congrats! Your page is now eligible for approval. When you’re
              ready for us to take a look, request approval for{' '}
              {notApproved.map((page, index) => {
                if (
                  notApproved.length > 1 &&
                  notApproved.length === index + 1
                ) {
                  return (
                    <span key={`request-${index}`}>
                      {' '}
                      and{' '}
                      <button
                        className="link link__banner"
                        onClick={() => this.requestApproval(page.artistSlug)}
                      >
                        {page.name}
                      </button>
                    </span>
                  );
                } else if (
                  notApproved.length > 2 &&
                  notApproved.length !== index + 1
                ) {
                  return (
                    <span key={`request-${index}`}>
                      <button
                        className="link link__banner"
                        onClick={() => this.requestApproval(page.artistSlug)}
                      >
                        {page.name}
                      </button>
                      ,{' '}
                    </span>
                  );
                } else {
                  return (
                    <button
                      key={`request-${index}`}
                      className="link link__banner"
                      onClick={() => this.requestApproval(page.artistSlug)}
                    >
                      {page.name}
                    </button>
                  );
                }
              })}{' '}
              to submit your page.
            </div>
          </Sticky>
        )}
      </>
    );
  };

  renderContent = () => (
    <div className="row content">
      <UserInfo userData={this.props.userData} />
      <div className="pages-container col-md-9">
        {this.props.userData.ownedPages.length > 0 && (
          <OwnedPages ownedPages={this.props.userData.ownedPages} />
        )}
        {this.props.userData.subscriptions.length > 0 ? (
          <SupportedPages
            supportedPages={this.props.userData.subscriptions}
            openModal={this.openModal}
          />
        ) : (
          <div>
            <h1>Supported Artists</h1>
            <div className="pages row justify-content-center justify-content-md-start">
              <div className="center col-md-8">
                You currently don&apos;t support any artists.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  render() {
    const { userData } = this.props;
    const theme = createMuiTheme({
      palette: {
        primary: { main: '#000' },
      },
      overrides: {
        MuiButton: {
          root: {
            fontSize: '1rem',
          },
        },
        MuiInput: {
          root: {
            borderRadius: '0',
            margin: '1rem auto',
            outline: 'none',
            width: '100%',
          },
          input: {
            textAlign: 'center',
            width: '100%',
          },
        },
        MuiPaper: {
          root: {
            backgroundColor: '#fff',
          },
        },
        MuiCard: {
          root: {},
        },
        MuiTypography: {
          root: {
            textAlign: 'center',
          },
        },
      },
      typography: {
        fontFamily: "'Courier', Courier, monospace",
      },
    });

    return (
      <ThemeProvider theme={theme}>
        {userData && this.renderSetUpBanner()}
        <div className="container user-settings-container">
          <Loading isLoading={this.props.loadingMe && !this.props.userData} />
          {userData && this.renderContent()}
          {this.state.showPasswordModal && (
            <Modal
              open={this.state.showPasswordModal}
              onClose={() => this.setState({ showPasswordModal: false })}
            >
              <ResetPassword type="change" />
            </Modal>
          )}
          <Modal
            open={this.state.showCancelModal}
            onClose={() => this.closeModal('Cancel')}
          >
            Cancel
            {/* <CancelSubscription subscription={this.state.subscription} /> */}
          </Modal>
          <Modal
            open={this.state.showChangeModal}
            onClose={() => this.closeModal('Change')}
          >
            Change
            {/* <ChangeSubscription subscription={this.state.subscription} /> */}
          </Modal>
        </div>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state: Store) => ({
  ...state.authentication,
  ...state.me,
  subscriptions: state.subscriptions,
});

const UserSettings = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserSettingsComponent);

export { UserSettings };
