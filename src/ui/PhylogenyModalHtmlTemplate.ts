/**
 * 🐠 Siliquarium UI Subsystem
 * PhylogenyModalHtmlTemplate: Static DOM Layout & Ribbon Markup for Phylogeny Explorer.
 */

export function buildPhylogenyModalMarkup(): string {
  return `
    <div class="phylogeny-modal-backdrop" id="phylogeny-backdrop"></div>
    <div class="phylogeny-modal-card">
      <!-- Modal Header -->
      <div class="phylogeny-header">
        <div class="phylogeny-header-left">
          <span class="phylogeny-icon">🌿</span>
          <div>
            <h2 class="phylogeny-title">EVOLUTIONARY PHYLOGENY &amp; LENSKI LTEE EXPLORER</h2>
            <div class="phylogeny-subtitle">Multi-Lineage Phylogeny • Shannon Diversity • Convergent Evolution (Homology vs. Homoplasy)</div>
          </div>
        </div>
        <button id="phylogeny-close-btn" class="drawer-close-btn" title="Close Phylogeny Explorer (Hotkey: Esc or P)">
          <span>✕</span>
          <span>CLOSE</span>
        </button>
      </div>

      <!-- LTEE Metric Ribbon -->
      <div class="phylogeny-ribbon">
        <div class="ribbon-card">
          <span class="ribbon-label">Max Generation</span>
          <span class="ribbon-val" id="phylo-max-gen" style="color: #38bdf8;">Gen 0</span>
          <span class="ribbon-sub">Generational Depth</span>
        </div>
        <div class="ribbon-card">
          <span class="ribbon-label">Active Clades</span>
          <span class="ribbon-val" id="phylo-clade-count" style="color: #10b981;">0</span>
          <span class="ribbon-sub">Living Founder Taxa</span>
        </div>
        <div class="ribbon-card">
          <span class="ribbon-label">Shannon Diversity (H)</span>
          <span class="ribbon-val" id="phylo-shannon-val" style="color: #fbbf24;">0.000</span>
          <span class="ribbon-badge" id="phylo-shannon-badge">Diverse</span>
        </div>
        <div class="ribbon-card">
          <span class="ribbon-label">Total Births</span>
          <span class="ribbon-val" id="phylo-births" style="color: #a855f7;">0</span>
          <span class="ribbon-sub">Cumulative Divisions</span>
        </div>
        <div class="ribbon-card">
          <span class="ribbon-label">Evo Velocity</span>
          <span class="ribbon-val" id="phylo-velocity" style="color: #f43f5e;">0.00</span>
          <span class="ribbon-sub">Gen / 100 Ticks</span>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="phylo-tab-bar">
        <button id="phylo-tab-clades" class="phylo-tab-btn active-tab">🌿 Active Clades &amp; Radiation</button>
        <button id="phylo-tab-convergence" class="phylo-tab-btn">⚖️ Convergent Evolution &amp; Milestones</button>
      </div>

      <!-- Tab Content: Active Clades -->
      <div id="phylo-pane-clades" class="phylo-tab-pane">
        <div class="phylo-clade-table-header">
          <span>CLADE ID &amp; FOUNDER</span>
          <span>SPECIES TAXON (HOMAGE)</span>
          <span>MEMBERS</span>
          <span>MAX GEN</span>
          <span>AVG ENERGY</span>
          <span>ACTION</span>
        </div>
        <div id="phylo-clades-list" class="phylo-clades-scroll">
          <!-- Clade rows rendered dynamically -->
        </div>
      </div>

      <!-- Tab Content: Convergent Evolution & Milestones -->
      <div id="phylo-pane-convergence" class="phylo-tab-pane hidden">
        <div class="convergence-intro">
          <div class="convergence-badge">HOMOLOGY VS. HOMOPLASY AUDITOR</div>
          <p>Under Richard Lenski's LTEE and Uri Alon's network motif taxonomy, when two distinct phylogenetic clades independently discover identical regulatory network motifs (e.g. Inverters, Bistable Latches, or Spore Dispersal Engines), the Least Common Ancestor (LCA) is audited to prove genuine <strong>Convergent Evolution (Homoplasy)</strong>.</p>
        </div>
        <div id="phylo-milestones-list" class="phylo-milestones-scroll">
          <!-- Milestones rendered dynamically -->
        </div>
      </div>

      <!-- Footer Navigation -->
      <div class="phylo-footer">
        <div class="phylo-footer-hint">Click "🎯 Track in 3D" to focus camera and inspect representative organisms in real-time. Hotkey: P or Esc.</div>
        <button id="phylo-return-btn" class="drawer-btn btn-apply">Return to Simulation</button>
      </div>
    </div>
  `;
}
