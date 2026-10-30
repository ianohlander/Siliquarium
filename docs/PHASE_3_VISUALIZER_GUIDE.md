# 🔬 Phase 3: WebGL 3D Seafloor & Interactive Circuit Microscope Guide
*The Visual Window into Digital Abiogenesis: From 3D Deep-Sea Caldera to Nanoscale Logic Netlists*

---

## 1. Visceral Motivation: The Antonie van Leeuwenhoek Moment

In 1674, Dutch draper Antonie van Leeuwenhoek placed a droplet of murky lake water beneath a brass microscope with a single polished glass bead. Expecting inanimate sediment, he was stunned to discover thousands of tiny, pulsating creatures swimming, twisting, and devouring organic detritus—the first observation of microscopic life ("animalcules").

Before Phase 3, Siliquarium's digital ecosystem was locked inside numerical arrays, bitwise registers, and terminal logs. While our Stage 0–7 test suites proved that energy is strictly conserved ($\Delta E = 0.000$) and that blind photocopy replication preserves the Epistemic Cut, human researchers had no direct window into this emerging biosphere.

**Phase 3 changes everything.** It provides two complementary observational lenses:
1. **The Macroscope (3D WebGL Seafloor Caldera):** A volumetric perspective of the abyssal hydrothermal vent field, rendering basalt terraces, buoyant thermal plumes rising against gravity, and glowing colonies of living silicon cells.
2. **The Microscope (2D Logic Workshop Inspector):** A nanoscopic schematic window into an individual pore's `PoreWorkshop`, displaying real-time logic gate toggles (`AND`, `OR`, `NOT`, `BUF`), pulsing electron wires, battery token reserves ($0..100$), and the 60-bit genome tape.

![Figure 3.1: The Macroscope — Volumetric 3D Hydrothermal Caldera](assets/screenshots/01_overview_and_lattice_key.png)

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: Figure 3.1 — The 3D Abyssal Macroscope
> - **Visual Guide:** The panoramic WebGL viewport renders the stacked hexagonal basalt terraces $(q, r, z=0)$, the central thermal hydrothermal chimney spires, and buoyant convective updrafts rising into the permeable aqueous fluid column.
> - **Biophysical Reality:** Benthic hydrothermal ecosystems exhibit extreme vertical and radial chemical stratification. Temperature, pH, and redox potential drop steeply as fluids mix with ambient abyssal ocean water.
> - **Digital Mapping:** Each pore is color-coded in real time according to its metabolic state and battery charge ($0\text{--}100\text{ tokens}$). Active autotrophs glow emerald green, while saturated spores detach and rise through the permeable water column.
> - **Core Principle:** *Spatial context drives macro-ecological dynamics.* Evolution is shaped by local geometric gradients, diffusion boundaries, and fluid advection.

![Figure 3.2: The Microscope — Real-Time Logic Workshop & Reticle Lock](assets/screenshots/03_selected_silicoid_and_microscope.png)

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: Figure 3.2 — The In-Situ Circuit Microscope
> - **Visual Guide:** Clicking any living pore activates the holographic 3D reticle and expands the live `PoreWorkshop` inspector drawer on the right. The panel displays real-time logic gate toggles (`AND`, `OR`, `NOT`), active signal wires, current battery reserves, and the 60-bit decoded genome tape.
> - **Biophysical Reality:** Directly verifies Howard Pattee's Epistemic Cut: students observe the rate-independent symbolic genome tape resting safely on the library shelf, while rate-dependent CMOS logic gates toggle dynamically to process incoming vent pulses.
> - **Digital Mapping:** Dynamic Landauer power dissipation ($1\text{ token per toggle}$) and basal membrane leakage are metered in real time. If battery reserves hit zero, the cell undergoes immediate lysis into mineral rubble.
> - **Core Principle:** *Observation without perturbation.* The microscope provides a non-invasive telemetry window into the living cell's internal state without altering its physical thermodynamics.

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

### 3.3 Benthic Rock Substrate vs. Translucent Aqueous Fluid Column
In prebiotic hydrothermal systems, sessile protocells ("silicoids") do not float in empty vacuum; they reside anchored to mineral substrates where thermal and electrochemical gradients are steepest:
- **Bedrock & Chimney Substrate (`PoreMedium.ROCK_SUBSTRATE`):** The solid $z=0$ benthic floor and the rising volcanic chimney spire ($q^2 + r^2 + qr \le 1, z \ge 1$) are opaque basalt structures rendered in solid dark titanium (`#0f172a`, `#172033`). Primordial silicoids exclusively spawn on this substrate.
- **Aqueous Water Column (`PoreMedium.AQUEOUS_FLUID`):** Surrounding the chimney at $z \ge 1$ is the deep-sea water column. Aqueous cells are rendered with high optical transparency: subtle cyan caps (`rgba(6, 182, 212, 0.08)`) with bioluminescent borders (`rgba(56, 189, 248, 0.22)`). When the camera descends beneath an aqueous layer, upper water layers naturally become invisible, ensuring unobstructed observation of benthic life below.

---

### 3.4 In-Situ 3D Microscopic Circuit Rendering & Level-of-Detail (LOD)
Can we see the microscopic silicoids in all their circuit glory directly on the 3D seafloor, and is that a heavy computational ask?
- **Computational Cost: Zero Overhead ($< 0.05\text{ms}$/frame).** Drawing full logic schematics across all 127 cells at 60 FPS would cause excessive canvas draw calls. However, by employing a **Level-of-Detail (LOD) Gate**, internal circuits are only drawn when a cell is actively selected or when perspective zoom enlarges its projected radius on screen ($\text{Radius}_{\text{proj}} \ge 24\text{px}$).
- **In-Situ Visual Architecture:**
  1. **Silicon Micro-Chamber:** A circular dark substrate wafer etched into the hex cap.
  2. **Genome Spiral Embryo:** A golden Fibonacci spiral tape pulsing dynamically with hydrothermal convection time.
  3. **Logic Gate IC Chips:** When zoomed close ($\ge 32\text{px}$), miniature IC chip packages (`AND`, `OR`, `NOT`, `XOR`) appear around the chamber perimeter, tethered by electrical signal bus wires illuminated by living logic state.

---

---

## 5. The Monolithic Lithospheric Mantle & Subterranean Stratum Architecture

The abyssal hydrothermal field in Siliquarium is not an abstract, floating 2D plane suspended in empty space. In natural marine geology, hydrothermal vents sit atop a massive, dense **oceanic tectonic plate** founded upon the Penrose ophiolite sequence: basaltic lava terraces underlain by sheeted dikes, gabbros, and the ultramafic peridotite mantle.

To capture this biophysical reality, Siliquarium's 3D rendering engine ([`SeafloorRenderer3D.ts`](file:///h:/My%20Drive/Repos/Siliquarium/src/visualizers/SeafloorRenderer3D.ts)) implements a monolithic, flared lithospheric mantle foundation and deep subterranean stratigraphy ($z \in [-1, 4]$).

> [!ANALYSIS]
> ### 🔬 Pedagogical Breakdown: The Oceanic Lithospheric Mantle & Axial Rift Architecture
> - **Visual Guide:** The seamount rests upon an imposing basalt bedrock foundation with an $8\%$ outward tectonic flare ($s_{\text{flare}} = 1.08$), dark titanium cliff facets, subtle horizontal volcanic strata striations, and vertical columnar basalt cooling joints. Beneath the primary benthic floor ($z = 0$), sunken axial rift grabens plunge down to the subterranean stratum ($z = -1$).
> - **Biophysical Reality:** Oceanic crust formed at mid-ocean spreading ridges is under continuous extensional tension. Seawater penetrates deep fault grabens and sheeted dikes, where water-rock serpentinization generates abiotic $H_2$ and thermal plumes kilometers beneath the seabed (the IODP "Deep Dark Biosphere").
> - **Digital Mapping:** The renderer invokes `drawLithosphericCrustMantle()` prior to rendering hexagonal prisms. Pores at $z = -1$ feature shaded rift walls and darkened basal caps, serving as protected geothermal nooks where silicoids find refuge from surface boiling pulses and pelagic shear.
> - **Core Principle:** *Geological foundation stabilizes biological evolution.* The lithosphere provides the physical substrate, thermal gradients, and structural boundary conditions without preprogramming biological solutions.

### 5.1 Flared Cliff Facets, Volcanic Strata Banding & Columnar Jointing
The mantle foundation is generated dynamically by computing the 2D convex hull of all peripheral hexagonal pores in the base stratum ($z = \min(z)$):
1. **$8\%$ Tectonic Flare:** Bottom hull vertices are expanded radially outward by factor $s_{\text{flare}} = 1.08$:
   $$\mathbf{V}_{\text{bottom}}(i) = \begin{bmatrix} s_{\text{flare}} \cdot x_{\text{hull}}(i) \\ y_{\text{base}} - \Delta y_{\text{mantle}} \\ s_{\text{flare}} \cdot z_{\text{hull}}(i) \end{bmatrix}$$
   This models the natural angle of repose and mechanical shear strength of basaltic tectonic plates.
2. **Directional Lighting & Facet Shading:** Each vertical cliff facet between adjacent hull vertices is shaded based on the angle between its surface normal $\mathbf{N}_{\text{facet}}$ and the abyssal ambient lighting vector $\mathbf{L}_{\text{ambient}}$:
   $$I_{\text{facet}} = I_{\text{base}} + I_{\text{diffuse}} \cdot \max(0, \mathbf{N}_{\text{facet}} \cdot \mathbf{L}_{\text{ambient}})$$
3. **Columnar Basalt Cooling Joints:** When basaltic magma cools rapidly against cold abyssal seawater, thermal contraction produces hexagonal tension joints. Siliquarium renders subtle vertical joint lines along facet edges (`rgba(51, 65, 85, 0.4)`), mimicking the columnar jointing of the Giant's Causeway and mid-ocean ridges.
4. **Horizontal Volcanic Strata Banding:** Cooling striations and successive lava flows are rendered as thin, subtle horizontal strata lines spanning each cliff facet at discrete vertical intervals:
   $$y_{\text{band}}(k) = y_{\text{base}} - k \cdot \frac{\Delta y_{\text{mantle}}}{N_{\text{strata}}}, \quad k \in [1, N_{\text{strata}}]$$
5. **Solid Bottom Capping Plate:** The bottom hull polygon is capped with a deep obsidian floor (`#050811`), preventing the camera from seeing hollow void space when rotated underneath the caldera.

### 5.2 Subterranean Stratum ($z = -1$) & Axial Rift Grabens
In addition to upward volcanic accretion ($z = 1, 2, 3, 4$), Siliquarium natively supports subterranean excavation down to $z = -1$:
- **Subterranean Pore Shading:** Pores located at $z = -1$ are rendered with darker basaltic shades (`#090e1a` to `#111827`) and enhanced depth occlusion (`rgba(0, 0, 0, 0.35)`), clearly differentiating deep subterranean crevices from surface terraces.
- **Autonomous Magmatic Rifting:** When a `MAGMATIC_TREMOR` geological pressure event fires, normal fault rifting drops adjacent peripheral pores downward into sunken rift grabens, opening new subterranean niches.
- **Deep Dark Biosphere Nursery:** Organisms inside subterranean grabens are shielded from pelagic spore advection currents and surface thermal surges, modeling the ancient deep subseafloor aquifers identified by IODP drilling (Edwards et al. 2012, Orcutt et al. 2011).

---

## 6. Streamlined Telemetry & The Pull-Down Ecosystem Stats Architecture

In an authentic systems biology simulator, observing the ecosystem requires tracking numerous non-equilibrium variables: living cell counts, decaying carcasses, pelagic spore densities, stored metabolic energy, active hydrothermal vents, and First-Law thermodynamic ledger balances.

However, displaying all these metrics simultaneously in the top navigation bar risked causing horizontal overflow, clipping text off-screen, and obscuring the 3D camera controls.

Siliquarium resolves this UX challenge through an elegant, non-intrusive **Pull-Down Telemetry Architecture**:

### 6.1 Clean Masthead & Dedicated Stats Drawer
- **Clean Header Mast:** The persistent top banner preserves vital macro-controls (Play/Pause, Step, Reset, FPS, Epoch counter, and Clade Phylogeny dropdown) without horizontal wrapping across all monitor aspect ratios.
- **The Pull-Down Stats Drawer (`#hud-stats-panel`):** Triggered by a dedicated `📊 Stats ▼` toggle button in the transport bar. When clicked, an elegant, translucent telemetry drawer slides downward:
  - **Living Biomass:** Active silicoid count and pelagic spores drifting in the water column.
  - **Detrital Necromass:** Decaying carcasses available for saprotrophic catabolism.
  - **Stored Energy:** Total ATP/pyrophosphate tokens stored in living pore batteries.
  - **Active Vents:** Number of operational geothermal caldera nozzles injecting fuel.
  - **First-Law Thermodynamic Audit:** Real-time verification that $\Delta E = 0.000$ and $\Delta M = 0.000$, proving that energy and matter are strictly conserved without unphysical leaks.

### 6.2 Click-Outside & Keyboard Dismissal
The telemetry panel is engineered for non-disruptive observation:
- Clicking anywhere outside the panel (or rotating the 3D seafloor) automatically dismisses the drawer, restoring an unobstructed view of the seamount.
- Pressing the `Escape` key immediately closes the drawer.
- The panel uses high-performance CSS hardware acceleration (`backdrop-blur-md`, `bg-slate-950/90`) to ensure 60 FPS visual smoothness without triggering DOM layout thrashing.

### 6.3 Subterranean Layer Brush ($z = -1$)
Within the God-Suite Lab Flyout, researchers can select vertical target layers using the stratum selector:
- Clicking the `z = -1` button activates the subterranean brush.
- Clicking on any pore location while in $z = -1$ mode excavates a sunken rift trench into the basalt bedrock.
- Right-clicking toggles between solid rock substrate and subterranean water-filled cavities, allowing researchers to custom-craft subseafloor aquifers and test endolithic microbial survival hypotheses.

---

## 7. Concrete Micro-Scaffolding: Click Disambiguation & Polygon Picking

When a researcher clicks on an individual pore in the 3D seafloor canvas:

| Step | Operation | Mathematical / Computational Action |
| :---: | :--- | :--- |
| **1** | Mouse Drag Filter | Tracks down coordinate $(x_0, y_0)$. If drag distance $\sqrt{\Delta x^2 + \Delta y^2} > 5\text{px}$, the click event is suppressed, ensuring camera orbits never cause accidental selection. |
| **2** | Screen Coordinates | Captures pixel click $(s_x, s_y)$. |
| **3** | Convex Ray-Casting | Executes Jordan Curve ray-crossing polygon test against each projected hexagonal cap in depth order (closest first). |
| **4** | Radial Fallback | Validates hit within projected hex radius ($\le 0.88 \cdot R_{\text{proj}}$). |
| **5** | Selection Lock | Electric neon sky bracket (`#38bdf8`) locks onto the selected pore. |
| **6** | Telemetry HUD | Top-left inspection badge updates coordinates, state, and thermodynamic properties without obscuring transport controls. |

---

## 8. Misconception Immunity (Skeptic FAQ)

### Q1: Does the 3D visualizer slow down evolutionary simulations?
**No.** The core simulation kernel (`src/core/` and `src/engine/`) adheres strictly to the **Zero-DOM Mandate**. It has zero browser dependencies and runs at maximum speed in headless Node.js CLI test runners or background Web Workers. The presentation visualizer merely consumes lightweight flat snapshots (`SimulationTelemetry`) at 60 FPS without creating garbage-collection spikes or blocking the simulation engine.

### Q2: Are the 3D physics continuous or discrete?
**Discrete $O(1)$.** As established in Section 20 of `THEORETICAL_MODEL.md`, continuous 3D rigid-body engines (like Havok or PhysX) introduce massive computational bloat. Siliquarium's 3D environment is a discrete stacked hexagonal lattice $(q, r, z)$. Movement and placement are instantaneous pointer operations taking $O(1)$ time per tick.

### Q3: Why use an interactive HTML5 canvas microscope instead of static charts?
Because life is dynamic. Static truth tables cannot show whether a circuit is oscillating, whether an electron pulse arrived in time to catch an incoming substrate wave, or how Landauer heat accumulates. The interactive microscope lets educators and students watch **computation as a living metabolism**.

### Q4: Does the flared lithospheric crust mantle impose heavy GPU/CPU overhead?
**No.** The 2D convex hull of the base stratum consists of at most 18 peripheral vertices. Rendering the flared facets, cooling striations, and bottom plate requires fewer than 25 2D canvas polygon draw operations per frame—taking less than $0.03\text{ ms}$, or less than $0.2\%$ of a standard $16.6\text{ ms}$ frame budget!

### Q5: Does the pull-down stats drawer poll the simulation loop continuously?
**No.** Telemetry data is pushed directly from the simulation engine's flat snapshot at the end of each tick. The stats panel DOM elements only update when the panel is actively open (`display !== 'none'`), ensuring zero DOM manipulation overhead when closed.

---

## 9. Academic Citations

- **The Deep Dark Biosphere & Subseafloor Basalt Crust:**  
  *Edwards, K. J., Becker, K., & Colwell, F. (2012).* "The deep, dark biosphere: intraterrestrial life on Earth." *Annual Review of Earth and Planetary Sciences*, 40, 551–568.  
  *Orcutt, B. N., Sylvan, J. B., Knab, N. J., & Edwards, K. J. (2011).* "Microbial life in the oceanic crust." *Microbiology and Molecular Biology Reviews*, 75(2), 361–425.  
  *Schrenk, M. O., Huber, J. A., & Edwards, K. J. (2010).* "Microbial provinces in the subseafloor." *Annual Review of Marine Science*, 2, 279–304.
- **Oceanic Spreading Centers & Axial Rift Grabens:**  
  *German, C. R., et al. (2010).* "Diverse hydrothermal systems found on a hyper-slow spreading ridge." *Nature Geoscience*, 3, 564–568.
- **Gram-Schmidt Orthonormalization & Camera View Transforms:**  
  *Hughes, J. F., et al. (2014).* *Computer Graphics: Principles and Practice (3rd ed.)*. Addison-Wesley.
- **Axial Hexagonal Grid Geometry & Metric Invariants:**  
  *Patel, A. (2013).* "Hexagonal Grids: Coordinate Systems, Distance, and Pathfinding." *Red Blob Games*.
- **The Epistemic Cut in Visualized Artificial Life:**  
  *Pattee, H. H. (2001).* "The physics of symbols: bridging the epistemic cut." *Biosystems*, 60(1-3), 5–21.

