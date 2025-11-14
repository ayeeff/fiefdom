        // Supply chain data
        const sites = [
            {
                name: "Dongguan Songshan Lake",
                province: "Guangdong",
                city: "Dongguan",
                lat: 23.05,
                lon: 113.74,
                products: ["Steam Deck", "Steam Frame", "Future Handhelds"],
                capacity: "100k-1M units",
                notes: "Primary Deck production base, 4000+ tech firms"
            },
            {
                name: "Shenzhen Bao'an",
                province: "Guangdong",
                city: "Shenzhen",
                lat: 22.64,
                lon: 113.81,
                products: ["Steam Controller", "Prototype PCBA"],
                capacity: "50k-500k units",
                notes: "30k+ factories, 24h component turnaround"
            },
            {
                name: "Suzhou Industrial Park",
                province: "Jiangsu",
                city: "Suzhou",
                lat: 31.32,
                lon: 120.72,
                products: ["SSD Modules", "Storage Components"],
                capacity: "High-reliability",
                notes: "ISO-13485 clean rooms, medical-grade quality"
            },
            {
                name: "Shenzhen Nanshan",
                province: "Guangdong",
                city: "Shenzhen",
                lat: 22.56,
                lon: 113.97,
                products: ["R&D", "EVT/DVT Prototypes"],
                capacity: "Prototype",
                notes: "Co-located with Tencent/DJI/Huawei"
            },
            {
                name: "Tianjin THATIC",
                province: "Tianjin",
                city: "Tianjin",
                lat: 39.09,
                lon: 117.70,
                products: ["Server CPUs", "Embedded CPUs"],
                capacity: "Not Deck APU",
                notes: "AMD 51% JV, Entity List 2019"
            }
        ];
        // Create Leaflet map
        const map = L.map('mapContainer').setView([30, 114], 4.5);
       
        // Add OpenStreetMap tiles with light theme
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);
        // Custom marker colors
        const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
       
        // Calculate bounds to fit all sites
        const bounds = L.latLngBounds(sites.map(site => [site.lat, site.lon]));
       
        // Add markers for each site
        sites.forEach((site, index) => {
            const markerHtml = `
                <div style="
                    background-color: ${colors[index]};
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                "></div>
            `;
           
            const customIcon = L.divIcon({
                html: markerHtml,
                className: 'custom-marker',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });
           
            const popupContent = `
                <div style="color: #1e293b; min-width: 200px;">
                    <h3 style="font-weight: bold; margin-bottom: 8px; color: ${colors[index]};">${site.name}</h3>
                    <p style="margin: 4px 0;"><strong>Location:</strong> ${site.city}, ${site.province}</p>
                    <p style="margin: 4px 0;"><strong>Products:</strong> ${site.products.join(', ')}</p>
                    <p style="margin: 4px 0;"><strong>Capacity:</strong> ${site.capacity}</p>
                    <p style="margin: 4px 0; font-size: 12px;">${site.notes}</p>
                </div>
            `;
           
            L.marker([site.lat, site.lon], { icon: customIcon })
                .bindPopup(popupContent)
                .addTo(map);
        });
       
        // Fit map to show all sites
        map.fitBounds(bounds, { padding: [20, 20] });
       
        // Product focus horizontal bar chart
        const productData = [{
            type: 'bar',
            orientation: 'h',
            y: sites.map(s => s.name),
            x: [5, 4, 3, 4, 2],
            text: sites.map(s => s.products.join(', ')),
            textposition: 'auto',
            marker: {
                color: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'],
                line: {
                    color: 'white',
                    width: 1
                }
            }
        }];
        const productLayout = {
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            margin: { t: 20, b: 40, l: 150, r: 20 },
            xaxis: {
                title: 'Product Lines',
                color: 'white',
                gridcolor: 'rgba(255,255,255,0.1)'
            },
            yaxis: {
                color: 'white'
            },
            font: { color: 'white' }
        };
        Plotly.newPlot('productChart', productData, productLayout, {responsive: true});
        // Populate table
        const tableBody = document.getElementById('siteTable');
        sites.forEach(site => {
            const row = document.createElement('tr');
            row.className = 'border-b border-white/10 hover:bg-white/5';
            row.innerHTML = `
                <td class="px-4 py-3 font-medium">${site.name}</td>
                <td class="px-4 py-3">${site.city}</td>
                <td class="px-4 py-3">${site.province}</td>
                <td class="px-4 py-3">${site.products.join(', ')}</td>
                <td class="px-4 py-3 text-xs">${site.notes}</td>
            `;
            tableBody.appendChild(row);
        });
