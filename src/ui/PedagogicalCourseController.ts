/**
 * 🏛️ Siliquarium UI Subsystem
 * PedagogicalCourseController: Interactive BIO/CS 101 Introductory Course Controller.
 * Directs students through lectures, POE checkpoints, and live in-simulation actions.
 */

import { COURSE_MODULES, ICourseModule } from './PedagogicalCourseRegistry.js';
import {
  buildCourseModalSkeleton,
  buildActiveModuleHtml,
  buildSyllabusListHtml
} from './PedagogicalCourseHtmlTemplate.js';

export interface IPedagogicalCourseCallbacks {
  readonly onFocusCaldera: () => void;
  readonly onSelectSampleCell: () => void;
  readonly onCinematicFocus: () => void;
  readonly onOpenMicroscope: () => void;
  readonly onOpenStats: () => void;
  readonly onOpenNaturalist: () => void;
  readonly onOpenBranches: () => void;
  readonly onSetWorkspaceMode: (mode: 'observatory' | 'safari' | 'laboratory' | 'studio' | 'chronicle') => void;
  readonly onCycleLenses: () => void;
  readonly onShowToast: (message: string) => void;
}

export class PedagogicalCourseController {
  private readonly callbacks: IPedagogicalCourseCallbacks;
  private containerEl: HTMLElement | null = null;
  private activeTrack: 'track-1' | 'track-2' = 'track-1';
  private activeModuleIndex: number = 0;
  private selectedAnswerIndex: number | null = null;
  private isAnswerSubmitted: boolean = false;
  private readonly completedModuleIds: Set<string> = new Set();
  private isOpen: boolean = false;

  constructor(callbacks: IPedagogicalCourseCallbacks) {
    this.callbacks = callbacks;
    this.loadProgress();
    this.ensureElements();
    this.bindEvents();
  }

  private loadProgress(): void {
    try {
      const stored = localStorage.getItem('siliquarium_course_completed');
      if (stored) {
        const parsed: string[] = JSON.parse(stored);
        parsed.forEach(id => this.completedModuleIds.add(id));
      }
    } catch {
      // Fallback silently in private browsing or headless mode
    }
  }

  private saveProgress(): void {
    try {
      const arr = Array.from(this.completedModuleIds);
      localStorage.setItem('siliquarium_course_completed', JSON.stringify(arr));
    } catch {
      // Ignore storage errors
    }
  }

  private ensureElements(): void {
    let container = document.getElementById('pedagogical-course-modal');
    if (!container) {
      container = document.createElement('div');
      container.id = 'pedagogical-course-modal';
      container.className = 'pedagogical-course-modal hidden';
      container.innerHTML = buildCourseModalSkeleton();
      document.body.appendChild(container);
    }
    this.containerEl = container;
  }

  private bindEvents(): void {
    if (!this.containerEl) return;

    this.containerEl.querySelector('#course-modal-backdrop')?.addEventListener('click', () => this.hide());
    this.containerEl.querySelector('#btn-close-course-modal')?.addEventListener('click', () => this.hide());

    this.containerEl.querySelector('#btn-course-track-1')?.addEventListener('click', () => this.setTrack('track-1'));
    this.containerEl.querySelector('#btn-course-track-2')?.addEventListener('click', () => this.setTrack('track-2'));

    this.containerEl.querySelector('#btn-course-prev')?.addEventListener('click', () => this.prevModule());
    this.containerEl.querySelector('#btn-course-next')?.addEventListener('click', () => this.nextModule());

    window.addEventListener('keydown', (e) => {
      if ((e.key === 't' || e.key === 'T') && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        if (tag !== 'input' && tag !== 'textarea' && tag !== 'select') {
          e.preventDefault();
          this.toggle();
        }
      } else if (e.key === 'Escape' && this.isOpen) {
        this.hide();
      }
    });
  }

  public toggle(): void {
    if (this.isOpen) this.hide();
    else this.show();
  }

  public show(): void {
    this.ensureElements();
    this.isOpen = true;
    this.containerEl?.classList.remove('hidden');
    this.render();
  }

  public hide(): void {
    this.isOpen = false;
    this.containerEl?.classList.add('hidden');
  }

  public setTrack(track: 'track-1' | 'track-2'): void {
    this.activeTrack = track;
    const firstModuleOfTrack = COURSE_MODULES.findIndex(m => m.track === track);
    if (firstModuleOfTrack !== -1) {
      this.activeModuleIndex = firstModuleOfTrack;
      this.selectedAnswerIndex = null;
      this.isAnswerSubmitted = false;
    }
    this.render();
  }

  public selectModuleById(id: string): void {
    const idx = COURSE_MODULES.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.activeModuleIndex = idx;
      this.activeTrack = COURSE_MODULES[idx].track;
      this.selectedAnswerIndex = null;
      this.isAnswerSubmitted = false;
      this.render();
    }
  }

  private prevModule(): void {
    if (this.activeModuleIndex > 0) {
      this.activeModuleIndex--;
      this.activeTrack = COURSE_MODULES[this.activeModuleIndex].track;
      this.selectedAnswerIndex = null;
      this.isAnswerSubmitted = false;
      this.render();
    }
  }

  private nextModule(): void {
    if (this.activeModuleIndex < COURSE_MODULES.length - 1) {
      this.activeModuleIndex++;
      this.activeTrack = COURSE_MODULES[this.activeModuleIndex].track;
      this.selectedAnswerIndex = null;
      this.isAnswerSubmitted = false;
      this.render();
    }
  }

  private render(): void {
    if (!this.containerEl) return;
    const currentModule = COURSE_MODULES[this.activeModuleIndex];

    // Sync track tabs
    const tab1 = this.containerEl.querySelector('#btn-course-track-1');
    const tab2 = this.containerEl.querySelector('#btn-course-track-2');
    tab1?.classList.toggle('active', this.activeTrack === 'track-1');
    tab2?.classList.toggle('active', this.activeTrack === 'track-2');

    // Render Syllabus Sidebar
    const sidebarEl = this.containerEl.querySelector('#course-syllabus-list');
    if (sidebarEl) {
      sidebarEl.innerHTML = buildSyllabusListHtml(
        COURSE_MODULES,
        currentModule.id,
        this.completedModuleIds,
        this.activeTrack
      );
      this.bindSidebarClicks(sidebarEl);
    }

    // Render Active Module
    const contentEl = this.containerEl.querySelector('#course-module-content');
    if (contentEl) {
      contentEl.innerHTML = buildActiveModuleHtml(currentModule, this.selectedAnswerIndex, this.isAnswerSubmitted);
      this.bindModuleActions(contentEl, currentModule);
    }

    // Update Progress Badge
    const progressEl = this.containerEl.querySelector('#course-progress-badge');
    if (progressEl) {
      progressEl.textContent = `Progress: ${this.completedModuleIds.size} / ${COURSE_MODULES.length} Modules Completed`;
    }
  }

  private bindSidebarClicks(sidebarEl: Element): void {
    sidebarEl.querySelectorAll('.course-syllabus-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-id');
        if (id) this.selectModuleById(id);
      });
    });
  }

  private bindModuleActions(contentEl: Element, currentModule: ICourseModule): void {
    contentEl.querySelectorAll('.course-poe-option').forEach(el => {
      el.addEventListener('click', () => {
        if (this.isAnswerSubmitted) return;
        const idx = Number(el.getAttribute('data-index'));
        if (!isNaN(idx)) {
          this.selectedAnswerIndex = idx;
          this.render();
        }
      });
    });

    contentEl.querySelector('#btn-submit-poe')?.addEventListener('click', () => {
      if (this.selectedAnswerIndex !== null && !this.isAnswerSubmitted) {
        this.isAnswerSubmitted = true;
        const opt = currentModule.poeCheckpoint.options[this.selectedAnswerIndex];
        if (opt?.isCorrect) {
          this.completedModuleIds.add(currentModule.id);
          this.saveProgress();
          this.callbacks.onShowToast(`🎉 Module Completed: ${currentModule.title}`);
        }
        this.render();
      }
    });

    contentEl.querySelectorAll('.course-action-trigger-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        const targetId = btn.getAttribute('data-target');
        if (action) this.handleSimulationAction(action);
        if (targetId) this.spotlightElement(targetId);
      });
    });
  }

  private handleSimulationAction(action: string): void {
    switch (action) {
      case 'focus-caldera':
        this.callbacks.onFocusCaldera();
        this.callbacks.onShowToast('🌋 Camera flying to Central Hydrothermal Caldera [0, 0, 0]');
        break;
      case 'select-first-cell':
        this.callbacks.onSelectSampleCell();
        this.callbacks.onShowToast('🎯 Locked onto sample active silicoid pore');
        break;
      case 'cinematic-focus':
        this.callbacks.onCinematicFocus();
        this.callbacks.onShowToast('🔍 Cinematic focus activated');
        break;
      case 'open-microscope':
      case 'open-testbench':
      case 'testbench-toggle-a':
      case 'inspect-genome-tape':
        this.callbacks.onOpenMicroscope();
        this.callbacks.onShowToast('🔬 Circuit Microscope opened');
        break;
      case 'open-stats':
        this.callbacks.onOpenStats();
        this.callbacks.onShowToast('📊 Ecosystem Statistics Panel opened');
        break;
      case 'open-naturalist':
        this.callbacks.onOpenNaturalist();
        this.callbacks.onShowToast('🧭 Naturalist Assistant opened');
        break;
      case 'switch-safari':
        this.callbacks.onSetWorkspaceMode('safari');
        this.callbacks.onShowToast('🔭 Guided Safari Mode active');
        break;
      case 'cycle-lenses':
        this.callbacks.onCycleLenses();
        this.callbacks.onShowToast('🔬 Biological Representation Lens toggled');
        break;
      case 'switch-chronicle':
        this.callbacks.onSetWorkspaceMode('chronicle');
        this.callbacks.onShowToast('⏳ Chronicle Mode active');
        break;
      case 'switch-studio':
        this.callbacks.onSetWorkspaceMode('studio');
        this.callbacks.onShowToast('🛠️ Siliquarium Design Studio active');
        break;
      case 'open-branches':
        this.callbacks.onOpenBranches();
        this.callbacks.onShowToast('🌿 Evolutionary Version Control opened');
        break;
      case 'switch-deeplab':
        this.callbacks.onShowToast('🏛️ The Deep Lab Academic Mode active');
        break;
    }
  }

  private spotlightElement(id: string): void {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('pedagogical-spotlight');
    setTimeout(() => el.classList.remove('pedagogical-spotlight'), 3000);
  }
}
