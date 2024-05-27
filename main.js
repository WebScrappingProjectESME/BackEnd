import * as R from 'ramda';
import {default as Generator} from './Classes/Generator.js';
import {default as Collector} from './Classes/Collector.js';
import {default as Transformer} from './Classes/Transformer.js';

// Creating all instances
const collector = new Collector();
const transformer = new Transformer();

// Collect and filter appId data
const appIDList = await R.pipeWith(R.andThen, [
  collector.getAppIDList,
  transformer.filterGameName
])();

// Collect and format gameData
const promiseAll = (x) => Promise.all(x);

const getFormattedGameData = R.pipeWith(R.andThen(), [
  collector.getAppById,
  transformer.transformGameData
]);

console.log(await getFormattedGameData(400));

const getInstantPopulationData = R.pipeWith(R.andThen, [
  collector.getInstantPlayersById,
  transformer.formatInstantPopulationData
]);

const list = [
  {appid: 400, name: 'Portal'},
  {appid: 2197370, name: 'Reversed Front'},
  {appid: 2197410, name: 'Celestarium'},
  {appid: 2197420, name: 'BRoS - Battle Royale of Survival Playtest'}
];

const gameDataList = await R.pipe(
  R.map(R.pipe(R.prop('appid'), await getFormattedGameData)),
  promiseAll
)(list);

// console.log(gameDataList);
