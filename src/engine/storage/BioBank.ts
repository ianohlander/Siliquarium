/**
 * 🐠 Siliquarium Storage & Paleontology Subsystem
 * BioBank: Cross-Simulation Cryo-Vault & Inoculation Registry.
 * 
 * Allows researchers to freeze, archive, and transfer living Silicoid lineages
 * across simulation runs. Enables Richard Lenski LTEE-style competition trials
 * (thawing ancestral Generation 0 strains to compete against evolved 50k-epoch descendants).
 */

import { TaxonomyNomenclature } from '../../core/paleontology/TaxonomyNomenclature.js';

import { IPersistenceStorage, MemoryPersistenceStorage } from './IPersistenceStorage.js';

export interface ISavedSilicoid {
  readonly id: string;
  readonly name: string;
  readonly taxonBinomial: string;
  readonly commonName: string;
  readonly tapeBitstring: string;
  readonly gateCount: number;
  readonly gateTypes: readonly string[];
  readonly generation: number;
  readonly savedAtEpoch: number;
  readonly timestamp: number;
  readonly notes?: string;
  readonly isDifferentiated?: boolean;
  readonly bodyTopology?: string;
}

export class BioBank {
  private static readonly STORAGE_KEY = 'siliquarium_biobank_v1';
  private static instance: BioBank | null = null;

  private specimens: Map<string, ISavedSilicoid> = new Map();
  private activeInoculantId: string | null = null;
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
    this.loadFromStorage();
    if (this.specimens.size === 0) {
      this.seedDefaultStrains();
    }
    // Set default active inoculant to first strain
    const first = this.specimens.values().next().value;
    if (first) {
      this.activeInoculantId = first.id;
    }
  }

  public static getInstance(): BioBank {
    if (!BioBank.instance) {
      BioBank.instance = new BioBank();
    }
    return BioBank.instance;
  }

  public onBankChanged(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify(): void {
    this.listeners.forEach(fn => fn());
  }

  public getAll(): readonly ISavedSilicoid[] {
    return Array.from(this.specimens.values()).sort((a, b) => b.timestamp - a.timestamp);
  }

  public getById(id: string): ISavedSilicoid | null {
    return this.specimens.get(id) ?? null;
  }

  public getActiveInoculant(): ISavedSilicoid | null {
    if (!this.activeInoculantId) {
      const first = this.specimens.values().next().value;
      return first ?? null;
    }
    return this.specimens.get(this.activeInoculantId) ?? null;
  }

  public setActiveInoculant(id: string | null): void {
    this.activeInoculantId = id;
    this.notify();
  }

  /**
   * Freezes a living silicoid specimen into the persistent Bio-Bank.
   */
  public saveSilicoid(specimen: {
    name?: string;
    taxonBinomial?: string;
    commonName?: string;
    tapeBitstring: string;
    gateCount?: number;
    gateTypes?: readonly string[];
    generation?: number;
    savedAtEpoch?: number;
    notes?: string;
    isDifferentiated?: boolean;
    bodyTopology?: string;
  }): ISavedSilicoid {
    const id = `cryo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const gates = specimen.gateTypes ?? [];
    const taxon = TaxonomyNomenclature.classify({
      tapeBitstring: specimen.tapeBitstring,
      gateTypes: gates,
      generation: specimen.generation ?? 0,
      isBasalt: false,
      hasOrganelle: false,
      isSyncytium: specimen.bodyTopology !== undefined,
      isDifferentiated: specimen.isDifferentiated ?? false
    });

    const record: ISavedSilicoid = {
      id,
      name: specimen.name?.trim() || taxon.binomialName,
      taxonBinomial: specimen.taxonBinomial || taxon.binomialName,
      commonName: specimen.commonName || taxon.commonName,
      tapeBitstring: specimen.tapeBitstring,
      gateCount: specimen.gateCount ?? gates.length,
      gateTypes: gates,
      generation: specimen.generation ?? 0,
      savedAtEpoch: specimen.savedAtEpoch ?? 0,
      timestamp: Date.now(),
      notes: specimen.notes,
      isDifferentiated: specimen.isDifferentiated,
      bodyTopology: specimen.bodyTopology
    };

    this.specimens.set(id, record);
    this.activeInoculantId = id;
    this.saveToStorage();
    this.notify();
    return record;
  }

  public deleteSilicoid(id: string): boolean {
    const deleted = this.specimens.delete(id);
    if (deleted) {
      if (this.activeInoculantId === id) {
        const next = this.specimens.values().next().value;
        this.activeInoculantId = next ? next.id : null;
      }
      this.saveToStorage();
      this.notify();
    }
    return deleted;
  }

  public exportJSON(): string {
    const data = {
      schema: 'siliquarium_biobank_v1',
      exportedAt: new Date().toISOString(),
      strains: Array.from(this.specimens.values())
    };
    return JSON.stringify(data, null, 2);
  }

  public importJSON(jsonStr: string): number {
    try {
      const data = JSON.parse(jsonStr);
      const strains: ISavedSilicoid[] = Array.isArray(data) ? data : data.strains;
      if (!Array.isArray(strains)) return 0;

      let imported = 0;
      for (const s of strains) {
        if (s && typeof s.tapeBitstring === 'string' && s.tapeBitstring.length >= 36) {
          const id = s.id || `cryo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
          this.specimens.set(id, {
            ...s,
            id,
            timestamp: s.timestamp || Date.now()
          });
          imported++;
        }
      }
      if (imported > 0) {
        this.saveToStorage();
        this.notify();
      }
      return imported;
    } catch {
      return 0;
    }
  }

  private loadFromStorage(): void {
    try {
      const raw = this.storage.getItem(BioBank.STORAGE_KEY);
      if (!raw) return;
      const parsed: ISavedSilicoid[] = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          this.specimens.set(item.id, item);
        }
      }
    } catch {
      // Graceful fallback to memory
    }
  }

  private saveToStorage(): void {
    try {
      const array = Array.from(this.specimens.values());
      this.storage.setItem(BioBank.STORAGE_KEY, JSON.stringify(array));
    } catch {
      // Storage quota or headless fallback
    }
  }

  private seedDefaultStrains(): void {
    // 1. Lenski Ancestor Zero (Gen 0 Minimal Baseline Lithotroph)
    // 60-bit genome with Porin A (32), Porin B (38), Sink Battery (50), Introns (56..59)
    const tapeAncestor = '100000' + '100110' + '110010' + '111000'.repeat(7);
    this.saveSilicoid({
      name: 'Lenski Ancestor Zero (Gen 0)',
      taxonBinomial: 'Lithomicrobium lanei var. ancestralis',
      commonName: 'Lenski LTEE Unmutated Progenitor',
      tapeBitstring: tapeAncestor,
      gateCount: 0,
      gateTypes: [],
      generation: 0,
      savedAtEpoch: 0,
      notes: 'Standardized reference strain for Richard Lenski Long-Term Evolution Experiments (LTEE). Zero gates, extreme Landauer thrift.'
    });

    // 2. Co-Catalytic Vent Autotroph (Mitchell PMF Specialist)
    // AND gate (0) + Porin A + Porin B + Sink Battery + Introns
    const tapeMitchell = '000000' + '100000' + '100110' + '110010' + '111000'.repeat(6);
    this.saveSilicoid({
      name: 'Mitchell Chemiosmotic Feeder',
      taxonBinomial: 'Ventricola mitchellii',
      commonName: "Mitchell's Co-Catalytic Vent Feeder",
      tapeBitstring: tapeMitchell,
      gateCount: 1,
      gateTypes: ['AND'],
      generation: 142,
      savedAtEpoch: 1500,
      notes: 'Thriving chimney throat specialist with high ATP yield and active Stream A/B co-catalysis.'
    });

    // 3. Wolpert Dendritic Metazoan Progenitor (GRN Division of Labor)
    // Stream A (32) + Stream B (38) + NOT Gate (12) + AND Gate (0) + FtsZ Septum (52) + Battery (50) + Regulatory Operator (60) + Operon 1
    const tapeWolpert = '100000' + '100110' + '001100' + '000000' + '110100' + '110010' + '111100' + '100000' + '100110' + '110010';
    this.saveSilicoid({
      name: 'Wolpert Branching Metazoan',
      taxonBinomial: 'Metazoicladus wolpertii',
      commonName: "Wolpert's Differentiated Metazoan",
      tapeBitstring: tapeWolpert,
      gateCount: 2,
      gateTypes: ['NOT', 'AND'],
      generation: 3450,
      savedAtEpoch: 25000,
      notes: 'Multicellular metazoan with spatial GRN developmental switching, expressing distinct Trophocyte and Somatic Shield tissues.',
      isDifferentiated: true,
      bodyTopology: 'DENDRITIC'
    });
  }
}
