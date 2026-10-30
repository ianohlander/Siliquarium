/**
 * 🐠 Siliquarium UI Subsystem
 * GeologicalEventModal: Interactive Deep-Sea Environmental Event Notification Card.
 * Displays physical, chemical, and thermodynamic perturbations occurring at the
 * hydrothermal vent matrix (e.g. Boiling Surges, Cryogenic Incursions, Seismic Tremors).
 */

import { IGeologicalEventRecord, GeologicalEventType } from '../engine/environment/GeologicalPressuresEngine.js';
import { HexCoord3D } from '../core/spatial/HexCoord3D.js';

export type FocusEpicenterCallback = (coord: HexCoord3D) => void;

export class GeologicalEventModal {
  private readonly containerEl: HTMLElement | null;
  private readonly onFocusEpicenter: FocusEpicenterCallback;
  private currentEvent: IGeologicalEventRecord | null = null;
  private popupsEnabled: boolean = true;
  private onMuteCallback?: (muted: boolean) => void;

  constructor(onFocusEpicenter: FocusEpicenterCallback, onMuteCallback?: (muted: boolean) => void) {
    this.onFocusEpicenter = onFocusEpicenter;
    this.onMuteCallback = onMuteCallback;
    this.containerEl = document.getElementById('geo-event-modal');
    this.bindEvents();
  }

  public isPopupsEnabled(): boolean {
    return this.popupsEnabled;
  }

  public setPopupsEnabled(enabled: boolean): void {
    this.popupsEnabled = enabled;
  }

  private bindEvents(): void {
    const closeBtn = document.getElementById('geo-modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hide());
    }

    const closeXBtn = document.getElementById('geo-modal-close-x');
    if (closeXBtn) {
      closeXBtn.addEventListener('click', () => this.hide());
    }

    const muteBtn = document.getElementById('geo-modal-mute-btn');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        this.popupsEnabled = !this.popupsEnabled;
        if (this.onMuteCallback) {
          this.onMuteCallback(!this.popupsEnabled);
        }
        muteBtn.textContent = this.popupsEnabled ? '🔕 Mute Pop-ups' : '🔔 Unmute Pop-ups';
        this.hide();
      });
    }

    const zoomBtn = document.getElementById('geo-modal-zoom-btn');
    if (zoomBtn) {
      zoomBtn.addEventListener('click', () => {
        if (this.currentEvent?.epicenter) {
          this.onFocusEpicenter(this.currentEvent.epicenter);
          this.hide();
        } else if (this.currentEvent?.affectedCoords && this.currentEvent.affectedCoords.length > 0) {
          this.onFocusEpicenter(this.currentEvent.affectedCoords[0]);
          this.hide();
        }
      });
    }
  }

  public show(event: IGeologicalEventRecord, force: boolean = false): void {
    this.currentEvent = event;
    if ((!this.popupsEnabled && !force) || !this.containerEl) return;

    const badgeEl = document.getElementById('geo-modal-badge');
    const titleEl = document.getElementById('geo-modal-title');
    const descEl = document.getElementById('geo-modal-desc');
    const impactEl = document.getElementById('geo-modal-impact');
    const pressureEl = document.getElementById('geo-modal-pressure');
    const coordEl = document.getElementById('geo-modal-coord');
    const zoomBtn = document.getElementById('geo-modal-zoom-btn');

    // Dynamic styling and physical metrics based on event type
    const details = this.getEventDetails(event);

    if (badgeEl) {
      badgeEl.textContent = details.badge;
      badgeEl.style.color = details.themeColor;
    }

    if (titleEl) {
      titleEl.textContent = `${event.icon} ${event.title}`;
    }

    if (descEl) {
      descEl.textContent = event.description;
    }

    if (impactEl) {
      impactEl.innerHTML = details.impactHtml;
    }

    if (pressureEl) {
      pressureEl.textContent = details.evolutionaryPressure;
    }

    if (coordEl) {
      const epic = event.epicenter
        ? `Epicenter: Pore [${event.epicenter.q}, ${event.epicenter.r}, ${event.epicenter.z}]`
        : (event.affectedCoords && event.affectedCoords.length > 0
          ? `Affected: ${event.affectedCoords.length} Pores near [${event.affectedCoords[0].q}, ${event.affectedCoords[0].r}, ${event.affectedCoords[0].z}]`
          : 'Matrix-Wide Environmental Shift');
      coordEl.textContent = `${epic} • Tick ${event.tick} • Duration: ${event.durationTicks}t`;
    }

    if (zoomBtn) {
      zoomBtn.style.display = (event.epicenter || (event.affectedCoords && event.affectedCoords.length > 0)) ? 'inline-flex' : 'none';
    }

    // Border glow color
    this.containerEl.style.borderColor = details.themeColor;
    this.containerEl.style.boxShadow = `0 10px 35px rgba(0,0,0,0.8), 0 0 25px ${details.glowColor}`;

    this.containerEl.classList.remove('hidden');
  }

  private getEventDetails(event: IGeologicalEventRecord): {
    badge: string;
    themeColor: string;
    glowColor: string;
    impactHtml: string;
    evolutionaryPressure: string;
  } {
    switch (event.type) {
      case GeologicalEventType.HYDROTHERMAL_SURGE:
        return {
          badge: '🔥 CONVECTIVE THERMAL MEGASURGE',
          themeColor: '#f97316',
          glowColor: 'rgba(249, 115, 22, 0.4)',
          impactHtml: '<strong>Temperature:</strong> 340°C → <span style="color:#fdba74;font-weight:bold;">415°C (+75°C Spike)</span> &bull; <strong>Energy Influx:</strong> +200 Energy Units &bull; <strong>Plumes:</strong> Volatile Gas Boiling',
          evolutionaryPressure: 'Favors metabolic autotrophs capable of rapidly charging high energy while dissipating Landauer switching heat without thermal rupture.'
        };
      case GeologicalEventType.CRYOGENIC_DOWNWELLING:
        return {
          badge: '🧊 CRYOGENIC DOWNWELLING INCURSION',
          themeColor: '#38bdf8',
          glowColor: 'rgba(56, 189, 248, 0.4)',
          impactHtml: '<strong>Temperature:</strong> 340°C → <span style="color:#7dd3fc;font-weight:bold;">1.8°C Extreme Cold (-338°C)</span> &bull; <strong>Thermal Shock:</strong> Severe &bull; <strong>Metabolism:</strong> Throttled (4× Slower)',
          evolutionaryPressure: 'Selects for silicoids with deep battery energy reserves and efficient idle circuits that avoid starvation when catalytic plumes freeze.'
        };
      case GeologicalEventType.TOXIC_HEAVY_METAL_SPIKE:
        return {
          badge: '🧪 TOXIC HEAVY METAL & SULFIDE PULSE',
          themeColor: '#c084fc',
          glowColor: 'rgba(192, 132, 252, 0.4)',
          impactHtml: '<strong>Geochemistry:</strong> Saturated H₂S & Volatile Heavy Metals &bull; <strong>Toxin Sensor (T):</strong> Continuously Active &bull; <strong>Lysis Risk:</strong> Elevated',
          evolutionaryPressure: 'Directly tests genetic regulatory logic: selects for allosteric inverter NOT gates and feed-forward loops that clamp off metabolic channels during acid/poison events.'
        };
      case GeologicalEventType.MAGMATIC_TREMOR:
        return {
          badge: '⚡ TECTONIC SEISMIC FRACTURING',
          themeColor: '#fbbf24',
          glowColor: 'rgba(251, 191, 36, 0.4)',
          impactHtml: '<strong>Seismicity:</strong> Magnitude 6.4 Rift Tremor &bull; <strong>Substrate Impact:</strong> Shattered solid basalt barriers into habitable vacant mineral pores',
          evolutionaryPressure: 'Creates new geographical corridors, breaking physical monopolies and providing virgin micro-pores for colonizing daughter lineages.'
        };
      case GeologicalEventType.PILLOW_LAVA_FLOW:
        return {
          badge: '🌋 BASALT LAVA EXTRUSION',
          themeColor: '#ef4444',
          glowColor: 'rgba(239, 68, 68, 0.4)',
          impactHtml: '<strong>Submarine Volcanism:</strong> 1,150°C Basalt Magma Flow &bull; <strong>Seafloor Resurfacing:</strong> Solidified into impermeable basalt rock barriers',
          evolutionaryPressure: 'Acts as a localized ecological reset: erases entrenched incumbent monopolies and enforces territorial fragmentation.'
        };
      case GeologicalEventType.CHIMNEY_SPALLING:
        return {
          badge: '🏔️ CHIMNEY WALL SPALLING & CALVING',
          themeColor: '#e2e8f0',
          glowColor: 'rgba(226, 232, 240, 0.3)',
          impactHtml: '<strong>Structural Failure:</strong> Hydrothermal chimney flank collapsed &bull; <strong>Benthic Food Influx:</strong> Sulfide detritus and carcasses rained onto seafloor',
          evolutionaryPressure: 'Fuels benthic catabolic scavenger circuits (OR/XOR gates) that thrive on decaying mineral detritus and organic rubble.'
        };
      case GeologicalEventType.VENT_ORIFICE_MIGRATION:
        return {
          badge: '📍 HYDROTHERMAL ORIFICE AVULSION',
          themeColor: '#2dd4bf',
          glowColor: 'rgba(45, 212, 191, 0.4)',
          impactHtml: '<strong>Mineral Clogging:</strong> Primary vent nozzle blocked &bull; <strong>Avulsion:</strong> Hydrothermal fluid burst open a new vent orifice',
          evolutionaryPressure: 'Rewards motile lineages and pelagic spore dispersers able to abandon stranded cold niches and re-colonize new thermal epicenters.'
        };
      case GeologicalEventType.TIDAL_CURRENT_SHEAR:
        return {
          badge: '🌊 TIDAL CURRENT SHEAR REVERSAL',
          themeColor: '#00e5ff',
          glowColor: 'rgba(0, 229, 255, 0.4)',
          impactHtml: '<strong>Ocean Dynamics:</strong> Planetary baroclinic tidal current shifted vector &bull; <strong>Pelagic Advection:</strong> Accelerated spore transport',
          evolutionaryPressure: 'Drives gene flow and long-distance migration of pelagic spores across disparate benthic chimneys and volcanic ridges.'
        };
      case GeologicalEventType.MARINE_SNOW_STORM:
      default:
        return {
          badge: '❄️ PELAGIC DETRITAL FLOC STORM',
          themeColor: '#93c5fd',
          glowColor: 'rgba(147, 197, 253, 0.4)',
          impactHtml: '<strong>Sedimentation:</strong> Heavy marine snow shower precipitated &bull; <strong>Detritus Supply:</strong> Mineral carcasses blanketed empty seafloor pores',
          evolutionaryPressure: 'Provides sudden nutritional windfall for opportunistic heterotrophs and catabolic logic networks.'
        };
    }
  }

  public hide(): void {
    if (this.containerEl) {
      this.containerEl.classList.add('hidden');
    }
    this.currentEvent = null;
  }
}
