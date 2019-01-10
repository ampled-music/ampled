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
import './post.scss';

const styles = (theme) => ({
  card: {
    maxWidth: 500,
    minHeight: 500,
    borderRadius: 0,
    boxShadow: 'none',
  },
  header: {
    height: 70,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  media: {
    height: 340,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
});

class PostComponent extends React.Component<any, any> {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState((state) => ({ expanded: !state.expanded }));
  };

  render() {
    const { classes, post, accentColor } = this.props;

    return (
      <Card className={classes.card} style={{ border: `2px solid ${accentColor}` }}>
        <CardContent className={classes.header}>
          <div className="post-title">
            <FontAwesomeIcon className="user-image" icon={faUserCircle} />
            <span>{post.author}</span>
          </div>
          <div className="post-date">{post.created_ago} ago</div>
        </CardContent>
        <Divider />

        <CardMedia
          className={classes.media}
          image="https://images-na.ssl-images-amazon.com/images/I/C1zpDpEFymS._CR0,0,3840,2880_._SL1000_.jpg"
        />

        <CardContent>
          <Typography component="p" className="post-title">
            {post.title}
          </Typography>
        </CardContent>

        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph className="post-body">
              {post.body}
            </Typography>
          </CardContent>
        </Collapse>

        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton aria-label="Like" disabled>
            <FontAwesomeIcon icon={faHeart} />
          </IconButton>
          <IconButton aria-label="Share" disabled>
            <FontAwesomeIcon icon={faShare} />
          </IconButton>
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="View more"
          >
            <FontAwesomeIcon icon={faArrowDown} title="View more" />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
}

const Post = withStyles(styles)(PostComponent);

export { Post };
