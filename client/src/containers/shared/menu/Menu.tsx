import './menu.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { logoutAction } from 'src/redux/authentication/logout';
import { Store } from 'src/redux/configure-store';
import * as store from 'store';

import { faSearch, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
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
    marginRight: theme.spacing.unit * 2,
  },
});

interface State {
  open: boolean;
  anchorEl: any;
}

type Dispatchers = ReturnType<typeof mapDispatchToProps>;

type Props = typeof authenticationInitialState & typeof meInitialState & Dispatchers;

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
      <div>
        <MenuItem>
          <Link to="">
            <b>Create an artist page</b>
          </Link>
        </MenuItem>
        <div className="divider" />
        <MenuItem>
          <Link to="">Blog</Link>
        </MenuItem>
        <MenuItem>
          <Link to="">About us</Link>
        </MenuItem>
        <Divider />
        <MenuItem>
          <div>
            <FontAwesomeIcon icon={faSearch} /> Search
          </div>
        </MenuItem>
      </div>
    );
  };

  renderUserMenu = () => {
    return (
      <div>
        <MenuItem>
          <Link to="">
            <div>
              <FontAwesomeIcon icon={faUsers} size="lg" /> <b>Your band here</b>
            </div>
          </Link>
        </MenuItem>
        <div className="divider" />
        <MenuItem>
          <Link to={routePaths.settings}>Account Settings</Link>
        </MenuItem>
        <MenuItem>
          <Link to="">Blog</Link>
        </MenuItem>
        <MenuItem>
          <Link to="">About us</Link>
        </MenuItem>
        <MenuItem onClick={this.logout}>Logout</MenuItem>
        <Divider />
        <MenuItem>
          <div>
            <FontAwesomeIcon icon={faSearch} /> Search
          </div>
        </MenuItem>
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
