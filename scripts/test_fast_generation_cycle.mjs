import { SimulationWorld } from '../dist/engine/SimulationWorld.js';
import { PoreState } from '../dist/core/domain/Pore.js';
import { GenomeSafe } from '../dist/core/genome/GenomeSafe.js';

// Create simulation world
const world = new SimulationWorld({
  radius: 5,
  minZ: -1,
  maxZ: 4,
  soupDensity: 0.35,
  basaltDensity: 0.15,
  terrainRoughness: 0.35,
  mutationRate: 0.008,
  duplicationRate: 0.005,
  deletionRate: 0.002,
  seed: 777
});

console.log('Testing fast-turnover generation cycling...');
const start = Date.now();

// Track max generation
let maxGen = 0;
let tick = 0;

while (maxGen < 5000 && tick < 300000) {
  tick++;
  world.step();

  // Every 50 ticks, check generation
  if (tick % 50 === 0) {
    const living = world.getAllPores().filter(p => p.getState() === PoreState.OCCUPIED && p.getResident());
    if (living.length === 0) {
      // Re-seed if extinct
      world.seedPrimordialSoup(0.3);
    } else {
      const currentMaxGen = Math.max(...living.map(p => p.getResident().getGeneration()));
      if (currentMaxGen > maxGen) {
        maxGen = currentMaxGen;
      }
    }
  }

  if (tick % 1000 === 0) {
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`Tick ${tick} (${elapsed}s) -> Max Generation: ${maxGen}`);
    if (Date.now() - start > 45000) {
      console.log('Time limit reached for test.');
      break;
    }
  }
}

console.log(`Final Test Result: Max Generation reached = ${maxGen} in ${tick} ticks`);
