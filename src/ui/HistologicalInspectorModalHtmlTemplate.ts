/**
 * 🐠 Siliquarium UI Subsystem
 * HistologicalInspectorModalHtmlTemplate: Static DOM Layout and Diagnostic HTML Generator.
 */

import { IKinematicBody, IKinematicCellSnapshot } from '../engine/kinematics/ColonyKinematicsRecorder.js';

export interface IHistologicalModalTemplateParams {
  readonly body: IKinematicBody;
  readonly cell: IKinematicCellSnapshot;
  readonly tick: number;
}

export function buildHistologicalModalMarkup(params: IHistologicalModalTemplateParams): string {
  const { body: b, cell: c, tick } = params;
  const isMulticellular = b.isMulticellularDifferentiated;

  // Role badge decoration
  let roleBadgeColor = '#06b6d4';
  let roleDesc = 'Undifferentiated progenitor cell performing generic metabolic functions.';
  if (c.roleName.includes('Trophocyte')) {
    roleBadgeColor = '#f59e0b';
    roleDesc = '🌾 Trophocyte (Feeding / Leading Edge): Concentrates redox ingestion and nutrient uptake along leading chemotactic front.';
  } else if (c.roleName.includes('Somatic Shield')) {
    roleBadgeColor = '#38bdf8';
    roleDesc = '🛡️ Somatic Shield (Trailing Cuticle): Thickened mineralized wall protecting interior syncytium from thermal plumes and predatory cleavage.';
  } else if (c.roleName.includes('Pacemaker')) {
    roleBadgeColor = '#ec4899';
    roleDesc = '⚡ Pacemaker (Sensor Pole): Rapidly oscillates internal gates to synchronize collective syncytial depolarization and directional cleavage.';
  } else if (c.roleName.includes('Basalt Anchor')) {
    roleBadgeColor = '#10b981';
    roleDesc = '⚓ Basalt Anchor (Benthic Foot): Anchors organism to rocky substrate; resists hydrodynamic wash and initiates rear-edge treadmilling resorption.';
  }

  const getOperonExplanation = (idx: number, active: boolean): string => {
    if (idx === 0) {
      return active
        ? 'Induced: Hydrothermal redox fluid present; driving chemiosmotic catalytic charging.'
        : 'Repressed: Influx starved or repressed below activation threshold.';
    } else if (idx === 1) {
      return active
        ? 'Induced: Environmental stress/toxin plume detected; activating allosteric shield.'
        : 'Repressed: Ambient environment benign; toxin defense uninduced.';
    } else if (idx === 2) {
      return active
        ? 'Induced: Biomass threshold attained; somatic septation / polar cleavage active.'
        : 'Repressed: Biomass below division threshold or contact-inhibited.';
    }
    return active ? 'Induced: Upstream regulatory operator active.' : 'Repressed: Upstream allosteric feedback inhibition.';
  };

  const operonStatesHtml = c.operonStates.length > 0
    ? c.operonStates.map((active, idx) => `
        <div class="hist-operon-chip ${active ? 'active' : 'repressed'}" style="margin-bottom:6px; padding:6px 10px; border-radius:6px; background:${active ? 'rgba(34,197,94,0.12)' : 'rgba(30,27,75,0.4)'}; border:1px solid ${active ? '#22c55e' : '#334155'};">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:600; font-size:0.75rem; color:#e2e8f0;">Operon #${idx + 1}:</span>
            <strong style="font-size:0.75rem; color:${active ? '#4ade80' : '#94a3b8'};">${active ? 'EXPRESSED (ON)' : 'REPRESSED (OFF)'}</strong>
          </div>
          <div style="font-size:0.68rem; color:#94a3b8; margin-top:2px; line-height:1.2;">
            ${getOperonExplanation(idx, active)}
          </div>
        </div>
      `).join('')
    : '<div style="color:#64748b;font-style:italic;">No active operon switches detected in this genome.</div>';

  const gateTypesHtml = c.gateTypes.length > 0
    ? c.gateTypes.map(gt => `<span class="hist-gate-badge">${gt}</span>`).join(' ')
    : '<span style="color:#64748b;font-style:italic;">No logic gates expressed</span>';

  let syncytialMatrixHtml = '';
  if (b.cells.length > 1) {
    const rowsHtml = b.cells.map(cellSnap => {
      const isCurrent = cellSnap.coord.equals(c.coord);
      const operonBadges = cellSnap.operonStates.length > 0
        ? cellSnap.operonStates.map((on, i) => `<span style="display:inline-block; padding:1px 4px; font-size:0.65rem; border-radius:3px; margin-right:2px; background:${on ? '#15803d' : '#334155'}; color:${on ? '#86efac' : '#94a3b8'};">Op${i+1}:${on ? 'ON' : 'OFF'}</span>`).join('')
        : '<span style="color:#64748b; font-size:0.65rem;">None</span>';

      return `
        <tr style="background:${isCurrent ? 'rgba(56,189,248,0.12)' : 'transparent'}; border-bottom:1px solid #1e293b; cursor:pointer;" class="hist-matrix-row" data-q="${cellSnap.coord.q}" data-r="${cellSnap.coord.r}" data-z="${cellSnap.coord.z}">
          <td style="padding:4px 6px; font-family:monospace; font-size:0.72rem; color:#e2e8f0;">
            ${isCurrent ? '👉 ' : ''}(${cellSnap.coord.q},${cellSnap.coord.r},${cellSnap.coord.z})
          </td>
          <td style="padding:4px 6px; font-size:0.72rem; color:#f1f5f9;">
            ${cellSnap.roleGlyph} ${cellSnap.roleName.split(' ')[0]}
          </td>
          <td style="padding:4px 6px; font-size:0.72rem; color:#38bdf8;">
            ${cellSnap.energy.toFixed(0)} mV
          </td>
          <td style="padding:4px 6px; font-size:0.72rem; color:#10b981;">
            ${cellSnap.matter.toFixed(0)} M
          </td>
          <td style="padding:4px 6px;">
            ${operonBadges}
          </td>
        </tr>
      `;
    }).join('');

    syncytialMatrixHtml = `
      <div class="hist-syncytial-matrix-section" style="margin-top:12px; padding:10px; background:rgba(15,23,42,0.6); border:1px solid #334155; border-radius:8px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <div style="font-size:0.75rem; font-weight:700; letter-spacing:0.05em; color:#38bdf8;">
            🔬 SYNCYTIAL TISSUE MATRIX (${b.cells.length} Pores • Wolpert French Flag Differentiation)
          </div>
          <div style="font-size:0.68rem; color:#94a3b8;">
            Isogenic clones sharing identical DNA express diverse roles across gradients
          </div>
        </div>
        <table style="width:100%; border-collapse:collapse; text-align:left;">
          <thead>
            <tr style="border-bottom:1px solid #475569; font-size:0.68rem; color:#94a3b8;">
              <th style="padding:4px 6px;">PORE</th>
              <th style="padding:4px 6px;">ROLE</th>
              <th style="padding:4px 6px;">BATTERY</th>
              <th style="padding:4px 6px;">BIOMASS</th>
              <th style="padding:4px 6px;">OPERON EXPRESSION</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }

  return `
    <div class="hist-modal-dialog">
      <!-- Header -->
      <div class="hist-header">
        <div class="hist-title-group">
          <span class="hist-species-color-pip" style="background-color: ${b.color};"></span>
          <div>
            <div class="hist-title">${b.speciesName}</div>
            <div class="hist-subtitle">Clade: <code>${b.cladeId}</code> • Tick #${tick.toLocaleString()}</div>
          </div>
        </div>
        <button class="hist-close-btn" id="hist-close-btn" title="Close Autopsy (Esc)">✕</button>
      </div>

      <!-- Body & Morphology Overview Banner -->
      <div class="hist-banner">
        <div class="hist-role-pill" style="border-color:${roleBadgeColor}; color:${roleBadgeColor}; background:rgba(${parseInt(roleBadgeColor.slice(1,3),16)},${parseInt(roleBadgeColor.slice(3,5),16)},${parseInt(roleBadgeColor.slice(5,7),16)},0.12);">
          ${c.roleGlyph} ${c.roleName}
        </div>
        <div class="hist-topo-pill">
          ${isMulticellular ? '🧬 Differentiated Multicellular' : '🦠 Undifferentiated Syncytial Colony'} • ${b.bodyTopology}
        </div>
        <div class="hist-coord-pill">
          Pore (${c.coord.q}, ${c.coord.r}, ${c.coord.z})
        </div>
      </div>

      <div class="hist-role-explanation">
        ${roleDesc}
      </div>

      <!-- 3-Column Diagnostic Grid -->
      <div class="hist-grid">
        <!-- Col 1: Cellular Biophysics & Energetics -->
        <div class="hist-card">
          <div class="hist-card-title">⚡ BIOPHYSICAL TELEMETRY</div>
          <div class="hist-stat-row">
            <span class="hist-stat-label">Battery Voltage (PMF):</span>
            <span class="hist-stat-val" style="color:#38bdf8;">${c.energy.toFixed(1)} mV</span>
          </div>
          <div class="hist-stat-row">
            <span class="hist-stat-label">Biomass Matter:</span>
            <span class="hist-stat-val" style="color:#10b981;">${c.matter.toFixed(1)} tokens</span>
          </div>
          <div class="hist-stat-row">
            <span class="hist-stat-label">Primary Active:</span>
            <span class="hist-stat-val">${c.primaryActive ? '🟢 ACTIVE' : '⚪ IDLE'}</span>
          </div>
          <div class="hist-stat-row">
            <span class="hist-stat-label">Organelle / Spore:</span>
            <span class="hist-stat-val">${c.hasOrganelle ? '🧬 Endosymbiont' : (c.hasSpore ? '🌱 Spore' : 'None')}</span>
          </div>
          <div class="hist-stat-row">
            <span class="hist-stat-label">Whole-Body Speed:</span>
            <span class="hist-stat-val">${b.speed.toFixed(3)} units/tick</span>
          </div>
          <div class="hist-stat-row">
            <span class="hist-stat-label">Kinematic Mode:</span>
            <span class="hist-stat-val" style="color:#f59e0b;">${b.behavior}</span>
          </div>
        </div>

        <!-- Col 2: Netlist & GRN Switches -->
        <div class="hist-card">
          <div class="hist-card-title">🧬 EXPRESSED LOGIC NETLIST</div>
          <div class="hist-stat-row">
            <span class="hist-stat-label">Workshop Gates (${c.gateCount}):</span>
          </div>
          <div class="hist-gate-cloud">
            ${gateTypesHtml}
          </div>
          <div class="hist-stat-row" style="margin-top:8px;">
            <span class="hist-stat-label">GRN Operon States:</span>
          </div>
          <div class="hist-operon-list">
            ${operonStatesHtml}
          </div>
          <div class="hist-stat-row" style="margin-top:8px;">
            <span class="hist-stat-label">Codon Tape Bits:</span>
            <code class="hist-tape-code">${c.tapeBitstring.slice(0, 16)}...</code>
          </div>
        </div>

        <!-- Col 3: Epistemic Deep Links & Grounded Documentation -->
        <div class="hist-card">
          <div class="hist-card-title">📖 EPISTEMIC DOSSIERS & GUIDES</div>
          <p style="font-size:0.75rem;color:#94a3b8;margin-bottom:8px;">
            Explore the theoretical biophysics, Uri Alon network motifs, and morphological classifications:
          </p>
          <div class="hist-links-list">
            <a href="docs/MULTICELLULAR_MORPHOLOGY_GUIDE.html" target="_blank" class="hist-dossier-link">
              🌸 Multicellular Morphology Guide
            </a>
            <a href="docs/CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.html" target="_blank" class="hist-dossier-link">
              🔬 Circuit Paleontology Field Guide
            </a>
            <a href="docs/REALITY_TO_SIMULATION_TRANSLATION_MATRIX.html" target="_blank" class="hist-dossier-link">
              🌐 Reality-to-Simulation Translation Matrix
            </a>
            <a href="docs/GENE_REGULATORY_NETWORKS_VOLUME.html" target="_blank" class="hist-dossier-link">
              🧬 Gene Regulatory Networks Volume
            </a>
            <a href="docs/DEEP_SEA_PROTO_COGNITION_AND_VENT_BIOPHYSICS.html" target="_blank" class="hist-dossier-link">
              🌋 Deep-Sea Proto-Cognition Biophysics
            </a>
          </div>
        </div>
      </div>

      <!-- Syncytial Tissue Matrix ( फ्रेंच झेंडा / French Flag Problem ) -->
      ${syncytialMatrixHtml}

      <!-- Footer Actions -->
      <div class="hist-footer">
        <button class="hist-action-btn hist-pin-btn" id="hist-btn-pin-lineage">
          📌 Tag Organism [${b.organismId || b.bodyId}]
        </button>
        <button class="hist-action-btn" id="hist-btn-phylo" title="Open Evolutionary Phylogeny & LTEE Flight Recorder (Hotkey: P)">
          🌳 View Phylogeny (LCA)
        </button>
        <button class="hist-action-btn hist-cad-btn" id="hist-btn-cad-autopsy">
          🔬 Open Fullscreen CAD Autopsy
        </button>
        <button class="hist-action-btn" id="hist-btn-close">
          Close
        </button>
      </div>
    </div>
  `;
}
