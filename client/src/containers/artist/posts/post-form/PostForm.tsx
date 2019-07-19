import './post-form.scss';

import cx from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deleteFileFromCloudinary } from 'src/api/cloudinary/delete-image';
import { uploadFileToCloudinary } from 'src/api/cloudinary/upload-image';
import { getArtistAction } from 'src/redux/artists/get-details';
import { Store } from 'src/redux/configure-store';
import { createPostAction } from 'src/redux/posts/create';

import { faSpinner, faSync, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, DialogActions, DialogContent, TextField } from '@material-ui/core';

import tear from '../../../../images/background_tear.png';

import { initialState as artistsInitialState } from '../../../../redux/artists/initial-state';
import { initialState as postsInitialState } from '../../../../redux/posts/initial-state';
import { Upload } from './Upload';

interface PostFormProps {
  close: (hasUnsavedChanges: any) => void;
  discardChanges: () => void;
}

type Dispatchers = ReturnType<typeof mapDispatchToProps>;
type Props = typeof postsInitialState & typeof artistsInitialState & Dispatchers & PostFormProps;

class PostFormComponent extends React.Component<Props, any> {
  initialState = {
    title: '',
    body: '',
    audioFile: '',
    isPublic: false,
    isPinned: false,
    imageUrl: undefined,
    deleteToken: undefined,
    hasUnsavedChanges: false,
    loadingImage: false,
    savingPost: false,
  };

  state = this.initialState;

  componentDidUpdate() {
    if (!this.props.postCreated && !this.state.savingPost) {
      return;
    }

    this.refreshArtist();
  }

  refreshArtist = () => {
    this.setState(this.initialState);
    this.props.getArtist(this.props.artist.id);
    this.props.discardChanges();
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value, hasUnsavedChanges: true });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { title, body, audioFile, imageUrl, isPublic, isPinned } = this.state;

    const post = {
      title,
      body,
      audio_file: audioFile,
      image_url: imageUrl,
      is_private: !isPublic,
      is_pinned: isPinned,
      artist_page_id: this.props.artist.id,
    };

    this.setState({ savingPost: true });
    this.props.createPost(post);
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

    this.setState({
      imageUrl: fileInfo.secure_url,
      deleteToken: fileInfo.delete_token,
      hasUnsavedChanges: true,
      loadingImage: false,
    });
  };

  removeImage = () => {
    deleteFileFromCloudinary(this.state.deleteToken);
    this.setState({ imageUrl: undefined, deleteToken: undefined, hasUnsavedChanges: false });
  };

  handleMakePublicChange = (event) => {
    this.setState({ isPublic: event.target.checked });
  };

  isSaveEnabled = () => {
    const { title, body, imageUrl, audioFile } = this.state;

    return (
      title &&
      title.length > 0 &&
      ((audioFile && audioFile.length > 0) || (imageUrl && imageUrl.length > 0) || (body && body.length > 0))
    );
  };

  renderUploader(): React.ReactNode {
    return (
      <div className="uploader">
        {this.state.loadingImage ? (
          <FontAwesomeIcon className="loading-icon" icon={faSpinner} spin />
        ) : (
          this.renderUploadButton()
        )}
      </div>
    );
  }

  renderPreview(): React.ReactNode {
    return (
      <div className="post-image">
        <img className="preview" src={this.state.imageUrl} />
        <div className="image-actions">
          <span title="Remove image" onClick={this.removeImage}>
            <FontAwesomeIcon className="action-icon" icon={faTrashAlt} />
          </span>
          <label htmlFor="image-file">
            <span title="Change image">
              <FontAwesomeIcon className="action-icon" icon={faSync} />
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

  render() {
    const { hasUnsavedChanges, title, body, imageUrl } = this.state;

    const isSaveEnabled = this.isSaveEnabled();

    return (
      <div>
        <img className="tear__topper" src={tear} />
        <div className="post-form">
          <DialogContent>
            <h3>NEW POST</h3>
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
                <Upload onComplete={this.updateAudioFile} />
              </div>
              <div className="post-form__image">
                <input
                  style={{ display: 'none' }}
                  id="image-file"
                  type="file"
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
                        name="make-public"
                        type="checkbox"
                        onChange={this.handleMakePublicChange}
                        checked={this.state.isPublic}
                      />
                      Make public
                    </label>
                  </div>
                  <div className="col-auto">
                    <label className="pin-post-label" htmlFor="pin-post">
                      <input
                        name="pin-post"
                        type="checkbox"
                        // onChange={this.state.isPinned}
                        checked={this.state.isPinned}
                      />
                      Pin post
                    </label>
                  </div>
                </div>
              </div>

              <div className="post-form__actions">
                <DialogActions className="action-buttons">
                  <Button className="cancel-button" style={{ textAlign: 'left' }} onClick={() => this.props.close(hasUnsavedChanges)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className={cx('post-button finished-button', { disabled: !isSaveEnabled })}
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
    getArtist: bindActionCreators(getArtistAction, dispatch),
  };
};

const PostForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostFormComponent);

export { PostForm };
