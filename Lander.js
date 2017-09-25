const LogicModule = require('./LogicModule');

module.exports = class Lander {
  constructor(logicVariables, height = 100, descentSpeed = 10) {
    this.height = height;
    this.descentSpeed = descentSpeed;
    this.thrusterSpeed = 0;
    this.verticalThrusterLogicModule = new LogicModule(logicVariables);
  }

  tick(gravity, descentTime) {
    if (this.landed || this.crashLanded) {
      return;
    }
    const tickTime = 1/10;
    this.descentSpeed += gravity * tickTime;
    
    const thrusterSpeed = this.verticalThruster(this.height, this.descentSpeed, descentTime);
    this.thrusterSpeed = thrusterSpeed;
    this.descentSpeed -= thrusterSpeed * tickTime;

    this.height -= this.descentSpeed;
    if (isNaN(this.height)) {
      this.error = true;
      return;
    }

    if (this.height < 0) {
      this.crashLanded = true;
    } else if (this.height < 2 && this.descentSpeed < 2) {
      this.landed = true;
    }
  }

  verticalThruster(...args) {
    let thruster = this.verticalThrusterLogicModule.evaluate(args);
    thruster = thruster < 0 ? 0 : thruster;
    thruster = thruster > 50 ? 50 : thruster;
    return thruster;
  }
}

