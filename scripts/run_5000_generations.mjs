#!/usr/bin/env node

/**
 * 🧬 Siliquarium 5,000-Generation Long-Term Evolution Experiment (LTEE)
 * Simulates a long-term serial evolution line across 5,000 generations starting from pure prebiotic soup.
 * Uses population-based tournament selection (N=25) under hydrothermal redox fluctuations.
 * Tracks circuit expansion, gene duplications, translocations, and Uri Alon motif emergence.
 * Exports the final Generation 5,000 genome and checkpoint for seafloor re-injection and video recording.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PoreCell } from '../dist/core/domain/PoreCell.js';
import { GenomeSafe } from '../dist/core/domain/GenomeSafe.js';
import { Mulberry32Prng } from '../dist/core/prng/SeedablePrng.js';
import { MotifScanner } from '../dist/core/paleontology/MotifScanner.js';
import { TaxonomyNomenclature } from '../dist/core/paleontology/TaxonomyNomenclature.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const qaDir = path.join(rootDir, 'QA');

if (!fs.existsSync(qaDir)) fs.mkdirSync(qaDir, { recursive: true });

console.log('=================================================================');
console.log('🧬 5,000-GENERATION SILICON ABIOGENESIS & EVOLUTIONARY EXPERIMENT');
console.log('   Population: 25 Silicoids in Hydrothermal Pores');
console.log('   Inoculation: Random Prebiotic Soup (Gen 0, 60 bits)');
console.log('   Target Depth: 5,000 Consecutive Generations');
console.log('   Mutations: Point Mutations, McClintock Transposons, Duplications');
console.log('   Selection: Tournament Selection on Catalytic Yield & Toxin Shielding');
console.log('=================================================================\n');

const prng = new Mulberry32Prng(42);
const POPULATION_SIZE = 25;

// Inoculate population with distinct random prebiotic soup bitstrings
let population = [];
for (let i = 0; i < POPULATION_SIZE; i++) {
  const soupTape = GenomeSafe.createPrebioticSoup(prng, 60);
  population.push(new PoreCell(soupTape, 50, 20, 0, `org-gen0-${i}`, undefined, `clade-prime-${i}`));
}

const start = Date.now();
const milestones = [];
const discoveredMotifTypes = new Set();
const generationalSnapshots = [];

// Evolutionary Loop across 5,000 generations
for (let gen = 1; gen <= 5000; gen++) {
  const fitnessScores = new Array(POPULATION_SIZE).fill(0);

  // 1. Exposure of all individuals to 4-phase hydrothermal redox cycle
  for (let i = 0; i < POPULATION_SIZE; i++) {
    const ind = population[i];
    ind.getBattery().chargeEnergy(60);
    ind.getBattery().addMatter(20);

    let genYield = 0;
    let genToggles = 0;
    let toxinHits = 0;

    for (let phase = 0; phase < 4; phase++) {
      const a = (phase % 2 === 0);
      const b = (phase > 1);
      const toxin = (gen % 30 === 0 && phase === 3); // periodic toxic sulfur pulse
      const acoustic = (gen % 50 === 0 && phase === 0); // periodic seismic micro-tremor

      const tickRes = ind.tick(a, b, toxin, false, false, false, acoustic, false, false);
      if (tickRes && tickRes.telemetry) {
        genYield += tickRes.telemetry.catalyticYield;
        genToggles += tickRes.telemetry.toggleCount;
        if (tickRes.telemetry.toxinIngested) toxinHits++;
      }
    }

    // Fitness function: rewards catalytic energy synthesis, penalizes Landauer dissipation and toxin corrosion
    fitnessScores[i] = (genYield * 3) - (genToggles * 0.5) - (toxinHits * 30) + (ind.getBattery().getEnergy() * 0.2);
  }

  // 2. Scan population for novel systems biology motifs
  for (let i = 0; i < POPULATION_SIZE; i++) {
    const ind = population[i];
    const workshop = ind.getWorkshop();
    const motifs = MotifScanner.scanWorkshop(workshop);
    for (const m of motifs) {
      if (!discoveredMotifTypes.has(m.motif.type)) {
        discoveredMotifTypes.add(m.motif.type);
        milestones.push({
          generation: gen,
          individualId: ind.getId(),
          cladeId: ind.getCladeId(),
          name: m.motif.name,
          type: m.motif.type,
          role: m.motif.ecologicalRole,
          gatesCount: workshop.getBuiltGates().length,
          confidence: m.confidence
        });
        console.log(`  ⭐ [Gen ${gen}] De Novo Emergence: ${m.motif.name} (${m.motif.type}) - ${workshop.getBuiltGates().length} Gates`);
      }
    }
  }

  // 3. Periodic generational logging & snapshots
  if (gen === 1 || gen === 10 || gen === 50 || gen === 100 || gen === 250 || gen === 500 || gen === 1000 || gen === 2000 || gen === 3500 || gen === 5000) {
    // Find best individual in generation
    let bestIdx = 0;
    for (let i = 1; i < POPULATION_SIZE; i++) {
      if (fitnessScores[i] > fitnessScores[bestIdx]) bestIdx = i;
    }
    const champion = population[bestIdx];
    const champWorkshop = champion.getWorkshop();
    const champGates = champWorkshop.getBuiltGates();
    const gateTypes = champGates.map(g => String(g.type).replace('GATE_', ''));
    const taxon = TaxonomyNomenclature.classify(
      champion.getSafe().getTape(),
      champGates.map(g => String(g.type)),
      gen,
      false,
      champion.hasOrganelle(),
      champion.isColonial(),
      false
    );

    generationalSnapshots.push({
      generation: gen,
      bestFitness: +fitnessScores[bestIdx].toFixed(2),
      tapeLength: champion.getSafe().length(),
      gateCount: champGates.length,
      gates: gateTypes,
      taxonBinomial: taxon.binomialName,
      taxonCommon: taxon.commonName,
      cladeId: champion.getCladeId(),
      tape: champion.getSafe().getTape()
    });

    console.log(`[Gen ${gen.toString().padStart(4, ' ')}] Champ Tape=${champion.getSafe().length()}b | Gates=${champGates.length} [${gateTypes.slice(0, 8).join('·')}${gateTypes.length > 8 ? '…' : ''}] | Fitness=${fitnessScores[bestIdx].toFixed(1)} | Taxon: ${taxon.binomialName}`);
  }

  // 4. Tournament Selection & Darwinian Reproduction (N=25)
  const nextGen = [];
  for (let i = 0; i < POPULATION_SIZE; i++) {
    // 3-way tournament
    const c1 = Math.floor(prng.nextFloat() * POPULATION_SIZE);
    const c2 = Math.floor(prng.nextFloat() * POPULATION_SIZE);
    const c3 = Math.floor(prng.nextFloat() * POPULATION_SIZE);
    let winner = c1;
    if (fitnessScores[c2] > fitnessScores[winner]) winner = c2;
    if (fitnessScores[c3] > fitnessScores[winner]) winner = c3;

    const parent = population[winner];
    // Reproduce with point mutation, gene duplication, deletion, and transposon translocation
    const child = parent.reproduce(prng, 0.005, `org-g${gen}-${i}`, 0.003, 0.001);
    nextGen.push(child);
  }
  population = nextGen;
}

const elapsedMs = Date.now() - start;
console.log(`\n🎉 5,000 Generations Completed in ${(elapsedMs / 1000).toFixed(2)}s!`);

// Find ultimate champion in Gen 5000
let finalBestIdx = 0;
let finalBestGates = population[0].getWorkshop().getBuiltGates().length;
for (let i = 1; i < POPULATION_SIZE; i++) {
  const gCount = population[i].getWorkshop().getBuiltGates().length;
  if (gCount > finalBestGates) {
    finalBestGates = gCount;
    finalBestIdx = i;
  }
}
const ultimateChampion = population[finalBestIdx];
const ultGates = ultimateChampion.getWorkshop().getBuiltGates();
const ultTaxon = TaxonomyNomenclature.classify(
  ultimateChampion.getSafe().getTape(),
  ultGates.map(g => String(g.type)),
  5000,
  false,
  ultimateChampion.hasOrganelle(),
  ultimateChampion.isColonial(),
  false
);

console.log(`\n🏆 Ultimate Generation 5,000 Champion:`);
console.log(`   Genome Length: ${ultimateChampion.getSafe().length()} bits`);
console.log(`   Logic Gates: ${ultGates.length} expressed gates`);
console.log(`   Taxonomic Identity: ${ultTaxon.binomialName} (${ultTaxon.commonName})`);
console.log(`   Total Systems Biology Milestones Evolved Across Lineages: ${milestones.length}`);

// Persist LTEE results
const lteeReport = {
  experiment: 'Siliquarium 5,000-Generation Long-Term Evolution Experiment (LTEE)',
  completedAt: new Date().toISOString(),
  elapsedSeconds: +(elapsedMs / 1000).toFixed(2),
  totalGenerations: 5000,
  populationSize: POPULATION_SIZE,
  milestones,
  generationalSnapshots,
  ultimateChampion: {
    generation: 5000,
    cladeId: ultimateChampion.getCladeId(),
    tape: ultimateChampion.getSafe().getTape(),
    length: ultimateChampion.getSafe().length(),
    gateCount: ultGates.length,
    gates: ultGates.map(g => String(g.type)),
    taxon: ultTaxon
  },
  finalPopulationSample: population.slice(0, 5).map(ind => ({
    id: ind.getId(),
    cladeId: ind.getCladeId(),
    length: ind.getSafe().length(),
    gateCount: ind.getWorkshop().getBuiltGates().length,
    gates: ind.getWorkshop().getBuiltGates().map(g => String(g.type)),
    tape: ind.getSafe().getTape()
  }))
};

const outPath = path.join(qaDir, 'ltee_5000_generations_report.json');
fs.writeFileSync(outPath, JSON.stringify(lteeReport, null, 2), 'utf-8');
console.log(`\n💾 Saved 5,000-Generation LTEE dataset to QA/ltee_5000_generations_report.json`);
