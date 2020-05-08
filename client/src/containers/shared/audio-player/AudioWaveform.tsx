import React, { useRef, useState, useEffect } from 'react'

import { RGB_Linear_Shade, hexToRGB } from '../../../styles/utils'

const WAVEFORM_HEIGHT = 30;
const WAVEFORM_SAMPLE_COUNT_LO = 50;
const WAVEFORM_SAMPLE_COUNT_HI = 75;
const MAX_SEEK_FREQUENCY_IN_MS = 200;

enum WaveformSize { Unknown, Small, Large }

interface AudioWaveformProps {
  waveform: number[];
  accentColor: string;
  playedSeconds: number;
  loadedSeconds: number;
  duration: number;
  size: WaveformSize;
  onSeek: (number) => void;
}

const AudioWaveform = (props: AudioWaveformProps) => {
  const canvasRef = useRef(null);
  const [waveformSamples, setWaveformSamples]= useState([]);
  const [colorPalette, setColorPalette] = useState(null);
  const [lastSeekCommit, setLastSeekCommit] = useState(null);
  const [seeking, setSeeking] = useState(false);
  const [animation, setAnimation] = useState(false);

  // Helper functions
  const getSampleCount = () => props.size === WaveformSize.Large ? WAVEFORM_SAMPLE_COUNT_HI : WAVEFORM_SAMPLE_COUNT_LO;
  const updateWaveformSamples = (updateSample) => { 
    if (waveformSamples.length === 0) return;
    setWaveformSamples(waveformSamples.map(updateSample)); 
  }
  const commitSeek = (progress) => {
    if (lastSeekCommit && lastSeekCommit >= (Date.now() - MAX_SEEK_FREQUENCY_IN_MS)) return;
    props.onSeek(progress);
    setLastSeekCommit(Date.now());
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
  // TODO: restore progress immediately on resample
  useEffect(() => {
    if (props.size !== WaveformSize.Unknown) {
      setWaveformSamples(props.waveform
        .filter((_, i) => props.size === WaveformSize.Large ? i%4 === 0 : i%6 === 0)
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
      const normalizedAmplitude = Math.ceil((sample.amplitude  / 128) * WAVEFORM_HEIGHT);
      const fill = (height) => {
        // base case (sample animation complete)
        if (height > normalizedAmplitude) {
          setWaveformSamples((prevWaveformSamples) => prevWaveformSamples.map((prevSample, i) => ({ ...prevSample, animated: prevSample.animated || i === x })));
          return;
        }
        // recursion
        ctx.fillRect(0 + (x * 6), WAVEFORM_HEIGHT, 4, -height);
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
      const normalizedAmplitude = (sample.amplitude  / 128) * WAVEFORM_HEIGHT;
      ctx.fillStyle = getSampleColor(sample);
      ctx.fillRect(0 + (i * 6), WAVEFORM_HEIGHT, 4, -Math.ceil(normalizedAmplitude));
    })
  }, [waveformSamples])

  // Update samples when load/play progress changes
  useEffect(() => {
    if (seeking) return;
    const loadedProgress = props.loadedSeconds / props.duration;
    const loadedSamples = Math.floor(loadedProgress * getSampleCount())
    const playedProgress = props.playedSeconds / props.duration;
    const playedSamples = Math.floor(playedProgress * getSampleCount())

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
    const samples = Math.floor(progress * getSampleCount())

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
    const samples = Math.floor(progress * getSampleCount())

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
    <canvas
      width={props.size == WaveformSize.Large ? '450px' : '300px'}
      height={`${WAVEFORM_HEIGHT}px`}
      style={{ borderBottom: `2px solid ${props.accentColor}`}}
      onMouseMove={handleMouseMove}
      onMouseOut={handleMouseOut}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      ref={canvasRef}/>
  )
}

export { WaveformSize }
export default AudioWaveform;
