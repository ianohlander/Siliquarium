/**
 * 🐠 Siliquarium Server Subsystem
 * RemoteCommandDispatcher: Routes inbound RPC control commands to the headless simulation host.
 */

import { HexCoord3D } from '../core/spatial/HexCoord3D.js';
import { GenomeSafe } from '../core/domain/GenomeSafe.js';
import { GeologicalEventType } from '../engine/environment/GeologicalPressuresEngine.js';
import { ISimulationConfig } from '../engine/SimulationWorld.js';
import { ISimulationStateSnapshot } from '../engine/storage/SimulationSnapshotManager.js';
import type { HeadlessSimulationHost } from './HeadlessSimulationHost.js';

export interface ICommandResult {
  readonly success: boolean;
  readonly message: string;
  readonly result?: unknown;
}

export class RemoteCommandDispatcher {
  public static mapGeologicalEvent(type: string): GeologicalEventType {
    if (type === 'surge' || type === 'boiling') {
      return GeologicalEventType.HYDROTHERMAL_SURGE;
    } else if (type === 'toxin') {
      return GeologicalEventType.TOXIC_HEAVY_METAL_SPIKE;
    } else if (type === 'tremor' || type === 'avulsion') {
      return GeologicalEventType.MAGMATIC_TREMOR;
    } else if (type === 'snow') {
      return GeologicalEventType.MARINE_SNOW_STORM;
    } else if (type === 'cryo') {
      return GeologicalEventType.CRYOGENIC_DOWNWELLING;
    } else if (type === 'lava') {
      return GeologicalEventType.PILLOW_LAVA_FLOW;
    }
    return GeologicalEventType.HYDROTHERMAL_SURGE;
  }

  public static applyBrush(
    host: HeadlessSimulationHost,
    action: string,
    rawCoords: readonly { q: number; r: number; z: number }[],
    options: Record<string, unknown> = {}
  ): void {
    const world = host.getWorld();
    for (const c of rawCoords) {
      const coord = new HexCoord3D(c.q, c.r, c.z);
      if (action === 'basalt') {
        world.setPoreBasalt(coord, true);
      } else if (action === 'trench' || action === 'excavate') {
        world.excavateHabitablePore(coord);
      } else if (action === 'clear' || action === 'eraser') {
        world.clearPore(coord);
      } else if (action === 'inoculate') {
        const tape = typeof options?.tapeBitstring === 'string'
          ? options.tapeBitstring
          : '010101010101010101010101010101010101010101010101010101010101';
        world.inoculateCell(coord, new GenomeSafe(tape), 40, 15);
      }
    }
  }

  public static dispatch(
    host: HeadlessSimulationHost,
    command: string,
    payload: Record<string, unknown> = {}
  ): ICommandResult {
    switch (command) {
      case 'play':
      case 'resume':
        host.start();
        return { success: true, message: 'Simulation running on server' };

      case 'pause':
      case 'stop':
        host.stop();
        return { success: true, message: 'Simulation paused on server' };

      case 'step': {
        const count = typeof payload?.count === 'number' ? Math.max(1, payload.count) : 1;
        const tele = host.step(count);
        return { success: true, message: `Stepped ${count} tick(s)`, result: tele };
      }

      case 'setSpeed': {
        const speed = typeof payload?.speed === 'number' ? payload.speed : 1;
        host.setSpeed(speed);
        return { success: true, message: `Speed updated to ${host.getSpeed()}x` };
      }

      case 'perturb': {
        const type = typeof payload?.type === 'string' ? payload.type : 'surge';
        host.triggerPerturbation(type, payload);
        return { success: true, message: `Triggered perturbation: ${type}` };
      }

      case 'brush': {
        const action = typeof payload?.action === 'string' ? payload.action : 'basalt';
        const coords = Array.isArray(payload?.coords)
          ? (payload.coords as readonly { q: number; r: number; z: number }[])
          : [];
        RemoteCommandDispatcher.applyBrush(host, action, coords, payload);
        host.broadcast('telemetry', host.getWorld().exportTelemetry());
        return { success: true, message: `Applied brush: ${action} to ${coords.length} pores` };
      }

      case 'reset': {
        const opts = payload?.options as ISimulationConfig | undefined;
        host.reset(opts);
        return { success: true, message: 'World reset to initial seed' };
      }

      case 'snapshot': {
        const name = typeof payload?.name === 'string' ? payload.name : undefined;
        const snap = host.createSnapshot(name);
        return { success: true, message: 'Snapshot captured', result: snap };
      }

      case 'restore': {
        if (!payload?.snapshot) {
          return { success: false, message: 'Missing snapshot payload' };
        }
        const ok = host.restoreSnapshot(payload.snapshot as ISimulationStateSnapshot);
        return { success: ok, message: ok ? 'Snapshot restored' : 'Restore failed' };
      }

      default:
        return { success: false, message: `Unknown control command: ${command}` };
    }
  }
}
