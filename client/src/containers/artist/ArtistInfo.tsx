import * as React from 'react';

class ArtistInfo extends React.Component<any, any> {
  render() {
    return (
      <div className="artist-info container">
        <div className="row justify-content-between">
          <div className="col-md-4">
            <div className="artist-info__location">
              <i className="fas fa-map-marker-alt" /> {this.props.location}
            </div>
          </div>
          <div className="col-md-5">
            <div className="artist-info__social">
              <div className="artist-info__social_twitter">
                <i className="fab fa-twitter" />{' '}
                <a href="https://twitter.com/nineinchnails" target="_blank">
                  @nin
                </a>
              </div>
              <div className="artist-info__social_instagram">
                <i className="fab fa-instagram" />{' '}
                <a href="https://instagram.com/nineinchnails" target="_blank">
                  #nineinchnails
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
