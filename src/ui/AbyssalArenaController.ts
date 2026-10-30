/**
 * 🐠 Siliquarium UI Subsystem
 * AbyssalArenaController: High-Octane Gamer-Native Arena HUD & Tactical Action Deck.
 * Manages Clade Tug-of-War bar, TAP Mana pressure valve, 7-card tactical hand,
 * scrolling arcade combat log, creature trait badges, and match win/loss lifecycle.
 */

import { SimulationWorld } from '../engine/SimulationWorld.js';
import { ISimulationTelemetry } from '../engine/SimulationTelemetry.js';
import { AudioSynthesizer } from './AudioSynthesizer.js';

export interface ITacticalCard {
  readonly id: string;
  readonly name: string;
  readonly cost: number;
  readonly icon: string;
  readonly tag: string;
  readonly description: string;
  readonly color: string;
}

export const TACTICAL_ARENA_CARDS: readonly ITacticalCard[] = Object.freeze([
  {
    id: 'SUBSTRATE_C_BLOOM',
    name: 'Substrate C Bloom',
    cost: 25,
    icon: '🧪',
    tag: 'METABOLIC',
    description: 'Floods caldera with pyrophosphate; supercharges Cit+ clades (+3 Energy).',
    color: '#06b6d4'
  },
  {
    id: 'SUBSTRATE_D_BLOOM',
    name: 'Substrate D Bloom',
    cost: 30,
    icon: '🧬',
    tag: 'ASSIMILATION',
    description: 'Prebiotic ammonia surge; provides nitrogen (+2 Energy, +1 Matter).',
    color: '#10b981'
  },
  {
    id: 'ACOUSTIC_CAVITATION_SHOCK',
    name: 'Acoustic Shock',
    cost: 20,
    icon: '🔊',
    tag: 'DISRUPTION',
    description: 'Infrasound cavitation wave; forces Landauer taxes on complex rivals.',
    color: '#f59e0b'
  },
  {
    id: 'PHOTON_FLARE',
    name: 'Photon Flare',
    cost: 15,
    icon: '⚡',
    tag: 'SENSORY',
    description: 'Blackbody thermal IR flash; pre-activates anticipatory C-FFL gates.',
    color: '#eab308'
  },
  {
    id: 'SIDEROPHORE_RAIN',
    name: 'Siderophore Rain',
    cost: 35,
    icon: '🌧️',
    tag: 'MINERAL',
    description: 'Synthetic chelator shower; solubilizes basalt rock into +1 Matter.',
    color: '#8b5cf6'
  },
  {
    id: 'TIDAL_INVERSION',
    name: 'Tidal Inversion',
    cost: 40,
    icon: '🌊',
    tag: 'CURRENT',
    description: 'Shears benthic currents; scatters pelagic spores across enemy territory.',
    color: '#3b82f6'
  },
  {
    id: 'ACID_PURGE',
    name: 'Acid Purge',
    cost: 50,
    icon: '☣️',
    tag: 'CATACLYSM',
    description: 'Lethal heavy-metal Stream T surge; incinerates unshielded competitors.',
    color: '#ef4444'
  }
]);

export class AbyssalArenaController {
  private readonly world: SimulationWorld;
  private readonly audio?: AudioSynthesizer;
  private tapMana: number = 60;
  private readonly MAX_TAP: number = 100;
  private matchDurationSeconds: number = 180;
  private matchTimeRemaining: number = 180;
  private isMatchRunning: boolean = false;
  private matchInterval?: ReturnType<typeof setInterval>;

  private redCladeName: string = 'Clade Ignis';
  private blueCladeName: string = 'Clade Cryo';
  private redCladeId: string | null = null;
  private blueCladeId: string | null = null;
  private redCellCount: number = 0;
  private blueCellCount: number = 0;

  // DOM Elements
  private container: HTMLElement | null = null;
  private tapValEl: HTMLElement | null = null;
  private tapMeterEl: HTMLElement | null = null;
  private cardsContainer: HTMLElement | null = null;
  private combatFeedEl: HTMLElement | null = null;
  private tugBarRed: HTMLElement | null = null;
  private tugBarBlue: HTMLElement | null = null;
  private tugLabelRed: HTMLElement | null = null;
  private tugLabelBlue: HTMLElement | null = null;
  private timerEl: HTMLElement | null = null;
  private duelBtn: HTMLElement | null = null;
  private resetBtn: HTMLElement | null = null;
  private victoryModal: HTMLElement | null = null;
  private victoryTitle: HTMLElement | null = null;
  private victoryDesc: HTMLElement | null = null;

  constructor(world: SimulationWorld, audio?: AudioSynthesizer) {
    this.world = world;
    this.audio = audio;
    this.initDOM();
  }

  private initDOM(): void {
    this.container = document.getElementById('abyssal-arena-hud');
    this.tapValEl = document.getElementById('arena-tap-val');
    this.tapMeterEl = document.getElementById('arena-tap-meter-fill');
    this.cardsContainer = document.getElementById('arena-cards-row');
    this.combatFeedEl = document.getElementById('arena-combat-feed-list');
    this.tugBarRed = document.getElementById('arena-tug-red');
    this.tugBarBlue = document.getElementById('arena-tug-blue');
    this.tugLabelRed = document.getElementById('arena-tug-label-red');
    this.tugLabelBlue = document.getElementById('arena-tug-label-blue');
    this.timerEl = document.getElementById('arena-match-timer');
    this.duelBtn = document.getElementById('btn-arena-start-duel');
    this.resetBtn = document.getElementById('btn-arena-reset-match');
    this.victoryModal = document.getElementById('arena-victory-modal');
    this.victoryTitle = document.getElementById('arena-victory-title');
    this.victoryDesc = document.getElementById('arena-victory-desc');

    this.renderTacticalCards();
    this.bindEvents();
    this.updateManaDisplay();
  }

  private bindEvents(): void {
    this.duelBtn?.addEventListener('click', () => {
      if (this.isMatchRunning) {
        this.pauseMatch();
      } else {
        this.startMatch();
      }
    });

    this.resetBtn?.addEventListener('click', () => this.resetMatch());

    const closeVicBtn = document.getElementById('btn-arena-vic-close');
    closeVicBtn?.addEventListener('click', () => {
      this.victoryModal?.classList.add('hidden');
    });

    const rematchBtn = document.getElementById('btn-arena-vic-rematch');
    rematchBtn?.addEventListener('click', () => {
      this.victoryModal?.classList.add('hidden');
      this.resetMatch();
      this.startMatch();
    });
  }

  private renderTacticalCards(): void {
    if (!this.cardsContainer) return;
    this.cardsContainer.innerHTML = '';

    TACTICAL_ARENA_CARDS.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.className = 'arena-card';
      cardEl.id = `card-${card.id}`;
      cardEl.setAttribute('data-card-id', card.id);
      cardEl.setAttribute('data-cost', card.cost.toString());

      cardEl.innerHTML = `
        <div class="card-header">
          <span class="card-cost" style="border-color: ${card.color}">${card.cost} TAP</span>
          <span class="card-tag" style="color: ${card.color}">${card.tag}</span>
        </div>
        <div class="card-icon-wrap" style="text-shadow: 0 0 16px ${card.color}">
          <span class="card-icon">${card.icon}</span>
        </div>
        <div class="card-title">${card.name}</div>
        <div class="card-desc">${card.description}</div>
        <button class="card-play-btn" style="background: ${card.color}">DEPLOY</button>
      `;

      cardEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.playCard(card);
      });

      this.cardsContainer?.appendChild(cardEl);
    });
  }

  public playCard(card: ITacticalCard): boolean {
    if (this.tapMana < card.cost) {
      this.pushCombatFeed(`⚠️ Insufficient TAP mana for ${card.name}! (${this.tapMana}/${card.cost})`, 'warning');
      this.flashManaError();
      return false;
    }

    // Deduct mana
    this.tapMana -= card.cost;
    this.updateManaDisplay();

    // Trigger environmental action on biophysical world
    const success = this.world.triggerEnvironmentalAction(card.id, undefined, card.cost);
    if (!success) {
      this.tapMana += card.cost; // Refund on failure
      this.updateManaDisplay();
      return false;
    }

    // Sound and combat feedback
    try {
      this.audio?.playMilestoneDiscovery();
    } catch {
      // Audio optional
    }

    this.pushCombatFeed(`⚡ COMMANDER DEPLOYED [${card.name}] (-${card.cost} TAP)`, 'action');
    this.flashCardPlayed(card.id);
    return true;
  }

  private flashCardPlayed(cardId: string): void {
    const el = document.getElementById(`card-${cardId}`);
    if (!el) return;
    el.classList.add('card-played-flash');
    setTimeout(() => el.classList.remove('card-played-flash'), 600);
  }

  private flashManaError(): void {
    if (!this.tapValEl) return;
    this.tapValEl.classList.add('mana-error-flash');
    setTimeout(() => this.tapValEl?.classList.remove('mana-error-flash'), 400);
  }

  public update(telemetry: ISimulationTelemetry): void {
    // Regenerate TAP mana (+5 every 10 ticks)
    if (telemetry.tick % 10 === 0 && this.tapMana < this.MAX_TAP) {
      this.tapMana = Math.min(this.MAX_TAP, this.tapMana + 5);
      this.updateManaDisplay();
    }

    // Identify competing clades
    this.syncCladeMetrics(telemetry);
    this.updateTugOfWarBar();
    this.inspectRecentCombatEvents(telemetry);
    this.checkWinConditions();
  }

  public getRedCladeId(): string | null {
    return this.redCladeId;
  }

  public getBlueCladeId(): string | null {
    return this.blueCladeId;
  }

  private syncCladeMetrics(telemetry: ISimulationTelemetry): void {
    const clades = telemetry.clades || [];
    if (clades.length >= 2) {
      const sorted = [...clades].sort((a, b) => b.population - a.population);
      const topRed = sorted[0];
      const topBlue = sorted[1];
      this.redCladeId = topRed.cladeId;
      this.blueCladeId = topBlue.cladeId;
      this.redCladeName = `Clade ${topRed.cladeId.slice(0, 6)}`;
      this.blueCladeName = `Clade ${topBlue.cladeId.slice(0, 6)}`;
      this.redCellCount = topRed.population;
      this.blueCellCount = topBlue.population;
    } else if (clades.length === 1) {
      this.redCladeId = clades[0].cladeId;
      this.redCladeName = `Clade ${clades[0].cladeId.slice(0, 6)}`;
      this.redCellCount = clades[0].population;
      this.blueCellCount = 0;
    } else {
      this.redCellCount = telemetry.livingCount;
      this.blueCellCount = 0;
    }
  }

  private updateTugOfWarBar(): void {
    const total = this.redCellCount + this.blueCellCount;
    if (total <= 0) {
      if (this.tugBarRed) this.tugBarRed.style.width = '50%';
      if (this.tugBarBlue) this.tugBarBlue.style.width = '50%';
      if (this.tugLabelRed) this.tugLabelRed.textContent = `🔴 ${this.redCladeName}: 0 Cells (50%)`;
      if (this.tugLabelBlue) this.tugLabelBlue.textContent = `🔵 ${this.blueCladeName}: 0 Cells (50%)`;
      return;
    }

    const redPct = Math.round((this.redCellCount / total) * 100);
    const bluePct = 100 - redPct;

    if (this.tugBarRed) this.tugBarRed.style.width = `${redPct}%`;
    if (this.tugBarBlue) this.tugBarBlue.style.width = `${bluePct}%`;
    if (this.tugLabelRed) this.tugLabelRed.textContent = `🔴 ${this.redCladeName}: ${this.redCellCount} (${redPct}%)`;
    if (this.tugLabelBlue) this.tugLabelBlue.textContent = `🔵 ${this.blueCladeName}: ${this.blueCellCount} (${bluePct}%)`;
  }

  private inspectRecentCombatEvents(telemetry: ISimulationTelemetry): void {
    // 1. Predation events
    if (telemetry.predationEvents && telemetry.predationEvents.length > 0) {
      const latest = telemetry.predationEvents[telemetry.predationEvents.length - 1];
      if (latest && telemetry.tick % 5 === 0) {
        this.pushCombatFeed(`🩸 VAMPIRIC PHAGOCYTOSIS: Organism drained ${latest.energyDrained} energy!`, 'combat');
      }
    }

    // 2. Syntrophy cross-feeding
    if (telemetry.syntrophyEvents && telemetry.syntrophyEvents.length > 0) {
      if (telemetry.tick % 15 === 0) {
        this.pushCombatFeed(`🤝 SYNTROPHY: Paracrine cross-feeding between clades verified.`, 'info');
      }
    }
  }

  public pushCombatFeed(message: string, type: 'action' | 'combat' | 'warning' | 'info' = 'info'): void {
    if (!this.combatFeedEl) return;
    const item = document.createElement('div');
    item.className = `combat-feed-item feed-${type}`;

    const timestamp = document.createElement('span');
    timestamp.className = 'feed-time';
    timestamp.textContent = `[T+${this.world.getTickCount()}] `;

    const text = document.createElement('span');
    text.className = 'feed-text';
    text.textContent = message;

    item.appendChild(timestamp);
    item.appendChild(text);

    this.combatFeedEl.insertBefore(item, this.combatFeedEl.firstChild);

    // Keep only last 15 items
    while (this.combatFeedEl.children.length > 15) {
      this.combatFeedEl.removeChild(this.combatFeedEl.lastChild!);
    }
  }

  private updateManaDisplay(): void {
    if (this.tapValEl) {
      this.tapValEl.textContent = `${this.tapMana} / ${this.MAX_TAP} TAP`;
    }
    if (this.tapMeterEl) {
      const pct = Math.round((this.tapMana / this.MAX_TAP) * 100);
      this.tapMeterEl.style.width = `${pct}%`;
    }

    // Update individual card affordances
    TACTICAL_ARENA_CARDS.forEach(card => {
      const el = document.getElementById(`card-${card.id}`);
      if (el) {
        el.classList.toggle('card-affordable', this.tapMana >= card.cost);
        el.classList.toggle('card-locked', this.tapMana < card.cost);
      }
    });
  }

  public startMatch(durationSeconds: number = 180): void {
    this.matchDurationSeconds = durationSeconds;
    this.matchTimeRemaining = durationSeconds;
    this.isMatchRunning = true;

    if (this.duelBtn) {
      this.duelBtn.textContent = '⏸️ Pause Duel';
      this.duelBtn.classList.add('btn-active-duel');
    }

    this.pushCombatFeed(`⚔️ ARENA DUEL COMMENCED! (${this.formatTime(this.matchTimeRemaining)})`, 'action');

    clearInterval(this.matchInterval);
    this.matchInterval = setInterval(() => {
      if (!this.isMatchRunning) return;
      this.matchTimeRemaining--;
      if (this.timerEl) {
        this.timerEl.textContent = this.formatTime(this.matchTimeRemaining);
      }
      if (this.matchTimeRemaining <= 0) {
        this.finishMatch('TIME_EXPIRED');
      }
    }, 1000);
  }

  public pauseMatch(): void {
    this.isMatchRunning = false;
    if (this.duelBtn) {
      this.duelBtn.textContent = '▶️ Resume Duel';
      this.duelBtn.classList.remove('btn-active-duel');
    }
  }

  public resetMatch(): void {
    this.pauseMatch();
    clearInterval(this.matchInterval);
    this.matchTimeRemaining = this.matchDurationSeconds;
    this.tapMana = 60;
    this.updateManaDisplay();

    if (this.timerEl) {
      this.timerEl.textContent = this.formatTime(this.matchTimeRemaining);
    }
    if (this.duelBtn) {
      this.duelBtn.textContent = '⚔️ Start Blitz Duel';
    }

    this.pushCombatFeed('🔄 Arena Caldera Reset. Ready for new gladiatorial clash.', 'info');
  }

  private checkWinConditions(): void {
    if (!this.isMatchRunning) return;

    if (this.redCellCount > 0 && this.blueCellCount === 0 && this.world.getTickCount() > 50) {
      this.finishMatch('RED_VICTORY');
    } else if (this.blueCellCount > 0 && this.redCellCount === 0 && this.world.getTickCount() > 50) {
      this.finishMatch('BLUE_VICTORY');
    }
  }

  private finishMatch(reason: 'RED_VICTORY' | 'BLUE_VICTORY' | 'TIME_EXPIRED'): void {
    this.pauseMatch();
    clearInterval(this.matchInterval);

    let winner = 'DRAW';
    let summary = '';

    if (reason === 'RED_VICTORY') {
      winner = this.redCladeName;
      summary = `Total Competitive Exclusion achieved! ${this.redCladeName} wiped out all rival strains.`;
    } else if (reason === 'BLUE_VICTORY') {
      winner = this.blueCladeName;
      summary = `Total Competitive Exclusion achieved! ${this.blueCladeName} eliminated the opposing lineage.`;
    } else {
      if (this.redCellCount > this.blueCellCount) {
        winner = this.redCladeName;
        summary = `Biomass Supremacy: ${this.redCladeName} held ${this.redCellCount} living cells vs ${this.blueCellCount}.`;
      } else if (this.blueCellCount > this.redCellCount) {
        winner = this.blueCladeName;
        summary = `Biomass Supremacy: ${this.blueCladeName} held ${this.blueCellCount} living cells vs ${this.redCellCount}.`;
      } else {
        winner = 'TIED';
        summary = `Stalemate: Both clades survived with equal biomass.`;
      }
    }

    if (this.victoryTitle) {
      this.victoryTitle.textContent = winner === 'TIED' ? '⚔️ MATCH DRAW' : `🏆 ${winner.toUpperCase()} VICTORIOUS!`;
    }
    if (this.victoryDesc) {
      this.victoryDesc.textContent = summary;
    }

    this.victoryModal?.classList.remove('hidden');
    this.pushCombatFeed(`🏆 MATCH COMPLETE: ${winner} emerges victorious!`, 'action');
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  public show(): void {
    this.container?.classList.remove('hidden');
  }

  public hide(): void {
    this.container?.classList.add('hidden');
  }
}
