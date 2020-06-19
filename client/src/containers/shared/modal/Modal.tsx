import './modal.scss';

import * as React from 'react';
import { ReactSVG } from 'react-svg';

import { Dialog } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import IconButton from '@material-ui/core/IconButton';
import Close from '../../../images/icons/Icon_Close-Cancel.svg';

import { theme } from './theme';

interface Props {
  open: any;
  fullScreen: boolean;
  onClose?: () => void;
  className?: string;
  disableBackdropClick?: boolean;
}

class Modal extends React.Component<Props, any> {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Dialog
          className={this.props.className}
          open={this.props.open}
          aria-labelledby="form-dialog-title"
          onClose={this.props.onClose}
          fullScreen={this.props.fullScreen}
          disableBackdropClick={this.props.disableBackdropClick}
        >
          {this.props.fullScreen && (
            <IconButton
              className="fullscreen-close"
              aria-label="close"
              color="primary"
              onClick={this.props.onClose}
            >
              <ReactSVG className="icon" src={Close} />
            </IconButton>
          )}
          {this.props.children}
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

const ModalComponent = withMobileDialog()(Modal);

export { ModalComponent as Modal };
