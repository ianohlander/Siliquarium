/**
 * 🐠 Siliquarium Ecology Subsystem
 * PelagicSporeEngine: Manages pelagic spore lifespans, tidal advection, and settlement into basalt-free rock crevices.
 */

import { HexCoord3D } from '../../core/spatial/HexCoord3D.js';
import { Pore } from '../../core/domain/Pore.js';
import { PoreCell } from '../../core/domain/PoreCell.js';
import { PoreState } from '../../core/domain/Pore.js';
import { ThermodynamicLedger } from '../../core/physics/ThermodynamicLedger.js';
import { IPrng } from '../../core/prng/SeedablePrng.js';
import { GeologicalPressuresEngine } from '../environment/GeologicalPressuresEngine.js';

export interface ISporeStepContext {
  readonly pores: readonly Pore[];
  readonly poreMap: Map<string, Pore>;
  readonly minZ: number;
  readonly ledger: ThermodynamicLedger;
  readonly geologicalEngine: GeologicalPressuresEngine;
  readonly prng: IPrng;
  readonly onSporeSettled: (pore: Pore) => void;
}

export class PelagicSporeEngine {
  public static step(ctx: ISporeStepContext): void {
    const { pores, poreMap, minZ, ledger, geologicalEngine, prng, onSporeSettled } = ctx;
    const activeSporePores = pores.filter(p => p.hasSpore());

    for (const pore of activeSporePores) {
      const spore = pore.getSpore();
      if (!spore) continue;

      spore.ticksRemaining--;
      if (spore.ticksRemaining <= 0) {
        ledger.recordHeatDissipation(spore.energy);
        ledger.recordMatterSedimentation(spore.matter);
        pore.setSpore(null);
        continue;
      }

      // Settle candidates must NOT be basalt!
      const settleCandidates = [
        new HexCoord3D(pore.coord.q, pore.coord.r, Math.max(minZ, pore.coord.z - 1)),
        ...pore.coord.getPlanarNeighbors()
      ].map(c => poreMap.get(c.toKey())).filter((p): p is Pore =>
        p !== undefined && !p.isAqueous() && !p.isBasalt() && p.getState() === PoreState.EMPTY
      );

      if (settleCandidates.length > 0 && settleCandidates[0].setResident(new PoreCell(spore.safe, spore.energy, spore.matter, spore.generation, spore.id, spore.parentId, spore.cladeId, spore.organelleSafe ?? null))) {
        onSporeSettled(settleCandidates[0]);
        pore.setSpore(null);
        continue;
      }

      const tidal = geologicalEngine.currentTidalVector;
      const driftCandidates = pore.coord.getPlanarNeighbors().map(c => poreMap.get(c.toKey()))
        .filter((p): p is Pore => p !== undefined && p.isAqueous() && !p.hasSpore());
      if (driftCandidates.length > 0) {
        // Bias drift along planetary tidal vector (semi-diurnal oscillation)
        const alignedCandidate = driftCandidates.find(p => (p.coord.q - pore.coord.q === tidal.dq) && (p.coord.r - pore.coord.r === tidal.dr));
        const chosen = (alignedCandidate && prng.nextFloat() < 0.60)
          ? alignedCandidate
          : driftCandidates[Math.floor(prng.nextFloat() * driftCandidates.length)];
        chosen.setSpore(spore);
        pore.setSpore(null);
      }
    }
  }
}
