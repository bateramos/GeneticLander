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
const INITIAL_HEIGHT = 10000;

genetic.seed = () => {
  return new Lander([Math.random(), Math.random(), Math.random()], INITIAL_HEIGHT, GRAVITY);
};

genetic.mutate = (lander) => {
  const { variables } = lander.verticalThrusterLogicModule;
  for (let i = 0; i < variables.length; i++) {
    variables[i] += Math.random() * (Math.random() > 0.5 ? 1 : -1);
  }
  return new Lander(variables, INITIAL_HEIGHT, GRAVITY);
};

function simulateDescent(lander, onTickEnd) {
  let timePassed = 0;
  let i = 0;
  // 60s
  while(i++ < 10 * 60 * 10) {
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
      result = -1000;
    }
    if (lander.landed || lander.crashLanded) {
      const timeFitness = 2 / timePassed;
      const landingFitness = lander.height < 0 ? lander.height * 1000 : 1000;
      result = timeFitness + landingFitness;
    }
  });

  return result;
};

const bestFitness = [];
genetic.notification = (pop, gen, stats, isFinished) => {
  const bestFit = pop.sort((p1, p2) => p1.fitness < p2.fitness ? 1 : -1)[0];

  const lander = new Lander(
    bestFit.entity.verticalThrusterLogicModule.variables,
    INITIAL_HEIGHT, GRAVITY
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
  iterations: 10000,
  size: 40,
  mutation: 0.4,
  skip: 1000
});
