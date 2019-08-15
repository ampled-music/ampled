import './nav.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { openAuthModalAction } from 'src/redux/authentication/authentication-modal';
import { Store } from 'src/redux/configure-store';

import logo from '../../../images/ampled_logo.svg';
import avatar from '../../../images/ampled_avatar.svg';
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
  history: any;
  artist: any;
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

  handleSupportClick = () => {
    if (this.props.userData) {
      this.props.history.push(routePaths.support.replace(':id', this.props.match.params.id));
    } else {
      this.props.openAuthModal({
        modalPage: 'signup',
        showSupportMessage: 'artist',
        artistName: this.props.artist.name,
        redirectTo: routePaths.support.replace(':id', this.props.match.params.id),
      });
    }
  };

  renderUserImage = () => {
    const { userData } = this.props;

    return userData.image ? (
      <a href="/settings">
        <img src={userData.image} className="user-image" />
      </a>
    ) : (
      <a href="/settings">
        <img src={avatar} className="user-image" />
      </a>
    );
  };

  renderLoginLink = () => (
    <div>
      <a onClick={() => this.props.openAuthModal({ modalPage: 'login' })}>
        <b>Login</b>
      </a>{' '}
      or{' '}
      <a onClick={() => this.props.openAuthModal({ modalPage: 'signup' })}>
        <b>Sign Up</b>
      </a>
    </div>
  );

  renderNavLink = () => {
    if (this.props.userData) {
      return (
        this.renderUserImage()
      )
    } else if (!this.props.userData && !this.props.loadingMe) {
      return (
        this.renderLoginLink()
      )
    }
  }

  render() {
    return (
      <header className="header">
        <Link className="logo" to="/">
          <img src={logo} alt="logo" height="100%" />
        </Link>
        {this.showSupportButton() && (
          <button className="btn btn-ampled btn-support btn-support-header" onClick={this.handleSupportClick}>
            Support this artist
          </button>
        )}
        <div className="menus">
          <div className="supporter-message">
            You are a supporter
          </div>
          <div className="loginLink">
            {console.log(this.props)}
            {this.renderNavLink()}
          </div>
          <Menu renderLoginLink={this.renderLoginLink} />
        </div>
        {this.showSupportButton() && (
          <div className="stickySupport">
            <button className="btn btn-ampled btn-support" onClick={this.handleSupportClick}>
              Support this artist
            </button>
          </div>
        )}
      </header>
    );
  }
}

const mapStateToProps = (state: Store) => ({
  ...state.authentication,
  ...state.me,
  artist: state.artists.artist,
});

const mapDispatchToProps = (dispatch) => ({
  openAuthModal: bindActionCreators(openAuthModalAction, dispatch),
});

const Nav = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavComponent);

export { Nav };
