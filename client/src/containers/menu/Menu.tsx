import * as React from 'react';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { withStyles } from '@material-ui/core/styles';
import menu from '../../images/menu.svg';

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

  handleClose = (event) => {
    if (this.state.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  componentDidMount() {
    this.setState({ anchorEl: this.refs.menu });
  }

  render() {
    const { open, anchorEl } = this.state;

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
                    <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                    <MenuItem onClick={this.handleClose}>My account</MenuItem>
                    <MenuItem onClick={this.handleClose}>Logout</MenuItem>
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

const Menu = withStyles(styles)(MenuListComposition);

export { Menu };
