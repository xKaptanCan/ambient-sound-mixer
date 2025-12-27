// ===================================
// ZENITH AMBIENT - PRESETS
// ===================================

const BUILTIN_PRESETS = [
    // ===== RAIN & WEATHER =====
    {
        id: 'rainy-cafe',
        name: 'Yağmurlu Kafe',
        icon: '☕',
        description: 'Kafede otururken yağmur sesi',
        sounds: { 'rain-gentle': 0.6, 'cafe': 0.4, 'thunder': 0.2 },
        theme: 'rain'
    },
    {
        id: 'city-rain',
        name: 'Şehir Yağmuru',
        icon: '🌧️',
        description: 'Yağmurlu şehir gecesi',
        sounds: { 'rain-heavy': 0.5, 'city': 0.3, 'thunder': 0.3 },
        theme: 'rain'
    },
    {
        id: 'thunderstorm',
        name: 'Fırtına Gecesi',
        icon: '⛈️',
        description: 'Şiddetli fırtına',
        sounds: { 'rain-heavy': 0.7, 'thunder': 0.6, 'howling-wind': 0.4 },
        theme: 'rain'
    },
    {
        id: 'rain-tent',
        name: 'Çadırda Yağmur',
        icon: '⛺',
        description: 'Kamp çadırında yağmur',
        sounds: { 'rain-tent': 0.7, 'crickets': 0.3, 'wind': 0.2 },
        theme: 'rain'
    },
    {
        id: 'night-drive',
        name: 'Gece Sürüşü',
        icon: '🚗',
        description: 'Yağmurlu gece yolculuğu',
        sounds: { 'rain-roof': 0.5, 'city': 0.2, 'wipers': 0.4 },
        theme: 'rain'
    },

    // ===== NATURE =====
    {
        id: 'forest-camp',
        name: 'Orman Kampı',
        icon: '🏕️',
        description: 'Gece ormanda kamp',
        sounds: { 'jungle': 0.5, 'fire': 0.6, 'crickets': 0.4, 'owl': 0.2 },
        theme: 'fire'
    },
    {
        id: 'ocean-sunrise',
        name: 'Sahil Şafağı',
        icon: '🌅',
        description: 'Gün doğumunda okyanus',
        sounds: { 'ocean': 0.7, 'birds': 0.3, 'wind': 0.2 },
        theme: 'ocean'
    },
    {
        id: 'tropical-forest',
        name: 'Tropik Orman',
        icon: '🌴',
        description: 'Yağmur ormanının sesleri',
        sounds: { 'rain-heavy': 0.4, 'jungle': 0.5, 'birds': 0.4, 'river': 0.3 },
        theme: 'forest'
    },
    {
        id: 'mountain-cabin',
        name: 'Dağ Evi',
        icon: '🏔️',
        description: 'Karlı dağda sıcak ev',
        sounds: { 'fire': 0.6, 'walk-snow': 0.3, 'howling-wind': 0.4 },
        theme: 'fire'
    },
    {
        id: 'waterfall-valley',
        name: 'Şelale Vadisi',
        icon: '💧',
        description: 'Huzurlu şelale sesi',
        sounds: { 'waterfall': 0.6, 'birds': 0.3, 'river': 0.4 },
        theme: 'ocean'
    },
    {
        id: 'summer-night',
        name: 'Yaz Gecesi',
        icon: '🌙',
        description: 'Sıcak yaz gecesi',
        sounds: { 'crickets': 0.5, 'owl': 0.3, 'wind-trees': 0.3 },
        theme: 'night-sounds'
    },
    {
        id: 'japanese-garden',
        name: 'Japon Bahçesi',
        icon: '🎋',
        description: 'Zen bahçesi huzuru',
        sounds: { 'river': 0.5, 'wind-chimes': 0.3, 'birds': 0.2 },
        theme: 'meditation'
    },

    // ===== FOCUS & WORK =====
    {
        id: 'deep-focus',
        name: 'Derin Odaklanma',
        icon: '🧠',
        description: 'Çalışma ve konsantrasyon',
        sounds: { 'brown-noise': 0.4, 'rain-gentle': 0.3 },
        theme: 'night-sounds'
    },
    {
        id: 'cozy-library',
        name: 'Huzurlu Kütüphane',
        icon: '📚',
        description: 'Sessiz çalışma ortamı',
        sounds: { 'library': 0.3, 'rain-window': 0.4, 'clock': 0.2 },
        theme: 'rain'
    },
    {
        id: 'office-ambience',
        name: 'Ofis Ortamı',
        icon: '💼',
        description: 'Rahat ofis sesleri',
        sounds: { 'office': 0.4, 'keyboard': 0.3, 'fan': 0.2 },
        theme: 'night-sounds'
    },
    {
        id: 'writer-room',
        name: 'Yazar Odası',
        icon: '✍️',
        description: 'İlham verici yazı ortamı',
        sounds: { 'typewriter': 0.4, 'rain-window': 0.5, 'clock': 0.2 },
        theme: 'rain'
    },

    // ===== RELAXATION =====
    {
        id: 'meditation',
        name: 'Meditasyon',
        icon: '🧘',
        description: 'Huzurlu meditasyon',
        sounds: { 'bowl': 0.5, 'river': 0.3, 'wind': 0.2 },
        theme: 'meditation'
    },
    {
        id: 'spa-retreat',
        name: 'Spa Merkezi',
        icon: '🧖',
        description: 'Rahatlatıcı spa ortamı',
        sounds: { 'droplets': 0.5, 'bowl': 0.4, 'wind-chimes': 0.3 },
        theme: 'meditation'
    },
    {
        id: 'sleep-easy',
        name: 'Rahat Uyku',
        icon: '😴',
        description: 'Uyku için ideal',
        sounds: { 'pink-noise': 0.3, 'rain-gentle': 0.4, 'fan': 0.2 },
        theme: 'night-sounds'
    },

    // ===== TRANSPORT =====
    {
        id: 'train-journey',
        name: 'Tren Yolculuğu',
        icon: '🚂',
        description: 'Uzun bir tren yolculuğu',
        sounds: { 'train': 0.6, 'rain-window': 0.4 },
        theme: 'rain'
    },
    {
        id: 'airplane-cabin',
        name: 'Uçak Kabini',
        icon: '✈️',
        description: 'Uçuş sırasında',
        sounds: { 'airplane': 0.5, 'white-noise': 0.3 },
        theme: 'night-sounds'
    },
    {
        id: 'sailboat',
        name: 'Yelkenli Gemi',
        icon: '⛵',
        description: 'Denizde yelken',
        sounds: { 'sailboat': 0.5, 'ocean': 0.4, 'wind': 0.3 },
        theme: 'ocean'
    },

    // ===== SPECIAL =====
    {
        id: 'space-station',
        name: 'Uzay İstasyonu',
        icon: '🛸',
        description: 'Yıldızlar arasında',
        sounds: { 'white-noise': 0.3, 'fan': 0.4 },
        theme: 'night-sounds'
    },
    {
        id: 'underwater',
        name: 'Su Altı',
        icon: '🤿',
        description: 'Derin deniz sessizliği',
        sounds: { 'underwater': 0.6, 'whale': 0.3, 'bubbles': 0.4 },
        theme: 'ocean'
    },
    {
        id: 'jazz-club',
        name: 'Vinyl Gece',
        icon: '🎷',
        description: 'Nostaljik plak sesi',
        sounds: { 'vinyl': 0.5, 'cafe': 0.4, 'rain-window': 0.3 },
        theme: 'fire'
    }
];

// Inspirational quotes for Zen Mode
// Inspirational quotes for Zen Mode
const ZEN_QUOTES = {
    tr: [
        { text: "Sessizlik, kelimelerin söyleyemediğini söyler.", author: "Lao Tzu" },
        { text: "Doğanın hızında sırlar vardır.", author: "Ralph Waldo Emerson" },
        { text: "Huzur içeri bakmakla bulunur.", author: "Buddha" },
        { text: "Hiçbir şey yapmadan otur, bahar gelsin ve çimen kendi kendine büyüsün.", author: "Zen Atasözü" },
        { text: "Şu anı yaşa. Bu an senin tek gerçekliğin.", author: "Buddha" },
        { text: "Su yolunu engel olmadan bulur.", author: "Lao Tzu" },
        { text: "Düşünceler gelip gider, ama sen kalırsın.", author: "Mooji" },
        { text: "Derin bir nefes al ve bırak gitsin.", author: "Anonim" },
        { text: "Hayat, şimdi ve burada gerçekleşiyor.", author: "Thich Nhat Hanh" },
        { text: "Sessizlikte büyük güç vardır.", author: "Eckhart Tolle" }
    ],
    en: [
        { text: "Silence says what words cannot.", author: "Lao Tzu" },
        { text: "Adopt the pace of nature: her secret is patience.", author: "Ralph Waldo Emerson" },
        { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
        { text: "Sitting quietly, doing nothing, Spring comes, and the grass grows by itself.", author: "Zen Proverb" },
        { text: "Live in the moment. This moment is your only reality.", author: "Buddha" },
        { text: "Water finds its way without obstacle.", author: "Lao Tzu" },
        { text: "Thoughts come and go, but you remain.", author: "Mooji" },
        { text: "Take a deep breath and let it go.", author: "Anonymous" },
        { text: "Life is available only in the present moment.", author: "Thich Nhat Hanh" },
        { text: "Silence is a source of great strength.", author: "Lao Tzu" }
    ],
    de: [
        { text: "Stille spricht, wenn Worte es nicht können.", author: "Lao Tzu" },
        { text: "Nimm das Tempo der Natur an: ihr Geheimnis ist Geduld.", author: "Ralph Waldo Emerson" },
        { text: "Frieden kommt von innen. Suche ihn nicht im Außen.", author: "Buddha" },
        { text: "Lebe den Augenblick. Dieser Moment ist deine einzige Realität.", author: "Buddha" },
        { text: "Atme tief ein und lass los.", author: "Unbekannt" }
    ],
    fr: [
        { text: "Le silence dit ce que les mots ne peuvent pas.", author: "Lao Tzu" },
        { text: "Adoptez le rythme de la nature : son secret est la patience.", author: "Ralph Waldo Emerson" },
        { text: "La paix vient de l'intérieur. Ne la cherchez pas à l'extérieur.", author: "Bouddha" },
        { text: "Vivez l'instant présent. Ce moment est votre seule réalité.", author: "Bouddha" },
        { text: "Prenez une grande respiration et lâchez prise.", author: "Anonyme" }
    ],
    es: [
        { text: "El silencio dice lo que las palabras no pueden.", author: "Lao Tzu" },
        { text: "Adopta el ritmo de la naturaleza: su secreto es la paciencia.", author: "Ralph Waldo Emerson" },
        { text: "La paz viene de adentro. No la busques afuera.", author: "Buda" },
        { text: "Vive el momento. Este momento es tu única realidad.", author: "Buda" },
        { text: "Respira hondo y déjalo ir.", author: "Anónimo" }
    ],
    pt: [
        { text: "O silêncio diz o que as palavras não podem.", author: "Lao Tzu" },
        { text: "Adote o ritmo da natureza: o segredo dela é a paciência.", author: "Ralph Waldo Emerson" },
        { text: "A paz vem de dentro. Não a procure fora.", author: "Buda" },
        { text: "Viva o momento. Este momento é a sua única realidade.", author: "Buda" },
        { text: "Respire fundo e deixe ir.", author: "Anônimo" }
    ],
    ru: [
        { text: "Тишина говорит то, что не могут слова.", author: "Лао-цзы" },
        { text: "Примите темп природы: её секрет — терпение.", author: "Ральф Уолдо Эмерсон" },
        { text: "Мир приходит изнутри. Не ищите его снаружи.", author: "Будда" },
        { text: "Живи настоящим моментом. Этот момент — твоя единственная реальность.", author: "Будда" },
        { text: "Сделай глубокий вдох и отпусти.", author: "Аноним" }
    ],
    zh: [
        { text: "沉默胜过千言万语。", author: "老子" },
        { text: "效法自然的节奏：它的秘密是耐心。", author: "爱默生" },
        { text: "内心的平静。不要向外寻求。", author: "佛陀" },
        { text: "活在当下。这一刻是你唯一的现实。", author: "佛陀" },
        { text: "深呼吸，放手。", author: "佚名" }
    ],
    ja: [
        { text: "沈黙は言葉以上のものを語る。", author: "老子" },
        { text: "自然のペースを取り入れなさい。その秘密は忍耐です。", author: "エマーソン" },
        { text: "平和は内から来る。外に求めてはいけない。", author: "ブッダ" },
        { text: "今を生きる。この瞬間だけがあなたの現実です。", author: "ブッダ" },
        { text: "深く息を吸って、手放しなさい。", author: "匿名" }
    ],
    ar: [
        { text: "الصمت يتحدث بما لا تستطيع الكلمات قوله.", author: "لاо تزو" },
        { text: "اتخذ وتيرة الطبيعة: سرها هو الصبر.", author: "رالف والدو إيمرسون" },
        { text: "السلام يأتي من الداخل. لا تبحث عنه في الخارج.", author: "بوذا" },
        { text: "عش اللحظة. هذه اللحظة هي واقعك الوحيد.", author: "بوذا" },
        { text: "خذ نفسا عميقا واتركه يذهب.", author: "مجهول" }
    ]
};

// Preset Manager
class PresetManager {
    constructor() {
        this.userPresets = [];
        this.currentPreset = null;
        this.loadUserPresets();
    }

    loadUserPresets() {
        const saved = localStorage.getItem('zenith-user-presets');
        if (saved) {
            try {
                this.userPresets = JSON.parse(saved);
            } catch (e) {
                this.userPresets = [];
            }
        }
    }

    saveUserPresets() {
        localStorage.setItem('zenith-user-presets', JSON.stringify(this.userPresets));
    }

    getBuiltinPresets() {
        return BUILTIN_PRESETS;
    }

    getUserPresets() {
        return this.userPresets;
    }

    saveCurrentAsPreset(name) {
        const state = soundManager.exportState();

        if (state.activeSounds.length === 0) {
            return { success: false, message: 'Kaydedilecek aktif ses yok!' };
        }

        const preset = {
            id: 'user-' + Date.now(),
            name: name,
            icon: '🎵',
            description: 'Özel karışım',
            sounds: state.volumes,
            isUserPreset: true,
            createdAt: new Date().toISOString()
        };

        this.userPresets.push(preset);
        this.saveUserPresets();

        return { success: true, preset };
    }

    deleteUserPreset(presetId) {
        this.userPresets = this.userPresets.filter(p => p.id !== presetId);
        this.saveUserPresets();
    }

    async applyPreset(presetId) {
        const preset = [...BUILTIN_PRESETS, ...this.userPresets].find(p => p.id === presetId);
        if (!preset) return false;

        // Stop all current sounds
        soundManager.stopAll();

        // Start preset sounds
        for (const [soundId, volume] of Object.entries(preset.sounds)) {
            await soundManager.play(soundId, volume);
        }

        this.currentPreset = preset;

        // Apply theme if specified
        if (preset.theme) {
            this.applyTheme(preset.theme);
        }

        return true;
    }

    applyTheme(themeName) {
        // Remove existing theme classes
        document.body.classList.remove('theme-rain', 'theme-fire', 'theme-forest', 'theme-ocean', 'theme-night-sounds', 'theme-meditation');

        // Add new theme class
        if (themeName) {
            document.body.classList.add('theme-' + themeName);
        }
    }

    getCurrentPreset() {
        return this.currentPreset;
    }

    clearCurrentPreset() {
        this.currentPreset = null;
    }

    getRandomQuote() {
        const lang = i18n.getCurrentLanguage();
        // Fallback to English if language not found, or 'tr' if English not found (unlikely)
        const quotes = ZEN_QUOTES[lang] || ZEN_QUOTES['en'] || ZEN_QUOTES['tr'];
        return quotes[Math.floor(Math.random() * quotes.length)];
    }

    // Generate shareable URL
    generateShareUrl() {
        const state = soundManager.exportState();
        const params = new URLSearchParams();

        params.set('sounds', JSON.stringify(state.volumes));
        params.set('master', state.masterVolume);

        return window.location.origin + window.location.pathname + '?' + params.toString();
    }

    // Load from URL
    loadFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const soundsParam = params.get('sounds');
        const masterParam = params.get('master');

        if (soundsParam) {
            try {
                const sounds = JSON.parse(soundsParam);
                const state = {
                    volumes: sounds,
                    masterVolume: parseFloat(masterParam) || 0.8,
                    activeSounds: Object.keys(sounds)
                };
                soundManager.importState(state);
                return true;
            } catch (e) {
                console.warn('Could not load from URL', e);
            }
        }
        return false;
    }

    // Random mix generator
    async generateRandomMix(soundCount = 3) {
        const allSounds = [];
        for (const category of Object.values(SOUND_CATEGORIES)) {
            allSounds.push(...category.sounds);
        }

        // Shuffle and pick random sounds
        const shuffled = allSounds.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, soundCount);

        soundManager.stopAll();

        for (const sound of selected) {
            const volume = 0.3 + Math.random() * 0.4;
            await soundManager.play(sound.id, volume);
        }

        this.currentPreset = null;
    }
}

// Create global instance
const presetManager = new PresetManager();
window.presetManager = presetManager;
window.BUILTIN_PRESETS = BUILTIN_PRESETS;
window.ZEN_QUOTES = ZEN_QUOTES;
