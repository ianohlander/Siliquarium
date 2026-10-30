/**
 * 🐠 Siliquarium Stage 19 Verification
 * Tests Slime Mold Treadmilling Motility, Colony Kinematics Recording,
 * A-B Looping, Histological Staining & Persistent Chronicle Playback.
 */

import assert from 'node:assert';
import {
  HexCoord3D,
  Pore,
  PoreCell,
  PoreState,
  GenomeSafe,
  PoreMedium,
  ThermodynamicLedger,
  CodonType
} from '../dist/core/index.js';
import {
  TreadmillingEngine,
  ColonyKinematicsRecorder,
  ChronicleArchiveManager
} from '../dist/engine/kinematics/index.js';
import { SiliquariumDB } from '../dist/engine/storage/SiliquariumDB.js';
import { SimulationWorld } from '../dist/engine/SimulationWorld.js';
import { ChronicleTourGuide } from '../dist/ui/index.js';

export async function runStage19() {
  console.log('  Testing Slime Mold Treadmilling & Chronicle Playback Subsystems...');

  // =========================================================================
  // SUB-STAGE 1: Directional Cleavage Target Selection (Chemotaxis & Evasion)
  // =========================================================================
  const ventNozzle = new HexCoord3D(0, 0, 0);
  const ventTele = {
    nozzleCoord: ventNozzle,
    offshootCoords: [],
    regimeName: 'BALANCED_COUPLED',
    streamA: true,
    streamB: true,
    toxinT: false,
    thermalFlux: 250,
    precursorWarning: false,
    conduitChoking: 0
  };

  const centerPore = new Pore(new HexCoord3D(3, 0, 0), PoreMedium.ROCK_SUBSTRATE);
  const safeAlpha = new GenomeSafe('000000100000110000');
  const cell = new PoreCell(
    safeAlpha,
    50,
    20,
    1,
    'alpha-1',
    null,
    'clade-alpha'
  );
  centerPore.setResident(cell);

  // Candidate 1: closer to vent (q=2, r=0, dist=2)
  const candCloser = new Pore(new HexCoord3D(2, 0, 0), PoreMedium.ROCK_SUBSTRATE);
  // Candidate 2: farther from vent (q=4, r=0, dist=4)
  const candFarther = new Pore(new HexCoord3D(4, 0, 0), PoreMedium.ROCK_SUBSTRATE);

  const selectedTarget = TreadmillingEngine.selectDirectionalCleavageTarget(
    centerPore,
    cell,
    [candFarther, candCloser],
    ventTele,
    []
  );

  assert.strictEqual(
    selectedTarget.coord.toKey(),
    candCloser.coord.toKey(),
    'Directional cleavage must select substrate closer to nutrient vent'
  );

  // Thermal Shock Evasion test (>350°C): must favor moving away from boiling nozzle
  const ventBoiling = { ...ventTele, thermalFlux: 420 };
  const selectedEvasion = TreadmillingEngine.selectDirectionalCleavageTarget(
    centerPore,
    cell,
    [candCloser, candFarther],
    ventBoiling,
    []
  );

  assert.strictEqual(
    selectedEvasion.coord.toKey(),
    candFarther.coord.toKey(),
    'Directional cleavage under boiling thermal surge must flee away from vent'
  );

  // =========================================================================
  // SUB-STAGE 2: Posterior Resorption & Closed-Universe Conservation
  // =========================================================================
  const ledger = new ThermodynamicLedger();

  // Create a 4-pore linear syncytial slug extending from (1,0,0) to (4,0,0)
  const slugPores = [];
  for (let q = 1; q <= 4; q++) {
    const p = new Pore(new HexCoord3D(q, 0, 0), PoreMedium.ROCK_SUBSTRATE);
    const safeSlug = new GenomeSafe('000000100000110000');
    const c = new PoreCell(
      safeSlug,
      40,
      20,
      1,
      `slug-cell-${q}`,
      null,
      'clade-slime'
    );
    p.setResident(c);
    slugPores.push(p);
  }

  // Set trailing cell age to 25 to trigger maturation resorption
  const trailingCell = slugPores[3].getResident();
  for (let a = 0; a < 25; a++) {
    trailingCell.tick(true, false, false);
  }
  assert.ok(trailingCell.getAge() >= 20, 'Trailing cell must be mature');

  const totalEnergyBefore = slugPores.reduce((sum, p) => sum + (p.getResident()?.getBattery().getEnergy() ?? 0), 0);
  const totalMatterBefore = slugPores.reduce((sum, p) => sum + (p.getResident()?.getBattery().getMatter() ?? 0), 0);

  ledger.recordEnergyInjection(totalEnergyBefore);
  ledger.recordMatterInjection(totalMatterBefore);

  const treadEvents = TreadmillingEngine.executeTrailingEdgeResorption(
    slugPores,
    ventTele,
    100,
    ledger
  );

  assert.ok(treadEvents.length >= 2, 'Treadmilling must produce streaming and apoptosis events');
  assert.strictEqual(treadEvents[0].type, 'streaming', 'First event must be streaming');
  assert.strictEqual(treadEvents[1].type, 'apoptosis', 'Second event must be apoptosis');

  // Verify trailing pore is now completely empty
  assert.strictEqual(slugPores[3].getResident(), null, 'Trailing pore must be vacated');
  assert.strictEqual(slugPores[3].getCarcass(), null, 'Clean apoptosis must not leave carcass detritus');

  // Audit conservation invariant
  const totalEnergyAfter = slugPores.reduce((sum, p) => sum + (p.getResident()?.getBattery().getEnergy() ?? 0), 0);
  const totalMatterAfter = slugPores.reduce((sum, p) => sum + (p.getResident()?.getBattery().getMatter() ?? 0), 0);

  const audit = ledger.auditBalance(totalEnergyAfter, totalMatterAfter, 0);
  assert.strictEqual(audit.energyBalanceDelta, 0, 'Treadmilling must preserve exact energy conservation (ΔE ≡ 0.000)');
  assert.strictEqual(audit.matterBalanceDelta, 0, 'Treadmilling must preserve exact matter conservation (ΔM ≡ 0.000)');
  assert.strictEqual(audit.isEnergyConserved, true);
  assert.strictEqual(audit.isMatterConserved, true);

  // =========================================================================
  // SUB-STAGE 3: ColonyKinematicsRecorder Macro-Tracking & Playback Engine
  // =========================================================================
  const recorder = new ColonyKinematicsRecorder();

  // Create mock world telemetry with 2 species
  const mockPores = [];
  for (let i = 0; i < 5; i++) {
    mockPores.push({
      coord: new HexCoord3D(i, 0, 0),
      state: PoreState.OCCUPIED,
      isBasalt: true,
      isAqueous: false,
      energy: 40,
      matter: 20,
      age: i * 2,
      generation: 1,
      gateCount: 2,
      gateTypes: ['GATE_AND', 'GATE_OR'],
      hasSpore: false,
      tapeBitstring: '1100110011001100',
      catalyticYield: 5,
      toggleCount: 1,
      primaryActive: i === 0,
      cladeId: 'clade-predator'
    });
  }

  const mockTelemetry = {
    tick: 1,
    livingCount: 5,
    carcassCount: 0,
    emptyCount: 10,
    sporeCount: 0,
    totalEnergyInUniverse: 200,
    maxGeneration: 1,
    activeCladesCount: 1,
    shannonDiversity: 1.0,
    totalBirths: 5,
    evolutionaryVelocity: 0.1,
    ledger: { isEnergyConserved: true, isMatterConserved: true, energyBalanceDelta: 0, matterBalanceDelta: 0 },
    vent: ventTele,
    pores: mockPores,
    predationEvents: [],
    scavengeEvents: [],
    trophicInteractions: [],
    syncytialColonies: []
  };

  // Add a physically disjoint cell belonging to the same clade far away at (10, 10, 0)
  mockPores.push({
    coord: new HexCoord3D(10, 10, 0),
    state: PoreState.OCCUPIED,
    isBasalt: true,
    isAqueous: false,
    energy: 40,
    matter: 20,
    age: 0,
    generation: 1,
    gateCount: 1,
    gateTypes: ['GATE_AND'],
    hasSpore: false,
    tapeBitstring: '1100110011001100',
    catalyticYield: 0,
    toggleCount: 0,
    primaryActive: false,
    cladeId: 'clade-predator'
  });

  // Record 10 frames
  for (let t = 1; t <= 10; t++) {
    recorder.recordFrame({ ...mockTelemetry, livingCount: mockPores.length, tick: t }, []);
  }

  assert.strictEqual(recorder.getFramesCount(), 10, 'Recorder must store 10 recorded frames');

  // Verify Frame Content & Spatial BFS Contiguity Splitting
  const frame1 = recorder.getCurrentFrame();
  assert.ok(frame1 !== null, 'Current frame must exist');
  assert.strictEqual(frame1.bodies.length, 2, 'BFS must split disjoint clade patches into 2 distinct physical bodies');
  assert.strictEqual(frame1.bodies[0].bodyId, 'clade-predator_c0', 'First cluster must have bodyId clade-predator_c0');
  assert.strictEqual(frame1.bodies[1].bodyId, 'clade-predator_c1', 'Second cluster must have bodyId clade-predator_c1');
  assert.strictEqual(frame1.bodies[0].cells.length, 5, 'First cluster must contain 5 connected pores');
  assert.strictEqual(frame1.bodies[1].cells.length, 1, 'Second cluster must contain 1 solitary pore');
  assert.strictEqual(frame1.bodies[0].isMulticellularDifferentiated, true, 'Cluster with >=3 cells and differentiated roles must be multicellular');
  assert.strictEqual(frame1.bodies[1].isMulticellularDifferentiated, false, 'Solitary cluster must not be multicellular');
  assert.ok(frame1.bodies[0].centroid.x > 0, 'Centroid X must be calculated');

  // Playback Controls
  recorder.scrubTo(3);
  assert.strictEqual(recorder.currentFrameIndex, 3, 'Scrubbing must jump to frame index 3');
  recorder.step(2);
  assert.strictEqual(recorder.currentFrameIndex, 5, 'Step +2 must advance to frame index 5');

  // A-B Looping
  recorder.setLoopRange(2, 6);
  assert.strictEqual(recorder.isLooping, true, 'Looping must be enabled');
  assert.strictEqual(recorder.loopStartFrame, 2, 'Loop start must be 2');
  assert.strictEqual(recorder.loopEndFrame, 6, 'Loop end must be 6');

  recorder.scrubTo(6);
  recorder.play();
  recorder.tickPlayback(100); // Advances beyond loop end -> should wrap to loopStartFrame (2)
  assert.ok(recorder.currentFrameIndex >= 2 && recorder.currentFrameIndex <= 6, 'Playback within loop must remain inside [A, B]');

  // Histological Stain Switching
  recorder.setStain('grn');
  assert.strictEqual(recorder.currentStain, 'grn', 'Stain must switch to grn');
  recorder.setStain('vascular');
  assert.strictEqual(recorder.currentStain, 'vascular', 'Stain must switch to vascular');

  // Biological Representation Lens Switching (Molecular Graphics / Physarum Multi-Lens)
  assert.strictEqual(recorder.getLensMode(), 'hybrid', 'Default lens mode must be hybrid');
  recorder.setLensMode('plasmodium');
  assert.strictEqual(recorder.getLensMode(), 'plasmodium', 'Lens must switch to plasmodium (Physarum slime hull)');
  recorder.setLensMode('vascular');
  assert.strictEqual(recorder.getLensMode(), 'vascular', 'Lens must switch to vascular (cytoplasmic ribbons)');
  recorder.setLensMode('potential');
  assert.strictEqual(recorder.getLensMode(), 'potential', 'Lens must switch to potential (scalar energy field)');
  recorder.setLensMode('lattice');
  assert.strictEqual(recorder.getLensMode(), 'lattice', 'Lens must switch to lattice (discrete pores)');
  recorder.setLensMode('hybrid');

  // Lineage Pinning, Body Pinning & Lineage Isolation
  recorder.pinLineage('clade-predator');
  assert.strictEqual(recorder.pinnedLineageId, 'clade-predator', 'Pinned lineage must be set');

  recorder.pinBody('clade-predator_c0');
  assert.strictEqual(recorder.pinnedBodyId, 'clade-predator_c0', 'Pinned bodyId must be set');
  assert.strictEqual(recorder.pinnedLineageId, 'clade-predator', 'Pinned lineageId must derive from bodyId');

  assert.strictEqual(recorder.isLineageIsolation, false, 'Default isolation must be false');
  recorder.toggleLineageIsolation();
  assert.strictEqual(recorder.isLineageIsolation, true, 'Isolation must toggle on');
  recorder.toggleLineageIsolation();
  assert.strictEqual(recorder.isLineageIsolation, false, 'Isolation must toggle off');

  // Default overlay toggles: zero billboard badges by default
  assert.strictEqual(recorder.overlayToggles.speciesBadges, false, 'Overlay badges must be disabled by default');

  // =========================================================================
  // SUB-STAGE 4: SiliquariumDB Frame Persistence
  // =========================================================================
  const db = SiliquariumDB.getInstance();
  await db.saveKinematicFrame(frame1);
  const loadedFrames = await db.getKinematicFrames(10, 0);
  assert.ok(loadedFrames.length >= 1, 'SiliquariumDB must persist and retrieve kinematic frames');
  assert.strictEqual(loadedFrames[0].tick, frame1.tick, 'Persisted frame tick must match');

  // =========================================================================
  // SUB-STAGE 5: Live SimulationWorld Integration & Kinematics Recording
  // =========================================================================
  const world = new SimulationWorld({ radius: 3, soupDensity: 0.5, seed: 42 });
  const worldRecorder = world.getKinematicsRecorder();
  assert.ok(worldRecorder !== undefined, 'SimulationWorld must provide ColonyKinematicsRecorder');

  // Run 15 ticks of the live world
  for (let t = 0; t < 15; t++) {
    world.step();
  }

  assert.ok(worldRecorder.getFramesCount() >= 15, 'World must automatically record kinematic frames on each tick');
  const latestWorldFrame = worldRecorder.getCurrentFrame();
  assert.ok(latestWorldFrame !== null, 'Latest world frame must be available');
  assert.strictEqual(latestWorldFrame.tick, 15, 'Latest frame tick must align with world tick');

  // =========================================================================
  // SUB-STAGE 6: Chronicle Archive Serialization & Prototype Re-hydration
  // =========================================================================
  const archive = ChronicleArchiveManager.createArchive(recorder, [], 'Test Run Archive');
  assert.strictEqual(archive.metadata.format, 'SILIQUARIUM_CHRONICLE_ARCHIVE', 'Archive format must be SILIQUARIUM_CHRONICLE_ARCHIVE');
  assert.strictEqual(archive.frames.length, recorder.getAllFrames().length, 'Archive must capture all recorded frames');

  const jsonStr = ChronicleArchiveManager.serializeArchive(archive);
  assert.ok(jsonStr.length > 50, 'Serialized archive string must be populated');

  const restoredArchive = ChronicleArchiveManager.deserializeArchive(jsonStr);
  assert.strictEqual(restoredArchive.metadata.format, 'SILIQUARIUM_CHRONICLE_ARCHIVE', 'Deserialized archive format must match');

  const freshRecorder = new ColonyKinematicsRecorder();
  freshRecorder.loadFrames(restoredArchive.frames);
  assert.strictEqual(freshRecorder.getFramesCount(), recorder.getFramesCount(), 'Loaded frames count must match original');

  const restoredFrame0 = freshRecorder.getCurrentFrame();
  assert.ok(restoredFrame0 !== null, 'Restored current frame must exist');
  assert.ok(restoredFrame0.bodies[0].cells[0].coord instanceof HexCoord3D, 'Cell coordinates must be re-hydrated as HexCoord3D instances');
  assert.ok(typeof restoredFrame0.bodies[0].cells[0].coord.distanceTo === 'function', 'HexCoord3D prototype methods must be functional');

  // =========================================================================
  // SUB-STAGE 7: Chronicle Guided Tour Presentation Multi-Lens & Aspect Switching
  // =========================================================================
  let notifiedLens = null;
  let notifiedStain = null;
  const mockCamera = {
    smoothFlyTo: () => {}
  };
  const mockPlaybackBar = {
    setLens: () => {},
    setStain: () => {},
    pinBody: () => {},
    pinClade: () => {},
    update: () => {}
  };
  const tourGuide = new ChronicleTourGuide(recorder, mockCamera, mockPlaybackBar, {
    onLensChange: (lens) => { notifiedLens = lens; },
    onStainChange: (stain) => { notifiedStain = stain; }
  });

  const discoveredStops = tourGuide.discoverTourStops();
  assert.ok(discoveredStops.length >= 1, 'ChronicleTourGuide must discover at least one historical tour stop');

  for (const stop of discoveredStops) {
    assert.ok(stop.recommendedLens, `Tour stop [${stop.id}] must specify recommendedLens`);
    assert.ok(['lattice', 'plasmodium', 'vascular', 'potential', 'hybrid'].includes(stop.recommendedLens),
      `Tour stop [${stop.id}] recommendedLens must be a valid LensViewMode`);
    assert.ok(Array.isArray(stop.aspectOptions) && stop.aspectOptions.length >= 1,
      `Tour stop [${stop.id}] must provide curated aspectOptions array`);
    for (const asp of stop.aspectOptions) {
      assert.ok(asp.id && asp.label && asp.icon && asp.description, `Aspect option must have id, label, icon, description`);
      assert.ok(['lattice', 'plasmodium', 'vascular', 'potential', 'hybrid'].includes(asp.lens), `Aspect lens must be valid`);
      assert.ok(['morphology', 'grn', 'vascular', 'battery'].includes(asp.stain), `Aspect stain must be valid`);
    }
  }

  // Load stops and test switching
  tourGuide.loadStops(discoveredStops);
  tourGuide.goToStop(0);

  const initialAspect = tourGuide.getCurrentAspect();
  assert.ok(initialAspect !== null, 'Initial aspect must be available');
  assert.strictEqual(recorder.getLensMode(), initialAspect.lens, 'Recorder lens must match initial aspect');
  assert.strictEqual(recorder.currentStain, initialAspect.stain, 'Recorder stain must match initial aspect');
  assert.strictEqual(notifiedLens, initialAspect.lens, 'onLensChange callback must be fired on goToStop');
  assert.strictEqual(notifiedStain, initialAspect.stain, 'onStainChange callback must be fired on goToStop');

  if (discoveredStops[0].aspectOptions.length > 1) {
    const secondAspect = discoveredStops[0].aspectOptions[1];
    tourGuide.applyAspect(1);
    assert.strictEqual(tourGuide.getCurrentAspect()?.id, secondAspect.id, 'Active aspect must switch to second aspect');
    assert.strictEqual(recorder.getLensMode(), secondAspect.lens, 'Recorder lens must update on applyAspect');
    assert.strictEqual(recorder.currentStain, secondAspect.stain, 'Recorder stain must update on applyAspect');
    assert.strictEqual(notifiedLens, secondAspect.lens, 'onLensChange callback must be fired on applyAspect');
    assert.strictEqual(notifiedStain, secondAspect.stain, 'onStainChange callback must be fired on applyAspect');

    // Cycle aspect test
    tourGuide.cycleAspect();
    const cycledAspect = tourGuide.getCurrentAspect();
    assert.ok(cycledAspect !== null);
    assert.strictEqual(recorder.getLensMode(), cycledAspect.lens);
  }

  // Clean-up DB test data
  await db.clearAll();

  console.log('  ✓ Stage 19: Slime Treadmilling, Macro-Kinematics & Chronicle Subsystems Fully Verified.');
}
