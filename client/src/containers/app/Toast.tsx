import * as React from 'react';

class Toast extends React.Component<any> {
  state = {
    timerId: null,
  };
  componentDidMount() {
    const timerId = window.setTimeout(
      () => this.props.toast.visible && this.props.hideToast(),
      5000,
    );
    this.setState({
      timerId,
    });
  }

  resetTimer = () => {
    window.clearTimeout(this.state.timerId);
  };

  render() {
    const { toast, hideToast } = this.props;
    return (
      <div id="toast-container" className="toast-top-full-width">
        <div className={`toast toast-${toast.type}`}>
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
