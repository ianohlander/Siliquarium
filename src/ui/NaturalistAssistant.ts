/**
 * 🐠 Siliquarium UI Subsystem
 * NaturalistAssistant: In-App Darwinian Naturalist & Seafloor Evolutionary Guide (V2).
 * 
 * An authentic Natural History Field Guide and Darwinian interpretive companion.
 * Integrates dynamic exemplar discovery across all 10 emergent phenomena,
 * cellular differentiation recognition (clonal genomes with spatial division of labor),
 * an interactive multi-stage Guided Safari with in-situ floating Field Scope HUD,
 * a 3-column Cybernetic Triad layout (Macro Novelties ↔ Micro In-Situ Autopsy ↔ Selective Barriers),
 * deep-linking to primary circuit dossiers (specimen_01..10.html), and actionable
 * ecological stewardship interventions connected directly to the God-Suite engine.
 */

import { SimulationWorld } from '../engine/SimulationWorld.js';
import { ISimulationTelemetry, IPoreTelemetry } from '../engine/SimulationTelemetry.js';
import { HexCoord3D } from '../core/spatial/HexCoord3D.js';
import { TaxonomyNomenclature } from '../core/paleontology/TaxonomyNomenclature.js';
import { MotifType } from '../core/paleontology/NetworkMotif.js';
import { IBarrierDiagnostic } from '../engine/paleontology/EvolutionaryHistoryExporter.js';
import { GeologicalEventType } from '../engine/environment/GeologicalPressuresEngine.js';
import { SimulationLoop } from '../engine/SimulationLoop.js';
import { BioBank } from '../engine/storage/BioBank.js';
import { GlossaryModal } from './GlossaryModal.js';
import { AudioSynthesizer } from './AudioSynthesizer.js';

export type FocusCoordFn = (coord: HexCoord3D) => void;

export type NaturalistCategory = 'all' | 'super' | 'trophic' | 'circuit';

export interface INaturalistExemplar {
  readonly id: string;
  readonly category: 'super' | 'trophic' | 'circuit';
  readonly badge: string;
  readonly badgeColor: string;
  readonly title: string;
  readonly subtitle: string;
  readonly coord: HexCoord3D;
  readonly naturalFunction: string;
  readonly ecologicalRole: string;
  readonly battery: number;
  readonly matter: number;
  readonly generation: number;
  readonly age: number;
  readonly catalyticYield: number;
  readonly landauerCost: number;
  readonly dossierUrl: string;
  readonly citation: string;
  readonly fieldMarks: readonly string[];
}

export class EpistemicDossierRegistry {
  private static readonly MOTIF_DOSSIERS: Record<string, string> = {
    BISTABLE_LATCH: 'docs/paleontology/specimen_01_bistable_latch.html',
    RING_OSCILLATOR: 'docs/paleontology/specimen_02_repressilator.html',
    COHERENT_FFL: 'docs/paleontology/specimen_03_coherent_ffl.html',
    INCOHERENT_FFL: 'docs/paleontology/specimen_04_incoherent_ffl.html',
    NEGATIVE_AUTOREGULATION: 'docs/paleontology/specimen_05_negative_autoregulation.html',
    HALF_ADDER: 'docs/paleontology/specimen_06_binary_half_adder.html',
    INVERTER_NOT: 'docs/paleontology/specimen_07_allosteric_inverter.html',
    ENDOSYMBIONT_EMERGENCE: 'docs/paleontology/specimen_08_endosymbiotic_cassette.html',
    SYNCYTIAL_MULTICELLULARITY: 'docs/paleontology/specimen_09_syncytial_multicellularity.html',
    PELAGIC_SPORULATION_EMERGENCE: 'docs/paleontology/specimen_10_pelagic_sporulation.html',
    VENT_FEEDER: 'docs/paleontology/specimen_11_chemiosmotic_autotroph.html',
    BASALT_LITHOTROPH: 'docs/paleontology/specimen_12_basalt_lithotroph.html',
    TROPHIC_PREDATOR: 'docs/paleontology/specimen_13_trophic_predator.html',
    DETRITAL_SCAVENGER: 'docs/paleontology/specimen_14_detrital_scavenger.html',
    OLDEST_LINEAGE: 'docs/paleontology/specimen_15_patriarch_lineage.html',
    TEMPORAL_DERIVATIVE_CHEMOTAXIS: 'docs/paleontology/specimen_16_temporal_derivative_chemotaxis.html',
    PREDICTIVE_PAVLOVIAN: 'docs/paleontology/specimen_17_predictive_pavlovian.html',
    ENTRAINED_PACEMAKER: 'docs/paleontology/specimen_18_entrained_pacemaker.html',
    STEINER_VASCULAR_NETWORK: 'docs/paleontology/specimen_19_steiner_vascular_network.html',
    CRYPTOBIOTIC_DORMANCY_CLAMP: 'docs/paleontology/specimen_20_cryptobiotic_dormancy_clamp.html',
    LENSKI_CIT_BREAKTHROUGH: 'docs/paleontology/specimen_21_citratovibrio_lenskii.html',
    MINERAL_CHELATION_DISCOVERY: 'docs/paleontology/specimen_22_siderococcus_neilsonii.html',
    BIOFILM_EPS_SHIELD: 'docs/paleontology/specimen_23_biofilmocladus_costertonii.html',
    SYNTROPHIC_CROSS_FEEDING: 'docs/paleontology/specimen_24_syntrophobacter_westii.html',
    DIRECT_ELECTRON_TRANSFER: 'docs/paleontology/specimen_25_electrosarcina_lovleyi.html',
    VAMPIRIC_KLEPTOPLASTY: 'docs/paleontology/specimen_26_vampirotheke_schnepfii.html'
  };

  public static getDossierUrl(motifType: string): string {
    return this.MOTIF_DOSSIERS[motifType] ?? 'docs/CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.html';
  }

  public static getUserGuideUrl(anchor?: string): string {
    return anchor ? `docs/USER_GUIDE.html#${anchor}` : 'docs/USER_GUIDE.html';
  }
}

export class NaturalistAssistant {
  private readonly world: SimulationWorld;
  private readonly onFocusCoord?: FocusCoordFn;
  private readonly loop?: SimulationLoop;
  private containerEl: HTMLElement | null = null;
  private fieldScopeEl: HTMLElement | null = null;
  private toastEl: HTMLElement | null = null;
  private isOpen: boolean = false;
  private wasRunningBeforeOpen: boolean = false;
  private lastRenderedTick: number = -1;
  private currentTelemetry?: ISimulationTelemetry;
  private selectedPore?: IPoreTelemetry | null = null;
  private lastKnownPredatorCoord: HexCoord3D | null = null;
  private lastKnownScavengerCoord: HexCoord3D | null = null;

  private activeExemplars: INaturalistExemplar[] = [];
  private activeCategory: NaturalistCategory = 'all';
  private currentSafariIndex: number = -1;
  private currentScopeExemplar: INaturalistExemplar | null = null;
  private safariSpecimenListeners: ((exemplar: INaturalistExemplar, tele: ISimulationTelemetry, skipFlyTo?: boolean) => void)[] = [];
  private autoTourTimer: number | null = null;
  private isAutoTouring: boolean = false;
  private onRequestModeChange?: (mode: 'observatory' | 'safari' | 'laboratory' | 'studio') => void;
  private onRoleHighlightSelected?: (roleName: string | null) => void;
  private onMuteToggled?: (muted: boolean) => void;
  private currentColonyRoles: string[] = [];
  private activeRoleHighlightName: string | null = null;
  private muteNonSpecificRoles: boolean = true;

  public onRoleHighlight(cb: (roleName: string | null) => void): void {
    this.onRoleHighlightSelected = cb;
  }

  public onMuteToggle(cb: (muted: boolean) => void): void {
    this.onMuteToggled = cb;
  }

  public isMuteNonSpecificRoles(): boolean {
    return this.muteNonSpecificRoles;
  }

  public toggleMuteNonSpecificRoles(): boolean {
    this.muteNonSpecificRoles = !this.muteNonSpecificRoles;
    this.updateMuteToggleBtnUI();
    this.onMuteToggled?.(this.muteNonSpecificRoles);
    this.showToast(this.muteNonSpecificRoles ? '👁️ Non-specific tissue muting: ACTIVE' : '👁️ Non-specific tissue muting: OFF (All cells visible)');
    return this.muteNonSpecificRoles;
  }

  public updateMuteToggleBtnUI(): void {
    const btn = document.getElementById('safari-role-mute-toggle') as HTMLButtonElement | null;
    if (btn) {
      btn.textContent = this.muteNonSpecificRoles ? 'Muting: ON' : 'Muting: OFF';
      btn.style.color = this.muteNonSpecificRoles ? '#38bdf8' : '#94a3b8';
      btn.style.borderColor = this.muteNonSpecificRoles ? 'rgba(56,189,248,0.5)' : '#334155';
    }
  }

  public selectRoleHighlight(roleName: string | null): void {
    this.activeRoleHighlightName = roleName;
    const rolesList = document.getElementById('safari-copilot-roles-list');
    if (rolesList) {
      rolesList.querySelectorAll('.safari-role-pill').forEach(p => {
        const roleAttr = p.getAttribute('data-role');
        const match = roleName ? (roleAttr === roleName) : (roleAttr === '__all__');
        if (match) p.classList.add('active');
        else p.classList.remove('active');
      });
    }
    const clearBtn = document.getElementById('safari-role-clear-btn') as HTMLElement | null;
    if (clearBtn) {
      clearBtn.style.display = roleName ? 'inline-flex' : 'none';
    }
    this.onRoleHighlightSelected?.(roleName);
    if (roleName) {
      this.showToast(`🌾 Isolated Role: ${roleName} (Non-specific cells ${this.muteNonSpecificRoles ? 'muted' : 'visible'})`);
    } else {
      this.showToast('👁️ Role Isolation Cleared (All colony cells visible)');
    }
  }

  public selectRoleHighlightByIndex(index: number): void {
    if (index >= 0 && index < this.currentColonyRoles.length) {
      const target = this.currentColonyRoles[index];
      if (this.activeRoleHighlightName === target) {
        this.selectRoleHighlight(null);
      } else {
        this.selectRoleHighlight(target);
      }
    } else if (index === -1) {
      this.selectRoleHighlight(null);
    }
  }

  public cycleRoleHighlight(direction: number = 1): void {
    if (this.currentColonyRoles.length === 0) return;
    const curIdx = this.activeRoleHighlightName ? this.currentColonyRoles.indexOf(this.activeRoleHighlightName) : -1;
    let nextIdx: number;
    if (curIdx === -1) {
      nextIdx = direction > 0 ? 0 : this.currentColonyRoles.length - 1;
    } else {
      nextIdx = curIdx + direction;
      if (nextIdx >= this.currentColonyRoles.length) nextIdx = -1; // Deselect on wrapping past end
      else if (nextIdx < 0) nextIdx = this.currentColonyRoles.length - 1;
    }

    const targetRole = nextIdx >= 0 ? this.currentColonyRoles[nextIdx] : null;
    this.selectRoleHighlight(targetRole);
  }

  public getActiveRoleHighlight(): string | null {
    return this.activeRoleHighlightName;
  }

  private lastRenderTime: number = 0;
  private readonly RENDER_THROTTLE_MS: number = 750; // Update open modal at most every 750ms

  constructor(world: SimulationWorld, onFocusCoord?: FocusCoordFn, loop?: SimulationLoop) {
    this.world = world;
    this.onFocusCoord = onFocusCoord;
    this.loop = loop;
    this.ensureElements();
    this.bindEvents();
    this.loop?.onStateChange((running) => this.syncSimulationRunningUI(running));
  }

  private ensureElements(): void {
    // 1. Master Modal Container
    let modal = document.getElementById('naturalist-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'naturalist-modal';
      modal.className = 'naturalist-modal-container hidden';
      modal.innerHTML = `
        <div class="naturalist-modal-backdrop" id="naturalist-backdrop"></div>
        <div class="naturalist-modal-card">
          <!-- Modal Header -->
          <div class="naturalist-header">
            <div class="naturalist-header-left">
              <span class="naturalist-icon">✨</span>
              <div>
                <h2 class="naturalist-title">SEAFLOOR NATURALIST &amp; EVOLUTIONARY GUIDE</h2>
                <div class="naturalist-subtitle">Intelligent Structural Analysis • Milestone Interpreter • Seafloor Tour Guide</div>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              <button id="naturalist-pause-btn" class="tour-btn" style="border-color:#f59e0b;color:#f59e0b;padding:4px 10px;font-weight:bold;cursor:pointer;" title="Pause or Resume simulation while exploring (prevents missing evolutionary discoveries • Hotkey: Space)">
                <span id="naturalist-pause-icon">⏸️</span>
                <span id="naturalist-pause-label">PAUSED</span>
              </button>
              <a href="docs/USER_GUIDE.html" target="_blank" rel="noopener noreferrer" class="tour-btn" style="text-decoration:none;border-color:rgba(56,189,248,0.5);color:#38bdf8;" title="Open comprehensive user guide &amp; visual decoder">
                📖 User Guide &amp; Decoder ↗
              </a>
              <button id="naturalist-close-btn" class="drawer-close-btn" title="Close Naturalist Guide (Hotkey: Esc or A)">
                <span>✕</span>
                <span>CLOSE</span>
              </button>
            </div>
          </div>

          <!-- Quick Seafloor Tour Navigator Hub -->
          <div class="naturalist-tour-bar" id="naturalist-tour-hub">
            <!-- Dynamically populated tour controls -->
          </div>

          <!-- Master 3-Column Cybernetic Triad Grid -->
          <div class="naturalist-content-grid">
            <!-- Column 1: Macro Phenotypes & Novelties (The Evolved Biosphere) -->
            <div class="naturalist-col">
              <div class="naturalist-card-title" style="display:flex;align-items:center;justify-content:space-between;">
                <span>🌟 Macro Phenotypes (Biosphere)</span>
                <span id="novelties-count-badge" style="font-size:0.65rem;color:#a855f7;">0 Active</span>
              </div>
              <div id="naturalist-novelties-list" class="naturalist-card-scroll">
                <!-- Dynamically generated novelties -->
              </div>
            </div>

            <!-- Column 2: Micro In-Situ Autopsy (The Catalytic Workshop Engine) -->
            <div class="naturalist-col">
              <div class="naturalist-card-title">🔬 Micro In-Situ Autopsy (Engine)</div>
              <div id="naturalist-inspection-card" class="naturalist-inspection-box">
                <div style="color:#64748b;font-style:italic;text-align:center;padding:28px 10px;">
                  Click any silicoid on the seafloor to view an intuitive plain-English breakdown of its circuit, role in the colony, and energetic thrift.
                </div>
              </div>
            </div>

            <!-- Column 3: Selective Sieve & Barriers (Habitat Limiting Factors & Stewardship) -->
            <div class="naturalist-col">
              <div class="naturalist-card-title" style="display:flex;align-items:center;justify-content:space-between;">
                <span>⚖️ Selective Sieve &amp; Barriers</span>
                <span style="font-size:0.65rem;color:#f59e0b;">Stewardship Tools</span>
              </div>
              <div id="naturalist-barriers-box" class="naturalist-barriers-scroll">
                <!-- Dynamically generated barriers with action buttons -->
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    this.containerEl = modal;

    // 2. Floating In-Situ Field Scope HUD
    let scope = document.getElementById('naturalist-field-scope');
    if (!scope) {
      scope = document.createElement('div');
      scope.id = 'naturalist-field-scope';
      scope.className = 'naturalist-field-scope hidden';
      document.body.appendChild(scope);
    }
    this.fieldScopeEl = scope;

    // 3. Floating Toast Notification Banner
    let toast = document.getElementById('naturalist-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'naturalist-toast';
      toast.className = 'naturalist-toast hidden';
      document.body.appendChild(toast);
    }
    this.toastEl = toast;
  }

  private bindEvents(): void {
    // Permanent Container-Level Event Delegation for Modal
    this.containerEl?.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // 1. Close button
      if (target.closest('#naturalist-close-btn') || target.closest('#naturalist-backdrop')) {
        this.close();
        return;
      }

      // 2. Pause / Resume simulation toggle button
      if (target.closest('#naturalist-pause-btn')) {
        this.toggleSimulationLoop();
        return;
      }

      // 3. Guided Safari button
      if (target.closest('#btn-guided-safari')) {
        this.close();
        this.startGuidedSafari();
        return;
      }

      // 4. Category Filter pills
      const filterPill = target.closest('.tour-filter-pill') as HTMLElement;
      if (filterPill) {
        const cat = filterPill.getAttribute('data-cat') as NaturalistCategory;
        if (cat) {
          this.activeCategory = cat;
          this.lastRenderTime = 0;
          this.render();
        }
        return;
      }

      // 5. Tour Specimen Button in Header
      const tourBtn = target.closest('.ex-tour-btn') as HTMLElement;
      if (tourBtn) {
        const exId = tourBtn.getAttribute('data-ex-id');
        const match = this.activeExemplars.find(x => x.id === exId);
        if (match) {
          this.flyToExemplar(match);
        }
        return;
      }

      // 6. Fly To Specimen Button in Novelty Cards
      const flyToBtn = target.closest('.ex-flyto-btn') as HTMLElement;
      if (flyToBtn) {
        const exId = flyToBtn.getAttribute('data-ex-id');
        const match = this.activeExemplars.find(x => x.id === exId);
        if (match) {
          this.flyToExemplar(match);
        }
        return;
      }

      // 7. Inspect Open Microscope Button
      if (target.closest('#btn-inspect-open-microscope')) {
        if (this.selectedPore) {
          this.onFocusCoord?.(this.selectedPore.coord);
          this.close();
        }
        return;
      }

      // 8. Actionable Stewardship Buttons
      const stewBtn = target.closest('.stewardship-btn') as HTMLElement;
      if (stewBtn) {
        const code = stewBtn.getAttribute('data-barrier-code');
        const idx = parseInt(stewBtn.getAttribute('data-action-idx') ?? '0', 10);
        if (code && this.currentTelemetry) {
          const diagnostics = this.world.getHistoryTracker().auditBarriers(this.world, this.currentTelemetry);
          const matchDiag = diagnostics.find(d => d.code === code);
          if (matchDiag) {
            const acts = this.getStewardshipActionsForBarrier(matchDiag);
            if (acts[idx]) {
              acts[idx].actionFn();
            }
          }
        }
        return;
      }

      // 9. Export JSON button
      if (target.closest('#tour-export-json')) {
        if (this.currentTelemetry) {
          const json = this.world.getHistoryTracker().generateJSON(this.world, this.currentTelemetry);
          this.world.getHistoryTracker().triggerBrowserDownload(
            json,
            `siliquarium-history-t${this.currentTelemetry.tick}-gen${this.currentTelemetry.maxGeneration}.json`,
            'application/json'
          );
          this.showToast('📥 Evolutionary JSON log downloaded successfully!');
        }
        return;
      }

      // 10. Export CSV button
      if (target.closest('#tour-export-csv')) {
        const csv = this.world.getHistoryTracker().generateCSV();
        this.world.getHistoryTracker().triggerBrowserDownload(
          csv,
          `siliquarium-trajectory-t${this.currentTelemetry?.tick ?? 0}.csv`,
          'text/csv'
        );
        this.showToast('📊 Flat CSV time-series downloaded successfully!');
        return;
      }
    });

    // Permanent Event Delegation for Floating Field Scope HUD
    this.fieldScopeEl?.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      if (target.closest('#field-scope-close-btn')) {
        this.closeFieldScope();
        return;
      }

      if (target.closest('#scope-pause-btn')) {
        this.toggleSimulationLoop();
        return;
      }

      if (target.closest('#scope-prev-btn')) {
        this.prevSafariSpecimen();
        return;
      }

      if (target.closest('#scope-next-btn')) {
        this.nextSafariSpecimen();
        return;
      }

      if (target.closest('#scope-microscope-btn')) {
        if (this.currentScopeExemplar) {
          this.onFocusCoord?.(this.currentScopeExemplar.coord);
        }
        return;
      }

      if (target.closest('#scope-freeze-biobank-btn')) {
        if (this.currentScopeExemplar) {
          const p = this.world.getPore(this.currentScopeExemplar.coord);
          const cell = p?.getResident();
          if (cell) {
            const bioBank = BioBank.getInstance();
            const colony = this.world.getColonyAt(this.currentScopeExemplar.coord);
            const record = bioBank.saveSilicoid({
              name: this.currentScopeExemplar.title,
              taxonBinomial: this.currentScopeExemplar.subtitle.split('•')[0].trim(),
              commonName: this.currentScopeExemplar.title,
              tapeBitstring: cell.getSafe().getTape(),
              gateCount: cell.getWorkshop().getGates().length,
              gateTypes: cell.getWorkshop().getGateTypeNames(),
              generation: cell.getGeneration(),
              savedAtEpoch: this.world.getTickCount(),
              isDifferentiated: colony?.isDifferentiated ?? false,
              bodyTopology: colony?.bodyTopology ?? cell.getMorphogeneticPlan().preferredTopology,
              notes: this.currentScopeExemplar.naturalFunction
            });
            this.showToast(`🧊 Frozen to Bio-Bank: "${record.name}"!`);
          } else {
            this.showToast('⚠️ No resident cell found at this coordinate.');
          }
        }
        return;
      }
    });

    // Safari Co-Pilot Panel Event Delegation (Wireframe Screen 2)
    const copilotPanel = document.getElementById('safari-copilot-panel');
    copilotPanel?.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      if (target.closest('#safari-copilot-close-btn')) {
        this.onRequestModeChange?.('observatory');
        return;
      }

      if (target.closest('#safari-copilot-pause-btn')) {
        this.toggleSimulationLoop();
        return;
      }

      if (target.closest('#safari-btn-prev')) {
        this.prevSafariSpecimen();
        return;
      }

      if (target.closest('#safari-btn-next')) {
        this.nextSafariSpecimen();
        return;
      }

      if (target.closest('#safari-btn-auto')) {
        this.toggleAutoTour();
        return;
      }

      if (target.closest('#safari-btn-freeze')) {
        this.freezeActiveSpecimenToBioBank();
        return;
      }
    });

    // Transport Bar Safari Specimen Navigation Controls
    document.getElementById('safari-bar-prev')?.addEventListener('click', () => {
      this.prevSafariSpecimen();
    });

    document.getElementById('safari-bar-next')?.addEventListener('click', () => {
      this.nextSafariSpecimen();
    });

    document.getElementById('safari-bar-auto')?.addEventListener('click', () => {
      this.toggleAutoTour();
    });

    // Draggable Field Scope HUD by its header
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    this.fieldScopeEl?.addEventListener('mousedown', (e) => {
      const target = e.target as HTMLElement;
      const header = target.closest('.field-scope-header');
      if (!header || target.closest('button') || target.closest('a')) return;
      isDragging = true;
      const rect = this.fieldScopeEl!.getBoundingClientRect();
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      initialLeft = rect.left;
      initialTop = rect.top;
      this.fieldScopeEl!.style.right = 'auto';
      this.fieldScopeEl!.style.left = `${initialLeft}px`;
      this.fieldScopeEl!.style.top = `${initialTop}px`;
      this.fieldScopeEl!.style.transition = 'none';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging || !this.fieldScopeEl) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      const newLeft = Math.max(10, Math.min(window.innerWidth - 410, initialLeft + dx));
      const newTop = Math.max(10, Math.min(window.innerHeight - 80, initialTop + dy));
      this.fieldScopeEl.style.left = `${newLeft}px`;
      this.fieldScopeEl.style.top = `${newTop}px`;
    });

    window.addEventListener('mouseup', () => {
      if (isDragging && this.fieldScopeEl) {
        isDragging = false;
        this.fieldScopeEl.style.transition = '';
      }
    });

    // Global keyboard shortcuts when Assistant or Field Scope is active
    window.addEventListener('keydown', (e) => {
      // Hotkey 'Space' to toggle simulation pause/resume when Guide or Field Scope is active
      if (e.code === 'Space' || e.key === ' ') {
        const activeTag = (document.activeElement?.tagName || '').toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          if (this.isOpen || (this.fieldScopeEl && !this.fieldScopeEl.classList.contains('hidden'))) {
            e.preventDefault();
            this.toggleSimulationLoop();
            return;
          }
        }
      }

      // Hotkey 'Escape' to close Guide or Field Scope
      if (e.key === 'Escape') {
        if (this.isOpen) {
          e.preventDefault();
          this.close();
          return;
        } else if (this.fieldScopeEl && !this.fieldScopeEl.classList.contains('hidden')) {
          e.preventDefault();
          this.closeFieldScope();
          return;
        }
      }

      // Hotkey 'A' to toggle Assistant
      if ((e.key === 'a' || e.key === 'A') && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const activeTag = (document.activeElement?.tagName || '').toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          e.preventDefault();
          this.toggle();
        }
      }
    });
  }

  public open(): void {
    if (this.isOpen) return;
    this.isOpen = true;
    if (this.loop) {
      this.wasRunningBeforeOpen = this.loop.isRunning();
      if (this.wasRunningBeforeOpen) {
        this.loop.pause();
        this.showToast('⏸️ Simulation auto-paused for peaceful field study');
      }
    }
    this.syncSimulationRunningUI(this.loop ? this.loop.isRunning() : false);
    this.lastRenderTime = performance.now();
    this.containerEl?.classList.remove('hidden');
    this.render();
  }

  public close(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.containerEl?.classList.add('hidden');
    // If not transitioning to Field Scope, auto-resume if it was running before open
    if (!this.currentScopeExemplar && this.wasRunningBeforeOpen && this.loop && !this.loop.isRunning()) {
      this.loop.start();
      this.wasRunningBeforeOpen = false;
      this.showToast('▶️ Simulation resumed');
    }
  }

  public toggle(): void {
    if (this.isOpen) this.close();
    else this.open();
  }

  public toggleSimulationLoop(): void {
    if (!this.loop) return;
    const nowRunning = this.loop.toggle();
    this.syncSimulationRunningUI(nowRunning);
    if (nowRunning) {
      this.showToast('▶️ Simulation running');
    } else {
      this.showToast('⏸️ Simulation paused');
    }
  }

  public syncSimulationRunningUI(running: boolean): void {
    const pauseBtn = document.getElementById('naturalist-pause-btn');
    const pauseIcon = document.getElementById('naturalist-pause-icon');
    const pauseLabel = document.getElementById('naturalist-pause-label');

    if (pauseBtn) {
      pauseBtn.style.borderColor = running ? '#10b981' : '#f59e0b';
      pauseBtn.style.color = running ? '#10b981' : '#f59e0b';
    }
    if (pauseIcon) {
      pauseIcon.textContent = running ? '▶️' : '⏸️';
    }
    if (pauseLabel) {
      pauseLabel.textContent = running ? 'RUNNING' : 'PAUSED';
    }

    const scopePauseBtn = document.getElementById('scope-pause-btn');
    if (scopePauseBtn) {
      scopePauseBtn.innerHTML = running ? '▶️ RUNNING' : '⏸️ PAUSED';
      scopePauseBtn.className = `field-scope-pause-btn ${running ? '' : 'paused'}`;
      scopePauseBtn.style.borderColor = '';
      scopePauseBtn.style.color = '';
    }

    const copilotPauseIcon = document.getElementById('safari-pause-icon');
    const copilotPauseText = document.getElementById('safari-pause-text');
    if (copilotPauseIcon) copilotPauseIcon.textContent = running ? '⏸️' : '▶️';
    if (copilotPauseText) copilotPauseText.textContent = running ? 'PAUSE' : 'RESUME';
  }

  public updateTelemetry(telemetry: ISimulationTelemetry, selectedCoord: HexCoord3D | null): void {
    this.currentTelemetry = telemetry;
    this.selectedPore = selectedCoord
      ? telemetry.pores.find(p => p.coord.equals(selectedCoord)) ?? null
      : null;

    const isRunning = this.loop ? this.loop.isRunning() : true;

    // Only re-render open modal if the simulation is actively running, ticked a new epoch, and throttle expired
    const now = performance.now();
    if (this.isOpen && isRunning && telemetry.tick !== this.lastRenderedTick && (now - this.lastRenderTime >= this.RENDER_THROTTLE_MS)) {
      this.lastRenderTime = now;
      this.render();
    }

    // If Field Scope HUD is active, refresh its live vitals
    if (this.currentScopeExemplar && !this.fieldScopeEl?.classList.contains('hidden')) {
      const matchPore = telemetry.pores.find(p => p.coord.equals(this.currentScopeExemplar!.coord));
      if (matchPore && matchPore.state === 'OCCUPIED') {
        this.updateFieldScopeVitals(matchPore);
      }
    }

    // If Safari Co-Pilot is active, refresh its live vitals and netlist telemetry strip
    if (this.currentScopeExemplar) {
      const matchPore = telemetry.pores.find(p => p.coord.equals(this.currentScopeExemplar!.coord));
      if (matchPore && matchPore.state === 'OCCUPIED') {
        this.syncSafariCoPilotVitals(matchPore);
      }
    }
  }

  public syncSafariCoPilotVitals(pore: IPoreTelemetry): void {
    const vBatt = document.getElementById('safari-vital-battery');
    if (vBatt) vBatt.textContent = `${pore.energy}T`;
    const vMatt = document.getElementById('safari-vital-matter');
    if (vMatt) vMatt.textContent = `${pore.matter}M`;
    const vAge = document.getElementById('safari-vital-age');
    if (vAge) vAge.textContent = `${pore.age}T`;
    const vLand = document.getElementById('safari-vital-landauer');
    if (vLand) vLand.textContent = `${pore.toggleCount}T`;

    // Update netlist voltage bar and gate text
    const voltFill = document.getElementById('safari-voltage-fill');
    const voltText = document.getElementById('safari-voltage-text');
    const gatesBadge = document.getElementById('safari-gates-badge');
    const orgBadge = document.getElementById('safari-organelle-badge');

    if (voltFill) {
      const pct = Math.min(100, Math.max(5, Math.round((pore.energy / 120) * 100)));
      voltFill.style.width = `${pct}%`;
    }
    if (voltText) {
      const mv = Math.round(pore.energy * 0.45);
      voltText.textContent = `${mv} mV`;
    }
    if (gatesBadge) {
      const gCount = pore.gateTypes?.length ?? 0;
      gatesBadge.textContent = gCount === 0 ? '0 Gates (Porin)' : `${gCount} Gates (${pore.gateTypes?.slice(0, 2).join(', ')})`;
    }
    if (orgBadge) {
      orgBadge.style.display = pore.hasOrganelle ? 'inline-flex' : 'none';
    }
  }

  /**
   * Scans the live simulation telemetry and dynamically discovers living exemplars
   * for all 10 emergent biological & circuit phenomena, including cellular differentiation
   * and Gene Regulatory Network (GRN) division of labor.
   */
  public scanExemplars(tele: ISimulationTelemetry): INaturalistExemplar[] {
    const exemplars: INaturalistExemplar[] = [];
    const occupied = tele.pores.filter(p => p.state === 'OCCUPIED');
    if (occupied.length === 0) return exemplars;

    const ventNozzle = tele.vent.nozzleCoord;
    const dist = (a: HexCoord3D, b: HexCoord3D): number => a.distanceTo(b);

    // 1. Multicellular Syncytium & Differentiated Metazoans
    if (tele.syncytialColonies && tele.syncytialColonies.length > 0) {
      let largestColony = tele.syncytialColonies[0];
      for (const col of tele.syncytialColonies) {
        if (col.memberCoords.length > largestColony.memberCoords.length) {
          largestColony = col;
        }
      }
      if (largestColony.memberCoords.length > 0) {
        const centerCoord = largestColony.memberCoords[Math.floor(largestColony.memberCoords.length / 2)];
        const hostPore = tele.pores.find(p => p.coord.equals(centerCoord)) ?? occupied[0];
        
        const isDifferentiated = largestColony.isDifferentiated ?? false;
        const distinctCount = largestColony.distinctExpressionCount ?? 1;
        const roles = largestColony.differentiatedRoles ?? [];

        let rolesSummary = '';
        if (roles.length > 0) {
          const roleCounts = new Map<string, number>();
          for (const r of roles) {
            roleCounts.set(r.roleName, (roleCounts.get(r.roleName) ?? 0) + 1);
          }
          rolesSummary = Array.from(roleCounts.entries())
            .map(([role, count]) => `${count}× ${role}`)
            .join(', ');
        }

        if (isDifferentiated) {
          exemplars.push({
            id: 'syncytium_differentiated',
            category: 'super',
            badge: `${largestColony.bodyTopology} METAZOAN`,
            badgeColor: '#c084fc',
            title: `Differentiated Metazoan (${largestColony.bodyTopology})`,
            subtitle: `Metazoicladus wolpertii • ${largestColony.bodyTopology} Body with GRN Division of Labor`,
            coord: hostPore.coord,
            naturalFunction: `True multicellular differentiation detected! All ${largestColony.memberCoords.length} cells share the IDENTICAL genome (clonal heredity), but express ${distinctCount} distinct cellular phenotypes across the spatial redox gradient (${rolesSummary}). Its Gene Regulatory Network (GRN) acts as an epigenetic developmental switch responding to Wolpert morphogen cues, establishing spatial division of labor (vent trophocytes vs. somatic shields vs. storage anchors)! Emergent body morphology: ${largestColony.bodyTopology}.`,
            ecologicalRole: `Spatial Division of Labor & Morphogenetic ${largestColony.bodyTopology} Differentiation`,
            battery: largestColony.totalEnergy,
            matter: largestColony.totalMatter,
            generation: hostPore.generation,
            age: hostPore.age,
            catalyticYield: 4.2,
            landauerCost: hostPore.toggleCount,
            dossierUrl: EpistemicDossierRegistry.getDossierUrl('SYNCYTIAL_MULTICELLULARITY'),
            citation: 'Bonner, J. T. (1965) / Wolpert, L. (1969). J. Theor. Biol.',
            fieldMarks: [
              `Emergent body morphology: ${largestColony.bodyTopology}`,
              'Clonal genome with differential gene expression',
              `Spatial division of labor (${distinctCount} distinct cell fates: ${rolesSummary})`,
              'GRN epigenetic developmental state switching',
              'Radiant golden-violet cytoplasmic streaming conduits'
            ]
          });
        } else {
          exemplars.push({
            id: 'syncytium_colony',
            category: 'super',
            badge: `${largestColony.bodyTopology} COLONY`,
            badgeColor: '#8b5cf6',
            title: `Colonial Biofilm (${largestColony.bodyTopology})`,
            subtitle: `Syncytiocladus bonnerii • ${largestColony.bodyTopology} Isogenic Aggregate`,
            coord: hostPore.coord,
            naturalFunction: `Incomplete cell division has joined ${largestColony.memberCoords.length} cells into a cooperative syncytium with ${largestColony.bodyTopology} morphology. All cells share the identical genome and uniform gene expression. They pool energy across purple conduits, but have not yet developed spatial division of labor or differentiated tissue types.`,
            ecologicalRole: 'Colonial Homeostasis & Shared Thermal Buffering',
            battery: largestColony.totalEnergy,
            matter: largestColony.totalMatter,
            generation: hostPore.generation,
            age: hostPore.age,
            catalyticYield: 3.5,
            landauerCost: hostPore.toggleCount,
            dossierUrl: EpistemicDossierRegistry.getDossierUrl('SYNCYTIAL_MULTICELLULARITY'),
            citation: 'Bonner, J. T. (1965). Size and Cycle. Princeton Univ. Press.',
            fieldMarks: [
              'Clonal genome with uniform gene expression (undifferentiated)',
              'Purple intercellular cytoplasmic conduits',
              'Synchronous respiration pulse'
            ]
          });
        }
      }
    }

    // 2. Margulis Endosymbiont Chimera
    const organellePores = occupied.filter(p => p.hasOrganelle);
    if (organellePores.length > 0) {
      let bestOrganelle = organellePores[0];
      for (const p of organellePores) {
        if (p.energy > bestOrganelle.energy) bestOrganelle = p;
      }
      exemplars.push({
        id: 'endosymbiont',
        category: 'super',
        badge: 'ENDOSYMBIONT',
        badgeColor: '#facc15',
        title: 'Margulis Endosymbiont Chimera',
        subtitle: 'Chimerococcus margulisiae • Autonomous Organelle Cassette',
        coord: bestOrganelle.coord,
        naturalFunction: 'Engulfment and assimilation of a foreign catalytic genome into a permanent organelle cassette. An auxiliary yellow-green satellite sphere orbits the pore, generating a permanent +15T baseline power boost independent of ambient plume flux.',
        ecologicalRole: 'Metabolic Compartmentalization & Auxotrophic Autonomy',
        battery: bestOrganelle.energy,
        matter: bestOrganelle.matter,
        generation: bestOrganelle.generation,
        age: bestOrganelle.age,
        catalyticYield: 4.0,
        landauerCost: bestOrganelle.toggleCount,
        dossierUrl: EpistemicDossierRegistry.getDossierUrl('ENDOSYMBIONT_EMERGENCE'),
        citation: 'Margulis (Sagan), L. (1967). J. Theor. Biol. 14(3), 225-274.',
        fieldMarks: ['Gold core with emerald perimeter', 'Orbiting yellow-green satellite sphere', '+15T auxiliary boost']
      });
    }

    // 3. Pelagic Broadcast Spores
    const sporePores = tele.pores.filter(p => p.hasSpore || (p.isAqueous && p.state === 'OCCUPIED') || p.coord.z >= 1);
    if (tele.sporeCount > 0 && sporePores.length > 0) {
      const sporeSample = sporePores[0];
      exemplars.push({
        id: 'spore',
        category: 'super',
        badge: 'PELAGIC SPORE',
        badgeColor: '#38bdf8',
        title: 'Pelagic Broadcast Spore',
        subtitle: 'Sporosarcina pelagica • Cryptobiotic Buoyant Capsule',
        coord: sporeSample.coord,
        naturalFunction: 'Encysted dormant genome ejected into the ocean column to escape benthic spatial crowding. Enters a cryptobiotic zero-burn stasis with zero Landauer switching dissipation while drifting across 3D tidal currents to colonize distant unpopulated reefs.',
        ecologicalRole: 'Broadcast Colonization & Spatial Congestion Escape',
        battery: sporeSample.energy,
        matter: sporeSample.matter,
        generation: sporeSample.generation,
        age: sporeSample.age,
        catalyticYield: 1.0,
        landauerCost: 0,
        dossierUrl: EpistemicDossierRegistry.getDossierUrl('PELAGIC_SPORULATION_EMERGENCE'),
        citation: 'Bonner, J. T. (1965). Size and Cycle. Princeton Univ. Press.',
        fieldMarks: ['Luminous buoyant amber dot drifting in fluid column', 'Cryptobiotic zero-burn stasis', 'Tidal current drift']
      });
    }

    // 4. Chemiosmotic Plume Specialist (Apex Vent Feeder)
    const ventPores = occupied.filter(p => dist(p.coord, ventNozzle) <= 2 || (tele.vent.offshootCoords && tele.vent.offshootCoords.some(c => dist(p.coord, c) <= 1)));
    if (ventPores.length > 0) {
      let highestVentFeeder = ventPores[0];
      for (const p of ventPores) {
        if (p.energy > highestVentFeeder.energy) highestVentFeeder = p;
      }
      exemplars.push({
        id: 'vent_feeder',
        category: 'trophic',
        badge: 'APEX AUTOTROPH',
        badgeColor: '#10b981',
        title: 'Chemiosmotic Plume Specialist',
        subtitle: `${highestVentFeeder.speciesTaxon?.binomialName ?? 'Lithococcus mitchellii'} • Proton Motive Force Specialist`,
        coord: highestVentFeeder.coord,
        naturalFunction: 'Occupies the prime hydrothermal chimney throat, directly tapping continuous non-equilibrium electron and chemical flux. Gates rapidly fire co-catalytic reactions to synthesize maximum battery tokens before Landauer heat builds up.',
        ecologicalRole: 'Primary Producer & Geochemical Influx Converter',
        battery: highestVentFeeder.energy,
        matter: highestVentFeeder.matter,
        generation: highestVentFeeder.generation,
        age: highestVentFeeder.age,
        catalyticYield: 2.5,
        landauerCost: highestVentFeeder.toggleCount,
        dossierUrl: EpistemicDossierRegistry.getDossierUrl('VENT_FEEDER'),
        citation: 'Mitchell, P. (1961). Nature 191, 144-148.',
        fieldMarks: ['Vigorous 2.0 Hz breathing oscillation', 'Radiant emerald perimeter aura', 'High battery level (>80T)']
      });
    }

    // 5. Deep Subterranean Basalt Lithotroph (Must be a true solitary peripheral lithotroph, NOT part of a syncytium, with minimized <=2 gates)
    const lithoPores = occupied.filter(p => !p.isSyncytium && !p.hasOrganelle && p.gateCount <= 2 && (p.isBasalt || dist(p.coord, ventNozzle) >= 3));
    let bestLitho = lithoPores[0];
    if (!bestLitho) {
      // Fallback: solitary non-syncytium pore far from vent, lowest gate count
      const solitaryPores = occupied.filter(p => !p.isSyncytium && !p.hasOrganelle && (p.isBasalt || dist(p.coord, ventNozzle) >= 3));
      if (solitaryPores.length > 0) {
        bestLitho = solitaryPores.reduce((prev, curr) => curr.gateCount < prev.gateCount ? curr : prev, solitaryPores[0]);
      }
    }
    if (bestLitho) {
      for (const p of lithoPores) {
        if (p.gateCount < bestLitho.gateCount || (p.gateCount === bestLitho.gateCount && p.age > bestLitho.age)) {
          bestLitho = p;
        }
      }
      const actualTaxon = bestLitho.speciesTaxon ?? TaxonomyNomenclature.classify({
        tapeBitstring: bestLitho.tapeBitstring,
        gateTypes: bestLitho.gateTypes,
        generation: bestLitho.generation,
        isBasalt: bestLitho.isBasalt,
        hasOrganelle: false,
        isSyncytium: false
      });
      exemplars.push({
        id: 'lithotroph',
        category: 'trophic',
        badge: 'BASALT LITHOTROPH',
        badgeColor: '#06b6d4',
        title: 'Deep Subterranean Lithotroph',
        subtitle: `${actualTaxon.binomialName} • ${actualTaxon.commonName}`,
        coord: bestLitho.coord,
        naturalFunction: `Survives in cold, nutrient-starved basalt fractures far from the vent plume (${bestLitho.gateCount} logic gates). Minimized gate netlist reduces Landauer switching dissipation to near zero, metabolizing trace mineral effluents with extreme frugality.`,
        ecologicalRole: 'Peripheral Stress-Tolerant Extremophile',
        battery: bestLitho.energy,
        matter: bestLitho.matter,
        generation: bestLitho.generation,
        age: bestLitho.age,
        catalyticYield: 1.2,
        landauerCost: bestLitho.toggleCount,
        dossierUrl: EpistemicDossierRegistry.getDossierUrl('BASALT_LITHOTROPH'),
        citation: 'Lane, N., & Martin, W. (2012). Cell 151(7), 1406-1416.',
        fieldMarks: ['Slow, calm breathing oscillation (~0.4 Hz)', 'Deep teal/cyan aura', 'Streamlined minimized netlist']
      });
    }

    // 6. Active Trophic Predator
    if (tele.predationEvents && tele.predationEvents.length > 0) {
      this.lastKnownPredatorCoord = tele.predationEvents[0].predatorCoord;
    }
    const predatorCoord = (tele.predationEvents && tele.predationEvents.length > 0)
      ? tele.predationEvents[0].predatorCoord
      : (this.lastKnownPredatorCoord && tele.pores.some(p => p.coord.equals(this.lastKnownPredatorCoord!) && p.state === 'OCCUPIED'))
        ? this.lastKnownPredatorCoord
        : null;

    if (predatorCoord) {
      const predatorPore = tele.pores.find(p => p.coord.equals(predatorCoord));
      if (predatorPore && predatorPore.state === 'OCCUPIED') {
        exemplars.push({
          id: 'predator',
          category: 'trophic',
          badge: 'TROPHIC PREDATOR',
          badgeColor: '#f43f5e',
          title: 'Lytic Trophic Predator',
          subtitle: `${predatorPore.speciesTaxon?.binomialName ?? 'Vampirococcus vorax'} • Direct Prey Lysis Specialist`,
          coord: predatorPore.coord,
          naturalFunction: 'Projects a directional crimson enzymatic siphon to breach the mineral wall of an adjacent pore, lysing its cytoplasmic contents and siphoning its battery tokens to supplement autotrophic chemiosmosis.',
          ecologicalRole: 'Heterotrophic Carnivory & Biomass Transfer',
          battery: predatorPore.energy,
          matter: predatorPore.matter,
          generation: predatorPore.generation,
          age: predatorPore.age,
          catalyticYield: 3.2,
          landauerCost: predatorPore.toggleCount,
          dossierUrl: EpistemicDossierRegistry.getDossierUrl('TROPHIC_PREDATOR'),
          citation: 'Dawkins, R. (1976). The Selfish Gene. Oxford Univ. Press.',
          fieldMarks: ['Directional crimson strike beam (#f43f5e)', 'Rose predator intake halo', 'Inter-pore predation siphon']
        });
      }
    }

    // 7. Detrital Benthic Scavenger
    if (tele.scavengeEvents && tele.scavengeEvents.length > 0) {
      this.lastKnownScavengerCoord = tele.scavengeEvents[0].scavengerCoord;
    }
    const scavengerCoord = (tele.scavengeEvents && tele.scavengeEvents.length > 0)
      ? tele.scavengeEvents[0].scavengerCoord
      : (this.lastKnownScavengerCoord && tele.pores.some(p => p.coord.equals(this.lastKnownScavengerCoord!) && p.state === 'OCCUPIED'))
        ? this.lastKnownScavengerCoord
        : null;

    if (scavengerCoord) {
      const scavengerPore = tele.pores.find(p => p.coord.equals(scavengerCoord));
      if (scavengerPore && scavengerPore.state === 'OCCUPIED') {
        exemplars.push({
          id: 'scavenger',
          category: 'trophic',
          badge: 'DETRITIVORE',
          badgeColor: '#fbbf24',
          title: 'Detrital Benthic Scavenger',
          subtitle: `${scavengerPore.speciesTaxon?.binomialName ?? 'Saprotrophus hadalis'} • Organic Carcass Recycler`,
          coord: scavengerPore.coord,
          naturalFunction: 'Extends enzymatic scavenging conduits into decomposing dead cell carcasses, reclaiming sequestered matter and residual energy tokens before mineral precipitation locks them into inert stone.',
          ecologicalRole: 'Saprotrophic Nutrient Recycling & Necromass Reclamation',
          battery: scavengerPore.energy,
          matter: scavengerPore.matter,
          generation: scavengerPore.generation,
          age: scavengerPore.age,
          catalyticYield: 2.1,
          landauerCost: scavengerPore.toggleCount,
          dossierUrl: EpistemicDossierRegistry.getDossierUrl('DETRITAL_SCAVENGER'),
          citation: 'Russell, M. J., & Hall, A. J. (1997). J. Geol. Soc. 154, 377-402.',
          fieldMarks: ['Dashed golden scavenging stream targeting grey carcass', 'Rapid amber border shimmer']
        });
      }
    }

    // 8. Circuit Specialists: Scan Milestones & Logic Networks
    const milestones = this.world.getPaleontologist().getMilestones();
    for (const m of milestones) {
      const livingHost = occupied.find(p => {
        if (m.motif.type === MotifType.BISTABLE_LATCH) return p.gateTypes.includes('AND') && p.gateTypes.includes('OR');
        if (m.motif.type === MotifType.RING_OSCILLATOR) return p.gateTypes.filter(g => g.includes('NOT')).length >= 3;
        if (m.motif.type === MotifType.COHERENT_FFL) return p.gateTypes.includes('AND') && p.gateTypes.includes('NOT');
        if (m.motif.type === MotifType.HALF_ADDER) return p.gateTypes.includes('XOR') && p.gateTypes.includes('AND');
        if (m.motif.type === MotifType.INVERTER_NOT) return p.gateTypes.includes('NOT');
        if (m.motif.type === MotifType.TEMPORAL_DERIVATIVE_CHEMOTAXIS) return p.gateTypes.includes('AND') && p.gateTypes.includes('NOT') && (p.gateTypes.includes('BUF') || p.gateTypes.filter(g => g.includes('AND')).length >= 2);
        if (m.motif.type === MotifType.PREDICTIVE_PAVLOVIAN) return p.gateTypes.includes('NOT') && p.gateTypes.includes('AND') && p.gateTypes.includes('OR');
        if (m.motif.type === MotifType.ENTRAINED_PACEMAKER) return p.gateTypes.filter(g => g.includes('NOT')).length >= 3 && (p.gateTypes.includes('AND') || p.gateTypes.includes('OR') || p.gateTypes.includes('BUF'));
        if (m.motif.type === MotifType.STEINER_VASCULAR_NETWORK) return p.gateTypes.includes('AND') && p.gateTypes.includes('OR') && p.gateTypes.includes('BUF');
        if (m.motif.type === MotifType.CRYPTOBIOTIC_DORMANCY_CLAMP) return p.gateTypes.filter(g => g.includes('NOT')).length === 2 && (p.gateTypes.includes('OR') || p.gateTypes.includes('AND'));
        return false;
      }) ?? (tele.pores.find(p => p.coord.equals(m.poreCoord) && p.state === 'OCCUPIED'));

      if (livingHost) {
        const exId = `motif_${m.motif.type.toLowerCase()}`;
        if (!exemplars.some(e => e.id === exId)) {
          exemplars.push({
            id: exId,
            category: 'circuit',
            badge: 'GENETIC CIRCUIT',
            badgeColor: '#00e5ff',
            title: m.motif.name,
            subtitle: `${m.motif.biologicalCognate} • Evolved Gen ${livingHost.generation}`,
            coord: livingHost.coord,
            naturalFunction: `${m.motif.naturalFunction} What it does: ${m.motif.signature}`,
            ecologicalRole: 'Autonomous Information Processing & Metabolic Regulation',
            battery: livingHost.energy,
            matter: livingHost.matter,
            generation: livingHost.generation,
            age: livingHost.age,
            catalyticYield: 3.0,
            landauerCost: livingHost.toggleCount,
            dossierUrl: EpistemicDossierRegistry.getDossierUrl(m.motif.type),
            citation: m.motif.citation,
            fieldMarks: ['In-situ physical micro-chips visible at close zoom', 'Pulsing copper electron traces', 'Active Boolean gate evaluation']
          });
        }
      }
    }

    // 9. Oldest Lineage Exemplar
    let oldestLiving = occupied[0];
    for (const p of occupied) {
      if (p.age > oldestLiving.age) oldestLiving = p;
    }
    if (!exemplars.some(e => e.id === 'oldest_lineage')) {
      exemplars.push({
        id: 'oldest_lineage',
        category: 'trophic',
        badge: 'SURVIVOR LINEAGE',
        badgeColor: '#a855f7',
        title: 'Deep Seafloor Patriarch Lineage',
        subtitle: `Ancient Ancestor • Age ${oldestLiving.age.toLocaleString()} Ticks`,
        coord: oldestLiving.coord,
        naturalFunction: `This venerable organism has survived ${oldestLiving.age.toLocaleString()} discrete simulation epochs without succumbing to thermal dissipation, toxic surges, or predation. Its genome represents an uncorrupted palimpsest of the primordial environment.`,
        ecologicalRole: 'Long-Term Genetic Reservoir & Phylogenetic Anchor',
        battery: oldestLiving.energy,
        matter: oldestLiving.matter,
        generation: oldestLiving.generation,
        age: oldestLiving.age,
        catalyticYield: 2.0,
        landauerCost: oldestLiving.toggleCount,
        dossierUrl: EpistemicDossierRegistry.getDossierUrl('OLDEST_LINEAGE'),
        citation: 'Lenski, R. E., et al. (1991). Am. Nat. 138(6), 1315-1341.',
        fieldMarks: ['Deep ancestral genome palimpsest', 'Stable metabolic resonance', 'Highly conserved logic netlist']
      });
    }

    // 10. Substrate C / Cit+ Exploiter (Richard Lenski & Zachary Blount homage)
    const citPores = occupied.filter(p => [8, 9, 10, 11].some(idx => p.tapeBitstring?.includes(idx.toString(2).padStart(6, '0'))));
    if (citPores.length > 0) {
      const bestCit = citPores.reduce((prev, curr) => curr.energy > prev.energy ? curr : prev, citPores[0]);
      exemplars.push({
        id: 'citratovibrio',
        category: 'trophic',
        badge: 'SUBSTRATE C CIT+',
        badgeColor: '#f43f5e',
        title: "Lenski's Substrate C Exploiter",
        subtitle: 'Citratovibrio lenskii • High-Enthalpy Catabolic Specialist',
        coord: bestCit.coord,
        naturalFunction: 'Possesses evolved PORIN_STREAM_C channel capable of catabolizing refractory benthic Substrate C (pyrophosphate/methane), extracting +3 extra battery tokens per cycle.',
        ecologicalRole: 'Refractory Geochemical Digestion & Secondary Substrate Niche',
        battery: bestCit.energy,
        matter: bestCit.matter,
        generation: bestCit.generation,
        age: bestCit.age,
        catalyticYield: 5.0,
        landauerCost: bestCit.toggleCount,
        dossierUrl: EpistemicDossierRegistry.getDossierUrl('LENSKI_CIT_BREAKTHROUGH'),
        citation: 'Blount, Z. D., Borland, C. Z., & Lenski, R. E. (2008). PNAS 105(23), 7899-7906.',
        fieldMarks: ['Radiant crimson membrane rim', 'Refractory Substrate C oxidation', '+3 catalytic yield boost']
      });
    }

    // 11. Siderophore Mineral Chelator (Joe B. Neilands homage)
    const chelPores = occupied.filter(p => [18, 19, 20, 21].some(idx => p.tapeBitstring?.includes(idx.toString(2).padStart(6, '0'))) || (p.chelator ?? 0) > 0);
    if (chelPores.length > 0) {
      const bestChel = chelPores.reduce((prev, curr) => curr.matter > prev.matter ? curr : prev, chelPores[0]);
      exemplars.push({
        id: 'siderococcus',
        category: 'trophic',
        badge: 'MINERAL CHELATOR',
        badgeColor: '#eab308',
        title: "Neilands' Mineral Chelator",
        subtitle: 'Siderococcus neilsonii • Basalt Rock Solubilizer',
        coord: bestChel.coord,
        naturalFunction: 'Secretes high-affinity siderophore mineral chelators into the pore cavity, solubilizing impermeable basalt obstacles into bioavailable matter tokens (+1 matter).',
        ecologicalRole: 'Public Good Mineral Chelation & Lithic Colonization',
        battery: bestChel.energy,
        matter: bestChel.matter,
        generation: bestChel.generation,
        age: bestChel.age,
        catalyticYield: 2.0,
        landauerCost: bestChel.toggleCount,
        dossierUrl: EpistemicDossierRegistry.getDossierUrl('MINERAL_CHELATION_DISCOVERY'),
        citation: 'Neilands, J. B. (1995). J. Biol. Chem. 270(45), 26723-26726.',
        fieldMarks: ['Golden siderophore secretion halo', 'Active basalt rock dissolution', '+1 matter bioaccumulation']
      });
    }

    // 12. Biofilm Viscoelastic EPS Matrix (J. William Costerton homage)
    const epsPores = occupied.filter(p => [28, 29, 30, 31].some(idx => p.tapeBitstring?.includes(idx.toString(2).padStart(6, '0'))) || (p.eps ?? 0) > 0);
    if (epsPores.length > 0) {
      const bestEps = epsPores.reduce((prev, curr) => curr.energy > prev.energy ? curr : prev, epsPores[0]);
      exemplars.push({
        id: 'biofilmocladus',
        category: 'super',
        badge: 'BIOFILM EPS',
        badgeColor: '#14b8a6',
        title: "Costerton's Glycocalyx Shield",
        subtitle: 'Biofilmocladus costertonii • Viscoelastic Biofilm Architect',
        coord: bestEps.coord,
        naturalFunction: 'Synthesizes and secretes a protective viscoelastic Extracellular Polymeric Substance (EPS) slime mesh into the pore, buffering against hydrodynamic shear stress and toxic incursions.',
        ecologicalRole: 'Biofilm Micro-Environment Engineering & Fluid Damping',
        battery: bestEps.energy,
        matter: bestEps.matter,
        generation: bestEps.generation,
        age: bestEps.age,
        catalyticYield: 2.0,
        landauerCost: bestEps.toggleCount,
        dossierUrl: EpistemicDossierRegistry.getDossierUrl('BIOFILM_EPS_SHIELD'),
        citation: 'Costerton, J. W., et al. (1999). Science 284(5418), 1318-1322.',
        fieldMarks: ['Viscoelastic teal slime mesh', 'Hydrodynamic shear dampening', 'Diffusible public good matrix']
      });
    }

    // 13. Paracrine Syntrophic Partner (Stuart A. West & Derek Lovley homage)
    if (tele.syntrophyEvents && tele.syntrophyEvents.length > 0) {
      const synHost = occupied.find(p => p.coord.equals(tele.syntrophyEvents![0].from)) ?? occupied[0];
      exemplars.push({
        id: 'syntrophobacter',
        category: 'super',
        badge: 'SYNTROPHIC DIET',
        badgeColor: '#22c55e',
        title: "West's Paracrine Syntroph",
        subtitle: 'Syntrophobacter westii • Mutualistic Cross-Feeding Partner',
        coord: synHost.coord,
        naturalFunction: 'Engages in direct interspecies energy transfer (DIET), transferring surplus battery tokens directly across pore barriers to non-clonal neighbors to maintain ecosystem resilience.',
        ecologicalRole: 'Mutualistic Metabolic Cross-Feeding & Inter-Clade Syntrophy',
        battery: synHost.energy,
        matter: synHost.matter,
        generation: synHost.generation,
        age: synHost.age,
        catalyticYield: 3.5,
        landauerCost: synHost.toggleCount,
        dossierUrl: EpistemicDossierRegistry.getDossierUrl('SYNTROPHIC_CROSS_FEEDING'),
        citation: 'West, S. A., et al. (2007) / Lovley, D. R. (2017). Env. Microbiol. Rep.',
        fieldMarks: ['Emerald cross-feeding energy vectors', 'Direct interspecies electron transfer', 'Inter-clade cooperation']
      });
    }

    // 14. Vampiric Kleptoplast Predator (Eberhard Schnepf homage)
    const klepPores = occupied.filter(p => p.hasOrganelle && p.gateTypes && p.gateTypes.includes('NOT'));
    if (klepPores.length > 0) {
      const bestKlep = klepPores[0];
      exemplars.push({
        id: 'vampirotheke',
        category: 'trophic',
        badge: 'KLEPTOPLAST',
        badgeColor: '#d946ef',
        title: "Schnepf's Organelle Kleptoplast",
        subtitle: 'Vampirotheke schnepfii • Apex Organelle Thief',
        coord: bestKlep.coord,
        naturalFunction: 'Apex contact predator that lyses neighboring cells and assimilates their metabolic organelle cassettes (kleptoplasty), stealing catalytic machinery for permanent host power.',
        ecologicalRole: 'Predatory Organelle Robbery & Horizontal Cassette Acquisition',
        battery: bestKlep.energy,
        matter: bestKlep.matter,
        generation: bestKlep.generation,
        age: bestKlep.age,
        catalyticYield: 4.5,
        landauerCost: bestKlep.toggleCount,
        dossierUrl: EpistemicDossierRegistry.getDossierUrl('VAMPIRIC_KLEPTOPLASTY'),
        citation: 'Schnepf, E., & Deichgräber, G. (1984). Protoplasma 123(2), 143-150.',
        fieldMarks: ['Neon orchid vampiric aura', 'Assimilated foreign organelle cassette', 'Lytic siphon apparatus']
      });
    }

    // Deterministic sorting to ensure rock-solid UI layout with zero jumping or shuffling
    const CATEGORY_ORDER: Record<string, number> = {
      super: 1,
      trophic: 2,
      circuit: 3
    };

    const SPECIMEN_PRIORITY: Record<string, number> = {
      syncytium_differentiated: 1,
      syncytium_colony: 2,
      biofilmocladus: 3,
      syntrophobacter: 4,
      endosymbiont: 5,
      spore: 6,
      vent_feeder: 10,
      lithotroph: 11,
      citratovibrio: 12,
      siderococcus: 13,
      predator: 14,
      vampirotheke: 15,
      scavenger: 16,
      oldest_lineage: 17
    };

    exemplars.sort((a, b) => {
      const catA = CATEGORY_ORDER[a.category] ?? 99;
      const catB = CATEGORY_ORDER[b.category] ?? 99;
      if (catA !== catB) return catA - catB;
      const prioA = SPECIMEN_PRIORITY[a.id] ?? 50;
      const prioB = SPECIMEN_PRIORITY[b.id] ?? 50;
      if (prioA !== prioB) return prioA - prioB;
      return a.id.localeCompare(b.id);
    });

    return exemplars;
  }

  /**
   * Smoothly navigates the camera to an exemplar, minimizes the large modal,
   * and opens the in-situ floating Field Scope HUD.
   */
  public flyToExemplar(exemplar: INaturalistExemplar, fromSafari: boolean = false): void {
    this.currentScopeExemplar = exemplar;
    if (!fromSafari) {
      this.currentSafariIndex = this.activeExemplars.findIndex(e => e.id === exemplar.id);
    }
    this.onFocusCoord?.(exemplar.coord);
    this.close();
    this.openFieldScope(exemplar);
  }

  /**
   * Displays the floating Naturalist Field Scope HUD in the 3D viewport.
   */
  public openFieldScope(exemplar: INaturalistExemplar): void {
    if (!this.fieldScopeEl) return;
    const total = this.activeExemplars.length;
    const currentIdx = this.currentSafariIndex >= 0 ? this.currentSafariIndex + 1 : 1;

    const isPaused = this.loop ? !this.loop.isRunning() : true;
    this.fieldScopeEl.innerHTML = `
      <div class="field-scope-header" id="field-scope-header" title="Drag header to move Field Scope">
        <div>
          <div class="field-scope-title">🔭 NATURALIST FIELD SCOPE</div>
          <div class="field-scope-sub">Specimen ${currentIdx} of ${total} • ${exemplar.badge}</div>
        </div>
        <div class="field-scope-header-actions">
          <button id="scope-pause-btn" class="field-scope-pause-btn ${isPaused ? 'paused' : ''}" title="Pause or Resume simulation (Hotkey: Space)">
            ${isPaused ? '⏸️ PAUSED' : '▶️ RUNNING'}
          </button>
          <button id="field-scope-close-btn" class="field-scope-close-btn" title="Close Field Scope (Hotkey: Esc)">✕</button>
        </div>
      </div>

      <div>
        <div style="font-size:0.92rem;font-weight:bold;color:#fff;">${exemplar.title}</div>
        <div style="font-size:0.72rem;color:#38bdf8;font-family:monospace;">${exemplar.subtitle}</div>
        <div style="font-size:0.68rem;color:#94a3b8;font-family:monospace;margin-top:2px;">
          Coordinate: [q: ${exemplar.coord.q}, r: ${exemplar.coord.r}, z: ${exemplar.coord.z}]
        </div>
      </div>

      <div class="field-scope-behavior">
        <strong style="color:#e9d5ff;">🌿 Natural History Field Mark:</strong><br>
        ${exemplar.naturalFunction}
      </div>

      <div class="field-scope-vitals" id="field-scope-vitals">
        <div><span style="color:#64748b;">Battery:</span> <span style="color:#10b981;font-weight:bold;">${exemplar.battery}T</span></div>
        <div><span style="color:#64748b;">Matter:</span> <span style="color:#38bdf8;font-weight:bold;">${exemplar.matter}M</span></div>
        <div><span style="color:#64748b;">Gen:</span> <span style="color:#fff;font-weight:bold;">${exemplar.generation}</span></div>
        <div><span style="color:#64748b;">Age:</span> <span style="color:#fff;font-weight:bold;">${exemplar.age}T</span></div>
        <div><span style="color:#64748b;">Yield:</span> <span style="color:#facc15;font-weight:bold;">${exemplar.catalyticYield.toFixed(1)}×</span></div>
        <div><span style="color:#64748b;">Landauer:</span> <span style="color:#fb923c;font-weight:bold;">${exemplar.landauerCost}T</span></div>
      </div>

      <div class="field-scope-actions">
        <div style="display:flex;gap:4px;">
          <button id="scope-prev-btn" class="field-scope-btn" title="Previous living specimen">◄ Prev</button>
          <button id="scope-next-btn" class="field-scope-btn" title="Next living specimen">Next ►</button>
        </div>
        <button id="scope-freeze-biobank-btn" class="field-scope-btn" style="border-color:#10b981;color:#6ee7b7;background:rgba(16,185,129,0.15);" title="Freeze this living specimen into the Bio-Bank Cryo-Vault">
          🧊 Freeze
        </button>
        <button id="scope-microscope-btn" class="field-scope-btn field-scope-btn-microscope" title="Open Circuit Microscope for this cell">
          🔬 Microscope
        </button>
        <a href="${exemplar.dossierUrl}" target="_blank" rel="noopener noreferrer" class="field-scope-dossier-link" title="Open complete biophysical dossier">
          📖 Full Dossier ↗
        </a>
      </div>
    `;

    this.fieldScopeEl.classList.remove('hidden');
  }

  public closeFieldScope(): void {
    if (this.fieldScopeEl) {
      this.fieldScopeEl.classList.add('hidden');
      this.fieldScopeEl.style.left = '';
      this.fieldScopeEl.style.top = '';
      this.fieldScopeEl.style.right = '';
    }
    this.currentScopeExemplar = null;
    if (this.wasRunningBeforeOpen && this.loop && !this.loop.isRunning()) {
      this.loop.start();
      this.wasRunningBeforeOpen = false;
      this.showToast('▶️ Simulation resumed');
    }
  }

  private updateFieldScopeVitals(pore: IPoreTelemetry): void {
    const vitalsEl = document.getElementById('field-scope-vitals');
    if (vitalsEl) {
      vitalsEl.innerHTML = `
        <div><span style="color:#64748b;">Battery:</span> <span style="color:#10b981;font-weight:bold;">${pore.energy}T</span></div>
        <div><span style="color:#64748b;">Matter:</span> <span style="color:#38bdf8;font-weight:bold;">${pore.matter}M</span></div>
        <div><span style="color:#64748b;">Gen:</span> <span style="color:#fff;font-weight:bold;">${pore.generation}</span></div>
        <div><span style="color:#64748b;">Age:</span> <span style="color:#fff;font-weight:bold;">${pore.age}T</span></div>
        <div><span style="color:#64748b;">Yield:</span> <span style="color:#facc15;font-weight:bold;">${(pore.catalyticYield ?? 2.0).toFixed(1)}×</span></div>
        <div><span style="color:#64748b;">Landauer:</span> <span style="color:#fb923c;font-weight:bold;">${pore.toggleCount}T</span></div>
      `;
    }
  }

  public setModeChangeHandler(fn: (mode: 'observatory' | 'safari' | 'laboratory' | 'studio') => void): void {
    this.onRequestModeChange = fn;
  }

  public registerSafariListener(cb: (exemplar: INaturalistExemplar, tele: ISimulationTelemetry, skipFlyTo?: boolean) => void): void {
    this.safariSpecimenListeners.push(cb);
  }

  public startGuidedSafari(): void {
    if (this.onRequestModeChange) {
      this.onRequestModeChange('safari');
    } else {
      this.startSafariCoPilot();
    }
  }

  public startSafariCoPilot(preferredCoord?: HexCoord3D | null, skipFlyTo: boolean = false): void {
    this.close();
    if (!this.currentTelemetry) {
      this.currentTelemetry = this.world.exportTelemetry();
    }
    this.activeExemplars = this.scanExemplars(this.currentTelemetry);
    if (this.activeExemplars.length === 0) {
      this.showToast('ℹ️ No living exemplars detected yet in soup.');
      return;
    }

    if (preferredCoord && this.selectSpecimenByCoord(preferredCoord, skipFlyTo)) {
      this.showToast('🌿 Safari Co-Pilot active: Preserving selected specimen & camera perspective');
      return;
    }

    if (this.currentSafariIndex < 0 || this.currentSafariIndex >= this.activeExemplars.length) {
      this.currentSafariIndex = 0;
    }
    this.selectSafariSpecimen(this.currentSafariIndex, skipFlyTo);
    this.showToast('🌿 Safari Co-Pilot active: Touring live emergent phenotypes & circuits');
  }

  public getCurrentSafariSpecimen(): INaturalistExemplar | null {
    return this.currentScopeExemplar;
  }

  public selectSafariSpecimen(index: number, skipFlyTo: boolean = false): void {
    if (this.activeExemplars.length === 0) return;
    this.currentSafariIndex = (index + this.activeExemplars.length) % this.activeExemplars.length;
    const exemplar = this.activeExemplars[this.currentSafariIndex];
    this.currentScopeExemplar = exemplar;
    this.updateSafariCoPilotDOM(exemplar);
    const tele = this.currentTelemetry ?? this.world.exportTelemetry();
    for (const listener of this.safariSpecimenListeners) {
      listener(exemplar, tele, skipFlyTo);
    }
  }

  public selectSpecimenByCoord(coord: HexCoord3D, skipFlyTo: boolean = false): boolean {
    if (this.activeExemplars.length === 0) {
      if (!this.currentTelemetry) this.currentTelemetry = this.world.exportTelemetry();
      this.activeExemplars = this.scanExemplars(this.currentTelemetry);
    }
    const idx = this.activeExemplars.findIndex(e => {
      if (e.coord.equals(coord)) return true;
      const col = this.world.getColonyAt(e.coord);
      return col ? col.memberCoords.some((mc: HexCoord3D) => mc.equals(coord)) : false;
    });
    if (idx >= 0) {
      this.selectSafariSpecimen(idx, skipFlyTo);
      return true;
    }
    return false;
  }

  public nextSafariSpecimen(): void {
    if (this.activeExemplars.length === 0) return;
    AudioSynthesizer.getInstance().playSafariTransition();
    if (document.body.classList.contains('mode-safari')) {
      this.selectSafariSpecimen(this.currentSafariIndex + 1);
    } else {
      this.currentSafariIndex = (this.currentSafariIndex + 1) % this.activeExemplars.length;
      this.flyToExemplar(this.activeExemplars[this.currentSafariIndex], true);
    }
  }

  public prevSafariSpecimen(): void {
    if (this.activeExemplars.length === 0) return;
    AudioSynthesizer.getInstance().playSafariTransition();
    if (document.body.classList.contains('mode-safari')) {
      this.selectSafariSpecimen(this.currentSafariIndex - 1);
    } else {
      this.currentSafariIndex = (this.currentSafariIndex - 1 + this.activeExemplars.length) % this.activeExemplars.length;
      this.flyToExemplar(this.activeExemplars[this.currentSafariIndex], true);
    }
  }

  public toggleAutoTour(): boolean {
    this.isAutoTouring = !this.isAutoTouring;
    if (this.isAutoTouring) {
      this.showToast('🚀 Auto-Tour active: cycling specimens every 5 seconds');
      if (this.autoTourTimer !== null) clearInterval(this.autoTourTimer);
      this.autoTourTimer = window.setInterval(() => {
        if (this.loop && !this.loop.isRunning()) return;
        this.nextSafariSpecimen();
      }, 5000);
    } else {
      if (this.autoTourTimer !== null) {
        clearInterval(this.autoTourTimer);
        this.autoTourTimer = null;
      }
      this.showToast('⏸ Auto-Tour paused');
    }
    this.syncAutoTourUI();
    return this.isAutoTouring;
  }

  public setAutoTour(active: boolean): void {
    if (this.isAutoTouring !== active) {
      this.toggleAutoTour();
    }
  }

  public syncAutoTourUI(): void {
    const copilotAutoBtn = document.getElementById('safari-btn-auto');
    const barAutoBtn = document.getElementById('safari-bar-auto');
    copilotAutoBtn?.classList.toggle('btn-auto-active', this.isAutoTouring);
    barAutoBtn?.classList.toggle('btn-auto-active', this.isAutoTouring);
    if (copilotAutoBtn) copilotAutoBtn.textContent = this.isAutoTouring ? '⏹ Stop Tour' : '🚀 Auto-Tour';
    if (barAutoBtn) barAutoBtn.textContent = this.isAutoTouring ? '⏹ Stop Tour' : '🚀 Auto-Tour';
  }

  public updateSafariCoPilotDOM(exemplar: INaturalistExemplar): void {
    const total = this.activeExemplars.length;
    const currentIdx = this.currentSafariIndex + 1;

    const counter = document.getElementById('safari-specimen-counter');
    if (counter) counter.textContent = `Specimen ${currentIdx} of ${total} • ${exemplar.badge}`;

    const badge = document.getElementById('safari-copilot-badge');
    if (badge) {
      badge.textContent = exemplar.badge;
      badge.style.background = exemplar.badgeColor;
      badge.style.color = '#000';
    }

    const coordTag = document.getElementById('safari-copilot-coord');
    if (coordTag) coordTag.textContent = `Pore [q:${exemplar.coord.q}, r:${exemplar.coord.r}, z:${exemplar.coord.z}]`;

    const title = document.getElementById('safari-copilot-title');
    if (title) title.textContent = exemplar.title;

    const subtitle = document.getElementById('safari-copilot-subtitle');
    if (subtitle) subtitle.textContent = exemplar.subtitle;

    const desc = document.getElementById('safari-copilot-desc');
    if (desc) desc.textContent = exemplar.naturalFunction;

    const netlistStatus = document.getElementById('safari-netlist-status');
    if (netlistStatus) netlistStatus.textContent = `Synchronized to Pore [q:${exemplar.coord.q}, r:${exemplar.coord.r}, z:${exemplar.coord.z}]`;

    const dossierLink = document.getElementById('safari-btn-dossier') as HTMLAnchorElement | null;
    if (dossierLink) dossierLink.href = exemplar.dossierUrl;

    const vBatt = document.getElementById('safari-vital-battery');
    if (vBatt) vBatt.textContent = `${exemplar.battery}T`;

    const vMatt = document.getElementById('safari-vital-matter');
    if (vMatt) vMatt.textContent = `${exemplar.matter}M`;

    const vGen = document.getElementById('safari-vital-gen');
    if (vGen) vGen.textContent = `Gen ${exemplar.generation}`;

    const vAge = document.getElementById('safari-vital-age');
    if (vAge) vAge.textContent = `${exemplar.age}T`;

    const vYield = document.getElementById('safari-vital-yield');
    if (vYield) vYield.textContent = `${exemplar.catalyticYield.toFixed(1)}×`;

    const vLand = document.getElementById('safari-vital-landauer');
    if (vLand) vLand.textContent = `${exemplar.landauerCost}T`;

    // Colony & Metazoan Morphology Deep-Link
    const colony = this.world.getColonyAt(exemplar.coord);
    const morphContainer = document.getElementById('safari-morphology-container');
    const morphBtn = document.getElementById('safari-copilot-morphology-btn');
    const morphIcon = document.getElementById('safari-copilot-morphology-icon');
    const morphText = document.getElementById('safari-copilot-morphology-text');

    if (morphContainer && morphBtn && morphText && morphIcon) {
      if (colony && colony.memberCoords.length > 1) {
        morphContainer.style.display = 'flex';
        const topology = colony.bodyTopology || 'AMORPHOUS';
        const icons: Record<string, string> = {
          'ROSETTE': '🌸',
          'COLUMNAR': '🏛️',
          'DENDRITIC': '🌲',
          'RING': '⭕',
          'FILAMENTOUS': '🧵',
          'AMORPHOUS': '🦠'
        };
        morphIcon.textContent = icons[topology] || '🧬';
        morphText.textContent = `Morphology: ${topology}`;
        morphBtn.title = `Click to inspect ${topology} Morphology Definition & Diagnostic Criteria in Glossary (triangle cliques, z-spires, arborization)`;
        morphBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          GlossaryModal.getInstance().open(topology.toLowerCase() + '_morphology');
        };
      } else {
        morphContainer.style.display = 'none';
      }
    }

    // Multicellular Metazoan Differentiated Role Breakdown
    const rolesBox = document.getElementById('safari-copilot-roles-box');
    const rolesList = document.getElementById('safari-copilot-roles-list');
    const rolesCount = document.getElementById('safari-roles-count');

    if (colony && colony.isDifferentiated && colony.differentiatedRoles && colony.differentiatedRoles.length > 0) {
      if (rolesBox) rolesBox.classList.remove('hidden');
      this.currentColonyRoles = [];
      const counts = new Map<string, number>();
      const energyMap = new Map<string, number>();
      for (const r of colony.differentiatedRoles) {
        counts.set(r.roleName, (counts.get(r.roleName) || 0) + 1);
        const pore = this.world.getPore(r.coord);
        const e = pore?.getResident()?.getBattery().getEnergy() ?? 0;
        energyMap.set(r.roleName, (energyMap.get(r.roleName) || 0) + e);
      }
      this.currentColonyRoles = Array.from(counts.keys());
      if (rolesCount) rolesCount.textContent = `${counts.size} Cell Fates (${colony.memberCoords.length} Cells)`;

      this.updateMuteToggleBtnUI();
      const muteBtn = document.getElementById('safari-role-mute-toggle');
      if (muteBtn && !muteBtn.hasAttribute('data-bound')) {
        muteBtn.setAttribute('data-bound', 'true');
        muteBtn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          this.toggleMuteNonSpecificRoles();
        });
      }

      const clearBtn = document.getElementById('safari-role-clear-btn');
      if (clearBtn) {
        clearBtn.style.display = this.activeRoleHighlightName ? 'inline-flex' : 'none';
        if (!clearBtn.hasAttribute('data-bound')) {
          clearBtn.setAttribute('data-bound', 'true');
          clearBtn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            this.selectRoleHighlight(null);
          });
        }
      }

      if (rolesList) {
        rolesList.innerHTML = '';

        // Dedicated 'All Cell Fates / Deselect' Pill
        const allPill = document.createElement('div');
        allPill.className = 'safari-role-pill';
        allPill.setAttribute('data-role', '__all__');
        if (!this.activeRoleHighlightName) allPill.classList.add('active');
        allPill.style.borderColor = 'rgba(56, 189, 248, 0.4)';
        allPill.innerHTML = `<span>👁️</span> <span>All Cell Fates</span> <span style="font-size:0.68rem;opacity:0.85;color:#38bdf8;">(${colony.memberCoords.length} Cells)</span> <span style="font-size:0.62rem;opacity:0.6;background:#1e293b;padding:1px 5px;border-radius:3px;margin-left:auto;font-family:monospace;">[0]</span>`;
        allPill.title = 'Click (or press [0] / Esc) to deselect role isolation and view all colony cells simultaneously';
        allPill.addEventListener('click', (ev) => {
          ev.stopPropagation();
          this.selectRoleHighlight(null);
        });
        rolesList.appendChild(allPill);

        const roleIcons: Record<string, { icon: string; color: string; border: string }> = {
          'Trophocyte': { icon: '🌾', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.4)' },
          'Somatic Shield': { icon: '🛡️', color: '#38bdf8', border: 'rgba(56, 189, 248, 0.4)' },
          'Pacemaker': { icon: '⚡', color: '#ec4899', border: 'rgba(236, 72, 153, 0.4)' },
          'Basalt Anchor': { icon: '⚓', color: '#10b981', border: 'rgba(16, 185, 129, 0.4)' },
          'Catalyst': { icon: '💎', color: '#06b6d4', border: 'rgba(6, 182, 212, 0.4)' }
        };

        this.currentColonyRoles.forEach((roleName, idx) => {
          const cnt = counts.get(roleName) || 0;
          const eSum = energyMap.get(roleName) || 0;
          const pct = Math.round((cnt / colony.memberCoords.length) * 100);
          const pill = document.createElement('div');
          pill.className = 'safari-role-pill';
          pill.setAttribute('data-role', roleName);
          if (this.activeRoleHighlightName === roleName) pill.classList.add('active');

          const matchKey = Object.keys(roleIcons).find(k => roleName.includes(k));
          const meta = (matchKey ? roleIcons[matchKey] : null) || { icon: '🧬', color: '#a855f7', border: 'rgba(168, 85, 247, 0.4)' };
          pill.style.borderColor = meta.border;
          pill.innerHTML = `<span style="color:${meta.color};">${meta.icon}</span> <span>${roleName}</span> <span style="font-size:0.68rem;opacity:0.85;color:${meta.color};">(${cnt} • ${pct}% • ${eSum} eU)</span> <span style="font-size:0.62rem;opacity:0.6;background:#1e293b;padding:1px 5px;border-radius:3px;margin-left:auto;font-family:monospace;">[${idx + 1}]</span>`;
          pill.title = `Click (or press [${idx + 1}] / Tab) to isolate ${roleName} cells (${cnt} cells, ${eSum} eU total charge)`;

          pill.addEventListener('click', (ev) => {
            ev.stopPropagation();
            if (this.activeRoleHighlightName === roleName) {
              this.selectRoleHighlight(null);
            } else {
              this.selectRoleHighlight(roleName);
            }
          });
          rolesList.appendChild(pill);
        });
      }
    } else {
      if (rolesBox) rolesBox.classList.add('hidden');
      this.currentColonyRoles = [];
      this.activeRoleHighlightName = null;
      this.onRoleHighlightSelected?.(null);
    }
  }

  public freezeActiveSpecimenToBioBank(): void {
    if (this.currentScopeExemplar) {
      const p = this.world.getPore(this.currentScopeExemplar.coord);
      const cell = p?.getResident();
      if (cell) {
        const bioBank = BioBank.getInstance();
        const colony = this.world.getColonyAt(this.currentScopeExemplar.coord);
        const record = bioBank.saveSilicoid({
          name: this.currentScopeExemplar.title,
          taxonBinomial: this.currentScopeExemplar.subtitle.split('•')[0].trim(),
          commonName: this.currentScopeExemplar.title,
          tapeBitstring: cell.getSafe().getTape(),
          gateCount: cell.getWorkshop().getGates().length,
          gateTypes: cell.getWorkshop().getGateTypeNames(),
          generation: cell.getGeneration(),
          savedAtEpoch: this.world.getTickCount(),
          isDifferentiated: colony?.isDifferentiated ?? false,
          bodyTopology: colony?.bodyTopology ?? cell.getMorphogeneticPlan().preferredTopology,
          notes: this.currentScopeExemplar.naturalFunction
        });
        this.showToast(`🧊 Frozen to Bio-Bank: "${record.name}"!`);
      } else {
        this.showToast('⚠️ No resident cell found at this coordinate.');
      }
    } else {
      this.showToast('⚠️ No active specimen selected in Safari.');
    }
  }

  public showToast(message: string): void {
    if (!this.toastEl) return;
    this.toastEl.textContent = message;
    this.toastEl.classList.remove('hidden');
    this.toastEl.style.opacity = '1';
    this.toastEl.style.transform = 'translateX(-50%) translateY(0)';

    setTimeout(() => {
      if (this.toastEl) {
        this.toastEl.style.opacity = '0';
        this.toastEl.style.transform = 'translateX(-50%) translateY(10px)';
        setTimeout(() => this.toastEl?.classList.add('hidden'), 300);
      }
    }, 2800);
  }

  private render(): void {
    if (!this.currentTelemetry) return;
    const tele = this.currentTelemetry;
    this.lastRenderedTick = tele.tick;

    // Scan for all living exemplars across the seafloor
    this.activeExemplars = this.scanExemplars(tele);

    // 1. Render Tour Hub
    this.renderTourHub();

    // 2. Render Column 1: Macro Novelties (Biosphere)
    this.renderMacroNovelties();

    // 3. Render Column 2: Micro In-Situ Autopsy (Engine)
    this.renderMicroAutopsy(tele);

    // 4. Render Column 3: Selective Barriers & Actionable Stewardship
    this.renderBarriersAndStewardship(tele);
  }

  private renderTourHub(): void {
    const hubEl = document.getElementById('naturalist-tour-hub');
    if (!hubEl) return;

    const filtered = this.activeCategory === 'all'
      ? this.activeExemplars
      : this.activeExemplars.filter(e => e.category === this.activeCategory);

    const superCount = this.activeExemplars.filter(e => e.category === 'super').length;
    const trophicCount = this.activeExemplars.filter(e => e.category === 'trophic').length;
    const circuitCount = this.activeExemplars.filter(e => e.category === 'circuit').length;

    const tray = document.getElementById('tour-specimens-tray');
    const savedScrollLeft = tray ? tray.scrollLeft : 0;

    hubEl.innerHTML = `
      <div class="naturalist-tour-filter-group" style="flex-shrink:0;">
        <span class="tour-label">🧭 Expeditions:</span>
        <button class="tour-filter-pill ${this.activeCategory === 'all' ? 'active' : ''}" data-cat="all">All (${this.activeExemplars.length})</button>
        <button class="tour-filter-pill ${this.activeCategory === 'super' ? 'active' : ''}" data-cat="super">🏛️ Super (${superCount})</button>
        <button class="tour-filter-pill ${this.activeCategory === 'trophic' ? 'active' : ''}" data-cat="trophic">⚡ Trophic (${trophicCount})</button>
        <button class="tour-filter-pill ${this.activeCategory === 'circuit' ? 'active' : ''}" data-cat="circuit">🔬 Circuits (${circuitCount})</button>
      </div>

      <button id="btn-guided-safari" class="tour-btn tour-btn-safari" style="flex-shrink:0;" title="Cycle sequentially through all living emergent phenotypes across the seafloor">
        🚀 Guided Safari ►
      </button>

      <div class="naturalist-tour-specimens-tray" id="tour-specimens-tray">
        ${filtered.map(ex => `
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

    const newTray = document.getElementById('tour-specimens-tray');
    if (newTray && savedScrollLeft > 0) {
      newTray.scrollLeft = savedScrollLeft;
    }
  }

  private renderMacroNovelties(): void {
    const listEl = document.getElementById('naturalist-novelties-list');
    const badgeEl = document.getElementById('novelties-count-badge');
    if (!listEl) return;

    if (badgeEl) {
      badgeEl.textContent = `${this.activeExemplars.length} Active`;
    }

    if (this.activeExemplars.length === 0) {
      listEl.innerHTML = `
        <div style="color:#64748b;font-style:italic;text-align:center;padding:24px 10px;">
          Seafloor in primordial state. Run the simulation to witness spontaneous macro-emergence.
        </div>
      `;
      return;
    }

    const cardsHtml = this.activeExemplars.map(ex => `
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

    listEl.innerHTML = cardsHtml;
  }

  private renderMicroAutopsy(tele: ISimulationTelemetry): void {
    const inspectEl = document.getElementById('naturalist-inspection-card');
    if (!inspectEl) return;

    if (this.selectedPore && this.selectedPore.state === 'OCCUPIED') {
      const p = this.selectedPore;
      const taxon = TaxonomyNomenclature.classify({
        tapeBitstring: p.tapeBitstring,
        gateTypes: p.gateTypes,
        generation: p.generation,
        isBasalt: p.isBasalt,
        hasOrganelle: p.hasOrganelle,
        isSyncytium: p.isSyncytium
      });

      const gatesStr = p.gateTypes && p.gateTypes.length > 0
        ? p.gateTypes.join(' ➔ ')
        : 'None (Direct Porin Influx)';

      // Check if this pore belongs to a differentiated syncytium
      const syncColony = tele.syncytialColonies?.find(c => c.memberCoords.some(m => m.equals(p.coord)));
      const syncRole = syncColony?.differentiatedRoles?.find(r => r.coord.equals(p.coord));

      // Determine specific biophysical dossier for this inspected pore
      let poreDossierUrl = EpistemicDossierRegistry.getDossierUrl('VENT_FEEDER');
      let poreDossierLabel = '📖 Field Dossier ↗';

      const poreMilestone = this.world.getPaleontologist().getMilestones().find(m => m.poreCoord.equals(p.coord));
      if (poreMilestone) {
        poreDossierUrl = EpistemicDossierRegistry.getDossierUrl(poreMilestone.motif.type);
        poreDossierLabel = `📖 Specimen Dossier (${poreMilestone.motif.name}) ↗`;
      } else if (p.isSyncytium) {
        poreDossierUrl = EpistemicDossierRegistry.getDossierUrl('SYNCYTIAL_MULTICELLULARITY');
        poreDossierLabel = '📖 Syncytium Dossier ↗';
      } else if (p.hasOrganelle) {
        poreDossierUrl = EpistemicDossierRegistry.getDossierUrl('ENDOSYMBIONT_EMERGENCE');
        poreDossierLabel = '📖 Endosymbiont Dossier ↗';
      } else if (p.hasSpore || p.isAqueous) {
        poreDossierUrl = EpistemicDossierRegistry.getDossierUrl('PELAGIC_SPORULATION_EMERGENCE');
        poreDossierLabel = '📖 Pelagic Spore Dossier ↗';
      } else if (p.isBasalt) {
        poreDossierUrl = EpistemicDossierRegistry.getDossierUrl('BASALT_LITHOTROPH');
        poreDossierLabel = '📖 Basalt Lithotroph Dossier ↗';
      } else {
        poreDossierUrl = EpistemicDossierRegistry.getDossierUrl('VENT_FEEDER');
        poreDossierLabel = '📖 Chemiosmotic Autotroph Dossier ↗';
      }

      inspectEl.innerHTML = `
        <div class="inspect-header">
          <div>
            <div class="inspect-taxon">${taxon.binomialName}</div>
            <div class="inspect-common">${taxon.commonName}</div>
          </div>
          <span class="inspect-coord">[q:${p.coord.q}, r:${p.coord.r}, z:${p.coord.z}]</span>
        </div>
        <div class="inspect-grid">
          <div class="inspect-stat"><span class="stat-lbl">Battery:</span> <span class="stat-val" style="color:#10b981;">${p.energy} T</span></div>
          <div class="inspect-stat"><span class="stat-lbl">Matter:</span> <span class="stat-val" style="color:#38bdf8;">${p.matter} M</span></div>
          <div class="inspect-stat"><span class="stat-lbl">Gen:</span> <span class="stat-val">${p.generation}</span></div>
          <div class="inspect-stat"><span class="stat-lbl">Age:</span> <span class="stat-val">${p.age} Ticks</span></div>
          <div class="inspect-stat"><span class="stat-lbl">Gates:</span> <span class="stat-val" style="color:#facc15;">${p.gateCount}</span></div>
          <div class="inspect-stat"><span class="stat-lbl">Landauer:</span> <span class="stat-val" style="color:#fb923c;">${p.toggleCount} T</span></div>
        </div>
        <div class="inspect-circuit-box">
          <div class="circuit-lbl">Logic Netlist Topology:</div>
          <div class="circuit-path">${gatesStr}</div>
          <div class="circuit-plain">
            ${this.describeCircuitPlain(p)}
          </div>
        </div>
        ${p.isSyncytium ? `
          <div class="inspect-sync-tag">
            🟣 Member of Syncytium (${p.syncytiumMemberCount ?? 0} total pores connected)
            ${syncRole ? `
              <div style="margin-top:4px;font-size:0.68rem;color:#e9d5ff;border-top:1px dashed rgba(168,85,247,0.4);padding-top:3px;">
                <strong>Differentiated Tissue Fate:</strong> ${syncRole.roleName}<br>
                <span style="color:#94a3b8;">Expression: [${syncRole.expressionSignature}] • Spatial Division of Labor</span>
              </div>
            ` : ''}
          </div>
        ` : ''}
        ${p.hasOrganelle ? `
          <div class="inspect-sync-tag" style="color:#facc15;border-color:rgba(250,204,21,0.4);background:rgba(250,204,21,0.12);">
            🪐 Hosts Endosymbiotic Organelle Cassette (+15T Auxiliary Yield)
          </div>
        ` : ''}
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px;gap:6px;">
          <button id="btn-inspect-open-microscope" class="field-scope-btn" style="border-color:#00e5ff;color:#00e5ff;">
            🔬 Open Live Circuit Microscope
          </button>
          <a href="${poreDossierUrl}" target="_blank" rel="noopener noreferrer" class="dossier-link" title="Open dedicated biophysical field dossier for this specimen">
            ${poreDossierLabel}
          </a>
        </div>
      `;
    } else {
      inspectEl.innerHTML = `
        <div style="color:#64748b;font-style:italic;text-align:center;padding:32px 10px;">
          Click any silicoid on the seafloor to view an intuitive plain-English breakdown of its circuit, role in the colony, and energetic thrift.
        </div>
      `;
    }
  }

  private renderBarriersAndStewardship(tele: ISimulationTelemetry): void {
    const barriersEl = document.getElementById('naturalist-barriers-box');
    if (!barriersEl) return;

    const diagnostics = this.world.getHistoryTracker().auditBarriers(this.world, tele);

    if (diagnostics.length === 0) {
      barriersEl.innerHTML = `
        <div style="color:#10b981;font-style:italic;text-align:center;padding:24px 10px;">
          ✓ Seafloor in healthy ecological balance. No critical evolutionary bottlenecks detected.
        </div>
      `;
      return;
    }

    const items = diagnostics.map(d => {
      const actions = this.getStewardshipActionsForBarrier(d);
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
    });

    barriersEl.innerHTML = items.join('');
  }

  private getStewardshipActionsForBarrier(diagnostic: IBarrierDiagnostic): { label: string; actionFn: () => void }[] {
    switch (diagnostic.code) {
      case 'COALESCENCE_MONOCULTURE':
      case 'ENDOSYMBIOSIS_BLOCKED_BY_MONOCULTURE':
        return [
          {
            label: '💥 Magmatic Tremor (Rifting)',
            actionFn: () => {
              this.world.triggerGeologicalEvent(GeologicalEventType.MAGMATIC_TREMOR);
              this.showToast('💥 Magmatic tremor triggered! New basalt fissures opened.');
            }
          },
          {
            label: '🌱 Inoculate Rival Lineage',
            actionFn: () => {
              document.getElementById('brush-inoculate')?.click();
              this.close();
              this.showToast('🌱 Inoculate Brush active: click any vacant pore to seed a new lineage!');
            }
          },
          {
            label: '🧬 Boost Mutation Rate (+1.5%)',
            actionFn: () => {
              const cur = this.world.getMutationRate();
              this.world.setMutationRate(Math.min(0.08, cur + 0.015));
              this.showToast(`🧬 Mutation rate increased to ${(this.world.getMutationRate() * 100).toFixed(2)}%`);
            }
          }
        ];

      case 'SYNCYTIAL_MONOPOLY':
        return [
          {
            label: '⚡ Local Lysis Pulse',
            actionFn: () => {
              this.world.triggerExtinctionEvent(this.world.getVent().nozzleCoord, 2);
              this.showToast('⚡ Localized lysis pulse triggered across central colony.');
            }
          },
          {
            label: '🧱 Erect Basalt Barrier',
            actionFn: () => {
              document.getElementById('brush-basalt')?.click();
              this.close();
              this.showToast('🧱 Basalt Brush active: click pores to erect barriers and halt expansion!');
            }
          }
        ];

      case 'LANDAUER_COMPLEXITY_RAZOR':
        return [
          {
            label: '🧪 Heavy Metal Toxic Spike',
            actionFn: () => {
              this.world.triggerGeologicalEvent(GeologicalEventType.TOXIC_HEAVY_METAL_SPIKE);
              this.showToast('🧪 Toxic spike injected! Selecting for protective NOT inverters.');
            }
          },
          {
            label: '🔥 Boiling Surge (+200E)',
            actionFn: () => {
              this.world.triggerThermalSurge(200);
              this.showToast('🔥 Boiling surge injected! High redox enthalpy available.');
            }
          }
        ];

      default:
        return [
          {
            label: '❄️ Marine Snow Detritus',
            actionFn: () => {
              this.world.triggerGeologicalEvent(GeologicalEventType.MARINE_SNOW_STORM);
              this.showToast('❄️ Marine snow detrital storm precipitated across seafloor.');
            }
          }
        ];
    }
  }

  private describeCircuitPlain(pore: IPoreTelemetry): string {
    const gates = pore.gateTypes ?? [];
    if (gates.length === 0) {
      return 'Passive diffusion cell: directly absorbs substrate without catalytic gate filtering.';
    }
    const hasAnd = gates.includes('AND');
    const hasNot = gates.includes('NOT');
    const hasOr = gates.includes('OR');
    const hasXor = gates.includes('XOR');

    if (hasXor && hasAnd) {
      return 'Turing Half-Adder Parity Engine: computes simultaneous XOR discrimination and AND carry bit, performing true 1-bit digital arithmetic on dual substrate inputs.';
    } else if (hasAnd && hasNot) {
      return 'Feed-Forward / Inverter Shield: couples co-catalytic fuel harvesting with an allosteric NOT gate to suppress power drain during toxic spikes.';
    } else if (hasOr && hasNot) {
      return 'Adaptable Threshold Filter: fires on either substrate stream but closes porin channels during acidic or cryogenic incursions.';
    } else if (hasAnd) {
      return 'Co-catalytic Specialist: couples Stream A fuel with alkaline oxidizer, maximizing energy yield at the hydrothermal vent plume.';
    } else if (hasOr) {
      return 'Promiscuous Dietary Generalist: burns either substrate stream indiscriminately to survive in peripheral low-nutrient zones.';
    }
    return `Specialized netlist composed of ${gates.length} logic operators tuned by Landauer efficiency.`;
  }
}
