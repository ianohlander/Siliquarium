/**
 * 🐠 Siliquarium Storage Subsystem
 * EnvironmentPresetRegistry: Persistence, Presets, and Serialization for Custom Siliquaria.
 * Implements Siliquarium Design Studio & World Builder specification:
 * - Standardized .siliquarium JSON schema.
 * - 5 Pre-Engineered Geological Templates (Twin Smokers, Abyssal Trench, Alkaline Mound, Labyrinth, Lenski Chamber).
 * - Browser localStorage caching and import/export capabilities for reproducible evolutionary experiments.
 */

import { IPersistenceStorage, MemoryPersistenceStorage } from './IPersistenceStorage.js';

export interface IVentConfig {
  readonly q: number;
  readonly r: number;
  readonly z: number;
  readonly height: number;
  readonly streamA?: boolean;
  readonly streamB?: boolean;
  readonly toxinT?: boolean;
}

export interface IFounderStrainInoculation {
  readonly strainId?: string;
  readonly name: string;
  readonly taxonBinomial: string;
  readonly tapeBitstring: string;
  readonly q: number;
  readonly r: number;
  readonly z: number;
  readonly energy?: number;
  readonly matter?: number;
}

export interface ISiliquariumEnvironmentPreset {
  readonly version: string; // "1.0.0"
  readonly id: string;
  readonly name: string;
  readonly author: string;
  readonly createdAt: number;
  readonly description: string;
  readonly isBuiltIn?: boolean;

  readonly grid: {
    readonly radius: number;
    readonly minZ?: number;
    readonly maxZ?: number;
    readonly vents: readonly IVentConfig[];
    readonly basaltCoords: readonly { q: number; r: number; z: number }[];
    readonly trenchCoords?: readonly { q: number; r: number; z: number }[];
  };

  readonly environment: {
    readonly baseTemperature: number;
    readonly landauerMultiplier?: number;
    readonly eventVolatility: number;
    readonly plumeWandering?: boolean;
    readonly regimeCycling?: boolean;
    readonly geodynamics?: {
      readonly earthquakeRate?: number;
      readonly lavaFlowRate?: number;
      readonly chimneySpallingRate?: number;
      readonly hydrothermalSurgeRate?: number;
      readonly toxicSpikeRate?: number;
      readonly tidalCurrentRate?: number;
      readonly marineSnowRate?: number;
      readonly ventMigrationRate?: number;
      readonly cryogenicDownwellingRate?: number;
    };
  };

  readonly founderStrains?: readonly IFounderStrainInoculation[];
}

export class EnvironmentPresetRegistry {
  private static readonly STORAGE_KEY = 'siliquarium_custom_presets_v1';
  private static instance: EnvironmentPresetRegistry | null = null;

  private presets: Map<string, ISiliquariumEnvironmentPreset> = new Map();
  private activePresetId: string = 'twin-smokers';
  private readonly listeners: Set<() => void> = new Set();
  private storage: IPersistenceStorage = new MemoryPersistenceStorage();

  /**
   * Sets custom persistence storage (e.g. BrowserLocalStorageProvider in UI).
   */
  public setStorage(storage: IPersistenceStorage): void {
    this.storage = storage;
    this.loadFromStorage();
  }

  private constructor() {
    this.registerBuiltInPresets();
    this.loadFromStorage();
  }

  public static getInstance(): EnvironmentPresetRegistry {
    if (!EnvironmentPresetRegistry.instance) {
      EnvironmentPresetRegistry.instance = new EnvironmentPresetRegistry();
    }
    return EnvironmentPresetRegistry.instance;
  }

  public onChange(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify(): void {
    this.listeners.forEach(fn => fn());
  }

  public getAll(): readonly ISiliquariumEnvironmentPreset[] {
    return Array.from(this.presets.values());
  }

  public getById(id: string): ISiliquariumEnvironmentPreset | null {
    return this.presets.get(id) ?? null;
  }

  public getActivePreset(): ISiliquariumEnvironmentPreset {
    return this.presets.get(this.activePresetId) ?? this.presets.get('twin-smokers')!;
  }

  public setActivePresetId(id: string): boolean {
    if (this.presets.has(id)) {
      this.activePresetId = id;
      this.notify();
      return true;
    }
    return false;
  }

  public savePreset(preset: ISiliquariumEnvironmentPreset): void {
    this.presets.set(preset.id, preset);
    this.activePresetId = preset.id;
    this.saveToStorage();
    this.notify();
  }

  public deletePreset(id: string): boolean {
    const existing = this.presets.get(id);
    if (!existing || existing.isBuiltIn) return false;
    this.presets.delete(id);
    if (this.activePresetId === id) {
      this.activePresetId = 'twin-smokers';
    }
    this.saveToStorage();
    this.notify();
    return true;
  }

  public exportToJson(preset: ISiliquariumEnvironmentPreset): string {
    return JSON.stringify(preset, null, 2);
  }

  public importFromJson(jsonString: string): ISiliquariumEnvironmentPreset {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.id || !parsed.name || !parsed.grid || typeof parsed.grid.radius !== 'number') {
        throw new Error('Invalid .siliquarium preset format: missing required metadata or grid definition.');
      }
      const preset: ISiliquariumEnvironmentPreset = {
        version: parsed.version || '1.0.0',
        id: parsed.id.startsWith('user_') ? parsed.id : `user_${parsed.id}_${Date.now()}`,
        name: parsed.name,
        author: parsed.author || 'Imported User',
        createdAt: parsed.createdAt || Date.now(),
        description: parsed.description || 'Imported custom siliquarium environment.',
        isBuiltIn: false,
        grid: {
          radius: Math.min(14, Math.max(3, parsed.grid.radius)),
          minZ: parsed.grid.minZ ?? -1,
          maxZ: parsed.grid.maxZ ?? 6,
          vents: Array.isArray(parsed.grid.vents) ? parsed.grid.vents : [],
          basaltCoords: Array.isArray(parsed.grid.basaltCoords) ? parsed.grid.basaltCoords : [],
          trenchCoords: Array.isArray(parsed.grid.trenchCoords) ? parsed.grid.trenchCoords : []
        },
        environment: {
          baseTemperature: parsed.environment?.baseTemperature ?? 350,
          landauerMultiplier: parsed.environment?.landauerMultiplier ?? 1.0,
          eventVolatility: parsed.environment?.eventVolatility ?? 0.20,
          plumeWandering: parsed.environment?.plumeWandering ?? true,
          regimeCycling: parsed.environment?.regimeCycling ?? true,
          geodynamics: parsed.environment?.geodynamics ? {
            earthquakeRate: parsed.environment.geodynamics.earthquakeRate,
            lavaFlowRate: parsed.environment.geodynamics.lavaFlowRate,
            chimneySpallingRate: parsed.environment.geodynamics.chimneySpallingRate,
            hydrothermalSurgeRate: parsed.environment.geodynamics.hydrothermalSurgeRate,
            toxicSpikeRate: parsed.environment.geodynamics.toxicSpikeRate,
            tidalCurrentRate: parsed.environment.geodynamics.tidalCurrentRate,
            marineSnowRate: parsed.environment.geodynamics.marineSnowRate,
            ventMigrationRate: parsed.environment.geodynamics.ventMigrationRate,
            cryogenicDownwellingRate: parsed.environment.geodynamics.cryogenicDownwellingRate
          } : undefined
        },
        founderStrains: Array.isArray(parsed.founderStrains) ? parsed.founderStrains : []
      };

      this.savePreset(preset);
      return preset;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to import Siliquarium preset: ${msg}`);
    }
  }

  private loadFromStorage(): void {
    try {
      const raw = this.storage.getItem(EnvironmentPresetRegistry.STORAGE_KEY);
      if (!raw) return;
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        for (const item of list) {
          if (item && item.id && !this.presets.has(item.id)) {
            this.presets.set(item.id, { ...item, isBuiltIn: false });
          }
        }
      }
    } catch (e) {
      console.warn('Siliquarium: Failed to load custom environment presets from persistence storage.', e);
    }
  }

  private saveToStorage(): void {
    try {
      const customOnly = Array.from(this.presets.values()).filter(p => !p.isBuiltIn);
      this.storage.setItem(EnvironmentPresetRegistry.STORAGE_KEY, JSON.stringify(customOnly));
    } catch (e) {
      console.warn('Siliquarium: Failed to save custom environment presets to persistence storage.', e);
    }
  }

  private registerBuiltInPresets(): void {
    // 1. Twin Smokers Caldera (R=8)
    // Central basalt ridge with north/south basins, each with an active vent
    const twinSmokersBasalt: { q: number; r: number; z: number }[] = [];
    for (let r = -8; r <= 8; r++) {
      if (r !== 0) { // Small central gateway aperture
        twinSmokersBasalt.push({ q: 0, r, z: 0 });
        twinSmokersBasalt.push({ q: 0, r, z: 1 });
      }
    }

    const twinSmokersTrench: { q: number; r: number; z: number }[] = [];
    for (let q = -8; q <= 8; q++) {
      twinSmokersTrench.push({ q, r: 8, z: -1 });
      twinSmokersTrench.push({ q, r: -8, z: -1 });
    }

    this.presets.set('twin-smokers', {
      version: '1.0.0',
      id: 'twin-smokers',
      name: 'Twin Smokers Caldera',
      author: 'Siliquarium Observatory',
      createdAt: 1727800000000,
      description: 'Two distinct hydrothermal chimneys separated by an impassable volcanic ridge for allopatric speciation and head-to-head Lenski competition trials.',
      isBuiltIn: true,
      grid: {
        radius: 8,
        minZ: -1,
        maxZ: 6,
        vents: [
          { q: -3, r: 0, z: 2, height: 3, streamA: true, streamB: true, toxinT: false },
          { q: 3, r: 0, z: 2, height: 3, streamA: true, streamB: true, toxinT: false }
        ],
        basaltCoords: twinSmokersBasalt,
        trenchCoords: twinSmokersTrench
      },
      environment: {
        baseTemperature: 350,
        landauerMultiplier: 1.0,
        eventVolatility: 0.20,
        plumeWandering: true,
        regimeCycling: true
      },
      founderStrains: [
        {
          name: 'Pulsilicon alonii',
          taxonBinomial: 'Pulsilicon alonii',
          tapeBitstring: '100000100110000000110000110100111000111000111000111000111000',
          q: -3,
          r: 0,
          z: 0,
          energy: 60,
          matter: 30
        },
        {
          name: 'Syncytiocladus bonnerii',
          taxonBinomial: 'Syncytiocladus bonnerii',
          tapeBitstring: '100000100110000000010110110000110100111000111000111000111000',
          q: 3,
          r: 0,
          z: 0,
          energy: 60,
          matter: 30
        }
      ]
    });

    // 2. Abyssal Trench & Rift (R=10)
    // Linear rift chasm across r=0 at z=-1
    const abyssalTrench: { q: number; r: number; z: number }[] = [];
    for (let q = -9; q <= 9; q++) {
      abyssalTrench.push({ q, r: 0, z: -1 });
      abyssalTrench.push({ q, r: 1, z: -1 });
    }

    this.presets.set('abyssal-trench', {
      version: '1.0.0',
      id: 'abyssal-trench',
      name: 'Abyssal Trench & Rift',
      author: 'Siliquarium Observatory',
      createdAt: 1727800000000,
      description: 'A deep abyssal rift gouged across the seafloor, generating cold downwelling shear currents and isolated benthic pockets.',
      isBuiltIn: true,
      grid: {
        radius: 10,
        minZ: -1,
        maxZ: 6,
        vents: [
          { q: 0, r: -5, z: 2, height: 4, streamA: true, streamB: true, toxinT: false }
        ],
        basaltCoords: [
          { q: -5, r: 5, z: 0 }, { q: -4, r: 5, z: 0 }, { q: -3, r: 5, z: 0 },
          { q: 5, r: -5, z: 0 }, { q: 4, r: -5, z: 0 }, { q: 3, r: -5, z: 0 }
        ],
        trenchCoords: abyssalTrench
      },
      environment: {
        baseTemperature: 380,
        landauerMultiplier: 1.2,
        eventVolatility: 0.35,
        plumeWandering: true,
        regimeCycling: true
      },
      founderStrains: [
        {
          name: 'Bathyalcladus profundis',
          taxonBinomial: 'Bathyalcladus profundis',
          tapeBitstring: '100000100110000000110000110100111000111000111000111000111000',
          q: 0,
          r: -4,
          z: 0,
          energy: 70,
          matter: 35
        },
        {
          name: 'Hadalis abyssi',
          taxonBinomial: 'Hadalis abyssi',
          tapeBitstring: '100000100110000000010110110000110100111000111000111000111000',
          q: 1,
          r: -5,
          z: 0,
          energy: 70,
          matter: 35
        }
      ]
    });

    // 3. Lane-Martin Alkaline Mound (R=5)
    // Classic single-vent prebiotic origin of life model
    const moundBasalt: { q: number; r: number; z: number }[] = [
      { q: -2, r: 1, z: 0 }, { q: -1, r: 2, z: 0 }, { q: 1, r: 1, z: 0 },
      { q: 2, r: -1, z: 0 }, { q: 1, r: -2, z: 0 }, { q: -1, r: -1, z: 0 }
    ];

    this.presets.set('alkaline-mound', {
      version: '1.0.0',
      id: 'alkaline-mound',
      name: 'Lane-Martin Alkaline Mound',
      author: 'Nick Lane & Michael Russell',
      createdAt: 1727800000000,
      description: 'Classic prebiotic origin-of-life setup. Dense proton-gradient focus for initial abiogenesis and autotrophic emergence.',
      isBuiltIn: true,
      grid: {
        radius: 5,
        minZ: 0,
        maxZ: 5,
        vents: [
          { q: 0, r: 0, z: 2, height: 4, streamA: true, streamB: true, toxinT: false }
        ],
        basaltCoords: moundBasalt
      },
      environment: {
        baseTemperature: 340,
        landauerMultiplier: 1.0,
        eventVolatility: 0.15,
        plumeWandering: false,
        regimeCycling: true
      },
      founderStrains: [
        {
          name: 'Archaeosilicon lanei',
          taxonBinomial: 'Archaeosilicon lanei',
          tapeBitstring: '100000100110000000110000110100111000111000111000111000111000',
          q: 0,
          r: 1,
          z: 0,
          energy: 70,
          matter: 35
        },
        {
          name: 'Protonogradus russellii',
          taxonBinomial: 'Protonogradus russellii',
          tapeBitstring: '100000100110000000010110110000110100111000111000111000111000',
          q: -1,
          r: 0,
          z: 0,
          energy: 70,
          matter: 35
        }
      ]
    });

    // 4. Labyrinthine Caldera (R=8)
    // Winding maze of basalt chambers
    const mazeBasalt: { q: number; r: number; z: number }[] = [];
    for (let q = -6; q <= 6; q += 2) {
      for (let r = -6; r <= 6; r++) {
        if ((q + r) % 3 !== 0) {
          mazeBasalt.push({ q, r, z: 0 });
        }
      }
    }

    this.presets.set('caldera-maze', {
      version: '1.0.0',
      id: 'caldera-maze',
      name: 'Labyrinthine Caldera',
      author: 'Siliquarium Observatory',
      createdAt: 1727800000000,
      description: 'Intricate corridors testing metabolic diffusion, signal propagation, and pelagic spore colonization.',
      isBuiltIn: true,
      grid: {
        radius: 8,
        minZ: 0,
        maxZ: 6,
        vents: [
          { q: -4, r: 0, z: 2, height: 2, streamA: true, streamB: true, toxinT: false },
          { q: 4, r: 0, z: 2, height: 2, streamA: true, streamB: true, toxinT: false },
          { q: 0, r: 4, z: 2, height: 2, streamA: true, streamB: true, toxinT: false }
        ],
        basaltCoords: mazeBasalt
      },
      environment: {
        baseTemperature: 320,
        landauerMultiplier: 1.0,
        eventVolatility: 0.25,
        plumeWandering: true,
        regimeCycling: true
      },
      founderStrains: [
        {
          name: 'Labyrinthosilicon daedalii',
          taxonBinomial: 'Labyrinthosilicon daedalii',
          tapeBitstring: '100000100110000000110000110100111000111000111000111000111000',
          q: -3,
          r: 0,
          z: 0,
          energy: 70,
          matter: 35
        },
        {
          name: 'Minotauros minax',
          taxonBinomial: 'Minotauros minax',
          tapeBitstring: '100000100110000000010110110000110100111000111000111000111000',
          q: 3,
          r: 0,
          z: 0,
          energy: 70,
          matter: 35
        }
      ]
    });

    // 5. Lenski LTEE Benchmark Chamber (R=6)
    // Open, homogeneous benchmark chamber
    this.presets.set('lenski-chamber', {
      version: '1.0.0',
      id: 'lenski-chamber',
      name: 'Lenski LTEE Benchmark Chamber',
      author: 'Richard E. Lenski',
      createdAt: 1727800000000,
      description: 'Homogeneous, non-turbulent benthic chamber calibrated for >100 generation LTEE evolutionary runs and fitness benchmarking.',
      isBuiltIn: true,
      grid: {
        radius: 6,
        minZ: 0,
        maxZ: 4,
        vents: [
          { q: 0, r: 0, z: 1, height: 2, streamA: true, streamB: true, toxinT: false }
        ],
        basaltCoords: []
      },
      environment: {
        baseTemperature: 300,
        landauerMultiplier: 1.0,
        eventVolatility: 0.05,
        plumeWandering: false,
        regimeCycling: false
      },
      founderStrains: [
        {
          name: 'Lenski Ancestor Zero',
          taxonBinomial: 'Archaeosilicon lenskii',
          tapeBitstring: '100000100110000000110000110100111000111000111000111000111000',
          q: -2,
          r: 0,
          z: 0,
          energy: 60,
          matter: 30
        },
        {
          name: 'Lenski Competitor Strain Ara-1',
          taxonBinomial: 'Archaeosilicon mutabilis',
          tapeBitstring: '100000100110000000010110110000110100111000111000111000111000',
          q: 2,
          r: 0,
          z: 0,
          energy: 60,
          matter: 30
        }
      ]
    });
  }
}
