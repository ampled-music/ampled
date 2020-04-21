import './no-artist.scss';

import * as React from 'react';
import { ArtistModel } from '../../../redux/artists/initial-state';

interface Props {
  artist: ArtistModel;
}

class ArtistComingSoon extends React.Component<Props, any> {
  handlePublicID = (image: string) => {
    const url = image.split('/');
    const part_1 = url[url.length - 2];
    const part_2 = url[url.length - 1];
    return part_1 + '/' + part_2;
  };

  render() {
    const artist = this.props.artist;
    return (
      <div className="no-artist">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-md-6 d-flex flex-column">
              <div className="no-artist__artist-title">
                <span
                  className="no-artist__artist-title_flair"
                  style={{ backgroundColor: artist.accent_color }}
                ></span>
                {artist.name}
              </div>
              <img
                // src={this.handlePublicID(first_image)}
                className="no-artist__image"
                alt={artist.name}
              />
              <p>Coming Soon.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { ArtistComingSoon };
