// ===================================
// ZENITH AMBIENT - MAIN APPLICATION
// ===================================

class ZenithApp {
    constructor() {
        this.currentCategory = 'nature';
        this.isPlaying = false;
        this.isZenMode = false;
        this.zenModeTimeout = null;

        this.init();
    }

    async init() {
        // Load saved theme
        const savedTheme = storageManager.loadTheme();
        this.applyTheme(savedTheme);

        // Load settings
        const settings = storageManager.getSettings();
        soundManager.crossfadeEnabled = settings.crossfadeEnabled;

        // Restore master volume
        if (settings.masterVolume !== undefined) {
            soundManager.setMasterVolume(settings.masterVolume);
        }

        // Initialize UI
        this.initUI();
        this.renderSoundsGrid();
        this.renderBuiltinPresets();
        this.renderUserPresets();


        // Register keyboard shortcuts
        registerDefaultShortcuts(this);

        // Initialize particles
        zenCanvas.init();

        // Check URL for shared preset
        presetManager.loadFromUrl();

        // Update orbs when sounds change
        window.addEventListener('soundStarted', () => {
            this.updateOrbs();
            this.updatePlayPauseBtn();
        });
        window.addEventListener('soundStopped', () => {
            this.updateOrbs();
            this.updatePlayPauseBtn();
        });

        // Create Play/Pause All button
        this.createPlayPauseAllBtn();

        // Show welcome or restore session
        this.showWelcomeOrRestore();

        // Register Service Worker
        this.registerServiceWorker();

        // Increment session
        storageManager.incrementSession();

        console.log('✨ Zenith Ambient initialized');
    }

    // ===== WELCOME & RESTORE =====
    showWelcomeOrRestore() {
        const isFirstVisit = !localStorage.getItem('zenith-visited');
        const hasSession = autoSaveManager.hasSession();

        if (isFirstVisit) {
            this.showWelcomeModal();
            localStorage.setItem('zenith-visited', 'true');
        } else if (hasSession) {
            this.showRestorePrompt();
        }
    }

    showWelcomeModal() {
        const modal = document.createElement('div');
        modal.className = 'welcome-modal';

        const flags = {
            en: '🇬🇧', tr: '🇹🇷', de: '🇩🇪', fr: '🇫🇷', es: '🇪🇸',
            it: '🇮🇹', pt: '🇵🇹', ru: '🇷🇺', zh: '🇨🇳', ja: '🇯🇵', ar: '🇸🇦'
        };

        const render = () => {
            const currentLang = i18n.getCurrentLanguage();
            // Generate options
            const options = Object.entries(LANGUAGES).map(([code, data]) =>
                `<option value="${code}" ${code === currentLang ? 'selected' : ''}>${flags[code] || '🌍'} ${data.name}</option>`
            ).join('');

            modal.innerHTML = `
                <div class="welcome-content">
                    <div class="welcome-logo">🎧</div>
                    <select id="welcome-lang-select" class="welcome-lang-select">
                        ${options}
                    </select>
                    <h2 class="welcome-title">${i18n.t('msg.welcome.title', 'Zenith Ambient\'e Hoş Geldin!')}</h2>
                    <p class="welcome-subtitle">${i18n.t('msg.welcome.subtitle', 'Premium ses mikseri')}</p>
                    <div class="welcome-features">
                        <div class="welcome-feature"><span>🔍</span> ${i18n.t('msg.welcome.feat.search')}</div>
                        <div class="welcome-feature"><span>❤️</span> ${i18n.t('msg.welcome.feat.fav')}</div>
                        <div class="welcome-feature"><span>💾</span> ${i18n.t('msg.welcome.feat.autosave')}</div>
                        <div class="welcome-feature"><span>🎛️</span> ${i18n.t('msg.welcome.feat.hz')}</div>
                        <div class="welcome-feature"><span>🧘</span> ${i18n.t('msg.welcome.feat.breath')}</div>
                    </div>
                    <button class="welcome-btn">${i18n.t('msg.welcome.btn', 'Başla 🚀')}</button>
                </div>
            `;

            // Language change handler
            modal.querySelector('#welcome-lang-select').addEventListener('change', (e) => {
                const newLang = e.target.value;
                i18n.setLanguage(newLang);

                // Update app UI
                this.renderSoundsGrid();
                this.renderBuiltinPresets();
                const dir = LANGUAGES[newLang]?.dir || 'ltr';
                document.documentElement.dir = dir;

                // Re-render modal
                render();
            });

            // Start button
            modal.querySelector('.welcome-btn').addEventListener('click', () => {
                modal.style.transition = 'opacity 0.5s ease';
                modal.style.opacity = '0';
                setTimeout(() => modal.remove(), 500);
            });
        };

        render();
        document.body.appendChild(modal);

        // Auto close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.transition = 'opacity 0.5s ease';
                modal.style.opacity = '0';
                setTimeout(() => modal.remove(), 500);
            }
        });
    }

    showRestorePrompt() {
        const toast = document.createElement('div');
        toast.className = 'toast restore-toast';
        toast.innerHTML = `
            <span>${i18n.t('msg.restore.text', '💾 Son oturumun kaydedildi')}</span>
            <button class="restore-btn">${i18n.t('msg.restore.btn', 'Geri Yükle')}</button>
            <button class="dismiss-btn">✕</button>
        `;
        toast.style.cssText = 'display: flex; align-items: center; gap: 12px;';

        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);

        toast.querySelector('.restore-btn').addEventListener('click', async () => {
            await autoSaveManager.restore();
            this.updateUI();
            toast.remove();
            this.showToast(i18n.t('msg.restore.success', '✅ Oturum geri yüklendi!'));
        });

        toast.querySelector('.dismiss-btn').addEventListener('click', () => {
            autoSaveManager.clear();
            toast.remove();
        });

        // Auto hide after 10 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }
        }, 10000);
    }

    // ===== PLAY/PAUSE ALL =====
    createPlayPauseAllBtn() {
        this.isPaused = false;
        this.pausedSounds = [];

        // Use header button instead of floating button
        const headerBtn = document.getElementById('btn-play-pause-floating');
        if (headerBtn) {
            headerBtn.addEventListener('click', () => this.togglePlayPauseAll());
        }

        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.shiftKey && e.code === 'Space') {
                e.preventDefault();
                this.togglePlayPauseAll();
            }
        });
    }

    togglePlayPauseAll() {
        const btn = document.getElementById('btn-play-pause-floating');
        if (!btn) return;

        if (this.isPaused) {
            // Resume all paused sounds
            this.isPaused = false; // Set BEFORE playing to avoid race condition
            this.pausedSounds.forEach(async ({ soundId, volume }) => {
                await soundManager.play(soundId, volume);
            });
            this.pausedSounds = [];
            btn.innerHTML = '⏸️';
            btn.classList.remove('paused');
            this.showToast(i18n.t('msg.play.all', '▶️ Tüm sesler devam ediyor'));
        } else {
            // Pause all sounds
            const activeSounds = soundManager.getActiveSounds();
            if (activeSounds.length === 0) return;

            this.pausedSounds = activeSounds.map(soundId => ({
                soundId,
                volume: soundManager.volumes[soundId] || 0.5
            }));

            // Set isPaused BEFORE stopAll to prevent race condition with soundStopped events
            this.isPaused = true;
            btn.innerHTML = '▶️';
            btn.classList.add('paused');
            btn.style.display = 'flex'; // Force visible

            soundManager.stopAll();
            this.showToast(i18n.t('msg.pause.all', '⏸️ Tüm sesler duraklatıldı'));
        }
        this.updateUI();
    }

    updatePlayPauseBtn() {
        const btn = document.getElementById('btn-play-pause-floating');
        if (btn) {
            const hasActiveSounds = soundManager.activeSounds.size > 0;
            const shouldShow = hasActiveSounds || this.isPaused;
            btn.style.display = shouldShow ? 'flex' : 'none';

            // Update icon based on state
            if (this.isPaused) {
                btn.innerHTML = '▶️';
                btn.classList.add('paused');
            } else if (hasActiveSounds) {
                btn.innerHTML = '⏸️';
                btn.classList.remove('paused');
            }
        }
    }

    // ===== SERVICE WORKER =====
    registerServiceWorker() {
        // Service Worker only works on http/https, not file://
        if ('serviceWorker' in navigator && location.protocol !== 'file:') {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('📦 Service Worker registered'))
                .catch(() => { }); // Silently fail
        }
    }

    // ===== UI INITIALIZATION =====

    initUI() {
        // Master Volume
        const masterSlider = document.getElementById('master-slider');
        const masterValue = document.getElementById('master-value');

        // Initialize from saved settings
        const savedVolume = Math.round(soundManager.masterVolume * 100);
        if (masterSlider) masterSlider.value = savedVolume;
        if (masterValue) masterValue.textContent = savedVolume + '%';

        masterSlider?.addEventListener('input', (e) => {
            const volume = parseInt(e.target.value) / 100;
            soundManager.setMasterVolume(volume);
            document.getElementById('master-value').textContent = e.target.value + '%';
            // Save to storage
            storageManager.saveSettings({ masterVolume: volume });
        });

        // Mute Button
        document.getElementById('btn-mute')?.addEventListener('click', () => this.toggleMute());

        // Category Tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCategory = e.target.dataset.category;
                this.renderSoundsGrid();
            });
        });

        // Header Buttons
        document.getElementById('btn-presets')?.addEventListener('click', () => this.togglePanel('presets-panel'));
        document.getElementById('btn-timer')?.addEventListener('click', () => this.togglePanel('timer-panel'));
        document.getElementById('btn-settings')?.addEventListener('click', () => this.togglePanel('settings-panel'));
        document.getElementById('btn-zen')?.addEventListener('click', () => this.toggleZenMode());
        document.getElementById('btn-breathing')?.addEventListener('click', () => {
            if (typeof breathingExercise !== 'undefined') {
                breathingExercise.open();
            }
        });

        // Bottom Actions
        document.getElementById('btn-save')?.addEventListener('click', () => this.openSaveModal());
        document.getElementById('btn-share')?.addEventListener('click', () => this.openShareModal());
        document.getElementById('btn-random')?.addEventListener('click', () => {
            presetManager.generateRandomMix();
            this.showToast(i18n.t('msg.random', '🎲 Rastgele karışım oluşturuldu!'));
            this.updateUI();
        });

        // Close Buttons
        document.querySelectorAll('[data-close]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = e.target.dataset.close;
                this.closePanel(targetId);
            });
        });

        // Timer Buttons
        this.initTimerUI();

        // Settings
        this.initSettingsUI();

        // Modals
        this.initModals();

        // Zen Mode
        this.initZenMode();
    }

    // ===== SOUNDS GRID =====

    renderSoundsGrid() {
        const grid = document.getElementById('sounds-grid');
        if (!grid) return;

        // Special handling for frequency category
        if (this.currentCategory === 'frequency') {
            this.renderFrequencyGrid(grid);
            return;
        }

        const category = SOUND_CATEGORIES[this.currentCategory];
        if (!category) return;

        grid.innerHTML = '';

        category.sounds.forEach(sound => {
            const isActive = soundManager.activeSounds.has(sound.id);
            const volume = soundManager.volumes[sound.id] || 0.5;

            const card = document.createElement('div');
            card.className = `sound-card ${isActive ? 'active' : ''}`;
            card.dataset.soundId = sound.id;
            card.style.setProperty('--accent-primary', sound.color);

            const isFav = typeof favoritesManager !== 'undefined' && favoritesManager.isFavorite(sound.id);
            // Get translated sound name
            const soundName = i18n.t(`sound.${sound.id}`, sound.name);
            card.innerHTML = `
                <button class="favorite-heart ${isFav ? 'active' : ''}" data-sound-id="${sound.id}">
                    ${isFav ? '❤️' : '🤍'}
                </button>
                <span class="sound-icon">${sound.icon}</span>
                <span class="sound-name">${soundName}</span>
                <input type="range" class="slider sound-slider" 
                       min="0" max="100" value="${Math.round(volume * 100)}"
                       data-sound-id="${sound.id}">
                <span class="sound-volume-label">${isActive ? Math.round(volume * 100) + '%' : ''}</span>
            `;

            // Favorite heart click
            const heartBtn = card.querySelector('.favorite-heart');
            heartBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                if (typeof favoritesManager !== 'undefined') {
                    const nowFav = favoritesManager.toggle(sound.id);
                    heartBtn.innerHTML = nowFav ? '❤️' : '🤍';
                    heartBtn.classList.toggle('active', nowFav);
                    this.showToast(nowFav ? i18n.t('msg.fav.add', '❤️ Favorilere eklendi') : i18n.t('msg.fav.remove', '🤍 Favoriden çıkarıldı'));
                }
            });

            // Card click - toggle sound
            card.addEventListener('click', async (e) => {
                if (e.target.classList.contains('sound-slider')) return;
                if (e.target.classList.contains('favorite-heart')) return;
                await this.toggleSound(sound.id);
            });

            // Slider input
            const slider = card.querySelector('.sound-slider');
            slider.addEventListener('input', (e) => {
                e.stopPropagation();
                const vol = parseInt(e.target.value) / 100;
                soundManager.setVolume(sound.id, vol);
                card.querySelector('.sound-volume-label').textContent = e.target.value + '%';
            });

            slider.addEventListener('click', (e) => e.stopPropagation());

            grid.appendChild(card);
        });
    }

    renderFrequencyGrid(grid) {
        grid.innerHTML = '';

        // All frequencies in same grid like regular sounds
        const allCards = [];

        // Add Solfeggio frequencies
        SOLFEGGIO_FREQUENCIES.forEach(freq => {
            const isActive = frequencyGenerator.isActive(`solfeggio-${freq.hz}`);
            const card = document.createElement('div');
            card.className = `sound-card ${isActive ? 'active' : ''}`;
            card.innerHTML = `
                <span class="sound-icon">${freq.icon}</span>
                <span class="sound-name">${freq.name}</span>
                <span class="sound-volume-label">${freq.description}</span>
            `;
            card.addEventListener('click', () => {
                const started = frequencyGenerator.playSolfeggio(freq.hz, `solfeggio-${freq.hz}`);
                card.classList.toggle('active', started);
                if (started) this.showToast(`🎵 ${freq.hz}Hz - ${freq.description}`);
                this.renderSoundsGrid(); // Refresh to update active states
            });
            grid.appendChild(card);
        });

        // Add Binaural beats
        BINAURAL_BEATS.forEach(beat => {
            const isActive = frequencyGenerator.isActive(`binaural-${beat.name}`);
            const card = document.createElement('div');
            card.className = `sound-card ${isActive ? 'active' : ''}`;
            card.innerHTML = `
                <span class="sound-icon">${beat.icon}</span>
                <span class="sound-name">${beat.name}</span>
                <span class="sound-volume-label">${beat.description}</span>
            `;
            card.addEventListener('click', () => {
                const started = frequencyGenerator.playBinaural(beat.hz, beat.baseHz, `binaural-${beat.name}`);
                card.classList.toggle('active', started);
                if (started) this.showToast(`🎧 ${beat.name} - ${beat.description}`);
                this.renderSoundsGrid();
            });
            grid.appendChild(card);
        });

        // Add custom frequency card
        const customCard = document.createElement('div');
        customCard.className = 'sound-card custom-freq-card';
        customCard.innerHTML = `
            <span class="sound-icon">🎛️</span>
            <span class="sound-name">Özel Hz</span>
            <input type="range" id="custom-hz-slider" min="20" max="1000" value="432" class="slider sound-slider" style="opacity: 1;">
            <span class="sound-volume-label" id="custom-hz-value">432 Hz</span>
        `;

        const slider = customCard.querySelector('#custom-hz-slider');
        const valueLabel = customCard.querySelector('#custom-hz-value');

        slider.addEventListener('input', (e) => {
            e.stopPropagation();
            const hz = parseInt(e.target.value);
            valueLabel.textContent = hz + ' Hz';

            // If already playing, update frequency immediately
            if (customCard.classList.contains('active')) {
                frequencyGenerator.stopCustom();
                frequencyGenerator.playCustom(hz);
            }
        });

        slider.addEventListener('click', (e) => e.stopPropagation());

        customCard.addEventListener('click', (e) => {
            if (e.target.classList.contains('slider')) return;
            const hz = parseInt(slider.value);
            const started = frequencyGenerator.playCustom(hz);
            customCard.classList.toggle('active', started);
            if (started) this.showToast(`🎛️ ${hz}Hz`);
        });

        grid.appendChild(customCard);
    }

    async toggleSound(soundId) {
        if (soundManager.activeSounds.has(soundId)) {
            soundManager.stop(soundId);
        } else {
            await soundManager.play(soundId, 0.5);
            storageManager.trackSoundUsage(soundId);
        }

        this.updateUI();
        particleSystem.updateFromSounds(soundManager.getActiveSounds());
    }

    updateUI() {
        // Update sound cards
        document.querySelectorAll('.sound-card').forEach(card => {
            const soundId = card.dataset.soundId;
            const isActive = soundManager.activeSounds.has(soundId);
            card.classList.toggle('active', isActive);

            const volumeLabel = card.querySelector('.sound-volume-label');
            if (volumeLabel) {
                volumeLabel.textContent = isActive ? Math.round((soundManager.volumes[soundId] || 0.5) * 100) + '%' : '';
            }
        });

        // Update current preset name
        const preset = presetManager.getCurrentPreset();
        const presetEl = document.getElementById('current-preset');
        if (presetEl) presetEl.textContent = preset?.name || 'None';

        // Update orbs
        this.updateOrbs();
    }

    // ===== ORBS =====

    updateOrbs() {
        const container = document.getElementById('orbs-container');
        const zenOrbs = document.getElementById('zen-orbs');
        if (!container) return;

        container.innerHTML = '';
        if (zenOrbs) zenOrbs.innerHTML = '';

        const activeSounds = soundManager.getActiveSounds();

        activeSounds.forEach((soundId, index) => {
            const soundData = soundManager.getSoundData(soundId);
            if (!soundData) return;

            const volume = soundManager.volumes[soundId] || 0.5;
            const size = 40 + volume * 40;

            // Main orb with close button
            const orb = document.createElement('div');
            orb.className = 'orb active-sound';
            orb.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background: linear-gradient(135deg, ${soundData.color}, ${soundData.color}88);
                animation-delay: ${-index * 0.5}s;
                cursor: pointer;
            `;
            orb.innerHTML = `
                ${soundData.icon}
                <span class="close-btn">✕</span>
            `;
            orb.title = `${soundData.name} - ${i18n.t('orb.close', 'Kapatmak için tıkla')}`;

            // Click to close
            orb.addEventListener('click', () => {
                soundManager.stop(soundId);
                this.updateOrbs();
                this.renderSoundsGrid();
            });

            container.appendChild(orb);

            // Zen mode orb
            if (zenOrbs) {
                const zenOrb = document.createElement('div');
                zenOrb.className = 'zen-orb';
                zenOrb.style.background = `linear-gradient(135deg, ${soundData.color}40, ${soundData.color}20)`;
                zenOrb.innerHTML = soundData.icon;
                zenOrbs.appendChild(zenOrb);
            }
        });
    }

    // ===== PANELS =====

    togglePanel(panelId) {
        const panel = document.getElementById(panelId);
        if (!panel) return;

        const isOpen = panel.classList.contains('open');

        // Close all panels first
        document.querySelectorAll('.side-panel').forEach(p => p.classList.remove('open'));

        if (!isOpen) {
            panel.classList.add('open');
        }
    }

    closePanel(panelId) {
        const panel = document.getElementById(panelId);
        panel?.classList.remove('open');
    }

    closeAllPanels() {
        document.querySelectorAll('.side-panel').forEach(p => p.classList.remove('open'));
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('open'));

        if (this.isZenMode) {
            this.toggleZenMode();
        }

        keyboardManager.setModalOpen(false);
    }

    // ===== PRESETS =====

    renderBuiltinPresets() {
        const container = document.getElementById('builtin-presets');
        if (!container) return;

        container.innerHTML = '';

        BUILTIN_PRESETS.forEach((preset, index) => {
            const item = this.createPresetItem(preset, index + 1);
            container.appendChild(item);
        });
    }

    renderUserPresets() {
        const container = document.getElementById('user-presets');
        if (!container) return;

        const userPresets = presetManager.getUserPresets();

        if (userPresets.length === 0) {
            container.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 20px;">${i18n.t('msg.preset.user.empty', 'Henüz kayıtlı karışım yok')}</p>`;
            return;
        }

        container.innerHTML = '';

        userPresets.forEach(preset => {
            const item = this.createPresetItem(preset, null, true);
            container.appendChild(item);
        });
    }

    createPresetItem(preset, shortcutNum = null, isUserPreset = false) {
        const item = document.createElement('div');
        item.className = 'preset-item';

        // Translate name and description if builtin
        let name = preset.name;
        let desc = preset.description || '';

        if (!isUserPreset) {
            name = i18n.t(`preset.${preset.id}.name`, preset.name);
            desc = i18n.t(`preset.${preset.id}.desc`, preset.description || '');
        }

        item.innerHTML = `
            <span class="preset-icon">${preset.icon}</span>
            <div class="preset-info">
                <div class="preset-name">${name}</div>
                <div class="preset-description">${desc}</div>
            </div>
            ${shortcutNum ? `<kbd>${shortcutNum}</kbd>` : ''}
            ${isUserPreset ? `<button class="btn-icon preset-delete" data-preset-id="${preset.id}">🗑️</button>` : ''}
        `;

        item.addEventListener('click', async (e) => {
            if (e.target.classList.contains('preset-delete')) {
                presetManager.deleteUserPreset(preset.id);
                this.renderUserPresets();
                this.showToast('🗑️ ' + i18n.t('msg.preset.deleted', 'Karışım silindi'));
                return;
            }

            await presetManager.applyPreset(preset.id);
            this.updateUI();
            this.closePanel('presets-panel');
            this.showToast(`🎨 ${name} ${i18n.t('msg.preset.loaded', 'yüklendi')}`);
        });

        return item;
    }

    // ===== TIMER UI =====

    initTimerUI() {
        // Sleep Timer Buttons
        document.querySelectorAll('.timer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const minutes = parseInt(e.target.dataset.minutes);
                this.startSleepTimer(minutes);

                // Update active state
                document.querySelectorAll('.timer-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Cancel Sleep Timer
        document.getElementById('cancel-sleep')?.addEventListener('click', () => {
            timerManager.stopSleepTimer();
            this.updateSleepTimerDisplay();
            document.querySelectorAll('.timer-btn').forEach(b => b.classList.remove('active'));
        });

        // Fade Out Toggle
        document.getElementById('fade-out-toggle')?.addEventListener('change', (e) => {
            timerManager.setFadeOutEnabled(e.target.checked);
        });

        // Timer callbacks
        timerManager.onSleepTimerTick = (remaining) => this.updateSleepTimerDisplay(remaining);
        timerManager.onSleepTimerEnd = () => {
            this.updateSleepTimerDisplay();
            this.showToast('😴 ' + i18n.t('msg.timer.complete', 'Uyku zamanlayıcısı tamamlandı'));
        };
    }

    startSleepTimer(minutes) {
        timerManager.startSleepTimer(minutes);
        document.getElementById('cancel-sleep').style.display = 'inline-block';
        this.showToast(`😴 ${minutes} ${i18n.t('msg.timer.start', 'dakika sonra kapanacak')}`);
    }

    updateSleepTimerDisplay(remaining) {
        const display = document.querySelector('#sleep-timer-display .timer-time');
        const cancelBtn = document.getElementById('cancel-sleep');

        if (remaining && remaining > 0) {
            display.textContent = timerManager.formatTime(remaining);
            cancelBtn.style.display = 'inline-block';
        } else {
            display.textContent = '--:--';
            cancelBtn.style.display = 'none';
        }
    }



    // ===== SETTINGS UI =====

    initSettingsUI() {
        // Theme buttons
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.target.dataset.theme;
                this.applyTheme(theme);
                storageManager.saveTheme(theme);

                document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Meander toggle
        document.getElementById('meander-toggle')?.addEventListener('change', (e) => {
            if (e.target.checked) {
                soundManager.startMeander();
            } else {
                soundManager.stopMeander();
            }
            storageManager.saveSettings({ meanderEnabled: e.target.checked });
        });

        // Crossfade toggle
        document.getElementById('crossfade-toggle')?.addEventListener('change', (e) => {
            soundManager.crossfadeEnabled = e.target.checked;
            storageManager.saveSettings({ crossfadeEnabled: e.target.checked });
        });

        // Visualizer toggle
        document.getElementById('visualizer-toggle')?.addEventListener('change', (e) => {
            if (typeof audioVisualizer !== 'undefined') {
                if (e.target.checked) {
                    audioVisualizer.start();
                } else {
                    audioVisualizer.stop();
                }
            }
            storageManager.saveSettings({ visualizerEnabled: e.target.checked });
        });

        // Day/Night cycle toggle
        document.getElementById('day-night-toggle')?.addEventListener('change', (e) => {
            if (e.target.checked) {
                this.startDayNightCycle();
            } else {
                this.stopDayNightCycle();
            }
            storageManager.saveSettings({ dayNightEnabled: e.target.checked });
        });

        // Language selector
        const langSelector = document.getElementById('language-selector');
        if (langSelector) {
            langSelector.value = i18n.getCurrentLanguage();
            langSelector.addEventListener('change', (e) => {
                const lang = e.target.value;
                i18n.setLanguage(lang);

                // Set RTL for Arabic
                const dir = LANGUAGES[lang]?.dir || 'ltr';
                document.documentElement.dir = dir;

                // Re-render sounds with new translations
                this.renderSoundsGrid();

                // Re-render presets to update names
                this.renderBuiltinPresets();

                this.showToast(`🌍 ${LANGUAGES[lang]?.name}`);
            });
        }

        // Analytics button
        document.getElementById('btn-analytics')?.addEventListener('click', () => {
            this.closePanel('settings-panel');
            if (typeof analyticsManager !== 'undefined') {
                analyticsManager.open();
            } else {
                this.showAnalyticsModal();
            }
        });

        // Achievements button
        document.getElementById('btn-achievements')?.addEventListener('click', () => {
            this.closePanel('settings-panel');
            if (typeof achievementManager !== 'undefined') {
                achievementManager.open();
            } else {
                this.showAchievementsModal();
            }
        });
    }

    // Day/Night automatic theme cycle
    startDayNightCycle() {
        this.applyTimeBasedTheme();
        this.dayNightInterval = setInterval(() => {
            this.applyTimeBasedTheme();
        }, 60000); // Check every minute
    }

    stopDayNightCycle() {
        if (this.dayNightInterval) {
            clearInterval(this.dayNightInterval);
            this.dayNightInterval = null;
        }
    }

    applyTimeBasedTheme() {
        const hour = new Date().getHours();
        let theme;

        if (hour >= 6 && hour < 8) {
            theme = 'sunset'; // Sunrise
        } else if (hour >= 8 && hour < 18) {
            theme = 'light'; // Day
        } else if (hour >= 18 && hour < 20) {
            theme = 'sunset'; // Sunset
        } else {
            theme = 'night'; // Night
        }

        this.applyTheme(theme);
        storageManager.saveTheme(theme);
    }

    applyTheme(theme) {
        document.body.dataset.theme = theme;

        // Update active button
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });

        // Activate theme particles
        if (typeof themeParticles !== 'undefined') {
            themeParticles.setTheme(theme);
        }
    }

    // ===== MODALS =====

    initModals() {
        // Save Modal
        document.getElementById('confirm-save')?.addEventListener('click', () => {
            const name = document.getElementById('preset-name-input')?.value.trim();
            if (!name) {
                this.showToast('⚠️ ' + i18n.t('msg.enter_name', 'Lütfen bir isim girin'), 'error');
                return;
            }

            const result = presetManager.saveCurrentAsPreset(name);
            if (result.success) {
                this.renderUserPresets();
                this.closePanel('save-modal');
                this.showToast('💾 ' + i18n.t('msg.saved', 'Karışım kaydedildi!'));
                document.getElementById('preset-name-input').value = '';
            } else {
                this.showToast('⚠️ ' + result.message, 'error');
            }
        });

        // Share Modal
        document.getElementById('copy-url')?.addEventListener('click', () => {
            const urlInput = document.getElementById('share-url');
            urlInput.select();
            document.execCommand('copy');
            this.showToast('📋 ' + i18n.t('msg.url_copied', 'URL kopyalandı!'));
        });
    }

    openSaveModal() {
        if (soundManager.getActiveSounds().length === 0) {
            this.showToast('⚠️ ' + i18n.t('msg.no_active', 'Kaydedilecek aktif ses yok!'), 'error');
            return;
        }

        const modal = document.getElementById('save-modal');
        modal?.classList.add('open');
        document.getElementById('preset-name-input')?.focus();
        keyboardManager.setModalOpen(true);
    }

    openShareModal() {
        if (soundManager.getActiveSounds().length === 0) {
            this.showToast('⚠️ ' + i18n.t('msg.no_share', 'Paylaşılacak aktif ses yok!'), 'error');
            return;
        }

        const url = presetManager.generateShareUrl();
        document.getElementById('share-url').value = url;
        document.getElementById('share-modal')?.classList.add('open');
        keyboardManager.setModalOpen(true);
    }

    toggleShortcutsModal() {
        const modal = document.getElementById('shortcuts-modal');
        modal?.classList.toggle('open');
        keyboardManager.setModalOpen(modal?.classList.contains('open'));
    }

    // ===== ZEN MODE =====

    initZenMode() {
        const zenMode = document.getElementById('zen-mode');
        const exitBtn = document.getElementById('exit-zen');
        const zenSlider = document.getElementById('zen-master-slider');

        exitBtn?.addEventListener('click', () => this.toggleZenMode());

        zenSlider?.addEventListener('input', (e) => {
            soundManager.setMasterVolume(parseInt(e.target.value) / 100);
            document.getElementById('master-slider').value = e.target.value;
            document.getElementById('master-value').textContent = e.target.value + '%';
        });

        // Show controls on mouse move
        zenMode?.addEventListener('mousemove', () => {
            zenMode.classList.add('show-controls', 'show-cursor');

            clearTimeout(this.zenModeTimeout);
            this.zenModeTimeout = setTimeout(() => {
                zenMode.classList.remove('show-controls', 'show-cursor');
            }, 3000);
        });
    }

    toggleZenMode() {
        const zenMode = document.getElementById('zen-mode');
        if (!zenMode) return;

        this.isZenMode = !this.isZenMode;
        zenMode.classList.toggle('active', this.isZenMode);

        if (this.isZenMode) {
            // Sync volume slider
            document.getElementById('zen-master-slider').value = soundManager.masterVolume * 100;

            // Start canvas animation
            zenCanvas.start();

            // Update clock
            this.updateZenClock();
            this.zenClockInterval = setInterval(() => this.updateZenClock(), 1000);

            // Show random quote
            this.showZenQuote();

            // Update orbs
            this.updateOrbs();

            // Try fullscreen
            try {
                document.documentElement.requestFullscreen?.();
            } catch (e) { }
        } else {
            zenCanvas.stop();
            clearInterval(this.zenClockInterval);

            try {
                document.exitFullscreen?.();
            } catch (e) { }
        }
    }

    updateZenClock() {
        const now = new Date();
        const lang = i18n.getCurrentLanguage();
        const timeStr = now.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' });
        const dateStr = now.toLocaleDateString(lang, { weekday: 'long', day: 'numeric', month: 'long' });

        document.querySelector('.zen-time').textContent = timeStr;
        document.querySelector('.zen-date').textContent = dateStr;
    }

    showZenQuote() {
        const quoteContainer = document.getElementById('zen-quote');
        if (!quoteContainer) return;

        const quote = presetManager.getRandomQuote();
        quoteContainer.innerHTML = `
            <p>"${quote.text}"</p>
            <span class="author">— ${quote.author}</span>
        `;
    }

    // ===== UTILITY =====

    toggleMute() {
        const isMuted = soundManager.toggleMute();

        document.getElementById('icon-volume').style.display = isMuted ? 'none' : 'block';
        document.getElementById('icon-muted').style.display = isMuted ? 'block' : 'none';

        this.showToast(isMuted ? '🔇 ' + i18n.t('msg.mute.on', 'Ses kapatıldı') : '🔊 ' + i18n.t('msg.mute.off', 'Ses açıldı'));
    }

    togglePlayAll() {
        const activeSounds = soundManager.getActiveSounds();

        if (activeSounds.length > 0) {
            soundManager.stopAll();
            this.showToast('⏹ ' + i18n.t('msg.stop.all', 'Tüm sesler durduruldu'));
        } else {
            // Play default preset
            presetManager.applyPreset('rainy-cafe');
            const rainyCafe = i18n.t('preset.rainy-cafe.name', 'Yağmurlu Kafe');
            this.showToast(`▶ ${rainyCafe} ${i18n.t('msg.preset.loaded', 'başlatıldı')}`);
        }

        this.updateUI();
    }

    updateMasterVolumeUI() {
        const slider = document.getElementById('master-slider');
        const value = document.getElementById('master-value');
        const zenSlider = document.getElementById('zen-master-slider');

        const vol = Math.round(soundManager.masterVolume * 100);

        if (slider) slider.value = vol;
        if (value) value.textContent = vol + '%';
        if (zenSlider) zenSlider.value = vol;
    }

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Fallback analytics modal
    showAnalyticsModal() {
        const totalTime = storageManager.getTotalListeningTime?.() || 0;
        const hours = Math.floor(totalTime / 3600);
        const mins = Math.floor((totalTime % 3600) / 60);

        const modal = document.createElement('div');
        modal.className = 'welcome-modal';
        modal.innerHTML = `
            <div class="welcome-content">
                <div class="welcome-logo">📊</div>
                <h2 class="welcome-title">${i18n.t('fallback.analytics.title', 'Dinleme İstatistikleri')}</h2>
                <div class="welcome-features" style="text-align: center;">
                    <div class="welcome-feature" style="justify-content: center;">
                        <span>⏱️</span> ${i18n.t('analytics.total', 'Toplam')}: ${hours}s ${mins}dk
                    </div>
                    <div class="welcome-feature" style="justify-content: center;">
                        <span>🔊</span> ${i18n.t('settings.sounds', 'Aktif ses')}: ${soundManager.activeSounds.size}
                    </div>
                    <div class="welcome-feature" style="justify-content: center;">
                        <span>💾</span> ${i18n.t('settings.preset', 'Kayıtlı preset')}: ${presetManager.userPresets?.length || 0}
                    </div>
                </div>
                <button class="welcome-btn" onclick="this.closest('.welcome-modal').remove()">${i18n.t('common.ok', 'Kapat')}</button>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    }

    // Fallback achievements modal
    showAchievementsModal() {
        const modal = document.createElement('div');
        modal.className = 'welcome-modal';
        modal.innerHTML = `
            <div class="welcome-content">
                <div class="welcome-logo">🏆</div>
                <h2 class="welcome-title">${i18n.t('fallback.achievements.title', 'Başarılar')}</h2>
                <div class="welcome-features" style="text-align: center;">
                    <div class="welcome-feature" style="justify-content: center;">
                        <span>🎵</span> ${i18n.t('achieve.first-timer.name')}: ✓
                    </div>
                    <div class="welcome-feature" style="justify-content: center;">
                        <span>🌟</span> ${i18n.t('achieve.explorer.name')}: ...
                    </div>
                </div>
                <button class="welcome-btn" onclick="this.closest('.welcome-modal').remove()">${i18n.t('common.ok', 'Kapat')}</button>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ZenithApp();
});
