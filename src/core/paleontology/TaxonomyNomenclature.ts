/**
 * 🐠 Siliquarium Paleontology Subsystem
 * TaxonomyNomenclature: Whimsical Linnaean Binomial Nomenclature System
 * Honoring Prominent Computer and Biological Scientists.
 *
 * Classifies digital silicoid lineages based on logic netlists, network motifs,
 * Landauer efficiency, and evolutionary history, giving each emergent clade
 * an authentic scientific name and colorful bioluminescent identity.
 */

import { PoreWorkshop } from '../domain/PoreWorkshop.js';

export interface ISpeciesTaxon {
  /** Linnaean Binomial Name in italics (e.g. Pulsilicon alonii) */
  readonly binomialName: string;
  /** Accessible Common Name (e.g. Alon's Pulsing Silicoid) */
  readonly commonName: string;
  /** Scientist honored by the taxon */
  readonly honoree: string;
  /** Scientific field of the honoree */
  readonly field: string;
  /** Landmark publication or concept cited */
  readonly citation: string;
  /** Primary bioluminescent glow color (hex) */
  readonly auraColor: string;
  /** Secondary membrane accent color (hex) */
  readonly accentColor: string;
  /** Plain-language ecological description */
  readonly description: string;
}

export interface ITaxonomyQuery {
  readonly tapeBitstring?: string;
  readonly gateTypes?: readonly string[];
  readonly generation?: number;
  readonly isBasalt?: boolean;
  readonly hasOrganelle?: boolean;
  readonly isSyncytium?: boolean;
  readonly isDifferentiated?: boolean;
}

export class TaxonomyNomenclature {
  private static readonly TAXA: Record<string, ISpeciesTaxon> = {
    ALONII: {
      binomialName: 'Pulsilicon alonii',
      commonName: "Alon's Pulsing Silicoid",
      honoree: 'Uri Alon',
      field: 'Systems Biology & Network Motifs',
      citation: 'Alon, U. (2007). Nature Reviews Genetics 8(6), 450-461.',
      auraColor: '#10b981', // Emerald
      accentColor: '#34d399',
      description: 'Features feed-forward loop (FFL) circuitry that filters transient noise and detects fold changes in nutrient flow.'
    },
    ELOWITZII: {
      binomialName: 'Oscillocladus elowitzii',
      commonName: "Elowitz's Repressilator",
      honoree: 'Michael B. Elowitz',
      field: 'Synthetic Biology & Biological Oscillators',
      citation: 'Elowitz, M. B., & Leibler, S. (2000). Nature 403, 335-338.',
      auraColor: '#a855f7', // Bioluminescent Purple
      accentColor: '#c084fc',
      description: 'Exhibits an autonomous odd-inverter limit cycle oscillator, producing rhythmic metabolic pacing without external cues.'
    },
    COLLINSII: {
      binomialName: 'Bistabilus collinsii',
      commonName: "Collins' Toggle Switch",
      honoree: 'James J. Collins & Timothy S. Gardner',
      field: 'Synthetic Biology & Cellular Memory',
      citation: 'Gardner, T. S., Cantor, C. R., & Collins, J. J. (2000). Nature 403, 339-342.',
      auraColor: '#00e5ff', // Electric Cyan
      accentColor: '#38bdf8',
      description: 'Maintains 1-bit memory via cross-coupled feedback latches, preserving substrate activation across famine intervals.'
    },
    TURINGII: {
      binomialName: 'Synergobacter turingii',
      commonName: "Turing's Parity Morphogen",
      honoree: 'Alan Turing',
      field: 'Morphogenesis & Theoretical Computer Science',
      citation: 'Turing, A. M. (1952). Phil. Trans. R. Soc. B 237, 37-72.',
      auraColor: '#f59e0b', // Amber Gold
      accentColor: '#fbbf24',
      description: 'Employs composite XOR parity gates to discriminate sharp spatial concentration gradients at plume boundaries.'
    },
    LANDAUERI: {
      binomialName: 'Inhibitovibrio landaueri',
      commonName: "Landauer's Minimal Dissipator",
      honoree: 'Rolf Landauer',
      field: 'Thermodynamics of Computation',
      citation: 'Landauer, R. (1961). IBM J. Res. Dev. 5(3), 183-191.',
      auraColor: '#3b82f6', // Sapphire Blue
      accentColor: '#60a5fa',
      description: 'Allosteric NOT-gated specialist that uncouples during acid pulses to protect battery tokens from Landauer dissipation.'
    },
    MITCHELLII: {
      binomialName: 'Ventricola mitchellii',
      commonName: "Mitchell's Chemiosmotic Feeder",
      honoree: 'Peter Mitchell',
      field: 'Chemiosmosis & Bioenergetics',
      citation: 'Mitchell, P. (1961). Nature 191, 144-148.',
      auraColor: '#f97316', // Deep Vent Coral
      accentColor: '#fb923c',
      description: 'Strict co-catalytic generalist thriving at the vent nozzle, coupling Stream A and B with maximum ATP-equivalent yield.'
    },
    LENSKII: {
      binomialName: 'Silicoplasma lenskii',
      commonName: "Lenski's High-Gen Adapter",
      honoree: 'Richard E. Lenski',
      field: 'Experimental Evolution (LTEE)',
      citation: 'Lenski, R. E., et al. (1991). Am. Nat. 138(6), 1315-1341.',
      auraColor: '#ec4899', // Hot Pink
      accentColor: '#f472b6',
      description: 'Veteran lineage of high generational pedigree (>15 generations) exhibiting fine-tuned evolutionary optimization.'
    },
    LANEI: {
      binomialName: 'Lithomicrobium lanei',
      commonName: "Lane's Lithotrophic Pore-Dweller",
      honoree: 'Nick Lane',
      field: 'Prebiotic Bioenergetics & Origin of Life',
      citation: 'Lane, N., & Martin, W. (2012). Cell 151(7), 1406-1416.',
      auraColor: '#14b8a6', // Deep Teal
      accentColor: '#2dd4bf',
      description: 'Enduring lithotroph colonizing deep chimney basalt walls, relying on stable inorganic proton gradients.'
    },
    RUSSELLII: {
      binomialName: 'Autopoietobacter russellii',
      commonName: "Russell's Mineral Cavity Cell",
      honoree: 'Michael J. Russell',
      field: 'Alkaline Vent Origin & Prebiotic Compartments',
      citation: 'Russell, M. J., & Hall, A. J. (1997). J. Geol. Soc. 154, 377-402.',
      auraColor: '#eab308', // Pyrite Gold
      accentColor: '#facc15',
      description: 'Primitive, low-complexity organism residing directly in iron-sulfur catalytic chambers with high resilience.'
    },
    MARGULISIAE: {
      binomialName: 'Chimerococcus margulisiae',
      commonName: "Margulis's Multi-Gate Symbiont",
      honoree: 'Lynn Margulis',
      field: 'Endosymbiotic Theory & Organelle Evolution',
      citation: 'Sagan (Margulis), L. (1967). J. Theor. Biol. 14(3), 225-274.',
      auraColor: '#8b5cf6', // Indigo Violet
      accentColor: '#a78bfa',
      description: 'Complex multi-operon architecture (>4 logic gates) formed through genomic accretion and subfunctionalization.'
    },
    SHANNONII: {
      binomialName: 'Informavibrio shannonii',
      commonName: "Shannon's High-Fidelity Coder",
      honoree: 'Claude Shannon',
      field: 'Information Theory & Digital Logic',
      citation: 'Shannon, C. E. (1948). Bell Syst. Tech. J. 27(3), 379-423.',
      auraColor: '#06b6d4', // Neon Aqua
      accentColor: '#22d3ee',
      description: 'Dense, error-resistant genome encoding rich catalytic repertoires with minimal redundant non-coding introns.'
    },
    PATTEEI: {
      binomialName: 'Symbiovibrio patteei',
      commonName: "Pattee's Epistemic Generalist",
      honoree: 'Howard H. Pattee',
      field: 'Biosemiotics & Epistemic Cut',
      citation: 'Pattee, H. H. (1972). In Hierarchy Theory (pp. 73-100). Braziller.',
      auraColor: '#38bdf8', // Sky Blue
      accentColor: '#7dd3fc',
      description: 'Archetypal self-replicating organism exhibiting clean genotype-phenotype complementarity across mineral pores.'
    },
    OHNOI: {
      binomialName: 'Polyoperon ohnoi',
      commonName: "Ohno's Duplicated Silicoid",
      honoree: 'Susumu Ohno',
      field: 'Gene Duplication & Genome Expansion',
      citation: 'Ohno, S. (1970). Evolution by Gene Duplication. Springer-Verlag.',
      auraColor: '#e11d48', // Rose Red / Crimson Glow
      accentColor: '#f43f5e',
      description: 'Expanded variable-length genome (>60 bits / >10 codons) formed via tandem codon duplication, providing redundant raw genetic material for neo-functionalization.'
    },
    BONNERII: {
      binomialName: 'Syncytiocladus bonnerii',
      commonName: "Bonner's Multicellular Syncytium",
      honoree: 'John Tyler Bonner',
      field: 'Evolution of Multicellularity & Morphogenesis',
      citation: 'Bonner, J. T. (1998). The Origins of Multicellularity. Integr. Biol. 1(1), 27-36.',
      auraColor: '#8b5cf6', // Indigo Violet
      accentColor: '#a78bfa',
      description: 'Clonal multicellular macro-organism exhibiting directed morphogenetic cleavage and syncytial cytoplasmic streaming.'
    },
    WOLPERTII: {
      binomialName: 'Metazoicladus wolpertii',
      commonName: "Wolpert's Differentiated Metazoan",
      honoree: 'Lewis Wolpert',
      field: 'Developmental Biology & Positional Information',
      citation: 'Wolpert, L. (1969). J. Theor. Biol. 25(1), 1-47.',
      auraColor: '#c084fc', // Radiant Violet-Gold
      accentColor: '#f59e0b',
      description: 'True multicellular organism with spatial Gene Regulatory Network (GRN) division of labor, differentiating clonal genomes into distinct somatic and catalytic tissue types.'
    },
    PURCELLII: {
      binomialName: 'Ventricola purcellii',
      commonName: "Purcell's Temporal Chemotaxer",
      honoree: 'Edward M. Purcell & Howard C. Berg',
      field: 'Biophysics of Chemotaxis & Microscopic Hydrodynamics',
      citation: 'Purcell, E. M. (1977). Life at low Reynolds number. Am. J. Phys. 45, 3-11.',
      auraColor: '#06b6d4', // Electric Cyan-Teal
      accentColor: '#22d3ee',
      description: 'Computes temporal derivative of chemical gradients using fold-change adaptive delay circuits, directing growth along nutrient vectors.'
    },
    PAVLOVII: {
      binomialName: 'Predictovibrio pavlovii',
      commonName: "Pavlov's Anticipatory Regulator",
      honoree: 'Ivan Pavlov & Saeed Tavazoie',
      field: 'Behavioral Physiology & Microbial Associative Learning',
      citation: 'Tagkopoulos, I., Liu, Y. C., & Tavazoie, S. (2008). Science 320(5881), 1313-1317.',
      auraColor: '#f59e0b', // Predictive Amber
      accentColor: '#fbbf24',
      description: 'Employs anticipatory feedforward network to activate protective allosteric shields upon detecting environmental precursors.'
    },
    JOHNSONII: {
      binomialName: 'Chronobacterium johnsonii',
      commonName: "Johnson's Entrained Pacemaker",
      honoree: 'Carl H. Johnson & Michael J. Rust',
      field: 'Circadian Biophysics & Cyanobacterial KaiABC Clocks',
      citation: 'Johnson, C. H., et al. (2008). Ann. Rev. Physiol. 70, 509-535.',
      auraColor: '#ec4899', // Resonant Magenta
      accentColor: '#f472b6',
      description: 'Odd-inverter ring oscillator coupled to input sensory porins, phase-locking internal metabolic rhythms to cyclic vent pulses.'
    },
    NAKAGAKII: {
      binomialName: 'Physarocladus nakagakii',
      commonName: "Nakagaki's Slime Syncytium",
      honoree: 'Toshiyuki Nakagaki & Atsushi Tero',
      field: 'Physarum Amoeboid Intelligence & Adaptive Network Design',
      citation: 'Tero, A., Nakagaki, T., et al. (2010). Science 327(5964), 439-442.',
      auraColor: '#10b981', // Slime Mold Emerald-Gold
      accentColor: '#facc15',
      description: 'Syncytial syncytium optimizing cytoplasmic streaming conduits to construct minimal Steiner tree networks between resource nooks.'
    },
    BALABANII: {
      binomialName: 'Dormitococcus balabanii',
      commonName: "Balaban's Persister Clamp",
      honoree: 'Nathalie Q. Balaban',
      field: 'Bacterial Persistence, Dormancy & Single-Cell Dynamics',
      citation: 'Balaban, N. Q., et al. (2004). Science 305(5690), 1622-1625.',
      auraColor: '#6366f1', // Indigo Hibernation
      accentColor: '#818cf8',
      description: 'Bistable dormancy switch that drops metabolic activity to zero during prolonged famine, surviving extended hydrothermal quiescence.'
    },
    LENSKII_CIT: {
      binomialName: 'Citratovibrio lenskii',
      commonName: "Lenski's Substrate C Exploiter",
      honoree: 'Richard E. Lenski & Zachary Blount',
      field: 'Experimental Microbial Evolution & Key Innovation',
      citation: 'Blount, Z. D., Borland, C. Z., & Lenski, R. E. (2008). PNAS 105(23), 7899-7906.',
      auraColor: '#f43f5e', // Radiant Rose-Crimson
      accentColor: '#fb7185',
      description: 'Evolved functional PORIN_STREAM_C channel capable of catabolizing refractory benthic Substrate C (pyrophosphate/methane), yielding +3 tokens per cycle.'
    },
    NEILSONII: {
      binomialName: 'Siderococcus neilsonii',
      commonName: "Neilands' Mineral Chelator",
      honoree: 'Joe B. Neilands',
      field: 'Microbial Iron Transport & Siderophore Chemistry',
      citation: 'Neilands, J. B. (1995). J. Biol. Chem. 270(45), 26723-26726.',
      auraColor: '#eab308', // Pyrite Gold
      accentColor: '#fde047',
      description: 'Synthesizes high-affinity siderophore mineral chelators, solubilizing impermeable basalt obstacles into bioavailable matter tokens.'
    },
    COSTERTONII: {
      binomialName: 'Biofilmocladus costertonii',
      commonName: "Costerton's Glycocalyx Shield",
      honoree: 'J. William Costerton',
      field: 'Biofilm Microbiology & Extracellular Polymeric Substances (EPS)',
      citation: 'Costerton, J. W., et al. (1999). Science 284(5418), 1318-1322.',
      auraColor: '#14b8a6', // Viscoelastic Teal
      accentColor: '#5eead4',
      description: 'Secretes a protective viscoelastic EPS slime matrix into the surrounding pore cavity, buffering against shearing fluid flow and harsh plumes.'
    },
    WESTII: {
      binomialName: 'Syntrophobacter westii',
      commonName: "West's Paracrine Syntroph",
      honoree: 'Stuart A. West',
      field: 'Evolution of Cooperation & Public Goods Economics',
      citation: 'West, S. A., et al. (2007). Nature Reviews Microbiology 5(12), 971-982.',
      auraColor: '#22c55e', // Cooperative Emerald Green
      accentColor: '#86efac',
      description: 'Engages in obligate mutualistic cross-feeding, transferring surplus battery tokens directly to neighboring heterospecific clades.'
    },
    LOVLEYI: {
      binomialName: 'Electrosarcina lovleyi',
      commonName: "Lovley's Direct Electron Conductor",
      honoree: 'Derek R. Lovley',
      field: 'Electromicrobiology & Direct Interspecies Electron Transfer (DIET)',
      citation: 'Lovley, D. R. (2017). Environmental Microbiology Reports 9(5), 450-466.',
      auraColor: '#38bdf8', // Conductive Sky Blue
      accentColor: '#7dd3fc',
      description: 'Features conductive nanowire-equivalent porins capable of long-distance interspecies electron transfer across basalt channels.'
    },
    SCHNEPFI: {
      binomialName: 'Vampirotheke schnepfii',
      commonName: "Schnepf's Organelle Kleptoplast",
      honoree: 'Eberhard Schnepf',
      field: 'Protistology, Endosymbiosis & Kleptoplasty',
      citation: 'Schnepf, E., & Deichgräber, G. (1984). Protoplasma 123(2), 143-150.',
      auraColor: '#d946ef', // Vampiric Neon Orchid
      accentColor: '#f0abfc',
      description: 'Apex contact predator that lyses prey and assimilates their metabolic organelle cassettes (kleptoplasty), stealing functional catalytic machinery.'
    }
  };

  private static readonly cache = new Map<string, ISpeciesTaxon>();

  /**
   * Classify any given cell/pore based on its tape, gates, generation, and environment
   */
  public static classify(
    queryOrTape?: ITaxonomyQuery | string,
    gateTypes?: readonly string[],
    generation: number = 0,
    isBasalt: boolean = false
  ): ISpeciesTaxon {
    const isQuery = typeof queryOrTape === 'object' && queryOrTape !== null;
    const tapeBitstring = isQuery ? queryOrTape.tapeBitstring : queryOrTape;
    const gTypes = isQuery ? queryOrTape.gateTypes : gateTypes;
    const gen = isQuery ? (queryOrTape.generation ?? 0) : generation;
    const basalt = isQuery ? (queryOrTape.isBasalt ?? false) : isBasalt;
    const hasOrganelle = isQuery ? (queryOrTape.hasOrganelle ?? false) : Boolean(arguments[4]);
    const isSyncytium = isQuery ? (queryOrTape.isSyncytium ?? false) : Boolean(arguments[5]);
    const isDifferentiated = isQuery ? (queryOrTape.isDifferentiated ?? false) : Boolean(arguments[6]);

    // 0a. True Differentiated Metazoan with GRN (Lewis Wolpert homage)
    if (isSyncytium && isDifferentiated) {
      return this.TAXA.WOLPERTII;
    }

    // 0b. Adaptive Steiner Vascular Syncytium (Toshiyuki Nakagaki homage)
    if (isSyncytium && gTypes && gTypes.includes('AND') && gTypes.includes('OR') && gTypes.length >= 3) {
      return this.TAXA.NAKAGAKII;
    }

    // 0c. Multicellular syncytial macro-organism (John Tyler Bonner homage)
    if (isSyncytium) {
      return this.TAXA.BONNERII;
    }

    // 0d. Vampiric kleptoplast predatory organelle theft (Eberhard Schnepf homage)
    if (hasOrganelle && gTypes && gTypes.includes('NOT')) {
      return this.TAXA.SCHNEPFI;
    }

    // 0e. Endosymbiont chimeric organelle (Lynn Margulis homage)
    if (hasOrganelle) {
      return this.TAXA.MARGULISIAE;
    }

    const cacheKey = `${tapeBitstring ?? ''}_${gTypes ? gTypes.join(',') : ''}_${gen >= 15 ? 1 : 0}_${basalt ? 1 : 0}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const result = this.doClassify(tapeBitstring, gTypes, gen, basalt);
    if (this.cache.size > 2000) this.cache.clear();
    this.cache.set(cacheKey, result);
    return result;
  }

  private static doClassify(
    tapeBitstring?: string,
    gateTypes?: readonly string[],
    generation: number = 0,
    isBasalt: boolean = false
  ): ISpeciesTaxon {
    const gates = gateTypes ?? [];
    const gateCount = gates.length;
    const notCount = gates.filter(g => g.includes('NOT')).length;
    const andCount = gates.filter(g => g.includes('AND')).length;
    const orCount = gates.filter(g => g.includes('OR')).length;

    // 1. Evolved Composite Parity & Boundary Discriminator (Turing homage: 4-gate evolved XOR from AND + OR + NOT)
    // Checked prior to length-based OHNOI classification so >60-bit true XOR genomes retain Turing status
    if (andCount >= 2 && orCount >= 1 && notCount >= 1 && gateCount === 4) {
      let isTrueXor = true;
      if (tapeBitstring && tapeBitstring.length >= 36) {
        const wTest = PoreWorkshop.fromBitstring(tapeBitstring);
        const r00 = wTest.step(false, false, false).primaryOutput;
        const r01 = wTest.step(false, true, false).primaryOutput;
        const r10 = wTest.step(true, false, false).primaryOutput;
        const r11 = wTest.step(true, true, false).primaryOutput;
        isTrueXor = !r00 && r01 && r10 && !r11;
      }
      if (isTrueXor) {
        return this.TAXA.TURINGII;
      }
    }

    // 2. Expanded variable-length poly-codon genome via tandem duplication (Susumu Ohno homage)
    if (tapeBitstring && tapeBitstring.length > 60) {
      return this.TAXA.OHNOI;
    }

    const codonValues: number[] = [];
    if (tapeBitstring && tapeBitstring.length >= 36) {
      const wTax = PoreWorkshop.fromBitstring(tapeBitstring);
      wTax.step(true, true, false);
      const ops = wTax.getOperons();
      const opStates = wTax.getOperonStates();
      for (let idx = 0; idx < ops.length; idx++) {
        if (opStates[idx] !== false) {
          for (const node of ops[idx].instructions ?? []) {
            codonValues.push(node.codonIndex);
          }
        }
      }
    } else if (tapeBitstring) {
      for (let i = 0; i + 6 <= tapeBitstring.length; i += 6) {
        codonValues.push(parseInt(tapeBitstring.slice(i, i + 6), 2));
      }
    }

    // 3. Refractory Substrate C / Cit+ key innovation (Richard Lenski & Zachary Blount homage)
    if (gateCount >= 1 && (gates.some(g => g.includes('STREAM_C') || g.includes('PORIN_STREAM_C')) || codonValues.some(c => c >= 8 && c <= 11))) {
      return this.TAXA.LENSKII_CIT;
    }

    // 4. Siderophore mineral chelator secretion (Joe B. Neilands homage)
    if (gateCount >= 1 && (gates.some(g => g.includes('CHELATOR') || g.includes('SECRETION_CHELATOR')) || codonValues.some(c => c >= 18 && c <= 21))) {
      return this.TAXA.NEILSONII;
    }

    // 5. Extracellular Polymeric Substance (EPS) biofilm shield (J. William Costerton homage)
    if (gateCount >= 1 && (gates.some(g => g.includes('EPS') || g.includes('SECRETION_EPS')) || codonValues.some(c => c >= 28 && c <= 31))) {
      return this.TAXA.COSTERTONII;
    }

    // 5b. Direct Interspecies Electron Transfer (DIET) nanowire porin (Derek R. Lovley homage; Codons 36-37)
    if (gateCount >= 1 && (gates.some(g => g.includes('ELECTRO_REDOX')) || codonValues.some(c => c === 36 || c === 37))) {
      return this.TAXA.LOVLEYI;
    }

    // 5c. Paracrine Syntrophic Cross-Feeder / Nitrogen Donor Coupling (Stuart A. West homage; Codons 42-43)
    if (gateCount >= 1 && (gates.some(g => g.includes('STREAM_D')) || (codonValues.some(c => c === 42 || c === 43) && gateCount >= 2))) {
      return this.TAXA.WESTII;
    }

    // 6. High-complexity multi-gate operon (Margulis homage)
    if (gateCount >= 5) {
      return this.TAXA.MARGULISIAE;
    }

    // 7. Entrained Pacemaker (Johnson & Rust homage) vs Repressilator ring oscillator (Elowitz homage)
    // Requires a contiguous odd-length run of >= 3 NOT gates (actual ring oscillator topology)
    let hasContiguousOddNotRun = false;
    let currentNotRun = 0;
    for (const g of gates) {
      if (g.includes('NOT')) {
        currentNotRun++;
      } else {
        if (currentNotRun >= 3 && currentNotRun % 2 === 1) hasContiguousOddNotRun = true;
        currentNotRun = 0;
      }
    }
    if (currentNotRun >= 3 && currentNotRun % 2 === 1) hasContiguousOddNotRun = true;

    if (hasContiguousOddNotRun) {
      if (gates.includes('AND') || gates.includes('OR')) {
        return this.TAXA.JOHNSONII;
      }
      return this.TAXA.ELOWITZII;
    }

    // 8. Anticipatory Pavlovian Regulator (Pavlov & Tavazoie homage)
    if (gates[0]?.includes('NOT') && gates[1]?.includes('AND') && gates[gates.length - 1]?.includes('OR') && gateCount >= 3) {
      return this.TAXA.PAVLOVII;
    }

    // 9. Temporal Derivative Chemotaxis Engine (Purcell & Berg homage)
    if (gates.includes('AND') && gates.includes('NOT') && andCount >= 2 && gateCount >= 3 && !gates[gates.length - 1]?.includes('NOT')) {
      return this.TAXA.PURCELLII;
    }

    // 10. Cryptobiotic Dormancy Clamp (Balaban homage)
    if (notCount === 2 && gates[gates.length - 1]?.includes('OR') && gateCount >= 3) {
      return this.TAXA.BALABANII;
    }

    // 11. Bistable toggle switch memory latch (Collins & Gardner homage — 2-gate cross-coupled [AND, OR] / [OR, AND])
    if (gates.includes('AND') && gates.includes('OR') && notCount === 0 && gateCount === 2) {
      return this.TAXA.COLLINSII;
    }

    // 12. Allosteric shield / Landauer dissipation miser (Landauer homage)
    if (gates.includes('NOT') && (tapeBitstring?.includes('1111') || notCount >= 1)) {
      return this.TAXA.LANDAUERI;
    }

    // 13. Feed-forward loop / fold-change detector (Alon homage)
    if (gates.includes('AND') && gateCount >= 2) {
      return this.TAXA.ALONII;
    }

    // 14. High generational pedigree veteran generalist (Lenski LTEE homage)
    if (generation >= 15) {
      return this.TAXA.LENSKII;
    }

    // 15. Co-catalytic Mitchell PMF specialist
    if (gates.includes('AND')) {
      return this.TAXA.MITCHELLII;
    }

    // 16. Dense genome with high information content (Shannon homage)
    if (tapeBitstring && tapeBitstring.length >= 24 && gateCount >= 2) {
      return this.TAXA.SHANNONII;
    }

    // 17. Deep basalt substrate dweller (Lane homage)
    if (isBasalt) {
      return this.TAXA.LANEI;
    }

    // 18. Low gate count / mineral cavity dweller (Russell homage)
    if (gateCount <= 1) {
      return this.TAXA.RUSSELLII;
    }

    // Default: Howard Pattee epistemic generalist
    return this.TAXA.PATTEEI;
  }

  public static getTaxon(key: string): ISpeciesTaxon {
    return this.TAXA[key] ?? this.TAXA.PATTEEI;
  }

  public static getAllTaxa(): readonly ISpeciesTaxon[] {
    return Object.values(this.TAXA);
  }
}
