/**
 * 🐠 Siliquarium Paleontology Subsystem
 * AdaptiveMotifDetector: Detection routines for sensorimotor, cognitive, and higher-order metabolic motifs.
 */

import { CodonType } from '../codons/CodonTable.js';
import { MotifType, NetworkMotifRegistry } from './NetworkMotif.js';
import { IMotifMatch } from './MotifScanner.js';
import { CanonicalMotifDetector } from './CanonicalMotifDetector.js';

export class AdaptiveMotifDetector {
  public static detectTemporalDerivativeChemotaxis(
    gates: readonly { type: CodonType; id: number }[],
    tape: string = '',
    expressedPorins: ReadonlySet<CodonType> = new Set(),
    expressedOperonCount: number = 0
  ): IMotifMatch | null {
    const andCount = gates.filter(g => g.type === CodonType.GATE_AND).length;
    const orCount = gates.filter(g => g.type === CodonType.GATE_OR).length;
    const hasNot = gates.some(g => g.type === CodonType.GATE_NOT);
    const lastGate = gates[gates.length - 1];
    if (andCount >= 2 && orCount === 0 && hasNot && gates.length >= 3 && gates[0].type === CodonType.GATE_AND && lastGate.type === CodonType.GATE_AND) {
      if (tape.length > 0) {
        const hasTemporalOrGradientCoupling =
          expressedOperonCount >= 2 ||
          expressedPorins.has(CodonType.PORIN_PHOTON_IR) ||
          expressedPorins.has(CodonType.PORIN_BARO_ACOUSTIC) ||
          expressedPorins.has(CodonType.PORIN_ELECTRO_REDOX);
        if (!hasTemporalOrGradientCoupling) {
          return null;
        }
      }
      return {
        motif: NetworkMotifRegistry.getDefinition(MotifType.TEMPORAL_DERIVATIVE_CHEMOTAXIS),
        involvedGateIds: gates.map(g => g.id).slice(0, 3),
        confidence: 0.90
      };
    }
    return null;
  }

  public static detectPredictivePavlovian(
    gates: readonly { type: CodonType; id: number }[],
    tape: string = '',
    expressedPorins: ReadonlySet<CodonType> = new Set()
  ): IMotifMatch | null {
    const lastGate = gates[gates.length - 1];
    if (
      gates.length >= 3 &&
      gates[0].type === CodonType.GATE_NOT &&
      gates[1].type === CodonType.GATE_AND &&
      lastGate.type === CodonType.GATE_OR
    ) {
      if (tape.length > 0) {
        const hasPrecursorPorin =
          expressedPorins.has(CodonType.PORIN_TOXIN_T) ||
          expressedPorins.has(CodonType.PORIN_BARO_ACOUSTIC) ||
          expressedPorins.has(CodonType.PORIN_PHOTON_IR);
        if (!hasPrecursorPorin) {
          return null;
        }
      }
      return {
        motif: NetworkMotifRegistry.getDefinition(MotifType.PREDICTIVE_PAVLOVIAN),
        involvedGateIds: gates.map(g => g.id).slice(0, 3),
        confidence: 0.92
      };
    }
    return null;
  }

  public static detectEntrainedPacemaker(
    gates: readonly { type: CodonType; id: number }[],
    tape: string = '',
    expressedPorins: ReadonlySet<CodonType> = new Set()
  ): IMotifMatch | null {
    const oddRun = CanonicalMotifDetector.hasContiguousOddNotRun(gates);
    const hasCoupling = gates.some(g => g.type === CodonType.GATE_AND || g.type === CodonType.GATE_OR);
    if (oddRun && hasCoupling) {
      if (tape.length > 0) {
        const hasCarrierPorin =
          expressedPorins.has(CodonType.PORIN_PHOTON_IR) ||
          expressedPorins.has(CodonType.PORIN_BARO_ACOUSTIC) ||
          expressedPorins.has(CodonType.PORIN_ELECTRO_REDOX);
        if (!hasCarrierPorin) {
          return null;
        }
      }
      return {
        motif: NetworkMotifRegistry.getDefinition(MotifType.ENTRAINED_PACEMAKER),
        involvedGateIds: gates.map(g => g.id),
        confidence: 0.95
      };
    }
    return null;
  }

  public static detectSteinerVascularNetwork(
    gates: readonly { type: CodonType; id: number }[],
    tape: string = '',
    expressedPorins: ReadonlySet<CodonType> = new Set(),
    expressedSinks: ReadonlySet<CodonType> = new Set()
  ): IMotifMatch | null {
    const andCount = gates.filter(g => g.type === CodonType.GATE_AND).length;
    const orCount = gates.filter(g => g.type === CodonType.GATE_OR).length;
    const notCount = gates.filter(g => g.type === CodonType.GATE_NOT).length;
    if (gates.length >= 4 && andCount >= 2 && orCount >= 2 && notCount === 0 && gates[0].type !== gates[1].type) {
      if (tape.length > 0) {
        const hasVascularHardware =
          expressedPorins.has(CodonType.PORIN_ELECTRO_REDOX) ||
          expressedSinks.has(CodonType.SECRETION_EPS) ||
          expressedSinks.has(CodonType.SINK_SEPTUM);
        if (!hasVascularHardware) {
          return null;
        }
      }
      return {
        motif: NetworkMotifRegistry.getDefinition(MotifType.STEINER_VASCULAR_NETWORK),
        involvedGateIds: gates.map(g => g.id),
        confidence: 0.90
      };
    }
    return null;
  }

  public static detectCryptobioticDormancyClamp(
    gates: readonly { type: CodonType; id: number }[],
    tape: string = '',
    expressedPorins: ReadonlySet<CodonType> = new Set(),
    expressedOperonCount: number = 0
  ): IMotifMatch | null {
    const notCount = gates.filter(g => g.type === CodonType.GATE_NOT).length;
    const lastGate = gates[gates.length - 1];
    if (
      gates.length >= 3 &&
      notCount === 2 &&
      gates[0].type === CodonType.GATE_NOT &&
      gates[1].type === CodonType.GATE_NOT &&
      lastGate.type === CodonType.GATE_OR
    ) {
      if (tape.length > 0) {
        const hasStressClampCoupling =
          expressedPorins.has(CodonType.PORIN_TOXIN_T) ||
          expressedOperonCount >= 2;
        if (!hasStressClampCoupling) {
          return null;
        }
      }
      return {
        motif: NetworkMotifRegistry.getDefinition(MotifType.CRYPTOBIOTIC_DORMANCY_CLAMP),
        involvedGateIds: gates.map(g => g.id),
        confidence: 0.88
      };
    }
    return null;
  }
}
