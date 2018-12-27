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
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as store from 'store';
import { config } from '../../config';
import menu from '../../images/menu.svg';
import { routePaths } from '../route-paths';

import './menu.scss';

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

class MenuListComposition extends React.Component<any, State> {
  state = {
    open: false,
    anchorEl: undefined,
  };

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
    store.remove(config.localStorageKeys.token);
    this.handleClose(event);
    window.location.href = routePaths.root;
  };

  componentDidMount() {
    this.setState({ anchorEl: this.refs.menu });
  }

  renderDefaultMenu(): React.ReactNode {
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
  }

  renderUserMenu(): React.ReactNode {
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
          <Link to="">Account Settings</Link>
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
  }

  render() {
    const { open, anchorEl } = this.state;
    const { authentication } = this.props;

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
                  <MenuList>{authentication.authenticated ? this.renderUserMenu() : this.renderDefaultMenu()}</MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  authentication: state.authentication,
});

const MenuComponent = withStyles(styles)(MenuListComposition);
const Menu = connect(mapStateToProps)(MenuComponent);

export { Menu };
