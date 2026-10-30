/**
 * 🐠 Siliquarium UI Subsystem
 * HistologicalInspectorModal: In-Situ Microscopic Autopsy & Multicellular Role Inspector.
 * 
 * Inspects a cell's netlist, active operon switches, chemiosmotic battery, and histological role
 * during paused or active Chronicle playback, with direct links to pedagogical guides.
 */

import { HexCoord3D } from '../core/spatial/HexCoord3D.js';
import { IKinematicBody, IKinematicCellSnapshot } from '../engine/kinematics/ColonyKinematicsRecorder.js';
import { buildHistologicalModalMarkup } from './HistologicalInspectorModalHtmlTemplate.js';

export interface IHistologicalInspectorCallbacks {
  readonly onPinLineage?: (cladeId: string, bodyId?: string) => void;
  readonly onOpenCADAutopsy?: (coord: HexCoord3D) => void;
  readonly onOpenPhylogeny?: (cladeId: string) => void;
}

export class HistologicalInspectorModal {
  private containerEl: HTMLElement | null = null;
  private isVisible: boolean = false;
  private currentBody: IKinematicBody | null = null;
  private currentCell: IKinematicCellSnapshot | null = null;
  private currentTick: number = 0;
  private readonly callbacks: IHistologicalInspectorCallbacks;

  constructor(callbacks: IHistologicalInspectorCallbacks = {}) {
    this.callbacks = callbacks;
    this.initDOM();
  }

  private initDOM(): void {
    let existing = document.getElementById('histological-inspector-modal');
    if (!existing) {
      existing = document.createElement('div');
      existing.id = 'histological-inspector-modal';
      existing.className = 'histological-inspector-modal hidden';
      document.body.appendChild(existing);
    }
    this.containerEl = existing;
  }

  public show(body: IKinematicBody, cell: IKinematicCellSnapshot, tick: number): void {
    this.currentBody = body;
    this.currentCell = cell;
    this.currentTick = tick;
    this.isVisible = true;

    this.renderHTML();
    this.bindEvents();
    this.containerEl?.classList.remove('hidden');
  }

  public hide(): void {
    this.isVisible = false;
    this.containerEl?.classList.add('hidden');
  }

  public isOpen(): boolean {
    return this.isVisible;
  }

  private renderHTML(): void {
    if (!this.containerEl || !this.currentBody || !this.currentCell) return;

    this.containerEl.innerHTML = buildHistologicalModalMarkup({
      body: this.currentBody,
      cell: this.currentCell,
      tick: this.currentTick
    });
  }

  private bindEvents(): void {
    if (!this.containerEl) return;

    const closeBtn = this.containerEl.querySelector('#hist-close-btn');
    closeBtn?.addEventListener('click', () => this.hide());

    const footerCloseBtn = this.containerEl.querySelector('#hist-btn-close');
    footerCloseBtn?.addEventListener('click', () => this.hide());

    const pinBtn = this.containerEl.querySelector('#hist-btn-pin-lineage');
    pinBtn?.addEventListener('click', () => {
      if (this.currentBody) {
        this.callbacks.onPinLineage?.(this.currentBody.cladeId, this.currentBody.bodyId);
        this.hide();
      }
    });

    const phyloBtn = this.containerEl.querySelector('#hist-btn-phylo');
    phyloBtn?.addEventListener('click', () => {
      if (this.currentBody) {
        this.callbacks.onOpenPhylogeny?.(this.currentBody.cladeId);
        this.hide();
      }
    });

    const cadBtn = this.containerEl.querySelector('#hist-btn-cad-autopsy');
    cadBtn?.addEventListener('click', () => {
      if (this.currentCell) {
        this.callbacks.onOpenCADAutopsy?.(this.currentCell.coord);
        this.hide();
      }
    });

    this.containerEl.querySelectorAll('.hist-matrix-row').forEach(row => {
      row.addEventListener('click', () => {
        const q = parseInt((row as HTMLElement).dataset.q || '0', 10);
        const r = parseInt((row as HTMLElement).dataset.r || '0', 10);
        const z = parseInt((row as HTMLElement).dataset.z || '0', 10);
        const targetCoord = new HexCoord3D(q, r, z);
        const found = this.currentBody?.cells.find(c => c.coord.equals(targetCoord));
        if (found && this.currentBody) {
          this.currentCell = found;
          this.renderHTML();
          this.bindEvents();
        }
      });
    });
  }
}
