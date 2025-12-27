// ===================================
// ZENITH AMBIENT - STORAGE MANAGER
// ===================================

class StorageManager {
    constructor() {
        this.STORAGE_KEYS = {
            THEME: 'zenith-theme',
            LAST_STATE: 'zenith-last-state',
            SETTINGS: 'zenith-settings',
            STATS: 'zenith-stats',
            USER_PRESETS: 'zenith-user-presets'
        };

        this.stats = this.loadStats();
        this.settings = this.loadSettings();

        // Track session time
        this.sessionStartTime = Date.now();
        this.saveStatsInterval = setInterval(() => this.saveSessionTime(), 60000);
    }

    // ===== THEME =====

    saveTheme(theme) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.THEME, theme);
        } catch (e) {
            console.warn('Could not save theme', e);
        }
    }

    loadTheme() {
        try {
            return localStorage.getItem(this.STORAGE_KEYS.THEME) || 'dark';
        } catch (e) {
            return 'dark';
        }
    }

    // ===== SETTINGS =====

    saveSettings(settings) {
        try {
            this.settings = { ...this.settings, ...settings };
            localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
        } catch (e) {
            console.warn('Could not save settings', e);
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
            return saved ? JSON.parse(saved) : {
                crossfadeEnabled: true,
                meanderEnabled: false,
                fadeOutEnabled: true,
                masterVolume: 0.8,
                dayNightEnabled: false,
                language: 'tr'
            };
        } catch (e) {
            return {
                crossfadeEnabled: true,
                meanderEnabled: false,
                fadeOutEnabled: true,
                masterVolume: 0.8,
                dayNightEnabled: false,
                language: 'tr'
            };
        }
    }

    getSettings() {
        return this.settings;
    }

    // ===== LAST STATE =====

    saveLastState(state) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.LAST_STATE, JSON.stringify(state));
        } catch (e) {
            console.warn('Could not save last state', e);
        }
    }

    loadLastState() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEYS.LAST_STATE);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    }

    // ===== STATISTICS =====

    loadStats() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEYS.STATS);
            return saved ? JSON.parse(saved) : {
                totalMinutes: 0,
                sessions: 0,
                lastSession: null,
                soundUsage: {}
            };
        } catch (e) {
            return {
                totalMinutes: 0,
                sessions: 0,
                lastSession: null,
                soundUsage: {}
            };
        }
    }

    saveStats() {
        try {
            localStorage.setItem(this.STORAGE_KEYS.STATS, JSON.stringify(this.stats));
        } catch (e) {
            console.warn('Could not save stats', e);
        }
    }

    saveSessionTime() {
        const sessionMinutes = Math.floor((Date.now() - this.sessionStartTime) / 60000);
        this.stats.totalMinutes += 1; // Add 1 minute every interval
        this.stats.lastSession = new Date().toISOString();
        this.saveStats();
    }

    incrementSession() {
        this.stats.sessions++;
        this.sessionStartTime = Date.now();
        this.saveStats();
    }

    trackSoundUsage(soundId) {
        if (!this.stats.soundUsage[soundId]) {
            this.stats.soundUsage[soundId] = 0;
        }
        this.stats.soundUsage[soundId]++;
        this.saveStats();
    }

    getStats() {
        return {
            totalHours: Math.floor(this.stats.totalMinutes / 60),
            totalSessions: this.stats.sessions,
            mostUsedSounds: this.getMostUsedSounds()
        };
    }

    getMostUsedSounds() {
        const entries = Object.entries(this.stats.soundUsage);
        entries.sort((a, b) => b[1] - a[1]);
        return entries.slice(0, 5);
    }

    // ===== CLEANUP =====

    clearAll() {
        try {
            Object.values(this.STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            this.stats = this.loadStats();
            this.settings = this.loadSettings();
        } catch (e) {
            console.warn('Could not clear storage', e);
        }
    }

    destroy() {
        if (this.saveStatsInterval) {
            clearInterval(this.saveStatsInterval);
        }
    }
}

// Create and export
const storageManager = new StorageManager();
window.storageManager = storageManager;

// AutoSaveManager (for session restore)
const autoSaveManager = {
    hasSession: function () {
        return storageManager.loadLastState() !== null;
    },
    restore: async function () {
        const state = storageManager.loadLastState();
        if (state && state.sounds && typeof soundManager !== 'undefined') {
            for (const [soundId, volume] of Object.entries(state.sounds)) {
                await soundManager.play(soundId, volume);
            }
        }
    },
    clear: function () {
        localStorage.removeItem('zenith-last-state');
    },
    save: function () {
        if (typeof soundManager === 'undefined') return;
        const activeSounds = soundManager.getActiveSounds();
        const sounds = {};
        activeSounds.forEach(id => { sounds[id] = soundManager.volumes[id] || 0.5; });
        storageManager.saveLastState({ sounds, timestamp: Date.now() });
    }
};
window.autoSaveManager = autoSaveManager;

// Auto-save on sounds change
window.addEventListener('soundStarted', () => autoSaveManager.save());
window.addEventListener('soundStopped', () => autoSaveManager.save());
