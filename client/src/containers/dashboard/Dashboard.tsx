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

import Moment from 'react-moment';

import { Image, Transformation } from 'cloudinary-react';

import { RowsProp, ColDef, ValueFormatterParams } from '@material-ui/data-grid';
import { XGrid, LicenseInfo } from '@material-ui/x-grid';
import { Check, Block, GetApp } from '@material-ui/icons';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {
  Chip,
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

  renderTabPanel = ({ tabValue, index, children }) => {
    return (
      <div
        role="tabpanel"
        hidden={tabValue !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
      >
        {tabValue === index && children}
      </div>
    );
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

    return (
      <>
        <Image
          publicId={userData.image.public_id}
          alt={userData.name}
          key={userData.name}
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
        <h2>{userData.name}</h2>

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
              >
                <ReactSVG className="icon icon_white" src={Plus} />
              </IconButton>
            </Tooltip>
            <Link to={`/artist/${artist.artistSlug}/edit`}>
              <Tooltip title={`Edit ${artist.name}`}>
                <IconButton className="dashboard__panel_buttons_settings">
                  <ReactSVG className="icon icon_white" src={Edit} />
                </IconButton>
              </Tooltip>
            </Link>
            <a
              href={`/artist/${artist.artistSlug}/subscribers_csv`}
              download={`${artist.name} Supporters`}
            >
              <Tooltip title={`Download ${artist.name} Supporters`}>
                <IconButton className="dashboard__panel_buttons_export">
                  <GetApp className="icon icon_white" />
                </IconButton>
              </Tooltip>
            </a>
          </div>
        )}
      </>
    );
  }
  renderArtistSupporters() {
    const { userData } = this.props;
    const { selectedArtist } = this.state;
    let artist;
    artist = selectedArtist;
    let supporters;
    supporters = artist.subscriptions;

    const rows: RowsProp = supporters?.map((supporter) => ({
      id: supporter.id,
      name: supporter.name,
      email: supporter.email,
      monthly: supporter.amount / 100,
      status: supporter.status,
      // all_time: 556,
      city: supporter.city,
      country: supporter.country,
      supporting_since: supporter.supporter_since,
    }));

    const columns: ColDef[] = [
      { field: 'name', headerName: 'Name', width: 150 },
      {
        field: 'email',
        headerName: 'Email',
        width: 200,
        renderCell: (params: ValueFormatterParams) => (
          <a href={`mailto:${params.value}`}>{params.value}</a>
        ),
      },
      {
        field: 'monthly',
        headerName: 'Monthly',
        width: 100,
        valueFormatter: (params: ValueFormatterParams) =>
          params.value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          }),
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 110,
        renderCell: (params: ValueFormatterParams) => (
          <Chip
            size="small"
            icon={params.value === 'active' ? <Check /> : <Block />}
            style={
              params.value === 'active'
                ? { backgroundColor: '#baddac' }
                : { backgroundColor: 'inherent' }
            }
            label={params.value}
          />
        ),
      },
      // {
      //   field: 'all_time',
      //   headerName: 'All Time',
      //   width: 150,
      //   valueFormatter: (params: ValueFormatterParams) =>
      //     params.value.toLocaleString('en-US', {
      //       style: 'currency',
      //       currency: 'USD',
      //     }),
      // },
      { field: 'city', headerName: 'City', width: 200 },
      { field: 'country', headerName: 'Country', width: 100 },
      {
        field: 'supporting_since',
        headerName: 'Supporting Since',
        width: 200,
        type: 'date',
        renderCell: (params: any) => (
          <Moment format="MMM Do, YYYY">{params.value}</Moment>
        ),
      },
    ];

    return (
      userData &&
      rows && (
        <XGrid
          rows={rows}
          columns={columns}
          rowHeight={40}
          rowsPerPageOptions={[25, 50, 100, 500, 1000]}
        />
      )
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
    const TabPanel = this.renderTabPanel;

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
        MuiIconButton: {
          root: {
            color: 'inherit',
            backgroundColor: artistColor,
            '&:hover': {
              backgroundColor: `${artistColor}D9`,
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
              {this.renderArtistSupporters()}
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
