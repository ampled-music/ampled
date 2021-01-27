import './create-artist.scss';
import './../artist/posts/post/post.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import { Redirect } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { MuiThemeProvider } from '@material-ui/core/styles';
import {
  FormControlLabel,
  Button,
  Checkbox,
  Card,
  CardContent,
  CardActions,
} from '@material-ui/core';

import { theme } from './theme';
import tear from '../../images/full_page_tear.png';
import Close from '../../images/icons/Icon_Close-Cancel.svg';

import { Store } from '../../redux/configure-store';

import { showToastAction } from '../../redux/toast/toast-modal';
import { deleteArtistAction } from '../../redux/artists/delete';

import { apiAxios } from '../../api/setup-axios';
import { Loading } from '../shared/loading/Loading';

import { Modal } from '../shared/modal/Modal';

import { Members } from './Members';
import { Info } from './Info';
import { Images } from './Images';
import { Color } from './Color';

interface CreateArtistProps {
  me: any;
  editMode?: boolean;
  artist?: any;
  showToast: Function;
  deleteArtist: Function;
}

class CreateArtist extends React.Component<CreateArtistProps, any> {
  randomColor = () => {
    const bgColor = ['#e9c7c6', '#eddfbd', '#baddac', '#cae4e7'];
    return bgColor[Math.floor(Math.random() * bgColor.length)];
  };

  state = {
    randomColor: '',
    artistColor: '',
    artistColorAlpha: '',
    artistName: '',
    artistVerb: '',
    artistLocation: '',
    artistMessage: '',
    artistTwitter: '',
    artistInstagram: '',
    artistBandcamp: '',
    artistYoutube: '',
    artistExternal: '',
    artistVideo: '',
    artistSlug: '',
    artistStripe: '',
    hideMembers: false,
    members: [],
    images: [],
    imageUploads: [],
    loading: true,
    showConfirmRemoveMember: false,
    confirmRemoveMemberIndex: 99,
    showDeleteModal: false,
    isDeletedPage: false,
    subscribeToNewsletter: true,
  };

  constructor(props) {
    super(props);
    const randomColor = this.randomColor();
    this.state = {
      ...this.state,
      randomColor,
      artistColor: randomColor,
      artistColorAlpha: randomColor + '33',
    };
  }

  componentDidUpdate = (prevProps) => {
    const {
      me: { userData },
      artist,
      editMode,
    } = this.props;

    const { loading } = this.state;
    if (userData && !prevProps?.me?.userData) {
      const { name, last_name, instagram, twitter, image, email } = userData;
      if (!editMode) {
        this.setState({
          members: [
            {
              isAdmin: true,
              firstName: name,
              lastName: last_name,
              email,
              role: '',
              instagram,
              twitter,
              photo: image,
            },
          ],
        });
      }
    }
    if (editMode && artist && !prevProps?.artist?.name && artist.name) {
      // console.log(artist);
      const {
        accent_color,
        name,
        verb_plural,
        location,
        bio,
        twitter_handle,
        instagram_handle,
        youtube_handle,
        bandcamp_handle,
        external,
        video_url,
        hide_members,
        subscribe_to_newsletter,
        slug,
        owners,
        images,
      } = artist;
      this.setState({
        artistColor: accent_color,
        artistColorAlpha: accent_color + '33',
        artistName: name,
        artistVerb: verb_plural ? 'are' : 'is',
        artistLocation: location,
        artistMessage: bio,
        artistTwitter: twitter_handle,
        artistInstagram: instagram_handle,
        artistYoutube: youtube_handle,
        artistBandcamp: bandcamp_handle,
        artistExternal: external,
        artistVideo: video_url,
        artistSlug: slug,
        artistStripe: '',
        hideMembers: hide_members,
        subscribeToNewsletter: subscribe_to_newsletter,
        members: (owners || []).map((owner) => ({
          firstName: owner.name || '',
          role: owner.instrument || '',
          email: owner.email || '',
          lastName: owner.lastName || '',
          isAdmin: owner.role === 'admin',
        })),
        images: images || [],
      });
    }
    if (userData && (artist || !editMode) && loading) {
      this.setState({
        loading: false,
      });
    }
  };

  componentDidMount = () => {
    const {
      artist,
      editMode,
      me: { userData },
    } = this.props;
    if (editMode && artist && artist.name) {
      const {
        accent_color,
        name,
        verb_plural,
        location,
        bio,
        twitter_handle,
        instagram_handle,
        youtube_handle,
        bandcamp_handle,
        external,
        video_url,
        slug,
        owners,
        images,
        hide_members,
      } = artist;
      this.setState({
        artistColor: accent_color,
        artistName: name,
        artistVerb: verb_plural ? 'are' : 'is',
        artistLocation: location,
        artistMessage: bio,
        artistTwitter: twitter_handle,
        artistInstagram: instagram_handle,
        artistYoutube: youtube_handle,
        artistBandcamp: bandcamp_handle,
        artistExternal: external,
        artistVideo: video_url,
        artistSlug: slug,
        artistStripe: '',
        hideMembers: hide_members,
        members: (owners || []).map((owner) => ({
          firstName: owner.name || '',
          role: owner.instrument || '',
          email: owner.email || '',
          lastName: owner.lastName || '',
          isAdmin: owner.role === 'admin',
        })),
        images: images || [],
      });
    } else if (!editMode && userData) {
      // nothing commit
      this.setState({
        loading: false,
      });

      if (this.state.members.length === 0) {
        const { name, last_name, instagram, twitter, image, email } = userData;
        this.setState({
          members: [
            {
              isAdmin: true,
              firstName: name,
              lastName: last_name,
              email,
              role: '',
              instagram,
              twitter,
              photo: image,
            },
          ],
        });
      }
    }
  };

  isShowDeleteBtn = () => {
    if (this.props.artist?.owners && this.props.me?.userData) {
      const isPageAdmin = this.props.artist.owners.some((owner) => {
        return owner.id === this.props.me.userData.id;
      });

      return isPageAdmin && this.props.editMode;
    }

    return false;
  };

  deleteArtistPage = async () => {
    const response = await this.props.deleteArtist(this.props.artist.id);

    if (response && response.data) {
      if (response.status === 200 && response.data?.status !== 'error') {
        this.props.showToast({
          message: response.data.message,
          type: 'success',
        });

        this.setState({ isDeletedPage: true });
        // window.location.href = '/';
      } else {
        this.props.showToast({
          message: response.data.message,
          type: 'error',
        });
      }
    } else {
      this.props.showToast({
        message: 'There was an error deleting your artist page.',
        type: 'error',
      });
    }
  };

  handleColorChange = (color) => {
    this.setState({
      artistColor: color.hex,
      artistColorAlpha: color.hex + '33',
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'artistSlug') {
      this.setState({ [name]: value.toLowerCase() });
    } else if (name === 'artistInstagram' || name === 'artistTwitter') {
      this.setState({ [name]: value.replace(/^#|@/, '') });
    } else {
      this.setState({ [name]: value });
    }
  };

  handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  addMember = () => {
    this.setState({
      members: [
        ...this.state.members,
        {
          isAdmin: true,
          email: '',
          firstName: '',
          lastName: '',
          role: '',
          instagram: '',
          twitter: '',
          photo: '',
        },
      ],
    });
  };

  removeMemberConfirm = (index) => {
    this.setState({
      showConfirmRemoveMember: true,
      confirmRemoveMemberIndex: index,
    });
  };

  removeMember = (index) => {
    this.setState({
      members: [
        ...this.state.members.slice(0, index),
        ...this.state.members.slice(index + 1),
      ],
      showConfirmRemoveMember: false,
    });
  };

  updateMemberDetails = (e, index) => {
    const { members } = this.state;
    const { name, value, type, checked } = e.target;

    this.setState({
      members: [
        ...members.slice(0, index),
        {
          ...members[index],
          [name]: type === 'checkbox' ? checked : value,
        },
        ...members.slice(index + 1),
      ],
    });
  };

  onDeleteBtnClicked = () => {
    this.setState({ showDeleteModal: !this.state.showDeleteModal });
  };

  onSubmit = async () => {
    const {
      artistName,
      artistColor,
      artistInstagram,
      artistTwitter,
      artistBandcamp,
      artistYoutube,
      artistExternal,
      artistLocation,
      artistMessage,
      artistSlug,
      artistVerb,
      artistVideo,
      hideMembers,
      images,
      imageUploads,
      members,
    } = this.state;

    console.log('onSubmit:', this.state);

    // validate fields
    // Make sure artist name is filled out
    if (!artistName) {
      return this.props.showToast({
        message: 'Please check that you have a valid artist name.',
        type: 'error',
      });
    }
    // Make sure artist slug is filled out and has no special characters
    if (!artistSlug || !/^[a-z-0-9]*[a-z]+[a-z-0-9]*$/.test(artistSlug)) {
      return this.props.showToast({
        message:
          'Please check that you have a valid custom link. Special characters are not allowed.',
        type: 'error',
      });
    }

    // Make sure video url is Youtube or Vimeo
    const videoRegex = /(youtube.com\/watch\?|youtu.be\/|vimeo.com\/\d+)/gi;
    if (
      artistVideo &&
      artistVideo.length > 0 &&
      !videoRegex.test(artistVideo)
    ) {
      return this.props.showToast({
        message:
          'Your video message should be a link to a single Youtube or Vimeo video.',
        type: 'error',
      });
    }

    // Make sure there is at least one Image
    if (
      images.filter((image) => image !== null && typeof image !== 'undefined')
        .length === 0
    ) {
      return this.props.showToast({
        message: 'Please add at least one image.',
        type: 'error',
      });
    }

    // Make sure Bandcamp is just the username not the url
    if (artistBandcamp && !/^[0-9a-z-]+$/gi.test(artistBandcamp)) {
      return this.props.showToast({
        message:
          'Please check the format of your Bandcamp username. For example, if your url is bandname.bandcamp.com then your username is bandname )',
        type: 'error',
      });
    }

    // Make sure @ symbol isn't apart of Instagram or Twitter
    if (/[@:/]/gi.test(artistTwitter) || /[@:/]/gi.test(artistInstagram)) {
      return this.props.showToast({
        message: 'Please check the format of your social handles.',
        type: 'error',
      });
    }

    // Make sure Youtube has youtube.com in the URL
    if (artistYoutube && !/(youtube.com)/gi.test(artistYoutube)) {
      return this.props.showToast({
        message:
          'Please check that your YouTube URL is pointing to youtube.com',
        type: 'error',
      });
    }

    if (
      members.filter(
        (member) =>
          member.email &&
          member.email.length &&
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            member.email,
          ) &&
          member.firstName &&
          member.firstName.length,
      ).length !== members.length
    ) {
      return this.props.showToast({
        message: 'Please check required fields for members.',
        type: 'error',
      });
    }

    // prepare artist images
    const newImages = imageUploads
      .filter((image) => image !== null && typeof image !== 'undefined')
      .map(({ public_id, url, order }) => ({ public_id, url, order }));

    console.log('newImages', newImages);

    const deletedImages = images.filter(
      (image) =>
        image !== null && typeof image !== 'undefined' && image._destroy,
    );
    console.log('deletedImages', deletedImages);

    // create page
    this.setState({
      loading: true,
    });
    if (!this.props.editMode) {
      const { data } = await apiAxios({
        method: 'post',
        url: '/artist_pages.json',
        data: {
          artist_page: {
            name: artistName,
            bio: artistMessage,
            location: artistLocation,
            accent_color: artistColor,
            slug: artistSlug.toLowerCase(),
            video_url: artistVideo,
            instagram_handle: artistInstagram,
            twitter_handle: artistTwitter,
            youtube_handle: artistYoutube,
            bandcamp_handle: artistBandcamp,
            external: artistExternal,
            verb_plural: artistVerb !== 'is',
            hide_members: hideMembers,
            images: newImages,
          },
          members,
        },
      });

      this.setState({
        loading: false,
      });

      if (data.status && data.status === 'error') {
        this.props.showToast({
          message: data.message,
          type: 'error',
        });
      } else if (data.status && data.status === 'ok') {
        this.props.showToast({
          message: data.message,
          type: 'success',
        });
        window.location.href = `/artist/${artistSlug}`;
      }
    } else {
      const { data } = await apiAxios({
        method: 'put',
        url: `/artist_pages/${this.props.artist?.id}.json`,
        data: {
          artist_page: {
            bio: artistMessage,
            location: artistLocation,
            accent_color: artistColor,
            video_url: artistVideo,
            instagram_handle: artistInstagram,
            twitter_handle: artistTwitter,
            youtube_handle: artistYoutube,
            bandcamp_handle: artistBandcamp,
            external: artistExternal,
            verb_plural: artistVerb !== 'is',
            hide_members: hideMembers,
            images: deletedImages.concat(newImages),
          },
          members,
        },
      });

      this.setState({
        loading: false,
      });

      if (data.status && data.status === 'error') {
        this.props.showToast({
          message: data.message,
          type: 'error',
        });
      } else if (data.status && data.status === 'ok') {
        this.props.showToast({
          message: data.message,
          type: 'success',
        });
        window.location.href = `/artist/${artistSlug}`;
      }
    }
  };

  renderSupporterCount = () => {
    const hasSupporters = this.props.artist?.supporters?.length > 0;
    if (!hasSupporters) {
      return;
    }

    return (
      <p>
        You have {this.props.artist.supporters.length} supporter(s) currently.
        When you delete your page, subscriptions to your page will also be
        deleted.
      </p>
    );
  };

  renderDeleteModal = () => {
    return (
      <Modal
        open={this.state.showDeleteModal}
        onClose={() =>
          this.setState({ showDeleteModal: !this.state.showDeleteModal })
        }
      >
        <div className="delete-post-modal__container">
          <img className="tear tear__topper" src={tear} alt="" />
          <div className="delete-post-modal">
            <div className="delete-post-modal__title">
              <h4>Are you sure?</h4>
            </div>
            <p>
              Deleting your page is permanent, and any content posted will be
              deleted permanently as well.
            </p>
            {this.renderSupporterCount()}
            <div className="delete-post-modal__actions action-buttons">
              <Button
                className="cancel-button"
                onClick={() => this.setState({ showDeleteModal: false })}
              >
                Cancel
              </Button>
              <Button
                className="publish-button"
                onClick={this.deleteArtistPage}
              >
                Delete Artist Page
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  renderDeleteBtn() {
    if (!this.isShowDeleteBtn()) {
      return;
    }
    return (
      <div className="col-md-6 col-sm-12">
        <Button
          onClick={this.onDeleteBtnClicked}
          className="btn btn-ampled btn-delete"
        >
          Delete your page
        </Button>
      </div>
    );
  }

  render() {
    const {
      me: { userData },
    } = this.props;

    if (this.state.isDeletedPage) {
      return <Redirect to="/" />;
    } else if (this.state.loading) {
      return <Loading isLoading={true} />;
    } else if (userData && !userData.email_confirmed) {
      return (
        <div
          style={{
            textAlign: 'center',
            margin: '100px auto',
          }}
        >
          Please confirm your email first by clicking the link in your welcome
          email.
        </div>
      );
    }

    const showDeleteBtn = this.isShowDeleteBtn();
    const saveBtnClasses = classnames('col-sm-12', {
      'col-md-6': showDeleteBtn,
      'col-md-12': !showDeleteBtn,
    });

    return (
      <div className="create-artist">
        {this.renderDeleteModal()}
        <Modal
          open={this.state.showConfirmRemoveMember}
          onClose={() => {
            this.setState({ showConfirmRemoveMember: false });
          }}
        >
          <Card className="artist-members__card">
            <CardContent>
              <h4>Are you sure?</h4>
            </CardContent>
            <CardActions className="action-buttons">
              <Button
                className="cancel-button"
                onClick={() => {
                  this.setState({ showConfirmRemoveMember: false });
                }}
              >
                <ReactSVG className="icon" src={Close} />
              </Button>
              <Button
                className="publish-button"
                onClick={() => {
                  this.removeMember(this.state.confirmRemoveMemberIndex);
                }}
              >
                Remove Member
              </Button>
            </CardActions>
          </Card>
        </Modal>
        <MuiThemeProvider theme={theme}>
          <div
            className="create-artist__header"
            style={{ backgroundColor: this.state.randomColor }}
          >
            <div className="container">
              <h2>
                {this.props.editMode ? 'Edit' : 'Create'} Your Artist Page
              </h2>
            </div>
            <img className="create-artist__header_tear" src={tear} alt="" />
          </div>
          <div className="container">
            <div className="artist-about">
              {this.props.editMode ? (
                <div className="create-artist__copy">
                  <p>
                    Click Save Your Page at the bottom of this form to save your
                    work.
                  </p>
                </div>
              ) : (
                <div className="create-artist__copy">
                  <p>
                    <b>Double-check your artist/band name and custom link</b>,
                    as you can&#39;t change them later. (You can edit everything
                    else.)
                  </p>
                  <p>
                    Click Preview Your Page at the bottom of this form to save
                    your work.
                  </p>
                </div>
              )}
            </div>
          </div>
          <Info
            state={this.state}
            handleChange={this.handleChange}
            editMode={this.props.editMode}
          />
          <Images
            images={this.state.images}
            setImages={(images) => this.setState({ imageUploads: images })}
            showToast={this.props.showToast}
            // addImage={this.addImage}
          />
          <Color
            randomColor={this.state.randomColor}
            artistColor={this.state.artistColor}
            artistColorAlpha={this.state.artistColorAlpha}
            handleColorChange={this.handleColorChange}
          />
          <Members
            bandName={this.state.artistName}
            members={this.state.members}
            handleChange={this.updateMemberDetails}
            addMember={this.addMember}
            removeMember={this.removeMemberConfirm}
            userData={this.props.me?.userData}
            hideMembers={this.state.hideMembers}
            setHideMembers={(val) => this.setState({ hideMembers: val })}
          />
          <div className="container">
            {!this.props.editMode && (
              <div className="row justify-content-center">
                <div className="col-md-6 col-sm-10 create-artist__bottomcopy">
                  <p>
                    Your page should initially only be visible to you and any
                    other members you may add.
                  </p>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.subscribeToNewsletter}
                        onChange={this.handleCheckBoxChange}
                        name="subscribeToNewsletter"
                      />
                    }
                    label="Receive email updates from Ampled."
                  />
                </div>
              </div>
            )}
            <div className="row action-buttons">
              {/* {this.renderDeleteBtn()} */}
              <div className={`col-sm-6 center ${saveBtnClasses}`}>
                <Button onClick={this.onSubmit} className="publish-button">
                  {this.props.editMode ? 'Update your page' : 'Save your page'}
                </Button>
              </div>
            </div>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

const mapStateToProps = (state: Store) => {
  return {
    me: state.me,
  };
};

const mapDispatchToProps = (dispatch) => ({
  showToast: bindActionCreators(showToastAction, dispatch),
  deleteArtist: bindActionCreators(deleteArtistAction, dispatch),
});

const connectArtist = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateArtist);

export { connectArtist as CreateArtist };
