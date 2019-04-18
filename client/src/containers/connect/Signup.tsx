import './login.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeAuthModalAction, openAuthModalAction } from 'src/redux/authentication/authentication-modal';
import { Store } from 'src/redux/configure-store';
import { signupAction } from 'src/redux/signup/signup';

import { initialState as authenticationInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';
import { initialState as signupInitialState } from '../../redux/signup/initial-state';

interface SignupProps {
  signup: typeof signupInitialState;
  authentication: typeof authenticationInitialState;
  me: typeof meInitialState;
}

type Dispatchers = ReturnType<typeof mapDispatchToProps>;
type Props = SignupProps & Dispatchers;

class SignupComponent extends React.Component<Props, any> {
  initialState = {
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

  state = this.initialState;

  componentDidUpdate() {
    const { signup, closeAuthModal, authentication } = this.props;

    if (this.state.submitted && !signup.errors && authentication.authModalOpen) {
      this.setState(this.initialState);
      closeAuthModal();
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

    await this.props.signup(email, password, confirmPassword, name);

    this.setState({ submitted: true });

    this.checkErrors();
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value, matchPasswordsError: false, passwordError: null, emailError: null });
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

    return (
      <div>
        <div className="login">
          <h2>SIGN UP</h2>
          {authentication.showSupportMessage && (
            <p>This is a private post. Sign up and become a supporter of {authentication.artistName} to access it.</p>
          )}
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
            <a onClick={() => this.props.openAuthModal({ modalPage: 'login' })}>
              <u>Log in</u>
            </a>
            .
          </label>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: Store) => ({
  authentication: state.authentication,
  signup: state.signup,
  me: state.me,
});

const mapDispatchToProps = (dispatch) => ({
  signup: bindActionCreators(signupAction, dispatch),
  openAuthModal: bindActionCreators(openAuthModalAction, dispatch),
  closeAuthModal: bindActionCreators(closeAuthModalAction, dispatch),
});

const Signup = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignupComponent);

export { Signup };
