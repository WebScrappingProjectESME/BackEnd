import axios from "axios";

const createJson=(T)=>{
    const gameInfo={}
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
const getAppById = async (appId) => (await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}&cc=fr&l=fr`)).data["400"].data;
const getReviewById = async (appId) => (await axios.get(`https://store.steampowered.com/appreviews/${appId}?json=1&language=all`)).data["query_summary"];

const gameInfo=createJson(await getAppById(400));
gameInfo["Review"]=calcScore(await getReviewById(400));

console.log(gameInfo);


