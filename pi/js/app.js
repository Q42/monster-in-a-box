const firebase = require("firebase/app");
require("firebase/firestore");
const http = require('http');
const playSound = require('play-sound');
const SerialPort = require('serialport');
const Confetti = require('../../confetti/Confetti.js');

const arduino = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 })

var player = require('play-sound')(opts = { player: 'mpg123' });
// https://github.com/shime/play-sound

var firebaseConfig = {
  apiKey: "AIzaSyBDVrJK2AS0wvEqbEDXYPgTcRfgCSvK_ow",
  authDomain: "monster-in-a-box.firebaseapp.com",
  databaseURL: "https://monster-in-a-box.firebaseio.com",
  projectId: "monster-in-a-box",
  storageBucket: "monster-in-a-box.appspot.com",
  messagingSenderId: "1033659239426",
  appId: "1:1033659239426:web:8bd2748fe715baab84ab1b",
  measurementId: "G-SZZP4B9E1D"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Initialise the confetti object.
const confetti = new Confetti();

const PORT = 3000;


function play(file){
  return player.play(file, function (err) {
    if (err) {
      console.log(err)
    }
  })
}

function growl(){
  return player.play('mp3/monster_gigante.mp3', function (err) {
    if (err) {
      console.log(err)
    }
  })
}

function fire(){
  play("mp3/fire.mp3");
  arduino.write('wipe-red\n')
}

function fireConfetti() {
  console.log('firing confetti');
  confetti.startFire();
  setTimeout(() => {
    console.log('standing down');
    confetti.stopFire();
  }, 3000);
}

function borrelFondleParrot() {
  console.log('A parrot tweets #metoo');
  fireConfetti();
}

const server = http.createServer((req, res) => {
  // $ mplayer can not 

  
    // player.play(
    //   'mp3/old-car-engine_daniel_simion.mp3',
    //   (err, data) =>console.log(err, data)
    // );
    console.log('start')
    // { mpg123: ['-volume', 50] /* lower volume for afplay on OSX */ }
  
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello dev.to!\n'); 

  // setTimeout(() => {
  //   p.kill();
  //   player.play('mp3/MONSTER_Echo.mp3',
  //     function (err) {
  //       console.log(err);
  //     }
  //   );
  // }, 2000)

});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);

  // TODO: insert doc in monsters collection.
  
  // TODO: don't hardcode monster ID.
  const monster = db.collection('monsters').doc('Arian').collection('events');

  monster.onSnapshot(evnt => {
    if (evnt.empty) {
      console.log(`No event received`);
      return;
    }

    const event = evnt.docs[0].data();
    
    console.log(`Received monster snapshot: ${JSON.stringify(event)}`);

    if (event.type === "fondleParrot") {
      borrelFondleParrot();
    }
  }, err => {
    console.log(`Encountered error: ${err}`);
  });
  
  growl();
  setTimeout(()=>{
    console.log("timeout done");
    fire();
  }, 2000);
});