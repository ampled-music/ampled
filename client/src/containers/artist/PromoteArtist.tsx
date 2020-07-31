import './artist.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CreateArtist } from '../create-artist/CreateArtist';
import { getArtistAction } from '../../redux/artists/get-details';
import { Store } from '../../redux/configure-store';

import { ArtistModel } from '../../redux/artists/initial-state';

class PromoteArtist extends React.Component<any> {
  componentDidMount() {
    this.props.getArtist(null, this.props.match.params.slug);
  }

  render() {
    const {
      promote_facebook_image,
      promote_square_images,
      promote_story_images,
    } = this.props.artists.artist;

    console.log(promote_square_images);

    return (
      <div className="artist-promote container">
        <h1>Facebook</h1>
        <div className="row">
          <div className="col-md-8">
            {promote_facebook_image && <img src={promote_facebook_image} />}
          </div>
        </div>
        <h1>Instragam Post</h1>
        <div className="row">
          {promote_square_images &&
            promote_square_images.map((image) => (
              <div className="col-md-4">
                <img src={image.url} />
              </div>
            ))}
        </div>
        <h1>Instagram Story</h1>
        <div className="row">
          {promote_story_images &&
            promote_story_images.map((image) => (
              <div className="col-md-4">
                <img src={image.url} />
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
