import './post.scss';

import cx from 'classnames';
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { routePaths } from 'src/containers/route-paths';
import { UserRoles } from 'src/containers/shared/user-roles';

import { faLock, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CardActions, Collapse, Divider } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { config } from '../../../../config';
import { Comment } from '../comments/Comment';
import { CommentForm } from '../comments/CommentForm';
import { styles } from './post-style';

class PostComponent extends React.Component<any, any> {
  constructor(props) {
    super(props);
    
    const { post } = this.props;
    let displayText = false;
    let showReadMore = false;
    let isReadingMore = false;

    const textBreakpoint = this.calculateTextBreakpoint(post);

    if (post.body && post.body.length > textBreakpoint) {
      displayText = post.body.substring(0, textBreakpoint);
      showReadMore = true;
      isReadingMore = false;
    }

    this.state = {
      showPrivatePostModal: false,
      expanded: false,
      displayText,
      showReadMore,
      isReadingMore,
    };
  
  }

  componentDidUpdate(prevProps) {
    const { post } = this.props;
    const { post: prevPost } = prevProps;
    const textBreakpoint = this.calculateTextBreakpoint(post);

    if (post.body && post.body.length > textBreakpoint) {
      if (prevPost && prevPost.body && prevPost.body !== post.body) {
        this.setState({
          displayText: post.body.substring(0, textBreakpoint),
          showReadMore: true,
          isReadingMore: false
        });  
      }
    }
  }

  calculateTextBreakpoint(post) {
    if (post.image_url) {
      return 100;
    }
    return 500;
  }

  readMore = () => {
    this.setState({ isReadingMore: !this.state.isReadingMore });
  }

  handleExpandClick = () => {
    this.setState((state) => ({ expanded: !state.expanded }));
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
    this.props.openAuthModal({ modalPage: 'signup', showSupportMessage: true, artistName: this.props.artistName });
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

  renderPost = () => {
    const { classes, post, accentColor, me } = this.props;
    let { displayText, showReadMore, isReadingMore } = this.state;
    if (!displayText || isReadingMore) {
      displayText = post.body;
    }

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
            <CardContent className={classes.header}>
              <div className={classes.postTitle}>
                {post.authorImage ? (
                  <img className="user-image" src={post.authorImage} />
                ) : (
                  <FontAwesomeIcon className={classes.userImage} icon={faUserCircle} />
                )}
                <span>{post.author}</span>
              </div>
              <div className={classes.postDate}>{post.created_ago} ago</div>
            </CardContent>
            <Divider />

            {post.image_url && (
              <div className="this-image-container">
                <div>
                  <CardMedia className={cx(classes.media, { 'blur-image': !allowDetails })} image={post.image_url} />
                </div>
                {!allowDetails && <FontAwesomeIcon icon={faLock} />}
              </div>
            )}

            {post.audio_file && (
              <CardMedia
                className={classes.media}
                image={post.image_url}
                component={() => this.audioPLayer(post.audio_file)}
              />
            )}

            <CardContent>
              <Typography component="p" className={classes.postTitle}>
                {post.title}
              </Typography>
            </CardContent>

            {!allowDetails && (
              <div className="private-support-btn">
                <button className="btn" onClick={() => this.handlePrivatePostClick(authenticated)}>
                  <FontAwesomeIcon icon={faLock} />
                  SUPPORT TO UNLOCK
                </button>
              </div>
            )}

            {displayText && (
              <CardContent>
                <Typography paragraph className={classes.postBody}>
                  {displayText}
                  {
                    showReadMore && (
                    isReadingMore ? 
                      null :
                      <span
                        onClick={this.readMore}
                          style={{
                            cursor: 'pointer'
                        }}
                      >
                        ...
                      </span>
                    )
                  }
                </Typography>
              </CardContent>
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

    return (
      <div className="comments-list">
        <span>COMMENTS</span>
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
            <CardActions className={cx(classes.actions, 'collapse-actions')} disableActionSpacing>
              <button className="show-previous-command-btn" onClick={this.handleExpandClick}>
                <b>{expanded ? 'HIDE PREVIOUS COMMENTS' : 'VIEW PREVIOUS COMMENTS'}</b>
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
