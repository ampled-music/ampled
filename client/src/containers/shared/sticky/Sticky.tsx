// import './sticky.scss';

import * as React from 'react';

class Sticky extends React.Component<any> {
  render() {
    return (
      <div className="artistAlertHeader active">{this.props.children}</div>
    );
  }
}

export { Sticky };
