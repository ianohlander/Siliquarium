/**
 * 🐠 Siliquarium UI Subsystem
 * ChronicleTourGuideHtmlTemplate: Static DOM Layout and Markup Builders for Expedition Guide.
 */

import { IChronicleTourStop, ITourAspectOption } from './ChronicleTourGuide.js';
import { HistologicalStain, LensViewMode } from '../engine/kinematics/ColonyKinematicsRecorder.js';

export interface ITourHUDTemplateParams {
  readonly stop: IChronicleTourStop;
  readonly total: number;
  readonly currentNum: number;
  readonly currentAspectIndex: number;
  readonly isExploring: boolean;
  readonly isDirectorsCut: boolean;
  readonly activeLens: LensViewMode;
  readonly activeStain: HistologicalStain;
  readonly activeAspect?: ITourAspectOption | null;
}

export function buildTourHUDHtml(params: ITourHUDTemplateParams): string {
  const {
    stop,
    total,
    currentNum: num,
    currentAspectIndex,
    isExploring,
    isDirectorsCut,
    activeLens,
    activeStain,
    activeAspect
  } = params;

  const flukeRibbonHtml = stop.isRareFluke
    ? `
      <div class="tour-fluke-ribbon">
        <span>🌟</span>
        <span>STATISTICAL FLUKE & RARE DISCOVERY: ${stop.flukePhenomenonType || 'NOVEL ADAPTATION'}</span>
      </div>
    `
    : '';

  const aspectOptions = stop.aspectOptions || [];
  const aspectButtonsHtml = aspectOptions.map((asp, idx) => {
    const isActive = idx === currentAspectIndex;
    return `
      <button class="tour-aspect-btn ${isActive ? 'active' : ''}" data-aspect-index="${idx}" title="${asp.label} (${asp.lens.toUpperCase()} Lens, ${asp.stain.toUpperCase()} Stain)">
        <div class="tour-aspect-btn-top">
          <span class="tour-aspect-btn-icon">${asp.icon}</span>
          <span class="tour-aspect-btn-label">${asp.label}</span>
        </div>
        <span class="tour-aspect-btn-sub">${asp.lens.toUpperCase()} · ${asp.stain.toUpperCase()}</span>
      </button>
    `;
  }).join('');

  const aspectSectionHtml = aspectOptions.length > 0
    ? `
      <!-- Lens & Histology Aspect Switcher -->
      <div class="tour-aspect-section">
        <div class="tour-aspect-header">
          <span class="tour-aspect-title-text">🔬 PRESENTATION ASPECTS & VIEWS</span>
          <span class="tour-aspect-badge" style="border-color:${stop.badgeColor}; color:${stop.badgeColor};">
            ${activeLens.toUpperCase()} · ${activeStain.toUpperCase()}
          </span>
        </div>
        <div class="tour-aspect-pills-row" id="tour-aspect-pills">
          ${aspectButtonsHtml}
        </div>
        <div class="tour-aspect-description" id="tour-aspect-desc">
          ${activeAspect ? activeAspect.description : 'Curated biological lens highlighting distinct morphological features.'}
        </div>
      </div>
    `
    : '';

  return `
    <div class="tour-hud-dialog ${stop.isRareFluke ? 'rare-fluke' : ''}">
      ${flukeRibbonHtml}

      <!-- Tour Header Ribbon -->
      <div class="tour-hud-header">
        <div class="tour-hud-badge-group">
          <span class="tour-hud-category-chip" style="border-color:${stop.badgeColor}; color:${stop.badgeColor}; background:rgba(15,23,42,0.7);">
            ${stop.icon} ${stop.badge}
          </span>
          <span class="tour-hud-counter">STOP ${num} OF ${total}</span>
        </div>
        <button class="tour-hud-close-btn" id="tour-btn-close" title="Exit Expedition Guide (Esc)">✕</button>
      </div>

      <!-- Stop Title & Subtitle -->
      <div class="tour-hud-title-section">
        <div class="tour-hud-title">${stop.title}</div>
        <div class="tour-hud-subtitle">
          Ticks ${stop.startTick}–${stop.endTick} • (${stop.targetCoord.q}, ${stop.targetCoord.r}, ${stop.targetCoord.z}) • ${stop.subtitle}
        </div>
      </div>

      <!-- Deep Scientific Narrative -->
      <div class="tour-hud-narrative">
        ${stop.narrative}
      </div>

      <!-- Lens & Histology Aspect Switcher -->
      ${aspectSectionHtml}

      <!-- Staining, Tracking & Focus Indicator -->
      <div class="tour-hud-meta-row">
        <span class="tour-meta-pill">Lens: <strong>${activeLens.toUpperCase()}</strong></span>
        <span class="tour-meta-pill">Stain: <strong>${activeStain.toUpperCase()}</strong></span>
        <span class="tour-meta-pill">Clip: <strong>${stop.endTick - stop.startTick} ticks</strong></span>
        ${stop.dynamicCameraFollow ? '<span class="tour-meta-pill tour-cam-active">🎥 DYNAMIC TRACKING</span>' : ''}
        ${isExploring
          ? '<span class="tour-meta-pill active-explore">🔍 EXPLORING MANUALLY</span>'
          : '<span class="tour-meta-pill active-loop">🔁 LOOPING CLIP</span>'}
      </div>

      <!-- Tour Quick Specimen Actions -->
      <div class="tour-specimen-actions">
        <button class="tour-action-btn tour-freeze-btn" id="tour-btn-freeze" title="Freeze this living organism to the Bio-Bank cryo-vault">
          ❄️ Freeze Specimen
        </button>
        <button class="tour-action-btn tour-lab-btn" id="tour-btn-open-lab" title="Open Chronicle Analysis Lab for this silicoid">
          🔬 Inspect in Lab
        </button>
      </div>

      <!-- Tour Transport & Interaction Controls -->
      <div class="tour-hud-controls">
        <div class="tour-hud-nav-buttons">
          <button class="tour-nav-btn" id="tour-btn-prev" title="Previous Stop (P)" ${num === 1 ? 'disabled style="opacity:0.4;"' : ''}>
            ⏮ Prev
          </button>
          <button class="tour-explore-btn ${isExploring ? 'exploring' : ''}" id="tour-btn-explore" title="Toggle hands-on exploration">
            ${isExploring ? '▶ Resume Loop' : '⏸ Pause & Explore'}
          </button>
          <button class="tour-explore-btn tour-directors-cut-btn ${isDirectorsCut ? 'directors-cut-active active' : ''}" id="tour-btn-directors-cut" title="Toggle Autonomous Cinema Mode (Cycles aspects and advances stops hands-free, Hotkey: D)">
            ${isDirectorsCut ? '🎬 Cinema ON' : '🎬 Director\'s Cut'}
          </button>
          <button class="tour-nav-btn tour-nav-next" id="tour-btn-next" title="Next Stop (N)">
            Next ⏭
          </button>
        </div>
        <div class="tour-hud-hint">
          ${isExploring
            ? '💡 Rotate camera freely, click any pore to open Histological Autopsy, or click "Next" when ready.'
            : isDirectorsCut
            ? '🎬 Director\'s Cut Cinema active. Camera orbits and presentation aspects cycle automatically every 2 loops.'
            : stop.dynamicCameraFollow
            ? '🎥 Dynamic tracking active. Switch Aspects (1–4) above to change views and stains during playback.'
            : '🔁 Autolooping clip window. Click Aspect chips above to switch views/stains or "Pause & Explore" to inspect cells.'}
        </div>
      </div>
    </div>
  `;
}
