import './../artist/artist.scss';
import './user-settings.scss';

import * as React from 'react';
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
import { apiAxios } from '../../api/setup-axios';

import { initialState as loginInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';
import { initialState as subscriptionsInitialState } from '../../redux/subscriptions/initial-state';
import { routePaths } from '../route-paths';
import { Modal } from '../shared/modal/Modal';
import { ResetPassword } from '../connect/ResetPassword';
import { Loading } from '../shared/loading/Loading';

import { UserInfo } from './UserInfo';
import { OwnedPages } from './OwnedPages';
import { SupportedPages } from './SupportedPages';
import { CancelSubscription } from './CancelSubscription';
import { SetUpBanner } from './SetUpBanner';

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

    console.log('this.props:', this.props);

    return (
      <ThemeProvider theme={theme}>
        {userData && (
          <SetUpBanner
            userData={userData}
            requestApproval={this.requestApproval}
          />
        )}
        <div className="container user-settings-container">
          <Loading isLoading={this.props.loadingMe && !userData} />
          {userData && (
            <div className="row content">
              <UserInfo userData={userData} />
              <div className="pages-container col-md-9">
                {userData.ownedPages.length > 0 && (
                  <OwnedPages ownedPages={userData.ownedPages} />
                )}
                {userData.subscriptions.length > 0 ? (
                  <SupportedPages
                    supportedPages={userData.subscriptions}
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
          )}
          {this.state.showPasswordModal && (
            <Modal
              open={this.state.showPasswordModal}
              onClose={() => this.closeModal('Password')}
            >
              <ResetPassword type="change" />
            </Modal>
          )}
          <Modal
            open={this.state.showCancelModal}
            onClose={() => this.closeModal('Cancel')}
          >
            <CancelSubscription
              name={this.state.subscription?.name}
              closeModal={this.closeModal}
              cancelSubscription={this.cancelSubscription}
            />
          </Modal>
        </div>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state: Store) => ({
  ...state.artists,
  ...state.me,
  authentication: state.authentication,
  subscriptions: state.subscriptions,
});

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

const UserSettings = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserSettingsComponent);

export { UserSettings };
