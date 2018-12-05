import React from "react";
import logo from '../ampled_logo.svg';

export default class Nav extends React.Component {
  render() {
    return (
        <header className="header">
            <img src={logo} alt="logo" className="logo" />
        </header>
    );
  }
}
