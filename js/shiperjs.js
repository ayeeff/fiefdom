// Historical Migration Routes to Australia - Interactive Map Script
// shipjs.js

(function() {
  'use strict';
  
  // Wait for DOM and Leaflet to be ready
  if (typeof L === 'undefined') {
    console.error('Leaflet library not loaded');
    return;
  }
  
  // Initialize map
  const map = L.map('migrate-map', {
    center: [-20, 100],
    zoom: 3,
    minZoom: 2,
    maxZoom: 10
  });
  
  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);
  
  // Route data with historical information
  const routes = {
    firstFleet: {
      name: 'First Fleet',
      color: '#16a34a',
      path: [
        [51.5074, -0.1278],   // London
        [28.4636, -16.2518],  // Tenerife
        [-22.9068, -43.1729], // Rio de Janeiro
        [-33.9249, 18.4241],  // Cape Town
        [-33.8688, 151.2093]  // Sydney
      ],
      stops: [
        { 
          name: 'London, England', 
          desc: 'Departure point - May 13, 1787. Fleet of 11 ships carrying 1,487 people including convicts, marines, and officers.', 
          distance: 'Start' 
        },
        { 
          name: 'Tenerife, Canary Islands', 
          desc: 'First resupply stop in early June 1787. Ships took on fresh water and provisions.', 
          distance: '~2,900 km from London' 
        },
        { 
          name: 'Rio de Janeiro, Brazil', 
          desc: 'Major resupply stop - stayed for one month (August 1787). Convicts allowed on deck for exercise.', 
          distance: '~5,800 km from Tenerife' 
        },
        { 
          name: 'Cape Town, South Africa', 
          desc: 'Final major resupply before crossing the Indian Ocean. Departed November 1787.', 
          distance: '~6,800 km from Rio' 
        },
        { 
          name: 'Sydney Cove, Australia', 
          desc: 'Arrival - January 26, 1788. Only 48 deaths during the entire voyage (~3% mortality).', 
          distance: '~10,400 km from Cape Town' 
        }
      ]
    },
    secondFleet: {
      name: 'Second Fleet',
      color: '#dc2626',
      path: [
        [51.5074, -0.1278],   // London
        [28.4636, -16.2518],  // Tenerife
        [-33.9249, 18.4241],  // Cape Town
        [-33.8688, 151.2093]  // Sydney
      ],
      stops: [
        { 
          name: 'London, England', 
          desc: 'Departure - January 1790. Six ships operated by private contractors (not Royal Navy).', 
          distance: 'Start' 
        },
        { 
          name: 'Tenerife, Canary Islands', 
          desc: 'Brief stop for basic supplies. Harsh conditions already evident.', 
          distance: '~2,900 km from London' 
        },
        { 
          name: 'Cape Town, South Africa', 
          desc: 'Last stop before crossing Indian Ocean. Many convicts already sick from malnutrition and abuse.', 
          distance: '~9,600 km from Tenerife' 
        },
        { 
          name: 'Sydney Cove, Australia', 
          desc: 'Arrival - June 1790. Known as the "Death Fleet" - ~267 deaths (26% mortality) due to starvation and mistreatment.', 
          distance: '~10,400 km from Cape Town' 
        }
      ]
    },
    chinese: {
      name: 'Chinese Miners',
      color: '#2563eb',
      path: [
        [23.1291, 113.2644],   // Guangzhou/Hong Kong
        [18.5, 120.5],         // South China Sea Exit (Luzon)
        [-8, 147],             // Coral Sea (near PNG)
        [-12, 110],            // Java Sea
        [-25, 105],            // Indian Ocean (West Australia)
        [-40, 115],            // Indian Ocean Loop (40°S)
        [-35, 130],            // Great Australian Bight
        [-37.1625, 139.7583],  // Robe, South Australia
        [-37.5863, 141.4003],  // Casterton
        [-37.7427, 142.0156],  // Coleraine/Hamilton
        [-37.6833, 143.3667],  // Skipton/Linton
        [-37.5622, 143.8503]   // Ballarat
      ],
      stops: [
        { 
          name: 'Guangzhou/Hong Kong, China', 
          desc: 'Departure point, 70-90 day voyage. Organized by clan networks and ticket-credit system.', 
          distance: 'Start' 
        },
        { 
          name: 'South China Sea Exit (Luzon)', 
          desc: 'Southeast sail, 7-10 days. Early disease risks from crowded conditions.', 
          distance: '~800 nm' 
        },
        { 
          name: 'Coral Sea (near PNG)', 
          desc: 'East-southeast through Pacific, 18-25 days. Typhoon hazards and rough seas.', 
          distance: '~2,000 nm' 
        },
        { 
          name: 'Java Sea', 
          desc: 'Westward loop through Indonesian waters. Navigation through narrow straits.', 
          distance: '~1,500 nm' 
        },
        { 
          name: 'Indian Ocean (West Australia)', 
          desc: 'Entered Indian Ocean off Western Australia. Preparation for southern crossing.', 
          distance: '~1,200 nm' 
        },
        { 
          name: 'Indian Ocean Loop (40°S)', 
          desc: 'South for Roaring Forties westerlies, 10-15 days. Stormy conditions, many sea burials.', 
          distance: '~1,000 nm' 
        },
        { 
          name: 'Great Australian Bight', 
          desc: 'Eastward push with fierce gales, 8-12 days. Final maritime push.', 
          distance: '~900 nm' 
        },
        { 
          name: 'Robe, South Australia', 
          desc: 'Landed 1856-1863, ~17,000 migrants to evade Victorian £10 poll taxes. Beginning of 500km overland trek.', 
          distance: 'Landfall' 
        },
        { 
          name: 'Casterton', 
          desc: 'Crossed Glenelg River. Indigenous/settler encounters. 5-7 days march through pastoral country.', 
          distance: '80-100 km' 
        },
        { 
          name: 'Coleraine/Hamilton', 
          desc: 'Hilly terrain. Inn resupplies often denied due to racism. 5-7 days through hostile settlements.', 
          distance: '80-100 km' 
        },
        { 
          name: 'Skipton/Linton', 
          desc: 'Grampians foothills. Disease outbreaks, starvation common. Trail markers visible. 7-8 days.', 
          distance: '100-110 km' 
        },
        { 
          name: 'Ballarat', 
          desc: 'Black Hill ascent. Final destination - ~9,000 Chinese by 1858 at Golden Point diggings. 3-4 days.', 
          distance: '50-60 km' 
        }
      ]
    }
  };
  
  // Store route layers and markers for toggling
  const routeLayers = {};
  const routeMarkers = {};
  
  // Create ship icon for markers
  const createShipIcon = (color) => {
    return L.divIcon({
      html: `<svg width="20" height="20" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2">
               <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z"/>
             </svg>`,
      className: 'custom-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };
  
  // Create routes with polylines and markers
  Object.keys(routes).forEach(key => {
    const route = routes[key];
    const markers = [];
    
    // Create polyline for the route
    const polyline = L.polyline(route.path, {
      color: route.color,
      weight: 3,
      opacity: 0.8,
      smoothFactor: 1
    }).addTo(map);
    
    // Add decorative arrows to show direction
    const decorator = L.polylineDecorator(polyline, {
      patterns: [
        {
          offset: '5%',
          repeat: 100,
          symbol: L.Symbol.arrowHead({
            pixelSize: 8,
            polygon: false,
            pathOptions: { 
              stroke: true, 
              color: route.color,
              weight: 2,
              opacity: 0.6
            }
          })
        }
      ]
    }).addTo(map);
    
    // Add markers for each stop
    route.stops.forEach((stop, index) => {
      // Different marker size for sea vs land stops (Chinese route)
      const isLandStop = key === 'chinese' && index >= 7; // Robe onwards
      const radius = isLandStop ? 6 : 8;
      const markerColor = isLandStop ? '#fbbf24' : route.color; // Gold for land stops
      
      const marker = L.circleMarker(route.path[index], {
        radius: radius,
        fillColor: markerColor,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(map);
      
      // Click event to show info panel
      marker.on('click', function() {
        showStopInfo(route, stop);
      });
      
      // Popup on hover
      marker.bindPopup(`
        <div style="font-family: system-ui, -apple-system, sans-serif;">
          <strong style="color: ${route.color}; font-size: 14px;">${stop.name}</strong>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #666;">${stop.desc}</p>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #999; font-weight: 600;">${stop.distance}</p>
        </div>
      `, {
        maxWidth: 300
      });
      
      markers.push(marker);
    });
    
    routeLayers[key] = { polyline, decorator, markers };
    routeMarkers[key] = markers;
  });
  
  // Function to show stop information in the side panel
  function showStopInfo(route, stop) {
    const infoPanel = document.getElementById('migrate-info');
    const routeColor = document.getElementById('migrate-route-color');
    const stopName = document.getElementById('migrate-stop-name');
    const stopDesc = document.getElementById('migrate-stop-desc');
    const stopDistance = document.getElementById('migrate-stop-distance');
    
    if (infoPanel && routeColor && stopName && stopDesc && stopDistance) {
      routeColor.style.backgroundColor = route.color;
      stopName.textContent = stop.name;
      stopDesc.textContent = stop.desc;
      stopDistance.textContent = stop.distance;
      infoPanel.classList.remove('migrate-hidden');
    }
  }
  
  // Checkbox controls for toggling routes
  const checkboxes = {
    'migrate-check-first': 'firstFleet',
    'migrate-check-second': 'secondFleet',
    'migrate-check-chinese': 'chinese'
  };
  
  Object.keys(checkboxes).forEach(checkboxId => {
    const checkbox = document.getElementById(checkboxId);
    const routeKey = checkboxes[checkboxId];
    
    if (checkbox) {
      checkbox.addEventListener('change', function(e) {
        const layers = routeLayers[routeKey];
        const markers = routeMarkers[routeKey];
        
        if (e.target.checked) {
          // Show route
          if (layers.polyline) map.addLayer(layers.polyline);
          if (layers.decorator) map.addLayer(layers.decorator);
          markers.forEach(marker => map.addLayer(marker));
        } else {
          // Hide route
          if (layers.polyline) map.removeLayer(layers.polyline);
          if (layers.decorator) map.removeLayer(layers.decorator);
          markers.forEach(marker => map.removeLayer(marker));
        }
      });
    }
  });
  
  // Close button for info panel
  const closeBtn = document.getElementById('migrate-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      const infoPanel = document.getElementById('migrate-info');
      if (infoPanel) {
        infoPanel.classList.add('migrate-hidden');
      }
    });
  }
  
  // Close info panel when clicking outside
  map.on('click', function() {
    const infoPanel = document.getElementById('migrate-info');
    if (infoPanel && !infoPanel.classList.contains('migrate-hidden')) {
      infoPanel.classList.add('migrate-hidden');
    }
  });
  
  // Fit map to show all routes
  const allCoordinates = [];
  Object.keys(routes).forEach(key => {
    allCoordinates.push(...routes[key].path);
  });
  
  if (allCoordinates.length > 0) {
    const bounds = L.latLngBounds(allCoordinates);
    map.fitBounds(bounds, { padding: [50, 50] });
  }
  
  console.log('Historical Migration Routes map initialized successfully');
  
})();
