import './artist.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getArtistAction } from '../../redux/artists/get-details';
import { Store } from '../../redux/configure-store';

class PromoteArtist extends React.Component<any> {
  componentDidMount() {
    this.props.getArtist(null, this.props.match.params.slug);
  }

  render() {
    const {
      promote_facebook_image,
      promote_square_images,
      promote_story_images,
      supporter_images,
      name,
    } = this.props.artists.artist;

    console.log(this.props.artists.artist);

    return (
      <div className="artist-promote container">
        <h1>Promote {name}</h1>
        <p>
          Use these images to promote your page. Remember to tag{' '}
          <a href="https://www.instagram.com/ampl3d/" target="_blank">
            @ampl3d
          </a>{' '}
          so we can repost.
        </p>
        <h2>Banner</h2>
        <div className="row">
          <div className="col-md-8">
            {promote_facebook_image && (
              <a download href={promote_facebook_image}>
                <img src={promote_facebook_image} />
              </a>
            )}
          </div>
        </div>
        <h2>Instragam Post</h2>
        <div className="row">
          {promote_square_images &&
            promote_square_images.map((image) => (
              <div className="col-md-4">
                <a download={image.name} href={image.url} title={image.name}>
                  <img src={image.url} />
                </a>
              </div>
            ))}
        </div>
        <h2>Instagram Story</h2>
        <div className="row">
          {promote_story_images &&
            promote_story_images.map((image) => (
              <div className="col-md-4">
                <a download={image.name} href={image.url} title={image.name}>
                  <img src={image.url} />
                </a>
              </div>
            ))}
        </div>
        <h2>Supporter</h2>
        <div className="row">
          {supporter_images &&
            supporter_images.map((image) => (
              <div className="col-md-4">
                <a download={image.name} href={image.url} title={image.name}>
                  <img src={image.url} />
                </a>
              </div>
            ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: Store) => {
  return {
    artists: state.artists,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getArtist: bindActionCreators(getArtistAction, dispatch),
  };
};

const Promote = connect(mapStateToProps, mapDispatchToProps)(PromoteArtist);

export { Promote };
