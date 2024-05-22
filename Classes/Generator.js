
import * as R from "ramda";
import {default as Collector} from './Collector.js';
import axios from "axios";

export default class Generator {
  // async playerCount(appId) {return collector.getNumberOfCurrentPlayers(appId);};

  playerCount = R.tryCatch(
    async (appId) => {
      return collector.getNumberOfCurrentPlayers(appId);
    },
    (error) => {
      console.error('Error fetching number of current players:', error);
      return [];
    }
  );

  Player = 10000;
  noiseCoef = 0.1; //10% des joueurs
  frequency = 1 / 24; //1 fois toutes les 24 heures
  amplitudeCoef = 0.6;
  dephasage = (4 / 6) * Math.PI; //Pour que le pique de joueur arrive à 14h

  // Equation qui composent notre courbe d'évolution des employés à la semaine
  weekLF = (x) => (this.amplitudeCoef * this.Player) * Math.sin(this.frequency * 2 * Math.PI * x + this.dephasage);
  weekHF = (x) => (this.amplitudeCoef ** 2 * this.Player) * Math.sin(2 * this.frequency * 2 * Math.PI * x + (2 * this.dephasage));
  monthF = (x) => (this.amplitudeCoef * this.Player) * Math.sin(this.frequency * 2 * Math.PI * x);
  yearF = (x) => 0;
  weekNoise = () => {
    const getRandomNumber = () => Math.random() * 2 - 1;
    return this.noiseCoef * getRandomNumber() * this.player;
  };


  // Création de la liste X des heures à traiter
  listOfHour = R.map(R.multiply(4), R.range(1, 2190));//6 points par jour * 365 jour

  transformedPlayerCount =
    R.map(
      R.pipe(
        R.juxt([x => 10000,this.weekLF,this.weekHF,this.monthF,this.yearF]),
        R.sum),
      R.__
    );
}

//// TEST DEBUG
const generator = new Generator();
const collector = new Collector();

console.log(`Current players for app ${400}:`, await collector.getNumberOfCurrentPlayers(400));
console.log(`Current players for app ${400} :`, await generator.playerCount(400));
console.log("List of transformed players count", generator.transformedPlayerCount(generator.listOfHour));
