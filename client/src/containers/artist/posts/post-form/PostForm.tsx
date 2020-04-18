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
import { showToastAction } from '../../../../redux/toast/toast-modal';

import {
  Button,
  DialogActions,
  DialogContent,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@material-ui/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import YouTubePlayer from 'react-player/lib/players/YouTube';
import VimeoPlayer from 'react-player/lib/players/Vimeo';

import tear from '../../../../images/background_tear.png';

import { initialState as artistsInitialState } from '../../../../redux/artists/initial-state';
import { initialState as postsInitialState } from '../../../../redux/posts/initial-state';
import { Upload } from './Upload';

const mapStateToProps = (state: Store) => ({
  ...state.posts,
  ...state.artists,
});

const mapDispatchToProps = (dispatch) => {
  return {
    createPost: bindActionCreators(createPostAction, dispatch),
    editPost: bindActionCreators(editPostAction, dispatch),
    getArtist: bindActionCreators(getArtistAction, dispatch),
    showToast: bindActionCreators(showToastAction, dispatch),
  };
};

interface PostFormProps {
  close: (hasUnsavedChanges: any) => void;
  discardChanges: () => void;
  isEdit?: boolean;
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
    videoEmbedUrl: null,
    isPublic: false,
    allowDownload: false,
    isPinned: false,
    imageUrl: null,
    publicId: null,
    deleteToken: undefined,
    hasUnsavedChanges: false,
    loadingImage: false,
    savingPost: false,
    showVideoEmbedField: false,
  };

  constructor(props) {
    super(props);
    if (props.post) {
      this.state = {
        ...this.initialState,
        ...props.post,
        audioFile: props.post.audio_file,
        imageUrl: props.post.image_url,
        videoEmbedUrl: props.post.video_embed_url,
        isPublic: !props.post.is_private,
        showVideoEmbedField: props.post.has_video_embed,
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

    const {
      title,
      body,
      audioFile,
      imageUrl,
      videoEmbedUrl,
      isPublic,
      allowDownload,
      isPinned,
    } = this.state;
    const { isEdit } = this.props;

    const post = {
      title,
      body,
      audio_file: audioFile,
      image_url: imageUrl,
      video_embed_url: videoEmbedUrl,
      is_private: !isPublic,
      is_pinned: isPinned,
      allow_download: allowDownload,
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

    if (
      ['image/gif', 'image/jpeg', 'image/png'].indexOf(imageFile.type) === -1
    ) {
      this.props.showToast({
        message: 'Please select an image file.',
        type: 'error',
      });

      return;
    }

    this.setState({ loadingImage: true });

    if (this.state.deleteToken) {
      this.removeImage();
    }

    const cloudinaryResponse = await uploadFileToCloudinary(imageFile);

    if (cloudinaryResponse) {
      const fileName = imageFile.name;

      this.setState({
        imageUrl: cloudinaryResponse.secure_url,
        deleteToken: cloudinaryResponse.delete_token,
        publicId: cloudinaryResponse.public_id,
        hasUnsavedChanges: true,
        loadingImage: false,
        imageName: fileName,
      });
    } else {
      this.setState({
        loadingImage: false,
      });

      this.props.showToast({
        message:
          'Something went wrong with your image upload. Please try again.',
        type: 'error',
      });
    }
  };

  removeImage = () => {
    deleteFileFromCloudinary(this.state.deleteToken);
    this.setState({
      imageUrl: null,
      deleteToken: undefined,
      publicId: null,
      hasUnsavedChanges: false,
    });
  };

  handleMakePublicChange = (event) => {
    const { artist } = this.props;
    if (artist.isStripeSetup) {
      this.setState({ isPublic: event.target.checked });
    }
  };

  handleAllowDownloadChange = (event) => {
    this.setState({ allowDownload: event.target.checked });
  };

  isSaveEnabled = () => {
    const { title, body, imageUrl, videoEmbedUrl, audioFile } = this.state;

    return (
      title &&
      title.length > 0 &&
      ((audioFile && audioFile.length > 0) ||
        (imageUrl && imageUrl.length > 0) ||
        (videoEmbedUrl && videoEmbedUrl.length > 0) ||
        (body && body.length > 0))
    );
  };

  renderUploader(): React.ReactNode {
    return (
      <div className="uploader" style={{ width: '45%' }}>
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

  renderVideoToggle = () => {
    return (
      <div className="uploader" style={{ width: '45%' }}>
        <Button
          className="btn btn-ampled image-button"
          component="span"
          onClick={() => this.setState({ showVideoEmbedField: true })}
        >
          Add Video
        </Button>
      </div>
    );
  };

  renderVideoPreview = () => {
    const { videoEmbedUrl } = this.state;

    const isYouTube =
      videoEmbedUrl &&
      videoEmbedUrl.length > 0 &&
      /(www\.)?(youtube\.com|youtu.be)\//i.test(videoEmbedUrl);
    const isVimeo =
      videoEmbedUrl &&
      videoEmbedUrl.length > 0 &&
      /(www\.)?vimeo.com\/.+/i.test(videoEmbedUrl);
    const isValidVideo = isYouTube || isVimeo;

    let VideoComponent;
    if (isVimeo) {
      VideoComponent = VimeoPlayer;
    } else if (isYouTube) {
      VideoComponent = YouTubePlayer;
    }

    if (!isValidVideo) {
      return (
        <div className="uploader">
          <span
            style={{
              fontFamily: '"Courier", Courier, monospace',
              fontSize: '0.8rem',
            }}
          >
            No supported video detected.
          </span>
        </div>
      );
    }
    return (
      <div className="uploader">
        <VideoComponent
          className="react-player"
          url={videoEmbedUrl}
          width="100%"
          height="100%"
        />
      </div>
    );
  };

  renderVideoEmbedder = () => {
    const { videoEmbedUrl } = this.state;

    return (
      <>
        <div className="uploader" style={{ display: 'block' }}>
          <TextField
            autoFocus
            name="videoEmbedUrl"
            placeholder="YouTube or Vimeo URL"
            type="text"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={videoEmbedUrl || ''}
            onChange={this.handleChange}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle video input"
                    onClick={() =>
                      this.setState({
                        showVideoEmbedField: false,
                        videoEmbedUrl: null,
                      })
                    }
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {this.renderVideoPreview()}
        </div>
      </>
    );
  };

  renderVisualUpload = () => {
    const { imageUrl, videoEmbedUrl, showVideoEmbedField } = this.state;
    return (
      <div className="post-form__image">
        <input
          style={{ display: 'none' }}
          id="image-file"
          type="file"
          aria-label="Image file"
          accept="image/*"
          onChange={this.processImage}
        />
        {!imageUrl && !videoEmbedUrl && !showVideoEmbedField && (
          <>
            {this.renderUploader()}
            {this.renderVideoToggle()}
          </>
        )}
        {!imageUrl && showVideoEmbedField && this.renderVideoEmbedder()}
        {imageUrl && this.renderPreview()}
      </div>
    );
  };

  render() {
    const { hasUnsavedChanges, title, body, audioFile } = this.state;
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
                  InputProps={{
                    endAdornment: !(title && title.length > 0) ? (
                      <InputAdornment position="end">
                        <span
                          style={{
                            color: 'rgba(0, 0, 0, 0.42)',
                            fontSize: '0.8rem',
                          }}
                        >
                          (required)
                        </span>
                      </InputAdornment>
                    ) : (
                      undefined
                    ),
                  }}
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
              {this.renderVisualUpload()}
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

                  {audioFile && audioFile.length > 0 && (
                    <div className="col-auto">
                      <label
                        className="make-public-label"
                        htmlFor="allow-download"
                      >
                        <input
                          aria-label="Allow download"
                          name="allowDownload"
                          id="allow-download"
                          type="checkbox"
                          onChange={this.handleAllowDownloadChange}
                          checked={this.state.allowDownload}
                        />
                        Allow download
                      </label>
                    </div>
                  )}
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

const PostForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostFormComponent);

export { PostForm };
