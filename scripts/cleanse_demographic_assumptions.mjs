// scripts/cleanse_demographic_assumptions.mjs
// Cleanses all demographic assumption terms across markdown documentation to enforce professional neutrality.

import fs from 'fs';
import path from 'path';

const TARGET_DIRS = ['docs', 'standards'];

function getMdFiles(dir) {
  let res = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      res = res.concat(getMdFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      res.push(full);
    }
  }
  return res;
}

const allFiles = TARGET_DIRS.flatMap(getMdFiles);
console.log(`Auditing ${allFiles.length} markdown files for demographic assumptions...`);

let replacementsCount = 0;

for (const filePath of allFiles) {
  let text = fs.readFileSync(filePath, 'utf8');
  let original = text;

  // Specific contextual replacements
  text = text.replace(/A Teacher's Orientation/gi, "Foundational Orientation");
  text = text.replace(/Teacher's Note/gi, "Investigator Note");
  text = text.replace(/teacher's note/gi, "investigator note");
  text = text.replace(/High School STEM, Undergraduate/gi, "Foundational Biophysics & Advanced Systems Biology");
  text = text.replace(/High School STEM/gi, "Foundational Biophysics");
  text = text.replace(/high school STEM/gi, "foundational biophysics");
  text = text.replace(/high school and undergraduate/gi, "introductory and advanced");
  text = text.replace(/high school/gi, "foundational");
  text = text.replace(/undergraduate biophysics/gi, "advanced biophysics");
  text = text.replace(/undergraduate biology/gi, "systems biology");
  text = text.replace(/undergraduate and graduate/gi, "foundational and advanced");
  text = text.replace(/undergraduate students/gi, "researchers");
  text = text.replace(/undergraduates/gi, "investigators");
  text = text.replace(/undergraduate/gi, "foundational");

  // Generalized replacements
  text = text.replace(/\bstudents\b/g, "investigators");
  text = text.replace(/\bStudents\b/g, "Investigators");
  text = text.replace(/\bstudent\b/g, "investigator");
  text = text.replace(/\bStudent\b/g, "Investigator");

  if (text !== original) {
    fs.writeFileSync(filePath, text, 'utf8');
    replacementsCount++;
    console.log(`Cleaned demographic terms in: ${filePath}`);
  }
}

console.log(`Successfully cleansed demographic assumptions across ${replacementsCount} files.`);
