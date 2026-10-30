/**
 * 🐠 Siliquarium Engine Subsystem
 * EvolutionaryFlightRecorder: Phylogenetic Lineage & Solution-Space Trajectory Tracker.
 * Reconstructs exact ancestral family trees and audits Homology vs Convergent Evolution (Homoplasy).
 */

import { HexCoord3D } from '../../core/spatial/HexCoord3D.js';
import { IMotifMatch } from '../../core/paleontology/MotifScanner.js';
import { MotifType } from '../../core/paleontology/NetworkMotif.js';

export interface ILineageNode {
  readonly id: string;
  readonly parentId: string | null;
  readonly birthTick: number;
  readonly coord: HexCoord3D;
  readonly genomeTape: string;
  readonly generation: number;
  readonly motifs: readonly IMotifMatch[];
  deathTick?: number;
}

export class EvolutionaryFlightRecorder {
  private readonly nodes: Map<string, ILineageNode> = new Map();
  private nextId: number = 1;

  public generateId(): string {
    return `org-${this.nextId++}`;
  }

  public recordBirth(
    nodeOrId: ILineageNode | string,
    parentId?: string | null,
    specOrBirthTick?: {
      birthTick?: number;
      coord?: HexCoord3D;
      genomeTape?: string;
      generation?: number;
      motifs?: readonly IMotifMatch[];
    } | number,
    coord?: HexCoord3D
  ): ILineageNode {
    if (typeof nodeOrId === 'object') {
      this.nodes.set(nodeOrId.id, nodeOrId);
      return nodeOrId;
    }

    let birthTick = 0;
    let nodeCoord = coord ?? new HexCoord3D(0, 0, 0);
    let genomeTape = '';
    let generation = 0;
    let motifs: readonly IMotifMatch[] = [];

    if (typeof specOrBirthTick === 'object' && specOrBirthTick !== null) {
      birthTick = specOrBirthTick.birthTick ?? 0;
      nodeCoord = specOrBirthTick.coord ?? nodeCoord;
      genomeTape = specOrBirthTick.genomeTape ?? '';
      generation = specOrBirthTick.generation ?? 0;
      motifs = specOrBirthTick.motifs ?? [];
    } else {
      if (typeof specOrBirthTick === 'number') {
        birthTick = specOrBirthTick;
      }
      if (arguments.length > 4 && typeof arguments[4] === 'string') {
        genomeTape = arguments[4];
      }
      if (arguments.length > 5 && typeof arguments[5] === 'number') {
        generation = arguments[5];
      }
      if (arguments.length > 6 && Array.isArray(arguments[6])) {
        motifs = arguments[6];
      }
    }

    const node: ILineageNode = {
      id: nodeOrId,
      parentId: parentId ?? null,
      birthTick,
      coord: nodeCoord,
      genomeTape,
      generation,
      motifs
    };
    this.nodes.set(nodeOrId, node);
    return node;
  }

  public recordDeath(id: string, deathTick: number): void {
    const node = this.nodes.get(id);
    if (node) {
      node.deathTick = deathTick;
    }
  }

  public getNode(id: string): ILineageNode | undefined {
    return this.nodes.get(id);
  }

  public traceAncestry(leafId: string): ILineageNode[] {
    const ancestry: ILineageNode[] = [];
    let current = this.nodes.get(leafId);

    while (current) {
      ancestry.unshift(current); // Oldest first
      current = current.parentId ? this.nodes.get(current.parentId) : undefined;
    }

    return ancestry;
  }

  public calculateHammingTrajectory(leafId: string): number[] {
    const lineage = this.traceAncestry(leafId);
    if (lineage.length <= 1) return [0];

    const distances: number[] = [0];
    for (let i = 0; i < lineage.length - 1; i++) {
      const tapeA = lineage[i].genomeTape;
      const tapeB = lineage[i + 1].genomeTape;
      let diff = 0;
      const len = Math.min(tapeA.length, tapeB.length);
      for (let j = 0; j < len; j++) {
        if (tapeA.charAt(j) !== tapeB.charAt(j)) diff++;
      }
      distances.push(diff);
    }
    return distances;
  }

  public findLeastCommonAncestor(idA: string, idB: string): ILineageNode | null {
    const ancestorsA = new Set<string>();
    let currA = this.nodes.get(idA);
    while (currA) {
      ancestorsA.add(currA.id);
      currA = currA.parentId ? this.nodes.get(currA.parentId) : undefined;
    }

    let currB = this.nodes.get(idB);
    while (currB) {
      if (ancestorsA.has(currB.id)) {
        return currB;
      }
      currB = currB.parentId ? this.nodes.get(currB.parentId) : undefined;
    }

    return null;
  }

  public classifyEvolutionaryOrigin(idA: string, idB: string, motif: MotifType): 'HOMOLOGY' | 'HOMOPLASY' {
    const lca = this.findLeastCommonAncestor(idA, idB);
    if (!lca) return 'HOMOPLASY';

    const lcaHadMotif = lca.motifs.some(m => m.motif.type === motif);
    return lcaHadMotif ? 'HOMOLOGY' : 'HOMOPLASY';
  }

  public size(): number {
    return this.nodes.size;
  }

  public clear(): void {
    this.nodes.clear();
    this.nextId = 1;
  }
}
