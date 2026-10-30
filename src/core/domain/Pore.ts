/**
 * 🐠 Siliquarium Domain Subsystem
 * Pore: Inorganic Benthic Rock Cavity & Aqueous Fluid Parcel Entity.
 * Holds living cells, carcasses undergoing detritus recycling, pelagic spores, or open cavities.
 */

import { HexCoord3D } from '../spatial/HexCoord3D.js';
import { PoreCell } from './PoreCell.js';
import { GenomeSafe } from './GenomeSafe.js';

export enum PoreState {
  EMPTY = 'EMPTY',
  OCCUPIED = 'OCCUPIED',
  CARCASS = 'CARCASS'
}

export enum PoreMedium {
  ROCK_SUBSTRATE = 'ROCK_SUBSTRATE',
  AQUEOUS_FLUID = 'AQUEOUS_FLUID'
}

export interface ICarcassData {
  energy: number;
  matter: number;
  decayTicksRemaining: number;
}

export interface IPelagicSpore {
  readonly safe: GenomeSafe;
  readonly organelleSafe?: GenomeSafe | null;
  readonly generation: number;
  readonly id?: string;
  readonly parentId?: string | null;
  readonly cladeId?: string;
  energy: number;
  matter: number;
  ticksRemaining: number;
}

export class Pore {
  public static readonly DEFAULT_CARCASS_DECAY_TICKS = 50;
  public static readonly DEFAULT_SPORE_LIFESPAN = 25;

  public readonly coord: HexCoord3D;
  private _medium: PoreMedium;
  private resident: PoreCell | null = null;
  private carcass: ICarcassData | null = null;
  private spore: IPelagicSpore | null = null;
  private basalt: boolean = false;
  private chelatorConcentration: number = 0;
  private epsConcentration: number = 0;

  constructor(coord: HexCoord3D, medium: PoreMedium = PoreMedium.ROCK_SUBSTRATE) {
    this.coord = coord;
    this._medium = medium;
  }

  public get medium(): PoreMedium {
    return this._medium;
  }

  public setMedium(medium: PoreMedium): void {
    this._medium = medium;
  }

  public isBasalt(): boolean {
    return this.basalt;
  }

  public setBasalt(basalt: boolean): void {
    this.basalt = basalt;
    if (basalt) {
      this.clear();
      this._medium = PoreMedium.ROCK_SUBSTRATE;
    }
  }

  public clear(): void {
    this.resident = null;
    this.carcass = null;
    this.spore = null;
  }

  public clearResident(): void {
    this.resident = null;
  }

  public clearCarcass(): void {
    this.carcass = null;
  }

  public isAqueous(): boolean {
    return this.medium === PoreMedium.AQUEOUS_FLUID;
  }

  public getState(): PoreState {
    if (this.resident !== null) return PoreState.OCCUPIED;
    if (this.carcass !== null) return PoreState.CARCASS;
    return PoreState.EMPTY;
  }

  public getResident(): PoreCell | null {
    return this.resident;
  }

  public setResident(cell: PoreCell): boolean {
    if (this.resident !== null || this.carcass !== null) return false;
    this.resident = cell;
    return true;
  }

  public hasSpore(): boolean {
    return this.spore !== null;
  }

  public getSpore(): IPelagicSpore | null {
    return this.spore;
  }

  public setSpore(spore: IPelagicSpore | null): void {
    this.spore = spore;
  }

  public triggerLysis(): void {
    if (this.resident === null) return;
    const snap = this.resident.getBattery().getSnapshot();
    this.carcass = {
      energy: Math.floor(snap.energy * 0.5),
      matter: snap.matter,
      decayTicksRemaining: Pore.DEFAULT_CARCASS_DECAY_TICKS
    };
    this.resident = null;
  }

  public setCarcass(energy: number, matter: number, decayTicksRemaining: number = Pore.DEFAULT_CARCASS_DECAY_TICKS): void {
    this.resident = null;
    this.carcass = {
      energy,
      matter,
      decayTicksRemaining
    };
  }

  public stepDetritus(): void {
    if (this.carcass !== null) {
      this.carcass.decayTicksRemaining--;
      if (this.carcass.decayTicksRemaining <= 0) {
        this.carcass = null;
      }
    }
  }

  public scavenge(scavenger: PoreCell): number {
    if (this.carcass === null) return 0;
    const charged = scavenger.getBattery().chargeEnergy(this.carcass.energy);
    const unharvested = this.carcass.energy - charged;
    scavenger.getBattery().addMatter(this.carcass.matter);
    this.carcass = null;
    return unharvested;
  }

  public getCarcass(): readonly [number, number, number] | null {
    if (this.carcass === null) return null;
    return [this.carcass.energy, this.carcass.matter, this.carcass.decayTicksRemaining];
  }

  private adjacentNeighbors: Pore[] = [];

  public setNeighbors(neighbors: Pore[]): void {
    this.adjacentNeighbors = neighbors;
  }

  public getNeighbors(): readonly Pore[] {
    return this.adjacentNeighbors;
  }

  public getChelator(): number {
    return this.chelatorConcentration;
  }

  public addChelator(amount: number): void {
    this.chelatorConcentration = Math.min(10.0, this.chelatorConcentration + amount);
  }

  public setChelator(amount: number): void {
    this.chelatorConcentration = Math.max(0, amount);
  }

  public getEps(): number {
    return this.epsConcentration;
  }

  public addEps(amount: number): void {
    this.epsConcentration = Math.min(10.0, this.epsConcentration + amount);
  }

  public setEps(amount: number): void {
    this.epsConcentration = Math.max(0, amount);
  }

  public stepMetaboliteDiffusionAndDecay(): void {
    // Natural decay (5% per tick for chelator, 2% for EPS)
    this.chelatorConcentration *= 0.95;
    this.epsConcentration *= 0.98;
    if (this.chelatorConcentration < 0.01) this.chelatorConcentration = 0;
    if (this.epsConcentration < 0.01) this.epsConcentration = 0;

    // Diffuse a portion (15%) of soluble chelator to adjacent non-basalt pores
    if (this.chelatorConcentration > 0.1 && this.adjacentNeighbors.length > 0) {
      const diffuseAmt = (this.chelatorConcentration * 0.15) / this.adjacentNeighbors.length;
      for (const n of this.adjacentNeighbors) {
        if (!n.isBasalt()) {
          n.chelatorConcentration = Math.min(10.0, n.chelatorConcentration + diffuseAmt);
        }
      }
      this.chelatorConcentration *= 0.85;
    }

    // Diffuse viscoelastic EPS matrix (10%) to adjacent non-basalt pores
    if (this.epsConcentration > 0.1 && this.adjacentNeighbors.length > 0) {
      const diffuseAmt = (this.epsConcentration * 0.10) / this.adjacentNeighbors.length;
      for (const n of this.adjacentNeighbors) {
        if (!n.isBasalt()) {
          n.epsConcentration = Math.min(10.0, n.epsConcentration + diffuseAmt);
        }
      }
      this.epsConcentration *= 0.90;
    }
  }

  public isPoreActive(): boolean {
    return this.resident !== null || this.carcass !== null || this.spore !== null || this.chelatorConcentration > 0 || this.epsConcentration > 0;
  }
}
