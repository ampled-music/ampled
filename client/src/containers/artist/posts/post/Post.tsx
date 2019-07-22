import './post.scss';

import cx from 'classnames';
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { routePaths } from 'src/containers/route-paths';
import { UserRoles } from 'src/containers/shared/user-roles';

import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CardActions, Collapse, Divider } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import { withStyles } from '@material-ui/core/styles';

import { config } from '../../../../config';
import { Comment } from '../comments/Comment';
import { CommentForm } from '../comments/CommentForm';
import { styles } from './post-style';

class PostComponent extends React.Component<any, any> {
  state = {
    showPrivatePostModal: false,
    expanded: false,
  };

  handleExpandClick = () => {
    this.setState((state) => ({ expanded: !state.expanded }));
    setTimeout(() => {
      this.props.doReflow && this.props.doReflow();
    }, 500);
  };

  audioPLayer = (audioFile) => {
    const playableUrl = `${config.aws.playableBaseUrl}${audioFile}`;

    return (
      <div>
        <audio controls>
          <source src={playableUrl} type="audio/mp3" />
        </audio>
      </div>
    );
  };

  openPrivatePostModal = () => {
    this.setState({ showPrivatePostModal: true });
  };

  closePrivatePostModal = () => {
    this.setState({ showPrivatePostModal: false });
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

  canLoggedUserComment = () => {
    const { loggedUserAccess } = this.props;

    return (
      loggedUserAccess && [UserRoles.Supporter.toString(), UserRoles.Owner.toString()].includes(loggedUserAccess.role)
    );
  };

  canLoggedUserDeleteComment = (commentUserId: number) => {
    const { loggedUserAccess, me } = this.props;

    return (loggedUserAccess && loggedUserAccess.role === UserRoles.Owner) || (me && commentUserId === me.id);
  };

  deleteComment = async (commentId) => {
    await this.props.deleteComment(commentId);
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
    const authenticated = !!me;

    return (
      <div className="post">
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
                  <FontAwesomeIcon className={classes.userImage} icon={faUserCircle} />
                )}
                <span>{this.returnFirstName(post.author)}</span>
              </div>
              <div className={classes.postDate}>{post.created_ago} ago</div>
            </div>
            <Divider />

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
                {post.body}
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
              deleteComment={this.deleteComment}
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
                  deleteComment={this.deleteComment}
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
        {this.canLoggedUserComment() && <CommentForm handleSubmit={this.handleSubmit} postId={post.id} />}
      </div>
    );
  };

  render() {
    return <div>{this.renderPost()}</div>;
  }
}

const Post = withStyles(styles)(withRouter(PostComponent));

export { Post };
