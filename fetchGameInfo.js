import axios from "axios";

const createJson=(T)=>{
    const gameInfo={}
    gameInfo["name"]=T["name"];
    gameInfo["price"]=(T["price_overview"]["initial"]/100).toString()+" €";
    gameInfo["thumbnail_URL"]=[];
    for (let i = 0; i <T["screenshots"].length; i++) {
        gameInfo["thumbnail_URL"].push(T["screenshots"][i]["path_full"]);
    }

    return gameInfo
}
const appids=400;

console.log('https://store.steampowered.com/api/appdetails?appids='+appids)
                //https://store.steampowered.com/api/appdetails?appids='+appids+'&cc=fr&l=fr'
                //https://store.steampowered.com/appreviews/'+appids+'?json=1&language=all'
const getAppById = async (appId) => (await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}`)).data["400"].data;



console.log(createJson(await getAppById(400)));


