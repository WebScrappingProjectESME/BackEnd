const apiUrl = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';

// Make a GET request
var steamJsonRaw=fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
function nameToId(obj){
    var retobj = {};
    for (let i = 0; i <obj.size; i++) {
        retobj[obj['name']]=obj['appid'];
    }
    return retobj;
}

console.log(steamJsonRaw.then());
inverseKey=nameToId(steamJsonRaw["applist"]["apps"]);

console.log(inverseKey);