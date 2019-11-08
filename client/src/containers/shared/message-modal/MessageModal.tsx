import * as React from 'react';

import { Dialog } from '@material-ui/core';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import './message-modal.scss';

interface Props {
  open: boolean;
  onClose: Function;
  artistBio: string;
}

class MessageModalComponent extends React.Component<Props, any> {

  render() {
    return (
      <Dialog
        open={this.props.open}
        aria-labelledby="message"
        onClose={(e) => this.props.onClose(e)}
        className="message-modal"
      >
        <div className="message-modal_bio">
          {this.props.artistBio}
        </div>
      </Dialog>
    );
  }
}

const MessageModal = withMobileDialog()(MessageModalComponent);

export { MessageModal };
