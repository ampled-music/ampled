import './create-artist.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Store } from 'src/redux/configure-store';

import { getMeAction } from 'src/redux/me/get-me';
import { setUserDataAction } from 'src/redux/me/set-me';
import { updateMeAction } from 'src/redux/me/update-me';

import { MuiThemeProvider } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { theme } from './theme';
import tear from '../../images/full_page_tear.png';

interface Props {
  children?: React.ReactNode;
  index: any;
  value: any;
}

class CreateArtistComponent extends React.Component<Props, any> {
  state = {

  };


  TabPanel = () => {

    const { children, value, index, ...other } = this.props;

    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        <Box p={3}>{children}</Box>
      </Typography>
    );
  }

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

  renderNav = () => {
    return (
      <div className="create-artist__header">
        <AppBar position="static">
          <Tabs value="1" aria-label="simple tabs example">
            <Tab label="Item One" />
            <Tab label="Item Two" />
            <Tab label="Item Three" />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          Item One
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
      </div>
    );
  };

  renderContent = () => (
    <MuiThemeProvider theme={theme}>
      {this.renderHeader()}
      {this.renderNav()}
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
