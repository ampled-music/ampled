import { faArrowDown, faHeart, faShare, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import * as React from 'react';
import { config } from '../../config';
import { styles } from './post-style';

class PostComponent extends React.Component<any, any> {
  state = { expanded: false };

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

  render() {
    const { classes, post, accentColor } = this.props;

    return (
      <Card className={classes.card} style={{ border: `2px solid ${accentColor}` }}>
        <CardContent className={classes.header}>
          <div className={classes.postTitle}>
            <FontAwesomeIcon className={classes.userImage} icon={faUserCircle} />
            <span>{post.author}</span>
          </div>
          <div className={classes.postDate}>{post.created_ago} ago</div>
        </CardContent>
        <Divider />

        {post.image_url && <CardMedia className={classes.media} image={post.image_url} />}

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

        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph className={classes.postBody}>
              {post.body}
            </Typography>
          </CardContent>
        </Collapse>

        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton className={classes.iconButton} aria-label="Like" disabled>
            <FontAwesomeIcon icon={faHeart} size="xs" />
          </IconButton>

          <IconButton className={classes.iconButton} aria-label="Share" disabled>
            <FontAwesomeIcon icon={faShare} size="xs" />
          </IconButton>

          {post.body && (
            <IconButton
              className={classnames(
                classes.expand,
                {
                  [classes.expandOpen]: this.state.expanded,
                },
                classes.iconButton,
              )}
              onClick={this.handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label="View more"
              title="View more"
            >
              <FontAwesomeIcon icon={faArrowDown} size="xs" />
            </IconButton>
          )}
        </CardActions>
      </Card>
    );
  }
}

const Post = withStyles(styles)(PostComponent);

export { Post };
