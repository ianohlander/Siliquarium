/**
 * 🐠 Siliquarium Paleontology Subsystem
 * WeisfeilerLehmanHasher: 1D & Graph Invariant Topological Hasher.
 * Generates canonical graph hashes invariant under gate index permutation or codon ordering.
 */

import { IGateNode, IAstDirectedEdge } from '../domain/PoreWorkshop.js';
import { CodonType } from '../codons/CodonTable.js';

export interface IGraphWire {
  readonly fromNodeId: number;
  readonly toNodeId: number;
}

export class WeisfeilerLehmanHasher {
  public static hashNetlist(
    gates: readonly IGateNode[],
    rounds: number = 2,
    astEdges?: readonly IAstDirectedEdge[]
  ): string {
    if (gates.length === 0) return 'EMPTY_NETLIST';

    // Round 0: Initialize colors with gate types and terminal bindings
    const colors: Map<number, string> = new Map();
    const adj: Map<number, string[]> = new Map();
    const revAdj: Map<number, string[]> = new Map();

    for (let i = 0; i < gates.length; i++) {
      const g = gates[i];
      const termSig = g.boundTerminalA || g.boundTerminalB
        ? `(${g.boundTerminalA ?? ''},${g.boundTerminalB ?? ''})`
        : '';
      colors.set(g.id, `${g.type}${termSig}`);
      adj.set(g.id, []);
      revAdj.set(g.id, []);
    }

    if (astEdges && astEdges.length > 0) {
      for (const edge of astEdges) {
        adj.get(edge.fromGateId)?.push(`${edge.inputPin}->${edge.toGateId}`);
        revAdj.get(edge.toGateId)?.push(`IN-${edge.inputPin}<-${edge.fromGateId}`);
      }
    } else {
      // Infer directed AST edges from gate child pointers or canonical Stack-AST structure
      let hasExplicitPointers = false;
      for (const g of gates) {
        if (g.leftChildGateId != null) {
          adj.get(g.leftChildGateId)?.push(`A->${g.id}`);
          revAdj.get(g.id)?.push(`IN-A<-${g.leftChildGateId}`);
          hasExplicitPointers = true;
        }
        if (g.rightChildGateId != null) {
          adj.get(g.rightChildGateId)?.push(`B->${g.id}`);
          revAdj.get(g.id)?.push(`IN-B<-${g.rightChildGateId}`);
          hasExplicitPointers = true;
        }
      }

      if (!hasExplicitPointers) {
        for (let i = 1; i < gates.length; i++) {
          const g = gates[i];
          if (
            i >= 3 &&
            gates[i - 1].type === CodonType.GATE_NOT &&
            (gates[i - 2].type === CodonType.GATE_AND || gates[i - 2].type === CodonType.GATE_OR) &&
            (gates[i - 3].type === CodonType.GATE_AND || gates[i - 3].type === CodonType.GATE_OR)
          ) {
            adj.get(gates[i - 3].id)?.push(`A->${g.id}`);
            revAdj.get(g.id)?.push(`IN-A<-${gates[i - 3].id}`);
            adj.get(gates[i - 1].id)?.push(`B->${g.id}`);
            revAdj.get(g.id)?.push(`IN-B<-${gates[i - 1].id}`);
          } else if (
            i === 1 &&
            gates.length >= 4 &&
            (g.type === CodonType.GATE_AND || g.type === CodonType.GATE_OR) &&
            (gates[0].type === CodonType.GATE_AND || gates[0].type === CodonType.GATE_OR)
          ) {
            // Parallel leaf branch in >=4-gate AST
          } else {
            adj.get(gates[i - 1].id)?.push(`A->${g.id}`);
            revAdj.get(g.id)?.push(`IN-A<-${gates[i - 1].id}`);
          }
        }
      }
    }

    // Weisfeiler-Lehman directed graph color refinement rounds
    for (let r = 0; r < rounds; r++) {
      const nextColors: Map<number, string> = new Map();
      for (const [id, color] of colors.entries()) {
        const outLinks = adj.get(id) ?? [];
        const inLinks = revAdj.get(id) ?? [];
        const neighborColors = [
          ...outLinks.map(link => {
            const [pin, targetStr] = link.split('->');
            const targetId = Number(targetStr);
            return `OUT_${pin}:${colors.get(targetId) ?? ''}`;
          }),
          ...inLinks.map(link => {
            const [pin, srcStr] = link.split('<-');
            const srcId = Number(srcStr);
            return `IN_${pin}:${colors.get(srcId) ?? ''}`;
          })
        ].sort();
        const signature = `${color}:[${neighborColors.join(',')}]`;
        nextColors.set(id, WeisfeilerLehmanHasher.simpleHash(signature));
      }
      for (const [id, nc] of nextColors.entries()) {
        colors.set(id, nc);
      }
    }

    const allColors = Array.from(colors.values()).sort();
    return `WL-${WeisfeilerLehmanHasher.simpleHash(allColors.join('|'))}`;
  }

  public static simpleHash(str: string): string {
    let h1 = 0xdeadbeef;
    let h2 = 0x41c64e6d;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
  }
}
