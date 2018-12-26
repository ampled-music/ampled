import * as React from 'react';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { withStyles } from '@material-ui/core/styles';
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
                  <MenuList>
                    {authentication.authenticated ? (
                      <MenuItem onClick={this.logout}>Logout</MenuItem>
                    ) : (
                      <MenuItem>
                        <Link to={routePaths.signup}>
                          <b>Login</b> or <b>Sign Up</b>
                        </Link>
                      </MenuItem>
                    )}
                  </MenuList>
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
