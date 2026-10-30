/**
 * 🐠 Siliquarium UI Subsystem
 * VisualKeyModalHtmlTemplate: Static DOM Layout and Markup for Visual Grammar Key & HUD Decoder.
 */

export interface IVisualKeyRenderState {
  readonly isCalm: boolean;
  readonly aurasOn: boolean;
  readonly conduitsMode: string;
  readonly trophicOn: boolean;
  readonly sporesOn: boolean;
  readonly waterOn: boolean;
  readonly bedrockOn: boolean;
}

export function buildVisualKeyMarkup(state: IVisualKeyRenderState): string {
  const { isCalm, aurasOn, conduitsMode, trophicOn, sporesOn, waterOn, bedrockOn } = state;

  return `
    <div class="visual-key-header">
      <div style="display:flex;align-items:center;gap:10px;">
        <div class="visual-key-badge-icon">💡</div>
        <div>
          <h2 class="visual-key-title">Visual Grammar Key &amp; HUD Decoder</h2>
          <p class="visual-key-subtitle">Interactive guide to biological phenomena, animations, and visual cues (Hotkey: K or ?)</p>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <a href="docs/index.html" target="_blank" rel="noopener noreferrer" class="vk-doc-link" style="padding:4px 10px;font-size:0.75rem;border-color:#38bdf8;color:#38bdf8;font-weight:700;text-decoration:none;">📚 Full Docs Portal ↗</a>
        <button id="visual-key-close-btn" class="visual-key-close" title="Close Key (Esc)">✕</button>
      </div>
    </div>

    <div class="visual-key-grid">
      <!-- Card 1: Cellular Respiration / Breathing -->
      <div class="vk-card">
        <div class="vk-card-header">
          <div class="vk-card-icon" style="background:rgba(245, 158, 11, 0.15);border:1px solid #f59e0b;color:#fbbf24;">🫁</div>
          <div style="flex:1;">
            <div class="vk-card-name">Cellular Respiration ("Breathing")</div>
            <div class="vk-card-meta">Radial Scale Pulse • Proton Motive Force (PMF)</div>
          </div>
          <button id="vk-toggle-motion" class="vk-toggle-btn ${isCalm ? 'vk-active-emerald' : 'vk-active-amber'}" title="Toggle Calm vs Normal Motion Dynamics">
            ${isCalm ? 'Motion: Calm' : 'Motion: Normal'}
          </button>
        </div>
        <p class="vk-card-desc">
          Occupied pores expand and contract rhythmically to visualize <strong>proton transport and catalytic ATP regeneration</strong> across the mineral membrane. Faster pulsation indicates higher metabolic output and rapid electron turnover.
        </p>
        <div class="vk-card-tip">
          💡 <em>Tip: If visual movement feels overwhelming, switch to <strong>Motion: Calm</strong> to soften amplitude and pulsation speed.</em>
        </div>
        <div class="vk-doc-links">
          <a href="docs/paleontology/specimen_11_chemiosmotic_autotroph.html" target="_blank" rel="noopener noreferrer" class="vk-doc-link">📖 Specimen 11 Dossier ↗</a>
          <a href="docs/curriculum/unit1_prebiotic_threshold.html#3-the-mitchell-russell-chemiosmotic-battery" target="_blank" rel="noopener noreferrer" class="vk-doc-link">🎓 Unit 1.3: Chemiosmosis &amp; PMF ↗</a>
          <a href="docs/THEORETICAL_MODEL.html#2-the-physical-environment-hydrothermal-vents-rocky-pores" target="_blank" rel="noopener noreferrer" class="vk-doc-link">🔬 Vent Biophysics ↗</a>
        </div>
      </div>

      <!-- Card 2: Margulis Endosymbiont Organelles -->
      <div class="vk-card">
        <div class="vk-card-header">
          <div class="vk-card-icon" style="background:rgba(160, 185, 129, 0.15);border:1px solid #10b981;color:#34d399;">🪐</div>
          <div style="flex:1;">
            <div class="vk-card-name">Endosymbiont Organelles</div>
            <div class="vk-card-meta">Gold-Green Orbiting Satellites • Lynn Margulis Chimera</div>
          </div>
          <button id="vk-toggle-auras" class="vk-toggle-btn ${aurasOn ? 'vk-active-emerald' : 'vk-inactive'}" title="Toggle Metabolic Auras & Satellites">
            ${aurasOn ? 'Auras: ON' : 'Auras: OFF'}
          </button>
        </div>
        <p class="vk-card-desc">
          Spherical gold-green satellites orbiting a host pore represent an <strong>endosymbiotic organelle cassette</strong> (primitive proto-mitochondrion). These provide +25 mV metabolic buffering and prevent starvation during hydrothermal lulls.
        </p>
        <div class="vk-card-tip">
          💡 <em>They are symbiotic partners—not attacking viruses, weapons, or graphical glitches!</em>
        </div>
        <div class="vk-doc-links">
          <a href="docs/paleontology/specimen_08_endosymbiotic_cassette.html" target="_blank" rel="noopener noreferrer" class="vk-doc-link">📖 Specimen 08 Dossier ↗</a>
          <a href="docs/CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.html#8-endosymbiotic-cassette" target="_blank" rel="noopener noreferrer" class="vk-doc-link">🧭 Field Guide §8 ↗</a>
          <a href="docs/curriculum/unit4_evolutionary_dynamics.html#4-mathematical-proof-of-convergent-evolution-homology-vs-homoplasy" target="_blank" rel="noopener noreferrer" class="vk-doc-link">🎓 Unit 4: Symbiosis Dynamics ↗</a>
        </div>
      </div>

      <!-- Card 3: Colonies vs True Multicellular Silicoids with GRN -->
      <div class="vk-card">
        <div class="vk-card-header">
          <div class="vk-card-icon" style="background:rgba(168, 85, 247, 0.15);border:1px solid #a855f7;color:#d8b4fe;">🧬</div>
          <div style="flex:1;">
            <div class="vk-card-name">Colonies vs. Differentiated Metazoans</div>
            <div class="vk-card-meta">Bonner Colonies vs. Wolpert GRN Metazoans • Body Morphology</div>
          </div>
          <button id="vk-toggle-conduits" class="vk-toggle-btn ${conduitsMode === 'off' ? 'vk-inactive' : 'vk-active-purple'}" title="Cycle Conduit Filter: All -> Selected Only -> Off">
            ${conduitsMode === 'all' ? '🟣 Conduits: All' : conduitsMode === 'selected' ? '🟣 Selected Only' : 'Conduits: OFF'}
          </button>
        </div>
        <p class="vk-card-desc">
          <strong>🟣 Undifferentiated Colonies:</strong> Isogenic biofilms sharing pooled energy across purple conduits, with uniform gene expression.<br>
          <strong>🧬 True Multicellular Metazoans:</strong> Clonal genomes with spatial <em>Gene Regulatory Networks (GRN)</em> establishing division of labor across specialized tissues: <strong>🌾 Trophocytes</strong> (vent mouths), <strong>🛡️ Somatic Shields</strong> (toxin inverters), <strong>⚡ Pacemakers</strong> (rhythmic nodes), and <strong>⚓ Basalt Anchors</strong>.
        </p>
        <div class="vk-card-tip">
          🌱 <em>Emergent Body Topologies Detected:</em> <strong>Dendritic</strong> (branching coral), <strong>Columnar</strong> (vertical spire), <strong>Rosette</strong> (radial cluster), <strong>Ring</strong> (toroid), and <strong>Filamentous</strong> (chain).
        </div>
        <div class="vk-doc-links">
          <a href="docs/MULTICELLULAR_MORPHOLOGY_GUIDE.html" target="_blank" rel="noopener noreferrer" class="vk-doc-link" style="border-color:#f472b6;color:#f472b6;font-weight:700;">🌸 Master Morphology &amp; Graph Theory Guide ↗</a>
          <a href="docs/CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.html#7-multicellular-body-topologies-diagnostic-morphometrics" target="_blank" rel="noopener noreferrer" class="vk-doc-link">🧭 Morphological Taxonomy (§7) ↗</a>
          <a href="docs/paleontology/specimen_09_syncytial_multicellularity.html" target="_blank" rel="noopener noreferrer" class="vk-doc-link">📖 Specimen 09 Dossier ↗</a>
          <a href="docs/THEORETICAL_MODEL.html#9-hexagonal-honeycomb-matrix-multi-cellular-morphogenesis" target="_blank" rel="noopener noreferrer" class="vk-doc-link">🔬 GRN Morphogenesis ↗</a>
        </div>
      </div>

      <!-- Card 4: Detrital Scavengers & Trophic Feeding -->
      <div class="vk-card">
        <div class="vk-card-header">
          <div class="vk-card-icon" style="background:rgba(244, 63, 94, 0.15);border:1px solid #f43f5e;color:#fb7185;">🦀</div>
          <div style="flex:1;">
            <div class="vk-card-name">Scavengers &amp; Trophic Feeding</div>
            <div class="vk-card-meta">Amber/Crimson Rays • Enzymatic Detritivores</div>
          </div>
          <button id="vk-toggle-trophic" class="vk-toggle-btn ${trophicOn ? 'vk-active-rose' : 'vk-inactive'}" title="Toggle Predation / Scavenging Trophic Rays">
            ${trophicOn ? 'Rays: ON' : 'Rays: OFF'}
          </button>
        </div>
        <p class="vk-card-desc">
          Crimson directional rays indicate <strong>trophic predation or detrital scavenging</strong>. Scavenger silicoids extend hydrolytic enzymes toward lysed organic matter on the basalt slope, reclaiming raw matter tokens from deceased cells.
        </p>
        <div class="vk-card-tip">
          💡 <em>Toggle <strong>Rays: OFF</strong> to suppress dynamic feeding lines during high-density population booms.</em>
        </div>
        <div class="vk-doc-links">
          <a href="docs/paleontology/specimen_13_trophic_predator.html" target="_blank" rel="noopener noreferrer" class="vk-doc-link">📖 Specimen 13 (Predator) ↗</a>
          <a href="docs/paleontology/specimen_14_detrital_scavenger.html" target="_blank" rel="noopener noreferrer" class="vk-doc-link">📖 Specimen 14 (Scavenger) ↗</a>
          <a href="docs/THEORETICAL_MODEL.html#11-abiogenesis-the-detritus-scavenger-cycle" target="_blank" rel="noopener noreferrer" class="vk-doc-link">🔬 Detritus Cycle ↗</a>
        </div>
      </div>

      <!-- Card 5: Subterranean Cavern Shafts & Hadal Fissures -->
      <div class="vk-card">
        <div class="vk-card-header">
          <div class="vk-card-icon" style="background:rgba(56, 189, 248, 0.15);border:1px solid #38bdf8;color:#38bdf8;">🕳️</div>
          <div style="flex:1;">
            <div class="vk-card-name">Subterranean Cavern Shafts (z &lt; 0)</div>
            <div class="vk-card-meta">Hexagonal Abyss Hatches &amp; Acoustic Ripples • Hadal Trenches</div>
          </div>
          <span class="vk-card-badge" style="background:#0f172a;border:1px solid #38bdf8;color:#38bdf8;padding:2px 8px;border-radius:10px;font-size:0.68rem;font-family:monospace;">
            Geological Portal
          </span>
        </div>
        <p class="vk-card-desc">
          Hexagonal aperture portals with geothermal ripple rings mark surface pores situated directly above <strong>subterranean cavern voids or hadal rift fissures (strata z = -1, -2, -3)</strong>. They indicate underground living space excavated into basalt bedrock beneath the seafloor.
        </p>
        <div class="vk-card-tip">
          💡 <em>Not an organism: Surface pores without underground chambers do not show this portal. Clicking the central downward arrow (<strong>⟱</strong>) plunges the camera straight into the subterranean niche!</em>
        </div>
        <div class="vk-doc-links">
          <a href="docs/paleontology/specimen_12_basalt_lithotroph.html" target="_blank" rel="noopener noreferrer" class="vk-doc-link">📖 Specimen 12: Lithotroph Refugia ↗</a>
          <a href="docs/THEORETICAL_MODEL.html#2-the-physical-environment-hydrothermal-vents-rocky-pores" target="_blank" rel="noopener noreferrer" class="vk-doc-link">🔬 Subterranean Bedrock Physics ↗</a>
          <a href="docs/USER_GUIDE.html#463-comprehensive-walkthrough-of-guided-tour-stops--emergent-phenomena" target="_blank" rel="noopener noreferrer" class="vk-doc-link">🧭 Hadal Rift Tour Stop (§8) ↗</a>
        </div>
      </div>
    </div>

    <!-- Environmental Layer Clarity Controls -->
    <div class="vk-layers-section">
      <div class="vk-layers-title">🌍 Environmental Layer Clarity Filters:</div>
      <div class="vk-layers-bar">
        <button id="vk-toggle-spores" class="vk-layer-pill ${sporesOn ? 'vk-pill-active' : ''}">
          🟡 Spores: ${sporesOn ? 'ON' : 'OFF'}
        </button>
        <button id="vk-toggle-water" class="vk-layer-pill ${waterOn ? 'vk-pill-active' : ''}">
          💧 Water Column: ${waterOn ? 'ON' : 'OFF'}
        </button>
        <button id="vk-toggle-bedrock" class="vk-layer-pill ${bedrockOn ? 'vk-pill-active' : ''}">
          ⬛ Basalt Bedrock: ${bedrockOn ? 'ON' : 'OFF'}
        </button>
      </div>
      <div class="vk-doc-links" style="margin-top:4px;">
        <span style="font-size:0.68rem;color:#64748b;font-family:monospace;margin-right:2px;">📚 Deep Dives:</span>
        <a href="docs/paleontology/specimen_10_pelagic_sporulation.html" target="_blank" rel="noopener noreferrer" class="vk-doc-link">🟡 Pelagic Spores Dossier ↗</a>
        <a href="docs/THEORETICAL_MODEL.html#20-pelagic-detachment-the-planktonic-transition-discrete-movement" target="_blank" rel="noopener noreferrer" class="vk-doc-link">💧 Water Column &amp; Advection ↗</a>
        <a href="docs/paleontology/specimen_12_basalt_lithotroph.html" target="_blank" rel="noopener noreferrer" class="vk-doc-link">⬛ Basalt Lithotrophs ↗</a>
        <a href="docs/CIRCUIT_PALEONTOLOGY_GLOSSARY.html" target="_blank" rel="noopener noreferrer" class="vk-doc-link">📖 Master Glossary ↗</a>
      </div>
    </div>
  `;
}
