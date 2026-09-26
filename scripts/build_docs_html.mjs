#!/usr/bin/env node

/**
 * 🐠 Siliquarium Native Zero-Dependency Markdown to HTML Documentation Compiler
 * Generates self-contained, responsive, abyssal-themed HTML documents for human viewing.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const NAV_ITEMS = [
  { id: 'index', title: 'Portal / Overview', href: 'index.html', icon: '🐠' },
  { id: 'theory', title: 'Theoretical Model', href: 'THEORETICAL_MODEL.html', icon: '🌊' },
  { id: 'epistemic', title: 'Epistemic Foundations', href: 'EPISTEMIC_FOUNDATIONS.html', icon: '🧬' },
  { id: 'brand', title: 'Brand Identity', href: 'BRAND_IDENTITY.html', icon: '🎨' },
  { id: 'phase3', title: 'Phase 3 Visualizer', href: 'PHASE_3_VISUALIZER_GUIDE.html', icon: '🔬' },
  { id: 'phase4', title: 'Phase 4 Paleontology', href: 'PHASE_4_PALEONTOLOGY_GUIDE.html', icon: '🦕' },
  { id: 'phase5', title: 'Phase 5 Spores', href: 'PHASE_5_PELAGIC_SPORES_GUIDE.html', icon: '🌊' },
  { id: 'phase6', title: 'Phase 6 Phylogeny', href: 'PHASE_6_EVOLUTIONARY_DYNAMICS_GUIDE.html', icon: '🧬' },
  { id: 'logos', title: 'Logo Gallery', href: 'logos.html', icon: '🖼️' },
  { id: 'dev', title: 'Dev Standards', href: 'DEVELOPMENT_STANDARDS.html', icon: '🏛️' },
  { id: 'qa', title: 'QA Standards', href: 'QA_AND_TESTING_STANDARDS.html', icon: '🧪' },
  { id: 'docs', title: 'Doc Standards', href: 'DOCUMENTATION_STANDARDS.html', icon: '📚' }
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
      let tHtml = '<div class="table-container"><table><thead><tr>';
      for (const th of tableHeader) {
        tHtml += `<th>${inlineFormat(th.trim(), currentDocId)}</th>`;
      }
      tHtml += '</tr></thead><tbody>';
      for (const row of tableRows) {
        tHtml += '<tr>';
        for (const td of row) {
          tHtml += `<td>${inlineFormat(td.trim(), currentDocId)}</td>`;
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
        out.push(`<pre><code class="language-${codeLang}">${escapeHtml(codeLines.join('\n'))}</code></pre>`);
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
      out.push('<hr class="divider" />');
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

    // Blockquotes & Alerts
    if (trimmed.startsWith('>')) {
      closeList();
      let quoteText = trimmed.replace(/^>\s?/, '');
      let alertClass = 'quote';
      let title = '';

      if (quoteText.startsWith('[!NOTE]')) {
        alertClass = 'alert alert-note';
        title = 'NOTE';
        quoteText = quoteText.replace(/\[!NOTE\]\s?/, '');
      } else if (quoteText.startsWith('[!TIP]')) {
        alertClass = 'alert alert-tip';
        title = 'TIP';
        quoteText = quoteText.replace(/\[!TIP\]\s?/, '');
      } else if (quoteText.startsWith('[!IMPORTANT]')) {
        alertClass = 'alert alert-important';
        title = 'IMPORTANT';
        quoteText = quoteText.replace(/\[!IMPORTANT\]\s?/, '');
      } else if (quoteText.startsWith('[!WARNING]')) {
        alertClass = 'alert alert-warning';
        title = 'WARNING';
        quoteText = quoteText.replace(/\[!WARNING\]\s?/, '');
      }

      // Collect multiline blockquote if any
      const bqLines = [quoteText];
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith('>')) {
        i++;
        bqLines.push(lines[i].trim().replace(/^>\s?/, ''));
      }

      const formattedBq = bqLines.map(l => inlineFormat(l, currentDocId)).join('<br/>');
      if (title) {
        out.push(`<div class="${alertClass}"><div class="alert-title">${title}</div><div>${formattedBq}</div></div>`);
      } else {
        out.push(`<blockquote class="callout">${formattedBq}</blockquote>`);
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
      out.push(`<h${level} id="${id}">${inlineFormat(text, currentDocId)} <a class="header-anchor" href="#${id}" title="Link to section">#</a></h${level}>`);
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
        out.push(`<${listType}>`);
      }
      out.push(`<li>${inlineFormat(match[2], currentDocId)}</li>`);
      continue;
    } else {
      closeList();
    }

    // Raw HTML lines (e.g. <p align="center">, <img ...>)
    if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
      out.push(trimmed);
      continue;
    }

    // Paragraph
    out.push(`<p>${inlineFormat(trimmed, currentDocId)}</p>`);
  }

  closeList();
  closeTable();
  return out.join('\n');
}

function inlineFormat(text, currentDocId) {
  // LaTeX Display Math: $$...$$
  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
    return `<div class="katex-display math-block" data-math="${escapeHtml(math)}">\\[ ${escapeHtml(math)} \\]</div>`;
  });

  // LaTeX Inline Math: $...$
  text = text.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
    return `<span class="katex-inline math-inline" data-math="${escapeHtml(math)}">\\( ${escapeHtml(math)} \\)</span>`;
  });

  // Inline images: ![alt](src)
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
    let cleanSrc = src;
    if (cleanSrc.startsWith('/')) cleanSrc = cleanSrc.slice(1);
    cleanSrc = cleanSrc.replace(/^[A-Za-z]:[\\/]/, '');
    return `<div class="img-wrapper"><img src="${cleanSrc}" alt="${escapeHtml(alt)}" loading="lazy" /><div class="img-caption">${escapeHtml(alt)}</div></div>`;
  });

  // Inline links: [text](href)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    let targetHref = href;
    // Map .md to .html for local docs
    if (targetHref.endsWith('.md')) {
      targetHref = targetHref.replace(/\.md$/, '.html');
      // normalize path
      if (targetHref.startsWith('standards/')) targetHref = path.basename(targetHref);
      if (targetHref.startsWith('docs/')) targetHref = path.basename(targetHref);
    }
    const isExternal = /^https?:\/\//.test(targetHref);
    const extAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${targetHref}"${extAttrs}>${label}</a>`;
  });

  // Inline code: `...`
  text = text.replace(/`([^`]+)`/g, (_, code) => `<code>${escapeHtml(code)}</code>`);

  // Bold + Italic: ***text***
  text = text.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');

  // Bold: **text**
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Italic: *text*
  text = text.replace(/(^|[^\*])\*([^\*]+)\*([^\*]|$)/g, '$1<em>$2</em>$3');

  return text;
}

function renderHtmlTemplate({ title, content, currentDocId, relativeRoot = '' }) {
  const navHtml = NAV_ITEMS.map(item => {
    const isActive = item.id === currentDocId;
    const target = relativeRoot + item.href;
    return `<a href="${target}" class="nav-link ${isActive ? 'active' : ''}">${item.icon} ${item.title}</a>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} — Siliquarium</title>
  <link rel="icon" type="image/jpeg" href="${relativeRoot}assets/logos/logo.jpg">
  
  <!-- Modern Clean Typography & KaTeX -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"
    onload="renderMathInElement(document.body, {delimiters: [{left: '$$', right: '$$', display: true}, {left: '\\\\[', right: '\\\\]', display: true}, {left: '$', right: '$', display: false}, {left: '\\\\(', right: '\\\\)', display: false}]});"></script>

  <style>
    :root {
      --bg-ocean: #060911;
      --bg-card: #0d1322;
      --bg-surface: #131c31;
      --border: #1e2c4a;
      --border-glow: #00e5ff33;
      --text-primary: #f1f5f9;
      --text-secondary: #94a3b8;
      --text-muted: #64748b;
      --cyan: #00e5ff;
      --amber: #f59e0b;
      --emerald: #10b981;
      --rose: #f43f5e;
      --purple: #a855f7;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      background-color: var(--bg-ocean);
      color: var(--text-primary);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.7;
      font-size: 16px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Top Navigation Header */
    .top-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(6, 9, 17, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
    }
    .header-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: var(--text-primary);
      font-weight: 700;
      font-size: 1.15rem;
      letter-spacing: -0.02em;
    }
    .brand-logo img {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: 1px solid var(--cyan);
      box-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
    }
    .brand-logo span {
      background: linear-gradient(135deg, #ffffff 40%, var(--cyan) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .nav-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      overflow-x: auto;
      padding-bottom: 2px;
    }
    .nav-link {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 500;
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      white-space: nowrap;
      transition: all 0.15s ease;
      border: 1px solid transparent;
    }
    .nav-link:hover {
      color: var(--text-primary);
      background: var(--bg-surface);
      border-color: var(--border);
    }
    .nav-link.active {
      color: var(--cyan);
      background: rgba(0, 229, 255, 0.1);
      border-color: rgba(0, 229, 255, 0.4);
      font-weight: 600;
    }

    /* Main Container */
    .container {
      max-width: 980px;
      margin: 0 auto;
      padding: 3rem 1.5rem;
      flex: 1;
      width: 100%;
    }

    /* Typography */
    h1, h2, h3, h4, h5, h6 {
      color: #ffffff;
      font-weight: 700;
      line-height: 1.3;
      margin-top: 2rem;
      margin-bottom: 1rem;
      position: relative;
    }
    h1 {
      font-size: 2.25rem;
      margin-top: 0;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.75rem;
      background: linear-gradient(135deg, #ffffff 60%, var(--cyan) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    h2 { font-size: 1.6rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.4rem; }
    h3 { font-size: 1.25rem; color: #e2e8f0; }
    h4 { font-size: 1.05rem; color: var(--cyan); }
    
    p { margin-bottom: 1.25rem; color: #cbd5e1; }
    strong { color: #ffffff; font-weight: 600; }
    em { color: var(--text-primary); font-style: italic; }

    .header-anchor {
      opacity: 0;
      color: var(--cyan);
      text-decoration: none;
      margin-left: 0.5rem;
      font-weight: 400;
      transition: opacity 0.2s;
    }
    h1:hover .header-anchor, h2:hover .header-anchor, h3:hover .header-anchor {
      opacity: 0.6;
    }

    a {
      color: var(--cyan);
      text-decoration: none;
      transition: color 0.15s;
    }
    a:hover {
      text-decoration: underline;
      color: #70f3ff;
    }

    /* Lists */
    ul, ol {
      margin-left: 1.5rem;
      margin-bottom: 1.25rem;
      color: #cbd5e1;
    }
    li { margin-bottom: 0.4rem; }

    /* Code & Pre */
    code {
      font-family: 'Fira Code', monospace;
      font-size: 0.88em;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      color: #38bdf8;
    }
    pre {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1.25rem;
      overflow-x: auto;
      margin-bottom: 1.5rem;
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.4);
    }
    pre code {
      background: transparent;
      border: none;
      padding: 0;
      color: #e2e8f0;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    /* Blockquotes & Callouts */
    blockquote.callout {
      border-left: 4px solid var(--cyan);
      background: var(--bg-card);
      padding: 1rem 1.25rem;
      border-radius: 0 8px 8px 0;
      margin-bottom: 1.5rem;
      color: #cbd5e1;
    }

    /* GitHub-style Alerts */
    .alert {
      border-left: 4px solid;
      background: var(--bg-card);
      padding: 1rem 1.25rem;
      border-radius: 0 8px 8px 0;
      margin-bottom: 1.5rem;
    }
    .alert-title {
      font-weight: 700;
      font-size: 0.85rem;
      letter-spacing: 0.05em;
      margin-bottom: 0.4rem;
      text-transform: uppercase;
    }
    .alert-note { border-color: var(--cyan); }
    .alert-note .alert-title { color: var(--cyan); }
    .alert-tip { border-color: var(--emerald); }
    .alert-tip .alert-title { color: var(--emerald); }
    .alert-important { border-color: var(--purple); }
    .alert-important .alert-title { color: var(--purple); }
    .alert-warning { border-color: var(--amber); }
    .alert-warning .alert-title { color: var(--amber); }

    /* Tables */
    .table-container {
      width: 100%;
      overflow-x: auto;
      margin-bottom: 1.75rem;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--bg-card);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.92rem;
    }
    th {
      background: var(--bg-surface);
      color: #ffffff;
      font-weight: 600;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--border);
    }
    td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: #cbd5e1;
    }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: rgba(255, 255, 255, 0.02); }

    /* Math */
    .math-block {
      overflow-x: auto;
      padding: 1rem 0;
      text-align: center;
      margin-bottom: 1rem;
      color: #e2e8f0;
    }

    /* Images */
    .img-wrapper {
      margin: 1.5rem 0;
      text-align: center;
    }
    .img-wrapper img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      border: 1px solid var(--border);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
    }
    .img-caption {
      margin-top: 0.5rem;
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    hr.divider {
      border: none;
      height: 1px;
      background: var(--border);
      margin: 2.5rem 0;
    }

    /* Footer */
    footer {
      border-top: 1px solid var(--border);
      background: var(--bg-card);
      padding: 2rem 1.5rem;
      text-align: center;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    footer a { color: var(--text-secondary); }
    footer a:hover { color: var(--cyan); }
  </style>
</head>
<body>
  <header class="top-header">
    <div class="header-inner">
      <a href="${relativeRoot}index.html" class="brand-logo">
        <img src="${relativeRoot}assets/logos/logo.jpg" alt="Siliquarium Logo">
        <span>Siliquarium</span>
      </a>
      <nav class="nav-bar">
        ${navHtml}
      </nav>
    </div>
  </header>

  <main class="container">
    ${content}
  </main>

  <footer>
    <p>Siliquarium: Open-Ended Digital Life & Silicon Abiogenesis Laboratory</p>
    <p style="margin-top: 0.4rem;">
      <a href="https://github.com/ianohlander/Siliquarium" target="_blank" rel="noopener">GitHub Repository</a> •
      PolyForm Noncommercial License 1.0.0
    </p>
  </footer>
</body>
</html>`;
}

// Documents to compile
const DOCS_MAP = [
  {
    docId: 'index',
    srcMd: 'README.md',
    destHtml: 'docs/index.html',
    title: 'Siliquarium: Open-Ended Digital Life',
    relativeRoot: ''
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
    docId: 'brand',
    srcMd: 'docs/BRAND_IDENTITY.md',
    destHtml: 'docs/BRAND_IDENTITY.html',
    title: 'Brand Identity & Visual Philosophy',
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
    docId: 'dev',
    srcMd: 'standards/DEVELOPMENT_STANDARDS.md',
    destHtml: 'docs/DEVELOPMENT_STANDARDS.html',
    title: 'Engineering & Software Architecture Standards',
    relativeRoot: ''
  },
  {
    docId: 'dev-standards',
    srcMd: 'standards/DEVELOPMENT_STANDARDS.md',
    destHtml: 'standards/DEVELOPMENT_STANDARDS.html',
    title: 'Engineering & Software Architecture Standards',
    relativeRoot: '../docs/'
  },
  {
    docId: 'qa',
    srcMd: 'standards/QA_AND_TESTING_STANDARDS.md',
    destHtml: 'docs/QA_AND_TESTING_STANDARDS.html',
    title: 'QA & Testing Standards',
    relativeRoot: ''
  },
  {
    docId: 'qa-standards',
    srcMd: 'standards/QA_AND_TESTING_STANDARDS.md',
    destHtml: 'standards/QA_AND_TESTING_STANDARDS.html',
    title: 'QA & Testing Standards',
    relativeRoot: '../docs/'
  },
  {
    docId: 'docs',
    srcMd: 'standards/DOCUMENTATION_STANDARDS.md',
    destHtml: 'docs/DOCUMENTATION_STANDARDS.html',
    title: 'Documentation & Pedagogical Standards',
    relativeRoot: ''
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

  let galleryCards = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 2rem;">';
  for (const l of logos) {
    galleryCards += `
      <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column;">
        <div style="aspect-ratio: 1/1; background: #000; overflow: hidden; display: flex; align-items: center; justify-content: center;">
          <a href="assets/logos/${l.file}" target="_blank">
            <img src="assets/logos/${l.file}" alt="${escapeHtml(l.name)}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          </a>
        </div>
        <div style="padding: 1.25rem; flex: 1; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--cyan); background: rgba(0,229,255,0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">${escapeHtml(l.badge)}</span>
            <code style="font-size: 0.75rem;">${escapeHtml(l.file)}</code>
          </div>
          <h3 style="font-size: 1rem; margin: 0.25rem 0 0.5rem; color: #fff;">${escapeHtml(l.name)}</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem; flex: 1;">${escapeHtml(l.desc)}</p>
          <a href="assets/logos/${l.file}" download="${l.file}" style="display: inline-block; text-align: center; background: var(--bg-surface); border: 1px solid var(--border); padding: 0.4rem 0.75rem; border-radius: 6px; font-size: 0.82rem; font-weight: 500; color: var(--text-primary); text-decoration: none;">⬇ Download Asset</a>
        </div>
      </div>
    `;
  }
  galleryCards += '</div>';

  const content = `
    <h1>🖼️ Siliquarium Brand & Logo Gallery</h1>
    <p>Complete production asset gallery featuring the official canonical brand mark, the 5 Golden Spiral Nautilus variations, and the original prebiotic candidate suite.</p>
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

  // Also build logos/index.html
  const rootLogosHtml = html.replace(/assets\/logos\//g, '');
  fs.writeFileSync(path.join(rootDir, 'logos/index.html'), rootLogosHtml, 'utf8');
  console.log(`  ✓ Compiled: logos/index.html`);
}

console.log('=========================================');
console.log('🐠 Siliquarium HTML Documentation Compiler');
console.log('=========================================');

for (const doc of DOCS_MAP) {
  buildDoc(doc);
}

buildLogoGallery();

console.log('\n🎉 ALL DOCUMENTATION COMPILED TO HTML SUCCESSFULLY!');
