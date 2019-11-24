import './login.scss';

import * as React from 'react';
import { Store } from 'src/redux/configure-store';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeAuthModalAction, openAuthModalAction } from 'src/redux/authentication/authentication-modal';

import { showToastMessage, MessageType } from '../shared/toast/toast';

import tear from '../../images/background_tear.png';

import { apiAxios } from '../../api/setup-axios';

class ForgotPasswordComponent extends React.Component<any> {
  state = {
    error: null,
    email: undefined
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    // AXIOS HIT ENDPOINT
    try {
      const { data } = await apiAxios({
        method: 'post',
        url: '/users/password.json',
        headers: {
          'Content-Type': 'application/json',
        },
        data: { user: { email: this.state.email } },
      });

      console.log(data);

      showToastMessage('Please check your email for next steps.', MessageType.SUCCESS);
      this.props.closeAuthModal();
    } catch (e) {
      console.log(e);
      this.setState({ error: 'Something went wrong.' });
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const { error } = this.state;

    return (
      <div className="login__container">
        <img className="tear tear__topper" src={tear} />
        <div className="login">
          <h4>FORGOT PASSWORD</h4>
          <form className="form-container form-control flex-column" name="login" onSubmit={this.handleSubmit}>
            <input
              className="input-group-text"
              type="email"
              placeholder="Email"
              aria-label="Email Address" 
              name="email"
              onChange={this.handleChange}
              required
            />
            <button className="btn btn-ampled" type="submit">
              RESET PASSWORD
            </button>
            <span className="error-message">{error}</span>
          </form>
          <label>
            <a onClick={() => this.props.openAuthModal({ modalPage: 'login' })}>
              <u>Back to login</u>
            </a>
          </label>
          {/* <label>
            Don't have an account?{' '}
            <a onClick={() => this.props.openAuthModal({ modalPage: 'signup' })}>
              <u>Sign up</u>
            </a>
            .
          </label> */}
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

const ForgotPassword = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ForgotPasswordComponent);

export { ForgotPassword };
