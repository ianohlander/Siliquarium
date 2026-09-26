/**
 * 🐠 Siliquarium Domain Subsystem
 * PoreWorkshop: The 2D Active Logic Phenotype Entity.
 * Evaluates combinational & sequential gate netlists, Landauer switching costs, and border pins.
 */

import { CodonType } from '../codons/CodonTable.js';
import { ITranslationResult } from '../codons/CodonTranslator.js';

export interface IGateNode {
  readonly id: number;
  readonly type: CodonType;
  inputA: boolean;
  inputB: boolean;
  output: boolean;
  lastOutput: boolean;
}

export interface IWorkshopTelemetry {
  readonly catalyticYield: number;
  readonly toggleCount: number;
  readonly toxinIngested: boolean;
  readonly septumTriggered: boolean;
}

export class PoreWorkshop {
  public static readonly MAX_GATES = 16;
  public static readonly CATALYTIC_ENERGY_YIELD = 2; // +2 tokens per (A AND B) reaction
  public static readonly TOXIN_CORROSION_PENALTY = 5; // -5 tokens per unshielded toxin burst

  private readonly gates: IGateNode[] = [];
  private hasBatterySink: boolean = false;
  private hasSeptumSink: boolean = false;
  private hasStreamAPorin: boolean = false;
  private hasStreamBPorin: boolean = false;
  private hasToxinPorin: boolean = false;

  constructor(translation?: ITranslationResult) {
    if (translation) {
      this.assembleFromTranslation(translation);
    }
  }

  public assembleFromTranslation(trans: ITranslationResult): void {
    this.gates.length = 0;
    this.hasStreamAPorin = trans.inputPorins.some(p => p.definition.type === CodonType.PORIN_STREAM_A);
    this.hasStreamBPorin = trans.inputPorins.some(p => p.definition.type === CodonType.PORIN_STREAM_B);
    this.hasToxinPorin = trans.inputPorins.some(p => p.definition.type === CodonType.PORIN_TOXIN_T);
    this.hasBatterySink = trans.sinkNodes.some(s => s.definition.type === CodonType.SINK_BATTERY);
    this.hasSeptumSink = trans.sinkNodes.some(s => s.definition.type === CodonType.SINK_SEPTUM);

    const gateLimit = Math.min(trans.catalyticGates.length, PoreWorkshop.MAX_GATES);
    for (let i = 0; i < gateLimit; i++) {
      const g = trans.catalyticGates[i];
      this.gates.push({
        id: i,
        type: g.definition.type,
        inputA: false,
        inputB: false,
        output: false,
        lastOutput: false
      });
    }
  }

  public stepTick(streamA: boolean, streamB: boolean, toxinT: boolean): IWorkshopTelemetry {
    let toggleCount = 0;
    const aActive = this.hasStreamAPorin && streamA;
    const bActive = this.hasStreamBPorin && streamB;
    const tActive = this.hasToxinPorin && toxinT;

    let previousGateOutput = false;
    for (let i = 0; i < this.gates.length; i++) {
      const gate = this.gates[i];
      // Feed Stream A and Stream B to first gate, or chain through previous gates
      gate.inputA = i === 0 ? aActive : previousGateOutput;
      gate.inputB = i === 0 ? bActive : (i % 2 === 1 ? aActive : bActive);

      gate.lastOutput = gate.output;
      gate.output = this.evaluateGate(gate.type, gate.inputA, gate.inputB);

      if (gate.output !== gate.lastOutput) {
        toggleCount++;
      }
      previousGateOutput = gate.output;
    }

    // Default primitive catalysis: If circuit possesses AND gate and inputs match
    const primaryActive = this.gates.length > 0 ? this.gates[this.gates.length - 1].output : (aActive && bActive);
    const hasBatteryAccess = this.hasBatterySink || this.gates.length === 0;
    const catalyticYield = (primaryActive && !tActive && hasBatteryAccess) ? PoreWorkshop.CATALYTIC_ENERGY_YIELD : 0;
    const toxinIngested = tActive && !primaryActive;

    return {
      catalyticYield,
      toggleCount,
      toxinIngested,
      septumTriggered: this.hasSeptumSink && primaryActive
    };
  }

  private evaluateGate(type: CodonType, a: boolean, b: boolean): boolean {
    if (type === CodonType.GATE_AND) return a && b;
    if (type === CodonType.GATE_OR) return a || b;
    if (type === CodonType.GATE_NOT) return !a;
    if (type === CodonType.GATE_XOR) return a !== b;
    return a;
  }

  public getGateCount(): number {
    return this.gates.length;
  }

  public getGates(): readonly IGateNode[] {
    return this.gates;
  }
}
