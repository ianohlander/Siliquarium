/**
 * 🐠 Siliquarium Visualizer Subsystem
 * CircuitMicroscopeView: Interactive 2D Schematic Microscope for Pore Workshops.
 * Renders real-time gate netlists, pulsing logic wires, battery gauges, and decoded codons.
 */

import { IPoreTelemetry, IVentTelemetry } from '../engine/SimulationTelemetry.js';
import { CodonTranslator } from '../core/codons/CodonTranslator.js';
import { PoreState } from '../core/domain/Pore.js';

export class CircuitMicroscopeView {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private animPhase: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to obtain 2D canvas context for Circuit Microscope.');
    this.ctx = ctx;
  }

  public render(pore: IPoreTelemetry | null, vent: IVentTelemetry): void {
    const w = this.canvas.width;
    const h = this.canvas.height;
    if (w <= 0 || h <= 0) return;

    this.animPhase += 0.08;
    this.ctx.clearRect(0, 0, w, h);
    this.drawBackground(w, h);

    if (!pore) {
      this.drawEmptyState(w, h, 'Click any seafloor pore to focus microscope');
      return;
    }

    if (pore.state === PoreState.EMPTY) {
      this.drawEmptyPoreState(w, h, pore);
      return;
    }

    if (pore.state === PoreState.CARCASS) {
      this.drawCarcassState(w, h, pore);
      return;
    }

    this.drawLivingCellMicroscope(w, h, pore, vent);
  }

  private drawBackground(w: number, h: number): void {
    const grad = this.ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0a0f1d');
    grad.addColorStop(1, '#040711');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, w, h);

    // Grid reticle lines
    this.ctx.strokeStyle = '#111c35';
    this.ctx.lineWidth = 1;
    for (let x = 20; x < w; x += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }
  }

  private drawEmptyState(w: number, h: number, text: string): void {
    this.ctx.fillStyle = '#64748b';
    this.ctx.font = '13px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(text, w / 2, h / 2);
  }

  private drawEmptyPoreState(_w: number, _h: number, pore: IPoreTelemetry): void {
    this.ctx.fillStyle = '#38bdf8';
    this.ctx.font = 'bold 14px monospace';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`PORE [${pore.coord.q}, ${pore.coord.r}, ${pore.coord.z}]`, 20, 30);

    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = '12px monospace';
    this.ctx.fillText('STATUS: VACANT BENTHIC CAVITY', 20, 52);
    this.ctx.fillText('Awaiting primordial soup colonizer...', 20, 80);
  }

  private drawCarcassState(_w: number, _h: number, pore: IPoreTelemetry): void {
    this.ctx.fillStyle = '#f59e0b';
    this.ctx.font = 'bold 14px monospace';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`PORE [${pore.coord.q}, ${pore.coord.r}, ${pore.coord.z}]`, 20, 30);

    this.ctx.fillStyle = '#cbd5e1';
    this.ctx.font = '12px monospace';
    this.ctx.fillText('STATUS: MINERALIZING DETRITUS CARCASS', 20, 52);
    this.ctx.fillText(`Residual Energy: ${pore.energy} tokens`, 20, 80);
    this.ctx.fillText(`Recyclable Matter: ${pore.matter} tokens`, 20, 102);
    this.ctx.fillText('Available for benthic scavengers', 20, 130);
  }

  private drawLivingCellMicroscope(w: number, h: number, pore: IPoreTelemetry, vent: IVentTelemetry): void {
    // 1. Header info
    this.ctx.fillStyle = '#38bdf8';
    this.ctx.font = 'bold 13px monospace';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`PORE [${pore.coord.q}, ${pore.coord.r}, ${pore.coord.z}] - GEN ${pore.generation}`, 16, 25);

    // 2. Battery & Matter Meter
    this.drawGauges(pore, 16, 42, w - 32);

    // 3. Vent Porin Inputs
    this.drawInputPins(vent, 16, 105);

    // 4. Logic Gates schematic
    this.drawCircuitGates(pore, vent, 16, 165, w - 32);

    // 5. Genome Tape Ribbon
    this.drawGenomeTape(pore.tapeBitstring, 16, h - 50, w - 32);
  }

  private drawGauges(pore: IPoreTelemetry, x: number, y: number, width: number): void {
    // Energy gauge
    const eFrac = Math.max(0, Math.min(1, pore.energy / 100));
    this.ctx.fillStyle = '#64748b';
    this.ctx.font = '11px monospace';
    this.ctx.fillText(`BATTERY: ${pore.energy}/100`, x, y);

    this.ctx.fillStyle = '#1e293b';
    this.ctx.fillRect(x, y + 4, width, 12);
    this.ctx.fillStyle = eFrac > 0.5 ? '#10b981' : (eFrac > 0.25 ? '#38bdf8' : '#f59e0b');
    this.ctx.fillRect(x, y + 4, width * eFrac, 12);

    // Matter gauge
    const mFrac = Math.max(0, Math.min(1, pore.matter / 40));
    this.ctx.fillStyle = '#64748b';
    this.ctx.fillText(`MATTER: ${pore.matter}/40 | AGE: ${pore.age} ticks`, x, y + 30);
    this.ctx.fillStyle = '#1e293b';
    this.ctx.fillRect(x, y + 34, width, 8);
    this.ctx.fillStyle = '#818cf8';
    this.ctx.fillRect(x, y + 34, width * mFrac, 8);
  }

  private drawInputPins(vent: IVentTelemetry, x: number, y: number): void {
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = '11px monospace';
    this.ctx.fillText('SUBSTRATE PORIN BUS:', x, y);

    this.drawPinIndicator(x, y + 8, 'STREAM A (FUEL)', vent.streamA, '#f59e0b');
    this.drawPinIndicator(x + 130, y + 8, 'STREAM B (OXIDIZER)', vent.streamB, '#06b6d4');
    this.drawPinIndicator(x + 270, y + 8, 'TOXIN T', vent.toxinT, '#f43f5e');
  }

  private drawPinIndicator(x: number, y: number, label: string, active: boolean, activeColor: string): void {
    this.ctx.beginPath();
    this.ctx.arc(x + 6, y + 8, 5, 0, Math.PI * 2);
    this.ctx.fillStyle = active ? activeColor : '#334155';
    this.ctx.fill();
    this.ctx.fillStyle = active ? '#ffffff' : '#64748b';
    this.ctx.font = '10px monospace';
    this.ctx.fillText(label, x + 16, y + 12);
  }

  private drawCircuitGates(pore: IPoreTelemetry, vent: IVentTelemetry, x: number, y: number, width: number): void {
    const translation = CodonTranslator.translateTape(pore.tapeBitstring);
    const gates = translation.catalyticGates;

    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = '11px monospace';
    this.ctx.fillText(`PHENOTYPIC CIRCUIT NETLIST (${gates.length} Gates):`, x, y);

    if (gates.length === 0) {
      this.ctx.fillStyle = '#64748b';
      this.ctx.fillText('Primitive Diffusion Organism (No Active Logic Gates)', x, y + 30);
      return;
    }

    const gateH = 34;
    const gateW = Math.min(100, Math.floor(width / Math.min(gates.length, 3)) - 12);

    for (let i = 0; i < Math.min(gates.length, 6); i++) {
      const g = gates[i];
      const gx = x + (i % 3) * (gateW + 16);
      const gy = y + 18 + Math.floor(i / 3) * (gateH + 20);

      const isHigh = vent.streamA && vent.streamB; // Visual conduction
      this.ctx.strokeStyle = isHigh ? '#38bdf8' : '#334155';
      this.ctx.lineWidth = 1.5;
      this.ctx.fillStyle = '#0f172a';
      this.ctx.fillRect(gx, gy, gateW, gateH);
      this.ctx.strokeRect(gx, gy, gateW, gateH);

      this.ctx.fillStyle = isHigh ? '#38bdf8' : '#94a3b8';
      this.ctx.font = 'bold 11px monospace';
      this.ctx.textAlign = 'center';
      const label = g.definition.type.replace('GATE_', '');
      this.ctx.fillText(label, gx + gateW / 2, gy + 20);
    }
  }

  private drawGenomeTape(tape: string, x: number, y: number, width: number): void {
    if (!tape || tape.length < 60) return;
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = '10px monospace';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('1D GENOME TAPE (10 Codons / 60 Bits):', x, y);

    const blockW = Math.floor(width / 10);
    for (let i = 0; i < 10; i++) {
      const codonBits = tape.substring(i * 6, (i + 1) * 6);
      const bx = x + i * blockW;
      const by = y + 6;

      this.ctx.fillStyle = this.getCodonColor(codonBits);
      this.ctx.fillRect(bx, by, blockW - 2, 14);

      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '8px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(codonBits.substring(0, 3), bx + (blockW - 2) / 2, by + 10);
    }
  }

  private getCodonColor(bits: string): string {
    const val = parseInt(bits, 2);
    if (val < 16) return '#0284c7'; // Gate (Sky blue)
    if (val < 32) return '#d97706'; // Sensor (Amber)
    if (val < 48) return '#7c3aed'; // Metabolic sink (Purple)
    return '#334155';               // Neutral Intron (Slate)
  }
}
