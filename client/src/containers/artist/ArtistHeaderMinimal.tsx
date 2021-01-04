import './artist.scss';

import * as React from 'react';
import { ReactSVG } from 'react-svg';
import { Link } from 'react-router-dom';

import Edit from '../../images/icons/Icon_Edit.svg';
import Plus from '../../images/icons/Icon_Add-Plus.svg';
import { Button } from '@material-ui/core';
import { ArtistModel } from '../../redux/artists/initial-state';
import { UserRoles } from '../shared/user-roles';

import { ContributorImages } from './header/ContributorImages';
import { FeaturedImages } from './header/FeaturedImages';
import { FeaturedVideo } from './header/FeaturedVideo';
import { FeaturedMessage } from './header/FeaturedMessage';
import { Supporters } from './header/Supporters';
import { ArtistInfo } from './header/ArtistInfo';
import { Members } from './header/Members';

interface Props {
  openVideoModal: React.MouseEventHandler;
  openPostModal: React.MouseEventHandler;
  openWhyModal: React.MouseEventHandler;
  openJoinModal: React.MouseEventHandler;
  openMessageModal: React.MouseEventHandler;
  artist: ArtistModel;
  loggedUserAccess: { role: string; artistId: number };
  isSupporter: boolean;
  handleSupportClick: Function;
}

export class ArtistHeaderMinimal extends React.Component<Props, any> {
  state = {
    showConfirmationDialog: false,
  };

  isAmpled = () => {
    return this.props.artist.slug === 'community';
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
    <div className="artist-header__name">
      <div className="artist-header__title">
        <span className="artist-header__title_flair"></span>
        {this.props.artist.name}
      </div>
    </div>
  );

  renderSupportButton = () => {
    const { artist } = this.props;
    const borderColor = artist.accent_color;

    return (
      <div className="artist-header__support-buttons">
        <button
          className="btn btn-ampled btn-support"
          style={{ borderColor }}
          onClick={() => this.props.handleSupportClick()}
        >
          {this.isAmpled() ? 'Become a Member' : 'Support This Artist'}
        </button>

        {this.isAmpled() ? (
          <button onClick={this.props.openJoinModal} className="link link__why">
            Why join?
          </button>
        ) : (
          <button onClick={this.props.openWhyModal} className="link link__why">
            Why support?
          </button>
        )}
      </div>
    );
  };

  renderFloatingNewPostButton = () =>
    this.canLoggedUserPost() && (
      <div className="new-post">
        <Button
          onClick={this.props.openPostModal}
          endIcon={<ReactSVG className="icon icon_white" src={Plus} />}
          size="small"
        >
          New Post
        </Button>
      </div>
    );

  renderFloatingEditButton = () =>
    this.canLoggedUserAdmin() && (
      <div className="edit-page">
        <Link to="/edit">
          <Button
            endIcon={<ReactSVG className="icon icon_white" src={Edit} />}
            size="small"
          >
            Edit Page
          </Button>
        </Link>
      </div>
    );

  render() {
    const {
      artist,
      loggedUserAccess,
      isSupporter,
      handleSupportClick,
      openVideoModal,
      openMessageModal,
      openWhyModal,
      openJoinModal,
    } = this.props;

    return (
      <>
        <div className="artist-header minimal container">
          {this.renderArtistName()}
          {this.isAmpled() ? (
            <ContributorImages
              artist={artist}
              loggedUserAccess={loggedUserAccess}
              isSupporter={isSupporter}
              handleSupportClick={handleSupportClick}
              imageWidth={2000}
              imageHeight={800}
            />
          ) : (
            <FeaturedImages
              artist={artist}
              loggedUserAccess={loggedUserAccess}
              isSupporter={isSupporter}
              handleSupportClick={handleSupportClick}
              imageWidth={2000}
              imageHeight={800}
            />
          )}
          <div className="artist-header__message-col">
            {!artist.hide_members && !this.isAmpled() && (
              <Members artist={artist} />
            )}
            <FeaturedMessage
              artist={artist}
              openMessageModal={openMessageModal}
            />
            <FeaturedVideo artist={artist} openVideoModal={openVideoModal} />
            <Supporters
              artist={artist}
              openWhyModal={openWhyModal}
              loggedUserAccess={loggedUserAccess}
              isSupporter={isSupporter}
              handleSupportClick={handleSupportClick}
            />
          </div>
          <div className="artist-header__info">
            <ArtistInfo
              artist={artist}
              openWhyModal={openWhyModal}
              openJoinModal={openJoinModal}
              loggedUserAccess={loggedUserAccess}
              isSupporter={isSupporter}
              handleSupportClick={handleSupportClick}
            />
          </div>
          {this.renderFloatingNewPostButton()}
          {this.renderFloatingEditButton()}
        </div>
      </>
    );
  }
}
