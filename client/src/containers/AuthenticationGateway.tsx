import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as store from 'store';

import { config } from '../config';
import { Artist } from './artist/Artist';
import { Connect } from './connect/Connect';
import { Login } from './connect/Login';
import { Home } from './home/Home';
import { PostForm } from './posts/PostForm';
import { Upload } from './posts/Upload';
import { routePaths } from './route-paths';

const AuthenticationGateway = ({ component: Component, path }: { component: any; path: string }) => {
  const componentRenderer = () => {
    if (!!store.get(config.localStorageKeys.token)) {
      return <Component exact path={path} />;
    }

    return <Redirect to={{ pathname: routePaths.home }} />;
  };

  return (
    <Switch>
      <Route exact path={routePaths.root} component={Home} />
      <Route exact path={routePaths.login} component={Login} />
      <Route exact path={routePaths.connect} component={Connect} />
      <Route exact path={routePaths.artists} component={Artist} />
      <Route exact path={routePaths.upload} component={Upload} />
      <Route exact path={routePaths.createPost} component={PostForm} />

      <Route render={componentRenderer} />
    </Switch>
  );
};

export { AuthenticationGateway };
