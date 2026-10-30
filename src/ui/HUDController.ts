/**
 * 🐠 Siliquarium UI Subsystem
 * HUDController: Top & Bottom Scientific Telemetry Heads-Up Display.
 * Updates real-time tick counters, population metrics, conservation audits, and selected pore details.
 */

import { ISimulationTelemetry, IPoreTelemetry } from '../engine/SimulationTelemetry.js';
import { TaxonomyNomenclature } from '../core/paleontology/TaxonomyNomenclature.js';
import { SiliquariumDB } from '../engine/storage/SiliquariumDB.js';
import { LensViewMode } from '../engine/kinematics/ColonyKinematicsRecorder.js';
import { AudioSynthesizer } from './AudioSynthesizer.js';

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
  private readonly ventTempEl: HTMLElement | null;
  private readonly phylogenyEl: HTMLElement | null;
  private readonly selectedPoreEl: HTMLElement | null;
  private readonly statsBtn: HTMLElement | null;
  private readonly statsPanel: HTMLElement | null;
  private readonly statsChevron: HTMLElement | null;
  private readonly statsPreview: HTMLElement | null;
  private readonly ramTierEl: HTMLElement | null;
  private readonly storageTierEl: HTMLElement | null;
  private readonly docsBtn: HTMLElement | null;
  private readonly docsPanel: HTMLElement | null;
  private readonly docsChevron: HTMLElement | null;
  private readonly audioBtn: HTMLElement | null;
  private onLensChangeCallback?: (lens: LensViewMode) => void;
  private isStatsOpen: boolean = false;
  private isDocsOpen: boolean = false;
  private lastRenderedTick: number = -1;
  private lastStorageCheckTick: number = 0;
  private lastSelectedCoordKey: string | null = null;
  private lastSelectedEnergy: number = -1;
  private lastSelectedState: string | null = null;

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
    this.ventTempEl = document.getElementById('hud-vent-temp');
    this.phylogenyEl = document.getElementById('hud-phylogeny');
    this.selectedPoreEl = document.getElementById('hud-selected-pore');
    this.statsBtn = document.getElementById('hud-stats-btn');
    this.statsPanel = document.getElementById('hud-stats-panel');
    this.statsChevron = document.getElementById('hud-stats-chevron');
    this.statsPreview = document.getElementById('hud-stats-preview');
    this.ramTierEl = document.getElementById('hud-ram-tier');
    this.storageTierEl = document.getElementById('hud-storage-tier');
    this.docsBtn = document.getElementById('hud-docs-btn');
    this.docsPanel = document.getElementById('hud-docs-panel');
    this.docsChevron = document.getElementById('hud-docs-chevron');
    this.audioBtn = document.getElementById('btn-toggle-audio');

    this.bindStatsDropdown();
    this.bindDocsDropdown();
    this.bindLensSelector();
    this.bindAudioToggle();
    this.updateStorageIndicators();
  }

  public setOnLensChange(cb: (lens: LensViewMode) => void): void {
    this.onLensChangeCallback = cb;
  }

  public updateActiveLens(lens: LensViewMode): void {
    const btns = document.querySelectorAll('.lens-mode-btn');
    btns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-lens') === lens);
    });
  }

  private bindLensSelector(): void {
    const btns = document.querySelectorAll('.lens-mode-btn');
    btns.forEach(b => {
      b.addEventListener('click', () => {
        const lens = b.getAttribute('data-lens') as LensViewMode;
        if (lens) {
          this.updateActiveLens(lens);
          this.onLensChangeCallback?.(lens);
        }
      });
    });
  }

  public update(telemetry: ISimulationTelemetry, selectedPore: IPoreTelemetry | null): void {
    const selKey = selectedPore ? selectedPore.coord.toKey() : null;
    const selEnergy = selectedPore?.energy ?? -1;
    const selState = selectedPore?.state ?? null;

    if (
      telemetry.tick === this.lastRenderedTick &&
      selKey === this.lastSelectedCoordKey &&
      selEnergy === this.lastSelectedEnergy &&
      selState === this.lastSelectedState
    ) {
      return;
    }

    this.lastRenderedTick = telemetry.tick;
    this.lastSelectedCoordKey = selKey;
    this.lastSelectedEnergy = selEnergy;
    this.lastSelectedState = selState;

    if (this.tickEl) this.tickEl.textContent = telemetry.tick.toLocaleString();
    if (this.livingEl) this.livingEl.textContent = `${telemetry.livingCount} Living`;
    if (this.sporeEl) this.sporeEl.textContent = `${telemetry.sporeCount || 0} Spores`;
    if (this.carcassEl) this.carcassEl.textContent = telemetry.carcassCount.toString();
    if (this.energyEl) this.energyEl.textContent = `${telemetry.totalEnergyInUniverse} T`;
    if (this.phylogenyEl) {
      this.phylogenyEl.textContent = `Gen ${telemetry.maxGeneration ?? 0} • ${telemetry.activeCladesCount ?? 0} Clades`;
    }

    if (this.deltaEl) {
      const isConserved = telemetry.ledger.isEnergyConserved && telemetry.ledger.isMatterConserved;
      this.deltaEl.textContent = isConserved ? 'ΔE = 0.000' : `ΔE = ${telemetry.ledger.energyBalanceDelta}`;
      this.deltaEl.className = isConserved ? 'telemetry-val text-emerald-400 font-mono' : 'telemetry-val text-rose-500 font-mono';
    }

    if (this.statsPreview) {
      const isConserved = telemetry.ledger.isEnergyConserved && telemetry.ledger.isMatterConserved;
      this.statsPreview.textContent = `${telemetry.livingCount} Cells • ${isConserved ? 'ΔE=0' : 'ΔE≠0'}`;
      this.statsPreview.style.color = isConserved ? '#10b981' : '#f43f5e';
    }

    this.updateVentPills(telemetry);
    this.updateEnvironmentalStatus(telemetry);
    this.updateSelectedInfo(selectedPore, telemetry);

    if (telemetry.tick - this.lastStorageCheckTick >= 100 || this.lastStorageCheckTick === 0) {
      this.lastStorageCheckTick = telemetry.tick;
      this.updateStorageIndicators();
    }
  }

  private async updateStorageIndicators(): Promise<void> {
    if (this.ramTierEl) {
      const perfMem = typeof performance !== 'undefined' ? performance.memory?.usedJSHeapSize : null;
      if (typeof perfMem === 'number') {
        const mb = (perfMem / (1024 * 1024)).toFixed(1);
        this.ramTierEl.textContent = `${mb} MB Heap`;
      } else {
        this.ramTierEl.textContent = `~25 MB (Capped)`;
      }
    }

    if (this.storageTierEl) {
      try {
        const stats = await SiliquariumDB.getInstance().getStorageStats();
        if (stats.isAvailable) {
          const total = stats.milestoneCount + stats.snapshotCount + stats.sampleCount;
          this.storageTierEl.textContent = `${total} items (${stats.milestoneCount}M/${stats.snapshotCount}F/${stats.sampleCount}E)`;
          this.storageTierEl.title = `IndexedDB cold storage: ${stats.milestoneCount} milestones, ${stats.snapshotCount} fossil snapshots, ${stats.sampleCount} epoch samples`;
        } else {
          this.storageTierEl.textContent = `Active (In-Memory Buffer)`;
        }
      } catch {
        this.storageTierEl.textContent = `Active & Streaming`;
      }
    }
  }

  private bindStatsDropdown(): void {
    if (!this.statsBtn || !this.statsPanel) return;

    this.statsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleStatsPanel();
    });

    const closeBtn = document.getElementById('hud-stats-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeStatsPanel();
      });
    }

    document.addEventListener('click', (e) => {
      if (!this.isStatsOpen) return;
      const target = e.target as Node;
      if (this.statsPanel && !this.statsPanel.contains(target) && this.statsBtn && !this.statsBtn.contains(target)) {
        this.closeStatsPanel();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isStatsOpen) {
        this.closeStatsPanel();
      }
    });
  }

  public toggleStatsPanel(): void {
    this.isStatsOpen = !this.isStatsOpen;
    if (this.statsPanel) {
      this.statsPanel.classList.toggle('hidden', !this.isStatsOpen);
      if (this.isStatsOpen && this.statsBtn) {
        const rect = this.statsBtn.getBoundingClientRect();
        const panelWidth = 440;
        let left = rect.left;
        if (left + panelWidth > window.innerWidth - 16) {
          left = window.innerWidth - panelWidth - 16;
        }
        left = Math.max(16, left);
        this.statsPanel.style.left = `${left}px`;
        this.statsPanel.style.top = `${rect.bottom + 6}px`;
      }
    }
    if (this.statsChevron) {
      this.statsChevron.style.transform = this.isStatsOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    }
    if (this.statsBtn) {
      this.statsBtn.style.background = this.isStatsOpen ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.12)';
      this.statsBtn.style.borderColor = this.isStatsOpen ? '#10b981' : 'rgba(16, 185, 129, 0.4)';
    }
  }

  public closeStatsPanel(): void {
    this.isStatsOpen = false;
    if (this.statsPanel) {
      this.statsPanel.classList.add('hidden');
    }
    if (this.statsChevron) {
      this.statsChevron.style.transform = 'rotate(0deg)';
    }
    if (this.statsBtn) {
      this.statsBtn.style.background = 'rgba(16, 185, 129, 0.12)';
      this.statsBtn.style.borderColor = 'rgba(16, 185, 129, 0.4)';
    }
  }

  private bindDocsDropdown(): void {
    if (!this.docsBtn || !this.docsPanel) return;

    this.docsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDocsPanel();
    });

    const closeBtn = document.getElementById('hud-docs-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeDocsPanel();
      });
    }

    document.addEventListener('click', (e) => {
      if (!this.isDocsOpen) return;
      const target = e.target as Node;
      if (this.docsPanel && !this.docsPanel.contains(target) && this.docsBtn && !this.docsBtn.contains(target)) {
        this.closeDocsPanel();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isDocsOpen) {
        this.closeDocsPanel();
      }
    });
  }

  public toggleDocsPanel(): void {
    this.isDocsOpen = !this.isDocsOpen;
    if (this.docsPanel) {
      this.docsPanel.classList.toggle('hidden', !this.isDocsOpen);
      if (this.isDocsOpen && this.docsBtn) {
        const rect = this.docsBtn.getBoundingClientRect();
        const panelWidth = 360;
        let left = rect.left;
        if (left + panelWidth > window.innerWidth - 16) {
          left = window.innerWidth - panelWidth - 16;
        }
        left = Math.max(16, left);
        this.docsPanel.style.left = `${left}px`;
        this.docsPanel.style.top = `${rect.bottom + 6}px`;
      }
    }
    if (this.docsChevron) {
      this.docsChevron.style.transform = this.isDocsOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    }
    if (this.docsBtn) {
      this.docsBtn.style.background = this.isDocsOpen ? 'rgba(56, 189, 248, 0.25)' : 'rgba(56, 189, 248, 0.14)';
      this.docsBtn.style.borderColor = this.isDocsOpen ? '#38bdf8' : 'rgba(56, 189, 248, 0.45)';
    }
  }

  public closeDocsPanel(): void {
    this.isDocsOpen = false;
    if (this.docsPanel) {
      this.docsPanel.classList.add('hidden');
    }
    if (this.docsChevron) {
      this.docsChevron.style.transform = 'rotate(0deg)';
    }
    if (this.docsBtn) {
      this.docsBtn.style.background = 'rgba(56, 189, 248, 0.14)';
      this.docsBtn.style.borderColor = 'rgba(56, 189, 248, 0.45)';
    }
  }

  private bindAudioToggle(): void {
    if (!this.audioBtn) return;
    const synth = AudioSynthesizer.getInstance();
    const updateIcon = () => {
      const isMuted = synth.getIsMuted();
      this.audioBtn!.innerHTML = isMuted
        ? '<span style="font-size:0.85rem;">🔇</span> <span>Muted</span>'
        : '<span style="font-size:0.85rem;">🔊</span> <span>Audio</span>';
      this.audioBtn!.style.borderColor = isMuted ? 'rgba(239,68,68,0.4)' : 'rgba(56,189,248,0.45)';
      this.audioBtn!.style.color = isMuted ? '#f87171' : '#38bdf8';
    };
    updateIcon();
    this.audioBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      synth.init();
      synth.toggleMute();
      updateIcon();
    });
  }

  private updateEnvironmentalStatus(telemetry: ISimulationTelemetry): void {
    if (!this.ventTempEl) return;
    const events = telemetry.activeGeologicalEvents;
    if (events && events.length > 0) {
      const active = events[events.length - 1];
      switch (active.type) {
        case 'HYDROTHERMAL_SURGE':
          this.ventTempEl.innerHTML = `<span style="color:#f97316;text-shadow:0 0 8px rgba(249,115,22,0.6);">🔥 415°C (Surge!)</span>`;
          break;
        case 'CRYOGENIC_DOWNWELLING':
          this.ventTempEl.innerHTML = `<span style="color:#38bdf8;text-shadow:0 0 8px rgba(56,189,248,0.6);">🧊 1.8°C (Cryogenic!)</span>`;
          break;
        case 'TOXIC_HEAVY_METAL_SPIKE':
          this.ventTempEl.innerHTML = `<span style="color:#c084fc;text-shadow:0 0 8px rgba(192,132,252,0.6);">🧪 350°C (Toxic H₂S!)</span>`;
          break;
        case 'PILLOW_LAVA_FLOW':
          this.ventTempEl.innerHTML = `<span style="color:#ef4444;text-shadow:0 0 8px rgba(239,68,68,0.6);">🌋 1,150°C (Magma!)</span>`;
          break;
        case 'MAGMATIC_TREMOR':
          this.ventTempEl.innerHTML = `<span style="color:#fbbf24;text-shadow:0 0 8px rgba(251,191,36,0.6);">⚡ 350°C (Tremor!)</span>`;
          break;
        case 'CHIMNEY_SPALLING':
          this.ventTempEl.innerHTML = `<span style="color:#e2e8f0;text-shadow:0 0 6px rgba(226,232,240,0.5);">🏔️ 345°C (Spalling!)</span>`;
          break;
        case 'VENT_ORIFICE_MIGRATION':
          this.ventTempEl.innerHTML = `<span style="color:#2dd4bf;text-shadow:0 0 8px rgba(45,212,191,0.6);">📍 360°C (Avulsion!)</span>`;
          break;
        case 'TIDAL_CURRENT_SHEAR':
          this.ventTempEl.innerHTML = `<span style="color:#00e5ff;text-shadow:0 0 8px rgba(0,229,255,0.6);">🌊 350°C (Tidal Shift)</span>`;
          break;
        case 'MARINE_SNOW_STORM':
          this.ventTempEl.innerHTML = `<span style="color:#93c5fd;text-shadow:0 0 6px rgba(147,197,253,0.5);">❄️ 350°C (Marine Snow)</span>`;
          break;
        default:
          this.ventTempEl.innerHTML = `<span style="color:#38bdf8;">${active.icon} 350°C Active</span>`;
      }
    } else {
      const baseTemp = 348 + Math.round(Math.sin(telemetry.tick * 0.05) * 4);
      this.ventTempEl.innerHTML = `<span style="color:#38bdf8;">${baseTemp}°C • Steady</span>`;
    }
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

  private updateSelectedInfo(pore: IPoreTelemetry | null, telemetry: ISimulationTelemetry): void {
    if (!this.selectedPoreEl) return;
    if (!pore) {
      this.selectedPoreEl.textContent = 'Selected: None (Click any hexagonal pore to inspect)';
      return;
    }

    const coordStr = `[${pore.coord.q}, ${pore.coord.r}, ${pore.coord.z}]`;
    const isChimney = (pore.coord.q === 0 && pore.coord.r === 0 && (pore.coord.z === 1 || pore.coord.z === 2));

    // Dynamic drama interaction label
    let dramaLabel = '';
    if (telemetry.predationEvents && telemetry.predationEvents.length > 0) {
      const pred = telemetry.predationEvents.find(e => e.predatorCoord.equals(pore.coord));
      if (pred) {
        dramaLabel = ` • ⚔️ ATTACKING [${pred.preyCoord.q},${pred.preyCoord.r},${pred.preyCoord.z}] (+10T)`;
      } else {
        const victim = telemetry.predationEvents.find(e => e.preyCoord.equals(pore.coord));
        if (victim) {
          dramaLabel = victim.preyKilled
            ? ` • 💀 LYSED BY PREDATOR at [${victim.predatorCoord.q},${victim.predatorCoord.r},${victim.predatorCoord.z}] (-15T)`
            : ` • ⚠️ UNDER ATTACK by [${victim.predatorCoord.q},${victim.predatorCoord.r},${victim.predatorCoord.z}] (-15T)`;
        }
      }
    }

    if (telemetry.scavengeEvents && telemetry.scavengeEvents.length > 0 && !dramaLabel) {
      const scav = telemetry.scavengeEvents.find(e => e.scavengerCoord.equals(pore.coord));
      if (scav) {
        dramaLabel = ` • 🌾 SCAVENGING [${scav.carcassCoord.q},${scav.carcassCoord.r},${scav.carcassCoord.z}] (+20T)`;
      } else {
        const beingScav = telemetry.scavengeEvents.find(e => e.carcassCoord.equals(pore.coord));
        if (beingScav) {
          dramaLabel = ` • 🌾 DETRITUS BEING RECYCLED by [${beingScav.scavengerCoord.q},${beingScav.scavengerCoord.r},${beingScav.scavengerCoord.z}]`;
        }
      }
    }

    if (telemetry.endosymbiosisEvents && telemetry.endosymbiosisEvents.length > 0 && !dramaLabel) {
      const endo = telemetry.endosymbiosisEvents.find(e => e.coordA.equals(pore.coord) || e.coordB.equals(pore.coord));
      if (endo) {
        const partner = endo.coordA.equals(pore.coord) ? endo.coordB : endo.coordA;
        dramaLabel = ` • 🧬 SYMBIOGENESIS with [${partner.q},${partner.r},${partner.z}] (Lynn Margulis Homage)`;
      }
    }

    if (pore.hasSpore) {
      const taxon = TaxonomyNomenclature.classify({
        tapeBitstring: pore.tapeBitstring,
        gateTypes: pore.gateTypes,
        generation: pore.generation,
        isBasalt: pore.isBasalt,
        hasOrganelle: pore.hasOrganelle,
        isSyncytium: pore.isSyncytium
      });
      this.selectedPoreEl.textContent = `Pore ${coordStr} • 🟡 PELAGIC SPORE (${taxon.binomialName}) • Batt: ${pore.energy}T • Matter: ${pore.matter}M • Gen ${pore.generation}${dramaLabel}`;
    } else if (pore.state === 'OCCUPIED') {
      const taxon = TaxonomyNomenclature.classify({
        tapeBitstring: pore.tapeBitstring,
        gateTypes: pore.gateTypes,
        generation: pore.generation,
        isBasalt: pore.isBasalt,
        hasOrganelle: pore.hasOrganelle,
        isSyncytium: pore.isSyncytium
      });
      const isChimeric = pore.cladeId?.startsWith('chimeric-') || pore.isSyncytium;
      const organelleTag = pore.hasOrganelle ? ' 🧬[ORGANELLE]' : '';
      const topoTag = pore.bodyTopology ? ` · ${pore.bodyTopology}` : '';
      const syncytiumTag = pore.isSyncytium ? ` 🟣[SYNCYTIUM x${pore.syncytiumMemberCount ?? 2}${topoTag}]` : (pore.bodyTopology && pore.bodyTopology !== 'SOLITARY' ? ` [${pore.bodyTopology}]` : '');
      const tag = isChimeric ? '🟣' : (pore.energy > 60 ? '🟩' : (pore.energy > 30 ? '🟦' : '🟨'));
      const colony = telemetry.syncytialColonies?.find(c => c.memberCoords.some(mc => mc.equals(pore.coord)));
      const colonyBanner = (colony && colony.memberCoords.length > 1)
        ? ` • 🟣 [MACRO-ORGANISM: ${colony.bodyTopology} (${colony.memberCoords.length} Pores, ${colony.totalEnergy}T Batt, ${colony.totalMatter}M)]`
        : '';
      this.selectedPoreEl.textContent = `Pore ${coordStr} • ${tag} ${taxon.binomialName} (${taxon.commonName})${organelleTag}${syncytiumTag}${colonyBanner} • Gen ${pore.generation} • Batt: ${pore.energy}T • Matter: ${pore.matter}M • Gates: ${pore.gateCount}${dramaLabel}`;
    } else if (pore.state === 'CARCASS') {
      this.selectedPoreEl.textContent = `Pore ${coordStr} • 💀 CARCASS • Energy: ${pore.energy}T • Matter: ${pore.matter}M (Mineralizing Detritus)${dramaLabel}`;
    } else if (isChimney) {
      this.selectedPoreEl.textContent = `Pore ${coordStr} • 🌋 HYDROTHERMAL VENT • Active Redox Plume`;
    } else if (pore.isBasalt) {
      this.selectedPoreEl.textContent = `Pore ${coordStr} • ⬛ BASALT BEDROCK • Solid Seabed Substrate`;
    } else if (pore.isAqueous) {
      this.selectedPoreEl.textContent = `Pore ${coordStr} • 💧 AQUEOUS WATER COLUMN • Permeable Fluid`;
    } else {
      this.selectedPoreEl.textContent = `Pore ${coordStr} • 🪨 VACANT MINERAL PORE • Ready for Colonization${dramaLabel}`;
    }
  }
}
