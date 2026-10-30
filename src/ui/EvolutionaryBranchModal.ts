/**
 * 🐠 Siliquarium UI Subsystem
 * EvolutionaryBranchModal: Interactive Evolutionary Version Control, Timelines & Simulation Saves.
 * 
 * Implements Stephen Jay Gould's "Replaying Life's Tape" (1989) and Richard Lenski's
 * LTEE -80°C frozen fossil replay experiments.
 * 
 * Capabilities:
 * - Visual timeline DAG of divergent evolutionary branches.
 * - 1-Click checkout & resume from arbitrary checkpoints with zero thermodynamic leaks (ΔE = 0.000).
 * - Deterministic replays, stochastic mutational divergences, and environmental perturbation forks.
 * - Standalone .silisave file export and drag-and-drop import.
 */

import { EvolutionaryVersionManager } from '../engine/storage/EvolutionaryVersionManager.js';
import type { IEvolutionaryBranch } from '../engine/storage/SiliquariumDB.js';
import type { ISimulationStateSnapshot } from '../engine/storage/SimulationSnapshotManager.js';
import type { SimulationWorld } from '../engine/SimulationWorld.js';

export type BranchCheckoutCallback = (branch: IEvolutionaryBranch, snapshot: ISimulationStateSnapshot) => void;

export class EvolutionaryBranchModal {
  private readonly versionManager: EvolutionaryVersionManager;
  private readonly world: SimulationWorld;
  private readonly onCheckout?: BranchCheckoutCallback;

  private containerEl: HTMLElement | null = null;
  private backdropEl: HTMLElement | null = null;
  private isOpen: boolean = false;
  private activeTab: 'timeline' | 'fork' = 'timeline';
  private selectedForkSourceSnapshotId: string | null = null;

  constructor(
    world: SimulationWorld,
    onCheckout?: BranchCheckoutCallback,
    versionManager?: EvolutionaryVersionManager
  ) {
    this.world = world;
    this.onCheckout = onCheckout;
    this.versionManager = versionManager ?? EvolutionaryVersionManager.getInstance();

    this.ensureStyles();
    this.ensureElements();
    this.bindEvents();
  }

  private ensureStyles(): void {
    if (document.getElementById('evolutionary-branch-modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'evolutionary-branch-modal-styles';
    style.textContent = `
      .branch-modal-container {
        position: fixed;
        inset: 0;
        z-index: 120;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: auto;
      }
      .branch-modal-container.hidden {
        display: none !important;
      }
      .branch-modal-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(3, 7, 18, 0.85);
        backdrop-filter: blur(14px);
      }
      .branch-modal-card {
        position: relative;
        z-index: 2;
        width: 1020px;
        max-width: calc(100vw - 32px);
        max-height: calc(100vh - 48px);
        background: #090e1a;
        border: 1px solid rgba(139, 92, 246, 0.45);
        border-radius: 16px;
        box-shadow: 0 25px 70px rgba(0, 0, 0, 0.9), 0 0 30px rgba(139, 92, 246, 0.2);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        color: #e2e8f0;
        font-family: system-ui, -apple-system, sans-serif;
      }
      .branch-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 22px;
        border-bottom: 1px solid rgba(51, 65, 85, 0.6);
        background: rgba(15, 23, 42, 0.8);
      }
      .branch-header-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .branch-header-icon {
        font-size: 1.8rem;
        filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.5));
      }
      .branch-title {
        font-size: 1.15rem;
        font-weight: 800;
        letter-spacing: 0.05em;
        color: #fff;
        margin: 0;
      }
      .branch-subtitle {
        font-size: 0.72rem;
        color: #c084fc;
        font-family: monospace;
        margin-top: 2px;
      }
      .branch-modal-close-btn {
        background: rgba(148, 163, 184, 0.1);
        border: 1px solid rgba(148, 163, 184, 0.25);
        color: #94a3b8;
        padding: 6px 14px;
        border-radius: 8px;
        font-size: 0.75rem;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.15s ease;
      }
      .branch-modal-close-btn:hover {
        background: rgba(239, 68, 68, 0.15);
        border-color: rgba(239, 68, 68, 0.4);
        color: #fca5a5;
      }
      .branch-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 22px;
        background: rgba(10, 16, 32, 0.9);
        border-bottom: 1px solid rgba(51, 65, 85, 0.4);
        gap: 12px;
        flex-wrap: wrap;
      }
      .branch-active-pill {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 5px 12px;
        background: rgba(139, 92, 246, 0.15);
        border: 1px solid rgba(139, 92, 246, 0.4);
        border-radius: 8px;
        font-size: 0.78rem;
        font-family: monospace;
      }
      .branch-actions-row {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .branch-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 0.76rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s ease;
        border: 1px solid transparent;
      }
      .branch-btn-primary {
        background: rgba(16, 185, 129, 0.2);
        border-color: rgba(16, 185, 129, 0.5);
        color: #34d399;
      }
      .branch-btn-primary:hover {
        background: rgba(16, 185, 129, 0.3);
        box-shadow: 0 0 12px rgba(16, 185, 129, 0.35);
      }
      .branch-btn-secondary {
        background: rgba(56, 189, 248, 0.14);
        border-color: rgba(56, 189, 248, 0.35);
        color: #38bdf8;
      }
      .branch-btn-secondary:hover {
        background: rgba(56, 189, 248, 0.24);
        box-shadow: 0 0 12px rgba(56, 189, 248, 0.3);
      }
      .branch-btn-purple {
        background: rgba(168, 85, 247, 0.18);
        border-color: rgba(168, 85, 247, 0.45);
        color: #d8b4fe;
      }
      .branch-btn-purple:hover {
        background: rgba(168, 85, 247, 0.28);
        box-shadow: 0 0 12px rgba(168, 85, 247, 0.35);
      }
      .branch-nav-tabs {
        display: flex;
        border-bottom: 1px solid rgba(51, 65, 85, 0.5);
        background: rgba(15, 23, 42, 0.5);
        padding: 0 22px;
      }
      .branch-nav-tab {
        padding: 10px 18px;
        font-size: 0.8rem;
        font-weight: 700;
        color: #94a3b8;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        transition: all 0.15s ease;
      }
      .branch-nav-tab.active {
        color: #c084fc;
        border-bottom-color: #a855f7;
        background: rgba(168, 85, 247, 0.08);
      }
      .branch-body {
        flex: 1;
        overflow-y: auto;
        padding: 20px 22px;
        min-height: 400px;
      }
      .branch-tree-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .branch-lane {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(51, 65, 85, 0.5);
        border-radius: 12px;
        padding: 16px;
        position: relative;
      }
      .branch-lane-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(51, 65, 85, 0.4);
      }
      .branch-lane-title {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .branch-color-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        box-shadow: 0 0 8px currentColor;
      }
      .branch-lane-name {
        font-size: 0.95rem;
        font-weight: 800;
        color: #fff;
      }
      .branch-lane-mode {
        font-size: 0.65rem;
        font-family: monospace;
        padding: 2px 6px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #cbd5e1;
      }
      .branch-snapshots-flow {
        display: flex;
        align-items: stretch;
        gap: 12px;
        overflow-x: auto;
        padding-bottom: 8px;
      }
      .snapshot-node-card {
        flex: 0 0 240px;
        background: rgba(10, 16, 32, 0.85);
        border: 1px solid rgba(71, 85, 105, 0.5);
        border-radius: 10px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 10px;
        transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .snapshot-node-card:hover {
        transform: translateY(-2px);
        border-color: rgba(168, 85, 247, 0.6);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6);
      }
      .snapshot-node-card.active-head {
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.08);
        box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
      }
      .snap-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .snap-tick {
        font-family: monospace;
        font-size: 0.85rem;
        font-weight: 800;
        color: #38bdf8;
      }
      .snap-name {
        font-size: 0.82rem;
        font-weight: 700;
        color: #f1f5f9;
        margin-top: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .snap-metrics {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
        font-family: monospace;
        font-size: 0.68rem;
        color: #94a3b8;
        background: rgba(15, 23, 42, 0.6);
        padding: 6px 8px;
        border-radius: 6px;
      }
      .snap-btn-row {
        display: flex;
        gap: 6px;
        margin-top: 6px;
      }
      .snap-btn {
        flex: 1;
        padding: 4px 6px;
        font-size: 0.68rem;
        font-weight: 700;
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        background: rgba(255, 255, 255, 0.05);
        color: #cbd5e1;
        cursor: pointer;
        text-align: center;
        transition: all 0.12s ease;
      }
      .snap-btn-checkout {
        background: rgba(16, 185, 129, 0.2);
        border-color: rgba(16, 185, 129, 0.5);
        color: #34d399;
      }
      .snap-btn-checkout:hover {
        background: rgba(16, 185, 129, 0.35);
      }
      .snap-btn:hover {
        background: rgba(255, 255, 255, 0.15);
        color: #fff;
      }
      .branch-fork-form {
        max-width: 620px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .form-label {
        font-size: 0.78rem;
        font-weight: 700;
        color: #cbd5e1;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        font-family: monospace;
      }
      .form-input {
        background: #0f172a;
        border: 1px solid rgba(71, 85, 105, 0.6);
        border-radius: 8px;
        padding: 8px 12px;
        color: #f8fafc;
        font-size: 0.85rem;
        outline: none;
      }
      .form-input:focus {
        border-color: #a855f7;
        box-shadow: 0 0 10px rgba(168, 85, 247, 0.3);
      }
      .mode-radio-group {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
      }
      .mode-radio-card {
        background: #0f172a;
        border: 1px solid rgba(71, 85, 105, 0.5);
        border-radius: 10px;
        padding: 12px 14px;
        cursor: pointer;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        transition: all 0.15s ease;
      }
      .mode-radio-card:hover {
        border-color: #a855f7;
        background: rgba(168, 85, 247, 0.06);
      }
      .mode-radio-card.selected {
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.1);
        box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
      }
      .drag-drop-zone {
        border: 2px dashed rgba(168, 85, 247, 0.4);
        border-radius: 12px;
        padding: 24px;
        text-align: center;
        background: rgba(168, 85, 247, 0.04);
        margin-top: 16px;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .drag-drop-zone:hover, .drag-drop-zone.dragover {
        border-color: #a855f7;
        background: rgba(168, 85, 247, 0.12);
      }
      .toast-banner {
        position: absolute;
        top: 70px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(16, 185, 129, 0.95);
        color: #fff;
        padding: 8px 18px;
        border-radius: 8px;
        font-size: 0.82rem;
        font-weight: 700;
        z-index: 10;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        pointer-events: none;
        animation: fadeIn 0.2s ease;
      }
    `;
    document.head.appendChild(style);
  }

  private ensureElements(): void {
    let container = document.getElementById('evolutionary-branch-modal');
    if (!container) {
      container = document.createElement('div');
      container.id = 'evolutionary-branch-modal';
      container.className = 'branch-modal-container hidden';
      container.innerHTML = `
        <div class="branch-modal-backdrop" id="branch-backdrop"></div>
        <div class="branch-modal-card">
          <!-- Header -->
          <div class="branch-modal-header">
            <div class="branch-header-left">
              <span class="branch-header-icon">🌿</span>
              <div>
                <h2 class="branch-title">EVOLUTIONARY VERSION CONTROL &amp; TIMELINE BRANCHES</h2>
                <div class="branch-subtitle">Stephen Jay Gould's "Replaying Life's Tape" (1989) • Richard Lenski LTEE Replays • Git-for-Alife DAG</div>
              </div>
            </div>
            <button id="branch-close-btn" class="branch-modal-close-btn" title="Close Branches (Esc or B)">
              <span>✕</span>
              <span>CLOSE</span>
            </button>
          </div>

          <!-- Toolbar -->
          <div class="branch-toolbar">
            <div class="branch-active-pill" id="branch-active-indicator">
              <span style="color: #c084fc;">ACTIVE TIMELINE:</span>
              <strong id="branch-active-name" style="color: #fff;">main</strong>
            </div>

            <div class="branch-actions-row">
              <button id="branch-btn-quick-save" class="branch-btn branch-btn-primary" title="Save Checkpoint Bookmark (Ctrl+S)">
                <span>🔖</span>
                <span>Save Checkpoint</span>
              </button>
              <button id="branch-btn-new-fork" class="branch-btn branch-btn-purple" title="Fork a new evolutionary branch">
                <span>🌿</span>
                <span>Fork Branch</span>
              </button>
              <button id="branch-btn-export-file" class="branch-btn branch-btn-secondary" title="Export .silisave simulation file">
                <span>💾</span>
                <span>Export .silisave</span>
              </button>
              <button id="branch-btn-import-file" class="branch-btn branch-btn-secondary" title="Import .silisave file">
                <span>📂</span>
                <span>Import .silisave</span>
              </button>
              <input type="file" id="branch-file-input" accept=".silisave,.json" style="display: none;" />
            </div>
          </div>

          <!-- Nav Tabs -->
          <div class="branch-nav-tabs">
            <div class="branch-nav-tab active" id="tab-btn-timeline">🌿 Timeline DAG &amp; Checkpoints</div>
            <div class="branch-nav-tab" id="tab-btn-fork">🔀 Fork Evolutionary Branch</div>
          </div>

          <!-- Body -->
          <div class="branch-body" id="branch-body-content">
            <!-- Dynamic content rendered here -->
          </div>
        </div>
      `;
      document.body.appendChild(container);
    }

    this.containerEl = container;
    this.backdropEl = document.getElementById('branch-backdrop');
  }

  private bindEvents(): void {
    const closeBtn = document.getElementById('branch-close-btn');
    closeBtn?.addEventListener('click', () => this.close());
    this.backdropEl?.addEventListener('click', () => this.close());

    // Tab buttons
    document.getElementById('tab-btn-timeline')?.addEventListener('click', () => {
      this.activeTab = 'timeline';
      this.updateTabs();
      this.render();
    });

    document.getElementById('tab-btn-fork')?.addEventListener('click', () => {
      this.activeTab = 'fork';
      this.updateTabs();
      this.render();
    });

    // Toolbar actions
    document.getElementById('branch-btn-quick-save')?.addEventListener('click', async () => {
      await this.versionManager.saveCheckpoint(this.world);
      this.showToast('🔖 Checkpoint saved to timeline repository!');
      this.render();
    });

    document.getElementById('branch-btn-new-fork')?.addEventListener('click', () => {
      this.activeTab = 'fork';
      this.updateTabs();
      this.render();
    });

    document.getElementById('branch-btn-export-file')?.addEventListener('click', async () => {
      await this.versionManager.exportSnapshotToFile(undefined, this.world);
      this.showToast('💾 Simulation exported as .silisave file!');
    });

    const fileInput = document.getElementById('branch-file-input') as HTMLInputElement;
    document.getElementById('branch-btn-import-file')?.addEventListener('click', () => {
      fileInput?.click();
    });

    fileInput?.addEventListener('change', async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const res = await this.versionManager.importSnapshotFromFile(file, this.world);
          this.showToast(`📂 Imported & checked out "${res.branch.name}" at Tick ${res.snapshot.tick}!`);
          this.onCheckout?.(res.branch, res.snapshot);
          this.render();
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          alert(`Failed to import simulation: ${msg}`);
        }
      }
    });

    // Hotkey listener (B to toggle, Ctrl+S to save checkpoint)
    window.addEventListener('keydown', (e) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if ((e.key === 'b' || e.key === 'B') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        this.toggle();
      } else if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.versionManager.saveCheckpoint(this.world).then((snap) => {
          this.showToast(`🔖 Saved Checkpoint @ Tick ${snap.tick}`);
        });
      }
    });
  }

  public open(tab?: 'timeline' | 'fork'): void {
    if (tab) this.activeTab = tab;
    this.isOpen = true;
    this.containerEl?.classList.remove('hidden');
    this.updateTabs();
    this.render();
  }

  public close(): void {
    this.isOpen = false;
    this.containerEl?.classList.add('hidden');
  }

  public toggle(): void {
    if (this.isOpen) this.close();
    else this.open();
  }

  private updateTabs(): void {
    const tTimeline = document.getElementById('tab-btn-timeline');
    const tFork = document.getElementById('tab-btn-fork');

    if (this.activeTab === 'timeline') {
      tTimeline?.classList.add('active');
      tFork?.classList.remove('active');
    } else {
      tTimeline?.classList.remove('active');
      tFork?.classList.add('active');
    }
  }

  public async render(): Promise<void> {
    const body = document.getElementById('branch-body-content');
    if (!body) return;

    await this.versionManager.init();
    const activeBranch = await this.versionManager.getActiveBranch();
    const activeNameEl = document.getElementById('branch-active-name');
    if (activeNameEl) {
      activeNameEl.textContent = `${activeBranch.name} (${activeBranch.id})`;
      activeNameEl.style.color = activeBranch.color;
    }

    if (this.activeTab === 'timeline') {
      await this.renderTimeline(body, activeBranch);
    } else {
      await this.renderForkWizard(body);
    }
  }

  private async renderTimeline(container: HTMLElement, activeBranch: IEvolutionaryBranch): Promise<void> {
    const branches = await this.versionManager.getAllBranches();
    const allSnaps = await this.versionManager.getAllSnapshots();

    let html = `<div class="branch-tree-container">`;

    for (const b of branches) {
      const bSnaps = allSnaps.filter(s => s.branchId === b.id).sort((x, y) => x.tick - y.tick);
      const isActive = b.id === activeBranch.id;

      html += `
        <div class="branch-lane" style="border-color: ${b.color}66; ${isActive ? 'background: rgba(15, 23, 42, 0.9);' : ''}">
          <div class="branch-lane-header">
            <div class="branch-lane-title">
              <span class="branch-color-indicator" style="background: ${b.color}; color: ${b.color};"></span>
              <span class="branch-lane-name">${b.name}</span>
              <span class="branch-lane-mode">${b.forkMode.toUpperCase()}</span>
              ${isActive ? '<span style="color:#10b981;font-size:0.75rem;font-weight:700;">● ACTIVE</span>' : ''}
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:0.7rem;color:#94a3b8;font-family:monospace;">${bSnaps.length} checkpoints</span>
              ${!b.isDefault && !isActive ? `<button class="snap-btn btn-delete-branch" data-branch-id="${b.id}" style="color:#f87171;">🗑️ Delete Branch</button>` : ''}
            </div>
          </div>
          <div style="font-size:0.75rem;color:#94a3b8;margin-bottom:12px;">${b.description || 'Continuous lineage branch.'}</div>
          
          <div class="branch-snapshots-flow">
      `;

      if (bSnaps.length === 0) {
        html += `<div style="padding:16px;font-size:0.75rem;color:#64748b;font-style:italic;">No saved checkpoints on this branch yet. Use "Save Checkpoint" to bookmark.</div>`;
      } else {
        for (const s of bSnaps) {
          const isHead = s.id === b.headSnapshotId;
          html += `
            <div class="snapshot-node-card ${isHead ? 'active-head' : ''}">
              <div>
                <div class="snap-header">
                  <span class="snap-tick">Tick ${s.tick.toLocaleString()}</span>
                  <span style="font-size:0.65rem;color:#64748b;">${new Date(s.timestamp).toLocaleTimeString()}</span>
                </div>
                <div class="snap-name" title="${s.name}">${s.name}</div>
              </div>

              <div class="snap-metrics">
                <div><span>Silicoids:</span> <strong style="color:#34d399;">${s.stats.livingCount}</strong></div>
                <div><span>Clades:</span> <strong style="color:#38bdf8;">${s.stats.activeCladesCount}</strong></div>
                <div><span>Spores:</span> <strong style="color:#facc15;">${s.stats.sporeCount}</strong></div>
                <div><span>Gen:</span> <strong style="color:#cbd5e1;">${s.stats.maxGeneration}</strong></div>
              </div>

              <div class="snap-btn-row">
                <button class="snap-btn snap-btn-checkout btn-checkout" data-snap-id="${s.id}" title="Restore and resume simulation from this exact tick">
                  ⚡ Resume
                </button>
                <button class="snap-btn btn-fork-from" data-snap-id="${s.id}" title="Fork a new evolutionary branch from this point">
                  🌿 Fork
                </button>
                <button class="snap-btn btn-export-snap" data-snap-id="${s.id}" title="Export .silisave file">
                  💾
                </button>
                <button class="snap-btn btn-delete-snap" data-snap-id="${s.id}" title="Delete checkpoint" style="color:#f87171;">
                  ✕
                </button>
              </div>
            </div>
          `;
        }
      }

      html += `</div></div>`;
    }

    html += `
      <div class="drag-drop-zone" id="drag-drop-zone">
        <span style="font-size: 1.6rem;">📥</span>
        <div style="font-weight: 700; color: #d8b4fe; margin-top: 6px;">Drop .silisave files here to import</div>
        <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 2px;">Loads saved simulation world states with verified first-law conservation (ΔE = 0.000).</div>
      </div>
    </div>`;

    container.innerHTML = html;

    // Attach button listeners
    container.querySelectorAll('.btn-checkout').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-snap-id')!;
        const res = await this.versionManager.checkout(this.world, id);
        this.showToast(`⚡ Restored & resumed timeline "${res.branch.name}" at Tick ${res.snapshot.tick}!`);
        this.onCheckout?.(res.branch, res.snapshot);
        this.render();
      });
    });

    container.querySelectorAll('.btn-fork-from').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-snap-id')!;
        this.selectedForkSourceSnapshotId = id;
        this.activeTab = 'fork';
        this.updateTabs();
        this.render();
      });
    });

    container.querySelectorAll('.btn-export-snap').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-snap-id')!;
        await this.versionManager.exportSnapshotToFile(id);
        this.showToast('💾 Snapshot exported as .silisave file!');
      });
    });

    container.querySelectorAll('.btn-delete-snap').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-snap-id')!;
        if (confirm('Delete this historical checkpoint?')) {
          await this.versionManager.deleteSnapshot(id);
          this.render();
        }
      });
    });

    container.querySelectorAll('.btn-delete-branch').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-branch-id')!;
        if (confirm('Delete this branch and all its checkpoints?')) {
          await this.versionManager.deleteBranch(id);
          this.render();
        }
      });
    });

    // Drag and drop zone
    const dropZone = document.getElementById('drag-drop-zone');
    if (dropZone) {
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
      });
      dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
      dropZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const file = e.dataTransfer?.files?.[0];
        if (file) {
          try {
            const res = await this.versionManager.importSnapshotFromFile(file, this.world);
            this.showToast(`📂 Imported & checked out "${res.branch.name}" at Tick ${res.snapshot.tick}!`);
            this.onCheckout?.(res.branch, res.snapshot);
            this.render();
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            alert(`Failed to import .silisave: ${msg}`);
          }
        }
      });
    }
  }

  private async renderForkWizard(container: HTMLElement): Promise<void> {
    const allSnaps = await this.versionManager.getAllSnapshots();
    const sourceSnap = this.selectedForkSourceSnapshotId
      ? allSnaps.find(s => s.id === this.selectedForkSourceSnapshotId)
      : null;

    container.innerHTML = `
      <div class="branch-fork-form">
        <div style="border-bottom:1px solid rgba(51,65,85,0.5);padding-bottom:10px;margin-bottom:6px;">
          <h3 style="margin:0;font-size:1rem;color:#f8fafc;font-weight:800;">FORK AN EVOLUTIONARY BRANCH</h3>
          <p style="margin:4px 0 0 0;font-size:0.74rem;color:#94a3b8;">
            Branching creates an isolated phylogenetic timeline, allowing you to re-run history under different random seeds or physical pressures.
          </p>
        </div>

        <div class="form-group">
          <label class="form-label">Branch Name</label>
          <input type="text" id="fork-input-name" class="form-input" placeholder="e.g. Cit+ Cold Surge Divergence" value="${sourceSnap ? `Branch from ${sourceSnap.name}` : `Divergence @ Tick ${this.world.captureStateSnapshot('temp').tick}`}" />
        </div>

        <div class="form-group">
          <label class="form-label">Description / Hypothesis</label>
          <input type="text" id="fork-input-desc" class="form-input" placeholder="e.g. Testing if syncytial predation emerges under stochastic drift." />
        </div>

        <div class="form-group">
          <label class="form-label">Base Snapshot Source</label>
          <select id="fork-select-source" class="form-input" style="font-family: monospace;">
            <option value="">● Current Live World State (Tick ${this.world.captureStateSnapshot('temp').tick})</option>
            ${allSnaps.map(s => `
              <option value="${s.id}" ${s.id === this.selectedForkSourceSnapshotId ? 'selected' : ''}>
                Tick ${s.tick} • ${s.name} (${s.branchId})
              </option>
            `).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Evolutionary Replay Mode</label>
          <div class="mode-radio-group">
            <div class="mode-radio-card selected" data-mode="deterministic" id="mode-card-deterministic">
              <span style="font-size: 1.4rem;">🎯</span>
              <div>
                <div style="font-weight: 800; color: #f8fafc; font-size: 0.85rem;">Deterministic Replay (Gould's Exact Tape)</div>
                <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 2px;">
                  Inherits exact PRNG internal bit-state. Trajectory will evolve 100% identically if unperturbed, proving cross-run mathematical determinism.
                </div>
              </div>
            </div>

            <div class="mode-radio-card" data-mode="stochastic" id="mode-card-stochastic">
              <span style="font-size: 1.4rem;">🎲</span>
              <div>
                <div style="font-weight: 800; color: #f8fafc; font-size: 0.85rem;">Stochastic Divergence (Lenski LTEE Cit+ Replay)</div>
                <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 2px;">
                  Generates a new random PRNG seed. The exact current cell population explores alternate point mutations and morphological paths.
                </div>
              </div>
            </div>

            <div class="mode-radio-card" data-mode="perturbed" id="mode-card-perturbed">
              <span style="font-size: 1.4rem;">🌋</span>
              <div>
                <div style="font-weight: 800; color: #f8fafc; font-size: 0.85rem;">Environmental Perturbation Fork</div>
                <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 2px;">
                  Boosts geological volatility (2.5x) and mutational pressure (1.5x) to challenge living silicoids with intense selective pressures.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style="display:flex;gap:12px;margin-top:10px;">
          <button id="btn-submit-fork" class="branch-btn branch-btn-primary" style="flex:1;padding:10px 16px;font-size:0.85rem;">
            <span>🌿</span>
            <span>Fork Branch &amp; Resume Simulation</span>
          </button>
          <button id="btn-cancel-fork" class="branch-btn" style="background:#1e293b;color:#94a3b8;padding:10px 16px;">
            Cancel
          </button>
        </div>
      </div>
    `;

    let selectedMode: 'deterministic' | 'stochastic' | 'perturbed' = 'deterministic';

    const cards = container.querySelectorAll('.mode-radio-card');
    cards.forEach(c => {
      c.addEventListener('click', () => {
        cards.forEach(x => x.classList.remove('selected'));
        c.classList.add('selected');
        const modeAttr = c.getAttribute('data-mode');
        if (modeAttr === 'deterministic' || modeAttr === 'stochastic' || modeAttr === 'perturbed') {
          selectedMode = modeAttr;
        }
      });
    });

    document.getElementById('btn-cancel-fork')?.addEventListener('click', () => {
      this.activeTab = 'timeline';
      this.updateTabs();
      this.render();
    });

    document.getElementById('btn-submit-fork')?.addEventListener('click', async () => {
      const nameInput = document.getElementById('fork-input-name') as HTMLInputElement;
      const descInput = document.getElementById('fork-input-desc') as HTMLInputElement;
      const sourceSelect = document.getElementById('fork-select-source') as HTMLSelectElement;

      const name = nameInput.value.trim() || 'Divergent Branch';
      const desc = descInput.value.trim();
      const sourceId = sourceSelect.value || undefined;

      try {
        const res = await this.versionManager.createBranch(
          this.world,
          name,
          desc,
          selectedMode,
          sourceId
        );

        this.showToast(`🌿 Forked branch "${res.branch.name}" (${selectedMode})!`);
        this.onCheckout?.(res.branch, res.snapshot);
        this.activeTab = 'timeline';
        this.updateTabs();
        this.render();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        alert(`Failed to fork branch: ${msg}`);
      }
    });
  }

  private showToast(msg: string): void {
    const existing = document.getElementById('branch-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'branch-toast';
    toast.className = 'toast-banner';
    toast.textContent = msg;
    this.containerEl?.appendChild(toast);

    setTimeout(() => toast.remove(), 3200);
  }
}
