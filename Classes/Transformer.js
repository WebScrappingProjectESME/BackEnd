import * as R from 'ramda';
import fs from 'fs';

import {default as Generator} from './Generator.js';
import {default as Collector} from './Collector.js';

export default class Transformer {
  generator = new Generator();
  collector = new Collector();

  whiteList = [
    'steam_appid',
    'price_overview',
    'screenshots',
    'dlc',
    'categories',
    'genres'
  ];

  // Basic Transformation Function
  isASCII = R.and(R.test(/^[\x00-\x7F]*$/), R.isNotEmpty);
  filterGameData = R.pick(this.whiteList);
  formatGameData = R.applySpec({key: R.prop(0), data: R.prop(1)});
  promiseAll = (x) => Promise.all(x);

  // Math functions
  calculatePercent = R.pipe(
    R.converge(R.divide, [R.nth(0), R.nth(1)]),
    R.multiply(100, R.__)
  );

  calculateReview = R.pipeWith(R.andThen, [
    this.collector.getReviewById,
    R.juxt([R.prop('total_positive'), R.prop('total_reviews')]),
    this.calculatePercent
  ]);

  calculatePrice = R.pipe(R.prop('initial'), R.divide(R.__, 100));

  // Filter appIdData Function
  filterGameName = R.filter(R.pipe(R.prop('name'), this.isASCII));

  // Generate and Format Missing Data Functions
  formatPopulationData = R.pipeWith(R.andThen(), [
    this.generator.generatePopulationData,
    R.append(R.__, ['population']),
    this.formatGameData
  ]);

  formatSalesData = R.pipe(
    this.generator.getRandomListOfSale(),
    R.append(R.__, ['salesHistory']),
    this.formatGameData
  );

  formatReviewData = R.pipeWith(R.andThen, [
    this.calculateReview,
    R.append(R.__, ['review']),
    this.formatGameData
  ]);

  // Filter, Control and Format GameData Functions
  appendMissingGameData = (gameData) => {
    const appId = gameData.map(
      R.when(R.propSatisfies(R.equals('appId'), 'key'), R.prop('data'))
    );
    return R.pipe(
      R.append(this.formatPopulationData(appId)),
      R.append(this.formatSalesData),
      R.append(this.formatReviewData(appId)),
      this.promiseAll
    )(gameData);
  };

  modifyGameData = R.map(
    R.cond([
      [
        R.propSatisfies(R.equals('steam_appid'), 'key'),
        R.set(R.lensProp('key'), 'appId')
      ],
      [
        R.propSatisfies(R.equals('price_overview'), 'key'),
        R.pipe(
          R.set(R.lensProp('key'), 'price'),
          R.over(R.lensProp('data'), this.calculatePrice)
        )
      ],
      [
        R.propSatisfies(R.equals('dlc'), 'key'),
        R.over(R.lensProp('data'), R.length)
      ],
      [R.T, R.identity]
    ])
  );

  filterAndFormatGameData = R.pipe(
    this.filterGameData,
    R.toPairs,
    R.map(this.formatGameData)
  );

  controlGameData = R.pipe(
    this.filterAndFormatGameData,
    this.modifyGameData,
    this.appendMissingGameData
  );

  transformGameData = R.applySpec({
    name: R.prop('name'),
    data: this.controlGameData
  });

  // Saving function
  saveAsFile(path, object) {
    try {
      fs.writeFileSync(path, JSON.stringify(object));
    } catch (error) {
      console.error('Error writing JSON data to file:', error);
    }
  }
}

// TEST ZONE

const trans = new Transformer();

const gameData = {
  type: 'game',
  name: 'Portal',
  steam_appid: 400,
  required_age: 0,
  is_free: false,
  controller_support: 'full',
  dlc: [],
  detailed_description: 'string',
  about_the_game: 'string',
  short_description: 'string',
  supported_languages: 'string',
  header_image: 'string',
  capsule_image: 'string',
  capsule_imagev5:
    'https://cdn.akamai.steamstatic.com/steam/apps/400/capsule_184x69.jpg?t=1699003695',
  website: 'http://www.whatistheorangebox.com/',
  pc_requirements: {},
  mac_requirements: {},
  linux_requirements: [],
  developers: [],
  publishers: [],
  demos: [],
  price_overview: {},
  packages: [],
  package_groups: [],
  platforms: {},
  metacritic: {},
  categories: [],
  genres: [],
  screenshots: [],
  movies: [],
  recommendations: {},
  achievements: {},
  release_date: {},
  support_info: {},
  background:
    'https://cdn.akamai.steamstatic.com/steam/apps/400/page_bg_generated_v6b.jpg?t=1699003695',
  background_raw:
    'https://cdn.akamai.steamstatic.com/steam/apps/400/page_bg_generated.jpg?t=1699003695',
  content_descriptors: {},
  ratings: {}
};

//console.log(await trans.transformGameData(gameData));

console.log(await trans.controlGameData(gameData));
