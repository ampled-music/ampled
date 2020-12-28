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
          <Link to="/user-details">
            <IconButton className="artist-dashboard__panel_buttons_settings">
              <ReactSVG className="icon icon_white" src={Settings} />
            </IconButton>
          </Link>
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

  render() {
    const { userData } = this.props;
    const supporters = userData?.ownedPages[0].supporters;

    const rows: RowsProp = supporters?.map((supporter) => ({
      id: supporter.id,
      name: supporter.name + ' ' + supporter.last_initial + '.',
      monthly: 11,
      all_time: 556,
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
        field: 'all_time',
        headerName: 'All Time',
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
        // valueFormatter: (params: ValueFormatterParams) =>
        //   (params.value as Date).toDateString(),
      },
    ];

    console.log('supporters:', supporters);

    return (
      <div className="artist-dashboard">
        {userData && this.renderArtistPanel()}

        <div className="artist-dashboard__data">
          {userData && <DataGrid rows={rows} columns={columns} />}
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
