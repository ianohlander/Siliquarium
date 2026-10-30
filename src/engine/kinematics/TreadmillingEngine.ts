/**
 * 🐠 Siliquarium Kinematics Subsystem
 * TreadmillingEngine: Biophysical Model of Slime Mold / Pseudoplasmodial Motility.
 * 
 * Implements non-teleological net spatial movement across discrete rock pores via:
 * 1. Apical / Chemotactic Directional Reproduction (Leading Edge)
 * 2. Protoplasmic Resorption & Scheduled Apoptosis (Trailing Edge)
 * 
 * Strictly preserves thermodynamic conservation invariants (ΔE ≡ 0.000, ΔM ≡ 0.000).
 */

import { HexCoord3D } from '../../core/spatial/HexCoord3D.js';
import { Pore } from '../../core/domain/Pore.js';
import { PoreCell } from '../../core/domain/PoreCell.js';
import { ThermodynamicLedger } from '../../core/physics/ThermodynamicLedger.js';
import { IVentTelemetry } from '../SimulationTelemetry.js';

export interface ITreadmillingEvent {
  readonly type: 'streaming' | 'apoptosis' | 'directional_cleavage';
  readonly sourceCoord: HexCoord3D;
  readonly targetCoord: HexCoord3D;
  readonly energyTransferred: number;
  readonly matterTransferred: number;
  readonly cladeId: string;
  readonly tick: number;
}

import { PoreWorkshop } from '../../core/domain/PoreWorkshop.js';
import { IPrng } from '../../core/prng/SeedablePrng.js';

export interface ICleavageSelectionContext {
  readonly parentPore: Pore;
  readonly cell: PoreCell;
  readonly candidatePores: readonly Pore[];
  readonly vent: IVentTelemetry;
  readonly occupiedPores: readonly Pore[];
  readonly prng?: IPrng;
}

export class TreadmillingEngine {
  /**
   * Evaluates candidate cleavage neighbor pores using the cell's own endogenous
   * evolved PoreWorkshop AST against local physical signals, combined with
   * Gibbs-Boltzmann thermodynamic weighting and Tomoko Ohta nearly-neutral saddle escape.
   */
  public static selectDirectionalCleavageTarget(
    ctxOrParent: ICleavageSelectionContext | Pore,
    cellArg?: PoreCell,
    candidatePoresArg?: readonly Pore[],
    ventArg?: IVentTelemetry
  ): Pore {
    let parentPore: Pore;
    let cell: PoreCell;
    let candidatePores: readonly Pore[];
    let vent: IVentTelemetry;
    let occupiedPores: readonly Pore[];
    let prng: IPrng | undefined;

    if ('candidatePores' in ctxOrParent) {
      parentPore = ctxOrParent.parentPore;
      cell = ctxOrParent.cell;
      candidatePores = ctxOrParent.candidatePores;
      vent = ctxOrParent.vent;
      occupiedPores = ctxOrParent.occupiedPores ?? [];
      prng = ctxOrParent.prng;
    } else {
      parentPore = ctxOrParent;
      cell = cellArg!;
      candidatePores = candidatePoresArg!;
      vent = ventArg!;
      occupiedPores = (arguments.length > 4 && Array.isArray(arguments[4])) ? arguments[4] : [];
      prng = (arguments.length > 5 && typeof arguments[5] === 'object') ? arguments[5] : undefined;
    }

    if (candidatePores.length === 1) return candidatePores[0];

    const plan = cell.getMorphogeneticPlan();
    const workshop = cell.getWorkshop();
    const gates = workshop.getBuiltGates();
    const hasTactileOrRedoxSensing = workshop.hasMechanoTouch() || workshop.hasElectroRedox();
    const hasCompositePredation = gates.length >= 2 &&
      hasTactileOrRedoxSensing &&
      workshop.hasAllostericRegulationCapability() &&
      workshop.hasForwardProcessingCapability();

    const cellTape = cell.getSafe().getTape();
    const ventNozzle = vent.nozzleCoord;
    const parentDistToVent = parentPore.coord.distanceTo(ventNozzle);
    const parentLocalToxin = Boolean(vent.toxinT && parentDistToVent <= 4);
    const parentConcA = vent.streamA ? Math.max(0, 1 - parentDistToVent / 6) : 0;
    const parentConcB = vent.streamB ? Math.max(0, 1 - parentDistToVent / 6) : 0;

    const scores: number[] = [];
    let bestIdx = 0;
    let bestScore = -Infinity;

    for (let i = 0; i < candidatePores.length; i++) {
      const cand = candidatePores[i];
      let score = 0;

      // Clone a fresh isolated probe workshop per candidate pore so sequential state never leaks across candidates
      const probeWorkshop = PoreWorkshop.fromBitstring(cellTape);

      const distToVent = cand.coord.distanceTo(ventNozzle);
      const localA = vent.streamA && distToVent <= 5;
      const localB = vent.streamB && distToVent <= 5;
      const localToxin = Boolean(vent.toxinT && distToVent <= 4);
      const localPhoton = distToVent <= 3 && vent.thermalFlux > 150;
      const localBaro = Boolean(vent.precursorWarning || vent.thermalFlux > 350);

      const adjacentPrey = occupiedPores.filter(p => {
        const res = p.getResident();
        return res && res.getCladeId() !== cell.getCladeId() && p.coord.distanceTo(cand.coord) === 1;
      });
      const localMechano = adjacentPrey.length > 0 || cand.getNeighbors().some(n => n.isBasalt());
      const localElectro = adjacentPrey.some(p => (p.getResident()?.getBattery().getEnergy() ?? 0) > 40);

      // Endogenous AST Probe: Evaluate the cell's actual evolved gate network in candidate micro-environment
      const probeTele = probeWorkshop.stepTick({
        streamA: localA,
        streamB: localB,
        toxinT: localToxin,
        batteryVoltage: cell.getBattery().getEnergy(),
        streamC: false,
        streamD: false,
        photonIr: localPhoton,
        baroAcoustic: localBaro,
        mechanoTouch: localMechano,
        electroRedox: localElectro
      });

      // Net endogenous free-energy expectation from the cell's own circuit
      const netFreeEnergy = probeTele.catalyticYield * 8 - probeTele.toggleCount * 2 - (probeTele.toxinIngested ? 25 : 0);
      score += netFreeEnergy;

      // Continuous physical diffusion plume concentrations
      const candConcA = vent.streamA ? Math.max(0, 1 - distToVent / 6) : 0;
      const candConcB = vent.streamB ? Math.max(0, 1 - distToVent / 6) : 0;
      const candThermal = vent.thermalFlux / (1 + distToVent);
      const parentThermal = vent.thermalFlux / (1 + parentDistToVent);

      // Local physical substrate concentration gradient detected by membrane porins
      if (probeTele.primaryActive) {
        let substrateGradient = 0;
        if (workshop.hasPorinA()) substrateGradient += (candConcA - parentConcA);
        if (workshop.hasPorinB()) substrateGradient += (candConcB - parentConcB);
        if (workshop.hasPhotonIr()) substrateGradient += (candThermal - parentThermal) / 50;
        if (!workshop.hasPorinA() && !workshop.hasPorinB() && !workshop.hasPhotonIr()) {
          substrateGradient += (candConcA + candConcB) - (parentConcA + parentConcB);
        }
        score += substrateGradient * 30;
      }

      // Allosteric toxin/thermal avoidance when counter-gradient regulation inhibits firing under stress
      if (localToxin || localBaro || vent.thermalFlux > 350) {
        if (probeWorkshop.hasAllostericRegulationCapability() && !probeTele.toxinIngested) {
          score += 10;
        } else {
          const candStress = (candThermal / 40) + (localToxin ? 3 : 0);
          const parentStress = (parentThermal / 40) + (parentLocalToxin ? 3 : 0);
          score -= (candStress - parentStress) * 18;
        }
      }

      // Trophic contact pursuit via evolved tactile/redox porins & functional circuitry
      if (hasCompositePredation && adjacentPrey.length > 0 && probeTele.primaryActive) {
        score += adjacentPrey.length * 22;
      }

      // Genetic Polarity Continuity (Align with cell's intrinsic symmetry axis)
      const pDir = plan.primaryDirection;
      const [dq, dr] = HexCoord3D.PLANAR_DIRECTIONS[pDir];
      const preferredCoord = parentPore.coord.add(dq, dr, 0);
      if (cand.coord.equals(preferredCoord)) {
        score += 8;
      }

      scores.push(score);
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }

    // Thermodynamic Gibbs-Boltzmann Soft Selection & Tomoko Ohta Saddle Escape (when PRNG supplied)
    if (prng && candidatePores.length > 1) {
      const beta = 0.25; // Inverse thermal noise temperature 1 / k_B T
      let sumWeights = 0;
      const weights: number[] = [];
      for (let i = 0; i < scores.length; i++) {
        // Shift by bestScore for numerical stability
        const w = Math.exp(beta * (scores[i] - bestScore));
        weights.push(w);
        sumWeights += w;
      }
      let r = prng.nextFloat() * sumWeights;
      for (let i = 0; i < weights.length; i++) {
        r -= weights[i];
        if (r <= 0) return candidatePores[i];
      }
    }

    return candidatePores[bestIdx];
  }

  /**
   * Executes posterior protoplasmic resorption and scheduled apoptosis for motile syncytia.
   * Trailing pores transfer their remaining battery tokens and surplus matter forward,
   * then undergo clean autolysis, vacating the pore back to empty mineral substrate.
   */
  public static executeTrailingEdgeResorption(
    colonyPores: readonly Pore[],
    vent: IVentTelemetry,
    currentTick: number,
    ledger?: ThermodynamicLedger
  ): ITreadmillingEvent[] {
    const events: ITreadmillingEvent[] = [];
    if (colonyPores.length < 4) return events; // Minimum cluster size for treadmilling slug

    // Find the leading edge (pore closest to vent or with highest catalytic activity)
    const ventNozzle = vent.nozzleCoord;
    const sortedByVentDist = colonyPores.slice().sort((a, b) => {
      return a.coord.distanceTo(ventNozzle) - b.coord.distanceTo(ventNozzle);
    });

    const leadingPore = sortedByVentDist[0];
    const trailingPore = sortedByVentDist[sortedByVentDist.length - 1];

    if (leadingPore === trailingPore) return events;

    const trailingCell = trailingPore.getResident();
    const leadingCell = leadingPore.getResident();
    if (!trailingCell || !leadingCell) return events;

    // Resorb when trailing cell has matured (age >= 20)
    if (trailingCell.getAge() < 20) return events;

    const tBattery = trailingCell.getBattery();
    const tSnap = tBattery.getSnapshot();
    const energyToTransfer = tSnap.energy;
    const matterToTransfer = tSnap.matter;

    if (energyToTransfer > 0 || matterToTransfer > 0) {
      // 1. Drain 100% of stored energy from trailing cell
      tBattery.drainEnergy(energyToTransfer);
      let remainingEnergy = energyToTransfer;

      // Distribute across forward syncytial cells via gap junctions
      for (const p of sortedByVentDist) {
        if (p === trailingPore) continue;
        const res = p.getResident();
        if (res && remainingEnergy > 0) {
          const absorbed = res.getBattery().chargeEnergy(remainingEnergy);
          remainingEnergy -= absorbed;
        }
      }

      // Any overflow that cannot fit into colony batteries is dissipated as heat under 2nd law
      if (remainingEnergy > 0 && ledger) {
        ledger.recordHeatDissipation(remainingEnergy);
      }

      // 2. Transfer 100% of structural matter tokens to leading cell
      tBattery.spendMatter(matterToTransfer);
      leadingCell.getBattery().addMatter(matterToTransfer);

      // Record streaming event
      events.push({
        type: 'streaming',
        sourceCoord: trailingPore.coord,
        targetCoord: leadingPore.coord,
        energyTransferred: energyToTransfer - remainingEnergy,
        matterTransferred: matterToTransfer,
        cladeId: trailingCell.getCladeId(),
        tick: currentTick
      });

      // 3. Trailing pore completes autolysis: vacates benthic resident cleanly while preserving any co-located pelagic spore
      trailingPore.clearResident();

      events.push({
        type: 'apoptosis',
        sourceCoord: trailingPore.coord,
        targetCoord: leadingPore.coord,
        energyTransferred: 0,
        matterTransferred: 0,
        cladeId: trailingCell.getCladeId(),
        tick: currentTick
      });
    }

    return events;
  }
}
