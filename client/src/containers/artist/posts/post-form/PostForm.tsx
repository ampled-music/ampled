import './post-form.scss';
// Needed to get some standard styles working in the rich editor.
import 'draft-js/dist/Draft.css';

import cx from 'classnames';
import * as Sentry from '@sentry/browser';
import * as React from 'react';
import { ReactSVG } from 'react-svg';
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
import YouTubePlayer from 'react-player/lib/players/YouTube';
import VimeoPlayer from 'react-player/lib/players/Vimeo';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { convertFromHTML, convertToHTML } from 'draft-convert';
import DOMPurify from 'dompurify';

import Close from '../../../../images/icons/Icon_Close-Cancel.svg';
import TextIcon from '../../../../images/icons/Icon_Text.svg';
import AudioIcon from '../../../../images/icons/Icon_Audio.svg';
// import LinkIcon from '../../../../images/icons/Icon_Link_1.png';
// import Link2Icon from '../../../../images/icons/Icon_Link_2.png';
import PhotoIcon from '../../../../images/icons/Icon_Photo.svg';
import VideoIcon from '../../../../images/icons/Icon_Video.svg';
import Speaker from '../../../../images/home/home_how_speaker.png';
import Bandcamp from '../../../../images/icons/Icon_Bandcamp.svg';

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
  post?: Post;
  artistId?: number;
  isStripeSetup?: boolean;
}

type Dispatchers = ReturnType<typeof mapDispatchToProps>;
type Props = typeof postsInitialState &
  typeof artistsInitialState &
  Dispatchers &
  PostFormProps;

interface RichEditorProps {
  initialTextAsHTML?: string;
  callback?: Function;
  postType: string;
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
            className={`MuiInputBase-root MuiOutlinedInput-root MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-multiline MuiOutlinedInput-multiline rich-editor 
            ${this.state.focused ? 'focused' : ' '}
            ${this.props.postType === 'Text' && 'large'}`}
            onClick={this.focusEditor}
          >
            <Editor
              label="Body Text"
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

export default class PostFormComponent extends React.Component<Props, any> {
  initialState = {
    title: '',
    body: '',
    link: null,
    audioUploads: [],
    imageName: '',
    videoEmbedUrl: null,
    embedUrl: null,
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
    activePostType: '',
    showText: false,
    showAudio: false,
    showVideo: false,
    showImage: false,
    showEmbed: false,
  };

  editor: any;

  constructor(props) {
    super(props);
    if (props.post) {
      const { post } = props;
      let activePostType, showText, showAudio, showVideo, showImage, showEmbed;
      if (post.audio_file) {
        activePostType = 'Audio';
        showAudio = true;
        showImage = true;
      } else if (post.images && post.images.length > 0) {
        activePostType = 'Photo';
        showImage = true;
      } else if (post.video_embed_url) {
        activePostType = 'Video';
        showVideo = true;
      } else if (post.embed_url) {
        activePostType = 'Embed';
        showEmbed = true;
      } else {
        activePostType = 'Text';
        showText = true;
      }

      this.state = {
        ...this.initialState,
        ...props.post,
        audioUploads: props.post.audio_uploads,
        images: props.post.images,
        videoEmbedUrl: props.post.video_embed_url,
        embedUrl: props.post.embed_url,
        isPublic: !props.post.is_private,
        allowDownload: props.post.allow_download,
        activePostType,
        showText,
        showAudio,
        showVideo,
        showImage,
        showEmbed,
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
    if (
      this.state.savingPost &&
      prevProps.creatingPost &&
      !this.props.creatingPost
    ) {
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
      activePostType,
      title,
      body,
      link,
      audioUploads,
      images,
      videoEmbedUrl,
      embedUrl,
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
      post_type: activePostType,
      audio_uploads: audioUploads,
      images: ['Audio', 'Photo'].includes(activePostType) ? images : [],
      video_embed_url: activePostType === 'Video' ? videoEmbedUrl : null,
      embed_url: activePostType === 'Embed' ? embedUrl : null,
      is_private: !isPublic,
      is_pinned: isPinned,
      allow_download: activePostType === 'Audio' ? allowDownload : null,
      artist_page_id: this.props.artistId
        ? this.props.artistId
        : this.props.artist.id,
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

  validateURL = (url) => {
    const { activePostType } = this.state;
    if (activePostType === 'Video') {
      return url && url.length > 0 && /(youtube.com\/watch\?|youtu.be\/|vimeo.com\/\d+)/gi.test(url);
    }
    if (activePostType === 'Embed') {
      return url && url.length > 0 && /(www\.)?(bandcamp\.com)\//i.test(url);
    }
    return false;
  };

  isSaveEnabled = () => {
    const { title, activePostType, images, videoEmbedUrl, embedUrl, audioUploads } = this.state;
    if ( activePostType === 'Text' ) {
      return title?.length > 0;
    }
    if ( activePostType === 'Audio' ) {
      return title?.length > 0 && audioUploads?.length > 0 && audioUploads[0].public_id.length > 0;
    }
    if ( activePostType === 'Photo' ) {
      return title?.length > 0 && images?.length > 0;
    }
    if ( activePostType === 'Video' ) {
      return title?.length > 0 && videoEmbedUrl?.length > 0 && this.validateURL(videoEmbedUrl);
    }
    if ( activePostType === 'Embed' ) {
      return title?.length > 0 && embedUrl?.length > 0 && this.validateURL(embedUrl);
    }
    return false;
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
              showEmbed: false,
            })
          }
        >
          <img src={TextIcon} className="btn__icon" alt="" />
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
              showEmbed: false,
            })
          }
        >
          <img src={AudioIcon} className="btn__icon" alt="" />
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
              showEmbed: false,
            })
          }
        >
          <img src={VideoIcon} className="btn__icon" alt="" />
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
              showEmbed: false,
            })
          }
        >
          <img src={PhotoIcon} className="btn__icon" alt="" />
          Photo
        </Button>
        <Button
          className={cx('btn', {
            active: this.state.activePostType === 'Embed',
          })}
          onClick={() =>
            this.setState({
              activePostType: 'Embed',
              showAudio: false,
              showVideo: false,
              showImage: false,
              showEmbed: true,
            })
          }
        >
          <img src={Bandcamp} className="btn__icon" alt=""/>
          Embed
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
    return (
      <div className="uploader">
        <Image
          className="preview__image"
          key={this.state.images[0].name}
          publicId={this.state.images[0].public_id}
          alt={this.state.images[0].name}
        >
          <Transformation
            fetchFormat="auto"
            quality="auto"
            crop="fill"
            width={500}
            height={150}
            responsive_placeholder="blank"
          />
        </Image>
        <div className="helper-text">(Preview)</div>
        <IconButton
          aria-label="Cancel image input"
          className="cancel-button"
          title="Remove image"
          onClick={this.removeImage}
          size="small"
        >
          <ReactSVG className="icon" src={Close} />
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
            <img
              className="btn__icon"
              src={PhotoIcon}
              height={25}
              width={25}
              alt="Camera Icon"
            />
            Add Photo
          </Button>
        </label>
      </div>
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
              <IconButton
                aria-label="Cancel audio input"
                className="cancel-button"
                title="Remove audio"
                onClick={() => this.setAudioUpload(null, null)}
                size="small"
              >
                <ReactSVG className="icon" src={Close} />
              </IconButton>
            </div>
          </div>
        </div>

        {audioUpload && (
          <div className="post-form__audio_allow-checkbox">
            <FormControlLabel
              className="alow-download-label"
              control={
                <Checkbox
                  onChange={this.handleAllowDownloadChange}
                  checked={this.state.allowDownload}
                  color="default"
                />
              }
              label="Enable Download"
            />
          </div>
        )}
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
                videoEmbedUrl: null,
              })
            }
            size="small"
          >
            <ReactSVG className="icon" src={Close} />
          </IconButton>
        </div>
      );
    } else if (!isValidVideo) {
      return <div className="helper-text">No supported video detected.</div>;
    }
  };

  renderEmbedPreview = () => {
    const { embedUrl } = this.state;
    let isBandcamp =
        embedUrl &&
        embedUrl.length > 0 &&
        /(www\.)?(bandcamp\.com)\//i.test(embedUrl);

    if (isBandcamp) {
      return (  
        <div
          className="embed-container"
          dangerouslySetInnerHTML={{ __html: embedUrl }}
        />
      );
    } else {
      return <div className="helper-text">Sorry, at the moment we only accept Bandcamp embeds.</div>;
    }
  };

  renderVideoEmbedder = () => {
    const { videoEmbedUrl } = this.state;

    return (
      <div className="post-form__video">
        <TextField
          name="videoEmbedUrl"
          label="YouTube or Vimeo URL"
          type="text"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={videoEmbedUrl ? videoEmbedUrl : ''}
          onChange={this.handleChange}
          required
        />
        {videoEmbedUrl && this.renderVideoPreview()}
      </div>
    );
  };

  renderEmbed = () => {
    const { embedUrl } = this.state;

    return (
      <div className="post-form__embed">
        <TextField
          name="embedUrl"
          label="Bandcamp iFrame"
          variant="outlined"
          type="text"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={embedUrl ? embedUrl : ''}
          onChange={this.handleChange}
          multiline
          rows="3"
          required
        />
        {embedUrl && this.renderEmbedPreview()}
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
        label="Post title"
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
      />
    );
  };

  renderDescription = () => {
    const { body, activePostType } = this.state;
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
        postType={activePostType}
      />
    );
  };

  renderAudio = () => {
    const { audioUploads } = this.state;
    return (
      <div>
        <Upload
          onComplete={this.setAudioUpload}
          onRemove={() => this.setAudioUpload(null, null)}
        />
        {audioUploads.length > 0 && (
          <div className="post-form__audio_allow-checkbox">
            <FormControlLabel
              className="alow-download-label"
              control={
                <Checkbox
                  onChange={this.handleAllowDownloadChange}
                  checked={this.state.allowDownload}
                  color="default"
                />
              }
              label="Enable Download"
            />
          </div>
        )}
      </div>
    );
  };

  renderEmptyType = () => {
    const { hasUnsavedChanges } = this.state;
    return (
      <div className="post-form__empty">
        <img className="post-form__empty_image" src={Speaker} alt="Speaker" />
        <div className="post-form__empty_copy">
          <div>Not sure what to post?</div>
          <div>
            <a
              href="https://docs.ampled.com/artist-handbook/getting-started/posts"
              target="_blank"
              rel="noopener noreferrer"
            >
              Here
            </a>{' '}
            are some ideas.
          </div>
          <Button
            className="post-form__empty_cancel"
            onClick={() => this.props.close(hasUnsavedChanges)}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  render() {
    const { hasUnsavedChanges, savingPost } = this.state;
    const { isEdit } = this.props;

    const isStripeSetup = this.props.isStripeSetup
      ? this.props.isStripeSetup
      : this.props.artist.isStripeSetup;
    const isSaveEnabled = this.isSaveEnabled();

    if (savingPost) return <Loading isLoading={true} />;

    return (
      <div className="post-form__container">
        <div className="post-form">
          <h4>{isEdit ? 'Edit Post' : 'Create a new post'}</h4>
          {this.renderButtons()}
          <form onSubmit={this.handleSubmit}>
            {this.state.showAudio && (
              <div className="post-form__audio">
                {isEdit &&
                this.props.post &&
                this.props.post.audio_uploads.length > 0 &&
                this.state.audioUploads.length > 0 &&
                this.state.audio_uploads[0].id &&
                this.state.audioUploads[0].id === this.state.audio_uploads[0].id
                  ? this.renderExistingAudio()
                  : this.renderAudio()}
              </div>
            )}

            {this.state.activePostType ? (
              <div>
                {this.state.showImage && this.renderImageUpload()}
                {this.renderTitle()}
                {this.state.showVideo && this.renderVideoEmbedder()}
                {this.state.showEmbed && this.renderEmbed()}
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
                  {!isStripeSetup && (
                    <small>
                      You need to set up your payout destination to make private
                      posts.
                    </small>
                  )}
                </div>

                <div className="post-form__actions">
                  <Button
                    className="cancel-button"
                    onClick={() => this.props.close(hasUnsavedChanges)}
                  >
                    <ReactSVG className="icon" src={Close} />
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
              </div>
            ) : (
              <div>{this.renderEmptyType()}</div>
            )}
          </form>
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
