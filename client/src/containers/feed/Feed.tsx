import './../artist/posts/post-container.scss';
import './../artist/posts/post/post.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import { Store } from '../../redux/configure-store';

import { showToastAction } from '../../redux/toast/toast-modal';
import { createCommentAction } from '../../redux/comments/create';
import { deleteCommentAction } from '../../redux/comments/delete';
import { Post } from '../artist/posts/post/Post';

import { apiAxios } from '../../api/setup-axios';
import { Loading } from '../shared/loading/Loading';

class Feed extends React.Component<any> {
  state = {
    posts: [],
    loading: true,
    page: 1,
  };
  players: Set<any>;

  componentDidMount = () => {
    this.players = new Set();
    this.loadData(this.state.page);
  };

  nextPage = () => {
    this.loadData(+this.state.page + 1);
  };

  prevPage = () => {
    if (this.state.page === 1) {
      return;
    }
    this.loadData(+this.state.page - 1);
  };

  loadData = async (page) => {
    try {
      this.setState({ loading: true });
      const { data } = await apiAxios({
        method: 'get',
        url: `/posts.json?page=${page}`,
      });
      this.setState({ loading: false, posts: data, page });
    } catch (e) {
      this.setState({ loading: false });
    }
  };

  playerCallback = (action: string, instance: any) => {
    const { players } = this;
    if (action === 'play') {
      // Pause all active players
      players.forEach((player) => {
        // handlePause instance method both pauses audio *and* triggers
        // the 'pause' callback below
        player.handlePause();
      });

      // Add newly active player to set
      players.add(instance);
    } else if (action === 'pause') {
      // Triggered after player has already been paused;
      // remove paused player from set
      players.delete(instance);
    }
  };

  render() {
    const {
      me: { userData },
    } = this.props;
    if (this.state.loading) {
      return <Loading artistLoading={true} />;
    }
    return (
      <div
        className="post-container"
        style={{ maxWidth: '525px', width: '525px', margin: '0 auto' }}
      >
        <h1
          style={{
            textAlign: 'center',
            fontFamily: "'LL Replica Bold Web', sans-serif",
          }}
        >
          POSTS
        </h1>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .post { margin: 0 auto; }
            .post__audio-container {
              position: relative;
              display: block;
            }
            `,
          }}
        />
        <div className="container">
          {this.state.posts.map((post) => (
            <div
              key={post.id}
              style={{
                border: '1px solid black',
                background: post.artist.accent_color,
                marginBottom: '24px',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <Link to={`/artist/${post.artist.slug}`} className="btn-ampled">
                  {post.artist.name.toUpperCase()}
                </Link>
              </div>
              <Post
                post={post}
                me={userData}
                accentColor={post.artist.accent_color}
                artistName={post.artist.name}
                artistId={post.artist.id}
                artistSlug={post.artist.slug}
                loggedUserAccess={
                  (userData?.artistPages || []).filter(
                    (access) => +access.artistId === +post.artist.id,
                  )?.[0]
                }
                addComment={this.props.addComment}
                deleteComment={this.props.deleteComment}
                playerCallback={this.playerCallback}
              />
            </div>
          ))}
        </div>
        {this.state.page > 1 && (
          <button
            onClick={this.prevPage}
            className="btn btn-ampled"
            style={{ margin: '0 auto', display: 'block' }}
          >
            Prev Page
          </button>
        )}
        {this.state.posts.length === 30 && (
          <button
            onClick={this.nextPage}
            className="btn btn-ampled"
            style={{ margin: '0 auto', display: 'block' }}
          >
            Next Page
          </button>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: Store) => {
  return {
    me: state.me,
  };
};

const mapDispatchToProps = (dispatch) => ({
  showToast: bindActionCreators(showToastAction, dispatch),
  addComment: bindActionCreators(createCommentAction, dispatch),
  deleteComment: bindActionCreators(deleteCommentAction, dispatch),
});

const connectFeed = connect(mapStateToProps, mapDispatchToProps)(Feed);

export { connectFeed as Feed };
