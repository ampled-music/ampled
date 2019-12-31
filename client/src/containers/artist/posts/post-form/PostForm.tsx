import './post-form.scss';

import cx from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deleteFileFromCloudinary } from '../../../../api/cloudinary/delete-image';
import { uploadFileToCloudinary } from '../../../../api/cloudinary/upload-image';
import { getArtistAction } from '../../../../redux/artists/get-details';
import { Store } from '../../../../redux/configure-store';
import { createPostAction } from '../../../../redux/posts/create';
import { editPostAction } from '../../../../redux/posts/edit';

import {
  Button,
  DialogActions,
  DialogContent,
  TextField,
  CircularProgress,
} from '@material-ui/core';

import tear from '../../../../images/background_tear.png';

import { initialState as artistsInitialState } from '../../../../redux/artists/initial-state';
import { initialState as postsInitialState } from '../../../../redux/posts/initial-state';
import { Upload } from './Upload';

interface PostFormProps {
  close: (hasUnsavedChanges: any) => void;
  discardChanges: () => void;
  isEdit?: Boolean;
  post?: any;
}

type Dispatchers = ReturnType<typeof mapDispatchToProps>;
type Props = typeof postsInitialState &
  typeof artistsInitialState &
  Dispatchers &
  PostFormProps;

class PostFormComponent extends React.Component<Props, any> {
  initialState = {
    title: '',
    body: '',
    audioFile: '',
    imageName: '',
    isPublic: false,
    isPinned: false,
    imageUrl: null,
    deleteToken: undefined,
    hasUnsavedChanges: false,
    loadingImage: false,
    savingPost: false,
  };

  constructor(props) {
    super(props);
    if (props.post) {
      this.state = {
        ...this.initialState,
        ...props.post,
        audioFile: props.post.audio_file,
        imageUrl: props.post.image_url,
        isPublic: !props.post.is_private,
      };
    } else {
      this.state = this.initialState;
    }

    if (props.artist && !props.artist.isStripeSetup) {
      this.state = {
        ...this.state,
        isPublic: true,
      };
    }
  }

  componentDidUpdate() {
    if (!this.props.postCreated && !this.state.savingPost) {
      return;
    }

    this.refreshArtist();
  }

  refreshArtist = () => {
    // this.setState(this.initialState);
    window.setTimeout(() => this.props.getArtist(this.props.artist.id), 1000);
    this.props.discardChanges();
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value, hasUnsavedChanges: true });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { title, body, audioFile, imageUrl, isPublic, isPinned } = this.state;
    const { isEdit } = this.props;

    const post = {
      title,
      body,
      audio_file: audioFile,
      image_url: imageUrl,
      is_private: !isPublic,
      is_pinned: isPinned,
      artist_page_id: this.props.artist.id,
      id: this.state.id,
    };

    this.setState({ savingPost: true });
    isEdit ? this.props.editPost(post) : this.props.createPost(post);
  };

  updateAudioFile = (audioFile) => {
    this.setState({ audioFile, hasUnsavedChanges: true });
  };

  processImage = async (e) => {
    const imageFile = e.target.files[0];

    if (!imageFile) {
      return;
    }

    this.setState({ loadingImage: true });

    if (this.state.deleteToken) {
      this.removeImage();
    }

    const fileInfo = await uploadFileToCloudinary(imageFile);
    const fileName = imageFile.name;

    this.setState({
      imageUrl: fileInfo.secure_url,
      deleteToken: fileInfo.delete_token,
      hasUnsavedChanges: true,
      loadingImage: false,
      imageName: fileName,
    });
  };

  removeImage = () => {
    deleteFileFromCloudinary(this.state.deleteToken);
    this.setState({
      imageUrl: null,
      deleteToken: undefined,
      hasUnsavedChanges: false,
    });
  };

  handleMakePublicChange = (event) => {
    const { artist } = this.props;
    if (artist.isStripeSetup) {
      this.setState({ isPublic: event.target.checked });
    }
  };

  isSaveEnabled = () => {
    const { title, body, imageUrl, audioFile } = this.state;

    return (
      title &&
      title.length > 0 &&
      ((audioFile && audioFile.length > 0) ||
        (imageUrl && imageUrl.length > 0) ||
        (body && body.length > 0))
    );
  };

  renderUploader(): React.ReactNode {
    return (
      <div className="uploader">
        {this.state.loadingImage ? (
          <CircularProgress />
        ) : (
          this.renderUploadButton()
        )}
      </div>
    );
  }

  renderPreview(): React.ReactNode {
    return (
      <div className="post-image">
        <div className="preview">
          <img
            className="preview__image"
            src={this.state.imageUrl}
            alt="Preview"
          />
          <span className="preview__name">{this.state.imageName}</span>
        </div>
        <div className="file-actions">
          <span
            className="remove-button"
            title="Remove image"
            onClick={this.removeImage}
          >
            Remove
          </span>
          <label htmlFor="image-file">
            <span className="replace-button" title="Change image">
              Replace
            </span>
          </label>
        </div>
      </div>
    );
  }

  renderUploadButton(): React.ReactNode {
    return (
      <label htmlFor="image-file">
        <Button className="btn btn-ampled image-button" component="span">
          Add Image
        </Button>
      </label>
    );
  }

  renderExistingAudio(): React.ReactNode {
    return (
      <div className="upload">
        <div className="progress-container">
          <div className="progress-info">
            <div className="progress-info__name">
              <div className="progress-info__name_mp3">Mp3</div>
              <div className="progress-info__name_song">
                {this.props.post.audio_file}
              </div>
            </div>

            <div className="file-actions">
              <span
                className="remove-button"
                title="Remove audio"
                onClick={() => this.updateAudioFile(null)}
              >
                Remove
              </span>
              {/* <label htmlFor="audio-file">
                <span className="replace-button" title="Change audio">
                  Replace
                </span>
              </label> */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { hasUnsavedChanges, title, body, imageUrl } = this.state;
    const { isEdit } = this.props;
    const {
      artist: { isStripeSetup },
    } = this.props;

    const isSaveEnabled = this.isSaveEnabled();

    return (
      <div className="post-form__container">
        <img className="tear tear__topper" src={tear} alt="" />
        <div className="post-form">
          <DialogContent>
            <h4>{isEdit ? 'EDIT POST' : 'NEW POST'}</h4>
            <form onSubmit={this.handleSubmit}>
              <div className="post-form__description">
                <TextField
                  autoFocus
                  name="title"
                  placeholder="Post title"
                  type="text"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={title}
                  onChange={this.handleChange}
                  required
                />
                <TextField
                  name="body"
                  type="text"
                  placeholder="Text (3000 character limit)"
                  fullWidth
                  multiline
                  rows="10"
                  variant="outlined"
                  inputProps={{
                    maxLength: 3000,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ marginTop: 20 }}
                  value={body}
                  onChange={this.handleChange}
                />
              </div>
              <div className="post-form__audio">
                {isEdit &&
                this.props.post &&
                this.props.post.audio_file &&
                this.state.audioFile &&
                this.state.audio_file &&
                this.state.audioFile === this.state.audio_file ? (
                  this.renderExistingAudio()
                ) : (
                  <Upload onComplete={this.updateAudioFile} />
                )}
              </div>
              <div className="post-form__image">
                <input
                  style={{ display: 'none' }}
                  id="image-file"
                  type="file"
                  aria-label="Image file"
                  accept="image/*"
                  onChange={this.processImage}
                />

                {imageUrl ? this.renderPreview() : this.renderUploader()}
              </div>

              <div className="post-form__checkboxes">
                <div className="row justify-content-between">
                  <div className="col-auto">
                    <label className="make-public-label" htmlFor="make-public">
                      <input
                        aria-label="Make public"
                        name="make-public"
                        id="make-public"
                        type="checkbox"
                        onChange={this.handleMakePublicChange}
                        checked={this.state.isPublic}
                      />
                      Make public
                    </label>
                  </div>
                  <div className="col-auto">
                    {/* <label className="pin-post-label" htmlFor="pin-post">
                      <input
                        name="pin-post"
                        id="pin-post"
                        type="checkbox"
                        aria-label="Pin post" 
                      // onChange={this.state.isPinned}
                      // checked={this.state.isPinned}
                      />
                      Pin post
                    </label> */}
                  </div>
                </div>
                {!isStripeSetup && (
                  <small>
                    <br />
                    You need to set up your payout destination to make private
                    posts.
                  </small>
                )}
              </div>

              <div className="post-form__actions">
                <DialogActions className="action-buttons">
                  <Button
                    className="cancel-button"
                    style={{ textAlign: 'left' }}
                    onClick={() => this.props.close(hasUnsavedChanges)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className={cx('post-button finished-button', {
                      disabled: !isSaveEnabled,
                    })}
                    disabled={!isSaveEnabled}
                  >
                    Finished
                  </Button>
                </DialogActions>
              </div>
            </form>
          </DialogContent>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: Store) => ({
  ...state.posts,
  ...state.artists,
});

const mapDispatchToProps = (dispatch) => {
  return {
    createPost: bindActionCreators(createPostAction, dispatch),
    editPost: bindActionCreators(editPostAction, dispatch),
    getArtist: bindActionCreators(getArtistAction, dispatch),
  };
};

const PostForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostFormComponent);

export { PostForm };
