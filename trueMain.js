import axios from "axios";
import fs from "fs";
const nameToIdList =async (L) =>{
    const T={};
    const ListId=[];
    //console.log(L.length);
    for (let i = 0; i < L.length; i++) {
        let name=L[i]["name"];
        if(/^[\x00-\x7F]*$/.test(name)) //regex for ascii not ダメだね
            T[name.toLowerCase()]=L[i]["appid"];
            ListId.push(L[i]["appid"])
    }
    return [T,ListId];
}

const gameList = async () => (await axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/')).data['applist'].apps;
//await console.log();
const jsonAndList=await nameToIdList(await gameList());
const jsonData=JSON.stringify(jsonAndList[0]);
const ListAppId=jsonAndList[1].sort();

/*
try {
    fs.writeFileSync("C:\\Users\\tthea\\WebstormProjects\\apiwip\\gameId.json", jsonData);
    console.log('JSON data saved to file successfully.');
} catch (error) {
    console.error('Error writing JSON data to file:', error);
}
*/
//////////////=>/ / // /// /
const createJson=(T)=>{
    const gameInfo={}
    gameInfo["name"]=T["name"];
    if(T["price_overview"])
        gameInfo["price"]=(T["price_overview"]["initial"]/100);
    else{
        gameInfo["price"]=-42.69;
    }
    gameInfo["screenshot_url"]=[];
    const maxSize=T["screenshots"].length<5?T["screenshots"].length:5;
    for (let i = 0; i <maxSize; i++) {
        gameInfo["screenshot_url"].push(T["screenshots"][i]["path_full"]);
    }
    return gameInfo
}
const calcScore=(T)=>{
    if(T["total_reviews"]!==0)
        return Math.floor(T["total_positive"]/T["total_reviews"]*100);
    return 0;
}

const getAppById = async (appId) => (await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}&cc=fr&l=fr`))//.data["400"].data;
const getReviewById = async (appId) => (await axios.get(`https://store.steampowered.com/appreviews/${appId}?json=1&language=all`))//.data["query_summary"];


const ListOfGames = {data: []};

for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 1000));
    console.log("trying " + ListAppId[i] + " for index:" + i);
    const apiResponse= await getAppById(ListAppId[i])
    //console.log(apiResponse.data[ListAppId[i]])
        if (apiResponse.data[ListAppId[i]]["success"]) {
            console.log("\n success!!!!!!!!!!!!!!!! \n");
            const gameInfo = createJson(apiResponse.data[ListAppId[i]].data);
            const apiResponseReview=await getReviewById(ListAppId[i]);
            gameInfo["Review"] = calcScore(apiResponseReview.data["query_summary"]);
            ListOfGames.data.push(gameInfo);
        }
    else{
        console.log("\n not in \n");
    }
}
const ListOfGamesJson = JSON.stringify(ListOfGames);


try {
    fs.writeFileSync("C:\\Users\\tthea\\WebstormProjects\\apiwip\\gameId.json", jsonData);
    fs.writeFileSync("C:\\Users\\tthea\\WebstormProjects\\apiwip\\ListOfGames.json", ListOfGamesJson);
    console.log('JSON data saved to file successfully.');
} catch (error) {
    console.error('Error writing JSON data to file:', error);
}
