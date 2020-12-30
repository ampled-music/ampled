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
import {
  Chip,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Tabs,
  Tab,
  Typography,
  Box,
} from '@material-ui/core';

import Plus from '../../images/icons/Icon_Add-New.svg';
import Settings from '../../images/icons/Icon_Settings.svg';

import { initialState as loginInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';
import { initialState as subscriptionsInitialState } from '../../redux/subscriptions/initial-state';

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

class ArtistDashboardComponent extends React.Component<Props, any> {
  state = {
    selectedArtist: '',
    selectedTab: 0,
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

  setInitArtist = () => {
    if (this.props.userData?.ownedPages) {
      this.setState({
        selectedArtist: this.props.userData.ownedPages[0].artistSlug,
      });
    }
  };

  renderArtistPanel() {
    const { userData } = this.props;
    console.log('subscriptions: ', userData.ownedPages[0].subscriptions);
    console.log('userData: ', userData);
    const ownedPages = userData?.ownedPages;

    return (
      <div className="artist-dashboard__panel">
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

        <FormControl>
          <Select
            id="artist-page-select"
            name="selectedArtist"
            value={this.state.selectedArtist}
            onChange={this.handleChange}
          >
            {ownedPages.map((page) => (
              <MenuItem value={page.artistSlug}>{page.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

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

        <div className="artist-dashboard__panel_links">
          <Tabs
            orientation="vertical"
            variant="scrollable"
            name="selectedTab"
            value={this.state.selectedTab}
            onChange={this.handleChange}
          >
            <Tab label="Supporters" {...a11yProps(0)} />
            <Tab label="Item Two" {...a11yProps(1)} />
          </Tabs>
        </div>
      </div>
    );
  }
  renderArtistSupporters() {
    const { userData } = this.props;
    const { selectedArtist } = this.state;
    const returnArtist = userData?.ownedPages.filter(function(page) {
      return page.artistSlug === selectedArtist;
    });
    const artist = returnArtist?.shift();
    const supporters = artist?.subscriptions;

    const rows: RowsProp = supporters?.map((supporter) => ({
      id: supporter.id,
      name: supporter.name,
      monthly: supporter.amount / 100,
      status: supporter.status,
      // all_time: 556,
      location: supporter.location,
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
      { field: 'location', headerName: 'Location', width: 400 },
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

  render() {
    const { userData } = this.props;
    const { selectedTab } = this.state;

    return (
      <div className="artist-dashboard">
        {userData && this.renderArtistPanel()}

        <div className="artist-dashboard__data">
          <TabPanel value={selectedTab} index={0}>
            {this.renderArtistSupporters()}
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            poop
          </TabPanel>
        </div>
      </div>
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
