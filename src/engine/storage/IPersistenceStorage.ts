/**
 * 💾 IPersistenceStorage - Abstract key-value persistence interface for Siliquarium.
 * Decouples engine storage (BioBank, EnvironmentPresetRegistry) from browser-specific localStorage,
 * maintaining 100% Zero-DOM compliance in the engine layer.
 */

export interface IPersistenceStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

/**
 * 🧠 MemoryPersistenceStorage - In-memory implementation of IPersistenceStorage.
 * Default fallback for headless Node.js CLI test runners, worker threads, and server environments.
 */
export class MemoryPersistenceStorage implements IPersistenceStorage {
  private readonly store: Map<string, string> = new Map<string, string>();

  public getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  public setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  public removeItem(key: string): void {
    this.store.delete(key);
  }

  public clear(): void {
    this.store.clear();
  }
}
