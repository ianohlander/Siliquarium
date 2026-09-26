#!/usr/bin/env node

/**
 * 🐠 Siliquarium Native Zero-Dependency Markdown to HTML Documentation Compiler
 * Generates self-contained, responsive, enterprise-grade abyssal-themed HTML documents
 * built on Tailwind CSS, MathJax 3, and a Two-Column Categorized Sidebar + Top Dropdown layout.
 * Eliminates all horizontal scrollbars in favor of clean, categorized vertical navigation.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const NAV_CATEGORIES = [
  {
    name: 'Curriculum & Pedagogy',
    icon: '🎓',
    items: [
      { id: 'index', title: 'Portal Overview', href: 'index.html', icon: '🐠', desc: 'Curriculum portal & modular index' },
      { id: 'syllabus', title: 'Course Syllabus', href: 'CURRICULUM_AND_SYLLABUS.html', icon: '📜', desc: 'Syllabus, philosophy & symbol index' },
      { id: 'unit1', title: 'Unit 1: Prebiotic Vents', href: 'curriculum/unit1_prebiotic_threshold.html', icon: '🌋', desc: "Alkaline vents, chemiosmosis & Pattee's cut" },
      { id: 'unit2', title: 'Unit 2: Logic of Life', href: 'curriculum/unit2_logic_of_life.html', icon: '⚡', desc: 'Primitive enzymes & XOR impossibility proof' },
      { id: 'unit3', title: 'Unit 3: Systems Motifs', href: 'curriculum/unit3_systems_biology_motifs.html', icon: '🕸️', desc: 'Uri Alon motifs & Weisfeiler-Lehman hashes' },
      { id: 'unit4', title: 'Unit 4: Macro-Evolution', href: 'curriculum/unit4_evolutionary_dynamics.html', icon: '🧬', desc: 'Kimura drift, convergent homoplasy & LTEE' },
      { id: 'practicums', title: 'Student Lab Manual', href: 'curriculum/practicums_lab_manual.html', icon: '🧪', desc: '5 hands-on labs & formative assessments' },
      { id: 'pedagogy', title: 'Companion Portal', href: 'PEDAGOGICAL_COMPANION_SUITE.html', icon: '🏛️', desc: 'Master portal & assessment rubrics' },
      { id: 'glossary', title: 'Lexicon & Glossary', href: 'companion/glossary.html', icon: '📖', desc: '55-term systems biology lexicon' },
      { id: 'study-guides', title: 'Study Guides & Decoders', href: 'companion/study_guides.html', icon: '🧭', desc: '8 equation decoders & derivations' },
      { id: 'bibliography', title: 'Annotated Bibliography', href: 'companion/bibliography.html', icon: '📚', desc: '14 foundational primary papers' },
      { id: 'qa-report', title: 'Student QA Report', href: 'QA/STUDENT_UX_REPORT.html', icon: '🔍', desc: '12th-grade usability audit & screenshots' }
    ]
  },
  {
    name: 'Biophysical Theory',
    icon: '🌊',
    items: [
      { id: 'theory', title: 'Theoretical Model', href: 'THEORETICAL_MODEL.html', icon: '🌊', desc: '21 sealed sections & thermodynamic laws' },
      { id: 'epistemic', title: 'Epistemic Foundations', href: 'EPISTEMIC_FOUNDATIONS.html', icon: '🧬', desc: "Howard Pattee's Epistemic Cut & defenses" },
      { id: 'design-principles', title: 'Design Principles', href: 'DOCUMENTATION_DESIGN_PRINCIPLES.html', icon: '📐', desc: 'Documentation & UI/UX architecture' }
    ]
  },
  {
    name: 'Laboratory Guides',
    icon: '🔬',
    items: [
      { id: 'phase3', title: '3D Seafloor Visualizer', href: 'PHASE_3_VISUALIZER_GUIDE.html', icon: '🔬', desc: 'Bathymetry, orbit camera & circuit microscope' },
      { id: 'phase4', title: 'Paleontology & Motifs', href: 'PHASE_4_PALEONTOLOGY_GUIDE.html', icon: '🦕', desc: 'Weisfeiler-Lehman hashes & fossil freezer' },
      { id: 'phase5', title: 'Pelagic Spores & Controls', href: 'PHASE_5_PELAGIC_SPORES_GUIDE.html', icon: '🌊', desc: 'Buoyant spore drift & God-suite parameters' },
      { id: 'phase6', title: 'Phylogeny & Dynamics', href: 'PHASE_6_EVOLUTIONARY_DYNAMICS_GUIDE.html', icon: '🧬', desc: 'Multi-lineage clades & Lenski benchmarks' }
    ]
  },
  {
    name: 'Visuals & Identity',
    icon: '🎨',
    items: [
      { id: 'brand', title: 'Brand Identity', href: 'BRAND_IDENTITY.html', icon: '🎨', desc: 'Visual philosophy & biomorphic styling' },
      { id: 'logos', title: 'Logo Gallery', href: 'logos.html', icon: '🖼️', desc: 'High-res Fibonacci nautilus asset suite' }
    ]
  }
];

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-');
}

function parseMarkdown(md, currentDocId) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let inCodeBlock = false;
  let codeLang = '';
  let codeLines = [];
  let inTable = false;
  let tableHeader = [];
  let tableRows = [];
  let inList = false;
  let listType = 'ul';

  function closeList() {
    if (inList) {
      out.push(`</${listType}>`);
      inList = false;
    }
  }

  function closeTable() {
    if (inTable) {
      let tHtml = '<div class="overflow-x-auto my-6 rounded-xl border border-slate-800 bg-slate-900/60 shadow-inner"><table class="w-full text-left text-sm font-sans border-collapse"><thead><tr class="bg-slate-950/80 border-b border-slate-800 text-slate-100 font-mono text-xs uppercase tracking-wider">';
      for (const th of tableHeader) {
        tHtml += `<th class="p-3.5 font-semibold">${inlineFormat(th.trim(), currentDocId)}</th>`;
      }
      tHtml += '</tr></thead><tbody class="divide-y divide-slate-800/60 text-slate-300">';
      for (const row of tableRows) {
        tHtml += '<tr class="hover:bg-slate-800/30 transition-colors">';
        for (const td of row) {
          tHtml += `<td class="p-3.5 leading-relaxed">${inlineFormat(td.trim(), currentDocId)}</td>`;
        }
        tHtml += '</tr>';
      }
      tHtml += '</tbody></table></div>';
      out.push(tHtml);
      inTable = false;
      tableHeader = [];
      tableRows = [];
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Code blocks
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        if (codeLang === 'mermaid') {
          out.push(`<div class="mermaid p-4 rounded-xl bg-slate-950/80 border border-slate-800 my-6 overflow-x-auto text-xs font-mono text-cyan-300">${escapeHtml(codeLines.join('\n'))}</div>`);
        } else {
          out.push(`<pre class="p-4 rounded-xl bg-slate-950/90 border border-slate-800 my-6 overflow-x-auto text-xs font-mono text-slate-200 shadow-inner"><code class="language-${codeLang}">${escapeHtml(codeLines.join('\n'))}</code></pre>`);
        }
        inCodeBlock = false;
        codeLines = [];
      } else {
        closeList();
        closeTable();
        inCodeBlock = true;
        codeLang = trimmed.slice(3).trim() || 'text';
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(rawLine);
      continue;
    }

    // Horizontal Rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      closeList();
      closeTable();
      out.push('<hr class="border-t border-slate-800 my-8" />');
      continue;
    }

    // Blank line
    if (!trimmed) {
      closeList();
      closeTable();
      continue;
    }

    // Tables
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      closeList();
      const cells = trimmed.split('|').slice(1, -1);
      if (!inTable) {
        inTable = true;
        tableHeader = cells;
      } else if (cells.every(c => /^[\s:-]+$/.test(c))) {
        // separator row, skip
      } else {
        tableRows.push(cells);
      }
      continue;
    } else {
      closeTable();
    }

    // Blockquotes & Semantic Alerts
    if (trimmed.startsWith('>')) {
      closeList();
      let quoteText = trimmed.replace(/^>\s?/, '');
      let alertType = 'default';

      if (quoteText.startsWith('[!ANALOGY]') || quoteText.startsWith('[!EVERYDAY ANALOGY]')) {
        alertType = 'analogy';
        quoteText = quoteText.replace(/\[!(ANALOGY|EVERYDAY ANALOGY)\]\s?/, '');
      } else if (quoteText.startsWith('[!CHECKPOINT]') || quoteText.startsWith('[!CONCEPT CHECKPOINT]')) {
        alertType = 'checkpoint';
        quoteText = quoteText.replace(/\[!(CHECKPOINT|CONCEPT CHECKPOINT)\]\s?/, '');
      } else if (quoteText.startsWith('[!ANALYSIS]') || quoteText.startsWith('[!PILLARS]')) {
        alertType = 'analysis';
        quoteText = quoteText.replace(/\[!(ANALYSIS|PILLARS)\]\s?/, '');
      } else if (quoteText.startsWith('[!NOTE]')) {
        alertType = 'note';
        quoteText = quoteText.replace(/\[!NOTE\]\s?/, '');
      } else if (quoteText.startsWith('[!TIP]')) {
        alertType = 'tip';
        quoteText = quoteText.replace(/\[!TIP\]\s?/, '');
      } else if (quoteText.startsWith('[!IMPORTANT]')) {
        alertType = 'important';
        quoteText = quoteText.replace(/\[!IMPORTANT\]\s?/, '');
      } else if (quoteText.startsWith('[!WARNING]')) {
        alertType = 'warning';
        quoteText = quoteText.replace(/\[!WARNING\]\s?/, '');
      }

      const bqLines = [quoteText];
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith('>')) {
        i++;
        bqLines.push(lines[i].trim().replace(/^>\s?/, ''));
      }

      const formattedBq = bqLines.map(l => inlineFormat(l, currentDocId)).join('<br/>');

      if (alertType === 'analogy') {
        out.push(`<div class="card-analogy p-5 rounded-2xl border border-amber-500/40 my-6 space-y-2 text-sm text-slate-300 shadow-lg">
          <div class="font-mono text-amber-400 font-bold flex items-center gap-2 text-xs uppercase tracking-wider">
            <span>🌍</span> Everyday Analogy
          </div>
          <div class="leading-relaxed font-sans">${formattedBq}</div>
        </div>`);
      } else if (alertType === 'checkpoint') {
        out.push(`<div class="card-experiment p-5 rounded-2xl border border-purple-500/40 my-6 space-y-2 text-sm text-slate-300 shadow-lg">
          <div class="font-mono text-purple-400 font-bold flex items-center gap-2 text-xs uppercase tracking-wider">
            <span>🎯</span> Concept Checkpoint
          </div>
          <div class="leading-relaxed font-sans">${formattedBq}</div>
        </div>`);
      } else if (alertType === 'analysis') {
        out.push(`<div class="p-5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs font-mono space-y-3 my-6 shadow-inner">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <div class="flex items-center gap-2">
              <span class="text-cyan-400 text-sm">🔬</span>
              <span class="font-bold text-slate-100 uppercase tracking-wider text-[11px]">Comprehensive Pedagogical Analysis</span>
            </div>
            <span class="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px]">Deep-Dive Analysis</span>
          </div>
          <div class="space-y-2 text-slate-300 font-sans leading-relaxed text-xs">${formattedBq}</div>
        </div>`);
      } else if (alertType === 'note') {
        out.push(`<div class="p-4 rounded-xl bg-cyan-950/30 border-l-4 border-cyan-400 my-4 text-sm text-slate-300"><div class="font-mono text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">NOTE</div><div class="leading-relaxed font-sans">${formattedBq}</div></div>`);
      } else if (alertType === 'tip') {
        out.push(`<div class="p-4 rounded-xl bg-emerald-950/30 border-l-4 border-emerald-400 my-4 text-sm text-slate-300"><div class="font-mono text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">TIP</div><div class="leading-relaxed font-sans">${formattedBq}</div></div>`);
      } else if (alertType === 'important') {
        out.push(`<div class="p-4 rounded-xl bg-purple-950/30 border-l-4 border-purple-400 my-4 text-sm text-slate-300"><div class="font-mono text-purple-400 font-bold text-xs uppercase tracking-wider mb-1">IMPORTANT</div><div class="leading-relaxed font-sans">${formattedBq}</div></div>`);
      } else if (alertType === 'warning') {
        out.push(`<div class="p-4 rounded-xl bg-amber-950/30 border-l-4 border-amber-400 my-4 text-sm text-slate-300"><div class="font-mono text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">WARNING</div><div class="leading-relaxed font-sans">${formattedBq}</div></div>`);
      } else {
        out.push(`<blockquote class="border-l-4 border-slate-700 bg-slate-900/60 p-4 rounded-r-xl my-4 text-slate-300 text-sm leading-relaxed italic font-serif">${formattedBq}</blockquote>`);
      }
      continue;
    }

    // Headings
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      closeList();
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const id = slugify(text.replace(/<[^>]+>/g, ''));

      let sizeClasses = 'text-xl font-bold font-mono text-slate-100 mt-8 mb-4';
      if (level === 1) sizeClasses = 'text-2xl md:text-3xl font-extrabold font-mono text-slate-100 mt-8 mb-4 pb-2 border-b border-slate-800';
      if (level === 2) sizeClasses = 'text-xl md:text-2xl font-bold font-mono text-emerald-400 mt-8 mb-3 pb-1 border-b border-slate-800/80';
      if (level === 3) sizeClasses = 'text-lg font-bold font-mono text-cyan-400 mt-6 mb-2';
      if (level === 4) sizeClasses = 'text-base font-semibold font-mono text-amber-400 mt-4 mb-2';

      out.push(`<h${level} id="${id}" class="${sizeClasses}">${inlineFormat(text, currentDocId)} <a class="text-slate-600 hover:text-cyan-400 text-sm opacity-60 ml-2" href="#${id}" title="Direct link">#</a></h${level}>`);
      continue;
    }

    // Lists
    const ulMatch = rawLine.match(/^(\s*)[-*+]\s+(.*)$/);
    const olMatch = rawLine.match(/^(\s*)\d+\.\s+(.*)$/);
    if (ulMatch || olMatch) {
      const match = ulMatch || olMatch;
      const curType = ulMatch ? 'ul' : 'ol';
      if (!inList) {
        inList = true;
        listType = curType;
        const listClasses = curType === 'ul' ? 'list-disc pl-6 space-y-1.5 my-4 text-sm text-slate-300 font-sans leading-relaxed' : 'list-decimal pl-6 space-y-1.5 my-4 text-sm text-slate-300 font-sans leading-relaxed';
        out.push(`<${listType} class="${listClasses}">`);
      }
      out.push(`<li>${inlineFormat(match[2], currentDocId)}</li>`);
      continue;
    } else {
      closeList();
    }

    // Raw HTML lines
    if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
      out.push(trimmed);
      continue;
    }

    // Paragraph
    out.push(`<p class="text-sm text-slate-300 font-sans leading-relaxed my-3">${inlineFormat(trimmed, currentDocId)}</p>`);
  }

  closeList();
  closeTable();
  return out.join('\n');
}

function inlineFormat(text, currentDocId) {
  // Inline citations: [n](#ref-n)
  text = text.replace(/\[(\d+)\]\(#ref-(\d+)\)/g, '<sup class="text-cyan-400 font-mono text-[10px]"><a href="#ref-$2">[$1]</a></sup>');

  // Inline images: ![alt](src)
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
    let cleanSrc = src;
    if (cleanSrc.startsWith('/')) cleanSrc = cleanSrc.slice(1);
    cleanSrc = cleanSrc.replace(/^[A-Za-z]:[\\/]/, '');
    return `<div class="my-6 text-center"><img src="${cleanSrc}" alt="${escapeHtml(alt)}" loading="lazy" class="max-w-full h-auto rounded-xl border border-slate-800 shadow-2xl mx-auto" /><div class="mt-2 text-xs font-mono text-slate-500">${escapeHtml(alt)}</div></div>`;
  });

  // Inline links: [text](href)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    let targetHref = href;
    if (targetHref.endsWith('.md')) {
      targetHref = targetHref.replace(/\.md$/, '.html');
      if (targetHref.startsWith('standards/')) targetHref = path.basename(targetHref);
      if (targetHref.startsWith('docs/')) targetHref = path.basename(targetHref);
    }
    const isExternal = /^https?:\/\//.test(targetHref);
    const extAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${targetHref}"${extAttrs} class="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors font-medium">${label}</a>`;
  });

  // Inline code: `...`
  text = text.replace(/`([^`]+)`/g, (_, code) => `<code class="font-mono text-xs bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-cyan-300">${escapeHtml(code)}</code>`);

  // Bold + Italic: ***text***
  text = text.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong class="text-slate-100 font-bold"><em>$1</em></strong>');

  // Bold: **text**
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-slate-100 font-semibold">$1</strong>');

  // Italic: *text*
  text = text.replace(/(^|[^\*])\*([^\*]+)\*([^\*]|$)/g, '$1<em class="text-slate-200 italic">$2</em>$3');

  return text;
}

function generateSidebar(currentDocId, relativeRoot) {
  let html = '';
  for (const cat of NAV_CATEGORIES) {
    html += `<div class="space-y-1">
      <div class="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold px-3 py-1 flex items-center gap-1.5">
        <span>${cat.icon}</span>
        <span>${cat.name}</span>
      </div>
      <div class="space-y-0.5">`;
    for (const item of cat.items) {
      const isActive = item.id === currentDocId;
      const target = relativeRoot + item.href;
      html += `<a href="${target}" class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${isActive ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/80 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/60'}">
        <span class="text-xs shrink-0">${item.icon}</span>
        <span class="truncate">${item.title}</span>
      </a>`;
    }
    html += `</div></div>`;
  }
  return html;
}

function generateDropdownMenu(currentDocId, relativeRoot) {
  let html = '';
  for (const cat of NAV_CATEGORIES) {
    html += `<div class="space-y-1.5">
      <div class="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5 pb-1 border-b border-slate-800">
        <span>${cat.icon}</span>
        <span>${cat.name}</span>
      </div>
      <div class="grid grid-cols-1 gap-1">`;
    for (const item of cat.items) {
      const isActive = item.id === currentDocId;
      const target = relativeRoot + item.href;
      html += `<a href="${target}" class="p-2 rounded-lg transition-colors flex items-start gap-2.5 ${isActive ? 'bg-cyan-950/80 border border-cyan-700/60 text-cyan-300' : 'hover:bg-slate-900 text-slate-300'}">
        <span class="text-sm shrink-0 mt-0.5">${item.icon}</span>
        <div class="min-w-0">
          <div class="font-bold text-xs ${isActive ? 'text-cyan-300' : 'text-slate-200'}">${item.title}</div>
          <div class="text-[10px] text-slate-500 truncate font-sans">${item.desc}</div>
        </div>
      </a>`;
    }
    html += `</div></div>`;
  }
  return html;
}

function renderHtmlTemplate({ title, content, currentDocId, relativeRoot = '' }) {
  const sidebarHtml = generateSidebar(currentDocId, relativeRoot);
  const dropdownHtml = generateDropdownMenu(currentDocId, relativeRoot);

  return `<!-- 🐠 Siliquarium Open-Ended Digital Life & Silicon Abiogenesis Laboratory • Created by & Copyright © 2026 Ian Ohlander. All rights reserved. -->
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} — Siliquarium Master Documentation</title>
  <link rel="icon" type="image/jpeg" href="${relativeRoot}assets/logos/logo.jpg">

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            bio: {
              bg: '#060911',
              surface: '#0a0e1a',
              panel: '#121829',
              card: '#0f172a',
              border: '#1e2c4a',
              cyan: '#00e5ff',
              amber: '#f59e0b',
              emerald: '#10b981',
              rose: '#f43f5e',
              purple: '#a855f7',
              sky: '#38bdf8'
            }
          },
          fontFamily: {
            mono: ['Cascadia Code', 'Fira Code', 'Consolas', 'monospace'],
            sans: ['Inter', 'system-ui', 'sans-serif'],
            serif: ['Georgia', 'Cambria', 'serif']
          }
        }
      }
    };
  </script>

  <!-- MathJax Configuration with single-dollar inline math and KaTeX compatibility -->
  <script>
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
        displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
        processEscapes: true
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
      }
    };
  </script>
  <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

  <style>
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #060911; }
    ::-webkit-scrollbar-thumb { background: #1e2c4a; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #00e5ff; }

    .card-bio, .card-chemiosmotic {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.7) 100%);
      border: 1px solid rgba(16, 185, 129, 0.4);
    }
    .card-digital, .card-silicon {
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.08) 0%, rgba(15, 23, 42, 0.7) 100%);
      border: 1px solid rgba(0, 229, 255, 0.4);
    }
    .card-margin, .card-analogy {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.7) 100%);
      border: 1px solid rgba(245, 158, 11, 0.35);
    }
    .card-experiment, .card-paleo {
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(15, 23, 42, 0.7) 100%);
      border: 1px solid rgba(168, 85, 247, 0.4);
    }
    .svg-container {
      background: #090e15;
      border: 1px solid #1e2c4a;
      border-radius: 0.75rem;
      padding: 1.25rem;
      overflow-x: auto;
    }

    /* Citation Target Highlighting & Interactive Navigation */
    html { scroll-behavior: auto; }
    li[id^="ref-"] {
      scroll-margin-top: 6rem;
      position: relative;
      transition: background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
    }
    @keyframes refTargetPulse {
      0% {
        box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.95), 0 0 40px rgba(0, 229, 255, 0.85), inset 0 0 15px rgba(0, 229, 255, 0.35);
        border-color: #22d3ee;
        background-color: rgba(8, 51, 68, 0.95);
        transform: scale(1.02);
      }
      30% {
        box-shadow: 0 0 0 6px rgba(0, 229, 255, 0.45), 0 0 50px rgba(0, 229, 255, 0.7), inset 0 0 20px rgba(0, 229, 255, 0.25);
        border-color: #38bdf8;
        background-color: rgba(8, 51, 68, 0.92);
        transform: scale(1.015);
      }
      100% {
        box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.6), 0 0 25px rgba(0, 229, 255, 0.4), inset 0 0 12px rgba(0, 229, 255, 0.15);
        border-color: #00e5ff;
        background-color: rgba(8, 51, 68, 0.88);
        transform: scale(1);
      }
    }
    @keyframes badgePopIn {
      0% { opacity: 0; transform: translateY(6px) scale(0.8); }
      60% { opacity: 1; transform: translateY(-2px) scale(1.06); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    li[id^="ref-"]:target,
    li[id^="ref-"].active-citation-target {
      animation: refTargetPulse 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      border-color: #22d3ee !important;
      background-color: rgba(8, 51, 68, 0.88) !important;
      z-index: 20;
    }
    li[id^="ref-"]:target::after,
    li[id^="ref-"].active-citation-target::after {
      content: "CITED IN TEXT 🎯";
      position: absolute;
      top: -12px;
      right: 14px;
      font-family: 'Cascadia Code', 'Fira Code', Consolas, monospace;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.06em;
      background: linear-gradient(135deg, #0891b2, #0284c7);
      color: #ffffff;
      padding: 3px 10px;
      border-radius: 9999px;
      border: 1px solid #38bdf8;
      box-shadow: 0 0 16px rgba(56, 189, 248, 0.85);
      animation: badgePopIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      pointer-events: none;
    }
    sup a[href^="#ref-"] {
      transition: all 0.2s ease;
      display: inline-block;
      padding: 0 1px;
    }
    sup a[href^="#ref-"]:hover {
      color: #ffffff !important;
      text-shadow: 0 0 8px #22d3ee;
      transform: translateY(-1px);
    }
    section[id], div[id], h2[id], h3[id] {
      scroll-margin-top: 5.5rem;
    }
    @keyframes backlinkTargetFlash {
      0% { outline: 3px solid rgba(0, 229, 255, 0.9); outline-offset: 4px; }
      100% { outline: 3px solid transparent; outline-offset: 4px; }
    }
    section[id]:target, div[id]:target {
      animation: backlinkTargetFlash 2.5s ease-out;
    }
  </style>

  <script id="citation-navigator">
    document.addEventListener('DOMContentLoaded', function() {
      function highlightRefCard(targetId) {
        if (!targetId || !targetId.startsWith('ref-')) return;
        const el = document.getElementById(targetId);
        if (!el) return;
        document.querySelectorAll('li[id^="ref-"].active-citation-target').forEach(function(item) {
          item.classList.remove('active-citation-target');
        });
        el.classList.remove('active-citation-target');
        void el.offsetWidth;
        el.classList.add('active-citation-target');
        el.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
      function scrollToTarget(targetId) {
        if (!targetId) return;
        if (targetId.startsWith('ref-')) {
          highlightRefCard(targetId);
          return;
        }
        const el = document.getElementById(targetId) || document.querySelector('[name="' + targetId + '"]');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href*="#"]');
        if (link) {
          const href = link.getAttribute('href');
          if (href && href.includes('#')) {
            const hash = href.substring(href.indexOf('#') + 1);
            if (hash.startsWith('ref-')) highlightRefCard(hash);
          }
        }
      });
      window.addEventListener('hashchange', function() {
        const hash = window.location.hash.replace('#', '');
        if (hash) scrollToTarget(hash);
      });
      function checkInitialHash() {
        if (window.location.hash) {
          const hash = window.location.hash.replace('#', '');
          scrollToTarget(hash);
        }
      }
      checkInitialHash();
      setTimeout(checkInitialHash, 150);
      setTimeout(checkInitialHash, 500);
      window.addEventListener('load', function() {
        setTimeout(checkInitialHash, 100);
      });
      if (window.MathJax && window.MathJax.startup) {
        window.MathJax.startup.promise = window.MathJax.startup.promise.then(function() {
          setTimeout(checkInitialHash, 100);
        });
      }

      // Sidebar & Dropdown Controller
      const toggleBtn = document.getElementById('sidebar-toggle-btn');
      const closeBtn = document.getElementById('sidebar-close-btn');
      const sidebar = document.getElementById('doc-sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');
      const dropdownBtn = document.getElementById('nav-dropdown-btn');
      const dropdownMenu = document.getElementById('nav-dropdown-menu');

      function openSidebar() {
        if (sidebar && backdrop) {
          sidebar.classList.remove('-translate-x-full');
          backdrop.classList.remove('hidden');
          document.body.style.overflow = 'hidden';
        }
      }
      function closeSidebar() {
        if (sidebar && backdrop) {
          sidebar.classList.add('-translate-x-full');
          backdrop.classList.add('hidden');
          document.body.style.overflow = '';
        }
      }

      if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
      if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
      if (backdrop) backdrop.addEventListener('click', closeSidebar);

      if (dropdownBtn && dropdownMenu) {
        dropdownBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          dropdownMenu.classList.toggle('hidden');
        });
        document.addEventListener('click', function(e) {
          if (!dropdownMenu.contains(e.target) && e.target !== dropdownBtn) {
            dropdownMenu.classList.add('hidden');
          }
        });
      }
    });
  </script>
</head>
<body class="bg-bio-bg text-slate-200 min-h-screen font-sans antialiased selection:bg-cyan-500 selection:text-black leading-relaxed flex flex-col">

  <!-- MASTER TOP HEADER (Single Row, Zero Horizontal Scrollbars) -->
  <header class="border-b border-slate-800 bg-[#060911]/95 backdrop-blur-md sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3 min-w-0">
        <!-- Mobile/Drawer Toggle Button -->
        <button id="sidebar-toggle-btn" class="lg:hidden p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors font-mono text-xs flex items-center gap-1.5 shrink-0" aria-label="Toggle Navigation">
          <span>☰</span>
          <span class="hidden sm:inline">Docs Menu</span>
        </button>

        <nav class="flex items-center gap-2 text-xs font-mono text-slate-400 min-w-0">
          <a href="${relativeRoot}index.html" class="hover:text-cyan-400 text-slate-200 flex items-center gap-2 font-bold shrink-0">
            <img src="${relativeRoot}assets/logos/logo.jpg" alt="Logo" class="w-6 h-6 rounded border border-cyan-400/50 shadow-sm inline">
            <span class="hidden sm:inline">Siliquarium</span>
            <span class="sm:hidden">Portal</span>
          </a>
          <span class="text-slate-600">/</span>
          <span class="text-cyan-400 font-semibold truncate">${escapeHtml(title)}</span>
        </nav>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <!-- Quick Mega-Menu Dropdown Button -->
        <div class="relative">
          <button id="nav-dropdown-btn" class="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-700/60 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 shadow-sm">
            <span>🧭</span>
            <span>Explore Docs</span>
            <span class="text-[10px] text-slate-500">▾</span>
          </button>
          <!-- Mega-Menu Overlay -->
          <div id="nav-dropdown-menu" class="hidden absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-2xl p-4 backdrop-blur-xl z-50 space-y-4 font-mono text-xs max-h-[85vh] overflow-y-auto">
            ${dropdownHtml}
          </div>
        </div>

        <a href="${relativeRoot}../index.html" class="px-3 py-1 bg-cyan-950 border border-cyan-700 text-cyan-300 rounded-lg text-xs hover:bg-cyan-900 transition-colors font-mono font-bold flex items-center gap-1.5 shadow-sm">
          <span>🚀</span>
          <span class="hidden md:inline">Live Simulator</span>
        </a>
      </div>
    </div>
  </header>

  <!-- MASTER 2-COLUMN VIEWPORT (Sidebar + Content) -->
  <div class="max-w-7xl mx-auto flex-1 w-full flex">
    <!-- LEFT CATEGORIZED SIDEBAR (Desktop Sticky + Mobile Off-Canvas) -->
    <aside id="doc-sidebar" class="fixed lg:sticky top-0 lg:top-[45px] z-50 lg:z-10 h-screen lg:h-[calc(100vh-45px)] w-72 bg-[#060911]/95 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none border-r border-slate-800/80 p-5 space-y-6 overflow-y-auto shrink-0 transform -translate-x-full lg:translate-x-0 transition-transform duration-200">
      <div class="flex items-center justify-between pb-3 border-b border-slate-800 lg:hidden">
        <div class="flex items-center gap-2">
          <img src="${relativeRoot}assets/logos/logo.jpg" alt="Logo" class="w-5 h-5 rounded border border-cyan-400/50">
          <span class="text-xs font-mono font-bold text-cyan-400">Documentation Index</span>
        </div>
        <button id="sidebar-close-btn" class="text-slate-400 hover:text-white text-base font-mono p-1">✕</button>
      </div>
      ${sidebarHtml}
    </aside>

    <!-- Mobile Drawer Backdrop -->
    <div id="sidebar-backdrop" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 hidden lg:hidden"></div>

    <!-- MAIN CONTENT VIEWPORT (Centered, Responsive, Zero Horizontal Scrollbars) -->
    <main class="flex-1 min-w-0 px-4 sm:px-8 md:px-10 py-8 md:py-10">
      <div class="max-w-4xl mx-auto space-y-8">
        ${content}
      </div>
    </main>
  </div>

  <!-- MASTER FOOTER -->
  <footer class="border-t border-slate-800/80 bg-[#0a0e1a] py-8 text-center text-xs font-mono text-slate-500">
    <div class="max-w-5xl mx-auto px-4 space-y-2">
      <p class="text-slate-400 font-semibold">🐠 Siliquarium: Open-Ended Digital Life &amp; Silicon Abiogenesis Laboratory</p>
      <p>
        <a href="https://github.com/ianohlander/Siliquarium" target="_blank" rel="noopener" class="text-cyan-400 hover:underline">GitHub Repository</a> •
        PolyForm Noncommercial License 1.0.0 •
        Designed for High School STEM, Undergraduate Biophysics &amp; Systems Biology Research
      </p>
    </div>
  </footer>
</body>
</html>`;
}

// Documents to compile
const DOCS_MAP = [
  {
    docId: 'index',
    srcMd: 'docs/PORTAL.md',
    destHtml: 'docs/index.html',
    title: 'Siliquarium Master Curriculum & Documentation Portal',
    relativeRoot: ''
  },
  {
    docId: 'syllabus',
    srcMd: 'docs/CURRICULUM_AND_SYLLABUS.md',
    destHtml: 'docs/CURRICULUM_AND_SYLLABUS.html',
    title: 'Curriculum & Lab Manual: Systems Biology & Silicon Abiogenesis',
    relativeRoot: ''
  },
  {
    docId: 'unit1',
    srcMd: 'docs/curriculum/unit1_prebiotic_threshold.md',
    destHtml: 'docs/curriculum/unit1_prebiotic_threshold.html',
    title: "Unit 1: The Prebiotic Threshold & Howard Pattee's Epistemic Cut",
    relativeRoot: '../'
  },
  {
    docId: 'unit2',
    srcMd: 'docs/curriculum/unit2_logic_of_life.md',
    destHtml: 'docs/curriculum/unit2_logic_of_life.html',
    title: 'Unit 2: The Logic of Life & Primitive Enzymes',
    relativeRoot: '../'
  },
  {
    docId: 'unit3',
    srcMd: 'docs/curriculum/unit3_systems_biology_motifs.md',
    destHtml: 'docs/curriculum/unit3_systems_biology_motifs.html',
    title: 'Unit 3: Systems Biology & Uri Alon Motifs',
    relativeRoot: '../'
  },
  {
    docId: 'unit4',
    srcMd: 'docs/curriculum/unit4_evolutionary_dynamics.md',
    destHtml: 'docs/curriculum/unit4_evolutionary_dynamics.html',
    title: 'Unit 4: Macro-Evolutionary Dynamics & Lenski LTEE',
    relativeRoot: '../'
  },
  {
    docId: 'practicums',
    srcMd: 'docs/curriculum/practicums_lab_manual.md',
    destHtml: 'docs/curriculum/practicums_lab_manual.html',
    title: 'Practicums 1–5: Hands-On Student Laboratory Manual',
    relativeRoot: '../'
  },
  {
    docId: 'pedagogy',
    srcMd: 'docs/PEDAGOGICAL_COMPANION_SUITE.md',
    destHtml: 'docs/PEDAGOGICAL_COMPANION_SUITE.html',
    title: 'Pedagogical Companion Suite: Systems Biology & Silicon Abiogenesis',
    relativeRoot: ''
  },
  {
    docId: 'glossary',
    srcMd: 'docs/companion/glossary.md',
    destHtml: 'docs/companion/glossary.html',
    title: 'Lexicon of Systems Biology & Silicon Abiogenesis',
    relativeRoot: '../'
  },
  {
    docId: 'study-guides',
    srcMd: 'docs/companion/study_guides.md',
    destHtml: 'docs/companion/study_guides.html',
    title: 'Student Study Guides & Equation Decoders',
    relativeRoot: '../'
  },
  {
    docId: 'bibliography',
    srcMd: 'docs/companion/bibliography.md',
    destHtml: 'docs/companion/bibliography.html',
    title: 'Annotated Primary Literature Bibliography',
    relativeRoot: '../'
  },
  {
    docId: 'theory',
    srcMd: 'THEORETICAL_MODEL.md',
    destHtml: 'docs/THEORETICAL_MODEL.html',
    title: 'The Master Theoretical Model',
    relativeRoot: ''
  },
  {
    docId: 'epistemic',
    srcMd: 'docs/EPISTEMIC_FOUNDATIONS.md',
    destHtml: 'docs/EPISTEMIC_FOUNDATIONS.html',
    title: 'Epistemic Foundations & Prebiotic Justifications',
    relativeRoot: ''
  },
  {
    docId: 'design-principles',
    srcMd: 'docs/DOCUMENTATION_DESIGN_PRINCIPLES.md',
    destHtml: 'docs/DOCUMENTATION_DESIGN_PRINCIPLES.html',
    title: 'Documentation Architecture & Design Principles',
    relativeRoot: ''
  },
  {
    docId: 'phase3',
    srcMd: 'docs/PHASE_3_VISUALIZER_GUIDE.md',
    destHtml: 'docs/PHASE_3_VISUALIZER_GUIDE.html',
    title: 'Phase 3 WebGL 3D Seafloor & Circuit Microscope Guide',
    relativeRoot: ''
  },
  {
    docId: 'phase4',
    srcMd: 'docs/PHASE_4_PALEONTOLOGY_GUIDE.md',
    destHtml: 'docs/PHASE_4_PALEONTOLOGY_GUIDE.html',
    title: 'Phase 4 Digital Paleontologist & Lenski Fossil Freezer Guide',
    relativeRoot: ''
  },
  {
    docId: 'phase5',
    srcMd: 'docs/PHASE_5_PELAGIC_SPORES_GUIDE.md',
    destHtml: 'docs/PHASE_5_PELAGIC_SPORES_GUIDE.html',
    title: 'Phase 5 Pelagic Spore Dispersal & God-Suite Guide',
    relativeRoot: ''
  },
  {
    docId: 'phase6',
    srcMd: 'docs/PHASE_6_EVOLUTIONARY_DYNAMICS_GUIDE.md',
    destHtml: 'docs/PHASE_6_EVOLUTIONARY_DYNAMICS_GUIDE.html',
    title: 'Phase 6 Multi-Lineage Phylogeny & LTEE Dynamics Guide',
    relativeRoot: ''
  },
  {
    docId: 'brand',
    srcMd: 'docs/BRAND_IDENTITY.md',
    destHtml: 'docs/BRAND_IDENTITY.html',
    title: 'Brand Identity & Visual Philosophy',
    relativeRoot: ''
  },
  {
    docId: 'qa-report',
    srcMd: 'QA/STUDENT_UX_REPORT.md',
    destHtml: 'QA/STUDENT_UX_REPORT.html',
    title: '12th Grade Student QA & Usability Audit Report',
    relativeRoot: '../docs/'
  },
  {
    docId: 'dev-standards',
    srcMd: 'standards/DEVELOPMENT_STANDARDS.md',
    destHtml: 'standards/DEVELOPMENT_STANDARDS.html',
    title: 'Engineering & Software Architecture Standards',
    relativeRoot: '../docs/'
  },
  {
    docId: 'qa-standards',
    srcMd: 'standards/QA_AND_TESTING_STANDARDS.md',
    destHtml: 'standards/QA_AND_TESTING_STANDARDS.html',
    title: 'QA & Testing Standards',
    relativeRoot: '../docs/'
  },
  {
    docId: 'docs-standards',
    srcMd: 'standards/DOCUMENTATION_STANDARDS.md',
    destHtml: 'standards/DOCUMENTATION_STANDARDS.html',
    title: 'Documentation & Pedagogical Standards',
    relativeRoot: '../docs/'
  }
];

function buildDoc(doc) {
  const fullSrc = path.join(rootDir, doc.srcMd);
  const fullDest = path.join(rootDir, doc.destHtml);
  if (!fs.existsSync(fullSrc)) {
    console.warn(`[WARN] Source file missing: ${doc.srcMd}`);
    return;
  }
  const md = fs.readFileSync(fullSrc, 'utf8');
  const bodyHtml = parseMarkdown(md, doc.docId);
  const finalHtml = renderHtmlTemplate({
    title: doc.title,
    content: bodyHtml,
    currentDocId: doc.docId,
    relativeRoot: doc.relativeRoot
  });
  fs.mkdirSync(path.dirname(fullDest), { recursive: true });
  fs.writeFileSync(fullDest, finalHtml, 'utf8');
  console.log(`  ✓ Compiled: ${doc.srcMd} ──► ${doc.destHtml}`);
}

function buildLogoGallery() {
  const logos = [
    { file: 'logo.jpg', name: 'Official Canonical Logo', badge: 'Official', desc: 'Variation 5: The Living Silicon Embryo (Epistemic Cut)' },
    { file: 'nautilus_var5_embryo.jpg', name: 'Variation 5: The Living Silicon Embryo', badge: 'Selected', desc: 'Coiled 1D genome tape at center radiating into logic gate chambers (The Epistemic Cut).' },
    { file: 'nautilus_var4_isometric.jpg', name: 'Variation 4: 3D Benthic Basalt Columns', badge: '3D Matrix', desc: 'Isometric 3D hexagonal basalt columns with etched (q, r, z) foundation.' },
    { file: 'nautilus_var2_thermal.jpg', name: 'Variation 2: Hydrothermal Thermal Core', badge: 'Thermal Glow', desc: 'Volcanic amber thermal glow at center venting into cyan outer chambers.' },
    { file: 'nautilus_var1_minimal.jpg', name: 'Variation 1: Minimalist Hex Shell', badge: 'Minimalist', desc: 'Clean high-contrast flat vector line art on dark obsidian.' },
    { file: 'nautilus_var3_circuit.jpg', name: 'Variation 3: Fibonacci Circuit Ribbon', badge: 'PCB Die', desc: 'Layered golden microchip ribbon with central microprocessor die.' },
    { file: 'logo_option_1_hex_gate.jpg', name: 'Option 1: The Hydrothermal Hex Gate', badge: 'Candidate', desc: 'Basalt hex pore with branching bioluminescent cyan & gold circuits.' },
    { file: 'logo_option_2_silicon_diatom.jpg', name: 'Option 2: The Silicon Diatom', badge: 'Candidate', desc: 'Microscopic diatom shell integrated with AND/OR/NOT logic gates.' },
    { file: 'logo_option_3_vent_spire.jpg', name: 'Option 3: The Abyssal Vent Spire', badge: 'Candidate', desc: 'Volcanic basalt chimney releasing an upward plume of glowing digital pulses.' },
    { file: 'logo_option_4_silicon_nautilus.jpg', name: 'Option 4: The Silicon Nautilus (Original)', badge: 'Candidate', desc: 'Initial nautilus concept with glowing logic traces in hex chambers.' },
    { file: 'logo_option_5_silicon_fish.jpg', name: 'Option 5: The Benthic Circuit Fish', badge: 'Candidate', desc: 'Minimalist geometric fish silhouette formed of circuit traces & logic core.' }
  ];

  let galleryCards = '<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-8">';
  for (const l of logos) {
    galleryCards += `
      <div class="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-cyan-500/50 transition-all shadow-xl group">
        <div class="aspect-square bg-black overflow-hidden flex items-center justify-center p-2">
          <a href="assets/logos/${l.file}" target="_blank" class="w-full h-full block">
            <img src="assets/logos/${l.file}" alt="${escapeHtml(l.name)}" class="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105" loading="lazy">
          </a>
        </div>
        <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono font-bold uppercase">${escapeHtml(l.badge)}</span>
              <code class="text-[10px] font-mono text-slate-500">${escapeHtml(l.file)}</code>
            </div>
            <h3 class="text-sm font-mono font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">${escapeHtml(l.name)}</h3>
            <p class="text-xs text-slate-400 font-sans leading-relaxed">${escapeHtml(l.desc)}</p>
          </div>
          <a href="assets/logos/${l.file}" download="${l.file}" class="w-full text-center px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-950 hover:border-cyan-700 border border-slate-700 text-xs font-mono text-slate-300 hover:text-cyan-300 transition-all block">⬇ Download Asset</a>
        </div>
      </div>
    `;
  }
  galleryCards += '</div>';

  const content = `
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <span class="text-3xl">🖼️</span>
        <div>
          <span class="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Brand Identity Asset Repository</span>
          <h1 class="text-2xl md:text-3xl font-mono font-extrabold text-slate-100">Siliquarium Brand &amp; Logo Gallery</h1>
        </div>
      </div>
      <p class="text-sm text-slate-400 leading-relaxed font-sans max-w-3xl">
        Complete production asset gallery featuring the official canonical brand mark, the 5 Golden Spiral Nautilus variations, and the original prebiotic candidate suite.
      </p>
    </div>
    ${galleryCards}
  `;

  const html = renderHtmlTemplate({
    title: 'Brand & Logo Gallery',
    content,
    currentDocId: 'logos',
    relativeRoot: ''
  });

  fs.writeFileSync(path.join(rootDir, 'docs/logos.html'), html, 'utf8');
  console.log(`  ✓ Compiled: docs/logos.html (Interactive Logo Gallery)`);

  const rootLogosHtml = html.replace(/assets\/logos\//g, '');
  fs.writeFileSync(path.join(rootDir, 'logos/index.html'), rootLogosHtml, 'utf8');
  console.log(`  ✓ Compiled: logos/index.html`);
}

console.log('=========================================');
console.log('🐠 Siliquarium Enterprise HTML Docs Compiler');
console.log('=========================================');

for (const doc of DOCS_MAP) {
  buildDoc(doc);
}

buildLogoGallery();

console.log('\n🎉 ALL DOCUMENTATION COMPILED WITH SIDEBAR & DROPDOWN LAYOUT SUCCESSFULLY!');
