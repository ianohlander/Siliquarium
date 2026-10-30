/**
 * 🐠 Siliquarium Native Test Suite - Stage 21
 * Novel Metabolic Innovations, Ecological Syntrophy & Vampiric Kleptoplasty
 * 
 * Verifies:
 * 1. Lenski Cit+ Analog: Refractory Substrate C catabolism via PORIN_STREAM_C (+3 tokens catalytic yield).
 * 2. Public Good Secretion: Siderophore mineral chelators & basalt rock matter solubilization (+1 matter).
 * 3. Biofilm Viscoelastic EPS Matrix: Exopolysaccharide secretion and non-aqueous pore diffusion.
 * 4. Paracrine Syntrophy & Direct Cross-Feeding (DIET): Strict First-Law conserved energy transfer (ΔE = 0.000).
 * 5. Vampiric Kleptoplasty: Predatory organelle cassette assimilation upon lethal prey lysis.
 */

import assert from 'node:assert';
import { HexCoord3D } from '../dist/core/spatial/HexCoord3D.js';
import { GenomeSafe } from '../dist/core/domain/GenomeSafe.js';
import { PoreCell } from '../dist/core/domain/PoreCell.js';
import { Pore } from '../dist/core/domain/Pore.js';
import { PoreState } from '../dist/core/domain/Pore.js';
import { CodonType } from '../dist/core/codons/CodonTable.js';
import { SimulationWorld } from '../dist/engine/SimulationWorld.js';

export async function runStage21() {
  console.log('  Testing Novel Metabolic Innovations, Syntrophy & Kleptoplasty...');

  // Helper codon generators
  const cAND = '000000'; // idx 0
  const cSTREAM_A = (32).toString(2).padStart(6, '0'); // idx 32
  const cSTREAM_B = (38).toString(2).padStart(6, '0'); // idx 38
  const cSTREAM_C = (8).toString(2).padStart(6, '0'); // idx 8 (PORIN_STREAM_C)
  const cCHELATOR = (18).toString(2).padStart(6, '0'); // idx 18 (SECRETION_CHELATOR)
  const cEPS = (28).toString(2).padStart(6, '0'); // idx 28 (SECRETION_EPS)
  const cNOT = (12).toString(2).padStart(6, '0'); // idx 12
  const cBATT = (50).toString(2).padStart(6, '0'); // idx 50
  const cSILENT = (56).toString(2).padStart(6, '0'); // idx 56

  // -------------------------------------------------------------------------
  // Test 1: Lenski Cit+ Analog - Substrate C Catabolism
  // -------------------------------------------------------------------------
  {
    // Tape containing STREAM_A, STREAM_B, STREAM_C, AND, SINK_BATTERY, SILENT
    const tapeCitPlus = `${cSTREAM_A}${cSTREAM_B}${cSTREAM_C}${cAND}${cBATT}${cSILENT}`;
    const safeCitPlus = new GenomeSafe(tapeCitPlus);
    const cell = new PoreCell(safeCitPlus, 40, 15, 0);

    // Tick without Stream C (only Stream A & B active)
    const resNoC = cell.tick(true, true, false, false);
    assert.strictEqual(resNoC.telemetry.streamCIngested, false, 'Stream C must not be ingested when absent');
    assert.strictEqual(resNoC.telemetry.catalyticYield, 2, 'Yield without Stream C is baseline redox (+2 tokens)');

    // Tick with Stream C present
    const resWithC = cell.tick(true, true, false, true);
    assert.strictEqual(resWithC.telemetry.streamCIngested, true, 'Stream C must be ingested when PORIN_STREAM_C is expressed');
    assert.strictEqual(resWithC.telemetry.catalyticYield, 5, 'Yield with Stream C must be 2 (base) + 3 (refractory C) = 5 tokens');
    console.log('    ✓ Test 1 Passed: Lenski Cit+ Substrate C catabolism yields +3 tokens.');
  }

  // -------------------------------------------------------------------------
  // Test 2: Siderophore Mineral Chelation & Basalt Solubilization
  // -------------------------------------------------------------------------
  {
    const world = new SimulationWorld({ radius: 2, minZ: 0, maxZ: 0, basaltDensity: 0, soupDensity: 0, seed: 42 });
    const centerCoord = new HexCoord3D(0, 0, 0);
    const basaltCoord = new HexCoord3D(1, 0, 0);

    const centerPore = world.getPore(centerCoord);
    const basaltPore = world.getPore(basaltCoord);
    assert.ok(centerPore && basaltPore, 'Test pores must exist');

    // Designate neighbor as basalt rock obstacle
    basaltPore.setBasalt(true);
    world.getGrid().setBasaltObstacle(basaltCoord);

    // Inoculate cell with SECRETION_CHELATOR in center pore
    const tapeChelator = `${cSTREAM_A}${cSTREAM_B}${cAND}${cCHELATOR}${cBATT}${cSILENT}`;
    const cellChelator = new PoreCell(new GenomeSafe(tapeChelator), 50, 10, 0);
    centerPore.setResident(cellChelator);
    world.getLedger().recordEnergyInjection(50);
    world.getLedger().recordMatterInjection(10);

    // Step until vent pulses align and chelation triggers
    let chelated = false;
    for (let t = 0; t < 10; t++) {
      world.step();
      const tele = world.exportTelemetry();
      if (tele.chelationEvents && tele.chelationEvents.length > 0) {
        chelated = true;
        assert.ok(cellChelator.getBattery().getMatter() >= 11, 'Cell must solubilize basalt into matter tokens (+1 matter)');
        assert.strictEqual(tele.ledger.isEnergyConserved, true, 'Energy conservation must be strictly preserved');
        assert.strictEqual(tele.ledger.isMatterConserved, true, 'Matter conservation must account for solubilized basalt injection');
        break;
      }
    }
    assert.strictEqual(chelated, true, 'Chelation event must be recorded');
    console.log('    ✓ Test 2 Passed: Siderophore basalt chelation and First-Law mass balance verified.');
  }

  // -------------------------------------------------------------------------
  // Test 3: Biofilm Extracellular Polymeric Substance (EPS) Secretion & Diffusion
  // -------------------------------------------------------------------------
  {
    const world = new SimulationWorld({ radius: 2, minZ: 0, maxZ: 0, basaltDensity: 0, soupDensity: 0, seed: 101 });
    const centerCoord = new HexCoord3D(0, 0, 0);
    const centerPore = world.getPore(centerCoord);
    assert.ok(centerPore, 'Center pore must exist');

    // Inoculate cell with SECRETION_EPS
    const tapeEps = `${cSTREAM_A}${cSTREAM_B}${cAND}${cEPS}${cBATT}${cSILENT}`;
    const cellEps = new PoreCell(new GenomeSafe(tapeEps), 60, 15, 0);
    centerPore.setResident(cellEps);
    world.getLedger().recordEnergyInjection(60);
    world.getLedger().recordMatterInjection(15);

    let epsAccumulated = false;
    for (let t = 0; t < 10; t++) {
      world.step();
      if (centerPore.getEps() > 0) {
        epsAccumulated = true;
        break;
      }
    }
    assert.strictEqual(epsAccumulated, true, 'Center pore must accumulate secreted EPS');

    // Step further ticks to verify diffusion into neighbor pores
    for (let i = 0; i < 5; i++) {
      world.step();
    }

    const neighborEps = centerPore.getNeighbors().some(n => n.getEps() > 0);
    assert.strictEqual(neighborEps, true, 'Secreted EPS must diffuse to adjacent pores');
    console.log('    ✓ Test 3 Passed: Biofilm EPS exopolysaccharide secretion & diffusion verified.');
  }

  // -------------------------------------------------------------------------
  // Test 4: Paracrine Syntrophy & Cross-Feeding (DIET)
  // -------------------------------------------------------------------------
  {
    const world = new SimulationWorld({ radius: 2, minZ: 0, maxZ: 0, basaltDensity: 0, soupDensity: 0, seed: 202 });
    const coordA = new HexCoord3D(0, 0, 0);
    const coordB = new HexCoord3D(1, 0, 0);

    const poreA = world.getPore(coordA);
    const poreB = world.getPore(coordB);
    assert.ok(poreA && poreB, 'Adjacent test pores must exist');

    // Cell A: Prosperous donor with high energy (90 tokens) in clade-A
    const tapeA = `${cSTREAM_A}${cSTREAM_B}${cAND}${cBATT}${cSILENT}${cSILENT}`;
    const cellA = new PoreCell(new GenomeSafe(tapeA), 90, 20, 0, 'donor-1', null, 'clade-donor');
    poreA.setResident(cellA);
    world.getLedger().recordEnergyInjection(90);
    world.getLedger().recordMatterInjection(20);

    // Cell B: Struggling recipient with low energy (25 tokens) in distinct clade-B
    const tapeB = `${cSTREAM_A}${cSTREAM_B}${cAND}${cBATT}${cSILENT}${cSILENT}`;
    const cellB = new PoreCell(new GenomeSafe(tapeB), 25, 20, 0, 'recip-1', null, 'clade-recip');
    poreB.setResident(cellB);
    world.getLedger().recordEnergyInjection(25);
    world.getLedger().recordMatterInjection(20);

    world.step();
    const tele = world.exportTelemetry();

    // Verify syntrophy event was triggered and recorded
    assert.ok(tele.syntrophyEvents && tele.syntrophyEvents.length > 0, 'Syntrophy event must be recorded in telemetry');
    const synEvt = tele.syntrophyEvents[0];
    assert.strictEqual(synEvt.from.toKey(), coordA.toKey(), 'Syntrophy donor must be Cell A');
    assert.strictEqual(synEvt.to.toKey(), coordB.toKey(), 'Syntrophy recipient must be Cell B');
    assert.strictEqual(synEvt.amount, 2, 'Syntrophy transfer amount must be 2 tokens');
    assert.strictEqual(tele.ledger.isEnergyConserved, true, 'Syntrophic cross-feeding must strictly conserve total energy (ΔE = 0.000)');
    console.log('    ✓ Test 4 Passed: Paracrine syntrophy (DIET) cross-feeding and energy conservation verified.');
  }

  // -------------------------------------------------------------------------
  // Test 5: Vampiric Kleptoplasty
  // -------------------------------------------------------------------------
  {
    const world = new SimulationWorld({ radius: 2, minZ: 0, maxZ: 0, basaltDensity: 0, soupDensity: 0, seed: 303 });
    const coordPred = new HexCoord3D(0, 0, 0);
    const coordPrey = new HexCoord3D(1, 0, 0);

    const porePred = world.getPore(coordPred);
    const porePrey = world.getPore(coordPrey);
    assert.ok(porePred && porePrey, 'Predator and prey pores must exist');

    // Predator: Has NOT gate (weaponry), energy 50, NO organelle
    const tapePred = `${cSTREAM_A}${cSTREAM_B}${cNOT}${cNOT}${cBATT}${cSILENT}`;
    const cellPred = new PoreCell(new GenomeSafe(tapePred), 50, 20, 0, 'pred-1', null, 'clade-pred');
    porePred.setResident(cellPred);
    world.getLedger().recordEnergyInjection(50);
    world.getLedger().recordMatterInjection(20);

    // Prey: Has organelle cassette with high catalytic yield, low energy 16 (vulnerable to lethal strike)
    const tapePrey = `${cSTREAM_A}${cSTREAM_B}${cAND}${cBATT}${cSILENT}${cSILENT}`;
    const organelleTape = `${cSTREAM_A}${cSTREAM_B}${cAND}${cBATT}${cSILENT}${cSILENT}`;
    const cellPrey = new PoreCell(
      new GenomeSafe(tapePrey),
      16,
      20,
      0,
      'prey-1',
      null,
      'clade-prey',
      new GenomeSafe(organelleTape)
    );
    porePrey.setResident(cellPrey);
    world.getLedger().recordEnergyInjection(16);
    world.getLedger().recordMatterInjection(20);

    assert.strictEqual(cellPred.hasOrganelle(), false, 'Predator starts without organelle');
    assert.strictEqual(cellPrey.hasOrganelle(), true, 'Prey possesses organelle cassette');

    // Run steps until vent pulses allow predator to strike and kleptoplasty occurs
    let kleptoplastyOccurred = false;
    for (let t = 0; t < 10; t++) {
      world.step();
      const tele = world.exportTelemetry();
      if (tele.kleptoplastyEvents && tele.kleptoplastyEvents.length > 0) {
        kleptoplastyOccurred = true;
        assert.strictEqual(cellPred.hasOrganelle(), true, 'Predator must successfully assimilate prey organelle cassette');
        assert.strictEqual(cellPred.getOrganelleSafe()?.getTape(), organelleTape, 'Assimilated organelle tape must match prey cassette');
        assert.strictEqual(tele.ledger.isEnergyConserved, true, 'First-Law energy conservation maintained post-kleptoplasty');
        break;
      }
    }
    assert.strictEqual(kleptoplastyOccurred, true, 'Vampiric kleptoplasty event must occur within 10 ticks');
    console.log('    ✓ Test 5 Passed: Vampiric kleptoplasty organelle assimilation verified.');
  }
}
