/**
 * 🐠 Siliquarium UI Subsystem
 * GlossaryTermRegistry: Static taxonomy & biophysical term database for in-app scientific inspection.
 */

export interface IGlossaryEntry {
  readonly term: string;
  readonly category: 'Biophysics' | 'Information Theory' | 'Systems Biology' | 'Evolutionary Genetics';
  readonly definition: string;
  readonly biologicalReality: string;
  readonly siliquariumMapping: string;
  readonly anchor: string;
}

export const GLOSSARY_DATABASE: Record<string, IGlossaryEntry> = {
  landauer: {
    term: "Landauer's Principle",
    category: 'Information Theory',
    definition: 'A fundamental thermodynamic law proving that erasing or overwriting 1 bit of physical information dissipates a minimum entropy cost of k * T * ln(2) joules of heat.',
    biologicalReality: 'Every enzymatic conformational change and proofreading cycle in DNA polymerase burns ATP simply to clear obsolete chemical intermediate states.',
    siliquariumMapping: 'Every toggling logic gate burns exactly 1 energy token from the cell battery (recorded in ThermodynamicLedger.ts).',
    anchor: '11-landauers-principle'
  },
  uri_alon: {
    term: 'Uri Alon Network Motifs',
    category: 'Systems Biology',
    definition: 'Recurring topological sub-graphs in cellular transcriptional and enzymatic networks that appear at frequencies significantly higher than in randomized networks.',
    biologicalReality: 'Gene regulation networks in E. coli rely on recurrent motifs like Feed-Forward Loops and Negative Autoregulation to filter noise and accelerate response times.',
    siliquariumMapping: 'MotifScanner.ts detects canonical 3-node patterns in the PoreWorkshop netlist and awards paleontological milestones.',
    anchor: '29-network-motif'
  },
  feed_forward_loop: {
    term: 'Feed-Forward Loop (FFL)',
    category: 'Systems Biology',
    definition: 'A three-node directed motif where an input node X regulates an output node Z both directly (X -> Z) and indirectly through an intermediate node Y (X -> Y -> Z).',
    biologicalReality: 'Incoherent FFLs (I-FFL) act as pulse generators and fold-change detectors; Coherent FFLs (C-FFL) act as sign-sensitive delay filters protecting against fleeting noise.',
    siliquariumMapping: 'Classified in NetworkMotif.ts as MOTIF_C_FFL or MOTIF_I_FFL, determining how cells filter intermittent hydrothermal fuel streams.',
    anchor: '34-coherent-feed-forward-loop-c-ffl-type-1'
  },
  bistable_latch: {
    term: 'Bistable Genetic Toggle Switch',
    category: 'Systems Biology',
    definition: 'A memory motif composed of two mutually repressing enzymes/gates capable of resting in one of two stable steady states without external power.',
    biologicalReality: 'Pioneered in synthetic biology by Gardner, Cantor & Collins (2000). Governs cellular differentiation and epigenetic fate switching.',
    siliquariumMapping: 'Allows silicoid cells to lock into an active state after receiving a single transient fuel pulse, sustaining metabolism during periods of famine.',
    anchor: '30-bistable-genetic-toggle-switch'
  },
  epistemic_cut: {
    term: "Howard Pattee's Epistemic Cut",
    category: 'Biophysics',
    definition: 'The immutable theoretical boundary separating rate-independent symbolic hereditary information from rate-dependent dynamic physical metabolism.',
    biologicalReality: 'DNA molecules are rate-independent symbolic records; metabolic enzymes are rate-dependent dynamical machines governed by thermodynamics.',
    siliquariumMapping: 'GenomeSafe.ts (inert 60-bit string, zero power) is physically decoupled from PoreWorkshop.ts (active dynamical logic gates).',
    anchor: '15-the-epistemic-cut'
  },
  pmf: {
    term: 'Proton Motive Force (PMF)',
    category: 'Biophysics',
    definition: 'The electrochemical gradient composed of membrane potential (Δψ) and proton chemical gradient (ΔpH) that drives cellular ATP synthesis.',
    biologicalReality: 'Natural alkaline hydrothermal vents sustained a 200 mV natural PMF across 5nm iron-sulfide membranes, powering abiotic redox before enzymes evolved.',
    siliquariumMapping: 'Simulated in VentPhysics.ts and PoreBattery.ts as the baseline redox influx driving catalytic gate transitions.',
    anchor: '4-proton-motive-force-pmf'
  },
  weisfeiler_lehman: {
    term: 'Weisfeiler-Lehman (1-WL) Graph Test',
    category: 'Systems Biology',
    definition: 'A color-refinement graph kernel algorithm that computes a topological hash invariant for any network without relying on subjective human labels.',
    biologicalReality: 'Allows objective classification of convergent evolution: two distinct lineages that independently evolve the exact same circuit topology will share an identical 1-WL hash.',
    siliquariumMapping: 'WeisfeilerLehmanHasher.ts computes deterministic 32-bit hashes of active gate nets to detect homoplasy in real time.',
    anchor: '37-weisfeiler-lehman-1-wl-graph-isomorphism-test'
  },
  ltee: {
    term: 'Long-Term Evolution Experiment (LTEE)',
    category: 'Evolutionary Genetics',
    definition: 'A multi-decade evolutionary experiment tracking fitness, mutation rates, and historical contingency across tens of thousands of generations.',
    biologicalReality: 'Initiated by Richard Lenski in 1988 with 12 isolated populations of E. coli, demonstrating hyper-mutability and spontaneous Cit+ metabolic breakthroughs.',
    siliquariumMapping: 'LteeBenchmark.ts and DigitalPaleontologist.ts record hyperbolic fitness curves, clade founders, and generation lineages.',
    anchor: '47-long-term-evolution-experiment-ltee'
  },
  neutral_drift: {
    term: "Motoo Kimura's Neutral Theory",
    category: 'Evolutionary Genetics',
    definition: 'The principle that the vast majority of evolutionary substitutions at the molecular level are caused by random genetic drift of selectively neutral mutants.',
    biologicalReality: 'Synonymous codon mutations in third wobble positions change the DNA sequence without altering the encoded amino acid.',
    siliquariumMapping: 'The 64-entry codon table in GenomeSafe.ts contains 16 neutral intron codons that mutate freely without breaking the active logic circuit.',
    anchor: '42-neutral-theory-of-molecular-evolution'
  },
  pelagic_spores: {
    term: 'Pelagic Spore Dispersal',
    category: 'Evolutionary Genetics',
    definition: 'The evolutionary transition from sessile benthic adhesion on rock substrates to waterborne pelagic dispersal and colonization.',
    biologicalReality: 'Microbial endospore formation (Bacillus, Clostridium) enables survival during environmental collapse and long-distance passive drift.',
    siliquariumMapping: 'Pelagic spores drift through the 3D water column, guided by thermal plumes and gravity, colonizing vacant seafloor pores.',
    anchor: '53-pelagic-spore-advection'
  },
  rosette: {
    term: 'Rosette Morphology (Mutual Triangular Hub)',
    category: 'Systems Biology',
    definition: 'A compact radial multicellular topology characterized by mutual 3-pore triangular adjacencies (triangleCount >= 1) in the hexagonal lattice. Forms a tightly clustered floral whorl with high clustering coefficient.',
    biologicalReality: 'Directly mirrors choanoflagellate rosettes (Salpingoeca rosetta) and Volvox spheroids. Cells maximize shared intercellular exchange surface area while minimizing intra-colony diffusion distances.',
    siliquariumMapping: 'Classified in SimulationWorld.ts:classifyColonyTopology(). Formally diagnosed when any 3 adjacent pores form an equilateral triangular cycle (A-B, B-C, C-A). Enables division of labor between outer Somatic Shield cells and inner Trophocytes.',
    anchor: 'multicellular-body-topologies-and-morphometrics'
  },
  rosette_morphology: {
    term: 'Rosette Morphology (Mutual Triangular Hub)',
    category: 'Systems Biology',
    definition: 'A compact radial multicellular topology characterized by mutual 3-pore triangular adjacencies (triangleCount >= 1) in the hexagonal lattice. Forms a tightly clustered floral whorl with high clustering coefficient.',
    biologicalReality: 'Directly mirrors choanoflagellate rosettes (Salpingoeca rosetta) and Volvox spheroids. Cells maximize shared intercellular exchange surface area while minimizing intra-colony diffusion distances.',
    siliquariumMapping: 'Classified in SimulationWorld.ts:classifyColonyTopology(). Formally diagnosed when any 3 adjacent pores form an equilateral triangular cycle (A-B, B-C, C-A). Enables division of labor between outer Somatic Shield cells and inner Trophocytes.',
    anchor: 'multicellular-body-topologies-and-morphometrics'
  },
  columnar: {
    term: 'Columnar Morphology (Vertical Spire Stack)',
    category: 'Systems Biology',
    definition: 'A purely vertical, 1D spire stacking along the z-axis where all constituent pores share identical axial coordinates (q_i = q_0, r_i = r_0).',
    biologicalReality: 'Analogous to vertical chimney-dwelling sponge stalks (Hexactinellida) and stromatolite vertical columnar pillars optimizing access to laminar hydrothermal upwellings.',
    siliquariumMapping: 'Diagnosed when every pore in the syncytial component satisfies q === q_0 && r === r_0. Efficiently bridges thermal strata from bedrock into upper water layers.',
    anchor: 'multicellular-body-topologies-and-morphometrics'
  },
  columnar_morphology: {
    term: 'Columnar Morphology (Vertical Spire Stack)',
    category: 'Systems Biology',
    definition: 'A purely vertical, 1D spire stacking along the z-axis where all constituent pores share identical axial coordinates (q_i = q_0, r_i = r_0).',
    biologicalReality: 'Analogous to vertical chimney-dwelling sponge stalks (Hexactinellida) and stromatolite vertical columnar pillars optimizing access to laminar hydrothermal upwellings.',
    siliquariumMapping: 'Diagnosed when every pore in the syncytial component satisfies q === q_0 && r === r_0. Efficiently bridges thermal strata from bedrock into upper water layers.',
    anchor: 'multicellular-body-topologies-and-morphometrics'
  },
  dendritic: {
    term: 'Dendritic Morphology (Bifurcating Fractal Tree)',
    category: 'Systems Biology',
    definition: 'A branching arborization without triangular cycles where maximum neighbor degree maxDeg >= 3. Forms bifurcating tree/coral networks.',
    biologicalReality: 'Exhibited in arborescent bryozoans, dendritic corals, and fungal mycelia that branch outwards across substrate gradients to maximize exploratory spatial reach.',
    siliquariumMapping: 'Diagnosed when maximum connectivity degree maxDeg >= 3 and triangleCount === 0. Facilitates distributed sampling of separate chemical plumes across the seafloor.',
    anchor: 'multicellular-body-topologies-and-morphometrics'
  },
  dendritic_morphology: {
    term: 'Dendritic Morphology (Bifurcating Fractal Tree)',
    category: 'Systems Biology',
    definition: 'A branching arborization without triangular cycles where maximum neighbor degree maxDeg >= 3. Forms bifurcating tree/coral networks.',
    biologicalReality: 'Exhibited in arborescent bryozoans, dendritic corals, and fungal mycelia that branch outwards across substrate gradients to maximize exploratory spatial reach.',
    siliquariumMapping: 'Diagnosed when maximum connectivity degree maxDeg >= 3 and triangleCount === 0. Facilitates distributed sampling of separate chemical plumes across the seafloor.',
    anchor: 'multicellular-body-topologies-and-morphometrics'
  },
  ring: {
    term: 'Ring Morphology (Closed Toroidal Loop)',
    category: 'Systems Biology',
    definition: 'A closed cyclic loop of cells where totalEdges >= n and maximum neighbor degree maxDeg <= 2, with no central hub.',
    biologicalReality: 'Analogous to circular multicellular coenobia and bacterial vortex rings, permitting continuous circular cytoplasmic resource streaming.',
    siliquariumMapping: 'Diagnosed when edges >= n with maxDeg <= 2 and triangleCount === 0. Ensures cyclic feedback with zero dead-end terminal nodes.',
    anchor: 'multicellular-body-topologies-and-morphometrics'
  },
  ring_morphology: {
    term: 'Ring Morphology (Closed Toroidal Loop)',
    category: 'Systems Biology',
    definition: 'A closed cyclic loop of cells where totalEdges >= n and maximum neighbor degree maxDeg <= 2, with no central hub.',
    biologicalReality: 'Analogous to circular multicellular coenobia and bacterial vortex rings, permitting continuous circular cytoplasmic resource streaming.',
    siliquariumMapping: 'Diagnosed when edges >= n with maxDeg <= 2 and triangleCount === 0. Ensures cyclic feedback with zero dead-end terminal nodes.',
    anchor: 'multicellular-body-topologies-and-morphometrics'
  },
  filamentous: {
    term: 'Filamentous Morphology (1D Linear Chain)',
    category: 'Systems Biology',
    definition: 'An unbranched 1D linear chain of cells where maximum degree maxDeg <= 2 and totalEdges === n - 1.',
    biologicalReality: 'Analogous to filamentous cyanobacteria (Oscillatoria, Anabaena) and actinomycete hyphae that creep linearly along basalt cracks.',
    siliquariumMapping: 'Diagnosed for components with maxDeg <= 2 without closed cycles. Represents early transitional multicellularity before 2D/3D sheets or rosettes evolve.',
    anchor: 'multicellular-body-topologies-and-morphometrics'
  },
  filamentous_morphology: {
    term: 'Filamentous Morphology (1D Linear Chain)',
    category: 'Systems Biology',
    definition: 'An unbranched 1D linear chain of cells where maximum degree maxDeg <= 2 and totalEdges === n - 1.',
    biologicalReality: 'Analogous to filamentous cyanobacteria (Oscillatoria, Anabaena) and actinomycete hyphae that creep linearly along basalt cracks.',
    siliquariumMapping: 'Diagnosed for components with maxDeg <= 2 without closed cycles. Represents early transitional multicellularity before 2D/3D sheets or rosettes evolve.',
    anchor: 'multicellular-body-topologies-and-morphometrics'
  },
  amorphous: {
    term: 'Amorphous Syncytial Mesh',
    category: 'Systems Biology',
    definition: 'An irregular, polymorphous multi-pore syncytial network that does not fit strict geometric symmetries.',
    biologicalReality: 'Analogous to plasmodial slime molds (Physarum polycephalum) that dynamically reshape cytoplasmic conduits based on localized nutrient flows.',
    siliquariumMapping: 'Default fallback category in classifyColonyTopology() for irregular reticulated multi-pore syncytia.',
    anchor: 'multicellular-body-topologies-and-morphometrics'
  },
  amorphous_morphology: {
    term: 'Amorphous Syncytial Mesh',
    category: 'Systems Biology',
    definition: 'An irregular, polymorphous multi-pore syncytial network that does not fit strict geometric symmetries.',
    biologicalReality: 'Analogous to plasmodial slime molds (Physarum polycephalum) that dynamically reshape cytoplasmic conduits based on localized nutrient flows.',
    siliquariumMapping: 'Default fallback category in classifyColonyTopology() for irregular reticulated multi-pore syncytia.',
    anchor: 'multicellular-body-topologies-and-morphometrics'
  }
};
