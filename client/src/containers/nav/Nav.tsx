import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { authenticate } from 'src/redux/ducks/authenticate';
import * as store from 'store';
import { config } from '../../config';
import logo from '../../images/ampled_logo.svg';
import { Menu } from '../menu/Menu';
import { routePaths } from '../route-paths';

import { getMe } from '../../redux/ducks/get-me';

import './nav.scss';

interface Props {
  authentication: {
    authenticated: boolean;
  };
  authenticate: Function;
  supported?: boolean;
}

class NavComponent extends React.Component<Props, any> {
  componentDidMount() {
    const token = store.get(config.localStorageKeys.token);
    if (token) {
      this.props.authenticate(token);
    }
    getMe();
    console.log(getMe)
    console.log("cdm nav")
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    // const { email, password } = this.state;

    // await this.props.support(artistId, user.id);

    this.setState({ submitted: true });
  };

  render() {
    const { authentication } = this.props;
    const supported = this.props.supported || false;

    return (
      <header className="header">
        <Link className="logo" to="/">
          <img src={logo} alt="logo" height="100%" />
        </Link>
        { !supported && 
          <button className="btn btn-support" onClick={this.handleSubmit}>
            Support
          </button> 
        }
        <div className="menus">
          <div className="loginLink">
            {authentication.authenticated ? (
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
          <Menu />
        </div>
      </header>
    );
  }
}

const mapStateToProps = (state) => ({
  authentication: state.authentication,
  me: state.me,
});

const mapDispatchToProps = (dispatch) => ({
  authenticate: bindActionCreators(authenticate, dispatch),
  getMe: bindActionCreators(getMe, dispatch),
});

const Nav = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavComponent);

export { Nav };
