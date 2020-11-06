const Confetti = require('../../confetti/Confetti.js');
const playSound = require('play-sound');
const SerialPort = require('serialport');

class Events {
  constructor(monsterID) {
    // Initialise the confetti object.
    this.playing = null;
    this.monsterID = monsterID;
    this.confetti = null;
    this.arduino = null;
    this.player = playSound({ player: 'mpg123' });
    if (this.monsterID === "Arian") {
      this.confetti = new Confetti();
    }
    if (this.monsterID === "Korjan") {
      this.arduino = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 });
    }
  }

  play(file, length, timeout){
    this.clearLoop();
    const that = this;
    setTimeout(() => {
      // this.playing.kill();
      this.playing = this.player.play(file, function (err) {
        if (err) {
          console.log(err)
        }
        that.loop();
        // console.log('will start loop in ' + length)
        // setTimeout(() => that.loop(), length);
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
    this.clearLoop();
    console.log('begin firing confetti');
    this.confetti.startFire();
    setTimeout(() => {
      console.log('standing down');
      this.confetti.stopFire();
      this.loop();
    }, 6000);
  }
  
  fondleParrot() {
    console.log('A parrot tweets #metoo');
    if (this.confetti) {
      this.fireConfetti();
    }
    if (this.arduino) {
      this.led("wipe-out");
    }
  }

  boot() {
    if (this.monsterID === "Korjan") {
      // this.play('mp3/slap.mp3', 1000, 0);
      this.play('mp3/waarisdatfeestje.mp3', 24000, 500);
      this.led('wipe-red', 3000);
    }
    if (this.monsterID === "Arian") {
      this.play('mp3/feestje arian.mp3', 11000, 500);
    }
    // this.loop();
    // setTimeout(() => this.loop(), this.monsterID === "Arian" ? 12000 : 25000);
  }

  loopTimeout = null;

  clearLoop() {
    if (this.loopTimeout) {
      console.log('stop idle loop');
      clearTimeout(this.loopTimeout);
    }
  }

  loop() {
    this.clearLoop();
    const that = this;
    const timeout = 8000 + Math.floor(Math.random() * 5000);
    console.log('start idle loop with timeout ' + timeout);
    this.loopTimeout = setTimeout(() => {
      const file = this.monsterID === "Arian" ? "mp3/arian idle.mp3" : "mp3/korjan-continuous.mp3";
      console.log('play idle ' + file);
      // this.playing.kill();
      this.playing = this.player.play(file, function (err) {
        if (err) {
          console.log(err)
        }
        that.loop();
      })
    }, timeout);
  }
}

module.exports = Events;