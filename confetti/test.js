const Confetti = require("./Confetti");
const confetti = new Confetti();

confetti.startFire();
setTimeout(() => {
    confetti.stopFire();
}, 2000);