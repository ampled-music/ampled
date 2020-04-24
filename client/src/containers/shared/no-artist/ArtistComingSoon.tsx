import './no-artist.scss';

import * as React from 'react';
import { Image, Transformation } from 'cloudinary-react';

interface Props {
  artist: any;
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
    console.log(artist);

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

              <div className="no-artist__container">
                <div
                  className="no-artist__container_border"
                  style={{ borderColor: artist.accent_color }}
                ></div>
                {artist.image && (
                  <Image
                    className="no-artist__image"
                    key={artist.name}
                    publicId={this.handlePublicID(artist.image)}
                    alt={artist.name}
                  >
                    <Transformation
                      crop="fill"
                      width={450}
                      height={450}
                      responsive_placeholder="blank"
                    />
                  </Image>
                )}
              </div>
              <p>
                Page under construction.
                <br />
                If this page belongs to you, log in to manage.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { ArtistComingSoon };
