// ===================================
// ZENITH AMBIENT - ANALYTICS SYSTEM
// Usage tracking and reports
// ===================================

class AnalyticsManager {
    constructor() {
        this.data = this.loadData();
        this.sessionStart = Date.now();
        this.modal = null;
    }

    init() {
        this.createModal();
        this.startSession();
        this.trackHourlyUsage();
    }

    loadData() {
        const saved = localStorage.getItem('zenith-analytics');
        return saved ? JSON.parse(saved) : {
            sessions: [],
            dailyUsage: {},
            soundUsage: {},
            categoryUsage: {},
            themeUsage: {},
            hourlyUsage: new Array(24).fill(0),
            weeklyData: [],
            totalSessions: 0,
            totalMinutes: 0,
            firstUseDate: new Date().toISOString()
        };
    }

    saveData() {
        localStorage.setItem('zenith-analytics', JSON.stringify(this.data));
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.id = 'analytics-modal';
        this.modal.className = 'modal';
        this.modal.innerHTML = `
            <div class="modal-content analytics-content">
                <h2>📊 ${i18n.t('analytics.title', 'Kullanım Raporları')}</h2>
                <div class="analytics-tabs">
                    <button class="analytics-tab active" data-tab="overview">${i18n.t('analytics.tab.overview', 'Genel')}</button>
                    <button class="analytics-tab" data-tab="sounds">${i18n.t('analytics.tab.sounds', 'Sesler')}</button>
                    <button class="analytics-tab" data-tab="trends">${i18n.t('analytics.tab.trends', 'Trendler')}</button>
                </div>
                <div class="analytics-body" id="analytics-body"></div>
                <div class="modal-actions">
                    <button class="btn-primary" data-close="analytics-modal">${i18n.t('common.ok', 'Tamam')}</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);

        // Tab switching
        this.modal.querySelectorAll('.analytics-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.modal.querySelectorAll('.analytics-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.renderTab(e.target.dataset.tab);
            });
        });

        // Close
        this.modal.querySelector('[data-close]').addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
    }

    open() {
        this.renderTab('overview');
        this.modal.classList.add('open');
    }

    close() {
        this.modal.classList.remove('open');
    }

    renderTab(tab) {
        const body = this.modal.querySelector('#analytics-body');

        switch (tab) {
            case 'overview':
                body.innerHTML = this.renderOverview();
                break;
            case 'sounds':
                body.innerHTML = this.renderSounds();
                break;
            case 'trends':
                body.innerHTML = this.renderTrends();
                break;
        }
    }

    renderOverview() {
        const today = new Date().toDateString();
        const todayMinutes = this.data.dailyUsage[today] || 0;
        const thisWeekMinutes = this.getWeekMinutes();
        const thisMonthMinutes = this.getMonthMinutes();

        return `
            <div class="analytics-overview">
                <div class="analytics-stat-grid">
                    <div class="analytics-stat-card">
                        <span class="stat-icon">📅</span>
                        <div class="stat-info">
                            <span class="stat-value">${Math.round(todayMinutes)} dk</span>
                            <span class="stat-label">${i18n.t('analytics.today', 'Bugün')}</span>
                        </div>
                    </div>
                    <div class="analytics-stat-card">
                        <span class="stat-icon">📊</span>
                        <div class="stat-info">
                            <span class="stat-value">${Math.round(thisWeekMinutes)} dk</span>
                            <span class="stat-label">${i18n.t('analytics.this_week', 'Bu Hafta')}</span>
                        </div>
                    </div>
                    <div class="analytics-stat-card">
                        <span class="stat-icon">🗓️</span>
                        <div class="stat-info">
                            <span class="stat-value">${Math.round(thisMonthMinutes / 60)}h</span>
                            <span class="stat-label">${i18n.t('analytics.this_month', 'Bu Ay')}</span>
                        </div>
                    </div>
                    <div class="analytics-stat-card">
                        <span class="stat-icon">⏱️</span>
                        <div class="stat-info">
                            <span class="stat-value">${Math.round(this.data.totalMinutes / 60)}h</span>
                            <span class="stat-label">${i18n.t('analytics.total', 'Toplam')}</span>
                        </div>
                    </div>
                </div>
                
                <div class="analytics-section">
                    <h3>🕐 ${i18n.t('analytics.hourly_dist', 'Saatlik Kullanım')}</h3>
                    <div class="hourly-chart" id="hourly-chart">
                        ${this.renderHourlyChart()}
                    </div>
                </div>
            </div>
        `;
    }

    renderHourlyChart() {
        const max = Math.max(...this.data.hourlyUsage, 1);
        let html = '<div class="hourly-bars">';

        for (let i = 0; i < 24; i++) {
            const height = (this.data.hourlyUsage[i] / max) * 100;
            const label = i === 0 ? '00' : i === 12 ? '12' : i === 23 ? '23' : '';
            html += `
                <div class="hourly-bar-wrapper">
                    <div class="hourly-bar" style="height: ${height}%" title="${i}:00 - ${Math.round(this.data.hourlyUsage[i])} dk"></div>
                    ${label ? `<span class="hourly-label">${label}</span>` : ''}
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    renderSounds() {
        const sortedSounds = Object.entries(this.data.soundUsage)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        const sortedCategories = Object.entries(this.data.categoryUsage)
            .sort((a, b) => b[1] - a[1]);

        return `
            <div class="analytics-sounds">
                <div class="analytics-section">
                    <h3>🎵 ${i18n.t('analytics.most_listened', 'En Çok Dinlenenler')}</h3>
                    <div class="sound-list">
                        ${sortedSounds.length ? sortedSounds.map(([id, mins], i) => `
                            <div class="sound-list-item">
                                <span class="sound-rank">#${i + 1}</span>
                                <span class="sound-name">${this.getSoundName(id)}</span>
                                <span class="sound-time">${Math.round(mins)} dk</span>
                            </div>
                        `).join('') : `<p class="no-data">${i18n.t('analytics.no_data', 'Henüz veri yok')}</p>`}
                    </div>
                </div>
                
                <div class="analytics-section">
                    <h3>📁 ${i18n.t('analytics.cat_dist', 'Kategori Kullanımı')}</h3>
                    <div class="category-bars">
                        ${sortedCategories.length ? sortedCategories.map(([cat, mins]) => {
            const max = sortedCategories[0]?.[1] || 1;
            const width = (mins / max) * 100;
            return `
                                <div class="category-bar-row">
                                    <span class="category-name">${this.getCategoryName(cat)}</span>
                                    <div class="category-bar-bg">
                                        <div class="category-bar-fill" style="width: ${width}%"></div>
                                    </div>
                                    <span class="category-time">${Math.round(mins)} dk</span>
                                </div>
                            `;
        }).join('') : `<p class="no-data">${i18n.t('analytics.no_data', 'Henüz veri yok')}</p>`}
                    </div>
                </div>
            </div>
        `;
    }

    renderTrends() {
        const last7Days = this.getLast7Days();

        return `
            <div class="analytics-trends">
                <div class="analytics-section">
                    <h3>📈 ${i18n.t('analytics.daily_usage', 'Günlük Kullanım')}</h3>
                    <div class="daily-chart">
                        ${last7Days.map(day => {
            const max = Math.max(...last7Days.map(d => d.minutes), 1);
            const height = (day.minutes / max) * 100;
            return `
                                <div class="daily-bar-wrapper">
                                    <div class="daily-bar" style="height: ${height}%"></div>
                                    <span class="daily-label">${day.label}</span>
                                    <span class="daily-value">${Math.round(day.minutes)} dk</span>
                                </div>
                            `;
        }).join('')}
                    </div>
                </div>
                
                <div class="analytics-section">
                    <h3>📊 ${i18n.t('analytics.summary', 'Summary')}</h3>
                    <div class="summary-stats">
                        <div class="summary-item">
                            <span>${i18n.t('analytics.total_sessions', 'Total Sessions')}:</span>
                            <strong>${this.data.totalSessions}</strong>
                        </div>
                        <div class="summary-item">
                            <span>${i18n.t('analytics.average', 'Average')}:</span>
                            <strong>${this.data.totalSessions ? Math.round(this.data.totalMinutes / this.data.totalSessions) : 0} ${i18n.t('common.minutes', 'min')}</strong>
                        </div>
                        <div class="summary-item">
                            <span>${i18n.t('analytics.first_use', 'First Use')}:</span>
                            <strong>${new Date(this.data.firstUseDate).toLocaleDateString()}</strong>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Helper methods
    getSoundName(id) {
        // Try to translate sound name first using key
        if (typeof i18n !== 'undefined') {
            const translated = i18n.t(`sound.${id}`); // This might return key if not found, but i18n.t implementation should be checked
            // My implementation of i18n.t returns key if default is not provided and key is missing? No, usually returns key.
            // But let's check if there is a sound object to fallback to its name.
        }

        if (typeof SOUND_CATEGORIES !== 'undefined') {
            for (const cat of Object.values(SOUND_CATEGORIES)) {
                const sound = cat.sounds?.find(s => s.id === id);
                if (sound) {
                    return i18n.t(`sound.${id}`, sound.name);
                }
            }
        }
        return id;
    }

    getCategoryName(catId) {
        return i18n.t(`cat.${catId}`, catId);
    }

    getWeekMinutes() {
        const now = new Date();
        let total = 0;
        for (let i = 0; i < 7; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            total += this.data.dailyUsage[date.toDateString()] || 0;
        }
        return total;
    }

    getMonthMinutes() {
        const now = new Date();
        let total = 0;
        for (let i = 0; i < 30; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            total += this.data.dailyUsage[date.toDateString()] || 0;
        }
        return total;
    }

    getLast7Days() {
        const days = [];
        const dayNames = [
            i18n.t('day.sun', 'Sun'), i18n.t('day.mon', 'Mon'), i18n.t('day.tue', 'Tue'),
            i18n.t('day.wed', 'Wed'), i18n.t('day.thu', 'Thu'), i18n.t('day.fri', 'Fri'), i18n.t('day.sat', 'Sat')
        ];
        const now = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            days.push({
                date: date.toDateString(),
                label: dayNames[date.getDay()],
                minutes: this.data.dailyUsage[date.toDateString()] || 0
            });
        }

        return days;
    }

    // Tracking methods
    startSession() {
        this.data.totalSessions++;
        this.saveData();

        // Track session end
        window.addEventListener('beforeunload', () => this.endSession());
    }

    endSession() {
        const duration = (Date.now() - this.sessionStart) / 1000 / 60; // minutes
        this.data.sessions.push({
            date: new Date().toISOString(),
            duration: duration
        });
        this.saveData();
    }

    trackSoundUsage(soundId, category, durationMinutes = 1 / 60) {
        // Sound usage
        if (!this.data.soundUsage[soundId]) {
            this.data.soundUsage[soundId] = 0;
        }
        this.data.soundUsage[soundId] += durationMinutes;

        // Category usage
        if (category) {
            if (!this.data.categoryUsage[category]) {
                this.data.categoryUsage[category] = 0;
            }
            this.data.categoryUsage[category] += durationMinutes;
        }

        // Daily usage
        const today = new Date().toDateString();
        if (!this.data.dailyUsage[today]) {
            this.data.dailyUsage[today] = 0;
        }
        this.data.dailyUsage[today] += durationMinutes;

        // Total
        this.data.totalMinutes += durationMinutes;

        this.saveData();
    }

    trackThemeUsage(theme) {
        if (!this.data.themeUsage[theme]) {
            this.data.themeUsage[theme] = 0;
        }
        this.data.themeUsage[theme]++;
        this.saveData();
    }

    trackHourlyUsage() {
        setInterval(() => {
            if (typeof soundManager !== 'undefined' && soundManager.getActiveSounds().length > 0) {
                const hour = new Date().getHours();
                this.data.hourlyUsage[hour] += 1 / 60;
                this.saveData();
            }
        }, 1000);
    }

    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `zenith-analytics-${new Date().toISOString().split('T')[0]}.json`;
        a.click();

        URL.revokeObjectURL(url);
    }
}

// Create global instance
const analyticsManager = new AnalyticsManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    analyticsManager.init();
});

// Export
window.analyticsManager = analyticsManager;
