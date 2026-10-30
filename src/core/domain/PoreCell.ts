/**
 * 🐠 Siliquarium Domain Subsystem
 * PoreCell: Composed Digital Organism Entity.
 * Integrates GenomeSafe (The Safe), PoreWorkshop (The Workshop), and PoreBattery (The Pantry).
 */

import { GenomeSafe } from './GenomeSafe.js';
import { PoreBattery } from './PoreBattery.js';
import { PoreWorkshop, IWorkshopTelemetry } from './PoreWorkshop.js';
import { CodonTranslator } from '../codons/CodonTranslator.js';
import { CodonType } from '../codons/CodonTable.js';
import { IPrng } from '../prng/SeedablePrng.js';
import { MotifScanner, IMotifMatch } from '../paleontology/MotifScanner.js';
import { WeisfeilerLehmanHasher } from '../paleontology/WeisfeilerLehmanHasher.js';

export enum BodyTopologyType {
  SOLITARY = 'SOLITARY',
  FILAMENTOUS = 'FILAMENTOUS',
  DENDRITIC = 'DENDRITIC',
  ROSETTE = 'ROSETTE',
  RING = 'RING',
  COLUMNAR = 'COLUMNAR',
  AMORPHOUS = 'AMORPHOUS'
}

export interface IMorphogeneticPlan {
  readonly primaryDirection: number; // 0..5 index into planar hex directions
  readonly symmetryMode: number; // 0: Linear, 1: Rosette, 2: Dendritic, 3: Ring
  readonly hasAdhesion: boolean; // whether incomplete cytokinesis retains daughter in syncytium
  readonly preferredTopology: BodyTopologyType;
}

export interface ICellSensoryPacket {
  readonly streamA: boolean;
  readonly streamB: boolean;
  readonly toxinT?: boolean;
  readonly streamC?: boolean;
  readonly streamD?: boolean;
  readonly photonIr?: boolean;
  readonly baroAcoustic?: boolean;
  readonly mechanoTouch?: boolean;
  readonly electroRedox?: boolean;
}

export interface ICellReproductionOptions {
  readonly mutationRate?: number;
  readonly childId?: string;
  readonly duplicationRate?: number;
  readonly deletionRate?: number;
}

export interface ICellTickResult {
  readonly age: number;
  readonly energy: number;
  readonly matter: number;
  readonly telemetry: IWorkshopTelemetry;
  readonly energyCharged: number;
  readonly energyOverflow: number;
  readonly landauerBurned: number;
  readonly basalLeak: number;
  readonly isStarved: boolean;
  readonly canDivide: boolean;
}

export interface IPoreCellState {
  readonly id: string;
  readonly parentId: string | null;
  readonly cladeId: string;
  readonly syncytiumId: string | null;
  readonly tape: string;
  readonly organelleTape: string | null;
  readonly energy: number;
  readonly matter: number;
  readonly age: number;
  readonly generation: number;
}

export class PoreCell {
  private static cellSequence: number = 1;
  private readonly id: string;
  private readonly parentId: string | null;
  private cladeId: string;
  private safe: GenomeSafe;
  private organelleSafe: GenomeSafe | null = null;
  private organelleWorkshop: PoreWorkshop | null = null;
  private readonly battery: PoreBattery;
  private readonly workshop: PoreWorkshop;
  private age: number = 0;
  private readonly generation: number;
  private syncytiumId: string | null = null;
  private cachedMotifMatches: readonly IMotifMatch[] | null = null;
  private cachedWlHash: string | null = null;
  private cachedMorphogeneticPlan: IMorphogeneticPlan | null = null;
  private lastTickResult: ICellTickResult | null = null;

  constructor(
    safe: GenomeSafe,
    initialEnergy: number = 50,
    initialMatter: number = 20,
    generation: number = 0,
    id?: string,
    parentId: string | null = null,
    cladeId?: string,
    organelleSafe?: GenomeSafe | null,
    syncytiumId?: string | null
  ) {
    this.safe = safe;
    this.generation = generation;
    this.id = id ?? `org-${PoreCell.cellSequence++}`;
    this.parentId = parentId;
    this.cladeId = cladeId ?? this.id;
    this.syncytiumId = syncytiumId ?? null;
    this.battery = new PoreBattery(initialEnergy, initialMatter);
    this.workshop = new PoreWorkshop();

    // Birth translation: translate inert tape into workshop netlist
    const translation = CodonTranslator.translateTape(this.safe.getTape());
    this.workshop.assembleFromTranslation(translation);

    if (organelleSafe) {
      this.installOrganelle(organelleSafe);
    }
  }

  public tick(
    packetOrA: ICellSensoryPacket | boolean,
    streamB?: boolean,
    toxinT: boolean = false,
    streamC: boolean = false
  ): ICellTickResult {
    this.age++;

    const isPacket = typeof packetOrA === 'object';
    const envPacket = isPacket
      ? {
          ...packetOrA,
          batteryVoltage: this.battery.getEnergy()
        }
      : {
          streamA: packetOrA,
          streamB: streamB ?? false,
          toxinT,
          streamC,
          streamD: Boolean(arguments[4]),
          photonIr: Boolean(arguments[5]),
          baroAcoustic: Boolean(arguments[6]),
          mechanoTouch: Boolean(arguments[7]),
          electroRedox: Boolean(arguments[8]),
          batteryVoltage: this.battery.getEnergy()
        };

    // Step workshop logic and measure Landauer toggle switching with dynamic gene regulation
    const telemetry = this.workshop.stepTick(envPacket);

    // Charge battery from catalytic yield
    let energyCharged = 0;
    let energyOverflow = 0;
    if (telemetry.catalyticYield > 0) {
      energyCharged = this.battery.chargeEnergy(telemetry.catalyticYield);
      energyOverflow = telemetry.catalyticYield - energyCharged;
    }

    // Burn Landauer power for gate toggles
    let landauerBurned = this.battery.burnLandauer(telemetry.toggleCount);

    // Apply toxin corrosion if hit
    if (telemetry.toxinIngested) {
      landauerBurned += this.battery.burnLandauer(PoreWorkshop.TOXIN_CORROSION_PENALTY);
    }

    // 2. Step organelle cassette logic (Lynn Margulis mitochondrial/plastid engine)
    if (this.organelleWorkshop) {
      const oTele = this.organelleWorkshop.stepTick(envPacket);
      if (oTele.catalyticYield > 0) {
        const oCharged = this.battery.chargeEnergy(oTele.catalyticYield);
        energyCharged += oCharged;
        energyOverflow += (oTele.catalyticYield - oCharged);
      }
      const oBurned = this.battery.burnLandauer(oTele.toggleCount);
      landauerBurned += oBurned;

      // Organelle bioenergetic maintenance tax (Lane & Martin 2010):
      // Maintaining dual genomic compartments & translocases costs 1 Landauer token every 5 ticks
      if (this.age % 5 === 0) {
        landauerBurned += this.battery.burnLandauer(1);
      }
    }

    // Basal leak: 1 token every 10 ticks
    let basalLeak = 0;
    if (this.age % 10 === 0) {
      basalLeak = this.battery.dissipateBasalLeak(1);
    }

    this.lastTickResult = {
      age: this.age,
      energy: this.battery.getEnergy(),
      matter: this.battery.getMatter(),
      telemetry,
      energyCharged,
      energyOverflow,
      landauerBurned,
      basalLeak,
      isStarved: this.battery.isStarved(),
      canDivide: this.battery.isDivisionReady()
    };
    return this.lastTickResult;
  }

  public getLastTickResult(): ICellTickResult | null {
    return this.lastTickResult;
  }

  public isDead(): boolean {
    return this.battery.isStarved();
  }

  public isDivisionReady(): boolean {
    return this.battery.isDivisionReady();
  }

  public hasSeptum(): boolean {
    return this.workshop.hasSeptum();
  }

  /**
   * Authentic Epistemic Pelagic Sporing Adaptation:
   * Requires post-primordial lineage divergence (generation > 0), FtsZ cleavage furrow machinery (SINK_SEPTUM),
   * AND an integrated regulatory network (>= 2 gates).
   */
  public hasSporeAdaptation(): boolean {
    return this.generation > 0 && this.workshop.hasSeptum() && this.workshop.getExpressedGateCount() >= 2;
  }

  public reproduce(
    prng: IPrng,
    optionsOrRate: ICellReproductionOptions | number = GenomeSafe.DEFAULT_MUTATION_RATE,
    childId?: string,
    duplicationRate: number = 0
  ): PoreCell {
    const isOptions = typeof optionsOrRate === 'object';
    const mutationRate = isOptions
      ? (optionsOrRate.mutationRate ?? GenomeSafe.DEFAULT_MUTATION_RATE)
      : optionsOrRate;
    const cid = isOptions ? optionsOrRate.childId : childId;
    const dupRate = isOptions ? (optionsOrRate.duplicationRate ?? 0) : duplicationRate;
    const delRate = isOptions ? (optionsOrRate.deletionRate ?? 0) : (typeof arguments[4] === 'number' ? arguments[4] : 0);

    const { childEnergy, childMatter } = this.battery.splitForReproduction();

    // Apply John W. Drake's (1991) Mutational Invariance on default rate & Cairns-Foster SOS stress regulon
    let effectiveMutationRate = mutationRate === GenomeSafe.DEFAULT_MUTATION_RATE
      ? GenomeSafe.computeDrakeMutationRate(mutationRate, this.safe.length())
      : mutationRate;

    const underStress = Boolean(this.lastTickResult?.telemetry.toxinIngested || this.lastTickResult?.telemetry.acousticDetected);
    if (underStress && mutationRate > 0 && mutationRate < 0.1) {
      // Cairns-Foster (1988/1991) SOS Stress-Induced Hypermutation burst (Polymerase IV/V error-prone synthesis)
      effectiveMutationRate = Math.min(0.05, effectiveMutationRate * 3.0);
    }

    let childSafe = this.safe.photocopy(prng, effectiveMutationRate, dupRate, delRate);

    // Macromolecular operators (McClintock Transposons & Dobzhansky Inversions) when active mutation & duplication enabled
    if (effectiveMutationRate > 0 && dupRate > 0 && dupRate < 1.0) {
      const transposonProb = underStress ? 0.015 : 0.003;
      if (prng.nextFloat() < transposonProb) {
        childSafe = childSafe.translocateCassette(prng, false);
      }
      if (prng.nextFloat() < 0.002) {
        childSafe = childSafe.invertSegment(prng);
      }
    }

    const childOrganelle = this.organelleSafe ? this.organelleSafe.photocopy(prng, effectiveMutationRate, dupRate, delRate) : null;

    // Epistemic Cladogenesis & Speciation:
    // If the daughter genome diverges from parent by >= 4 bit mutations or length change,
    // establish a new phylogenetic daughter branch clade
    let daughterCladeId = this.cladeId;
    const parentTape = this.safe.getTape();
    const childTape = childSafe.getTape();
    let bitDiff = Math.abs(childTape.length - parentTape.length);
    const minLen = Math.min(parentTape.length, childTape.length);
    for (let i = 0; i < minLen; i++) {
      if (parentTape.charAt(i) !== childTape.charAt(i)) bitDiff++;
    }

    if (bitDiff >= 4) {
      daughterCladeId = `clade-${(cid ?? this.id).slice(-6)}-g${this.generation + 1}`;
    }

    const daughter = new PoreCell(
      childSafe,
      childEnergy,
      childMatter,
      this.generation + 1,
      cid,
      this.id,
      daughterCladeId,
      childOrganelle,
      this.syncytiumId
    );

    // Multicellular Morphogenesis & Colonial Adhesion:
    // If parent has adhesion or is part of a syncytium, cytokinesis remains incomplete
    // and the daughter is conjoined into the colonial syncytium
    const plan = this.getMorphogeneticPlan();
    if (plan.hasAdhesion) {
      // Preserve somatic tissue cohesion: all daughter cells remain adhered to the organism
      const colId = this.syncytiumId ?? `sync-${this.cladeId.slice(-8)}`;
      this.syncytiumId = colId;
      daughter.setSyncytiumId(colId);
    } else {
      // Solitary lineage: cytokinesis is complete
      daughter.setSyncytiumId(null);
    }

    return daughter;
  }

  public getSyncytiumId(): string | null {
    return this.syncytiumId;
  }

  public setSyncytiumId(id: string | null): void {
    this.syncytiumId = id;
  }

  public isColonial(): boolean {
    return this.syncytiumId !== null;
  }

  /**
   * Decodes Morphogenetic Polarity and Colonial Body Plan from 1D Genome Tape.
   * Zero-smuggling: All cleavage vectors, symmetry modes, and adhesion affinities
   * are computed deterministically from codon sequences.
   */
  public getMorphogeneticPlan(): IMorphogeneticPlan {
    const tape = this.safe.getTape();
    const trans = CodonTranslator.translateTape(tape);

    // 1. Division Machinery (FtsZ contractile ring — must be in an expressed operon)
    const hasSeptum = this.workshop.hasSeptum();

    // 2. Multicellular Adhesion Affinity (Extracellular Matrix / Incomplete Cytokinesis)
    // Evolved when cell has expressed FtsZ septation AND regulatory operators or expanded multi-gene tape (>60 bits)
    const hasOperator = trans.instructions.some(inst => inst.definition.type === CodonType.REGULATORY_OPERATOR);
    const isExpandedGenome = tape.length > 60;
    const hasAdhesion = (hasSeptum && (hasOperator || isExpandedGenome)) || this.syncytiumId !== null;

    // 3. Primary Cleavage Direction (0..5) and Symmetry Mode (0..3)
    // Derived purely from expressed coding functional types (neutral to silent introns and synonymous wobble)
    let primaryDirection = 0;
    let symmetryMode = 0;

    const codingInstructions = trans.instructions.filter(
      inst => inst.definition.type !== CodonType.INTRON_SILENT
    );
    const codonTypeOrder = Object.values(CodonType);

    if (codingInstructions.length >= 3) {
      const c0 = Math.max(0, codonTypeOrder.indexOf(codingInstructions[0].definition.type));
      const c1 = Math.max(0, codonTypeOrder.indexOf(codingInstructions[1].definition.type));
      const c2 = Math.max(0, codonTypeOrder.indexOf(codingInstructions[2].definition.type));
      const hash = (c0 * 17 + c1 * 31 + c2 * 53) >>> 0;
      primaryDirection = hash % 6;
      symmetryMode = Math.floor(hash / 6) % 4;
    }

    let preferredTopology = BodyTopologyType.SOLITARY;
    if (hasAdhesion) {
      if (symmetryMode === 0) preferredTopology = BodyTopologyType.FILAMENTOUS;
      else if (symmetryMode === 1) preferredTopology = BodyTopologyType.ROSETTE;
      else if (symmetryMode === 2) preferredTopology = BodyTopologyType.DENDRITIC;
      else preferredTopology = BodyTopologyType.RING;
    }

    this.cachedMorphogeneticPlan = {
      primaryDirection,
      symmetryMode,
      hasAdhesion,
      preferredTopology
    };
    return this.cachedMorphogeneticPlan;
  }

  public getId(): string {
    return this.id;
  }

  public getParentId(): string | null {
    return this.parentId;
  }

  public getCladeId(): string {
    return this.cladeId;
  }

  public getSafe(): GenomeSafe {
    return this.safe;
  }

  public getBattery(): PoreBattery {
    return this.battery;
  }

  public getWorkshop(): PoreWorkshop {
    return this.workshop;
  }

  public getAge(): number {
    return this.age;
  }

  public getGeneration(): number {
    return this.generation;
  }

  /**
   * Lynn Margulis Symbiogenesis: Installs a secondary autonomous organelle cassette.
   */
  public installOrganelle(organelleSafe: GenomeSafe): void {
    this.organelleSafe = organelleSafe;
    this.organelleWorkshop = new PoreWorkshop();
    const translation = CodonTranslator.translateTape(this.organelleSafe.getTape());
    this.organelleWorkshop.assembleFromTranslation(translation);
  }

  public getOrganelleSafe(): GenomeSafe | null {
    return this.organelleSafe;
  }

  public getOrganelleWorkshop(): PoreWorkshop | null {
    return this.organelleWorkshop;
  }

  public hasOrganelle(): boolean {
    return this.organelleSafe !== null;
  }

  /**
   * Vampiric Kleptoplasty: Captures an intact metabolic organelle cassette
   * from a lysed prey cell, assimilating the foreign safe into the predator's cellular pantry.
   */
  public assimilateOrganelle(stolenSafe: GenomeSafe): boolean {
    if (this.organelleSafe !== null) return false;
    this.installOrganelle(stolenSafe);
    return true;
  }

  /**
   * Lynn Margulis Symbiogenesis: Adopts a fused chimeric genome tape,
   * updates the clade founder lineage, and rebuilds the workshop enzymatic netlist.
   */
  public adoptChimericGenome(newSafe: GenomeSafe, chimericCladeId: string): void {
    this.safe = newSafe;
    this.cladeId = chimericCladeId;
    const translation = CodonTranslator.translateTape(this.safe.getTape());
    this.workshop.assembleFromTranslation(translation);
    this.cachedMotifMatches = null;
    this.cachedWlHash = null;
    this.cachedMorphogeneticPlan = null;
  }

  /**
   * High-Performance Cached Paleontology Accessors:
   * Netlist topology is static and invariant during a cell's lifetime.
   * Computing motif matches and WL hashes lazily once per cell eliminates
   * redundant graph kernel hashing on every tick.
   */
  public getMotifMatches(): readonly IMotifMatch[] {
    if (this.cachedMotifMatches === null) {
      this.cachedMotifMatches = MotifScanner.scanWorkshop(this.workshop);
    }
    return this.cachedMotifMatches;
  }

  public getWlHash(): string {
    if (this.cachedWlHash === null) {
      this.cachedWlHash = WeisfeilerLehmanHasher.hashNetlist(this.workshop.getGates(), 2, this.workshop.getAstEdges());
    }
    return this.cachedWlHash;
  }

  public exportState(): IPoreCellState {
    return {
      id: this.id,
      parentId: this.parentId,
      cladeId: this.cladeId,
      syncytiumId: this.syncytiumId,
      tape: this.safe.getTape(),
      organelleTape: this.organelleSafe ? this.organelleSafe.getTape() : null,
      energy: this.battery.getEnergy(),
      matter: this.battery.getMatter(),
      age: this.age,
      generation: this.generation
    };
  }

  public static fromState(state: IPoreCellState): PoreCell {
    const safe = new GenomeSafe(state.tape);
    const organelleSafe = state.organelleTape ? new GenomeSafe(state.organelleTape) : null;
    const cell = new PoreCell(
      safe,
      state.energy,
      state.matter,
      state.generation,
      state.id,
      state.parentId,
      state.cladeId,
      organelleSafe,
      state.syncytiumId
    );
    cell.age = state.age;
    return cell;
  }
}
