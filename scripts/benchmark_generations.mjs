import { SimulationWorld } from '../dist/engine/SimulationWorld.js';
import { PoreState } from '../dist/core/domain/Pore.js';

const world = new SimulationWorld({
  radius: 5,
  minZ: -1,
  maxZ: 4,
  soupDensity: 0.25,
  basaltDensity: 0.15,
  terrainRoughness: 0.35,
  seed: 42
});

console.log('Testing speed and generational depth with standard ecosystem parameters...');
const start = Date.now();
for (let t = 1; t <= 10000; t++) {
  world.step();
  if (t % 1000 === 0) {
    const living = world.getAllPores().filter(p => p.getState() === PoreState.OCCUPIED && p.getResident());
    const maxGen = living.length > 0 ? Math.max(...living.map(p => p.getResident().getGeneration())) : 0;
    const clades = new Set(living.map(p => p.getResident().getCladeId())).size;
    console.log(`Tick ${t} (${Date.now() - start}ms): Living=${living.length}, Clades=${clades}, MaxGen=${maxGen}`);
  }
}
