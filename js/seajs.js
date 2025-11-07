define(function(require, exports, module) {
  // Historical Migration Routes to Australia - Main JavaScript
  var routes = {
    'first-fleet': {
      name: 'First Fleet Route (1787-1788)',
      color: '#16a34a',
      stops: [
        { name: 'Portsmouth, England', lat: 50.8198, lng: -1.0880, info: 'Departed May 13, 1787', distance: 'Start' },
        { name: 'Santa Cruz, Tenerife', lat: 28.4636, lng: -16.2518, info: 'Loaded water, vegetables, meat. 21 days', distance: '~1,200 nm' },
        { name: 'Rio de Janeiro, Brazil', lat: -22.9068, lng: -43.1729, info: 'Arrived August 5, 1787. Ship cleaning, repairs, ~1 month', distance: '~4,800 nm' },
        { name: 'Table Bay, Cape Town', lat: -33.9249, lng: 18.4241, info: 'Arrived October 13, 1787. Livestock, seeds, plants loaded', distance: '~3,900 nm' },
        { name: 'Sydney Cove, Australia', lat: -33.8568, lng: 151.2153, info: 'Arrived January 26, 1788 (relocated from Botany Bay)', distance: '~5,100 nm' }
      ]
    },
    'second-fleet': {
      name: 'Second Fleet Route (1790)',
      color: '#dc2626',
      stops: [
        { name: 'Portsmouth, England', lat: 50.8198, lng: -1.0880, info: 'Departed January 19, 1790', distance: 'Start' },
        { name: 'Tenerife, Canary Islands', lat: 28.4636, lng: -16.2518, info: 'Brief water stop, 10-14 days', distance: '~1,200 nm' },
        { name: 'Cape Town, South Africa', lat: -33.9249, lng: 18.4241, info: 'Arrived April 13-22, 1790. High mortality, 30-40 day resupply', distance: '~5,500 nm' },
        { name: 'Sydney Cove, Australia', lat: -33.8568, lng: 151.2153, info: 'Arrived June 26-28, 1790. ~160 deaths total', distance: '~6,000 nm' }
      ]
    },
    'guangzhou-ballarat': {
      name: 'Chinese Gold Rush Route (1850s-1860s)',
      color: '#2563eb',
      stops: [
        { name: 'Guangzhou/Hong Kong, China', lat: 23.1291, lng: 113.2644, info: 'Departure point, 70-90 day voyage', distance: 'Start' },
        { name: 'South China Sea Exit (Luzon)', lat: 18.5, lng: 120.5, info: 'Southeast sail, 7-10 days. Early disease risks', distance: '~800 nm' },
        { name: 'Coral Sea (near PNG)', lat: -8, lng: 147, info: 'East-southeast through Pacific, 18-25 days. Typhoon hazards', distance: '~2,000 nm' },
        { name: 'Java Sea', lat: -12, lng: 110, info: 'Westward loop through Indonesian waters', distance: '~1,500 nm' },
        { name: 'Indian Ocean (West Australia)', lat: -25, lng: 105, info: 'Entered Indian Ocean off Western Australia', distance: '~1,200 nm' },
        { name: 'Indian Ocean Loop (40°S)', lat: -40, lng: 115, info: 'South for Roaring Forties westerlies, 10-15 days. Stormy, sea burials', distance: '~1,000 nm' },
        { name: 'Great Australian Bight', lat: -35, lng: 130, info: 'Eastward push with gales, 8-12 days', distance: '~900 nm' },
        { name: 'Robe, South Australia', lat: -37.1625, lng: 139.7583, info: 'Landed 1856-1863, ~17,000 migrants to evade Victorian taxes', distance: 'Landfall' },
        { name: 'Casterton', lat: -37.5863, lng: 141.4003, info: 'Crossed Glenelg River. Indigenous/settler encounters. 5-7 days', distance: '80-100 km' },
        { name: 'Coleraine/Hamilton', lat: -37.7427, lng: 142.0156, info: 'Hilly terrain. Inn resupplies often denied due to racism. 5-7 days', distance: '80-100 km' },
        { name: 'Skipton/Linton', lat: -37.6833, lng: 143.3667, info: 'Grampians foothills. Outbreaks, starvation. Trail markers. 7-8 days', distance: '100-110 km' },
        { name: 'Ballarat', lat: -37.5622, lng: 143.8503, info: 'Black Hill ascent. ~9,000 by 1858 at Golden Point. 3-4 days', distance: '50-60 km' }
      ]
    }
  };
  var map;
  var routeLayers = {};
  var shipMarkers = {};
  var animationIntervals = {};
  var visibleRoutes = {
    'first-fleet': true,
    'second-fleet': true,
    'guangzhou-ballarat': true
  };
  // Route Change Arrows Data (arrows at significant course changes)
  var routeChangeArrows = [
    // First Fleet
    { lat: -22.9068, lng: -43.1729, bearing: 116.3, name: 'First Fleet: Course change at Rio de Janeiro' },
    // Second Fleet
    { lat: 28.4636, lng: -16.2518, bearing: 149.9, name: 'Second Fleet: Course change at Tenerife' },
    // Guangzhou
    { lat: -8, lng: 147, bearing: 260.6, name: 'Chinese Route: Course change in Coral Sea' },
    { lat: -12, lng: 110, bearing: 199.3, name: 'Chinese Route: Course change in Java Sea' },
    { lat: -40, lng: 115, bearing: 71.9, name: 'Chinese Route: Course change in Roaring Forties' }
  ];

  function initMap() {
    map = L.map('map', {
      center: [-10, 100],
      zoom: 3,
      minZoom: 2,
      maxZoom: 10
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    // Add route change arrows
    addRouteChangeArrows();
    drawAllRoutes();
  }

  function addRouteChangeArrows() {
    routeChangeArrows.forEach(function(arrow) {
      var rotation = arrow.bearing - 90; // Adjust for arrow orientation (➤ points right by default)
      var arrowHtml = '<div class="change-arrow" style="transform: rotate(' + rotation + 'deg);">➤</div>';
      var arrowIcon = L.divIcon({
        className: 'change-arrow-marker',
        html: arrowHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      });
      var marker = L.marker([arrow.lat, arrow.lng], { icon: arrowIcon }).addTo(map);
      marker.bindPopup('Course Change: ' + arrow.name + '<br>New Direction: ' + arrow.bearing.toFixed(1) + '°');
    });
  }

  function drawAllRoutes() {
    var allBounds = [];
   
    // Stop any existing animations
    for (var animId in animationIntervals) {
      if (animationIntervals.hasOwnProperty(animId)) {
        clearInterval(animationIntervals[animId]);
      }
    }
    animationIntervals = {};
   
    // Remove existing ship markers
    for (var shipId in shipMarkers) {
      if (shipMarkers.hasOwnProperty(shipId) && shipMarkers[shipId]) {
        map.removeLayer(shipMarkers[shipId]);
      }
    }
    shipMarkers = {};
   
    for (var routeId in routes) {
      if (routes.hasOwnProperty(routeId)) {
        if (routeLayers[routeId]) {
          var layers = routeLayers[routeId];
          for (var i = 0; i < layers.length; i++) {
            map.removeLayer(layers[i]);
          }
        }
       
        if (visibleRoutes[routeId]) {
          routeLayers[routeId] = [];
          var route = routes[routeId];
          var coordinates = [];
          var stopsLen = route.stops.length;
         
          for (var j = 0; j < stopsLen; j++) {
            coordinates.push([route.stops[j].lat, route.stops[j].lng]);
          }
          var polyline = L.polyline(coordinates, {
            color: route.color,
            weight: 3,
            opacity: 0.7
          }).addTo(map);
         
          routeLayers[routeId].push(polyline);
          allBounds.push(polyline.getBounds());
          for (var k = 0; k < stopsLen; k++) {
            var stop = route.stops[k];
            var index = k + 1;
            var markerHtml = '<div style="background-color: ' + route.color + '; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; font-size: 10px;">' + index + '</div>';
           
            var marker = L.marker([stop.lat, stop.lng], {
              icon: L.divIcon({
                className: 'custom-marker',
                html: markerHtml,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              })
            }).addTo(map);
            marker.stopData = stop;
            marker.routeColor = route.color;
            marker.on('click', function(e) {
              showStopInfo(e.target.stopData, e.target.routeColor);
            });
            routeLayers[routeId].push(marker);
          }
         
          // Start ship animation for this route
          animateShip(routeId, coordinates, route.color);
        }
      }
    }
   
    if (allBounds.length > 0) {
      var combinedBounds = allBounds[0];
      for (var m = 1; m < allBounds.length; m++) {
        combinedBounds.extend(allBounds[m]);
      }
      map.fitBounds(combinedBounds, { padding: [50, 50] });
    }
  }

  function showStopInfo(stop, color) {
    document.getElementById('stop-name').textContent = stop.name;
    document.getElementById('stop-description').textContent = stop.info;
    document.getElementById('stop-distance').textContent = 'Distance: ' + stop.distance;
    document.getElementById('stop-route-color').style.backgroundColor = color;
    document.getElementById('stop-info').classList.remove('hidden');
  }

  function animateShip(routeId, coordinates, color) {
    if (coordinates.length < 2) return;
   
    // Create ship icon
    var shipHtml = '<div style="font-size: 20px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); transform: rotate(0deg);">🚢</div>';
   
    var shipIcon = L.divIcon({
      className: 'ship-marker',
      html: shipHtml,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
   
    var shipMarker = L.marker(coordinates[0], { icon: shipIcon }).addTo(map);
    shipMarkers[routeId] = shipMarker;
   
    var currentSegment = 0;
    var progress = 0;
    var speed = 0.02; // Doubled from 0.01 for faster ship speed
   
    function calculateBearing(start, end) {
      var startLat = start[0] * Math.PI / 180;
      var startLng = start[1] * Math.PI / 180;
      var endLat = end[0] * Math.PI / 180;
      var endLng = end[1] * Math.PI / 180;
     
      var dLng = endLng - startLng;
      var y = Math.sin(dLng) * Math.cos(endLat);
      var x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
      var bearing = Math.atan2(y, x) * 180 / Math.PI;
     
      return (bearing + 360) % 360;
    }
   
    // Wind/current effect: bobbing motion to simulate waves and currents
    function getWindOffset(progress, segmentIndex, start) {
      var waveFreq = 20; // Frequency of bobbing
      var waveAmp = 0.05; // Amplitude of bobbing (degrees)
      var currentOffset = 0.01 * Math.sin(segmentIndex * Math.PI / coordinates.length); // Slight current deviation per segment
      var latOffset = Math.sin(progress * Math.PI * waveFreq) * waveAmp;
      var lngOffset = Math.cos(progress * Math.PI * waveFreq) * waveAmp * Math.cos((start[0] + latOffset) * Math.PI / 180); // Approximate for longitude scaling
      return { lat: latOffset + currentOffset, lng: lngOffset };
    }
   
    animationIntervals[routeId] = setInterval(function() {
      if (currentSegment >= coordinates.length - 1) {
        currentSegment = 0;
        progress = 0;
      }
     
      var start = coordinates[currentSegment];
      var end = coordinates[currentSegment + 1];
     
      progress += speed;
     
      if (progress >= 1) {
        progress = 0;
        currentSegment++;
        if (currentSegment >= coordinates.length - 1) {
          currentSegment = 0;
        }
        start = coordinates[currentSegment];
        end = coordinates[currentSegment + 1];
      }
     
      var baseLat = start[0] + (end[0] - start[0]) * progress;
      var baseLng = start[1] + (end[1] - start[1]) * progress;
     
      var windOffset = getWindOffset(progress, currentSegment, start);
      var lat = baseLat + windOffset.lat;
      var lng = baseLng + windOffset.lng;
     
      var bearing = calculateBearing(start, end);
      var rotation = bearing - 90; // Adjust for ship icon orientation
     
      var rotatedShipHtml = '<div style="font-size: 20px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); transform: rotate(' + rotation + 'deg); transition: transform 0.3s ease;">🚢</div>';
     
      shipMarker.setLatLng([lat, lng]);
      shipMarker.setIcon(L.divIcon({
        className: 'ship-marker',
        html: rotatedShipHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      }));
    }, 50);
  }
  // Event Listeners
  document.getElementById('check-first-fleet').addEventListener('change', function(e) {
    visibleRoutes['first-fleet'] = e.target.checked;
    drawAllRoutes();
  });
  document.getElementById('check-second-fleet').addEventListener('change', function(e) {
    visibleRoutes['second-fleet'] = e.target.checked;
    drawAllRoutes();
  });
  document.getElementById('check-guangzhou').addEventListener('change', function(e) {
    visibleRoutes['guangzhou-ballarat'] = e.target.checked;
    drawAllRoutes();
  });
  document.getElementById('close-info').addEventListener('click', function() {
    document.getElementById('stop-info').classList.add('hidden');
  });
  // Initialize map on window load
  window.addEventListener('load', initMap);

  // Export for SeaJS
  module.exports = {
    init: initMap,
    routes: routes
  };
});
