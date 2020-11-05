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
  
  fireConfetti() {
    console.log('begin firing confetti');
    this.confetti.startFire();
    setTimeout(() => {
      console.log('standing down');
      this.confetti.stopFire();
    }, 6000);
  }
  
  borrelFondleParrot() {
    console.log('A parrot tweets #metoo');
    this.fireConfetti();
  }
}

module.exports = Events;