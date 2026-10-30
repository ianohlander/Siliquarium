/**
 * 🐠 Siliquarium UI Subsystem
 * VisualKeyModal: Interactive Visual Grammar Key & Biological HUD Decoder.
 * Decodes all visual language: cellular respiration, orbiting organelle satellites,
 * syncytial colony conduits, and trophic feeding rays, with inline live toggles.
 */

import { SeafloorRenderer3D } from '../visualizers/SeafloorRenderer3D.js';
import { InteractiveControls } from './InteractiveControls.js';
import { buildVisualKeyMarkup } from './VisualKeyModalHtmlTemplate.js';

export class VisualKeyModal {
  private static instance: VisualKeyModal | null = null;
  private readonly renderer: SeafloorRenderer3D;
  private readonly controls: InteractiveControls;
  private modalEl: HTMLElement | null = null;
  private backdropEl: HTMLElement | null = null;
  private isOpen: boolean = false;

  constructor(renderer: SeafloorRenderer3D, controls: InteractiveControls) {
    this.renderer = renderer;
    this.controls = controls;
    VisualKeyModal.instance = this;
    this.buildDOM();
    this.bindEvents();
  }

  public static getInstance(): VisualKeyModal | null {
    return VisualKeyModal.instance;
  }

  private buildDOM(): void {
    if (document.getElementById('modal-visual-key')) {
      this.modalEl = document.getElementById('modal-visual-key');
      this.backdropEl = document.getElementById('visual-key-backdrop');
      return;
    }

    const backdrop = document.createElement('div');
    backdrop.id = 'visual-key-backdrop';
    backdrop.className = 'visual-key-backdrop hidden';
    document.body.appendChild(backdrop);
    this.backdropEl = backdrop;

    const modal = document.createElement('div');
    modal.id = 'modal-visual-key';
    modal.className = 'visual-key-modal hidden';
    document.body.appendChild(modal);
    this.modalEl = modal;
  }

  private bindEvents(): void {
    this.backdropEl?.addEventListener('click', () => this.close());

    this.modalEl?.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      if (target.closest('#visual-key-close-btn')) {
        this.close();
        return;
      }

      // 1. Toggle Motion / Breathing
      if (target.closest('#vk-toggle-motion')) {
        this.renderer.calmMotionEnabled = !this.renderer.calmMotionEnabled;
        this.controls.syncCalmMotionUI();
        this.renderContent();
        return;
      }

      // 2. Toggle Auras / Satellites
      if (target.closest('#vk-toggle-auras')) {
        this.renderer.filterShowAuras = !this.renderer.filterShowAuras;
        this.controls.syncFilterUI();
        this.renderContent();
        return;
      }

      // 3. Toggle Syncytial Conduits
      if (target.closest('#vk-toggle-conduits')) {
        if (this.renderer.filterSyncytium === 'all') {
          this.renderer.filterSyncytium = 'selected';
        } else if (this.renderer.filterSyncytium === 'selected') {
          this.renderer.filterSyncytium = 'off';
        } else {
          this.renderer.filterSyncytium = 'all';
        }
        this.controls.syncFilterUI();
        this.renderContent();
        return;
      }

      // 4. Toggle Trophic Rays
      if (target.closest('#vk-toggle-trophic')) {
        this.renderer.filterShowTrophicRays = !this.renderer.filterShowTrophicRays;
        this.controls.syncFilterUI();
        this.renderContent();
        return;
      }

      // Environmental Layers
      if (target.closest('#vk-toggle-spores')) {
        this.renderer.showSpores = !this.renderer.showSpores;
        this.controls.syncLayerUI();
        this.renderContent();
        return;
      }

      if (target.closest('#vk-toggle-water')) {
        this.renderer.showWaterColumn = !this.renderer.showWaterColumn;
        this.controls.syncLayerUI();
        this.renderContent();
        return;
      }

      if (target.closest('#vk-toggle-bedrock')) {
        this.renderer.showBenthic = !this.renderer.showBenthic;
        this.controls.syncLayerUI();
        this.renderContent();
        return;
      }
    });

    window.addEventListener('keydown', (e) => {
      if ((e.key === 'k' || e.key === 'K' || e.key === '?') && !this.isTyping()) {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  private isTyping(): boolean {
    const tag = (document.activeElement?.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'textarea';
  }

  public toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  public open(): void {
    if (!this.modalEl || !this.backdropEl) return;
    this.renderContent();
    this.modalEl.classList.remove('hidden');
    this.backdropEl.classList.remove('hidden');
    this.isOpen = true;
  }

  public close(): void {
    if (!this.modalEl || !this.backdropEl) return;
    this.modalEl.classList.add('hidden');
    this.backdropEl.classList.add('hidden');
    this.isOpen = false;
  }

  private renderContent(): void {
    if (!this.modalEl) return;

    this.modalEl.innerHTML = buildVisualKeyMarkup({
      isCalm: this.renderer.calmMotionEnabled,
      aurasOn: this.renderer.filterShowAuras,
      conduitsMode: this.renderer.filterSyncytium,
      trophicOn: this.renderer.filterShowTrophicRays,
      sporesOn: this.renderer.showSpores,
      waterOn: this.renderer.showWaterColumn,
      bedrockOn: this.renderer.showBenthic
    });
  }
}
