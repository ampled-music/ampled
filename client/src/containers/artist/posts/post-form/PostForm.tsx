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

import { initialState as postsInitialState } from '../../../../redux/posts/initial-state';
import { Upload } from './Upload';

interface PostFormProps {
  artistId: number;
  close: (hasUnsavedChanges: boolean) => React.MouseEventHandler;
  discardChanges: () => void;
}

type Dispatchers = ReturnType<typeof mapDispatchToProps>;
type Props = typeof postsInitialState & Dispatchers & PostFormProps;

class PostFormComponent extends React.Component<Props, any> {
  state = {
    title: '',
    body: '',
    audioFile: '',
    imageUrl: undefined,
    deleteToken: undefined,
    artist_page_id: this.props.artistId,
    hasUnsavedChanges: false,
    loadingImage: false,
    savingPost: false,
  };

  componentDidUpdate() {
    if (!this.props.postCreated && !this.state.savingPost) {
      return;
    }

    this.refreshArtist();
  }

  refreshArtist = () => {
    this.clearForm();
    this.props.getArtist(this.props.artistId);
    this.props.discardChanges();
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value, hasUnsavedChanges: true });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { title, body, audioFile, imageUrl, artist_page_id } = this.state;

    const post = {
      title,
      body,
      audio_file: audioFile,
      image_url: imageUrl,
      artist_page_id,
    };

    this.setState({ savingPost: true });
    this.props.createPost(post);
  };

  clearForm() {
    this.setState({
      title: '',
      body: '',
      audioFile: '',
      imageUrl: undefined,
      deleteToken: undefined,
      hasUnsavedChanges: false,
      loadingImage: false,
      savingPost: false,
    });
  }

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
          Update Image
        </Button>
      </label>
    );
  }

  render() {
    const { hasUnsavedChanges, title, body, imageUrl, audioFile } = this.state;

    return (
      <div className="post-form">
        <DialogContent>
          <h1>AUDIO POST</h1>
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
                className={cx('post-button', { disabled: audioFile.length === 0 })}
                disabled={audioFile.length === 0}
              >
                Post Audio
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
