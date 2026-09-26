/**
 * 🐠 Siliquarium Spatial Subsystem
 * 3D Stacked Hexagonal Prism Coordinate (q, r, z) Value Object.
 * Implements axial planar hexagonal geometry and vertical seabed elevation.
 */

export interface IHexCoord3D {
  readonly q: number;
  readonly r: number;
  readonly z: number;
}

export class HexCoord3D implements IHexCoord3D {
  public readonly q: number;
  public readonly r: number;
  public readonly z: number;

  // 6 Equidistant Planar Unit Directions (Physical distance = 1.0)
  public static readonly PLANAR_DIRECTIONS: readonly [number, number][] = [
    [+1, 0],   // 0: East
    [+1, -1],  // 1: Northeast
    [0, -1],   // 2: Northwest
    [-1, 0],   // 3: West
    [-1, +1],  // 4: Southwest
    [0, +1]    // 5: Southeast
  ];

  constructor(q: number, r: number, z: number = 0) {
    this.q = Math.trunc(q);
    this.r = Math.trunc(r);
    this.z = Math.trunc(z);
  }

  public toKey(): string {
    return `${this.q},${this.r},${this.z}`;
  }

  public static fromKey(key: string): HexCoord3D {
    const parts = key.split(',').map(s => parseInt(s, 10));
    return new HexCoord3D(parts[0] || 0, parts[1] || 0, parts[2] || 0);
  }

  public equals(other: IHexCoord3D): boolean {
    return this.q === other.q && this.r === other.r && this.z === other.z;
  }

  public add(deltaQ: number, deltaR: number, deltaZ: number = 0): HexCoord3D {
    return new HexCoord3D(this.q + deltaQ, this.r + deltaR, this.z + deltaZ);
  }

  public getPlanarNeighbors(): HexCoord3D[] {
    return HexCoord3D.PLANAR_DIRECTIONS.map(([dq, dr]) =>
      new HexCoord3D(this.q + dq, this.r + dr, this.z)
    );
  }

  public getVerticalNeighbors(): [HexCoord3D, HexCoord3D] {
    return [
      new HexCoord3D(this.q, this.r, this.z + 1), // Above (water column plume)
      new HexCoord3D(this.q, this.r, this.z - 1)  // Below (bedrock floor)
    ];
  }

  public distanceTo(other: IHexCoord3D): number {
    const dq = Math.abs(this.q - other.q);
    const dr = Math.abs(this.r - other.r);
    const ds = Math.abs((this.q + this.r) - (other.q + other.r));
    const planarDist = Math.max(dq, dr, ds);
    const verticalDist = Math.abs(this.z - other.z);
    return planarDist + verticalDist;
  }
}
