import * as React from 'react';
import { Switch } from 'react-router-dom';

import { PublicRoute } from './PublicRoute';
import { Artist } from './artist/Artist';
import { PostForm } from './artist/posts/post-form/PostForm';
import { Home } from './home/Home';
import { routePaths } from './route-paths';

const Routes = () => {
  return (
    <Switch>
      <PublicRoute exact path={routePaths.home} component={Home} />
      <PublicRoute exact path={routePaths.artists} component={Artist} />
      <PublicRoute exact path={routePaths.createPost} component={PostForm} />
      <PublicRoute exact path={routePaths.root} component={Home} />
      <PublicRoute path={'*'} component={Home} />
    </Switch>
  );
};

export { Routes };
