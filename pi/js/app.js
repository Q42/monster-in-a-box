const http = require('http');
const playSound = require('play-sound');
// var GrovePi = require('node-grovepi').GrovePi
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')



const arduino = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 })

// parser.on('data', line => console.log(`> ${line}`))

// setTimeout(() => {
//   console.log('sent wipe-red');
// },5000)

var player = require('play-sound')(opts = { player: 'mpg123' });
// https://github.com/shime/play-sound

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
  growl();
  setTimeout(()=>{
    console.log("timeout done");
    fire();
  }, 2000);
});