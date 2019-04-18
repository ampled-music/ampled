import './modal.scss';

import * as React from 'react';

import { Dialog } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import { theme } from './theme';

interface Props {
  open: any;
}

export class Modal extends React.Component<Props, any> {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Dialog open={this.props.open} aria-labelledby="form-dialog-title">
          {this.props.children}
        </Dialog>
      </MuiThemeProvider>
    );
  }
}
