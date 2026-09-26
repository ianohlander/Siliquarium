/**
 * 🐠 Siliquarium Physics Subsystem
 * VentPhysics: Hydrothermal Waveform Generation & Convective Plume Dynamics.
 * Models two-substrate non-equilibrium chemistry (Stream A fuel + Stream B oxidizer).
 */

import { HexCoord3D } from '../spatial/HexCoord3D.js';

export interface IVentState {
  readonly tick: number;
  readonly streamA: boolean;
  readonly streamB: boolean;
  readonly toxinT: boolean;
  readonly thermalFlux: number;
}

export class VentPhysics {
  public static readonly FAST_PULSE_PERIOD_A = 2; // Alternates every 2 ticks
  public static readonly FAST_PULSE_PERIOD_B = 3; // Alternates every 3 ticks
  public static readonly DIURNAL_CYCLE_PERIOD = 120; // 120 ticks per day/night
  public static readonly TOXIN_BURST_PERIOD = 50;  // Periodic acid/toxin bursts

  public readonly nozzleCoord: HexCoord3D;
  private readonly totalEnergyCap: number;

  constructor(nozzleCoord: HexCoord3D = new HexCoord3D(0, 0, 0), totalEnergyCap: number = 500) {
    this.nozzleCoord = nozzleCoord;
    this.totalEnergyCap = totalEnergyCap;
  }

  public evaluateAt(coord: HexCoord3D, tick: number): IVentState {
    const dist = this.nozzleCoord.distanceTo(coord);
    const dissipation = 1 / (1 + 0.15 * (dist * dist));

    // Multi-scale diurnal modulation
    const diurnalPhase = (tick % VentPhysics.DIURNAL_CYCLE_PERIOD) / VentPhysics.DIURNAL_CYCLE_PERIOD;
    const diurnalStrength = 0.5 + 0.5 * Math.sin(2 * Math.PI * diurnalPhase);

    // Fast alternating substrate pulses
    const rawA = Math.floor(tick / VentPhysics.FAST_PULSE_PERIOD_A) % 2 === 1;
    const rawB = Math.floor(tick / VentPhysics.FAST_PULSE_PERIOD_B) % 2 === 1;
    const rawT = (tick % VentPhysics.TOXIN_BURST_PERIOD) === 0;

    // At distance, probability of receiving pulse falls with dissipation
    const effectiveA = rawA && dissipation > 0.1;
    const effectiveB = rawB && dissipation > 0.1;
    const effectiveT = rawT && dissipation > 0.2;

    const thermalFlux = this.totalEnergyCap * dissipation * diurnalStrength;

    return {
      tick,
      streamA: effectiveA,
      streamB: effectiveB,
      toxinT: effectiveT,
      thermalFlux
    };
  }

  public getEnergyCap(): number {
    return this.totalEnergyCap;
  }
}
