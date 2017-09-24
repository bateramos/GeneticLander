const Lander = require('./Lander');

const lander = new Lander();

while(true) {
  lander.tick();
  console.log(lander.height, lander.descentSpeed);
  if (lander.landed) return console.log('landed');
  if (lander.crashLanded) return console.log('crash landed');
}
