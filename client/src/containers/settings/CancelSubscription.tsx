import * as React from 'react';

import { Button } from '@material-ui/core';

interface Props {
  cancelSubscription: Function;
  closeModal: Function;
  name: string;
}

export class CancelSubscription extends React.Component<Props, any> {
  render() {
    const { cancelSubscription, closeModal, name } = this.props;
    return (
      <div className="user-settings-cancel-modal">
        <p>Are you sure you want to stop supporting {name}?</p>
        <div className="action-buttons">
          <Button
            className="cancel-button"
            onClick={() => closeModal('Cancel')}
            style={{ width: '50%' }}
          >
            Of Course Not!
          </Button>
          <Button
            className="publish-button"
            onClick={() => cancelSubscription()}
            style={{ width: '50%' }}
          >
            Yes
          </Button>
        </div>
      </div>
    );
  }
}
