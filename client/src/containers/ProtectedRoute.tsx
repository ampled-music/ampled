import * as React from 'react';
import { Redirect, Route } from 'react-router-dom';
import * as store from 'store';

import { config } from '../config';
import { Menu } from './menu/Menu';
import { Nav } from './nav/Nav';
import { routePaths } from './route-paths';

export const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isLoggedIn = !!store.get(config.localStorageKeys.token);
  const redirectComponent = <Redirect to={{ pathname: routePaths.login }} />;

  const renderComponent = (props) => (
    <div className="private-routes">
      <section className="side-menu d-print-none">
        <Nav {...props} />
      </section>

      <div className="column">
        <section className="content">
          <header className="d-print-none">
            <Menu />
          </header>
          <main>
            <Component {...props} />
          </main>
        </section>
      </div>
    </div>
  );

  return <Route {...rest} render={(props) => (isLoggedIn ? renderComponent(props) : redirectComponent)} />;
};
