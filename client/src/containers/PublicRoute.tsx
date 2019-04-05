import * as React from 'react';
import { Route } from 'react-router-dom';
import { Nav } from './nav/Nav';

export const PublicRoute = ({ component: Component, ...rest }) => {
  const renderComponent = (props) => (
    <div className="public-routes">
      <div className="card">
        <Nav />
        <main>
          <Component {...props} />
        </main>
      </div>
      <img className="hipaa-logo" src="/assets/images/hipaa-logo.svg" />
    </div>
  );

  return <Route {...rest} render={renderComponent} />;
};
