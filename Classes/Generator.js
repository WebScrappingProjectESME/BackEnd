import * as R from "ramda";
import {default as Collector} from './Collector.js';
import axios from "axios";

export default class Generator {
    collector = new Collector();

    // async playerCount(appId) {return collector.getNumberOfCurrentplayers(appId);};

    ///// List of t-time player
    playerCount = R.tryCatch(
        async (appId) => {
            return this.collector.getInstantPlayersById(appId);
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
    dephasage = 4 / 6 * Math.PI; //Pour que le pique de joueur arrive environ à 14h

    // Equation qui composent notre courbe d'évolution des employés à la semaine
    weekLF = (player) => (x) => (this.amplitudeCoef * player) * Math.sin(this.frequency * 2 * Math.PI * x + this.dephasage); //product
    weekHF = (player) => (x) => (this.amplitudeCoef ** 2 * player) * Math.sin(2 * this.frequency * 2 * Math.PI * x + (2 * this.dephasage));
    monthF = (player) => (x) => (this.amplitudeCoef * player) * Math.sin(this.frequency * 2 * Math.PI * x);
    yearsF = () => 0;
    weekNoise = (player) => () => {
        const getRandomNumber = Math.random() * 2 - 1;
        return this.noiseCoef * player * getRandomNumber;
    };

    curriedWeekLF = R.curry(this.weekLF);
    curriedWeekHF = R.curry(this.weekHF);
    curriedMonthF = R.curry(this.monthF);


    sumFunctionOfGame = async (numOfGame) => {
        try {
            const player = await this.collector.getInstantPlayersById(numOfGame);
            const weekLFOfGame = this.curriedWeekLF(player, R.__);
            const weekHFOfGame = this.curriedWeekHF(player, R.__);
            const monthFOfGame = this.curriedMonthF(player, R.__);
            const noiseOfGame  = this.weekNoise(player);
            const yearsFOfGame = this.yearsF;

            return (x) => player + weekLFOfGame(x) + weekHFOfGame(x) + monthFOfGame(x) + noiseOfGame + yearsFOfGame;

        } catch (error) {
            console.error('Error in sumFunctionOfGame:', error);
            return NaN;
        }
    };

    listOfHour = R.map(R.multiply(4), R.range(1, 2190));//6 points par jour * 365 jour
    givePlayerCountForGame = R.pipeWith(R.andThen,[this.collector.getInstantPlayersById,R.juxt([])])
    //generateForX =  R.map(R.pipe(R.juxt(this.sumFunctionOfGame)))



    generate = async (AppId) => {
        const listOfHour = R.map(R.multiply(4), R.range(1, 2190));
        const currentPLayer = await this.collector.getInstantPlayersById(AppId);
        return listOfHour.map(R.pipe(R.juxt([this.curriedWeekLF(currentPLayer), this.curriedWeekHF(currentPLayer), this.curriedMonthF(currentPLayer), this.weekNoise(currentPLayer)]), R.sum, R.add(currentPLayer), Math.floor));
    }

    /*
    // Création de la liste X des heures à traiter


    transformedPlayerCount = {
        R.map(
            R.pipe(
                R.juxt([x => 10000, this.weekLFOfGame, this.weekHFOfGame, this.monthFOfGame]),
                R.sum)
        );
    }*/



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

//console.log(`Current players for app ${400}:`, await collector.getInstantPlayersById(400));
//console.log(`Current players for app ${400} :`, await generator.playerCount(400));
//console.log("List of transformed players count", generator.transformedPlayerCount(generator.listOfHour));

console.log(await  generator.generate(400));
