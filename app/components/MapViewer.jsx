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
    this.map = null;
  }
  componentDidMount() {
    var {geoJSON} = this.props;
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
    var navControl = new mapboxgl.NavigationControl();
    var geoControl = new mapboxgl.GeolocateControl();
    this.map = this.map || new mapboxgl.Map({
      container: 'mapviewer',
      style: 'mapbox://styles/tjscollins/ciwafclun000p2pmr47hnf307',
      center: [
        145.72672, 15.16795
      ],
      zoom: 12,
      hash: false,
      interactive: true
    });
    this
      .map
      .on('load', () => {
        //Try loading interface
        //Try loading desired data.... :()
      });

    console.log(this.map);
  }
  render() {
    return (<div id="mapviewer" className="mapviewer"/>);
  }
}
export default connect(state => state)(MapViewer);
