// ===================================
// ZENITH AMBIENT - KEYBOARD SHORTCUTS
// ===================================

class KeyboardManager {
    constructor() {
        this.shortcuts = new Map();
        this.isEnabled = true;
        this.modalOpen = false;

        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    handleKeydown(e) {
        // Don't trigger if typing in input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        // Don't trigger if modal open (except Escape)
        if (this.modalOpen && e.key !== 'Escape') {
            return;
        }

        if (!this.isEnabled) return;

        const key = e.key.toLowerCase();
        const callback = this.shortcuts.get(key);

        if (callback) {
            e.preventDefault();
            callback(e);
        }
    }

    register(key, callback) {
        this.shortcuts.set(key.toLowerCase(), callback);
    }

    unregister(key) {
        this.shortcuts.delete(key.toLowerCase());
    }

    enable() {
        this.isEnabled = true;
    }

    disable() {
        this.isEnabled = false;
    }

    setModalOpen(isOpen) {
        this.modalOpen = isOpen;
    }
}

// Create instance
const keyboardManager = new KeyboardManager();

// Register default shortcuts
function registerDefaultShortcuts(app) {
    // Space - Play/Pause all sounds
    keyboardManager.register(' ', () => {
        app.togglePlayAll();
    });

    // F - Fullscreen Zen Mode
    keyboardManager.register('f', () => {
        app.toggleZenMode();
    });

    // M - Mute/Unmute
    keyboardManager.register('m', () => {
        app.toggleMute();
    });

    // Arrow Up - Increase master volume
    keyboardManager.register('arrowup', () => {
        const current = soundManager.masterVolume;
        soundManager.setMasterVolume(Math.min(1, current + 0.1));
        app.updateMasterVolumeUI();
    });

    // Arrow Down - Decrease master volume
    keyboardManager.register('arrowdown', () => {
        const current = soundManager.masterVolume;
        soundManager.setMasterVolume(Math.max(0, current - 0.1));
        app.updateMasterVolumeUI();
    });

    // S - Save current mix
    keyboardManager.register('s', () => {
        app.openSaveModal();
    });

    // R - Random mix
    keyboardManager.register('r', () => {
        presetManager.generateRandomMix();
        app.showToast('🎲 Rastgele karışım oluşturuldu!');
    });

    // Escape - Close modals/panels/zen mode
    keyboardManager.register('escape', () => {
        app.closeAllPanels();
    });

    // ? - Show shortcuts help
    keyboardManager.register('?', () => {
        app.toggleShortcutsModal();
    });

    // 1-9 - Quick preset selection
    for (let i = 1; i <= 9; i++) {
        keyboardManager.register(i.toString(), () => {
            const presets = presetManager.getBuiltinPresets();
            if (presets[i - 1]) {
                presetManager.applyPreset(presets[i - 1].id);
                app.showToast(`🎨 ${presets[i - 1].name} yüklendi`);
            }
        });
    }
}

window.keyboardManager = keyboardManager;
window.registerDefaultShortcuts = registerDefaultShortcuts;
