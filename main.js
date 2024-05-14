import axios from 'axios';
import fs from 'fs';

// Collector
const nameToIdList = async (L) => {
  const T = {};
  const ListId = [];
  for (let i = 0; i < L.length; i++) {
    let name = L[i]['name'];
    if (/^[\x00-\x7F]*$/.test(name)) {
      T[name.toLowerCase()] = L[i]['appid'];
      ListId.push(L[i]['appid']);
    }
  }
  return [T, ListId];
};

const gameList = async () =>
  (await axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/'))
    .data['applist'].apps;
//await console.log();
const jsonAndList = await nameToIdList(await gameList());
const jsonData = JSON.stringify(jsonAndList[0]);
const ListAppId = jsonAndList[1].sort();

ListAppId.unshift(1245620);
ListAppId.unshift(230410);
ListAppId.unshift(1085660);
ListAppId.unshift(238960);
ListAppId.unshift(913740);
ListAppId.unshift(1262350);

/*
try {
    fs.writeFileSync("C:\\Users\\tthea\\WebstormProjects\\apiwip\\gameId.json", jsonData);
    console.log('JSON data saved to file successfully.');
} catch (error) {
    console.error('Error writing JSON data to file:', error);
}
*/
//////////////=>/ / // /// /
const createJson = (T) => {
  const gameInfo = {};
  //if(T["type"]==="game"){
  console.log(T['name']);

  gameInfo['name'] = T['name'];
  if (T['price_overview'])
    gameInfo['price'] = T['price_overview']['initial'] / 100;
  else {
    gameInfo['price'] = -42.69;
  }

  gameInfo['screenshot_url'] = [];
  if (T['screenshots']) {
    const maxSize = T['screenshots'].length < 5 ? T['screenshots'].length : 5;
    for (let i = 0; i < maxSize; i++) {
      gameInfo['screenshot_url'].push(T['screenshots'][i]['path_full']);
    }
  }

  if (T['dlc']) gameInfo['dlc'] = T['dlc'].length;
  else {
    gameInfo['dlc'] = 0;
  }

  gameInfo['categories'] = [];
  if (T['categories']) {
    const categoriesList = T['categories'];
    for (let i = 0; i < categoriesList.length; i++) {
      gameInfo['categories'].push(categoriesList[i]['description']);
    }
  }

  gameInfo['genres'] = [];
  if (T['genres']) {
    const genresList = T['genres'];
    for (let i = 0; i < genresList.length; i++) {
      gameInfo['genres'].push(genresList[i]['description']);
    }
  }
  //}
  return gameInfo;
};

const calcScore = (T) => {
  if (T['total_reviews'] !== 0)
    return Math.floor((T['total_positive'] / T['total_reviews']) * 100);
  return 0;
};

const craftDurationGame = () => {
  return Math.floor(Math.random() * 50 + 10);
};

//Generator

const craftPopHisto = (nbrPlayer) => {
  const Pop = {week: [], month: [], year: [], growth: 0};
  let calc = 0;

  if (nbrPlayer !== 0) {
    let daily = (Math.random() / 3 + 0.2) * nbrPlayer;
    let weekly = (Math.random() / 4 + 0.1) * nbrPlayer;
    let noise = (Math.random() * nbrPlayer) / 10;

    let freqNoise = 1 + Math.random() * 3;

    for (let i = 11; i >= 0; i--) {
      calc =
        daily * Math.sin((2 * i * Math.PI) / 2.5) +
        weekly * Math.sin((2 * i * Math.PI) / 6) +
        noise * Math.sin((2 * i * Math.PI) / freqNoise) +
        nbrPlayer;

      //console.log(Math.floor(calc)+" nbr:"+nbrPlayer);
      Pop.week.push(Math.floor(Math.abs(calc)));

      calc =
        daily * Math.sin((2 * i * Math.PI) / 10) +
        weekly * Math.sin((2 * i * Math.PI) / 19.5) +
        noise * Math.sin((2 * i * Math.PI) / freqNoise) +
        nbrPlayer;
      Pop.month.push(Math.floor(Math.abs(calc)));

      calc =
        daily * Math.sin((2 * i * Math.PI) / 14) +
        weekly * Math.sin((2 * i * Math.PI) / 24.5) +
        noise * Math.sin((2 * i * Math.PI) / freqNoise) +
        nbrPlayer;
      Pop.year.push(Math.floor(Math.abs(calc)));
    }

    /*
        const rd=Math.random()-0.5;
        const b=Math.abs(rd)*12;
        for (let i = 0; i < 12; i++) {
            calc=(rd*i+b)*10000+Math.random()*100;
            Pop.year.push(Math.floor(Math.abs(calc)));
        }
        */

    Pop.growth = Math.floor(
      (100 * (Pop.week[11] - Pop.week[10])) / Pop.week[10]
    );
  } else {
    for (let i = 0; i < 12; i++) {
      Pop.week.push(0);
      Pop.month.push(0);
      Pop.year.push(0);
    }
    Pop.growth = 0;
  }
  return Pop;
};
function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

const craftSalesHisto = () => {
  const Obj = {Sales: []};
  const listPromoStr = [
    'special event sales',
    'random sales',
    'Editor sales',
    'Summer sales',
    'Winter sales',
    'Fall sales',
    'Spring sales',
    'Neofest'
  ];

  const max = Math.floor(Math.random() * 8 + 4);
  const mois = [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre'
  ];
  let previousDate = new Date(2020, 0, 1);

  for (let i = 0; i < max; i++) {
    let d = randomDate(previousDate, new Date());
    let temp = {};
    temp['name'] = listPromoStr[Math.floor(Math.random() * 6)];

    temp['date'] =
      d.getDate().toString() +
      '/' +
      d.getMonth().toString() +
      '/' +
      d.getUTCFullYear();
    //d.getDate().toString()+" "+mois[d.getMonth()].toString()+" "+d.getUTCFullYear();

    temp['reduc'] = Math.floor(-Math.random() * 80 - 10);
    previousDate = d;
    Obj['Sales'].push(temp);
  }

  return Obj;
};

// Collector

const getAppById = async (appId) =>
  await axios.get(
    `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=fr&l=fr`
  ); //.data["400"].data;
const getReviewById = async (appId) =>
  await axios.get(
    `https://store.steampowered.com/appreviews/${appId}?json=1&language=all`
  ); //.data["query_summary"];
const getCurrentPlayer = async (appId) =>
  await axios.get(
    `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?format=json&appid=${appId}`
  );

const ListOfGames = {data: []};

for (let i = 0; i < 100; i++) {
  await new Promise((r) => setTimeout(r, 1000));
  console.log('trying ' + ListAppId[i] + ' for index:' + i);
  const apiResponse = await getAppById(ListAppId[i]);
  //console.log(apiResponse.data[ListAppId[i]])
  if (
    apiResponse.data[ListAppId[i]]['success'] &&
    apiResponse.data[ListAppId[i]].data['type'] === 'game'
  ) {
    const gameInfo = createJson(apiResponse.data[ListAppId[i]].data);
    const apiResponseReview = await getReviewById(ListAppId[i]);

    gameInfo['review'] = calcScore(apiResponseReview.data['query_summary']);
    gameInfo['duration'] = craftDurationGame();

    try {
      const apiResponseCurrentPlayer = await getCurrentPlayer(ListAppId[i]);
      gameInfo['in_game_pop'] =
        apiResponseCurrentPlayer.data['response']['player_count'];
    } catch (err) {
      gameInfo['in_game_pop'] = 0; //
    }

    gameInfo['popHisto'] = craftPopHisto(gameInfo['in_game_pop']);
    gameInfo['salesHisto'] = craftSalesHisto()['Sales'];

    ListOfGames.data.push(gameInfo);
  }
}
