import * as React from 'react';
import logo from '../../images/ampled_logo.svg';

import { Link } from 'react-router-dom';
import { Menu } from '../menu/Menu';
import { routePaths } from '../route-paths';

import './nav.scss';

const Nav = () => {
  return (
    <header className="header">
      <Link className="logo" to="/">
        <img src={logo} alt="logo" height="100%" />
      </Link>
      <div className="menus">
        <div className="loginLink">
          <Link to={routePaths.login}>
            <b>Login</b>
          </Link>{' '}
          or{' '}
          <Link to={routePaths.signup}>
            <b>Sign Up</b>
          </Link>
        </div>
        <Menu />
      </div>
    </header>
  );
};

export { Nav };
