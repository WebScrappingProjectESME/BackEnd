import * as R from 'ramda';
import fs from 'fs';

import {default as Generator} from './Generator.js';
import {default as Collector} from './Collector.js';

export default class Transformer {
  generator = new Generator();
  collector = new Collector();

  whiteList = ['price_overview', 'screenshots', 'dlc', 'categories', 'genres'];

  // Basic Transformation Function
  filterGameData = R.pick(this.whiteList);
  formatGameData = R.applySpec({key: R.prop(0), data: R.prop(1)});

  // Math functions
  calculatePercent = (elements) =>
    R.multiply(
      100,
      R.divide(R.nth(0, elements), R.nth(1, elements)).toFixed(4)
    );

  calculateReview = await R.pipeWith(R.andThen, [
    this.collector.getReviewById,
    R.juxt([R.prop('total_positive'), R.prop('total_reviews')]),
    this.calculatePercent
  ]);

  // Filter appIdData Function
  filterGameName = R.filter(
    R.pipe(
      R.prop('name'),
      R.and(R.test(/^[\x00-\x7F]*$/), R.pipe(R.equals(''), R.not))
    )
  );

  // Generate and Format Missing Data Functions
  formatGeneratedData = R.cond([
    [
      R.equals('population'),
      () =>
        this.formatGameData([
          'population',
          this.generator.transformedPlayerCount
        ])
    ],
    [
      R.equals('salesHistory'),
      () =>
        this.formatGameData([
          'salesHistory',
          this.generator.getRandomListOfSale()
        ])
    ],
    [
      R.equals('review'),
      () => this.formatGameData(['review', this.calculateReview(400)])
    ]
  ]);

  // Filter and Format GameData Functions

  filterAndFormatGameData = R.pipe(
    this.filterGameData,
    R.toPairs,
    R.map(this.formatGameData)
  );

  appendMissingGameData = R.pipe(
    R.append(this.formatGeneratedData('population')),
    R.append(this.formatGeneratedData('salesHistory')),
    R.append(this.formatGeneratedData('review'))
  );

  controlGameData = R.pipe(
    this.filterAndFormatGameData,
    this.appendMissingGameData
  );

  transformGameData = R.applySpec({
    name: R.prop('name'),
    data: this.controlGameData
  });

  formatInstantPopulationData = (instantPop) =>
    R.fromPairs([
      ['key', 'instantPopulation'],
      ['data', instantPop]
    ]);

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
//
// console.log(trans.formatGameReview(priceData));

console.log(await trans.calculateReview(400));
