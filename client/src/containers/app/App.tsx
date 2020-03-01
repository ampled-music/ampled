import '../../styles/App.css';
import '../shared/toast/toast.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Store } from '../../redux/configure-store';
import { getMeAction } from '../../redux/me/get-me';

import { closeAuthModalAction } from '../../redux/authentication/authentication-modal';
import { hideToastAction } from '../../redux/toast/toast-modal';
import { initialState as loginInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';
import { Routes } from '../Routes';
import { AuthModal } from '../connect/AuthModal';
import { Modal } from '../shared/modal/Modal';
import { Loading } from '../shared/loading/Loading';
import { Helmet } from 'react-helmet';

type Dispatchers = ReturnType<typeof mapDispatchToProps>;

type Props = typeof loginInitialState &
  typeof meInitialState &
  Dispatchers & { history: any; toast: any };

class AppComponent extends React.Component<Props, any> {
  componentDidMount() {
    this.props.getMe();
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
          {visible && (
            <div id="toast-container" className="toast-top-full-width">
              <div className={`toast toast-${toast.type}`}>
                <button
                  type="button"
                  className="toast-close-button"
                  role="button"
                  onClick={this.props.hideToast}
                >
                  ×
                </button>
                <div className="toast-message">{toast.message}</div>
              </div>
            </div>
          )}
        </React.Suspense>
      </div>
    );
  }
}

const mapStateToProps = (state: Store) => ({
  ...state.authentication,
  ...state.me,
  toast: state.toast,
});

const mapDispatchToProps = (dispatch) => ({
  getMe: bindActionCreators(getMeAction, dispatch),
  closeAuthModal: bindActionCreators(closeAuthModalAction, dispatch),
  hideToast: bindActionCreators(hideToastAction, dispatch),
});

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

export { App };
