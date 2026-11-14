/**
 * 🏛️ Siliquarium UI Subsystem
 * PedagogicalCourseHtmlTemplate: HTML View Generators for BIO/CS 101 Course Modal.
 */

import { ICourseModule, IPracticumStep } from './PedagogicalCourseRegistry.js';

export function buildCourseModalSkeleton(): string {
  return `
    <div class="pedagogical-course-backdrop" id="course-modal-backdrop"></div>
    <div class="pedagogical-course-dialog" role="dialog" aria-modal="true" aria-labelledby="course-modal-title">
      <!-- Top Header Strip -->
      <div class="course-header-strip">
        <div class="course-header-brand">
          <div class="course-title-avatar">🔬</div>
          <div>
            <div class="course-title-main" id="course-modal-title">BIO/CS 101: Introduction to Silicon Abiogenesis</div>
            <div class="course-title-subtitle">Interactive Laboratory Tutorial &amp; Biophysical Analysis Guide</div>
          </div>
        </div>
        <div class="course-header-actions">
          <a href="docs/curriculum/INTRODUCTORY_COURSE_TUTORIAL.html" target="_blank" class="course-textbook-link" title="Open Complete Master Textbook &amp; Syllabus in New Tab">
            📖 Master Textbook ↗
          </a>
          <button id="btn-close-course-modal" class="course-close-btn" title="Close Course Tutorial (Esc)">✕</button>
        </div>
      </div>

      <!-- Track Tabs -->
      <div class="course-track-tabs">
        <button class="course-track-tab active" data-track="track-1" id="btn-course-track-1">
          🧭 Track 1: Foundations of Silicon Abiogenesis (Modules 1–5)
        </button>
        <button class="course-track-tab" data-track="track-2" id="btn-course-track-2">
          🚀 Track 2: Advanced Bio-CAD &amp; Abyssal Dynamics (Modules 6–10)
        </button>
      </div>

      <!-- Two-Column Main Body -->
      <div class="course-body-container">
        <!-- Left Syllabus Sidebar -->
        <div class="course-syllabus-sidebar" id="course-syllabus-list"></div>

        <!-- Right Active Module Viewport -->
        <div class="course-module-viewport" id="course-module-content"></div>
      </div>

      <!-- Bottom Navigation Footer -->
      <div class="course-footer-strip">
        <div class="course-progress-badge" id="course-progress-badge">Progress: 0 / 10 Modules Complete</div>
        <div class="course-footer-btn-group">
          <button id="btn-course-prev" class="course-nav-btn">◀ Previous</button>
          <button id="btn-course-next" class="course-nav-btn primary">Next Module ▶</button>
        </div>
      </div>
    </div>
  `;
}

function buildFoundationsHtml(foundations: readonly string[]): string {
  return foundations
    .map(f => `<span class="course-foundation-tag">🔬 ${f}</span>`)
    .join(' ');
}

function buildStepsHtml(steps: readonly IPracticumStep[]): string {
  return steps.map(s => `
    <div class="course-step-card">
      <div class="course-step-header">
        <span class="course-step-num">Step ${s.stepNumber}</span>
        <span class="course-step-instruction">${s.instruction}</span>
      </div>
      <div class="course-step-outcome"><strong>Expected:</strong> ${s.expectedOutcome}</div>
      ${s.actionKey ? `
        <button class="course-action-trigger-btn" data-action="${s.actionKey}" data-target="${s.targetElementId || ''}">
          ⚡ ${s.actionLabel || 'Execute Action in Simulation'}
        </button>
      ` : ''}
    </div>
  `).join('');
}

function buildPoeOptionsHtml(
  module: ICourseModule,
  selectedIndex: number | null,
  submitted: boolean
): string {
  return module.poeCheckpoint.options.map((opt, idx) => {
    const isSelected = selectedIndex === idx;
    let optClass = 'course-poe-option';
    if (isSelected) optClass += ' selected';
    if (submitted) {
      optClass += opt.isCorrect ? ' correct' : ' incorrect';
    }
    return `
      <label class="${optClass}" data-index="${idx}">
        <input type="radio" name="poe-radio" value="${idx}" ${isSelected ? 'checked' : ''} ${submitted ? 'disabled' : ''}>
        <span class="course-poe-opt-text">${opt.label}</span>
      </label>
    `;
  }).join('');
}

export function buildActiveModuleHtml(
  module: ICourseModule,
  selectedAnswerIndex: number | null,
  isAnswerSubmitted: boolean
): string {
  const selectedOpt = selectedAnswerIndex !== null ? module.poeCheckpoint.options[selectedAnswerIndex] : null;

  return `
    <div class="course-active-module">
      <div class="course-mod-title-row">
        <span class="course-mod-badge">${module.badge}</span>
        <h2 class="course-mod-heading">${module.title}</h2>
      </div>
      <div class="course-mod-tagline">${module.tagline}</div>

      <!-- Theoretical Context & Biophysical Foundations Box -->
      <div class="course-lecture-box">
        <div class="course-lecture-header">
          <span>🔬 Theoretical Context &amp; Biophysical Foundations</span>
        </div>
        <p class="course-lecture-text">${module.lectureIntro}</p>
        <div class="course-foundations-row">
          ${buildFoundationsHtml(module.biophysicalFoundations)}
        </div>
      </div>

      <!-- Hands-On Practicum Section -->
      <div class="course-practicum-section">
        <h3 class="course-section-heading">🧪 Hands-On Laboratory Practicum</h3>
        <div class="course-steps-list">
          ${buildStepsHtml(module.practicumSteps)}
        </div>
      </div>

      <!-- Predict-Observe-Explain (POE) Checkpoint -->
      <div class="course-poe-box">
        <div class="course-poe-title">
          <span>🎯 Predict–Observe–Explain Checkpoint</span>
        </div>
        <p class="course-poe-question">${module.poeCheckpoint.question}</p>
        <div class="course-poe-options-list">
          ${buildPoeOptionsHtml(module, selectedAnswerIndex, isAnswerSubmitted)}
        </div>
        <div class="course-poe-actions">
          <button id="btn-submit-poe" class="course-poe-submit-btn" ${selectedAnswerIndex === null || isAnswerSubmitted ? 'disabled' : ''}>
            ${isAnswerSubmitted ? '✓ Answer Checked' : 'Submit Hypothesis &amp; Check Feedback'}
          </button>
        </div>
        ${isAnswerSubmitted && selectedOpt ? `
          <div class="course-poe-feedback ${selectedOpt.isCorrect ? 'correct' : 'incorrect'}">
            <strong>${selectedOpt.isCorrect ? '✅ Evaluation:' : '❌ Correction:'}</strong> ${selectedOpt.feedback}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

export function buildSyllabusListHtml(
  modules: readonly ICourseModule[],
  activeId: string,
  completedIds: ReadonlySet<string>,
  activeTrack: 'track-1' | 'track-2'
): string {
  const filtered = modules.filter(m => m.track === activeTrack);

  return filtered.map((mod, idx) => {
    const isActive = mod.id === activeId;
    const isCompleted = completedIds.has(mod.id);
    let itemClass = 'course-syllabus-item';
    if (isActive) itemClass += ' active';
    if (isCompleted) itemClass += ' completed';

    return `
      <div class="${itemClass}" data-id="${mod.id}" role="button" tabindex="0">
        <div class="course-item-status-icon">${isCompleted ? '✅' : (idx + 1)}</div>
        <div class="course-item-info">
          <div class="course-item-title">${mod.title}</div>
          <div class="course-item-tagline">${mod.tagline}</div>
        </div>
      </div>
    `;
  }).join('');
}
