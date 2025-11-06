/* Skin Cancer Dashboard Styles */
.skin-cancer-dashboard {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    color: #333;
    background-color: #f8fafc;
}

.dashboard-header {
    text-align: center;
    margin-bottom: 30px;
    padding: 20px;
    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
    color: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dashboard-header h1 {
    margin: 0 0 10px 0;
    font-size: 2.2rem;
}

.dashboard-header p {
    margin: 0;
    font-size: 1.1rem;
    opacity: 0.9;
}

.key-insights {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.insight-card {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    text-align: center;
    transition: transform 0.3s ease;
}

.insight-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.insight-card i {
    font-size: 2rem;
    color: #3b82f6;
    margin-bottom: 15px;
}

.insight-card h3 {
    margin: 0 0 10px 0;
    color: #1e40af;
}

.insight-card p {
    margin: 0;
    color: #64748b;
}

.chart-container {
    background: white;
    border-radius: 10px;
    padding: 25px;
    margin-bottom: 30px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chart-header {
    margin-bottom: 20px;
    text-align: center;
}

.chart-header h2 {
    margin: 0 0 5px 0;
    color: #1e40af;
}

.chart-header p {
    margin: 0;
    color: #64748b;
}

.chart {
    height: 400px;
    width: 100%;
}

.country-selector {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
}

.country-btn {
    padding: 10px 20px;
    background-color: #e2e8f0;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
}

.country-btn:hover {
    background-color: #cbd5e1;
}

.country-btn.active {
    background-color: #3b82f6;
    color: white;
}

.data-source {
    text-align: center;
    padding: 15px;
    background-color: #e2e8f0;
    border-radius: 10px;
    font-size: 0.9rem;
    color: #64748b;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .skin-cancer-dashboard {
        padding: 10px;
    }
    
    .dashboard-header h1 {
        font-size: 1.8rem;
    }
    
    .key-insights {
        grid-template-columns: 1fr;
    }
    
    .country-selector {
        flex-direction: column;
        align-items: center;
    }
    
    .country-btn {
        width: 200px;
    }
    
    .chart {
        height: 300px;
    }
}
