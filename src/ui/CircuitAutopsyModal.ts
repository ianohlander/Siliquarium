/**
 * 🐠 Siliquarium UI Subsystem
 * CircuitAutopsyModal: Fullscreen CAD Autopsy & Epistemic Workbench.
 * Implements the Fullscreen CAD Autopsy Interface:
 * - Interactive Signal Testbench: synthetic toggles for Stream A, Stream B, Toxin T.
 * - Live Multi-Channel Logic Oscilloscope: real-time waveform trace with Landauer transient spikes.
 * - Dynamic Boolean Truth Table: evaluates combinatorial logic with active testbench state highlighting.
 * - High-DPI Electronic Circuit Schematic Canvas: pan/zoom CAD workbench with battery telemetry.
 * - Scientific Paleontology Sidebar: Uri Alon motifs, Landauer thermodynamic cost, citations, and dossier links.
 */

import { SimulationWorld } from '../engine/SimulationWorld.js';
import { IPoreTelemetry, IVentTelemetry } from '../engine/SimulationTelemetry.js';
import { HexCoord3D } from '../core/spatial/HexCoord3D.js';
import { CircuitMicroscopeView } from '../visualizers/CircuitMicroscopeView.js';
import { CircuitTopology } from '../visualizers/CircuitTopology.js';
import { TaxonomyNomenclature, ISpeciesTaxon } from '../core/paleontology/TaxonomyNomenclature.js';
import { PoreWorkshop } from '../core/domain/PoreWorkshop.js';
import { MotifScanner } from '../core/paleontology/MotifScanner.js';
import { MotifType } from '../core/paleontology/NetworkMotif.js';
import { EpistemicDossierRegistry } from './NaturalistAssistant.js';

export class CircuitAutopsyModal {
  private readonly world: SimulationWorld;
  private readonly containerEl: HTMLElement | null;

  // Header Elements
  private readonly titleEl: HTMLElement | null;
  private readonly closeBtn: HTMLElement | null;
  private readonly topDossierBtn: HTMLAnchorElement | null;

  // Testbench Elements
  private readonly toggleStreamABtn: HTMLElement | null;
  private readonly toggleStreamBBtn: HTMLElement | null;
  private readonly toggleToxinTBtn: HTMLElement | null;

  // Oscilloscope Elements
  private readonly oscCanvas: HTMLCanvasElement | null;
  private readonly oscCtx: CanvasRenderingContext2D | null = null;
  private readonly oscStatusEl: HTMLElement | null;

  // Truth Table Elements
  private readonly truthTableEl: HTMLElement | null;

  // Schematic Canvas Elements
  private readonly schematicContainer: HTMLElement | null;
  private readonly schematicCanvas: HTMLCanvasElement | null;
  private readonly schematicGatesBadge: HTMLElement | null;
  private readonly zoomTextEl: HTMLElement | null;
  private readonly zoomInBtn: HTMLElement | null;
  private readonly zoomOutBtn: HTMLElement | null;
  private readonly fontToggleBtn: HTMLElement | null;
  private readonly resetLayoutBtn: HTMLElement | null;
  private readonly voltageFillEl: HTMLElement | null;
  private readonly voltageTextEl: HTMLElement | null;
  private readonly organelleBadge: HTMLElement | null;
  private readonly syncytiumBadge: HTMLElement | null;

  // Sidebar Elements
  private readonly motifTitleEl: HTMLElement | null;
  private readonly motifCognateEl: HTMLElement | null;
  private readonly motifDescEl: HTMLElement | null;
  private readonly landauerValEl: HTMLElement | null;
  private readonly yieldValEl: HTMLElement | null;
  private readonly heatValEl: HTMLElement | null;
  private readonly citationTextEl: HTMLElement | null;
  private readonly sideDossierLink: HTMLAnchorElement | null;
  private readonly topAnalysisBtn: HTMLAnchorElement | null;
  private readonly sideCircuitGuideLink: HTMLAnchorElement | null;
  private readonly sideMotifSpecimenLink: HTMLAnchorElement | null;

  // Internal State
  private currentPoreCoord: HexCoord3D | null = null;
  private currentPore: IPoreTelemetry | null = null;
  private currentVent: IVentTelemetry | null = null;
  private schematicView: CircuitMicroscopeView | null = null;

  private streamA: boolean = true;
  private streamB: boolean = true;
  private toxinT: boolean = false;

  private fontScale: number = 1.0;
  private animFrameId: number | null = null;
  private oscPhase: number = 0;

  constructor(world: SimulationWorld) {
    this.world = world;
    const hasDoc = typeof document !== 'undefined';

    this.containerEl = hasDoc ? document.getElementById('circuit-autopsy-modal') : null;

    this.titleEl = hasDoc ? document.getElementById('autopsy-specimen-title') : null;
    this.closeBtn = hasDoc ? document.getElementById('autopsy-close-btn') : null;
    this.topDossierBtn = hasDoc ? (document.getElementById('autopsy-btn-dossier') as HTMLAnchorElement | null) : null;
    this.topAnalysisBtn = hasDoc ? (document.getElementById('autopsy-btn-analysis') as HTMLAnchorElement | null) : null;

    this.toggleStreamABtn = hasDoc ? document.getElementById('autopsy-toggle-stream-a') : null;
    this.toggleStreamBBtn = hasDoc ? document.getElementById('autopsy-toggle-stream-b') : null;
    this.toggleToxinTBtn = hasDoc ? document.getElementById('autopsy-toggle-toxin-t') : null;

    this.oscCanvas = hasDoc ? (document.getElementById('canvas-autopsy-oscilloscope') as HTMLCanvasElement | null) : null;
    if (this.oscCanvas) {
      this.oscCtx = this.oscCanvas.getContext('2d');
    }
    this.oscStatusEl = hasDoc ? document.getElementById('autopsy-osc-status') : null;

    this.truthTableEl = hasDoc ? document.getElementById('autopsy-truth-table') : null;

    this.schematicContainer = hasDoc ? document.getElementById('autopsy-canvas-container') : null;
    this.schematicCanvas = hasDoc ? (document.getElementById('canvas-autopsy-schematic') as HTMLCanvasElement | null) : null;
    if (this.schematicCanvas) {
      this.schematicView = new CircuitMicroscopeView(this.schematicCanvas);
    }
    this.schematicGatesBadge = hasDoc ? document.getElementById('autopsy-schematic-gates-badge') : null;
    this.zoomTextEl = hasDoc ? document.getElementById('autopsy-zoom-text') : null;
    this.zoomInBtn = hasDoc ? document.getElementById('autopsy-zoom-in') : null;
    this.zoomOutBtn = hasDoc ? document.getElementById('autopsy-zoom-out') : null;
    this.fontToggleBtn = hasDoc ? document.getElementById('autopsy-font-toggle') : null;
    this.resetLayoutBtn = hasDoc ? document.getElementById('autopsy-reset-layout') : null;
    this.voltageFillEl = hasDoc ? document.getElementById('autopsy-voltage-fill') : null;
    this.voltageTextEl = hasDoc ? document.getElementById('autopsy-voltage-text') : null;
    this.organelleBadge = hasDoc ? document.getElementById('autopsy-organelle-badge') : null;
    this.syncytiumBadge = hasDoc ? document.getElementById('autopsy-syncytium-badge') : null;

    this.motifTitleEl = hasDoc ? document.getElementById('autopsy-motif-title') : null;
    this.motifCognateEl = hasDoc ? document.getElementById('autopsy-motif-cognate') : null;
    this.motifDescEl = hasDoc ? document.getElementById('autopsy-motif-desc') : null;
    this.landauerValEl = hasDoc ? document.getElementById('autopsy-landauer-val') : null;
    this.yieldValEl = hasDoc ? document.getElementById('autopsy-yield-val') : null;
    this.heatValEl = hasDoc ? document.getElementById('autopsy-heat-val') : null;
    this.citationTextEl = hasDoc ? document.getElementById('autopsy-citation-text') : null;
    this.sideDossierLink = hasDoc ? (document.getElementById('autopsy-link-dossier') as HTMLAnchorElement | null) : null;
    this.sideCircuitGuideLink = hasDoc ? (document.getElementById('autopsy-link-circuit-guide') as HTMLAnchorElement | null) : null;
    this.sideMotifSpecimenLink = hasDoc ? (document.getElementById('autopsy-link-motif-specimen') as HTMLAnchorElement | null) : null;

    if (hasDoc) {
      this.bindEvents();
    }
  }

  public isOpen(): boolean {
    return this.containerEl !== null && !this.containerEl.classList.contains('hidden');
  }

  public show(coord?: HexCoord3D): void {
    if (!this.containerEl) return;

    if (coord) {
      this.currentPoreCoord = coord;
    }

    const tele = this.world.exportTelemetry();
    this.currentVent = tele.vent;

    if (this.currentPoreCoord) {
      this.currentPore = tele.pores.find(p => p.coord.equals(this.currentPoreCoord!)) ?? null;
    } else {
      // Find first living pore or default to origin
      const living = tele.pores.find(p => p.tapeBitstring && p.tapeBitstring.length > 0);
      if (living) {
        this.currentPore = living;
        this.currentPoreCoord = living.coord;
      } else {
        this.currentPore = tele.pores[0] ?? null;
        this.currentPoreCoord = this.currentPore?.coord ?? new HexCoord3D(0, 0, 0);
      }
    }

    // Default testbench state to vent conditions if available
    if (this.currentVent) {
      this.streamA = this.currentVent.streamA;
      this.streamB = this.currentVent.streamB;
      this.toxinT = this.currentVent.toxinT;
    }

    this.containerEl.classList.remove('hidden');
    this.syncTestbenchUI();
    this.updateAll();
    this.startAnimationLoop();
  }

  public hide(): void {
    if (!this.containerEl) return;
    this.containerEl.classList.add('hidden');
    this.stopAnimationLoop();
  }

  public toggle(coord?: HexCoord3D): void {
    if (this.isOpen()) {
      this.hide();
    } else {
      this.show(coord);
    }
  }

  public syncPore(coord: HexCoord3D, tele: { vent: IVentTelemetry; pores: readonly IPoreTelemetry[] }): void {
    this.currentPoreCoord = coord;
    this.currentVent = tele.vent;
    this.currentPore = tele.pores.find(p => p.coord.equals(coord)) ?? null;
    if (this.isOpen()) {
      this.updateAll();
    }
  }

  private bindEvents(): void {
    this.closeBtn?.addEventListener('click', () => this.hide());

    // Testbench toggles
    this.toggleStreamABtn?.addEventListener('click', () => {
      this.streamA = !this.streamA;
      this.syncTestbenchUI();
      this.updateAll();
    });

    this.toggleStreamBBtn?.addEventListener('click', () => {
      this.streamB = !this.streamB;
      this.syncTestbenchUI();
      this.updateAll();
    });

    this.toggleToxinTBtn?.addEventListener('click', () => {
      this.toxinT = !this.toxinT;
      this.syncTestbenchUI();
      this.updateAll();
    });

    // Zoom & Layout Controls
    this.zoomInBtn?.addEventListener('click', () => {
      if (this.schematicView) {
        this.schematicView.setZoomLevel(this.schematicView.getZoomLevel() + 0.2);
        this.updateZoomUI();
        this.renderSchematic();
      }
    });

    this.zoomOutBtn?.addEventListener('click', () => {
      if (this.schematicView) {
        this.schematicView.setZoomLevel(this.schematicView.getZoomLevel() - 0.2);
        this.updateZoomUI();
        this.renderSchematic();
      }
    });

    this.resetLayoutBtn?.addEventListener('click', () => {
      if (this.schematicView) {
        this.schematicView.setZoomLevel(1.0);
        this.fontScale = 1.0;
        this.schematicView.setFontScale(1.0);
        this.updateZoomUI();
        this.renderSchematic();
      }
    });

    this.fontToggleBtn?.addEventListener('click', () => {
      if (this.schematicView) {
        this.fontScale = this.fontScale >= 1.4 ? 1.0 : this.fontScale + 0.2;
        this.schematicView.setFontScale(this.fontScale);
        this.renderSchematic();
      }
    });

    // Wheel zoom on schematic container
    this.schematicContainer?.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (!this.schematicView) return;
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      this.schematicView.setZoomLevel(this.schematicView.getZoomLevel() + delta);
      this.updateZoomUI();
      this.renderSchematic();
    }, { passive: false });

    // Drag-to-pan in container
    let isPanning = false;
    let startX = 0;
    let startY = 0;
    let scrollLeft = 0;
    let scrollTop = 0;

    this.schematicContainer?.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isPanning = true;
      startX = e.pageX - (this.schematicContainer?.offsetLeft ?? 0);
      startY = e.pageY - (this.schematicContainer?.offsetTop ?? 0);
      scrollLeft = this.schematicContainer?.scrollLeft ?? 0;
      scrollTop = this.schematicContainer?.scrollTop ?? 0;
      if (this.schematicContainer) this.schematicContainer.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isPanning || !this.schematicContainer) return;
      e.preventDefault();
      const x = e.pageX - this.schematicContainer.offsetLeft;
      const y = e.pageY - this.schematicContainer.offsetTop;
      const walkX = (x - startX) * 1.5;
      const walkY = (y - startY) * 1.5;
      this.schematicContainer.scrollLeft = scrollLeft - walkX;
      this.schematicContainer.scrollTop = scrollTop - walkY;
    });

    window.addEventListener('mouseup', () => {
      isPanning = false;
      if (this.schematicContainer) this.schematicContainer.style.cursor = 'default';
    });

    // Global Keybindings: Esc to close, X to toggle
    window.addEventListener('keydown', (e) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.key === 'Escape' && this.isOpen()) {
        this.hide();
      } else if ((e.key === 'x' || e.key === 'X') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        this.toggle();
      }
    });
  }

  private syncTestbenchUI(): void {
    if (this.toggleStreamABtn) {
      this.toggleStreamABtn.className = `testbench-btn ${this.streamA ? 'active' : ''}`;
      this.toggleStreamABtn.textContent = this.streamA ? 'ACTIVE' : 'INACTIVE';
    }
    if (this.toggleStreamBBtn) {
      this.toggleStreamBBtn.className = `testbench-btn ${this.streamB ? 'active' : ''}`;
      this.toggleStreamBBtn.textContent = this.streamB ? 'ACTIVE' : 'INACTIVE';
    }
    if (this.toggleToxinTBtn) {
      this.toggleToxinTBtn.className = `testbench-btn ${this.toxinT ? 'active' : ''}`;
      this.toggleToxinTBtn.textContent = this.toxinT ? 'ACTIVE' : 'INACTIVE';
    }
  }

  private updateZoomUI(): void {
    if (this.zoomTextEl && this.schematicView) {
      this.zoomTextEl.textContent = `${this.schematicView.getZoomLevel().toFixed(1)}×`;
    }
  }

  private updateAll(): void {
    if (!this.currentPore || !this.currentVent) return;

    const tape = this.currentPore.tapeBitstring || '';
    const evalResult = this.evaluateCircuitState(tape, this.streamA, this.streamB, this.toxinT);

    // 1. Specimen Header Meta
    const taxon = this.currentPore.speciesTaxon ?? TaxonomyNomenclature.classify({
      tapeBitstring: this.currentPore.tapeBitstring,
      gateTypes: this.currentPore.gateTypes,
      generation: this.currentPore.generation,
      isBasalt: this.currentPore.isBasalt,
      hasOrganelle: this.currentPore.hasOrganelle,
      isSyncytium: this.currentPore.isSyncytium ?? false,
      isDifferentiated: this.currentPore.isDifferentiated ?? false
    });

    if (this.titleEl) {
      const coordStr = `q:${this.currentPore.coord.q}, r:${this.currentPore.coord.r}, z:${this.currentPore.coord.z}`;
      this.titleEl.textContent = `Specimen: ${taxon.binomialName} (${taxon.commonName}) • Pore [${coordStr}]`;
    }

    // 2. Dossier Links
    const dossierUrl = this.resolveDossierUrl(taxon, this.currentPore);
    if (this.topDossierBtn) this.topDossierBtn.href = dossierUrl;
    if (this.sideDossierLink) this.sideDossierLink.href = dossierUrl;
    if (this.sideMotifSpecimenLink) this.sideMotifSpecimenLink.href = dossierUrl;

    // 3. Truth Table
    this.renderTruthTable(tape);

    // 4. Sidebar Content
    const syntheticVent: IVentTelemetry = {
      ...this.currentVent,
      streamA: this.streamA,
      streamB: this.streamB,
      toxinT: this.toxinT
    };
    const analysis = CircuitTopology.analyze(tape, syntheticVent, evalResult.primaryActive);

    const circuitGuideUrl = this.resolveCircuitGuideUrl(analysis.motifName, taxon, this.currentPore);
    if (this.topAnalysisBtn) this.topAnalysisBtn.href = circuitGuideUrl;
    if (this.sideCircuitGuideLink) this.sideCircuitGuideLink.href = circuitGuideUrl;

    if (this.motifTitleEl) this.motifTitleEl.textContent = analysis.motifName;
    if (this.motifCognateEl) this.motifCognateEl.textContent = analysis.motifCognate;
    if (this.motifDescEl) this.motifDescEl.textContent = analysis.motifDesc;

    if (this.landauerValEl) {
      const landauerT = Math.max(12, analysis.gateCount * 12);
      this.landauerValEl.textContent = `${landauerT} T (kT ln 2)`;
    }
    if (this.yieldValEl) {
      this.yieldValEl.textContent = `${evalResult.yieldMultiplier.toFixed(1)}× Influx`;
    }
    if (this.heatValEl) {
      this.heatValEl.textContent = evalResult.primaryActive ? 'Optimal (Low Entropy)' : 'Quiescent (Sub-Threshold)';
    }
    if (this.citationTextEl) {
      this.citationTextEl.textContent = taxon.citation || 'Alon, U. (2007). Nature Reviews Genetics 8, 450-461.';
    }

    // 5. Schematic Badges & Battery
    if (this.schematicGatesBadge) {
      this.schematicGatesBadge.textContent = `${analysis.gateCount} Logic Gate${analysis.gateCount === 1 ? '' : 's'}`;
    }
    if (this.voltageFillEl) {
      const pct = Math.min(100, Math.round((this.currentPore.energy / 120) * 100));
      this.voltageFillEl.style.width = `${pct}%`;
    }
    if (this.voltageTextEl) {
      this.voltageTextEl.textContent = `${this.currentPore.energy} mV`;
    }
    if (this.organelleBadge) {
      this.organelleBadge.style.display = this.currentPore.hasOrganelle ? 'inline-block' : 'none';
    }
    if (this.syncytiumBadge) {
      this.syncytiumBadge.style.display = (this.currentPore.isSyncytium || this.currentPore.isDifferentiated) ? 'inline-block' : 'none';
    }

    this.renderSchematic();
  }

  public resolveCircuitGuideUrl(motifName: string, taxon: ISpeciesTaxon, pore: IPoreTelemetry): string {
    const motifLower = (motifName || '').toLowerCase();
    const taxonLower = (taxon?.binomialName || '').toLowerCase();

    if (motifLower.includes('incoherent') || motifLower.includes('pulse')) {
      return 'docs/curriculum/unit3_systems_biology_motifs.html#incoherent-feedforward-loops';
    }
    if (motifLower.includes('coherent') || motifLower.includes('delay') || motifLower.includes('filter')) {
      return 'docs/curriculum/unit3_systems_biology_motifs.html#coherent-feedforward-loops';
    }
    if (motifLower.includes('latch') || motifLower.includes('bistable') || motifLower.includes('memory')) {
      return 'docs/curriculum/unit3_systems_biology_motifs.html#bistable-memory-latches';
    }
    if (motifLower.includes('oscillator') || motifLower.includes('clock') || motifLower.includes('repressilator')) {
      return 'docs/curriculum/unit3_systems_biology_motifs.html#ring-oscillators';
    }
    if (motifLower.includes('adder') || motifLower.includes('parity') || motifLower.includes('arithmetic')) {
      return 'docs/curriculum/unit3_systems_biology_motifs.html#binary-half-adders';
    }
    if (motifLower.includes('inverter') || motifLower.includes('not') || motifLower.includes('allosteric')) {
      return 'docs/curriculum/unit3_systems_biology_motifs.html#allosteric-inverters';
    }
    if (motifLower.includes('autoreg') || motifLower.includes('clamp')) {
      return 'docs/curriculum/unit3_systems_biology_motifs.html#negative-autoregulation';
    }
    if (pore.hasOrganelle || motifLower.includes('organelle') || taxonLower.includes('organelle') || taxonLower.includes('margulis')) {
      return 'docs/paleontology/specimen_08_endosymbiotic_cassette.html';
    }
    if (pore.hasSpore || motifLower.includes('spore') || taxonLower.includes('spore')) {
      return 'docs/paleontology/specimen_10_pelagic_sporulation.html';
    }
    if (pore.isDifferentiated || pore.isSyncytium || taxonLower.includes('syncyt') || motifLower.includes('syncyt')) {
      return 'docs/paleontology/specimen_09_syncytial_multicellularity.html';
    }
    return 'docs/curriculum/unit3_systems_biology_motifs.html';
  }

  private resolveDossierUrl(taxon: ISpeciesTaxon, pore: IPoreTelemetry): string {
    if (pore.isDifferentiated || pore.isSyncytium) {
      return EpistemicDossierRegistry.getDossierUrl('SYNCYTIAL_MULTICELLULARITY');
    }
    if (pore.hasOrganelle) {
      return EpistemicDossierRegistry.getDossierUrl('ENDOSYMBIONT_EMERGENCE');
    }
    if (pore.hasSpore) {
      return EpistemicDossierRegistry.getDossierUrl('PELAGIC_SPORULATION_EMERGENCE');
    }
    if (taxon.binomialName.includes('alonii')) {
      return EpistemicDossierRegistry.getDossierUrl('COHERENT_FFL');
    }
    if (taxon.binomialName.includes('elowitzii')) {
      return EpistemicDossierRegistry.getDossierUrl('RING_OSCILLATOR');
    }
    if (taxon.binomialName.includes('collinsii')) {
      return EpistemicDossierRegistry.getDossierUrl('BISTABLE_LATCH');
    }
    if (taxon.binomialName.includes('turingii')) {
      return EpistemicDossierRegistry.getDossierUrl('HALF_ADDER');
    }
    if (taxon.binomialName.includes('landaueri')) {
      return EpistemicDossierRegistry.getDossierUrl('INVERTER_NOT');
    }
    if (taxon.binomialName.includes('lanei')) {
      return EpistemicDossierRegistry.getDossierUrl('BASALT_LITHOTROPH');
    }
    if (taxon.binomialName.includes('lenskii')) {
      return EpistemicDossierRegistry.getDossierUrl('OLDEST_LINEAGE');
    }
    return EpistemicDossierRegistry.getDossierUrl('VENT_FEEDER');
  }

  public evaluateCircuitState(
    tape: string,
    inAOrInputs: boolean | { inA?: boolean; inB?: boolean; inT?: boolean; primeSequentialHold?: boolean },
    inB: boolean = false,
    inT: boolean = false
  ): { primaryActive: boolean; gateOutputs: boolean[]; yieldMultiplier: number } {
    if (!tape || tape.length === 0) {
      return { primaryActive: false, gateOutputs: [], yieldMultiplier: 0.0 };
    }

    let a = false;
    let b = false;
    let t = false;
    let primeSequentialHold = true;

    if (typeof inAOrInputs === 'object' && inAOrInputs !== null) {
      a = !!inAOrInputs.inA;
      b = !!inAOrInputs.inB;
      t = !!inAOrInputs.inT;
      if (inAOrInputs.primeSequentialHold !== undefined) {
        primeSequentialHold = inAOrInputs.primeSequentialHold;
      }
    } else {
      a = !!inAOrInputs;
      b = !!inB;
      t = !!inT;
    }

    const ws = PoreWorkshop.fromBitstring(tape);
    if (primeSequentialHold && !a && !b && !t) {
      const motifs = MotifScanner.scanWorkshop(ws);
      if (motifs.some(m => m.motif.type === MotifType.BISTABLE_LATCH)) {
        ws.stepTick(true, true, false);
      }
    }
    const stepRes = ws.stepTick(a, b, t);
    const builtGates = ws.getBuiltGates();
    const gateOutputs = builtGates.map(g => g.output);
    const primaryActive = stepRes.primaryActive;
    const yieldMultiplier = stepRes.catalyticYield;

    return { primaryActive, gateOutputs, yieldMultiplier };
  }

  private renderTruthTable(tape: string): void {
    if (!this.truthTableEl) return;

    const combinations = [
      { a: false, b: false, t: false },
      { a: false, b: true, t: false },
      { a: true, b: false, t: false },
      { a: true, b: true, t: false },
      { a: true, b: true, t: true }
    ];

    let html = `<table>
      <thead>
        <tr>
          <th>Stream A</th>
          <th>Stream B</th>
          <th>Toxin T</th>
          <th>Logic Out</th>
          <th>Yield</th>
        </tr>
      </thead>
      <tbody>`;

    for (const c of combinations) {
      const res = this.evaluateCircuitState(tape, c.a, c.b, c.t);
      const isCurrentActive = (c.a === this.streamA && c.b === this.streamB && c.t === this.toxinT);
      const rowClass = isCurrentActive ? 'class="active-row"' : '';
      const outColor = res.primaryActive ? '#10b981' : '#64748b';
      const outIcon = res.primaryActive ? '1 (HIGH)' : '0 (LOW)';

      html += `<tr ${rowClass}>
        <td>${c.a ? '<span style="color:#f59e0b;">1</span>' : '0'}</td>
        <td>${c.b ? '<span style="color:#06b6d4;">1</span>' : '0'}</td>
        <td>${c.t ? '<span style="color:#f43f5e;">1</span>' : '0'}</td>
        <td style="color:${outColor};font-weight:bold;">${outIcon}</td>
        <td style="color:#fbbf24;">${res.yieldMultiplier.toFixed(1)}×</td>
      </tr>`;
    }

    html += `</tbody></table>`;
    this.truthTableEl.innerHTML = html;
  }

  private renderSchematic(): void {
    if (!this.schematicView || !this.currentPore || !this.currentVent) return;

    const evalResult = this.evaluateCircuitState(
      this.currentPore.tapeBitstring || '',
      this.streamA,
      this.streamB,
      this.toxinT
    );

    const syntheticPore: IPoreTelemetry = {
      ...this.currentPore,
      primaryActive: evalResult.primaryActive
    };

    const syntheticVent: IVentTelemetry = {
      ...this.currentVent,
      streamA: this.streamA,
      streamB: this.streamB,
      toxinT: this.toxinT
    };

    this.schematicView.render(syntheticPore, syntheticVent);
  }

  private startAnimationLoop(): void {
    if (this.animFrameId !== null) return;

    const loop = () => {
      this.drawOscilloscope();
      this.renderSchematic();
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  private stopAnimationLoop(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private drawOscilloscope(): void {
    if (!this.oscCanvas || !this.oscCtx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = this.oscCanvas.getBoundingClientRect();
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);

    if (w <= 0 || h <= 0) return;

    if (this.oscCanvas.width !== w || this.oscCanvas.height !== h) {
      this.oscCanvas.width = w;
      this.oscCanvas.height = h;
    }

    const ctx = this.oscCtx;
    ctx.save();
    ctx.scale(dpr, dpr);
    const drawW = rect.width;
    const drawH = rect.height;

    // CRT Screen Deep Navy/Black Background
    ctx.fillStyle = '#020612';
    ctx.fillRect(0, 0, drawW, drawH);

    // Left channel header sidebar
    const headerW = 84;
    ctx.fillStyle = 'rgba(10, 16, 30, 0.88)';
    ctx.fillRect(0, 0, headerW, drawH);
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.85)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(headerW, 0);
    ctx.lineTo(headerW, drawH);
    ctx.stroke();

    // Subtle CRT Graticule Grid in trace area
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.35)';
    ctx.lineWidth = 1;
    const numDivsX = 6;
    const dx = (drawW - headerW) / numDivsX;

    for (let i = 1; i <= numDivsX; i++) {
      const gx = headerW + i * dx;
      ctx.beginPath();
      ctx.setLineDash([2, 4]);
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, drawH);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    this.oscPhase += 0.055;

    // Evaluate logic state
    const evalRes = (this.currentPore && this.evaluateCircuitState(
      this.currentPore.tapeBitstring || '',
      this.streamA,
      this.streamB,
      this.toxinT
    )) ?? { primaryActive: false, gateOutputs: [], yieldMultiplier: 0 };

    // 4 Channels with dedicated height bands
    const channels = [
      {
        tag: 'CH1',
        name: 'STR-A',
        fullName: 'Stream A (Fuel)',
        active: this.streamA,
        color: '#f59e0b',
        rgb: '245, 158, 11',
        freq: 1.6
      },
      {
        tag: 'CH2',
        name: 'STR-B',
        fullName: 'Stream B (Oxidizer)',
        active: this.streamB,
        color: '#06b6d4',
        rgb: '6, 182, 212',
        freq: 2.2
      },
      {
        tag: 'CH3',
        name: 'TOX-T',
        fullName: 'Toxin T (Inhibitor)',
        active: this.toxinT,
        color: '#f43f5e',
        rgb: '244, 63, 94',
        freq: 1.1
      },
      {
        tag: 'CH4',
        name: 'LOGIC',
        fullName: 'Logic Output Sink',
        active: evalRes.primaryActive,
        color: '#10b981',
        rgb: '16, 185, 129',
        freq: 1.6
      }
    ];

    const chanHeight = drawH / 4;

    for (let c = 0; c < 4; c++) {
      const chan = channels[c];
      const laneTop = c * chanHeight;
      const laneBottom = (c + 1) * chanHeight;
      const midY = (laneTop + laneBottom) / 2;

      // Dividing horizontal line between channels
      if (c > 0) {
        ctx.strokeStyle = 'rgba(30, 41, 59, 0.7)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, laneTop);
        ctx.lineTo(drawW, laneTop);
        ctx.stroke();
      }

      // Left Channel Header: Color pill, Channel Name, Logic Badge
      const pillY = laneTop + 6;
      ctx.fillStyle = chan.color;
      ctx.beginPath();
      ctx.roundRect(6, pillY, 4, Math.max(12, chanHeight - 12), 2);
      ctx.fill();

      // Channel Tag & Name
      ctx.fillStyle = chan.active ? '#f8fafc' : '#94a3b8';
      ctx.font = 'bold 8.5px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${chan.tag}:${chan.name}`, 14, pillY + 9);

      // State Badge: [HIGH] or [LOW]
      const badgeY = pillY + 14;
      if (chan.active) {
        ctx.fillStyle = `rgba(${chan.rgb}, 0.22)`;
        ctx.strokeStyle = chan.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(14, badgeY, 48, 12, 3);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = chan.color;
        ctx.font = 'bold 7.5px monospace';
        ctx.fillText('1: HIGH', 18, badgeY + 9);
      } else {
        ctx.fillStyle = 'rgba(30, 41, 59, 0.5)';
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(14, badgeY, 48, 12, 3);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 7.5px monospace';
        ctx.fillText('0: LOW', 19, badgeY + 9);
      }

      // Trace Area Rails:
      // railHighY: 1 logic level
      // railLowY: 0 logic level
      const railMargin = 6;
      const railHighY = laneTop + railMargin + 3;
      const railLowY = laneBottom - railMargin - 3;

      // Faint dashed rail guides
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.35)';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([2, 5]);

      // High rail (1)
      ctx.beginPath();
      ctx.moveTo(headerW + 2, railHighY);
      ctx.lineTo(drawW, railHighY);
      ctx.stroke();

      // Low rail (0)
      ctx.beginPath();
      ctx.moveTo(headerW + 2, railLowY);
      ctx.lineTo(drawW, railLowY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Rail level labels
      ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
      ctx.font = '7px monospace';
      ctx.fillText('1', headerW + 4, railHighY - 2);
      ctx.fillText('0', headerW + 4, railLowY - 2);

      // Draw Waveform Trace
      ctx.beginPath();
      const startX = headerW + 16;

      if (chan.active) {
        ctx.strokeStyle = chan.color;
        ctx.lineWidth = 2.2;
        ctx.shadowColor = chan.color;
        ctx.shadowBlur = 8;

        for (let x = startX; x <= drawW; x += 2) {
          const tVal = ((x - startX) * 0.04) - this.oscPhase * chan.freq;
          const isHigh = Math.sin(tVal) > 0;
          let y = isHigh ? railHighY : railLowY;

          // Add slight Landauer transient switching blip on transitions
          const transPhase = Math.abs(Math.sin(tVal));
          if (transPhase < 0.16) {
            y = midY + (isHigh ? -2 : 2);
          }

          if (x === startX) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        // Inactive signal: clear solid colored baseline with slight analog probe flutter
        ctx.strokeStyle = `rgba(${chan.rgb}, 0.65)`;
        ctx.lineWidth = 1.6;
        ctx.shadowColor = chan.color;
        ctx.shadowBlur = 2;

        for (let x = startX; x <= drawW; x += 4) {
          // Micro flutter (±0.6px) indicating live grounded sensor probe
          const flutter = Math.sin(x * 0.2 + this.oscPhase * 3.0) * 0.6;
          const y = railLowY + flutter;
          if (x === startX) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    // Phosphor sweep vertical cursor line
    const sweepRange = drawW - headerW - 16;
    if (sweepRange > 0) {
      const sweepX = headerW + 16 + ((this.oscPhase * 45) % sweepRange);

      // Trailing persistence gradient
      const trailGrad = ctx.createLinearGradient(sweepX - 25, 0, sweepX, 0);
      trailGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      trailGrad.addColorStop(1, 'rgba(56, 189, 248, 0.12)');
      ctx.fillStyle = trailGrad;
      ctx.fillRect(Math.max(headerW + 16, sweepX - 25), 0, 25, drawH);

      // Leading beam
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(sweepX, 0);
      ctx.lineTo(sweepX, drawH);
      ctx.stroke();
    }

    if (this.oscStatusEl) {
      this.oscStatusEl.innerHTML = `<span style="color:#10b981;">● TRIGGER: LOCKED 12Hz</span> • <span style="color:#38bdf8;">4-CH LOGIC ANALYZER</span>`;
    }

    ctx.restore();
  }
}
