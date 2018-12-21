import * as React from 'react';
import logo from '../../images/ampled_logo.svg';
import menu from '../../images/menu.svg';

import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <header className="header">
      <Link className="logo" to="/">
        <img src={logo} alt="logo" height="100%" />
      </Link>
      <Link to="/login">
        <img src={menu} alt="logo" className="menu" />
      </Link>
    </header>
  );
};

export { Nav };
