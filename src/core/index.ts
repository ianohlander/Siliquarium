/**
 * 🐠 Siliquarium Core Module Export
 * Phase 1 Kernel Components: PRNG, Codons, Spatial Grid, Domain Entities, Physics & Thermodynamics.
 */

export const SILIQUARIUM_VERSION = '0.1.0';

// PRNG Subsystem
export * from './prng/SeedablePrng.js';

// Codon Subsystem
export * from './codons/CodonTable.js';
export * from './codons/CodonTranslator.js';

// Spatial Subsystem
export * from './spatial/HexCoord3D.js';
export * from './spatial/HexGrid3D.js';

// Domain Subsystem
export * from './domain/PoreBattery.js';
export * from './domain/GenomeSafe.js';
export * from './domain/PoreWorkshop.js';
export * from './domain/PoreCell.js';
export * from './domain/Pore.js';

// Physics Subsystem
export * from './physics/PhysicalConstants.js';
export * from './physics/VentPhysics.js';
export * from './physics/ThermodynamicLedger.js';
