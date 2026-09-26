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
    const interval = Math.max(2, Math.floor(this.baseIntervalMs / this.speedMultiplier));
    this.timerId = setTimeout(() => {
      if (!this.running) return;
      this.step(1);
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
