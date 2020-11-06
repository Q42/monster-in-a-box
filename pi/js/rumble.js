const playSound = require('play-sound');
const player = playSound({ player: 'mpg123' });
player.play("mp3/lowrumble.mp3", function (err) {
  if (err) {
    console.log(err)
  }
});