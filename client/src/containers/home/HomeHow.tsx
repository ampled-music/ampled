import * as React from 'react';

import speaker from '../../images/home/home_how_speaker.png';
import crowd from '../../images/home/home_how_crowd.png';
import money from '../../images/home/home_how_money.png';
import tear_1 from '../../images/home/home_tear_1.png';
import tear_2 from '../../images/home/home_tear_2.png';


interface Props {
  bgColor: string;
}

class HomeHowComponent extends React.Component<Props, any> {

  state = {
    showSpeaker: true,
    showCrowd: false,
    showMoney: false,
    intervalId: undefined,
  };

  theLoop = (activeState) => {
    const self = this;
    const intervalId = setInterval(function () {
      if (activeState == 'section_1') {
        self.openSpeaker();
        activeState = 'section_2';
      } else if (activeState == 'section_2') {
        self.openCrowd();
        activeState = 'section_3';
      } else if (activeState == 'section_3') {
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
      showCrowd: false
    });
  };
  openMoney = () => {
    this.setState({
      showMoney: true,
      showSpeaker: false,
      showCrowd: false
    });
  };
  openCrowd = () => {
    this.setState({
      showCrowd: true,
      showMoney: false,
      showSpeaker: false
    });
  };

  setActive = (graphic) => {
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
        <img className="tear tear_1" src={tear_1} alt=""/>

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
                  <div className="home-how__title">Artists post unique / unreleased content</div>
                  <div className="home-how__copy">
                    Demos, unreleased material, exclusive merch, announcements - and more.
                  </div>
                </div>
              </div>
              <div className="section section_2">
                <div className={this.setActive(this.state.showCrowd)}>
                  <div className="home-how__title">Artists are directly supported by their community</div>
                  <div className="home-how__copy">
                    No tiers and one egalitarian price: $3 per month (or support what you want beyond that)
                  </div>
                </div>
              </div>
              <div className="section section_3">
                <div className={this.setActive(this.state.showMoney)}>
                  <div className="home-how__title">Artists receive predictable and recurring payments</div>
                  <div className="home-how__copy">
                    When an artist posts something new, their supporters receive a notification.
                  </div>
                </div>
              </div>
            </div>

            <div className="home-how__images">
              <div className="section section_1">
                <div className={this.setActive(this.state.showSpeaker)}>
                  <img className="home-how__image speaker" src={speaker} alt="Artists post unique / unreleased content"/>
                </div>
              </div>
              <div className="section section_2">
                <div className={this.setActive(this.state.showCrowd)}>
                  <img className="home-how__image crowd" src={crowd} alt="Artists are directly supported by their community"/>
                </div>
              </div>
              <div className="section section_3">
                <div className={this.setActive(this.state.showMoney)}>
                  <img className="home-how__image money" src={money} alt="Artists receive predictable and recurring payments"/>
                </div>
              </div>
            </div>


          </div>
        </div>
        <img className="tear tear_2" src={tear_2} style={{ backgroundColor: this.props.bgColor }} alt=""/>
      </div>
    )
  }

}

const HomeHow = HomeHowComponent;

export { HomeHow };