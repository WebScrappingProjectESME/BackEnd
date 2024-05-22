import * as R from "ramda";
import {default as Collector} from './Collector.js';
import axios from "axios";

export default class Generator {
    // async playerCount(appId) {return collector.getNumberOfCurrentplayers(appId);};

    playerCount = R.tryCatch(
        async (appId) => {
            return collector.getInstantPlayersById(appId);
        },
        (error) => {
            console.error('Error fetching number of current players:', error);
            return [];
        }
    );

    player = 10000;
    noiseCoef = 0.1; //10% des joueurs
    frequency = 1 / 24; //1 fois toutes les 24 heures
    amplitudeCoef = 0.6;
    dephasage = 4 / 6 * Math.PI; //Pour que le pique de joueur arrive à 14h

    // Equation qui composent notre courbe d'évolution des employés à la semaine
    weekLF = (x) => (this.amplitudeCoef * this.player) * Math.sin(this.frequency * 2 * Math.PI * x + this.dephasage);
    weekHF = (x) => (this.amplitudeCoef ** 2 * this.player) * Math.sin(2 * this.frequency * 2 * Math.PI * x + (2 * this.dephasage));
    monthF = (x) => (this.amplitudeCoef * this.player) * Math.sin(this.frequency * 2 * Math.PI * x);
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

    ////// Date
    getRandomDate() {
        const startDate = new Date('2018-01-01');
        const endDate = new Date();
        const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
        const randomDate = new Date(randomTime);
        return randomDate.toISOString().split('T')[0]; // Pour obtenir la date sans l'heure
    }

    getRandomSale() {
        return Math.floor(Math.random() * 90);
    }

    getRandomNumberOfSale() {
        return Math.floor(Math.random() * 15);
    }

    yearToDays = R.pipe(Number, R.multiply(365));
    monthToDays = R.pipe(Number, R.multiply(30));

    firstTermToDays = R.pipe(R.nth(0), this.yearToDays);
    secondTermToDays = R.pipe(R.nth(1), this.monthToDays);
    thirdTermToDays = R.pipe(R.nth(2), Number);

    resultToNumber = R.pipe(
        R.split("-"),
        R.juxt([this.firstTermToDays, this.secondTermToDays, this.thirdTermToDays]),
        R.sum
    );

    getOneObjectSale = () => {
        const listPromoStr = [
            'special event sales',
            'random sales',
            'Editor sales',
            'Summer sales',
            'Winter sales',
            'Fall sales',
            'Spring sales',
            'Neofest'
        ];
        const randomNumOfTitle = Math.floor(Math.random() * listPromoStr.length);
        const randomTitle = listPromoStr[randomNumOfTitle];
        const randomDate = this.getRandomDate();
        const randomSale = this.getRandomSale();

        return { Title: randomTitle, Date: randomDate, Sale: randomSale };
    }

    // Fonction pour obtenir une liste de réduction
    getRandomListOfSale() {
        const randomNumberOfSale = this.getRandomNumberOfSale();
        const listOfSales = R.times(this.getOneObjectSale, randomNumberOfSale);

        const compareResult = R.pipe(R.prop("Date"), this.resultToNumber);
        const sortByResult = R.sortBy(compareResult);

        return sortByResult(listOfSales);
    }
}

//// TEST DEBUG
const generator = new Generator();
const collector = new Collector();

console.log(`Current players for app ${400}:`, await collector.getInstantPlayersById(400));
console.log(`Current players for app ${400} :`, await generator.playerCount(400));
console.log("List of transformed players count", generator.transformedPlayerCount(generator.listOfHour));
console.log(generator.getRandomListOfSale())
