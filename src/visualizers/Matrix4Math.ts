/**
 * 🐠 Siliquarium Visualizer Subsystem
 * Matrix4Math: Pure 4x4 Column-Major Matrix Linear Algebra.
 * Zero external dependencies.
 */

import { IVector3 } from './OrbitCamera.js';

export interface IFrustumPlanes {
  near: number;
  far: number;
}

export class Matrix4Math {
  /**
   * Computes perspective projection matrix.
   */
  public static computePerspective(
    dst: Float32Array,
    fovY: number,
    aspect: number,
    planesOrNear: IFrustumPlanes | number
  ): void {
    let near: number;
    let far: number;
    if (typeof planesOrNear === 'object') {
      near = planesOrNear.near;
      far = planesOrNear.far;
    } else {
      near = planesOrNear;
      far = typeof arguments[4] === 'number' ? arguments[4] : 100.0;
    }
    const f = 1.0 / Math.tan(fovY / 2);
    const nf = 1.0 / (near - far);

    dst[0] = f / aspect; dst[4] = 0; dst[8] = 0;                  dst[12] = 0;
    dst[1] = 0;          dst[5] = f; dst[9] = 0;                  dst[13] = 0;
    dst[2] = 0;          dst[6] = 0; dst[10] = (far + near) * nf; dst[14] = (2 * far * near) * nf;
    dst[3] = 0;          dst[7] = 0; dst[11] = -1;                dst[15] = 0;
  }

  /**
   * Multiplies two 4x4 column-major matrices: dst = a * b.
   */
  public static multiply(dst: Float32Array, a: Float32Array, b: Float32Array): void {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) sum += a[k * 4 + j] * b[i * 4 + k];
        dst[i * 4 + j] = sum;
      }
    }
  }

  /**
   * Transforms a 3D point using a 4x4 matrix with perspective divide.
   */
  public static transformPoint(pt: IVector3, m: Float32Array): IVector3 {
    const x = pt.x * m[0] + pt.y * m[4] + pt.z * m[8]  + m[12];
    const y = pt.x * m[1] + pt.y * m[5] + pt.z * m[9]  + m[13];
    const z = pt.x * m[2] + pt.y * m[6] + pt.z * m[10] + m[14];
    const w = pt.x * m[3] + pt.y * m[7] + pt.z * m[11] + m[15] || 1;
    return { x: x / w, y: y / w, z: z / w };
  }

  /**
   * Computes the analytic inverse of a 4x4 column-major matrix.
   */
  public static invert(src: Float32Array, dst: Float32Array): boolean {
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
