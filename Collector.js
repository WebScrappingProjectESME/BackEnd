import axios from "axios"

class Collector {
  constructor() {
    this.gameListUrl = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';
    this.appDetailsUrl = 'https://store.steampowered.com/api/appdetails';
    this.reviewsUrl = 'https://store.steampowered.com/appreviews';
    this.currentPlayersUrl = 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/';
  }

  async getGameList() {
    try {
      const response = await axios.get(this.gameListUrl);
      return response.data.applist.apps;
    } catch (error) {
      console.error('Error fetching game list:', error);
      return [];
    }
  }

  async getAppById(appId) {
    try {
      const response = await axios.get(`${this.appDetailsUrl}?appids=${appId}&cc=fr&l=fr`);
      return response.data[appId].data; // Assuming response structure is { appId: { data: {} } }
    } catch (error) {
      console.error(`Error fetching app details for appId ${appId}:`, error);
      return null;
    }
  }

  async getReviewById(appId) {
    try {
      const response = await axios.get(`${this.reviewsUrl}/${appId}?json=1&language=all`);
      return response.data.query_summary;
    } catch (error) {
      console.error(`Error fetching reviews for appId ${appId}:`, error);
      return null;
    }
  }

  async getNumberOfCurrentPlayers(appId) {
    try {
      const response = await axios.get(`${this.currentPlayersUrl}?format=json&appid=${appId}`);
      return response.data.response.player_count;
    } catch (error) {
      console.error(`Error fetching current player count for appId ${appId}:`, error);
      return 0;
    }
  }
}

(async () => {
  const collector = new Collector();

  const gameList = await collector.getGameList();
  console.log('Retrieved game list:', gameList);

  const appId = 400; // Example app ID
  const appDetails = await collector.getAppById(appId);
  console.log(`Details for app ${appId}:`, appDetails);

  const reviews = await collector.getReviewById(appId);
  console.log(`Reviews for app ${appId}:`, reviews);

  const playerCount = await collector.getNumberOfCurrentPlayers(appId);
  console.log(`Current players for app ${appId}:`, playerCount);
})();
