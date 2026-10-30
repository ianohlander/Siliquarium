/**
 * 🐠 Siliquarium Remote Engine Subsystem
 * RemoteSimulationClient: Browser Client Adapter for Headless Server Simulation.
 * 
 * Connects to the Node.js headless simulation server via Server-Sent Events (SSE)
 * and dispatches remote control commands via REST.
 * 
 * Allows the browser WebGL seafloor, Circuit Microscope, Safari Guide, and HUD
 * to render and manipulate a persistent server-side simulation without running
 * CPU-heavy physics calculations on the client UI thread.
 */

import { ISimulationTelemetry } from '../SimulationTelemetry.js';
import type { IServerSimulationStatus } from '../../server/HeadlessSimulationHost.js';

export interface IRemoteServerResult<T = unknown> {
  readonly success: boolean;
  readonly message: string;
  readonly result?: T;
}

export type TelemetryHandler = (telemetry: ISimulationTelemetry) => void;
export type StatusHandler = (status: IServerSimulationStatus) => void;
export type ConnectionHandler = (connected: boolean) => void;
export type EventHandler<T = unknown> = (event: { type: string; data: T }) => void;

export class RemoteSimulationClient {
  private eventSource: EventSource | null = null;
  private isConnectedState: boolean = false;
  private serverUrl: string = '';
  private lastStatus: IServerSimulationStatus | null = null;
  private latestTelemetry: ISimulationTelemetry | null = null;

  private readonly telemetryHandlers: Set<TelemetryHandler> = new Set();
  private readonly statusHandlers: Set<StatusHandler> = new Set();
  private readonly connectionHandlers: Set<ConnectionHandler> = new Set();
  private readonly eventHandlers: Set<EventHandler> = new Set();

  constructor(serverUrl: string = '') {
    this.serverUrl = serverUrl;
  }

  public isConnected(): boolean {
    return this.isConnectedState;
  }

  public getLatestTelemetry(): ISimulationTelemetry | null {
    return this.latestTelemetry;
  }

  public getLastStatus(): IServerSimulationStatus | null {
    return this.lastStatus;
  }

  public connect(serverUrl?: string): void {
    if (serverUrl !== undefined) {
      this.serverUrl = serverUrl;
    }
    this.disconnect();

    const streamUrl = `${this.serverUrl}/api/sim/stream`;
    try {
      this.eventSource = new EventSource(streamUrl);

      this.eventSource.onopen = () => {
        this.isConnectedState = true;
        this.notifyConnectionChange(true);
      };

      this.eventSource.onerror = () => {
        if (this.isConnectedState) {
          this.isConnectedState = false;
          this.notifyConnectionChange(false);
        }
      };

      // Handle Initial Handshake
      this.eventSource.addEventListener('init', (e: MessageEvent) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.status) {
            this.lastStatus = payload.status;
            this.notifyStatus(payload.status);
          }
          if (payload.telemetry) {
            this.latestTelemetry = payload.telemetry;
            this.notifyTelemetry(payload.telemetry);
          }
        } catch (err) {
          console.error('[RemoteClient] Failed to parse init event:', err);
        }
      });

      // Handle Live Telemetry Stream
      this.eventSource.addEventListener('telemetry', (e: MessageEvent) => {
        try {
          const tele = JSON.parse(e.data) as ISimulationTelemetry;
          this.latestTelemetry = tele;
          this.notifyTelemetry(tele);
        } catch (err) {
          console.error('[RemoteClient] Failed to parse telemetry event:', err);
        }
      });

      // Handle Server Status Update
      this.eventSource.addEventListener('status', (e: MessageEvent) => {
        try {
          const status = JSON.parse(e.data) as IServerSimulationStatus;
          this.lastStatus = status;
          this.notifyStatus(status);
        } catch (err) {
          console.error('[RemoteClient] Failed to parse status event:', err);
        }
      });

      // Handle Custom Events (perturbations, snapshots, resets)
      const customEvents = ['perturbation', 'snapshot', 'restore', 'reset'];
      for (const evType of customEvents) {
        this.eventSource.addEventListener(evType, (e: MessageEvent) => {
          try {
            const data = JSON.parse(e.data);
            this.notifyEvent(evType, data);
          } catch (err) {
            console.error(`[RemoteClient] Failed to parse ${evType} event:`, err);
          }
        });
      }
    } catch (err) {
      console.error('[RemoteClient] Could not establish EventSource connection:', err);
      this.isConnectedState = false;
      this.notifyConnectionChange(false);
    }
  }

  public disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    if (this.isConnectedState) {
      this.isConnectedState = false;
      this.notifyConnectionChange(false);
    }
  }

  // =========================================================================
  // Control Commands
  // =========================================================================

  public async sendCommand<T = unknown>(command: string, payload: Record<string, unknown> = {}): Promise<IRemoteServerResult<T>> {
    const url = `${this.serverUrl}/api/sim/control`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command, payload })
      });

      if (!res.ok) {
        return { success: false, message: `Server error: HTTP ${res.status}` };
      }
      return await res.json();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, message: `Network request failed: ${msg}` };
    }
  }

  public async play(): Promise<IRemoteServerResult> {
    return this.sendCommand('play');
  }

  public async pause(): Promise<IRemoteServerResult> {
    return this.sendCommand('pause');
  }

  public async step(count: number = 1): Promise<IRemoteServerResult> {
    return this.sendCommand('step', { count });
  }

  public async setSpeed(speed: number): Promise<IRemoteServerResult> {
    return this.sendCommand('setSpeed', { speed });
  }

  public async triggerPerturbation(type: string, payload: Record<string, unknown> = {}): Promise<IRemoteServerResult> {
    return this.sendCommand('perturb', { type, ...payload });
  }

  public async applyBrush(action: string, coords: readonly unknown[], options: Record<string, unknown> = {}): Promise<IRemoteServerResult> {
    return this.sendCommand('brush', { action, coords, ...options });
  }

  public async resetWorld(options: Record<string, unknown> = {}): Promise<IRemoteServerResult> {
    return this.sendCommand('reset', { options });
  }

  public async saveSnapshot(name?: string): Promise<IRemoteServerResult> {
    return this.sendCommand('snapshot', { name });
  }

  public async restoreSnapshot(snapshot: unknown): Promise<IRemoteServerResult> {
    return this.sendCommand('restore', { snapshot });
  }

  // =========================================================================
  // Listener Subscriptions
  // =========================================================================

  public onTelemetry(handler: TelemetryHandler): () => void {
    this.telemetryHandlers.add(handler);
    return () => this.telemetryHandlers.delete(handler);
  }

  public onStatus(handler: StatusHandler): () => void {
    this.statusHandlers.add(handler);
    return () => this.statusHandlers.delete(handler);
  }

  public onConnectionChange(handler: ConnectionHandler): () => void {
    this.connectionHandlers.add(handler);
    return () => this.connectionHandlers.delete(handler);
  }

  public onEvent(handler: EventHandler): () => void {
    this.eventHandlers.add(handler);
    return () => this.eventHandlers.delete(handler);
  }

  private notifyTelemetry(tele: ISimulationTelemetry): void {
    for (const h of this.telemetryHandlers) {
      try { h(tele); } catch (err) { console.error(err); }
    }
  }

  private notifyStatus(status: IServerSimulationStatus): void {
    for (const h of this.statusHandlers) {
      try { h(status); } catch (err) { console.error(err); }
    }
  }

  private notifyConnectionChange(connected: boolean): void {
    for (const h of this.connectionHandlers) {
      try { h(connected); } catch (err) { console.error(err); }
    }
  }

  private notifyEvent(type: string, data: unknown): void {
    for (const h of this.eventHandlers) {
      try { h({ type, data }); } catch (err) { console.error(err); }
    }
  }
}
