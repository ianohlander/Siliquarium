#!/usr/bin/env node

/**
 * 🎨 Siliquarium SVG Generator for Advanced GRN Diagrams:
 * 1. fig_grn_09_activation_inhibition_mechanics.svg (Activation, Repression, Toggle, Oscillator across Biology, Graph Theory, and Silicon)
 * 2. fig_grn_10_graph_theory_network_topology.svg (Genome Tape -> Directed Graph G=(V,E) & Adjacency Matrix)
 * 3. fig_grn_11_dynamic_signal_propagation.svg (4-Tick Dynamic Pulse Waveform & Landauer Dissipation)
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
// DIAGRAM 1: Activation & Inhibition Mechanics (fig_grn_09)
// ============================================================================
const svg09 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 820" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad09" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#030712"/>
      <stop offset="50%" stop-color="#0b1329"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>

    <linearGradient id="panelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.9"/>
    </linearGradient>

    <!-- Markers -->
    <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <polygon points="0 0, 8 4, 0 8" fill="#10b981"/>
    </marker>
    <marker id="arrowCyan" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <polygon points="0 0, 8 4, 0 8" fill="#06b6d4"/>
    </marker>
    <marker id="arrowAmber" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <polygon points="0 0, 8 4, 0 8" fill="#f59e0b"/>
    </marker>
    <marker id="barRed" markerWidth="6" markerHeight="12" refX="3" refY="6" orient="auto">
      <line x1="3" y1="0" x2="3" y2="12" stroke="#ef4444" stroke-width="3"/>
    </marker>
  </defs>

  <!-- Background Canvas -->
  <rect width="1100" height="820" fill="url(#bgGrad09)"/>

  <!-- Subtle Blueprint Grid -->
  <g opacity="0.08" stroke="#38bdf8" stroke-width="0.5">
    <pattern id="gridPattern09" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30"/>
    </pattern>
    <rect width="1100" height="820" fill="url(#gridPattern09)"/>
  </g>

  <!-- Title & Subtitle Banner -->
  <g transform="translate(40, 45)">
    <rect x="0" y="0" width="1020" height="65" rx="12" fill="#0f172a" stroke="#06b6d4" stroke-width="1.5" opacity="0.9"/>
    <text x="25" y="32" fill="#38bdf8" font-family="monospace" font-size="18" font-weight="bold" letter-spacing="1.5">FIGURE GRN-09: GENE REGULATORY MECHANICS &amp; DIRECTED INTERACTIONS</text>
    <text x="25" y="52" fill="#94a3b8" font-family="sans-serif" font-size="12">How Genes Turn Each Other ON and OFF: Comparative Triad of Molecular Biology, Graph Theory, and Digital Logic</text>
  </g>

  <!-- Four Quadrants / Interaction Panels -->

  <!-- ========================================== -->
  <!-- 1. DIRECT ACTIVATION (Top-Left) -->
  <!-- ========================================== -->
  <g transform="translate(40, 130)">
    <rect width="495" height="315" rx="12" fill="url(#panelGrad)" stroke="#10b981" stroke-width="1.2"/>
    <rect x="15" y="15" width="220" height="24" rx="6" fill="#064e3b" stroke="#059669" stroke-width="1"/>
    <text x="25" y="32" fill="#34d399" font-family="monospace" font-size="12" font-weight="bold">1. DIRECT ACTIVATION (A → B)</text>

    <!-- Sub-row A: Molecular Biology -->
    <g transform="translate(20, 55)">
      <rect width="455" height="75" rx="8" fill="#020617" stroke="#334155" stroke-width="1"/>
      <text x="12" y="18" fill="#10b981" font-family="monospace" font-size="10" font-weight="bold">MOLECULAR BIOLOGY</text>
      <!-- DNA strand -->
      <line x1="20" y1="48" x2="435" y2="48" stroke="#475569" stroke-width="3"/>
      <!-- Gene A -->
      <rect x="30" y="35" width="60" height="26" rx="4" fill="#065f46" stroke="#10b981" stroke-width="1.5"/>
      <text x="42" y="52" fill="#a7f3d0" font-family="monospace" font-size="11" font-weight="bold">Gene A</text>
      <!-- Transcription factor bubble -->
      <circle cx="150" cy="40" r="14" fill="#10b981" opacity="0.85"/>
      <text x="143" y="44" fill="#022c22" font-family="monospace" font-size="10" font-weight="bold">TF</text>
      <!-- Curved arrow to Promoter B -->
      <path d="M 166 40 Q 220 18 270 38" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrowGreen)"/>
      <!-- Promoter B -->
      <rect x="280" y="38" width="45" height="20" rx="3" fill="#0284c7" stroke="#38bdf8" stroke-width="1"/>
      <text x="286" y="52" fill="#bae6fd" font-family="monospace" font-size="9" font-weight="bold">Promoter</text>
      <!-- Gene B -->
      <rect x="330" y="35" width="60" height="26" rx="4" fill="#0369a1" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="342" y="52" fill="#e0f2fe" font-family="monospace" font-size="11" font-weight="bold">Gene B</text>
      <!-- RNA Pol -->
      <ellipse cx="305" cy="24" rx="16" ry="10" fill="#f59e0b" opacity="0.8"/>
      <text x="296" y="27" fill="#000" font-family="sans-serif" font-size="8" font-weight="bold">RNA Pol</text>
      <text x="398" y="52" fill="#10b981" font-family="monospace" font-size="11" font-weight="bold">ON 🟢</text>
    </g>

    <!-- Sub-row B: Graph Theory -->
    <g transform="translate(20, 140)">
      <rect width="455" height="65" rx="8" fill="#020617" stroke="#334155" stroke-width="1"/>
      <text x="12" y="16" fill="#38bdf8" font-family="monospace" font-size="10" font-weight="bold">GRAPH THEORY (DIRECTED EDGE WITH POSITIVE WEIGHT)</text>
      <!-- Node A -->
      <circle cx="80" cy="40" r="18" fill="#065f46" stroke="#10b981" stroke-width="2"/>
      <text x="74" y="45" fill="#a7f3d0" font-family="monospace" font-size="13" font-weight="bold">A</text>
      <!-- Directed Green Arrow -->
      <line x1="105" y1="40" x2="330" y2="40" stroke="#10b981" stroke-width="3" marker-end="url(#arrowGreen)"/>
      <rect x="195" y="28" width="45" height="22" rx="4" fill="#022c22" stroke="#10b981" stroke-width="1"/>
      <text x="202" y="43" fill="#34d399" font-family="monospace" font-size="11" font-weight="bold">+1.0</text>
      <!-- Node B -->
      <circle cx="360" cy="40" r="18" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>
      <text x="354" y="45" fill="#e0f2fe" font-family="monospace" font-size="13" font-weight="bold">B</text>
      <text x="400" y="45" fill="#94a3b8" font-family="sans-serif" font-size="11">y = f(A)</text>
    </g>

    <!-- Sub-row C: Silicon Implementation -->
    <g transform="translate(20, 215)">
      <rect width="455" height="85" rx="8" fill="#020617" stroke="#334155" stroke-width="1"/>
      <text x="12" y="16" fill="#f59e0b" font-family="monospace" font-size="10" font-weight="bold">SILIQUARIUM DIGITAL LOGIC EQUIVALENT</text>
      <!-- Wire from Stream A to Gate B -->
      <text x="30" y="48" fill="#10b981" font-family="monospace" font-size="11" font-weight="bold">Stream A [1]</text>
      <line x1="120" y1="44" x2="220" y2="44" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrowGreen)"/>
      <!-- AND Gate Symbol Box -->
      <rect x="230" y="30" width="80" height="38" rx="6" fill="#1e293b" stroke="#10b981" stroke-width="1.5"/>
      <text x="242" y="53" fill="#34d399" font-family="monospace" font-size="11" font-weight="bold">GATE_AND</text>
      <!-- Output wire -->
      <line x1="310" y1="49" x2="380" y2="49" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrowGreen)"/>
      <text x="390" y="53" fill="#10b981" font-family="monospace" font-size="12" font-weight="bold">Out = 1</text>
      <text x="30" y="74" fill="#64748b" font-family="sans-serif" font-size="10">High input drives catalytic synthetase active (charges ATP battery pool).</text>
    </g>
  </g>

  <!-- ========================================== -->
  <!-- 2. DIRECT INHIBITION / REPRESSION (Top-Right) -->
  <!-- ========================================== -->
  <g transform="translate(565, 130)">
    <rect width="495" height="315" rx="12" fill="url(#panelGrad)" stroke="#ef4444" stroke-width="1.2"/>
    <rect x="15" y="15" width="235" height="24" rx="6" fill="#450a0a" stroke="#dc2626" stroke-width="1"/>
    <text x="25" y="32" fill="#f87171" font-family="monospace" font-size="12" font-weight="bold">2. DIRECT INHIBITION (A ⊣ B)</text>

    <!-- Sub-row A: Molecular Biology -->
    <g transform="translate(20, 55)">
      <rect width="455" height="75" rx="8" fill="#020617" stroke="#334155" stroke-width="1"/>
      <text x="12" y="18" fill="#ef4444" font-family="monospace" font-size="10" font-weight="bold">MOLECULAR BIOLOGY</text>
      <!-- DNA strand -->
      <line x1="20" y1="48" x2="435" y2="48" stroke="#475569" stroke-width="3"/>
      <!-- Gene A -->
      <rect x="30" y="35" width="60" height="26" rx="4" fill="#7f1d1d" stroke="#ef4444" stroke-width="1.5"/>
      <text x="42" y="52" fill="#fca5a5" font-family="monospace" font-size="11" font-weight="bold">Gene A</text>
      <!-- Repressor tetramer block -->
      <rect x="140" y="28" width="26" height="24" rx="4" fill="#ef4444" opacity="0.9"/>
      <text x="144" y="44" fill="#fff" font-family="monospace" font-size="9" font-weight="bold">Rep</text>
      <!-- Curved arrow to Operator B -->
      <path d="M 168 40 Q 215 15 265 35" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrowGreen)"/>
      <!-- Operator roadblock -->
      <rect x="270" y="36" width="35" height="24" rx="2" fill="#dc2626" stroke="#f87171" stroke-width="1.5"/>
      <text x="274" y="51" fill="#fff" font-family="monospace" font-size="8" font-weight="bold">BLOCK</text>
      <!-- Blocked RNA Pol -->
      <ellipse cx="245" cy="22" rx="14" ry="9" fill="#64748b" opacity="0.7"/>
      <text x="238" y="25" fill="#fff" font-family="sans-serif" font-size="7">Blocked</text>
      <!-- Gene B -->
      <rect x="315" y="35" width="60" height="26" rx="4" fill="#1e293b" stroke="#64748b" stroke-width="1.5"/>
      <text x="327" y="52" fill="#94a3b8" font-family="monospace" font-size="11" font-weight="bold">Gene B</text>
      <text x="395" y="52" fill="#ef4444" font-family="monospace" font-size="11" font-weight="bold">OFF 🔴</text>
    </g>

    <!-- Sub-row B: Graph Theory -->
    <g transform="translate(20, 140)">
      <rect width="455" height="65" rx="8" fill="#020617" stroke="#334155" stroke-width="1"/>
      <text x="12" y="16" fill="#38bdf8" font-family="monospace" font-size="10" font-weight="bold">GRAPH THEORY (DIRECTED BLUNT BAR / NEGATIVE EDGE)</text>
      <!-- Node A -->
      <circle cx="80" cy="40" r="18" fill="#7f1d1d" stroke="#ef4444" stroke-width="2"/>
      <text x="74" y="45" fill="#fca5a5" font-family="monospace" font-size="13" font-weight="bold">A</text>
      <!-- Directed Red Line ending in Blunt Bar -->
      <line x1="105" y1="40" x2="335" y2="40" stroke="#ef4444" stroke-width="3" marker-end="url(#barRed)"/>
      <rect x="195" y="28" width="45" height="22" rx="4" fill="#450a0a" stroke="#ef4444" stroke-width="1"/>
      <text x="202" y="43" fill="#f87171" font-family="monospace" font-size="11" font-weight="bold">-1.0</text>
      <!-- Node B -->
      <circle cx="360" cy="40" r="18" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
      <text x="354" y="45" fill="#94a3b8" font-family="monospace" font-size="13" font-weight="bold">B</text>
      <text x="395" y="45" fill="#94a3b8" font-family="sans-serif" font-size="11">y = ¬(A)</text>
    </g>

    <!-- Sub-row C: Silicon Implementation -->
    <g transform="translate(20, 215)">
      <rect width="455" height="85" rx="8" fill="#020617" stroke="#334155" stroke-width="1"/>
      <text x="12" y="16" fill="#f59e0b" font-family="monospace" font-size="10" font-weight="bold">SILIQUARIUM DIGITAL LOGIC EQUIVALENT</text>
      <!-- Wire to Inverter -->
      <text x="30" y="48" fill="#ef4444" font-family="monospace" font-size="11" font-weight="bold">Toxin T [1]</text>
      <line x1="120" y1="44" x2="220" y2="44" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrowGreen)"/>
      <!-- NOT Gate Symbol Box -->
      <rect x="230" y="30" width="80" height="38" rx="6" fill="#1e293b" stroke="#ef4444" stroke-width="1.5"/>
      <text x="242" y="53" fill="#f87171" font-family="monospace" font-size="11" font-weight="bold">GATE_NOT</text>
      <!-- Output wire -->
      <line x1="310" y1="49" x2="380" y2="49" stroke="#64748b" stroke-width="2.5" marker-end="url(#arrowGreen)"/>
      <text x="390" y="53" fill="#64748b" font-family="monospace" font-size="12" font-weight="bold">Out = 0</text>
      <text x="30" y="74" fill="#64748b" font-family="sans-serif" font-size="10">Active NOT gate silences downstream pores, inverting poison into safe dormancy.</text>
    </g>
  </g>

  <!-- ========================================== -->
  <!-- 3. MUTUAL REPRESSION / TOGGLE SWITCH (Bottom-Left) -->
  <!-- ========================================== -->
  <g transform="translate(40, 470)">
    <rect width="495" height="315" rx="12" fill="url(#panelGrad)" stroke="#a855f7" stroke-width="1.2"/>
    <rect x="15" y="15" width="310" height="24" rx="6" fill="#3b0764" stroke="#9333ea" stroke-width="1"/>
    <text x="25" y="32" fill="#c084fc" font-family="monospace" font-size="12" font-weight="bold">3. MUTUAL REPRESSION / BISTABLE TOGGLE</text>

    <!-- Graph Theory & Dynamics -->
    <g transform="translate(20, 55)">
      <rect width="455" height="135" rx="8" fill="#020617" stroke="#334155" stroke-width="1"/>
      <text x="12" y="16" fill="#c084fc" font-family="monospace" font-size="10" font-weight="bold">GRAPH TOPOLOGY: CROSS-COUPLED NEGATIVE FEEDBACK LOOP</text>
      
      <!-- Node u (lacI) -->
      <circle cx="110" cy="70" r="26" fill="#065f46" stroke="#10b981" stroke-width="2.5"/>
      <text x="100" y="73" fill="#a7f3d0" font-family="monospace" font-size="13" font-weight="bold">u (1)</text>
      <text x="96" y="86" fill="#34d399" font-family="monospace" font-size="9">HIGH</text>

      <!-- Curve A -> B (upper blunt bar) -->
      <path d="M 136 55 C 190 20, 270 20, 314 55" fill="none" stroke="#ef4444" stroke-width="2.5" marker-end="url(#barRed)"/>
      <rect x="210" y="20" width="35" height="18" rx="3" fill="#450a0a" stroke="#ef4444" stroke-width="1"/>
      <text x="217" y="33" fill="#f87171" font-family="monospace" font-size="10" font-weight="bold">⊣ -1</text>

      <!-- Node v (tetR) -->
      <circle cx="340" cy="70" r="26" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
      <text x="330" y="73" fill="#94a3b8" font-family="monospace" font-size="13" font-weight="bold">v (0)</text>
      <text x="328" y="86" fill="#64748b" font-family="monospace" font-size="9">LOW</text>

      <!-- Curve B -> A (lower blunt bar) -->
      <path d="M 314 85 C 270 120, 190 120, 136 85" fill="none" stroke="#64748b" stroke-width="1.8" stroke-dasharray="3,3" marker-end="url(#barRed)"/>
      <rect x="210" y="102" width="35" height="18" rx="3" fill="#0f172a" stroke="#64748b" stroke-width="1"/>
      <text x="217" y="115" fill="#94a3b8" font-family="monospace" font-size="10" font-weight="bold">⊣ (off)</text>

      <!-- Outcome explanation -->
      <text x="385" y="55" fill="#38bdf8" font-family="monospace" font-size="10" font-weight="bold">State 1:</text>
      <text x="385" y="70" fill="#a7f3d0" font-family="monospace" font-size="10">[1, 0] Feeder</text>
      <text x="385" y="95" fill="#f59e0b" font-family="monospace" font-size="10" font-weight="bold">State 2:</text>
      <text x="385" y="110" fill="#fca5a5" font-family="monospace" font-size="10">[0, 1] Shield</text>
    </g>

    <!-- Digital Electronic Circuit -->
    <g transform="translate(20, 200)">
      <rect width="455" height="100" rx="8" fill="#020617" stroke="#334155" stroke-width="1"/>
      <text x="12" y="16" fill="#f59e0b" font-family="monospace" font-size="10" font-weight="bold">1-BIT BISTABLE MEMORY LATCH (SR FLIP-FLOP EQUIVALENT)</text>
      <text x="20" y="42" fill="#cbd5e1" font-family="sans-serif" font-size="11">
        Two cross-coupled inverters create <tspan fill="#c084fc" font-weight="bold">bistability</tspan>: once switched ON by a
      </text>
      <text x="20" y="60" fill="#cbd5e1" font-family="sans-serif" font-size="11">
        transient signal, the state remains locked forever even after the signal vanishes.
      </text>
      <rect x="20" y="72" width="415" height="20" rx="4" fill="#1e1b4b" stroke="#818cf8" stroke-width="0.8"/>
      <text x="30" y="86" fill="#a5b4fc" font-family="monospace" font-size="10">Biological Function: Irreversible cell-fate commitment (Specimen 01)</text>
    </g>
  </g>

  <!-- ========================================== -->
  <!-- 4. ODD-LOOP OSCILLATOR / REPRESSILATOR (Bottom-Right) -->
  <!-- ========================================== -->
  <g transform="translate(565, 470)">
    <rect width="495" height="315" rx="12" fill="url(#panelGrad)" stroke="#f59e0b" stroke-width="1.2"/>
    <rect x="15" y="15" width="310" height="24" rx="6" fill="#451a03" stroke="#d97706" stroke-width="1"/>
    <text x="25" y="32" fill="#fbbf24" font-family="monospace" font-size="12" font-weight="bold">4. ODD-LOOP RING OSCILLATOR (REPRESSILATOR)</text>

    <!-- Graph Theory Ring -->
    <g transform="translate(20, 55)">
      <rect width="455" height="135" rx="8" fill="#020617" stroke="#334155" stroke-width="1"/>
      <text x="12" y="16" fill="#fbbf24" font-family="monospace" font-size="10" font-weight="bold">TOPOLOGY: 3-INVERTER CYCLIC CASCADE (ODD NEGATIVE EDGES)</text>

      <!-- Triangular Ring Nodes -->
      <!-- Node X (top) -->
      <circle cx="160" cy="40" r="18" fill="#7f1d1d" stroke="#ef4444" stroke-width="2"/>
      <text x="155" y="44" fill="#fca5a5" font-family="monospace" font-size="12" font-weight="bold">X</text>

      <!-- Node Y (bottom right) -->
      <circle cx="230" cy="100" r="18" fill="#065f46" stroke="#10b981" stroke-width="2"/>
      <text x="225" y="104" fill="#a7f3d0" font-family="monospace" font-size="12" font-weight="bold">Y</text>

      <!-- Node Z (bottom left) -->
      <circle cx="90" cy="100" r="18" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>
      <text x="85" y="104" fill="#bae6fd" font-family="monospace" font-size="12" font-weight="bold">Z</text>

      <!-- Arrows in circle -->
      <path d="M 178 48 L 215 85" fill="none" stroke="#ef4444" stroke-width="2.5" marker-end="url(#barRed)"/>
      <path d="M 210 105 L 115 105" fill="none" stroke="#10b981" stroke-width="2.5" marker-end="url(#barRed)"/>
      <path d="M 105 85 L 145 48" fill="none" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#barRed)"/>

      <!-- Pulse waveform preview on the right -->
      <g transform="translate(280, 30)">
        <text x="0" y="12" fill="#94a3b8" font-family="monospace" font-size="10">Pulse Waveforms:</text>
        <path d="M 0 35 L 30 35 L 30 20 L 60 20 L 60 35 L 90 35 L 90 20 L 120 20" fill="none" stroke="#ef4444" stroke-width="2"/>
        <text x="130" y="28" fill="#f87171" font-family="monospace" font-size="9">X(t)</text>
        <path d="M 0 55 L 15 55 L 15 40 L 45 40 L 45 55 L 75 55 L 75 40 L 105 40 L 105 55 L 120 55" fill="none" stroke="#10b981" stroke-width="2"/>
        <text x="130" y="48" fill="#34d399" font-family="monospace" font-size="9">Y(t)</text>
        <path d="M 0 75 L 45 75 L 45 60 L 75 60 L 75 75 L 105 75 L 105 60 L 120 60" fill="none" stroke="#38bdf8" stroke-width="2"/>
        <text x="130" y="68" fill="#38bdf8" font-family="monospace" font-size="9">Z(t)</text>
      </g>
    </g>

    <!-- Digital Electronic Circuit -->
    <g transform="translate(20, 200)">
      <rect width="455" height="100" rx="8" fill="#020617" stroke="#334155" stroke-width="1"/>
      <text x="12" y="16" fill="#f59e0b" font-family="monospace" font-size="10" font-weight="bold">AUTONOMOUS LIMIT CYCLE (CIRCADIAN CLOCK EQUIVALENT)</text>
      <text x="20" y="42" fill="#cbd5e1" font-family="sans-serif" font-size="11">
        Because 3 negative inversions cannot satisfy any static equilibrium,
      </text>
      <text x="20" y="60" fill="#cbd5e1" font-family="sans-serif" font-size="11">
        the network chases its own tail forever, creating a stable biological oscillator.
      </text>
      <rect x="20" y="72" width="415" height="20" rx="4" fill="#451a03" stroke="#f59e0b" stroke-width="0.8"/>
      <text x="30" y="86" fill="#fde68a" font-family="monospace" font-size="10">Biological Function: Pacemaker peristaltic fluid pumping (Specimen 02)</text>
    </g>
  </g>

</svg>
`;

fs.writeFileSync(path.join(outDir, 'fig_grn_09_activation_inhibition_mechanics.svg'), svg09, 'utf8');
console.log('✓ Generated: docs/assets/diagrams/fig_grn_09_activation_inhibition_mechanics.svg');

// ============================================================================
// DIAGRAM 2: Graph Theory Network Topology (fig_grn_10)
// ============================================================================
const svg10 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 820" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad10" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="50%" stop-color="#0b172a"/>
      <stop offset="100%" stop-color="#010409"/>
    </linearGradient>

    <!-- Markers -->
    <marker id="arrowGrn10" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
      <polygon points="0 0, 7 3.5, 0 7" fill="#10b981"/>
    </marker>
    <marker id="arrowCyan10" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
      <polygon points="0 0, 7 3.5, 0 7" fill="#38bdf8"/>
    </marker>
    <marker id="barRed10" markerWidth="5" markerHeight="10" refX="2.5" refY="5" orient="auto">
      <line x1="2.5" y1="0" x2="2.5" y2="10" stroke="#ef4444" stroke-width="2.5"/>
    </marker>
  </defs>

  <!-- Background -->
  <rect width="1100" height="820" fill="url(#bgGrad10)"/>

  <!-- Title Banner -->
  <g transform="translate(40, 40)">
    <rect width="1020" height="65" rx="12" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="25" y="32" fill="#38bdf8" font-family="monospace" font-size="18" font-weight="bold" letter-spacing="1.5">FIGURE GRN-10: GRAPH THEORY REPRESENTATION OF GENE REGULATORY NETWORKS</text>
    <text x="25" y="52" fill="#94a3b8" font-family="sans-serif" font-size="12">Deconstructing a 60-Bit Genome Tape into Directed Graph Vertices V, Weighted Edges E, and Adjacency Matrix A</text>
  </g>

  <!-- TOP SECTION: THE 60-BIT GENOME TAPE (1D) -->
  <g transform="translate(40, 125)">
    <rect width="1020" height="110" rx="12" fill="#0f172a" stroke="#334155" stroke-width="1.2"/>
    <text x="20" y="26" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">1. 1D GENOME STRING (10 CODONS × 6 BITS = 60 BITS IN GENOME SAFE)</text>

    <!-- 10 Codon Pills -->
    <g transform="translate(20, 42)">
      <!-- Codon 0: PORIN_A -->
      <g transform="translate(0, 0)">
        <rect width="92" height="48" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
        <text x="10" y="20" fill="#a7f3d0" font-family="monospace" font-size="10" font-weight="bold">100000</text>
        <text x="10" y="38" fill="#34d399" font-family="monospace" font-size="10">PORIN_A</text>
      </g>
      <!-- Codon 1: PORIN_B -->
      <g transform="translate(98, 0)">
        <rect width="92" height="48" rx="6" fill="#451a03" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="10" y="20" fill="#fde68a" font-family="monospace" font-size="10" font-weight="bold">100110</text>
        <text x="10" y="38" fill="#fbbf24" font-family="monospace" font-size="10">PORIN_B</text>
      </g>
      <!-- Codon 2: GATE_AND -->
      <g transform="translate(196, 0)">
        <rect width="92" height="48" rx="6" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1.5"/>
        <text x="10" y="20" fill="#bfdbfe" font-family="monospace" font-size="10" font-weight="bold">000001</text>
        <text x="10" y="38" fill="#60a5fa" font-family="monospace" font-size="10">GATE_AND</text>
      </g>
      <!-- Codon 3: PORIN_T -->
      <g transform="translate(294, 0)">
        <rect width="92" height="48" rx="6" fill="#450a0a" stroke="#ef4444" stroke-width="1.5"/>
        <text x="10" y="20" fill="#fca5a5" font-family="monospace" font-size="10" font-weight="bold">101100</text>
        <text x="10" y="38" fill="#f87171" font-family="monospace" font-size="10">PORIN_TOX</text>
      </g>
      <!-- Codon 4: GATE_NOT -->
      <g transform="translate(392, 0)">
        <rect width="92" height="48" rx="6" fill="#581c87" stroke="#a855f7" stroke-width="1.5"/>
        <text x="10" y="20" fill="#e9d5ff" font-family="monospace" font-size="10" font-weight="bold">001100</text>
        <text x="10" y="38" fill="#c084fc" font-family="monospace" font-size="10">GATE_NOT</text>
      </g>
      <!-- Codon 5: SINK_BATT -->
      <g transform="translate(490, 0)">
        <rect width="92" height="48" rx="6" fill="#14532d" stroke="#22c55e" stroke-width="1.5"/>
        <text x="10" y="20" fill="#bbf7d0" font-family="monospace" font-size="10" font-weight="bold">110000</text>
        <text x="10" y="38" fill="#4ade80" font-family="monospace" font-size="10">SINK_BATT</text>
      </g>
      <!-- Codon 6: SINK_SEPT -->
      <g transform="translate(588, 0)">
        <rect width="92" height="48" rx="6" fill="#083344" stroke="#06b6d4" stroke-width="1.5"/>
        <text x="10" y="20" fill="#cffafe" font-family="monospace" font-size="10" font-weight="bold">110100</text>
        <text x="10" y="38" fill="#22d3ee" font-family="monospace" font-size="10">SINK_SEPT</text>
      </g>
      <!-- Codon 7: INTRON -->
      <g transform="translate(686, 0)">
        <rect width="92" height="48" rx="6" fill="#020617" stroke="#475569" stroke-width="1.2" stroke-dasharray="3,3"/>
        <text x="10" y="20" fill="#94a3b8" font-family="monospace" font-size="10">111000</text>
        <text x="10" y="38" fill="#64748b" font-family="monospace" font-size="10">INTRON</text>
      </g>
      <!-- Codon 8: INTRON -->
      <g transform="translate(784, 0)">
        <rect width="92" height="48" rx="6" fill="#020617" stroke="#475569" stroke-width="1.2" stroke-dasharray="3,3"/>
        <text x="10" y="20" fill="#94a3b8" font-family="monospace" font-size="10">111001</text>
        <text x="10" y="38" fill="#64748b" font-family="monospace" font-size="10">INTRON</text>
      </g>
      <!-- Codon 9: INTRON -->
      <g transform="translate(882, 0)">
        <rect width="92" height="48" rx="6" fill="#020617" stroke="#475569" stroke-width="1.2" stroke-dasharray="3,3"/>
        <text x="10" y="20" fill="#94a3b8" font-family="monospace" font-size="10">111010</text>
        <text x="10" y="38" fill="#64748b" font-family="monospace" font-size="10">INTRON</text>
      </g>
    </g>
  </g>

  <!-- BOTTOM LEFT: 2D DIRECTED GRAPH VISUALIZATION (V, E) -->
  <g transform="translate(40, 255)">
    <rect width="590" height="525" rx="12" fill="#0b1329" stroke="#06b6d4" stroke-width="1.2"/>
    <text x="20" y="26" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">2. DIRECTED GRAPH TOPOLOGY G = (V, E)</text>

    <!-- Layers of Vertices -->

    <!-- Layer 1: Boundary Porins (Left) -->
    <g transform="translate(40, 60)">
      <text x="0" y="0" fill="#94a3b8" font-family="monospace" font-size="10" font-weight="bold">INPUT PORINS (V_in)</text>

      <!-- Node S_A -->
      <circle cx="40" cy="50" r="22" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
      <text x="26" y="55" fill="#a7f3d0" font-family="monospace" font-size="12" font-weight="bold">S_A</text>
      <text x="15" y="86" fill="#34d399" font-family="sans-serif" font-size="9">Stream A</text>

      <!-- Node S_B -->
      <circle cx="40" cy="160" r="22" fill="#451a03" stroke="#f59e0b" stroke-width="2"/>
      <text x="26" y="165" fill="#fde68a" font-family="monospace" font-size="12" font-weight="bold">S_B</text>
      <text x="15" y="196" fill="#fbbf24" font-family="sans-serif" font-size="9">Stream B</text>

      <!-- Node S_T (Toxin) -->
      <circle cx="40" cy="270" r="22" fill="#450a0a" stroke="#ef4444" stroke-width="2"/>
      <text x="26" y="275" fill="#fca5a5" font-family="monospace" font-size="12" font-weight="bold">S_T</text>
      <text x="15" y="306" fill="#f87171" font-family="sans-serif" font-size="9">Toxin T</text>
    </g>

    <!-- Layer 2: Catalytic Logic Gates (Middle) -->
    <g transform="translate(230, 60)">
      <text x="0" y="0" fill="#94a3b8" font-family="monospace" font-size="10" font-weight="bold">LOGIC GATES (V_gate)</text>

      <!-- Gate 1: AND -->
      <rect x="20" y="75" width="80" height="50" rx="8" fill="#1e3a8a" stroke="#3b82f6" stroke-width="2"/>
      <text x="32" y="105" fill="#bfdbfe" font-family="monospace" font-size="12" font-weight="bold">G1:AND</text>
      <text x="30" y="140" fill="#60a5fa" font-family="sans-serif" font-size="9">Synthetase</text>

      <!-- Gate 2: NOT -->
      <rect x="20" y="225" width="80" height="50" rx="8" fill="#581c87" stroke="#a855f7" stroke-width="2"/>
      <text x="32" y="255" fill="#e9d5ff" font-family="monospace" font-size="12" font-weight="bold">G2:NOT</text>
      <text x="32" y="290" fill="#c084fc" font-family="sans-serif" font-size="9">Inverter</text>
    </g>

    <!-- Layer 3: Actuator Sinks & Battery (Right) -->
    <g transform="translate(420, 60)">
      <text x="0" y="0" fill="#94a3b8" font-family="monospace" font-size="10" font-weight="bold">ACTUATOR SINKS (V_out)</text>

      <!-- Sink: Battery -->
      <circle cx="50" cy="100" r="24" fill="#14532d" stroke="#22c55e" stroke-width="2"/>
      <text x="35" y="104" fill="#bbf7d0" font-family="monospace" font-size="11" font-weight="bold">BATT</text>
      <text x="25" y="138" fill="#4ade80" font-family="sans-serif" font-size="9">Charge +2T</text>

      <!-- Sink: Septum / FtsZ -->
      <circle cx="50" cy="250" r="24" fill="#083344" stroke="#06b6d4" stroke-width="2"/>
      <text x="35" y="254" fill="#cffafe" font-family="monospace" font-size="11" font-weight="bold">SEPT</text>
      <text x="22" y="288" fill="#22d3ee" font-family="sans-serif" font-size="9">FtsZ Division</text>
    </g>

    <!-- Feedback Register Node: M0 (Bottom Center) -->
    <g transform="translate(250, 420)">
      <rect x="0" y="0" width="100" height="40" rx="6" fill="#1e1b4b" stroke="#818cf8" stroke-width="1.5"/>
      <text x="18" y="24" fill="#c7d2fe" font-family="monospace" font-size="11" font-weight="bold">Reg M_0 [1]</text>
      <text x="12" y="52" fill="#818cf8" font-family="sans-serif" font-size="9">Metabolite Memory</text>
    </g>

    <!-- Directed Edges (Arrows & Bars) -->
    <!-- S_A -> G1 -->
    <line x1="102" y1="110" x2="250" y2="150" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrowGrn10)"/>
    <!-- S_B -> G1 -->
    <line x1="102" y1="220" x2="250" y2="170" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#arrowGrn10)"/>

    <!-- G1 Output -> BATT -->
    <line x1="330" y1="160" x2="445" y2="160" stroke="#10b981" stroke-width="3" marker-end="url(#arrowGrn10)"/>

    <!-- G1 Output -> G2 Repression (blunt bar) -->
    <path d="M 290 185 C 270 210, 270 260, 285 285" fill="none" stroke="#ef4444" stroke-width="2.5" marker-end="url(#barRed10)"/>
    <text x="245" y="240" fill="#f87171" font-family="monospace" font-size="10" font-weight="bold">⊣</text>

    <!-- S_T (Toxin) -> G2 -->
    <line x1="102" y1="330" x2="250" y2="320" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrowGrn10)"/>

    <!-- G2 Output -> SEPT -->
    <line x1="330" y1="310" x2="445" y2="310" stroke="#a855f7" stroke-width="2.5" marker-end="url(#arrowCyan10)"/>

    <!-- G1 -> M0 Feedback Loop -->
    <path d="M 310 185 Q 360 300 310 420" fill="none" stroke="#818cf8" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrowCyan10)"/>
    <!-- M0 -> G1 Loop Back -->
    <path d="M 250 440 Q 180 320 250 185" fill="none" stroke="#818cf8" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrowCyan10)"/>

    <!-- Legend strip inside graph -->
    <g transform="translate(30, 475)">
      <line x1="0" y1="10" x2="25" y2="10" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrowGrn10)"/>
      <text x="35" y="14" fill="#a7f3d0" font-family="monospace" font-size="10">Activating Edge (+1)</text>

      <line x1="190" y1="10" x2="215" y2="10" stroke="#ef4444" stroke-width="2.5" marker-end="url(#barRed10)"/>
      <text x="225" y="14" fill="#fca5a5" font-family="monospace" font-size="10">Inhibitory Edge (-1)</text>

      <line x1="380" y1="10" x2="405" y2="10" stroke="#818cf8" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrowCyan10)"/>
      <text x="415" y="14" fill="#c7d2fe" font-family="monospace" font-size="10">Feedback Loop (M_k)</text>
    </g>
  </g>

  <!-- BOTTOM RIGHT: FORMAL GRAPH ADJACENCY MATRIX A_ij (N x N) -->
  <g transform="translate(650, 255)">
    <rect width="410" height="525" rx="12" fill="#0f172a" stroke="#334155" stroke-width="1.2"/>
    <text x="20" y="26" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">3. ADJACENCY MATRIX A_ij &amp; ALGEBRA</text>

    <!-- Explanatory note -->
    <text x="20" y="50" fill="#94a3b8" font-family="sans-serif" font-size="11">
      Every gene network maps to a signed adjacency matrix:
    </text>
    <text x="20" y="68" fill="#cbd5e1" font-family="monospace" font-size="11">
      A_ij = +1 (activate), -1 (inhibit), 0 (none)
    </text>

    <!-- Matrix Grid Visual -->
    <g transform="translate(20, 85)">
      <!-- Header labels -->
      <text x="60" y="15" fill="#94a3b8" font-family="monospace" font-size="10">S_A</text>
      <text x="100" y="15" fill="#94a3b8" font-family="monospace" font-size="10">S_B</text>
      <text x="140" y="15" fill="#94a3b8" font-family="monospace" font-size="10">S_T</text>
      <text x="180" y="15" fill="#60a5fa" font-family="monospace" font-size="10" font-weight="bold">G1</text>
      <text x="220" y="15" fill="#c084fc" font-family="monospace" font-size="10" font-weight="bold">G2</text>
      <text x="260" y="15" fill="#4ade80" font-family="monospace" font-size="10">BAT</text>
      <text x="300" y="15" fill="#22d3ee" font-family="monospace" font-size="10">SEP</text>
      <text x="340" y="15" fill="#818cf8" font-family="monospace" font-size="10">M0</text>

      <!-- Matrix Row 1: S_A -->
      <text x="10" y="42" fill="#94a3b8" font-family="monospace" font-size="10">S_A</text>
      <text x="65" y="42" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="105" y="42" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="145" y="42" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="182" y="42" fill="#10b981" font-family="monospace" font-size="11" font-weight="bold">+1</text>
      <text x="225" y="42" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="265" y="42" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="305" y="42" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="345" y="42" fill="#475569" font-family="monospace" font-size="11">0</text>

      <!-- Matrix Row 2: S_B -->
      <text x="10" y="70" fill="#94a3b8" font-family="monospace" font-size="10">S_B</text>
      <text x="65" y="70" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="105" y="70" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="145" y="70" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="182" y="70" fill="#10b981" font-family="monospace" font-size="11" font-weight="bold">+1</text>
      <text x="225" y="70" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="265" y="70" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="305" y="70" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="345" y="70" fill="#475569" font-family="monospace" font-size="11">0</text>

      <!-- Matrix Row 3: S_T -->
      <text x="10" y="98" fill="#94a3b8" font-family="monospace" font-size="10">S_T</text>
      <text x="65" y="98" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="105" y="98" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="145" y="98" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="185" y="98" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="222" y="98" fill="#10b981" font-family="monospace" font-size="11" font-weight="bold">+1</text>
      <text x="265" y="98" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="305" y="98" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="345" y="98" fill="#475569" font-family="monospace" font-size="11">0</text>

      <!-- Matrix Row 4: G1 -->
      <text x="10" y="126" fill="#60a5fa" font-family="monospace" font-size="10" font-weight="bold">G1</text>
      <text x="65" y="126" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="105" y="126" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="145" y="126" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="185" y="126" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="223" y="126" fill="#ef4444" font-family="monospace" font-size="11" font-weight="bold">-1</text>
      <text x="262" y="126" fill="#10b981" font-family="monospace" font-size="11" font-weight="bold">+1</text>
      <text x="305" y="126" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="342" y="126" fill="#818cf8" font-family="monospace" font-size="11" font-weight="bold">+1</text>

      <!-- Matrix Row 5: G2 -->
      <text x="10" y="154" fill="#c084fc" font-family="monospace" font-size="10" font-weight="bold">G2</text>
      <text x="65" y="154" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="105" y="154" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="145" y="154" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="185" y="154" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="225" y="154" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="265" y="154" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="302" y="154" fill="#10b981" font-family="monospace" font-size="11" font-weight="bold">+1</text>
      <text x="345" y="154" fill="#475569" font-family="monospace" font-size="11">0</text>

      <!-- Matrix Row 6: M0 -->
      <text x="10" y="182" fill="#818cf8" font-family="monospace" font-size="10">M0</text>
      <text x="65" y="182" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="105" y="182" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="145" y="182" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="182" y="182" fill="#818cf8" font-family="monospace" font-size="11" font-weight="bold">+1</text>
      <text x="225" y="182" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="265" y="182" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="305" y="182" fill="#475569" font-family="monospace" font-size="11">0</text>
      <text x="345" y="182" fill="#475569" font-family="monospace" font-size="11">0</text>
    </g>

    <!-- Graph Theory Properties Box -->
    <g transform="translate(20, 290)">
      <rect width="370" height="210" rx="8" fill="#020617" stroke="#1e293b" stroke-width="1"/>
      <text x="15" y="24" fill="#38bdf8" font-family="monospace" font-size="11" font-weight="bold">TOPOLOGICAL INVARIANTS IN SILICO</text>

      <text x="15" y="52" fill="#a7f3d0" font-family="monospace" font-size="10" font-weight="bold">• In-Degree K_in = 2:</text>
      <text x="15" y="68" fill="#94a3b8" font-family="sans-serif" font-size="10">Every logic gate node receives exactly 2 inputs.</text>

      <text x="15" y="96" fill="#fde68a" font-family="monospace" font-size="10" font-weight="bold">• Betti Number β_1 = 1:</text>
      <text x="15" y="112" fill="#94a3b8" font-family="sans-serif" font-size="10">Contains exactly 1 independent 1D cycle (M_0 feedback).</text>

      <text x="15" y="140" fill="#fca5a5" font-family="monospace" font-size="10" font-weight="bold">• Weisfeiler-Lehman (WL) Hash:</text>
      <text x="15" y="156" fill="#cbd5e1" font-family="monospace" font-size="10">wl_hash: "a4f8-e129-c902"</text>
      <text x="15" y="172" fill="#64748b" font-family="sans-serif" font-size="9">Permutation-invariant cryptographic fingerprint.</text>

      <text x="15" y="196" fill="#38bdf8" font-family="sans-serif" font-size="10" font-weight="bold">Identical graph = Identical tissue physiology!</text>
    </g>
  </g>

</svg>
`;

fs.writeFileSync(path.join(outDir, 'fig_grn_10_graph_theory_network_topology.svg'), svg10, 'utf8');
console.log('✓ Generated: docs/assets/diagrams/fig_grn_10_graph_theory_network_topology.svg');

// ============================================================================
// DIAGRAM 3: Dynamic Signal Propagation (fig_grn_11)
// ============================================================================
const svg11 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 820" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad11" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617"/>
      <stop offset="50%" stop-color="#071226"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>

    <!-- Pulse marker -->
    <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <rect width="1100" height="820" fill="url(#bgGrad11)"/>

  <!-- Title Banner -->
  <g transform="translate(40, 40)">
    <rect width="1020" height="65" rx="12" fill="#0f172a" stroke="#06b6d4" stroke-width="1.5"/>
    <text x="25" y="32" fill="#38bdf8" font-family="monospace" font-size="18" font-weight="bold" letter-spacing="1.5">FIGURE GRN-11: DYNAMIC SIGNAL PROPAGATION &amp; STATE SWITCHING</text>
    <text x="25" y="52" fill="#94a3b8" font-family="sans-serif" font-size="12">Clocked Waveform Execution Across 4 Discrete Ticks (t_0 to t_3) with Landauer Dissipation Taxes</text>
  </g>

  <!-- TIMELINE STAGES (4 COLUMNS: T_0, T_1, T_2, T_3) -->
  <g transform="translate(40, 130)">
    <rect width="1020" height="420" rx="12" fill="#0b1329" stroke="#334155" stroke-width="1.2"/>

    <!-- Column Headers -->
    <g transform="translate(20, 20)">
      <!-- Tick 0 -->
      <rect x="0" y="0" width="230" height="35" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1"/>
      <text x="15" y="22" fill="#94a3b8" font-family="monospace" font-size="12" font-weight="bold">TICK t_0: INCOMING PULSE</text>

      <!-- Tick 1 -->
      <rect x="250" y="0" width="230" height="35" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="1"/>
      <text x="265" y="22" fill="#34d399" font-family="monospace" font-size="12" font-weight="bold">TICK t_1: GATE 1 ACTIVATION</text>

      <!-- Tick 2 -->
      <rect x="500" y="0" width="230" height="35" rx="6" fill="#450a0a" stroke="#ef4444" stroke-width="1"/>
      <text x="515" y="22" fill="#f87171" font-family="monospace" font-size="12" font-weight="bold">TICK t_2: REPRESSION INVERT</text>

      <!-- Tick 3 -->
      <rect x="750" y="0" width="230" height="35" rx="6" fill="#14532d" stroke="#22c55e" stroke-width="1"/>
      <text x="765" y="22" fill="#4ade80" font-family="monospace" font-size="12" font-weight="bold">TICK t_3: METABOLIC LATCH</text>
    </g>

    <!-- Signal Flow Illustrations in each column -->

    <!-- COLUMN 0: Tick 0 -->
    <g transform="translate(30, 80)">
      <rect width="215" height="280" rx="8" fill="#020617" stroke="#1e293b" stroke-width="1"/>
      <!-- Hydrothermal surge arrives -->
      <circle cx="107" cy="40" r="18" fill="#06b6d4" stroke="#38bdf8" stroke-width="2" filter="url(#glowCyan)"/>
      <text x="85" y="44" fill="#000" font-family="monospace" font-size="11" font-weight="bold">PULSE</text>
      <text x="40" y="80" fill="#38bdf8" font-family="sans-serif" font-size="10">Fuel Waveform Surges: 1</text>
      <!-- Porin accepts -->
      <rect x="57" y="100" width="100" height="30" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="1"/>
      <text x="72" y="120" fill="#a7f3d0" font-family="monospace" font-size="10">PORIN_A = 1</text>

      <!-- Gates currently quiescent -->
      <rect x="57" y="155" width="100" height="30" rx="4" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
      <text x="75" y="174" fill="#94a3b8" font-family="monospace" font-size="10">G1 (AND): 0</text>

      <rect x="57" y="210" width="100" height="30" rx="4" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
      <text x="75" y="229" fill="#94a3b8" font-family="monospace" font-size="10">G2 (NOT): 1</text>

      <text x="45" y="265" fill="#64748b" font-family="sans-serif" font-size="9">Dissipation: 0.05T (Leak)</text>
    </g>

    <!-- COLUMN 1: Tick 1 -->
    <g transform="translate(280, 80)">
      <rect width="215" height="280" rx="8" fill="#020617" stroke="#059669" stroke-width="1.2"/>
      <!-- Porin A HIGH -->
      <rect x="57" y="30" width="100" height="26" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="1"/>
      <text x="72" y="47" fill="#a7f3d0" font-family="monospace" font-size="10">PORIN_A = 1</text>

      <!-- Wire traveling pulse -->
      <line x1="107" y1="56" x2="107" y2="95" stroke="#10b981" stroke-width="3"/>
      <circle cx="107" cy="75" r="5" fill="#34d399" filter="url(#glowCyan)"/>

      <!-- Gate 1 FIRES! -->
      <rect x="47" y="100" width="120" height="40" rx="6" fill="#1e3a8a" stroke="#3b82f6" stroke-width="2" filter="url(#glowCyan)"/>
      <text x="62" y="125" fill="#bfdbfe" font-family="monospace" font-size="12" font-weight="bold">G1: FIRES! (1)</text>

      <!-- Landauer Tax Callout -->
      <rect x="35" y="155" width="145" height="24" rx="4" fill="#451a03" stroke="#f59e0b" stroke-width="1"/>
      <text x="42" y="171" fill="#fde68a" font-family="monospace" font-size="10" font-weight="bold">⚡ Landauer Tax: 1.0T</text>

      <!-- Gate 2 hasn't received pulse yet -->
      <rect x="57" y="210" width="100" height="30" rx="4" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
      <text x="75" y="229" fill="#94a3b8" font-family="monospace" font-size="10">G2 (NOT): 1</text>

      <text x="40" y="265" fill="#34d399" font-family="sans-serif" font-size="9">Total Cost: 1.05T</text>
    </g>

    <!-- COLUMN 2: Tick 2 -->
    <g transform="translate(530, 80)">
      <rect width="215" height="280" rx="8" fill="#020617" stroke="#dc2626" stroke-width="1.2"/>
      <!-- Gate 1 still 1 -->
      <rect x="47" y="30" width="120" height="30" rx="4" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1"/>
      <text x="68" y="50" fill="#bfdbfe" font-family="monospace" font-size="10">G1 (AND) = 1</text>

      <!-- Downward repression wire -->
      <line x1="107" y1="60" x2="107" y2="105" stroke="#ef4444" stroke-width="3"/>
      <circle cx="107" cy="85" r="5" fill="#f87171" filter="url(#glowCyan)"/>

      <!-- Gate 2 INVERTS & SHUTS DOWN -->
      <rect x="47" y="110" width="120" height="40" rx="6" fill="#450a0a" stroke="#ef4444" stroke-width="2" filter="url(#glowCyan)"/>
      <text x="56" y="135" fill="#fca5a5" font-family="monospace" font-size="12" font-weight="bold">G2: FLIPS (0)</text>

      <!-- Landauer Tax Callout -->
      <rect x="35" y="165" width="145" height="24" rx="4" fill="#451a03" stroke="#f59e0b" stroke-width="1"/>
      <text x="42" y="181" fill="#fde68a" font-family="monospace" font-size="10" font-weight="bold">⚡ Landauer Tax: 1.0T</text>

      <!-- Repression relieved on downstream -->
      <text x="35" y="220" fill="#fca5a5" font-family="sans-serif" font-size="10">Repression Relieved!</text>
      <text x="35" y="235" fill="#cbd5e1" font-family="sans-serif" font-size="10">Battery Synthetase Unlocked</text>

      <text x="40" y="265" fill="#f87171" font-family="sans-serif" font-size="9">Total Cost: 1.05T</text>
    </g>

    <!-- COLUMN 3: Tick 3 -->
    <g transform="translate(780, 80)">
      <rect width="215" height="280" rx="8" fill="#020617" stroke="#22c55e" stroke-width="1.2"/>
      <!-- Stable Trophocyte Attractor -->
      <rect x="47" y="30" width="120" height="30" rx="4" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1"/>
      <text x="68" y="50" fill="#bfdbfe" font-family="monospace" font-size="10">G1 (AND) = 1</text>

      <rect x="47" y="75" width="120" height="30" rx="4" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
      <text x="68" y="95" fill="#94a3b8" font-family="monospace" font-size="10">G2 (NOT) = 0</text>

      <!-- ATP Battery Charges +2T -->
      <circle cx="107" cy="155" r="26" fill="#14532d" stroke="#22c55e" stroke-width="2.5" filter="url(#glowCyan)"/>
      <text x="85" y="159" fill="#bbf7d0" font-family="monospace" font-size="12" font-weight="bold">+2.0 T</text>
      <text x="60" y="195" fill="#4ade80" font-family="sans-serif" font-size="10" font-weight="bold">Battery Charged</text>

      <!-- Steady State Achieved -->
      <rect x="25" y="215" width="165" height="26" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="1"/>
      <text x="32" y="232" fill="#a7f3d0" font-family="monospace" font-size="10" font-weight="bold">STABLE ATTRACTOR (A_1)</text>

      <text x="40" y="265" fill="#4ade80" font-family="sans-serif" font-size="9">Dissipation drops to 0.05T!</text>
    </g>
  </g>

  <!-- BOTTOM SECTION: TIMELINE WAVEFORM PLOT (LOGIC TRACE V(t)) -->
  <g transform="translate(40, 570)">
    <rect width="1020" height="210" rx="12" fill="#0f172a" stroke="#334155" stroke-width="1.2"/>
    <text x="20" y="26" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">MULTI-CHANNEL LOGIC WAVEFORM TRACE (TIME SERIES OVER TICKS)</text>

    <!-- Channel 1: Environmental Fuel Input -->
    <g transform="translate(40, 45)">
      <text x="0" y="16" fill="#38bdf8" font-family="monospace" font-size="11" font-weight="bold">Stream A:</text>
      <path d="M 100 20 L 220 20 L 220 5 L 940 5" fill="none" stroke="#38bdf8" stroke-width="2"/>
      <text x="955" y="15" fill="#38bdf8" font-family="monospace" font-size="10">1 (HIGH)</text>
    </g>

    <!-- Channel 2: Gate 1 (AND) Output -->
    <g transform="translate(40, 80)">
      <text x="0" y="16" fill="#60a5fa" font-family="monospace" font-size="11" font-weight="bold">Gate 1 (AND):</text>
      <path d="M 100 20 L 360 20 L 360 5 L 940 5" fill="none" stroke="#60a5fa" stroke-width="2"/>
      <text x="955" y="15" fill="#60a5fa" font-family="monospace" font-size="10">1 (HIGH)</text>
    </g>

    <!-- Channel 3: Gate 2 (NOT) Output -->
    <g transform="translate(40, 115)">
      <text x="0" y="16" fill="#f87171" font-family="monospace" font-size="11" font-weight="bold">Gate 2 (NOT):</text>
      <path d="M 100 5 L 610 5 L 610 20 L 940 20" fill="none" stroke="#f87171" stroke-width="2"/>
      <text x="955" y="15" fill="#f87171" font-family="monospace" font-size="10">0 (LOW)</text>
    </g>

    <!-- Channel 4: Landauer Power Dissipation (Impulses) -->
    <g transform="translate(40, 150)">
      <text x="0" y="16" fill="#f59e0b" font-family="monospace" font-size="11" font-weight="bold">Landauer (E):</text>
      <!-- Baseline leak -->
      <line x1="100" y1="20" x2="940" y2="20" stroke="#475569" stroke-width="1.5"/>
      <!-- Spike at Tick 1 -->
      <line x1="360" y1="20" x2="360" y2="0" stroke="#f59e0b" stroke-width="3"/>
      <polygon points="356,4 360,0 364,4" fill="#f59e0b"/>
      <text x="345" y="-5" fill="#fde68a" font-family="monospace" font-size="9">+1.0T</text>
      <!-- Spike at Tick 2 -->
      <line x1="610" y1="20" x2="610" y2="0" stroke="#f59e0b" stroke-width="3"/>
      <polygon points="606,4 610,0 614,4" fill="#f59e0b"/>
      <text x="595" y="-5" fill="#fde68a" font-family="monospace" font-size="9">+1.0T</text>
      <text x="955" y="15" fill="#94a3b8" font-family="monospace" font-size="10">0.05T leak</text>
    </g>
  </g>

</svg>
`;

fs.writeFileSync(path.join(outDir, 'fig_grn_11_dynamic_signal_propagation.svg'), svg11, 'utf8');
console.log('✓ Generated: docs/assets/diagrams/fig_grn_11_dynamic_signal_propagation.svg');

console.log('\n🎉 ALL 3 ADVANCED GRN DIAGRAMS GENERATED SUCCESSFULLY!');
