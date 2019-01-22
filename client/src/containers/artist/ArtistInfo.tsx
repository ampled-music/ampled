import * as React from 'react';

interface Props {
  location: string;
  twitterHandle: string;
  instagramHandle: string;
}

class ArtistInfo extends React.Component<Props, any> {
  
  render() {

    const { location, twitterHandle, instagramHandle } = this.props;

    return (
      <div className="artist-info container">
        <div className="row justify-content-between">
          <div className="col-md-4">
            <div className="artist-info__location">
              <i className="fas fa-map-marker-alt" /> {location}
            </div>
          </div>
          <div className="col-md-5">
            <div className="artist-info__social">
              <div className="artist-info__social_twitter">
                <i className="fab fa-twitter" />{' '}
                <a href="https://twitter.com/{twitterHandle}" target="_blank">
                  @{twitterHandle}
                </a>
              </div>
              <div className="artist-info__social_instagram">
                <i className="fab fa-instagram" />{' '}
                <a href="https://instagram.com/{instagramHandle}" target="_blank">
                  #{instagramHandle}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { ArtistInfo };
