/**
 * 🐠 Siliquarium Codon Subsystem
 * 64-Entry Degenerate Codon Table grounded in prebiotic biophysics.
 * Enforces Howard Pattee's Epistemic Cut and the Zero-Smuggling Mandate.
 */

export enum CodonType {
  // Catalytic Primitives (Strictly only AND, OR, NOT — all higher gates must be evolved)
  GATE_AND = 'GATE_AND',
  GATE_OR = 'GATE_OR',
  GATE_NOT = 'GATE_NOT',

  // Membrane Porins
  PORIN_STREAM_A = 'PORIN_STREAM_A',
  PORIN_STREAM_B = 'PORIN_STREAM_B',
  PORIN_STREAM_C = 'PORIN_STREAM_C',
  PORIN_STREAM_D = 'PORIN_STREAM_D',
  PORIN_TOXIN_T = 'PORIN_TOXIN_T',

  // Zero-Smuggling Physical Sensory Porins
  PORIN_PHOTON_IR = 'PORIN_PHOTON_IR',
  PORIN_BARO_ACOUSTIC = 'PORIN_BARO_ACOUSTIC',
  PORIN_MECHANO_TOUCH = 'PORIN_MECHANO_TOUCH',
  PORIN_ELECTRO_REDOX = 'PORIN_ELECTRO_REDOX',

  // Secretions & Public Goods
  SECRETION_CHELATOR = 'SECRETION_CHELATOR',
  SECRETION_EPS = 'SECRETION_EPS',

  // Energy & Structural Sinks
  SINK_BATTERY = 'SINK_BATTERY',
  SINK_SEPTUM = 'SINK_SEPTUM',

  // Non-Coding Introns & Regulatory Boundaries
  INTRON_SILENT = 'INTRON_SILENT',
  REGULATORY_OPERATOR = 'REGULATORY_OPERATOR'
}

export enum OperatorCondition {
  CONSTITUTIVE = 'CONSTITUTIVE',
  REGULATED_CH0 = 'REGULATED_CH0',
  REGULATED_CH1 = 'REGULATED_CH1',
  REGULATED_CH2 = 'REGULATED_CH2',
  REGULATED_CH3 = 'REGULATED_CH3',

  // Backward compatibility aliases for legacy references:
  INDUCIBLE_STREAM_A = 'REGULATED_CH0',
  INDUCIBLE_TOXIN = 'REGULATED_CH2',
  REPRESSIBLE_METABOLITE = 'REGULATED_CH1',
  STARVATION_CATABOLITE = 'REGULATED_CH3'
}

export interface ICodonDefinition {
  readonly index: number;
  readonly type: CodonType;
  readonly bitPattern: string;
  readonly label: string;
  readonly description: string;
  readonly operatorCondition?: OperatorCondition;
  readonly operatorTarget?: number;
}

export interface ICodonMeta {
  readonly desc: string;
  readonly condition?: OperatorCondition;
  readonly target?: number;
}

function createCodonEntry(
  index: number,
  type: CodonType,
  label: string,
  descOrMeta: string | ICodonMeta
): ICodonDefinition {
  const bitPattern = index.toString(2).padStart(6, '0');
  const desc = typeof descOrMeta === 'string' ? descOrMeta : descOrMeta.desc;
  const condition = typeof descOrMeta === 'string' ? undefined : descOrMeta.condition;
  const target = typeof descOrMeta === 'string' ? undefined : descOrMeta.target;
  return {
    index,
    type,
    bitPattern,
    label,
    description: desc,
    operatorCondition: condition,
    operatorTarget: target
  };
}

// 64-entry degenerate table: maps 6-bit codes (0-63) to biophysical primitives
// Degeneracy mirrors biological codons to provide neutral mutational buffers (Kimura neutral drift)
const CODON_ENTRIES: readonly ICodonDefinition[] = Object.freeze(
  Array.from({ length: 64 }, (_, i) => {
    // 0..5: Catalytic AND (Co-substrate catalyst) - 6 codons
    if (i < 6) {
      return createCodonEntry(i, CodonType.GATE_AND, 'AND', 'Co-substrate redox catalytic site');
    }
    // 6..7: Photon IR (Thermal infrared / hydrothermal photon porin channel) - 2 codons
    if (i < 8) {
      return createCodonEntry(i, CodonType.PORIN_PHOTON_IR, 'PHOTON_IR', 'Thermal infrared & hydrothermal blackbody radiation porin channel');
    }
    // 8..11: Fuel Channel Stream C (Refractory Substrate C / Cit+ analog) - 4 codons
    if (i < 12) {
      return createCodonEntry(i, CodonType.PORIN_STREAM_C, 'STREAM_C', 'Refractory Substrate C (pyrophosphate/methane) porin channel');
    }
    // 12..15: Catalytic NOT (Allosteric inhibitor) - 4 codons
    if (i < 16) {
      return createCodonEntry(i, CodonType.GATE_NOT, 'NOT', 'Allosteric competitive inhibitor');
    }
    // 16..17: Baro/Acoustic (Acoustic & seismic pressure shock porin channel) - 2 codons
    if (i < 18) {
      return createCodonEntry(i, CodonType.PORIN_BARO_ACOUSTIC, 'BARO_ACOUSTIC', 'Acoustic cavitation & seismic pressure wave porin channel');
    }
    // 18..21: Siderophore mineral chelator secretion (Public good) - 4 codons
    if (i < 22) {
      return createCodonEntry(i, CodonType.SECRETION_CHELATOR, 'CHELATOR', 'Siderophore mineral chelator secretion channel');
    }
    // 22..25: Catalytic OR (Dietary generalist) - 4 codons
    if (i < 26) {
      return createCodonEntry(i, CodonType.GATE_OR, 'OR', 'Dual-affinity promiscuous enzyme');
    }
    // 26..27: Mechano/Touch (Mechanical normal force / boundary resistance porin channel) - 2 codons
    if (i < 28) {
      return createCodonEntry(i, CodonType.PORIN_MECHANO_TOUCH, 'MECHANO_TOUCH', 'Mechanical normal force & boundary surface resistance porin channel');
    }
    // 28..31: Extracellular Polymeric Substance (EPS biofilm) secretion - 4 codons
    if (i < 32) {
      return createCodonEntry(i, CodonType.SECRETION_EPS, 'EPS', 'Viscoelastic extracellular polymeric substance (EPS) secretion channel');
    }
    // 32..35: Fuel Channel Stream A (Hydrothermal proton fuel) - 4 codons
    if (i < 36) {
      return createCodonEntry(i, CodonType.PORIN_STREAM_A, 'STREAM_A', 'Hydrothermal proton fuel porin channel');
    }
    // 36..37: Electro/Redox (Bioelectric & redox dipole potential porin channel) - 2 codons
    if (i < 38) {
      return createCodonEntry(i, CodonType.PORIN_ELECTRO_REDOX, 'ELECTRO_REDOX', 'Bioelectric dipole & ambient redox potential porin channel');
    }
    // 38..41: Oxidizer Channel Stream B (Alkaline oxidizer) - 4 codons
    if (i < 42) {
      return createCodonEntry(i, CodonType.PORIN_STREAM_B, 'STREAM_B', 'Alkaline oxidizer porin channel');
    }
    // 42..43: Nutrient Channel Stream D (Ammonia / nitrogen catalyst) - 2 codons
    if (i < 44) {
      return createCodonEntry(i, CodonType.PORIN_STREAM_D, 'STREAM_D', 'Ammonia & nitrogen donor catalytic porin channel');
    }
    // 44..47: Toxin Channel Stream T - 4 codons
    if (i < 48) {
      return createCodonEntry(i, CodonType.PORIN_TOXIN_T, 'TOXIN_T', 'Heavy-metal acidic toxin porin channel');
    }
    // 48..51: Battery translocator - 4 codons
    if (i < 52) {
      return createCodonEntry(i, CodonType.SINK_BATTERY, 'BATTERY', 'Rotary charge translocator into mineral battery');
    }
    // 52..55: Division septum trigger - 4 codons
    if (i < 56) {
      return createCodonEntry(i, CodonType.SINK_SEPTUM, 'SEPTUM', 'FtsZ contractile ring cleavage furrow trigger');
    }
    // 56..59: Non-coding silent introns (Kimura buffers) - 4 codons
    if (i < 60) {
      return createCodonEntry(i, CodonType.INTRON_SILENT, 'SILENT', 'Non-coding neutral intron mutational buffer');
    }
    // 60..63: Regulatory operator boundaries & sequence affinity sites - 4 codons
    // Non-teleological: binds regulatory channel M_k (k = index & 3) without pre-baked biological semantics
    const channel = i & 3;
    const conditionMap = [
      OperatorCondition.REGULATED_CH0,
      OperatorCondition.REGULATED_CH1,
      OperatorCondition.REGULATED_CH2,
      OperatorCondition.REGULATED_CH3
    ];
    return createCodonEntry(
      i,
      CodonType.REGULATORY_OPERATOR,
      `OP_REG${channel}`,
      {
        desc: `Sequence-affinity regulatory operator (Binds transcription factor channel M_${channel})`,
        condition: conditionMap[channel],
        target: channel
      }
    );
  })
);

export class CodonTable {
  public static getEntry(index: number): ICodonDefinition {
    const safeIndex = (index >>> 0) & 0x3f;
    return CODON_ENTRIES[safeIndex];
  }

  public static getEntryByBits(sixBitString: string): ICodonDefinition {
    const cleaned = sixBitString.replace(/[^01]/g, '').padEnd(6, '0').slice(0, 6);
    const index = parseInt(cleaned, 2) || 0;
    return CodonTable.getEntry(index);
  }

  public static getAllEntries(): readonly ICodonDefinition[] {
    return CODON_ENTRIES;
  }
}
