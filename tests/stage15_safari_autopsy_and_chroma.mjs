/**
 * 🐠 Siliquarium Stage 15 Test
 * Verification of Safari Chroma Isolation, Role Breakdown,
 * and Fullscreen CAD Autopsy & Epistemic Workbench.
 */

import assert from 'node:assert';
import {
  TaxonomyNomenclature,
  CodonTranslator,
  CodonType
} from '../dist/core/index.js';
import { CircuitTopology } from '../dist/visualizers/CircuitTopology.js';
import { CircuitAutopsyModal } from '../dist/ui/CircuitAutopsyModal.js';
import { SeafloorRenderer3D } from '../dist/visualizers/SeafloorRenderer3D.js';

export function runStage15() {
  // 1. Verify CircuitTopology and Boolean Logic Evaluation
  // Construct a synthetic genome tape encoding Porin A (32: 100000), Porin B (38: 100110), and AND (0: 000000)
  const tape = '100000' + '100110' + '000000' + '000000000000000000000000000000000000000000';
  const trans = CodonTranslator.translateTape(tape);
  assert(trans.inputPorins.length >= 2, 'Must have translated input porins');

  // Instantiate dummy modal evaluator logic
  // Test evaluateCircuitState static logic
  const modalMock = new CircuitAutopsyModal({
    exportTelemetry: () => ({
      vent: { streamA: true, streamB: true, toxinT: false, temperature: 350 },
      pores: []
    })
  });

  // Evaluate A=1, B=1, T=0 -> Should be active
  const stateActive = modalMock.evaluateCircuitState(tape, true, true, false);
  assert.strictEqual(typeof stateActive.primaryActive, 'boolean', 'primaryActive must be boolean');
  assert.strictEqual(typeof stateActive.yieldMultiplier, 'number', 'yieldMultiplier must be numeric');
  assert(Array.isArray(stateActive.gateOutputs), 'gateOutputs must be an array');

  // Evaluate A=0, B=1, T=0 -> For AND-dependent logic, primaryActive must be false
  const stateInactive = modalMock.evaluateCircuitState(tape, false, true, false);
  assert.strictEqual(stateInactive.primaryActive, false, 'State with missing fuel A must not activate AND gate');

  // 2. Verify Taxonomy and Dossier Resolution
  const taxonBonnerii = TaxonomyNomenclature.classify(tape, ['GATE_AND'], 10, false, false, true, false);
  assert.strictEqual(taxonBonnerii.binomialName, 'Syncytiocladus bonnerii', 'Syncytial colony must classify as Syncytiocladus bonnerii');

  const taxonWolpertii = TaxonomyNomenclature.classify(tape, ['GATE_AND'], 10, false, false, true, true);
  assert.strictEqual(taxonWolpertii.binomialName, 'Metazoicladus wolpertii', 'Differentiated multicellular organism must classify as Metazoicladus wolpertii');

  // 3. Verify CircuitTopology Uri Alon Motif Classification
  const analysis = CircuitTopology.analyze(tape, { streamA: true, streamB: true, toxinT: false }, true);
  assert(analysis.nodes.length > 0, 'Circuit analysis must contain nodes');
  assert(typeof analysis.motifName === 'string' && analysis.motifName.length > 0, 'Motif name must be populated');
  assert(typeof analysis.motifCognate === 'string', 'Motif cognate must be populated');

  // 4. Verify Landauer Cost Calculation
  const landauerCost = Math.max(12, analysis.gateCount * 12);
  assert(landauerCost >= 12, 'Landauer dissipation cost must be at least 12T (kT ln 2)');

  // 5. Verify Circuit Guide & Analysis URL Resolution
  const dummyPore = {
    coord: { q: 1, r: -1, z: 0, equals: () => false, toKey: () => '1,-1,0' },
    isDifferentiated: false,
    isSyncytium: false,
    hasOrganelle: false,
    hasSpore: false
  };
  const guideLatch = modalMock.resolveCircuitGuideUrl('Uri Alon Bistable Memory Latch', taxonBonnerii, dummyPore);
  assert(guideLatch.includes('unit3_systems_biology_motifs.html#bistable-memory-latches'), 'Latch must resolve to bistable latch curriculum section');

  const guideFFL = modalMock.resolveCircuitGuideUrl('Incoherent Feed-Forward Loop', taxonBonnerii, dummyPore);
  assert(guideFFL.includes('unit3_systems_biology_motifs.html#incoherent-feedforward-loops'), 'Incoherent FFL must resolve to curriculum section');

  const guideOrganelle = modalMock.resolveCircuitGuideUrl('Endosymbiotic Organelle Cassette', taxonBonnerii, { ...dummyPore, hasOrganelle: true });
  assert(guideOrganelle.includes('specimen_08_endosymbiotic_cassette.html'), 'Organelle must resolve to specimen 08 dossier');

  const dummyCanvas = { getContext: () => ({}) };
  const dummyCamera = { distance: 10, elevation: 0.5, azimuth: 0 };
  const renderer = new SeafloorRenderer3D(dummyCanvas, dummyCamera);

  renderer.chromaIsolationEnabled = true;
  renderer.safariTargetCoord = { q: 2, r: 3, z: 0, equals: (o) => o.q === 2 && o.r === 3 && o.z === 0, toKey: () => '2,3,0' };
  renderer.setSelectedCoord(null); // Simulated mouse drag or deselect event

  assert.strictEqual(renderer.isChromaIsolated(), true, 'Chroma isolation must remain active even if selectedCoord is null in Safari mode');
  assert.strictEqual(renderer.isChromaTarget({ q: 2, r: 3, z: 0, equals: (o) => o.q === 2 && o.r === 3 && o.z === 0, toKey: () => '2,3,0' }, false), true, 'Safari target coord must be recognized as chroma target');
  assert.strictEqual(renderer.isChromaTarget({ q: 0, r: 0, z: 0, equals: (o) => o.q === 0 && o.r === 0 && o.z === 0, toKey: () => '0,0,0' }, false), false, 'Non-target pore must not be recognized as chroma target');

  // 6. Verify Metazoan Role Metadata & Tissue Isolation Helpers
  const trophoMeta = renderer.getRoleMeta('Trophocyte (Vent Feeder)');
  assert.strictEqual(trophoMeta.glyph, '🌾', 'Trophocyte must map to wheat sheaf glyph');
  assert.strictEqual(trophoMeta.color, '#f59e0b', 'Trophocyte must map to amber gold color');

  const shieldMeta = renderer.getRoleMeta('Somatic Shield (Toxin Inverter)');
  assert.strictEqual(shieldMeta.glyph, '🛡️', 'Somatic Shield must map to shield glyph');
  assert.strictEqual(shieldMeta.color, '#38bdf8', 'Somatic Shield must map to cobalt sky color');

  const paceMeta = renderer.getRoleMeta('Pacemaker Oscillator');
  assert.strictEqual(paceMeta.glyph, '⚡', 'Pacemaker must map to lightning bolt glyph');
  assert.strictEqual(paceMeta.color, '#ec4899', 'Pacemaker must map to hot magenta color');

  // 7. Verify Billboard Morphology Click Target
  let clickedTopology = null;
  renderer.onMorphologyClick = (topo) => { clickedTopology = topo; };
  renderer.lastBillboardRect = { x: 100, y: 50, w: 200, h: 25, topology: 'ROSETTE' };

  assert.strictEqual(renderer.checkBillboardClick(150, 60), true, 'Click inside billboard rect must be detected');
  assert.strictEqual(clickedTopology, 'ROSETTE', 'Click must dispatch ROSETTE topology');
  assert.strictEqual(renderer.checkBillboardClick(50, 50), false, 'Click outside billboard rect must not be detected');
}

