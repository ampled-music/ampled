import './audio-player.scss';

import * as React from 'react';

import ReactPlayer from 'react-player';
// import { Duration } from './controls/Duration';

import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import IconButton from '@material-ui/core/IconButton';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
        loop: false,
    };

    load = () => {
        this.setState({
            url: this.props.url,
            played: 0,
            loaded: 0,
        })
    }

    handlePlayPause = () => {
        console.log(this.state)
        this.setState({ playing: !this.state.playing })
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
    handleVolumeChange = e => {
        this.setState({ volume: parseFloat(e.target.value) })
    }
    handleSeekMouseDown = e => {
        this.setState({ seeking: true })
    }
    handleSeekChange = e => {
        this.setState({ played: parseFloat(e.target.value) })
    }
    handleSeekMouseUp = e => {
        this.setState({ seeking: false })
    }
    handleProgress = state => {
        console.log('onProgress', state)
        // We only want to update time slider if we are not currently seeking
        if (!this.state.seeking) {
            this.setState(state)
        }
    }
    handleEnded = () => {
        this.setState({ playing: this.state.loop })
    }
    handleDuration = (duration) => {
        this.setState({ duration })
    }

    renderAudioPlayer = () => {

        const { url, playing, played, loaded, controls, volume, loop, playedSeconds, loadedSeconds } = this.state;
        const PlayButton = withStyles({
            root: {
                color: this.props.accentColor,
                width: '70px',
                height: '70px',
                '&:hover': {
                },
                '&:active': {
                },
                '&:focus': {
                },
            },
        })(IconButton);
        const AudioSlider = withStyles({
            root: {
                color: this.props.accentColor,
                height: 20,
            },
            thumb: {
                height: 30,
                width: 4,
                backgroundColor: '#fff',
                borderRadius: 0,
                marginTop: -10,
                marginLeft: -2,
                '&:focus,&:hover,&$active': {
                    boxShadow: 'inherit',
                },
            },
            active: {},
            track: {
                height: 20,
            },
            rail: {
                height: 20,
            },
        })(Slider);

        return (
            <div className="audio-player">
                {console.log(this.state)}
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
                    min={0}
                    max={loadedSeconds}
                    value={playedSeconds}
                />

            </div>
        );
    };

    render() {
        return <div>{this.renderAudioPlayer()}</div>;
    }
}

export { AudioPlayer };