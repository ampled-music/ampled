import './audio-player.scss';

import * as React from 'react';
import cx from 'classnames';

import FilePlayer from 'react-player/lib/players/FilePlayer';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import { IconButton, Slider } from '@material-ui/core/';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { theme } from './theme';
import AudioWaveform, { WaveformSize } from './AudioWaveform';

interface AudioPlayerProps {
  url: string;
  accentColor: string;
  waveform: number[];
  callback?(action: string, instance: any): void;
}
interface AudioPlayerState {
  url: string;
  playing: boolean;
  seeking: boolean;
  volume: number;
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
  duration: number;
  durationShow: string;
  loop: boolean;
  waveformSize: WaveformSize;
}

class AudioPlayer extends React.Component<AudioPlayerProps, AudioPlayerState> {
  private waveformContainerRef: React.RefObject<any>

  constructor(props) {
    super(props);
    this.waveformContainerRef = React.createRef();
    this.state = {
      url: null,
      playing: false,
      seeking: false,
      volume: 0.8,
      played: 0,
      playedSeconds: 0,
      loaded: 0,
      loadedSeconds: 0,
      duration: 0,
      durationShow: null,
      loop: false,
      waveformSize: WaveformSize.Unknown,
    };
  }

  componentDidMount = () => {
    this.setWaveformSize();
    window.addEventListener('resize', this.handleWindowResize)
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleWindowResize)
  }

  handleWindowResize = () => {
    this.setWaveformSize();
  }

  setWaveformSize = () => {
    const waveformContainerWidth = this.waveformContainerRef.current.clientWidth;
    const waveformSize = waveformContainerWidth > 500 ? WaveformSize.Large : WaveformSize.Small;
    if (waveformSize !== this.state.waveformSize) {
      this.setState({ waveformSize });
    }
  }

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
    this.setState({ playing: !this.state.playing, durationShow: 'on' });
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
    this.setState({ playing: this.state.loop, durationShow: null });
  };

  // @todo: Add a volume adjuster
  handleVolumeChange = (e) => {
    this.setState({ volume: parseFloat(e.target.value) });
  };

  commitSeeking = (value: number) => {
    this.player.seekTo(value);
  };

  // Progress updates state
  handleProgress = (state) => {
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.props.callback && this.props.callback('progress', this);
      this.setState(state);
    }
  };

  // Show duration and total time on play
  handleDuration = (duration) => {
    this.setState({ duration });
  };

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
      this.formatTime(value) + ` / ` + this.formatTime(this.state.duration)
    );
  };

  renderAudioPlayer = () => {
    const {
      url,
      playing,
      loaded,
      duration,
      // controls,
      volume,
      loop,
      playedSeconds,
      loadedSeconds,
      durationShow,
      waveformSize
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
        className={cx('audio-player')}
      >
        <FilePlayer
          ref={this.playerRef}
          url={url}
          height="100%"
          width="100%"
          loop={loop}
          volume={volume}
          playing={playing}
          loaded={loaded}
          onPause={this.handlePause}
          onPlay={this.handlePlay}
          onEnded={this.handleEnded}
          onProgress={this.handleProgress}
          onDuration={this.handleDuration}
          config={{
            file: {
              forceAudio: true,
            },
          }}
        />
        <div className="audio-player__play-pause">
          <PlayButton
            onClick={this.handlePlayPause}
            size='small'
            aria-label="Play / Pause"
          >
            {playing ? (
              <FontAwesomeIcon icon={faPause} />
            ) : (
              <FontAwesomeIcon icon={faPlay} />
            )}
          </PlayButton>
        </div>
        <div className="audio-player__waveform" ref={this.waveformContainerRef}>
          <AudioWaveform 
            waveform={this.props.waveform}
            playedSeconds={playedSeconds}
            loadedSeconds={loadedSeconds}
            duration={duration}
            accentColor={this.props.accentColor}
            onSeek={this.commitSeeking}
            size={waveformSize}/>
        </div>
      </div>
    );
  };

  render() {
    return <div>{this.renderAudioPlayer()}</div>;
  }
}

export { AudioPlayer };
