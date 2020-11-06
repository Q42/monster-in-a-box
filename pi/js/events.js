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

  /***********************
   ** low-level actions **
   ***********************/

  play(file, timeout){
    this.clearLoop();
    const that = this;
    setTimeout(() => {
      // this.playing.kill();
      console.log('play ' + file);
      this.playing = this.player.play(file, function (err) {
        if (err) {
          console.log(err)
        }
        that.loop();
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

  /*******************
   ** borrel events **
   *******************/
  
  borrelFondleParrot() {
    console.log('A parrot tweets #metoo');
    if (this.arduino) {
      this.led("wipe-out");
    }
  }

  boot() {
    this.play(`mp3/${this.monsterID} boot.mp3`, 500);
    if (this.monsterID === "Korjan") {
      this.led('wipe-red', 6000);
    }
    if (this.monsterID === "Arian") {
    }
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
      const file = `mp3/${this.monsterID} idle.mp3`;
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

  borrelHighNote() {
    console.log('Hitting the high note, the fat lady sings');
    if (this.monsterID === "Korjan") {
      this.led("wipe-out");
    }
    if (this.monsterID === "Arian") {
      this.fireConfetti();
    }
  }
  borrelFatLadyFalls() {
    this.borrelHighNote();
  }

  borrelOtherUserJoined() {
    this.play(`mp3/${this.monsterID} announcement.mp3`);
  }

  borrelUserJoined() {
    this.play(`mp3/${this.monsterID} join.mp3`);
  }
}

module.exports = Events;