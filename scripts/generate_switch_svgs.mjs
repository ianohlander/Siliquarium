#!/usr/bin/env node

/**
 * 🎨 Siliquarium SVG Generator for:
 * 1. fig_grn_00_blueprint_vs_program.svg (The Blueprint Myth vs Regulatory Reality)
 * 2. fig_grn_12_genetic_switch_anatomy.svg (Promoter, Operator, and Coding Sequence Anatomy)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, '../docs/assets/diagrams');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// ============================================================================
// DIAGRAM 1: Blueprint vs Program (fig_grn_00)
// ============================================================================
const svg00 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 520" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad00" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="50%" stop-color="#0b172a"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>

    <marker id="arrowCyan00" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
      <polygon points="0 0, 7 3.5, 0 7" fill="#38bdf8"/>
    </marker>
  </defs>

  <rect width="1000" height="520" fill="url(#bgGrad00)"/>

  <!-- Title Banner -->
  <g transform="translate(40, 35)">
    <rect width="920" height="60" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="25" y="28" fill="#38bdf8" font-family="monospace" font-size="16" font-weight="bold" letter-spacing="1.2">THE DEVELOPMENTAL PROGRAM PARADOX</text>
    <text x="25" y="48" fill="#94a3b8" font-family="sans-serif" font-size="12">Why the "Blueprint" Metaphor Fails — Genomes Are Dynamic Computer Programs Executed by Chemistry</text>
  </g>

  <!-- Left Card: The Blueprint Myth (Flawed View) -->
  <g transform="translate(40, 115)">
    <rect width="445" height="365" rx="12" fill="#0f172a" stroke="#ef4444" stroke-width="1.2"/>
    <rect x="20" y="20" width="240" height="26" rx="6" fill="#450a0a" stroke="#ef4444" stroke-width="1"/>
    <text x="32" y="38" fill="#fca5a5" font-family="monospace" font-size="12" font-weight="bold">❌ THE BLUEPRINT MYTH</text>

    <!-- Schematic Box -->
    <g transform="translate(20, 60)">
      <rect width="405" height="110" rx="8" fill="#020617" stroke="#334155" stroke-width="1"/>
      <text x="15" y="22" fill="#94a3b8" font-family="monospace" font-size="10">Architectural Drawing (CAD):</text>
      <!-- Static blueprint table drawing -->
      <line x1="50" y1="55" x2="160" y2="55" stroke="#ef4444" stroke-width="2"/>
      <line x1="60" y1="55" x2="60" y2="95" stroke="#ef4444" stroke-width="2"/>
      <line x1="150" y1="55" x2="150" y2="95" stroke="#ef4444" stroke-width="2"/>
      <text x="75" y="48" fill="#f87171" font-family="monospace" font-size="9">Gene A (Legs)</text>
      <text x="180" y="65" fill="#f87171" font-family="monospace" font-size="9">Gene B (Top)</text>
      <!-- External Carpenter Hand -->
      <rect x="270" y="40" width="115" height="50" rx="6" fill="#1e293b" stroke="#ef4444" stroke-width="1"/>
      <text x="280" y="60" fill="#fca5a5" font-family="monospace" font-size="10" font-weight="bold">External Builder</text>
      <text x="280" y="78" fill="#94a3b8" font-family="sans-serif" font-size="9">(Teleological Agent)</text>
    </g>

    <!-- Flaws List -->
    <g transform="translate(25, 195)">
      <text x="0" y="0" fill="#f87171" font-family="monospace" font-size="11" font-weight="bold">Why this metaphor breaks down:</text>
      <text x="0" y="24" fill="#cbd5e1" font-family="sans-serif" font-size="11">• Assumes 1 Gene = 1 Physical Part (Naive reductionism).</text>
      <text x="0" y="48" fill="#cbd5e1" font-family="sans-serif" font-size="11">• Requires an external builder reading the paper plan.</text>
      <text x="0" y="72" fill="#cbd5e1" font-family="sans-serif" font-size="11">• <tspan fill="#fca5a5" font-weight="bold">The Paradox:</tspan> All 30 trillion cells have identical DNA!</text>
      <text x="0" y="96" fill="#94a3b8" font-family="sans-serif" font-size="10">If DNA were a blueprint, every cell would build the same table.</text>
      <text x="0" y="116" fill="#94a3b8" font-family="sans-serif" font-size="10">A blueprint cannot explain how liver, bone, and eye cells diverge.</text>
    </g>
  </g>

  <!-- Right Card: The Regulatory Reality (Scientific View) -->
  <g transform="translate(515, 115)">
    <rect width="445" height="365" rx="12" fill="#0f172a" stroke="#10b981" stroke-width="1.2"/>
    <rect x="20" y="20" width="260" height="26" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="1"/>
    <text x="32" y="38" fill="#a7f3d0" font-family="monospace" font-size="12" font-weight="bold">✔ THE REGULATORY REALITY</text>

    <!-- Dynamic Program Box -->
    <g transform="translate(20, 60)">
      <rect width="405" height="110" rx="8" fill="#020617" stroke="#334155" stroke-width="1"/>
      <text x="15" y="22" fill="#38bdf8" font-family="monospace" font-size="10">Self-Executing Chemical Program:</text>
      <!-- Node A -> Node B -> Output -->
      <circle cx="50" cy="65" r="16" fill="#065f46" stroke="#10b981" stroke-width="1.5"/>
      <text x="44" y="69" fill="#a7f3d0" font-family="monospace" font-size="11" font-weight="bold">G1</text>
      <line x1="68" y1="65" x2="135" y2="65" stroke="#10b981" stroke-width="2" marker-end="url(#arrowCyan00)"/>
      <circle cx="155" cy="65" r="16" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="149" y="69" fill="#bfdbfe" font-family="monospace" font-size="11" font-weight="bold">G2</text>
      <line x1="173" y1="65" x2="240" y2="65" stroke="#ef4444" stroke-width="2"/>
      <!-- Loop back -->
      <path d="M 155 47 C 155 30, 50 30, 50 47" fill="none" stroke="#818cf8" stroke-width="1.5" stroke-dasharray="2,2"/>
      <!-- Cell boundary -->
      <rect x="260" y="35" width="130" height="60" rx="6" fill="#14532d" stroke="#22c55e" stroke-width="1"/>
      <text x="272" y="55" fill="#bbf7d0" font-family="monospace" font-size="10" font-weight="bold">Local Branch:</text>
      <text x="272" y="72" fill="#4ade80" font-family="sans-serif" font-size="10">Trophocyte Core</text>
      <text x="272" y="87" fill="#86efac" font-family="sans-serif" font-size="9">vs Somatic Shield</text>
    </g>

    <!-- Mechanisms List -->
    <g transform="translate(25, 195)">
      <text x="0" y="0" fill="#34d399" font-family="monospace" font-size="11" font-weight="bold">How self-organization really works:</text>
      <text x="0" y="24" fill="#cbd5e1" font-family="sans-serif" font-size="11">• Genes are switches that regulate other genes (GRNs).</text>
      <text x="0" y="48" fill="#cbd5e1" font-family="sans-serif" font-size="11">• Self-executing: No builder; non-equilibrium physics runs the code.</text>
      <text x="0" y="72" fill="#cbd5e1" font-family="sans-serif" font-size="11">• <tspan fill="#a7f3d0" font-weight="bold">The Solution:</tspan> Environmental cues select local code paths!</text>
      <text x="0" y="96" fill="#94a3b8" font-family="sans-serif" font-size="10">Core vent cells run the Feeder subroutine.</text>
      <text x="0" y="116" fill="#94a3b8" font-family="sans-serif" font-size="10">Exposed rim cells run the Defensive Shield subroutine.</text>
    </g>
  </g>
</svg>
`;

fs.writeFileSync(path.join(outDir, 'fig_grn_00_blueprint_vs_program.svg'), svg00, 'utf8');
console.log('✓ Generated: docs/assets/diagrams/fig_grn_00_blueprint_vs_program.svg');

// ============================================================================
// DIAGRAM 2: Genetic Switch Anatomy (fig_grn_12)
// ============================================================================
const svg12 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 560" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad12" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="50%" stop-color="#071226"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>

    <marker id="arrowGrn12" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
      <polygon points="0 0, 7 3.5, 0 7" fill="#10b981"/>
    </marker>
    <marker id="barRed12" markerWidth="5" markerHeight="10" refX="2.5" refY="5" orient="auto">
      <line x1="2.5" y1="0" x2="2.5" y2="10" stroke="#ef4444" stroke-width="2.5"/>
    </marker>
  </defs>

  <rect width="1000" height="560" fill="url(#bgGrad12)"/>

  <!-- Title Banner -->
  <g transform="translate(40, 30)">
    <rect width="920" height="60" rx="10" fill="#0f172a" stroke="#06b6d4" stroke-width="1.5"/>
    <text x="25" y="28" fill="#38bdf8" font-family="monospace" font-size="16" font-weight="bold" letter-spacing="1.2">ANATOMY OF A MOLECULAR &amp; DIGITAL GENETIC SWITCH</text>
    <text x="25" y="48" fill="#94a3b8" font-family="sans-serif" font-size="12">Deconstructing the Promoter (Landing Pad), Operator (Gatekeeper), and Coding Sequence into Digital Logic</text>
  </g>

  <!-- TOP HALF: BIOLOGICAL GENE STRUCTURE & DOCKING -->
  <g transform="translate(40, 110)">
    <rect width="920" height="200" rx="12" fill="#0b1329" stroke="#334155" stroke-width="1.2"/>
    <text x="20" y="25" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">1. MOLECULAR BIOLOGY: TRANSCRIPTION FACTOR DOCKING AT DNA OPERATOR</text>

    <!-- DNA Strand -->
    <line x1="40" y1="120" x2="880" y2="120" stroke="#475569" stroke-width="4"/>

    <!-- Section 1: Promoter -->
    <g transform="translate(80, 75)">
      <rect width="180" height="70" rx="6" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>
      <text x="20" y="28" fill="#bae6fd" font-family="monospace" font-size="12" font-weight="bold">PROMOTER REGION</text>
      <text x="20" y="48" fill="#7dd3fc" font-family="sans-serif" font-size="10">RNA Polymerase Landing Pad</text>
      <!-- RNA Pol Bubble -->
      <ellipse cx="90" cy="-18" rx="42" ry="24" fill="#f59e0b" opacity="0.85"/>
      <text x="60" y="-14" fill="#000" font-family="monospace" font-size="10" font-weight="bold">RNA Pol</text>
      <!-- Downward Arrow -->
      <line x1="90" y1="8" x2="90" y2="28" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrowGrn12)"/>
    </g>

    <!-- Section 2: Operator Site -->
    <g transform="translate(300, 75)">
      <rect width="180" height="70" rx="6" fill="#7f1d1d" stroke="#ef4444" stroke-width="2"/>
      <text x="24" y="28" fill="#fca5a5" font-family="monospace" font-size="12" font-weight="bold">OPERATOR SITE</text>
      <text x="20" y="48" fill="#f87171" font-family="sans-serif" font-size="10">Physical Gatekeeper / Block</text>
      <!-- Repressor Protein Block -->
      <rect x="50" y="-35" width="80" height="30" rx="4" fill="#ef4444" stroke="#fca5a5" stroke-width="1.5"/>
      <text x="62" y="-15" fill="#fff" font-family="monospace" font-size="10" font-weight="bold">REPRESSOR</text>
      <!-- Block symbol -->
      <line x1="90" y1="-3" x2="90" y2="25" stroke="#ef4444" stroke-width="2.5" marker-end="url(#barRed12)"/>
    </g>

    <!-- Section 3: Coding Sequence -->
    <g transform="translate(520, 75)">
      <rect width="320" height="70" rx="6" fill="#065f46" stroke="#10b981" stroke-width="2"/>
      <text x="30" y="28" fill="#a7f3d0" font-family="monospace" font-size="12" font-weight="bold">CODING SEQUENCE (GENE RECIPE)</text>
      <text x="30" y="48" fill="#6ee7b7" font-family="sans-serif" font-size="10">Translated into Catalytic Enzyme (AND, OR, NOT, SINK)</text>
      <text x="30" y="62" fill="#34d399" font-family="monospace" font-size="9">Codons: [000000 110000 ...]</text>
    </g>

    <text x="80" y="180" fill="#94a3b8" font-family="sans-serif" font-size="11">
      • If Repressor is BOUND to Operator ──► RNA Polymerase is physically blocked (Gene is <tspan fill="#ef4444" font-weight="bold">OFF / 0</tspan>).
    </text>
    <text x="520" y="180" fill="#94a3b8" font-family="sans-serif" font-size="11">
      • If Operator is CLEAR ──► RNA Polymerase transcribes mRNA (Gene is <tspan fill="#10b981" font-weight="bold">ON / 1</tspan>).
    </text>
  </g>

  <!-- BOTTOM HALF: DIGITAL CMOS & LOGIC GATE EQUIVALENT -->
  <g transform="translate(40, 330)">
    <rect width="920" height="195" rx="12" fill="#0f172a" stroke="#334155" stroke-width="1.2"/>
    <text x="20" y="25" fill="#f59e0b" font-family="monospace" font-size="12" font-weight="bold">2. SILIQUARIUM DIGITAL LOGIC EQUIVALENT: GATE ENABLE &amp; INHIBIT PINS</text>

    <!-- Circuit Wire Diagram -->
    <g transform="translate(40, 45)">
      <!-- Input A -->
      <text x="0" y="25" fill="#10b981" font-family="monospace" font-size="11" font-weight="bold">Input A (Promoter Signal):</text>
      <line x1="220" y1="20" x2="350" y2="20" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrowGrn12)"/>

      <!-- Input B (Inhibitor / Operator) -->
      <text x="0" y="65" fill="#ef4444" font-family="monospace" font-size="11" font-weight="bold">Input B (Operator Invert):</text>
      <line x1="220" y1="60" x2="350" y2="60" stroke="#ef4444" stroke-width="2.5" marker-end="url(#barRed12)"/>

      <!-- Logic Gate Symbol Box -->
      <rect x="360" y="5" width="160" height="85" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <text x="385" y="32" fill="#38bdf8" font-family="monospace" font-size="13" font-weight="bold">GATE_CATALYST</text>
      <text x="380" y="52" fill="#94a3b8" font-family="sans-serif" font-size="10">Logic: A AND NOT(B)</text>
      <text x="380" y="72" fill="#fde68a" font-family="monospace" font-size="9">Dissipation: 1.0T / toggle</text>

      <!-- Output Wire -->
      <line x1="520" y1="48" x2="630" y2="48" stroke="#10b981" stroke-width="3" marker-end="url(#arrowGrn12)"/>
      <circle cx="670" cy="48" r="24" fill="#065f46" stroke="#10b981" stroke-width="2"/>
      <text x="652" y="53" fill="#a7f3d0" font-family="monospace" font-size="12" font-weight="bold">OUTPUT</text>

      <!-- Explanation on the right -->
      <g transform="translate(720, 15)">
        <rect width="140" height="65" rx="6" fill="#020617" stroke="#334155" stroke-width="1"/>
        <text x="12" y="22" fill="#34d399" font-family="monospace" font-size="10" font-weight="bold">Truth Output:</text>
        <text x="12" y="40" fill="#cbd5e1" font-family="monospace" font-size="10">A=1, B=0 ──► 1 🟢</text>
        <text x="12" y="55" fill="#f87171" font-family="monospace" font-size="10">A=1, B=1 ──► 0 🔴</text>
      </g>

      <text x="0" y="115" fill="#94a3b8" font-family="sans-serif" font-size="11">
        In Siliquarium, biological operator binding is executed by passing the inhibitor signal into a <tspan fill="#fca5a5" font-weight="bold">GATE_NOT</tspan> inverter before feeding the metabolic synthetase.
      </text>
    </g>
  </g>
</svg>
`;

fs.writeFileSync(path.join(outDir, 'fig_grn_12_genetic_switch_anatomy.svg'), svg12, 'utf8');
console.log('✓ Generated: docs/assets/diagrams/fig_grn_12_genetic_switch_anatomy.svg');

console.log('\n🎉 ALL SWITCH & BLUEPRINT DIAGRAMS GENERATED SUCCESSFULLY!');
