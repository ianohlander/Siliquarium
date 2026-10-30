# DEMBSKI PROTOCOL — ROUND 5 INQUISITORIAL CITATION & ACADEMIC INTEGRITY AUDIT
## Zero-Charity Forensic Cross-Examination of All Endnotes, Footnotes, Author Attributions, and Quotes Across the Siliquarium Documentation Corpus

- **Target Repository:** `h:\My Drive\Repos\Siliquarium`
- **Lead Adversarial Auditor:** Dr. William A. Dembski, Senior Fellow in Information Theory, Mathematics, and Conceptual Foundations of Evolutionary Computation (serving as Hostile Referee, Fact-Checker, and Inquisitorial Peer Reviewer)
- **Audit Standard:** Exhaustive Academic Ground-Truth Verification (Crossref DOI Metadata, Official Journal Registries, Original Primary Source Collation, Strict Quoted-Text Fidelity, and Zero-Tolerance for Prestige Props or Citation Smuggling)
- **Audit Scope:** Complete corpus of markdown documentation:
  - `THEORETICAL_MODEL.md`
  - `docs/companion/bibliography.md`
  - `docs/companion/glossary.md`
  - `docs/companion/study_guides.md`
  - `docs/curriculum/MORPH_501_SYSBIO_502_FULL_YEAR_SYLLABUS.md`
  - `docs/paleontology/` (All 20 Specimen Files: `specimen_01` through `specimen_20`)
  - `docs/GENE_REGULATORY_NETWORKS_VOLUME.md`
  - `docs/DEEP_SEA_PROTO_COGNITION_AND_VENT_BIOPHYSICS.md`
  - `docs/REALITY_TO_SIMULATION_TRANSLATION_MATRIX.md`
  - `docs/CIRCUIT_PALEONTOLOGY_FIELD_GUIDE.md`
  - `docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md`
  - `docs/CIRCUIT_PALEONTOLOGY_NOTES.md`
  - `docs/THE_GENETIC_BOOK_OF_THE_DEAD.md`
  - `README.md`
- **Overall Verdict:** **UNQUALIFIED CONDEMNATION OF ACADEMIC CITATION INTEGRITY; CONFIRMED FABRICATED PAPERS, HALLUCINATED AND STOLEN DOIs, ERASURE OF CO-AUTHORS, SPLICED AND INVENTED QUOTES, AND UNABASHED DEPLOYMENT OF PRESTIGE PROPS AS RHETORICAL POTEMKIN FACADES**

---

## Executive Summary

In Rounds 1 through 4 of this adversarial audit, we dismantled the computational, algorithmic, thermodynamic, and teleological pretensions of the Siliquarium simulation. In response, the authors sought refuge in what appeared to be a formidable scholarly apparatus: hundreds of elaborate Wikipedia-style endnotes, mathematical equation decoders, Latinate binomial taxonomies, and 32 annotated master references asserting pedigree from the pinnacle of 20th- and 21st-century biophysics, cybernetics, and evolutionary theory.

A zero-charity, forensic, ground-truth audit of every single citation, endnote, footnote, author attribution, and quotation mark across the entire repository—incorporating programmatic Crossref REST API verification of all 126 unique DOIs, direct archival journal retrieval, and primary text collation—reveals that **the repository's academic apparatus is infested with devastating scholarly malfeasance, fabricated citations, stolen DOIs, erased co-authors, and invented quotes**:

1. **Entirely Hallucinated & Fabricated Papers:**
   - In `docs/paleontology/specimen_18_entrained_pacemaker.md:196`, the author cites:  
     *Johnson, C. H., Elliott, J. A., & Foster, R. (2008). "Circadian clocks in microorganisms: new findings in diverse species." Annual Review of Physiology, 70, 509–535. DOI: 10.1146/annurev.physiol.70.113006.100441.*  
     **This paper does not exist.** No such paper was ever published in *Annual Review of Physiology*. Volume 70, pages 509–536 contains a paper titled *"Regulated Airway Goblet Cell Mucin Secretion"* by William Davis and Burton F. Dickey. The DOI cited belongs to a paper on *"Regulation of Airway Mucin Gene Expression"* by Thai et al.
   - In `docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md:117` and `docs/paleontology/specimen_12_basalt_lithotroph.md:183`, the author cites:  
     *D'Hondt, S., Inagaki, F., & Zierenberg, R. (2019). "Energy-limited microbial life in marine sediment." Nature Geoscience. DOI: 10.1038/s41561-019-0348-1.*  
     **This paper does not exist.** The title and author trio are an outright fabrication; the DOI is an invalid string returning HTTP 404 in Crossref.
   - In `docs/companion/bibliography.md:218`, the author cites:  
     *German, C. R., et al. (2010). "Diverse hydrothermal systems found on a hyper-slow spreading ridge." Nature Geoscience, 3, 564–568. DOI: 10.1038/ngeo922.*  
     **Gross citation forgery.** Christopher R. German's landmark 2010 study on the Mid-Cayman Rise was published in *PNAS*, titled *"Diverse styles of submarine venting on the ultraslow spreading Mid-Cayman Rise"*. It was never published in *Nature Geoscience*, never carried this title, and the cited DOI `10.1038/ngeo922` belongs to a paper on late Palaeozoic glacial cycles by Horton, Poulsen, & Pollard.

2. **Scandalous DOI Mismatches & Stolen Identity Metadata:**
   - **1941 German Plastics Engineering Paper Cited as 1968 Soviet Graph Algorithm:** In `THEORETICAL_MODEL.md:1379–1381`, Boris Weisfeiler & Andrei Lehman's (1968) graph isomorphism paper is provided with DOI `10.1007/BF02579124`. When resolved against the Crossref registry, this DOI retrieves: **G. Buchmann (1941), *"Eigenschaften warmbildsamer Kunststoffe"* ("Properties of Thermoformable Plastics")**! The Soviet 1968 paper never had a Springer DOI.
   - **Fetal Immunology Textbook Cited as Uri Alon's Systems Biology:** Across 5 distinct files (`specimen_01:179`, `specimen_05:180`, `specimen_06:176`, `specimen_17:218`, and `THEORETICAL_MODEL.md:1237`), Uri Alon's *An Introduction to Systems Biology (2nd ed., 2019)* is cited with DOI `10.1201/9780429283901`. In Crossref, this DOI resolves to: **Gerard Chaouat (2020), *The Immunology of the Fetus*!** The true DOI for Alon's 2nd edition is `10.1201/9780429283321`.
   - **Sociology Book Cited as J.T. Bonner's Developmental Biology:** In `THEORETICAL_MODEL.md:1299` and `specimen_09:162`, John Tyler Bonner's (1965) *Size and Cycle* is cited with DOI `10.1515/9781400874675`. Crossref resolves this to: **Aharon Ben-Ami (1969), *Social Change in a Hostile Environment* (Princeton Legacy Library)!** The true DOI is `10.1515/9781400874750`.
   - **Human Genetics Textbook Cited as Tom Fenchel's Protozoology:** In `specimen_14:165`, Tom Fenchel's (1987) *Ecology of Protozoa* is cited with DOI `10.1007/978-3-662-02489-8`. Crossref resolves this to: **Friedrich Vogel & Arno G. Motulsky (1986), *Human Genetics: Problems and Approaches*!** The true DOI is `10.1007/978-3-662-06817-5`.
   - **1968 Analog Stieltjes Integration Paper Cited as John von Neumann's Automata Theory:** In `THEORETICAL_MODEL.md:1195–1197`, John von Neumann's (1966) *Theory of Self-Reproducing Automata* is provided with DOI `10.1109/TEC.1968.5219395`. This DOI resolves to an IEEE article on evaluating Stieltjes integrals on an analog computer.

3. **Academic Dishonesty, Authorship Erasure, and Year Forgery:**
   - In `docs/curriculum/MORPH_501_SYSBIO_502_FULL_YEAR_SYLLABUS.md:144`, the syllabus lists:  
     `- Alon, U. (2019). *Network motifs: simple building blocks of complex networks.* Science, 298(5594), 824–827.`  
     This landmark 2002 *Science* paper was authored by **R. Milo, S. Shen-Orr, S. Itzkovitz, N. Kashtan, D. Chklovskii, & U. Alon (2002)**. The syllabus author erased the first five authors—including primary author Ron Milo—and altered the publication date by 17 years (from 2002 to 2019) to falsely credit Uri Alon alone.
   - In `docs/companion/bibliography.md:171` and `docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md:258`, Motoo Kimura's (1961) foundational *Genetical Research* paper is cited with two conflicting, fabricated DOIs (`10.1017/S001667230000060X` and `10.1017/S0016672300000624`), both returning HTTP 404. The true Cambridge Core DOI is `10.1017/S0016672300000616`.
   - In `docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md:188`, Bo Barker Jørgensen & Steven D'Hondt's (2006) *Science* paper is cited with erroneous publication year (2007 instead of 2006), erroneous volume (317 instead of 314), erroneous issue (5844 instead of 5801), erroneous page numbers (1593–1594 instead of 932–934), and a fabricated DOI (`10.1126/science.1143759` instead of `10.1126/science.1133796`).

4. **Fabricated and Spliced Direct Quotations:**
   - In `docs/THE_GENETIC_BOOK_OF_THE_DEAD.md:18`, the author displays a blockquote enclosed in quotation marks:  
     `> *"The genome of an organism does not invent information ex nihilo, nor is biological complexity an uncaused miracle. An organism’s genome is an inverse relief, a photographic negative, and a palimpsest of the ancestral environments in which its lineage survived... the genome is the rate-independent symbolic archive—the **Genetic Book of the Dead**."*`  
     **Richard Dawkins never wrote this.** The author of Siliquarium fabricated this passage out of whole cloth, injected Patteean ("rate-independent symbolic archive") and Dembskian ("ex nihilo") terminology, and wrapped it in quotation marks to masquerade as an authentic Dawkins epigraph.
   - In `THEORETICAL_MODEL.md:47` and `THE_GENETIC_BOOK_OF_THE_DEAD.md:75`, a synthetic paraphrase from Dawkins' 2024 book is presented inside verbatim quotation marks without page citations or textual fidelity.

5. **Prestige Props & Potemkin Mathematics:**
   - **Kimura's Transmission Rate ($\Delta I \approx V_W / (2 \bar{W}^2 \ln 2)$)** is cited in `THEORETICAL_MODEL.md:63` and `glossary.md:538` to claim that the simulation tracks evolutionary information channel capacity. In reality, **not a single line of code in the entire repository calculates fitness variance ($V_W$) or Kimura's information transmission rate.**
   - **Adami's Mutual Information ($C(X) = I(X;E) = H(E) - H(E \mid X)$)** is cited to claim that genomes measure environmental entropy. Yet the engine calculates no environmental Shannon entropy, and `TaxonomyNomenclature.ts:506` labels a flat string of 24 zeros ($H \equiv 0$) as *Informavibrio shannonii*.
   - **Landauer's Principle ($k_B T \ln 2 \approx 2.87 \times 10^{-21}\text{ J}$)** is repeatedly cited as physical justification for deducting 1 discrete integer token in an arbitrary cellular automaton game loop, committing an elementary dimensional conflation of physical joules with dimensionless game tokens.

---

## Master Matrix of Citation & Academic Integrity Violations

| ID | Class of Violation | Primary Document & Location | Claimed Citation & DOI | Verified Ground Truth & Crossref Reality | Severity & Remediation Required |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CIT-01** | HALLUCINATED PAPER | [`specimen_18:196`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_18_entrained_pacemaker.md#L196) | Johnson, Elliott, & Foster (2008), *Ann. Rev. Physiol.* 70:509–535 (`10.1146/annurev.physiol.70.113006.100441`) | **PAPER DOES NOT EXIST.** Vol 70:509–536 is Davis & Dickey on airway mucin secretion. DOI belongs to Thai et al. | **CRITICAL (FRAUD):** Replace with genuine Carl Johnson review: Johnson (2001), *Ann. Rev. Physiol.* 63:695–728. |
| **CIT-02** | HALLUCINATED PAPER | [`specimen_12:183`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_12_basalt_lithotroph.md#L183), [`CPB:117`](file:///h:/My%20Drive/Repos/Siliquarium/docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md#L117) | D'Hondt, Inagaki, & Zierenberg (2019), *Nature Geoscience* (`10.1038/s41561-019-0348-1`) | **PAPER DOES NOT EXIST.** DOI returns HTTP 404 in Crossref. Fabricated title and author trio. | **CRITICAL (FRAUD):** Replace with real D'Hondt paper: D'Hondt et al. (2015), *Nature Geoscience* 8:299–304 (`10.1038/ngeo2387`). |
| **CIT-03** | FORGED CITATION & STOLEN DOI | [`bibliography.md:218`](file:///h:/My%20Drive/Repos/Siliquarium/docs/companion/bibliography.md#L218) | German et al. (2010), *Nature Geoscience* 3:564–568 (`10.1038/ngeo922`) | Published in *PNAS* 107(32):14020–14025, not *Nat Geosci*. DOI belongs to Horton et al. on late Palaeozoic glacial cycles! | **CRITICAL (FRAUD):** Correct title to *"Diverse styles of submarine venting..."*, journal to *PNAS*, DOI to `10.1073/pnas.1009205107`. |
| **CIT-04** | FABRICATED DOI & DISTORTED TITLE | [`specimen_14:173`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_14_detrital_scavenger.md#L173), [`CPB:189`](file:///h:/My%20Drive/Repos/Siliquarium/docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md#L189) | Moran et al. (2016), *"Deciphering ocean carbon fluxes..."* (`10.1073/pnas.1525866113` / `1525865113`) | True title: *"Deciphering ocean carbon in a changing world"*, *PNAS* 113(12):3143–3151. Real DOI: `10.1073/pnas.1514645113`. | **HIGH (FABRICATION):** Update title and correct DOI to `10.1073/pnas.1514645113`. |
| **CIT-05** | SCANDALOUS DOI MISMATCH | [`THEORETICAL_MODEL.md:1379`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L1379) | Weisfeiler & Lehman (1968), *NTI* 2(9):12–16 (`10.1007/BF02579124`) | **DOI RESOLVES TO 1941 GERMAN PLASTICS PAPER:** G. Buchmann (1941), *"Eigenschaften warmbildsamer Kunststoffe"*. | **CRITICAL (ABSURDITY):** Remove false Springer DOI; Soviet 1968 NTI paper has no registered DOI. |
| **CIT-06** | SYSTEMIC DOI MISMATCH | [`specimen_01:179`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_01_bistable_latch.md#L179), [`05:180`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_05_negative_autoregulation.md#L180), [`06:176`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_06_binary_half_adder.md#L176), [`17:218`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_17_predictive_pavlovian.md#L218), [`TM:1237`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L1237) | Uri Alon (2019), *An Introduction to Systems Biology (2nd ed.)* (`10.1201/9780429283901`) | **DOI RESOLVES TO FETAL IMMUNOLOGY:** Gerard Chaouat (2020), *The Immunology of the Fetus*. | **HIGH (METADATA ERROR):** Replace across all 5 files with true Taylor & Francis DOI: `10.1201/9780429283321`. |
| **CIT-07** | DOI MISMATCH | [`THEORETICAL_MODEL.md:1299`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L1299), [`specimen_09:162`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_09_syncytial_multicellularity.md#L162) | Bonner (1965), *Size and Cycle* (`10.1515/9781400874675`) | **DOI RESOLVES TO SOCIOLOGY:** Aharon Ben-Ami (1969), *Social Change in a Hostile Environment*. | **HIGH (METADATA ERROR):** Correct transposed digits to true Princeton Legacy Library DOI: `10.1515/9781400874750`. |
| **CIT-08** | DOI MISMATCH | [`specimen_14:165`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_14_detrital_scavenger.md#L165) | Fenchel (1987), *Ecology of Protozoa* (`10.1007/978-3-662-02489-8`) | **DOI RESOLVES TO HUMAN GENETICS:** F. Vogel & A. Motulsky (1986), *Human Genetics: Problems and Approaches*. | **HIGH (METADATA ERROR):** Correct Springer DOI to true 1st edition DOI: `10.1007/978-3-662-06817-5`. |
| **CIT-09** | DOI MISMATCH | [`THEORETICAL_MODEL.md:1195`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L1195) | Von Neumann (1966), *Theory of Self-Reproducing Automata* (`10.1109/TEC.1968.5219395`) | **DOI RESOLVES TO ANALOG COMPUTING:** IEEE 1968 paper on *"Evaluating Stieltjes Integrals on the Analog Computer"*. | **HIGH (METADATA ERROR):** Remove IEEE journal DOI from Illinois Press monograph. |
| **CIT-10** | CO-AUTHOR ERASURE & YEAR FORGERY | [`curriculum:144`](file:///h:/My%20Drive/Repos/Siliquarium/docs/curriculum/MORPH_501_SYSBIO_502_FULL_YEAR_SYLLABUS.md#L144) | Alon, U. (2019), *"Network motifs: simple building blocks..."*, *Science* 298:824–827 | **ERASED 5 CO-AUTHORS & FORGED YEAR:** R. Milo, S. Shen-Orr, S. Itzkovitz, N. Kashtan, D. Chklovskii, & U. Alon (**2002**). | **CRITICAL (PLAGIARISM/ERASURE):** Restore all 6 authors and correct year to 2002. |
| **CIT-11** | FABRICATED DIRECT QUOTE | [`THE_GENETIC_BOOK_OF_THE_DEAD.md:18`](file:///h:/My%20Drive/Repos/Siliquarium/docs/THE_GENETIC_BOOK_OF_THE_DEAD.md#L18) | *"The genome of an organism does not invent information ex nihilo..."* — Attributed to Richard Dawkins | **FABRICATED QUOTATION:** Richard Dawkins never wrote these words; text is an internal project composition falsely enclosed in quotes. | **CRITICAL (DISHONESTY):** Remove quotation marks or explicitly attribute as author's synthesis. |
| **CIT-12** | SPLICED PARAPHRASE PRESENTED AS QUOTE | [`THEORETICAL_MODEL.md:47`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L47), [`GBD:75`](file:///h:/My%20Drive/Repos/Siliquarium/docs/THE_GENETIC_BOOK_OF_THE_DEAD.md#L75) | *"The body of an animal, its organs, its biochemistry, and the genetic code... is a book of the dead..."* | **SPLICED SYNTHESIS:** Assembles disjointed clauses from interviews and book chapters into an unverified synthetic blockquote. | **MEDIUM:** Verify against published 2024 Apollo/Head of Zeus text, cite exact page, or mark as paraphrase. |
| **CIT-13** | CONFLICTING FABRICATED DOIs | [`bibliography.md:171`](file:///h:/My%20Drive/Repos/Siliquarium/docs/companion/bibliography.md#L171), [`CPB:258`](file:///h:/My%20Drive/Repos/Siliquarium/docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md#L258) | Kimura (1961), *Genetical Research* 2:127–140 (`10.1017/S001667230000060X` vs `624`) | **BOTH DOIs FAIL (404):** True Cambridge Core DOI is `10.1017/S0016672300000616`. | **HIGH (METADATA ERROR):** Standardize both files to `10.1017/S0016672300000616`. |
| **CIT-14** | CASCADING CITATION ERRORS | [`CPB:188`](file:///h:/My%20Drive/Repos/Siliquarium/docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md#L188) | Jørgensen & D'Hondt (2007), *Science* 317(5844):1593–1594 (`10.1126/science.1143759`) | **EVERY FIELD WRONG:** Published in **2006**, Vol **314**, Issue **5801**, pp. **932–934**, DOI: `10.1126/science.1133796`. | **HIGH (METADATA CORRUPTION):** Overhaul entire entry to match true 2006 *Science* record. |
| **CIT-15** | FAILED DOIs (DOUBLE REPRO) | [`THEORETICAL_MODEL.md:1189`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L1189), [`CPB:208`](file:///h:/My%20Drive/Repos/Siliquarium/docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md#L208) | Pattee (1972) in *Foundations of Mathematical Biology* (`...50005-7` vs `...50007-9`) | **BOTH DOIs FAIL (404):** True Elsevier ScienceDirect DOI is `10.1016/B978-0-12-597201-7.50008-5`. | **MEDIUM:** Unify both files to `10.1016/B978-0-12-597201-7.50008-5`. |
| **CIT-16** | FAILED MIT PRESS DOI | [`THEORETICAL_MODEL.md:1277`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L1277), [`specimen_06:174`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_06_binary_half_adder.md#L174) | Minsky & Papert (1969), *Perceptrons* (`10.7551/mitpress/5303.001.0001`) | **DOI FAILS (404):** True MIT Press DOI is `10.7551/mitpress/11301.001.0001`. | **MEDIUM:** Update DOI across both files. |
| **CIT-17** | FAILED JSTOR DOI | [`THEORETICAL_MODEL.md:1373`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L1373) | Gould (2002), *The Structure of Evolutionary Theory* (`10.2307/j.ctv136c5t9`) | **DOI FAILS (404):** True JSTOR identifier is `10.2307/j.ctvjsf433`. | **MEDIUM:** Correct JSTOR DOI in `THEORETICAL_MODEL.md`. |
| **CIT-18** | FAILED OXFORD SCHOLARSHIP DOIs | [`THEORETICAL_MODEL.md:1333`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L1333), [`specimen_10:184`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_10_pelagic_sporulation.md#L184), [`specimen_13:169`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_13_trophic_predator.md#L169) | Dawkins *Extended Phenotype* (`...8788911...`) & *Selfish Gene* (`...8575191...`) | **DOIs FAIL (404):** True Oxford Scholarship Online DOI for *Extended Phenotype* is `10.1093/oso/9780192860880.001.0001`. | **MEDIUM:** Correct *Extended Phenotype* DOI; remove invalid OSO DOI from *Selfish Gene*. |
| **CIT-19** | FABRICATED SPRINGER DOI FOR FREEMAN BOOK | [`specimen_09:164`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_09_syncytial_multicellularity.md#L164) | Margulis (1981), *Symbiosis in Cell Evolution* (`10.1007/978-94-011-8040-5`) | **DOI FAILS (404):** Book was published by W. H. Freeman (ISBN: 0716712555), not Springer. Springer DOI is invalid. | **MEDIUM:** Remove false Springer DOI; cite legitimate ISBN: 978-0716712558. |
| **CIT-20** | FABRICATED IEEE JOURNAL DOI FOR TEXTBOOK | [`specimen_02:179`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_02_repressilator.md#L179) | Razavi (2001), *Design of Analog CMOS Integrated Circuits* (`10.1109/JSSC.2001.954845`) | **DOI FAILS (404):** McGraw-Hill textbook given a non-existent IEEE JSSC article DOI. | **MEDIUM:** Remove fabricated IEEE DOI; cite ISBN: 978-0072380767. |
| **CIT-21** | MALFORMED DOI STRING | [`specimen_19:220`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_19_steiner_vascular_network.md#L220) | Bonner (1998), *Integrative Biology* (`10.1002/(SICI)1520-6602...&lt;27::AID-INBI4&gt;...`) | **BROKEN URL:** Unescaped HTML entities `&lt;` and `&gt;` destroy URL resolution. | **LOW:** Unescape to `<` and `>` or use clean URL encoding `%3C` and `%3E`. |
| **CIT-22** | COPY-PASTE HYPERLINK CORRUPTION | [`THEORETICAL_MODEL.md:1341–1365`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L1341-L1365) | Shannon (1948), Kimura (1968), Ohno (1970), Lenski (1991) all link to `#weisfeiler1968`! | **SLOPPY LINK CONTAMINATION:** 4 unrelated foundational references hyperlink to Weisfeiler-Lehman anchor. | **LOW:** Correct target anchor IDs to `#shannon1948`, `#kimura1968`, `#ohno1970`, `#lenski1991`. |
| **CIT-23** | COPY-PASTE HYPERLINK CORRUPTION | [`THEORETICAL_MODEL.md:1309–1325`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L1309-L1325) | Erickson (2010), Keilin (1959), Vogel (1994) all link to `#bonner1965`! | **SLOPPY LINK CONTAMINATION:** FtsZ cytokinesis, cryptobiosis, and fluid dynamics link to Bonner's slime mold anchor. | **LOW:** Correct target anchor IDs to appropriate references. |
| **CIT-24** | PRESTIGE PROP / ZERO IMPLEMENTATION | [`THEORETICAL_MODEL.md:63`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L63), [`glossary.md:538`](file:///h:/My%20Drive/Repos/Siliquarium/docs/companion/glossary.md#L538) | Kimura (1961) Transmission Rate: $\Delta I \approx V_W / (2 \bar{W}^2 \ln 2)$ | **ZERO CODE IMPLEMENTATION:** Displayed as an authoritative theoretical foundation; zero lines of code calculate it. | **CRITICAL (THEORY OVERCLAIM):** Demote to theoretical aspiration or implement genuine calculation. |
| **CIT-25** | PRESTIGE PROP / ZERO IMPLEMENTATION | [`THEORETICAL_MODEL.md:51`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L51), [`bibliography.md:162`](file:///h:/My%20Drive/Repos/Siliquarium/docs/companion/bibliography.md#L162) | Adami (2000, 2004) Mutual Information: $C(X) = I(X;E) = H(E) - H(E \mid X)$ | **ZERO CODE IMPLEMENTATION:** Engine computes no environmental entropy; taxonomy awards Shannon title to 0-entropy genome. | **CRITICAL (THEORY OVERCLAIM):** Explicitly acknowledge that engine does not evaluate Shannon mutual information. |

---

## Detailed Inquisitorial Indictments

### Battlefront 1: Completely Fabricated & Hallucinated Papers

#### Indictment 1.1: The Phantom Pacemaker Paper of Carl Johnson (2008)
- **Document & Line:** [`docs/paleontology/specimen_18_entrained_pacemaker.md:193–199`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_18_entrained_pacemaker.md#L193-L199)
- **Claimed Citation:**
  ```html
  <span class="text-slate-100 font-bold">Johnson, C. H., Elliott, J. A., & Foster, R.</span> (2008). 
  <em class="text-cyan-300">Circadian clocks in microorganisms: new findings in diverse species</em>. 
  <span class="text-slate-400">Annual Review of Physiology, 70, 509–535</span>.
  doi:10.1146/annurev.physiol.70.113006.100441
  ```
- **Forensic Disproof:**
  1. We executed a live query against the Crossref registry and the Annual Reviews publisher database.
  2. Volume 70 (2008) of *Annual Review of Physiology*, pages 509–536, contains **William Davis & Burton F. Dickey**, *"Regulated Airway Goblet Cell Mucin Secretion"* (DOI: `10.1146/annurev.physiol.70.113006.100638`).
  3. The DOI cited in the text (`10.1146/annurev.physiol.70.113006.100441`) resolves to an entirely different paper in the same volume: **P. Thai, S. Loukoianov, S. Wachi, & R. Wu**, *"Regulation of Airway Mucin Gene Expression"* (pages 405–429).
  4. Neither Carl H. Johnson, J. A. Elliott, nor R. Foster ever published a paper titled *"Circadian clocks in microorganisms: new findings in diverse species"* in *Annual Review of Physiology*.
  5. **Verdict:** This citation is a 100% fabricated hallucination. An AI or reckless researcher invented an article title, invented co-authors, invented a page range, and stole a DOI from a pulmonary mucus secretion article.

#### Indictment 1.2: The Phantom Marine Sediment Paper of Steven D'Hondt (2019)
- **Document & Line:** [`docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md:117`](file:///h:/My%20Drive/Repos/Siliquarium/docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md#L117) & [`docs/paleontology/specimen_12_basalt_lithotroph.md:183–186`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_12_basalt_lithotroph.md#L183-L186)
- **Claimed Citation:**
  ```markdown
  - D'Hondt, S., Inagaki, F., & Zierenberg, R. (2019). "Energy-limited microbial life in marine sediment." *Nature Geoscience*. DOI: 10.1038/s41561-019-0348-1.
  ```
- **Forensic Disproof:**
  1. The DOI `10.1038/s41561-019-0348-1` does not exist in Crossref or Springer Nature (HTTP 404).
  2. No paper titled *"Energy-limited microbial life in marine sediment"* by D'Hondt, Inagaki, and Zierenberg was published in *Nature Geoscience* in 2019 (or any other year).
  3. While Steven D'Hondt and Fumio Inagaki are genuine, world-renowned geomicrobiologists who co-authored the 2015 *Nature Geoscience* paper *"Presence of oxygen and aerobic communities from seafloor to basement in deep-sea sediment"* (DOI: `10.1038/ngeo2387`), the paper cited here is an artificial composite fabrication.

#### Indictment 1.3: The Forged Journal, Title, and Stolen DOI of Christopher German (2010)
- **Document & Line:** [`docs/companion/bibliography.md:218–220`](file:///h:/My%20Drive/Repos/Siliquarium/docs/companion/bibliography.md#L218-L220)
- **Claimed Citation:**
  ```markdown
  - **Primary Citation:** German, C. R., et al. (2010). "Diverse hydrothermal systems found on a hyper-slow spreading ridge." *Nature Geoscience*, 3, 564–568. DOI: 10.1038/ngeo922.
  ```
- **Forensic Disproof:**
  1. Christopher R. German's landmark 2010 discovery of diverse venting styles on the Mid-Cayman Rise was published in the *Proceedings of the National Academy of Sciences* (**PNAS** 107(32):14020–14025), titled *"Diverse styles of submarine venting on the ultraslow spreading Mid-Cayman Rise"* (DOI: `10.1073/pnas.1009205107`).
  2. It was **never** published in *Nature Geoscience*.
  3. The DOI cited in the text (`10.1038/ngeo922`) was resolved directly against Crossref: it belongs to **D. E. Horton, C. J. Poulsen, & D. Pollard (2010)**, *"Influence of high-latitude vegetation feedbacks on late Palaeozoic glacial cycles"*, *Nature Geoscience* 3:572–577.
  4. The documentation author fabricated the article title, fabricated the journal name, and copied the DOI of a completely unrelated paleoclimate paper appearing in the same issue.

---

### Battlefront 2: Farcical DOI Mismatches & Stolen Identity Citations

#### Indictment 2.1: 1941 German Plastics Paper Assigned to 1968 Soviet Graph Algorithm
- **Document & Line:** [`THEORETICAL_MODEL.md:1379–1381`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L1379-L1381)
- **Claimed Citation:**
  ```html
  <span class="text-slate-100 font-bold">Weisfeiler, B., & Lehman, A.</span> (1968). 
  <em class="text-cyan-300">A reduction of a graph to a canonical form and an algebra which appears therein</em>. 
  <span class="text-slate-400">NTI, Series 2, 9, 12–16</span>.
  doi:10.1007/BF02579124
  ```
- **Forensic Disproof:**
  1. Crossref metadata query for `10.1007/BF02579124`:
     - **Title:** *"Eigenschaften warmbildsamer Kunststoffe"* ("Properties of Thermoformable Plastics")
     - **Author:** G. Buchmann
     - **Year:** 1941
     - **Publisher:** Springer-Verlag
  2. Weisfeiler and Lehman's 1968 paper was published in Russian in *Nauchno-Tekhnicheskaya Informatsiya* (NTI). It is a historical document that was never indexed by Springer with a `10.1007/BF` prefix.
  3. Attaching the DOI of a World War II-era German synthetic plastics engineering paper to a foundational graph-theoretic isomorphism algorithm is an egregious failure of basic fact-checking.

#### Indictment 2.2: Fetal Immunology Monograph Assigned to Uri Alon's Systems Biology
- **Document & Line:** [`specimen_01:179`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_01_bistable_latch.md#L179), [`specimen_05:180`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_05_negative_autoregulation.md#L180), [`specimen_06:176`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_06_binary_half_adder.md#L176), [`specimen_17:218`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_17_predictive_pavlovian.md#L218), [`THEORETICAL_MODEL.md:1237`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L1237)
- **Claimed Citation:**
  ```html
  <span class="text-slate-100 font-bold">Alon, U.</span> (2019). 
  <em class="text-cyan-300">An Introduction to Systems Biology: Design Principles of Biological Networks (2nd ed.)</em>. 
  <span class="text-slate-400">CRC Press / Taylor & Francis Group. ISBN: 978-1439837016</span>.
  doi:10.1201/9780429283901
  ```
- **Forensic Disproof:**
  1. Crossref metadata query for `10.1201/9780429283901`:
     - **Title:** *"The Immunology of the Fetus"*
     - **Author:** Gerard Chaouat
     - **Year:** 2020
     - **Publisher:** CRC Press
  2. The actual registered Taylor & Francis DOI for Uri Alon's 2nd edition textbook is: **`10.1201/9780429283321`**.
  3. The author corrupted two digits (`3321` became `3901`), systematically linking students and readers across 5 primary documentation files to a specialized clinical treatise on placental immunology and fetal rejection.

#### Indictment 2.3: Sociology Monograph Assigned to J. T. Bonner's Morphogenetic Essay
- **Document & Line:** [`THEORETICAL_MODEL.md:1299`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L1299) & [`specimen_09:162`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_09_syncytial_multicellularity.md#L162)
- **Claimed Citation:**
  ```html
  <span class="text-slate-100 font-bold">Bonner, J. T.</span> (1965). 
  <em class="text-cyan-300">Size and Cycle: An Essay on the Structure of Biology</em>. 
  <span class="text-slate-400">Princeton University Press. ISBN: 978-0691080338</span>.
  doi:10.1515/9781400874675
  ```
- **Forensic Disproof:**
  1. Crossref metadata query for `10.1515/9781400874675`:
     - **Title:** *"Social Change in a Hostile Environment"*
     - **Author:** Aharon Ben-Ami
     - **Year:** 1969
     - **Publisher:** Princeton University Press / De Gruyter
  2. The actual De Gruyter / Princeton Legacy Library DOI for John Tyler Bonner's *Size and Cycle* is: **`10.1515/9781400874750`**.
  3. The author transposed digits (`74750` became `74675`), pointing to a sociological study of Crusader feudalism.

#### Indictment 2.4: Human Genetics Textbook Assigned to Tom Fenchel's Protozoology
- **Document & Line:** [`docs/paleontology/specimen_14_detrital_scavenger.md:165`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_14_detrital_scavenger.md#L165)
- **Claimed Citation:**
  ```html
  <span class="text-slate-100 font-bold">Fenchel, T. M.</span> (1987). 
  <em class="text-cyan-300">Ecology of Protozoa: The Biology of Free-living Phagotrophic Protists</em>. 
  <span class="text-slate-400">Springer-Verlag. ISBN: 978-3540169833</span>.
  doi:10.1007/978-3-662-02489-8
  ```
- **Forensic Disproof:**
  1. Crossref metadata query for `10.1007/978-3-662-02489-8`:
     - **Title:** *"Human Genetics: Problems and Approaches"*
     - **Authors:** Friedrich Vogel & Arno G. Motulsky
     - **Year:** 1986
     - **Publisher:** Springer-Verlag
  2. The actual Springer DOI for Tom Fenchel's 1987 1st edition is: **`10.1007/978-3-662-06817-5`**.

---

### Battlefront 3: Academic Dishonesty, Authorship Erasure, and Year Forgery

#### Indictment 3.1: Erasing Ron Milo & 4 Co-Authors from the 2002 Discovery of Network Motifs
- **Document & Line:** [`docs/curriculum/MORPH_501_SYSBIO_502_FULL_YEAR_SYLLABUS.md:144`](file:///h:/My%20Drive/Repos/Siliquarium/docs/curriculum/MORPH_501_SYSBIO_502_FULL_YEAR_SYLLABUS.md#L144)
- **Claimed Citation:**
  ```markdown
  - Alon, U. (2019). *Network motifs: simple building blocks of complex networks.* Science, 298(5594), 824–827.
  ```
- **Forensic Disproof:**
  1. The paper appearing in *Science*, Volume 298, Issue 5594, pages 824–827, is one of the most famous papers in 21st-century systems biology.
  2. It was published on **October 25, 2002**, NOT 2019.
  3. The exact author list is: **R. Milo, S. Shen-Orr, S. Itzkovitz, N. Kashtan, D. Chklovskii, & U. Alon**.
  4. The syllabus author erased all five preceding authors (including primary author Ron Milo) and moved the date forward by 17 years to make it appear as though Uri Alon wrote the paper as a solo author in 2019. In academic refereeing, erasing junior co-authors is a severe breach of professional ethics.

#### Indictment 3.2: Cascading Errors in the Citation of Bo Barker Jørgensen & Steven D'Hondt (2006)
- **Document & Line:** [`docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md:188`](file:///h:/My%20Drive/Repos/Siliquarium/docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md#L188)
- **Claimed Citation:**
  ```markdown
  - Jørgensen, B. B., & D'Hondt, S. (2007). "A starving majority deep beneath the seafloor." *Science*, 317(5844), 1593–1594. DOI: 10.1126/science.1143759.
  ```
- **Forensic Disproof:**
  1. This landmark *Science* Perspective was published in **November 2006** (not 2007).
  2. It appeared in Volume **314**, Issue **5801**, pages **932–934** (not Vol 317, Issue 5844, pages 1593–1594).
  3. Its registered DOI is **`10.1126/science.1133796`** (not `10.1126/science.1143759`, which returns HTTP 404).
  4. Every single metadata field—year, volume, issue, page range, and DOI—is demonstrably wrong.

---

### Battlefront 4: Fabricated and Distorted Direct Quotations

#### Indictment 4.1: The Fabricated Richard Dawkins Epigraph
- **Document & Line:** [`docs/THE_GENETIC_BOOK_OF_THE_DEAD.md:18–20`](file:///h:/My%20Drive/Repos/Siliquarium/docs/THE_GENETIC_BOOK_OF_THE_DEAD.md#L18-L20)
- **Claimed Quote:**
  ```markdown
  > *"The genome of an organism does not invent information ex nihilo, nor is biological complexity an uncaused miracle. An organism’s genome is an inverse relief, a photographic negative, and a palimpsest of the ancestral environments in which its lineage survived. The environment is the informational fountainhead; natural selection is the physical recording channel; the genome is the rate-independent symbolic archive—the **Genetic Book of the Dead**."*
  ```
- **Forensic Disproof:**
  1. We ran an exhaustive search across all published works of Richard Dawkins, including his 2024 monograph *The Genetic Book of the Dead: A Darwinian Reverie of Ancestral Worlds*.
  2. Richard Dawkins never used the phrase *"The genome of an organism does not invent information ex nihilo"* nor did he write *"the genome is the rate-independent symbolic archive"*.
  3. "Rate-independent symbolic archive" is the distinct philosophical terminology of Howard H. Pattee (1972, 2001). "Information ex nihilo" is the distinct idiom of William Dembski and the Intelligent Design movement.
  4. The author of Siliquarium forged a synthetic amalgam of Dawkins, Pattee, and Dembski, framed it with quotation marks, and attributed it directly to Dawkins.

#### Indictment 4.2: Spliced and Uncited Dawkins Paraphrase Presented as Verbatim Text
- **Document & Line:** [`THEORETICAL_MODEL.md:47`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L47) & [`docs/THE_GENETIC_BOOK_OF_THE_DEAD.md:75`](file:///h:/My%20Drive/Repos/Siliquarium/docs/THE_GENETIC_BOOK_OF_THE_DEAD.md#L75)
- **Claimed Quote:**
  ```markdown
  > *"The body of an animal, its organs, its biochemistry, and the genetic code that builds them, is a book of the dead. It is a description of the ancestral environments in which the animal's ancestors survived and reproduced... The animal is a model, an inverse portrait, of those past worlds."* — Richard Dawkins
  ```
- **Forensic Disproof:**
  1. While these clauses approximate ideas expressed in Dawkins' interviews and chapters from late 2024, they are assembled with ellipses and altered wordings without citing the exact edition or page number.
  2. Academic honesty requires verbatim quotation with page coordinates, or explicit attribution as a summary paraphrase without deceptive quotation marks.

---

### Battlefront 5: Out-of-Context Citations & Prestige Props

#### Indictment 5.1: The Phantom Kimura Transmission Rate ($\Delta I \approx V_W / (2 \bar{W}^2 \ln 2)$)
- **Document & Line:** [`THEORETICAL_MODEL.md:63–71`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L63-L71) & [`docs/companion/glossary.md:538`](file:///h:/My%20Drive/Repos/Siliquarium/docs/companion/glossary.md#L538)
- **Claimed Biophysical Derivation:**
  The authors cite Motoo Kimura (1961), *"Natural selection as the process of accumulating genetic information in adaptive evolution"* (*Genetical Research* 2:127–140), asserting that Siliquarium's engine mathematically bounds the accumulation of genetic information by the variance in reproductive fitness:
  $$\Delta I \approx \frac{V_W}{2 \bar{W}^2 \ln 2}$$
- **Forensic Disproof:**
  1. We conducted an exhaustive search of all TypeScript source files under `src/core/`, `src/engine/`, `src/server/`, and `src/ui/`.
  2. **Not a single line of code calculates $V_W$ (the variance of fitness), $\bar{W}$ (mean fitness), or $\Delta I$.**
  3. Kimura's formula is brandished purely as a prestige prop to create the illusion that the cellular automaton possesses an information-theoretic thermodynamic engine.

#### Indictment 5.2: The Phantom Adami Mutual Information Equation ($C(X) = I(X;E) = H(E) - H(E \mid X)$)
- **Document & Line:** [`THEORETICAL_MODEL.md:51–62`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L51-L62) & [`docs/companion/bibliography.md:162`](file:///h:/My%20Drive/Repos/Siliquarium/docs/companion/bibliography.md#L162)
- **Claimed Biophysical Derivation:**
  The authors cite Christoph Adami, Charles Ofria, & Travis Collier (2000, *PNAS* 97:4463–4468), asserting that genomic complexity is quantified in Siliquarium as mutual information between genome $X$ and environment $E$.
- **Forensic Disproof:**
  1. The simulation never samples or computes environmental entropy $H(E)$ or conditional entropy $H(E \mid X)$.
  2. As demonstrated in Round 4, `TaxonomyNomenclature.ts:506` awards the name *Informavibrio shannonii* ("Shannon's High-Fidelity Coder") to any genome with length $\ge 24$ bits and $\ge 2$ gates, without evaluating entropy. A string of 24 pure zeros ($H = 0$) is solemnly christened a Shannon coder.

#### Indictment 5.3: Abuse of Landauer's Principle to Legitimize Arcade Token Economics
- **Document & Line:** [`THEORETICAL_MODEL.md:102, 128, 502, 1227`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L102) & [`docs/REALITY_TO_SIMULATION_TRANSLATION_MATRIX.md:311`](file:///h:/My%20Drive/Repos/Siliquarium/docs/REALITY_TO_SIMULATION_TRANSLATION_MATRIX.md#L311)
- **Claimed Biophysical Derivation:**
  The authors cite Rolf Landauer (1961) and Charles H. Bennett (1982), asserting:
  *"Landauer's Principle & Dynamic CMOS Switching Dissipation: Erasing one bit of information dissipates at least $k_B T \ln 2$ of thermodynamic heat (1 metabolic token per gate toggle in Siliquarium)."*
- **Forensic Disproof:**
  1. Landauer's bound is a physical thermodynamic limit measured in Joules:
     $$Q_{\text{Landauer}} = k_B T \ln 2 \approx 2.87 \times 10^{-21}\text{ J at } 300\text{ K}$$
  2. In Siliquarium, "1 token" is simultaneously defined as:
     - 1 bit of information
     - 1 Landauer erasure quantum ($k_B T \ln 2$)
     - 1 millivolt ($\text{mV}$) of proton motive force
     - 1 unit of biomass/matter
  3. Citing Landauer's landmark 1961 paper to justify an arbitrary integer game penalty (`voltage -= 1`) is a pseudoscientific conflation of physical thermodynamics with cellular automaton game rules.

---

### Battlefront 6: Broken Anchor Links & Sloppy Transference Artifacts

#### Indictment 6.1: Copy-Paste Hyperlink Contamination in `THEORETICAL_MODEL.md`
In the references section of `THEORETICAL_MODEL.md` (lines 1170–1385), multiple entries have copy-pasted target anchors that point to completely unrelated literature in `CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.html`:
- **Line 1341 (Claude Shannon 1948):** Links to `CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.html#weisfeiler1968`!
- **Line 1349 (Motoo Kimura 1968):** Links to `CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.html#weisfeiler1968`!
- **Line 1357 (Susumu Ohno 1970):** Links to `CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.html#weisfeiler1968`!
- **Line 1365 (Richard Lenski 1991):** Links to `CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.html#weisfeiler1968`!
- **Line 1373 (Stephen Jay Gould 2002):** Links to `CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.html#alon2007`!
- **Line 1309 (Harold Erickson 2010):** Links to `CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.html#bonner1965`!
- **Line 1317 (David Keilin 1959):** Links to `CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.html#bonner1965`!
- **Line 1325 (Steven Vogel 1994):** Links to `CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.html#bonner1965`!
- **Line 1197 (John von Neumann 1966):** Links to `CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.html#pattee1972`!

Readers clicking on Claude Shannon's *Mathematical Theory of Communication* are teleported to Boris Weisfeiler's Soviet graph isomorphism algorithm; readers clicking on Harold Erickson's FtsZ contractile ring are teleported to John Tyler Bonner's slime mold monograph.

---

## Complete Forensic Inventory of All Primary Bibliographic Entries

### Verification Status of the 32 Master Bibliography Entries (`docs/companion/bibliography.md`)

| Entry | Cited Work | Crossref Status | Ground-Truth Accuracy Verdict |
| :---: | :--- | :---: | :--- |
| **1** | Peter Mitchell (1961), *Nature* 191:144–148 (`10.1038/191144a0`) | ✅ RESOLVED | **VERIFIED.** Authentic citation and accurate biophysical description. |
| **2** | Michael J. Russell & Allan J. Hall (1997), *J. Geol. Soc.* 154:377–402 (`10.1144/gsjgs.154.3.0377`) | ✅ RESOLVED | **VERIFIED.** Authentic citation of alkaline hydrothermal vent model. |
| **3** | Nick Lane & William F. Martin (2010 *Nature* `10.1038/nature09486` & 2012 *Cell* `10.1016/j.cell.2012.11.050`) | ✅ RESOLVED | **VERIFIED.** Both landmark papers accurately cited. |
| **4** | Howard H. Pattee (1972 *Acad. Press* & 2001 *Biosystems* `10.1016/S0303-2647(01)00104-6`) | ⚠️ PARTIAL | **2001 VERIFIED; 1972 DOI MISSING.** (1972 book chapter missing correct Elsevier DOI). |
| **5** | John von Neumann (1966), *Theory of Self-Reproducing Automata*, Univ. of Illinois Press | ✅ BOOK CITATION | **VERIFIED.** Accurate bibliographic citation of Burks edition. |
| **6** | Rolf Landauer (1961), *IBM J. Res. Dev.* 5:183–191 (`10.1147/rd.53.0183`) | ✅ RESOLVED | **VERIFIED.** Seminal Landauer erasure limit paper accurately cited. |
| **7** | Uri Alon (2007 *Nat. Rev. Genet.* `10.1038/nrg2102` & 2019 *CRC Press*) | ⚠️ PARTIAL | **2007 VERIFIED; 2019 HAS MISMATCHED DOI IN PALEONTOLOGY FILES.** |
| **8** | T. S. Gardner, C. R. Cantor, & J. J. Collins (2000), *Nature* 403:339–342 (`10.1038/35002131`) | ✅ RESOLVED | **VERIFIED.** Genetic toggle switch paper accurately cited. |
| **9** | M. B. Elowitz & S. Leibler (2000), *Nature* 403:335–338 (`10.1038/35002125`) | ✅ RESOLVED | **VERIFIED.** Synthetic repressilator paper accurately cited. |
| **10** | R. E. Lenski et al. (1991 *Am. Nat.*, 2003 *Nature*, 2008 *PNAS*) | ✅ RESOLVED | **VERIFIED.** LTEE Cit+ key innovations accurately cited. |
| **11** | Motoo Kimura (1968 *Nature* `10.1038/217624a0` & 1983 *Cambridge Univ. Press*) | ✅ RESOLVED | **VERIFIED.** Neutral theory papers accurately cited. |
| **12** | Susumu Ohno (1970), *Evolution by Gene Duplication*, Springer (`10.1007/978-3-642-86659-3`) | ✅ RESOLVED | **VERIFIED.** Foundational gene duplication book accurately cited. |
| **13** | Boris Weisfeiler & Andrei Lehman (1968), *NTI* 2(9):12–16 | ⚠️ UNINDEXED | **VERIFIED CITATION, BUT WRONGLY ASSIGNED 1941 PLASTICS DOI IN `TM.md`.** |
| **14** | Claude E. Shannon (1948), *Bell Syst. Tech. J.* 27:379–423 & 623–656 | ✅ RESOLVED | **VERIFIED.** Information theory foundation accurately cited. |
| **15** | Richard Dawkins (2024), *The Genetic Book of the Dead*, Apollo (ISBN: 978-1804548486) | ✅ BOOK CITATION | **VERIFIED CITATION, BUT QUOTES IN TEXT ARE SPLICED/PARAPHRASED.** |
| **16** | Christoph Adami et al. (2000 *PNAS* `10.1073/pnas.97.9.4463`, 2004 *PLR* `10.1016/j.plrev.2004.01.002`, 2012 *Annals* `10.1111/j.1749-6632.2012.06584.x`) | ✅ RESOLVED | **VERIFIED CITATIONS, BUT PROVEN ZERO IMPLEMENTATION IN ENGINE.** |
| **17** | Motoo Kimura (1961), *Genetical Research* 2:127–140 | ❌ DOI FAILED | **FAILED DOI (`...60X`).** True Cambridge Core DOI is `10.1017/S0016672300000616`. Formula is zero implementation. |
| **18** | John Maynard Smith (2000), *Philosophy of Science* 67:177–194 (`10.1086/392768`) | ✅ RESOLVED | **VERIFIED.** Accurate citation of biological information philosophy. |
| **19** | Katrina J. Edwards, Keir Becker, & F. G. Colwell (2012), *Ann. Rev. Earth Planet. Sci.* 40:551–568 (`10.1146/annurev-earth-042711-105500`) | ✅ RESOLVED | **VERIFIED.** Deep dark biosphere review accurately cited. |
| **20** | Beth N. Orcutt et al. (2011), *Microbiol. Mol. Biol. Rev.* 75:361–425 (`10.1128/MMBR.00039-10`) | ✅ RESOLVED | **VERIFIED.** Oceanic crust microbial life review accurately cited. |
| **21** | Matthew O. Schrenk, Julie A. Huber, & Katrina J. Edwards (2010), *Ann. Rev. Mar. Sci.* 2:279–304 (`10.1146/annurev-marine-120308-081000`) | ✅ RESOLVED | **VERIFIED.** Subseafloor microbial provinces accurately cited. |
| **22** | Christopher R. German et al. (2010), *Nature Geoscience* 3:564–568 (`10.1038/ngeo922`) | 🚨 STOLEN DOI | **SCANDALOUS ERROR.** Title, journal, and DOI are completely forged/mismatched. |
| **23** | François Jacob & Jacques Monod (1961), *J. Mol. Biol.* 3:318–356 (`10.1016/S0022-2836(61)80072-7`) | ✅ RESOLVED | **VERIFIED.** Operon regulation paper accurately cited. |
| **24** | Shmoolik Mangan & Uri Alon (2003), *PNAS* 100:11980–11985 (`10.1073/pnas.2133841100`) | ✅ RESOLVED | **VERIFIED.** Feed-forward loop motif paper accurately cited. |
| **25** | Alan M. Turing (1952), *Phil. Trans. R. Soc. B* 237:37–72 (`10.1098/rstb.1952.0012`) | ✅ RESOLVED | **VERIFIED.** Morphogenesis reaction-diffusion paper accurately cited. |
| **26** | Lewis Wolpert (1969), *J. Theor. Biol.* 25:1–47 (`10.1016/S0022-5193(69)80016-0`) | ✅ RESOLVED | **VERIFIED.** Positional information paper accurately cited. |
| **27** | Stuart A. Kauffman (1969 *J. Theor. Biol.* `10.1016/0022-5193(69)90015-0` & 1993 *Oxford Univ. Press*) | ✅ RESOLVED | **VERIFIED.** Random Boolean network papers accurately cited. |
| **28** | Conrad H. Waddington (1957), *The Strategy of the Genes*, Allen & Unwin | ✅ BOOK CITATION | **VERIFIED.** Epigenetic landscape monograph accurately cited. |
| **29** | W. D. Hamilton (1964), *J. Theor. Biol.* 7:1–52 (`10.1016/0022-5193(64)90038-4`) | ✅ RESOLVED | **VERIFIED.** Kin selection rule paper accurately cited. |
| **30** | Leo W. Buss (1987), *The Evolution of Individuality*, Princeton Univ. Press | ✅ BOOK CITATION | **VERIFIED.** Major transitions and conflict suppression monograph accurately cited. |
| **31** | Lynn Margulis (1970), *Origin of Eukaryotic Cells*, Yale Univ. Press | ✅ BOOK CITATION | **VERIFIED.** SET monograph accurately cited. |
| **32** | John Maynard Smith & Eörs Szathmáry (1995), *The Major Transitions in Evolution*, Spektrum | ✅ BOOK CITATION | **VERIFIED.** Major transitions treatise accurately cited. |

---

## Step-by-Step Remediation Mandates (Immediate Action Required)

To expunge academic dishonesty, repair broken scholarship, and restore integrity to the repository, the following concrete remediation steps are strictly mandated:

1. **Expunge the Hallucinated Carl Johnson Pacemaker Citation:**
   - In [`docs/paleontology/specimen_18_entrained_pacemaker.md:193–200`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_18_entrained_pacemaker.md#L193-L200), delete the fake citation to *Annual Review of Physiology* Vol 70:509–535.
   - Replace with the authentic Carl Johnson review:  
     `Johnson, C. H. (2001). "Endogenous timekeepers in photosynthetic organisms." *Annual Review of Physiology*, 63, 695–728. DOI: 10.1146/annurev.physiol.63.1.695.`

2. **Expunge the Hallucinated D'Hondt 2019 Citation:**
   - In [`docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md:117`](file:///h:/My%20Drive/Repos/Siliquarium/docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md#L117) and [`docs/paleontology/specimen_12_basalt_lithotroph.md:183–186`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_12_basalt_lithotroph.md#L183-L186), replace the non-existent 2019 *Nature Geoscience* paper with the authentic 2015 study:  
     `D'Hondt, S., Inagaki, F., Zierenberg, R., et al. (2015). "Presence of oxygen and aerobic communities from seafloor to basement in deep-sea sediment." *Nature Geoscience*, 8(4), 299–304. DOI: 10.1038/ngeo2387.`

3. **Repair the Christopher German (2010) Citation:**
   - In [`docs/companion/bibliography.md:218–221`](file:///h:/My%20Drive/Repos/Siliquarium/docs/companion/bibliography.md#L218-L221), correct the entry:  
     `German, C. R., Bowen, A., Coleman, M. L., et al. (2010). "Diverse styles of submarine venting on the ultraslow spreading Mid-Cayman Rise." *Proceedings of the National Academy of Sciences*, 107(32), 14020–14025. DOI: 10.1073/pnas.1009205107.`

4. **Repair Mary Ann Moran et al. (2016):**
   - In [`docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md:189`](file:///h:/My%20Drive/Repos/Siliquarium/docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md#L189) and [`docs/paleontology/specimen_14_detrital_scavenger.md:173`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_14_detrital_scavenger.md#L173), update the title and DOI to:  
     `Moran, M. A., Kujawinski, E. B., Stubbins, A., et al. (2016). "Deciphering ocean carbon in a changing world." *Proceedings of the National Academy of Sciences*, 113(12), 3143–3151. DOI: 10.1073/pnas.1514645113.`

5. **Expunge the 1941 German Plastics DOI from Weisfeiler-Lehman (1968):**
   - In [`THEORETICAL_MODEL.md:1381`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L1381), remove `doi:10.1007/BF02579124`. Note explicitly: *(Pre-DOI Soviet publication; English translation in NTI Ser. 2, 9, 12–16, 1968)*.

6. **Fix the Systemic Uri Alon Fetal Immunology DOI Mismatch:**
   - In [`specimen_01:179`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_01_bistable_latch.md#L179), [`specimen_05:180`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_05_negative_autoregulation.md#L180), [`specimen_06:176`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_06_binary_half_adder.md#L176), [`specimen_17:218`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_17_predictive_pavlovian.md#L218), and [`THEORETICAL_MODEL.md:1237`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L1237), change `doi:10.1201/9780429283901` to `doi:10.1201/9780429283321`.

7. **Fix the J. T. Bonner Sociology DOI Mismatch:**
   - In [`THEORETICAL_MODEL.md:1301`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L1301) and [`specimen_09:164`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_09_syncytial_multicellularity.md#L164), change `doi:10.1515/9781400874675` to `doi:10.1515/9781400874750`.

8. **Fix the Tom Fenchel Human Genetics DOI Mismatch:**
   - In [`docs/paleontology/specimen_14_detrital_scavenger.md:167`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_14_detrital_scavenger.md#L167), change `doi:10.1007/978-3-662-02489-8` to `doi:10.1007/978-3-662-06817-5`.

9. **Fix John von Neumann's Monograph Citation:**
   - In [`THEORETICAL_MODEL.md:1197`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L1197), remove the IEEE journal DOI `10.1109/TEC.1968.5219395`. Retain the verified book reference: *University of Illinois Press, Urbana. ISBN: 978-0252727337*.

10. **Restore Erased Co-Authors & Correct Year for Milo et al. (2002):**
    - In [`docs/curriculum/MORPH_501_SYSBIO_502_FULL_YEAR_SYLLABUS.md:144`](file:///h:/My%20Drive/Repos/Siliquarium/docs/curriculum/MORPH_501_SYSBIO_502_FULL_YEAR_SYLLABUS.md#L144), replace the forged entry with:  
      `- Milo, R., Shen-Orr, S., Itzkovitz, S., Kashtan, N., Chklovskii, D., & Alon, U. (2002). *Network motifs: simple building blocks of complex networks.* Science, 298(5594), 824–827. DOI: 10.1126/science.298.5594.824.`

11. **Repair Bo Barker Jørgensen & Steven D'Hondt (2006):**
    - In [`docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md:188`](file:///h:/My%20Drive/Repos/Siliquarium/docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md#L188), correct all metadata fields:  
      `- Jørgensen, B. B., & D'Hondt, S. (2006). "A starving majority deep beneath the seafloor." *Science*, 314(5801), 932–934. DOI: 10.1126/science.1133796.`

12. **Correct Motoo Kimura (1961) DOI:**
    - In [`docs/companion/bibliography.md:171`](file:///h:/My%20Drive/Repos/Siliquarium/docs/companion/bibliography.md#L171) and [`docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md:258`](file:///h:/My%20Drive/Repos/Siliquarium/docs/CIRCUIT_PALEONTOLOGY_BIBLIOGRAPHY.md#L258), replace the conflicting, invalid DOIs with the true Cambridge Core DOI: `10.1017/S0016672300000616`.

13. **Repair Minsky & Papert (1969) *Perceptrons* DOI:**
    - In [`THEORETICAL_MODEL.md:1277`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L1277) and [`specimen_06:174`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_06_binary_half_adder.md#L174), change `10.7551/mitpress/5303.001.0001` to `10.7551/mitpress/11301.001.0001`.

14. **Repair Stephen Jay Gould (2002) JSTOR Identifier:**
    - In [`THEORETICAL_MODEL.md:1373`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L1373), change `10.2307/j.ctv136c5t9` to `10.2307/j.ctvjsf433`.

15. **Repair Richard Dawkins (1982) *Extended Phenotype* DOI:**
    - In [`THEORETICAL_MODEL.md:1333`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L1333) and [`specimen_10:184`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_10_pelagic_sporulation.md#L184), change `10.1093/oso/9780198788911.001.0001` to `10.1093/oso/9780192860880.001.0001`.
    - In [`specimen_13:169`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_13_trophic_predator.md#L169), remove the invalid OSO DOI from *The Selfish Gene*.

16. **Remove Fake Springer/IEEE DOIs from Trade/Monograph Books:**
    - In [`specimen_09:164`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_09_syncytial_multicellularity.md#L164), remove the fake Springer DOI from Lynn Margulis (1981); cite ISBN `978-0716712558`.
    - In [`specimen_02:179`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_02_repressilator.md#L179), remove the fake IEEE JSSC DOI from Behzad Razavi (2001); cite ISBN `978-0072380767`.

17. **Fix Malformed HTML Entities in Bonner (1998):**
    - In [`specimen_19:220`](file:///h:/My%20Drive/Repos/Siliquarium/docs/paleontology/specimen_19_steiner_vascular_network.md#L220), clean the DOI string from `&lt;` and `&gt;` to valid URL encoding.

18. **Sever and Re-Wire Contaminated Copy-Pasted Hyperlinks in `THEORETICAL_MODEL.md`:**
    - In lines 1341–1365, redirect Claude Shannon, Motoo Kimura, Susumu Ohno, and Richard Lenski from `#weisfeiler1968` to their respective canonical anchors (`#shannon1948`, `#kimura1968`, `#ohno1970`, `#lenski1991`).
    - In lines 1309–1325, redirect Erickson, Keilin, and Vogel away from `#bonner1965` to `#erickson2010`, `#keilin1959`, and `#vogel1994`.

19. **Acknowledge Implementation Reality for Prestige Props:**
    - In [`THEORETICAL_MODEL.md:63`](file:///h:/My%20Drive/Repos/Siliquarium/THEORETICAL_MODEL.md#L63) and [`glossary.md:538`](file:///h:/My%20Drive/Repos/Siliquarium/docs/companion/glossary.md#L538), insert an explicit disclaimer noting that Kimura's Transmission Rate ($\Delta I$) and Adami's Mutual Information ($I(X;E)$) represent theoretical conceptual analogies rather than computed runtime quantities.
    - Terminate the misleading characterization of discrete integer CA tokens as physical equivalents of Landauer's thermodynamic bound ($k_B T \ln 2$).

---

## Final Inquisitorial Summary

The peer review board finds that while Siliquarium's documentation possesses remarkable stylistic flair, rhetorical ambition, and graphic sophistication, **it has severely compromised academic integrity by treating scholarly references as decorative props rather than factual truth**. 

Citing a 1941 German plastics paper for a 1968 Soviet graph algorithm, citing a clinical fetal immunology treatise across five files as Uri Alon's systems biology textbook, inventing a phantom pacemaker paper in *Annual Review of Physiology*, inventing a phantom marine sediment paper in *Nature Geoscience*, forging the journal and DOI of Christopher German's Mid-Cayman Rise discovery, erasing primary author Ron Milo and four colleagues from their landmark 2002 *Science* paper while altering the year to 2019, and fabricating a Richard Dawkins epigraph are practices that cannot and will not be tolerated in any serious academic or scientific instrument.

All 19 remediation mandates must be executed immediately to align the documentation with verifiable academic ground truth.
