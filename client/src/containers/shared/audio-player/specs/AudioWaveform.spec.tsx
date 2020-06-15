import React from 'react';
import { mount } from 'enzyme';
import AudioWaveform, { WaveformSize } from '../AudioWaveform';

describe('audio waveform', () => {

  it('renders children', () => {
    const waveform = [...Array(1000)].map((_, i) => i%128);
    const children = (<div className="waveform-children"></div>)
    const audioWaveform = mount(<AudioWaveform 
      waveform={waveform}
      accentColor="000000"
      playedSeconds={0}
      loadedSeconds={0}
      duration={60}
      size={WaveformSize.Unknown}
      onSeek={() => null}
    >{children}</AudioWaveform>);
    expect(audioWaveform.find('.waveform-children').length).toEqual(1);
  });

  describe('snapshot', () => {
    const waveform = [...Array(1000)].map((_, i) => i%128);
    let wrapper;

    describe('waveform size', () => {

      beforeEach(() => {
        wrapper = mount(<AudioWaveform 
          waveform={waveform}
          accentColor="ABABAB"
          playedSeconds={0}
          loadedSeconds={0}
          duration={60}
          size={WaveformSize.Unknown}
          onSeek={() => null}
        />);
      });
  
      it('matches for XSmall', () => {
        wrapper.setProps({ size: WaveformSize.XSmall })
  
        const canvas = wrapper.find('canvas').getDOMNode();
        const ctx = canvas.getContext('2d');
        const events = ctx.__getEvents();
        expect(events).toMatchSnapshot();
      });
  
      it('matches for Small', () => {
        wrapper.setProps({ size: WaveformSize.Small })
  
        const canvas = wrapper.find('canvas').getDOMNode();
        const ctx = canvas.getContext('2d');
        const events = ctx.__getEvents();
        expect(events).toMatchSnapshot();
      });
  
      it('matches for Medium', () => {
        wrapper.setProps({ size: WaveformSize.Medium })
  
        const canvas = wrapper.find('canvas').getDOMNode();
        const ctx = canvas.getContext('2d');
        const events = ctx.__getEvents();
        expect(events).toMatchSnapshot();
      });
  
      it('matches for Large', () => {
        wrapper.setProps({ size: WaveformSize.Large })
  
        const canvas = wrapper.find('canvas').getDOMNode();
        const ctx = canvas.getContext('2d');
        const events = ctx.__getEvents();
        expect(events).toMatchSnapshot();
      });
  
      it('matches for XLarge', () => {
        wrapper.setProps({ size: WaveformSize.XLarge })
  
        const canvas = wrapper.find('canvas').getDOMNode();
        const ctx = canvas.getContext('2d');
        const events = ctx.__getEvents();
        expect(events).toMatchSnapshot();
      });
    });

    describe('audio player progress seconds', () => {
      beforeEach(() => {
        wrapper = mount(<AudioWaveform 
          waveform={waveform}
          accentColor="ABABAB"
          playedSeconds={0}
          loadedSeconds={30}
          duration={60}
          size={WaveformSize.Unknown}
          onSeek={() => null}
        />);
        wrapper.setProps({ 
          size: WaveformSize.Medium
        });
      });
  
      it('matches for playedSeconds changed', () => {
        wrapper.setProps({ 
          playedSeconds: 15
        });
  
        const canvas = wrapper.find('canvas').getDOMNode();
        const ctx = canvas.getContext('2d');
        const events = ctx.__getEvents();
        expect(events).toMatchSnapshot();
      });
  
      it('matches for loadedSeconds changed', () => {
        wrapper.setProps({ 
          loadedSeconds: 45
        });
  
        const canvas = wrapper.find('canvas').getDOMNode();
        const ctx = canvas.getContext('2d');
        const events = ctx.__getEvents();
        expect(events).toMatchSnapshot();
      });
    });

    describe('on mouse events', () => {
      beforeEach(() => {
        wrapper = mount(<AudioWaveform 
          waveform={waveform}
          accentColor="ABABAB"
          playedSeconds={0}
          loadedSeconds={30}
          duration={60}
          size={WaveformSize.Medium}
          onSeek={() => null}
        />);
        wrapper.setProps({ 
          size: WaveformSize.Medium
        });
      });
  
      it('matches for onMouseMove', () => {
        const canvas = wrapper.find('canvas');

        canvas.simulate('mousemove', { 
          clientX: canvas.getDOMNode().getBoundingClientRect().x + 20 
        });

        const ctx = canvas.getDOMNode().getContext('2d');
        const events = ctx.__getEvents();
        expect(events).toMatchSnapshot();
      });
  
      it('matches for onMouseDown', () => {
        const canvas = wrapper.find('canvas');

        canvas.simulate('mousedown', { 
          clientX: canvas.getDOMNode().getBoundingClientRect().x + 10 
        });

        const ctx = canvas.getDOMNode().getContext('2d');
        const events = ctx.__getEvents();
        expect(events).toMatchSnapshot();
      });
    });
  });
});