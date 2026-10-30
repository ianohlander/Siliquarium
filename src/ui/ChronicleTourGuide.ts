import { buildTourHUDHtml } from './ChronicleTourGuideHtmlTemplate.js';
/**
 * 🐠 Siliquarium UI Subsystem
 * ChronicleTourGuide: Interactive Historical Expedition Guide, Paleontological Tour & Dynamic Camera Director.
 * 
 * Scans recorded historical frames from ColonyKinematicsRecorder and the Evolutionary Flight
 * Recorder to curate a structured pedagogical tour of emergent phenomena:
 * 1. Multicellular Slime Mold Treadmilling & Motility
 * 2. Wolpert French Flag Differentiation (Spatial GRN Patterning in Clones)
 * 3. Trophic Predation Strikes & Warfare
 * 4. Detrital Necromass Scavenging
 * 5. Chemiosmotic Hydrothermal Vent Autotrophy
 * 6. Geodynamic Environmental Shocks & Evasive Cleavage
 * 7. Endosymbiotic Organelle Cassette Integration
 * 8. Pelagic Sporulation & Water-Column Advection
 * 9. 🦄 Black Swan Fluke Discoveries:
 *    - Cross-Lineage Chimeric Mutualism & Peaceful Contact
 *    - Giant Syncytial Metazoan Titans (N >= 7 cells)
 *    - Hadal Trench / Fissure Deep Crevasse Exploration
 *    - Basalt Chimney Vertical Climbers
 *    - De Novo Complex Logic Gate Innovations (XOR / Half-Adder)
 * 
 * For each stop, the guide:
 * - Directs smooth 3D camera flight and continuous dynamic camera tracking during playback loops
 * - Tracks vertical descent/ascent into deep fissures and onto elevated chimney spires
 * - Sets an A-B time loop to replay the exact behavioral window
 * - Activates the ideal histological stain and motility overlays
 * - Delivers deep scientific narrative for students, hobbyists, and Lenski researchers
 * - Provides 1-click Cryo-Preservation of novel fluke specimens to the Bio-Bank
 * - Provides a "Pause & Explore" mode for hands-on histological inspection & Lab autopsy
 */

import { HexCoord3D } from '../core/spatial/HexCoord3D.js';
import {
  ColonyKinematicsRecorder,
  HistologicalStain,
  IKinematicBody,
  IKinematicCellSnapshot,
  ITrophicRay,
  LensViewMode
} from '../engine/kinematics/ColonyKinematicsRecorder.js';
import { OrbitCamera } from '../visualizers/OrbitCamera.js';
import { SeafloorRenderer3D } from '../visualizers/SeafloorRenderer3D.js';
import { ChroniclePlaybackBar } from './ChroniclePlaybackBar.js';
import { BioBank } from '../engine/storage/BioBank.js';
import { PoreWorkshop } from '../core/domain/PoreWorkshop.js';
import { MotifScanner } from '../core/paleontology/MotifScanner.js';
import { MotifType } from '../core/paleontology/NetworkMotif.js';

export type TourStopCategory =
  | 'MULTICELLULAR_MOTILITY'
  | 'DIFFERENTIATION'
  | 'TROPHIC_PREDATION'
  | 'DETRITAL_SCAVENGING'
  | 'VENT_AUTOTROPHY'
  | 'GEODYNAMIC_CRISIS'
  | 'ENDOSYMBIOSIS'
  | 'PELAGIC_SPORING'
  | 'LENSKI_CIT_BREAKTHROUGH'
  | 'SIDEROPHORE_CHELATION'
  | 'BIOFILM_EPS_MATRIX'
  | 'PARACRINE_SYNTROPHY'
  | 'VAMPIRIC_KLEPTOPLASTY'
  | 'PREDICTIVE_PAVLOVIAN'
  | 'RING_OSCILLATOR_CLOCK'
  | 'BISTABLE_LATCH_MEMORY'
  | 'ELECTRO_MECHANO_AMBUSH'
  | 'EPIGENETIC_CASTE_SWITCH'
  | 'FLUKE_BLACK_SWAN_CHIMERA'
  | 'FLUKE_BLACK_SWAN_TITAN'
  | 'FLUKE_BLACK_SWAN_FISSURE_ABYSS'
  | 'FLUKE_BLACK_SWAN_VERTICAL_CLIMBER'
  | 'FLUKE_BLACK_SWAN_SPONTANEOUS_LOGIC'
  | 'ECOSYSTEM_OVERVIEW';

/**
 * Curated presentation perspective combining a Biological Representation Lens
 * (Physarum bio-smoothed hull, vascular conduits, scalar potentials, or pore lattice)
 * with a Histological Optical Stain (morphology, GRN operons, vascular flux, battery PMF).
 */
export interface ITourAspectOption {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly lens: LensViewMode;
  readonly stain: HistologicalStain;
  readonly description: string;
}

export interface IChronicleTourStop {
  readonly id: string;
  readonly category: TourStopCategory;
  readonly badge: string;
  readonly badgeColor: string;
  readonly icon: string;
  readonly title: string;
  readonly subtitle: string;
  readonly narrative: string;
  readonly targetCoord: HexCoord3D;
  readonly cameraDistance: number;
  readonly cameraElevation?: number;
  readonly cameraAzimuth?: number;
  readonly startTick: number;
  readonly endTick: number;
  readonly startFrameIndex: number;
  readonly endFrameIndex: number;
  readonly focalFrameIndex: number;
  readonly recommendedStain: HistologicalStain;
  readonly recommendedLens: LensViewMode;
  readonly aspectOptions: readonly ITourAspectOption[];
  readonly recommendedOverlays: {
    trophicRays?: boolean;
    slimeStreaming?: boolean;
    apoptosisHalos?: boolean;
    ghostTrails?: boolean;
    speciesBadges?: boolean;
    isolation?: boolean;
  };
  readonly pinnedBodyId?: string;
  readonly pinnedCladeId?: string;
  readonly dynamicCameraFollow?: boolean;
  readonly cameraFissureDepthTracking?: boolean;
  readonly isRareFluke?: boolean;
  readonly flukePhenomenonType?: string;
}

export interface IChronicleTourCallbacks {
  readonly onOpenLab?: (body: IKinematicBody, cell?: IKinematicCellSnapshot) => void;
  readonly onToast?: (message: string) => void;
  readonly onLensChange?: (lens: LensViewMode) => void;
  readonly onStainChange?: (stain: HistologicalStain) => void;
}

export class ChronicleTourGuide {
  private readonly recorder: ColonyKinematicsRecorder;
  private readonly camera: OrbitCamera;
  private readonly playbackBar: ChroniclePlaybackBar;
  private readonly callbacks: IChronicleTourCallbacks;
  private containerEl: HTMLElement | null = null;
  private isActive: boolean = false;
  private isExploring: boolean = false;
  private tourStops: IChronicleTourStop[] = [];
  private currentStopIndex: number = 0;
  private currentAspectIndex: number = 0;
  public isDirectorsCut: boolean = false;
  private directorsCutLoops: number = 0;
  private lastLoopFrame: number = -1;

  constructor(
    recorder: ColonyKinematicsRecorder,
    camera: OrbitCamera,
    playbackBar: ChroniclePlaybackBar,
    callbacks: IChronicleTourCallbacks = {}
  ) {
    this.recorder = recorder;
    this.camera = camera;
    this.playbackBar = playbackBar;
    this.callbacks = callbacks;
    this.initDOM();
  }

  private initDOM(): void {
    if (typeof document === 'undefined') return;
    let existing = document.getElementById('chronicle-tour-hud');
    if (!existing) {
      existing = document.createElement('div');
      existing.id = 'chronicle-tour-hud';
      existing.className = 'chronicle-tour-hud hidden';
      document.body.appendChild(existing);
    }
    this.containerEl = existing;

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => {
        if (!this.isActive) return;
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

        if (e.key === '1' || e.key === '2' || e.key === '3' || e.key === '4') {
          const idx = parseInt(e.key, 10) - 1;
          const curStop = this.tourStops[this.currentStopIndex];
          if (curStop && curStop.aspectOptions && idx < curStop.aspectOptions.length) {
            this.applyAspect(idx);
          }
        } else if (e.key === 'd' || e.key === 'D') {
          this.toggleDirectorsCut();
        }
      });
    }
  }

  public toggleDirectorsCut(enabled?: boolean): void {
    this.isDirectorsCut = enabled !== undefined ? enabled : !this.isDirectorsCut;
    this.directorsCutLoops = 0;
    this.lastLoopFrame = -1;
    const btn = this.containerEl?.querySelector('#tour-btn-directors-cut') as HTMLButtonElement | null;
    if (btn) {
      btn.classList.toggle('active', this.isDirectorsCut);
      btn.innerHTML = `🎬 Director's Cut: ${this.isDirectorsCut ? 'ON' : 'OFF'}`;
    }
    this.callbacks.onToast?.(
      this.isDirectorsCut
        ? '🎬 Director\'s Cut: ON (Autonomous Expedition Cinema with Aspect Cycling)'
        : '🎬 Director\'s Cut: OFF'
    );
  }

  public startTour(): void {
    if (this.tourStops.length === 0) {
      this.tourStops = this.discoverTourStops();
    }
    if (this.tourStops.length === 0) {
      this.callbacks.onToast?.('ℹ️ Tour Guide: Historical buffer empty. Let simulation run a few epochs first!');
      return;
    }

    this.isActive = true;
    this.isExploring = false;
    this.currentStopIndex = 0;
    this.containerEl?.classList.remove('hidden');

    this.goToStop(0);
  }

  public closeTour(): void {
    this.isActive = false;
    this.isExploring = false;
    this.isDirectorsCut = false;
    this.containerEl?.classList.add('hidden');
    this.recorder.pause();
  }

  public isOpen(): boolean {
    return this.isActive;
  }

  public getStops(): readonly IChronicleTourStop[] {
    return this.tourStops;
  }

  public loadStops(stops: readonly IChronicleTourStop[]): void {
    if (stops && stops.length > 0) {
      this.tourStops = stops.map(s => {
        const lens = s.recommendedLens ?? 'plasmodium';
        const stain = s.recommendedStain ?? 'morphology';
        const aspects = s.aspectOptions && s.aspectOptions.length > 0 ? s.aspectOptions : [
          {
            id: 'aspect-primary',
            label: 'Primary Lens',
            icon: '🔬',
            lens,
            stain,
            description: 'Curated perspective highlighting primary morphology.'
          }
        ];
        return {
          ...s,
          targetCoord: new HexCoord3D(s.targetCoord.q, s.targetCoord.r, s.targetCoord.z),
          recommendedLens: lens,
          aspectOptions: aspects
        };
      });
    }
  }

  public getCurrentAspect(): ITourAspectOption | null {
    const stop = this.tourStops[this.currentStopIndex];
    if (!stop || !stop.aspectOptions || stop.aspectOptions.length === 0) return null;
    return stop.aspectOptions[this.currentAspectIndex] ?? stop.aspectOptions[0];
  }

  public applyAspect(aspectIndex: number): void {
    const stop = this.tourStops[this.currentStopIndex];
    if (!stop || !stop.aspectOptions || stop.aspectOptions.length === 0) return;
    if (aspectIndex < 0 || aspectIndex >= stop.aspectOptions.length) return;

    this.currentAspectIndex = aspectIndex;
    const aspect = stop.aspectOptions[aspectIndex];

    // 1. Set Biological Representation Lens
    this.recorder.setLensMode(aspect.lens);
    this.playbackBar.setLens(aspect.lens);
    this.callbacks.onLensChange?.(aspect.lens);

    // 2. Set Histological Optical Stain
    this.recorder.setStain(aspect.stain);
    this.playbackBar.setStain(aspect.stain);
    this.callbacks.onStainChange?.(aspect.stain);

    // 3. Re-render HUD to reflect the active aspect button & explanatory narrative
    this.renderTourHUD();
    this.bindHUDEvents();
  }

  public cycleAspect(): void {
    const stop = this.tourStops[this.currentStopIndex];
    if (!stop || !stop.aspectOptions || stop.aspectOptions.length <= 1) return;
    const nextIdx = (this.currentAspectIndex + 1) % stop.aspectOptions.length;
    this.applyAspect(nextIdx);
  }

  public goToStop(index: number): void {
    if (index < 0 || index >= this.tourStops.length) return;
    this.currentStopIndex = index;
    this.currentAspectIndex = 0;
    this.isExploring = false;

    const stop = this.tourStops[index];
    const initialAspect = stop.aspectOptions && stop.aspectOptions.length > 0 ? stop.aspectOptions[0] : null;
    const lensToApply = initialAspect ? initialAspect.lens : (stop.recommendedLens ?? 'plasmodium');
    const stainToApply = initialAspect ? initialAspect.stain : stop.recommendedStain;

    // 1. Smoothly glide camera to the phenomenon
    const worldPos = SeafloorRenderer3D.axialToWorld(stop.targetCoord);
    this.camera.smoothFlyTo(worldPos, {
      distance: stop.cameraDistance,
      elevation: stop.cameraElevation ?? 0.75,
      azimuth: stop.cameraAzimuth
    });

    // 2. Set Time Scrubber & A-B Looping
    this.recorder.scrubTo(stop.focalFrameIndex);
    this.recorder.setLoopRange(stop.startFrameIndex, stop.endFrameIndex);
    this.recorder.setSpeed(1);

    // 3. Set Biological Lens & Histological Staining Mode
    this.recorder.setLensMode(lensToApply);
    this.playbackBar.setLens(lensToApply);
    this.callbacks.onLensChange?.(lensToApply);

    this.recorder.setStain(stainToApply);
    this.playbackBar.setStain(stainToApply);
    this.callbacks.onStainChange?.(stainToApply);

    // 4. Set Dynamic Overlays
    for (const [key, val] of Object.entries(stop.recommendedOverlays)) {
      const toggleKey = key as keyof typeof this.recorder.overlayToggles;
      if (this.recorder.overlayToggles[toggleKey] !== undefined && typeof val === 'boolean') {
        if (this.recorder.overlayToggles[toggleKey] !== val) {
          this.recorder.toggleOverlay(toggleKey);
        }
      }
    }

    // 5. Lineage Pinning / Spotlighting
    if (stop.pinnedBodyId) {
      this.playbackBar.pinBody(stop.pinnedBodyId, stop.pinnedCladeId);
    } else if (stop.pinnedCladeId) {
      this.playbackBar.pinClade(stop.pinnedCladeId);
    }

    // 6. Play loop automatically
    this.recorder.play();

    // 7. Update UI
    this.renderTourHUD();
    this.bindHUDEvents();
    this.playbackBar.update();
  }

  public nextStop(): void {
    if (this.tourStops.length <= 1) return;
    const nextIdx = (this.currentStopIndex + 1) % this.tourStops.length;
    this.goToStop(nextIdx);
  }

  public prevStop(): void {
    if (this.tourStops.length <= 1) return;
    const prevIdx = (this.currentStopIndex - 1 + this.tourStops.length) % this.tourStops.length;
    this.goToStop(prevIdx);
  }

  public toggleExploreMode(): void {
    this.isExploring = !this.isExploring;
    if (this.isExploring) {
      this.recorder.pause();
    } else {
      this.recorder.play();
    }
    this.renderTourHUD();
    this.bindHUDEvents();
  }

  /**
   * Called every render frame by the main simulation loop.
   * Dynamically tracks the moving organism across hexes and depth fissures during loop playback.
   */
  public update(_dt: number): void {
    if (!this.isActive || this.tourStops.length === 0) return;
    const stop = this.tourStops[this.currentStopIndex];
    if (!stop) return;

    if (this.isDirectorsCut) {
      this.camera.rotate(0.003, 0);
      const curIdx = this.recorder.currentFrameIndex;
      if (this.lastLoopFrame > stop.endFrameIndex - 2 && curIdx <= stop.startFrameIndex + 1) {
        this.directorsCutLoops++;
        if (this.directorsCutLoops % 2 === 0) {
          this.cycleAspect();
        }
        if (this.directorsCutLoops >= 4) {
          this.directorsCutLoops = 0;
          this.nextStop();
        }
      }
      this.lastLoopFrame = curIdx;
    }

    if (this.isExploring || !stop.dynamicCameraFollow) return;

    const currentFrame = this.recorder.getCurrentFrame();
    if (!currentFrame) return;

    // Find the focal body in the current frame
    let focalBody: IKinematicBody | null = null;
    if (stop.pinnedBodyId) {
      focalBody = currentFrame.bodies.find(b => b.bodyId === stop.pinnedBodyId) || null;
    }
    if (!focalBody && stop.pinnedCladeId) {
      focalBody = currentFrame.bodies.find(b => b.cladeId === stop.pinnedCladeId) || null;
    }
    if (!focalBody && currentFrame.bodies.length > 0) {
      // Find body closest to targetCoord
      let minD = Infinity;
      for (const b of currentFrame.bodies) {
        const lead = b.cells[0];
        if (lead) {
          const d = lead.coord.distanceTo(stop.targetCoord);
          if (d < minD) {
            minD = d;
            focalBody = b;
          }
        }
      }
    }

    if (focalBody && focalBody.cells.length > 0) {
      const leadCell = focalBody.cells[0];
      const worldPos = SeafloorRenderer3D.axialToWorld(leadCell.coord);

      let elev = stop.cameraElevation ?? 0.75;
      let dist = stop.cameraDistance;

      // Adjust viewing angle for deep trench / fissure descent or high spire
      if (stop.cameraFissureDepthTracking) {
        if (leadCell.coord.z <= 1) {
          elev = 0.52; // Flatter pitch to look down into the crevasse
          dist = Math.min(dist, 7.5);
        } else if (leadCell.coord.z >= 4) {
          elev = 0.90; // Steeper bird's-eye pitch to look over the chimney spire
          dist = Math.max(dist, 9.5);
        }
      }

      this.camera.smoothFlyTo(worldPos, { distance: dist, elevation: elev });
    }
  }

  /**
   * Freezes the current focal specimen to the persistent Richard Lenski Bio-Bank cryo-vault.
   */
  public freezeCurrentSpecimen(): boolean {
    const stop = this.tourStops[this.currentStopIndex];
    const currentFrame = this.recorder.getCurrentFrame();
    if (!stop || !currentFrame) return false;

    let focalBody: IKinematicBody | null = null;
    if (stop.pinnedBodyId) {
      focalBody = currentFrame.bodies.find(b => b.bodyId === stop.pinnedBodyId) || null;
    }
    if (!focalBody && stop.pinnedCladeId) {
      focalBody = currentFrame.bodies.find(b => b.cladeId === stop.pinnedCladeId) || null;
    }
    if (!focalBody && currentFrame.bodies.length > 0) {
      focalBody = currentFrame.bodies[0];
    }

    if (!focalBody || focalBody.cells.length === 0) return false;

    const leadCell = focalBody.cells[0];
    const bioBank = BioBank.getInstance();
    const cleanTitle = stop.title.replace(/[^a-zA-Z0-9 ]/g, '').trim();

    const record = bioBank.saveSilicoid({
      name: `${focalBody.speciesName} (${stop.badge})`,
      taxonBinomial: focalBody.speciesName,
      commonName: cleanTitle,
      tapeBitstring: leadCell.tapeBitstring || '010101010101010101010101010101010101010101010101010101010101',
      gateCount: leadCell.gateCount,
      gateTypes: leadCell.gateTypes,
      generation: 1,
      savedAtEpoch: currentFrame.tick,
      notes: `Frozen from Historical Guided Tour Stop [${stop.badge}]: "${stop.title}". Phenomenon: ${stop.narrative.slice(0, 160)}...`,
      isDifferentiated: focalBody.isMulticellularDifferentiated,
      bodyTopology: focalBody.bodyTopology
    });

    this.callbacks.onToast?.(`❄️ Specimen "${record.name}" safely cryo-preserved in Bio-Bank!`);
    return true;
  }

  private renderTourHUD(): void {
    if (!this.containerEl || this.tourStops.length === 0) return;

    const stop = this.tourStops[this.currentStopIndex];
    const total = this.tourStops.length;
    const num = this.currentStopIndex + 1;
    const activeAspect = this.getCurrentAspect();
    const activeLens = activeAspect ? activeAspect.lens : (stop.recommendedLens ?? 'plasmodium');
    const activeStain = activeAspect ? activeAspect.stain : stop.recommendedStain;

    this.containerEl.innerHTML = buildTourHUDHtml({
      stop,
      total,
      currentNum: num,
      currentAspectIndex: this.currentAspectIndex,
      isExploring: this.isExploring,
      isDirectorsCut: this.isDirectorsCut,
      activeLens,
      activeStain,
      activeAspect
    });
  }

  private bindHUDEvents(): void {
    if (!this.containerEl) return;

    this.containerEl.querySelector('#tour-btn-close')?.addEventListener('click', () => this.closeTour());
    this.containerEl.querySelector('#tour-btn-prev')?.addEventListener('click', () => this.prevStop());
    this.containerEl.querySelector('#tour-btn-next')?.addEventListener('click', () => this.nextStop());
    this.containerEl.querySelector('#tour-btn-explore')?.addEventListener('click', () => this.toggleExploreMode());
    this.containerEl.querySelector('#tour-btn-directors-cut')?.addEventListener('click', () => this.toggleDirectorsCut());

    // Aspect Switcher Button Handlers
    const aspectBtns = this.containerEl.querySelectorAll<HTMLButtonElement>('.tour-aspect-btn');
    aspectBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idxStr = btn.getAttribute('data-aspect-index');
        if (idxStr !== null) {
          const idx = parseInt(idxStr, 10);
          if (!isNaN(idx)) {
            this.applyAspect(idx);
          }
        }
      });
    });

    // Freeze to Bio-Bank
    const freezeBtn = this.containerEl.querySelector('#tour-btn-freeze') as HTMLButtonElement | null;
    freezeBtn?.addEventListener('click', () => {
      const success = this.freezeCurrentSpecimen();
      if (success && freezeBtn) {
        freezeBtn.innerHTML = '✅ Frozen to Vault!';
        freezeBtn.style.background = 'rgba(16, 185, 129, 0.35)';
        freezeBtn.style.borderColor = '#10b981';
        freezeBtn.disabled = true;
      }
    });

    // Inspect in Lab
    const labBtn = this.containerEl.querySelector('#tour-btn-open-lab');
    labBtn?.addEventListener('click', () => {
      const stop = this.tourStops[this.currentStopIndex];
      const curFrame = this.recorder.getCurrentFrame();
      if (!stop || !curFrame) return;

      let focalBody = curFrame.bodies.find(b => b.bodyId === stop.pinnedBodyId) ||
                       curFrame.bodies.find(b => b.cladeId === stop.pinnedCladeId) ||
                       curFrame.bodies[0];

      if (focalBody) {
        this.recorder.pause();
        this.callbacks.onOpenLab?.(focalBody, focalBody.cells[0]);
      }
    });
  }

  /**
   * Scans recorded historical frames and identifies premier biological, physical,
   * and ultra-rare "Black Swan" fluke phenomena.
   */
  public discoverTourStops(): IChronicleTourStop[] {
    const allFrames = this.recorder.getAllFrames();
    const count = allFrames.length;
    if (count === 0) return [];

    const stops: IChronicleTourStop[] = [];

    // -----------------------------------------------------------------------
    // Stop Candidate 1: Multicellular Slime Mold Treadmilling Motility
    // -----------------------------------------------------------------------
    let bestMotilityBody: IKinematicBody | null = null;
    let bestMotilityFrameIdx = -1;
    let maxSpeed = 0;

    for (let i = 0; i < count; i++) {
      const f = allFrames[i];
      for (const b of f.bodies) {
        if (b.cells.length >= 3 && b.speed > maxSpeed) {
          maxSpeed = b.speed;
          bestMotilityBody = b;
          bestMotilityFrameIdx = i;
        }
      }
      if (f.streamingChevrons.length > 0 && bestMotilityFrameIdx === -1) {
        bestMotilityFrameIdx = i;
        bestMotilityBody = f.bodies.find(b => b.cells.length >= 3) ?? (f.bodies[0] || null);
      }
    }

    if (bestMotilityBody && bestMotilityFrameIdx !== -1) {
      const startIdx = Math.max(0, bestMotilityFrameIdx - 15);
      const endIdx = Math.min(count - 1, bestMotilityFrameIdx + 20);
      const leadCell = bestMotilityBody.cells[0];

      stops.push({
        id: 'stop-motility',
        category: 'MULTICELLULAR_MOTILITY',
        badge: 'SLIME MOTILITY',
        badgeColor: '#38bdf8',
        icon: '🌊',
        title: 'Multicellular Slime Mold Treadmilling',
        subtitle: `Syncytial organism "${bestMotilityBody.speciesName}" (${bestMotilityBody.cells.length} cells • Speed: ${bestMotilityBody.speed.toFixed(3)})`,
        narrative: `Observe macroscopic syncytial motility emerging strictly from local rules! Forward trophocytes project protoplasmic pseudopodia toward vent nutrients (<strong>🌊 Slime Streaming</strong>), while trailing cells undergo scheduled programmed resorption (<strong>👻 Apoptosis Halos</strong>). The camera automatically tracks this organism as it migrates across the basalt substrate.`,
        targetCoord: leadCell ? leadCell.coord : new HexCoord3D(0, 0, 0),
        cameraDistance: 8.5,
        cameraElevation: 0.75,
        startTick: allFrames[startIdx].tick,
        endTick: allFrames[endIdx].tick,
        startFrameIndex: startIdx,
        endFrameIndex: endIdx,
        focalFrameIndex: bestMotilityFrameIdx,
        recommendedStain: 'morphology',
        recommendedLens: 'plasmodium',
        aspectOptions: [
          {
            id: 'motility-plasmodium',
            label: 'Syncytial Hull',
            icon: '🌊',
            lens: 'plasmodium',
            stain: 'morphology',
            description: 'Bio-smoothed syncytial cytoplasm envelope with peristaltic traveling waves and advancing pseudopodial tips.'
          },
          {
            id: 'motility-vascular',
            label: 'Internal Streaming',
            icon: '⚡',
            lens: 'vascular',
            stain: 'vascular',
            description: 'Curved quadratic vascular conduits and velocity chevrons revealing rapid internal protoplasmic streaming.'
          },
          {
            id: 'motility-lattice',
            label: 'Porin Chambers',
            icon: '🔬',
            lens: 'lattice',
            stain: 'morphology',
            description: 'Discrete hexagonal porin channels displaying member cell coordination and posterior apoptotic vacancy.'
          },
          {
            id: 'motility-potential',
            label: 'Metabolic Wavefront',
            icon: '🔋',
            lens: 'potential',
            stain: 'battery',
            description: 'Electrochemical battery potential gradient fueling forward treadmilling locomotion toward nutrients.'
          }
        ],
        recommendedOverlays: {
          slimeStreaming: true,
          apoptosisHalos: true,
          ghostTrails: true,
          speciesBadges: false,
          trophicRays: false
        },
        pinnedBodyId: bestMotilityBody.bodyId,
        pinnedCladeId: bestMotilityBody.cladeId,
        dynamicCameraFollow: true,
        cameraFissureDepthTracking: true
      });
    }

    // -----------------------------------------------------------------------
    // Stop Candidate 2: Wolpert's French Flag Problem (GRN Spatial Differentiation)
    // -----------------------------------------------------------------------
    let bestDiffBody: IKinematicBody | null = null;
    let bestDiffFrameIdx = -1;

    for (let i = count - 1; i >= 0; i--) {
      const f = allFrames[i];
      const diffBody = f.bodies.find(b => b.isMulticellularDifferentiated && b.cells.length >= 4);
      if (diffBody) {
        bestDiffBody = diffBody;
        bestDiffFrameIdx = i;
        break;
      }
    }

    if (bestDiffBody && bestDiffFrameIdx !== -1) {
      const startIdx = Math.max(0, bestDiffFrameIdx - 10);
      const endIdx = Math.min(count - 1, bestDiffFrameIdx + 15);
      const midCell = bestDiffBody.cells[Math.floor(bestDiffBody.cells.length / 2)];

      stops.push({
        id: 'stop-differentiation',
        category: 'DIFFERENTIATION',
        badge: 'FRENCH FLAG GRN',
        badgeColor: '#a855f7',
        icon: '🧬',
        title: 'Spatial Gene Regulation (Wolpert\'s French Flag)',
        subtitle: `Organism ${bestDiffBody.organismId || bestDiffBody.bodyId} (${bestDiffBody.cells.length} cells • Identical Genome Tape)`,
        narrative: `Every member cell in this metazoan organism shares the exact identical 60-bit DNA sequence. Yet, cells adjacent to the hydrothermal nozzle express feeding operons (<strong>🌾 Trophocyte</strong>), while peripheral cells express protective somatic cuticles or storage anchors (<strong>⚓ Basalt Anchor</strong>). Differential gene expression emerges strictly from spatial redox gradients!`,
        targetCoord: midCell ? midCell.coord : new HexCoord3D(0, 0, 0),
        cameraDistance: 8.5,
        cameraElevation: 0.75,
        startTick: allFrames[startIdx].tick,
        endTick: allFrames[endIdx].tick,
        startFrameIndex: startIdx,
        endFrameIndex: endIdx,
        focalFrameIndex: bestDiffFrameIdx,
        recommendedStain: 'grn',
        recommendedLens: 'potential',
        aspectOptions: [
          {
            id: 'diff-potential-grn',
            label: 'GRN Morphogen Field',
            icon: '🧬',
            lens: 'potential',
            stain: 'grn',
            description: 'Continuous operon expression heatmap displaying spatial French Flag patterning across cells sharing identical DNA.'
          },
          {
            id: 'diff-lattice-grn',
            label: 'Cellular Pore Roles',
            icon: '🔬',
            lens: 'lattice',
            stain: 'grn',
            description: 'Discrete hexagonal pores stained by active operon (cyan feeding trophocyte, amber basalt anchor, purple somatic cuticle).'
          },
          {
            id: 'diff-hybrid',
            label: 'Integrated Syncytium',
            icon: '✨',
            lens: 'hybrid',
            stain: 'morphology',
            description: 'Composite perspective uniting vascular inter-pore conduits with the bio-smoothed outer syncytial hull.'
          },
          {
            id: 'diff-battery',
            label: 'Chemiosmotic Polarity',
            icon: '🔋',
            lens: 'potential',
            stain: 'battery',
            description: 'Protonmotive battery voltage distribution across apical feeder pores versus basal structural anchor cells.'
          }
        ],
        recommendedOverlays: {
          trophicRays: true,
          speciesBadges: false,
          slimeStreaming: false,
          apoptosisHalos: false
        },
        pinnedBodyId: bestDiffBody.bodyId,
        pinnedCladeId: bestDiffBody.cladeId,
        dynamicCameraFollow: false
      });
    }

    // -----------------------------------------------------------------------
    // Stop Candidate 3: Trophic Predation Warfare (Contact Lysis Strike)
    // -----------------------------------------------------------------------
    let predationFrameIdx = -1;
    let predationRay = null;

    for (let i = 0; i < count; i++) {
      const f = allFrames[i];
      const pRay = f.trophicRays.find(r => r.type === 'predation');
      if (pRay) {
        predationFrameIdx = i;
        predationRay = pRay;
        break;
      }
    }

    if (predationRay && predationFrameIdx !== -1) {
      const startIdx = Math.max(0, predationFrameIdx - 5);
      const endIdx = Math.min(count - 1, predationFrameIdx + 12);

      stops.push({
        id: 'stop-predation',
        category: 'TROPHIC_PREDATION',
        badge: 'TROPHIC WARFARE',
        badgeColor: '#ef4444',
        icon: '⚔️',
        title: 'Predation Strike & Enzymatic Siphon',
        subtitle: `Contact Predation Strike at (${predationRay.sourceCoord.q}, ${predationRay.sourceCoord.r})`,
        narrative: `An aggressive heterotroph armed with allosteric NOT/XOR gates strikes an adjacent prey pore. A piercing crimson laser ray siphon breaches the prey's membrane, draining free energy tokens and triggering defensive distress or fatal lytic autolysis.`,
        targetCoord: predationRay.sourceCoord,
        cameraDistance: 7.0,
        cameraElevation: 0.7,
        startTick: allFrames[startIdx].tick,
        endTick: allFrames[endIdx].tick,
        startFrameIndex: startIdx,
        endFrameIndex: endIdx,
        focalFrameIndex: predationFrameIdx,
        recommendedStain: 'morphology',
        recommendedLens: 'hybrid',
        aspectOptions: [
          {
            id: 'pred-hybrid',
            label: 'Trophic Laser Strike',
            icon: '⚔️',
            lens: 'hybrid',
            stain: 'morphology',
            description: 'Predatory crimson siphon ray puncturing prey membrane, surrounded by fluid syncytial envelopes of both combatants.'
          },
          {
            id: 'pred-plasmodium',
            label: 'Viscous Engulfment',
            icon: '🌊',
            lens: 'plasmodium',
            stain: 'morphology',
            description: 'Viscous slime hull of hunting heterotroph enveloping prey pore during enzymatic contact lysis.'
          },
          {
            id: 'pred-potential',
            label: 'Electrochemical Drain',
            icon: '⚡',
            lens: 'potential',
            stain: 'battery',
            description: 'Rapid collapse of prey bio-potential field as free energy tokens are drained across the predatory contact junction.'
          },
          {
            id: 'pred-vascular',
            label: 'Siphon Vasculature',
            icon: '🩸',
            lens: 'vascular',
            stain: 'vascular',
            description: 'Vascular conduits rapidly redistributing captured enthalpy from lysis site across the predator syncytium.'
          }
        ],
        recommendedOverlays: {
          trophicRays: true,
          speciesBadges: false,
          slimeStreaming: false,
          ghostTrails: false
        },
        dynamicCameraFollow: true
      });
    }

    // -----------------------------------------------------------------------
    // Stop Candidate 4: Detrital Scavenging & Necromass Recycling
    // -----------------------------------------------------------------------
    let scavengeFrameIdx = -1;
    let scavengeRay = null;

    for (let i = 0; i < count; i++) {
      const f = allFrames[i];
      const sRay = f.trophicRays.find(r => r.type === 'scavenge');
      if (sRay) {
        scavengeFrameIdx = i;
        scavengeRay = sRay;
        break;
      }
    }

    if (scavengeRay && scavengeFrameIdx !== -1) {
      const startIdx = Math.max(0, scavengeFrameIdx - 5);
      const endIdx = Math.min(count - 1, scavengeFrameIdx + 12);

      stops.push({
        id: 'stop-scavenge',
        category: 'DETRITAL_SCAVENGING',
        badge: 'NECROMASS RECYCLING',
        badgeColor: '#eab308',
        icon: '🦴',
        title: 'Detrital Necromass Scavenging',
        subtitle: `Benthic scavenger vacuuming carcass at (${scavengeRay.targetCoord.q}, ${scavengeRay.targetCoord.r})`,
        narrative: `When silicoids perish through senescence or predation, their structural shells form detrital carcasses. Evolved scavengers detect nearby detritus and project golden catabolic absorption rays, vacuuming biomass tokens back into the living biosphere to prevent sedimentation loss.`,
        targetCoord: scavengeRay.sourceCoord,
        cameraDistance: 7.5,
        cameraElevation: 0.7,
        startTick: allFrames[startIdx].tick,
        endTick: allFrames[endIdx].tick,
        startFrameIndex: startIdx,
        endFrameIndex: endIdx,
        focalFrameIndex: scavengeFrameIdx,
        recommendedStain: 'morphology',
        recommendedLens: 'vascular',
        aspectOptions: [
          {
            id: 'scav-vascular',
            label: 'Catabolic Conduit Siphon',
            icon: '🦴',
            lens: 'vascular',
            stain: 'morphology',
            description: 'Golden detrital vacuum rays funneling decomposed necro-matter through vascular streaming conduits.'
          },
          {
            id: 'scav-lattice',
            label: 'Carcass Skeleton',
            icon: '💀',
            lens: 'lattice',
            stain: 'morphology',
            description: 'Vacated mineral pore skeleton of expired organism undergoing catabolic enzyme breakdown.'
          },
          {
            id: 'scav-potential',
            label: 'Necro-Energy Recycling',
            icon: '🔋',
            lens: 'potential',
            stain: 'battery',
            description: 'Biomass energy recovery replenishing scavenger battery reserves to prevent sedimentation loss.'
          },
          {
            id: 'scav-plasmodium',
            label: 'Scavenger Slime Creep',
            icon: '🌊',
            lens: 'plasmodium',
            stain: 'vascular',
            description: 'Bio-smoothed scavenger plasmodium engulfing detrital residue along basalt crevices.'
          }
        ],
        recommendedOverlays: {
          trophicRays: true,
          speciesBadges: false,
          slimeStreaming: false
        },
        dynamicCameraFollow: false
      });
    }

    // -----------------------------------------------------------------------
    // Stop Candidate 5: Hydrothermal Vent Autotrophy & Catalytic Influx
    // -----------------------------------------------------------------------
    let ventFeedFrameIdx = -1;
    let ventFeedRay = null;

    for (let i = 0; i < count; i++) {
      const f = allFrames[i];
      const vRay = f.trophicRays.find(r => r.type === 'vent_feed');
      if (vRay) {
        ventFeedFrameIdx = i;
        ventFeedRay = vRay;
        break;
      }
    }

    if (ventFeedRay && ventFeedFrameIdx !== -1) {
      const startIdx = Math.max(0, ventFeedFrameIdx - 8);
      const endIdx = Math.min(count - 1, ventFeedFrameIdx + 15);
      const ventNozzle = allFrames[ventFeedFrameIdx].vent.nozzleCoord;

      stops.push({
        id: 'stop-autotrophy',
        category: 'VENT_AUTOTROPHY',
        badge: 'CHEMIOSMOTIC INFLUX',
        badgeColor: '#06b6d4',
        icon: '⚡',
        title: 'Chemiosmotic Primary Production',
        subtitle: `Trophocytes feeding on Hydrothermal Plume at (${ventNozzle.q}, ${ventNozzle.r})`,
        narrative: `Witness primary abiogenic energy harvesting. Autotrophic silicoids stationed near the hydrothermal chimney absorb dissolved chemical potential from fluid redox gradients. Glowing cyan influx rays connect active catalytic trophocytes directly to the vent nozzle, charging batteries up to 100 mV.`,
        targetCoord: ventNozzle,
        cameraDistance: 10.5,
        cameraElevation: 0.8,
        startTick: allFrames[startIdx].tick,
        endTick: allFrames[endIdx].tick,
        startFrameIndex: startIdx,
        endFrameIndex: endIdx,
        focalFrameIndex: ventFeedFrameIdx,
        recommendedStain: 'battery',
        recommendedLens: 'potential',
        aspectOptions: [
          {
            id: 'auto-potential',
            label: 'Chemiosmotic Fountain',
            icon: '⚡',
            lens: 'potential',
            stain: 'battery',
            description: 'Abiotic redox plume charging autotroph batteries up to 100 mV through catalytic electron transport.'
          },
          {
            id: 'auto-vascular',
            label: 'Plume Conduit Stream',
            icon: '🌊',
            lens: 'vascular',
            stain: 'battery',
            description: 'Vascular conduits and streaming chevrons channeling absorbed enthalpy outward to peripheral cells.'
          },
          {
            id: 'auto-lattice-grn',
            label: 'Nozzle Trophocytes',
            icon: '🌾',
            lens: 'lattice',
            stain: 'grn',
            description: 'Catalytic feeding trophocytes stationed on the hydrothermal nozzle lip expressing chemiosmotic operons.'
          },
          {
            id: 'auto-plasmodium',
            label: 'Hydrothermal Mat',
            icon: '🌿',
            lens: 'plasmodium',
            stain: 'morphology',
            description: 'Lush bio-smoothed syncytial blanket capping the thermal chimney spire.'
          }
        ],
        recommendedOverlays: {
          trophicRays: true,
          speciesBadges: false,
          slimeStreaming: false
        },
        dynamicCameraFollow: false
      });
    }

    // -----------------------------------------------------------------------
    // Stop Candidate 6: Geodynamic Crisis & Thermal/Toxic Evasion
    // -----------------------------------------------------------------------
    let crisisFrameIdx = -1;
    let crisisEventName = '';

    for (let i = 0; i < count; i++) {
      const f = allFrames[i];
      if (f.environmentalEvent && (
        f.environmentalEvent.includes('Boiling') ||
        f.environmentalEvent.includes('Thermal') ||
        f.environmentalEvent.includes('Toxin') ||
        f.environmentalEvent.includes('Avulsion')
      )) {
        crisisFrameIdx = i;
        crisisEventName = f.environmentalEvent;
        break;
      }
    }

    if (crisisFrameIdx !== -1) {
      const startIdx = Math.max(0, crisisFrameIdx - 10);
      const endIdx = Math.min(count - 1, crisisFrameIdx + 20);
      const ventNozzle = allFrames[crisisFrameIdx].vent.nozzleCoord;

      stops.push({
        id: 'stop-crisis',
        category: 'GEODYNAMIC_CRISIS',
        badge: 'GEODYNAMIC SHOCK',
        badgeColor: '#f97316',
        icon: '🌋',
        title: 'Environmental Crisis & Selective Bottleneck',
        subtitle: `${crisisEventName}`,
        narrative: `A major geodynamic episode challenges the ecosystem. Subterranean magma surges elevate thermal flux above 350°C or discharge heavy metal toxin plumes. Watch unshielded organisms suffer corrosive Landauer leaks while adapted lineages engage in thermal evasion cleavage away from the orifice.`,
        targetCoord: ventNozzle,
        cameraDistance: 13.0,
        cameraElevation: 0.85,
        startTick: allFrames[startIdx].tick,
        endTick: allFrames[endIdx].tick,
        startFrameIndex: startIdx,
        endFrameIndex: endIdx,
        focalFrameIndex: crisisFrameIdx,
        recommendedStain: 'vascular',
        recommendedLens: 'potential',
        aspectOptions: [
          {
            id: 'crisis-potential',
            label: 'Thermal Shock Field',
            icon: '🌋',
            lens: 'potential',
            stain: 'battery',
            description: 'Extreme geothermal temperature surge and toxic chemical gradients testing cellular homeostasis.'
          },
          {
            id: 'crisis-vascular',
            label: 'Evasive Fluid Streaming',
            icon: '⚡',
            lens: 'vascular',
            stain: 'vascular',
            description: 'High-velocity directional cytoplasm streaming away from superheated vent fissures toward cooler depths.'
          },
          {
            id: 'crisis-plasmodium',
            label: 'Stress Cleavage',
            icon: '🌊',
            lens: 'plasmodium',
            stain: 'morphology',
            description: 'Dynamic contractile deformation and apoptotic cleavage as colonies fragment to avoid lethal shock.'
          },
          {
            id: 'crisis-lattice',
            label: 'Surviving Pores',
            icon: '🛡️',
            lens: 'lattice',
            stain: 'battery',
            description: 'Hexagonal porin grid highlighting insulated cells with sufficient battery reserves to withstand the crisis.'
          }
        ],
        recommendedOverlays: {
          trophicRays: true,
          speciesBadges: false,
          slimeStreaming: true,
          apoptosisHalos: true
        },
        dynamicCameraFollow: false
      });
    }

    // -----------------------------------------------------------------------
    // Stop Candidate 7: Refractory Substrate C Catabolism (Lenski Cit+ Breakthrough)
    // -----------------------------------------------------------------------
    let citBody: IKinematicBody | null = null;
    let citCell: IKinematicCellSnapshot | null = null;
    let citFrameIdx = -1;

    for (let i = count - 1; i >= 0; i--) {
      const f = allFrames[i];
      for (const b of f.bodies) {
        const found = b.cells.find(c =>
          c.gateTypes.includes('PORIN_STREAM_C') ||
          c.gateTypes.some(g => g.toLowerCase().includes('stream_c')) ||
          b.speciesName.toLowerCase().includes('lenskii')
        );
        if (found) {
          citBody = b;
          citCell = found;
          citFrameIdx = i;
          break;
        }
      }
      if (citBody) break;
    }

    if (citBody && citCell && citFrameIdx !== -1) {
      const startIdx = Math.max(0, citFrameIdx - 8);
      const endIdx = Math.min(count - 1, citFrameIdx + 15);

      stops.push({
        id: 'stop-lenski-cit',
        category: 'LENSKI_CIT_BREAKTHROUGH',
        badge: 'LENSKI CIT⁺',
        badgeColor: '#06b6d4',
        icon: '🧪',
        title: 'Substrate C Catabolism (Lenski Cit⁺ Mutation)',
        subtitle: `Specimen ${citBody.speciesName} utilizing Refractory Substrate C at (${citCell.coord.q}, ${citCell.coord.r})`,
        narrative: `A historic breakthrough in molecular evolution mirroring Richard Lenski's Long-Term Evolution Experiment (LTEE Cit⁺ innovation)! By synthesizing specialized secondary porins (PORIN_STREAM_C), this lineage metabolizes refractory Substrate C for a potent +3 net energy yield, breaking free from primary nutrient scarcity through allosteric Operon regulation.`,
        targetCoord: citCell.coord,
        cameraDistance: 7.5,
        cameraElevation: 0.72,
        startTick: allFrames[startIdx].tick,
        endTick: allFrames[endIdx].tick,
        startFrameIndex: startIdx,
        endFrameIndex: endIdx,
        focalFrameIndex: citFrameIdx,
        recommendedStain: 'battery',
        recommendedLens: 'potential',
        aspectOptions: [
          {
            id: 'cit-potential',
            label: 'Substrate C Metabolic Plume',
            icon: '⚡',
            lens: 'potential',
            stain: 'battery',
            description: 'Potent chemiosmotic battery charging (+3 tokens) fueled by refractory Substrate C catabolism.'
          },
          {
            id: 'cit-lattice-grn',
            label: 'Operon Gated Influx Porin',
            icon: '🔬',
            lens: 'lattice',
            stain: 'grn',
            description: 'Hexagonal porin channel expressing active Operon gates for Substrate C membrane transport.'
          },
          {
            id: 'cit-vascular',
            label: 'Enthalpy Conduit Flow',
            icon: '🌊',
            lens: 'vascular',
            stain: 'vascular',
            description: 'Vascular conduits channeling liberated Substrate C enthalpy outward across neighboring syncytial cells.'
          },
          {
            id: 'cit-plasmodium',
            label: 'Citratovibrio Colony',
            icon: '🌿',
            lens: 'plasmodium',
            stain: 'morphology',
            description: 'Flourishing bio-smoothed syncytial plasmodium thriving in zones where refractory nutrients concentrate.'
          }
        ],
        recommendedOverlays: {
          trophicRays: true,
          slimeStreaming: true,
          ghostTrails: true
        },
        pinnedBodyId: citBody.bodyId,
        pinnedCladeId: citBody.cladeId,
        dynamicCameraFollow: true
      });
    }

    // -----------------------------------------------------------------------
    // Stop Candidate 8: Siderophore Mineral Chelation & Basalt Solubilization
    // -----------------------------------------------------------------------
    let chelBody: IKinematicBody | null = null;
    let chelCell: IKinematicCellSnapshot | null = null;
    let chelFrameIdx = -1;

    for (let i = count - 1; i >= 0; i--) {
      const f = allFrames[i];
      const chelRay = f.trophicRays.find(r => r.type === 'chelation');
      if (chelRay) {
        chelFrameIdx = i;
        for (const b of f.bodies) {
          const match = b.cells.find(c => c.coord.equals(chelRay.sourceCoord));
          if (match) {
            chelBody = b;
            chelCell = match;
            break;
          }
        }
        if (chelBody) break;
      }
      for (const b of f.bodies) {
        const found = b.cells.find(c =>
          (c.chelator !== undefined && c.chelator > 0) ||
          c.gateTypes.includes('SECRETION_CHELATOR') ||
          b.speciesName.toLowerCase().includes('neilsonii')
        );
        if (found) {
          chelBody = b;
          chelCell = found;
          chelFrameIdx = i;
          break;
        }
      }
      if (chelBody) break;
    }

    if (chelBody && chelCell && chelFrameIdx !== -1) {
      const startIdx = Math.max(0, chelFrameIdx - 6);
      const endIdx = Math.min(count - 1, chelFrameIdx + 14);

      stops.push({
        id: 'stop-siderophore-chelation',
        category: 'SIDEROPHORE_CHELATION',
        badge: 'MINERAL CHELATION',
        badgeColor: '#f59e0b',
        icon: '⛏️',
        title: 'Siderophore Mineral Solubilization',
        subtitle: `Specimen ${chelBody.speciesName} solubilizing solid basalt rock at (${chelCell.coord.q}, ${chelCell.coord.r})`,
        narrative: `Biological mineral mining in action! Grounded in J.B. Neilands' discovery of microbial siderophores, this organism secretes high-affinity chelators into the mineral substrate. Chelators solubilize solid basalt rock, releasing +1 inorganic matter token directly into the cell while strictly conserving closed-universe mass (ΔM ≡ 0.000).`,
        targetCoord: chelCell.coord,
        cameraDistance: 7.5,
        cameraElevation: 0.70,
        startTick: allFrames[startIdx].tick,
        endTick: allFrames[endIdx].tick,
        startFrameIndex: startIdx,
        endFrameIndex: endIdx,
        focalFrameIndex: chelFrameIdx,
        recommendedStain: 'morphology',
        recommendedLens: 'vascular',
        aspectOptions: [
          {
            id: 'chel-vascular',
            label: 'Chelator Excretion Halo',
            icon: '⛏️',
            lens: 'vascular',
            stain: 'morphology',
            description: 'Extracellular halo of secreted siderophores dissolving solid basalt bedrock into bioavailable matter.'
          },
          {
            id: 'chel-lattice',
            label: 'Solubilized Basalt Grid',
            icon: '🔬',
            lens: 'lattice',
            stain: 'morphology',
            description: 'Discrete hexagonal chamber displaying active mineral chelation and structural mass synthesis.'
          },
          {
            id: 'chel-potential',
            label: 'Lithotrophic Kinetics',
            icon: '🔋',
            lens: 'potential',
            stain: 'battery',
            description: 'Thermodynamic investment in secretion repaid by continuous matter capture for cell division.'
          },
          {
            id: 'chel-plasmodium',
            label: 'Lithotrophic Slime Hull',
            icon: '🌿',
            lens: 'plasmodium',
            stain: 'vascular',
            description: 'Bio-smoothed syncytial blanket anchoring firmly to freshly etched basalt surfaces.'
          }
        ],
        recommendedOverlays: {
          trophicRays: true,
          slimeStreaming: false,
          ghostTrails: true
        },
        pinnedBodyId: chelBody.bodyId,
        pinnedCladeId: chelBody.cladeId,
        dynamicCameraFollow: true
      });
    }

    // -----------------------------------------------------------------------
    // Stop Candidate 9: Viscoelastic Biofilm Matrix & EPS Shear Shield
    // -----------------------------------------------------------------------
    let epsBody: IKinematicBody | null = null;
    let epsCell: IKinematicCellSnapshot | null = null;
    let epsFrameIdx = -1;

    for (let i = count - 1; i >= 0; i--) {
      const f = allFrames[i];
      for (const b of f.bodies) {
        const found = b.cells.find(c =>
          (c.eps !== undefined && c.eps > 0) ||
          c.gateTypes.includes('SECRETION_EPS') ||
          b.speciesName.toLowerCase().includes('costertonii')
        );
        if (found) {
          epsBody = b;
          epsCell = found;
          epsFrameIdx = i;
          break;
        }
      }
      if (epsBody) break;
    }

    if (epsBody && epsCell && epsFrameIdx !== -1) {
      const startIdx = Math.max(0, epsFrameIdx - 8);
      const endIdx = Math.min(count - 1, epsFrameIdx + 16);

      stops.push({
        id: 'stop-biofilm-eps',
        category: 'BIOFILM_EPS_MATRIX',
        badge: 'BIOFILM EPS MATRIX',
        badgeColor: '#10b981',
        icon: '🛡️',
        title: 'Extracellular Polymeric Matrix (Biofilm Shield)',
        subtitle: `Colony ${epsBody.speciesName} producing protective EPS matrix at (${epsCell.coord.q}, ${epsCell.coord.r})`,
        narrative: `Rooted in Bill Costerton's microbial biofilm paradigm, this syncytial colony secretes high-molecular-weight exopolysaccharides (EPS). The viscoelastic slime matrix diffuses across neighboring pores, forming a collective protective hydrogel that dampens hydrodynamic shear, resists thermal boiling shocks, and fortifies the colony against predatory breaches.`,
        targetCoord: epsCell.coord,
        cameraDistance: 8.0,
        cameraElevation: 0.75,
        startTick: allFrames[startIdx].tick,
        endTick: allFrames[endIdx].tick,
        startFrameIndex: startIdx,
        endFrameIndex: endIdx,
        focalFrameIndex: epsFrameIdx,
        recommendedStain: 'morphology',
        recommendedLens: 'plasmodium',
        aspectOptions: [
          {
            id: 'eps-plasmodium',
            label: 'Viscoelastic Slime Blanket',
            icon: '🛡️',
            lens: 'plasmodium',
            stain: 'morphology',
            description: 'Dense exopolysaccharide hydrogel shielding multicellular clusters from hydrodynamic detachment.'
          },
          {
            id: 'eps-vascular',
            label: 'Inter-Pore Glycocalyx Diffusion',
            icon: '⚡',
            lens: 'vascular',
            stain: 'vascular',
            description: 'Vascular conduits and extracellular matrix diffusion dispersing EPS across pore boundaries.'
          },
          {
            id: 'eps-potential',
            label: 'Shear Stress Damping',
            icon: '🔋',
            lens: 'potential',
            stain: 'battery',
            description: 'Stabilized membrane voltage potential shielded from turbulent thermal and convective fluctuations.'
          },
          {
            id: 'eps-lattice',
            label: 'Fortified Pore Fortress',
            icon: '🔬',
            lens: 'lattice',
            stain: 'grn',
            description: 'Cellular chambers actively expressing EPS operon cassettes to reinforce communal boundaries.'
          }
        ],
        recommendedOverlays: {
          slimeStreaming: true,
          trophicRays: true,
          ghostTrails: true
        },
        pinnedBodyId: epsBody.bodyId,
        pinnedCladeId: epsBody.cladeId,
        dynamicCameraFollow: true
      });
    }

    // -----------------------------------------------------------------------
    // Stop Candidate 10: Direct Interspecies Electron Transfer & DIET Syntrophy
    // -----------------------------------------------------------------------
    let synRay: ITrophicRay | null = null;
    let synBody: IKinematicBody | null = null;
    let synFrameIdx = -1;

    for (let i = count - 1; i >= 0; i--) {
      const f = allFrames[i];
      const matchRay = f.trophicRays.find(r => r.type === 'syntrophy');
      if (matchRay) {
        synRay = matchRay;
        synFrameIdx = i;
        synBody = f.bodies.find(b => b.cells.some(c => c.coord.equals(matchRay.sourceCoord))) || null;
        break;
      }
      for (const b of f.bodies) {
        if (b.speciesName.toLowerCase().includes('westii') || b.speciesName.toLowerCase().includes('lovleyi')) {
          synBody = b;
          synFrameIdx = i;
          break;
        }
      }
      if (synBody) break;
    }

    if (synFrameIdx !== -1 && (synRay || synBody)) {
      const startIdx = Math.max(0, synFrameIdx - 6);
      const endIdx = Math.min(count - 1, synFrameIdx + 14);
      const targetCoord = synRay ? synRay.sourceCoord : (synBody?.cells[0]?.coord ?? new HexCoord3D(0, 0, 0));

      stops.push({
        id: 'stop-paracrine-syntrophy',
        category: 'PARACRINE_SYNTROPHY',
        badge: 'SYNTROPHIC DIET',
        badgeColor: '#a855f7',
        icon: '⚡',
        title: 'Direct Interspecies Electron Transfer (DIET)',
        subtitle: `Syntrophic electron cross-feeding at (${targetCoord.q}, ${targetCoord.r})`,
        narrative: `Mirroring Derek Lovley's Direct Interspecies Electron Transfer (DIET) and Stuart West's evolutionary biology, mutualistic partner cells establish conductive biocircuit bridges. Donor cells at elevated battery voltage conduit exactly 2 tokens to neighboring partners without dissipation leaks (ΔE ≡ 0.000), sustaining mutualistic multi-lineage survival across nutrient bottlenecks.`,
        targetCoord,
        cameraDistance: 7.5,
        cameraElevation: 0.70,
        startTick: allFrames[startIdx].tick,
        endTick: allFrames[endIdx].tick,
        startFrameIndex: startIdx,
        endFrameIndex: endIdx,
        focalFrameIndex: synFrameIdx,
        recommendedStain: 'battery',
        recommendedLens: 'vascular',
        aspectOptions: [
          {
            id: 'syn-vascular',
            label: 'Conductive DIET Nanowires',
            icon: '⚡',
            lens: 'vascular',
            stain: 'battery',
            description: 'Vascular biocircuit conduits transferring conserved electron tokens between mutualistic partners.'
          },
          {
            id: 'syn-potential',
            label: 'Conserved Bio-Potential Balance',
            icon: '🔋',
            lens: 'potential',
            stain: 'battery',
            description: 'Continuous electrochemical balance preventing local starvation and tragedy of the commons.'
          },
          {
            id: 'syn-hybrid',
            label: 'Mutualistic Conduit Junction',
            icon: '✨',
            lens: 'hybrid',
            stain: 'morphology',
            description: 'Close contact zone between cooperating cells rendered with bio-smoothed syncytial boundaries.'
          },
          {
            id: 'syn-lattice',
            label: 'Paracrine Partner Pores',
            icon: '🔬',
            lens: 'lattice',
            stain: 'grn',
            description: 'Hexagonal porin chambers coordinating mutualistic metabolic exchange across distinct genomes.'
          }
        ],
        recommendedOverlays: {
          trophicRays: true,
          slimeStreaming: false,
          ghostTrails: true
        },
        pinnedBodyId: synBody?.bodyId,
        pinnedCladeId: synBody?.cladeId,
        dynamicCameraFollow: true
      });
    }

    // -----------------------------------------------------------------------
    // Stop Candidate 11: Vampiric Kleptoplasty & Organelle Robbery
    // -----------------------------------------------------------------------
    let kleptoRay: ITrophicRay | null = null;
    let kleptoBody: IKinematicBody | null = null;
    let kleptoFrameIdx = -1;

    for (let i = count - 1; i >= 0; i--) {
      const f = allFrames[i];
      const matchRay = f.trophicRays.find(r => r.type === 'kleptoplasty');
      if (matchRay) {
        kleptoRay = matchRay;
        kleptoFrameIdx = i;
        kleptoBody = f.bodies.find(b => b.cells.some(c => c.coord.equals(matchRay.sourceCoord))) || null;
        break;
      }
      for (const b of f.bodies) {
        if (b.speciesName.toLowerCase().includes('schnepfii') || b.cells.some(c => c.hasOrganelle && c.gateTypes.some(g => g.includes('PRED') || g.includes('XOR')))) {
          kleptoBody = b;
          kleptoFrameIdx = i;
          break;
        }
      }
      if (kleptoBody) break;
    }

    if (kleptoFrameIdx !== -1 && (kleptoRay || kleptoBody)) {
      const startIdx = Math.max(0, kleptoFrameIdx - 6);
      const endIdx = Math.min(count - 1, kleptoFrameIdx + 14);
      const targetCoord = kleptoRay ? kleptoRay.sourceCoord : (kleptoBody?.cells[0]?.coord ?? new HexCoord3D(0, 0, 0));

      stops.push({
        id: 'stop-vampiric-kleptoplasty',
        category: 'VAMPIRIC_KLEPTOPLASTY',
        badge: 'KLEPTOPLASTY',
        badgeColor: '#ec4899',
        icon: '🧛',
        title: 'Vampiric Kleptoplasty & Organelle Robbery',
        subtitle: `Predator ${kleptoBody?.speciesName ?? 'Vampirotheke'} assimilating intact metabolic cassette at (${targetCoord.q}, ${targetCoord.r})`,
        narrative: `Discovered in predatory ciliates and dinoflagellates by Eberhard Schnepf, kleptoplasty allows predatory silicoids to strike adjacent prey pores, lyse the host membrane, and spare intact metabolic cassettes. Rather than digesting captured organelles, the predator incorporates the functional biocircuit into its own cytoplasm, instantly acquiring novel catalytic capabilities.`,
        targetCoord,
        cameraDistance: 7.0,
        cameraElevation: 0.70,
        startTick: allFrames[startIdx].tick,
        endTick: allFrames[endIdx].tick,
        startFrameIndex: startIdx,
        endFrameIndex: endIdx,
        focalFrameIndex: kleptoFrameIdx,
        recommendedStain: 'grn',
        recommendedLens: 'hybrid',
        aspectOptions: [
          {
            id: 'klepto-hybrid',
            label: 'Vampiric Strike & Siphon',
            icon: '🧛',
            lens: 'hybrid',
            stain: 'morphology',
            description: 'Predatory neon laser strike puncturing prey and sequestering functional organelle cassettes intact.'
          },
          {
            id: 'klepto-vascular',
            label: 'Organelle Translocation',
            icon: '⚡',
            lens: 'vascular',
            stain: 'vascular',
            description: 'Vascular conduits shuttling captured organelle biocircuits into the predator cytoplasm.'
          },
          {
            id: 'klepto-potential',
            label: 'Assimilated Catalytic Potential',
            icon: '🔋',
            lens: 'potential',
            stain: 'battery',
            description: 'Instant boost to cellular battery potential upon integration of stolen metabolic machinery.'
          },
          {
            id: 'klepto-lattice',
            label: 'Sequestrated Cassette Architecture',
            icon: '🔬',
            lens: 'lattice',
            stain: 'grn',
            description: 'Hexagonal porin chamber harboring newly integrated endosymbiotic organelle operons.'
          }
        ],
        recommendedOverlays: {
          trophicRays: true,
          slimeStreaming: false,
          ghostTrails: true
        },
        pinnedBodyId: kleptoBody?.bodyId,
        pinnedCladeId: kleptoBody?.cladeId,
        dynamicCameraFollow: true
      });
    }

    // -----------------------------------------------------------------------
    // Stop Candidate 12: Predictive Pavlovian Precursor Feedforward Regulation (Proto-Cognition)
    // -----------------------------------------------------------------------
    let pavlovBody: IKinematicBody | null = null;
    let pavlovCell: IKinematicCellSnapshot | null = null;
    let pavlovFrameIdx = -1;

    for (let i = 0; i < count; i++) {
      const f = allFrames[i];
      for (const b of f.bodies) {
        for (const c of b.cells) {
          if (!c.tapeBitstring) continue;
          const ws = PoreWorkshop.fromBitstring(c.tapeBitstring);
          const motifs = MotifScanner.scanWorkshop(ws).map(m => m.motif.type);
          if (motifs.includes(MotifType.PREDICTIVE_PAVLOVIAN) || (ws.hasBaroAcoustic() && ws.hasAllostericRegulationCapability())) {
            pavlovBody = b;
            pavlovCell = c;
            pavlovFrameIdx = i;
            break;
          }
        }
        if (pavlovBody) break;
      }
      if (pavlovBody) break;
    }

    if (pavlovBody && pavlovCell && pavlovFrameIdx !== -1) {
      const startIdx = Math.max(0, pavlovFrameIdx - 6);
      const endIdx = Math.min(count - 1, pavlovFrameIdx + 14);

      stops.push({
        id: 'stop-predictive-pavlovian',
        category: 'PREDICTIVE_PAVLOVIAN',
        badge: 'PAVLOVIAN SHIELD',
        badgeColor: '#ec4899',
        icon: '🔮',
        title: 'Predictive Pavlovian Precursor Anticipation',
        subtitle: `Specimen ${pavlovBody.speciesName} deploying acoustic feedforward shield at (${pavlovCell.coord.q}, ${pavlovCell.coord.r})`,
        narrative: `Witness proto-cognitive anticipatory regulation! Grounded in Saeed Tavazoie and Ilias Tagkopoulos's discovery of predictive gene regulatory networks in fluctuating environments, this lineage anticipates lethal volcanic or acid shocks. Upon detecting acoustic or barometric precursor micro-tremors (PORIN_BARO_ACOUSTIC), its internal feedforward biocircuit inverts and activates protective shields ticks before the lethal thermal eruption arrives.`,
        targetCoord: pavlovCell.coord,
        cameraDistance: 7.5,
        cameraElevation: 0.72,
        startTick: allFrames[startIdx].tick,
        endTick: allFrames[endIdx].tick,
        startFrameIndex: startIdx,
        endFrameIndex: endIdx,
        focalFrameIndex: pavlovFrameIdx,
        recommendedStain: 'grn',
        recommendedLens: 'potential',
        aspectOptions: [
          {
            id: 'pavlov-potential',
            label: 'Feedforward Morphogen Field',
            icon: '🔮',
            lens: 'potential',
            stain: 'grn',
            description: 'Continuous operon expression heatmap displaying early activation of anticipatory defense.'
          },
          {
            id: 'pavlov-lattice',
            label: 'Acoustic Receptor Network',
            icon: '🔬',
            lens: 'lattice',
            stain: 'grn',
            description: 'Hexagonal porin chambers transducing baro-acoustic precursor vibrations.'
          },
          {
            id: 'pavlov-vascular',
            label: 'Precursor Influx Conduits',
            icon: '⚡',
            lens: 'vascular',
            stain: 'vascular',
            description: 'Vascular streaming conduits channeling protective allosteric signals across the tissue.'
          },
          {
            id: 'pavlov-battery',
            label: 'Preserved Energy Reserve',
            icon: '🔋',
            lens: 'plasmodium',
            stain: 'battery',
            description: 'Intact cellular battery potential preserved throughout the volcanic surge.'
          }
        ],
        recommendedOverlays: {
          trophicRays: true,
          slimeStreaming: true,
          ghostTrails: true
        },
        pinnedBodyId: pavlovBody.bodyId,
        pinnedCladeId: pavlovBody.cladeId,
        dynamicCameraFollow: true
      });
    }

    // -----------------------------------------------------------------------
    // Stop Candidate 13: 6-State Traveling-Wave Biological Clock
    // -----------------------------------------------------------------------
    let ringBody: IKinematicBody | null = null;
    let ringCell: IKinematicCellSnapshot | null = null;
    let ringFrameIdx = -1;

    for (let i = 0; i < count; i++) {
      const f = allFrames[i];
      for (const b of f.bodies) {
        for (const c of b.cells) {
          if (!c.tapeBitstring) continue;
          const ws = PoreWorkshop.fromBitstring(c.tapeBitstring);
          const motifs = MotifScanner.scanWorkshop(ws).map(m => m.motif.type);
          if (motifs.includes(MotifType.RING_OSCILLATOR) || motifs.includes(MotifType.ENTRAINED_PACEMAKER) || c.gateTypes.filter(t => t === 'GATE_NOT').length >= 3) {
            ringBody = b;
            ringCell = c;
            ringFrameIdx = i;
            break;
          }
        }
        if (ringBody) break;
      }
      if (ringBody) break;
    }

    if (ringBody && ringCell && ringFrameIdx !== -1) {
      const startIdx = Math.max(0, ringFrameIdx - 6);
      const endIdx = Math.min(count - 1, ringFrameIdx + 14);

      stops.push({
        id: 'stop-ring-oscillator-clock',
        category: 'RING_OSCILLATOR_CLOCK',
        badge: 'CIRCADIAN PACEMAKER',
        badgeColor: '#38bdf8',
        icon: '⏱️',
        title: '6-State Traveling-Wave Biological Clock',
        subtitle: `Specimen ${ringBody.speciesName} oscillating endogenous 2N traveling wave at (${ringCell.coord.q}, ${ringCell.coord.r})`,
        narrative: `A living chronometer! Grounded in the Elowitz-Leibler synthetic repressilator and cyanobacterial KaiABC circadian oscillators, this organism evolved a contiguous odd run of inverters. Operating with authentic 1-tick delay physics, the signal cascades through a 6-state traveling wave ([100] -> [101] -> [001] -> [011] -> [010] -> [110]), providing endogenous metabolic pacing synchronized with hydrothermal fluid harmonics.`,
        targetCoord: ringCell.coord,
        cameraDistance: 6.5,
        cameraElevation: 0.70,
        startTick: allFrames[startIdx].tick,
        endTick: allFrames[endIdx].tick,
        startFrameIndex: startIdx,
        endFrameIndex: endIdx,
        focalFrameIndex: ringFrameIdx,
        recommendedStain: 'grn',
        recommendedLens: 'potential',
        aspectOptions: [
          {
            id: 'ring-potential',
            label: 'Traveling Wave Phase Loop',
            icon: '⏱️',
            lens: 'potential',
            stain: 'grn',
            description: 'Continuous potential field capturing the cyclical traveling wave across inverter stages.'
          },
          {
            id: 'ring-vascular',
            label: 'Inverter Ring Vasculature',
            icon: '⚡',
            lens: 'vascular',
            stain: 'vascular',
            description: 'Cyclic vascular loop routing phase-delayed signals through cellular conduits.'
          },
          {
            id: 'ring-lattice',
            label: '3-Phase Porin Stages',
            icon: '🔬',
            lens: 'lattice',
            stain: 'grn',
            description: 'Discrete porin channels alternating logic output states around the closed loop.'
          },
          {
            id: 'ring-plasmodium',
            label: 'Pulsing Plasmodial Pacemaker',
            icon: '🌊',
            lens: 'plasmodium',
            stain: 'morphology',
            description: 'Rhythmic contractile pulses generated by the internal ring oscillator.'
          }
        ],
        recommendedOverlays: {
          trophicRays: true,
          ghostTrails: true
        },
        pinnedBodyId: ringBody.bodyId,
        pinnedCladeId: ringBody.cladeId,
        dynamicCameraFollow: true
      });
    }

    // -----------------------------------------------------------------------
    // Stop Candidate 14: Cellular Working Memory (SR Latch Hysteresis)
    // -----------------------------------------------------------------------
    let latchBody: IKinematicBody | null = null;
    let latchCell: IKinematicCellSnapshot | null = null;
    let latchFrameIdx = -1;

    for (let i = 0; i < count; i++) {
      const f = allFrames[i];
      for (const b of f.bodies) {
        for (const c of b.cells) {
          if (!c.tapeBitstring) continue;
          const ws = PoreWorkshop.fromBitstring(c.tapeBitstring);
          const motifs = MotifScanner.scanWorkshop(ws).map(m => m.motif.type);
          if (motifs.includes(MotifType.BISTABLE_LATCH) || (c.gateTypes.includes('GATE_AND') && c.gateTypes.includes('GATE_OR') && c.gateCount === 2)) {
            latchBody = b;
            latchCell = c;
            latchFrameIdx = i;
            break;
          }
        }
        if (latchBody) break;
      }
      if (latchBody) break;
    }

    if (latchBody && latchCell && latchFrameIdx !== -1) {
      const startIdx = Math.max(0, latchFrameIdx - 6);
      const endIdx = Math.min(count - 1, latchFrameIdx + 14);

      stops.push({
        id: 'stop-bistable-latch-memory',
        category: 'BISTABLE_LATCH_MEMORY',
        badge: '1-BIT MEMORY LATCH',
        badgeColor: '#8b5cf6',
        icon: '🔒',
        title: 'Cellular Working Memory (SR Latch Hysteresis)',
        subtitle: `Specimen ${latchBody.speciesName} storing 1-bit state across metabolic cycles at (${latchCell.coord.q}, ${latchCell.coord.r})`,
        narrative: `Digital memory in living silicon! Mirroring Tim Gardner and Jim Collins's genetic toggle switch, this organism evolved complementary binary stages forming a Set-Reset bistable latch. When excited by nutrient fuel, it sets to high, holding its memory state through unpowered dark starvation periods until cleared by a reset shock, achieving genuine cellular state retention.`,
        targetCoord: latchCell.coord,
        cameraDistance: 7.0,
        cameraElevation: 0.72,
        startTick: allFrames[startIdx].tick,
        endTick: allFrames[endIdx].tick,
        startFrameIndex: startIdx,
        endFrameIndex: endIdx,
        focalFrameIndex: latchFrameIdx,
        recommendedStain: 'grn',
        recommendedLens: 'lattice',
        aspectOptions: [
          {
            id: 'latch-lattice',
            label: 'Feedback Retention Loop',
            icon: '🔒',
            lens: 'lattice',
            stain: 'grn',
            description: 'Hexagonal pore chamber maintaining active feedback loop across nutrient cycles.'
          },
          {
            id: 'latch-potential',
            label: 'Hysteresis Potential Field',
            icon: '🔋',
            lens: 'potential',
            stain: 'battery',
            description: 'Bistable potential landscape with two stable attractors for Set and Reset states.'
          },
          {
            id: 'latch-vascular',
            label: 'Cross-Coupled Vasculature',
            icon: '⚡',
            lens: 'vascular',
            stain: 'vascular',
            description: 'Vascular biocircuit maintaining cross-coupled gate output retention.'
          },
          {
            id: 'latch-plasmodium',
            label: 'Memory-Directed Plasmodium',
            icon: '🌊',
            lens: 'plasmodium',
            stain: 'morphology',
            description: 'Persistent morphological orientation governed by internal memory state.'
          }
        ],
        recommendedOverlays: {
          trophicRays: true,
          ghostTrails: true
        },
        pinnedBodyId: latchBody.bodyId,
        pinnedCladeId: latchBody.cladeId,
        dynamicCameraFollow: true
      });
    }

    // -----------------------------------------------------------------------
    // Stop Candidate 15: Electro-Mechano Ambush Warfare
    // -----------------------------------------------------------------------
    let ambushBody: IKinematicBody | null = null;
    let ambushCell: IKinematicCellSnapshot | null = null;
    let ambushFrameIdx = -1;

    for (let i = 0; i < count; i++) {
      const f = allFrames[i];
      const pRay = f.trophicRays.find(r => r.type === 'predation');
      if (pRay) {
        for (const b of f.bodies) {
          const striker = b.cells.find(c => c.coord.equals(pRay.sourceCoord));
          if (striker && striker.tapeBitstring) {
            const ws = PoreWorkshop.fromBitstring(striker.tapeBitstring);
            if (ws.hasMechanoTouch() || ws.hasElectroRedox() || striker.gateCount >= 2) {
              ambushBody = b;
              ambushCell = striker;
              ambushFrameIdx = i;
              break;
            }
          }
        }
      }
      if (ambushBody) break;
    }

    if (ambushBody && ambushCell && ambushFrameIdx !== -1) {
      const startIdx = Math.max(0, ambushFrameIdx - 6);
      const endIdx = Math.min(count - 1, ambushFrameIdx + 14);

      stops.push({
        id: 'stop-electro-mechano-ambush',
        category: 'ELECTRO_MECHANO_AMBUSH',
        badge: 'AMBUSH HUNTER',
        badgeColor: '#f43f5e',
        icon: '⚡',
        title: 'Electro-Mechano Ambush Warfare',
        subtitle: `Ambush predator ${ambushBody.speciesName} striking at (${ambushCell.coord.q}, ${ambushCell.coord.r})`,
        narrative: `Predation guided by sensory electro-reception and mechanosensation! This stealth heterotroph sits dormant along basalt crevices until tactile touch (PORIN_MECHANO_TOUCH) or foreign battery redox fields (PORIN_ELECTRO_REDOX) trigger an explosive allosteric cleavage strike, breaching prey membranes and siphoning free energy.`,
        targetCoord: ambushCell.coord,
        cameraDistance: 7.0,
        cameraElevation: 0.70,
        startTick: allFrames[startIdx].tick,
        endTick: allFrames[endIdx].tick,
        startFrameIndex: startIdx,
        endFrameIndex: endIdx,
        focalFrameIndex: ambushFrameIdx,
        recommendedStain: 'morphology',
        recommendedLens: 'hybrid',
        aspectOptions: [
          {
            id: 'ambush-hybrid',
            label: 'Bioelectric Ambush Strike',
            icon: '⚡',
            lens: 'hybrid',
            stain: 'morphology',
            description: 'Crimson siphon ray discharging instantly upon tactile or redox trigger.'
          },
          {
            id: 'ambush-lattice',
            label: 'Tactile Receptor Pores',
            icon: '🔬',
            lens: 'lattice',
            stain: 'grn',
            description: 'Surface porin channels sensing adjacent prey contact and bio-potential.'
          },
          {
            id: 'ambush-potential',
            label: 'Action-Potential Siphon',
            icon: '🔋',
            lens: 'potential',
            stain: 'battery',
            description: 'High-voltage drain across predatory junction following ambush trigger.'
          },
          {
            id: 'ambush-plasmodium',
            label: 'Ambush Hunting Plasmodium',
            icon: '🌊',
            lens: 'plasmodium',
            stain: 'vascular',
            description: 'Contractile hunting plasmodium poised to strike unsuspecting grazers.'
          }
        ],
        recommendedOverlays: {
          trophicRays: true,
          ghostTrails: true
        },
        pinnedBodyId: ambushBody.bodyId,
        pinnedCladeId: ambushBody.cladeId,
        dynamicCameraFollow: true
      });
    }

    // -----------------------------------------------------------------------
    // Stop Candidate 16: Multi-Operon Epigenetic Caste Differentiation
    // -----------------------------------------------------------------------
    let casteBody: IKinematicBody | null = null;
    let casteCell: IKinematicCellSnapshot | null = null;
    let casteFrameIdx = -1;

    for (let i = count - 1; i >= 0; i--) {
      const f = allFrames[i];
      for (const b of f.bodies) {
        if (b.cells.length >= 3 && b.isMulticellularDifferentiated) {
          const opSets = new Set<string>();
          for (const c of b.cells) {
            if (c.operonStates && c.operonStates.length > 1) {
              opSets.add(c.operonStates.map(s => s ? '1' : '0').join(''));
            }
          }
          if (opSets.size >= 2) {
            casteBody = b;
            casteCell = b.cells[0];
            casteFrameIdx = i;
            break;
          }
        }
      }
      if (casteBody) break;
    }

    if (casteBody && casteCell && casteFrameIdx !== -1) {
      const startIdx = Math.max(0, casteFrameIdx - 8);
      const endIdx = Math.min(count - 1, casteFrameIdx + 16);

      stops.push({
        id: 'stop-epigenetic-caste-switch',
        category: 'EPIGENETIC_CASTE_SWITCH',
        badge: 'EPIGENETIC CASTES',
        badgeColor: '#a855f7',
        icon: '🧬',
        title: 'Multi-Operon Epigenetic Caste Differentiation',
        subtitle: `Isogenic syncytium ${casteBody.speciesName} (${casteBody.cells.length} cells) displaying divergent operon states`,
        narrative: `True multicellular differentiation from identical genomes! Grounded in François Jacob and Jacques Monod's operon theory, member cells in this syncytium share the exact same DNA tape yet express completely different operons. Trophocytes express catalytic metabolic cascades while peripheral anchor cells activate somatic shield and secretion operons.`,
        targetCoord: casteCell.coord,
        cameraDistance: 8.5,
        cameraElevation: 0.75,
        startTick: allFrames[startIdx].tick,
        endTick: allFrames[endIdx].tick,
        startFrameIndex: startIdx,
        endFrameIndex: endIdx,
        focalFrameIndex: casteFrameIdx,
        recommendedStain: 'grn',
        recommendedLens: 'potential',
        aspectOptions: [
          {
            id: 'caste-potential',
            label: 'Operon Caste Mosaic',
            icon: '🧬',
            lens: 'potential',
            stain: 'grn',
            description: 'Continuous operon expression heatmap displaying spatial mosaic of differentiated cell fates.'
          },
          {
            id: 'caste-vascular',
            label: 'Inter-Caste Vascular Conduits',
            icon: '⚡',
            lens: 'vascular',
            stain: 'vascular',
            description: 'Vascular conduits transferring metabolites between specialized feeding and protective castes.'
          },
          {
            id: 'caste-lattice',
            label: 'Cellular Specialization Pores',
            icon: '🔬',
            lens: 'lattice',
            stain: 'grn',
            description: 'Hexagonal chambers color-coded by active operon state across the tissue.'
          },
          {
            id: 'caste-plasmodium',
            label: 'Syncytial Poly-Phenism',
            icon: '🌊',
            lens: 'plasmodium',
            stain: 'morphology',
            description: 'Unified syncytial organism whose morphological structure reflects coordinated caste labor.'
          }
        ],
        recommendedOverlays: {
          trophicRays: true,
          slimeStreaming: true,
          ghostTrails: true
        },
        pinnedBodyId: casteBody.bodyId,
        pinnedCladeId: casteBody.cladeId,
        dynamicCameraFollow: true
      });
    }

    // =======================================================================
    // ULTRA-RARE FLUKE / BLACK SWAN NOVELTY SCANNERS
    // =======================================================================

    // Fluke 1: Giant Metazoan Titan (Super-Syncytium >= 7 cells)
    let titanBody: IKinematicBody | null = null;
    let titanFrameIdx = -1;
    for (let i = count - 1; i >= 0; i--) {
      const f = allFrames[i];
      const t = f.bodies.find(b => b.cells.length >= 7);
      if (t) {
        titanBody = t;
        titanFrameIdx = i;
        break;
      }
    }

    if (titanBody && titanFrameIdx !== -1) {
      const startIdx = Math.max(0, titanFrameIdx - 12);
      const endIdx = Math.min(count - 1, titanFrameIdx + 18);
      const midCell = titanBody.cells[Math.floor(titanBody.cells.length / 2)];

      stops.push({
        id: 'stop-fluke-titan',
        category: 'FLUKE_BLACK_SWAN_TITAN',
        badge: 'METAZOAN TITAN',
        badgeColor: '#fbbf24',
        icon: '👑',
        title: 'Macroscopic Metazoan Super-Titan',
        subtitle: `Huge ${titanBody.cells.length}-Cell Integrated Syncytium (${titanBody.speciesName})`,
        narrative: `A statistical marvel! In high-disturbance hydrothermal ecosystems, multi-cell syncytia typically cleave or lyse before exceeding 4-5 pores. This specimen achieved a giant ${titanBody.cells.length}-pore macro-body maintaining unbroken vascular homeostatic equilibrium across complex 3D topography without disintegrating!`,
        targetCoord: midCell.coord,
        cameraDistance: 11.0,
        cameraElevation: 0.82,
        startTick: allFrames[startIdx].tick,
        endTick: allFrames[endIdx].tick,
        startFrameIndex: startIdx,
        endFrameIndex: endIdx,
        focalFrameIndex: titanFrameIdx,
        recommendedStain: 'morphology',
        recommendedLens: 'hybrid',
        aspectOptions: [
          {
            id: 'titan-hybrid',
            label: 'Integrated Super-Titan',
            icon: '👑',
            lens: 'hybrid',
            stain: 'morphology',
            description: 'Grand macroscopic syncytium combining pulsating bio-smoothed outer boundary with internal vascular conduit web.'
          },
          {
            id: 'titan-vascular',
            label: 'Arterial Vasculature',
            icon: '⚡',
            lens: 'vascular',
            stain: 'vascular',
            description: 'Sprawling quadratic vascular network sustaining long-distance metabolic homeostasis across 7+ pores.'
          },
          {
            id: 'titan-plasmodium',
            label: 'Syncytial Cytoplasm',
            icon: '🌊',
            lens: 'plasmodium',
            stain: 'morphology',
            description: 'Unified single-body slime hull undulating organically without fragmentation or boundary dissolution.'
          },
          {
            id: 'titan-grn',
            label: 'Metazoan GRN Map',
            icon: '🧬',
            lens: 'potential',
            stain: 'grn',
            description: 'Complex organism-wide operon differentiation orchestrating specialized somatic and nutritive zones.'
          }
        ],
        recommendedOverlays: {
          slimeStreaming: true,
          trophicRays: true,
          ghostTrails: true
        },
        pinnedBodyId: titanBody.bodyId,
        pinnedCladeId: titanBody.cladeId,
        dynamicCameraFollow: true,
        isRareFluke: true,
        flukePhenomenonType: 'MACROSCOPIC TITAN HYPERTROPHY'
      });
    }

    // Fluke 2: Hadal Fissure Abyss Explorer (z <= 1 in deep crevasse)
    let trenchBody: IKinematicBody | null = null;
    let trenchCell: IKinematicCellSnapshot | null = null;
    let trenchFrameIdx = -1;

    for (let i = 0; i < count; i++) {
      const f = allFrames[i];
      for (const b of f.bodies) {
        const deepCell = b.cells.find(c => c.coord.z <= 1 && c.coord.distanceTo(f.vent.nozzleCoord) >= 3);
        if (deepCell) {
          trenchBody = b;
          trenchCell = deepCell;
          trenchFrameIdx = i;
          break;
        }
      }
      if (trenchBody) break;
    }

    if (trenchBody && trenchCell && trenchFrameIdx !== -1) {
      const startIdx = Math.max(0, trenchFrameIdx - 10);
      const endIdx = Math.min(count - 1, trenchFrameIdx + 15);

      stops.push({
        id: 'stop-fluke-fissure',
        category: 'FLUKE_BLACK_SWAN_FISSURE_ABYSS',
        badge: 'FISSURE DESCENT',
        badgeColor: '#38bdf8',
        icon: '🕳️',
        title: 'Hadal Crevasse Abyss Exploration',
        subtitle: `Specimen navigating floor depth (z=${trenchCell.coord.z}) at (${trenchCell.coord.q}, ${trenchCell.coord.r})`,
        narrative: `An extraordinary descent into the abyss! While most silicoids crowd the warm chimney rim, this lineage colonized the freezing, low-energy hadal fissure floor at z=${trenchCell.coord.z}. The camera dynamically descends and tilts to follow this subterranean trek into the rocky fault chasm.`,
        targetCoord: trenchCell.coord,
        cameraDistance: 7.5,
        cameraElevation: 0.55,
        startTick: allFrames[startIdx].tick,
        endTick: allFrames[endIdx].tick,
        startFrameIndex: startIdx,
        endFrameIndex: endIdx,
        focalFrameIndex: trenchFrameIdx,
        recommendedStain: 'battery',
        recommendedLens: 'plasmodium',
        aspectOptions: [
          {
            id: 'fissure-plasmodium',
            label: 'Abyssal Slime Crawler',
            icon: '🕳️',
            lens: 'plasmodium',
            stain: 'battery',
            description: 'Bio-smoothed plasmodium navigating deep subterranean fault bedrock at floor depth z <= 1.'
          },
          {
            id: 'fissure-vascular',
            label: 'Chasm Conduits',
            icon: '⚡',
            lens: 'vascular',
            stain: 'vascular',
            description: 'Vascular conduits tracing narrow basalt cracks along the floor of the hadal trench.'
          },
          {
            id: 'fissure-lattice',
            label: 'Basalt Crevasse Matrix',
            icon: '🔬',
            lens: 'lattice',
            stain: 'morphology',
            description: 'Mineral pore chamber geometry inside the dark canyon rift far below hydrothermal warmth.'
          },
          {
            id: 'fissure-potential',
            label: 'Cryobiotic Potential',
            icon: '🔋',
            lens: 'potential',
            stain: 'battery',
            description: 'Extreme energy conservation in near-zero temperature gradients at the abyssal floor.'
          }
        ],
        recommendedOverlays: {
          ghostTrails: true,
          slimeStreaming: true
        },
        pinnedBodyId: trenchBody.bodyId,
        pinnedCladeId: trenchBody.cladeId,
        dynamicCameraFollow: true,
        cameraFissureDepthTracking: true,
        isRareFluke: true,
        flukePhenomenonType: 'HADAL TRENCH CRYOBIOTIC DIVE'
      });
    }

    // Fluke 3: De Novo Complex Logic Innovation (Composite AND+OR+NOT or >= 3 gates)
    let logicBody: IKinematicBody | null = null;
    let logicCell: IKinematicCellSnapshot | null = null;
    let logicFrameIdx = -1;

    for (let i = 0; i < count; i++) {
      const f = allFrames[i];
      for (const b of f.bodies) {
        const complexCell = b.cells.find(
          c => (c.gateTypes.includes('GATE_AND') && c.gateTypes.includes('GATE_OR') && c.gateTypes.includes('GATE_NOT')) || c.gateCount >= 3
        );
        if (complexCell) {
          logicBody = b;
          logicCell = complexCell;
          logicFrameIdx = i;
          break;
        }
      }
      if (logicBody) break;
    }

    if (logicBody && logicCell && logicFrameIdx !== -1) {
      const startIdx = Math.max(0, logicFrameIdx - 8);
      const endIdx = Math.min(count - 1, logicFrameIdx + 12);

      stops.push({
        id: 'stop-fluke-logic',
        category: 'FLUKE_BLACK_SWAN_SPONTANEOUS_LOGIC',
        badge: 'DE NOVO LOGIC',
        badgeColor: '#ec4899',
        icon: '🧠',
        title: 'Spontaneous Complex Logic Gate Synthesis',
        subtitle: `De Novo Circuitry (${logicCell.gateTypes.join(', ')}) in ${logicBody.speciesName}`,
        narrative: `A monumental leap in digital systems biology! Without manual circuit injection, this lineage evolved high-order CMOS logic gates directly from random codon mutations in neutral introns. It executes nonlinear XOR/parity truth tables to process environmental derivative pulses!`,
        targetCoord: logicCell.coord,
        cameraDistance: 6.5,
        cameraElevation: 0.72,
        startTick: allFrames[startIdx].tick,
        endTick: allFrames[endIdx].tick,
        startFrameIndex: startIdx,
        endFrameIndex: endIdx,
        focalFrameIndex: logicFrameIdx,
        recommendedStain: 'grn',
        recommendedLens: 'lattice',
        aspectOptions: [
          {
            id: 'logic-lattice',
            label: 'CMOS Gate Architecture',
            icon: '🧠',
            lens: 'lattice',
            stain: 'grn',
            description: 'Discrete porin channel housing de novo evolved nonlinear CMOS logic gates (XOR, Half-Adder, NOT).'
          },
          {
            id: 'logic-potential-grn',
            label: 'Operon Logic Map',
            icon: '🧬',
            lens: 'potential',
            stain: 'grn',
            description: 'Spatial gene regulatory operons interfacing with synthesized digital logic circuits.'
          },
          {
            id: 'logic-vascular',
            label: 'Biocomputational Conduits',
            icon: '⚡',
            lens: 'vascular',
            stain: 'vascular',
            description: 'Cytoplasmic streaming channels propagating digital logic signals across adjacent pores.'
          },
          {
            id: 'logic-plasmodium',
            label: 'Intelligent Plasmodium',
            icon: '🌊',
            lens: 'plasmodium',
            stain: 'morphology',
            description: 'Macroscopic slime envelope whose dynamic morphology is directed by internal digital logic outputs.'
          }
        ],
        recommendedOverlays: {
          trophicRays: true
        },
        pinnedBodyId: logicBody.bodyId,
        pinnedCladeId: logicBody.cladeId,
        dynamicCameraFollow: false,
        isRareFluke: true,
        flukePhenomenonType: 'SPONTANEOUS NONLINEAR LOGIC SYNTHESIS'
      });
    }

    // Fluke 4: Cross-Lineage Chimeric Mat (Peaceful contact between 2 clades)
    let chimeraCoord: HexCoord3D | null = null;
    let chimeraFrameIdx = -1;
    let cladeAId = '';
    let cladeBId = '';

    for (let i = 0; i < count; i++) {
      const f = allFrames[i];
      if (f.bodies.length >= 2) {
        for (let j = 0; j < f.bodies.length; j++) {
          for (let k = j + 1; k < f.bodies.length; k++) {
            const b1 = f.bodies[j];
            const b2 = f.bodies[k];
            if (b1.cladeId !== b2.cladeId) {
              for (const c1 of b1.cells) {
                const adj = b2.cells.find(c2 => c1.coord.distanceTo(c2.coord) === 1);
                if (adj) {
                  chimeraCoord = c1.coord;
                  chimeraFrameIdx = i;
                  cladeAId = b1.cladeId;
                  cladeBId = b2.cladeId;
                  break;
                }
              }
            }
            if (chimeraCoord) break;
          }
          if (chimeraCoord) break;
        }
      }
      if (chimeraCoord) break;
    }

    if (chimeraCoord && chimeraFrameIdx !== -1) {
      const startIdx = Math.max(0, chimeraFrameIdx - 6);
      const endIdx = Math.min(count - 1, chimeraFrameIdx + 14);

      stops.push({
        id: 'stop-fluke-chimera',
        category: 'FLUKE_BLACK_SWAN_CHIMERA',
        badge: 'CHIMERIC MAT',
        badgeColor: '#f43f5e',
        icon: '✨',
        title: 'Spontaneous Cross-Lineage Chimeric Mutualism',
        subtitle: `Clades ${cladeAId} & ${cladeBId} in Peaceful Benthic Contact`,
        narrative: `Two genetically divergent clades sharing direct hexagonal pore adjacency without mutual predation or contact lysis! This rare symbiotic mat demonstrates emergent microbial mutualism or metabolic syntrophy across distinct evolutionary lineages.`,
        targetCoord: chimeraCoord,
        cameraDistance: 7.5,
        cameraElevation: 0.70,
        startTick: allFrames[startIdx].tick,
        endTick: allFrames[endIdx].tick,
        startFrameIndex: startIdx,
        endFrameIndex: endIdx,
        focalFrameIndex: chimeraFrameIdx,
        recommendedStain: 'morphology',
        recommendedLens: 'hybrid',
        aspectOptions: [
          {
            id: 'chimera-hybrid',
            label: 'Chimeric Junction',
            icon: '✨',
            lens: 'hybrid',
            stain: 'morphology',
            description: 'Peaceful multi-species boundary fusing two genetically divergent lineages into a unified symbiotic mat.'
          },
          {
            id: 'chimera-plasmodium',
            label: 'Dual Plasmodial Hulls',
            icon: '🌊',
            lens: 'plasmodium',
            stain: 'morphology',
            description: 'Adjacent bio-smoothed cytoplasm envelopes coexisting without contact lysis or competitive displacement.'
          },
          {
            id: 'chimera-vascular',
            label: 'Syntrophic Conduits',
            icon: '⚡',
            lens: 'vascular',
            stain: 'vascular',
            description: 'Inter-lineage vascular junction facilitating metabolic cross-feeding between distinct genomes.'
          },
          {
            id: 'chimera-potential',
            label: 'Symbiotic Battery Equilibrium',
            icon: '🔋',
            lens: 'potential',
            stain: 'battery',
            description: 'Mutual stabilization of electrochemical energy potentials across the chimeric contact zone.'
          }
        ],
        recommendedOverlays: {
          trophicRays: true,
          slimeStreaming: false
        },
        dynamicCameraFollow: false,
        isRareFluke: true,
        flukePhenomenonType: 'CROSS-CLADE CHIMERIC SYNTROPHY'
      });
    }

    // Fallback: If no complex events found, provide Ecosystem Overview stop
    if (stops.length === 0) {
      const midIdx = Math.floor(count / 2);
      const f = allFrames[midIdx];
      const nozzle = f.vent ? f.vent.nozzleCoord : new HexCoord3D(0, 0, 0);

      stops.push({
        id: 'stop-overview',
        category: 'ECOSYSTEM_OVERVIEW',
        badge: 'BENTHIC OBSERVATORY',
        badgeColor: '#10b981',
        icon: '🌿',
        title: 'Hydrothermal Benthic Ecosystem Overview',
        subtitle: `Ticks ${allFrames[0].tick}–${allFrames[count - 1].tick} • ${f.activeCladesCount} Lineages`,
        narrative: `An expansive macroscopic perspective of the Siliquarium benthic seafloor. Mineral rock pores provide physical compartmentalization while convective hydrothermal fluid circulates energetic co-factors. Clades radiation and territorial boundaries are rendered in high-contrast palettes.`,
        targetCoord: nozzle,
        cameraDistance: 16.0,
        cameraElevation: 0.9,
        startTick: allFrames[0].tick,
        endTick: allFrames[count - 1].tick,
        startFrameIndex: 0,
        endFrameIndex: count - 1,
        focalFrameIndex: midIdx,
        recommendedStain: 'morphology',
        recommendedLens: 'plasmodium',
        aspectOptions: [
          {
            id: 'overview-plasmodium',
            label: 'Syncytial Biosphere',
            icon: '🌊',
            lens: 'plasmodium',
            stain: 'morphology',
            description: 'Panoramic view of all seafloor organisms rendered as organic, pulsing bio-smoothed slime molds.'
          },
          {
            id: 'overview-vascular',
            label: 'Benthic Vascular Network',
            icon: '⚡',
            lens: 'vascular',
            stain: 'vascular',
            description: 'Global web of cytoplasmic conduits and nutrient streaming vectors across the hydrothermal field.'
          },
          {
            id: 'overview-potential',
            label: 'Basin Energy Topography',
            icon: '🔋',
            lens: 'potential',
            stain: 'battery',
            description: 'Topological electrochemical landscape showing energy dissipation radiating from the vent chimney.'
          },
          {
            id: 'overview-lattice',
            label: 'Mineral Hex Grid',
            icon: '🔬',
            lens: 'lattice',
            stain: 'morphology',
            description: 'Structural porin matrix of the basalt seafloor with cell populations occupying hexagonal chambers.'
          }
        ],
        recommendedOverlays: {
          trophicRays: true,
          speciesBadges: false,
          slimeStreaming: false,
          ghostTrails: true
        },
        dynamicCameraFollow: false
      });
    }

    return stops;
  }
}
