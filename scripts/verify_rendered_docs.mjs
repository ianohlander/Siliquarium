import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function getFiles(dir, ext) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    if (['node_modules', '.git', '.gemini', 'dist'].includes(item.name)) continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(getFiles(full, ext));
    } else if (item.name.endsWith(ext)) {
      results.push(full);
    }
  }
  return results;
}

const mdFiles = getFiles(rootDir, '.md');
const htmlFiles = getFiles(rootDir, '.html');

console.log(`Auditing ${mdFiles.length} Markdown files and ${htmlFiles.length} HTML files...`);

const report = {
  missingImagesInHtml: [],
  brokenInternalLinksInHtml: [],
  orphanCitationsInHtml: [],
  malformedMermaid: [],
  mathLatexErrors: [],
  tableErrors: [],
  svgXmlErrors: [],
  missingEquationDecoders: [],
  unannotatedSections: []
};

// 1. Audit SVG files for valid XML
const svgFiles = getFiles(rootDir, '.svg');
for (const svgFile of svgFiles) {
  const content = fs.readFileSync(svgFile, 'utf8');
  if (!content.includes('<svg') || !content.includes('</svg>')) {
    report.svgXmlErrors.push({
      file: path.relative(rootDir, svgFile),
      error: 'Missing opening or closing <svg> tag'
    });
  }
}

// 2. Audit Compiled HTML Files
for (const htmlFile of htmlFiles) {
  const relPath = path.relative(rootDir, htmlFile);
  // Skip temp or test output if any
  if (relPath.startsWith('tmp') || relPath.startsWith('dist')) continue;

  const content = fs.readFileSync(htmlFile, 'utf8');
  const htmlDir = path.dirname(htmlFile);

  // A. Check images: <img ... src="...">
  const imgRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    const src = match[1].trim();
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) continue;
    
    // Resolve relative to html file location
    const cleanSrc = src.split('?')[0].split('#')[0];
    const resolved = path.resolve(htmlDir, cleanSrc);
    if (!fs.existsSync(resolved)) {
      report.missingImagesInHtml.push({
        htmlFile: relPath,
        src,
        resolvedPath: path.relative(rootDir, resolved)
      });
    }
  }

  // B. Collect all element IDs and anchor names in this HTML file
  const elementIds = new Set();
  const idRegex = /(?:id|name)=["']([^"']+)["']/gi;
  while ((match = idRegex.exec(content)) !== null) {
    elementIds.add(match[1]);
  }

  // C. Check internal links: <a href="#..."> or <a href="file.html#...">
  const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
  while ((match = linkRegex.exec(content)) !== null) {
    const href = match[1].trim();
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('javascript:')) continue;
    
    if (href.startsWith('#')) {
      const anchor = href.slice(1);
      if (anchor && !elementIds.has(anchor)) {
        // Special case: check if it's a citation link
        if (anchor.startsWith('ref-') || anchor.startsWith('note-') || anchor.startsWith('cite_ref-') || anchor.startsWith('fnref-')) {
          report.orphanCitationsInHtml.push({
            htmlFile: relPath,
            link: href,
            anchor
          });
        } else {
          report.brokenInternalLinksInHtml.push({
            htmlFile: relPath,
            link: href,
            anchor
          });
        }
      }
    } else if (href.startsWith('file:')) {
      // Local source file link (e.g. file:///h:/.../file.ts#L10-L20)
      const [fileUrlPart] = href.split('#');
      try {
        const diskPath = fileURLToPath(decodeURIComponent(fileUrlPart));
        if (!fs.existsSync(diskPath)) {
          report.brokenInternalLinksInHtml.push({
            htmlFile: relPath,
            link: href,
            error: `Target source file not found on disk: ${diskPath}`
          });
        }
      } catch (err) {
        report.brokenInternalLinksInHtml.push({
          htmlFile: relPath,
          link: href,
          error: `Malformed file URI: ${err.message}`
        });
      }
    } else {
      // Relative file link
      const [filePath, fileAnchor] = href.split('#');
      if (filePath) {
        const resolvedTarget = path.resolve(htmlDir, filePath);
        if (!fs.existsSync(resolvedTarget)) {
          report.brokenInternalLinksInHtml.push({
            htmlFile: relPath,
            link: href,
            error: `Target file not found: ${filePath}`
          });
        } else if (fileAnchor) {
          // Target file exists, check anchor if target is HTML
          // Note: line-number anchors like #L10-L20 point to source code lines, not DOM element IDs
          if (resolvedTarget.endsWith('.html') && !/^L\d+/i.test(fileAnchor)) {
            const targetContent = fs.readFileSync(resolvedTarget, 'utf8');
            const targetIdRegex = new RegExp(`(?:id|name)=["']${fileAnchor}["']`, 'i');
            if (!targetIdRegex.test(targetContent)) {
              report.brokenInternalLinksInHtml.push({
                htmlFile: relPath,
                link: href,
                error: `Anchor '#${fileAnchor}' not found in ${path.relative(rootDir, resolvedTarget)}`
              });
            }
          }
        }
      }
    }
  }

  // D. Check Mermaid blocks inside HTML
  const mermaidRegex = /<div class="mermaid[^"]*">([\s\S]*?)<\/div>/gi;
  while ((match = mermaidRegex.exec(content)) !== null) {
    const mermaidText = match[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
    const mLines = mermaidText.split('\n');
    for (let idx = 0; idx < mLines.length; idx++) {
      const mLine = mLines[idx].trim();
      // Check for unquoted parentheses or brackets in node shapes: A[Text (Detail)]
      const unquotedInSquare = mLine.match(/\b([A-Za-z0-9_-]+)\[([^"\]\n]*\([^\)\n]*\)[^"\]\n]*)\]/);
      if (unquotedInSquare) {
        report.malformedMermaid.push({
          htmlFile: relPath,
          line: idx + 1,
          lineText: mLine,
          error: `Unquoted parentheses in node shape: ${unquotedInSquare[0]}`
        });
      }
      const unquotedInDiamond = mLine.match(/\b([A-Za-z0-9_-]+)\{([^"\}\n]*\([^\)\n]*\)[^"\}\n]*)\}/);
      if (unquotedInDiamond) {
        report.malformedMermaid.push({
          htmlFile: relPath,
          line: idx + 1,
          lineText: mLine,
          error: `Unquoted parentheses in diamond shape: ${unquotedInDiamond[0]}`
        });
      }
    }
  }
}

// 3. Audit Markdown Files for Math & Structure
for (const mdFile of mdFiles) {
  const relPath = path.relative(rootDir, mdFile);
  const content = fs.readFileSync(mdFile, 'utf8');
  const lines = content.split('\n');

  let inCodeBlock = false;
  let inDisplayMath = false;
  let mathStart = 0;
  let mathLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // Check display math
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 2) {
      const expr = trimmed.slice(2, -2);
      checkLatex(relPath, i + 1, expr, trimmed);
    } else if (trimmed.startsWith('$$')) {
      if (inDisplayMath) {
        inDisplayMath = false;
        checkLatex(relPath, mathStart, mathLines.join('\n'), mathLines[0]);
        mathLines = [];
      } else {
        inDisplayMath = true;
        mathStart = i + 1;
        mathLines = [trimmed.slice(2)];
      }
    } else if (inDisplayMath) {
      if (trimmed.endsWith('$$')) {
        inDisplayMath = false;
        mathLines.push(trimmed.slice(0, -2));
        checkLatex(relPath, mathStart, mathLines.join('\n'), mathLines[0]);
        mathLines = [];
      } else {
        mathLines.push(line);
      }
    }

    // Check tables outside code blocks
    // (Only if lines have pipes and aren't ASCII art)
  }

  if (inDisplayMath) {
    report.mathLatexErrors.push({
      file: relPath,
      line: mathStart,
      error: 'Unclosed display math block'
    });
  }
}

function checkLatex(file, line, latex, snippet) {
  let openBraces = 0;
  let inEscape = false;
  for (let i = 0; i < latex.length; i++) {
    const ch = latex[i];
    if (inEscape) {
      inEscape = false;
      continue;
    }
    if (ch === '\\') {
      inEscape = true;
      continue;
    }
    if (ch === '{') openBraces++;
    if (ch === '}') openBraces--;
    if (openBraces < 0) {
      report.mathLatexErrors.push({
        file,
        line,
        error: "Extra closing brace '}' in LaTeX",
        snippet: snippet.trim().slice(0, 80)
      });
      return;
    }
  }
  if (openBraces > 0) {
    report.mathLatexErrors.push({
      file,
      line,
      error: `Unclosed brace '{' (${openBraces} unclosed) in LaTeX`,
      snippet: snippet.trim().slice(0, 80)
    });
  }
}

console.log('\n================================================================================');
console.log('AUDIT FINDINGS SUMMARY');
console.log('================================================================================\n');

console.log(`Missing Image Assets in HTML: ${report.missingImagesInHtml.length}`);
for (const item of report.missingImagesInHtml) {
  console.log(`  ❌ [${item.htmlFile}] src="${item.src}" -> resolved "${item.resolvedPath}" not found`);
}

console.log(`\nMalformed Mermaid Blocks: ${report.malformedMermaid.length}`);
for (const item of report.malformedMermaid) {
  console.log(`  ❌ [${item.htmlFile}:${item.line}] ${item.error}\n     Line: ${item.lineText}`);
}

console.log(`\nLaTeX Math Syntax Errors: ${report.mathLatexErrors.length}`);
for (const item of report.mathLatexErrors) {
  console.log(`  ❌ [${item.file}:${item.line}] ${item.error}\n     Snippet: ${item.snippet}`);
}

console.log(`\nOrphan Citations in HTML (#ref-X or #note-X not found on page): ${report.orphanCitationsInHtml.length}`);
for (const item of report.orphanCitationsInHtml.slice(0, 30)) {
  console.log(`  ⚠️ [${item.htmlFile}] link "${item.link}"`);
}
if (report.orphanCitationsInHtml.length > 30) {
  console.log(`  ... and ${report.orphanCitationsInHtml.length - 30} more`);
}

console.log(`\nBroken Internal Links in HTML: ${report.brokenInternalLinksInHtml.length}`);
for (const item of report.brokenInternalLinksInHtml.slice(0, 30)) {
  console.log(`  ❌ [${item.htmlFile}] ${item.error || item.link}`);
}
if (report.brokenInternalLinksInHtml.length > 30) {
  console.log(`  ... and ${report.brokenInternalLinksInHtml.length - 30} more`);
}
