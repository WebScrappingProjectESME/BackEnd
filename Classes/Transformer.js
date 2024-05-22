import * as R from 'ramda';
import fs from 'fs';

export default class Transformer {
  whiteList = [
    'name',
    'price_overview',
    'screenshots',
    'dlc',
    'categories',
    'genres'
  ];

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
