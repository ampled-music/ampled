import './login.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { closeAuthModalAction, openAuthModalAction } from 'src/redux/authentication/authentication-modal';
import { loginAction } from 'src/redux/authentication/login';
import { Store } from 'src/redux/configure-store';
import * as store from 'store';

import { initialState as loginInitialState } from '../../redux/authentication/initial-state';
import { routePaths } from '../route-paths';
import { showToastMessage, MessageType } from '../shared/toast/toast';

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
    if (!this.props.token) {
      return;
    }

    this.saveTokenToLocalStorage();
    showToastMessage('You are logged in. Welcome back!', MessageType.SUCCESS);
    this.props.closeAuthModal();
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
      <div>
        <div className="login">
          <h2>LOGIN</h2>
          <form className="form-container form-control flex-column" name="login" onSubmit={this.handleSubmit}>
            <input
              className="input-group-text"
              type="email"
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
            <button className="btn btn-submit" type="submit">
              LOGIN
            </button>
            <button className="btn" type="reset" onClick={this.props.closeAuthModal}>
              CANCEL
            </button>
            <span className="error-message">{login.error}</span>
          </form>
          <label>
            Don't have an account?{' '}
            <a onClick={() => this.props.openAuthModal({ modalPage: 'signup' })}>
              <u>Sign up</u>
            </a>
            .
          </label>
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
