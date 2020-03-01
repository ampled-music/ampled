import * as React from 'react';

class Toast extends React.Component<any> {
  state = {
    timerId: null,
    fading: false,
  };

  componentDidMount() {
    this.setTimer();
  }

  fade = () => {
    if (!this.props.toast.visible) {
      return;
    } else {
      const timerId = window.setTimeout(this.hideToast, 1000);
      this.setState({
        timerId,
        fading: true,
      });
    }
  };

  hideToast = () => {
    this.props.toast.visible && this.props.hideToast();
  };

  setTimer = () => {
    const timerId = window.setTimeout(this.fade, 4000);
    this.setState({
      timerId,
    });
  };

  clearTimer = () => {
    window.clearTimeout(this.state.timerId);
    this.setState({
      timerId: null,
      fading: false,
    });
  };

  render() {
    const { toast, hideToast } = this.props;
    const { fading } = this.state;
    return (
      <div id="toast-container" className="toast-top-full-width">
        <div
          className={`toast toast-${toast.type} ${fading ? 'fading' : ''}`}
          onMouseOver={this.clearTimer}
          onMouseOut={this.setTimer}
        >
          <button
            type="button"
            className="toast-close-button"
            role="button"
            onClick={hideToast}
          >
            ×
          </button>
          <div className="toast-message">{toast.message}</div>
        </div>
      </div>
    );
  }
}

export default Toast;
