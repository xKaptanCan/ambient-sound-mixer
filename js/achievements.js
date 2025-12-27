// ===================================
// ZENITH AMBIENT - ACHIEVEMENTS SYSTEM
// Gamification with badges and streaks
// ===================================

// Achievement definitions
const ACHIEVEMENTS = {
    'first-timer': {
        id: 'first-timer',
        name: 'İlk Adım',
        description: 'İlk sesini çaldın!',
        icon: '🌟',
        condition: (stats) => stats.totalSoundsPlayed >= 1
    },
    'explorer': {
        id: 'explorer',
        name: 'Kaşif',
        description: '10 farklı ses denedin',
        icon: '🎧',
        condition: (stats) => stats.uniqueSounds >= 10
    },
    'sound-collector': {
        id: 'sound-collector',
        name: 'Ses Koleksiyoncusu',
        description: '25 farklı ses denedin',
        icon: '🎵',
        condition: (stats) => stats.uniqueSounds >= 25
    },
    'night-owl': {
        id: 'night-owl',
        name: 'Gece Kuşu',
        description: 'Gece 2\'den sonra kullandın',
        icon: '🦉',
        condition: (stats) => stats.usedAfterMidnight
    },
    'early-bird': {
        id: 'early-bird',
        name: 'Erken Kalkan',
        description: 'Sabah 6\'dan önce kullandın',
        icon: '🐦',
        condition: (stats) => stats.usedBeforeSix
    },
    'zen-master': {
        id: 'zen-master',
        name: 'Zen Ustası',
        description: '10 saat meditasyon sesleri dinledin',
        icon: '🧘',
        condition: (stats) => stats.categoryMinutes?.binaural >= 600
    },
    'rain-lover': {
        id: 'rain-lover',
        name: 'Yağmur Aşığı',
        description: '10 saat yağmur sesi dinledin',
        icon: '🌧️',
        condition: (stats) => stats.categoryMinutes?.rain >= 600
    },
    'fire-keeper': {
        id: 'fire-keeper',
        name: 'Ateş Bekçisi',
        description: '5 saat ateş sesi dinledin',
        icon: '🔥',
        condition: (stats) => stats.soundMinutes?.fire >= 300
    },
    'mix-master': {
        id: 'mix-master',
        name: 'Mix Ustası',
        description: '10 preset kaydettın',
        icon: '🎯',
        condition: (stats) => stats.presetsCreated >= 10
    },
    'weekly-warrior': {
        id: 'weekly-warrior',
        name: 'Haftalık Savaşçı',
        description: '7 gün üst üste kullandın',
        icon: '📅',
        condition: (stats) => stats.currentStreak >= 7
    },
    'monthly-champion': {
        id: 'monthly-champion',
        name: 'Aylık Şampiyon',
        description: '30 gün üst üste kullandın',
        icon: '🏆',
        condition: (stats) => stats.currentStreak >= 30
    },
    'century-club': {
        id: 'century-club',
        name: 'Yüz Saat Kulübü',
        description: '100 saat toplam dinleme',
        icon: '💯',
        condition: (stats) => stats.totalMinutes >= 6000
    },
    'frequency-healer': {
        id: 'frequency-healer',
        name: 'Frekans Şifacısı',
        description: 'Tüm Solfeggio frekanslarını denedin',
        icon: '🎛️',
        condition: (stats) => stats.allSolfeggioTried
    },
    'breathwork-master': {
        id: 'breathwork-master',
        name: 'Nefes Ustası',
        description: '10 nefes egzersizi tamamladın',
        icon: '💨',
        condition: (stats) => stats.breathingCompleted >= 10
    }
};

class AchievementManager {
    constructor() {
        this.stats = this.loadStats();
        this.unlockedAchievements = this.loadUnlocked();
        this.modal = null;
    }

    init() {
        this.createModal();
        this.trackUsageTime();
    }

    loadStats() {
        const saved = localStorage.getItem('zenith-achievement-stats');
        return saved ? JSON.parse(saved) : {
            totalSoundsPlayed: 0,
            uniqueSounds: [],
            totalMinutes: 0,
            categoryMinutes: {},
            soundMinutes: {},
            presetsCreated: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastActiveDate: null,
            usedAfterMidnight: false,
            usedBeforeSix: false,
            allSolfeggioTried: false,
            solfeggioTried: [],
            breathingCompleted: 0
        };
    }

    saveStats() {
        localStorage.setItem('zenith-achievement-stats', JSON.stringify(this.stats));
    }

    loadUnlocked() {
        const saved = localStorage.getItem('zenith-unlocked-achievements');
        return saved ? JSON.parse(saved) : [];
    }

    saveUnlocked() {
        localStorage.setItem('zenith-unlocked-achievements', JSON.stringify(this.unlockedAchievements));
    }

    trackUsageTime() {
        // Track usage time every minute
        setInterval(() => {
            if (typeof soundManager !== 'undefined' && soundManager.getActiveSounds().length > 0) {
                this.stats.totalMinutes = (this.stats.totalMinutes || 0) + 1;
                this.saveStats();
            }
        }, 60000);
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.id = 'achievements-modal';
        this.modal.className = 'modal';
        this.modal.innerHTML = `
            <div class="modal-content achievements-content">
                <h2>🏆 ${i18n.t('achievements.title', 'Başarılar')}</h2>
                <div class="achievements-stats" id="achievements-stats"></div>
                <div class="achievements-grid" id="achievements-grid"></div>
                <div class="modal-actions">
                    <button class="btn-primary" data-close="achievements-modal">${i18n.t('common.ok', 'Tamam')}</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);

        this.modal.querySelector('[data-close]').addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
    }

    renderAchievements() {
        const statsContainer = this.modal.querySelector('#achievements-stats');
        const grid = this.modal.querySelector('#achievements-grid');

        // Stats
        statsContainer.innerHTML = `
            <div class="achievement-stat">
                <span class="stat-value">${this.unlockedAchievements.length}/${Object.keys(ACHIEVEMENTS).length}</span>
                <span class="stat-label">${i18n.t('settings.achievements', 'Başarı')}</span>
            </div>
            <div class="achievement-stat">
                <span class="stat-value">🔥 ${this.stats.currentStreak}</span>
                <span class="stat-label">${i18n.t('achievements.streak', 'Günlük Seri')}</span>
            </div>
            <div class="achievement-stat">
                <span class="stat-value">${Math.floor(this.stats.totalMinutes / 60)}h</span>
                <span class="stat-label">${i18n.t('achievements.total', 'Toplam Süre')}</span>
            </div>
        `;

        // Achievement cards
        grid.innerHTML = '';
        Object.values(ACHIEVEMENTS).forEach(achievement => {
            const isUnlocked = this.unlockedAchievements.includes(achievement.id);
            const card = document.createElement('div');
            card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;

            // Translate name and description
            const name = i18n.t(`achieve.${achievement.id}.name`, achievement.name);
            const desc = i18n.t(`achieve.${achievement.id}.desc`, achievement.description);

            card.innerHTML = `
                <span class="achievement-icon">${achievement.icon}</span>
                <div class="achievement-info">
                    <span class="achievement-name">${name}</span>
                    <span class="achievement-desc">${desc}</span>
                </div>
                ${isUnlocked ? '<span class="achievement-check">✓</span>' : ''}
            `;
            grid.appendChild(card);
        });
    }

    // Track sounds and other methods remain the same...

    // ... skipping unchanged methods until unlockAchievement ...

    unlockAchievement(achievement) {
        if (this.unlockedAchievements.includes(achievement.id)) return;

        this.unlockedAchievements.push(achievement.id);
        this.saveUnlocked();

        // Show notification
        this.showUnlockNotification(achievement);
    }

    showUnlockNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';

        const name = i18n.t(`achieve.${achievement.id}.name`, achievement.name);
        const title = i18n.t('achievements.unlocked', 'Başarı Kazanıldı!');

        notification.innerHTML = `
            <span class="achievement-notif-icon">${achievement.icon}</span>
            <div class="achievement-notif-info">
                <span class="achievement-notif-title">${title}</span>
                <span class="achievement-notif-name">${name}</span>
            </div>
        `;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);

        // Play sound (if available)
        if (typeof app !== 'undefined') {
            app.showToast(`🏆 ${name}`);
        }
    }
}

// Create global instance
const achievementManager = new AchievementManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    achievementManager.init();
});

// Export
window.achievementManager = achievementManager;
window.ACHIEVEMENTS = ACHIEVEMENTS;
