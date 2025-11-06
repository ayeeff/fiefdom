// Skin Cancer Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Data structure
    const data = {
        australia: {
            name: "Australia",
            national: { white: 55, other: 7.5 },
            regions: [
                { region: "Queensland", white: 65, other: 8 },
                { region: "Western Australia", white: 55, other: 6 },
                { region: "New South Wales", white: 50, other: 7 },
                { region: "Victoria", white: 45, other: 5 },
                { region: "South Australia", white: 50, other: 6 },
                { region: "Tasmania", white: 48, other: null },
                { region: "Northern Territory", white: 40, other: 12 },
                { region: "Australian Capital Territory", white: 42, other: null }
            ]
        },
        canada: {
            name: "Canada",
            national: { white: 22.5, other: 3.5 },
            regions: [
                { region: "British Columbia", white: 28, other: 4 },
                { region: "Ontario", white: 22, other: 3 },
                { region: "Alberta", white: 25, other: 3 },
                { region: "Quebec", white: 18, other: 2 },
                { region: "Nova Scotia", white: 20, other: 3 },
                { region: "Saskatchewan", white: 23, other: 4 },
                { region: "Manitoba", white: 21, other: 5 }
            ]
        },
        newzealand: {
            name: "New Zealand",
            national: { white: 50, other: 11 },
            regions: [
                { region: "Auckland", white: 40, other: 10 },
                { region: "Canterbury", white: 50, other: 12 },
                { region: "Otago", white: 55, other: 8 },
                { region: "Wellington", white: 45, other: 9 },
                { region: "Waikato", white: 48, other: 15 }
            ]
        },
        uk: {
            name: "United Kingdom",
            national: { white: 17.5, other: 1.5 },
            regions: [
                { region: "England (South East)", white: 22, other: 2 },
                { region: "England (overall)", white: 18, other: 2 },
                { region: "Scotland", white: 16, other: 1 },
                { region: "Wales", white: 17, other: 2 },
                { region: "Northern Ireland", white: 15, other: 1 }
            ]
        },
        usa: {
            name: "United States",
            national: { white: 21, other: 2.5 },
            regions: [
                { region: "Utah", white: 28, other: 3 },
                { region: "California", white: 22, other: 2 },
                { region: "Florida", white: 25, other: 4 },
                { region: "New York", white: 18, other: 1 },
                { region: "Texas", white: 20, other: 3 },
                { region: "Washington", white: 24, other: 2 },
                { region: "Hawaii", white: 15, other: 5 }
            ]
        }
    };

    // Initialize charts
    renderCountryComparison();
    renderRegionalChart('australia');
    
    // Add event listeners for country buttons
    document.querySelectorAll('.country-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            document.querySelectorAll('.country-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Render chart for selected country
            renderRegionalChart(this.getAttribute('data-country'));
        });
    });

    // Country Comparison Chart
    function renderCountryComparison() {
        const countries = Object.keys(data);
        const whiteRates = countries.map(country => data[country].national.white);
        const otherRates = countries.map(country => data[country].national.other);
        const countryNames = countries.map(country => data[country].name);

        const trace1 = {
            x: countryNames,
            y: whiteRates,
            name: 'White Population',
            type: 'bar',
            marker: {
                color: '#3b82f6'
            }
        };

        const trace2 = {
            x: countryNames,
            y: otherRates,
            name: 'Other Races/Ethnicities',
            type: 'bar',
            marker: {
                color: '#f59e0b'
            }
        };

        const layout = {
            barmode: 'group',
            xaxis: {
                title: 'Country'
            },
            yaxis: {
                title: 'Incidence Rate (per 100,000)'
            },
            legend: {
                orientation: 'h',
                x: 0,
                y: -0.2
            },
            margin: { t: 30 }
        };

        const config = {
            responsive: true,
            displayModeBar: true,
            displaylogo: false
        };

        Plotly.newPlot('countryComparison', [trace1, trace2], layout, config);
    }

    // Regional Chart
    function renderRegionalChart(country) {
        const countryData = data[country];
        const regions = countryData.regions.map(region => region.region);
        const whiteRates = countryData.regions.map(region => region.white);
        const otherRates = countryData.regions.map(region => region.other);

        const trace1 = {
            x: regions,
            y: whiteRates,
            name: 'White Population',
            type: 'bar',
            marker: {
                color: '#3b82f6'
            }
        };

        const trace2 = {
            x: regions,
            y: otherRates,
            name: 'Other Races/Ethnicities',
            type: 'bar',
            marker: {
                color: '#f59e0b'
            }
        };

        const layout = {
            barmode: 'group',
            title: `${countryData.name} - Regional Melanoma Incidence Rates`,
            xaxis: {
                title: 'Region',
                tickangle: -45
            },
            yaxis: {
                title: 'Incidence Rate (per 100,000)'
            },
            legend: {
                orientation: 'h',
                x: 0,
                y: -0.3
            },
            margin: { t: 50, b: 100 }
        };

        const config = {
            responsive: true,
            displayModeBar: true,
            displaylogo: false
        };

        Plotly.newPlot('regionalChart', [trace1, trace2], layout, config);
    }
});
