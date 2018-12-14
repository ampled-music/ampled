import * as React from 'react';
import logo from '../../ampled_logo.svg';

import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <header className="header">
      <Link to="/">
        <img src={logo} alt="logo" className="logo" height="100%" />
      </Link>
    </header>
  );
};

export { Nav };
