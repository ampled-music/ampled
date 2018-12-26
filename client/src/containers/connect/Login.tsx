import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { bindActionCreators } from 'redux';
import { userLoginAction } from 'src/redux/ducks/login';
import { Nav } from '../nav/Nav';
import { routePaths } from '../route-paths';

import './login.scss';

class LoginComponent extends React.Component<any, any> {
  state = {
    email: '',
    password: '',
    submitted: false,
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const { login } = this.props;
    const { email, password } = this.state;

    await this.props.userLogin(email, password);

    if (login.error) {
      alert(login.error);
    } else {
      this.setState({ submitted: true });
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    if (this.state.submitted) {
      return <Redirect to={routePaths.connect} />;
    }

    if (this.props.authentication.authenticated) {
      return <Redirect to={routePaths.root} />;
    }

    return (
      <div>
        <Nav />
        <div className="login">
          <h2>LOGIN</h2>
          <form className="form-container form-control flex-column" name="login" onSubmit={this.handleSubmit}>
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
            <button className="btn" type="submit">
              LOGIN
            </button>
          </form>
          <label>
            Forgot your password?{' '}
            <a href="">
              <u>click here</u>
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
  login: state.userLogin,
});

const mapPropsToDispatch = (dispatch) => ({
  userLogin: bindActionCreators(userLoginAction, dispatch),
});

const Login = connect(
  mapStateToProps,
  mapPropsToDispatch,
)(LoginComponent);

export { Login };
