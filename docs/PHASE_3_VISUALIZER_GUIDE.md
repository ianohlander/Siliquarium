# 🔬 Phase 3: WebGL 3D Seafloor & Interactive Circuit Microscope Guide
*The Visual Window into Digital Abiogenesis: From 3D Deep-Sea Caldera to Nanoscale Logic Netlists*

---

## 1. Visceral Motivation: The Antonie van Leeuwenhoek Moment

In 1674, Dutch draper Antonie van Leeuwenhoek placed a droplet of murky lake water beneath a brass microscope with a single polished glass bead. Expecting inanimate sediment, he was stunned to discover thousands of tiny, pulsating creatures swimming, twisting, and devouring organic detritus—the first observation of microscopic life ("animalcules").

Before Phase 3, Siliquarium's digital ecosystem was locked inside numerical arrays, bitwise registers, and terminal logs. While our Stage 0–7 test suites proved that energy is strictly conserved ($\Delta E = 0.000$) and that blind photocopy replication preserves the Epistemic Cut, human researchers had no direct window into this emerging biosphere.

**Phase 3 changes everything.** It provides two complementary observational lenses:
1. **The Macroscope (3D WebGL Seafloor Caldera):** A volumetric perspective of the abyssal hydrothermal vent field, rendering basalt terraces, buoyant thermal plumes rising against gravity, and glowing colonies of living silicon cells.
2. **The Microscope (2D Logic Workshop Inspector):** A nanoscopic schematic window into an individual pore's `PoreWorkshop`, displaying real-time logic gate toggles (`AND`, `OR`, `NOT`, `BUF`), pulsing electron wires, battery token reserves ($0..100$), and the 60-bit genome tape.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   THE TWO OBSERVATIONAL LENSES                         │
│                                                                        │
│   [ MACROSCOPE: 3D Seafloor ]       ──►   [ MICROSCOPE: 2D Pore ]      │
│   • 3D Stacked Hex Lattice (q,r,z)        • Real-Time Logic Gates      │
│   • Buoyant Hydrothermal Plumes           • Pulsing Binary Wires (0/1) │
│   • Population Colony Geography           • Battery Token Gauge        │
│   • Detritus Carcass Sediment             • 1D Decoded Genome Tape     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The Gradient of Abstraction: How the Visualizer Works

### 2.1 The Apartment Analogy
Think of the 3D Seafloor as a terraced high-rise apartment complex carved into a volcanic cliff:
- Each **hexagonal pore** is an individual apartment unit $(q, r, z)$.
- The **hydrothermal vent chimney** at the ground floor is a central boiler furnace, sending hot water and nutrients drifting upward through the courtyards.
- Clicking on an apartment window zooms your camera in, opening the door into that cell's **kitchen workshop**. Inside, you can see which appliances (logic gates) are running, whether the pantry (battery) is full, and what cookbook (genome safe) rests on the shelf.

---

## 3. Mathematical Architecture & Deconstructive Equation Anatomy

### 3.1 Hexagonal Axial to 3D Cartesian Coordinate Projection
Siliquarium arranges pores in stacked 3D hexagonal prisms with axial coordinates $(q, r, z)$. To render these in 3D space, we project axial coordinates onto Cartesian coordinates $(x, y, z)$:

$$x = R \sqrt{3} \left(q + \frac{r}{2}\right), \quad z = R \frac{3}{2} r, \quad y = z_{\text{elev}} \cdot \Delta z$$

> ### 🔍 Equation Decoder
> - **$R$ (Hex Radius):** The circumradius of an individual hexagonal pore ($R = 1.0$).
> - **$q, r$ (Axial Coordinates):** The 2D planar hex coordinates on the basalt terrace.
> - **$\sqrt{3} (q + r/2)$ (Equidistant X):** Projects the $60^\circ$ slanted axial axis onto orthogonal Euclidean $X$, guaranteeing that all 6 planar neighbors are strictly equidistant at $\sqrt{3} R \approx 1.732$.
> - **$\frac{3}{2} r$ (Cartesian Z):** The row height spacing between adjacent hexagonal rows.
> - **$z_{\text{elev}}$ (Vertical Layer):** The discrete vertical shelf index ($z \in [0, 1, 2]$).
> - **$\Delta z$ (Vertical Spacing):** Physical vertical clearance between benthic shelves ($\Delta z = 1.4$).

---

### 3.2 The 3D Spherical Orbit Camera Pipeline
Navigating the abyssal seamount requires smooth, intuitive 3D rotation, panning, and zooming. Rather than depending on heavy external graphics frameworks, Siliquarium implements a pure mathematical spherical orbit camera:

$$\begin{aligned}
x_{\text{eye}} &= x_{\text{target}} + R_{\text{cam}} \cos(\theta) \sin(\phi) \\
y_{\text{eye}} &= y_{\text{target}} + R_{\text{cam}} \sin(\theta) \\
z_{\text{eye}} &= z_{\text{target}} + R_{\text{cam}} \cos(\theta) \cos(\phi)
\end{aligned}$$

$$\mathbf{P}_{\text{screen}} = \mathbf{M}_{\text{proj}} \cdot \mathbf{M}_{\text{view}} \cdot \mathbf{P}_{\text{world}}$$

> ### 🔍 Equation Decoder
> - **$R_{\text{cam}}$ (Camera Distance):** Radial distance from the focal center ($3.0 \le R_{\text{cam}} \le 80.0$).
> - **$\theta$ (Elevation / Pitch):** Vertical viewing angle ($0.1 \le \theta \le \pi/2 - 0.05$). Clamped to prevent gimbal lock.
> - **$\phi$ (Azimuth / Yaw):** Horizontal rotation angle around the caldera ($0 \le \phi \le 2\pi$).
> - **$\mathbf{M}_{\text{view}}$ (View Matrix):** Transforms 3D world space into camera coordinate space via Gram-Schmidt orthonormalization.
> - **$\mathbf{M}_{\text{proj}}$ (Perspective Projection):** 4x4 frustum transformation matrix encoding field-of-view ($\text{FOV} = 45^\circ$) and perspective foreshortening.

---

## 4. Concrete Micro-Scaffolding: The Click-to-Inspect Raycast Trace

When a researcher clicks on an individual pore in the 3D seafloor canvas, what happens under the hood?

| Step | Operation | Mathematical / Computational Action |
| :---: | :--- | :--- |
| **1** | User Click | Mouse event captures screen coordinates $(s_x, s_y) = (482, 310)$ px. |
| **2** | NDC Conversion | Converts pixels to Normalized Device Coordinates $x_{\text{ndc}} \in [-1, +1]$, $y_{\text{ndc}} \in [-1, +1]$. |
| **3** | Ray Unprojection | Multiplies near and far plane coordinates by $(\mathbf{M}_{\text{proj}} \cdot \mathbf{M}_{\text{view}})^{-1}$, generating 3D ray $(\vec{O}, \vec{D})$. |
| **4** | Hex Hit Test | Finds the nearest pore center $(q, r, z)$ within spatial tolerance threshold. |
| **5** | Microscope Lock | High-visibility neon sky bracket (`#38bdf8`) locks onto selected pore. |
| **6** | Phenotype Decoding | `CircuitMicroscopeView` translates 60-bit genome tape into gate netlist and renders animated schematic. |

---

## 5. Misconception Immunity (Skeptic FAQ)

### Q1: Does the 3D visualizer slow down evolutionary simulations?
**No.** The core simulation kernel (`src/core/` and `src/engine/`) adheres strictly to the **Zero-DOM Mandate**. It has zero browser dependencies and runs at maximum speed in headless Node.js CLI test runners or background Web Workers. The presentation visualizer merely consumes lightweight flat snapshots (`SimulationTelemetry`) at 60 FPS without creating garbage-collection spikes or blocking the simulation engine.

### Q2: Are the 3D physics continuous or discrete?
**Discrete $O(1)$.** As established in Section 20 of `THEORETICAL_MODEL.md`, continuous 3D rigid-body engines (like Havok or PhysX) introduce massive computational bloat. Siliquarium's 3D environment is a discrete stacked hexagonal lattice $(q, r, z)$. Movement and placement are instantaneous pointer operations taking $O(1)$ time per tick.

### Q3: Why use an interactive HTML5 canvas microscope instead of static charts?
Because life is dynamic. Static truth tables cannot show whether a circuit is oscillating, whether an electron pulse arrived in time to catch an incoming substrate wave, or how Landauer heat accumulates. The interactive microscope lets educators and students watch **computation as a living metabolism**.

---

## 6. Academic Citations

- **Gram-Schmidt Orthonormalization & Camera View Transforms:**  
  *Hughes, J. F., et al. (2014).* *Computer Graphics: Principles and Practice (3rd ed.)*. Addison-Wesley.
- **Axial Hexagonal Grid Geometry & Metric Invariants:**  
  *Patel, A. (2013).* "Hexagonal Grids: Coordinate Systems, Distance, and Pathfinding." *Red Blob Games*.
- **The Epistemic Cut in Visualized Artificial Life:**  
  *Pattee, H. H. (2001).* "The physics of symbols: bridging the epistemic cut." *Biosystems*, 60(1-3), 5–21.
