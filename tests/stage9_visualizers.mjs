/**
 * 🐠 Siliquarium Stage 9 Verification
 * Tests OrbitCamera 3D Matrix Math, Inversion, Screen-to-Ray Projections, and Hex Math.
 */

import assert from 'node:assert';
import { OrbitCamera } from '../dist/visualizers/OrbitCamera.js';
import { HexCoord3D } from '../dist/core/spatial/HexCoord3D.js';

export function runStage9() {
  const camera = new OrbitCamera();

  // Test 1: Camera rotation & elevation clamping
  const initialElev = camera.elevation;
  camera.rotate(0.5, 0.2);
  assert.strictEqual(camera.azimuth, 0.8 + 0.5, 'Azimuth rotation mismatch');
  assert.ok(Math.abs(camera.elevation - (initialElev + 0.2)) < 1e-6, 'Elevation mismatch');

  camera.rotate(0, 10.0); // Try to exceed maximum elevation
  assert.ok(camera.elevation <= camera.maxElevation, 'Elevation must not exceed max clamp');

  // Test 2: Camera zoom & distance bounds
  camera.zoom(-100);
  assert.strictEqual(camera.distance, camera.minDistance, 'Zoom must not violate min distance');
  camera.zoom(500);
  assert.strictEqual(camera.distance, camera.maxDistance, 'Zoom must not violate max distance');

  // Test 3: Matrix generation
  camera.distance = 20.0;
  camera.updateMatrices(16 / 9);
  const vm = camera.getViewMatrix();
  const pm = camera.getProjectionMatrix();

  assert.strictEqual(vm.length, 16, 'View matrix must have 16 elements');
  assert.strictEqual(pm.length, 16, 'Projection matrix must have 16 elements');
  assert.notStrictEqual(vm[15], 0, 'View matrix must not be degenerate');

  // Test 4: Screen to Ray unprojection
  const ray = camera.screenToRay(400, 300, 800, 600);
  assert.ok(ray.origin !== undefined, 'Ray origin must exist');
  assert.ok(ray.direction !== undefined, 'Ray direction must exist');

  const dirLen = Math.sqrt(
    ray.direction.x * ray.direction.x +
    ray.direction.y * ray.direction.y +
    ray.direction.z * ray.direction.z
  );
  assert.ok(Math.abs(dirLen - 1.0) < 1e-4, 'Ray direction must be a unit vector');

  // Test 5: Hexagonal axial spacing geometry
  const origin = new HexCoord3D(0, 0, 0);
  const neighbors = origin.getPlanarNeighbors();
  assert.strictEqual(neighbors.length, 6, 'Origin must have exactly 6 planar neighbors');

  for (const n of neighbors) {
    const dist = origin.distanceTo(n);
    assert.strictEqual(dist, 1, 'Hex neighbor distance in axial metric must be exactly 1');
  }
}
