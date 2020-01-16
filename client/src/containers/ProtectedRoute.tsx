import * as React from 'react';
import { Route } from 'react-router-dom';
import * as store from 'store';

import { config } from '../config';
import { routePaths } from './route-paths';
import { Nav } from './shared/nav/Nav';

import { Store } from '../redux/configure-store';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  closeAuthModalAction,
  openAuthModalAction,
} from '../redux/authentication/authentication-modal';

class ProtectModal extends React.Component<any> {
  componentDidMount() {
    this.props.openAuthModal({
      modalPage: this.props.modalPage || 'login',
      customLoginMessage: 'This page requires you to be logged in.',
      onModalCloseAction: () => (window.location.href = '/'),
    });
  }

  render() {
    return <div></div>;
  }
}

const ProtectedRoute = ({
  component: Component,
  modalPage = 'login',
  openAuthModal,
  ...rest
}) => {
  const renderComponent = (props) => {
    const isLoggedIn = !!store.get(config.localStorageKeys.token);

    if (props.location.pathname === routePaths.settings) {
      document.body.style.background = '#EDDFBD';
    } else {
      document.body.style.background = 'white';
    }

    return (
      <div className="public-routes">
        <div>
          <Nav match={props.match} history={props.history} />
          <main>
            {isLoggedIn ? (
              <Component {...props} />
            ) : (
              <ProtectModal
                modalPage={modalPage}
                openAuthModal={openAuthModal}
              />
            )}
          </main>
        </div>
      </div>
    );
  };

  return <Route {...rest} render={renderComponent} />;
};

const mapStateToProps = (state: Store) => ({
  // ...state.authentication,
  // ...state.me,
});

const mapDispatchToProps = (dispatch) => ({
  // getMe: bindActionCreators(getMeAction, dispatch),
  openAuthModal: bindActionCreators(openAuthModalAction, dispatch),
  closeAuthModal: bindActionCreators(closeAuthModalAction, dispatch),
});

const ProtectedRouteConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProtectedRoute);

export { ProtectedRouteConnect as ProtectedRoute };
