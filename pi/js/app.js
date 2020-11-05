const http = require('http');
// var GrovePi = require('node-grovepi').GrovePi
//var player = require('play-sound')(opts = { player: 'mpg123' });
// https://github.com/shime/play-sound

var admin = require('firebase-admin');
var serviceAccount = require("./serviceaccount.json");

const PORT = 3000;

const server = http.createServer((req, res) => {
  // $ mplayer can not 

  
    // player.play(
    //   'mp3/old-car-engine_daniel_simion.mp3',
    //   (err, data) =>console.log(err, data)
    // );
    console.log('start')
    // { mpg123: ['-volume', 50] /* lower volume for afplay on OSX */ }
  const p = player.play('mp3/old-car-engine_daniel_simion.mp3', function (err) {
    if (err) {
      console.log(err)
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello dev.to!\n');
  })

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

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://monster-in-a-box.firebaseio.com'
  });

  const db = admin.firestore();

  // TODO: insert doc in monsters collection.
  
  // TODO: don't hardcode monster ID.
  const monster = db.collection('monsters').doc('XifqFglx6OzCOmm8wgYa').collection('events');

  const observer = monster.onSnapshot(event => {
    if (event.empty) {
      console.log(`No event received`);
      return;
    }
    
    console.log(`Received monster snapshot: ${JSON.stringify(event.docs[0].data())}`);
  }, err => {
    console.log(`Encountered error: ${err}`);
  });
});