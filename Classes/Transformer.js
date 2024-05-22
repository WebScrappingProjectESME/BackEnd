import * as R from 'ramda';
import fs from 'fs';
import {default as Generator} from './Generator.js';

export default class Transformer {
  generator = new Generator();
  whiteList = ['price_overview', 'screenshots', 'dlc', 'categories', 'genres'];

  // Filter appIdData Function
  filterGameName = R.filter(
    R.pipe(
      R.prop('name'),
      R.and(R.test(/^[\x00-\x7F]*$/), R.pipe(R.equals(''), R.not))
    )
  );

  // Basic Transformation Function
  filterGameData = R.pick(this.whiteList);
  formatGameData = R.applySpec({key: R.prop(0), data: R.prop(1)});

  // Generate and Format Missing Data Functions
  formatGeneratedData = R.cond([
    [
      R.equals('population'),
      () => this.formatGameData(['population', this.generator.instantPlayer])
    ],
    [R.equals('salesHistory'), () => this.formatGameData(['salesHistory', []])]
  ]);

  generateMissingGameData = R.pipe(
    R.append(this.formatGeneratedData('population')),
    R.append(this.formatGeneratedData('salesHistory'))
  );

  // Filter and Format GameData Functions

  filterAndFormatGameData = R.pipe(
    this.filterGameData,
    R.toPairs,
    R.map(this.formatGameData)
  );

  controlGameData = R.pipe(
    this.filterAndFormatGameData,
    this.generateMissingGameData
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

  fuseGameData = (gameData) =>
    R.append(R.prop(0, gameData), R.prop(1, gameData));

  // Format and calculate price and review

  formatGameReview = (reviewData) =>
    R.fromPairs([
      ['key', 'review'],
      [
        'data',
        R.multiply(
          100,
          R.divide(
            R.prop('total_positive', reviewData),
            R.prop('total_reviews', reviewData)
          ).toFixed(4)
        )
      ]
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
//
// const priceData = {
//   num_reviews: 20,
//   review_score: 9,
//   review_score_desc: 'Overwhelmingly Positive',
//   total_positive: 132181,
//   total_negative: 2008,
//   total_reviews: 134189
// };
//
// console.log(trans.formatGameReview(priceData));
