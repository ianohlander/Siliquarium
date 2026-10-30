/**
 * 🐠 Siliquarium UI Subsystem
 * InteractiveControls: Bottom Transport and Camera View Controller.
 * Wires play/pause, step forward, speed multipliers, and camera angles.
 */

import { SimulationLoop } from '../engine/SimulationLoop.js';
import { OrbitCamera } from '../visualizers/OrbitCamera.js';
import { SeafloorRenderer3D } from '../visualizers/SeafloorRenderer3D.js';

export class InteractiveControls {
  private readonly loop: SimulationLoop;
  private readonly camera: OrbitCamera;
  private readonly renderer: SeafloorRenderer3D;
  private readonly onFocusRequested?: () => void;
  private readonly onSpinToggled?: (active: boolean) => void;

  private playBtn: HTMLElement | null = null;
  private stepBtn: HTMLElement | null = null;
  private speedPills: NodeListOf<HTMLElement> | null = null;
  private layerSporesBtn: HTMLElement | null = null;
  private layerWaterBtn: HTMLElement | null = null;
  private layerBedrockBtn: HTMLElement | null = null;
  private calmMotionBtn: HTMLElement | null = null;
  private conduitsBtn: HTMLElement | null = null;
  private aurasBtn: HTMLElement | null = null;
  private trophicBtn: HTMLElement | null = null;
  private spinBtn: HTMLElement | null = null;
  private spinSpeedBtn: HTMLElement | null = null;
  private fullscreenBtn: HTMLElement | null = null;
  private hudFullscreenBtn: HTMLElement | null = null;
  private hudFullscreenStatus: HTMLElement | null = null;
  private exitFullscreenBtn: HTMLElement | null = null;

  private isFullscreen: boolean = false;
  private spinSpeedIndex: number = 1; // Default to 1.0x (0.15 rad/s)
  private readonly spinSpeeds: number[] = [0.08, 0.15, 0.30, 0.60, -0.15, -0.30];
  private readonly spinSpeedLabels: string[] = ['0.5× ↻', '1.0× ↻', '2.0× ↻', '4.0× ↻', '1.0× ↺', '2.0× ↺'];
  private remoteDispatcher: ((action: string, payload?: unknown) => boolean) | null = null;

  constructor(
    loop: SimulationLoop,
    camera: OrbitCamera,
    renderer: SeafloorRenderer3D,
    onFocusRequested?: () => void,
    onSpinToggled?: (active: boolean) => void
  ) {
    this.loop = loop;
    this.camera = camera;
    this.renderer = renderer;
    this.onFocusRequested = onFocusRequested;
    this.onSpinToggled = onSpinToggled;
    this.initElements();
  }

  private initElements(): void {
    this.playBtn = document.getElementById('btn-play-pause');
    this.stepBtn = document.getElementById('btn-step-forward');
    this.speedPills = document.querySelectorAll('.speed-pill');
    this.layerSporesBtn = document.getElementById('layer-spores');
    this.layerWaterBtn = document.getElementById('layer-water');
    this.layerBedrockBtn = document.getElementById('layer-bedrock');
    this.calmMotionBtn = document.getElementById('btn-toggle-calm-motion');
    this.conduitsBtn = document.getElementById('btn-toggle-conduits');
    this.aurasBtn = document.getElementById('btn-toggle-auras');
    this.trophicBtn = document.getElementById('btn-toggle-trophic');
    this.spinBtn = document.getElementById('btn-toggle-spin');
    this.spinSpeedBtn = document.getElementById('btn-spin-speed');
    this.fullscreenBtn = document.getElementById('btn-toggle-fullscreen');
    this.hudFullscreenBtn = document.getElementById('hud-fullscreen-btn');
    this.hudFullscreenStatus = document.getElementById('hud-fullscreen-status');
    this.exitFullscreenBtn = document.getElementById('btn-exit-fullscreen');

    this.bindEvents();
    this.bindLayerControls();
    this.bindFilterControls();
    this.bindSpinControls();
    this.bindFullscreenControls();
    this.bindKeyboardShortcuts();
    this.syncLayerUI();
    this.syncCalmMotionUI();
    this.syncFilterUI();
    this.syncSpinUI();
    this.syncFullscreenUI();
  }

  private bindEvents(): void {
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => {
        if (this.remoteDispatcher && this.remoteDispatcher('toggle')) return;
        this.loop.toggle();
      });
    }

    if (this.stepBtn) {
      this.stepBtn.addEventListener('click', () => {
        if (this.remoteDispatcher && this.remoteDispatcher('step', { count: 1 })) return;
        if (this.loop.isRunning()) this.loop.pause();
        this.loop.step(1);
      });
    }

    this.loop.onStateChange((running) => {
      if (this.playBtn) {
        this.playBtn.innerHTML = running ? '⏸ Pause' : '▶ Play';
        this.playBtn.className = running ? 'btn-transport btn-pause' : 'btn-transport btn-play';
      }
    });

    if (this.speedPills) {
      this.speedPills.forEach(pill => {
        pill.addEventListener('click', () => {
          const speed = parseFloat(pill.getAttribute('data-speed') ?? '1');
          if (this.remoteDispatcher && this.remoteDispatcher('setSpeed', { speed })) {
            this.speedPills?.forEach(p => p.classList.remove('speed-active'));
            pill.classList.add('speed-active');
            return;
          }
          this.loop.setSpeed(speed);
          this.speedPills?.forEach(p => p.classList.remove('speed-active'));
          pill.classList.add('speed-active');
        });
      });
    }

    if (this.calmMotionBtn) {
      this.calmMotionBtn.addEventListener('click', () => {
        this.renderer.calmMotionEnabled = !this.renderer.calmMotionEnabled;
        this.syncCalmMotionUI();
      });
    }

    this.bindCameraPresets();
  }

  private bindCameraPresets(): void {
    const btnCaldera = document.getElementById('cam-caldera');
    const btnTopDown = document.getElementById('cam-topdown');
    const btnReset = document.getElementById('cam-reset');
    const btnNavReset = document.getElementById('cam-btn-reset');

    if (btnCaldera) {
      btnCaldera.addEventListener('click', () => {
        this.camera.azimuth = 0.8;
        this.camera.elevation = 0.6;
        this.camera.distance = 22.0;
        this.camera.target = { x: 0, y: 0, z: 0 };
      });
    }

    if (btnTopDown) {
      btnTopDown.addEventListener('click', () => {
        this.camera.azimuth = 0.0;
        this.camera.elevation = Math.PI / 2 - 0.08;
        this.camera.distance = 26.0;
        this.camera.target = { x: 0, y: 0, z: 0 };
      });
    }

    const resetCam = () => {
      this.camera.azimuth = 0.8;
      this.camera.elevation = 0.6;
      this.camera.distance = 24.0;
      this.camera.target = { x: 0, y: 0, z: 0 };
    };
    if (btnReset) btnReset.addEventListener('click', resetCam);
    if (btnNavReset) btnNavReset.addEventListener('click', resetCam);

    const btnZoomIn = document.getElementById('cam-btn-zoom-in');
    if (btnZoomIn) {
      btnZoomIn.addEventListener('click', () => {
        this.camera.distance = Math.max(4.0, this.camera.distance - 3.0);
      });
    }

    const btnZoomOut = document.getElementById('cam-btn-zoom-out');
    if (btnZoomOut) {
      btnZoomOut.addEventListener('click', () => {
        this.camera.distance = Math.min(65.0, this.camera.distance + 3.0);
      });
    }

    const btnFocus = document.getElementById('cam-focus');
    if (btnFocus) {
      btnFocus.addEventListener('click', () => {
        this.onFocusRequested?.();
      });
    }
  }

  private bindLayerControls(): void {
    if (this.layerSporesBtn) {
      this.layerSporesBtn.addEventListener('click', () => {
        this.renderer.showSpores = !this.renderer.showSpores;
        this.syncLayerUI();
      });
    }

    if (this.layerWaterBtn) {
      this.layerWaterBtn.addEventListener('click', () => {
        this.renderer.showWaterColumn = !this.renderer.showWaterColumn;
        this.syncLayerUI();
      });
    }

    if (this.layerBedrockBtn) {
      this.layerBedrockBtn.addEventListener('click', () => {
        this.renderer.showBenthic = !this.renderer.showBenthic;
        this.syncLayerUI();
      });
    }
  }

  private bindKeyboardShortcuts(): void {
    window.addEventListener('keydown', (e) => {
      // Don't intercept if user is typing into an input/textarea
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (e.key === 's' || e.key === 'S') {
        this.renderer.showSpores = !this.renderer.showSpores;
        this.syncLayerUI();
      } else if (e.key === 'w' || e.key === 'W') {
        this.renderer.showWaterColumn = !this.renderer.showWaterColumn;
        this.syncLayerUI();
      } else if (e.key === 'b' || e.key === 'B') {
        this.renderer.showBenthic = !this.renderer.showBenthic;
        this.syncLayerUI();
      } else if (e.key === 'f' || e.key === 'F') {
        this.onFocusRequested?.();
      } else if (e.key === 'r' || e.key === 'R') {
        if (e.shiftKey) {
          this.cycleSpinSpeed();
        } else {
          this.toggleSpin();
        }
      } else if (e.key === 'z' || e.key === 'Z') {
        this.toggleFullscreen();
      } else if (e.key === 'k' || e.key === 'K' || e.key === '?') {
        const legendBtn = document.getElementById('legend-toggle-btn');
        legendBtn?.click();
      } else if (e.key === 'Escape') {
        if (this.isCurrentlyFullscreen()) {
          e.preventDefault();
          this.setFullscreen(false);
        }
      } else if (e.key === ' ') {
        e.preventDefault();
        if (this.remoteDispatcher && this.remoteDispatcher('toggle')) return;
        this.loop.toggle();
      } else if (e.key === '.') {
        if (this.remoteDispatcher && this.remoteDispatcher('step', { count: 1 })) return;
        if (this.loop.isRunning()) this.loop.pause();
        this.loop.step(1);
      }
    });
  }

  public syncLayerUI(): void {
    if (this.layerSporesBtn) {
      this.layerSporesBtn.classList.toggle('layer-active', this.renderer.showSpores);
    }
    if (this.layerWaterBtn) {
      this.layerWaterBtn.classList.toggle('layer-active', this.renderer.showWaterColumn);
    }
    if (this.layerBedrockBtn) {
      this.layerBedrockBtn.classList.toggle('layer-active', this.renderer.showBenthic);
    }

    // Sync Lab drawer checkboxes if they exist
    const chkSpores = document.getElementById('chk-spores') as HTMLInputElement | null;
    if (chkSpores) chkSpores.checked = this.renderer.showSpores;
    const chkWater = document.getElementById('chk-water') as HTMLInputElement | null;
    if (chkWater) chkWater.checked = this.renderer.showWaterColumn;
    const chkBedrock = document.getElementById('chk-bedrock') as HTMLInputElement | null;
    if (chkBedrock) chkBedrock.checked = this.renderer.showBenthic;
    const chkZoom = document.getElementById('chk-zoom-transparency') as HTMLInputElement | null;
    if (chkZoom) chkZoom.checked = this.renderer.zoomTransparencyEnabled;
  }

  public syncCalmMotionUI(): void {
    if (this.calmMotionBtn) {
      if (this.renderer.calmMotionEnabled) {
        this.calmMotionBtn.innerHTML = '🌿 Motion: Calm';
        this.calmMotionBtn.style.borderColor = '#10b981';
        this.calmMotionBtn.style.color = '#34d399';
      } else {
        this.calmMotionBtn.innerHTML = '⚡ Motion: Normal';
        this.calmMotionBtn.style.borderColor = '#334155';
        this.calmMotionBtn.style.color = '#fff';
      }
    }
    const chkCalm = document.getElementById('chk-calm-motion') as HTMLInputElement | null;
    if (chkCalm) chkCalm.checked = this.renderer.calmMotionEnabled;
  }

  private bindFilterControls(): void {
    if (this.conduitsBtn) {
      this.conduitsBtn.addEventListener('click', () => {
        if (this.renderer.filterSyncytium === 'all') {
          this.renderer.filterSyncytium = 'selected';
        } else if (this.renderer.filterSyncytium === 'selected') {
          this.renderer.filterSyncytium = 'off';
        } else {
          this.renderer.filterSyncytium = 'all';
        }
        this.syncFilterUI();
      });
    }

    if (this.aurasBtn) {
      this.aurasBtn.addEventListener('click', () => {
        this.renderer.filterShowAuras = !this.renderer.filterShowAuras;
        this.syncFilterUI();
      });
    }

    if (this.trophicBtn) {
      this.trophicBtn.addEventListener('click', () => {
        this.renderer.filterShowTrophicRays = !this.renderer.filterShowTrophicRays;
        this.syncFilterUI();
      });
    }
  }

  public syncFilterUI(): void {
    if (this.conduitsBtn) {
      if (this.renderer.filterSyncytium === 'all') {
        this.conduitsBtn.innerHTML = '🟣 Lines: All';
        this.conduitsBtn.style.borderColor = '#8b5cf6';
        this.conduitsBtn.style.color = '#c084fc';
      } else if (this.renderer.filterSyncytium === 'selected') {
        this.conduitsBtn.innerHTML = '🎯 Lines: Selected';
        this.conduitsBtn.style.borderColor = '#00e5ff';
        this.conduitsBtn.style.color = '#38bdf8';
      } else {
        this.conduitsBtn.innerHTML = '⚪ Lines: OFF';
        this.conduitsBtn.style.borderColor = '#334155';
        this.conduitsBtn.style.color = '#64748b';
      }
    }

    if (this.aurasBtn) {
      if (this.renderer.filterShowAuras) {
        this.aurasBtn.innerHTML = '✨ Auras: ON';
        this.aurasBtn.style.borderColor = '#10b981';
        this.aurasBtn.style.color = '#34d399';
      } else {
        this.aurasBtn.innerHTML = '⚪ Auras: OFF';
        this.aurasBtn.style.borderColor = '#334155';
        this.aurasBtn.style.color = '#64748b';
      }
    }

    if (this.trophicBtn) {
      if (this.renderer.filterShowTrophicRays) {
        this.trophicBtn.innerHTML = '⚡ Rays: ON';
        this.trophicBtn.style.borderColor = '#f43f5e';
        this.trophicBtn.style.color = '#fb7185';
      } else {
        this.trophicBtn.innerHTML = '⚪ Rays: OFF';
        this.trophicBtn.style.borderColor = '#334155';
        this.trophicBtn.style.color = '#64748b';
      }
    }

    const chkConduits = document.getElementById('chk-filter-conduits') as HTMLInputElement | null;
    if (chkConduits) chkConduits.checked = this.renderer.filterSyncytium !== 'off';
    const chkAuras = document.getElementById('chk-filter-auras') as HTMLInputElement | null;
    if (chkAuras) chkAuras.checked = this.renderer.filterShowAuras;
    const chkTrophic = document.getElementById('chk-filter-trophic') as HTMLInputElement | null;
    if (chkTrophic) chkTrophic.checked = this.renderer.filterShowTrophicRays;
  }

  private bindSpinControls(): void {
    if (this.spinBtn) {
      this.spinBtn.addEventListener('click', () => {
        this.toggleSpin();
      });
    }

    if (this.spinSpeedBtn) {
      this.spinSpeedBtn.addEventListener('click', () => {
        this.cycleSpinSpeed();
      });
    }

    const drawerSpinBtn = document.getElementById('drawer-btn-toggle-spin');
    if (drawerSpinBtn) {
      drawerSpinBtn.addEventListener('click', () => {
        this.toggleSpin();
      });
    }

    const camNavSpinBtn = document.getElementById('cam-btn-spin');
    if (camNavSpinBtn) {
      camNavSpinBtn.addEventListener('click', () => {
        this.toggleSpin();
      });
    }
  }

  public toggleSpin(): boolean {
    const active = this.camera.toggleAutoSpin();
    this.syncSpinUI();
    this.onSpinToggled?.(active);
    return active;
  }

  public cycleSpinSpeed(): void {
    this.spinSpeedIndex = (this.spinSpeedIndex + 1) % this.spinSpeeds.length;
    const speed = this.spinSpeeds[this.spinSpeedIndex];
    this.camera.setAutoSpinSpeed(speed);
    if (!this.camera.autoSpin) {
      this.camera.autoSpin = true;
    }
    this.syncSpinUI();
  }

  public syncSpinUI(): void {
    if (this.spinBtn) {
      if (this.camera.autoSpin) {
        this.spinBtn.innerHTML = '🔄 Spin: ON';
        this.spinBtn.classList.add('btn-spin-active');
      } else {
        this.spinBtn.innerHTML = '🔄 Spin: OFF';
        this.spinBtn.classList.remove('btn-spin-active');
      }
    }

    const camNavSpinBtn = document.getElementById('cam-btn-spin');
    if (camNavSpinBtn) {
      camNavSpinBtn.style.color = this.camera.autoSpin ? '#38bdf8' : '#94a3b8';
      camNavSpinBtn.style.borderColor = this.camera.autoSpin ? '#38bdf8' : 'rgba(56, 189, 248, 0.2)';
    }

    if (this.spinSpeedBtn) {
      this.spinSpeedBtn.textContent = this.spinSpeedLabels[this.spinSpeedIndex];
      if (this.camera.autoSpin) {
        this.spinSpeedBtn.style.color = '#00e5ff';
        this.spinSpeedBtn.style.borderColor = '#00e5ff';
      } else {
        this.spinSpeedBtn.style.color = 'var(--text-muted)';
        this.spinSpeedBtn.style.borderColor = '#334155';
      }
    }

    const drawerSpinBtn = document.getElementById('drawer-btn-toggle-spin');
    if (drawerSpinBtn) {
      if (this.camera.autoSpin) {
        drawerSpinBtn.innerHTML = `🔄 Spin: ON (${this.spinSpeedLabels[this.spinSpeedIndex]})`;
        drawerSpinBtn.classList.add('btn-spin-active');
      } else {
        drawerSpinBtn.innerHTML = '🔄 Toggle Spin (R)';
        drawerSpinBtn.classList.remove('btn-spin-active');
      }
    }
  }

  private bindFullscreenControls(): void {
    if (this.fullscreenBtn) {
      this.fullscreenBtn.addEventListener('click', () => {
        this.toggleFullscreen();
      });
    }

    if (this.hudFullscreenBtn) {
      this.hudFullscreenBtn.addEventListener('click', () => {
        this.toggleFullscreen();
      });
    }

    const drawerFsBtn = document.getElementById('drawer-btn-fullscreen');
    if (drawerFsBtn) {
      drawerFsBtn.addEventListener('click', () => {
        this.toggleFullscreen();
      });
    }

    if (this.exitFullscreenBtn) {
      this.exitFullscreenBtn.addEventListener('click', () => {
        this.setFullscreen(false);
      });
    }

    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement && this.isFullscreen) {
        this.setFullscreen(false);
      }
    });
  }

  public isCurrentlyFullscreen(): boolean {
    return this.isFullscreen || document.body.classList.contains('fullscreen-mode');
  }

  public toggleFullscreen(): void {
    this.setFullscreen(!this.isCurrentlyFullscreen());
  }

  public setFullscreen(enabled: boolean): void {
    this.isFullscreen = enabled;
    if (enabled) {
      document.body.classList.add('fullscreen-mode');
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      document.body.classList.remove('fullscreen-mode');
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
    this.syncFullscreenUI();
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 60);
  }

  public exitFullscreen(): void {
    if (this.isCurrentlyFullscreen()) {
      this.setFullscreen(false);
    }
  }

  public syncFullscreenUI(): void {
    const fs = this.isCurrentlyFullscreen();
    if (this.fullscreenBtn) {
      if (fs) {
        this.fullscreenBtn.innerHTML = '✕ Normal View';
        this.fullscreenBtn.classList.add('btn-spin-active');
      } else {
        this.fullscreenBtn.innerHTML = '⛶ Fullscreen';
        this.fullscreenBtn.classList.remove('btn-spin-active');
      }
    }

    if (this.hudFullscreenStatus) {
      this.hudFullscreenStatus.textContent = fs ? 'Clean View' : 'Normal';
      this.hudFullscreenStatus.style.color = fs ? '#00e5ff' : '#38bdf8';
    }

    const drawerFsBtn = document.getElementById('drawer-btn-fullscreen');
    if (drawerFsBtn) {
      drawerFsBtn.innerHTML = fs ? '✕ Exit Fullscreen' : '⛶ Fullscreen View';
    }
  }

  public setPlaying(running: boolean): void {
    if (running) {
      this.loop.start();
    } else {
      this.loop.pause();
    }
  }

  public setRemoteDispatcher(dispatcher: ((action: string, payload?: unknown) => boolean) | null): void {
    this.remoteDispatcher = dispatcher;
  }

  public syncRemoteStatus(isRunning: boolean, speed: number): void {
    if (this.playBtn) {
      this.playBtn.innerHTML = isRunning ? '⏸ Pause' : '▶ Play';
      this.playBtn.className = isRunning ? 'btn-transport btn-pause' : 'btn-transport btn-play';
    }
    if (this.speedPills) {
      this.speedPills.forEach(pill => {
        const s = parseFloat(pill.getAttribute('data-speed') ?? '1');
        if (Math.abs(s - speed) < 0.05) {
          pill.classList.add('speed-active');
        } else {
          pill.classList.remove('speed-active');
        }
      });
    }
  }
}
