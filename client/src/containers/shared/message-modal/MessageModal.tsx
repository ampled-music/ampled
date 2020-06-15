import * as React from 'react';
import { ReactSVG } from 'react-svg';

import { MuiThemeProvider } from '@material-ui/core/styles';
import { Dialog } from '@material-ui/core';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import IconButton from '@material-ui/core/IconButton';
import Close from '../../../images/icons/Icon_Close-Cancel.svg';

import './message-modal.scss';
import { theme } from './theme';

interface Props {
  open: boolean;
  onClose: Function;
  artistBio: string;
  accentColor: string;
  handleSupportClick: Function;
  showSupport: boolean;
}

class MessageModalComponent extends React.Component<Props, any> {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Dialog
          open={this.props.open}
          aria-labelledby="message"
          onClose={(e) => this.props.onClose(e)}
          className="message-modal"
        >
          <div className="message-modal_bio">
            {this.props.artistBio}
            {this.props.showSupport && (
              <button
                className="btn btn-ampled btn-support"
                style={{
                  borderColor: this.props.accentColor,
                  maxWidth: '90%',
                  marginTop: '10px',
                }}
                onClick={(e) => this.props.handleSupportClick()}
              >
                Support What You Want
              </button>
            )}
          </div>
          <IconButton
            className="close-x"
            aria-label="close"
            color="primary"
            onClick={(e) => this.props.onClose(e)}
          >
            <ReactSVG className="icon" src={Close} />
          </IconButton>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

const MessageModal = withMobileDialog()(MessageModalComponent);

export { MessageModal };
