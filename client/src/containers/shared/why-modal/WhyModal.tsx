import * as React from 'react';

import { MuiThemeProvider } from '@material-ui/core/styles';
import { Dialog } from '@material-ui/core';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import './why-modal.scss';
import { theme } from './theme';

interface Props {
  open: boolean;
  onClose: Function;
}

class WhyModalComponent extends React.Component<Props, any> {

  render() {

    return (
      <MuiThemeProvider theme={theme}>
        <Dialog
          open={this.props.open}
          onClose={(e) => this.props.onClose(e)}
        >
          <div className="why-support">
          </div>
          { <span
              onClick={(e) => this.props.onClose(e)}
              aria-label="Close"
            >
              x
            </span> 
          }
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

const WhyModal = withMobileDialog()(WhyModalComponent);

export { WhyModal };
