/**
 * 🐠 Siliquarium UI Subsystem
 * NaturalistAssistantHtmlTemplate: Static DOM Layout and Markup Builders for the Naturalist Expedition Copilot.
 */

import { INaturalistExemplar } from './NaturalistAssistant.js';
import { IBarrierDiagnostic } from '../engine/paleontology/EvolutionaryBarrierAuditor.js';

export interface ITourHubTemplateParams {
  readonly activeCategory: string;
  readonly activeExemplars: readonly INaturalistExemplar[];
  readonly superCount: number;
  readonly trophicCount: number;
  readonly circuitCount: number;
  readonly filteredExemplars: readonly INaturalistExemplar[];
}

export function buildTourHubHtml(params: ITourHubTemplateParams): string {
  const {
    activeCategory,
    activeExemplars,
    superCount,
    trophicCount,
    circuitCount,
    filteredExemplars
  } = params;

  return `
    <div class="naturalist-tour-filter-group" style="flex-shrink:0;">
      <span class="tour-label">🧭 Expeditions:</span>
      <button class="tour-filter-pill ${activeCategory === 'all' ? 'active' : ''}" data-cat="all">All (${activeExemplars.length})</button>
      <button class="tour-filter-pill ${activeCategory === 'super' ? 'active' : ''}" data-cat="super">🏛️ Super (${superCount})</button>
      <button class="tour-filter-pill ${activeCategory === 'trophic' ? 'active' : ''}" data-cat="trophic">⚡ Trophic (${trophicCount})</button>
      <button class="tour-filter-pill ${activeCategory === 'circuit' ? 'active' : ''}" data-cat="circuit">🔬 Circuits (${circuitCount})</button>
    </div>

    <button id="btn-guided-safari" class="tour-btn tour-btn-safari" style="flex-shrink:0;" title="Cycle sequentially through all living emergent phenotypes across the seafloor">
      🚀 Guided Safari ►
    </button>

    <div class="naturalist-tour-specimens-tray" id="tour-specimens-tray">
      ${filteredExemplars.map(ex => `
        <button class="tour-btn ex-tour-btn" data-ex-id="${ex.id}" style="border-color:${ex.badgeColor};flex-shrink:0;white-space:nowrap;" title="${ex.naturalFunction}">
          <span style="color:${ex.badgeColor};font-weight:bold;">●</span>
          <span>${ex.title}</span>
        </button>
      `).join('')}
    </div>

    <div style="margin-left:auto;display:flex;align-items:center;gap:6px;flex-shrink:0;">
      <button id="tour-export-json" class="tour-btn tour-btn-accent" title="Download complete historical log with barrier diagnostics">
        📥 JSON
      </button>
      <button id="tour-export-csv" class="tour-btn" title="Download flat time-series trajectory for Excel/Python">
        📊 CSV
      </button>
    </div>
  `;
}

export function buildMacroNoveltiesEmptyHtml(): string {
  return `
    <div style="color:#64748b;font-style:italic;text-align:center;padding:24px 10px;">
      Seafloor in primordial state. Run the simulation to witness spontaneous macro-emergence.
    </div>
  `;
}

export function buildMacroNoveltiesCardsHtml(exemplars: readonly INaturalistExemplar[]): string {
  return exemplars.map(ex => `
    <div class="naturalist-card" style="border-left: 3px solid ${ex.badgeColor};">
      <div class="novelty-header">
        <span class="novelty-badge" style="background:${ex.badgeColor};color:#000;">${ex.badge}</span>
        <span class="novelty-meta">[q:${ex.coord.q}, r:${ex.coord.r}, z:${ex.coord.z}]</span>
      </div>
      <div class="novelty-title">${ex.title}</div>
      <div class="novelty-subtitle">${ex.subtitle}</div>
      <p class="novelty-desc">
        <strong>What it does &amp; why it evolved:</strong> ${ex.naturalFunction}
      </p>
      <div style="font-size:0.68rem;color:#94a3b8;font-family:monospace;background:#060a14;padding:4px 6px;border-radius:4px;">
        <strong>Field Marks:</strong> ${ex.fieldMarks.join(' • ')}
      </div>
      <div class="novelty-cite">${ex.citation}</div>
      <div class="novelty-actions" style="display:flex;align-items:center;justify-content:space-between;margin-top:6px;">
        <button class="nav-focus-btn ex-flyto-btn" data-ex-id="${ex.id}">
          🎯 Fly To Specimen
        </button>
        <a href="${ex.dossierUrl}" target="_blank" rel="noopener noreferrer" class="dossier-link">
          📖 Read Field Dossier ↗
        </a>
      </div>
    </div>
  `).join('');
}

export function buildBarriersEmptyHtml(): string {
  return `
    <div style="color:#10b981;font-style:italic;text-align:center;padding:24px 10px;">
      ✓ Seafloor in healthy ecological balance. No critical evolutionary bottlenecks detected.
    </div>
  `;
}

export function buildBarrierItemHtml(
  d: IBarrierDiagnostic,
  actions: readonly { readonly label: string }[]
): string {
  return `
    <div class="barrier-item barrier-${d.severity.toLowerCase()}">
      <div class="barrier-header">
        <span class="barrier-badge">${d.severity}</span>
        <span class="barrier-title">${d.title}</span>
      </div>
      <p class="barrier-desc">${d.description}</p>
      <div class="barrier-remedy">
        <strong>Ecological Principle:</strong> ${d.recommendedRemedy}
      </div>
      ${actions.length > 0 ? `
        <div style="margin-top:6px;">
          <span style="font-size:0.65rem;color:#94a3b8;font-family:monospace;text-transform:uppercase;">🛠️ Actionable Stewardship Interventions:</span>
          <div class="stewardship-group">
            ${actions.map((act, i) => `
              <button class="stewardship-btn" data-action-idx="${i}" data-barrier-code="${d.code}">
                ${act.label}
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}
      <div style="margin-top:4px;text-align:right;">
        <a href="docs/USER_GUIDE.html#33-evolutionary-barriers-detector--adaptive-remedies" target="_blank" rel="noopener noreferrer" class="dossier-link" style="font-size:0.65rem;">
          📖 Remediation Guide ↗
        </a>
      </div>
    </div>
  `;
}
