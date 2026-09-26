/**
 * 🐠 Siliquarium Main Application Entrypoint
 * Wires Simulation Engine, 3D Seafloor Renderer, Circuit Microscope, HUD, and Controls.
 */

import { SimulationWorld } from './engine/SimulationWorld.js';
import { SimulationLoop } from './engine/SimulationLoop.js';
import { OrbitCamera } from './visualizers/OrbitCamera.js';
import { SeafloorRenderer3D } from './visualizers/SeafloorRenderer3D.js';
import { CircuitMicroscopeView } from './visualizers/CircuitMicroscopeView.js';
import { HUDController } from './ui/HUDController.js';
import { LabFlyout } from './ui/LabFlyout.js';
import { InteractiveControls } from './ui/InteractiveControls.js';
import { MilestoneModal } from './ui/MilestoneModal.js';
import { HexCoord3D } from './core/spatial/HexCoord3D.js';
import { IPoreTelemetry } from './engine/SimulationTelemetry.js';

class SiliquariumApp {
  private readonly world: SimulationWorld;
  private readonly loop: SimulationLoop;
  private readonly camera: OrbitCamera;
  private readonly seafloorRenderer: SeafloorRenderer3D;
  private readonly microscopeView: CircuitMicroscopeView;
  private readonly hud: HUDController;
  private readonly flyout: LabFlyout;
  private readonly controls: InteractiveControls;
  private readonly milestoneModal: MilestoneModal;

  private readonly seafloorCanvas: HTMLCanvasElement;
  private readonly microscopeCanvas: HTMLCanvasElement;
  private selectedPoreCoord: HexCoord3D | null = null;

  constructor() {
    this.world = new SimulationWorld({ radius: 4, minZ: 0, maxZ: 2, soupDensity: 0.25 });
    this.loop = new SimulationLoop(this.world);
    this.camera = new OrbitCamera();

    this.seafloorCanvas = document.getElementById('canvas-seafloor') as HTMLCanvasElement;
    this.microscopeCanvas = document.getElementById('canvas-microscope') as HTMLCanvasElement;

    this.seafloorRenderer = new SeafloorRenderer3D(this.seafloorCanvas, this.camera);
    this.microscopeView = new CircuitMicroscopeView(this.microscopeCanvas);
    this.hud = new HUDController();

    this.flyout = new LabFlyout(this.world, {
      onSeedRequested: (density) => this.world.seedPrimordialSoup(density),
      onResetRequested: () => this.resetSimulation(),
      onThermalPulseRequested: () => {}
    });

    this.controls = new InteractiveControls(this.loop, this.camera);

    this.milestoneModal = new MilestoneModal((coord) => {
      this.selectedPoreCoord = coord;
      this.seafloorRenderer.setSelectedCoord(coord);
      const worldPos = this.seafloorRenderer.axialToWorld(coord);
      this.camera.target = { x: worldPos.x, y: worldPos.y, z: worldPos.z };
      this.camera.distance = 14.0;
    });

    this.world.getPaleontologist().onMilestone((event) => {
      this.milestoneModal.show(event);
    });

    this.bindCanvasInteractions();
    this.bindResize();
    this.handleResize();

    // Start simulation loop at 1x
    this.loop.start();
    this.startRenderLoop();
  }

  public getFlyout(): LabFlyout {
    return this.flyout;
  }

  public getControls(): InteractiveControls {
    return this.controls;
  }

  public getMilestoneModal(): MilestoneModal {
    return this.milestoneModal;
  }

  private resetSimulation(): void {
    this.loop.pause();
    window.location.reload();
  }

  private bindResize(): void {
    window.addEventListener('resize', () => this.handleResize());
  }

  private handleResize(): void {
    const seafloorBox = this.seafloorCanvas.parentElement;
    if (seafloorBox) {
      this.seafloorCanvas.width = seafloorBox.clientWidth;
      this.seafloorCanvas.height = seafloorBox.clientHeight;
    }

    const microBox = this.microscopeCanvas.parentElement;
    if (microBox) {
      this.microscopeCanvas.width = microBox.clientWidth;
      this.microscopeCanvas.height = 420;
    }
  }

  private bindCanvasInteractions(): void {
    let isDragging = false;
    let dragMode: 'orbit' | 'pan' = 'orbit';
    let lastX = 0;
    let lastY = 0;

    this.seafloorCanvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      dragMode = (e.button === 2 || e.shiftKey) ? 'pan' : 'orbit';
      lastX = e.clientX;
      lastY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;

        if (dragMode === 'orbit') {
          this.camera.rotate(-dx * 0.008, dy * 0.008);
        } else {
          this.camera.pan(-dx * 0.05, -dy * 0.05);
        }
      } else {
        const rect = this.seafloorCanvas.getBoundingClientRect();
        const sx = e.clientX - rect.left;
        const sy = e.clientY - rect.top;
        const tele = this.world.exportTelemetry();
        const hovered = this.seafloorRenderer.findPoreAtScreenCoord(sx, sy, tele);
        this.seafloorRenderer.setHoveredCoord(hovered);
      }
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    this.seafloorCanvas.addEventListener('contextmenu', (e) => e.preventDefault());

    this.seafloorCanvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.camera.zoom(e.deltaY * 0.02);
    }, { passive: false });

    this.seafloorCanvas.addEventListener('click', (e) => {
      const rect = this.seafloorCanvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const tele = this.world.exportTelemetry();
      const clicked = this.seafloorRenderer.findPoreAtScreenCoord(sx, sy, tele);

      if (clicked) {
        this.selectedPoreCoord = clicked;
        this.seafloorRenderer.setSelectedCoord(clicked);
      }
    });
  }

  private startRenderLoop(): void {
    const frame = () => {
      const tele = this.world.exportTelemetry();
      this.seafloorRenderer.render(tele);

      let selectedPoreTele: IPoreTelemetry | null = null;
      if (this.selectedPoreCoord) {
        selectedPoreTele = tele.pores.find(p => p.coord.equals(this.selectedPoreCoord!)) ?? null;
      }
      this.microscopeView.render(selectedPoreTele, tele.vent);
      this.hud.update(tele, selectedPoreTele);

      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}

// Bootstrap on DOM content loaded
window.addEventListener('DOMContentLoaded', () => {
  new SiliquariumApp();
});
