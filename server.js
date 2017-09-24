// variable: hight and terminal velocity
// 
// properties: 
// 
// actions: vertical thrusters
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

genetic.fitness = (landerData) => {
  const lander = new Lander(
    landerData.verticalThrusterLogicModule.variables
  );
  let timePassed = 0;
  let i = 0;
  while(i++ < 10 * 60 * 60 * 10) {
    timePassed += 0.1;
    lander.tick(timePassed);
    if (lander.error) {
      return 0;
    }
    if (lander.landed) {
      return (10 / timePassed) + 50;
    }
    if (lander.crashLanded) {
      const score = 10 / timePassed - (lander.descentSpeed * 5);
      return score;
    }
  }
  return lander.height / 10;
};

genetic.generation = (pop, gen, stats) => {
  return !pop.find(lander => lander.landed);
};

genetic.notification = (pop, gen, stats, isFinished) => {
  if (!isFinished) return;
  console.log(pop.filter(p => p.fitness > 40).map(p => JSON.stringify(p)));
};

genetic.evolve({
  iterations: 1000,
  size: 400,
  mutation: 0.5,
  skip: 100
});
