import {default as Generator} from './Classes/Generator.js';
import {default as Collector} from './Classes/Collector.js';
//import {default as Processor} from './Classes/Processor.js';

const collector = new Collector();
const gameList = await collector.getGameList();
//console.log('Retrieved game list:', gameList);

const appId = 400; // Example app ID
const appDetails = await collector.getAppById(appId);
//console.log(`Details for app ${appId}:`, appDetails);

const reviews = await collector.getReviewById(appId);
//console.log(`Reviews for app ${appId}:`, reviews);

const playerCount = await collector.getNumberOfCurrentPlayers(appId);
//console.log(`Current players for app ${appId}:`, playerCount);
 //})();


/* filter ASCII

  const list =[
  { appid: 2198130, name: 'Shadows of Doubt Playtest' },
  { appid: 2197370, name: 'Reversed Front' },
  { appid: 2197410, name: 'Celestarium' },
  { appid: 2197420, name: 'BRoS - Battle Royale of Survival Playtest' },
  { appid: 2197450, name: '炸啦' },
  { appid: 2197490, name: '白色哀悼：灰域美术馆' }]

const foo=
 R.filter(
  R.pipe(
    R.prop("name"),
    R.test(/^[\x00-\x7F]*$/),
    R.tap(console.log)
  )
 )

foo(list)

 */
