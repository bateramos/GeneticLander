module.exports = class LogicModule {
  constructor(numberOfArguments, variables) {
    this.numberOfArguments = numberOfArguments;
    this.variables = variables;
  }

  evaluate(...args) {
    let result = 1;
    args.forEach((item, index) => {
      result *= item * this.variables[index];
    });
    //console.log('end');
    return result / 100; 
  }
}
