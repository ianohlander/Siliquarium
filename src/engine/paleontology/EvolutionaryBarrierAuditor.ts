/**
 * 🐠 Siliquarium Paleontology Subsystem
 * EvolutionaryBarrierAuditor: Forensic audit engine for macro-evolutionary barriers and bottlenecks.
 */

import { SimulationWorld } from '../SimulationWorld.js';
import { ISimulationTelemetry } from '../SimulationTelemetry.js';
import { PoreState } from '../../core/domain/Pore.js';

export interface IBarrierDiagnostic {
  readonly code: string;
  readonly severity: 'CRITICAL' | 'WARNING' | 'INFO';
  readonly title: string;
  readonly description: string;
  readonly evidence: Record<string, unknown>;
  readonly recommendedRemedy: string;
}

export class EvolutionaryBarrierAuditor {
  public static auditBarriers(_world: SimulationWorld, telemetry: ISimulationTelemetry): IBarrierDiagnostic[] {
    const diagnostics: IBarrierDiagnostic[] = [];
    const occupied = telemetry.pores.filter(p => p.state === PoreState.OCCUPIED);

    // Diagnostic 1: Clade Monoculture / Coalescence without Cladogenesis
    if (telemetry.activeCladesCount <= 1 && telemetry.maxGeneration > 50) {
      diagnostics.push({
        code: 'COALESCENCE_MONOCULTURE',
        severity: 'CRITICAL',
        title: 'Complete Lineage Coalescence & Lack of Cladogenesis',
        description: 'All living cells descend from a single primordial ancestor. Because cladeId is currently inherited without cladogenesis or speciation branching, the population has permanently fixed to 1 clade with Shannon Diversity H=0.',
        evidence: {
          activeCladesCount: telemetry.activeCladesCount,
          shannonDiversity: telemetry.shannonDiversity,
          maxGeneration: telemetry.maxGeneration,
          livingPopulation: occupied.length
        },
        recommendedRemedy: 'Implement genetic-distance or network-motif speciation: when a daughter diverges by >10% hamming distance or evolves a novel operon, assign a distinct daughter clade ID.'
      });
    }

    // Diagnostic 2: Endosymbiosis Lockout due to Monoculture
    if (telemetry.activeCladesCount <= 1) {
      diagnostics.push({
        code: 'ENDOSYMBIOSIS_BLOCKED_BY_MONOCULTURE',
        severity: 'CRITICAL',
        title: 'Endosymbiosis Precondition Blockade',
        description: 'Endosymbiosis requires contact between two distinct phylogenetic clades (cellA.cladeId !== cellB.cladeId). Because the entire population shares 1 cladeId, endosymbiotic fusion cannot trigger.',
        evidence: {
          activeCladesCount: telemetry.activeCladesCount,
          endosymbiosisEventsActive: 0
        },
        recommendedRemedy: 'Allow endosymbiosis between diverged lineages or distinct syncytial colonies, not strictly primordial clades.'
      });
    }

    // Diagnostic 3: Syncytial Super-Organism Monopoly (The "Pando" Aspen Effect)
    let largestColonySize = 0;
    if (telemetry.syncytialColonies) {
      for (const col of telemetry.syncytialColonies) {
        if (col.memberCoords.length > largestColonySize) {
          largestColonySize = col.memberCoords.length;
        }
      }
    }

    const colonyOccupancyRatio = occupied.length > 0 ? (largestColonySize / occupied.length) : 0;
    if (colonyOccupancyRatio > 0.5 && largestColonySize > 30) {
      diagnostics.push({
        code: 'SYNCYTIAL_MONOPOLY',
        severity: 'WARNING',
        title: 'Syncytial Super-Organism Monopoly & Clonal Stasis',
        description: `A single colonial syncytium comprises ${largestColonySize} cells (${Math.round(colonyOccupancyRatio * 100)}% of living population). Perfect resource pooling across the syncytium eliminates localized starvation pressures, insulating maladapted peripheral pores from natural selection.`,
        evidence: {
          largestColonySize,
          colonyOccupancyRatio: Math.round(colonyOccupancyRatio * 100) / 100,
          totalLivingCells: occupied.length
        },
        recommendedRemedy: 'Introduce cytoplasmic transport distance friction or colony fission/fragmentation limits (e.g. maximum colony radius or physical sheer).'
      });
    }

    // Diagnostic 4: Landauer Complexity Razor & Thermodynamic Plateaus
    const meanGates = occupied.length > 0
      ? occupied.reduce((sum, p) => sum + p.gateCount, 0) / occupied.length
      : 0;

    diagnostics.push({
      code: 'LANDAUER_COMPLEXITY_RAZOR',
      severity: 'INFO',
      title: 'Landauer Friction Against Non-Essential Logic Gates',
      description: 'Catalytic energy yield (+2 tokens) is constant whether a circuit has 2 gates or 20 gates. However, each gate toggle incurs a Landauer switching dissipation cost. Natural selection ruthlessly penalizes redundant gates, favoring minimal circuits unless higher complexity unlocks new metabolic niches.',
      evidence: {
        meanGateCount: Math.round(meanGates * 10) / 10,
        catalyticYieldPerReaction: 2,
        landauerToggleCostFormula: 'E_burned = toggleCount'
      },
      recommendedRemedy: 'Provide tiered catalytic yields for higher-order logic operations (e.g., +4 for XOR discrimination, +6 for oscillatory pulses, +8 for multi-pore distributed processing).'
    });

    // Diagnostic 5: Single-Pore Circuit Locality (Lack of Multi-Pore Logic Conduits)
    diagnostics.push({
      code: 'SINGLE_PORE_CIRCUIT_ISOLATION',
      severity: 'INFO',
      title: 'Circuits Constrained to Single-Pore Netlists',
      description: 'While syncytial bridges successfully pool thermodynamic energy and matter tokens across pores, Boolean logic pin signals are evaluated strictly within each individual pore workshop. Circuits that take up multiple pores (distributed neural/logic lattices) require inter-pore pin conduits.',
      evidence: {
        interPoreLogicPinsSupported: false,
        thermodynamicConduitsActive: true
      },
      recommendedRemedy: 'Enable syncytial bridges to transmit Boolean output states across pore boundaries into neighboring workshop input porins.'
    });

    return diagnostics;
  }
}
