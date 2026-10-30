/**
 * 🐠 Siliquarium Paleontology Subsystem
 * NetworkMotif: Uri Alon Systems Biology Cognate Definitions.
 * Bridges digital hardware circuits to biological regulatory networks.
 */

export enum MotifType {
  BISTABLE_LATCH = 'BISTABLE_LATCH',
  RING_OSCILLATOR = 'RING_OSCILLATOR',
  COHERENT_FFL = 'COHERENT_FFL',
  INCOHERENT_FFL = 'INCOHERENT_FFL',
  NEGATIVE_AUTOREGULATION = 'NEGATIVE_AUTOREGULATION',
  HALF_ADDER = 'HALF_ADDER',
  INVERTER_NOT = 'INVERTER_NOT',
  ENDOSYMBIONT_EMERGENCE = 'ENDOSYMBIONT_EMERGENCE',
  SYNCYTIAL_MULTICELLULARITY = 'SYNCYTIAL_MULTICELLULARITY',
  PELAGIC_SPORULATION_EMERGENCE = 'PELAGIC_SPORULATION_EMERGENCE',
  TEMPORAL_DERIVATIVE_CHEMOTAXIS = 'TEMPORAL_DERIVATIVE_CHEMOTAXIS',
  PREDICTIVE_PAVLOVIAN = 'PREDICTIVE_PAVLOVIAN',
  ENTRAINED_PACEMAKER = 'ENTRAINED_PACEMAKER',
  STEINER_VASCULAR_NETWORK = 'STEINER_VASCULAR_NETWORK',
  CRYPTOBIOTIC_DORMANCY_CLAMP = 'CRYPTOBIOTIC_DORMANCY_CLAMP',
  LENSKI_CIT_BREAKTHROUGH = 'LENSKI_CIT_BREAKTHROUGH',
  MINERAL_CHELATION_DISCOVERY = 'MINERAL_CHELATION_DISCOVERY',
  BIOFILM_EPS_SHIELD = 'BIOFILM_EPS_SHIELD',
  SYNTROPHIC_CROSS_FEEDING = 'SYNTROPHIC_CROSS_FEEDING',
  VAMPIRIC_KLEPTOPLASTY = 'VAMPIRIC_KLEPTOPLASTY'
}

export interface IMotifDefinition {
  readonly type: MotifType;
  readonly name: string;
  readonly biologicalCognate: string;
  readonly naturalFunction: string;
  readonly citation: string;
  readonly signature: string;
}

export class NetworkMotifRegistry {
  private static readonly DEFINITIONS: ReadonlyMap<MotifType, IMotifDefinition> = new Map([
    [
      MotifType.BISTABLE_LATCH,
      {
        type: MotifType.BISTABLE_LATCH,
        name: 'Bistable Memory Latch (SR Flip-Flop)',
        biologicalCognate: 'Bistable Genetic Toggle Switch',
        naturalFunction: 'Cell Fate & Memory: lambda-phage lysis vs lysogeny decision (Gardner & Collins, 2000).',
        citation: 'Gardner, T. S., et al. (2000). Nature 403, 339-342.',
        signature: 'Hysteresis / 1-Bit Memory: Preserves food pulses across ticks.'
      }
    ],
    [
      MotifType.RING_OSCILLATOR,
      {
        type: MotifType.RING_OSCILLATOR,
        name: 'Odd-Inverter Ring Oscillator',
        biologicalCognate: 'The Repressilator / Circadian Clock',
        naturalFunction: 'Biological Rhythms: Autonomous limit cycle without external drive (Elowitz & Leibler, 2000).',
        citation: 'Elowitz, M. B., & Leibler, S. (2000). Nature 403, 335-338.',
        signature: 'Autonomous Limit Cycle: Stable continuous periodic oscillation.'
      }
    ],
    [
      MotifType.COHERENT_FFL,
      {
        type: MotifType.COHERENT_FFL,
        name: 'Coherent Feed-Forward Loop (C-FFL Type 1)',
        biologicalCognate: 'Sign-Sensitive Delay / Persistence Filter',
        naturalFunction: 'Noise Rejection: E. coli arabinose operon filtering spurious nutrient pulses.',
        citation: 'Mangan, S., & Alon, U. (2003). PNAS 100(21), 11980-11985.',
        signature: 'Persistence Filter: Fires only when input sustains > k ticks.'
      }
    ],
    [
      MotifType.INCOHERENT_FFL,
      {
        type: MotifType.INCOHERENT_FFL,
        name: 'Incoherent Feed-Forward Loop (I-FFL Type 1)',
        biologicalCognate: 'Fold-Change Pulse / Sensory Adaptation',
        naturalFunction: 'Sensory Adaptation: Bacterial chemotaxis response to step attractant increase.',
        citation: 'Alon, U. (2007). Nature Reviews Genetics 8(6), 450-461.',
        signature: 'Pulse Generator: Brief output burst upon step change, then adapts to zero.'
      }
    ],
    [
      MotifType.NEGATIVE_AUTOREGULATION,
      {
        type: MotifType.NEGATIVE_AUTOREGULATION,
        name: 'Negative Autoregulation Clamp',
        biologicalCognate: 'Homeostatic Clamping',
        naturalFunction: 'Homeostasis: Accelerates response time without overshoot in ribosomal proteins.',
        citation: 'Rosenfeld, N., et al. (2002). Science 296(5570), 1532-1534.',
        signature: 'Rapid Rise to Plateau: Reaches steady state 5x faster than open-loop.'
      }
    ],
    [
      MotifType.HALF_ADDER,
      {
        type: MotifType.HALF_ADDER,
        name: '1-Bit Binary Half-Adder',
        biologicalCognate: 'Combinatorial Parity Logic',
        naturalFunction: 'Signal Integration: Computes Sum (XOR) and Carry (AND) across parallel metabolic pathways.',
        citation: 'Alon, U. (2019). An Introduction to Systems Biology (2nd ed.). CRC Press.',
        signature: 'Digital Arithmetic: Simultaneous 1-bit sum and overflow carry.'
      }
    ]
  ]);

  private static readonly PROTO_COGNITIVE_DEFINITIONS: ReadonlyMap<MotifType, IMotifDefinition> = new Map([
    [
      MotifType.TEMPORAL_DERIVATIVE_CHEMOTAXIS,
      {
        type: MotifType.TEMPORAL_DERIVATIVE_CHEMOTAXIS,
        name: 'Temporal Derivative Chemotaxis Engine',
        biologicalCognate: 'Bacterial Temporal Gradient Chemotaxis (Purcell-Berg Run & Tumble)',
        naturalFunction: 'Fold-Change Gradient Comparison: Computes temporal derivative dS/dt via delayed methylation feedback to climb nutrient vectors without spatial eyes (Purcell 1977, Berg 2004).',
        citation: 'Purcell, E. M. (1977). Am. J. Phys. 45, 3-11. / Berg, H. C. (2004). E. coli in Motion. Springer.',
        signature: 'Temporal Derivative / Adaptive Fold-Change: Fires brief output burst on positive gradient step, resetting baseline.'
      }
    ],
    [
      MotifType.PREDICTIVE_PAVLOVIAN,
      {
        type: MotifType.PREDICTIVE_PAVLOVIAN,
        name: 'Anticipatory Pavlovian Regulator',
        biologicalCognate: 'Predictive Gene Regulatory Network (Pavlovian Conditioning)',
        naturalFunction: 'Anticipatory Regulation: Recognizes precursor environmental cue A that reliably precedes toxic event B, priming allosteric defenses before strike (Tagkopoulos & Tavazoie, 2008).',
        citation: 'Tagkopoulos, I., Liu, Y. C., & Tavazoie, S. (2008). Science 320(5881), 1313-1317.',
        signature: 'Precursor Anticipation Shield: Coherent feed-forward activation of protective inverter during precursor warning phase.'
      }
    ],
    [
      MotifType.ENTRAINED_PACEMAKER,
      {
        type: MotifType.ENTRAINED_PACEMAKER,
        name: 'Phase-Locked Entrained Pacemaker',
        biologicalCognate: 'Cyanobacterial Circadian Oscillator (KaiABC Clock)',
        naturalFunction: 'Circadian / Vent Entrainment: Phase-locks autonomous odd-inverter limit cycle to external hydrothermal pulse train, synchronizing peak catalytic expression (Johnson et al. 2008).',
        citation: 'Johnson, C. H., et al. (2008). Ann. Rev. Physiol. 70, 509-535. / Rust, M. J., et al. (2007). Science 318, 809-812.',
        signature: 'Phase-Locked Resonant Limit Cycle: Autonomous ring oscillator entrained to ambient periodic driving pulses.'
      }
    ],
    [
      MotifType.STEINER_VASCULAR_NETWORK,
      {
        type: MotifType.STEINER_VASCULAR_NETWORK,
        name: 'Steiner Vascular Transport Network',
        biologicalCognate: 'Physarum Polycephalum Adaptive Slime Mold Transport Network',
        naturalFunction: 'Spatial Network Optimization: Multi-pore syncytial syncytium adaptively reinforces high-flux conduits and prunes low-flux pathways according to Hagen-Poiseuille law (Tero & Nakagaki, 2010).',
        citation: 'Tero, A., Nakagaki, T., et al. (2010). Science 327(5964), 439-442.',
        signature: 'Adaptive Minimal Steiner Tree: Optimal low-dissipation cytoplasmic transport across hexagonal lattice chambers.'
      }
    ],
    [
      MotifType.CRYPTOBIOTIC_DORMANCY_CLAMP,
      {
        type: MotifType.CRYPTOBIOTIC_DORMANCY_CLAMP,
        name: 'Cryptobiotic Dormancy Clamp',
        biologicalCognate: 'Bacterial Toxin-Antitoxin Persister Switch (HipAB / Balaban)',
        naturalFunction: 'Bet-Hedging & Famine Quiescence: Bistable clamp drops cell into zero-burn metabolic hibernation when pulse frequencies fall below survival threshold (Balaban et al. 2004).',
        citation: 'Balaban, N. Q., et al. (2004). Science 305(5690), 1622-1625.',
        signature: 'Zero-Burn Cryptobiosis Gate: Bistable threshold shutoff protecting battery reserves during extended hydrothermal quiescence.'
      }
    ]
  ]);

  private static readonly MACRO_DEFINITIONS: ReadonlyMap<MotifType, IMotifDefinition> = new Map([
    [
      MotifType.INVERTER_NOT,
      {
        type: MotifType.INVERTER_NOT,
        name: 'Allosteric NOT Inverter',
        biologicalCognate: 'Competitive Transcriptional Repressor',
        naturalFunction: 'Signal Inversion & Toxin Shielding: Inhibits downstream catalytic cascade in the presence of poisonous effluents.',
        citation: 'Jacob, F., & Monod, J. (1961). J. Mol. Biol. 3(3), 318-356.',
        signature: 'Logic Inversion: Output high only when input is low.'
      }
    ],
    [
      MotifType.ENDOSYMBIONT_EMERGENCE,
      {
        type: MotifType.ENDOSYMBIONT_EMERGENCE,
        name: 'Endosymbiotic Organelle Cassette',
        biologicalCognate: 'Serial Endosymbiotic Theory (SET) / Eukaryogenesis',
        naturalFunction: 'Metabolic Compartmentalization: Assimilation of foreign catalytic genome into a permanent organelle cassette (Lynn Margulis, 1967).',
        citation: 'Sagan (Margulis), L. (1967). J. Theor. Biol. 14(3), 225-274.',
        signature: 'Dual-Cassette Autonomous Catalysis: Multi-operon energetic yield enhancement (+15T).'
      }
    ],
    [
      MotifType.SYNCYTIAL_MULTICELLULARITY,
      {
        type: MotifType.SYNCYTIAL_MULTICELLULARITY,
        name: 'Syncytial Macro-Organism Colony',
        biologicalCognate: 'Syncytial Multicellularity & Cytoplasmic Streaming',
        naturalFunction: 'Colonial Homeostasis: Multi-pore cytoplasmic resource pooling and collective synchronous reproduction.',
        citation: 'Margulis, L. (1981). Symbiosis in Cell Evolution. W. H. Freeman.',
        signature: 'Connected Macro-Pore Co-Op: Shared cytoplasmic energy and matter across hexagonal lattice.'
      }
    ],
    [
      MotifType.PELAGIC_SPORULATION_EMERGENCE,
      {
        type: MotifType.PELAGIC_SPORULATION_EMERGENCE,
        name: 'Pelagic Sporulation & Dispersal Engine',
        biologicalCognate: 'Bacterial Endospore & Pelagic Broadcast Spawning (FtsZ Septum)',
        naturalFunction: 'Ejection of dormant buoyant spore capsules into the ocean column to escape spatial crowding (Bonner 1965, Dawkins 1982).',
        citation: 'Bonner, J. T. (1965). Size and Cycle: An Essay on the Structure of Biology. Princeton Univ. Press.',
        signature: 'FtsZ Septum Cleavage + Multigate Regulatory Logic: Unlocks broadcast colonization across the hydrothermal water column.'
      }
    ],
    [
      MotifType.LENSKI_CIT_BREAKTHROUGH,
      {
        type: MotifType.LENSKI_CIT_BREAKTHROUGH,
        name: 'Lenski Cit+ Metabolic Breakthrough',
        biologicalCognate: 'E. coli LTEE Aerobic Citrate Utilization (Cit+)',
        naturalFunction: 'Promoter-capture and expression of porin unlocking refractory benthic Substrate C (pyrophosphate/methane), yielding +3 tokens per cycle.',
        citation: 'Blount, Z. D., Borland, C. Z., & Lenski, R. E. (2008). PNAS 105(23), 7899-7906.',
        signature: 'PORIN_STREAM_C Expression: Digests ambient refractory Substrate C with +3 catalytic yield.'
      }
    ],
    [
      MotifType.MINERAL_CHELATION_DISCOVERY,
      {
        type: MotifType.MINERAL_CHELATION_DISCOVERY,
        name: 'Siderophore Mineral Solubilization (Basalt Chelation)',
        biologicalCognate: 'Bacterial Siderophore Secretion & Mineral Lithotrophy',
        naturalFunction: 'Anabolic secretion of high-affinity iron/mineral chelators, solubilizing basalt rock into bioavailable matter tokens.',
        citation: 'Neilands, J. B. (1995). J. Biol. Chem. 270(45), 26723-26726.',
        signature: 'SECRETION_CHELATOR: Solubilizes adjacent basalt obstacles into +1 cellular matter.'
      }
    ],
    [
      MotifType.BIOFILM_EPS_SHIELD,
      {
        type: MotifType.BIOFILM_EPS_SHIELD,
        name: 'Viscoelastic Biofilm Matrix (Glycocalyx EPS)',
        biologicalCognate: 'Bacterial Extracellular Polymeric Substances (EPS) & Biofilm Matrix',
        naturalFunction: 'Secretion of hydrated polysaccharide/protein mesh, protecting cell membrane against shear flow and acid shock.',
        citation: 'Costerton, J. W., et al. (1999). Science 284(5418), 1318-1322.',
        signature: 'SECRETION_EPS: Accumulates viscoelastic protective slime dampening physical flux.'
      }
    ],
    [
      MotifType.SYNTROPHIC_CROSS_FEEDING,
      {
        type: MotifType.SYNTROPHIC_CROSS_FEEDING,
        name: 'Paracrine Syntrophy & Direct Cross-Feeding (DIET)',
        biologicalCognate: 'Direct Interspecies Electron Transfer & Microbial Syntrophy',
        naturalFunction: 'Obligate metabolic cooperation: Energetically prosperous lineages transfer battery tokens to neighboring clades.',
        citation: 'Lovley, D. R. (2017). Env. Microbiol. Rep. 9(5), 450-466. / West, S. A., et al. (2007). Nat. Rev. Microbiol. 5, 971-982.',
        signature: 'Conserved Paracrine Exchange: Inter-clade direct transfer of 2 battery tokens.'
      }
    ],
    [
      MotifType.VAMPIRIC_KLEPTOPLASTY,
      {
        type: MotifType.VAMPIRIC_KLEPTOPLASTY,
        name: 'Vampiric Kleptoplasty (Predatory Organelle Theft)',
        biologicalCognate: 'Protist Kleptoplastidy & Functional Organelle Robbery',
        naturalFunction: 'Apex contact predation where killer steals and integrates functional organelle cassettes from lysed prey.',
        citation: 'Schnepf, E., & Deichgräber, G. (1984). Protoplasma 123(2), 143-150.',
        signature: 'Horizontally Acquired Organelle: Predator permanently assimilates prey metabolic cassette.'
      }
    ]
  ]);

  public static getDefinition(type: MotifType): IMotifDefinition {
    const def = NetworkMotifRegistry.DEFINITIONS.get(type) ??
                NetworkMotifRegistry.MACRO_DEFINITIONS.get(type) ??
                NetworkMotifRegistry.PROTO_COGNITIVE_DEFINITIONS.get(type);
    if (!def) {
      throw new Error(`Unknown network motif type: ${type}`);
    }
    return def;
  }

  public static getAllDefinitions(): readonly IMotifDefinition[] {
    return Array.from(NetworkMotifRegistry.DEFINITIONS.values());
  }

  public static getProtoCognitiveDefinitions(): readonly IMotifDefinition[] {
    return Array.from(NetworkMotifRegistry.PROTO_COGNITIVE_DEFINITIONS.values());
  }
}
