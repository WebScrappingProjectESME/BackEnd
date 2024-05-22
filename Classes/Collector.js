import * as R from 'ramda';
import axios from 'axios';

export default class Collector {
  gameListUrl = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';
  appDetailsUrl = 'https://store.steampowered.com/api/appdetails';
  reviewsUrl = 'https://store.steampowered.com/appreviews';
  currentPlayersUrl =
    'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/';

  getAppIDList = R.tryCatch(
    async () => (await axios.get(this.gameListUrl)).data.applist.apps,
    (error) => {
      console.error('Error fetching game list:', error);
      return [];
    }
  );

  getAppById = R.tryCatch(
    async (appId) =>
      (await axios.get(`${this.appDetailsUrl}?appids=${appId}&cc=fr&l=fr`))
        .data[appId].data,
    (error, appId) => {
      console.error(`Error fetching app details for appId ${appId}:`, error);
      return null;
    }
  );

  getReviewById = R.tryCatch(
    async (appId) =>
      (await axios.get(`${this.reviewsUrl}/${appId}?json=1&language=all`)).data
        .query_summary,
    (error, appId) => {
      console.error(`Error fetching reviews for appId ${appId}:`, error);
      return null;
    }
  );

  getInstantPlayersById = R.tryCatch(
    async (appId) =>
      (await axios.get(`${this.currentPlayersUrl}?format=json&appid=${appId}`))
        .data.response.player_count,
    (error, appId) => {
      console.error(
        `Error fetching current player count for appId ${appId}:`,
        error
      );
      return 0;
    }
  );
}

// TEST ZONE

// (async () => {
//   const collector = new Collector();
//
//   const gameList = await collector.getGameList();
//   console.log('Retrieved game list:', gameList);
//
//   const appId = 400; // Example app ID
//   const appDetails = await collector.getAppById(appId);
//   console.log(`Details for app ${appId}:`, appDetails);
//
//   const reviews = await collector.getReviewById(appId);
//   console.log(`Reviews for app ${appId}:`, reviews);
//
//   const playerCount = await collector.getNumberOfCurrentPlayers(appId);
//   console.log(`Current players for app ${appId}:`, playerCount);
// })();
