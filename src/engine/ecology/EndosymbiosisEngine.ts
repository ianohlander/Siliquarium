/**
 * 🐠 Siliquarium Ecology Subsystem
 * EndosymbiosisEngine: Manages horizontal gene transfer, syntrophic mutualism, and rare chimeric symbiogenesis.
 */

import { HexCoord3D } from '../../core/spatial/HexCoord3D.js';
import { Pore } from '../../core/domain/Pore.js';
import { PoreState } from '../../core/domain/Pore.js';
import { GenomeSafe } from '../../core/domain/GenomeSafe.js';
import { IPrng } from '../../core/prng/SeedablePrng.js';

export interface IEndosymbiosisEvent {
  readonly coordA: HexCoord3D;
  readonly coordB: HexCoord3D;
  readonly chimericCladeId: string;
}

export interface IEndosymbiosisStepContext {
  readonly pores: readonly Pore[];
  readonly prng: IPrng;
  readonly activeEndosymbiosisEvents: IEndosymbiosisEvent[];
}

export class EndosymbiosisEngine {
  public static step(ctx: IEndosymbiosisStepContext): void {
    const { pores, prng, activeEndosymbiosisEvents } = ctx;
    const processedPairs = new Set<string>();

    for (const pore of pores) {
      const cellA = pore.getResident();
      if (!cellA || cellA.getAge() < 25 || cellA.getGeneration() < 12) continue;

      const neighbors = pore.getNeighbors().filter(p => p.getState() === PoreState.OCCUPIED);

      for (const neighborPore of neighbors) {
        const cellB = neighborPore.getResident();
        if (!cellB || cellB.getAge() < 25 || cellB.getGeneration() < 12) continue;

        // If either cell already has an organelle, they cannot undergo endosymbiosis again
        if (cellA.hasOrganelle() || cellB.hasOrganelle()) continue;

        // Must be distinct clades that have genuinely diverged genetically (>= 8 bit Hamming difference)
        const isDistinctClade = cellA.getCladeId() !== cellB.getCladeId();
        const tapeA = cellA.getSafe().getTape();
        const tapeB = cellB.getSafe().getTape();
        let diff = Math.abs(tapeA.length - tapeB.length);
        const minLen = Math.min(tapeA.length, tapeB.length);
        for (let i = 0; i < minLen; i++) {
          if (tapeA.charAt(i) !== tapeB.charAt(i)) diff++;
        }
        if (!isDistinctClade || diff < 8) continue;

        const pairKey = pore.coord.toKey() < neighborPore.coord.toKey()
          ? `${pore.coord.toKey()}|${neighborPore.coord.toKey()}`
          : `${neighborPore.coord.toKey()}|${pore.coord.toKey()}`;
        if (processedPairs.has(pairKey)) continue;
        processedPairs.add(pairKey);

        const snapA = cellA.getBattery().getSnapshot();
        const snapB = cellB.getBattery().getSnapshot();

        // Symbiosis trigger: Both healthy and established
        if (snapA.energy < 60 || snapB.energy < 60) continue;

        // STRICT Syntrophic Complementarity (Lane & Martin 2010; Sagan 1967):
        const wsA = cellA.getWorkshop();
        const wsB = cellB.getWorkshop();

        if (wsA.getBuiltGates().length === 0 || wsB.getBuiltGates().length === 0) continue;

        const aHasProcessing = wsA.hasForwardProcessingCapability();
        const bHasProcessing = wsB.hasForwardProcessingCapability();
        const aHasRegulation = wsA.hasAllostericRegulationCapability();
        const bHasRegulation = wsB.hasAllostericRegulationCapability();

        const isSyntrophic = (aHasProcessing && !aHasRegulation && bHasRegulation && !bHasProcessing) ||
                             (bHasProcessing && !bHasRegulation && aHasRegulation && !aHasProcessing);

        if (!isSyntrophic) {
          // Bacterial Conjugation / Horizontal Gene Transfer (Lederberg & Tatum 1946)
          if (prng.nextFloat() < 0.0005) {
            const conjugatedSafe = GenomeSafe.crossoverModulo6(cellA.getSafe(), cellB.getSafe(), prng);
            cellA.adoptChimericGenome(conjugatedSafe, cellA.getCladeId());
          }
          continue;
        }

        // Rare Major Evolutionary Transition (Szathmáry & Maynard Smith 1995)
        if (prng.nextFloat() < 0.001) {
          const donorSafeA = cellA.getSafe();
          const donorSafeB = cellB.getSafe();
          const chimericSafe = GenomeSafe.createChimeric(donorSafeA, donorSafeB);
          const chimericCladeId = `chimeric-${cellA.getCladeId().slice(-4)}-${cellB.getCladeId().slice(-4)}`;

          // Equalize battery reserves across the pair (strictly Delta E = 0)
          const totalEnergy = snapA.energy + snapB.energy;
          const halfE_A = Math.floor(totalEnergy / 2);
          const halfE_B = totalEnergy - halfE_A;

          cellA.getBattery().drainEnergy(snapA.energy);
          cellA.getBattery().chargeEnergy(halfE_A);
          cellB.getBattery().drainEnergy(snapB.energy);
          cellB.getBattery().chargeEnergy(halfE_B);

          // Adopt fused genome and install mutual partner donor organelle cassette
          cellA.adoptChimericGenome(chimericSafe, chimericCladeId);
          cellB.adoptChimericGenome(chimericSafe, chimericCladeId);
          cellA.installOrganelle(donorSafeB);
          cellB.installOrganelle(donorSafeA);

          activeEndosymbiosisEvents.push({
            coordA: pore.coord,
            coordB: neighborPore.coord,
            chimericCladeId
          });
          break;
        }
      }
    }
  }
}
