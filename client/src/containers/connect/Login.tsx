import './login.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  closeAuthModalAction,
  openAuthModalAction,
} from '../../redux/authentication/authentication-modal';
import { showToastAction } from '../../redux/toast/toast-modal';
import { loginAction } from '../../redux/authentication/login';
import { Store } from '../../redux/configure-store';
import * as store from 'store';

import { initialState as loginInitialState } from '../../redux/authentication/initial-state';
import { routePaths } from '../route-paths';

import tear from '../../images/background_tear.png';

import { apiAxios } from '../../api/setup-axios';

import { once } from 'ramda';

interface LoginProps {
  history: any;
}

type Dispatchers = ReturnType<typeof mapDispatchToProps>;
type Props = typeof loginInitialState & Dispatchers & LoginProps;

class LoginComponent extends React.Component<Props, any> {
  state = {
    email: '',
    password: '',
    showConfirmationResend: false,
  };

  componentDidUpdate(prevProps) {
    if (this.props.error && !prevProps.error) {
      let { error } = this.props;
      if (/confirm your email/i.test(this.props.error)) {
        error = `${error}<br>Please use the link in the login form.`;
        this.setState({
          showConfirmationResend: true,
        });
      }
      this.props.showToast({ message: error, type: 'error' });
    }

    if (!this.props.token) {
      return;
    }

    once(() => {
      this.saveTokenToLocalStorage();
      this.props.showToast({
        message: 'You are logged in. Welcome back!',
        type: 'success',
      });
      if (this.props.redirectTo) {
        window.location = this.props.redirectTo;
      }
      this.props.closeAuthModal();
    })();
  }

  saveTokenToLocalStorage = () => {
    store.set('token', this.props.token);
  };

  redirectToRoot = () => {
    this.props.history.push(routePaths.root);
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    store.clearAll();

    const { email, password } = this.state;

    await this.props.login(email, password);
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  resendConfirmation = async () => {
    try {
      await apiAxios({
        method: 'post',
        url: '/users/confirmation.json',
        headers: {
          'Content-Type': 'application/json',
        },
        data: { user: { email: this.state.email } },
      });

      this.props.showToast({
        type: 'success',
        message: `Confirmation instructions have been sent to ${this.state.email}.`,
      });

      this.setState({
        showConfirmationResend: false,
      });
    } catch (e) {
      this.props.showToast({
        type: 'error',
        message: 'Something went wrong.',
      });
    }
  };

  render() {
    const { login, customLoginMessage } = this.props;

    return (
      <div className="login__container">
        <img className="tear tear__topper" src={tear} alt="" />
        <div className="login">
          <h4>LOGIN</h4>
          {customLoginMessage && <p>{customLoginMessage}</p>}

          <form
            className="form-container form-control flex-column"
            name="login"
            onSubmit={this.handleSubmit}
          >
            <input
              className="input-group-text"
              type="email"
              placeholder="Email"
              name="email"
              aria-label="Email Address"
              onChange={this.handleChange}
              required
            />
            <input
              className="input-group-text"
              type="password"
              placeholder="Password"
              name="password"
              aria-label="Password"
              onChange={this.handleChange}
              required
            />
            <button className="btn btn-ampled" type="submit">
              LOGIN
            </button>
            <span className="error-message">{login.error}</span>
          </form>
          {!this.state.showConfirmationResend && (
            <label>
              <button
                className="link"
                onClick={() =>
                  this.props.openAuthModal({ modalPage: 'forgotPassword' })
                }
              >
                <u>Forgot Password?</u>
              </button>
            </label>
          )}
          {this.state.showConfirmationResend && (
            <label style={{ textAlign: 'center' }}>
              <button className="link" onClick={this.resendConfirmation}>
                <u>
                  Re-send confirmation to
                  <br />
                  {this.state.email}
                </u>
              </button>
            </label>
          )}
          {process.env.NODE_ENV === 'development' &&
            !this.state.showConfirmationResend && (
              <label>
                Don't have an account?{' '}
                <button
                  className="link"
                  onClick={() =>
                    this.props.openAuthModal({ modalPage: 'signup' })
                  }
                >
                  <u>Sign up</u>
                </button>
                .
              </label>
            )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: Store) => ({
  ...state.authentication,
});

const mapDispatchToProps = (dispatch) => ({
  login: bindActionCreators(loginAction, dispatch),
  openAuthModal: bindActionCreators(openAuthModalAction, dispatch),
  closeAuthModal: bindActionCreators(closeAuthModalAction, dispatch),
  showToast: bindActionCreators(showToastAction, dispatch),
});

const Login = connect(mapStateToProps, mapDispatchToProps)(LoginComponent);

export { Login };
