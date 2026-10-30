import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const banner = `> [!IMPORTANT]
> **Independent Scientific Instrument & Non-Accreditation Notice:**  
> The Siliquarium application, theoretical model, and documentation are not designed, developed, peer-reviewed, or sponsored by any accredited university, government research agency, or academic accreditation board. Because this project represents an independent computational biophysics instrument, every statement, equation, and evolutionary claim is accompanied below by full mathematical derivations, thermodynamic proofs, and peer-reviewed scientific citations.
>
> 📖 **Circuit Paleontology Companion Reference Suite:**  
> [📖 Paleontology Glossary](CIRCUIT_PALEONTOLOGY_GLOSSARY.html) | [📚 Annotated Bibliography](CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.html) | [📝 Critical Notes & Justifications](CIRCUIT_PALEONTOLOGY_NOTES.html) | [🏛️ Master Documentation Portal](index.html)
`;

// 1. Patch THEORETICAL_MODEL.md
const tmPath = path.join(rootDir, 'THEORETICAL_MODEL.md');
let tmContent = fs.readFileSync(tmPath, 'utf8');
if (!tmContent.includes('Independent Scientific Instrument & Non-Accreditation Notice')) {
  tmContent = tmContent.replace(
    /# 🌊 Siliquarium: The Theoretical Model\n\*Autopoietic Digital Life, Silicon Abiogenesis, and Spatial Ecosystem Dynamics\*\n\n---\n/m,
    `# 🌊 Siliquarium: The Theoretical Model
*Autopoietic Digital Life, Silicon Abiogenesis, and Spatial Ecosystem Dynamics*

---

${banner}
---
`
  );

  // Annotate key claims
  tmContent = tmContent.replace(
    /Humberto Maturana and Francisco Varela\)\./g,
    'Humberto Maturana and Francisco Varela) [[Note 1]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-1).'
  );
  tmContent = tmContent.replace(
    /### The Dilution Catastrophe & Why Vents Beat Solar Gradients/g,
    '### The Dilution Catastrophe & Why Vents Beat Solar Gradients [[Note 4]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-4)'
  );
  tmContent = tmContent.replace(
    /Rolf Landauer's thermodynamic dissipation \(\$k_B T \\ln 2\$\)/g,
    "Rolf Landauer's thermodynamic dissipation ($k_B T \\ln 2$) [[Note 5]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-5)"
  );
  tmContent = tmContent.replace(
    /Howard Pattee's Epistemic Cut/g,
    "Howard Pattee's Epistemic Cut [[Note 2]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-2)"
  );

  fs.writeFileSync(tmPath, tmContent, 'utf8');
  console.log('✓ Annotated THEORETICAL_MODEL.md');
}

// 2. Patch docs/EPISTEMIC_FOUNDATIONS.md
const efPath = path.join(rootDir, 'docs', 'EPISTEMIC_FOUNDATIONS.md');
let efContent = fs.readFileSync(efPath, 'utf8');
if (!efContent.includes('Independent Scientific Instrument & Non-Accreditation Notice')) {
  efContent = efContent.replace(
    /# 🧬 Epistemic Foundations & Prebiotic Justifications\n\*Addressing the Boundary Between Abiogenesis and Evolution: Why the Battery, Workshop, and Epistemic Cut Are Not Smuggled Biology\*\n\n---\n/m,
    `# 🧬 Epistemic Foundations & Prebiotic Justifications
*Addressing the Boundary Between Abiogenesis and Evolution: Why the Battery, Workshop, and Epistemic Cut Are Not Smuggled Biology*

---

${banner}
---
`
  );

  // Annotate key claims
  efContent = efContent.replace(
    /Pattee's Epistemic Cut/g,
    "Pattee's Epistemic Cut [[Note 2]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-2)"
  );
  efContent = efContent.replace(
    /Von Neumann's Automata Theorem/g,
    "Von Neumann's Automata Theorem [[Note 2]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-2)"
  );
  efContent = efContent.replace(
    /Inorganic Chemiosmosis & Mineral Capacitance/g,
    "Inorganic Chemiosmosis & Mineral Capacitance [[Note 4]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-4) [[Note 32]](CIRCUIT_PALEONTOLOGY_NOTES.html#note-32)"
  );

  fs.writeFileSync(efPath, efContent, 'utf8');
  console.log('✓ Annotated docs/EPISTEMIC_FOUNDATIONS.md');
}
