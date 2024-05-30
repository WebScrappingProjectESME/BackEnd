import * as R from 'ramda';
import {default as Collector} from './Classes/Collector.js';
import {default as Transformer} from './Classes/Transformer.js';

// Creating all instances
const collector = new Collector();
const transformer = new Transformer();

// Set the WhiteList
// transformer.displayWhiteList();
// transformer.whiteList = ;
// transformer.displayWhiteList();

// Collect and filter appId data
const appIDList = await R.pipeWith(R.andThen, [
  collector.getAppIDList,
  transformer.filterGameName
])();

// Collect and format gameData
const promiseAll = (x) => Promise.all(x);

const getAndFormatGameData = async (appId) => {
  const gameData = await collector.getAppById(appId);
  const reviewData = await collector.getReviewById(appId);
  const instantPopData = await collector.getInstantPlayersById(appId);

  return await R.pipe(
    R.assoc('review', reviewData),
    R.assoc('instantPop', instantPopData),
    transformer.transformGameData
  )(gameData);
};

const list = [
  {appid: 400, name: 'Portal'},
  {appid: 2197370, name: 'Reversed Front'},
  {appid: 2197410, name: 'Celestarium'},
  {appid: 2197420, name: 'BRoS - Battle Royale of Survival Playtest'}
];

const gameDataList = await R.pipe(
  R.map(R.pipe(R.prop('appid'), await getAndFormatGameData)),
  promiseAll
)(list);

console.log(
  gameDataList.map(
    R.pipe(
      R.prop('data'),
      R.find(R.propEq('salesHistory', 'key')),
      R.prop('data')
    )
  )
);
// transformer.saveAsFile('./Data/appIdList.json', appIDList);
// transformer.saveAsFile('./Data/gameDataList.json', gameDataList);

// console.log(gameDataList);
