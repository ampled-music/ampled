import './nav.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { openAuthModalAction } from '../../../redux/authentication/authentication-modal';
import { Store } from '../../../redux/configure-store';

import logo from '../../../images/ampled_logo_beta.svg';
import { initialState as loginInitialState } from '../../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../../redux/me/initial-state';
import { routePaths } from '../../route-paths';
import { MenuEx } from '../menu/Menu';
import { UserRoles } from '../user-roles';
import { UserImage } from '../../user-details/UserImage';

interface NavComponentProps {
  match: {
    params: {
      id: string;
      slug: string;
    };
    path: string;
  };
  history: any;
  artist: any;
  artistError: any;
}

type Dispatchers = ReturnType<typeof mapDispatchToProps>;

type Props = typeof loginInitialState &
  typeof meInitialState &
  NavComponentProps &
  Dispatchers;

class NavComponent extends React.Component<Props, any> {
  getLoggedUserPageAccess = () => {
    const { userData, artist } = this.props;

    return (
      userData &&
      userData.artistPages.find((page) => page.artistId === +artist.id)
    );
  };

  isAmpled = () => {
    return this.props.artist.slug === 'community';
  };

  showSupportButton = () => {
    const loggedUserAccess = this.getLoggedUserPageAccess();
    const { isStripeSetup } = this.props.artist;

    if (!isStripeSetup) {
      return false;
    }

    // disable support button on Promote page
    if (this.props.match.path.indexOf(routePaths.promote) === 0) {
      return false;
    }

    if (
      this.props.match.path.indexOf(routePaths.artists) === -1 &&
      this.props.match.path.indexOf(routePaths.slugs) === -1
    ) {
      return false;
    } else if (this.props.artistError) {
      return false;
    }

    return (
      !loggedUserAccess ||
      ![
        UserRoles.Supporter.toString(),
        UserRoles.Owner.toString(),
        UserRoles.Member.toString(),
        UserRoles.Admin.toString(),
      ].includes(loggedUserAccess.role)
    );
  };

  handleSupportClick = () => {
    let artistId;

    if (this.props.match.params.slug) {
      artistId = this.props.match.params.slug;
    } else {
      artistId = this.props.match.params.id;
    }

    if (this.props.userData) {
      this.props.history.push(routePaths.support.replace(':id', artistId));
    } else {
      this.props.openAuthModal({
        modalPage: 'signup',
        showSupportMessage: 'artist',
        artistName: this.props.artist.name,
        artistSlug: this.props.artist.slug,
        redirectTo: routePaths.support.replace(':id', artistId),
      });
    }
  };

  renderUserImage = () => {
    const { userData } = this.props;

    return (
      <Link to="/settings">
        <UserImage
          image={userData.image}
          className="user-image"
          alt={userData.name}
          width={60}
        />
      </Link>
    );
  };

  renderLoginLink = () => (
    <div>
      <button
        className="link"
        onClick={() => this.props.openAuthModal({ modalPage: 'login' })}
      >
        <b>Login</b>
      </button>{' '}
      {/* or{' '}
      <button className="link" onClick={() => this.props.openAuthModal({ modalPage: 'signup' })}>
        <b>Sign Up</b>
      </button> */}
    </div>
  );

  renderNavLink = () => {
    if (this.props.userData) {
      return this.renderUserImage();
    } else if (!this.props.userData && !this.props.loadingMe) {
      return this.renderLoginLink();
    }
  };

  render() {
    return (
      <header className="header">
        <Link className="logo" to="/">
          <img src={logo} alt="logo" height="100%" />
        </Link>
        {this.showSupportButton() && (
          <button
            className="btn btn-ampled btn-support btn-support-header"
            onClick={this.handleSupportClick}
          >
            {this.isAmpled() ? 'Become a member' : 'Support this artist'}
          </button>
        )}
        <div className="menus">
          <div className="supporter-message">
            {this.isAmpled() ? 'You are a member' : 'You are a supporter'}
          </div>
          <div className="loginLink">{this.renderNavLink()}</div>
          <MenuEx renderLoginLink={this.renderLoginLink} />
        </div>
        {this.showSupportButton() && this.props.artist.approved && (
          <div className="stickySupport">
            <button
              className="btn btn-ampled btn-support"
              onClick={this.handleSupportClick}
            >
              {this.isAmpled() ? 'Become a member' : 'Support this artist'}
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
  artistError: state.artists.error,
});

const mapDispatchToProps = (dispatch) => ({
  openAuthModal: bindActionCreators(openAuthModalAction, dispatch),
});

const Nav = connect(mapStateToProps, mapDispatchToProps)(NavComponent);

export { Nav };
