import './audio-player.scss';

import * as React from 'react';

import FilePlayer from 'react-player/file';
import { withStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core/';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AudioWaveform, { WaveformSize } from './AudioWaveform';

interface AudioPlayerProps {
  url: string;
  accentColor: string;
  duration: number;
  waveform: number[];
  callback?(action: string, instance: any): void;
  download: boolean;
  postId: number;
  artistSlug: string;
}
interface AudioPlayerState {
  url: string;
  playing: boolean;
  volume: number;
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
  showPlaybackTime: boolean;
  loop: boolean;
  waveformSize: WaveformSize;
}

class AudioPlayer extends React.Component<AudioPlayerProps, AudioPlayerState> {
  private containerRef: React.RefObject<any>;

  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {
      url: null,
      playing: false,
      volume: 0.8,
      played: 0,
      playedSeconds: 0,
      loaded: 0,
      loadedSeconds: 0,
      showPlaybackTime: false,
      loop: false,
      waveformSize: WaveformSize.Unknown,
    };
  }

  componentDidMount = () => {
    this.setWaveformSize();
    window.addEventListener('resize', this.handleWindowResize);
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleWindowResize);
  };

  handleWindowResize = () => {
    this.setWaveformSize();
  };

  setWaveformSize = () => {
    const containerWidth = this.containerRef.current.clientWidth;

    let waveformSize = WaveformSize.Unknown;
    if (containerWidth <= 400) {
      waveformSize = WaveformSize.XSmall;
    } else if (containerWidth <= 500) {
      waveformSize = WaveformSize.Small;
    } else if (containerWidth <= 600) {
      waveformSize = WaveformSize.Medium;
    } else if (containerWidth <= 675) {
      waveformSize = WaveformSize.Large;
    } else {
      waveformSize = WaveformSize.XLarge;
    }

    if (waveformSize !== this.state.waveformSize) {
      this.setState({ waveformSize });
    }
  };

  load = () => {
    this.setState({
      url: this.props.url,
      played: 0,
      loaded: 0,
    });
  };

  player: any;

  playerRef = (player) => {
    this.player = player;
  };

  // Actions for handling audio
  handlePlayPause = () => {
    this.setState({ playing: !this.state.playing, showPlaybackTime: true });
    this.load();
  };
  handlePlay = () => {
    this.props.callback && this.props.callback('play', this);
    this.setState({ playing: true });
  };
  handlePause = () => {
    this.props.callback && this.props.callback('pause', this);
    this.setState({ playing: false });
  };
  handleStop = () => {
    this.props.callback && this.props.callback('stop', this);
    this.setState({ url: null, playing: false });
  };
  handleEnded = () => {
    this.props.callback && this.props.callback('ended', this);
    this.setState({ playing: this.state.loop, showPlaybackTime: false });
  };
  handleProgress = (state) => {
    this.props.callback && this.props.callback('progress', this);
    this.setState(state);
  };

  commitSeeking = (value: number) => {
    this.player.seekTo(value);
    this.setState({
      playedSeconds: this.props.duration * value,
    });
  };

  // Progress updates state
  formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = this.padSec(date.getUTCSeconds());
    if (hh) {
      return `${hh}:${this.padSec(mm)}:${ss}`;
    }
    return `${mm}:${ss}`;
  };
  padSec = (string) => {
    return ('0' + string).slice(-2);
  };
  valueLabelFormat = (value) => {
    return (
      this.formatTime(value) + ` / ` + this.formatTime(this.props.duration)
    );
  };

  renderAudioPlayer = () => {
    const {
      url,
      playing,
      loaded,
      // controls,
      volume,
      loop,
      playedSeconds,
      loadedSeconds,
      showPlaybackTime,
      waveformSize,
    } = this.state;

    const PlayButton = withStyles({
      root: {
        color: 'white',
        width: '30px',
        height: '30px',
        zIndex: 10,
        marginTop: '5px',
        backgroundColor: 'black',
        '&:hover': {
          backgroundColor: 'black',
        },
      },
    })(IconButton);

    return (
      <div
        className="audio-player"
        ref={this.containerRef}
        style={{ borderBottom: `2px solid ${this.props.accentColor}` }}
      >
        <FilePlayer
          ref={this.playerRef}
          url={url}
          height="100%"
          width="0"
          loop={loop}
          volume={volume}
          playing={playing}
          loaded={loaded}
          onPause={this.handlePause}
          onPlay={this.handlePlay}
          onEnded={this.handleEnded}
          onProgress={this.handleProgress}
          config={{forceAudio: true}}
        />

        <div className="audio-player__header">
          <PlayButton
            className="audio-player__header__play-pause"
            onClick={this.handlePlayPause}
            size="small"
            aria-label="Play / Pause"
          >
            {playing ? (
              <FontAwesomeIcon icon={faPause} />
            ) : (
              <FontAwesomeIcon icon={faPlay} style={{ left: '1px' }} />
            )}
          </PlayButton>
          {this.props.download && (
            <a
              className="audio-player__download"
              href={`/artist/${this.props.artistSlug}/post/${this.props.postId}/download`}
              download={`${this.props.postId}.mp3`}
            >
              Download audio
            </a>
          )}
        </div>

        <div className="audio-player__track">
          <AudioWaveform
            waveform={this.props.waveform}
            playedSeconds={playedSeconds}
            loadedSeconds={loadedSeconds}
            duration={this.props.duration}
            accentColor={this.props.accentColor}
            onSeek={this.commitSeeking}
            size={waveformSize}
          >
            {showPlaybackTime && (
              <div className="audio-player__time audio-player__start">
                {this.formatTime(playedSeconds)}
              </div>
            )}
            <div className="audio-player__time audio-player__end">
              {this.formatTime(this.props.duration)}
            </div>
          </AudioWaveform>
        </div>
      </div>
    );
  };

  render() {
    return <div>{this.renderAudioPlayer()}</div>;
  }
}

export { AudioPlayer };
