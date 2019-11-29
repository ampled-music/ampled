import './login.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeAuthModalAction, openAuthModalAction } from '../../redux/authentication/authentication-modal';
import { loginAction } from '../../redux/authentication/login';
import { Store } from '../../redux/configure-store';
import * as store from 'store';

import { initialState as loginInitialState } from '../../redux/authentication/initial-state';
import { routePaths } from '../route-paths';
import { showToastMessage, MessageType } from '../shared/toast/toast';

import tear from '../../images/background_tear.png';

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
  };

  componentDidUpdate() {
    if (this.props.error) {
      showToastMessage(this.props.error, MessageType.ERROR);
    }

    if (!this.props.token) {
      return;
    }

    once(() => {
      this.saveTokenToLocalStorage();
      showToastMessage('You are logged in. Welcome back!', MessageType.SUCCESS);
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

  render() {
    const { login } = this.props;

    return (
      <div className="login__container">
        <img className="tear tear__topper" src={tear} alt="" />
        <div className="login">
          <h4>LOGIN</h4>
          <form className="form-container form-control flex-column" name="login" onSubmit={this.handleSubmit}>
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
          <label>
            <a onClick={() => this.props.openAuthModal({ modalPage: 'forgotPassword' })}>
              <u>Forgot Password?</u>
            </a>
          </label>
          { process.env.NODE_ENV === 'development' && (<label>
            Don't have an account?{' '}
            <a onClick={() => this.props.openAuthModal({ modalPage: 'signup' })}>
              <u>Sign up</u>
            </a>
            .
          </label>)}
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
});

const Login = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginComponent);

export { Login };
