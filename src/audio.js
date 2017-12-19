import Save from './save';

let audioCoin = new Audio('assets/coin.wav');
let audioCrash = new Audio('assets/crash.wav');
let audioJump = new Audio('assets/jump.wav');
audioJump.volume = 0.6;
let audioPowerup = new Audio('assets/powerup.wav');
let audioWarning = new Audio('assets/warning.wav');

function play(audio) {
  return () => {
    if (!Save.mute) {
      audio.pause();
      audio.currentTime = 0;
      audio.play();
    }
  };
}

export default {
  playCoin: play(audioCoin),
  playCrash: play(audioCrash),
  playJump: play(audioJump),
  playPowerup: play(audioPowerup),
  playWarning: play(audioWarning)
};
