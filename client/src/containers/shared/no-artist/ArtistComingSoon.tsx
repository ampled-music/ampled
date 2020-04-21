import './no-artist.scss';

import * as React from 'react';

class ArtistComingSoon extends React.Component<any> {
  render() {
    return (
      <div className="no-artist">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="no-artist__title">Artist not found</div>
              {/* <img
                src={randomImage}
                className="no-artist__image"
                alt="Artist not found"
              /> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { ArtistComingSoon };
