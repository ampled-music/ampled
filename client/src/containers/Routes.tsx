import * as React from 'react';
import { Switch } from 'react-router-dom';

import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { Artist } from './artist/Artist';
import { PostForm } from './artist/posts/post-form/PostForm';
import { Support } from './artist/support/Support';
import { Home } from './home/Home';
import { NoArtist } from './shared/no-artist/NoArtist';
import { routePaths } from './route-paths';
import { UserSettings } from './settings/UserSettings';
import { UserDetails } from './user-details/UserDetails';
import { ResetPassword } from './connect/ResetPassword';

const Routes = () => {
  return (
    <Switch>
      <PublicRoute exact path={routePaths.home} component={Home} />
      <PublicRoute exact path={routePaths.artists} component={Artist} />
      <PublicRoute exact path={routePaths.slugs} component={Artist} />
      <PublicRoute exact path={routePaths.support} component={Support} />
      <PublicRoute exact path={routePaths.createPost} component={PostForm} />
      <PublicRoute exact path={routePaths.root} component={Home} />
      <PublicRoute exact path={routePaths.passwordReset} component={ResetPassword} />
      <PublicRoute exact path={routePaths.noArtist} component={NoArtist} />
      <ProtectedRoute exact path={routePaths.settings} component={UserSettings} />
      <ProtectedRoute exact path={routePaths.userDetails} component={UserDetails} />
      <PublicRoute path={'*'} component={Home} />
    </Switch>
  );
};

export { Routes };
