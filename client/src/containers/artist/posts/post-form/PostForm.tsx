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

    const { title, body, audioFile, imageUrl } = this.state;

    const post = {
      title,
      body,
      audio_file: audioFile,
      image_url: imageUrl,
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
        <Button className="image-button" variant="contained" component="span">
          Add Image
        </Button>
      </label>
    );
  }

  render() {
    const { hasUnsavedChanges, title, body, imageUrl } = this.state;

    const isSaveEnabled = this.isSaveEnabled();

    return (
      <div className="post-form">
        <DialogContent>
          <h1>NEW POST</h1>
          <form onSubmit={this.handleSubmit}>
            <Upload onComplete={this.updateAudioFile} />

            <div className="instructions">
              <p>
                Upload as MP3 audio file to provide the best audio quality. Learn more <a href="">here</a>.
              </p>
              <p>
                By uploading, you confirm that your sounds comply with our <a href="">Terms of Use</a> and you don't
                infringe anyone else's rights.
              </p>
            </div>

            <div className="post-info">
              <input
                style={{ display: 'none' }}
                id="image-file"
                type="file"
                accept="image/*"
                onChange={this.processImage}
              />

              {imageUrl ? this.renderPreview() : this.renderUploader()}

              <div className="post-description">
                <TextField
                  autoFocus
                  name="title"
                  label="Post Title"
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
                  label="Caption"
                  type="text"
                  helperText="300 character limit"
                  fullWidth
                  multiline
                  rows="3"
                  variant="outlined"
                  inputProps={{
                    maxLength: 300,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ marginTop: 20 }}
                  value={body}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <DialogActions className="action-buttons">
              <Button className="cancel-button" onClick={() => this.props.close(hasUnsavedChanges)}>
                Cancel
              </Button>
              <Button
                type="Submit"
                className={cx('post-button', { disabled: !isSaveEnabled })}
                disabled={!isSaveEnabled}
              >
                Save Post
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
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
