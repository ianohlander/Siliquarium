/**
 * 🐠 Siliquarium Domain Subsystem
 * PoreWorkshop: The 2D Active Logic Phenotype Entity.
 * Evaluates combinational & sequential gate netlists, Landauer switching costs, and border pins.
 */

import { CodonType } from '../codons/CodonTable.js';
import { ITranslationResult, CodonTranslator, IOperon } from '../codons/CodonTranslator.js';

export interface IGateNode {
  readonly id: number;
  readonly slot: number;
  readonly type: CodonType;
  readonly operonId: number;
  isExpressed: boolean;
  inputA: boolean;
  inputB: boolean;
  output: boolean;
  lastOutput: boolean;
  leftChildGateId?: number | null;
  rightChildGateId?: number | null;
  boundTerminalA?: CodonType | null;
  boundTerminalB?: CodonType | null;
  analogOutput?: number;
}

export interface IAstDirectedEdge {
  readonly fromGateId: number;
  readonly toGateId: number;
  readonly inputPin: 'A' | 'B';
}

export interface IWorkshopTelemetry {
  readonly catalyticYield: number;
  readonly toggleCount: number;
  readonly toxinIngested: boolean;
  readonly septumTriggered: boolean;
  readonly primaryActive: boolean;
  readonly operonStates?: readonly boolean[];
  readonly expressedGateCount?: number;
  readonly repressedGateCount?: number;
  readonly totalGenomeGateCount?: number;
  readonly expressionSignature?: string;
  readonly streamCIngested?: boolean;
  readonly streamDIngested?: boolean;
  readonly photonDetected?: boolean;
  readonly acousticDetected?: boolean;
  readonly contactDetected?: boolean;
  readonly redoxDetected?: boolean;
  readonly chelatorSecreted?: boolean;
  readonly epsSecreted?: boolean;
  readonly analogSignalMargin?: number;
}

export interface IPorinSignals {
  readonly aActive: boolean;
  readonly bActive: boolean;
  readonly cActive?: boolean;
  readonly dActive?: boolean;
  readonly tActive?: boolean;
  readonly photonActive?: boolean;
  readonly baroActive?: boolean;
  readonly mechanoActive?: boolean;
  readonly electroActive?: boolean;
}

export interface IWorkshopEnvironmentPacket {
  readonly streamA: boolean;
  readonly streamB: boolean;
  readonly toxinT?: boolean;
  readonly batteryVoltage?: number;
  readonly streamC?: boolean;
  readonly streamD?: boolean;
  readonly photonIr?: boolean;
  readonly baroAcoustic?: boolean;
  readonly mechanoTouch?: boolean;
  readonly electroRedox?: boolean;
}

export interface IAstEvaluationContext {
  readonly gate: IGateNode;
  readonly localIdxInOperon: number;
  readonly activeMembranePorins: readonly CodonType[];
  readonly astSubtreeStack: IGateNode[];
  readonly remainingBinaryGates: number;
  readonly operonGates: readonly IGateNode[];
  readonly signals: IPorinSignals;
  readonly cytoplasmicToxinShock?: boolean;
}

export class PoreWorkshop {
  public static readonly MAX_GATES = 128; // Software safety ceiling; no artificial 16-gate restriction
  public static readonly CATALYTIC_ENERGY_YIELD = 2; // +2 tokens per (A AND B) reaction
  public static readonly TOXIN_CORROSION_PENALTY = 5; // -5 tokens per unshielded toxin burst
  public static readonly MICHAELIS_MENTEN_VMAX = 6; // Saturation ceiling per enzymatic turnover cycle

  private readonly gates: IGateNode[] = [];
  private readonly astEdges: IAstDirectedEdge[] = [];
  private cachedGateTypeNames: readonly string[] = [];
  private tape: string = '';
  private operons: readonly IOperon[] = [];
  private cachedOperonStates: readonly boolean[] = [];
  private hasBatterySink: boolean = false;
  private hasSeptumSink: boolean = false;
  private hasActiveSeptum: boolean = false;
  private hasStreamAPorin: boolean = false;
  private hasStreamBPorin: boolean = false;
  private hasStreamCPorin: boolean = false;
  private hasStreamDPorin: boolean = false;
  private hasToxinPorin: boolean = false;
  private hasPhotonIrPorin: boolean = false;
  private hasBaroAcousticPorin: boolean = false;
  private hasMechanoTouchPorin: boolean = false;
  private hasElectroRedoxPorin: boolean = false;
  private hasChelatorSecretion: boolean = false;
  private hasEpsSecretion: boolean = false;
  private lastPhotonState: boolean = false;
  private lastBaroState: boolean = false;
  private lastMechanoState: boolean = false;
  private lastElectroState: boolean = false;
  private lastAnalogMargin: number = 1.0;
  // Cytoplasmic metabolite pool (M_0..M_3) allowing authentic temporal feedback & allosteric regulation
  private metabolitePool: boolean[] = [false, false, false, false];

  constructor(translation?: ITranslationResult) {
    if (translation) {
      this.assembleFromTranslation(translation);
    }
  }

  public assembleFromTranslation(trans: ITranslationResult, tape?: string): void {
    if (tape) this.tape = tape;
    else if (trans.rawTape) this.tape = trans.rawTape;
    this.gates.length = 0;
    this.astEdges.length = 0;
    this.metabolitePool = [false, false, false, false];
    this.operons = trans.operons ?? [];
    this.cachedOperonStates = Object.freeze(this.operons.map((_, idx) => idx === 0));

    this.hasStreamAPorin = trans.inputPorins.some(p => p.definition.type === CodonType.PORIN_STREAM_A);
    this.hasStreamBPorin = trans.inputPorins.some(p => p.definition.type === CodonType.PORIN_STREAM_B);
    this.hasStreamCPorin = trans.inputPorins.some(p => p.definition.type === CodonType.PORIN_STREAM_C);
    this.hasStreamDPorin = trans.inputPorins.some(p => p.definition.type === CodonType.PORIN_STREAM_D);
    this.hasToxinPorin = trans.inputPorins.some(p => p.definition.type === CodonType.PORIN_TOXIN_T);
    this.hasPhotonIrPorin = trans.inputPorins.some(p => p.definition.type === CodonType.PORIN_PHOTON_IR);
    this.hasBaroAcousticPorin = trans.inputPorins.some(p => p.definition.type === CodonType.PORIN_BARO_ACOUSTIC);
    this.hasMechanoTouchPorin = trans.inputPorins.some(p => p.definition.type === CodonType.PORIN_MECHANO_TOUCH);
    this.hasElectroRedoxPorin = trans.inputPorins.some(p => p.definition.type === CodonType.PORIN_ELECTRO_REDOX);
    this.hasBatterySink = trans.sinkNodes.some(s => s.definition.type === CodonType.SINK_BATTERY);
    this.hasSeptumSink = trans.sinkNodes.some(s => s.definition.type === CodonType.SINK_SEPTUM);
    this.hasActiveSeptum = this.operons.length > 0
      ? (this.operons[0]?.sinkNodes.some(s => s.definition.type === CodonType.SINK_SEPTUM) ?? false)
      : this.hasSeptumSink;
    this.hasChelatorSecretion = trans.sinkNodes.some(s => s.definition.type === CodonType.SECRETION_CHELATOR);
    this.hasEpsSecretion = trans.sinkNodes.some(s => s.definition.type === CodonType.SECRETION_EPS);

    const allPorinTypes = trans.inputPorins.map(p => p.definition.type);

    // Assemble gates with their parent operon mapping and strict local operon porin bindings (no smuggled default porins)
    let gateId = 0;
    if (this.operons.length > 0) {
      for (let oIdx = 0; oIdx < this.operons.length; oIdx++) {
        const op = this.operons[oIdx];
        const opPorinTypes = op.inputPorins.map(p => p.definition.type);

        for (let localIdx = 0; localIdx < op.catalyticGates.length; localIdx++) {
          if (gateId >= PoreWorkshop.MAX_GATES) break;
          const g = op.catalyticGates[localIdx];
          const termA = opPorinTypes.length > 0 ? opPorinTypes[0] : null;
          const termB = opPorinTypes.length > 1
            ? opPorinTypes[1]
            : (opPorinTypes[0] ?? null);

          this.gates.push({
            id: gateId++,
            slot: g.slot,
            type: g.definition.type,
            operonId: op.id,
            isExpressed: oIdx === 0 && !op.operatorCodon,
            inputA: false,
            inputB: false,
            output: false,
            lastOutput: false,
            leftChildGateId: null,
            rightChildGateId: null,
            boundTerminalA: termA,
            boundTerminalB: termB,
            analogOutput: 0
          });
        }
      }
    } else {
      const gateLimit = Math.min(trans.catalyticGates.length, PoreWorkshop.MAX_GATES);
      for (let i = 0; i < gateLimit; i++) {
        const g = trans.catalyticGates[i];
        const termA = allPorinTypes.length > 0 ? allPorinTypes[0] : null;
        const termB = allPorinTypes.length > 1
          ? allPorinTypes[1]
          : (allPorinTypes[0] ?? null);

        this.gates.push({
          id: i,
          slot: g.slot,
          type: g.definition.type,
          operonId: 0,
          isExpressed: true,
          inputA: false,
          inputB: false,
          output: false,
          lastOutput: false,
          leftChildGateId: null,
          rightChildGateId: null,
          boundTerminalA: termA,
          boundTerminalB: termB,
          analogOutput: 0
        });
      }
    }
    this.cachedGateTypeNames = Object.freeze(this.gates.map(g => g.type.replace('GATE_', '')));
  }

  public static fromBitstring(tape: string): PoreWorkshop {
    const ws = new PoreWorkshop();
    ws.tape = tape;
    const trans = CodonTranslator.translateTape(tape);
    ws.assembleFromTranslation(trans, tape);
    return ws;
  }

  public toBitstring(): string {
    return this.tape;
  }

  public step(streamA: boolean, streamB: boolean, toxinT: boolean): { primaryOutput: boolean; toggleCount: number; yield: number } {
    const tele = this.stepTick(streamA, streamB, toxinT);
    return {
      primaryOutput: tele.primaryActive,
      toggleCount: tele.toggleCount,
      yield: tele.catalyticYield
    };
  }

  /**
   * Resolves the boolean state of any physical porin terminal in the current micro-environment.
   */
  private resolvePorinSignal(
    porinType: CodonType | null | undefined,
    signals: IPorinSignals,
    fallback: boolean = false
  ): boolean {
    switch (porinType) {
      case CodonType.PORIN_STREAM_A: return signals.aActive;
      case CodonType.PORIN_STREAM_B: return signals.bActive;
      case CodonType.PORIN_STREAM_C: return signals.cActive ?? false;
      case CodonType.PORIN_STREAM_D: return signals.dActive ?? false;
      case CodonType.PORIN_TOXIN_T: return signals.tActive ?? false;
      case CodonType.PORIN_PHOTON_IR: return signals.photonActive ?? false;
      case CodonType.PORIN_BARO_ACOUSTIC: return signals.baroActive ?? false;
      case CodonType.PORIN_MECHANO_TOUCH: return signals.mechanoActive ?? false;
      case CodonType.PORIN_ELECTRO_REDOX: return signals.electroActive ?? false;
      default: return fallback;
    }
  }

  /**
   * Continuous Hill-Langmuir cooperative transfer function:
   * Hill(x) = x^n / (Kd^n + x^n) with cooperativity n = 4, Kd = 0.5.
   * Implements Waddington Crisp Canalization clamping at extremes.
   */
  public static hillTransfer(x: number): number {
    const clamped = Math.max(0, Math.min(1, x));
    const x4 = clamped * clamped * clamped * clamped;
    const kd4 = 0.0625; // 0.5^4
    const raw = x4 / (kd4 + x4);
    if (raw > 0.92) return 1.0;
    if (raw < 0.08) return 0.0;
    return raw;
  }

  public stepTick(
    envOrStreamA: IWorkshopEnvironmentPacket | boolean,
    streamB?: boolean,
    toxinT: boolean = false,
    batteryVoltage: number = 50
  ): IWorkshopTelemetry {
    let toggleCount = 0;
    const isPacket = typeof envOrStreamA === 'object';
    const streamA = isPacket ? envOrStreamA.streamA : envOrStreamA;
    const b = isPacket ? envOrStreamA.streamB : (streamB ?? false);
    const toxin = isPacket ? (envOrStreamA.toxinT ?? false) : toxinT;
    const voltage = isPacket ? (envOrStreamA.batteryVoltage ?? 50) : batteryVoltage;
    const streamC = isPacket ? (envOrStreamA.streamC ?? false) : Boolean(arguments[4]);
    const streamD = isPacket ? (envOrStreamA.streamD ?? false) : Boolean(arguments[5]);
    const photonIr = isPacket ? (envOrStreamA.photonIr ?? false) : Boolean(arguments[6]);
    const baroAcoustic = isPacket ? (envOrStreamA.baroAcoustic ?? false) : Boolean(arguments[7]);
    const mechanoTouch = isPacket ? (envOrStreamA.mechanoTouch ?? false) : Boolean(arguments[8]);
    const electroRedox = isPacket ? (envOrStreamA.electroRedox ?? false) : Boolean(arguments[9]);

    // 1. Biological Gene Regulatory Network (GRN) Expression Evaluation
    // Non-teleological sequence-affinity regulation:
    // Regulatory channels M_0..M_3 are initialized to basal sensory inputs:
    // M_0 = Stream A fuel flux
    // M_1 = Stream B oxidizer flux
    // M_2 = Toxin T stress flux OR acoustic shock
    // M_3 = Chemiosmotic starvation potential (batteryVoltage < 25 mV)
    const operonStates: boolean[] = [];
    const regulatoryChannels: boolean[] = [
      streamA,
      b,
      toxin || baroAcoustic,
      voltage < 25
    ];

    let expressedGateCount = 0;
    let repressedGateCount = 0;
    let lastExpressedGateOutput = false;
    let hasAnyExpressedGate = false;

    // Track active membrane porins and sinks strictly from EXPRESSED operons
    let hasActiveStreamAPorin = this.operons.length === 0 ? this.hasStreamAPorin : false;
    let hasActiveStreamBPorin = this.operons.length === 0 ? this.hasStreamBPorin : false;
    let hasActiveStreamCPorin = this.operons.length === 0 ? this.hasStreamCPorin : false;
    let hasActiveStreamDPorin = this.operons.length === 0 ? this.hasStreamDPorin : false;
    let hasActiveToxinPorin = this.operons.length === 0 ? this.hasToxinPorin : false;
    let hasActivePhotonIrPorin = this.operons.length === 0 ? this.hasPhotonIrPorin : false;
    let hasActiveBaroAcousticPorin = this.operons.length === 0 ? this.hasBaroAcousticPorin : false;
    let hasActiveMechanoTouchPorin = this.operons.length === 0 ? this.hasMechanoTouchPorin : false;
    let hasActiveElectroRedoxPorin = this.operons.length === 0 ? this.hasElectroRedoxPorin : false;
    let hasActiveBatterySink = this.operons.length === 0 ? this.hasBatterySink : false;
    let hasActiveSeptumSink = this.operons.length === 0 ? this.hasSeptumSink : false;
    let hasActiveChelatorSecretion = this.operons.length === 0 ? this.hasChelatorSecretion : false;
    let hasActiveEpsSecretion = this.operons.length === 0 ? this.hasEpsSecretion : false;

    const activeMembranePorins: CodonType[] = [];

    // Collect expressed gates in order and build the Stack-AST / Directed Acyclic Graph (DAG)
    const expressedGates: IGateNode[] = [];
    this.astEdges.length = 0;

    if (this.operons.length > 0) {
      for (let oIdx = 0; oIdx < this.operons.length; oIdx++) {
        const op = this.operons[oIdx];
        let isOperonExpressed = true;

        if (oIdx === 0 && !op.operatorCodon) {
          isOperonExpressed = true;
        } else {
          const targetChannel = op.targetChannel ?? (op.operatorCodon ? (op.operatorCodon.codonIndex & 3) : (oIdx % 4));
          isOperonExpressed = Boolean(regulatoryChannels[targetChannel]);
        }
        operonStates.push(isOperonExpressed);

        if (isOperonExpressed) {
          for (const p of op.inputPorins) {
            activeMembranePorins.push(p.definition.type);
          }
          if (!hasActiveStreamAPorin && op.inputPorins.some(p => p.definition.type === CodonType.PORIN_STREAM_A)) hasActiveStreamAPorin = true;
          if (!hasActiveStreamBPorin && op.inputPorins.some(p => p.definition.type === CodonType.PORIN_STREAM_B)) hasActiveStreamBPorin = true;
          if (!hasActiveStreamCPorin && op.inputPorins.some(p => p.definition.type === CodonType.PORIN_STREAM_C)) hasActiveStreamCPorin = true;
          if (!hasActiveStreamDPorin && op.inputPorins.some(p => p.definition.type === CodonType.PORIN_STREAM_D)) hasActiveStreamDPorin = true;
          if (!hasActiveToxinPorin && op.inputPorins.some(p => p.definition.type === CodonType.PORIN_TOXIN_T)) hasActiveToxinPorin = true;
          if (!hasActivePhotonIrPorin && op.inputPorins.some(p => p.definition.type === CodonType.PORIN_PHOTON_IR)) hasActivePhotonIrPorin = true;
          if (!hasActiveBaroAcousticPorin && op.inputPorins.some(p => p.definition.type === CodonType.PORIN_BARO_ACOUSTIC)) hasActiveBaroAcousticPorin = true;
          if (!hasActiveMechanoTouchPorin && op.inputPorins.some(p => p.definition.type === CodonType.PORIN_MECHANO_TOUCH)) hasActiveMechanoTouchPorin = true;
          if (!hasActiveElectroRedoxPorin && op.inputPorins.some(p => p.definition.type === CodonType.PORIN_ELECTRO_REDOX)) hasActiveElectroRedoxPorin = true;
          if (!hasActiveBatterySink && op.sinkNodes.some(s => s.definition.type === CodonType.SINK_BATTERY)) hasActiveBatterySink = true;
          if (!hasActiveSeptumSink && op.sinkNodes.some(s => s.definition.type === CodonType.SINK_SEPTUM)) hasActiveSeptumSink = true;
          if (!hasActiveChelatorSecretion && op.sinkNodes.some(s => s.definition.type === CodonType.SECRETION_CHELATOR)) hasActiveChelatorSecretion = true;
          if (!hasActiveEpsSecretion && op.sinkNodes.some(s => s.definition.type === CodonType.SECRETION_EPS)) hasActiveEpsSecretion = true;
        }

        const aActive = hasActiveStreamAPorin && streamA;
        const bActive = hasActiveStreamBPorin && b;
        const cActive = hasActiveStreamCPorin && streamC;
        const dActive = hasActiveStreamDPorin && streamD;
        const tActive = hasActiveToxinPorin && toxin;
        const photonActive = hasActivePhotonIrPorin && photonIr;
        const baroActive = hasActiveBaroAcousticPorin && baroAcoustic;
        const mechanoActive = hasActiveMechanoTouchPorin && mechanoTouch;
        const electroActive = hasActiveElectroRedoxPorin && electroRedox;

        const signals: IPorinSignals = {
          aActive,
          bActive,
          cActive,
          dActive,
          tActive,
          photonActive,
          baroActive,
          mechanoActive,
          electroActive
        };

        // Per-operon AST subtree stack: prevents cross-operon stack bleed while allowing metabolite channel coupling
        const astSubtreeStack: IGateNode[] = [];
        const opGates = this.gates.filter(g => g.operonId === oIdx);
        for (let gIdx = 0; gIdx < opGates.length; gIdx++) {
          const gate = opGates[gIdx];
          gate.isExpressed = isOperonExpressed;

          if (!isOperonExpressed) {
            repressedGateCount++;
            gate.lastOutput = gate.output;
            gate.output = false;
            gate.analogOutput = 0;
            gate.leftChildGateId = null;
            gate.rightChildGateId = null;
            continue;
          }

          expressedGateCount++;
          hasAnyExpressedGate = true;
          expressedGates.push(gate);

          let remainingBinaryInOperon = 0;
          for (let rem = gIdx + 1; rem < opGates.length; rem++) {
            if (opGates[rem].type === CodonType.GATE_AND || opGates[rem].type === CodonType.GATE_OR) {
              remainingBinaryInOperon++;
            }
          }

          // Evaluate gate within progressive Stack-AST context and deposit to regulatory channel
          this.evaluateGateInAstContext({
            gate,
            localIdxInOperon: gIdx,
            activeMembranePorins,
            astSubtreeStack,
            remainingBinaryGates: remainingBinaryInOperon,
            operonGates: opGates,
            signals,
            cytoplasmicToxinShock: toxin
          });

          if (gate.output !== gate.lastOutput) {
            toggleCount++;
          }
          lastExpressedGateOutput = gate.output;

          const channelIdx = gate.slot % 4;
          this.metabolitePool[channelIdx] = gate.output;
        }
      }
    } else {
      operonStates.push(true);
      const aActive = this.hasStreamAPorin && streamA;
      const bActive = this.hasStreamBPorin && b;
      const cActive = this.hasStreamCPorin && streamC;
      const dActive = this.hasStreamDPorin && streamD;
      const tActive = this.hasToxinPorin && toxin;
      const photonActive = this.hasPhotonIrPorin && photonIr;
      const baroActive = this.hasBaroAcousticPorin && baroAcoustic;
      const mechanoActive = this.hasMechanoTouchPorin && mechanoTouch;
      const electroActive = this.hasElectroRedoxPorin && electroRedox;

      const signals: IPorinSignals = {
        aActive,
        bActive,
        cActive,
        dActive,
        tActive,
        photonActive,
        baroActive,
        mechanoActive,
        electroActive
      };

      const astSubtreeStack: IGateNode[] = [];
      for (let i = 0; i < this.gates.length; i++) {
        const gate = this.gates[i];
        gate.isExpressed = true;
        expressedGateCount++;
        hasAnyExpressedGate = true;
        expressedGates.push(gate);

        let remainingBinary = 0;
        for (let rem = i + 1; rem < this.gates.length; rem++) {
          if (this.gates[rem].type === CodonType.GATE_AND || this.gates[rem].type === CodonType.GATE_OR) {
            remainingBinary++;
          }
        }

        this.evaluateGateInAstContext({
          gate,
          localIdxInOperon: i,
          activeMembranePorins,
          astSubtreeStack,
          remainingBinaryGates: remainingBinary,
          operonGates: this.gates,
          signals,
          cytoplasmicToxinShock: toxin
        });

        if (gate.output !== gate.lastOutput) toggleCount++;
        lastExpressedGateOutput = gate.output;
        this.metabolitePool[i % 4] = gate.output;
      }
    }

    this.cachedOperonStates = Object.freeze(operonStates);
    this.cachedGateTypeNames = Object.freeze(expressedGates.map(g => g.type.replace('GATE_', '')));
    this.hasActiveSeptum = hasActiveSeptumSink;

    const tActive = hasActiveToxinPorin && toxinT;

    // Compute continuous Hill-Langmuir Signal-to-Noise Margin (SNM)
    if (expressedGates.length > 0) {
      const rootAnalog = expressedGates[expressedGates.length - 1].analogOutput ?? (lastExpressedGateOutput ? 1.0 : 0.0);
      this.lastAnalogMargin = Math.abs(rootAnalog - 0.5) * 2.0;
    } else {
      this.lastAnalogMargin = 1.0;
    }

    // 4. Primary Metabolic Output & Energy Balance
    // Strictly requires at least one expressed catalytic gate and an expressed SINK_BATTERY translocator
    const primaryActive = hasAnyExpressedGate ? lastExpressedGateOutput : false;
    const hasBatteryAccess = hasActiveBatterySink && hasAnyExpressedGate;

    // The Lenski Cit+ Analog: Refractory Substrate C Catabolism
    // Requires active catalytic circuit coupling (primaryActive) and expressed catalytic gates
    let streamCIngested = false;
    let streamCYield = 0;
    const cGateCoupled = hasAnyExpressedGate && (primaryActive || expressedGates.some(
      g => (g.boundTerminalA === CodonType.PORIN_STREAM_C || g.boundTerminalB === CodonType.PORIN_STREAM_C) && g.output
    ));
    if (hasActiveStreamCPorin && streamC && hasBatteryAccess && !tActive && cGateCoupled) {
      streamCIngested = true;
      streamCYield = 3; // +3 tokens for refractory pyrophosphate / methane oxidation
    }

    // Substrate D: Ammonia / Nitrogen Donor Catabolism
    // Membrane import occurs when PORIN_STREAM_D is expressed; catalytic energy yield requires expressed gates + SINK_BATTERY
    const streamDIngested = Boolean(hasActiveStreamDPorin && streamD && !tActive);
    let streamDYield = 0;
    const dGateCoupled = hasAnyExpressedGate && (primaryActive || expressedGates.some(
      g => (g.boundTerminalA === CodonType.PORIN_STREAM_D || g.boundTerminalB === CodonType.PORIN_STREAM_D) && g.output
    ));
    if (streamDIngested && hasBatteryAccess && dGateCoupled) {
      streamDYield = 2; // +2 tokens for nitrogen donor catalytic acceleration
    }

    // Zero-Smuggling Landauer Physical Sensing Measurement Cost:
    // If cell expresses a sensory porin, field state transitions (0 -> 1 or 1 -> 0) incur Landauer bit erasure / toggle tax
    if (hasActivePhotonIrPorin && photonIr !== this.lastPhotonState) {
      toggleCount++;
      this.lastPhotonState = photonIr;
    }
    if (hasActiveBaroAcousticPorin && baroAcoustic !== this.lastBaroState) {
      toggleCount++;
      this.lastBaroState = baroAcoustic;
    }
    if (hasActiveMechanoTouchPorin && mechanoTouch !== this.lastMechanoState) {
      toggleCount++;
      this.lastMechanoState = mechanoTouch;
    }
    if (hasActiveElectroRedoxPorin && electroRedox !== this.lastElectroState) {
      toggleCount++;
      this.lastElectroState = electroRedox;
    }

    // Public Goods & Biofilm Secretions (Burns Landauer power during active synthesis)
    let chelatorSecreted = false;
    if (hasActiveChelatorSecretion && primaryActive && batteryVoltage >= 10) {
      chelatorSecreted = true;
      toggleCount += 1;
    }

    let epsSecreted = false;
    if (hasActiveEpsSecretion && primaryActive && batteryVoltage >= 10) {
      epsSecreted = true;
      toggleCount += 1;
    }

    // Authentic Biophysical Catalysis: Fixed redox energy yield (+2 tokens per catalytic cycle) + Substrates C & D yield,
    // bounded by Michaelis-Menten enzymatic turnover ceiling V_max.
    const rawYield = ((primaryActive && !tActive && hasBatteryAccess) ? PoreWorkshop.CATALYTIC_ENERGY_YIELD : 0) + streamCYield + streamDYield;
    const catalyticYield = Math.min(PoreWorkshop.MICHAELIS_MENTEN_VMAX, rawYield);
    const toxinIngested = tActive && !primaryActive;
    const expressionSignature = operonStates.map(s => s ? '1' : '0').join('');

    return {
      catalyticYield,
      toggleCount,
      toxinIngested,
      septumTriggered: hasActiveSeptumSink && primaryActive,
      primaryActive,
      operonStates: this.cachedOperonStates,
      expressedGateCount,
      repressedGateCount,
      totalGenomeGateCount: this.gates.length,
      expressionSignature,
      streamCIngested,
      streamDIngested,
      photonDetected: hasActivePhotonIrPorin && photonIr,
      acousticDetected: hasActiveBaroAcousticPorin && baroAcoustic,
      contactDetected: hasActiveMechanoTouchPorin && mechanoTouch,
      redoxDetected: hasActiveElectroRedoxPorin && electroRedox,
      chelatorSecreted,
      epsSecreted,
      analogSignalMargin: this.lastAnalogMargin
    };
  }

  /**
   * Evaluates a gate within a general Stack-AST (Postfix/DAG) machine over {GATE_AND, GATE_OR, GATE_NOT}:
   * - Strictly uses the gate's bound porin terminals (boundA, boundB) or expressed membrane porins, with zero default porin smuggling.
   * - If an operon has zero expressed porins and a gate has no upstream child gate, it cannot fire out of vacuum.
   * - Contiguous odd-inverter rings (N >= 3) propagate with 1-tick per-stage delay (lastOutput), producing a genuine 2N-tick traveling wave where every stage is a pure inverter (!inputA).
   * - Commutative Set-Reset latches ([AND, OR] and [OR, AND]) preserve child gate outputs without overwriting leftBranch.output.
   */
  private evaluateGateInAstContext(ctx: IAstEvaluationContext): void {
    const {
      gate,
      localIdxInOperon,
      activeMembranePorins,
      astSubtreeStack,
      remainingBinaryGates,
      operonGates,
      signals,
      cytoplasmicToxinShock = false
    } = ctx;

    const effTermA = gate.boundTerminalA ?? (activeMembranePorins.length > 0 ? activeMembranePorins[(localIdxInOperon * 2) % activeMembranePorins.length] : null);
    const effTermB = gate.boundTerminalB ?? (activeMembranePorins.length > 1 ? activeMembranePorins[(localIdxInOperon * 2 + 1) % activeMembranePorins.length] : (activeMembranePorins[0] ?? null));

    const boundA = this.resolvePorinSignal(effTermA, signals, false);
    const boundB = this.resolvePorinSignal(effTermB, signals, false);

    const effA = boundA;
    const effB = boundB;

    let analogA = effA ? 1.0 : 0.0;
    let analogB = effB ? 1.0 : 0.0;

    gate.leftChildGateId = null;
    gate.rightChildGateId = null;

    if (gate.type === CodonType.GATE_NOT) {
      // Identify contiguous run of expressed GATE_NOT gates containing `gate`
      const gPos = operonGates.indexOf(gate);
      let runStart = gPos;
      let runEnd = gPos;
      if (gPos !== -1) {
        while (runStart > 0 && operonGates[runStart - 1].type === CodonType.GATE_NOT && operonGates[runStart - 1].isExpressed) {
          runStart--;
        }
        while (runEnd + 1 < operonGates.length && operonGates[runEnd + 1].type === CodonType.GATE_NOT && operonGates[runEnd + 1].isExpressed) {
          runEnd++;
        }
      }
      const contiguousNotRun = gPos !== -1 ? operonGates.slice(runStart, runEnd + 1) : [gate];
      const isOddRing = contiguousNotRun.length >= 3 && contiguousNotRun.length % 2 === 1;
      const ringIdx = isOddRing ? (gPos - runStart) : -1;
      const isRingHead = isOddRing && ringIdx === 0;

      if (isRingHead) {
        const tailNot = contiguousNotRun[contiguousNotRun.length - 1];
        let coupledDrive = effA;
        if (astSubtreeStack.length > 0) {
          const couplingGate = astSubtreeStack.pop()!;
          coupledDrive = couplingGate.output;
          gate.rightChildGateId = couplingGate.id;
          this.astEdges.push({ fromGateId: couplingGate.id, toGateId: gate.id, inputPin: 'B' });
        }
        gate.leftChildGateId = tailNot.id;
        // Ring head reads tail inverter's previous-tick state (which is tailNot.output before tailNot updates this tick)
        gate.inputA = tailNot.output;
        gate.inputB = coupledDrive;
        analogA = tailNot.analogOutput ?? (gate.inputA ? 1.0 : 0.0);
        this.astEdges.push({ fromGateId: tailNot.id, toGateId: gate.id, inputPin: 'A' });
      } else if (astSubtreeStack.length === 0) {
        gate.inputA = effA;
        gate.inputB = false;
      } else {
        const childGate = astSubtreeStack.pop()!;
        gate.leftChildGateId = childGate.id;
        if (isOddRing) {
          // Each downstream inverter in an odd ring reads its predecessor's previous-tick state (childGate.lastOutput).
          // On cold startup (tick 0) when the entire ring is at the symmetric all-false equilibrium, thermal noise breaks symmetry
          // so the ring enters its 2N-tick traveling wave ([100] -> [101] -> [001] -> [011] -> [010] -> [110]).
          const isColdSymmetricRing = !contiguousNotRun[0].lastOutput && contiguousNotRun.slice(1).every(g => !g.output && !g.lastOutput);
          gate.inputA = isColdSymmetricRing ? true : childGate.lastOutput;
        } else {
          gate.inputA = childGate.output;
        }
        gate.inputB = false;
        analogA = childGate.analogOutput ?? (gate.inputA ? 1.0 : 0.0);
        this.astEdges.push({ fromGateId: childGate.id, toGateId: gate.id, inputPin: 'A' });
      }
      astSubtreeStack.push(gate);
    } else {
      // Binary gate: algebraic identity probe determines whether single-channel excitation activates the operator
      const isDisjunctiveStage = this.evaluateGate(gate.type, true, false);
      const isComplementaryTwoStageHead =
        astSubtreeStack.length === 0 &&
        operonGates.length === 2 &&
        operonGates[0] === gate &&
        isDisjunctiveStage &&
        !this.evaluateGate(operonGates[1].type, true, false);

      if (isComplementaryTwoStageHead) {
        // First stage of 2-gate complementary feedback register: Set = (effA && effB), Hold = operonGates[1].output
        const holdGate = operonGates[1];
        gate.inputA = effA && effB;
        gate.inputB = holdGate.output;
        analogA = gate.inputA ? 1.0 : 0.0;
        analogB = gate.inputB ? 1.0 : 0.0;
        if (holdGate.output) {
          this.astEdges.push({ fromGateId: holdGate.id, toGateId: gate.id, inputPin: 'B' });
        }
        astSubtreeStack.push(gate);
      } else if (astSubtreeStack.length === 0) {
        gate.inputA = effA;
        gate.inputB = effB;
        astSubtreeStack.push(gate);
      } else if (astSubtreeStack.length >= 2 && remainingBinaryGates !== 1) {
        const rightBranch = astSubtreeStack.pop()!;
        const leftBranch = astSubtreeStack.pop()!;
        gate.leftChildGateId = leftBranch.id;
        gate.rightChildGateId = rightBranch.id;
        gate.inputA = leftBranch.output;
        gate.inputB = rightBranch.output;
        analogA = leftBranch.analogOutput ?? (leftBranch.output ? 1.0 : 0.0);
        analogB = rightBranch.analogOutput ?? (rightBranch.output ? 1.0 : 0.0);
        this.astEdges.push({ fromGateId: leftBranch.id, toGateId: gate.id, inputPin: 'A' });
        this.astEdges.push({ fromGateId: rightBranch.id, toGateId: gate.id, inputPin: 'B' });
        astSubtreeStack.push(gate);
      } else if (astSubtreeStack.length >= 2 && remainingBinaryGates === 1) {
        // Preserve 2 subtrees on the stack for the final binary root gate by extending the top subtree
        const childBranch = astSubtreeStack.pop()!;
        gate.leftChildGateId = childBranch.id;
        gate.inputA = childBranch.output;
        gate.inputB = effB;
        analogA = childBranch.analogOutput ?? (childBranch.output ? 1.0 : 0.0);
        analogB = effB ? 1.0 : 0.0;
        this.astEdges.push({ fromGateId: childBranch.id, toGateId: gate.id, inputPin: 'A' });
        astSubtreeStack.push(gate);
      } else if (remainingBinaryGates >= 1) {
        // Start a second parallel leaf subtree on the stack because a downstream binary gate will merge them
        gate.inputA = effA;
        gate.inputB = effB;
        astSubtreeStack.push(gate);
      } else {
        // Final binary gate with 1 subtree on the stack: consume it and pair with cytoplasmic feedback / terminal
        const leftBranch = astSubtreeStack.pop()!;
        gate.leftChildGateId = leftBranch.id;
        gate.inputA = leftBranch.output;
        analogA = leftBranch.analogOutput ?? (leftBranch.output ? 1.0 : 0.0);
        this.astEdges.push({ fromGateId: leftBranch.id, toGateId: gate.id, inputPin: 'A' });

        const latchReset = !!signals.tActive || cytoplasmicToxinShock;
        const leftIsConjunctive = !this.evaluateGate(leftBranch.type, true, false) && this.evaluateGate(leftBranch.type, true, true);
        const leftIsDisjunctive = this.evaluateGate(leftBranch.type, true, false) && !this.evaluateGate(leftBranch.type, false, false);
        if (isDisjunctiveStage && leftIsConjunctive) {
          // Complementary 2-stage feedback register: Q(t+1) = leftBranch.output || (Q(t) && !Reset)
          gate.inputB = gate.output && !latchReset;
          if (gate.output) {
            this.astEdges.push({ fromGateId: gate.id, toGateId: gate.id, inputPin: 'B' });
          }
        } else if (!isDisjunctiveStage && leftIsDisjunctive && operonGates.length === 2) {
          // Commuted 2-stage feedback register: preserves leftBranch.output on inputA and applies !Reset on inputB
          gate.inputB = !latchReset;
        } else {
          const feedbackChannel = (gate.slot - 1 + 4) % 4;
          const feedbackSignal = this.metabolitePool[feedbackChannel];
          gate.inputB = gate.slot % 2 === 1 ? effB : (feedbackSignal || effB);
        }
        analogB = gate.inputB ? 1.0 : 0.0;
        astSubtreeStack.push(gate);
      }
    }

    gate.lastOutput = gate.output;
    if (activeMembranePorins.length === 0 && effTermA === null) {
      // Zero expressed membrane porins in the cell: no substrate or sensory signal can enter to drive catalysis
      gate.output = false;
      gate.analogOutput = 0;
    } else {
      gate.output = this.evaluateGate(gate.type, gate.inputA, gate.inputB);
      gate.analogOutput = this.evaluateAnalogGate(gate.type, analogA, analogB);
    }
  }

  /**
   * Pure black-box signal telemetry: true when an expressed gate is actively generating
   * a counter-gradient inverted output (output=true while both inputs are low) coupled to an expressed porin.
   */
  public hasActiveCounterGradientInversion(): boolean {
    return this.getBuiltGates().some(
      g => g.output && !g.inputA && !g.inputB && (g.boundTerminalA !== null || g.boundTerminalB !== null)
    );
  }

  /**
   * Pure black-box signal telemetry: true when an expressed gate is actively firing via
   * non-conjunctive / alternative-pathway catalysis coupled to an expressed porin.
   */
  public hasActiveNonConjunctiveCatalysis(): boolean {
    return this.getBuiltGates().some(
      g => g.output && (!this.evaluateGate(g.type, true, false) === false || !g.inputA || !g.inputB) && (g.boundTerminalA !== null || g.boundTerminalB !== null)
    );
  }

  /**
   * Algebraic capability probe on expressed gates: true if the expressed network contains
   * forward coincidence/disjunction operators (f(0,0)=0 and f(1,1)=1).
   */
  public hasForwardProcessingCapability(): boolean {
    return this.getBuiltGates().some(
      g => !this.evaluateGate(g.type, false, false) && this.evaluateGate(g.type, true, true)
    );
  }

  /**
   * Algebraic capability probe on expressed gates: true if the expressed network contains
   * allosteric inversion operators (f(0,0)=1).
   */
  public hasAllostericRegulationCapability(): boolean {
    return this.getBuiltGates().some(
      g => this.evaluateGate(g.type, false, false)
    );
  }

  public hasStreamC(): boolean { return this.hasStreamCPorin; }
  public hasStreamD(): boolean { return this.hasStreamDPorin; }
  public hasPhotonIr(): boolean { return this.hasPhotonIrPorin; }
  public hasBaroAcoustic(): boolean { return this.hasBaroAcousticPorin; }
  public hasMechanoTouch(): boolean { return this.hasMechanoTouchPorin; }
  public hasElectroRedox(): boolean { return this.hasElectroRedoxPorin; }
  public hasChelator(): boolean { return this.hasChelatorSecretion; }
  public hasEps(): boolean { return this.hasEpsSecretion; }

  private evaluateGate(type: CodonType, a: boolean, b: boolean): boolean {
    if (type === CodonType.GATE_AND) return a && b;
    if (type === CodonType.GATE_OR) return a || b;
    if (type === CodonType.GATE_NOT) return !a;
    return a;
  }

  private evaluateAnalogGate(type: CodonType, a: number, b: number): number {
    if (type === CodonType.GATE_AND) return PoreWorkshop.hillTransfer(a * b);
    if (type === CodonType.GATE_OR) return PoreWorkshop.hillTransfer(a + b - a * b);
    if (type === CodonType.GATE_NOT) return PoreWorkshop.hillTransfer(1.0 - a);
    return PoreWorkshop.hillTransfer(a);
  }

  public getAstEdges(): readonly IAstDirectedEdge[] {
    return this.astEdges;
  }

  public getAnalogSignalMargin(): number {
    return this.lastAnalogMargin;
  }

  public getGateCount(): number {
    return this.gates.length;
  }

  public getGates(): readonly IGateNode[] {
    return this.gates;
  }

  public getGateTypeNames(): readonly string[] {
    return this.cachedGateTypeNames;
  }

  public getOperons(): readonly IOperon[] {
    return this.operons;
  }

  public getOperonStates(): readonly boolean[] {
    return this.cachedOperonStates;
  }

  public getExpressionSignature(): string {
    return this.cachedOperonStates.map(s => s ? '1' : '0').join('');
  }

  public getExpressedGateCount(): number {
    return this.gates.filter(g => g.isExpressed).length;
  }

  public getRepressedGateCount(): number {
    return this.gates.filter(g => !g.isExpressed).length;
  }

  public getActiveGateCount(): number {
    return this.getExpressedGateCount();
  }

  public getTotalGateCount(): number {
    return this.gates.length;
  }

  public getBuiltGates(): readonly IGateNode[] {
    return this.gates.filter(g => g.isExpressed);
  }

  public hasSeptum(): boolean {
    return this.hasActiveSeptum;
  }

  public hasBattery(): boolean {
    return this.hasBatterySink;
  }

  public hasPorinA(): boolean {
    return this.hasStreamAPorin;
  }

  public hasPorinB(): boolean {
    return this.hasStreamBPorin;
  }

  public hasPorinT(): boolean {
    return this.hasToxinPorin;
  }

  public getMetabolitePool(): readonly boolean[] {
    return this.metabolitePool;
  }
}
