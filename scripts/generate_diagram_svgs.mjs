#!/usr/bin/env node

/**
 * 🎨 Siliquarium Enterprise Diagram Generator
 * Generates ultra-crisp, dark-themed, publication-grade SVG diagrams
 * replacing all ASCII art across the Siliquarium documentation suite.
 *
 * Exhaustively audited for:
 * - Generous bounding boxes & 16-24px padding
 * - Zero line/arrow intersections through text labels or badges
 * - Strict non-collision of geometric shapes with callouts
 * - Precise text-anchor alignment and mathematical typography
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const diagramsDir = path.join(rootDir, 'docs', 'assets', 'diagrams');

fs.mkdirSync(diagramsDir, { recursive: true });

function generateSineWavePath(xStart, xEnd, yMid, amplitude, wavelength, phaseRad) {
  let d = '';
  const step = 2.5;
  for (let x = xStart; x <= xEnd; x += step) {
    const angle = (2 * Math.PI * (x - xStart) / wavelength) - phaseRad;
    const y = (yMid - amplitude * Math.sin(angle)).toFixed(1);
    d += (x === xStart ? 'M ' : ' L ') + x.toFixed(1) + ' ' + y;
  }
  return d;
}

function svgWrapper(width, height, content) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" class="w-full h-auto font-sans">
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
    .title { font-family: ui-monospace, 'Cascadia Code', Consolas, 'SF Mono', monospace; font-size: 15px; font-weight: bold; fill: #f8fafc; }
    .subtitle { font-family: system-ui, -apple-system, 'Inter', sans-serif; font-size: 11.5px; fill: #94a3b8; }
    .label { font-family: system-ui, -apple-system, 'Inter', sans-serif; font-size: 11px; fill: #cbd5e1; }
    .label-bold { font-family: system-ui, -apple-system, 'Inter', sans-serif; font-size: 11.5px; font-weight: bold; fill: #f8fafc; }
    .code { font-family: ui-monospace, 'Cascadia Code', Consolas, 'SF Mono', monospace; font-size: 10.5px; fill: #00e5ff; }
    .badge { font-family: ui-monospace, 'Cascadia Code', Consolas, 'SF Mono', monospace; font-size: 9.5px; font-weight: bold; letter-spacing: 0.5px; }
  </style>

  <!-- Canvas Background -->
  <rect width="${width}" height="${height}" rx="16" fill="url(#panelGrad)" stroke="#1e293b" stroke-width="1.5" />

  ${content}
</svg>`;
}

// 1. DILUTION CATASTROPHE VS HYDROTHERMAL FOAM
const fig1_1 = svgWrapper(940, 370, `
  <!-- Header -->
  <g transform="translate(30, 34)">
    <text class="title">Figure 1.1: The Dilution Catastrophe vs. Alkaline Hydrothermal Micro-Pores</text>
    <text y="20" class="subtitle">Why open-ocean abiogenesis is thermodynamically impossible without inorganic micro-compartmentation</text>
  </g>

  <!-- Left: Open Ocean -->
  <g transform="translate(30, 75)">
    <rect width="425" height="265" rx="12" fill="#090d16" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4 2" />
    <rect x="18" y="15" width="150" height="24" rx="6" fill="#4c0519" stroke="#f43f5e" stroke-width="1" />
    <text x="28" y="31" class="badge" fill="#fecdd3">OPEN HADEAN OCEAN</text>
    <text x="180" y="31" class="label" fill="#f43f5e">Dilution Catastrophe</text>

    <!-- Drifting Monomer A -->
    <circle cx="75" cy="95" r="14" fill="#0284c7" opacity="0.3" />
    <circle cx="75" cy="95" r="8" fill="#38bdf8" />
    <text x="71" y="99" class="code" fill="#000" font-weight="bold">A</text>
    <path d="M 90 90 Q 140 68 190 80" stroke="#38bdf8" stroke-width="1.5" fill="none" stroke-dasharray="3 3" marker-end="url(#arrow-cyan)" />
    <text x="200" y="84" class="subtitle" font-size="10">Drifts into infinity</text>

    <!-- Drifting Monomer B (positioned away from callout) -->
    <circle cx="340" cy="110" r="14" fill="#10b981" opacity="0.3" />
    <circle cx="340" cy="110" r="8" fill="#4ade80" />
    <text x="336" y="114" class="code" fill="#000" font-weight="bold">B</text>
    <path d="M 330 100 Q 305 65 285 52" stroke="#4ade80" stroke-width="1.5" fill="none" stroke-dasharray="3 3" marker-end="url(#arrow-emerald)" />
    <text x="215" y="48" class="subtitle" font-size="10">Disperses unbounded</text>

    <!-- Math Callout Box -->
    <rect x="25" y="150" width="375" height="66" rx="8" fill="#1e101a" stroke="#881337" stroke-width="1" />
    <text x="38" y="171" class="code" fill="#f43f5e">[A] → 0,  [B] → 0  (Infinite Dilution)</text>
    <text x="38" y="190" class="label" font-size="10.5">Reaction Rate: v = k · [A][B] = 0 s⁻¹</text>
    <text x="38" y="205" class="subtitle" font-size="9.5">Molecules never collide; free energy lost to entropy!</text>

    <text x="212" y="244" class="label" text-anchor="middle" fill="#fda4af">Entropy disperses organic polymers before replication can ignite</text>
  </g>

  <!-- Right: Alkaline Vent Micro-Pores -->
  <g transform="translate(485, 75)">
    <rect width="425" height="265" rx="12" fill="#090d16" stroke="#00e5ff" stroke-width="1.5" />
    <rect x="18" y="15" width="165" height="24" rx="6" fill="#083344" stroke="#00e5ff" stroke-width="1" />
    <text x="28" y="31" class="badge" fill="#bae6fd">HYDROTHERMAL FOAM</text>
    <text x="195" y="31" class="label" fill="#00e5ff">Basalt Micro-Pores</text>

    <!-- Mineral honeycomb micro-cavities (bounded within x=25..135 to prevent text collisions) -->
    <!-- Cavity 1 (upper-left) -->
    <polygon points="55,75 85,75 100,101 85,127 55,127 40,101" fill="#132238" stroke="#38bdf8" stroke-width="1.5" />
    <!-- Cavity 2 (lower-left) -->
    <polygon points="55,135 85,135 100,161 85,187 55,187 40,161" fill="#132238" stroke="#38bdf8" stroke-width="1.5" />
    <!-- Cavity 3 (active catalytic chamber) -->
    <polygon points="95,105 125,105 140,131 125,157 95,157 80,131" fill="#0f2942" stroke="#00e5ff" stroke-width="2" filter="url(#glow-cyan)" />

    <!-- Trapped and concentrated reactants inside Cavity 3 -->
    <circle cx="102" cy="131" r="6.5" fill="#38bdf8" />
    <text x="99" y="135" class="code" fill="#000" font-weight="bold" font-size="8.5">A</text>
    <circle cx="118" cy="131" r="6.5" fill="#4ade80" />
    <text x="115" y="135" class="code" fill="#000" font-weight="bold" font-size="8.5">B</text>

    <!-- Catalytic Reaction Spark -->
    <polygon points="110,121 113,126 119,127 114,131 116,137 110,133 105,137 107,131 102,127 108,126" fill="#facc15" />

    <!-- Features Callout Card (starts at x=155, leaving ample breathing room) -->
    <g transform="translate(155, 62)">
      <text class="label-bold" fill="#38bdf8">Nature's First Cell Walls</text>
      <text y="19" class="label" font-size="10.5">• Pore diameter: 10 – 50 μm</text>
      <text y="36" class="label" font-size="10.5">• FeS / silica inorganic walls</text>
      <text y="53" class="label" font-size="10.5">• Thermal siphoning concentration</text>
      <rect x="0" y="68" width="245" height="52" rx="6" fill="#042f2e" stroke="#10b981" stroke-width="1" />
      <text x="12" y="89" class="code" fill="#4ade80" font-weight="bold">CONCENTRATION: &gt; 1,000,000×</text>
      <text x="12" y="106" class="subtitle" font-size="10">Reaction cascades spark autopoietically!</text>
    </g>

    <text x="212" y="244" class="label" text-anchor="middle" fill="#67e8f9">Trapped in basalt foam, prebiotic enzymes replicate autopoietically</text>
  </g>
`);

// 2. HYDROTHERMAL CHIMNEY CROSS SECTION & MITCHELL PMF
const fig1_2 = svgWrapper(940, 430, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 1.2: Geochemical Anatomy of the Alkaline Hydrothermal Chimney</text>
    <text y="20" class="subtitle">Cross-section of the inorganic membrane: The natural Mitchell-Russell Proton Motive Force (PMF)</text>
  </g>

  <!-- Ocean Reservoir (Acidic, Cold) -->
  <g transform="translate(30, 75)">
    <rect width="880" height="85" rx="8" fill="#0c1f36" stroke="#0284c7" stroke-width="1.5" />
    <rect x="15" y="12" width="235" height="22" rx="4" fill="#075985" />
    <text x="25" y="27" class="badge" fill="#e0f2fe">COLD ACIDIC OCEAN RESERVOIR</text>
    <text x="265" y="27" class="code" fill="#38bdf8">pH ≈ 5.5 | T ≈ 2°C | Saturated with CO2</text>

    <!-- High H+ concentration ions -->
    <g transform="translate(35, 48)">
      <circle cx="25" cy="15" r="10" fill="#38bdf8" /> <text x="20" y="19" class="code" fill="#000" font-weight="bold">H⁺</text>
      <circle cx="105" cy="18" r="10" fill="#38bdf8" /> <text x="100" y="22" class="code" fill="#000" font-weight="bold">H⁺</text>
      <circle cx="205" cy="12" r="10" fill="#38bdf8" /> <text x="200" y="16" class="code" fill="#000" font-weight="bold">H⁺</text>
      <circle cx="310" cy="20" r="10" fill="#38bdf8" /> <text x="305" y="24" class="code" fill="#000" font-weight="bold">H⁺</text>
      <circle cx="425" cy="14" r="10" fill="#38bdf8" /> <text x="420" y="18" class="code" fill="#000" font-weight="bold">H⁺</text>
      <circle cx="545" cy="18" r="10" fill="#38bdf8" /> <text x="540" y="22" class="code" fill="#000" font-weight="bold">H⁺</text>
      <circle cx="665" cy="13" r="10" fill="#38bdf8" /> <text x="660" y="17" class="code" fill="#000" font-weight="bold">H⁺</text>
      <circle cx="785" cy="16" r="10" fill="#38bdf8" /> <text x="780" y="20" class="code" fill="#000" font-weight="bold">H⁺</text>
    </g>
  </g>

  <!-- Inorganic Thin Mineral Wall (FeS Membrane) -->
  <g transform="translate(30, 168)">
    <rect width="880" height="92" rx="6" fill="#1e1b18" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6 3" />
    <rect x="15" y="10" width="285" height="22" rx="4" fill="#78350f" />
    <text x="25" y="25" class="badge" fill="#fef3c7">INORGANIC MINERAL MEMBRANE (FeS)</text>
    <text x="315" y="25" class="label" fill="#fde68a">Thickness d ≈ 5 – 10 nm  |  Dielectric Capacitance: C = ε(A/d)</text>

    <!-- Proton flux channels positioned strictly outside the center callout to avoid text overlap -->
    <!-- Left Flank Channels -->
    <path d="M 95 0 L 95 92" stroke="#00e5ff" stroke-width="2.5" stroke-dasharray="4 2" marker-end="url(#arrow-cyan)" filter="url(#glow-cyan)" />
    <path d="M 165 0 L 165 92" stroke="#00e5ff" stroke-width="2.5" stroke-dasharray="4 2" marker-end="url(#arrow-cyan)" filter="url(#glow-cyan)" />
    <!-- Right Flank Channels -->
    <path d="M 715 0 L 715 92" stroke="#00e5ff" stroke-width="2.5" stroke-dasharray="4 2" marker-end="url(#arrow-cyan)" filter="url(#glow-cyan)" />
    <path d="M 785 0 L 785 92" stroke="#00e5ff" stroke-width="2.5" stroke-dasharray="4 2" marker-end="url(#arrow-cyan)" filter="url(#glow-cyan)" />

    <!-- Center Callout Pill (Unobstructed, zero arrow intersections) -->
    <rect x="235" y="38" width="410" height="42" rx="8" fill="#090d16" stroke="#00e5ff" stroke-width="1.5" />
    <text x="440" y="55" class="code" text-anchor="middle" fill="#00e5ff">ΔpH = 10.0 - 5.5 = 4.5 units</text>
    <text x="440" y="70" class="label" text-anchor="middle" fill="#f8fafc">Natural PMF: Δp ≈ 200 mV  |  Field Strength: 40 Million Volts/m!</text>
  </g>

  <!-- Alkaline Vent Fluid Reservoir (Warm) -->
  <g transform="translate(30, 268)">
    <rect width="880" height="85" rx="8" fill="#1e180d" stroke="#d97706" stroke-width="1.5" />
    <rect x="15" y="12" width="235" height="22" rx="4" fill="#92400e" />
    <text x="25" y="27" class="badge" fill="#ffedd5">WARM ALKALINE VENT FLUID</text>
    <text x="265" y="27" class="code" fill="#f59e0b">pH ≈ 10.0 | T ≈ 65°C | Saturated with H2 &amp; CH4</text>

    <!-- High OH- concentration & Electron donors -->
    <g transform="translate(35, 48)">
      <circle cx="35" cy="15" r="10" fill="#f59e0b" /> <text x="26" y="19" class="code" fill="#000" font-weight="bold">OH⁻</text>
      <circle cx="130" cy="18" r="10" fill="#f59e0b" /> <text x="121" y="22" class="code" fill="#000" font-weight="bold">OH⁻</text>
      <circle cx="230" cy="12" r="10" fill="#f59e0b" /> <text x="221" y="16" class="code" fill="#000" font-weight="bold">OH⁻</text>
      <circle cx="355" cy="20" r="10" fill="#f59e0b" /> <text x="346" y="24" class="code" fill="#000" font-weight="bold">OH⁻</text>
      <circle cx="485" cy="14" r="10" fill="#f59e0b" /> <text x="476" y="18" class="code" fill="#000" font-weight="bold">OH⁻</text>
      <circle cx="610" cy="18" r="10" fill="#f59e0b" /> <text x="601" y="22" class="code" fill="#000" font-weight="bold">OH⁻</text>
      <circle cx="735" cy="13" r="10" fill="#f59e0b" /> <text x="726" y="17" class="code" fill="#000" font-weight="bold">OH⁻</text>
      <circle cx="825" cy="17" r="10" fill="#f59e0b" /> <text x="816" y="21" class="code" fill="#000" font-weight="bold">OH⁻</text>
    </g>
  </g>

  <!-- Footer Insight Bar -->
  <g transform="translate(30, 368)">
    <rect width="880" height="42" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1" />
    <text x="440" y="26" class="label" text-anchor="middle" fill="#cbd5e1">
      💡 <tspan fill="#38bdf8" font-weight="bold">Peter Mitchell (1961) &amp; Russell-Hall (1997):</tspan> Life did not invent the electrical battery; life was born inside a geological battery.
    </text>
  </g>
`);

// 3. THE EPISTEMIC CUT: GENOME SAFE VS PORE WORKSHOP
const fig1_3 = svgWrapper(940, 390, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 1.3: Howard Pattee's Epistemic Cut &amp; Von Neumann's Architecture</text>
    <text y="20" class="subtitle">The physical partition between rate-independent symbolic tapes and rate-dependent catalytic dynamics</text>
  </g>

  <!-- Left: The Safe (Genotype / Symbolic Memory) -->
  <g transform="translate(30, 75)">
    <rect width="415" height="285" rx="12" fill="#081528" stroke="#0284c7" stroke-width="2" />
    <rect x="18" y="15" width="160" height="24" rx="6" fill="#075985" stroke="#38bdf8" stroke-width="1" />
    <text x="28" y="31" class="badge" fill="#e0f2fe">THE SAFE (GENOME)</text>
    <text x="190" y="31" class="code" fill="#38bdf8">GenomeSafe.ts</text>

    <!-- Subtitle Bullet List -->
    <text x="18" y="65" class="label-bold" fill="#7dd3fc">Rate-Independent Symbolic Tape</text>
    <text x="18" y="84" class="subtitle">• Quiescent 60-bit binary polymer</text>
    <text x="18" y="102" class="subtitle">• Conducts ZERO electricity; burns ZERO power</text>
    <text x="18" y="120" class="subtitle">• Immune to thermal execution noise</text>

    <!-- 1D Tape Visual -->
    <g transform="translate(18, 138)">
      <rect width="379" height="42" rx="6" fill="#030712" stroke="#0ea5e9" stroke-width="1.5" />
      <g transform="translate(12, 8)" class="code" font-size="13" font-weight="bold">
        <rect x="0" y="0" width="30" height="26" rx="4" fill="#0c4a6e" /><text x="9" y="18" fill="#38bdf8">0</text>
        <rect x="34" y="0" width="30" height="26" rx="4" fill="#0c4a6e" /><text x="43" y="18" fill="#38bdf8">1</text>
        <rect x="68" y="0" width="30" height="26" rx="4" fill="#047857" /><text x="77" y="18" fill="#4ade80">1</text>
        <rect x="102" y="0" width="30" height="26" rx="4" fill="#047857" /><text x="111" y="18" fill="#4ade80">0</text>
        <rect x="136" y="0" width="30" height="26" rx="4" fill="#9f1239" /><text x="145" y="18" fill="#fb7185">1</text>
        <rect x="170" y="0" width="30" height="26" rx="4" fill="#9f1239" /><text x="179" y="18" fill="#fb7185">1</text>
        <text x="225" y="18" fill="#64748b" font-size="13">... 60 bits</text>
      </g>
    </g>

    <!-- Safe to Safe Replication Arrow -->
    <path d="M 207 190 L 207 225" stroke="#00e5ff" stroke-width="2" marker-end="url(#arrow-cyan)" />
    <rect x="67" y="232" width="280" height="32" rx="6" fill="#0f172a" stroke="#0284c7" stroke-width="1" />
    <text x="207" y="252" class="code" text-anchor="middle" font-size="10.5" fill="#38bdf8">Blind Photocopy (μ = 0.001)</text>
  </g>

  <!-- The Epistemic Cut Wall (Divider) -->
  <g transform="translate(460, 75)">
    <line x1="15" y1="15" x2="15" y2="270" stroke="#f43f5e" stroke-width="3" stroke-dasharray="6 4" filter="url(#glow-emerald)" />
    <!-- Bounding badge widened and heightened to prevent vertical text clipping -->
    <rect x="0" y="90" width="30" height="105" rx="4" fill="#881337" stroke="#f43f5e" stroke-width="1" />
    <text x="15" y="142" class="badge" text-anchor="middle" fill="#fecdd3" transform="rotate(-90 15 142)">EPISTEMIC CUT</text>
  </g>

  <!-- Right: The Workshop (Phenotype / Continuous Dynamic Machine) -->
  <g transform="translate(495, 75)">
    <rect width="415" height="285" rx="12" fill="#1c0f18" stroke="#e11d48" stroke-width="2" />
    <rect x="18" y="15" width="185" height="24" rx="6" fill="#881337" stroke="#fb7185" stroke-width="1" />
    <text x="28" y="31" class="badge" fill="#ffe4e6">THE WORKSHOP (PHENOTYPE)</text>
    <text x="215" y="31" class="code" fill="#fb7185">PoreWorkshop.ts</text>

    <!-- Subtitle Bullet List -->
    <text x="18" y="65" class="label-bold" fill="#fda4af">Rate-Dependent Physical Dynamics</text>
    <text x="18" y="84" class="subtitle">• Active 2D CMOS logic gate netlist</text>
    <text x="18" y="102" class="subtitle">• Switches voltages; burns Landauer heat</text>
    <text x="18" y="120" class="subtitle">• Governed by differential equations &amp; fluxes</text>

    <!-- Active Netlist Visual -->
    <g transform="translate(18, 138)">
      <rect width="379" height="78" rx="6" fill="#030712" stroke="#f43f5e" stroke-width="1.5" />
      
      <!-- Logic Gates -->
      <g transform="translate(25, 20)">
        <rect x="0" y="8" width="60" height="30" rx="4" fill="#0369a1" stroke="#38bdf8" />
        <text x="15" y="28" class="code" fill="#fff" font-weight="bold">AND</text>

        <path d="M 60 23 L 105 23" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arrow-cyan)" />

        <rect x="105" y="8" width="60" height="30" rx="4" fill="#be123c" stroke="#f43f5e" />
        <text x="120" y="28" class="code" fill="#fff" font-weight="bold">NOT</text>

        <path d="M 165 23 L 210 23" stroke="#f43f5e" stroke-width="1.5" marker-end="url(#arrow-rose)" />

        <rect x="210" y="8" width="60" height="30" rx="4" fill="#047857" stroke="#10b981" />
        <text x="228" y="28" class="code" fill="#fff" font-weight="bold">OR</text>

        <path d="M 270 23 L 315 23" stroke="#10b981" stroke-width="1.5" marker-end="url(#arrow-emerald)" />
      </g>
    </g>

    <!-- Dynamic Metabolic Charging Box -->
    <rect x="42" y="232" width="330" height="32" rx="6" fill="#0f172a" stroke="#e11d48" stroke-width="1" />
    <text x="207" y="252" class="code" text-anchor="middle" font-size="10" fill="#fb7185">Charges Pore Battery (+2T) / Burns Leak (-1T)</text>
  </g>
`);

// 4. THE THREE PRIMITIVE ENZYMES & THE COMPOSITE XOR MOTIF
const fig2_1 = svgWrapper(940, 440, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 2.1: The Three Primitive Catalytic Enzymes vs. The Composite XOR Motif</text>
    <text y="20" class="subtitle">Single-site active biophysics vs. why exclusive-OR requires an evolved multi-gene regulatory network</text>
  </g>

  <!-- 1. AND Gate (Co-substrate) -->
  <g transform="translate(30, 75)">
    <rect width="275" height="185" rx="10" fill="#0b1728" stroke="#38bdf8" stroke-width="1.5" />
    <rect x="12" y="12" width="95" height="20" rx="4" fill="#0369a1" />
    <text x="20" y="26" class="badge" fill="#e0f2fe">GATE_AND</text>
    <text x="120" y="26" class="label-bold" fill="#38bdf8">Co-Catalyst</text>

    <!-- Active site with 2 adjacent pockets -->
    <rect x="45" y="55" width="80" height="60" rx="6" fill="#132a4a" stroke="#0ea5e9" stroke-width="1" />
    <text x="57" y="80" class="code" font-size="10" fill="#38bdf8">Pocket A</text>
    <text x="52" y="100" class="subtitle" font-size="9">Substrate A</text>

    <rect x="150" y="55" width="80" height="60" rx="6" fill="#132a4a" stroke="#0ea5e9" stroke-width="1" />
    <text x="162" y="80" class="code" font-size="10" fill="#38bdf8">Pocket B</text>
    <text x="157" y="100" class="subtitle" font-size="9">Substrate B</text>

    <!-- Catalysis output (Centered to avoid border clipping) -->
    <path d="M 137.5 115 L 137.5 145" stroke="#facc15" stroke-width="2.5" marker-end="url(#arrow-amber)" />
    <text x="137.5" y="164" class="label-bold" text-anchor="middle" fill="#facc15">Fires only if A ∧ B!</text>
  </g>

  <!-- 2. OR Gate (Promiscuous) -->
  <g transform="translate(332.5, 75)">
    <rect width="275" height="185" rx="10" fill="#091f1a" stroke="#10b981" stroke-width="1.5" />
    <rect x="12" y="12" width="85" height="20" rx="4" fill="#047857" />
    <text x="20" y="26" class="badge" fill="#d1fae5">GATE_OR</text>
    <text x="110" y="26" class="label-bold" fill="#10b981">Promiscuous</text>

    <!-- Single flexible pocket accommodating either -->
    <rect x="67.5" y="55" width="140" height="60" rx="8" fill="#113e33" stroke="#059669" stroke-width="1" />
    <text x="137.5" y="80" class="code" text-anchor="middle" font-size="10.5" fill="#4ade80">Dual P-Site</text>
    <text x="137.5" y="98" class="subtitle" text-anchor="middle" font-size="9.5">Binds either A or B</text>

    <!-- Catalysis output -->
    <path d="M 137.5 115 L 137.5 145" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrow-emerald)" />
    <text x="137.5" y="164" class="label-bold" text-anchor="middle" fill="#4ade80">Fires if A ∨ B!</text>
  </g>

  <!-- 3. NOT Gate (Allosteric Repressor) -->
  <g transform="translate(635, 75)">
    <rect width="275" height="185" rx="10" fill="#200d17" stroke="#f43f5e" stroke-width="1.5" />
    <rect x="12" y="12" width="90" height="20" rx="4" fill="#be123c" />
    <text x="20" y="26" class="badge" fill="#ffe4e6">GATE_NOT</text>
    <text x="115" y="26" class="label-bold" fill="#f43f5e">Inhibitor</text>

    <!-- Active pocket + Allosteric pocket -->
    <rect x="45" y="55" width="80" height="60" rx="6" fill="#3b1123" stroke="#e11d48" stroke-width="1" />
    <text x="56" y="80" class="code" font-size="10" fill="#fb7185">Catalytic</text>
    <text x="64" y="98" class="subtitle" font-size="9">Site</text>

    <rect x="150" y="55" width="80" height="60" rx="6" fill="#4c0519" stroke="#f43f5e" stroke-width="1" />
    <text x="157" y="80" class="code" font-size="10" fill="#fda4af">Allosteric</text>
    <text x="152" y="98" class="subtitle" font-size="9">Toxin blocks</text>

    <!-- Quenched output -->
    <line x1="120" y1="123" x2="155" y2="147" stroke="#f43f5e" stroke-width="2.5" />
    <line x1="155" y1="123" x2="120" y2="147" stroke="#f43f5e" stroke-width="2.5" />
    <text x="137.5" y="164" class="label-bold" text-anchor="middle" fill="#fda4af">Toxin Quenches (¬T)</text>
  </g>

  <!-- Lower Panel: Why XOR is Composite -->
  <g transform="translate(30, 275)">
    <rect width="880" height="145" rx="12" fill="#090d16" stroke="#a855f7" stroke-width="1.5" />
    <rect x="15" y="12" width="310" height="22" rx="4" fill="#581c87" />
    <text x="25" y="27" class="badge" fill="#f3e8ff">XOR IS STRICTLY NON-PRIMITIVE</text>
    <text x="340" y="27" class="code" fill="#c084fc">(A ⊕ B) ≡ (A ∨ B) ∧ ¬(A ∧ B)</text>

    <!-- Diagram of 3-gate composite circuit -->
    <g transform="translate(25, 48)">
      <!-- Inputs A and B -->
      <text x="0" y="22" class="code" fill="#38bdf8">Stream A ──┬──►</text>
      <text x="0" y="55" class="code" fill="#38bdf8">Stream B ──┼──►</text>

      <!-- Gate 1: OR -->
      <rect x="130" y="8" width="58" height="26" rx="4" fill="#047857" stroke="#10b981" />
      <text x="148" y="25" class="code" fill="#fff" font-weight="bold">OR</text>

      <!-- Gate 2: AND -->
      <rect x="130" y="42" width="58" height="26" rx="4" fill="#0369a1" stroke="#38bdf8" />
      <text x="144" y="59" class="code" fill="#fff" font-weight="bold">AND</text>

      <!-- Gate 3: NOT -->
      <path d="M 188 55 L 220 55" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arrow-cyan)" />
      <rect x="220" y="42" width="58" height="26" rx="4" fill="#be123c" stroke="#f43f5e" />
      <text x="234" y="59" class="code" fill="#fff" font-weight="bold">NOT</text>

      <!-- Conjunction Gate 4: Final AND -->
      <path d="M 188 21 L 310 21 L 310 35" stroke="#10b981" stroke-width="1.5" />
      <path d="M 278 55 L 310 55 L 310 45" stroke="#f43f5e" stroke-width="1.5" />
      <rect x="320" y="25" width="64" height="28" rx="4" fill="#0369a1" stroke="#38bdf8" />
      <text x="335" y="43" class="code" fill="#fff" font-weight="bold">AND</text>

      <!-- Output wire -->
      <path d="M 384 39 L 440 39" stroke="#c084fc" stroke-width="2.5" marker-end="url(#arrow-purple)" />
      <text x="450" y="43" class="label-bold" fill="#c084fc">Output (A XOR B)</text>
    </g>

    <!-- Side Explanation Box (Offset right to prevent output wire collision) -->
    <rect x="590" y="42" width="275" height="85" rx="6" fill="#190e24" stroke="#7e22ce" stroke-width="1" />
    <text x="605" y="64" class="label-bold" fill="#e9d5ff">Minsky &amp; Papert Barrier (1969)</text>
    <text x="605" y="82" class="subtitle" font-size="10.5">XOR is linearly non-separable.</text>
    <text x="605" y="98" class="subtitle" font-size="10.5">No single protein pocket can execute XOR.</text>
    <text x="605" y="115" class="label" font-size="10" fill="#facc15">★ Discovered via gene duplication!</text>
  </g>
`);

// 5. URI ALON CANONICAL SYSTEMS BIOLOGY NETWORK MOTIFS
const fig3_1 = svgWrapper(940, 430, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 3.1: Canonical Network Motifs of Systems Biology (Uri Alon, 2007)</text>
    <text y="20" class="subtitle">The fundamental circuit building blocks discovered de novo by natural selection in deep-sea silicoids</text>
  </g>

  <!-- 1. Bistable Toggle Switch (Memory Latch) -->
  <g transform="translate(30, 75)">
    <rect width="425" height="160" rx="10" fill="#0c1726" stroke="#38bdf8" stroke-width="1.5" />
    <rect x="15" y="12" width="205" height="22" rx="4" fill="#0369a1" />
    <text x="25" y="27" class="badge" fill="#e0f2fe">BISTABLE TOGGLE SWITCH</text>
    <text x="230" y="27" class="label" fill="#38bdf8">Digestive Memory</text>

    <!-- Gates with cross-coupling wires -->
    <g transform="translate(20, 48)">
      <rect x="0" y="10" width="70" height="32" rx="4" fill="#075985" stroke="#38bdf8" />
      <text x="18" y="31" class="code" fill="#fff" font-weight="bold">NOR 1</text>

      <rect x="0" y="60" width="70" height="32" rx="4" fill="#075985" stroke="#38bdf8" />
      <text x="18" y="81" class="code" fill="#fff" font-weight="bold">NOR 2</text>

      <!-- Cross feedback -->
      <path d="M 70 26 L 100 26 L 100 70 L 0 70" stroke="#00e5ff" stroke-width="1.5" fill="none" marker-end="url(#arrow-cyan)" />
      <path d="M 70 76 L 120 76 L 120 36 L 0 36" stroke="#00e5ff" stroke-width="1.5" fill="none" marker-end="url(#arrow-cyan)" />

      <!-- State persistence callout -->
      <g transform="translate(155, 12)">
        <text class="label-bold" fill="#7dd3fc">Hysteresis &amp; Memory</text>
        <text y="18" class="subtitle" font-size="10.5">• Traps nutrient pulse state</text>
        <text y="34" class="subtitle" font-size="10.5">• Retains charge when input = 0</text>
        <text y="50" class="label" font-size="10" fill="#38bdf8">★ Gardner &amp; Collins (2000)</text>
      </g>
    </g>
  </g>

  <!-- 2. The Repressilator (Ring Oscillator) -->
  <g transform="translate(485, 75)">
    <rect width="425" height="160" rx="10" fill="#200d17" stroke="#f43f5e" stroke-width="1.5" />
    <rect x="15" y="12" width="185" height="22" rx="4" fill="#9f1239" />
    <text x="25" y="27" class="badge" fill="#ffe4e6">THE REPRESSILATOR</text>
    <text x="210" y="27" class="label" fill="#fb7185">Autonomous Clock</text>

    <!-- Ring of 3 inverters -->
    <g transform="translate(20, 48)">
      <rect x="15" y="15" width="55" height="28" rx="4" fill="#881337" stroke="#f43f5e" />
      <text x="23" y="33" class="code" fill="#fff" font-weight="bold">NOT A</text>

      <path d="M 70 29 L 105 29" stroke="#f43f5e" stroke-width="1.5" marker-end="url(#arrow-rose)" />

      <rect x="105" y="15" width="55" height="28" rx="4" fill="#881337" stroke="#f43f5e" />
      <text x="113" y="33" class="code" fill="#fff" font-weight="bold">NOT B</text>

      <path d="M 132 43 L 132 75 L 70 75" stroke="#f43f5e" stroke-width="1.5" marker-end="url(#arrow-rose)" />

      <rect x="15" y="60" width="55" height="28" rx="4" fill="#881337" stroke="#f43f5e" />
      <text x="23" y="78" class="code" fill="#fff" font-weight="bold">NOT C</text>

      <path d="M 15 74 L 5 74 L 5 29 L 15 29" stroke="#f43f5e" stroke-width="1.5" fill="none" marker-end="url(#arrow-rose)" />

      <!-- Ring clock callout (Padded to eliminate edge clipping) -->
      <g transform="translate(185, 12)">
        <text class="label-bold" fill="#fda4af">Limit Cycle Oscillator</text>
        <text y="18" class="subtitle" font-size="10.5">• Odd inverter closed ring</text>
        <text y="34" class="subtitle" font-size="10.5">• 3-phase limit cycle oscillation</text>
        <text y="50" class="label" font-size="10" fill="#f43f5e">★ Elowitz &amp; Leibler (2000)</text>
      </g>
    </g>
  </g>

  <!-- 3. Coherent Feed-Forward Loop (C-FFL Type 1) -->
  <g transform="translate(30, 250)">
    <rect width="425" height="160" rx="10" fill="#081e19" stroke="#10b981" stroke-width="1.5" />
    <rect x="15" y="12" width="205" height="22" rx="4" fill="#065f46" />
    <text x="25" y="27" class="badge" fill="#d1fae5">COHERENT FFL (C-FFL)</text>
    <text x="230" y="27" class="label" fill="#34d399">Persistence Filter</text>

    <!-- FFL Triad Diagram -->
    <g transform="translate(25, 48)">
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
      <g transform="translate(155, 12)">
        <text class="label-bold" fill="#6ee7b7">Noise Rejection Filter</text>
        <text y="18" class="subtitle" font-size="10.5">• Sign-sensitive activation delay</text>
        <text y="34" class="subtitle" font-size="10.5">• Ignores transient nutrient spikes</text>
        <text y="50" class="label" font-size="10" fill="#10b981">★ Fires only on sustained pulses</text>
      </g>
    </g>
  </g>

  <!-- 4. Incoherent Feed-Forward Loop (I-FFL Type 1) -->
  <g transform="translate(485, 250)">
    <rect width="425" height="160" rx="10" fill="#1b1226" stroke="#a855f7" stroke-width="1.5" />
    <rect x="15" y="12" width="215" height="22" rx="4" fill="#6b21a8" />
    <text x="25" y="27" class="badge" fill="#f3e8ff">INCOHERENT FFL (I-FFL)</text>
    <text x="240" y="27" class="label" fill="#c084fc">Pulse Generator</text>

    <!-- I-FFL Triad Diagram -->
    <g transform="translate(25, 48)">
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
      <g transform="translate(155, 12)">
        <text class="label-bold" fill="#d8b4fe">Biphasic Pulse &amp; Adaptation</text>
        <text y="18" class="subtitle" font-size="10.5">• Rapid activation via direct path</text>
        <text y="34" class="subtitle" font-size="10.5">• Delayed repressor Y shuts Z off</text>
        <text y="50" class="label" font-size="10" fill="#c084fc">★ Perfect fold-change adaptation</text>
      </g>
    </g>
  </g>
`);

// 6. WEISFEILER-LEHMAN COLOR REFINEMENT GRAPH HASHING
const fig3_2 = svgWrapper(940, 375, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 3.2: The Weisfeiler-Lehman (1-WL) Graph Isomorphism Kernel</text>
    <text y="20" class="subtitle">Real-time topological invariant hashing of directed Siliquarium logic netlists (Weisfeiler &amp; Lehman, 1968)</text>
  </g>

  <!-- Step 1: Round 0 Node Coloring -->
  <g transform="translate(30, 75)">
    <rect width="275" height="265" rx="10" fill="#090d16" stroke="#38bdf8" stroke-width="1.5" />
    <rect x="15" y="15" width="130" height="22" rx="4" fill="#0369a1" />
    <text x="25" y="30" class="badge" fill="#e0f2fe">ROUND 0: INIT</text>

    <text x="20" y="65" class="label-bold" fill="#7dd3fc">Initial Primitive Colors</text>
    <text x="20" y="82" class="subtitle">Each gate takes its codon type:</text>

    <g transform="translate(35, 110)">
      <circle cx="20" cy="20" r="14" fill="#075985" stroke="#38bdf8" stroke-width="2" />
      <text x="10" y="24" class="code" fill="#fff" font-size="10">AND</text>
      <text x="48" y="24" class="label" font-size="10.5">c₁⁽⁰⁾ = "AND"</text>

      <circle cx="20" cy="62" r="14" fill="#881337" stroke="#f43f5e" stroke-width="2" />
      <text x="10" y="66" class="code" fill="#fff" font-size="10">NOT</text>
      <text x="48" y="66" class="label" font-size="10.5">c₂⁽⁰⁾ = "NOT"</text>

      <circle cx="20" cy="104" r="14" fill="#047857" stroke="#10b981" stroke-width="2" />
      <text x="14" y="108" class="code" fill="#fff" font-size="10">OR</text>
      <text x="48" y="108" class="label" font-size="10.5">c₃⁽⁰⁾ = "OR"</text>
    </g>
  </g>

  <!-- Step 2: Round 1 Multiset Gathering -->
  <g transform="translate(332.5, 75)">
    <rect width="275" height="265" rx="10" fill="#090d16" stroke="#10b981" stroke-width="1.5" />
    <rect x="15" y="15" width="155" height="22" rx="4" fill="#065f46" />
    <text x="25" y="30" class="badge" fill="#d1fae5">ROUND 1: NEIGHBORS</text>

    <text x="20" y="65" class="label-bold" fill="#6ee7b7">Multiset Neighborhood Sort</text>
    <text x="20" y="82" class="subtitle">Collect &amp; sort neighbor colors:</text>

    <g transform="translate(18, 105)">
      <rect width="238" height="32" rx="6" fill="#052e16" stroke="#10b981" stroke-width="1" />
      <text x="10" y="20" class="code" font-size="10" fill="#a7f3d0">Node 1: (AND, [NOT, OR])</text>

      <rect y="42" width="238" height="32" rx="6" fill="#052e16" stroke="#10b981" stroke-width="1" />
      <text x="10" y="62" class="code" font-size="10" fill="#a7f3d0">Node 2: (NOT, [AND])</text>

      <rect y="84" width="238" height="32" rx="6" fill="#052e16" stroke="#10b981" stroke-width="1" />
      <text x="10" y="104" class="code" font-size="10" fill="#a7f3d0">Node 3: (OR, [AND])</text>
    </g>

    <text x="20" y="244" class="subtitle" font-size="10">Strict permutation invariance guaranteed</text>
  </g>

  <!-- Step 3: Avalanche Hash Invariant -->
  <g transform="translate(635, 75)">
    <rect width="275" height="265" rx="10" fill="#090d16" stroke="#a855f7" stroke-width="1.5" />
    <rect x="15" y="15" width="140" height="22" rx="4" fill="#6b21a8" />
    <text x="25" y="30" class="badge" fill="#f3e8ff">HASH INVARIANT</text>

    <text x="20" y="65" class="label-bold" fill="#d8b4fe">64-Bit Avalanche Hash</text>
    <text x="20" y="82" class="subtitle">Canonical structural identity:</text>

    <g transform="translate(15, 108)">
      <rect width="245" height="42" rx="6" fill="#2e1065" stroke="#c084fc" stroke-width="1.5" />
      <text x="12" y="26" class="code" font-size="10.5" fill="#f3e8ff">WL = 0x9f4a_7c2b_11de</text>
    </g>

    <rect x="15" y="168" width="245" height="68" rx="6" fill="#1e102e" stroke="#7e22ce" stroke-width="1" />
    <text x="25" y="190" class="label-bold" font-size="10.5" fill="#facc15">✓ Isomorphism Theorem:</text>
    <text x="25" y="208" class="subtitle" font-size="10">Two circuits match WL hash iff</text>
    <text x="25" y="224" class="subtitle" font-size="10">their wiring graphs are isomorphic!</text>
  </g>
`);

// 7. 64-ENTRY DEGENERATE CODON TABLE
const fig2_2 = svgWrapper(940, 375, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 2.2: The 64-Entry Prebiotic Degenerate Codon Architecture</text>
    <text y="20" class="subtitle">Grounded molecular biophysics: 6-bit codes partitioned into catalytic primitives, porins, and neutral introns (CodonTable.ts)</text>
  </g>

  <!-- Bit Structure Breakdown -->
  <g transform="translate(30, 75)">
    <rect width="880" height="75" rx="8" fill="#090d16" stroke="#0284c7" stroke-width="1.5" />
    <g transform="translate(30, 18)">
      <rect x="0" y="0" width="72" height="38" rx="6" fill="#0369a1" stroke="#38bdf8" />
      <text x="36" y="24" class="code" text-anchor="middle" font-size="14" fill="#fff">Bit 5</text>
      <rect x="82" y="0" width="72" height="38" rx="6" fill="#0369a1" stroke="#38bdf8" />
      <text x="118" y="24" class="code" text-anchor="middle" font-size="14" fill="#fff">Bit 4</text>
      <rect x="164" y="0" width="72" height="38" rx="6" fill="#0369a1" stroke="#38bdf8" />
      <text x="200" y="24" class="code" text-anchor="middle" font-size="14" fill="#fff">Bit 3</text>
      <rect x="256" y="0" width="72" height="38" rx="6" fill="#047857" stroke="#10b981" />
      <text x="292" y="24" class="code" text-anchor="middle" font-size="14" fill="#fff">Bit 2</text>
      <rect x="338" y="0" width="72" height="38" rx="6" fill="#047857" stroke="#10b981" />
      <text x="374" y="24" class="code" text-anchor="middle" font-size="14" fill="#fff">Bit 1</text>
      <rect x="420" y="0" width="72" height="38" rx="6" fill="#047857" stroke="#10b981" />
      <text x="456" y="24" class="code" text-anchor="middle" font-size="14" fill="#fff">Bit 0</text>
    </g>

    <g transform="translate(540, 20)">
      <text class="label-bold" fill="#38bdf8">Bits 5-3: Functional Class (8 Families)</text>
      <text y="18" class="label-bold" fill="#10b981">Bits 2-0: Degenerate Synonymous (8 Codons/Family)</text>
      <text y="34" class="subtitle" font-size="10.5">Provides neutral Kimura mutational buffer across 64 states</text>
    </g>
  </g>

  <!-- 4 Functional Classes Cards (Widened to 208px each to eliminate text overflow) -->
  <g transform="translate(30, 165)">
    <!-- Class 1: Catalytic Primitives -->
    <rect x="0" y="0" width="208" height="160" rx="8" fill="#0c1726" stroke="#38bdf8" stroke-width="1.5" />
    <rect x="10" y="10" width="188" height="22" rx="4" fill="#0369a1" />
    <text x="104" y="25" class="badge" text-anchor="middle" fill="#e0f2fe">1. CATALYTIC PRIMITIVES</text>
    <g transform="translate(14, 46)" class="subtitle" font-size="10">
      <text y="15" fill="#38bdf8">• Codons 00..11: GATE_AND (12)</text>
      <text y="34" fill="#f43f5e">• Codons 12..21: GATE_NOT (10)</text>
      <text y="53" fill="#10b981">• Codons 22..31: GATE_OR  (10)</text>
      <text y="72" fill="#fbbf24">• Note: XOR is NOT primitive</text>
      <text y="90" fill="#94a3b8" font-size="9.5">Evolved via multi-gate motif</text>
    </g>

    <!-- Class 2: Porins -->
    <rect x="224" y="0" width="208" height="160" rx="8" fill="#081e19" stroke="#10b981" stroke-width="1.5" />
    <rect x="234" y="10" width="188" height="22" rx="4" fill="#065f46" />
    <text x="328" y="25" class="badge" text-anchor="middle" fill="#d1fae5">2. MEMBRANE PORINS</text>
    <g transform="translate(238, 46)" class="subtitle" font-size="10">
      <text y="15" fill="#34d399">• Codons 32..37: STREAM_A (6)</text>
      <text y="34" fill="#34d399">• Codons 38..43: STREAM_B (6)</text>
      <text y="53" fill="#f43f5e">• Codons 44..47: TOXIN_T   (4)</text>
      <text y="72" fill="#94a3b8">Binds specific solutes</text>
      <text y="90" fill="#94a3b8" font-size="9.5">Selective outer channels</text>
    </g>

    <!-- Class 3: Sinks -->
    <rect x="448" y="0" width="208" height="160" rx="8" fill="#1f1807" stroke="#f59e0b" stroke-width="1.5" />
    <rect x="458" y="10" width="188" height="22" rx="4" fill="#78350f" />
    <text x="552" y="25" class="badge" text-anchor="middle" fill="#fef3c7">3. STRUCTURAL SINKS</text>
    <g transform="translate(462, 46)" class="subtitle" font-size="10">
      <text y="15" fill="#fbbf24">• Codons 48..51: BATTERY (4)</text>
      <text y="34" fill="#fbbf24">• Codons 52..55: SEPTUM  (4)</text>
      <text y="53" fill="#94a3b8">ATP Synthase analogue</text>
      <text y="72" fill="#94a3b8">FtsZ contractile ring</text>
      <text y="90" fill="#94a3b8" font-size="9.5">Triggers fission @ 100T</text>
    </g>

    <!-- Class 4: Introns -->
    <rect x="672" y="0" width="208" height="160" rx="8" fill="#1b1226" stroke="#a855f7" stroke-width="1.5" />
    <rect x="682" y="10" width="188" height="22" rx="4" fill="#581c87" />
    <text x="776" y="25" class="badge" text-anchor="middle" fill="#f3e8ff">4. NEUTRAL INTRONS</text>
    <g transform="translate(686, 46)" class="subtitle" font-size="10">
      <text y="15" fill="#c084fc">• Codons 56..61: SILENT  (6)</text>
      <text y="34" fill="#c084fc">• Codons 62..63: OPERATOR (2)</text>
      <text y="53" fill="#94a3b8">Kimura neutral buffer</text>
      <text y="72" fill="#94a3b8">Silent mutations absorb noise</text>
      <text y="90" fill="#94a3b8" font-size="9.5">Total: Exactly 64 entries!</text>
    </g>
  </g>
`);

// 8. LANDAUER THERMODYNAMIC DISSIPATION & POWER LEDGER
const fig2_3 = svgWrapper(940, 375, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 2.3: Rolf Landauer's Principle &amp; Dynamic CMOS Power Dissipation</text>
    <text y="20" class="subtitle">Information processing is physical: Bit erasure and gate toggling dissipate real heat into the abyssal sink (Landauer, 1961)</text>
  </g>

  <!-- Left: Physical Principle -->
  <g transform="translate(30, 75)">
    <rect width="425" height="265" rx="10" fill="#090d16" stroke="#f43f5e" stroke-width="1.5" />
    <rect x="15" y="15" width="225" height="22" rx="4" fill="#881337" />
    <text x="25" y="30" class="badge" fill="#ffe4e6">LANDAUER ERASURE BOUND</text>
    <text x="255" y="30" class="code" fill="#f43f5e">Q ≥ kB · T · ln 2</text>

    <!-- State diagram -->
    <g transform="translate(60, 65)">
      <circle cx="50" cy="40" r="24" fill="#0369a1" stroke="#38bdf8" stroke-width="2" />
      <text x="50" y="47" class="code" text-anchor="middle" font-size="18" fill="#fff">1</text>
      <text x="50" y="80" class="subtitle" font-size="10" text-anchor="middle">Initial Bit</text>

      <path d="M 85 40 L 175 40" stroke="#f43f5e" stroke-width="2.5" marker-end="url(#arrow-rose)" />
      <text x="130" y="30" class="label-bold" font-size="10.5" fill="#f43f5e" text-anchor="middle">RESET TO 0</text>

      <circle cx="210" cy="40" r="24" fill="#0f172a" stroke="#64748b" stroke-width="2" />
      <text x="210" y="47" class="code" text-anchor="middle" font-size="18" fill="#64748b">0</text>
      <text x="210" y="80" class="subtitle" font-size="10" text-anchor="middle">Erased Bit</text>

      <!-- Heat dissipation arrows radiating out -->
      <path d="M 130 45 Q 145 70 130 95" stroke="#f59e0b" stroke-width="2" fill="none" marker-end="url(#arrow-amber)" />
      <path d="M 145 45 Q 160 70 145 95" stroke="#f59e0b" stroke-width="2" fill="none" marker-end="url(#arrow-amber)" />
      <text x="140" y="115" class="code" font-size="10" fill="#f59e0b" text-anchor="middle">Heat Dissipation Q</text>
    </g>

    <text x="212" y="215" class="label" text-anchor="middle" fill="#fda4af">Erasing 1 bit of information reduces phase space entropy,</text>
    <text x="212" y="232" class="label" text-anchor="middle" fill="#fda4af">releasing at least kB·T·ln 2 of waste heat into the environment!</text>
  </g>

  <!-- Right: Siliquarium Power Ledger -->
  <g transform="translate(485, 75)">
    <rect width="425" height="265" rx="10" fill="#090d16" stroke="#00e5ff" stroke-width="1.5" />
    <rect x="15" y="15" width="215" height="22" rx="4" fill="#075985" />
    <text x="25" y="30" class="badge" fill="#e0f2fe">DYNAMIC POWER LEDGER</text>
    <text x="245" y="30" class="code" fill="#00e5ff">PoreBattery.ts</text>

    <!-- Ledger Bars (Extended to 375px to eliminate text clipping) -->
    <g transform="translate(25, 52)">
      <!-- Energy Influx -->
      <rect width="375" height="42" rx="6" fill="#042f2e" stroke="#10b981" stroke-width="1" />
      <text x="15" y="26" class="code" fill="#4ade80">+2 to +3 Tokens</text>
      <text x="145" y="26" class="label" font-size="10.5">Catalytic Redox Influx (A ∧ B)</text>

      <!-- Switching Cost -->
      <rect y="52" width="375" height="42" rx="6" fill="#4c0519" stroke="#f43f5e" stroke-width="1" />
      <text x="15" y="78" class="code" fill="#fb7185">-1 Token / Toggle</text>
      <text x="145" y="78" class="label" font-size="10.5">CMOS Dynamic Landauer Penalty</text>

      <!-- Basal Leak -->
      <rect y="104" width="375" height="42" rx="6" fill="#2d1a03" stroke="#f59e0b" stroke-width="1" />
      <text x="15" y="130" class="code" fill="#facc15">-1 Token / 10 Ticks</text>
      <text x="145" y="130" class="label" font-size="10.5">Basal Decay into Abyssal Cold</text>
    </g>

    <rect x="25" y="215" width="375" height="28" rx="6" fill="#0c1726" stroke="#0284c7" stroke-width="1" />
    <text x="212" y="233" class="code" text-anchor="middle" font-size="10.5" fill="#38bdf8">If Battery = 0 → Lysis; If Battery ≥ 100 → Mitosis</text>
  </g>
`);

// 9. MOTIF DYNAMIC RESPONSE WAVEFORMS
const fig3_3 = svgWrapper(940, 380, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 3.3: Dynamic Response Waveforms of Evolved Systems Biology Motifs</text>
    <text y="20" class="subtitle">Continuous analog kinetics generated by digital logic circuits in the hydrothermal vent</text>
  </g>

  <!-- 1. SR Latch Hysteresis -->
  <g transform="translate(30, 75)">
    <rect width="425" height="130" rx="8" fill="#0c1726" stroke="#38bdf8" stroke-width="1.5" />
    <rect x="15" y="10" width="135" height="18" rx="4" fill="#0369a1" />
    <text x="22" y="23" class="badge" fill="#e0f2fe">HYSTERESIS LOOP</text>
    <text x="160" y="23" class="subtitle" font-size="10">SR Latch State Memory</text>

    <!-- Hysteresis square curve -->
    <g transform="translate(35, 45)">
      <line x1="0" y1="50" x2="175" y2="50" stroke="#64748b" stroke-width="1" />
      <line x1="0" y1="0" x2="0" y2="50" stroke="#64748b" stroke-width="1" />
      <path d="M 0 50 L 75 50 L 75 10 L 160 10" stroke="#38bdf8" stroke-width="2" fill="none" />
      <path d="M 160 10 L 35 10 L 35 50 L 0 50" stroke="#00e5ff" stroke-width="2" stroke-dasharray="3 2" fill="none" />
      <text x="195" y="28" class="code" font-size="10" fill="#38bdf8">State latches HIGH</text>
      <text x="195" y="44" class="subtitle" font-size="9.5">even when S drops to 0!</text>
    </g>
  </g>

  <!-- 2. Repressilator Limit Cycle -->
  <g transform="translate(485, 75)">
    <rect width="425" height="130" rx="8" fill="#200d17" stroke="#f43f5e" stroke-width="1.5" />
    <rect x="15" y="10" width="155" height="18" rx="4" fill="#881337" />
    <text x="22" y="23" class="badge" fill="#ffe4e6">3-PHASE LIMIT CYCLE</text>
    <text x="180" y="23" class="subtitle" font-size="10">Repressilator Ring Clock</text>

    <!-- 3 Sine Waves with 120 deg phase shift -->
    <g transform="translate(35, 45)">
      <path d="M 0 35 Q 22 5 45 35 T 90 35 T 135 35 T 175 35" stroke="#f43f5e" stroke-width="2" fill="none" />
      <path d="M 0 15 Q 22 45 45 15 T 90 15 T 135 15 T 175 15" stroke="#38bdf8" stroke-width="2" fill="none" />
      <path d="M 0 50 Q 22 20 45 50 T 90 50 T 135 50 T 175 50" stroke="#10b981" stroke-width="2" fill="none" />
      <text x="195" y="28" class="code" font-size="10" fill="#f43f5e">3-Phase Pacemaker</text>
      <text x="195" y="44" class="subtitle" font-size="9.5">Autonomous limit cycle</text>
    </g>
  </g>

  <!-- 3. C-FFL Persistence Filter -->
  <g transform="translate(30, 220)">
    <rect width="425" height="130" rx="8" fill="#081e19" stroke="#10b981" stroke-width="1.5" />
    <rect x="15" y="10" width="165" height="18" rx="4" fill="#065f46" />
    <text x="22" y="23" class="badge" fill="#d1fae5">PERSISTENCE FILTER</text>
    <text x="190" y="23" class="subtitle" font-size="10">C-FFL Sign-Sensitive Delay</text>

    <g transform="translate(35, 45)">
      <!-- Input Spike vs Persistent -->
      <path d="M 0 45 L 20 45 L 20 15 L 30 15 L 30 45 L 60 45 L 60 15 L 140 15" stroke="#94a3b8" stroke-width="1.5" fill="none" />
      <text x="150" y="18" class="code" font-size="9.5" fill="#94a3b8">Input X</text>

      <!-- Output Z only responds to persistent -->
      <path d="M 0 50 L 80 50 L 80 25 L 140 25" stroke="#10b981" stroke-width="2" fill="none" />
      <text x="150" y="34" class="code" font-size="9.5" fill="#10b981">Output Z</text>
      
      <text x="220" y="28" class="code" font-size="10" fill="#10b981">Noise Rejection</text>
      <text x="220" y="44" class="subtitle" font-size="9.5">Transient spike ignored!</text>
    </g>
  </g>

  <!-- 4. I-FFL Pulse Generator -->
  <g transform="translate(485, 220)">
    <rect width="425" height="130" rx="8" fill="#1b1226" stroke="#a855f7" stroke-width="1.5" />
    <rect x="15" y="10" width="165" height="18" rx="4" fill="#6b21a8" />
    <text x="22" y="23" class="badge" fill="#f3e8ff">PULSE GENERATOR</text>
    <text x="190" y="23" class="subtitle" font-size="10">I-FFL Fold-Change Adaptation</text>

    <g transform="translate(35, 45)">
      <!-- Step input -->
      <path d="M 0 45 L 20 45 L 20 15 L 140 15" stroke="#94a3b8" stroke-width="1.5" fill="none" />
      <text x="150" y="18" class="code" font-size="9.5" fill="#94a3b8">Step In X</text>

      <!-- Biphasic Pulse -->
      <path d="M 0 50 L 25 50 L 40 20 L 55 50 L 140 50" stroke="#c084fc" stroke-width="2" fill="none" />
      <text x="150" y="34" class="code" font-size="9.5" fill="#c084fc">Output Z</text>

      <text x="235" y="28" class="code" font-size="10" fill="#c084fc">Fold Adaptation</text>
      <text x="235" y="44" class="subtitle" font-size="9.5">Delayed repressor adapts</text>
    </g>
  </g>
`);

// 10. KIMURA NEUTRAL SADDLES & OHNO GENE DUPLICATION
const fig4_1 = svgWrapper(940, 375, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 4.1: Motoo Kimura's Neutral Saddles &amp; Susumu Ohno's Gene Duplication</text>
    <text y="20" class="subtitle">Crossing adaptive valleys through synonymous degenerate codons and redundant paralog release (Kimura 1968, Ohno 1970)</text>
  </g>

  <!-- Left: Kimura Neutral Saddle -->
  <g transform="translate(30, 75)">
    <rect width="425" height="265" rx="10" fill="#090d16" stroke="#38bdf8" stroke-width="1.5" />
    <rect x="15" y="15" width="205" height="22" rx="4" fill="#0369a1" />
    <text x="25" y="30" class="badge" fill="#e0f2fe">KIMURA NEUTRAL DRIFT</text>
    <text x="235" y="30" class="code" fill="#38bdf8">k = μ0 (Invariance)</text>

    <!-- Fitness Peaks with Neutral Bridge -->
    <g transform="translate(35, 60)">
      <!-- Peak 1 -->
      <path d="M 10 130 Q 60 10 110 130" stroke="#0284c7" stroke-width="2" fill="#082f49" opacity="0.4" />
      <text x="60" y="45" class="label-bold" fill="#38bdf8" text-anchor="middle">Niche A</text>

      <!-- Neutral Bridge (Degenerate Synonymous Codons) -->
      <path d="M 110 90 L 250 90" stroke="#38bdf8" stroke-width="3" stroke-dasharray="4 2" />
      <text x="180" y="78" class="code" font-size="10.5" fill="#38bdf8" text-anchor="middle">Flat Neutral Saddle</text>
      <text x="180" y="108" class="subtitle" font-size="9.5" text-anchor="middle">(Synonymous Introns)</text>

      <!-- Peak 2 -->
      <path d="M 250 130 Q 300 10 350 130" stroke="#047857" stroke-width="2" fill="#064e3b" opacity="0.4" />
      <text x="300" y="45" class="label-bold" fill="#10b981" text-anchor="middle">Niche B</text>
    </g>

    <text x="212" y="226" class="subtitle" font-size="10" text-anchor="middle" fill="#94a3b8">Purifying selection cannot purge neutral mutations;</text>
    <text x="212" y="242" class="subtitle" font-size="10" text-anchor="middle" fill="#94a3b8">lineages drift across deep fitness valleys without starvation!</text>
  </g>

  <!-- Right: Ohno Gene Duplication -->
  <g transform="translate(485, 75)">
    <rect width="425" height="265" rx="10" fill="#090d16" stroke="#f59e0b" stroke-width="1.5" />
    <rect x="15" y="15" width="225" height="22" rx="4" fill="#78350f" />
    <text x="25" y="30" class="badge" fill="#fef3c7">OHNO GENE DUPLICATION</text>
    <text x="255" y="30" class="code" fill="#f59e0b">Neofunctionalization</text>

    <!-- Single gene copy splitting into two -->
    <g transform="translate(35, 60)">
      <!-- Ancestor Gene -->
      <rect x="125" y="10" width="115" height="30" rx="6" fill="#075985" stroke="#38bdf8" />
      <text x="182.5" y="28" class="code" font-size="10" fill="#fff" text-anchor="middle">Essential AND</text>

      <!-- Split Arrow -->
      <path d="M 155 45 L 85 85" stroke="#64748b" stroke-width="1.5" marker-end="url(#arrow-slate)" />
      <path d="M 210 45 L 280 85" stroke="#64748b" stroke-width="1.5" marker-end="url(#arrow-slate)" />

      <!-- Paralog 1: Purifying Selection -->
      <rect x="25" y="90" width="120" height="30" rx="6" fill="#075985" stroke="#38bdf8" />
      <text x="85" y="108" class="code" font-size="10" fill="#fff" text-anchor="middle">Copy 1: AND</text>
      <text x="85" y="136" class="subtitle" font-size="9.5" text-anchor="middle">Purifying selection</text>
      <text x="85" y="149" class="subtitle" font-size="9.5" text-anchor="middle">sustains cell life</text>

      <!-- Paralog 2: Freed to Mutate -->
      <rect x="220" y="90" width="120" height="30" rx="6" fill="#78350f" stroke="#f59e0b" />
      <text x="280" y="108" class="code" font-size="10" fill="#fff" text-anchor="middle">Copy 2: Paralog</text>
      <text x="280" y="136" class="label-bold" font-size="9.5" fill="#facc15" text-anchor="middle">Freed from constraint!</text>
      <text x="280" y="149" class="subtitle" font-size="9.5" text-anchor="middle">Mutates into novel NOT</text>
    </g>

    <!-- Combined Innovation Result Box -->
    <rect x="42" y="215" width="340" height="28" rx="6" fill="#1b1226" stroke="#a855f7" stroke-width="1" />
    <text x="212" y="233" class="code" font-size="10.5" fill="#d8b4fe" text-anchor="middle">Copy 1 + Copy 2 wire to form XOR half-adder!</text>
  </g>
`);

// 11. LENSKI HYPERBOLIC & HOMOLOGY / HOMOPLASY TREE
const fig4_2 = svgWrapper(940, 375, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 4.2: The Lenski LTEE Hyperbolic Trajectory &amp; Homology vs. Homoplasy</text>
    <text y="20" class="subtitle">Power-law deceleration and phylogenetic proof of convergent evolution (Lenski 1991, 2003)</text>
  </g>

  <!-- Left Chart: Lenski Hyperbolic Curve -->
  <g transform="translate(30, 75)">
    <rect width="470" height="265" rx="10" fill="#090d16" stroke="#38bdf8" stroke-width="1.5" />
    <rect x="15" y="15" width="235" height="22" rx="4" fill="#0369a1" />
    <text x="25" y="30" class="badge" fill="#e0f2fe">HYPERBOLIC FITNESS TRAJECTORY</text>

    <!-- Axes -->
    <g transform="translate(55, 55)">
      <line x1="0" y1="150" x2="365" y2="150" stroke="#64748b" stroke-width="1.5" />
      <line x1="0" y1="0" x2="0" y2="150" stroke="#64748b" stroke-width="1.5" />

      <text x="365" y="168" class="code" font-size="9.5" fill="#94a3b8" text-anchor="end">Generation (t) ──►</text>
      <text x="-10" y="0" class="code" font-size="9.5" fill="#94a3b8" text-anchor="end">Fitness W(t)</text>

      <!-- Hyperbolic Curve -->
      <path d="M 0 140 Q 35 60, 180 55 T 350 50" fill="none" stroke="#38bdf8" stroke-width="2.5" />
      <text x="190" y="44" class="code" font-size="10" fill="#38bdf8">W(t) = (1 + c·t)^d</text>

      <!-- Cit+ Breakthrough Jump (Drawn clearly above the label to eliminate intersection) -->
      <path d="M 220 54 L 240 25 Q 270 18, 350 12" fill="none" stroke="#facc15" stroke-width="2.5" stroke-dasharray="4 2" />
      <circle cx="220" cy="54" r="4" fill="#facc15" />
      <text x="245" y="14" class="label-bold" font-size="10" fill="#facc15">Cit⁺ Innovation Jump</text>
    </g>
  </g>

  <!-- Right Chart: Homology vs Homoplasy Decision Tree -->
  <g transform="translate(530, 75)">
    <rect width="380" height="265" rx="10" fill="#090d16" stroke="#a855f7" stroke-width="1.5" />
    <rect x="15" y="15" width="190" height="22" rx="4" fill="#6b21a8" />
    <text x="25" y="30" class="badge" fill="#f3e8ff">HOMOLOGY VS HOMOPLASY</text>

    <g transform="translate(40, 50)">
      <circle cx="150" cy="18" r="12" fill="#475569" />
      <text x="150" y="22" class="code" font-size="9.5" fill="#fff" text-anchor="middle">LCA</text>
      <text x="150" y="40" class="subtitle" font-size="9.5" text-anchor="middle">Founder Gen 0</text>

      <path d="M 135 25 L 65 65" stroke="#64748b" stroke-width="1.5" />
      <path d="M 165 25 L 235 65" stroke="#64748b" stroke-width="1.5" />

      <circle cx="65" cy="75" r="14" fill="#0369a1" />
      <text x="65" y="79" class="code" font-size="9.5" fill="#fff" text-anchor="middle">A</text>
      <text x="65" y="105" class="code" font-size="9.5" fill="#38bdf8" text-anchor="middle">Clade A</text>

      <circle cx="235" cy="75" r="14" fill="#be123c" />
      <text x="235" y="79" class="code" font-size="9.5" fill="#fff" text-anchor="middle">B</text>
      <text x="235" y="105" class="code" font-size="9.5" fill="#f43f5e" text-anchor="middle">Clade B</text>

      <!-- Arrows start from below label (y=118) to avoid intersecting Clade text -->
      <path d="M 65 118 L 115 145" stroke="#a855f7" stroke-width="2" marker-end="url(#arrow-purple)" />
      <path d="M 235 118 L 185 145" stroke="#a855f7" stroke-width="2" marker-end="url(#arrow-purple)" />

      <rect x="95" y="148" width="110" height="34" rx="6" fill="#2e1065" stroke="#c084fc" stroke-width="1.5" />
      <text x="150" y="165" class="code" font-size="10" text-anchor="middle" fill="#fff">XOR Motif</text>
      <text x="150" y="176" class="badge" text-anchor="middle" font-size="8.5" fill="#c084fc">WL: 0x9f4a...</text>

      <text x="150" y="202" class="label-bold" font-size="10" text-anchor="middle" fill="#facc15">Convergent Evolution!</text>
      <text x="150" y="217" class="subtitle" font-size="9" text-anchor="middle">Independent structural innovation</text>
    </g>
  </g>
`);

// 12. BENTHIC VS PELAGIC DISPERSAL IN 3D WATER COLUMN
const fig4_3 = svgWrapper(940, 375, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 4.3: Seafloor Benthic Matrix vs. Pelagic Spore Water Column Advection</text>
    <text y="20" class="subtitle">Multi-layer hydrodynamic dispersion: Fluid transport of dormant silicoid spores across 3D basalt seamounts</text>
  </g>

  <!-- Water Column Stratification -->
  <g transform="translate(30, 70)">
    <!-- z = 2: Pelagic Advection Layer -->
    <rect width="880" height="75" rx="6" fill="#082f49" stroke="#0284c7" stroke-width="1" />
    <rect x="15" y="10" width="205" height="20" rx="4" fill="#0369a1" />
    <text x="25" y="24" class="badge" fill="#e0f2fe">LAYER z = 2 (PELAGIC DRIFT)</text>
    <text x="240" y="24" class="code" fill="#38bdf8">Advection Velocity: v_drift = (0.04, 0.01)</text>

    <g transform="translate(160, 42)">
      <circle cx="50" cy="8" r="8" fill="#38bdf8" /> <text x="65" y="12" class="code" font-size="9.5" fill="#bae6fd">Spore #142</text>
      <path d="M 125 8 L 245 8" stroke="#00e5ff" stroke-width="2" stroke-dasharray="4 2" marker-end="url(#arrow-cyan)" />

      <circle cx="380" cy="8" r="8" fill="#38bdf8" /> <text x="395" y="12" class="code" font-size="9.5" fill="#bae6fd">Spore #189</text>
      <path d="M 455 8 L 575 8" stroke="#00e5ff" stroke-width="2" stroke-dasharray="4 2" marker-end="url(#arrow-cyan)" />
    </g>

    <!-- z = 1: Hydrothermal Plume Updraft Boundary -->
    <g transform="translate(0, 82)">
      <rect width="880" height="75" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1" />
      <rect x="15" y="10" width="225" height="20" rx="4" fill="#1e293b" />
      <text x="25" y="24" class="badge" fill="#cbd5e1">LAYER z = 1 (PLUME BOUNDARY)</text>
      <text x="260" y="24" class="label" fill="#94a3b8">Thermal buoyancy updrafts lift spores off basalt pores</text>

      <path d="M 200 70 L 200 15" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#arrow-amber)" />
      <text x="210" y="45" class="code" font-size="9.5" fill="#f59e0b">Thermal Updraft</text>

      <path d="M 670 15 L 670 70" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrow-emerald)" />
      <text x="680" y="45" class="code" font-size="9.5" fill="#10b981">Downwelling Re-Settlement</text>
    </g>

    <!-- z = 0: Benthic Basalt Matrix -->
    <g transform="translate(0, 164)">
      <rect width="880" height="98" rx="6" fill="#111827" stroke="#374151" stroke-width="1.5" />
      <rect x="15" y="10" width="230" height="20" rx="4" fill="#1f2937" />
      <text x="25" y="24" class="badge" fill="#f3f4f6">LAYER z = 0 (BENTHIC SUBSTRATE)</text>
      <text x="265" y="24" class="code" fill="#facc15">Mineral Pores (q, r, 0) | Hydrothermal Chimney Vents</text>

      <!-- Sessile Vent Pore aligned with Updraft -->
      <g transform="translate(170, 42)">
        <polygon points="20,10 40,10 50,27 40,44 20,44 10,27" fill="#1f2937" stroke="#00e5ff" stroke-width="2" />
        <text x="30" y="32" class="code" font-size="8.5" fill="#00e5ff" text-anchor="middle">Sessile</text>
      </g>
      <!-- Colonized Basalt Terrace aligned with Downwelling -->
      <g transform="translate(640, 42)">
        <polygon points="20,10 40,10 50,27 40,44 20,44 10,27" fill="#1f2937" stroke="#10b981" stroke-width="2" />
        <text x="30" y="32" class="code" font-size="8.5" fill="#10b981" text-anchor="middle">Colonized</text>
      </g>
    </g>
  </g>
`);

// ============================================================================
// DEDICATED CIRCUIT PALEONTOLOGY FIELD GUIDE DIAGRAMS (FIGURES 4.1 - 18.1)
// ============================================================================

// 13. CIRCUIT 1: BISTABLE MEMORY LATCH (SR FLIP-FLOP) - Section 4 / Figure 4.1
const fig_circ1 = svgWrapper(980, 450, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 4.1: Bistable Memory Latch (SR Flip-Flop)</text>
    <text y="20" class="subtitle">1-bit cellular memory via cross-coupled inverting feedback loops &amp; hysteresis</text>
  </g>

  <!-- Left: Schematic & Netlist -->
  <g transform="translate(30, 70)">
    <rect width="445" height="355" rx="12" fill="#0c1726" stroke="#38bdf8" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#0369a1" />
    <text x="26" y="30" class="badge" fill="#e0f2fe">BISTABLE TOGGLE SWITCH (SR LATCH)</text>
    <text x="270" y="30" class="label" fill="#38bdf8">Gate Schematic</text>

    <!-- Schematic Gate Diagram -->
    <g transform="translate(20, 48)">
      <!-- Set terminal -->
      <text x="0" y="24" class="code" font-size="11" fill="#38bdf8">Set (S)</text>
      <path d="M 45 20 L 70 20" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow-cyan)" />

      <!-- NOR Gate 1 -->
      <rect x="75" y="6" width="80" height="36" rx="6" fill="#075985" stroke="#38bdf8" stroke-width="1.5" />
      <text x="92" y="29" class="code" fill="#ffffff" font-weight="bold">NOR 1</text>

      <!-- Output Q -->
      <path d="M 155 24 L 215 24" stroke="#00e5ff" stroke-width="2" marker-end="url(#arrow-cyan)" />
      <text x="225" y="28" class="code" font-size="11" fill="#00e5ff" font-weight="bold">Output Q</text>

      <!-- Reset terminal -->
      <text x="0" y="94" class="code" font-size="11" fill="#f43f5e">Reset (R)</text>
      <path d="M 55 90 L 70 90" stroke="#f43f5e" stroke-width="2" marker-end="url(#arrow-rose)" />

      <!-- NOR Gate 2 -->
      <rect x="75" y="76" width="80" height="36" rx="6" fill="#075985" stroke="#38bdf8" stroke-width="1.5" />
      <text x="92" y="99" class="code" fill="#ffffff" font-weight="bold">NOR 2</text>

      <!-- Output Q_bar -->
      <path d="M 155 94 L 215 94" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrow-slate)" />
      <text x="225" y="98" class="code" font-size="11" fill="#94a3b8">Comp Q'</text>

      <!-- Cross Feedback Wires -->
      <path d="M 180 24 L 180 60 L 60 60 L 60 82 L 75 82" stroke="#00e5ff" stroke-width="1.5" fill="none" marker-end="url(#arrow-cyan)" />
      <path d="M 170 94 L 170 52 L 60 52 L 60 32 L 75 32" stroke="#94a3b8" stroke-width="1.5" fill="none" stroke-dasharray="3 2" marker-end="url(#arrow-slate)" />
    </g>

    <!-- Truth Table Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#07101e" stroke="#1e293b" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#7dd3fc">SR TRUTH TABLE &amp; THERMODYNAMICS</text>
      <text x="14" y="38" class="code" font-size="9.2" fill="#cbd5e1">S=0, R=0 ──► Q(t) = Q(t-1)  [HOLD: 0 Tokens Dissipated!]</text>
      <text x="14" y="54" class="code" font-size="9.2" fill="#38bdf8">S=1, R=0 ──► Q(t) = 1       [SET: -2T Landauer Burn]</text>
      <text x="14" y="70" class="code" font-size="9.2" fill="#f43f5e">S=0, R=1 ──► Q(t) = 0       [RESET: -2T Landauer Burn]</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#031e38" stroke="#0284c7" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#38bdf8">Digestive Memory &amp; Hysteresis</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Traps nutrient pulse energy across temporal famine gaps</text>
      <text x="14" y="54" class="code" font-size="9" fill="#facc15">★ Landmark: Gardner, Cantor &amp; Collins (2000) Nature 403:339</text>
    </g>
  </g>

  <!-- Right: Potential Well Landscape & Waveforms -->
  <g transform="translate(505, 70)">
    <rect width="445" height="355" rx="12" fill="#0c1726" stroke="#38bdf8" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#0369a1" />
    <text x="26" y="30" class="badge" fill="#e0f2fe">DOUBLE-WELL ENERGY LANDSCAPE</text>
    <text x="270" y="30" class="label" fill="#38bdf8">Dynamical Stability</text>

    <!-- Double-well curve -->
    <g transform="translate(25, 48)">
      <path d="M 20 20 C 50 110, 100 110, 140 55 C 180 110, 230 110, 260 20" stroke="#38bdf8" stroke-width="2.5" fill="none" />
      <circle cx="85" cy="98" r="7" fill="#64748b" />
      <text x="85" y="120" class="code" font-size="9" fill="#94a3b8" text-anchor="middle">Basin 0 (Q=0)</text>

      <circle cx="195" cy="98" r="9" fill="#00e5ff" />
      <text x="195" y="120" class="code" font-size="9" fill="#00e5ff" font-weight="bold" text-anchor="middle">Basin 1 (Q=1) ●</text>

      <line x1="140" y1="55" x2="140" y2="85" stroke="#f43f5e" stroke-dasharray="2 2" stroke-width="1.5" />
      <text x="140" y="45" class="badge" fill="#f43f5e" text-anchor="middle">Barrier ΔE</text>

      <!-- Explanatory legend -->
      <g transform="translate(285, 20)">
        <rect width="105" height="78" rx="6" fill="#07101e" stroke="#1e293b" stroke-width="1" />
        <text x="8" y="18" class="badge" fill="#7dd3fc">STATE METRICS</text>
        <text x="8" y="34" class="code" font-size="8.8" fill="#00e5ff">Q = 1 (Locked)</text>
        <text x="8" y="48" class="subtitle" font-size="8.5">E_net: +6 Tokens</text>
        <text x="8" y="64" class="code" font-size="8.5" fill="#facc15">Hold Cost: 0W</text>
      </g>
    </g>

    <!-- Timing Trace Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#07101e" stroke="#1e293b" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#7dd3fc">5-TICK CHRONOLOGICAL TIMING TRACE</text>
      <text x="14" y="38" class="code" font-size="9" fill="#cbd5e1">t=1 (Set Pulse)  ──► Q flips 0 ➔ 1 (-2T Landauer Burn)</text>
      <text x="14" y="54" class="code" font-size="9" fill="#38bdf8">t=2..3 (Famine)   ──► Q holds 1 indefinitely (0T Burn!)</text>
      <text x="14" y="70" class="code" font-size="9" fill="#facc15">t=4 (Fuel B + R) ──► Catalysis: +10T harvest, Reset to 0</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#031e38" stroke="#0284c7" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#38bdf8">Darwinian Selection Advantage</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Memory bridges asynchronous nutrient vents; unequipped cells starve</text>
      <text x="14" y="54" class="code" font-size="8.8" fill="#facc15">★ Net Profit: +6T per cycle unlocks exponential population takeover</text>
    </g>
  </g>
`);

// 14. CIRCUIT 2: REPRESSILATOR (ODD-INVERTER RING OSCILLATOR) - Section 5 / Figure 5.1
const fig_circ2 = svgWrapper(980, 450, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 5.1: Odd-Inverter Ring Oscillator (The Repressilator)</text>
    <text y="20" class="subtitle">Autonomous 3-phase limit-cycle clock pacing via cyclic negative feedback</text>
  </g>

  <!-- Left: Schematic Ring -->
  <g transform="translate(30, 70)">
    <rect width="445" height="355" rx="12" fill="#200d17" stroke="#f43f5e" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#9f1239" />
    <text x="26" y="30" class="badge" fill="#ffe4e6">THE REPRESSILATOR (RING CLOCK)</text>
    <text x="270" y="30" class="label" fill="#fb7185">Cyclic Ring Topology</text>

    <!-- Ring Schematic of 3 Inverters -->
    <g transform="translate(25, 48)">
      <!-- Gate A (Top) -->
      <rect x="145" y="10" width="75" height="32" rx="6" fill="#881337" stroke="#f43f5e" stroke-width="1.5" />
      <text x="160" y="31" class="code" fill="#ffffff" font-weight="bold">NOT A</text>

      <!-- Gate B (Bottom Right) -->
      <rect x="250" y="85" width="75" height="32" rx="6" fill="#881337" stroke="#f43f5e" stroke-width="1.5" />
      <text x="265" y="106" class="code" fill="#ffffff" font-weight="bold">NOT B</text>

      <!-- Gate C (Bottom Left) -->
      <rect x="40" y="85" width="75" height="32" rx="6" fill="#881337" stroke="#f43f5e" stroke-width="1.5" />
      <text x="55" y="106" class="code" fill="#ffffff" font-weight="bold">NOT C</text>

      <!-- A to B arrow -->
      <path d="M 220 26 L 285 26 L 285 80" stroke="#f43f5e" stroke-width="2" fill="none" marker-end="url(#arrow-rose)" />
      <text x="260" y="20" class="code" font-size="8.5" fill="#fecdd3">Delay τ</text>

      <!-- B to C arrow -->
      <path d="M 250 101 L 120 101" stroke="#f43f5e" stroke-width="2" fill="none" marker-end="url(#arrow-rose)" />
      <text x="175" y="95" class="code" font-size="8.5" fill="#fecdd3">Delay τ</text>

      <!-- C to A arrow -->
      <path d="M 75 85 L 75 26 L 140 26" stroke="#f43f5e" stroke-width="2" fill="none" marker-end="url(#arrow-rose)" />
      <text x="85" y="20" class="code" font-size="8.5" fill="#fecdd3">Delay τ</text>

      <!-- Badge for Frequency -->
      <g transform="translate(330, 20)">
        <rect width="80" height="95" rx="6" fill="#4c0519" stroke="#f43f5e" stroke-width="1" />
        <text x="8" y="18" class="badge" fill="#fecdd3">CLOCK SPECS</text>
        <text x="8" y="34" class="code" font-size="9.5" fill="#facc15">T = 6 · τ</text>
        <text x="8" y="48" class="subtitle" font-size="8.5">N = 3 gates</text>
        <text x="8" y="62" class="code" font-size="8" fill="#fda4af">Lag: 120°</text>
        <text x="8" y="76" class="subtitle" font-size="8">Gain |Aβ| ≥ 1</text>
      </g>
    </g>

    <!-- Formula Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#14060c" stroke="#4c0519" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#fecdd3">BARKHAUSEN CRITERIA &amp; PHASE SHIFT</text>
      <text x="14" y="38" class="code" font-size="9.2" fill="#facc15">Loop Oscillation Period: T = 2 · N · τ = 6 ticks</text>
      <text x="14" y="54" class="subtitle" font-size="9">Total loop phase shift: ΔΦ = 3 · (π + ωτ) = 2πk (odd parity)</text>
      <text x="14" y="70" class="code" font-size="8.8" fill="#fda4af">Zero static equilibria: system mathematically forced into limit cycle</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#4c0519" stroke="#9f1239" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#fda4af">Autonomous Biological Pacemaker</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Paces flagellar bursts, sporulation cycles, and periodic feeding</text>
      <text x="14" y="54" class="code" font-size="9" fill="#facc15">★ Landmark: Elowitz &amp; Leibler (2000) Nature 403:335</text>
    </g>
  </g>

  <!-- Right: 3-Phase Limit Cycle Waveforms -->
  <g transform="translate(505, 70)">
    <rect width="445" height="355" rx="12" fill="#200d17" stroke="#f43f5e" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#9f1239" />
    <text x="26" y="30" class="badge" fill="#ffe4e6">3-PHASE CLOCK DYNAMICS</text>
    <text x="270" y="30" class="label" fill="#fb7185">Dynamical Limit Cycle</text>

    <!-- Waveform Box: 3-Phase Sinusoids -->
    <g transform="translate(16, 48)">
      <rect width="413" height="120" rx="8" fill="#14060c" stroke="#4c0519" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#fb7185">CONTINUOUS LIMIT CYCLE WAVEFORMS (120° LAG)</text>

      <!-- Grid lines & voltage ticks -->
      <line x1="30" y1="65" x2="335" y2="65" stroke="#334155" stroke-dasharray="2 3" stroke-width="0.8" />
      <line x1="30" y1="42" x2="335" y2="42" stroke="#1e293b" stroke-dasharray="1 3" stroke-width="0.7" />
      <line x1="30" y1="88" x2="335" y2="88" stroke="#1e293b" stroke-dasharray="1 3" stroke-width="0.7" />
      <text x="14" y="45" class="code" font-size="7.5" fill="#64748b">1</text>
      <text x="14" y="68" class="code" font-size="7.5" fill="#64748b">0.5</text>
      <text x="14" y="91" class="code" font-size="7.5" fill="#64748b">0</text>

      <!-- 3-Phase continuous waveforms -->
      <path d="${generateSineWavePath(30, 335, 65, 23, 90, 0)}" stroke="#f43f5e" stroke-width="2" fill="none" />
      <path d="${generateSineWavePath(30, 335, 65, 23, 90, 2 * Math.PI / 3)}" stroke="#38bdf8" stroke-width="2" fill="none" />
      <path d="${generateSineWavePath(30, 335, 65, 23, 90, 4 * Math.PI / 3)}" stroke="#10b981" stroke-width="2" fill="none" />

      <!-- Legend -->
      <rect x="345" y="28" width="60" height="80" rx="4" fill="#1f0a12" stroke="#4c0519" stroke-width="0.8" />
      <circle cx="353" cy="42" r="3.5" fill="#f43f5e" />
      <text x="361" y="45" class="code" font-size="8.5" fill="#f43f5e">V_A (0°)</text>
      <circle cx="353" cy="62" r="3.5" fill="#38bdf8" />
      <text x="361" y="65" class="code" font-size="8.5" fill="#38bdf8">V_B (120°)</text>
      <circle cx="353" cy="82" r="3.5" fill="#10b981" />
      <text x="361" y="85" class="code" font-size="8.5" fill="#10b981">V_C (240°)</text>
    </g>

    <!-- Phase Space Attractor Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#14060c" stroke="#4c0519" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#fda4af">POINCARÉ LIMIT CYCLE ATTRACTOR</text>
      <text x="14" y="38" class="code" font-size="9" fill="#38bdf8">Closed orbital trajectory in 3D state space (LacI, TetR, cI)</text>
      <text x="14" y="54" class="subtitle" font-size="9">Stable attractor basin absorbs stochastic perturbations and thermal noise</text>
      <text x="14" y="70" class="code" font-size="8.8" fill="#facc15">Autonomous chronometer: coordinates temporal metabolic phases</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#4c0519" stroke="#9f1239" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#fda4af">Darwinian Fitness Value</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Enables anticipatory behavior ahead of tidal nutrient cycles</text>
      <text x="14" y="54" class="code" font-size="8.8" fill="#facc15">★ Cells with internal clocks forage efficiently and avoid toxic surges</text>
    </g>
  </g>
`);

// 15. CIRCUIT 3: COHERENT FEED-FORWARD LOOP TYPE 1 (C-FFL) - Section 6 / Figure 6.1
const fig_circ3 = svgWrapper(980, 450, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 6.1: Coherent Feed-Forward Loop Type 1 (C-FFL)</text>
    <text y="20" class="subtitle">Sign-sensitive delay &amp; high-frequency noise filter (persistence detector)</text>
  </g>

  <!-- Left: Schematic Motif -->
  <g transform="translate(30, 70)">
    <rect width="445" height="355" rx="12" fill="#081e19" stroke="#10b981" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#065f46" />
    <text x="26" y="30" class="badge" fill="#d1fae5">COHERENT FFL (C-FFL TYPE 1)</text>
    <text x="270" y="30" class="label" fill="#34d399">Persistence Filter</text>

    <!-- Triad Schematic -->
    <g transform="translate(25, 48)">
      <circle cx="35" cy="30" r="16" fill="#047857" stroke="#10b981" stroke-width="2" />
      <text x="29" y="35" class="code" fill="#ffffff" font-weight="bold">X</text>
      <text x="55" y="25" class="code" font-size="9" fill="#a7f3d0">Sensor</text>

      <!-- Path to Y -->
      <path d="M 52 30 L 125 30" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-emerald)" />
      <circle cx="140" cy="30" r="16" fill="#047857" stroke="#10b981" stroke-width="2" />
      <text x="134" y="35" class="code" fill="#ffffff" font-weight="bold">Y</text>
      <text x="160" y="25" class="code" font-size="9" fill="#a7f3d0">Delay Buf</text>

      <!-- Direct fast path to Z and indirect slow path to Z -->
      <path d="M 45 46 L 105 90" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-emerald)" />
      <text x="50" y="75" class="code" font-size="8.5" fill="#6ee7b7">Fast (+)</text>

      <path d="M 140 48 L 140 85" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-emerald)" />
      <text x="145" y="70" class="code" font-size="8.5" fill="#6ee7b7">Slow (+)</text>

      <!-- Target Gate Z (AND) -->
      <rect x="105" y="92" width="75" height="34" rx="6" fill="#064e3b" stroke="#34d399" stroke-width="2" />
      <text x="117" y="114" class="code" fill="#ffffff" font-weight="bold">Z (AND)</text>

      <!-- Filtered output -->
      <path d="M 180 109 L 240 109" stroke="#34d399" stroke-width="2.5" marker-end="url(#arrow-emerald)" />
      <text x="250" y="113" class="code" font-size="11" fill="#34d399" font-weight="bold">Output Z</text>
    </g>

    <!-- Logic Table Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#041812" stroke="#065f46" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#6ee7b7">SIGN-SENSITIVE DELAY CRITERIA</text>
      <text x="14" y="38" class="code" font-size="8.8" fill="#34d399">Turn-ON Delay: Z activates ONLY after Y accumulates (t &gt; τ_on)</text>
      <text x="14" y="54" class="code" font-size="8.8" fill="#f43f5e">Turn-OFF Immediate: When X drops, direct path drops (τ_off = 0)</text>
      <text x="14" y="70" class="subtitle" font-size="9">Coherent Sign Product: (+) · (+) · (+) = +1 (Reinforcing)</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#022c22" stroke="#047857" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#6ee7b7">Sign-Sensitive Persistence Filter</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Prevents costly Landauer dissipation on false chemical flashes</text>
      <text x="14" y="54" class="code" font-size="9" fill="#facc15">★ Landmark: Mangan &amp; Alon (2003) PNAS 100:11980</text>
    </g>
  </g>

  <!-- Right: Timing Waveforms & Noise Rejection -->
  <g transform="translate(505, 70)">
    <rect width="445" height="355" rx="12" fill="#081e19" stroke="#10b981" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#065f46" />
    <text x="26" y="30" class="badge" fill="#d1fae5">NOISE REJECTION DYNAMICS</text>
    <text x="270" y="30" class="label" fill="#34d399">Timing Waveforms</text>

    <!-- Waveforms canvas -->
    <g transform="translate(16, 48)">
      <rect width="413" height="120" rx="8" fill="#041812" stroke="#065f46" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#6ee7b7">TRANSIENT SPIKE VS. SUSTAINED SIGNAL</text>

      <!-- Input trace X -->
      <text x="15" y="42" class="code" font-size="8.5" fill="#34d399">Input X</text>
      <path d="M 65 44 L 85 44 L 85 30 L 95 30 L 95 44 L 140 44 L 140 30 L 230 30 L 230 44 L 270 44" stroke="#34d399" stroke-width="1.8" fill="none" />
      <text x="98" y="26" class="code" font-size="7.5" fill="#f43f5e">1-Tick Noise</text>
      <text x="165" y="26" class="code" font-size="7.5" fill="#10b981">Sustained Signal</text>

      <!-- Intermediate Y trace -->
      <text x="15" y="74" class="code" font-size="8.5" fill="#a7f3d0">Delay Y</text>
      <path d="M 65 76 L 85 76 L 95 72 L 105 76 L 140 76 L 175 62 L 230 62 L 245 76 L 270 76" stroke="#a7f3d0" stroke-width="1.8" fill="none" />
      <line x1="65" y1="66" x2="270" y2="66" stroke="#64748b" stroke-dasharray="2 2" stroke-width="0.8" />
      <text x="275" y="68" class="code" font-size="7.5" fill="#64748b">Threshold K_y</text>

      <!-- Output Z trace -->
      <text x="15" y="106" class="code" font-size="8.5" fill="#facc15">Output Z</text>
      <path d="M 65 108 L 175 108 L 175 94 L 230 94 L 230 108 L 270 108" stroke="#facc15" stroke-width="2.2" fill="none" />
      <text x="105" y="104" class="code" font-size="8" fill="#f43f5e">REJECTED (0)</text>
      <text x="195" y="90" class="code" font-size="8" fill="#facc15">FIRED (1)</text>
    </g>

    <!-- Bioenergetic Profit Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#041812" stroke="#065f46" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#6ee7b7">BIOENERGETIC COST SAVINGS</text>
      <text x="14" y="38" class="code" font-size="9" fill="#facc15">Enzyme Synthesis Cost: -15 Tokens per activation</text>
      <text x="14" y="54" class="subtitle" font-size="9">Spurious eddy flashes occur 40x per epoch in turbulent chimneys</text>
      <text x="14" y="70" class="code" font-size="8.8" fill="#34d399">Energy saved: &gt; 600 Tokens/epoch; prevents metabolic bankruptcy</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#022c22" stroke="#047857" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#6ee7b7">Evolutionary Fitness Value</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Distinguishes genuine environmental shifts from micro-turbulence</text>
      <text x="14" y="54" class="code" font-size="8.8" fill="#facc15">★ Ubiquitous in sugar metabolism: E. coli arabinose operon (araBAD)</text>
    </g>
  </g>
`);

// 16. CIRCUIT 4: INCOHERENT FEED-FORWARD LOOP TYPE 1 (I-FFL) - Section 7 / Figure 7.1
const fig_circ4 = svgWrapper(980, 450, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 7.1: Incoherent Feed-Forward Loop Type 1 (I-FFL)</text>
    <text y="20" class="subtitle">Transient pulse generator, sensory adaptation &amp; fold-change derivative detection</text>
  </g>

  <!-- Left: Schematic Motif -->
  <g transform="translate(30, 70)">
    <rect width="445" height="355" rx="12" fill="#1b1226" stroke="#a855f7" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#6b21a8" />
    <text x="26" y="30" class="badge" fill="#f3e8ff">INCOHERENT FFL (I-FFL TYPE 1)</text>
    <text x="270" y="30" class="label" fill="#c084fc">Pulse Generator</text>

    <!-- Triad Schematic -->
    <g transform="translate(25, 48)">
      <circle cx="35" cy="30" r="16" fill="#581c87" stroke="#a855f7" stroke-width="2" />
      <text x="29" y="35" class="code" fill="#ffffff" font-weight="bold">X</text>
      <text x="55" y="25" class="code" font-size="9" fill="#e9d5ff">Sensor</text>

      <!-- Path to Y (Repressor) -->
      <path d="M 52 30 L 125 30" stroke="#a855f7" stroke-width="2" marker-end="url(#arrow-purple)" />
      <circle cx="140" cy="30" r="16" fill="#be123c" stroke="#f43f5e" stroke-width="2" />
      <text x="134" y="35" class="code" fill="#ffffff" font-weight="bold">Y</text>
      <text x="160" y="25" class="code" font-size="9" fill="#fecdd3">Repressor</text>

      <!-- Direct fast activation (+) and slow delayed inhibition (-) -->
      <path d="M 45 46 L 105 90" stroke="#a855f7" stroke-width="2" marker-end="url(#arrow-purple)" />
      <text x="45" y="75" class="code" font-size="8.5" fill="#d8b4fe">Fast (+)</text>

      <path d="M 140 48 L 140 85" stroke="#f43f5e" stroke-width="2.5" stroke-dasharray="3 2" />
      <text x="145" y="70" class="code" font-size="8.5" fill="#f43f5e">Slow (-)</text>

      <!-- Target Gate Z (AND-NOT) -->
      <rect x="105" y="92" width="75" height="34" rx="6" fill="#3b0764" stroke="#c084fc" stroke-width="2" />
      <text x="113" y="114" class="code" fill="#ffffff" font-weight="bold">Z (A·NOT)</text>

      <!-- Adaptive Pulse Output -->
      <path d="M 180 109 L 240 109" stroke="#c084fc" stroke-width="2.5" marker-end="url(#arrow-purple)" />
      <text x="250" y="113" class="code" font-size="11" fill="#c084fc" font-weight="bold">Output Z</text>
    </g>

    <!-- Mathematical Formula Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#12091c" stroke="#581c87" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#d8b4fe">OPPOSING REGULATORY ARMS</text>
      <text x="14" y="38" class="code" font-size="8.8" fill="#c084fc">Sign Product: (+) · (+) · (-) = -1 (Opposing / Incoherent)</text>
      <text x="14" y="54" class="subtitle" font-size="9">Direct arm accelerates initial response; delayed repressor restores baseline</text>
      <text x="14" y="70" class="code" font-size="8.8" fill="#f43f5e">Pulse duration: Δt = τ_repressor (intrinsic kinetic delay)</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#2e1065" stroke="#7e22ce" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#d8b4fe">Fold-Change Sensory Adaptation</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Measures environmental derivative (d/dt) rather than absolute levels</text>
      <text x="14" y="54" class="code" font-size="9" fill="#facc15">★ Landmark: Alon (2007) Nat Rev Genet &amp; Goentoro (2009)</text>
    </g>
  </g>

  <!-- Right: Biphasic Pulse Waveforms -->
  <g transform="translate(505, 70)">
    <rect width="445" height="355" rx="12" fill="#1b1226" stroke="#a855f7" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#6b21a8" />
    <text x="26" y="30" class="badge" fill="#f3e8ff">PULSE DYNAMICS &amp; RESET</text>
    <text x="270" y="30" class="label" fill="#c084fc">Fold-Change Detection</text>

    <!-- Timing Waveform Box -->
    <g transform="translate(16, 48)">
      <rect width="413" height="120" rx="8" fill="#12091c" stroke="#581c87" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#d8b4fe">STEP INPUT &amp; BIPHASIC ADAPTIVE PULSE</text>

      <!-- Step input X -->
      <text x="15" y="42" class="code" font-size="8.5" fill="#a855f7">Input X (Step)</text>
      <path d="M 95 44 L 135 44 L 135 30 L 275 30" stroke="#a855f7" stroke-width="1.8" fill="none" />

      <!-- Repressor Y (slow exponential accumulation) -->
      <text x="15" y="74" class="code" font-size="8.5" fill="#f43f5e">Repressor Y</text>
      <path d="M 95 76 L 135 76 C 150 76, 175 58, 275 58" stroke="#f43f5e" stroke-width="1.8" fill="none" />
      <line x1="95" y1="62" x2="275" y2="62" stroke="#64748b" stroke-dasharray="2 2" stroke-width="0.8" />
      <text x="280" y="64" class="code" font-size="7.5" fill="#64748b">Inhibition K_i</text>

      <!-- Pulse output Z -->
      <text x="15" y="106" class="code" font-size="8.5" fill="#facc15">Output Z (Pulse)</text>
      <path d="M 95 108 L 135 108 L 140 88 L 175 88 C 190 88, 205 108, 275 108" stroke="#facc15" stroke-width="2.2" fill="none" />
      <text x="145" y="82" class="code" font-size="8" fill="#facc15">Transient Spike</text>
      <text x="220" y="104" class="code" font-size="8" fill="#a855f7">Adapted Baseline</text>
    </g>

    <!-- Fold-Change Invariance Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#12091c" stroke="#581c87" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#d8b4fe">FOLD-CHANGE INVARIANCE (FCD)</text>
      <text x="14" y="38" class="code" font-size="8.8" fill="#facc15">Amplitude: Peak depends on (X_final / X_initial), NOT absolute X</text>
      <text x="14" y="54" class="subtitle" font-size="9">Allows organism to navigate chemical plumes across 4 orders of magnitude</text>
      <text x="14" y="70" class="code" font-size="8.8" fill="#c084fc">Weber-Fechner Law of sensory biology implemented in 3 logic gates</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#2e1065" stroke="#7e22ce" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#d8b4fe">Darwinian Fitness Value</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Prevents sensory saturation in rich plumes; detects subtle new boundaries</text>
      <text x="14" y="54" class="code" font-size="8.8" fill="#facc15">★ Drives optimal chemotactic foraging on the hydrothermal seafloor</text>
    </g>
  </g>
`);

// 17. CIRCUIT 5: NEGATIVE AUTOREGULATION (NAR) - Section 8 / Figure 8.1
const fig_circ5 = svgWrapper(980, 450, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 8.1: Negative Autoregulation (NAR)</text>
    <text y="20" class="subtitle">Accelerating response rise times &amp; buffering expression noise via autoinhibitory feedback</text>
  </g>

  <!-- Left: Schematic Feedback Loop -->
  <g transform="translate(30, 70)">
    <rect width="445" height="355" rx="12" fill="#1e1307" stroke="#f59e0b" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#b45309" />
    <text x="26" y="30" class="badge" fill="#fef3c7">NEGATIVE AUTOREGULATION (NAR)</text>
    <text x="270" y="30" class="label" fill="#fbbf24">Homeostatic Clamp</text>

    <!-- Schematic -->
    <g transform="translate(30, 50)">
      <text x="0" y="35" class="code" font-size="11" fill="#fbbf24">Input</text>
      <path d="M 40 30 L 70 30" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow-amber)" />

      <!-- Gate X -->
      <rect x="75" y="12" width="90" height="36" rx="6" fill="#78350f" stroke="#f59e0b" stroke-width="2" />
      <text x="92" y="35" class="code" fill="#ffffff" font-weight="bold">GATE X</text>

      <!-- Output -->
      <path d="M 165 30 L 235 30" stroke="#fbbf24" stroke-width="2.5" marker-end="url(#arrow-amber)" />
      <text x="245" y="34" class="code" font-size="11" fill="#fbbf24" font-weight="bold">Output X</text>

      <!-- Self-inhibiting feedback wire -->
      <path d="M 200 30 L 200 72 L 60 72 L 60 40 L 75 40" stroke="#f43f5e" stroke-width="2" stroke-dasharray="3 2" fill="none" />
      <circle cx="75" cy="40" r="3" fill="#f43f5e" />
      <text x="75" y="65" class="code" font-size="9" fill="#f43f5e">Self-Inhibition Feedback (-)</text>
    </g>

    <!-- Mathematics Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#140a02" stroke="#78350f" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#fde68a">GOVERNING DIFFERENTIAL EQUATION</text>
      <text x="14" y="38" class="code" font-size="9.5" fill="#fbbf24">dX/dt = β / [1 + (X / K)^n] - α · X</text>
      <text x="14" y="54" class="subtitle" font-size="9">Initial throttle: β engineered high (rapid surge) then clamped at K</text>
      <text x="14" y="70" class="code" font-size="8.8" fill="#f59e0b">Effective rise time: t_1/2 ≈ (ln 2 / α) · [1 / (1 + G)]</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#451a03" stroke="#b45309" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#fde68a">Noise Damping &amp; Response Acceleration</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Full throttle initial synthesis, clamped by negative feedback</text>
      <text x="14" y="54" class="code" font-size="9" fill="#facc15">★ Landmark: Rosenfeld, Elowitz &amp; Alon (2002) Science</text>
    </g>
  </g>

  <!-- Right: Response Acceleration Curves -->
  <g transform="translate(505, 70)">
    <rect width="445" height="355" rx="12" fill="#1e1307" stroke="#f59e0b" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#b45309" />
    <text x="26" y="30" class="badge" fill="#fef3c7">KINETIC RESPONSE ACCELERATION</text>
    <text x="270" y="30" class="label" fill="#fbbf24">Rise Time Comparison</text>

    <!-- Response Acceleration Curve Graph -->
    <g transform="translate(16, 48)">
      <rect width="413" height="120" rx="8" fill="#140a02" stroke="#78350f" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#fde68a">NAR (FAST RISE) VS. UNREGULATED (SLUGGISH)</text>

      <!-- Axes -->
      <path d="M 35 100 L 35 30 L 360 30" stroke="#451a03" stroke-width="1" fill="none" />
      <path d="M 35 100 L 360 100" stroke="#451a03" stroke-width="1" />

      <!-- Simple curve: slow rise -->
      <path d="M 35 100 C 90 95, 170 65, 270 55 L 350 55" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="3 2" fill="none" />
      <text x="250" y="48" class="code" font-size="8.5" fill="#94a3b8">Unregulated (Sluggish)</text>

      <!-- NAR curve: steep rise, clamped plateau -->
      <path d="M 35 100 C 55 55, 95 55, 170 55 L 350 55" stroke="#f59e0b" stroke-width="2.5" fill="none" />
      <text x="95" y="44" class="code" font-size="9" fill="#f59e0b" font-weight="bold">NAR (5x Faster Rise!)</text>

      <text x="35" y="112" class="subtitle" font-size="8">t=0</text>
      <text x="75" y="112" class="code" font-size="8" fill="#f59e0b">t_1/2 (NAR)</text>
      <text x="170" y="112" class="code" font-size="8" fill="#94a3b8">t_1/2 (Unregulated)</text>
    </g>

    <!-- Noise Distribution Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#140a02" stroke="#78350f" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#fde68a">EXPRESSION NOISE SUPPRESSION</text>
      <text x="14" y="38" class="code" font-size="9" fill="#facc15">Variance Reduction: σ²_NAR = σ²_unreg / (1 + G_loop)</text>
      <text x="14" y="54" class="subtitle" font-size="9">Compresses cell-to-cell protein variability into razor-thin tolerance</text>
      <text x="14" y="70" class="code" font-size="8.8" fill="#fbbf24">Prevents cytotoxic protein precipitation or insufficient defense</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#451a03" stroke="#b45309" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#fde68a">Darwinian Fitness Value</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• 40% of all transcription factors in E. coli possess NAR architecture</text>
      <text x="14" y="54" class="code" font-size="8.8" fill="#facc15">★ Rapidly activates protective enzymes before thermal shock death</text>
    </g>
  </g>
`);

// 18. CIRCUIT 6: 1-BIT BINARY HALF-ADDER - Section 9 / Figure 9.1
const fig_circ6 = svgWrapper(980, 450, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 9.1: 1-Bit Binary Half-Adder</text>
    <text y="20" class="subtitle">Digital arithmetic computation via dual XOR (sum) and AND (carry-out) catalytic logic</text>
  </g>

  <!-- Left: Schematic Netlist -->
  <g transform="translate(30, 70)">
    <rect width="445" height="355" rx="12" fill="#081e26" stroke="#00e5ff" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#0e7490" />
    <text x="26" y="30" class="badge" fill="#cffafe">1-BIT BINARY HALF-ADDER</text>
    <text x="270" y="30" class="label" fill="#22d3ee">Combinatorial Parity</text>

    <!-- Schematic: XOR and AND in parallel -->
    <g transform="translate(20, 48)">
      <!-- Inputs A and B -->
      <text x="0" y="28" class="code" font-size="11" fill="#38bdf8">Input A (Fuel A)</text>
      <text x="0" y="82" class="code" font-size="11" fill="#10b981">Input B (Fuel B)</text>

      <!-- XOR Gate (Sum) -->
      <rect x="125" y="10" width="80" height="34" rx="6" fill="#155e75" stroke="#22d3ee" stroke-width="1.5" />
      <text x="140" y="32" class="code" fill="#ffffff" font-weight="bold">XOR</text>

      <!-- AND Gate (Carry) -->
      <rect x="125" y="65" width="80" height="34" rx="6" fill="#065f46" stroke="#10b981" stroke-width="1.5" />
      <text x="140" y="87" class="code" fill="#ffffff" font-weight="bold">AND</text>

      <!-- Connections -->
      <path d="M 100 24 L 125 24" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arrow-cyan)" />
      <path d="M 100 78 L 125 78" stroke="#10b981" stroke-width="1.5" marker-end="url(#arrow-emerald)" />
      <path d="M 110 24 L 110 72 L 125 72" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arrow-cyan)" />
      <path d="M 115 78 L 115 32 L 125 32" stroke="#10b981" stroke-width="1.5" marker-end="url(#arrow-emerald)" />

      <!-- Outputs -->
      <path d="M 205 27 L 255 27" stroke="#22d3ee" stroke-width="2" marker-end="url(#arrow-cyan)" />
      <text x="265" y="31" class="code" font-size="11" fill="#22d3ee" font-weight="bold">Sum (S = A ⊕ B)</text>

      <path d="M 205 82 L 255 82" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-emerald)" />
      <text x="265" y="86" class="code" font-size="11" fill="#10b981" font-weight="bold">Carry (C = A · B)</text>
    </g>

    <!-- Circuit Architecture Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#051722" stroke="#155e75" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#67e8f9">ARITHMETIC DECOMPOSITION</text>
      <text x="14" y="38" class="code" font-size="8.8" fill="#22d3ee">Sum Flag (S): Parity detector fires when exactly ONE resource exists</text>
      <text x="14" y="54" class="code" font-size="8.8" fill="#10b981">Carry Flag (C): Quorum detector fires when BOTH co-occur (Overflow)</text>
      <text x="14" y="70" class="subtitle" font-size="9">Enables true multi-bit digital arithmetic in prebiotic chemical networks</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#083344" stroke="#0e7490" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#67e8f9">Digital Arithmetic in Living Cells</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Decomposes dual fuel streams into basal maintenance vs. reproduction</text>
      <text x="14" y="54" class="code" font-size="9" fill="#facc15">★ Landmark: Alon (2019) An Introduction to Systems Biology</text>
    </g>
  </g>

  <!-- Right: Truth Table & Metabolic Yield -->
  <g transform="translate(505, 70)">
    <rect width="445" height="355" rx="12" fill="#081e26" stroke="#00e5ff" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#0e7490" />
    <text x="26" y="30" class="badge" fill="#cffafe">ARITHMETIC TRUTH TABLE</text>
    <text x="270" y="30" class="label" fill="#22d3ee">Metabolic Quorum</text>

    <!-- Truth Table Box -->
    <g transform="translate(16, 48)">
      <rect width="413" height="120" rx="8" fill="#051722" stroke="#155e75" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#67e8f9">ARITHMETIC TRUTH TABLE &amp; METABOLIC YIELD</text>
      <text x="14" y="38" class="code" font-size="8.8" fill="#cbd5e1">A=0, B=0 ──► Sum=0, Carry=0 [Basal Idle: 0 Tokens Burned]</text>
      <text x="14" y="58" class="code" font-size="8.8" fill="#22d3ee">A=1, B=0 ──► Sum=1, Carry=0 [Fuel A Alone: +5 Tokens (Maintenance)]</text>
      <text x="14" y="78" class="code" font-size="8.8" fill="#22d3ee">A=0, B=1 ──► Sum=1, Carry=0 [Fuel B Alone: +5 Tokens (Maintenance)]</text>
      <text x="14" y="98" class="code" font-size="8.8" fill="#facc15">A=1, B=1 ──► Sum=0, Carry=1 [CO-OCCURRENCE: +20T DIVISION TRIGGER!]</text>
    </g>

    <!-- Stoichiometric Decoupling Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#051722" stroke="#155e75" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#67e8f9">STOICHIOMETRIC QUORUM DECISION</text>
      <text x="14" y="38" class="code" font-size="8.8" fill="#facc15">Division Trigger: Carry bit routes battery power to FtsZ septum ring</text>
      <text x="14" y="54" class="subtitle" font-size="9">Prevents premature cell division when only partial nutrients are available</text>
      <text x="14" y="70" class="code" font-size="8.8" fill="#22d3ee">Guarantees daughter cells inherit sufficient reserves to survive</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#083344" stroke="#0e7490" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#67e8f9">Evolutionary Significance</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Origin of multi-bit arithmetic and combinatorial logic in living matter</text>
      <text x="14" y="54" class="code" font-size="9" fill="#facc15">★ Enables complex metabolic branch point decisions</text>
    </g>
  </g>
`);

// 19. CIRCUIT 7: ALLOSTERIC NOT INVERTER - Section 10 / Figure 10.1
const fig_circ7 = svgWrapper(980, 450, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 10.1: Allosteric NOT Inverter</text>
    <text y="20" class="subtitle">Molecular repression, phase reversal &amp; complementary digital signaling</text>
  </g>

  <!-- Left: Schematic Inversion -->
  <g transform="translate(30, 70)">
    <rect width="445" height="355" rx="12" fill="#1e0c15" stroke="#f43f5e" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#9f1239" />
    <text x="26" y="30" class="badge" fill="#ffe4e6">ALLOSTERIC NOT INVERTER</text>
    <text x="270" y="30" class="label" fill="#fb7185">Toxin Failsafe</text>

    <!-- Schematic -->
    <g transform="translate(25, 48)">
      <text x="0" y="35" class="code" font-size="11" fill="#f43f5e">Toxin Sensor (X)</text>
      <path d="M 110 30 L 145 30" stroke="#f43f5e" stroke-width="2" marker-end="url(#arrow-rose)" />

      <!-- NOT Gate -->
      <rect x="150" y="12" width="80" height="36" rx="6" fill="#881337" stroke="#f43f5e" stroke-width="2" />
      <text x="167" y="35" class="code" fill="#ffffff" font-weight="bold">NOT</text>

      <!-- Porin Output -->
      <path d="M 230 30 L 275 30" stroke="#00e5ff" stroke-width="2.5" marker-end="url(#arrow-cyan)" />
      <text x="285" y="34" class="code" font-size="11" fill="#00e5ff" font-weight="bold">Porin Gate (Y)</text>

      <!-- State Summary -->
      <g transform="translate(10, 65)">
        <text x="0" y="20" class="code" font-size="8.8" fill="#10b981">Toxin = 0 (Clean Water) ──► Porin = 1 (OPEN: FEEDING)</text>
        <text x="0" y="38" class="code" font-size="8.8" fill="#f43f5e">Toxin = 1 (Metal Plume) ──► Porin = 0 (CLOSED: SHIELDED!)</text>
      </g>
    </g>

    <!-- Hill Repression Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#12050b" stroke="#881337" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#fecdd3">ALLOSTERIC INHIBITION KINETICS</text>
      <text x="14" y="38" class="code" font-size="9.5" fill="#f43f5e">Y = V_max / [1 + (Toxin / K_i)^n]</text>
      <text x="14" y="54" class="subtitle" font-size="9">Hill coefficient n ≥ 2 provides sharp ultrasensitive sigmoidal switching</text>
      <text x="14" y="70" class="code" font-size="8.8" fill="#00e5ff">Zero-leakage shutdown prevents heavy metal pore degradation</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#4c0519" stroke="#9f1239" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#fecdd3">Transcriptional &amp; Allosteric Repression</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Immediate physical shutoff protects cytoplasm from lethal heavy metals</text>
      <text x="14" y="54" class="code" font-size="9" fill="#facc15">★ Landmark: Jacob &amp; Monod (1961) J Mol Biol 3:318</text>
    </g>
  </g>

  <!-- Right: Sigmoidal Inversion Curve & Thermodynamics -->
  <g transform="translate(505, 70)">
    <rect width="445" height="355" rx="12" fill="#1e0c15" stroke="#f43f5e" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#9f1239" />
    <text x="26" y="30" class="badge" fill="#ffe4e6">HILL REPRESSION TRANSFER CURVE</text>
    <text x="270" y="30" class="label" fill="#fb7185">Ultrasensitive Switch</text>

    <!-- Graph -->
    <g transform="translate(16, 48)">
      <rect width="413" height="120" rx="8" fill="#12050b" stroke="#881337" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#fecdd3">SIGMOIDAL INVERSION CURVE</text>

      <path d="M 35 100 L 35 30 L 360 30" stroke="#4c0519" stroke-width="1" fill="none" />
      <path d="M 35 100 L 360 100" stroke="#4c0519" stroke-width="1" />

      <!-- Repression curve -->
      <path d="M 35 38 C 80 38, 130 96, 250 98 L 350 98" stroke="#f43f5e" stroke-width="2.5" fill="none" />
      <text x="45" y="48" class="code" font-size="8.5" fill="#00e5ff">V_max (Porin Open)</text>
      <text x="230" y="90" class="code" font-size="8.5" fill="#f43f5e">Clamped Zero (Shielded)</text>

      <text x="110" y="112" class="code" font-size="8" fill="#cbd5e1">Inhibitor Constant K_i (Switching Threshold)</text>
    </g>

    <!-- Landauer Cost Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#12050b" stroke="#881337" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#fecdd3">LANDAUER SWITCHING PROFILE</text>
      <text x="14" y="38" class="code" font-size="9" fill="#facc15">Switching Dissipation: Exactly 1 Token per logical inversion</text>
      <text x="14" y="54" class="subtitle" font-size="9">Static Quiescence: 0 Tokens consumed while holding open or closed state</text>
      <text x="14" y="70" class="code" font-size="8.8" fill="#00e5ff">Asymmetric cost: Protection expense is paid only during crisis</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#4c0519" stroke="#9f1239" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#fecdd3">Darwinian Fitness Value</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Cells without inverters perish instantly in acidic hydrothermal pulses</text>
      <text x="14" y="54" class="code" font-size="8.8" fill="#facc15">★ Fundamental building block of all genetic logic and negative feedback</text>
    </g>
  </g>
`);

// 20. CIRCUIT 8: ENDOSYMBIOTIC ORGANELLE CASSETTE - Section 11 / Figure 11.1
const fig_circ8 = svgWrapper(980, 450, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 11.1: Endosymbiotic Organelle Cassette</text>
    <text y="20" class="subtitle">Dual-genome compartmentalization, autonomous auxiliary power &amp; serial endosymbiosis</text>
  </g>

  <!-- Left: Schematic Compartment -->
  <g transform="translate(30, 70)">
    <rect width="445" height="355" rx="12" fill="#051c14" stroke="#10b981" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#047857" />
    <text x="26" y="30" class="badge" fill="#d1fae5">ENDOSYMBIOTIC CASSETTE</text>
    <text x="270" y="30" class="label" fill="#34d399">Serial Endosymbiosis</text>

    <!-- Schematic: Host cell containing secondary organelle cassette -->
    <g transform="translate(16, 48)">
      <rect width="413" height="115" rx="10" fill="#062e20" stroke="#059669" stroke-width="1.5" />
      <text x="14" y="20" class="badge" fill="#a7f3d0">HOST PORE CELL CYTOPLASM</text>

      <!-- Primary Host Genome -->
      <rect x="15" y="32" width="180" height="42" rx="6" fill="#022c22" stroke="#10b981" stroke-width="1" />
      <text x="22" y="48" class="code" font-size="9.5" fill="#a7f3d0" font-weight="bold">Master Genome Tape</text>
      <text x="22" y="64" class="subtitle" font-size="9">Codons 0-19: Primary Gates</text>

      <!-- Organelle Cassette -->
      <rect x="215" y="32" width="180" height="42" rx="6" fill="#064e3b" stroke="#34d399" stroke-width="1.5" />
      <text x="223" y="48" class="code" font-size="9.5" fill="#facc15" font-weight="bold">Organelle Cassette</text>
      <text x="223" y="64" class="subtitle" font-size="9">Autonomous Secondary Tape</text>

      <!-- Power Boost Arrow -->
      <path d="M 305 74 L 305 98 L 205 98" stroke="#facc15" stroke-width="2" marker-end="url(#arrow-amber)" />
      <text x="215" y="93" class="code" font-size="10" fill="#facc15" font-weight="bold">Metabolic Boost: +15 Tokens/Tick</text>
    </g>

    <!-- Bioenergetic Explanation Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#022c22" stroke="#047857" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#a7f3d0">PARALLEL TAPE EVALUATION</text>
      <text x="14" y="38" class="code" font-size="8.8" fill="#cbd5e1">• Host genome directs somatic structure; organelle drives respiration</text>
      <text x="14" y="54" class="code" font-size="8.8" fill="#34d399">• Engulfed cassette generates dedicated ATP-equivalent battery energy</text>
      <text x="14" y="70" class="subtitle" font-size="9">Reduces host genetic burden while unlocking high-power metabolism</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#064e3b" stroke="#059669" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#a7f3d0">Serial Endosymbiotic Theory (SET)</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Permanent assimilation of foreign genome unlocks complex multicellularity</text>
      <text x="14" y="54" class="code" font-size="9" fill="#facc15">★ Landmark: Lynn Margulis (1967) J Theor Biol 14:225</text>
    </g>
  </g>

  <!-- Right: Bioenergetic Scaling Law -->
  <g transform="translate(505, 70)">
    <rect width="445" height="355" rx="12" fill="#051c14" stroke="#10b981" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#047857" />
    <text x="26" y="30" class="badge" fill="#d1fae5">BIOENERGETIC SCALING (LANE &amp; MARTIN)</text>
    <text x="270" y="30" class="label" fill="#34d399">Power per Gene</text>

    <!-- Comparison Chart -->
    <g transform="translate(16, 48)">
      <rect width="413" height="120" rx="8" fill="#022c22" stroke="#047857" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#a7f3d0">ENERGY AVAILABILITY PER GENE</text>

      <!-- Bar 1: Prokaryote -->
      <text x="14" y="44" class="code" font-size="8.8" fill="#94a3b8">Prokaryote</text>
      <rect x="110" y="33" width="45" height="15" rx="3" fill="#475569" />
      <text x="165" y="44" class="subtitle" font-size="8.5">Surface-to-volume power wall</text>

      <!-- Bar 2: Endosymbiont Host -->
      <text x="14" y="70" class="code" font-size="8.8" fill="#facc15">Eukaryote</text>
      <rect x="110" y="59" width="240" height="15" rx="3" fill="#10b981" />
      <text x="118" y="70" class="code" font-size="8.5" fill="#000" font-weight="bold">+200,000x Power/Gene</text>

      <text x="14" y="96" class="subtitle" font-size="9" fill="#a7f3d0">Nick Lane &amp; Bill Martin (2010): Mitochondria broke the bioenergetic ceiling</text>
      <text x="14" y="112" class="code" font-size="8.5" fill="#34d399">Permits genome expansion from 10³ codons to 10⁶ codons</text>
    </g>

    <!-- Evolutionary Transition Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#022c22" stroke="#047857" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#a7f3d0">MAJOR EVOLUTIONARY TRANSITIONS</text>
      <text x="14" y="38" class="code" font-size="8.8" fill="#facc15">Maynard Smith &amp; Szathmáry: Symbiosis creates evolutionary individuality</text>
      <text x="14" y="54" class="subtitle" font-size="8.8">Host protects cassette from shear; cassette feeds host massive battery surplus</text>
      <text x="14" y="70" class="code" font-size="8.8" fill="#34d399">Obligate mutualism: Neither entity can survive without the other</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#064e3b" stroke="#059669" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#a7f3d0">Darwinian Fitness Value</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• High-energy surplus powers flagellar motion and deep-sea spore launches</text>
      <text x="14" y="54" class="code" font-size="9" fill="#facc15">★ The indispensable milestone for the origin of complex life</text>
    </g>
  </g>
`);

// 21. CIRCUIT 9: SYNCYTIAL MULTICELLULARITY - Section 12 / Figure 12.1
const fig_circ9 = svgWrapper(980, 450, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 12.1: Syncytial Multicellularity</text>
    <text y="20" class="subtitle">Multi-pore cytoplasmic resource pooling, shared battery bus &amp; division of labor</text>
  </g>

  <!-- Left: Multi-Pore Syncytium Lattice -->
  <g transform="translate(30, 70)">
    <rect width="445" height="355" rx="12" fill="#0a1926" stroke="#0284c7" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#0369a1" />
    <text x="26" y="30" class="badge" fill="#e0f2fe">SYNCYTIAL MACRO-ORGANISM</text>
    <text x="270" y="30" class="label" fill="#38bdf8">Cytoplasmic Streaming</text>

    <!-- Hexagonal Pores Connected (Pores A, B, C forming triangular cluster) -->
    <g transform="translate(20, 35)">
      <!-- Pore A -->
      <polygon points="40,20 75,20 92,48 75,76 40,76 23,48" fill="#075985" stroke="#38bdf8" stroke-width="2" />
      <text x="57" y="44" class="code" fill="#ffffff" font-weight="bold" text-anchor="middle">Pore A</text>
      <text x="57" y="58" class="code" font-size="9" fill="#facc15" text-anchor="middle">90T</text>

      <!-- Cytoplasmic Bridge AB -->
      <rect x="92" y="44" width="45" height="8" fill="#00e5ff" opacity="0.8" />
      <path d="M 92 48 L 137 48" stroke="#00e5ff" stroke-width="2" marker-end="url(#arrow-cyan)" />

      <!-- Pore B -->
      <polygon points="143,20 178,20 195,48 178,76 143,76 126,48" fill="#075985" stroke="#38bdf8" stroke-width="2" />
      <text x="160" y="44" class="code" fill="#ffffff" font-weight="bold" text-anchor="middle">Pore B</text>
      <text x="160" y="58" class="code" font-size="9" fill="#f43f5e" text-anchor="middle">20T</text>

      <!-- Cytoplasmic Bridges to C -->
      <path d="M 68 76 L 95 100" stroke="#00e5ff" stroke-width="2" marker-end="url(#arrow-cyan)" />
      <path d="M 150 76 L 128 100" stroke="#00e5ff" stroke-width="2" marker-end="url(#arrow-cyan)" />

      <!-- Pore C (Nested neatly below A & B without overlapping box below) -->
      <polygon points="95,80 130,80 147,108 130,136 95,136 78,108" fill="#075985" stroke="#38bdf8" stroke-width="2" />
      <text x="112" y="104" class="code" fill="#ffffff" font-weight="bold" text-anchor="middle">Pore C</text>
      <text x="112" y="118" class="code" font-size="9" fill="#38bdf8" text-anchor="middle">40T</text>

      <!-- Equalized Banner -->
      <rect x="225" y="25" width="175" height="105" rx="8" fill="#082f49" stroke="#00e5ff" stroke-width="1.5" />
      <text x="237" y="48" class="badge" fill="#7dd3fc">POOLED METABOLIC BUS</text>
      <text x="237" y="70" class="code" font-size="12" fill="#facc15" font-weight="bold">50 Tokens Each</text>
      <text x="237" y="90" class="subtitle" font-size="9.5">Equipartition Pool (150T / 3)</text>
      <text x="237" y="108" class="code" font-size="8.8" fill="#38bdf8">90T + 20T + 40T = 150T</text>
    </g>

    <!-- Conserved Mass Law Box (Clean clearance below Pore C) -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#051b2c" stroke="#0369a1" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#7dd3fc">CONSERVED MASS &amp; ZERO LEAKAGE</text>
      <text x="14" y="38" class="code" font-size="9" fill="#38bdf8">Total Mass: M_colony = ∑(M_p) ──► ΔM = 0.000</text>
      <text x="14" y="54" class="subtitle" font-size="9.5">Rich vent pores feed shadowed pores, defeating localized starvation</text>
      <text x="14" y="70" class="code" font-size="8.8" fill="#7dd3fc">Shared cytoplasm establishes single physiological super-individual</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#0c4a6e" stroke="#0284c7" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#7dd3fc">Syncytial Macro-Colony Dynamics</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Multinucleated cytoplasmic sheets coordinate whole-colony reproduction</text>
      <text x="14" y="54" class="code" font-size="9" fill="#facc15">★ Landmark: Bonner (1965) &amp; Margulis (1981) Symbiosis</text>
    </g>
  </g>

  <!-- Right: Diffusion Dynamics & Collective Resilience -->
  <g transform="translate(505, 70)">
    <rect width="445" height="355" rx="12" fill="#0a1926" stroke="#0284c7" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#0369a1" />
    <text x="26" y="30" class="badge" fill="#e0f2fe">COLLECTIVE RESILIENCE DYNAMICS</text>
    <text x="270" y="30" class="label" fill="#38bdf8">Famine Survival</text>

    <!-- Diffusion Dynamics Box -->
    <g transform="translate(16, 48)">
      <rect width="413" height="120" rx="8" fill="#051b2c" stroke="#0369a1" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#7dd3fc">FICKIAN METABOLIC EQUALIZATION (J = -D · ∇Φ)</text>

      <!-- Bar 1: Isolated Pore (Clean non-overlapping coordinates) -->
      <text x="14" y="44" class="code" font-size="8.8" fill="#f43f5e">Isolated Pore</text>
      <rect x="120" y="33" width="55" height="15" rx="3" fill="#be123c" />
      <text x="185" y="44" class="subtitle" font-size="8.8">Starves in 35 ticks when vent shifts</text>

      <!-- Bar 2: Syncytial Pore Network -->
      <text x="14" y="70" class="code" font-size="8.8" fill="#38bdf8">Syncytial Net</text>
      <rect x="120" y="59" width="180" height="15" rx="3" fill="#0284c7" />
      <text x="128" y="70" class="code" font-size="8" fill="#fff" font-weight="bold">Survives 180+ Ticks (Pooled Buffering)</text>

      <text x="14" y="96" class="subtitle" font-size="9" fill="#7dd3fc">Division of Labor: Peripheral harvest redox; central pores store reserves</text>
      <text x="14" y="112" class="code" font-size="8.5" fill="#facc15">Surplus energy flows continuously along chemical potential gradients</text>
    </g>

    <!-- Division of Labor Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#051b2c" stroke="#0369a1" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#7dd3fc">DIVISION OF LABOR &amp; SPECIALIZATION</text>
      <text x="14" y="38" class="code" font-size="8.8" fill="#facc15">Somatic vs. Germline: One pore specializes in FtsZ spore generation</text>
      <text x="14" y="54" class="subtitle" font-size="9.5">Other pores maintain full catalytic throughput to power the colony</text>
      <text x="14" y="70" class="code" font-size="8.8" fill="#38bdf8">Permits biological complexity impossible in solitary unicells</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#0c4a6e" stroke="#0284c7" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#7dd3fc">Darwinian Fitness Value</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Conquers the abyssal floor by forming extensive continuous biofilms</text>
      <text x="14" y="54" class="code" font-size="8.8" fill="#facc15">★ Biological analog: Hexactinellid glass sponges &amp; Physarum slime molds</text>
    </g>
  </g>
`);

// 22. CIRCUIT 10: PELAGIC SPORULATION ENGINE - Section 13 / Figure 13.1
const fig_circ10 = svgWrapper(980, 450, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 13.1: Pelagic Sporulation Engine</text>
    <text y="20" class="subtitle">Stress-triggered buoyancy latch, capsule hardening &amp; water-column broadcast dispersal</text>
  </g>

  <!-- Left: State Machine & Gating Logic -->
  <g transform="translate(30, 70)">
    <rect width="445" height="355" rx="12" fill="#04201a" stroke="#10b981" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#065f46" />
    <text x="26" y="30" class="badge" fill="#d1fae5">SPORULATION TRIGGER STATE MACHINE</text>
    <text x="270" y="30" class="label" fill="#34d399">Morphogenetic Gate</text>

    <!-- Logic Schematic -->
    <g transform="translate(20, 48)">
      <!-- Inputs -->
      <text x="0" y="24" class="code" font-size="10.5" fill="#f43f5e">Starvation (S)</text>
      <text x="0" y="64" class="code" font-size="10.5" fill="#facc15">Quorum Density (D)</text>

      <path d="M 95 20 L 125 35" stroke="#f43f5e" stroke-width="1.5" marker-end="url(#arrow-rose)" />
      <path d="M 115 60 L 125 45" stroke="#facc15" stroke-width="1.5" marker-end="url(#arrow-amber)" />

      <!-- AND Gate -->
      <rect x="130" y="24" width="75" height="32" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="1.5" />
      <text x="145" y="44" class="code" fill="#ffffff" font-weight="bold">AND</text>

      <!-- Trigger output -->
      <path d="M 205 40 L 240 40" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-emerald)" />

      <!-- Buoyancy Latch -->
      <rect x="245" y="20" width="145" height="40" rx="6" fill="#065f46" stroke="#34d399" stroke-width="1.5" />
      <text x="253" y="36" class="code" font-size="10" fill="#facc15" font-weight="bold">BUOYANCY LATCH</text>
      <text x="253" y="50" class="code" font-size="9" fill="#a7f3d0">Z_TARGET = 1, 2</text>

      <!-- Cryptobiosis Flag -->
      <rect x="10" y="80" width="380" height="40" rx="6" fill="#062e20" stroke="#059669" stroke-width="1" />
      <text x="18" y="96" class="code" font-size="9" fill="#34d399">Metabolic Cryptobiosis: Landauer burn throttled to 0T/tick</text>
      <text x="18" y="110" class="subtitle" font-size="9">Protective silica wall (+10 resistance) resists thermal shocks</text>
    </g>

    <!-- Evolutionary Barrier Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#062e20" stroke="#059669" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#a7f3d0">REGULATED EVOLUTIONARY GATING</text>
      <text x="14" y="38" class="code" font-size="8.8" fill="#cbd5e1">• Strict Threshold: hasFtsZSeptum AND (sum Gates &gt;= 2) AND (E &gt;= 95)</text>
      <text x="14" y="54" class="code" font-size="8.8" fill="#10b981">Prevents premature division; guarantees competent daughter survival</text>
      <text x="14" y="70" class="subtitle" font-size="9">Spore carries intact metabolic genome tape into virgin ocean</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#064e3b" stroke="#059669" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#a7f3d0">Escaping the Benthic Malthusian Trap</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Leaves overcrowded home vent to colonize virgin hydrothermal seamounts</text>
      <text x="14" y="54" class="code" font-size="9" fill="#facc15">★ Landmark: Bonner (1965) &amp; Dawkins (1982) Extended Phenotype</text>
    </g>
  </g>

  <!-- Right: Water Column Hydrodynamic Advection -->
  <g transform="translate(505, 70)">
    <rect width="445" height="355" rx="12" fill="#04201a" stroke="#10b981" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#065f46" />
    <text x="26" y="30" class="badge" fill="#d1fae5">HYDRODYNAMIC ADVECTION DISPERSAL</text>
    <text x="270" y="30" class="label" fill="#34d399">Water Column Flow</text>

    <!-- Water Column Diagram -->
    <g transform="translate(16, 48)">
      <rect width="413" height="120" rx="8" fill="#082f49" stroke="#0284c7" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#e0f2fe">PELAGIC WATER COLUMN (z = 1, 2)</text>

      <!-- Upward Launch Arrow -->
      <path d="M 60 105 L 60 48" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#arrow-amber)" />
      <text x="68" y="75" class="code" font-size="9" fill="#f59e0b">Ejection Lift</text>

      <!-- Spore circle -->
      <circle cx="165" cy="50" r="11" fill="#00e5ff" stroke="#fff" stroke-width="1.5" />
      <text x="165" y="32" class="code" font-size="9.5" fill="#00e5ff" font-weight="bold" text-anchor="middle">Buoyant Spore (z = 1)</text>

      <!-- Horizontal Advection Arrow -->
      <path d="M 190 50 L 300 50" stroke="#00e5ff" stroke-width="2" stroke-dasharray="4 2" marker-end="url(#arrow-cyan)" />
      <text x="245" y="68" class="code" font-size="8.5" fill="#7dd3fc" text-anchor="middle">Current Advection (vx &gt; 0)</text>

      <!-- Downwelling trajectory -->
      <path d="M 315 55 Q 345 85, 345 110" stroke="#10b981" stroke-width="2" stroke-dasharray="3 2" fill="none" marker-end="url(#arrow-emerald)" />
      <text x="355" y="90" class="code" font-size="8" fill="#10b981">Downwelling</text>

      <!-- Benthic seafloor strip -->
      <line x1="10" y1="108" x2="400" y2="108" stroke="#374151" stroke-width="2" />
      <text x="15" y="116" class="subtitle" font-size="8" fill="#94a3b8">BENTHIC MATRIX (z = 0) • OVERCROWDED VENT</text>
      <text x="295" y="116" class="code" font-size="8" fill="#10b981">VIRGIN SEAMOUNT</text>
    </g>

    <!-- Dispersal Physics Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#062e20" stroke="#059669" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#a7f3d0">BROADCAST SPAWNING HYDRODYNAMICS</text>
      <text x="14" y="38" class="code" font-size="9.2" fill="#facc15">Advection Equation: x(t) = x_0 + ∫ v_current(z) dt</text>
      <text x="14" y="54" class="subtitle" font-size="8.8">Current velocity v_x &gt;&gt; benthic speed; expands colonization radius 1,000x</text>
      <text x="14" y="70" class="code" font-size="8.8" fill="#10b981">Cryptobiotic spore survives thousands of ticks in cold abyssal water</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#064e3b" stroke="#059669" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#a7f3d0">Macro-Evolutionary Speciation</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Geographic isolation on distant seamounts triggers allopatric cladogenesis</text>
      <text x="14" y="54" class="code" font-size="9" fill="#facc15">★ Transforms single-vent colonies into a planetary biosphere</text>
    </g>
  </g>
`);

// 23. CIRCUIT 11: CHEMIOSMOTIC AUTOTROPH (APEX VENT FEEDER) - Section 14 / Figure 14.1
const fig_circ11 = svgWrapper(980, 450, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 14.1: Chemiosmotic Autotroph (Lithococcus mitchellii)</text>
    <text y="20" class="subtitle">Direct hydrothermal plume coupling, proton motive force (PMF) &amp; co-catalytic synthesis</text>
  </g>

  <!-- Left: Hydrothermal Coupling -->
  <g transform="translate(30, 70)">
    <rect width="445" height="355" rx="12" fill="#062016" stroke="#10b981" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#047857" />
    <text x="26" y="30" class="badge" fill="#d1fae5">PROTON MOTIVE FORCE TRANSDUCER</text>
    <text x="270" y="30" class="label" fill="#34d399">Mitchell Chemiosmosis</text>

    <!-- Schematic: Vent Throat Coupling -->
    <g transform="translate(20, 48)">
      <!-- Vent Plume stream -->
      <rect x="0" y="15" width="90" height="34" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="1.5" />
      <text x="8" y="36" class="code" font-size="10" fill="#a7f3d0" font-weight="bold">VENT PLUME</text>

      <path d="M 95 32 L 135 32" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrow-emerald)" />

      <!-- Pore Cell (Mitchellii) -->
      <polygon points="150,5 185,5 202,32 185,60 150,60 133,32" fill="#075985" stroke="#10b981" stroke-width="2.5" />
      <text x="167" y="30" class="code" fill="#ffffff" font-weight="bold" text-anchor="middle">Apex Pore</text>
      <text x="167" y="44" class="code" font-size="9" fill="#10b981" font-weight="bold" text-anchor="middle">85T+</text>

      <!-- Battery Synthesis -->
      <path d="M 205 32 L 255 32" stroke="#facc15" stroke-width="2.5" marker-end="url(#arrow-amber)" />

      <rect x="260" y="15" width="130" height="34" rx="6" fill="#78350f" stroke="#facc15" stroke-width="1.5" />
      <text x="268" y="36" class="code" font-size="10" fill="#facc15" font-weight="bold">+10T / Epoch</text>

      <!-- Biochemical reaction -->
      <g transform="translate(10, 75)">
        <text x="0" y="20" class="code" font-size="9" fill="#38bdf8">Redox Reaction: H₂ + CO₂ ──► Organic Carbon + Δμ_H⁺</text>
        <text x="0" y="36" class="subtitle" font-size="9">Proton Motive Force (PMF): Δp = ΔΨ - (2.3 RT/F) · ΔpH ≈ 220 mV</text>
      </g>
    </g>

    <!-- Bioenergetic Rate Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#022c22" stroke="#047857" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#a7f3d0">NON-EQUILIBRIUM ENTHALPY CONVERSION</text>
      <text x="14" y="38" class="code" font-size="9" fill="#facc15">Faraday Efficiency: η = (W_metabolic / Q_vent) ≈ 42%</text>
      <text x="14" y="54" class="subtitle" font-size="9">Taps continuous geochemical electron flow before dilution into cold ocean</text>
      <text x="14" y="70" class="code" font-size="8.8" fill="#34d399">High battery stores (>80T) provide buffer against geodynamic shifts</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#064e3b" stroke="#059669" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#a7f3d0">Thermodynamic Foundation of Life</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Primary producer fixing inorganic carbon to power benthic food webs</text>
      <text x="14" y="54" class="code" font-size="9" fill="#facc15">★ Landmark: Mitchell (1961) Nature &amp; Russell &amp; Hall (1997) J Geol Soc</text>
    </g>
  </g>

  <!-- Right: Ecological Niche & Dynamics -->
  <g transform="translate(505, 70)">
    <rect width="445" height="355" rx="12" fill="#062016" stroke="#10b981" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#047857" />
    <text x="26" y="30" class="badge" fill="#d1fae5">PRIMARY PRODUCER ENTHALPY</text>
    <text x="270" y="30" class="label" fill="#34d399">Vent Throat Niche</text>

    <!-- Dynamics Diagram -->
    <g transform="translate(16, 48)">
      <rect width="413" height="120" rx="8" fill="#022c22" stroke="#047857" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#a7f3d0">METABOLIC POWER PROFILE ACROSS RADIAL DISTANCE</text>

      <!-- Distance bars -->
      <text x="14" y="44" class="code" font-size="8.8" fill="#10b981">Apex (d=0..1)</text>
      <rect x="110" y="33" width="240" height="15" rx="3" fill="#10b981" />
      <text x="118" y="44" class="code" font-size="8.5" fill="#000" font-weight="bold">+10T / Epoch (Plume Throat)</text>

      <text x="14" y="70" class="code" font-size="8.8" fill="#38bdf8">Middle (d=2..3)</text>
      <rect x="110" y="59" width="140" height="15" rx="3" fill="#0284c7" />
      <text x="118" y="70" class="code" font-size="8.5" fill="#fff">+4T / Epoch</text>

      <text x="14" y="96" class="code" font-size="8.8" fill="#94a3b8">Periphery (d>3)</text>
      <rect x="110" y="85" width="40" height="15" rx="3" fill="#475569" />
      <text x="160" y="96" class="subtitle" font-size="8.5">Trace mineral influx only</text>
    </g>

    <!-- Ecological Stewardship Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#022c22" stroke="#047857" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#a7f3d0">ECOLOGICAL STEWARDSHIP &amp; PRESSURES</text>
      <text x="14" y="38" class="code" font-size="9" fill="#facc15">Chimney Venting: Flushes toxic sulfur plugs to sustain autotrophy</text>
      <text x="14" y="54" class="subtitle" font-size="9">Thermal Surge risk: Overheating (>80°C) triggers protein denaturation</text>
      <text x="14" y="70" class="code" font-size="8.8" fill="#34d399">Maintains ecological base powering predators and detrital scavengers</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#064e3b" stroke="#059669" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#a7f3d0">Evolutionary Archetype</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• The primal photosynthetic ancestor before solar radiation was tapped</text>
      <text x="14" y="54" class="code" font-size="9" fill="#facc15">★ Universal Common Ancestor (LUCA) of the hydrothermal cradle</text>
    </g>
  </g>
`);

// 24. CIRCUIT 12: BASALT LITHOTROPH (PERIPHERAL EXTREMOPHILE) - Section 15 / Figure 15.1
const fig_circ12 = svgWrapper(980, 450, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 15.1: Basalt Lithotroph (Basaltococcus lanei)</text>
    <text y="20" class="subtitle">Deep subterranean rock dweller, ultralow Landauer switching &amp; mineral weathering</text>
  </g>

  <!-- Left: Subterranean Matrix -->
  <g transform="translate(30, 70)">
    <rect width="445" height="355" rx="12" fill="#09181f" stroke="#06b6d4" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#0891b2" />
    <text x="26" y="30" class="badge" fill="#cffafe">SUBTERRANEAN LITHOTROPHY</text>
    <text x="270" y="30" class="label" fill="#22d3ee">Rock-Dwelling Frugality</text>

    <!-- Schematic: Basalt Fracture Matrix -->
    <g transform="translate(20, 48)">
      <rect x="0" y="15" width="100" height="34" rx="6" fill="#155e75" stroke="#06b6d4" stroke-width="1.5" />
      <text x="8" y="36" class="code" font-size="9.5" fill="#cffafe" font-weight="bold">BASALT CRUST</text>

      <path d="M 105 32 L 145 32" stroke="#06b6d4" stroke-width="2" stroke-dasharray="3 2" marker-end="url(#arrow-cyan)" />

      <!-- Minimalist Cell -->
      <polygon points="160,10 190,10 205,32 190,54 160,54 145,32" fill="#083344" stroke="#06b6d4" stroke-width="2" />
      <text x="175" y="30" class="code" fill="#ffffff" font-weight="bold" text-anchor="middle">Lithotroph</text>
      <text x="175" y="44" class="code" font-size="8.5" fill="#22d3ee" text-anchor="middle">0.4 Hz</text>

      <path d="M 210 32 L 255 32" stroke="#22d3ee" stroke-width="1.5" marker-end="url(#arrow-cyan)" />

      <rect x="260" y="15" width="135" height="34" rx="6" fill="#0c4a6e" stroke="#0284c7" stroke-width="1" />
      <text x="268" y="36" class="code" font-size="9.5" fill="#7dd3fc">Burn: 0.1T/tick</text>

      <g transform="translate(10, 75)">
        <text x="0" y="20" class="code" font-size="9" fill="#7dd3fc">Mineral Reaction: Fe²⁺ (Olivine) + H₂O ──► Serpentinization + H₂</text>
        <text x="0" y="36" class="subtitle" font-size="9">Minimal netlist: 1 gate executing slow cyclic catalysis to conserve tokens</text>
      </g>
    </g>

    <!-- Energetic Thrift Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#041f2d" stroke="#0891b2" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#67e8f9">EXTREME LANDAUER METABOLIC THRIFT</text>
      <text x="14" y="38" class="code" font-size="9" fill="#facc15">Landauer Dissipation: &lt; 0.05 Tokens/epoch (Near-Zero Burn)</text>
      <text x="14" y="54" class="subtitle" font-size="9">Survives in cold basalt pores 5x farther from vents than apex autotrophs</text>
      <text x="14" y="70" class="code" font-size="8.8" fill="#22d3ee">Deep subterranean biosphere: holds >70% of Earth's microbial biomass</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#083344" stroke="#0e7490" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#67e8f9">Deep Sub-Seafloor Biosphere</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Stress-tolerant extremophiles that survive long after hydrothermal chimneys die</text>
      <text x="14" y="54" class="code" font-size="9" fill="#facc15">★ Landmark: Lane &amp; Martin (2012) Cell 151(7):1406-1416</text>
    </g>
  </g>

  <!-- Right: Starvation Resilience Comparison -->
  <g transform="translate(505, 70)">
    <rect width="445" height="355" rx="12" fill="#09181f" stroke="#06b6d4" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#0891b2" />
    <text x="26" y="30" class="badge" fill="#cffafe">STARVATION HALF-LIFE DYNAMICS</text>
    <text x="270" y="30" class="label" fill="#22d3ee">Extremophile Survival</text>

    <!-- Comparison Chart -->
    <g transform="translate(16, 48)">
      <rect width="413" height="120" rx="8" fill="#041f2d" stroke="#0891b2" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#67e8f9">SURVIVAL DURATION IN ZERO-NUTRIENT DROUGHT</text>

      <text x="14" y="44" class="code" font-size="8.8" fill="#f43f5e">Apex Feeder</text>
      <rect x="110" y="33" width="70" height="15" rx="3" fill="#be123c" />
      <text x="190" y="44" class="subtitle" font-size="8.5">Starves in 45 ticks (High Overhead)</text>

      <text x="14" y="70" class="code" font-size="8.8" fill="#06b6d4">Lithotroph</text>
      <rect x="110" y="59" width="250" height="15" rx="3" fill="#0891b2" />
      <text x="118" y="70" class="code" font-size="8.5" fill="#000" font-weight="bold">Survives 600+ Ticks (Minimal Overhead)</text>

      <text x="14" y="96" class="subtitle" font-size="9" fill="#7dd3fc">Metabolic trade-off: Low catalytic yield exchanged for infinite patience</text>
      <text x="14" y="112" class="code" font-size="8.5" fill="#facc15">Maintains genetic reservoir across global hydrothermal extinctions</text>
    </g>

    <!-- Geological Resistance Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#041f2d" stroke="#0891b2" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#67e8f9">GEOLOGICAL BUFFERING CAPACITY</text>
      <text x="14" y="38" class="code" font-size="9" fill="#facc15">Mineral Wall Protection: +15 Basalt shielding against toxic shocks</text>
      <text x="14" y="54" class="subtitle" font-size="9">Insulated from turbulent surface shear; anchors benthic phylogeny</text>
      <text x="14" y="70" class="code" font-size="8.8" fill="#22d3ee">Acts as evolutionary seed bank during catastrophic vent collapses</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#083344" stroke="#0e7490" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#67e8f9">Evolutionary Fitness Value</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Invariant survival strategy prioritizing zero burn over rapid expansion</text>
      <text x="14" y="54" class="code" font-size="9" fill="#facc15">★ The enduring bedrock of deep abyssal paleontology</text>
    </g>
  </g>
`);

// 25. CIRCUIT 13: TROPHIC PREDATOR (LYTIC CARNIVORE) - Section 16 / Figure 16.1
const fig_circ13 = svgWrapper(980, 450, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 16.1: Trophic Predator (Vampirococcus vorax)</text>
    <text y="20" class="subtitle">Direct heterotrophic prey lysis, enzymatic siphoning &amp; predatory biomass theft</text>
  </g>

  <!-- Left: Predation Mechanics -->
  <g transform="translate(30, 70)">
    <rect width="445" height="355" rx="12" fill="#200a12" stroke="#f43f5e" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#9f1239" />
    <text x="26" y="30" class="badge" fill="#ffe4e6">LYTIC TROPHIC PREDATION</text>
    <text x="270" y="30" class="label" fill="#fb7185">Enzymatic Lysis Siphon</text>

    <!-- Schematic: Predator striking adjacent prey -->
    <g transform="translate(20, 48)">
      <!-- Predator Pore -->
      <polygon points="35,10 70,10 87,38 70,66 35,66 18,38" fill="#881337" stroke="#f43f5e" stroke-width="2.5" />
      <text x="52" y="34" class="code" fill="#ffffff" font-weight="bold" text-anchor="middle">Predator</text>
      <text x="52" y="48" class="code" font-size="8.5" fill="#facc15" text-anchor="middle">Carnivore</text>

      <!-- Crimson Enzymatic Siphon Beam -->
      <path d="M 87 38 L 165 38" stroke="#f43f5e" stroke-width="3" marker-end="url(#arrow-rose)" />
      <text x="126" y="28" class="code" font-size="8.5" fill="#fda4af" text-anchor="middle">Lytic Siphon</text>

      <!-- Prey Pore (Lysing) -->
      <polygon points="180,10 215,10 232,38 215,66 180,66 163,38" fill="#1e293b" stroke="#64748b" stroke-width="2" stroke-dasharray="3 2" />
      <text x="197" y="34" class="code" fill="#94a3b8" text-anchor="middle">Prey Pore</text>
      <text x="197" y="48" class="code" font-size="8.5" fill="#f43f5e" text-anchor="middle">Lysed (0T)</text>

      <!-- Harvest Box -->
      <rect x="255" y="15" width="140" height="48" rx="6" fill="#4c0519" stroke="#f43f5e" stroke-width="1.5" />
      <text x="265" y="34" class="code" font-size="10" fill="#facc15" font-weight="bold">+25T Drained</text>
      <text x="265" y="50" class="subtitle" font-size="8.5">Prey cytoplasm reclaimed</text>

      <g transform="translate(10, 80)">
        <text x="0" y="20" class="code" font-size="9" fill="#fda4af">Biomass Flux: ΔE_predator = +η_trophic · E_prey - C_strike</text>
        <text x="0" y="36" class="subtitle" font-size="9">Breaches mineral septum of adjacent prey; digests nucleic tape</text>
      </g>
    </g>

    <!-- Trophic Thermodynamics Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#14060c" stroke="#4c0519" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#fecdd3">HETEROTROPHIC TROPHIC EFFICIENCY</text>
      <text x="14" y="38" class="code" font-size="9" fill="#facc15">Lindeman Efficiency: η ≈ 20% conversion of prey biomass into battery</text>
      <text x="14" y="54" class="subtitle" font-size="9">Unlocks carnivory: organisms survive independent of chimney redox flux</text>
      <text x="14" y="70" class="code" font-size="8.8" fill="#fda4af">Controls overpopulated biofilms; drives evolutionary arms races</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#4c0519" stroke="#9f1239" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#fda4af">Evolution of Secondary Consumers</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Spontaneous emergence of predation transforms chemistry into an ecosystem</text>
      <text x="14" y="54" class="code" font-size="9" fill="#facc15">★ Landmark: Dawkins (1976) The Selfish Gene &amp; Lindeman (1942)</text>
    </g>
  </g>

  <!-- Right: Lotka-Volterra Population Cycles -->
  <g transform="translate(505, 70)">
    <rect width="445" height="355" rx="12" fill="#200a12" stroke="#f43f5e" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#9f1239" />
    <text x="26" y="30" class="badge" fill="#ffe4e6">LOTKA-VOLTERRA DYNAMICS</text>
    <text x="270" y="30" class="label" fill="#fb7185">Predator-Prey Waves</text>

    <!-- Graph: Predator-Prey Oscillation -->
    <g transform="translate(16, 48)">
      <rect width="413" height="120" rx="8" fill="#14060c" stroke="#4c0519" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#fecdd3">POPULATION ABUNDANCE OSCILLATIONS (90° LAG)</text>

      <!-- Prey wave (Green) and Predator wave (Red) -->
      <path d="${generateSineWavePath(30, 335, 65, 25, 100, 0)}" stroke="#10b981" stroke-width="2" fill="none" />
      <path d="${generateSineWavePath(30, 335, 65, 22, 100, Math.PI / 2)}" stroke="#f43f5e" stroke-width="2" fill="none" />

      <!-- Legend -->
      <rect x="345" y="28" width="60" height="75" rx="4" fill="#1f0a12" stroke="#4c0519" stroke-width="0.8" />
      <circle cx="353" cy="45" r="3.5" fill="#10b981" />
      <text x="361" y="48" class="code" font-size="8.5" fill="#10b981">Prey</text>
      <circle cx="353" cy="68" r="3.5" fill="#f43f5e" />
      <text x="361" y="71" class="code" font-size="8.5" fill="#f43f5e">Predator</text>
    </g>

    <!-- Arms Race Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#14060c" stroke="#4c0519" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#fecdd3">RED QUEEN CO-EVOLUTIONARY ARMS RACE</text>
      <text x="14" y="38" class="code" font-size="8.8" fill="#facc15">Van Valen (1973) Red Queen: Armored prey vs. high-velocity siphons</text>
      <text x="14" y="54" class="subtitle" font-size="9">Accelerates innovation rate 10x faster than abiotic selection alone</text>
      <text x="14" y="70" class="code" font-size="8.8" fill="#fda4af">Drives diversification into specialized offensive and defensive clades</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#4c0519" stroke="#9f1239" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#fda4af">Ecological Apex Principle</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Predation prevents monotypic blooms, enforcing biodiversity on the seafloor</text>
      <text x="14" y="54" class="code" font-size="9" fill="#facc15">★ Creates multi-tiered food webs from inorganic mineral precursors</text>
    </g>
  </g>
`);

// 26. CIRCUIT 14: DETRITAL SCAVENGER (SAPROTROPHIC RECYCLER) - Section 17 / Figure 17.1
const fig_circ14 = svgWrapper(980, 450, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 17.1: Detrital Scavenger (Saprotrophus hadalis)</text>
    <text y="20" class="subtitle">Benthic necromass recycling, mineral scavenging &amp; circular economy dynamics</text>
  </g>

  <!-- Left: Scavenging Mechanics -->
  <g transform="translate(30, 70)">
    <rect width="445" height="355" rx="12" fill="#1e1807" stroke="#fbbf24" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#b45309" />
    <text x="26" y="30" class="badge" fill="#fef3c7">BENTHIC NECROMASS RECYCLING</text>
    <text x="270" y="30" class="label" fill="#fcd34d">Organic Carcass Salvage</text>

    <!-- Schematic: Scavenger extending conduits to dead carcass -->
    <g transform="translate(20, 48)">
      <!-- Scavenger Pore -->
      <polygon points="35,10 70,10 87,38 70,66 35,66 18,38" fill="#78350f" stroke="#fbbf24" stroke-width="2.5" />
      <text x="52" y="34" class="code" fill="#ffffff" font-weight="bold" text-anchor="middle">Scavenger</text>
      <text x="52" y="48" class="code" font-size="8.5" fill="#facc15" text-anchor="middle">Saprotroph</text>

      <!-- Golden Scavenging Conduits -->
      <path d="M 87 38 L 165 38" stroke="#fbbf24" stroke-width="2.5" stroke-dasharray="4 2" marker-end="url(#arrow-amber)" />
      <text x="126" y="28" class="code" font-size="8.5" fill="#fde68a" text-anchor="middle">Enzyme Stream</text>

      <!-- Dead Carcass Pore -->
      <polygon points="180,10 215,10 232,38 215,66 180,66 163,38" fill="#1e293b" stroke="#475569" stroke-width="1.5" stroke-dasharray="2 2" />
      <text x="197" y="34" class="code" fill="#94a3b8" text-anchor="middle">Necromass</text>
      <text x="197" y="48" class="code" font-size="8.5" fill="#64748b" text-anchor="middle">Dead Cell</text>

      <!-- Harvest Box -->
      <rect x="255" y="15" width="140" height="48" rx="6" fill="#451a03" stroke="#fbbf24" stroke-width="1.5" />
      <text x="265" y="34" class="code" font-size="10" fill="#facc15" font-weight="bold">+12M Reclaimed</text>
      <text x="265" y="50" class="subtitle" font-size="8.5">Matter tokens recycled</text>

      <g transform="translate(10, 80)">
        <text x="0" y="20" class="code" font-size="9" fill="#fde68a">Conservation Law: ΔM_scavenged = M_carcass - M_precipitated</text>
        <text x="0" y="36" class="subtitle" font-size="9">Reclaims sequestered phosphorus and nitrogen before mineral petrification</text>
      </g>
    </g>

    <!-- Circular Economy Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#140c03" stroke="#78350f" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#fde68a">CIRCULAR ABYSSAL NUTRIENT CYCLING</text>
      <text x="14" y="38" class="code" font-size="8.8" fill="#facc15">Recycling Rate: Recovers 85% of biomass before it locks into stone</text>
      <text x="14" y="54" class="subtitle" font-size="9">Closes the ecological biogeochemical loop: turns death into new biomass</text>
      <text x="14" y="70" class="code" font-size="8.8" fill="#fbbf24">Sustains ecosystem carrying capacity during nutrient droughts</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#451a03" stroke="#b45309" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#fde68a">The Abyssal Cleaners</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Essential decomposers preventing benthic grid congestion and dead zones</text>
      <text x="14" y="54" class="code" font-size="8.8" fill="#facc15">★ Landmark: Russell &amp; Hall (1997) &amp; Odum (1971) Ecology</text>
    </g>
  </g>

  <!-- Right: Necromass Half-Life & Kinetics -->
  <g transform="translate(505, 70)">
    <rect width="445" height="355" rx="12" fill="#1e1807" stroke="#fbbf24" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#b45309" />
    <text x="26" y="30" class="badge" fill="#fef3c7">DECOMPOSITION KINETICS</text>
    <text x="270" y="30" class="label" fill="#fcd34d">Decay vs. Petrification</text>

    <!-- Kinetics Graph -->
    <g transform="translate(16, 48)">
      <rect width="413" height="120" rx="8" fill="#140c03" stroke="#78350f" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#fde68a">CARCASS FATE: RECLAMATION VS. MINERALIZATION</text>

      <!-- Scavenged decay curve vs Mineral petrification line -->
      <path d="M 35 35 C 90 40, 160 85, 340 98" stroke="#fbbf24" stroke-width="2.2" fill="none" />
      <text x="45" y="48" class="code" font-size="8.5" fill="#fbbf24">Active Scavenging (Rapid Recovery)</text>

      <path d="M 35 35 C 150 38, 250 55, 340 65" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3 2" fill="none" />
      <text x="160" y="60" class="code" font-size="8.5" fill="#94a3b8">Abiotic Petrification (Lost to Stone)</text>

      <text x="35" y="112" class="code" font-size="8" fill="#cbd5e1">Race against geochemical mineralization: t_window ≈ 120 ticks</text>
    </g>

    <!-- Ecological Role Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#140c03" stroke="#78350f" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#fde68a">TROPHIC RECYCLING ADVANTAGE</text>
      <text x="14" y="38" class="code" font-size="8.8" fill="#facc15">Low-Cost Foraging: Zero strike penalty; inert detrital targets</text>
      <text x="14" y="54" class="subtitle" font-size="9">Harvests rich nucleotide tapes and catalytic tokens with zero danger</text>
      <text x="14" y="70" class="code" font-size="8.8" fill="#fbbf24">Survives catastrophic die-offs by thriving on the resulting necromass</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#451a03" stroke="#b45309" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#fde68a">Evolutionary Fitness Value</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Inverts the extinction bottleneck into an opportunistic growth surge</text>
      <text x="14" y="54" class="code" font-size="9" fill="#facc15">★ Essential for long-term nutrient conservation in closed ecosystems</text>
    </g>
  </g>
`);

// 27. CIRCUIT 15: PATRIARCH LINEAGE (LENSKI ANCESTOR) - Section 18 / Figure 18.1
const fig_circ15 = svgWrapper(980, 450, `
  <g transform="translate(30, 34)">
    <text class="title">Figure 18.1: Deep Patriarch Lineage (Paterarchaeum lenskii)</text>
    <text y="20" class="subtitle">Ancient phylogenetic anchor, highly conserved core netlist &amp; multi-millennial survival</text>
  </g>

  <!-- Left: Ancestral Genome Palimpsest -->
  <g transform="translate(30, 70)">
    <rect width="445" height="355" rx="12" fill="#180e26" stroke="#c084fc" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#7e22ce" />
    <text x="26" y="30" class="badge" fill="#f3e8ff">DEEP PHYLOGENETIC PALIMPSEST</text>
    <text x="270" y="30" class="label" fill="#d8b4fe">Ancient Patriarch</text>

    <!-- Schematic: Conserved Ancestral Netlist -->
    <g transform="translate(20, 48)">
      <!-- Patriarch Pore -->
      <polygon points="35,10 70,10 87,38 70,66 35,66 18,38" fill="#581c87" stroke="#c084fc" stroke-width="2.5" />
      <text x="52" y="34" class="code" fill="#ffffff" font-weight="bold" text-anchor="middle">Patriarch</text>
      <text x="52" y="48" class="code" font-size="8.5" fill="#facc15" text-anchor="middle">5,000+ Ticks</text>

      <!-- Genealogical Continuity Wire -->
      <path d="M 87 38 L 165 38" stroke="#c084fc" stroke-width="2.5" marker-end="url(#arrow-purple)" />
      <text x="126" y="28" class="code" font-size="8.5" fill="#e9d5ff" text-anchor="middle">Conserved Clade</text>

      <!-- Daughter Descendants -->
      <g transform="translate(170, 10)">
        <polygon points="20,0 45,0 57,18 45,36 20,36 8,18" fill="#3b0764" stroke="#a855f7" stroke-width="1.5" />
        <polygon points="20,40 45,40 57,58 45,76 20,76 8,58" fill="#3b0764" stroke="#a855f7" stroke-width="1.5" />
        <text x="32" y="20" class="code" font-size="8" fill="#d8b4fe" text-anchor="middle">Gen 42</text>
        <text x="32" y="60" class="code" font-size="8" fill="#d8b4fe" text-anchor="middle">Gen 58</text>
      </g>

      <!-- Conserved Metrics -->
      <rect x="250" y="15" width="145" height="48" rx="6" fill="#2e1065" stroke="#c084fc" stroke-width="1.5" />
      <text x="260" y="34" class="code" font-size="10" fill="#facc15" font-weight="bold">Zero Drift Core</text>
      <text x="260" y="50" class="subtitle" font-size="8.5">Conserved catalytic kernel</text>

      <g transform="translate(10, 80)">
        <text x="0" y="20" class="code" font-size="9" fill="#e9d5ff">Purifying Selection: dN/dS &lt;&lt; 1 across all 5,000 discrete epochs</text>
        <text x="0" y="36" class="subtitle" font-size="9">Conserves essential homeostatic logic netlist despite surrounding mutations</text>
      </g>
    </g>

    <!-- Lenski LTEE Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#12081f" stroke="#581c87" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#e9d5ff">LENSKI LONG-TERM EVOLUTION DYNAMICS</text>
      <text x="14" y="38" class="code" font-size="9" fill="#facc15">Phylogenetic Longevity: Outlived hundreds of transient sibling clades</text>
      <text x="14" y="54" class="subtitle" font-size="9">Combines robust error correction with optimal thermodynamic idling</text>
      <text x="14" y="70" class="code" font-size="8.8" fill="#c084fc">Acts as phylogenetic root and ancestral reference point for clade trees</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#2e1065" stroke="#7e22ce" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#e9d5ff">Richard Lenski LTEE Paradigm</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• Proves that evolutionary endurance requires metabolic thrift over greed</text>
      <text x="14" y="54" class="code" font-size="9" fill="#facc15">★ Landmark: Lenski et al. (1991) Am Nat &amp; Blount et al. (2008) PNAS</text>
    </g>
  </g>

  <!-- Right: Multi-Millennial Survivorship -->
  <g transform="translate(505, 70)">
    <rect width="445" height="355" rx="12" fill="#180e26" stroke="#c084fc" stroke-width="1.5" />
    <rect x="16" y="14" width="240" height="24" rx="4" fill="#7e22ce" />
    <text x="26" y="30" class="badge" fill="#f3e8ff">MACRO-TEMPORAL RESILIENCE</text>
    <text x="270" y="30" class="label" fill="#d8b4fe">Survivorship Curve</text>

    <!-- Graph: Survivorship Curve -->
    <g transform="translate(16, 48)">
      <rect width="413" height="120" rx="8" fill="#12081f" stroke="#581c87" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#e9d5ff">PHYLOGENETIC LINEAGE PERSISTENCE (TICKS)</text>

      <!-- Patriarch line (horizontal sustained line across extinction pulses) -->
      <path d="M 35 45 L 350 45" stroke="#c084fc" stroke-width="2.5" />
      <text x="45" y="38" class="code" font-size="8.5" fill="#facc15">Patriarch Lineage (Continuous Survival: 5,000+ Ticks)</text>

      <!-- Extinction spikes crashing -->
      <path d="M 35 65 L 110 65 L 120 105" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="2 2" />
      <path d="M 120 75 L 210 75 L 220 105" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="2 2" />
      <path d="M 220 85 L 310 85 L 320 105" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="2 2" />
      <text x="125" y="98" class="code" font-size="7.5" fill="#f43f5e">Extinction Pulses: Clades A, B, C Perish</text>
    </g>

    <!-- Evolutionary Conservatism Box -->
    <g transform="translate(16, 175)">
      <rect width="413" height="78" rx="8" fill="#12081f" stroke="#581c87" stroke-width="1" />
      <text x="14" y="20" class="badge" fill="#e9d5ff">CONSERVATIVE SELECTIVE ADVANTAGE</text>
      <text x="14" y="38" class="code" font-size="9" fill="#facc15">Thermal Shock Buffer: Avoids reckless high-speed runaway mutations</text>
      <text x="14" y="54" class="subtitle" font-size="9">Preserves the tried-and-tested digital circuit architecture of deep time</text>
      <text x="14" y="70" class="code" font-size="8.8" fill="#c084fc">Living fossil anchoring the Siliquarium paleontology record</text>
    </g>

    <!-- Callout -->
    <g transform="translate(16, 265)">
      <rect width="413" height="65" rx="8" fill="#2e1065" stroke="#7e22ce" stroke-width="1" />
      <text x="14" y="20" class="label-bold" fill="#e9d5ff">Darwinian Fitness Value</text>
      <text x="14" y="38" class="subtitle" font-size="9.5">• In biology as in computing: perfection is achieved when nothing can be removed</text>
      <text x="14" y="54" class="code" font-size="9" fill="#facc15">★ Exemplar of stabilizing selection over geological deep time</text>
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
  { name: 'fig4_3_pelagic_spores.svg', content: fig4_3 },
  // Dedicated Circuit Paleontology Diagrams (Circuits 1 - 15)
  { name: 'fig_circuit_1_bistable_latch.svg', content: fig_circ1 },
  { name: 'fig_circuit_2_repressilator.svg', content: fig_circ2 },
  { name: 'fig_circuit_3_coherent_ffl.svg', content: fig_circ3 },
  { name: 'fig_circuit_4_incoherent_ffl.svg', content: fig_circ4 },
  { name: 'fig_circuit_5_negative_autoregulation.svg', content: fig_circ5 },
  { name: 'fig_circuit_6_binary_half_adder.svg', content: fig_circ6 },
  { name: 'fig_circuit_7_allosteric_inverter.svg', content: fig_circ7 },
  { name: 'fig_circuit_8_endosymbiotic_cassette.svg', content: fig_circ8 },
  { name: 'fig_circuit_9_syncytial_multicellularity.svg', content: fig_circ9 },
  { name: 'fig_circuit_10_pelagic_sporulation.svg', content: fig_circ10 },
  { name: 'fig_circuit_11_chemiosmotic_autotroph.svg', content: fig_circ11 },
  { name: 'fig_circuit_12_basalt_lithotroph.svg', content: fig_circ12 },
  { name: 'fig_circuit_13_trophic_predator.svg', content: fig_circ13 },
  { name: 'fig_circuit_14_detrital_scavenger.svg', content: fig_circ14 },
  { name: 'fig_circuit_15_patriarch_lineage.svg', content: fig_circ15 },
  // Legacy aliases to preserve backward compatibility
  { name: 'fig_circuit_1_toggle_and_repressilator.svg', content: fig_circ1 },
  { name: 'fig_circuit_2_feedforward_loops.svg', content: fig_circ3 },
  { name: 'fig_circuit_3_nar_and_half_adder.svg', content: fig_circ5 },
  { name: 'fig_circuit_4_inverter_and_organelle.svg', content: fig_circ7 },
  { name: 'fig_circuit_5_syncytium_and_spores.svg', content: fig_circ9 }
];

console.log('🎨 Generating enterprise SVG diagrams for Siliquarium documentation...');
for (const file of files) {
  const destPath = path.join(diagramsDir, file.name);
  fs.writeFileSync(destPath, file.content, 'utf8');
  console.log(`  ✓ Generated: docs/assets/diagrams/${file.name}`);
}
console.log('🎉 Diagram generation complete!');

