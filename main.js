import * as R from 'ramda';
import {default as Generator} from './Classes/Generator.js';
import {default as Collector} from './Classes/Collector.js';
import {default as Transformer} from './Classes/Transformer.js';

// Creating all instances
const collector = new Collector();
const transformer = new Transformer();
const generator = new Generator();

// Collect and filter appId data
const appIDList = await R.pipeWith(R.andThen, [
  collector.getAppIDList,
  transformer.filterGameName
])();

//console.log(appIDList);

// ################################## HAUT DESSUS CA MARCHE ##########################################################

// Collect and format gameData

const list = [
  {appid: 400, name: 'Shadows of Doubt Playtest'},
  {appid: 2197370, name: 'Reversed Front'},
  {appid: 2197410, name: 'Celestarium'},
  {appid: 2197420, name: 'BRoS - Battle Royale of Survival Playtest'}
];

const promiseAll = (x) => Promise.all(x);

const foo = R.pipe(
  R.map(
    R.pipe(
      R.prop('appid'),
      R.juxt([
        //collector.getAppById,
        //collector.getReviewById
        collector.getInstantPlayersById
      ]),
      promiseAll
    )
  ),
  promiseAll
);
console.log(await foo(list));

// console.log(
//   await R.pipe(
//     R.juxt([
//       collector.getAppById,
//       collector.getReviewById
//       //collector.getInstantPlayersById
//     ]),
//     promiseAll
//   )(400)
// );

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
