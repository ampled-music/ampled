import * as React from 'react';
import { Route } from 'react-router-dom';
import { Nav } from './shared/nav/Nav';

export const PublicRoute = ({ component: Component, ...rest }) => {
  const renderComponent = (props) => {
    document.body.style.background = 'white';

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

  return <Route {...rest} render={renderComponent} />;
};
