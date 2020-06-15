import './nav.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { openAuthModalAction } from '../../../redux/authentication/authentication-modal';
import { Store } from '../../../redux/configure-store';

import logo from '../../../images/ampled_logo_beta.svg';
import avatar from '../../../images/avatars/Avatar_Blank.svg';
import { initialState as loginInitialState } from '../../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../../redux/me/initial-state';
import { routePaths } from '../../route-paths';
import { Menu } from '../menu/Menu';
import { UserRoles } from '../user-roles';
import { Image, Transformation } from 'cloudinary-react';

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

  showSupportButton = () => {
    const loggedUserAccess = this.getLoggedUserPageAccess();
    const { isStripeSetup } = this.props.artist;
    if (!isStripeSetup) {
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
        redirectTo: routePaths.support.replace(':id', artistId),
      });
    }
  };

  renderUserImage = () => {
    const { userData } = this.props;

    return userData.image?.public_id ? (
      <Link to="/settings">
        <Image
          publicId={userData.image.public_id}
          alt={userData.name}
          className="user-image"
        >
          <Transformation
            fetchFormat="auto"
            crop="fill"
            width={60}
            height={60}
            responsive_placeholder="blank"
          />
        </Image>
      </Link>
    ) : (
      <Link to="/settings">
        <img src={avatar} className="user-image" alt="Your avatar" />
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
            Support this artist
          </button>
        )}
        <div className="menus">
          <div className="supporter-message">You are a supporter</div>
          <div className="loginLink">{this.renderNavLink()}</div>
          <Menu renderLoginLink={this.renderLoginLink} />
        </div>
        {this.showSupportButton() && (
          <div className="stickySupport">
            <button
              className="btn btn-ampled btn-support"
              onClick={this.handleSupportClick}
            >
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
  artistError: state.artists.error,
});

const mapDispatchToProps = (dispatch) => ({
  openAuthModal: bindActionCreators(openAuthModalAction, dispatch),
});

const Nav = connect(mapStateToProps, mapDispatchToProps)(NavComponent);

export { Nav };
