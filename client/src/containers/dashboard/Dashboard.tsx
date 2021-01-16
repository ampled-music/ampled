import './dashboard.scss';

import * as React from 'react';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
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

import { Image, Transformation } from 'cloudinary-react';

import { LicenseInfo } from '@material-ui/x-grid';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Tooltip,
} from '@material-ui/core';

import { ConfirmationDialog } from '../shared/confirmation-dialog/ConfirmationDialog';
import { Modal } from '../shared/modal/Modal';
import { PostForm } from '../artist/posts/post-form/PostForm';
import StyleOverride from '../artist/StyleOverride';

import Plus from '../../images/icons/Icon_Add-New.svg';
import Edit from '../../images/icons/Icon_Edit.svg';

import { initialState as loginInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';
import { initialState as subscriptionsInitialState } from '../../redux/subscriptions/initial-state';

import ArtistSupporters from './ArtistSupporters';

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
    selectedArtist: [],
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

  renderArtistPanel(color) {
    const { userData } = this.props;
    const { selectedArtist } = this.state;
    const ownedPages = userData?.ownedPages;
    let artist;
    artist = selectedArtist;
    console.log(artist);

    return (
      <>
        <Image
          publicId={artist.image}
          alt={artist.name}
          key={artist.name}
          className="dashboard__panel_image"
          style={{ borderColor: color }}
        >
          <Transformation
            fetchFormat="auto"
            quality="auto"
            crop="fill"
            width={80}
            height={80}
            responsive_placeholder="blank"
          />
        </Image>

        {ownedPages.length > 1 ? (
          <FormControl>
            <Select
              id="artist-page-select"
              name="selectedArtist"
              value={selectedArtist}
              onChange={this.handleChange}
            >
              {ownedPages.map((page, index) => (
                <MenuItem value={page} key={`menu-key${index}`}>
                  {page.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <div id="artist-page-select">{ownedPages[0].name}</div>
        )}

        {artist && (
          <div className="dashboard__panel_buttons">
            <Tooltip title="Add New Post">
              <IconButton
                onClick={this.openPostModal}
                className="dashboard__panel_buttons_plus"
                style={{ backgroundColor: artist.artistColor }}
              >
                <ReactSVG className="icon icon_white" src={Plus} />
              </IconButton>
            </Tooltip>
            <Link to={`/artist/${artist.artistSlug}/edit`}>
              <Tooltip title={`Edit ${artist.name}`}>
                <IconButton
                  className="dashboard__panel_buttons_settings"
                  style={{ backgroundColor: artist.artistColor }}
                >
                  <ReactSVG className="icon icon_white" src={Edit} />
                </IconButton>
              </Tooltip>
            </Link>
          </div>
        )}
      </>
    );
  }

  renderArtistIncome() {
    // const { userData } = this.props;
    // const { selectedArtist } = this.state;
    // let artist;
    // artist = selectedArtist;

    return 'income';
  }
  renderArtistHome() {
    // const { userData } = this.props;
    // const { selectedArtist } = this.state;
    // let artist;
    // artist = selectedArtist;

    return 'Home';
  }

  render() {
    const { userData } = this.props;
    const { tabValue, selectedArtist } = this.state;

    let artist;
    artist = selectedArtist;
    let artistColor = artist.artistColor;
    let artistId = artist.artistId;
    let isStripeSetup = artist.isStripeSetup;

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
        },
        MuiTab: {
          root: {
            textTransform: 'capitalize',
            fontSize: '1rem',
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
        <div className="dashboard">
          {userData && (
            <div className="dashboard__panel">
              {this.renderArtistPanel(artistColor)}
              <div className="dashboard__panel_links">
                <Tabs
                  orientation="vertical"
                  variant="scrollable"
                  name="tabValue"
                  value={tabValue}
                  onChange={this.handleChangeTab}
                >
                  <Tab
                    label="Home"
                    id="vertical-tab-0"
                    aria-controls="vertical-tabpanel-0"
                  />
                  <Tab
                    label="Supporters"
                    id="vertical-tab-1"
                    aria-controls="vertical-tabpanel-1"
                  />
                  <Tab
                    label="Income"
                    id="vertical-tab-2"
                    aria-controls="vertical-tabpanel-2"
                  />
                </Tabs>
              </div>
            </div>
          )}

          <div className="dashboard__data">
            <TabPanel tabValue={tabValue} index={0}>
              {this.renderArtistHome()}
            </TabPanel>
            <TabPanel tabValue={tabValue} index={1}>
              <ArtistSupporters userData={userData} selectedArtist={selectedArtist} />
            </TabPanel>
            <TabPanel tabValue={tabValue} index={2}>
              {this.renderArtistIncome()}
            </TabPanel>
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
