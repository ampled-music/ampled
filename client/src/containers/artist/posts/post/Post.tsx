import './post.scss';

import cx from 'classnames';
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { routePaths } from 'src/containers/route-paths';
import { UserRoles } from 'src/containers/shared/user-roles';

import avatar from '../../../../images/ampled_avatar.svg';
import tear from '../../../../images/background_tear.png';
import { faUnlock, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CardActions, Collapse, Divider } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import { withStyles } from '@material-ui/core/styles';
import { Modal } from '../../../shared/modal/Modal';

import ReactPlayer from 'react-player';
import Linkify from 'react-linkify';

import { Duration } from './controls/Duration';

import { config } from '../../../../config';
import { Comment } from '../comments/Comment';
import { CommentForm } from '../comments/CommentForm';
import { styles } from './post-style';

import { deletePost } from 'src/api/post/delete-post';

class PostComponent extends React.Component<any, any> {
  state = {
    showPrivatePostModal: false,
    showDeletePostModal: false,
    expanded: false,
    url: null,
    playing: false,
    controls: false,
    volume: 0.8,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false
  };

  handleExpandClick = () => {
    this.setState((state) => ({ expanded: !state.expanded }));
    // setTimeout(() => {
    //   this.props.doReflow && this.props.doReflow();
    // }, 500);
  };

  handlePlayPause = () => {
    console.log('onPlayPause')
    this.setState({ playing: !this.state.playing })
  }
  // handlePlay = () => {
  //   console.log('onPlayPause')
  //   this.setState({ playing: true })
  // }
  // handlePause = () => {
  //   this.setState({ playing: false })
  // }
  // handleDuration = (duration) => {
  //   this.setState({ duration })
  // }


  audioPLayer = (audioFile) => {

    const { playing, played, duration, loaded, controls, volume, loop } = this.state;
    const playableUrl = `${config.aws.playableBaseUrl}${audioFile}`;
    
    return (
      <div className="post__audio">
        <ReactPlayer
          url={playableUrl}
          className='react-player'
          controls={controls}
          loop={loop}
          volume={volume}
          playing={playing}
          config={{
            file: {
              forceAudio: true
            }
          }}
        />
        <button onClick={this.handlePlayPause}>{playing ? 'Pause' : 'Play'}</button>
        <div>{played.toFixed(3)}</div>
        <div>{loaded.toFixed(3)}</div>
        <div>duration <Duration seconds={duration} /></div>
        <div>elapsed <Duration seconds={duration * played} /></div>
      </div>
    );
  };

  canLoggedUserPost = () => {
    return this.props.loggedUserAccess && this.props.loggedUserAccess.role === UserRoles.Owner;
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

  openSignupModal = () => {
    this.props.openAuthModal({
      modalPage: 'signup',
      showSupportMessage: 'post',
      artistName: this.props.artistName,
      redirectTo: routePaths.support.replace(':id', this.props.match.params.id),
    });
  };

  redirectToSupport = () => {
    const { history, artistId } = this.props;

    history.push(routePaths.support.replace(':id', artistId));
  };

  sortItemsByCreationDate(items) {
    return items.sort((a, b) => b.created_at - a.created_at);
  }

  handleSubmit = async (comment) => {
    await this.props.addComment(comment);
    this.props.updateArtist();
  };

  isUserSubscribed = () => {
    const { loggedUserAccess } = this.props;

    return (
      loggedUserAccess && [UserRoles.Supporter.toString(), UserRoles.Owner.toString()].includes(loggedUserAccess.role)
    );
  };

  canLoggedUserDeleteComment = (commentUserId: number) => {
    const { loggedUserAccess, me } = this.props;

    return (loggedUserAccess && loggedUserAccess.role === UserRoles.Owner) || (me && commentUserId === me.id);
  };

  handleDeleteComment = async (commentId) => {
    await this.props.deleteComment(commentId);
    this.props.updateArtist();
  };

  handleDeletePost = async () => {
    await deletePost(this.props.post.id);
    this.props.updateArtist();
  };

  handlePrivatePostClick = (authenticated: boolean) => {
    if (this.props.post.allow_details) {
      return;
    } else if (!authenticated) {
      this.openSignupModal();
    } else {
      this.redirectToSupport();
    }
  };

  returnFirstName = (name) => {
    let spacePosition = name.indexOf(' ');
    if (spacePosition === -1) {
      return name;
    } else {
      return name.substr(0, spacePosition);
    }
  };

  renderDeleteModal = () => (
    <div>
      <img className="tear__topper" src={tear} />
      <div className="delete-post-modal">
        <div className="delete-post-modal__title">
          <h4>Are you sure?</h4>
        </div>
        <div className="delete-post-modal__actions action-buttons">
          <button className="cancel-button" onClick={this.closeDeletePostModal}>
            Cancel
          </button>
          <button className="delete-button" onClick={this.handleDeletePost}>
            Delete Post
          </button>
        </div>
      </div>
    </div>
  );

  renderLock = () => {
    const { me } = this.props;
    const authenticated = !!me;

    return (
      <div className="private-support">
        <div className="private-support__copy">Supporter Only</div>
        <div className="private-support__btn">
          <button className="btn btn-ampled" onClick={() => this.handlePrivatePostClick(authenticated)}>
            SUPPORT TO UNLOCK
          </button>
        </div>
      </div>
    )
  };

  renderPost = () => {
    const { classes, post, accentColor, me } = this.props;

    const allowDetails = post.allow_details;
    const isPrivate = post.is_private;
    const authenticated = !!me;

    return (
      <div className="post">
        <Modal open={this.state.showDeletePostModal} onClose={this.closeDeletePostModal}>
          {this.renderDeleteModal()}
        </Modal>
        <div
          className={cx('post', { 'clickable-post': !allowDetails })}
          onClick={() => this.handlePrivatePostClick(authenticated)}
          title={!allowDetails ? 'SUBSCRIBER-ONLY CONTENT' : ''}
        >
          <Card className={classes.card} style={{ border: `2px solid ${accentColor}` }}>
            <div className="post__header">
              <div className={classes.postTitle}>
                {post.authorImage ? (
                  <img className="user-image" src={post.authorImage} />
                ) : (
                  <img className="user-image" src={avatar} />
                )}
                <span className="post__header_name">{this.returnFirstName(post.author)}</span>
              </div>
              <div className={classes.postDate}>{post.created_ago} ago</div>
            </div>
            <Divider />
            
            {this.canLoggedUserPost() && 
              ( isPrivate ? (
                <div className="post__status"><FontAwesomeIcon className="unlock" icon={faUnlock} />Subscribers Only</div>
              ) : (
                <div className="post__status">Public Post</div>
              )
            )}
            
            {this.isUserSubscribed() && ![UserRoles.Owner.toString()].includes(this.props.loggedUserAccess.role) && isPrivate && (
                <div className="post__status"><FontAwesomeIcon className="unlock" icon={faUnlock} />Subscribers Only</div>
            )}
            
            {this.canLoggedUserPost() && ( 
              <div className="post__change">
                <div className="post__change_edit">
                  <button className="disabled">
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

            {post.image_url && (
              <div className="post__image-container">
                <div>
                  <CardMedia className={cx(classes.media, { 'blur-image': !allowDetails })} image={post.image_url} />
                </div>
                {!allowDetails && this.renderLock()}
              </div>
            )}

            {post.audio_file && (
              <CardMedia
                className={classes.media}
                image={post.image_url}
                component={() => this.audioPLayer(post.audio_file)}
              />
            )}

            <div className="post__title">
              {post.title}
            </div>

            {post.body && (
              <div className="post__body">
                <Linkify
                  componentDecorator={
                    (decoratedHref: string, decoratedText: string, key: number) =>
                    (<a href={decoratedHref} key={key} target="_blank">
                      {decoratedText}
                    </a>)
                  }
                >
                  {post.body}
                </Linkify>
              </div>
            )}
          </Card>
        </div>
        {this.renderComments()}
      </div>
    );
  };

  renderComments = () => {
    const { classes, post } = this.props;
    const { expanded } = this.state;

    const allComments = this.sortItemsByCreationDate(post.comments);
    const firstComments = allComments.slice(0, 2).reverse();
    const hasPreviousComments = allComments.length > 2;
    const hasComments = allComments.length > 0;

    return (
      <div className="comments-list">
        {hasComments && (
          <span className="comments-list__header">Comments</span>
        )}
        {!expanded &&
          firstComments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              canDelete={this.canLoggedUserDeleteComment(comment.user_id)}
              deleteComment={this.handleDeleteComment}
            />
          ))}
        {hasPreviousComments && (
          <div>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              {allComments.reverse().map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  canDelete={this.canLoggedUserDeleteComment(comment.user_id)}
                  deleteComment={this.handleDeleteComment}
                />
              ))}
            </Collapse>
            <CardActions className={cx(classes.actions, 'collapse-actions')} disableSpacing>
              <button className="show-previous-command-btn" onClick={this.handleExpandClick}>
                <b>{expanded ? 'Hide Previous Comments' : 'View Previous Comments'}</b>
              </button>
            </CardActions>
          </div>
        )}
        {this.isUserSubscribed() && <CommentForm handleSubmit={this.handleSubmit} postId={post.id} />}
      </div>
    );
  };

  render() {
    return <div>{this.renderPost()}</div>;
  }
}

const Post = withStyles(styles)(withRouter(PostComponent));

export { Post };
