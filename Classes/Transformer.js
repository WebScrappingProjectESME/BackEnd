import * as R from 'ramda';
import fs from 'fs';

import {default as Generator} from './Generator.js';
import {default as Collector} from './Collector.js';

export default class Transformer {
  generator = new Generator();
  collector = new Collector();

  whiteList = ['price_overview', 'screenshots', 'dlc', 'categories', 'genres'];

  // Basic Transformation Function
  isASCII = R.and(R.test(/^[\x00-\x7F]*$/), R.isNotEmpty);
  filterGameData = R.pick(this.whiteList);
  formatGameData = R.applySpec({key: R.prop(0), data: R.prop(1)});

  // Math functions
  calculatePercent = R.pipe(
    R.converge(R.divide, [R.nth(0), R.nth(1)]),
    R.multiply(100, R.__)
  );

  calculateReview = R.pipeWith(R.andThen, [
    this.collector.getReviewById,
    R.juxt([R.prop('total_positive'), R.prop('total_reviews')]),
    this.calculatePercent
  ]);

  calculatePrice = R.pipe(R.prop('initial'), R.divide(R.__, 100));

  // Filter appIdData Function
  filterGameName = R.filter(R.pipe(R.prop('name'), this.isASCII));

  // Generate and Format Missing Data Functions
  formatPopulationData = this.formatGameData([
    'population',
    this.generator.transformedPlayerCount
  ]);

  formatSalesData = this.formatGameData([
    'salesHistory',
    this.generator.getRandomListOfSale()
  ]);

  formatReviewData = this.formatGameData(['review', this.calculateReview(400)]);

  // Filter, Control and Format GameData Functions
  filterAndFormatGameData = R.pipe(
    this.filterGameData,
    R.toPairs,
    R.map(this.formatGameData)
  );

  modifyGameData = R.map(
    R.cond([
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
      [R.T, R.identity]
    ])
  );

  appendMissingGameData = R.pipe(
    R.append(this.formatPopulationData),
    R.append(this.formatSalesData),
    R.append(this.formatReviewData)
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

// TEST ZONE

const trans = new Transformer();

const reviewData = {
  num_reviews: 20,
  review_score: 9,
  review_score_desc: 'Overwhelmingly Positive',
  total_positive: 132181,
  total_negative: 2008,
  total_reviews: 134189
};

console.log(trans.formatReviewData(reviewData));

//console.log(await trans.calculateReview(400));
