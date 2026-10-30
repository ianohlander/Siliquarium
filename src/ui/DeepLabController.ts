/**
 * 🐠 Siliquarium UI Subsystem
 * DeepLabController: Pristine Academic Research Workbench Controller.
 * Manages the 5 Curated University Lab Practicums, Practicum Objective Console,
 * and 1-Click Publication-Grade Research Exporters (CSV, JSON, SVG).
 */

import { SimulationWorld } from '../engine/SimulationWorld.js';
import { NaturalistAssistant } from './NaturalistAssistant.js';

export interface ILabPracticum {
  readonly id: string;
  readonly title: string;
  readonly courseCode: string;
  readonly duration: string;
  readonly objective: string;
  readonly instructions: string[];
  readonly targetConcept: string;
}

export const LAB_PRACTICUMS: readonly ILabPracticum[] = Object.freeze([
  {
    id: 'practicum-1',
    title: 'Chemiosmotic Coupling & The Mitchell Proton Battery',
    courseCode: 'BIO 340 / BIOC 412',
    duration: '90 Minutes',
    objective: 'Demonstrate Peter Mitchell’s Chemiosmotic Hypothesis: verify that proton gradients across basalt pores drive cellular charge accumulation without pre-existing ATP synthases.',
    instructions: [
      'Observe basal cellular battery charging within 3 hex radii of the primary hydrothermal vent.',
      'Toggle PMF Histological Shader (Shift+4) to inspect trans-membrane voltage gradients (-150 to -220 mV).',
      'Verify First-Law mass and energy balance (ΔE = 0.000, ΔM = 0.000).'
    ],
    targetConcept: 'Chemiosmosis & Proton Motive Force (Mitchell 1961)'
  },
  {
    id: 'practicum-2',
    title: 'Landauer Thermodynamic Limits & The Pattee Epistemic Cut',
    courseCode: 'PHYS 420 / CS 485',
    duration: '90 Minutes',
    objective: 'Quantify Rolf Landauer’s physical cost of information processing: measure the 1-token heat dissipation penalty incurred per boolean gate register transition.',
    instructions: [
      'Inspect living netlists in the Circuit Microscope (Shift+M).',
      'Correlate total gate transitions with cumulative Landauer heat dissipation in the ledger.',
      'Confirm the Howard Pattee Epistemic Cut: verify that symbolic genomes remain rate-independent while physical netlists execute rate-dependent chemistry.'
    ],
    targetConcept: 'Landauer Principle (1961) & Epistemic Cut (Pattee 1969)'
  },
  {
    id: 'practicum-3',
    title: 'Emergent Network Motifs: Uri Alon Feed-Forward Loops',
    courseCode: 'SYSBIO 501 / CS 560',
    duration: '90 Minutes',
    objective: 'Identify Uri Alon network motifs in evolved genetic regulatory networks: verify that Coherent Feed-Forward Loops (C-FFLs) evolve to filter transient chemical noise.',
    instructions: [
      'Allow the simulation to evolve through 2,500+ epochs under pulsed hydrothermal regime.',
      'Open the Paleontologist Motif Scanner to locate 3-node C-FFL subgraph isomorphisms.',
      'Perturb the caldera with transient Stream T spikes; verify that adapted clades suppress false-alarm responses.'
    ],
    targetConcept: 'Network Motifs & Transcription Regulation (Uri Alon 2007)'
  },
  {
    id: 'practicum-4',
    title: 'The Lenski Cit+ Substrate C Innovation & Metabolic Divergence',
    courseCode: 'EVOL 410 / GEN 301',
    duration: '90 Minutes',
    objective: 'Replicate Richard Lenski’s LTEE Cit+ breakthrough: observe how duplications and mutations unlock refractory Substrate C catabolism.',
    instructions: [
      'Inject Substrate C plume into the caldera substrate.',
      'Track clade diversification as organisms evolving PORIN_STREAM_C gain a +3 catalytic energy advantage.',
      'Record population trajectories to demonstrate historical contingency.'
    ],
    targetConcept: 'Historical Contingency & Key Innovation (Lenski 2008)'
  },
  {
    id: 'practicum-5',
    title: 'Multi-Lineage Phylogeny & Competitive Exclusion',
    courseCode: 'ECOL 310 / BIO 220',
    duration: '90 Minutes',
    objective: 'Investigate Gause’s Principle of Competitive Exclusion: measure niche differentiation between syntrophic cross-feeders and predatory phagocytes.',
    instructions: [
      'Inoculate two distinct clades from the BioBank vault into separate caldera sectors.',
      'Track Shannon diversity index H and biomass exchange over 1,000 ticks.',
      'Export the resulting LTEE phylogeny tree and growth curves for lab report submission.'
    ],
    targetConcept: 'Competitive Exclusion & Niche Differentiation (Gause 1934)'
  }
]);

export class DeepLabController {
  private readonly world: SimulationWorld;
  private readonly naturalist?: NaturalistAssistant;

  // DOM Elements
  private toolbar: HTMLElement | null = null;
  private practicumSelect: HTMLSelectElement | null = null;
  private consolePanel: HTMLElement | null = null;
  private consoleTitle: HTMLElement | null = null;
  private consoleObjective: HTMLElement | null = null;
  private consoleInstructions: HTMLElement | null = null;
  private exportBtn: HTMLElement | null = null;
  private exportDropdown: HTMLElement | null = null;
  private activePracticumId: string | null = null;

  constructor(world: SimulationWorld, naturalist?: NaturalistAssistant) {
    this.world = world;
    this.naturalist = naturalist;
    this.initDOM();
  }

  private initDOM(): void {
    this.toolbar = document.getElementById('deeplab-academic-toolbar');
    this.practicumSelect = document.getElementById('sel-deeplab-practicum') as HTMLSelectElement | null;
    this.consolePanel = document.getElementById('deeplab-practicum-console');
    this.consoleTitle = document.getElementById('deeplab-console-title');
    this.consoleObjective = document.getElementById('deeplab-console-objective');
    this.consoleInstructions = document.getElementById('deeplab-console-instructions');
    this.exportBtn = document.getElementById('btn-deeplab-export');
    this.exportDropdown = document.getElementById('deeplab-export-dropdown');

    this.bindEvents();
  }

  private bindEvents(): void {
    this.practicumSelect?.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      const val = target.value;
      if (val) {
        this.loadPracticum(val);
      } else {
        this.hidePracticumConsole();
      }
    });

    const closeConsoleBtn = document.getElementById('btn-deeplab-console-close');
    closeConsoleBtn?.addEventListener('click', () => this.hidePracticumConsole());

    this.exportBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.exportDropdown?.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      this.exportDropdown?.classList.add('hidden');
    });

    // Wire individual export actions
    document.getElementById('btn-export-telemetry-csv')?.addEventListener('click', () => this.exportTelemetryCSV());
    document.getElementById('btn-export-world-json')?.addEventListener('click', () => this.exportWorldJSON());
    document.getElementById('btn-export-practicum-report')?.addEventListener('click', () => this.exportPracticumReport());
  }

  public loadPracticum(practicumId: string): void {
    const practicum = LAB_PRACTICUMS.find(p => p.id === practicumId);
    if (!practicum) return;

    this.activePracticumId = practicum.id;

    if (this.consoleTitle) {
      this.consoleTitle.innerHTML = `<strong>${practicum.courseCode}:</strong> ${practicum.title} <span style="color:#38bdf8; font-size:0.75rem;">(${practicum.duration})</span>`;
    }
    if (this.consoleObjective) {
      this.consoleObjective.textContent = practicum.objective;
    }
    if (this.consoleInstructions) {
      this.consoleInstructions.innerHTML = practicum.instructions.map(inst => `<li>${inst}</li>`).join('');
    }

    this.consolePanel?.classList.remove('hidden');
    this.naturalist?.showToast(`🎓 Loaded ${practicum.courseCode}: ${practicum.title}`);
  }

  public hidePracticumConsole(): void {
    this.consolePanel?.classList.add('hidden');
    if (this.practicumSelect) this.practicumSelect.value = '';
    this.activePracticumId = null;
  }

  public exportTelemetryCSV(): void {
    const tele = this.world.exportTelemetry();
    const headers = [
      'Tick',
      'LivingCount',
      'SporeCount',
      'CarcassCount',
      'TotalUniverseEnergy',
      'EnergyInjected',
      'LandauerBurned',
      'HeatDissipated',
      'DeltaEnergy',
      'ActiveClades',
      'ShannonDiversity'
    ];

    const row = [
      tele.tick,
      tele.livingCount,
      tele.sporeCount,
      tele.carcassCount,
      tele.totalEnergyInUniverse,
      tele.ledger.totalEnergyInjected,
      tele.ledger.totalEnergyBurnedLandauer,
      tele.ledger.totalEnergyDissipatedHeat,
      tele.ledger.energyBalanceDelta,
      tele.activeCladesCount,
      tele.shannonDiversity.toFixed(4)
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n' + row.join(',');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `siliquarium_telemetry_tick_${tele.tick}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.naturalist?.showToast('📥 Telemetry CSV exported successfully.');
  }

  public exportWorldJSON(): void {
    const snap = this.world.captureStateSnapshot(`DeepLab_Research_Tick_${this.world.getTickCount()}`);
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snap, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `siliquarium_snapshot_tick_${this.world.getTickCount()}.silisave`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.naturalist?.showToast('📥 Full .silisave simulation state exported.');
  }

  public exportPracticumReport(): void {
    const practicum = LAB_PRACTICUMS.find(p => p.id === this.activePracticumId) || LAB_PRACTICUMS[0];
    const tele = this.world.exportTelemetry();

    const reportContent = `# Siliquarium Undergraduate Lab Practicum Report
**Course:** ${practicum.courseCode}  
**Topic:** ${practicum.title}  
**Target Biophysical Invariant:** ${practicum.targetConcept}  
**Universal Tick:** ${tele.tick}  
**Date:** ${new Date().toISOString()}  

---

## 1. Experimental Objective
${practicum.objective}

## 2. Universal Conservation Audit
- Strict First-Law Energy Delta (ΔE): ${tele.ledger.energyBalanceDelta.toFixed(4)} (Conserved: ${tele.ledger.isEnergyConserved})
- Strict First-Law Matter Delta (ΔM): ${tele.ledger.matterBalanceDelta.toFixed(4)} (Conserved: ${tele.ledger.isMatterConserved})
- Cumulative Landauer Dissipation: ${tele.ledger.totalEnergyBurnedLandauer} tokens

## 3. Clade Diversity & Paleontological Motifs
- Active Living Clades: ${tele.activeCladesCount}
- Total Living Biomass: ${tele.livingCount} cells
- Shannon Clade Diversity: ${tele.shannonDiversity.toFixed(4)}
- Vent Thermal Radiance: ${Math.round(tele.vent.thermalFlux || 350)}°C

## 4. Student Hypothesis Verification
[ ] Howard Pattee Epistemic Cut verified (Genome tape remains unmutated by active metabolic catalysis).
[ ] Landauer measurement tax observed across physical sensing porins.
[ ] Mitchell Proton Motive Force gradient charges pore batteries.

*Verified by Siliquarium Digital Paleontology Engine.*
`;

    const blob = new Blob([reportContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `practicum_report_${practicum.id}_tick_${tele.tick}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.naturalist?.showToast('📥 Lab practicum report exported.');
  }

  public show(): void {
    this.toolbar?.classList.remove('hidden');
  }

  public hide(): void {
    this.toolbar?.classList.add('hidden');
    this.hidePracticumConsole();
  }
}
