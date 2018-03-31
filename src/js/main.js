const axios = require('axios');
const DB = require('../env/db_env.js');

const URL_PRE = `https://api.mlab.com/api/1/databases/${DB.name}`;
const URL_SUF = `?apiKey=${DB.apiKey}`;

let map;
let markers = [];
let markerCluster;

const getCallData = () => {
  for (let marker of markers) {
    marker.setMap(null);
  }
  if (typeof(markerCluster) !== 'undefined') markerCluster.clearMarkers();

  axios.get(`${URL_PRE}/collections/locations${URL_SUF}`)
  .then(res => {
    console.log(res.data);
    markers = res.data.map((data, i) => new google.maps.Marker({
      position: data,
      map: map,
      icon: {
        url: 'https://raw.githubusercontent.com/googlemaps/js-marker-clusterer/gh-pages/images/people45.png',
        scaledSize: {
          height: 20, 
          width: 20
        }
      }
    }));
    markerCluster = new MarkerClusterer(map, markers, {
      imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    });
  })
  .catch(err => {
    console.log(err);
  });
};

const initMap = () => {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: new google.maps.LatLng(25.04, 121.53),
    // mapTypeId: 'terrain'
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(pos);
      map.setZoom(15);
      console.log('set loc');
    }, () => {
      console.log('get loc fail');
    });
  }
  
  getCallData();

  setInterval(() => {
    getCallData();
  }, 10000);

  var legend = document.getElementById('legend');
  // for (let i = 1; i <= 3; i++) {
  //   var div = document.createElement('div');
  //   div.innerHTML = `<img src="https://raw.githubusercontent.com/googlemaps/js-marker-clusterer/gh-pages/images/m${i}.png">`;
  //   legend.appendChild(div);
  // }
  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);
};

initMap();
