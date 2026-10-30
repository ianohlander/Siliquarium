import fs from 'fs';
import path from 'path';

function findHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file.startsWith('.')) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(findHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = findHtmlFiles('.');
console.log(`Auditing math rendering in ${htmlFiles.length} compiled HTML files...`);

let issues = [];

for (const file of htmlFiles) {
  if (file === 'index.html') continue; // App entry point
  const content = fs.readFileSync(file, 'utf8');

  // 1. Check for $$ inside <pre><code> or <code>
  const codeRegex = /<code[^>]*>([\s\S]*?)<\/code>/gi;
  let codeMatch;
  while ((codeMatch = codeRegex.exec(content)) !== null) {
    const codeContent = codeMatch[1];
    // If it contains display math $$ inside code tag
    if (codeContent.includes('$$')) {
      issues.push({
        file,
        type: 'Display math $$ trapped inside <code> tag',
        sample: codeContent.slice(0, 100)
      });
    }
  }

  // 2. Check for empty <p>$$</p> (broken multi-line display math)
  if (/<p>\s*\$\$\s*<\/p>/i.test(content)) {
    issues.push({
      file,
      type: 'Empty <p>$$</p> delimiter paragraph (broken multi-line blockquote math)'
    });
  }

  // 3. Check for Math Processing Error (if statically rendered)
  if (content.includes('Math Processing Error')) {
    issues.push({
      file,
      type: 'Math Processing Error string in HTML'
    });
  }

  // 4. Check for odd number of $$ delimiters in the document
  const doubleDollarCount = (content.match(/\$\$/g) || []).length;
  if (doubleDollarCount % 2 !== 0) {
    issues.push({
      file,
      type: `Odd number of $$ delimiters (${doubleDollarCount}) - unmatched display math`
    });
  }
}

console.log(`\nFound ${issues.length} HTML math issues:`);
for (const issue of issues) {
  console.log(`[${issue.file}]: ${issue.type}`);
  if (issue.sample) console.log(`   Sample: ${issue.sample}`);
}
