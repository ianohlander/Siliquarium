/**
 * 🐠 Siliquarium Engine Subsystem
 * GeologicalPressuresEngine: Deep-Sea Hydrothermal & Tectonic Environment Simulator.
 * 
 * Simulates authentic physical and geochemical phenomena occurring at mid-ocean ridge
 * hydrothermal vents across geologic time:
 * - Magmatic rifting & seafloor earthquakes (fractures basalt into habitable pores)
 * - Pillow basalt lava extrusions (resurfaces patches of seabed, resetting monopolies)
 * - Chimney structural spalling & calving (mineral wall collapse rains detrital food)
 * - Hydrothermal boiling surges & convective megasurges (feast-and-famine cycles)
 * - Toxic heavy metal & hydrogen sulfide pulses (tests allosteric NOT-gate shields)
 * - Abyssal planetary tidal current shifts (advects pelagic spores across chimneys)
 * - Marine snow & pelagic detrital floc storms (fuels catabolic scavenging logic)
 * - Hydrothermal mineral clogging & orifice migration (forces ecological relocation)
 * - Cryogenic abyssal downwelling incursions (thermal shock & lipid reserve tests)
 * 
 * Zero-Smuggling Mandate: Every event conserves mass and energy (ΔE = 0.000, ΔM = 0.000).
 */

import { HexCoord3D } from '../../core/spatial/HexCoord3D.js';
import { PoreState, PoreMedium } from '../../core/domain/Pore.js';
import { IPrng, Mulberry32Prng } from '../../core/prng/SeedablePrng.js';
import type { SimulationWorld } from '../SimulationWorld.js';

export enum GeologicalEventType {
  MAGMATIC_TREMOR = 'MAGMATIC_TREMOR',
  PILLOW_LAVA_FLOW = 'PILLOW_LAVA_FLOW',
  CHIMNEY_SPALLING = 'CHIMNEY_SPALLING',
  HYDROTHERMAL_SURGE = 'HYDROTHERMAL_SURGE',
  TOXIC_HEAVY_METAL_SPIKE = 'TOXIC_HEAVY_METAL_SPIKE',
  TIDAL_CURRENT_SHEAR = 'TIDAL_CURRENT_SHEAR',
  MARINE_SNOW_STORM = 'MARINE_SNOW_STORM',
  VENT_ORIFICE_MIGRATION = 'VENT_ORIFICE_MIGRATION',
  CRYOGENIC_DOWNWELLING = 'CRYOGENIC_DOWNWELLING'
}

export interface IGeologicalEventRecord {
  readonly id: string;
  readonly type: GeologicalEventType;
  readonly tick: number;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly epicenter?: HexCoord3D;
  readonly affectedCoords?: readonly HexCoord3D[];
  readonly magnitude: number;
  readonly durationTicks: number;
  ticksRemaining: number;
}

export interface IGeologicalConfig {
  masterActivityRate: number;      // 0.0 (off) to 1.0 (hyper-active); default 0.20
  earthquakeRate: number;          // 0.0 to 1.0; default 0.25
  lavaFlowRate: number;            // 0.0 to 1.0; default 0.15
  chimneySpallingRate: number;     // 0.0 to 1.0; default 0.20
  hydrothermalSurgeRate: number;   // 0.0 to 1.0; default 0.35
  toxicSpikeRate: number;          // 0.0 to 1.0; default 0.30
  tidalCurrentRate: number;        // 0.0 to 1.0; default 0.40
  marineSnowRate: number;          // 0.0 to 1.0; default 0.30
  ventMigrationRate: number;       // 0.0 to 1.0; default 0.10
  cryogenicDownwellingRate: number;// 0.0 to 1.0; default 0.20
}

export interface ITidalVector {
  readonly dq: number;
  readonly dr: number;
  readonly angle: number;
  readonly speed: number;
}

export type GeologicalEventListener = (event: IGeologicalEventRecord) => void;

export class GeologicalPressuresEngine {
  private config: IGeologicalConfig = {
    masterActivityRate: 0.20,
    earthquakeRate: 0.25,
    lavaFlowRate: 0.15,
    chimneySpallingRate: 0.20,
    hydrothermalSurgeRate: 0.35,
    toxicSpikeRate: 0.30,
    tidalCurrentRate: 0.40,
    marineSnowRate: 0.30,
    ventMigrationRate: 0.10,
    cryogenicDownwellingRate: 0.20
  };

  private activeEvents: IGeologicalEventRecord[] = [];
  private eventHistory: IGeologicalEventRecord[] = [];
  private readonly eventListeners: GeologicalEventListener[] = [];
  private static eventSequence: number = 1;

  // Active environmental modifier states
  public activeSurgeEnergyBoost: number = 0;
  public activeToxicPlumeOverride: boolean = false;
  public activeCryogenicCooling: boolean = false;
  public activePrecursorWarning: boolean = false;
  public currentTidalVector: ITidalVector = { dq: 1, dr: 0, angle: 0, speed: 1.0 };

  constructor(initialConfig?: Partial<IGeologicalConfig>) {
    if (initialConfig) {
      this.config = { ...this.config, ...initialConfig };
    }
  }

  public getConfig(): Readonly<IGeologicalConfig> {
    return this.config;
  }

  public setConfig(update: Partial<IGeologicalConfig>): void {
    this.config = { ...this.config, ...update };
  }

  public getActiveEvents(): readonly IGeologicalEventRecord[] {
    return this.activeEvents;
  }

  public getEventHistory(): readonly IGeologicalEventRecord[] {
    return this.eventHistory;
  }

  public step(world: SimulationWorld, tick: number, prng: IPrng): void {
    // 1. Update and expire ongoing active events
    this.activeSurgeEnergyBoost = 0;
    this.activeToxicPlumeOverride = false;
    this.activeCryogenicCooling = false;
    this.activePrecursorWarning = false;

    const remaining: IGeologicalEventRecord[] = [];
    for (const ev of this.activeEvents) {
      ev.ticksRemaining--;

      if (ev.type === GeologicalEventType.HYDROTHERMAL_SURGE && ev.ticksRemaining > 0) {
        this.activeSurgeEnergyBoost = Math.max(this.activeSurgeEnergyBoost, ev.magnitude);
      }
      if (ev.type === GeologicalEventType.TOXIC_HEAVY_METAL_SPIKE && ev.ticksRemaining > 0) {
        this.activeToxicPlumeOverride = true;
      }
      if (ev.type === GeologicalEventType.CRYOGENIC_DOWNWELLING && ev.ticksRemaining > 0) {
        this.activeCryogenicCooling = true;
      }

      if (ev.ticksRemaining > 0) {
        remaining.push(ev);
      }
    }
    this.activeEvents = remaining;

    // Hydrothermal conduit mineral scaling & avulsion pressure
    const vent = world.getVent();
    vent.accumulateChoking(0.001);
    if (vent.isConduitChoked()) {
      this.executeVentMigration(world, tick, prng);
    }

    // 2. Continual Planetary Tidal Oscillation (Semi-diurnal period ~180 ticks)
    const tidalAngle = (tick / 180) * 2 * Math.PI;
    const dq = Math.round(Math.cos(tidalAngle));
    const dr = Math.round(Math.sin(tidalAngle));
    this.currentTidalVector = {
      dq,
      dr,
      angle: tidalAngle,
      speed: 0.8 + 0.4 * Math.sin(tidalAngle * 2)
    };

    // 3. Autonomous Geological Stochastic Events (Poisson process scaled by master rate)
    if (this.config.masterActivityRate > 0) {
      // Base check frequency: average interval = 80 ticks / masterActivityRate
      // At master rate 0.20 -> average interval ~400 ticks
      // At master rate 0.50 -> average interval ~160 ticks
      // At master rate 1.00 -> average interval ~80 ticks
      const threshold = (this.config.masterActivityRate * 0.0125);
      if (prng.nextFloat() < threshold) {
        this.rollAndTriggerRandomEvent(world, tick, prng);
      }
    }
  }

  private rollAndTriggerRandomEvent(world: SimulationWorld, tick: number, prng: IPrng): void {
    const weights: { type: GeologicalEventType; weight: number }[] = [
      { type: GeologicalEventType.MAGMATIC_TREMOR, weight: this.config.earthquakeRate },
      { type: GeologicalEventType.PILLOW_LAVA_FLOW, weight: this.config.lavaFlowRate },
      { type: GeologicalEventType.CHIMNEY_SPALLING, weight: this.config.chimneySpallingRate },
      { type: GeologicalEventType.HYDROTHERMAL_SURGE, weight: this.config.hydrothermalSurgeRate },
      { type: GeologicalEventType.TOXIC_HEAVY_METAL_SPIKE, weight: this.config.toxicSpikeRate },
      { type: GeologicalEventType.TIDAL_CURRENT_SHEAR, weight: this.config.tidalCurrentRate },
      { type: GeologicalEventType.MARINE_SNOW_STORM, weight: this.config.marineSnowRate },
      { type: GeologicalEventType.VENT_ORIFICE_MIGRATION, weight: this.config.ventMigrationRate },
      { type: GeologicalEventType.CRYOGENIC_DOWNWELLING, weight: this.config.cryogenicDownwellingRate }
    ];

    const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
    if (totalWeight <= 0) return;

    let roll = prng.nextFloat() * totalWeight;
    let selectedType = weights[0].type;
    for (const item of weights) {
      if (roll < item.weight) {
        selectedType = item.type;
        break;
      }
      roll -= item.weight;
    }

    this.triggerEvent(selectedType, world, tick, prng);
  }

  public triggerEvent(
    type: GeologicalEventType,
    world: SimulationWorld,
    tick: number,
    prng?: IPrng
  ): IGeologicalEventRecord | null {
    const localPrng = prng ?? new Mulberry32Prng((Date.now() ^ (tick * 31)) >>> 0);

    switch (type) {
      case GeologicalEventType.MAGMATIC_TREMOR:
        return this.executeMagmaticTremor(world, tick, localPrng);
      case GeologicalEventType.PILLOW_LAVA_FLOW:
        return this.executePillowLavaFlow(world, tick, localPrng);
      case GeologicalEventType.CHIMNEY_SPALLING:
        return this.executeChimneySpalling(world, tick, localPrng);
      case GeologicalEventType.HYDROTHERMAL_SURGE:
        return this.executeHydrothermalSurge(world, tick);
      case GeologicalEventType.TOXIC_HEAVY_METAL_SPIKE:
        return this.executeToxicSpike(world, tick);
      case GeologicalEventType.TIDAL_CURRENT_SHEAR:
        return this.executeTidalShear(world, tick, localPrng);
      case GeologicalEventType.MARINE_SNOW_STORM:
        return this.executeMarineSnow(world, tick, localPrng);
      case GeologicalEventType.VENT_ORIFICE_MIGRATION:
        return this.executeVentMigration(world, tick, localPrng);
      case GeologicalEventType.CRYOGENIC_DOWNWELLING:
        return this.executeCryogenicDownwelling(world, tick);
    }
  }

  // --- 1. Magmatic Tremor / Subsea Earthquake ---
  // --- 1. Magmatic Tremor / Subsea Earthquake & Fault Rifting ---
  private executeMagmaticTremor(world: SimulationWorld, tick: number, prng: IPrng): IGeologicalEventRecord {
    const pores = world.getAllPores();
    const basaltPores = pores.filter(p => p.coord.z === 0 && p.isBasalt());
    const affected: HexCoord3D[] = [];

    // 1. Shatter 2 to 5 solid basalt pores into habitable rock pores (micro-cavities/nooks)
    const count = Math.min(basaltPores.length, 2 + Math.floor(prng.nextFloat() * 4));
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(prng.nextFloat() * basaltPores.length);
      const chosen = basaltPores.splice(idx, 1)[0];
      if (chosen) {
        world.excavateHabitablePore(chosen.coord);
        affected.push(chosen.coord);
      }
    }

    // 2. Tectonic Rift Faulting (Fissures, Trenches & Alcoves):
    // In elevated ridges or plateaus (z >= 1), seismic rifting cracks open fissures,
    // converting solid barrier rock into habitable crevices or fault-trench alcoves
    const elevatedBasalt = pores.filter(p => p.coord.z >= 1 && p.isBasalt());
    if (elevatedBasalt.length > 0 && prng.nextFloat() < 0.65) {
      const riftChosen = elevatedBasalt[Math.floor(prng.nextFloat() * elevatedBasalt.length)];
      world.excavateHabitablePore(riftChosen.coord);
      affected.push(riftChosen.coord);
    }

    // 3. Subterranean Fault Rifting & Deep Trench Fracturing (z < 0):
    // If subterranean stratum exists, seismic rifting tears open subterranean bedrock into habitable trenches
    if (world.getMinZ() < 0 && prng.nextFloat() < 0.60) {
      const subBasalt = pores.filter(p => p.coord.z === world.getMinZ() && p.isBasalt());
      if (subBasalt.length > 0) {
        const subChosen = subBasalt[Math.floor(prng.nextFloat() * subBasalt.length)];
        world.excavateHabitablePore(subChosen.coord);
        const pAbove = world.getPore(new HexCoord3D(subChosen.coord.q, subChosen.coord.r, 0));
        if (pAbove && !pAbove.isBasalt() && pAbove.getState() === PoreState.EMPTY && !pAbove.hasSpore()) {
          pAbove.setMedium(PoreMedium.AQUEOUS_FLUID);
        }
        affected.push(subChosen.coord);
      }
    }

    const rec = this.createRecord(
      GeologicalEventType.MAGMATIC_TREMOR,
      tick,
      'Magmatic Tremor & Rifting',
      {
        description: `Seismic rifting shattered ${affected.length} basalt pores into habitable rock crevices and fissures.`,
        icon: '⚡',
        affectedCoords: affected,
        magnitude: 1.0,
        durationTicks: 15
      }
    );
    this.registerEvent(rec);
    return rec;
  }

  // --- 2. Pillow Basalt Lava Flow / Resurfacing & Spire Accretion ---
  private executePillowLavaFlow(world: SimulationWorld, tick: number, prng: IPrng): IGeologicalEventRecord {
    const pores = world.getAllPores();
    const nozzle = world.getVent().nozzleCoord;
    const seabedPores = pores.filter(p => p.coord.z === 0 && p.coord.distanceTo(nozzle) >= 2);
    const affected: HexCoord3D[] = [];

    if (seabedPores.length > 0) {
      const epicenterPore = seabedPores[Math.floor(prng.nextFloat() * seabedPores.length)];
      const epicenter = epicenterPore.coord;
      const patch = [epicenter, ...epicenter.getPlanarNeighbors()].filter(c => c.distanceTo(nozzle) >= 2);

      // 1. Resurface seafloor with solid basalt sheet
      for (const coord of patch) {
        const pore = world.getPore(coord);
        if (pore && !pore.isBasalt() && pore.coord.z === 0) {
          world.setPoreBasalt(coord, true);
          affected.push(coord);
        }
      }

      // 2. Vertical Volcanic Accretion (Pillow Basalt Spire & Mound Growth):
      // Magmatic pressure forces lava upward, cooling against cold abyssal seawater into an elevated spire
      const maxZ = world.getMaxZ();
      if (maxZ >= 2) {
        let currentH = 0;
        for (let z = 1; z <= maxZ; z++) {
          const p = world.getPore(new HexCoord3D(epicenter.q, epicenter.r, z));
          if (p && !p.isAqueous()) currentH = z;
        }
        const maxAccretionH = Math.max(2, Math.min(maxZ - 1, Math.round(maxZ * 0.60)));
        if (currentH < maxAccretionH && prng.nextFloat() < 0.75) {
          const nextZ = currentH + 1;
          const spireCoord = new HexCoord3D(epicenter.q, epicenter.r, nextZ);
          world.setPoreBasalt(spireCoord, true);
          affected.push(spireCoord);

          // Also accrete flanking pillow basalt on adjacent neighbor
          if (nextZ >= 2 && prng.nextFloat() < 0.55) {
            const neighbors = epicenter.getPlanarNeighbors().filter(c => c.distanceTo(nozzle) >= 2);
            if (neighbors.length > 0) {
              const flank = neighbors[Math.floor(prng.nextFloat() * neighbors.length)];
              const flankCoord = new HexCoord3D(flank.q, flank.r, nextZ - 1);
              const flankPore = world.getPore(flankCoord);
              if (flankPore && flankPore.isAqueous()) {
                world.setPoreBasalt(flankCoord, true);
                affected.push(flankCoord);
              }
            }
          }
        }
      }

      const rec = this.createRecord(
        GeologicalEventType.PILLOW_LAVA_FLOW,
        tick,
        'Pillow Basalt Lava Extrusion',
        {
          description: `Subsea volcanic lava flow flooded ${affected.length} pores, paving basalt crust and accreting volcanic spires.`,
          icon: '🌋',
          epicenter,
          affectedCoords: affected,
          magnitude: 1.5,
          durationTicks: 25
        }
      );
      this.registerEvent(rec);
      return rec;
    }

    return this.createRecord(GeologicalEventType.PILLOW_LAVA_FLOW, tick, 'Lava Flow', {
      description: 'No eligible pores',
      icon: '🌋',
      affectedCoords: [],
      magnitude: 0,
      durationTicks: 1
    });
  }

  // --- 3. Chimney Spalling / Structural Calving ---
  private executeChimneySpalling(world: SimulationWorld, tick: number, prng: IPrng): IGeologicalEventRecord {
    const pores = world.getAllPores();
    // Group all elevated solid substrate pores (z >= 1) by planar (q, r) column
    const elevatedColumns = new Map<string, typeof pores[0][]>();
    for (const p of pores) {
      if (p.coord.z >= 1 && !p.isAqueous()) {
        const key = `${p.coord.q},${p.coord.r}`;
        const list = elevatedColumns.get(key) ?? [];
        list.push(p);
        elevatedColumns.set(key, list);
      }
    }

    const affected: HexCoord3D[] = [];

    if (elevatedColumns.size > 0) {
      const keys = Array.from(elevatedColumns.keys());
      const chosenKey = keys[Math.floor(prng.nextFloat() * keys.length)];
      const colPores = elevatedColumns.get(chosenKey)!;
      // Find the TOPMOST solid block in this column so calving collapses the summit, leaving no floating remnants
      colPores.sort((a, b) => b.coord.z - a.coord.z);
      const spalled = colPores[0];

      // Safely account for any resident, carcass, or spore before collapsing into aqueous water column
      const ledger = world.getLedger();
      const resident = spalled.getResident();
      if (resident) {
        const snap = resident.getBattery().getSnapshot();
        ledger.recordHeatDissipation(snap.energy);
        ledger.recordMatterSedimentation(snap.matter);
      }
      const carcass = spalled.getCarcass();
      if (carcass) {
        ledger.recordHeatDissipation(carcass[0]);
        ledger.recordMatterSedimentation(carcass[1]);
      }
      const spore = spalled.getSpore();
      if (spore) {
        ledger.recordHeatDissipation(spore.energy);
        ledger.recordMatterSedimentation(spore.matter);
      }
      spalled.clear();

      // Collapse into empty water column at summit
      spalled.setMedium(PoreMedium.AQUEOUS_FLUID);
      spalled.setBasalt(false);
      world.getGrid().removeBasaltObstacle(spalled.coord);
      affected.push(spalled.coord);

      // Rain mineral detritus down to seabed beneath the spalling point
      const baseCoord = new HexCoord3D(spalled.coord.q, spalled.coord.r, 0);
      if (world.depositDetritus(baseCoord, 20, 10)) {
        affected.push(baseCoord);
      }
    }

    const rec = this.createRecord(
      GeologicalEventType.CHIMNEY_SPALLING,
      tick,
      'Chimney Wall Spalling & Calving',
      {
        description: 'Brittle hydrothermal mineral chimney walls collapsed, showering mineral detritus onto seabed below.',
        icon: '🏔️',
        affectedCoords: affected,
        magnitude: 1.0,
        durationTicks: 18
      }
    );
    this.registerEvent(rec);
    return rec;
  }

  // --- 4. Hydrothermal Boiling Surge ---
  private executeHydrothermalSurge(world: SimulationWorld, tick: number): IGeologicalEventRecord {
    world.triggerThermalSurge(300);
    this.activeSurgeEnergyBoost = 250;

    // Mineral Precipitation: Hydrothermal mineral precipitation reinforces and repairs chimney conduits
    world.setVentConfiguration(world.getVent().nozzleCoord, world.getVent().getOffshoots().length);

    const rec = this.createRecord(
      GeologicalEventType.HYDROTHERMAL_SURGE,
      tick,
      'Hydrothermal Boiling Megasurge',
      {
        description: 'Superheated subterranean magmatic fluids burst through chimney spires, supercharging redox chemical streams.',
        icon: '🔥',
        epicenter: world.getVent().nozzleCoord,
        affectedCoords: [world.getVent().nozzleCoord],
        magnitude: 250,
        durationTicks: 40
      }
    );
    this.registerEvent(rec);
    return rec;
  }

  // --- 5. Toxic Heavy Metal & Sulfide Incursion ---
  private executeToxicSpike(world: SimulationWorld, tick: number): IGeologicalEventRecord {
    this.activeToxicPlumeOverride = true;

    const rec = this.createRecord(
      GeologicalEventType.TOXIC_HEAVY_METAL_SPIKE,
      tick,
      'Heavy Metal & H₂S Acid Purge',
      {
        description: 'Acidic volatile volcanic gases and toxic heavy metals saturated the hydrothermal plume. Unshielded cells suffer Landauer corrosion.',
        icon: '☣️',
        epicenter: world.getVent().nozzleCoord,
        affectedCoords: [world.getVent().nozzleCoord],
        magnitude: 1.0,
        durationTicks: 35
      }
    );
    this.registerEvent(rec);
    return rec;
  }

  // --- 6. Abyssal Tidal Current Shear ---
  private executeTidalShear(world: SimulationWorld, tick: number, prng: IPrng): IGeologicalEventRecord {
    const angle = prng.nextFloat() * 2 * Math.PI;
    const dq = Math.round(Math.cos(angle));
    const dr = Math.round(Math.sin(angle));
    this.currentTidalVector = { dq, dr, angle, speed: 2.2 };

    // Advect pelagic spores in the current vector direction
    const pores = world.getAllPores();
    const sporePores = pores.filter(p => p.hasSpore());
    for (const sp of sporePores) {
      const spore = sp.getSpore();
      if (!spore) continue;
      const targetCoord = new HexCoord3D(sp.coord.q + dq, sp.coord.r + dr, sp.coord.z);
      const targetPore = world.getPore(targetCoord);
      if (targetPore && targetPore.isAqueous() && !targetPore.hasSpore()) {
        targetPore.setSpore(spore);
        sp.setSpore(null);
      }
    }

    const rec = this.createRecord(
      GeologicalEventType.TIDAL_CURRENT_SHEAR,
      tick,
      'Abyssal Tidal Current Surge',
      {
        description: `Planetary baroclinic tides accelerated water column currents, advecting pelagic spores across benthic chimneys.`,
        icon: '🌊',
        affectedCoords: sporePores.map(p => p.coord),
        magnitude: 2.0,
        durationTicks: 30
      }
    );
    this.registerEvent(rec);
    return rec;
  }

  // --- 7. Marine Snow & Detrital Floc Storm ---
  private executeMarineSnow(world: SimulationWorld, tick: number, prng: IPrng): IGeologicalEventRecord {
    const pores = world.getAllPores();
    const emptySeabed = pores.filter(p => p.coord.z === 0 && !p.isBasalt() && p.getState() === PoreState.EMPTY);
    const affected: HexCoord3D[] = [];

    // Precipitate 4 to 8 organic detrital carcasses
    const count = Math.min(emptySeabed.length, 4 + Math.floor(prng.nextFloat() * 5));
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(prng.nextFloat() * emptySeabed.length);
      const chosen = emptySeabed.splice(idx, 1)[0];
      if (chosen) {
        // Inoculate detrital carcass with conserved energy and matter
        const carcassEnergy = 25 + Math.floor(prng.nextFloat() * 20);
        const carcassMatter = 12 + Math.floor(prng.nextFloat() * 10);
        if (world.depositDetritus(chosen.coord, carcassEnergy, carcassMatter)) {
          affected.push(chosen.coord);
        }
      }
    }

    const rec = this.createRecord(
      GeologicalEventType.MARINE_SNOW_STORM,
      tick,
      'Marine Snow & Pelagic Detrital Rain',
      {
        description: `Organic detrital flocculent showered down from the upper ocean water column, depositing nutrient carcasses across ${affected.length} pores.`,
        icon: '❄️',
        affectedCoords: affected,
        magnitude: 1.0,
        durationTicks: 25
      }
    );
    this.registerEvent(rec);
    return rec;
  }

  // --- 8. Chimney Vent Clogging & Orifice Migration ---
  private executeVentMigration(world: SimulationWorld, tick: number, prng: IPrng): IGeologicalEventRecord {
    const vent = world.getVent();
    const curNozzle = vent.nozzleCoord;
    const offshoots = vent.getOffshoots();

    let newNozzle = curNozzle;
    if (offshoots.length > 0) {
      newNozzle = offshoots[Math.floor(prng.nextFloat() * offshoots.length)];
    } else {
      const neighbors = curNozzle.getPlanarNeighbors().filter(c => c.distanceTo(new HexCoord3D(0, 0, 0)) <= world.getRadius() - 1);
      if (neighbors.length > 0) {
        newNozzle = neighbors[Math.floor(prng.nextFloat() * neighbors.length)];
      }
    }

    world.setVentConfiguration(newNozzle, offshoots.length);
    vent.triggerConduitBlowout();

    const rec = this.createRecord(
      GeologicalEventType.VENT_ORIFICE_MIGRATION,
      tick,
      'Vent Mineral Clogging & Avulsion',
      {
        description: `Mineral precipitation plugged the primary chimney conduit; hydrothermal fluid avulsed to new orifice at [${newNozzle.q}, ${newNozzle.r}].`,
        icon: '🔄',
        epicenter: newNozzle,
        affectedCoords: [curNozzle, newNozzle],
        magnitude: 1.0,
        durationTicks: 40
      }
    );
    this.registerEvent(rec);
    return rec;
  }

  // --- 9. Cryogenic Abyssal Downwelling ---
  private executeCryogenicDownwelling(world: SimulationWorld, tick: number): IGeologicalEventRecord {
    this.activeCryogenicCooling = true;

    const rec = this.createRecord(
      GeologicalEventType.CRYOGENIC_DOWNWELLING,
      tick,
      'Cryogenic Abyssal Incursion',
      {
        description: 'Dense near-freezing (1.8°C) abyssal bottom water engulfed the hydrothermal depression, creating extreme thermal shock.',
        icon: '🧊',
        epicenter: world.getVent().nozzleCoord,
        affectedCoords: [world.getVent().nozzleCoord],
        magnitude: 1.0,
        durationTicks: 30
      }
    );
    this.registerEvent(rec);
    return rec;
  }

  private createRecord(
    type: GeologicalEventType,
    tick: number,
    title: string,
    options: {
      readonly description: string;
      readonly icon: string;
      readonly epicenter?: HexCoord3D;
      readonly affectedCoords?: readonly HexCoord3D[];
      readonly magnitude?: number;
      readonly durationTicks?: number;
    }
  ): IGeologicalEventRecord {
    const {
      description,
      icon,
      epicenter,
      affectedCoords,
      magnitude = 1.0,
      durationTicks = 20
    } = options;
    return {
      id: `geo-${GeologicalPressuresEngine.eventSequence++}`,
      type,
      tick,
      title,
      description,
      icon,
      epicenter,
      affectedCoords,
      magnitude,
      durationTicks,
      ticksRemaining: durationTicks
    };
  }

  public addEventListener(listener: GeologicalEventListener): () => void {
    this.eventListeners.push(listener);
    return () => {
      const idx = this.eventListeners.indexOf(listener);
      if (idx >= 0) this.eventListeners.splice(idx, 1);
    };
  }

  private registerEvent(rec: IGeologicalEventRecord): void {
    this.activeEvents.push(rec);
    this.eventHistory.unshift(rec);
    if (this.eventHistory.length > 50) {
      this.eventHistory.pop();
    }
    for (const listener of this.eventListeners) {
      try {
        listener(rec);
      } catch (err) {
        console.error('Error in GeologicalEventListener:', err);
      }
    }
  }
}
