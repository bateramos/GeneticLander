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

genetic.seed = () => {
  return new Lander([Math.random(), Math.random(), Math.random()]);
};

genetic.mutate = (lander) => {
  const { variables } = lander.verticalThrusterLogicModule;
  for (let i = 0; i < variables.length; i++) {
    variables[i] += Math.random() * (Math.random() > 0.5 ? 1 : -1) * 0.5;
  }
  return new Lander(variables);
};

function simulateDescent(lander, onTickEnd) {
  let timePassed = 0;
  let i = 0;
  while(i++ < 10 * 60 * 60 * 10) {
    timePassed += 0.1;
    lander.tick(timePassed);
    onTickEnd(timePassed);
    if (lander.error || lander.landed || lander.crashLanded) {
      break;
    }
  }
};

genetic.fitness = (landerData) => {
  const lander = new Lander(
    landerData.verticalThrusterLogicModule.variables
  );

  let result = 0;

  simulateDescent(lander, (timePassed) => {
    if (lander.error) {
      result = -100;
    }
    if (lander.landed) {
      result = (10 / timePassed) + 50;
    }
    if (lander.crashLanded) {
      const score = 10 / timePassed - (lander.descentSpeed * 5);
      result = score;
    }
  });

  return result || lander.height / 10;
};

genetic.generation = (pop, gen, stats) => {
  return !pop.find(lander => lander.landed);
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
  iterations: 1000,
  size: 400,
  mutation: 0.5,
  skip: 50
});
