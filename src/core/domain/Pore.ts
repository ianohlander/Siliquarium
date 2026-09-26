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
  readonly generation: number;
  energy: number;
  matter: number;
  ticksRemaining: number;
}

export class Pore {
  public static readonly DEFAULT_CARCASS_DECAY_TICKS = 50;
  public static readonly DEFAULT_SPORE_LIFESPAN = 25;

  public readonly coord: HexCoord3D;
  public readonly medium: PoreMedium;
  private resident: PoreCell | null = null;
  private carcass: ICarcassData | null = null;
  private spore: IPelagicSpore | null = null;

  constructor(coord: HexCoord3D, medium: PoreMedium = PoreMedium.ROCK_SUBSTRATE) {
    this.coord = coord;
    this.medium = medium;
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
    if (this.resident !== null) return false;
    this.resident = cell;
    this.carcass = null;
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
}
