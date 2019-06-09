import * as React from 'react';

import speaker from '../../images/home/home_how_speaker.png';
import crowd from '../../images/home/home_how_crowd.png';
import money from '../../images/home/home_how_money.png';
import tear_1 from '../../images/home/home_tear_1.png';
import tear_2 from '../../images/home/home_tear_2.png';


interface Props {
  bgColor: string;
}

class HomeHowComponent extends React.Component<Props,any> {

  state = {
    showSpeaker: false,
    showMoney: false,
    showCrowd: false,
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

  showGraphic = (graphic) => {
    if (graphic) {
      return 'show';
    }
  };

  render() {
    return (
        <div className="home-how">
        <img className="tear tear_1" src={tear_1} />
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="home-how__title">How it Works</h1>
            </div>
          </div>
    
          <div className="home-how__list">
            <div className="row home-how__list-item speaker" onClick={this.openSpeaker}>
              <div className="col-1">
                <div className="home-how__list-item_number">01</div>
              </div>
              <div className="col-md-6">
                <div className="home-how__list-item_title">
                  Artists post unique/ unreleased content.
                </div>
                <div className="home-how__list-item_copy">
                  Artists on Ampled post things you won’t find anywhere else - like demos, unreleased recordings, access to exclusive merch, discounts, personal notes, announcements - and more.
                </div>
              </div>
              <div className="home-how__list-item_image speaker">
                <img className={this.showGraphic(this.state.showSpeaker)} src={speaker} />
              </div>
            </div>
            <div className="row home-how__list-item crowd" onClick={this.openMoney}>
              <div className="col-1">
                <div className="home-how__list-item_number">02</div>
              </div>
              <div className="col-md-6">
                <div className="home-how__list-item_title">Artists are supported directly by their community</div>
                <div className="home-how__list-item_copy">
                  Artists can be supported directly for $3 or more per month - unlocking access to their exclusive content.
                </div>
              </div>
              <div className="home-how__list-item_image crowd">
                <img className={this.showGraphic(this.state.showCrowd)} src={crowd} />
              </div>
            </div>
            <div className="row home-how__list-item money" onClick={this.openCrowd}>
              <div className="col-1">
                <div className="home-how__list-item_number no-tail">03</div>
              </div>
              <div className="col-md-6">
                <div className="home-how__list-item_title">Artists collect monthly recurring revenue</div>
                <div className="home-how__list-item_copy">
                  When an artist posts something new, their supporters get a notification. 
                </div>
                <div className="home-how__list-item_image money">
                  <img className={this.showGraphic(this.state.showMoney)} src={money} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <img className="tear tear_2" src={tear_2} style={{ backgroundColor: this.props.bgColor }} />
      </div>
    )
  }

}

const HomeHow = HomeHowComponent;

export { HomeHow };