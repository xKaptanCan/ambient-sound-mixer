// ===================================
// ZENITH AMBIENT - TIMER SYSTEM
// ===================================

class TimerManager {
    constructor() {
        // Sleep Timer
        this.sleepTimer = {
            isActive: false,
            remainingSeconds: 0,
            totalSeconds: 0,
            interval: null,
            fadeOutEnabled: true
        };

        // Pomodoro Timer
        this.pomodoro = {
            isActive: false,
            isBreak: false,
            remainingSeconds: 0,
            workMinutes: 25,
            breakMinutes: 5,
            sessions: 0,
            interval: null
        };

        this.onSleepTimerTick = null;
        this.onSleepTimerEnd = null;
        this.onPomodoroTick = null;
        this.onPomodoroPhaseChange = null;
    }

    // ===== SLEEP TIMER =====

    startSleepTimer(minutes) {
        this.stopSleepTimer();

        this.sleepTimer.isActive = true;
        this.sleepTimer.totalSeconds = minutes * 60;
        this.sleepTimer.remainingSeconds = this.sleepTimer.totalSeconds;

        this.sleepTimer.interval = setInterval(() => {
            this.sleepTimer.remainingSeconds--;

            if (this.onSleepTimerTick) {
                this.onSleepTimerTick(this.sleepTimer.remainingSeconds);
            }

            // Fade out in last 5 minutes if enabled
            if (this.sleepTimer.fadeOutEnabled && this.sleepTimer.remainingSeconds <= 300) {
                const fadeProgress = this.sleepTimer.remainingSeconds / 300;
                const currentMasterVolume = soundManager.masterVolume;
                const targetVolume = fadeProgress * 0.8;

                if (currentMasterVolume > targetVolume) {
                    soundManager.setMasterVolume(targetVolume);
                }
            }

            if (this.sleepTimer.remainingSeconds <= 0) {
                this.endSleepTimer();
            }
        }, 1000);

        return true;
    }

    stopSleepTimer() {
        if (this.sleepTimer.interval) {
            clearInterval(this.sleepTimer.interval);
            this.sleepTimer.interval = null;
        }
        this.sleepTimer.isActive = false;
        this.sleepTimer.remainingSeconds = 0;
    }

    endSleepTimer() {
        this.stopSleepTimer();
        soundManager.stopAll();

        if (this.onSleepTimerEnd) {
            this.onSleepTimerEnd();
        }
    }

    getSleepTimerRemaining() {
        return this.sleepTimer.remainingSeconds;
    }

    isSleepTimerActive() {
        return this.sleepTimer.isActive;
    }

    setFadeOutEnabled(enabled) {
        this.sleepTimer.fadeOutEnabled = enabled;
    }

    // ===== POMODORO TIMER =====

    startPomodoro(workMinutes = 25, breakMinutes = 5) {
        this.stopPomodoro();

        this.pomodoro.workMinutes = workMinutes;
        this.pomodoro.breakMinutes = breakMinutes;
        this.pomodoro.isActive = true;
        this.pomodoro.isBreak = false;
        this.pomodoro.remainingSeconds = workMinutes * 60;

        this.pomodoro.interval = setInterval(() => {
            this.pomodoro.remainingSeconds--;

            if (this.onPomodoroTick) {
                this.onPomodoroTick({
                    remainingSeconds: this.pomodoro.remainingSeconds,
                    isBreak: this.pomodoro.isBreak,
                    sessions: this.pomodoro.sessions
                });
            }

            if (this.pomodoro.remainingSeconds <= 0) {
                this.switchPomodoroPhase();
            }
        }, 1000);

        return true;
    }

    switchPomodoroPhase() {
        if (this.pomodoro.isBreak) {
            // Break finished, start new work session
            this.pomodoro.isBreak = false;
            this.pomodoro.remainingSeconds = this.pomodoro.workMinutes * 60;
        } else {
            // Work finished, start break
            this.pomodoro.sessions++;
            this.pomodoro.isBreak = true;
            this.pomodoro.remainingSeconds = this.pomodoro.breakMinutes * 60;
        }

        if (this.onPomodoroPhaseChange) {
            this.onPomodoroPhaseChange({
                isBreak: this.pomodoro.isBreak,
                sessions: this.pomodoro.sessions
            });
        }

        // Play notification sound
        this.playNotificationSound();
    }

    stopPomodoro() {
        if (this.pomodoro.interval) {
            clearInterval(this.pomodoro.interval);
            this.pomodoro.interval = null;
        }
        this.pomodoro.isActive = false;
    }

    resetPomodoro() {
        this.stopPomodoro();
        this.pomodoro.sessions = 0;
        this.pomodoro.isBreak = false;
        this.pomodoro.remainingSeconds = 0;
    }

    getPomodoroState() {
        return {
            isActive: this.pomodoro.isActive,
            isBreak: this.pomodoro.isBreak,
            remainingSeconds: this.pomodoro.remainingSeconds,
            sessions: this.pomodoro.sessions
        };
    }

    // ===== UTILITY =====

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    playNotificationSound() {
        // Create a simple beep using oscillator
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.value = 880;

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.warn('Could not play notification sound', e);
        }
    }
}

// Create and export
const timerManager = new TimerManager();
window.timerManager = timerManager;
