import './artist-dashboard.scss';

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
import { setUserDataAction } from '../../redux/me/set-me';
import { showToastAction } from '../../redux/toast/toast-modal';
import { config } from '../../config';

import { Image, Transformation } from 'cloudinary-react';

import { RowsProp, ColDef, ValueFormatterParams } from '@material-ui/data-grid';
import { XGrid, LicenseInfo } from '@material-ui/x-grid';
import { Check, Block } from '@material-ui/icons';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {
  Chip,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Tabs,
  Tab,
} from '@material-ui/core';

import Plus from '../../images/icons/Icon_Add-New.svg';
import Settings from '../../images/icons/Icon_Settings.svg';

import { initialState as loginInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';
import { initialState as subscriptionsInitialState } from '../../redux/subscriptions/initial-state';
import { any } from 'ramda';

LicenseInfo.setLicenseKey(config.materialUi.key);

const mapDispatchToProps = (dispatch) => ({
  getMe: bindActionCreators(getMeAction, dispatch),
  setMe: bindActionCreators(setUserDataAction, dispatch),
  openAuthModal: bindActionCreators(openAuthModalAction, dispatch),
  closeAuthModal: bindActionCreators(closeAuthModalAction, dispatch),
  showToast: bindActionCreators(showToastAction, dispatch),
});

type Dispatchers = ReturnType<typeof mapDispatchToProps>;

type Props = typeof loginInitialState &
  typeof meInitialState &
  Dispatchers & {
    history: any;
    location: any;
    subscriptions: typeof subscriptionsInitialState;
  };

class ArtistDashboardComponent extends React.Component<Props, any> {
  state = {
    selectedArtist: [],
    tabValue: 0,
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

  renderArtistPanel() {
    const { userData } = this.props;
    const ownedPages = userData?.ownedPages;
    console.log('userData: ', userData);

    return (
      <>
        <Image
          publicId={userData.image.public_id}
          alt={userData.name}
          key={userData.name}
          className="artist-dashboard__panel_image"
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
              value={this.state.selectedArtist}
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

        <div className="artist-dashboard__panel_buttons">
          <IconButton className="artist-dashboard__panel_buttons_plus">
            <ReactSVG className="icon icon_white" src={Plus} />
          </IconButton>
          <Link to="/user-details">
            <IconButton className="artist-dashboard__panel_buttons_settings">
              <ReactSVG className="icon icon_white" src={Settings} />
            </IconButton>
          </Link>
        </div>
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
      monthly: supporter.amount / 100,
      status: supporter.status,
      // all_time: 556,
      city: supporter.city,
      country: supporter.country,
      supporting_since: supporter.supporter_since,
    }));

    const columns: ColDef[] = [
      { field: 'name', headerName: 'Name', width: 400 },
      {
        field: 'monthly',
        headerName: 'Monthly',
        width: 150,
        valueFormatter: (params: ValueFormatterParams) =>
          params.value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          }),
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 150,
        renderCell: (params: ValueFormatterParams) => (
          <Chip
            size="small"
            icon={params.value === 'active' ? <Check /> : <Block />}
            color={params.value === 'active' ? 'primary' : 'default'}
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
      { field: 'country', headerName: 'Country', width: 200 },
      {
        field: 'supporting_since',
        headerName: 'Supporting Since',
        width: 200,
        type: 'date',
      },
    ];

    return (
      userData &&
      rows && (
        <XGrid
          rows={rows}
          columns={columns}
          // loading={rows.length === 0}
          rowHeight={40}
          rowsPerPageOptions={[25, 50, 100, 500, 1000]}
          checkboxSelection
        />
      )
    );
  }
  renderArtistPost() {
    const { userData } = this.props;
    const { selectedArtist } = this.state;
    // const returnArtist = userData?.ownedPages.filter(function(page) {
    //   return page.artistSlug === selectedArtist;
    // });
    // const artist = returnArtist?.shift();

    return userData && <div>poop</div>;
  }

  render() {
    const { userData } = this.props;
    const { tabValue, selectedArtist } = this.state;
    const TabPanel = this.renderTabPanel;

    let artist;
    artist = selectedArtist;
    let color;
    color = artist.artistColor;

    const theme = createMuiTheme({
      palette: {
        primary: {
          main: color || '#000',
        },
      },
    });

    return (
      <ThemeProvider theme={theme}>
        <div className="artist-dashboard">
          {userData && (
            <div className="artist-dashboard__panel">
              {this.renderArtistPanel()}
              <div className="artist-dashboard__panel_links">
                <Tabs
                  orientation="vertical"
                  variant="scrollable"
                  name="tabValue"
                  value={tabValue}
                  onChange={this.handleChangeTab}
                >
                  <Tab
                    label="Supporters"
                    id="vertical-tab-0"
                    aria-controls="vertical-tabpanel-0"
                  />
                  <Tab
                    label="Post"
                    id="vertical-tab-1"
                    aria-controls="vertical-tabpanel-1"
                  />
                </Tabs>
              </div>
            </div>
          )}

          <div className="artist-dashboard__data">
            <TabPanel tabValue={tabValue} index={0}>
              {this.renderArtistSupporters()}
            </TabPanel>
            <TabPanel tabValue={tabValue} index={1}>
              {this.renderArtistPost()}
            </TabPanel>
          </div>
        </div>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state: Store) => ({
  ...state.authentication,
  ...state.me,
});

const ArtistDashboard = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ArtistDashboardComponent);

export { ArtistDashboard };
