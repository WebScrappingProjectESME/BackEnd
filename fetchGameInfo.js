import axios from "axios";
import fs from "fs";

const createJsona=(T)=>{
    const gameInfo={};
    gameInfo["name"]=T["name"];
    gameInfo["price"]=(T["price_overview"]["initial"]/100).toString()+" €";
    gameInfo["screenshot_url"]=[];
    for (let i = 0; i <T["screenshots"].length; i++) {
        gameInfo["screenshot_url"].push(T["screenshots"][i]["path_full"]);
    }

    return gameInfo
}
const calcScore=(T)=>{
    if(T["total_reviews"]!==0)
        return Math.floor(T["total_positive"]/T["total_reviews"]*100);
    return 0;
}

//const appids=400;
//console.log('https://store.steampowered.com/api/appdetails?appids='+appids)
                //https://store.steampowered.com/api/appdetails?appids='+appids+'&cc=fr&l=fr'
                //https://store.steampowered.com/appreviews/'+appids+'?json=1&language=all'

const getAppById = async (appId) => (await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}&cc=fr&l=fr`))//;
const getReviewById = async (appId) => (await axios.get(`https://store.steampowered.com/appreviews/${appId}?json=1&language=all`))//;

if(getAppById.success){
    const gameInfo=createJson(await getAppById(1002690).data["400"].data);
    gameInfo["Review"]=calcScore(await getReviewById(1002690).data["query_summary"]);
    const jsonData=JSON.stringify(gameInfo);


    try {
        fs.writeFileSync("C:\\Users\\tthea\\WebstormProjects\\apiwip\\TestSoloGame.json", jsonData);
        console.log('JSON data saved to file successfully.');
    } catch (error) {
        console.error('Error writing JSON data to file:', error);
    }
}

