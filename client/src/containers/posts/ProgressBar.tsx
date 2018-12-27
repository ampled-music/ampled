import * as React from 'react';

interface ProgressBarProps {
  now: number;
}

class ProgressBar extends React.Component<ProgressBarProps, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const { now } = this.props;

    return (
      <div className={'progress'}>
        <div
          className={'progress-bar progress-bar-striped'}
          role="progressbar"
          style={{ width: `${now}%` }}
          aria-valuenow={now}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    );
  }
}

export { ProgressBar };
