import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CreateArtist } from '../create-artist/CreateArtist';
import { getArtistAction } from '../../redux/artists/get-details';
import { Store } from '../../redux/configure-store';

class EditArtist extends React.Component<any> {
  componentDidMount() {
    this.props.getArtist(null, this.props.match.params.slug);
  }

  render = () => (
    <CreateArtist editMode={true} artist={this.props.artists?.artist} />
  );
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
  };
};

const Edit = connect(mapStateToProps, mapDispatchToProps)(EditArtist);

export { Edit };
