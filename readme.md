# Genetic Lander

## Atmosphere descent module simulation using JS

This simulation utilize Evolutionary Algorithm and NeuroEvolution to find a fair solution to the thurster control of a space module that is making it's entry in the atmosphere.

The simulation is still very simple but it proves that this approach can find the solution inside the bounderies of the simulation.

## How to install

You will need node.js and npm installed to run the simulation.

After that run `npm instal` to install the dependencies.

To run the simulation, run `node server`. You can pass the initial height that the space module as a argument. Ex: `node server 5000`.

After the simluation is finished you can see the generated data by opening `public/index.html`.

The simulation will be successfull if the module reaches the ground at a speed lower than 2 m/s in the last 2m.

