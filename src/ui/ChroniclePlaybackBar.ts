/**
 * 🐠 Siliquarium UI Subsystem
 * ChroniclePlaybackBar: Longitudinal Kinematics Scrubber, Slideout Control Drawer & Zen Transport Dock.
 * 
 * Provides an ultra-sleek floating timeline scrubber with clustered geodynamic shock pips,
 * an off-screen slideout control drawer for stains, overlays, speed, and A-B loops,
 * a distraction-free Fullscreen Zen Mode, and direct integration with the Historical Expedition Tour.
 */

import { ColonyKinematicsRecorder, HistologicalStain, LensViewMode } from '../engine/kinematics/ColonyKinematicsRecorder.js';
import { PoreWorkshop } from '../core/domain/PoreWorkshop.js';
import { MotifScanner } from '../core/paleontology/MotifScanner.js';

export interface IChronicleBarCallbacks {
  readonly onFrameChange?: (frameIndex: number) => void;
  readonly onStainChange?: (stain: HistologicalStain) => void;
  readonly onLensChange?: (lens: LensViewMode) => void;
  readonly onPinLineage?: (cladeId: string | null) => void;
  readonly onOpenAutopsy?: () => void;
  readonly onOpenPhylogeny?: () => void;
  readonly onOpenTour?: () => void;
  readonly onOpenLab?: () => void;
  readonly onExportArchive?: () => void;
  readonly onImportArchive?: (file: File) => void;
}

export class ChroniclePlaybackBar {
  private readonly recorder: ColonyKinematicsRecorder;
  private readonly callbacks: IChronicleBarCallbacks;
  private containerEl: HTMLElement | null = null;
  private drawerEl: HTMLElement | null = null;
  private drawerBackdropEl: HTMLElement | null = null;
  private zenExitPill: HTMLElement | null = null;

  private isVisible: boolean = false;
  private isDrawerOpen: boolean = false;
  private isZenMode: boolean = false;
  private isUserDraggingScrubber: boolean = false;
  private isOscilloscopeOpen: boolean = false;

  // DOM Elements
  private scrubSlider: HTMLInputElement | null = null;
  private eventPipsContainer: HTMLElement | null = null;
  private loopTrackHighlight: HTMLElement | null = null;
  private tickBadgeEl: HTMLElement | null = null;
  private speedChipEl: HTMLElement | null = null;
  private eventBadgeEl: HTMLElement | null = null;
  private playPauseBtn: HTMLButtonElement | null = null;
  private loopBtn: HTMLButtonElement | null = null;
  private loopRangeLabel: HTMLElement | null = null;
  private pinnedCladeBadge: HTMLElement | null = null;
  private oscilloscopeEl: HTMLElement | null = null;
  private scopeBtnEl: HTMLButtonElement | null = null;

  constructor(recorder: ColonyKinematicsRecorder, callbacks: IChronicleBarCallbacks = {}) {
    this.recorder = recorder;
    this.callbacks = callbacks;
    this.initDOM();
  }

  private initDOM(): void {
    // 1. Floating Scrubber Dock at bottom
    let existing = document.getElementById('chronicle-playback-dock');
    if (!existing) {
      existing = document.createElement('div');
      existing.id = 'chronicle-playback-dock';
      existing.className = 'chronicle-playback-dock hidden';
      const seafloorContainer = document.getElementById('seafloor-container') || document.body;
      seafloorContainer.appendChild(existing);
    }
    this.containerEl = existing;

    // 2. Slideout Drawer Backdrop
    let backdrop = document.getElementById('chronicle-drawer-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'chronicle-drawer-backdrop';
      backdrop.className = 'chronicle-drawer-backdrop hidden';
      document.body.appendChild(backdrop);
    }
    this.drawerBackdropEl = backdrop;

    // 3. Slideout Control Drawer on Right
    let drawer = document.getElementById('chronicle-control-drawer');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'chronicle-control-drawer';
      drawer.className = 'chronicle-control-drawer hidden';
      document.body.appendChild(drawer);
    }
    this.drawerEl = drawer;

    // 4. Floating Zen Exit Pill
    let zenPill = document.getElementById('chronicle-zen-exit-pill');
    if (!zenPill) {
      zenPill = document.createElement('div');
      zenPill.id = 'chronicle-zen-exit-pill';
      zenPill.className = 'chronicle-zen-exit-pill hidden';
      zenPill.innerHTML = `
        <button id="chronicle-btn-exit-zen" class="chronicle-zen-exit-btn" title="Exit Zen Mode (Esc / F)">
          <span>✕</span>
          <span>Exit Zen Mode</span>
        </button>
      `;
      document.body.appendChild(zenPill);
    }
    this.zenExitPill = zenPill;

    this.renderHTML();
    this.bindEvents();
  }

  private renderHTML(): void {
    if (!this.containerEl || !this.drawerEl) return;

    // 1. Sleek Floating Scrubber Bar
    this.containerEl.innerHTML = `
      <div class="chronicle-inner-panel">
        <!-- Floating Picture-in-Picture Oscilloscope Container -->
        <div class="chronicle-pip-oscilloscope hidden" id="chronicle-pip-oscilloscope"></div>

        <!-- Top Track: Interactive Scrubber with Shock Pips and Loop Region -->
        <div class="chronicle-scrub-section">
          <div class="chronicle-track-wrapper">
            <div class="chronicle-loop-highlight" id="chronicle-loop-highlight"></div>
            <div class="chronicle-event-pips" id="chronicle-event-pips"></div>
            <input type="range" class="chronicle-scrubber" id="chronicle-scrubber" min="0" max="0" value="0" step="1">
          </div>
        </div>

        <!-- Bottom Row: Unified Compact Transport & Quick Tool Action Triggers -->
        <div class="chronicle-compact-bar">
          <!-- Left: Transport cluster & Tick indicator -->
          <div class="chronicle-transport-cluster">
            <button class="chronicle-ctrl-btn" id="chronicle-btn-start" title="Rewind to Inception (Tick 0)">⏮</button>
            <button class="chronicle-ctrl-btn" id="chronicle-btn-step-back" title="Step Back 1 Tick (Left Arrow)">⏪</button>
            <button class="chronicle-ctrl-btn chronicle-btn-play" id="chronicle-btn-play" title="Play / Pause Playback (Space)">▶</button>
            <button class="chronicle-ctrl-btn" id="chronicle-btn-step-fwd" title="Step Forward 1 Tick (Right Arrow)">⏩</button>
            <button class="chronicle-ctrl-btn" id="chronicle-btn-live" title="Jump to End">⏭</button>
            <span class="chronicle-tick-indicator" id="chronicle-tick-indicator">TICK 0 / 0</span>
            <span class="chronicle-speed-chip" id="chronicle-speed-chip">1x</span>
          </div>

          <!-- Center: Ambient/Shock Event Pill -->
          <div class="chronicle-event-chip" id="chronicle-event-chip" title="Active Environmental Regime / Shock State">
            🌿 Ambient Vent Regime
          </div>

          <!-- Right: Tools Cluster -->
          <div class="chronicle-tools-cluster">
            <button class="chronicle-pill-action-btn chronicle-scope-btn" id="chronicle-btn-scope" title="Synchronized Live Circuit Oscilloscope (Hotkey: C)">
              <span>⚡</span>
              <span>Scope</span>
            </button>

            <button class="chronicle-pill-action-btn chronicle-tour-btn" id="chronicle-btn-tour" title="Launch Historical Guided Tour (Hotkey: G)">
              <span>🧭</span>
              <span>Guided Tour</span>
            </button>

            <button class="chronicle-pill-action-btn chronicle-lab-btn" id="chronicle-btn-lab" title="Launch Chronicle Analysis Lab (Hotkey: X)">
              <span>🔬</span>
              <span>Lab</span>
            </button>

            <button class="chronicle-pill-action-btn chronicle-drawer-btn" id="chronicle-btn-drawer-toggle" title="Open Stains, Overlays & Looping Drawer (Hotkey: O / Tab)">
              <span>🎛️</span>
              <span>Controls</span>
            </button>

            <button class="chronicle-pill-action-btn chronicle-zen-btn" id="chronicle-btn-zen" title="Toggle Fullscreen / Zen Mode (Hotkey: F / Z)">
              <span>⛶</span>
              <span>Zen</span>
            </button>

            <div class="chronicle-pinned-cluster">
              <button class="chronicle-pin-btn" id="chronicle-pin-btn" title="Tag Organism (Click any cell on seafloor to tag)">
                <span id="chronicle-pin-text">📌 None</span>
              </button>
              <button class="chronicle-clear-pin-btn hidden" id="chronicle-clear-pin-btn" title="Clear Tag">✕</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // 2. Slideout Control Drawer Content
    this.drawerEl.innerHTML = `
      <div class="chronicle-drawer-inner">
        <!-- Drawer Header -->
        <div class="chronicle-drawer-header">
          <div class="chronicle-drawer-title-group">
            <span style="font-size:1.15rem;">🎛️</span>
            <div>
              <div class="chronicle-drawer-title">CHRONICLE CONTROL LAB</div>
              <div class="chronicle-drawer-subtitle">Stains • Overlays • A-B Loops • Speeds</div>
            </div>
          </div>
          <button class="chronicle-drawer-close-btn" id="chronicle-drawer-close" title="Close Drawer (Esc)">✕</button>
        </div>

        <div class="chronicle-drawer-scroll-body">
          <!-- Card 0: Biological View Lenses -->
          <div class="chronicle-drawer-card">
            <div class="chronicle-card-header">🦠 BIOLOGICAL VIEW LENSES</div>
            <div class="chronicle-stains-grid">
              <button class="chronicle-lens-btn" data-lens="lattice" title="Lattice Lens: Discrete hexagonal pores, codon tapes & logic circuits">⬡ Lattice</button>
              <button class="chronicle-lens-btn" data-lens="plasmodium" title="Plasmodium Lens: Organic syncytial envelope with peristaltic contraction waves">🦠 Plasmodium</button>
              <button class="chronicle-lens-btn" data-lens="vascular" title="Vascular Ribbon: Internal cytoplasmic conduits & streaming chevrons">🧬 Vascular</button>
              <button class="chronicle-lens-btn" data-lens="potential" title="Metabolic Potential: Continuous energy and GRN field isosurface">🌌 Potential</button>
            </div>
            <div style="margin-top:6px;">
              <button class="chronicle-lens-btn active" data-lens="hybrid" style="width:100%; justify-content:center;" title="Hybrid Lens: Translucent plasmodial hull + internal vascular veining + organelle nuclei">✨ Hybrid (Metaball + Reticulum)</button>
            </div>
            <div class="chronicle-card-help">Switch organismal representation lens: atomic discrete pores vs. organic Physarum plasmodium vs. vascular ribbons.</div>
          </div>

          <!-- Card 1: Histological Stains -->
          <div class="chronicle-drawer-card">
            <div class="chronicle-card-header">🌸 HISTOLOGICAL STAINS</div>
            <div class="chronicle-stains-grid">
              <button class="chronicle-stain-btn active" data-stain="morphology" title="Morphology: Evolved Anatomical Roles & Syncytial Slime Hull">🌸 Morphology</button>
              <button class="chronicle-stain-btn" data-stain="grn" title="GRN Operons: Active Gene Regulatory Network Operon Switches">🧬 GRN Operons</button>
              <button class="chronicle-stain-btn" data-stain="vascular" title="Vascular Flux: Inter-Pore Gap Junction Transfer Rates">🩸 Vascular Flux</button>
              <button class="chronicle-stain-btn" data-stain="battery" title="Battery PMF: Chemiosmotic Proton Motive Force Gradients">🔋 Battery PMF</button>
            </div>
            <div class="chronicle-card-help">Switch optical stains to reveal tissue differentiation, GRN switches, fluid flux, or battery charge.</div>
          </div>

          <!-- Card 2: Dynamic Motility & Trophic Overlays -->
          <div class="chronicle-drawer-card">
            <div class="chronicle-card-header">👁️ DYNAMIC OVERLAYS</div>
            <div class="chronicle-toggles-grid">
              <button class="chronicle-toggle-btn active" data-toggle="trophicRays" title="Trophic Feeding Siphons & Predation Beams">⚡ Trophic Rays</button>
              <button class="chronicle-toggle-btn active" data-toggle="slimeStreaming" title="Treadmilling Forward Token Streaming Chevrons">🌊 Slime Streaming</button>
              <button class="chronicle-toggle-btn active" data-toggle="apoptosisHalos" title="Trailing-Edge Programmed Apoptosis Dissolution Halos">👻 Apoptosis Halos</button>
              <button class="chronicle-toggle-btn active" data-toggle="ghostTrails" title="Ghost Slime Centroid Path History">👣 Ghost Trails</button>
              <button class="chronicle-toggle-btn" data-toggle="speciesBadges" title="Focal Tags: Render holographic beacon pin over user-tagged organism">🏷️ Focal Tags</button>
              <button class="chronicle-toggle-btn" id="chronicle-btn-isolation" title="Lineage Isolation: Dim non-focal clades to 15% opacity to spotlight tagged organism">🎯 Lineage Isolation</button>
            </div>
          </div>

          <!-- Card 3: Continuous A-B Looping -->
          <div class="chronicle-drawer-card">
            <div class="chronicle-card-header">🔁 CONTINUOUS A-B LOOPING</div>
            <div class="chronicle-loop-row">
              <button class="chronicle-loop-btn" id="chronicle-btn-loop" title="Toggle Continuous A-B Loop Playback">🔁 Loop: OFF</button>
              <span class="chronicle-loop-range-label" id="chronicle-loop-range-label">Loop Inactive</span>
            </div>
            <div class="chronicle-loop-actions">
              <button class="chronicle-pill-btn" id="chronicle-btn-set-a" title="Set Start of Loop at Current Frame">Set A (Start)</button>
              <button class="chronicle-pill-btn" id="chronicle-btn-set-b" title="Set End of Loop at Current Frame">Set B (End)</button>
              <button class="chronicle-pill-btn" id="chronicle-btn-clear-loop" title="Reset Loop Bounds">Clear Bounds</button>
            </div>
          </div>

          <!-- Card 4: Playback Speed Multiplier -->
          <div class="chronicle-drawer-card">
            <div class="chronicle-card-header">⏩ PLAYBACK SPEED MULTIPLIER</div>
            <div class="chronicle-speed-grid">
              <button class="chronicle-pill-btn active" data-speed="1">1x</button>
              <button class="chronicle-pill-btn" data-speed="2">2x</button>
              <button class="chronicle-pill-btn" data-speed="5">5x</button>
              <button class="chronicle-pill-btn" data-speed="10">10x</button>
              <button class="chronicle-pill-btn" data-speed="20">20x</button>
            </div>
          </div>

          <!-- Card 5: Chronicle Analysis Lab -->
          <div class="chronicle-drawer-card">
            <div class="chronicle-card-header">🔬 CHRONICLE ANALYSIS LAB</div>
            <button class="chronicle-drawer-action-btn" id="chronicle-btn-open-lab-drawer" title="Deep morphometrics, GRN netlists, and thermodynamic investigation (Hotkey: X)">
              🔬 Open Chronicle Analysis Lab
            </button>
          </div>

          <!-- Card 6: Paleontological Flight Recorder Links -->
          <div class="chronicle-drawer-card">
            <div class="chronicle-card-header">🌳 EVOLUTIONARY FLIGHT RECORDER</div>
            <button class="chronicle-drawer-action-btn" id="chronicle-btn-phylo-dock" title="Open Evolutionary Phylogeny & LTEE Flight Recorder (Hotkey: P)">
              🌳 Open Phylogeny & LCA Tree
            </button>
          </div>

          <!-- Card 7: Simulation Archive & Replay (.silichronicle) -->
          <div class="chronicle-drawer-card">
            <div class="chronicle-card-header">💾 SIMULATION ARCHIVE & REPLAY</div>
            <div style="display:flex; gap:8px;">
              <button class="chronicle-drawer-action-btn" style="flex:1;" id="chronicle-btn-export-archive" title="Save complete recorded kinematics and tour stops to a .silichronicle file">
                💾 Save Archive
              </button>
              <button class="chronicle-drawer-action-btn" style="flex:1;" id="chronicle-btn-import-archive" title="Load a saved .silichronicle file for playback and analysis">
                📂 Load Archive
              </button>
            </div>
            <input type="file" id="chronicle-file-input" accept=".silichronicle,.json" style="display:none;">
            <div class="chronicle-card-help">Export or load entire historical run with all guided expedition stops and telemetry.</div>
          </div>
        </div>
      </div>
    `;

    // Cache elements
    this.scrubSlider = this.containerEl.querySelector('#chronicle-scrubber');
    this.eventPipsContainer = this.containerEl.querySelector('#chronicle-event-pips');
    this.loopTrackHighlight = this.containerEl.querySelector('#chronicle-loop-highlight');
    this.tickBadgeEl = this.containerEl.querySelector('#chronicle-tick-indicator');
    this.speedChipEl = this.containerEl.querySelector('#chronicle-speed-chip');
    this.eventBadgeEl = this.containerEl.querySelector('#chronicle-event-chip');
    this.playPauseBtn = this.containerEl.querySelector('#chronicle-btn-play');
    this.loopBtn = this.drawerEl.querySelector('#chronicle-btn-loop');
    this.loopRangeLabel = this.drawerEl.querySelector('#chronicle-loop-range-label');
    this.pinnedCladeBadge = this.containerEl.querySelector('#chronicle-pin-text');
    this.oscilloscopeEl = this.containerEl.querySelector('#chronicle-pip-oscilloscope');
    this.scopeBtnEl = this.containerEl.querySelector('#chronicle-btn-scope');
  }

  private bindEvents(): void {
    if (!this.containerEl || !this.drawerEl) return;

    // Timeline Scrubber
    this.scrubSlider?.addEventListener('mousedown', () => {
      this.isUserDraggingScrubber = true;
    });
    this.scrubSlider?.addEventListener('mouseup', () => {
      this.isUserDraggingScrubber = false;
    });
    this.scrubSlider?.addEventListener('input', (e) => {
      const idx = parseInt((e.target as HTMLInputElement).value, 10);
      this.recorder.scrubTo(idx);
      this.callbacks.onFrameChange?.(idx);
    });

    // Transport buttons
    const btnStart = this.containerEl.querySelector('#chronicle-btn-start');
    btnStart?.addEventListener('click', () => {
      this.recorder.scrubTo(0);
      this.callbacks.onFrameChange?.(0);
    });

    const btnBack = this.containerEl.querySelector('#chronicle-btn-step-back');
    btnBack?.addEventListener('click', () => {
      this.recorder.step(-1);
      this.callbacks.onFrameChange?.(this.recorder.currentFrameIndex);
    });

    this.playPauseBtn?.addEventListener('click', () => {
      if (this.recorder.isPlaying) {
        this.recorder.pause();
      } else {
        this.recorder.play();
      }
      this.updateTransportUI();
    });

    const btnFwd = this.containerEl.querySelector('#chronicle-btn-step-fwd');
    btnFwd?.addEventListener('click', () => {
      this.recorder.step(1);
      this.callbacks.onFrameChange?.(this.recorder.currentFrameIndex);
    });

    const btnLive = this.containerEl.querySelector('#chronicle-btn-live');
    btnLive?.addEventListener('click', () => {
      this.recorder.scrubTo(Math.max(0, this.recorder.getFramesCount() - 1));
      this.callbacks.onFrameChange?.(this.recorder.currentFrameIndex);
    });

    // Drawer Toggle & Backdrop
    const drawerToggleBtn = this.containerEl.querySelector('#chronicle-btn-drawer-toggle');
    drawerToggleBtn?.addEventListener('click', () => this.toggleDrawer());

    const drawerCloseBtn = this.drawerEl.querySelector('#chronicle-drawer-close');
    drawerCloseBtn?.addEventListener('click', () => this.toggleDrawer(false));

    this.drawerBackdropEl?.addEventListener('click', () => this.toggleDrawer(false));

    // Guided Tour Trigger
    const tourBtn = this.containerEl.querySelector('#chronicle-btn-tour');
    tourBtn?.addEventListener('click', () => {
      this.callbacks.onOpenTour?.();
    });

    // Zen / Fullscreen Toggle
    const zenBtn = this.containerEl.querySelector('#chronicle-btn-zen');
    zenBtn?.addEventListener('click', () => this.toggleZenMode());

    const exitZenBtn = this.zenExitPill?.querySelector('#chronicle-btn-exit-zen');
    exitZenBtn?.addEventListener('click', () => this.toggleZenMode(false));

    // Speed pills (inside drawer)
    const speedBtns = this.drawerEl.querySelectorAll('.chronicle-speed-grid .chronicle-pill-btn');
    speedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const speed = parseFloat(btn.getAttribute('data-speed') || '1');
        this.recorder.setSpeed(speed);
        speedBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (this.speedChipEl) this.speedChipEl.textContent = `${speed}x`;
      });
    });

    // A-B Loop Controls (inside drawer)
    this.loopBtn?.addEventListener('click', () => {
      this.recorder.toggleLoop();
      this.updateLoopUI();
    });

    const btnSetA = this.drawerEl.querySelector('#chronicle-btn-set-a');
    btnSetA?.addEventListener('click', () => {
      this.recorder.loopStartFrame = this.recorder.currentFrameIndex;
      if (this.recorder.loopEndFrame <= this.recorder.loopStartFrame) {
        this.recorder.loopEndFrame = Math.max(0, this.recorder.getFramesCount() - 1);
      }
      this.recorder.isLooping = true;
      this.updateLoopUI();
    });

    const btnSetB = this.drawerEl.querySelector('#chronicle-btn-set-b');
    btnSetB?.addEventListener('click', () => {
      this.recorder.loopEndFrame = this.recorder.currentFrameIndex;
      if (this.recorder.loopStartFrame >= this.recorder.loopEndFrame) {
        this.recorder.loopStartFrame = 0;
      }
      this.recorder.isLooping = true;
      this.updateLoopUI();
    });

    const btnClearLoop = this.drawerEl.querySelector('#chronicle-btn-clear-loop');
    btnClearLoop?.addEventListener('click', () => {
      this.recorder.isLooping = false;
      this.recorder.loopStartFrame = 0;
      this.recorder.loopEndFrame = Math.max(0, this.recorder.getFramesCount() - 1);
      this.updateLoopUI();
    });

    // Biological Representation Lenses (inside drawer)
    const lensBtns = this.drawerEl.querySelectorAll('.chronicle-lens-btn');
    lensBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const lens = btn.getAttribute('data-lens') as LensViewMode;
        if (lens) {
          this.recorder.setLensMode(lens);
          lensBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.callbacks.onLensChange?.(lens);
        }
      });
    });

    // Histological Stains (inside drawer)
    const stainBtns = this.drawerEl.querySelectorAll('.chronicle-stain-btn');
    stainBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const stain = btn.getAttribute('data-stain') as HistologicalStain;
        this.recorder.setStain(stain);
        stainBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.callbacks.onStainChange?.(stain);
      });
    });

    // Overlay Toggles (inside drawer)
    const toggleBtns = this.drawerEl.querySelectorAll('.chronicle-toggle-btn[data-toggle]');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const toggleKey = btn.getAttribute('data-toggle') as keyof typeof this.recorder.overlayToggles;
        if (toggleKey && this.recorder.overlayToggles[toggleKey] !== undefined) {
          this.recorder.toggleOverlay(toggleKey);
          btn.classList.toggle('active', this.recorder.overlayToggles[toggleKey]);
        }
      });
    });

    // Lineage Isolation Toggle (inside drawer)
    const isolationBtn = this.drawerEl.querySelector('#chronicle-btn-isolation');
    isolationBtn?.addEventListener('click', () => {
      this.recorder.toggleLineageIsolation();
      isolationBtn.classList.toggle('active', this.recorder.isLineageIsolation);
    });

    // Lineage Pinning (in dock bar)
    const clearPinBtn = this.containerEl.querySelector('#chronicle-clear-pin-btn');
    clearPinBtn?.addEventListener('click', () => {
      this.recorder.pinBody(null);
      this.updatePinUI();
      this.callbacks.onPinLineage?.(null);
    });

    // Phylogeny / LTEE Flight Recorder Button (inside drawer)
    const phyloDockBtn = this.drawerEl.querySelector('#chronicle-btn-phylo-dock');
    phyloDockBtn?.addEventListener('click', () => {
      this.callbacks.onOpenPhylogeny?.();
      this.toggleDrawer(false);
    });

    // Chronicle Analysis Lab Buttons
    const labDockBtn = this.containerEl.querySelector('#chronicle-btn-lab');
    labDockBtn?.addEventListener('click', () => {
      this.callbacks.onOpenLab?.();
    });

    const labDrawerBtn = this.drawerEl.querySelector('#chronicle-btn-open-lab-drawer');
    labDrawerBtn?.addEventListener('click', () => {
      this.callbacks.onOpenLab?.();
      this.toggleDrawer(false);
    });

    // Archive Export & Import
    const exportArchiveBtn = this.drawerEl.querySelector('#chronicle-btn-export-archive');
    exportArchiveBtn?.addEventListener('click', () => {
      this.callbacks.onExportArchive?.();
    });

    const importArchiveBtn = this.drawerEl.querySelector('#chronicle-btn-import-archive');
    const fileInput = this.drawerEl.querySelector('#chronicle-file-input') as HTMLInputElement | null;
    importArchiveBtn?.addEventListener('click', () => {
      fileInput?.click();
    });

    fileInput?.addEventListener('change', (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        this.callbacks.onImportArchive?.(files[0]);
        // Reset file input value so same file can be reloaded if needed
        fileInput.value = '';
      }
    });

    // Synchronized Live Circuit Oscilloscope Toggle
    this.scopeBtnEl?.addEventListener('click', () => this.toggleOscilloscope());

    this.oscilloscopeEl?.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('#chronicle-scope-close-btn')) {
        this.toggleOscilloscope(false);
      }
    });

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => {
        if (!this.isVisible) return;
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

        if (e.key === 'c' || e.key === 'C') {
          this.toggleOscilloscope();
        }
      });
    }
  }

  public show(): void {
    this.isVisible = true;
    this.containerEl?.classList.remove('hidden');
    this.updateTransportUI();
    this.updateLoopUI();
    this.updatePinUI();
    this.rebuildEventPips();
  }

  public hide(): void {
    this.isVisible = false;
    this.containerEl?.classList.add('hidden');
    this.toggleDrawer(false);
    this.toggleZenMode(false);
    this.toggleOscilloscope(false);
    this.recorder.pause();
  }

  public isOpen(): boolean {
    return this.isVisible;
  }

  public toggleDrawer(open?: boolean): void {
    if (!this.drawerEl) return;
    this.isDrawerOpen = open !== undefined ? open : !this.isDrawerOpen;

    if (this.isDrawerOpen) {
      this.drawerEl.classList.remove('hidden');
      this.drawerEl.classList.add('open');
      this.drawerBackdropEl?.classList.remove('hidden');
    } else {
      this.drawerEl.classList.remove('open');
      this.drawerBackdropEl?.classList.add('hidden');
      setTimeout(() => {
        if (!this.isDrawerOpen) {
          this.drawerEl?.classList.add('hidden');
        }
      }, 250);
    }
  }

  public isDrawerActive(): boolean {
    return this.isDrawerOpen;
  }

  public toggleZenMode(enabled?: boolean): void {
    this.isZenMode = enabled !== undefined ? enabled : !this.isZenMode;
    document.body.classList.toggle('chronicle-zen-mode', this.isZenMode);

    if (this.isZenMode) {
      this.toggleDrawer(false);
      this.zenExitPill?.classList.remove('hidden');
    } else {
      this.zenExitPill?.classList.add('hidden');
    }
  }

  public isZenActive(): boolean {
    return this.isZenMode;
  }

  public toggleOscilloscope(enabled?: boolean): void {
    this.isOscilloscopeOpen = enabled !== undefined ? enabled : !this.isOscilloscopeOpen;
    if (this.oscilloscopeEl) {
      this.oscilloscopeEl.classList.toggle('hidden', !this.isOscilloscopeOpen);
    }
    if (this.scopeBtnEl) {
      this.scopeBtnEl.classList.toggle('active', this.isOscilloscopeOpen);
    }
    if (this.isOscilloscopeOpen) {
      this.renderOscilloscopeContent(this.recorder.getCurrentFrame());
    }
  }

  public isOscilloscopeActive(): boolean {
    return this.isOscilloscopeOpen;
  }

  public pinClade(cladeId: string | null): void {
    this.recorder.pinLineage(cladeId);
    this.updatePinUI();
  }

  public pinBody(bodyId: string | null, cladeId?: string | null): void {
    this.recorder.pinBody(bodyId);
    if (!bodyId && cladeId) {
      this.recorder.pinLineage(cladeId);
    }
    this.updatePinUI();
  }

  /**
   * Called every animation frame to synchronize the slider, badges, and loop highlight.
   */
  public update(): void {
    if (!this.isVisible || !this.containerEl) return;

    const totalFrames = this.recorder.getFramesCount();
    const currentFrame = this.recorder.getCurrentFrame();
    const currIndex = this.recorder.currentFrameIndex;

    // 1. Update Scrubber limits & value
    if (this.scrubSlider) {
      this.scrubSlider.max = `${Math.max(0, totalFrames - 1)}`;
      if (!this.isUserDraggingScrubber) {
        this.scrubSlider.value = `${currIndex}`;
      }
    }

    // 2. Update Tick Indicator
    if (this.tickBadgeEl) {
      const curTick = currentFrame ? currentFrame.tick : 0;
      this.tickBadgeEl.textContent = `TICK #${curTick.toLocaleString()} (Frame ${currIndex + 1}/${totalFrames})`;
    }

    // 3. Update Environmental Event Banner Chip
    if (this.eventBadgeEl) {
      if (currentFrame && currentFrame.environmentalEvent) {
        this.eventBadgeEl.textContent = currentFrame.environmentalEvent;
        this.eventBadgeEl.classList.add('active-shock');
      } else {
        this.eventBadgeEl.textContent = '🌿 Ambient Vent Regime';
        this.eventBadgeEl.classList.remove('active-shock');
      }
    }

    // 4. Update Play/Pause button icon
    this.updateTransportUI();

    // 5. Update Loop Region Highlight Bar
    if (this.loopTrackHighlight && totalFrames > 1 && this.recorder.isLooping) {
      const leftPct = (this.recorder.loopStartFrame / (totalFrames - 1)) * 100;
      const widthPct = Math.max(1, ((this.recorder.loopEndFrame - this.recorder.loopStartFrame) / (totalFrames - 1)) * 100);
      this.loopTrackHighlight.style.display = 'block';
      this.loopTrackHighlight.style.left = `${leftPct}%`;
      this.loopTrackHighlight.style.width = `${widthPct}%`;
    } else if (this.loopTrackHighlight) {
      this.loopTrackHighlight.style.display = 'none';
    }

    // 6. Update Synchronized PiP Live Circuit Oscilloscope
    if (this.isOscilloscopeOpen && this.oscilloscopeEl) {
      this.renderOscilloscopeContent(currentFrame);
    }
  }

  public rebuildEventPips(): void {
    if (!this.eventPipsContainer) return;
    const allFrames = this.recorder.getAllFrames();
    const count = allFrames.length;
    if (count <= 1) {
      this.eventPipsContainer.innerHTML = '';
      return;
    }

    interface IPipItem {
      frameIndex: number;
      pct: number;
      tip: string;
      icon: string;
      track: 'logic' | 'trophic' | 'symbiosis' | 'chelation' | 'shock';
    }

    const rawPips: IPipItem[] = [];
    const step = Math.max(1, Math.floor(count / 300));
    for (let i = 0; i < count; i += step) {
      const f = allFrames[i];
      const pct = (i / (count - 1)) * 100;

      // Track 1: 🌋 Geodynamic Shocks
      if (f.environmentalEvent) {
        let icon = '⚡';
        const tip = f.environmentalEvent;
        if (tip.includes('Boiling') || tip.includes('Thermal')) icon = '🌋';
        else if (tip.includes('Precursor')) icon = '⚠️';
        else if (tip.includes('Toxin') || tip.includes('Metal')) icon = '🧪';
        else if (tip.includes('Trench') || tip.includes('Wave')) icon = '🌊';

        rawPips.push({ frameIndex: i, pct, tip: `Geodynamic Shock: ${tip}`, icon, track: 'shock' });
      }

      // Track 2: 🩸 Predation & Kleptoplasty Strikes
      const trophicStrike = f.trophicRays.find(r => r.type === 'predation' || r.type === 'kleptoplasty');
      if (trophicStrike) {
        const isKlepto = trophicStrike.type === 'kleptoplasty';
        rawPips.push({
          frameIndex: i,
          pct,
          tip: isKlepto ? `Kleptoplasty Siphon (${trophicStrike.energy.toFixed(1)} E)` : `Predation Strike (${trophicStrike.energy.toFixed(1)} E)`,
          icon: isKlepto ? '🧬' : '🩸',
          track: 'trophic'
        });
      }

      // Track 3: 🔋 Symbiogenesis & Syntrophic Cross-Feeding
      const syntrophyRay = f.trophicRays.find(r => r.type === 'syntrophy');
      const chimericBody = f.bodies.find(b => b.cladeId.startsWith('chimeric-') || b.cells.some(c => c.hasOrganelle));
      if (syntrophyRay || chimericBody) {
        rawPips.push({
          frameIndex: i,
          pct,
          tip: chimericBody ? `Symbiogenesis: Endosymbiont (${chimericBody.speciesName})` : `Syntrophic Cross-Feeding`,
          icon: '🔋',
          track: 'symbiosis'
        });
      }

      // Track 4: ⛏️ Bio-Terraforming Chelation & Mineral Leaching
      const chelationRay = f.trophicRays.find(r => r.type === 'chelation');
      const chelatorBody = f.bodies.find(b => b.cells.some(c => (c.chelator ?? 0) > 0.1 || (c.eps ?? 0) > 0.1));
      if (chelationRay || chelatorBody) {
        rawPips.push({
          frameIndex: i,
          pct,
          tip: 'Bio-Terraforming Mineral Leaching & Biofilm Chelation',
          icon: '⛏️',
          track: 'chelation'
        });
      }

      // Track 5: 🧠 GRN Logic Breakthroughs
      const logicCell = f.bodies.flatMap(b => b.cells).find(c => c.gateCount >= 3);
      if (logicCell) {
        rawPips.push({
          frameIndex: i,
          pct,
          tip: `Logic Circuit Complexity: ${logicCell.gateCount} Gates (${logicCell.roleName || 'GRN'})`,
          icon: '🧠',
          track: 'logic'
        });
      }
    }

    if (rawPips.length === 0) {
      this.eventPipsContainer.innerHTML = '';
      return;
    }

    // Cluster pips that lie within <= 2.0% timeline distance
    const clusters: IPipItem[][] = [];
    let currentCluster: IPipItem[] = [rawPips[0]];

    for (let i = 1; i < rawPips.length; i++) {
      const pip = rawPips[i];
      if (pip.pct - currentCluster[0].pct <= 2.0) {
        currentCluster.push(pip);
      } else {
        clusters.push(currentCluster);
        currentCluster = [pip];
      }
    }
    clusters.push(currentCluster);

    let pipsHtml = '';
    for (const cluster of clusters) {
      const firstPip = cluster[0];
      const avgPct = cluster.reduce((sum, p) => sum + p.pct, 0) / cluster.length;
      if (cluster.length === 1) {
        pipsHtml += `<div class="chronicle-event-pip pip-${firstPip.track}" data-frame="${firstPip.frameIndex}" style="left:${firstPip.pct.toFixed(2)}%; cursor:pointer;" title="Frame ${firstPip.frameIndex}: ${firstPip.tip}">${firstPip.icon}</div>`;
      } else {
        const uniqueIcons = Array.from(new Set(cluster.map(p => p.icon))).join('');
        const tooltip = `Milestone Cluster (${cluster.length} events):\n` + cluster.map(p => `• Frame ${p.frameIndex}: [${p.track.toUpperCase()}] ${p.tip}`).join('\n');
        pipsHtml += `<div class="chronicle-event-pip pip-cluster" data-frame="${firstPip.frameIndex}" style="left:${avgPct.toFixed(2)}%; cursor:pointer;" title="${tooltip}">${uniqueIcons}×${cluster.length}</div>`;
      }
    }
    this.eventPipsContainer.innerHTML = pipsHtml;

    // Attach click handlers to pips so clicking scrubs directly to the event frame
    this.eventPipsContainer.querySelectorAll('.chronicle-event-pip').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const fIdx = parseInt((el as HTMLElement).dataset.frame || '0', 10);
        this.recorder.scrubTo(fIdx);
        this.update();
        this.callbacks.onFrameChange?.(fIdx);
      });
    });
  }

  private renderOscilloscopeContent(frame: import('../engine/kinematics/ColonyKinematicsRecorder.js').IKinematicFrame | null): void {
    if (!this.oscilloscopeEl) return;
    if (!frame || frame.bodies.length === 0) {
      this.oscilloscopeEl.innerHTML = `
        <div class="scope-header">
          <div class="scope-title-group">
            <span style="font-size:1.1rem;">⚡</span>
            <div>
              <div class="scope-title">Live Circuit Oscilloscope</div>
              <div class="scope-subtitle">TICK #${frame ? frame.tick : 0} • Awaiting Silicoids</div>
            </div>
          </div>
          <button class="scope-close-btn" id="chronicle-scope-close-btn" title="Close Scope (C)">✕</button>
        </div>
        <div class="scope-empty">
          <div style="font-size:1.4rem; margin-bottom:6px;">⚡</div>
          <div>No living silicoids in current kinematic frame.</div>
          <div style="font-size:0.75rem; color:#64748b; margin-top:4px;">Scrub to a populated epoch or start playback.</div>
        </div>
      `;
      return;
    }

    // 1. Locate Target Body & Cell
    let targetBody = frame.bodies[0];
    if (this.recorder.pinnedBodyId) {
      const found = frame.bodies.find(b => b.bodyId === this.recorder.pinnedBodyId);
      if (found) targetBody = found;
    } else if (this.recorder.pinnedLineageId) {
      const found = frame.bodies.find(b => b.cladeId === this.recorder.pinnedLineageId);
      if (found) targetBody = found;
    } else {
      let maxGates = -1;
      for (const b of frame.bodies) {
        for (const c of b.cells) {
          if (c.gateCount > maxGates) {
            maxGates = c.gateCount;
            targetBody = b;
          }
        }
      }
    }

    const targetCell = targetBody.cells.reduce((best, c) => c.gateCount > best.gateCount ? c : best, targetBody.cells[0]);
    if (!targetCell) return;

    // 2. Evaluate GRN circuit in authentic AST physics
    const ws = PoreWorkshop.fromBitstring(targetCell.tapeBitstring);
    const streamA = frame.vent.streamA;
    const streamB = frame.vent.streamB;
    const toxinT = frame.vent.toxinT;
    const streamC = frame.vent.thermalFlux > 0.4;
    const streamD = frame.vent.thermalFlux > 0.6;
    const photonIr = frame.vent.thermalFlux > 0.7;
    const baroAcoustic = frame.vent.conduitChoking > 0.5;
    const mechanoTouch = (targetCell.chelator ?? 0) > 0.1 || (targetCell.eps ?? 0) > 0.1 || targetBody.cells.length > 1;
    const electroRedox = frame.vent.precursorWarning;

    ws.stepTick({
      streamA,
      streamB,
      toxinT,
      batteryVoltage: 50,
      streamC,
      streamD,
      photonIr,
      baroAcoustic,
      mechanoTouch,
      electroRedox
    });

    const builtGates = ws.getBuiltGates();
    const operons = ws.getOperons();
    const opStates = ws.getOperonStates();
    const motifs = MotifScanner.scanWorkshop(ws).map(m => m.motif.type);

    // 3. Render 9 Sensory LEDs
    const leds = [
      { name: 'STR-A', val: streamA, hasPore: ws.hasPorinA() },
      { name: 'STR-B', val: streamB, hasPore: ws.hasPorinB() },
      { name: 'STR-C', val: streamC, hasPore: ws.hasStreamC() },
      { name: 'STR-D', val: streamD, hasPore: ws.hasStreamD() },
      { name: 'TOX-T', val: toxinT, hasPore: ws.hasPorinT() },
      { name: 'IR-FLX', val: photonIr, hasPore: ws.hasPhotonIr() },
      { name: 'BARO', val: baroAcoustic, hasPore: ws.hasBaroAcoustic() },
      { name: 'TOUCH', val: mechanoTouch, hasPore: ws.hasMechanoTouch() },
      { name: 'REDOX', val: electroRedox, hasPore: ws.hasElectroRedox() }
    ];

    const ledsHtml = leds.map(led => {
      let dotClass = '';
      if (led.val && led.hasPore) {
        dotClass = led.name === 'TOX-T' ? 'red' : 'on';
      } else if (led.val && !led.hasPore) {
        dotClass = 'amber';
      }
      const title = `${led.name}: Field=${led.val ? 'HIGH' : 'LOW'} | Receptor=${led.hasPore ? 'EXPRESSED' : 'ABSENT'}`;
      return `
        <div class="scope-led-item" title="${title}">
          <div class="scope-led-dot ${dotClass}"></div>
          <span class="scope-led-label">${led.name}</span>
        </div>
      `;
    }).join('');

    // 4. Render Gates Table
    let gatesHtml = '';
    if (builtGates.length === 0) {
      gatesHtml = `<div class="scope-no-gates" style="font-size:0.68rem; color:#64748b; padding:8px 4px; text-align:center;">No logic gates expressed. Basal membrane transport.</div>`;
    } else {
      gatesHtml = builtGates.map((gate, idx) => {
        const inA = gate.boundTerminalA ? gate.boundTerminalA.replace('PORIN_', '') : (idx > 0 ? `G${idx - 1}` : 'VCC');
        const inB = gate.boundTerminalB ? gate.boundTerminalB.replace('PORIN_', '') : 'STACK';
        const typeStr = gate.type.replace('GATE_', '');
        const outBadge = gate.output
          ? `<span class="scope-out-high">1 (HIGH)</span>`
          : `<span class="scope-out-low">0 (LOW)</span>`;
        const analog = (gate.analogOutput ?? (gate.output ? 1.0 : 0.0)).toFixed(2);
        return `
          <div class="scope-gate-row">
            <span class="scope-gate-tag">G${idx}: ${typeStr}</span>
            <span class="scope-gate-inputs">In: [${inA}, ${inB}]</span>
            <span>SNM: ${analog}V</span>
            ${outBadge}
          </div>
        `;
      }).join('');
    }

    // 5. Operon and Effector Switches
    const operonHtml = operons.length > 0
      ? operons.map((_op, idx) => {
          const isExpr = opStates[idx] !== false;
          return `<span class="scope-switch-chip ${isExpr ? 'active' : ''}">OP${idx}: ${isExpr ? 'ACTIVE' : 'OFF'}</span>`;
        }).join('')
      : '<span class="scope-switch-chip">OP: Constitutive</span>';

    const sinksHtml = [
      `<span class="scope-switch-chip ${ws.hasBattery() ? 'active' : ''}">🔋 PMF: ${ws.hasBattery() ? '+2E' : '0E'}</span>`,
      `<span class="scope-switch-chip ${ws.hasSeptum() ? 'active' : ''}">🧬 Septum: ${ws.hasSeptum() ? 'ON' : 'OFF'}</span>`,
      `<span class="scope-switch-chip ${ws.hasChelator() ? 'active' : ''}">⛏️ Chelator: ${ws.hasChelator() ? 'ON' : 'OFF'}</span>`,
      `<span class="scope-switch-chip ${ws.hasEps() ? 'active' : ''}">🛡️ EPS: ${ws.hasEps() ? 'ON' : 'OFF'}</span>`
    ].join('');

    const motifBadges = motifs.length > 0
      ? motifs.map(m => `<span style="font-size:0.60rem; padding:1px 5px; border-radius:4px; background:rgba(168,85,247,0.25); border:1px solid #c084fc; color:#e9d5ff;">🏆 ${m}</span>`).join(' ')
      : '';

    this.oscilloscopeEl.innerHTML = `
      <div class="scope-header">
        <div class="scope-title-group">
          <span style="font-size:1.1rem;">⚡</span>
          <div>
            <div class="scope-title">${targetBody.speciesName || 'Silicoid'} • ${targetCell.roleGlyph} ${targetCell.roleName}</div>
            <div class="scope-subtitle">Body #${targetBody.bodyId.slice(0, 10)} • Clade: ${targetBody.cladeId.slice(0, 8)} • Tick #${frame.tick}</div>
          </div>
        </div>
        <button class="scope-close-btn" id="chronicle-scope-close-btn" title="Close Scope (Hotkey: C)">✕</button>
      </div>

      <!-- 9 Sensory Porin Field LEDs -->
      <div class="scope-leds-bar">
        ${ledsHtml}
      </div>

      <!-- GRN Gates Netlist & Live Truth States -->
      <div class="scope-gates-table">
        ${gatesHtml}
      </div>

      <!-- Operon Switches & Effector Sinks -->
      <div class="scope-switches-row">
        ${operonHtml}
        ${sinksHtml}
      </div>

      <!-- Motifs, Battery & Landauer Accounting -->
      <div class="scope-metrics-bar">
        <span>PMF: <strong>${targetCell.energy.toFixed(1)} / 20.0</strong></span>
        <span>Matter: <strong>${targetCell.matter.toFixed(1)}</strong></span>
        <span>Primary: <strong style="color:${targetCell.primaryActive ? '#34d399' : '#f87171'}">${targetCell.primaryActive ? 'ACTIVE' : 'OFF'}</strong></span>
        ${motifBadges}
      </div>
    `;
  }

  private updateTransportUI(): void {
    if (!this.playPauseBtn) return;
    if (this.recorder.isPlaying) {
      this.playPauseBtn.innerHTML = '⏸';
      this.playPauseBtn.classList.add('playing');
      this.playPauseBtn.title = 'Pause Playback (Space)';
    } else {
      this.playPauseBtn.innerHTML = '▶';
      this.playPauseBtn.classList.remove('playing');
      this.playPauseBtn.title = 'Play Playback (Space)';
    }
  }

  private updateLoopUI(): void {
    if (!this.loopBtn || !this.loopRangeLabel) return;
    if (this.recorder.isLooping) {
      this.loopBtn.innerHTML = '🔁 Loop: ON';
      this.loopBtn.classList.add('active');
      this.loopRangeLabel.textContent = `A: ${this.recorder.loopStartFrame} | B: ${this.recorder.loopEndFrame}`;
    } else {
      this.loopBtn.innerHTML = '🔁 Loop: OFF';
      this.loopBtn.classList.remove('active');
      this.loopRangeLabel.textContent = 'Loop Inactive';
    }
  }

  private updatePinUI(): void {
    const pinText = this.pinnedCladeBadge || this.containerEl?.querySelector('#chronicle-pin-text');
    const clearBtn = this.containerEl?.querySelector('#chronicle-clear-pin-btn');
    const isolationBtn = this.drawerEl?.querySelector('#chronicle-btn-isolation');
    if (isolationBtn) {
      isolationBtn.classList.toggle('active', this.recorder.isLineageIsolation);
    }
    if (!pinText || !clearBtn) return;

    if (this.recorder.pinnedBodyId) {
      pinText.textContent = `📌 Tagged: ${this.recorder.pinnedBodyId}`;
      clearBtn.classList.remove('hidden');
    } else if (this.recorder.pinnedLineageId) {
      pinText.textContent = `📌 Clade: ${this.recorder.pinnedLineageId.slice(0, 10)}...`;
      clearBtn.classList.remove('hidden');
    } else {
      pinText.textContent = '📌 None';
      clearBtn.classList.add('hidden');
    }
  }

  public setLens(lens: LensViewMode): void {
    if (!this.drawerEl) return;
    const lensBtns = this.drawerEl.querySelectorAll('.chronicle-lens-btn');
    lensBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-lens') === lens);
    });
  }

  public setStain(stain: HistologicalStain): void {
    if (!this.drawerEl) return;
    const stainBtns = this.drawerEl.querySelectorAll('.chronicle-stain-btn');
    stainBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-stain') === stain);
    });
  }
}
