// import {geoJSON} from 'geoJSON';
import uuid from 'uuid';
import $ from 'jquery';

export const userSessionReducer = (state = {
  xAuth: '',
  email: '',
  _id: '',
  visibleFeatures: [],
  distanceFilter: 50,
  trackingRoute: false,
  routeList: [],
  mapCentering: false,
  coords: {
    latitude: 15,
    longitude: 145
  },
}, action) => {
  switch (action.type) {
    case 'LOGIN':
      //store Login data to sessionStorage;
      let {xAuth, userId, email} = action;
      let trailmasterLogin = {
        xAuth,
        _id: userId,
        email,
      };
      sessionStorage.setItem('trailmaster-login', JSON.stringify(trailmasterLogin));
      return {
        ...state,
        xAuth,
        _id: userId,
        email,
      };
    case 'LOGOUT':
      sessionStorage.removeItem('trailmaster-login');
      return {
        ...state,
        xAuth: null,
        _id: null,
        email: null,
      };
    case 'TOGGLE_VISIBILITY':
      return state
        .visibleFeatures
        .indexOf(action.id) > -1
        ? {
          ...state,
          visibleFeatures: state
            .visibleFeatures
            .filter((id) => {
              return id !== action.id;
            }),
        }
        : {
          ...state,
          visibleFeatures: [
            ...state.visibleFeatures,
            action.id,
          ],
        };
    case 'UPDATE_DISTANCE_FILTER':
      return {
        ...state,
        distanceFilter: action.distance
      };
    case 'UPDATE_POS':
      return {
        ...state,
        coords: {
          latitude: action.position.coords.latitude,
          longitude: action.position.coords.longitude,
        },
      };
    case 'TOGGLE_MAP_CENTERING':
      return {
        ...state,
        mapCentering: !state.mapCentering,
      };
    case 'TRACK_ROUTE':
      return {
        ...state,
        trackingRoute: true,
      };
    case 'STOP_TRACKING_ROUTE':
      return {
        ...state,
        trackingRoute: false,
      };
    case 'CLEAR_ROUTE_LIST':
      return {
        ...state,
        routeList: [],
      };
    case 'ADD_TO_ROUTE_LIST':
      return {
        ...state,
        routeList: [
          ...state.routeList,
          [
            action.position.coords.longitude, action.position.coords.latitude,
          ],
        ],
      };
    default:
      return state;
  }
};

export const trailsReducer = (state = {
  myTrails: []
}, action) => {
  switch (action.type) {
    case 'DISPLAY_TRAILS':
      var {trails} = action;
      return {
        ...state,
        myTrails: trails,
      };
    case 'CLEAR_TRAILS':
      return {
        ...state,
        myTrails: [],
      };
    case 'SAVE_TRAIL':
      var {list, name, desc,} = action;
      var date = new Date();
      var newTrail = {
        list,
        name,
        desc,
        date: `${month(date.getMonth())} ${date.getFullYear()}`,
      };
      return {
        ...state,
        myTrails: [
          ...state.myTrails,
          newTrail,
        ],
      };
    case 'SHOW_TRAIL':
      return state;
    default:
      return state;
  }
};

export const mapReducer = (state = {
  update: false,
  center: []
}, action) => {
  switch (action.type) {
    case 'UPDATE_MAP':
      return {
        ...state,
        update: true
      };
    case 'COMPLETE_UPDATE_MAP':
      return {
        ...state,
        update: false
      };
    case 'STORE_CENTER':
      return {
        ...state,
        center: action.center
      };
    default:
      return state;
  }
};

export const searchTextReducer = (state = {
  POISearchText: '',
  RoutesSearchText: '',
  trailSearchText: '',
  updateSearchText: '',
}, action) => {
  switch (action.type) {
    case 'UPDATE_SEARCH_TEXT':
      return {
        ...state,
        updateSearchText: action.updateSearchText,
      };
    case 'SET_POI_SEARCH_TEXT':
      return {
        ...state,
        POISearchText: action.POISearchText,
      };
    case 'SET_ROUTES_SEARCH_TEXT':
      return {
        ...state,
        RoutesSearchText: action.RoutesSearchText,
      };
    case 'SET_TRAIL_SEARCH_TEXT':
      return {
        ...state,
        trailSearchText: action.trailSearchText,
      };
    default:
      return state;
  }
};

export const geoJSONReducer = (state = initialGeoState, action) => {
  switch (action.type) {
    case 'REPLACE_GEO_JSON':
      let {features} = action;
      return {
        ...state,
        features: features,
      };
    case 'UPDATE_GEO_JSON':
      var {point} = action;
      var unchangedFeatures = state
        .features
        .filter((data) => {
          return data._id !== point._id;
        });
      return {
        ...state,
        features: [
          ...unchangedFeatures,
          point,
        ],
      };
    case 'ADD_POI':
      var {feature} = action;
      return {
        ...state,
        features: [
          ...state.features,
          feature,
        ],
      };
    case 'ADD_ROUTE':
      var {feature} = action;
      return {
        ...state,
        features: [
          ...state.features,
          feature,
        ],
      };
    default:
      // console.error(`${this} received unknown action type ${action.type}`);
      return state;
  }
};

var initialGeoState = {

  type: 'FeatureCollection',
  features: [
    {
      _id: '1',
      type: 'Feature',
      properties: {
        stroke: '#555555',
        'stroke-width': 2,
        'stroke-opacity': 1,
        name: 'Chalan Kiya to Kannat Tabla Connector',
        desc: 'Trail to move from Kannat Tabla area down into Chalan Kiya near the start of the' +
            ' Chalan Kiya ravine',
        condition: 'Uncut, overgrown',
        last: 'Dec 2015',
        displayed: false,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [
            -214.27445769309995, 15.167432624111209,
          ],
          [
            -214.27433967590332, 15.167339428181535,
          ],
          [
            -214.27423238754272, 15.16729800775516,
          ],
          [
            -214.27410364151, 15.167266942430045,
          ],
          [
            -214.27393198013303, 15.167173746427308,
          ],
          [
            -214.27384614944458, 15.16707019526498,
          ],
          [
            -214.27374958992004, 15.1669459338032,
          ],
          [
            -214.2737603187561, 15.166790606873256,
          ],
          [
            -214.27362084388733, 15.166666345247119,
          ],
          [
            -214.27348136901855, 15.166593859264797,
          ],
          [
            -214.27334189414978, 15.166583504122432,
          ],
          [
            -214.2730736732483, 15.1665627938362,
          ],
          [
            -214.27295565605164, 15.166511018111713,
          ],
          [
            -214.27278399467468, 15.166500662965289,
          ],
          [
            -214.27260160446164, 15.16647995267094,
          ],
          [
            -214.2724084854126, 15.166438532076121,
          ],
          [
            -214.27226901054382, 15.16641782177568,
          ],
          [
            -214.27207589149472, 15.1663764011687,
          ],
          [
            -214.27189350128174, 15.166283204773304,
          ],
          [
            -214.2716896533966, 15.166148587685205,
          ],
          [
            -214.27155017852783, 15.166127877356354,
          ],
          [
            -214.27136778831482, 15.166179653174693,
          ],
          [
            -214.2711532115936, 15.166210718659611,
          ],
          [
            -214.27094936370847, 15.166231428980334,
          ],
          [
            -214.27080988883972, 15.166190008336828,
          ],
          [
            -214.27067041397092, 15.16606574635761,
          ],
          [
            -214.2705202102661, 15.16600361534061,
          ],
          [
            -214.27037000656128, 15.165972549825248,
          ],
        ],
      },
    }, {
      _id: '2',
      type: 'Feature',
      properties: {
        'marker-color': '#7e7e7e',
        'marker-size': 'medium',
        'marker-symbol': '',
        name: 'Concrete Jesus',
        desc: 'Concrete statue of Jesus at the peak of Mt. Tapotchau',
        condition: 'Rough dirt road, easy access on foot',
        last: 'June 2016',
        displayed: false,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -214.2563098669052, 15.18629359866948,
        ],
      },
    }, {
      _id: '4',
      type: 'Feature',
      properties: {
        'marker-color': '#7e7e7e',
        'marker-size': 'medium',
        'marker-symbol': '',
        name: 'Rabbit Hole',
        desc: 'Hole descends from top of cliff to bottom, forming climbable cave',
        condition: 'Rope in good condition',
        last: 'June 2014',
        displayed: false,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -214.25509214401245, 15.10071455043649,
        ],
      },
    }, {
      _id: '3',
      type: 'Feature',
      properties: {
        stroke: '#555555',
        'stroke-width': 2,
        'stroke-opacity': 1,
        name: 'Laderan Tanki to Bird Island Overlook',
        desc: 'Route runs downhill through jungle',
        condition: 'Bees!',
        last: 'Oct 2016',
        displayed: false,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [
            -214.20404434204102, 15.252627544019386,
          ],
          [
            -214.20395851135254, 15.25263789493473,
          ],
          [
            -214.20381903648376, 15.252668947677712,
          ],
          [
            -214.2036259174347, 15.252658596763894,
          ],
          [
            -214.20349717140198, 15.25263789493473,
          ],
          [
            -214.20326113700867, 15.252544736678244,
          ],
          [
            -214.20304656028748, 15.252482631150974,
          ],
          [
            -214.20283198356628, 15.25243087653088,
          ],
          [
            -214.2026925086975, 15.252368770969959,
          ],
          [
            -214.20254230499265, 15.252368770969959,
          ],
          [
            -214.202241897583, 15.252358420041357,
          ],
          [
            -214.2021024227142, 15.252420525605345,
          ],
          [
            -214.20186638832092, 15.252565438516593,
          ],
          [
            -214.2017161846161, 15.252679298591021,
          ],
          [
            -214.20156598091125, 15.252793158603772,
          ],
          [
            -214.2014479637146, 15.252917369456375,
          ],
          [
            -214.201340675354, 15.25310368559763,
          ],
          [
            -214.20119047164917, 15.253217545380402,
          ],
          [
            -214.20100808143616, 15.253383159499752,
          ],
          [
            -214.20082569122314, 15.253476317384495,
          ],
          [
            -214.20072913169858, 15.253662633030117,
          ],
          [
            -214.20072913169858, 15.25378684336873,
          ],
          [
            -214.20037508010864, 15.254004211284615,
          ],
          [
            -214.20001029968262, 15.254190526462086,
          ],
          [
            -214.19988155364987, 15.254273333154597,
          ],
          [
            -214.19947385787964, 15.254376841474345,
          ],
          [
            -214.1991949081421, 15.254563156321382,
          ],
          [
            -214.19880867004395, 15.254749471003183,
          ],
          [
            -214.1985297203064, 15.25493578551976,
          ],
          [
            -214.19844388961792, 15.254977188723215,
          ],
          [
            -214.1982936859131, 15.255101398284665,
          ],
          [
            -214.19805765151978, 15.255246309346854,
          ],
          [
            -214.197735786438, 15.25555683271498,
          ],
          [
            -214.19743537902832, 15.255950161655683,
          ],
          [
            -214.19711351394653, 15.256198579554576,
          ],
          [
            -214.19700622558594, 15.256446997159715,
          ],
          [
            -214.19668436050415, 15.25663331017077,
          ],
          [
            -214.1962766647339, 15.256757518753004,
          ],
          [
            -214.19591188430786, 15.256840324433693,
          ],
          [
            -214.19541835784912, 15.256985234296353,
          ],
          [
            -214.19513940811157, 15.256985234296353,
          ],
          [
            -214.19492483139038, 15.257130144059044,
          ],
          [
            -214.194495677948, 15.257275053721775,
          ],
          [
            -214.19430255889893, 15.257875392688074,
          ],
          [
            -214.19423818588257, 15.258227314732657,
          ],
          [
            -214.19385194778442, 15.258744846079999,
          ],
          [
            -214.19357299804688, 15.258931157052865,
          ],
          [
            -214.19318675994873, 15.258951858261872,
          ],
          [
            -214.19297218322754, 15.25882765097724,
          ],
          [
            -214.19267177581784, 15.258869053413598,
          ],
          [
            -214.19241428375244, 15.258889754628735,
          ],
          [
            -214.19222116470337, 15.25882765097724,
          ],
        ],
      },
    },
  ],
};

var month = (mo) => {
  switch (mo) {
    case 0:
      return 'Jan';
    case 1:
      return 'Feb';
    case 2:
      return 'Mar';
    case 3:
      return 'Apr';
    case 4:
      return 'May';
    case 5:
      return 'Jun';
    case 6:
      return 'Jul';
    case 7:
      return 'Aug';
    case 8:
      return 'Sep';
    case 9:
      return 'Oct';
    case 10:
      return 'Nov';
    case 11:
      return 'Dec';
    default:
      return mo;
  }
};
