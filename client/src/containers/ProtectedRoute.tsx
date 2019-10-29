import * as React from 'react';
import { Redirect, Route } from 'react-router-dom';
import * as store from 'store';

import { config } from '../config';
import { routePaths } from './route-paths';
import { Nav } from './shared/nav/Nav';

export const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isLoggedIn = !!store.get(config.localStorageKeys.token);
  const redirectComponent = <Redirect to={{ pathname: routePaths.root }} />;

  const renderComponent = (props) => {
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
            <Component {...props} />
          </main>
        </div>
      </div>
    );
  };

  return <Route {...rest} render={(props) => (isLoggedIn ? renderComponent(props) : redirectComponent)} />;
};
