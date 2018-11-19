import React from "react";
import "./Counter.scss";

export default class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  increment = () => {
    this.setState(state => ({ ...state, count: state.count + 1 }));
  };

  render() {
    return (
      <div className="Counter">
        An example stateful component.
        <button className="Counter__button" onClick={this.increment}>
          {this.state.count}
        </button>
      </div>
    );
  }
}
