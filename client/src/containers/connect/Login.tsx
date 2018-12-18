import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { config } from 'src/config';
import { authenticate } from 'src/redux/ducks/authenticate';
import * as store from 'store';
import { routePaths } from '../route-paths';

class LoginComponent extends React.Component<any, any> {
  state = {
    username: '',
    password: '',
    submitted: false,
  };

  componentDidMount() {
    const token = store.get(config.localStorageKeys.token);
    if (token) {
      this.props.dispatch(authenticate(token));
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ submitted: true });
  };

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  render() {
    if (this.state.submitted) {
      return <Redirect to={routePaths.connect} />;
    }

    if (this.props.authentication.authenticated) {
      return <Redirect to={routePaths.root} />;
    }

    return (
      <div className="login">
        <h1>Login</h1>
        <form name="login" onSubmit={this.handleSubmit}>
          <input type="text" placeholder="email" name="username" onChange={() => this.handleChange} required />
          <input type="password" placeholder="password" name="password" onChange={() => this.handleChange} required />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  authentication: state.authentication,
});

const Login = connect(mapStateToProps)(LoginComponent);

export { Login };
