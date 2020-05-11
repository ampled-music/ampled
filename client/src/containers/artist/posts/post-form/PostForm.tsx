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
import { Image, Transformation } from 'cloudinary-react';

import {
  Button,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import YouTubePlayer from 'react-player/lib/players/YouTube';
import VimeoPlayer from 'react-player/lib/players/Vimeo';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { convertFromHTML, convertToHTML } from 'draft-convert';
import DOMPurify from 'dompurify';

import TextIcon from '../../../../images/icons/Icon_Text.svg';
import AudioIcon from '../../../../images/icons/Icon_Audio.png';
import LinkIcon from '../../../../images/icons/Icon_Link_1.png';
import Link2Icon from '../../../../images/icons/Icon_Link_2.png';
import PhotoIcon from '../../../../images/icons/Icon_Photo.png';
import VideoIcon from '../../../../images/icons/Icon_Video.png';

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
  post?: Post;
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
      <div className="post-form__description">
        <div className="rich-editor-container">
          <div
            className={`MuiInputBase-root MuiOutlinedInput-root MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-multiline MuiOutlinedInput-multiline rich-editor${
              this.state.focused ? ' focused' : ''
            }`}
            onClick={this.focusEditor}
          >
            <Editor
              placeholder="Body Text"
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
              onMouseDown={this.onBulletsClick}
              className={
                this.hasBlockStyle('unordered-list-item')
                  ? 'active'
                  : 'inactive'
              }
            >
              &#x2022;
            </span>
          </div>
        </div>
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
    );
  }
}

class PostFormComponent extends React.Component<Props, any> {
  initialState = {
    title: '',
    body: '',
    link: '',
    audioFile: '',
    imageName: '',
    videoEmbedUrl: '',
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
    activePostType: 'Text',
    showAudio: false,
    showVideo: false,
    showImage: false,
    showLink: false,
  };

  editor: any;

  constructor(props) {
    super(props);
    if (props.post) {
      this.state = {
        ...this.initialState,
        ...props.post,
        audioFile: props.post.audio_file,
        images: props.post.images,
        videoEmbedUrl: props.post.video_embed_url,
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

  handleSubmit = async (event) => {
    event.preventDefault();

    const {
      title,
      body,
      link,
      audioFile,
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
      link,
      audio_file: audioFile,
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

    this.removeImage();

    const cloudinaryResponse = await uploadFileToCloudinary(imageFile);

    if (cloudinaryResponse) {
      this.setState((state) => {
        const newImageList = state.images.concat({
          url: cloudinaryResponse.secure_url,
          public_id: cloudinaryResponse.public_id,
        });
        return {
          images: newImageList,
          deleteToken: cloudinaryResponse.delete_token,
          hasUnsavedChanges: true,
          loadingImage: false,
          imageName: imageFile.name,
        };
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
    const { title, body, images, videoEmbedUrl, audioFile } = this.state;

    return (
      title &&
      title.length > 0 &&
      ((audioFile && audioFile.length > 0) ||
        (images && images.length > 0) ||
        (videoEmbedUrl && videoEmbedUrl.length > 0) ||
        (body && body.length > 0))
    );
  };

  renderButtons = () => {
    return (
      <div className="post-form__controls">
        <Button
          className={cx('btn', {
            active: this.state.activePostType === 'Text',
          })}
          onClick={() =>
            this.setState({
              activePostType: 'Text',
              showAudio: false,
              showVideo: false,
              showImage: false,
              showLink: false,
            })
          }
        >
          <img src={TextIcon} height={50} width={50} />
          Text
        </Button>
        <Button
          className={cx('btn', {
            active: this.state.activePostType === 'Audio',
          })}
          onClick={() =>
            this.setState({
              activePostType: 'Audio',
              showAudio: true,
              showVideo: false,
              showImage: true,
              showLink: false,
            })
          }
        >
          <img src={AudioIcon} height={50} width={50} />
          Audio
        </Button>
        <Button
          className={cx('btn', {
            active: this.state.activePostType === 'Video',
          })}
          onClick={() =>
            this.setState({
              activePostType: 'Video',
              showAudio: false,
              showVideo: true,
              showImage: false,
              showLink: false,
            })
          }
        >
          <img src={VideoIcon} height={50} width={50} />
          Video
        </Button>
        <Button
          className={cx('btn', {
            active: this.state.activePostType === 'Photo',
          })}
          onClick={() =>
            this.setState({
              activePostType: 'Photo',
              showAudio: false,
              showVideo: false,
              showImage: true,
              showLink: false,
            })
          }
        >
          <img src={PhotoIcon} height={50} width={50} />
          Photo
        </Button>
        <Button
          className={cx('btn', {
            active: this.state.activePostType === 'Link',
          })}
          onClick={() =>
            this.setState({
              activePostType: 'Link',
              showAudio: false,
              showVideo: false,
              showImage: false,
              showLink: true,
            })
          }
        >
          <img src={Link2Icon} height={50} width={50} />
          Link
        </Button>
      </div>
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

  renderImagePreview(): React.ReactNode {
    console.log(this.state.images[0]);
    return (
      <div className="uploader">
        <Image
          className="preview__image"
          key={this.state.images[0].name}
          publicId={this.state.images[0].public_id}
          alt={this.state.images[0].name}
        >
          <Transformation
            crop="fill"
            width={500}
            height={150}
            responsive_placeholder="blank"
          />
        </Image>
        <IconButton
          aria-label="Cancel image input"
          className="cancel-button"
          title="Remove image"
          onClick={this.removeImage}
          size="small"
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </div>
    );
  }

  renderUploadButton(): React.ReactNode {
    return (
      <div className="post-form__image_upload">
        <input
          id="image-file"
          type="file"
          aria-label="Image file"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={this.processImage}
        />
        <label htmlFor="image-file">
          <Button className="btn" component="span">
            <img className="btn__icon" src={PhotoIcon} height={25} width={25} />
            Add Photo
          </Button>
        </label>
      </div>
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
            </div>
          </div>
        </div>
      </div>
    );
  }

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

    if (isValidVideo) {
      return (
        <div className="uploader">
          <VideoComponent
            className="react-player"
            url={videoEmbedUrl}
            width="100%"
            height="100%"
          />
          <IconButton
            aria-label="Cancel video input"
            className="cancel-button"
            onClick={() =>
              this.setState({
                videoEmbedUrl: '',
              })
            }
            size="small"
          >
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </div>
      );
    } else if (!isValidVideo) {
      return <div className="helper-text">No supported video detected.</div>;
    }
  };

  renderVideoEmbedder = () => {
    const { videoEmbedUrl } = this.state;

    return (
      <div className="post-form__video">
        <TextField
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
            endAdornment: !(videoEmbedUrl && videoEmbedUrl.length > 0) ? (
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
        {videoEmbedUrl.length > 0 && this.renderVideoPreview()}
      </div>
    );
  };

  renderImageUpload = () => {
    const { images } = this.state;
    return (
      <div className="post-form__image">
        {!images.length && this.renderUploader()}
        {images.length > 0 ? this.renderImagePreview() : ''}
      </div>
    );
  };

  renderTitle = () => {
    const { title } = this.state;
    return (
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
        onFocus={() => this.editor && this.editor.setHyperlinkHelp(false)}
        onChange={this.handleChange}
        className="post-form__title"
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
    );
  };

  renderDescription = () => {
    const { body } = this.state;
    return (
      <RichEditor
        ref={(editor) => (this.editor = editor)}
        initialTextAsHTML={body}
        callback={(body) =>
          this.setState({
            body: DOMPurify.sanitize(body, {
              ALLOWED_TAGS: ['p', 'em', 'strong', 'br', 'ul', 'ol', 'li'],
            }),
          })
        }
      />
    );
  };

  renderAudio = () => {
    const { audioFile } = this.state;
    const {
      artist: { isStripeSetup },
    } = this.props;
    return (
      <div>
        <Upload onComplete={this.updateAudioFile} />

        <div className="post-form__audio_allow-checkbox">
          {audioFile && audioFile.length > 0 && (
            <FormControlLabel
              className="alow-download-label"
              control={
                <Checkbox
                  onChange={this.handleAllowDownloadChange}
                  checked={this.state.allowDownload}
                  color="default"
                />
              }
              label="Allow Download"
            />
          )}
        </div>

        {!isStripeSetup && (
          <small>
            You need to set up your payout destination to make private posts.
          </small>
        )}
      </div>
    );
  };

  renderLink = () => {
    const { link } = this.state;
    return (
      <TextField
        name="link"
        placeholder="Type or Paste a URL"
        type="text"
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
        value={link}
        onFocus={() => this.editor && this.editor.setHyperlinkHelp(false)}
        onChange={this.handleChange}
        required
        InputProps={{
          endAdornment: !(link && link.length > 0) ? (
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
    );
  };

  render() {
    const { hasUnsavedChanges } = this.state;
    const { isEdit } = this.props;

    const isSaveEnabled = this.isSaveEnabled();

    return (
      <div className="post-form">
        <h4>{isEdit ? 'Edit Post' : 'Create a new post'}</h4>
        {this.renderButtons()}
        <form onSubmit={this.handleSubmit}>
          {this.state.showAudio && (
            <div className="post-form__audio">
              {isEdit &&
              this.props.post &&
              this.props.post.audio_file &&
              this.state.audioFile &&
              this.state.audio_file &&
              this.state.audioFile === this.state.audio_file
                ? this.renderExistingAudio()
                : this.renderAudio()}
            </div>
          )}

          {this.state.showImage && this.renderImageUpload()}
          {this.renderTitle()}
          {this.state.showVideo && this.renderVideoEmbedder()}
          {this.state.showLink && this.renderLink()}
          {this.renderDescription()}

          <div className="post-form__public">
            <FormControlLabel
              className="make-public-label"
              control={
                <Checkbox
                  onChange={this.handleMakePublicChange}
                  checked={this.state.isPublic}
                  color="default"
                />
              }
              label="Make Public"
            />
          </div>

          <div className="post-form__actions">
            <Button
              className="cancel-button"
              onClick={() => this.props.close(hasUnsavedChanges)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </Button>
            <Button
              type="submit"
              className={cx('publish-button', {
                disabled: !isSaveEnabled,
              })}
              disabled={!isSaveEnabled}
            >
              Publish Post
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

const PostForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostFormComponent);

export { PostForm };
