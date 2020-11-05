const http = require('http');
// var GrovePi = require('node-grovepi').GrovePi
var player = require('play-sound')(opts = { player: 'mpg123' });
// https://github.com/shime/play-sound

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
});