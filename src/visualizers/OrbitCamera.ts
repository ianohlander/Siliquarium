/**
 * 🐠 Siliquarium Visualizer Subsystem
 * OrbitCamera: Mathematical 3D Spherical Orbit Camera.
 * Pure vector/matrix math with zero external dependencies.
 */

import { Matrix4Math } from './Matrix4Math.js';

export interface IVector3 {
  x: number;
  y: number;
  z: number;
}

export interface IRay3D {
  origin: IVector3;
  direction: IVector3;
}

export interface IFlyToOptions {
  distance?: number;
  elevation?: number;
  azimuth?: number;
}

export class OrbitCamera {
  public target: IVector3 = { x: 0, y: 0, z: 0 };
  public azimuth: number = 0.8;      // Horizontal yaw angle (radians)
  public elevation: number = 0.6;    // Vertical pitch angle (radians)
  public distance: number = 24.0;    // Radial distance from target

  public minElevation: number = 0.1;
  public maxElevation: number = Math.PI / 2 - 0.05;
  public minDistance: number = 3.0;
  public maxDistance: number = 80.0;

  // Continuous auto-orbit / spin around target axis
  public autoSpin: boolean = false;
  public autoSpinSpeed: number = 0.15; // Radians per second

  // Cached matrices (4x4 column-major)
  private readonly viewMatrix: Float32Array = new Float32Array(16);
  private readonly projMatrix: Float32Array = new Float32Array(16);
  private readonly viewProjMatrix: Float32Array = new Float32Array(16);
  private readonly invViewProjMatrix: Float32Array = new Float32Array(16);

  // Smooth camera destination targets
  private destTarget: IVector3 | null = null;
  private destDistance: number | null = null;
  private destElevation: number | null = null;
  private destAzimuth: number | null = null;

  public rotate(deltaAzimuth: number, deltaElevation: number): void {
    this.destAzimuth = null;
    this.destElevation = null;
    this.azimuth += deltaAzimuth;
    this.elevation = Math.max(this.minElevation, Math.min(this.maxElevation, this.elevation + deltaElevation));
  }

  public pan(deltaScreenX: number, deltaScreenY: number): void {
    this.destTarget = null;
    const cosA = Math.cos(this.azimuth);
    const sinA = Math.sin(this.azimuth);
    const scale = this.distance * 0.002;
    this.target.x += (-deltaScreenX * cosA - deltaScreenY * sinA * Math.sin(this.elevation)) * scale;
    this.target.z += (deltaScreenX * sinA - deltaScreenY * cosA * Math.sin(this.elevation)) * scale;
    this.target.y += (deltaScreenY * Math.cos(this.elevation)) * scale;
  }

  public setTarget(x: number, y: number, z: number): void {
    this.destTarget = null;
    this.target.x = x;
    this.target.y = y;
    this.target.z = z;
  }

  public smoothFlyTo(target: IVector3, options?: IFlyToOptions): void;
  public smoothFlyTo(x: number, y: number, z: number, options?: IFlyToOptions | number): void;
  public smoothFlyTo(
    targetOrX: IVector3 | number,
    yOrOptions?: number | IFlyToOptions,
    z?: number,
    optionsOrDistance?: IFlyToOptions | number
  ): void {
    if (typeof targetOrX === 'object') {
      this.destTarget = { x: targetOrX.x, y: targetOrX.y, z: targetOrX.z };
      const opts = typeof yOrOptions === 'object' ? yOrOptions : undefined;
      if (opts?.distance !== undefined) this.destDistance = Math.max(this.minDistance, Math.min(this.maxDistance, opts.distance));
      if (opts?.elevation !== undefined) this.destElevation = Math.max(this.minElevation, Math.min(this.maxElevation, opts.elevation));
      if (opts?.azimuth !== undefined) this.destAzimuth = opts.azimuth;
    } else {
      this.destTarget = { x: targetOrX, y: typeof yOrOptions === 'number' ? yOrOptions : 0, z: z ?? 0 };
      if (typeof optionsOrDistance === 'object') {
        if (optionsOrDistance?.distance !== undefined) this.destDistance = Math.max(this.minDistance, Math.min(this.maxDistance, optionsOrDistance.distance));
        if (optionsOrDistance?.elevation !== undefined) this.destElevation = Math.max(this.minElevation, Math.min(this.maxElevation, optionsOrDistance.elevation));
        if (optionsOrDistance?.azimuth !== undefined) this.destAzimuth = optionsOrDistance.azimuth;
      } else {
        if (typeof optionsOrDistance === 'number') this.destDistance = Math.max(this.minDistance, Math.min(this.maxDistance, optionsOrDistance));
        const elev = typeof arguments[4] === 'number' ? arguments[4] : undefined;
        if (elev !== undefined) this.destElevation = Math.max(this.minElevation, Math.min(this.maxElevation, elev));
        const azim = typeof arguments[5] === 'number' ? arguments[5] : undefined;
        if (azim !== undefined) this.destAzimuth = azim;
      }
    }
  }

  public update(dt: number = 0.016): void {
    const ease = Math.min(1.0, 10.0 * dt);
    if (this.destTarget) {
      this.target.x += (this.destTarget.x - this.target.x) * ease;
      this.target.y += (this.destTarget.y - this.target.y) * ease;
      this.target.z += (this.destTarget.z - this.target.z) * ease;
      if (Math.hypot(this.destTarget.x - this.target.x, this.destTarget.y - this.target.y, this.destTarget.z - this.target.z) < 0.01) {
        this.target.x = this.destTarget.x;
        this.target.y = this.destTarget.y;
        this.target.z = this.destTarget.z;
        this.destTarget = null;
      }
    }
    if (this.destDistance !== null) {
      this.distance += (this.destDistance - this.distance) * ease;
      if (Math.abs(this.destDistance - this.distance) < 0.05) {
        this.distance = this.destDistance;
        this.destDistance = null;
      }
    }
    if (this.destElevation !== null) {
      this.elevation += (this.destElevation - this.elevation) * ease;
      if (Math.abs(this.destElevation - this.elevation) < 0.01) {
        this.elevation = this.destElevation;
        this.destElevation = null;
      }
    }
    if (this.destAzimuth !== null) {
      this.azimuth += (this.destAzimuth - this.azimuth) * ease;
      if (Math.abs(this.destAzimuth - this.azimuth) < 0.01) {
        this.azimuth = this.destAzimuth;
        this.destAzimuth = null;
      }
    } else if (this.autoSpin) {
      this.azimuth += this.autoSpinSpeed * dt;
    }
  }

  public toggleAutoSpin(): boolean {
    this.autoSpin = !this.autoSpin;
    return this.autoSpin;
  }

  public setAutoSpin(enabled: boolean, speed?: number): void {
    this.autoSpin = enabled;
    if (speed !== undefined) {
      this.autoSpinSpeed = speed;
    }
  }

  public setAutoSpinSpeed(speed: number): void {
    this.autoSpinSpeed = speed;
  }

  public zoom(deltaDistance: number): void {
    this.destDistance = null;
    this.distance = Math.max(this.minDistance, Math.min(this.maxDistance, this.distance + deltaDistance));
  }

  public getEyePosition(): IVector3 {
    const cosElev = Math.cos(this.elevation);
    const sinElev = Math.sin(this.elevation);
    const cosAzim = Math.cos(this.azimuth);
    const sinAzim = Math.sin(this.azimuth);

    return {
      x: this.target.x + this.distance * cosElev * sinAzim,
      y: this.target.y + this.distance * sinElev,
      z: this.target.z + this.distance * cosElev * cosAzim
    };
  }

  public updateMatrices(aspectRatio: number, fovYRad: number = Math.PI / 4, near: number = 0.5, far: number = 200.0): void {
    const eye = this.getEyePosition();
    this.computeViewMatrix(eye, this.target, { x: 0, y: 1, z: 0 });
    this.computePerspectiveMatrix(fovYRad, aspectRatio, near, far);
    this.computeInverseViewProj();
  }

  public getViewMatrix(): Float32Array {
    return this.viewMatrix;
  }

  public getProjectionMatrix(): Float32Array {
    return this.projMatrix;
  }

  public getViewProjMatrix(): Float32Array {
    return this.viewProjMatrix;
  }

  public screenToRay(screenX: number, screenY: number, width: number, height: number): IRay3D {
    const ndcX = (screenX / width) * 2 - 1;
    const ndcY = 1 - (screenY / height) * 2;

    const nearPt = this.transformPointWithMatrix({ x: ndcX, y: ndcY, z: -1 }, this.invViewProjMatrix);
    const farPt = this.transformPointWithMatrix({ x: ndcX, y: ndcY, z: 1 }, this.invViewProjMatrix);

    const dx = farPt.x - nearPt.x;
    const dy = farPt.y - nearPt.y;
    const dz = farPt.z - nearPt.z;
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;

    return {
      origin: nearPt,
      direction: { x: dx / len, y: dy / len, z: dz / len }
    };
  }

  public projectPoint(pt: IVector3, w: number, h: number): { x: number; y: number; depth: number } | null {
    const vp = this.viewProjMatrix;
    const cx = pt.x * vp[0] + pt.y * vp[4] + pt.z * vp[8]  + vp[12];
    const cy = pt.x * vp[1] + pt.y * vp[5] + pt.z * vp[9]  + vp[13];
    const cz = pt.x * vp[2] + pt.y * vp[6] + pt.z * vp[10] + vp[14];
    const cw = pt.x * vp[3] + pt.y * vp[7] + pt.z * vp[11] + vp[15] || 1;
    if (cw <= 0.45) return null;

    return { x: ((cx / cw) * 0.5 + 0.5) * w, y: (1.0 - ((cy / cw) * 0.5 + 0.5)) * h, depth: cz / cw };
  }

  public project(pt: IVector3, w: number, h: number): { x: number; y: number; depth: number } | null {
    return this.projectPoint(pt, w, h);
  }

  private computeViewMatrix(eye: IVector3, target: IVector3, up: IVector3): void {
    let zx = eye.x - target.x;
    let zy = eye.y - target.y;
    let zz = eye.z - target.z;
    let zlen = Math.sqrt(zx * zx + zy * zy + zz * zz) || 1;
    zx /= zlen; zy /= zlen; zz /= zlen;

    let xx = up.y * zz - up.z * zy;
    let xy = up.z * zx - up.x * zz;
    let xz = up.x * zy - up.y * zx;
    let xlen = Math.sqrt(xx * xx + xy * xy + xz * xz) || 1;
    xx /= xlen; xy /= xlen; xz /= xlen;

    const yx = zy * xz - zz * xy;
    const yy = zz * xx - zx * xz;
    const yz = zx * xy - zy * xx;

    const m = this.viewMatrix;
    m[0] = xx; m[4] = xy; m[8]  = xz; m[12] = -(xx * eye.x + xy * eye.y + xz * eye.z);
    m[1] = yx; m[5] = yy; m[9]  = yz; m[13] = -(yx * eye.x + yy * eye.y + yz * eye.z);
    m[2] = zx; m[6] = zy; m[10] = zz; m[14] = -(zx * eye.x + zy * eye.y + zz * eye.z);
    m[3] = 0;  m[7] = 0;  m[11] = 0;  m[15] = 1;
  }

  private computePerspectiveMatrix(fovY: number, aspect: number, near: number, far: number): void {
    Matrix4Math.computePerspective(this.projMatrix, fovY, aspect, { near, far });
  }

  private computeInverseViewProj(): void {
    Matrix4Math.multiply(this.viewProjMatrix, this.projMatrix, this.viewMatrix);
    Matrix4Math.invert(this.viewProjMatrix, this.invViewProjMatrix);
  }

  private transformPointWithMatrix(pt: IVector3, m: Float32Array): IVector3 {
    return Matrix4Math.transformPoint(pt, m);
  }

  public static invert4x4(src: Float32Array, dst: Float32Array): boolean {
    return Matrix4Math.invert(src, dst);
  }
}
