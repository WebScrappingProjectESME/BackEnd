import * as R from 'ramda';
import {default as Generator} from './Generator.js';
import {default as Transformer} from './Transformer.js';

// TEST ZONE

const proco = new Processor();
const transfo = new Transformer();

const rawGameData = {
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
