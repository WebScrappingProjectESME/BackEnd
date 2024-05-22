import * as R from 'ramda';
import {default as Generator} from './Classes/Generator.js';
import {default as Collector} from './Classes/Collector.js';
import {default as Transformer} from './Classes/Transformer.js';

// Creating all instances
const collector = new Collector();
const transformer = new Transformer();
const generator = new Generator();

// Collect and filter appId data
const appIDList = R.pipeWith(R.andThen, [
  await collector.getAppIDList,
  transformer.filterGameName
])();

// Collect and format gameData
const gameDataList = await collector.getAppById(400);
const gameReviewList = await collector.getReviewById(400);
const instantPlayerList = await collector.getInstantPlayersById(400);

//console.log(appIDList);

// Filter and format data

const formattedGameData = R.pipe(
  transformer.formatGameData,
  transformer.GenerateMissingGameData
);

//const gameDataList = R.map(console.log)(filteredAppIDList);

//const reviews = await collector.getReviewById(appId);
//console.log(`Reviews for app ${appId}:`, reviews);

//const playerCount = await collector.getNumberOfCurrentPlayers(appId);
//console.log(`Current players for app ${appId}:`, playerCount);
//})();

//transformer.saveAsFile('./Data/gameId.json', appIDList);
