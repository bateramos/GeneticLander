module.exports = class LogicModule {
  constructor(variables, layers = [[]]) {
    this.variables = variables;
    this.layers = [[]];
  }

  evaluate(args) {
    let results = [];
    results = args.map((item, index) => {
      return item * this.variables[index];
    });

    this.layers.forEach((layer) => {
      let newResult = new Array(layer.length).fill(0);
      layer.forEach((weight, index) => {
        results.forEach(item => {
          newResult[index] = item * weight;
        });
        newResult[index] = newResult[index];
      });
      results = newResult.length ? newResult : results;
    });

    const result = results.reduce((acc, item) => acc + item, 0);

    return result; 
  }
}

function squashing(number) {
  return number / (Math.abs(number) + 1);
}
