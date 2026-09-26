/**
 * 🐠 Siliquarium Codon Subsystem
 * Translates 1D inert genome tape (60 bits) into structured catalytic and porin tokens.
 * Enforces pure functional translation with zero runtime side-effects.
 */

import { CodonTable, ICodonDefinition, CodonType } from './CodonTable.js';

export interface IGeneInstruction {
  readonly codonIndex: number;
  readonly definition: ICodonDefinition;
  readonly slot: number;
}

export interface ITranslationResult {
  readonly rawTape: string;
  readonly instructions: readonly IGeneInstruction[];
  readonly catalyticGates: readonly IGeneInstruction[];
  readonly inputPorins: readonly IGeneInstruction[];
  readonly sinkNodes: readonly IGeneInstruction[];
  readonly silentIntrons: readonly IGeneInstruction[];
}

export class CodonTranslator {
  public static readonly GENOME_LENGTH_BITS = 60;
  public static readonly BITS_PER_CODON = 6;
  public static readonly CODON_COUNT = 10;

  public static translateTape(bitstring: string): ITranslationResult {
    const sanitized = CodonTranslator.sanitizeTape(bitstring);
    const instructions: IGeneInstruction[] = [];
    const catalyticGates: IGeneInstruction[] = [];
    const inputPorins: IGeneInstruction[] = [];
    const sinkNodes: IGeneInstruction[] = [];
    const silentIntrons: IGeneInstruction[] = [];

    for (let slot = 0; slot < CodonTranslator.CODON_COUNT; slot++) {
      const start = slot * CodonTranslator.BITS_PER_CODON;
      const codonBits = sanitized.slice(start, start + CodonTranslator.BITS_PER_CODON);
      const definition = CodonTable.getEntryByBits(codonBits);
      const instruction: IGeneInstruction = {
        codonIndex: definition.index,
        definition,
        slot
      };

      instructions.push(instruction);
      CodonTranslator.categorizeInstruction(
        instruction,
        catalyticGates,
        inputPorins,
        sinkNodes,
        silentIntrons
      );
    }

    return {
      rawTape: sanitized,
      instructions: Object.freeze(instructions),
      catalyticGates: Object.freeze(catalyticGates),
      inputPorins: Object.freeze(inputPorins),
      sinkNodes: Object.freeze(sinkNodes),
      silentIntrons: Object.freeze(silentIntrons)
    };
  }

  private static sanitizeTape(raw: string): string {
    const binaryOnly = raw.replace(/[^01]/g, '');
    if (binaryOnly.length >= CodonTranslator.GENOME_LENGTH_BITS) {
      return binaryOnly.slice(0, CodonTranslator.GENOME_LENGTH_BITS);
    }
    return binaryOnly.padEnd(CodonTranslator.GENOME_LENGTH_BITS, '0');
  }

  private static categorizeInstruction(
    inst: IGeneInstruction,
    catalytic: IGeneInstruction[],
    porins: IGeneInstruction[],
    sinks: IGeneInstruction[],
    introns: IGeneInstruction[]
  ): void {
    const type = inst.definition.type;
    if (type === CodonType.GATE_AND || type === CodonType.GATE_OR || type === CodonType.GATE_NOT) {
      catalytic.push(inst);
    } else if (type === CodonType.PORIN_STREAM_A || type === CodonType.PORIN_STREAM_B || type === CodonType.PORIN_TOXIN_T) {
      porins.push(inst);
    } else if (type === CodonType.SINK_BATTERY || type === CodonType.SINK_SEPTUM) {
      sinks.push(inst);
    } else {
      introns.push(inst);
    }
  }
}
