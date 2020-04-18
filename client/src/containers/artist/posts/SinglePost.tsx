import './post-container.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openAuthModalAction } from '../../../redux/authentication/authentication-modal';
import { createCommentAction } from '../../../redux/comments/create';
import { deleteCommentAction } from '../../../redux/comments/delete';
import { apiAxios } from '../../../api/setup-axios';
import { Store } from '../../../redux/configure-store';

import { initialState as authenticationInitialState } from '../../../redux/authentication/initial-state';
import { initialState as commentsInitialState } from '../../../redux/comments/initial-state';
import { Post } from './post/Post';
import { Loading } from '../../shared/loading/Loading';

const mapStateToProps = (state: Store) => ({
  authentication: state.authentication,
  comments: state.comments,
  me: state.me.userData,
});

const mapDispatchToProps = (dispatch) => {
  return {
    addComment: bindActionCreators(createCommentAction, dispatch),
    openAuthModal: bindActionCreators(openAuthModalAction, dispatch),
    deleteComment: bindActionCreators(deleteCommentAction, dispatch),
  };
};

const SinglePostComponent = ({
  match: {
    params: { slug, postId },
  },
  me,
  openAuthModal,
  addComment,
  deleteComment,
  updateArtist,
}) => {
  const [post, setPost] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [updateCount, setUpdateCount] = React.useState(0);

  React.useEffect(() => {
    const fetchPost = async (slug: string, postId: string) => {
      try {
        const { data } = await apiAxios({
          method: 'get',
          url: `/slug/${slug}/post/${postId}.json`,
        });
        console.log(data);
        setPost(data);
        setError(null);
        setLoading(false);
      } catch (e) {
        setError(e.message);
        setPost(null);
        setLoading(false);
      }
    };
    fetchPost(slug, postId);
  }, [slug, postId, updateCount]);

  if (loading) {
    return <Loading artistLoading={true} />;
  } else if (error) {
    return <div>{error}</div>;
  }
  const {
    accent_color: accentColor,
    name: artistName,
    id: artistId,
    slug: artistSlug,
  } = post.artist;

  const loggedUserAccess = (me?.artistPages || []).filter(
    (access) => +access.artistId === +artistId,
  )?.[0];

  return (
    <div
      className="post-container"
      style={{ margin: '0 auto', maxWidth: '500px' }}
    >
      <Post
        me={me}
        post={post}
        accentColor={accentColor}
        artistName={artistName}
        artistId={artistId}
        artistSlug={artistSlug}
        loggedUserAccess={loggedUserAccess}
        openAuthModal={openAuthModal}
        addComment={addComment}
        deleteComment={deleteComment}
        updateArtist={() => setUpdateCount(updateCount + 1)}
        doReflow={() => null}
        playerCallback={() => null}
      />
    </div>
  );
};

const SinglePost = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SinglePostComponent);

export { SinglePost };
