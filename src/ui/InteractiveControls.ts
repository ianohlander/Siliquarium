/**
 * 🐠 Siliquarium UI Subsystem
 * InteractiveControls: Bottom Transport and Camera View Controller.
 * Wires play/pause, step forward, speed multipliers, and camera angles.
 */

import { SimulationLoop } from '../engine/SimulationLoop.js';
import { OrbitCamera } from '../visualizers/OrbitCamera.js';

export class InteractiveControls {
  private readonly loop: SimulationLoop;
  private readonly camera: OrbitCamera;

  private playBtn: HTMLElement | null = null;
  private stepBtn: HTMLElement | null = null;
  private speedPills: NodeListOf<HTMLElement> | null = null;

  constructor(loop: SimulationLoop, camera: OrbitCamera) {
    this.loop = loop;
    this.camera = camera;
    this.initElements();
  }

  private initElements(): void {
    this.playBtn = document.getElementById('btn-play-pause');
    this.stepBtn = document.getElementById('btn-step-forward');
    this.speedPills = document.querySelectorAll('.speed-pill');

    this.bindEvents();
  }

  private bindEvents(): void {
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => {
        this.loop.toggle();
      });
    }

    if (this.stepBtn) {
      this.stepBtn.addEventListener('click', () => {
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
          this.loop.setSpeed(speed);
          this.speedPills?.forEach(p => p.classList.remove('speed-active'));
          pill.classList.add('speed-active');
        });
      });
    }

    this.bindCameraPresets();
  }

  private bindCameraPresets(): void {
    const btnCaldera = document.getElementById('cam-caldera');
    const btnTopDown = document.getElementById('cam-topdown');
    const btnReset = document.getElementById('cam-reset');

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

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.camera.azimuth = 0.8;
        this.camera.elevation = 0.6;
        this.camera.distance = 24.0;
        this.camera.target = { x: 0, y: 0, z: 0 };
      });
    }
  }
}
