/**
 * 🐠 Siliquarium UI Subsystem
 * DiscoveryHistoryModal: Interactive Chronological Circuit Paleontology Log & Drawer.
 * Displays sequential discoveries of Uri Alon biological network motifs,
 * Weisfeiler-Lehman graph hashes, pore coordinates, and allows direct camera focus.
 */

import { IMilestoneEvent } from '../engine/paleontology/DigitalPaleontologist.js';
import { HexCoord3D } from '../core/spatial/HexCoord3D.js';
import { TaxonomyNomenclature } from '../core/paleontology/TaxonomyNomenclature.js';
import { FocusPoreCallback } from './MilestoneModal.js';
import { SiliquariumDB } from '../engine/storage/SiliquariumDB.js';
import {
  buildDiscoveryModalSkeleton,
  buildDiscoveryEmptyStateHtml,
  buildDiscoveryCardHtml
} from './DiscoveryHistoryModalHtmlTemplate.js';

export type TogglePopupsCallback = (enabled: boolean) => void;

export class DiscoveryHistoryModal {
  private containerEl: HTMLElement | null = null;
  private backdropEl: HTMLElement | null = null;
  private isOpen: boolean = false;
  private readonly onFocusPore: FocusPoreCallback;
  private readonly onTogglePopups: TogglePopupsCallback;
  private currentMilestones: readonly IMilestoneEvent[] = [];
  private popupsEnabled: boolean = true;

  constructor(onFocusPore: FocusPoreCallback, onTogglePopups: TogglePopupsCallback) {
    this.onFocusPore = onFocusPore;
    this.onTogglePopups = onTogglePopups;
    this.ensureElements();
    this.bindEvents();
  }

  private ensureElements(): void {
    let modal = document.getElementById('discovery-history-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'discovery-history-modal';
      modal.className = 'discovery-modal-container hidden';
      modal.innerHTML = buildDiscoveryModalSkeleton();
      document.body.appendChild(modal);
    }

    this.containerEl = modal;
    this.backdropEl = document.getElementById('discovery-backdrop');
  }

  private bindEvents(): void {
    const closeBtn = document.getElementById('discovery-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.hide());
    if (this.backdropEl) this.backdropEl.addEventListener('click', () => this.hide());

    const toggleBtn = document.getElementById('discovery-toggle-popups-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.popupsEnabled = !this.popupsEnabled;
        this.onTogglePopups(this.popupsEnabled);
        this.updatePopupButtons();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.hide();
      }
    });
  }

  public show(milestones: readonly IMilestoneEvent[], popupsEnabled: boolean): void {
    this.currentMilestones = milestones;
    this.popupsEnabled = popupsEnabled;
    this.ensureElements();
    this.updatePopupButtons();
    this.renderCards();
    if (this.containerEl) {
      this.containerEl.classList.remove('hidden');
    }
    this.isOpen = true;
  }

  public hide(): void {
    if (this.containerEl) {
      this.containerEl.classList.add('hidden');
    }
    this.isOpen = false;
  }

  public toggle(milestones: readonly IMilestoneEvent[], popupsEnabled: boolean): void {
    if (this.isOpen) {
      this.hide();
    } else {
      this.show(milestones, popupsEnabled);
    }
  }

  public update(milestones: readonly IMilestoneEvent[]): void {
    this.currentMilestones = milestones;
    if (this.isOpen) {
      this.renderCards();
    }
  }

  public setPopupsEnabled(enabled: boolean): void {
    this.popupsEnabled = enabled;
    this.updatePopupButtons();
  }

  private updatePopupButtons(): void {
    const toggleBtn = document.getElementById('discovery-toggle-popups-btn');
    const textEl = document.getElementById('discovery-popup-text');
    const iconEl = document.getElementById('discovery-popup-icon');
    const modeEl = document.getElementById('discovery-notif-mode');
    const hudBtn = document.getElementById('btn-toggle-discovery-popups');

    if (this.popupsEnabled) {
      if (textEl) textEl.textContent = 'Alert Pop-ups: ON';
      if (iconEl) iconEl.textContent = '🔔';
      if (toggleBtn) {
        toggleBtn.style.borderColor = '#10b981';
        toggleBtn.style.color = '#10b981';
        toggleBtn.style.background = 'rgba(16, 185, 129, 0.15)';
      }
      if (modeEl) {
        modeEl.textContent = 'Active Modal';
        modeEl.style.color = '#10b981';
      }
      if (hudBtn) {
        hudBtn.innerHTML = '🔔 Pop-ups: ON';
        hudBtn.style.borderColor = '#10b981';
        hudBtn.style.color = '#10b981';
      }
    } else {
      if (textEl) textEl.textContent = 'Alert Pop-ups: MUTED';
      if (iconEl) iconEl.textContent = '🔕';
      if (toggleBtn) {
        toggleBtn.style.borderColor = '#64748b';
        toggleBtn.style.color = '#94a3b8';
        toggleBtn.style.background = 'rgba(100, 116, 139, 0.15)';
      }
      if (modeEl) {
        modeEl.textContent = 'Silent Log Only';
        modeEl.style.color = '#94a3b8';
      }
      if (hudBtn) {
        hudBtn.innerHTML = '🔕 Pop-ups: MUTED';
        hudBtn.style.borderColor = '#64748b';
        hudBtn.style.color = '#94a3b8';
      }
    }
  }

  private renderCards(): void {
    const totalEl = document.getElementById('discovery-total-count');
    const uniqueEl = document.getElementById('discovery-unique-count');
    const latestEl = document.getElementById('discovery-latest-tick');
    const listEl = document.getElementById('discovery-cards-list');

    if (totalEl) totalEl.textContent = String(this.currentMilestones.length);

    SiliquariumDB.getInstance().getMilestoneCount().then(dbCount => {
      if (totalEl && dbCount > this.currentMilestones.length) {
        totalEl.textContent = `${dbCount} (${this.currentMilestones.length} active)`;
      }
    }).catch(() => {});

    const uniqueMotifs = new Set(this.currentMilestones.map(m => m.motif.type));
    if (uniqueEl) uniqueEl.textContent = `${uniqueMotifs.size} / 20`;

    if (this.currentMilestones.length > 0) {
      const latest = this.currentMilestones[this.currentMilestones.length - 1];
      if (latestEl) latestEl.textContent = `Tick ${latest.tick.toLocaleString()}`;
    } else {
      if (latestEl) latestEl.textContent = '—';
    }

    if (!listEl) return;

    if (this.currentMilestones.length === 0) {
      listEl.innerHTML = buildDiscoveryEmptyStateHtml();
      return;
    }

    // Render cards in reverse chronological order (newest on top)
    let cardsHtml = '';
    for (let i = this.currentMilestones.length - 1; i >= 0; i--) {
      const m = this.currentMilestones[i];
      const seqNum = i + 1;
      const taxon = TaxonomyNomenclature.classify(undefined, [m.motif.type], 0, false);
      const specimenUrl = this.getSpecimenUrl(m.motif.name);
      cardsHtml += buildDiscoveryCardHtml(m, seqNum, taxon, specimenUrl);
    }

    listEl.innerHTML = cardsHtml;

    // Attach inspect click handlers
    const inspectButtons = listEl.querySelectorAll('.discovery-inspect-btn');
    inspectButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const q = parseInt(target.getAttribute('data-q') || '0', 10);
        const r = parseInt(target.getAttribute('data-r') || '0', 10);
        const z = parseInt(target.getAttribute('data-z') || '0', 10);
        this.onFocusPore(new HexCoord3D(q, r, z));
        this.hide();
      });
    });
  }

  private getSpecimenUrl(name: string): string {
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
    if (lower.includes('cit+') || lower.includes('substrate c') || lower.includes('lenski')) {
      return 'paleontology/specimen_21_citratovibrio_lenskii.html';
    }
    if (lower.includes('siderophore') || lower.includes('chelat') || lower.includes('neiland')) {
      return 'paleontology/specimen_22_siderococcus_neilsonii.html';
    }
    if (lower.includes('biofilm') || lower.includes('eps') || lower.includes('glycocalyx') || lower.includes('costerton')) {
      return 'paleontology/specimen_23_biofilmocladus_costertonii.html';
    }
    if (lower.includes('syntroph') || lower.includes('diet') || lower.includes('cross-feed') || lower.includes('west')) {
      return 'paleontology/specimen_24_syntrophobacter_westii.html';
    }
    if (lower.includes('conductor') || lower.includes('electron') || lower.includes('lovley')) {
      return 'paleontology/specimen_25_electrosarcina_lovleyi.html';
    }
    if (lower.includes('kleptoplast') || lower.includes('vampir') || lower.includes('schnepf')) {
      return 'paleontology/specimen_26_vampirotheke_schnepfii.html';
    }
    return 'CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.html';
  }
}
