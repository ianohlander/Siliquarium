/**
 * 🌐 BrowserLocalStorageProvider - Browser-backed implementation of IPersistenceStorage.
 * Connects window.localStorage to engine storage components while preserving Zero-DOM engine purity.
 */

import { IPersistenceStorage } from '../engine/storage/IPersistenceStorage';

export class BrowserLocalStorageProvider implements IPersistenceStorage {
  public getItem(key: string): string | null {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      return null;
    }
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  public setItem(key: string, value: string): void {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(key, value);
    } catch (err) {
      console.warn(`Siliquarium: Failed to write to localStorage key '${key}':`, err);
    }
  }

  public removeItem(key: string): void {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      return;
    }
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore
    }
  }

  public clear(): void {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      return;
    }
    try {
      window.localStorage.clear();
    } catch {
      // Ignore
    }
  }
}
