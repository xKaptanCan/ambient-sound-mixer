// ===================================
// ZENITH AMBIENT - FREQUENCY GENERATOR
// Solfeggio & Binaural Beat Generator
// ===================================

// Solfeggio Frequencies - Ancient healing tones
const SOLFEGGIO_FREQUENCIES = [
    { hz: 174, name: '174 Hz', description: 'Ağrı Giderici', icon: '💆', color: '#ef4444' },
    { hz: 285, name: '285 Hz', description: 'Doku İyileştirme', icon: '🩹', color: '#f97316' },
    { hz: 396, name: '396 Hz', description: 'Korku & Suçluluk', icon: '🕊️', color: '#eab308' },
    { hz: 417, name: '417 Hz', description: 'Değişim', icon: '🔄', color: '#84cc16' },
    { hz: 432, name: '432 Hz', description: 'Evrensel Uyum', icon: '🌍', color: '#22c55e' },
    { hz: 528, name: '528 Hz', description: 'DNA Onarım', icon: '🧬', color: '#06b6d4' },
    { hz: 639, name: '639 Hz', description: 'İlişkiler', icon: '💕', color: '#3b82f6' },
    { hz: 741, name: '741 Hz', description: 'Uyanış', icon: '👁️', color: '#8b5cf6' },
    { hz: 852, name: '852 Hz', description: 'Sezgi', icon: '🔮', color: '#a855f7' },
    { hz: 963, name: '963 Hz', description: 'Aydınlanma', icon: '✨', color: '#ec4899' }
];

// Binaural Beat Frequencies (difference between left/right ear)
const BINAURAL_BEATS = [
    { name: 'Delta', hz: 2, range: '0.5-4 Hz', description: 'Derin Uyku', icon: '😴', color: '#1e40af', baseHz: 200 },
    { name: 'Theta', hz: 6, range: '4-8 Hz', description: 'Meditasyon', icon: '🧘', color: '#7c3aed', baseHz: 200 },
    { name: 'Alpha', hz: 10, range: '8-12 Hz', description: 'Rahatlama', icon: '😌', color: '#06b6d4', baseHz: 200 },
    { name: 'Beta', hz: 20, range: '12-30 Hz', description: 'Odaklanma', icon: '🎯', color: '#22c55e', baseHz: 200 },
    { name: 'Gamma', hz: 40, range: '30-100 Hz', description: 'Öğrenme', icon: '🧠', color: '#f59e0b', baseHz: 200 }
];

class FrequencyGenerator {
    constructor() {
        this.audioContext = null;
        this.activeOscillators = new Map();
        this.masterGain = null;
        this.volume = 0.3;
        this.isPlaying = false;
    }

    init() {
        if (this.audioContext) return;

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = this.volume;
        this.masterGain.connect(this.audioContext.destination);
    }

    // Play a single frequency (Solfeggio)
    playSolfeggio(hz, id) {
        this.init();

        // Stop if already playing this frequency
        if (this.activeOscillators.has(id)) {
            this.stop(id);
            return false;
        }

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(hz, this.audioContext.currentTime);

        // Fade in
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.5);

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        oscillator.start();

        this.activeOscillators.set(id, { oscillator, gainNode, type: 'solfeggio' });
        this.isPlaying = true;

        console.log(`🎵 Playing ${hz}Hz`);
        return true;
    }

    // Play binaural beat (requires stereo headphones)
    playBinaural(beatHz, baseHz, id) {
        this.init();

        if (this.activeOscillators.has(id)) {
            this.stop(id);
            return false;
        }

        // Create stereo panner for left ear
        const leftOsc = this.audioContext.createOscillator();
        const leftGain = this.audioContext.createGain();
        const leftPanner = this.audioContext.createStereoPanner();

        leftOsc.type = 'sine';
        leftOsc.frequency.setValueAtTime(baseHz, this.audioContext.currentTime);
        leftPanner.pan.value = -1; // Full left
        leftGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        leftGain.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.5);

        leftOsc.connect(leftGain);
        leftGain.connect(leftPanner);
        leftPanner.connect(this.masterGain);
        leftOsc.start();

        // Create stereo panner for right ear (slightly different frequency)
        const rightOsc = this.audioContext.createOscillator();
        const rightGain = this.audioContext.createGain();
        const rightPanner = this.audioContext.createStereoPanner();

        rightOsc.type = 'sine';
        rightOsc.frequency.setValueAtTime(baseHz + beatHz, this.audioContext.currentTime);
        rightPanner.pan.value = 1; // Full right
        rightGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        rightGain.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.5);

        rightOsc.connect(rightGain);
        rightGain.connect(rightPanner);
        rightPanner.connect(this.masterGain);
        rightOsc.start();

        this.activeOscillators.set(id, {
            oscillators: [leftOsc, rightOsc],
            gainNodes: [leftGain, rightGain],
            type: 'binaural'
        });
        this.isPlaying = true;

        console.log(`🎧 Playing ${beatHz}Hz binaural beat (${baseHz}Hz base)`);
        return true;
    }

    // Play custom frequency
    playCustom(hz) {
        const id = 'custom-hz';

        // If already playing custom, stop it first
        if (this.activeOscillators.has(id)) {
            this.stop(id);
            return this.playSolfeggio(hz, id);
        }

        return this.playSolfeggio(hz, id);
    }

    // Stop custom frequency
    stopCustom() {
        this.stop('custom-hz');
    }

    stop(id) {
        const active = this.activeOscillators.get(id);
        if (!active) return;

        if (active.type === 'binaural') {
            active.gainNodes.forEach(g => {
                g.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.3);
            });
            setTimeout(() => {
                active.oscillators.forEach(o => o.stop());
            }, 350);
        } else {
            active.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.3);
            setTimeout(() => active.oscillator.stop(), 350);
        }

        this.activeOscillators.delete(id);
        this.isPlaying = this.activeOscillators.size > 0;
    }

    stopAll() {
        this.activeOscillators.forEach((_, id) => this.stop(id));
    }

    setVolume(volume) {
        this.volume = volume;
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(volume, this.audioContext.currentTime);
        }
    }

    isActive(id) {
        return this.activeOscillators.has(id);
    }

    getActiveFrequencies() {
        return Array.from(this.activeOscillators.keys());
    }
}

// Create global instance
const frequencyGenerator = new FrequencyGenerator();

// Export
window.frequencyGenerator = frequencyGenerator;
window.SOLFEGGIO_FREQUENCIES = SOLFEGGIO_FREQUENCIES;
window.BINAURAL_BEATS = BINAURAL_BEATS;
