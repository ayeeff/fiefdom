// === PLOTLY CHART SETUP ===

// Sample data for demonstration
const countryData = {
  x: ["Australia", "Canada", "New Zealand", "UK", "USA"],
  y: [55, 18, 50, 25, 28],
  name: "White population",
  type: "bar",
  marker: { color: "#3b82f6" }
};

const otherData = {
  x: ["Australia", "Canada", "New Zealand", "UK", "USA"],
  y: [8, 6, 7, 5, 4],
  name: "Other races/ethnicities",
  type: "bar",
  marker: { color: "#f59e0b" }
};

const layoutCountry = {
  title: "",
  barmode: "group",
  legend: {
    orientation: "v",
    x: 1.1,
    y: 0.5,
    xanchor: "left",
    yanchor: "middle"
  },
  margin: { r: 150 },
  plot_bgcolor: "#fff",
  paper_bgcolor: "#fff"
};

// Render country comparison chart
Plotly.newPlot("countryComparison", [countryData, otherData], layoutCountry, { responsive: true });

// === REGIONAL CHART EXAMPLE ===
function drawRegionalChart(country) {
  const regions = {
    australia: ["NSW", "VIC", "QLD", "WA", "SA"],
    canada: ["BC", "ON", "QC", "AB", "NS"],
    newzealand: ["North Island", "South Island"],
    uk: ["England", "Scotland", "Wales", "N. Ireland"],
    usa: ["CA", "TX", "FL", "NY", "IL"]
  };

  const whiteRates = regions[country].map(() => Math.floor(Math.random() * 40) + 10);
  const otherRates = regions[country].map(() => Math.floor(Math.random() * 10) + 2);

  const traceWhite = {
    x: regions[country],
    y: whiteRates,
    type: "bar",
    name: "White population",
    marker: { color: "#3b82f6" }
  };

  const traceOther = {
    x: regions[country],
    y: otherRates,
    type: "bar",
    name: "Other races/ethnicities",
    marker: { color: "#f59e0b" }
  };

  const layoutRegional = {
    title: "",
    barmode: "group",
    legend: {
      orientation: "v",
      x: 1.1,
      y: 0.5,
      xanchor: "left",
      yanchor: "middle"
    },
    margin: { r: 150 },
    plot_bgcolor: "#fff",
    paper_bgcolor: "#fff"
  };

  Plotly.newPlot("regionalChart", [traceWhite, traceOther], layoutRegional, { responsive: true });
}

// Default render
drawRegionalChart("australia");

// === COUNTRY BUTTON INTERACTIVITY ===
document.querySelectorAll(".country-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".country-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const country = btn.getAttribute("data-country");
    drawRegionalChart(country);
  });
});
