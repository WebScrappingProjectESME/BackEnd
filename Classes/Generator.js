import * as R from "ramda";
import {default as Collector} from './Collector.js';

const collector = Collector();

export default class Generator {

  // Player = collector.getNumberOfCurrentPlayers;
  Player = 10000;
  noiseCoef = 0.1; //10% des joueurs
  frequency = 1 / 24; //1 fois toutes les 24 heures
  amplitudeCoef = 0.6;
  dephasage = 4 / 6 * Math.PI; //Pour que le pique de joueur arrive à 14h

  // Equation qui composent notre courbe d'évolution des employés à la semaine
  weekMF = (x) => this.Player + (this.amplitudeCoef * this.Player) * Math.sin(this.frequency * 2 * Math.PI * x + this.dephasage);
  weekHF = (x) => this.Player + (this.amplitudeCoef ** 2 * this.Player) * Math.sin(2 * this.frequency * 2 * Math.PI * x + (2 * this.dephasage));

  monthMF = 3;

  getRandomNumber = () => Math.random() * 2 - 1;
  weekNoise = () => this.noiseCoef * this.getRandomNumber() * this.Player;


  // Création de la liste X des heures à traiter
  listOfHour = R.map(R.multiply(4), R.range(1, 2190));//6 points par jour * 365 jour

  instantPlayer = R.map(R.converge(R.add, [this.weekHF, R.converge(R.add, [this.weekMF, this.weekNoise])]), this.listOfHour); //R.converge pour les mois

}
//// TEST DEBUG
const generator = new Generator();

const valeur = generator.instantPlayer;

console.log(valeur);
