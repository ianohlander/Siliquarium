/**
 * 🐠 Siliquarium Physics Subsystem
 * PhysicalConstants: Single Source of Truth (SSOT) for Biophysical Constants.
 */

export const PHYSICAL_CONSTANTS = Object.freeze({
  // Battery & Energy
  BATTERY_DEFAULT_CAPACITY: 100,
  BATTERY_DIVISION_THRESHOLD: 100,
  BATTERY_LANDAUER_TOGGLE_COST: 1,
  BATTERY_BASAL_LEAK_PERIOD_TICKS: 10,
  BATTERY_BASAL_LEAK_AMOUNT: 1,

  // Matter & Mass
  MATTER_DEFAULT_RESERVE: 20,
  MATTER_DIVISION_THRESHOLD: 20,
  MATTER_GATE_SYNTHESIS_COST: 2,

  // Catalysis & Vent Chemistry
  CATALYSIS_YIELD_AND_REACTION: 2,
  CATALYSIS_YIELD_STREAM_C: 3, // +3 tokens for refractory Substrate C (high-enthalpy pyrophosphate/methane cleavage)
  TOXIN_CORROSION_PENALTY: 5,
  SIDEROPHORE_SYNTHESIS_COST: 1, // -1 Landauer token to synthesize and secrete siderophore
  SIDEROPHORE_SOLUBILIZE_MATTER: 1, // +1 matter token released from basalt upon chelation
  EPS_SYNTHESIS_COST: 1, // -1 Landauer token to secrete EPS matrix
  EPS_PROTECTION_THRESHOLD: 1.0, // Minimum EPS concentration in pore to grant structural shear immunity

  // Genetics & Mutation (Susumu Ohno 1970 Gene Duplication & Unrestricted Genome Growth)
  GENOME_LENGTH_BITS: 60,
  GENOME_MIN_BITS: 36, // 6 codons: minimal viable genome
  GENOME_DEFAULT_BITS: 60, // 10 codons
  GENOME_MAX_BITS: 3072, // Software memory safety ceiling (512 codons); genomes grow without artificial restrictions
  BITS_PER_CODON: 6,
  CODON_COUNT: 10,
  CODON_COUNT_MIN: 6,
  CODON_COUNT_DEFAULT: 10,
  CODON_COUNT_MAX: 512,
  MUTATION_RATE_DEFAULT: 0.001,
  DUPLICATION_RATE_DEFAULT: 0.005, // 0.5% per reproduction (Susumu Ohno gene duplication)
  DELETION_RATE_DEFAULT: 0.005, // 0.5% per reproduction (Landauer thrift streamlining)

  // Spatial Matrix & Netlist Capacity
  HEX_CANVAS_MAX_GATES: 128,
  CARCASS_DECAY_TICKS: 50,
  GRAVITY_VECTOR: Object.freeze([0, 0, -1] as const),
  CONVECTIVE_PLUME_VECTOR: Object.freeze([0, 0, +1] as const)
});
