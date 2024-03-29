import axios from "axios";

const nameToIdList =async (L) =>{
    const T={}
    console.log(L.length);
    for (let i = 0; i < L.length; i++) {
        let name=L[i]["name"];
        if(/^[\x00-\x7F]*$/.test(name)) //regex for ascii not ダメだね
            T[name.toLowerCase()]=L[i]["appid"];
    }
    return T;
}

const gameList = async () => (await axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/')).data['applist'].apps;
await console.log(await nameToIdList(await gameList()));