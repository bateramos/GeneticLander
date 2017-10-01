const fs = require('fs');
const Lander = require('./Lander');
const LogicModule = require('./LogicModule');

const lander = new Lander(new LogicModule([ 2.5024788890293395, -0.435491257012675, 4.122343137152582 ],[ [ 0.6709518427064198,
    0.7739601969917211,
    0.541444927795707,
    -0.7709652028704719,
    -0.4713393067452789 ] ]), 100000, 10);

let timePassed = 0;
const data = [];
while(true) {
  timePassed += 0.1;
  lander.tick(10, timePassed);
  console.log({ height: lander.height, descentSpeed: lander.descentSpeed, thrusterSpeed: lander.thrusterSpeed});
  if (lander.landed) break;
  if (lander.crashLanded) break;
}
console.log(timePassed, lander)

