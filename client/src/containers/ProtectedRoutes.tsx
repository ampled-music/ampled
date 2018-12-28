import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Artist } from './artist/Artist';
import { routePaths } from './route-paths';
import { User } from './user/User';

export class ProtectedRoutesComponent extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path={routePaths.loggedUser.root} component={User} />
        <Route exact path={routePaths.artists} component={Artist} />
        <Route render={() => <Redirect to={routePaths.root} />} />
      </Switch>
    );
  }
}

const ProtectedRoutes = connect(
  null,
  null,
  null,
  { pure: false },
)(ProtectedRoutesComponent);

export { ProtectedRoutes };
