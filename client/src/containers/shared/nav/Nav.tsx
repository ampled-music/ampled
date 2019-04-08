import './nav.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Store } from 'src/redux/configure-store';

import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import logo from '../../../images/ampled_logo.svg';
import { routePaths } from '../../route-paths';
import { Menu } from '../menu/Menu';

import { initialState as loginInitialState } from '../../../redux/authentication/initial-state';

type Props = typeof loginInitialState;

class NavComponent extends React.Component<Props, any> {
  render() {
    const { token } = this.props;

    return (
      <header className="header">
        <Link className="logo" to="/">
          <img src={logo} alt="logo" height="100%" />
        </Link>
        <button className="btn btn-support">Support</button>
        <div className="menus">
          <div className="loginLink">
            {token ? (
              <FontAwesomeIcon className="user-image" icon={faUserCircle} />
            ) : (
              <div>
                <Link to={routePaths.login}>
                  <b>Login</b>
                </Link>{' '}
                or{' '}
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

const mapStateToProps = (state: Store) => ({
  ...state.authentication,
});

const Nav = connect(mapStateToProps)(NavComponent);

export { Nav };
