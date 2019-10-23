import './create-artist.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Store } from 'src/redux/configure-store';

import { getMeAction } from 'src/redux/me/get-me';
import { setUserDataAction } from 'src/redux/me/set-me';
import { updateMeAction } from 'src/redux/me/update-me';

import { initialState as loginInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';

import { MuiThemeProvider } from '@material-ui/core/styles';
// import { Loading } from '../shared/loading/Loading';
import tear from '../../images/full_page_tear.png';

import { theme } from './theme';

type Dispatchers = ReturnType<typeof mapDispatchToProps>;

type Props = typeof loginInitialState &
  typeof meInitialState &
  Dispatchers & { history: any; };

class CreateArtistComponent extends React.Component<Props, any> {
  state = {

  };

  renderHeader = () => {
    return (
      <div className="create-artist__header">
        <div className="container">
          <h1>Create Your Artist Page</h1>
        </div>
        <img className="create-artist__header_tear" src={tear} />
      </div>
    );
  };

  renderContent = () => (
    <MuiThemeProvider theme={theme}>
      {this.renderHeader()}
    </MuiThemeProvider>
  );

  render() {
    return (
      <div className="create-artist">
        {this.renderContent()}
      </div>
    );
  }
}

const mapStateToProps = (state: Store) => ({
  ...state.authentication,
  ...state.me,
  subscriptions: state.subscriptions,
});

const mapDispatchToProps = (dispatch) => ({
  getMe: bindActionCreators(getMeAction, dispatch),
  setMe: bindActionCreators(setUserDataAction, dispatch),
  updateMe: bindActionCreators(updateMeAction, dispatch),
});

const CreateArtist = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateArtistComponent);

export { CreateArtist };
