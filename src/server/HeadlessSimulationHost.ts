/**
 * 🐠 Siliquarium Server Subsystem
 * HeadlessSimulationHost: Autonomous Server-Side Simulation Engine & Real-Time SSE Broadcaster.
 * 
 * Runs open-ended silicon abiogenesis on the Node.js server independently of client browser tabs.
 * Supports:
 * - Continuous background epoch progression across 100,000+ ticks.
 * - Server-Sent Events (SSE) streaming of live telemetry to multiple connected clients.
 * - Remote control command dispatch (play, pause, speed, perturbation shocks, terrain brushes).
 * - Periodic automatic state checkpoints in .silisave format.
 * - Strict First-Law energy and mass conservation enforcement (ΔE = 0.000, ΔM = 0.000).
 */

import { SimulationWorld, ISimulationConfig } from '../engine/SimulationWorld.js';
import { SimulationSnapshotManager, ISimulationStateSnapshot } from '../engine/storage/SimulationSnapshotManager.js';
import { ISimulationTelemetry } from '../engine/SimulationTelemetry.js';
import { SseEventBroadcaster, ISSEResponse } from './SseEventBroadcaster.js';
import { RemoteCommandDispatcher, ICommandResult } from './RemoteCommandDispatcher.js';

export type { ISSEResponse };

export interface IServerSimulationStatus {
  readonly isRunning: boolean;
  readonly tick: number;
  readonly speedMultiplier: number;
  readonly targetIntervalMs: number;
  readonly clientCount: number;
  readonly uptimeSeconds: number;
  readonly livingCount: number;
  readonly totalEnergyInUniverse: number;
  readonly isEnergyConserved: boolean;
  readonly isMatterConserved: boolean;
  readonly autoSaveEnabled: boolean;
  readonly lastAutoSaveTick: number;
}

export interface IHeadlessHostOptions extends ISimulationConfig {
  readonly autoStart?: boolean;
  readonly initialSpeed?: number;
  readonly autoSaveIntervalTicks?: number;
  readonly telemetryThrottleTicks?: number;
}

export class HeadlessSimulationHost {
  private world: SimulationWorld;
  private isRunning: boolean = false;
  private speedMultiplier: number = 1;
  private timerId: ReturnType<typeof setInterval> | null = null;
  private readonly broadcaster: SseEventBroadcaster = new SseEventBroadcaster();
  private readonly startTime: number = Date.now();
  private lastAutoSaveTick: number = 0;
  private readonly autoSaveIntervalTicks: number;
  private readonly telemetryThrottleTicks: number;
  private ticksSinceLastBroadcast: number = 0;

  // Base speed interval (50ms per tick = 20 TPS at 1x speed)
  private static readonly BASE_TICK_INTERVAL_MS = 50;

  constructor(options: IHeadlessHostOptions = {}) {
    this.world = new SimulationWorld({
      radius: options.radius ?? 5,
      soupDensity: options.soupDensity ?? 0.20,
      basaltDensity: options.basaltDensity ?? 0.15,
      seed: options.seed ?? 42
    });

    this.speedMultiplier = options.initialSpeed ?? 1;
    this.autoSaveIntervalTicks = options.autoSaveIntervalTicks ?? 500;
    this.telemetryThrottleTicks = options.telemetryThrottleTicks ?? 1;

    if (options.autoStart ?? true) {
      this.start();
    }
  }

  public getWorld(): SimulationWorld {
    return this.world;
  }

  public isExecuting(): boolean {
    return this.isRunning;
  }

  public getSpeed(): number {
    return this.speedMultiplier;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.scheduleNextTick();
    this.broadcastStatus();
  }

  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.broadcastStatus();
  }

  public setSpeed(multiplier: number): void {
    const clamped = Math.max(0.1, Math.min(20, multiplier));
    this.speedMultiplier = clamped;
    this.broadcastStatus();
  }

  public step(count: number = 1): ISimulationTelemetry {
    const steps = Math.max(1, Math.min(100, Math.floor(count)));
    for (let i = 0; i < steps; i++) {
      this.world.step();
    }
    const tele = this.world.exportTelemetry();
    this.broadcastTelemetry(tele);
    this.broadcastStatus();
    return tele;
  }

  private scheduleNextTick(): void {
    if (!this.isRunning) return;
    const interval = Math.max(2, Math.round(HeadlessSimulationHost.BASE_TICK_INTERVAL_MS / this.speedMultiplier));
    this.timerId = setTimeout(() => {
      this.tickCycle();
    }, interval);
  }

  private tickCycle(): void {
    if (!this.isRunning) return;

    this.world.step();
    this.ticksSinceLastBroadcast++;

    if (this.ticksSinceLastBroadcast >= this.telemetryThrottleTicks) {
      this.ticksSinceLastBroadcast = 0;
      const tele = this.world.exportTelemetry();
      this.broadcastTelemetry(tele);
    }

    this.checkAutoSave();
    this.scheduleNextTick();
  }

  private checkAutoSave(): void {
    const currentTick = this.world.getTickCount();
    if (this.autoSaveIntervalTicks > 0 && currentTick - this.lastAutoSaveTick >= this.autoSaveIntervalTicks) {
      this.lastAutoSaveTick = currentTick;
      const snapshot = this.createSnapshot(`Server Auto-Save Tick ${currentTick}`);
      this.broadcast('snapshot', snapshot);
    }
  }

  // =========================================================================
  // SSE Streaming & Subscription Management
  // =========================================================================

  public subscribeSSE(res: ISSEResponse): void {
    this.broadcaster.subscribe(res, () => ({
      type: 'init',
      status: this.getStatus(),
      telemetry: this.world.exportTelemetry()
    }));
  }

  public unsubscribeSSE(res: ISSEResponse): void {
    this.broadcaster.unsubscribe(res);
  }

  public getSubscriberCount(): number {
    return this.broadcaster.getSubscriberCount();
  }

  public broadcast(eventType: string, data: unknown): void {
    this.broadcaster.broadcast(eventType, data);
  }

  private broadcastTelemetry(telemetry: ISimulationTelemetry): void {
    this.broadcast('telemetry', telemetry);
  }

  private broadcastStatus(): void {
    this.broadcast('status', this.getStatus());
  }

  // =========================================================================
  // Remote Control Dispatch
  // =========================================================================

  public handleControlCommand(command: string, payload: Record<string, unknown> = {}): ICommandResult {
    return RemoteCommandDispatcher.dispatch(this, command, payload);
  }

  public triggerPerturbation(type: string, payload: Record<string, unknown> = {}): void {
    const geoType = RemoteCommandDispatcher.mapGeologicalEvent(type);
    this.world.triggerGeologicalEvent(geoType);
    const tele = this.world.exportTelemetry();
    this.broadcast('perturbation', { type, tick: tele.tick, payload });
    this.broadcastTelemetry(tele);
  }

  // =========================================================================
  // Telemetry, Status & Snapshot State
  // =========================================================================

  public getTelemetry(): ISimulationTelemetry {
    return this.world.exportTelemetry();
  }

  public getStatus(): IServerSimulationStatus {
    const tele = this.world.exportTelemetry();
    return {
      isRunning: this.isRunning,
      tick: tele.tick,
      speedMultiplier: this.speedMultiplier,
      targetIntervalMs: Math.max(2, Math.round(HeadlessSimulationHost.BASE_TICK_INTERVAL_MS / this.speedMultiplier)),
      clientCount: this.broadcaster.getSubscriberCount(),
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      livingCount: tele.livingCount,
      totalEnergyInUniverse: tele.totalEnergyInUniverse,
      isEnergyConserved: tele.ledger.isEnergyConserved,
      isMatterConserved: tele.ledger.isMatterConserved,
      autoSaveEnabled: this.autoSaveIntervalTicks > 0,
      lastAutoSaveTick: this.lastAutoSaveTick
    };
  }

  public createSnapshot(name: string = 'Server Checkpoint'): ISimulationStateSnapshot {
    const mgr = SimulationSnapshotManager.getInstance();
    return mgr.captureSnapshot(this.world, name, {
      branchId: 'server-main',
      parentSnapshotId: null,
      notes: 'Autonomic Headless Server Checkpoint'
    });
  }

  public restoreSnapshot(snapshot: ISimulationStateSnapshot): boolean {
    const wasRunning = this.isRunning;
    this.stop();

    try {
      const mgr = SimulationSnapshotManager.getInstance();
      mgr.restoreSnapshot(this.world, snapshot);
      const tele = this.world.exportTelemetry();
      this.broadcast('restore', { tick: tele.tick, snapshotName: snapshot.name });
      this.broadcastTelemetry(tele);
      this.broadcastStatus();

      if (wasRunning) {
        this.start();
      }
      return true;
    } catch (e) {
      console.error('Failed to restore snapshot:', e);
      return false;
    }
  }

  public reset(options?: ISimulationConfig): void {
    const wasRunning = this.isRunning;
    this.stop();

    this.world = new SimulationWorld({
      radius: options?.radius ?? 5,
      soupDensity: options?.soupDensity ?? 0.20,
      basaltDensity: options?.basaltDensity ?? 0.15,
      seed: options?.seed ?? Math.floor(Math.random() * 1000000)
    });

    const tele = this.world.exportTelemetry();
    this.broadcast('reset', { tick: tele.tick });
    this.broadcastTelemetry(tele);
    this.broadcastStatus();

    if (wasRunning) {
      this.start();
    }
  }

  public destroy(): void {
    this.stop();
    this.broadcaster.closeAll();
  }
}
