import * as React from 'react';
import { ReactSVG } from 'react-svg';

import { Dialog } from '@material-ui/core';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import IconButton from '@material-ui/core/IconButton';
import Close from '../../../images/icons/Icon_Close-Cancel.svg';

import './join-modal.scss';

interface Props {
  open: boolean;
  onClose: Function;
  handleSupportClick: Function;
}

class JoinModalComponent extends React.Component<Props, any> {
  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={(e) => this.props.onClose(e)}
        className="join"
      >
        <div className="join__container">
          <div className="join__info">
            <h5 className="join__title">Why Join Ampled?</h5>
            <div className="join__subheader">
              Share In Our Collective Success
            </div>
            <div className="join__copy">
              Help build a more equitable online economy.
            </div>
            <div className="join__subheader">Get Exclusive Updates</div>
            <div className="join__copy">
              Unlock access to members-only updates.
            </div>
            <div className="join__subheader">Have Your Voice Heard</div>
            <div className="join__copy">
              Community Members have voting power and board representation.
            </div>
            <div className="join__subheader">
              Support Artist & Worker Solidarity
            </div>
            <div className="join__copy">
              Help our co-op stay independent and serve artists, not investors.
            </div>
            <button
              className="btn btn-ampled btn-support"
              onClick={(e) => this.props.handleSupportClick()}
            >
              Become a Member
            </button>
            <div
              className="link link__why"
              onClick={(e) => this.props.onClose(e)}
              aria-label="Close"
            >
              Cancel
            </div>
            <IconButton
              className="close-x"
              aria-label="close"
              color="default"
              onClick={(e) => this.props.onClose(e)}
            >
              <ReactSVG className="icon" src={Close} />
            </IconButton>
          </div>
        </div>
      </Dialog>
    );
  }
}

const JoinModal = withMobileDialog()(JoinModalComponent);

export { JoinModal };
