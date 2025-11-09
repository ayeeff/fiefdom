// Material Waves Dashboard JavaScript
(function() {
  'use strict';
  
  const countryFlags = {
    'China': '🇨🇳',
    'Brazil': '🇧🇷',
    'Chile': '🇨🇱'
  };
  
  const waves = [
    {
      id: 1,
      name: "Age of Conductors",
      era: "1945-1970",
      color: "#3b82f6",
      elements: [
        { symbol: "Si", year: 1947, name: "Silicon", use: "Transistors invented", refining: "Carbothermic reduction of quartz", solidWaste: 2.8, liquidEffluent: 0.02, gaseous: 4.5, country: "China", share: "~75%", notes: "Slag is Ca-SiO₂; dust contains crystalline silica" },
        { symbol: "Al", year: 1950, name: "Aluminium", use: "Jet aircraft frames", refining: "Bayer → Hall-Héroult", solidWaste: 2.2, liquidEffluent: 0.3, gaseous: 12.5, country: "China", share: "~60%", notes: "Red-mud 1.1 kg; effluent is Bayer liquor" },
        { symbol: "Cu", year: 1952, name: "Copper", use: "Electric motor windings", refining: "Concentrate → matte → electrorefining", solidWaste: 52, liquidEffluent: 0.4, gaseous: 3.8, country: "China", share: "~40%", notes: "Tailings dominate; acid-rock drainage risk" },
        { symbol: "Ni", year: 1958, name: "Nickel", use: "Jet engine turbine discs", refining: "Laterite HPAL → mixed sulfide → electrowinning", solidWaste: 58, liquidEffluent: 1.1, gaseous: 5.2, country: "China", share: "~35%", notes: "Laterite leach residue 55 kg; effluent Mn, NH₃" },
        { symbol: "Cr", year: 1962, name: "Chromium", use: "Stainless steel hulls", refining: "Ferro-chrome smelting (chromite + coke)", solidWaste: 3.5, liquidEffluent: 0.05, gaseous: 5.1, country: "China", share: "~55%", notes: "Slag Cr-rich; dust can contain Cr-VI" }
      ],
      physics: "Band-gap semiconductors & conductivity",
      icon: "⚙️"
    },
    {
      id: 2,
      name: "Age of Photons & Precision",
      era: "1970-2000",
      color: "#8b5cf6",
      elements: [
        { symbol: "Ga", year: 1972, name: "Gallium", use: "First GaAs LEDs", refining: "Bayer liquor side-stream → SX → electrolysis", solidWaste: 110, liquidEffluent: 0.8, gaseous: 13, country: "China", share: "~95%", notes: "Wastes allocated from Al refining; Ga 0.01% of Al" },
        { symbol: "Ge", year: 1975, name: "Germanium", use: "Fiber optic systems", refining: "Zn roaster fume → leach → SX → zone-refining", solidWaste: 45, liquidEffluent: 0.3, gaseous: 2.8, country: "China", share: "~70%", notes: "Residue is Zn leach cake; Ge 0.03% in Zn conc." },
        { symbol: "In", year: 1978, name: "Indium", use: "ITO touchscreens", refining: "Zn leach residue → acid leach → cementation → EW", solidWaste: 48, liquidEffluent: 0.4, gaseous: 3.0, country: "China", share: "~65%", notes: "Same upstream chain as Ge; In 0.01% in Zn conc." },
        { symbol: "Nb", year: 1982, name: "Niobium", use: "MRI superconducting magnets", refining: "Pyrochlore flotation → aluminothermic reduction", solidWaste: 28, liquidEffluent: 0.2, gaseous: 2.6, country: "Brazil", share: "~85%", notes: "Slag is Ca-Nb oxide; dust Nb₂O₅" },
        { symbol: "Ta", year: 1985, name: "Tantalum", use: "High-k dielectric capacitors", refining: "Coltan gravity → acid leach → SX → reduction", solidWaste: 120, liquidEffluent: 1.5, gaseous: 4.1, country: "China", share: "~55%", notes: "Tailings high U-Th; effluent contains F⁻" },
        { symbol: "Re", year: 1988, name: "Rhenium", use: "Jet engine single-crystal blades", refining: "By-product Cu-Mo roaster fume → IX", solidWaste: 1500, liquidEffluent: 0.6, gaseous: 6, country: "Chile", share: "~50%", notes: "Re 0.0003% in Mo conc.; huge mass allocated" },
        { symbol: "Zr", year: 1992, name: "Zirconium", use: "EUV photoresists", refining: "Zircon chlorination → reduction → purification", solidWaste: 4.2, liquidEffluent: 0.1, gaseous: 3.9, country: "China", share: "~70%", notes: "Silica residue 2.9 kg; effluent Cl⁻" },
        { symbol: "Sb", year: 1995, name: "Antimony", use: "Phase-change memory", refining: "Stibnite volatilization roasting → reduction", solidWaste: 6.5, liquidEffluent: 0.08, gaseous: 2.4, country: "China", share: ">80%", notes: "Slag Fe-Si-O; gas can carry As if present" },
        { symbol: "Sn", year: 1998, name: "Tin", use: "Lead-free solders", refining: "Cassiterite smelting in blast / electric furnace", solidWaste: 3.1, liquidEffluent: 0.06, gaseous: 2.7, country: "China", share: "~50%", notes: "Slag silicate; low tailings because ore ~60% SnO₂" }
      ],
      physics: "Quantum optics & superconductivity",
      icon: "💡"
    },
    {
      id: 3,
      name: "Age of Fields & Fluorescence",
      era: "2000-2025",
      color: "#ec4899",
      elements: [
        { symbol: "Nd", year: 2002, name: "Neodymium", use: "Permanent magnets for HDD", refining: "REE acid bake → SX → reduction", solidWaste: 75, liquidEffluent: 1.2, gaseous: 9.5, country: "China", share: "~90%", notes: "Tailings Th-U radionuclides; effluent SO₄²⁻" },
        { symbol: "Dy", year: 2005, name: "Dysprosium", use: "High-temp magnets", refining: "Same REE chain (ion-exchange)", solidWaste: 85, liquidEffluent: 1.3, gaseous: 10, country: "China", share: "~90%", notes: "Dy 4-7% of Nd-Dy mix; scaled by separation" },
        { symbol: "Tb", year: 2008, name: "Terbium", use: "Green phosphors", refining: "Same REE chain", solidWaste: 90, liquidEffluent: 1.3, gaseous: 10, country: "China", share: "~90%", notes: "Tb 1% of REE concentrate" },
        { symbol: "Eu", year: 2010, name: "Europium", use: "Red OLED emitters", refining: "Same REE chain", solidWaste: 92, liquidEffluent: 1.3, gaseous: 10, country: "China", share: "~90%", notes: "Eu 0.2% of REE concentrate; highest waste kg⁻¹" },
        { symbol: "Li", year: 2015, name: "Lithium", use: "Li-ion EV batteries", refining: "Brine evaporation → lime precipitation", solidWaste: 22, liquidEffluent: 0.9, gaseous: 3.8, country: "China", share: "50-70%", notes: "Tailings salt crust; effluent B, Mg" },
        { symbol: "Co", year: 2020, name: "Cobalt", use: "NMC cathodes", refining: "Cu-Co concentrate → matte → leach → EW", solidWaste: 65, liquidEffluent: 1.0, gaseous: 6.2, country: "China", share: "50-70%", notes: "Tailings 60 kg; effluent Co, Cu, Mn" }
      ],
      physics: "4f-shell magnetism & ionic storage",
      icon: "🧲"
    },
    {
      id: 4,
      name: "Age of Fire & Decay",
      era: "2025-2040",
      color: "#ef4444",
      elements: [
        { symbol: "Th", year: 2028, name: "Thorium", use: "Molten salt reactors", isNuclear: true },
        { symbol: "U", year: 2030, name: "Uranium", use: "SMR fuel", isNuclear: true },
        { symbol: "Pu", year: 2032, name: "Plutonium", use: "Fast breeder reactors", isNuclear: true },
        { symbol: "Am", year: 2035, name: "Americium", use: "RTG power sources", isNuclear: true },
        { symbol: "Cm", year: 2037, name: "Curium", use: "Alpha particle sources", isNuclear: true },
        { symbol: "Ac", year: 2039, name: "Actinium", use: "Targeted alpha therapy", isNuclear: true }
      ],
      physics: "Fission & decay energy",
      icon: "☢️",
      isNuclear: true
    }
  ];

  let hoveredElement = null;
  const mousePosition = { x: 0, y: 0 };

  function getPollutionIcon(value, thresholds) {
    if (value > thresholds.extreme) return { icon: '☠️', size: 24, color: '#dc2626' };
    if (value > thresholds.high) return { icon: '🏭', size: 20, color: '#ea580c' };
    if (value > thresholds.medium) return { icon: '💨', size: 16, color: '#f59e0b' };
    return { icon: '✓', size: 12, color: '#22c55e' };
  }

  function showTooltip(el) {
    hoveredElement = el;
    const tooltip = document.getElementById('wave-tooltip');
    tooltip.style.display = 'block';
    updateTooltipContent();
  }

  function hideTooltip() {
    hoveredElement = null;
    const tooltip = document.getElementById('wave-tooltip');
    tooltip.style.display = 'none';
  }

  function updateTooltipPosition(x, y) {
    mousePosition.x = x;
    mousePosition.y = y;
    const tooltip = document.getElementById('wave-tooltip');
    tooltip.style.left = `${x + 20}px`;
    tooltip.style.top = `${y + 20}px`;
  }

  function updateTooltipContent() {
    if (!hoveredElement) return;
    
    const tooltip = document.getElementById('wave-tooltip');
    tooltip.style.borderColor = hoveredElement.color;
    
    const solidWasteIcon = hoveredElement.solidWaste ?
      getPollutionIcon(hoveredElement.solidWaste, { extreme: 100, high: 50, medium: 20 }) : null;
    const liquidIcon = hoveredElement.liquidEffluent ?
      getPollutionIcon(hoveredElement.liquidEffluent, { extreme: 1.5, high: 1, medium: 0.5 }) : null;
    const gaseousIcon = hoveredElement.gaseous ?
      getPollutionIcon(hoveredElement.gaseous, { extreme: 10, high: 6, medium: 3 }) : null;

    let html = `
      <div class="wave-tooltip-header">
        <div class="wave-tooltip-icon" style="background-color: ${hoveredElement.color}">
          ${hoveredElement.symbol}
        </div>
        <div class="wave-tooltip-content">
          <div class="wave-tooltip-title-row">
            <h3 class="wave-tooltip-title">${hoveredElement.name}</h3>
            ${hoveredElement.country ? `<span class="wave-tooltip-flag">${countryFlags[hoveredElement.country]}</span>` : ''}
            ${hoveredElement.isNuclear ? '<span class="wave-tooltip-flag">☢️</span>' : ''}
          </div>
          <p class="wave-tooltip-meta">
            <span style="font-weight: 600;">${hoveredElement.wave}</span> • ${hoveredElement.year}
          </p>
          <p class="wave-tooltip-use">${hoveredElement.use}</p>
        </div>
      </div>
    `;

    if (hoveredElement.refining) {
      html += `
        <div class="wave-tooltip-section">
          <div class="wave-info-box" style="margin-bottom: 0.75rem;">
            <p class="wave-info-box-title">Refining Route</p>
            <p class="wave-info-box-text">${hoveredElement.refining}</p>
          </div>
          <div class="wave-info-box" style="margin-bottom: 0.75rem;">
            <p class="wave-info-box-title" style="margin-bottom: 0.5rem;">Refining Control</p>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.5rem;">${countryFlags[hoveredElement.country]}</span>
              <span style="color: #1e293b; font-weight: bold;">${hoveredElement.country}</span>
              <span style="margin-left: auto; color: #475569;">${hoveredElement.share}</span>
            </div>
          </div>
          <div class="wave-impact-box" style="margin-bottom: 0.75rem;">
            <p class="wave-impact-title">Environmental Impact (per kg refined)</p>
            <div class="wave-impact-row">
              <span style="font-size: ${solidWasteIcon?.size || 12}px; color: ${solidWasteIcon?.color}">
                ${solidWasteIcon?.icon || 'N/A'}
              </span>
              <span class="wave-impact-label">Solid waste:</span>
              <span class="wave-impact-value" style="color: ${solidWasteIcon?.color}">
                ${hoveredElement.solidWaste} kg
              </span>
            </div>
            <div class="wave-impact-row">
              <span style="font-size: ${liquidIcon?.size || 12}px; color: ${liquidIcon?.color}">
                ${liquidIcon?.icon || 'N/A'}
              </span>
              <span class="wave-impact-label">Liquid effluent:</span>
              <span class="wave-impact-value" style="color: ${liquidIcon?.color}">
                ${hoveredElement.liquidEffluent} kg
              </span>
            </div>
            <div class="wave-impact-row">
              <span style="font-size: ${gaseousIcon?.size || 12}px; color: ${gaseousIcon?.color}">
                ${gaseousIcon?.icon || 'N/A'}
              </span>
              <span class="wave-impact-label">Gaseous/particulate:</span>
              <span class="wave-impact-value" style="color: ${gaseousIcon?.color}">
                ${hoveredElement.gaseous} kg
              </span>
            </div>
          </div>
          <div class="wave-notes-box" style="margin-bottom: 0.75rem;">
            <p class="wave-notes-title">Contaminants & Notes</p>
            <p class="wave-notes-text">${hoveredElement.notes}</p>
          </div>
          <div class="wave-info-box" style="border-top: 1px solid #cbd5e1;">
            <p style="font-size: 0.75rem; font-weight: 600; color: #334155;">Physics</p>
            <p style="font-size: 0.75rem; color: #475569;">${hoveredElement.physics}</p>
          </div>
        </div>
      `;
    } else if (hoveredElement.isNuclear) {
      html += `
        <div class="wave-tooltip-section">
          <div class="wave-info-box">
            <p style="font-weight: 600; color: #b91c1c; margin-bottom: 0.5rem;">Nuclear Era Element</p>
            <p style="color: #475569;">High-risk refining; data projected for future applications. Extreme hazards: radiation, proliferation risks.</p>
            <p style="font-size: 0.75rem; color: #334155; margin-top: 0.5rem;">Physics: ${hoveredElement.physics}</p>
          </div>
        </div>
      `;
    }

    tooltip.innerHTML = html;
  }

  function initTimeline() {
    const allElements = waves.flatMap(wave =>
      wave.elements.map(el => ({
        ...el,
        wave: wave.name,
        waveId: wave.id,
        color: wave.color,
        icon: wave.icon,
        physics: wave.physics
      }))
    );

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '1300');
    svg.setAttribute('viewBox', '0 0 1400 1300');
    svg.style.backgroundColor = '#ffffff';

    const rowHeight = 120;
    const yearWidth = 120;
    const startX = 140;
    const baseYear = 1945;

    allElements.forEach((el, idx) => {
      const row = Math.floor((el.year - baseYear) / 10);
      const yearInRow = el.year - (baseYear + row * 10);
      const isReversed = row % 2 === 1;
      const x = startX + (isReversed ? (10 - yearInRow) * yearWidth : yearInRow * yearWidth);
      const y = row * rowHeight + 50;

      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('class', 'element-group');
      group.style.cursor = 'pointer';

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', '35');
      circle.setAttribute('fill', el.color);
      circle.setAttribute('stroke', 'white');
      circle.setAttribute('stroke-width', '4');
      circle.style.transition = 'all 0.3s';

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y + 8);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', 'white');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('font-size', '24');
      text.textContent = el.symbol;

      const yearText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      yearText.setAttribute('x', x);
      yearText.setAttribute('y', y - 45);
      yearText.setAttribute('text-anchor', 'middle');
      yearText.setAttribute('fill', '#64748b');
      yearText.setAttribute('font-size', '14');
      yearText.setAttribute('font-weight', 'bold');
      yearText.textContent = el.year;

      const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      nameText.setAttribute('x', x);
      nameText.setAttribute('y', y + 55);
      nameText.setAttribute('text-anchor', 'middle');
      nameText.setAttribute('fill', '#475569');
      nameText.setAttribute('font-size', '13');
      nameText.textContent = el.name;

      if (el.country) {
        const flagText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        flagText.setAttribute('x', x + 40);
        flagText.setAttribute('y', y - 30);
        flagText.setAttribute('text-anchor', 'middle');
        flagText.setAttribute('font-size', '32');
        flagText.textContent = countryFlags[el.country] || '🌍';
        group.appendChild(flagText);
      }

      if (el.isNuclear) {
        const nuclearIcon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        nuclearIcon.setAttribute('x', x - 40);
        nuclearIcon.setAttribute('y', y - 30);
        nuclearIcon.setAttribute('text-anchor', 'middle');
        nuclearIcon.setAttribute('font-size', '32');
        nuclearIcon.setAttribute('fill', '#ef4444');
        nuclearIcon.textContent = '☢️';
        group.appendChild(nuclearIcon);
      }

      group.addEventListener('mouseenter', (e) => {
        circle.setAttribute('r', '42');
        text.setAttribute('font-size', '26');
        showTooltip(el);
      });

      group.addEventListener('mousemove', (e) => {
        const rect = document.getElementById('wave-timeline-ref').getBoundingClientRect();
        updateTooltipPosition(e.clientX - rect.left, e.clientY - rect.top);
      });

      group.addEventListener('mouseleave', () => {
        circle.setAttribute('r', '35');
        text.setAttribute('font-size', '24');
        hideTooltip();
      });

      group.appendChild(circle);
      group.appendChild(text);
      group.appendChild(yearText);
      group.appendChild(nameText);
      svg.appendChild(group);
    });

    for (let row = 0; row <= 10; row++) {
      const y = row * rowHeight + 50;
     
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', startX);
      line.setAttribute('y1', y);
      line.setAttribute('x2', startX + 1200);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', '#cbd5e1');
      line.setAttribute('stroke-width', '2');
      line.setAttribute('stroke-dasharray', '5,5');
      svg.insertBefore(line, svg.firstChild);

      const wave = waves.find(w => {
        const waveStart = parseInt(w.era.split('-')[0]);
        const waveEnd = parseInt(w.era.split('-')[1]);
        const rowYear = baseYear + row * 10;
        return rowYear >= waveStart && rowYear < waveEnd;
      });

      if (wave) {
        const iconText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        iconText.setAttribute('x', '50');
        iconText.setAttribute('y', y + 10);
        iconText.setAttribute('text-anchor', 'middle');
        iconText.setAttribute('font-size', '36');
        iconText.textContent = wave.icon;
        svg.appendChild(iconText);
      }

      const decadeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      decadeText.setAttribute('x', row % 2 === 0 ? startX - 20 : startX + 1220);
      decadeText.setAttribute('y', y + 5);
      decadeText.setAttribute('text-anchor', row % 2 === 0 ? 'end' : 'start');
      decadeText.setAttribute('fill', '#94a3b8');
      decadeText.setAttribute('font-size', '12');
      decadeText.setAttribute('font-weight', 'bold');
      decadeText.textContent = `${baseYear + row * 10}s`;
      svg.appendChild(decadeText);
    }

    const timelineContainer = document.getElementById('wave-timeline-ref');
    timelineContainer.innerHTML = '';
    timelineContainer.appendChild(svg);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimeline);
  } else {
    initTimeline();
  }
})();
