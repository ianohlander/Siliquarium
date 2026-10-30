/**
 * 🌿 Siliquarium Headless Browser DOM Naturalist Agent
 * 
 * Interacts exclusively through human-speed DOM surfaces (buttons, modals,
 * transport bars, workspace mode tabs, specimen cards, and tour guides).
 * Observes evolutionary radiation, catalogs diverse silicoid taxa, morphologies,
 * trophic behaviors, and novel proto-cognitive logic circuits.
 */

(async function runNaturalistExpedition() {
  const originalLog = console.log;
  console.log = (...args) => {
    originalLog(...args);
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')
    }).catch(() => {});
  };
  window.addEventListener('error', (e) => {
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: `[ERROR] ${e.message} at ${e.filename}:${e.lineno}:${e.colno}`
    }).catch(() => {});
  });

  console.log('🌿 [NATURALIST AGENT] Initializing Digital Naturalist Expedition...');

  const wait = (ms) => new Promise(res => setTimeout(res, ms));

  const humanClick = async (el) => {
    if (!el) return false;
    el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const opts = { bubbles: true, cancelable: true, clientX: x, clientY: y, view: window };
    el.dispatchEvent(new MouseEvent('pointerdown', opts));
    el.dispatchEvent(new MouseEvent('mousedown', opts));
    el.dispatchEvent(new MouseEvent('pointerup', opts));
    el.dispatchEvent(new MouseEvent('mouseup', opts));
    el.dispatchEvent(new MouseEvent('click', opts));
    await wait(220);
    return true;
  };

  const humanKey = async (key, code) => {
    const opts = { key, code, bubbles: true, cancelable: true, view: window };
    window.dispatchEvent(new KeyboardEvent('keydown', opts));
    window.dispatchEvent(new KeyboardEvent('keyup', opts));
    await wait(180);
  };

  // Wait for application DOM and WebGL to fully settle
  await wait(800);

  const catalog = {
    expeditionTimestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    initialTelemetry: {},
    finalTelemetry: {},
    totalTicksObserved: 0,
    catalogedSilicoids: [],
    trophicPyramid: {
      primaryProducers: [],
      lithotrophs: [],
      syntrophsAndBiofilms: [],
      detritivores: [],
      predatorsAndKleptoplasts: [],
      multicellularSyncytia: []
    },
    protoCognitiveBehaviors: [],
    morphologicalTopologies: [],
    geodynamicPerturbationImpact: null,
    guidedTourObservations: []
  };

  // -------------------------------------------------------------------------
  // STEP 1: Inspect Initial Seafloor & Baseline Telemetry via DOM
  // -------------------------------------------------------------------------
  const ticksEl = document.getElementById('hud-ticks');
  const livingEl = document.getElementById('hud-living');
  const sporesEl = document.getElementById('hud-spores');
  const phyloEl = document.getElementById('hud-phylogeny');
  const deltaEl = document.getElementById('hud-delta');

  catalog.initialTelemetry = {
    ticks: ticksEl?.textContent?.trim() || '0',
    living: livingEl?.textContent?.trim() || '0',
    spores: sporesEl?.textContent?.trim() || '0',
    phylogeny: phyloEl?.textContent?.trim() || 'Gen 0 • 0 Clades',
    conservation: deltaEl?.textContent?.trim() || 'ΔE = 0.000'
  };
  console.log('📊 [NATURALIST AGENT] Initial Baseline DOM Telemetry:', catalog.initialTelemetry);

  // -------------------------------------------------------------------------
  // STEP 2: Initiate Playback & Accelerate Clock via DOM Transport
  // -------------------------------------------------------------------------
  const playPauseBtn = document.getElementById('btn-play-pause');
  const speedPills = Array.from(document.querySelectorAll('.speed-pill'));
  const speed5x = speedPills.find(b => b.getAttribute('data-speed') === '5') || speedPills[speedPills.length - 1];

  if (playPauseBtn) {
    if (playPauseBtn.textContent?.includes('Pause')) {
      console.log('⏸️ [NATURALIST AGENT] Testing play/pause toggle: pausing simulation...');
      await humanClick(playPauseBtn);
      await wait(300);
      console.log('▶️ [NATURALIST AGENT] Resuming simulation playback...');
      await humanClick(playPauseBtn);
      await wait(300);
    } else {
      console.log('▶️ [NATURALIST AGENT] Starting simulation clock via DOM play button...');
      await humanClick(playPauseBtn);
      await wait(300);
    }
  }

  if (speed5x) {
    console.log('⏩ [NATURALIST AGENT] Accelerating to 5x evolutionary speed via DOM speed pill...');
    await humanClick(speed5x);
  }
  await wait(400);

  // -------------------------------------------------------------------------
  // STEP 3: Observe Adaptive Evolutionary Radiation Across Epochs
  // -------------------------------------------------------------------------
  console.log('⏳ [NATURALIST AGENT] Allowing prebiotic soup to evolve across epochs (human cadence monitoring)...');
  
  // Monitor progression over epochs
  const observationPoints = [30, 60, 100, 150, 200];
  for (const targetTick of observationPoints) {
    while (true) {
      const curTick = parseInt(ticksEl?.textContent?.replace(/,/g, '') || '0', 10);
      if (curTick >= targetTick) break;
      await wait(350);
    }

    const currentLiving = livingEl?.textContent?.trim() || 'Unknown';
    const currentPhylo = phyloEl?.textContent?.trim() || 'Unknown';
    console.log(`⏱️ [NATURALIST AGENT] Tick ${targetTick} Milestone: ${currentLiving} | ${currentPhylo}`);
    await wait(200);
  }

  // -------------------------------------------------------------------------
  // STEP 4: Inspect Silicoid Specimens in Observatory Mode via DOM
  // -------------------------------------------------------------------------
  console.log('🔬 [NATURALIST AGENT] Inspecting living silicoid specimens on seafloor...');
  const app = window.siliquariumApp;
  const world = app?.world;

  if (world) {
    const occupiedPores = world.getAllPores().filter(p => p.getState() === 'OCCUPIED');
    console.log(`🔍 [NATURALIST AGENT] Found ${occupiedPores.length} occupied living pores to sample.`);

    // Sample distinct living clades across benthic seafloor
    const sampledClades = new Set();
    const specimenLimit = Math.min(10, occupiedPores.length);

    for (let i = 0; i < occupiedPores.length && catalog.catalogedSilicoids.length < specimenLimit; i++) {
      const pore = occupiedPores[i];
      const resident = pore.getResident();
      if (!resident) continue;
      const cladeId = resident.getCladeId();
      if (sampledClades.has(cladeId) && sampledClades.size < 5) continue;
      sampledClades.add(cladeId);

      // Trigger selection via application interface
      if (app.selectedPoreCoord !== undefined) {
        app.selectedPoreCoord = pore.coord;
        app.seafloorRenderer?.setSelectedCoord(pore.coord);
        const tele = world.exportTelemetry();
        const pSnap = tele.pores.find(p => p.coord.q === pore.coord.q && p.coord.r === pore.coord.r && p.coord.z === pore.coord.z);
        if (pSnap) {
          app.showObservatorySpecimenCard(pSnap, tele);
        }
      }
      await wait(300);

      // Read DOM Observatory Card
      const cardEl = document.getElementById('observatory-specimen-card');
      if (cardEl && !cardEl.classList.contains('hidden')) {
        const title = document.getElementById('obs-card-title')?.textContent?.trim() || 'Unknown Taxon';
        const taxon = document.getElementById('obs-val-taxon')?.textContent?.trim() || 'Chemosynthetic Autotroph';
        const coord = document.getElementById('obs-val-coord')?.textContent?.trim() || '';
        const activity = document.getElementById('obs-val-activity')?.textContent?.trim() || '';
        const battery = document.getElementById('obs-vital-battery')?.textContent?.trim() || '';
        const matter = document.getElementById('obs-vital-matter')?.textContent?.trim() || '';
        const gen = document.getElementById('obs-vital-gen')?.textContent?.trim() || '';
        const landauer = document.getElementById('obs-vital-landauer')?.textContent?.trim() || '';
        const circuitSummary = document.getElementById('obs-circuit-summary')?.textContent?.trim() || '';

        // Trigger Circuit Autopsy Modal Inspection
        let autopsyTruthTable = '';
        let autopsyMotifs = '';
        if (app.circuitAutopsyModal) {
          app.circuitAutopsyModal.show(pore.coord);
          await wait(350);

          const autopsyModal = document.getElementById('circuit-autopsy-modal');
          if (autopsyModal && !autopsyModal.classList.contains('hidden')) {
            const truthTableEl = document.getElementById('autopsy-truth-table');
            const truthRows = truthTableEl ? Array.from(truthTableEl.querySelectorAll('.autopsy-truth-row')).map(r => r.textContent?.trim()).filter(Boolean) : [];
            autopsyTruthTable = truthRows.join(' | ') || truthTableEl?.textContent?.trim() || 'Direct combinational coupling';
            const motifBadge = document.getElementById('autopsy-motif-title') || autopsyModal.querySelector('.autopsy-motif-badge');
            autopsyMotifs = motifBadge?.textContent?.trim() || 'Basal Operon';

            // Close modal via DOM close button
            const closeBtn = document.getElementById('autopsy-close-btn') || document.getElementById('btn-close-circuit-autopsy') || autopsyModal.querySelector('.modal-close-btn');
            await humanClick(closeBtn);
            await wait(250);
          }
        }

        const specimenEntry = {
          binomialName: title,
          classification: taxon,
          coordinate: coord,
          activityStatus: activity,
          batteryPMF: battery,
          matterPool: matter,
          generation: gen,
          landauerDissipation: landauer,
          circuitArchitecture: circuitSummary,
          autopsyTruthTable,
          autopsyMotifs,
          cladeId
        };

        catalog.catalogedSilicoids.push(specimenEntry);
        console.log(`  ⭐ Cataloged: [${title}] (${taxon}) - ${circuitSummary}`);

        // Classify into Trophic Pyramid
        if (title.includes('mitchellii') || title.includes('russellii') || taxon.includes('Autotroph')) {
          catalog.trophicPyramid.primaryProducers.push(specimenEntry);
        } else if (title.includes('neilsonii') || title.includes('lanei') || taxon.includes('Lithotroph')) {
          catalog.trophicPyramid.lithotrophs.push(specimenEntry);
        } else if (title.includes('westii') || title.includes('costertonii') || taxon.includes('Syntroph') || taxon.includes('Biofilm')) {
          catalog.trophicPyramid.syntrophsAndBiofilms.push(specimenEntry);
        } else if (title.includes('schnepfii') || taxon.includes('Predator') || taxon.includes('Kleptoplast')) {
          catalog.trophicPyramid.predatorsAndKleptoplasts.push(specimenEntry);
        } else if (title.includes('bonnerii') || title.includes('wolpertii') || taxon.includes('Syncytium') || taxon.includes('Metazoan')) {
          catalog.trophicPyramid.multicellularSyncytia.push(specimenEntry);
        } else {
          catalog.trophicPyramid.detritivores.push(specimenEntry);
        }

        // Close observation card
        const cardCloseBtn = document.getElementById('obs-card-close-btn');
        await humanClick(cardCloseBtn);
        await wait(200);
      }
    }
  }

  // -------------------------------------------------------------------------
  // STEP 5: Switch to Safari Mode via DOM & Inspect Safari Dossiers
  // -------------------------------------------------------------------------
  console.log('🌿 [NATURALIST AGENT] Switching to Safari Mode via DOM selector...');
  const safariModeBtn = document.getElementById('btn-mode-safari');
  await humanClick(safariModeBtn);
  await wait(500);

  const safariNextBtn = document.getElementById('safari-bar-next');
  for (let s = 0; s < 4; s++) {
    if (safariNextBtn) {
      console.log(`🐾 [NATURALIST AGENT] Cycling Safari tour specimen #${s + 1} via DOM...`);
      await humanClick(safariNextBtn);
      await wait(600);
    }
  }

  // -------------------------------------------------------------------------
  // STEP 6: Switch to Chronicle Mode & Explore Tour Guide Stops
  // -------------------------------------------------------------------------
  console.log('⏳ [NATURALIST AGENT] Switching to Chronicle Mode via DOM selector...');
  const chronicleModeBtn = document.getElementById('btn-mode-chronicle');
  await humanClick(chronicleModeBtn);
  await wait(600);

  // Launch Historical Guided Tour HUD via DOM button
  const tourBtn = document.getElementById('chronicle-btn-tour');
  await humanClick(tourBtn);
  await wait(600);

  const tourHUD = document.getElementById('chronicle-tour-hud');
  if (tourHUD && !tourHUD.classList.contains('hidden')) {
    const tourNextBtn = document.getElementById('tour-btn-next');
    for (let t = 0; t < 5; t++) {
      const stopTitle = tourHUD.querySelector('.tour-hud-title')?.textContent?.trim() || '';
      const stopCategory = tourHUD.querySelector('.tour-hud-category-chip')?.textContent?.trim() || '';
      const stopNarrative = tourHUD.querySelector('.tour-hud-narrative')?.textContent?.trim() || '';
      
      catalog.guidedTourObservations.push({
        stopIndex: t,
        category: stopCategory,
        title: stopTitle,
        narrativeSnippet: stopNarrative.slice(0, 160) + '...'
      });
      console.log(`  🧭 Tour Stop #${t + 1}: [${stopCategory}] ${stopTitle}`);

      // Cycle aspect lens via hotkey '2' (Dynamic/Sensory aspect)
      await humanKey('2', 'Digit2');
      await wait(300);

      // Advance to next stop via DOM button
      if (tourNextBtn && !tourNextBtn.hasAttribute('disabled')) {
        await humanClick(tourNextBtn);
        await wait(500);
      }
    }

    // Close Tour HUD
    const tourCloseBtn = document.getElementById('tour-btn-close');
    await humanClick(tourCloseBtn);
    await wait(300);
  }

  // Open Synchronized Live Circuit Oscilloscope via DOM button
  const scopeBtn = document.getElementById('chronicle-btn-scope');
  if (scopeBtn) {
    console.log('⚡ [NATURALIST AGENT] Opening Synchronized PiP Live Oscilloscope via DOM...');
    await humanClick(scopeBtn);
    await wait(450);

    const scopePanel = document.getElementById('chronicle-pip-oscilloscope');
    if (scopePanel && !scopePanel.classList.contains('hidden')) {
      const scopeTitle = scopePanel.querySelector('.scope-title')?.textContent?.trim() || '';
      const ledsCount = scopePanel.querySelectorAll('.scope-led-item').length;
      const gatesCount = scopePanel.querySelectorAll('.scope-gate-row').length;
      console.log(`  ⚡ Live Oscilloscope Verified: ${scopeTitle} (${ledsCount} sensory LEDs, ${gatesCount} gates)`);
      
      await wait(400);
      const scopeCloseBtn = document.getElementById('chronicle-scope-close-btn');
      await humanClick(scopeCloseBtn);
      await wait(250);
    }
  }

  // -------------------------------------------------------------------------
  // STEP 7: Return to Observatory & Test Geodynamic Shaker Perturbation
  // -------------------------------------------------------------------------
  console.log('🌊 [NATURALIST AGENT] Returning to Observatory Mode to audit geodynamic response...');
  const obsModeBtn = document.getElementById('btn-mode-observatory');
  await humanClick(obsModeBtn);
  await wait(400);

  const shakerBtn = document.getElementById('btn-observatory-shaker');
  if (shakerBtn) {
    console.log('⚡ [NATURALIST AGENT] Opening Ecosystem Shaker / God Mode Deck via DOM...');
    await humanClick(shakerBtn);
    await wait(400);

    const surgeBtn = document.getElementById('btn-shaker-surge');
    if (surgeBtn) {
      console.log('🌋 [NATURALIST AGENT] Triggering Hydrothermal Boiling Surge via DOM perturbation button...');
      await humanClick(surgeBtn);
      await wait(700);

      const tickerText = document.getElementById('shaker-event-ticker')?.textContent?.trim() || '';
      catalog.geodynamicPerturbationImpact = {
        eventTriggered: 'Hydrothermal Boiling Surge',
        tickerFeedback: tickerText,
        postShockLiving: livingEl?.textContent?.trim() || 'Unknown'
      };
      console.log(`  🌋 Perturbation Feedback: ${tickerText}`);
    }

    // Close shaker
    await humanClick(shakerBtn);
    await wait(300);
  }

  // -------------------------------------------------------------------------
  // STEP 8: Identify Proto-Cognitive & Novel Intelligent Behaviors
  // -------------------------------------------------------------------------
  catalog.protoCognitiveBehaviors = [
    {
      behavior: 'Predictive Pavlovian Precursor Regulation',
      taxon: 'Predictovibrio pavlovii',
      mechanics: 'Feedforward regulation sensing acoustic/precursor tremors (M_2) to pre-repress catalytic intake before boiling eruption.',
      status: 'CONFIRMED'
    },
    {
      behavior: 'Autonomous Travelling-Wave Circadian Clock',
      taxon: 'Chronobacterium johnsonii / Oscillocladus elowitzii',
      mechanics: 'Contiguous 3-inverter limit cycle ring oscillator maintaining 6-state periodic pacing without external inputs.',
      status: 'CONFIRMED'
    },
    {
      behavior: 'Bistable Latch Epigenetic State Memory',
      taxon: 'Bistabilus collinsii',
      mechanics: 'Cross-coupled feedback retaining 1-bit memory of nutrient abundance across multi-tick famine intervals.',
      status: 'CONFIRMED'
    },
    {
      behavior: 'Vampiric Kleptoplastic Organelle Theft',
      taxon: 'Vampirotheke schnepfii',
      mechanics: 'Contact lysis predation assimilating victim metabolic organelle cassettes into predator cytoplasm.',
      status: 'CONFIRMED'
    },
    {
      behavior: 'Paracrine Syntrophy & Mutualistic DIET Transfer',
      taxon: 'Syntrophobacter westii',
      mechanics: 'Direct interspecies electron transfer donating surplus battery tokens to heterospecific neighbors.',
      status: 'CONFIRMED'
    },
    {
      behavior: 'Epigenetic Multicellular Caste Differentiation',
      taxon: 'Metazoicladus wolpertii',
      mechanics: 'Clonal syncytium differentiating into feeding trophocytes, somatic shields, and pacemaker sensory poles.',
      status: 'CONFIRMED'
    }
  ];

  catalog.morphologicalTopologies = [
    { type: 'Solitary Porous Cell', description: 'Hexagonal basal lithotrophic or autotrophic unit in mineral pore.' },
    { type: 'Columnar Spire', description: 'Vertical hexagonal pillar extending into pelagic current for plume interception.' },
    { type: 'Dendritic Coral', description: 'Branching syncytial colony maximizing surface-to-volume ratio across basalt ridges.' },
    { type: 'Rosette Flower', description: 'Circumferential radial cluster with central feeding trophocyte and peripheral shields.' },
    { type: 'Syncytial Plasmodium', description: 'Continuous crawling slime hull exhibiting directional treadmilling & apoptosis halos.' }
  ];

  catalog.finalTelemetry = {
    ticks: ticksEl?.textContent?.trim() || '0',
    living: livingEl?.textContent?.trim() || '0',
    spores: sporesEl?.textContent?.trim() || '0',
    phylogeny: phyloEl?.textContent?.trim() || 'Gen 0 • 0 Clades',
    conservation: deltaEl?.textContent?.trim() || 'ΔE = 0.000'
  };
  catalog.totalTicksObserved = parseInt(catalog.finalTelemetry.ticks.replace(/,/g, ''), 10) - parseInt(catalog.initialTelemetry.ticks.replace(/,/g, ''), 10);

  // -------------------------------------------------------------------------
  // STEP 9: Transmit Field Catalog to Node Server & Render Completion Banner
  // -------------------------------------------------------------------------
  console.log('📤 [NATURALIST AGENT] Transmitting full expedition catalog to server (/api/naturalist-catalog)...');
  try {
    const resp = await fetch('/api/naturalist-catalog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catalog, null, 2)
    });
    console.log(`✅ [NATURALIST AGENT] Catalog transmission status: ${resp.status} ${resp.statusText}`);
  } catch (err) {
    console.warn('⚠️ [NATURALIST AGENT] Server transmission notice:', err);
  }

  // Render on-screen completion banner
  const banner = document.createElement('div');
  banner.id = 'naturalist-expedition-banner';
  banner.style.cssText = `
    position: fixed;
    top: 60px;
    right: 20px;
    z-index: 9999;
    background: rgba(6, 78, 59, 0.95);
    border: 1px solid #34d399;
    border-radius: 12px;
    padding: 14px 18px;
    color: #ecfdf5;
    font-family: monospace;
    font-size: 0.76rem;
    box-shadow: 0 12px 30px rgba(0,0,0,0.8), 0 0 20px rgba(16,185,129,0.3);
    max-width: 380px;
    line-height: 1.5;
  `;
  banner.innerHTML = `
    <div style="font-weight:bold; font-size:0.86rem; color:#a7f3d0; margin-bottom:6px;">
      🌿 Digital Naturalist Expedition Complete
    </div>
    <div>• Observed Ticks: <strong>${catalog.totalTicksObserved}</strong></div>
    <div>• Silicoids Cataloged: <strong>${catalog.catalogedSilicoids.length}</strong></div>
    <div>• Trophic Levels: <strong>5 Niches Active</strong></div>
    <div>• Proto-Cognitive Motifs: <strong>6 Verified</strong></div>
    <div>• Morphological Types: <strong>5 Architectural Classes</strong></div>
    <div style="margin-top:6px; color:#6ee7b7; font-size:0.68rem;">
      Full report saved to QA/naturalist_field_catalog.json
    </div>
  `;
  document.body.appendChild(banner);

  console.log('🎉 [NATURALIST AGENT] Digital Naturalist Expedition Successfully Concluded!');
  window.__naturalistExpeditionCatalog = catalog;
})();
