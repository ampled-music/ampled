import './post-container.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openAuthModalAction } from '../../../redux/authentication/authentication-modal';
import { createCommentAction } from '../../../redux/comments/create';
import { deleteCommentAction } from '../../../redux/comments/delete';
import { Store } from '../../../redux/configure-store';

import StackGrid, { transitions } from 'react-stack-grid';

import { initialState as authenticationInitialState } from '../../../redux/authentication/initial-state';
import { initialState as commentsInitialState } from '../../../redux/comments/initial-state';
import { Post } from './post/Post';

interface CommentProps {
  id: string;
  author: string;
  text: string;
  created_at: number;
  created_ago: string;
}

interface PostProps {
  id: string;
  author: string;
  title: string;
  body: string;
  comments: CommentProps[];
  created_at: number;
  created_ago: string;
  playerCallback?(action: string, instance: any): void;
}

interface PostsProps {
  posts: PostProps[];
  accentColor: string;
  authentication: typeof authenticationInitialState;
  updateArtist: Function;
  loading: boolean;
  comments: typeof commentsInitialState;
  me: { id: number; artistPages: any[] };
  match: any;
  hash: string;
  loggedUserAccess: { role: string; artistId: number };
  artistName: string;
  artistId: number;
  artistSlug: string;
  hideMembers: boolean;
  playerCallback?(action: string, instance: any): void;
  openPostModal: React.MouseEventHandler;
}

const { scaleDown } = transitions;

type Dispatchers = ReturnType<typeof mapDispatchToProps>;

type Props = PostsProps & Dispatchers;

class PostsContainerComponent extends React.Component<Props, any> {
  handleExpandClick = () => {
    this.setState((state) => ({ expanded: !state.expanded }));
  };

  sortItemsByCreationDate(items) {
    return items.sort((a, b) => b.created_at - a.created_at);
  }

  constructor(props) {
    super(props);
    this.state = {
      height: window.innerHeight,
      width: window.innerWidth,
    };
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.me && this.props.me) {
      setTimeout(() => {
        this.updateDimensions();
      }, 500);
    }
    if (prevProps.loading && !this.props.loading) {
      setTimeout(() => {
        const { hash } = this.props;
        if (hash && hash.length) {
          document.getElementById(hash.replace('#', ''))?.scrollIntoView();
        }
      }, 100);
    }
  }

  updateDimensions() {
    this.setState({
      height: window.innerHeight,
      width: window.innerWidth,
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  renderPosts = () => {
    const {
      posts,
      accentColor,
      artistName,
      artistSlug,
      me,
      openAuthModal,
      artistId,
      hideMembers,
      // loggedUserAccess,
    } = this.props;

    if (!posts) {
      return;
    }

    const loggedUserAccess = (me?.artistPages || []).filter(
      (access) => +access.artistId === +artistId,
    )?.[0];

    return this.sortItemsByCreationDate(posts).map((post) => (
      <div key={`post-${post.id}`} id={`post-${post.id}`}>
        <Post
          me={me}
          post={post}
          accentColor={accentColor}
          artistName={artistName}
          artistId={artistId}
          artistSlug={artistSlug}
          loggedUserAccess={loggedUserAccess}
          openAuthModal={openAuthModal}
          addComment={this.props.addComment}
          deleteComment={this.props.deleteComment}
          updateArtist={this.props.updateArtist}
          doReflow={this.updateDimensions}
          playerCallback={this.props.playerCallback}
          hideMembers={hideMembers}
        />
      </div>
    ));
  };

  renderStackedPosts = () => {
    let columnWidth;

    if (this.state.width <= 768) {
      columnWidth = '100%';
    } else if (this.state.width <= 1024) {
      columnWidth = '50%';
    } else {
      columnWidth = '33.33%';
    }

    return (
      <StackGrid
        columnWidth={columnWidth}
        appear={scaleDown.appear}
        appeared={scaleDown.appeared}
        enter={scaleDown.enter}
        entered={scaleDown.entered}
        leaved={scaleDown.leaved}
        gutterWidth={15}
        gutterHeight={15}
        monitorImagesLoaded={true}
      >
        {this.renderPosts()}
      </StackGrid>
    );
  };

  render() {
    return (
      <div className="post-container">
        <div className="container">
          {this.props.posts?.length > 0 ? (
            this.renderStackedPosts()
          ) : (
            <div className="post-container__no-posts">
              <div>
                Create your{' '}
                <button
                  className="link link__banner"
                  onClick={this.props.openPostModal}
                >
                  first post
                </button>
                ! If you need help, our{' '}
                <a
                  href="https://docs.ampled.com/artist-handbook/getting-started/posts"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Artist Handbook
                </a>{' '}
                can show you the way.
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

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

const PostsContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostsContainerComponent);

export { PostsContainer };
