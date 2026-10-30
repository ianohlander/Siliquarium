/**
 * 🐠 Siliquarium Visualizer Subsystem
 * CircuitTopology: Analyzes genome tapes and extracts authentic schematic netlists,
 * gate positions, conductive wire traces, signal states, and Uri Alon network motifs.
 */

import { CodonType } from '../core/codons/CodonTable.js';
import { CodonTranslator } from '../core/codons/CodonTranslator.js';
import { PoreWorkshop } from '../core/domain/PoreWorkshop.js';
import { MotifScanner } from '../core/paleontology/MotifScanner.js';
import { IVentTelemetry } from '../engine/SimulationTelemetry.js';
import { CircuitWireRouter } from './CircuitWireRouter.js';

export interface ICircuitNode {
  readonly id: string;
  readonly type: 'porin' | 'gate' | 'sink';
  readonly label: string;
  readonly subLabel?: string;
  readonly codonType?: CodonType;
  readonly slot?: number;
  readonly isHigh: boolean;
  readonly color: string;
  // Normalized layout coordinates (0..1)
  x: number;
  y: number;
}

export interface ICircuitWire {
  readonly id: string;
  readonly fromId: string;
  readonly toId: string;
  readonly isHigh: boolean;
  readonly isFeedback: boolean;
  readonly color: string;
  // Route points in normalized coordinates (0..1)
  readonly path: readonly { x: number; y: number }[];
}

export interface ICircuitAnalysis {
  readonly nodes: readonly ICircuitNode[];
  readonly wires: readonly ICircuitWire[];
  readonly motifName: string;
  readonly motifCognate: string;
  readonly motifDesc: string;
  readonly primaryActive: boolean;
  readonly gateCount: number;
  readonly totalGenomeGates: number;
  readonly expressedOperonCount: number;
  readonly totalOperonCount: number;
  readonly isDifferentiallyExpressed: boolean;
}

export class CircuitTopology {
  public static analyze(
    tape: string,
    vent: IVentTelemetry,
    primaryActive: boolean,
    operonStates?: readonly boolean[]
  ): ICircuitAnalysis {
    const trans = CodonTranslator.translateTape(tape);

    // Compute active operon states if not provided
    const activeOperonStates: boolean[] = operonStates ? [...operonStates] : [];
    if (activeOperonStates.length === 0) {
      if (trans.operons.length > 0) {
        for (let i = 0; i < trans.operons.length; i++) {
          if (i === 0) {
            activeOperonStates.push(true);
          } else {
            const op = trans.operons[i];
            const ch = op.targetChannel ?? (op.operatorCodon ? (op.operatorCodon.codonIndex & 3) : (i % 4));
            let expressed = true;
            if (ch === 0) expressed = vent.streamA;
            else if (ch === 1) expressed = vent.streamB;
            else if (ch === 2) expressed = vent.toxinT;
            else if (ch === 3) expressed = !vent.streamA && !vent.streamB; // Chemiosmotic starvation potential (M_3)
            activeOperonStates.push(expressed);
          }
        }
      } else {
        activeOperonStates.push(true);
      }
    }

    const hasA = trans.inputPorins.some(p => {
      if (p.definition.type !== CodonType.PORIN_STREAM_A) return false;
      const op = trans.operons.find(o => o.inputPorins.some(ip => ip.slot === p.slot));
      return op ? (activeOperonStates[op.id] ?? true) : true;
    });
    const hasB = trans.inputPorins.some(p => {
      if (p.definition.type !== CodonType.PORIN_STREAM_B) return false;
      const op = trans.operons.find(o => o.inputPorins.some(ip => ip.slot === p.slot));
      return op ? (activeOperonStates[op.id] ?? true) : true;
    });
    const hasT = trans.inputPorins.some(p => {
      if (p.definition.type !== CodonType.PORIN_TOXIN_T) return false;
      const op = trans.operons.find(o => o.inputPorins.some(ip => ip.slot === p.slot));
      return op ? (activeOperonStates[op.id] ?? true) : true;
    });
    const hasBattery = trans.sinkNodes.some(s => {
      if (s.definition.type !== CodonType.SINK_BATTERY) return false;
      const op = trans.operons.find(o => o.sinkNodes.some(sn => sn.slot === s.slot));
      return op ? (activeOperonStates[op.id] ?? true) : true;
    });
    const hasSeptum = trans.sinkNodes.some(s => {
      if (s.definition.type !== CodonType.SINK_SEPTUM) return false;
      const op = trans.operons.find(o => o.sinkNodes.some(sn => sn.slot === s.slot));
      return op ? (activeOperonStates[op.id] ?? true) : true;
    });

    const aActive = hasA && vent.streamA;
    const bActive = hasB && vent.streamB;
    const tActive = hasT && vent.toxinT;

    const nodes: ICircuitNode[] = [];

    // 1. Porin Input Pads (Left column: x = 0.12)
    const porinYMap = { A: 0.25, B: 0.50, T: 0.75 };
    if (hasA) {
      nodes.push({
        id: 'porin_A',
        type: 'porin',
        label: 'STREAM A',
        subLabel: 'FUEL',
        isHigh: aActive,
        color: '#f59e0b',
        x: 0.12,
        y: porinYMap.A
      });
    }
    if (hasB) {
      nodes.push({
        id: 'porin_B',
        type: 'porin',
        label: 'STREAM B',
        subLabel: 'OXIDIZER',
        isHigh: bActive,
        color: '#06b6d4',
        x: 0.12,
        y: porinYMap.B
      });
    }
    if (hasT) {
      nodes.push({
        id: 'porin_T',
        type: 'porin',
        label: 'TOXIN T',
        subLabel: 'POISON',
        isHigh: tActive,
        color: '#f43f5e',
        x: 0.12,
        y: porinYMap.T
      });
    }

    // 2. Catalytic Logic Gates (PHYSICAL NETLIST: ONLY TRANSCRIBED/BUILT GATES ARE ASSEMBLED!)
    const allGates = trans.catalyticGates;
    const gates = allGates.filter(g => {
      if (trans.operons.length <= 1) return true;
      const op = trans.operons.find(o => o.catalyticGates.some(cg => cg.slot === g.slot));
      if (!op) return true;
      return activeOperonStates[op.id] ?? true;
    });
    const ws = PoreWorkshop.fromBitstring(tape);
    ws.stepTick({
      streamA: vent.streamA,
      streamB: vent.streamB,
      toxinT: vent.toxinT,
      batteryVoltage: (!vent.streamA && !vent.streamB) ? 15 : 50,
      streamC: Boolean(vent.streamC),
      streamD: Boolean(vent.streamD),
      photonIr: Boolean(vent.photonIr),
      baroAcoustic: Boolean(vent.baroAcoustic),
      mechanoTouch: false,
      electroRedox: Boolean(vent.electroRedox)
    });
    const wsGates = ws.getGates();
    const astEdges = ws.getAstEdges();
    const wsGateIdToNodeId = new Map<number, string>();
    const gateOutputs: boolean[] = [];

    for (let i = 0; i < gates.length; i++) {
      const g = gates[i];
      const gateType = g.definition.type;

      const wsGate = wsGates.find(wg => wg.slot === g.slot);
      if (wsGate) {
        wsGateIdToNodeId.set(wsGate.id, `gate_${i}`);
      }
      const out = wsGate ? wsGate.output : false;
      gateOutputs.push(out);

      // Position gates across center columns
      const totalGates = Math.max(1, gates.length);
      const col = totalGates <= 2 ? i : (i % 2);
      const row = totalGates <= 2 ? 0 : Math.floor(i / 2);
      const gx = 0.35 + col * 0.25;
      const numRows = Math.max(1, Math.ceil(totalGates / 2));
      const rowSpacing = Math.min(0.32, 0.60 / numRows);
      const gy = totalGates <= 2 ? 0.40 + i * 0.22 : 0.22 + row * rowSpacing;

      let gateColor = '#10b981'; // AND
      if (gateType === CodonType.GATE_OR) gateColor = '#06b6d4';
      else if (gateType === CodonType.GATE_NOT) gateColor = '#f43f5e';

      nodes.push({
        id: `gate_${i}`,
        type: 'gate',
        label: g.definition.label,
        subLabel: `Slot ${g.slot}`,
        codonType: gateType,
        slot: g.slot,
        isHigh: out,
        color: gateColor,
        x: gx,
        y: gy
      });
    }

    // 3. Sink Nodes (Right column: x = 0.88)
    if (hasBattery || gates.length === 0) {
      nodes.push({
        id: 'sink_battery',
        type: 'sink',
        label: 'BATTERY',
        subLabel: primaryActive ? '+2 TOKENS' : '0 TOKENS',
        isHigh: primaryActive,
        color: primaryActive ? '#10b981' : '#64748b',
        x: 0.88,
        y: 0.38
      });
    }
    if (hasSeptum) {
      nodes.push({
        id: 'sink_septum',
        type: 'sink',
        label: 'SEPTUM',
        subLabel: 'FISSION',
        isHigh: primaryActive,
        color: primaryActive ? '#818cf8' : '#334155',
        x: 0.88,
        y: 0.68
      });
    }

    // 4. Construct Authentic Wire Traces from Stack-AST Directed Edges
    const wires = CircuitWireRouter.routeWires({
      nodes,
      gates,
      hasA,
      hasB,
      hasT,
      hasBattery,
      aActive,
      bActive,
      tActive,
      primaryActive,
      porinYMap,
      astEdges,
      wsGateIdToNodeId
    });

    // Determine Uri Alon Motif Classification via verified MotifScanner
    let motifName = 'Primitive Co-Catalytic Pair';
    let motifCognate = 'Bi-Substrate Enzyme Active Site';
    let motifDesc = 'Requires simultaneous Stream A & Stream B collision.';

    const scannedMotifs = MotifScanner.scanWorkshop(ws);
    if (scannedMotifs.length > 0) {
      const topMotif = scannedMotifs[0].motif;
      motifName = topMotif.name;
      motifCognate = `${topMotif.biologicalCognate} (${topMotif.citation})`;
      motifDesc = topMotif.naturalFunction;
    } else if (hasT && gates.some(g => g.definition.type === CodonType.GATE_NOT)) {
      motifName = 'Allosteric Toxin Clamping Netlist';
      motifCognate = 'Competitive Feedback Repressor';
      motifDesc = 'NOT gate inverts toxin pulses to close fuel channel during acid bursts.';
    } else if (gates.some(g => g.definition.type === CodonType.GATE_OR)) {
      motifName = 'Dual-Substrate Promiscuous Generalist';
      motifCognate = 'Promiscuous Isozyme (Hexokinase)';
      motifDesc = 'OR gate allows metabolic harvesting when either substrate is present.';
    } else if (gates.length >= 2) {
      motifName = 'Multi-Stage Catalytic Cascade';
      motifCognate = 'Sign-Sensitive Delay Filter';
      motifDesc = 'Multi-pathway logic filters transient noise and demands sustained fuel.';
    }

    return {
      nodes,
      wires,
      motifName,
      motifCognate,
      motifDesc,
      primaryActive,
      gateCount: gates.length,
      totalGenomeGates: allGates.length,
      expressedOperonCount: activeOperonStates.filter(Boolean).length,
      totalOperonCount: Math.max(1, trans.operons.length),
      isDifferentiallyExpressed: gates.length !== allGates.length
    };
  }
}
