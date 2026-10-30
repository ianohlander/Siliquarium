/**
 * 🐠 Siliquarium UI Subsystem
 * GlossaryModal: Non-stacked, in-app academic glossary pop-up inspector.
 * Provides instant biophysical definitions, digital mappings, and return-to-simulation workflow.
 */

import { IGlossaryEntry, GLOSSARY_DATABASE } from './GlossaryTermRegistry.js';
export type { IGlossaryEntry };
export { GLOSSARY_DATABASE };

export class GlossaryModal {
  private static instance: GlossaryModal | null = null;
  private readonly container: HTMLElement;
  private currentTermKey: string | null = null;

  private constructor() {
    this.container = document.createElement('div');
    this.container.id = 'glossary-modal-root';
    this.container.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm hidden';
    this.container.innerHTML = `
      <div id="glossary-dialog" class="relative w-full max-w-lg bg-slate-900 border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden font-sans text-slate-200 transform transition-all scale-95 opacity-0">
        <!-- Header with Glowing Accent -->
        <div class="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="text-xl">📖</span>
            <div>
              <span id="glossary-category" class="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">Biophysics</span>
              <h3 id="glossary-title" class="text-base font-bold text-slate-100 font-mono mt-0.5">Term Definition</h3>
            </div>
          </div>
          <button id="glossary-btn-close-x" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors text-lg" title="Close (Esc)">✕</button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-4 text-xs font-sans leading-relaxed">
          <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-200 font-medium leading-relaxed" id="glossary-definition">
            Definition text...
          </div>

          <div class="space-y-1.5">
            <div class="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
              <span>🔬</span> Biophysical Reality in Nature:
            </div>
            <p id="glossary-bio" class="text-slate-300 pl-4 border-l-2 border-emerald-500/40 font-sans">
              Bio context...
            </p>
          </div>

          <div class="space-y-1.5">
            <div class="text-[11px] font-mono font-bold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wide">
              <span>💻</span> Digital Mapping in Siliquarium:
            </div>
            <p id="glossary-mapping" class="text-slate-300 pl-4 border-l-2 border-cyan-500/40 font-sans">
              Simulation mapping...
            </p>
          </div>
        </div>

        <!-- Actions Strip -->
        <div class="px-6 py-3.5 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <a id="glossary-full-link" href="#" target="_blank" class="text-cyan-400 hover:text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors">
            <span>📖</span> Open Full Academic Companion ↗
          </a>
          <button id="glossary-btn-return" class="px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold rounded-lg text-xs shadow-md transition-all flex items-center gap-1.5">
            <span>←</span> Return to Simulation
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.container);
    this.bindEvents();
  }

  public static getInstance(): GlossaryModal {
    if (!GlossaryModal.instance) {
      GlossaryModal.instance = new GlossaryModal();
    }
    return GlossaryModal.instance;
  }

  private bindEvents(): void {
    const dialog = this.container.querySelector('#glossary-dialog') as HTMLElement;
    const closeX = this.container.querySelector('#glossary-btn-close-x');
    const returnBtn = this.container.querySelector('#glossary-btn-return');

    const closeHandler = () => this.close();
    closeX?.addEventListener('click', closeHandler);
    returnBtn?.addEventListener('click', closeHandler);

    this.container.addEventListener('click', (e) => {
      if (!dialog.contains(e.target as Node)) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.container.classList.contains('hidden')) {
        this.close();
      }
    });
  }

  public open(termKey: string): void {
    const entry = GLOSSARY_DATABASE[termKey.toLowerCase()] ?? GLOSSARY_DATABASE.landauer;
    this.currentTermKey = termKey;

    const catEl = this.container.querySelector('#glossary-category') as HTMLElement;
    const titleEl = this.container.querySelector('#glossary-title') as HTMLElement;
    const defEl = this.container.querySelector('#glossary-definition') as HTMLElement;
    const bioEl = this.container.querySelector('#glossary-bio') as HTMLElement;
    const mapEl = this.container.querySelector('#glossary-mapping') as HTMLElement;
    const linkEl = this.container.querySelector('#glossary-full-link') as HTMLAnchorElement;

    if (catEl) catEl.textContent = entry.category;
    if (titleEl) titleEl.textContent = entry.term;
    if (defEl) defEl.textContent = entry.definition;
    if (bioEl) bioEl.textContent = entry.biologicalReality;
    if (mapEl) mapEl.textContent = entry.siliquariumMapping;
    if (linkEl) linkEl.href = `docs/companion/glossary.html#${entry.anchor}`;

    this.container.classList.remove('hidden');
    const dialog = this.container.querySelector('#glossary-dialog') as HTMLElement;
    requestAnimationFrame(() => {
      dialog.classList.remove('scale-95', 'opacity-0');
      dialog.classList.add('scale-100', 'opacity-100');
    });
  }

  public close(): void {
    const dialog = this.container.querySelector('#glossary-dialog') as HTMLElement;
    dialog.classList.remove('scale-100', 'opacity-100');
    dialog.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      this.container.classList.add('hidden');
    }, 150);
  }

  public getCurrentTermKey(): string | null {
    return this.currentTermKey;
  }

  public static attachListeners(root: HTMLElement = document.body): void {
    const triggers = root.querySelectorAll('[data-glossary]');
    triggers.forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const key = el.getAttribute('data-glossary');
        if (key) GlossaryModal.getInstance().open(key);
      });
    });
  }
}
