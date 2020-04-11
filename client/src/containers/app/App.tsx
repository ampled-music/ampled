import '../../styles/App.css';
import '../shared/toast/toast.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Store } from '../../redux/configure-store';
import { getMeAction } from '../../redux/me/get-me';
import * as Sentry from '@sentry/browser';

import { closeAuthModalAction } from '../../redux/authentication/authentication-modal';
import {
  showToastAction,
  hideToastAction,
} from '../../redux/toast/toast-modal';
import { initialState as loginInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';
import { Routes } from '../Routes';
import { AuthModal } from '../connect/AuthModal';
import { Modal } from '../shared/modal/Modal';
import { Loading } from '../shared/loading/Loading';
import { Helmet } from 'react-helmet';
import Toast from './Toast';

const mapStateToProps = (state: Store) => ({
  ...state.authentication,
  ...state.me,
  toast: state.toast,
});

const mapDispatchToProps = (dispatch) => ({
  getMe: bindActionCreators(getMeAction, dispatch),
  closeAuthModal: bindActionCreators(closeAuthModalAction, dispatch),
  hideToast: bindActionCreators(hideToastAction, dispatch),
  showToast: bindActionCreators(showToastAction, dispatch),
});

type Dispatchers = ReturnType<typeof mapDispatchToProps>;

type Props = typeof loginInitialState &
  typeof meInitialState &
  Dispatchers & { history: any; toast: any };

class AppComponent extends React.Component<Props, any> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    Sentry.withScope((scope) => {
      scope.setExtra('componentStack', info);
      Sentry.captureException(error);
    });
  }

  componentDidMount() {
    this.props.getMe();
    const search = this.props.history?.location?.search;
    if (/flash=confirmed/gi.test(search)) {
      this.props.showToast({
        message: 'Your email has been confirmed!',
        type: 'success',
      });
    } else if (/flash=confirmerror/gi.test(search)) {
      this.props.showToast({
        message: 'There was an error confirming your email.',
        type: 'error',
      });
    }
  }

  componentDidUpdate() {
    if (
      this.props.token &&
      !this.props.error &&
      !this.props.userData &&
      !this.props.loadingMe
    ) {
      this.props.getMe();
    }
  }

  render() {
    const { visible } = this.props.toast;
    const { toast } = this.props;
    if (this.state.hasError) {
      return (
        <div className="page">
          <Helmet>
            <title>Ampled | Direct Community Support For Music Artists</title>
            {process.env.NODE_ENV === 'development' && (
              <meta name="robots" content="noindex, nofollow" />
            )}
          </Helmet>
          <div>
            <h3
              style={{
                textAlign: 'center',
                fontFamily: '"Courier", Courier, monospace',
              }}
            >
              Sorry, something went wrong - please try reloading.
            </h3>
          </div>
        </div>
      );
    }
    return (
      <div className="page">
        <Helmet>
          <title>Ampled | Direct Community Support For Music Artists</title>
          {process.env.NODE_ENV === 'development' && (
            <meta name="robots" content="noindex, nofollow" />
          )}
        </Helmet>
        <React.Suspense fallback={<Loading artistLoading={true} />}>
          <Routes />
          <Modal
            open={this.props.authModalOpen}
            onClose={() => {
              this.props.onModalCloseAction && this.props.onModalCloseAction();
              this.props.closeAuthModal();
            }}
          >
            <AuthModal history={this.props.history} />
          </Modal>
          {visible && <Toast toast={toast} hideToast={this.props.hideToast} />}
        </React.Suspense>
      </div>
    );
  }
}

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

export { App };
