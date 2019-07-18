import * as React from 'react';

import { MuiThemeProvider } from '@material-ui/core/styles';
import { Dialog } from '@material-ui/core';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import tear from '../../../images/background_tear.png';

import './why-modal.scss';
import { theme } from './theme';

interface Props {
  open: boolean;
  onClose: Function;
  handleSupportClick: Function;
}

class WhyModalComponent extends React.Component<Props, any> {

  render() {

    return (
      <MuiThemeProvider theme={theme}>
        <Dialog
          open={this.props.open}
          onClose={(e) => this.props.onClose(e)}
        >
          <img className="tear__topper" src={tear} />
          <div className="why-support">
            <h1 className="why-support__title">Why Support Through Ampled?</h1>
            <div className="why-support__subheader">Your Money, Directly To Artists</div>
            <div className="why-support__copy">No exploitative intermediaries. Ampled is owned by the artists on the platform.</div>
            <div className="why-support__subheader">Direct Connection & Cool Exclusive Stuff</div>
            <div className="why-support__copy">Unlock and get first access to anything this artist posts.</div>
            <div className="why-support__subheader">Support Artist Solidarity</div>
            <div className="why-support__copy">Show that you are a responsible music consumer by contributing directly to the artists you love.</div>
            <button className="btn btn-ampled btn-support" onClick={(e) => this.props.handleSupportClick()}> 
              Become a Supporter 
            </button>
            { <div
                className="link link__why" 
                onClick={(e) => this.props.onClose(e)}
                aria-label="Close"
              >
                Cancel
              </div> 
            }
          </div>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

const WhyModal = withMobileDialog()(WhyModalComponent);

export { WhyModal };
