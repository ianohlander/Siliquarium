/**
 * 🌊 Siliquarium Audio Subsystem
 * AudioSynthesizer: Procedural WebAudio Hydrophone Drone & Biophysical Interaction Sonification.
 * Generates abyssal ambient convective audio and acoustic feedback for cell selection and evolutionary milestones.
 */

export class AudioSynthesizer {
  private static instance: AudioSynthesizer | null = null;
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isAmbientRunning: boolean = false;
  private ambientGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  public static getInstance(): AudioSynthesizer {
    if (!AudioSynthesizer.instance) {
      AudioSynthesizer.instance = new AudioSynthesizer();
    }
    return AudioSynthesizer.instance;
  }

  private constructor() {
    try {
      const saved = localStorage.getItem('siliquarium_audio_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
    } catch {
      this.isMuted = false;
    }
  }

  public init(): void {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.startAmbientHydrophone();
    } catch (e) {
      console.warn('AudioContext unavailable:', e);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('siliquarium_audio_muted', this.isMuted.toString());
    } catch {
      // Ignore storage errors
    }

    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : 0.7;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Continuous Abyssal Hydrophone Ambient Drone
   * Procedural filtered pink noise & low resonant sub-sine simulating 2,450m deep hydrothermal convection.
   */
  private startAmbientHydrophone(): void {
    if (!this.ctx || !this.masterGain || this.isAmbientRunning) return;
    try {
      if (this.ctx.state === 'suspended') {
        const resumeOnInteract = () => {
          this.ctx?.resume();
          window.removeEventListener('click', resumeOnInteract);
          window.removeEventListener('keydown', resumeOnInteract);
        };
        window.addEventListener('click', resumeOnInteract, { once: true });
        window.addEventListener('keydown', resumeOnInteract, { once: true });
      }

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      // Low frequency sub-rumble oscillator (55 Hz base)
      const subOsc = this.ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(55, this.ctx.currentTime);

      const subLfo = this.ctx.createOscillator();
      subLfo.type = 'sine';
      subLfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);
      const subLfoGain = this.ctx.createGain();
      subLfoGain.gain.setValueAtTime(6.0, this.ctx.currentTime);
      subLfo.connect(subLfoGain);
      subLfoGain.connect(subOsc.frequency);

      // Filtered buffer noise generator for convective fluid rush
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
        b6 = white * 0.115926;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(140, this.ctx.currentTime);
      lowpass.Q.setValueAtTime(2.0, this.ctx.currentTime);

      whiteNoise.connect(lowpass);
      lowpass.connect(this.ambientGain);
      subOsc.connect(this.ambientGain);

      this.ambientGain.connect(this.masterGain);

      subOsc.start();
      subLfo.start();
      whiteNoise.start();
      this.isAmbientRunning = true;
    } catch (e) {
      console.warn('Ambient hydrophone start skipped:', e);
    }
  }

  /**
   * Resonant glass chime when clicking to select a living silicoid.
   * Pitch is tuned to the specimen's battery charge ratio (0.0 to 1.0).
   */
  public playCellSelect(batteryRatio: number = 0.5): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const t = this.ctx.currentTime;
      const baseFreq = 220 + Math.max(0, Math.min(1.0, batteryRatio)) * 440; // 220Hz to 660Hz

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.02, t + 0.18);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.5);
    } catch {
      // Audio errors non-fatal
    }
  }

  /**
   * Safari Co-Pilot specimen transition sound (Soft ascending dual-tone).
   */
  public playSafariTransition(): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const t = this.ctx.currentTime;
      const notes = [440, 554.37]; // A4 -> C#5 (Bright major third)

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const start = t + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.12, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(start);
        osc.stop(start + 0.4);
      });
    } catch {
      // Non-fatal
    }
  }

  /**
   * Evolutionary discovery milestone chord (Ascending C-E-G arpeggio).
   */
  public playMilestoneDiscovery(): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const t = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const start = t + idx * 0.07;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.15, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.6);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(start);
        osc.stop(start + 0.65);
      });
    } catch {
      // Non-fatal
    }
  }

  /**
   * God-Mode geothermal perturbation tremor shockwave rumble.
   */
  public playGodModeShock(): void {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.8);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.9);
    } catch {
      // Non-fatal
    }
  }
}
