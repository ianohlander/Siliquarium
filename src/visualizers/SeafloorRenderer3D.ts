/**
 * 🐠 Siliquarium Visualizer Subsystem
 * SeafloorRenderer3D: 3D Benthic Seafloor & Hydrothermal Vent Matrix Renderer.
 * High-performance depth-sorted hexagonal prism projection with bioluminescent shading.
 */

import { HexCoord3D } from '../core/spatial/HexCoord3D.js';
import { PoreState } from '../core/domain/Pore.js';
import { OrbitCamera, IVector3 } from './OrbitCamera.js';
import { ISimulationTelemetry, IPoreTelemetry } from '../engine/SimulationTelemetry.js';

interface IProjectedHex {
  readonly pore: IPoreTelemetry;
  readonly centerScreen: { x: number; y: number };
  readonly topScreenVertices: { x: number; y: number }[];
  readonly baseScreenVertices: { x: number; y: number }[];
  readonly depth: number;
}

export class SeafloorRenderer3D {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly camera: OrbitCamera;

  private selectedCoord: HexCoord3D | null = null;
  private hoveredCoord: HexCoord3D | null = null;
  private plumeTime: number = 0;

  public static readonly HEX_RADIUS = 1.0;
  public static readonly HEX_HEIGHT = 0.8;
  public static readonly Z_LAYER_SPACING = 1.4;

  constructor(canvas: HTMLCanvasElement, camera: OrbitCamera) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to obtain 2D canvas context for 3D renderer.');
    this.ctx = ctx;
    this.camera = camera;
  }

  public setSelectedCoord(coord: HexCoord3D | null): void {
    this.selectedCoord = coord;
  }

  public setHoveredCoord(coord: HexCoord3D | null): void {
    this.hoveredCoord = coord;
  }

  public render(telemetry: ISimulationTelemetry): void {
    const w = this.canvas.width;
    const h = this.canvas.height;
    if (w <= 0 || h <= 0) return;

    this.camera.updateMatrices(w / h);
    this.ctx.clearRect(0, 0, w, h);
    this.drawAbyssalBackground(w, h);

    const projectedHexes = this.projectPores(telemetry.pores, w, h);
    projectedHexes.sort((a, b) => b.depth - a.depth);

    for (const item of projectedHexes) {
      this.drawHexPrism(item);
    }

    this.plumeTime += 0.05;
    this.drawThermalPlume(telemetry.vent.nozzleCoord, telemetry.vent.thermalFlux, w, h);
  }

  private drawAbyssalBackground(w: number, h: number): void {
    const grad = this.ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, Math.max(w, h));
    grad.addColorStop(0, '#061325'); // Hydrothermal water glow
    grad.addColorStop(0.6, '#020914'); // Deep abyssal navy
    grad.addColorStop(1, '#01040a'); // Midnight trench black
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, w, h);
  }

  private projectPores(pores: readonly IPoreTelemetry[], w: number, h: number): IProjectedHex[] {
    const results: IProjectedHex[] = [];
    const vm = this.camera.getViewMatrix();
    const pm = this.camera.getProjectionMatrix();

    for (const pore of pores) {
      const worldPos = this.axialToWorld(pore.coord);
      const centerScreen = this.projectWorldToScreen(worldPos, vm, pm, w, h);
      if (!centerScreen) continue;

      const topVerts: { x: number; y: number }[] = [];
      const baseVerts: { x: number; y: number }[] = [];
      let valid = true;

      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + Math.PI / 6;
        const dx = SeafloorRenderer3D.HEX_RADIUS * Math.cos(angle);
        const dz = SeafloorRenderer3D.HEX_RADIUS * Math.sin(angle);

        const topPt = this.projectWorldToScreen(
          { x: worldPos.x + dx, y: worldPos.y + SeafloorRenderer3D.HEX_HEIGHT, z: worldPos.z + dz },
          vm, pm, w, h
        );
        const basePt = this.projectWorldToScreen(
          { x: worldPos.x + dx, y: worldPos.y, z: worldPos.z + dz },
          vm, pm, w, h
        );

        if (!topPt || !basePt) { valid = false; break; }
        topVerts.push(topPt);
        baseVerts.push(basePt);
      }

      if (valid) {
        results.push({
          pore,
          centerScreen,
          topScreenVertices: topVerts,
          baseScreenVertices: baseVerts,
          depth: centerScreen.depth
        });
      }
    }
    return results;
  }

  public static axialToWorld(coord: HexCoord3D): IVector3 {
    const r = SeafloorRenderer3D.HEX_RADIUS;
    const x = r * Math.sqrt(3) * (coord.q + coord.r / 2);
    const z = r * (3 / 2) * coord.r;
    const y = coord.z * SeafloorRenderer3D.Z_LAYER_SPACING;
    return { x, y, z };
  }

  public axialToWorld(coord: HexCoord3D): IVector3 {
    return SeafloorRenderer3D.axialToWorld(coord);
  }

  private projectWorldToScreen(world: IVector3, vm: Float32Array, pm: Float32Array, w: number, h: number): { x: number; y: number; depth: number } | null {
    // View transform
    const vx = world.x * vm[0] + world.y * vm[4] + world.z * vm[8]  + vm[12];
    const vy = world.x * vm[1] + world.y * vm[5] + world.z * vm[9]  + vm[13];
    const vz = world.x * vm[2] + world.y * vm[6] + world.z * vm[10] + vm[14];
    const vw = world.x * vm[3] + world.y * vm[7] + world.z * vm[11] + vm[15] || 1;

    // Proj transform
    const cx = vx * pm[0] + vy * pm[4] + vz * pm[8]  + vw * pm[12];
    const cy = vx * pm[1] + vy * pm[5] + vz * pm[9]  + vw * pm[13];
    const cz = vx * pm[2] + vy * pm[6] + vz * pm[10] + vw * pm[14];
    const cw = vx * pm[3] + vy * pm[7] + vz * pm[11] + vw * pm[15];

    if (cw <= 0.1) return null;
    const ndcX = cx / cw;
    const ndcY = cy / cw;
    const screenX = (ndcX * 0.5 + 0.5) * w;
    const screenY = (1.0 - (ndcY * 0.5 + 0.5)) * h;

    return { x: screenX, y: screenY, depth: cz / cw };
  }

  private drawHexPrism(hex: IProjectedHex): void {
    const isSelected = this.selectedCoord?.equals(hex.pore.coord) ?? false;
    const isHovered = this.hoveredCoord?.equals(hex.pore.coord) ?? false;

    // Draw side panels
    this.ctx.fillStyle = '#0f172a';
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

    // Top cap styling
    this.ctx.beginPath();
    this.ctx.moveTo(hex.topScreenVertices[0].x, hex.topScreenVertices[0].y);
    for (let i = 1; i < 6; i++) {
      this.ctx.lineTo(hex.topScreenVertices[i].x, hex.topScreenVertices[i].y);
    }
    this.ctx.closePath();

    this.ctx.fillStyle = this.getPoreColor(hex.pore);
    this.ctx.fill();

    // Border highlights
    if (isSelected) {
      this.ctx.strokeStyle = '#38bdf8'; // Electric neon sky
      this.ctx.lineWidth = 3.0;
      this.ctx.stroke();
    } else if (isHovered) {
      this.ctx.strokeStyle = '#fbbf24'; // Golden highlight
      this.ctx.lineWidth = 2.0;
      this.ctx.stroke();
    } else {
      this.ctx.strokeStyle = '#1e293b';
      this.ctx.lineWidth = 1.0;
      this.ctx.stroke();
    }
  }

  private getPoreColor(pore: IPoreTelemetry): string {
    if (pore.isBasalt) return '#090d16';
    if (pore.state === PoreState.OCCUPIED) {
      const charge = Math.min(1.0, pore.energy / 100);
      return charge > 0.6 ? '#10b981' : (charge > 0.3 ? '#06b6d4' : '#eab308');
    }
    if (pore.state === PoreState.CARCASS) return '#64748b';
    return '#172033'; // Empty porous basalt
  }

  private drawThermalPlume(nozzleCoord: HexCoord3D, flux: number, w: number, h: number): void {
    const nozzleWorld = this.axialToWorld(nozzleCoord);
    const vm = this.camera.getViewMatrix();
    const pm = this.camera.getProjectionMatrix();

    for (let i = 0; i < 12; i++) {
      const offset = (this.plumeTime * 1.5 + i * 0.4) % 6.0;
      const pt = this.projectWorldToScreen(
        { x: nozzleWorld.x + Math.sin(offset * 2 + i) * 0.3, y: nozzleWorld.y + offset * 0.8, z: nozzleWorld.z + Math.cos(offset * 2 + i) * 0.3 },
        vm, pm, w, h
      );
      if (pt) {
        const radius = Math.max(2, 6 - offset);
        const alpha = Math.max(0, 0.6 * (1.0 - offset / 6.0) * (flux / 500));
        this.ctx.fillStyle = `rgba(245, 158, 11, ${alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  public findPoreAtScreenCoord(screenX: number, screenY: number, telemetry: ISimulationTelemetry): HexCoord3D | null {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const projected = this.projectPores(telemetry.pores, w, h);
    projected.sort((a, b) => a.depth - b.depth); // Closest first

    for (const item of projected) {
      const dx = screenX - item.centerScreen.x;
      const dy = screenY - item.centerScreen.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= 18) {
        return item.pore.coord;
      }
    }
    return null;
  }
}
