/**
 * 🐠 Siliquarium Paleontology Subsystem
 * IMilestoneEvent: Evolutionary Milestone & Biological Innovation Event Definitions.
 */

import { HexCoord3D } from '../../core/spatial/HexCoord3D.js';
import { IMotifDefinition } from '../../core/paleontology/NetworkMotif.js';

export interface IMilestoneEvent {
  readonly id: string;
  readonly tick: number;
  readonly poreCoord: HexCoord3D;
  readonly motif: IMotifDefinition;
  readonly wlHash: string;
  readonly origin: 'HOMOLOGY' | 'HOMOPLASY' | 'DE_NOVO';
}

export type MilestoneCallback = (event: IMilestoneEvent) => void;
