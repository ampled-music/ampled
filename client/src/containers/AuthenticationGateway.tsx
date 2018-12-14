import * as React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import * as store from 'store'

import { config } from '../config'
import Artist from './artist/Artist'
import Home from './home/Home'
import { routePaths } from './route-paths'

const AuthenticationGateway = ({ component: Component, path }: { component: any; path: string }) => {
  const componentRenderer = () => {
    if (!!store.get(config.localStorageKeys.token)) {
      return <Component exact path={path} />
    }

    return <Redirect to={{ pathname: routePaths.login }} />
  }

  return (
    <Switch>
      <Route exact path={routePaths.root} component={Home} />
      <Route exact path={routePaths.artists} component={Artist} />

      <Route render={componentRenderer} />
    </Switch>
  )
}

export { AuthenticationGateway }
