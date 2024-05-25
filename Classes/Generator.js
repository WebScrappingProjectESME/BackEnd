import * as R from 'ramda';
import {default as Collector} from './Collector.js';

export default class Generator {
  collector = new Collector();

  // Création des données
  noiseCoeff = 0.1; //10% des joueurs pour le bruit au maximum
  frequency = 1 / 24; //1 fois toutes les 24 heures
  amplitudeCoeff = 0.6;
  dephasage = (4 / 6) * Math.PI; //Pour que le pique de joueur arrive environ à 14h

  // Equation qui composent notre courbe d'évolution des employés
  weekLowFreq = (player) => (x) =>
    R.product([
      this.amplitudeCoeff,
      player,
      Math.sin(
        R.add(R.product([this.frequency, 2, Math.PI, x]), this.dephasage)
      )
    ]); //product
  weekHighFreq = (player) => (x) =>
    R.product([
      this.amplitudeCoeff,
      this.amplitudeCoeff,
      player,
      Math.sin(
        R.add(
          R.product([2, this.frequency, 2, Math.PI, x]),
          R.product([2, this.dephasage])
        )
      )
    ]);
  monthFreq = (player) => (x) =>
    R.product([
      this.amplitudeCoeff,
      player,
      Math.sin(R.product([this.frequency, 2, Math.PI, x]))
    ]);
  yearsFreq = () => 0;
  getRandomNoise = (player) => () => {
    const getRandomNumber = Math.random() * 2 - 1;
    return this.noiseCoeff * player * getRandomNumber;
  };

  generateListOfPlayers = async (AppId) => {
    const listOfHour = R.map(R.multiply(4), R.range(1, 2190));
    const currentPlayer = await this.collector.getInstantPlayersById(AppId);
    return listOfHour.map(
      R.pipe(
        R.juxt([
          this.weekLowFreq(currentPlayer),
          this.weekHighFreq(currentPlayer),
          this.monthFreq(currentPlayer),
          this.getRandomNoise(currentPlayer)
        ]),
        R.sum,
        R.add(currentPlayer),
        R.add(this.yearsFreq()),
        Math.floor
      )
    );
  };

  // Création des réductions
  getRandomDate() {
    const startDate = new Date('2018-01-01');
    const endDate = new Date();
    const randomTime =
      startDate.getTime() +
      Math.random() * (endDate.getTime() - startDate.getTime());
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
    R.split('-'),
    R.juxt([this.firstTermToDays, this.secondTermToDays, this.thirdTermToDays]),
    R.sum
  );

  getOneRandomObjectSale = () => {
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

    return {Title: randomTitle, Date: randomDate, Sale: randomSale};
  };

  getRandomListOfSale() {
    const randomNumberOfSale = this.getRandomNumberOfSale();
    const listOfSales = R.times(
      this.getOneRandomObjectSale,
      randomNumberOfSale
    );

    const compareResult = R.pipe(R.prop('Date'), this.resultToNumber);
    const sortByResult = R.sortBy(compareResult);

    return sortByResult(listOfSales);
  }
}

//// TEST DEBUG
const generator = new Generator();

//console.log(await  generator.generateListOfPlayers(400));
//console.log(generator.getRandomListOfSale())
