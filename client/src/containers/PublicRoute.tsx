import * as React from 'react';
import { Route } from 'react-router-dom';
import { Nav } from './shared/nav/Nav';

export const PublicRoute = ({ component: Component, ...rest }) => {
  const renderComponent = (props) => (
    <div className="public-routes">
      <div className="card">
        <Nav match={props.match} />
        <main>
          <Component {...props} />
        </main>
      </div>
    </div>
  );

  return <Route {...rest} render={renderComponent} />;
};
