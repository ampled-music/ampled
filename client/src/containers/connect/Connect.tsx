import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as store from 'store';

import { config } from '../../config';
import { authenticate } from '../../redux/ducks/authenticate';
import { routePaths } from '../route-paths';

export class ConnectComponent extends React.Component<any, any> {
  getToken = () => {
    return this.props.login.token;
  };

  componentDidMount() {
    const token = this.getToken();

    if (!token) {
      return;
    }

    store.set(config.localStorageKeys.token, token);

    this.props.dispatch(authenticate(token));
  }

  render() {
    return <Redirect to={routePaths.login} />;
  }
}

const mapStaTeToProps = (state) => {
  return {
    login: state.loginReducer,
  };
};

const Connect = connect(mapStaTeToProps)(ConnectComponent);

export { Connect };
