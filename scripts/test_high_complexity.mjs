import { SimulationWorld } from '../dist/engine/SimulationWorld.js';
import { PoreState } from '../dist/core/domain/Pore.js';

const world = new SimulationWorld({
  radius: 6,
  minZ: -1,
  maxZ: 4,
  soupDensity: 0.35,
  basaltDensity: 0.15,
  terrainRoughness: 0.35,
  mutationRate: 0.008,
  duplicationRate: 0.005,
  deletionRate: 0.002,
  seed: 999
});

console.log('Testing accelerated evolutionary radiation with gene duplication and translocations...');
const start = Date.now();
for (let t = 1; t <= 5000; t++) {
  world.step();
  if (t % 1000 === 0) {
    const living = world.getAllPores().filter(p => p.getState() === PoreState.OCCUPIED && p.getResident());
    const maxGen = living.length > 0 ? Math.max(...living.map(p => p.getResident().getGeneration())) : 0;
    const gateCounts = living.map(p => p.getResident().getWorkshop().getBuiltGates().length);
    const maxGates = living.length > 0 ? Math.max(...gateCounts) : 0;
    const avgGates = living.length > 0 ? (gateCounts.reduce((a,b)=>a+b,0)/living.length).toFixed(2) : 0;
    console.log(`Tick ${t} (${Date.now() - start}ms): Living=${living.length}, MaxGen=${maxGen}, MaxGates=${maxGates}, AvgGates=${avgGates}`);
  }
}

const milestones = world.getPaleontologist().getMilestones();
console.log(`\nDiscovered ${milestones.length} distinct Uri Alon Systems Biology milestones:`);
milestones.forEach(m => console.log(`  [Tick ${m.tick}] ${m.motif.name} (${m.motif.type}) - Origin: ${m.origin}`));
