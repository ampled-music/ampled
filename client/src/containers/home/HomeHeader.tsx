import * as React from 'react';

import { config } from 'src/config';
import header_collage from '../../images/home/home_header_collage_4.png';

const openInNewTab = (url: string) => {
  var win = window.open(url, '_blank');
  win.focus();
};

interface Props {
  bgColor: string;
}

class HomeHeader extends React.Component<Props, any> {
  state = {
    showNewsletter: false,
  };

  toggleNewsletter = () => {
    this.setState({ showNewsletter: !this.state.showNewsletter });
  };

  render() {
    return (
      <div className="home-header container-fluid" style={{ backgroundColor: this.props.bgColor }}>
        <div className="row align-items-center justify-content-xl-center">
          <div className="col-lg-4 col-xl-3">
            <div className="home-header__support">Own your creative freedom</div>
            <div className="home-header__info">
              For artists of any sound or size. Receive support via direct payments from your community and sustainably
              make music.
            </div>
            <button
              className="home-header__button btn btn-ampled"
              onClick={() => openInNewTab(config.menuUrls.createArtist)}
            >
              Create Your Page
            </button>
            {this.state.showNewsletter ? (
              <div className="footer input-group mb-3" style={{
                zIndex: 999999,
                borderTop: 'unset',
                padding: 0
              }}>
                <form
                  action="https://ampled.us19.list-manage.com/subscribe/post?u=514372f571f3cb5abdf8a2637&amp;id=50f2ab4389"
                  method="post"
                >
                  <input className="form-control" type="email" name="EMAIL" placeholder="Email Address" />
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
              <a href="#" onClick={this.toggleNewsletter} className="home-header__link">
                Stay Updated on our Journey
              </a>
            )}
          </div>
          <div className="col-lg-8 col-xl-6">
            <img className="home-header__image" src={header_collage} />
          </div>
        </div>
      </div>
    );
  }
}

export { HomeHeader };
