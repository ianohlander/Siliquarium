/**
 * 🏛️ Siliquarium UI Subsystem
 * PedagogicalCourseRegistry: Structured Course Modules, Lecture Context,
 * Biophysical Foundations, and POE Checkpoints for BIO/CS 101.
 */

export interface IPoeOption {
  readonly label: string;
  readonly isCorrect: boolean;
  readonly feedback: string;
}

export interface IPoeCheckpoint {
  readonly question: string;
  readonly options: readonly IPoeOption[];
}

export interface IPracticumStep {
  readonly stepNumber: number;
  readonly instruction: string;
  readonly expectedOutcome: string;
  readonly actionKey?: string;
  readonly actionLabel?: string;
  readonly targetElementId?: string;
}

export interface ICourseModule {
  readonly id: string;
  readonly title: string;
  readonly track: 'track-1' | 'track-2';
  readonly badge: string;
  readonly tagline: string;
  readonly lectureIntro: string;
  readonly biophysicalFoundations: readonly string[];
  readonly practicumSteps: readonly IPracticumStep[];
  readonly poeCheckpoint: IPoeCheckpoint;
}

export const COURSE_MODULES: readonly ICourseModule[] = Object.freeze([
  {
    id: 'module-1',
    title: 'Module 1: The Abyssal Stage & Seafloor Geometry',
    track: 'track-1',
    badge: 'Foundations',
    tagline: 'Overcoming the Dilution Catastrophe with Russell Rock Pores',
    lectureIntro:
      'In open water, reactant molecules diffuse in three dimensions and reaction rates collapse asymptotically to zero (Rate = k[A][B]). Nature solved this Dilution Catastrophe not by inventing membranes first, but by utilizing free inorganic FeS basalt rock cavities at alkaline hydrothermal vents. Let us inspect the 3D hexagonal seafloor.',
    biophysicalFoundations: [
      'Dilution Catastrophe (Russell & Hall 1997)',
      'Hexagonal Spatial Boundaries (HexGrid3D)',
      'Aqueous Fluid Dispersal (z >= 1) vs. Basalt Bedrock (z <= 0)'
    ],
    practicumSteps: [
      {
        stepNumber: 1,
        instruction: 'Locate the central hydrothermal vent caldera at coordinates [0, 0, 0].',
        expectedOutcome: 'Glowing thermal convective plume rising vertically into the water column.',
        actionKey: 'focus-caldera',
        actionLabel: 'Fly to Caldera [0,0,0]',
        targetElementId: 'seafloor-canvas'
      },
      {
        stepNumber: 2,
        instruction: 'Find an active emerald green pore with battery reserves exceeding 60 tokens.',
        expectedOutcome: 'Reticle locks onto the pore and displays the cell coordinate pin badge.',
        actionKey: 'select-first-cell',
        actionLabel: 'Select Sample Cell',
        targetElementId: 'seafloor-canvas'
      },
      {
        stepNumber: 3,
        instruction: 'Trigger Cinematic Focus (Hotkey F) to glide the camera into the chamber.',
        expectedOutcome: 'Surrounding rock walls dissolve into proximity transparency.',
        actionKey: 'cinematic-focus',
        actionLabel: 'Trigger Cinematic Focus (F)',
        targetElementId: 'seafloor-canvas'
      }
    ],
    poeCheckpoint: {
      question: 'Why do cells directly adjoining the vent nozzle exhibit a more rapid breathing aura than perimeter cells?',
      options: [
        {
          label: 'Thermal flux Q(r) decays with distance, accelerating electron clock rates near the nozzle.',
          isCorrect: true,
          feedback: 'Correct! Proximity to the thermal plume increases chemical kinetic rates, driving faster metabolic gate cycles.'
        },
        {
          label: 'Perimeter cells have intentionally disabled their batteries to conserve water.',
          isCorrect: false,
          feedback: 'Incorrect. Siliquarium cells have no conscious intent; perimeter cells simply experience lower environmental enthalpy flux.'
        },
        {
          label: 'The visualizer renders distant cells with lower frame rates to save GPU memory.',
          isCorrect: false,
          feedback: 'Incorrect. The pulsing rate is an authentic physical property calculated by PoreBattery and VentPhysics.'
        }
      ]
    }
  },
  {
    id: 'module-2',
    title: 'Module 2: The Living Cell & Epistemic Cut',
    track: 'track-1',
    badge: 'Biophysics',
    tagline: 'Separating Inert Rate-Independent Code from Active Catalytic Dynamics',
    lectureIntro:
      "Howard Pattee proved in 1982 that living systems must separate rate-independent symbolic memory (GenomeSafe) from rate-dependent physical dynamics (PoreWorkshop). The cookbook recipe remains safe and unburnt in the office safe while cooking takes place in the kitchen.",
    biophysicalFoundations: [
      "Howard Pattee's Epistemic Cut (1982)",
      'Rate-Independent Quiescent Code (GenomeSafe)',
      'Rate-Dependent CMOS Catalysis (PoreWorkshop)'
    ],
    practicumSteps: [
      {
        stepNumber: 1,
        instruction: 'Open the 2D Circuit Microscope drawer for your selected cell.',
        expectedOutcome: 'Microscope slides open displaying the genome ribbon and wiring netlist.',
        actionKey: 'open-microscope',
        actionLabel: 'Open Circuit Microscope',
        targetElementId: 'btn-microscope-launch'
      },
      {
        stepNumber: 2,
        instruction: 'Verify that the top Genome Safe ribbon shows 0 current and does not mutate during runtime.',
        expectedOutcome: 'The 60-bit tape remains quiescent while logic gates actively toggle.',
        actionKey: 'inspect-genome-tape',
        actionLabel: 'Inspect Genome Ribbon',
        targetElementId: 'microscope-view'
      }
    ],
    poeCheckpoint: {
      question: 'When do genetic mutations occur in Siliquarium?',
      options: [
        {
          label: 'Strictly during template photocopying during cytokinesis, never during active runtime.',
          isCorrect: true,
          feedback: "Correct! Howard Pattee's Epistemic Cut ensures that active metabolism never corrupts the inert hereditary archive."
        },
        {
          label: 'Whenever a logic gate burns Landauer heat.',
          isCorrect: false,
          feedback: 'Incorrect. Heat dissipation drains battery tokens, but does not alter the inert genome tape.'
        }
      ]
    }
  },
  {
    id: 'module-3',
    title: 'Module 3: Enzymatic Logic & Circuit Testbench',
    track: 'track-1',
    badge: 'Bio-Computing',
    tagline: 'Boolean Gates as Catalytic Enzymes and Toxin Defense',
    lectureIntro:
      'Boolean logic gates act as digital enzymes. An AND gate mimics an allosteric enzyme requiring both substrate and cofactor; a NOT gate inhibits poisonous influxes. The testbench allows us to manually inject bitstreams into living circuits.',
    biophysicalFoundations: [
      'Digital Enzyme Equivalence (Alon 2007)',
      'Allosteric Inverters & Heavy Metal Poison Clamps',
      'Weisfeiler-Lehman (WL) Graph Isomorphism Fingerprinting'
    ],
    practicumSteps: [
      {
        stepNumber: 1,
        instruction: 'Switch to the "Dynamics & Testbench" tab in the Circuit Microscope.',
        expectedOutcome: 'Interactive signal probe buttons and real-time truth table appear.',
        actionKey: 'open-testbench',
        actionLabel: 'Open Signal Testbench',
        targetElementId: 'microscope-view'
      },
      {
        stepNumber: 2,
        instruction: 'Inject a simulated pulse by clicking the Stream A toggle button.',
        expectedOutcome: 'Active signal paths illuminate with traveling electron dots.',
        actionKey: 'testbench-toggle-a',
        actionLabel: 'Inject Stream A Signal',
        targetElementId: 'microscope-view'
      }
    ],
    poeCheckpoint: {
      question: 'What is the purpose of an evolved NOT gate wired to toxic Stream T?',
      options: [
        {
          label: 'It inverts poison into an inhibitory shutoff signal, protecting the battery from negative clamping.',
          isCorrect: true,
          feedback: 'Correct! The NOT gate functions as an allosteric repressor, turning toxic influx into metabolic defense.'
        },
        {
          label: 'It doubles the physical size of the hexagonal chamber.',
          isCorrect: false,
          feedback: 'Incorrect. Gate logic modifies signal flow and battery charge, not physical rock geometry.'
        }
      ]
    }
  },
  {
    id: 'module-4',
    title: 'Module 4: Closed-Universe Thermodynamics',
    track: 'track-1',
    badge: 'Thermodynamics',
    tagline: 'Zero Smuggling and the Rolf Landauer Erasure Cost',
    lectureIntro:
      'Information is physical. Rolf Landauer proved in 1961 that flipping or erasing logic bits dissipates minimum heat Q >= kT ln 2. In Siliquarium, every gate switch burns 1 energy token. The universal invariant ΔE = 0.000 proves no energy is conjured.',
    biophysicalFoundations: [
      'Landauer Limit Q >= kT ln 2 (Landauer 1961)',
      'Closed-Universe Conservation Invariant (ΔE = 0.000, ΔM = 0.000)',
      'Metabolic Drag of Non-Adaptive Genetic Bloat'
    ],
    practicumSteps: [
      {
        stepNumber: 1,
        instruction: 'Open the Pull-Down Ecosystem Statistics Panel from the header.',
        expectedOutcome: 'Census counters, stored energy, and the emerald conservation invariant display.',
        actionKey: 'open-stats',
        actionLabel: 'Open Ecosystem Stats (S)',
        targetElementId: 'hud-stats-btn'
      }
    ],
    poeCheckpoint: {
      question: 'Why does an organism with 40 redundant, unused logic gates suffer higher mortality?',
      options: [
        {
          label: 'Each gate switch dissipates Landauer heat, creating metabolic drag that drains the battery.',
          isCorrect: true,
          feedback: 'Correct! Redundant computation has a thermodynamic price. Without adaptive energy return, the lineage starves.'
        },
        {
          label: 'The simulation arbitrarily penalizes organisms with large genomes.',
          isCorrect: false,
          feedback: 'Incorrect. Siliquarium has zero arbitrary penalties; death results strictly from first-law battery exhaustion.'
        }
      ]
    }
  },
  {
    id: 'module-5',
    title: 'Module 5: The Field Naturalist & Guided Safari',
    track: 'track-1',
    badge: 'Naturalist',
    tagline: 'Autonomous AI Paleontology and Emergent Adaptation Tours',
    lectureIntro:
      'Rather than relying on human guesswork, the on-board Naturalist Assistant calculates Shannon diversity entropy, tracks Uri Alon motifs, and highlights emergent multicellular behaviors in real time.',
    biophysicalFoundations: [
      'Shannon Information Entropy H',
      'Uri Alon Biological Network Motifs',
      'Automated Field Tours and Chroma Isolation'
    ],
    practicumSteps: [
      {
        stepNumber: 1,
        instruction: 'Launch the Naturalist Assistant modal using Hotkey A.',
        expectedOutcome: 'Macro-evolutionary radar, era badge, and discovered specimens appear.',
        actionKey: 'open-naturalist',
        actionLabel: 'Open Naturalist Guide (A)',
        targetElementId: 'hud-naturalist-btn'
      },
      {
        stepNumber: 2,
        instruction: 'Switch to Guided Safari mode to isolate specimens with specialized chroma shading.',
        expectedOutcome: 'Viewport isolates living specimens and activates the in-situ Field Scope HUD.',
        actionKey: 'switch-safari',
        actionLabel: 'Enter Guided Safari Mode',
        targetElementId: 'btn-mode-safari'
      }
    ],
    poeCheckpoint: {
      question: 'What does a high Shannon Diversity Index (H) indicate about the ecosystem?',
      options: [
        {
          label: 'A wide variety of distinct circuit motifs and genomic clades are actively coexisting in the caldera.',
          isCorrect: true,
          feedback: 'Correct! High H reflects diverse phenotypic niches rather than a monoculture.'
        },
        {
          label: 'The hydrothermal vent has run out of thermal enthalpy.',
          isCorrect: false,
          feedback: 'Incorrect. Shannon entropy measures genetic and phenotypic diversity, not vent fuel reserves.'
        }
      ]
    }
  },
  {
    id: 'module-6',
    title: 'Module 6: Multi-Scale Lenses & Optical Histology',
    track: 'track-2',
    badge: 'Histology',
    tagline: 'Multi-Spectral Observation from Molecular Wires to Cell Membranes',
    lectureIntro:
      'Biological systems cannot be understood through a single visual perspective. Siliquarium provides 5 multi-scale representation lenses and histological optical stains (DAPI, Bodipy, Voltage-sensitive dyes).',
    biophysicalFoundations: [
      'Multi-Scale Biological Representation',
      'Optical Staining Transforms',
      'Transmembrane Voltage Clamping'
    ],
    practicumSteps: [
      {
        stepNumber: 1,
        instruction: 'Cycle through the biological lenses in the top HUD (Logic, Porin, Metabolic, Cytosolic).',
        expectedOutcome: 'Lattice shading updates dynamically to highlight membrane porins vs. metabolic charge.',
        actionKey: 'cycle-lenses',
        actionLabel: 'Cycle Biological Lenses',
        targetElementId: 'hud-vital-cluster'
      }
    ],
    poeCheckpoint: {
      question: 'What does the Voltage-Sensitive Optical Stain reveal in active colonies?',
      options: [
        {
          label: 'Chemiosmotic electrochemical potential gradients across living cellular membranes.',
          isCorrect: true,
          feedback: 'Correct! The voltage dye highlights the Peter Mitchell proton motive force across active chambers.'
        },
        {
          label: 'The external temperature of the computer CPU.',
          isCorrect: false,
          feedback: 'Incorrect. It visualizes in-silico transmembrane potential.'
        }
      ]
    }
  },
  {
    id: 'module-7',
    title: 'Module 7: Chronicle Flight Recorder & Kinematics',
    track: 'track-2',
    badge: 'Kinematics',
    tagline: 'Stephen Jay Gould\'s Thought Experiment: Replaying Life\'s Tape',
    lectureIntro:
      'Can evolutionary history repeat itself? Chronicle Mode provides a historical flight recorder that scrubs time backward, keyframes bifurcations, and explores 16 landmark emergent evolutionary phenomena.',
    biophysicalFoundations: [
      'Historical Contingency (Gould 1989)',
      'Multicellular Treadmilling Motility',
      'Lewis Wolpert\'s French Flag Morphogen Gradient'
    ],
    practicumSteps: [
      {
        stepNumber: 1,
        instruction: 'Enter Chronicle Mode using Hotkey C or the top workspace selector.',
        expectedOutcome: 'Historical kinematics scrubber dock appears at the bottom of the viewport.',
        actionKey: 'switch-chronicle',
        actionLabel: 'Enter Chronicle Mode (C)',
        targetElementId: 'btn-mode-chronicle'
      }
    ],
    poeCheckpoint: {
      question: 'What is multicellular treadmilling motility in Siliquarium?',
      options: [
        {
          label: 'Coordinated directional colony displacement via asymmetric cytokinesis and detrital lysis.',
          isCorrect: true,
          feedback: 'Correct! The syncytial colony advances across the basalt seabed by dividing at the leading edge and lysing at the rear.'
        },
        {
          label: 'Random Brownian motion caused by numerical floating-point drift.',
          isCorrect: false,
          feedback: 'Incorrect. Treadmilling is an emergent biological motility strategy governed by coordinated cellular logic.'
        }
      ]
    }
  },
  {
    id: 'module-8',
    title: 'Module 8: Design Studio & 3D Bathymetric CAD',
    track: 'track-2',
    badge: 'Bio-CAD',
    tagline: 'Synthetic Ecology: Sculpting Seamounts and Graben Trenches',
    lectureIntro:
      'Physical bathymetry dictates ecological isolation and gene flow. The Siliquarium Design Studio allows researchers to sculpt basalt breakwaters, auto-stack spires up to z=7, tear open grabens down to z=-1, and inoculate Lenski strains.',
    biophysicalFoundations: [
      'Niche Construction & Allopatric Speciation',
      'Subterranean Graben Excavation (z = -1)',
      'Synthetic Inoculation & Patriarch Lineages'
    ],
    practicumSteps: [
      {
        stepNumber: 1,
        instruction: 'Open the Siliquarium Design Studio using Hotkey D or F4.',
        expectedOutcome: 'World Builder ribbon bar opens with Geomorphology, Bio-Library, and Tectonics palettes.',
        actionKey: 'switch-studio',
        actionLabel: 'Launch Design Studio (D)',
        targetElementId: 'btn-mode-studio'
      }
    ],
    poeCheckpoint: {
      question: 'Why does an excavated subterranean trench (z = -1) protect anaerobic autotrophs from surface predators?',
      options: [
        {
          label: 'Solid basalt walls physically bar predatory cells from entering the crevice.',
          isCorrect: true,
          feedback: 'Correct! Physical compartmentation isolates micro-populations, enabling allopatric divergence.'
        },
        {
          label: 'Subterranean cells become invisible to computer rendering.',
          isCorrect: false,
          feedback: 'Incorrect. The simulation tracks all depths; the barrier is physical hexagonal matrix occlusion.'
        }
      ]
    }
  },
  {
    id: 'module-9',
    title: 'Module 9: Evolutionary Version Control & Forking',
    track: 'track-2',
    badge: 'Version Control',
    tagline: 'Git-for-Alife: Parallel Multiverses and Counterfactual Experiments',
    lectureIntro:
      'In traditional biology, we cannot branch time to test counterfactual hypotheses. Siliquarium implements a Git-like Directed Acyclic Graph (DAG) for evolutionary timelines. Fork the ecosystem, apply a thermal shock to Branch A while keeping Branch B pristine, and compare divergence.',
    biophysicalFoundations: [
      'Branching Counterfactual Evolutionary Phylogeny',
      'Bit-Deterministic State Checkpoints (.silisave)',
      'Parallel Timeline Comparative Genomics'
    ],
    practicumSteps: [
      {
        stepNumber: 1,
        instruction: 'Open Evolutionary Version Control by pressing Hotkey B.',
        expectedOutcome: 'Evolutionary timeline modal opens displaying branches, commits, and save slots.',
        actionKey: 'open-branches',
        actionLabel: 'Open Version Control (B)',
        targetElementId: 'hud-branches-btn'
      }
    ],
    poeCheckpoint: {
      question: 'What is the primary scientific utility of forking an evolutionary simulation branch?',
      options: [
        {
          label: 'To run controlled, counterfactual experiments testing how specific environmental crises alter lineage survival.',
          isCorrect: true,
          feedback: 'Correct! Branching enables researchers to rigorously isolate causal evolutionary variables.'
        },
        {
          label: 'To delete all simulation files from the hard drive.',
          isCorrect: false,
          feedback: 'Incorrect. Version control preserves states and enables non-destructive parallel investigation.'
        }
      ]
    }
  },
  {
    id: 'module-10',
    title: 'Module 10: Deep Lab Academic Artifact Export',
    track: 'track-2',
    badge: 'Deep Lab',
    tagline: 'Translating Digital Abiogenesis into Publication-Grade Data',
    lectureIntro:
      'Scientific discovery demands open, reproducible data. In The Deep Lab mode, researchers can export high-resolution telemetry CSVs, full 3D world state JSONs, and formatted university lab practicum reports.',
    biophysicalFoundations: [
      'Reproducible Computational Science',
      'Time-Series Enthalpy & Diversity Telemetry',
      'Automated Academic Practicum Reporting'
    ],
    practicumSteps: [
      {
        stepNumber: 1,
        instruction: 'Switch to The Deep Lab academic mode using the top-left portal toggle.',
        expectedOutcome: 'Academic toolbar with practicum selector and export menu appears.',
        actionKey: 'switch-deeplab',
        actionLabel: 'Activate Deep Lab Portal',
        targetElementId: 'btn-portal-deeplab'
      }
    ],
    poeCheckpoint: {
      question: 'What format is generated when you click "Export Telemetry CSV"?',
      options: [
        {
          label: 'A structured, comma-delimited time-series spreadsheet of population, Shannon diversity, and energy flux.',
          isCorrect: true,
          feedback: 'Correct! The exported CSV can be directly imported into Python, R, or Excel for statistical modeling.'
        },
        {
          label: 'An audio MP3 recording of the hydrothermal vent.',
          isCorrect: false,
          feedback: 'Incorrect. Telemetry CSV contains numerical scientific time-series data.'
        }
      ]
    }
  }
]);
