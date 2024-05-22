import * as R from 'ramda';
import fs from 'fs';
import {default as Generator} from './Generator.js';

export default class Transformer {
  generator = new Generator();
  whiteList = [
    'name',
    'price_overview',
    'screenshots',
    'dlc',
    'categories',
    'genres'
  ];

  filterGameName = R.filter(
    R.pipe(
      R.prop('name'),
      R.and(R.test(/^[\x00-\x7F]*$/), R.pipe(R.equals(''), R.not))
    )
  );
  filterGameData = R.pick(this.whiteList);

  formatFilteredGameData = R.pipe(
    this.filterGameData,
    R.toPairs,
    R.map(R.applySpec({key: R.prop(0), data: R.prop(1)}))
  );

  formatGameData = R.applySpec({
    name: R.prop('name'),
    data: this.formatFilteredGameData
  });

  formatGeneratedData = R.cond([
    [
      R.equals('population'),
      () =>
        R.fromPairs([
          ['key', 'population'],
          ['data', this.generator.instantPlayer]
        ])
    ],
    [
      R.equals('salesHistory'),
      () =>
        R.fromPairs([
          ['key', 'salesHistory'],
          ['data', []]
        ])
    ]
  ]);

  GenerateMissingGameData = R.pipe(
    R.prop('data'),
    R.append(this.formatGeneratedData('population')),
    R.append(this.formatGeneratedData('salesHistory'))
  );

  saveAsFile(path, object) {
    try {
      fs.writeFileSync(path, JSON.stringify(object));
    } catch (error) {
      console.error('Error writing JSON data to file:', error);
    }
  }

  // For Optimisation if needed ##########################################

  formatGameID = R.pipe(R.map(R.props(['name', 'appId'])), R.fromPairs);
  splitGameData(object) {}
  fuseGameData(object) {}

  // #####################################################################
}

// TEST ZONE

// const trans = new Transformer();
//
// console.log(trans.formatFilteredGameData({type: 'game', pop: []}));
