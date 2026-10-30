/**
 * 🐠 Siliquarium Ecology Subsystem
 * ScavengingEngine: Manages natural senescence turnover, detrital necromass deposition, and catabolic scavenging.
 */

import { HexCoord3D } from '../../core/spatial/HexCoord3D.js';
import { Pore, PoreState } from '../../core/domain/Pore.js';
import { ThermodynamicLedger } from '../../core/physics/ThermodynamicLedger.js';
import { IPrng } from '../../core/prng/SeedablePrng.js';
import { LteeBenchmark } from '../paleontology/LteeBenchmark.js';

export interface IScavengeEvent {
  readonly scavengerCoord: HexCoord3D;
  readonly carcassCoord: HexCoord3D;
  readonly energyHarvested: number;
}

export interface IScavengingStepContext {
  readonly pores: readonly Pore[];
  readonly poreMap: Map<string, Pore>;
  readonly ledger: ThermodynamicLedger;
  readonly ltee: LteeBenchmark;
  readonly prng: IPrng;
  readonly activeScavengeEvents: IScavengeEvent[];
}

export class ScavengingEngine {
  public static step(ctx: IScavengingStepContext): void {
    const { pores, poreMap, ledger, ltee, prng, activeScavengeEvents } = ctx;

    // 1. Natural Senescence Turnover
    for (const pore of pores) {
      const cell = pore.getResident();
      if (!cell) continue;

      const age = cell.getAge();
      const isSenescent = age >= 250 || (age >= 120 && prng.nextFloat() < (age - 100) / 4000);
      const isDead = cell.isDead() || isSenescent;

      if (isDead) {
        const snap = cell.getBattery().getSnapshot();
        ledger.recordHeatDissipation(snap.energy - Math.floor(snap.energy * 0.5));
        ltee.recordDeath();
        pore.triggerLysis();
      }
    }

    // 2. Active Scavenging
    for (const pore of pores) {
      const cell = pore.getResident();
      if (!cell) continue;

      const carcasses = pore.coord.getNeighbors3D().map(c => poreMap.get(c.toKey()))
        .filter((p): p is Pore => p !== undefined && p.getState() === PoreState.CARCASS);

      if (carcasses.length > 0) {
        const targetCarcass = carcasses[0];
        const isCatabolicScavenger = cell.getWorkshop().hasActiveNonConjunctiveCatalysis();

        if (isCatabolicScavenger) {
          const unharvested = targetCarcass.scavenge(cell);
          if (unharvested > 0) ledger.recordHeatDissipation(unharvested);
          activeScavengeEvents.push({
            scavengerCoord: pore.coord,
            carcassCoord: targetCarcass.coord,
            energyHarvested: 20
          });
        } else {
          const cData = targetCarcass.getCarcass();
          if (cData) {
            const partialEnergy = Math.floor(cData[0] * 0.35);
            const wastedEnergy = cData[0] - partialEnergy;
            const charged = cell.getBattery().chargeEnergy(partialEnergy);
            ledger.recordHeatDissipation(wastedEnergy + (partialEnergy - charged));

            const partialMatter = Math.floor(cData[1] * 0.5);
            cell.getBattery().addMatter(partialMatter);
            ledger.recordMatterSedimentation(cData[1] - partialMatter);

            activeScavengeEvents.push({
              scavengerCoord: pore.coord,
              carcassCoord: targetCarcass.coord,
              energyHarvested: partialEnergy
            });

            targetCarcass.clearCarcass();
          }
        }
      }
    }
  }
}
