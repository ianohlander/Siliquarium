/**
 * 🐠 Siliquarium UI Subsystem
 * MilestoneModal: Interactive Pedagogical Milestone Notification Card.
 * Displays Uri Alon network motifs, biological cognates, academic citations, and zoom locks.
 */

import { IMilestoneEvent } from '../engine/paleontology/DigitalPaleontologist.js';
import { HexCoord3D } from '../core/spatial/HexCoord3D.js';

export type FocusPoreCallback = (coord: HexCoord3D) => void;

export class MilestoneModal {
  private readonly containerEl: HTMLElement | null;
  private readonly onFocusPore: FocusPoreCallback;
  private currentEvent: IMilestoneEvent | null = null;

  constructor(onFocusPore: FocusPoreCallback) {
    this.onFocusPore = onFocusPore;
    this.containerEl = document.getElementById('milestone-modal');
    this.bindEvents();
  }

  private bindEvents(): void {
    const closeBtn = document.getElementById('milestone-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hide());
    }

    const zoomBtn = document.getElementById('milestone-zoom-btn');
    if (zoomBtn) {
      zoomBtn.addEventListener('click', () => {
        if (this.currentEvent) {
          this.onFocusPore(this.currentEvent.poreCoord);
          this.hide();
        }
      });
    }
  }

  public show(event: IMilestoneEvent): void {
    this.currentEvent = event;
    if (!this.containerEl) return;

    const titleEl = document.getElementById('milestone-title');
    const cognateEl = document.getElementById('milestone-cognate');
    const functionEl = document.getElementById('milestone-function');
    const citationEl = document.getElementById('milestone-citation');
    const hashEl = document.getElementById('milestone-hash');
    const coordEl = document.getElementById('milestone-coord');

    if (titleEl) titleEl.textContent = event.motif.name;
    if (cognateEl) cognateEl.textContent = event.motif.biologicalCognate;
    if (functionEl) functionEl.textContent = event.motif.naturalFunction;
    if (citationEl) citationEl.textContent = event.motif.citation;
    if (hashEl) hashEl.textContent = `Graph Invariant: ${event.wlHash}`;
    if (coordEl) coordEl.textContent = `Pore (${event.poreCoord.q}, ${event.poreCoord.r}, ${event.poreCoord.z}) at Tick ${event.tick}`;

    this.containerEl.classList.remove('hidden');
  }

  public hide(): void {
    if (this.containerEl) {
      this.containerEl.classList.add('hidden');
    }
    this.currentEvent = null;
  }
}
