import { SimulationWorld } from '../dist/engine/SimulationWorld.js';
import { HexCoord3D } from '../dist/core/spatial/HexCoord3D.js';
import { PoreState } from '../dist/core/domain/Pore.js';

console.log('====================================================');
console.log('🚀 Running 1,000-Tick Headless Simulation Benchmark');
console.log('====================================================\n');

const startTime = Date.now();

// Instantiate with exact parameters from main.ts
const world = new SimulationWorld({
  radius: 5,
  minZ: -1,
  maxZ: 4,
  soupDensity: 0.25,
  basaltDensity: 0.15,
  terrainRoughness: 0.35,
  seed: 42
});

const stats = {
  totalPredationEvents: 0,
  totalScavengeEvents: 0,
  totalVentFeeds: 0,
  totalStreamingEvents: 0,
  totalApoptosisEvents: 0,
  environmentalShocks: [],
  milestonesLogged: [],
  historyAtIntervals: []
};

let lastActiveShock = null;

for (let tick = 1; tick <= 1000; tick++) {
  world.step();

  const tele = world.exportTelemetry();
  const recorder = world.getKinematicsRecorder();
  const currentFrame = recorder.getCurrentFrame();

  // Aggregate trophic events
  if (tele.predationEvents && tele.predationEvents.length > 0) {
    stats.totalPredationEvents += tele.predationEvents.length;
  }
  if (tele.scavengeEvents && tele.scavengeEvents.length > 0) {
    stats.totalScavengeEvents += tele.scavengeEvents.length;
  }
  if (currentFrame && currentFrame.trophicRays) {
    const ventFeeds = currentFrame.trophicRays.filter(r => r.type === 'vent_feed').length;
    stats.totalVentFeeds += ventFeeds;
  }
  if (currentFrame && currentFrame.streamingChevrons) {
    stats.totalStreamingEvents += currentFrame.streamingChevrons.length;
  }
  if (currentFrame && currentFrame.apoptosisHalos) {
    stats.totalApoptosisEvents += currentFrame.apoptosisHalos.length;
  }

  // Check environmental shocks
  if (currentFrame && currentFrame.environmentalEvent) {
    if (currentFrame.environmentalEvent !== lastActiveShock) {
      stats.environmentalShocks.push({
        tick,
        event: currentFrame.environmentalEvent
      });
      lastActiveShock = currentFrame.environmentalEvent;
    }
  } else {
    lastActiveShock = null;
  }

  // Periodic snapshots
  if (tick === 100 || tick === 250 || tick === 500 || tick === 750 || tick === 1000) {
    const occupiedPores = tele.pores.filter(p => p.state === PoreState.OCCUPIED);
    const carcasses = tele.pores.filter(p => p.state === PoreState.CARCASS);
    const spores = tele.pores.filter(p => p.hasSpore);
    const bodies = currentFrame ? currentFrame.bodies : [];
    const differentiated = bodies.filter(b => b.isMulticellularDifferentiated);
    const clonal = bodies.filter(b => b.isClonalColony);
    const solitary = bodies.filter(b => !b.isMulticellularDifferentiated && !b.isClonalColony);

    stats.historyAtIntervals.push({
      tick,
      occupiedCells: occupiedPores.length,
      carcasses: carcasses.length,
      spores: spores.length,
      activeClades: tele.activeCladesCount,
      shannonDiversity: tele.shannonDiversity.toFixed(3),
      totalBodies: bodies.length,
      differentiatedBodies: differentiated.length,
      clonalBodies: clonal.length,
      solitaryBodies: solitary.length,
      environmentalEvent: currentFrame ? currentFrame.environmentalEvent : null
    });
  }
}

const elapsedMs = Date.now() - startTime;
const tele1000 = world.exportTelemetry();
const recorder1000 = world.getKinematicsRecorder();
const frame1000 = recorder1000.getCurrentFrame();
const paleontologist = world.getPaleontologist();
const flightRecorder = paleontologist.getFlightRecorder();

console.log(`Simulation completed 1,000 ticks in ${elapsedMs}ms (${(1000 / (elapsedMs / 1000)).toFixed(1)} ticks/sec)`);
console.log('\n--- POPULATION & PHYLOGENY AT TICK 1,000 ---');
const occupied1000 = tele1000.pores.filter(p => p.state === PoreState.OCCUPIED);
const carcasses1000 = tele1000.pores.filter(p => p.state === PoreState.CARCASS);
const spores1000 = tele1000.pores.filter(p => p.hasSpore);

console.log(`Occupied Living Cells: ${occupied1000.length}`);
console.log(`Carcass Detritus Pores: ${carcasses1000.length}`);
console.log(`Pelagic Spores: ${spores1000.length}`);
console.log(`Active Clades Count: ${tele1000.activeCladesCount}`);
console.log(`Shannon Diversity: ${tele1000.shannonDiversity.toFixed(4)}`);
console.log(`Flight Recorder Node Count (Total Historical Births): ${flightRecorder.size()}`);

console.log('\n--- MACRO-ORGANISMS & COLONIES AT TICK 1,000 ---');
const bodies1000 = frame1000 ? frame1000.bodies : [];
const diff1000 = bodies1000.filter(b => b.isMulticellularDifferentiated);
const clonal1000 = bodies1000.filter(b => b.isClonalColony);
const sol1000 = bodies1000.filter(b => !b.isMulticellularDifferentiated && !b.isClonalColony);

console.log(`Total Macro-Bodies: ${bodies1000.length}`);
console.log(`  - Differentiated Multicellular Organisms: ${diff1000.length}`);
console.log(`  - Clonal Colonies (Isogenic aggregates): ${clonal1000.length}`);
console.log(`  - Solitary Cells: ${sol1000.length}`);

// Behaviors
const behaviorCounts = {};
for (const b of bodies1000) {
  behaviorCounts[b.behavior] = (behaviorCounts[b.behavior] || 0) + 1;
}
console.log('Kinematic Behaviors at Tick 1,000:', behaviorCounts);

// Organism details
console.log('\nDetailed Breakdown of Top Organisms:');
bodies1000.slice(0, 10).forEach((b, idx) => {
  const roles = b.cells.map(c => c.roleName);
  const roleSet = [...new Set(roles)];
  console.log(`  [${idx + 1}] ID=${b.bodyId} (${b.speciesName}), Clade=${b.cladeId}, Type=${b.isMulticellularDifferentiated ? 'MULTICELLULAR' : (b.isClonalColony ? 'CLONAL' : 'SOLITARY')}, Pores=${b.cells.length}, Speed=${b.speed.toFixed(3)}, Behavior=${b.behavior}, Roles=[${roleSet.join(', ')}]`);
});

console.log('\n--- TROPHIC & KINEMATIC EVENT TOTALS (Ticks 1-1,000) ---');
console.log(`Total Predation Events: ${stats.totalPredationEvents}`);
console.log(`Total Scavenge Events: ${stats.totalScavengeEvents}`);
console.log(`Total Vent Influx Feeding Events: ${stats.totalVentFeeds}`);
console.log(`Total Treadmilling Streaming Events: ${stats.totalStreamingEvents}`);
console.log(`Total Trailing Apoptosis Events: ${stats.totalApoptosisEvents}`);

console.log('\n--- ENVIRONMENTAL SHOCKS OCCURRED ---');
console.log(`Total Shock Episodes Triggered: ${stats.environmentalShocks.length}`);
stats.environmentalShocks.forEach(s => {
  console.log(`  Tick ${s.tick}: ${s.event}`);
});

console.log('\n--- POPULATION TRAJECTORY AT INTERVALS ---');
console.table(stats.historyAtIntervals);

// Paleontology Milestones
console.log('\n--- PALEONTOLOGICAL MILESTONES DISCOVERED ---');
const milestones = paleontologist.getMilestones();
console.log(`Total Milestones: ${milestones.length}`);
milestones.forEach(m => {
  console.log(`  Tick ${m.tick}: [${m.origin}] ${m.motif.name} (Type: ${m.motif.type}) - WL: ${m.wlHash.slice(0, 8)}...`);
});

// Deep Inspection of Multicellular Bodies at Tick 1,000
console.log('\n--- DEEP MULTICELLULAR BODY INSPECTION AT TICK 1,000 ---');
diff1000.forEach((body, i) => {
  console.log(`\nMulticellular Body #${i+1} [${body.bodyId}]:`);
  console.log(`  Species: ${body.speciesName}, Clade: ${body.cladeId}, Topology: ${body.bodyTopology}, Centroid: (${body.centroid.x.toFixed(1)}, ${body.centroid.y.toFixed(1)}, ${body.centroid.z.toFixed(1)}), Speed: ${body.speed.toFixed(3)}, Behavior: ${body.behavior}`);
  console.log(`  Cells (${body.cells.length} pores):`);
  body.cells.forEach((c, ci) => {
    const opStates = c.operonStates.map((s, si) => `O${si}:${s ? 'ON' : 'OFF'}`).join(' ');
    console.log(`    Cell ${ci+1} at (${c.coord.q},${c.coord.r},${c.coord.z}): ${c.roleGlyph} ${c.roleName} | E=${c.energy.toFixed(1)}mV, M=${c.matter.toFixed(1)} | Gates=[${c.gateTypes.join(',')}] | PrimaryActive=${c.primaryActive} | Operons=[${opStates}]`);
  });
});

// Deep Inspection of Clonal Colonies at Tick 1,000
console.log('\n--- CLONAL COLONY INSPECTION AT TICK 1,000 ---');
clonal1000.forEach((body, i) => {
  console.log(`  Clonal Colony #${i+1} [${body.bodyId}]: Pores=${body.cells.length}, Speed=${body.speed.toFixed(3)}, Behavior=${body.behavior}, Clade=${body.cladeId}`);
});

// Evolutionary Flight Recorder Lineage Trajectory Analysis
console.log('\n--- EVOLUTIONARY FLIGHT RECORDER PHYLOGENETIC AUDIT ---');
const livingPoresWithResident = world.getAllPores().filter(p => p.getState() === PoreState.OCCUPIED && p.getResident());
const sampleResidents = livingPoresWithResident.slice(0, 5).map(p => p.getResident());
sampleResidents.forEach((res, i) => {
  const orgId = res.getId();
  const lineage = flightRecorder.traceAncestry(orgId);
  const hamming = flightRecorder.calculateHammingTrajectory(orgId);
  console.log(`  Resident ${i+1} (${orgId}, Clade: ${res.getCladeId()}, Gen: ${res.getGeneration()}): Ancestry Depth=${lineage.length}, Cumulative Hamming Steps=[${hamming.slice(-5).join(', ')}]`);
});

// Homology vs Homoplasy analysis between two living clades if available
if (sampleResidents.length >= 2) {
  const idA = sampleResidents[0].getId();
  const idB = sampleResidents[sampleResidents.length - 1].getId();
  const lca = flightRecorder.findLeastCommonAncestor(idA, idB);
  console.log(`  Phylogenetic LCA check between ${idA} and ${idB}: LCA=${lca ? lca.id + ' (Gen ' + lca.generation + ' at Tick ' + lca.birthTick + ')' : 'NONE (Independent De Novo Lineages)'}`);
}

// JSON output summary for report embedding
const benchmarkSummary = {
  elapsedMs,
  ticksPerSec: +(1000 / (elapsedMs / 1000)).toFixed(1),
  at1000: {
    occupied: occupied1000.length,
    carcasses: carcasses1000.length,
    spores: spores1000.length,
    clades: tele1000.activeCladesCount,
    shannon: +tele1000.shannonDiversity.toFixed(4),
    flightRecorderNodes: flightRecorder.size(),
    totalBodies: bodies1000.length,
    differentiated: diff1000.length,
    clonal: clonal1000.length,
    solitary: sol1000.length,
    behaviorCounts
  },
  cumulative: {
    predation: stats.totalPredationEvents,
    scavenge: stats.totalScavengeEvents,
    ventFeeds: stats.totalVentFeeds,
    streaming: stats.totalStreamingEvents,
    apoptosis: stats.totalApoptosisEvents,
    shockEpisodes: stats.environmentalShocks.length
  },
  shocks: stats.environmentalShocks,
  intervals: stats.historyAtIntervals,
  milestones: milestones.map(m => ({
    tick: m.tick,
    origin: m.origin,
    name: m.motif.name,
    type: m.motif.type,
    wlHash: m.wlHash
  }))
};

console.log('\nSUMMARY_JSON_START');
console.log(JSON.stringify(benchmarkSummary, null, 2));
console.log('SUMMARY_JSON_END');

