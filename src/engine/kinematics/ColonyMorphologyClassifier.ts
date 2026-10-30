/**
 * 🐠 Siliquarium Kinematics Subsystem
 * ColonyMorphologyClassifier: Objective Graph-Theoretic Classification of Multicellular Body Topology.
 * Analyzes node degree distribution, clustering coefficients (triangles),
 * and spatial cycles to classify emergent body morphology.
 */

import { HexCoord3D } from '../../core/spatial/HexCoord3D.js';
import { Pore } from '../../core/domain/Pore.js';

export type ColonyTopologyType =
  | 'SOLITARY'
  | 'COLUMNAR'
  | 'FILAMENTOUS'
  | 'ROSETTE'
  | 'RING'
  | 'DENDRITIC'
  | 'AMORPHOUS';

export class ColonyMorphologyClassifier {
  private static readonly DELTAS_3D: readonly [number, number, number][] = [
    [1, 0, 0], [1, -1, 0], [0, -1, 0], [-1, 0, 0], [-1, 1, 0], [0, 1, 0],
    [0, 0, 1], [0, 0, -1]
  ];

  /**
   * Objective Graph Theory Classification of Multicellular Body Topology.
   */
  public static classify(component: readonly Pore[]): ColonyTopologyType {
    const n = component.length;
    if (n <= 1) return 'SOLITARY';

    // Check if purely columnar (stacked vertically at same q, r)
    const isPurelyVertical = component.every(
      p => p.coord.q === component[0].coord.q && p.coord.r === component[0].coord.r
    );
    if (isPurelyVertical) return 'COLUMNAR';

    if (n === 2) return 'FILAMENTOUS';

    const coordMap = new Map<string, HexCoord3D>();
    for (const p of component) coordMap.set(p.coord.toKey(), p.coord);
    const degrees: number[] = new Array(n).fill(0);
    let totalEdges = 0;
    let triangleCount = 0;

    for (let i = 0; i < n; i++) {
      const pi = component[i].coord;
      const neighbors3D: HexCoord3D[] = [];
      for (let d = 0; d < 8; d++) {
        const [dq, dr, dz] = ColonyMorphologyClassifier.DELTAS_3D[d];
        const key = `${pi.q + dq},${pi.r + dr},${pi.z + dz}`;
        const nb = coordMap.get(key);
        if (nb) neighbors3D.push(nb);
      }
      degrees[i] = neighbors3D.length;
      totalEdges += neighbors3D.length;

      for (let a = 0; a < neighbors3D.length; a++) {
        for (let b = a + 1; b < neighbors3D.length; b++) {
          if (neighbors3D[a].distanceTo(neighbors3D[b]) === 1) {
            triangleCount++;
          }
        }
      }
    }

    totalEdges = Math.floor(totalEdges / 2);
    triangleCount = Math.floor(triangleCount / 3);
    const maxDeg = Math.max(...degrees);

    if (triangleCount >= 1) {
      return 'ROSETTE';
    }
    if (totalEdges >= n && maxDeg <= 2) {
      return 'RING';
    }
    if (maxDeg <= 2) {
      return 'FILAMENTOUS';
    }
    if (maxDeg >= 3) {
      return 'DENDRITIC';
    }
    return 'AMORPHOUS';
  }
}
