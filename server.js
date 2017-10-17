// variable: hight and terminal velocity
// 
// properties: 
// 
// actions: vertical thrusters
const fs = require('fs');
const Genetic = require('genetic-js-no-ww');
const Lander = require('./Lander');
const LogicModule = require('./LogicModule');

const args = process.argv.slice(2);

const genetic = Genetic.create();

genetic.optimize = Genetic.Optimize.Maximize;
genetic.select1 = Genetic.Select1.Sequential;
console.log(args)
const GRAVITY = 10;
const INITIAL_HEIGHT = parseInt(args[0]) || 10000;

genetic.seed = () => {
  return new Lander(new LogicModule([Math.random(), Math.random(), Math.random()]), INITIAL_HEIGHT, GRAVITY);
};

function random(number = 0) {
  return number + Math.random() * (Math.random() > 0.5 ? 5 : -5)
}

function squashing(number) {
  return number / (Math.abs(number) + 1);
}

genetic.mutate = (lander) => {
  const { variables, layers } = lander.verticalThrusterLogicModule;
  for (let i = 0; i < variables.length; i++) {
      variables[i] = random(variables[i]);
  }
  layers.forEach(layer => {
      layer.forEach((item, index) => layer[index] = random(item));
  });

  if (Math.random() > 0.9) {
    const lastLayerPosition = layers.length - 1;
    if (layers[lastLayerPosition].length > 5) {
      layers.push([]);
    } else {
      layers[lastLayerPosition].push(Math.random());
    }
  }
  const logicModule = new LogicModule(variables, layers);
  return new Lander(logicModule, INITIAL_HEIGHT, GRAVITY);
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
      return;
    }
  }
  lander.error = true;
  onTickEnd(timePassed);
};

genetic.fitness = (landerData) => {
  const lander = new Lander(
    new LogicModule(
      landerData.verticalThrusterLogicModule.variables,
      landerData.verticalThrusterLogicModule.layers,
    ),
    INITIAL_HEIGHT, GRAVITY
  );

  let result = 0;

  simulateDescent(lander, (timePassed) => {
    if (lander.height > INITIAL_HEIGHT * 1.5) {
      lander.error = true;
    }
    if (lander.error) {
      result = -10000;
    }
    if (lander.landed || lander.crashLanded) {
      const timeFitness = 1/timePassed;
      const landingFitness = lander.height < 0 ? lander.height * 10 : 1000;
      result = timeFitness + landingFitness;
    }
  });

  return result;
};

const bestFitness = [];
genetic.notification = (pop, gen, stats, isFinished) => {
  const bestFit = pop.sort((p1, p2) => p1.fitness < p2.fitness ? 1 : -1)[0];
  const { variables, layers } = bestFit.entity.verticalThrusterLogicModule;
  const lander = new Lander(
    new LogicModule(variables, layers),
    INITIAL_HEIGHT, GRAVITY
  );
  const data = [];
  simulateDescent(lander, (timePassed) => {
    data.push({ height: lander.height, descentSpeed: lander.descentSpeed, thrusterSpeed: lander.thrusterSpeed});
  });
  console.log(gen, bestFit.fitness, variables, layers);
  bestFitness.push({ height: lander.initialHeight, generation: gen, fitness: bestFit.fitness, data });
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
  size: 100,
  mutation: 0.4,
  skip: 1000
});
