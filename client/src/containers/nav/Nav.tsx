import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { authenticate } from 'src/redux/ducks/authenticate';
import * as store from 'store';
import { config } from '../../config';
import logo from '../../images/ampled_logo.svg';
import { Menu } from '../menu/Menu';
import { routePaths } from '../route-paths';

import './nav.scss';

class NavComponent extends React.Component<any, any> {
  componentDidMount() {
    const token = store.get(config.localStorageKeys.token);
    if (token) {
      this.props.authenticate(token);
    }
  }
  render() {
    const { authentication } = this.props;

    return (
      <header className="header">
        <Link className="logo" to="/">
          <img src={logo} alt="logo" height="100%" />
        </Link>
        <div className="menus">
          <div className="loginLink">
            {authentication.authenticated ? (
              'User Logged in'
            ) : (
              <div>
                <Link to={routePaths.login}>
                  <b>Login</b>
                </Link>
                or
                <Link to={routePaths.signup}>
                  <b>Sign Up</b>
                </Link>
              </div>
            )}
          </div>
          <Menu />
        </div>
      </header>
    );
  }
}

const mapStateToProps = (state) => ({
  authentication: state.authentication,
});

const mapDispatchToProps = (dispatch) => ({
  authenticate: bindActionCreators(authenticate, dispatch),
});

const Nav = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavComponent);

export { Nav };
