import * as React from 'react';

class ProgressBar extends React.Component<any, any> {
  constructor(props) {
    super(props);

    // this.onComplete = props.onComplete;
  }

  render() {
    return (
      <div className={'progress'}>
        <div
          className={'progress-bar progress-bar-striped'}
          role="progressbar"
          style={{ width: `${this.props.now}%` }}
          aria-valuenow={this.props.now}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    );
  }
}

export { ProgressBar };
