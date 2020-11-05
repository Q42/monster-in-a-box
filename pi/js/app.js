const firebase = require("firebase/app");
require("firebase/firestore");
const http = require('http');
const Events = require('./events.js');


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

// Initialise Events
const events = new Events();

async function checkMonsterDocEntry(monsterID) {
  console.log('Checking existence of monster doc entry');
  const monsterRef = db.collection('monsters').doc(monsterID);
  const monsterDoc = await monsterRef.get();

  if (!monsterDoc.exists) {
    console.log('No monster document yet. Creating one now...');
    db.collection('monsters').doc(monsterID).set({});
  } 
}

const server = http.createServer((req, res) => {
  console.log('start')

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello dev.to!\n'); 
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);

  // Check if db entries exist. If not, create them.
  const monsterID = 'Arian';
  checkMonsterDocEntry(monsterID);

  const monster = db.collection('monsters').doc(monsterID).collection('events');

  monster.onSnapshot(evnt => {
    if (evnt.empty) {
      console.log(`No event received`);
      return;
    }

    const event = evnt.docs[0].data();
    
    console.log(`Received monster snapshot: ${JSON.stringify(event)}`);

    if (event.type === "fondleParrot") {
      events.borrelFondleParrot();
    }
  }, err => {
    console.log(`Encountered error: ${err}`);
  });
  
  // play('mp3/grunt.mp3', 500);
  events.play('mp3/slap.mp3', 4000);
  // play('mp3/monster_gigante.mp3', 5000);
  events.led('wipe-red', 5000);
});