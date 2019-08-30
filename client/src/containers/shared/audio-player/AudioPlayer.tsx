import './audio-player.scss';

import * as React from 'react';

import ReactPlayer from 'react-player';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import IconButton from '@material-ui/core/IconButton';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { theme } from './theme';

interface Props {
    url: string;
    image: string;
    accentColor: string;
}

class AudioPlayer extends React.Component<Props, any> {
    state = {
        url: null,
        playing: false,
        seeking: false,
        controls: false,
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
        })
    }

    // Actions for handling audio
    handlePlayPause = () => {
        this.setState({ playing: !this.state.playing, durationShow: 'on' })
        this.load();
    }
    handlePlay = () => {
        this.setState({ playing: true })
    }
    handlePause = () => {
        this.setState({ playing: false })
    }
    handleStop = () => {
        this.setState({ url: null, playing: false })
    }
    handleEnded = () => {
        this.setState({ playing: this.state.loop, durationShow: null })
    }

    // @todo: Add a volume adjuster
    handleVolumeChange = e => {
        this.setState({ volume: parseFloat(e.target.value) })
    }

    // @todo: figure out way to seek
    handleSeekChange = e => {
        this.setState({ played: parseFloat(e.target.value) })
    }
    handleSeekMouseDown = e => {
        this.setState({ seeking: true })
    }
    handleSeekMouseUp = e => {
        this.setState({ seeking: false })
    }

    // Progress updates state
    handleProgress = state => {
        // We only want to update time slider if we are not currently seeking
        if (!this.state.seeking) {
            this.setState(state)
        }
    }

    // Show duration and total time on play
    handleDuration = (duration) => {
        this.setState({ duration })
    }
    formatTime = (seconds) => {
        const date = new Date(seconds * 1000)
        const hh = date.getUTCHours()
        const mm = date.getUTCMinutes()
        const ss = this.padSec(date.getUTCSeconds())
        if (hh) {
            return `${hh}:${this.padSec(mm)}:${ss}`
        }
        return `${mm}:${ss}`
    }
    padSec = (string) => {
        return ('0' + string).slice(-2)
    }
    valueLabelFormat = (value) => {
        return this.formatTime(value) + ` / ` + this.formatTime(this.state.loadedSeconds)
    }

    renderAudioPlayer = () => {
        const { url, playing, played, loaded, controls, volume, loop, playedSeconds, loadedSeconds, durationShow } = this.state;
        const PlayButton = withStyles({
            root: {
                color: this.props.accentColor,
            }
        })(IconButton);
        const AudioSlider = withStyles({
            root: {
                color: this.props.accentColor,
            }
        })(Slider);

        return (
            <MuiThemeProvider theme={theme}>
                <div className="audio-player">
                    <ReactPlayer
                        url={url}
                        height="100%"
                        width="100%"
                        controls={controls}
                        loop={loop}
                        volume={volume}
                        playing={playing}
                        played={played}
                        loaded={loaded}
                        onReady={() => console.log('onReady')}
                        onStart={() => console.log('onStart')}
                        onPause={this.handlePause}
                        onPlay={this.handlePlay}
                        onBuffer={() => console.log('onBuffer')}
                        onSeek={e => console.log('onSeek', e)}
                        onEnded={this.handleEnded}
                        onError={e => console.log('onError', e)}
                        onProgress={this.handleProgress}
                        onDuration={this.handleDuration}
                        config={{
                            file: {
                                forceAudio: true
                            }
                        }}
                    />
                    <div className="audio-player__play-pause">
                        <PlayButton onClick={this.handlePlayPause} size="medium">
                            {playing ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                        </PlayButton>
                    </div>
                    <AudioSlider
                        className="audio-player__slider"
                        min={0}
                        max={loadedSeconds}
                        value={playedSeconds}
                        valueLabelDisplay={durationShow}
                        valueLabelFormat={this.valueLabelFormat}
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