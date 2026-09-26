/**
 * 🐠 Siliquarium UI Subsystem
 * LabFlyout: Real-time Parameter Tuning Flyout Drawer.
 * Allows live adjustment of physical constants, mutation rates, and primordial soup re-seeding.
 */

import { SimulationWorld } from '../engine/SimulationWorld.js';

export interface ILabCallbacks {
  readonly onSeedRequested: (density: number) => void;
  readonly onResetRequested: () => void;
  readonly onThermalPulseRequested: () => void;
}

export class LabFlyout {
  private readonly world: SimulationWorld;
  private readonly callbacks: ILabCallbacks;
  private isOpen: boolean = false;

  private drawerEl: HTMLElement | null = null;
  private toggleBtn: HTMLElement | null = null;
  private mutationSlider: HTMLInputElement | null = null;
  private mutationValLabel: HTMLElement | null = null;
  private soupSlider: HTMLInputElement | null = null;
  private soupValLabel: HTMLElement | null = null;

  constructor(world: SimulationWorld, callbacks: ILabCallbacks) {
    this.world = world;
    this.callbacks = callbacks;
    this.initElements();
  }

  private initElements(): void {
    this.drawerEl = document.getElementById('lab-drawer');
    this.toggleBtn = document.getElementById('lab-toggle-btn');
    this.mutationSlider = document.getElementById('slider-mutation') as HTMLInputElement | null;
    this.mutationValLabel = document.getElementById('label-mutation-val');
    this.soupSlider = document.getElementById('slider-soup') as HTMLInputElement | null;
    this.soupValLabel = document.getElementById('label-soup-val');

    this.bindEvents();
  }

  private bindEvents(): void {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggle());
    }

    if (this.mutationSlider && this.mutationValLabel) {
      this.mutationSlider.addEventListener('input', () => {
        const val = parseFloat(this.mutationSlider?.value ?? '0.001');
        this.world.setMutationRate(val);
        if (this.mutationValLabel) {
          this.mutationValLabel.textContent = `${(val * 100).toFixed(2)}%`;
        }
      });
    }

    if (this.soupSlider && this.soupValLabel) {
      this.soupSlider.addEventListener('input', () => {
        const val = parseFloat(this.soupSlider?.value ?? '0.20');
        if (this.soupValLabel) {
          this.soupValLabel.textContent = `${Math.round(val * 100)}%`;
        }
      });
    }

    const seedBtn = document.getElementById('btn-seed-soup');
    if (seedBtn) {
      seedBtn.addEventListener('click', () => {
        const density = parseFloat(this.soupSlider?.value ?? '0.20');
        this.callbacks.onSeedRequested(density);
      });
    }

    const resetBtn = document.getElementById('btn-reset-sim');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.callbacks.onResetRequested();
      });
    }
  }

  public toggle(): void {
    this.isOpen = !this.isOpen;
    if (this.drawerEl) {
      if (this.isOpen) {
        this.drawerEl.classList.remove('-translate-x-full');
      } else {
        this.drawerEl.classList.add('-translate-x-full');
      }
    }
  }

  public isExpanded(): boolean {
    return this.isOpen;
  }
}
