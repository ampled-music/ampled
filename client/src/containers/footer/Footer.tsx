import './footer.scss';

import * as React from 'react';
import { Link } from 'react-router-dom';
import { config } from '../../config';

import logo from '../../images/ampled_logo.svg';

interface Props {}

class Footer extends React.Component<Props, any> {
  render() {
    return (
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-4">
              <div className="title">Join Our Mailing List</div>
              <div className="email input-group mb-3">
                <form
                  action="https://ampled.us19.list-manage.com/subscribe/post?u=514372f571f3cb5abdf8a2637&amp;id=50f2ab4389"
                  method="post"
                >
                  <input
                    className="form-control"
                    type="email"
                    name="EMAIL"
                    aria-label="Email Address"
                    placeholder="Email Address"
                  />
                  <div className="input-group-append">
                    <input
                      type="submit"
                      value="Gimme &rarr;"
                      name="subscribe"
                      id="mc-embedded-subscribe"
                      className="btn btn__dark"
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="col-6 col-md-2">
              <div className="title">Get Started</div>
              <a href="https://ampled.com/page/about-us">About Us</a>
              <a href="https://ampled.com/zine/">Blog</a>
              <a href="https://docs.ampled.com/coop/">The Co-Op</a>
              <a href="https://ampled.com/page/contact">Contact</a>
            </div>
            <div className="col-6 col-md-2">
              <div className="title">Get Involved</div>
              <a href={config.menuUrls.createArtist}>Create Artist Page</a>
              <a href="https://ampled.com/page/join-the-co-op">
                Become a Member
              </a>
              <a href="https://ampled.com/page/become-a-contributor">Jobs</a>
              <a href="https://ampled.com/page/press">Press</a>
            </div>
            <div className="col-6 col-md-2">
              <div className="title">Get Informed</div>
              <a href="https://ampled.com/open-dashboard">Transparency</a>
              <a href="https://ampled.com/page/faq">FAQs</a>
              <a href="https://docs.ampled.com/policy/terms-of-use">
                Terms of Use
              </a>
              <a href="https://docs.ampled.com/policy/">Policy</a>
            </div>
            <div className="col-6 col-md-2">
              <Link to="/">
                <img src={logo} alt="logo" className="logo" />
              </Link>
              <div className="copyright">
                ©{new Date().getFullYear()} Ampled
              </div>
              <div className="own-it">
                We Own It!{' '}
                <span role="img" aria-label="Solidarity">
                  ✊
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export { Footer };
