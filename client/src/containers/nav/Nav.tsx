import * as React from 'react';
import logo from '../../images/ampled_logo.svg';

import { Link } from 'react-router-dom';
import { Menu } from '../menu/Menu';

const Nav = () => {
  return (
    <header className="header">
      <Link className="logo" to="/">
        <img src={logo} alt="logo" height="100%" />
      </Link>
      <Menu />
    </header>
  );
};

export { Nav };
