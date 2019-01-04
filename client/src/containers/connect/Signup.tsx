import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { bindActionCreators } from 'redux';
import { userSignUpAction } from 'src/redux/ducks/login';
import { Nav } from '../nav/Nav';
import { routePaths } from '../route-paths';

import './login.scss';

interface Props {
  login: {
    error: string;
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
    const { submitted, matchPasswordsError } = this.state;

    if (submitted) {
      return <Redirect to={routePaths.connect} />;
    }

    if (this.props.authentication.authenticated) {
      return <Redirect to={routePaths.root} />;
    }

    const passwordErrorMessage = 'Passwords do not match.';

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
  login: state.userSignUp,
});

const mapPropsToDispatch = (dispatch) => ({
  userSignUp: bindActionCreators(userSignUpAction, dispatch),
});

const Signup = connect(
  mapStateToProps,
  mapPropsToDispatch,
)(SignupComponent);

export { Signup };
