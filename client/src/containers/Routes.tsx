import * as React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { Support } from './artist/support/Support';
import { routePaths } from './route-paths';

const LazyPostForm = React.lazy(() =>
  import('./artist/posts/post-form/PostForm').then((module) => ({
    default: module.PostForm,
  })),
);
const LazyArtist = React.lazy(() =>
  import('./artist/Artist').then((module) => ({ default: module.Artist })),
);
const LazyEditArtist = React.lazy(() =>
  import('./artist/EditArtist').then((module) => ({
    default: module.Edit,
  })),
);
const LazyNoArtist = React.lazy(() =>
  import('./shared/no-artist/NoArtist').then((module) => ({
    default: module.NoArtist,
  })),
);
const LazyHome = React.lazy(() =>
  import('./home/Home').then((module) => ({ default: module.Home })),
);
const LazyResetPassword = React.lazy(() =>
  import('./connect/ResetPassword').then((module) => ({
    default: module.ResetPassword,
  })),
);
const LazyForgotPassword = React.lazy(() =>
  import('./connect/ForgotPassword').then((module) => ({
    default: module.ForgotPassword,
  })),
);
const LazyUserSettings = React.lazy(() =>
  import('./settings/UserSettings').then((module) => ({
    default: module.UserSettings,
  })),
);
const LazyUserDetails = React.lazy(() =>
  import('./user-details/UserDetails').then((module) => ({
    default: module.UserDetails,
  })),
);
const LazyCreateArtist = React.lazy(() =>
  import('./create-artist/CreateArtist').then((module) => ({
    default: module.CreateArtist,
  })),
);
const LazyBrowse = React.lazy(() =>
  import('./home/HomeBrowse').then((module) => ({
    default: module.HomeBrowse,
  })),
);
const LazySinglePost = React.lazy(() =>
  import('./artist/posts/SinglePost').then((module) => ({
    default: module.SinglePost,
  })),
);

const Routes = () => {
  return (
    <Switch>
      {/* <PublicRoute exact path={routePaths.home} component={Home} /> */}
      <Route
        exact
        sensitive
        path={routePaths.capsSlugs}
        render={(props: { location: { pathname: string } }) => {
          return <Redirect to={`${props.location.pathname.toLowerCase()}`} />;
        }}
      />
      <PublicRoute exact path={routePaths.artists} component={LazyArtist} />
      <PublicRoute
        exact
        path={routePaths.viewPost}
        component={LazySinglePost}
      />
      <PublicRoute exact path={routePaths.slugs} component={LazyArtist} />
      <PublicRoute
        exact
        path={routePaths.editArtist}
        component={LazyEditArtist}
      />
      <PublicRoute exact path={routePaths.support} component={Support} />
      <PublicRoute
        exact
        path={routePaths.createPost}
        component={LazyPostForm}
      />
      <PublicRoute exact path={routePaths.root} component={LazyHome} />
      <PublicRoute
        exact
        path={routePaths.passwordReset}
        component={LazyResetPassword}
      />
      <PublicRoute
        exact
        path={routePaths.forgotPassword}
        component={LazyForgotPassword}
      />
      <PublicRoute exact path={routePaths.noArtist} component={LazyNoArtist} />
      <PublicRoute exact path={routePaths.browse} component={LazyBrowse} />
      <ProtectedRoute
        exact
        modalPage="signup"
        showSupportMessage="create"
        path={routePaths.createArtist}
        component={LazyCreateArtist}
      />
      <ProtectedRoute
        exact
        path={routePaths.settings}
        component={LazyUserSettings}
      />
      <ProtectedRoute
        exact
        path={routePaths.userDetails}
        component={LazyUserDetails}
      />
      <PublicRoute path={'*'} component={LazyNoArtist} />
    </Switch>
  );
};

export { Routes };
