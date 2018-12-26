import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { userLogin } from 'src/redux/ducks/login';
import * as store from 'store';
import { config } from '../../config';
import { authenticate } from '../../redux/ducks/authenticate';
import { routePaths } from '../route-paths';

import { Nav } from '../nav/Nav';
import './login.scss';

class SignupComponent extends React.Component<any, any> {
  state = {
    username: '',
    password: '',
    name: '',
    confirmPassword: '',
    matchPasswordError: false,
    terms: false,
    submitted: false,
  };

  componentDidMount() {
    const token = store.get(config.localStorageKeys.token);
    if (token) {
      this.props.dispatch(authenticate(token));
    }
  }

  checkPassword(): any {
    const { password, confirmPassword } = this.state;

    return password === confirmPassword;
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    if (!this.checkPassword()) {
      this.setState({ matchPasswordError: true });

      return;
    }
    await this.props.dispatch(userLogin(this.state.username, this.state.password));
    if (this.props.login.error) {
      alert(this.props.login.error);
    } else {
      this.setState({ submitted: true });
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value, matchPasswordError: false });
  };

  toggle = (e) => {
    this.setState({ terms: !this.state.terms });
  };

  render() {
    const { submitted, matchPasswordError } = this.state;

    if (submitted) {
      return <Redirect to={routePaths.connect} />;
    }

    if (this.props.authentication.authenticated) {
      return <Redirect to={routePaths.root} />;
    }

    const passwordErrorMessage = 'Passwords do not match';

    return (
      <div>
        <Nav />
        <div className="login">
          <h2>SIGN UP</h2>
          <form className="form-container form-control flex-column" name="login" onSubmit={this.handleSubmit}>
            <input
              className="input-group-text"
              type="text"
              placeholder="Full Name"
              name="name"
              onChange={this.handleChange}
              required
            />
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
            <input
              className="input-group-text"
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              onChange={this.handleChange}
              required
            />
            <span className="error-message">{matchPasswordError && passwordErrorMessage}</span>

            <label className="terms">
              <input type="checkbox" name="terms" onChange={this.toggle} required />
              You agree to our{' '}
              <a href="">
                <u>Terms of Service</u>
              </a>
              .
            </label>
            <button className="btn" type="submit">
              LOGIN
            </button>
          </form>
          <label>
            Already have an account?{' '}
            <a href="/login">
              <u>Sign in</u>
            </a>
            .
          </label>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  authentication: state.authentication,
  login: state.loginReducer,
});

const Signup = connect(mapStateToProps)(SignupComponent);

export { Signup };
