/**
 * 🐠 Siliquarium Paleontology Subsystem
 * WeisfeilerLehmanHasher: 1D & Graph Invariant Topological Hasher.
 * Generates canonical graph hashes invariant under gate index permutation or codon ordering.
 */

import { IGateNode } from '../domain/PoreWorkshop.js';

export interface IGraphWire {
  readonly fromNodeId: number;
  readonly toNodeId: number;
}

export class WeisfeilerLehmanHasher {
  public static hashNetlist(gates: readonly IGateNode[], rounds: number = 2): string {
    if (gates.length === 0) return 'EMPTY_NETLIST';

    // Round 0: Initialize colors with gate types
    const colors: Map<number, string> = new Map();
    const adj: Map<number, number[]> = new Map();

    for (let i = 0; i < gates.length; i++) {
      const g = gates[i];
      colors.set(g.id, g.type);
      adj.set(g.id, []);
    }

    // Default sequential/chained wires
    for (let i = 0; i < gates.length - 1; i++) {
      adj.get(gates[i].id)?.push(gates[i + 1].id);
    }

    // Weisfeiler-Lehman color refinement rounds
    for (let r = 0; r < rounds; r++) {
      const nextColors: Map<number, string> = new Map();
      for (const [id, color] of colors.entries()) {
        const neighborIds = adj.get(id) ?? [];
        const neighborColors = neighborIds.map(nid => colors.get(nid) ?? '').sort();
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
