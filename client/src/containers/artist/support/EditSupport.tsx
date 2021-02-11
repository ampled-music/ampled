import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Support } from './Support';
import { getArtistAction } from '../../../redux/artists/get-details';
import { Store } from '../../../redux/configure-store';

class EditSupport extends React.Component<any> {
  componentDidMount() {
    this.props.getArtist(null, this.props.match.params.slug);
  }

  render = () => <Support editMode={true} match={this.props.match} />;
}

const mapStateToProps = (state: Store) => {
  return {
    artists: state.artists,
    me: state.me,
    authentication: state.authentication,
    subscriptions: state.subscriptions,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getArtist: bindActionCreators(getArtistAction, dispatch),
  };
};

const Edit = connect(mapStateToProps, mapDispatchToProps)(EditSupport);

export { Edit };
