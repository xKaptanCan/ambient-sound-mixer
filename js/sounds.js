// ===================================
// ZENITH AMBIENT - SOUNDS DATA & MANAGER
// 100+ Ambient Sounds from A Soft Murmur + Moodist
// ===================================

// Sound Categories with all sounds
const SOUND_CATEGORIES = {
    nature: {
        name: '🌿 Doğa',
        sounds: [
            { id: 'ocean', name: 'Okyanus Dalgaları', icon: '🌊', file: 'sounds/nature/ocean.mp4', color: '#06b6d4' },
            { id: 'river', name: 'Nehir', icon: '🏞️', file: 'sounds/nature/river.mp4', color: '#22d3ee' },
            { id: 'waterfall', name: 'Şelale', icon: '💧', file: 'sounds/nature/waterfall.mp4', color: '#0891b2' },
            { id: 'wind', name: 'Rüzgar', icon: '🍃', file: 'sounds/nature/wind.mp4', color: '#a3e635' },
            { id: 'fire', name: 'Kamp Ateşi', icon: '🔥', file: 'sounds/nature/fire.mp4', color: '#f97316' },
            { id: 'jungle', name: 'Orman', icon: '🌴', file: 'sounds/nature/jungle.mp3', color: '#22c55e' },
            { id: 'droplets', name: 'Su Damlaları', icon: '💦', file: 'sounds/nature/droplets.mp3', color: '#0ea5e9' },
            { id: 'wind-trees', name: 'Ağaçlarda Rüzgar', icon: '🌲', file: 'sounds/nature/wind-in-trees.mp3', color: '#16a34a' },
            { id: 'howling-wind', name: 'Uğuldayan Rüzgar', icon: '💨', file: 'sounds/nature/howling-wind.mp3', color: '#64748b' },
            { id: 'walk-snow', name: 'Karda Yürüyüş', icon: '❄️', file: 'sounds/nature/walk-in-snow.mp3', color: '#e2e8f0' },
            { id: 'walk-leaves', name: 'Yapraklarda Yürüyüş', icon: '🍂', file: 'sounds/nature/walk-on-leaves.mp3', color: '#ea580c' },
            { id: 'walk-gravel', name: 'Çakılda Yürüyüş', icon: '🪨', file: 'sounds/nature/walk-on-gravel.mp3', color: '#78716c' }
        ]
    },
    rain: {
        name: '🌧️ Yağmur',
        sounds: [
            { id: 'rain-gentle', name: 'Hafif Yağmur', icon: '🌧️', file: 'sounds/nature/rain-gentle.mp4', color: '#3b82f6' },
            { id: 'rain-heavy', name: 'Şiddetli Yağmur', icon: '⛈️', file: 'sounds/nature/rain-heavy.mp4', color: '#1e40af' },
            { id: 'rain-roof', name: 'Çatıda Yağmur', icon: '🏠', file: 'sounds/nature/rain-roof.mp4', color: '#60a5fa' },
            { id: 'rain-window', name: 'Camda Yağmur', icon: '🪟', file: 'sounds/nature/rain-window.mp4', color: '#93c5fd' },
            { id: 'rain-car', name: 'Arabada Yağmur', icon: '🚗', file: 'sounds/rain/rain-on-car-roof.mp3', color: '#1d4ed8' },
            { id: 'rain-leaves', name: 'Yapraklarda Yağmur', icon: '🍃', file: 'sounds/rain/rain-on-leaves.mp3', color: '#22c55e' },
            { id: 'rain-tent', name: 'Çadırda Yağmur', icon: '⛺', file: 'sounds/rain/rain-on-tent.mp3', color: '#84cc16' },
            { id: 'rain-umbrella', name: 'Şemsiyede Yağmur', icon: '☂️', file: 'sounds/rain/rain-on-umbrella.mp3', color: '#6366f1' },
            { id: 'thunder', name: 'Gök Gürültüsü', icon: '⚡', file: 'sounds/nature/thunder.mp4', color: '#7c3aed' }
        ]
    },
    animals: {
        name: '🐾 Hayvanlar',
        sounds: [
            { id: 'birds', name: 'Kuşlar', icon: '🐦', file: 'sounds/nature/birds.mp4', color: '#84cc16' },
            { id: 'crickets', name: 'Cırcır Böceği', icon: '🦗', file: 'sounds/nature/crickets.mp4', color: '#65a30d' },
            { id: 'beehive', name: 'Arı Kovanı', icon: '🐝', file: 'sounds/animals/beehive.mp3', color: '#eab308' },
            { id: 'cat', name: 'Kedi Mırıltısı', icon: '🐱', file: 'sounds/animals/cat-purring.mp3', color: '#f97316' },
            { id: 'chickens', name: 'Tavuklar', icon: '🐔', file: 'sounds/animals/chickens.mp3', color: '#dc2626' },
            { id: 'cows', name: 'İnekler', icon: '🐄', file: 'sounds/animals/cows.mp3', color: '#78350f' },
            { id: 'crows', name: 'Kargalar', icon: '🐦‍⬛', file: 'sounds/animals/crows.mp3', color: '#1e293b' },
            { id: 'dog', name: 'Köpek', icon: '🐕', file: 'sounds/animals/dog-barking.mp3', color: '#92400e' },
            { id: 'frog', name: 'Kurbağa', icon: '🐸', file: 'sounds/animals/frog.mp3', color: '#22c55e' },
            { id: 'horse', name: 'At Koşusu', icon: '🐴', file: 'sounds/animals/horse-gallop.mp3', color: '#78350f' },
            { id: 'owl', name: 'Baykuş', icon: '🦉', file: 'sounds/animals/owl.mp3', color: '#854d0e' },
            { id: 'seagulls', name: 'Martılar', icon: '🦅', file: 'sounds/animals/seagulls.mp3', color: '#0ea5e9' },
            { id: 'sheep', name: 'Koyunlar', icon: '🐑', file: 'sounds/animals/sheep.mp3', color: '#d1d5db' },
            { id: 'whale', name: 'Balina', icon: '🐋', file: 'sounds/animals/whale.mp3', color: '#1e40af' },
            { id: 'wolf', name: 'Kurt Uluması', icon: '🐺', file: 'sounds/animals/wolf.mp3', color: '#6b7280' },
            { id: 'woodpecker', name: 'Ağaçkakan', icon: '🪶', file: 'sounds/animals/woodpecker.mp3', color: '#dc2626' }
        ]
    },
    places: {
        name: '🏙️ Mekanlar',
        sounds: [
            { id: 'cafe', name: 'Kafe', icon: '☕', file: 'sounds/places/cafe.mp3', color: '#92400e' },
            { id: 'library', name: 'Kütüphane', icon: '📚', file: 'sounds/places/library.mp3', color: '#78716c' },
            { id: 'restaurant', name: 'Restoran', icon: '🍽️', file: 'sounds/places/restaurant.mp3', color: '#ea580c' },
            { id: 'office', name: 'Ofis', icon: '💼', file: 'sounds/places/office.mp3', color: '#64748b' },
            { id: 'airport', name: 'Havalimanı', icon: '✈️', file: 'sounds/places/airport.mp3', color: '#0284c7' },
            { id: 'church', name: 'Kilise', icon: '⛪', file: 'sounds/places/church.mp3', color: '#854d0e' },
            { id: 'temple', name: 'Tapınak', icon: '🛕', file: 'sounds/places/temple.mp3', color: '#f97316' },
            { id: 'bar', name: 'Bar', icon: '🍺', file: 'sounds/places/crowded-bar.mp3', color: '#7c2d12' },
            { id: 'construction', name: 'İnşaat', icon: '🏗️', file: 'sounds/places/construction-site.mp3', color: '#f59e0b' },
            { id: 'laboratory', name: 'Laboratuvar', icon: '🔬', file: 'sounds/places/laboratory.mp3', color: '#06b6d4' },
            { id: 'laundry', name: 'Çamaşırhane', icon: '🧺', file: 'sounds/places/laundry-room.mp3', color: '#38bdf8' },
            { id: 'subway-station', name: 'Metro İstasyonu', icon: '🚇', file: 'sounds/places/subway-station.mp3', color: '#334155' },
            { id: 'supermarket', name: 'Süpermarket', icon: '🛒', file: 'sounds/places/supermarket.mp3', color: '#16a34a' },
            { id: 'village', name: 'Gece Köyü', icon: '🏘️', file: 'sounds/places/night-village.mp3', color: '#1e293b' },
            { id: 'underwater', name: 'Su Altı', icon: '🤿', file: 'sounds/places/underwater.mp3', color: '#0891b2' },
            { id: 'carousel', name: 'Lunapark', icon: '🎠', file: 'sounds/places/carousel.mp3', color: '#ec4899' }
        ]
    },
    urban: {
        name: '🚗 Şehir',
        sounds: [
            { id: 'city', name: 'Şehir Trafiği', icon: '🚗', file: 'sounds/urban/city.mp4', color: '#475569' },
            { id: 'traffic', name: 'Trafik', icon: '🚦', file: 'sounds/urban/traffic.mp3', color: '#dc2626' },
            { id: 'highway', name: 'Otoyol', icon: '🛣️', file: 'sounds/urban/highway.mp3', color: '#64748b' },
            { id: 'busy-street', name: 'Kalabalık Sokak', icon: '🏃', file: 'sounds/urban/busy-street.mp3', color: '#f59e0b' },
            { id: 'crowd', name: 'Kalabalık', icon: '👥', file: 'sounds/urban/crowd.mp3', color: '#6366f1' },
            { id: 'road', name: 'Yol', icon: '🛤️', file: 'sounds/urban/road.mp3', color: '#78716c' },
            { id: 'ambulance', name: 'Ambulans', icon: '🚑', file: 'sounds/urban/ambulance-siren.mp3', color: '#dc2626' },
            { id: 'fireworks', name: 'Havai Fişek', icon: '🎆', file: 'sounds/urban/fireworks.mp3', color: '#f472b6' }
        ]
    },
    transport: {
        name: '🚂 Ulaşım',
        sounds: [
            { id: 'airplane', name: 'Uçak Kabini', icon: '✈️', file: 'sounds/transport/airplane.mp3', color: '#6366f1' },
            { id: 'train', name: 'Tren İçi', icon: '🚂', file: 'sounds/transport/inside-a-train.mp3', color: '#44403c' },
            { id: 'train-out', name: 'Tren Geçişi', icon: '🚃', file: 'sounds/transport/train.mp3', color: '#78716c' },
            { id: 'submarine', name: 'Denizaltı', icon: '🚢', file: 'sounds/transport/submarine.mp3', color: '#1e40af' },
            { id: 'sailboat', name: 'Yelkenli', icon: '⛵', file: 'sounds/transport/sailboat.mp3', color: '#0ea5e9' },
            { id: 'rowing-boat', name: 'Kürek Teknesi', icon: '🚣', file: 'sounds/transport/rowing-boat.mp3', color: '#0891b2' }
        ]
    },
    things: {
        name: '🔧 Nesneler',
        sounds: [
            { id: 'clock', name: 'Saat', icon: '🕐', file: 'sounds/things/clock.mp3', color: '#a8a29e' },
            { id: 'fan', name: 'Tavan Vantilatörü', icon: '🌀', file: 'sounds/things/ceiling-fan.mp3', color: '#94a3b8' },
            { id: 'keyboard', name: 'Klavye', icon: '⌨️', file: 'sounds/things/keyboard.mp3', color: '#475569' },
            { id: 'typewriter', name: 'Daktilo', icon: '📝', file: 'sounds/things/typewriter.mp3', color: '#78716c' },
            { id: 'washing-machine', name: 'Çamaşır Makinesi', icon: '🌊', file: 'sounds/things/washing-machine.mp3', color: '#38bdf8' },
            { id: 'dryer', name: 'Kurutma Makinesi', icon: '💨', file: 'sounds/things/dryer.mp3', color: '#64748b' },
            { id: 'boiling-water', name: 'Kaynayan Su', icon: '🫖', file: 'sounds/things/boiling-water.mp3', color: '#ef4444' },
            { id: 'bubbles', name: 'Baloncuklar', icon: '🫧', file: 'sounds/things/bubbles.mp3', color: '#06b6d4' },
            { id: 'wind-chimes', name: 'Rüzgar Çanları', icon: '🎐', file: 'sounds/things/wind-chimes.mp3', color: '#eab308' },
            { id: 'paper', name: 'Kağıt Hışırtısı', icon: '📄', file: 'sounds/things/paper.mp3', color: '#d1d5db' },
            { id: 'vinyl', name: 'Plak Çıtırtısı', icon: '📀', file: 'sounds/things/vinyl-effect.mp3', color: '#1e293b' },
            { id: 'morse', name: 'Mors Kodu', icon: '📡', file: 'sounds/things/morse-code.mp3', color: '#22c55e' },
            { id: 'radio', name: 'Radyo Ayarı', icon: '📻', file: 'sounds/things/tuning-radio.mp3', color: '#78350f' },
            { id: 'projector', name: 'Slayt Projektör', icon: '📽️', file: 'sounds/things/slide-projector.mp3', color: '#6b7280' },
            { id: 'wipers', name: 'Silecekler', icon: '🚗', file: 'sounds/things/windshield-wipers.mp3', color: '#3b82f6' }
        ]
    },
    whitenoise: {
        name: '🎵 Gürültü',
        sounds: [
            { id: 'white-noise', name: 'Beyaz Gürültü', icon: '📺', file: 'sounds/noise/white-noise.wav', color: '#e2e8f0' },
            { id: 'pink-noise', name: 'Pembe Gürültü', icon: '💗', file: 'sounds/noise/pink-noise.wav', color: '#ec4899' },
            { id: 'brown-noise', name: 'Kahverengi Gürültü', icon: '🟤', file: 'sounds/noise/brown-noise.wav', color: '#78350f' },
            { id: 'ac', name: 'Klima', icon: '❄️', file: 'sounds/whitenoise/ac.mp4', color: '#22d3ee' }
        ]
    },
    binaural: {
        name: '🧘 Meditasyon',
        sounds: [
            { id: 'alpha-waves', name: 'Alfa Dalgaları', icon: '🧠', file: 'sounds/binaural/binaural-alpha.wav', color: '#6366f1' },
            { id: 'beta-waves', name: 'Beta Dalgaları', icon: '⚡', file: 'sounds/binaural/binaural-beta.wav', color: '#f59e0b' },
            { id: 'theta-waves', name: 'Teta Dalgaları', icon: '🌊', file: 'sounds/binaural/binaural-theta.wav', color: '#8b5cf6' },
            { id: 'delta-waves', name: 'Delta Dalgaları', icon: '😴', file: 'sounds/binaural/binaural-delta.wav', color: '#1e40af' },
            { id: 'gamma-waves', name: 'Gama Dalgaları', icon: '✨', file: 'sounds/binaural/binaural-gamma.wav', color: '#ec4899' },
            { id: 'bowl', name: 'Tibet Çanağı', icon: '🔔', file: 'sounds/binaural/singing-bowl.mp4', color: '#eab308' }
        ]
    }
};

// Simple Sound Manager using HTML5 Audio
class SoundManager {
    constructor() {
        this.sounds = new Map();
        this.activeSounds = new Set();
        this.volumes = {};
        this.masterVolume = 0.8;
        this.isMuted = false;
        this.previousMasterVolume = 0.8;
        this.crossfadeEnabled = true;
        this.meanderEnabled = false;
        this.meanderInterval = null;
    }

    getSoundData(soundId) {
        for (const category of Object.values(SOUND_CATEGORIES)) {
            const sound = category.sounds.find(s => s.id === soundId);
            if (sound) return sound;
        }
        return null;
    }

    async play(soundId, volume = 0.5) {
        if (this.activeSounds.has(soundId)) {
            this.stop(soundId);
        }

        const soundData = this.getSoundData(soundId);
        if (!soundData) {
            console.warn('Sound not found:', soundId);
            return;
        }

        // Show loading state on card
        const card = document.querySelector(`[data-sound="${soundId}"]`);
        if (card) card.classList.add('loading');

        try {
            const audio = new Audio(soundData.file);
            audio.loop = true;
            audio.volume = volume * this.masterVolume;

            this.sounds.set(soundId, { audio, data: soundData });
            this.volumes[soundId] = volume;
            this.activeSounds.add(soundId);

            if (this.crossfadeEnabled) {
                audio.volume = 0;
                await audio.play();
                this.fadeIn(soundId, volume);
            } else {
                await audio.play();
            }

            // Remove loading, show active
            if (card) {
                card.classList.remove('loading');
                card.classList.add('active');
            }

            console.log('🎵 Playing:', soundId);
            window.dispatchEvent(new CustomEvent('soundStarted', { detail: { soundId, volume } }));

        } catch (error) {
            console.error('Error playing sound:', soundId, error);
            if (card) card.classList.remove('loading');
            this.activeSounds.delete(soundId);
        }
    }

    stop(soundId) {
        const sound = this.sounds.get(soundId);
        if (!sound) return;

        if (this.crossfadeEnabled) {
            this.fadeOut(soundId, () => {
                sound.audio.pause();
                sound.audio.currentTime = 0;
                this.sounds.delete(soundId);
            });
        } else {
            sound.audio.pause();
            sound.audio.currentTime = 0;
            this.sounds.delete(soundId);
        }

        this.activeSounds.delete(soundId);
        delete this.volumes[soundId];
        window.dispatchEvent(new CustomEvent('soundStopped', { detail: { soundId } }));
    }

    setVolume(soundId, volume) {
        const sound = this.sounds.get(soundId);
        if (!sound) return;

        this.volumes[soundId] = volume;
        sound.audio.volume = volume * this.masterVolume;
        window.dispatchEvent(new CustomEvent('volumeChanged', { detail: { soundId, volume } }));
    }

    setMasterVolume(volume) {
        this.masterVolume = volume;
        this.sounds.forEach((sound, soundId) => {
            const individualVolume = this.volumes[soundId] || 0.5;
            sound.audio.volume = individualVolume * volume;
        });
    }

    toggleMute() {
        if (this.isMuted) {
            this.setMasterVolume(this.previousMasterVolume);
            this.isMuted = false;
        } else {
            this.previousMasterVolume = this.masterVolume;
            this.setMasterVolume(0);
            this.isMuted = true;
        }
        return this.isMuted;
    }

    fadeIn(soundId, targetVolume, duration = 500) {
        const sound = this.sounds.get(soundId);
        if (!sound) return;

        const endVolume = targetVolume * this.masterVolume;
        const steps = 20;
        const stepDuration = duration / steps;
        const volumeStep = endVolume / steps;

        let currentStep = 0;
        const fadeInterval = setInterval(() => {
            currentStep++;
            sound.audio.volume = Math.min(endVolume, volumeStep * currentStep);
            if (currentStep >= steps) clearInterval(fadeInterval);
        }, stepDuration);
    }

    fadeOut(soundId, callback, duration = 500) {
        const sound = this.sounds.get(soundId);
        if (!sound) { callback?.(); return; }

        const startVolume = sound.audio.volume;
        const steps = 20;
        const stepDuration = duration / steps;
        const volumeStep = startVolume / steps;

        let currentStep = 0;
        const fadeInterval = setInterval(() => {
            currentStep++;
            sound.audio.volume = Math.max(0, startVolume - (volumeStep * currentStep));
            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                callback?.();
            }
        }, stepDuration);
    }

    fadeOutAll(duration = 5000) {
        const fadeStep = 100;
        const steps = duration / fadeStep;
        const volumeStep = this.masterVolume / steps;

        let currentStep = 0;
        const fadeInterval = setInterval(() => {
            currentStep++;
            this.setMasterVolume(Math.max(0, this.masterVolume - volumeStep));
            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                this.stopAll();
            }
        }, fadeStep);
        return fadeInterval;
    }

    stopAll() {
        Array.from(this.activeSounds).forEach(soundId => this.stop(soundId));
    }

    getActiveSounds() {
        return Array.from(this.activeSounds);
    }

    getVolumes() {
        return { ...this.volumes };
    }

    startMeander() {
        if (this.meanderInterval) return;
        this.meanderEnabled = true;
        this.meanderInterval = setInterval(() => {
            this.activeSounds.forEach(soundId => {
                const currentVolume = this.volumes[soundId] || 0.5;
                const drift = (Math.random() - 0.5) * 0.1;
                const newVolume = Math.max(0.1, Math.min(1, currentVolume + drift));
                this.setVolume(soundId, newVolume);
            });
        }, 3000);
    }

    stopMeander() {
        this.meanderEnabled = false;
        if (this.meanderInterval) {
            clearInterval(this.meanderInterval);
            this.meanderInterval = null;
        }
    }

    exportState() {
        return {
            volumes: this.getVolumes(),
            masterVolume: this.masterVolume,
            activeSounds: this.getActiveSounds()
        };
    }

    async importState(state) {
        this.stopAll();
        this.setMasterVolume(state.masterVolume || 0.8);
        for (const soundId of state.activeSounds || []) {
            const volume = state.volumes[soundId] || 0.5;
            await this.play(soundId, volume);
        }
    }
}

// Create global instance
const soundManager = new SoundManager();
window.SOUND_CATEGORIES = SOUND_CATEGORIES;
window.soundManager = soundManager;
