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
  TOXIN_CORROSION_PENALTY: 5,

  // Genetics & Mutation
  GENOME_LENGTH_BITS: 60,
  BITS_PER_CODON: 6,
  CODON_COUNT: 10,
  MUTATION_RATE_DEFAULT: 0.001,

  // Spatial Matrix
  HEX_CANVAS_MAX_GATES: 16,
  CARCASS_DECAY_TICKS: 50,
  GRAVITY_VECTOR: Object.freeze([0, 0, -1] as const),
  CONVECTIVE_PLUME_VECTOR: Object.freeze([0, 0, +1] as const)
});
