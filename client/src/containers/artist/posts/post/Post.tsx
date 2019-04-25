import './post.scss';

import cx from 'classnames';
import * as React from 'react';
import { withRouter } from 'react-router-dom';

import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, Button } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { config } from '../../../../config';
import { styles } from './post-style';
import { Modal } from 'src/containers/shared/modal/Modal';

class PostComponent extends React.Component<any, any> {
  state = {
    showPrivatePostModal: false,
  };

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

  handlePrivatePostClick = () => {
    if (!this.props.authenticated) {
      this.props.openAuthModal({ modalPage: 'signup', showSupportMessage: true, artistName: this.props.artistName });
    } else {
      this.openPrivatePostModal();
    }
  };

  render() {
    const { classes, post, accentColor, artistName } = this.props;

    const allowDetails = post.allow_details;

    return (
      <div>
        <div
          className={cx('post', { 'clickable-post': !allowDetails })}
          onClick={() => !allowDetails && this.handlePrivatePostClick()}
          title={!allowDetails ? 'SUBSCRIBER-ONLY CONTENT' : ''}
        >
          <Card className={classes.card} style={{ border: `2px solid ${accentColor}` }}>
            <CardContent className={classes.header}>
              <div className={classes.postTitle}>
                <FontAwesomeIcon className={classes.userImage} icon={faUserCircle} />
                <span>{post.author}</span>
              </div>
              <div className={classes.postDate}>{post.created_ago} ago</div>
            </CardContent>
            <Divider />

            {post.image_url && (
              <div className={cx({ 'blur-image': !allowDetails })}>
                <CardMedia className={classes.media} image={post.image_url} />
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

            <CardContent>
              <Typography paragraph className={classes.postBody}>
                {post.body}
              </Typography>
            </CardContent>
          </Card>
        </div>
        <Modal open={this.state.showPrivatePostModal} onClose={this.closePrivatePostModal}>
          <div className="private-post-modal">
            <p>This is a private post. Become a supporter of {artistName} to access it.</p>
            <Button onClick={this.closePrivatePostModal}>Ok</Button>
          </div>
        </Modal>
      </div>
    );
  }
}

const Post = withStyles(styles)(withRouter(PostComponent));

export { Post };
