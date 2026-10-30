/**
 * 🐠 Siliquarium Main Application Entrypoint
 * Wires Simulation Engine, 3D Seafloor Renderer, Circuit Microscope, HUD, God Panel,
 * In-App Academic Glossary, and Circuit Explainability Testbench.
 */

import { SimulationWorld, INewSiliquariumOptions } from './engine/SimulationWorld.js';
import { SimulationLoop } from './engine/SimulationLoop.js';
import { OrbitCamera } from './visualizers/OrbitCamera.js';
import { SeafloorRenderer3D } from './visualizers/SeafloorRenderer3D.js';
import { CircuitMicroscopeView } from './visualizers/CircuitMicroscopeView.js';
import { HUDController } from './ui/HUDController.js';
import { LabFlyout } from './ui/LabFlyout.js';
import { InteractiveControls } from './ui/InteractiveControls.js';
import { MilestoneModal } from './ui/MilestoneModal.js';
import { HexCoord3D } from './core/spatial/HexCoord3D.js';
import { PoreState, PoreMedium } from './core/domain/Pore.js';
import { IPoreTelemetry, ISimulationTelemetry } from './engine/SimulationTelemetry.js';
import { CircuitAdvantageAnalyzer } from './core/analysis/CircuitAdvantageAnalyzer.js';
import { PoreWorkshop } from './core/domain/PoreWorkshop.js';
import { GlossaryModal } from './ui/GlossaryModal.js';
import { PhylogenyModal } from './ui/PhylogenyModal.js';
import { DiscoveryHistoryModal } from './ui/DiscoveryHistoryModal.js';
import { NaturalistAssistant } from './ui/NaturalistAssistant.js';
import { GeologicalEventModal } from './ui/GeologicalEventModal.js';
import { VisualKeyModal } from './ui/VisualKeyModal.js';
import { CircuitAutopsyModal } from './ui/CircuitAutopsyModal.js';
import { ChroniclePlaybackBar } from './ui/ChroniclePlaybackBar.js';
import { ChronicleTourGuide, IChronicleTourStop } from './ui/ChronicleTourGuide.js';
import { ChronicleAnalysisLabModal } from './ui/ChronicleAnalysisLabModal.js';
import { ChronicleArchiveManager } from './engine/kinematics/ChronicleArchiveManager.js';
import { LensViewMode } from './engine/kinematics/ColonyKinematicsRecorder.js';
import { HistologicalInspectorModal } from './ui/HistologicalInspectorModal.js';
import { EvolutionaryBranchModal } from './ui/EvolutionaryBranchModal.js';
import { EvolutionaryVersionManager } from './engine/storage/EvolutionaryVersionManager.js';
import { GenomeSafe } from './core/domain/GenomeSafe.js';
import { BioBank } from './engine/storage/BioBank.js';
import { AudioSynthesizer } from './ui/AudioSynthesizer.js';
import { TaxonomyNomenclature } from './core/paleontology/TaxonomyNomenclature.js';
import { RemoteSimulationClient } from './engine/remote/RemoteSimulationClient.js';
import { AbyssalArenaController } from './ui/AbyssalArenaController.js';
import { DeepLabController } from './ui/DeepLabController.js';
import { BrowserDownloadBridge } from './ui/BrowserDownloadBridge.js';
import { BrowserLocalStorageProvider } from './ui/BrowserLocalStorageProvider.js';
import { SimulationSnapshotManager } from './engine/storage/SimulationSnapshotManager.js';
import { EnvironmentPresetRegistry } from './engine/storage/EnvironmentPresetRegistry.js';

class SiliquariumApp {
  private readonly world: SimulationWorld;
  private readonly loop: SimulationLoop;
  private readonly camera: OrbitCamera;
  private readonly seafloorRenderer: SeafloorRenderer3D;
  private readonly microscopeView: CircuitMicroscopeView;
  private readonly hud: HUDController;
  private readonly flyout: LabFlyout;
  private readonly controls: InteractiveControls;
  private readonly milestoneModal: MilestoneModal;
  private readonly phylogenyModal: PhylogenyModal;
  private readonly discoveryModal: DiscoveryHistoryModal;
  private readonly naturalistAssistant: NaturalistAssistant;
  private readonly geoEventModal: GeologicalEventModal;
  private readonly visualKeyModal: VisualKeyModal;
  private readonly circuitAutopsyModal: CircuitAutopsyModal;
  private readonly chroniclePlaybackBar: ChroniclePlaybackBar;
  private readonly chronicleTourGuide: ChronicleTourGuide;
  private readonly chronicleAnalysisLabModal: ChronicleAnalysisLabModal;
  private readonly histologicalInspectorModal: HistologicalInspectorModal;
  private readonly branchModal: EvolutionaryBranchModal;
  private readonly arenaController: AbyssalArenaController;
  private readonly deepLabController: DeepLabController;
  private activePortal: 'deeplab' | 'arena' = 'deeplab';

  private readonly seafloorCanvas: HTMLCanvasElement;
  private readonly microscopeCanvas: HTMLCanvasElement;
  private readonly safariNetlistCanvas: HTMLCanvasElement | null = null;
  private safariCircuitView: CircuitMicroscopeView | null = null;
  private selectedPoreCoord: HexCoord3D | null = null;
  private latestTelemetry: ISimulationTelemetry | null = null;
  private readonly remoteClient: RemoteSimulationClient = new RemoteSimulationClient();
  private isServerMode: boolean = false;
  private remoteTelemetry: ISimulationTelemetry | null = null;

  // Signal probe testbench virtual inputs
  private probeA: boolean = false;
  private probeB: boolean = false;
  private probeToxin: boolean = false;

  // Advantage card DOM element references
  private advantageCard: HTMLElement | null = null;
  private advBadge: HTMLElement | null = null;
  private advTitle: HTMLElement | null = null;
  private advDesc: HTMLElement | null = null;
  private scoreBarYield: HTMLElement | null = null;
  private scoreValYield: HTMLElement | null = null;
  private scoreBarLandauer: HTMLElement | null = null;
  private scoreValLandauer: HTMLElement | null = null;
  private scoreBarToxin: HTMLElement | null = null;
  private scoreValToxin: HTMLElement | null = null;
  private probeBtnA: HTMLElement | null = null;
  private probeBtnB: HTMLElement | null = null;
  private probeBtnToxin: HTMLElement | null = null;
  private probeResultText: HTMLElement | null = null;

  // Microscope flyout drawer DOM element references
  private microscopePanel: HTMLElement | null = null;
  private microscopeCloseBtn: HTMLElement | null = null;
  private microscopeToggleBtn: HTMLElement | null = null;

  // Microscope tabs and font controls
  private tabBtnSchematic: HTMLElement | null = null;
  private tabBtnAnalysis: HTMLElement | null = null;
  private tabPaneSchematic: HTMLElement | null = null;
  private tabPaneAnalysis: HTMLElement | null = null;
  private analysisEmptyPlaceholder: HTMLElement | null = null;
  private microscopeFontScale: number = 1.0;
  private activeMicroscopeTab: 'schematic' | 'analysis' = 'schematic';
  private lastAdvantageCoordKey: string | null = null;
  private lastAdvantageTape: string | null = null;
  private activeWorkspaceMode: 'observatory' | 'safari' | 'laboratory' | 'studio' | 'chronicle' = 'observatory';
  private wasPlayingBeforeStudio: boolean = false;
  private wasPlayingBeforeChronicle: boolean = false;
  private studioSnapshot: string | null = null;
  private studioUndoStack: string[] = [];
  private studioRedoStack: string[] = [];
  private readonly MAX_STUDIO_UNDO_DEPTH: number = 30;

  // Observatory Mode Screen 1 DOM elements
  private obsSpecimenCard: HTMLElement | null = null;
  private obsCardTitle: HTMLElement | null = null;
  private obsCardIcon: HTMLElement | null = null;
  private obsValTaxon: HTMLElement | null = null;
  private obsValCoord: HTMLElement | null = null;
  private obsValActivity: HTMLElement | null = null;
  private obsVitalBattery: HTMLElement | null = null;
  private obsVitalMatter: HTMLElement | null = null;
  private obsVitalGen: HTMLElement | null = null;
  private obsVitalLandauer: HTMLElement | null = null;
  private obsCircuitSummary: HTMLElement | null = null;
  private obsBtnSafari: HTMLElement | null = null;
  private obsBtnMicroscope: HTMLElement | null = null;
  private obsCardCloseBtn: HTMLElement | null = null;

  // Floating Environmental Telemetry Pill
  private envPillTemp: HTMLElement | null = null;
  private envPillRedox: HTMLElement | null = null;
  private envPillCells: HTMLElement | null = null;

  constructor() {
    this.world = new SimulationWorld({
      radius: 5,
      minZ: -1,
      maxZ: 4,
      soupDensity: 0.25,
      basaltDensity: 0.15,
      terrainRoughness: 0.35
    });

    const storageProvider = new BrowserLocalStorageProvider();
    BioBank.getInstance().setStorage(storageProvider);
    EnvironmentPresetRegistry.getInstance().setStorage(storageProvider);

    this.world.getHistoryTracker().setDownloadHandler(BrowserDownloadBridge.triggerDownload);
    SimulationSnapshotManager.getInstance().setDownloadHandler(BrowserDownloadBridge.triggerDownload);
    ChronicleArchiveManager.setDownloadHandler(BrowserDownloadBridge.triggerDownload);

    this.loop = new SimulationLoop(this.world);
    this.camera = new OrbitCamera();

    this.seafloorCanvas = document.getElementById('canvas-seafloor') as HTMLCanvasElement;
    this.microscopeCanvas = document.getElementById('canvas-microscope') as HTMLCanvasElement;
    this.safariNetlistCanvas = document.getElementById('canvas-safari-netlist') as HTMLCanvasElement | null;

    this.seafloorRenderer = new SeafloorRenderer3D(this.seafloorCanvas, this.camera);
    this.microscopeView = new CircuitMicroscopeView(this.microscopeCanvas);
    if (this.safariNetlistCanvas) {
      this.safariCircuitView = new CircuitMicroscopeView(this.safariNetlistCanvas);
    }
    this.hud = new HUDController();
    this.hud.setOnLensChange((lens) => this.setLensMode(lens));

    this.flyout = new LabFlyout(
      this.world,
      {
        onSeedRequested: (density) => this.world.seedPrimordialSoup(density),
        onResetRequested: () => this.resetSimulation(),
        onThermalPulseRequested: () => this.world.triggerThermalSurge(),
        onExtinctionRequested: () => {
          const center = this.selectedPoreCoord ?? new HexCoord3D(0, 0, 0);
          this.world.triggerExtinctionEvent(center, 2);
        },
        onApplySettingsRequested: (config) => {
          this.world.setVentConfiguration(config.ventCoord, config.offshootCount);
          if (config.terrainRoughness !== undefined && config.basaltDensity !== undefined) {
            this.world.updateTopographySettings(config.terrainRoughness, config.basaltDensity, config.maxZ);
          }
          this.world.setMutationRate(config.mutationRate);
          if (config.duplicationRate !== undefined) this.world.setDuplicationRate(config.duplicationRate);
          if (config.deletionRate !== undefined) this.world.setDeletionRate(config.deletionRate);
          this.world.getVent().plumeWanderingEnabled = config.plumeWandering;
          this.world.getVent().regimeCyclingEnabled = config.regimeCycling;
        },
        onRestartWithConfigRequested: (config) => {
          this.world.restartWithConfig(config);
          this.selectedPoreCoord = null;
          this.seafloorRenderer.setSelectedCoord(null);
          this.camera.setTarget(0, 0, 0);
          this.camera.distance = Math.max(18.0, config.radius * 2.2);
        },
        onBrushModeChanged: (mode) => {
          this.seafloorRenderer.activeBrushMode = mode;
        },
        onPresetLoaded: (preset) => {
          this.selectedPoreCoord = null;
          this.seafloorRenderer.setSelectedCoord(null);
          this.camera.setTarget(0, 0, 0);
          this.camera.distance = Math.max(18.0, preset.grid.radius * 2.2);
          this.flyout.refreshLatticeMetrics();
        },
        onNewRequested: (options: INewSiliquariumOptions) => {
          this.world.createNewSiliquarium(options);
          this.selectedPoreCoord = null;
          this.seafloorRenderer.setSelectedCoord(null);
          this.camera.setTarget(0, 0, 0);
          this.camera.distance = Math.max(18.0, options.radius * 2.2);
          this.flyout.refreshLatticeMetrics();
          const desc = options.mode === 'procedural'
            ? `🎲 Procedurally generated Siliquarium (R=${options.radius}, ${Math.round((options.basaltDensity ?? 0.15) * 100)}% Basalt, ${Math.round((options.terrainRoughness ?? 0.35) * 100)}% Relief)`
            : `✨ Blank Canvas (R=${options.radius}) ready. Sculpt terrain with CAD tools!`;
          this.naturalistAssistant?.showToast(desc);
        },
        onBeginSimulationRequested: () => {
          const livingCount = this.world.getAllPores().filter(p => p.getState() === PoreState.OCCUPIED).length;
          if (livingCount === 0) {
            this.flyout.showSterileLaunchModal();
            return;
          }
          this.setWorkspaceMode('observatory');
          this.loop.start();
          this.controls.setPlaying(true);
          this.naturalistAssistant?.showToast('🚀 Simulation commenced with custom Siliquarium environment!');
        },
        onInoculateAndBeginRequested: () => {
          const seeded = this.world.seedFoundersAroundVents(3);
          this.setWorkspaceMode('observatory');
          this.loop.start();
          this.controls.setPlaying(true);
          this.naturalistAssistant?.showToast(`🌱 Inoculated ${seeded} prebiotic founder strains at hydrothermal vents! Simulation running.`);
        },
        onBeginSterileRequested: () => {
          this.setWorkspaceMode('observatory');
          this.loop.start();
          this.controls.setPlaying(true);
          this.naturalistAssistant?.showToast('⚡ Sterile simulation commenced. Abiotic vents will synthesize prebiotic polymers over time.');
        },
        onUndoRequested: () => {
          this.performStudioUndo();
        },
        onRedoRequested: () => {
          this.performStudioRedo();
        },
        onApplyToCurrentRequested: () => {
          this.setWorkspaceMode('observatory');
          if (this.wasPlayingBeforeStudio) {
            this.loop.start();
            this.controls.setPlaying(true);
          }
          this.naturalistAssistant?.showToast('⚡ Applied geodynamic & environmental adjustments to active simulation.');
        },
        onCancelRequested: () => {
          if (this.studioSnapshot) {
            this.world.restoreWorldSnapshot(this.studioSnapshot);
          }
          this.setWorkspaceMode('observatory');
          if (this.wasPlayingBeforeStudio) {
            this.loop.start();
            this.controls.setPlaying(true);
          }
          this.naturalistAssistant?.showToast('✕ Design Studio closed. Changes discarded.');
        },
        getSelectedCoord: () => this.selectedPoreCoord,
        onSelectCoordRequested: (coord) => {
          this.selectedPoreCoord = coord;
          this.seafloorRenderer.setSelectedCoord(coord);
          const worldPos = this.seafloorRenderer.axialToWorld(coord);
          const inspectDist = Math.min(this.camera.distance, 14.0);
          this.camera.smoothFlyTo(worldPos.x, worldPos.y, worldPos.z, inspectDist);
          this.openMicroscope();
          const tele = this.world.exportTelemetry();
          const pore = tele.pores.find(p => p.coord.equals(coord)) ?? null;
          this.flyout.updateStagedSpecimen(pore, tele);
          this.microscopeView.render(pore, tele.vent);
          this.updateMicroscopeFooter(pore);
        },
        onFocusMicroscopeRequested: () => {
          this.openMicroscope();
          this.switchMicroscopeTab('analysis');
        },
        onOpenAutopsyRequested: () => {
          if (this.selectedPoreCoord) {
            this.circuitAutopsyModal.show(this.selectedPoreCoord);
          } else {
            this.circuitAutopsyModal.show();
          }
        },
        onFreezeStagedRequested: () => {
          const freezeBtn = document.getElementById('btn-microscope-freeze-biobank');
          freezeBtn?.click();
        },
        onOpenRequested: () => {
          if (this.activeWorkspaceMode !== 'laboratory' && this.activeWorkspaceMode !== 'studio') {
            this.setWorkspaceMode('laboratory');
          }
        },
        onCloseRequested: () => {
          if (this.activeWorkspaceMode === 'laboratory') {
            this.setWorkspaceMode('observatory');
          }
        }
      },
      this.seafloorRenderer,
      () => this.controls.syncLayerUI()
    );

    this.controls = new InteractiveControls(
      this.loop,
      this.camera,
      this.seafloorRenderer,
      () => this.focusOnSelected(),
      (active) => this.naturalistAssistant.showToast(active ? '↺ Auto-Orbit Enabled' : '⏸ Auto-Orbit Paused')
    );

    this.discoveryModal = new DiscoveryHistoryModal(
      (coord) => {
        this.selectedPoreCoord = coord;
        this.seafloorRenderer.setSelectedCoord(coord);
        const worldPos = this.seafloorRenderer.axialToWorld(coord);
        this.camera.smoothFlyTo(worldPos, { distance: 7.5, elevation: 0.85 });
        this.openMicroscope();
      },
      (enabled) => {
        this.milestoneModal.setPopupsEnabled(enabled);
      }
    );

    this.milestoneModal = new MilestoneModal(
      (coord) => {
        this.selectedPoreCoord = coord;
        this.seafloorRenderer.setSelectedCoord(coord);
        const worldPos = this.seafloorRenderer.axialToWorld(coord);
        this.camera.smoothFlyTo(worldPos, { distance: 8.5, elevation: 0.75 });
        this.openMicroscope();
        this.loop.pause();
      },
      (muted) => {
        this.discoveryModal.setPopupsEnabled(!muted);
      }
    );

    this.world.getPaleontologist().onMilestone((event) => {
      AudioSynthesizer.getInstance().playMilestoneDiscovery();
      this.updateDiscoveryCounters();
      this.discoveryModal.update(this.world.getPaleontologist().getMilestones());
      if (this.activeWorkspaceMode === 'observatory' || this.activeWorkspaceMode === 'safari') {
        this.pulseDiscoveryBadge();
        this.naturalistAssistant.showToast(`🏆 Milestone Recognized: ${event.motif.name}`);
      } else if (this.milestoneModal.isPopupsEnabled()) {
        this.milestoneModal.show(event);
      } else {
        this.pulseDiscoveryBadge();
      }
    });

    this.geoEventModal = new GeologicalEventModal(
      (coord) => {
        this.selectedPoreCoord = coord;
        this.seafloorRenderer.setSelectedCoord(coord);
        const worldPos = this.seafloorRenderer.axialToWorld(coord);
        this.camera.smoothFlyTo(worldPos, { distance: 8.5, elevation: 0.75 });
        this.openMicroscope();
      }
    );

    this.world.onGeologicalEvent((event) => {
      AudioSynthesizer.getInstance().playGodModeShock();
      if (this.activeWorkspaceMode === 'observatory' || this.activeWorkspaceMode === 'safari') {
        this.naturalistAssistant.showToast(`🌋 Geological Surge: ${event.type}`);
      } else if (this.geoEventModal.isPopupsEnabled()) {
        this.geoEventModal.show(event);
      }
      this.flyout.updateGeologicalTicker();
    });

    const unlockAudio = () => {
      AudioSynthesizer.getInstance().init();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);

    const hudGeoBtn = document.getElementById('hud-geo-event-btn');
    if (hudGeoBtn) {
      hudGeoBtn.addEventListener('click', () => {
        const history = this.world.getGeologicalEngine().getEventHistory();
        if (history.length > 0) {
          this.geoEventModal.show(history[0], true);
        } else {
          this.flyout.open();
        }
      });
    }

    this.phylogenyModal = new PhylogenyModal((coord) => {
      this.selectedPoreCoord = coord;
      this.seafloorRenderer.setSelectedCoord(coord);
      const worldPos = this.seafloorRenderer.axialToWorld(coord);
      this.camera.smoothFlyTo(worldPos, { distance: 7.5, elevation: 0.85 });
      this.openMicroscope();
    });

    const hudPhyloBtn = document.getElementById('hud-phylogeny-btn');
    if (hudPhyloBtn) {
      hudPhyloBtn.addEventListener('click', () => {
        this.phylogenyModal.toggle(this.world.exportTelemetry());
      });
    }

    const togglePhyloBtn = document.getElementById('btn-toggle-phylogeny');
    if (togglePhyloBtn) {
      togglePhyloBtn.addEventListener('click', () => {
        this.phylogenyModal.toggle(this.world.exportTelemetry());
      });
    }

    this.naturalistAssistant = new NaturalistAssistant(this.world, (coord) => {
      this.selectedPoreCoord = coord;
      this.seafloorRenderer.setSelectedCoord(coord);
      const worldPos = this.seafloorRenderer.axialToWorld(coord);
      this.camera.smoothFlyTo(worldPos, { distance: 7.5, elevation: 0.85 });
      if (this.activeWorkspaceMode !== 'safari') {
        this.openMicroscope();
      }
    }, this.loop);

    this.naturalistAssistant.setModeChangeHandler((mode) => this.setWorkspaceMode(mode));
    this.naturalistAssistant.onRoleHighlight((roleName) => {
      this.seafloorRenderer.highlightedRoleName = roleName;
    });
    this.naturalistAssistant.onMuteToggle((muted) => {
      this.seafloorRenderer.muteNonSpecificRoles = muted;
    });
    this.seafloorRenderer.onMorphologyClick = (topology) => {
      GlossaryModal.getInstance().open(topology.toLowerCase() + '_morphology');
    };
    this.naturalistAssistant.registerSafariListener((exemplar, tele, skipFlyTo = false) => {
      this.selectedPoreCoord = exemplar.coord;
      this.seafloorRenderer.setSelectedCoord(exemplar.coord);
      this.seafloorRenderer.safariTargetCoord = exemplar.coord;
      if (!skipFlyTo) {
        const worldPos = this.seafloorRenderer.axialToWorld(exemplar.coord);
        this.camera.smoothFlyTo(worldPos, { distance: 7.5, elevation: 0.85 });
      }
      if (this.safariCircuitView) {
        const pore = tele.pores.find(p => p.coord.equals(exemplar.coord)) ?? null;
        this.safariCircuitView.render(pore, tele.vent);
      }
      if (this.circuitAutopsyModal.isOpen()) {
        this.circuitAutopsyModal.syncPore(exemplar.coord, tele);
      }
    });

    const hudNaturalistBtn = document.getElementById('hud-naturalist-btn');
    hudNaturalistBtn?.addEventListener('click', () => {
      this.naturalistAssistant.toggle();
    });

    const toggleNaturalistBtn = document.getElementById('btn-toggle-naturalist');
    toggleNaturalistBtn?.addEventListener('click', () => {
      this.naturalistAssistant.toggle();
    });

    const hudDiscoveryBtn = document.getElementById('hud-discoveries-btn');
    if (hudDiscoveryBtn) {
      hudDiscoveryBtn.addEventListener('click', () => {
        this.discoveryModal.toggle(
          this.world.getPaleontologist().getMilestones(),
          this.milestoneModal.isPopupsEnabled()
        );
      });
    }

    const transportDiscoveryBtn = document.getElementById('btn-open-discoveries');
    if (transportDiscoveryBtn) {
      transportDiscoveryBtn.addEventListener('click', () => {
        this.discoveryModal.toggle(
          this.world.getPaleontologist().getMilestones(),
          this.milestoneModal.isPopupsEnabled()
        );
      });
    }

    const togglePopupsBtn = document.getElementById('btn-toggle-discovery-popups');
    if (togglePopupsBtn) {
      togglePopupsBtn.addEventListener('click', () => {
        const nextState = !this.milestoneModal.isPopupsEnabled();
        this.milestoneModal.setPopupsEnabled(nextState);
        this.discoveryModal.setPopupsEnabled(nextState);
      });
    }

    this.initObservatoryElements();
    this.initAdvantageElements();
    this.bindProbeButtons();
    this.initMicroscopeDrawer();
    this.bindMicroscopeZoomControls();
    this.initMicroscopeTabsAndFont();
    this.bindSafariNetlistControls();
    GlossaryModal.getInstance();
    GlossaryModal.attachListeners();

    this.visualKeyModal = new VisualKeyModal(this.seafloorRenderer, this.controls);
    const openVisualKeyBtn = document.getElementById('btn-open-visual-key');
    if (openVisualKeyBtn) {
      openVisualKeyBtn.addEventListener('click', () => {
        this.visualKeyModal.toggle();
      });
    }
    const floatingVisualKeyBtn = document.getElementById('floating-btn-visual-key');
    if (floatingVisualKeyBtn) {
      floatingVisualKeyBtn.addEventListener('click', () => {
        this.visualKeyModal.toggle();
      });
    }

    this.circuitAutopsyModal = new CircuitAutopsyModal(this.world);
    this.histologicalInspectorModal = new HistologicalInspectorModal({
      onPinLineage: (cladeId, bodyId) => {
        if (bodyId) {
          this.chroniclePlaybackBar.pinBody(bodyId, cladeId);
        } else {
          this.chroniclePlaybackBar.pinClade(cladeId);
        }
      },
      onOpenCADAutopsy: (coord) => {
        this.circuitAutopsyModal.show(coord);
      },
      onOpenPhylogeny: (_cladeId) => {
        this.phylogenyModal.open(this.world.exportTelemetry());
      }
    });
    this.chronicleAnalysisLabModal = new ChronicleAnalysisLabModal({
      onPinLineage: (cladeId, bodyId) => {
        if (bodyId) {
          this.chroniclePlaybackBar.pinBody(bodyId, cladeId);
        } else {
          this.chroniclePlaybackBar.pinClade(cladeId);
        }
      },
      onOpenCADAutopsy: (coord) => {
        this.circuitAutopsyModal.show(coord);
      },
      onOpenPhylogeny: (_cladeId) => {
        this.phylogenyModal.open(this.world.exportTelemetry());
      },
      onToast: (msg) => {
        this.naturalistAssistant?.showToast(msg);
      }
    });

    this.chroniclePlaybackBar = new ChroniclePlaybackBar(this.world.getKinematicsRecorder(), {
      onFrameChange: (_idx) => {},
      onStainChange: (_stain) => {},
      onLensChange: (lens) => this.setLensMode(lens),
      onPinLineage: (_cladeId) => {},
      onOpenAutopsy: () => {},
      onOpenPhylogeny: () => {
        this.phylogenyModal.open(this.world.exportTelemetry());
      },
      onOpenTour: () => {
        this.chronicleTourGuide.startTour();
      },
      onOpenLab: () => {
        this.openChronicleLab();
      },
      onExportArchive: () => {
        ChronicleArchiveManager.exportToFile(
          this.world.getKinematicsRecorder(),
          this.chronicleTourGuide.getStops()
        );
        this.naturalistAssistant?.showToast('💾 Chronicle Archive exported (.silichronicle)!');
      },
      onImportArchive: async (file) => {
        try {
          const archive = await ChronicleArchiveManager.loadFromFile(
            file,
            this.world.getKinematicsRecorder(),
            (stops: readonly unknown[]) => this.chronicleTourGuide.loadStops(stops as readonly IChronicleTourStop[])
          );
          this.chroniclePlaybackBar.update();
          this.naturalistAssistant?.showToast(`📂 Loaded Archive: ${archive.frames.length} frames ready for replay!`);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          this.naturalistAssistant?.showToast(`❌ Error loading archive: ${msg}`);
        }
      }
    });

    this.chronicleTourGuide = new ChronicleTourGuide(
      this.world.getKinematicsRecorder(),
      this.camera,
      this.chroniclePlaybackBar,
      {
        onOpenLab: (body, cell) => {
          const tick = this.world.getKinematicsRecorder().getCurrentFrame()?.tick ?? 0;
          this.chronicleAnalysisLabModal.show(body, cell, tick);
        },
        onToast: (msg) => {
          this.naturalistAssistant?.showToast(msg);
        },
        onLensChange: (lens) => {
          this.setLensMode(lens);
        },
        onStainChange: (stain) => {
          this.world.getKinematicsRecorder().setStain(stain);
        }
      }
    );
    const expandCadBtn = document.getElementById('safari-btn-expand-cad');
    expandCadBtn?.addEventListener('click', () => {
      if (this.selectedPoreCoord) {
        this.circuitAutopsyModal.show(this.selectedPoreCoord);
      } else {
        this.circuitAutopsyModal.show();
      }
    });

    this.branchModal = new EvolutionaryBranchModal(
      this.world,
      (branch, snapshot) => {
        const tele = this.world.exportTelemetry();
        this.latestTelemetry = tele;
        this.hud.update(tele, null);
        this.seafloorRenderer.render(tele);
        const branchPreview = document.getElementById('hud-branch-preview');
        if (branchPreview) {
          branchPreview.textContent = `${branch.name} ▾`;
        }
        this.naturalistAssistant?.showToast(`🌿 Checked out "${branch.name}" @ Tick ${snapshot.tick}`);
      }
    );

    const hudBranchesBtn = document.getElementById('hud-branches-btn');
    if (hudBranchesBtn) {
      hudBranchesBtn.addEventListener('click', () => {
        this.branchModal.toggle();
      });
    }

    EvolutionaryVersionManager.getInstance().getActiveBranch().then(b => {
      const branchPreview = document.getElementById('hud-branch-preview');
      if (branchPreview) branchPreview.textContent = `${b.name} ▾`;
    });

    this.deepLabController = new DeepLabController(this.world, this.naturalistAssistant);
    this.arenaController = new AbyssalArenaController(this.world, AudioSynthesizer.getInstance());

    this.bindCanvasInteractions();
    this.bindResize();
    this.handleResize();
    this.setupLegendToggle();
    this.initWorkspaceModes();
    this.initServerModeToggle();
    this.initPortalModes();
    this.setWorkspaceMode('observatory');

    // Start simulation loop at 1x
    this.loop.start();
    this.startRenderLoop();
    this.handleQaUrlParams();
    this.renderSync();
    window.siliquariumApp = this;
  }

  private initPortalModes(): void {
    const btnDeeplab = document.getElementById('btn-portal-deeplab');
    const btnArena = document.getElementById('btn-portal-arena');

    btnDeeplab?.addEventListener('click', () => this.setPortalMode('deeplab'));
    btnArena?.addEventListener('click', () => this.setPortalMode('arena'));

    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'arena' || window.location.hash === '#arena') {
      this.setPortalMode('arena');
    } else {
      this.setPortalMode('deeplab');
    }
  }

  public setPortalMode(portal: 'deeplab' | 'arena'): void {
    this.activePortal = portal;
    const body = document.body;
    const btnDeeplab = document.getElementById('btn-portal-deeplab');
    const btnArena = document.getElementById('btn-portal-arena');

    if (portal === 'arena') {
      body.classList.remove('portal-deeplab');
      body.classList.add('portal-arena');
      btnDeeplab?.classList.remove('active');
      btnArena?.classList.add('active');

      this.deepLabController.hide();
      this.arenaController.show();
      if (this.latestTelemetry) {
        this.arenaController.update(this.latestTelemetry);
      }
      this.naturalistAssistant?.showToast('⚔️ Entered The Abyssal Arena. Battle for Caldera Supremacy!');
    } else {
      body.classList.remove('portal-arena');
      body.classList.add('portal-deeplab');
      btnArena?.classList.remove('active');
      btnDeeplab?.classList.add('active');

      this.arenaController.hide();
      this.deepLabController.show();
      this.naturalistAssistant?.showToast('🔬 Entered The Deep Lab. Academic Research Workbench active.');
    }
  }

  private initObservatoryElements(): void {
    this.obsSpecimenCard = document.getElementById('observatory-specimen-card');
    this.obsCardTitle = document.getElementById('obs-card-title');
    this.obsCardIcon = document.getElementById('obs-card-icon');
    this.obsValTaxon = document.getElementById('obs-val-taxon');
    this.obsValCoord = document.getElementById('obs-val-coord');
    this.obsValActivity = document.getElementById('obs-val-activity');
    this.obsVitalBattery = document.getElementById('obs-vital-battery');
    this.obsVitalMatter = document.getElementById('obs-vital-matter');
    this.obsVitalGen = document.getElementById('obs-vital-gen');
    this.obsVitalLandauer = document.getElementById('obs-vital-landauer');
    this.obsCircuitSummary = document.getElementById('obs-circuit-summary');
    this.obsBtnSafari = document.getElementById('obs-btn-safari');
    this.obsBtnMicroscope = document.getElementById('obs-btn-microscope');
    this.obsCardCloseBtn = document.getElementById('obs-card-close-btn');

    this.envPillTemp = document.getElementById('env-pill-temp');
    this.envPillRedox = document.getElementById('env-pill-redox');
    this.envPillCells = document.getElementById('env-pill-cells');

    // Camera Navigation Tool Buttons (Screen 1)
    // Note: Zoom and auto-spin are bound within InteractiveControls to prevent duplicate event invocation.
    document.getElementById('cam-btn-reset')?.addEventListener('click', () => {
      this.camera.smoothFlyTo(0, 0, 1.5, 16.0);
      this.naturalistAssistant.showToast('🎯 View Centered on Hydrothermal Chimney');
    });

    this.obsCardCloseBtn?.addEventListener('click', () => {
      this.deselect();
    });

    this.obsBtnSafari?.addEventListener('click', () => {
      const coord = this.selectedPoreCoord;
      this.setWorkspaceMode('safari');
      if (coord) {
        this.openMicroscope(coord);
      }
    });

    this.obsBtnMicroscope?.addEventListener('click', () => {
      const coord = this.selectedPoreCoord;
      this.setWorkspaceMode('laboratory');
      if (coord) {
        this.openMicroscope(coord);
      } else {
        this.openMicroscope();
      }
    });
  }

  private initServerModeToggle(): void {
    const btn = document.getElementById('hud-server-mode-btn');
    const label = document.getElementById('hud-server-mode-label');
    const dot = document.getElementById('hud-server-mode-dot');

    this.remoteClient.onTelemetry((tele) => {
      if (this.isServerMode) {
        this.remoteTelemetry = tele;
        this.latestTelemetry = tele;
      }
    });

    this.remoteClient.onStatus((status) => {
      if (this.isServerMode) {
        this.controls.syncRemoteStatus(status.isRunning, status.speedMultiplier);
      }
    });

    this.remoteClient.onConnectionChange((connected) => {
      if (this.isServerMode && label && dot) {
        if (connected) {
          label.textContent = 'Server (Live)';
          label.style.color = '#10b981';
          dot.textContent = '🌐';
        } else {
          label.textContent = 'Server (Offline)';
          label.style.color = '#ef4444';
          dot.textContent = '⚠️';
        }
      }
    });

    // Wire remote control dispatcher into controls
    this.controls.setRemoteDispatcher((action, payload) => {
      if (!this.isServerMode) return false;
      if (action === 'toggle') {
        const lastStatus = this.remoteClient.getLastStatus();
        if (lastStatus?.isRunning) {
          this.remoteClient.pause();
        } else {
          this.remoteClient.play();
        }
        return true;
      }
      if (action === 'step') {
        const p = payload as { count?: number } | undefined;
        this.remoteClient.step(p?.count ?? 1);
        return true;
      }
      if (action === 'setSpeed') {
        const p = payload as { speed?: number } | undefined;
        this.remoteClient.setSpeed(p?.speed ?? 1);
        return true;
      }
      return false;
    });

    btn?.addEventListener('click', () => {
      this.toggleServerMode();
    });
  }

  public toggleServerMode(): void {
    const label = document.getElementById('hud-server-mode-label');
    const dot = document.getElementById('hud-server-mode-dot');
    this.isServerMode = !this.isServerMode;

    if (this.isServerMode) {
      this.loop.pause();
      this.remoteClient.connect();
      if (label) {
        label.textContent = 'Server (Connecting)';
        label.style.color = '#f59e0b';
      }
      if (dot) dot.textContent = '🌐';
      this.naturalistAssistant?.showToast('🌐 Switched to Autonomous Headless Server Engine (SSE Stream)');
    } else {
      this.remoteClient.disconnect();
      this.remoteTelemetry = null;
      this.loop.start();
      if (label) {
        label.textContent = 'Local Mode';
        label.style.color = '#38bdf8';
      }
      if (dot) dot.textContent = '💻';
      this.controls.setPlaying(true);
      this.naturalistAssistant?.showToast('💻 Switched to In-Browser Local Engine');
    }
  }

  private showObservatorySpecimenCard(pore: IPoreTelemetry | null, tele: ISimulationTelemetry): void {
    if (!this.obsSpecimenCard) return;

    if (!pore) {
      this.hideObservatorySpecimenCard();
      return;
    }

    const coord = pore.coord;
    const isVent = coord.equals(tele.vent.nozzleCoord);

    if (isVent) {
      if (this.obsCardIcon) this.obsCardIcon.textContent = '🌋';
      if (this.obsCardTitle) this.obsCardTitle.textContent = 'Hydrothermal Vent Plume';
      if (this.obsValTaxon) this.obsValTaxon.textContent = 'Alkaline Chemiosmotic Fountain';
      if (this.obsValCoord) this.obsValCoord.textContent = `Nozzle [${coord.q}, ${coord.r}, ${coord.z}]`;
      if (this.obsValActivity) {
        this.obsValActivity.textContent = `${Math.round(tele.vent.thermalFlux || 350)}°C • Superheated Plume`;
        this.obsValActivity.style.color = '#f97316';
      }
      if (this.obsVitalBattery) this.obsVitalBattery.textContent = `${tele.vent.streamA ? '+380' : '+150'} mV`;
      if (this.obsVitalMatter) this.obsVitalMatter.textContent = '∞ Soup';
      if (this.obsVitalGen) this.obsVitalGen.textContent = 'N/A';
      if (this.obsVitalLandauer) this.obsVitalLandauer.textContent = '0 T';
      if (this.obsCircuitSummary) {
        this.obsCircuitSummary.textContent = 'Proton-motive fuel source pumping dual substrate streams into the benthic lattice.';
      }
      this.obsSpecimenCard.classList.remove('hidden');
      return;
    }

    const cell = this.world.getPore(coord)?.getResident();
    const isOccupied = pore.state === 'OCCUPIED' && (cell !== undefined || (pore.energy > 0 || (pore.gateCount ?? 0) > 0));
    const isSpore = pore.hasSpore;
    const isCarcass = pore.state === 'CARCASS';

    if (isOccupied) {
      AudioSynthesizer.getInstance().playCellSelect((pore.energy || 50) / 100);
      const taxonomy = pore.speciesTaxon ?? TaxonomyNomenclature.classify({
        tapeBitstring: cell?.getSafe().getTape() ?? pore.tapeBitstring ?? '',
        gateTypes: cell?.getWorkshop().getGateTypeNames() ?? pore.gateTypes ?? [],
        generation: cell?.getGeneration() ?? pore.generation ?? 0,
        isBasalt: pore.isBasalt,
        hasOrganelle: pore.hasOrganelle,
        isSyncytium: pore.isSyncytium
      });
      if (this.obsCardIcon) this.obsCardIcon.textContent = pore.hasOrganelle ? '🪐' : (pore.isSyncytium ? '🧬' : '🔬');
      if (this.obsCardTitle) this.obsCardTitle.textContent = taxonomy.binomialName;
      if (this.obsValTaxon) this.obsValTaxon.textContent = taxonomy.commonName;
      if (this.obsValCoord) this.obsValCoord.textContent = `Pore [${coord.q}, ${coord.r}, ${coord.z}]`;
      if (this.obsValActivity) {
        this.obsValActivity.textContent = pore.energy > 30 ? 'Active Respiration' : 'Low Metabolic Reserve';
        this.obsValActivity.style.color = pore.energy > 30 ? '#10b981' : '#f59e0b';
      }
      if (this.obsVitalBattery) this.obsVitalBattery.textContent = `${Math.round(pore.energy * 0.85)} mV`;
      if (this.obsVitalMatter) this.obsVitalMatter.textContent = `${pore.matter} M`;
      if (this.obsVitalGen) this.obsVitalGen.textContent = `Gen ${pore.generation}`;
      if (this.obsVitalLandauer) this.obsVitalLandauer.textContent = `${pore.toggleCount} T`;

      const gates = pore.gateTypes ?? [];
      const gNames = gates.length > 0 ? gates.join(' · ') : 'Porin Channel';
      if (this.obsCircuitSummary) {
        this.obsCircuitSummary.textContent = `${gates.length} Gate${gates.length === 1 ? '' : 's'}: ${gNames}`;
      }
    } else if (isSpore) {
      if (this.obsCardIcon) this.obsCardIcon.textContent = '🟡';
      if (this.obsCardTitle) this.obsCardTitle.textContent = 'Pelagic Spore (Suspended)';
      if (this.obsValTaxon) this.obsValTaxon.textContent = 'Dormant Dispersal Propagule';
      if (this.obsValCoord) this.obsValCoord.textContent = `Pore [${coord.q}, ${coord.r}, ${coord.z}]`;
      if (this.obsValActivity) {
        this.obsValActivity.textContent = 'Cryptobiotic Drift';
        this.obsValActivity.style.color = '#facc15';
      }
      if (this.obsVitalBattery) this.obsVitalBattery.textContent = '0 mV';
      if (this.obsVitalMatter) this.obsVitalMatter.textContent = '4 M';
      if (this.obsVitalGen) this.obsVitalGen.textContent = 'Spore';
      if (this.obsVitalLandauer) this.obsVitalLandauer.textContent = '0 T';
      if (this.obsCircuitSummary) {
        this.obsCircuitSummary.textContent = 'Dormant reproductive packet awaiting settlement on vacant benthic pore.';
      }
    } else if (isCarcass) {
      if (this.obsCardIcon) this.obsCardIcon.textContent = '🦴';
      if (this.obsCardTitle) this.obsCardTitle.textContent = 'Mineralized Carcass';
      if (this.obsValTaxon) this.obsValTaxon.textContent = 'Organic Detritus';
      if (this.obsValCoord) this.obsValCoord.textContent = `Pore [${coord.q}, ${coord.r}, ${coord.z}]`;
      if (this.obsValActivity) {
        this.obsValActivity.textContent = 'Degrading Detritus';
        this.obsValActivity.style.color = '#94a3b8';
      }
      if (this.obsVitalBattery) this.obsVitalBattery.textContent = '0 mV';
      if (this.obsVitalMatter) this.obsVitalMatter.textContent = `${pore.matter} M`;
      if (this.obsVitalGen) this.obsVitalGen.textContent = 'Lysed';
      if (this.obsVitalLandauer) this.obsVitalLandauer.textContent = '0 T';
      if (this.obsCircuitSummary) {
        this.obsCircuitSummary.textContent = 'Lysed cell remnants releasing recyclable organic carbon and nitrogen.';
      }
    } else {
      const isSub = coord.z < 0;
      if (this.obsCardIcon) this.obsCardIcon.textContent = isSub ? '🕳️' : (pore.isBasalt ? '🧱' : '⭕');
      if (this.obsCardTitle) {
        this.obsCardTitle.textContent = isSub
          ? `Subterranean Void [z=${coord.z}]`
          : (pore.isBasalt ? 'Basalt Bedrock' : 'Vacant Mineral Pore');
      }
      if (this.obsValTaxon) {
        this.obsValTaxon.textContent = isSub
          ? `Hadal Fissure Bedrock Stratum (z=${coord.z})`
          : 'Prebiotic Mineral Substrate';
      }
      if (this.obsValCoord) this.obsValCoord.textContent = `Pore [${coord.q}, ${coord.r}, ${coord.z}]`;
      if (this.obsValActivity) {
        this.obsValActivity.textContent = isSub ? 'Subterranean Basalt Crevasse' : 'Passive Substrate';
        this.obsValActivity.style.color = isSub ? '#38bdf8' : '#64748b';
      }
      if (this.obsVitalBattery) this.obsVitalBattery.textContent = '0 mV';
      if (this.obsVitalMatter) this.obsVitalMatter.textContent = `${pore.matter} M`;
      if (this.obsVitalGen) this.obsVitalGen.textContent = 'N/A';
      if (this.obsVitalLandauer) this.obsVitalLandauer.textContent = '0 T';
      if (this.obsCircuitSummary) {
        this.obsCircuitSummary.textContent = isSub
          ? `Excavated subterranean micro-cavity at stratum z=${coord.z}, sheltered below seafloor surface. Uncolonized abyss.`
          : 'Uncolonized hydrothermal micro-cavity bathed in aqueous primordial soup.';
      }
    }

    this.obsSpecimenCard.classList.remove('hidden');
    document.body.classList.add('has-selected-specimen');
  }

  private hideObservatorySpecimenCard(): void {
    this.obsSpecimenCard?.classList.add('hidden');
    document.body.classList.remove('has-selected-specimen');
  }

  private initAdvantageElements(): void {
    this.advantageCard = document.getElementById('microscope-advantage-card');
    this.analysisEmptyPlaceholder = document.getElementById('analysis-empty-placeholder');
    this.advBadge = document.getElementById('adv-badge');
    this.advTitle = document.getElementById('adv-title');
    this.advDesc = document.getElementById('adv-desc');
    this.scoreBarYield = document.getElementById('score-bar-yield');
    this.scoreValYield = document.getElementById('score-val-yield');
    this.scoreBarLandauer = document.getElementById('score-bar-landauer');
    this.scoreValLandauer = document.getElementById('score-val-landauer');
    this.scoreBarToxin = document.getElementById('score-bar-toxin');
    this.scoreValToxin = document.getElementById('score-val-toxin');
    this.probeBtnA = document.getElementById('probe-btn-a');
    this.probeBtnB = document.getElementById('probe-btn-b');
    this.probeBtnToxin = document.getElementById('probe-btn-toxin');
    this.probeResultText = document.getElementById('probe-result-text');
  }

  private bindProbeButtons(): void {
    const updateBtn = (btn: HTMLElement | null, active: boolean, label: string) => {
      if (!btn) return;
      btn.textContent = `${label}: ${active ? '1' : '0'}`;
      if (active) {
        btn.classList.add('probe-active');
      } else {
        btn.classList.remove('probe-active');
      }
    };

    if (this.probeBtnA) {
      this.probeBtnA.addEventListener('click', () => {
        this.probeA = !this.probeA;
        updateBtn(this.probeBtnA, this.probeA, 'Stream A');
        this.refreshProbeOnly();
      });
    }

    if (this.probeBtnB) {
      this.probeBtnB.addEventListener('click', () => {
        this.probeB = !this.probeB;
        updateBtn(this.probeBtnB, this.probeB, 'Stream B');
        this.refreshProbeOnly();
      });
    }

    if (this.probeBtnToxin) {
      this.probeBtnToxin.addEventListener('click', () => {
        this.probeToxin = !this.probeToxin;
        updateBtn(this.probeBtnToxin, this.probeToxin, 'Toxin T');
        this.refreshProbeOnly();
      });
    }
  }

  private refreshProbeOnly(): void {
    if (!this.selectedPoreCoord) return;
    const pore = this.world.getPore(this.selectedPoreCoord);
    const cell = pore?.getResident();
    if (cell) {
      this.updateProbeResult(cell.getWorkshop());
    }
  }

  private updateAdvantageCard(poreTele: IPoreTelemetry | null): void {
    if (!this.advantageCard) return;

    if (!poreTele || poreTele.state !== 'OCCUPIED' || poreTele.isAqueous || !poreTele.tapeBitstring) {
      this.lastAdvantageCoordKey = null;
      this.lastAdvantageTape = null;
      this.advantageCard.classList.add('hidden');
      if (this.analysisEmptyPlaceholder) {
        this.analysisEmptyPlaceholder.classList.remove('hidden');
      }
      return;
    }

    const currentKey = poreTele.coord.toKey();
    if (this.lastAdvantageCoordKey === currentKey && this.lastAdvantageTape === poreTele.tapeBitstring) {
      return;
    }

    this.lastAdvantageCoordKey = currentKey;
    this.lastAdvantageTape = poreTele.tapeBitstring;

    this.advantageCard.classList.remove('hidden');
    if (this.analysisEmptyPlaceholder) {
      this.analysisEmptyPlaceholder.classList.add('hidden');
    }

    try {
      const workshop = PoreWorkshop.fromBitstring(poreTele.tapeBitstring);
      const report = CircuitAdvantageAnalyzer.analyze(workshop);

      if (this.advBadge) this.advBadge.textContent = report.archetype.replace(/_/g, ' ');
      if (this.advTitle) this.advTitle.textContent = report.title;
      if (this.advDesc) this.advDesc.textContent = report.advantageSummary;

      if (this.scoreBarYield) this.scoreBarYield.style.width = `${report.catalyticYieldScore}%`;
      if (this.scoreValYield) this.scoreValYield.textContent = `${report.catalyticYieldScore}%`;

      if (this.scoreBarLandauer) this.scoreBarLandauer.style.width = `${report.landauerEfficiencyScore}%`;
      if (this.scoreValLandauer) this.scoreValLandauer.textContent = `${report.landauerEfficiencyScore}%`;

      if (this.scoreBarToxin) this.scoreBarToxin.style.width = `${report.toxinImmunityScore}%`;
      if (this.scoreValToxin) this.scoreValToxin.textContent = `${report.toxinImmunityScore}%`;

      const guideLink = document.getElementById('adv-guide-link') as HTMLAnchorElement | null;
      if (guideLink) {
        let specFile = 'CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.html';
        if (poreTele.isSyncytium) {
          specFile = 'paleontology/specimen_09_syncytial_multicellularity.html';
        } else if (poreTele.hasOrganelle) {
          specFile = 'paleontology/specimen_08_endosymbiotic_cassette.html';
        } else if (poreTele.hasSpore || poreTele.hasSporeAdaptation) {
          specFile = 'paleontology/specimen_10_pelagic_sporulation.html';
        } else if (report.archetype.includes('TOXIN') || report.archetype.includes('NOT')) {
          specFile = 'paleontology/specimen_07_allosteric_inverter.html';
        } else if (report.archetype.includes('ADDER') || report.archetype.includes('PARITY')) {
          specFile = 'paleontology/specimen_06_binary_half_adder.html';
        } else if (report.archetype.includes('LATCH') || report.archetype.includes('MEMORY')) {
          specFile = 'paleontology/specimen_01_bistable_latch.html';
        } else if (report.archetype.includes('CLOCK') || report.archetype.includes('OSCILLATOR')) {
          specFile = 'paleontology/specimen_02_repressilator.html';
        } else if (report.archetype.includes('FILTER') || report.archetype.includes('COHERENT')) {
          specFile = 'paleontology/specimen_03_coherent_ffl.html';
        } else if (report.archetype.includes('PULSE') || report.archetype.includes('INCOHERENT')) {
          specFile = 'paleontology/specimen_04_incoherent_ffl.html';
        } else if (report.archetype.includes('AUTOREG') || report.archetype.includes('CLAMP')) {
          specFile = 'paleontology/specimen_05_negative_autoregulation.html';
        } else if (report.archetype.includes('CHEMOTAXIS') || report.archetype.includes('PURCELL')) {
          specFile = 'paleontology/specimen_16_temporal_derivative_chemotaxis.html';
        } else if (report.archetype.includes('PAVLOV') || report.archetype.includes('PREDICTIVE')) {
          specFile = 'paleontology/specimen_17_predictive_pavlovian.html';
        } else if (report.archetype.includes('PACEMAKER') || report.archetype.includes('ENTRAINED')) {
          specFile = 'paleontology/specimen_18_entrained_pacemaker.html';
        } else if (report.archetype.includes('STEINER') || report.archetype.includes('VASCULAR')) {
          specFile = 'paleontology/specimen_19_steiner_vascular_network.html';
        } else if (report.archetype.includes('DORMANCY') || report.archetype.includes('PERSISTER')) {
          specFile = 'paleontology/specimen_20_cryptobiotic_dormancy_clamp.html';
        }
        guideLink.href = `docs/${specFile}`;
      }

      this.updateProbeResult(workshop);
    } catch {
      this.advantageCard.classList.add('hidden');
      if (this.analysisEmptyPlaceholder) {
        this.analysisEmptyPlaceholder.classList.remove('hidden');
      }
    }
  }

  private updateProbeResult(workshop: PoreWorkshop): void {
    if (!this.probeResultText) return;
    const virtualWorkshop = PoreWorkshop.fromBitstring(workshop.toBitstring());
    const res = virtualWorkshop.step(this.probeA, this.probeB, this.probeToxin);
    const outStr = res.primaryOutput ? 'Active (1)' : 'Inactive (0)';
    const color = res.primaryOutput ? '#10b981' : '#94a3b8';
    this.probeResultText.innerHTML = `Output: <strong style="color:${color}">${outStr}</strong> | Dissipated: <strong>${res.toggleCount}</strong> Landauer toggles`;
  }

  private bindMicroscopeZoomControls(): void {
    const zoomText = document.getElementById('microscope-zoom-text');
    const zoomInBtn = document.getElementById('btn-microscope-zoom-in');
    const zoomOutBtn = document.getElementById('btn-microscope-zoom-out');
    const presetBtns = document.querySelectorAll<HTMLButtonElement>('.zoom-preset-btn');
    const container = document.getElementById('microscope-container');

    const updateZoomDisplay = () => {
      const zoom = this.microscopeView.getZoomLevel();
      if (zoomText) zoomText.textContent = `${zoom.toFixed(1)}×`;
      presetBtns.forEach(btn => {
        const pz = parseFloat(btn.getAttribute('data-zoom') || '1.0');
        if (Math.abs(pz - zoom) < 0.05) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      // Force immediate re-render of microscope
      const tele = this.world.exportTelemetry();
      const pore = this.selectedPoreCoord ? tele.pores.find(p => p.coord.equals(this.selectedPoreCoord!)) ?? null : null;
      this.microscopeView.render(pore, tele.vent);
    };

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => {
        const cur = this.microscopeView.getZoomLevel();
        this.microscopeView.setZoomLevel(cur + 0.2);
        updateZoomDisplay();
      });
    }

    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => {
        const cur = this.microscopeView.getZoomLevel();
        this.microscopeView.setZoomLevel(cur - 0.2);
        updateZoomDisplay();
      });
    }

    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetZoom = parseFloat(btn.getAttribute('data-zoom') || '1.0');
        this.microscopeView.setZoomLevel(targetZoom);
        updateZoomDisplay();
      });
    });

    if (container) {
      container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.15 : -0.15;
        this.microscopeView.setZoomLevel(this.microscopeView.getZoomLevel() + delta);
        updateZoomDisplay();
      }, { passive: false });
    }

    const resetBtn = document.getElementById('btn-microscope-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.microscopeView.setZoomLevel(1.0);
        this.microscopeFontScale = 1.0;
        updateZoomDisplay();
        const fontText = document.getElementById('microscope-font-text');
        if (fontText) fontText.textContent = '1.0×';
        if (this.microscopePanel) {
          this.microscopePanel.style.setProperty('--micro-font-scale', '1.0');
        }
        this.microscopeView.setFontScale(1.0);
        document.querySelectorAll<HTMLButtonElement>('.font-preset-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-font') === '1.0');
        });
        const tele = this.world.exportTelemetry();
        const pore = this.selectedPoreCoord ? tele.pores.find(p => p.coord.equals(this.selectedPoreCoord!)) ?? null : null;
        this.microscopeView.render(pore, tele.vent);
        this.updateMicroscopeFooter(pore);
      });
    }
  }

  private initMicroscopeTabsAndFont(): void {
    this.tabBtnSchematic = document.getElementById('tab-btn-schematic');
    this.tabBtnAnalysis = document.getElementById('tab-btn-analysis');
    this.tabPaneSchematic = document.getElementById('tab-pane-schematic');
    this.tabPaneAnalysis = document.getElementById('tab-pane-analysis');

    if (this.tabBtnSchematic) {
      this.tabBtnSchematic.addEventListener('click', () => {
        this.switchMicroscopeTab('schematic');
      });
    }

    if (this.tabBtnAnalysis) {
      this.tabBtnAnalysis.addEventListener('click', () => {
        this.switchMicroscopeTab('analysis');
      });
    }

    const fontText = document.getElementById('microscope-font-text');
    const fontInBtn = document.getElementById('btn-microscope-font-in');
    const fontOutBtn = document.getElementById('btn-microscope-font-out');
    const fontPresetBtns = document.querySelectorAll<HTMLButtonElement>('.font-preset-btn');

    const updateFontDisplay = () => {
      if (fontText) fontText.textContent = `${this.microscopeFontScale.toFixed(2).replace(/\.?0+$/, '')}×`;
      if (this.microscopePanel) {
        this.microscopePanel.style.setProperty('--micro-font-scale', String(this.microscopeFontScale));
      }
      this.microscopeView.setFontScale(this.microscopeFontScale);
      fontPresetBtns.forEach(btn => {
        const pf = parseFloat(btn.getAttribute('data-font') || '1.0');
        if (Math.abs(pf - this.microscopeFontScale) < 0.05) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      // Force immediate re-render of microscope schematic canvas with new font scale
      const tele = this.world.exportTelemetry();
      const pore = this.selectedPoreCoord ? tele.pores.find(p => p.coord.equals(this.selectedPoreCoord!)) ?? null : null;
      this.microscopeView.render(pore, tele.vent);
      this.updateMicroscopeFooter(pore);
    };

    if (fontInBtn) {
      fontInBtn.addEventListener('click', () => {
        this.microscopeFontScale = Math.min(2.0, Math.round((this.microscopeFontScale + 0.15) * 100) / 100);
        updateFontDisplay();
      });
    }

    if (fontOutBtn) {
      fontOutBtn.addEventListener('click', () => {
        this.microscopeFontScale = Math.max(0.8, Math.round((this.microscopeFontScale - 0.15) * 100) / 100);
        updateFontDisplay();
      });
    }

    fontPresetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetFont = parseFloat(btn.getAttribute('data-font') || '1.0');
        this.microscopeFontScale = targetFont;
        updateFontDisplay();
      });
    });
  }

  private bindSafariNetlistControls(): void {
    if (!this.safariCircuitView) return;

    const zoomText = document.getElementById('safari-netlist-zoom-text');
    const zoomInBtn = document.getElementById('safari-netlist-zoom-in');
    const zoomOutBtn = document.getElementById('safari-netlist-zoom-out');
    const resetBtn = document.getElementById('safari-netlist-reset');
    const fontBtn = document.getElementById('safari-netlist-font-toggle');
    const container = document.getElementById('safari-netlist-canvas-container');

    let safariFontScale = 1.0;

    const updateSafariZoom = () => {
      if (!this.safariCircuitView) return;
      const zoom = this.safariCircuitView.getZoomLevel();
      if (zoomText) zoomText.textContent = `${zoom.toFixed(1)}×`;
      const tele = this.latestTelemetry ?? this.world.exportTelemetry();
      const pore = this.selectedPoreCoord ? tele.pores.find(p => p.coord.equals(this.selectedPoreCoord!)) ?? null : null;
      this.safariCircuitView.render(pore, tele.vent);
    };

    zoomInBtn?.addEventListener('click', () => {
      if (!this.safariCircuitView) return;
      this.safariCircuitView.setZoomLevel(this.safariCircuitView.getZoomLevel() + 0.2);
      updateSafariZoom();
    });

    zoomOutBtn?.addEventListener('click', () => {
      if (!this.safariCircuitView) return;
      this.safariCircuitView.setZoomLevel(this.safariCircuitView.getZoomLevel() - 0.2);
      updateSafariZoom();
    });

    resetBtn?.addEventListener('click', () => {
      if (!this.safariCircuitView) return;
      this.safariCircuitView.setZoomLevel(1.0);
      safariFontScale = 1.0;
      this.safariCircuitView.setFontScale(1.0);
      updateSafariZoom();
    });

    fontBtn?.addEventListener('click', () => {
      if (!this.safariCircuitView) return;
      safariFontScale = safariFontScale >= 1.4 ? 1.0 : (safariFontScale + 0.2);
      this.safariCircuitView.setFontScale(safariFontScale);
      updateSafariZoom();
    });

    if (container) {
      container.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (!this.safariCircuitView) return;
        const delta = e.deltaY < 0 ? 0.15 : -0.15;
        this.safariCircuitView.setZoomLevel(this.safariCircuitView.getZoomLevel() + delta);
        updateSafariZoom();
      }, { passive: false });
    }
  }

  public updateMicroscopeFooter(pore: IPoreTelemetry | null): void {
    const voltageFill = document.getElementById('microscope-voltage-fill');
    const voltageText = document.getElementById('microscope-voltage-text');
    const gatesBadge = document.getElementById('microscope-gates-badge');
    const organelleBadge = document.getElementById('microscope-organelle-badge');

    if (!pore) {
      if (voltageFill) voltageFill.style.width = '0%';
      if (voltageText) voltageText.textContent = '0 mV';
      if (gatesBadge) gatesBadge.textContent = 'No Resident Silicoid';
      if (organelleBadge) organelleBadge.style.display = 'none';
      return;
    }

    const maxE = 100;
    const pct = Math.min(100, Math.max(0, Math.round((pore.energy / maxE) * 100)));
    const mv = Math.round(pore.energy * 0.85);

    if (voltageFill) {
      voltageFill.style.width = `${pct}%`;
      voltageFill.style.background = pore.energy > 40 ? '#10b981' : (pore.energy > 15 ? '#f59e0b' : '#ef4444');
    }
    if (voltageText) {
      voltageText.textContent = `${mv} mV`;
      voltageText.style.color = pore.energy > 40 ? '#10b981' : (pore.energy > 15 ? '#f59e0b' : '#ef4444');
    }

    if (gatesBadge) {
      const gCount = pore.gateCount ?? pore.gateTypes?.length ?? 0;
      const gNames = pore.gateTypes?.length ? pore.gateTypes.join(' · ') : 'Porin';
      gatesBadge.textContent = `${gCount} Gate${gCount === 1 ? '' : 's'} (${gNames})`;
    }

    if (organelleBadge) {
      organelleBadge.style.display = pore.hasOrganelle ? 'inline' : 'none';
    }
  }

  public switchMicroscopeTab(tab: 'schematic' | 'analysis'): void {
    this.activeMicroscopeTab = tab;
    if (tab === 'schematic') {
      this.tabBtnSchematic?.classList.add('active');
      this.tabBtnAnalysis?.classList.remove('active');
      this.tabPaneSchematic?.classList.add('active');
      this.tabPaneAnalysis?.classList.remove('active');
      const tele = this.world.exportTelemetry();
      const pore = this.selectedPoreCoord ? tele.pores.find(p => p.coord.equals(this.selectedPoreCoord!)) ?? null : null;
      this.microscopeView.render(pore, tele.vent);
      this.updateMicroscopeFooter(pore);
    } else {
      this.tabBtnSchematic?.classList.remove('active');
      this.tabBtnAnalysis?.classList.add('active');
      this.tabPaneSchematic?.classList.remove('active');
      this.tabPaneAnalysis?.classList.add('active');
      const tele = this.world.exportTelemetry();
      const pore = this.selectedPoreCoord ? tele.pores.find(p => p.coord.equals(this.selectedPoreCoord!)) ?? null : null;
      this.updateAdvantageCard(pore);
    }
  }

  private updateDiscoveryCounters(): void {
    const milestones = this.world.getPaleontologist().getMilestones();
    const count = milestones.length;
    const unique = new Set(milestones.map(m => m.motif.type)).size;

    const hudCount = document.getElementById('hud-discoveries-count');
    if (hudCount) hudCount.textContent = `${unique} / 10`;

    const transportCount = document.getElementById('hud-transport-discovery-count');
    if (transportCount) transportCount.textContent = String(count);
  }

  private pulseDiscoveryBadge(): void {
    const btn = document.getElementById('btn-open-discoveries');
    if (btn) {
      btn.style.boxShadow = '0 0 16px #fbbf24';
      setTimeout(() => {
        btn.style.boxShadow = '';
      }, 1200);
    }
  }

  private handleQaUrlParams(): void {
    const params = new URLSearchParams(window.location.search);
    const qaStep = params.get('qa_step');
    if (!qaStep) return;

    if (qaStep === 'overview') {
      // Default initial state
    } else if (qaStep === 'zoomed_drift') {
      // Student tries to zoom into a peripheral silicoid without selecting it
      this.camera.distance = 11.0;
    } else if (qaStep === 'selected') {
      // Student clicks on an occupied pore
      const tele = this.world.exportTelemetry();
      const occ = tele.pores.find(p => p.state === 'OCCUPIED' && !p.isAqueous);
      if (occ) {
        this.selectedPoreCoord = occ.coord;
        this.seafloorRenderer.setSelectedCoord(occ.coord);
        const worldPos = this.seafloorRenderer.axialToWorld(occ.coord);
        this.camera.setTarget(worldPos.x, worldPos.y, worldPos.z);
        this.camera.distance = 16.0;
        this.showObservatorySpecimenCard(occ, tele);
      }
    } else if (qaStep === 'autopsy') {
      const tele = this.world.exportTelemetry();
      const occ = tele.pores.find(p => p.state === 'OCCUPIED' && !p.isAqueous) ?? tele.pores.find(p => p.state === 'OCCUPIED');
      if (occ) {
        this.selectedPoreCoord = occ.coord;
        this.seafloorRenderer.setSelectedCoord(occ.coord);
        this.showObservatorySpecimenCard(occ, tele);
        this.circuitAutopsyModal.show(occ.coord);
      }
    } else if (qaStep === 'selected_subterranean') {
      // User clicks on a subterranean empty pore/fissure
      const tele = this.world.exportTelemetry();
      const sub = tele.pores.find(p => p.coord.z < 0 && !p.isBasalt) ?? tele.pores.find(p => p.coord.z < 0);
      if (sub) {
        this.selectedPoreCoord = sub.coord;
        this.seafloorRenderer.setSelectedCoord(sub.coord);
        const worldPos = this.seafloorRenderer.axialToWorld(sub.coord);
        this.camera.setTarget(worldPos.x, worldPos.y, worldPos.z);
        this.camera.distance = 16.0;
        this.showObservatorySpecimenCard(sub, tele);
      }
    } else if (qaStep === 'deep_zoom') {
      // Student zooms in close to inspect in-situ logic gates on seafloor
      const tele = this.world.exportTelemetry();
      const occ = tele.pores.find(p => p.state === 'OCCUPIED' && !p.isAqueous);
      if (occ) {
        this.selectedPoreCoord = occ.coord;
        this.seafloorRenderer.setSelectedCoord(occ.coord);
        const worldPos = this.seafloorRenderer.axialToWorld(occ.coord);
        this.camera.setTarget(worldPos.x, worldPos.y, worldPos.z);
        this.camera.distance = 7.5;
        this.camera.elevation = 0.85;
      }
    } else if (qaStep === 'lab') {
      // In-Vitro Silicoid Laboratory
      this.setWorkspaceMode('laboratory');
    } else if (qaStep === 'lab_kinetics' || qaStep === 'lab_biophysics') {
      this.setWorkspaceMode('laboratory');
      const tabBtn = document.querySelector<HTMLButtonElement>('.lab-tab-btn[data-tab="biophysics"]');
      tabBtn?.click();
    } else if (qaStep === 'lab_biobank' || qaStep === 'lab_inoculator') {
      this.setWorkspaceMode('laboratory');
      const tabBtn = document.querySelector<HTMLButtonElement>('.lab-tab-btn[data-tab="biobank"]');
      tabBtn?.click();
    } else if (qaStep === 'lab_ledger' || qaStep === 'lab_telemetry') {
      this.setWorkspaceMode('laboratory');
      const tabBtn = document.querySelector<HTMLButtonElement>('.lab-tab-btn[data-tab="telemetry"]');
      tabBtn?.click();
    } else if (qaStep === 'shaker') {
      this.setWorkspaceMode('observatory');
      const shakerBtn = document.getElementById('btn-observatory-shaker');
      shakerBtn?.click();
    } else if (qaStep === 'surge') {
      // Student triggers a thermal surge and advances simulation
      this.world.triggerThermalSurge();
      this.loop.step(15);
    } else if (qaStep === 'spores_off') {
      this.seafloorRenderer.showSpores = false;
      this.controls.syncLayerUI();
    } else if (qaStep === 'safari') {
      this.setWorkspaceMode('safari');
    } else if (qaStep === 'safari_next') {
      this.setWorkspaceMode('safari');
      const nextBtn = document.getElementById('safari-bar-next');
      nextBtn?.click();
    } else if (qaStep === 'studio') {
      this.setWorkspaceMode('studio');
    } else if (qaStep === 'chronicle') {
      this.setWorkspaceMode('chronicle');
    } else if (qaStep === 'chronicle_tour') {
      this.setWorkspaceMode('chronicle');
      const tourBtn = document.getElementById('chronicle-btn-tour-toggle');
      tourBtn?.click();
    } else if (qaStep === 'fullscreen') {
      document.body.classList.add('fullscreen-mode');
    } else if (qaStep === 'sterile_modal') {
      this.setWorkspaceMode('studio');
      const modal = document.getElementById('modal-sterile-launch');
      modal?.classList.remove('hidden');
    } else if (qaStep === 'branch_modal') {
      this.branchModal.open();
    } else if (qaStep === 'branch_fork_wizard') {
      this.branchModal.open('fork');
    } else if (qaStep.startsWith('lens_')) {
      if (this.world.getAllPores().filter(p => p.getState() === PoreState.OCCUPIED).length === 0) {
        this.world.seedPrimordialSoup(0.35);
      }
      this.loop.step(15);
      if (qaStep === 'lens_lattice') {
        this.setLensMode('lattice');
      } else if (qaStep === 'lens_plasmodium') {
        this.setLensMode('plasmodium');
      } else if (qaStep === 'lens_vascular') {
        this.setLensMode('vascular');
      } else if (qaStep === 'lens_potential') {
        this.setLensMode('potential');
      } else if (qaStep === 'lens_hybrid') {
        this.setLensMode('hybrid');
      }
      const occ = this.world.getAllPores().find(p => p.getState() === PoreState.OCCUPIED);
      if (occ) {
        this.selectedPoreCoord = occ.coord;
        this.seafloorRenderer.setSelectedCoord(occ.coord);
        const worldPos = this.seafloorRenderer.axialToWorld(occ.coord);
        this.camera.setTarget(worldPos.x, worldPos.y, worldPos.z);
        this.camera.distance = 12.0;
        this.camera.elevation = 0.85;
      }
      const tele = this.world.exportTelemetry();
      this.hud.update(tele, null);
      if (this.envPillCells) {
        this.envPillCells.innerHTML = `🧬 <strong>Biomass:</strong> ${tele.livingCount} Cells`;
      }
    }
  }

  public getFlyout(): LabFlyout {
    return this.flyout;
  }

  public getControls(): InteractiveControls {
    return this.controls;
  }

  public getMilestoneModal(): MilestoneModal {
    return this.milestoneModal;
  }

  private resetSimulation(): void {
    this.loop.pause();
    window.location.reload();
  }

  private bindResize(): void {
    window.addEventListener('resize', () => this.handleResize());
  }

  public handleResize(): void {
    const seafloorBox = this.seafloorCanvas.parentElement;
    const boxW = seafloorBox?.clientWidth || 0;
    const boxH = seafloorBox?.clientHeight || 0;
    const fallbackW = typeof window !== 'undefined' && window.innerWidth ? window.innerWidth : 1920;
    const fallbackH = typeof window !== 'undefined' && window.innerHeight ? Math.max(400, window.innerHeight - 60) : 1020;

    this.seafloorCanvas.width = boxW > 0 ? boxW : fallbackW;
    this.seafloorCanvas.height = boxH > 0 ? boxH : fallbackH;

    const microBox = this.microscopeCanvas.parentElement;
    if (microBox) {
      this.microscopeCanvas.width = microBox.clientWidth || 460;
      this.microscopeCanvas.height = 420;
    }

    if (this.safariNetlistCanvas) {
      if (this.safariCircuitView && this.selectedPoreCoord) {
        const tele = this.latestTelemetry ?? this.world.exportTelemetry();
        const pore = tele.pores.find(p => p.coord.equals(this.selectedPoreCoord!)) ?? null;
        this.safariCircuitView.render(pore, tele.vent);
      }
    }
  }

  public renderSync(): void {
    this.handleResize();
    const tele = (this.isServerMode && this.remoteTelemetry) ? this.remoteTelemetry : this.world.exportTelemetry();
    this.latestTelemetry = tele;
    this.seafloorRenderer.render(tele);

    let selectedPoreTele: IPoreTelemetry | null = null;
    if (this.selectedPoreCoord) {
      selectedPoreTele = tele.pores.find(p => p.coord.equals(this.selectedPoreCoord!)) ?? null;
    }
    this.hud.update(tele, selectedPoreTele);
    this.updateAdvantageCard(selectedPoreTele);

    if (this.envPillTemp && this.envPillRedox && this.envPillCells) {
      this.envPillTemp.innerHTML = `🌋 <strong>Plume:</strong> ${Math.round(tele.vent.thermalFlux || 350)}°C Steady`;
      this.envPillRedox.innerHTML = `⚡ <strong>Redox:</strong> ${tele.vent.streamA ? '+380' : '+150'} mV`;
      this.envPillCells.innerHTML = `🧬 <strong>Biomass:</strong> ${tele.livingCount} Cells`;
    }
    if (this.activeWorkspaceMode === 'observatory' && this.selectedPoreCoord && this.obsSpecimenCard && !this.obsSpecimenCard.classList.contains('hidden')) {
      this.showObservatorySpecimenCard(selectedPoreTele, tele);
    }
  }

  private initMicroscopeDrawer(): void {
    this.microscopePanel = document.getElementById('microscope-panel');
    this.microscopeCloseBtn = document.getElementById('microscope-close-btn');
    this.microscopeToggleBtn = document.getElementById('btn-toggle-microscope');

    this.microscopeCloseBtn?.addEventListener('click', () => {
      this.closeMicroscope();
    });

    this.microscopeToggleBtn?.addEventListener('click', () => {
      this.toggleMicroscope();
    });

    const freezeBtn = document.getElementById('btn-microscope-freeze-biobank');
    freezeBtn?.addEventListener('click', () => {
      if (!this.selectedPoreCoord) {
        this.naturalistAssistant?.showToast('⚠️ No pore selected to freeze.');
        return;
      }
      const pore = this.world.getPore(this.selectedPoreCoord);
      const cell = pore?.getResident();
      if (!cell) {
        this.naturalistAssistant?.showToast('⚠️ Selected pore does not contain a living cell.');
        return;
      }
      const bioBank = BioBank.getInstance();
      const gates = cell.getWorkshop().getGates();
      const gateTypes = cell.getWorkshop().getGateTypeNames();
      const safe = cell.getSafe();
      const plan = cell.getMorphogeneticPlan();
      const colony = this.world.getColonyAt(this.selectedPoreCoord);

      const record = bioBank.saveSilicoid({
        tapeBitstring: safe.getTape(),
        gateCount: gates.length,
        gateTypes: gateTypes,
        generation: cell.getGeneration(),
        savedAtEpoch: this.world.getTickCount(),
        isDifferentiated: colony?.isDifferentiated ?? false,
        bodyTopology: colony ? colony.bodyTopology : plan.preferredTopology,
        notes: `Frozen from Pore [${this.selectedPoreCoord.q}, ${this.selectedPoreCoord.r}, ${this.selectedPoreCoord.z}] at Epoch ${this.world.getTickCount()}.`
      });

      this.naturalistAssistant?.showToast(`🧊 Frozen to Bio-Bank: "${record.name}"!`);
      this.flyout.updateBioBankUI();
    });

    window.addEventListener('keydown', (e) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (e.key === 'm' || e.key === 'M') {
        this.toggleMicroscope();
      } else if (e.key === 'Escape') {
        if (this.controls.isCurrentlyFullscreen()) {
          this.controls.exitFullscreen();
          return;
        }
        if (this.microscopePanel?.classList.contains('open')) {
          this.closeMicroscope();
        }
        this.deselect();
      } else if (this.microscopePanel?.classList.contains('open')) {
        if (e.key === '1') {
          this.switchMicroscopeTab('schematic');
        } else if (e.key === '2') {
          this.switchMicroscopeTab('analysis');
        } else if (e.key === 'Tab') {
          e.preventDefault();
          this.switchMicroscopeTab(this.activeMicroscopeTab === 'schematic' ? 'analysis' : 'schematic');
        }
      }
    });
  }

  public openMicroscope(targetCoord?: HexCoord3D): void {
    if (this.activeWorkspaceMode === 'safari') {
      if (targetCoord) {
        this.selectedPoreCoord = targetCoord;
        this.seafloorRenderer.setSelectedCoord(targetCoord);
        const worldPos = this.seafloorRenderer.axialToWorld(targetCoord);
        this.camera.smoothFlyTo(worldPos, { distance: 7.5, elevation: 0.85 });
        if (this.safariCircuitView) {
          const tele = this.latestTelemetry ?? this.world.exportTelemetry();
          const pore = tele.pores.find(p => p.coord.equals(targetCoord)) ?? null;
          this.safariCircuitView.render(pore, tele.vent);
          if (pore) {
            this.naturalistAssistant.syncSafariCoPilotVitals(pore);
          }
        }
      }
      return;
    }
    if (targetCoord) {
      this.selectedPoreCoord = targetCoord;
      this.seafloorRenderer.setSelectedCoord(targetCoord);
    }
    if (this.microscopePanel) {
      const wasClosed = !this.microscopePanel.classList.contains('open');
      if (wasClosed) {
        this.microscopePanel.classList.add('open');
        this.microscopeToggleBtn?.classList.add('btn-active');
        this.handleResize();
      }
      const tele = this.latestTelemetry ?? this.world.exportTelemetry();
      let selPore: IPoreTelemetry | null = null;
      if (this.selectedPoreCoord) {
        selPore = tele.pores.find(p => p.coord.equals(this.selectedPoreCoord!)) ?? null;
      }
      this.microscopeView.render(selPore, tele.vent);
      this.updateMicroscopeFooter(selPore);
    }
  }

  public closeMicroscope(): void {
    if (this.microscopePanel && this.microscopePanel.classList.contains('open')) {
      this.microscopePanel.classList.remove('open');
      this.microscopeToggleBtn?.classList.remove('btn-active');
    }
  }

  public toggleMicroscope(): void {
    if (this.microscopePanel?.classList.contains('open')) {
      this.closeMicroscope();
    } else {
      this.openMicroscope();
    }
  }

  public deselect(): void {
    if (this.activeWorkspaceMode === 'safari') {
      const safariSpec = this.naturalistAssistant.getCurrentSafariSpecimen();
      if (safariSpec) {
        this.selectedPoreCoord = safariSpec.coord;
        this.seafloorRenderer.setSelectedCoord(safariSpec.coord);
        this.seafloorRenderer.safariTargetCoord = safariSpec.coord;
        return;
      }
    }
    this.selectedPoreCoord = null;
    this.seafloorRenderer.setSelectedCoord(null);
    this.seafloorRenderer.safariTargetCoord = null;
    this.hideObservatorySpecimenCard();
    if (this.activeWorkspaceMode !== 'safari') {
      this.closeMicroscope();
    }
  }

  private initWorkspaceModes(): void {
    const obsBtn = document.getElementById('btn-mode-observatory');
    const safariBtn = document.getElementById('btn-mode-safari');
    const labBtn = document.getElementById('btn-mode-laboratory');
    const studioBtn = document.getElementById('btn-mode-studio');
    const chronicleBtn = document.getElementById('btn-mode-chronicle');

    obsBtn?.addEventListener('click', () => this.setWorkspaceMode('observatory'));
    safariBtn?.addEventListener('click', () => this.setWorkspaceMode('safari'));
    labBtn?.addEventListener('click', () => this.setWorkspaceMode('laboratory'));
    studioBtn?.addEventListener('click', () => this.setWorkspaceMode('studio'));
    chronicleBtn?.addEventListener('click', () => this.setWorkspaceMode('chronicle'));

    window.addEventListener('keydown', (e) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.key === 'F1') {
        e.preventDefault();
        this.setWorkspaceMode('observatory');
      } else if (e.key === 'F2') {
        e.preventDefault();
        this.setWorkspaceMode('safari');
      } else if (e.key === 'F3') {
        e.preventDefault();
        this.setWorkspaceMode('laboratory');
      } else if (e.key === 'F4') {
        e.preventDefault();
        this.setWorkspaceMode('studio');
      } else if (e.key === 'F5' || ((e.key === 'c' || e.key === 'C') && !e.ctrlKey && !e.altKey && !e.metaKey)) {
        e.preventDefault();
        if (this.activeWorkspaceMode === 'chronicle') {
          this.setWorkspaceMode('observatory');
        } else {
          this.setWorkspaceMode('chronicle');
        }
      } else if ((e.key === 'd' || e.key === 'D') && !e.ctrlKey && !e.altKey && !e.metaKey) {
        if (this.activeWorkspaceMode === 'studio') {
          this.setWorkspaceMode('observatory');
        } else {
          this.setWorkspaceMode('studio');
        }
      } else if ((e.key === 'v' || e.key === 'V') && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        const order: LensViewMode[] = ['lattice', 'plasmodium', 'vascular', 'potential', 'hybrid'];
        const cur = this.seafloorRenderer.activeLensMode;
        const next = order[(order.indexOf(cur) + 1) % order.length];
        this.setLensMode(next);
      } else if ((e.key === 'p' || e.key === 'P') && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        const next = this.seafloorRenderer.activeLensMode === 'plasmodium' ? 'lattice' : 'plasmodium';
        this.setLensMode(next);
      } else if (this.activeWorkspaceMode === 'observatory' && !e.ctrlKey && !e.altKey && !e.metaKey && e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        const lensMap: Record<string, LensViewMode> = {
          '1': 'lattice',
          '2': 'plasmodium',
          '3': 'vascular',
          '4': 'potential',
          '5': 'hybrid'
        };
        if (lensMap[e.key]) {
          this.setLensMode(lensMap[e.key]);
        }
      } else if (this.activeWorkspaceMode === 'chronicle') {
        if (e.code === 'Space') {
          e.preventDefault();
          const rec = this.world.getKinematicsRecorder();
          if (rec.isPlaying) rec.pause();
          else rec.play();
        } else if ((e.key === 'g' || e.key === 'G') && !e.ctrlKey && !e.altKey && !e.metaKey) {
          e.preventDefault();
          if (this.chronicleTourGuide.isOpen()) {
            this.chronicleTourGuide.closeTour();
          } else {
            this.chronicleTourGuide.startTour();
          }
        } else if ((e.key === 'o' || e.key === 'O' || e.key === 'Tab') && !e.ctrlKey && !e.altKey && !e.metaKey) {
          e.preventDefault();
          this.chroniclePlaybackBar.toggleDrawer();
        } else if ((e.key === 'z' || e.key === 'Z' || e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.altKey && !e.metaKey) {
          e.preventDefault();
          this.chroniclePlaybackBar.toggleZenMode();
        } else if ((e.key === 'x' || e.key === 'X') && !e.ctrlKey && !e.altKey && !e.metaKey) {
          e.preventDefault();
          this.openChronicleLab();
        } else if (e.key === 'ArrowRight' && !e.shiftKey) {
          e.preventDefault();
          this.world.getKinematicsRecorder().step(1);
          this.chroniclePlaybackBar.update();
        } else if (e.key === 'ArrowLeft' && !e.shiftKey) {
          e.preventDefault();
          this.world.getKinematicsRecorder().step(-1);
          this.chroniclePlaybackBar.update();
        }
      }

      // Studio CAD Brush & Undo/Redo Hotkeys
      if (this.activeWorkspaceMode === 'studio') {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
          e.preventDefault();
          if (e.shiftKey) {
            this.performStudioRedo();
          } else {
            this.performStudioUndo();
          }
          return;
        } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
          e.preventDefault();
          this.performStudioRedo();
          return;
        }

        if (e.key === '1') this.flyout.setBrushMode('select');
        else if (e.key === '2') this.flyout.setBrushMode('basalt');
        else if (e.key === '3') this.flyout.setBrushMode('excavate');
        else if (e.key === '4') this.flyout.setBrushMode('trench');
        else if (e.key === '5') this.flyout.setBrushMode('vent');
        else if (e.key === '6') this.flyout.setBrushMode('inoculate');
        else if (e.key === '7') this.flyout.setBrushMode('clear');
        else if (e.key === '[') {
          const cur = this.seafloorRenderer.studioBrushRadius;
          const next = Math.max(1, cur - 1);
          this.flyout.setBrushRadius(next);
        } else if (e.key === ']') {
          const cur = this.seafloorRenderer.studioBrushRadius;
          const next = Math.min(3, cur + 1);
          this.flyout.setBrushRadius(next);
        }
      }

      // Safari Mode Tissue Role Hotkeys (1..5, Tab, 0)
      if (this.activeWorkspaceMode === 'safari') {
        if (e.key >= '1' && e.key <= '5') {
          e.preventDefault();
          const roleIndex = parseInt(e.key, 10) - 1;
          this.naturalistAssistant.selectRoleHighlightByIndex(roleIndex);
        } else if (e.key === 'Tab') {
          e.preventDefault();
          this.naturalistAssistant.cycleRoleHighlight(e.shiftKey ? -1 : 1);
        } else if (e.key === '0' || e.key === '`') {
          e.preventDefault();
          this.naturalistAssistant.selectRoleHighlight(null);
        }
      }
    });
  }

  private openChronicleLab(): void {
    const recorder = this.world.getKinematicsRecorder();
    const currentFrame = recorder.getCurrentFrame();
    if (!currentFrame || currentFrame.bodies.length === 0) {
      this.naturalistAssistant?.showToast('ℹ️ No silicoid bodies recorded in this frame.');
      return;
    }

    let targetBody = currentFrame.bodies.find(b => b.bodyId === recorder.pinnedBodyId) ||
                     currentFrame.bodies.find(b => b.cladeId === recorder.pinnedLineageId) ||
                     currentFrame.bodies[0];

    this.chronicleAnalysisLabModal.show(targetBody, targetBody.cells[0], currentFrame.tick);
  }

  public setLensMode(mode: LensViewMode): void {
    this.seafloorRenderer.setLensMode(mode);
    this.hud.updateActiveLens(mode);
    this.chroniclePlaybackBar.setLens(mode);
    const rec = this.world.getKinematicsRecorder();
    if (rec) {
      rec.setLensMode(mode);
    }
    const labels: Record<LensViewMode, string> = {
      lattice: '⬡ Lattice (Discrete Pores)',
      plasmodium: '🦠 Plasmodium (Physarum Slime Mold)',
      vascular: '🧬 Vascular Ribbon (Cytoplasmic Conduits)',
      potential: '🌌 Metabolic Potential (Scalar Field)',
      hybrid: '✨ Hybrid (Metaball + Reticulum)'
    };
    this.naturalistAssistant?.showToast(`🔍 Visual Lens: ${labels[mode] || mode.toUpperCase()}`);
  }

  public setWorkspaceMode(mode: 'observatory' | 'safari' | 'laboratory' | 'studio' | 'chronicle'): void {
    this.activeWorkspaceMode = mode;
    document.body.classList.remove('mode-observatory', 'mode-safari', 'mode-laboratory', 'mode-studio', 'mode-chronicle');
    document.body.classList.add('mode-' + mode);

    const obsBtn = document.getElementById('btn-mode-observatory');
    const safariBtn = document.getElementById('btn-mode-safari');
    const labBtn = document.getElementById('btn-mode-laboratory');
    const studioBtn = document.getElementById('btn-mode-studio');
    const chronicleBtn = document.getElementById('btn-mode-chronicle');

    obsBtn?.classList.toggle('active', mode === 'observatory');
    safariBtn?.classList.toggle('active', mode === 'safari');
    labBtn?.classList.toggle('active', mode === 'laboratory');
    studioBtn?.classList.toggle('active', mode === 'studio');
    chronicleBtn?.classList.toggle('active', mode === 'chronicle');

    if (mode === 'chronicle') {
      this.wasPlayingBeforeChronicle = this.loop.isRunning();
      if (this.loop.isRunning()) {
        this.loop.pause();
        this.controls.setPlaying(false);
      }

      this.seafloorRenderer.isStudioMode = false;
      this.seafloorRenderer.isChronicleMode = true;
      this.seafloorRenderer.kinematicsRecorder = this.world.getKinematicsRecorder();
      this.seafloorRenderer.chromaIsolationEnabled = false;
      this.seafloorRenderer.safariTargetCoord = null;
      this.seafloorRenderer.highlightedRoleName = null;

      this.circuitAutopsyModal.hide();
      this.hideObservatorySpecimenCard();
      this.naturalistAssistant.close();
      this.closeMicroscope();
      this.milestoneModal.hide();
      this.geoEventModal.hide();
      this.discoveryModal.hide();
      this.flyout.close();
      this.flyout.closeStudio();

      const shakerPanel = document.getElementById('observatory-shaker-panel');
      shakerPanel?.classList.add('hidden');

      this.chroniclePlaybackBar.show();
      this.handleResize();
      this.naturalistAssistant.showToast('⏳ Chronicle Mode: Historical macro-movement, treadmilling & histological staining');
    } else {
      this.seafloorRenderer.isChronicleMode = false;
      this.chroniclePlaybackBar.hide();
      this.histologicalInspectorModal.hide();
      this.chronicleAnalysisLabModal.hide();
      this.chronicleTourGuide.closeTour();

      if (this.wasPlayingBeforeChronicle && mode === 'observatory') {
        this.loop.start();
        this.controls.setPlaying(true);
        this.wasPlayingBeforeChronicle = false;
      }

      if (mode === 'studio') {
        // 1. Automatically pause simulation execution
        this.wasPlayingBeforeStudio = this.loop.isRunning();
        if (this.loop.isRunning()) {
          this.loop.pause();
          this.controls.setPlaying(false);
        }
        this.studioSnapshot = this.world.createWorldSnapshot();
        this.studioUndoStack = [];
        this.studioRedoStack = [];
        this.updateStudioUndoRedoUI();

        this.seafloorRenderer.isStudioMode = true;
        this.seafloorRenderer.chromaIsolationEnabled = false;
        this.seafloorRenderer.safariTargetCoord = null;
        this.seafloorRenderer.highlightedRoleName = null;
        this.seafloorRenderer.activeBrushMode = this.flyout.getActiveBrushMode();
        this.circuitAutopsyModal.hide();
        this.hideObservatorySpecimenCard();
        this.naturalistAssistant.close();
        this.closeMicroscope();
        this.milestoneModal.hide();
        this.geoEventModal.hide();
        this.discoveryModal.hide();

        this.flyout.openStudio();
        this.handleResize();
        this.naturalistAssistant.showToast('🏗️ Design Studio: Simulation paused. Sculpt terrain, load presets, or configure lattice.');
      } else {
        this.seafloorRenderer.isStudioMode = false;
        this.flyout.closeStudio();

      if (mode === 'observatory') {
        this.seafloorRenderer.chromaIsolationEnabled = false;
        this.seafloorRenderer.safariTargetCoord = null;
        this.seafloorRenderer.highlightedRoleName = null;
        this.circuitAutopsyModal.hide();
        this.naturalistAssistant.close();
        this.closeMicroscope();
        this.flyout.close();
        const shakerPanel = document.getElementById('observatory-shaker-panel');
        shakerPanel?.classList.add('hidden');
        this.milestoneModal.hide();
        this.geoEventModal.hide();
        this.discoveryModal.hide();
        this.seafloorRenderer.calmMotionEnabled = true;
        this.controls.syncCalmMotionUI();

        // Preserve specimen card and selection in Observatory mode
        if (this.selectedPoreCoord) {
          this.seafloorRenderer.setSelectedCoord(this.selectedPoreCoord);
          const tele = this.world.exportTelemetry();
          const poreTele = tele.pores.find(p => p.coord.equals(this.selectedPoreCoord!)) ?? null;
          if (poreTele && poreTele.state === PoreState.OCCUPIED) {
            this.showObservatorySpecimenCard(poreTele, tele);
          } else {
            this.hideObservatorySpecimenCard();
          }
        } else {
          this.hideObservatorySpecimenCard();
        }

        this.handleResize();
        this.naturalistAssistant.showToast('🌊 Observatory Mode: Uncluttered ambient deep-sea exploration');
      } else if (mode === 'safari') {
        this.loop.pause();
        this.controls.setPlaying(false);
        this.naturalistAssistant.syncSimulationRunningUI(false);
        this.seafloorRenderer.chromaIsolationEnabled = true;
        this.seafloorRenderer.highlightedRoleName = null;
        this.seafloorRenderer.muteNonSpecificRoles = this.naturalistAssistant.isMuteNonSpecificRoles();
        this.hideObservatorySpecimenCard();
        this.closeMicroscope();
        this.flyout.close();
        const shakerPanel = document.getElementById('observatory-shaker-panel');
        shakerPanel?.classList.add('hidden');
        this.handleResize();

        // Start Safari Co-Pilot preserving current selected pore & camera position
        this.naturalistAssistant.startSafariCoPilot(this.selectedPoreCoord, true);
        if (this.selectedPoreCoord) {
          this.seafloorRenderer.setSelectedCoord(this.selectedPoreCoord);
          this.seafloorRenderer.safariTargetCoord = this.selectedPoreCoord;
        }
        this.naturalistAssistant.showToast('🌿 Safari Mode: Ticking paused & canvas isolated on specimen');
      } else if (mode === 'laboratory') {
        this.seafloorRenderer.chromaIsolationEnabled = false;
        this.seafloorRenderer.safariTargetCoord = null;
        this.seafloorRenderer.highlightedRoleName = null;
        this.circuitAutopsyModal.hide();
        this.hideObservatorySpecimenCard();
        this.naturalistAssistant.close();

        // Close Observatory Shaker if open
        const shakerPanel = document.getElementById('observatory-shaker-panel');
        shakerPanel?.classList.add('hidden');

        // Auto-select active specimen if none is selected or selected pore is empty
        const tele = this.latestTelemetry ?? this.world.exportTelemetry();
        let activePoreTele: IPoreTelemetry | null = null;
        if (this.selectedPoreCoord) {
          activePoreTele = tele.pores.find(p => p.coord.equals(this.selectedPoreCoord!)) ?? null;
        }

        if (!activePoreTele || activePoreTele.state !== PoreState.OCCUPIED) {
          const occupied = tele.pores.filter(p => p.state === PoreState.OCCUPIED);
          if (occupied.length > 0) {
            occupied.sort((a, b) => b.energy - a.energy);
            const best = occupied[0];
            this.selectedPoreCoord = best.coord;
            this.seafloorRenderer.setSelectedCoord(best.coord);
            const worldPos = this.seafloorRenderer.axialToWorld(best.coord);
            const inspectDist = Math.min(this.camera.distance, 14.0);
            this.camera.smoothFlyTo(worldPos.x, worldPos.y, worldPos.z, inspectDist);
            activePoreTele = best;
          }
        } else if (this.selectedPoreCoord) {
          this.seafloorRenderer.setSelectedCoord(this.selectedPoreCoord);
          const worldPos = this.seafloorRenderer.axialToWorld(this.selectedPoreCoord);
          const inspectDist = Math.min(this.camera.distance, 14.0);
          this.camera.smoothFlyTo(worldPos.x, worldPos.y, worldPos.z, inspectDist);
        }

        // Open Laboratory Drawer (Left)
        this.flyout.open();

        // Open Microscope & Oscilloscope Panel (Right)
        this.openMicroscope();

        // Update Specimen Data
        this.flyout.updateStagedSpecimen(activePoreTele, tele);

        this.handleResize();
        this.naturalistAssistant.showToast('🔬 In-Vitro Silicoid Laboratory: Microscope & GRN active');
      }
    }
  }
}

  public getActiveWorkspaceMode(): 'observatory' | 'safari' | 'laboratory' | 'studio' | 'chronicle' {
    return this.activeWorkspaceMode;
  }

  private setupLegendToggle(): void {
    const btn = document.getElementById('legend-toggle-btn');
    const body = document.getElementById('legend-body');
    const chevron = document.getElementById('legend-chevron');
    const toggleAction = () => {
      if (body) {
        const isCollapsed = body.classList.toggle('collapsed');
        if (chevron) chevron.textContent = isCollapsed ? '▸' : '▾';
      }
    };

    if (btn) btn.addEventListener('click', toggleAction);

    const floatingVisualKeyBtn = document.getElementById('floating-btn-visual-key');
    if (floatingVisualKeyBtn) floatingVisualKeyBtn.addEventListener('click', toggleAction);

    const btnOpenVisualKey = document.getElementById('btn-open-visual-key');
    if (btnOpenVisualKey) btnOpenVisualKey.addEventListener('click', toggleAction);

    const filterBtns = document.querySelectorAll<HTMLButtonElement>('.legend-filter-btn');
    const sections = document.querySelectorAll<HTMLElement>('.legend-section');
    filterBtns.forEach(fBtn => {
      fBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        filterBtns.forEach(b => b.classList.remove('active'));
        fBtn.classList.add('active');
        const filter = fBtn.getAttribute('data-filter') || 'all';
        sections.forEach(sec => {
          const category = sec.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            sec.style.display = 'flex';
          } else {
            sec.style.display = 'none';
          }
        });
      });
    });
  }

  private bindCanvasInteractions(): void {
    let isDragging = false;
    let isPainting = false;
    let lastPaintedCoord: HexCoord3D | null = null;
    let dragMode: 'orbit' | 'pan' = 'orbit';
    let lastX = 0;
    let lastY = 0;
    let downX = 0;
    let downY = 0;
    let draggedDistance = 0;

    this.seafloorCanvas.addEventListener('mousedown', (e) => {
      downX = e.clientX;
      downY = e.clientY;
      lastX = e.clientX;
      lastY = e.clientY;
      draggedDistance = 0;

      const isStudio = this.activeWorkspaceMode === 'studio';
      const brushMode = this.seafloorRenderer.activeBrushMode;

      // In Studio mode with a sculpting brush (not 'select'), left-click paints continuously. Hold Shift or use Right Click to orbit/pan camera.
      if (isStudio && brushMode !== 'select' && e.button === 0 && !e.shiftKey) {
        this.pushStudioUndoSnapshot();
        isPainting = true;
        const rect = this.seafloorCanvas.getBoundingClientRect();
        const tele = this.latestTelemetry ?? this.world.exportTelemetry();
        const clicked = this.seafloorRenderer.findPoreAtScreenCoord(e.clientX - rect.left, e.clientY - rect.top, tele);
        if (clicked) {
          this.applyBrushStroke(clicked, true);
          lastPaintedCoord = clicked;
        }
      } else {
        isDragging = true;
        dragMode = (e.button === 2 || e.shiftKey) ? 'pan' : 'orbit';
        this.seafloorCanvas.style.cursor = 'grabbing';
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (isPainting) {
        const rect = this.seafloorCanvas.getBoundingClientRect();
        const tele = this.latestTelemetry ?? this.world.exportTelemetry();
        const hovered = this.seafloorRenderer.findPoreAtScreenCoord(e.clientX - rect.left, e.clientY - rect.top, tele);
        if (hovered && (!lastPaintedCoord || !hovered.equals(lastPaintedCoord))) {
          this.applyBrushStroke(hovered, false);
          lastPaintedCoord = hovered;
        }
        this.seafloorRenderer.setHoveredCoord(hovered);
        this.flyout.updateCursorStatus(hovered, this.seafloorRenderer.activeBrushMode);
      } else if (isDragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        draggedDistance += Math.hypot(dx, dy);

        if (dragMode === 'orbit') {
          this.camera.rotate(-dx * 0.008, -dy * 0.008);
        } else {
          this.camera.pan(dx, dy);
        }
        this.seafloorCanvas.style.cursor = 'grabbing';
      } else {
        const rect = this.seafloorCanvas.getBoundingClientRect();
        const sx = e.clientX - rect.left;
        const sy = e.clientY - rect.top;
        const tele = this.latestTelemetry ?? this.world.exportTelemetry();
        const hovered = this.seafloorRenderer.findPoreAtScreenCoord(sx, sy, tele);
        this.seafloorRenderer.setHoveredCoord(hovered);
        if (this.activeWorkspaceMode === 'studio') {
          this.flyout.updateCursorStatus(hovered, this.seafloorRenderer.activeBrushMode);
        }
        if (hovered) {
          this.seafloorCanvas.style.cursor = 'pointer';
        } else {
          this.seafloorCanvas.style.cursor = 'grab';
        }
      }
    });

    this.seafloorCanvas.addEventListener('mouseleave', () => {
      this.seafloorRenderer.setHoveredCoord(null);
      if (this.activeWorkspaceMode === 'studio') {
        this.flyout.updateCursorStatus(null, this.seafloorRenderer.activeBrushMode);
      }
      this.seafloorCanvas.style.cursor = 'grab';
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
      isPainting = false;
      lastPaintedCoord = null;
      this.seafloorCanvas.style.cursor = 'grab';
    });

    this.seafloorCanvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      // In Studio mode, right click is used for camera navigation — do not reset active brush tool!
      if (this.activeWorkspaceMode === 'studio') {
        return;
      }
      // If user was right-click dragging/panning the camera, preserve the tool
      if (draggedDistance > 8) {
        return;
      }
      if (this.seafloorRenderer.activeBrushMode !== 'select') {
        this.flyout.setBrushMode('select');
      } else {
        this.deselect();
      }
    });

    this.seafloorCanvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.camera.zoom(e.deltaY * 0.02);
    }, { passive: false });

    this.seafloorCanvas.addEventListener('click', (e) => {
      if (draggedDistance > 5 || Math.hypot(e.clientX - downX, e.clientY - downY) > 8) {
        return; // Suppress selection click when user was dragging/orbiting the camera
      }
      const rect = this.seafloorCanvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;

      // 0. Check click on 3D floating billboard badge (e.g. to inspect morphology)
      if (this.seafloorRenderer.checkBillboardClick(sx, sy)) {
        return;
      }

      const tele = this.latestTelemetry ?? this.world.exportTelemetry();
      const clicked = this.seafloorRenderer.findPoreAtScreenCoord(sx, sy, tele);
      const mode = this.seafloorRenderer.activeBrushMode;

      if (mode === 'select') {
        if (!clicked) {
          // Clicked away into empty water or background
          if (this.activeWorkspaceMode === 'safari') {
            const safariSpec = this.naturalistAssistant.getCurrentSafariSpecimen();
            if (safariSpec) {
              this.selectedPoreCoord = safariSpec.coord;
              this.seafloorRenderer.setSelectedCoord(safariSpec.coord);
              this.seafloorRenderer.safariTargetCoord = safariSpec.coord;
            }
            return;
          }
          this.deselect();
          return;
        }

        if (this.selectedPoreCoord && clicked.equals(this.selectedPoreCoord)) {
          // Clicked the currently selected pore again
          if (this.activeWorkspaceMode === 'safari') {
            return; // In Safari mode, stay focused
          }
          this.deselect();
          return;
        }

        // Select the clicked pore!
        this.selectedPoreCoord = clicked;
        this.seafloorRenderer.setSelectedCoord(clicked);
        if (this.activeWorkspaceMode === 'safari') {
          this.seafloorRenderer.safariTargetCoord = clicked;
        }
        const poreTele = tele.pores.find((p: IPoreTelemetry) => p.coord.equals(clicked)) ?? null;
        this.hud.update(tele, poreTele);

        const pore = this.world.getPore(clicked);
        const hasSpecimen = pore && (
          pore.getState() === PoreState.OCCUPIED ||
          pore.hasSpore() ||
          pore.getState() === PoreState.CARCASS
        );

        const worldPos = this.seafloorRenderer.axialToWorld(clicked);
        const inspectDist = Math.min(this.camera.distance, 14.0);
        this.camera.smoothFlyTo(worldPos.x, worldPos.y, worldPos.z, inspectDist);

        if (this.activeWorkspaceMode === 'chronicle') {
          const recorder = this.world.getKinematicsRecorder();
          const currentFrame = recorder.getCurrentFrame();
          if (currentFrame) {
            for (const body of currentFrame.bodies) {
              const cell = body.cells.find(c => c.coord.equals(clicked));
              if (cell) {
                recorder.pinBody(body.bodyId);
                this.chroniclePlaybackBar.pinBody(body.bodyId, body.cladeId);
                this.chronicleAnalysisLabModal.show(body, cell, currentFrame.tick);
                return;
              }
            }
          }
          return;
        }

        if (this.activeWorkspaceMode === 'observatory') {
          this.showObservatorySpecimenCard(poreTele, tele);
          return;
        }

        if (this.activeWorkspaceMode === 'safari') {
          if (this.safariCircuitView) {
            this.safariCircuitView.render(poreTele, tele.vent);
          }
          if (poreTele) {
            this.naturalistAssistant.syncSafariCoPilotVitals(poreTele);
          }
          if (this.circuitAutopsyModal.isOpen() && poreTele) {
            this.circuitAutopsyModal.syncPore(clicked, tele);
          }
          return;
        }

        if (this.activeWorkspaceMode === 'laboratory') {
          this.openMicroscope();
          this.flyout.updateStagedSpecimen(poreTele, tele);
          this.microscopeView.render(poreTele, tele.vent);
          this.updateMicroscopeFooter(poreTele);
          return;
        }

        if (hasSpecimen) {
          this.openMicroscope();
        } else {
          // Vacant mineral pore, basalt bedrock, or active vent
          this.microscopeView.render(poreTele, tele.vent);
          this.updateAdvantageCard(poreTele);
        }
        return;
      }

      if (clicked) {
        if (!lastPaintedCoord || !clicked.equals(lastPaintedCoord)) {
          this.pushStudioUndoSnapshot();
          this.applyBrushStroke(clicked, true);
        }
      }
    });
  }

  private pushStudioUndoSnapshot(): void {
    const snap = this.world.createWorldSnapshot();
    this.studioUndoStack.push(snap);
    if (this.studioUndoStack.length > this.MAX_STUDIO_UNDO_DEPTH) {
      this.studioUndoStack.shift();
    }
    this.studioRedoStack = [];
    this.updateStudioUndoRedoUI();
  }

  private performStudioUndo(): void {
    if (this.studioUndoStack.length === 0) return;
    const currentSnap = this.world.createWorldSnapshot();
    this.studioRedoStack.push(currentSnap);
    const prevSnap = this.studioUndoStack.pop()!;
    this.world.restoreWorldSnapshot(prevSnap);
    this.updateStudioUndoRedoUI();
    this.flyout.refreshLatticeMetrics();
    this.naturalistAssistant?.showToast('↶ Undid terrain brush modification.');
  }

  private performStudioRedo(): void {
    if (this.studioRedoStack.length === 0) return;
    const currentSnap = this.world.createWorldSnapshot();
    this.studioUndoStack.push(currentSnap);
    const nextSnap = this.studioRedoStack.pop()!;
    this.world.restoreWorldSnapshot(nextSnap);
    this.updateStudioUndoRedoUI();
    this.flyout.refreshLatticeMetrics();
    this.naturalistAssistant?.showToast('↷ Redid terrain brush modification.');
  }

  private updateStudioUndoRedoUI(): void {
    this.flyout.setUndoRedoState(this.studioUndoStack.length > 0, this.studioRedoStack.length > 0);
  }

  private applyBrushStroke(clicked: HexCoord3D, showToast: boolean = true): void {
    const mode = this.seafloorRenderer.activeBrushMode;
    if (mode === 'select') return;

    const radius = Math.max(1, this.seafloorRenderer.studioBrushRadius);
    const targetCoords: HexCoord3D[] = [];
    if (radius === 1) {
      targetCoords.push(clicked);
    } else {
      const maxD = radius - 1;
      for (let dq = -maxD; dq <= maxD; dq++) {
        for (let dr = Math.max(-maxD, -dq - maxD); dr <= Math.min(maxD, -dq + maxD); dr++) {
          targetCoords.push(new HexCoord3D(clicked.q + dq, clicked.r + dr, clicked.z));
        }
      }
    }

    if (mode === 'trench') {
      let gougedCount = 0;
      for (const c of targetCoords) {
        if (this.world.gougeTrench(c)) {
          gougedCount++;
        }
      }
      if (gougedCount > 0 && showToast) {
        this.naturalistAssistant?.showToast(`🌊 Gouged abyssal rift trench across ${gougedCount} pore column(s) at z=-1`);
      }
    } else if (mode === 'vent') {
      let ventCount = 0;
      for (const c of targetCoords) {
        if (this.world.placeVent(c)) {
          ventCount++;
        }
      }
      if (ventCount > 0 && showToast) {
        this.naturalistAssistant?.showToast(`🌋 Planted hydrothermal vent chimney spire at (${clicked.q}, ${clicked.r})`);
      }
    } else if (mode === 'basalt') {
      const wallH = this.seafloorRenderer.studioBrushWallHeight ?? 3;
      const targetZ = this.flyout.getTargetZLayer();
      for (const c of targetCoords) {
        if (targetZ === 'auto') {
          this.world.buildBasaltWall(c, wallH);
        } else {
          this.world.setPoreBasalt(new HexCoord3D(c.q, c.r, targetZ), true);
        }
      }
    } else if (mode === 'excavate') {
      const targetZ = this.flyout.getTargetZLayer();
      for (const c of targetCoords) {
        let targetCoord = c;
        if (targetZ === 'auto') {
          for (let z = this.world.getMaxZ(); z >= this.world.getMinZ(); z--) {
            const testCoord = new HexCoord3D(c.q, c.r, z);
            const p = this.world.getPore(testCoord);
            if (p && p.isBasalt()) {
              targetCoord = testCoord;
              break;
            }
          }
        } else {
          targetCoord = new HexCoord3D(c.q, c.r, targetZ);
        }
        this.world.excavateHabitablePore(targetCoord);
        if (targetCoord.z < 0) {
          const pAbove = this.world.getPore(new HexCoord3D(targetCoord.q, targetCoord.r, 0));
          if (pAbove && pAbove.getState() === PoreState.EMPTY && !pAbove.hasSpore()) {
            pAbove.setBasalt(false);
            pAbove.setMedium(PoreMedium.AQUEOUS_FLUID);
            this.world.getGrid().removeBasaltObstacle(pAbove.coord);
          }
        }
      }
    } else if (mode === 'inoculate' || mode === 'lenski_dropper' || mode === 'pipette') {
      const targetZ = this.flyout.getTargetZLayer();
      const bioBank = BioBank.getInstance();
      const active = bioBank.getActiveInoculant();
      const safe = active ? new GenomeSafe(active.tapeBitstring) : undefined;
      let inoculatedCount = 0;
      for (const c of targetCoords) {
        let targetCoord = c;
        if (targetZ !== 'auto') {
          targetCoord = new HexCoord3D(c.q, c.r, targetZ);
        }
        if (this.world.inoculateCell(targetCoord, safe)) {
          inoculatedCount++;
        }
      }
      if (inoculatedCount > 0 && active && showToast) {
        this.naturalistAssistant?.showToast(`🌱 Inoculated "${active.name}" across ${inoculatedCount} pore(s)`);
      }
    } else if (mode === 'clear') {
      const targetZ = this.flyout.getTargetZLayer();
      for (const c of targetCoords) {
        let targetCoord = c;
        if (targetZ === 'auto') {
          for (let z = this.world.getMaxZ(); z >= this.world.getMinZ(); z--) {
            const testCoord = new HexCoord3D(c.q, c.r, z);
            const p = this.world.getPore(testCoord);
            if (p && (p.isBasalt() || p.getState() !== PoreState.EMPTY || p.hasSpore())) {
              targetCoord = testCoord;
              break;
            }
          }
        } else {
          targetCoord = new HexCoord3D(c.q, c.r, targetZ);
        }
        this.world.clearPore(targetCoord);
      }
    }

    this.flyout.refreshLatticeMetrics();
  }

  private focusOnSelected(): void {
    let targetCoord = this.selectedPoreCoord;
    if (!targetCoord) {
      const tele = this.world.exportTelemetry();
      const occ = tele.pores.find(p => p.state === 'OCCUPIED' && !p.isAqueous);
      if (occ) {
        targetCoord = occ.coord;
        this.selectedPoreCoord = occ.coord;
        this.seafloorRenderer.setSelectedCoord(occ.coord);
      } else {
        targetCoord = new HexCoord3D(0, 0, 0);
      }
    }
    const worldPos = this.seafloorRenderer.axialToWorld(targetCoord);
    this.camera.smoothFlyTo(worldPos, { distance: 7.5, elevation: 0.85 });
    const pore = this.world.getPore(targetCoord);
    if (pore && (pore.getState() === PoreState.OCCUPIED || pore.hasSpore() || pore.getState() === PoreState.CARCASS)) {
      this.openMicroscope();
    }
  }

  private startRenderLoop(): void {
    let lastTime = performance.now();
    let smoothedDt = 0.016;
    let lastRenderedWorldTick = -1;
    let lastSelectedPoreTele: IPoreTelemetry | null = null;

    const frame = (now: number) => {
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      // Allow frame times up to 100ms without capping auto-spin speed, guarding only against tab backgrounding
      const dt = Math.min(0.1, Math.max(0.001, rawDt));
      smoothedDt = smoothedDt * 0.75 + dt * 0.25;

      this.camera.update(smoothedDt);
      if (this.activeWorkspaceMode === 'chronicle') {
        this.world.getKinematicsRecorder().tickPlayback(dt * 1000);
        this.chroniclePlaybackBar.update();
        this.chronicleTourGuide.update(smoothedDt);
      }
      const tele = (this.isServerMode && this.remoteTelemetry) ? this.remoteTelemetry : this.world.exportTelemetry();
      this.latestTelemetry = tele;
      this.seafloorRenderer.render(tele);

      let selectedPoreTele: IPoreTelemetry | null = null;
      if (this.selectedPoreCoord) {
        selectedPoreTele = tele.pores.find(p => p.coord.equals(this.selectedPoreCoord!)) ?? null;
      }
      if (this.microscopePanel && this.microscopePanel.classList.contains('open')) {
        this.microscopeView.render(selectedPoreTele, tele.vent);
        this.updateMicroscopeFooter(selectedPoreTele);
      }
      if (this.activeWorkspaceMode === 'safari' && this.safariCircuitView && selectedPoreTele) {
        this.safariCircuitView.render(selectedPoreTele, tele.vent);
      }

      // Only update DOM UI controllers when the simulation advanced a tick or selection changed
      if (tele.tick !== lastRenderedWorldTick || selectedPoreTele !== lastSelectedPoreTele) {
        lastRenderedWorldTick = tele.tick;
        lastSelectedPoreTele = selectedPoreTele;

        if (this.activePortal === 'arena') {
          this.arenaController.update(tele);
        }

        this.hud.update(tele, selectedPoreTele);
        this.updateAdvantageCard(selectedPoreTele);
        this.phylogenyModal.updateLive(tele);
        this.naturalistAssistant.updateTelemetry(tele, this.selectedPoreCoord);
        this.flyout.updateLive(tele);
        if (this.activeWorkspaceMode === 'laboratory') {
          this.flyout.updateStagedSpecimen(selectedPoreTele, tele);
        }

        if (this.envPillTemp && this.envPillRedox && this.envPillCells) {
          this.envPillTemp.innerHTML = `🌋 <strong>Plume:</strong> ${Math.round(tele.vent.thermalFlux || 350)}°C Steady`;
          this.envPillRedox.innerHTML = `⚡ <strong>Redox:</strong> ${tele.vent.streamA ? '+380' : '+150'} mV`;
          this.envPillCells.innerHTML = `🧬 <strong>Biomass:</strong> ${tele.livingCount} Cells`;
        }
        if (this.activeWorkspaceMode === 'observatory' && this.selectedPoreCoord && this.obsSpecimenCard && !this.obsSpecimenCard.classList.contains('hidden')) {
          this.showObservatorySpecimenCard(selectedPoreTele, tele);
        }
      }

      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}

// Bootstrap on DOM ready
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => {
    new SiliquariumApp();
  });
} else {
  new SiliquariumApp();
}
