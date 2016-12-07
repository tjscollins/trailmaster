/*----------Modules----------*/
import React from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import {connect} from 'react-redux';

/*----------Components----------*/
import BaseComponent from 'BaseComponent';

mapboxgl.accessToken = 'pk.eyJ1IjoidGpzY29sbGlucyIsImEiOiJjaXdhZjl4b3AwM2h5MzNwbzZ0eDg0YWZsIn0.uR5NCLn73_X2M9PxDO_4KA';

class MapViewer extends BaseComponent {
  constructor() {
    super();
    //this._bind(...local methods)from BaseComponent
  }
  componentDidMount() {
    if ('geolocation' in navigator) {
      /* geolocation is available */
      navigator
        .geolocation
        .getCurrentPosition(function(position) {
          // do_something(position.coords.latitude, position.coords.longitude);
        });
    } else {
      /* geolocation IS NOT available */
    }

    var map = new mapboxgl.Map({
      container: this.refs.mapviewer,
      style: 'mapbox://styles/mapbox/outdoors-v9',
      center: [
        145.72672, 15.16795
      ],
      zoom: 13
    });
  }
  render() {
    return (
      <div ref="mapviewer" className="mapviewer"></div>
    );
  }
}

export default MapViewer;
