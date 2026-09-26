#!/usr/bin/env node

/**
 * 🎨 Siliquarium Enterprise Diagram Generator
 * Generates ultra-crisp, dark-themed, publication-grade SVG diagrams
 * replacing all ASCII art across the Siliquarium documentation suite.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const diagramsDir = path.join(rootDir, 'docs', 'assets', 'diagrams');

fs.mkdirSync(diagramsDir, { recursive: true });

function svgWrapper(width, height, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" class="w-full h-auto font-sans">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="panelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0c1222" />
      <stop offset="100%" stop-color="#070a14" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#131c31" />
      <stop offset="100%" stop-color="#0a0f1d" />
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00e5ff" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>
    <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e" />
      <stop offset="100%" stop-color="#be123c" />
    </linearGradient>
    <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
    <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a855f7" />
      <stop offset="100%" stop-color="#6b21a8" />
    </linearGradient>

    <!-- Arrow Markers -->
    <marker id="arrow-cyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#00e5ff" />
    </marker>
    <marker id="arrow-emerald" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
    </marker>
    <marker id="arrow-rose" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#f43f5e" />
    </marker>
    <marker id="arrow-amber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
    </marker>
    <marker id="arrow-purple" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#a855f7" />
    </marker>
    <marker id="arrow-slate" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
    </marker>

    <!-- Glow Filters -->
    <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <style>
    .title { font-family: 'Cascadia Code', Consolas, monospace; font-size: 15px; font-weight: bold; fill: #f8fafc; }
    .subtitle { font-family: 'Inter', system-ui, sans-serif; font-size: 11.5px; fill: #94a3b8; }
    .label { font-family: 'Inter', system-ui, sans-serif; font-size: 11px; fill: #cbd5e1; }
    .label-bold { font-family: 'Inter', system-ui, sans-serif; font-size: 11.5px; font-weight: bold; fill: #f8fafc; }
    .code { font-family: 'Cascadia Code', Consolas, monospace; font-size: 10.5px; fill: #00e5ff; }
    .badge { font-family: 'Cascadia Code', Consolas, monospace; font-size: 9.5px; font-weight: bold; }
  </style>

  <!-- Canvas Background -->
  <rect width="${width}" height="${height}" rx="16" fill="url(#panelGrad)" stroke="#1e293b" stroke-width="1.5" />

  ${content}
</svg>`;
}

// 1. DILUTION CATASTROPHE VS HYDROTHERMAL FOAM
const fig1_1 = svgWrapper(880, 360, `
  <!-- Header -->
  <g transform="translate(30, 35)">
    <text class="title">Figure 1.1: The Dilution Catastrophe vs. Alkaline Hydrothermal Micro-Pores</text>
    <text y="20" class="subtitle">Why open-ocean abiogenesis is thermodynamically impossible without inorganic micro-compartmentation</text>
  </g>

  <!-- Left: Open Ocean -->
  <g transform="translate(40, 75)">
    <rect width="380" height="250" rx="12" fill="#090d16" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4 2" />
    <rect x="15" y="15" width="130" height="24" rx="6" fill="#4c0519" stroke="#f43f5e" stroke-width="1" />
    <text x="25" y="31" class="badge" fill="#fecdd3">OPEN HADEAN OCEAN</text>
    <text x="155" y="31" class="label" fill="#f43f5e">Dilution Catastrophe</text>

    <!-- Drifting Monomers in open water -->
    <circle cx="80" cy="110" r="14" fill="#0284c7" opacity="0.3" />
    <circle cx="80" cy="110" r="8" fill="#38bdf8" />
    <text x="76" y="114" class="code" fill="#000" font-weight="bold">A</text>
    <path d="M 95 105 Q 140 80 180 95" stroke="#38bdf8" stroke-width="1.5" fill="none" stroke-dasharray="3 3" marker-end="url(#arrow-cyan)" />
    <text x="190" y="100" class="subtitle" font-size="10">Drifts into infinity</text>

    <circle cx="300" cy="190" r="14" fill="#10b981" opacity="0.3" />
    <circle cx="300" cy="190" r="8" fill="#4ade80" />
    <text x="296" y="194" class="code" fill="#000" font-weight="bold">B</text>
    <path d="M 285 190 Q 230 220 180 200" stroke="#4ade80" stroke-width="1.5" fill="none" stroke-dasharray="3 3" marker-end="url(#arrow-emerald)" />

    <!-- Math Callout -->
    <rect x="25" y="160" width="220" height="60" rx="8" fill="#1e101a" stroke="#881337" stroke-width="1" />
    <text x="35" y="180" class="code" fill="#f43f5e">[A] → 0,  [B] → 0</text>
    <text x="35" y="198" class="label" font-size="10.5">Reaction Rate: v = k · [A][B] = 0</text>
    <text x="35" y="212" class="subtitle" font-size="9.5">Molecules never meet; free energy lost!</text>

    <rect x="25" y="225" width="330" height="15" fill="none" />
    <text x="190" y="238" class="label" text-anchor="middle" fill="#fda4af">Entropy disperses organic polymers before replication</text>
  </g>

  <!-- Right: Alkaline Vent Micro-Pores -->
  <g transform="translate(460, 75)">
    <rect width="380" height="250" rx="12" fill="#090d16" stroke="#00e5ff" stroke-width="1.5" />
    <rect x="15" y="15" width="165" height="24" rx="6" fill="#083344" stroke="#00e5ff" stroke-width="1" />
    <text x="25" y="31" class="badge" fill="#bae6fd">HYDROTHERMAL FOAM</text>
    <text x="190" y="31" class="label" fill="#00e5ff">Basalt Micro-Pores</text>

    <!-- Mineral honeycomb micro-cavities -->
    <polygon points="120,80 160,80 180,115 160,150 120,150 100,115" fill="#132238" stroke="#38bdf8" stroke-width="1.5" />
    <polygon points="180,115 220,115 240,150 220,185 180,185 160,150" fill="#132238" stroke="#38bdf8" stroke-width="1.5" />
    <polygon points="120,150 160,150 180,185 160,220 120,220 100,185" fill="#0f2942" stroke="#00e5ff" stroke-width="2" filter="url(#glow-cyan)" />

    <!-- Trapped and concentrated reactants -->
    <circle cx="135" cy="180" r="7" fill="#38bdf8" />
    <text x="132" y="184" class="code" fill="#000" font-weight="bold" font-size="9">A</text>
    <circle cx="150" cy="180" r="7" fill="#4ade80" />
    <text x="147" y="184" class="code" fill="#000" font-weight="bold" font-size="9">B</text>

    <!-- Reaction spark -->
    <polygon points="142,168 145,174 151,175 146,179 148,185 142,181 137,185 139,179 134,175 140,174" fill="#facc15" />

    <!-- Features -->
    <g transform="translate(210, 85)">
      <text class="label-bold" fill="#38bdf8">Nature's First Cell Walls</text>
      <text y="18" class="label" font-size="10.5">• Pore diameter: 10 – 50 μm</text>
      <text y="34" class="label" font-size="10.5">• FeS / silica inorganic walls</text>
      <text y="50" class="label" font-size="10.5">• Thermal siphoning concentration</text>
      <rect x="0" y="65" width="150" height="50" rx="6" fill="#042f2e" stroke="#10b981" stroke-width="1" />
      <text x="10" y="85" class="code" fill="#4ade80">CONCENTRATION: > 1,000,000×</text>
      <text x="10" y="102" class="subtitle" font-size="10">Reaction cascades spark!</text>
    </g>

    <text x="190" y="238" class="label" text-anchor="middle" fill="#67e8f9">Trapped in basalt foam, prebiotic enzymes replicate autopoietically</text>
  </g>
`);

// 2. HYDROTHERMAL CHIMNEY CROSS SECTION & MITCHELL PMF
const fig1_2 = svgWrapper(880, 420, `
  <g transform="translate(30, 35)">
    <text class="title">Figure 1.2: Geochemical Anatomy of the Alkaline Hydrothermal Chimney</text>
    <text y="20" class="subtitle">Cross-section of the inorganic membrane: The natural Mitchell-Russell Proton Motive Force (PMF)</text>
  </g>

  <!-- Ocean Reservoir (Acidic, Cold) -->
  <g transform="translate(40, 75)">
    <rect width="800" height="85" rx="8" fill="#0c1f36" stroke="#0284c7" stroke-width="1.5" />
    <rect x="15" y="12" width="220" height="22" rx="4" fill="#075985" />
    <text x="25" y="27" class="badge" fill="#e0f2fe">COLD ACIDIC OCEAN RESERVOIR</text>
    <text x="250" y="27" class="code" fill="#38bdf8">pH ≈ 5.5 | T ≈ 2°C | Saturated with CO2</text>

    <!-- High H+ concentration -->
    <g transform="translate(40, 48)">
      <circle cx="20" cy="15" r="10" fill="#38bdf8" /> <text x="15" y="19" class="code" fill="#000" font-weight="bold">H⁺</text>
      <circle cx="80" cy="18" r="10" fill="#38bdf8" /> <text x="75" y="22" class="code" fill="#000" font-weight="bold">H⁺</text>
      <circle cx="160" cy="12" r="10" fill="#38bdf8" /> <text x="155" y="16" class="code" fill="#000" font-weight="bold">H⁺</text>
      <circle cx="240" cy="20" r="10" fill="#38bdf8" /> <text x="235" y="24" class="code" fill="#000" font-weight="bold">H⁺</text>
      <circle cx="340" cy="14" r="10" fill="#38bdf8" /> <text x="335" y="18" class="code" fill="#000" font-weight="bold">H⁺</text>
      <circle cx="450" cy="18" r="10" fill="#38bdf8" /> <text x="445" y="22" class="code" fill="#000" font-weight="bold">H⁺</text>
      <circle cx="560" cy="13" r="10" fill="#38bdf8" /> <text x="555" y="17" class="code" fill="#000" font-weight="bold">H⁺</text>
      <circle cx="680" cy="16" r="10" fill="#38bdf8" /> <text x="675" y="20" class="code" fill="#000" font-weight="bold">H⁺</text>
    </g>
  </g>

  <!-- Inorganic Thin Mineral Wall (Membrane) -->
  <g transform="translate(40, 165)">
    <rect width="800" height="90" rx="6" fill="#1e1b18" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6 3" />
    <rect x="15" y="10" width="270" height="22" rx="4" fill="#78350f" />
    <text x="25" y="25" class="badge" fill="#fef3c7">INORGANIC MINERAL MEMBRANE (FeS)</text>
    <text x="300" y="25" class="label" fill="#fde68a">Thickness d ≈ 5 – 10 nm  |  Dielectric Capacitance: C = ε(A/d)</text>

    <!-- Proton flux channels -->
    <path d="M 150 0 L 150 90" stroke="#00e5ff" stroke-width="3" stroke-dasharray="4 2" marker-end="url(#arrow-cyan)" filter="url(#glow-cyan)" />
    <path d="M 380 0 L 380 90" stroke="#00e5ff" stroke-width="3" stroke-dasharray="4 2" marker-end="url(#arrow-cyan)" filter="url(#glow-cyan)" />
    <path d="M 620 0 L 620 90" stroke="#00e5ff" stroke-width="3" stroke-dasharray="4 2" marker-end="url(#arrow-cyan)" filter="url(#glow-cyan)" />

    <!-- Center Callout Pill -->
    <rect x="220" y="42" width="360" height="38" rx="8" fill="#090d16" stroke="#00e5ff" stroke-width="1.5" />
    <text x="400" y="58" class="code" text-anchor="middle" fill="#00e5ff">ΔpH = 10.0 - 5.5 = 4.5 units</text>
    <text x="400" y="72" class="label" text-anchor="middle" fill="#f8fafc">Natural PMF: Δp ≈ 200 mV  |  Field Strength: 40 Million Volts/m!</text>
  </g>

  <!-- Alkaline Vent Fluid Reservoir (Warm) -->
  <g transform="translate(40, 260)">
    <rect width="800" height="85" rx="8" fill="#1e180d" stroke="#d97706" stroke-width="1.5" />
    <rect x="15" y="12" width="220" height="22" rx="4" fill="#92400e" />
    <text x="25" y="27" class="badge" fill="#ffedd5">WARM ALKALINE VENT FLUID</text>
    <text x="250" y="27" class="code" fill="#f59e0b">pH ≈ 10.0 | T ≈ 65°C | Saturated with H2 & CH4</text>

    <!-- High OH- concentration & Electron donors -->
    <g transform="translate(40, 48)">
      <circle cx="30" cy="15" r="10" fill="#f59e0b" /> <text x="21" y="19" class="code" fill="#000" font-weight="bold">OH⁻</text>
      <circle cx="120" cy="18" r="10" fill="#f59e0b" /> <text x="111" y="22" class="code" fill="#000" font-weight="bold">OH⁻</text>
      <circle cx="210" cy="12" r="10" fill="#f59e0b" /> <text x="201" y="16" class="code" fill="#000" font-weight="bold">OH⁻</text>
      <circle cx="330" cy="20" r="10" fill="#f59e0b" /> <text x="321" y="24" class="code" fill="#000" font-weight="bold">OH⁻</text>
      <circle cx="460" cy="14" r="10" fill="#f59e0b" /> <text x="451" y="18" class="code" fill="#000" font-weight="bold">OH⁻</text>
      <circle cx="580" cy="18" r="10" fill="#f59e0b" /> <text x="571" y="22" class="code" fill="#000" font-weight="bold">OH⁻</text>
      <circle cx="700" cy="13" r="10" fill="#f59e0b" /> <text x="691" y="17" class="code" fill="#000" font-weight="bold">OH⁻</text>
    </g>
  </g>

  <!-- Footer Insight Bar -->
  <g transform="translate(40, 360)">
    <rect width="800" height="40" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1" />
    <text x="400" y="25" class="label" text-anchor="middle" fill="#cbd5e1">
      💡 <strong style="fill:#38bdf8;">Peter Mitchell (1961) &amp; Russell-Hall (1997):</strong> Life did not invent the electrical battery; life was born inside a geological battery.
    </text>
  </g>
`);

// 3. THE EPISTEMIC CUT: GENOME SAFE VS PORE WORKSHOP
const fig1_3 = svgWrapper(880, 380, `
  <g transform="translate(30, 35)">
    <text class="title">Figure 1.3: Howard Pattee's Epistemic Cut &amp; Von Neumann's Architecture</text>
    <text y="20" class="subtitle">The physical partition between rate-independent symbolic tapes and rate-dependent catalytic dynamics</text>
  </g>

  <!-- Left: The Safe (Genotype / Symbolic Memory) -->
  <g transform="translate(40, 75)">
    <rect width="370" height="270" rx="12" fill="#081528" stroke="#0284c7" stroke-width="2" />
    <rect x="20" y="15" width="160" height="24" rx="6" fill="#075985" stroke="#38bdf8" stroke-width="1" />
    <text x="30" y="31" class="badge" fill="#e0f2fe">THE SAFE (GENOME)</text>
    <text x="190" y="31" class="code" fill="#38bdf8">GenomeSafe.ts</text>

    <!-- Subtitle -->
    <text x="20" y="65" class="label-bold" fill="#7dd3fc">Rate-Independent Symbolic Tape</text>
    <text x="20" y="82" class="subtitle">• Quiescent 60-bit binary polymer</text>
    <text x="20" y="98" class="subtitle">• Conducts ZERO electricity; burns ZERO power</text>
    <text x="20" y="114" class="subtitle">• Immune to thermal execution noise</text>

    <!-- 1D Tape Visual -->
    <g transform="translate(20, 130)">
      <rect width="330" height="40" rx="6" fill="#030712" stroke="#0ea5e9" stroke-width="1.5" />
      <g transform="translate(10, 8)" class="code" font-size="13" font-weight="bold">
        <rect x="0" y="0" width="28" height="24" rx="4" fill="#0c4a6e" /><text x="8" y="17" fill="#38bdf8">0</text>
        <rect x="32" y="0" width="28" height="24" rx="4" fill="#0c4a6e" /><text x="40" y="17" fill="#38bdf8">1</text>
        <rect x="64" y="0" width="28" height="24" rx="4" fill="#047857" /><text x="72" y="17" fill="#4ade80">1</text>
        <rect x="96" y="0" width="28" height="24" rx="4" fill="#047857" /><text x="104" y="17" fill="#4ade80">0</text>
        <rect x="128" y="0" width="28" height="24" rx="4" fill="#9f1239" /><text x="136" y="17" fill="#fb7185">1</text>
        <rect x="160" y="0" width="28" height="24" rx="4" fill="#9f1239" /><text x="168" y="17" fill="#fb7185">1</text>
        <text x="205" y="17" fill="#64748b" font-size="14">... 60 bits</text>
      </g>
    </g>

    <!-- Safe to Safe Replication Arrow -->
    <path d="M 185 180 L 185 220" stroke="#00e5ff" stroke-width="2" marker-end="url(#arrow-cyan)" />
    <rect x="70" y="225" width="230" height="30" rx="6" fill="#0f172a" stroke="#0284c7" stroke-width="1" />
    <text x="185" y="244" class="code" text-anchor="middle" font-size="10" fill="#38bdf8">Blind Photocopy (μ = 0.001)</text>
  </g>

  <!-- The Epistemic Cut Wall -->
  <g transform="translate(425, 75)">
    <line x1="15" y1="20" x2="15" y2="250" stroke="#f43f5e" stroke-width="3" stroke-dasharray="6 4" filter="url(#glow-emerald)" />
    <rect x="0" y="115" width="30" height="60" rx="4" fill="#881337" stroke="#f43f5e" stroke-width="1" />
    <text x="15" y="138" class="badge" text-anchor="middle" fill="#fecdd3" transform="rotate(-90 15 138)">EPISTEMIC CUT</text>
  </g>

  <!-- Right: The Workshop (Phenotype / Continuous Dynamic Machine) -->
  <g transform="translate(470, 75)">
    <rect width="370" height="270" rx="12" fill="#1c0f18" stroke="#e11d48" stroke-width="2" />
    <rect x="20" y="15" width="180" height="24" rx="6" fill="#881337" stroke="#fb7185" stroke-width="1" />
    <text x="30" y="31" class="badge" fill="#ffe4e6">THE WORKSHOP (PHENOTYPE)</text>
    <text x="215" y="31" class="code" fill="#fb7185">PoreWorkshop.ts</text>

    <!-- Subtitle -->
    <text x="20" y="65" class="label-bold" fill="#fda4af">Rate-Dependent Physical Dynamics</text>
    <text x="20" y="82" class="subtitle">• Active 2D CMOS logic gate netlist</text>
    <text x="20" y="98" class="subtitle">• Switches voltages; burns Landauer heat</text>
    <text x="20" y="114" class="subtitle">• Governed by differential equations &amp; fluxes</text>

    <!-- Active Netlist Visual -->
    <g transform="translate(20, 130)">
      <rect width="330" height="75" rx="6" fill="#030712" stroke="#f43f5e" stroke-width="1.5" />
      
      <!-- Logic Gates -->
      <g transform="translate(15, 15)">
        <rect x="0" y="8" width="55" height="30" rx="4" fill="#0369a1" stroke="#38bdf8" />
        <text x="12" y="28" class="code" fill="#fff" font-weight="bold">AND</text>

        <path d="M 55 23 L 95 23" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arrow-cyan)" />

        <rect x="95" y="8" width="55" height="30" rx="4" fill="#be123c" stroke="#f43f5e" />
        <text x="107" y="28" class="code" fill="#fff" font-weight="bold">NOT</text>

        <path d="M 150 23 L 190 23" stroke="#f43f5e" stroke-width="1.5" marker-end="url(#arrow-rose)" />

        <rect x="190" y="8" width="55" height="30" rx="4" fill="#047857" stroke="#10b981" />
        <text x="205" y="28" class="code" fill="#fff" font-weight="bold">OR</text>

        <path d="M 245 23 L 285 23" stroke="#10b981" stroke-width="1.5" marker-end="url(#arrow-emerald)" />
      </g>
    </g>

    <!-- Dynamic Metabolic Charging -->
    <rect x="40" y="225" width="290" height="30" rx="6" fill="#0f172a" stroke="#e11d48" stroke-width="1" />
    <text x="185" y="244" class="code" text-anchor="middle" font-size="10" fill="#fb7185">Charges Pore Battery (+2T) / Burns Leak (-1T)</text>
  </g>
`);

// 4. THE THREE PRIMITIVE ENZYMES & THE COMPOSITE XOR MOTIF
const fig2_1 = svgWrapper(880, 430, `
  <g transform="translate(30, 35)">
    <text class="title">Figure 2.1: The Three Primitive Catalytic Enzymes vs. The Composite XOR Motif</text>
    <text y="20" class="subtitle">Single-site active biophysics vs. why exclusive-OR requires an evolved multi-gene regulatory network</text>
  </g>

  <!-- 1. AND Gate (Co-substrate) -->
  <g transform="translate(40, 75)">
    <rect width="250" height="180" rx="10" fill="#0b1728" stroke="#38bdf8" stroke-width="1.5" />
    <rect x="12" y="12" width="90" height="20" rx="4" fill="#0369a1" />
    <text x="20" y="26" class="badge" fill="#e0f2fe">GATE_AND</text>
    <text x="110" y="26" class="label-bold" fill="#38bdf8">Co-Catalyst</text>

    <!-- Active site with 2 adjacent pockets -->
    <rect x="35" y="55" width="70" height="60" rx="6" fill="#132a4a" stroke="#0ea5e9" stroke-width="1" />
    <text x="45" y="80" class="code" font-size="10" fill="#38bdf8">Pocket A</text>
    <text x="45" y="100" class="subtitle" font-size="9">Substrate A</text>

    <rect x="115" y="55" width="70" height="60" rx="6" fill="#132a4a" stroke="#0ea5e9" stroke-width="1" />
    <text x="125" y="80" class="code" font-size="10" fill="#38bdf8">Pocket B</text>
    <text x="125" y="100" class="subtitle" font-size="9">Substrate B</text>

    <!-- Catalysis output -->
    <path d="M 110 115 L 110 145" stroke="#facc15" stroke-width="2.5" marker-end="url(#arrow-amber)" />
    <text x="125" y="160" class="label-bold" fill="#facc15">Fires only if A ∧ B!</text>
  </g>

  <!-- 2. OR Gate (Promiscuous) -->
  <g transform="translate(315, 75)">
    <rect width="250" height="180" rx="10" fill="#091f1a" stroke="#10b981" stroke-width="1.5" />
    <rect x="12" y="12" width="80" height="20" rx="4" fill="#047857" />
    <text x="20" y="26" class="badge" fill="#d1fae5">GATE_OR</text>
    <text x="100" y="26" class="label-bold" fill="#10b981">Promiscuous</text>

    <!-- Single flexible pocket accommodating either -->
    <rect x="65" y="55" width="120" height="60" rx="8" fill="#113e33" stroke="#059669" stroke-width="1" />
    <text x="80" y="80" class="code" font-size="10" fill="#4ade80">Dual P-Site</text>
    <text x="80" y="98" class="subtitle" font-size="9">Binds either A or B</text>

    <!-- Catalysis output -->
    <path d="M 125 115 L 125 145" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrow-emerald)" />
    <text x="125" y="160" class="label-bold" text-anchor="middle" fill="#4ade80">Fires if A ∨ B!</text>
  </g>

  <!-- 3. NOT Gate (Allosteric Repressor) -->
  <g transform="translate(590, 75)">
    <rect width="250" height="180" rx="10" fill="#200d17" stroke="#f43f5e" stroke-width="1.5" />
    <rect x="12" y="12" width="85" height="20" rx="4" fill="#be123c" />
    <text x="20" y="26" class="badge" fill="#ffe4e6">GATE_NOT</text>
    <text x="105" y="26" class="label-bold" fill="#f43f5e">Inhibitor</text>

    <!-- Active pocket + Allosteric pocket -->
    <rect x="35" y="55" width="70" height="60" rx="6" fill="#3b1123" stroke="#e11d48" stroke-width="1" />
    <text x="45" y="80" class="code" font-size="10" fill="#fb7185">Catalytic</text>
    <text x="50" y="98" class="subtitle" font-size="9">Site</text>

    <rect x="115" y="55" width="75" height="60" rx="6" fill="#4c0519" stroke="#f43f5e" stroke-width="1" />
    <text x="120" y="80" class="code" font-size="10" fill="#fda4af">Allosteric</text>
    <text x="120" y="98" class="subtitle" font-size="9">Toxin T blocks</text>

    <!-- Quenched output -->
    <line x1="70" y1="120" x2="110" y2="150" stroke="#f43f5e" stroke-width="2.5" />
    <line x1="110" y1="120" x2="70" y2="150" stroke="#f43f5e" stroke-width="2.5" />
    <text x="125" y="160" class="label-bold" text-anchor="middle" fill="#fda4af">Toxin Quenches (¬T)</text>
  </g>

  <!-- Lower Panel: Why XOR is Composite -->
  <g transform="translate(40, 270)">
    <rect width="800" height="135" rx="12" fill="#090d16" stroke="#a855f7" stroke-width="1.5" />
    <rect x="15" y="12" width="310" height="22" rx="4" fill="#581c87" />
    <text x="25" y="27" class="badge" fill="#f3e8ff">XOR IS STRICTLY NON-PRIMITIVE</text>
    <text x="340" y="27" class="code" fill="#c084fc">(A ⊕ B) ≡ (A ∨ B) ∧ ¬(A ∧ B)</text>

    <!-- Diagram of 3-gate composite circuit -->
    <g transform="translate(30, 45)">
      <!-- Inputs A and B -->
      <text x="0" y="22" class="code" fill="#38bdf8">Stream A ──┬──►</text>
      <text x="0" y="55" class="code" fill="#38bdf8">Stream B ──┼──►</text>

      <!-- Gate 1: OR -->
      <rect x="120" y="8" width="55" height="26" rx="4" fill="#047857" stroke="#10b981" />
      <text x="135" y="25" class="code" fill="#fff" font-weight="bold">OR</text>

      <!-- Gate 2: AND -->
      <rect x="120" y="42" width="55" height="26" rx="4" fill="#0369a1" stroke="#38bdf8" />
      <text x="131" y="59" class="code" fill="#fff" font-weight="bold">AND</text>

      <!-- Gate 3: NOT -->
      <path d="M 175 55 L 205 55" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arrow-cyan)" />
      <rect x="205" y="42" width="55" height="26" rx="4" fill="#be123c" stroke="#f43f5e" />
      <text x="217" y="59" class="code" fill="#fff" font-weight="bold">NOT</text>

      <!-- Conjunction Gate 4: Final AND -->
      <path d="M 175 21 L 285 21 L 285 35" stroke="#10b981" stroke-width="1.5" />
      <path d="M 260 55 L 285 55 L 285 45" stroke="#f43f5e" stroke-width="1.5" />
      <rect x="295" y="25" width="60" height="28" rx="4" fill="#0369a1" stroke="#38bdf8" />
      <text x="307" y="43" class="code" fill="#fff" font-weight="bold">AND</text>

      <!-- Output wire -->
      <path d="M 355 39 L 410 39" stroke="#c084fc" stroke-width="2.5" marker-end="url(#arrow-purple)" />
      <text x="420" y="43" class="label-bold" fill="#c084fc">Output (A XOR B)</text>
    </g>

    <!-- Side Explanation Box -->
    <rect x="540" y="45" width="240" height="75" rx="6" fill="#190e24" stroke="#7e22ce" stroke-width="1" />
    <text x="550" y="65" class="label-bold" fill="#e9d5ff">Minsky &amp; Papert Barrier (1969)</text>
    <text x="550" y="82" class="subtitle" font-size="10">XOR is linearly non-separable.</text>
    <text x="550" y="96" class="subtitle" font-size="10">No single protein pocket can execute XOR.</text>
    <text x="550" y="110" class="label" font-size="9.5" fill="#facc15">★ Discovered via gene duplication!</text>
  </g>
`);

// 5. URI ALON CANONICAL SYSTEMS BIOLOGY NETWORK MOTIFS
const fig3_1 = svgWrapper(880, 420, `
  <g transform="translate(30, 35)">
    <text class="title">Figure 3.1: Canonical Network Motifs of Systems Biology (Uri Alon, 2007)</text>
    <text y="20" class="subtitle">The fundamental circuit building blocks discovered de novo by natural selection in deep-sea silicoids</text>
  </g>

  <!-- 1. Bistable Toggle Switch (Memory Latch) -->
  <g transform="translate(40, 75)">
    <rect width="380" height="155" rx="10" fill="#0c1726" stroke="#38bdf8" stroke-width="1.5" />
    <rect x="15" y="12" width="200" height="22" rx="4" fill="#0369a1" />
    <text x="25" y="27" class="badge" fill="#e0f2fe">BISTABLE TOGGLE SWITCH</text>
    <text x="225" y="27" class="label" fill="#38bdf8">Digestive Memory</text>

    <!-- Gates with cross-coupling wires -->
    <g transform="translate(25, 48)">
      <rect x="0" y="10" width="70" height="32" rx="4" fill="#075985" stroke="#38bdf8" />
      <text x="18" y="31" class="code" fill="#fff" font-weight="bold">NOR 1</text>

      <rect x="0" y="60" width="70" height="32" rx="4" fill="#075985" stroke="#38bdf8" />
      <text x="18" y="81" class="code" fill="#fff" font-weight="bold">NOR 2</text>

      <!-- Cross feedback -->
      <path d="M 70 26 L 100 26 L 100 70 L 0 70" stroke="#00e5ff" stroke-width="1.5" fill="none" marker-end="url(#arrow-cyan)" />
      <path d="M 70 76 L 120 76 L 120 36 L 0 36" stroke="#00e5ff" stroke-width="1.5" fill="none" marker-end="url(#arrow-cyan)" />

      <!-- State persistence callout -->
      <g transform="translate(140, 15)">
        <text class="label-bold" fill="#7dd3fc">Hysteresis &amp; Memory</text>
        <text y="18" class="subtitle" font-size="10.5">• Traps nutrient pulse state</text>
        <text y="34" class="subtitle" font-size="10.5">• Retains charge when input = 0</text>
        <text y="50" class="label" font-size="10" fill="#38bdf8">★ Gardner &amp; Collins (2000)</text>
      </g>
    </g>
  </g>

  <!-- 2. The Repressilator (Ring Oscillator) -->
  <g transform="translate(460, 75)">
    <rect width="380" height="155" rx="10" fill="#200d17" stroke="#f43f5e" stroke-width="1.5" />
    <rect x="15" y="12" width="180" height="22" rx="4" fill="#9f1239" />
    <text x="25" y="27" class="badge" fill="#ffe4e6">THE REPRESSILATOR</text>
    <text x="205" y="27" class="label" fill="#fb7185">Autonomous Clock</text>

    <!-- Ring of 3 inverters -->
    <g transform="translate(25, 48)">
      <rect x="20" y="15" width="55" height="28" rx="4" fill="#881337" stroke="#f43f5e" />
      <text x="28" y="33" class="code" fill="#fff" font-weight="bold">NOT A</text>

      <path d="M 75 29 L 115 29" stroke="#f43f5e" stroke-width="1.5" marker-end="url(#arrow-rose)" />

      <rect x="115" y="15" width="55" height="28" rx="4" fill="#881337" stroke="#f43f5e" />
      <text x="123" y="33" class="code" fill="#fff" font-weight="bold">NOT B</text>

      <path d="M 142 43 L 142 75 L 75 75" stroke="#f43f5e" stroke-width="1.5" marker-end="url(#arrow-rose)" />

      <rect x="20" y="60" width="55" height="28" rx="4" fill="#881337" stroke="#f43f5e" />
      <text x="28" y="78" class="code" fill="#fff" font-weight="bold">NOT C</text>

      <path d="M 20 74 L 5 74 L 5 29 L 20 29" stroke="#f43f5e" stroke-width="1.5" fill="none" marker-end="url(#arrow-rose)" />

      <!-- Ring clock callout -->
      <g transform="translate(190, 15)">
        <text class="label-bold" fill="#fda4af">Limit Cycle Oscillator</text>
        <text y="18" class="subtitle" font-size="10.5">• Odd inverter closed ring</text>
        <text y="34" class="subtitle" font-size="10.5">• 3-phase limit cycle oscillation</text>
        <text y="50" class="label" font-size="10" fill="#f43f5e">★ Elowitz &amp; Leibler (2000)</text>
      </g>
    </g>
  </g>

  <!-- 3. Coherent Feed-Forward Loop (C-FFL Type 1) -->
  <g transform="translate(40, 245)">
    <rect width="380" height="155" rx="10" fill="#081e19" stroke="#10b981" stroke-width="1.5" />
    <rect x="15" y="12" width="200" height="22" rx="4" fill="#065f46" />
    <text x="25" y="27" class="badge" fill="#d1fae5">COHERENT FFL (C-FFL)</text>
    <text x="225" y="27" class="label" fill="#34d399">Persistence Filter</text>

    <!-- FFL Triad Diagram -->
    <g transform="translate(30, 48)">
      <circle cx="30" cy="20" r="14" fill="#047857" stroke="#10b981" stroke-width="1.5" />
      <text x="25" y="24" class="code" fill="#fff" font-weight="bold">X</text>

      <path d="M 44 20 L 95 20" stroke="#10b981" stroke-width="1.5" marker-end="url(#arrow-emerald)" />
      <circle cx="110" cy="20" r="14" fill="#047857" stroke="#10b981" stroke-width="1.5" />
      <text x="105" y="24" class="code" fill="#fff" font-weight="bold">Y</text>

      <path d="M 40 32 L 80 65" stroke="#10b981" stroke-width="1.5" marker-end="url(#arrow-emerald)" />
      <path d="M 110 34 L 110 55" stroke="#10b981" stroke-width="1.5" marker-end="url(#arrow-emerald)" />

      <circle cx="100" cy="75" r="16" fill="#064e3b" stroke="#34d399" stroke-width="2" />
      <text x="94" y="80" class="code" fill="#fff" font-weight="bold">Z</text>

      <!-- Callout -->
      <g transform="translate(150, 15)">
        <text class="label-bold" fill="#6ee7b7">Noise Rejection Filter</text>
        <text y="18" class="subtitle" font-size="10.5">• Sign-sensitive activation delay</text>
        <text y="34" class="subtitle" font-size="10.5">• Ignores transient nutrient spikes</text>
        <text y="50" class="label" font-size="10" fill="#10b981">★ Fires only on sustained pulses</text>
      </g>
    </g>
  </g>

  <!-- 4. Incoherent Feed-Forward Loop (I-FFL Type 1) -->
  <g transform="translate(460, 245)">
    <rect width="380" height="155" rx="10" fill="#1b1226" stroke="#a855f7" stroke-width="1.5" />
    <rect x="15" y="12" width="210" height="22" rx="4" fill="#6b21a8" />
    <text x="25" y="27" class="badge" fill="#f3e8ff">INCOHERENT FFL (I-FFL)</text>
    <text x="235" y="27" class="label" fill="#c084fc">Pulse Generator</text>

    <!-- I-FFL Triad Diagram -->
    <g transform="translate(30, 48)">
      <circle cx="30" cy="20" r="14" fill="#581c87" stroke="#a855f7" stroke-width="1.5" />
      <text x="25" y="24" class="code" fill="#fff" font-weight="bold">X</text>

      <!-- Direct Activation -->
      <path d="M 44 20 L 95 20" stroke="#a855f7" stroke-width="1.5" marker-end="url(#arrow-purple)" />
      <circle cx="110" cy="20" r="14" fill="#be123c" stroke="#f43f5e" stroke-width="1.5" />
      <text x="105" y="24" class="code" fill="#fff" font-weight="bold">Y</text>

      <!-- Indirect Repression (Blunt arrow) -->
      <path d="M 40 32 L 80 65" stroke="#a855f7" stroke-width="1.5" marker-end="url(#arrow-purple)" />
      <path d="M 110 34 L 110 55" stroke="#f43f5e" stroke-width="2" stroke-dasharray="3 2" />

      <circle cx="100" cy="75" r="16" fill="#3b0764" stroke="#c084fc" stroke-width="2" />
      <text x="94" y="80" class="code" fill="#fff" font-weight="bold">Z</text>

      <!-- Callout -->
      <g transform="translate(150, 15)">
        <text class="label-bold" fill="#d8b4fe">Biphasic Pulse &amp; Adaptation</text>
        <text y="18" class="subtitle" font-size="10.5">• Rapid activation via direct path</text>
        <text y="34" class="subtitle" font-size="10.5">• Delayed repressor Y shuts Z off</text>
        <text y="50" class="label" font-size="10" fill="#c084fc">★ Perfect fold-change adaptation</text>
      </g>
    </g>
  </g>
`);

// 6. WEISFEILER-LEHMAN COLOR REFINEMENT GRAPH HASHING
const fig3_2 = svgWrapper(880, 360, `
  <g transform="translate(30, 35)">
    <text class="title">Figure 3.2: The Weisfeiler-Lehman (1-WL) Graph Isomorphism Kernel</text>
    <text y="20" class="subtitle">Real-time topological invariant hashing of directed Siliquarium logic netlists (Weisfeiler &amp; Lehman, 1968)</text>
  </g>

  <!-- Step 1: Round 0 Node Coloring -->
  <g transform="translate(40, 75)">
    <rect width="245" height="250" rx="10" fill="#090d16" stroke="#38bdf8" stroke-width="1.5" />
    <rect x="15" y="15" width="115" height="22" rx="4" fill="#0369a1" />
    <text x="25" y="30" class="badge" fill="#e0f2fe">ROUND 0: INIT</text>

    <text x="20" y="65" class="label-bold" fill="#7dd3fc">Initial Primitive Colors</text>
    <text x="20" y="82" class="subtitle">Each gate takes its codon type:</text>

    <g transform="translate(35, 105)">
      <circle cx="20" cy="20" r="14" fill="#075985" stroke="#38bdf8" stroke-width="2" />
      <text x="10" y="24" class="code" fill="#fff" font-size="10">AND</text>
      <text x="45" y="24" class="label" font-size="10.5">c₁⁽⁰⁾ = "AND"</text>

      <circle cx="20" cy="60" r="14" fill="#881337" stroke="#f43f5e" stroke-width="2" />
      <text x="10" y="64" class="code" fill="#fff" font-size="10">NOT</text>
      <text x="45" y="64" class="label" font-size="10.5">c₂⁽⁰⁾ = "NOT"</text>

      <circle cx="20" cy="100" r="14" fill="#047857" stroke="#10b981" stroke-width="2" />
      <text x="14" y="104" class="code" fill="#fff" font-size="10">OR</text>
      <text x="45" y="104" class="label" font-size="10.5">c₃⁽⁰⁾ = "OR"</text>
    </g>
  </g>

  <!-- Step 2: Round 1 Multiset Gathering -->
  <g transform="translate(315, 75)">
    <rect width="260" height="250" rx="10" fill="#090d16" stroke="#10b981" stroke-width="1.5" />
    <rect x="15" y="15" width="140" height="22" rx="4" fill="#065f46" />
    <text x="25" y="30" class="badge" fill="#d1fae5">ROUND 1: NEIGHBORS</text>

    <text x="20" y="65" class="label-bold" fill="#6ee7b7">Multiset Neighborhood Sort</text>
    <text x="20" y="82" class="subtitle">Collect &amp; sort neighbor colors:</text>

    <g transform="translate(20, 105)">
      <rect width="220" height="32" rx="6" fill="#052e16" stroke="#10b981" stroke-width="1" />
      <text x="10" y="20" class="code" font-size="10" fill="#a7f3d0">Node 1: (AND, [NOT, OR])</text>

      <rect y="40" width="220" height="32" rx="6" fill="#052e16" stroke="#10b981" stroke-width="1" />
      <text x="10" y="60" class="code" font-size="10" fill="#a7f3d0">Node 2: (NOT, [AND])</text>

      <rect y="80" width="220" height="32" rx="6" fill="#052e16" stroke="#10b981" stroke-width="1" />
      <text x="10" y="100" class="code" font-size="10" fill="#a7f3d0">Node 3: (OR, [AND])</text>
    </g>

    <text x="20" y="235" class="subtitle" font-size="10">Strict permutation invariance guaranteed</text>
  </g>

  <!-- Step 3: Avalanche Hash Invariant -->
  <g transform="translate(605, 75)">
    <rect width="235" height="250" rx="10" fill="#090d16" stroke="#a855f7" stroke-width="1.5" />
    <rect x="15" y="15" width="130" height="22" rx="4" fill="#6b21a8" />
    <text x="25" y="30" class="badge" fill="#f3e8ff">HASH INVARIANT</text>

    <text x="20" y="65" class="label-bold" fill="#d8b4fe">64-Bit Avalanche Hash</text>
    <text x="20" y="82" class="subtitle">Canonical structural identity:</text>

    <g transform="translate(15, 110)">
      <rect width="205" height="42" rx="6" fill="#2e1065" stroke="#c084fc" stroke-width="1.5" />
      <text x="10" y="25" class="code" font-size="10.5" fill="#f3e8ff">WL = 0x9f4a_7c2b_11de</text>
    </g>

    <rect x="15" y="170" width="205" height="60" rx="6" fill="#1e102e" stroke="#7e22ce" stroke-width="1" />
    <text x="25" y="190" class="label-bold" font-size="10" fill="#facc15">✓ Isomorphism Theorem:</text>
    <text x="25" y="206" class="subtitle" font-size="9.5">Two circuits match WL hash iff</text>
    <text x="25" y="220" class="subtitle" font-size="9.5">their wiring graphs are isomorphic!</text>
`);

// 9. 64-ENTRY DEGENERATE CODON TABLE
const fig2_2 = svgWrapper(880, 360, `
  <g transform="translate(30, 35)">
    <text class="title">Figure 2.2: The 64-Entry Prebiotic Degenerate Codon Architecture</text>
    <text y="20" class="subtitle">Grounded molecular biophysics: 6-bit codes partitioned into catalytic primitives, porins, and neutral introns (CodonTable.ts)</text>
  </g>

  <!-- Bit Structure Breakdown -->
  <g transform="translate(40, 75)">
    <rect width="800" height="75" rx="8" fill="#090d16" stroke="#0284c7" stroke-width="1.5" />
    <g transform="translate(30, 18)">
      <rect x="0" y="0" width="70" height="38" rx="6" fill="#0369a1" stroke="#38bdf8" />
      <text x="35" y="24" class="code" text-anchor="middle" font-size="14" fill="#fff">Bit 5</text>
      <rect x="80" y="0" width="70" height="38" rx="6" fill="#0369a1" stroke="#38bdf8" />
      <text x="115" y="24" class="code" text-anchor="middle" font-size="14" fill="#fff">Bit 4</text>
      <rect x="160" y="0" width="70" height="38" rx="6" fill="#0369a1" stroke="#38bdf8" />
      <text x="195" y="24" class="code" text-anchor="middle" font-size="14" fill="#fff">Bit 3</text>
      <rect x="250" y="0" width="70" height="38" rx="6" fill="#047857" stroke="#10b981" />
      <text x="285" y="24" class="code" text-anchor="middle" font-size="14" fill="#fff">Bit 2</text>
      <rect x="330" y="0" width="70" height="38" rx="6" fill="#047857" stroke="#10b981" />
      <text x="365" y="24" class="code" text-anchor="middle" font-size="14" fill="#fff">Bit 1</text>
      <rect x="410" y="0" width="70" height="38" rx="6" fill="#047857" stroke="#10b981" />
      <text x="445" y="24" class="code" text-anchor="middle" font-size="14" fill="#fff">Bit 0</text>
    </g>

    <g transform="translate(530, 20)">
      <text class="label-bold" fill="#38bdf8">Bits 5-3: Functional Class</text>
      <text y="18" class="label-bold" fill="#10b981">Bits 2-0: Degenerate Synonymous</text>
      <text y="34" class="subtitle" font-size="10">Provides neutral Kimura mutational buffer</text>
    </g>
  </g>

  <!-- 4 Functional Classes Cards -->
  <g transform="translate(40, 165)">
    <!-- Class 1: Catalytic Primitives -->
    <rect x="0" y="0" width="190" height="155" rx="8" fill="#0c1726" stroke="#38bdf8" stroke-width="1.5" />
    <rect x="10" y="10" width="170" height="22" rx="4" fill="#0369a1" />
    <text x="95" y="25" class="badge" text-anchor="middle" fill="#e0f2fe">1. CATALYTIC PRIMITIVES</text>
    <g transform="translate(15, 45)" class="subtitle" font-size="10.5">
      <text y="15" fill="#38bdf8">• Codons 00..11: GATE_AND (12)</text>
      <text y="35" fill="#f43f5e">• Codons 12..21: GATE_NOT (10)</text>
      <text y="55" fill="#10b981">• Codons 22..31: GATE_OR  (10)</text>
      <text y="75" fill="#fbbf24">• Note: XOR is NOT primitive</text>
      <text y="92" fill="#94a3b8" font-size="9.5">Evolved via multi-gate motif</text>
    </g>

    <!-- Class 2: Porins -->
    <rect x="203" y="0" width="190" height="155" rx="8" fill="#081e19" stroke="#10b981" stroke-width="1.5" />
    <rect x="213" y="10" width="170" height="22" rx="4" fill="#065f46" />
    <text x="298" y="25" class="badge" text-anchor="middle" fill="#d1fae5">2. MEMBRANE PORINS</text>
    <g transform="translate(218, 45)" class="subtitle" font-size="10.5">
      <text y="15" fill="#34d399">• Codons 32..37: STREAM_A (6)</text>
      <text y="35" fill="#34d399">• Codons 38..43: STREAM_B (6)</text>
      <text y="55" fill="#f43f5e">• Codons 44..47: TOXIN_T   (4)</text>
      <text y="75" fill="#94a3b8">Binds specific solutes</text>
      <text y="92" fill="#94a3b8" font-size="9.5">Selective outer channels</text>
    </g>

    <!-- Class 3: Sinks -->
    <rect x="406" y="0" width="190" height="155" rx="8" fill="#1f1807" stroke="#f59e0b" stroke-width="1.5" />
    <rect x="416" y="10" width="170" height="22" rx="4" fill="#78350f" />
    <text x="501" y="25" class="badge" text-anchor="middle" fill="#fef3c7">3. STRUCTURAL SINKS</text>
    <g transform="translate(421, 45)" class="subtitle" font-size="10.5">
      <text y="15" fill="#fbbf24">• Codons 48..51: BATTERY (4)</text>
      <text y="35" fill="#fbbf24">• Codons 52..55: SEPTUM  (4)</text>
      <text y="55" fill="#94a3b8">ATP Synthase analogue</text>
      <text y="75" fill="#94a3b8">FtsZ contractile ring</text>
      <text y="92" fill="#94a3b8" font-size="9.5">Triggers fission @ 100T</text>
    </g>

    <!-- Class 4: Introns -->
    <rect x="610" y="0" width="190" height="155" rx="8" fill="#1b1226" stroke="#a855f7" stroke-width="1.5" />
    <rect x="620" y="10" width="170" height="22" rx="4" fill="#581c87" />
    <text x="705" y="25" class="badge" text-anchor="middle" fill="#f3e8ff">4. NEUTRAL INTRONS</text>
    <g transform="translate(625, 45)" class="subtitle" font-size="10.5">
      <text y="15" fill="#c084fc">• Codons 56..61: SILENT  (6)</text>
      <text y="35" fill="#c084fc">• Codons 62..63: OPERATOR (2)</text>
      <text y="55" fill="#94a3b8">Kimura neutral buffer</text>
      <text y="75" fill="#94a3b8">Silent mutations absorb noise</text>
      <text y="92" fill="#94a3b8" font-size="9.5">Total: Exactly 64 entries!</text>
    </g>
  </g>
`);

// 10. LANDAUER THERMODYNAMIC DISSIPATION & POWER LEDGER
const fig2_3 = svgWrapper(880, 360, `
  <g transform="translate(30, 35)">
    <text class="title">Figure 2.3: Rolf Landauer's Principle &amp; Dynamic CMOS Power Dissipation</text>
    <text y="20" class="subtitle">Information processing is physical: Bit erasure and gate toggling dissipate real heat into the abyssal sink (Landauer, 1961)</text>
  </g>

  <!-- Left: Physical Principle -->
  <g transform="translate(40, 75)">
    <rect width="380" height="250" rx="10" fill="#090d16" stroke="#f43f5e" stroke-width="1.5" />
    <rect x="15" y="15" width="220" height="22" rx="4" fill="#881337" />
    <text x="25" y="30" class="badge" fill="#ffe4e6">LANDAUER ERASURE BOUND</text>
    <text x="250" y="30" class="code" fill="#f43f5e">Q ≥ kB · T · ln 2</text>

    <!-- State diagram -->
    <g transform="translate(40, 65)">
      <circle cx="50" cy="40" r="24" fill="#0369a1" stroke="#38bdf8" stroke-width="2" />
      <text x="50" y="47" class="code" text-anchor="middle" font-size="18" fill="#fff">1</text>
      <text x="50" y="80" class="subtitle" font-size="10" text-anchor="middle">Initial Bit</text>

      <path d="M 80 40 L 170 40" stroke="#f43f5e" stroke-width="2.5" marker-end="url(#arrow-rose)" />
      <text x="125" y="30" class="label-bold" font-size="10.5" fill="#f43f5e" text-anchor="middle">RESET TO 0</text>

      <circle cx="200" cy="40" r="24" fill="#0f172a" stroke="#64748b" stroke-width="2" />
      <text x="200" y="47" class="code" text-anchor="middle" font-size="18" fill="#64748b">0</text>
      <text x="200" y="80" class="subtitle" font-size="10" text-anchor="middle">Erased Bit</text>

      <!-- Heat dissipation arrows radiating out -->
      <path d="M 125 45 Q 140 70 125 95" stroke="#f59e0b" stroke-width="2" fill="none" marker-end="url(#arrow-amber)" />
      <path d="M 140 45 Q 155 70 140 95" stroke="#f59e0b" stroke-width="2" fill="none" marker-end="url(#arrow-amber)" />
      <text x="135" y="115" class="code" font-size="10" fill="#f59e0b" text-anchor="middle">Heat Dissipation Q</text>
    </g>

    <text x="190" y="215" class="label" text-anchor="middle" fill="#fda4af">Erasing 1 bit of information reduces phase space entropy,</text>
    <text x="190" y="230" class="label" text-anchor="middle" fill="#fda4af">releasing at least kB·T·ln 2 of waste heat into the environment!</text>
  </g>

  <!-- Right: Siliquarium Power Ledger -->
  <g transform="translate(460, 75)">
    <rect width="380" height="250" rx="10" fill="#090d16" stroke="#00e5ff" stroke-width="1.5" />
    <rect x="15" y="15" width="210" height="22" rx="4" fill="#075985" />
    <text x="25" y="30" class="badge" fill="#e0f2fe">DYNAMIC POWER LEDGER</text>
    <text x="240" y="30" class="code" fill="#00e5ff">PoreBattery.ts</text>

    <g transform="translate(25, 55)">
      <!-- Energy Influx -->
      <rect width="330" height="42" rx="6" fill="#042f2e" stroke="#10b981" stroke-width="1" />
      <text x="15" y="26" class="code" fill="#4ade80">+2 to +3 Tokens</text>
      <text x="150" y="26" class="label" font-size="10.5">Catalytic Redox Influx (A ∧ B)</text>

      <!-- Switching Cost -->
      <rect y="52" width="330" height="42" rx="6" fill="#4c0519" stroke="#f43f5e" stroke-width="1" />
      <text x="15" y="78" class="code" fill="#fb7185">-1 Token / Toggle</text>
      <text x="150" y="78" class="label" font-size="10.5">CMOS Dynamic Landauer Penalty</text>

      <!-- Basal Leak -->
      <rect y="104" width="330" height="42" rx="6" fill="#2d1a03" stroke="#f59e0b" stroke-width="1" />
      <text x="15" y="130" class="code" fill="#facc15">-1 Token / 10 Ticks</text>
      <text x="150" y="130" class="label" font-size="10.5">Basal Decay into Abyssal Cold</text>
    </g>

    <rect x="25" y="212" width="330" height="26" rx="4" fill="#0c1726" stroke="#0284c7" stroke-width="1" />
    <text x="190" y="229" class="code" text-anchor="middle" font-size="10.5" fill="#38bdf8">If Battery = 0 → Lysis; If Battery ≥ 100 → Mitosis</text>
  </g>
`);

// 11. MOTIF DYNAMIC RESPONSE WAVEFORMS
const fig3_3 = svgWrapper(880, 360, `
  <g transform="translate(30, 35)">
    <text class="title">Figure 3.3: Dynamic Response Waveforms of Evolved Systems Biology Motifs</text>
    <text y="20" class="subtitle">Continuous analog kinetics generated by digital logic circuits in the hydrothermal vent</text>
  </g>

  <!-- 1. SR Latch Hysteresis -->
  <g transform="translate(40, 75)">
    <rect width="380" height="115" rx="8" fill="#0c1726" stroke="#38bdf8" stroke-width="1.5" />
    <rect x="12" y="10" width="130" height="18" rx="4" fill="#0369a1" />
    <text x="20" y="23" class="badge" fill="#e0f2fe">HYSTERESIS LOOP</text>
    <text x="155" y="23" class="subtitle" font-size="10">SR Latch State Memory</text>

    <!-- Hysteresis square curve -->
    <g transform="translate(40, 40)">
      <line x1="0" y1="50" x2="160" y2="50" stroke="#64748b" stroke-width="1" />
      <line x1="0" y1="0" x2="0" y2="50" stroke="#64748b" stroke-width="1" />
      <path d="M 0 50 L 70 50 L 70 10 L 150 10" stroke="#38bdf8" stroke-width="2" fill="none" />
      <path d="M 150 10 L 30 10 L 30 50 L 0 50" stroke="#00e5ff" stroke-width="2" stroke-dasharray="3 2" fill="none" />
      <text x="180" y="30" class="code" font-size="9.5" fill="#38bdf8">State latches HIGH</text>
      <text x="180" y="45" class="subtitle" font-size="9">even when S drops!</text>
    </g>
  </g>

  <!-- 2. Repressilator Limit Cycle -->
  <g transform="translate(460, 75)">
    <rect width="380" height="115" rx="8" fill="#200d17" stroke="#f43f5e" stroke-width="1.5" />
    <rect x="12" y="10" width="150" height="18" rx="4" fill="#881337" />
    <text x="20" y="23" class="badge" fill="#ffe4e6">3-PHASE LIMIT CYCLE</text>
    <text x="175" y="23" class="subtitle" font-size="10">Repressilator Ring Clock</text>

    <!-- 3 Sine Waves with 120 deg phase shift -->
    <g transform="translate(40, 40)">
      <path d="M 0 35 Q 20 5 40 35 T 80 35 T 120 35 T 160 35" stroke="#f43f5e" stroke-width="2" fill="none" />
      <path d="M 0 15 Q 20 45 40 15 T 80 15 T 120 15 T 160 15" stroke="#38bdf8" stroke-width="2" fill="none" />
      <path d="M 0 50 Q 20 20 40 50 T 80 50 T 120 50 T 160 50" stroke="#10b981" stroke-width="2" fill="none" />
      <text x="180" y="30" class="code" font-size="9.5" fill="#f43f5e">3-Phase Pacemaker</text>
      <text x="180" y="45" class="subtitle" font-size="9">Autonomous limit cycle</text>
    </g>
  </g>

  <!-- 3. C-FFL Persistence Filter -->
  <g transform="translate(40, 205)">
    <rect width="380" height="115" rx="8" fill="#081e19" stroke="#10b981" stroke-width="1.5" />
    <rect x="12" y="10" width="160" height="18" rx="4" fill="#065f46" />
    <text x="20" y="23" class="badge" fill="#d1fae5">PERSISTENCE FILTER</text>
    <text x="185" y="23" class="subtitle" font-size="10">C-FFL Sign-Sensitive Delay</text>

    <g transform="translate(40, 40)">
      <!-- Input Spike vs Persistent -->
      <path d="M 0 45 L 20 45 L 20 15 L 30 15 L 30 45 L 60 45 L 60 15 L 140 15" stroke="#94a3b8" stroke-width="1.5" fill="none" />
      <text x="145" y="18" class="code" font-size="9" fill="#94a3b8">Input X</text>

      <!-- Output Z only responds to persistent -->
      <path d="M 0 50 L 80 50 L 80 25 L 140 25" stroke="#10b981" stroke-width="2" fill="none" />
      <text x="145" y="32" class="code" font-size="9" fill="#10b981">Output Z</text>
      <text x="180" y="50" class="subtitle" font-size="9">Transient spike ignored!</text>
    </g>
  </g>

  <!-- 4. I-FFL Pulse Generator -->
  <g transform="translate(460, 205)">
    <rect width="380" height="115" rx="8" fill="#1b1226" stroke="#a855f7" stroke-width="1.5" />
    <rect x="12" y="10" width="160" height="18" rx="4" fill="#6b21a8" />
    <text x="20" y="23" class="badge" fill="#f3e8ff">PULSE GENERATOR</text>
    <text x="185" y="23" class="subtitle" font-size="10">I-FFL Fold-Change Adaptation</text>

    <g transform="translate(40, 40)">
      <!-- Step input -->
      <path d="M 0 45 L 20 45 L 20 15 L 140 15" stroke="#94a3b8" stroke-width="1.5" fill="none" />
      <text x="145" y="18" class="code" font-size="9" fill="#94a3b8">Step Input X</text>

      <!-- Biphasic Pulse -->
      <path d="M 0 50 L 25 50 L 40 20 L 55 50 L 140 50" stroke="#c084fc" stroke-width="2" fill="none" />
      <text x="145" y="35" class="code" font-size="9" fill="#c084fc">Output Z (Pulse)</text>
      <text x="180" y="50" class="subtitle" font-size="9">Delayed repressor adapts</text>
    </g>
  </g>
`);

// 12. KIMURA NEUTRAL SADDLES & OHNO GENE DUPLICATION
const fig4_1 = svgWrapper(880, 360, `
  <g transform="translate(30, 35)">
    <text class="title">Figure 4.1: Motoo Kimura's Neutral Saddles &amp; Susumu Ohno's Gene Duplication</text>
    <text y="20" class="subtitle">Crossing adaptive valleys through synonymous degenerate codons and redundant paralog release (Kimura 1968, Ohno 1970)</text>
  </g>

  <!-- Left: Kimura Neutral Saddle -->
  <g transform="translate(40, 75)">
    <rect width="380" height="250" rx="10" fill="#090d16" stroke="#38bdf8" stroke-width="1.5" />
    <rect x="15" y="15" width="200" height="22" rx="4" fill="#0369a1" />
    <text x="25" y="30" class="badge" fill="#e0f2fe">KIMURA NEUTRAL DRIFT</text>
    <text x="225" y="30" class="code" fill="#38bdf8">k = μ0 (Invariance)</text>

    <!-- Fitness Peaks with Neutral Bridge -->
    <g transform="translate(30, 60)">
      <!-- Peak 1 -->
      <path d="M 10 130 Q 50 10 90 130" stroke="#0284c7" stroke-width="2" fill="#082f49" opacity="0.4" />
      <text x="50" y="45" class="label-bold" fill="#38bdf8" text-anchor="middle">Niche A</text>

      <!-- Neutral Bridge (Degenerate Synonymous Codons) -->
      <path d="M 90 90 L 230 90" stroke="#38bdf8" stroke-width="3" stroke-dasharray="4 2" />
      <text x="160" y="80" class="code" font-size="10" fill="#38bdf8" text-anchor="middle">Flat Neutral Saddle</text>
      <text x="160" y="110" class="subtitle" font-size="9.5" text-anchor="middle">(Synonymous Introns)</text>

      <!-- Peak 2 -->
      <path d="M 230 130 Q 270 10 310 130" stroke="#047857" stroke-width="2" fill="#064e3b" opacity="0.4" />
      <text x="270" y="45" class="label-bold" fill="#10b981" text-anchor="middle">Niche B</text>
    </g>

    <text x="190" y="225" class="subtitle" font-size="10" text-anchor="middle" fill="#94a3b8">Purifying selection cannot purge neutral mutations;</text>
    <text x="190" y="240" class="subtitle" font-size="10" text-anchor="middle" fill="#94a3b8">lineages drift across deep fitness valleys without starvation!</text>
  </g>

  <!-- Right: Ohno Gene Duplication -->
  <g transform="translate(460, 75)">
    <rect width="380" height="250" rx="10" fill="#090d16" stroke="#f59e0b" stroke-width="1.5" />
    <rect x="15" y="15" width="220" height="22" rx="4" fill="#78350f" />
    <text x="25" y="30" class="badge" fill="#fef3c7">OHNO GENE DUPLICATION</text>
    <text x="245" y="30" class="code" fill="#f59e0b">Neofunctionalization</text>

    <!-- Single gene copy splitting into two -->
    <g transform="translate(30, 60)">
      <!-- Ancestor Gene -->
      <rect x="110" y="10" width="100" height="30" rx="6" fill="#075985" stroke="#38bdf8" />
      <text x="160" y="28" class="code" font-size="10" fill="#fff" text-anchor="middle">Essential AND</text>

      <!-- Split Arrow -->
      <path d="M 140 45 L 70 85" stroke="#64748b" stroke-width="1.5" marker-end="url(#arrow-slate)" />
      <path d="M 180 45 L 250 85" stroke="#64748b" stroke-width="1.5" marker-end="url(#arrow-slate)" />

      <!-- Paralog 1: Purifying Selection -->
      <rect x="20" y="90" width="100" height="30" rx="6" fill="#075985" stroke="#38bdf8" />
      <text x="70" y="108" class="code" font-size="10" fill="#fff" text-anchor="middle">Copy 1: AND</text>
      <text x="70" y="135" class="subtitle" font-size="9" text-anchor="middle">Purifying selection</text>
      <text x="70" y="148" class="subtitle" font-size="9" text-anchor="middle">sustains cell life</text>

      <!-- Paralog 2: Freed to Mutate -->
      <rect x="200" y="90" width="100" height="30" rx="6" fill="#78350f" stroke="#f59e0b" />
      <text x="250" y="108" class="code" font-size="10" fill="#fff" text-anchor="middle">Copy 2: Paralog</text>
      <text x="250" y="135" class="label-bold" font-size="9" fill="#facc15" text-anchor="middle">Freed from constraint!</text>
      <text x="250" y="148" class="subtitle" font-size="9" text-anchor="middle">Mutates into novel NOT</text>
    </g>

    <!-- Combined Innovation Result -->
    <rect x="40" y="215" width="300" height="25" rx="4" fill="#1b1226" stroke="#a855f7" stroke-width="1" />
    <text x="190" y="232" class="code" font-size="10" fill="#d8b4fe" text-anchor="middle">Copy 1 + Copy 2 wire to form XOR half-adder!</text>
  </g>
`);

// 13. LENSKI HYPERBOLIC & HOMOLOGY / HOMOPLASY TREE
const fig4_2 = svgWrapper(880, 360, `
  <g transform="translate(30, 35)">
    <text class="title">Figure 4.2: The Lenski LTEE Hyperbolic Trajectory &amp; Homology vs. Homoplasy</text>
    <text y="20" class="subtitle">Power-law deceleration and phylogenetic proof of convergent evolution (Lenski 1991, 2003)</text>
  </g>

  <!-- Left Chart: Lenski Hyperbolic Curve -->
  <g transform="translate(40, 75)">
    <rect width="430" height="250" rx="10" fill="#090d16" stroke="#38bdf8" stroke-width="1.5" />
    <rect x="15" y="15" width="220" height="22" rx="4" fill="#0369a1" />
    <text x="25" y="30" class="badge" fill="#e0f2fe">HYPERBOLIC FITNESS TRAJECTORY</text>

    <!-- Axes -->
    <g transform="translate(45, 50)">
      <line x1="0" y1="150" x2="330" y2="150" stroke="#64748b" stroke-width="1.5" />
      <line x1="0" y1="0" x2="0" y2="150" stroke="#64748b" stroke-width="1.5" />

      <text x="330" y="168" class="code" font-size="9.5" fill="#94a3b8" text-anchor="end">Generation (t) ──►</text>
      <text x="-10" y="0" class="code" font-size="9.5" fill="#94a3b8" text-anchor="end">Fitness W(t)</text>

      <!-- Hyperbolic Curve -->
      <path d="M 0 140 Q 30 60, 160 55 T 320 50" fill="none" stroke="#38bdf8" stroke-width="2.5" />
      <text x="170" y="45" class="code" font-size="9.5" fill="#38bdf8">W(t) = (1 + c·t)^d</text>

      <!-- Cit+ Breakthrough Jump -->
      <path d="M 200 54 L 215 20 Q 240 15, 320 10" fill="none" stroke="#facc15" stroke-width="2.5" stroke-dasharray="4 2" />
      <circle cx="200" cy="54" r="4" fill="#facc15" />
      <text x="210" y="15" class="label-bold" font-size="9.5" fill="#facc15">Cit⁺ Innovation Jump</text>
    </g>
  </g>

  <!-- Right Chart: Homology vs Homoplasy Decision Tree -->
  <g transform="translate(490, 75)">
    <rect width="350" height="250" rx="10" fill="#090d16" stroke="#a855f7" stroke-width="1.5" />
    <rect x="15" y="15" width="180" height="22" rx="4" fill="#6b21a8" />
    <text x="25" y="30" class="badge" fill="#f3e8ff">HOMOLOGY VS HOMOPLASY</text>

    <g transform="translate(30, 50)">
      <circle cx="140" cy="15" r="10" fill="#475569" />
      <text x="132" y="19" class="code" font-size="9" fill="#fff">LCA</text>
      <text x="140" y="36" class="subtitle" font-size="9" text-anchor="middle">Founder Gen 0</text>

      <path d="M 130 22 L 60 65" stroke="#64748b" stroke-width="1.5" />
      <path d="M 150 22 L 220 65" stroke="#64748b" stroke-width="1.5" />

      <circle cx="60" cy="70" r="12" fill="#0369a1" />
      <text x="45" y="90" class="code" font-size="9" fill="#38bdf8">Clade A</text>

      <circle cx="220" cy="70" r="12" fill="#be123c" />
      <text x="205" y="90" class="code" font-size="9" fill="#f43f5e">Clade B</text>

      <path d="M 60 95 L 110 130" stroke="#a855f7" stroke-width="2" marker-end="url(#arrow-purple)" />
      <path d="M 220 95 L 170 130" stroke="#a855f7" stroke-width="2" marker-end="url(#arrow-purple)" />

      <rect x="90" y="135" width="100" height="32" rx="6" fill="#2e1065" stroke="#c084fc" stroke-width="1.5" />
      <text x="140" y="152" class="code" font-size="9.5" text-anchor="middle" fill="#fff">XOR Motif</text>
      <text x="140" y="163" class="badge" text-anchor="middle" font-size="8" fill="#c084fc">WL: 0x9f4a...</text>

      <text x="140" y="188" class="label-bold" font-size="9.5" text-anchor="middle" fill="#facc15">Convergent Evolution!</text>
    </g>
  </g>
`);

// 14. BENTHIC VS PELAGIC DISPERSAL IN 3D WATER COLUMN
const fig4_3 = svgWrapper(880, 360, `
  <g transform="translate(30, 35)">
    <text class="title">Figure 4.3: Seafloor Benthic Matrix vs. Pelagic Spore Water Column Advection</text>
    <text y="20" class="subtitle">Multi-layer hydrodynamic dispersion: Fluid transport of dormant silicoid spores across 3D basalt seamounts</text>
  </g>

  <!-- Water Column Stratification -->
  <g transform="translate(40, 70)">
    <!-- z = 2: Pelagic Advection Layer -->
    <rect width="800" height="75" rx="6" fill="#082f49" stroke="#0284c7" stroke-width="1" />
    <rect x="15" y="10" width="190" height="20" rx="4" fill="#0369a1" />
    <text x="25" y="24" class="badge" fill="#e0f2fe">LAYER z = 2 (PELAGIC DRIFT)</text>
    <text x="220" y="24" class="code" fill="#38bdf8">Advection Velocity: v_drift = (0.04, 0.01)</text>

    <g transform="translate(150, 42)">
      <circle cx="50" cy="8" r="8" fill="#38bdf8" /> <text x="65" y="12" class="code" font-size="9.5" fill="#bae6fd">Spore #142</text>
      <path d="M 120 8 L 220 8" stroke="#00e5ff" stroke-width="2" stroke-dasharray="4 2" marker-end="url(#arrow-cyan)" />

      <circle cx="340" cy="8" r="8" fill="#38bdf8" /> <text x="355" y="12" class="code" font-size="9.5" fill="#bae6fd">Spore #189</text>
      <path d="M 410 8 L 510 8" stroke="#00e5ff" stroke-width="2" stroke-dasharray="4 2" marker-end="url(#arrow-cyan)" />
    </g>

    <!-- z = 1: Hydrothermal Plume Updraft Boundary -->
    <g transform="translate(0, 80)">
      <rect width="800" height="75" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1" />
      <rect x="15" y="10" width="220" height="20" rx="4" fill="#1e293b" />
      <text x="25" y="24" class="badge" fill="#cbd5e1">LAYER z = 1 (PLUME BOUNDARY)</text>
      <text x="250" y="24" class="label" fill="#94a3b8">Thermal buoyancy updrafts lift spores off basalt pores</text>

      <path d="M 220 70 L 220 15" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#arrow-amber)" />
      <text x="230" y="45" class="code" font-size="9.5" fill="#f59e0b">Thermal Updraft</text>

      <path d="M 620 15 L 620 70" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrow-emerald)" />
      <text x="630" y="45" class="code" font-size="9.5" fill="#10b981">Downwelling Re-Settlement</text>
    </g>

    <!-- z = 0: Benthic Basalt Matrix -->
    <g transform="translate(0, 160)">
      <rect width="800" height="95" rx="6" fill="#111827" stroke="#374151" stroke-width="1.5" />
      <rect x="15" y="10" width="210" height="20" rx="4" fill="#1f2937" />
      <text x="25" y="24" class="badge" fill="#f3f4f6">LAYER z = 0 (BENTHIC SUBSTRATE)</text>
      <text x="240" y="24" class="code" fill="#facc15">Mineral Pores (q, r, 0) | Hydrothermal Chimney Vents</text>

      <g transform="translate(180, 40)">
        <polygon points="20,10 40,10 50,27 40,44 20,44 10,27" fill="#1f2937" stroke="#00e5ff" stroke-width="2" />
        <text x="30" y="32" class="code" font-size="8" fill="#00e5ff" text-anchor="middle">Sessile</text>
      </g>
      <g transform="translate(580, 40)">
        <polygon points="20,10 40,10 50,27 40,44 20,44 10,27" fill="#1f2937" stroke="#10b981" stroke-width="2" />
        <text x="30" y="32" class="code" font-size="8" fill="#10b981" text-anchor="middle">Colonized</text>
      </g>
    </g>
  </g>
`);

// Write files
const files = [
  { name: 'fig1_1_dilution_catastrophe.svg', content: fig1_1 },
  { name: 'fig1_2_hydrothermal_chimney.svg', content: fig1_2 },
  { name: 'fig1_3_epistemic_cut.svg', content: fig1_3 },
  { name: 'fig2_1_primitive_enzymes.svg', content: fig2_1 },
  { name: 'fig2_2_codon_table.svg', content: fig2_2 },
  { name: 'fig2_3_landauer_dissipation.svg', content: fig2_3 },
  { name: 'fig3_1_network_motifs.svg', content: fig3_1 },
  { name: 'fig3_2_weisfeiler_lehman.svg', content: fig3_2 },
  { name: 'fig3_3_motif_waveforms.svg', content: fig3_3 },
  { name: 'fig4_1_kimura_and_ohno.svg', content: fig4_1 },
  { name: 'fig4_2_lenski_and_phylogeny.svg', content: fig4_2 },
  { name: 'fig4_3_pelagic_spores.svg', content: fig4_3 }
];

console.log('🎨 Generating enterprise SVG diagrams for Siliquarium documentation...');
for (const file of files) {
  const destPath = path.join(diagramsDir, file.name);
  fs.writeFileSync(destPath, file.content, 'utf8');
  console.log(`  ✓ Generated: docs/assets/diagrams/${file.name}`);
}
console.log('🎉 Diagram generation complete!');
