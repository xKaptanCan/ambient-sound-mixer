// ===================================
// ZENITH AMBIENT - BREATHING EXERCISES
// Guided breathing with visual animation
// ===================================

// Breathing techniques
const BREATHING_TECHNIQUES = {
    '4-7-8': {
        i18nKey: 'breath.478',
        icon: '😌',
        phases: [
            { key: 'breath.phase.inhale', duration: 4, color: '#22c55e' },
            { key: 'breath.phase.hold', duration: 7, color: '#3b82f6' },
            { key: 'breath.phase.exhale', duration: 8, color: '#8b5cf6' }
        ],
        totalCycles: 4
    },
    'box': {
        i18nKey: 'breath.box',
        icon: '📦',
        phases: [
            { key: 'breath.phase.inhale', duration: 4, color: '#22c55e' },
            { key: 'breath.phase.hold', duration: 4, color: '#3b82f6' },
            { key: 'breath.phase.exhale', duration: 4, color: '#8b5cf6' },
            { key: 'breath.phase.hold', duration: 4, color: '#f59e0b' }
        ],
        totalCycles: 4
    },
    'deep': {
        i18nKey: 'breath.deep',
        icon: '🌊',
        phases: [
            { key: 'breath.phase.inhale', duration: 5, color: '#22c55e' },
            { key: 'breath.phase.exhale', duration: 5, color: '#8b5cf6' }
        ],
        totalCycles: 6
    },
    'energizing': {
        i18nKey: 'breath.energizing',
        icon: '⚡',
        phases: [
            { key: 'breath.phase.inhale', duration: 2, color: '#f59e0b' },
            { key: 'breath.phase.exhale', duration: 2, color: '#ef4444' }
        ],
        totalCycles: 10
    }
};

class BreathingExercise {
    constructor() {
        this.isActive = false;
        this.currentTechnique = null;
        this.currentPhase = 0;
        this.currentCycle = 0;
        this.phaseTimer = null;
        this.countdownTimer = null;
        this.countdown = 0;
        this.modal = null;
        this.circle = null;
        this.phaseLabel = null;
        this.countdownLabel = null;
        this.cycleLabel = null;
    }

    init() {
        this.createModal();
    }

    createModal() {
        // Create breathing modal
        this.modal = document.createElement('div');
        this.modal.id = 'breathing-modal';
        this.modal.className = 'modal breathing-modal';
        this.modal.innerHTML = `
            <div class="modal-content breathing-content">
                <button class="btn-close breathing-close" id="close-breathing">×</button>
                
                <div class="breathing-select" id="breathing-select">
                    <h2>🧘 ${i18n.t('breath.title', 'Nefes Egzersizi')}</h2>
                    <p class="breathing-intro">${i18n.t('breath.intro', 'Bir teknik seçin')}</p>
                    <div class="breathing-techniques" id="breathing-techniques"></div>
                </div>
                
                <div class="breathing-exercise" id="breathing-exercise" style="display: none;">
                    <div class="breathing-circle-container">
                        <div class="breathing-circle" id="breathing-circle">
                            <span class="breathing-phase" id="breathing-phase">${i18n.t('breath.phase.ready', 'Hazır')}</span>
                            <span class="breathing-countdown" id="breathing-countdown">0</span>
                        </div>
                    </div>
                    <div class="breathing-info">
                        <span class="breathing-technique-name" id="breathing-technique-name"></span>
                        <span class="breathing-cycle" id="breathing-cycle">${i18n.t('breath.cycle', 'Döngü')}: 0/0</span>
                    </div>
                    <div class="breathing-controls">
                        <button class="btn-secondary" id="stop-breathing">⏹ ${i18n.t('breath.stop', 'Durdur')}</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);

        // Cache elements (initial cache, some will be re-cached on startExercise)
        this.circle = this.modal.querySelector('#breathing-circle');
        this.phaseLabel = this.modal.querySelector('#breathing-phase');
        this.countdownLabel = this.modal.querySelector('#breathing-countdown');
        this.cycleLabel = this.modal.querySelector('#breathing-cycle');
        this.techniqueNameLabel = this.modal.querySelector('#breathing-technique-name');

        // Event listeners
        this.modal.querySelector('#close-breathing').addEventListener('click', () => this.stopExercise());
        this.modal.querySelector('#stop-breathing').addEventListener('click', () => this.stopExercise());

        // Close on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.stopExercise();
        });
    }

    open() {
        this.renderTechniques();
        this.modal.classList.add('open');
        this.resetView();
    }

    close() {
        this.stopExercise();
        this.modal.classList.remove('open');
    }

    resetView() {
        this.modal.querySelector('#breathing-select').style.display = 'block';
        this.modal.querySelector('#breathing-exercise').style.display = 'none';
        this.isActive = false;
        clearInterval(this.phaseTimer);
        clearInterval(this.countdownTimer);
        this.circle.className = 'breathing-circle'; // Reset circle animation
        this.circle.style.cssText = ''; // Clear inline styles
    }

    renderTechniques() {
        const container = this.modal.querySelector('#breathing-techniques');
        container.innerHTML = '';

        Object.entries(BREATHING_TECHNIQUES).forEach(([id, tech]) => {
            const card = document.createElement('div');
            card.className = 'breathing-technique-card';

            // Use i18n keys
            const name = i18n.t(`${tech.i18nKey}.name`);
            const desc = i18n.t(`${tech.i18nKey}.desc`);

            card.innerHTML = `
                <span class="breathing-technique-icon">${tech.icon}</span>
                <div class="breathing-technique-info">
                    <span class="breathing-technique-title">${name}</span>
                    <span class="breathing-technique-desc">${desc}</span>
                </div>
            `;

            card.addEventListener('click', () => this.startExercise(id));
            container.appendChild(card);
        });
    }

    startExercise(techniqueId) {
        this.currentTechnique = BREATHING_TECHNIQUES[techniqueId];
        this.currentPhase = 0;
        this.currentCycle = 1; // Start with cycle 1
        this.isActive = true;

        // Switch view
        this.modal.querySelector('#breathing-select').style.display = 'none';
        this.modal.querySelector('#breathing-exercise').style.display = 'flex';

        // Elements (re-cache in case modal was closed and re-opened)
        this.circle = this.modal.querySelector('#breathing-circle');
        this.phaseLabel = this.modal.querySelector('#breathing-phase');
        this.countdownLabel = this.modal.querySelector('#breathing-countdown');
        this.cycleLabel = this.modal.querySelector('#breathing-cycle');
        this.techniqueNameLabel = this.modal.querySelector('#breathing-technique-name');

        // Setup initial state
        const name = i18n.t(`${this.currentTechnique.i18nKey}.name`);
        this.techniqueNameLabel.textContent = name;
        this.updateCycleLabel();

        // Prepare
        this.phaseLabel.textContent = i18n.t('breath.prepare', 'Hazırlan...');
        this.countdownLabel.textContent = '3';
        this.circle.className = 'breathing-circle'; // reset classes
        this.circle.style.cssText = ''; // Clear inline styles

        let prep = 3;
        const prepTimer = setInterval(() => {
            prep--;
            if (prep > 0) {
                this.countdownLabel.textContent = prep;
            } else {
                clearInterval(prepTimer);
                this.runPhase();
            }
        }, 1000);
    }

    runPhase() {
        if (!this.isActive) return;

        const phase = this.currentTechnique.phases[this.currentPhase];

        // Update UI
        this.phaseLabel.textContent = i18n.t(phase.key); // Use key for phase name
        this.countdownLabel.textContent = phase.duration;
        this.circle.style.borderColor = phase.color;
        this.circle.style.boxShadow = `0 0 30px ${phase.color}40`;

        // Animation class
        this.circle.className = 'breathing-circle'; // Reset classes
        this.circle.style.transitionDuration = `${phase.duration}s`; // Set transition duration

        // Add specific class based on phase type (heuristic: inhale=expand, exhale=contract)
        if (phase.key.includes('inhale')) {
            this.circle.classList.add('inhale');
            this.circle.style.transform = 'scale(1.5)';
        } else if (phase.key.includes('exhale')) {
            this.circle.classList.add('exhale');
            this.circle.style.transform = 'scale(1)';
        } else { // Hold
            this.circle.classList.add('hold');
            // For hold, maintain current scale or apply a subtle pulse
            // If coming from inhale, it's already at 1.5, if from exhale, it's at 1
            // Let's assume it holds its current state or a slight pulse
            // For simplicity, we'll just ensure it doesn't animate scale during hold
            this.circle.style.transitionDuration = '0.5s'; // Quick transition to hold state
        }

        let timeLeft = phase.duration;
        this.phaseTimer = setInterval(() => {
            timeLeft--;
            if (timeLeft >= 0) {
                this.countdownLabel.textContent = timeLeft;
            } else {
                clearInterval(this.phaseTimer);
                this.nextPhase();
            }
        }, 1000);
    }

    nextPhase() {
        if (!this.isActive) return; // Ensure exercise is still active

        this.currentPhase++;
        if (this.currentPhase >= this.currentTechnique.phases.length) {
            this.currentPhase = 0;
            this.currentCycle++;

            if (this.currentCycle > this.currentTechnique.totalCycles) {
                this.completeExercise();
                return;
            }
            this.updateCycleLabel();
        }
        this.runPhase();
    }

    updateCycleLabel() {
        this.cycleLabel.textContent = `${i18n.t('breath.cycle', 'Döngü')}: ${this.currentCycle}/${this.currentTechnique.totalCycles}`;
    }

    completeExercise() {
        this.isActive = false;
        clearInterval(this.phaseTimer); // Clear any active phase timer
        clearInterval(this.countdownTimer); // Clear any active countdown timer (though phaseTimer should cover it)

        this.circle.className = 'breathing-circle completed';
        this.circle.style.cssText = ''; // Clear inline styles for animation
        this.phaseLabel.textContent = '✓';
        this.countdownLabel.textContent = '';

        if (typeof achievementsManager !== 'undefined') {
            achievementsManager.trackBreathingCompleted();
        }

        if (typeof app !== 'undefined') {
            app.showToast(i18n.t('breath.toast.complete', 'Egzersiz tamamlandı!'));
        }

        setTimeout(() => {
            this.stopExercise(); // This will call resetView and close the modal if needed
        }, 2000);
    }

    stopExercise() {
        this.isActive = false;
        clearInterval(this.countdownTimer);
        clearInterval(this.phaseTimer);

        this.circle.style.transform = 'scale(1)';
        this.circle.style.transition = 'transform 0.3s ease';

        this.resetView();
        this.modal.classList.remove('open');
    }
}

// Create global instance
const breathingExercise = new BreathingExercise();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    breathingExercise.init();
});

// Export
window.breathingExercise = breathingExercise;
window.BREATHING_TECHNIQUES = BREATHING_TECHNIQUES;
