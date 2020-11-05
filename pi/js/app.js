const firebase = require("firebase/app");
require("firebase/firestore");
const http = require('http');
const playSound = require('play-sound');
const SerialPort = require('serialport')

const arduino = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 })

var player = playSound(opts = { player: 'mpg123' });

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

const PORT = 3000;




function play(file){
  return player.play(file, function (err) {
    if (err) {
      console.log(err)
    }
  })
}

function growl(){
  play("mp3/monster_gigante.mp3");
}

function fire(){
  play("mp3/fire.mp3");
  arduino.write('wipe-red\n')
}

const server = http.createServer((req, res) => {
  console.log('start')

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello dev.to!\n'); 
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);

  // TODO: insert doc in monsters collection.
  
  // TODO: don't hardcode monster ID.
  const monster = db.collection('monsters').doc('XifqFglx6OzCOmm8wgYa').collection('events');

  monster.onSnapshot(event => {
    if (event.empty) {
      console.log(`No event received`);
      return;
    }
    
    console.log(`Received monster snapshot: ${JSON.stringify(event.docs[0].data())}`);
  }, err => {
    console.log(`Encountered error: ${err}`);
  });
  
  growl();
  setTimeout(()=>{
    console.log("timeout done");
    fire();
  }, 2000);
});