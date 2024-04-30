
class collector{

}

import axios from "axios";
const gameList = async () => (await axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/')).data['applist'].apps;
//await console.log();
const jsonAndList=await nameToIdList(await gameList());
const jsonData=JSON.stringify(jsonAndList[0]);
const ListAppId=jsonAndList[1].sort();

ListAppId.unshift(1245620);
ListAppId.unshift(230410);
ListAppId.unshift(1085660);
ListAppId.unshift(238960);
ListAppId.unshift(913740);
ListAppId.unshift(1262350);


const getAppById = async (appId) => (await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}&cc=fr&l=fr`))//.data["400"].data;
const getReviewById = async (appId) => (await axios.get(`https://store.steampowered.com/appreviews/${appId}?json=1&language=all`))//.data["query_summary"];
const getCurrentPlayer = async (appId) => (await axios.get(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?format=json&appid=${appId}`));

const ListOfGames = {data: []};


import 'package:json_annotation/json_annotation.dart';

import 'package:main_project/types/pop_histo.dart';
import 'package:main_project/types/sales_histo.dart';

// To build this generated file : dart run build_runner build
part 'games.g.dart';



@JsonSerializable(explicitToJson: true)
class Game{
    final String name;
    final double price;

@JsonKey(name: "screenshot_url")
    final List<String> screenshotUrl;

    final double dlc;
    final List<String> categories;
    final List<String> genres;
    final double review;

@JsonKey(name: "duration")
    final double lifeTime;

@JsonKey(name: "in_game_pop")
    final double inGamePop;

    final PopHisto popHisto;
    final List<SalesHisto> salesHisto;


    Game({
             required this.name,
             required this.price,
             required this.screenshotUrl,
             required this.dlc,
             required this.categories,
             required this.genres,
             required this.review,
             required this.lifeTime,
             required this.inGamePop,
             required this.popHisto,
             required this.salesHisto
         });

    factory Game.fromJson(Map<String, dynamic> json) => _$GameFromJson(json);
    Map<String, dynamic> toJson() => _$GameToJson(this);
}
