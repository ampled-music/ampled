import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider } from '@material-ui/core';
import * as React from 'react';
import './post.scss';

const Post = ({ post, accentColor } = this.props) => {
  return (
    <div className="post" style={{ border: `2px solid ${accentColor}` }}>
      <div className="post-header">
        <div className="post-user">
          <FontAwesomeIcon className="user-image" icon={faUserCircle} />
          <span>{post.author}</span>
        </div>
        <span className="post-date">{post.created_ago} ago</span>
      </div>
      <Divider />
      {post.imageUrl && <img className="post-image" src={post.imageUrl} />}
      <div className="post-body">
        <h4>{post.title}</h4>
        <p>{post.body}</p>
      </div>
    </div>
  );
};

export { Post };
