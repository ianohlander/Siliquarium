/**
 * 🐠 Siliquarium Visualizer Subsystem
 * KinematicsOverlay: High-Level Macro-Movement, Slime Treadmilling & Histological Staining Renderer.
 * 
 * Renders decluttered whole-body organismal forms, ghost slime trails, velocity vectors,
 * tactical encirclement arcs, trophic predation beams, streaming chevrons, and apoptosis halos.
 */

import { OrbitCamera } from './OrbitCamera.js';
import { HexCoord3D } from '../core/spatial/HexCoord3D.js';
import {
  IKinematicFrame,
  IKinematicBody,
  IKinematicCellSnapshot,
  HistologicalStain,
  LensViewMode
} from '../engine/kinematics/ColonyKinematicsRecorder.js';

export interface IKinematicRenderContext {
  ctx: CanvasRenderingContext2D;
  camera: OrbitCamera;
  w: number;
  h: number;
}

export interface IKinematicOverlayOptions {
  stain: HistologicalStain;
  toggles: {
    trophicRays: boolean;
    slimeStreaming: boolean;
    apoptosisHalos: boolean;
    ghostTrails: boolean;
    speciesBadges: boolean;
  };
  pinnedCladeId?: string | null;
  pinnedBodyId?: string | null;
  isLineageIsolation?: boolean;
  lensMode?: LensViewMode;
}

export class KinematicsOverlay {
  private pulsePhase: number = 0;

  /**
   * Main rendering pass for the Chronicle / Macro-Kinematics View.
   */
  public render(
    renderCtx: IKinematicRenderContext,
    frame: IKinematicFrame,
    options: IKinematicOverlayOptions
  ): void {
    const { toggles, stain } = options;
    const pinnedCladeId = options.pinnedCladeId ?? null;
    const pinnedBodyId = options.pinnedBodyId ?? null;
    const isLineageIsolation = options.isLineageIsolation ?? false;
    const lensMode = options.lensMode ?? 'hybrid';

    this.pulsePhase = (this.pulsePhase + 0.05) % (Math.PI * 2);

    // 1. Render Ghost Slime Tracks (Centroid History Ribbons)
    if (toggles.ghostTrails) {
      this.drawGhostTrails(renderCtx, frame.bodies, { pinnedCladeId, pinnedBodyId, isLineageIsolation });
    }

    // 2. Render Macro Slime Hulls & Histological Stains for each Body
    for (const body of frame.bodies) {
      this.drawBodySlimeHull(renderCtx, body, { stain, pinnedCladeId, pinnedBodyId, isLineageIsolation, lensMode });
    }

    // 3. Render Tactical Predatory Encirclement Arcs
    for (const body of frame.bodies) {
      if (body.isEncircling) {
        this.drawEncirclementArcs(renderCtx, body, { isLineageIsolation, pinnedCladeId, pinnedBodyId });
      }
    }

    // 4. Render Treadmilling Forward Streaming Chevrons
    if (toggles.slimeStreaming) {
      this.drawStreamingChevrons(renderCtx, frame);
    }

    // 5. Render Trailing-Edge Apoptosis Halos
    if (toggles.apoptosisHalos) {
      this.drawApoptosisHalos(renderCtx, frame);
    }

    // 6. Render Dynamic Trophic Activity Rays (Predation, Vent Plume Feeding, Scavenging)
    if (toggles.trophicRays) {
      this.drawTrophicRays(renderCtx, frame);
    }

    // 7. Render Centroid Velocity Heading Vectors & Floating Badges
    for (const body of frame.bodies) {
      const isPinned = (body.bodyId === pinnedBodyId) || (pinnedCladeId !== null && body.cladeId === pinnedCladeId);
      if (!isLineageIsolation || isPinned) {
        this.drawVelocityVector(renderCtx, body);
      }
      // Badges: ONLY render if toggle is active AND organism is pinned by user!
      if (toggles.speciesBadges && isPinned) {
        this.drawSpeciesBadge(renderCtx, body, true);
      }
    }

    // 8. Render Environmental Event Banner if an active shock exists
    if (frame.environmentalEvent) {
      this.drawEnvironmentalBanner(renderCtx, frame.environmentalEvent, frame.tick);
    }
  }

  // =========================================================================
  // =========================================================================
  // Ghost Slime Trails (Dehydrated Extracellular Slime Tracks)
  // =========================================================================

  private drawGhostTrails(
    renderCtx: IKinematicRenderContext,
    bodies: readonly IKinematicBody[],
    filter?: {
      pinnedCladeId?: string | null;
      pinnedBodyId?: string | null;
      isLineageIsolation?: boolean;
    }
  ): void {
    const { ctx, camera, w, h } = renderCtx;
    const pinnedCladeId = filter?.pinnedCladeId ?? null;
    const pinnedBodyId = filter?.pinnedBodyId ?? null;
    const isLineageIsolation = filter?.isLineageIsolation ?? false;
    ctx.save();
    for (const body of bodies) {
      if (body.slimeTrail.length < 2) continue;
      const isPinned = (body.bodyId === pinnedBodyId) || (pinnedCladeId !== null && body.cladeId === pinnedCladeId);
      if (isLineageIsolation && (pinnedCladeId || pinnedBodyId) && !isPinned) continue;

      // 1. Dehydrated Extracellular Slime Sheath Footprint Ribbon
      ctx.beginPath();
      let first = true;
      for (let i = 0; i < body.slimeTrail.length; i++) {
        const pt = body.slimeTrail[i];
        const screen = camera.project(pt, w, h);
        if (!screen || screen.depth <= 0) continue;

        if (first) {
          ctx.moveTo(screen.x, screen.y);
          first = false;
        } else {
          ctx.lineTo(screen.x, screen.y);
        }
      }

      ctx.strokeStyle = body.color;
      ctx.lineWidth = isPinned ? 8 : 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = isPinned ? 0.22 : 0.10;
      ctx.stroke();

      // 2. Fibrous Centroid Core Ribbon with longitudinal dash
      ctx.beginPath();
      first = true;
      for (let i = 0; i < body.slimeTrail.length; i++) {
        const pt = body.slimeTrail[i];
        const screen = camera.project(pt, w, h);
        if (!screen || screen.depth <= 0) continue;

        if (first) {
          ctx.moveTo(screen.x, screen.y);
          first = false;
        } else {
          ctx.lineTo(screen.x, screen.y);
        }
      }

      ctx.lineWidth = isPinned ? 3.0 : 1.8;
      ctx.globalAlpha = isPinned ? (0.6 + Math.sin(this.pulsePhase) * 0.15) : 0.28;
      ctx.setLineDash(isPinned ? [8, 4] : [4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();
  }

  // =========================================================================
  // Multi-Lens Macro Slime Hulls & Histological Stains
  // =========================================================================

  private drawBodySlimeHull(
    renderCtx: IKinematicRenderContext,
    body: IKinematicBody,
    options: {
      stain: HistologicalStain;
      pinnedCladeId?: string | null;
      pinnedBodyId?: string | null;
      isLineageIsolation?: boolean;
      lensMode?: LensViewMode;
    }
  ): void {
    const { ctx, camera, w, h } = renderCtx;
    const { stain } = options;
    const pinnedCladeId = options.pinnedCladeId ?? null;
    const pinnedBodyId = options.pinnedBodyId ?? null;
    const isLineageIsolation = options.isLineageIsolation ?? false;
    const lensMode = options.lensMode ?? 'hybrid';
    const isPinned = (body.bodyId === pinnedBodyId) || (pinnedCladeId !== null && body.cladeId === pinnedCladeId);

    ctx.save();

    // Lineage isolation dimming: if isolation is active and this body is not pinned, dim to 12% opacity
    if (isLineageIsolation && (pinnedCladeId || pinnedBodyId) && !isPinned) {
      ctx.globalAlpha = 0.12;
    }

    interface IProjectedPore {
      cell: IKinematicCellSnapshot;
      screen: { x: number; y: number; depth: number };
      radius: number;
      effRadius: number;
    }

    const headingCos = Math.cos(body.heading);
    const headingSin = Math.sin(body.heading);

    const projectedCells: IProjectedPore[] = [];
    for (const cell of body.cells) {
      const hex = cell.coord;
      const wx = hex.q * Math.sqrt(3) + (hex.r * Math.sqrt(3)) / 2;
      const wy = hex.r * 1.5;
      const wz = hex.z * 1.2;

      const screen = camera.project({ x: wx, y: wy, z: wz }, w, h);
      if (!screen || screen.depth <= 0) continue;

      const baseRadius = Math.max(8, 22 * (24.0 / camera.distance));

      // Calculate traveling peristaltic contraction wave phase based on cell position and body heading
      const qRel = hex.q - body.centroid.x;
      const rRel = hex.r - body.centroid.z;
      const waveOffset = qRel * headingCos + rRel * headingSin;
      const cellPhase = this.pulsePhase * 2.8 - waveOffset * 0.45;
      const pulseFactor = (lensMode === 'lattice') ? 1.0 : (1.0 + 0.16 * Math.sin(cellPhase));
      const effRadius = baseRadius * pulseFactor;

      projectedCells.push({ cell, screen, radius: baseRadius, effRadius });
    }

    if (projectedCells.length === 0) {
      ctx.restore();
      return;
    }

    // =======================================================================
    // 1. MULTICELLULAR / SYNCYTIAL ORGANISMS
    // =======================================================================
    if (body.cells.length > 1) {
      // ---------------------------------------------------------------------
      // LENS: LATTICE (Discrete Cellular / Atomic CPK Spheres)
      // ---------------------------------------------------------------------
      if (lensMode === 'lattice') {
        // Dashed proximity links between adjacent cells
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        for (let i = 0; i < projectedCells.length; i++) {
          for (let j = i + 1; j < projectedCells.length; j++) {
            const pA = projectedCells[i], pB = projectedCells[j];
            if (pA.cell.coord.distanceTo(pB.cell.coord) === 1) {
              ctx.moveTo(pA.screen.x, pA.screen.y);
              ctx.lineTo(pB.screen.x, pB.screen.y);
            }
          }
        }
        ctx.strokeStyle = body.color;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.35;
        ctx.stroke();
        ctx.setLineDash([]);

        // Discrete cellular droplet per pore
        for (const p of projectedCells) {
          const { cell, screen, radius } = p;
          const { fillColor, strokeColor } = this.getCellStainColors(cell, body.color, stain);

          ctx.beginPath();
          ctx.arc(screen.x, screen.y, radius * 0.9, 0, Math.PI * 2);
          ctx.fillStyle = fillColor;
          ctx.globalAlpha = 0.55;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(screen.x, screen.y, radius * 0.9, 0, Math.PI * 2);
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = isPinned ? 2.8 : 1.6;
          ctx.globalAlpha = 0.85;
          ctx.stroke();

          this.drawCellRoleArtifacts(ctx, p, stain, isPinned);
        }
      }
      // ---------------------------------------------------------------------
      // LENS: PLASMODIUM (Bio-Smoothed Syncytial Slime Hull)
      // ---------------------------------------------------------------------
      else if (lensMode === 'plasmodium') {
        // A. Fleshy protoplasmic syncytial bridges between adjacent cells
        for (let i = 0; i < projectedCells.length; i++) {
          for (let j = i + 1; j < projectedCells.length; j++) {
            const pA = projectedCells[i], pB = projectedCells[j];
            if (pA.cell.coord.distanceTo(pB.cell.coord) === 1) {
              ctx.beginPath();
              ctx.moveTo(pA.screen.x, pA.screen.y);
              ctx.lineTo(pB.screen.x, pB.screen.y);
              ctx.strokeStyle = body.color;
              ctx.lineWidth = Math.max(8, (pA.effRadius + pB.effRadius) * 0.92);
              ctx.lineCap = 'round';
              ctx.lineJoin = 'round';
              ctx.globalAlpha = isPinned ? 0.55 : 0.38;
              ctx.stroke();
            }
          }
        }

        // B. Unified syncytial cytoplasm aura fill across all member cells
        for (const p of projectedCells) {
          ctx.beginPath();
          ctx.arc(p.screen.x, p.screen.y, p.effRadius * 1.22, 0, Math.PI * 2);
          ctx.fillStyle = body.color;
          ctx.globalAlpha = isPinned ? 0.38 : 0.26;
          ctx.fill();
        }

        // C. Smooth outer bioluminescent membrane contour rim
        ctx.strokeStyle = body.color;
        ctx.lineWidth = isPinned ? 3.0 : 1.8;
        ctx.shadowColor = body.color;
        ctx.shadowBlur = 8;
        for (const p of projectedCells) {
          ctx.beginPath();
          ctx.arc(p.screen.x, p.screen.y, p.effRadius * 1.05, 0, Math.PI * 2);
          ctx.globalAlpha = isPinned ? 0.88 : 0.65;
          ctx.stroke();
        }
        ctx.shadowBlur = 0;

        // D. Leading-edge pseudopodial fan ruffles (advancing lamellipodia)
        if (body.speed > 0.02) {
          for (const p of projectedCells) {
            const qRel = p.cell.coord.q - body.centroid.x;
            const rRel = p.cell.coord.r - body.centroid.z;
            const dot = qRel * headingCos + rRel * headingSin;
            if (dot > 0.4) {
              const fwdX = p.screen.x + headingCos * p.effRadius * 0.85;
              const fwdY = p.screen.y + headingSin * p.effRadius * 0.85;
              const fanR = p.effRadius * 0.52 * (1.0 + 0.15 * Math.sin(this.pulsePhase * 3.5));
              ctx.beginPath();
              ctx.arc(fwdX, fwdY, fanR, 0, Math.PI * 2);
              ctx.fillStyle = body.color;
              ctx.globalAlpha = 0.28;
              ctx.fill();
            }
          }
        }

        // E. Floating organelle nuclei & histological stains
        for (const p of projectedCells) {
          const { cell, screen, effRadius } = p;
          const { fillColor, strokeColor } = this.getCellStainColors(cell, body.color, stain);

          ctx.beginPath();
          ctx.arc(screen.x, screen.y, effRadius * 0.55, 0, Math.PI * 2);
          ctx.fillStyle = fillColor;
          ctx.globalAlpha = 0.75;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(screen.x, screen.y, effRadius * 0.55, 0, Math.PI * 2);
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 1.6;
          ctx.globalAlpha = 0.9;
          ctx.stroke();

          this.drawCellRoleArtifacts(ctx, p, stain, isPinned);
        }
      }
      // ---------------------------------------------------------------------
      // LENS: VASCULAR (Cytoplasmic Tubular Reticulum & Streaming Ribbons)
      // ---------------------------------------------------------------------
      else if (lensMode === 'vascular') {
        // Curved quadratic Bézier conduits connecting adjacent pores
        for (let i = 0; i < projectedCells.length; i++) {
          for (let j = i + 1; j < projectedCells.length; j++) {
            const pA = projectedCells[i], pB = projectedCells[j];
            if (pA.cell.coord.distanceTo(pB.cell.coord) === 1) {
              const midX = (pA.screen.x + pB.screen.x) / 2 + Math.sin(this.pulsePhase + i * 1.5) * 3.5;
              const midY = (pA.screen.y + pB.screen.y) / 2 + Math.cos(this.pulsePhase + j * 1.5) * 3.5;
              const energySum = pA.cell.energy + pB.cell.energy;
              const tubeWidth = Math.max(3.5, Math.min(13, energySum * 0.08));

              // Outer translucent hydraulic jacket
              ctx.beginPath();
              ctx.moveTo(pA.screen.x, pA.screen.y);
              ctx.quadraticCurveTo(midX, midY, pB.screen.x, pB.screen.y);
              ctx.strokeStyle = stain === 'vascular' ? '#c084fc' : body.color;
              ctx.lineWidth = tubeWidth;
              ctx.lineCap = 'round';
              ctx.globalAlpha = isPinned ? 0.70 : 0.48;
              ctx.stroke();

              // Inner luminous core line
              ctx.beginPath();
              ctx.moveTo(pA.screen.x, pA.screen.y);
              ctx.quadraticCurveTo(midX, midY, pB.screen.x, pB.screen.y);
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = Math.max(1.2, tubeWidth * 0.32);
              ctx.globalAlpha = 0.85;
              ctx.stroke();

              // Directional animated shuttle streaming chevrons
              ctx.beginPath();
              ctx.moveTo(pA.screen.x, pA.screen.y);
              ctx.quadraticCurveTo(midX, midY, pB.screen.x, pB.screen.y);
              ctx.strokeStyle = '#fef08a';
              ctx.lineWidth = 1.8;
              ctx.setLineDash([4, 6]);
              ctx.lineDashOffset = -this.pulsePhase * 12;
              ctx.globalAlpha = 0.80;
              ctx.stroke();
              ctx.setLineDash([]);
            }
          }
        }

        // Spherical logic and metabolic pumping nodes at each pore center
        for (const p of projectedCells) {
          const { screen, radius } = p;
          const nodeR = Math.max(4, radius * 0.5);

          ctx.beginPath();
          ctx.arc(screen.x, screen.y, nodeR, 0, Math.PI * 2);
          ctx.fillStyle = p.cell.roleColor;
          ctx.globalAlpha = 0.85;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(screen.x, screen.y, nodeR, 0, Math.PI * 2);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.6;
          ctx.globalAlpha = 0.95;
          ctx.stroke();

          this.drawCellRoleArtifacts(ctx, p, stain, isPinned);
        }
      }
      // ---------------------------------------------------------------------
      // LENS: POTENTIAL (Continuous Metabolic & GRN Scalar Isosurface)
      // ---------------------------------------------------------------------
      else if (lensMode === 'potential') {
        // Continuous energy density and operon expression heatmap
        for (const p of projectedCells) {
          const { cell, screen, radius } = p;
          const ratio = Math.min(1.0, Math.max(0, cell.energy / 100));
          const hasActiveOperon = cell.operonStates.some(Boolean) || cell.primaryActive;
          const fieldR = radius * 2.3;

          const grad = ctx.createRadialGradient(screen.x, screen.y, radius * 0.2, screen.x, screen.y, fieldR);
          if (hasActiveOperon || ratio > 0.7) {
            grad.addColorStop(0, 'rgba(244, 63, 94, 0.75)'); // Scarlet high potential
            grad.addColorStop(0.55, 'rgba(245, 158, 11, 0.40)'); // Amber
            grad.addColorStop(1, 'rgba(245, 158, 11, 0.0)');
          } else if (ratio > 0.35) {
            grad.addColorStop(0, 'rgba(56, 189, 248, 0.65)'); // Cyan medium potential
            grad.addColorStop(0.55, 'rgba(16, 185, 129, 0.32)'); // Emerald
            grad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
          } else {
            grad.addColorStop(0, 'rgba(139, 92, 246, 0.55)'); // Violet low potential
            grad.addColorStop(0.55, 'rgba(30, 27, 75, 0.22)');
            grad.addColorStop(1, 'rgba(30, 27, 75, 0.0)');
          }

          ctx.beginPath();
          ctx.arc(screen.x, screen.y, fieldR, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.globalAlpha = isPinned ? 0.75 : 0.55;
          ctx.fill();
        }

        // Inner glowing core markers
        for (const p of projectedCells) {
          ctx.beginPath();
          ctx.arc(p.screen.x, p.screen.y, p.radius * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = 0.85;
          ctx.fill();
          this.drawCellRoleArtifacts(ctx, p, stain, isPinned);
        }
      }
      // ---------------------------------------------------------------------
      // LENS: HYBRID (Default: Translucent Slime Hull + Vascular Veining)
      // ---------------------------------------------------------------------
      else {
        // A. Translucent bio-smoothed plasmodial syncytial hull
        for (let i = 0; i < projectedCells.length; i++) {
          for (let j = i + 1; j < projectedCells.length; j++) {
            const pA = projectedCells[i], pB = projectedCells[j];
            if (pA.cell.coord.distanceTo(pB.cell.coord) === 1) {
              ctx.beginPath();
              ctx.moveTo(pA.screen.x, pA.screen.y);
              ctx.lineTo(pB.screen.x, pB.screen.y);
              ctx.strokeStyle = body.color;
              ctx.lineWidth = Math.max(8, (pA.effRadius + pB.effRadius) * 0.88);
              ctx.lineCap = 'round';
              ctx.lineJoin = 'round';
              ctx.globalAlpha = isPinned ? 0.45 : 0.28;
              ctx.stroke();
            }
          }
        }

        for (const p of projectedCells) {
          ctx.beginPath();
          ctx.arc(p.screen.x, p.screen.y, p.effRadius * 1.15, 0, Math.PI * 2);
          ctx.fillStyle = body.color;
          ctx.globalAlpha = isPinned ? 0.32 : 0.20;
          ctx.fill();
        }

        // B. Internal curved vascular ribbons & streaming chevrons
        for (let i = 0; i < projectedCells.length; i++) {
          for (let j = i + 1; j < projectedCells.length; j++) {
            const pA = projectedCells[i], pB = projectedCells[j];
            if (pA.cell.coord.distanceTo(pB.cell.coord) === 1) {
              const midX = (pA.screen.x + pB.screen.x) / 2 + Math.sin(this.pulsePhase + i) * 2.5;
              const midY = (pA.screen.y + pB.screen.y) / 2 + Math.cos(this.pulsePhase + j) * 2.5;

              ctx.beginPath();
              ctx.moveTo(pA.screen.x, pA.screen.y);
              ctx.quadraticCurveTo(midX, midY, pB.screen.x, pB.screen.y);
              ctx.strokeStyle = stain === 'vascular' ? '#c084fc' : '#a855f7';
              ctx.lineWidth = 3.0;
              ctx.lineCap = 'round';
              ctx.globalAlpha = 0.70;
              ctx.stroke();

              // Streaming chevrons
              ctx.beginPath();
              ctx.moveTo(pA.screen.x, pA.screen.y);
              ctx.quadraticCurveTo(midX, midY, pB.screen.x, pB.screen.y);
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 1.4;
              ctx.setLineDash([3, 5]);
              ctx.lineDashOffset = -this.pulsePhase * 10;
              ctx.globalAlpha = 0.85;
              ctx.stroke();
              ctx.setLineDash([]);
            }
          }
        }

        // C. Organelle nuclei & histological stains
        for (const p of projectedCells) {
          const { cell, screen, effRadius } = p;
          const { fillColor, strokeColor } = this.getCellStainColors(cell, body.color, stain);

          ctx.beginPath();
          ctx.arc(screen.x, screen.y, effRadius * 0.65, 0, Math.PI * 2);
          ctx.fillStyle = fillColor;
          ctx.globalAlpha = 0.70;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(screen.x, screen.y, effRadius * 0.65, 0, Math.PI * 2);
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = isPinned ? 2.5 : 1.8;
          ctx.globalAlpha = 0.90;
          ctx.stroke();

          this.drawCellRoleArtifacts(ctx, p, stain, isPinned);
        }
      }
    }
    // =======================================================================
    // 2. SOLITARY CELL (Single Droplet / Organism)
    // =======================================================================
    else {
      const p = projectedCells[0];
      const { cell, screen, radius, effRadius } = p;
      const { fillColor, strokeColor } = this.getCellStainColors(cell, body.color, stain);

      if (lensMode === 'potential') {
        const fieldR = radius * 2.2;
        const grad = ctx.createRadialGradient(screen.x, screen.y, radius * 0.2, screen.x, screen.y, fieldR);
        grad.addColorStop(0, fillColor);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, fieldR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.globalAlpha = 0.65;
        ctx.fill();
      }

      const drawR = (lensMode === 'lattice') ? (radius * 0.9) : (effRadius * 0.9);
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, drawR, 0, Math.PI * 2);
      ctx.fillStyle = fillColor;
      ctx.globalAlpha = 0.55;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(screen.x, screen.y, drawR, 0, Math.PI * 2);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = isPinned ? 2.8 : 1.6;
      ctx.globalAlpha = 0.88;
      ctx.stroke();

      this.drawCellRoleArtifacts(ctx, p, stain, isPinned);
    }

    ctx.restore();
  }

  // =========================================================================
  // Cell Color & Organelle Morphology Helpers
  // =========================================================================

  private getCellStainColors(
    cell: IKinematicCellSnapshot,
    defaultColor: string,
    stain: HistologicalStain
  ): { fillColor: string; strokeColor: string } {
    if (stain === 'morphology') {
      return { fillColor: cell.roleColor, strokeColor: cell.roleColor };
    } else if (stain === 'grn') {
      const hasActiveOperon = cell.operonStates.some(Boolean) || cell.primaryActive;
      return {
        fillColor: hasActiveOperon ? '#22c55e' : '#1e1b4b',
        strokeColor: hasActiveOperon ? '#4ade80' : '#4338ca'
      };
    } else if (stain === 'vascular') {
      return { fillColor: '#8b5cf6', strokeColor: '#c084fc' };
    } else if (stain === 'battery') {
      const ratio = Math.min(1.0, Math.max(0, cell.energy / 100));
      return {
        fillColor: ratio < 0.5
          ? `rgba(6, 182, 212, ${0.4 + ratio * 0.6})`
          : `rgba(245, 158, 11, ${0.6 + (ratio - 0.5) * 0.8})`,
        strokeColor: '#fbbf24'
      };
    }
    return { fillColor: defaultColor, strokeColor: defaultColor };
  }

  private drawCellRoleArtifacts(
    ctx: CanvasRenderingContext2D,
    p: { cell: IKinematicCellSnapshot; screen: { x: number; y: number }; radius: number; effRadius: number },
    stain: HistologicalStain,
    _isPinned: boolean
  ): void {
    const { cell, screen, radius } = p;
    if (stain !== 'morphology') return;

    if (cell.roleName.startsWith('Trophocyte')) {
      // Feeding tendril: radiating amber pseudopodia outwards
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, radius + 4, 0, Math.PI * 2);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.globalAlpha = 0.7;
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (cell.roleName.startsWith('Somatic Shield')) {
      // Armored cuticle ring
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, radius + 3, 0, Math.PI * 2);
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 0.85;
      ctx.stroke();
    } else if (cell.roleName.startsWith('Pacemaker')) {
      // Sensory pulse ripple
      const pulseR = radius + 3 + Math.sin(this.pulsePhase * 3) * 3;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, pulseR, 0, Math.PI * 2);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.8;
      ctx.stroke();
    } else if (cell.roleName.startsWith('Basalt Anchor')) {
      // Anchor footing disc
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, radius * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.globalAlpha = 0.7;
      ctx.fill();
    }

    if (radius >= 13) {
      ctx.font = `${Math.floor(radius * 0.85)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.globalAlpha = 0.9;
      ctx.fillText(cell.roleGlyph, screen.x, screen.y);
    }
  }

  // =========================================================================
  // Predatory Encirclement Arcs
  // =========================================================================

  private drawEncirclementArcs(
    renderCtx: IKinematicRenderContext,
    body: IKinematicBody,
    filter?: {
      isLineageIsolation?: boolean;
      pinnedCladeId?: string | null;
      pinnedBodyId?: string | null;
    }
  ): void {
    const { ctx, camera, w, h } = renderCtx;
    const isLineageIsolation = filter?.isLineageIsolation ?? false;
    const pinnedCladeId = filter?.pinnedCladeId ?? null;
    const pinnedBodyId = filter?.pinnedBodyId ?? null;
    const isPinned = (body.bodyId === pinnedBodyId) || (pinnedCladeId !== null && body.cladeId === pinnedCladeId);
    if (isLineageIsolation && (pinnedCladeId || pinnedBodyId) && !isPinned) return;

    ctx.save();
    const screen = camera.project(body.centroid, w, h);
    if (screen && screen.depth > 0) {
      const arcRadius = Math.max(25, 45 * (24.0 / camera.distance));
      const pulse = 1.0 + Math.sin(this.pulsePhase * 2) * 0.08;

      ctx.beginPath();
      ctx.arc(screen.x, screen.y, arcRadius * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = '#f43f5e'; // Crimson
      ctx.lineWidth = 2.5;
      ctx.setLineDash([8, 6]);
      ctx.globalAlpha = 0.75;
      ctx.stroke();
      ctx.setLineDash([]);
      // NOTE: Loud text banner removed to prevent billboard clutter during playback
    }
    ctx.restore();
  }

  // =========================================================================
  // Forward Streaming Chevrons (Treadmilling Token Flow)
  // =========================================================================

  private drawStreamingChevrons(
    renderCtx: IKinematicRenderContext,
    frame: IKinematicFrame
  ): void {
    const { ctx, camera, w, h } = renderCtx;
    ctx.save();
    for (const sc of frame.streamingChevrons) {
      const fromW = this.hexToWorld(sc.fromCoord);
      const toW = this.hexToWorld(sc.toCoord);

      const p1 = camera.project(fromW, w, h);
      const p2 = camera.project(toW, w, h);
      if (!p1 || !p2 || p1.depth <= 0 || p2.depth <= 0) continue;

      // Draw animated dashed line from rear to front
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = sc.color;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 5]);
      ctx.lineDashOffset = -this.pulsePhase * 8;
      ctx.globalAlpha = 0.75;
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw flow chevron arrow at midpoint
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

      ctx.beginPath();
      ctx.moveTo(midX - 6 * Math.cos(angle - 0.5), midY - 6 * Math.sin(angle - 0.5));
      ctx.lineTo(midX, midY);
      ctx.lineTo(midX - 6 * Math.cos(angle + 0.5), midY - 6 * Math.sin(angle + 0.5));
      ctx.strokeStyle = sc.color;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
    ctx.restore();
  }

  // =========================================================================
  // Apoptosis Halos (Trailing Pore Vacating)
  // =========================================================================

  private drawApoptosisHalos(
    renderCtx: IKinematicRenderContext,
    frame: IKinematicFrame
  ): void {
    const { ctx, camera, w, h } = renderCtx;
    ctx.save();
    for (const ah of frame.apoptosisHalos) {
      const wPos = this.hexToWorld(ah.coord);
      const screen = camera.project(wPos, w, h);
      if (!screen || screen.depth <= 0) continue;

      const radius = 16 + Math.sin(this.pulsePhase * 3) * 6;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = ah.color;
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.globalAlpha = 0.6;
      ctx.stroke();
      ctx.setLineDash([]);
      // NOTE: Text 'Vacated' removed to eliminate billboard clutter
    }
    ctx.restore();
  }

  // =========================================================================
  // Trophic Activity Rays (Predation, Vent Plume Feeding, Scavenging)
  // =========================================================================

  private drawTrophicRays(
    renderCtx: IKinematicRenderContext,
    frame: IKinematicFrame
  ): void {
    const { ctx, camera, w, h } = renderCtx;
    ctx.save();
    for (const ray of frame.trophicRays) {
      const fromW = this.hexToWorld(ray.sourceCoord);
      const toW = this.hexToWorld(ray.targetCoord);

      const p1 = camera.project(fromW, w, h);
      const p2 = camera.project(toW, w, h);
      if (!p1 || !p2 || p1.depth <= 0 || p2.depth <= 0) continue;

      if (ray.type === 'chelation') {
        const radius = 14 + Math.sin(this.pulsePhase * 4) * 4;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = ray.color;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = 0.85;
        ctx.stroke();
        continue;
      }

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = ray.color;
      ctx.lineWidth = ray.type === 'predation' || ray.type === 'kleptoplasty' ? 3.5 : 2;
      ctx.globalAlpha = 0.8 + Math.sin(this.pulsePhase * 3) * 0.15;
      ctx.stroke();

      // Draw particle bead traveling along the ray
      const t = (this.pulsePhase / (Math.PI * 2)) % 1.0;
      const beadX = p1.x + (p2.x - p1.x) * t;
      const beadY = p1.y + (p2.y - p1.y) * t;

      ctx.beginPath();
      ctx.arc(beadX, beadY, ray.type === 'predation' ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = ray.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  }

  // =========================================================================
  // Velocity Vector & Heading Arrow
  // =========================================================================

  private drawVelocityVector(
    renderCtx: IKinematicRenderContext,
    body: IKinematicBody
  ): void {
    if (body.speed < 0.04) return;
    const { ctx, camera, w, h } = renderCtx;
    ctx.save();
    const screen = camera.project(body.centroid, w, h);
    if (screen && screen.depth > 0) {
      const arrowLen = Math.min(60, Math.max(15, body.speed * 80));
      const endX = screen.x + Math.cos(body.heading) * arrowLen;
      const endY = screen.y + Math.sin(body.heading) * arrowLen;

      ctx.beginPath();
      ctx.moveTo(screen.x, screen.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Arrow head
      const headAngle = body.heading;
      const headLen = 7;
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - headLen * Math.cos(headAngle - Math.PI / 6),
        endY - headLen * Math.sin(headAngle - Math.PI / 6)
      );
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - headLen * Math.cos(headAngle + Math.PI / 6),
        endY - headLen * Math.sin(headAngle + Math.PI / 6)
      );
      ctx.stroke();
    }
    ctx.restore();
  }

  // =========================================================================
  // Species Badge Overhead (Holographic Beacon Pin)
  // ONLY rendered when an organism is explicitly pinned/tagged by the researcher
  // =========================================================================

  private drawSpeciesBadge(
    renderCtx: IKinematicRenderContext,
    body: IKinematicBody,
    isPinned: boolean
  ): void {
    if (!isPinned) return; // Strict: ONLY render holographic beacon chip for user-tagged organisms!
    const { ctx, camera, w, h } = renderCtx;
    ctx.save();
    const screen = camera.project(body.centroid, w, h);
    if (screen && screen.depth > 0) {
      const laserHeight = 42;
      const chipY = screen.y - laserHeight;

      // 1. Glowing anchor dot at body centroid
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24'; // Amber
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // 2. Vertical holographic beacon laser line rising to chip
      ctx.beginPath();
      ctx.moveTo(screen.x, screen.y);
      ctx.lineTo(screen.x, chipY);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 2]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Compact Holographic Info Chip
      let behaviorLabel = '⚓ Sessile';
      if (body.behavior === 'CHEMOTACTIC_ADVANCE') behaviorLabel = '🏃 Toward Vent';
      else if (body.behavior === 'THERMAL_EVASION') behaviorLabel = '🛡️ Thermal Retreat';
      else if (body.behavior === 'PREDATORY_ENCIRCLE') behaviorLabel = '🎯 Encircle Prey';
      else if (body.behavior === 'FORAGING_SEARCH') behaviorLabel = '🌿 Foraging';

      const line1 = `📌 ${body.speciesName} [${body.organismId}]`;
      const typeLabel = body.isMulticellularDifferentiated ? '🧬 Metazoan' : (body.isClonalColony ? '🧫 Colony' : '🦠 Solitary');
      const line2 = `${typeLabel} • ${body.cells.length}p • ${behaviorLabel} (v=${body.speed.toFixed(2)})`;

      ctx.font = 'bold 11px monospace';
      const w1 = ctx.measureText(line1).width;
      ctx.font = '10px monospace';
      const w2 = ctx.measureText(line2).width;

      const chipW = Math.max(w1, w2) + 20;
      const chipH = 34;
      const chipX = screen.x - chipW / 2;

      // Glass chip background
      ctx.beginPath();
      ctx.roundRect(chipX, chipY - chipH, chipW, chipH, 6);
      ctx.fillStyle = 'rgba(10, 16, 30, 0.92)';
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Text lines
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#fef08a';
      ctx.fillText(line1, screen.x, chipY - chipH + 4);

      ctx.font = '10px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(line2, screen.x, chipY - chipH + 18);
    }
    ctx.restore();
  }

  // =========================================================================
  // Environmental Event Banner
  // =========================================================================

  private drawEnvironmentalBanner(
    renderCtx: IKinematicRenderContext,
    eventDesc: string,
    tick: number
  ): void {
    const { ctx, w } = renderCtx;
    ctx.save();
    const bannerText = `⚡ HISTORICAL EVENT (Tick ${tick}): ${eventDesc}`;
    ctx.font = 'bold 12px monospace';
    const textWidth = ctx.measureText(bannerText).width;
    const boxW = Math.min(w - 40, textWidth + 30);
    const boxH = 26;

    ctx.fillStyle = 'rgba(239, 68, 68, 0.9)'; // Red alert
    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = 1.5;

    const bx = (w - boxW) / 2;
    const by = 55;

    ctx.beginPath();
    ctx.roundRect(bx, by, boxW, boxH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(bannerText, w / 2, by + boxH / 2);
    ctx.restore();
  }

  private hexToWorld(hex: HexCoord3D): { x: number; y: number; z: number } {
    return {
      x: hex.q * Math.sqrt(3) + (hex.r * Math.sqrt(3)) / 2,
      y: hex.r * 1.5,
      z: hex.z * 1.2
    };
  }
}
