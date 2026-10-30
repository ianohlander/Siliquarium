/**
 * 🐠 Siliquarium Codon Subsystem
 * Translates 1D inert genome tape (60 bits) into structured catalytic and porin tokens.
 * Enforces pure functional translation with zero runtime side-effects.
 */

import { CodonTable, ICodonDefinition, CodonType, OperatorCondition } from './CodonTable.js';

export interface IGeneInstruction {
  readonly codonIndex: number;
  readonly definition: ICodonDefinition;
  readonly slot: number;
}

export interface IOperon {
  readonly id: number;
  readonly name: string;
  readonly operatorCodon: IGeneInstruction | null;
  readonly targetChannel: number | null;
  readonly condition: OperatorCondition;
  readonly instructions: readonly IGeneInstruction[];
  readonly catalyticGates: readonly IGeneInstruction[];
  readonly inputPorins: readonly IGeneInstruction[];
  readonly sinkNodes: readonly IGeneInstruction[];
  readonly silentIntrons: readonly IGeneInstruction[];
}

export interface ITranslationResult {
  readonly rawTape: string;
  readonly instructions: readonly IGeneInstruction[];
  readonly catalyticGates: readonly IGeneInstruction[];
  readonly inputPorins: readonly IGeneInstruction[];
  readonly sinkNodes: readonly IGeneInstruction[];
  readonly silentIntrons: readonly IGeneInstruction[];
  readonly operons: readonly IOperon[];
}

export interface ICodonBucketLists {
  readonly catalytic: IGeneInstruction[];
  readonly porins: IGeneInstruction[];
  readonly sinks: IGeneInstruction[];
  readonly introns: IGeneInstruction[];
}

export class CodonTranslator {
  public static readonly DEFAULT_GENOME_LENGTH_BITS = 60;
  public static readonly GENOME_LENGTH_BITS = 60; // Default baseline for backwards compatibility
  public static readonly BITS_PER_CODON = 6;
  public static readonly DEFAULT_CODON_COUNT = 10;
  public static readonly CODON_COUNT = 10; // Default baseline for backwards compatibility
  public static readonly MIN_BITS = 36;
  public static readonly SAFETY_MAX_BITS = 3072; // Software memory safety ceiling (512 codons)
  public static readonly MAX_BITS = 3072; // Backward-compatible alias for software safety ceiling

  public static translateTape(bitstring: string): ITranslationResult {
    const sanitized = CodonTranslator.sanitizeTape(bitstring);
    const instructions: IGeneInstruction[] = [];
    const catalyticGates: IGeneInstruction[] = [];
    const inputPorins: IGeneInstruction[] = [];
    const sinkNodes: IGeneInstruction[] = [];
    const silentIntrons: IGeneInstruction[] = [];
    const operons: IOperon[] = [];

    const codonCount = Math.floor(sanitized.length / CodonTranslator.BITS_PER_CODON);

    let curCondition: OperatorCondition = OperatorCondition.CONSTITUTIVE;
    let curTargetChannel: number | null = null;
    let curOperator: IGeneInstruction | null = null;
    let curInstructions: IGeneInstruction[] = [];
    let curGates: IGeneInstruction[] = [];
    let curPorins: IGeneInstruction[] = [];
    let curSinks: IGeneInstruction[] = [];
    let curIntrons: IGeneInstruction[] = [];

    const flushCurrentOperon = () => {
      if (curInstructions.length === 0) return;
      let operonName = 'Constitutive Core';
      if (curOperator !== null) {
        const ch = curTargetChannel ?? (curOperator.codonIndex & 3);
        operonName = `Regulated Operon (Channel M_${ch})`;
      }

      operons.push({
        id: operons.length,
        name: operonName,
        operatorCodon: curOperator,
        targetChannel: curTargetChannel,
        condition: curCondition,
        instructions: Object.freeze([...curInstructions]),
        catalyticGates: Object.freeze([...curGates]),
        inputPorins: Object.freeze([...curPorins]),
        sinkNodes: Object.freeze([...curSinks]),
        silentIntrons: Object.freeze([...curIntrons])
      });
    };

    for (let slot = 0; slot < codonCount; slot++) {
      const start = slot * CodonTranslator.BITS_PER_CODON;
      const codonBits = sanitized.slice(start, start + CodonTranslator.BITS_PER_CODON);
      const definition = CodonTable.getEntryByBits(codonBits);
      const instruction: IGeneInstruction = {
        codonIndex: definition.index,
        definition,
        slot
      };

      instructions.push(instruction);
      CodonTranslator.categorizeInstruction(instruction, {
        catalytic: catalyticGates,
        porins: inputPorins,
        sinks: sinkNodes,
        introns: silentIntrons
      });

      // Operon boundary detection
      if (definition.type === CodonType.REGULATORY_OPERATOR) {
        flushCurrentOperon();
        curCondition = definition.operatorCondition ?? OperatorCondition.CONSTITUTIVE;
        curTargetChannel = definition.operatorTarget ?? (definition.index & 3);
        curOperator = instruction;
        curInstructions = [instruction];
        curGates = [];
        curPorins = [];
        curSinks = [];
        curIntrons = [];
      } else {
        curInstructions.push(instruction);
        CodonTranslator.categorizeInstruction(instruction, {
          catalytic: curGates,
          porins: curPorins,
          sinks: curSinks,
          introns: curIntrons
        });
      }
    }

    flushCurrentOperon();

    return {
      rawTape: sanitized,
      instructions: Object.freeze(instructions),
      catalyticGates: Object.freeze(catalyticGates),
      inputPorins: Object.freeze(inputPorins),
      sinkNodes: Object.freeze(sinkNodes),
      silentIntrons: Object.freeze(silentIntrons),
      operons: Object.freeze(operons)
    };
  }

  private static sanitizeTape(raw: string): string {
    let binaryOnly = raw.replace(/[^01]/g, '');
    const rem = binaryOnly.length % CodonTranslator.BITS_PER_CODON;
    if (rem !== 0) {
      binaryOnly = binaryOnly.slice(0, binaryOnly.length - rem);
    }
    while (binaryOnly.length < CodonTranslator.MIN_BITS) {
      binaryOnly += '111000'; // Codon 56 = INTRON_SILENT (never inject GATE_AND '000000')
    }
    if (binaryOnly.length > CodonTranslator.SAFETY_MAX_BITS) {
      binaryOnly = binaryOnly.slice(0, CodonTranslator.SAFETY_MAX_BITS);
    }
    return binaryOnly;
  }

  private static categorizeInstruction(
    inst: IGeneInstruction,
    buckets: ICodonBucketLists
  ): void {
    const type = inst.definition.type;
    if (type === CodonType.GATE_AND || type === CodonType.GATE_OR || type === CodonType.GATE_NOT) {
      buckets.catalytic.push(inst);
    } else if (
      type === CodonType.PORIN_STREAM_A ||
      type === CodonType.PORIN_STREAM_B ||
      type === CodonType.PORIN_STREAM_C ||
      type === CodonType.PORIN_STREAM_D ||
      type === CodonType.PORIN_TOXIN_T ||
      type === CodonType.PORIN_PHOTON_IR ||
      type === CodonType.PORIN_BARO_ACOUSTIC ||
      type === CodonType.PORIN_MECHANO_TOUCH ||
      type === CodonType.PORIN_ELECTRO_REDOX
    ) {
      buckets.porins.push(inst);
    } else if (type === CodonType.SINK_BATTERY || type === CodonType.SINK_SEPTUM || type === CodonType.SECRETION_CHELATOR || type === CodonType.SECRETION_EPS) {
      buckets.sinks.push(inst);
    } else {
      buckets.introns.push(inst);
    }
  }
}
