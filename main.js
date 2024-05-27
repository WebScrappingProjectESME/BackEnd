import * as R from 'ramda';
import {default as Generator} from './Classes/Generator.js';
import {default as Collector} from './Classes/Collector.js';
import {default as Transformer} from './Classes/Transformer.js';

// Creating all instances
const collector = new Collector();
const transformer = new Transformer();

// Set the WhiteList
transformer.setWhiteList = [
  'price_overview',
  'screenshots',
  'dlc',
  'categories',
  'genres'
];

// Collect and filter appId data
const appIDList = await R.pipeWith(R.andThen, [
  collector.getAppIDList,
  transformer.filterGameName
])();

// Collect and format gameData
const promiseAll = (x) => Promise.all(x);

const getAndFormatGameData = R.pipeWith(R.andThen(), [
  collector.getAppById,
  transformer.transformGameData
]);

// to do : => instant pop to add,
//         => add duration
//         => finish review

console.log(await getAndFormatGameData(400));

// const list = [
//   {appid: 400, name: 'Portal'},
//   {appid: 2197370, name: 'Reversed Front'},
//   {appid: 2197410, name: 'Celestarium'},
//   {appid: 2197420, name: 'BRoS - Battle Royale of Survival Playtest'}
// ];

// const gameDataList = await R.pipe(
//   R.map(R.pipe(R.prop('appid'), await getAndFormatGameData)),
//   promiseAll
// )(list);

// console.log(gameDataList);
