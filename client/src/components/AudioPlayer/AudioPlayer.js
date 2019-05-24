import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import axios from 'axios';

import webAudioTouchUnlock from 'web-audio-touch-unlock';

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

class AudioPlayer extends Component {
  componentDidMount() {
    this.unlockWebAudio();
    this.createAudioBuffers();
  }

  componentDidUpdate(prevProps) {
    const { timer } = this.props;
    const prevTimer = prevProps.timer;

    if (
      prevTimer.alarmSound !== timer.alarmSound 
      || prevTimer.tickSound !== timer.tickSound
    ) {
      this.createAudioBuffers();
    }

    if (prevTimer.timeLeft > timer.timeLeft && timer.active) {
      if (timer.timeLeft < 1 && timer.alarmSound) {
        this.playSound(this.alarm);
      } else if (timer.tickSound) {
        this.playSound(this.tick);
      }
    }
  }

  async unlockWebAudio() {
    try {
      await webAudioTouchUnlock(audioCtx);
    } catch(err) {
      console.log(err);
    }
  }

  async createAudioBuffers() {
    const { alarmSound, tickSound } = this.props.timer;

    try {
      if (alarmSound) {
        const alarmResponse = await axios.get(alarmSound, { responseType: 'arraybuffer' });
        this.alarm = alarmResponse.data;
      } else {
        this.alarm = null;
      }

      if (tickSound) {
        const tickResponse = await axios.get(tickSound, { responseType: 'arraybuffer' });
        this.tick = tickResponse.data;
      } else {
        this.tick = null;
      }
    } catch(err) {
      console.log(err);
    }
  }

  playSound(audioBuffer) {
    if (!audioBuffer) {
      return;
    }

    const copy = audioBuffer.slice(0);

    audioCtx.decodeAudioData(copy, buffer => {
      const source = audioCtx.createBufferSource();
    
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start();
    }, 
    (err) => console.log(err));
  }

  render() {
    return null;
  }
}

AudioPlayer.propTypes = {
  timer: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  timer: state.timer
});

export default connect(
  mapStateToProps,
  {}
)(AudioPlayer);