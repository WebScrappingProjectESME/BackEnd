import * as R from "ramda";

import {default as Generator} from './Classes/Generator.js';
import {default as Collector} from './Classes/Collector.js';
//import {default as Processor} from './Classes/Processor.js';

const collector = new Collector();
const gameList = await collector.getGameList();

const AsciiFilter=
    R.filter(
        R.pipe(
            R.prop("name"),
            R.test(/^[\x00-\x7F]*$/)
        )
    )
const FilteredGameList=AsciiFilter(gameList);


//TEST ZONE

//console.log('Retrieved filtered game list:', FilteredGameList);
//const appId = 400; // Example app ID
//const appDetails = await collector.getAppById(appId);
//console.log(`Details for app ${appId}:`, appDetails);
/*
const TRUELIST =[
    { appid: 2919650, name: 'Cookard' },
    { appid: 2919660, name: 'JudgeSim' },
    { appid: 2919680, name: 'Lonely tiny spaceship (Demo)' },
    { appid: 2919710, name: 'Tactishia' },
    { appid: 2919720, name: 'Tactishia Playtest' },
    { appid: 2919730, name: 'Night Town Demo' },
    { appid: 2919780, name: 'Hop Man' },
    { appid: 2919790, name: 'Gravewatch' }
]


const getRawListOfGame=
    R.map(
       R.pipe(
           R.prop("appid"),
           R.tap(console.log),
           await collector.getAppById,
           R.tap(console.log)
       )
    )
*/
//const rawListOfGame = await getRawListOfGame(TRUELIST)
//console.log(await rawListOfGame)
//console.log(await collector.getAppById(400))


//const reviews = await collector.getReviewById(appId);
//console.log(`Reviews for app ${appId}:`, reviews);

//const playerCount = await collector.getNumberOfCurrentPlayers(appId);
//console.log(`Current players for app ${appId}:`, playerCount);
 //})();