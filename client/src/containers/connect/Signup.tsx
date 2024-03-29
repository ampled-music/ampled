import './login.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  closeAuthModalAction,
  openAuthModalAction,
} from '../../redux/authentication/authentication-modal';
import { Store } from '../../redux/configure-store';
import * as store from 'store';
import { signupAction } from '../../redux/signup/signup';
import { loginAction } from '../../redux/authentication/login';
import { showToastAction } from '../../redux/toast/toast-modal';

import { initialState as authenticationInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';
import { initialState as signupInitialState } from '../../redux/signup/initial-state';

import tear from '../../images/backgrounds/background_tear.png';

import { once } from 'ramda';

const mapStateToProps = (state: Store) => ({
  authentication: state.authentication,
  signup: state.signup,
  me: state.me,
});

const mapDispatchToProps = (dispatch) => ({
  login: bindActionCreators(loginAction, dispatch),
  signup: bindActionCreators(signupAction, dispatch),
  openAuthModal: bindActionCreators(openAuthModalAction, dispatch),
  closeAuthModal: bindActionCreators(closeAuthModalAction, dispatch),
  showToast: bindActionCreators(showToastAction, dispatch),
});

interface SignupProps {
  signup: typeof signupInitialState;
  authentication: typeof authenticationInitialState;
  me: typeof meInitialState;
  login: typeof authenticationInitialState;
}

type Dispatchers = ReturnType<typeof mapDispatchToProps>;
type Props = SignupProps & Dispatchers;

class SignupComponent extends React.Component<Props, any> {
  initialState = {
    email: '',
    password: '',
    name: '',
    last_name: '',
    confirmPassword: '',
    matchPasswordsError: false,
    passwordError: null,
    emailError: null,
    acceptTerms: false,
    submitted: false,
  };

  state = this.initialState;
  emailPass = {
    email: null,
    password: null,
  };

  componentDidUpdate() {
    const { signup, authentication } = this.props;

    if (
      this.state.submitted &&
      !signup.errors &&
      authentication.authModalOpen &&
      !authentication.authenticating
    ) {
      this.props.showToast({
        message: 'Signed up! Please wait while we log you in.',
        type: 'success',
      });
      this.doLogin();
    }
  }

  login = async () => {
    const { token } = await this.props.login(
      this.emailPass.email,
      this.emailPass.password,
    );
    if (token) {
      store.set('token', token);
      this.props.closeAuthModal();
      if (this.props.authentication.redirectTo) {
        window.location = this.props.authentication.redirectTo;
      }
    }
  };

  doLogin = once(this.login);

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

    const { email, password, confirmPassword, name, last_name } = this.state;
    this.emailPass = { email, password };

    const { authentication } = this.props;

    const submitResult = await this.props.signup(
      email,
      password,
      confirmPassword,
      name,
      last_name,
      authentication?.showSupportMessage === 'create'
        ? '/create-artist?login=true'
        : '/',
    );

    if (submitResult) {
      this.setState({ submitted: true });
      this.checkErrors();
    } else {
      this.props.showToast({
        message: 'Error signing up. Maybe you already have an account?',
        type: 'error',
      });
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
      matchPasswordsError: false,
      passwordError: null,
      emailError: null,
    });
  };

  toggle = () => {
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
    const { matchPasswordsError, emailError, passwordError } = this.state;
    const { authentication } = this.props;

    const passwordErrorMessage = 'Passwords do not match.';
    const memberSupporter =
      this.props.authentication.artistSlug === 'community'
        ? 'member'
        : 'supporter';

    return (
      <div className="login__container">
        <img className="tear tear__topper" src={tear} alt="" />
        <div className="login">
          <h4>SIGN UP</h4>
          {authentication.showSupportMessage &&
            authentication.showSupportMessage === 'create' && (
              <p>Sign up to create an artist page.</p>
            )}

          {authentication.showSupportMessage &&
            authentication.showSupportMessage === 'post' &&
            authentication.artistName && (
              <p>
                This is a private post. Sign up and become a {memberSupporter}{' '}
                of {authentication.artistName} to access it.
              </p>
            )}
          {authentication.showSupportMessage &&
            authentication.showSupportMessage === 'artist' &&
            authentication.artistName && (
              <p>
                Sign up to become a {memberSupporter} of{' '}
                {authentication.artistName}.
              </p>
            )}
          <form
            className="form-container form-control flex-column"
            name="login"
            onSubmit={this.handleSubmit}
          >
            <input
              className="input-group-text"
              type="text"
              placeholder="First Name"
              name="name"
              aria-label="First name"
              onChange={this.handleChange}
              required
            />
            <input
              className="input-group-text"
              type="text"
              placeholder="Last Name (Optional)"
              name="last_name"
              aria-label="Last name (optional)"
              onChange={this.handleChange}
            />

            <input
              className="input-group-text"
              type="email"
              placeholder="Email"
              name="email"
              aria-label="Email Address"
              onChange={this.handleChange}
              required
            />
            <span className="error-message">{emailError}</span>

            <input
              className="input-group-text"
              type="password"
              placeholder="Password"
              name="password"
              aria-label="Password"
              onChange={this.handleChange}
              required
              minLength={6}
            />
            <span className="error-message">
              {(matchPasswordsError && passwordErrorMessage) || passwordError}
            </span>

            <input
              className="input-group-text"
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              aria-label="Confirm password"
              onChange={this.handleChange}
              required
              minLength={6}
            />
            <span className="error-message">
              {(matchPasswordsError && passwordErrorMessage) || passwordError}
            </span>

            <label className="terms">
              <input
                type="checkbox"
                name="terms"
                onChange={this.toggle}
                required
                aria-label="Accept terms of use"
              />
              You agree to our Terms of Use, which you can read{' '}
              <a
                href="https://docs.ampled.com/policy/terms-of-use"
                rel="noopener noreferrer"
                target="_blank"
              >
                here
              </a>
              .
            </label>
            <button className="btn btn-ampled" type="submit">
              SIGN UP
            </button>
          </form>
          <label>
            Already have an account?{' '}
            <button
              className="link"
              onClick={() =>
                this.props.openAuthModal({
                  modalPage: 'login',
                  redirectTo: this.props.authentication.redirectTo,
                })
              }
            >
              <u>Log in</u>
            </button>
            .
          </label>
        </div>
      </div>
    );
  }
}

const Signup = connect(mapStateToProps, mapDispatchToProps)(SignupComponent);

export { Signup };
