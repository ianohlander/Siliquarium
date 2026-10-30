#!/usr/bin/env node

/**
 * 🎨 Siliquarium Morphology & GRN SVG Diagram Generator
 * Generates publication-grade, dark-themed SVG diagrams for the
 * Multicellular Morphology and Gene Regulatory Networks Guide.
 * 
 * Replaces all ASCII schematics with crisp, accessible vector illustrations.
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
      <stop offset="0%" stop-color="#c084fc" />
      <stop offset="100%" stop-color="#7e22ce" />
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
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#c084fc" />
    </marker>
    <marker id="arrow-slate" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
    </marker>
  </defs>

  <style>
    .title { font-family: ui-monospace, 'Cascadia Code', Consolas, monospace; font-size: 14.5px; font-weight: bold; fill: #f8fafc; }
    .subtitle { font-family: system-ui, -apple-system, 'Inter', sans-serif; font-size: 11px; fill: #94a3b8; }
    .label { font-family: system-ui, -apple-system, 'Inter', sans-serif; font-size: 11px; fill: #cbd5e1; }
    .label-bold { font-family: system-ui, -apple-system, 'Inter', sans-serif; font-size: 11.5px; font-weight: bold; fill: #f8fafc; }
    .code { font-family: ui-monospace, 'Cascadia Code', Consolas, monospace; font-size: 10.5px; fill: #00e5ff; }
    .badge { font-family: ui-monospace, 'Cascadia Code', Consolas, monospace; font-size: 9.5px; font-weight: bold; letter-spacing: 0.5px; }
  </style>

  <!-- Background Canvas -->
  <rect width="${width}" height="${height}" rx="12" fill="url(#panelGrad)" stroke="#1e293b" stroke-width="1.5" />
${content}
</svg>`;
}

function hexPath(cx, cy, r) {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30);
    const x = (cx + r * Math.cos(angle)).toFixed(1);
    const y = (cy + r * Math.sin(angle)).toFixed(1);
    points.push(`${x},${y}`);
  }
  return points.join(' ');
}

// -------------------------------------------------------------
// Diagram 1: 3D Hexagonal Lattice Metric & Axial Coordinates
// -------------------------------------------------------------
function makeHexMetricDiagram() {
  const w = 780, h = 420;
  const content = `
  <!-- Header -->
  <text x="24" y="32" class="title">📐 3D HEXAGONAL LATTICE METRIC &amp; AXIAL COORDINATES (q, r, z)</text>
  <text x="24" y="50" class="subtitle">Displacement vectors, 60° basis geometry, and the taxicab metric in basalt columns</text>

  <!-- Left Card: Coordinate Map -->
  <g transform="translate(24, 70)">
    <rect width="360" height="326" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1" />
    <text x="180" y="24" text-anchor="middle" class="label-bold" fill="#38bdf8">Planar Hexagonal Basis: q + r + s = 0</text>

    <!-- Center Hex (0, 0, 0) -->
    <polygon points="${hexPath(180, 160, 42)}" fill="#1e293b" stroke="#00e5ff" stroke-width="2" />
    <text x="180" y="156" text-anchor="middle" class="code" fill="#00e5ff" font-weight="bold">(0, 0, 0)</text>
    <text x="180" y="172" text-anchor="middle" class="badge" fill="#94a3b8">ORIGIN</text>

    <!-- Neighbor Hexes (r=36) -->
    <!-- (1, 0): East-ish (right) -->
    <polygon points="${hexPath(253, 160, 36)}" fill="#0f172a" stroke="#10b981" stroke-width="1.5" />
    <text x="253" y="158" text-anchor="middle" class="code" fill="#10b981">(1, 0, 0)</text>
    <text x="253" y="172" text-anchor="middle" class="badge" fill="#64748b">+q Axis</text>

    <!-- (-1, 0): West-ish (left) -->
    <polygon points="${hexPath(107, 160, 36)}" fill="#0f172a" stroke="#10b981" stroke-width="1.5" />
    <text x="107" y="158" text-anchor="middle" class="code" fill="#10b981">(-1, 0, 0)</text>
    <text x="107" y="172" text-anchor="middle" class="badge" fill="#64748b">-q Axis</text>

    <!-- (0, 1): South-East -->
    <polygon points="${hexPath(216, 224, 36)}" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5" />
    <text x="216" y="222" text-anchor="middle" class="code" fill="#f59e0b">(0, 1, 0)</text>
    <text x="216" y="236" text-anchor="middle" class="badge" fill="#64748b">+r Axis</text>

    <!-- (0, -1): North-West -->
    <polygon points="${hexPath(144, 96, 36)}" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5" />
    <text x="144" y="94" text-anchor="middle" class="code" fill="#f59e0b">(0, -1, 0)</text>
    <text x="144" y="108" text-anchor="middle" class="badge" fill="#64748b">-r Axis</text>

    <!-- (1, -1): North-East -->
    <polygon points="${hexPath(216, 96, 36)}" fill="#0f172a" stroke="#c084fc" stroke-width="1.5" />
    <text x="216" y="94" text-anchor="middle" class="code" fill="#c084fc">(1, -1, 0)</text>

    <!-- (-1, 1): South-West -->
    <polygon points="${hexPath(144, 224, 36)}" fill="#0f172a" stroke="#c084fc" stroke-width="1.5" />
    <text x="144" y="222" text-anchor="middle" class="code" fill="#c084fc">(-1, 1, 0)</text>

    <!-- Axes arrows -->
    <line x1="180" y1="160" x2="310" y2="160" stroke="#10b981" stroke-width="2" stroke-dasharray="3 3" marker-end="url(#arrow-emerald)" />
    <line x1="180" y1="160" x2="245" y2="275" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3 3" marker-end="url(#arrow-amber)" />

    <text x="180" y="306" text-anchor="middle" class="subtitle">Every pore has exactly 6 planar neighbors + 2 vertical (z±1)</text>
  </g>

  <!-- Right Card: Distance Metric & Formal Math -->
  <g transform="translate(404, 70)">
    <rect width="352" height="326" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1" />
    <text x="176" y="24" text-anchor="middle" class="label-bold" fill="#38bdf8">3D Hexagonal Metric Formula</text>

    <!-- Equation Box -->
    <rect x="16" y="40" width="320" height="64" rx="6" fill="#0c1222" stroke="#00e5ff" stroke-width="1.2" />
    <text x="176" y="66" text-anchor="middle" class="code" font-size="13px" fill="#00e5ff">d_hex(u, v) = d_plane + |u_z - v_z|</text>
    <text x="176" y="88" text-anchor="middle" class="code" font-size="11px" fill="#f8fafc">d_plane = max(|Δq|, |Δr|, |Δq + Δr|)</text>

    <!-- Properties List -->
    <g transform="translate(20, 122)">
      <rect x="0" y="0" width="312" height="42" rx="4" fill="#131c31" stroke="#334155" />
      <text x="12" y="18" class="label-bold" fill="#34d399">1. Planar Distance</text>
      <text x="12" y="34" class="subtitle">Equivalent to Manhattan distance on cube projection (q, r, s)</text>
    </g>

    <g transform="translate(20, 172)">
      <rect x="0" y="0" width="312" height="42" rx="4" fill="#131c31" stroke="#334155" />
      <text x="12" y="18" class="label-bold" fill="#38bdf8">2. Vertical Strata Penalty</text>
      <text x="12" y="34" class="subtitle">Vertical step |u_z - v_z| adds 1.0 per rock/water stratum</text>
    </g>

    <g transform="translate(20, 222)">
      <rect x="0" y="0" width="312" height="42" rx="4" fill="#131c31" stroke="#334155" />
      <text x="12" y="18" class="label-bold" fill="#c084fc">3. Adjacency Criterion</text>
      <text x="12" y="34" class="subtitle">Pores u and v are physical neighbors iff d_hex(u, v) == 1</text>
    </g>

    <g transform="translate(20, 272)">
      <rect x="0" y="0" width="312" height="36" rx="4" fill="rgba(56, 189, 248, 0.1)" stroke="#38bdf8" />
      <text x="156" y="22" text-anchor="middle" class="badge" fill="#38bdf8">TRIANGLES AT 60° • ZERO SQUARES IN BASALT</text>
    </g>
  </g>
  `;
  return svgWrapper(w, h, content);
}

// -------------------------------------------------------------
// Diagram 2: Minimal 3-Clique (K3) Triad Rosette
// -------------------------------------------------------------
function makeRosetteMinimalDiagram() {
  const w = 780, h = 400;
  const content = `
  <!-- Header -->
  <text x="24" y="32" class="title">🌸 MINIMAL 3-CLIQUE (K₃) TRIAD ROSETTE</text>
  <text x="24" y="50" class="subtitle">Mutual 3-pore triangular cycle conferring omnidirectional cytoplasmic sharing</text>

  <!-- Left: Physical Lattice Schematic -->
  <g transform="translate(24, 70)">
    <rect width="360" height="306" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1" />
    <text x="180" y="24" text-anchor="middle" class="label-bold" fill="#f472b6">Physical Hexagonal Triad (z = 0)</text>

    <!-- Conduits (Edges) -->
    <line x1="180" y1="90" x2="120" y2="200" stroke="#c084fc" stroke-width="4" stroke-linecap="round" />
    <line x1="120" y1="200" x2="240" y2="200" stroke="#c084fc" stroke-width="4" stroke-linecap="round" />
    <line x1="240" y1="200" x2="180" y2="90" stroke="#c084fc" stroke-width="4" stroke-linecap="round" />

    <!-- Central triangle fill (mutual clique) -->
    <polygon points="180,90 120,200 240,200" fill="rgba(192, 132, 252, 0.15)" />
    <text x="180" y="165" text-anchor="middle" class="badge" fill="#c084fc">3-CLIQUE (K₃)</text>

    <!-- Vertex P3: (0, 1, 0) -->
    <polygon points="${hexPath(180, 90, 32)}" fill="#0f172a" stroke="#f59e0b" stroke-width="2" />
    <text x="180" y="86" text-anchor="middle" class="code" fill="#f59e0b">P3 (0, 1)</text>
    <text x="180" y="100" text-anchor="middle" class="badge" fill="#cbd5e1">⚡ Pacemaker</text>

    <!-- Vertex P1: (0, 0, 0) -->
    <polygon points="${hexPath(120, 200, 32)}" fill="#0f172a" stroke="#10b981" stroke-width="2" />
    <text x="120" y="196" text-anchor="middle" class="code" fill="#10b981">P1 (0, 0)</text>
    <text x="120" y="210" text-anchor="middle" class="badge" fill="#cbd5e1">🌾 Trophocyte</text>

    <!-- Vertex P2: (1, 0, 0) -->
    <polygon points="${hexPath(240, 200, 32)}" fill="#0f172a" stroke="#38bdf8" stroke-width="2" />
    <text x="240" y="196" text-anchor="middle" class="code" fill="#38bdf8">P2 (1, 0)</text>
    <text x="240" y="210" text-anchor="middle" class="badge" fill="#cbd5e1">🛡️ Shield</text>

    <text x="180" y="270" text-anchor="middle" class="subtitle">Every node connected to every other node: |E| = 3, n = 3</text>
  </g>

  <!-- Right: Graph Theory & Trace Calculation -->
  <g transform="translate(404, 70)">
    <rect width="352" height="306" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1" />
    <text x="176" y="24" text-anchor="middle" class="label-bold" fill="#38bdf8">Graph Theory Adjacency Matrix</text>

    <!-- Adjacency Matrix A -->
    <g transform="translate(30, 46)">
      <text x="0" y="16" class="code" font-size="12px" fill="#cbd5e1">A =</text>
      <text x="35" y="16" class="code" fill="#38bdf8">[ 0  1  1 ]</text>
      <text x="35" y="34" class="code" fill="#38bdf8">[ 1  0  1 ]</text>
      <text x="35" y="52" class="code" fill="#38bdf8">[ 1  1  0 ]</text>
    </g>

    <!-- A³ Matrix Box -->
    <g transform="translate(180, 46)">
      <text x="0" y="16" class="code" font-size="12px" fill="#cbd5e1">A³ =</text>
      <text x="40" y="16" class="code" fill="#f472b6">[ 2  3  3 ]</text>
      <text x="40" y="34" class="code" fill="#f472b6">[ 3  2  3 ]</text>
      <text x="40" y="52" class="code" fill="#f472b6">[ 3  3  2 ]</text>
    </g>

    <!-- Trace Box -->
    <rect x="16" y="118" width="320" height="80" rx="6" fill="#0c1222" stroke="#f472b6" stroke-width="1.2" />
    <text x="28" y="142" class="code" font-size="12px" fill="#cbd5e1">Tr(A³) = 2 + 2 + 2 = 6</text>
    <text x="28" y="166" class="code" font-size="13px" font-weight="bold" fill="#f472b6">τ(G) = (1/6) · Tr(A³) = 6 / 6 = 1</text>
    <text x="28" y="186" class="subtitle" fill="#94a3b8">Diagnostic Invariant: τ(G) ≥ 1 ⟹ ROSETTE</text>

    <!-- Summary Metrics Table -->
    <g transform="translate(16, 214)">
      <rect width="320" height="74" rx="6" fill="#131c31" stroke="#334155" />
      <text x="14" y="24" class="label">Vertices (|V|): <tspan class="code">3</tspan></text>
      <text x="160" y="24" class="label">Edges (|E|): <tspan class="code">3</tspan></text>
      <text x="14" y="46" class="label">Clustering C(G): <tspan class="code" fill="#10b981">1.00 (Maximal)</tspan></text>
      <text x="160" y="46" class="label">Betti γ(G): <tspan class="code">1</tspan></text>
      <text x="14" y="64" class="subtitle">Complete Graph K₃: Zero diffusion bottleneck</text>
    </g>
  </g>
  `;
  return svgWrapper(w, h, content);
}

// -------------------------------------------------------------
// Diagram 3: 7-Pore Radial Flower Rosette
// -------------------------------------------------------------
function makeRosetteFlowerDiagram() {
  const w = 780, h = 440;
  const content = `
  <!-- Header -->
  <text x="24" y="32" class="title">🌺 7-PORE RADIAL FLOWER ROSETTE</text>
  <text x="24" y="50" class="subtitle">High-order metazoan cluster: 6 outer somatic shields surrounding a central trophocyte hub</text>

  <!-- Left: Schematic -->
  <g transform="translate(24, 70)">
    <rect width="370" height="346" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1" />
    <text x="185" y="24" text-anchor="middle" class="label-bold" fill="#f472b6">Lattice Architecture: Center (0, 0)</text>

    <!-- Conduits (spokes + rim) -->
    <!-- Spokes from center to 6 petals -->
    <line x1="185" y1="180" x2="255" y2="180" stroke="#c084fc" stroke-width="3" />
    <line x1="185" y1="180" x2="115" y2="180" stroke="#c084fc" stroke-width="3" />
    <line x1="185" y1="180" x2="220" y2="120" stroke="#c084fc" stroke-width="3" />
    <line x1="185" y1="180" x2="150" y2="120" stroke="#c084fc" stroke-width="3" />
    <line x1="185" y1="180" x2="220" y2="240" stroke="#c084fc" stroke-width="3" />
    <line x1="185" y1="180" x2="150" y2="240" stroke="#c084fc" stroke-width="3" />

    <!-- Rim conduits between adjacent petals -->
    <polygon points="255,180 220,120 150,120 115,180 150,240 220,240" fill="rgba(192, 132, 252, 0.12)" stroke="#a855f7" stroke-width="2.5" />

    <!-- Outer 6 Hexes (Petals: Somatic Shields) -->
    <polygon points="${hexPath(255, 180, 24)}" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />
    <polygon points="${hexPath(220, 120, 24)}" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />
    <polygon points="${hexPath(150, 120, 24)}" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />
    <polygon points="${hexPath(115, 180, 24)}" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />
    <polygon points="${hexPath(150, 240, 24)}" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />
    <polygon points="${hexPath(220, 240, 24)}" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />

    <!-- Center Hex (Hub: Trophocyte) -->
    <polygon points="${hexPath(185, 180, 28)}" fill="#0f172a" stroke="#10b981" stroke-width="2.5" />
    <text x="185" y="176" text-anchor="middle" class="code" fill="#10b981">HUB</text>
    <text x="185" y="190" text-anchor="middle" class="badge" fill="#ffffff">🌾 (0,0)</text>

    <!-- Callout Labels -->
    <text x="185" y="296" text-anchor="middle" class="label-bold" fill="#38bdf8">🛡️ Outer Ring: 6 Somatic Shields</text>
    <text x="185" y="316" text-anchor="middle" class="subtitle">Shields invert pelagic toxins, feeding raw matter to hub</text>
  </g>

  <!-- Right: Invariant Properties & Equation Decoder -->
  <g transform="translate(414, 70)">
    <rect width="342" height="346" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1" />
    <text x="171" y="24" text-anchor="middle" class="label-bold" fill="#38bdf8">Topological Invariant Diagnostics</text>

    <!-- Metrics Strip -->
    <g transform="translate(16, 42)">
      <rect width="310" height="74" rx="6" fill="#0c1222" stroke="#334155" />
      <text x="14" y="24" class="label">Pores (|V|): <tspan class="code">7</tspan></text>
      <text x="160" y="24" class="label">Conduits (|E|): <tspan class="code">12</tspan></text>
      <text x="14" y="48" class="label">Hub Degree: <tspan class="code" fill="#10b981">deg(v₀) = 6</tspan></text>
      <text x="160" y="48" class="label">Petal Degree: <tspan class="code">deg(v_i) = 3</tspan></text>
      <text x="14" y="68" class="label">3-Cliques τ(G): <tspan class="code" fill="#f472b6">6 Contiguous Triangles</tspan></text>
    </g>

    <!-- Clustering Coefficient Formula Box -->
    <rect x="16" y="128" width="310" height="96" rx="6" fill="#0c1222" stroke="#00e5ff" stroke-width="1" />
    <text x="24" y="150" class="code" font-size="11.5px" fill="#00e5ff">C(G) = (1/n) · ∑ [2 e_i / (k_i(k_i - 1))]</text>
    <text x="24" y="174" class="label">Hub C(v₀) = 2(6) / (6·5) = 12 / 30 = <tspan class="code">0.40</tspan></text>
    <text x="24" y="194" class="label">Petals C(v_i) = 2(2) / (3·2) = 4 / 6 = <tspan class="code">0.67</tspan></text>
    <text x="24" y="214" class="label-bold" fill="#34d399">Mean Clustering C(G) = 0.571 (Highly Cohesive)</text>

    <!-- Biological Stakes -->
    <g transform="translate(16, 236)">
      <rect width="310" height="94" rx="6" fill="#131c31" stroke="#334155" />
      <text x="12" y="22" class="label-bold" fill="#fbbf24">🌾 Division of Labor (Lewis Wolpert GRN):</text>
      <text x="12" y="40" class="subtitle">1. Central Trophocyte is insulated from direct pelagic shear.</text>
      <text x="12" y="58" class="subtitle">2. Six Somatic Shields take toxin damage, shielding the hub.</text>
      <text x="12" y="76" class="subtitle">3. ATP produced by hub streams radially across 6 channels.</text>
    </g>
  </g>
  `;
  return svgWrapper(w, h, content);
}

// -------------------------------------------------------------
// Diagram 4: Metazoicladus wolpertii Multi-Tier 3D Architecture
// -------------------------------------------------------------
function makeMetazoicladusDiagram() {
  const w = 820, h = 460;
  const content = `
  <!-- Header -->
  <text x="24" y="32" class="title">👑 METAZOICLADUS WOLPERTII (HOLOTYPE SPECIMEN 3D ARCHITECTURE)</text>
  <text x="24" y="50" class="subtitle">Multi-stratum metazoan spanning benthic seafloor (z = 0) and subterranean fissure (z = -1)</text>

  <!-- Stratum 1: Seabed Floor (z = 0) -->
  <g transform="translate(24, 70)">
    <rect width="370" height="366" rx="8" fill="url(#cardGrad)" stroke="#38bdf8" stroke-width="1.5" />
    <rect x="0" y="0" width="370" height="28" rx="8" fill="rgba(56, 189, 248, 0.15)" />
    <text x="185" y="19" text-anchor="middle" class="badge" fill="#38bdf8">UPPER STRATUM: SEABED BENTHIC FLOOR (z = 0)</text>

    <!-- Hydrothermal Plume Flume -->
    <path d="M 60,60 Q 90,40 185,45 Q 280,50 310,60" fill="none" stroke="rgba(245, 158, 11, 0.4)" stroke-width="6" stroke-dasharray="4 4" />
    <text x="185" y="60" text-anchor="middle" class="badge" fill="#f59e0b">HYDROTHERMAL PLUME (STREAM A &amp; B)</text>

    <!-- Triangular Clique Conduits -->
    <polygon points="185,120 120,210 250,210" fill="rgba(244, 114, 182, 0.15)" stroke="#f472b6" stroke-width="3" />
    <text x="185" y="185" text-anchor="middle" class="badge" fill="#f472b6">3-CLIQUE (K₃)</text>

    <!-- P1: Trophocyte (0, 1, 0) -->
    <polygon points="${hexPath(185, 120, 32)}" fill="#0f172a" stroke="#10b981" stroke-width="2.5" />
    <text x="185" y="116" text-anchor="middle" class="code" fill="#10b981">P1 (0, 1, 0)</text>
    <text x="185" y="130" text-anchor="middle" class="badge" fill="#34d399">🌾 Trophocyte</text>

    <!-- P2: Somatic Shield (1, 0, 0) -->
    <polygon points="${hexPath(120, 210, 30)}" fill="#0f172a" stroke="#38bdf8" stroke-width="2" />
    <text x="120" y="206" text-anchor="middle" class="code" fill="#38bdf8">P2 (1, 0, 0)</text>
    <text x="120" y="220" text-anchor="middle" class="badge" fill="#7dd3fc">🛡️ Shield</text>

    <!-- P3: Somatic Shield (1, 1, 0) -->
    <polygon points="${hexPath(250, 210, 30)}" fill="#0f172a" stroke="#38bdf8" stroke-width="2" />
    <text x="250" y="206" text-anchor="middle" class="code" fill="#38bdf8">P3 (1, 1, 0)</text>
    <text x="250" y="220" text-anchor="middle" class="badge" fill="#7dd3fc">🛡️ Shield</text>

    <!-- Vertical Drop Line to Subterranean -->
    <line x1="185" y1="152" x2="185" y2="330" stroke="#c084fc" stroke-width="3" stroke-dasharray="5 3" marker-end="url(#arrow-purple)" />
    <text x="195" y="280" class="badge" fill="#c084fc">Vertical Conduit Δz = -1</text>
    <text x="185" y="350" text-anchor="middle" class="subtitle">Feeds subterranean tissues via deep basalt fissures</text>
  </g>

  <!-- Stratum 2: Subterranean Graben Fissure (z = -1) -->
  <g transform="translate(418, 70)">
    <rect width="378" height="366" rx="8" fill="url(#cardGrad)" stroke="#a855f7" stroke-width="1.5" />
    <rect x="0" y="0" width="378" height="28" rx="8" fill="rgba(168, 85, 247, 0.15)" />
    <text x="189" y="19" text-anchor="middle" class="badge" fill="#c084fc">LOWER STRATUM: SUBTERRANEAN GRABEN (z = -1)</text>

    <!-- Subterranean Conduits -->
    <line x1="120" y1="150" x2="250" y2="150" stroke="#c084fc" stroke-width="3" />

    <!-- P4: Pacemaker (0, 1, -1) -->
    <polygon points="${hexPath(120, 150, 32)}" fill="#0f172a" stroke="#f59e0b" stroke-width="2.5" />
    <text x="120" y="146" text-anchor="middle" class="code" fill="#f59e0b">P4 (0, 1, -1)</text>
    <text x="120" y="160" text-anchor="middle" class="badge" fill="#fbbf24">⚡ Pacemaker</text>

    <!-- P5: Basalt Anchor (-1, 1, -1) -->
    <polygon points="${hexPath(250, 150, 32)}" fill="#0f172a" stroke="#94a3b8" stroke-width="2" />
    <text x="250" y="146" text-anchor="middle" class="code" fill="#94a3b8">P5 (-1, 1, -1)</text>
    <text x="250" y="160" text-anchor="middle" class="badge" fill="#cbd5e1">⚓ Anchor</text>

    <!-- Functional Callouts -->
    <g transform="translate(20, 210)">
      <rect width="338" height="136" rx="6" fill="#0c1222" stroke="#334155" />
      <text x="12" y="22" class="label-bold" fill="#38bdf8">Multi-Tier Cybernetics &amp; Wolpert GRN:</text>
      <text x="12" y="44" class="subtitle">• P1 (Trophocyte) drinks high-velocity Stream A/B at nozzle.</text>
      <text x="12" y="64" class="subtitle">• P2 &amp; P3 (Shields) face cold toxic seawater, inverting poison.</text>
      <text x="12" y="84" class="subtitle">• P4 (Pacemaker) pulses clock beats up the vertical conduit.</text>
      <text x="12" y="104" class="subtitle">• P5 (Basalt Anchor) grips deep rock against hydrodynamic drag.</text>
      <text x="12" y="124" class="badge" fill="#f472b6">τ(G) = 1 (Rosette) • 4 Distinct Cell Fates from 1 Genome</text>
    </g>
  </g>
  `;
  return svgWrapper(w, h, content);
}

// -------------------------------------------------------------
// Diagram 5: Columnar Siphon Spire
// -------------------------------------------------------------
function makeColumnarSpireDiagram() {
  const w = 780, h = 440;
  const content = `
  <!-- Header -->
  <text x="24" y="32" class="title">🏛️ COLUMNAR SIPHON SPIRE TOPOLOGY</text>
  <text x="24" y="50" class="subtitle">Vertical 1D z-stack tapping velocity gradient u(z) in pelagic boundary shear layers</text>

  <!-- Left: Vertical Stacking Diagram -->
  <g transform="translate(24, 70)">
    <rect width="350" height="346" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1" />
    <text x="175" y="24" text-anchor="middle" class="label-bold" fill="#38bdf8">Planar Invariant: σ_q² = 0, σ_r² = 0</text>

    <!-- Hydrodynamic Velocity Curve u(z) -->
    <path d="M 40,290 C 70,250 100,160 130,80" fill="none" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#arrow-amber)" />
    <text x="50" y="270" class="badge" fill="#f59e0b">u(z) Boundary Layer Shear</text>

    <!-- Vertical Stacking Pores -->
    <!-- z = 3 (Apex Siphon) -->
    <polygon points="${hexPath(230, 80, 26)}" fill="#0f172a" stroke="#00e5ff" stroke-width="2" />
    <text x="230" y="78" text-anchor="middle" class="code" fill="#00e5ff">P4: z = 3</text>
    <text x="230" y="90" text-anchor="middle" class="badge" fill="#ffffff">🌾 Siphon</text>

    <!-- Conduit -->
    <line x1="230" y1="106" x2="230" y2="134" stroke="#c084fc" stroke-width="4" />

    <!-- z = 2 (Trunk) -->
    <polygon points="${hexPath(230, 150, 26)}" fill="#0f172a" stroke="#38bdf8" stroke-width="1.8" />
    <text x="230" y="148" text-anchor="middle" class="code" fill="#38bdf8">P3: z = 2</text>
    <text x="230" y="160" text-anchor="middle" class="badge" fill="#cbd5e1">Conduit</text>

    <!-- Conduit -->
    <line x1="230" y1="176" x2="230" y2="204" stroke="#c084fc" stroke-width="4" />

    <!-- z = 1 (Trunk) -->
    <polygon points="${hexPath(230, 220, 26)}" fill="#0f172a" stroke="#38bdf8" stroke-width="1.8" />
    <text x="230" y="218" text-anchor="middle" class="code" fill="#38bdf8">P2: z = 1</text>
    <text x="230" y="230" text-anchor="middle" class="badge" fill="#cbd5e1">Conduit</text>

    <!-- Conduit -->
    <line x1="230" y1="246" x2="230" y2="274" stroke="#c084fc" stroke-width="4" />

    <!-- z = 0 (Basalt Root Anchor) -->
    <polygon points="${hexPath(230, 290, 26)}" fill="#0f172a" stroke="#94a3b8" stroke-width="2" />
    <text x="230" y="288" text-anchor="middle" class="code" fill="#94a3b8">P1: z = 0</text>
    <text x="230" y="300" text-anchor="middle" class="badge" fill="#ffffff">⚓ Anchor</text>

    <!-- Basalt Bedrock Line -->
    <rect x="20" y="318" width="310" height="16" fill="#1e293b" rx="2" />
    <text x="175" y="330" text-anchor="middle" class="badge" fill="#64748b">SOLID VOLCANIC BASALT BEDROCK</text>
  </g>

  <!-- Right: Fluid Mechanics & Boundary Layer Law -->
  <g transform="translate(398, 70)">
    <rect width="358" height="346" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1" />
    <text x="179" y="24" text-anchor="middle" class="label-bold" fill="#38bdf8">Hydrodynamic Boundary Layer Law</text>

    <!-- Equation Box -->
    <rect x="16" y="40" width="326" height="66" rx="6" fill="#0c1222" stroke="#f59e0b" stroke-width="1.2" />
    <text x="179" y="66" text-anchor="middle" class="code" font-size="12.5px" fill="#f59e0b">u(z) = (u* / κ) · ln(z / z₀)</text>
    <text x="179" y="88" text-anchor="middle" class="subtitle" fill="#cbd5e1">Velocity scales logarithmically with vertical height above bedrock</text>

    <!-- Analysis Cards -->
    <g transform="translate(16, 120)">
      <rect width="326" height="64" rx="4" fill="#131c31" stroke="#334155" />
      <text x="12" y="20" class="label-bold" fill="#f43f5e">Benthic Stagnation Trap (z = 0):</text>
      <text x="12" y="38" class="subtitle">At the rock floor, fluid velocity drops to zero (no-slip condition).</text>
      <text x="12" y="54" class="subtitle">Solitary cells starve as local redox metabolites are exhausted.</text>
    </g>

    <g transform="translate(16, 194)">
      <rect width="326" height="64" rx="4" fill="#131c31" stroke="#334155" />
      <text x="12" y="20" class="label-bold" fill="#10b981">Pelagic Siphon Escape (z ≥ 2):</text>
      <text x="12" y="38" class="subtitle">By elevating apical trophocytes into the free stream, colonies</text>
      <text x="12" y="54" class="subtitle">drink fresh, un-depleted hydrothermal chemical fluxes.</text>
    </g>

    <g transform="translate(16, 268)">
      <rect width="326" height="64" rx="4" fill="rgba(56, 189, 248, 0.1)" stroke="#38bdf8" />
      <text x="12" y="20" class="label-bold" fill="#38bdf8">Diagnostic Classifier Invariant:</text>
      <text x="12" y="38" class="code" fill="#ffffff">q_i = q₀ ∧ r_i = r₀ for all i ∈ V  (n ≥ 2)</text>
      <text x="12" y="54" class="subtitle">Zero planar variance guarantees pure vertical stacking.</text>
    </g>
  </g>
  `;
  return svgWrapper(w, h, content);
}

// -------------------------------------------------------------
// Diagram 6: Dendritic Arborescent Coral
// -------------------------------------------------------------
function makeDendriticCoralDiagram() {
  const w = 800, h = 440;
  const content = `
  <!-- Header -->
  <text x="24" y="32" class="title">🌲 DENDRITIC ARBORESCENT CORAL TOPOLOGY</text>
  <text x="24" y="50" class="subtitle">Acyclic branching tree graphs exploring diverse thermal and chemical chemoclines</text>

  <!-- Left: Tree Graph Schematic -->
  <g transform="translate(24, 70)">
    <rect width="370" height="346" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1" />
    <text x="185" y="24" text-anchor="middle" class="label-bold" fill="#34d399">Branching Topology (Δ ≥ 3, τ = 0)</text>

    <!-- Branch Conduits -->
    <!-- Root to Hub -->
    <line x1="185" y1="300" x2="185" y2="210" stroke="#c084fc" stroke-width="3.5" />
    <!-- Hub to Branch 1 & 2 -->
    <line x1="185" y1="210" x2="110" y2="140" stroke="#c084fc" stroke-width="3" />
    <line x1="185" y1="210" x2="260" y2="140" stroke="#c084fc" stroke-width="3" />
    <!-- Sub-branches -->
    <line x1="110" y1="140" x2="60" y2="70" stroke="#c084fc" stroke-width="2.5" />
    <line x1="110" y1="140" x2="140" y2="70" stroke="#c084fc" stroke-width="2.5" />
    <line x1="260" y1="140" x2="230" y2="70" stroke="#c084fc" stroke-width="2.5" />
    <line x1="260" y1="140" x2="310" y2="70" stroke="#c084fc" stroke-width="2.5" />

    <!-- Terminal Leaf Scouts (Degree 1) -->
    <polygon points="${hexPath(60, 70, 18)}" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />
    <polygon points="${hexPath(140, 70, 18)}" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />
    <polygon points="${hexPath(230, 70, 18)}" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />
    <polygon points="${hexPath(310, 70, 18)}" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />
    <text x="185" y="52" text-anchor="middle" class="badge" fill="#38bdf8">🛡️ TERMINAL SOMATIC SCOUTS (deg = 1)</text>

    <!-- Branch Nodes (Degree 3) -->
    <polygon points="${hexPath(110, 140, 22)}" fill="#0f172a" stroke="#10b981" stroke-width="2" />
    <polygon points="${hexPath(260, 140, 22)}" fill="#0f172a" stroke="#10b981" stroke-width="2" />

    <!-- Central Fork Hub (Degree 3) -->
    <polygon points="${hexPath(185, 210, 26)}" fill="#0f172a" stroke="#f59e0b" stroke-width="2.5" />
    <text x="185" y="206" text-anchor="middle" class="code" fill="#f59e0b">HUB</text>
    <text x="185" y="220" text-anchor="middle" class="badge" fill="#ffffff">deg = 3</text>

    <!-- Root Anchor (Degree 1) -->
    <polygon points="${hexPath(185, 300, 24)}" fill="#0f172a" stroke="#94a3b8" stroke-width="2" />
    <text x="185" y="296" text-anchor="middle" class="code" fill="#94a3b8">ROOT</text>
    <text x="185" y="310" text-anchor="middle" class="badge" fill="#ffffff">⚓ Anchor</text>

    <text x="185" y="335" text-anchor="middle" class="subtitle">Acyclic: |E| = |V| - 1 = 8 - 1 = 7 edges</text>
  </g>

  <!-- Right: Graph Theory Invariants & Ecological Strategy -->
  <g transform="translate(418, 70)">
    <rect width="358" height="346" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1" />
    <text x="179" y="24" text-anchor="middle" class="label-bold" fill="#38bdf8">Diagnostic Invariant &amp; Graph Metrics</text>

    <!-- Equation Box -->
    <rect x="16" y="40" width="326" height="66" rx="6" fill="#0c1222" stroke="#34d399" stroke-width="1.2" />
    <text x="179" y="66" text-anchor="middle" class="code" font-size="12.5px" fill="#34d399">max(deg(v)) ≥ 3   AND   τ(G) = 0</text>
    <text x="179" y="88" text-anchor="middle" class="subtitle" fill="#cbd5e1">Branching arborization with zero mutual 3-pore triangular cliques</text>

    <!-- Metric Breakdown -->
    <g transform="translate(16, 120)">
      <rect width="326" height="96" rx="6" fill="#131c31" stroke="#334155" />
      <text x="12" y="22" class="label">Total Vertices (|V|): <tspan class="code">8</tspan></text>
      <text x="170" y="22" class="label">Total Edges (|E|): <tspan class="code">7</tspan></text>
      <text x="12" y="44" class="label">Clustering C(G): <tspan class="code">0.00 (Zero Cliques)</tspan></text>
      <text x="170" y="44" class="label">Betti γ(G): <tspan class="code">0 (Acyclic)</tspan></text>
      <text x="12" y="66" class="label">Tree Invariant: <tspan class="code" fill="#38bdf8">|E| = |V| - 1</tspan></text>
      <text x="12" y="86" class="subtitle">Maximally spans spatial volume per metabolic unit of biomass</text>
    </g>

    <!-- Ecological Role -->
    <g transform="translate(16, 230)">
      <rect width="326" height="100" rx="6" fill="#131c31" stroke="#334155" />
      <text x="12" y="22" class="label-bold" fill="#fbbf24">🌾 Ecological Niche: Chemocline Foraging</text>
      <text x="12" y="42" class="subtitle">1. Dendritic branches reach across diverse micro-thermal gradients.</text>
      <text x="12" y="62" class="subtitle">2. If one branch is poisoned by heavy metals, others continue feeding.</text>
      <text x="12" y="82" class="subtitle">3. Natural biological analog: Arborescent bryozoans and deep-sea gorgonians.</text>
    </g>
  </g>
  `;
  return svgWrapper(w, h, content);
}

// -------------------------------------------------------------
// Diagram 7: Toroidal Hexagonal Ring
// -------------------------------------------------------------
function makeToroidalRingDiagram() {
  const w = 780, h = 420;
  const content = `
  <!-- Header -->
  <text x="24" y="32" class="title">⭕ TOROIDAL HEXAGONAL RING TOPOLOGY</text>
  <text x="24" y="50" class="subtitle">1D closed loop circumnavigating an obstacle with zero terminal dead ends</text>

  <!-- Left: Schematic -->
  <g transform="translate(24, 70)">
    <rect width="360" height="326" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1" />
    <text x="180" y="24" text-anchor="middle" class="label-bold" fill="#38bdf8">Closed Loop Architecture (|E| = |V| = 6)</text>

    <!-- Central Vacant Hole / Obstacle -->
    <polygon points="${hexPath(180, 165, 36)}" fill="#070a14" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4 4" />
    <text x="180" y="162" text-anchor="middle" class="code" fill="#64748b">OBSTACLE</text>
    <text x="180" y="176" text-anchor="middle" class="badge" fill="#475569">Vacant Pore (0,0)</text>

    <!-- Ring Conduits (Closed 6-cycle) -->
    <polygon points="180,95 240,130 240,200 180,235 120,200 120,130" fill="none" stroke="#c084fc" stroke-width="4" stroke-linecap="round" />

    <!-- 6 Pores on Ring -->
    <polygon points="${hexPath(180, 95, 24)}" fill="#0f172a" stroke="#38bdf8" stroke-width="1.8" />
    <polygon points="${hexPath(240, 130, 24)}" fill="#0f172a" stroke="#38bdf8" stroke-width="1.8" />
    <polygon points="${hexPath(240, 200, 24)}" fill="#0f172a" stroke="#10b981" stroke-width="2" />
    <polygon points="${hexPath(180, 235, 24)}" fill="#0f172a" stroke="#38bdf8" stroke-width="1.8" />
    <polygon points="${hexPath(120, 200, 24)}" fill="#0f172a" stroke="#38bdf8" stroke-width="1.8" />
    <polygon points="${hexPath(120, 130, 24)}" fill="#0f172a" stroke="#f59e0b" stroke-width="2" />

    <!-- Labels -->
    <text x="240" y="204" text-anchor="middle" class="badge" fill="#10b981">🌾</text>
    <text x="120" y="134" text-anchor="middle" class="badge" fill="#f59e0b">⚡</text>

    <!-- Cytoplasmic Streaming Arrows -->
    <path d="M 195,85 Q 260,110 255,165" fill="none" stroke="#00e5ff" stroke-width="2" stroke-dasharray="3 3" marker-end="url(#arrow-cyan)" />
    <path d="M 165,245 Q 100,220 105,165" fill="none" stroke="#00e5ff" stroke-width="2" stroke-dasharray="3 3" marker-end="url(#arrow-cyan)" />
    <text x="180" y="280" text-anchor="middle" class="subtitle">Continuous bidirectional cytoplasmic streaming</text>
    <text x="180" y="298" text-anchor="middle" class="badge" fill="#00e5ff">NO DEAD ENDS • REDUNDANT SURVIVAL PATHWAYS</text>
  </g>

  <!-- Right: Invariant Math -->
  <g transform="translate(404, 70)">
    <rect width="352" height="326" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1" />
    <text x="176" y="24" text-anchor="middle" class="label-bold" fill="#38bdf8">Topological Ring Invariants</text>

    <!-- Formula Box -->
    <rect x="16" y="40" width="320" height="66" rx="6" fill="#0c1222" stroke="#00e5ff" stroke-width="1.2" />
    <text x="176" y="66" text-anchor="middle" class="code" font-size="12.5px" fill="#00e5ff">|E| ≥ |V|   AND   max(deg(v)) ≤ 2</text>
    <text x="176" y="88" text-anchor="middle" class="subtitle" fill="#cbd5e1">Every node has degree exactly 2: 2-regular simple cycle C_n</text>

    <!-- Betti Number Box -->
    <g transform="translate(16, 120)">
      <rect width="320" height="90" rx="6" fill="#131c31" stroke="#334155" />
      <text x="12" y="22" class="label-bold" fill="#c084fc">First Betti Number (Cyclomatic Rank):</text>
      <text x="12" y="44" class="code" font-size="12px" fill="#cbd5e1">γ(G) = |E| - |V| + 1 = 6 - 6 + 1 = <tspan fill="#c084fc" font-weight="bold">1</tspan></text>
      <text x="12" y="66" class="subtitle">The graph contains exactly ONE fundamental independent cycle.</text>
      <text x="12" y="82" class="subtitle">Homeomorphic to the mathematical circle S¹.</text>
    </g>

    <!-- Resiliency Comparison -->
    <g transform="translate(16, 222)">
      <rect width="320" height="88" rx="6" fill="#131c31" stroke="#334155" />
      <text x="12" y="20" class="label-bold" fill="#34d399">Predation Damage Resiliency:</text>
      <text x="12" y="38" class="subtitle">• Linear filament cut: divides into 2 isolated fragments.</text>
      <text x="12" y="56" class="subtitle">• Ring cut: degenerates gracefully into a filament (P₅).</text>
      <text x="12" y="74" class="subtitle">• All surviving cells remain connected via alternative route!</text>
    </g>
  </g>
  `;
  return svgWrapper(w, h, content);
}

// -------------------------------------------------------------
// Diagram 8: Filamentous Creeping Chain
// -------------------------------------------------------------
function makeFilamentousChainDiagram() {
  const w = 800, h = 360;
  const content = `
  <!-- Header -->
  <text x="24" y="32" class="title">🧵 FILAMENTOUS LINEAR PATH CHAIN TOPOLOGY (P_n)</text>
  <text x="24" y="50" class="subtitle">Unbranched 1D creeping chain navigating narrow volcanic basalt fissure cracks</text>

  <!-- Main Canvas Card -->
  <g transform="translate(24, 70)">
    <rect width="752" height="266" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1" />

    <!-- Rock Fissure Crack Boundaries -->
    <path d="M 30,70 L 180,60 L 360,75 L 540,65 L 720,70" fill="none" stroke="#334155" stroke-width="8" stroke-linecap="round" />
    <path d="M 30,200 L 180,210 L 360,195 L 540,205 L 720,200" fill="none" stroke="#334155" stroke-width="8" stroke-linecap="round" />
    <text x="376" y="50" text-anchor="middle" class="badge" fill="#64748b">IMPASSABLE BASALT WALL BOUNDARY</text>
    <text x="376" y="228" text-anchor="middle" class="badge" fill="#64748b">IMPASSABLE BASALT WALL BOUNDARY</text>

    <!-- Conduits (P1-P2-P3-P4-P5) -->
    <line x1="100" y1="135" x2="230" y2="135" stroke="#c084fc" stroke-width="4" />
    <line x1="230" y1="135" x2="370" y2="135" stroke="#c084fc" stroke-width="4" />
    <line x1="370" y1="135" x2="510" y2="135" stroke="#c084fc" stroke-width="4" />
    <line x1="510" y1="135" x2="650" y2="135" stroke="#c084fc" stroke-width="4" />

    <!-- P1: Tail Anchor -->
    <polygon points="${hexPath(100, 135, 28)}" fill="#0f172a" stroke="#94a3b8" stroke-width="2" />
    <text x="100" y="131" text-anchor="middle" class="code" fill="#94a3b8">P1</text>
    <text x="100" y="145" text-anchor="middle" class="badge" fill="#ffffff">⚓ Anchor</text>
    <text x="100" y="180" text-anchor="middle" class="badge" fill="#64748b">deg = 1</text>

    <!-- P2: Trunk -->
    <polygon points="${hexPath(230, 135, 28)}" fill="#0f172a" stroke="#38bdf8" stroke-width="1.8" />
    <text x="230" y="131" text-anchor="middle" class="code" fill="#38bdf8">P2</text>
    <text x="230" y="145" text-anchor="middle" class="badge" fill="#ffffff">Trunk</text>
    <text x="230" y="180" text-anchor="middle" class="badge" fill="#64748b">deg = 2</text>

    <!-- P3: Mid Pacemaker -->
    <polygon points="${hexPath(370, 135, 28)}" fill="#0f172a" stroke="#f59e0b" stroke-width="2" />
    <text x="370" y="131" text-anchor="middle" class="code" fill="#f59e0b">P3</text>
    <text x="370" y="145" text-anchor="middle" class="badge" fill="#ffffff">⚡ Pace</text>
    <text x="370" y="180" text-anchor="middle" class="badge" fill="#64748b">deg = 2</text>

    <!-- P4: Trunk -->
    <polygon points="${hexPath(510, 135, 28)}" fill="#0f172a" stroke="#38bdf8" stroke-width="1.8" />
    <text x="510" y="131" text-anchor="middle" class="code" fill="#38bdf8">P4</text>
    <text x="510" y="145" text-anchor="middle" class="badge" fill="#ffffff">Trunk</text>
    <text x="510" y="180" text-anchor="middle" class="badge" fill="#64748b">deg = 2</text>

    <!-- P5: Leading Head Scout -->
    <polygon points="${hexPath(650, 135, 28)}" fill="#0f172a" stroke="#10b981" stroke-width="2" />
    <text x="650" y="131" text-anchor="middle" class="code" fill="#10b981">P5</text>
    <text x="650" y="145" text-anchor="middle" class="badge" fill="#ffffff">🌾 Scout</text>
    <text x="650" y="180" text-anchor="middle" class="badge" fill="#64748b">deg = 1</text>

    <!-- Bottom Invariant Summary Bar -->
    <g transform="translate(40, 210)">
      <rect width="672" height="42" rx="6" fill="#0c1222" stroke="#334155" />
      <text x="24" y="26" class="label-bold" fill="#38bdf8">Invariant Criteria: <tspan class="code" fill="#00e5ff">|E| = |V| - 1 = 4</tspan>   AND   <tspan class="code" fill="#00e5ff">max(deg(v)) ≤ 2</tspan></text>
      <text x="440" y="26" class="label">Diffusion Penalty: <tspan class="code" fill="#f43f5e">t_diff ∝ n² (Maximal)</tspan></text>
    </g>
  </g>
  `;
  return svgWrapper(w, h, content);
}

// -------------------------------------------------------------
// Diagram 9: Master Morphological Classifier Flowchart
// -------------------------------------------------------------
function makeDecisionTreeDiagram() {
  const w = 840, h = 520;
  const content = `
  <!-- Header -->
  <text x="24" y="32" class="title">🌲 MASTER MORPHOLOGICAL CLASSIFICATION DECISION TREE</text>
  <text x="24" y="50" class="subtitle">Exact execution logic of SimulationWorld.classifyColonyTopology() on discrete graphs</text>

  <!-- Flowchart Container -->
  <g transform="translate(24, 70)">
    <rect width="792" height="426" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1" />

    <!-- Start Node -->
    <rect x="296" y="20" width="200" height="36" rx="18" fill="#1e293b" stroke="#00e5ff" stroke-width="1.5" />
    <text x="396" y="43" text-anchor="middle" class="code" fill="#00e5ff">INPUT: Component (n = |V|)</text>

    <line x1="396" y1="56" x2="396" y2="80" stroke="#64748b" stroke-width="2" marker-end="url(#arrow-slate)" />

    <!-- Decision 1: n <= 1? -->
    <polygon points="396,80 476,105 396,130 316,105" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5" />
    <text x="396" y="109" text-anchor="middle" class="badge" fill="#f59e0b">Is n ≤ 1?</text>

    <!-- YES: Solitary -->
    <line x1="476" y1="105" x2="570" y2="105" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow-amber)" />
    <text x="510" y="98" class="badge" fill="#f59e0b">YES</text>
    <rect x="570" y="88" width="130" height="34" rx="6" fill="#1e293b" stroke="#94a3b8" />
    <text x="635" y="109" text-anchor="middle" class="label-bold" fill="#ffffff">SOLITARY</text>

    <!-- NO: Check Columnar -->
    <line x1="396" y1="130" x2="396" y2="160" stroke="#64748b" stroke-width="2" marker-end="url(#arrow-slate)" />
    <text x="408" y="148" class="badge" fill="#94a3b8">NO</text>

    <!-- Decision 2: Columnar (q_i == q0 && r_i == r0) -->
    <polygon points="396,160 506,185 396,210 286,185" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />
    <text x="396" y="189" text-anchor="middle" class="badge" fill="#38bdf8">All qi = q₀ ∧ ri = r₀?</text>

    <!-- YES: Columnar -->
    <line x1="506" y1="185" x2="570" y2="185" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow-cyan)" />
    <text x="525" y="178" class="badge" fill="#38bdf8">YES</text>
    <rect x="570" y="168" width="130" height="34" rx="6" fill="#1e293b" stroke="#38bdf8" />
    <text x="635" y="189" text-anchor="middle" class="label-bold" fill="#38bdf8">COLUMNAR</text>

    <!-- NO: Check n == 2 -->
    <line x1="396" y1="210" x2="396" y2="240" stroke="#64748b" stroke-width="2" marker-end="url(#arrow-slate)" />
    <text x="408" y="228" class="badge" fill="#94a3b8">NO</text>

    <!-- Decision 3: Triangles tau(G) >= 1 -->
    <polygon points="396,240 506,265 396,290 286,265" fill="#0f172a" stroke="#f472b6" stroke-width="1.5" />
    <text x="396" y="269" text-anchor="middle" class="badge" fill="#f472b6">Triangles τ(G) ≥ 1?</text>

    <!-- YES: Rosette -->
    <line x1="506" y1="265" x2="570" y2="265" stroke="#f472b6" stroke-width="2" marker-end="url(#arrow-rose)" />
    <text x="525" y="258" class="badge" fill="#f472b6">YES</text>
    <rect x="570" y="248" width="130" height="34" rx="6" fill="#1e293b" stroke="#f472b6" />
    <text x="635" y="269" text-anchor="middle" class="label-bold" fill="#f472b6">ROSETTE</text>

    <!-- NO: Check Ring -->
    <line x1="396" y1="290" x2="396" y2="320" stroke="#64748b" stroke-width="2" marker-end="url(#arrow-slate)" />
    <text x="408" y="308" class="badge" fill="#94a3b8">NO</text>

    <!-- Decision 4: Ring (|E| >= n && maxDeg <= 2) -->
    <polygon points="396,320 506,345 396,370 286,345" fill="#0f172a" stroke="#00e5ff" stroke-width="1.5" />
    <text x="396" y="349" text-anchor="middle" class="badge" fill="#00e5ff">|E| ≥ n ∧ maxDeg ≤ 2?</text>

    <!-- YES: Ring -->
    <line x1="506" y1="345" x2="570" y2="345" stroke="#00e5ff" stroke-width="2" marker-end="url(#arrow-cyan)" />
    <text x="525" y="338" class="badge" fill="#00e5ff">YES</text>
    <rect x="570" y="328" width="130" height="34" rx="6" fill="#1e293b" stroke="#00e5ff" />
    <text x="635" y="349" text-anchor="middle" class="label-bold" fill="#00e5ff">RING</text>

    <!-- Branch left: Tree vs Amorphous -->
    <line x1="286" y1="345" x2="180" y2="345" stroke="#64748b" stroke-width="2" marker-end="url(#arrow-slate)" />
    <text x="230" y="338" class="badge" fill="#94a3b8">NO</text>

    <!-- Decision 5: maxDeg >= 3? -->
    <polygon points="180,320 250,345 180,370 110,345" fill="#0f172a" stroke="#10b981" stroke-width="1.5" />
    <text x="180" y="349" text-anchor="middle" class="badge" fill="#10b981">maxDeg ≥ 3?</text>

    <!-- Branch down from Decision 5 -->
    <!-- YES: Dendritic -->
    <line x1="180" y1="370" x2="180" y2="395" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-emerald)" />
    <text x="190" y="386" class="badge" fill="#10b981">YES</text>
    <rect x="115" y="395" width="130" height="26" rx="4" fill="#1e293b" stroke="#10b981" />
    <text x="180" y="412" text-anchor="middle" class="label-bold" fill="#10b981">DENDRITIC</text>

    <!-- NO: Filamentous or Amorphous -->
    <line x1="110" y1="345" x2="50" y2="345" stroke="#64748b" stroke-width="2" marker-end="url(#arrow-slate)" />
    <text x="80" y="338" class="badge" fill="#94a3b8">NO</text>
    <rect x="0" y="332" width="50" height="26" rx="4" fill="#1e293b" stroke="#cbd5e1" />
    <text x="25" y="349" text-anchor="middle" class="badge" fill="#ffffff">FIL/AM</text>
  </g>
  `;
  return svgWrapper(w, h, content);
}

// -------------------------------------------------------------
// Diagram 10: 64-Entry Degenerate Codon Architecture
// -------------------------------------------------------------
function makeCodonArchitectureDiagram() {
  const w = 840, h = 460;
  const content = `
  <!-- Header -->
  <text x="24" y="32" class="title">🧬 64-ENTRY DEGENERATE CODON &amp; TRANSLATION ARCHITECTURE</text>
  <text x="24" y="50" class="subtitle">Howard Pattee's Epistemic Cut: Inert 1D Genome Safe translated into Active 2D Logic Phenotype</text>

  <!-- Upper Card: 1D Tape Decomposition -->
  <g transform="translate(24, 70)">
    <rect width="792" height="110" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1" />
    <text x="20" y="24" class="label-bold" fill="#38bdf8">1D Inert Genome Tape (60 Bits / 10 Codons):</text>

    <!-- Codon Tape Blocks -->
    <g transform="translate(20, 36)">
      <!-- Codon 1: AND -->
      <rect x="0" y="0" width="72" height="48" rx="4" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-width="1.5" />
      <text x="36" y="20" text-anchor="middle" class="code" fill="#10b981">000000</text>
      <text x="36" y="38" text-anchor="middle" class="badge" fill="#ffffff">cypA (AND)</text>

      <!-- Codon 2: NOT -->
      <rect x="78" y="0" width="72" height="48" rx="4" fill="#f43f5e" fill-opacity="0.2" stroke="#f43f5e" stroke-width="1.5" />
      <text x="114" y="20" text-anchor="middle" class="code" fill="#f43f5e">001100</text>
      <text x="114" y="38" text-anchor="middle" class="badge" fill="#ffffff">inhB (NOT)</text>

      <!-- Codon 3: PORIN TOXIN -->
      <rect x="156" y="0" width="72" height="48" rx="4" fill="#f43f5e" fill-opacity="0.2" stroke="#f43f5e" stroke-width="1.5" />
      <text x="192" y="20" text-anchor="middle" class="code" fill="#fb7185">101100</text>
      <text x="192" y="38" text-anchor="middle" class="badge" fill="#ffffff">toxT (POR)</text>

      <!-- Codon 4: SEPTUM -->
      <rect x="234" y="0" width="72" height="48" rx="4" fill="#a855f7" fill-opacity="0.2" stroke="#a855f7" stroke-width="1.5" />
      <text x="270" y="20" text-anchor="middle" class="code" fill="#c084fc">110100</text>
      <text x="270" y="38" text-anchor="middle" class="badge" fill="#ffffff">ftsZ (SEP)</text>

      <!-- Codon 5: STREAM A -->
      <rect x="312" y="0" width="72" height="48" rx="4" fill="#f59e0b" fill-opacity="0.2" stroke="#f59e0b" stroke-width="1.5" />
      <text x="348" y="20" text-anchor="middle" class="code" fill="#fbbf24">100000</text>
      <text x="348" y="38" text-anchor="middle" class="badge" fill="#ffffff">trnS (POR_A)</text>

      <!-- Codon 6: STREAM B -->
      <rect x="390" y="0" width="72" height="48" rx="4" fill="#06b6d4" fill-opacity="0.2" stroke="#06b6d4" stroke-width="1.5" />
      <text x="426" y="20" text-anchor="middle" class="code" fill="#22d3ee">100110</text>
      <text x="426" y="38" text-anchor="middle" class="badge" fill="#ffffff">oxrB (POR_B)</text>

      <!-- Codon 7: BATTERY -->
      <rect x="468" y="0" width="72" height="48" rx="4" fill="#eab308" fill-opacity="0.2" stroke="#eab308" stroke-width="1.5" />
      <text x="504" y="20" text-anchor="middle" class="code" fill="#fde047">110010</text>
      <text x="504" y="38" text-anchor="middle" class="badge" fill="#ffffff">atpS (BAT)</text>

      <!-- Codons 8-10: INTRONS -->
      <rect x="546" y="0" width="206" height="48" rx="4" fill="#334155" fill-opacity="0.3" stroke="#64748b" stroke-width="1.5" />
      <text x="649" y="20" text-anchor="middle" class="code" fill="#94a3b8">111000 111000 111000</text>
      <text x="649" y="38" text-anchor="middle" class="badge" fill="#cbd5e1">3x SILENT KIMURA INTRONS</text>
    </g>
    <text x="20" y="100" class="subtitle">Translation is strictly functional: 6 bits ──► 1 biophysical primitive (zero execution side-effects)</text>
  </g>

  <!-- Lower Card: Epistemic Cut (Howard Pattee) -->
  <g transform="translate(24, 196)">
    <rect width="792" height="240" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1" />

    <!-- Left Box: Genome Safe -->
    <g transform="translate(20, 20)">
      <rect width="320" height="200" rx="6" fill="#0c1222" stroke="#38bdf8" stroke-width="1.2" />
      <text x="160" y="26" text-anchor="middle" class="label-bold" fill="#38bdf8">🔒 THE SAFE (INERT RECIPIENT)</text>
      <text x="160" y="44" text-anchor="middle" class="subtitle">Howard Pattee's Symbolic Epistemic Cut</text>

      <path d="M 40,70 L 280,70" stroke="#334155" stroke-width="1" />
      <text x="20" y="92" class="subtitle">• Never executes logic; never consumes ATP.</text>
      <text x="20" y="112" class="subtitle">• Pure read-only physical tape.</text>
      <text x="20" y="132" class="subtitle">• Blind template photocopied during cytokinesis.</text>
      <text x="20" y="152" class="subtitle">• Protected from Lamarckian metabolic corruption.</text>
      <text x="20" y="176" class="code" fill="#00e5ff">safe.photocopy(mutationRate)</text>
    </g>

    <!-- Center Arrow: Translation Step -->
    <g transform="translate(350, 95)">
      <line x1="0" y1="20" x2="80" y2="20" stroke="#c084fc" stroke-width="3" marker-end="url(#arrow-purple)" />
      <text x="40" y="10" text-anchor="middle" class="badge" fill="#c084fc">CodonTranslator</text>
      <text x="40" y="38" text-anchor="middle" class="badge" fill="#94a3b8">translateTape()</text>
    </g>

    <!-- Right Box: Pore Workshop -->
    <g transform="translate(442, 20)">
      <rect width="330" height="200" rx="6" fill="#0c1222" stroke="#10b981" stroke-width="1.2" />
      <text x="165" y="26" text-anchor="middle" class="label-bold" fill="#10b981">⚙️ THE WORKSHOP (PHENOTYPIC LOGIC)</text>
      <text x="165" y="44" text-anchor="middle" class="subtitle">2D Active Netlist &amp; Metabolic Enzyme Machine</text>

      <path d="M 40,70 L 290,70" stroke="#334155" stroke-width="1" />
      <text x="20" y="92" class="subtitle">• Evaluates logic gates &amp; porin flux every tick.</text>
      <text x="20" y="112" class="subtitle">• Burns Landauer switching power (k_B T ln 2).</text>
      <text x="20" y="132" class="subtitle">• Charges mineral battery (+2T energy yield).</text>
      <text x="20" y="152" class="subtitle">• Drives cell differentiation via spatial boundary inputs.</text>
      <text x="20" y="176" class="code" fill="#10b981">workshop.stepTick(streamA, streamB)</text>
    </g>
  </g>
  `;
  return svgWrapper(w, h, content);
}

// -------------------------------------------------------------
// Diagram 11: Tale of Two Pores Differential Expression
// -------------------------------------------------------------
function makeDifferentialExpressionDiagram() {
  const w = 840, h = 500;
  const content = `
  <!-- Header -->
  <text x="24" y="32" class="title">🌾 A TALE OF TWO PORES: SPATIAL GENE REGULATION IN SILICO</text>
  <text x="24" y="50" class="subtitle">Identical 60-bit clonal genome yielding opposite cellular phenotypes via Wolpertian boundary inputs</text>

  <!-- Hydrothermal Plume Arrow (Top) -->
  <g transform="translate(24, 66)">
    <rect width="792" height="40" rx="6" fill="#131c31" stroke="#f59e0b" stroke-width="1" />
    <text x="396" y="24" text-anchor="middle" class="label-bold" fill="#fbbf24">🌋 HYDROTHERMAL MORPHOGEN FIELD: Stream A (Protons) decays radially with distance</text>
  </g>

  <!-- Left: Pore 1 (Vent Core Trophocyte) -->
  <g transform="translate(24, 118)">
    <rect width="384" height="358" rx="8" fill="url(#cardGrad)" stroke="#10b981" stroke-width="1.5" />
    <rect x="0" y="0" width="384" height="28" rx="8" fill="rgba(16, 185, 129, 0.2)" />
    <text x="192" y="19" text-anchor="middle" class="label-bold" fill="#10b981">PORE 1 (0, 1, 0) — VENT CORE (d = 1 ≤ 2)</text>

    <!-- Inputs Strip -->
    <g transform="translate(16, 40)">
      <rect width="352" height="42" rx="4" fill="#0c1222" stroke="#334155" />
      <text x="12" y="18" class="badge" fill="#fbbf24">Stream A: 1 (HIGH)</text>
      <text x="130" y="18" class="badge" fill="#22d3ee">Stream B: 1 (HIGH)</text>
      <text x="250" y="18" class="badge" fill="#10b981">Toxin: 0 (SAFE)</text>
      <text x="12" y="34" class="subtitle">High electron donor concentration near vent mouth</text>
    </g>

    <!-- Logic Evaluation -->
    <g transform="translate(16, 94)">
      <!-- Gate 1: AND -->
      <rect x="0" y="0" width="352" height="66" rx="6" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" stroke-width="1.2" />
      <text x="16" y="24" class="label-bold" fill="#10b981">Gene 1 (GATE_AND): cypA</text>
      <text x="16" y="44" class="code" fill="#34d399">inA=1, inB=1 ──► 1 AND 1 = OUTPUT 1 (EXPRESSED 🟢)</text>
      <text x="16" y="58" class="subtitle">Synthesizes +2T energy tokens per tick</text>

      <!-- Gate 2: NOT -->
      <rect x="0" y="76" width="352" height="66" rx="6" fill="rgba(244, 63, 94, 0.08)" stroke="#f43f5e" stroke-width="1" />
      <text x="16" y="100" class="label-bold" fill="#fb7185">Gene 2 (GATE_NOT): inhB</text>
      <text x="16" y="120" class="code" fill="#f43f5e">inA=1 (from Gate 1) ──► NOT(1) = OUTPUT 0 (REPRESSED 🔴)</text>
      <text x="16" y="134" class="subtitle">Allosteric inhibitor suppressed by high fuel flow</text>
    </g>

    <!-- Phenotypic Role Box -->
    <g transform="translate(16, 250)">
      <rect width="352" height="94" rx="6" fill="#0c1222" stroke="#10b981" stroke-width="1.5" />
      <text x="176" y="26" text-anchor="middle" class="title" fill="#10b981">🌾 TROPHOCYTE (VENT FEEDER)</text>
      <text x="176" y="50" text-anchor="middle" class="subtitle">• Generates +2T ATP surplus per cycle.</text>
      <text x="176" y="68" text-anchor="middle" class="subtitle">• Pumps energy across purple conduits to partner cells.</text>
      <text x="176" y="86" text-anchor="middle" class="badge" fill="#34d399">PRIMARY PRODUCER CELL FATE</text>
    </g>
  </g>

  <!-- Right: Pore 2 (Periphery Somatic Shield) -->
  <g transform="translate(432, 118)">
    <rect width="384" height="358" rx="8" fill="url(#cardGrad)" stroke="#38bdf8" stroke-width="1.5" />
    <rect x="0" y="0" width="384" height="28" rx="8" fill="rgba(56, 189, 248, 0.2)" />
    <text x="192" y="19" text-anchor="middle" class="label-bold" fill="#38bdf8">PORE 2 (2, 2, 0) — PERIPHERY (d = 4 &gt; 2)</text>

    <!-- Inputs Strip -->
    <g transform="translate(16, 40)">
      <rect width="352" height="42" rx="4" fill="#0c1222" stroke="#334155" />
      <text x="12" y="18" class="badge" fill="#64748b">Stream A: 0 (DEPLETED)</text>
      <text x="150" y="18" class="badge" fill="#64748b">Stream B: 0</text>
      <text x="250" y="18" class="badge" fill="#f43f5e">Toxin: 1 (POISON)</text>
      <text x="12" y="34" class="subtitle">Fuel stripped by upstream cells; pelagic toxin contacts rim</text>
    </g>

    <!-- Logic Evaluation -->
    <g transform="translate(16, 94)">
      <!-- Gate 1: AND -->
      <rect x="0" y="0" width="352" height="66" rx="6" fill="rgba(244, 63, 94, 0.08)" stroke="#f43f5e" stroke-width="1" />
      <text x="16" y="24" class="label-bold" fill="#fb7185">Gene 1 (GATE_AND): cypA</text>
      <text x="16" y="44" class="code" fill="#f43f5e">inA=0, inB=0 ──► 0 AND 0 = OUTPUT 0 (REPRESSED 🔴)</text>
      <text x="16" y="58" class="subtitle">Co-catalysis shut down due to absence of substrate</text>

      <!-- Gate 2: NOT -->
      <rect x="0" y="76" width="352" height="66" rx="6" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="1.2" />
      <text x="16" y="100" class="label-bold" fill="#38bdf8">Gene 2 (GATE_NOT): inhB</text>
      <text x="16" y="120" class="code" fill="#38bdf8">inA=0 (from Gate 1) ──► NOT(0) = OUTPUT 1 (EXPRESSED 🟢)</text>
      <text x="16" y="134" class="subtitle">Allosteric inverter relieves inhibition; activates defense</text>
    </g>

    <!-- Phenotypic Role Box -->
    <g transform="translate(16, 250)">
      <rect width="352" height="94" rx="6" fill="#0c1222" stroke="#38bdf8" stroke-width="1.5" />
      <text x="176" y="26" text-anchor="middle" class="title" fill="#38bdf8">🛡️ SOMATIC SHIELD (TOXIN INVERTER)</text>
      <text x="176" y="50" text-anchor="middle" class="subtitle">• Consumes shared energy to neutralize acidic toxins.</text>
      <text x="176" y="68" text-anchor="middle" class="subtitle">• Shields inner trophocytes from lethal -5T corrosion.</text>
      <text x="176" y="86" text-anchor="middle" class="badge" fill="#38bdf8">PROTECTIVE SOMATIC CELL FATE</text>
    </g>
  </g>
  `;
  return svgWrapper(w, h, content);
}

// -------------------------------------------------------------
// Diagram 12: Waddington Epigenetic Landscape & Attractor Basins
// -------------------------------------------------------------
function makeAttractorLandscapeDiagram() {
  const w = 820, h = 440;
  const content = `
  <!-- Header -->
  <text x="24" y="32" class="title">⛰️ CONRAD WADDINGTON'S EPIGENETIC LANDSCAPE IN SILICON</text>
  <text x="24" y="50" class="subtitle">Bifurcating canalized valleys (chreods) carving phase space into stable developmental attractors</text>

  <!-- Left: Contoured Landscape Graphic -->
  <g transform="translate(24, 70)">
    <rect width="400" height="346" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1" />
    <text x="200" y="24" text-anchor="middle" class="label-bold" fill="#c084fc">Epigenetic Bifurcation Surface</text>

    <!-- Contoured Hill Curves -->
    <path d="M 40,260 Q 120,290 200,260 Q 280,290 360,260" fill="none" stroke="#334155" stroke-width="2" />
    <path d="M 60,200 Q 130,240 200,200 Q 270,240 340,200" fill="none" stroke="#475569" stroke-width="2" />
    <path d="M 90,140 Q 145,180 200,140 Q 255,180 310,140" fill="none" stroke="#64748b" stroke-width="2" />

    <!-- Apex Ball: Clonal Undifferentiated Embryonic Cell -->
    <circle cx="200" cy="80" r="16" fill="url(#purpleGrad)" stroke="#ffffff" stroke-width="2" />
    <text x="200" y="84" text-anchor="middle" class="badge" fill="#ffffff">DNA</text>
    <text x="200" y="56" text-anchor="middle" class="label-bold" fill="#c084fc">Clonal Embryonic Cell</text>

    <!-- Trajectory Arrows rolling into 2 valleys -->
    <!-- Left Valley: Trophocyte -->
    <path d="M 190,95 Q 140,150 110,230" fill="none" stroke="#10b981" stroke-width="3" stroke-dasharray="4 3" marker-end="url(#arrow-emerald)" />
    <circle cx="110" cy="245" r="22" fill="#0f172a" stroke="#10b981" stroke-width="2.5" />
    <text x="110" y="242" text-anchor="middle" class="code" fill="#10b981">A₁</text>
    <text x="110" y="255" text-anchor="middle" class="badge" fill="#34d399">🌾 Troph</text>
    <text x="110" y="284" text-anchor="middle" class="subtitle" fill="#10b981">Valley 1: AND = 1</text>
    <text x="110" y="300" text-anchor="middle" class="badge" fill="#64748b">Plume High</text>

    <!-- Right Valley: Somatic Shield -->
    <path d="M 210,95 Q 260,150 290,230" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="4 3" marker-end="url(#arrow-cyan)" />
    <circle cx="290" cy="245" r="22" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5" />
    <text x="290" y="242" text-anchor="middle" class="code" fill="#38bdf8">A₂</text>
    <text x="290" y="255" text-anchor="middle" class="badge" fill="#7dd3fc">🛡️ Shield</text>
    <text x="290" y="284" text-anchor="middle" class="subtitle" fill="#38bdf8">Valley 2: NOT = 1</text>
    <text x="290" y="300" text-anchor="middle" class="badge" fill="#64748b">Pelagic Rim</text>

    <!-- Invariant label -->
    <text x="200" y="330" text-anchor="middle" class="badge" fill="#cbd5e1">CANALIZATION: ROBUST AGAINST THERMAL NOISE</text>
  </g>

  <!-- Right: Dynamical Systems Math -->
  <g transform="translate(444, 70)">
    <rect width="352" height="346" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1" />
    <text x="176" y="24" text-anchor="middle" class="label-bold" fill="#38bdf8">Dynamical Attractor Formulation</text>

    <!-- Formula Box -->
    <rect x="16" y="40" width="320" height="74" rx="6" fill="#0c1222" stroke="#c084fc" stroke-width="1.2" />
    <text x="176" y="66" text-anchor="middle" class="code" font-size="12px" fill="#c084fc">x⃗(t + 1) = F(x⃗(t), u⃗(t))</text>
    <text x="176" y="90" text-anchor="middle" class="subtitle" fill="#cbd5e1">Boundary vector u⃗ tilts the landscape without mutating the DNA</text>

    <!-- Basin Volume Breakdown -->
    <g transform="translate(16, 126)">
      <rect width="320" height="96" rx="6" fill="#131c31" stroke="#334155" />
      <text x="12" y="20" class="label-bold" fill="#f59e0b">Phase Space Basin Partitioning:</text>
      <text x="12" y="40" class="label">• Basin B(A₁) [Trophocyte]: <tspan class="code" fill="#10b981">44% of phase space</tspan></text>
      <text x="12" y="60" class="label">• Basin B(A₂) [Somatic Shield]: <tspan class="code" fill="#38bdf8">42% of phase space</tspan></text>
      <text x="12" y="80" class="label">• Transient Oscillation: <tspan class="code" fill="#64748b">14% (rapidly decays)</tspan></text>
    </g>

    <!-- Why It Evolves Fast Box -->
    <g transform="translate(16, 234)">
      <rect width="320" height="96" rx="6" fill="rgba(192, 132, 252, 0.1)" stroke="#c084fc" stroke-width="1" />
      <text x="12" y="20" class="label-bold" fill="#c084fc">Why Does Multicellularity Evolve So Fast?</text>
      <text x="12" y="38" class="subtitle">Because the attractor basins partition &gt;85% of phase</text>
      <text x="12" y="54" class="subtitle">space, any random 2-gate genome with AND + NOT</text>
      <text x="12" y="70" class="subtitle">automatically tumbles into differentiation for free!</text>
      <text x="12" y="88" class="badge" fill="#34d399">NO FINE-TUNING REQUIRED • EMERGENCE IN SILICO</text>
    </g>
  </g>
  `;
  return svgWrapper(w, h, content);
}

// -------------------------------------------------------------
// Diagram 13: Phase Space Trajectories & Boolean Network Graph
// -------------------------------------------------------------
function makePhaseSpaceTrajectoriesDiagram() {
  const w = 840, h = 460;
  const content = `
  <!-- Header -->
  <text x="24" y="32" class="title">🌌 BOOLEAN NETWORK PHASE SPACE &amp; ATTRACTOR CONVERGENCE</text>
  <text x="24" y="50" class="subtitle">Stuart Kauffman's K = 2 Critical Boundary: 64 microstates collapsing into 2 stable limit cycles</text>

  <!-- Left: State Transition Graph (State Space 2^6) -->
  <g transform="translate(24, 70)">
    <rect width="400" height="366" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1" />
    <text x="200" y="24" text-anchor="middle" class="label-bold" fill="#38bdf8">State Transition Graph (64 Microstates)</text>

    <!-- Basin 1: Trophocyte Attractor (Green Cluster) -->
    <rect x="20" y="44" width="170" height="260" rx="8" fill="rgba(16, 185, 129, 0.08)" stroke="#10b981" stroke-dasharray="3 3" />
    <text x="105" y="66" text-anchor="middle" class="badge" fill="#10b981">BASIN 1: TROPHOCYTE (44%)</text>

    <!-- Attractor Center A1 -->
    <circle cx="105" cy="170" r="28" fill="#0f172a" stroke="#10b981" stroke-width="2.5" />
    <text x="105" y="166" text-anchor="middle" class="code" font-size="12px" fill="#10b981">[1, 0, 1]</text>
    <text x="105" y="180" text-anchor="middle" class="badge" fill="#ffffff">ATTRACTOR A₁</text>

    <!-- Inflowing Trajectories -->
    <circle cx="50" cy="110" r="10" fill="#1e293b" stroke="#34d399" />
    <line x1="58" y1="116" x2="88" y2="148" stroke="#10b981" stroke-width="1.5" marker-end="url(#arrow-emerald)" />

    <circle cx="160" cy="110" r="10" fill="#1e293b" stroke="#34d399" />
    <line x1="152" y1="116" x2="122" y2="148" stroke="#10b981" stroke-width="1.5" marker-end="url(#arrow-emerald)" />

    <circle cx="50" cy="230" r="10" fill="#1e293b" stroke="#34d399" />
    <line x1="58" y1="224" x2="88" y2="192" stroke="#10b981" stroke-width="1.5" marker-end="url(#arrow-emerald)" />

    <circle cx="160" cy="230" r="10" fill="#1e293b" stroke="#34d399" />
    <line x1="152" y1="224" x2="122" y2="192" stroke="#10b981" stroke-width="1.5" marker-end="url(#arrow-emerald)" />

    <!-- Basin 2: Somatic Shield Attractor (Blue Cluster) -->
    <rect x="210" y="44" width="170" height="260" rx="8" fill="rgba(56, 189, 248, 0.08)" stroke="#38bdf8" stroke-dasharray="3 3" />
    <text x="295" y="66" text-anchor="middle" class="badge" fill="#38bdf8">BASIN 2: SHIELD (42%)</text>

    <!-- Attractor Center A2 -->
    <circle cx="295" cy="170" r="28" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5" />
    <text x="295" y="166" text-anchor="middle" class="code" font-size="12px" fill="#38bdf8">[0, 1, 0]</text>
    <text x="295" y="180" text-anchor="middle" class="badge" fill="#ffffff">ATTRACTOR A₂</text>

    <!-- Inflowing Trajectories -->
    <circle cx="240" cy="110" r="10" fill="#1e293b" stroke="#38bdf8" />
    <line x1="248" y1="116" x2="278" y2="148" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arrow-cyan)" />

    <circle cx="350" cy="110" r="10" fill="#1e293b" stroke="#38bdf8" />
    <line x1="342" y1="116" x2="312" y2="148" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arrow-cyan)" />

    <circle cx="240" cy="230" r="10" fill="#1e293b" stroke="#38bdf8" />
    <line x1="248" y1="224" x2="278" y2="192" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arrow-cyan)" />

    <circle cx="350" cy="230" r="10" fill="#1e293b" stroke="#38bdf8" />
    <line x1="342" y1="224" x2="312" y2="192" stroke="#38bdf8" stroke-width="1.5" marker-end="url(#arrow-cyan)" />

    <text x="200" y="335" text-anchor="middle" class="subtitle">All 64 microstates collapse into A₁ or A₂ within 2 discrete ticks</text>
  </g>

  <!-- Right: Stuart Kauffman's NK Theory -->
  <g transform="translate(444, 70)">
    <rect width="372" height="366" rx="8" fill="url(#cardGrad)" stroke="#334155" stroke-width="1" />
    <text x="186" y="24" text-anchor="middle" class="label-bold" fill="#38bdf8">Stuart Kauffman's NK Boolean Network Theory</text>

    <!-- 3 Regimes Comparison Box -->
    <g transform="translate(16, 42)">
      <rect width="340" height="150" rx="6" fill="#0c1222" stroke="#334155" />
      <text x="14" y="22" class="label-bold" fill="#f43f5e">1. K &gt; 2 (Chaotic Regime):</text>
      <text x="14" y="38" class="subtitle">Trajectories wander across 2^N states. Sensitive to tiny noise.</text>

      <text x="14" y="66" class="label-bold" fill="#64748b">2. K &lt; 2 (Frozen Regime):</text>
      <text x="14" y="82" class="subtitle">Nodes lock into constant values. Inactive, unresponsive circuits.</text>

      <text x="14" y="110" class="label-bold" fill="#10b981">3. K = 2 (Critical Boundary — "Edge of Chaos"):</text>
      <text x="14" y="126" class="subtitle">State space collapses into tiny number of attractors (~√N).</text>
      <text x="14" y="142" class="code" fill="#00e5ff">Siliquarium 2-input logic gates natively operate at K = 2!</text>
    </g>

    <!-- Lyapunov Stability Box -->
    <g transform="translate(16, 204)">
      <rect width="340" height="146" rx="6" fill="#131c31" stroke="#334155" />
      <text x="14" y="22" class="label-bold" fill="#c084fc">Lyapunov Stability &amp; Epigenetic Homeostasis:</text>
      <text x="14" y="42" class="subtitle">• Maximal Lyapunov Exponent λ &lt; 0 in each basin.</text>
      <text x="14" y="62" class="subtitle">• Perturbations (e.g. thermal vent flickers) dissipate rapidly.</text>
      <text x="14" y="82" class="subtitle">• The tissue fate is self-healing: a Trophocyte kicked into a</text>
      <text x="14" y="98" class="subtitle">  transient state recovers its co-catalytic output in next tick.</text>
      <text x="14" y="124" class="badge" fill="#38bdf8">THERMODYNAMICALLY CANALIZED DIFFERENTIATION</text>
    </g>
  </g>
  `;
  return svgWrapper(w, h, content);
}

// -------------------------------------------------------------
// Main Generator Execution
// -------------------------------------------------------------
const diagrams = [
  { name: 'fig_morph_01_hex_metric.svg', fn: makeHexMetricDiagram },
  { name: 'fig_morph_02_rosette_minimal.svg', fn: makeRosetteMinimalDiagram },
  { name: 'fig_morph_03_rosette_flower.svg', fn: makeRosetteFlowerDiagram },
  { name: 'fig_morph_04_rosette_metazoicladus.svg', fn: makeMetazoicladusDiagram },
  { name: 'fig_morph_05_columnar_spire.svg', fn: makeColumnarSpireDiagram },
  { name: 'fig_morph_06_dendritic_coral.svg', fn: makeDendriticCoralDiagram },
  { name: 'fig_morph_07_toroidal_ring.svg', fn: makeToroidalRingDiagram },
  { name: 'fig_morph_08_filamentous_chain.svg', fn: makeFilamentousChainDiagram },
  { name: 'fig_morph_09_decision_tree.svg', fn: makeDecisionTreeDiagram },
  { name: 'fig_grn_01_codon_architecture.svg', fn: makeCodonArchitectureDiagram },
  { name: 'fig_grn_02_differential_expression.svg', fn: makeDifferentialExpressionDiagram },
  { name: 'fig_grn_03_attractor_landscape.svg', fn: makeAttractorLandscapeDiagram },
  { name: 'fig_grn_04_phase_space_trajectories.svg', fn: makePhaseSpaceTrajectoriesDiagram }
];

console.log('==================================================');
console.log('🎨 Generating Siliquarium Morphology & GRN SVGs...');
console.log('==================================================');

for (const d of diagrams) {
  const filePath = path.join(diagramsDir, d.name);
  const svgContent = d.fn();
  fs.writeFileSync(filePath, svgContent, 'utf-8');
  console.log(`  ✓ Generated: docs/assets/diagrams/${d.name}`);
}

console.log('==================================================');
console.log('🎉 ALL 13 PUBLICATION-GRADE SVGs GENERATED SUCCESSFULLY!');
console.log('==================================================');
