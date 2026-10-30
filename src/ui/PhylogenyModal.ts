/**
 * 🐠 Siliquarium UI Subsystem
 * PhylogenyModal: Interactive Macro-Evolutionary Phylogeny & Lenski LTEE Explorer.
 * Displays real-time clade radiation trees, Shannon diversity metrics, evolutionary velocity,
 * and audits Homology vs. Convergent Evolution (Homoplasy).
 */

import { ISimulationTelemetry, ICladeSummary } from '../engine/SimulationTelemetry.js';
import { HexCoord3D } from '../core/spatial/HexCoord3D.js';
import { buildPhylogenyModalMarkup } from './PhylogenyModalHtmlTemplate.js';

export type FocusCoordCallback = (coord: HexCoord3D) => void;

export class PhylogenyModal {
  private containerEl: HTMLElement | null = null;
  private backdropEl: HTMLElement | null = null;
  private isOpen: boolean = false;
  private onFocusCoord?: FocusCoordCallback;
  private currentTelemetry?: ISimulationTelemetry;

  constructor(onFocusCoord?: FocusCoordCallback) {
    this.onFocusCoord = onFocusCoord;
    this.ensureElements();
    this.bindEvents();
  }

  private ensureElements(): void {
    let modal = document.getElementById('phylogeny-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'phylogeny-modal';
      modal.className = 'phylogeny-modal-container hidden';
      modal.innerHTML = buildPhylogenyModalMarkup();
      document.body.appendChild(modal);
    }

    this.containerEl = modal;
    this.backdropEl = document.getElementById('phylogeny-backdrop');
  }

  private bindEvents(): void {
    const closeBtn = document.getElementById('phylogeny-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.hide());

    const returnBtn = document.getElementById('phylo-return-btn');
    if (returnBtn) returnBtn.addEventListener('click', () => this.hide());

    if (this.backdropEl) {
      this.backdropEl.addEventListener('click', () => this.hide());
    }

    // Tabs
    const tabClades = document.getElementById('phylo-tab-clades');
    const tabConvergence = document.getElementById('phylo-tab-convergence');
    const paneClades = document.getElementById('phylo-pane-clades');
    const paneConvergence = document.getElementById('phylo-pane-convergence');

    if (tabClades && tabConvergence && paneClades && paneConvergence) {
      tabClades.addEventListener('click', () => {
        tabClades.classList.add('active-tab');
        tabConvergence.classList.remove('active-tab');
        paneClades.classList.remove('hidden');
        paneConvergence.classList.add('hidden');
      });

      tabConvergence.addEventListener('click', () => {
        tabConvergence.classList.add('active-tab');
        tabClades.classList.remove('active-tab');
        paneConvergence.classList.remove('hidden');
        paneClades.classList.add('hidden');
      });
    }

    // Global Hotkey (P / Esc)
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen) {
        this.hide();
      }
    });
  }

  public show(telemetry: ISimulationTelemetry): void {
    this.currentTelemetry = telemetry;
    this.ensureElements();
    this.updateContent(telemetry);
    if (this.containerEl) {
      this.containerEl.classList.remove('hidden');
    }
    this.isOpen = true;
  }

  public open(telemetry: ISimulationTelemetry): void {
    this.show(telemetry);
  }

  public hide(): void {
    if (this.containerEl) {
      this.containerEl.classList.add('hidden');
    }
    this.isOpen = false;
  }

  public toggle(telemetry?: ISimulationTelemetry): void {
    if (this.isOpen) {
      this.hide();
    } else if (telemetry) {
      this.show(telemetry);
    } else if (this.currentTelemetry) {
      this.show(this.currentTelemetry);
    }
  }

  public updateLive(telemetry: ISimulationTelemetry): void {
    this.currentTelemetry = telemetry;
    if (this.isOpen) {
      this.updateContent(telemetry);
    }
  }

  private updateContent(telemetry: ISimulationTelemetry): void {
    // 1. Ribbon Metrics
    const maxGenEl = document.getElementById('phylo-max-gen');
    if (maxGenEl) maxGenEl.textContent = `Gen ${telemetry.maxGeneration ?? 0}`;

    const cladeCountEl = document.getElementById('phylo-clade-count');
    if (cladeCountEl) cladeCountEl.textContent = (telemetry.activeCladesCount ?? 0).toString();

    const shannonEl = document.getElementById('phylo-shannon-val');
    const shannonBadge = document.getElementById('phylo-shannon-badge');
    const h = telemetry.shannonDiversity ?? 0;
    if (shannonEl) shannonEl.textContent = h.toFixed(3);
    if (shannonBadge) {
      if (h > 1.2) {
        shannonBadge.textContent = 'Diverse Radiations';
        shannonBadge.className = 'ribbon-badge badge-green';
      } else if (h >= 0.5) {
        shannonBadge.textContent = 'Niche Partitioned';
        shannonBadge.className = 'ribbon-badge badge-amber';
      } else {
        shannonBadge.textContent = 'Monoculture Sweep';
        shannonBadge.className = 'ribbon-badge badge-rose';
      }
    }

    const birthsEl = document.getElementById('phylo-births');
    if (birthsEl) birthsEl.textContent = (telemetry.totalBirths ?? 0).toLocaleString();

    const velocityEl = document.getElementById('phylo-velocity');
    if (velocityEl) {
      const vel = telemetry.evolutionaryVelocity ?? (telemetry.tick > 0 ? (telemetry.maxGeneration / telemetry.tick) * 100 : 0);
      velocityEl.textContent = vel.toFixed(2);
    }

    // 2. Clades List
    const cladesListEl = document.getElementById('phylo-clades-list');
    if (cladesListEl && telemetry.clades) {
      if (telemetry.clades.length === 0) {
        cladesListEl.innerHTML = `<div class="phylo-empty-state">No active phylogenetic clades found in current epoch.</div>`;
      } else {
        cladesListEl.innerHTML = telemetry.clades.map((clade: ICladeSummary) => {
          const shortId = clade.cladeId.length > 18 ? `${clade.cladeId.slice(0, 8)}...${clade.cladeId.slice(-6)}` : clade.cladeId;
          return `
            <div class="phylo-clade-row">
              <div class="clade-cell-id">
                <span class="clade-color-dot" style="background: ${clade.color}; box-shadow: 0 0 6px ${clade.color};"></span>
                <span class="clade-id-text" title="${clade.cladeId}">${shortId}</span>
              </div>
              <div class="clade-cell-name">
                <span class="clade-taxon-name" style="color: ${clade.color};">${clade.dominantMotif}</span>
              </div>
              <div class="clade-cell-stat font-bold" style="color: #fff;">${clade.population}</div>
              <div class="clade-cell-stat" style="color: #38bdf8;">Gen ${clade.maxGeneration}</div>
              <div class="clade-cell-stat" style="color: #fbbf24;">${clade.averageEnergy} T</div>
              <div class="clade-cell-action">
                <button class="clade-track-btn" data-q="${clade.samplePoreCoord.q}" data-r="${clade.samplePoreCoord.r}" data-z="${clade.samplePoreCoord.z}">
                  🎯 Track in 3D
                </button>
              </div>
            </div>
          `;
        }).join('');

        // Wire up Track buttons
        cladesListEl.querySelectorAll('.clade-track-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            const q = parseInt(target.getAttribute('data-q') || '0', 10);
            const r = parseInt(target.getAttribute('data-r') || '0', 10);
            const z = parseInt(target.getAttribute('data-z') || '0', 10);
            if (this.onFocusCoord) {
              this.onFocusCoord(new HexCoord3D(q, r, z));
              this.hide();
            }
          });
        });
      }
    }

    // 3. Milestones & Convergent Evolution
    const milestonesListEl = document.getElementById('phylo-milestones-list');
    if (milestonesListEl) {
      const milestones = telemetry.milestones || [];
      if (milestones.length === 0) {
        milestonesListEl.innerHTML = `<div class="phylo-empty-state">No macro-evolutionary milestones recorded yet. Run simulation to discover network motifs!</div>`;
      } else {
        milestonesListEl.innerHTML = milestones.map(m => {
          const originBadge = m.origin === 'HOMOPLASY'
            ? `<span class="origin-pill origin-homoplasy">⚖️ CONVERGENT EVOLUTION (HOMOPLASY)</span>`
            : `<span class="origin-pill origin-denovo">⚡ NOVEL ADAPTATION</span>`;

          return `
            <div class="milestone-card-item">
              <div class="milestone-card-top">
                <div class="milestone-card-title">${m.motif.name}</div>
                ${originBadge}
              </div>
              <div class="milestone-card-cognate">🧬 ${m.motif.biologicalCognate}</div>
              <div class="milestone-card-desc">${m.motif.naturalFunction}</div>
              <div class="milestone-card-meta">
                <span>Tick ${m.tick}</span> • 
                <span>Pore [${m.poreCoord.q}, ${m.poreCoord.r}, ${m.poreCoord.z}]</span> • 
                <span class="font-mono text-cyan-400">${m.wlHash}</span>
              </div>
              <div class="milestone-card-cite">${m.motif.citation}</div>
            </div>
          `;
        }).join('');
      }
    }
  }
}
