const firebase = require("firebase/app");
require("firebase/firestore");
const http = require('http');
const Events = require('./events.js');
const dbManager = require('./dbManager.js');

const monsterID = 'Arian';
console.log('booting party animal ' + monsterID);

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
const events = new Events(monsterID);

async function checkMonsterDocEntry(monsterID) {
  console.log('Checking existence of monster doc entry');
  const monsterRef = db.collection('monsters').doc(monsterID);
  const monsterDoc = await monsterRef.get();

  if (!monsterDoc.exists) {
    console.log('No monster document yet. Creating one now...');
    db.collection('monsters').doc(monsterID).set({});
  } 

  const oldEventsRef = db.collection('monsters').doc(monsterID).collection('events');
  const oldEvents = await oldEventsRef.get();
  const batch = db.batch();
  oldEvents.docs.forEach(async (event) => {
    await batch.delete(event.ref);
  });
  await batch.commit();
}

const server = http.createServer((req, res) => {
  console.log('start')

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello dev.to!\n'); 
});

server.listen(PORT, async() => {
  console.log(`Server running on port ${PORT}.`);

  // Check if db entries exist. If not, create them.
  await checkMonsterDocEntry(monsterID);

  const monster = db.collection('monsters').doc(monsterID).collection('events');

  monster.onSnapshot(evnt => {
    if (evnt.empty) {
      console.log(`No event received`);
      return;
    }

    const event = evnt.docs.sort((doc1, doc2) => {
      return doc1.data().timestamp - doc2.data().timestamp;
    })[evnt.size - 1].data();
    
    console.log(`Received monster snapshot: ${JSON.stringify(event)}`);

    if (event.type === "fondleParrot") {
      events.borrelFondleParrot();
    }
    else if (event.type === "userJoined") {
      if (event.newUser === monsterID) {
        events.borrelUserJoined();
      } else {
        events.borrelOtherUserJoined();
      }
    } else if (event.type === 'fatLadyFalls') {
      events.borrelFatLadyFalls();
    } else {
      console.warn(`received unknown event - type: ${event.type}`);
    }
  }, err => {
    console.warn(`Encountered error: ${err}`);
  });
  
  events.boot();
});