/**
 * 🐠 Siliquarium Visualizer Subsystem
 * CircuitMicroscopeView: Interactive 2D Schematic Microscope for Pore Workshops.
 * Renders authentic logic netlists, conductive copper/neon wire traces,
 * dynamic electron pulses, battery gauges, and decoded codons with full zoom support.
 */

import { IPoreTelemetry, IVentTelemetry } from '../engine/SimulationTelemetry.js';
import { PoreState } from '../core/domain/Pore.js';
import { CircuitTopology, ICircuitAnalysis } from './CircuitTopology.js';
import { TaxonomyNomenclature, ISpeciesTaxon } from '../core/paleontology/TaxonomyNomenclature.js';
import { CodonType } from '../core/codons/CodonTable.js';
import { CodonTranslator } from '../core/codons/CodonTranslator.js';

export class CircuitMicroscopeView {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private animPhase: number = 0;
  private zoomLevel: number = 1.0;
  private fontScale: number = 1.0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to obtain 2D canvas context for Circuit Microscope.');
    this.ctx = ctx;
  }

  public setZoomLevel(zoom: number): void {
    this.zoomLevel = Math.max(1.0, Math.min(2.5, zoom));
  }

  public getZoomLevel(): number {
    return this.zoomLevel;
  }

  public setFontScale(scale: number): void {
    this.fontScale = Math.max(0.8, Math.min(2.0, scale));
  }

  public getFontScale(): number {
    return this.fontScale;
  }

  private font(size: number, weight: string = 'normal', style: string = 'normal'): string {
    const s = Math.round(size * this.fontScale);
    const stylePrefix = style !== 'normal' ? `${style} ` : '';
    const weightPrefix = weight !== 'normal' ? `${weight} ` : '';
    return `${stylePrefix}${weightPrefix}${s}px monospace`;
  }

  private drawTextFitted(
    text: string,
    x: number,
    y: number,
    options?: number | { maxWidth?: number; fontSpec?: string; color?: string }
  ): void {
    let maxWidth = 0;
    let fontSpec: string | undefined;
    let color: string | undefined;
    if (typeof options === 'number') {
      maxWidth = options;
      fontSpec = typeof arguments[4] === 'string' ? arguments[4] : undefined;
      color = typeof arguments[5] === 'string' ? arguments[5] : undefined;
    } else if (options) {
      maxWidth = options.maxWidth ?? 0;
      fontSpec = options.fontSpec;
      color = options.color;
    }
    if (fontSpec) this.ctx.font = fontSpec;
    if (color) this.ctx.fillStyle = color;
    if (maxWidth <= 0) {
      this.ctx.fillText(text, x, y);
      return;
    }

    const metrics = this.ctx.measureText(text);
    if (metrics.width <= maxWidth) {
      this.ctx.fillText(text, x, y, maxWidth);
      return;
    }

    let truncated = text;
    while (truncated.length > 4 && this.ctx.measureText(truncated + '…').width > maxWidth) {
      truncated = truncated.slice(0, -1);
    }
    this.ctx.fillText(truncated + '…', x, y, maxWidth);
  }

  public render(pore: IPoreTelemetry | null, vent: IVentTelemetry): void {
    const parent = this.canvas.parentElement;
    const parentW = parent ? parent.clientWidth : 0;
    const baseW = Math.max(500, parentW > 520 ? Math.min(parentW - 24, 760) : 500);
    const baseH = (pore && pore.hasOrganelle) ? 690 : 590;

    const desiredW = Math.round(baseW * this.zoomLevel);
    const desiredH = Math.round(baseH * this.zoomLevel);

    if (this.canvas.width !== desiredW || this.canvas.height !== desiredH) {
      this.canvas.width = desiredW;
      this.canvas.height = desiredH;
    }

    const w = this.canvas.width;
    const h = this.canvas.height;
    if (w <= 0 || h <= 0) return;

    this.animPhase += 0.08;
    this.ctx.clearRect(0, 0, w, h);

    this.ctx.save();
    this.ctx.scale(this.zoomLevel, this.zoomLevel);

    this.drawBackground(baseW, baseH);

    if (!pore) {
      this.drawEmptyState(baseW, baseH, 'Click any seafloor pore to focus microscope');
      this.ctx.restore();
      return;
    }

    if (pore.state === PoreState.EMPTY) {
      this.drawEmptyPoreState(baseW, baseH, pore);
      this.ctx.restore();
      return;
    }

    if (pore.hasSpore) {
      this.drawSporeState(baseW, baseH, pore);
      this.ctx.restore();
      return;
    }

    if (pore.state === PoreState.CARCASS) {
      this.drawCarcassState(baseW, baseH, pore);
      this.ctx.restore();
      return;
    }

    this.drawLivingCellMicroscope(baseW, baseH, pore, vent);
    this.ctx.restore();
  }

  private drawBackground(w: number, h: number): void {
    const grad = this.ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#090e1a');
    grad.addColorStop(1, '#030611');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, w, h);

    // Subtle technical grid reticle
    this.ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)';
    this.ctx.lineWidth = 1;
    for (let x = 20; x < w; x += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }
    for (let y = 20; y < h; y += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }
  }

  private drawEmptyState(w: number, h: number, text: string): void {
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = this.font(15, 'bold');
    this.ctx.textAlign = 'center';
    this.ctx.fillText(text, w / 2, h / 2 - 10);
    this.ctx.fillStyle = '#475569';
    this.ctx.font = this.font(12);
    this.ctx.fillText('Inspect living silicoids, carcasses, spores, or mineral vents', w / 2, h / 2 + 16);
  }

  private drawEmptyPoreState(_w: number, _h: number, pore: IPoreTelemetry): void {
    const isChimney = (pore.coord.q === 0 && pore.coord.r === 0 && (pore.coord.z === 1 || pore.coord.z === 2));
    let mediumStr = 'VACANT BENTHIC PORE';
    let subStr = 'Porous mineral cavity ready for colonization.';
    if (isChimney) {
      mediumStr = 'HYDROTHERMAL VENT NOZZLE';
      subStr = 'Emits Stream A (fuel) & Stream B (oxidizer) redox flow.';
    } else if (pore.isBasalt) {
      mediumStr = 'BASALT BEDROCK';
      subStr = 'Dense volcanic bedrock providing structural mineral matrix.';
    } else if (pore.isAqueous) {
      mediumStr = 'AQUEOUS WATER COLUMN';
      subStr = 'Permeable fluid parcel for pelagic spore advection drift.';
    }
    this.ctx.fillStyle = '#38bdf8';
    this.ctx.font = this.font(16, 'bold');
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`PORE [${pore.coord.q}, ${pore.coord.r}, ${pore.coord.z}]`, 20, 32);
    this.ctx.fillStyle = '#e2e8f0';
    this.ctx.font = this.font(13, 'bold');
    this.ctx.fillText(`STATUS: ${mediumStr}`, 20, 58);
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = this.font(12);
    this.ctx.fillText(subStr, 20, 84);
  }

  private drawSporeState(_w: number, _h: number, pore: IPoreTelemetry): void {
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.font = this.font(16, 'bold');
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`PORE [${pore.coord.q}, ${pore.coord.r}, ${pore.coord.z}]`, 20, 32);
    this.ctx.fillStyle = '#fef08a';
    this.ctx.font = this.font(13, 'bold');
    this.ctx.fillText('STATUS: PELAGIC SPORE CAPSULE (STAGE A DISPERSAL)', 20, 56);
    this.ctx.fillStyle = '#cbd5e1';
    this.ctx.font = this.font(12);
    this.ctx.fillText('Drifting along convective hydrothermal plume...', 20, 80);
    this.ctx.fillText(`Stored Energy: ${pore.energy} tokens | Matter: ${pore.matter} tokens`, 20, 104);
    this.ctx.fillText('Searching for vacant benthic substrate to colonize', 20, 128);
  }

  private drawCarcassState(_w: number, _h: number, pore: IPoreTelemetry): void {
    this.ctx.fillStyle = '#f59e0b';
    this.ctx.font = this.font(16, 'bold');
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`PORE [${pore.coord.q}, ${pore.coord.r}, ${pore.coord.z}]`, 20, 32);
    this.ctx.fillStyle = '#cbd5e1';
    this.ctx.font = this.font(13, 'bold');
    this.ctx.fillText('STATUS: MINERALIZING DETRITUS CARCASS', 20, 56);
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = this.font(12);
    this.ctx.fillText(`Residual Energy: ${pore.energy} tokens`, 20, 82);
    this.ctx.fillText(`Recyclable Matter: ${pore.matter} tokens`, 20, 106);
    this.ctx.fillText('Available for benthic scavengers', 20, 132);
  }

  private drawLivingCellMicroscope(w: number, h: number, pore: IPoreTelemetry, vent: IVentTelemetry): void {
    const analysis = CircuitTopology.analyze(pore.tapeBitstring, vent, pore.primaryActive, pore.operonStates);
    const taxon = pore.speciesTaxon ?? TaxonomyNomenclature.classify({
      tapeBitstring: pore.tapeBitstring,
      gateTypes: pore.gateTypes,
      generation: pore.generation,
      isBasalt: pore.isBasalt,
      hasOrganelle: pore.hasOrganelle,
      isSyncytium: pore.isSyncytium ?? false,
      isDifferentiated: pore.isDifferentiated ?? false
    });

    // 1. Header & Species Taxonomy
    this.ctx.fillStyle = taxon.auraColor;
    this.ctx.font = this.font(16, 'bold', 'italic');
    this.ctx.textAlign = 'left';
    this.drawTextFitted(`🧬 ${taxon.binomialName}`, 16, 22, w - 32);

    const mediumStr = pore.isAqueous ? 'AQUEOUS' : 'ROCK';
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = this.font(12);
    const organelleLabel = pore.hasOrganelle ? ' • 🧬 ENDOSYMBIONT' : '';
    this.drawTextFitted(`${taxon.commonName}${organelleLabel} • PORE [${pore.coord.q},${pore.coord.r},${pore.coord.z}] • ${mediumStr} • GEN ${pore.generation}`, 16, 38, w - 32);

    // 2. Battery & Matter Meters
    let curY = 50;
    this.drawGauges(pore, 16, curY, w - 32);
    curY += 50;

    // 3. Syncytial Macro-Organism Banner (if syncytium)
    if (pore.isSyncytium) {
      this.drawSyncytiumBanner(pore, 16, curY, w - 32);
      curY += 36;
    }

    // 4. Network Motif / Symbiosis Badge Card with Honoree citation
    this.drawMotifBadge(analysis, taxon, pore, { x: 16, y: curY, width: w - 32 });
    curY += 66;

    // 5. Schematic Netlist Canvas (Dual vs Single Cassette)
    if (pore.hasOrganelle && pore.organelleTape) {
      const organelleAnalysis = CircuitTopology.analyze(pore.organelleTape, vent, true);
      const availH = h - curY - 84;
      const boxH = Math.max(105, Math.floor((availH - 8) / 2));

      const hostTitle = analysis.isDifferentiallyExpressed
        ? `🧬 HOST OPERON (${analysis.gateCount}/${analysis.totalGenomeGates} Gates Built • Repressed Operons Silenced)`
        : `🧬 HOST OPERON (Active Netlist — ${analysis.gateCount} Gates Built)`;

      this.drawSchematicNetlist(
        analysis,
        { x: 16, y: curY, width: w - 32, height: boxH },
        hostTitle,
        '#38bdf8'
      );
      curY += boxH + 8;

      this.drawSchematicNetlist(
        organelleAnalysis,
        { x: 16, y: curY, width: w - 32, height: boxH },
        `✨ ORGANELLE CASSETTE (Endosymbiont Auxiliary Engine — Margulis Homage — ${organelleAnalysis.gateCount} Gates)`,
        '#a855f7'
      );

      // Dual Genome Tape & Gene Expression Ribbons
      this.drawDualGeneExpressionViewer(pore, analysis, organelleAnalysis, { x: 16, y: h - 74, width: w - 32, height: 68 });
    } else {
      const schematicH = Math.max(130, h - curY - 84);
      let netlistTitle = `🧬 ACTIVE PHENOTYPIC NETLIST (${analysis.gateCount} Gates Built)`;
      if (analysis.isDifferentiallyExpressed) {
        netlistTitle = `🧬 ACTIVE PHENOTYPIC NETLIST (${analysis.gateCount}/${analysis.totalGenomeGates} Gates Built • ${analysis.totalGenomeGates - analysis.gateCount} Unbuilt/Silenced)`;
      }
      this.drawSchematicNetlist(analysis, { x: 16, y: curY, width: w - 32, height: schematicH }, netlistTitle, '#38bdf8');
      this.drawGeneExpressionViewer(pore, analysis, vent, { x: 16, y: h - 74, width: w - 32, height: 68 });
    }
  }

  private drawSyncytiumBanner(pore: IPoreTelemetry, x: number, y: number, width: number): void {
    this.ctx.fillStyle = 'rgba(139, 92, 246, 0.22)';
    this.ctx.strokeStyle = '#8b5cf6';
    this.ctx.lineWidth = 1.4;
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, width, 32, 6);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = '#c084fc';
    this.ctx.font = this.font(13, 'bold');
    this.ctx.textAlign = 'left';
    this.drawTextFitted(`🟣 MACRO-ORGANIC SYNCYTIUM [${pore.syncytiumId ?? 'Colony'}]`, x + 10, y + 14, width - 20);

    this.ctx.fillStyle = '#e9d5ff';
    this.ctx.font = this.font(11.5);
    const topoText = pore.bodyTopology ? ` • ${pore.bodyTopology}` : '';
    this.drawTextFitted(`${pore.syncytiumMemberCount ?? 2}-Pore Syncytium${topoText} • Homeostatic Streaming`, x + 10, y + 26, width - 20);
  }

  private drawGauges(pore: IPoreTelemetry, x: number, y: number, width: number): void {
    const eFrac = Math.max(0, Math.min(1, pore.energy / 100));
    this.ctx.fillStyle = '#cbd5e1';
    this.ctx.font = this.font(13, 'bold');
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`BATTERY: ${pore.energy}/100 TOKENS`, x, y);

    this.ctx.fillStyle = '#1e293b';
    this.ctx.fillRect(x, y + 4, width, 12);
    this.ctx.fillStyle = eFrac > 0.6 ? '#10b981' : (eFrac > 0.3 ? '#38bdf8' : '#f59e0b');
    this.ctx.fillRect(x, y + 4, width * eFrac, 12);

    const mFrac = Math.max(0, Math.min(1, pore.matter / 40));
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = this.font(11.5);
    this.ctx.fillText(`MATTER: ${pore.matter}/40 | AGE: ${pore.age} ticks`, x, y + 28);
    this.ctx.fillStyle = '#1e293b';
    this.ctx.fillRect(x, y + 32, width, 7);
    this.ctx.fillStyle = '#818cf8';
    this.ctx.fillRect(x, y + 32, width * mFrac, 7);
  }

  private drawMotifBadge(
    analysis: ICircuitAnalysis,
    taxon: ISpeciesTaxon,
    pore: IPoreTelemetry,
    bounds: { x: number; y: number; width: number }
  ): void {
    const { x, y, width } = bounds;
    // Glowing background container
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    this.ctx.strokeStyle = (analysis.primaryActive || pore.hasOrganelle) ? taxon.auraColor : '#1e293b';
    this.ctx.lineWidth = 1.2;
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, width, 62, 6);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = taxon.auraColor;
    this.ctx.font = this.font(14, 'bold');
    this.ctx.textAlign = 'left';
    const organelleAddon = pore.hasOrganelle ? ' + 🧬 Organelle Symbiont' : '';
    this.drawTextFitted(`⚡ ${analysis.motifName}${organelleAddon}`, x + 10, y + 17, width - 20);

    this.ctx.fillStyle = '#e2e8f0';
    this.ctx.font = this.font(12);
    this.drawTextFitted(`Homage: ${taxon.honoree} (${taxon.field})`, x + 10, y + 31, width - 20);

    // Sporulation engine capacity status
    if (pore.hasSporeAdaptation) {
      this.ctx.fillStyle = '#fbbf24';
      this.ctx.font = this.font(11.5, 'bold');
      this.drawTextFitted('🟡 SPORULATION ENGINE: READY (FtsZ Septum + Cascade)', x + 10, y + 45, width - 20);
    } else if (pore.hasSeptum) {
      this.ctx.fillStyle = '#38bdf8';
      this.ctx.font = this.font(11.5);
      this.drawTextFitted('⚪ CLEAVAGE SINK PRESENT (Awaiting ≥2 Gates)', x + 10, y + 45, width - 20);
    } else {
      this.ctx.fillStyle = '#64748b';
      this.ctx.font = this.font(11.5);
      this.drawTextFitted('⚪ CONTACT-INHIBITED (Benthic Sessile Only)', x + 10, y + 45, width - 20);
    }

    this.ctx.fillStyle = '#64748b';
    this.ctx.font = this.font(10.5, 'normal', 'italic');
    this.drawTextFitted(taxon.citation, x + 10, y + 57, width - 20);
  }

  private drawSchematicNetlist(
    analysis: ICircuitAnalysis,
    bounds: { x: number; y: number; width: number; height: number },
    title?: string,
    titleColor: string = '#38bdf8'
  ): void {
    const { x, y, width, height } = bounds;
    // Bounding box for schematic
    this.ctx.fillStyle = 'rgba(6, 11, 22, 0.90)';
    this.ctx.strokeStyle = '#1e293b';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, width, height, 8);
    this.ctx.fill();
    this.ctx.stroke();

    let contentY = y;
    let contentH = height;
    if (title) {
      this.ctx.fillStyle = titleColor;
      this.ctx.font = this.font(12, 'bold');
      this.ctx.textAlign = 'left';
      this.drawTextFitted(title, x + 10, y + 14, width - 20);
      contentY += 18;
      contentH -= 20;
    }

    // Map normalized (0..1) coordinates to screen pixels
    const toScreen = (pt: { x: number; y: number }) => ({
      x: x + pt.x * width,
      y: contentY + pt.y * contentH
    });

    // 1. Draw Wires (Conductive copper/neon traces)
    for (const wire of analysis.wires) {
      if (wire.path.length < 2) continue;
      const pts = wire.path.map(toScreen);

      this.ctx.beginPath();
      this.ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        this.ctx.lineTo(pts[i].x, pts[i].y);
      }

      if (wire.isHigh) {
        // High voltage glow
        this.ctx.strokeStyle = wire.color;
        this.ctx.lineWidth = wire.isFeedback ? 3.0 : 2.4;
        this.ctx.shadowColor = wire.color;
        this.ctx.shadowBlur = 8;
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;

        // Animated traveling electron pulse dot
        const pulseT = (this.animPhase * 0.4) % 1.0;
        const totalSegs = pts.length - 1;
        const segIdx = Math.floor(pulseT * totalSegs);
        const subT = (pulseT * totalSegs) - segIdx;
        const p1 = pts[Math.min(segIdx, totalSegs - 1)];
        const p2 = pts[Math.min(segIdx + 1, totalSegs)];
        const px = p1.x + (p2.x - p1.x) * subT;
        const py = p1.y + (p2.y - p1.y) * subT;

        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(px, py, 3.0, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        // Low voltage dim trace
        this.ctx.strokeStyle = '#334155';
        this.ctx.lineWidth = 1.2;
        this.ctx.stroke();
      }
    }

    // 2. Draw Nodes (Porins, Gates, Sinks)
    for (const node of analysis.nodes) {
      const pos = toScreen(node);

      if (node.type === 'porin') {
        // Porin input terminal pad
        const r = Math.max(6, Math.min(9, contentH * 0.10));
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        this.ctx.fillStyle = node.isHigh ? node.color : '#1e293b';
        this.ctx.strokeStyle = node.color;
        this.ctx.lineWidth = 1.8;
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = node.isHigh ? '#ffffff' : '#94a3b8';
        this.ctx.font = this.font(11.5, 'bold');
        this.ctx.textAlign = 'right';
        this.ctx.fillText(node.label, pos.x - 12, pos.y + 4);
      } else if (node.type === 'gate') {
        // Logic Gate Body (Integrated circuit chip)
        const chipW = Math.max(66, Math.round(58 * this.fontScale));
        const chipH = Math.min(30, Math.max(22, Math.floor(contentH * 0.24)));
        const gx = pos.x - chipW / 2;
        const gy = pos.y - chipH / 2;

        this.ctx.fillStyle = '#0f172a';
        this.ctx.strokeStyle = node.isHigh ? node.color : '#334155';
        this.ctx.lineWidth = node.isHigh ? 2.2 : 1.2;
        this.ctx.beginPath();
        this.ctx.roundRect(gx, gy, chipW, chipH, 5);
        this.ctx.fill();
        this.ctx.stroke();

        // Gate pin terminals (A, B on left, Out on right)
        this.drawPin(gx, pos.y - 5, node.isHigh);
        this.drawPin(gx, pos.y + 5, node.isHigh);
        this.drawPin(gx + chipW, pos.y, node.isHigh);

        // Gate text
        this.ctx.fillStyle = node.isHigh ? node.color : '#cbd5e1';
        this.ctx.font = this.font(12, 'bold');
        this.ctx.textAlign = 'center';
        this.ctx.fillText(node.label, pos.x, pos.y + 4);
      } else if (node.type === 'sink') {
        // Battery or Septum Sink Chamber
        const r = Math.max(7, Math.min(11, contentH * 0.11));
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        this.ctx.fillStyle = node.isHigh ? node.color : '#1e293b';
        this.ctx.strokeStyle = node.color;
        this.ctx.lineWidth = 2.2;
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = node.isHigh ? '#ffffff' : '#cbd5e1';
        this.ctx.font = this.font(11.5, 'bold');
        this.ctx.textAlign = 'left';
        this.ctx.fillText(node.label, pos.x + 14, pos.y + 3);
        if (node.subLabel && contentH > 85) {
          this.ctx.font = this.font(10);
          this.ctx.fillStyle = '#94a3b8';
          this.ctx.fillText(node.subLabel, pos.x + 14, pos.y + 14);
        }
      }
    }
  }

  private drawPin(x: number, y: number, isHigh: boolean): void {
    this.ctx.beginPath();
    this.ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    this.ctx.fillStyle = isHigh ? '#ffffff' : '#475569';
    this.ctx.fill();
  }

  private drawGeneExpressionViewer(
    pore: IPoreTelemetry,
    analysis: ICircuitAnalysis,
    vent: IVentTelemetry,
    bounds: { x: number; y: number; width: number; height: number }
  ): void {
    const { x, y, width, height } = bounds;
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    this.ctx.strokeStyle = pore.isDifferentiated ? '#c084fc' : '#334155';
    this.ctx.lineWidth = 1.2;
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, width, height, 6);
    this.ctx.fill();
    this.ctx.stroke();

    const trans = CodonTranslator.translateTape(pore.tapeBitstring);
    const instructions = trans.instructions;
    const operons = trans.operons ?? [];

    // Header strip
    this.ctx.fillStyle = pore.isDifferentiated ? '#c084fc' : '#38bdf8';
    this.ctx.font = this.font(11, 'bold');
    this.ctx.textAlign = 'left';

    const taxonRole = pore.speciesTaxon?.commonName || '';
    const diffTag = pore.isDifferentiated
      ? ` • GRN DIVERGENT ATTRACTOR [${taxonRole}]`
      : ' • 1D EPISTEMIC TAPE';

    // Compute operon expression states
    const opStates = pore.operonStates ?? operons.map(op => {
      const ch = op.targetChannel ?? (op.operatorCodon ? (op.operatorCodon.codonIndex & 3) : 0);
      if (ch === 0) return vent.streamA;
      if (ch === 1) return vent.streamB;
      if (ch === 2) return vent.toxinT;
      if (ch === 3) return pore.energy < 25;
      return true;
    });

    const repressedCount = opStates.filter(s => !s).length;
    const operonSummary = operons.length > 1
      ? ` (${operons.length - repressedCount}/${operons.length} Operons Expressed)`
      : '';

    this.drawTextFitted(
      `🧬 1D GENOMIC SAFE vs 2D ACTIVE PHENOTYPE (${instructions.length} Codons / ${pore.tapeBitstring.length}b${operonSummary}${diffTag}):`,
      x + 8,
      y + 13,
      width - 16
    );

    const codonW = Math.min(68, Math.floor((width - 16) / Math.max(1, instructions.length)));
    let gateSlotIndex = 0;

    instructions.forEach((inst, idx) => {
      const cx = x + 8 + idx * codonW;
      const cy = y + 19;
      const pillW = codonW - 3;
      const pillH = height - 25;

      const type = inst.definition.type;
      let label = inst.definition.label;

      // Find which operon this instruction belongs to
      const parentOperon = operons.find(op => op.instructions.some(i => i.slot === inst.slot)) ?? operons[0];
      const isOperonExpressed = parentOperon ? (opStates[parentOperon.id] ?? true) : true;

      let bgCol = 'rgba(30, 41, 59, 0.8)';
      let borderCol = '#475569';
      let textCol = '#94a3b8';

      if (!isOperonExpressed) {
        // REPRESSED / SILENCED GENE SEGMENT (NOT ASSEMBLED INTO PHENOTYPE)
        bgCol = 'rgba(15, 23, 42, 0.9)';
        borderCol = 'rgba(239, 68, 68, 0.5)';
        textCol = '#ef4444';
        if (type === CodonType.REGULATORY_OPERATOR) {
          label = 'OP: REPR';
        } else {
          label = `${label} [UNBUILT]`;
        }
      } else {
        // EXPRESSED GENE SEGMENT
        if (type === CodonType.REGULATORY_OPERATOR) {
          bgCol = 'rgba(16, 185, 129, 0.25)';
          borderCol = '#10b981';
          textCol = '#6ee7b7';
          label = 'OP: ACTIVE';
        } else if (type === CodonType.GATE_AND || type === CodonType.GATE_OR || type === CodonType.GATE_NOT) {
          const matchingNode = analysis.nodes.find(n => n.type === 'gate' && n.slot === gateSlotIndex);
          const isHigh = matchingNode ? matchingNode.isHigh : false;
          gateSlotIndex++;

          bgCol = isHigh ? 'rgba(16, 185, 129, 0.28)' : 'rgba(14, 165, 233, 0.16)';
          borderCol = isHigh ? '#10b981' : '#0284c7';
          textCol = isHigh ? '#34d399' : '#38bdf8';
          label = isHigh ? `${label}: ON` : `${label}: IDLE`;
        } else if (type === CodonType.PORIN_STREAM_A) {
          const isFlowing = vent.streamA;
          bgCol = isFlowing ? 'rgba(245, 158, 11, 0.25)' : 'rgba(30, 41, 59, 0.8)';
          borderCol = isFlowing ? '#f59e0b' : '#64748b';
          textCol = isFlowing ? '#fbbf24' : '#94a3b8';
          label = isFlowing ? 'POR-A: 1' : 'POR-A: 0';
        } else if (type === CodonType.PORIN_STREAM_B) {
          const isFlowing = vent.streamB;
          bgCol = isFlowing ? 'rgba(6, 182, 212, 0.25)' : 'rgba(30, 41, 59, 0.8)';
          borderCol = isFlowing ? '#06b6d4' : '#64748b';
          textCol = isFlowing ? '#22d3ee' : '#94a3b8';
          label = isFlowing ? 'POR-B: 1' : 'POR-B: 0';
        } else if (type === CodonType.PORIN_TOXIN_T) {
          const isFlowing = vent.toxinT;
          bgCol = isFlowing ? 'rgba(244, 63, 94, 0.25)' : 'rgba(30, 41, 59, 0.8)';
          borderCol = isFlowing ? '#f43f5e' : '#64748b';
          textCol = isFlowing ? '#fb7185' : '#94a3b8';
          label = isFlowing ? 'TOX-T: 1' : 'TOX-T: 0';
        } else if (type === CodonType.SINK_BATTERY) {
          bgCol = 'rgba(245, 158, 11, 0.15)';
          borderCol = '#d97706';
          textCol = '#fbbf24';
          label = 'BATTERY';
        } else if (type === CodonType.SINK_SEPTUM) {
          bgCol = 'rgba(168, 85, 247, 0.2)';
          borderCol = '#a855f7';
          textCol = '#d8b4fe';
          label = 'SEPTUM';
        } else if (type === CodonType.INTRON_SILENT) {
          bgCol = 'rgba(15, 23, 42, 0.6)';
          borderCol = '#334155';
          textCol = '#64748b';
          label = 'INTRON';
        }
      }

      this.ctx.fillStyle = bgCol;
      this.ctx.fillRect(cx, cy, pillW, pillH);
      this.ctx.strokeStyle = borderCol;
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(cx, cy, pillW, pillH);

      this.ctx.fillStyle = textCol;
      this.ctx.font = this.font(pillW < 44 ? 7.5 : 8.5, 'bold');
      this.ctx.textAlign = 'center';
      this.ctx.fillText(label, cx + pillW / 2, cy + 14);

      this.ctx.fillStyle = isOperonExpressed ? '#94a3b8' : '#64748b';
      this.ctx.font = this.font(7.5, 'normal');
      this.ctx.fillText(inst.definition.bitPattern, cx + pillW / 2, cy + 28);
    });
  }

  private drawDualGeneExpressionViewer(
    pore: IPoreTelemetry,
    hostAnalysis: ICircuitAnalysis,
    orgAnalysis: ICircuitAnalysis,
    bounds: { x: number; y: number; width: number; height: number }
  ): void {
    const { x, y, width, height } = bounds;
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    this.ctx.strokeStyle = '#a855f7';
    this.ctx.lineWidth = 1.2;
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, width, height, 6);
    this.ctx.fill();
    this.ctx.stroke();

    const hostTrans = CodonTranslator.translateTape(pore.tapeBitstring);
    const orgTrans = CodonTranslator.translateTape(pore.organelleTape ?? '');
    const totalCodons = hostTrans.instructions.length + orgTrans.instructions.length;

    this.ctx.fillStyle = '#c084fc';
    this.ctx.font = this.font(11, 'bold');
    this.ctx.textAlign = 'left';
    this.drawTextFitted(
      `🧬 DUAL-OPERON GENE VIEWER: Host [${hostTrans.instructions.length}c] (Cyan) + Organelle Symbiont [${orgTrans.instructions.length}c] (Purple):`,
      x + 8,
      y + 13,
      width - 16
    );

    const codonW = Math.min(48, Math.floor((width - 16) / Math.max(1, totalCodons)));
    let currentX = x + 8;
    const cy = y + 19;
    const pillH = height - 25;

    // Render Host genes
    let gateSlotIndex = 0;
    hostTrans.instructions.forEach(inst => {
      const pillW = codonW - 2;
      const type = inst.definition.type;
      let label = inst.definition.label;
      let isExpressed = false;
      let borderCol = '#0284c7';
      let bgCol = 'rgba(2, 132, 199, 0.15)';
      let textCol = '#38bdf8';

      if (type === CodonType.GATE_AND || type === CodonType.GATE_OR || type === CodonType.GATE_NOT) {
        const matchingNode = hostAnalysis.nodes.find(n => n.type === 'gate' && n.slot === gateSlotIndex);
        isExpressed = matchingNode ? matchingNode.isHigh : false;
        gateSlotIndex++;
        bgCol = isExpressed ? 'rgba(16, 185, 129, 0.28)' : 'rgba(244, 63, 94, 0.16)';
        borderCol = isExpressed ? '#10b981' : '#f43f5e';
        textCol = isExpressed ? '#34d399' : '#fb7185';
        label = isExpressed ? `${label}: 1` : `${label}: 0`;
      }

      this.ctx.fillStyle = bgCol;
      this.ctx.fillRect(currentX, cy, pillW, pillH);
      this.ctx.strokeStyle = borderCol;
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(currentX, cy, pillW, pillH);

      this.ctx.fillStyle = textCol;
      this.ctx.font = this.font(pillW < 36 ? 7.5 : 8.5, 'bold');
      this.ctx.textAlign = 'center';
      this.ctx.fillText(label, currentX + pillW / 2, cy + 14);

      this.ctx.fillStyle = '#64748b';
      this.ctx.font = this.font(7, 'normal');
      this.ctx.fillText(inst.definition.bitPattern.slice(0, 4), currentX + pillW / 2, cy + 28);

      currentX += codonW;
    });

    // Render Organelle genes
    let orgGateSlot = 0;
    orgTrans.instructions.forEach(inst => {
      const pillW = codonW - 2;
      const type = inst.definition.type;
      let label = inst.definition.label;
      let isExpressed = false;
      let borderCol = '#9333ea';
      let bgCol = 'rgba(147, 51, 234, 0.2)';
      let textCol = '#d8b4fe';

      if (type === CodonType.GATE_AND || type === CodonType.GATE_OR || type === CodonType.GATE_NOT) {
        const matchingNode = orgAnalysis.nodes.find(n => n.type === 'gate' && n.slot === orgGateSlot);
        isExpressed = matchingNode ? matchingNode.isHigh : false;
        orgGateSlot++;
        bgCol = isExpressed ? 'rgba(16, 185, 129, 0.28)' : 'rgba(244, 63, 94, 0.16)';
        borderCol = isExpressed ? '#10b981' : '#f43f5e';
        textCol = isExpressed ? '#34d399' : '#fb7185';
        label = isExpressed ? `${label}: 1` : `${label}: 0`;
      }

      this.ctx.fillStyle = bgCol;
      this.ctx.fillRect(currentX, cy, pillW, pillH);
      this.ctx.strokeStyle = borderCol;
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(currentX, cy, pillW, pillH);

      this.ctx.fillStyle = textCol;
      this.ctx.font = this.font(pillW < 36 ? 7.5 : 8.5, 'bold');
      this.ctx.textAlign = 'center';
      this.ctx.fillText(label, currentX + pillW / 2, cy + 14);

      this.ctx.fillStyle = '#a855f7';
      this.ctx.font = this.font(7, 'normal');
      this.ctx.fillText(inst.definition.bitPattern.slice(0, 4), currentX + pillW / 2, cy + 28);

      currentX += codonW;
    });
  }
}
