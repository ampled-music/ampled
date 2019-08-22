import './modal.scss';

import * as React from 'react';

import { Dialog } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import IconButton from '@material-ui/core/IconButton';
import { faTimes} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { theme } from './theme';

interface Props {
  open: any;
  fullScreen: boolean;
  onClose?: () => void;
}

class Modal extends React.Component<Props, any> {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Dialog
          open={this.props.open}
          aria-labelledby="form-dialog-title"
          onClose={this.props.onClose}
          fullScreen={this.props.fullScreen}
        >
          {
            this.props.fullScreen && 
            (<IconButton className="fullscreen-close" aria-label="close" color="primary" onClick={this.props.onClose}>
              <FontAwesomeIcon
                icon={faTimes}
              />
            </IconButton>)  
          }
          {this.props.children}
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

const ModalComponent = withMobileDialog()(Modal);

export {
  ModalComponent as Modal
};