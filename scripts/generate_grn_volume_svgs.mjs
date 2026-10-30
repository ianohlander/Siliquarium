import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, '../docs/assets/diagrams');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Common SVG Header with Defs
function svgHeader(w, h) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" class="w-full h-auto font-sans">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0c1222" />
      <stop offset="100%" stop-color="#070a14" />
    </linearGradient>
    <linearGradient id="panelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#131c31" />
      <stop offset="100%" stop-color="#0a0f1d" />
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00e5ff" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>
    <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e" />
      <stop offset="100%" stop-color="#be123c" />
    </linearGradient>
    <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a855f7" />
      <stop offset="100%" stop-color="#6b21a8" />
    </linearGradient>
    <marker id="arr-cyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#00e5ff" />
    </marker>
    <marker id="arr-amber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
    </marker>
    <marker id="arr-emerald" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
    </marker>
    <marker id="arr-rose" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#f43f5e" />
    </marker>
    <marker id="arr-purple" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#a855f7" />
    </marker>
    <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bgGrad)" rx="16" />
  <rect width="${w-2}" height="${h-2}" x="1" y="1" fill="none" stroke="#1e293b" stroke-width="1.5" rx="15" />
`;
}

// ------------------------------------------------------------------------------------------------
// Fig GRN 05: Biological vs Digital Homology (The Complete Rosetta Stone)
// ------------------------------------------------------------------------------------------------
function genFigGrn05() {
  const w = 980, h = 480;
  let out = svgHeader(w, h);
  out += `
  <!-- Title Header -->
  <text x="35" y="38" fill="#00e5ff" font-size="16" font-family="monospace" font-weight="bold" letter-spacing="1">FIGURE 5: THE MOLECULAR ROSETTA STONE</text>
  <text x="35" y="60" fill="#94a3b8" font-size="12">Deep Homology: Molecular Biology Central Dogma vs Howard Pattee's Epistemic Cut in Silico</text>

  <!-- Left Panel: Terrestrial Molecular Biology -->
  <g transform="translate(30, 80)">
    <rect width="445" height="370" fill="url(#panelGrad)" stroke="#1e293b" stroke-width="1.5" rx="12" />
    <rect width="445" height="36" fill="#1e293b" opacity="0.6" rx="12" />
    <text x="20" y="24" fill="#38bdf8" font-size="13" font-family="monospace" font-weight="bold">🌿 TERRESTRIAL MOLECULAR BIOLOGY</text>

    <!-- Step 1: Double Helix DNA -->
    <rect x="20" y="55" width="405" height="50" fill="#0f172a" stroke="#0284c7" stroke-width="1.2" rx="8" />
    <circle cx="45" cy="80" r="16" fill="#0284c7" opacity="0.3" />
    <text x="45" y="85" fill="#38bdf8" font-size="16" text-anchor="middle">🧬</text>
    <text x="75" y="75" fill="#f8fafc" font-size="12" font-weight="bold">Double-Stranded DNA (Linear Genome)</text>
    <text x="75" y="93" fill="#64748b" font-size="10" font-family="monospace">Phosphodiester A-T-C-G base pairs (Rate-independent safe)</text>

    <!-- Arrow 1 -->
    <path d="M 222 105 L 222 125" stroke="#00e5ff" stroke-width="2" marker-end="url(#arr-cyan)" />
    <text x="235" y="118" fill="#38bdf8" font-size="9" font-family="monospace">RNA Polymerase Transcription</text>

    <!-- Step 2: mRNA Transcript -->
    <rect x="20" y="125" width="405" height="50" fill="#0f172a" stroke="#10b981" stroke-width="1.2" rx="8" />
    <circle cx="45" cy="150" r="16" fill="#047857" opacity="0.3" />
    <text x="45" y="155" fill="#34d399" font-size="16" text-anchor="middle">📜</text>
    <text x="75" y="145" fill="#f8fafc" font-size="12" font-weight="bold">Messenger RNA (mRNA Transcripts)</text>
    <text x="75" y="163" fill="#64748b" font-size="10" font-family="monospace">64 triplet codons (Kimura neutral mutation buffers)</text>

    <!-- Arrow 2 -->
    <path d="M 222 175 L 222 195" stroke="#10b981" stroke-width="2" marker-end="url(#arr-emerald)" />
    <text x="235" y="188" fill="#34d399" font-size="9" font-family="monospace">Ribosomal Translation</text>

    <!-- Step 3: Folded Protein Enzyme -->
    <rect x="20" y="195" width="405" height="50" fill="#0f172a" stroke="#f59e0b" stroke-width="1.2" rx="8" />
    <circle cx="45" cy="220" r="16" fill="#b45309" opacity="0.3" />
    <text x="45" y="225" fill="#fbbf24" font-size="16" text-anchor="middle">⚙️</text>
    <text x="75" y="215" fill="#f8fafc" font-size="12" font-weight="bold">Catalytic Enzymes &amp; Transcription Factors</text>
    <text x="75" y="233" fill="#64748b" font-size="10" font-family="monospace">Folded 3D active sites &amp; allosteric repressor pockets</text>

    <!-- Arrow 3 -->
    <path d="M 222 245 L 222 265" stroke="#f59e0b" stroke-width="2" marker-end="url(#arr-amber)" />
    <text x="235" y="258" fill="#fbbf24" font-size="9" font-family="monospace">Catalytic Turnover</text>

    <!-- Step 4: Cellular Metabolism -->
    <rect x="20" y="265" width="405" height="85" fill="#0f172a" stroke="#a855f7" stroke-width="1.2" rx="8" />
    <circle cx="45" cy="305" r="16" fill="#6b21a8" opacity="0.3" />
    <text x="45" y="310" fill="#c084fc" font-size="16" text-anchor="middle">🔋</text>
    <text x="75" y="285" fill="#f8fafc" font-size="12" font-weight="bold">Metabolic Flux &amp; Epigenetic State</text>
    <text x="75" y="303" fill="#64748b" font-size="10" font-family="monospace">ATP chemiosmotic pool • Lac operon repression</text>
    <text x="75" y="320" fill="#a855f7" font-size="10" font-family="monospace">Bistable memory latches • Waddington tissue fate</text>
    <text x="75" y="337" fill="#10b981" font-size="10" font-family="monospace">Feedback onto promoter operators (Rate-dependent)</text>
  </g>

  <!-- Right Panel: Siliquarium Digital Cell -->
  <g transform="translate(505, 80)">
    <rect width="445" height="370" fill="url(#panelGrad)" stroke="#1e293b" stroke-width="1.5" rx="12" />
    <rect width="445" height="36" fill="#1e293b" opacity="0.6" rx="12" />
    <text x="20" y="24" fill="#a855f7" font-size="13" font-family="monospace" font-weight="bold">💻 SILIQUARIUM DIGITAL IN SILICO</text>

    <!-- Step 1: GenomeSafe -->
    <rect x="20" y="55" width="405" height="50" fill="#0f172a" stroke="#a855f7" stroke-width="1.2" rx="8" />
    <circle cx="45" cy="80" r="16" fill="#6b21a8" opacity="0.3" />
    <text x="45" y="85" fill="#c084fc" font-size="16" text-anchor="middle">🔒</text>
    <text x="75" y="75" fill="#f8fafc" font-size="12" font-weight="bold">GenomeSafe (1D Symbolic Tape)</text>
    <text x="75" y="93" fill="#64748b" font-size="10" font-family="monospace">60-bit inert bitstring: 000000 001100... (∂S/∂t = 0)</text>

    <!-- Arrow 1 -->
    <path d="M 222 105 L 222 125" stroke="#a855f7" stroke-width="2" marker-end="url(#arr-purple)" />
    <text x="235" y="118" fill="#c084fc" font-size="9" font-family="monospace">GenomeSafe.photocopy() Scanner</text>

    <!-- Step 2: 6-Bit Codons -->
    <rect x="20" y="125" width="405" height="50" fill="#0f172a" stroke="#00e5ff" stroke-width="1.2" rx="8" />
    <circle cx="45" cy="150" r="16" fill="#0284c7" opacity="0.3" />
    <text x="45" y="155" fill="#38bdf8" font-size="16" text-anchor="middle">📦</text>
    <text x="75" y="145" fill="#f8fafc" font-size="12" font-weight="bold">64-Entry Degenerate Codon Alphabet</text>
    <text x="75" y="163" fill="#64748b" font-size="10" font-family="monospace">6-bit words (GATE_AND, GATE_NOT, SINK, INTRON)</text>

    <!-- Arrow 2 -->
    <path d="M 222 175 L 222 195" stroke="#00e5ff" stroke-width="2" marker-end="url(#arr-cyan)" />
    <text x="235" y="188" fill="#38bdf8" font-size="9" font-family="monospace">PoreWorkshop Netlist Wiring</text>

    <!-- Step 3: Logic Gates -->
    <rect x="20" y="195" width="405" height="50" fill="#0f172a" stroke="#f43f5e" stroke-width="1.2" rx="8" />
    <circle cx="45" cy="220" r="16" fill="#be123c" opacity="0.3" />
    <text x="45" y="225" fill="#fb7185" font-size="16" text-anchor="middle">⚡</text>
    <text x="75" y="215" fill="#f8fafc" font-size="12" font-weight="bold">CMOS Logic Gates (K = 2 Inputs)</text>
    <text x="75" y="233" fill="#64748b" font-size="10" font-family="monospace">AND co-catalyst • NOT allosteric inverter (-1T Landauer)</text>

    <!-- Arrow 3 -->
    <path d="M 222 245 L 222 265" stroke="#f43f5e" stroke-width="2" marker-end="url(#arr-rose)" />
    <text x="235" y="258" fill="#fb7185" font-size="9" font-family="monospace">Boolean State Update F(x, u)</text>

    <!-- Step 4: Cellular Workshop Execution -->
    <rect x="20" y="265" width="405" height="85" fill="#0f172a" stroke="#10b981" stroke-width="1.2" rx="8" />
    <circle cx="45" cy="305" r="16" fill="#047857" opacity="0.3" />
    <text x="45" y="310" fill="#34d399" font-size="16" text-anchor="middle">🏗️</text>
    <text x="75" y="285" fill="#f8fafc" font-size="12" font-weight="bold">PoreBattery &amp; Syncytial Tissue State</text>
    <text x="75" y="303" fill="#64748b" font-size="10" font-family="monospace">Battery tokens [0..100T] • 4 Feedback metabolites M0..M3</text>
    <text x="75" y="320" fill="#10b981" font-size="10" font-family="monospace">Trophocyte vs Somatic Shield attractor basins</text>
    <text x="75" y="337" fill="#f59e0b" font-size="10" font-family="monospace">Cytoplasmic sharing across rock pores (Rate-dependent)</text>
  </g>
</svg>`;
  return out;
}

// ------------------------------------------------------------------------------------------------
// Fig GRN 06: Hill Kinetics vs Discrete Boolean Logic
// ------------------------------------------------------------------------------------------------
function genFigGrn06() {
  const w = 980, h = 460;
  let out = svgHeader(w, h);
  out += `
  <!-- Title Header -->
  <text x="35" y="38" fill="#00e5ff" font-size="16" font-family="monospace" font-weight="bold" letter-spacing="1">FIGURE 6: CONTINUOUS BIOCHEMISTRY VS DISCRETE BOOLEAN GATES</text>
  <text x="35" y="60" fill="#94a3b8" font-size="12">How Sharp Allosteric Cooperativity (Hill Exponent n → ∞) Emerges as Idealized Digital Logic</text>

  <!-- Left Graph Card: Continuous Hill Curves -->
  <g transform="translate(30, 80)">
    <rect width="445" height="350" fill="url(#panelGrad)" stroke="#1e293b" stroke-width="1.5" rx="12" />
    <text x="25" y="32" fill="#38bdf8" font-size="13" font-family="monospace" font-weight="bold">📈 CONTINUOUS HILL EQUATION θ([X])</text>
    <text x="25" y="52" fill="#64748b" font-size="11">θ([X]) = [X]^n / (K_d^n + [X]^n)</text>

    <!-- Graph Axes -->
    <g transform="translate(60, 240)">
      <line x1="0" y1="0" x2="330" y2="0" stroke="#475569" stroke-width="2" marker-end="url(#arr-cyan)" />
      <line x1="0" y1="0" x2="0" y2="-160" stroke="#475569" stroke-width="2" marker-end="url(#arr-cyan)" />
      <text x="325" y="20" fill="#94a3b8" font-size="10" font-family="monospace">Transcription Factor [X]</text>
      <text x="-45" y="-155" fill="#94a3b8" font-size="10" font-family="monospace">Promoter Rate θ</text>
      <text x="-25" y="5" fill="#64748b" font-size="10" font-family="monospace">0.0</text>
      <text x="-25" y="-140" fill="#64748b" font-size="10" font-family="monospace">1.0</text>
      <line x1="-5" y1="-140" x2="320" y2="-140" stroke="#334155" stroke-dasharray="4,4" />

      <!-- Kd Threshold Marker -->
      <line x1="140" y1="5" x2="140" y2="-150" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,4" />
      <text x="140" y="20" fill="#f59e0b" font-size="10" font-family="monospace" text-anchor="middle">K_d (Threshold)</text>

      <!-- Curve 1: n = 1 (Michaelis-Menten hyperbolic) -->
      <path d="M 0 0 Q 70 -90, 140 -105 T 300 -135" fill="none" stroke="#64748b" stroke-width="2" />
      <text x="250" y="-115" fill="#64748b" font-size="10" font-family="monospace">n = 1 (No Coop)</text>

      <!-- Curve 2: n = 2 (Moderate cooperativity) -->
      <path d="M 0 0 C 80 -10, 110 -70, 140 -90 C 170 -110, 220 -138, 300 -140" fill="none" stroke="#38bdf8" stroke-width="2.5" />
      <text x="220" y="-85" fill="#38bdf8" font-size="10" font-family="monospace">n = 2 (LacI dimer)</text>

      <!-- Curve 3: n = 8 (Sharp cooperativity) -->
      <path d="M 0 0 C 110 0, 130 -10, 140 -70 C 145 -130, 160 -140, 300 -140" fill="none" stroke="#10b981" stroke-width="3" />
      <text x="170" y="-55" fill="#10b981" font-size="10" font-family="monospace">n = 8 (High Coop)</text>
    </g>

    <!-- Bottom Explanation -->
    <rect x="20" y="275" width="405" height="55" fill="#0f172a" stroke="#1e293b" rx="8" />
    <text x="35" y="295" fill="#e2e8f0" font-size="11">In biological cells, multi-subunit allosteric binding yields</text>
    <text x="35" y="313" fill="#94a3b8" font-size="10">ultrasensitive, sigmoidal switch responses resembling step functions.</text>
  </g>

  <!-- Right Graph Card: Discrete Boolean Step Function -->
  <g transform="translate(505, 80)">
    <rect width="445" height="350" fill="url(#panelGrad)" stroke="#1e293b" stroke-width="1.5" rx="12" />
    <text x="25" y="32" fill="#a855f7" font-size="13" font-family="monospace" font-weight="bold">⚡ DISCRETE BOOLEAN OPERATOR IN SILICO</text>
    <text x="25" y="52" fill="#64748b" font-size="11">Output = Gate_AND(inA, inB) ∈ {0, 1}</text>

    <!-- Graph Axes -->
    <g transform="translate(60, 240)">
      <line x1="0" y1="0" x2="330" y2="0" stroke="#475569" stroke-width="2" marker-end="url(#arr-cyan)" />
      <line x1="0" y1="0" x2="0" y2="-160" stroke="#475569" stroke-width="2" marker-end="url(#arr-cyan)" />
      <text x="325" y="20" fill="#94a3b8" font-size="10" font-family="monospace">Input State [inA ∧ inB]</text>
      <text x="-45" y="-155" fill="#94a3b8" font-size="10" font-family="monospace">Digital State</text>
      <text x="-25" y="5" fill="#64748b" font-size="10" font-family="monospace">0 (OFF)</text>
      <text x="-25" y="-140" fill="#64748b" font-size="10" font-family="monospace">1 (ON)</text>
      <line x1="-5" y1="-140" x2="320" y2="-140" stroke="#334155" stroke-dasharray="4,4" />

      <!-- Step Function: Limit n -> infinity -->
      <line x1="140" y1="5" x2="140" y2="-150" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,4" />
      <text x="140" y="20" fill="#f59e0b" font-size="10" font-family="monospace" text-anchor="middle">Step Threshold</text>

      <!-- The Heaviside Step -->
      <line x1="0" y1="0" x2="140" y2="0" stroke="#f43f5e" stroke-width="4" />
      <line x1="140" y1="0" x2="140" y2="-140" stroke="#00e5ff" stroke-width="3" stroke-dasharray="2,2" />
      <line x1="140" y1="-140" x2="310" y2="-140" stroke="#10b981" stroke-width="4" />

      <!-- Circle Nodes on Step -->
      <circle cx="140" cy="0" r="4" fill="#0f172a" stroke="#f43f5e" stroke-width="2" />
      <circle cx="140" cy="-140" r="5" fill="#10b981" stroke="#f8fafc" stroke-width="2" />
      <text x="50" y="-15" fill="#f43f5e" font-size="11" font-family="monospace" font-weight="bold">OFF / 0</text>
      <text x="210" y="-155" fill="#10b981" font-size="11" font-family="monospace" font-weight="bold">ON / 1 (Expressed)</text>
    </g>

    <!-- Bottom Explanation -->
    <rect x="20" y="275" width="405" height="55" fill="#0f172a" stroke="#1e293b" rx="8" />
    <text x="35" y="295" fill="#e2e8f0" font-size="11">Siliquarium models the infinite-cooperativity limit (Heaviside step),</text>
    <text x="35" y="313" fill="#94a3b8" font-size="10">eliminating floating-point noise and enforcing exact Landauer dissipation.</text>
  </g>
</svg>`;
  return out;
}

// ------------------------------------------------------------------------------------------------
// Fig GRN 07: Kauffman NK Criticality Regimes & Edge of Chaos
// ------------------------------------------------------------------------------------------------
function genFigGrn07() {
  const w = 980, h = 480;
  let out = svgHeader(w, h);
  out += `
  <!-- Title Header -->
  <text x="35" y="38" fill="#00e5ff" font-size="16" font-family="monospace" font-weight="bold" letter-spacing="1">FIGURE 7: STUART KAUFFMAN'S CRITICAL CONNECTIVITY (Kc = 2) &amp; THE THREE REGIMES</text>
  <text x="35" y="60" fill="#94a3b8" font-size="12">Phase Space Collapse: Why Multicellular Differentiation Evolves in Under 2,000 Epochs</text>

  <!-- 3 Columns: Frozen, Critical, Chaotic -->
  <!-- Column 1: Frozen (K < 2) -->
  <g transform="translate(30, 85)">
    <rect width="295" height="365" fill="url(#panelGrad)" stroke="#1e293b" stroke-width="1.5" rx="12" />
    <rect width="295" height="32" fill="#0284c7" opacity="0.2" rx="12" />
    <text x="20" y="22" fill="#38bdf8" font-size="12" font-family="monospace" font-weight="bold">🧊 FROZEN REGIME (K &lt; 2)</text>
    
    <text x="20" y="55" fill="#94a3b8" font-size="11">Connectivity: <tspan fill="#f8fafc" font-family="monospace">K = 1</tspan></text>
    <text x="20" y="73" fill="#94a3b8" font-size="11">Derrida Sensitivity: <tspan fill="#38bdf8" font-family="monospace">s &lt; 1</tspan></text>

    <!-- Visual Diagram: Isolated pathways -->
    <rect x="20" y="85" width="255" height="150" fill="#0f172a" stroke="#1e293b" rx="8" />
    <circle cx="50" cy="130" r="14" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
    <text x="50" y="135" fill="#38bdf8" font-size="10" font-family="monospace" text-anchor="middle">A</text>
    <path d="M 64 130 L 120 130" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-cyan)" />
    <circle cx="134" cy="130" r="14" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
    <text x="134" y="135" fill="#38bdf8" font-size="10" font-family="monospace" text-anchor="middle">B</text>
    <path d="M 148 130 L 204 130" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-cyan)" />
    <circle cx="218" cy="130" r="14" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
    <text x="218" y="135" fill="#38bdf8" font-size="10" font-family="monospace" text-anchor="middle">C</text>

    <text x="20" y="260" fill="#f8fafc" font-size="11" font-weight="bold">Behavioral Dynamics:</text>
    <text x="20" y="278" fill="#94a3b8" font-size="10">• Perturbations damp to 0.</text>
    <text x="20" y="294" fill="#94a3b8" font-size="10">• Attractors: 1 single frozen state.</text>
    <text x="20" y="310" fill="#94a3b8" font-size="10">• No memory, no clocks.</text>
    <text x="20" y="330" fill="#f43f5e" font-size="10" font-family="monospace">❌ Cannot adapt to vents</text>
  </g>

  <!-- Column 2: Critical Edge of Chaos (K = 2) - HIGHLIGHTED -->
  <g transform="translate(340, 75)">
    <rect width="300" height="385" fill="#0f172a" stroke="#10b981" stroke-width="2.5" rx="14" filter="url(#glow-cyan)" />
    <rect width="300" height="36" fill="#047857" opacity="0.3" rx="14" />
    <text x="20" y="24" fill="#34d399" font-size="13" font-family="monospace" font-weight="bold">🌟 CRITICAL BOUNDARY (Kc = 2)</text>
    
    <text x="20" y="58" fill="#94a3b8" font-size="11">Connectivity: <tspan fill="#34d399" font-family="monospace" font-weight="bold">K = 2 (Siliquarium)</tspan></text>
    <text x="20" y="76" fill="#94a3b8" font-size="11">Derrida Sensitivity: <tspan fill="#34d399" font-family="monospace" font-weight="bold">s = 2Kp(1-p) = 1.0</tspan></text>

    <!-- Visual Diagram: Dual Input Lattice -->
    <rect x="20" y="88" width="260" height="155" fill="#131c31" stroke="#10b981" stroke-width="1.2" rx="8" />
    
    <!-- Gate Node 1 -->
    <circle cx="70" cy="130" r="16" fill="#10b981" opacity="0.3" />
    <circle cx="70" cy="130" r="14" fill="#0f172a" stroke="#10b981" stroke-width="2" />
    <text x="70" y="134" fill="#34d399" font-size="9" font-family="monospace" text-anchor="middle">AND</text>

    <!-- Gate Node 2 -->
    <circle cx="210" cy="130" r="16" fill="#f43f5e" opacity="0.3" />
    <circle cx="210" cy="130" r="14" fill="#0f172a" stroke="#f43f5e" stroke-width="2" />
    <text x="210" y="134" fill="#fb7185" font-size="9" font-family="monospace" text-anchor="middle">NOT</text>

    <!-- Reciprocal conduits (K=2) -->
    <path d="M 84 122 Q 140 95, 196 122" fill="none" stroke="#00e5ff" stroke-width="2" marker-end="url(#arr-cyan)" />
    <path d="M 196 138 Q 140 165, 84 138" fill="none" stroke="#a855f7" stroke-width="2" marker-end="url(#arr-purple)" />
    <text x="140" y="112" fill="#00e5ff" font-size="8" font-family="monospace" text-anchor="middle">Metabolite M0</text>
    <text x="140" y="160" fill="#a855f7" font-size="8" font-family="monospace" text-anchor="middle">Feedback M1</text>

    <text x="20" y="265" fill="#34d399" font-size="11" font-weight="bold">Behavioral Dynamics:</text>
    <text x="20" y="283" fill="#f8fafc" font-size="10">• Attractors scale as √N ≈ 2 to 4.</text>
    <text x="20" y="299" fill="#f8fafc" font-size="10">• Robust homeostatic canalization.</text>
    <text x="20" y="315" fill="#f8fafc" font-size="10">• Basins span &gt;85% of phase space.</text>
    <text x="20" y="333" fill="#10b981" font-size="11" font-family="monospace" font-weight="bold">✅ INSTANT METAZOAN ROLES!</text>
  </g>

  <!-- Column 3: Chaotic (K > 2) -->
  <g transform="translate(655, 85)">
    <rect width="295" height="365" fill="url(#panelGrad)" stroke="#1e293b" stroke-width="1.5" rx="12" />
    <rect width="295" height="32" fill="#be123c" opacity="0.2" rx="12" />
    <text x="20" y="22" fill="#f43f5e" font-size="12" font-family="monospace" font-weight="bold">🔥 CHAOTIC REGIME (K &gt; 2)</text>
    
    <text x="20" y="55" fill="#94a3b8" font-size="11">Connectivity: <tspan fill="#f8fafc" font-family="monospace">K ≥ 3</tspan></text>
    <text x="20" y="73" fill="#94a3b8" font-size="11">Derrida Sensitivity: <tspan fill="#f43f5e" font-family="monospace">s &gt; 1</tspan></text>

    <!-- Visual Diagram: Dense tangled mesh -->
    <rect x="20" y="85" width="255" height="150" fill="#0f172a" stroke="#1e293b" rx="8" />
    <circle cx="60" cy="115" r="10" fill="#f43f5e" />
    <circle cx="130" cy="100" r="10" fill="#f43f5e" />
    <circle cx="200" cy="120" r="10" fill="#f43f5e" />
    <circle cx="90" cy="170" r="10" fill="#f43f5e" />
    <circle cx="170" cy="180" r="10" fill="#f43f5e" />
    <!-- Tangled lines -->
    <line x1="60" y1="115" x2="130" y2="100" stroke="#f43f5e" stroke-width="1.5" />
    <line x1="130" y1="100" x2="200" y2="120" stroke="#f43f5e" stroke-width="1.5" />
    <line x1="200" y1="120" x2="170" y2="180" stroke="#f43f5e" stroke-width="1.5" />
    <line x1="170" y1="180" x2="90" y2="170" stroke="#f43f5e" stroke-width="1.5" />
    <line x1="90" y1="170" x2="60" y2="115" stroke="#f43f5e" stroke-width="1.5" />
    <line x1="60" y1="115" x2="170" y2="180" stroke="#f43f5e" stroke-width="1" stroke-dasharray="2,2" />
    <line x1="130" y1="100" x2="90" y2="170" stroke="#f43f5e" stroke-width="1" stroke-dasharray="2,2" />

    <text x="20" y="260" fill="#f8fafc" font-size="11" font-weight="bold">Behavioral Dynamics:</text>
    <text x="20" y="278" fill="#94a3b8" font-size="10">• Cycle lengths explode as O(2^N).</text>
    <text x="20" y="294" fill="#94a3b8" font-size="10">• 1-bit flip ruins whole circuit.</text>
    <text x="20" y="310" fill="#94a3b8" font-size="10">• Maximum Landauer waste.</text>
    <text x="20" y="330" fill="#f43f5e" font-size="10" font-family="monospace">❌ Stable life is impossible</text>
  </g>
</svg>`;
  return out;
}

// ------------------------------------------------------------------------------------------------
// Fig GRN 08: Circuit Microscope Gene Regulatory Viewer Layout
// ------------------------------------------------------------------------------------------------
function genFigGrn08() {
  const w = 980, h = 480;
  let out = svgHeader(w, h);
  out += `
  <!-- Title Header -->
  <text x="35" y="38" fill="#00e5ff" font-size="16" font-family="monospace" font-weight="bold" letter-spacing="1">FIGURE 8: THE LIVE CIRCUIT MICROSCOPE GENE REGULATORY VIEWER</text>
  <text x="35" y="60" fill="#94a3b8" font-size="12">Interactive UI Diagnostics: Real-Time Codon Execution, Operon Demarcation, and Metazoan Roles</text>

  <!-- Microscope Window Frame -->
  <g transform="translate(30, 80)">
    <rect width="920" height="375" fill="#0a0f1d" stroke="#00e5ff" stroke-width="1.8" rx="14" filter="url(#glow-cyan)" />
    <rect width="920" height="36" fill="#131c31" rx="14" />
    <circle cx="25" cy="18" r="6" fill="#f43f5e" />
    <circle cx="45" cy="18" r="6" fill="#f59e0b" />
    <circle cx="65" cy="18" r="6" fill="#10b981" />
    <text x="90" y="23" fill="#f8fafc" font-size="12" font-family="monospace" font-weight="bold">🔬 CIRCUIT MICROSCOPE — Pore (q=2, r=-1, z=0) [METAZOAN CLADE #4]</text>

    <!-- Metazoan Role Banner -->
    <rect x="25" y="50" width="870" height="38" fill="#064e3b" stroke="#10b981" stroke-width="1.2" rx="8" />
    <text x="45" y="74" fill="#34d399" font-size="13" font-family="monospace" font-weight="bold">🌟 ACTIVE TISSUE ROLE: 🛡️ SOMATIC SHIELD (Toxin Inverter Node)</text>
    <text x="660" y="74" fill="#a7f3d0" font-size="11" font-family="monospace">Battery: 78.4 mV • Leak: -0.05 T</text>

    <!-- Host Genome Operon -->
    <rect x="25" y="100" width="870" height="120" fill="#0f172a" stroke="#1e293b" rx="10" />
    <text x="40" y="122" fill="#00e5ff" font-size="11" font-family="monospace" font-weight="bold">🧬 HOST GENOME OPERON (60-BIT TAPE, 10 CODONS):</text>

    <!-- Codon Pills Row -->
    <g transform="translate(40, 135)">
      <!-- Codon 1: GATE_AND (Repressed) -->
      <g transform="translate(0, 0)">
        <rect width="76" height="68" fill="#1e1b4b" stroke="#f43f5e" stroke-width="1.5" rx="8" />
        <rect width="76" height="20" fill="#f43f5e" opacity="0.25" rx="8" />
        <text x="38" y="15" fill="#f43f5e" font-size="10" font-family="monospace" font-weight="bold" text-anchor="middle">cypA</text>
        <text x="38" y="38" fill="#f8fafc" font-size="9" font-family="monospace" text-anchor="middle">000000</text>
        <circle cx="38" cy="53" r="5" fill="#f43f5e" />
        <text x="38" y="65" fill="#f43f5e" font-size="7" font-family="monospace" text-anchor="middle">OFF (0)</text>
      </g>

      <!-- Codon 2: GATE_NOT (EXPRESSED) -->
      <g transform="translate(85, 0)">
        <rect width="76" height="68" fill="#064e3b" stroke="#10b981" stroke-width="2" rx="8" />
        <rect width="76" height="20" fill="#10b981" opacity="0.35" rx="8" />
        <text x="38" y="15" fill="#10b981" font-size="10" font-family="monospace" font-weight="bold" text-anchor="middle">inhB</text>
        <text x="38" y="38" fill="#f8fafc" font-size="9" font-family="monospace" text-anchor="middle">001100</text>
        <circle cx="38" cy="53" r="5" fill="#10b981" />
        <text x="38" y="65" fill="#10b981" font-size="7" font-family="monospace" text-anchor="middle">ON (1)</text>
      </g>

      <!-- Codon 3: PORIN_TOXIN -->
      <g transform="translate(170, 0)">
        <rect width="76" height="68" fill="#1e293b" stroke="#00e5ff" stroke-width="1.2" rx="8" />
        <text x="38" y="15" fill="#00e5ff" font-size="10" font-family="monospace" font-weight="bold" text-anchor="middle">oxrB</text>
        <text x="38" y="38" fill="#f8fafc" font-size="9" font-family="monospace" text-anchor="middle">101100</text>
        <text x="38" y="55" fill="#38bdf8" font-size="8" font-family="monospace" text-anchor="middle">PORIN</text>
      </g>

      <!-- Codon 4: SINK_SEPTUM -->
      <g transform="translate(255, 0)">
        <rect width="76" height="68" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2" rx="8" />
        <text x="38" y="15" fill="#f59e0b" font-size="10" font-family="monospace" font-weight="bold" text-anchor="middle">ftsZ</text>
        <text x="38" y="38" fill="#f8fafc" font-size="9" font-family="monospace" text-anchor="middle">110100</text>
        <text x="38" y="55" fill="#fbbf24" font-size="8" font-family="monospace" text-anchor="middle">SEPTUM</text>
      </g>

      <!-- Codon 5: PORIN_A -->
      <g transform="translate(340, 0)">
        <rect width="76" height="68" fill="#1e293b" stroke="#00e5ff" stroke-width="1.2" rx="8" />
        <text x="38" y="15" fill="#00e5ff" font-size="10" font-family="monospace" font-weight="bold" text-anchor="middle">trnS</text>
        <text x="38" y="38" fill="#f8fafc" font-size="9" font-family="monospace" text-anchor="middle">100000</text>
        <text x="38" y="55" fill="#38bdf8" font-size="8" font-family="monospace" text-anchor="middle">FUEL_A</text>
      </g>

      <!-- Codon 6: PORIN_B -->
      <g transform="translate(425, 0)">
        <rect width="76" height="68" fill="#1e293b" stroke="#00e5ff" stroke-width="1.2" rx="8" />
        <text x="38" y="15" fill="#00e5ff" font-size="10" font-family="monospace" font-weight="bold" text-anchor="middle">trnS</text>
        <text x="38" y="38" fill="#f8fafc" font-size="9" font-family="monospace" text-anchor="middle">100110</text>
        <text x="38" y="55" fill="#38bdf8" font-size="8" font-family="monospace" text-anchor="middle">OXID_B</text>
      </g>

      <!-- Codon 7: SINK_BATTERY -->
      <g transform="translate(510, 0)">
        <rect width="76" height="68" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2" rx="8" />
        <text x="38" y="15" fill="#f59e0b" font-size="10" font-family="monospace" font-weight="bold" text-anchor="middle">atpS</text>
        <text x="38" y="38" fill="#f8fafc" font-size="9" font-family="monospace" text-anchor="middle">110010</text>
        <text x="38" y="55" fill="#fbbf24" font-size="8" font-family="monospace" text-anchor="middle">BATTERY</text>
      </g>

      <!-- Codon 8: INTRON -->
      <g transform="translate(595, 0)">
        <rect width="76" height="68" fill="#0f172a" stroke="#475569" stroke-width="1" stroke-dasharray="2,2" rx="8" />
        <text x="38" y="15" fill="#64748b" font-size="10" font-family="monospace" text-anchor="middle">intron</text>
        <text x="38" y="38" fill="#475569" font-size="9" font-family="monospace" text-anchor="middle">111000</text>
        <text x="38" y="55" fill="#475569" font-size="8" font-family="monospace" text-anchor="middle">NEUTRAL</text>
      </g>

      <!-- Codon 9: INTRON -->
      <g transform="translate(680, 0)">
        <rect width="76" height="68" fill="#0f172a" stroke="#475569" stroke-width="1" stroke-dasharray="2,2" rx="8" />
        <text x="38" y="15" fill="#64748b" font-size="10" font-family="monospace" text-anchor="middle">intron</text>
        <text x="38" y="38" fill="#475569" font-size="9" font-family="monospace" text-anchor="middle">111000</text>
        <text x="38" y="55" fill="#475569" font-size="8" font-family="monospace" text-anchor="middle">NEUTRAL</text>
      </g>

      <!-- Codon 10: INTRON -->
      <g transform="translate(765, 0)">
        <rect width="76" height="68" fill="#0f172a" stroke="#475569" stroke-width="1" stroke-dasharray="2,2" rx="8" />
        <text x="38" y="15" fill="#64748b" font-size="10" font-family="monospace" text-anchor="middle">intron</text>
        <text x="38" y="38" fill="#475569" font-size="9" font-family="monospace" text-anchor="middle">111000</text>
        <text x="38" y="55" fill="#475569" font-size="8" font-family="monospace" text-anchor="middle">NEUTRAL</text>
      </g>
    </g>

    <!-- Symbiont Endosymbiotic Cassette Operon (Chimerococcus) -->
    <rect x="25" y="235" width="870" height="110" fill="#1e112a" stroke="#a855f7" stroke-width="1.2" rx="10" />
    <text x="40" y="258" fill="#c084fc" font-size="11" font-family="monospace" font-weight="bold">🟣 ENDOSYMBIONT CASSETTE (Chimerococcus margulisiae — Specimen 08):</text>
    <text x="640" y="258" fill="#e9d5ff" font-size="10" font-family="monospace">Vertical Maternal Inheritance • Lysis on Death</text>

    <!-- Symbiont Pills Row -->
    <g transform="translate(40, 270)">
      <g transform="translate(0, 0)">
        <rect width="90" height="55" fill="#064e3b" stroke="#10b981" stroke-width="2" rx="6" />
        <text x="45" y="15" fill="#10b981" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">symA (AND)</text>
        <text x="45" y="32" fill="#f8fafc" font-size="8" font-family="monospace" text-anchor="middle">000000</text>
        <text x="45" y="46" fill="#34d399" font-size="8" font-family="monospace" font-weight="bold" text-anchor="middle">🟢 SUBSIDY +2T</text>
      </g>

      <g transform="translate(105, 0)">
        <rect width="90" height="55" fill="#1e293b" stroke="#a855f7" stroke-width="1.2" rx="6" />
        <text x="45" y="15" fill="#c084fc" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">trnS (Fuel A)</text>
        <text x="45" y="32" fill="#f8fafc" font-size="8" font-family="monospace" text-anchor="middle">100000</text>
        <text x="45" y="46" fill="#a855f7" font-size="8" font-family="monospace" text-anchor="middle">PORIN_A</text>
      </g>

      <g transform="translate(210, 0)">
        <rect width="90" height="55" fill="#1e293b" stroke="#a855f7" stroke-width="1.2" rx="6" />
        <text x="45" y="15" fill="#c084fc" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">trnS (Oxid B)</text>
        <text x="45" y="32" fill="#f8fafc" font-size="8" font-family="monospace" text-anchor="middle">100110</text>
        <text x="45" y="46" fill="#a855f7" font-size="8" font-family="monospace" text-anchor="middle">PORIN_B</text>
      </g>

      <g transform="translate(315, 0)">
        <rect width="90" height="55" fill="#1e293b" stroke="#f59e0b" stroke-width="1.2" rx="6" />
        <text x="45" y="15" fill="#f59e0b" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">atpS (Transloc)</text>
        <text x="45" y="32" fill="#f8fafc" font-size="8" font-family="monospace" text-anchor="middle">110010</text>
        <text x="45" y="46" fill="#f59e0b" font-size="8" font-family="monospace" text-anchor="middle">PMF CHARGE</text>
      </g>

      <!-- Symbiont Status Info Box -->
      <g transform="translate(420, 0)">
        <rect width="365" height="55" fill="#0f172a" stroke="#6b21a8" stroke-width="1" rx="6" />
        <text x="15" y="20" fill="#e9d5ff" font-size="10" font-family="monospace">Organelle mutates during host cytokinesis.</text>
        <text x="15" y="35" fill="#c084fc" font-size="9" font-family="monospace">If host dies (E ≤ 0), organelle lyses simultaneously.</text>
        <text x="15" y="48" fill="#10b981" font-size="9" font-family="monospace">Matter tokens (M) deposit into detritus carcass pool.</text>
      </g>
    </g>
  </g>
</svg>`;
  return out;
}

fs.writeFileSync(path.join(outDir, 'fig_grn_05_biological_vs_digital_homology.svg'), genFigGrn05(), 'utf8');
console.log('✓ Generated: docs/assets/diagrams/fig_grn_05_biological_vs_digital_homology.svg');

fs.writeFileSync(path.join(outDir, 'fig_grn_06_hill_kinetics_vs_boolean.svg'), genFigGrn06(), 'utf8');
console.log('✓ Generated: docs/assets/diagrams/fig_grn_06_hill_kinetics_vs_boolean.svg');

fs.writeFileSync(path.join(outDir, 'fig_grn_07_kauffman_criticality_regimes.svg'), genFigGrn07(), 'utf8');
console.log('✓ Generated: docs/assets/diagrams/fig_grn_07_kauffman_criticality_regimes.svg');

fs.writeFileSync(path.join(outDir, 'fig_grn_08_microscope_gene_viewer.svg'), genFigGrn08(), 'utf8');
console.log('✓ Generated: docs/assets/diagrams/fig_grn_08_microscope_gene_viewer.svg');

console.log('🎉 ALL 4 NEW GRN SVGS GENERATED SUCCESSFULLY!');
