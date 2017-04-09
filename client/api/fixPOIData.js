const https = require('https');
const fs = require('fs');
const http = require('http');

(function() {
  const requestOptions = {
    host: 'trailmaster.herokuapp.com',
    path: '/pois',
    // port: 3000
  };
  const getRoutesRequest = https.get(requestOptions, collectResponse.bind(this, processRoutes));
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
      // fs.appendFile('output.json', result);
      processResponse(result);
    }
  });
}

function processRoutes(routes) {
  let list = JSON
    .parse(routes)
    .pois
    .map((poi) => {
      poi.geometry.coordinates = poi.geometry.coordinates.map((n, i) => {
        if (i==0 && n < -180) {
          return n+360;
        } else {
          return n;
        }
      });

      // route
      //   .geometry
      //   .coordinates
      //   .map((coords) => {
      //     if (coords[0] < -180) {
      //       return [
      //         coords[0] + 360,
      //         coords[1]
      //       ];
      //     } else {
      //       return coords;
      //     }
      //   });
      return poi;
    });
  list.forEach(patchRoutes);
}

function patchRoutes(route) {
  console.log(route.geometry);
  const requestOptions = {
    host: 'trailmaster.herokuapp.com',
    path: `/pois/${route._id}`,
    // port: 3000,
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json',
    },
  };
  const sendRoutes = https.request(requestOptions, (res) => {
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
        console.log('Response: ' + chunk);
    });
  });
  sendRoutes.write(JSON.stringify(route));
  sendRoutes.end();
}
