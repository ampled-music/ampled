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

import { Image, Transformation } from 'cloudinary-react';

import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
// import { apiAxios } from '../../api/setup-axios';

import {
  DataGrid,
  RowsProp,
  ColDef,
  ValueFormatterParams,
} from '@material-ui/data-grid';

import Plus from '../../images/icons/Icon_Add-New.svg';
import Settings from '../../images/icons/Icon_Settings.svg';
// import { faImage } from '@fortawesome/free-solid-svg-icons';
// import { faStripe } from '@fortawesome/free-brands-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import tear from '../../images/backgrounds/background_tear.png';
// import tear_black from '../../images/backgrounds/background_tear_black.png';

// import Edit from '../../images/icons/Icon_Edit.svg';
// import Instagram from '../../images/icons/Icon_Instagram.svg';
// import Twitter from '../../images/icons/Icon_Twitter.svg';
// import Location from '../../images/icons/Icon_Location.svg';

import { initialState as loginInitialState } from '../../redux/authentication/initial-state';
import { initialState as meInitialState } from '../../redux/me/initial-state';
import { initialState as subscriptionsInitialState } from '../../redux/subscriptions/initial-state';
// import { routePaths } from '../route-paths';
// import { Modal } from '../shared/modal/Modal';
// import { ResetPassword } from '../connect/ResetPassword';
// import { Loading } from '../shared/loading/Loading';
// import { UserImage } from '../user-details/UserImage';

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

const rows: RowsProp = [
  {
    id: 1,
    name: 'Test Name 1',
    monthly: 24,
    all_time: 556,
    location: 'Location',
    supporting_since: new Date('2020-11-29 19:51:43.717274'),
  },
  {
    id: 2,
    name: 'Test Name 2',
    monthly: 2,
    all_time: 6,
    location: 'Location',
    supporting_since: new Date('2020-06-22 19:51:43.717274'),
  },
  {
    id: 3,
    name: 'Test Name 3',
    monthly: 6,
    all_time: 12,
    location: 'Location',
    supporting_since: new Date('2020-03-12 19:51:43.717274'),
  },
  {
    id: 4,
    name: 'Test Name 4',
    monthly: 4.3,
    all_time: 43.3,
    location: 'Location',
    supporting_since: new Date('2020-01-22 19:51:43.717274'),
  },
  {
    id: 5,
    name: 'Test Name 5',
    monthly: 6.66,
    all_time: 99.99,
    location: 'Location',
    supporting_since: new Date('2020-02-01 19:51:43.717274'),
  },
  {
    id: 6,
    name: 'Test Name 6',
    monthly: 10,
    all_time: 200,
    location: 'Location',
    supporting_since: new Date('2020-07-03 19:51:43.717274'),
  },
  {
    id: 7,
    name: 'Test Name 7',
    monthly: 3.23,
    all_time: 8.77,
    location: 'Location',
    supporting_since: new Date('2020-02-06 19:51:43.717274'),
  },
  {
    id: 8,
    name: 'Test Name 8',
    monthly: 99.2,
    all_time: 34.3,
    location: 'Location',
    supporting_since: new Date('2020-04-17 19:51:43.717274'),
  },
  {
    id: 9,
    name: 'Test Name 9',
    monthly: 3.2,
    all_time: 99.3,
    location: 'Location',
    supporting_since: new Date('2020-02-04 19:51:43.717274'),
  },
  {
    id: 10,
    name: 'Test Name 10',
    monthly: 3,
    all_time: 3,
    location: 'Location',
    supporting_since: new Date('2020-02-29 19:51:43.717274'),
  },
];

const columns: ColDef[] = [
  { field: 'name', headerName: 'Name', width: 400 },
  {
    field: 'monthly',
    headerName: 'Monthly Support',
    width: 150,
    valueFormatter: (params: ValueFormatterParams) =>
      params.value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      }),
  },
  {
    field: 'all_time',
    headerName: 'All Time Support',
    width: 150,
    valueFormatter: (params: ValueFormatterParams) =>
      params.value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      }),
  },
  { field: 'location', headerName: 'Location', width: 400 },
  {
    field: 'supporting_since',
    headerName: 'Supporting Since',
    width: 200,
    valueFormatter: (params: ValueFormatterParams) =>
      (params.value as Date).toDateString(),
  },
];

const useStyles = makeStyles({
  root: {
    minWidth: 650,
  },
});

class ArtistDashboardComponent extends React.Component<Props, any> {
  state = {};

  componentDidMount() {
    this.props.getMe();
  }

  componentDidUpdate(prevProps) {}

  renderArtistPanel() {
    const { userData } = this.props;
    console.log(userData);

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
        <div className="artist-dashboard__panel_buttons">
          <IconButton className="artist-dashboard__panel_buttons_plus">
            <ReactSVG className="icon icon_white" src={Plus} />
          </IconButton>
          <IconButton className="artist-dashboard__panel_buttons_settings">
            <ReactSVG className="icon icon_white" src={Settings} />
          </IconButton>
        </div>

        <div className="artist-dashboard__panel_links">
          <Link className="active" to={``}>
            Supporters
            <span className="flair"></span>
          </Link>
        </div>
      </div>
    );
  }

  renderSupportersPanel() {
    // const classes = useStyles();

    return (
      <div className="artist-dashboard__data">
        <DataGrid rows={rows} columns={columns} />
      </div>
    );
  }

  render() {
    const { userData } = this.props;

    return (
      <div className="artist-dashboard">
        {userData && this.renderArtistPanel()}
        {this.renderSupportersPanel()}
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
