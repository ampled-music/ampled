import './audio-player.scss';

import * as React from 'react';

import ReactPlayer from 'react-player';
import { Duration } from './controls/Duration';
import { config } from '../../../config';

class AudioPlayer extends React.Component<any, any> {
    state = {
        expanded: false,
        url: null,
        playing: false,
        controls: false,
        volume: 0.8,
        played: 0,
        loaded: 0,
        duration: 0,
        playbackRate: 1.0,
        loop: false
    };

    handlePlayPause = () => {
        console.log('onPlayPause')
        this.setState({ playing: !this.state.playing })
    }
    handlePause = () => {
        this.setState({ playing: false })
    }
    handleDuration = (duration) => {
        this.setState({ duration })
    }

    renderAudioPlayer = (audioFile) => {

        const { playing, played, duration, loaded, controls, volume, loop } = this.state;
        const playableUrl = `${config.aws.playableBaseUrl}${audioFile}`;

        return (
            <div className="audio-player">
                <ReactPlayer
                    url={playableUrl}
                    controls={controls}
                    loop={loop}
                    volume={volume}
                    playing={playing}
                    played={played}
                    loaded={loaded}
                    onPause={this.handlePause}
                    config={{
                        file: {
                            forceAudio: true
                        }
                    }}
                />
                <button onClick={this.handlePlayPause}>{playing ? 'Pause' : 'Play'}</button>
                <div>{played.toFixed(3)}</div>
                <div>{loaded.toFixed(3)}</div>
                <div>duration <Duration seconds={duration} /></div>
                <div>elapsed <Duration seconds={duration * played} /></div>
                <div>
                </div>
                <div>
                    <progress max={1} value={played} />
                    <br />
                    <progress max={1} value={loaded} />
                </div>
            </div>
        );
    };

    render() {
        return <div>{this.renderAudioPlayer()}</div>;
    }
}

export { AudioPlayer };