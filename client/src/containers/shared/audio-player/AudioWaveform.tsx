import './audio-waveform.scss';

import React, { useRef, useState, useEffect } from 'react'

import { RGB_Linear_Shade, hexToRGB } from '../../../styles/utils'

const WAVEFORM_MAX_HEIGHT = 30;
const MAX_SEEK_FREQUENCY_IN_MS = 200;

enum WaveformSize { Unknown, Small, Large }

// IMPORTANT: these config values are highly calibrated for each size.
//
// If you change one value for a particular size, at least one other value
// for that size likely needs to be changed as well. This complexity is largely
// due to resampling by modulo operator in combination with measuring mouse pointer
// against canvas width to calculate progress.
const SizeConfiguration = (size: WaveformSize) => {
  switch(size) {
    case WaveformSize.Large:
      return {
        samplingModulo: 4,          // 300 % 4      = 75 samples
        barWidth: 4,                // 4 * 75       = 300 px
        barSpacing: 2,              // 2 * (75-1)   = 148 px
        canvasWidth: 448,           // 300 + 148    = 448 px
      };
    case WaveformSize.Small:
      return {
        samplingModulo: 6,          // 300 % 6      = 50 samples
        barWidth: 4,                // 4 * 50       = 200 px
        barSpacing: 2,              // 2 * (50-1)   = 98 px
        canvasWidth: 298,           // 200 + 98     = 298 px
      };
    default:
      return null;
  }
}

interface AudioWaveformProps {
  waveform: number[];
  accentColor: string;
  playedSeconds: number;
  loadedSeconds: number;
  duration: number;
  size: WaveformSize;
  onSeek: (number) => void;
  children?: React.ReactNode;
}

const AudioWaveform = (props: AudioWaveformProps) => {
  const canvasRef = useRef(null);
  const [waveformSamples, setWaveformSamples]= useState([]);
  const [colorPalette, setColorPalette] = useState(null);
  const [lastSeekCommit, setLastSeekCommit] = useState(null);
  const [seeking, setSeeking] = useState(false);
  const [animation, setAnimation] = useState(false);

  // Helper functions
  const updateWaveformSamples = (updateSample) => { 
    if (waveformSamples.length === 0) return;
    setWaveformSamples(waveformSamples.map(updateSample)); 
  }
  const commitSeek = (progress) => {
    if (lastSeekCommit && lastSeekCommit >= (Date.now() - MAX_SEEK_FREQUENCY_IN_MS)) return;
    props.onSeek(progress);
    setLastSeekCommit(Date.now());
  }
  const drawWaveformSample = (ctx, x, height) => {
    ctx.fillRect(
      0 + (x * (SizeConfiguration(props.size).barWidth + SizeConfiguration(props.size).barSpacing)), 
      WAVEFORM_MAX_HEIGHT, 
      SizeConfiguration(props.size).barWidth, 
      -height);
  }

  // Set color palette
  useEffect(() => {
    setColorPalette({
      loaded: props.accentColor,
      loading: RGB_Linear_Shade(0.2, hexToRGB(props.accentColor, 1)),
      hover: RGB_Linear_Shade(-0.2, hexToRGB(props.accentColor, 1)),
      played: RGB_Linear_Shade(-0.4, hexToRGB(props.accentColor, 1)),
    })
  }, [props.accentColor]);

  // Resample on size change
  useEffect(() => {
    if (props.size !== WaveformSize.Unknown) {
      setWaveformSamples(props.waveform
        .filter((_, i) => i%(SizeConfiguration(props.size).samplingModulo) === 0)
        .map((amplitude) => ({ amplitude, loaded: false, played: false, hovered: false, animated: false }))
      );
      setAnimation(true);
    }
  }, [props.size])

  // Draw waveform animation
  useEffect(() => {
    if (!animation) return;
    if (waveformSamples.every((sample) => sample.animated)) return;
    console.log("ANIMATING");
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = colorPalette.loading;
    waveformSamples.forEach((sample, x) => {
      const normalizedAmplitude = Math.ceil((sample.amplitude  / 128) * WAVEFORM_MAX_HEIGHT);
      const fill = (height) => {
        // base case (sample animation complete)
        if (height > normalizedAmplitude) {
          setWaveformSamples((prevWaveformSamples) => prevWaveformSamples.map((prevSample, i) => ({ ...prevSample, animated: prevSample.animated || i === x })));
          return;
        }
        // recursion
        drawWaveformSample(ctx, x, height);
        height++;
        setTimeout(() => fill(height), Math.abs(height-20));
      }
      fill(0);
    })
    setAnimation(false);
  }, [animation])

  // Draw waveform when samples change or when size changes
  useEffect(() => {
    if (!waveformSamples.every((sample) => sample.animated)) return;
    const getSampleColor = (sample) => {
      if (sample.played) return colorPalette.played;
      if (sample.hovered) return colorPalette.hover;
      if (sample.loaded) return colorPalette.loaded;
      return colorPalette.loading;
    }

    const ctx = canvasRef.current.getContext('2d');
    waveformSamples.forEach((sample, i) => {
      const normalizedAmplitude = (sample.amplitude  / 128) * WAVEFORM_MAX_HEIGHT;
      ctx.fillStyle = getSampleColor(sample);
      drawWaveformSample(ctx, i, Math.ceil(normalizedAmplitude));
    })
  }, [waveformSamples])

  // Update samples when load/play progress changes
  useEffect(() => {
    if (seeking) return;
    const loadedProgress = props.loadedSeconds / props.duration;
    const loadedSamples = Math.floor(loadedProgress * waveformSamples.length)
    const playedProgress = props.playedSeconds / props.duration;
    const playedSamples = Math.floor(playedProgress * waveformSamples.length)

    const updateSample = (sample, i) => ({
      ...sample,
      played: i <= playedSamples,
      loaded: i <= loadedSamples
    });

    updateWaveformSamples(updateSample);
  }, [props.loadedSeconds, props.playedSeconds])


  // Mouse event handlers
  const handleMouseMove = (e) => {
    const canvasX = e.clientX - canvasRef.current.getBoundingClientRect().x;
    const progress = canvasX / canvasRef.current.clientWidth;
    const samples = Math.floor(progress * waveformSamples.length)

    if (seeking){
      updateWaveformSamples((sample, i) => ({ ...sample, played: i <= samples }));
      commitSeek(progress);
    } else {
      updateWaveformSamples((sample, i) => ({ ...sample, hovered: i <= samples }));
    }
  }

  const handleMouseDown = (e) => {
    const canvasX = e.clientX - canvasRef.current.getBoundingClientRect().x;
    const progress = canvasX / canvasRef.current.clientWidth;
    const samples = Math.floor(progress * waveformSamples.length)

    updateWaveformSamples((sample, i) => ({ ...sample, played: i <= samples }));
    commitSeek(progress);
    setSeeking(true);
  }

  const handleMouseUp = (e) => {
    handleMouseMove(e);
    setSeeking(false);
  }

  const handleMouseOut = () => {
    setSeeking(false);
    updateWaveformSamples((sample) => ({ ...sample, hovered: false }));
  }

  return (
    <div 
      className="audio-waveform"
      style={{
        width: `${SizeConfiguration(props.size)?.canvasWidth}px`,
        height: `${WAVEFORM_MAX_HEIGHT}px`
      }}
    >
      {props.children}
      <canvas
        width={`${SizeConfiguration(props.size)?.canvasWidth}px`}
        height={`${WAVEFORM_MAX_HEIGHT}px`}
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        ref={canvasRef}/>
    </div>
  )
}

export { WaveformSize }
export default AudioWaveform;
