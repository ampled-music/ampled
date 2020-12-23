import './artist-dashboard.scss';

import * as React from 'react';
// import { Link } from 'react-router-dom';
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
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@material-ui/core';
// import { apiAxios } from '../../api/setup-axios';

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

interface Data {
  name: string;
  monthly: number;
  all_time: number;
  location: string;
  supporting_since: string;
}

function createData(
  name: string,
  monthly: number,
  all_time: number,
  location: string,
  supporting_since: string,
): Data {
  return { name, monthly, all_time, location, supporting_since };
}

const rows = [
  createData('Test Name 1', 6.0, 159, 'Place', '2020-10-29 19:51:43.717274'),
  createData('Test Name 2', 9.0, 237, 'Place', '2020-10-29 19:51:43.717274'),
  createData('Test Name 3', 3.0, 262, 'Place', '2020-10-29 19:51:43.717274'),
  createData('Test Name 4', 3.7, 305, 'Place', '2020-10-29 19:51:43.717274'),
  createData('Test Name 5', 4.0, 356, 'Place', '2020-10-29 19:51:43.717274'),
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  {
    id: 'monthly',
    numeric: true,
    disablePadding: false,
    label: 'Monthy Support',
  },
  {
    id: 'all_time',
    numeric: true,
    disablePadding: false,
    label: 'All Time Support',
  },
  { id: 'location', numeric: false, disablePadding: false, label: 'Location' },
  {
    id: 'supporting_since',
    numeric: false,
    disablePadding: false,
    label: 'Supporting Since',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property: keyof Data) => (
    event: React.MouseEvent<unknown>,
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

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
      </div>
    );
  }

  renderSupportersPanel() {
    return (
      <TableContainer className="artist-dashboard__data">
        <Table stickyHeader aria-label="Supporters table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Monthly</TableCell>
              <TableCell>All Time</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Supporting Since</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.monthly}</TableCell>
                <TableCell>{row.all_time}</TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell>{row.supporting_since}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
