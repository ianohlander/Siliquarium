/**
 * 🐠 Siliquarium UI Subsystem
 * MilestoneModal: Interactive Pedagogical Milestone Notification Card.
 * Displays Uri Alon network motifs, biological cognates, academic citations, and zoom locks.
 */

import { IMilestoneEvent } from '../engine/paleontology/DigitalPaleontologist.js';
import { HexCoord3D } from '../core/spatial/HexCoord3D.js';
import { TaxonomyNomenclature } from '../core/paleontology/TaxonomyNomenclature.js';

export type FocusPoreCallback = (coord: HexCoord3D) => void;

export class MilestoneModal {
  private readonly containerEl: HTMLElement | null;
  private readonly onFocusPore: FocusPoreCallback;
  private currentEvent: IMilestoneEvent | null = null;
  private popupsEnabled: boolean = true;
  private onMuteCallback?: (muted: boolean) => void;

  constructor(onFocusPore: FocusPoreCallback, onMuteCallback?: (muted: boolean) => void) {
    this.onFocusPore = onFocusPore;
    this.onMuteCallback = onMuteCallback;
    this.containerEl = document.getElementById('milestone-modal');
    this.bindEvents();
  }

  public isPopupsEnabled(): boolean {
    return this.popupsEnabled;
  }

  public setPopupsEnabled(enabled: boolean): void {
    this.popupsEnabled = enabled;
  }

  private bindEvents(): void {
    const closeBtn = document.getElementById('milestone-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hide());
    }

    const closeXBtn = document.getElementById('milestone-close-x');
    if (closeXBtn) {
      closeXBtn.addEventListener('click', () => this.hide());
    }

    const muteBtn = document.getElementById('milestone-mute-btn');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        this.popupsEnabled = false;
        if (this.onMuteCallback) {
          this.onMuteCallback(true);
        }
        this.hide();
      });
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
    if (!this.popupsEnabled || !this.containerEl) return;

    const titleEl = document.getElementById('milestone-title');
    const cognateEl = document.getElementById('milestone-cognate');
    const functionEl = document.getElementById('milestone-function');
    const citationEl = document.getElementById('milestone-citation');
    const hashEl = document.getElementById('milestone-hash');
    const coordEl = document.getElementById('milestone-coord');

    const taxon = TaxonomyNomenclature.classify(undefined, [event.motif.type], 0, false);
    if (titleEl) titleEl.textContent = `${event.motif.name} • ${taxon.binomialName}`;
    if (cognateEl) cognateEl.textContent = `${event.motif.biologicalCognate} (Homage: ${taxon.honoree} — ${taxon.field})`;
    if (functionEl) functionEl.textContent = event.motif.naturalFunction;
    if (citationEl) citationEl.textContent = event.motif.citation;
    if (hashEl) hashEl.textContent = `Graph Invariant: ${event.wlHash}`;
    if (coordEl) coordEl.textContent = `Pore (${event.poreCoord.q}, ${event.poreCoord.r}, ${event.poreCoord.z}) at Tick ${event.tick}`;

    const guideBtn = document.getElementById('milestone-guide-btn') as HTMLAnchorElement | null;
    if (guideBtn) {
      const specUrl = this.getGuideUrl(event.motif.name);
      guideBtn.href = `docs/${specUrl}`;
    }

    this.containerEl.classList.remove('hidden');
  }

  private getGuideUrl(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes('bistable') || lower.includes('latch') || lower.includes('memory')) {
      return 'paleontology/specimen_01_bistable_latch.html';
    }
    if (lower.includes('ring') || lower.includes('oscillator') || lower.includes('repressilator')) {
      return 'paleontology/specimen_02_repressilator.html';
    }
    if (lower.includes('coherent') || lower.includes('c-ffl')) {
      return 'paleontology/specimen_03_coherent_ffl.html';
    }
    if (lower.includes('incoherent') || lower.includes('i-ffl')) {
      return 'paleontology/specimen_04_incoherent_ffl.html';
    }
    if (lower.includes('autoreg') || lower.includes('nar')) {
      return 'paleontology/specimen_05_negative_autoregulation.html';
    }
    if (lower.includes('adder') || lower.includes('parity')) {
      return 'paleontology/specimen_06_binary_half_adder.html';
    }
    if (lower.includes('allosteric') || lower.includes('inverter') || lower.includes('not')) {
      return 'paleontology/specimen_07_allosteric_inverter.html';
    }
    if (lower.includes('organelle') || lower.includes('endosymbiont')) {
      return 'paleontology/specimen_08_endosymbiotic_cassette.html';
    }
    if (lower.includes('syncyt') || lower.includes('multicell')) {
      return 'paleontology/specimen_09_syncytial_multicellularity.html';
    }
    if (lower.includes('spore') || lower.includes('pelagic')) {
      return 'paleontology/specimen_10_pelagic_sporulation.html';
    }
    if (lower.includes('temporal') || lower.includes('chemotaxis') || lower.includes('purcell')) {
      return 'paleontology/specimen_16_temporal_derivative_chemotaxis.html';
    }
    if (lower.includes('predictive') || lower.includes('pavlov')) {
      return 'paleontology/specimen_17_predictive_pavlovian.html';
    }
    if (lower.includes('entrained') || lower.includes('pacemaker') || lower.includes('johnson')) {
      return 'paleontology/specimen_18_entrained_pacemaker.html';
    }
    if (lower.includes('steiner') || lower.includes('vascular') || lower.includes('nakagaki')) {
      return 'paleontology/specimen_19_steiner_vascular_network.html';
    }
    if (lower.includes('dormancy') || lower.includes('persister') || lower.includes('balaban')) {
      return 'paleontology/specimen_20_cryptobiotic_dormancy_clamp.html';
    }
    return 'CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.html';
  }

  public hide(): void {
    if (this.containerEl) {
      this.containerEl.classList.add('hidden');
    }
    this.currentEvent = null;
  }
}
