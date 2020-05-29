import './post-form.scss';
// Needed to get some standard styles working in the rich editor.
import 'draft-js/dist/Draft.css';

import cx from 'classnames';
import * as Sentry from '@sentry/browser';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deleteFileFromCloudinary } from '../../../../api/cloudinary/delete-image';
import { uploadFileToCloudinary } from '../../../../api/cloudinary/upload-image';
import { getArtistAction } from '../../../../redux/artists/get-details';
import { Store } from '../../../../redux/configure-store';
import { createPostAction } from '../../../../redux/posts/create';
import { editPostAction } from '../../../../redux/posts/edit';
import { Post } from '../../../../api/post/post';
import { removeImageFromPost } from '../../../../api/post/edit-post';
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
import { Editor, EditorState, RichUtils } from 'draft-js';
import { convertFromHTML, convertToHTML } from 'draft-convert';
import DOMPurify from 'dompurify';

import tear from '../../../../images/background_tear.png';

import { initialState as artistsInitialState } from '../../../../redux/artists/initial-state';
import { initialState as postsInitialState } from '../../../../redux/posts/initial-state';
import { Upload } from './Upload';
import { Loading } from '../../../shared/loading/Loading';

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
  post?: Post
}

type Dispatchers = ReturnType<typeof mapDispatchToProps>;
type Props = typeof postsInitialState &
  typeof artistsInitialState &
  Dispatchers &
  PostFormProps;

interface RichEditorProps {
  initialTextAsHTML?: string;
  callback?: Function;
}

class RichEditor extends React.Component<RichEditorProps> {
  state = {
    editorState: EditorState.createEmpty(),
    focused: false,
    showHyperlinkHelp: false,
  };

  editor: any;

  constructor(props) {
    super(props);
    if (props.initialTextAsHTML) {
      this.state = {
        ...this.state,
        editorState: EditorState.createWithContent(
          convertFromHTML(props.initialTextAsHTML),
        ),
      };
    }
  }

  handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  onChange = (editorState) => {
    this.setState({ editorState });
    this.props.callback &&
      this.props.callback(convertToHTML(editorState.getCurrentContent()));
  };

  setEditor = (editor) => {
    this.editor = editor;
  };

  focusEditor = () => {
    if (this.editor) {
      this.setHyperlinkHelp(false);
      this.editor.focus();
    }
  };

  setHyperlinkHelp = (value) => this.setState({ showHyperlinkHelp: value });

  toggleHyperlinkHelp = () =>
    this.setHyperlinkHelp(!this.state.showHyperlinkHelp);

  onBulletsClick = (e) => {
    e.preventDefault();
    this.onChange(
      RichUtils.toggleBlockType(this.state.editorState, 'unordered-list-item'),
    );
  };

  onBoldClick = (e) => {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  };

  onItalicClick = (e) => {
    e.preventDefault();
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'),
    );
  };

  hasInlineStyle = (style) =>
    this.state.editorState.getCurrentInlineStyle().has(style);

  hasBlockStyle = (style) =>
    style ===
    this.state.editorState
      .getCurrentContent()
      .getBlockForKey(this.state.editorState.getSelection().getStartKey())
      .getType();

  render() {
    return (
      <div
        className="MuiFormControl-root MuiTextField-root MuiFormControl-fullWidth rich-editor-container"
        style={{ marginTop: '20px' }}
      >
        <div className="rich-controls">
          <span
            title="Bold"
            role="button"
            style={{ fontWeight: 'bolder' }}
            onMouseDown={this.onBoldClick}
            className={this.hasInlineStyle('BOLD') ? 'active' : 'inactive'}
          >
            b
          </span>
          <span
            title="Italic"
            role="button"
            style={{ fontStyle: 'italic' }}
            onMouseDown={this.onItalicClick}
            className={this.hasInlineStyle('ITALIC') ? 'active' : 'inactive'}
          >
            i
          </span>
          <span
            title="Bullets"
            role="button"
            style={{}}
            onMouseDown={this.onBulletsClick}
            className={
              this.hasBlockStyle('unordered-list-item') ? 'active' : 'inactive'
            }
          >
            &#x2022;
          </span>
          <span className="helper-text">
            Hyperlinks enabled{' '}
            <span
              style={{
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              onClick={this.toggleHyperlinkHelp}
              onMouseOver={() => this.setHyperlinkHelp(true)}
              onMouseOut={() => this.setHyperlinkHelp(false)}
            >
              [?]
            </span>
            {this.state.showHyperlinkHelp ? (
              <div className="additional">
                Any URLs you include in your post will automatically be made
                clickable when the post is published.
              </div>
            ) : (
              ''
            )}
          </span>
        </div>
        <div
          className={`MuiInputBase-root MuiOutlinedInput-root MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-multiline MuiOutlinedInput-multiline rich-editor${
            this.state.focused ? ' focused' : ''
          }`}
          onClick={this.focusEditor}
        >
          <Editor
            placeholder="Text (3000 character limit)"
            textAlignment="left"
            ref={this.setEditor}
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onFocus={() => {
              this.setState({ focused: true });
            }}
            onBlur={() => {
              this.setState({ focused: false });
            }}
          />
        </div>
      </div>
    );
  }
}

export default class PostFormComponent extends React.Component<Props, any> {
  initialState = {
    title: '',
    body: '',
    audioUploads: [],
    imageName: '',
    videoEmbedUrl: null,
    isPublic: false,
    allowDownload: false,
    isPinned: false,
    images: [],
    deletedImages: [],
    publicId: null,
    deleteToken: undefined,
    hasUnsavedChanges: false,
    loadingImage: false,
    savingPost: false,
    showVideoEmbedField: false,
  };

  editor: any;

  constructor(props) {
    super(props);
    if (props.post) {
      this.state = {
        ...this.initialState,
        ...props.post,
        audioUploads: props.post.audio_uploads,
        images: props.post.images,
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

  componentDidUpdate(prevProps) {
    // When update or create is complete, refetch artist / post data
    if (this.state.savingPost && prevProps.creatingPost && !this.props.creatingPost) {
      // TODO (Optimization/609):
      //    * instead of waiting for server response to show card, lazy load the new/updated card
      //    * instead of making a separate GET request to load the new data, have the PUT or POST request return the data
      this.props.getArtist(this.props.artist.id);
      this.props.discardChanges();
    }
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value, hasUnsavedChanges: true });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const {
      title,
      body,
      audioUploads,
      images,
      videoEmbedUrl,
      isPublic,
      allowDownload,
      isPinned,
      deletedImages,
    } = this.state;
    const { isEdit } = this.props;

    const post = {
      title,
      body,
      audio_uploads: audioUploads,
      images: images,
      video_embed_url: videoEmbedUrl,
      is_private: !isPublic,
      is_pinned: isPinned,
      allow_download: allowDownload,
      artist_page_id: this.props.artist.id,
      id: this.state.id,
    };

    this.setState({ savingPost: true });
    if (deletedImages && deletedImages.length > 0) {
      for (const deleteImage of deletedImages) {
        await this.removeImageFromBackendAndCloudinary(deleteImage);
      }
    }

    if (isEdit) {
      const currentPublicIds = post.audio_uploads.map((au) => au.public_id);
      const removedUploads = this.props.post.audio_uploads.filter(
        (au) => !currentPublicIds.includes(au.public_id),
      );

      removedUploads.forEach((ru) => {
        post.audio_uploads.push({
          ...ru,
          _destroy: true,
        });
      });

      this.props.editPost(post);
    } else {
      this.props.createPost(post);
    }
  };

  setAudioUpload = (publicId, fileName) => {
    this.setState({
      audioUploads: publicId ? [{ public_id: publicId, name: fileName }] : [],
      hasUnsavedChanges: true,
    });
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

    this.removeImage();

    const cloudinaryResponse = await uploadFileToCloudinary(imageFile);

    if (cloudinaryResponse) {
      this.setState(state => {
        const newImageList = state.images.concat({
            url: cloudinaryResponse.secure_url,
            public_id: cloudinaryResponse.public_id,
        })
        return {
          images: newImageList,
          deleteToken: cloudinaryResponse.delete_token,
          hasUnsavedChanges: true,
          loadingImage: false,
          imageName: imageFile.name,
        }
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

  removeImageFromBackendAndCloudinary = async ({ id, deleteToken }) => {
    if (deleteToken) {
      // TODO: Sometimes we want to delete an image but there is no longer a delete token.
      //       Figure this out, perhaps as part of a broader "deleting images" cleanup.
      try {
        await deleteFileFromCloudinary(deleteToken);
      } catch (e) {
        Sentry.captureException(e);
      }
    }
    if (id) {
      await removeImageFromPost(this.state.id, id);
    }
  };

  // For now we are assuming at most one image per Post.
  removeImage = () => {
    // If we have an already-saved post and an already-saved image, queue it for backend deletion.
    let deletedImages = [];
    if (
      this.state.id &&
      this.state.images.length > 0 &&
      this.state.images[0].id
    ) {
      deletedImages = [
        { id: this.state.images[0].id, deleteToken: this.state.deleteToken },
      ];
    }

    this.setState({
      images: [],
      deletedImages,
      deleteToken: undefined,
      hasUnsavedChanges: true,
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
    const { title, body, images, videoEmbedUrl, audioUploads } = this.state;

    return (
      title &&
      title.length > 0 &&
      ((audioUploads && 
        audioUploads.length > 0 &&
        audioUploads[0].public_id.length > 0) ||
        (images && images.length > 0) ||
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
            src={this.state.images[0].url}
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
    const audioUpload = this.props.post.audio_uploads[0];
    return (
      <div className="upload">
        <div className="progress-container">
          <div className="progress-info">
            <div className="progress-info__name">
              <div className="progress-info__name_mp3">Mp3</div>
              <div className="progress-info__name_song">
                {audioUpload.public_id}
              </div>
            </div>

            <div className="file-actions">
              <span
                className="remove-button"
                title="Remove audio"
                onClick={() => this.setAudioUpload(null, null)}
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
    const isValidVideo = /(youtube.com\/watch\?|youtu.be\/|vimeo.com\/\d+)/gi.test(
      videoEmbedUrl,
    );

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
    const { images, videoEmbedUrl, showVideoEmbedField } = this.state;
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
        {!images.length && !videoEmbedUrl && !showVideoEmbedField ? (
          <>
            {this.renderUploader()}
            {this.renderVideoToggle()}
          </>
        ) : (
          ''
        )}
        {!images.length && showVideoEmbedField
          ? this.renderVideoEmbedder()
          : ''}
        {images.length > 0 ? this.renderPreview() : ''}
      </div>
    );
  };

  render() {
    const { hasUnsavedChanges, title, body, audioUploads, savingPost } = this.state;
    const { isEdit } = this.props;
    const {
      artist: { isStripeSetup },
    } = this.props;

    const isSaveEnabled = this.isSaveEnabled();

    if (savingPost) return <Loading artistLoading={true}/>

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
                  onFocus={() =>
                    this.editor && this.editor.setHyperlinkHelp(false)
                  }
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
                <RichEditor
                  ref={(editor) => (this.editor = editor)}
                  initialTextAsHTML={body}
                  callback={(body) =>
                    this.setState({
                      body: DOMPurify.sanitize(body, {
                        ALLOWED_TAGS: [
                          'p',
                          'em',
                          'strong',
                          'br',
                          'ul',
                          'ol',
                          'li',
                        ],
                      }),
                    })
                  }
                />
              </div>
              <div className="post-form__audio">
                {isEdit &&
                this.props.post &&
                this.props.post.audio_uploads.length > 0 &&
                this.state.audioUploads.length > 0 &&
                this.state.audio_uploads[0].id &&
                this.state.audioUploads[0].id ===
                  this.state.audio_uploads[0].id ? (
                  this.renderExistingAudio()
                ) : (
                  <Upload 
                    onComplete={this.setAudioUpload} 
                    onRemove={() => this.setAudioUpload(null, null)}
                  />
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

                  {audioUploads.length > 0 && (
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
