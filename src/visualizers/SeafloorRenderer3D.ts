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

  public setSelectedCoord(coord: HexCoord3D | null): void { this.selectedCoord = coord; }
  public setHoveredCoord(coord: HexCoord3D | null): void { this.hoveredCoord = coord; }

  public render(telemetry: ISimulationTelemetry): void {
    const w = this.canvas.width, h = this.canvas.height;
    if (w <= 0 || h <= 0) return;

    this.camera.updateMatrices(w / h);
    this.ctx.clearRect(0, 0, w, h);
    this.drawAbyssalBackground(w, h);

    const projectedHexes = this.projectPores(telemetry.pores, w, h);
    projectedHexes.sort((a, b) => b.depth - a.depth);

    for (const item of projectedHexes) this.drawHexPrism(item);

    this.plumeTime += 0.05;
    this.drawThermalPlume(telemetry.vent.nozzleCoord, telemetry.vent.thermalFlux, w, h);
  }

  private drawAbyssalBackground(w: number, h: number): void {
    const grad = this.ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, Math.max(w, h));
    grad.addColorStop(0, '#061325'); grad.addColorStop(0.6, '#020914'); grad.addColorStop(1, '#01040a');
    this.ctx.fillStyle = grad; this.ctx.fillRect(0, 0, w, h);
  }

  private projectPores(pores: readonly IPoreTelemetry[], w: number, h: number): IProjectedHex[] {
    const results: IProjectedHex[] = [];
    const vm = this.camera.getViewMatrix(), pm = this.camera.getProjectionMatrix();

    for (const pore of pores) {
      const worldPos = this.axialToWorld(pore.coord);
      const centerScreen = this.projectWorldToScreen(worldPos, vm, pm, w, h);
      if (!centerScreen) continue;

      const topVerts: { x: number; y: number }[] = [];
      const baseVerts: { x: number; y: number }[] = [];
      let valid = true;

      for (let i = 0; i < 6; i++) {
        const ang = (Math.PI / 3) * i + Math.PI / 6;
        const dx = SeafloorRenderer3D.HEX_RADIUS * Math.cos(ang), dz = SeafloorRenderer3D.HEX_RADIUS * Math.sin(ang);
        const topPt = this.projectWorldToScreen({ x: worldPos.x + dx, y: worldPos.y + SeafloorRenderer3D.HEX_HEIGHT, z: worldPos.z + dz }, vm, pm, w, h);
        const basePt = this.projectWorldToScreen({ x: worldPos.x + dx, y: worldPos.y, z: worldPos.z + dz }, vm, pm, w, h);
        if (!topPt || !basePt) { valid = false; break; }
        topVerts.push(topPt); baseVerts.push(basePt);
      }

      if (valid) results.push({ pore, centerScreen, topScreenVertices: topVerts, baseScreenVertices: baseVerts, depth: centerScreen.depth });
    }
    return results;
  }

  public static axialToWorld(coord: HexCoord3D): IVector3 {
    const r = SeafloorRenderer3D.HEX_RADIUS;
    return { x: r * Math.sqrt(3) * (coord.q + coord.r / 2), y: coord.z * SeafloorRenderer3D.Z_LAYER_SPACING, z: r * 1.5 * coord.r };
  }

  public axialToWorld(coord: HexCoord3D): IVector3 { return SeafloorRenderer3D.axialToWorld(coord); }

  private projectWorldToScreen(world: IVector3, vm: Float32Array, pm: Float32Array, w: number, h: number): { x: number; y: number; depth: number } | null {
    const vx = world.x * vm[0] + world.y * vm[4] + world.z * vm[8]  + vm[12];
    const vy = world.x * vm[1] + world.y * vm[5] + world.z * vm[9]  + vm[13];
    const vz = world.x * vm[2] + world.y * vm[6] + world.z * vm[10] + vm[14];
    const vw = world.x * vm[3] + world.y * vm[7] + world.z * vm[11] + vm[15] || 1;
    if (vw <= 0.1) return null;

    const cx = vx * pm[0] + vy * pm[4] + vz * pm[8]  + vw * pm[12];
    const cy = vx * pm[1] + vy * pm[5] + vz * pm[9]  + vw * pm[13];
    const cz = vx * pm[2] + vy * pm[6] + vz * pm[10] + vw * pm[14];
    const cw = vx * pm[3] + vy * pm[7] + vz * pm[11] + vw * pm[15];
    if (cw <= 0.1) return null;

    return { x: ((cx / cw) * 0.5 + 0.5) * w, y: (1.0 - ((cy / cw) * 0.5 + 0.5)) * h, depth: cz / cw };
  }

  private drawHexPrism(hex: IProjectedHex): void {
    const eye = this.camera.getEyePosition();
    const isAqueous = hex.pore.isAqueous;
    if (isAqueous && eye.y < hex.pore.coord.z * SeafloorRenderer3D.Z_LAYER_SPACING) return;

    const isSelected = this.selectedCoord?.equals(hex.pore.coord) ?? false;
    const isHovered = this.hoveredCoord?.equals(hex.pore.coord) ?? false;
    const isEmpty = hex.pore.state === PoreState.EMPTY && !hex.pore.hasSpore;

    if (!isAqueous || !isEmpty) {
      this.ctx.fillStyle = isAqueous ? 'rgba(6, 44, 76, 0.22)' : '#0f172a';
      for (let i = 0; i < 6; i++) {
        const n = (i + 1) % 6;
        this.ctx.beginPath();
        this.ctx.moveTo(hex.baseScreenVertices[i].x, hex.baseScreenVertices[i].y);
        this.ctx.lineTo(hex.baseScreenVertices[n].x, hex.baseScreenVertices[n].y);
        this.ctx.lineTo(hex.topScreenVertices[n].x, hex.topScreenVertices[n].y);
        this.ctx.lineTo(hex.topScreenVertices[i].x, hex.topScreenVertices[i].y);
        this.ctx.closePath(); this.ctx.fill();
      }
    }

    this.ctx.beginPath();
    this.ctx.moveTo(hex.topScreenVertices[0].x, hex.topScreenVertices[0].y);
    for (let i = 1; i < 6; i++) this.ctx.lineTo(hex.topScreenVertices[i].x, hex.topScreenVertices[i].y);
    this.ctx.closePath();
    this.ctx.fillStyle = this.getPoreColor(hex.pore);
    this.ctx.fill();

    this.ctx.strokeStyle = isSelected ? '#38bdf8' : (isHovered ? '#fbbf24' : (isAqueous ? 'rgba(56, 189, 248, 0.05)' : '#1e293b'));
    this.ctx.lineWidth = isSelected ? 3.0 : (isHovered ? 2.0 : 1.0);
    this.ctx.stroke();

    const projRadius = Math.hypot(hex.topScreenVertices[0].x - hex.centerScreen.x, hex.topScreenVertices[0].y - hex.centerScreen.y);
    if (isSelected) this.drawSelectionIndicator(hex, projRadius);
    if (hex.pore.hasSpore) this.drawPelagicSpore(hex.centerScreen.x, hex.centerScreen.y, projRadius);
    if (hex.pore.state === PoreState.OCCUPIED && (isSelected || projRadius >= 24)) {
      this.drawInSituCircuit(hex, projRadius, isSelected);
    }
  }

  private drawSelectionIndicator(hex: IProjectedHex, radius: number): void {
    const pulse = 1.15 + 0.1 * Math.sin(this.plumeTime * 4);
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const px = hex.centerScreen.x + (hex.topScreenVertices[i].x - hex.centerScreen.x) * pulse;
      const py = hex.centerScreen.y + (hex.topScreenVertices[i].y - hex.centerScreen.y) * pulse;
      if (i === 0) this.ctx.moveTo(px, py); else this.ctx.lineTo(px, py);
    }
    this.ctx.closePath();
    this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
    this.ctx.lineWidth = 2.0; this.ctx.stroke();

    const bw = this.axialToWorld(hex.pore.coord); bw.y += 0.3;
    const tw = { x: bw.x, y: bw.y + 1.8, z: bw.z };
    const vm = this.camera.getViewMatrix(), pm = this.camera.getProjectionMatrix();
    const pBase = this.projectWorldToScreen(bw, vm, pm, this.canvas.width, this.canvas.height);
    const pTip = this.projectWorldToScreen(tw, vm, pm, this.canvas.width, this.canvas.height);
    if (pBase && pTip) {
      const w = Math.max(3, radius * 0.35);
      const grad = this.ctx.createLinearGradient(pBase.x, pBase.y, pTip.x, pTip.y);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
      this.ctx.fillStyle = grad; this.ctx.beginPath();
      this.ctx.moveTo(pBase.x - w, pBase.y); this.ctx.lineTo(pBase.x + w, pBase.y);
      this.ctx.lineTo(pTip.x + 1, pTip.y); this.ctx.lineTo(pTip.x - 1, pTip.y);
      this.ctx.closePath(); this.ctx.fill();
      this.ctx.fillStyle = '#38bdf8'; this.ctx.beginPath();
      this.ctx.arc(pTip.x, pTip.y, 3, 0, Math.PI * 2); this.ctx.fill();
    }
  }

  private drawPelagicSpore(cx: number, cy: number, radius: number): void {
    const r = Math.max(3, radius * 0.25 * (1.0 + 0.15 * Math.sin(this.plumeTime * 4)));
    const grad = this.ctx.createRadialGradient(cx, cy, 1, cx, cy, r * 2.0);
    grad.addColorStop(0, '#fef08a'); grad.addColorStop(0.6, '#eab308'); grad.addColorStop(1, 'rgba(234, 179, 8, 0)');
    this.ctx.fillStyle = grad; this.ctx.beginPath();
    this.ctx.arc(cx, cy, r * 2.0, 0, Math.PI * 2); this.ctx.fill();
  }

  private drawInSituCircuit(hex: IProjectedHex, radius: number, isSelected: boolean): void {
    const cx = hex.centerScreen.x, cy = hex.centerScreen.y;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius * 0.72, 0, Math.PI * 2);
    this.ctx.fillStyle = '#060a14'; this.ctx.fill();
    this.ctx.strokeStyle = isSelected ? '#38bdf8' : '#eab308';
    this.ctx.lineWidth = 1.2; this.ctx.stroke();

    this.ctx.strokeStyle = '#fbbf24'; this.ctx.lineWidth = Math.max(1, radius * 0.04);
    this.ctx.beginPath();
    const spiralRadius = radius * 0.32;
    for (let a = 0; a < Math.PI * 4; a += 0.2) {
      const r = (a / (Math.PI * 4)) * spiralRadius;
      const px = cx + r * Math.cos(a + this.plumeTime), py = cy + r * Math.sin(a + this.plumeTime);
      if (a === 0) this.ctx.moveTo(px, py); else this.ctx.lineTo(px, py);
    }
    this.ctx.stroke();

    const gateTypes = hex.pore.gateTypes;
    if (radius >= 32 && gateTypes.length > 0) {
      const gateCount = Math.min(4, gateTypes.length);
      const chipW = Math.max(8, radius * 0.22), chipH = Math.max(6, radius * 0.14);

      for (let i = 0; i < gateCount; i++) {
        const ang = (Math.PI * 2 / gateCount) * i + Math.PI / 4;
        const gx = cx + Math.cos(ang) * (radius * 0.52) - chipW / 2;
        const gy = cy + Math.sin(ang) * (radius * 0.52) - chipH / 2;
        this.ctx.fillStyle = '#0f172a'; this.ctx.fillRect(gx, gy, chipW, chipH);
        this.ctx.strokeStyle = hex.pore.primaryActive ? '#38bdf8' : '#334155';
        this.ctx.lineWidth = 1; this.ctx.strokeRect(gx, gy, chipW, chipH);
        this.ctx.beginPath(); this.ctx.moveTo(gx + chipW / 2, gy + chipH / 2); this.ctx.lineTo(cx, cy);
        this.ctx.strokeStyle = hex.pore.primaryActive ? 'rgba(56, 189, 248, 0.4)' : 'rgba(51, 65, 85, 0.3)';
        this.ctx.stroke();

        if (radius >= 40) {
          this.ctx.fillStyle = '#38bdf8'; this.ctx.font = `${Math.floor(chipH * 0.75)}px monospace`;
          this.ctx.textAlign = 'center'; this.ctx.textBaseline = 'middle';
          this.ctx.fillText(gateTypes[i], gx + chipW / 2, gy + chipH / 2);
        }
      }
    }
  }

  private getPoreColor(pore: IPoreTelemetry): string {
    if (pore.isAqueous) {
      if (pore.hasSpore) return 'rgba(234, 179, 8, 0.7)';
      if (pore.state === PoreState.OCCUPIED) return 'rgba(16, 185, 129, 0.65)';
      return 'rgba(6, 182, 212, 0.015)';
    }
    if (pore.isBasalt) return '#090d16';
    if (pore.state === PoreState.OCCUPIED) {
      const charge = Math.min(1.0, pore.energy / 100);
      return charge > 0.6 ? '#10b981' : (charge > 0.3 ? '#06b6d4' : '#eab308');
    }
    if (pore.state === PoreState.CARCASS) return '#64748b';
    return '#172033';
  }

  private drawThermalPlume(nozzleCoord: HexCoord3D, flux: number, w: number, h: number): void {
    const nozzleWorld = this.axialToWorld(nozzleCoord);
    const vm = this.camera.getViewMatrix(), pm = this.camera.getProjectionMatrix();

    for (let i = 0; i < 12; i++) {
      const offset = (this.plumeTime * 1.5 + i * 0.4) % 6.0;
      const pt = this.projectWorldToScreen(
        { x: nozzleWorld.x + Math.sin(offset * 2 + i) * 0.3, y: nozzleWorld.y + offset * 0.8, z: nozzleWorld.z + Math.cos(offset * 2 + i) * 0.3 },
        vm, pm, w, h
      );
      if (!pt) continue;
      this.ctx.fillStyle = `rgba(245, 158, 11, ${Math.max(0, 0.6 * (1.0 - offset / 6.0) * (flux / 500))})`;
      this.ctx.beginPath(); this.ctx.arc(pt.x, pt.y, Math.max(2, 6 - offset), 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  public findPoreAtScreenCoord(screenX: number, screenY: number, telemetry: ISimulationTelemetry): HexCoord3D | null {
    const w = this.canvas.width, h = this.canvas.height;
    const projected = this.projectPores(telemetry.pores, w, h);
    projected.sort((a, b) => a.depth - b.depth);

    for (const item of projected) {
      if (this.isPointInPolygon(screenX, screenY, item.topScreenVertices)) return item.pore.coord;
      const dx = screenX - item.centerScreen.x, dy = screenY - item.centerScreen.y;
      const projRadius = Math.hypot(item.topScreenVertices[0].x - item.centerScreen.x, item.topScreenVertices[0].y - item.centerScreen.y);
      if (Math.hypot(dx, dy) <= projRadius * 0.88) return item.pore.coord;
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
}
