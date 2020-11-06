const Confetti = require('../../confetti/Confetti.js');
const playSound = require('play-sound');
const SerialPort = require('serialport');

class Events {
  constructor(monsterID) {
    // Initialise the confetti object.
    this.playing = null;
    this.end = false;
    this.joined = false;
    this.monsterID = monsterID;
    this.confetti = null;
    this.arduino = null;
    this.player = playSound({ player: 'mpg123' });
    if (this.monsterID === "Arian") {
      try {
        this.confetti = new Confetti();
      } catch(err) {
        console.warn("Confetti cannon not found!");
      }
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
    }, timeout || 0);
  }
  
  // wipe-red
  led(cmd, timeout){
    setTimeout(() => {
      this.arduino.write(cmd + "\n");
    }, timeout || 0);
  }

  /************************
   ** high-level actions **
   ************************/

  fireConfetti() {
    this.clearLoop();
    console.log('begin firing confetti');
    if (this.confetti) {
      this.confetti.startFire();
      setTimeout(() => {
        console.log('standing down');
        this.confetti.stopFire();
        this.loop();
      }, 6000);
    }
  }

  /*******************
   ** borrel events **
   *******************/
  
  borrelFondleParrot() {
    console.log('A parrot tweets #metoo');
    this.play(`mp3/${this.monsterID} parrot.mp3`);
    // if (this.arduino) {
    this.led("wipe-red", 500);
    // }
  }

  boot() {
    this.play(`mp3/${this.monsterID} boot.mp3`, 500);
    if (this.monsterID === "Korjan") {
      this.led("wipe-red", 1500);
      this.led('wipe-red', 4000);
      this.led("wipe-red", 6500);
      this.led("wipe-red", 9000);
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
      const file = `mp3/${this.monsterID} idle${this.joined ? "-joined" : ""}.mp3`;
      console.log('play idle ' + file);
      // this.playing.kill();
      this.led("wipe-red", 1500);
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
    this.play(`mp3/${this.monsterID} highnote.mp3`, 2000);
    this.play(`mp3/${this.monsterID} party.mp3`);
    if (this.monsterID === "Korjan") {
      this.led("wipe-red", 2000);
      this.led("wipe-red", 4000);
      this.led("wipe-red", 6000);
      this.led("wipe-red", 8000);
      this.led("wipe-red", 10000);
      this.led("wipe-red", 12000);
      this.led("wipe-red", 14000);
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
    this.led("wipe-red", 1000);
  }

  borrelUserJoined() {
    this.joined = true;
    this.play(`mp3/${this.monsterID} join.mp3`);
    this.led("wipe-red", 1000);
  }
}

module.exports = Events;