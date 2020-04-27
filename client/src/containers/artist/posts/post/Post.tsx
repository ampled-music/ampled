import './post.scss';

import cx from 'classnames';
import * as React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { routePaths } from '../../../route-paths';
import { UserRoles } from '../../../shared/user-roles';
import { config } from '../../../../config';

import avatar from '../../../../images/ampled_avatar.svg';
import tear from '../../../../images/background_tear.png';
import { faUnlock, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CardActions, Collapse } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Modal } from '../../../shared/modal/Modal';
import { AudioPlayer } from '../../../shared/audio-player/AudioPlayer';
import YouTubePlayer from 'react-player/lib/players/YouTube';
import VimeoPlayer from 'react-player/lib/players/Vimeo';
import Linkify from 'react-linkify';

import { Comment } from '../comments/Comment';
import { CommentForm } from '../comments/CommentForm';
import { PostForm } from '../post-form/PostForm';
import { styles } from './post-style';

import { deletePost } from '../../../../api/post/delete-post';

const renderCloudinaryPhoto = (image: string) => {
  if (image) {
    if (image.includes('https://res.cloudinary')) {
      const img_src = image.replace('upload/', `upload/`);
      return img_src;
    } else {
      const img_src = `https://res.cloudinary.com/ampled-web/image/fetch/${image}`;
      return img_src;
    }
  }
};

const sortItemsByCreationDate = (items) =>
  items.sort((a, b) => b.created_at - a.created_at);

const returnPlayableUrl = (audio_file) => {
  const playableUrl = `${config.aws.playableBaseUrl}${audio_file}`;
  return playableUrl;
};

const canLoggedUserDeleteComment = (
  commentUserId: number,
  loggedUserAccess: { role },
  me,
) => {
  return (
    (loggedUserAccess &&
      (loggedUserAccess.role === UserRoles.Owner ||
        loggedUserAccess.role === UserRoles.Admin ||
        loggedUserAccess.role === UserRoles.Member)) ||
    (me && commentUserId === me.id)
  );
};

const Comments = ({
  post,
  classes,
  expanded,
  handleDeleteComment,
  handleExpandClick,
  handleSubmit,
  handlePrivatePostAction,
  isUserSubscribed,
  loggedUserAccess,
  me,
}) => {
  const allComments = sortItemsByCreationDate(post.comments);
  const firstComments = allComments.slice(0, 2).reverse();
  const hasPreviousComments = allComments.length > 2;
  const hasComments = allComments.length > 0;
  const authenticated = !!me;

  return (
    <div className="comments-list">
      {hasComments && <span className="comments-list__header">Comments</span>}
      {!expanded &&
        firstComments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            canDelete={canLoggedUserDeleteComment(
              comment.user_id,
              loggedUserAccess,
              me,
            )}
            deleteComment={handleDeleteComment}
          />
        ))}
      {hasPreviousComments && (
        <div>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            {allComments.reverse().map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                canDelete={canLoggedUserDeleteComment(
                  comment.user_id,
                  loggedUserAccess,
                  me,
                )}
                deleteComment={handleDeleteComment}
              />
            ))}
          </Collapse>
          <CardActions
            className={cx(classes.actions, 'collapse-actions')}
            disableSpacing
          >
            <button
              className="show-previous-command-btn"
              onClick={handleExpandClick}
            >
              <b>
                {expanded ? 'Hide Previous Comments' : 'View Previous Comments'}
              </b>
            </button>
          </CardActions>
        </div>
      )}
      {isUserSubscribed && (
        <CommentForm handleSubmit={handleSubmit} postId={post.id} />
      )}
      {!isUserSubscribed && (
        <div
          style={{
            fontFamily: '"Courier", Courier, monospace',
            fontSize: '13px',
          }}
        >
          <button
            onClick={() => handlePrivatePostAction(authenticated)}
            style={{
              textDecoration: 'underline',
              fontFamily: 'inherit',
              cursor: 'pointer',
              border: 'unset',
              padding: 0,
            }}
          >
            {authenticated ? 'Support' : 'Log in'}
          </button>{' '}
          to comment
        </div>
      )}
    </div>
  );
};

Comments.propTypes = {
  post: PropTypes.any,
  expanded: PropTypes.bool,
  classes: PropTypes.any,
  handleDeleteComment: PropTypes.func,
  handleExpandClick: PropTypes.func,
  handleSubmit: PropTypes.func,
  handlePrivatePostAction: PropTypes.func,
  canLoggedUserDeleteComment: PropTypes.func,
  isUserSubscribed: PropTypes.bool,
  loggedUserAccess: PropTypes.any,
  me: PropTypes.any,
};

const PostVideo = ({ videoUrl, doReflow }) => {
  const isYouTube = /youtu/i.test(videoUrl);
  const isVimeo = /vimeo/i.test(videoUrl);
  let VideoComponent;
  if (isVimeo) {
    VideoComponent = VimeoPlayer;
  } else if (isYouTube) {
    VideoComponent = YouTubePlayer;
  }
  return (
    <VideoComponent
      onReady={doReflow}
      className="react-player"
      url={videoUrl}
      width="100%"
      height="100%"
      controls={true}
      light
    />
  );
};

PostVideo.propTypes = {
  videoUrl: PropTypes.string,
  doReflow: PropTypes.func,
};

const PostMedia = ({
  post: {
    image_url,
    has_audio,
    has_video_embed,
    video_embed_url,
    audio_file,
    deny_details_lapsed,
  },
  allowDetails,
  accentColor,
  me,
  handlePrivatePostClick,
  playerCallback,
  doReflow,
}) => (
  <>
    {has_video_embed && allowDetails && (
      <div className="post__image-container" style={{ height: '250px' }}>
        <PostVideo videoUrl={video_embed_url} doReflow={doReflow} />
      </div>
    )}
    {image_url && !has_audio && (
      <div className="post__image-container">
        <img
          className={cx({
            post__image: true,
            'blur-image': !allowDetails,
          })}
          src={renderCloudinaryPhoto(image_url)}
        />
        {!allowDetails && (
          <Lock
            isLapsed={deny_details_lapsed}
            me={me}
            handlePrivatePostClick={handlePrivatePostClick}
          />
        )}
      </div>
    )}

    {has_audio && (
      <div className="post__audio-container">
        <div className="post__image-container">
          {image_url && (
            <img
              className={cx({
                post__image: true,
                'blur-image': !allowDetails,
              })}
              src={renderCloudinaryPhoto(image_url)}
            />
          )}
          {!image_url && !allowDetails && (
            <div
              style={{
                height: '340px',
                background:
                  'radial-gradient(circle, rgba(79,79,83,1) 0%, rgba(126,126,126,1) 35%, rgba(219,233,236,1) 100%)',
              }}
            />
          )}
          {!allowDetails && (
            <Lock
              isLapsed={deny_details_lapsed}
              me={me}
              handlePrivatePostClick={handlePrivatePostClick}
            />
          )}
        </div>
        {allowDetails && (
          <AudioPlayer
            url={returnPlayableUrl(audio_file)}
            image={renderCloudinaryPhoto(image_url)}
            accentColor={accentColor}
            callback={playerCallback}
          />
        )}
      </div>
    )}

    {!has_audio && !image_url && !allowDetails && (
      <div className="post__image-container">
        <div
          style={{
            height: '340px',
            background:
              'radial-gradient(circle, rgba(79,79,83,1) 0%, rgba(126,126,126,1) 35%, rgba(219,233,236,1) 100%)',
          }}
        />
        {
          <Lock
            isLapsed={deny_details_lapsed}
            me={me}
            handlePrivatePostClick={handlePrivatePostClick}
          />
        }
      </div>
    )}
  </>
);

PostMedia.propTypes = {
  post: PropTypes.any,
  classes: PropTypes.any,
  allowDetails: PropTypes.bool,
  accentColor: PropTypes.string,
  me: PropTypes.any,
  handlePrivatePostClick: PropTypes.func,
  playerCallback: PropTypes.func,
  doReflow: PropTypes.func,
};

const Lock = ({ isLapsed = false, me, handlePrivatePostClick }) => {
  const authenticated = !!me;

  return (
    <div className="private-support">
      <div className="private-support__copy">
        {isLapsed ? 'Support On Hold' : 'Supporter Only'}
      </div>
      <div className="private-support__btn">
        {isLapsed ? (
          <Link to={routePaths.userDetails} className="btn btn-ampled">
            Update Payment Details
          </Link>
        ) : (
          <button
            className="btn btn-ampled"
            onClick={() => handlePrivatePostClick(authenticated)}
          >
            Support To Unlock
          </button>
        )}
      </div>
    </div>
  );
};

Lock.propTypes = {
  isLapsed: PropTypes.bool,
  handlePrivatePostClick: PropTypes.func,
  me: PropTypes.any,
};

const DeleteModal = ({ onCancel, onConfirm }) => (
  <div className="delete-post-modal__container">
    <img className="tear tear__topper" src={tear} alt="" />
    <div className="delete-post-modal">
      <div className="delete-post-modal__title">
        <h4>Are you sure?</h4>
      </div>
      <div className="delete-post-modal__actions action-buttons">
        <button className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
        <button className="delete-button" onClick={onConfirm}>
          Delete Post
        </button>
      </div>
    </div>
  </div>
);

DeleteModal.propTypes = {
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

class PostComponent extends React.Component<any, any> {
  state = {
    showPrivatePostModal: false,
    showDeletePostModal: false,
    showEditPostModal: false,
    expanded: false,
  };

  handleExpandClick = () => {
    this.setState((state) => ({ expanded: !state.expanded }));
    setTimeout(() => {
      this.props.doReflow && this.props.doReflow();
    }, 500);
  };

  canLoggedUserPost = () => {
    return (
      this.props.loggedUserAccess &&
      (this.props.loggedUserAccess.role === UserRoles.Admin ||
        this.props.loggedUserAccess.role === UserRoles.Member ||
        this.props.loggedUserAccess.role === UserRoles.Owner)
    );
  };

  openPrivatePostModal = () => {
    this.setState({ showPrivatePostModal: true });
  };

  closePrivatePostModal = () => {
    this.setState({ showPrivatePostModal: false });
  };

  openDeletePostModal = () => {
    this.setState({ showDeletePostModal: true });
  };

  closeDeletePostModal = () => {
    this.setState({ showDeletePostModal: false });
  };

  openEditPostModal = () => {
    this.setState({ showEditPostModal: true });
  };

  closeEditPostModal = () => {
    this.setState({ showEditPostModal: false });
  };

  openSignupModal = (redirectToSupport: boolean) => {
    let artistId;

    if (this.props.match.params.slug) {
      artistId = this.props.artistId;
    } else {
      artistId = this.props.match.params.id;
    }

    this.props.openAuthModal({
      modalPage: 'signup',
      showSupportMessage: 'post',
      artistName: this.props.artistName,
      redirectTo: redirectToSupport
        ? routePaths.support.replace(':id', artistId)
        : window.location.pathname,
    });
  };

  redirectToSupport = () => {
    const { history, artistId, artistSlug } = this.props;

    history.push(
      routePaths.support.replace(
        ':id',
        artistSlug && artistSlug.length > 0 ? artistSlug : artistId,
      ),
    );
  };

  handleSubmit = async (comment) => {
    await this.props.addComment(comment);
    this.props.updateArtist();
  };

  isUserSubscribed = (loggedUserAccess) => {
    return (
      loggedUserAccess &&
      [
        UserRoles.Supporter.toString(),
        UserRoles.Owner.toString(),
        UserRoles.Admin.toString(),
        UserRoles.Member.toString(),
      ].includes(loggedUserAccess.role)
    );
  };

  canLoggedUserEditPost = (postUserId: number) => {
    const { loggedUserAccess, me } = this.props;

    return (
      (loggedUserAccess &&
        (loggedUserAccess.role === UserRoles.Owner ||
          loggedUserAccess.role === UserRoles.Admin)) ||
      (me && postUserId === me.id)
    );
  };

  handleDeleteComment = async (commentId) => {
    await this.props.deleteComment(commentId);
    this.closeDeletePostModal();
    this.props.updateArtist();
  };

  handleDeletePost = async () => {
    await deletePost(this.props.post.id);
    this.props.updateArtist();
  };

  handlePrivatePostClick = (authenticated: boolean) => {
    if (this.props.post.allow_details) {
      return;
    } else {
      this.handlePrivatePostAction(authenticated, true);
    }
  };

  handlePrivatePostAction = (
    authenticated: boolean,
    redirectToSupport: boolean,
  ) => {
    if (!authenticated) {
      this.openSignupModal(redirectToSupport);
    } else {
      this.redirectToSupport();
    }
  };

  returnFirstName = (name) => {
    const spacePosition = name.indexOf(' ');
    if (spacePosition === -1) {
      return name;
    } else {
      return name.substr(0, spacePosition);
    }
  };

  render = () => {
    const {
      classes,
      post,
      accentColor,
      me,
      loggedUserAccess,
      artistSlug,
    } = this.props;

    const deny_details_lapsed = post.deny_details_lapsed || false;

    const allowDetails = post.allow_details;
    const isPrivate = post.is_private;
    const allowDownload = post.allow_download;
    const hasAudio = post.has_audio;
    const authenticated = !!me;

    const authorFirstName = this.returnFirstName(post.author);
    const canLoggedUserEditPost = this.canLoggedUserEditPost(post.authorId);
    const canLoggedUserPost = this.canLoggedUserPost();
    const isUserSubscribed = this.isUserSubscribed(loggedUserAccess);

    return (
      <div className="post">
        {this.state.showDeletePostModal && (
          <Modal
            open={this.state.showDeletePostModal}
            onClose={this.closeDeletePostModal}
          >
            <DeleteModal
              onCancel={this.closeDeletePostModal}
              onConfirm={this.handleDeletePost}
            />
          </Modal>
        )}
        <Modal
          open={this.state.showEditPostModal}
          onClose={this.closeEditPostModal}
        >
          <PostForm
            close={this.closeEditPostModal}
            discardChanges={this.closeEditPostModal}
            isEdit
            post={post}
          />
        </Modal>
        <div
          className={cx('post__content', { 'clickable-post': !allowDetails })}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'A') {
              return;
            }
            !deny_details_lapsed && this.handlePrivatePostClick(authenticated);
          }}
          title={!allowDetails ? 'SUBSCRIBER-ONLY CONTENT' : ''}
        >
          <div
            className="post__card"
            style={{ border: `2px solid ${accentColor}` }}
          >
            <div className="post__header">
              <div className={classes.postTitle}>
                {post.authorImage ? (
                  <img
                    className="user-image"
                    src={post.authorImage}
                    alt={`${authorFirstName}'s avatar`}
                  />
                ) : (
                  <img className="user-image" src={avatar} alt="Avatar" />
                )}
                <span className="post__header_name">{authorFirstName}</span>
              </div>
              <div className={classes.postDate}>
                {post.created_ago === 'less than a minute' ? (
                  <div className={classes.postDate}>
                    <Link to={`/artist/${artistSlug}/post/${post.id}`}>
                      Just Now
                    </Link>
                  </div>
                ) : (
                  <div className={classes.postDate}>
                    <Link to={`/artist/${artistSlug}/post/${post.id}`}>
                      {post.created_ago} ago
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {canLoggedUserPost &&
              (isPrivate ? (
                <div className="post__status">
                  <FontAwesomeIcon className="unlock" icon={faUnlock} />
                  Supporters Only
                </div>
              ) : (
                <div className="post__status">Public Post</div>
              ))}

            {isUserSubscribed && !canLoggedUserPost && isPrivate && (
              <div className="post__status">
                <FontAwesomeIcon className="unlock" icon={faUnlock} />
                Supporters Only
              </div>
            )}

            {canLoggedUserEditPost && (
              <div className="post__change">
                <div className="post__change_edit">
                  <button onClick={this.openEditPostModal}>
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                </div>
                <div className="post__change_delete">
                  <button onClick={this.openDeletePostModal}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            )}

            <PostMedia
              doReflow={this.props.doReflow}
              post={post}
              classes={classes}
              allowDetails={allowDetails}
              me={me}
              accentColor={accentColor}
              handlePrivatePostClick={this.handlePrivatePostClick}
              playerCallback={this.props.playerCallback}
            />
            {allowDownload && hasAudio && allowDetails && (
              <div className="download-link">
                <a
                  href={`/artist/${this.props.artistSlug}/post/${post.id}/download`}
                  download={`${post.title}.mp3`}
                >
                  Download audio
                </a>
              </div>
            )}

            <div className="post__title">{post.title}</div>

            {post.body && (
              <div className="post__body">
                <Linkify
                  componentDecorator={(
                    decoratedHref: string,
                    decoratedText: string,
                    key: number,
                  ) => (
                    <a
                      href={decoratedHref}
                      key={key}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {decoratedText}
                    </a>
                  )}
                >
                  {post.body}
                </Linkify>
              </div>
            )}
          </div>
        </div>
        <Comments
          post={post}
          expanded={this.state.expanded}
          classes={classes}
          handleDeleteComment={this.handleDeleteComment}
          handleExpandClick={this.handleExpandClick}
          handleSubmit={this.handleSubmit}
          isUserSubscribed={isUserSubscribed}
          me={me}
          handlePrivatePostAction={this.handlePrivatePostAction}
          loggedUserAccess={loggedUserAccess}
        />
      </div>
    );
  };
}

const Post = withStyles(styles)(withRouter(PostComponent));

export { Post };
