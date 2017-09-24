const fs = require('fs');
const Lander = require('./Lander');

const lander = new Lander([0.6458289034536164,9.038386143317028,1.4741292066477054]);

let timePassed = 0;
const data = [];
while(true) {
  timePassed += 0.1;
  lander.tick(timePassed);
  data.push({ height: lander.height, descentSpeed: lander.descentSpeed, thrusterSpeed: lander.thrusterSpeed});
  if (lander.landed) break;
  if (lander.crashLanded) break;
}

console.log(data);
fs.writeFile('data.json', JSON.stringify(data), 'utf8', () => {});
