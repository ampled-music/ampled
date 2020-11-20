import './menu.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { logoutAction } from '../../../redux/authentication/logout';
import { Store } from '../../../redux/configure-store';
import * as store from 'store';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Menu from '@material-ui/core/Menu';
import MenuList from '@material-ui/core/MenuList';

import { config } from '../../../config';
import menu from '../../../images/icons/Icon_Menu.svg';
import { initialState as authenticationInitialState } from '../../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../../redux/me/initial-state';
import { routePaths } from '../../route-paths';

import { ArtistSearch } from '../artist-search/ArtistSearch';

interface State {
  open: boolean;
  anchorEl: any;
}

interface menuProps {
  renderLoginLink: any;
}

type Dispatchers = ReturnType<typeof mapDispatchToProps>;

type Props = typeof authenticationInitialState &
  typeof meInitialState &
  Dispatchers &
  menuProps;

class MenuListComposition extends React.Component<Props, State> {
  state = {
    open: false,
    anchorEl: undefined,
  };

  componentDidMount() {
    this.setState({ anchorEl: this.refs.menu });
  }

  componentDidUpdate() {
    if (!this.props.loggedOut) {
      return;
    }

    store.remove(config.localStorageKeys.token);
    window.location.href = routePaths.root;
  }

  handleToggle = () => {
    this.setState((state) => ({ open: !state.open }));
  };

  handleClose = (event: { target: any }) => {
    if (this.state.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  logout = (event: any) => {
    this.props.logout();
    this.handleClose(event);
  };

  renderDefaultMenu = () => {
    return (
      <div className="menu-items">
        <div className="hide-desktop">
          {!this.props.userData && this.props.renderLoginLink()}
        </div>
        <a href={config.menuUrls.createArtist}>
          <b>Create an artist page</b>
        </a>
        <div className="divider" />
        <a href={config.menuUrls.blog}>Blog</a>
        <a href={config.menuUrls.about}>About us</a>
        <a href={config.menuUrls.browse}>Browse artists</a>
        <ArtistSearch imageSize={30} />
      </div>
    );
  };

  renderUserMenu = () => {
    return (
      <div className="menu-items">
        <Link to={routePaths.settings}>
          <b>My Profile</b>
        </Link>
        <button className="link" onClick={this.logout}>
          Logout
        </button>
        <a href={config.menuUrls.browse}>Browse artists</a>
        <ArtistSearch imageSize={30} />
      </div>
    );
  };

  render() {
    const { open, anchorEl } = this.state;
    const { userData } = this.props;

    return (
      <div className="menu">
        <img
          className="menu-icon"
          src={menu}
          alt="menu"
          onClick={this.handleToggle}
          ref="menu"
        />

        <Menu
          open={open}
          anchorEl={anchorEl}
          className="menu-box"
          disablePortal
        >
          <div className="menu-list">
            <ClickAwayListener onClickAway={this.handleClose}>
              <MenuList>
                {userData ? this.renderUserMenu() : this.renderDefaultMenu()}
              </MenuList>
            </ClickAwayListener>
          </div>
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = (state: Store) => ({
  ...state.authentication,
  ...state.me,
});

const mapDispatchToProps = (dispatch) => {
  return {
    logout: bindActionCreators(logoutAction, dispatch),
  };
};

const MenuComponent = MenuListComposition;
const MenuEx = connect(mapStateToProps, mapDispatchToProps)(MenuComponent);

export { MenuEx };
