import './login.scss';

import * as React from 'react';
import { Store } from '../../redux/configure-store';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  closeAuthModalAction,
  openAuthModalAction,
} from '../../redux/authentication/authentication-modal';
import { logoutAction } from '../../redux/authentication/logout';
import { showToastAction } from '../../redux/toast/toast-modal';
import { routePaths } from './../route-paths';

import { apiAxios } from '../../api/setup-axios';

type PasswordPackage = {
  password: string;
  password_confirmation: string;
  reset_password_token?: string;
  current_password?: string;
};

class ResetPasswordComponent extends React.Component<any> {
  state = {
    error: null,
    email: undefined,
    password: undefined,
    confirmPassword: undefined,
    currentPassword: undefined,
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { type = 'reset' } = this.props;
    const url =
      type === 'reset' ? '/users/password.json' : '/me/changepassword.json';
    const passwordsMatch = this.passwordsMatch();
    if (!passwordsMatch) {
      this.setState({ error: 'Passwords do not match.' });
      return;
    }

    let token;
    if (type === 'reset') {
      const { search } = this.props.location;

      if (search.length < 1) {
        this.setState({ error: 'Missing reset token.' });
        return;
      }

      token = search.match(/reset_password_token=([\d_-\w]+)/i)?.[1];

      if (!token) {
        this.setState({ error: 'Missing reset token.' });
        return;
      }
    }

    const { password, confirmPassword, currentPassword } = this.state;

    const passwordPackage: PasswordPackage = {
      password,
      password_confirmation: confirmPassword,
    };

    if (type === 'reset') {
      passwordPackage.reset_password_token = token;
    } else {
      passwordPackage.current_password = currentPassword;
    }

    try {
      await apiAxios({
        method: 'put',
        url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          user: passwordPackage,
        },
      });

      this.props.showToast({
        message: 'Password changed! Please log in with your new password.',
        type: 'success',
      });

      if (type === 'reset') {
        window.location.href = routePaths.root;
      } else {
        this.props.logout();
      }
    } catch (e) {
      if (
        e.response &&
        e.response.data &&
        e.response.data.error &&
        e.response.data.error ===
          'You have to confirm your email address before continuing.'
      ) {
        this.props.showToast({
          message: 'You have to confirm your email address before continuing.',
          type: 'error',
        });
      } else if (type === 'change') {
        this.props.showToast({
          message:
            'Something went wrong. Are you sure your Current Password is correct?',
          type: 'error',
        });
      } else {
        this.props.showToast({
          message: 'Something went wrong.',
          type: 'error',
        });
      }
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  passwordsMatch(): boolean {
    const { password, confirmPassword } = this.state;
    const match = password === confirmPassword;

    this.setState({ matchPasswordsError: !match });

    return match;
  }

  render() {
    const { error } = this.state;
    const { type = 'reset' } = this.props;
    const cta = type === 'reset' ? 'RESET PASSWORD' : 'CHANGE PASSWORD';

    return (
      <div className="login__container">
        <div className="login">
          <h4>{cta}</h4>
          <form
            className="form-container form-control flex-column"
            name="login"
            onSubmit={this.handleSubmit}
          >
            {type === 'change' && (
              <input
                className="input-group-text"
                type="password"
                placeholder="Current Password"
                name="currentPassword"
                aria-label="Current Password"
                onChange={this.handleChange}
                required
                minLength={6}
              />
            )}

            <input
              className="input-group-text"
              type="password"
              placeholder="New Password"
              name="password"
              aria-label="New Password"
              onChange={this.handleChange}
              required
              minLength={6}
            />

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
            <button className="btn btn-ampled" type="submit">
              {cta}
            </button>
            <span className="error-message">{error}</span>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: Store) => ({
  ...state.authentication,
});

const mapDispatchToProps = (dispatch) => ({
  openAuthModal: bindActionCreators(openAuthModalAction, dispatch),
  closeAuthModal: bindActionCreators(closeAuthModalAction, dispatch),
  logout: bindActionCreators(logoutAction, dispatch),
  showToast: bindActionCreators(showToastAction, dispatch),
});

const ResetPassword = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResetPasswordComponent);

export { ResetPassword };
