import axios from "axios";
import fs from "fs";
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
//await console.log();
const jsonData=JSON.stringify(await nameToIdList(await gameList()));

//console.log("start");
try {
    fs.writeFileSync("C:\\Users\\tthea\\WebstormProjects\\apiwip\\gameId.json", jsonData);
    console.log('JSON data saved to file successfully.');
} catch (error) {
    console.error('Error writing JSON data to file:', error);
}
//console.log("end");