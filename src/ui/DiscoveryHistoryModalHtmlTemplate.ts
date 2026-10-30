/**
 * 🐠 Siliquarium UI Subsystem
 * DiscoveryHistoryModalHtmlTemplate: Static DOM Layout and Card Markup for Discovery History Log.
 */

import { IMilestoneEvent } from '../engine/paleontology/DigitalPaleontologist.js';
import { ISpeciesTaxon } from '../core/paleontology/TaxonomyNomenclature.js';

export function buildDiscoveryModalSkeleton(): string {
  return `
    <div class="discovery-modal-backdrop" id="discovery-backdrop"></div>
    <div class="discovery-modal-card">
      <!-- Modal Header -->
      <div class="discovery-header">
        <div class="discovery-header-left">
          <span class="discovery-icon">🏆</span>
          <div>
            <h2 class="discovery-title">CIRCUIT PALEONTOLOGY DISCOVERY LOG</h2>
            <div class="discovery-subtitle">Sequential Chronological Registry • Uri Alon Motifs • Weisfeiler-Lehman Graph Invariants</div>
          </div>
        </div>
        <div class="discovery-header-right">
          <button id="discovery-toggle-popups-btn" class="discovery-toggle-pill" title="Toggle Discovery Alert Pop-up Notifications">
            <span id="discovery-popup-icon">🔔</span>
            <span id="discovery-popup-text">Alert Pop-ups: ON</span>
          </button>
          <button id="discovery-close-btn" class="drawer-close-btn" title="Close Discovery Log (Hotkey: Esc)">
            <span>✕</span>
            <span>CLOSE</span>
          </button>
        </div>
      </div>

      <!-- Summary Ribbon -->
      <div class="discovery-ribbon">
        <div class="ribbon-card">
          <span class="ribbon-label">Total Discoveries</span>
          <span class="ribbon-val" id="discovery-total-count" style="color: #fbbf24;">0</span>
          <span class="ribbon-sub">Sequential Milestones</span>
        </div>
        <div class="ribbon-card">
          <span class="ribbon-label">Unique Motifs</span>
          <span class="ribbon-val" id="discovery-unique-count" style="color: #38bdf8;">0 / 20</span>
          <span class="ribbon-sub">Taxonomy Coverage</span>
        </div>
        <div class="ribbon-card">
          <span class="ribbon-label">Latest Discovery</span>
          <span class="ribbon-val" id="discovery-latest-tick" style="color: #10b981;">—</span>
          <span class="ribbon-sub">Simulation Tick</span>
        </div>
        <div class="ribbon-card">
          <span class="ribbon-label">Notification Mode</span>
          <span class="ribbon-val" id="discovery-notif-mode" style="color: #a855f7;">Interactive</span>
          <span class="ribbon-sub">Pop-up Status</span>
        </div>
      </div>

      <!-- Chronological List of Cards -->
      <div class="discovery-body" id="discovery-cards-list">
        <!-- Populated dynamically -->
      </div>

      <!-- Footer with Field Guide Link -->
      <div class="discovery-footer">
        <span class="discovery-footer-hint">Click any "Inspect Pore" button to smoothly steer the camera and focus the Circuit Microscope.</span>
        <a href="docs/CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.html" target="_blank" class="discovery-guide-btn">
          <span>📖 Open Field Guide Taxonomy ↗</span>
        </a>
      </div>
    </div>
  `;
}

export function buildDiscoveryEmptyStateHtml(): string {
  return `
    <div class="discovery-empty-state">
      <div style="font-size: 2.2rem; margin-bottom: 8px;">🦕</div>
      <div style="font-size: 0.95rem; font-weight: bold; color: #e2e8f0;">No Evolved Circuit Motifs Discovered Yet</div>
      <p style="font-size: 0.8rem; color: #94a3b8; max-width: 480px; margin: 6px auto 0; line-height: 1.5;">
        Run the simulation at 1x–10x speed or trigger God-Suite perturbations. When hydrothermal silicoids evolve Uri Alon motifs (latches, clocks, filters, adders, endosymbionts, Substrate-C catabolism, mineral chelation, biofilm shields, or syntrophy), they will appear here in sequential order.
      </p>
    </div>
  `;
}

export function buildDiscoveryCardHtml(
  m: IMilestoneEvent,
  seqNum: number,
  taxon: ISpeciesTaxon,
  specimenUrl: string
): string {
  return `
    <div class="discovery-card">
      <div class="discovery-card-top">
        <div class="discovery-card-seq">
          <span class="discovery-seq-badge">#${seqNum}</span>
          <span class="discovery-tick-badge">Tick ${m.tick.toLocaleString()}</span>
          <span class="discovery-origin-badge">${m.origin}</span>
        </div>
        <div class="discovery-card-coord">
          PORE [${m.poreCoord.q}, ${m.poreCoord.r}, ${m.poreCoord.z}]
        </div>
      </div>

      <div class="discovery-card-main">
        <div class="discovery-card-title-row">
          <h3 class="discovery-motif-name">⚡ ${m.motif.name}</h3>
          <span class="discovery-taxon-name">${taxon.binomialName}</span>
        </div>
        <div class="discovery-cognate-row">
          <span class="discovery-cognate">${m.motif.biologicalCognate}</span>
          <span class="discovery-honoree">(Homage: ${taxon.honoree} — ${taxon.field})</span>
        </div>
        <p class="discovery-desc">${m.motif.naturalFunction}</p>
      </div>

      <div class="discovery-card-meta">
        <div class="discovery-hash-wrap">
          <span class="discovery-meta-label">WL Invariant:</span>
          <code class="discovery-hash-code">${m.wlHash}</code>
        </div>
        <div class="discovery-cite-wrap">
          <span class="discovery-cite">${m.motif.citation}</span>
        </div>
      </div>

      <div class="discovery-card-actions">
        <button class="discovery-inspect-btn" data-q="${m.poreCoord.q}" data-r="${m.poreCoord.r}" data-z="${m.poreCoord.z}">
          🎯 Focus Camera &amp; Inspect Microscope
        </button>
        <a href="docs/${specimenUrl}" target="_blank" class="discovery-doc-link">
          📖 Specimen Field Dossier ↗
        </a>
      </div>
    </div>
  `;
}
