import * as React from 'react';

import speaker from '../../images/home/home_how_speaker.png';
import crowd from '../../images/home/home_how_crowd.png';
import money from '../../images/home/home_how_money.png';
import tear_1 from '../../images/home/home_tear_1.png';

class HomeHowComponent extends React.Component<any, any> {
  state = {
    showSpeaker: true,
    showCrowd: false,
    showMoney: false,
    intervalId: undefined,
  };

  theLoop = (activeState: string) => {
    const self = this;
    const intervalId = setInterval(function() {
      if (activeState === 'section_1') {
        self.openSpeaker();
        activeState = 'section_2';
      } else if (activeState === 'section_2') {
        self.openCrowd();
        activeState = 'section_3';
      } else if (activeState === 'section_3') {
        self.openMoney();
        activeState = 'section_1';
      }
    }, 4000);

    this.setState({ intervalId });
  };

  openSpeaker = () => {
    this.setState({
      showSpeaker: true,
      showMoney: false,
      showCrowd: false,
    });
  };
  openMoney = () => {
    this.setState({
      showMoney: true,
      showSpeaker: false,
      showCrowd: false,
    });
  };
  openCrowd = () => {
    this.setState({
      showCrowd: true,
      showMoney: false,
      showSpeaker: false,
    });
  };

  setActive = (graphic: any) => {
    if (graphic) {
      return 'active';
    }
  };

  componentDidMount() {
    this.theLoop('section_1');
  }

  componentWillUnmount() {
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
    }
  }

  render() {
    return (
      <div className="home-how">
        <img className="tear tear_1" src={tear_1} alt="" />

        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1>How it Works</h1>
            </div>
          </div>

          <div className="home-how__list">
            <div className="home-how__numbers">
              <div className="section section_1">
                <div className={this.setActive(this.state.showSpeaker)}>
                  <div className="home-how__number">01</div>
                </div>
              </div>
              <div className="section section_2">
                <div className={this.setActive(this.state.showCrowd)}>
                  <div className="home-how__number">02</div>
                </div>
              </div>
              <div className="section section_3">
                <div className={this.setActive(this.state.showMoney)}>
                  <div className="home-how__number no-tail">03</div>
                </div>
              </div>
            </div>

            <div className="home-how__info">
              <div className="section section_1">
                <div className={this.setActive(this.state.showSpeaker)}>
                  <div className="home-how__title">
                    Create a page on ampled and post unique or unreleased
                    content
                  </div>
                  <div className="home-how__copy">
                    Free for artists to join. Fans subscribe directly to a
                    particular artist, not the platform.
                  </div>
                </div>
              </div>
              <div className="section section_2">
                <div className={this.setActive(this.state.showCrowd)}>
                  <div className="home-how__title">
                    Artists are supported directly by their audience
                  </div>
                  <div className="home-how__copy">
                    May also choose to be a 2X or even 10x supporter. Minimum
                    monthly support per fan is $3. An audience member
                  </div>
                </div>
              </div>
              <div className="section section_3">
                <div className={this.setActive(this.state.showMoney)}>
                  <div className="home-how__title">
                    Artists collect monthly recurring revenue
                  </div>
                  <div className="home-how__copy">
                    Supporters get a notification when an artist they support
                    posts something new.
                  </div>
                </div>
              </div>
            </div>

            <div className="home-how__images">
              <div className="section section_1">
                <div className={this.setActive(this.state.showSpeaker)}>
                  <img
                    className="home-how__image speaker"
                    src={speaker}
                    alt="Artists post unique / unreleased content"
                  />
                </div>
              </div>
              <div className="section section_2">
                <div className={this.setActive(this.state.showCrowd)}>
                  <img
                    className="home-how__image crowd"
                    src={crowd}
                    alt="Artists are directly supported by their community"
                  />
                </div>
              </div>
              <div className="section section_3">
                <div className={this.setActive(this.state.showMoney)}>
                  <img
                    className="home-how__image money"
                    src={money}
                    alt="Artists receive predictable and recurring payments"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const HomeHow = HomeHowComponent;

export { HomeHow };
