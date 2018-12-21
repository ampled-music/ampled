import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { userLogin } from 'src/redux/ducks/login';
import * as store from 'store';
import { config } from '../../config';
import { authenticate } from '../../redux/ducks/authenticate';
import { routePaths } from '../route-paths';

import './login.scss';
import { Nav } from '../nav/Nav';

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

  handleSubmit = async (e) => {
    e.preventDefault();
    await this.props.dispatch(userLogin(this.state.username, this.state.password));
    if (this.props.login.error) {
      alert(this.props.login.error);
    } else {
      this.setState({ submitted: true });
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    if (this.state.submitted) {
      return <Redirect to={routePaths.connect} />;
    }

    if (this.props.authentication.authenticated) {
      return <Redirect to={routePaths.root} />;
    }

    return (
      <div>
        <Nav />
        <div className="login">
          <h2>LOGIN</h2>
          <form className="form-container form-control flex-column" name="login" onSubmit={this.handleSubmit}>
            <input
              className="input-group-text"
              type="text"
              placeholder="Email"
              name="username"
              onChange={this.handleChange}
              required
            />
            <input
              className="input-group-text"
              type="password"
              placeholder="Password"
              name="password"
              onChange={this.handleChange}
              required
            />
            <button className="btn" type="submit">
              LOGIN
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  authentication: state.authentication,
  login: state.loginReducer,
});

const Login = connect(mapStateToProps)(LoginComponent);

export { Login };
