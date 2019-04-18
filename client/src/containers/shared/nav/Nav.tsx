import './nav.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { openAuthModalAction } from 'src/redux/authentication/authentication-modal';
import { Store } from 'src/redux/configure-store';

import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import logo from '../../../images/ampled_logo.svg';
import { initialState as loginInitialState } from '../../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../../redux/me/initial-state';
import { routePaths } from '../../route-paths';
import { Menu } from '../menu/Menu';
import { UserRoles } from '../user-roles';

interface NavComponentProps {
  match: {
    params: {
      id: string;
    };
    path: string;
  };
}

type Dispatchers = ReturnType<typeof mapDispatchToProps>;

type Props = typeof loginInitialState & typeof meInitialState & NavComponentProps & Dispatchers;

class NavComponent extends React.Component<Props, any> {
  getLoggedUserPageAccess = () => {
    const { userData, match } = this.props;

    return userData && userData.artistPages.find((page) => page.artistId === +match.params.id);
  };

  showSupportButton = () => {
    const loggedUserAccess = this.getLoggedUserPageAccess();

    if (this.props.match.path.indexOf(routePaths.artists) === -1) {
      return false;
    }

    return (
      !loggedUserAccess || ![UserRoles.Supporter.toString(), UserRoles.Owner.toString()].includes(loggedUserAccess.role)
    );
  };

  renderLoginLink = () => (
    <div className="loginLink">
      {this.props.userData ? (
        <FontAwesomeIcon className="user-image" icon={faUserCircle} />
      ) : (
        <div>
          <a onClick={this.props.openAuthModal}>
            <b>Login</b>
          </a>{' '}
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
        {this.showSupportButton() && <button className="btn btn-support">Support</button>}
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
  openAuthModal: bindActionCreators(openAuthModalAction, dispatch),
});

const Nav = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavComponent);

export { Nav };
