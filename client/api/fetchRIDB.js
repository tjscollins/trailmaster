// const $ = require('../../node_modules/jquery/dist/jquery');
const https = require('https');
const fs = require('fs');
const http = require('http');

const fetchUSFSTrails = (offset) => {
  let request = https.get({
    host: 'ridb.recreation.gov',
    path: '/api/v1/trails/USFS/?limit=100&'+ `offset=${offset}&` +'apikey=C3BADB52D274489393BA37C35795B938'
  }, (res) => {
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
        pushTrailsToDB(result);
      }
    });
  });
  request.on('error', (err) => {
    throw err;
  });
  request.end();
};

for (let i = 100; i<600; i++) {
    fetchUSFSTrails(i*50);
}


const pushTrailsToDB = (file) => {
  // fs.readFile('output.json', (err, file) => {
    let data = JSON.parse(file);
    data.RECDATA.forEach((trail) => {
      let coordString = trail.GEOM.split('').slice(12);
      coordString.pop();
      let coordinates = coordString.join('').split(',').map((coord) => {
        return coord.trim().split(' ').map((n) => {
          return parseFloat(n);
        });
      });
      let newFeature = {
        'type': 'Feature',
        'properties': {
          'stroke': '#555555',
          'stroke-width': 2,
          'stroke-opacity': 1,
          'name': trail.TrailName,
          'desc': `${trail.TrailType}`,
          'condition': '',
          'last': `${trail.LastUpdatedDate}`,
          'displayed': false
        },
        'geometry': {
          'type': 'LineString',
          'coordinates': coordinates
        }
      };
      console.log(newFeature);

      let request = http.request({
        host: 'localhost',
        port: '3000',
        path: '/routes',
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
      }, (res) => {
        let result = '';
        let responseCode = res.statusCode;
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          // console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
          // console.log('No more data in response.');
        });
      });
      request.on('error', (err) => {
        throw err;
      });
      request.write(JSON.stringify(newFeature));
      request.end();
    });
  // });
};

// pushTrailsToDB();
