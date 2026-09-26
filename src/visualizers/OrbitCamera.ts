/**
 * 🐠 Siliquarium Visualizer Subsystem
 * OrbitCamera: Mathematical 3D Spherical Orbit Camera.
 * Pure vector/matrix math with zero external dependencies.
 */

export interface IVector3 {
  x: number;
  y: number;
  z: number;
}

export interface IRay3D {
  origin: IVector3;
  direction: IVector3;
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

  // Cached matrices (4x4 column-major)
  private readonly viewMatrix: Float32Array = new Float32Array(16);
  private readonly projMatrix: Float32Array = new Float32Array(16);
  private readonly invViewProjMatrix: Float32Array = new Float32Array(16);

  public rotate(deltaAzimuth: number, deltaElevation: number): void {
    this.azimuth += deltaAzimuth;
    this.elevation = Math.max(this.minElevation, Math.min(this.maxElevation, this.elevation + deltaElevation));
  }

  public pan(deltaScreenX: number, deltaScreenY: number): void {
    const cosA = Math.cos(this.azimuth);
    const sinA = Math.sin(this.azimuth);
    const scale = this.distance * 0.002;
    this.target.x += (-deltaScreenX * cosA - deltaScreenY * sinA * Math.sin(this.elevation)) * scale;
    this.target.z += (deltaScreenX * sinA - deltaScreenY * cosA * Math.sin(this.elevation)) * scale;
    this.target.y += (deltaScreenY * Math.cos(this.elevation)) * scale;
  }

  public setTarget(x: number, y: number, z: number): void {
    this.target.x = x;
    this.target.y = y;
    this.target.z = z;
  }

  public zoom(deltaDistance: number): void {
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
    const f = 1.0 / Math.tan(fovY / 2);
    const nf = 1.0 / (near - far);
    const m = this.projMatrix;

    m[0] = f / aspect; m[4] = 0; m[8] = 0;                  m[12] = 0;
    m[1] = 0;          m[5] = f; m[9] = 0;                  m[13] = 0;
    m[2] = 0;          m[6] = 0; m[10] = (far + near) * nf; m[14] = (2 * far * near) * nf;
    m[3] = 0;          m[7] = 0; m[11] = -1;                m[15] = 0;
  }

  private computeInverseViewProj(): void {
    // Multiply proj * view
    const vp = new Float32Array(16);
    const p = this.projMatrix;
    const v = this.viewMatrix;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) sum += p[k * 4 + j] * v[i * 4 + k];
        vp[i * 4 + j] = sum;
      }
    }
    // Invert vp
    OrbitCamera.invert4x4(vp, this.invViewProjMatrix);
  }

  private transformPointWithMatrix(pt: IVector3, m: Float32Array): IVector3 {
    const x = pt.x * m[0] + pt.y * m[4] + pt.z * m[8]  + m[12];
    const y = pt.x * m[1] + pt.y * m[5] + pt.z * m[9]  + m[13];
    const z = pt.x * m[2] + pt.y * m[6] + pt.z * m[10] + m[14];
    const w = pt.x * m[3] + pt.y * m[7] + pt.z * m[11] + m[15] || 1;
    return { x: x / w, y: y / w, z: z / w };
  }

  public static invert4x4(src: Float32Array, dst: Float32Array): boolean {
    const s = src;
    const a00 = s[0], a01 = s[1], a02 = s[2], a03 = s[3];
    const a10 = s[4], a11 = s[5], a12 = s[6], a13 = s[7];
    const a20 = s[8], a21 = s[9], a22 = s[10], a23 = s[11];
    const a30 = s[12], a31 = s[13], a32 = s[14], a33 = s[15];

    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    const det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (Math.abs(det) < 1e-8) return false;
    const invDet = 1.0 / det;

    dst[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
    dst[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
    dst[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
    dst[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
    dst[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
    dst[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
    dst[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
    dst[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
    dst[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
    dst[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
    dst[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
    dst[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
    dst[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
    dst[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
    dst[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
    dst[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;
    return true;
  }
}
