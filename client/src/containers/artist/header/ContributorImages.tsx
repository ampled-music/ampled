import './artist-header.scss';

import * as React from 'react';

import AwesomeSlider from 'react-awesome-slider';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import 'react-awesome-slider/dist/styles.css';

import tear from '../../../images/full_page_tear.png';

import Amanda from '../../../images/contributors/Amanda.png';
import Ana from '../../../images/contributors/Ana.png';
import Ari from '../../../images/contributors/Ari.png';
import Austin from '../../../images/contributors/Austin.png';
import Blair from '../../../images/contributors/Blair.png';
import Brad from '../../../images/contributors/Brad.png';
import Collin from '../../../images/contributors/Collin.png';
import Dash from '../../../images/contributors/Dash.png';
import Derek from '../../../images/contributors/Derek.png';
import EmmaC from '../../../images/contributors/EmmaC.png';
import EmmaE from '../../../images/contributors/EmmaE.png';
import Jeremy from '../../../images/contributors/Jeremy.png';
import Josh from '../../../images/contributors/Josh.png';
import Maura from '../../../images/contributors/Maura.png';
import Molly from '../../../images/contributors/Molly.png';
import Rene from '../../../images/contributors/Rene.png';
import Ryan from '../../../images/contributors/Ryan.png';
import RyanQ from '../../../images/contributors/RyanQ.png';
import Sean from '../../../images/contributors/Sean.png';
import Weston from '../../../images/contributors/Weston.png';

interface Props {
  artist: any;
  loggedUserAccess: { role: string; artistId: number };
  isSupporter: boolean;
  handleSupportClick: Function;
  imageWidth: number;
  imageHeight: number;
}

export class ContributorImages extends React.Component<Props, any> {
  shuffle = (array) => {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  renderBanners = () => {
    const contributors = this.shuffle([
      Amanda,
      Ana,
      Ari,
      Austin,
      Blair,
      Brad,
      Collin,
      Dash,
      Derek,
      EmmaC,
      EmmaE,
      Jeremy,
      Josh,
      Maura,
      Molly,
      Rene,
      Ryan,
      RyanQ,
      Sean,
      Weston,
    ]);

    var perChunk = window.screen.width <= 768 ? 3 : 5; // items per chunk
    var chunkContributors = contributors.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(index / perChunk);
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []; // start a new chunk
      }
      resultArray[chunkIndex].push(item);
      return resultArray;
    }, []);

    const AutoplaySlider = withAutoplay(AwesomeSlider);
    return (
      <div className="artist-header__contributors">
        <img className="artist-header__contributors_tear" src={tear} alt="" />
        <AutoplaySlider
          play={true}
          cancelOnInteraction={false} // should stop playing on user interaction
          interval={6000}
        >
          {chunkContributors &&
            chunkContributors.map((images, index) => {
              return (
                <div key={`contributor_slide-${index}`}>
                  {images &&
                    images.map((image, index) => {
                      return (
                        <img
                          src={image}
                          key={`contributor-${index}`}
                          className="artist-header__contributors_image"
                          alt={`contributor-${index}`}
                        />
                      );
                    })}
                </div>
              );
            })}
        </AutoplaySlider>
      </div>
    );
  };

  render() {
    return this.renderBanners();
  }
}
