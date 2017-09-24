const LogicModule = require('./LogicModule');

const ACCELERATION = 1;
const GRAVITY = 10;

module.exports = class Lander {
  constructor(logicVariables, height = 100, descentSpeed = GRAVITY) {
    this.height = height;
    this.descentSpeed = descentSpeed;
    this.thrusterSpeed = 0;
    this.verticalThrusterLogicModule = new LogicModule(logicVariables);
  }

  tick(descentTime) {
    if (this.landed || this.crashLanded) {
      return;
    }
    const tickTime = 1/10;
    this.descentSpeed += GRAVITY * tickTime;
    
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

  verticalThruster(height, descentSpeed, descentTime, heightThrust) {
    return this.verticalThrusterLogicModule.evaluate(height, descentSpeed, descentTime);
  }
}

