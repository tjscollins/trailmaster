/*global describe it sinon*/

/*----------Modules----------*/
import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import {Provider} from 'react-redux';
import {configure} from 'configureStore';

/*----------Components----------*/
import connectedListTrails, {ListTrails} from 'ListTrails';
let initialState = {
  'geoJSON': {
    'type': 'FeatureCollection',
    'features': [{
        '_id': '587df765d96e98209375e82a',
        '__v': 0,
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            [-214.27445769309995,
              15.167432624111209
            ],
            [-214.27433967590332,
              15.167339428181535
            ],
            [-214.27423238754272,
              15.16729800775516
            ],
            [-214.27410364151,
              15.167266942430045
            ],
            [-214.27393198013303,
              15.167173746427308
            ],
            [-214.27384614944458,
              15.16707019526498
            ],
            [-214.27374958992004,
              15.1669459338032
            ],
            [-214.2737603187561,
              15.166790606873256
            ],
            [-214.27362084388733,
              15.166666345247119
            ],
            [-214.27348136901855,
              15.166593859264797
            ],
            [-214.27334189414978,
              15.166583504122432
            ],
            [-214.2730736732483,
              15.1665627938362
            ],
            [-214.27295565605164,
              15.166511018111713
            ],
            [-214.27278399467468,
              15.166500662965289
            ],
            [-214.27260160446164,
              15.16647995267094
            ],
            [-214.2724084854126,
              15.166438532076121
            ],
            [-214.27226901054382,
              15.16641782177568
            ],
            [-214.27207589149472,
              15.1663764011687
            ],
            [-214.27189350128174,
              15.166283204773304
            ],
            [-214.2716896533966,
              15.166148587685205
            ],
            [-214.27155017852783,
              15.166127877356354
            ],
            [-214.27136778831482,
              15.166179653174693
            ],
            [-214.2711532115936,
              15.166210718659611
            ],
            [-214.27094936370847,
              15.166231428980334
            ],
            [-214.27080988883972,
              15.166190008336828
            ],
            [-214.27067041397092,
              15.16606574635761
            ],
            [-214.2705202102661,
              15.16600361534061
            ],
            [-214.27037000656128,
              15.165972549825248
            ]
          ]
        },
        'properties': {
          'stroke': '#555555',
          'stroke-width': 2,
          'stroke-opacity': 1,
          'name': 'Chalan Kiya to Kannat Tabla Connector',
          'desc': 'Trail to move from Kannat Tabla area down into Chalan Kiya near the start of the Chalan Kiya ravine',
          'condition': 'Uncut, overgrown',
          'last': 'Dec 2015',
          'displayed': false
        }
      },
      {
        '_id': '584dfbbfd96e98209375e82b',
        'type': 'Feature',
        '__v': 0,
        'geometry': {
          'type': 'Point',
          'coordinates': [-214.2152855,
            15.167236099999998
          ]
        },
        'properties': {
          'marker-color': '#7e7e7e',
          'marker-size': 'medium',
          'marker-symbol': '',
          'name': 'Kagman High',
          'desc': 'test',
          'condition': 'test',
          'last': 'Dec 2016',
          'displayed': false
        }
      },
      {
        '_id': '585df765d96e98209375e82a',
        '__v': 0,
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [-214.25509314401245,
            15.10071455043649
          ]
        },
        'properties': {
          'marker-color': '#7e7e7e',
          'marker-size': 'medium',
          'marker-symbol': '',
          'name': 'Rabbit Hole',
          'desc': 'Hole descends from top of cliff to bottom, forming climbable cave',
          'condition': 'Rope in good condition',
          'last': 'June 2014',
          'displayed': false
        }
      },
      {
        '_id': '586df765d96e98209375e82a',
        '__v': 0,
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [-214.2563098669052,
            15.18629359866948
          ]
        },
        'properties': {
          'marker-color': '#7e7e7e',
          'marker-size': 'medium',
          'marker-symbol': '',
          'name': 'Concrete Jesus',
          'desc': 'Concrete statue of Jesus at the peak of Mt. Tapotchau',
          'condition': 'Rough dirt road, easy access on foot',
          'last': 'June 2016',
          'displayed': false
        }
      }
    ]
  },
  'searchText': {
    'POISearchText': '',
    'RoutesSearchText': '',
    'trailSearchText': '',
    'updateSearchText': '',
  },
  'map': {
    'accessToken': 'pk.eyJ1IjoidGpzY29sbGlucyIsImEiOiJjaXdhZjl4b3AwM2h5MzNwbzZ0eDg0YWZsIn0.uR5NCLn73_X2M9PxDO_4KA',
    'center': {
      'lng': 145.7189568,
      'lat': 15.165089100000001
    },
    'update': false
  },
  'userLocation': {
    'trackingRoute': false,
    'routeList': [],
    'mapCentering': false,
    'coords': {
      'latitude': 15.165089100000001,
      'longitude': 145.7189568
    }
  },
  'trails': {
    'myTrails': [{
        '_id': '5890677b9e6ccb2f6c8cd258',
        '_creator': '5890677b9e6ccb2f6c8cd255',
        'name': 'Kagman High to Rabbit Trail',
        'desc': 'Test',
        'date': 'Dec 2016',
        '__v': 0,
        'list': [{
            '_id': '585df765d96e98209375e82a',
            'type': 'Feature',
            '__v': 0,
            'geometry': {
              'type': 'Point',
              'coordinates': [-214.25509214401245,
                15.10071455043649
              ]
            },
            'properties': {
              'marker-color': '#7e7e7e',
              'marker-size': 'medium',
              'marker-symbol': '',
              'name': 'Rabbit Hole',
              'desc': 'Hole descends from top of cliff to bottom, forming climbable cave',
              'condition': 'Rope in good condition',
              'last': 'June 2014',
              'displayed': true
            }
          },
          {
            '_id': '584dfbbfd96e98209375e82b',
            'type': 'Feature',
            '__v': 0,
            'geometry': {
              'type': 'Point',
              'coordinates': [-214.2152855,
                15.167236099999998
              ]
            },
            'properties': {
              'marker-color': '#7e7e7e',
              'marker-size': 'medium',
              'marker-symbol': '',
              'name': 'Kagman High',
              'desc': 'test',
              'condition': 'test',
              'last': 'Dec 2016',
              'displayed': true
            }
          }
        ]
      },
      {
        '_id': '58917fcdeed04b1d8cafdcb5',
        'name': 'New Trail',
        'desc': 'Test',
        'date': 'Feb 2017',
        '_creator': '5890677b9e6ccb2f6c8cd255',
        '__v': 0,
        'list': [{
            '_id': '587df765d96e98209375e82a',
            '__v': 0,
            'type': 'Feature',
            'geometry': {
              'type': 'LineString',
              'coordinates': [
                [-214.27445769309995,
                  15.167432624111209
                ],
                [-214.27433967590332,
                  15.167339428181535
                ],
                [-214.27423238754272,
                  15.16729800775516
                ],
                [-214.27410364151,
                  15.167266942430045
                ],
                [-214.27393198013303,
                  15.167173746427308
                ],
                [-214.27384614944458,
                  15.16707019526498
                ],
                [-214.27374958992004,
                  15.1669459338032
                ],
                [-214.2737603187561,
                  15.166790606873256
                ],
                [-214.27362084388733,
                  15.166666345247119
                ],
                [-214.27348136901855,
                  15.166593859264797
                ],
                [-214.27334189414978,
                  15.166583504122432
                ],
                [-214.2730736732483,
                  15.1665627938362
                ],
                [-214.27295565605164,
                  15.166511018111713
                ],
                [-214.27278399467468,
                  15.166500662965289
                ],
                [-214.27260160446164,
                  15.16647995267094
                ],
                [-214.2724084854126,
                  15.166438532076121
                ],
                [-214.27226901054382,
                  15.16641782177568
                ],
                [-214.27207589149472,
                  15.1663764011687
                ],
                [-214.27189350128174,
                  15.166283204773304
                ],
                [-214.2716896533966,
                  15.166148587685205
                ],
                [-214.27155017852783,
                  15.166127877356354
                ],
                [-214.27136778831482,
                  15.166179653174693
                ],
                [-214.2711532115936,
                  15.166210718659611
                ],
                [-214.27094936370847,
                  15.166231428980334
                ],
                [-214.27080988883972,
                  15.166190008336828
                ],
                [-214.27067041397092,
                  15.16606574635761
                ],
                [-214.2705202102661,
                  15.16600361534061
                ],
                [-214.27037000656128,
                  15.165972549825248
                ]
              ]
            },
            'properties': {
              'stroke': '#555555',
              'stroke-width': 2,
              'stroke-opacity': 1,
              'name': 'Chalan Kiya to Kannat Tabla Connector',
              'desc': 'Trail to move from Kannat Tabla area down into Chalan Kiya near the start of the Chalan Kiya ravine',
              'condition': 'Uncut, overgrown',
              'last': 'Dec 2015',
              'displayed': false
            }
          },
          {
            '_id': '584dfbbfd96e98209375e82b',
            'type': 'Feature',
            '__v': 0,
            'geometry': {
              'type': 'Point',
              'coordinates': [-214.2152855,
                15.167236099999998
              ]
            },
            'properties': {
              'marker-color': '#7e7e7e',
              'marker-size': 'medium',
              'marker-symbol': '',
              'name': 'Kagman High',
              'desc': 'test',
              'condition': 'test',
              'last': 'Dec 2016',
              'displayed': false
            }
          },
          {
            '_id': '585df765d96e98209375e82a',
            '__v': 0,
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [-214.25509314401245,
                15.10071455043649
              ]
            },
            'properties': {
              'marker-color': '#7e7e7e',
              'marker-size': 'medium',
              'marker-symbol': '',
              'name': 'Rabbit Hole',
              'desc': 'Hole descends from top of cliff to bottom, forming climbable cave',
              'condition': 'Rope in good condition',
              'last': 'June 2014',
              'displayed': false
            }
          }
        ]
      }
    ]
  },
  'userSession': {
    'xAuth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODkwNjc3YjllNmNjYjJmNmM4Y2QyNTUiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNDg1OTI5NjUzfQ.OTBJjY3lLnXkqQTtWOv6pYPzwENgdikhFmTTjRdGfTw',
    '_id': '5890677b9e6ccb2f6c8cd255',
    'email': 'tjscollins@gmail.com',
    'visibleFeatures': []
  }
};

describe('ListTrails', ()=> {
  // it('should create a list of trails', () => {
  //
  // });
  // it('should toggle trail visibility onClick', () => {
  //
  // });
  it('should compute total trail distance', () => {
    let provider = ReactTestUtils.renderIntoDocument(
      <Provider store={configure(initialState)}>
        <connectedListTrails />
      </Provider>);
    let listTrails = ReactTestUtils.findRenderedComponentWithType(provider, connectedListTrails);
    let {trailLength} = ListTrails.prototype;
    console.log(trailLength);
    expect(trailLength.call(listTrails, '58917fcdeed04b1d8cafdcb5')).toBe(1);
  });
});
