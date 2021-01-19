import * as React from 'react';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import tear from '../../images/backgrounds/background_tear.png';
import Instagram from '../../images/icons/Icon_Instagram.svg';
import Twitter from '../../images/icons/Icon_Twitter.svg';
import Location from '../../images/icons/Icon_Location.svg';
import Edit from '../../images/icons/Icon_Edit.svg';

import Moment from 'moment';

import { UserImage } from '../user-details/UserImage';

interface Props {
  userData: any;
}

export class UserInfo extends React.Component<Props, any> {
  render() {
    const { userData } = this.props;
    return (
      <div className="user-info-container col-md-3">
        <img className="tear__topper" src={tear} alt="" />
        <div className="user-content">
          <div className="user-image-container">
            <Link to="/user-details">
              <UserImage
                image={userData.image}
                className="user-image"
                alt={userData.name}
                width={120}
              />
            </Link>
          </div>
          <div className="user-content__name">{userData.name}</div>
          <div className="user-content__joined-at">
            Joined {Moment(userData.created_at).format('MMMM Do, YYYY')}
          </div>
          {userData.city && (
            <div className="user-content__city">
              <ReactSVG className="icon icon_sm" src={Location} />
              {userData.city}
            </div>
          )}
          {userData.bio && (
            <div>
              <div className="user-content__hr"></div>
              <div className="user-content__bio">{userData.bio}</div>
              <div className="user-content__hr"></div>
            </div>
          )}
          {userData.twitter && (
            <div className="user-content__social">
              <ReactSVG className="icon icon_sm" src={Twitter} />
              {userData.twitter}
            </div>
          )}
          {userData.instagram && (
            <div className="user-content__social">
              <ReactSVG className="icon icon_sm" src={Instagram} />
              {userData.instagram}
            </div>
          )}
          {/*
            monthlyTotal > 0 ?
              (<p className="user-name">${monthlyTotal.toFixed(2)}/Month</p>) :
              ''
          */}

          <Link to="/user-details" className="user-content__edit-profile">
            <ReactSVG className="icon icon_sm" src={Edit} />
            Edit Profile
          </Link>
          <button
            onClick={() => this.setState({ showPasswordModal: true })}
            className="user-content__change-password"
          >
            Change Password
          </button>
          {userData.admin && (
            <div>
              <strong>Ampled Admin</strong>
            </div>
          )}
        </div>
      </div>
    );
  }
}
