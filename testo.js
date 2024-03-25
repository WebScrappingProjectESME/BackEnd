async function beautifulFunctionName(url) {
    let response = await fetch(url);
    console.log(response);
    const Json= await response.json();
    console.log(Json);
    return Json;
}
const apiUrl = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';

rawJson= beautifulFunctionName(apiUrl);
console.log(("uwunt"))
console.log(rawJson["applist"]);


