const fs = require('fs');
const Lander = require('./Lander');

const lander = new Lander([ 4.285848014141303, 0.8032720938695967, 2.4951927587444604]);

let timePassed = 0;
const data = [];
while(true) {
  timePassed += 0.1;
  lander.tick(timePassed);
  console.log({ height: lander.height, descentSpeed: lander.descentSpeed, thrusterSpeed: lander.thrusterSpeed});
  if (lander.landed) break;
  if (lander.crashLanded) break;
}
console.log(timePassed, lander)

