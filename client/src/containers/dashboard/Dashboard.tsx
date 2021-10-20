import './dashboard.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  closeAuthModalAction,
  openAuthModalAction,
} from '../../redux/authentication/authentication-modal';
import { Store } from '../../redux/configure-store';
import { getMeAction } from '../../redux/me/get-me';
import { showToastAction } from '../../redux/toast/toast-modal';
import { config } from '../../config';

import { LicenseInfo } from '@material-ui/x-grid';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Tab, Tabs } from '@material-ui/core';

import { ConfirmationDialog } from '../shared/confirmation-dialog/ConfirmationDialog';
import { Modal } from '../shared/modal/Modal';
import { Loading } from '../shared/loading/Loading';
import { PostForm } from '../artist/posts/post-form/PostForm';
import StyleOverride from '../artist/StyleOverride';

import { initialState as loginInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';
import { initialState as subscriptionsInitialState } from '../../redux/subscriptions/initial-state';

import ArtistSupporters from './ArtistSupporters';
import ArtistPanel from './ArtistPanel';
import ArtistHome from './ArtistHome';

LicenseInfo.setLicenseKey(config.materialUi.key);

const mapDispatchToProps = (dispatch) => ({
  getMe: bindActionCreators(getMeAction, dispatch),
  openAuthModal: bindActionCreators(openAuthModalAction, dispatch),
  closeAuthModal: bindActionCreators(closeAuthModalAction, dispatch),
  showToast: bindActionCreators(showToastAction, dispatch),
});

type Dispatchers = ReturnType<typeof mapDispatchToProps>;

type Props = typeof loginInitialState &
  typeof meInitialState &
  Dispatchers & {
    openPostModal: React.MouseEventHandler;
    history: any;
    location: any;
    subscriptions: typeof subscriptionsInitialState;
  };

const TabPanel = ({ tabValue, index, children }) => (
  <div
    role="tabpanel"
    hidden={tabValue !== index}
    id={`vertical-tabpanel-${index}`}
    aria-labelledby={`vertical-tab-${index}`}
  >
    {tabValue === index && children}
  </div>
);

class DashboardComponent extends React.Component<Props, any> {
  state = {
    selectedArtist: {
      artistColor: undefined,
      artistId: undefined,
      isStripeSetup: false,
    },
    tabValue: 0,
    openPostModal: false,
    showConfirmationDialog: false,
  };

  componentDidMount() {
    this.setInitArtist();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.userData && this.props.userData) {
      this.setInitArtist();
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleChangeTab = (obj, value) => {
    this.setState({
      tabValue: value,
    });
  };

  openPostModal = () => {
    this.setState({ openPostModal: true });
  };

  closePostModal = () => {
    this.setState({ openPostModal: false });
  };

  getUserConfirmation = (hasUnsavedChanges) => {
    if (hasUnsavedChanges) {
      this.setState({ showConfirmationDialog: true });
    } else {
      this.discardChanges();
    }
  };

  closeConfirmationDialog = () => {
    this.setState({ showConfirmationDialog: false });
    this.closePostModal();
  };

  discardChanges = () => {
    this.closeConfirmationDialog();
  };

  setInitArtist = () => {
    if (this.props.userData?.ownedPages) {
      this.setState({
        selectedArtist: this.props.userData.ownedPages[0],
      });
    }
  };

  render() {
    const { userData } = this.props;
    const { tabValue, selectedArtist } = this.state;

    const { artistColor, artistId, isStripeSetup } = selectedArtist;

    const theme = createMuiTheme({
      palette: {
        primary: { main: '#1E1E1E' },
        secondary: { main: artistColor || '#1E1E1E' },
      },
      overrides: {
        MuiTabs: {
          root: {},
          indicator: {
            width: '5px',
          },
          scroller: {
            display: 'flex',
            justifyContent: 'center',
          }
        },
        MuiTab: {
          root: {
            textTransform: 'capitalize',
            fontSize: '1rem',
            fontFamily: 'LL Replica Light Web, sans-serif',
          },
        },
        MuiInput: {
          underline: {
            '&:after': {
              borderBottom: `2px solid ${artistColor}`,
            },
          },
        },
      },
      typography: {
        fontFamily: "'LL Replica Bold Web', sans-serif",
      },
    });

    return (
      <ThemeProvider theme={theme}>
        <StyleOverride accentColor={artistColor} />
        <Loading isLoading={this.props.loadingMe && !this.props.userData} />
        <div className="dashboard">
          {userData && (
            <div className="dashboard__panel">
              <ArtistPanel
                ownedPages={userData?.ownedPages}
                selectedArtist={selectedArtist}
                openPostModal={this.openPostModal}
                handleChange={this.handleChange}
              />
              <div className="dashboard__panel_links">
                <Tabs
                  orientation={window.screen.width <= 768 ? "horizontal" : "vertical"}
                  variant="scrollable"
                  name="tabValue"
                  value={tabValue}
                  onChange={this.handleChangeTab}
                  aria-label="scrollable prevent tabs"
                >
                  <Tab
                    label="Home"
                    id="tab-0"
                    aria-controls="tabpanel-0"
                  />
                  <Tab
                    label="Supporters"
                    id="tab-1"
                    aria-controls="tabpanel-1"
                  />
                  {/* <Tab
                    label="Income"
                    id="tab-2"
                    aria-controls="tabpanel-2"
                  /> */}
                </Tabs>
              </div>
            </div>
          )}

          <div className="dashboard__data">
            <TabPanel tabValue={tabValue} index={0}>
              <ArtistHome userData={userData} selectedArtist={selectedArtist} />
            </TabPanel>
            <TabPanel tabValue={tabValue} index={1}>
              <ArtistSupporters
                userData={userData}
                selectedArtist={selectedArtist}
              />
            </TabPanel>
            {/* <TabPanel tabValue={tabValue} index={2}>
              <ArtistIncome
              userData={userData}
              selectedArtist={selectedArtist}
            />
            </TabPanel> */}
          </div>
        </div>

        <ConfirmationDialog
          open={this.state.showConfirmationDialog}
          closeConfirmationDialog={this.closeConfirmationDialog}
          discardChanges={this.discardChanges}
        />
        <Modal
          open={this.state.openPostModal}
          onClose={this.closePostModal}
          className="post-modal"
          disableBackdropClick={true}
        >
          <PostForm
            close={this.getUserConfirmation}
            discardChanges={this.discardChanges}
            artistId={artistId}
            isStripeSetup={isStripeSetup}
          />
        </Modal>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state: Store) => ({
  ...state.authentication,
  ...state.me,
});

const Dashboard = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardComponent);

export { Dashboard };
