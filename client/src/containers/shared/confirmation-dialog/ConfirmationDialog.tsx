import { MuiThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as React from 'react';

import { theme } from './theme';

interface Props {
  open: boolean;
  closeConfirmationDialog: React.MouseEventHandler;
  discardChanges: React.MouseEventHandler;
}

class ResponsiveDialog extends React.Component<Props, any> {
  state = {
    open: this.props.open,
  };

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Dialog
          open={this.props.open}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            You have unsaved changes
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Your changes have not been saved, if you leave now they will be
              lost.
            </DialogContentText>
          </DialogContent>
          <DialogActions className="action-buttons">
            <Button
              style={{ width: '50%' }}
              className="cancel-button"
              onClick={this.props.discardChanges}
            >
              Discard changes
            </Button>
            <Button
              style={{ width: '50%' }}
              className="publish-button"
              onClick={this.props.closeConfirmationDialog}
              autoFocus
            >
              Continue editing
            </Button>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

const ConfirmationDialog = ResponsiveDialog;

export { ConfirmationDialog };
