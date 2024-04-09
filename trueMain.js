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
    if(T["screenshots"]){
        const maxSize=T["screenshots"].length<5?T["screenshots"].length:5;
        for (let i = 0; i <maxSize; i++) {
            gameInfo["screenshot_url"].push(T["screenshots"][i]["path_full"]);
        }
    }

    if(T["dlc"])
        gameInfo["dlc"]=T["dlc"].length;
    else{
        gameInfo["dlc"]=0;
    }

    gameInfo["categories"]=[];
    if(T["categories"]){
        const categoriesList=T["categories"]
        for (let i = 0; i < categoriesList.length; i++) {
            const tagid=categoriesList[i]["id"];
            if(tagid===1 ||   // Multi
                tagid===2 ||  // Solo
                tagid===9 ||  // coop
                tagid===38 || // coop en ligne
                tagid===39 || // coop local + sharescreen
                tagid===24 || // sharescreen
                tagid===27 || // multiplateforme
                tagid===22 || // succès steam
                tagid===28 || // compat Controlleur complète
                tagid===29 || // carte echange steam
                tagid===62 || // family shared
                tagid===49)   // PvP
            {
                gameInfo["categories"].push(categoriesList[i]["description"]);
            }
        }
    }

    if(T["genres"]){
        gameInfo["genres"]=[];
        const genresList=T["genres"]
        for (let i = 0; i < genresList.length; i++) {
            const tagid=genresList[i]["id"];
            if(tagid===1 ||     //Action
                tagid===2 ||    //Stratégie
                tagid===3 ||    //RPG
                tagid===23 ||   //Indé
                tagid===25 ||   //aventure
                tagid===28)     //simulation
            {
                gameInfo["genres"].push(genresList[i]["description"]);
            }
        }
    }
    return gameInfo
}
const calcScore=(T)=>{
    if(T["total_reviews"]!==0)
        return Math.floor(T["total_positive"]/T["total_reviews"]*100);
    return 0;
}

const craftDurationGame=()=>{
    return Math.floor(Math.random()*50+10);
}

const craftPopHisto=()=>{
    const Pop={"week":[],"month":[],"year":[]}
    let calc=0;

    let daily=Math.random()*15000+20000;
    let weekly=Math.random()*1500+2000;
    let noise=Math.random()*weekly;

    for (let i = 0; i < 14; i++) {
         calc=daily*Math.sin(2*i*Math.PI/12)+
             weekly*Math.sin(2*i*Math.PI/168)+
             noise*Math.cos(2*i*Math.PI/(1+Math.random()*3))+
             10000;
        Pop.week.push(Math.floor(Math.abs(calc)));
    }

    for (let i = 0; i < 15; i++) {
        calc=daily*Math.sin(2*i*Math.PI/24)+
            weekly*Math.sin(2*i*Math.PI/336)+
            noise*Math.cos(2*i*Math.PI/(2+Math.random()*3))+
            10000;
        Pop.month.push(Math.floor(Math.abs(calc)));
    }

    for (let i = 0; i < 12; i++) {
        calc=daily*Math.sin(2*i*Math.PI/48)+
            weekly*Math.sin(2*i*Math.PI/672)+
            noise*Math.cos(2*i*Math.PI/(2+Math.random()*3))+
            10000;
        Pop.year.push(Math.floor(Math.abs(calc)));
    }

    return Pop;
}
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const craftSalesHisto=()=>{
    const Obj={"Sales":[]};
    const listPromoStr=["Promo Exceptionnelle",
                        "Promo coup de coeur",
                        "Promo fête saisonnière",
                        "Promo éditeur",
                        "Promo chaotic",
                        "Promo fête des jeux"
    ]

    const max=Math.floor(Math.random()*2+4);
    const mois=["janvier",
        "février",
        "mars",
        "avril",
        "mai",
        "juin",
        "juillet",
        "août",
        "septembre",
        "octobre",
        "novembre",
        "décembre"
    ]
    let previousDate=new Date(2020,0,1);

    for (let i = 0; i <max; i++) {
        let d = randomDate(previousDate, new Date());
        let temp={}
        temp["name"]=listPromoStr[Math.floor(Math.random()*6)];
        temp["date"]=d.getDate().toString()+" "+mois[d.getMonth()].toString()+" "+d.getUTCFullYear();
        temp["reduc"]=Math.floor(Math.random()*100);
        previousDate=d;
        Obj["Sales"].push(temp);
    }

    return Obj
}

const getAppById = async (appId) => (await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}&cc=fr&l=fr`))//.data["400"].data;
const getReviewById = async (appId) => (await axios.get(`https://store.steampowered.com/appreviews/${appId}?json=1&language=all`))//.data["query_summary"];
const getCurrentPlayer = async (appId) => (await axios.get(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?format=json&appid=${appId}`));

const ListOfGames = {data: []};

for (let i = 0; i < 100; i++) {
    await new Promise(r => setTimeout(r, 1000));
    console.log("trying " + ListAppId[i] + " for index:" + i);
    const apiResponse= await getAppById(ListAppId[i])
    //console.log(apiResponse.data[ListAppId[i]])
        if (apiResponse.data[ListAppId[i]]["success"]) {
            console.log("\n Success");
            const gameInfo = createJson(apiResponse.data[ListAppId[i]].data);
            const apiResponseReview=await getReviewById(ListAppId[i]);


            gameInfo["Review"] = calcScore(apiResponseReview.data["query_summary"]);
            gameInfo["duration"]=craftDurationGame();

            try {
                const apiResponseCurrentPlayer = await getCurrentPlayer(ListAppId[i]);
                gameInfo["in_game_pop"]= apiResponseCurrentPlayer.data["response"]["player_count"]
            }
            catch (err){
                gameInfo["in_game_pop"]=0;//
            }

            gameInfo["popHisto"]=craftPopHisto();
            gameInfo["salesHisto"]=craftSalesHisto()["Sales"];

            ListOfGames.data.push(gameInfo);
        }
    else{
        console.log("\n no game");
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
/*
try{
    const deb=await getCurrentPlayer(400)
    console.log(deb.data)
    const debZ=await getCurrentPlayer(1000460)
    console.log(debZ.data);
}
catch (err){console.log("err")}*/