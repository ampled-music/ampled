import './footer.scss';

import * as React from 'react';
import { Link } from 'react-router-dom';
import { config } from '../../../config';

import logo from '../../../images/ampled_coop_logo.svg';
import fist from '../../../images/icons/Icon_Fist.svg';

interface Props {
  match: {
    params: {
      id: string;
      slug: string;
    };
    path: string;
  };
}

class Footer extends React.Component<Props, any> {
  render() {
    if (
      this.props.match.path.indexOf('/create-artist') === 0 ||
      this.props.match.path.indexOf('/support/:id') === 0
    ) {
      return false;
    } else {
      return (
        <footer id="footer">
          <div className="footer">
            <div className="footer__top container">
              <div className="footer__top_left">
                <div className="footer__info">
                  <div className="title">The Co-Op</div>
                  <a href="/page/about-us">About us</a>
                  <a href="/page/about-us">Who are we</a>
                  <a href="/page/about-us">How it works</a>
                  <a href="/page/open-dashboard">Transparency</a>
                  <a href="/page/faq">FAQs</a>
                </div>
                <div className="footer__info">
                  <div className="title">Get Involved</div>
                  <a href={config.menuUrls.createArtist}>Create Artist Page</a>
                  <a href="/page/join-the-co-op">Ways to join</a>
                  <a href="/page/become-a-contributor">Become a worker</a>
                  <a href="/page/become-a-contributor">How to help</a>
                  <a href="/page/press">Press</a>
                </div>
                <div className="footer__info">
                  <div className="title">Get Connected</div>
                  <a href="/page/contact">Contact us</a>
                  <a href="/blog/">Events</a>
                  <a href="/blog/">Blog</a>
                  <a
                    href="https://www.instagram.com/ampl3d"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://twitter.com/ampl3d"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter
                  </a>
                </div>
              </div>
              <div className="footer__top_right">
                <div className="footer__top_right_logo-btn">
                  <img src={logo} className="coop-logo" alt="Ampled Co-Op" />
                  <button className="btn btn-join-ampled">
                    Join the Ampled community!
                  </button>
                </div>
              </div>
            </div>

            <div className="footer__bottom">
              <div className="container footer__bottom_flex">
                <div className="footer__bottom_left">
                  <div className="title">Subscribe to our mailing list</div>
                  <div className="email input-group">
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
                          className="btn"
                        />
                      </div>
                    </form>
                  </div>
                </div>

                <div className="footer__bottom_right">
                  <div className="own-it">
                    We Own It! <img src={fist} alt="Solidarity Fist" />
                  </div>
                  <div className="footer__bottom_right_links">
                    <div className="copyright">
                      ©{new Date().getFullYear()} Ampled
                    </div>
                    <a href="https://docs.ampled.com/policy/terms-of-use">
                      Terms of Use
                    </a>
                    <a href="https://docs.ampled.com/policy/">Privacy Policy</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      );
    }
  }
}

export { Footer };
