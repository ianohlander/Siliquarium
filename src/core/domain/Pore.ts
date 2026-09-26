/**
 * 🐠 Siliquarium Domain Subsystem
 * Pore: Inorganic Benthic Rock Cavity Entity.
 * Holds living cells, carcasses undergoing detritus recycling, or open rock cavities.
 */

import { HexCoord3D } from '../spatial/HexCoord3D.js';
import { PoreCell } from './PoreCell.js';

export enum PoreState {
  EMPTY = 'EMPTY',
  OCCUPIED = 'OCCUPIED',
  CARCASS = 'CARCASS'
}

export interface ICarcassData {
  energy: number;
  matter: number;
  decayTicksRemaining: number;
}

export class Pore {
  public static readonly DEFAULT_CARCASS_DECAY_TICKS = 50;

  public readonly coord: HexCoord3D;
  private resident: PoreCell | null = null;
  private carcass: ICarcassData | null = null;

  constructor(coord: HexCoord3D) {
    this.coord = coord;
  }

  public getState(): PoreState {
    if (this.resident !== null) {
      return PoreState.OCCUPIED;
    }
    if (this.carcass !== null) {
      return PoreState.CARCASS;
    }
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

  public triggerLysis(): void {
    if (this.resident === null) return;
    const snap = this.resident.getBattery().getSnapshot();
    this.carcass = {
      energy: Math.floor(snap.energy * 0.5), // Residual scavengable energy
      matter: snap.matter,                  // Full matter recycled
      decayTicksRemaining: Pore.DEFAULT_CARCASS_DECAY_TICKS
    };
    this.resident = null;
  }

  public stepDetritus(): void {
    if (this.carcass !== null) {
      this.carcass.decayTicksRemaining--;
      if (this.carcass.decayTicksRemaining <= 0) {
        // Complete mineralization into seafloor sediment
        this.carcass = null;
      }
    }
  }

  public scavenge(scavenger: PoreCell): void {
    if (this.carcass === null) return;
    scavenger.getBattery().chargeEnergy(this.carcass.energy);
    scavenger.getBattery().addMatter(this.carcass.matter);
    this.carcass = null;
  }

  public getCarcass(): readonly [number, number, number] | null {
    if (this.carcass === null) return null;
    return [this.carcass.energy, this.carcass.matter, this.carcass.decayTicksRemaining];
  }
}
