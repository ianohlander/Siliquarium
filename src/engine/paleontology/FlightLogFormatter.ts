/**
 * 🐠 Siliquarium Paleontology Subsystem
 * FlightLogFormatter: Serializes evolutionary time-series, censuses, and milestones into JSON and CSV.
 */

import { SimulationWorld } from '../SimulationWorld.js';
import { ISimulationTelemetry } from '../SimulationTelemetry.js';
import { PoreState } from '../../core/domain/Pore.js';
import { TaxonomyNomenclature } from '../../core/paleontology/TaxonomyNomenclature.js';
import { EvolutionaryBarrierAuditor } from './EvolutionaryBarrierAuditor.js';
import { IEpochSample, IEvolutionaryFlightLog } from './EvolutionaryHistoryExporter.js';

export class FlightLogFormatter {
  public static toJSON(
    world: SimulationWorld,
    telemetry: ISimulationTelemetry,
    samples: readonly IEpochSample[]
  ): string {
    const diagnostics = EvolutionaryBarrierAuditor.auditBarriers(world, telemetry);
    const occupied = telemetry.pores.filter(p => p.state === PoreState.OCCUPIED);

    const cladesData = (telemetry.clades ?? []).map(c => {
      const taxon = TaxonomyNomenclature.classify({ generation: c.maxGeneration });
      return {
        cladeId: c.cladeId,
        population: c.population,
        maxGeneration: c.maxGeneration,
        averageEnergy: c.averageEnergy,
        taxonName: taxon.binomialName,
        color: c.color
      };
    });

    const milestonesData = world.getPaleontologist().getMilestones().map(m => ({
      id: m.id,
      tick: m.tick,
      motifName: m.motif.name,
      biologicalCognate: m.motif.biologicalCognate,
      wlHash: m.wlHash,
      origin: m.origin,
      coord: { q: m.poreCoord.q, r: m.poreCoord.r, z: m.poreCoord.z }
    }));

    const currentCensus = occupied.map(p => {
      const taxon = TaxonomyNomenclature.classify({
        tapeBitstring: p.tapeBitstring,
        gateTypes: p.gateTypes,
        generation: p.generation,
        isBasalt: p.isBasalt,
        hasOrganelle: p.hasOrganelle,
        isSyncytium: p.isSyncytium
      });

      return {
        coord: { q: p.coord.q, r: p.coord.r, z: p.coord.z },
        cellId: p.id,
        cladeId: p.cladeId,
        syncytiumId: p.syncytiumId,
        syncytiumSize: p.syncytiumMemberCount,
        generation: p.generation,
        age: p.age,
        energy: p.energy,
        matter: p.matter,
        tapeLength: p.tapeBitstring ? p.tapeBitstring.length : 0,
        gateCount: p.gateCount,
        gateTypes: p.gateTypes,
        taxon: `${taxon.binomialName} (${taxon.commonName})`,
        hasOrganelle: p.hasOrganelle ?? false,
        catalyticYield: p.catalyticYield,
        toggleCount: p.toggleCount
      };
    });

    const flightLog: IEvolutionaryFlightLog = {
      metadata: {
        exportTimestamp: new Date().toISOString(),
        simulationTick: telemetry.tick,
        maxGeneration: telemetry.maxGeneration,
        softwareVersion: 'Siliquarium 0.1.0',
        totalEpochsSampled: samples.length,
        runSummary: `Epoch Tick ${telemetry.tick.toLocaleString()} | Gen ${telemetry.maxGeneration} | ${telemetry.livingCount} Living Cells | ${telemetry.activeCladesCount} Clades (H=${telemetry.shannonDiversity})`
      },
      diagnostics,
      timeSeries: samples,
      milestones: milestonesData,
      clades: cladesData,
      currentCensus
    };

    return JSON.stringify(flightLog, null, 2);
  }

  public static toCSV(samples: readonly IEpochSample[]): string {
    const headers = [
      'tick',
      'maxGeneration',
      'livingCount',
      'sporeCount',
      'carcassCount',
      'activeCladesCount',
      'shannonDiversity',
      'totalBirths',
      'totalDeaths',
      'evolutionaryVelocity',
      'meanTapeLength',
      'maxTapeLength',
      'meanGateCount',
      'maxGateCount',
      'syncytialColonyCount',
      'maxSyncytialColonySize',
      'totalEnergyInUniverse',
      'dominantTaxon'
    ];

    const rows = samples.map(s => [
      s.tick,
      s.maxGeneration,
      s.livingCount,
      s.sporeCount,
      s.carcassCount,
      s.activeCladesCount,
      s.shannonDiversity,
      s.totalBirths,
      s.totalDeaths,
      s.evolutionaryVelocity,
      s.meanTapeLength,
      s.maxTapeLength,
      s.meanGateCount,
      s.maxGateCount,
      s.syncytialColonyCount,
      s.maxSyncytialColonySize,
      s.totalEnergyInUniverse,
      `"${s.dominantTaxon.replace(/"/g, '""')}"`
    ].join(','));

    return [headers.join(','), ...rows].join('\n');
  }
}
