const audio = document.getElementById('player');
const wrap  = document.getElementById('playerWrap');

const player = new Plyr(audio, {
  controls: [
    'play',
    'progress',
    'current-time',
    'mute',
    'volume'
  ],
  autoplay: false,
  resetOnEnd: true
});
