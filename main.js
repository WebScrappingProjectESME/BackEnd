import * as R from 'ramda';
import {default as Generator} from './Classes/Generator.js';
import {default as Collector} from './Classes/Collector.js';
import {default as Transformer} from './Classes/Transformer.js';
import {andThen} from 'ramda';

// Creating all instances
const collector = new Collector();
const transformer = new Transformer();
const generator = new Generator();

// Collect and filter appId data
const appIDList = await R.pipeWith(R.andThen, [
  collector.getAppIDList,
  transformer.filterGameName
])();

// Collect and format gameData
const promiseAll = (x) => Promise.all(x);

const getGameData = R.pipeWith(R.andThen(), [
  collector.getAppById,
  transformer.transformGameData
]);

console.log(await getGameData(400));

const getReviewData = R.pipeWith(R.andThen(), [
  collector.getReviewById,
  transformer.formatGameReview
]);

const getInstantPopulationData = R.pipeWith(R.andThen, [
  collector.getInstantPlayersById,
  transformer.formatInstantPopulationData
]);

const list = [
  {appid: 400, name: 'Shadows of Doubt Playtest'},
  {appid: 2197370, name: 'Reversed Front'},
  {appid: 2197410, name: 'Celestarium'},
  {appid: 2197420, name: 'BRoS - Battle Royale of Survival Playtest'}
];

const gameDataList = await R.pipe(
  R.map(R.pipe(R.prop('appid'), await getGameData)),
  promiseAll
)(list);

// console.log(gameDataList);

// ######################## EN DESSOUS ON S'EN FOU C'EST DES TESTE FOIREUX ###########################################

// const gameDataList = await collector.getAppById(400);
// const gameReviewList = await collector.getReviewById(400);
// const instantPlayerList = await collector.getInstantPlayersById(400);
//
//
// const formattedGameData = R.pipe(
//   transformer.formatGameData,
//   transformer.GenerateMissingGameData
// );

//const gameDataList = R.map(console.log)(filteredAppIDList);

//const reviews = await collector.getReviewById(appId);
//console.log(`Reviews for app ${appId}:`, reviews);

//const playerCount = await collector.getNumberOfCurrentPlayers(appId);
//console.log(`Current players for app ${appId}:`, playerCount);
//})();

//transformer.saveAsFile('./Data/gameId.json', appIDList);
