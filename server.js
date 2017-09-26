// variable: hight and terminal velocity
// 
// properties: 
// 
// actions: vertical thrusters
const fs = require('fs');
const Genetic = require('genetic-js-no-ww');
const Lander = require('./Lander');

const genetic = Genetic.create();

genetic.optimize = Genetic.Optimize.Maximize;
genetic.select1 = Genetic.Select1.Sequential;

const GRAVITY = 10;
const INITIAL_HEIGHT = 100;

genetic.seed = () => {
  return new Lander([Math.random(), Math.random(), Math.random()], INITIAL_HEIGHT, GRAVITY);
};

genetic.mutate = (lander) => {
  const { variables } = lander.verticalThrusterLogicModule;
  for (let i = 0; i < variables.length; i++) {
    variables[i] += Math.random() * (Math.random() > 0.5 ? 1 : -1);
  }
  return new Lander(variables);
};

function simulateDescent(lander, onTickEnd) {
  let timePassed = 0;
  let i = 0;
  // 60s
  while(i++ < 10 * 60) {
    timePassed += 0.1;
    lander.tick(GRAVITY, timePassed);
    onTickEnd(timePassed);
    if (lander.error || lander.landed || lander.crashLanded) {
      break;
    }
  }
};

genetic.fitness = (landerData) => {
  const lander = new Lander(
    landerData.verticalThrusterLogicModule.variables,
    INITIAL_HEIGHT, GRAVITY
  );

  let result = 0;

  simulateDescent(lander, (timePassed) => {
    if (lander.height > INITIAL_HEIGHT * 2) {
      lander.error = true;
    }
    if (lander.error) {
      result = -100;
    }
    if (lander.landed) {
      result = (10 / timePassed) + 25;
    }
    if (lander.crashLanded) {
      const score = 5 / timePassed - (lander.descentSpeed * 5);
      result = score;
    }
  });

  return result || lander.height / 20;
};

const bestFitness = [];
genetic.notification = (pop, gen, stats, isFinished) => {
  const bestFit = pop.sort((p1, p2) => p1.fitness < p2.fitness ? 1 : -1)[0];

  const lander = new Lander(
    bestFit.entity.verticalThrusterLogicModule.variables
  );
  const data = [];
  simulateDescent(lander, (timePassed) => {
    data.push({ height: lander.height, descentSpeed: lander.descentSpeed, thrusterSpeed: lander.thrusterSpeed});
  });
  console.log(gen, bestFit.fitness, bestFit.entity.verticalThrusterLogicModule.variables);
  bestFitness.push({ generation: gen, fitness: bestFit.fitness, data });
  if (!isFinished) return;

  if (!fs.existsSync('public/data')){
    fs.mkdirSync('public/data');
  }
  fs.writeFile('public/data/data.json', 'var data = ' + JSON.stringify(bestFitness), 'utf8', () => {
    console.log('fitness report on public/index.html');
  });
};

genetic.evolve({
  iterations: 40000,
  size: 400,
  mutation: 0.3,
  skip: 1000
});
