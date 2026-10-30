/**
 * 🌐 Siliquarium Global Type Declarations
 * Declares ambient browser API extensions and vendor prefixes,
 * eliminating the need for `(window as any)` or `(this.ctx as any)` casts.
 */

declare global {
  interface Performance {
    memory?: {
      readonly usedJSHeapSize: number;
      readonly totalJSHeapSize: number;
      readonly jsHeapSizeLimit: number;
    };
  }

  interface Window {
    webkitAudioContext?: typeof AudioContext;
    siliquariumApp?: unknown;
  }

  interface CanvasRenderingContext2D {
    roundRect(x: number, y: number, w: number, h: number, radii?: number | number[]): void;
  }
}

export {};
