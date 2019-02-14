import * as React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../images/ampled_logo.svg';

import './footer.scss';

interface Props {
}

interface State {
}

class Footer extends React.Component<Props, State> {
  
  render() {
    const { } = this.props;

    return (
      <header className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="title">Join Our Mailing List</div>
              <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="Email Address" aria-label="" aria-describedby="" />
                <div className="input-group-append">
                  <button className="btn btn-outline-secondary" type="button" id="button-addon">Subscribe</button>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="title">Get Started</div>
              <a href="#">Create An Artist Page</a>
              <a href="#">Our Mission</a>
              <a href="#">Who We Are</a>
              <a href="#">Learn More About Us</a>
            </div>
            <div className="col-md-2">
              <div className="title">Get Involved</div>
              <a href="#">Jobs</a>
              <a href="#">Press</a>
            </div>
            <div className="col-md-2">
              <div className="title">Get Informed</div>
              <a href="#">Transparency Dash</a>
              <a href="#">Artist Ownership</a>
              <a href="#">Terms of Use</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Contact</a>
            </div>
            <div className="col-md-2">
              <Link to="/">
                <img src={logo} alt="logo" className="logo" />
              </Link>
              <div className="copyright">©2018 Ampled</div>
            </div>
          </div>
        </div>        
      </header>
    );
  }
}

export { Footer };
