import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { bindActionCreators } from 'redux';
import { userSignUpAction } from 'src/redux/ducks/login';
import { routePaths } from '../route-paths';

import './login.scss';

interface Props {
  signup: {
    errors: {};
  };
  userSignUp: Function;
  authentication: {
    authenticated: boolean;
  };
}

class SignupComponent extends React.Component<Props, any> {
  state = {
    email: '',
    password: '',
    name: '',
    confirmPassword: '',

    matchPasswordsError: false,
    passwordError: null,
    emailError: null,
    acceptTerms: false,
    submitted: false,
  };

  passwordsMatch(): boolean {
    const { password, confirmPassword } = this.state;
    const match = password === confirmPassword;

    this.setState({ matchPasswordsError: !match });

    return match;
  }

  async validateFields() {
    const passwordsMatch = this.passwordsMatch();

    if (!passwordsMatch) {
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

    const { email, password, confirmPassword, name } = this.state;

    await this.props.userSignUp(email, password, confirmPassword, name);

    this.setState({ submitted: true });

    this.checkErrors();
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value, matchPasswordsError: false, passwordError: null, emailError: null });
  };

  toggle = (e) => {
    this.setState({ acceptTerms: !this.state.acceptTerms });
  };

  checkErrors() {
    const { signup } = this.props;
    if (!signup.errors) {
      return;
    }

    Object.keys(signup.errors).forEach((err) => {
      this.setState({ [`${err}Error`]: `${err} ${signup.errors[err]}` });
    });
  }

  render() {
    const { submitted, matchPasswordsError, emailError, passwordError } = this.state;
    const { signup, authentication } = this.props;

    if (submitted && !signup.errors) {
      return (
        <Redirect
          to={{
            pathname: routePaths.login,
            showMessage: true,
          }}
        />
      );
    }

    if (authentication.authenticated) {
      return <Redirect to={routePaths.root} />;
    }

    const passwordErrorMessage = 'Passwords do not match.';

    return (
      <div>
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
              type="email"
              placeholder="Email"
              name="email"
              onChange={this.handleChange}
              required
            />
            <span className="error-message">{emailError}</span>

            <input
              className="input-group-text"
              type="password"
              placeholder="Password"
              name="password"
              onChange={this.handleChange}
              required
              minLength={6}
            />
            <span className="error-message">{(matchPasswordsError && passwordErrorMessage) || passwordError}</span>

            <input
              className="input-group-text"
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              onChange={this.handleChange}
              required
              minLength={6}
            />
            <span className="error-message">{(matchPasswordsError && passwordErrorMessage) || passwordError}</span>

            <label className="terms">
              <input type="checkbox" name="terms" onChange={this.toggle} required />
              You agree to our{' '}
              <a href="">
                <u>Terms of Service</u>
              </a>
              .
            </label>
            <button className="btn" type="submit">
              SIGN UP
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
  signup: state.userSignUp,
});

const mapPropsToDispatch = (dispatch) => ({
  userSignUp: bindActionCreators(userSignUpAction, dispatch),
});

const Signup = connect(
  mapStateToProps,
  mapPropsToDispatch,
)(SignupComponent);

export { Signup };
