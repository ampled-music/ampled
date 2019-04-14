import './nav.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Store } from 'src/redux/configure-store';
import { getMeAction } from 'src/redux/me/get-me';

import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import logo from '../../../images/ampled_logo.svg';
import { initialState as loginInitialState } from '../../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../../redux/me/initial-state';
import { routePaths } from '../../route-paths';
import { Menu } from '../menu/Menu';

type Dispatchers = ReturnType<typeof mapDispatchToProps>;
type Props = typeof loginInitialState & typeof meInitialState & Dispatchers;

class NavComponent extends React.Component<Props, any> {
  componentDidMount() {
    this.props.getMe();
  }

  componentDidUpdate() {
    if (this.props.token && !this.props.userData) {
      this.props.getMe();
    }
  }

  renderLoginLink = () => (
    <div className="loginLink">
      {this.props.userData ? (
        <FontAwesomeIcon className="user-image" icon={faUserCircle} />
      ) : (
        <div>
          <Link to={routePaths.login}>
            <b>Login</b>
          </Link>{' '}
          or{' '}
          <Link to={routePaths.signup}>
            <b>Sign Up</b>
          </Link>
        </div>
      )}
    </div>
  );

  render() {
    return (
      <header className="header">
        <Link className="logo" to="/">
          <img src={logo} alt="logo" height="100%" />
        </Link>
        <button className="btn btn-support">Support</button>
        <div className="menus">
          {this.renderLoginLink()}
          <Menu />
        </div>
      </header>
    );
  }
}

const mapStateToProps = (state: Store) => ({
  ...state.authentication,
  ...state.me,
});

const mapDispatchToProps = (dispatch) => ({
  getMe: bindActionCreators(getMeAction, dispatch),
});

const Nav = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavComponent);

export { Nav };
