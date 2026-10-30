/**
 * 🐠 Siliquarium Physics Subsystem
 * VentPhysics: Hydrothermal Waveform Generation & Convective Plume Dynamics.
 * Models two-substrate non-equilibrium chemistry (Stream A fuel + Stream B oxidizer).
 */

import { HexCoord3D } from '../spatial/HexCoord3D.js';

export enum GeochemicalRegime {
  BALANCED_COUPLED = 'BALANCED_COUPLED',   // Standard hydrothermal A + B
  SULFIDE_DOMINANT = 'SULFIDE_DOMINANT',   // Stream A surge, Stream B famine
  IRON_ALKALINE = 'IRON_ALKALINE',         // Stream B surge, Stream A famine
  TOXIN_ACID_SURGE = 'TOXIN_ACID_SURGE'    // Acid / heavy metal purge
}

export interface IVentState {
  readonly tick: number;
  readonly regime: GeochemicalRegime;
  readonly effectiveNozzleCoord: HexCoord3D;
  readonly streamA: boolean;
  readonly streamB: boolean;
  readonly streamC: boolean;
  readonly streamD: boolean;
  readonly toxinT: boolean;
  readonly thermalFlux: number;
  readonly photonIr: boolean;
  readonly baroAcoustic: boolean;
  readonly electroRedox: boolean;
  readonly precursorWarning: boolean;
  readonly wavePhaseLag: number;
  readonly conduitChoking: number;
}

export class VentPhysics {
  public static readonly FAST_PULSE_PERIOD_A = 2; // Alternates every 2 ticks
  public static readonly FAST_PULSE_PERIOD_B = 3; // Alternates every 3 ticks
  public static readonly DIURNAL_CYCLE_PERIOD = 120; // 120 ticks per day/night
  public static readonly TOXIN_BURST_PERIOD = 50;  // Periodic acid/toxin bursts
  public static readonly REGIME_CYCLE_PERIOD = 240; // 240 ticks per full geochemical era

  public nozzleCoord: HexCoord3D;
  public plumeWanderingEnabled: boolean = true;
  public regimeCyclingEnabled: boolean = true;
  private offshootCoords: HexCoord3D[] = [];
  private readonly totalEnergyCap: number;
  private conduitChoking: number = 0;

  constructor(
    nozzleCoord: HexCoord3D = new HexCoord3D(0, 0, 0),
    totalEnergyCap: number = 500,
    offshootCoords: readonly HexCoord3D[] = []
  ) {
    this.nozzleCoord = nozzleCoord;
    this.totalEnergyCap = totalEnergyCap;
    this.offshootCoords = [...offshootCoords];
  }

  public setNozzleCoord(coord: HexCoord3D): void {
    this.nozzleCoord = coord;
  }

  public setOffshoots(offshoots: readonly HexCoord3D[]): void {
    this.offshootCoords = [...offshoots];
  }

  public getOffshoots(): readonly HexCoord3D[] {
    return this.offshootCoords;
  }

  public getAllVentCoords(): readonly HexCoord3D[] {
    return [this.nozzleCoord, ...this.offshootCoords];
  }

  public getTelemetry(tick: number): {
    nozzleCoord: HexCoord3D;
    offshootCoords: readonly HexCoord3D[];
    regimeName: string;
    streamA: boolean;
    streamB: boolean;
    streamC: boolean;
    toxinT: boolean;
    thermalFlux: number;
    precursorWarning?: boolean;
    conduitChoking?: number;
  } {
    const vState = this.evaluateAt(this.nozzleCoord, tick);
    return {
      nozzleCoord: this.nozzleCoord,
      offshootCoords: this.getOffshoots(),
      regimeName: vState.regime,
      streamA: vState.streamA,
      streamB: vState.streamB,
      streamC: vState.streamC,
      toxinT: vState.toxinT,
      thermalFlux: vState.thermalFlux,
      precursorWarning: vState.precursorWarning,
      conduitChoking: vState.conduitChoking
    };
  }

  public getRegime(tick: number): GeochemicalRegime {
    if (!this.regimeCyclingEnabled) return GeochemicalRegime.BALANCED_COUPLED;
    const phase = tick % VentPhysics.REGIME_CYCLE_PERIOD;
    if (phase < 100) return GeochemicalRegime.BALANCED_COUPLED;
    if (phase < 150) return GeochemicalRegime.SULFIDE_DOMINANT;
    if (phase < 200) return GeochemicalRegime.IRON_ALKALINE;
    return GeochemicalRegime.TOXIN_ACID_SURGE;
  }

  public getEffectiveNozzleCoord(tick: number): HexCoord3D {
    if (!this.plumeWanderingEnabled) return this.nozzleCoord;
    // Slow convective precession across neighboring pores
    const angle = (tick / 90) * 2 * Math.PI;
    const dq = Math.round(Math.cos(angle));
    const dr = Math.round(Math.sin(angle));
    return new HexCoord3D(this.nozzleCoord.q + dq, this.nozzleCoord.r + dr, this.nozzleCoord.z);
  }

  public evaluateAt(coord: HexCoord3D, tick: number): IVentState {
    const effNozzle = this.getEffectiveNozzleCoord(tick);
    let minDist = effNozzle.distanceTo(coord);
    for (const off of this.offshootCoords) {
      const d = off.distanceTo(coord);
      if (d < minDist) minDist = d;
    }
    const dissipation = 1 / (1 + 0.15 * (minDist * minDist));

    // Spatial traveling wave phase lag (advection/acoustic delay from physical chimney orifice)
    let physicalDist = this.nozzleCoord.distanceTo(coord);
    for (const off of this.offshootCoords) {
      const d = off.distanceTo(coord);
      if (d < physicalDist) physicalDist = d;
    }
    const wavePhaseLag = Math.floor(physicalDist * 1.0);
    const localTick = Math.max(0, tick - wavePhaseLag);

    // Multi-scale diurnal modulation with wave lag
    const diurnalPhase = (localTick % VentPhysics.DIURNAL_CYCLE_PERIOD) / VentPhysics.DIURNAL_CYCLE_PERIOD;
    const diurnalStrength = 0.5 + 0.5 * Math.sin(2 * Math.PI * diurnalPhase);

    // Geochemical regime waveforms evaluated at local phase
    const regime = this.getRegime(localTick);
    let rawA = false;
    let rawB = false;
    let rawT = false;
    let precursorWarning = false;

    switch (regime) {
      case GeochemicalRegime.BALANCED_COUPLED:
        rawA = Math.floor(localTick / VentPhysics.FAST_PULSE_PERIOD_A) % 2 === 1;
        rawB = Math.floor(localTick / VentPhysics.FAST_PULSE_PERIOD_B) % 2 === 1;
        rawT = (localTick % VentPhysics.TOXIN_BURST_PERIOD) === 0;
        precursorWarning = ((localTick + 2) % VentPhysics.TOXIN_BURST_PERIOD === 0) || ((localTick + 1) % VentPhysics.TOXIN_BURST_PERIOD === 0);
        break;
      case GeochemicalRegime.SULFIDE_DOMINANT:
        rawA = true;
        rawB = (localTick % 5) === 0;
        rawT = (localTick % 60) === 0;
        precursorWarning = ((localTick + 2) % 60 === 0) || ((localTick + 1) % 60 === 0);
        break;
      case GeochemicalRegime.IRON_ALKALINE:
        rawA = (localTick % 5) === 0;
        rawB = true;
        rawT = (localTick % 60) === 0;
        precursorWarning = ((localTick + 2) % 60 === 0) || ((localTick + 1) % 60 === 0);
        break;
      case GeochemicalRegime.TOXIN_ACID_SURGE:
        rawA = (localTick % 3) === 0;
        rawB = (localTick % 3) === 0;
        rawT = (localTick % 3) !== 0;
        precursorWarning = (localTick % 3) === 0;
        break;
    }

    // At distance, probability of receiving pulse falls with dissipation
    const effectiveA = rawA && dissipation > 0.1;
    const effectiveB = rawB && dissipation > 0.1;
    // Substrate C is refractory pyrophosphate/methane present in ambient benthic floor
    const rawC = (localTick % 2 === 0);
    const effectiveC = rawC && dissipation > 0.05;
    // Substrate D is ammonia/nitrogen nutrient pulsed on diurnal cycle
    const rawD = (localTick % 4 === 0);
    const effectiveD = rawD && dissipation > 0.08;
    const effectiveT = rawT && dissipation > 0.18;

    // Mineral choking throttles convective thermal flux
    const chokingThrottle = Math.max(0.2, 1.0 - 0.7 * this.conduitChoking);
    const thermalFlux = this.totalEnergyCap * dissipation * diurnalStrength * chokingThrottle;

    // Physical carrier wavefields:
    // 1. Photon IR: Blackbody thermal radiation emitted by high-temperature hydrothermal fluids
    const photonIr = thermalFlux > 40;
    // 2. Baro/Acoustic: Seismic tremors and acoustic cavitation shockwaves
    const baroAcoustic = (precursorWarning && dissipation > 0.1) || (this.conduitChoking > 0.6 && localTick % 10 === 0);
    // 3. Electro/Redox: Steep electrochemical gradient near the turbulent plume boundary
    const electroRedox = (effectiveA !== effectiveB) && dissipation > 0.15;

    return {
      tick,
      regime,
      effectiveNozzleCoord: effNozzle,
      streamA: effectiveA,
      streamB: effectiveB,
      streamC: effectiveC,
      streamD: effectiveD,
      toxinT: effectiveT,
      thermalFlux,
      photonIr,
      baroAcoustic,
      electroRedox,
      precursorWarning: precursorWarning && dissipation > 0.1,
      wavePhaseLag,
      conduitChoking: this.conduitChoking
    };
  }

  public accumulateChoking(rate: number = 0.002): number {
    this.conduitChoking = Math.min(1.0, this.conduitChoking + rate);
    return this.conduitChoking;
  }

  public getConduitChoking(): number {
    return this.conduitChoking;
  }

  public setConduitChoking(val: number): void {
    this.conduitChoking = Math.max(0, Math.min(1, val));
  }

  public triggerConduitBlowout(): boolean {
    const wasChoked = this.conduitChoking >= 0.8;
    this.conduitChoking = 0;
    return wasChoked;
  }

  public isConduitChoked(): boolean {
    return this.conduitChoking >= 1.0;
  }

  public getEnergyCap(): number {
    return this.totalEnergyCap;
  }
}
