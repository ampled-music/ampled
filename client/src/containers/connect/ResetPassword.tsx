import './login.scss';

import * as React from 'react';
import { Store } from '../../redux/configure-store';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeAuthModalAction, openAuthModalAction } from '../../redux/authentication/authentication-modal';
import { routePaths } from './../route-paths';

import { showToastMessage, MessageType } from '../shared/toast/toast';

import tear from '../../images/background_tear.png';

import { apiAxios } from '../../api/setup-axios';

class ResetPasswordComponent extends React.Component<any> {
  state = {
    error: null,
    email: undefined,
    password: undefined,
    confirmPassword: undefined,
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const passwordsMatch = this.passwordsMatch();
    if (!passwordsMatch) {
      this.setState({ error: 'Passwords do not match.' });
      return;
    }

    const { search } = this.props.location;

    if (search.length < 1) {
      this.setState({ error: 'Missing reset token.' });
      return;
    }

    const token = search.match(/reset_password_token=([\d_-\w]+)/i)[1];

    if (!token) {
      this.setState({ error: 'Missing reset token.' });
      return;
    }

    const { password, confirmPassword } = this.state;

    try {
      const { data } = await apiAxios({
        method: 'put',
        url: '/users/password.json',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          user: {
            reset_password_token: token,
            password,
            password_confirmation: confirmPassword,
          },
        },
      });

      console.log(data);

      showToastMessage('Password changed! Please log in with your new password.', MessageType.SUCCESS);
      window.location.href = routePaths.root;
    } catch (e) {
      console.log(e);
      if (
        e.response &&
        e.response.data &&
        e.response.data.error &&
        e.response.data.error === 'You have to confirm your email address before continuing.'
      ) {
        this.setState({ error: 'You have to confirm your email address before continuing.' });
      } else {
        this.setState({ error: 'Something went wrong.' });
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

    return (
      <div className="login__container">
        <img className="tear tear__topper" src={tear} />
        <div className="login">
          <h4>RESET PASSWORD</h4>
          <form className="form-container form-control flex-column" name="login" onSubmit={this.handleSubmit}>
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
              RESET PASSWORD
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
});

const ResetPassword = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResetPasswordComponent);

export { ResetPassword };
