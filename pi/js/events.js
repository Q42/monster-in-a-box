const Confetti = require('../../confetti/Confetti.js');
const playSound = require('play-sound');
const SerialPort = require('serialport');

class Events {
  constructor() {
    // Initialise the confetti object.
    this.confetti = new Confetti();
    this.arduino = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 });
    this.player = playSound({ player: 'mpg123' });
  }

  /***********************
   ** low-level actions **
   ***********************/

  play(file, timeout){
    setTimeout(() => {
      return this.player.play(file, function (err) {
        if (err) {
          console.log(err)
        }
      })
    }, timeout);
  }
  
  // wipe-red
  led(cmd, timeout){
    setTimeout(() => {
      this.arduino.write(cmd + "\n");
    }, timeout);
  }

  /************************
   ** high-level actions **
   ************************/

  wakeUp() {
    // this.play('mp3/grunt.mp3', 500);
    this.play('mp3/slap.mp3', 4000);
    // this.play('mp3/monster_gigante.mp3', 5000);
    this.led('wipe-red', 5000);
  }
  
  fireConfetti() {
    console.log('begin firing confetti');
    this.confetti.startFire();
    setTimeout(() => {
      console.log('standing down');
      this.confetti.stopFire();
    }, 6000);
  }

  /*******************
   ** borrel events **
   *******************/
  
  borrelFondleParrot() {
    console.log('A parrot tweets #metoo');
    this.fireConfetti();
  }
}

module.exports = Events;