#!/usr/bin/env python3
"""
build_marketing_site.py
Converts Siliquarium marketing markdown documents into publication-grade HTML pages
with complete Table of Contents for each step, and generates marketing/index.html
as the Master Commercial Operations Dashboard.
"""

import os
import re
import html

WORKSPACE_DIR = r"H:\My Drive\Repos\Siliquarium"
MARKETING_DIR = os.path.join(WORKSPACE_DIR, "marketing")

DOCS_CONFIG = [
    {
        "id": "step0",
        "num": "00",
        "title": "Executive Summary & 30-Day Quickstart",
        "subtitle": "Master Strategic Blueprint, Hosted Server Decoupling & 30-Day Execution Sprints",
        "icon": "⚡",
        "md_file": "00_EXECUTIVE_SUMMARY_AND_QUICKSTART.md",
        "html_file": "00_executive_summary_and_quickstart.html",
        "badge": "Orientation & Master Plan",
        "badge_color": "emerald"
    },
    {
        "id": "step1",
        "num": "01",
        "title": "Turnkey Monetization & Hosted SaaS Blueprint",
        "subtitle": "Lemon Squeezy MoR, 5 Hosted Tiers, Persistent Cloud Server & Abyssal Arena",
        "icon": "💳",
        "md_file": "01_TURNKEY_MONETIZATION_AND_HOSTED_SAAS_BLUEPRINT.md",
        "html_file": "01_turnkey_monetization_and_hosted_saas_blueprint.html",
        "badge": "Payment & Hosted SaaS",
        "badge_color": "amber"
    },
    {
        "id": "step2",
        "num": "02",
        "title": "Positioning & Messaging Bible",
        "subtitle": "Richard Dawkins Epistemic Framework, 'The Greatest Show on Earth' & 'Genetic Book of the Dead'",
        "icon": "🎯",
        "md_file": "02_POSITIONING_AND_MESSAGING_BIBLE.md",
        "html_file": "02_positioning_and_messaging_bible.html",
        "badge": "Positioning & Copy Bible",
        "badge_color": "cyan"
    },
    {
        "id": "step3",
        "num": "03",
        "title": "Creator & Influencer Outreach Playbook",
        "subtitle": "Homage to Dawkins, Nick Lane, Michael Levin, Christoph Adami, Uri Alon & 3b1b / Veritasium",
        "icon": "🎙️",
        "md_file": "03_CREATOR_AND_INFLUENCER_OUTREACH_PLAYBOOK.md",
        "html_file": "03_creator_and_influencer_outreach_playbook.html",
        "badge": "Creator & Homage Outreach",
        "badge_color": "sky"
    },
    {
        "id": "step4",
        "num": "04",
        "title": "Historical Connections & Academic Expansion",
        "subtitle": "Reunions with Trevor Low, Scott Zgraggen, Jeff Rushall, Prof. Paul Davies & $499 Site Licenses",
        "icon": "🎓",
        "md_file": "04_HISTORICAL_CONNECTIONS_AND_ACADEMIC_EXPANSION.md",
        "html_file": "04_historical_connections_and_academic_expansion.html",
        "badge": "Academic Champions & Sales",
        "badge_color": "purple"
    },
    {
        "id": "step5",
        "num": "05",
        "title": "Content Roadmap & Community Launch Playbook",
        "subtitle": "Show HN, 7-Subreddit Campaign, Twitter/X Mega-Thread & Abyssal Arena Battler Videos",
        "icon": "🚀",
        "md_file": "05_CONTENT_ROADMAP_AND_COMMUNITY_LAUNCH_PLAYBOOK.md",
        "html_file": "05_content_roadmap_and_community_launch_playbook.html",
        "badge": "Public Launch & Viral Arena",
        "badge_color": "rose"
    },
    {
        "id": "step6",
        "num": "06",
        "title": "Financial Model & ROI Forecast",
        "subtitle": "Traffic Funnels, $0 Marginal Client Compute, Headless Server Economics & $3.5K–$55K/mo Models",
        "icon": "📊",
        "md_file": "06_FINANCIAL_MODEL_AND_ROI_FORECAST.md",
        "html_file": "06_financial_model_and_roi_forecast.html",
        "badge": "Financial Projections & ROI",
        "badge_color": "teal"
    },
    {
        "id": "step7",
        "num": "07",
        "title": "UI/UX Experience & The Abyssal Arena Gamer Blueprint",
        "subtitle": "Julian Mercer & Jack Vance Review: Two-Portal Delineation & Gamer-Centric Battle HUD",
        "icon": "🎮",
        "md_file": "07_UI_UX_GAMING_EXPERIENCE_AND_ARENA_BLUEPRINT.md",
        "html_file": "07_ui_ux_gaming_experience_and_arena_blueprint.html",
        "badge": "UI/UX & Gaming Architecture",
        "badge_color": "fuchsia"
    },
    {
        "id": "step8",
        "num": "08",
        "title": "LLC Formation, VPS Hosting & Deployment Strategy",
        "subtitle": "Jack Vance's Unvarnished Reality Check: Umbrella LLC, Hostinger VPS, Domain Routing & Anti-Spam Email",
        "icon": "🏛️",
        "md_file": "08_LLC_INFRASTRUCTURE_HOSTING_AND_DEPLOYMENT_STRATEGY.md",
        "html_file": "08_llc_infrastructure_hosting_and_deployment_strategy.html",
        "badge": "Legal, VPS & Infrastructure",
        "badge_color": "indigo"
    }
]

def slugify(text):
    text = re.sub(r'<[^>]+>', '', text)
    text = text.strip().lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text or "section"

def parse_inline(text):
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong class="text-white font-bold">\1</strong>', text)
    text = re.sub(r'\*(.+?)\*', r'<em class="text-slate-200">\1</em>', text)
    text = re.sub(r'(?<!\w)_(.+?)_(?!\w)', r'<em class="text-slate-200">\1</em>', text)
    text = re.sub(r'`([^`]+)`', r'<code class="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 font-mono text-[11px] border border-slate-800">\1</code>', text)
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2" class="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition font-medium">\1</a>', text)
    return text

def parse_markdown(md_text):
    lines = md_text.splitlines()
    html_out = []
    toc_items = []
    
    in_code = False
    code_lang = ""
    code_lines = []
    
    in_table = False
    table_lines = []
    
    in_list = False
    list_type = "ul"
    
    def flush_table():
        nonlocal in_table, table_lines, html_out
        if not table_lines:
            return
        
        rows = [t.strip().strip('|').split('|') for t in table_lines if t.strip()]
        if len(rows) >= 2:
            headers = [c.strip() for c in rows[0]]
            body_rows = rows[2:] if len(rows) > 2 else []
            
            tbl_html = ['<div class="overflow-x-auto my-6 rounded-xl border border-slate-800 bg-slate-950/80 shadow-lg">',
                        '<table class="w-full text-left text-xs text-slate-300 border-collapse">',
                        '<thead><tr class="bg-slate-900 border-b border-slate-800 text-slate-200 font-mono text-[11px]">']
            for h in headers:
                tbl_html.append(f'<th class="py-3 px-4 font-bold">{parse_inline(h)}</th>')
            tbl_html.append('</tr></thead><tbody>')
            
            for idx, row in enumerate(body_rows):
                bg = 'bg-slate-950/40' if idx % 2 == 0 else 'bg-slate-900/30'
                tbl_html.append(f'<tr class="{bg} border-b border-slate-900 hover:bg-slate-800/40 transition">')
                for cell in row:
                    tbl_html.append(f'<td class="py-2.5 px-4">{parse_inline(cell.strip())}</td>')
                tbl_html.append('</tr>')
            tbl_html.append('</tbody></table></div>')
            html_out.append('\n'.join(tbl_html))
        in_table = False
        table_lines = []

    def flush_list():
        nonlocal in_list, html_out
        if in_list:
            html_out.append('</ul>' if list_type == "ul" else '</ol>')
            in_list = False

    code_counter = 0

    for line in lines:
        stripped = line.strip()
        
        # Code fence
        if stripped.startswith('```'):
            if in_code:
                code_content = '\n'.join(code_lines)
                escaped_code = html.escape(code_content)
                code_counter += 1
                code_id = f"snippet-{code_counter}"
                html_out.append(f'''
<div class="relative my-5 rounded-xl border border-slate-800 bg-[#06090e] shadow-xl overflow-hidden group">
  <div class="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-xs font-mono text-slate-400">
    <span class="flex items-center gap-1.5 font-bold text-cyan-400">
      <span>💻</span> <span>{code_lang.upper() if code_lang else "TEXT / SCRIPT"}</span>
    </span>
    <button onclick="navigator.clipboard.writeText(document.getElementById('{code_id}').innerText); alert('Copied to clipboard!');" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-600 hover:text-black text-slate-300 font-mono text-[11px] transition flex items-center gap-1">
      <span>📋</span> <span>Copy Code</span>
    </button>
  </div>
  <pre id="{code_id}" class="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed"><code>{escaped_code}</code></pre>
</div>''')
                in_code = False
                code_lang = ""
                code_lines = []
            else:
                flush_table()
                flush_list()
                in_code = True
                code_lang = stripped[3:].strip()
                code_lines = []
            continue
            
        if in_code:
            code_lines.append(line)
            continue
            
        # Table lines
        if stripped.startswith('|') and stripped.endswith('|'):
            flush_list()
            in_table = True
            table_lines.append(stripped)
            continue
        elif in_table:
            flush_table()
            
        # Headings
        header_match = re.match(r'^(#{1,6})\s+(.*)$', stripped)
        if header_match:
            flush_list()
            level = len(header_match.group(1))
            htext = header_match.group(2).strip()
            anchor_id = slugify(htext)
            
            if level in [2, 3]:
                clean_title = re.sub(r'<[^>]+>', '', htext)
                clean_title = re.sub(r'[*_`]', '', clean_title)
                toc_items.append({
                    "level": level,
                    "title": clean_title,
                    "id": anchor_id
                })
            
            if level == 1:
                html_out.append(f'<h1 id="{anchor_id}" class="text-2xl sm:text-3xl font-black text-white font-mono mt-8 mb-4 border-b border-slate-800 pb-3 flex items-center gap-3"><span class="text-cyan-400">#</span> {parse_inline(htext)}</h1>')
            elif level == 2:
                html_out.append(f'<h2 id="{anchor_id}" class="text-xl sm:text-2xl font-bold text-white font-mono mt-10 mb-4 border-b border-slate-800/80 pb-2 flex items-center gap-2.5"><span class="text-emerald-400">##</span> {parse_inline(htext)}</h2>')
            elif level == 3:
                html_out.append(f'<h3 id="{anchor_id}" class="text-base sm:text-lg font-bold text-cyan-300 font-mono mt-6 mb-3 flex items-center gap-2"><span class="text-slate-500">###</span> {parse_inline(htext)}</h3>')
            elif level == 4:
                html_out.append(f'<h4 id="{anchor_id}" class="text-sm font-bold text-amber-300 font-mono mt-4 mb-2">{parse_inline(htext)}</h4>')
            else:
                html_out.append(f'<h5 id="{anchor_id}" class="text-xs font-bold text-slate-300 font-mono mt-3 mb-1">{parse_inline(htext)}</h5>')
            continue
            
        # Blockquote
        if stripped.startswith('>'):
            flush_list()
            quote_text = stripped[1:].strip()
            html_out.append(f'''
<blockquote class="my-4 p-4 rounded-xl border-l-4 border-cyan-500 bg-slate-900/60 text-slate-300 text-xs md:text-sm font-sans italic shadow-sm leading-relaxed">
  {parse_inline(quote_text)}
</blockquote>''')
            continue
            
        # Lists
        if stripped.startswith(('- ', '* ', '- [ ]', '- [x]')):
            if not in_list:
                in_list = True
                list_type = "ul"
                html_out.append('<ul class="my-3 space-y-1.5 text-xs text-slate-300 list-none pl-2">')
            
            # Checkbox
            if stripped.startswith('- [ ]'):
                item_content = stripped[5:].strip()
                html_out.append(f'<li class="flex items-start gap-2"><span class="text-slate-500 font-mono text-sm">☐</span> <span>{parse_inline(item_content)}</span></li>')
            elif stripped.startswith('- [x]'):
                item_content = stripped[5:].strip()
                html_out.append(f'<li class="flex items-start gap-2"><span class="text-emerald-400 font-mono text-sm">☑</span> <span class="line-through text-slate-500">{parse_inline(item_content)}</span></li>')
            else:
                item_content = stripped[2:].strip()
                html_out.append(f'<li class="flex items-start gap-2"><span class="text-cyan-400 font-mono text-xs mt-0.5">•</span> <span>{parse_inline(item_content)}</span></li>')
            continue
        elif in_list and not stripped:
            flush_list()
            continue
            
        # Ordered list
        num_match = re.match(r'^(\d+)\.\s+(.*)$', stripped)
        if num_match:
            if not in_list or list_type != "ol":
                flush_list()
                in_list = True
                list_type = "ol"
                html_out.append('<ol class="my-3 space-y-1.5 text-xs text-slate-300 list-none pl-2">')
            num_val = num_match.group(1)
            item_content = num_match.group(2)
            html_out.append(f'<li class="flex items-start gap-2"><span class="text-cyan-400 font-mono font-bold text-xs">{num_val}.</span> <span>{parse_inline(item_content)}</span></li>')
            continue
            
        # Horizontal rule
        if stripped in ['---', '***', '___']:
            flush_list()
            html_out.append('<hr class="my-8 border-slate-800/80">')
            continue
            
        # Regular paragraph
        if stripped:
            flush_list()
            html_out.append(f'<p class="my-3 text-xs md:text-sm text-slate-300 leading-relaxed font-sans">{parse_inline(stripped)}</p>')
        else:
            flush_list()
            
    flush_table()
    flush_list()
    
    return '\n'.join(html_out), toc_items

def generate_step_html(doc_info, prev_doc, next_doc, all_docs):
    md_path = os.path.join(MARKETING_DIR, doc_info["md_file"])
    with open(md_path, "r", encoding="utf-8") as f:
        md_content = f.read()
        
    body_html, toc_items = parse_markdown(md_content)
    
    # Generate Table of Contents Links
    toc_links = []
    for item in toc_items:
        indent = "pl-2" if item["level"] == 2 else "pl-5 text-slate-400 text-[11px]"
        icon = "▪" if item["level"] == 2 else "▫"
        toc_links.append(f'''
          <a href="#{item['id']}" class="block py-1 text-xs hover:text-cyan-300 transition {indent} truncate flex items-center gap-1.5">
            <span class="text-cyan-500 font-mono text-[10px]">{icon}</span>
            <span>{html.escape(item['title'])}</span>
          </a>
        ''')
        
    toc_html = "\n".join(toc_links) if toc_links else "<p class='text-xs text-slate-500 italic'>Standard section navigation.</p>"
    
    # Nav Links
    prev_link = f'<a href="{prev_doc["html_file"]}" class="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-mono"><span>&larr;</span> <span>Step {prev_doc["num"]}</span></a>' if prev_doc else '<span class="text-slate-600 text-xs font-mono">&larr; First Step</span>'
    next_link = f'<a href="{next_doc["html_file"]}" class="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-extrabold transition flex items-center gap-1.5 text-xs font-mono shadow"><span>Step {next_doc["num"]}</span> <span>&rarr;</span></a>' if next_doc else '<a href="index.html" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold transition flex items-center gap-1.5 text-xs font-mono shadow"><span>Return to Dashboard</span> <span>&check;</span></a>'

    full_html = f'''<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Step {doc_info["num"]}: {doc_info["title"]} — Siliquarium Marketing</title>
  <meta name="author" content="Ian Ohlander / Jack Vance">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body {{ font-family: 'Inter', sans-serif; background-color: #020617; color: #f8fafc; }}
    .font-mono {{ font-family: 'Space Mono', monospace; }}
    .rainbow-border {{ background: linear-gradient(90deg, #38bdf8 0%, #06b6d4 25%, #10b981 50%, #fbbf24 75%, #f43f5e 100%); }}
    .card-box {{ background: #090e1a; border: 1px solid #1e293b; border-radius: 0.75rem; }}
    ::-webkit-scrollbar {{ width: 8px; height: 8px; }}
    ::-webkit-scrollbar-track {{ background: #020617; }}
    ::-webkit-scrollbar-thumb {{ background: #1e293b; border-radius: 4px; }}
    ::-webkit-scrollbar-thumb:hover {{ background: #38bdf8; }}
  </style>
</head>
<body class="min-h-screen flex flex-col antialiased selection:bg-cyan-500 selection:text-black">

  <div class="h-1.5 w-full rainbow-border sticky top-0 z-50"></div>

  <!-- Top Sticky Navigation Bar -->
  <header class="bg-[#090e1a]/95 border-b border-[#1e293b] px-6 py-3 flex flex-wrap items-center justify-between shadow-md gap-4 sticky top-1.5 z-40 backdrop-blur-md">
    <div class="flex items-center space-x-3">
      <a href="index.html" class="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow text-black font-extrabold text-base hover:scale-105 transition">
        🐠
      </a>
      <div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">Step {doc_info["num"]} &bull; Marketing Suite</span>
          <span class="px-2 py-0.5 rounded text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">{doc_info["badge"]}</span>
        </div>
        <h1 class="text-sm md:text-base font-extrabold text-white truncate max-w-xl">{doc_info["title"]}</h1>
      </div>
    </div>

    <!-- Quick Navigation Links -->
    <div class="flex items-center space-x-2 text-xs font-mono">
      {prev_link}
      <a href="index.html" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg transition border border-slate-700 flex items-center gap-1">
        <span>🏠</span> <span>Operations Center</span>
      </a>
      {next_link}
      <a href="../index.html" class="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-200 rounded-lg transition border border-cyan-800 hidden sm:inline-flex items-center gap-1">
        <span>⚡</span> <span>Simulator</span>
      </a>
      <a href="../docs/CURRICULUM_AND_SYLLABUS.html" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition border border-slate-700 hidden md:inline-flex items-center gap-1">
        <span>📑</span> <span>Curriculum</span>
      </a>
    </div>
  </header>

  <!-- Two-Column Layout: Sidebar TOC + Main Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
    
    <!-- LEFT SIDEBAR: STICKY TABLE OF CONTENTS -->
    <aside class="lg:col-span-4 space-y-4 lg:sticky lg:top-16">
      
      <!-- Current Step Meta Card -->
      <div class="card-box p-4 border-l-4 border-l-cyan-500 shadow-md">
        <div class="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
          <span>OPERATIONAL STEP</span>
          <span class="text-cyan-400 font-bold">#{doc_info["num"]} OF 06</span>
        </div>
        <h3 class="font-extrabold text-white text-base leading-tight mb-1">{doc_info["title"]}</h3>
        <p class="text-xs text-slate-400 font-sans">{doc_info["subtitle"]}</p>
      </div>

      <!-- Table of Contents Nav Box -->
      <div class="card-box p-4 shadow-md max-h-[68vh] flex flex-col">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
          <span class="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>📑</span> <span>Table of Contents</span>
          </span>
          <span class="text-[10px] font-mono text-slate-500">Jump to section</span>
        </div>
        <div class="overflow-y-auto space-y-0.5 pr-1">
          {toc_html}
        </div>
      </div>

      <!-- Quick Steps Navigation Matrix -->
      <div class="card-box p-4 shadow-md space-y-2">
        <span class="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-800 pb-1.5">
          All 7 Marketing Steps
        </span>
        <div class="grid grid-cols-7 gap-1 font-mono text-center text-xs">
          {''.join([f'<a href="{d["html_file"]}" title="{d["title"]}" class="py-1.5 rounded {"bg-cyan-500 text-black font-extrabold shadow" if d["id"] == doc_info["id"] else "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"} transition">{d["num"]}</a>' for d in all_docs])}
        </div>
      </div>

      <!-- Simulator Direct Link -->
      <a href="../index.html" class="block card-box p-3 hover:border-cyan-500 transition group text-center">
        <span class="text-xs font-mono text-cyan-400 group-hover:text-cyan-300 font-bold flex items-center justify-center gap-1.5">
          <span>🌊</span> <span>Launch 3D Seafloor Visualizer</span> <span>&rarr;</span>
        </span>
      </a>

    </aside>

    <!-- RIGHT COLUMN: MAIN CONTENT -->
    <main class="lg:col-span-8 card-box p-6 md:p-10 shadow-xl overflow-hidden leading-relaxed">
      
      <!-- Document Banner -->
      <div class="mb-6 pb-6 border-b border-slate-800 space-y-2">
        <div class="flex flex-wrap items-center gap-2">
          <span class="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold uppercase tracking-wider">
            Siliquarium Commercialization &bull; Step {doc_info["num"]}
          </span>
          <span class="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-xs font-mono border border-slate-800">
            Author: Jack "The Closer" Vance
          </span>
        </div>
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-white font-mono tracking-tight">
          {doc_info["title"]}
        </h1>
        <p class="text-sm text-slate-400 font-sans">
          {doc_info["subtitle"]}
        </p>
      </div>

      <!-- Parsed Body Content -->
      <article class="prose prose-invert max-w-none space-y-4">
        {body_html}
      </article>

      <!-- Bottom Navigation Footer -->
      <div class="mt-12 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          {prev_link}
        </div>
        <div class="flex items-center gap-2">
          <a href="index.html" class="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition">
            🏠 Back to Dashboard
          </a>
          {next_link}
        </div>
      </div>

    </main>

  </div>

  <!-- Master Footer -->
  <footer class="bg-[#050811] border-t border-[#1e293b] py-8 text-center text-xs text-gray-500 font-mono mt-16">
    <div class="max-w-7xl mx-auto px-4 space-y-2">
      <p class="text-slate-400 font-bold">Siliquarium &bull; Open-Ended Digital Life &amp; Silicon Abiogenesis Platform</p>
      <p class="text-slate-500">Commercial Architecture &amp; Hosted SaaS Blueprint by Jack "The Closer" Vance.</p>
      <p class="text-slate-600 text-[11px]">&copy; 2026 Ian Ohlander. All rights reserved. Strict First-Law Conservation &bull; The Epistemic Cut &bull; Uri Alon Motifs.</p>
    </div>
  </footer>

</body>
</html>'''

    out_path = os.path.join(MARKETING_DIR, doc_info["html_file"])
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(full_html)
    print(f"Generated: {doc_info['html_file']}")
    return toc_items

def generate_index_html(all_docs, all_tocs):
    toc_cards = []
    for doc in all_docs:
        tocs = all_tocs.get(doc["id"], [])
        key_sections = [t["title"] for t in tocs if t["level"] == 2][:4]
        sections_list = "".join([f'<li class="flex items-center gap-1.5 text-xs text-slate-400 truncate"><span class="text-cyan-400 font-mono">▪</span> <span>{s}</span></li>' for s in key_sections]) if key_sections else '<li class="text-xs text-slate-500 italic">Core operational instructions</li>'
        
        toc_cards.append(f'''
        <div class="card-box p-5 md:p-6 space-y-4 hover:border-cyan-500/80 transition group shadow-lg flex flex-col justify-between">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <span class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-base">
                  {doc["icon"]}
                </span>
                <span class="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  STEP {doc["num"]}
                </span>
              </div>
              <span class="px-2.5 py-0.5 rounded text-[11px] font-mono bg-{doc['badge_color']}-950 text-{doc['badge_color']}-300 border border-{doc['badge_color']}-800">
                {doc["badge"]}
              </span>
            </div>

            <div>
              <h3 class="text-lg font-bold text-white group-hover:text-cyan-300 transition leading-snug">
                <a href="{doc["html_file"]}" class="focus:outline-none">
                  {doc["title"]}
                </a>
              </h3>
              <p class="text-xs text-slate-400 font-sans mt-1 line-clamp-2">
                {doc["subtitle"]}
              </p>
            </div>

            <div class="border-t border-slate-900 pt-3">
              <span class="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1.5">Key Sections Inside:</span>
              <ul class="space-y-1">
                {sections_list}
              </ul>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span class="text-[11px] font-mono text-slate-500">Read &bull; 8&ndash;15 mins</span>
            <a href="{doc["html_file"]}" class="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 hover:text-black text-cyan-300 font-mono text-xs font-bold transition flex items-center gap-1.5 shadow">
              <span>Open Step {doc["num"]}</span> <span>&rarr;</span>
            </a>
          </div>
        </div>''')

    index_html = f'''<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Siliquarium — Master Commercial Operations Center</title>
  <meta name="author" content="Ian Ohlander / Jack Vance">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body {{ font-family: 'Inter', sans-serif; background-color: #020617; color: #f8fafc; }}
    .font-mono {{ font-family: 'Space Mono', monospace; }}
    .rainbow-border {{ background: linear-gradient(90deg, #38bdf8 0%, #06b6d4 25%, #10b981 50%, #fbbf24 75%, #f43f5e 100%); }}
    .card-box {{ background: #090e1a; border: 1px solid #1e293b; border-radius: 0.75rem; }}
    ::-webkit-scrollbar {{ width: 8px; height: 8px; }}
    ::-webkit-scrollbar-track {{ background: #020617; }}
    ::-webkit-scrollbar-thumb {{ background: #1e293b; border-radius: 4px; }}
    ::-webkit-scrollbar-thumb:hover {{ background: #38bdf8; }}
  </style>
</head>
<body class="min-h-screen flex flex-col antialiased selection:bg-cyan-500 selection:text-black">

  <div class="h-1.5 w-full rainbow-border sticky top-0 z-50"></div>

  <!-- Header -->
  <header class="bg-[#090e1a]/95 border-b border-[#1e293b] px-6 py-4 flex flex-wrap items-center justify-between shadow-md gap-4 sticky top-1.5 z-40 backdrop-blur-md">
    <div class="flex items-center space-x-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-emerald-500 to-amber-500 flex items-center justify-center shadow text-black font-extrabold text-xl">
        🐠
      </div>
      <div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase">Commercial Operations Center</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">Turnkey Hosted SaaS Edition</span>
        </div>
        <h1 class="text-base md:text-lg font-extrabold text-white">Siliquarium: Turnkey Marketing &amp; Monetization Engine</h1>
      </div>
    </div>
    <div class="flex items-center space-x-3 text-xs font-mono">
      <a href="../index.html" class="px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-extrabold rounded-lg transition shadow flex items-center gap-1.5">
        <span>🌊</span> <span>Launch Simulator</span>
      </a>
      <a href="../docs/CURRICULUM_AND_SYLLABUS.html" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg transition border border-slate-700 flex items-center gap-1">
        <span>📑</span> <span>Open Curriculum (12 Vols)</span>
      </a>
      <a href="../docs/THEORETICAL_MODEL.html" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition border border-slate-700 hidden sm:inline-flex items-center gap-1">
        <span>📜</span> <span>Theoretical Model</span>
      </a>
    </div>
  </header>

  <!-- Hero Banner -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full space-y-10">

    <!-- Jack Vance Strategic Directive Banner -->
    <section class="card-box p-6 md:p-8 space-y-6 border-l-4 border-l-cyan-500 shadow-2xl relative overflow-hidden">
      <div class="flex flex-wrap items-start justify-between gap-4 border-b border-[#1e293b] pb-4">
        <div>
          <span class="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[11px] font-mono font-bold uppercase tracking-wider">
            Chief Marketing Officer &bull; Strategic Briefing
          </span>
          <h2 class="text-2xl sm:text-3xl font-black text-white mt-2">
            "Zero Overhead. Zero Tax Liability. From Abiotic Vents to Autopoietic Life."
          </h2>
          <p class="text-xs sm:text-sm text-slate-300 font-sans mt-2 max-w-4xl leading-relaxed">
            Welcome to the Siliquarium Commercial Operations Center. Here lies your complete, turnkey marketing and monetization system. We have eliminated all payment plumbing friction, protected you from US multi-state sales tax and global VAT liability via <strong>Lemon Squeezy as Merchant of Record</strong>, grounded our narrative in Richard Dawkins's foundational philosophy (<em>The Greatest Show on Earth</em> &amp; <em>The Genetic Book of the Dead</em>), incorporated the viral social power of <strong>"The Abyssal Arena" Gladiatorial Battler</strong>, and decoupled compute via the <strong>HeadlessSimulationHost</strong> for 24/7 deep-time persistent evolution.
          </p>
        </div>
        <div class="bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-right font-mono text-xs">
          <div class="text-slate-400">Net Profit Margin</div>
          <div class="text-emerald-400 font-bold text-xl">&sim; 93% &ndash; 95%</div>
          <div class="text-[10px] text-cyan-300">$0.00 Marginal Client Compute</div>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex flex-wrap gap-3 font-mono text-xs">
        <a href="00_executive_summary_and_quickstart.html" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-extrabold rounded-lg transition shadow flex items-center gap-1.5">
          <span>⚡</span> <span>Start Sprint 1: 30-Day Quickstart</span>
        </a>
        <a href="01_turnkey_monetization_and_hosted_saas_blueprint.html" class="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-extrabold rounded-lg transition shadow flex items-center gap-1.5">
          <span>💳</span> <span>Setup Lemon Squeezy Store</span>
        </a>
        <a href="03_creator_and_influencer_outreach_playbook.html" class="px-4 py-2 bg-sky-950 hover:bg-sky-900 text-sky-200 border border-sky-800 rounded-lg transition flex items-center gap-1.5">
          <span>📖</span> <span>Send Dawkins Homage Letter</span>
        </a>
        <a href="04_historical_connections_and_academic_expansion.html" class="px-4 py-2 bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-800 rounded-lg transition flex items-center gap-1.5">
          <span>🎓</span> <span>Send Mentor Letters</span>
        </a>
      </div>
    </section>

    <!-- CRITICAL ARCHITECTURAL CLARIFICATIONS -->
    <section class="space-y-6">
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 class="text-lg font-bold font-mono text-white flex items-center gap-2">
          <span>🔍</span> Strategic Answers: Hosted SaaS, The Dawkins Homage &amp; The Abyssal Arena
        </h3>
        <span class="text-xs font-mono text-cyan-400">Pillars of the Commercial Engine</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">

        <!-- Question 1: Open Documentation from Day One -->
        <div class="card-box p-5 space-y-3 border-emerald-500/40">
          <div class="flex items-center justify-between">
            <span class="text-emerald-400 font-bold font-mono text-sm">1. Open Curriculum</span>
            <span class="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono">100% Free Access</span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed font-sans">
            <strong>"Would we not supply the documentation as part of the application from the get-go?"</strong><br><br>
            <strong class="text-emerald-300">YES, Absolutely!</strong> The entire 12-volume curriculum, 154 primary citations, 5 hands-on lab practicums, and translation matrices remain <strong>100% open and free online from day one</strong>. Open documentation is our greatest credibility engine and top-of-funnel organic SEO hook.
          </p>
        </div>

        <!-- Question 2: The Hosted Persistent Advantage -->
        <div class="card-box p-5 space-y-3 border-cyan-500/40">
          <div class="flex items-center justify-between">
            <span class="text-cyan-400 font-bold font-mono text-sm">2. Hosted Cloud Server</span>
            <span class="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-mono">Persistent 24/7</span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed font-sans">
            <strong>"How does hosting maximize size and performance?"</strong><br><br>
            By decoupling execution into the Node.js <code class="text-cyan-300 font-mono">HeadlessSimulationHost</code> with native Server-Sent Events (SSE), simulations run <strong>24/7 deep time (100,000+ ticks)</strong> without browser tab sleep or memory caps, unlocking massive seafloor grids and multi-user research observation!
          </p>
        </div>

        <!-- Question 3: The Abyssal Arena Battler -->
        <div class="card-box p-5 space-y-3 border-amber-500/40">
          <div class="flex items-center justify-between">
            <span class="text-amber-400 font-bold font-mono text-sm">3. The Abyssal Arena</span>
            <span class="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] font-mono">Social Virality</span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed font-sans">
            <strong>"Can users pit evolved Silicoids against each other?"</strong><br><br>
            <strong class="text-amber-300">YES! It is the Viral Engine.</strong> Players freeze champion strains in the BioBank and drop them into standardized hydrothermal gauntlets (The Sulfur Caldera, The Toxic Geyser). Matches output compressed 1-click replay URLs to share on Reddit/Discord!
          </p>
        </div>

        <!-- Question 4: The Darwinian Master Bundle -->
        <div class="card-box p-5 space-y-3 border-purple-500/40">
          <div class="flex items-center justify-between">
            <span class="text-purple-400 font-bold font-mono text-sm">4. The Master Bundle</span>
            <span class="px-2 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px] font-mono">Cross-Sell</span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed font-sans">
            <strong>"Should BooleanGA and Siliquarium be bundled?"</strong><br><br>
            <strong class="text-purple-300">YES! The Dawkins Homage.</strong> BooleanGA is Directed Evolution (Selective Breeding / CPU synthesis); Siliquarium is Undirected Evolution (Natural Selection / Abiogenesis). Together at $69.99, they prove Darwinian evolution in full!
          </p>
        </div>

      </div>
    </section>

    <!-- MASTER TABLE OF CONTENTS: 9 STRATEGY GUIDES -->
    <section class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <span class="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">Turnkey Execution Suite</span>
          <h3 class="text-2xl font-bold font-mono text-white mt-1">
            Master Table of Contents &bull; Steps 00 through 08
          </h3>
        </div>
        <span class="text-xs font-mono text-slate-400">Click any section to jump directly to its operational manual</span>
      </div>

      <!-- 7 Step Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {"".join(toc_cards)}
      </div>
    </section>

  </main>

  <!-- Footer -->
  <footer class="bg-[#050811] border-t border-[#1e293b] py-12 text-center text-xs text-gray-500 font-mono mt-20">
    <div class="max-w-6xl mx-auto px-4 space-y-3">
      <p class="text-slate-400 font-bold">Siliquarium &bull; Open-Ended Digital Life &amp; Silicon Abiogenesis Platform</p>
      <p class="text-slate-500">Commercial Architecture &amp; Execution Playbook authored by Jack "The Closer" Vance.</p>
      <p class="text-slate-600 text-[11px]">&copy; 2026 Ian Ohlander. All rights reserved. Zero-Smuggling Mandate &bull; 154 Primary Citations &bull; Hosted Persistent Cloud Engine.</p>
    </div>
  </footer>

</body>
</html>'''

    index_path = os.path.join(MARKETING_DIR, "index.html")
    with open(index_path, "w", encoding="utf-8") as f:
        f.write(index_html)
    print(f"Generated: index.html")

def main():
    print("Building Siliquarium Marketing HTML Suite...")
    all_tocs = {}
    
    for i, doc in enumerate(DOCS_CONFIG):
        prev_doc = DOCS_CONFIG[i-1] if i > 0 else None
        next_doc = DOCS_CONFIG[i+1] if i < len(DOCS_CONFIG)-1 else None
        tocs = generate_step_html(doc, prev_doc, next_doc, DOCS_CONFIG)
        all_tocs[doc["id"]] = tocs
        
    generate_index_html(DOCS_CONFIG, all_tocs)
    print("All Siliquarium marketing HTML pages built successfully!")

if __name__ == "__main__":
    main()
