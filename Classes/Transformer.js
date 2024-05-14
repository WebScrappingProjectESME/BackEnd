import * as R from 'ramda';
import fs from 'fs';

export default class Transformer {
  whitelist = [];

  filterGameData = R.pick(this.whitelist);

  formatGameData = R.applySpec({
    name: R.prop('name'),
    data: this.filterGameData
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
