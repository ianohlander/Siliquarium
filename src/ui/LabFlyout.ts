import { buildBioBankEmptyHtml, buildBioBankListHtml } from './LabFlyoutHtmlTemplate.js';
/**
 * 🐠 Siliquarium UI Subsystem
 * LabFlyout: Real-time Parameter Tuning Flyout Drawer & God Panel.
 * Siliquarium Design Studio & World Builder: Geomorphology Sculptor,
 * Lenski Bio-Library Inoculator, Geodynamics Engine, and First-Law Telemetry.
 */

import { HexCoord3D } from '../core/spatial/HexCoord3D.js';
import { SimulationWorld, INewSiliquariumOptions } from '../engine/SimulationWorld.js';
import { SeafloorRenderer3D } from '../visualizers/SeafloorRenderer3D.js';
import { GeologicalEventType, IGeologicalConfig } from '../engine/environment/GeologicalPressuresEngine.js';
import { ISimulationTelemetry, IPoreTelemetry } from '../engine/SimulationTelemetry.js';
import { PoreState } from '../core/domain/Pore.js';
import { TaxonomyNomenclature } from '../core/paleontology/TaxonomyNomenclature.js';
import { BioBank } from '../engine/storage/BioBank.js';
import { EnvironmentPresetRegistry, ISiliquariumEnvironmentPreset } from '../engine/storage/EnvironmentPresetRegistry.js';
import { GenomeSafe } from '../core/domain/GenomeSafe.js';
import { AudioSynthesizer } from './AudioSynthesizer.js';

export type StudioBrushMode = 'select' | 'basalt' | 'excavate' | 'inoculate' | 'clear' | 'trench' | 'vent' | 'lenski_dropper' | 'pipette';

export interface ILabCallbacks {
  readonly onSeedRequested: (density: number) => void;
  readonly onResetRequested: () => void;
  readonly onThermalPulseRequested: () => void;
  readonly onExtinctionRequested: () => void;
  readonly onApplySettingsRequested?: (config: {
    ventCoord: HexCoord3D;
    offshootCount: number;
    mutationRate: number;
    duplicationRate?: number;
    deletionRate?: number;
    plumeWandering: boolean;
    regimeCycling: boolean;
    terrainRoughness?: number;
    basaltDensity?: number;
    maxZ?: number;
  }) => void;
  readonly onRestartWithConfigRequested?: (config: {
    radius: number;
    minZ?: number;
    maxZ?: number;
    basaltDensity: number;
    terrainRoughness: number;
    soupDensity: number;
    mutationRate: number;
    duplicationRate?: number;
    deletionRate?: number;
    ventCoord: HexCoord3D;
    offshootCount: number;
  }) => void;
  readonly onBrushModeChanged?: (mode: StudioBrushMode) => void;
  readonly onPresetLoaded?: (preset: ISiliquariumEnvironmentPreset) => void;
  readonly onNewRequested?: (options: INewSiliquariumOptions) => void;
  readonly onBeginSimulationRequested?: () => void;
  readonly onApplyToCurrentRequested?: () => void;
  readonly onCancelRequested?: () => void;
  readonly onUndoRequested?: () => void;
  readonly onRedoRequested?: () => void;
  readonly onInoculateAndBeginRequested?: () => void;
  readonly onBeginSterileRequested?: () => void;
  readonly getSelectedCoord?: () => HexCoord3D | null;
  readonly onSelectCoordRequested?: (coord: HexCoord3D) => void;
  readonly onFocusMicroscopeRequested?: () => void;
  readonly onOpenAutopsyRequested?: () => void;
  readonly onFreezeStagedRequested?: () => void;
  readonly onCloseRequested?: () => void;
  readonly onOpenRequested?: () => void;
}

export class LabFlyout {
  private readonly world: SimulationWorld;
  private readonly callbacks: ILabCallbacks;
  private readonly renderer?: SeafloorRenderer3D;
  private readonly onLayerChanged?: () => void;
  private isOpen: boolean = false;

  private drawerEl: HTMLElement | null = null;
  private studioDrawerEl: HTMLElement | null = null;
  private toggleBtn: HTMLElement | null = null;
  private closeXBtn: HTMLElement | null = null;
  private bottomCloseBtn: HTMLElement | null = null;
  private backdropEl: HTMLElement | null = null;
  private statusBadge: HTMLElement | null = null;

  // Studio Ribbon Bar
  private btnStudioNew: HTMLElement | null = null;
  private studioPresetSelect: HTMLSelectElement | null = null;
  private btnStudioSave: HTMLElement | null = null;
  private btnStudioExport: HTMLElement | null = null;
  private btnStudioImport: HTMLElement | null = null;
  private studioFileInput: HTMLInputElement | null = null;
  private btnStudioResetFounders: HTMLElement | null = null;
  private btnStudioLaunch: HTMLElement | null = null;
  private btnStudioApplyCurrent: HTMLElement | null = null;
  private btnStudioCancel: HTMLElement | null = null;
  private btnStudioUndo: HTMLButtonElement | null = null;
  private btnStudioRedo: HTMLButtonElement | null = null;

  // Sterile Launch Modal Elements
  private modalSterileLaunch: HTMLElement | null = null;
  private btnSterileClose: HTMLElement | null = null;
  private btnSterileInoculate: HTMLElement | null = null;
  private btnSterileContinue: HTMLElement | null = null;
  private btnSterileCancel: HTMLElement | null = null;

  // New Siliquarium Architect Modal Elements
  private modalNewSiliquarium: HTMLElement | null = null;
  private btnCreateNewClose: HTMLElement | null = null;
  private tabNewBlank: HTMLElement | null = null;
  private tabNewProcedural: HTMLElement | null = null;
  private paneNewBlank: HTMLElement | null = null;
  private paneNewProcedural: HTMLElement | null = null;

  // Blank Canvas elements
  private selectNewRadius: HTMLSelectElement | null = null;
  private selectNewBlankMinZ: HTMLSelectElement | null = null;
  private selectNewBlankMaxZ: HTMLSelectElement | null = null;
  private wrapperBlankSubstrate: HTMLElement | null = null;
  private selectNewBlankSubstrate: HTMLSelectElement | null = null;
  private selectNewTemplate: HTMLSelectElement | null = null;
  private btnCreateNewCancel: HTMLElement | null = null;
  private btnCreateNewConfirm: HTMLElement | null = null;

  // Procedural Generator elements
  private selectProcRadius: HTMLSelectElement | null = null;
  private selectProcMinZ: HTMLSelectElement | null = null;
  private wrapperProcNiches: HTMLElement | null = null;
  private sliderProcNiches: HTMLInputElement | null = null;
  private labelProcNichesVal: HTMLElement | null = null;
  private sliderProcBasalt: HTMLInputElement | null = null;
  private labelProcBasaltVal: HTMLElement | null = null;
  private sliderProcRoughness: HTMLInputElement | null = null;
  private labelProcRoughnessVal: HTMLElement | null = null;
  private sliderProcSpire: HTMLInputElement | null = null;
  private labelProcSpireVal: HTMLElement | null = null;
  private sliderProcOffshoots: HTMLInputElement | null = null;
  private labelProcOffshootsVal: HTMLElement | null = null;
  private inputProcSeed: HTMLInputElement | null = null;
  private btnProcReroll: HTMLElement | null = null;
  private btnCreateProcCancel: HTMLElement | null = null;
  private btnCreateProcConfirm: HTMLElement | null = null;

  // Initial Seeding Strategy Elements
  private selectBlankSeeding: HTMLSelectElement | null = null;
  private selectProcSeeding: HTMLSelectElement | null = null;

  // Studio Quick Seed Menu
  private btnStudioSeedMenu: HTMLElement | null = null;
  private studioSeedDropdown: HTMLElement | null = null;
  private btnSeedAutoEco: HTMLElement | null = null;
  private btnSeedSoup20: HTMLElement | null = null;
  private btnSeedBioBankAll: HTMLElement | null = null;
  private btnSeedPurgeAll: HTMLElement | null = null;

  // Guided Creation Workflow Breadcrumbs
  private workflowSteps: NodeListOf<HTMLElement> | null = null;

  // Technical CAD Status Strip
  private studioStatusCoord: HTMLElement | null = null;
  private studioStatusTool: HTMLElement | null = null;
  private studioStatusLattice: HTMLElement | null = null;

  // Tab Navigation Elements
  private tabButtons: NodeListOf<HTMLButtonElement> | null = null;
  private tabPanes: NodeListOf<HTMLElement> | null = null;

  // Inoculator Elements
  private btnInoculateDualBasin: HTMLElement | null = null;
  private btnBrushInoculate: HTMLElement | null = null;
  private pipetteStatusDesc: HTMLElement | null = null;

  // Geodynamics Elements
  private masterGeoSlider: HTMLInputElement | null = null;
  private masterGeoLabel: HTMLElement | null = null;
  private geoTickerEl: HTMLElement | null = null;

  // Viewport Clarity Filters
  private chkFilterConduits: HTMLInputElement | null = null;
  private chkFilterAuras: HTMLInputElement | null = null;
  private chkFilterTrophic: HTMLInputElement | null = null;
  private chkCalmMotion: HTMLInputElement | null = null;

  // Configuration Sliders & Elements
  private mutationSlider: HTMLInputElement | null = null;
  private mutationValLabel: HTMLElement | null = null;
  private duplicationSlider: HTMLInputElement | null = null;
  private duplicationValLabel: HTMLElement | null = null;
  private deletionSlider: HTMLInputElement | null = null;
  private deletionValLabel: HTMLElement | null = null;
  private soupSlider: HTMLInputElement | null = null;
  private soupValLabel: HTMLElement | null = null;

  private basaltSlider: HTMLInputElement | null = null;
  private basaltValLabel: HTMLElement | null = null;
  private roughnessSlider: HTMLInputElement | null = null;
  private roughnessValLabel: HTMLElement | null = null;
  private spireHeightSlider: HTMLInputElement | null = null;
  private spireHeightLabel: HTMLElement | null = null;

  private ventQSlider: HTMLInputElement | null = null;
  private ventRSlider: HTMLInputElement | null = null;
  private ventCoordLabel: HTMLElement | null = null;
  private offshootsSlider: HTMLInputElement | null = null;
  private offshootsValLabel: HTMLElement | null = null;

  private chkWandering: HTMLInputElement | null = null;
  private chkRegimes: HTMLInputElement | null = null;

  private bioBankListEl: HTMLElement | null = null;
  private bioBankStatusBadge: HTMLElement | null = null;
  private bioBankExportBtn: HTMLElement | null = null;
  private bioBankImportBtn: HTMLElement | null = null;
  private bioBankFileInput: HTMLInputElement | null = null;

  private selectedRadius: number = 5;
  private activeBrushMode: StudioBrushMode = 'select';
  private targetZLayer: 'auto' | number = 'auto';

  constructor(
    world: SimulationWorld,
    callbacks: ILabCallbacks,
    renderer?: SeafloorRenderer3D,
    onLayerChanged?: () => void
  ) {
    this.world = world;
    this.callbacks = callbacks;
    this.renderer = renderer;
    this.onLayerChanged = onLayerChanged;
    this.initElements();
  }

  private initElements(): void {
    this.drawerEl = document.getElementById('lab-drawer');
    this.studioDrawerEl = document.getElementById('studio-drawer');
    this.toggleBtn = document.getElementById('lab-toggle-btn');
    this.closeXBtn = document.getElementById('lab-close-x');
    this.bottomCloseBtn = document.getElementById('btn-close-drawer-bottom');
    this.backdropEl = document.getElementById('lab-backdrop');
    this.statusBadge = document.getElementById('lab-status-badge');

    // Studio Ribbon Bar
    this.btnStudioNew = document.getElementById('btn-studio-new');
    this.studioPresetSelect = document.getElementById('studio-preset-select') as HTMLSelectElement | null;
    this.btnStudioSave = document.getElementById('btn-studio-save');
    this.btnStudioExport = document.getElementById('btn-studio-export');
    this.btnStudioImport = document.getElementById('btn-studio-import');
    this.studioFileInput = document.getElementById('studio-file-input') as HTMLInputElement | null;
    this.btnStudioResetFounders = document.getElementById('btn-studio-reset-founders');
    this.btnStudioLaunch = document.getElementById('btn-studio-launch');
    this.btnStudioApplyCurrent = document.getElementById('btn-studio-apply-current');
    this.btnStudioCancel = document.getElementById('btn-studio-cancel');
    this.btnStudioUndo = document.getElementById('btn-studio-undo') as HTMLButtonElement | null;
    this.btnStudioRedo = document.getElementById('btn-studio-redo') as HTMLButtonElement | null;

    // Sterile Environment Launch Modal
    this.modalSterileLaunch = document.getElementById('modal-sterile-launch');
    this.btnSterileClose = document.getElementById('btn-sterile-close');
    this.btnSterileInoculate = document.getElementById('btn-sterile-inoculate');
    this.btnSterileContinue = document.getElementById('btn-sterile-continue');
    this.btnSterileCancel = document.getElementById('btn-sterile-cancel');

    // New Siliquarium Architect Modal
    this.modalNewSiliquarium = document.getElementById('modal-new-siliquarium');
    this.btnCreateNewClose = document.getElementById('btn-create-new-close');
    this.tabNewBlank = document.getElementById('tab-new-blank');
    this.tabNewProcedural = document.getElementById('tab-new-procedural');
    this.paneNewBlank = document.getElementById('pane-new-blank');
    this.paneNewProcedural = document.getElementById('pane-new-procedural');

    this.selectNewRadius = document.getElementById('new-siliquarium-radius') as HTMLSelectElement | null;
    this.selectNewBlankMinZ = document.getElementById('new-blank-minz') as HTMLSelectElement | null;
    this.selectNewBlankMaxZ = document.getElementById('new-blank-maxz') as HTMLSelectElement | null;
    this.wrapperBlankSubstrate = document.getElementById('wrapper-blank-substrate');
    this.selectNewBlankSubstrate = document.getElementById('new-blank-substrate') as HTMLSelectElement | null;
    this.selectNewTemplate = document.getElementById('new-siliquarium-template') as HTMLSelectElement | null;
    this.btnCreateNewCancel = document.getElementById('btn-create-new-cancel');
    this.btnCreateNewConfirm = document.getElementById('btn-create-new-confirm');

    this.selectProcRadius = document.getElementById('new-proc-radius') as HTMLSelectElement | null;
    this.selectProcMinZ = document.getElementById('new-proc-minz') as HTMLSelectElement | null;
    this.wrapperProcNiches = document.getElementById('wrapper-proc-niches');
    this.sliderProcNiches = document.getElementById('slider-proc-niches') as HTMLInputElement | null;
    this.labelProcNichesVal = document.getElementById('label-proc-niches-val');
    this.sliderProcBasalt = document.getElementById('slider-proc-basalt') as HTMLInputElement | null;
    this.labelProcBasaltVal = document.getElementById('label-proc-basalt-val');
    this.sliderProcRoughness = document.getElementById('slider-proc-roughness') as HTMLInputElement | null;
    this.labelProcRoughnessVal = document.getElementById('label-proc-roughness-val');
    this.sliderProcSpire = document.getElementById('slider-proc-spire') as HTMLInputElement | null;
    this.labelProcSpireVal = document.getElementById('label-proc-spire-val');
    this.sliderProcOffshoots = document.getElementById('slider-proc-offshoots') as HTMLInputElement | null;
    this.labelProcOffshootsVal = document.getElementById('label-proc-offshoots-val');
    this.inputProcSeed = document.getElementById('input-proc-seed') as HTMLInputElement | null;
    this.btnProcReroll = document.getElementById('btn-proc-reroll');
    this.btnCreateProcCancel = document.getElementById('btn-create-proc-cancel');
    this.btnCreateProcConfirm = document.getElementById('btn-create-proc-confirm');

    // Initial Seeding Strategy Elements
    this.selectBlankSeeding = document.getElementById('select-blank-seeding') as HTMLSelectElement | null;
    this.selectProcSeeding = document.getElementById('select-proc-seeding') as HTMLSelectElement | null;

    // Studio Quick Seed Menu Elements
    this.btnStudioSeedMenu = document.getElementById('btn-studio-seed-menu');
    this.studioSeedDropdown = document.getElementById('studio-seed-dropdown');
    this.btnSeedAutoEco = document.getElementById('btn-seed-auto-eco');
    this.btnSeedSoup20 = document.getElementById('btn-seed-soup-20');
    this.btnSeedBioBankAll = document.getElementById('btn-seed-biobank-all');
    this.btnSeedPurgeAll = document.getElementById('btn-seed-purge-all');

    // Guided Creation Workflow Breadcrumbs
    this.workflowSteps = document.querySelectorAll('.workflow-step');

    // Technical CAD Status Strip
    this.studioStatusCoord = document.getElementById('studio-status-coord');
    this.studioStatusTool = document.getElementById('studio-status-tool');
    this.studioStatusLattice = document.getElementById('studio-status-lattice');

    // Tab Navigation
    this.tabButtons = document.querySelectorAll('.lab-tab-btn');
    this.tabPanes = document.querySelectorAll('.lab-tab-pane');

    // Inoculator Elements
    this.btnInoculateDualBasin = document.getElementById('btn-inoculate-dual-basin');
    this.btnBrushInoculate = document.getElementById('btn-arm-pipette') || document.getElementById('brush-inoculate');
    this.pipetteStatusDesc = document.getElementById('pipette-status-desc');

    // Geodynamics Controls
    this.masterGeoSlider = document.getElementById('slider-geo-master') as HTMLInputElement | null;
    this.masterGeoLabel = document.getElementById('label-geo-master-val');
    this.geoTickerEl = document.getElementById('geo-event-ticker');

    // Viewport Clarity Filters
    this.chkFilterConduits = document.getElementById('chk-filter-conduits') as HTMLInputElement | null;
    this.chkFilterAuras = document.getElementById('chk-filter-auras') as HTMLInputElement | null;
    this.chkFilterTrophic = document.getElementById('chk-filter-trophic') as HTMLInputElement | null;
    this.chkCalmMotion = document.getElementById('chk-calm-motion') as HTMLInputElement | null;

    this.mutationSlider = document.getElementById('slider-mutation') as HTMLInputElement | null;
    this.mutationValLabel = document.getElementById('label-mutation-val');
    this.duplicationSlider = document.getElementById('slider-duplication') as HTMLInputElement | null;
    this.duplicationValLabel = document.getElementById('label-duplication-val');
    this.deletionSlider = document.getElementById('slider-deletion') as HTMLInputElement | null;
    this.deletionValLabel = document.getElementById('label-deletion-val');
    this.soupSlider = document.getElementById('slider-soup') as HTMLInputElement | null;
    this.soupValLabel = document.getElementById('label-soup-val');

    this.basaltSlider = document.getElementById('slider-basalt') as HTMLInputElement | null;
    this.basaltValLabel = document.getElementById('label-basalt-val');
    this.roughnessSlider = document.getElementById('slider-roughness') as HTMLInputElement | null;
    this.roughnessValLabel = document.getElementById('label-roughness-val');
    this.spireHeightSlider = document.getElementById('slider-spire-height') as HTMLInputElement | null;
    this.spireHeightLabel = document.getElementById('label-spire-height-val');

    this.ventQSlider = document.getElementById('slider-vent-q') as HTMLInputElement | null;
    this.ventRSlider = document.getElementById('slider-vent-r') as HTMLInputElement | null;
    this.ventCoordLabel = document.getElementById('label-vent-coord');
    this.offshootsSlider = document.getElementById('slider-offshoots') as HTMLInputElement | null;
    this.offshootsValLabel = document.getElementById('label-offshoots-val');

    this.chkWandering = document.getElementById('chk-plume-wandering') as HTMLInputElement | null;
    this.chkRegimes = document.getElementById('chk-regime-cycling') as HTMLInputElement | null;

    this.bioBankListEl = document.getElementById('biobank-strain-list');
    this.bioBankStatusBadge = document.getElementById('biobank-status-badge');
    this.bioBankExportBtn = document.getElementById('btn-biobank-export');
    this.bioBankImportBtn = document.getElementById('btn-biobank-import');
    this.bioBankFileInput = document.getElementById('biobank-file-input') as HTMLInputElement | null;

    this.refreshPresetDropdown();
    EnvironmentPresetRegistry.getInstance().onChange(() => {
      this.refreshPresetDropdown();
    });

    this.bindEvents();
  }

  private refreshPresetDropdown(): void {
    if (!this.studioPresetSelect) return;
    const registry = EnvironmentPresetRegistry.getInstance();
    const presets = registry.getAll();
    const activePreset = this.world.getActivePreset() ?? registry.getActivePreset();

    this.studioPresetSelect.innerHTML = presets.map(p => {
      const isSel = p.id === activePreset.id ? 'selected' : '';
      let icon = '🗺️';
      if (p.id.includes('smoke')) icon = '🌋';
      else if (p.id.includes('trench')) icon = '🌊';
      else if (p.id.includes('mound')) icon = '🏛️';
      else if (p.id.includes('maze')) icon = '🌀';
      else if (p.id.includes('lenski')) icon = '🧪';
      else if (!p.isBuiltIn) icon = '💾';
      return `<option value="${p.id}" ${isSel}>${icon} ${p.name} (R=${p.grid.radius})</option>`;
    }).join('');
  }

  public syncUIWithPreset(preset: ISiliquariumEnvironmentPreset): void {
    this.selectedRadius = preset.grid.radius;
    document.querySelectorAll('.scale-btn[data-radius]').forEach(b => {
      if (b.getAttribute('data-radius') === String(preset.grid.radius)) {
        b.classList.add('scale-active');
      } else {
        b.classList.remove('scale-active');
      }
    });

    const lbl = document.getElementById('label-scale-val');
    if (lbl) {
      const maxZ = preset.grid.maxZ ?? 4;
      const poreCount = (1 + 3 * this.selectedRadius * (this.selectedRadius + 1)) * (maxZ + 1);
      lbl.textContent = `R=${this.selectedRadius} (~${poreCount} Pores)`;
    }

    if (this.spireHeightSlider && this.spireHeightLabel) {
      const maxZ = preset.grid.maxZ ?? 4;
      this.spireHeightSlider.value = String(maxZ);
      this.spireHeightLabel.textContent = `z=${maxZ} (${maxZ + 1} Tiers)`;
    }

    const primaryVent = preset.grid.vents[0];
    if (primaryVent) {
      if (this.ventQSlider) this.ventQSlider.value = String(primaryVent.q);
      if (this.ventRSlider) this.ventRSlider.value = String(primaryVent.r);
      if (this.ventCoordLabel) this.ventCoordLabel.textContent = `[${primaryVent.q}, ${primaryVent.r}]`;
    }

    if (this.offshootsSlider && this.offshootsValLabel) {
      const count = Math.max(0, preset.grid.vents.length - 1);
      this.offshootsSlider.value = String(count);
      this.offshootsValLabel.textContent = count === 1 ? '1 Offshoot' : `${count} Offshoots`;
    }

    if (this.chkWandering) {
      this.chkWandering.checked = preset.environment.plumeWandering ?? true;
    }
    if (this.chkRegimes) {
      this.chkRegimes.checked = preset.environment.regimeCycling ?? true;
    }

    if (this.masterGeoSlider && this.masterGeoLabel) {
      const vol = preset.environment.eventVolatility ?? 0.20;
      this.masterGeoSlider.value = String(vol);
      const pct = Math.round(vol * 100);
      const desc = vol === 0 ? 'Off (Static)' : vol < 0.35 ? 'Moderate' : vol < 0.70 ? 'High' : 'Cataclysmic';
      this.masterGeoLabel.textContent = `${pct}% (${desc})`;
    }

    if (preset.environment.geodynamics) {
      const geo = preset.environment.geodynamics;
      const setSlider = (id: string, lblId: string, val?: number) => {
        if (val === undefined) return;
        const slider = document.getElementById(id) as HTMLInputElement | null;
        const label = document.getElementById(lblId);
        if (slider) slider.value = String(val);
        if (label) label.textContent = `${Math.round(val * 100)}%`;
      };
      setSlider('slider-rate-earthquake', 'label-rate-earthquake-val', geo.earthquakeRate);
      setSlider('slider-rate-lava', 'label-rate-lava-val', geo.lavaFlowRate);
      setSlider('slider-rate-spalling', 'label-rate-spalling-val', geo.chimneySpallingRate);
      setSlider('slider-rate-surge', 'label-rate-surge-val', geo.hydrothermalSurgeRate);
      setSlider('slider-rate-toxin', 'label-rate-toxin-val', geo.toxicSpikeRate);
      setSlider('slider-rate-tidal', 'label-rate-tidal-val', geo.tidalCurrentRate);
      setSlider('slider-rate-marinesnow', 'label-rate-marinesnow-val', geo.marineSnowRate);
      setSlider('slider-rate-migration', 'label-rate-migration-val', geo.ventMigrationRate);
      setSlider('slider-rate-cryogenic', 'label-rate-cryogenic-val', geo.cryogenicDownwellingRate);
    }
  }

  private bindEvents(): void {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggle());
    }

    if (this.closeXBtn) {
      this.closeXBtn.addEventListener('click', () => this.close());
    }

    if (this.bottomCloseBtn) {
      this.bottomCloseBtn.addEventListener('click', () => this.close());
    }

    if (this.backdropEl) {
      this.backdropEl.addEventListener('click', () => this.close());
    }

    // Design Studio Collapsible Panel & Floating CAD Palette Toggles
    const toggleStudioTab = document.getElementById('btn-toggle-studio-panel');
    toggleStudioTab?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleStudioPanelCollapse();
    });

    const toggleStudioHud = document.getElementById('btn-toggle-studio-panel-hud');
    toggleStudioHud?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleStudioPanelCollapse();
    });

    const toggleBrushBar = document.getElementById('btn-toggle-brush-toolbar');
    toggleBrushBar?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleCadBrushes();
    });

    const closeCadPalette = document.getElementById('btn-close-cad-palette');
    closeCadPalette?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleCadBrushes();
    });

    const toggleLeftCadBtn = document.getElementById('btn-toggle-left-cad');
    toggleLeftCadBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleCadBrushes();
    });

    // Studio Ribbon Bar Actions
    if (this.studioPresetSelect) {
      this.studioPresetSelect.addEventListener('change', () => {
        const id = this.studioPresetSelect?.value;
        if (!id) return;
        const preset = EnvironmentPresetRegistry.getInstance().getById(id);
        if (preset) {
          EnvironmentPresetRegistry.getInstance().setActivePresetId(preset.id);
          this.world.loadEnvironmentPreset(preset);
          this.syncUIWithPreset(preset);
          this.callbacks.onPresetLoaded?.(preset);
          this.showStatus(`Loaded Preset: ${preset.name}`, 'success');
        }
      });
    }

    if (this.btnStudioSave) {
      this.btnStudioSave.addEventListener('click', () => {
        const name = prompt('Enter a name for this custom Siliquarium environment:', 'Custom Caldera');
        if (!name || !name.trim()) return;

        const vents = [
          { q: this.world.getVent().nozzleCoord.q, r: this.world.getVent().nozzleCoord.r, z: 0, height: this.world.getMaxZ() },
          ...this.world.getVent().getOffshoots().map(off => ({ q: off.q, r: off.r, z: 0, height: this.world.getMaxZ() }))
        ];
        const basaltCoords = this.world.getAllPores().filter(p => p.isBasalt()).map(p => ({ q: p.coord.q, r: p.coord.r, z: p.coord.z }));
        const trenchCoords = this.world.getAllPores()
          .filter(p => p.coord.z === -1 && !p.isBasalt() && this.world.getPore(new HexCoord3D(p.coord.q, p.coord.r, 0))?.isAqueous())
          .map(p => ({ q: p.coord.q, r: p.coord.r, z: p.coord.z }));

        const preset: ISiliquariumEnvironmentPreset = {
          version: '1.0.0',
          id: `user_env_${Date.now()}`,
          name: name.trim(),
          author: 'Benthic Architect',
          createdAt: Date.now(),
          description: `Custom sculpted environment with ${basaltCoords.length} basalt barriers and ${vents.length} vents.`,
          isBuiltIn: false,
          grid: {
            radius: this.world.getRadius(),
            minZ: this.world.getMinZ(),
            maxZ: this.world.getMaxZ(),
            vents,
            basaltCoords,
            trenchCoords
          },
          environment: {
            baseTemperature: 350,
            landauerMultiplier: 1.0,
            eventVolatility: this.world.getGeologicalEngine().getConfig().masterActivityRate,
            plumeWandering: this.world.getVent().plumeWanderingEnabled,
            regimeCycling: this.world.getVent().regimeCyclingEnabled,
            geodynamics: {
              ...this.world.getGeologicalEngine().getConfig()
            }
          },
          founderStrains: []
        };

        EnvironmentPresetRegistry.getInstance().savePreset(preset);
        this.refreshPresetDropdown();
        if (this.studioPresetSelect) this.studioPresetSelect.value = preset.id;
        this.showStatus(`💾 Saved preset "${name}" to Cryo-Registry!`, 'success');
      });
    }

    if (this.btnStudioExport) {
      this.btnStudioExport.addEventListener('click', () => {
        const active = this.world.getActivePreset() ?? EnvironmentPresetRegistry.getInstance().getActivePreset();
        const json = EnvironmentPresetRegistry.getInstance().exportToJson(active);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${active.id || 'siliquarium'}.siliquarium`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showStatus('📤 Preset exported (.siliquarium)!', 'success');
      });
    }

    if (this.btnStudioImport && this.studioFileInput) {
      this.btnStudioImport.addEventListener('click', () => {
        this.studioFileInput?.click();
      });

      this.studioFileInput.addEventListener('change', (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          const content = evt.target?.result as string;
          if (content) {
            try {
              const preset = EnvironmentPresetRegistry.getInstance().importFromJson(content);
              this.refreshPresetDropdown();
              if (this.studioPresetSelect) this.studioPresetSelect.value = preset.id;
              this.world.loadEnvironmentPreset(preset);
              this.syncUIWithPreset(preset);
              this.callbacks.onPresetLoaded?.(preset);
              this.showStatus(`📥 Imported & Loaded "${preset.name}"!`, 'success');
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err);
              this.showStatus(`⚠️ Import failed: ${msg}`, 'info');
            }
          }
        };
        reader.readAsText(file);
        (e.target as HTMLInputElement).value = '';
      });
    }

    if (this.btnStudioResetFounders) {
      this.btnStudioResetFounders.addEventListener('click', () => {
        this.world.resetToFounders();
        this.showStatus('↺ Reset to pristine founder strains in baseline geology!', 'info');
      });
    }

    // Studio Quick Seed Menu Dropdown
    if (this.btnStudioSeedMenu && this.studioSeedDropdown) {
      this.btnStudioSeedMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        this.studioSeedDropdown?.classList.toggle('hidden');
      });

      document.addEventListener('click', (e) => {
        if (!this.studioSeedDropdown?.contains(e.target as Node) && e.target !== this.btnStudioSeedMenu) {
          this.studioSeedDropdown?.classList.add('hidden');
        }
      });

      this.btnSeedAutoEco?.addEventListener('click', () => {
        this.studioSeedDropdown?.classList.add('hidden');
        const res = this.world.seedFoundersInEcosystem();
        this.refreshLatticeMetrics();
        this.showStatus(`🌱 Inoculated ${res.totalSeeded} founder colonies (Vents: ${res.ventSeeded}, Caverns: ${res.cavernSeeded}, Shelves: ${res.shelfSeeded})!`, 'success');
      });

      this.btnSeedSoup20?.addEventListener('click', () => {
        this.studioSeedDropdown?.classList.add('hidden');
        this.world.seedPrimordialSoup(0.20);
        this.refreshLatticeMetrics();
        this.showStatus('🧪 Dispersed prebiotic primordial soup across 20% of pores!', 'success');
      });

      this.btnSeedBioBankAll?.addEventListener('click', () => {
        this.studioSeedDropdown?.classList.add('hidden');
        const res = this.world.seedFoundersInEcosystem({ ventCount: 4, subterraneanCount: 3, shelfCount: 2 });
        this.refreshLatticeMetrics();
        this.showStatus(`🧊 Inoculated ${res.totalSeeded} pioneer strains across prime hydrothermal niches!`, 'success');
      });

      this.btnSeedPurgeAll?.addEventListener('click', () => {
        this.studioSeedDropdown?.classList.add('hidden');
        let purged = 0;
        for (const p of this.world.getAllPores()) {
          if (p.getResident()) {
            this.world.clearPore(p.coord);
            purged++;
          }
        }
        this.refreshLatticeMetrics();
        this.showStatus(`🧹 Purged all ${purged} organisms. Siliquarium is now sterile and abiotic.`, 'info');
      });
    }

    if (this.btnStudioNew) {
      this.btnStudioNew.addEventListener('click', () => {
        this.showNewModal();
      });
    }

    // Modal Close Triggers
    const closeNewModalHandler = () => this.hideNewModal();
    this.btnCreateNewClose?.addEventListener('click', closeNewModalHandler);
    this.btnCreateNewCancel?.addEventListener('click', closeNewModalHandler);
    this.btnCreateProcCancel?.addEventListener('click', closeNewModalHandler);

    if (this.modalNewSiliquarium) {
      this.modalNewSiliquarium.addEventListener('click', (e) => {
        if (e.target === this.modalNewSiliquarium) {
          this.hideNewModal();
        }
      });
    }

    // Tab Switching Navigation (Blank Canvas vs. Procedural Generator)
    const switchNewTab = (tab: 'blank' | 'procedural') => {
      if (tab === 'blank') {
        this.tabNewBlank?.classList.add('active');
        this.tabNewProcedural?.classList.remove('active');
        if (this.tabNewBlank) {
          this.tabNewBlank.style.background = 'rgba(56,189,248,0.22)';
          this.tabNewBlank.style.color = '#38bdf8';
          this.tabNewBlank.style.borderColor = 'rgba(56,189,248,0.4)';
        }
        if (this.tabNewProcedural) {
          this.tabNewProcedural.style.background = 'transparent';
          this.tabNewProcedural.style.color = '#94a3b8';
          this.tabNewProcedural.style.borderColor = 'transparent';
        }
        if (this.paneNewBlank) this.paneNewBlank.style.display = 'flex';
        if (this.paneNewProcedural) this.paneNewProcedural.style.display = 'none';
      } else {
        this.tabNewProcedural?.classList.add('active');
        this.tabNewBlank?.classList.remove('active');
        if (this.tabNewProcedural) {
          this.tabNewProcedural.style.background = 'rgba(16,185,129,0.22)';
          this.tabNewProcedural.style.color = '#34d399';
          this.tabNewProcedural.style.borderColor = 'rgba(16,185,129,0.4)';
        }
        if (this.tabNewBlank) {
          this.tabNewBlank.style.background = 'transparent';
          this.tabNewBlank.style.color = '#94a3b8';
          this.tabNewBlank.style.borderColor = 'transparent';
        }
        if (this.paneNewProcedural) this.paneNewProcedural.style.display = 'flex';
        if (this.paneNewBlank) this.paneNewBlank.style.display = 'none';
      }
    };

    this.tabNewBlank?.addEventListener('click', () => switchNewTab('blank'));
    this.tabNewProcedural?.addEventListener('click', () => switchNewTab('procedural'));

    // Procedural Generator Sliders & Re-roll Seed
    if (this.sliderProcBasalt && this.labelProcBasaltVal) {
      this.sliderProcBasalt.addEventListener('input', () => {
        if (this.labelProcBasaltVal && this.sliderProcBasalt) {
          this.labelProcBasaltVal.textContent = `${this.sliderProcBasalt.value}%`;
        }
      });
    }

    if (this.sliderProcRoughness && this.labelProcRoughnessVal) {
      this.sliderProcRoughness.addEventListener('input', () => {
        const val = parseInt(this.sliderProcRoughness?.value ?? '40', 10);
        const desc = val === 0 ? 'Smooth / Flat' : val < 30 ? 'Gentle Mounds' : val < 70 ? 'Stepped Terraces' : 'Jagged Mesas';
        if (this.labelProcRoughnessVal) {
          this.labelProcRoughnessVal.textContent = `${val}% (${desc})`;
        }
      });
    }

    if (this.sliderProcSpire && this.labelProcSpireVal) {
      this.sliderProcSpire.addEventListener('input', () => {
        if (this.labelProcSpireVal && this.sliderProcSpire) {
          this.labelProcSpireVal.textContent = `z=${this.sliderProcSpire.value} Summit`;
        }
      });
    }

    if (this.sliderProcOffshoots && this.labelProcOffshootsVal) {
      this.sliderProcOffshoots.addEventListener('input', () => {
        const val = parseInt(this.sliderProcOffshoots?.value ?? '1', 10);
        if (this.labelProcOffshootsVal) {
          this.labelProcOffshootsVal.textContent = val === 1 ? '1 Offshoot' : `${val} Offshoots`;
        }
      });
    }

    if (this.btnProcReroll && this.inputProcSeed) {
      this.btnProcReroll.addEventListener('click', () => {
        const randSeed = Math.floor(Math.random() * 90000) + 10000;
        if (this.inputProcSeed) this.inputProcSeed.value = String(randSeed);
      });
    }

    if (this.selectNewBlankMinZ && this.wrapperBlankSubstrate) {
      this.selectNewBlankMinZ.addEventListener('change', () => {
        const minZ = parseInt(this.selectNewBlankMinZ?.value ?? '0', 10);
        if (this.wrapperBlankSubstrate) {
          this.wrapperBlankSubstrate.style.display = minZ < 0 ? 'block' : 'none';
        }
      });
    }

    const updateProcNichesLabel = () => {
      const minZ = parseInt(this.selectProcMinZ?.value ?? '-1', 10);
      if (minZ >= 0) {
        if (this.wrapperProcNiches) this.wrapperProcNiches.style.opacity = '0.4';
        if (this.labelProcNichesVal) this.labelProcNichesVal.textContent = 'N/A (Surface crust only; upward growth focus)';
        if (this.sliderProcNiches) {
          this.sliderProcNiches.disabled = true;
          this.sliderProcNiches.style.cursor = 'not-allowed';
        }
      } else {
        if (this.wrapperProcNiches) this.wrapperProcNiches.style.opacity = '1.0';
        if (this.sliderProcNiches) {
          this.sliderProcNiches.disabled = false;
          this.sliderProcNiches.style.cursor = 'pointer';
          const val = parseInt(this.sliderProcNiches.value, 10);
          let desc = 'Lava tubes & hydrothermal chambers';
          if (val === 0) desc = 'Solid impermeable rock';
          else if (val <= 20) desc = 'Sparse fault fissures';
          else if (val >= 50) desc = 'Extensive cavern labyrinth';
          if (this.labelProcNichesVal) this.labelProcNichesVal.textContent = `${val}% (${desc})`;
        }
      }
    };

    if (this.selectProcMinZ) {
      this.selectProcMinZ.addEventListener('change', updateProcNichesLabel);
    }
    if (this.sliderProcNiches) {
      this.sliderProcNiches.addEventListener('input', updateProcNichesLabel);
    }

    // Confirm: Blank Canvas
    if (this.btnCreateNewConfirm) {
      this.btnCreateNewConfirm.addEventListener('click', () => {
        const radius = Number(this.selectNewRadius?.value ?? '8');
        const minZ = parseInt(this.selectNewBlankMinZ?.value ?? '0', 10);
        const maxZ = parseInt(this.selectNewBlankMaxZ?.value ?? '4', 10);
        const blankSubstrate = (this.selectNewBlankSubstrate?.value as INewSiliquariumOptions['blankSubstrate']) ?? 'solid_basalt';
        const template = (this.selectNewTemplate?.value as INewSiliquariumOptions['template']) ?? 'single_vent';
        const seedingMode = (this.selectBlankSeeding?.value as INewSiliquariumOptions['seedingMode']) ?? 'founders';
        const options: INewSiliquariumOptions = {
          radius,
          minZ,
          maxZ,
          mode: 'blank',
          template,
          blankSubstrate,
          seedingMode
        };
        this.callbacks.onNewRequested?.(options);
        this.hideNewModal();
        this.refreshLatticeMetrics();
        const subDesc = minZ < 0 ? `z=${minZ}..${maxZ}` : `z=0..${maxZ} upward`;
        const seedText = seedingMode === 'founders' ? '🌱 Founder Colonies Inoculated' : seedingMode === 'soup' ? '🧪 Prebiotic Soup Dispersed' : seedingMode === 'biobank' ? '🧊 BioBank Inoculated' : '🕳️ Sterile Canvas';
        this.showStatus(`✨ Blank Canvas ready (R=${radius}, ${subDesc} • ${seedText}). Sculpt terrain with CAD tools!`, 'success');
      });
    }

    // Confirm: Procedural Generator
    if (this.btnCreateProcConfirm) {
      this.btnCreateProcConfirm.addEventListener('click', () => {
        const radius = Number(this.selectProcRadius?.value ?? '8');
        const minZ = parseInt(this.selectProcMinZ?.value ?? '-1', 10);
        const maxZ = parseInt(this.sliderProcSpire?.value ?? '4', 10);
        const subterraneanNiches = minZ < 0 ? (parseInt(this.sliderProcNiches?.value ?? '35', 10) / 100) : 0;
        const basaltDensity = (parseInt(this.sliderProcBasalt?.value ?? '15', 10)) / 100;
        const terrainRoughness = (parseInt(this.sliderProcRoughness?.value ?? '40', 10)) / 100;
        const offshootCount = parseInt(this.sliderProcOffshoots?.value ?? '1', 10);
        const seedVal = parseInt(this.inputProcSeed?.value ?? '42', 10);
        const seed = isNaN(seedVal) ? undefined : seedVal;
        const seedingMode = (this.selectProcSeeding?.value as INewSiliquariumOptions['seedingMode']) ?? 'founders';

        const options: INewSiliquariumOptions = {
          radius,
          minZ,
          maxZ,
          mode: 'procedural',
          basaltDensity,
          terrainRoughness,
          subterraneanNiches,
          offshootCount,
          seed,
          seedingMode
        };
        this.callbacks.onNewRequested?.(options);
        this.hideNewModal();
        this.refreshLatticeMetrics();
        const nicheText = minZ < 0 ? `, ${Math.round(subterraneanNiches * 100)}% Underground Niches` : ', Upward Column';
        const seedText = seedingMode === 'founders' ? '🌱 Founder Colonies Inoculated' : seedingMode === 'soup' ? '🧪 Prebiotic Soup Dispersed' : seedingMode === 'biobank' ? '🧊 BioBank Inoculated' : '🕳️ Sterile Canvas';
        this.showStatus(`🎲 Procedurally generated Siliquarium (R=${radius}, z=${minZ}..${maxZ}${nicheText} • ${seedText})!`, 'success');
      });
    }

    if (this.btnStudioLaunch) {
      this.btnStudioLaunch.addEventListener('click', () => {
        if (this.callbacks.onBeginSimulationRequested) {
          this.callbacks.onBeginSimulationRequested();
        } else {
          this.close();
        }
        this.showStatus('🚀 Siliquarium Simulation Launched!', 'success');
      });
    }

    if (this.btnStudioApplyCurrent) {
      this.btnStudioApplyCurrent.addEventListener('click', () => {
        if (this.callbacks.onApplyToCurrentRequested) {
          this.callbacks.onApplyToCurrentRequested();
        } else {
          this.close();
        }
        this.showStatus('⚡ Applied changes to current simulation!', 'success');
      });
    }

    if (this.btnStudioCancel) {
      this.btnStudioCancel.addEventListener('click', () => {
        if (this.callbacks.onCancelRequested) {
          this.callbacks.onCancelRequested();
        } else {
          this.close();
        }
        this.showStatus('✕ Design Studio closed. Changes discarded.', 'info');
      });
    }

    if (this.btnStudioUndo) {
      this.btnStudioUndo.addEventListener('click', () => {
        this.callbacks.onUndoRequested?.();
      });
    }

    if (this.btnStudioRedo) {
      this.btnStudioRedo.addEventListener('click', () => {
        this.callbacks.onRedoRequested?.();
      });
    }

    // Sterile Launch Modal Triggers
    const closeSterileHandler = () => this.hideSterileLaunchModal();
    this.btnSterileClose?.addEventListener('click', closeSterileHandler);
    this.btnSterileCancel?.addEventListener('click', closeSterileHandler);
    if (this.modalSterileLaunch) {
      this.modalSterileLaunch.addEventListener('click', (e) => {
        if (e.target === this.modalSterileLaunch) {
          this.hideSterileLaunchModal();
        }
      });
    }

    this.btnSterileInoculate?.addEventListener('click', () => {
      this.hideSterileLaunchModal();
      this.callbacks.onInoculateAndBeginRequested?.();
    });

    this.btnSterileContinue?.addEventListener('click', () => {
      this.hideSterileLaunchModal();
      this.callbacks.onBeginSterileRequested?.();
    });

    // Technical CAD Status Strip Buttons (mirrors top ribbon actions)
    const stripLaunch = document.getElementById('strip-btn-launch');
    stripLaunch?.addEventListener('click', () => this.btnStudioLaunch?.click());
    const stripApply = document.getElementById('strip-btn-apply');
    stripApply?.addEventListener('click', () => this.btnStudioApplyCurrent?.click());
    const stripCancel = document.getElementById('strip-btn-cancel');
    stripCancel?.addEventListener('click', () => this.btnStudioCancel?.click());

    // Dual-Basin Quick Inoculation
    if (this.btnInoculateDualBasin) {
      this.btnInoculateDualBasin.addEventListener('click', () => {
        const bioBank = BioBank.getInstance();
        const strains = bioBank.getAll();
        const radius = this.world.getRadius();
        const northCoord = new HexCoord3D(0, -Math.max(2, Math.floor(radius / 2)), 0);
        const southCoord = new HexCoord3D(0, Math.max(2, Math.floor(radius / 2)), 0);

        const safeA = strains[0] ? new GenomeSafe(strains[0].tapeBitstring) : undefined;
        const safeB = strains[1] ? new GenomeSafe(strains[1].tapeBitstring) : (strains[0] ? new GenomeSafe(strains[0].tapeBitstring) : undefined);

        this.world.inoculateCell(northCoord, safeA);
        this.world.inoculateCell(southCoord, safeB);
        const nameA = strains[0]?.name ?? 'Chemiosmotic Autotroph';
        const nameB = strains[1]?.name ?? (strains[0] ? `${strains[0].name} (Clone)` : 'Allosteric Inverter');
        this.showStatus(`⚡ Inoculated North Basin (${nameA}) vs. South Basin (${nameB})!`, 'success');
      });
    }

    // Tab Switching Navigation & Guided Workflow Breadcrumbs
    if (this.tabButtons && this.tabPanes) {
      this.tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetTab = btn.getAttribute('data-tab');
          if (targetTab) this.switchTab(targetTab);
        });
      });
    }

    if (this.workflowSteps) {
      this.workflowSteps.forEach(step => {
        step.addEventListener('click', () => {
          const targetTab = step.dataset.targetTab;
          if (targetTab) {
            this.switchTab(targetTab);
            if (targetTab === 'inoculator') {
              this.setBrushMode('inoculate');
              this.showStatus('🌱 Inoculate Mode active: Click habitable pores to pipette living silicoids!', 'info');
            }
          } else if (step.id === 'step-workflow-launch') {
            this.btnStudioLaunch?.click();
          }
        });
      });
    }

    // Master Geodynamic Volatility Slider
    if (this.masterGeoSlider && this.masterGeoLabel) {
      this.masterGeoSlider.addEventListener('input', () => {
        const val = parseFloat(this.masterGeoSlider?.value ?? '0.20');
        this.world.getGeologicalEngine().setConfig({ masterActivityRate: val });
        if (this.masterGeoLabel) {
          const pct = Math.round(val * 100);
          const desc = val === 0 ? 'Off (Static)' : val < 0.35 ? 'Moderate' : val < 0.70 ? 'High' : 'Cataclysmic';
          this.masterGeoLabel.textContent = `${pct}% (${desc})`;
        }
      });
    }

    // Individual Deep-Sea Phenomenon Rate Sliders
    const bindRateSlider = (sliderId: string, labelId: string, configKey: keyof IGeologicalConfig) => {
      const slider = document.getElementById(sliderId) as HTMLInputElement | null;
      const label = document.getElementById(labelId);
      if (slider && label) {
        slider.addEventListener('input', () => {
          const val = parseFloat(slider.value);
          this.world.getGeologicalEngine().setConfig({ [configKey]: val });
          label.textContent = `${Math.round(val * 100)}%`;
        });
      }
    };

    bindRateSlider('slider-rate-earthquake', 'label-rate-earthquake-val', 'earthquakeRate');
    bindRateSlider('slider-rate-lava', 'label-rate-lava-val', 'lavaFlowRate');
    bindRateSlider('slider-rate-spalling', 'label-rate-spalling-val', 'chimneySpallingRate');
    bindRateSlider('slider-rate-surge', 'label-rate-surge-val', 'hydrothermalSurgeRate');
    bindRateSlider('slider-rate-toxin', 'label-rate-toxin-val', 'toxicSpikeRate');
    bindRateSlider('slider-rate-tidal', 'label-rate-tidal-val', 'tidalCurrentRate');
    bindRateSlider('slider-rate-marinesnow', 'label-rate-marinesnow-val', 'marineSnowRate');
    bindRateSlider('slider-rate-migration', 'label-rate-migration-val', 'ventMigrationRate');
    bindRateSlider('slider-rate-cryogenic', 'label-rate-cryogenic-val', 'cryogenicDownwellingRate');

    // 9 Instant Deep-Sea Phenomenon Trigger Buttons
    const bindTriggerBtn = (btnId: string, type: GeologicalEventType) => {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.addEventListener('click', () => {
          const record = this.world.triggerGeologicalEvent(type);
          if (record) {
            AudioSynthesizer.getInstance().playGodModeShock();
            this.showStatus(`${record.icon} Inoculated: ${record.title}!`, 'info');
            this.updateGeologicalTicker();
          }
        });
      }
    };

    const eventTypes: [string, GeologicalEventType][] = [
      ['earthquake', GeologicalEventType.MAGMATIC_TREMOR],
      ['lava', GeologicalEventType.PILLOW_LAVA_FLOW],
      ['spalling', GeologicalEventType.CHIMNEY_SPALLING],
      ['surge', GeologicalEventType.HYDROTHERMAL_SURGE],
      ['toxin', GeologicalEventType.TOXIC_HEAVY_METAL_SPIKE],
      ['tidal', GeologicalEventType.TIDAL_CURRENT_SHEAR],
      ['marinesnow', GeologicalEventType.MARINE_SNOW_STORM],
      ['migration', GeologicalEventType.VENT_ORIFICE_MIGRATION],
      ['cryogenic', GeologicalEventType.CRYOGENIC_DOWNWELLING],
    ];

    eventTypes.forEach(([name, type]) => {
      bindTriggerBtn(`btn-trigger-${name}`, type);
      bindTriggerBtn(`btn-shaker-${name}`, type);
    });

    // Observatory Shaker Toggle
    const shakerBtn = document.getElementById('btn-observatory-shaker');
    const shakerPanel = document.getElementById('observatory-shaker-panel');
    const shakerCloseX = document.getElementById('shaker-close-x');
    shakerBtn?.addEventListener('click', () => {
      shakerPanel?.classList.toggle('hidden');
      this.updateGeologicalTicker();
    });
    shakerCloseX?.addEventListener('click', () => {
      shakerPanel?.classList.add('hidden');
    });

    // In-Vitro Silicoid Laboratory Specimen Actions
    const colonySelect = document.getElementById('lab-select-active-colony') as HTMLSelectElement | null;
    colonySelect?.addEventListener('change', () => {
      const val = colonySelect.value;
      if (val) {
        const parts = val.split(',').map(s => parseInt(s, 10));
        if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
          this.callbacks.onSelectCoordRequested?.(new HexCoord3D(parts[0], parts[1], parts[2]));
        }
      }
    });

    const btnFocusMicro = document.getElementById('btn-lab-focus-microscope');
    btnFocusMicro?.addEventListener('click', () => {
      this.callbacks.onFocusMicroscopeRequested?.();
    });

    const btnOpenAutopsy = document.getElementById('btn-lab-open-autopsy');
    btnOpenAutopsy?.addEventListener('click', () => {
      this.callbacks.onOpenAutopsyRequested?.();
    });

    const btnFreezeStaged = document.getElementById('btn-lab-freeze-specimen');
    btnFreezeStaged?.addEventListener('click', () => {
      this.callbacks.onFreezeStagedRequested?.();
    });

    // Keyboard shortcuts: Esc to close panel or exit brush mode, L to toggle lab, P to toggle studio panel, B to toggle brushes
    window.addEventListener('keydown', (e) => {
      const activeEl = document.activeElement;
      const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT');
      if (isInput) return;

      if (e.key === 'Escape') {
        shakerPanel?.classList.add('hidden');
        if (this.modalNewSiliquarium && !this.modalNewSiliquarium.classList.contains('hidden')) {
          e.preventDefault();
          this.hideNewModal();
        } else if (this.modalSterileLaunch && !this.modalSterileLaunch.classList.contains('hidden')) {
          e.preventDefault();
          this.hideSterileLaunchModal();
        } else if (this.activeBrushMode !== 'select') {
          e.preventDefault();
          this.setBrushMode('select');
        } else if (this.isOpen && !document.body.classList.contains('mode-studio')) {
          e.preventDefault();
          this.close();
        }
      } else if (e.key === 'l' || e.key === 'L') {
        if (!document.body.classList.contains('mode-studio')) {
          e.preventDefault();
          this.toggle();
        }
      } else if (e.key === 'p' || e.key === 'P') {
        if (document.body.classList.contains('mode-studio')) {
          e.preventDefault();
          this.toggleStudioPanelCollapse();
        }
      } else if (e.key === 'b' || e.key === 'B') {
        if (document.body.classList.contains('mode-studio')) {
          e.preventDefault();
          this.toggleCadBrushes();
        }
      }
    });

    // Scale buttons (R=5, 8, 10, 12, 14)
    ['5', '8', '10', '12', '14'].forEach(radStr => {
      const btn = document.getElementById(`scale-r${radStr}`);
      if (btn) {
        btn.addEventListener('click', () => {
          this.selectedRadius = parseInt(radStr, 10);
          document.querySelectorAll('.scale-btn[data-radius]').forEach(b => b.classList.remove('scale-active'));
          btn.classList.add('scale-active');
          const lbl = document.getElementById('label-scale-val');
          if (lbl) {
            const zTiers = parseInt(this.spireHeightSlider?.value ?? '4', 10) + 1;
            const poreCount = (1 + 3 * this.selectedRadius * (this.selectedRadius + 1)) * zTiers;
            lbl.textContent = `R=${this.selectedRadius} (~${poreCount} Pores)`;
          }
          if (this.ventQSlider && this.ventRSlider) {
            const maxVentR = Math.max(4, this.selectedRadius - 1);
            this.ventQSlider.min = String(-maxVentR);
            this.ventQSlider.max = String(maxVentR);
            this.ventRSlider.min = String(-maxVentR);
            this.ventRSlider.max = String(maxVentR);
          }
        });
      }
    });

    // Brush Tool Buttons
    const brushModes: StudioBrushMode[] = ['select', 'basalt', 'excavate', 'trench', 'vent', 'inoculate', 'clear'];
    brushModes.forEach(mode => {
      const btn = document.getElementById(`brush-${mode}`);
      if (btn) {
        btn.addEventListener('click', () => {
          this.setBrushMode(mode);
        });
      }
    });

    // Floating CAD Palette Brush Buttons
    document.querySelectorAll<HTMLButtonElement>('.cad-tool-btn[data-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode') as StudioBrushMode;
        if (mode) this.setBrushMode(mode);
      });
    });

    if (this.btnBrushInoculate) {
      this.btnBrushInoculate.addEventListener('click', () => {
        this.setBrushMode('inoculate');
      });
    }

    const exitBrushBtn = document.getElementById('btn-exit-brush');
    if (exitBrushBtn) {
      exitBrushBtn.addEventListener('click', () => {
        this.setBrushMode('select');
      });
    }

    // Brush Footprint Radius Buttons (1x, 2x, 3x)
    ['1', '2', '3'].forEach(rStr => {
      const btn = document.getElementById(`brush-radius-${rStr}`);
      if (btn) {
        btn.addEventListener('click', () => {
          this.setBrushRadius(parseInt(rStr, 10));
        });
      }
    });

    document.querySelectorAll<HTMLButtonElement>('.cad-radius-btn[data-radius]').forEach(btn => {
      btn.addEventListener('click', () => {
        const r = parseInt(btn.getAttribute('data-radius') || '1', 10);
        this.setBrushRadius(r);
      });
    });

    // Basalt Wall Elevation Buttons (H=1, 2, 3, 4)
    ['1', '2', '3', '4'].forEach(hStr => {
      const btn = document.getElementById(`brush-wall-h${hStr}`);
      if (btn) {
        btn.addEventListener('click', () => {
          this.setBrushWallHeight(parseInt(hStr, 10));
        });
      }
    });

    document.querySelectorAll<HTMLButtonElement>('.cad-wall-btn[data-height]').forEach(btn => {
      btn.addEventListener('click', () => {
        const h = parseInt(btn.getAttribute('data-height') || '3', 10);
        this.setBrushWallHeight(h);
      });
    });

    const cadStratum = document.getElementById('cad-select-stratum') as HTMLSelectElement | null;
    cadStratum?.addEventListener('change', () => {
      const val = cadStratum.value;
      if (val === 'auto') this.setTargetZLayer('auto');
      else this.setTargetZLayer(parseInt(val, 10));
    });

    // Vertical Substrate Layer Buttons (Auto-Stack, z=-4..8)
    const zTiers: Array<{ id: string; val: 'auto' | number }> = [
      { id: 'auto', val: 'auto' },
      { id: 'neg4', val: -4 },
      { id: 'neg3', val: -3 },
      { id: 'neg2', val: -2 },
      { id: 'neg1', val: -1 },
      { id: '0', val: 0 },
      { id: '1', val: 1 },
      { id: '2', val: 2 },
      { id: '3', val: 3 },
      { id: '4', val: 4 },
      { id: '5', val: 5 },
      { id: '6', val: 6 },
      { id: '7', val: 7 },
      { id: '8', val: 8 }
    ];
    zTiers.forEach(tier => {
      const btn = document.getElementById(`layer-z-${tier.id}`);
      if (btn) {
        btn.addEventListener('click', () => {
          this.setTargetZLayer(tier.val);
        });
      }
    });

    // Spire Height Slider
    if (this.spireHeightSlider && this.spireHeightLabel) {
      this.spireHeightSlider.addEventListener('input', () => {
        const val = parseInt(this.spireHeightSlider?.value ?? '4', 10);
        if (this.spireHeightLabel) this.spireHeightLabel.textContent = `z=${val} (${val + 1} Tiers)`;
        const lbl = document.getElementById('label-scale-val');
        if (lbl) {
          const poreCount = (1 + 3 * this.selectedRadius * (this.selectedRadius + 1)) * (val + 1);
          lbl.textContent = `R=${this.selectedRadius} (~${poreCount} Pores)`;
        }
      });
    }

    // Basalt & Roughness sliders
    if (this.basaltSlider && this.basaltValLabel) {
      this.basaltSlider.addEventListener('input', () => {
        const val = Math.round(parseFloat(this.basaltSlider?.value ?? '0.12') * 100);
        if (this.basaltValLabel) this.basaltValLabel.textContent = `${val}%`;
      });
    }

    if (this.roughnessSlider && this.roughnessValLabel) {
      this.roughnessSlider.addEventListener('input', () => {
        const val = Math.round(parseFloat(this.roughnessSlider?.value ?? '0.30') * 100);
        if (this.roughnessValLabel) this.roughnessValLabel.textContent = `${val}%`;
      });
    }

    // Vent Q / R sliders and presets
    const updateVentLabels = () => {
      const q = parseInt(this.ventQSlider?.value ?? '0', 10);
      const r = parseInt(this.ventRSlider?.value ?? '0', 10);
      if (this.ventCoordLabel) this.ventCoordLabel.textContent = `[${q}, ${r}]`;
    };
    this.ventQSlider?.addEventListener('input', updateVentLabels);
    this.ventRSlider?.addEventListener('input', updateVentLabels);

    // Vent Preset buttons
    document.querySelectorAll('.preset-btn[data-q]').forEach(btn => {
      btn.addEventListener('click', () => {
        const q = parseInt(btn.getAttribute('data-q') ?? '0', 10);
        const r = parseInt(btn.getAttribute('data-r') ?? '0', 10);
        if (this.ventQSlider) this.ventQSlider.value = String(q);
        if (this.ventRSlider) this.ventRSlider.value = String(r);
        updateVentLabels();
      });
    });

    const ventSelectedBtn = document.getElementById('btn-vent-selected');
    if (ventSelectedBtn) {
      ventSelectedBtn.addEventListener('click', () => {
        const sel = this.callbacks.getSelectedCoord?.();
        if (sel) {
          if (this.ventQSlider) this.ventQSlider.value = String(sel.q);
          if (this.ventRSlider) this.ventRSlider.value = String(sel.r);
          updateVentLabels();
          this.showStatus(`Vent target set to selected pore [${sel.q}, ${sel.r}]`, 'info');
        } else {
          this.showStatus('Please click a seafloor pore first!', 'info');
        }
      });
    }

    if (this.offshootsSlider && this.offshootsValLabel) {
      this.offshootsSlider.addEventListener('input', () => {
        const count = parseInt(this.offshootsSlider?.value ?? '0', 10);
        if (this.offshootsValLabel) {
          this.offshootsValLabel.textContent = count === 1 ? '1 Offshoot' : `${count} Offshoots`;
        }
      });
    }

    // Mutation, Duplication, Deletion & Soup sliders
    if (this.mutationSlider && this.mutationValLabel) {
      this.mutationSlider.addEventListener('input', () => {
        const val = parseFloat(this.mutationSlider?.value ?? '0.001');
        this.world.setMutationRate(val);
        if (this.mutationValLabel) {
          this.mutationValLabel.textContent = `${(val * 100).toFixed(2)}%`;
        }
      });
    }

    if (this.duplicationSlider && this.duplicationValLabel) {
      this.duplicationSlider.addEventListener('input', () => {
        const val = parseFloat(this.duplicationSlider?.value ?? '0.005');
        this.world.setDuplicationRate(val);
        if (this.duplicationValLabel) {
          this.duplicationValLabel.textContent = `${(val * 100).toFixed(2)}%`;
        }
      });
    }

    if (this.deletionSlider && this.deletionValLabel) {
      this.deletionSlider.addEventListener('input', () => {
        const val = parseFloat(this.deletionSlider?.value ?? '0.005');
        this.world.setDeletionRate(val);
        if (this.deletionValLabel) {
          this.deletionValLabel.textContent = `${(val * 100).toFixed(2)}%`;
        }
      });
    }

    if (this.soupSlider && this.soupValLabel) {
      this.soupSlider.addEventListener('input', () => {
        const val = parseFloat(this.soupSlider?.value ?? '0.20');
        if (this.soupValLabel) {
          this.soupValLabel.textContent = `${Math.round(val * 100)}%`;
        }
      });
    }

    // Apply to Active Simulation
    const triggerApply = () => {
      const q = parseInt(this.ventQSlider?.value ?? '0', 10);
      const r = parseInt(this.ventRSlider?.value ?? '0', 10);
      const offshoots = parseInt(this.offshootsSlider?.value ?? '0', 10);
      const mutRate = parseFloat(this.mutationSlider?.value ?? '0.001');
      const dupRate = parseFloat(this.duplicationSlider?.value ?? '0.005');
      const delRate = parseFloat(this.deletionSlider?.value ?? '0.005');
      const wandering = this.chkWandering?.checked ?? true;
      const regimes = this.chkRegimes?.checked ?? true;

      const basaltDensity = parseFloat(this.basaltSlider?.value ?? '0.12');
      const roughness = parseFloat(this.roughnessSlider?.value ?? '0.30');
      const maxZ = parseInt(this.spireHeightSlider?.value ?? '4', 10);

      const ventCoord = new HexCoord3D(q, r, 0);
      this.world.setVentConfiguration(ventCoord, offshoots);
      this.world.updateTopographySettings(roughness, basaltDensity, maxZ);
      this.world.setMutationRate(mutRate);
      this.world.setDuplicationRate(dupRate);
      this.world.setDeletionRate(delRate);
      this.world.getVent().plumeWanderingEnabled = wandering;
      this.world.getVent().regimeCyclingEnabled = regimes;

      this.callbacks.onApplySettingsRequested?.({
        ventCoord,
        offshootCount: offshoots,
        mutationRate: mutRate,
        duplicationRate: dupRate,
        deletionRate: delRate,
        plumeWandering: wandering,
        regimeCycling: regimes,
        terrainRoughness: roughness,
        basaltDensity,
        maxZ
      });

      this.setBrushMode('select');
      this.showStatus(`✅ Applied live parameters! [Vents: (${q},${r}), Spire: z=${maxZ}, Relief: ${Math.round(roughness * 100)}%]`, 'success');
    };

    document.querySelectorAll('.btn-apply-trigger, #btn-apply-settings').forEach(btn => {
      btn.addEventListener('click', triggerApply);
    });

    // Restart with Current Settings
    const triggerRestart = () => {
      const q = parseInt(this.ventQSlider?.value ?? '0', 10);
      const r = parseInt(this.ventRSlider?.value ?? '0', 10);
      const offshoots = parseInt(this.offshootsSlider?.value ?? '0', 10);
      const mutRate = parseFloat(this.mutationSlider?.value ?? '0.001');
      const dupRate = parseFloat(this.duplicationSlider?.value ?? '0.005');
      const delRate = parseFloat(this.deletionSlider?.value ?? '0.005');
      const soupDensity = parseFloat(this.soupSlider?.value ?? '0.20');
      const basaltDensity = parseFloat(this.basaltSlider?.value ?? '0.12');
      const roughness = parseFloat(this.roughnessSlider?.value ?? '0.30');
      const maxZ = parseInt(this.spireHeightSlider?.value ?? '4', 10);

      const ventCoord = new HexCoord3D(q, r, 0);

      this.callbacks.onRestartWithConfigRequested?.({
        radius: this.selectedRadius,
        minZ: -1,
        maxZ,
        basaltDensity,
        terrainRoughness: roughness,
        soupDensity,
        mutationRate: mutRate,
        duplicationRate: dupRate,
        deletionRate: delRate,
        ventCoord,
        offshootCount: offshoots
      });

      this.setBrushMode('select');
      this.showStatus(`🔄 Re-seeded simulation! [R=${this.selectedRadius}, z=${maxZ}, Basalt: ${Math.round(basaltDensity * 100)}%]`, 'success');
    };

    document.querySelectorAll('.btn-restart-trigger, #btn-restart-sim').forEach(btn => {
      btn.addEventListener('click', triggerRestart);
    });

    // Perturbation buttons
    const surgeBtn = document.getElementById('btn-thermal-surge');
    if (surgeBtn) {
      surgeBtn.addEventListener('click', () => {
        this.callbacks.onThermalPulseRequested();
        this.showStatus('🔥 Injected +200 Energy Thermal Surge!', 'info');
      });
    }

    const extinctionBtn = document.getElementById('btn-extinction-pulse');
    if (extinctionBtn) {
      extinctionBtn.addEventListener('click', () => {
        this.callbacks.onExtinctionRequested();
        this.showStatus('💥 Triggered localized extinction shockwave!', 'info');
      });
    }

    // BioBank Cryo-Vault Events
    if (this.bioBankExportBtn) {
      this.bioBankExportBtn.addEventListener('click', () => {
        const json = BioBank.getInstance().exportJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `siliquarium-biobank-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showStatus('💾 Bio-Bank vault exported successfully!', 'success');
      });
    }

    if (this.bioBankImportBtn && this.bioBankFileInput) {
      this.bioBankImportBtn.addEventListener('click', () => {
        this.bioBankFileInput?.click();
      });

      this.bioBankFileInput.addEventListener('change', (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          const content = evt.target?.result as string;
          if (content) {
            const count = BioBank.getInstance().importJSON(content);
            if (count > 0) {
              this.showStatus(`📂 Imported ${count} strains into Bio-Bank!`, 'success');
            } else {
              this.showStatus('⚠️ Failed to parse valid Bio-Bank JSON.', 'info');
            }
          }
        };
        reader.readAsText(file);
        (e.target as HTMLInputElement).value = '';
      });
    }

    BioBank.getInstance().onBankChanged(() => {
      this.updateBioBankUI();
      if (this.activeBrushMode === 'inoculate') {
        this.updateBrushIndicator('inoculate');
      }
    });

    this.updateBioBankUI();

    // Layer checkboxes
    const chkSpores = document.getElementById('chk-spores') as HTMLInputElement | null;
    if (chkSpores) {
      chkSpores.addEventListener('change', () => {
        if (this.renderer) this.renderer.showSpores = chkSpores.checked;
        this.onLayerChanged?.();
      });
    }

    const chkWater = document.getElementById('chk-water') as HTMLInputElement | null;
    if (chkWater) {
      chkWater.addEventListener('change', () => {
        if (this.renderer) this.renderer.showWaterColumn = chkWater.checked;
        this.onLayerChanged?.();
      });
    }

    const chkBedrock = document.getElementById('chk-bedrock') as HTMLInputElement | null;
    if (chkBedrock) {
      chkBedrock.addEventListener('change', () => {
        if (this.renderer) this.renderer.showBenthic = chkBedrock.checked;
        this.onLayerChanged?.();
      });
    }

    const chkZoom = document.getElementById('chk-zoom-transparency') as HTMLInputElement | null;
    if (chkZoom) {
      chkZoom.addEventListener('change', () => {
        if (this.renderer) this.renderer.zoomTransparencyEnabled = chkZoom.checked;
      });
    }

    // Viewport Display Clarity & Noise Reduction Checkboxes
    if (this.chkFilterConduits) {
      this.chkFilterConduits.addEventListener('change', () => {
        if (this.renderer) {
          this.renderer.filterSyncytium = this.chkFilterConduits?.checked ? 'all' : 'off';
          this.renderer.filterShowStreamingBeads = this.chkFilterConduits?.checked ?? true;
        }
        this.onLayerChanged?.();
      });
    }

    if (this.chkFilterAuras) {
      this.chkFilterAuras.addEventListener('change', () => {
        if (this.renderer) {
          this.renderer.filterShowAuras = this.chkFilterAuras?.checked ?? true;
        }
        this.onLayerChanged?.();
      });
    }

    if (this.chkFilterTrophic) {
      this.chkFilterTrophic.addEventListener('change', () => {
        if (this.renderer) {
          this.renderer.filterShowTrophicRays = this.chkFilterTrophic?.checked ?? true;
        }
        this.onLayerChanged?.();
      });
    }

    if (this.chkCalmMotion) {
      this.chkCalmMotion.addEventListener('change', () => {
        if (this.renderer) {
          this.renderer.calmMotionEnabled = this.chkCalmMotion?.checked ?? false;
        }
        this.onLayerChanged?.();
      });
    }

    // Longitudinal Evolutionary Flight Log Exports
    const btnExportJson = document.getElementById('btn-export-history-json');
    if (btnExportJson) {
      btnExportJson.addEventListener('click', () => {
        const tele = this.world.exportTelemetry();
        const json = this.world.getHistoryTracker().generateJSON(this.world, tele);
        this.world.getHistoryTracker().triggerBrowserDownload(
          json,
          `siliquarium-history-t${tele.tick}-gen${tele.maxGeneration}.json`,
          'application/json'
        );
        this.showStatus('📥 Evolutionary flight log (JSON) exported!', 'success');
      });
    }

    const btnExportCsv = document.getElementById('btn-export-history-csv');
    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', () => {
        const tele = this.world.exportTelemetry();
        const csv = this.world.getHistoryTracker().generateCSV();
        this.world.getHistoryTracker().triggerBrowserDownload(
          csv,
          `siliquarium-trajectory-t${tele.tick}.csv`,
          'text/csv'
        );
        this.showStatus('📊 Time-series trajectory (CSV) exported!', 'success');
      });
    }
  }

  public showStatus(msg: string, type: 'success' | 'info' = 'success'): void {
    if (!this.statusBadge) return;
    this.statusBadge.textContent = msg;
    this.statusBadge.className = type === 'success' ? 'badge-success' : 'badge-info';
    this.statusBadge.style.display = 'block';
    setTimeout(() => {
      if (this.statusBadge) this.statusBadge.style.display = 'none';
    }, 3200);
  }

  public toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  public open(): void {
    this.closeStudio();
    this.isOpen = true;
    this.drawerEl?.classList.remove('-translate-x-full');
    this.backdropEl?.classList.add('active');
    this.toggleBtn?.classList.add('btn-active');
    this.switchTab('specimen');
    this.showStatus('🔬 In-Vitro Silicoid Laboratory Active', 'info');
    this.updateGeologicalTicker();
    this.syncClarityCheckboxes();
    this.callbacks.onOpenRequested?.();
  }

  public close(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.drawerEl?.classList.add('-translate-x-full');
    this.backdropEl?.classList.remove('active');
    this.toggleBtn?.classList.remove('btn-active');
    this.setBrushMode('select');
    this.callbacks.onCloseRequested?.();
  }

  public openStudio(): void {
    this.close();
    this.studioDrawerEl?.classList.remove('collapsed');
    this.showStatus('🏗️ Design Studio Active', 'info');
    this.syncStudioPanelToggleUI();
    this.refreshLatticeMetrics();
  }

  public closeStudio(): void {
    this.studioDrawerEl?.classList.add('collapsed');
    this.setBrushMode('select');
  }

  public toggleStudioPanelCollapse(): boolean {
    if (!this.studioDrawerEl) return false;
    const isCollapsed = this.studioDrawerEl.classList.toggle('collapsed');
    this.syncStudioPanelToggleUI();
    return isCollapsed;
  }

  public syncStudioPanelToggleUI(): void {
    const isCollapsed = this.studioDrawerEl?.classList.contains('collapsed') ?? false;
    const icon = document.getElementById('studio-drawer-toggle-icon');
    const label = document.getElementById('studio-drawer-toggle-label');
    const hudBtn = document.getElementById('btn-toggle-studio-panel-hud');
    if (icon) icon.textContent = isCollapsed ? '◀' : '▶';
    if (label) label.textContent = isCollapsed ? 'STUDIO' : 'HIDE';
    if (hudBtn) hudBtn.textContent = isCollapsed ? '📐 Studio Panel: SHOW' : '📐 Studio Panel: HIDE';
  }

  public toggleCadBrushes(): boolean {
    const palette = document.getElementById('studio-cad-palette');
    if (!palette) return false;
    const isHidden = palette.classList.toggle('hidden');
    const hudBtn = document.getElementById('btn-toggle-brush-toolbar');
    if (hudBtn) hudBtn.textContent = isHidden ? '🖌️ Brushes: HIDDEN' : '🖌️ Brushes: VISIBLE';
    return !isHidden;
  }

  public switchTab(targetTab: string): void {
    if (!this.tabButtons || !this.tabPanes) return;
    let actualTab = targetTab;
    if (actualTab === 'geodynamics') actualTab = 'specimen';
    if (actualTab === 'inoculator') actualTab = 'biobank';

    this.tabButtons.forEach(b => {
      const tabVal = b.getAttribute('data-tab');
      const isMatch = tabVal === actualTab || tabVal === targetTab;
      b.classList.toggle('active', isMatch);
    });
    this.tabPanes.forEach(p => {
      const paneVal = p.getAttribute('data-pane');
      const isMatch = paneVal === actualTab || paneVal === targetTab;
      p.classList.toggle('active', isMatch);
    });
    if (actualTab === 'specimen' || targetTab === 'geodynamics') {
      this.updateGeologicalTicker();
    }
    this.workflowSteps?.forEach(step => {
      const stepTab = step.dataset.targetTab;
      if (stepTab) {
        step.classList.toggle('active', stepTab === targetTab || stepTab === actualTab);
      }
    });
  }

  public showNewModal(): void {
    if (this.modalNewSiliquarium) {
      this.modalNewSiliquarium.classList.remove('hidden');
    }
  }

  public hideNewModal(): void {
    if (this.modalNewSiliquarium) {
      this.modalNewSiliquarium.classList.add('hidden');
    }
  }

  public setUndoRedoState(canUndo: boolean, canRedo: boolean): void {
    if (this.btnStudioUndo) {
      this.btnStudioUndo.disabled = !canUndo;
      this.btnStudioUndo.style.opacity = canUndo ? '1.0' : '0.4';
      this.btnStudioUndo.style.cursor = canUndo ? 'pointer' : 'not-allowed';
    }
    if (this.btnStudioRedo) {
      this.btnStudioRedo.disabled = !canRedo;
      this.btnStudioRedo.style.opacity = canRedo ? '1.0' : '0.4';
      this.btnStudioRedo.style.cursor = canRedo ? 'pointer' : 'not-allowed';
    }
  }

  public showSterileLaunchModal(): void {
    if (this.modalSterileLaunch) {
      this.modalSterileLaunch.classList.remove('hidden');
    }
  }

  public hideSterileLaunchModal(): void {
    if (this.modalSterileLaunch) {
      this.modalSterileLaunch.classList.add('hidden');
    }
  }

  public updateCursorStatus(coord: HexCoord3D | null, toolName?: string): void {
    if (this.studioStatusCoord) {
      if (coord) {
        this.studioStatusCoord.textContent = `[Q: ${coord.q}, R: ${coord.r}, Z: ${coord.z}]`;
      } else {
        this.studioStatusCoord.textContent = `[-- , -- , --]`;
      }
    }
    if (this.studioStatusTool && toolName) {
      const radius = this.renderer?.studioBrushRadius ?? 1;
      const height = this.renderer?.studioBrushWallHeight ?? 3;
      const toolUpper = toolName.toUpperCase();
      if (toolName === 'basalt') {
        this.studioStatusTool.textContent = `BASALT WALL (H=${height}, ${radius}x)`;
      } else {
        this.studioStatusTool.textContent = `${toolUpper} (${radius}x)`;
      }
    }
    this.refreshLatticeMetrics();
  }

  public refreshLatticeMetrics(): void {
    if (this.studioStatusLattice) {
      const radius = this.world.getRadius();
      const minZ = this.world.getMinZ();
      const maxZ = this.world.getMaxZ();
      const poresCount = this.world.getAllPores().length;
      const basaltCount = this.world.getAllPores().filter(p => p.isBasalt()).length;
      const subterraneanNichesCount = this.world.getAllPores().filter(p => p.coord.z < 0 && !p.isBasalt()).length;
      const ventOffshoots = this.world.getVent().getOffshoots().length;
      const zStr = minZ < 0 ? `z=${minZ}..${maxZ}` : `z=0..${maxZ}`;
      const subStr = minZ < 0 ? ` • ${subterraneanNichesCount} Subterranean Niches` : ' • Upward Growth';
      this.studioStatusLattice.textContent = `R=${radius} (${zStr}) • ${poresCount} Pores • ${1 + ventOffshoots} Vents • ${basaltCount} Basalt${subStr}`;
    }
  }

  public updateLive(telemetry: ISimulationTelemetry): void {
    if (this.isOpen) {
      this.updateGeologicalTicker();
      this.syncClarityCheckboxes();
      this.updateTelemetryPane(telemetry);
    }
  }

  public updateTelemetryPane(telemetry: ISimulationTelemetry): void {
    const elEnergy = document.getElementById('studio-tele-energy');
    if (elEnergy && telemetry.ledger) {
      const inv = telemetry.ledger.energyBalanceDelta;
      const isConserved = telemetry.ledger.isEnergyConserved;
      elEnergy.textContent = `Δ = ${inv >= 0 ? '+' : ''}${inv.toFixed(3)} (${isConserved ? 'Conserved' : 'Deficit'})`;
      elEnergy.style.color = isConserved ? '#10b981' : '#ef4444';
    }

    const elMatter = document.getElementById('studio-tele-matter');
    if (elMatter && telemetry.ledger) {
      const inv = telemetry.ledger.matterBalanceDelta;
      const isConserved = telemetry.ledger.isMatterConserved;
      elMatter.textContent = `Δ = ${inv >= 0 ? '+' : ''}${inv.toFixed(3)} (${isConserved ? 'Conserved' : 'Deficit'})`;
      elMatter.style.color = isConserved ? '#10b981' : '#ef4444';
    }

    const elLandauer = document.getElementById('studio-tele-landauer');
    if (elLandauer && telemetry.ledger) {
      elLandauer.textContent = `${telemetry.ledger.totalEnergyBurnedLandauer.toFixed(1)} kT ln 2`;
    }

    const elEntropy = document.getElementById('studio-tele-entropy');
    if (elEntropy && telemetry.ledger) {
      elEntropy.textContent = `${telemetry.ledger.totalEnergyDissipatedHeat.toFixed(1)} eu`;
    }

    const elGen = document.getElementById('studio-tele-generation');
    if (elGen) {
      elGen.textContent = `Gen ${telemetry.maxGeneration}`;
    }

    const elClades = document.getElementById('studio-tele-clades');
    if (elClades) {
      elClades.textContent = `${telemetry.activeCladesCount} Active Lineages`;
    }
  }

  public syncClarityCheckboxes(): void {
    if (this.renderer) {
      if (this.chkFilterConduits && document.activeElement !== this.chkFilterConduits) {
        this.chkFilterConduits.checked = this.renderer.filterSyncytium !== 'off';
      }
      if (this.chkFilterAuras && document.activeElement !== this.chkFilterAuras) {
        this.chkFilterAuras.checked = this.renderer.filterShowAuras;
      }
      if (this.chkFilterTrophic && document.activeElement !== this.chkFilterTrophic) {
        this.chkFilterTrophic.checked = this.renderer.filterShowTrophicRays;
      }
      if (this.chkCalmMotion && document.activeElement !== this.chkCalmMotion) {
        this.chkCalmMotion.checked = this.renderer.calmMotionEnabled;
      }
    }
  }

  public updateGeologicalTicker(): void {
    if (!this.geoTickerEl) return;
    const geoEngine = this.world.getGeologicalEngine();
    const active = geoEngine.getActiveEvents();
    const history = geoEngine.getEventHistory();
    const tidal = geoEngine.currentTidalVector;

    let html = '';

    // Active ongoing perturbations
    if (active.length > 0) {
      html += '<div style="margin-bottom:6px;"><strong style="color:#f59e0b;font-size:0.72rem;">ACTIVE PHENOMENA:</strong></div>';
      active.forEach(evt => {
        html += `
          <div style="background:rgba(245,158,11,0.12);border-left:3px solid #f59e0b;padding:5px 8px;margin-bottom:5px;border-radius:4px;">
            <div style="display:flex;justify-content:space-between;color:#fef08a;font-weight:bold;font-size:0.72rem;">
              <span>${evt.icon} ${evt.title}</span>
              <span style="color:#f59e0b;font-family:monospace;">⏳ ${evt.ticksRemaining}t left</span>
            </div>
            <div style="color:#cbd5e1;font-size:0.67rem;margin-top:2px;line-height:1.35;">${evt.description}</div>
          </div>
        `;
      });
    }

    // Tidal current status
    const tidalDirections = ['East (→)', 'South-East (↘)', 'South-West (↙)', 'West (←)', 'North-West (↖)', 'North-East (↗)'];
    const tidalDirIdx = Math.floor(((tidal.angle + Math.PI) / (2 * Math.PI)) * 6) % 6;
    const tidalDirName = tidalDirections[tidalDirIdx] || 'Semi-diurnal';
    html += `
      <div style="background:rgba(56,189,248,0.08);border-left:3px solid #38bdf8;padding:4px 8px;margin-bottom:6px;border-radius:4px;">
        <div style="color:#38bdf8;font-weight:bold;font-size:0.71rem;">🌊 Planetary Tidal Vector: ${tidalDirName}</div>
        <div style="color:#94a3b8;font-size:0.67rem;">Drift Bias: [dq: ${tidal.dq}, dr: ${tidal.dr}] • Speed: ${(tidal.speed * 100).toFixed(0)}%</div>
      </div>
    `;

    // Recent historical events
    if (history.length > 0) {
      html += '<div style="margin-top:6px;margin-bottom:4px;color:#94a3b8;font-size:0.68rem;font-weight:bold;">RECENT TECTONIC EVENTS:</div>';
      const recent = history.slice(-3).reverse();
      recent.forEach(evt => {
        html += `
          <div style="font-size:0.67rem;color:#94a3b8;padding:3px 0;border-bottom:1px dashed #1e293b;display:flex;gap:6px;">
            <span style="color:#64748b;font-family:monospace;">[t=${evt.tick}]</span>
            <span style="color:#e2e8f0;flex:1;">${evt.icon} <strong>${evt.title}</strong>: ${evt.description.slice(0, 50)}...</span>
          </div>
        `;
      });
    } else if (active.length === 0) {
      html += '<div style="color:#64748b;font-style:italic;">No active tectonic perturbations. Seafloor in steady state.</div>';
    }

    if (this.geoTickerEl) {
      this.geoTickerEl.innerHTML = html;
    }
    const shakerTicker = document.getElementById('shaker-event-ticker');
    if (shakerTicker) {
      shakerTicker.innerHTML = html;
    }
    const shakerBadge = document.getElementById('shaker-status-badge');
    if (shakerBadge) {
      if (active.length > 0) {
        shakerBadge.textContent = `⚠️ Active Shocks (${active.length})`;
        shakerBadge.style.color = '#f59e0b';
      } else {
        shakerBadge.textContent = 'Seafloor Steady';
        shakerBadge.style.color = '#94a3b8';
      }
    }
  }

  public updateStagedSpecimen(pore: IPoreTelemetry | null, tele: ISimulationTelemetry): void {
    const taxonEl = document.getElementById('lab-specimen-taxon');
    const badgeEl = document.getElementById('lab-specimen-badge');
    const metaEl = document.getElementById('lab-specimen-meta');
    const batteryEl = document.getElementById('lab-specimen-battery');
    const morphEl = document.getElementById('lab-specimen-morph');
    const colonySelect = document.getElementById('lab-select-active-colony') as HTMLSelectElement | null;
    const organelleRow = document.getElementById('lab-grn-organelle-row');
    const sensorsEl = document.getElementById('lab-grn-sensors');
    const motifsEl = document.getElementById('lab-grn-motifs');

    // Update Colony Select Dropdown
    if (colonySelect) {
      const occupiedPores = tele.pores.filter(p => p.state === PoreState.OCCUPIED);
      const currentVal = pore ? `${pore.coord.q},${pore.coord.r},${pore.coord.z}` : '';

      let optionsHtml = '';
      if (occupiedPores.length === 0) {
        optionsHtml = '<option value="">Zero living silicoids on seafloor</option>';
      } else {
        occupiedPores.forEach(p => {
          const key = `${p.coord.q},${p.coord.r},${p.coord.z}`;
          const taxon = p.speciesTaxon ?? TaxonomyNomenclature.classify({
            tapeBitstring: p.tapeBitstring,
            gateTypes: p.gateTypes,
            generation: p.generation,
            isBasalt: p.isBasalt,
            hasOrganelle: p.hasOrganelle,
            isSyncytium: p.isSyncytium,
            isDifferentiated: p.isDifferentiated
          });
          const isSel = key === currentVal ? 'selected' : '';
          optionsHtml += `<option value="${key}" ${isSel}>Pore [${p.coord.q},${p.coord.r},${p.coord.z}] — ${taxon.binomialName} (${p.energy} mV)</option>`;
        });
      }
      colonySelect.innerHTML = optionsHtml;
    }

    if (!pore || pore.state !== PoreState.OCCUPIED) {
      if (taxonEl) taxonEl.textContent = 'No Specimen Staged';
      if (badgeEl) {
        badgeEl.textContent = 'STAGE IDLE';
        badgeEl.style.background = '#334155';
        badgeEl.style.color = '#94a3b8';
      }
      if (metaEl) {
        metaEl.textContent = 'Click any living silicoid on the seafloor to stage under laboratory instruments, or choose a living colony from the dropdown above.';
      }
      if (batteryEl) batteryEl.textContent = '-- mV';
      if (morphEl) morphEl.textContent = '--';
      if (organelleRow) organelleRow.style.display = 'none';
      return;
    }

    const taxon = pore.speciesTaxon ?? TaxonomyNomenclature.classify({
      tapeBitstring: pore.tapeBitstring,
      gateTypes: pore.gateTypes,
      generation: pore.generation,
      isBasalt: pore.isBasalt,
      hasOrganelle: pore.hasOrganelle,
      isSyncytium: pore.isSyncytium,
      isDifferentiated: pore.isDifferentiated
    });
    if (taxonEl) taxonEl.textContent = taxon.binomialName;
    if (badgeEl) {
      badgeEl.textContent = `GEN ${pore.generation ?? 1} • ${taxon.honoree}`;
      badgeEl.style.background = '#065f46';
      badgeEl.style.color = '#6ee7b7';
    }
    if (metaEl) {
      metaEl.innerHTML = `<strong>${taxon.commonName}</strong> • Pore [q:${pore.coord.q}, r:${pore.coord.r}, z:${pore.coord.z}] • Clade: ${pore.cladeId || 'WL-Primordial'}`;
    }
    if (batteryEl) {
      const stateStr = pore.energy > 40 ? 'Optimal' : pore.energy > 15 ? 'Stable' : 'Depleted';
      batteryEl.textContent = `${pore.energy} mV (${stateStr})`;
      batteryEl.style.color = pore.energy > 40 ? '#10b981' : pore.energy > 15 ? '#fbbf24' : '#f43f5e';
    }
    if (morphEl) {
      const syncCount = pore.syncytiumMemberCount ?? 1;
      morphEl.textContent = syncCount > 1 ? `Syncytium (${syncCount} Cells)` : 'Unicellular';
    }

    if (organelleRow) {
      organelleRow.style.display = pore.hasOrganelle ? 'block' : 'none';
    }

    // Dynamic Sensor & Logic Switches
    if (sensorsEl) {
      const streamAActive = tele.vent.streamA;
      const streamBActive = tele.vent.streamB;
      const toxinActive = tele.vent.toxinT;

      sensorsEl.innerHTML = `
        <span class="grn-switch-pill ${streamAActive ? 'active' : ''}" title="Stream A Receptor">● Stream A: ${streamAActive ? 'Active' : 'Closed'}</span>
        <span class="grn-switch-pill ${streamBActive ? 'active' : ''}" title="Stream B Receptor">● Stream B: ${streamBActive ? 'Active' : 'Closed'}</span>
        <span class="grn-switch-pill ${toxinActive ? 'active' : ''}" style="${toxinActive ? 'border-color:#f43f5e;color:#fb7185;background:rgba(244,63,94,0.15);' : 'opacity:0.6;'}" title="Toxin Sensor">● Toxin T: ${toxinActive ? 'Plume Influx' : 'Shielded'}</span>
      `;
    }

    if (motifsEl) {
      const gates = pore.gateCount ?? (pore.hasOrganelle ? 4 : 2);
      const expressed = pore.expressedGateCount ?? gates;
      const repressed = pore.repressedGateCount ?? 0;
      const operonLabel = repressed > 0
        ? `<span style="background:rgba(239,68,68,0.15);color:#f87171;border:1px solid rgba(239,68,68,0.4);padding:2px 6px;border-radius:4px;font-size:0.65rem;font-family:monospace;">${repressed} Repressed</span>`
        : `<span style="background:rgba(16,185,129,0.15);color:#6ee7b7;border:1px solid rgba(16,185,129,0.4);padding:2px 6px;border-radius:4px;font-size:0.65rem;font-family:monospace;">All Operons Active</span>`;

      motifsEl.innerHTML = `
        <span style="background:#1e293b;color:#38bdf8;padding:2px 6px;border-radius:4px;font-size:0.65rem;font-family:monospace;">${expressed}/${gates} Gates Expressed</span>
        ${operonLabel}
        <span style="background:#1e293b;color:#a855f7;padding:2px 6px;border-radius:4px;font-size:0.65rem;font-family:monospace;">Landauer Conserved</span>
      `;
    }
  }

  public isExpanded(): boolean {
    return this.isOpen;
  }

  public getActiveBrushMode(): StudioBrushMode {
    return this.activeBrushMode;
  }

  public setBrushMode(mode: StudioBrushMode): void {
    this.activeBrushMode = mode;
    if (this.renderer) {
      this.renderer.activeBrushMode = mode;
    }
    this.callbacks.onBrushModeChanged?.(mode);

    // Update active highlight on drawer tool buttons
    const modes: StudioBrushMode[] = ['select', 'basalt', 'excavate', 'trench', 'vent', 'inoculate', 'clear'];
    modes.forEach(m => {
      const btn = document.getElementById(`brush-${m}`);
      if (btn) {
        if (m === mode) {
          btn.classList.add('brush-active');
        } else {
          btn.classList.remove('brush-active');
        }
      }
    });

    // Update floating CAD tool buttons
    document.querySelectorAll<HTMLButtonElement>('.cad-tool-btn[data-mode]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });

    // Update Studio Context Card in right drawer
    const contextIcon = document.getElementById('studio-context-brush-icon');
    const contextName = document.getElementById('studio-context-brush-name');
    if (contextIcon && contextName) {
      const modeMap: Record<string, { icon: string; name: string }> = {
        select: { icon: '🔍', name: 'Select / Orbit (1)' },
        basalt: { icon: '🧱', name: 'Basalt Wall (2)' },
        excavate: { icon: '⛏️', name: 'Excavate Pores (3)' },
        trench: { icon: '🌊', name: 'Rift Trench (4)' },
        vent: { icon: '🌋', name: 'Vent Spire (5)' },
        inoculate: { icon: '🧬', name: 'Inoculate Cell (6)' },
        clear: { icon: '🧹', name: 'Clear / Vacuum (7)' },
      };
      const info = modeMap[mode] || { icon: '🖌️', name: mode };
      contextIcon.textContent = info.icon;
      contextName.textContent = info.name;
    }

    this.updateBrushIndicator(mode);
    this.updateCursorStatus(this.callbacks.getSelectedCoord?.() ?? null, mode);
  }

  public setBrushRadius(r: number): void {
    if (this.renderer) {
      this.renderer.studioBrushRadius = r;
    }
    document.querySelectorAll('.brush-size-btn[data-radius]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-radius') === String(r));
    });
    document.querySelectorAll('.cad-radius-btn[data-radius]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-radius') === String(r));
    });
    this.updateCursorStatus(this.callbacks.getSelectedCoord?.() ?? null, this.activeBrushMode);
  }

  public setBrushWallHeight(h: number): void {
    if (this.renderer) {
      this.renderer.studioBrushWallHeight = h;
    }
    document.querySelectorAll('.brush-size-btn[data-height]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-height') === String(h));
    });
    document.querySelectorAll('.cad-wall-btn[data-height]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-height') === String(h));
    });
    this.updateCursorStatus(this.callbacks.getSelectedCoord?.() ?? null, this.activeBrushMode);
  }

  public getTargetZLayer(): 'auto' | number {
    return this.targetZLayer;
  }

  public setTargetZLayer(z: 'auto' | number): void {
    this.targetZLayer = z;
    const label = document.getElementById('label-brush-z-val');
    if (label) {
      if (z === 'auto') label.textContent = 'Auto-Stack ⤊';
      else if (z === -4) label.textContent = 'z=-4 (Deep Lithosphere)';
      else if (z === -3) label.textContent = 'z=-3 (Deep Caverns)';
      else if (z === -2) label.textContent = 'z=-2 (Fissures)';
      else if (z === -1) label.textContent = 'z=-1 (Trench/Chasm)';
      else if (z === 0) label.textContent = 'z=0 (Floor Bedrock)';
      else if (z === 1) label.textContent = 'z=1 (Lower)';
      else if (z === 2) label.textContent = 'z=2 (Mid)';
      else if (z === 3) label.textContent = 'z=3 (Upper)';
      else if (z === 4) label.textContent = 'z=4 (Summit)';
      else if (z === 5) label.textContent = 'z=5 (Citadel Lower)';
      else if (z === 6) label.textContent = 'z=6 (Citadel Summit)';
      else label.textContent = `z=${z} (High Spire)`;
    }

    const cadStratum = document.getElementById('cad-select-stratum') as HTMLSelectElement | null;
    if (cadStratum) {
      cadStratum.value = String(z);
    }

    const tiers = ['auto', 'neg4', 'neg3', 'neg2', 'neg1', '0', '1', '2', '3', '4', '5', '6', '7', '8'];
    tiers.forEach(t => {
      const btn = document.getElementById(`layer-z-${t}`);
      if (btn) {
        const isMatch = (t === 'auto' && z === 'auto') ||
                        (t === 'neg4' && z === -4) ||
                        (t === 'neg3' && z === -3) ||
                        (t === 'neg2' && z === -2) ||
                        (t === 'neg1' && z === -1) ||
                        (t === String(z));
        if (isMatch) {
          btn.classList.add('scale-active');
        } else {
          btn.classList.remove('scale-active');
        }
      }
    });

    this.updateBrushIndicator(this.activeBrushMode);
  }

  private updateBrushIndicator(mode: string): void {
    const indicator = document.getElementById('brush-active-indicator');
    const nameEl = document.getElementById('brush-indicator-name');
    const iconEl = document.getElementById('brush-indicator-icon');
    const hintEl = document.getElementById('brush-indicator-sub');

    if (!indicator) return;

    if (mode === 'select') {
      indicator.classList.add('hidden');
    } else {
      indicator.classList.remove('hidden');
      const activeStrain = BioBank.getInstance().getActiveInoculant();
      const details: Record<string, { icon: string; name: string; hint: string }> = {
        basalt: {
          icon: '🧱',
          name: 'BASALT BARRIER',
          hint: this.targetZLayer === 'auto'
            ? '(Click pore to place • Click again to stack vertically above flat surface • Esc to finish)'
            : `(Targeting vertical layer z=${this.targetZLayer} • Esc to finish)`
        },
        excavate: {
          icon: '⛏️',
          name: 'PORE EXCAVATOR',
          hint: '(Click to excavate habitable rock cavity • Esc to finish)'
        },
        trench: {
          icon: '🌊',
          name: 'GOUGE TRENCH (z=-1)',
          hint: '(Click to carve sunken abyssal rift canyon at z=-1 • Esc to finish)'
        },
        vent: {
          icon: '🌋',
          name: 'VENT SPIRE',
          hint: '(Click to plant high-thermal hydrothermal chimney spire • Esc to finish)'
        },
        inoculate: {
          icon: '🧬',
          name: activeStrain ? `INOCULATING: ${activeStrain.name.toUpperCase()}` : 'CELL INOCULATOR',
          hint: activeStrain
            ? `(Injecting ${activeStrain.taxonBinomial} • ${activeStrain.gateCount} Gates • Gen ${activeStrain.generation} • Click pore to inject • Esc to finish)`
            : '(Click habitable pore to inject living cell • Esc to finish)'
        },
        lenski_dropper: {
          icon: '🌱',
          name: 'LENSKI DROPPER',
          hint: '(Click to drop founder strain • Esc to finish)'
        },
        pipette: {
          icon: '🌱',
          name: 'LENSKI PIPETTE',
          hint: '(Click to drop founder strain • Esc to finish)'
        },
        clear: {
          icon: '🧹',
          name: 'VACUUM / CLEAR',
          hint: '(Click to clear cell, detritus, or basalt tier • Esc to finish)'
        },
      };
      const info = details[mode] ?? { icon: '🖌️', name: mode.toUpperCase(), hint: '(Click pore • Esc to finish)' };
      if (iconEl) iconEl.textContent = info.icon;
      if (nameEl) nameEl.textContent = info.name;
      if (hintEl) hintEl.textContent = info.hint;
    }
  }

  public updateBioBankUI(): void {
    if (!this.bioBankListEl) return;
    const bioBank = BioBank.getInstance();
    const strains = bioBank.getAll();
    const active = bioBank.getActiveInoculant();

    if (this.bioBankStatusBadge) {
      this.bioBankStatusBadge.textContent = `${strains.length} Strain${strains.length === 1 ? '' : 's'}`;
    }

    if (this.pipetteStatusDesc) {
      if (active) {
        this.pipetteStatusDesc.textContent = `Armed with "${active.name}" (${active.taxonBinomial}, ${active.gateCount} Gates, Gen ${active.generation})`;
        this.pipetteStatusDesc.style.color = '#6ee7b7';
      } else {
        this.pipetteStatusDesc.textContent = 'No frozen strain loaded. Select a strain from the vault below or arm to inject prebiotic soup.';
        this.pipetteStatusDesc.style.color = '#94a3b8';
      }
    }

    if (strains.length === 0) {
      this.bioBankListEl.innerHTML = buildBioBankEmptyHtml();
      return;
    }

    this.bioBankListEl.innerHTML = buildBioBankListHtml({
      strains,
      activeStrainId: active?.id
    });

    // Wire clicks on cards
    this.bioBankListEl.querySelectorAll('.btn-biobank-select').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = (btn as HTMLElement).getAttribute('data-strain-id');
        if (id) {
          bioBank.setActiveInoculant(id);
          const chosen = bioBank.getById(id);
          this.showStatus(`🌱 Active Inoculant set: "${chosen?.name ?? id}"`, 'info');
        }
      });
    });

    this.bioBankListEl.querySelectorAll('.btn-biobank-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = (btn as HTMLElement).getAttribute('data-strain-id');
        if (id && confirm('Delete this frozen strain from the Bio-Bank?')) {
          bioBank.deleteSilicoid(id);
          this.showStatus('🗑️ Strain removed from vault.', 'info');
        }
      });
    });
  }
}
