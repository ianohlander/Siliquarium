/**
 * 🐠 Siliquarium UI Subsystem
 * HUDController: Top & Bottom Scientific Telemetry Heads-Up Display.
 * Updates real-time tick counters, population metrics, conservation audits, and selected pore details.
 */

import { ISimulationTelemetry, IPoreTelemetry } from '../engine/SimulationTelemetry.js';

export class HUDController {
  private readonly tickEl: HTMLElement | null;
  private readonly livingEl: HTMLElement | null;
  private readonly sporeEl: HTMLElement | null;
  private readonly carcassEl: HTMLElement | null;
  private readonly energyEl: HTMLElement | null;
  private readonly deltaEl: HTMLElement | null;
  private readonly ventAEl: HTMLElement | null;
  private readonly ventBEl: HTMLElement | null;
  private readonly ventTEl: HTMLElement | null;
  private readonly phylogenyEl: HTMLElement | null;
  private readonly selectedPoreEl: HTMLElement | null;

  constructor() {
    this.tickEl = document.getElementById('hud-ticks');
    this.livingEl = document.getElementById('hud-living');
    this.sporeEl = document.getElementById('hud-spores');
    this.carcassEl = document.getElementById('hud-carcass');
    this.energyEl = document.getElementById('hud-energy');
    this.deltaEl = document.getElementById('hud-delta');
    this.ventAEl = document.getElementById('hud-vent-a');
    this.ventBEl = document.getElementById('hud-vent-b');
    this.ventTEl = document.getElementById('hud-vent-t');
    this.phylogenyEl = document.getElementById('hud-phylogeny');
    this.selectedPoreEl = document.getElementById('hud-selected-pore');
  }

  public update(telemetry: ISimulationTelemetry, selectedPore: IPoreTelemetry | null): void {
    if (this.tickEl) this.tickEl.textContent = telemetry.tick.toLocaleString();
    if (this.livingEl) this.livingEl.textContent = telemetry.livingCount.toString();
    if (this.sporeEl) this.sporeEl.textContent = (telemetry.sporeCount || 0).toString();
    if (this.carcassEl) this.carcassEl.textContent = telemetry.carcassCount.toString();
    if (this.energyEl) this.energyEl.textContent = `${telemetry.totalEnergyInUniverse} T`;
    if (this.phylogenyEl) {
      this.phylogenyEl.textContent = `Gen ${telemetry.maxGeneration ?? 0} • ${telemetry.activeCladesCount ?? 0} Clades (H=${telemetry.shannonDiversity ?? 0})`;
    }

    if (this.deltaEl) {
      const isConserved = telemetry.ledger.isEnergyConserved && telemetry.ledger.isMatterConserved;
      this.deltaEl.textContent = isConserved ? 'ΔE = 0.000 (Exact)' : `ΔE = ${telemetry.ledger.energyBalanceDelta}`;
      this.deltaEl.className = isConserved ? 'text-emerald-400 font-mono' : 'text-rose-500 font-mono';
    }

    this.updateVentPills(telemetry);
    this.updateSelectedInfo(selectedPore);
  }

  private updateVentPills(telemetry: ISimulationTelemetry): void {
    if (this.ventAEl) {
      this.ventAEl.className = telemetry.vent.streamA ? 'pill-active-amber' : 'pill-inactive';
    }
    if (this.ventBEl) {
      this.ventBEl.className = telemetry.vent.streamB ? 'pill-active-cyan' : 'pill-inactive';
    }
    if (this.ventTEl) {
      this.ventTEl.className = telemetry.vent.toxinT ? 'pill-active-rose' : 'pill-inactive';
    }
  }

  private updateSelectedInfo(pore: IPoreTelemetry | null): void {
    if (!this.selectedPoreEl) return;
    if (!pore) {
      this.selectedPoreEl.textContent = 'Selected: None (Click any hexagonal pore to inspect)';
      return;
    }

    const coordStr = `[${pore.coord.q}, ${pore.coord.r}, ${pore.coord.z}]`;
    const isChimney = (pore.coord.q === 0 && pore.coord.r === 0 && (pore.coord.z === 1 || pore.coord.z === 2));

    if (pore.hasSpore) {
      this.selectedPoreEl.textContent = `Pore ${coordStr} • 🟡 PELAGIC SPORE • Batt: ${pore.energy}T • Matter: ${pore.matter}M • Gen: ${pore.generation}`;
    } else if (pore.state === 'OCCUPIED') {
      const tag = pore.energy > 60 ? '🟩 HEALTHY' : (pore.energy > 30 ? '🟦 ACTIVE' : '🟨 STARVING');
      this.selectedPoreEl.textContent = `Pore ${coordStr} • ${tag} SILICOID • Batt: ${pore.energy}T • Matter: ${pore.matter}M • Gen ${pore.generation} • Gates: ${pore.gateCount}`;
    } else if (pore.state === 'CARCASS') {
      this.selectedPoreEl.textContent = `Pore ${coordStr} • 💀 CARCASS • Energy: ${pore.energy}T • Matter: ${pore.matter}M`;
    } else if (isChimney) {
      this.selectedPoreEl.textContent = `Pore ${coordStr} • 🌋 HYDROTHERMAL VENT • Active Redox Plume`;
    } else if (pore.isBasalt) {
      this.selectedPoreEl.textContent = `Pore ${coordStr} • ⬛ BASALT BEDROCK • Solid Seabed Substrate`;
    } else if (pore.isAqueous) {
      this.selectedPoreEl.textContent = `Pore ${coordStr} • 💧 AQUEOUS WATER COLUMN • Permeable Fluid`;
    } else {
      this.selectedPoreEl.textContent = `Pore ${coordStr} • 🪨 VACANT MINERAL PORE • Ready for Colonization`;
    }
  }
}
