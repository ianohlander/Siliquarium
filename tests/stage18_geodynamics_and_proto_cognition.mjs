/**
 * 🐠 Siliquarium Stage 18 Verification
 * Tests Geodynamic Pressure Engine Enhancements & Proto-Cognitive Safari Specimens 16–20.
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  HexCoord3D,
  VentPhysics,
  GeochemicalRegime,
  CodonType
} from '../dist/core/index.js';
import {
  NetworkMotifRegistry,
  MotifType,
  MotifScanner,
  TaxonomyNomenclature
} from '../dist/core/paleontology/index.js';
import { EpistemicDossierRegistry } from '../dist/ui/NaturalistAssistant.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export function runStage18() {
  // =========================================================================
  // SUB-STAGE 1: Geodynamic Pressure Engine — Traveling Waves & Spatial Lag
  // =========================================================================
  const vent = new VentPhysics(new HexCoord3D(0, 0, 0), 500);

  // At vent nozzle (dist = 0), phase lag must be 0
  const stateNozzle = vent.evaluateAt(new HexCoord3D(0, 0, 0), 10);
  assert.strictEqual(stateNozzle.wavePhaseLag, 0, 'Nozzle wave phase lag must be 0');

  // At distance 3, phase lag must be exactly 3
  const stateDist3 = vent.evaluateAt(new HexCoord3D(3, 0, 0), 10);
  assert.strictEqual(stateDist3.wavePhaseLag, 3, 'Distance 3 wave phase lag must be 3');

  // At distance 5, phase lag must be exactly 5
  const stateDist5 = vent.evaluateAt(new HexCoord3D(5, 0, 0), 10);
  assert.strictEqual(stateDist5.wavePhaseLag, 5, 'Distance 5 wave phase lag must be 5');

  // Verify convective wave-train propagation:
  // A regime or pulse occurring at tick 10 at nozzle should arrive at distance 3 at tick 13
  const stateNozzleT10 = vent.evaluateAt(new HexCoord3D(0, 0, 0), 10);
  const stateDist3T13 = vent.evaluateAt(new HexCoord3D(3, 0, 0), 13);
  assert.strictEqual(
    stateNozzleT10.regime,
    stateDist3T13.regime,
    'Wave regime must propagate outward with traveling phase lag'
  );

  // =========================================================================
  // SUB-STAGE 2: Precursor Wavefront Warning (Pavlovian Anticipatory Cue)
  // =========================================================================
  // In BALANCED_COUPLED regime, toxin burst occurs every TOXIN_BURST_PERIOD (50 ticks).
  // Precursor warning must fire 1-2 ticks prior to the burst (ticks 48, 49; 98, 99; etc.)
  const statePrecursor2 = vent.evaluateAt(new HexCoord3D(0, 0, 0), 48);
  const statePrecursor1 = vent.evaluateAt(new HexCoord3D(0, 0, 0), 49);
  const stateStrike = vent.evaluateAt(new HexCoord3D(0, 0, 0), 50);
  const stateNormal = vent.evaluateAt(new HexCoord3D(0, 0, 0), 40);

  assert.strictEqual(statePrecursor2.precursorWarning, true, 'Precursor warning must fire 2 ticks before toxin');
  assert.strictEqual(statePrecursor1.precursorWarning, true, 'Precursor warning must fire 1 tick before toxin');
  assert.strictEqual(stateStrike.toxinT, true, 'Toxin must strike at burst tick 50');
  assert.strictEqual(stateNormal.precursorWarning, false, 'Precursor warning must be false during normal ticks');

  // =========================================================================
  // SUB-STAGE 3: Dynamic Conduit Choking & Hydraulic Avulsion
  // =========================================================================
  assert.strictEqual(vent.getConduitChoking(), 0, 'Initial conduit choking must be 0');
  assert.strictEqual(vent.isConduitChoked(), false, 'Conduit must not be choked initially');

  // Accumulate mineral scale
  vent.accumulateChoking(0.4);
  assert.strictEqual(vent.getConduitChoking(), 0.4, 'Choking should accumulate to 0.4');

  // Accumulate past threshold
  vent.accumulateChoking(0.7);
  assert.strictEqual(vent.getConduitChoking(), 1.0, 'Choking must clamp at 1.0');
  assert.strictEqual(vent.isConduitChoked(), true, 'Conduit must report choked at 1.0');

  // Thermal flux must be throttled when choked
  const chokedState = vent.evaluateAt(new HexCoord3D(0, 0, 0), 10);
  assert.ok(chokedState.thermalFlux < stateNozzle.thermalFlux, 'Choked conduit must throttle thermal flux');

  // Trigger blowout/avulsion reset
  const wasBlowout = vent.triggerConduitBlowout();
  assert.strictEqual(wasBlowout, true, 'Blowout must succeed on choked conduit');
  assert.strictEqual(vent.getConduitChoking(), 0, 'Blowout must reset choking to 0');
  assert.strictEqual(vent.isConduitChoked(), false, 'Conduit must no longer be choked');

  // =========================================================================
  // SUB-STAGE 4: Proto-Cognitive Motifs & Registry Definitions (Specimens 16–20)
  // =========================================================================
  const protoMotifs = NetworkMotifRegistry.getProtoCognitiveDefinitions();
  assert.strictEqual(protoMotifs.length, 5, 'Must define exactly 5 proto-cognitive motifs');

  const expectedTypes = [
    MotifType.TEMPORAL_DERIVATIVE_CHEMOTAXIS,
    MotifType.PREDICTIVE_PAVLOVIAN,
    MotifType.ENTRAINED_PACEMAKER,
    MotifType.STEINER_VASCULAR_NETWORK,
    MotifType.CRYPTOBIOTIC_DORMANCY_CLAMP
  ];

  for (const type of expectedTypes) {
    const def = NetworkMotifRegistry.getDefinition(type);
    assert.ok(def, `Definition for ${type} must exist`);
    assert.ok(def.name.length > 0, `${type} must have a name`);
    assert.ok(def.biologicalCognate.length > 0, `${type} must have a biological cognate`);
    assert.ok(def.naturalFunction.length > 0, `${type} must have a natural function description`);
    assert.ok(def.citation.length > 0, `${type} must cite academic literature`);
    assert.ok(def.signature.length > 0, `${type} must define a signature`);
  }

  // =========================================================================
  // SUB-STAGE 5: MotifScanner Detection of Specimens 16–20
  // =========================================================================
  // Specimen 16: Temporal Derivative Chemotaxis Engine (AND + NOT + AND delay cascade)
  const chemotaxisNetlist = {
    getGates: () => [
      { id: 0, type: CodonType.GATE_AND },
      { id: 1, type: CodonType.GATE_NOT },
      { id: 2, type: CodonType.GATE_AND }
    ]
  };
  const chemotaxisMatches = MotifScanner.scanWorkshop(chemotaxisNetlist);
  assert.ok(
    chemotaxisMatches.some(m => m.motif.type === MotifType.TEMPORAL_DERIVATIVE_CHEMOTAXIS),
    'Must detect Specimen 16: TEMPORAL_DERIVATIVE_CHEMOTAXIS'
  );

  // Specimen 17: Anticipatory Pavlovian Regulator (NOT + AND + OR)
  const pavlovianNetlist = {
    getGates: () => [
      { id: 0, type: CodonType.GATE_NOT },
      { id: 1, type: CodonType.GATE_AND },
      { id: 2, type: CodonType.GATE_OR }
    ]
  };
  const pavlovianMatches = MotifScanner.scanWorkshop(pavlovianNetlist);
  assert.ok(
    pavlovianMatches.some(m => m.motif.type === MotifType.PREDICTIVE_PAVLOVIAN),
    'Must detect Specimen 17: PREDICTIVE_PAVLOVIAN'
  );

  // Specimen 18: Phase-Locked Entrained Pacemaker (3 NOT + coupling AND)
  const pacemakerNetlist = {
    getGates: () => [
      { id: 0, type: CodonType.GATE_NOT },
      { id: 1, type: CodonType.GATE_NOT },
      { id: 2, type: CodonType.GATE_NOT },
      { id: 3, type: CodonType.GATE_AND }
    ]
  };
  const pacemakerMatches = MotifScanner.scanWorkshop(pacemakerNetlist);
  assert.ok(
    pacemakerMatches.some(m => m.motif.type === MotifType.ENTRAINED_PACEMAKER),
    'Must detect Specimen 18: ENTRAINED_PACEMAKER'
  );

  // Specimen 19: Steiner Vascular Transport Network (AND + OR + AND + OR relay network)
  const steinerNetlist = {
    getGates: () => [
      { id: 0, type: CodonType.GATE_AND },
      { id: 1, type: CodonType.GATE_OR },
      { id: 2, type: CodonType.GATE_AND },
      { id: 3, type: CodonType.GATE_OR }
    ]
  };
  const steinerMatches = MotifScanner.scanWorkshop(steinerNetlist);
  assert.ok(
    steinerMatches.some(m => m.motif.type === MotifType.STEINER_VASCULAR_NETWORK),
    'Must detect Specimen 19: STEINER_VASCULAR_NETWORK'
  );

  // Specimen 20: Cryptobiotic Dormancy Clamp (2 NOT + OR)
  const dormancyNetlist = {
    getGates: () => [
      { id: 0, type: CodonType.GATE_NOT },
      { id: 1, type: CodonType.GATE_NOT },
      { id: 2, type: CodonType.GATE_OR }
    ]
  };
  const dormancyMatches = MotifScanner.scanWorkshop(dormancyNetlist);
  assert.ok(
    dormancyMatches.some(m => m.motif.type === MotifType.CRYPTOBIOTIC_DORMANCY_CLAMP),
    'Must detect Specimen 20: CRYPTOBIOTIC_DORMANCY_CLAMP'
  );

  // =========================================================================
  // SUB-STAGE 6: TaxonomyNomenclature Binomial Classifications
  // =========================================================================
  const purcellTaxon = TaxonomyNomenclature.classify(undefined, ['AND', 'NOT', 'AND'], 1);
  assert.strictEqual(purcellTaxon.binomialName, 'Ventricola purcellii', 'Must classify as Ventricola purcellii');
  assert.strictEqual(purcellTaxon.honoree, 'Edward M. Purcell & Howard C. Berg', 'Must honor Purcell & Berg');

  const pavlovTaxon = TaxonomyNomenclature.classify(undefined, ['NOT', 'AND', 'OR'], 1);
  assert.strictEqual(pavlovTaxon.binomialName, 'Predictovibrio pavlovii', 'Must classify as Predictovibrio pavlovii');
  assert.strictEqual(pavlovTaxon.honoree, 'Ivan Pavlov & Saeed Tavazoie', 'Must honor Pavlov & Tavazoie');

  const johnsonTaxon = TaxonomyNomenclature.classify(undefined, ['NOT', 'NOT', 'NOT', 'AND'], 1);
  assert.strictEqual(johnsonTaxon.binomialName, 'Chronobacterium johnsonii', 'Must classify as Chronobacterium johnsonii');
  assert.strictEqual(johnsonTaxon.honoree, 'Carl H. Johnson & Michael J. Rust', 'Must honor Johnson & Rust');

  const nakagakiTaxon = TaxonomyNomenclature.classify(undefined, ['AND', 'OR', 'AND'], 1, false, false, true);
  assert.strictEqual(nakagakiTaxon.binomialName, 'Physarocladus nakagakii', 'Must classify as Physarocladus nakagakii');
  assert.strictEqual(nakagakiTaxon.honoree, 'Toshiyuki Nakagaki & Atsushi Tero', 'Must honor Nakagaki & Tero');

  const balabanTaxon = TaxonomyNomenclature.classify(undefined, ['NOT', 'NOT', 'OR'], 1);
  assert.strictEqual(balabanTaxon.binomialName, 'Dormitococcus balabanii', 'Must classify as Dormitococcus balabanii');
  assert.strictEqual(balabanTaxon.honoree, 'Nathalie Q. Balaban', 'Must honor Nathalie Balaban');

  // =========================================================================
  // SUB-STAGE 7: Epistemic Dossier Registry & File Verification (Specimens 16–20)
  // =========================================================================
  const specimenKeys = [
    'TEMPORAL_DERIVATIVE_CHEMOTAXIS',
    'PREDICTIVE_PAVLOVIAN',
    'ENTRAINED_PACEMAKER',
    'STEINER_VASCULAR_NETWORK',
    'CRYPTOBIOTIC_DORMANCY_CLAMP'
  ];

  for (const key of specimenKeys) {
    const url = EpistemicDossierRegistry.getDossierUrl(key);
    assert.ok(url.startsWith('docs/paleontology/specimen_'), `Dossier URL for ${key} must point to paleontology dossier`);

    const fullHtmlPath = path.resolve(rootDir, url);
    assert.ok(fs.existsSync(fullHtmlPath), `Compiled HTML dossier must exist on disk: ${fullHtmlPath}`);

    const fullMdPath = fullHtmlPath.replace('.html', '.md');
    assert.ok(fs.existsSync(fullMdPath), `Source Markdown dossier must exist on disk: ${fullMdPath}`);

    const htmlContent = fs.readFileSync(fullHtmlPath, 'utf8');
    assert.ok(htmlContent.length > 5000, `HTML dossier for ${key} must contain full compiled content`);
  }
}
