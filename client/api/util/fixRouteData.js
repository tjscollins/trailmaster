const https = require('https');
const fs = require('fs');
const http = require('http');

(function() {
  const requestOptions = {
    host: 'localhost',
    path: '/routes',
    // port: 3000
  };
  const getRoutesRequest = https.get(requestOptions, collectResponse.bind(this, processRoutes));
});

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
  list.forEach(patchRoutes);
}

function patchRoutes(route) {
  console.log(route.geometry);
  const requestOptions = {
    host: 'localhost',
    path: `/routes/${route._id}`,
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
