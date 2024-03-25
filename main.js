import axios from "axios";

const nameToIdList =(L) =>{
    const T={}
    for (let i = 0; i < L.length; i++) {
        let name=L[i]["name"];
        if(/^[\x00-\x7F]*$/.test(name)) //regex for ascii ダメだね
            T[name.toLowerCase()]=L[i]["appid"];
    }
    return T;
}

// Make a request for a user with a given ID
await axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/')
    .then(function (response) {
        // handle success
        const T=nameToIdList(response.data.applist.apps)
        //console.log(T); un peu long a tout print mais ça marche👍

    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .finally(function () {
        // always executed
    });

