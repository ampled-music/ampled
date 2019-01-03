import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as React from 'react';

interface Props {
  open: boolean;
  closeConfirmationDialog: any;
  discardChanges: any;
}

class ResponsiveDialog extends React.Component<Props, any> {
  state = {
    open: this.props.open,
  };

  render() {
    return (
      <div>
        <Dialog open={this.props.open} aria-labelledby="responsive-dialog-title">
          <DialogTitle id="responsive-dialog-title">You have unsaved changes</DialogTitle>
          <DialogContent>
            <DialogContentText>Your changes have not been saved, if you leave now they will be lost.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.discardChanges} color="primary">
              Discard changes
            </Button>
            <Button onClick={this.props.closeConfirmationDialog} color="primary" autoFocus>
              Continue editing
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const ConfirmationDialog = ResponsiveDialog;

export { ConfirmationDialog };
