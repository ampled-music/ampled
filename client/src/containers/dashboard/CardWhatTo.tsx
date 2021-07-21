import * as React from 'react';
import { Card, CardContent } from '@material-ui/core';

import TextIcon from '../../images/icons/Icon_Text.svg';
import AudioIcon from '../../images/icons/Icon_Audio.svg';
import PhotoIcon from '../../images/icons/Icon_Photo.svg';
import VideoIcon from '../../images/icons/Icon_Video.svg';

export const CardWhatTo = () => {

  return (
    <Card>
      <CardContent>
        <div className="dashboard__home_card_title">Not Sure What To Post</div>
        <div className="row justify-content-around dashboard__home_card_whatto">
          <div className="col-12 col-sm-5 dashboard__home_card_whatto_content">
            <div className="dashboard__home_card_whatto_icon">
              <img src={AudioIcon} className="" alt="Audio Icon" />
            </div>
            <div className="dashboard__home_card_whatto_info">
              <h5>Audio posts</h5>
              <h6><strong>(format: MP3)</strong></h6>
              <ul>
                <li>Unreleased material</li>
                <li>Demos or alternate takes</li>
                <li>Works in progress</li>
                <li>Isolated tracks or stems</li>
                <li>Recordings from a side project</li>
                <li>Recordings of a rehearsal</li>
                <li>Live recordings</li>
              </ul>
            </div>
          </div>

          <div className="col-12 col-sm-5 dashboard__home_card_whatto_content">
            <div className="dashboard__home_card_whatto_icon">
              <img src={TextIcon} className="" alt="Text Icon" />
            </div>
            <div className="dashboard__home_card_whatto_info">
              <h5>Text posts</h5>
              <ul>
                <li>Song lyrics</li>
                <li>Song meanings</li>
                <li>New release announcements</li>
                <li>Tour diaries</li>
                <li>Essays</li>
                <li>Poetry or any other kind of personal writing</li>
                <li>Recording updates</li>
                <li>Gear reviews</li>
              </ul>
            </div>
          </div>

          <div className="col-12 col-sm-5 dashboard__home_card_whatto_content">
            <div className="dashboard__home_card_whatto_icon">
              <img src={PhotoIcon} className="" alt="Image Icon" />
            </div>
            <div className="dashboard__home_card_whatto_info">
              <h5>Image posts</h5>
              <ul>
                <li>Visual artwork</li>
                <li>Snapshots from tour</li>
                <li>Alternate album covers</li>
                <li>Photos from live performances</li>
              </ul>
            </div>
          </div>

          <div className="col-12 col-sm-5 dashboard__home_card_whatto_content">
            <div className="dashboard__home_card_whatto_icon">
              <img src={VideoIcon} className="" alt="Video Icon" />
            </div>
            <div className="dashboard__home_card_whatto_info">
              <h5>Video posts</h5>
              <h6><strong>(format: YouTube or Vimeo URL)</strong></h6>
              <ul>
                <li>Live performances</li>
                <li>Video messages</li>
                <li>Music videos</li>
                <li>Tour documentaries</li>
                <li>Songs by other artists that you love</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardWhatTo;
