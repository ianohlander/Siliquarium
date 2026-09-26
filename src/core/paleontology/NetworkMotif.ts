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
  HALF_ADDER = 'HALF_ADDER'
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

  public static getDefinition(type: MotifType): IMotifDefinition {
    const def = NetworkMotifRegistry.DEFINITIONS.get(type);
    if (!def) {
      throw new Error(`Unknown network motif type: ${type}`);
    }
    return def;
  }

  public static getAllDefinitions(): readonly IMotifDefinition[] {
    return Array.from(NetworkMotifRegistry.DEFINITIONS.values());
  }
}
