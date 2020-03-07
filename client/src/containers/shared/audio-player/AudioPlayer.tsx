import './audio-player.scss';

import * as React from 'react';
import cx from 'classnames';

import FilePlayer from 'react-player/lib/players/FilePlayer';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import { IconButton, Slider } from '@material-ui/core/';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { theme } from './theme';

interface AudioPlayerProps {
  url: string;
  image: string;
  accentColor: string;
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
}

class AudioPlayer extends React.Component<AudioPlayerProps, AudioPlayerState> {
  state = {
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
  };

  load = () => {
    this.setState({
      url: this.props.url,
      played: 0,
      loaded: 0,
    });
  };

  player: any;

  ref = (player) => {
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

  // Start and finish only work with mouse up and mouse down events which break the material ui slider
  startSeeking = () => {
    this.setState({ seeking: true });
  };

  finishSeeking = () => {
    this.setState({ seeking: false });
  };

  commitSeeking = (value) => {
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
      // controls,
      volume,
      loop,
      playedSeconds,
      loadedSeconds,
      durationShow,
    } = this.state;
    const PlayButton = withStyles({
      root: {
        color: '#fff',
        width: this.props.image ? '70px' : '40px',
        height: this.props.image ? '70px' : '40px',
        zIndex: 10,
        marginTop: this.props.image ? '0' : '5px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
        },
      },
    })(IconButton);
    const AudioSlider = withStyles({
      root: {
        color: this.props.accentColor,
        height: this.props.image ? '20px' : '50px',
      },
      thumb: {
        height: this.props.image ? '35px' : '50px',
        marginTop: this.props.image ? '-15px' : '0px',
      },
      valueLabel: {
        paddingTop: this.props.image ? '0' : '3px',
      },
      track: {
        height: this.props.image ? '20px' : '50px',
      },
      rail: {
        height: this.props.image ? '20px' : '50px',
      },
    })(Slider);

    return (
      <MuiThemeProvider theme={theme}>
        <div
          className={cx('audio-player ', { 'with-image': this.props.image })}
        >
          <FilePlayer
            ref={this.ref}
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
              size={this.props.image ? 'medium' : 'small'}
              aria-label="Play / Pause"
            >
              {playing ? (
                <FontAwesomeIcon icon={faPause} />
              ) : (
                <FontAwesomeIcon icon={faPlay} />
              )}
            </PlayButton>
          </div>
          <AudioSlider
            className="audio-player__slider"
            min={0}
            max={loadedSeconds}
            value={playedSeconds}
            valueLabelDisplay={durationShow}
            valueLabelFormat={this.valueLabelFormat}
            onChange={this.commitSeeking}
          />
        </div>
      </MuiThemeProvider>
    );
  };

  render() {
    return <div>{this.renderAudioPlayer()}</div>;
  }
}

export { AudioPlayer };
