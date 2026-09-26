/**
 * 🐠 Siliquarium Spatial Subsystem
 * 3D Stacked Hexagonal Grid Spatial Index.
 * Manages spatial boundaries, neighbor lookups, and basal rock impedance.
 */

import { HexCoord3D, IHexCoord3D } from './HexCoord3D.js';

export interface IGridBounds3D {
  readonly radius: number;
  readonly minZ: number;
  readonly maxZ: number;
}

export class HexGrid3D<TItem> {
  private readonly items: Map<string, TItem> = new Map();
  private readonly basaltObstacles: Set<string> = new Set();
  public readonly bounds: IGridBounds3D;

  constructor(radius: number, minZ: number = 0, maxZ: number = 4) {
    this.bounds = {
      radius: Math.max(1, radius),
      minZ,
      maxZ
    };
  }

  public isInBounds(coord: IHexCoord3D): boolean {
    if (coord.z < this.bounds.minZ || coord.z > this.bounds.maxZ) {
      return false;
    }
    const s = -coord.q - coord.r;
    const planarRadius = Math.max(Math.abs(coord.q), Math.abs(coord.r), Math.abs(s));
    return planarRadius <= this.bounds.radius;
  }

  public setItem(coord: HexCoord3D, item: TItem): boolean {
    if (!this.isInBounds(coord) || this.isBasaltObstacle(coord)) {
      return false;
    }
    this.items.set(coord.toKey(), item);
    return true;
  }

  public getItem(coord: IHexCoord3D): TItem | undefined {
    const key = `${coord.q},${coord.r},${coord.z}`;
    return this.items.get(key);
  }

  public hasItem(coord: IHexCoord3D): boolean {
    const key = `${coord.q},${coord.r},${coord.z}`;
    return this.items.has(key);
  }

  public removeItem(coord: IHexCoord3D): boolean {
    const key = `${coord.q},${coord.r},${coord.z}`;
    return this.items.delete(key);
  }

  public setBasaltObstacle(coord: HexCoord3D): void {
    if (this.isInBounds(coord)) {
      this.basaltObstacles.add(coord.toKey());
      this.items.delete(coord.toKey());
    }
  }

  public isBasaltObstacle(coord: IHexCoord3D): boolean {
    const key = `${coord.q},${coord.r},${coord.z}`;
    return this.basaltObstacles.has(key);
  }

  public getValidPlanarNeighbors(coord: HexCoord3D): HexCoord3D[] {
    return coord.getPlanarNeighbors().filter(neighbor =>
      this.isInBounds(neighbor) && !this.isBasaltObstacle(neighbor)
    );
  }

  public getEmptyPlanarNeighbors(coord: HexCoord3D): HexCoord3D[] {
    return this.getValidPlanarNeighbors(coord).filter(neighbor =>
      !this.hasItem(neighbor)
    );
  }

  public getAllOccupiedCoords(): HexCoord3D[] {
    return Array.from(this.items.keys()).map(k => HexCoord3D.fromKey(k));
  }

  public size(): number {
    return this.items.size;
  }

  public clear(): void {
    this.items.clear();
    this.basaltObstacles.clear();
  }
}
