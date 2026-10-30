# 💳 Turnkey Monetization & Hosted SaaS Blueprint

**Author:** Jack "The Closer" Vance, Chief Marketing Officer & Commercialization Strategist  
**Target:** Ian Ohlander, Founder & Chief Architect of Siliquarium  
**Purpose:** Zero-Tax Liability, Merchant of Record Setup, 5 High-Margin Hosted Tiers, and Technical Implementation  

---

## 1. The Operational Superweapon: Why Merchant of Record (Lemon Squeezy) Beats Stripe Direct

Most technical founders make a catastrophic mistake when commercializing their first application: they create a Stripe account, write custom webhook code, and think they are done.

Six months later, they receive a certified notice from the California Department of Tax and Fee Administration, followed by inquiries from New York, Texas, and HM Revenue & Customs in the United Kingdom.

### The Tax Nexus Nightmare in Software:
- **US Multi-State Economic Nexus:** Over 45 US states have enacted economic nexus laws for digital goods and SaaS. If you sell software to residents in Pennsylvania, Ohio, or Washington, you may be legally required to register with each state’s treasury, calculate local county/municipal sales taxes, and file quarterly returns.
- **European Union & UK VAT:** In the EU and UK, digital services sold to consumers are subject to Destination-Based VAT (from 17% in Luxembourg to 27% in Hungary). You must register for EU VAT One Stop Shop (OSS) and remit VAT in euros, or face severe penalties.
- **Canadian GST/HST, Australian GST, etc.:** Each jurisdiction has distinct thresholds and filing schedules.

If you use Stripe directly, **you are the legal seller**. You bear 100% of the tax compliance, collection, remittance, audit, and legal defense costs. For a solo founder, this administrative overhead is lethal.

### The Solution: Lemon Squeezy as Merchant of Record (MoR)
With **Lemon Squeezy** (owned by Stripe), Lemon Squeezy is legally the Merchant of Record:
1. **Lemon Squeezy is the reseller:** The customer buys from Lemon Squeezy; Lemon Squeezy buys from you.
2. **Zero Tax Liability for Ian:** Lemon Squeezy calculates, collects, and remits sales tax and VAT across all 50 US states, the EU, UK, Canada, Australia, and beyond. They assume 100% of the legal tax liability.
3. **Turnkey License Key Generation:** Lemon Squeezy automatically generates, manages, and validates cryptographic license keys out of the box.
4. **Simple Payouts:** Every week or month, Lemon Squeezy deposits your clean net earnings directly into your bank account via ACH.
5. **Ultra-Low Cost:** Lemon Squeezy charges just **5% + $0.50 per transaction**. Because Siliquarium's client-side simulation has zero compute cost, your **net profit margin is ~93% to 95%**.

```
+---------------------------------------------------------------------------------------------------------+
|                                    LEMON SQUEEZY ARCHITECTURAL FLOW                                     |
+---------------------------------------------------------------------------------------------------------+
|                                                                                                         |
|  [ CUSTOMER ]                                                                                           |
|  Visits siliquarium.ianohlander.com ──> Clicks "Unlock Laboratory Pro" or "Enter Abyssal Arena"         |
|                                                                                                         |
|                                      │                                                                  |
|                                      ▼                                                                  |
|  [ LEMON SQUEEZY OVERLAY CHECKOUT ]                                                                     |
|  * Displays localized price & currency ($34.99 USD, €32.50 EUR, £28.00 GBP)                             |
|  * Automatically collects & remits local sales tax / VAT                                                |
|  * Supports Apple Pay, Google Pay, Credit/Debit Cards, PayPal                                           |
|                                                                                                         |
|                                      │                                                                  |
|                                      ▼                                                                  |
|  [ INSTANT FULFILLMENT & WEBHOOK ]                                                                      |
|  * Generates Cryptographic Pro License Key (e.g., SILI-8F92-4B1C-99E0)                                  |
|  * Emails invoice, receipt, and license key directly to customer                                        |
|  * Injects key into client localStorage for immediate zero-lag Pro feature activation                  |
|                                                                                                         |
|                                      │                                                                  |
|                                      ▼                                                                  |
|  [ CLEAN ACH DIRECT DEPOSIT TO IAN ]                                                                    |
|  Net payout deposited weekly. Zero tax filings, zero accounting headaches, 95% net profit.              |
|                                                                                                         |
+---------------------------------------------------------------------------------------------------------+
```

---

## 2. The 5 High-Margin Tiers Tailored for Hosted Siliquarium

Siliquarium's architecture combines client-side browser execution with the autonomous Node.js **`HeadlessSimulationHost`** (`src/server/HeadlessSimulationHost.ts`) and Server-Sent Events (SSE). This unlocks a five-tier monetization ladder targeting casual hobbyists, competitive simulation gamers, bio-hackers, and academic institutions.

```
+---------------------------------------------------------------------------------------------------------+
|                                      SILIQUARIUM MONETIZATION LADDER                                    |
+---------------------------------------------------------------------------------------------------------+
|                                                                                                         |
|  TIER 1: FREE COMMUNITY WEB LAB ($0)                                                                    |
|  * Immediate zero-friction in-browser simulation (radius 5)                                             |
|  * 100% open access to 12-Volume Curriculum & 154 Primary Citations                                     |
|  * Circuit Microscope & 4 Histological Shaders (GFP, DAPI, Flux, PMF)                                   |
|  * Local single-session execution (top-of-funnel viral acquisition)                                      |
|                                                                                                         |
|  TIER 2: SILIQUARIUM LABORATORY PRO PASS ($34.99 One-Time Lifetime or $7.00/Month Hosted SaaS)          |
|  * 24/7 Persistent Headless Cloud Simulation (runs 100,000+ ticks with laptop closed)                   |
|  * Massive Seafloor Worlds (radius up to 15; 9x basalt pore capacity)                                   |
|  * Cloud Snapshot Vault (.silisave auto-backup & cross-device state sync)                               |
|  * Real-Time SSE Telemetry Streaming to Desktop & Mobile viewports                                      |
|  * Custom Abyssal Environment Editor (caldera topography, pulse tuning, toxic shock controls)          |
|  * High-Res 4K Kinematics Video & Multi-Lineage Phylogenetic Flight Recorder Data Exporters            |
|                                                                                                         |
|  TIER 3: "THE ABYSSAL ARENA" GLADIATORIAL BATTLER ($9.99 Pack / $19.99 Season Pass)                     |
|  * Gamified non-equilibrium competitive arena (Sulfur Caldera, Midnight Gauntlet, Toxic Geyser)         |
|  * Head-to-Head BioBank genome duels: trophic displacement, biomass cannibalism, survival showdowns   |
|  * Compressed shareable battle replay URLs (siliquarium.com/#arena=replay...)                           |
|  * Global Leaderboards: Longevity, Energy Harvested, Reproductive Progeny, Gate Parsimony               |
|  * Creator Tournament Suite (YouTubers/streamers host subscriber-submitted genome tournaments)          |
|                                                                                                         |
|  TIER 4: THE DARWINIAN BIOCOMPUTING MASTER BUNDLE ($69.99 – $89.99 One-Time)                            |
|  * BooleanGA (Directed Evolution CAD: Nand2Tetris Hack ALU, RAM latches, CPU netlists)                 |
|    + Siliquarium Laboratory Pro (Undirected Evolution: Abiogenesis & Hydrothermal Autopoiesis)          |
|  * The definitive realization of Richard Dawkins's dual evolutionary framework                          |
|  * 24 Combined Textbook Volumes & Unified Pro License Key across both platforms                         |
|                                                                                                         |
|  TIER 5: UNIVERSITY & DEPARTMENTAL SITE LICENSE ($499/Year or $1,499 Perpetual)                         |
|  * Dedicated On-Premise / Cloud Docker Container for HeadlessSimulationHost                             |
|  * Multi-Student Concurrent SSE Classroom Observation                                                   |
|  * Complete 5-Practicum 90-Minute Laboratory Manual & Socratic Seminar Guides                           |
|  * Automated Student Experiment Verification & Grading Harness                                          |
|  * Net-30 Invoicing, Official Purchase Orders & IRS W-9 Support                                         |
|                                                                                                         |
+---------------------------------------------------------------------------------------------------------+
```

### Detailed Tier Breakdown:

| Feature Dimension | Tier 1: Free Community | Tier 2: Laboratory Pro | Tier 3: Abyssal Arena | Tier 4: Master Bundle | Tier 5: University License |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Price Point** | **$0.00** | **$34.99 lifetime** (or $7/mo) | **$9.99 / $19.99** | **$69.99 – $89.99** | **$499 / $1,499** |
| **Simulation Host** | Client Browser Tab | Headless Server (24/7) | Headless Server Arena | Client + Server | Dedicated Institutional Server |
| **World Scale** | Radius 5 (91 pores) | Radius 15 (469 pores) | Standardized Arenas | Radius 15 + BooleanGA | Radius 20+ (Custom Scaled) |
| **Continuous Epochs** | Tab Active Only | 100,000+ Ticks in Cloud | Match-based (5k ticks) | 100,000+ Ticks | Multi-Semester Persistence |
| **State Persistence** | Session Memory | Cloud `.silisave` Vault | Replay String Archives | Cloud Vault | Central Campus Repository |
| **Curriculum Access** | Full 12 Volumes (Free) | Full 12 Volumes | Arena Battle Manual | All 24 Combined Vols | Full Suite + Grading Rubrics |
| **Arena Battler Access** | Spectator Only | 3 Practice Matches | Unlimited Arena / League | Unlimited Arena | Campus Tournament Mode |
| **Hardware / ASIC Netlist**| N/A | N/A | N/A | Included (BooleanGA) | Included (Both Suites) |
| **Payment Method** | Free Instant Access | Lemon Squeezy MoR | Lemon Squeezy MoR | Lemon Squeezy MoR | Credit Card, Wire, or Net-30 PO |

### 2.1 The Asymmetric Hybrid Architecture: Why This Model Generates >90% Margins Without Server Bankruptcy

Many founders bankrupt themselves by building client-server applications where every free user triggers a backend server container (e.g. 100,000 visitors × $0.05 compute = $5,000 AWS bill). 

Siliquarium avoids this trap through an **Asymmetric Hybrid Architecture**:

```
+---------------------------------------------------------------------------------------------------------+
|                                    THE ASYMMETRIC HYBRID ARCHITECTURE                                   |
+---------------------------------------------------------------------------------------------------------+
|                                                                                                         |
|  [ 1. LOCAL IN-BROWSER MODE (FREE TIER) ]               [ 2. AUTONOMOUS HEADLESS HOST (PRO/INSTITUTION) ]|
|  * 100% Client-Side Web Workers + WebGL                  * Node.js HeadlessSimulationHost (scripts/serve.mjs)    |
|  * Static assets served via Cloudflare Pages CDN         * 24/7 background evolution (100,000+ ticks)   |
|  * Visitor's own laptop CPU/GPU executes simulation      * Massive hex lattices (radius 15-20+, 469+ pores) |
|  * Zero server physics calculations                      * Multi-user Server-Sent Events (SSE) streaming|
|                                                                                                         |
|                     │                                                         │                         |
|                     ▼                                                         ▼                         |
|        [ IAN'S CLOUD COMPUTE BILL ]                               [ WHO PAYS FOR THE COMPUTE? ]         |
|              $0.00 PER MONTH                                            THE CUSTOMER!                   |
|                                                                                                         |
+---------------------------------------------------------------------------------------------------------+
```

#### Who Pays for Compute Across the 4 Deployment Models?
1. **Model A: In-Browser Free Lab ($0 / Free Funnel):**  
   Runs on the visitor's device. Cloudflare Pages serves the static files with **unlimited free bandwidth**. Ian's compute cost for 500,000 viral visitors is **$0.00**.
2. **Model B: Local Workstation Pro ($34.99 Pro Pass):**  
   Bio-hackers and researchers run `node scripts/serve.mjs` on their **own** laptop or home workstation. Their machine does the heavy simulation; the web UI connects to `localhost:3000` via SSE. Ian collects $34.99; compute cost to Ian: **$0.00**.
3. **Model C: University Site License ($499–$1,499/year):**  
   The university IT department deploys our Docker container onto their **own campus server cluster**. 100+ students stream simulations simultaneously. The university pays their own IT and electricity bills; Ian collects recurring software license fees.
4. **Model D: Managed Cloud SaaS ($7/month or Pro Pass):**  
   If you choose to offer hosted cloud instances on a VPS (Hetzner, Fly.io, or Railway), our **Sparse Active Pore Engine** is so fast ($O(N_{\text{active}})$ execution) that a single $10–$20/mo server hosts dozens of concurrent simulations. The customer's $7/mo subscription easily covers compute with **85%–95% net margins**.

---

## 3. "The Abyssal Arena": Gamification, Virality & Social Dynamics

The greatest engine of organic software growth is **competition and social comparison**. While solitary simulation is deeply educational, pitting evolved genomes against each other in a public gladiator ring creates irresistible drama and social virality.

### 3.1 Arena Mechanics: The Battle of the Silicoids
1. **The Inoculation Gate:** A user selects two strains from their `BioBank` (e.g., an ancestral Generation 0 generalist vs. an evolved Generation 15,000 specialist, or their own strain vs. a friend's strain).
2. **The Standardized Biotic Environment:** Battles take place on standardized, sealed hydrothermal arenas:
   - **The Sulfur Caldera:** Extreme temperature; rapid, narrow pulses of Streams A and B. High Landauer toggle penalties. Favors ultra-efficient, parsimonious circuits.
   - **The Midnight Gauntlet:** Scanty, unpredictable nutrient pulses; high basalt competition. Favors motility (treadmilling) and syncytial cytoplasm sharing.
   - **The Toxic Geyser:** Violently oscillating surges of lethal Stream T. Silicoids without functional `NOT`-gate shields or coherent feed-forward loops (C-FFLs) undergo rapid thermal lysis.
3. **The Victory Conditions:**
   - **Total Competitive Exclusion:** Complete extinction of the rival clade (trophic starvation or competitive displacement).
   - **Biomass Supremacy:** Highest living cell count at Epoch 5,000.
   - **Metabolic Superiority:** Maximum net energy tokens harvested per unit Landauer heat dissipated.

### 3.2 Viral Sharing & Spectator Replays
- At the end of every Arena duel, Siliquarium automatically compiles a lightweight, compressed match log into a URL fragment:  
  `https://siliquarium.ianohlander.com/#arena=v1_e82a9...`
- When clicked, this link instantly loads the exact match playback in any browser, rendering the clash of clades with color-coded histological overlays.
- A prominent button allows users to share the replay directly to X (Twitter), Reddit, or Discord:  
  *"My 4-gate Silicoid just wiped out an 8-gate complex clade in The Sulfur Caldera! Watch the replay: [link]"*

### 3.3 "The Geothermal Commander" CCG: Tactical Action Deck & The 5-Substrate Resource Well

To turn passive observation into an active, strategic game that hooks simulation enthusiasts and CCG players, Siliquarium features **"The Geothermal Commander"**—a tactical card-driven intervention layer where commanders manipulate the abyssal environment in real-time.

#### The 5-Substrate Resource Well
Unlike primitive artificial life models with a single generic "food" variable, Siliquarium models a rich, realistic prebiotic geochemical soup:
1. **Substrate A (Hydrothermal Proton Stream, $H^+$):** Acidic, reduced fluid driving primary Mitchell proton motive force (PMF).
2. **Substrate B (Alkaline Electron Acceptor, $OH^-$):** Ambient alkaline deep-sea fluid serving as terminal electron sink for redox coupling.
3. **Substrate C (Refractory Pyrophosphate / Methane):** Lenski Cit+ analog; high-enthalpy carbon/phosphorus donor catabolized exclusively by organisms expressing `PORIN_STREAM_C` (+3 catalytic energy yield).
4. **Substrate D (Ammonia & Nitrogen Donor, $NH_3$):** Prebiotic nitrogen source catabolized by `PORIN_STREAM_D` (+2 catalytic energy yield, +1 matter token for accelerated cellular division).
5. **Mineral M (Basalt Rock Matrix):** Solid geological substrate solubilized into bioavailable matter tokens (+1 matter) when cells secrete extracellular siderophore chelators (`SECRETION_CHELATOR`).

#### Thermal Action Points (TAP) Mana & The 7-Card Action Deck
Players manage a regenerable **Thermal Action Points (TAP)** mana pool (100 TAP cap, regenerating +5 TAP every 10 ticks). Players play environmental intervention cards from a tactical hand to assist their clade or disrupt rivals—while all actions strictly obey First-Law energy and mass conservation:

| Card Name | TAP Cost | Tactical Effect & Biophysical Impact | Strategic Clade Counter |
| :--- | :---: | :--- | :--- |
| **Substrate C Bloom** | 25 TAP | Injects global pyrophosphate plume for 30 ticks; supercharges organisms expressing `PORIN_STREAM_C` (+3 energy). | Rapidly fuels Cit+ specialist clades over generalists. |
| **Substrate D Bloom** | 30 TAP | Injects ammonia plume; provides nitrogen donors (+2 energy, +1 matter) to accelerate reproduction. | Catalyzes rapid biomass expansion before rival reaches division threshold. |
| **Acoustic Cavitation Shock** | 20 TAP | Triggers high-amplitude infrasound pressure wave; forces sensory porin transitions (`PORIN_BARO_ACOUSTIC`), draining rival energy via Landauer switching costs ($1\text{ token}$/flip) and shearing unshielded membranes. | Drains energy from complex, high-gate rival clades. |
| **Photon Flare** | 15 TAP | Emits thermal blackbody infrared radiation pulse (`PORIN_PHOTON_IR`); triggers anticipatory feed-forward loops (C-FFLs) in adapted clades before chemical flux arrives. | Pre-activates metabolic gates in anticipatory lineages. |
| **Siderophore Rain** | 35 TAP | Blankets epicenter coordinate in synthetic chelating ligands; accelerates basalt rock solubilization into matter tokens (+1 matter). | Grants benthic clades rapid matter without waiting for division lag. |
| **Tidal Inversion** | 40 TAP | Flips hydrothermal convection current vectors; sweeps pelagic spores across the lattice into rival basalt niches. | Disrupts clustered rival colonies via long-distance advection. |
| **Acid Purge** | 50 TAP | Floods targeted caldera zone with lethal heavy-metal Stream T toxin; destroys any organism lacking an antitoxin `NOT`-gate shield or allosteric repressor. | Decimates unshielded monolithic competitors. |

#### Monetization Hook: Arena Card Expansion Packs
- The Base Community edition provides 3 starter cards.
- **The Geothermal Commander Expansion Pass ($9.99)** unlocks all 7 tactical cards, custom deck-building loadouts, and ranked gladiatorial match matchmaking.
- Tournaments and seasonal events keep engagement high, with users sharing tournament replay links across social channels.

---

## 4. Technical Implementation: Lemon Squeezy Storefront & Verification

Integrating Lemon Squeezy takes under two hours and requires zero external database dependencies.

### Step 1: Embed Lemon.js in `index.html`
Add the Lemon Squeezy checkout script to the `<head>` of `index.html`:

```html
<!-- Lemon Squeezy Turnkey Checkout Overlay -->
<script src="https://assets.lemonsqueezy.com/lemon.js" defer></script>
```

### Step 2: Wire the Pro Checkout Triggers
In your header, settings drawer, and arena battle modal, attach Lemon Squeezy checkout triggers:

```html
<!-- Laboratory Pro Pass Checkout Button -->
<a href="https://ianohlander.lemonsqueezy.com/buy/PRO_PASS_VARIANT_ID?embed=1" 
   class="lemonsqueezy-button bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold px-4 py-2 rounded-lg shadow transition">
  ⚡ Unlock Laboratory Pro ($34.99)
</a>

<!-- Abyssal Arena Pass Checkout Button -->
<a href="https://ianohlander.lemonsqueezy.com/buy/ARENA_PASS_VARIANT_ID?embed=1" 
   class="lemonsqueezy-button bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-4 py-2 rounded-lg shadow transition">
  ⚔️ Enter Abyssal Arena ($9.99)
</a>

<!-- The Darwinian Master Bundle Button -->
<a href="https://ianohlander.lemonsqueezy.com/buy/MASTER_BUNDLE_VARIANT_ID?embed=1" 
   class="lemonsqueezy-button bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold px-4 py-2 rounded-lg shadow transition">
  🧬 Master Bundle: BooleanGA + Siliquarium ($69.99)
</a>
```

### Step 3: Client-Side License Verification Pattern (`LicenseManager.ts`)
Create a lightweight, resilient client-side license manager that verifies keys against Lemon Squeezy’s public validation endpoint and caches the result locally:

```typescript
/**
 * 🐠 Siliquarium License Management Subsystem
 * Validates cryptographic license keys via Lemon Squeezy API
 * and enables offline persistence in localStorage.
 */

export interface ILicenseStatus {
  readonly isValid: boolean;
  readonly tier: 'community' | 'pro' | 'arena' | 'master' | 'campus';
  readonly customerName?: string;
  readonly licenseKey?: string;
  readonly expiresAt?: string;
}

export class LicenseManager {
  private static readonly STORAGE_KEY = 'siliquarium_license_token';
  private static readonly API_ENDPOINT = 'https://api.lemonsqueezy.com/v1/licenses/validate';

  public static async validateKey(licenseKey: string): Promise<ILicenseStatus> {
    const trimmed = licenseKey.trim();
    if (!trimmed) {
      return { isValid: false, tier: 'community' };
    }

    try {
      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ license_key: trimmed })
      });

      const data = await response.json();

      if (data.valid) {
        const productName = data.meta?.product_name?.toLowerCase() || '';
        let tier: ILicenseStatus['tier'] = 'pro';

        if (productName.includes('master')) tier = 'master';
        else if (productName.includes('arena')) tier = 'arena';
        else if (productName.includes('site') || productName.includes('campus')) tier = 'campus';

        const status: ILicenseStatus = {
          isValid: true,
          tier,
          customerName: data.meta?.customer_name,
          licenseKey: trimmed,
          expiresAt: data.license_key?.expires_at
        };

        // Cache valid license token locally
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(status));
        return status;
      }
    } catch (err) {
      console.warn('[LicenseManager] Network error during validation; checking cache', err);
    }

    // Fallback: Check cached validation token
    const cached = localStorage.getItem(this.STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.licenseKey === trimmed && parsed.isValid) {
          return parsed;
        }
      } catch (e) {
        // invalid cache
      }
    }

    return { isValid: false, tier: 'community' };
  }

  public static getActiveStatus(): ILicenseStatus {
    const cached = localStorage.getItem(this.STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return { isValid: false, tier: 'community' };
  }
}
```

---

## 5. University Procurement: Selling Institutional Site Licenses ($499 – $1,499)

Academic institutions represent high-margin, sticky revenue, but professors rarely pay with corporate credit cards. They operate via departmental budgets, purchase orders (POs), and Net-30 invoicing.

### The Institutional Procurement Workflow:
1. **The Inbound Inquiry:** A professor of Systems Biology or Computer Science uses the free simulator in class and wants campus-wide deployment.
2. **The Quote & W-9 Generation:** You provide an official quote ($499/year for up to 500 students or $1,499 for perpetual department license) alongside a standard IRS Form W-9 (available pre-filled in your records).
3. **The Purchase Order (PO):** The university procurement office issues a PO number (e.g., `PO-NAU-2026-9481`).
4. **License Activation:** You issue a dedicated Institutional License Key configured in Lemon Squeezy with 500 activations.
5. **Net-30 Invoice Payment:** The university wires the payment or mails a corporate check within 30 days.

### Standard Institutional Quote Template:

```text
================================================================================
INSTITUTIONAL QUOTE / STATEMENT OF WORK: SILIQUARIUM ACADEMIC LICENSE
================================================================================

Date: October 2026
Vendor: Ian Ohlander / Siliquarium Commercial Operations
Product: Siliquarium Institutional Site License & Headless Simulation Server
Billing Cycle: Annual Subscription ($499.00 USD) or Perpetual ($1,499.00 USD)

Deliverables:
1. Campus-Wide Unlimited Student Access to Siliquarium Laboratory Pro.
2. Dockerized HeadlessSimulationHost Server Container for on-premise lab hosting.
3. Complete 5-Practicum 90-Minute Undergraduate Systems Biology Lab Manual.
4. Auto-Grading Harness & Student Verification Checkpoint Scripts.
5. Socratic Seminar Instructor Guide & Primary Literature Companion.
6. Multi-Seat Institutional License Key (up to 500 concurrent activations).

Payment Terms: Net 30 Days from invoice issuance.
Remittance: ACH Bank Transfer, University Purchasing Card, or Official Check.
W-9 Form: Furnished upon request.

Authorized Signature: Ian Ohlander, Chief Architect
================================================================================
```

---

## 6. Summary: Your Turnkey Launch Plan

1. **Sign up at Lemon Squeezy** (takes 10 minutes).
2. **Create the 5 products** ($34.99 Pro, $9.99 Arena, $69.99 Master Bundle, $499 University).
3. **Drop the Lemon.js embed into `index.html`**.
4. **Collect 95% net margins** deposited directly to your bank account with zero sales tax liability.

Next, read **[02_POSITIONING_AND_MESSAGING_BIBLE.md](02_POSITIONING_AND_MESSAGING_BIBLE.md)** to see the exact copy, elevator pitches, and Richard Dawkins narrative that converts visitors into paying customers.
