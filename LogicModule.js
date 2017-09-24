module.exports = class LogicModule {
  constructor(variables) {
    this.variables = variables;
  }

  evaluate(...args) {
    let result = 1;
    args.forEach((item, index) => {
      result *= item * this.variables[index];
    });
    return result / 100; 
  }
}
