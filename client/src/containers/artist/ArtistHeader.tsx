import './artist.scss';

import * as React from 'react';

import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import Edit from '../../images/icons/Icon_Edit.svg';
import { Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ArtistModel } from '../../redux/artists/initial-state';
import { UserRoles } from '../shared/user-roles';

import { FeaturedImages } from './header/FeaturedImages';
import { FeaturedVideo } from './header/FeaturedVideo';
import { FeaturedMessage } from './header/FeaturedMessage';
import { Supporters } from './header/Supporters';

interface Props {
  openVideoModal: React.MouseEventHandler;
  openPostModal: React.MouseEventHandler;
  openWhyModal: React.MouseEventHandler;
  openMessageModal: React.MouseEventHandler;
  artist: ArtistModel;
  loggedUserAccess: { role: string; artistId: number };
  isSupporter: boolean;
  handleSupportClick: Function;
}

export class ArtistHeader extends React.Component<Props, any> {
  state = {
    showConfirmationDialog: false,
  };

  canLoggedUserPost = () => {
    return (
      this.props.loggedUserAccess &&
      (this.props.loggedUserAccess.role === UserRoles.Admin ||
        this.props.loggedUserAccess.role === UserRoles.Member ||
        this.props.loggedUserAccess.role === UserRoles.Owner)
    );
  };

  canLoggedUserAdmin = () => {
    return (
      this.props.loggedUserAccess &&
      (this.props.loggedUserAccess.role === UserRoles.Admin ||
        this.props.loggedUserAccess.role === UserRoles.Owner)
    );
  };

  renderArtistName = () => (
    <div className="artist-header__title">
      <span className="artist-header__title_flair"></span>
      {this.props.artist.name}
    </div>
  );

  renderFloatingNewPostButton = () =>
    this.canLoggedUserPost() && (
      <div className="new-post">
        <Button
          onClick={this.props.openPostModal}
          endIcon={<FontAwesomeIcon icon={faPlus} color="#ffffff" />}
          size="small"
        >
          New Post
        </Button>
      </div>
    );

  renderFloatingEditButton = () =>
    this.canLoggedUserAdmin() && (
      <div className="edit-page">
        <Button
          onClick={() => {
            window.location.href = `${window.location.pathname}/edit`;
          }}
          endIcon={<FontAwesomeIcon icon={faEdit} color="#ffffff" />}
          size="small"
        >
          Edit Page
        </Button>
      </div>
    );

  render() {
    return (
      <div className="artist-header container">
        {this.renderArtistName()}
        <div className="row justify-content-between">
          <div className="col-md-7">
            <FeaturedImages
              artist={this.props.artist}
              loggedUserAccess={this.props.loggedUserAccess}
              isSupporter={this.props.isSupporter}
              handleSupportClick={this.props.handleSupportClick}
            />
          </div>
          <div className="col-md-4 artist-header__message-col">
            <FeaturedVideo
              artist={this.props.artist}
              openVideoModal={this.props.openVideoModal}
            />
            <FeaturedMessage
              artist={this.props.artist}
              openMessageModal={this.props.openMessageModal}
            />
            <Supporters
              artist={this.props.artist}
              openWhyModal={this.props.openWhyModal}
              loggedUserAccess={this.props.loggedUserAccess}
              isSupporter={this.props.isSupporter}
              handleSupportClick={this.props.handleSupportClick}
            />
            {this.renderFloatingNewPostButton()}
            {this.renderFloatingEditButton()}
          </div>
        </div>
      </div>
    );
  }
}
