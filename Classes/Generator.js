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
  dephasage = 4 / 6 * Math.PI; //Pour que le pique de joueur arrive à 14h

  // Equation qui composent notre courbe d'évolution des employés à la semaine
  weekMF = (x) => (this.amplitudeCoef * this.Player) * Math.sin(this.frequency * 2 * Math.PI * x + this.dephasage);
  weekHF = (x) => (this.amplitudeCoef ** 2 * this.Player) * Math.sin(2 * this.frequency * 2 * Math.PI * x + (2 * this.dephasage));

  monthMF = (x) => (this.amplitudeCoef * this.Player) * Math.sin(this.frequency * 2 * Math.PI * x);

  getRandomNumber = () => Math.random() * 2 - 1;
  weekNoise = () => this.noiseCoef * this.getRandomNumber() * this.Player;


  // Création de la liste X des heures à traiter
  listOfHour = R.map(R.multiply(4), R.range(1, 2190));//6 points par jour * 365 jour

  sumFunctions = (x) => this.Player + this.weekHF(x) + this.weekMF(x) + this.weekNoise();

  //instantPlayer = R.map(R.reduce(R.add, this.Player, [this.weekHF, this.weekMF, this.weekNoise]), this.listOfHour); //R.converge pour les mois
  instantPlayer = R.map(this.sumFunctions, this.listOfHour); //R.converge pour les mois
}

//// TEST DEBUG
const generator = new Generator();
const collector = new Collector();

// console.log(`Current players for app ${400}:`, collector.getNumberOfCurrentPlayers(400));
//console.log(`Current players for app ${400}:`, await generator.playerCount(400));
//generator.numberOfPlayers();
const valeur = generator.instantPlayer;
console.log(valeur);
