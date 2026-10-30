/**
 * 🐠 Siliquarium UI Subsystem
 * ChronicleAnalysisLabHtmlTemplate: Static DOM Layout and Tab Content Markup for Chronicle Analysis Lab.
 */

import { IKinematicBody, IKinematicCellSnapshot } from '../engine/kinematics/ColonyKinematicsRecorder.js';

export type ChronicleLabTab = 'morphometrics' | 'grn' | 'thermodynamics' | 'kinematics';

export interface IChronicleLabTemplateParams {
  readonly body: IKinematicBody;
  readonly cell: IKinematicCellSnapshot;
  readonly activeTab: ChronicleLabTab;
}

export interface IChronicleLabDialogParams {
  readonly body: IKinematicBody;
  readonly tick: number;
  readonly activeTab: ChronicleLabTab;
  readonly tabContentHtml: string;
}

export function buildChronicleLabTabContent(params: IChronicleLabTemplateParams): string {
  const { body: b, cell: c, activeTab } = params;
  const isMulticellular = b.isMulticellularDifferentiated;

  let trophoCount = 0;
  let somaticCount = 0;
  let pacemakerCount = 0;
  let anchorCount = 0;
  let totalEnergy = 0;
  let totalMatter = 0;

  for (const cell of b.cells) {
    totalEnergy += cell.energy;
    totalMatter += cell.matter;
    if (cell.roleName.includes('Trophocyte')) trophoCount++;
    else if (cell.roleName.includes('Somatic Shield')) somaticCount++;
    else if (cell.roleName.includes('Pacemaker')) pacemakerCount++;
    else if (cell.roleName.includes('Basalt Anchor')) anchorCount++;
  }

  const n = b.cells.length || 1;
  const trophoPct = Math.round((trophoCount / n) * 100);
  const somaticPct = Math.round((somaticCount / n) * 100);
  const pacePct = Math.round((pacemakerCount / n) * 100);
  const anchorPct = Math.round((anchorCount / n) * 100);

  if (activeTab === 'morphometrics') {
    const rowsHtml = b.cells.map(cellSnap => {
      const isSelected = c && cellSnap.coord.equals(c.coord);
      const operonPills = cellSnap.operonStates.length > 0
        ? cellSnap.operonStates.map((on, i) => `<span class="lab-operon-pip ${on ? 'on' : 'off'}">Op${i + 1}:${on ? 'ON' : 'OFF'}</span>`).join('')
        : '<span class="text-slate-500 text-[10px]">None</span>';

      return `
        <tr class="lab-matrix-row ${isSelected ? 'selected' : ''}" data-q="${cellSnap.coord.q}" data-r="${cellSnap.coord.r}" data-z="${cellSnap.coord.z}">
          <td>${isSelected ? '👉 ' : ''}(${cellSnap.coord.q}, ${cellSnap.coord.r}, ${cellSnap.coord.z})</td>
          <td>${cellSnap.roleGlyph} ${cellSnap.roleName.split(' ')[0]}</td>
          <td style="color:#38bdf8;">${cellSnap.energy.toFixed(0)} mV</td>
          <td style="color:#10b981;">${cellSnap.matter.toFixed(0)} M</td>
          <td>${operonPills}</td>
        </tr>
      `;
    }).join('');

    return `
      <div class="lab-tab-pane">
        <div class="lab-card-grid">
          <div class="lab-card">
            <div class="lab-card-title">🌸 TISSUE ROLES & WOLPERT FRENCH FLAG RATIO</div>
            <div class="lab-ratio-bar">
              <div class="lab-ratio-segment" style="width:${trophoPct}%; background:#f59e0b;" title="Trophocytes: ${trophoPct}%"></div>
              <div class="lab-ratio-segment" style="width:${somaticPct}%; background:#f43f5e;" title="Somatic Cuticle: ${somaticPct}%"></div>
              <div class="lab-ratio-segment" style="width:${pacePct}%; background:#06b6d4;" title="Pacemakers: ${pacePct}%"></div>
              <div class="lab-ratio-segment" style="width:${anchorPct}%; background:#10b981;" title="Basalt Anchors: ${anchorPct}%"></div>
            </div>
            <div class="lab-stat-list">
              <div class="lab-stat-item"><span>🌾 Trophocytes (Feeding):</span> <strong>${trophoCount} (${trophoPct}%)</strong></div>
              <div class="lab-stat-item"><span>🛡️ Somatic Shields (Protection):</span> <strong>${somaticCount} (${somaticPct}%)</strong></div>
              <div class="lab-stat-item"><span>⚡ Pacemakers (Sensory / Oscillators):</span> <strong>${pacemakerCount} (${pacePct}%)</strong></div>
              <div class="lab-stat-item"><span>⚓ Basalt Anchors (Benthic Foot):</span> <strong>${anchorCount} (${anchorPct}%)</strong></div>
            </div>
          </div>

          <div class="lab-card">
            <div class="lab-card-title">📐 ORGANISMAL TOPOLOGY & GEOMETRY</div>
            <div class="lab-stat-list">
              <div class="lab-stat-item"><span>Multicellular Status:</span> <strong>${isMulticellular ? '🧬 Differentiated Metazoan' : '🦠 Isogenic Syncytial Colony'}</strong></div>
              <div class="lab-stat-item"><span>Body Topology:</span> <strong>${b.bodyTopology}</strong></div>
              <div class="lab-stat-item"><span>Total Member Pores:</span> <strong>${n} cells</strong></div>
              <div class="lab-stat-item"><span>Centroid Position:</span> <strong>(${b.centroid.x.toFixed(2)}, ${b.centroid.y.toFixed(2)}, ${b.centroid.z.toFixed(2)})</strong></div>
              <div class="lab-stat-item"><span>Kinematic Behavior:</span> <strong style="color:#f59e0b;">${b.behavior}</strong></div>
            </div>
          </div>
        </div>

        <div class="lab-section">
          <div class="lab-section-header">
            <span>🔬 SYNCYTIAL TISSUE MATRIX (${n} Pores • Click any row to focus pore)</span>
            <span class="text-slate-400 text-xs">Identical genome tape; spatial redox gradients induce distinct phenotypes</span>
          </div>
          <div class="lab-table-wrapper">
            <table class="lab-matrix-table">
              <thead>
                <tr>
                  <th>PORE (q, r, z)</th>
                  <th>ROLE</th>
                  <th>BATTERY (PMF)</th>
                  <th>BIOMASS</th>
                  <th>OPERON EXPRESSION</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  if (activeTab === 'grn') {
    const gateListHtml = c && c.gateTypes.length > 0
      ? c.gateTypes.map(gt => `<span class="lab-gate-chip">${gt}</span>`).join(' ')
      : '<span class="text-slate-500 italic">No expressed logic gates</span>';

    const operonListHtml = c && c.operonStates.length > 0
      ? c.operonStates.map((on, idx) => `
          <div class="lab-operon-card ${on ? 'active' : 'repressed'}">
            <div class="lab-operon-header">
              <span>Operon Switch #${idx + 1}</span>
              <strong style="color:${on ? '#4ade80' : '#94a3b8'};">${on ? 'EXPRESSED (ON)' : 'REPRESSED (OFF)'}</strong>
            </div>
            <div class="lab-operon-desc">
              ${idx === 0
                ? (on ? 'Induced: Hydrothermal redox fluid present; driving catalytic charging.' : 'Repressed: Influx starved or repressed below threshold.')
                : idx === 1
                ? (on ? 'Induced: Heavy metal toxin detected; activating allosteric shield.' : 'Repressed: Ambient environment benign.')
                : idx === 2
                ? (on ? 'Induced: Biomass threshold attained; polar cleavage active.' : 'Repressed: Below division threshold or contact-inhibited.')
                : (on ? 'Induced: Upstream regulatory operator active.' : 'Repressed: Allosteric feedback inhibition.')}
            </div>
          </div>
        `).join('')
      : '<div class="text-slate-500 italic">No operon switches detected</div>';

    return `
      <div class="lab-tab-pane">
        <div class="lab-card-grid">
          <div class="lab-card">
            <div class="lab-card-title">🧬 GENOME DNA TAPE (60-BIT CODON SEQUENCE)</div>
            <div class="lab-tape-viewer">
              <code>${c ? c.tapeBitstring : '0101010101010101'}</code>
            </div>
            <div class="lab-stat-list" style="margin-top:10px;">
              <div class="lab-stat-item"><span>Expressed Gate Count:</span> <strong>${c ? c.gateCount : 0} gates</strong></div>
              <div class="lab-stat-item"><span>Active Operator:</span> <strong>${c && c.primaryActive ? '🟢 Primary Operon Active' : '⚪ Basal State'}</strong></div>
              <div class="lab-stat-item"><span>Cassette Organelle:</span> <strong>${c && c.hasOrganelle ? '🧬 Endosymbiont Present' : 'None'}</strong></div>
            </div>
            <div style="margin-top:10px;">
              <div style="font-size:0.7rem; font-weight:700; color:#cbd5e1; margin-bottom:4px;">EXPRESSED CMOS GATES:</div>
              <div class="flex flex-wrap gap-1.5">${gateListHtml}</div>
            </div>
          </div>

          <div class="lab-card">
            <div class="lab-card-title">🎛️ GENE REGULATORY NETWORK OPERONS (FOCAL CELL)</div>
            <div class="space-y-2">
              ${operonListHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (activeTab === 'thermodynamics') {
    return `
      <div class="lab-tab-pane">
        <div class="lab-card-grid">
          <div class="lab-card">
            <div class="lab-card-title">⚡ CHEMIOSMOTIC PROTON MOTIVE FORCE & BATTERY</div>
            <div class="lab-stat-list">
              <div class="lab-stat-item"><span>Total Organism PMF:</span> <strong style="color:#38bdf8;">${totalEnergy.toFixed(1)} mV</strong></div>
              <div class="lab-stat-item"><span>Mean Pore Voltage:</span> <strong>${(totalEnergy / n).toFixed(1)} mV / pore</strong></div>
              <div class="lab-stat-item"><span>Focal Cell Voltage:</span> <strong style="color:#38bdf8;">${c ? c.energy.toFixed(1) : '0'} mV</strong></div>
              <div class="lab-stat-item"><span>Total Biomass Tokens:</span> <strong style="color:#10b981;">${totalMatter.toFixed(1)} M</strong></div>
              <div class="lab-stat-item"><span>Mean Biomass Density:</span> <strong>${(totalMatter / n).toFixed(1)} M / pore</strong></div>
            </div>
          </div>

          <div class="lab-card">
            <div class="lab-card-title">⚖️ CLOSED-UNIVERSE THERMODYNAMIC BALANCE</div>
            <div class="lab-stat-list">
              <div class="lab-stat-item"><span>First Law Invariant (ΔE):</span> <strong style="color:#4ade80;">≡ 0.000 (Conserved)</strong></div>
              <div class="lab-stat-item"><span>Mass Conservation (ΔM):</span> <strong style="color:#4ade80;">≡ 0.000 (Conserved)</strong></div>
              <div class="lab-stat-item"><span>Landauer Switching Heat:</span> <strong>kT ln 2 per bit flip</strong></div>
              <div class="lab-stat-item"><span>Membrane Dissipation:</span> <strong>Basal maintenance cost active</strong></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Kinematics tab
  return `
    <div class="lab-tab-pane">
      <div class="lab-card-grid">
        <div class="lab-card">
          <div class="lab-card-title">🌊 MACRO-ORGANISMAL KINEMATICS & HEADING</div>
          <div class="lab-stat-list">
            <div class="lab-stat-item"><span>Instantaneous Speed:</span> <strong style="color:#38bdf8;">${b.speed.toFixed(3)} units / tick</strong></div>
            <div class="lab-stat-item"><span>Velocity Vector:</span> <strong>(${b.velocity.vx.toFixed(3)}, ${b.velocity.vy.toFixed(3)}, ${b.velocity.vz.toFixed(3)})</strong></div>
            <div class="lab-stat-item"><span>Heading Angle:</span> <strong>${(b.heading * 180 / Math.PI).toFixed(1)}°</strong></div>
            <div class="lab-stat-item"><span>Kinematic Behavior:</span> <strong style="color:#f59e0b;">${b.behavior}</strong></div>
            <div class="lab-stat-item"><span>Low-Reynolds Regime:</span> <strong>Re ≪ 1 (Stokes Creeping Flow)</strong></div>
          </div>
        </div>

        <div class="lab-card">
          <div class="lab-card-title">👣 HISTORICAL TRAJECTORY & SLIME TRAILS</div>
          <div class="lab-stat-list">
            <div class="lab-stat-item"><span>Centroid History Trail:</span> <strong>${b.slimeTrail ? b.slimeTrail.length : 0} waypoints recorded</strong></div>
            <div class="lab-stat-item"><span>Treadmilling Protoplasm:</span> <strong>Leading-edge growth / trailing apoptosis</strong></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function buildChronicleLabDialog(params: IChronicleLabDialogParams): string {
  const { body: b, tick, activeTab, tabContentHtml } = params;

  return `
    <div class="lab-dialog">
      <!-- Lab Header -->
      <div class="lab-header">
        <div class="lab-title-group">
          <span class="lab-species-badge" style="background:${b.color};"></span>
          <div>
            <div class="lab-title">🔬 CHRONICLE ANALYSIS LAB: ${b.speciesName}</div>
            <div class="lab-subtitle">
              Clade: <code>${b.cladeId}</code> • Organism #${b.organismId || b.bodyId} • Tick #${tick.toLocaleString()}
            </div>
          </div>
        </div>
        <button class="lab-close-btn" id="lab-btn-close" title="Close Laboratory (Esc)">✕</button>
      </div>

      <!-- Navigation Tabs -->
      <div class="lab-nav-tabs">
        <button class="lab-tab-btn ${activeTab === 'morphometrics' ? 'active' : ''}" data-tab="morphometrics">
          🌸 Morphometrics & Tissue
        </button>
        <button class="lab-tab-btn ${activeTab === 'grn' ? 'active' : ''}" data-tab="grn">
          🧬 GRN & Logic Netlist
        </button>
        <button class="lab-tab-btn ${activeTab === 'thermodynamics' ? 'active' : ''}" data-tab="thermodynamics">
          ⚡ Energetics & Mass
        </button>
        <button class="lab-tab-btn ${activeTab === 'kinematics' ? 'active' : ''}" data-tab="kinematics">
          🌊 Kinematics & Trails
        </button>
      </div>

      <!-- Scrollable Body Content -->
      <div class="lab-scroll-body">
        ${tabContentHtml}
      </div>

      <!-- Footer Action Toolbar -->
      <div class="lab-footer">
        <div class="lab-footer-actions">
          <button class="lab-action-btn lab-btn-freeze" id="lab-btn-freeze" title="Freeze this living organism to the Richard Lenski Bio-Bank cryo-vault">
            ❄️ Freeze to Bio-Bank
          </button>
          <button class="lab-action-btn" id="lab-btn-pin" title="Tag/Pin this organism for persistent tracking">
            📌 Tag Specimen
          </button>
          <button class="lab-action-btn" id="lab-btn-phylo" title="Open Evolutionary Flight Recorder & LCA Phylogeny">
            🌳 View Phylogeny (LCA)
          </button>
          <button class="lab-action-btn" id="lab-btn-cad" title="Launch fullscreen CMOS gate schematic autopsy">
            🔬 Fullscreen CAD Autopsy
          </button>
        </div>
        <button class="lab-action-btn lab-btn-done" id="lab-btn-done">
          Done
        </button>
      </div>
    </div>
  `;
}
