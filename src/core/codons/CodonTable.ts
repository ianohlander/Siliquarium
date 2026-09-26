/**
 * 🐠 Siliquarium Codon Subsystem
 * 64-Entry Degenerate Codon Table grounded in prebiotic biophysics.
 * Enforces Howard Pattee's Epistemic Cut and the Zero-Smuggling Mandate.
 */

export enum CodonType {
  // Catalytic Primitives
  GATE_AND = 'GATE_AND',
  GATE_OR = 'GATE_OR',
  GATE_NOT = 'GATE_NOT',
  GATE_XOR = 'GATE_XOR',
  GATE_NAND = 'GATE_NAND',
  GATE_NOR = 'GATE_NOR',
  GATE_BUF = 'GATE_BUF',

  // Membrane Porins
  PORIN_STREAM_A = 'PORIN_STREAM_A',
  PORIN_STREAM_B = 'PORIN_STREAM_B',
  PORIN_TOXIN_T = 'PORIN_TOXIN_T',

  // Energy & Structural Sinks
  SINK_BATTERY = 'SINK_BATTERY',
  SINK_SEPTUM = 'SINK_SEPTUM',

  // Non-Coding Introns & Regulatory Boundaries
  INTRON_SILENT = 'INTRON_SILENT',
  REGULATORY_OPERATOR = 'REGULATORY_OPERATOR'
}

export interface ICodonDefinition {
  readonly index: number;
  readonly type: CodonType;
  readonly bitPattern: string;
  readonly label: string;
  readonly description: string;
}

function createCodonEntry(index: number, type: CodonType, label: string, desc: string): ICodonDefinition {
  const bitPattern = index.toString(2).padStart(6, '0');
  return {
    index,
    type,
    bitPattern,
    label,
    description: desc
  };
}

// 64-entry degenerate table: maps 6-bit codes (0-63) to biophysical primitives
// Degeneracy mirrors biological codons to provide neutral mutational buffers (Kimura neutral drift)
const CODON_ENTRIES: readonly ICodonDefinition[] = Object.freeze(
  Array.from({ length: 64 }, (_, i) => {
    // 0..11: Catalytic AND (Co-substrate catalyst) - 12 codons
    if (i < 12) {
      return createCodonEntry(i, CodonType.GATE_AND, 'AND', 'Co-substrate redox catalytic site');
    }
    // 12..21: Catalytic NOT (Allosteric inhibitor) - 10 codons
    if (i < 22) {
      return createCodonEntry(i, CodonType.GATE_NOT, 'NOT', 'Allosteric competitive inhibitor');
    }
    // 22..31: Catalytic OR (Dietary generalist) - 10 codons
    if (i < 32) {
      return createCodonEntry(i, CodonType.GATE_OR, 'OR', 'Dual-affinity promiscuous enzyme');
    }
    // 32..37: Fuel Channel Stream A - 6 codons
    if (i < 38) {
      return createCodonEntry(i, CodonType.PORIN_STREAM_A, 'STREAM_A', 'Hydrothermal proton fuel porin channel');
    }
    // 38..43: Oxidizer Channel Stream B - 6 codons
    if (i < 44) {
      return createCodonEntry(i, CodonType.PORIN_STREAM_B, 'STREAM_B', 'Alkaline oxidizer porin channel');
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
    // 56..61: Non-coding silent introns (Kimura buffers) - 6 codons
    if (i < 62) {
      return createCodonEntry(i, CodonType.INTRON_SILENT, 'SILENT', 'Non-coding neutral intron mutational buffer');
    }
    // 62..63: Regulatory operator boundary - 2 codons
    return createCodonEntry(i, CodonType.REGULATORY_OPERATOR, 'OPERATOR', 'Catalytic domain boundary delimiter');
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
