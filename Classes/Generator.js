import * as R from "ramda";

class PlayerSimulation {
    constructor() {
        this.Player = 10000;
        this.noiseCoef = 0.1;
        this.frequency = 1 / 24;
        this.amplitudeCoef = 0.6;
        this.dephasage = (4 / 6) * Math.PI;

        this.weekMF = (x) =>
            this.Player + this.amplitudeCoef * this.Player * Math.sin(this.frequency * 2 * Math.PI * x + this.dephasage);
        this.weekHF = (x) =>
            this.Player +
            (this.amplitudeCoef ** 2) * this.Player * Math.sin(2 * this.frequency * 2 * Math.PI * x + (2 * this.dephasage));

        this.monthMF = (x) => 3; // Placeholder, update if needed
        this.monthHF = (x) => 3; // Placeholder, update if needed

        this.getRandomNumber = () => Math.random() * 2 - 1;
        this.weekNoise = () => this.noiseCoef * this.getRandomNumber() * this.Player;

        this.quadruple = R.multiply(4);
        this.listOfAbscisse = R.range(1, 2190); // 6 points per day * 365 days
        this.listOfHour = R.map(this.quadruple, this.listOfAbscisse);
    }

    // Method to converge functions over a list of `x` values
    instantPlayer() {
        return R.map((x) => {
            return this.weekMF + this.weekHF + this.weekNoise;
        }, this.listOfHour);
    }

}

// Usage
const playerSim = new PlayerSimulation();

// Example: Calculate instant player count at hour 0
const playerCountAtHour0 = playerSim.instantPlayer(0);
console.log("Player count at hour 0:", playerCountAtHour0);

// Example: Calculate converged player count over all hours
const convergedPlayerCounts = playerSim.convergeX();
console.log("Converged player counts:", convergedPlayerCounts);
