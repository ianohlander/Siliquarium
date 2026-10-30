/**
 * 🐠 Siliquarium UI Subsystem
 * ChronicleAnalysisLabModal: Deep Silicoid Morphometrics, GRN Logic & Thermodynamic Investigation Lab.
 * 
 * Provides an exhaustive laboratory workstation during Chronicle playback to inspect:
 * 1. Specimen Morphometrics & Tissue Differentiation (French Flag Wolpert ratios)
 * 2. Gene Regulatory Network (GRN) CMOS Gates & Operon Dynamics
 * 3. Thermodynamic Energy PMF & Closed-Universe Mass Balance Ledger
 * 4. Kinematics, Low-Reynolds Hydrodynamics & Streaming Trajectories
 * 5. Direct 1-click Cryo-Preservation to the Richard Lenski Bio-Bank
 */

import { HexCoord3D } from '../core/spatial/HexCoord3D.js';
import { IKinematicBody, IKinematicCellSnapshot } from '../engine/kinematics/ColonyKinematicsRecorder.js';
import { BioBank } from '../engine/storage/BioBank.js';
import {
  ChronicleLabTab,
  buildChronicleLabTabContent,
  buildChronicleLabDialog
} from './ChronicleAnalysisLabHtmlTemplate.js';

export type { ChronicleLabTab };

export interface IChronicleLabCallbacks {
  readonly onPinLineage?: (cladeId: string, bodyId?: string) => void;
  readonly onOpenCADAutopsy?: (coord: HexCoord3D) => void;
  readonly onOpenPhylogeny?: (cladeId: string) => void;
  readonly onToast?: (message: string) => void;
}

export class ChronicleAnalysisLabModal {
  private containerEl: HTMLElement | null = null;
  private isVisible: boolean = false;
  private currentBody: IKinematicBody | null = null;
  private currentCell: IKinematicCellSnapshot | null = null;
  private currentTick: number = 0;
  private activeTab: ChronicleLabTab = 'morphometrics';
  private readonly callbacks: IChronicleLabCallbacks;

  constructor(callbacks: IChronicleLabCallbacks = {}) {
    this.callbacks = callbacks;
    this.initDOM();
  }

  private initDOM(): void {
    let existing = document.getElementById('chronicle-analysis-lab-modal');
    if (!existing) {
      existing = document.createElement('div');
      existing.id = 'chronicle-analysis-lab-modal';
      existing.className = 'chronicle-lab-modal hidden';
      document.body.appendChild(existing);
    }
    this.containerEl = existing;
  }

  public show(body: IKinematicBody, cell?: IKinematicCellSnapshot, tick: number = 0): void {
    this.currentBody = body;
    this.currentCell = cell || body.cells[0] || null;
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

  public setTab(tab: ChronicleLabTab): void {
    this.activeTab = tab;
    this.renderHTML();
    this.bindEvents();
  }

  private renderHTML(): void {
    if (!this.containerEl || !this.currentBody) return;

    const b = this.currentBody;
    const c = this.currentCell || b.cells[0];

    const tabContentHtml = buildChronicleLabTabContent({
      body: b,
      cell: c,
      activeTab: this.activeTab
    });

    this.containerEl.innerHTML = buildChronicleLabDialog({
      body: b,
      tick: this.currentTick,
      activeTab: this.activeTab,
      tabContentHtml
    });
  }

  private bindEvents(): void {
    if (!this.containerEl) return;

    // Close buttons
    this.containerEl.querySelector('#lab-btn-close')?.addEventListener('click', () => this.hide());
    this.containerEl.querySelector('#lab-btn-done')?.addEventListener('click', () => this.hide());

    // Tab buttons
    const tabBtns = this.containerEl.querySelectorAll('.lab-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = (e.currentTarget as HTMLElement).getAttribute('data-tab') as ChronicleLabTab;
        if (tab) this.setTab(tab);
      });
    });

    // Tissue matrix row click to switch cell
    const rows = this.containerEl.querySelectorAll('.lab-matrix-row');
    rows.forEach(row => {
      row.addEventListener('click', (e) => {
        const el = e.currentTarget as HTMLElement;
        const q = parseInt(el.getAttribute('data-q') || '0', 10);
        const r = parseInt(el.getAttribute('data-r') || '0', 10);
        const z = parseInt(el.getAttribute('data-z') || '0', 10);
        if (this.currentBody) {
          const target = this.currentBody.cells.find(c => c.coord.q === q && c.coord.r === r && c.coord.z === z);
          if (target) {
            this.currentCell = target;
            this.renderHTML();
            this.bindEvents();
          }
        }
      });
    });

    // Freeze to Bio-Bank
    const freezeBtn = this.containerEl.querySelector('#lab-btn-freeze') as HTMLButtonElement | null;
    freezeBtn?.addEventListener('click', () => {
      if (!this.currentBody) return;
      const b = this.currentBody;
      const leadCell = this.currentCell || b.cells[0];
      const bioBank = BioBank.getInstance();

      const record = bioBank.saveSilicoid({
        name: `${b.speciesName} [Epoch ${this.currentTick}]`,
        taxonBinomial: b.speciesName,
        commonName: b.isMulticellularDifferentiated ? 'Syncytial Titan' : 'Colonial Silicoid',
        tapeBitstring: leadCell.tapeBitstring || '010101010101010101010101010101010101010101010101010101010101',
        gateCount: leadCell.gateCount,
        gateTypes: leadCell.gateTypes,
        generation: 1,
        savedAtEpoch: this.currentTick,
        notes: `Frozen from Chronicle Analysis Lab at Tick #${this.currentTick}. Morphology: ${b.bodyTopology}, ${b.cells.length} cells.`,
        isDifferentiated: b.isMulticellularDifferentiated,
        bodyTopology: b.bodyTopology
      });

      freezeBtn.innerHTML = '✅ Frozen to Bio-Bank!';
      freezeBtn.style.background = 'rgba(16, 185, 129, 0.3)';
      freezeBtn.style.borderColor = '#10b981';
      freezeBtn.disabled = true;

      this.callbacks.onToast?.(`❄️ Specimen "${record.name}" safely cryo-preserved in Bio-Bank!`);
    });

    // Tag Specimen
    const pinBtn = this.containerEl.querySelector('#lab-btn-pin');
    pinBtn?.addEventListener('click', () => {
      if (this.currentBody) {
        this.callbacks.onPinLineage?.(this.currentBody.cladeId, this.currentBody.bodyId);
        this.callbacks.onToast?.(`📌 Tagged Organism [${this.currentBody.organismId || this.currentBody.bodyId}]`);
      }
    });

    // View Phylogeny
    const phyloBtn = this.containerEl.querySelector('#lab-btn-phylo');
    phyloBtn?.addEventListener('click', () => {
      if (this.currentBody) {
        this.hide();
        this.callbacks.onOpenPhylogeny?.(this.currentBody.cladeId);
      }
    });

    // CAD Autopsy
    const cadBtn = this.containerEl.querySelector('#lab-btn-cad');
    cadBtn?.addEventListener('click', () => {
      if (this.currentCell) {
        this.hide();
        this.callbacks.onOpenCADAutopsy?.(this.currentCell.coord);
      }
    });
  }
}
