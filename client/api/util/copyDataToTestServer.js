const https = require('https');
const fs = require('fs');
const http = require('http');

const LOCAL_SERVER = 'localhost';
const TEST_SERVER = 'trailmaster-test-server.herokuapp.com';
const PROD_SERVER = 'trailmaster.herokuapp.com';

(function() {
  const requestPoIsOptions = {
    host: PROD_SERVER,
    path: '/pois',
  };
  const requestRoutesOptions = {
    host: PROD_SERVER,
    path: '/routes',
  };
  const getPoIs = https.get(requestPoIsOptions, collectResponse.bind(this, processPoIs));
  const getRoutes = https.get(requestRoutesOptions, collectResponse.bind(this, processRoutes));
})();

function collectResponse(processResponse, res) {
  let result = '';
  let responseCode = res.statusCode;
  res.on('data', (data) => {
    console.log('Received data', result.length);
    result += data;
  });

  res.on('end', () => {
    if (responseCode >= 400) {
      throw result;
    } else {
      processResponse(result);
    }
  });
}

function processPoIs(poiCollection) {
  let list = JSON
    .parse(poiCollection)
    .pois
    .map((poi) => {
      poi.geometry.coordinates = poi.geometry.coordinates.map((n, i) => {
        if (i==0 && n < -180) {
          return n+360;
        } else {
          return n;
        }
      });
      return poi;
    });
  list.forEach(sendPoIs);
}

function sendPoIs(poi) {
  const host = process.argv[2] === 'local' ? LOCAL_SERVER : TEST_SERVER;
  const requestOptions = {
    host,
    path: `/pois`,
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  };
  const req = process.argv[2] === 'local' ? http : https;
  if (process.argv[2] === 'local') {
    requestOptions.port = 3000;
  }
  const postRequest = req.request(requestOptions, (res) => {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
        console.log('Response: ' + chunk);
    });
  });
  postRequest.write(JSON.stringify(poi));
  postRequest.end();
}

function processRoutes(routeCollection) {
  let list = JSON
    .parse(routeCollection)
    .routes
    .map((route) => {
      route.geometry.coordinates = route
        .geometry
        .coordinates
        .map((coords) => {
          if (coords[0] < -180) {
            return [
              coords[0] + 360,
              coords[1]
            ];
          } else {
            return coords;
          }
        });
      return route;
    });
  list.forEach(sendRoutes);
}

function sendRoutes(route) {
  const host = process.argv[2] === 'local' ? LOCAL_SERVER : TEST_SERVER;
  const requestOptions = {
    host,
    path: `/routes`,
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  };
  const req = process.argv[2] === 'local' ? http : https;
  if (process.argv[2] === 'local') {
    requestOptions.port = 3000;
  }
  const postRequest = req.request(requestOptions, (res) => {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
        console.log('Response: ' + chunk);
    });
  });
  postRequest.write(JSON.stringify(route));
  postRequest.end();
}
