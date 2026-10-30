/**
 * 🐠 Siliquarium UI Subsystem
 * LabFlyoutHtmlTemplate: Static DOM Layout and Markup Builders for the In-Vitro Laboratory Flyout.
 */

import { ISavedSilicoid } from '../engine/storage/BioBank.js';

export interface IBioBankListTemplateParams {
  readonly strains: readonly ISavedSilicoid[];
  readonly activeStrainId?: string;
}

export function buildBioBankEmptyHtml(): string {
  return `
    <div style="font-size:0.72rem;color:#64748b;text-align:center;padding:12px;background:rgba(15,23,42,0.6);border-radius:6px;">
      Cryo-Vault is empty. Freeze organisms from Safaris or Circuit Microscope!
    </div>
  `;
}

export function buildBioBankListHtml(params: IBioBankListTemplateParams): string {
  const { strains, activeStrainId } = params;

  return strains.map(s => {
    const isActive = activeStrainId === s.id;
    const borderCol = isActive ? '#10b981' : 'rgba(51, 65, 85, 0.6)';
    const bgCol = isActive ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.5)';
    const badge = s.isDifferentiated
      ? `<span style="font-size:0.6rem;background:rgba(192,132,252,0.2);color:#c084fc;padding:1px 4px;border-radius:3px;border:1px solid rgba(192,132,252,0.4);">${s.bodyTopology || 'METAZOAN'}</span>`
      : s.bodyTopology
        ? `<span style="font-size:0.6rem;background:rgba(139,92,246,0.2);color:#a78bfa;padding:1px 4px;border-radius:3px;border:1px solid rgba(139,92,246,0.4);">${s.bodyTopology} COLONY</span>`
        : `<span style="font-size:0.6rem;background:rgba(56,189,248,0.2);color:#38bdf8;padding:1px 4px;border-radius:3px;border:1px solid rgba(56,189,248,0.4);">${s.gateCount} Gates</span>`;

    return `
      <div class="biobank-strain-card" data-strain-id="${s.id}" style="border:1px solid ${borderCol};background:${bgCol};padding:6px 8px;border-radius:6px;display:flex;flex-direction:column;gap:3px;transition:all 0.15s ease;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
          <div style="font-size:0.75rem;font-weight:700;color:${isActive ? '#6ee7b7' : '#f8fafc'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${isActive ? '● ' : ''}${s.name}
          </div>
          ${badge}
        </div>
        <div style="font-size:0.65rem;color:#38bdf8;font-family:monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
          ${s.taxonBinomial} • Gen ${s.generation} • Epoch ${s.savedAtEpoch}
        </div>
        ${s.notes ? `<div style="font-size:0.62rem;color:#94a3b8;line-height:1.2;max-height:2.4em;overflow:hidden;text-overflow:ellipsis;">${s.notes}</div>` : ''}
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:2px;">
          <button class="btn-biobank-select" data-strain-id="${s.id}" style="background:${isActive ? '#065f46' : '#1e293b'};color:${isActive ? '#6ee7b7' : '#94a3b8'};border:1px solid ${isActive ? '#10b981' : '#334155'};border-radius:4px;font-size:0.62rem;padding:2px 6px;cursor:pointer;font-weight:${isActive ? '700' : '400'};">
            ${isActive ? '✓ Active Inoculant' : 'Select Inoculant'}
          </button>
          <button class="btn-biobank-delete" data-strain-id="${s.id}" title="Remove strain from vault" style="background:transparent;border:none;color:#ef4444;font-size:0.7rem;cursor:pointer;padding:2px 4px;opacity:0.7;">
            🗑️
          </button>
        </div>
      </div>
    `;
  }).join('');
}
