import './menu.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { logoutAction } from '../../../redux/authentication/logout';
import { Store } from '../../../redux/configure-store';
import * as store from 'store';

import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { withStyles } from '@material-ui/core/styles';

import { config } from '../../../config';
import menu from '../../../images/menu.svg';
import { initialState as authenticationInitialState } from '../../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../../redux/me/initial-state';
import { routePaths } from '../../route-paths';

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  hideDesktop: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  }
});

interface State {
  open: boolean;
  anchorEl: any;
}

interface menuProps {
  renderLoginLink: any;
  classes: {
    hideDesktop: string;
  };
}

type Dispatchers = ReturnType<typeof mapDispatchToProps>;

type Props = typeof authenticationInitialState & typeof meInitialState & Dispatchers & menuProps;

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
        <div className={this.props.classes.hideDesktop}>
          {
            !this.props.userData && this.props.renderLoginLink()
          }
        </div>
        <a href={config.menuUrls.createArtist}>
          <b>Create an artist page</b>
        </a>
        <div className="divider" />
        <a href={config.menuUrls.blog}>
          Blog
        </a>
        <a href={config.menuUrls.about}>
          About us
        </a>
      </div>
    );
  };

  renderUserMenu = () => {
    return (
      <div className="menu-items">
        <Link to={routePaths.settings}>
          <FontAwesomeIcon icon={faCog} /> <b>My Profile</b>
        </Link>
        <Divider />
        <a onClick={this.logout}>Logout</a>
      </div>
    );
  };

  render() {
    const { open, anchorEl } = this.state;
    const { userData } = this.props;

    return (
      <div className="menu">
        <img className="menu-icon" src={menu} alt="menu" onClick={this.handleToggle} ref="menu" />

        <Popper open={open} anchorEl={anchorEl} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper className="menu-list">
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList>{userData ? this.renderUserMenu() : this.renderDefaultMenu()}</MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
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

const MenuComponent = withStyles(styles)(MenuListComposition);
const Menu = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MenuComponent);

export { Menu };
