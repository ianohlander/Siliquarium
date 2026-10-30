/**
 * 🐠 Siliquarium Test Stage 14: Bio-Bank Cryo-Vault & Inoculation Registry
 * Verifies cross-simulation preservation, Richard Lenski LTEE seeding,
 * and JSON import/export fidelity.
 */

import assert from 'node:assert';
import { BioBank } from '../dist/engine/storage/BioBank.js';
import { SimulationWorld } from '../dist/engine/SimulationWorld.js';
import { HexCoord3D } from '../dist/core/spatial/HexCoord3D.js';
import { GenomeSafe } from '../dist/core/domain/GenomeSafe.js';

export function runStage14() {
  const bioBank = BioBank.getInstance();
  assert.ok(bioBank, 'BioBank singleton must instantiate');

  // 1. Verify default starter strains
  const allStrains = bioBank.getAll();
  assert.ok(allStrains.length >= 3, `Expected at least 3 default strains, got ${allStrains.length}`);
  
  const lenskiAncestor = allStrains.find(s => s.name.includes('Lenski Ancestor Zero'));
  assert.ok(lenskiAncestor, 'Must include Lenski Ancestor Zero reference strain');
  assert.strictEqual(lenskiAncestor.generation, 0, 'Lenski Ancestor Zero must be generation 0');
  assert.strictEqual(lenskiAncestor.gateCount, 0, 'Lenski Ancestor Zero must have 0 gates');

  const wolpertMetazoan = allStrains.find(s => s.name.includes('Wolpert Branching Metazoan'));
  assert.ok(wolpertMetazoan, 'Must include Wolpert Branching Metazoan');
  assert.strictEqual(wolpertMetazoan.isDifferentiated, true, 'Wolpert Metazoan must be differentiated');
  assert.strictEqual(wolpertMetazoan.bodyTopology, 'DENDRITIC', 'Wolpert Metazoan topology must be DENDRITIC');

  // 2. Active Inoculant selection
  const initialActive = bioBank.getActiveInoculant();
  assert.ok(initialActive, 'Active inoculant must not be null');

  bioBank.setActiveInoculant(lenskiAncestor.id);
  assert.strictEqual(bioBank.getActiveInoculant()?.id, lenskiAncestor.id, 'Active inoculant must match Lenski Ancestor');

  // 3. Freezing a new living specimen
  const customTape = '000000' + '001100' + '100000' + '100110' + '110010' + '111000'.repeat(5);
  const frozenRecord = bioBank.saveSilicoid({
    name: 'Experimental Test Specimen',
    tapeBitstring: customTape,
    gateCount: 2,
    gateTypes: ['AND', 'NOT'],
    generation: 42,
    savedAtEpoch: 1250,
    notes: 'Unit test specimen for BioBank validation',
    isDifferentiated: true,
    bodyTopology: 'ROSETTE'
  });

  assert.ok(frozenRecord.id.startsWith('cryo-'), 'Frozen record ID must start with cryo-');
  assert.strictEqual(bioBank.getById(frozenRecord.id)?.name, 'Experimental Test Specimen');
  assert.strictEqual(bioBank.getActiveInoculant()?.id, frozenRecord.id, 'Newly frozen specimen becomes active inoculant');

  // 4. JSON Export & Import fidelity
  const exported = bioBank.exportJSON();
  assert.ok(typeof exported === 'string' && exported.includes('Experimental Test Specimen'));

  const parsed = JSON.parse(exported);
  assert.strictEqual(parsed.schema, 'siliquarium_biobank_v1');
  assert.ok(Array.isArray(parsed.strains));

  // Test import into fresh test session
  const importedCount = bioBank.importJSON(exported);
  assert.ok(importedCount >= 4, `Import count must be >= 4, got ${importedCount}`);

  // 5. Inoculate into SimulationWorld using Bio-Bank active strain
  const world = new SimulationWorld({ radius: 3, seed: 42, soupDensity: 0.1 });
  const emptyPore = world.getAllPores().find(p => !p.isBasalt() && !p.isAqueous() && p.getState() === 0);
  const targetPore = emptyPore ? emptyPore.coord : new HexCoord3D(1, 1, 0);
  if (!emptyPore) {
    const p = world.getPore(targetPore);
    if (p) {
      p.setBasalt(false);
      world.clearPore(targetPore);
    }
  }
  
  // Inoculate with the active strain (Experimental Test Specimen)
  const activeStrain = bioBank.getActiveInoculant();
  assert.ok(activeStrain);
  const safe = new GenomeSafe(activeStrain.tapeBitstring);
  const inoculated = world.inoculateCell(targetPore, safe);
  assert.strictEqual(inoculated, true, 'Inoculation of frozen strain must succeed');

  const pore = world.getPore(targetPore);
  assert.ok(pore?.getResident(), 'Resident cell must exist at inoculated pore');
  assert.strictEqual(pore?.getResident()?.getSafe().getTape(), activeStrain.tapeBitstring, 'Resident cell tape must match BioBank strain');

  // Clean up test specimen
  bioBank.deleteSilicoid(frozenRecord.id);
  assert.strictEqual(bioBank.getById(frozenRecord.id), null, 'Deleted specimen must no longer exist');
}
