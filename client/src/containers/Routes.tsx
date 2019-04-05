import * as React from 'react';
import { Switch } from 'react-router-dom';

import { PublicRoute } from './PublicRoute';
import { Artist } from './artist/Artist';
import { Connect } from './connect/Connect';
import { Login } from './connect/Login';
import { Signup } from './connect/Signup';
import { Home } from './home/Home';
import { PostForm } from './posts/post-form/PostForm';
import { routePaths } from './route-paths';

const Routes = () => {
  return (
    <Switch>
      <PublicRoute exact path={routePaths.login} component={Login} />
      <PublicRoute exact path={routePaths.root} component={Home} />
      <PublicRoute exact path={routePaths.home} component={Home} />
      <PublicRoute exact path={routePaths.artists} component={Artist} />
      <PublicRoute exact path={routePaths.login} component={Login} />
      <PublicRoute exact path={routePaths.signup} component={Signup} />
      <PublicRoute exact path={routePaths.connect} component={Connect} />
      <PublicRoute exact path={routePaths.createPost} component={PostForm} />
      <PublicRoute path={'*'} component={Home} />
    </Switch>
  );
};

export { Routes };
