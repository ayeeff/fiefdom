(function() {
    const sites = [
        {name: "Dongguan Songshan Lake", province: "Guangdong", city: "Dongguan", lat: 23.05, lon: 113.74, products: ["Steam Deck", "Steam Frame", "Steam Machine"], capacity: "100k-1M units"},
        {name: "Shenzhen Bao'an", province: "Guangdong", city: "Shenzhen", lat: 22.64, lon: 113.81, products: ["Steam Controller", "Prototype PCBA"], capacity: "50k-500k units"},
        {name: "Suzhou Industrial Park", province: "Jiangsu", city: "Suzhou", lat: 31.32, lon: 120.72, products: ["SSD Modules", "Storage Components"], capacity: "High-reliability"},
        {name: "Shenzhen Nanshan", province: "Guangdong", city: "Shenzhen", lat: 22.56, lon: 113.97, products: ["R&D", "EVT/DVT Prototypes"], capacity: "High"},
        {name: "Tianjin THATIC", province: "Tianjin", city: "Tianjin", lat: 39.09, lon: 117.70, products: ["Server CPUs", "Embedded CPUs"], capacity: "High"}
    ];
   
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
    const colorNames = ['Blue', 'Purple', 'Green', 'Orange', 'Red'];
   
    const map = L.map('steamsupply-map').setView([30, 114], 4.5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; OpenStreetMap contributors', maxZoom: 19}).addTo(map);
   
    const bounds = L.latLngBounds(sites.map(site => [site.lat, site.lon]));
   
    sites.forEach((site, index) => {
        const markerHtml = `<div style="background-color: ${colors[index]}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`;
        const customIcon = L.divIcon({html: markerHtml, className: 'steamsupply-custom-marker', iconSize: [24, 24], iconAnchor: [12, 12]});
        const popupContent = `<div style="color: #1e293b; min-width: 200px;"><h3 style="font-weight: bold; margin-bottom: 8px; color: ${colors[index]};">${site.name}</h3><p style="margin: 4px 0;"><strong>Location:</strong> ${site.city}, ${site.province}</p><p style="margin: 4px 0;"><strong>Products:</strong> ${site.products.join(', ')}</p><p style="margin: 4px 0;"><strong>Capacity:</strong> ${site.capacity}</p></div>`;
        L.marker([site.lat, site.lon], {icon: customIcon}).bindPopup(popupContent).addTo(map);
    });
   
    map.fitBounds(bounds, {padding: [20, 20]});
   
    const tableBody = document.getElementById('steamsupply-table-body');
    sites.forEach((site, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td style="font-weight: 500;">${site.name}</td><td><span class="steamsupply-color-dot" style="background-color: ${colors[index]}"></span></td><td>${site.province}</td><td>${site.products.join(', ')}</td>`;
        tableBody.appendChild(row);
    });
})();
