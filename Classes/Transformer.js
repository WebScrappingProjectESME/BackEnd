import * as R from 'ramda';
import fs from 'fs';

import {default as Generator} from './Generator.js';
import {default as Collector} from './Collector.js';

export default class Transformer {
  generator = new Generator();
  collector = new Collector();
  whiteList = [
    'steam_appid',
    'price_overview',
    'screenshots',
    'dlc',
    'categories',
    'genres',
    'review',
    'instantPop'
  ];

  // Basic Transformation Function
  isASCII = R.and(R.test(/^[\x00-\x7F]*$/), R.isNotEmpty);

  filterGameData = R.pick(this.whiteList);
  formatGameData = R.applySpec({key: R.prop(0), data: R.prop(1)});

  getDataByKey = (key) => R.pipe(R.find(R.propEq(key, 'key')), R.prop('data'));
  promiseAll = (x) => Promise.all(x);

  // Math functions
  calculatePercent = R.pipe(
    R.converge(R.divide, [R.nth(0), R.nth(1)]),
    R.multiply(100, R.__)
  );

  calculateReview = R.pipe(
    R.juxt([R.prop('total_positive'), R.prop('total_reviews')]),
    this.calculatePercent
  );

  calculatePrice = R.pipe(R.prop('initial'), R.divide(R.__, 100));

  // Filter appIdData Function
  filterGameName = R.filter(R.pipe(R.prop('name'), this.isASCII));

  // Generate and Format Missing Data Functions
  formatPopulationData = R.pipe(
    this.getDataByKey('instantPop'),
    this.generator.generateListOfPlayersGraphData,
    R.append(R.__, ['population']),
    this.formatGameData,
    R.append(R.__, [])
  );

  formatSalesData = R.pipe(
    this.generator.generateRandomListOfSale,
    R.append(R.__, ['salesHistory']),
    this.formatGameData,
    R.append(R.__, [])
  );

  // Filter, Control and Format GameData Functions

  filterAndFormatGameData = R.pipe(
    this.filterGameData,
    R.toPairs,
    R.map(this.formatGameData)
  );

  modifyGameData = R.map(
    R.cond([
      [
        R.propSatisfies(R.equals('steam_appid'), 'key'),
        R.set(R.lensProp('key'), 'appId')
      ],
      [
        R.propSatisfies(R.equals('price_overview'), 'key'),
        R.pipe(
          R.set(R.lensProp('key'), 'price'),
          R.over(R.lensProp('data'), this.calculatePrice)
        )
      ],
      [
        R.propSatisfies(R.equals('dlc'), 'key'),
        R.over(R.lensProp('data'), R.length)
      ],
      [
        R.propSatisfies(R.equals('review'), 'key'),
        R.over(R.lensProp('data'), this.calculateReview)
      ],
      [R.T, R.identity]
    ])
  );

  appendMissingGameData = R.pipe(
    (data) => R.concat(data, this.formatPopulationData(data)),
    R.concat(R.__, this.formatSalesData())
  );

  controlGameData = R.pipe(
    this.filterAndFormatGameData,
    this.modifyGameData,
    this.appendMissingGameData
  );

  transformGameData = R.applySpec({
    name: R.prop('name'),
    data: this.controlGameData
  });

  // Saving function
  saveAsFile(path, object) {
    try {
      fs.writeFileSync(path, JSON.stringify(object));
    } catch (error) {
      console.error('Error writing JSON data to file:', error);
    }
  }
}

const transformer = new Transformer();
const data = [
  {key: 'appId', data: 400},
  {key: 'price', data: 9.75},
  {key: 'screenshots', data: [Array]},
  {key: 'dlc', data: 2},
  {key: 'categories', data: [Array]},
  {key: 'genres', data: [Array]},
  {key: 'instantPop', data: 714},
  {key: 'review', data: [Object]},
  {key: 'salesHistory', data: [Array]}
];
//
// console.log(transformer.getDataByKey('appId')(data));

//console.log(data);

// console.log(transformer.formatSalesData(data));
// console.log(R.append(transformer.formatSalesData(), []));
