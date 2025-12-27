// ===================================
// ZENITH AMBIENT - FAVORITES SYSTEM
// ===================================

class FavoritesManager {
    constructor() {
        this.favorites = this.load();
    }

    load() {
        const saved = localStorage.getItem('zenith-favorites');
        return saved ? JSON.parse(saved) : [];
    }

    save() {
        localStorage.setItem('zenith-favorites', JSON.stringify(this.favorites));
    }

    isFavorite(soundId) {
        return this.favorites.includes(soundId);
    }

    toggle(soundId) {
        if (this.isFavorite(soundId)) {
            this.favorites = this.favorites.filter(id => id !== soundId);
        } else {
            this.favorites.push(soundId);
        }
        this.save();
        return this.isFavorite(soundId);
    }

    getAll() {
        return this.favorites;
    }

    getFavoriteSounds() {
        const sounds = [];
        for (const category of Object.values(SOUND_CATEGORIES)) {
            for (const sound of category.sounds) {
                if (this.favorites.includes(sound.id)) {
                    sounds.push(sound);
                }
            }
        }
        return sounds;
    }
}

// Create global instance
const favoritesManager = new FavoritesManager();
window.favoritesManager = favoritesManager;
