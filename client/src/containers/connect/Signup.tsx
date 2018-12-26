import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { bindActionCreators } from 'redux';
import { checkEmailAvailability, userLogin } from 'src/redux/ducks/login';
import * as store from 'store';
import { config } from '../../config';
import { authenticate } from '../../redux/ducks/authenticate';
import { Nav } from '../nav/Nav';
import { routePaths } from '../route-paths';

import './login.scss';

class SignupComponent extends React.Component<any, any> {
  state = {
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    emailIsAvailable: true,
    matchPasswordsError: false,
    acceptTerms: false,
    submitted: false,
  };

  componentDidMount() {
    const token = store.get(config.localStorageKeys.token);
    if (token) {
      this.props.dispatch(authenticate(token));
    }
  }

  passwordsMatch(): boolean {
    const { password, confirmPassword } = this.state;
    const match = password === confirmPassword;

    this.setState({ matchPasswordsError: !match });

    return match;
  }

  async validateFields() {
    const passwordsMatch = this.passwordsMatch();

    const isEmailAvailable = await checkEmailAvailability(this.state.email);
    this.setState({ emailIsAvailable: isEmailAvailable });

    if (!isEmailAvailable || !passwordsMatch) {
      return false;
    }

    return true;
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    const canSubmit = await this.validateFields();

    if (!canSubmit) {
      return;
    }

    await this.props.userLogin(this.state.email, this.state.password);
    if (this.props.login.error) {
      alert(this.props.login.error);
    } else {
      this.setState({ submitted: true });
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value, matchPasswordsError: false });
  };

  toggle = (e) => {
    this.setState({ acceptTerms: !this.state.acceptTerms });
  };

  render() {
    const { emailIsAvailable, submitted, matchPasswordsError } = this.state;

    if (submitted) {
      return <Redirect to={routePaths.connect} />;
    }

    if (this.props.authentication.authenticated) {
      return <Redirect to={routePaths.root} />;
    }

    const passwordErrorMessage = 'Passwords do not match.';
    const emailErrorMessage = 'Email already taken.';

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
              name="email"
              onChange={this.handleChange}
              required
            />
            <span className="error-message">{!emailIsAvailable && emailErrorMessage}</span>

            <input
              className="input-group-text"
              type="password"
              placeholder="Password"
              name="password"
              onChange={this.handleChange}
              required
            />
            <span className="error-message">{matchPasswordsError && passwordErrorMessage}</span>

            <input
              className="input-group-text"
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              onChange={this.handleChange}
              required
            />
            <span className="error-message">{matchPasswordsError && passwordErrorMessage}</span>

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
              <u>Log in</u>
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

const mapPropsToDispatch = (dispatch) => ({
  userLogin: bindActionCreators(userLogin, dispatch),
});

const Signup = connect(
  mapStateToProps,
  mapPropsToDispatch,
)(SignupComponent);

export { Signup };
