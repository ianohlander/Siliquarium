/**
 * 🐠 Siliquarium Analysis Subsystem
 * CircuitAdvantageAnalyzer: Derives the biological, thermodynamic, and ecological advantage
 * of any given PoreWorkshop netlist across environmental regimes.
 */

import { PoreWorkshop } from '../domain/PoreWorkshop.js';
import { CodonType } from '../codons/CodonTable.js';

export interface ITruthTableRow {
  readonly stateName: string;
  readonly inputs: { a: boolean; b: boolean; toxin: boolean };
  readonly outputActive: boolean;
  readonly landauerToggles: number;
  readonly notes: string;
}

export interface ICircuitAdvantageReport {
  readonly archetype: string;
  readonly title: string;
  readonly advantageSummary: string;
  readonly evolutionaryNiche: string;
  readonly catalyticYieldScore: number;    // 0..100
  readonly landauerEfficiencyScore: number;// 0..100
  readonly toxinImmunityScore: number;     // 0..100
  readonly overallFitnessIndex: number;    // 0..100
  readonly truthTable: readonly ITruthTableRow[];
}

export class CircuitAdvantageAnalyzer {
  public static analyze(workshop: PoreWorkshop): ICircuitAdvantageReport {
    const gates = workshop.getBuiltGates();
    if (gates.length === 0) {
      return this.emptyReport();
    }

    // Clone gate states for virtual probe simulation
    const probeStates = [
      { name: 'Famine (A=0, B=0)', a: false, b: false, toxin: false, desc: 'Base resting state. Idle battery preservation.' },
      { name: 'Stream A Surge (A=1, B=0)', a: true, b: false, toxin: false, desc: 'Sulfide-rich hydrothermal upwelling.' },
      { name: 'Stream B Surge (A=0, B=1)', a: false, b: true, toxin: false, desc: 'Alkaline fuel pulse without electron donor.' },
      { name: 'Co-Catalytic Peak (A=1, B=1)', a: true, b: true, toxin: false, desc: 'Optimal Mitchell-Russell PMF redox meeting.' },
      { name: 'Acid Shock (Toxin=1)', a: false, b: false, toxin: true, desc: 'Volcanic sulfuric acid pulse.' },
      { name: 'Fuel + Acid Mixed (A=1, B=1, T=1)', a: true, b: true, toxin: true, desc: 'High fuel contaminated with heavy metal toxins.' }
    ];

    const truthTable: ITruthTableRow[] = [];
    const virtualWorkshop = PoreWorkshop.fromBitstring(workshop.toBitstring());

    let coCatalyticYield = false;
    let singleStreamAActive = false;
    let singleStreamBActive = false;
    let toxinProtected = false;
    let totalToggles = 0;

    for (const probe of probeStates) {
      const res = virtualWorkshop.step(probe.a, probe.b, probe.toxin);
      totalToggles += res.toggleCount;

      truthTable.push({
        stateName: probe.name,
        inputs: { a: probe.a, b: probe.b, toxin: probe.toxin },
        outputActive: res.primaryOutput,
        landauerToggles: res.toggleCount,
        notes: probe.desc
      });

      if (probe.a && probe.b && !probe.toxin) {
        coCatalyticYield = res.primaryOutput;
      }
      if (probe.a && !probe.b && !probe.toxin && res.primaryOutput) {
        singleStreamAActive = true;
      }
      if (!probe.a && probe.b && !probe.toxin && res.primaryOutput) {
        singleStreamBActive = true;
      }
      if (probe.a && probe.b && probe.toxin) {
        toxinProtected = coCatalyticYield && !res.primaryOutput;
      }
    }

    // Determine Archetype and Plain-English Advantage
    let archetype = 'GENERALIST_AUTOTROPH';
    let title = 'Metabolic Generalist';
    let advantageSummary = 'Maintains balanced catalytic coupling across standard hydrothermal waveforms.';
    let evolutionaryNiche = 'Ubiquitous Benthic Colonizer';
    let yieldScore = 65;
    let landauerScore = Math.max(20, Math.min(100, 100 - totalToggles * 6));
    let toxinScore = toxinProtected ? 85 : 30;

    const hasNOT = gates.some(g => g.type === CodonType.GATE_NOT);
    const hasAND = gates.some(g => g.type === CodonType.GATE_AND);
    const hasOR  = gates.some(g => g.type === CodonType.GATE_OR);
    const hasCompositeXor = (hasAND && hasOR && hasNOT) || ((singleStreamAActive !== singleStreamBActive) && !coCatalyticYield);

    if ((coCatalyticYield || hasAND) && !singleStreamAActive && !singleStreamBActive) {
      if (hasNOT && toxinProtected) {
        archetype = 'TOXIN_GATED_CO_CATALYST';
        title = 'Allosteric Shielded Co-Catalyst';
        advantageSummary = 'Thrives in volatile volcanic zones by using a NOT gate as an allosteric brake. It harvests high-yield catalytic energy (+3 tokens) strictly when fuel streams A and B collide, but instantly decouples during acid bursts (T=1), saving 100% of its Landauer reserves while unshielded competitors suffer lethal burnout.';
        evolutionaryNiche = 'Hydrothermal Vent Orifice Specialist';
        yieldScore = 95;
        toxinScore = 98;
      } else {
        archetype = 'CO_CATALYTIC_SPECIALIST';
        title = 'High-Affinity Co-Catalytic Specialist';
        advantageSummary = 'Implements strict dual-substrate logic. It fires strictly when Stream A and Stream B bind simultaneously, unlocking maximum ATP-equivalent yield (+3 tokens) while idling silently during single-substrate pulses to eliminate futile Landauer switching waste.';
        evolutionaryNiche = 'Caldera Chimney Rim Specialist';
        yieldScore = 90;
        toxinScore = 60;
      }
    } else if (hasCompositeXor && (singleStreamAActive || singleStreamBActive)) {
      archetype = 'PARITY_DISCRIMINATOR';
      title = 'Asymmetric Gradient Discriminator';
      advantageSummary = 'Uses evolved composite AND/OR/NOT parity logic to harvest energy exclusively when chemical gradients are sharply imbalanced (A != B). This allows it to exploit the convective boundary layer at the outer edges of the vent plume where single-stream turbulence dominates.';
      evolutionaryNiche = 'Turbulent Boundary Layer Niche';
      yieldScore = 75;
      toxinScore = 55;
    } else if (hasOR && (singleStreamAActive && singleStreamBActive)) {
      archetype = 'OPPORTUNISTIC_SCAVENGER';
      title = 'Promiscuous Isozyme Generalist';
      advantageSummary = 'Employs permissive OR logic to capture energy from either Stream A OR Stream B independently. While its per-reaction yield is lower (+1.5 tokens), it survives in marginal abyssal zones far from the vent where dual-stream collisions are exceedingly rare.';
      evolutionaryNiche = 'Abyssal Margin & Deep Periphery';
      yieldScore = 70;
      toxinScore = 45;
    } else if (totalToggles <= 2) {
      archetype = 'LANDAUER_MISER';
      title = 'Ultra-Low Landauer Dissipation Miser';
      advantageSummary = 'Exhibits extreme thermodynamic hysteresis. Its gates rarely switch state, losing less than 2 tokens to Landauer erasure per diurnal cycle. This enables it to survive extended multi-generation famines through basalt crevice dormancy.';
      evolutionaryNiche = 'Deep Basalt Crevice / Starvation Refuge';
      yieldScore = 50;
      landauerScore = 98;
      toxinScore = 70;
    }

    const overallFitness = Math.round((yieldScore * 0.45) + (landauerScore * 0.35) + (toxinScore * 0.20));

    return {
      archetype,
      title,
      advantageSummary,
      evolutionaryNiche,
      catalyticYieldScore: yieldScore,
      landauerEfficiencyScore: landauerScore,
      toxinImmunityScore: toxinScore,
      overallFitnessIndex: overallFitness,
      truthTable
    };
  }

  private static emptyReport(): ICircuitAdvantageReport {
    return {
      archetype: 'PROTO_METABOLIC_DIFFUSION',
      title: 'Proto-Metabolic Diffusion Matrix',
      advantageSummary: 'Primitive, ungated proto-organism relying purely on passive chemical diffusion across mineral pores. Lacks active enzymatic switching.',
      evolutionaryNiche: 'Prebiotic Mineral Cavity',
      catalyticYieldScore: 20,
      landauerEfficiencyScore: 90,
      toxinImmunityScore: 10,
      overallFitnessIndex: 40,
      truthTable: []
    };
  }
}
