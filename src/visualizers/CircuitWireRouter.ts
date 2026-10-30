/**
 * 🐠 Siliquarium Visualizer Subsystem
 * CircuitWireRouter: Computes ortholinear schematic conductive traces and feedback paths from Stack-AST edges.
 */

import { CodonType } from '../core/codons/CodonTable.js';
import { ICircuitNode, ICircuitWire } from './CircuitTopology.js';

export interface IWireRouterGateInfo {
  readonly definition: { readonly type: CodonType };
}

export interface IWireRouterAstEdge {
  readonly fromGateId: number;
  readonly toGateId: number;
  readonly inputPin: 'A' | 'B';
}

export interface IWireRouterContext {
  readonly nodes: readonly ICircuitNode[];
  readonly gates: readonly IWireRouterGateInfo[];
  readonly hasA: boolean;
  readonly hasB: boolean;
  readonly hasT: boolean;
  readonly hasBattery: boolean;
  readonly aActive: boolean;
  readonly bActive: boolean;
  readonly tActive: boolean;
  readonly primaryActive: boolean;
  readonly porinYMap: { readonly A: number; readonly B: number; readonly T: number };
  readonly astEdges: readonly IWireRouterAstEdge[];
  readonly wsGateIdToNodeId: ReadonlyMap<number, string>;
}

export class CircuitWireRouter {
  public static routeWires(ctx: IWireRouterContext): ICircuitWire[] {
    const {
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
    } = ctx;

    const wires: ICircuitWire[] = [];

    if (gates.length > 0) {
      // Input wires from porins to leaf gates
      const g0 = nodes.find(n => n.id === 'gate_0')!;
      if (hasA) {
        wires.push({
          id: 'wire_A_g0',
          fromId: 'porin_A',
          toId: 'gate_0',
          isHigh: aActive,
          isFeedback: false,
          color: '#f59e0b',
          path: [
            { x: 0.16, y: porinYMap.A },
            { x: 0.25, y: porinYMap.A },
            { x: 0.25, y: g0.y - 0.05 },
            { x: g0.x - 0.06, y: g0.y - 0.05 }
          ]
        });
      }
      if (hasB) {
        wires.push({
          id: 'wire_B_g0',
          fromId: 'porin_B',
          toId: 'gate_0',
          isHigh: bActive,
          isFeedback: false,
          color: '#06b6d4',
          path: [
            { x: 0.16, y: porinYMap.B },
            { x: 0.25, y: porinYMap.B },
            { x: 0.25, y: g0.y + 0.05 },
            { x: g0.x - 0.06, y: g0.y + 0.05 }
          ]
        });
      }
      if (hasT && gates.some(g => g.definition.type === CodonType.GATE_NOT)) {
        const notGate = nodes.find(n => n.codonType === CodonType.GATE_NOT);
        if (notGate) {
          wires.push({
            id: 'wire_T_not',
            fromId: 'porin_T',
            toId: notGate.id,
            isHigh: tActive,
            isFeedback: false,
            color: '#f43f5e',
            path: [
              { x: 0.16, y: porinYMap.T },
              { x: 0.28, y: porinYMap.T },
              { x: 0.28, y: notGate.y },
              { x: notGate.x - 0.06, y: notGate.y }
            ]
          });
        }
      }

      // Authentic inter-gate connection wires directly from PoreWorkshop Stack-AST edges
      for (const edge of astEdges) {
        const fromNodeId = wsGateIdToNodeId.get(edge.fromGateId);
        const toNodeId = wsGateIdToNodeId.get(edge.toGateId);
        if (!fromNodeId || !toNodeId) continue;
        const curr = nodes.find(n => n.id === fromNodeId)!;
        const next = nodes.find(n => n.id === toNodeId)!;
        const isFeedbackEdge = edge.fromGateId >= edge.toGateId;
        const isHigh = curr.isHigh;
        const pinYOffset = edge.inputPin === 'A' ? -0.04 : 0.04;
        wires.push({
          id: `wire_${fromNodeId}_${toNodeId}_${edge.inputPin}`,
          fromId: curr.id,
          toId: next.id,
          isHigh,
          isFeedback: isFeedbackEdge,
          color: isFeedbackEdge ? '#fbbf24' : (isHigh ? '#38bdf8' : '#334155'),
          path: isFeedbackEdge
            ? [
                { x: curr.x + 0.04, y: curr.y - 0.06 },
                { x: curr.x + 0.04, y: 0.12 },
                { x: next.x, y: 0.12 },
                { x: next.x, y: next.y - 0.08 }
              ]
            : [
                { x: curr.x + 0.06, y: curr.y },
                { x: (curr.x + next.x) / 2, y: curr.y },
                { x: (curr.x + next.x) / 2, y: next.y + pinYOffset },
                { x: next.x - 0.06, y: next.y + pinYOffset }
              ]
        });
      }

      // Output wire to Battery
      const finalGate = nodes.find(n => n.id === `gate_${gates.length - 1}`)!;
      if (hasBattery || gates.length > 0) {
        wires.push({
          id: 'wire_out_battery',
          fromId: finalGate.id,
          toId: 'sink_battery',
          isHigh: primaryActive,
          isFeedback: false,
          color: primaryActive ? '#10b981' : '#334155',
          path: [
            { x: finalGate.x + 0.06, y: finalGate.y },
            { x: 0.75, y: finalGate.y },
            { x: 0.75, y: 0.38 },
            { x: 0.82, y: 0.38 }
          ]
        });
      }
    } else {
      // Pure diffusion: direct porin to battery wire
      if (hasA && hasB) {
        wires.push({
          id: 'wire_direct_A',
          fromId: 'porin_A',
          toId: 'sink_battery',
          isHigh: aActive && bActive,
          isFeedback: false,
          color: '#f59e0b',
          path: [{ x: 0.16, y: porinYMap.A }, { x: 0.5, y: 0.34 }, { x: 0.82, y: 0.38 }]
        });
        wires.push({
          id: 'wire_direct_B',
          fromId: 'porin_B',
          toId: 'sink_battery',
          isHigh: aActive && bActive,
          isFeedback: false,
          color: '#06b6d4',
          path: [{ x: 0.16, y: porinYMap.B }, { x: 0.5, y: 0.42 }, { x: 0.82, y: 0.38 }]
        });
      }
    }

    return wires;
  }
}
