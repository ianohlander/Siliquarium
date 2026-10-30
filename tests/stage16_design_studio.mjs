/**
 * 🐠 Siliquarium Test Suite - Stage 16
 * Stage 16: Siliquarium Design Studio & World Builder Verification.
 * Tests Environment Preset Registry, Geomorphology Sculpting (Trenches, Basalt Walls, Vents),
 * Multi-Vent Thermal Plume Physics, Founder Resets, and Epistemic Cut First-Law Invariants.
 */

import assert from 'node:assert';
import {
  HexCoord3D,
  PoreState,
  PoreMedium,
  ThermodynamicLedger,
  VentPhysics
} from '../dist/core/index.js';
import { SimulationWorld } from '../dist/engine/SimulationWorld.js';
import { EnvironmentPresetRegistry } from '../dist/engine/storage/EnvironmentPresetRegistry.js';
import { SeafloorRenderer3D } from '../dist/visualizers/SeafloorRenderer3D.js';
import { OrbitCamera } from '../dist/visualizers/OrbitCamera.js';

export function runStage16() {
  console.log('  Testing Siliquarium Design Studio Subsystems...');

  // 1. Environment Preset Registry
  const registry = EnvironmentPresetRegistry.getInstance();
  const presets = registry.getAll();
  assert(presets.length >= 5, `Expected at least 5 built-in presets, got ${presets.length}`);

  const twinSmokers = registry.getById('twin-smokers');
  assert(twinSmokers, 'Built-in preset "twin-smokers" should exist');
  assert.strictEqual(twinSmokers.grid.radius, 8, 'Twin Smokers should have R=8');
  assert.strictEqual(twinSmokers.grid.vents.length, 2, 'Twin Smokers should have 2 vents');
  assert(twinSmokers.grid.basaltCoords.length > 0, 'Twin Smokers should have central basalt ridge barriers');

  const abyssalTrench = registry.getById('abyssal-trench');
  assert(abyssalTrench, 'Built-in preset "abyssal-trench" should exist');
  assert.strictEqual(abyssalTrench.grid.radius, 10, 'Abyssal Trench should have R=10');
  assert(abyssalTrench.grid.trenchCoords && abyssalTrench.grid.trenchCoords.length > 0, 'Abyssal Trench should have trenchCoords');
  assert.strictEqual(abyssalTrench.grid.minZ, -1, 'Abyssal Trench should have minZ = -1');

  const lenskiChamber = registry.getById('lenski-chamber');
  assert(lenskiChamber, 'Built-in preset "lenski-chamber" should exist');
  assert(lenskiChamber.founderStrains && lenskiChamber.founderStrains.length >= 2, 'Lenski Chamber should have 2 founder strains');

  // JSON Serialization & Schema Invariance
  const exported = registry.exportToJson(twinSmokers);
  assert(typeof exported === 'string' && exported.includes('Twin Smokers Caldera'), 'exportToJson should yield valid JSON with name');
  const imported = registry.importFromJson(exported);
  assert(imported && imported.grid.radius === 8, 'importFromJson should correctly recreate preset');

  // Geodynamics in Preset Serialization & GeologicalEngine Configuration
  const geoPreset = {
    ...twinSmokers,
    id: 'geo-test-caldera',
    name: 'Geodynamics Test Caldera',
    environment: {
      ...twinSmokers.environment,
      eventVolatility: 0.45,
      geodynamics: {
        earthquakeRate: 0.60,
        lavaFlowRate: 0.30,
        chimneySpallingRate: 0.40,
        hydrothermalSurgeRate: 0.50,
        toxicSpikeRate: 0.35,
        tidalCurrentRate: 0.70,
        marineSnowRate: 0.55,
        ventMigrationRate: 0.20,
        cryogenicDownwellingRate: 0.40
      }
    }
  };
  const geoJson = registry.exportToJson(geoPreset);
  const geoImported = registry.importFromJson(geoJson);
  assert(geoImported.environment.geodynamics, 'Imported preset must preserve geodynamics configuration');
  assert.strictEqual(geoImported.environment.geodynamics.earthquakeRate, 0.60, 'Preserved earthquakeRate should be 0.60');

  const geoWorld = new SimulationWorld(5, 0.1, 0.001);
  geoWorld.loadEnvironmentPreset(geoImported);
  const geoConfig = geoWorld.getGeologicalEngine().getConfig();
  assert.strictEqual(geoConfig.masterActivityRate, 0.45, 'GeologicalEngine masterActivityRate must match preset');
  assert.strictEqual(geoConfig.earthquakeRate, 0.60, 'GeologicalEngine earthquakeRate must match preset');
  assert.strictEqual(geoConfig.tidalCurrentRate, 0.70, 'GeologicalEngine tidalCurrentRate must match preset');

  // 2. Geomorphology Engine: World Instantiation & Sculpting
  const world = new SimulationWorld(5, 0.1, 0.001);
  const initialPoreCount = world.getAllPores().length;
  assert(initialPoreCount > 0, 'World should instantiate pores');

  // 2.1 Gouge Trench at (q=2, r=-1)
  const trenchCoord = new HexCoord3D(2, -1, 0);
  const gougeSuccess = world.gougeTrench(trenchCoord);
  assert(gougeSuccess, 'world.gougeTrench should succeed within grid bounds');
  assert.strictEqual(world.getMinZ(), -1, 'World minZ should expand to -1 after gouging trench');

  const trenchFloor = world.getPore(new HexCoord3D(2, -1, -1));
  assert(trenchFloor, 'Trench floor pore at z=-1 should exist');
  assert.strictEqual(trenchFloor.medium, PoreMedium.ROCK_SUBSTRATE, 'Trench floor should be ROCK_SUBSTRATE');
  assert.strictEqual(trenchFloor.isBasalt(), false, 'Trench floor should not be basalt');

  const trenchWater = world.getPore(new HexCoord3D(2, -1, 0));
  assert(trenchWater, 'Trench water column at z=0 should exist');
  assert.strictEqual(trenchWater.medium, PoreMedium.AQUEOUS_FLUID, 'Trench column at z=0 should be AQUEOUS_FLUID');

  // 2.2 Basalt Wall Extrusion at (q=1, r=1) with height = 3
  const wallCoord = new HexCoord3D(1, 1, 0);
  const wallSuccess = world.buildBasaltWall(wallCoord, 3);
  assert(wallSuccess, 'world.buildBasaltWall should succeed');

  for (let z = world.getMinZ(); z <= 3; z++) {
    const p = world.getPore(new HexCoord3D(1, 1, z));
    assert(p, `Basalt wall pore at z=${z} should exist`);
    assert.strictEqual(p.isBasalt(), true, `Pore at z=${z} should be basalt barrier`);
    assert(world.getGrid().isBasaltObstacle(p.coord), `Grid must recognize basalt obstacle at z=${z}`);
  }

  const pAboveWall = world.getPore(new HexCoord3D(1, 1, 4));
  if (pAboveWall) {
    assert.strictEqual(pAboveWall.isBasalt(), false, 'Pore above wall height should not be basalt');
    assert.strictEqual(pAboveWall.medium, PoreMedium.AQUEOUS_FLUID, 'Pore above wall height should be aqueous fluid');
  }

  // 2.3 Hydrothermal Vent Spire Placement at (q=-2, r=1)
  const ventCoord = new HexCoord3D(-2, 1, 0);
  const ventSuccess = world.placeVent(ventCoord, 3);
  assert(ventSuccess, 'world.placeVent should succeed');

  const offshoots = world.getVent().getOffshoots();
  assert(offshoots.some(off => off.q === -2 && off.r === 1), 'Vent nozzle offshoot must be registered in VentPhysics');

  const ventPore = world.getPore(new HexCoord3D(-2, 1, 3));
  assert(ventPore, 'Vent spire summit pore should exist');
  assert.strictEqual(ventPore.medium, PoreMedium.ROCK_SUBSTRATE, 'Vent spire summit should be rock substrate');

  // Evaluate thermal plume emanating from newly planted vent
  const fluxAtNozzle = world.getVent().evaluateAt(new HexCoord3D(-2, 1, 0), 10);
  assert(fluxAtNozzle.thermalFlux > 300, `Thermal flux at new vent nozzle should exceed 300°C, got ${fluxAtNozzle.thermalFlux}`);

  // 3. Preset Loading & Founder Resets
  world.loadEnvironmentPreset(twinSmokers, false);
  assert.strictEqual(world.getRadius(), 8, 'World radius must match preset radius (8)');
  assert.strictEqual(world.getActivePreset()?.id, 'twin-smokers', 'Active preset should be twin-smokers');
  assert(world.getGrid().getAllBasaltObstacles().length > 0, 'Central basalt ridge must be instantiated from preset');

  // Verify founder strains were inoculated
  const livingFounders = world.getAllPores().filter(p => p.getState() === PoreState.OCCUPIED);
  assert(livingFounders.length >= 2, `Expected at least 2 living founder cells inoculated, got ${livingFounders.length}`);

  // Step simulation for 10 ticks
  for (let t = 0; t < 10; t++) {
    world.step();
  }
  assert.strictEqual(world.getTickCount(), 10, 'Simulation tick count should advance to 10');

  // Test Founder Reset
  world.resetToFounders();
  assert.strictEqual(world.getTickCount(), 0, 'Reset to founders must rewind ticks to 0');
  const resetFounders = world.getAllPores().filter(p => p.getState() === PoreState.OCCUPIED);
  assert(resetFounders.length >= 2, 'Founder cells must be re-inoculated in pristine terrain');

  // 4. Test "New Siliquarium" Fresh Lattice Creation (Positional & Options API)
  world.createNewSiliquarium(6, -1, 4, 'twin_vents');
  assert.strictEqual(world.getRadius(), 6, 'New siliquarium must have R=6');
  assert.strictEqual(world.getTickCount(), 0, 'New siliquarium must reset tick count to 0');
  assert.strictEqual(world.getVent().getOffshoots().length, 1, 'twin_vents template should have 1 nozzle and 1 offshoot vent');
  const barePores = world.getAllPores().filter(p => p.getState() === PoreState.OCCUPIED);
  assert.strictEqual(barePores.length, 0, 'New siliquarium must be pristine with 0 initial living cells');

  // 4.1 Test "Blank Canvas" Mode Options
  world.createNewSiliquarium({
    radius: 8,
    minZ: 0,
    maxZ: 4,
    mode: 'blank',
    template: 'none'
  });
  assert.strictEqual(world.getRadius(), 8, 'Blank Canvas should have R=8');
  assert.strictEqual(world.getAllPores().filter(p => p.isBasalt()).length, 0, 'Blank Canvas should have 0 basalt obstacles');
  assert.strictEqual(world.getAllPores().filter(p => p.getState() === PoreState.OCCUPIED).length, 0, 'Blank Canvas has 0 cells');

  // 4.2 Test "Procedural Generator" Mode Options (with explicit sterile option for single-cell snapshot test)
  world.createNewSiliquarium({
    radius: 7,
    minZ: -1,
    maxZ: 5,
    mode: 'procedural',
    basaltDensity: 0.20,
    terrainRoughness: 0.45,
    offshootCount: 2,
    seed: 99999,
    seedingMode: 'sterile'
  });
  assert.strictEqual(world.getRadius(), 7, 'Procedural generation should have R=7');
  assert.strictEqual(world.getVent().getOffshoots().length, 2, 'Procedural generation should have 2 offshoots');
  const procBasaltCount = world.getAllPores().filter(p => p.isBasalt()).length;
  assert(procBasaltCount > 0, `Procedural generation should place basalt barriers (got ${procBasaltCount})`);
  assert.strictEqual(world.getTickCount(), 0, 'Procedural generation resets clock to 0');

  // 4.1 Inoculate cell and test Snapshot / Lossless Rollback (Cancel Changes)
  world.inoculateCell(new HexCoord3D(0, 0, 0));
  assert.strictEqual(world.getAllPores().filter(p => p.getState() === PoreState.OCCUPIED).length, 1, 'Inoculated 1 cell');
  world.buildBasaltWall(new HexCoord3D(1, 0, 0), 2);

  const snapshot = world.createWorldSnapshot();
  assert(typeof snapshot === 'string' && snapshot.length > 50, 'Snapshot must be non-empty JSON string');

  // Make draft modifications (e.g. user sculpts and plays in studio)
  world.buildBasaltWall(new HexCoord3D(-1, 0, 0), 3);
  world.step();
  world.step();
  assert.strictEqual(world.getTickCount(), 2, 'Ticks advanced to 2');

  // Cancel Changes: restore snapshot
  world.restoreWorldSnapshot(snapshot);
  assert.strictEqual(world.getTickCount(), 0, 'Restoring snapshot must roll back tick count');
  assert(world.getPore(new HexCoord3D(1, 0, 0))?.isBasalt(), 'Basalt wall at (1,0,0) from snapshot must be preserved');
  assert.strictEqual(world.getPore(new HexCoord3D(-1, 0, 0))?.isBasalt(), false, 'Draft basalt wall at (-1,0,0) must be discarded');

  // 4.2 Test "Apply to Current Simulation" (preserveCells: true)
  world.loadEnvironmentPreset(twinSmokers, true);
  assert.strictEqual(world.getRadius(), 8, 'Applied twinSmokers geology (R=8)');
  const preservedCells = world.getAllPores().filter(p => p.getState() === PoreState.OCCUPIED);
  assert(preservedCells.length >= 1, 'Living cell must be preserved when preserveCells: true');

  // 4.3 Test Upward-Growing Siliquarium (minZ=0, maxZ=8)
  world.createNewSiliquarium({
    radius: 6,
    minZ: 0,
    maxZ: 8,
    mode: 'procedural',
    basaltDensity: 0.15,
    terrainRoughness: 0.35,
    seed: 12345
  });
  assert.strictEqual(world.getMinZ(), 0, 'Upward Siliquarium must have minZ = 0');
  assert.strictEqual(world.getMaxZ(), 8, 'Upward Siliquarium must have maxZ = 8');
  const subPoresUpward = world.getAllPores().filter(p => p.coord.z < 0);
  assert.strictEqual(subPoresUpward.length, 0, 'Upward Siliquarium must have 0 subterranean pores (z < 0)');
  const summitPores = world.getAllPores().filter(p => p.coord.z === 8);
  assert(summitPores.length > 0, 'Upward Siliquarium must have pores at water column summit z=8');

  // 4.4 Test Underground / Subterranean-Heavy Siliquarium (minZ=-4, maxZ=4, subterraneanNiches=0.50)
  world.createNewSiliquarium({
    radius: 6,
    minZ: -4,
    maxZ: 4,
    mode: 'procedural',
    basaltDensity: 0.15,
    terrainRoughness: 0.35,
    subterraneanNiches: 0.50,
    seed: 54321
  });
  assert.strictEqual(world.getMinZ(), -4, 'Subterranean Siliquarium must have minZ = -4');
  assert.strictEqual(world.getMaxZ(), 4, 'Subterranean Siliquarium must have maxZ = 4');

  // Verify deep subterranean conduits beneath vent nozzle
  for (let z = -1; z >= -4; z--) {
    const ventFeeder = world.getPore(new HexCoord3D(0, 0, z));
    assert(ventFeeder, `Hydrothermal feeder conduit at (0,0,${z}) must exist`);
    assert.strictEqual(ventFeeder.isBasalt(), false, `Vent feeder at (0,0,${z}) must be habitable non-basalt cavity`);
    assert.strictEqual(ventFeeder.medium, PoreMedium.ROCK_SUBSTRATE, `Vent feeder at (0,0,${z}) must be ROCK_SUBSTRATE`);
  }

  // Verify presence of habitable subterranean cavern niches and solid barrier bedrock
  const allSubterranean = world.getAllPores().filter(p => p.coord.z < 0);
  const subHabitable = allSubterranean.filter(p => !p.isBasalt() && p.medium === PoreMedium.ROCK_SUBSTRATE);
  const subBasalt = allSubterranean.filter(p => p.isBasalt());
  assert(subHabitable.length >= 8, `Expected at least 8 habitable subterranean niche cavities, got ${subHabitable.length}`);
  assert(subBasalt.length > 0, `Expected solid basalt bedrock obstacles surrounding niches, got ${subBasalt.length}`);

  // Test cell inoculation and metabolic viability inside deep subterranean niche
  const emptyNichePore = subHabitable.find(p => p.coord.z === -2 && p.getState() === PoreState.EMPTY) ?? subHabitable.find(p => p.getState() === PoreState.EMPTY);
  if (emptyNichePore) {
    const inocSubSuccess = world.inoculateCell(emptyNichePore.coord);
    assert(inocSubSuccess, 'Must successfully inoculate living silicoid inside subterranean niche');
  }
  const occupiedNichePore = subHabitable.find(p => p.getState() === PoreState.OCCUPIED);
  assert(occupiedNichePore, 'Found occupied subterranean niche pore at z < 0');
  assert.strictEqual(occupiedNichePore.getState(), PoreState.OCCUPIED, 'Subterranean niche pore must be OCCUPIED');

  // Step simulation: silicoid inside deep niche receives thermal flux and metabolizes
  world.step();
  const subResident = occupiedNichePore.getResident();
  assert(subResident, 'Resident must survive in subterranean niche');
  assert(subResident.getBattery().getEnergy() > 0, 'Resident in subterranean niche must maintain energy balance');

  // 4.5 Test Blank Canvas Subterranean Medium Options
  // A. habitable_caverns mode: all rock substrate is habitable porous cavities (0 basalt)
  world.createNewSiliquarium({
    radius: 5,
    minZ: -3,
    maxZ: 3,
    mode: 'blank',
    template: 'single_vent',
    blankSubstrate: 'habitable_caverns'
  });
  assert.strictEqual(world.getMinZ(), -3, 'Blank canvas minZ = -3');
  const blankBasaltCount = world.getAllPores().filter(p => p.isBasalt()).length;
  assert.strictEqual(blankBasaltCount, 0, 'Blank canvas with habitable_caverns must have 0 basalt obstacles');
  const blankSubRock = world.getAllPores().filter(p => p.coord.z < 0 && p.medium === PoreMedium.ROCK_SUBSTRATE);
  assert(blankSubRock.length > 0, 'Blank canvas must have porous rock substrate throughout z < 0');

  // B. solid_basalt mode: subterranean strata start as solid basalt, and can be excavated
  world.createNewSiliquarium({
    radius: 5,
    minZ: -2,
    maxZ: 3,
    mode: 'blank',
    template: 'single_vent',
    blankSubstrate: 'solid_basalt'
  });
  const subBasaltBefore = world.getPore(new HexCoord3D(1, 0, -1));
  assert(subBasaltBefore && subBasaltBefore.isBasalt(), 'Pore at (1,0,-1) starts as solid basalt');
  world.excavateHabitablePore(new HexCoord3D(1, 0, -1));
  const subBasaltAfter = world.getPore(new HexCoord3D(1, 0, -1));
  assert(subBasaltAfter && !subBasaltAfter.isBasalt(), 'Pore at (1,0,-1) after excavation must be habitable cavity');

  // 4.6 Test seedFoundersAroundVents for Sterile Worlds
  world.createNewSiliquarium({
    radius: 4,
    minZ: 0,
    maxZ: 2,
    mode: 'blank',
    template: 'single_vent',
    blankSubstrate: 'habitable_caverns'
  });
  const sterileCount = world.getAllPores().filter(p => p.getState() === PoreState.OCCUPIED).length;
  assert.strictEqual(sterileCount, 0, 'Blank canvas starts completely sterile (0 living silicoids)');
  const seededCount = world.seedFoundersAroundVents(3);
  assert.strictEqual(seededCount, 3, 'seedFoundersAroundVents should seed 3 viable founder strains');
  const livingAfterSeed = world.getAllPores().filter(p => p.getState() === PoreState.OCCUPIED).length;
  assert.strictEqual(livingAfterSeed, 3, 'World should now contain exactly 3 living silicoids');

  // 4.7 Test World Snapshot Undo/Redo Fidelity
  const snapshotBeforeEdit = world.createWorldSnapshot();
  const testEditCoord = new HexCoord3D(0, 1, 0);
  world.buildBasaltWall(testEditCoord, 2);
  const poreModified = world.getPore(testEditCoord);
  assert(poreModified && poreModified.isBasalt(), 'Pore should be modified to basalt barrier');
  world.restoreWorldSnapshot(snapshotBeforeEdit);
  const poreRestored = world.getPore(testEditCoord);
  assert(poreRestored && !poreRestored.isBasalt(), 'World snapshot restore must cleanly undo the edit');

  // 4.8 Test Automatic Ecological Founder Seeding in Procedural Siliquaria
  world.createNewSiliquarium({
    radius: 6,
    minZ: -2,
    maxZ: 4,
    mode: 'procedural',
    basaltDensity: 0.15,
    terrainRoughness: 0.35,
    subterraneanNiches: 0.40,
    offshootCount: 1,
    seed: 1337
  });

  const procLiving = world.getAllPores().filter(p => p.getState() === PoreState.OCCUPIED).length;
  assert(procLiving > 0, 'Procedural siliquarium MUST seed living founder strains by default (never sterile!)');
  
  // Verify presence of subterranean founders in subterranean niches (z < 0)
  const subFounders = world.getAllPores().filter(p => p.coord.z < 0 && p.getState() === PoreState.OCCUPIED);
  assert(subFounders.length > 0, 'Procedural siliquarium with minZ < 0 must seed subterranean cavern founder colonies');
  
  // Verify activePreset captured the seeded founder strains
  const activePreset = world.getActivePreset();
  assert(activePreset && activePreset.founderStrains && activePreset.founderStrains.length > 0, 'Preset must record seeded founder strains');

  // Verify explicit sterile mode for procedural when requested
  world.createNewSiliquarium({
    radius: 5,
    minZ: -1,
    maxZ: 3,
    mode: 'procedural',
    seedingMode: 'sterile'
  });
  const sterileProcLiving = world.getAllPores().filter(p => p.getState() === PoreState.OCCUPIED).length;
  assert.strictEqual(sterileProcLiving, 0, 'Procedural world with seedingMode="sterile" must remain 100% abiotic');

  // Verify explicit soup mode
  world.createNewSiliquarium({
    radius: 4,
    minZ: 0,
    maxZ: 2,
    mode: 'procedural',
    seedingMode: 'soup'
  });
  const soupLiving = world.getAllPores().filter(p => p.getState() === PoreState.OCCUPIED).length;
  assert(soupLiving >= 5, 'Procedural world with seedingMode="soup" must disperse prebiotic cells');

  // Epistemic Cut Audit: Verify Zero-Smuggling First-Law Invariants
  const tele = world.exportTelemetry();
  assert(tele.ledger.isEnergyConserved, `First law of thermodynamics violated: Energy Delta = ${tele.ledger.energyBalanceDelta}`);
  assert(tele.ledger.isMatterConserved, `First law of thermodynamics violated: Matter Delta = ${tele.ledger.matterBalanceDelta}`);
  // 4.9 Subterranean Cavern Zoom Cutaway & Zero-Border Transparency Verification
  world.createNewSiliquarium({
    radius: 6,
    minZ: -2,
    maxZ: 3,
    mode: 'procedural',
    basaltDensity: 0.20,
    terrainRoughness: 0.30,
    subterraneanNiches: 0.60,
    seed: 42
  });

  const subTele = world.exportTelemetry();
  const mockCtx = {
    clearRect: () => {},
    fillRect: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    fill: () => {},
    stroke: () => {},
    arc: () => {},
    quadraticCurveTo: () => {},
    bezierCurveTo: () => {},
    roundRect: () => {},
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} }),
    save: () => {},
    restore: () => {},
    fillText: () => {},
    measureText: () => ({ width: 50 }),
    setLineDash: () => {},
    globalAlpha: 1.0,
    fillStyle: '#000',
    strokeStyle: '#000',
    lineWidth: 1.0,
    font: '',
    textAlign: '',
    textBaseline: '',
    shadowColor: '',
    shadowBlur: 0
  };
  const mockCanvas = {
    getContext: () => mockCtx,
    width: 800,
    height: 600
  };

  const camera = new OrbitCamera();
  const renderer = new SeafloorRenderer3D(mockCanvas, camera);

  // Initial render at overview distance (camera distance = 24.0)
  camera.distance = 24.0;
  renderer.render(subTele);

  // 1. Verify subterranean caverns were discovered and indexed
  assert(renderer['subterraneanCaverns'].size > 0, 'Subterranean caverns map must index subterranean columns');
  assert(renderer['subterraneanCavernKeys'].size > 0, 'Subterranean cavern keys must index all cavern pores');

  // Pick a subterranean cavern column that is covered by surface rock (z >= 0)
  const coveredCavernEntry = Array.from(renderer['subterraneanCaverns'].entries()).find(([_, info]) => info.surfaceCoord.z >= 0);
  assert(coveredCavernEntry, 'Must find a subterranean cavern covered by seafloor rock');
  const [cavernColKey, cavInfo] = coveredCavernEntry;
  const surfacePore = subTele.pores.find(p => p.coord.equals(cavInfo.surfaceCoord));
  const cavernPore = cavInfo.cavernPores[0];
  assert(surfacePore, 'Surface pore above cavern must exist');
  assert(cavernPore, 'Cavern pore below surface must exist');
  assert(cavernPore.coord.z < 0, 'Cavern pore must be in subterranean strata (z < 0)');
  assert(surfacePore.coord.z >= 0, 'Surface pore must be at or above seafloor (z >= 0)');

  // 2. Test Zoomed-Out State:
  // Surface pore should be fully opaque (alpha = 1.0) and cavern indicator active
  const surfaceHex = {
    pore: surfacePore,
    centerScreen: { x: 400, y: 300, depth: 10 },
    topScreenVertices: [
      { x: 390, y: 290 }, { x: 410, y: 290 }, { x: 420, y: 300 },
      { x: 410, y: 310 }, { x: 390, y: 310 }, { x: 380, y: 300 }
    ],
    baseScreenVertices: null,
    depth: 10
  };

  const cavernHex = {
    pore: cavernPore,
    centerScreen: { x: 400, y: 320, depth: 12 },
    topScreenVertices: [
      { x: 390, y: 310 }, { x: 410, y: 310 }, { x: 420, y: 320 },
      { x: 410, y: 330 }, { x: 390, y: 330 }, { x: 380, y: 320 }
    ],
    baseScreenVertices: null,
    depth: 12
  };

  const alphaZoomedOut = renderer['getProximityAlpha'](surfaceHex, null);
  assert.strictEqual(alphaZoomedOut, 1.0, 'Surface rock must be 100% opaque when camera is zoomed out');

  // 3. Test Zoomed-In Cutaway State:
  // User selects subterranean cavern pore and zooms in (distance = 7.0)
  renderer.setSelectedCoord(cavernPore.coord);
  camera.distance = 7.0;
  const cavWorld = renderer.axialToWorld(cavernPore.coord);
  camera.setTarget(cavWorld.x, cavWorld.y, cavWorld.z);

  const alphaCavernZoomedIn = renderer['getProximityAlpha'](cavernHex, cavernPore.coord);
  assert.strictEqual(alphaCavernZoomedIn, 1.0, 'Cavern pore must remain 100% visible and unclipped when inspecting cave');

  const alphaOverheadZoomedIn = renderer['getProximityAlpha'](surfaceHex, cavernPore.coord);
  assert.strictEqual(alphaOverheadZoomedIn, 0.0, 'Overhead surface rock must become completely transparent (alpha = 0.0) when zoomed into cave');

  // 4. Test Zero-Border Clipping:
  renderer.render(subTele);
  assert.strictEqual(renderer['getProximityAlpha'](surfaceHex, cavernPore.coord), 0.0, 'Overhead rock must retain 0.0 alpha');

  console.log('  ✓ Stage 16: Siliquarium Design Studio & Geomorphology Subsystem Fully Verified.');
}
