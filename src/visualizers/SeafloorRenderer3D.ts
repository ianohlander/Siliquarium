/**
 * 🐠 Siliquarium Visualizer Subsystem
 * SeafloorRenderer3D: 3D Benthic Seafloor & Hydrothermal Vent Matrix Renderer.
 * High-performance depth-sorted hexagonal prism projection with bioluminescent shading.
 */

import { HexCoord3D } from '../core/spatial/HexCoord3D.js';
import { PoreState } from '../core/domain/Pore.js';
import { OrbitCamera, IVector3 } from './OrbitCamera.js';
import {
  ISimulationTelemetry,
  IPoreTelemetry,
  IVentTelemetry,
  IGeologicalEventRecord,
  ITidalVector,
  ISyncytialColonyTelemetry
} from '../engine/SimulationTelemetry.js';
import { TaxonomyNomenclature } from '../core/paleontology/TaxonomyNomenclature.js';
import { KinematicsOverlay } from './KinematicsOverlay.js';
import { ColonyKinematicsRecorder, LensViewMode } from '../engine/kinematics/ColonyKinematicsRecorder.js';

interface IProjectedHex {
  readonly pore: IPoreTelemetry;
  readonly centerScreen: { x: number; y: number };
  readonly topScreenVertices: { x: number; y: number }[];
  readonly baseScreenVertices: { x: number; y: number }[] | null;
  readonly depth: number;
}

interface IMantleFacet {
  readonly vA: IVector3;
  readonly vB: IVector3;
  readonly bA: IVector3;
  readonly bB: IVector3;
  readonly midpoint: IVector3;
  readonly normal: { x: number; z: number };
}

export class SeafloorRenderer3D {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly camera: OrbitCamera;
  private selectedCoord: HexCoord3D | null = null;
  private hoveredCoord: HexCoord3D | null = null;
  private plumeTime: number = 0;
  private selectedColony: ISyncytialColonyTelemetry | null = null;
  private readonly selectedColonyMemberKeys: Set<string> = new Set();
  private readonly colonyByCoordKey: Map<string, ISyncytialColonyTelemetry> = new Map();

  // Viewport layer visibility flags
  public showSpores: boolean = true;
  public showWaterColumn: boolean = true;
  public showBenthic: boolean = true;
  public zoomTransparencyEnabled: boolean = true;
  public activeBrushMode: 'select' | 'basalt' | 'excavate' | 'inoculate' | 'clear' | 'trench' | 'vent' | 'lenski_dropper' | 'pipette' = 'select';
  public studioBrushRadius: number = 1;
  public studioBrushWallHeight: number = 3;
  public calmMotionEnabled: boolean = false;
  public chromaIsolationEnabled: boolean = false;
  public safariTargetCoord: HexCoord3D | null = null;
  public highlightedRoleName: string | null = null;
  public muteNonSpecificRoles: boolean = true;
  public isStudioMode: boolean = false;
  public isChronicleMode: boolean = false;
  public activeLensMode: LensViewMode = 'hybrid';
  public kinematicsRecorder?: ColonyKinematicsRecorder;
  public readonly kinematicsOverlay: KinematicsOverlay = new KinematicsOverlay();
  public lastBillboardRect: { x: number; y: number; w: number; h: number; topology: string | null } | null = null;
  public onMorphologyClick?: (topology: string) => void;

  public setLensMode(mode: LensViewMode): void {
    this.activeLensMode = mode;
    if (this.kinematicsRecorder) {
      this.kinematicsRecorder.setLensMode(mode);
    }
  }

  public checkBillboardClick(screenX: number, screenY: number): boolean {
    if (!this.lastBillboardRect || !this.lastBillboardRect.topology) return false;
    const { x, y, w, h, topology } = this.lastBillboardRect;
    if (screenX >= x && screenX <= x + w && screenY >= y && screenY <= y + h) {
      this.onMorphologyClick?.(topology);
      return true;
    }
    return false;
  }

  public getRoleMeta(roleName: string): { color: string; glyph: string; fill: string } {
    if (roleName.includes('Trophocyte')) {
      return { color: '#f59e0b', glyph: '🌾', fill: 'rgba(245, 158, 11, 0.28)' };
    } else if (roleName.includes('Somatic Shield')) {
      return { color: '#38bdf8', glyph: '🛡️', fill: 'rgba(56, 189, 248, 0.28)' };
    } else if (roleName.includes('Pacemaker')) {
      return { color: '#ec4899', glyph: '⚡', fill: 'rgba(236, 72, 153, 0.28)' };
    } else if (roleName.includes('Basalt Anchor')) {
      return { color: '#10b981', glyph: '⚓', fill: 'rgba(16, 185, 129, 0.28)' };
    } else {
      return { color: '#06b6d4', glyph: '💎', fill: 'rgba(6, 182, 212, 0.28)' };
    }
  }

  public getEffectiveTargetCoord(): HexCoord3D | null {
    return this.selectedCoord ?? (this.chromaIsolationEnabled ? this.safariTargetCoord : null);
  }

  public isChromaTarget(coord: HexCoord3D, isSelected: boolean): boolean {
    const eff = this.getEffectiveTargetCoord();
    if (isSelected) return true;
    if (eff && coord.equals(eff)) return true;
    if (this.selectedColonyMemberKeys.has(coord.toKey())) return true;
    return false;
  }

  public isChromaIsolated(): boolean {
    return this.chromaIsolationEnabled && (this.getEffectiveTargetCoord() !== null);
  }

  // Visual filter and noise reduction controls
  public filterSyncytium: 'all' | 'selected' | 'off' = 'all';
  public filterShowAuras: boolean = true;
  public filterShowTrophicRays: boolean = true;
  public filterShowStreamingBeads: boolean = true;
  private currentVent: IVentTelemetry | null = null;
  private readonly activePreyCoords: Set<string> = new Set();
  private readonly activePredatorCoords: Set<string> = new Set();
  private readonly activeScavengers: Set<string> = new Set();
  private readonly activeVentFeeders: Set<string> = new Set();
  private readonly activeLandauerToggles: Set<string> = new Set();

  // High-performance geometry and topology caches
  private readonly solidMap: Set<string> = new Set();
  private readonly exposedCliffPoreKeys: Set<string> = new Set();
  private solidMapPoreCount: number = -1;
  private lastProjectedHexes: IProjectedHex[] = [];
  private cachedMantleFacets: IMantleFacet[] | null = null;
  private cachedMantleBottomVertices: { x: number; z: number; angle: number }[] = [];
  private cachedMantleYBase: number = 0;
  private cachedMantleYMantle: number = -1.8;
  private lastMantlePoresLength: number = -1;
  private lastMantleMinZ: number = 0;

  // Subterranean Cavern & Niche Tracking Cache
  private readonly subterraneanCaverns: Map<string, {
    surfaceCoord: HexCoord3D;
    cavernPores: IPoreTelemetry[];
    minZ: number;
    maxZ: number;
    hasLife: boolean;
    hasVent: boolean;
  }> = new Map();
  private readonly subterraneanCavernKeys: Set<string> = new Set();

  public static readonly HEX_RADIUS = 1.0;
  public static readonly HEX_HEIGHT = 1.0;
  public static readonly Z_LAYER_SPACING = 1.0;
  public static readonly EDGE_NEIGHBORS: ReadonlyArray<{ dq: number; dr: number }> = [
    { dq: 0, dr: 1 },
    { dq: -1, dr: 1 },
    { dq: -1, dr: 0 },
    { dq: 0, dr: -1 },
    { dq: 1, dr: -1 },
    { dq: 1, dr: 0 }
  ];
  private static readonly HEX_OFFSETS: ReadonlyArray<{ dx: number; dz: number }> = Array.from({ length: 6 }, (_, i) => {
    const ang = (Math.PI / 3) * i + Math.PI / 6;
    return {
      dx: 1.0 * Math.cos(ang),
      dz: 1.0 * Math.sin(ang)
    };
  });

  constructor(canvas: HTMLCanvasElement, camera: OrbitCamera) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to obtain 2D canvas context for 3D renderer.');
    this.ctx = ctx;
    this.camera = camera;
  }

  public setSelectedCoord(coord: HexCoord3D | null): void { this.selectedCoord = coord; }
  public setHoveredCoord(coord: HexCoord3D | null): void { this.hoveredCoord = coord; }

  public render(telemetry: ISimulationTelemetry): void {
    const w = this.canvas.width, h = this.canvas.height;
    if (w <= 0 || h <= 0) return;

    this.currentVent = telemetry.vent;
    this.camera.updateMatrices(w / h);
    this.ctx.clearRect(0, 0, w, h);
    this.drawAbyssalBackground(w, h);

    // Populate solid rock coordinates map and exposed cliff set (Cached: rebuilt only on world/pore size changes)
    if (this.solidMap.size === 0 || this.solidMapPoreCount !== telemetry.pores.length) {
      this.solidMap.clear();
      this.exposedCliffPoreKeys.clear();
      for (const pore of telemetry.pores) {
        if (!pore.isAqueous) {
          this.solidMap.add(pore.coord.toKey());
        }
      }
      for (const pore of telemetry.pores) {
        if (!pore.isAqueous) {
          for (let i = 0; i < 6; i++) {
            const en = SeafloorRenderer3D.EDGE_NEIGHBORS[i];
            const nKey = `${pore.coord.q + en.dq},${pore.coord.r + en.dr},${pore.coord.z}`;
            if (!this.solidMap.has(nKey)) {
              this.exposedCliffPoreKeys.add(pore.coord.toKey());
              break;
            }
          }
        }
      }
      this.solidMapPoreCount = telemetry.pores.length;
    }

    // Populate active action coordinate sets for this frame
    this.activePreyCoords.clear();
    this.activePredatorCoords.clear();
    this.activeScavengers.clear();
    this.activeVentFeeders.clear();
    this.activeLandauerToggles.clear();

    if (telemetry.predationEvents && this.filterShowTrophicRays) {
      for (const ev of telemetry.predationEvents) {
        this.activePreyCoords.add(ev.preyCoord.toKey());
        this.activePredatorCoords.add(ev.predatorCoord.toKey());
      }
    }

    if (telemetry.scavengeEvents && this.filterShowTrophicRays) {
      for (const ev of telemetry.scavengeEvents) {
        this.activeScavengers.add(ev.scavengerCoord.toKey());
      }
    }

    if (this.filterShowAuras) {
      const ventNozzle = telemetry.vent.nozzleCoord;
      for (const pore of telemetry.pores) {
        if (pore.state === PoreState.OCCUPIED) {
          if (pore.coord.distanceTo(ventNozzle) === 1 || telemetry.vent.offshootCoords?.some(c => pore.coord.distanceTo(c) === 1)) {
            this.activeVentFeeders.add(pore.coord.toKey());
          }
          if (pore.toggleCount > 0) {
            this.activeLandauerToggles.add(pore.coord.toKey());
          }
        }
      }
    }

    // Map all syncytial colonies for synchronized respiration and visual gestalt
    this.colonyByCoordKey.clear();
    if (telemetry.syncytialColonies) {
      for (const col of telemetry.syncytialColonies) {
        for (const mc of col.memberCoords) {
          this.colonyByCoordKey.set(mc.toKey(), col);
        }
      }
    }

    const targetCoord = this.getEffectiveTargetCoord();
    this.selectedColony = targetCoord && telemetry.syncytialColonies
      ? (telemetry.syncytialColonies.find(c => c.memberCoords.some(mc => mc.equals(targetCoord))) ?? null)
      : null;
    this.selectedColonyMemberKeys.clear();
    if (this.selectedColony) {
      for (const mc of this.selectedColony.memberCoords) {
        this.selectedColonyMemberKeys.add(mc.toKey());
      }
    }

    // Populate Subterranean Cavern & Niche Tracking Cache
    this.subterraneanCaverns.clear();
    this.subterraneanCavernKeys.clear();
    const columnPores = new Map<string, IPoreTelemetry[]>();
    for (const pore of telemetry.pores) {
      const colKey = `${pore.coord.q},${pore.coord.r}`;
      let list = columnPores.get(colKey);
      if (!list) {
        list = [];
        columnPores.set(colKey, list);
      }
      list.push(pore);
    }

    for (const [colKey, pList] of columnPores.entries()) {
      const cavernPores = pList.filter(p => p.coord.z < 0 && (
        !p.isBasalt ||
        p.state !== PoreState.EMPTY ||
        p.hasSpore ||
        (telemetry.vent.offshootCoords?.some(c => c.q === p.coord.q && c.r === p.coord.r && c.z === p.coord.z) ?? false)
      ));

      if (cavernPores.length > 0) {
        for (const cp of cavernPores) {
          this.subterraneanCavernKeys.add(cp.coord.toKey());
        }

        const rockPores = pList.filter(p => !p.isAqueous).sort((a, b) => b.coord.z - a.coord.z);
        const surfacePore = rockPores[0];
        if (surfacePore) {
          let minZ = 0, maxZ = -999;
          let hasLife = false, hasVent = false;
          for (const cp of cavernPores) {
            if (cp.coord.z < minZ) minZ = cp.coord.z;
            if (cp.coord.z > maxZ) maxZ = cp.coord.z;
            if (cp.state === PoreState.OCCUPIED || cp.hasSpore) hasLife = true;
            if (telemetry.vent.offshootCoords?.some(c => c.q === cp.coord.q && c.r === cp.coord.r && c.z === cp.coord.z)) hasVent = true;
          }
          this.subterraneanCaverns.set(colKey, {
            surfaceCoord: surfacePore.coord,
            cavernPores,
            minZ,
            maxZ,
            hasLife,
            hasVent
          });
        }
      }
    }

    const projectedHexes = this.projectPores(telemetry.pores, w, h);
    projectedHexes.sort((a, b) => b.depth - a.depth);
    this.lastProjectedHexes = projectedHexes;

    const inSafari = this.isChromaIsolated();

    // Option A: Render Oceanic Lithospheric Bedrock Crust Mantle Foundation (suppressed in Safari mode)
    if (!inSafari) {
      this.drawLithosphericCrustMantle(telemetry.pores, w, h);
    }

    let selectedProjectedHex: IProjectedHex | null = null;
    const colonyProjectedHexes: IProjectedHex[] = [];
    for (const item of projectedHexes) {
      if (targetCoord && item.pore.coord.equals(targetCoord)) {
        selectedProjectedHex = item;
      }
      if (this.selectedColonyMemberKeys.has(item.pore.coord.toKey())) {
        colonyProjectedHexes.push(item);
      }
      this.drawHexPrism(item);
    }

    if (!inSafari) {
      if (!this.isChronicleMode) {
        this.drawEcologicalDramaBeams(projectedHexes, telemetry);
      }

      const speedMult = this.calmMotionEnabled ? 0.35 : 0.85;
      this.plumeTime += 0.035 * speedMult;
      this.drawThermalPlume(telemetry.vent.nozzleCoord, telemetry.vent.thermalFlux, w, h);
      if (telemetry.vent.offshootCoords && telemetry.vent.offshootCoords.length > 0) {
        for (const off of telemetry.vent.offshootCoords) {
          this.drawThermalPlume(off, telemetry.vent.thermalFlux * 0.65, w, h);
        }
      }

      if (telemetry.activeGeologicalEvents && telemetry.activeGeologicalEvents.length > 0) {
        this.drawGeologicalEventEffects(projectedHexes, telemetry.activeGeologicalEvents, telemetry.tidalVector, { w, h });
      }
    }

    // CHRONICLE MACRO KINEMATICS OVERLAY PASS: Whole-body slime hulls, histological stains & motility action overlays
    if (this.isChronicleMode && this.kinematicsRecorder) {
      const currentFrame = this.kinematicsRecorder.getCurrentFrame();
      if (currentFrame) {
        this.kinematicsOverlay.render(
          { ctx: this.ctx, camera: this.camera, w, h },
          currentFrame,
          {
            stain: this.kinematicsRecorder.currentStain,
            toggles: this.kinematicsRecorder.overlayToggles,
            pinnedCladeId: this.kinematicsRecorder.pinnedLineageId,
            pinnedBodyId: this.kinematicsRecorder.pinnedBodyId,
            isLineageIsolation: this.kinematicsRecorder.isLineageIsolation,
            lensMode: this.activeLensMode
          }
        );
      }
    }

    // TOP OVERLAY PASS: Render prominent Target Lock Reticle, Multi-Pore Colony Envelope & 3D Callout Pin
    if (selectedProjectedHex && !this.isChronicleMode) {
      this.drawTargetLockOverlay(selectedProjectedHex, colonyProjectedHexes, w, h);
    }

    // STUDIO CAD BRUSH RETICLE OVERLAY PASS: Dynamic footprint highlighting for world sculpting
    if (this.hoveredCoord && this.activeBrushMode !== 'select') {
      this.drawStudioBrushReticle(this.hoveredCoord, projectedHexes, w, h);
    }
  }

  private drawStudioBrushReticle(centerCoord: HexCoord3D, projectedHexes: readonly IProjectedHex[], _w: number, _h: number): void {
    const radius = Math.max(1, this.studioBrushRadius);
    const footprintHexes = projectedHexes.filter(h => {
      const qDiff = h.pore.coord.q - centerCoord.q;
      const rDiff = h.pore.coord.r - centerCoord.r;
      const sDiff = -qDiff - rDiff;
      const dist = Math.max(Math.abs(qDiff), Math.abs(rDiff), Math.abs(sDiff));
      return dist < radius;
    });

    if (footprintHexes.length === 0) return;

    let strokeCol = '#00e5ff';
    let fillCol = 'rgba(0, 229, 255, 0.12)';
    let toolTag = 'BRUSH';

    switch (this.activeBrushMode) {
      case 'basalt':
        strokeCol = '#f59e0b';
        fillCol = 'rgba(245, 158, 11, 0.22)';
        toolTag = `BASALT WALL (H=${this.studioBrushWallHeight})`;
        break;
      case 'excavate':
        strokeCol = '#10b981';
        fillCol = 'rgba(16, 185, 129, 0.22)';
        toolTag = 'EXCAVATE PORE';
        break;
      case 'trench':
        strokeCol = '#c084fc';
        fillCol = 'rgba(192, 132, 252, 0.26)';
        toolTag = 'GOUGE TRENCH (z=-1)';
        break;
      case 'vent':
        strokeCol = '#f97316';
        fillCol = 'rgba(249, 115, 22, 0.26)';
        toolTag = 'VENT SPIRE';
        break;
      case 'inoculate':
      case 'lenski_dropper':
      case 'pipette':
        strokeCol = '#06b6d4';
        fillCol = 'rgba(6, 182, 212, 0.24)';
        toolTag = 'LENSKI PIPETTE';
        break;
      case 'clear':
        strokeCol = '#f43f5e';
        fillCol = 'rgba(244, 63, 94, 0.22)';
        toolTag = 'CLEAR / VACUUM';
        break;
    }

    const pulse = 1.0 + (this.calmMotionEnabled ? 0.04 : 0.08) * Math.sin(this.plumeTime * 4.0);

    this.ctx.save();
    for (const h of footprintHexes) {
      const cx = h.centerScreen.x, cy = h.centerScreen.y;
      this.ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const vx = cx + (h.topScreenVertices[i].x - cx) * pulse;
        const vy = cy + (h.topScreenVertices[i].y - cy) * pulse;
        if (i === 0) this.ctx.moveTo(vx, vy);
        else this.ctx.lineTo(vx, vy);
      }
      this.ctx.closePath();
      this.ctx.fillStyle = fillCol;
      this.ctx.fill();
      this.ctx.strokeStyle = strokeCol;
      this.ctx.lineWidth = 1.8;
      this.ctx.stroke();
    }

    // Floating CAD Tooltip at Center Hex
    const centerHex = footprintHexes.find(h => h.pore.coord.equals(centerCoord)) ?? footprintHexes[0];
    if (centerHex) {
      const cx = centerHex.centerScreen.x;
      const cy = centerHex.centerScreen.y;

      // Reticle center pip
      this.ctx.fillStyle = strokeCol;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      this.ctx.fill();

      // CAD HUD Badge
      const badgeY = cy - 28;
      this.ctx.font = 'bold 9px monospace';
      const textWidth = this.ctx.measureText(toolTag).width;
      const pad = 6;
      const bx = cx - textWidth / 2 - pad;
      const by = badgeY - 12;
      const bw = textWidth + pad * 2;
      const bh = 16;

      this.ctx.fillStyle = 'rgba(9, 14, 26, 0.90)';
      this.ctx.strokeStyle = strokeCol;
      this.ctx.lineWidth = 1.2;
      this.ctx.beginPath();
      if (typeof this.ctx.roundRect === 'function') {
        this.ctx.roundRect(bx, by, bw, bh, 3);
      } else {
        this.ctx.rect(bx, by, bw, bh);
      }
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.fillStyle = strokeCol;
      this.ctx.fillText(toolTag, bx + pad, by + 11);

      // Fine dashed projection line
      this.ctx.setLineDash([2, 2]);
      this.ctx.strokeStyle = strokeCol;
      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy - 4);
      this.ctx.lineTo(cx, by + bh);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }
    this.ctx.restore();
  }

  private drawAbyssalBackground(w: number, h: number): void {
    const grad = this.ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, Math.max(w, h));
    grad.addColorStop(0, '#061325'); grad.addColorStop(0.6, '#020914'); grad.addColorStop(1, '#01040a');
    this.ctx.fillStyle = grad; this.ctx.fillRect(0, 0, w, h);
  }

  private rebuildMantleFacets(pores: readonly IPoreTelemetry[], minZ: number): void {
    const basePores = pores.filter(p => p.coord.z === minZ);
    if (basePores.length === 0) {
      this.cachedMantleFacets = [];
      this.cachedMantleBottomVertices = [];
      return;
    }
    const baseCoordKeys = new Set<string>();
    for (const bp of basePores) {
      baseCoordKeys.add(`${bp.coord.q},${bp.coord.r}`);
    }

    const MANTLE_DEPTH = 1.8;
    const TECTONIC_FLARE = 1.08;
    const r = SeafloorRenderer3D.HEX_RADIUS;
    const yBase = minZ * SeafloorRenderer3D.Z_LAYER_SPACING;
    const yMantle = yBase - MANTLE_DEPTH;
    this.cachedMantleYBase = yBase;
    this.cachedMantleYMantle = yMantle;

    const facets: IMantleFacet[] = [];
    const bottomVertices: { x: number; z: number; angle: number }[] = [];

    for (const bp of basePores) {
      const q = bp.coord.q, rCoord = bp.coord.r;
      const worldCenter = this.axialToWorld(bp.coord);

      for (let i = 0; i < 6; i++) {
        const en = SeafloorRenderer3D.EDGE_NEIGHBORS[i];
        const nKey = `${q + en.dq},${rCoord + en.dr}`;
        if (!baseCoordKeys.has(nKey)) {
          // This edge is an outer boundary edge of the tectonic plate!
          const angA = (Math.PI / 3) * i + Math.PI / 6;
          const angB = (Math.PI / 3) * ((i + 1) % 6) + Math.PI / 6;

          const vA: IVector3 = {
            x: worldCenter.x + r * Math.cos(angA),
            y: yBase,
            z: worldCenter.z + r * Math.sin(angA)
          };
          const vB: IVector3 = {
            x: worldCenter.x + r * Math.cos(angB),
            y: yBase,
            z: worldCenter.z + r * Math.sin(angB)
          };

          const bA: IVector3 = {
            x: vA.x * TECTONIC_FLARE,
            y: yMantle,
            z: vA.z * TECTONIC_FLARE
          };
          const bB: IVector3 = {
            x: vB.x * TECTONIC_FLARE,
            y: yMantle,
            z: vB.z * TECTONIC_FLARE
          };

          const midX = (vA.x + vB.x) / 2;
          const midZ = (vA.z + vB.z) / 2;

          // Outward normal points away from the origin in the XZ plane
          const nLen = Math.hypot(midX, midZ) || 1;
          const norm = { x: midX / nLen, z: midZ / nLen };
          const midPt = { x: midX, y: (yBase + yMantle) / 2, z: midZ };

          facets.push({ vA, vB, bA, bB, midpoint: midPt, normal: norm });
          bottomVertices.push({ x: bA.x, z: bA.z, angle: Math.atan2(bA.z, bA.x) });
          bottomVertices.push({ x: bB.x, z: bB.z, angle: Math.atan2(bB.z, bB.x) });
        }
      }
    }

    bottomVertices.sort((a, b) => a.angle - b.angle);
    const uniqueBottom: { x: number; z: number; angle: number }[] = [];
    for (let k = 0; k < bottomVertices.length; k++) {
      const curr = bottomVertices[k];
      const prev = uniqueBottom[uniqueBottom.length - 1];
      if (!prev || Math.hypot(curr.x - prev.x, curr.z - prev.z) > 0.1) {
        uniqueBottom.push(curr);
      }
    }

    this.cachedMantleFacets = facets;
    this.cachedMantleBottomVertices = uniqueBottom;
    this.lastMantlePoresLength = pores.length;
    this.lastMantleMinZ = minZ;
  }

  private drawLithosphericCrustMantle(pores: readonly IPoreTelemetry[], w: number, h: number): void {
    if (pores.length === 0) return;

    let minZ = 0;
    for (const p of pores) {
      if (p.coord.z < minZ) minZ = p.coord.z;
    }

    if (!this.cachedMantleFacets || this.lastMantlePoresLength !== pores.length || this.lastMantleMinZ !== minZ) {
      this.rebuildMantleFacets(pores, minZ);
    }
    if (!this.cachedMantleFacets || this.cachedMantleFacets.length === 0) return;

    const eye = this.camera.getEyePosition();
    const yBase = this.cachedMantleYBase;
    const yMantle = this.cachedMantleYMantle;

    // Filter to front-facing facets and sort by depth (backface culling)
    const visibleFacets: { facet: IMantleFacet; depth: number }[] = [];
    for (const f of this.cachedMantleFacets) {
      const camRayX = eye.x - f.midpoint.x, camRayZ = eye.z - f.midpoint.z;
      const facing = f.normal.x * camRayX + f.normal.z * camRayZ;
      if (facing > -0.1) {
        // Line-of-sight culling for mantle facets when inspecting subterranean depths
        const target = this.camera.target;
        if ((target.y < 0.25 || (this.selectedCoord && this.selectedCoord.z < 0)) && this.camera.distance < 18.0) {
          const dxT = target.x - eye.x, dyT = target.y - eye.y, dzT = target.z - eye.z;
          const targetDist = Math.hypot(dxT, dyT, dzT);
          const dxF = f.midpoint.x - eye.x, dyF = f.midpoint.y - eye.y, dzF = f.midpoint.z - eye.z;
          const dot = (dxF * dxT + dyF * dyT + dzF * dzT) / targetDist;
          if (dot > 0.5 && dot < targetDist - 0.5) {
            const perpDistSq = Math.max(0, (dxF * dxF + dyF * dyF + dzF * dzF) - dot * dot);
            if (Math.sqrt(perpDistSq) < 4.2) {
              continue; // Front mantle facet blocks camera view to subterranean cavern! Cull it!
            }
          }
        }

        const projMid = this.projectWorldToScreen(f.midpoint, w, h);
        const depth = projMid ? projMid.depth : Math.hypot(camRayX, eye.y - f.midpoint.y, camRayZ);
        visibleFacets.push({ facet: f, depth });
      }
    }
    visibleFacets.sort((a, b) => b.depth - a.depth);

    // Render Solid Bottom Capping Plate
    if (eye.y < yBase + 2.0 && this.cachedMantleBottomVertices.length > 0) {
      this.ctx.beginPath();
      let started = false;
      for (const bv of this.cachedMantleBottomVertices) {
        const sp = this.projectWorldToScreen({ x: bv.x, y: yMantle, z: bv.z }, w, h);
        if (sp) {
          if (!started) { this.ctx.moveTo(sp.x, sp.y); started = true; }
          else { this.ctx.lineTo(sp.x, sp.y); }
        }
      }
      if (started) {
        this.ctx.closePath();
        this.ctx.fillStyle = '#03060c';
        this.ctx.fill();
        this.ctx.strokeStyle = '#0a101d';
        this.ctx.lineWidth = 1.0;
        this.ctx.stroke();
      }
    }

    // Render Stratified Cliff Facets
    const lightDir = { x: -0.55, y: 0.65, z: -0.52 };
    const lLen = Math.hypot(lightDir.x, lightDir.z) || 1;
    const lNorm = { x: lightDir.x / lLen, z: lightDir.z / lLen };

    for (const vf of visibleFacets) {
      const f = vf.facet;
      const svA = this.projectWorldToScreen(f.vA, w, h);
      const svB = this.projectWorldToScreen(f.vB, w, h);
      const sbB = this.projectWorldToScreen(f.bB, w, h);
      const sbA = this.projectWorldToScreen(f.bA, w, h);

      if (!svA || !svB || !sbB || !sbA) continue;

      const dotL = f.normal.x * lNorm.x + f.normal.z * lNorm.z;
      const diffuse = Math.max(0.20, Math.min(1.0, 0.50 + 0.50 * dotL));

      this.ctx.beginPath();
      this.ctx.moveTo(svA.x, svA.y);
      this.ctx.lineTo(svB.x, svB.y);
      this.ctx.lineTo(sbB.x, sbB.y);
      this.ctx.lineTo(sbA.x, sbA.y);
      this.ctx.closePath();

      const grad = this.ctx.createLinearGradient(svA.x, svA.y, sbA.x, sbA.y);
      const rTop = Math.round(14 * diffuse), gTop = Math.round(23 * diffuse), bTop = Math.round(41 * diffuse);
      const rMid = Math.round(8 * diffuse), gMid = Math.round(14 * diffuse), bMid = Math.round(26 * diffuse);
      const rBot = Math.round(4 * diffuse), gBot = Math.round(7 * diffuse), bBot = Math.round(14 * diffuse);

      grad.addColorStop(0, `rgb(${rTop}, ${gTop}, ${bTop})`);
      grad.addColorStop(0.5, `rgb(${rMid}, ${gMid}, ${bMid})`);
      grad.addColorStop(1, `rgb(${rBot}, ${gBot}, ${bBot})`);

      this.ctx.fillStyle = grad;
      this.ctx.fill();

      // Horizontal Geological Strata Lines
      const strataFractions = [0.28, 0.58, 0.82];
      for (const t of strataFractions) {
        const ptA: IVector3 = {
          x: f.vA.x * (1 - t) + f.bA.x * t,
          y: yBase * (1 - t) + yMantle * t,
          z: f.vA.z * (1 - t) + f.bA.z * t
        };
        const ptB: IVector3 = {
          x: f.vB.x * (1 - t) + f.bB.x * t,
          y: yBase * (1 - t) + yMantle * t,
          z: f.vB.z * (1 - t) + f.bB.z * t
        };
        const sptA = this.projectWorldToScreen(ptA, w, h);
        const sptB = this.projectWorldToScreen(ptB, w, h);
        if (sptA && sptB) {
          this.ctx.beginPath();
          this.ctx.moveTo(sptA.x, sptA.y);
          this.ctx.lineTo(sptB.x, sptB.y);
          this.ctx.strokeStyle = t === 0.58 ? 'rgba(56, 189, 248, 0.16)' : 'rgba(71, 85, 105, 0.32)';
          this.ctx.lineWidth = 0.9;
          this.ctx.stroke();
        }
      }

      // Vertical Columnar Basalt Cooling Joints
      const midTop: IVector3 = { x: (f.vA.x + f.vB.x) / 2, y: yBase, z: (f.vA.z + f.vB.z) / 2 };
      const midBot: IVector3 = { x: (f.bA.x + f.bB.x) / 2, y: yMantle, z: (f.bA.z + f.bB.z) / 2 };
      const smTop = this.projectWorldToScreen(midTop, w, h);
      const smBot = this.projectWorldToScreen(midBot, w, h);
      if (smTop && smBot) {
        this.ctx.beginPath();
        this.ctx.moveTo(smTop.x, smTop.y);
        this.ctx.lineTo(smBot.x, smBot.y);
        this.ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)';
        this.ctx.lineWidth = 0.8;
        this.ctx.stroke();
      }

      // Outer facet contour outline
      this.ctx.beginPath();
      this.ctx.moveTo(svA.x, svA.y);
      this.ctx.lineTo(svB.x, svB.y);
      this.ctx.lineTo(sbB.x, sbB.y);
      this.ctx.lineTo(sbA.x, sbA.y);
      this.ctx.closePath();
      this.ctx.strokeStyle = 'rgba(51, 65, 85, 0.45)';
      this.ctx.lineWidth = 0.9;
      this.ctx.stroke();
    }
  }

  private projectPores(pores: readonly IPoreTelemetry[], w: number, h: number): IProjectedHex[] {
    const results: IProjectedHex[] = [];

    for (const pore of pores) {
      // 1. Layer visibility early skip - avoid projecting invisible layers
      if (!this.showWaterColumn && pore.isAqueous) continue;
      if (!this.showBenthic && !pore.isAqueous) continue;
      if (!this.showSpores && pore.hasSpore && pore.isAqueous && pore.state === PoreState.EMPTY) continue;

      const worldPos = this.axialToWorld(pore.coord);
      const centerScreen = this.projectWorldToScreen(worldPos, w, h);
      if (!centerScreen) continue;

      // Frustum culling: skip pores outside the visible canvas area
      if (centerScreen.x < -120 || centerScreen.x > w + 120 || centerScreen.y < -120 || centerScreen.y > h + 120) {
        continue;
      }

      const isSelected = this.selectedCoord?.equals(pore.coord) ?? false;
      const isHovered = this.hoveredCoord?.equals(pore.coord) ?? false;

      // Check if this pore has exposed side faces (Instant O(1) cached lookup)
      let hasExposedSide = isSelected || isHovered;
      if (!hasExposedSide && !pore.isAqueous) {
        hasExposedSide = this.exposedCliffPoreKeys.has(pore.coord.toKey());
      } else if (!hasExposedSide && pore.isAqueous && this.showWaterColumn) {
        hasExposedSide = pore.state !== PoreState.EMPTY || pore.hasSpore;
      }

      const topVerts: { x: number; y: number }[] = [];
      const baseVerts: { x: number; y: number }[] | null = hasExposedSide ? [] : null;
      let valid = true;

      for (let i = 0; i < 6; i++) {
        const off = SeafloorRenderer3D.HEX_OFFSETS[i];
        const topPt = this.projectWorldToScreen({ x: worldPos.x + off.dx, y: worldPos.y + SeafloorRenderer3D.HEX_HEIGHT, z: worldPos.z + off.dz }, w, h);
        if (!topPt) { valid = false; break; }
        topVerts.push(topPt);

        if (hasExposedSide) {
          const basePt = this.projectWorldToScreen({ x: worldPos.x + off.dx, y: worldPos.y, z: worldPos.z + off.dz }, w, h);
          if (!basePt) { valid = false; break; }
          baseVerts!.push(basePt);
        }
      }

      if (valid) {
        results.push({ pore, centerScreen, topScreenVertices: topVerts, baseScreenVertices: baseVerts, depth: centerScreen.depth });
      }
    }
    return results;
  }

  public static axialToWorld(coord: HexCoord3D): IVector3 {
    const r = SeafloorRenderer3D.HEX_RADIUS;
    return { x: r * Math.sqrt(3) * (coord.q + coord.r / 2), y: coord.z * SeafloorRenderer3D.Z_LAYER_SPACING, z: r * 1.5 * coord.r };
  }

  public axialToWorld(coord: HexCoord3D): IVector3 { return SeafloorRenderer3D.axialToWorld(coord); }

  private projectWorldToScreen(world: IVector3, w: number, h: number): { x: number; y: number; depth: number } | null {
    // Single-pass view-projection transformation using cached viewProjMatrix
    const vp = this.camera.getViewProjMatrix();
    const cx = world.x * vp[0] + world.y * vp[4] + world.z * vp[8]  + vp[12];
    const cy = world.x * vp[1] + world.y * vp[5] + world.z * vp[9]  + vp[13];
    const cz = world.x * vp[2] + world.y * vp[6] + world.z * vp[10] + vp[14];
    const cw = world.x * vp[3] + world.y * vp[7] + world.z * vp[11] + vp[15] || 1;
    if (cw <= 0.45) return null; // Near clipping plane guard (OrbitCamera near = 0.5)

    return { x: ((cx / cw) * 0.5 + 0.5) * w, y: (1.0 - ((cy / cw) * 0.5 + 0.5)) * h, depth: cz / cw };
  }

  private getProximityAlpha(hex: IProjectedHex, focalCoord: HexCoord3D | null): number {
    if (!this.zoomTransparencyEnabled) return 1.0;
    const eye = this.camera.getEyePosition();
    const cellWorld = this.axialToWorld(hex.pore.coord);
    const distToEye = Math.hypot(cellWorld.x - eye.x, cellWorld.y - eye.y, cellWorld.z - eye.z);

    // 1. Focal Object Protection: If the camera is centered on this exact cell, keep it clear
    const target = this.camera.target;
    const distToTarget = Math.hypot(cellWorld.x - target.x, cellWorld.y - target.y, cellWorld.z - target.z);
    const isCameraTarget = distToTarget < 1.0;
    const isFocalPore = focalCoord ? hex.pore.coord.equals(focalCoord) : false;
    const isColonyMember = this.selectedColonyMemberKeys.has(hex.pore.coord.toKey());

    // 2. Universal Near-Camera Lens Clearance Sphere:
    // Any pore entering the immediate clearance sphere of the camera lens (< 3.2 units) MUST dissolve completely
    // so it never blocks the viewport or balloons across the screen.
    if (!isCameraTarget) {
      if (distToEye < 3.2) {
        return 0.0;
      }
      if (distToEye < 6.0) {
        const lensAlpha = Math.max(0.0, (distToEye - 3.2) / (6.0 - 3.2));
        if (lensAlpha <= 0.01) return 0.0;
        return lensAlpha;
      }
    } else {
      if (distToEye < 1.6) {
        return 0.0;
      }
    }

    // 3. Subterranean Cavern & Niche Cutaway System:
    // When zooming in to subterranean caverns/niches, all in-between overhead rock, top cell borders,
    // and surrounding basalt rock must dissolve to 0.0 so the interior cavern is completely unobstructed.
    const camDist = this.camera.distance;
    const targetIsSub = target.y < 0.25;
    const focalIsSub = (focalCoord && focalCoord.z < 0) || (this.hoveredCoord && this.hoveredCoord.z < 0);
    const isSubCavernPore = this.subterraneanCavernKeys.has(hex.pore.coord.toKey());

    // Zoom factor: 0.0 at overview (camDist >= 18.0), 1.0 at macro zoom (camDist <= 7.5)
    const zoomFade = Math.max(0.0, Math.min(1.0, (18.0 - camDist) / (18.0 - 7.5)));

    let subFocusWorld: IVector3 | null = null;
    let subFocusCoord: HexCoord3D | null = null;

    if (focalCoord && focalCoord.z < 0) {
      subFocusCoord = focalCoord;
      subFocusWorld = this.axialToWorld(focalCoord);
    } else if (this.hoveredCoord && this.hoveredCoord.z < 0) {
      subFocusCoord = this.hoveredCoord;
      subFocusWorld = this.axialToWorld(this.hoveredCoord);
    } else if (targetIsSub) {
      subFocusWorld = target;
    }

    // A. Overhead / In-Between Rock (Top Pores & Ceiling Borders)
    const colKey = `${hex.pore.coord.q},${hex.pore.coord.r}`;
    const colCavern = this.subterraneanCaverns.get(colKey);
    const isOverheadCavern = colCavern && hex.pore.coord.z > colCavern.maxZ;

    let isNearSubFocus = false;
    if (subFocusWorld) {
      const hDist = Math.hypot(cellWorld.x - subFocusWorld.x, cellWorld.z - subFocusWorld.z);
      if (hDist < 3.8 && hex.pore.coord.z > (subFocusCoord ? subFocusCoord.z : -1)) {
        isNearSubFocus = true;
      }
    }

    if ((isOverheadCavern || isNearSubFocus) && (targetIsSub || focalIsSub || zoomFade > 0.05)) {
      // Overhead rock dissolves as zoom increases; fully 0.0 when zoomFade >= 0.60 (camDist <= 11.7)
      const overheadFade = Math.max(0.0, 1.0 - zoomFade * 1.65);
      if (overheadFade <= 0.01) {
        return 0.0; // Completely clipped out: zero fill, zero stroke, zero borders!
      }
      return overheadFade;
    }

    // B. Surrounding Rock of the Subterranean Cavern
    // The solid basalt bedrock framing the cavern must dissolve away so you fly straight through rock into the cavern.
    if (hex.pore.isBasalt && hex.pore.coord.z <= 0 && subFocusWorld && (targetIsSub || focalIsSub || zoomFade > 0.15)) {
      const distToSub = Math.hypot(cellWorld.x - subFocusWorld.x, cellWorld.y - subFocusWorld.y, cellWorld.z - subFocusWorld.z);
      if (distToSub < 3.8 && !isCameraTarget && !isFocalPore) {
        const distToEyeCell = distToEye;
        const distToEyeSub = Math.hypot(subFocusWorld.x - eye.x, subFocusWorld.y - eye.y, subFocusWorld.z - eye.z);
        if (distToEyeCell < distToEyeSub + 1.2) {
          const rockFade = Math.max(0.0, (distToSub - 1.2 * zoomFade) / (2.4 * zoomFade + 0.1));
          if (rockFade <= 0.01) {
            return 0.0; // Completely clipped out!
          }
          return rockFade;
        }
      }
    }

    // 4. Foreground Line-of-Sight Occlusion Dissolve (Looking through a cell at the target):
    // If this cell is directly between the camera eye and the target, dissolve it so the background target remains visible
    const dxT = target.x - eye.x, dyT = target.y - eye.y, dzT = target.z - eye.z;
    const targetDist = Math.hypot(dxT, dyT, dzT);
    if (targetDist > 2.0 && !isCameraTarget && !isFocalPore && !isSubCavernPore) {
      const dxC = cellWorld.x - eye.x, dyC = cellWorld.y - eye.y, dzC = cellWorld.z - eye.z;
      const dot = (dxC * dxT + dyC * dyT + dzC * dzT) / targetDist; // Distance along view ray
      if (dot > 0.5 && dot < targetDist - 0.7) {
        // Perpendicular distance from view ray
        const perpDistSq = Math.max(0, (dxC * dxC + dyC * dyC + dzC * dzC) - dot * dot);
        const perpDist = Math.sqrt(perpDistSq);
        const tunnelRadius = targetIsSub ? 2.4 : 1.8;
        if (perpDist < tunnelRadius) {
          const losAlpha = Math.max(0.0, Math.min(1.0, (perpDist - 0.4) / (tunnelRadius - 0.4)));
          if (losAlpha <= 0.01) return 0.0;
          return losAlpha;
        }
      }
    }

    // 5. Basalt / Rock Fissure Dissolve: When camera enters near basalt walls (distToEye < 4.5), dissolve outer geometry
    if (hex.pore.isBasalt && !isCameraTarget && distToEye < 4.5) {
      const bAlpha = Math.max(0.0, (distToEye - 2.8) / (4.5 - 2.8));
      if (bAlpha <= 0.01) return 0.0;
      return bAlpha;
    }

    // 6. Water column cells quickly fade out on zoom so they don't block benthic view
    const zoomFactor = Math.max(0, Math.min(1.0, (16.0 - camDist) / (16.0 - 5.0)));
    if (hex.pore.isAqueous) {
      const wAlpha = Math.max(0, 1.0 - zoomFactor * 1.6);
      if (wAlpha <= 0.01) return 0.0;
      return wAlpha;
    }

    // 7. Focus falloff for distant non-selected cells when zoomed in
    if (focalCoord && !isFocalPore && !isColonyMember && zoomFactor > 0.3) {
      const dist = hex.pore.coord.distanceTo(focalCoord);
      if (dist === 1) {
        return Math.max(0.40, 1.0 - zoomFactor * 0.50);
      } else if (dist === 2) {
        return Math.max(0.25, 1.0 - zoomFactor * 0.70);
      } else {
        return Math.max(0.12, 1.0 - zoomFactor * 0.85);
      }
    }

    return 1.0;
  }

  private drawHexPrism(hex: IProjectedHex): void {
    // Layer visibility toggles
    if (!this.showBenthic && !hex.pore.isAqueous) return;
    if (!this.showWaterColumn && hex.pore.isAqueous) return;
    if (!this.showSpores && hex.pore.hasSpore && hex.pore.isAqueous && hex.pore.state === PoreState.EMPTY) return;

    const eye = this.camera.getEyePosition();
    const isAqueous = hex.pore.isAqueous;
    if (isAqueous && eye.y < hex.pore.coord.z * SeafloorRenderer3D.Z_LAYER_SPACING) return;

    const isSelected = this.selectedCoord?.equals(hex.pore.coord) ?? false;
    const isHovered = this.hoveredCoord?.equals(hex.pore.coord) ?? false;
    const isEmpty = hex.pore.state === PoreState.EMPTY && !hex.pore.hasSpore;

    // Calculate proximity alpha for focused zoom
    const alpha = this.getProximityAlpha(hex, this.selectedCoord);
    if (alpha <= 0.01 && !isSelected) return;

    const prevAlpha = this.ctx.globalAlpha;
    this.ctx.globalAlpha = alpha;

    const isTarget = this.isChromaTarget(hex.pore.coord, isSelected);
    const isIsolated = this.isChromaIsolated();

    // IN SAFARI MODE: Anything NOT part of the silicoid is completely transparent (see-through)
    // so non-target pores NEVER occlude the specimen even when positioned in front of it!
    if (isIsolated && !isTarget) {
      this.ctx.beginPath();
      this.ctx.moveTo(hex.topScreenVertices[0].x, hex.topScreenVertices[0].y);
      for (let i = 1; i < 6; i++) this.ctx.lineTo(hex.topScreenVertices[i].x, hex.topScreenVertices[i].y);
      this.ctx.closePath();
      this.ctx.strokeStyle = 'rgba(30, 41, 59, 0.10)';
      this.ctx.lineWidth = 0.4;
      this.ctx.stroke();
      this.ctx.globalAlpha = prevAlpha;
      return;
    }

    // Side walls: only drawn if this prism has baseScreenVertices (exposed cliff faces or aqueous cells)
    if (hex.baseScreenVertices && !isAqueous) {
      const worldPos = this.axialToWorld(hex.pore.coord);
      const isBasalt = hex.pore.isBasalt;
      const isSub = hex.pore.coord.z < 0;

      for (let i = 0; i < 6; i++) {
        const en = SeafloorRenderer3D.EDGE_NEIGHBORS[i];
        const nKey = `${hex.pore.coord.q + en.dq},${hex.pore.coord.r + en.dr},${hex.pore.coord.z}`;
        if (this.solidMap.has(nKey) && !isSelected && !isHovered) {
          continue; // Adjacent cell at this level is solid rock -> internal interface, skip!
        }

        // Outward normal of edge i in XZ plane
        const midAng = (Math.PI / 3) * (i + 1);
        const nx = Math.cos(midAng);
        const nz = Math.sin(midAng);

        // Backface culling: test against camera view ray
        const camRayX = eye.x - worldPos.x;
        const camRayZ = eye.z - worldPos.z;
        if (nx * camRayX + nz * camRayZ <= 0.05 && !isSelected && !isHovered) {
          continue; // Facing away from camera -> backface cull!
        }

        const next = (i + 1) % 6;
        this.ctx.beginPath();
        this.ctx.moveTo(hex.baseScreenVertices[i].x, hex.baseScreenVertices[i].y);
        this.ctx.lineTo(hex.baseScreenVertices[next].x, hex.baseScreenVertices[next].y);
        this.ctx.lineTo(hex.topScreenVertices[next].x, hex.topScreenVertices[next].y);
        this.ctx.lineTo(hex.topScreenVertices[i].x, hex.topScreenVertices[i].y);
        this.ctx.closePath();

        // Directional facet lighting (light from -0.577, -0.577)
        const dotL = nx * -0.577 + nz * -0.577;
        const diffuse = Math.max(0.25, Math.min(1.0, 0.55 + 0.45 * dotL));

        const baseR = isBasalt ? (isSub ? 8 : 14) : (isSub ? 10 : 16);
        const baseG = isBasalt ? (isSub ? 12 : 22) : (isSub ? 18 : 26);
        const baseB = isBasalt ? (isSub ? 20 : 38) : (isSub ? 32 : 44);

        this.ctx.fillStyle = `rgb(${Math.round(baseR * diffuse)}, ${Math.round(baseG * diffuse)}, ${Math.round(baseB * diffuse)})`;
        this.ctx.strokeStyle = isSelected ? '#38bdf8' : (isHovered ? '#fbbf24' : (isBasalt
          ? (isSub ? 'rgba(51, 65, 85, 0.35)' : 'rgba(71, 85, 105, 0.45)')
          : (isSub ? 'rgba(38, 140, 200, 0.18)' : 'rgba(56, 189, 248, 0.25)')));
        this.ctx.lineWidth = isSelected ? 2.0 : 0.8;
        if (alpha >= 0.20 || isSelected || isHovered) {
          this.ctx.stroke();
        }
      }
    } else if (hex.baseScreenVertices && isAqueous && this.showWaterColumn && !isEmpty) {
      this.ctx.fillStyle = 'rgba(6, 44, 76, 0.18)';
      for (let i = 0; i < 6; i++) {
        const next = (i + 1) % 6;
        this.ctx.beginPath();
        this.ctx.moveTo(hex.baseScreenVertices[i].x, hex.baseScreenVertices[i].y);
        this.ctx.lineTo(hex.baseScreenVertices[next].x, hex.baseScreenVertices[next].y);
        this.ctx.lineTo(hex.topScreenVertices[next].x, hex.topScreenVertices[next].y);
        this.ctx.lineTo(hex.topScreenVertices[i].x, hex.topScreenVertices[i].y);
        this.ctx.closePath();
        this.ctx.fill();
      }
    }

    const col = this.colonyByCoordKey.get(hex.pore.coord.toKey());
    const role = col?.differentiatedRoles?.find(r => r.coord.equals(hex.pore.coord));
    const isRoleMatch = this.highlightedRoleName && role && (role.roleName === this.highlightedRoleName);

    this.ctx.beginPath();
    this.ctx.moveTo(hex.topScreenVertices[0].x, hex.topScreenVertices[0].y);
    for (let i = 1; i < 6; i++) this.ctx.lineTo(hex.topScreenVertices[i].x, hex.topScreenVertices[i].y);
    this.ctx.closePath();

    if (this.highlightedRoleName) {
      if (isRoleMatch) {
        const meta = this.getRoleMeta(role!.roleName);
        this.ctx.fillStyle = meta.fill;
        this.ctx.strokeStyle = meta.color;
        this.ctx.lineWidth = 2.8;
      } else if (this.muteNonSpecificRoles) {
        // Mute non-specific cells in the colony with translucent fill so they don't occlude background/subterranean cells
        this.ctx.fillStyle = 'rgba(8, 13, 24, 0.20)';
        this.ctx.strokeStyle = 'rgba(51, 65, 85, 0.18)';
        this.ctx.lineWidth = 0.6;
      } else {
        this.ctx.fillStyle = this.getPoreColor(hex.pore);
        this.ctx.strokeStyle = isSelected ? '#38bdf8' : (isHovered ? '#fbbf24' : (hex.pore.isBasalt ? (hex.pore.coord.z > 0 ? '#64748b' : (hex.pore.coord.z < 0 ? '#334155' : '#1e293b')) : (isAqueous ? 'rgba(56, 189, 248, 0.05)' : (hex.pore.coord.z < 0 ? '#38bdf833' : '#1e293b'))));
        this.ctx.lineWidth = isSelected ? 3.0 : (isHovered ? 2.0 : (hex.pore.isBasalt && hex.pore.coord.z > 0 ? 1.5 : 1.0));
      }
    } else {
      this.ctx.fillStyle = this.getPoreColor(hex.pore);
      this.ctx.strokeStyle = isSelected ? '#38bdf8' : (isHovered ? '#fbbf24' : (hex.pore.isBasalt ? (hex.pore.coord.z > 0 ? '#64748b' : (hex.pore.coord.z < 0 ? '#334155' : '#1e293b')) : (isAqueous ? 'rgba(56, 189, 248, 0.05)' : (hex.pore.coord.z < 0 ? '#38bdf833' : '#1e293b'))));
      this.ctx.lineWidth = isSelected ? 3.0 : (isHovered ? 2.0 : (hex.pore.isBasalt && hex.pore.coord.z > 0 ? 1.5 : 1.0));
    }
    this.ctx.fill();

    // Border stroke: Suppressed on fading cells so wireframe ghost borders never linger
    if (alpha >= 0.20 || isSelected) {
      const baseWidth = isSelected ? 3.0 : (isHovered ? 2.0 : (hex.pore.isBasalt && hex.pore.coord.z > 0 ? 1.5 : 1.0));
      this.ctx.lineWidth = Math.max(0.2, baseWidth * Math.min(1.0, alpha * 2.0));
      this.ctx.stroke();
    }

    const rawRadius = Math.hypot(hex.topScreenVertices[0].x - hex.centerScreen.x, hex.topScreenVertices[0].y - hex.centerScreen.y);
    const projRadius = Math.min(85, Math.max(3, rawRadius));

    // Surface Visual Indicator for Subterranean Caverns beneath this pore
    if (hex.pore.coord.z >= 0 && alpha > 0.05 && !isIsolated) {
      const cavInfo = this.subterraneanCaverns.get(`${hex.pore.coord.q},${hex.pore.coord.r}`);
      if (cavInfo && cavInfo.surfaceCoord.equals(hex.pore.coord)) {
        this.drawSubterraneanCavernIndicator(hex, cavInfo, projRadius, alpha);
      }
    }

    // Volcanic mineral grain on basalt blocks
    if (hex.pore.isBasalt && projRadius >= 12 && !this.highlightedRoleName && alpha >= 0.25) {
      this.ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
      this.ctx.lineWidth = 1.0;
      this.ctx.beginPath();
      this.ctx.moveTo(hex.centerScreen.x - projRadius * 0.35, hex.centerScreen.y - projRadius * 0.15);
      this.ctx.lineTo(hex.centerScreen.x + projRadius * 0.35, hex.centerScreen.y + projRadius * 0.15);
      this.ctx.stroke();
    }

    if (this.isStudioMode) {
      // In Design Studio: Focus 100% on environment & geomorphology.
      // Suppress full silicoid graphics, action borders, spores, and carcasses.
      // Render only a clean, minimal occupancy indicator if the pore hosts life.
      if (hex.pore.state === PoreState.OCCUPIED) {
        this.drawStudioOccupancyIndicator(hex, projRadius);
      }
    } else if (this.isChronicleMode) {
      // In Chronicle Mode: Macro whole-body kinematics and histological stains are drawn by KinematicsOverlay.
      // Suppress intracellular codon bars, gates, sparks, and carcasses to maintain decluttered view.
    } else {
      if (this.filterShowAuras && alpha >= 0.25) {
        this.drawDynamicActionBorders(hex, projRadius);
      }
      if (hex.pore.hasSpore && this.showSpores && !isIsolated) {
        this.drawPelagicSpore(hex.centerScreen.x, hex.centerScreen.y, projRadius);
      }
      if (hex.pore.state === PoreState.OCCUPIED) {
        this.drawSilicoidOrganism(hex, projRadius, isSelected);
      } else if (hex.pore.state === PoreState.CARCASS && !isIsolated) {
        this.drawCarcassDetritus(hex, projRadius);
      }
    }

    this.ctx.globalAlpha = prevAlpha;
  }

  private drawSubterraneanCavernIndicator(
    hex: IProjectedHex,
    cavInfo: { surfaceCoord: HexCoord3D; cavernPores: IPoreTelemetry[]; minZ: number; maxZ: number; hasLife: boolean; hasVent: boolean },
    radius: number,
    alpha: number
  ): void {
    const cx = hex.centerScreen.x, cy = hex.centerScreen.y;
    const pulseRate = this.calmMotionEnabled ? 1.6 : 2.8;
    const pulse = 1.0 + (this.calmMotionEnabled ? 0.06 : 0.14) * Math.sin(this.plumeTime * pulseRate);

    this.ctx.save();

    // 1. Glowing Geothermal Bedrock Fissures / Seams across surface rock
    const seamColor = cavInfo.hasLife
      ? `rgba(52, 211, 153, ${0.80 * alpha})` // Emerald life radiance
      : cavInfo.hasVent
        ? `rgba(251, 191, 36, ${0.80 * alpha})` // Thermal amber vent glow
        : `rgba(56, 189, 248, ${0.70 * alpha})`; // Electric cyan cavern void

    this.ctx.strokeStyle = seamColor;
    this.ctx.lineWidth = Math.max(0.8, 1.8 * alpha);
    this.ctx.beginPath();
    for (let i = 0; i < 6; i += 2) {
      const vx = hex.topScreenVertices[i].x;
      const vy = hex.topScreenVertices[i].y;
      this.ctx.moveTo(cx, cy);
      const mx = (cx + vx) / 2 + (Math.sin(i * 1.7) * 2.5);
      const my = (cy + vy) / 2 + (Math.cos(i * 1.7) * 2.5);
      this.ctx.lineTo(mx, my);
      this.ctx.lineTo(vx, vy);
    }
    this.ctx.stroke();

    // 2. Concentric Acoustic / Geothermal Pulse Ripple Rings
    const rippleSpeed = this.calmMotionEnabled ? 0.45 : 0.8;
    const rippleT = ((this.plumeTime * rippleSpeed) % 1.0);
    const ripR = radius * (0.22 + 0.65 * rippleT) * pulse;
    const ripAlpha = Math.max(0.0, (1.0 - rippleT) * 0.85 * alpha);

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, ripR, 0, Math.PI * 2);
    this.ctx.strokeStyle = cavInfo.hasLife
      ? `rgba(52, 211, 153, ${ripAlpha})`
      : `rgba(56, 189, 248, ${ripAlpha})`;
    this.ctx.lineWidth = 1.3;
    this.ctx.stroke();

    // 3. Stepped Hexagonal Subterranean Shaft Portal (Geological Trench, not an organism)
    const shaftScale = Math.min(0.50, Math.max(0.25, 0.38 * pulse));
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const vx = cx + (hex.topScreenVertices[i].x - cx) * shaftScale;
      const vy = cy + (hex.topScreenVertices[i].y - cy) * shaftScale;
      if (i === 0) this.ctx.moveTo(vx, vy); else this.ctx.lineTo(vx, vy);
    }
    this.ctx.closePath();
    this.ctx.fillStyle = cavInfo.hasLife ? 'rgba(4, 30, 22, 0.94)' : 'rgba(3, 8, 20, 0.94)';
    this.ctx.fill();
    this.ctx.strokeStyle = cavInfo.hasLife ? '#34d399' : '#38bdf8';
    this.ctx.lineWidth = 1.6;
    this.ctx.stroke();

    // Radial perspective lines connecting outer rim to inner shaft rim
    this.ctx.strokeStyle = cavInfo.hasLife ? 'rgba(52, 211, 153, 0.35)' : 'rgba(56, 189, 248, 0.30)';
    this.ctx.lineWidth = 0.8;
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const outerX = hex.topScreenVertices[i].x;
      const outerY = hex.topScreenVertices[i].y;
      const innerX = cx + (outerX - cx) * shaftScale;
      const innerY = cy + (outerY - cy) * shaftScale;
      this.ctx.moveTo(innerX, innerY);
      this.ctx.lineTo(innerX + (outerX - innerX) * 0.5, innerY + (outerY - innerY) * 0.5);
    }
    this.ctx.stroke();

    // Central Geological Icon: Life sprout or Cavern depth arrow
    if (radius >= 10) {
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      if (cavInfo.hasLife) {
        this.ctx.fillStyle = '#6ee7b7';
        this.ctx.font = 'bold 9px monospace';
        this.ctx.fillText('🌱', cx, cy - 2);
      } else {
        this.ctx.fillStyle = '#7dd3fc';
        this.ctx.font = 'bold 8px monospace';
        this.ctx.fillText('⟱', cx, cy - 2);
      }

      // Small depth tier label below beacon if radius is large enough
      if (radius >= 17) {
        this.ctx.fillStyle = '#cbd5e1';
        this.ctx.font = 'bold 7px monospace';
        this.ctx.fillText(`z=${cavInfo.minZ}`, cx, cy + (radius * shaftScale) + 7);
      }
    }

    this.ctx.restore();
  }

  private drawTargetLockOverlay(hex: IProjectedHex, colonyHexes: readonly IProjectedHex[], w: number, _h: number): void {
    const cx = hex.centerScreen.x, cy = hex.centerScreen.y;
    const projRadius = Math.hypot(hex.topScreenVertices[0].x - cx, hex.topScreenVertices[0].y - cy);
    const pulse = 1.08 + (this.calmMotionEnabled ? 0.03 : 0.07) * Math.sin(this.plumeTime * 3.5);

    let strokeCol = '#00e5ff'; // Electric Cyan for inspection
    let tipCol = '#38bdf8';

    if (this.activeBrushMode === 'basalt') {
      strokeCol = '#f59e0b';
      tipCol = '#fbbf24';
    } else if (this.activeBrushMode === 'excavate') {
      strokeCol = '#00e5ff';
      tipCol = '#22d3ee';
    } else if (this.activeBrushMode === 'inoculate' || this.activeBrushMode === 'lenski_dropper' || this.activeBrushMode === 'pipette') {
      strokeCol = '#10b981';
      tipCol = '#34d399';
    } else if (this.activeBrushMode === 'trench') {
      strokeCol = '#c084fc';
      tipCol = '#d8b4fe';
    } else if (this.activeBrushMode === 'vent') {
      strokeCol = '#f97316';
      tipCol = '#fb923c';
    } else if (this.activeBrushMode === 'clear') {
      strokeCol = '#f43f5e';
      tipCol = '#fb7185';
    }

    this.ctx.save();

    // 0. Unified Multi-Pore Colony Gestalt: Luminous Connective Envelope & Member Reticles
    if (colonyHexes.length > 1) {
      // A. Thick luminous cytoplasmic bridge conduits linking adjacent member pores
      for (let a = 0; a < colonyHexes.length; a++) {
        for (let b = a + 1; b < colonyHexes.length; b++) {
          const pA = colonyHexes[a], pB = colonyHexes[b];
          if (pA.pore.coord.distanceTo(pB.pore.coord) === 1) {
            const corridorGrad = this.ctx.createLinearGradient(
              pA.centerScreen.x, pA.centerScreen.y,
              pB.centerScreen.x, pB.centerScreen.y
            );
            corridorGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
            corridorGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.70)');
            corridorGrad.addColorStop(1, 'rgba(56, 189, 248, 0.45)');
            this.ctx.strokeStyle = corridorGrad;
            this.ctx.lineWidth = Math.max(3.5, projRadius * 0.40);
            this.ctx.beginPath();
            this.ctx.moveTo(pA.centerScreen.x, pA.centerScreen.y);
            this.ctx.lineTo(pB.centerScreen.x, pB.centerScreen.y);
            this.ctx.stroke();
          }
        }
      }

      // B. Synchronized glowing reticle rings & corner brackets on all colony partner pores
      for (const mHex of colonyHexes) {
        if (mHex === hex) continue; // Primary selected pore handled below
        const mcx = mHex.centerScreen.x, mcy = mHex.centerScreen.y;
        const mProjRadius = Math.hypot(mHex.topScreenVertices[0].x - mcx, mHex.topScreenVertices[0].y - mcy);

        // Partner cell reticle ring
        const mRole = this.selectedColony?.differentiatedRoles?.find(r => r.coord.equals(mHex.pore.coord));
        const isMRoleMatch = this.highlightedRoleName && mRole && (mRole.roleName === this.highlightedRoleName);

        if (this.highlightedRoleName) {
          if (!isMRoleMatch) continue; // Skip all non-specific cells
          const meta = this.getRoleMeta(mRole!.roleName);
          this.ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const px = mcx + (mHex.topScreenVertices[i].x - mcx) * pulse;
            const py = mcy + (mHex.topScreenVertices[i].y - mcy) * pulse;
            if (i === 0) this.ctx.moveTo(px, py); else this.ctx.lineTo(px, py);
          }
          this.ctx.closePath();
          this.ctx.strokeStyle = meta.color;
          this.ctx.lineWidth = 3.2;
          this.ctx.shadowColor = meta.color;
          this.ctx.shadowBlur = 12;
          this.ctx.stroke();
          this.ctx.shadowBlur = 0;
          continue;
        }

        // Normal mode: delicate reticle for large colonies to prevent purple wash
        const isHugeColony = colonyHexes.length > 30;
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const px = mcx + (mHex.topScreenVertices[i].x - mcx) * pulse;
          const py = mcy + (mHex.topScreenVertices[i].y - mcy) * pulse;
          if (i === 0) this.ctx.moveTo(px, py); else this.ctx.lineTo(px, py);
        }
        this.ctx.closePath();
        this.ctx.strokeStyle = isHugeColony ? 'rgba(168, 85, 247, 0.40)' : 'rgba(168, 85, 247, 0.85)';
        this.ctx.lineWidth = isHugeColony ? 1.4 : 2.4;
        this.ctx.stroke();

        // Partner cell corner brackets
        if (!this.chromaIsolationEnabled) {
          const mBracketR = Math.max(14, mProjRadius * 1.25);
          const mbLen = Math.max(6, mBracketR * 0.28);
          this.ctx.strokeStyle = 'rgba(192, 132, 252, 0.9)';
          this.ctx.lineWidth = 1.8;
          // Top-left
          this.ctx.beginPath();
          this.ctx.moveTo(mcx - mBracketR, mcy - mBracketR + mbLen);
          this.ctx.lineTo(mcx - mBracketR, mcy - mBracketR);
          this.ctx.lineTo(mcx - mBracketR + mbLen, mcy - mBracketR);
          this.ctx.stroke();
          // Top-right
          this.ctx.beginPath();
          this.ctx.moveTo(mcx + mBracketR - mbLen, mcy - mBracketR);
          this.ctx.lineTo(mcx + mBracketR, mcy - mBracketR);
          this.ctx.lineTo(mcx + mBracketR, mcy - mBracketR + mbLen);
          this.ctx.stroke();
          // Bottom-left
          this.ctx.beginPath();
          this.ctx.moveTo(mcx - mBracketR, mcy + mBracketR - mbLen);
          this.ctx.lineTo(mcx - mBracketR, mcy + mBracketR);
          this.ctx.lineTo(mcx - mBracketR + mbLen, mcy + mBracketR);
          this.ctx.stroke();
          // Bottom-right
          this.ctx.beginPath();
          this.ctx.moveTo(mcx + mBracketR - mbLen, mcy + mBracketR);
          this.ctx.lineTo(mcx + mBracketR, mcy + mBracketR);
          this.ctx.lineTo(mcx + mBracketR, mcy + mBracketR - mbLen);
          this.ctx.stroke();
        }
      }
    }

    const priRole = this.selectedColony?.differentiatedRoles?.find(r => r.coord.equals(hex.pore.coord));
    const priRoleMatch = this.highlightedRoleName && priRole && (priRole.roleName === this.highlightedRoleName);
    if (this.highlightedRoleName && priRoleMatch) {
      const meta = this.getRoleMeta(priRole!.roleName);
      strokeCol = meta.color;
    }

    // 1. High-contrast hexagonal reticle ring on primary selected pore
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const px = cx + (hex.topScreenVertices[i].x - cx) * pulse;
      const py = cy + (hex.topScreenVertices[i].y - cy) * pulse;
      if (i === 0) this.ctx.moveTo(px, py); else this.ctx.lineTo(px, py);
    }
    this.ctx.closePath();
    this.ctx.strokeStyle = strokeCol;
    this.ctx.lineWidth = 3.5;
    this.ctx.shadowColor = strokeCol;
    this.ctx.shadowBlur = 10;
    this.ctx.stroke();

    // Inner gold accent ring
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const px = cx + (hex.topScreenVertices[i].x - cx) * 1.18;
      const py = cy + (hex.topScreenVertices[i].y - cy) * 1.18;
      if (i === 0) this.ctx.moveTo(px, py); else this.ctx.lineTo(px, py);
    }
    this.ctx.closePath();
    this.ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
    this.ctx.lineWidth = 1.8;
    this.ctx.shadowBlur = 4;
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;

    // Corner targeting brackets [ ] on 4 quadrant corners
    if (!this.chromaIsolationEnabled) {
      const bracketR = Math.max(16, projRadius * 1.35);
      const bLen = Math.max(8, bracketR * 0.32);
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2.4;
      // Top-left
      this.ctx.beginPath();
      this.ctx.moveTo(cx - bracketR, cy - bracketR + bLen);
      this.ctx.lineTo(cx - bracketR, cy - bracketR);
      this.ctx.lineTo(cx - bracketR + bLen, cy - bracketR);
      this.ctx.stroke();
      // Top-right
      this.ctx.beginPath();
      this.ctx.moveTo(cx + bracketR - bLen, cy - bracketR);
      this.ctx.lineTo(cx + bracketR, cy - bracketR);
      this.ctx.lineTo(cx + bracketR, cy - bracketR + bLen);
      this.ctx.stroke();
      // Bottom-left
      this.ctx.beginPath();
      this.ctx.moveTo(cx - bracketR, cy + bracketR - bLen);
      this.ctx.lineTo(cx - bracketR, cy + bracketR);
      this.ctx.lineTo(cx - bracketR + bLen, cy + bracketR);
      this.ctx.stroke();
      // Bottom-right
      this.ctx.beginPath();
      this.ctx.moveTo(cx + bracketR - bLen, cy + bracketR);
      this.ctx.lineTo(cx + bracketR, cy + bracketR);
      this.ctx.lineTo(cx + bracketR, cy + bracketR - bLen);
      this.ctx.stroke();
    }

    // 2. Vertical 3D Holographic Beacon Pin
    const pinH = Math.max(48, Math.min(85, projRadius * 2.2));
    const pinTipY = cy - pinH;

    // Vertical glowing laser tether
    const pinGrad = this.ctx.createLinearGradient(cx, cy, cx, pinTipY);
    pinGrad.addColorStop(0, strokeCol);
    pinGrad.addColorStop(1, tipCol);
    this.ctx.strokeStyle = pinGrad;
    this.ctx.lineWidth = 2.2;
    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy);
    this.ctx.lineTo(cx, pinTipY);
    this.ctx.stroke();

    // Pore surface base dot
    this.ctx.fillStyle = strokeCol;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    this.ctx.fill();

    // 3. Floating Target Billboard Badge above cell
    const pore = hex.pore;
    let label = `PORE [${pore.coord.q}, ${pore.coord.r}, ${pore.coord.z}]`;
    if (this.selectedColony && this.selectedColony.memberCoords.length > 1) {
      const col = this.selectedColony;
      const isDiff = col.isDifferentiated ?? false;
      const role = col.differentiatedRoles?.find(r => r.coord.equals(pore.coord));
      const roleStr = role ? ` • Role: ${role.roleName}` : '';
      if (isDiff) {
        label = `🧬 [METAZOAN (${col.bodyTopology}): ${col.distinctExpressionCount ?? 2} Cell Fates • ${col.memberCoords.length} Pores${roleStr}]`;
      } else {
        label = `🟣 [COLONY (${col.bodyTopology}): Isogenic • ${col.memberCoords.length} Pores • ${col.totalEnergy}T]`;
      }
    } else if (pore.state === PoreState.OCCUPIED) {
      const taxon = pore.speciesTaxon ?? TaxonomyNomenclature.classify({
        tapeBitstring: pore.tapeBitstring,
        gateTypes: pore.gateTypes,
        generation: pore.generation,
        isBasalt: pore.isBasalt,
        hasOrganelle: pore.hasOrganelle,
        isSyncytium: pore.isSyncytium
      });
      label = `🎯 ${taxon.binomialName} [${pore.coord.q},${pore.coord.r},${pore.coord.z}]`;
    } else if (pore.state === PoreState.CARCASS) {
      label = `💀 CARCASS [${pore.coord.q},${pore.coord.r},${pore.coord.z}]`;
    } else if (pore.isBasalt) {
      label = `🧱 BASALT BEDROCK [${pore.coord.q},${pore.coord.r},${pore.coord.z}]`;
    } else if (pore.coord.z < 0) {
      label = `🕳️ SUBTERRANEAN CAVERN [${pore.coord.q},${pore.coord.r},${pore.coord.z}]`;
    } else {
      label = `⭕ VACANT PORE [${pore.coord.q},${pore.coord.r},${pore.coord.z}]`;
    }

    this.ctx.font = 'bold 11px monospace';
    const textW = this.ctx.measureText(label).width;
    const pillW = textW + 22;
    const pillH = 22;
    const pillX = Math.max(10, Math.min(w - pillW - 10, cx - pillW / 2));
    const pillY = Math.max(10, pinTipY - pillH - 5);

    // Pill background container
    this.ctx.fillStyle = 'rgba(6, 15, 30, 0.94)';
    this.ctx.strokeStyle = this.selectedColony && this.selectedColony.memberCoords.length > 1 ? '#a855f7' : strokeCol;
    this.ctx.lineWidth = 1.8;
    this.ctx.beginPath();
    this.ctx.roundRect(pillX, pillY, pillW, pillH, 6);
    this.ctx.fill();
    this.ctx.stroke();

    // Downward pointer triangle
    this.ctx.beginPath();
    this.ctx.moveTo(cx - 5, pillY + pillH);
    this.ctx.lineTo(cx + 5, pillY + pillH);
    this.ctx.lineTo(cx, pinTipY);
    this.ctx.closePath();
    this.ctx.fillStyle = this.selectedColony && this.selectedColony.memberCoords.length > 1 ? '#a855f7' : strokeCol;
    this.ctx.fill();

    // Pill label text
    this.ctx.fillStyle = '#ffffff';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(label, pillX + pillW / 2, pillY + 15);

    this.lastBillboardRect = {
      x: pillX,
      y: pillY,
      w: pillW,
      h: pillH,
      topology: this.selectedColony?.bodyTopology ?? null
    };

    this.ctx.restore();
  }

  private drawPelagicSpore(cx: number, cy: number, radius: number): void {
    const r = Math.max(3, radius * 0.25 * (1.0 + 0.15 * Math.sin(this.plumeTime * 4)));
    const grad = this.ctx.createRadialGradient(cx, cy, 1, cx, cy, r * 2.0);
    grad.addColorStop(0, '#fef08a'); grad.addColorStop(0.6, '#eab308'); grad.addColorStop(1, 'rgba(234, 179, 8, 0)');
    this.ctx.fillStyle = grad; this.ctx.beginPath();
    this.ctx.arc(cx, cy, r * 2.0, 0, Math.PI * 2); this.ctx.fill();
  }

  private drawDynamicActionBorders(hex: IProjectedHex, radius: number): void {
    const key = hex.pore.coord.toKey();

    // 1. Endosymbiotic Organelle Eukaryote State (Double Concentric Halo & Crest)
    if (hex.pore.hasOrganelle && hex.pore.state === PoreState.OCCUPIED) {
      const breathRate = this.calmMotionEnabled ? 1.8 : 3.0;
      const breath = 1.05 + 0.05 * Math.sin(this.plumeTime * breathRate);
      // Outer golden radiant halo
      this.ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const px = hex.centerScreen.x + (hex.topScreenVertices[i].x - hex.centerScreen.x) * breath;
        const py = hex.centerScreen.y + (hex.topScreenVertices[i].y - hex.centerScreen.y) * breath;
        if (i === 0) this.ctx.moveTo(px, py); else this.ctx.lineTo(px, py);
      }
      this.ctx.closePath();
      this.ctx.strokeStyle = '#facc15';
      this.ctx.lineWidth = 2.0;
      this.ctx.stroke();

      // Inner emerald metabolic membrane
      this.ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const px = hex.centerScreen.x + (hex.topScreenVertices[i].x - hex.centerScreen.x) * 0.92;
        const py = hex.centerScreen.y + (hex.topScreenVertices[i].y - hex.centerScreen.y) * 0.92;
        if (i === 0) this.ctx.moveTo(px, py); else this.ctx.lineTo(px, py);
      }
      this.ctx.closePath();
      this.ctx.strokeStyle = '#10b981';
      this.ctx.lineWidth = 1.6;
      this.ctx.stroke();

      // Floating organelle beacon crest above pore
      if (radius >= 9) {
        this.ctx.fillStyle = '#fef08a';
        this.ctx.font = 'bold 9px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🧬', hex.centerScreen.x, hex.centerScreen.y - radius * 0.85);
      }
    }

    // 2. Active Predation Attack (Prey Under Lysis Distress - calmed from chaotic 14.0 rad/s)
    if (this.activePreyCoords.has(key)) {
      const distressSpeed = this.calmMotionEnabled ? 3.5 : 5.5;
      const distressAmp = this.calmMotionEnabled ? 0.07 : 0.12;
      const distressPulse = 1.0 + distressAmp * Math.sin(this.plumeTime * distressSpeed);
      this.ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const px = hex.centerScreen.x + (hex.topScreenVertices[i].x - hex.centerScreen.x) * distressPulse;
        const py = hex.centerScreen.y + (hex.topScreenVertices[i].y - hex.centerScreen.y) * distressPulse;
        if (i === 0) this.ctx.moveTo(px, py); else this.ctx.lineTo(px, py);
      }
      this.ctx.closePath();
      this.ctx.strokeStyle = '#f43f5e';
      this.ctx.lineWidth = 2.6;
      this.ctx.stroke();
    }

    // 3. Active Predator Striking (Intake Rose Ring)
    if (this.activePredatorCoords.has(key)) {
      this.ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const px = hex.centerScreen.x + (hex.topScreenVertices[i].x - hex.centerScreen.x) * 1.06;
        const py = hex.centerScreen.y + (hex.topScreenVertices[i].y - hex.centerScreen.y) * 1.06;
        if (i === 0) this.ctx.moveTo(px, py); else this.ctx.lineTo(px, py);
      }
      this.ctx.closePath();
      this.ctx.strokeStyle = '#fb7185';
      this.ctx.lineWidth = 2.0;
      this.ctx.stroke();
    }

    // 4. Scavenging Detritus Assimilation (Living Cell Ingesting Carcass)
    if (this.activeScavengers.has(key)) {
      const scavRate = this.calmMotionEnabled ? 2.0 : 3.5;
      const scavPulse = 1.0 + (this.calmMotionEnabled ? 0.04 : 0.07) * Math.sin(this.plumeTime * scavRate);
      this.ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const px = hex.centerScreen.x + (hex.topScreenVertices[i].x - hex.centerScreen.x) * scavPulse;
        const py = hex.centerScreen.y + (hex.topScreenVertices[i].y - hex.centerScreen.y) * scavPulse;
        if (i === 0) this.ctx.moveTo(px, py); else this.ctx.lineTo(px, py);
      }
      this.ctx.closePath();
      this.ctx.strokeStyle = '#f59e0b';
      this.ctx.lineWidth = 1.8;
      this.ctx.setLineDash([4, 3]);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }

    // 5. Chemiosmotic Vent Feeding (Inward Electric Cyan Pulse)
    if (this.activeVentFeeders.has(key)) {
      const ventRate = this.calmMotionEnabled ? 2.5 : 4.2;
      const ventPulse = 0.96 + (this.calmMotionEnabled ? 0.04 : 0.07) * Math.sin(this.plumeTime * ventRate);
      this.ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const px = hex.centerScreen.x + (hex.topScreenVertices[i].x - hex.centerScreen.x) * ventPulse;
        const py = hex.centerScreen.y + (hex.topScreenVertices[i].y - hex.centerScreen.y) * ventPulse;
        if (i === 0) this.ctx.moveTo(px, py); else this.ctx.lineTo(px, py);
      }
      this.ctx.closePath();
      this.ctx.strokeStyle = '#00e5ff';
      this.ctx.lineWidth = 1.8;
      this.ctx.stroke();
    }

    // 6. Syncytial Cytoplasmic Sharing (Colonies vs. Differentiated Multicellular Metazoans)
    if (hex.pore.isSyncytium && hex.pore.state === PoreState.OCCUPIED) {
      const col = this.colonyByCoordKey.get(key);
      const isDiff = col?.isDifferentiated ?? false;
      const role = col?.differentiatedRoles?.find(r => r.coord.equals(hex.pore.coord));

      if (isDiff && role) {
        const isRoleMatch = this.highlightedRoleName && (role.roleName === this.highlightedRoleName);
        if (this.highlightedRoleName && !isRoleMatch) {
          // In role isolation mode, suppress action borders and glyphs on non-specific cells!
          return;
        }

        const meta = this.getRoleMeta(role.roleName);
        const strokeColor = meta.color;
        const glyph = meta.glyph;

        const synRate = this.calmMotionEnabled ? 1.4 : 2.2;
        const synPulse = 1.05 + (this.calmMotionEnabled ? 0.03 : 0.06) * Math.sin(this.plumeTime * synRate);
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const px = hex.centerScreen.x + (hex.topScreenVertices[i].x - hex.centerScreen.x) * synPulse;
          const py = hex.centerScreen.y + (hex.topScreenVertices[i].y - hex.centerScreen.y) * synPulse;
          if (i === 0) this.ctx.moveTo(px, py); else this.ctx.lineTo(px, py);
        }
        this.ctx.closePath();
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = isRoleMatch ? 4.5 : 2.5;
        this.ctx.shadowColor = strokeColor;
        this.ctx.shadowBlur = isRoleMatch ? 16 : 6;
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;

        if (radius >= 10 && glyph) {
          this.ctx.fillStyle = strokeColor;
          this.ctx.font = isRoleMatch ? 'bold 13px sans-serif' : 'bold 10px sans-serif';
          this.ctx.textAlign = 'center';
          this.ctx.fillText(glyph, hex.centerScreen.x, hex.centerScreen.y - radius * 0.85);
        }
      } else {
        // Undifferentiated Colonial Syncytium (Isogenic biofilm)
        const synRate = this.calmMotionEnabled ? 1.6 : 2.6;
        const synPulse = 1.03 + (this.calmMotionEnabled ? 0.03 : 0.05) * Math.sin(this.plumeTime * synRate);
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const px = hex.centerScreen.x + (hex.topScreenVertices[i].x - hex.centerScreen.x) * synPulse;
          const py = hex.centerScreen.y + (hex.topScreenVertices[i].y - hex.centerScreen.y) * synPulse;
          if (i === 0) this.ctx.moveTo(px, py); else this.ctx.lineTo(px, py);
        }
        this.ctx.closePath();
        this.ctx.strokeStyle = '#8b5cf6';
        this.ctx.lineWidth = 1.8;
        this.ctx.stroke();
      }
    }

    // 7. Landauer Dissipation Shimmer (Gate Toggles This Tick)
    if (this.activeLandauerToggles.has(key)) {
      const shimmerRate = this.calmMotionEnabled ? 4 : 6;
      const shimmer = (this.plumeTime * shimmerRate) % 1.0;
      if (shimmer < 0.5) {
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const px = hex.centerScreen.x + (hex.topScreenVertices[i].x - hex.centerScreen.x) * 1.02;
          const py = hex.centerScreen.y + (hex.topScreenVertices[i].y - hex.centerScreen.y) * 1.02;
          if (i === 0) this.ctx.moveTo(px, py); else this.ctx.lineTo(px, py);
        }
        this.ctx.closePath();
        this.ctx.strokeStyle = 'rgba(251, 146, 60, 0.75)';
        this.ctx.lineWidth = 1.4;
        this.ctx.stroke();
      }
    }
  }

  private drawEcologicalDramaBeams(hexes: IProjectedHex[], telemetry: ISimulationTelemetry): void {
    const hasTrophic = this.filterShowTrophicRays && (
      (telemetry.predationEvents && telemetry.predationEvents.length > 0) ||
      (telemetry.scavengeEvents && telemetry.scavengeEvents.length > 0)
    );
    const hasEndo = this.filterSyncytium !== 'off' && telemetry.endosymbiosisEvents && telemetry.endosymbiosisEvents.length > 0;
    const hasSyncytium = this.filterSyncytium !== 'off' && telemetry.syncytialColonies && telemetry.syncytialColonies.length > 0;
    const hasSpores = telemetry.sporeEjections && telemetry.sporeEjections.length > 0;

    if (this.isStudioMode || (!hasTrophic && !hasEndo && !hasSyncytium && !hasSpores)) {
      return;
    }

    const hexMap = new Map<string, IProjectedHex>();
    for (const h of hexes) hexMap.set(h.pore.coord.toKey(), h);

    this.ctx.save();

    // 1. Predatory Siphon Beams (Active Predation Strikes)
    if (this.filterShowTrophicRays && telemetry.predationEvents && telemetry.predationEvents.length > 0) {
      for (const pred of telemetry.predationEvents) {
        const predatorHex = hexMap.get(pred.predatorCoord.toKey());
        const preyHex = hexMap.get(pred.preyCoord.toKey());
        if (!predatorHex || !preyHex) continue;

        const x1 = preyHex.centerScreen.x, y1 = preyHex.centerScreen.y;
        const x2 = predatorHex.centerScreen.x, y2 = predatorHex.centerScreen.y;

        // Intense predatory arc / laser
        this.ctx.strokeStyle = 'rgba(244, 63, 94, 0.75)';
        this.ctx.lineWidth = 3.5;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();

        // Hot white laser core
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1.2;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();

        // Directional chevrons along beam pointing into predator
        const dx = x2 - x1, dy = y2 - y1;
        const beamLen = Math.hypot(dx, dy);
        if (beamLen > 12) {
          const ux = dx / beamLen, uy = dy / beamLen;
          const px = -uy, py = ux;
          const chevronSpeed = this.calmMotionEnabled ? 1.0 : 2.0;
          for (let step = 0.25; step <= 0.75; step += 0.25) {
            const flowOffset = ((this.plumeTime * chevronSpeed) % 0.25);
            const t = ((step + flowOffset) % 0.8) + 0.1;
            const cx = x1 + dx * t, cy = y1 + dy * t;
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 1.6;
            this.ctx.beginPath();
            this.ctx.moveTo(cx - ux * 6 + px * 3.5, cy - uy * 6 + py * 3.5);
            this.ctx.lineTo(cx, cy);
            this.ctx.lineTo(cx - ux * 6 - px * 3.5, cy - uy * 6 - py * 3.5);
            this.ctx.stroke();
          }
        }

        // Animated pulses flowing into predator
        const pulseSpeed = this.calmMotionEnabled ? 1.5 : 3.0;
        const flow = (this.plumeTime * pulseSpeed) % 1.0;
        const pulseX = x1 + dx * flow;
        const pulseY = y1 + dy * flow;
        this.ctx.fillStyle = '#f43f5e';
        this.ctx.beginPath();
        this.ctx.arc(pulseX, pulseY, 3.5, 0, Math.PI * 2);
        this.ctx.fill();

        // Predator Intake Nozzle at (x2, y2)
        this.ctx.strokeStyle = '#f43f5e';
        this.ctx.lineWidth = 2.0;
        this.ctx.beginPath();
        this.ctx.arc(x2, y2, 8 + 3 * Math.sin(this.plumeTime * (this.calmMotionEnabled ? 3.5 : 7.0)), 0, Math.PI * 2);
        this.ctx.stroke();

        // Prey Distress / Lysis Ring at (x1, y1)
        if (pred.preyKilled || preyHex.pore.state === PoreState.CARCASS || preyHex.pore.state === PoreState.EMPTY) {
          // Lysis flash
          this.ctx.strokeStyle = 'rgba(251, 113, 133, 0.9)';
          this.ctx.lineWidth = 2.5;
          this.ctx.beginPath();
          this.ctx.arc(x1, y1, 14 + 5 * Math.sin(this.plumeTime * (this.calmMotionEnabled ? 5.0 : 10.0)), 0, Math.PI * 2);
          this.ctx.stroke();

          this.ctx.fillStyle = '#f43f5e';
          this.ctx.font = 'bold 9px monospace';
          this.ctx.textAlign = 'center';
          this.ctx.fillText('⚡ LYSIS', x1, y1 - 18);
        } else {
          this.ctx.strokeStyle = '#fb7185';
          this.ctx.lineWidth = 1.5;
          this.ctx.beginPath();
          this.ctx.arc(x1, y1, 10 + 3 * Math.sin(this.plumeTime * (this.calmMotionEnabled ? 4.5 : 8.0)), 0, Math.PI * 2);
          this.ctx.stroke();
        }
      }
    }

    // 2. Lynn Margulis Endosymbiotic Macro-Silicoid Syncytial Bridges
    if (this.filterSyncytium !== 'off' && telemetry.endosymbiosisEvents && telemetry.endosymbiosisEvents.length > 0) {
      for (const endo of telemetry.endosymbiosisEvents) {
        const hA = hexMap.get(endo.coordA.toKey());
        const hB = hexMap.get(endo.coordB.toKey());
        if (!hA || !hB) continue;

        // Wide luminous symbiotic cytoplasm conduit
        this.ctx.strokeStyle = 'rgba(139, 92, 246, 0.7)';
        this.ctx.lineWidth = 6.0;
        this.ctx.beginPath();
        this.ctx.moveTo(hA.centerScreen.x, hA.centerScreen.y);
        this.ctx.lineTo(hB.centerScreen.x, hB.centerScreen.y);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#c084fc';
        this.ctx.lineWidth = 2.0;
        this.ctx.stroke();
      }
    }

    // Continuous syncytial bridges and envelopes for established macro-silicoids
    if (this.filterSyncytium !== 'off' && telemetry.syncytialColonies && telemetry.syncytialColonies.length > 0) {
      for (const col of telemetry.syncytialColonies) {
        if (col.memberCoords.length < 2) continue;
        const memberKeySet = new Set(col.memberCoords.map(c => c.toKey()));

        for (const c of col.memberCoords) {
          const aKey = c.toKey();
          const a = hexMap.get(aKey);
          if (!a) continue;

          for (const en of SeafloorRenderer3D.EDGE_NEIGHBORS) {
            const nbKey = `${c.q + en.dq},${c.r + en.dr},${c.z}`;
            if (nbKey > aKey && memberKeySet.has(nbKey)) {
              const b = hexMap.get(nbKey);
              if (!b) continue;

              const ax = a.centerScreen.x, ay = a.centerScreen.y;
              const bx = b.centerScreen.x, by = b.centerScreen.y;

              const isDirectlyConnected = this.selectedCoord !== null &&
                (a.pore.coord.equals(this.selectedCoord) || b.pore.coord.equals(this.selectedCoord));

              if (this.filterSyncytium === 'selected' && !isDirectlyConnected) {
                continue; // completely hide unselected conduits in 'selected' clarity mode
              }

              if (this.selectedCoord !== null && !isDirectlyConnected) {
                // Background syncytial network: render thin, subtle, non-intrusive filament
                this.ctx.strokeStyle = 'rgba(139, 92, 246, 0.16)';
                this.ctx.lineWidth = 1.2;
                this.ctx.beginPath();
                this.ctx.moveTo(ax, ay);
                this.ctx.lineTo(bx, by);
                this.ctx.stroke();
                continue; // Skip animated glowing beads on background edges to eliminate visual clutter
              }

              if (this.activeLensMode === 'vascular') {
                // Curved quadratic Bézier conduits connecting adjacent pores
                const midX = (ax + bx) / 2 + Math.sin(this.plumeTime * 2.0 + c.q * 1.5) * 3.5;
                const midY = (ay + by) / 2 + Math.cos(this.plumeTime * 2.0 + c.r * 1.5) * 3.5;
                const energySum = a.pore.energy + b.pore.energy;
                const tubeWidth = Math.max(3.5, Math.min(13, energySum * 0.08));

                const drawCurvedPath = () => {
                  this.ctx.beginPath();
                  this.ctx.moveTo(ax, ay);
                  if (typeof this.ctx.quadraticCurveTo === 'function') {
                    this.ctx.quadraticCurveTo(midX, midY, bx, by);
                  } else {
                    this.ctx.lineTo(bx, by);
                  }
                };

                // Outer translucent hydraulic jacket
                drawCurvedPath();
                this.ctx.strokeStyle = '#c084fc';
                this.ctx.lineWidth = tubeWidth;
                this.ctx.lineCap = 'round';
                this.ctx.globalAlpha = isDirectlyConnected ? 0.85 : 0.55;
                this.ctx.stroke();

                // Inner luminous core line
                drawCurvedPath();
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = Math.max(1.2, tubeWidth * 0.32);
                this.ctx.globalAlpha = 0.90;
                this.ctx.stroke();

                // Directional animated shuttle streaming chevrons
                drawCurvedPath();
                this.ctx.strokeStyle = '#fef08a';
                this.ctx.lineWidth = 1.8;
                this.ctx.setLineDash([4, 6]);
                this.ctx.lineDashOffset = -this.plumeTime * 14;
                this.ctx.globalAlpha = 0.85;
                this.ctx.stroke();
                this.ctx.setLineDash([]);
                continue;
              }

              // Lens-aware width and style:
              let outerWidth = isDirectlyConnected ? 5.5 : (this.calmMotionEnabled ? 2.0 : 2.8);
              let outerAlpha = isDirectlyConnected ? 0.90 : 0.35;
              let innerWidth = isDirectlyConnected ? 2.5 : 1.2;

              if (this.activeLensMode === 'plasmodium' || this.activeLensMode === 'hybrid') {
                // Organic slime mold fleshy syncytial bridge
                outerWidth = Math.max(7.0, Math.min(22.0, isDirectlyConnected ? 12.0 : 8.5));
                outerAlpha = isDirectlyConnected ? 0.75 : 0.42;
                innerWidth = Math.max(2.0, outerWidth * 0.35);
              }

              // Outer glowing envelope conduit
              this.ctx.strokeStyle = (this.activeLensMode === 'plasmodium' || this.activeLensMode === 'hybrid')
                ? `rgba(16, 185, 129, ${outerAlpha})`
                : `rgba(139, 92, 246, ${outerAlpha})`;
              this.ctx.lineWidth = outerWidth;
              this.ctx.lineCap = 'round';
              this.ctx.lineJoin = 'round';
              this.ctx.beginPath();
              this.ctx.moveTo(ax, ay);
              this.ctx.lineTo(bx, by);
              this.ctx.stroke();

              // Inner luminous core
              this.ctx.strokeStyle = isDirectlyConnected ? '#ffffff' : ((this.activeLensMode === 'plasmodium') ? '#6ee7b7' : '#d8b4fe');
              this.ctx.lineWidth = innerWidth;
              this.ctx.lineCap = 'round';
              this.ctx.beginPath();
              this.ctx.moveTo(ax, ay);
              this.ctx.lineTo(bx, by);
              this.ctx.stroke();

              // Animated cytoplasmic streaming beads: only on connected conduits or small colonies
              if (this.filterShowStreamingBeads && (isDirectlyConnected || col.memberCoords.length <= 25)) {
                const streamSpeed = this.calmMotionEnabled ? 1.0 : 1.8;
                const streamT = (Math.sin(this.plumeTime * streamSpeed + c.q + c.r) + 1.0) / 2.0;
                const sx = ax + (bx - ax) * streamT;
                const sy = ay + (by - ay) * streamT;

                this.ctx.fillStyle = '#ffffff';
                this.ctx.beginPath();
                this.ctx.arc(sx, sy, isDirectlyConnected ? 3.0 : 1.8, 0, Math.PI * 2);
                this.ctx.fill();

                if (isDirectlyConnected) {
                  this.ctx.fillStyle = '#a855f7';
                  this.ctx.beginPath();
                  this.ctx.arc(sx, sy, 4.2, 0, Math.PI * 2);
                  this.ctx.strokeStyle = '#e9d5ff';
                  this.ctx.lineWidth = 1.0;
                  this.ctx.stroke();
                }
              }
            }
          }
        }
      }
    }

    // 3. Pelagic Spore Launch Bursts
    if (telemetry.sporeEjections && telemetry.sporeEjections.length > 0) {
      for (const ej of telemetry.sporeEjections) {
        const src = hexMap.get(ej.sourceCoord.toKey());
        const tgt = hexMap.get(ej.targetCoord.toKey());
        if (!src) continue;

        // Expanding ionization flash at launch site
        this.ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
        this.ctx.lineWidth = 2.0;
        this.ctx.beginPath();
        this.ctx.arc(src.centerScreen.x, src.centerScreen.y, 16 + 6 * Math.sin(this.plumeTime * 6), 0, Math.PI * 2);
        this.ctx.stroke();

        if (tgt) {
          // Buoyant ascent tracer upward into water
          this.ctx.strokeStyle = 'rgba(253, 224, 71, 0.6)';
          this.ctx.lineWidth = 2.0;
          this.ctx.setLineDash([2, 4]);
          this.ctx.beginPath();
          this.ctx.moveTo(src.centerScreen.x, src.centerScreen.y);
          this.ctx.lineTo(tgt.centerScreen.x, tgt.centerScreen.y);
          this.ctx.stroke();
          this.ctx.setLineDash([]);
        }
      }
    }

    // 4. Scavenging Nutrient Streams (Carcasses -> Living Benthic Cells)
    const occupied = hexes.filter(h => h.pore.state === PoreState.OCCUPIED);
    const carcasses = hexes.filter(h => h.pore.state === PoreState.CARCASS);

    if (this.filterShowTrophicRays && carcasses.length > 0 && occupied.length > 0) {
      for (const carc of carcasses) {
        for (const occ of occupied) {
          if (carc.pore.coord.distanceTo(occ.pore.coord) === 1) {
            const dx = occ.centerScreen.x - carc.centerScreen.x;
            const dy = occ.centerScreen.y - carc.centerScreen.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 5 && dist < 250) {
              const flowPhase = (this.plumeTime * 2.2) % 1.0;
              const px = carc.centerScreen.x + dx * flowPhase;
              const py = carc.centerScreen.y + dy * flowPhase;

              this.ctx.strokeStyle = 'rgba(245, 158, 11, 0.28)';
              this.ctx.lineWidth = 1;
              this.ctx.setLineDash([3, 4]);
              this.ctx.beginPath();
              this.ctx.moveTo(carc.centerScreen.x, carc.centerScreen.y);
              this.ctx.lineTo(occ.centerScreen.x, occ.centerScreen.y);
              this.ctx.stroke();

              this.ctx.setLineDash([]);
              this.ctx.fillStyle = '#fbbf24';
              this.ctx.beginPath();
              this.ctx.arc(px, py, 2.5, 0, Math.PI * 2);
              this.ctx.fill();
            }
          }
        }
      }
    }

    this.ctx.restore();
  }

  private drawSilicoidOrganism(hex: IProjectedHex, radius: number, isSelected: boolean): void {
    const origAlpha = this.ctx.globalAlpha;
    const isColonyMember = this.selectedColonyMemberKeys.has(hex.pore.coord.toKey());
    const isTarget = this.isChromaTarget(hex.pore.coord, isSelected);
    const isIsolated = this.isChromaIsolated();

    if (isIsolated && !isTarget) {
      // Chroma isolation: draw non-target silicoids in subdued monochrome gray
      this.ctx.globalAlpha = origAlpha * 0.20;
      const cx = hex.centerScreen.x, cy = hex.centerScreen.y;
      const safeRadius = Math.min(65, Math.max(3, radius));
      const bodyR = Math.min(45, Math.max(3, safeRadius * 0.70));
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, bodyR, 0, Math.PI * 2);
      this.ctx.fillStyle = '#0f172a';
      this.ctx.fill();
      this.ctx.strokeStyle = '#334155';
      this.ctx.lineWidth = 1.0;
      this.ctx.stroke();
      this.ctx.globalAlpha = origAlpha;
      return;
    }

    if (this.selectedCoord !== null && !isTarget) {
      // Focus dimming: Dim non-selected cells so target silicoid and its colony pop with high contrast
      this.ctx.globalAlpha = origAlpha * (this.calmMotionEnabled ? 0.40 : 0.55);
    }

    const col = this.colonyByCoordKey.get(hex.pore.coord.toKey());
    const cx = hex.centerScreen.x, cy = hex.centerScreen.y;
    // Strictly clamp cell body radius so close cells never balloon across screen
    const safeRadius = Math.min(65, Math.max(3, radius));
    const bodyR = Math.min(45, Math.max(3, safeRadius * 0.70));
    const charge = Math.min(1.0, hex.pore.energy / 100);

    let phase = hex.pore.coord.q * 1.7 + hex.pore.coord.r * 2.3 + (hex.pore.coord.z || 0) * 3.1;
    let breathRate = this.calmMotionEnabled ? 1.2 : 2.0;
    let breathAmp = this.calmMotionEnabled ? 0.03 : 0.05;

    if (col) {
      if (this.activeLensMode !== 'lattice') {
        // Traveling peristaltic contraction wave across syncytial colony
        const waveOffset = hex.pore.coord.q * 0.7 + hex.pore.coord.r * 1.1;
        const cellPhase = this.plumeTime * (this.calmMotionEnabled ? 1.4 : 2.5) - waveOffset * 0.45;
        phase = cellPhase;
        breathRate = 1.0;
        breathAmp = this.calmMotionEnabled ? 0.08 : 0.16;
      } else {
        // Synchronized respiration pulse for all members of the multi-pore colony / syncytium
        const hash = Math.abs(col.colonyId.split('').reduce((acc: number, ch: string) => (acc * 31 + ch.charCodeAt(0)) | 0, 0));
        phase = (hash % 1000) * 0.01;
        breathRate = this.calmMotionEnabled ? 1.0 : 1.6;
        breathAmp = this.calmMotionEnabled ? 0.04 : 0.07;
      }
    }

    const breath = 1.0 + breathAmp * Math.sin(this.plumeTime * breathRate + phase);

    // Potential Lens Continuous Scalar Heatmap Pass
    if (this.activeLensMode === 'potential') {
      const fieldR = Math.min(85, bodyR * breath * 2.3);
      const grad = this.ctx.createRadialGradient(cx, cy, bodyR * 0.2, cx, cy, fieldR);
      const ratio = Math.min(1.0, hex.pore.energy / 100);
      const hasActiveOperon = hex.pore.operonStates?.some(Boolean) || hex.pore.primaryActive;
      if (hasActiveOperon || ratio > 0.7) {
        grad.addColorStop(0, 'rgba(244, 63, 94, 0.70)');
        grad.addColorStop(0.55, 'rgba(245, 158, 11, 0.35)');
        grad.addColorStop(1, 'transparent');
      } else if (ratio > 0.35) {
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.60)');
        grad.addColorStop(0.55, 'rgba(16, 185, 129, 0.30)');
        grad.addColorStop(1, 'transparent');
      } else {
        grad.addColorStop(0, 'rgba(139, 92, 246, 0.50)');
        grad.addColorStop(0.55, 'rgba(30, 27, 75, 0.20)');
        grad.addColorStop(1, 'transparent');
      }
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, fieldR, 0, Math.PI * 2);
      this.ctx.fillStyle = grad;
      this.ctx.globalAlpha = origAlpha * 0.75;
      this.ctx.fill();
      this.ctx.globalAlpha = origAlpha;
    }

    // Differentiated Anatomical Role Isolation Mode
    if (this.highlightedRoleName) {
      const role = col?.differentiatedRoles?.find((r: { coord: HexCoord3D; roleName: string }) => r.coord.equals(hex.pore.coord));
      const isRoleMatch = role && (role.roleName === this.highlightedRoleName);

      if (!isRoleMatch) {
        if (this.muteNonSpecificRoles) {
          // Heavily muted non-specific cell: translucent dark slate disc with faint boundary
          this.ctx.globalAlpha = origAlpha * 0.16;
          this.ctx.beginPath();
          this.ctx.arc(cx, cy, bodyR, 0, Math.PI * 2);
          this.ctx.fillStyle = '#0f172a';
          this.ctx.fill();
          this.ctx.strokeStyle = 'rgba(71, 85, 105, 0.30)';
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();

          this.ctx.fillStyle = 'rgba(71, 85, 105, 0.35)';
          this.ctx.beginPath();
          this.ctx.arc(cx, cy, Math.max(1.5, bodyR * 0.16), 0, Math.PI * 2);
          this.ctx.fill();

          this.ctx.globalAlpha = origAlpha;
          return;
        }
      } else if (role) {
        // Matching tissue role cell: vibrant, luminous, high-contrast!
        const roleMeta = this.getRoleMeta(role.roleName);
        this.ctx.globalAlpha = origAlpha;

        // 1. Radiant Role Bioluminescent Aura
        const auraR = Math.min(65, bodyR * breath * 1.45);
        const auraGrad = this.ctx.createRadialGradient(cx, cy, bodyR * 0.3, cx, cy, auraR);
        auraGrad.addColorStop(0, roleMeta.color);
        auraGrad.addColorStop(0.65, roleMeta.color);
        auraGrad.addColorStop(1, 'transparent');
        this.ctx.fillStyle = auraGrad;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, auraR, 0, Math.PI * 2);
        this.ctx.fill();

        // 2. Cell body & membrane
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, bodyR * breath, 0, Math.PI * 2);
        const cytoGrad = this.ctx.createRadialGradient(cx, cy, bodyR * 0.1, cx, cy, bodyR * breath);
        cytoGrad.addColorStop(0, '#1e293b');
        cytoGrad.addColorStop(0.60, '#0f172a');
        cytoGrad.addColorStop(1, roleMeta.color);
        this.ctx.fillStyle = cytoGrad;
        this.ctx.fill();

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2.8;
        this.ctx.shadowColor = roleMeta.color;
        this.ctx.shadowBlur = 14;
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;

        // 3. Central bright nucleus core
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, Math.max(2.5, bodyR * 0.22), 0, Math.PI * 2);
        this.ctx.fill();

        // 4. Centered Role Glyph
        if (radius >= 8 && roleMeta.glyph) {
          this.ctx.fillStyle = roleMeta.color;
          this.ctx.font = 'bold 12px sans-serif';
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText(roleMeta.glyph, cx, cy);
        }

        this.ctx.globalAlpha = origAlpha;
        return;
      }
    }

    const taxon = hex.pore.speciesTaxon ?? TaxonomyNomenclature.classify({
      tapeBitstring: hex.pore.tapeBitstring,
      gateTypes: hex.pore.gateTypes,
      generation: hex.pore.generation,
      isBasalt: hex.pore.isBasalt,
      hasOrganelle: hex.pore.hasOrganelle,
      isSyncytium: hex.pore.isSyncytium
    });

    // 1. Outer bioluminescent energetic aura with taxonomic species signature
    if (this.filterShowAuras) {
      const auraR = Math.min(60, bodyR * breath * 1.30);
      const auraGrad = this.ctx.createRadialGradient(cx, cy, bodyR * 0.35, cx, cy, auraR);
      auraGrad.addColorStop(0, taxon.auraColor);
      auraGrad.addColorStop(0.65, taxon.accentColor);
      auraGrad.addColorStop(1, 'transparent');
      this.ctx.fillStyle = auraGrad;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, auraR, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 2. Cellular lipid membrane & cytoplasm body - Dynamic Multi-Lens Morphological Depiction!
    if (this.activeLensMode === 'plasmodium' || this.activeLensMode === 'hybrid') {
      // 🦠 PLASMODIUM & HYBRID LENS: Organic Amoeboid Syncytial Slime Hull
      // Multi-harmonic undulating boundary with traveling peristaltic contraction waves
      const steps = 18;
      const pts: { x: number; y: number }[] = [];
      const waveFreq = this.calmMotionEnabled ? 1.4 : 2.5;
      const slimePulse = this.plumeTime * waveFreq + phase;

      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        const harmonic1 = 0.14 * Math.sin(3 * theta + slimePulse);
        const harmonic2 = 0.08 * Math.cos(5 * theta - slimePulse * 0.7);
        const harmonic3 = 0.04 * Math.sin(7 * theta + slimePulse * 1.3);
        const r = bodyR * breath * (1.0 + harmonic1 + harmonic2 + harmonic3);
        pts.push({
          x: cx + Math.cos(theta) * r,
          y: cy + Math.sin(theta) * r
        });
      }

      this.ctx.beginPath();
      this.ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        const pPrev = pts[i - 1];
        const pCurr = pts[i];
        const midX = (pPrev.x + pCurr.x) / 2;
        const midY = (pPrev.y + pCurr.y) / 2;
        if (typeof this.ctx.quadraticCurveTo === 'function') {
          this.ctx.quadraticCurveTo(pPrev.x, pPrev.y, midX, midY);
        } else {
          this.ctx.lineTo(midX, midY);
        }
      }
      this.ctx.closePath();

      const cytoGrad = this.ctx.createRadialGradient(cx, cy, bodyR * 0.10, cx, cy, bodyR * breath * 1.25);
      cytoGrad.addColorStop(0, taxon.auraColor);
      cytoGrad.addColorStop(0.60, taxon.accentColor);
      cytoGrad.addColorStop(1, 'rgba(16, 185, 129, 0.15)');
      this.ctx.fillStyle = cytoGrad;
      this.ctx.globalAlpha = origAlpha * (this.activeLensMode === 'hybrid' ? 0.75 : 0.88);
      this.ctx.fill();

      this.ctx.strokeStyle = isSelected ? '#ffffff' : (isColonyMember ? '#6ee7b7' : taxon.accentColor);
      this.ctx.lineWidth = isSelected ? 3.2 : (isColonyMember ? 2.5 : 1.8);
      this.ctx.shadowColor = taxon.accentColor;
      this.ctx.shadowBlur = 10;
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;
      this.ctx.globalAlpha = origAlpha;

    } else if (this.activeLensMode === 'vascular') {
      // 🧬 VASCULAR RIBBON LENS: Central Hydraulic Pumping Node
      const nodeR = Math.max(3.5, bodyR * 0.58);
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, nodeR, 0, Math.PI * 2);
      this.ctx.fillStyle = '#1e1b4b'; // Deep indigo vascular chamber
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(cx, cy, nodeR * (1.0 + 0.10 * Math.sin(this.plumeTime * 4.0 + phase)), 0, Math.PI * 2);
      this.ctx.strokeStyle = '#c084fc'; // Royal violet
      this.ctx.lineWidth = isSelected ? 2.8 : 1.8;
      this.ctx.stroke();

    } else if (this.activeLensMode === 'potential') {
      // 🌌 METABOLIC POTENTIAL LENS: Diffuse Energetic Cloud Node
      const potR = bodyR * breath;
      const potGrad = this.ctx.createRadialGradient(cx, cy, potR * 0.1, cx, cy, potR);
      const ratio = Math.min(1.0, hex.pore.energy / 100);
      if (ratio > 0.6) {
        potGrad.addColorStop(0, '#f43f5e');
        potGrad.addColorStop(0.8, '#f59e0b');
        potGrad.addColorStop(1, 'rgba(245, 158, 11, 0.2)');
      } else if (ratio > 0.3) {
        potGrad.addColorStop(0, '#38bdf8');
        potGrad.addColorStop(0.8, '#10b981');
        potGrad.addColorStop(1, 'rgba(16, 185, 129, 0.2)');
      } else {
        potGrad.addColorStop(0, '#8b5cf6');
        potGrad.addColorStop(0.8, '#312e81');
        potGrad.addColorStop(1, 'rgba(49, 46, 129, 0.2)');
      }
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, potR, 0, Math.PI * 2);
      this.ctx.fillStyle = potGrad;
      this.ctx.globalAlpha = origAlpha * 0.90;
      this.ctx.fill();
      this.ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.4)';
      this.ctx.lineWidth = 1.0;
      this.ctx.stroke();
      this.ctx.globalAlpha = origAlpha;

    } else {
      // ⬡ LATTICE LENS: Crisp Discrete Hexagonal/Circular Pore Channel Node
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, bodyR * breath, 0, Math.PI * 2);
      const cytoEdgeColor = this.filterShowAuras ? taxon.auraColor : taxon.accentColor;
      const cytoGrad = this.ctx.createRadialGradient(cx, cy, bodyR * 0.15, cx, cy, bodyR * breath);
      cytoGrad.addColorStop(0, '#0a1628');
      cytoGrad.addColorStop(0.70, '#040b17');
      cytoGrad.addColorStop(1, cytoEdgeColor);
      this.ctx.fillStyle = cytoGrad;
      this.ctx.fill();

      this.ctx.strokeStyle = isSelected ? '#ffffff' : (isColonyMember ? '#38bdf8' : taxon.accentColor);
      this.ctx.lineWidth = isSelected ? 2.5 : (isColonyMember ? 2.0 : (radius >= 16 ? 1.5 : 1.0));
      this.ctx.stroke();

      // Porin channel gate nodule dots around perimeter (Lattice mode diagnostic hallmark)
      if (radius >= 10) {
        const numNodules = 6;
        for (let k = 0; k < numNodules; k++) {
          const ang = (k / numNodules) * Math.PI * 2;
          const nx = cx + Math.cos(ang) * bodyR * breath;
          const ny = cy + Math.sin(ang) * bodyR * breath;
          this.ctx.fillStyle = k % 2 === 0 ? '#38bdf8' : '#fbbf24';
          this.ctx.beginPath();
          this.ctx.arc(nx, ny, 1.8, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }

    // 3. Central Metabolic Nucleus / Energetic Battery Core
    const chargeCol = charge > 0.6 ? '#10b981' : (charge > 0.3 ? '#06b6d4' : '#eab308');
    const pulseBase = charge > 0.6 ? 4.5 : 2.5;
    const pulseSpeed = pulseBase * (this.calmMotionEnabled ? 0.45 : 0.75);

    if (hex.pore.hasOrganelle) {
      // Eukaryotic Dual-Core Engine (Host Nucleus + Endosymbiont Organelle Core)
      const hostCoreR = Math.max(2, bodyR * 0.22 * (1.0 + 0.12 * Math.sin(this.plumeTime * pulseSpeed + phase)));
      const hostX = cx - bodyR * 0.22, hostY = cy;
      const hostGrad = this.ctx.createRadialGradient(hostX, hostY, 0, hostX, hostY, hostCoreR);
      hostGrad.addColorStop(0, '#ffffff');
      hostGrad.addColorStop(0.50, chargeCol);
      hostGrad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      this.ctx.fillStyle = hostGrad;
      this.ctx.beginPath();
      this.ctx.arc(hostX, hostY, hostCoreR, 0, Math.PI * 2);
      this.ctx.fill();

      // Organelle Auxiliary Engine Core
      const organelleCoreR = Math.max(2, bodyR * 0.20 * (1.0 + 0.12 * Math.cos(this.plumeTime * pulseSpeed + phase)));
      const orgX = cx + bodyR * 0.22, orgY = cy;
      const orgGrad = this.ctx.createRadialGradient(orgX, orgY, 0, orgX, orgY, organelleCoreR);
      orgGrad.addColorStop(0, '#ffffff');
      orgGrad.addColorStop(0.50, '#facc15');
      orgGrad.addColorStop(1, 'rgba(168, 85, 247, 0.3)');
      this.ctx.fillStyle = orgGrad;
      this.ctx.beginPath();
      this.ctx.arc(orgX, orgY, organelleCoreR, 0, Math.PI * 2);
      this.ctx.fill();

      // Inter-operon cytoplasmic energy tether
      this.ctx.strokeStyle = 'rgba(250, 204, 21, 0.7)';
      this.ctx.lineWidth = 1.2;
      this.ctx.beginPath();
      this.ctx.moveTo(hostX, hostY);
      this.ctx.lineTo(orgX, orgY);
      this.ctx.stroke();

      // Outer eukaryotic secondary envelope membrane
      this.ctx.strokeStyle = 'rgba(192, 132, 252, 0.75)';
      this.ctx.lineWidth = 1.2;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, bodyR * breath * 1.14, 0, Math.PI * 2);
      this.ctx.stroke();
    } else {
      // Standard Prokaryotic Single Nucleus
      const coreR = Math.max(2, bodyR * 0.28 * (1.0 + 0.12 * Math.sin(this.plumeTime * pulseSpeed + phase)));
      const nucleusGrad = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      nucleusGrad.addColorStop(0, '#ffffff');
      nucleusGrad.addColorStop(0.50, chargeCol);
      nucleusGrad.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
      this.ctx.fillStyle = nucleusGrad;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 4. Endosymbiotic Organelle Satellite Marker (Lynn Margulis Homage)
    if (hex.pore.hasOrganelle) {
      const satOrbitR = bodyR * 0.58;
      const orbitSpeed = this.calmMotionEnabled ? 0.75 : 1.35;
      const satAngle = this.plumeTime * orbitSpeed + phase * 2.1;
      const satX = cx + Math.cos(satAngle) * satOrbitR;
      const satY = cy + Math.sin(satAngle) * satOrbitR;
      const satR = Math.max(2.5, bodyR * 0.24);

      // Subtle orbital trajectory track
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, satOrbitR, 0, Math.PI * 2);
      this.ctx.strokeStyle = 'rgba(234, 179, 8, 0.22)';
      this.ctx.lineWidth = 0.8;
      this.ctx.stroke();

      // Organelle aura
      this.ctx.fillStyle = 'rgba(234, 179, 8, 0.45)';
      this.ctx.beginPath();
      this.ctx.arc(satX, satY, satR * 1.8, 0, Math.PI * 2);
      this.ctx.fill();

      // Organelle body (emerald/gold endosymbiont)
      const oGrad = this.ctx.createRadialGradient(satX, satY, 0, satX, satY, satR);
      oGrad.addColorStop(0, '#ffffff');
      oGrad.addColorStop(0.4, '#10b981');
      oGrad.addColorStop(1, '#eab308');
      this.ctx.fillStyle = oGrad;
      this.ctx.beginPath();
      this.ctx.arc(satX, satY, satR, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.strokeStyle = '#fef08a';
      this.ctx.lineWidth = 1.0;
      this.ctx.stroke();

      // Gentle metabolic energy link to nucleus (calm, non-strobing)
      this.ctx.strokeStyle = 'rgba(234, 179, 8, 0.35)';
      this.ctx.lineWidth = 0.8;
      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy);
      this.ctx.lineTo(satX, satY);
      this.ctx.stroke();
    }

    // 5. Delicate Porin Nodules on the membrane (if projected radius is large enough)
    if (radius >= 16) {
      const noduleCount = Math.min(6, Math.max(3, hex.pore.gateCount || 3));
      for (let i = 0; i < noduleCount; i++) {
        const ang = (Math.PI * 2 / noduleCount) * i + phase * 0.1;
        const nx = cx + Math.cos(ang) * (bodyR * breath);
        const ny = cy + Math.sin(ang) * (bodyR * breath);
        this.ctx.fillStyle = i % 2 === 0 ? taxon.accentColor : '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(nx, ny, Math.max(1.5, radius * 0.04), 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    this.ctx.globalAlpha = origAlpha;
  }

  /**
   * Minimal clean occupancy indicator for Design Studio mode.
   * Renders an unobtrusive emerald dot/pip so the designer can see which pores
   * harbor life while keeping 100% of their focus on terrain sculpting.
   */
  private drawStudioOccupancyIndicator(hex: IProjectedHex, radius: number): void {
    const cx = hex.centerScreen.x, cy = hex.centerScreen.y;
    const badgeR = Math.max(2.5, Math.min(6, radius * 0.28));
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, badgeR, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(52, 211, 153, 0.85)';
    this.ctx.fill();
    this.ctx.strokeStyle = '#059669';
    this.ctx.lineWidth = 1.0;
    this.ctx.stroke();

    if (radius >= 14) {
      this.ctx.font = `${Math.round(radius * 0.55)}px system-ui, sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('🌱', cx, cy - radius * 0.15);
    }
  }

  private drawCarcassDetritus(hex: IProjectedHex, radius: number): void {
    const cx = hex.centerScreen.x, cy = hex.centerScreen.y;
    const bodyR = Math.max(3, radius * 0.40);

    // 1. Ghostly fractured membrane perimeter
    this.ctx.strokeStyle = 'rgba(148, 163, 184, 0.55)';
    this.ctx.lineWidth = 1.2;
    this.ctx.setLineDash([3, 4]);
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, bodyR, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // 2. Porous mineral detritus core
    const detritusGrad = this.ctx.createRadialGradient(cx, cy, 1, cx, cy, bodyR * 0.7);
    detritusGrad.addColorStop(0, 'rgba(245, 158, 11, 0.45)');
    detritusGrad.addColorStop(0.5, 'rgba(100, 116, 139, 0.35)');
    detritusGrad.addColorStop(1, 'transparent');
    this.ctx.fillStyle = detritusGrad;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, bodyR * 0.7, 0, Math.PI * 2);
    this.ctx.fill();

    // 3. Drifting nutrient embers
    for (let i = 0; i < 3; i++) {
      const emberPhase = (this.plumeTime * 1.8 + i * 2.1) % 1.0;
      const ex = cx + Math.sin(this.plumeTime * 2 + i) * (bodyR * 0.45);
      const ey = cy - emberPhase * (bodyR * 0.8);
      this.ctx.fillStyle = `rgba(251, 191, 36, ${Math.max(0, 0.6 * (1 - emberPhase))})`;
      this.ctx.beginPath();
      this.ctx.arc(ex, ey, 1.5, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 4. Central mineralizing carcass glyph
    if (radius >= 14) {
      this.ctx.fillStyle = '#cbd5e1';
      this.ctx.font = '10px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('💀', cx, cy);
    }
  }

  private getPoreColor(pore: IPoreTelemetry): string {
    if (this.currentVent) {
      const isPrimary = pore.coord.equals(this.currentVent.nozzleCoord);
      const isOffshoot = this.currentVent.offshootCoords?.some(c => pore.coord.equals(c));
      if (isPrimary || isOffshoot) {
        return '#f97316'; // Active hydrothermal vent orifice
      }
    }
    if (pore.isBasalt) {
      if (pore.coord.z > 0) return '#1e293b'; // Distinct volcanic charcoal for vertical substrate
      if (pore.coord.z < 0) return '#060a14'; // Dense subterranean bedrock
      return '#0c1424';
    }
    if (pore.isAqueous) {
      if (pore.hasSpore) return 'rgba(234, 179, 8, 0.7)';
      if (pore.state === PoreState.OCCUPIED) return 'rgba(16, 185, 129, 0.65)';
      return 'rgba(6, 182, 212, 0.015)';
    }
    if (pore.state === PoreState.OCCUPIED) {
      const charge = Math.min(1.0, pore.energy / 100);
      return charge > 0.6 ? '#10b981' : (charge > 0.3 ? '#06b6d4' : '#eab308');
    }
    if (pore.state === PoreState.CARCASS) return '#64748b';
    if (pore.coord.z < 0) return '#091020'; // Habitable subterranean trench cavity
    return '#172033';
  }

  private drawThermalPlume(nozzleCoord: HexCoord3D, flux: number, w: number, h: number): void {
    const nozzleWorld = this.axialToWorld(nozzleCoord);

    for (let i = 0; i < 12; i++) {
      const offset = (this.plumeTime * 1.5 + i * 0.4) % 6.0;
      const pt = this.projectWorldToScreen(
        { x: nozzleWorld.x + Math.sin(offset * 2 + i) * 0.3, y: nozzleWorld.y + offset * 0.8, z: nozzleWorld.z + Math.cos(offset * 2 + i) * 0.3 },
        w, h
      );
      if (!pt) continue;
      this.ctx.fillStyle = `rgba(245, 158, 11, ${Math.max(0, 0.6 * (1.0 - offset / 6.0) * (flux / 500))})`;
      this.ctx.beginPath(); this.ctx.arc(pt.x, pt.y, Math.max(2, 6 - offset), 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  public findPoreAtScreenCoord(screenX: number, screenY: number, telemetry: ISimulationTelemetry): HexCoord3D | null {
    const w = this.canvas.width, h = this.canvas.height;
    const projected = (this.lastProjectedHexes && this.lastProjectedHexes.length > 0)
      ? this.lastProjectedHexes
      : this.projectPores(telemetry.pores, w, h);

    const eye = this.camera.getEyePosition();

    // Phase 1: Check occupied silicoids, spores, or subterranean indicators (high priority targets, closest to camera first)
    for (let idx = projected.length - 1; idx >= 0; idx--) {
      const item = projected[idx];
      if (!this.showSpores && item.pore.hasSpore && item.pore.isAqueous) continue;
      if (!this.showWaterColumn && item.pore.isAqueous) continue;
      if (!this.showBenthic && !item.pore.isAqueous) continue;

      // Skip transparent clipped geometry (< 0.01 alpha) so clicks pass straight through into caverns!
      const alpha = this.getProximityAlpha(item, this.selectedCoord);
      if (alpha <= 0.01) continue;

      // Skip vacant aqueous water cells completely - never let empty water block clicks!
      if (item.pore.isAqueous && item.pore.state === PoreState.EMPTY && !item.pore.hasSpore) continue;

      // Skip geometry that penetrates the camera lens clearance sphere (< 3.0 units)
      const cellWorld = this.axialToWorld(item.pore.coord);
      const distToEye = Math.hypot(cellWorld.x - eye.x, cellWorld.y - eye.y, cellWorld.z - eye.z);
      if (distToEye < 3.0) continue;

      // 0. Smart Click-Through on Surface Subterranean Cavern Indicator:
      // Clicking the central cavern indicator on the surface directly targets the subterranean niche beneath!
      if (this.activeBrushMode === 'select' && item.pore.coord.z >= 0) {
        const cavInfo = this.subterraneanCaverns.get(`${item.pore.coord.q},${item.pore.coord.r}`);
        if (cavInfo && cavInfo.surfaceCoord.equals(item.pore.coord)) {
          const rawRadius = Math.hypot(item.topScreenVertices[0].x - item.centerScreen.x, item.topScreenVertices[0].y - item.centerScreen.y);
          const dx = screenX - item.centerScreen.x, dy = screenY - item.centerScreen.y;
          if (Math.hypot(dx, dy) <= Math.max(12, rawRadius * 0.55)) {
            const targetPore = cavInfo.cavernPores.find(p => p.state === PoreState.OCCUPIED || p.hasSpore) ?? cavInfo.cavernPores[0];
            if (targetPore) return targetPore.coord;
          }
        }
      }

      // 1. Precise polygon test on hexagonal top face
      if (this.isPointInPolygon(screenX, screenY, item.topScreenVertices)) return item.pore.coord;

      // 2. Silicoid organism center hit test (clamped to max 45px so foreground cells cannot hijack clicks)
      const dx = screenX - item.centerScreen.x, dy = screenY - item.centerScreen.y;
      const rawRadius = Math.hypot(item.topScreenVertices[0].x - item.centerScreen.x, item.topScreenVertices[0].y - item.centerScreen.y);
      const hitR = Math.min(45, Math.max(8, rawRadius * 0.75));
      if (Math.hypot(dx, dy) <= hitR) return item.pore.coord;
    }

    // Phase 2: If no occupied/spore cell was hit, check rock substrate / basalt / vacant pores
    for (let idx = projected.length - 1; idx >= 0; idx--) {
      const item = projected[idx];
      if (item.pore.isAqueous) continue; // Skip water cells
      if (!this.showBenthic && item.pore.coord.z === 0) continue;

      // Skip transparent clipped geometry (< 0.01 alpha)
      const alpha = this.getProximityAlpha(item, this.selectedCoord);
      if (alpha <= 0.01) continue;

      // Skip geometry that penetrates the camera lens clearance sphere (< 3.0 units)
      const cellWorld = this.axialToWorld(item.pore.coord);
      const distToEye = Math.hypot(cellWorld.x - eye.x, cellWorld.y - eye.y, cellWorld.z - eye.z);
      if (distToEye < 3.0) continue;

      // 1. Check top face polygon
      if (this.isPointInPolygon(screenX, screenY, item.topScreenVertices)) return item.pore.coord;

      // 2. Check 6 vertical side quad faces for elevated rock/basalt columns
      if (item.baseScreenVertices) {
        for (let i = 0; i < 6; i++) {
          const n = (i + 1) % 6;
          const quad = [
            item.baseScreenVertices[i],
            item.baseScreenVertices[n],
            item.topScreenVertices[n],
            item.topScreenVertices[i]
          ];
          if (this.isPointInPolygon(screenX, screenY, quad)) return item.pore.coord;
        }
      }
    }

    return null;
  }

  private isPointInPolygon(px: number, py: number, vertices: readonly { x: number; y: number }[]): boolean {
    let inside = false;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      const xi = vertices[i].x, yi = vertices[i].y;
      const xj = vertices[j].x, yj = vertices[j].y;
      const intersect = ((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  private drawGeologicalEventEffects(
    hexes: IProjectedHex[],
    events: readonly IGeologicalEventRecord[],
    tidalVector: ITidalVector | undefined,
    viewport: { w: number; h: number }
  ): void {
    const { w, h } = viewport;
    const hexMap = new Map<string, IProjectedHex>();
    for (const hex of hexes) {
      hexMap.set(hex.pore.coord.toKey(), hex);
    }

    this.ctx.save();

    for (const ev of events) {
      // -------------------------------------------------------------
      // 1. HYDROTHERMAL BOILING SURGE: Gas flows, thermal shockwave, and temperature flash
      // -------------------------------------------------------------
      if (ev.type === 'HYDROTHERMAL_SURGE') {
        const ventCenterCoord = ev.epicenter ?? this.currentVent?.nozzleCoord;
        if (ventCenterCoord) {
          const nozzleWorld = this.axialToWorld(ventCenterCoord);
          const nozzleScreen = this.projectWorldToScreen(nozzleWorld, w, h);

          if (nozzleScreen) {
            // A. Radiant Thermal Ambient Flash (+75°C temperature pulse)
            const pulsePhase = Math.sin(this.plumeTime * 6);
            const flashR = Math.max(90, 160 + pulsePhase * 40);
            const flashGrad = this.ctx.createRadialGradient(
              nozzleScreen.x, nozzleScreen.y, 10,
              nozzleScreen.x, nozzleScreen.y, flashR
            );
            flashGrad.addColorStop(0, 'rgba(251, 146, 60, 0.42)');
            flashGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.18)');
            flashGrad.addColorStop(1, 'transparent');
            this.ctx.fillStyle = flashGrad;
            this.ctx.beginPath();
            this.ctx.arc(nozzleScreen.x, nozzleScreen.y, flashR, 0, Math.PI * 2);
            this.ctx.fill();

            // B. Expanding Concentric Thermal Shockwaves across seafloor bed
            for (let r = 0; r < 3; r++) {
              const waveProg = ((this.plumeTime * 45 + r * 35) % 130);
              const waveAlpha = Math.max(0, 0.75 * (1 - waveProg / 130));
              this.ctx.strokeStyle = `rgba(251, 191, 36, ${waveAlpha})`;
              this.ctx.lineWidth = 2.4;
              this.ctx.beginPath();
              this.ctx.ellipse(nozzleScreen.x, nozzleScreen.y, waveProg * 1.5, waveProg * 0.75, 0, 0, Math.PI * 2);
              this.ctx.stroke();
            }

            // C. Superheated Convective Gas Flow Bubbles (CH4, H2, CO2, H2S)
            for (let b = 0; b < 28; b++) {
              const bProg = ((this.plumeTime * 3.6 + b * 0.35) % 7.0);
              const wobbleX = Math.sin(bProg * 4.2 + b) * 0.45;
              const wobbleZ = Math.cos(bProg * 4.2 + b) * 0.45;
              const bPt = this.projectWorldToScreen({
                x: nozzleWorld.x + wobbleX,
                y: nozzleWorld.y + bProg * 1.3,
                z: nozzleWorld.z + wobbleZ
              }, w, h);

              if (bPt) {
                const bR = Math.max(2, 2.5 + bProg * 0.85);
                const bAlpha = Math.max(0, 0.8 * (1.0 - bProg / 7.0));

                // Bubble body
                this.ctx.fillStyle = `rgba(254, 240, 138, ${bAlpha})`;
                this.ctx.beginPath();
                this.ctx.arc(bPt.x, bPt.y, bR, 0, Math.PI * 2);
                this.ctx.fill();

                // Bubble specular sheen glint
                this.ctx.fillStyle = `rgba(255, 255, 255, ${bAlpha * 0.9})`;
                this.ctx.beginPath();
                this.ctx.arc(bPt.x - bR * 0.35, bPt.y - bR * 0.35, bR * 0.35, 0, Math.PI * 2);
                this.ctx.fill();
              }
            }
          }
        }
      }

      // -------------------------------------------------------------
      // 2. CRYOGENIC DOWNWELLING: Sinking cold cascades, frost needles, and icy vignette
      // -------------------------------------------------------------
      if (ev.type === 'CRYOGENIC_DOWNWELLING') {
        // A. Glacial Cooling Vignette Flash (1.8°C thermal shock)
        const cryoGrad = this.ctx.createRadialGradient(
          w / 2, h / 2, Math.min(w, h) * 0.30,
          w / 2, h / 2, Math.max(w, h) * 0.75
        );
        cryoGrad.addColorStop(0, 'transparent');
        cryoGrad.addColorStop(0.7, 'rgba(8, 145, 178, 0.12)');
        cryoGrad.addColorStop(1, 'rgba(14, 165, 233, 0.28)');
        this.ctx.fillStyle = cryoGrad;
        this.ctx.fillRect(0, 0, w, h);

        // B. Vertical Sinking Cold-Water Brine Cascades
        this.ctx.lineWidth = 1.8;
        for (let i = 0; i < 30; i++) {
          const cx = (i * 71 + Math.sin(this.plumeTime * 1.5 + i) * 35) % w;
          const cyTop = ((this.plumeTime * 65 + i * 43) % (h + 90)) - 90;
          const streamLen = 40 + (i % 6) * 15;
          const streamGrad = this.ctx.createLinearGradient(cx, cyTop, cx, cyTop + streamLen);
          streamGrad.addColorStop(0, 'transparent');
          streamGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.45)');
          streamGrad.addColorStop(1, 'transparent');
          this.ctx.strokeStyle = streamGrad;
          this.ctx.beginPath();
          this.ctx.moveTo(cx, cyTop);
          this.ctx.lineTo(cx, cyTop + streamLen);
          this.ctx.stroke();
        }

        // C. Frost Needle Outlines on Seafloor Bedrock Hexes
        this.ctx.strokeStyle = 'rgba(186, 230, 253, 0.55)';
        this.ctx.lineWidth = 1.2;
        for (const hex of hexes) {
          if (hex.pore.coord.z === 0 && (hex.pore.coord.q + hex.pore.coord.r) % 2 === 0) {
            this.ctx.beginPath();
            for (let j = 0; j < 6; j++) {
              const px = hex.topScreenVertices[j].x, py = hex.topScreenVertices[j].y;
              if (j === 0) this.ctx.moveTo(px, py); else this.ctx.lineTo(px, py);
            }
            this.ctx.closePath();
            this.ctx.stroke();
          }
        }
      }

      // -------------------------------------------------------------
      // 3. TOXIC HEAVY METAL SPIKE: Billowing acidic gas clouds and corrosive vapor
      // -------------------------------------------------------------
      if (ev.type === 'TOXIC_HEAVY_METAL_SPIKE') {
        const toxicCenter = ev.epicenter ?? this.currentVent?.nozzleCoord;
        if (toxicCenter) {
          const nozzleWorld = this.axialToWorld(toxicCenter);
          const centerPt = this.projectWorldToScreen(nozzleWorld, w, h);
          if (centerPt) {
            // Billowing corrosive gas eddies rolling across seafloor
            for (let p = 0; p < 16; p++) {
              const cloudAngle = (p * (Math.PI / 8) + this.plumeTime * 0.85);
              const cloudDist = 14 + ((this.plumeTime * 24 + p * 15) % 105);
              const px = centerPt.x + Math.cos(cloudAngle) * cloudDist;
              const py = centerPt.y + Math.sin(cloudAngle) * (cloudDist * 0.55) - (cloudDist * 0.35);
              const cloudR = 14 + (cloudDist * 0.38);
              const cAlpha = Math.max(0, 0.42 * (1.0 - cloudDist / 105));
              const cGrad = this.ctx.createRadialGradient(px, py, 2, px, py, cloudR);
              cGrad.addColorStop(0, `rgba(217, 70, 239, ${cAlpha})`);
              cGrad.addColorStop(0.65, `rgba(147, 51, 234, ${cAlpha * 0.45})`);
              cGrad.addColorStop(1, 'transparent');
              this.ctx.fillStyle = cGrad;
              this.ctx.beginPath();
              this.ctx.arc(px, py, cloudR, 0, Math.PI * 2);
              this.ctx.fill();
            }
          }
        }
      }

      // -------------------------------------------------------------
      // 4. MAGMATIC TREMOR: Seismic fracture lightning and ground tremors
      // -------------------------------------------------------------
      if (ev.type === 'MAGMATIC_TREMOR' && ev.affectedCoords) {
        for (let i = 0; i < ev.affectedCoords.length; i++) {
          const coord = ev.affectedCoords[i];
          const item = hexMap.get(coord.toKey());
          if (item) {
            const pulse = 16 + 8 * Math.sin(this.plumeTime * 7);
            this.ctx.strokeStyle = 'rgba(251, 191, 36, 0.90)';
            this.ctx.lineWidth = 2.4;
            this.ctx.beginPath();
            this.ctx.arc(item.centerScreen.x, item.centerScreen.y, pulse, 0, Math.PI * 2);
            this.ctx.stroke();

            // Fracture spikes
            this.ctx.strokeStyle = '#f59e0b';
            this.ctx.lineWidth = 1.6;
            for (let j = 0; j < 4; j++) {
              const ang = j * (Math.PI / 2) + this.plumeTime * 2;
              this.ctx.beginPath();
              this.ctx.moveTo(item.centerScreen.x, item.centerScreen.y);
              this.ctx.lineTo(
                item.centerScreen.x + Math.cos(ang) * (pulse + 7),
                item.centerScreen.y + Math.sin(ang) * (pulse + 7)
              );
              this.ctx.stroke();
            }

            // Seismic crack connecting to next affected pore
            if (i < ev.affectedCoords.length - 1) {
              const nextItem = hexMap.get(ev.affectedCoords[i + 1].toKey());
              if (nextItem) {
                const midX = (item.centerScreen.x + nextItem.centerScreen.x) / 2 + Math.sin(this.plumeTime * 12 + i) * 6;
                const midY = (item.centerScreen.y + nextItem.centerScreen.y) / 2 + Math.cos(this.plumeTime * 12 + i) * 6;
                this.ctx.strokeStyle = '#fef08a';
                this.ctx.lineWidth = 1.8;
                this.ctx.beginPath();
                this.ctx.moveTo(item.centerScreen.x, item.centerScreen.y);
                this.ctx.lineTo(midX, midY);
                this.ctx.lineTo(nextItem.centerScreen.x, nextItem.centerScreen.y);
                this.ctx.stroke();
              }
            }
          }
        }
      }

      // -------------------------------------------------------------
      // 5. PILLOW LAVA FLOW: Incandescent magma crust and smoke embers
      // -------------------------------------------------------------
      if (ev.type === 'PILLOW_LAVA_FLOW' && ev.affectedCoords) {
        for (const coord of ev.affectedCoords) {
          const item = hexMap.get(coord.toKey());
          if (item) {
            const lavaAlpha = 0.45 + 0.20 * Math.sin(this.plumeTime * 5);
            this.ctx.fillStyle = `rgba(239, 68, 68, ${lavaAlpha})`;
            this.ctx.strokeStyle = '#f97316';
            this.ctx.lineWidth = 2.6;
            this.ctx.beginPath();
            for (let j = 0; j < 6; j++) {
              const px = item.topScreenVertices[j].x, py = item.topScreenVertices[j].y;
              if (j === 0) this.ctx.moveTo(px, py); else this.ctx.lineTo(px, py);
            }
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();

            // Rising smoke embers
            for (let e = 0; e < 3; e++) {
              const ePhase = (this.plumeTime * 2.5 + e * 0.4) % 1.5;
              const ex = item.centerScreen.x + Math.sin(ePhase * 5 + e) * 8;
              const ey = item.centerScreen.y - ePhase * 24;
              this.ctx.fillStyle = `rgba(251, 146, 60, ${Math.max(0, 0.8 * (1.0 - ePhase / 1.5))})`;
              this.ctx.beginPath();
              this.ctx.arc(ex, ey, 2.0, 0, Math.PI * 2);
              this.ctx.fill();
            }
          }
        }
      }

      // -------------------------------------------------------------
      // 6. CHIMNEY SPALLING: Calving mineral fragments and sediment impact puffs
      // -------------------------------------------------------------
      if (ev.type === 'CHIMNEY_SPALLING') {
        const spallCenter = ev.epicenter ?? this.currentVent?.nozzleCoord;
        if (spallCenter) {
          const spallWorld = this.axialToWorld(spallCenter);
          for (let d = 0; d < 20; d++) {
            const dropProg = ((this.plumeTime * 3.0 + d * 0.35) % 3.0);
            const dropY = Math.max(0, spallWorld.y + 2.5 - dropProg * 2.2);
            const dropPt = this.projectWorldToScreen({
              x: spallWorld.x + Math.sin(d * 1.6) * (0.6 + dropProg * 0.4),
              y: dropY,
              z: spallWorld.z + Math.cos(d * 1.6) * (0.6 + dropProg * 0.4)
            }, w, h);

            if (dropPt) {
              const dAlpha = Math.max(0, 0.85 * (1.0 - dropProg / 3.0));
              this.ctx.fillStyle = `rgba(226, 232, 240, ${dAlpha})`;
              this.ctx.beginPath();
              this.ctx.arc(dropPt.x, dropPt.y, 2.5, 0, Math.PI * 2);
              this.ctx.fill();
            }
          }
        }
      }

      // -------------------------------------------------------------
      // 7. VENT ORIFICE MIGRATION: Steam blowout and tectonic conduit trace
      // -------------------------------------------------------------
      if (ev.type === 'VENT_ORIFICE_MIGRATION') {
        if (ev.epicenter && this.currentVent) {
          const oldScreen = this.projectWorldToScreen(this.axialToWorld(ev.epicenter), w, h);
          const newScreen = this.projectWorldToScreen(this.axialToWorld(this.currentVent.nozzleCoord), w, h);

          if (oldScreen && newScreen) {
            // Blowout steam ring at old orifice
            const blastR = 20 + ((this.plumeTime * 40) % 50);
            const blastAlpha = Math.max(0, 0.7 * (1.0 - blastR / 50));
            this.ctx.strokeStyle = `rgba(45, 212, 191, ${blastAlpha})`;
            this.ctx.lineWidth = 2.5;
            this.ctx.beginPath();
            this.ctx.arc(oldScreen.x, oldScreen.y, blastR, 0, Math.PI * 2);
            this.ctx.stroke();

            // Crackling tectonic conduit connecting old to new nozzle
            this.ctx.strokeStyle = '#2dd4bf';
            this.ctx.lineWidth = 2.0;
            this.ctx.beginPath();
            this.ctx.moveTo(oldScreen.x, oldScreen.y);
            const midX = (oldScreen.x + newScreen.x) / 2 + Math.sin(this.plumeTime * 15) * 8;
            const midY = (oldScreen.y + newScreen.y) / 2 + Math.cos(this.plumeTime * 15) * 8;
            this.ctx.lineTo(midX, midY);
            this.ctx.lineTo(newScreen.x, newScreen.y);
            this.ctx.stroke();
          }
        }
      }

      // -------------------------------------------------------------
      // 8. MARINE SNOW STORM: Pelagic detrital floc drift
      // -------------------------------------------------------------
      if (ev.type === 'MARINE_SNOW_STORM') {
        this.ctx.fillStyle = 'rgba(224, 242, 254, 0.75)';
        for (let i = 0; i < 45; i++) {
          const sx = (i * 139 + Math.sin(this.plumeTime * 1.2 + i) * 45) % w;
          const sy = (this.plumeTime * 38 + i * 51) % h;
          const sz = 1.2 + (i % 3) * 0.8;
          this.ctx.beginPath();
          this.ctx.arc(sx, sy, sz, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }

    // -------------------------------------------------------------
    // 9. TIDAL CURRENT SHEAR: Planetary baroclinic streamlines across seafloor
    // -------------------------------------------------------------
    if (tidalVector) {
      // Top-left vector gauge
      this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      this.ctx.lineWidth = 1.6;
      const tX = 26, tY = 46;
      const dirX = Math.cos(tidalVector.angle) * 18;
      const dirY = Math.sin(tidalVector.angle) * 18;
      this.ctx.beginPath();
      this.ctx.moveTo(tX, tY);
      this.ctx.lineTo(tX + dirX, tY + dirY);
      this.ctx.stroke();

      this.ctx.fillStyle = '#38bdf8';
      this.ctx.beginPath();
      this.ctx.arc(tX + dirX, tY + dirY, 3.0, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
      this.ctx.font = '10px monospace';
      this.ctx.textAlign = 'left';
      this.ctx.fillText(`🌊 TIDE: ${tidalVector.speed.toFixed(1)} kn`, tX + 26, tY + 4);

      // Subtle horizontal current ribbons across water column
      const shearEvt = events.find(e => e.type === 'TIDAL_CURRENT_SHEAR');
      if (shearEvt) {
        this.ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)';
        this.ctx.lineWidth = 1.5;
        for (let s = 0; s < 6; s++) {
          const sy = (h / 7) * (s + 1);
          const offset = (this.plumeTime * 120 + s * 80) % w;
          this.ctx.beginPath();
          this.ctx.moveTo(offset - 60, sy);
          this.ctx.lineTo(offset + 60, sy);
          this.ctx.stroke();
        }
      }
    }

    // -------------------------------------------------------------
    // 10. ACTIVE EVENT IN-WORLD HUD TOAST BANNER (Top Center)
    // -------------------------------------------------------------
    const latestEvent = events[events.length - 1];
    if (latestEvent) {
      const bannerW = 440;
      const bannerH = 30;
      const bannerX = (w - bannerW) / 2;
      const bannerY = 14;

      this.ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
      this.ctx.strokeStyle = latestEvent.type === 'HYDROTHERMAL_SURGE' ? '#f97316'
        : latestEvent.type === 'CRYOGENIC_DOWNWELLING' ? '#38bdf8'
        : latestEvent.type === 'TOXIC_HEAVY_METAL_SPIKE' ? '#c084fc'
        : latestEvent.type === 'MAGMATIC_TREMOR' ? '#fbbf24'
        : latestEvent.type === 'PILLOW_LAVA_FLOW' ? '#ef4444' : '#38bdf8';
      this.ctx.lineWidth = 1.6;

      this.ctx.beginPath();
      this.ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 15);
      this.ctx.fill();
      this.ctx.stroke();

      // Progress bar for remaining duration
      const durationFraction = Math.max(0, Math.min(1.0, latestEvent.ticksRemaining / latestEvent.durationTicks));
      this.ctx.fillStyle = this.ctx.strokeStyle;
      this.ctx.beginPath();
      this.ctx.roundRect(bannerX + 10, bannerY + bannerH - 4, (bannerW - 20) * durationFraction, 2, 1);
      this.ctx.fill();

      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 11px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(
        `${latestEvent.icon} ${latestEvent.title.toUpperCase()} (⏳ ${latestEvent.ticksRemaining}t)`,
        bannerX + bannerW / 2,
        bannerY + 18
      );
    }

    this.ctx.restore();
  }
}
