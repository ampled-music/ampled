import * as React from 'react';
import { Switch } from 'react-router-dom';

import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
// import { Artist } from './artist/Artist';
import { PostForm } from './artist/posts/post-form/PostForm';
import { Support } from './artist/support/Support';
// import { Home } from './home/Home';
// import { NoArtist } from './shared/no-artist/NoArtist';
import { routePaths } from './route-paths';
// import { UserSettings } from './settings/UserSettings';
// import { UserDetails } from './user-details/UserDetails';
// import { ResetPassword } from './connect/ResetPassword';

const LazyArtist = React.lazy(() => import('./artist/Artist').then(module => ({ default: module.Artist })));
const LazyNoArtist = React.lazy(() => import('./shared/no-artist/NoArtist').then(module => ({ default: module.NoArtist })));
const LazyHome = React.lazy(() => import('./home/Home').then(module => ({ default: module.Home })));
const LazyResetPassword = React.lazy(() => import('./connect/ResetPassword').then(module => ({ default: module.ResetPassword })));
const LazyUserSettings = React.lazy(() => import('./settings/UserSettings').then(module => ({ default: module.UserSettings })));
const LazyUserDetails = React.lazy(() => import('./user-details/UserDetails').then(module => ({ default: module.UserDetails })));

const Routes = () => {
  return (
    <Switch>
      {/* <PublicRoute exact path={routePaths.home} component={Home} /> */}
      <PublicRoute exact path={routePaths.artists} component={LazyArtist} />
      <PublicRoute exact path={routePaths.slugs} component={LazyArtist} />
      <PublicRoute exact path={routePaths.support} component={Support} />
      <PublicRoute exact path={routePaths.createPost} component={PostForm} />
      <PublicRoute exact path={routePaths.root} component={LazyHome} />
      <PublicRoute exact path={routePaths.passwordReset} component={LazyResetPassword} />
      <PublicRoute exact path={routePaths.noArtist} component={LazyNoArtist} />
      <ProtectedRoute exact path={routePaths.settings} component={LazyUserSettings} />
      <ProtectedRoute exact path={routePaths.userDetails} component={LazyUserDetails} />
      <PublicRoute path={'*'} component={LazyNoArtist} />
    </Switch>
  );
};

export { Routes };
