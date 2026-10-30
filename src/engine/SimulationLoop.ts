/**
 * 🐠 Siliquarium Engine Subsystem
 * SimulationLoop: Headless and browser-compatible step ticker.
 * Manages simulation play/pause, variable speed multiplier, and tick callbacks.
 */

import { SimulationWorld } from './SimulationWorld.js';
import { ISimulationTelemetry } from './SimulationTelemetry.js';

export type TickCallback = (telemetry: ISimulationTelemetry) => void;
export type StateCallback = (running: boolean) => void;

export class SimulationLoop {
  private readonly world: SimulationWorld;
  private running: boolean = false;
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private speedMultiplier: number = 1;
  private readonly baseIntervalMs: number = 100; // 10 ticks per second at 1x

  private readonly tickListeners: Set<TickCallback> = new Set();
  private readonly stateListeners: Set<StateCallback> = new Set();

  constructor(world: SimulationWorld) {
    this.world = world;
  }

  public start(): void {
    if (this.running) return;
    this.running = true;
    this.notifyStateChange();
    this.scheduleNextTick();
  }

  public pause(): void {
    if (!this.running) return;
    this.running = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.notifyStateChange();
  }

  public toggle(): boolean {
    if (this.running) {
      this.pause();
    } else {
      this.start();
    }
    return this.running;
  }

  public step(ticks: number = 1): ISimulationTelemetry {
    for (let i = 0; i < ticks; i++) {
      this.world.step();
    }
    const telemetry = this.world.exportTelemetry();
    this.notifyTick(telemetry);
    return telemetry;
  }

  public setSpeed(multiplier: number): void {
    this.speedMultiplier = Math.max(0.1, Math.min(50, multiplier));
  }

  public getSpeed(): number {
    return this.speedMultiplier;
  }

  public isRunning(): boolean {
    return this.running;
  }

  public onTick(cb: TickCallback): () => void {
    this.tickListeners.add(cb);
    return () => this.tickListeners.delete(cb);
  }

  public onStateChange(cb: StateCallback): () => void {
    this.stateListeners.add(cb);
    return () => this.stateListeners.delete(cb);
  }

  public getWorld(): SimulationWorld {
    return this.world;
  }

  private scheduleNextTick(): void {
    if (!this.running) return;

    // Balanced time-slicing: At high speeds, batch steps into sensible intervals (>= 25ms)
    // so the browser event loop and requestAnimationFrame have room to render at 60 FPS
    let interval: number;
    let ticksPerBatch: number;

    if (this.speedMultiplier <= 1) {
      interval = Math.max(10, Math.floor(this.baseIntervalMs / this.speedMultiplier));
      ticksPerBatch = 1;
    } else if (this.speedMultiplier <= 3) {
      interval = Math.max(20, Math.floor(this.baseIntervalMs / this.speedMultiplier));
      ticksPerBatch = 1;
    } else {
      // 4x - 50x: Batch ticks in tight 16ms slices with an 8ms budget guard so requestAnimationFrame renders at 60 FPS
      interval = 16;
      ticksPerBatch = Math.max(1, Math.round((this.speedMultiplier * 10) / (1000 / interval)));
    }

    this.timerId = setTimeout(() => {
      if (!this.running) return;
      const tStart = performance.now();
      for (let i = 0; i < ticksPerBatch; i++) {
        this.world.step();
        // Adaptive budget guard: Never block the main UI thread for > 8ms per timer callback
        if (i < ticksPerBatch - 1 && (performance.now() - tStart) > 8) {
          break;
        }
      }
      if (this.tickListeners.size > 0) {
        const telemetry = this.world.exportTelemetry();
        this.notifyTick(telemetry);
      }
      this.scheduleNextTick();
    }, interval);
  }

  private notifyTick(telemetry: ISimulationTelemetry): void {
    for (const listener of this.tickListeners) {
      listener(telemetry);
    }
  }

  private notifyStateChange(): void {
    for (const listener of this.stateListeners) {
      listener(this.running);
    }
  }
}
