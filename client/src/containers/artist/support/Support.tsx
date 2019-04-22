import './support.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getArtistAction } from 'src/redux/artists/get-details';
import { Store } from 'src/redux/configure-store';

import { openAuthModalAction } from 'src/redux/authentication/authentication-modal';
import { initialState as artistsInitialState } from '../../../redux/artists/initial-state';
import { initialState as authenticateInitialState } from '../../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../../redux/me/initial-state';

interface ArtistProps {
  match: {
    params: {
      id: string;
    };
  };
  artists: typeof artistsInitialState;
  me: typeof meInitialState;
  authentication: typeof authenticateInitialState;
}

type Dispatchers = ReturnType<typeof mapDispatchToProps>;
type Props = Dispatchers & ArtistProps;

export class SupportComponent extends React.Component<Props, any> {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.getArtistInfo();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.me.userData && this.props.me.userData) {
      this.getArtistInfo();
    }
  }

  getArtistInfo = () => {
    this.props.getArtist(this.props.match.params.id);
  };

  handleSupportClick = () => {
    if (!this.props.me.userData) {
      this.props.openAuthModal({ modalPage: 'signup' });
    }
  };

  renderSupportHeader = (artistName) => (
    <div className="support-header">
      Support
      <h2>{artistName}</h2>
    </div>
  );

  renderArtistImage = () => (
    <img
      className="support-artist-image"
      src="https://images.pexels.com/photos/1749822/pexels-photo-1749822.jpeg?cs=srgb&dl=backlit-band-concert-1749822.jpg"
    />
  );

  renderArtists = (owners) => (
    <div className="support-artists">
      {owners.map((owner) => (
        <div className="support-artist-info">
          <img src={owner.profile_image_url} />
          <p>{owner.name}</p>
        </div>
      ))}
    </div>
  );

  renderSupportLevelForm = (artistName) => (
    <div className="support-level-form">
      <h3>ENTER YOUR SUPPORT LEVEL</h3>
      <div className="support-value-field">
        <p>$</p>
        <input type="number" name="support-level" placeholder="6.37" />
        <p className="month-text">/Month</p>
      </div>
      <p className="support-value-description">
        $6.37 is the average monthly support amount for {artistName}, but whatever your support level; the band
        certainly appreciates it. However, the minimum is $3 to cover the costs and keep the lights on at Ampled.
      </p>
    </div>
  );

  renderSupportAction = (artistName) => {
    const buttonLabel = this.props.me.userData ? `SUPPORT ${artistName.toUpperCase()}` : 'SIGNUP OR LOGIN TO SUPPORT';

    return (
      <div className="support-action">
        <button onClick={this.handleSupportClick}>{buttonLabel}</button>
      </div>
    );
  };

  render() {
    const artist = this.props.artists.artist;

    if (!Object.keys(artist).length) {
      return null;
    }

    const artistName = artist.name;

    return (
      <div className="support-container">
        {this.renderSupportHeader(artistName)}
        <div className="stripe" />
        <div className="support-content">
          {this.renderArtistImage()}
          <div className="support-central-area">
            {this.renderArtists(artist.owners)}
            {this.renderSupportLevelForm(artistName)}
          </div>
        </div>
        {this.renderSupportAction(artistName)}
      </div>
    );
  }
}

const mapStateToProps = (state: Store) => {
  return {
    artists: state.artists,
    me: state.me,
    authentication: state.authentication,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getArtist: bindActionCreators(getArtistAction, dispatch),
    openAuthModal: bindActionCreators(openAuthModalAction, dispatch),
  };
};

const Support = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SupportComponent);

export { Support };
