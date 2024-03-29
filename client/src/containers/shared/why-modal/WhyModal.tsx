import * as React from 'react';
import { ReactSVG } from 'react-svg';

import { Dialog } from '@material-ui/core';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import IconButton from '@material-ui/core/IconButton';
import Close from '../../../images/icons/Icon_Close-Cancel.svg';

import './why-modal.scss';

interface Props {
  open: boolean;
  onClose: Function;
  handleSupportClick: Function;
}

class WhyModalComponent extends React.Component<Props, any> {
  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={(e) => this.props.onClose(e)}
        className="why-support"
      >
        <div className="why-support__container">
          <div className="why-support__info">
            <h5 className="why-support__title">Why Support Through Ampled?</h5>
            <div className="why-support__subheader">
              Your Money, Directly To Artists
            </div>
            <div className="why-support__copy">
              No exploitative intermediaries. Ampled is owned by the artists on
              the platform.
            </div>
            <div className="why-support__subheader">
              Direct Connection & Cool Exclusive Stuff
            </div>
            <div className="why-support__copy">
              Unlock and get first access to anything this artist posts.
            </div>
            <div className="why-support__subheader">
              Support Artist Solidarity
            </div>
            <div className="why-support__copy">
              Show that you are a responsible music consumer by contributing
              directly to the artists you love.
            </div>
            <button
              className="btn btn-ampled btn-support"
              onClick={(e) => this.props.handleSupportClick()}
            >
              Become a Supporter
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

const WhyModal = withMobileDialog()(WhyModalComponent);

export { WhyModal };
