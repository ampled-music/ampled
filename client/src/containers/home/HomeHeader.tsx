import * as React from 'react';

import { config } from '../../config';
import header_collage from '../../images/home/home_header_collage_5.png';

class HomeHeader extends React.Component<any, any> {
  state = {
    showNewsletter: false,
  };

  toggleNewsletter = () => {
    this.setState({ showNewsletter: !this.state.showNewsletter });
  };

  render() {
    return (
      <div
        className="home-header container-fluid"
        style={{ backgroundColor: this.props.bgColor }}
      >
        <div className="row align-items-center justify-content-xl-center">
          <div className="col-lg-4 col-xl-3">
            <div className="home-header__support">
              Own your creative freedom
            </div>
            <div className="home-header__info">
              Direct support for all musicians. Collectively owned, community
              supported.
            </div>
            <a
              className="home-header__button btn btn-ampled"
              href={config.menuUrls.createArtist}
            >
              Create Your Page
            </a>
            {this.state.showNewsletter ? (
              <div
                className="email input-group mb-3"
                style={{
                  zIndex: 999999,
                  borderTop: 'unset',
                  paddingTop: 0,
                }}
              >
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
            ) : (
              <div className="home-header__cta" onClick={this.toggleNewsletter}>
                <div>
                  <button className="link home-header__cta_link">
                    Join our mailing list
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="col-lg-8 col-xl-6">
            <img
              className="home-header__image"
              src={header_collage}
              alt="Ampled"
            />
          </div>
        </div>
      </div>
    );
  }
}

export { HomeHeader };
