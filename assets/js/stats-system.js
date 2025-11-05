/**
 * SISTEMA DE ESTADÍSTICAS - ACADEMIA DEL VALLENATO CARTAGENA
 * Versión: 2.0 | Sistema independiente y optimizado
 * Funcionalidades: Tracking, Analytics, Panel de Control
 */

class StatsSystem {
    constructor() {
        this.stats = {
            totalVisits: 0,
            pageViews: {},
            userSessions: {},
            conversions: 0,
            bounceRate: 0,
            avgSessionTime: 0
        };
        
        this.sessionStart = Date.now();
        this.currentPage = this.getCurrentPage();
        this.isPanelVisible = false;
        
        this.init();
    }

    // ==================== INICIALIZACIÓN ====================
    init() {
        this.loadStats();
        this.trackPageView();
        this.setupSessionTracking();
        this.setupStatsPanel();
        this.setupStatsToggle();
        this.setupRealTimeTracking();
        
        console.log('📊 StatsSystem - Sistema de estadísticas inicializado');
    }

    // ==================== TRACKING DE VISITAS ====================
    trackPageView() {
        // Incrementar visitas totales
        this.stats.totalVisits++;
        
        // Trackear vista de página actual
        if (!this.stats.pageViews[this.currentPage]) {
            this.stats.pageViews[this.currentPage] = 0;
        }
        this.stats.pageViews[this.currentPage]++;
        
        // Guardar en localStorage
        this.saveStats();
        
        // Actualizar display
        this.updateStatsDisplay();
        
        console.log(`📈 Página vista: ${this.currentPage}`);
    }

    setupSessionTracking() {
        // Iniciar sesión
        const sessionId = this.generateSessionId();
        this.stats.userSessions[sessionId] = {
            startTime: this.sessionStart,
            pages: [this.currentPage],
            events: []
        };

        // Trackear cambios de página
        let lastPage = this.currentPage;
        
        const observer = new MutationObserver(() => {
            const newPage = this.getCurrentPage();
            if (newPage !== lastPage) {
                this.trackPageChange(lastPage, newPage, sessionId);
                lastPage = newPage;
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Trackear tiempo de sesión
        window.addEventListener('beforeunload', () => {
            this.trackSessionEnd(sessionId);
        });
    }

    trackPageChange(fromPage, toPage, sessionId) {
        if (this.stats.userSessions[sessionId]) {
            this.stats.userSessions[sessionId].pages.push(toPage);
            this.saveStats();
        }
    }

    trackSessionEnd(sessionId) {
        if (this.stats.userSessions[sessionId]) {
            const session = this.stats.userSessions[sessionId];
            session.endTime = Date.now();
            session.duration = session.endTime - session.startTime;
            
            // Calcular métricas
            this.calculateSessionMetrics();
            this.saveStats();
        }
    }

    calculateSessionMetrics() {
        const sessions = Object.values(this.stats.userSessions);
        if (sessions.length === 0) return;

        // Tiempo promedio de sesión
        const totalDuration = sessions.reduce((sum, session) => 
            sum + (session.duration || 0), 0);
        this.stats.avgSessionTime = totalDuration / sessions.length;

        // Tasa de rebote (sesiones con una sola página)
        const bounceSessions = sessions.filter(session => 
            session.pages.length <= 1).length;
        this.stats.bounceRate = (bounceSessions / sessions.length) * 100;
    }

    // ==================== TRACKING DE EVENTOS ====================
    trackEvent(eventType, eventData = {}) {
        const event = {
            type: eventType,
            data: eventData,
            timestamp: Date.now(),
            page: this.currentPage
        };

        // Encontrar sesión activa más reciente
        const latestSession = this.getLatestSession();
        if (latestSession) {
            latestSession.events.push(event);
        }

        // Tracking especial para conversiones
        if (eventType === 'conversion') {
            this.stats.conversions++;
            this.trackConversion(eventData);
        }

        this.saveStats();
        this.updateStatsDisplay();
        
        console.log(`🎯 Evento trackeado: ${eventType}`, eventData);
    }

    trackConversion(conversionData) {
        const conversion = {
            type: conversionData.type || 'general',
            value: conversionData.value || 0,
            timestamp: Date.now(),
            page: this.currentPage
        };

        // Guardar conversión específica
        if (!this.stats.conversionsByType) {
            this.stats.conversionsByType = {};
        }
        
        if (!this.stats.conversionsByType[conversion.type]) {
            this.stats.conversionsByType[conversion.type] = [];
        }
        
        this.stats.conversionsByType[conversion.type].push(conversion);
        
        // Disparar evento personalizado
        this.dispatchEvent('conversion', conversion);
    }

    // ==================== PANEL DE ESTADÍSTICAS ====================
    setupStatsPanel() {
        this.createStatsPanel();
        this.setupPanelInteractions();
    }

    createStatsPanel() {
        // Verificar si el panel ya existe
        if (document.getElementById('stats-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'stats-panel';
        panel.className = 'stats-panel';
        panel.setAttribute('aria-hidden', 'true');
        panel.hidden = true;
        
        panel.innerHTML = `
            <div class="stats-header">
                <h3>📊 Estadísticas del Sitio</h3>
                <button id="close-stats" class="close-stats" aria-label="Cerrar panel de estadísticas">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="stats-content">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value" id="stat-total-visits">0</span>
                            <span class="stat-label">Visitas Totales</span>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value" id="stat-conversions">0</span>
                            <span class="stat-label">Conversiones</span>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value" id="stat-avg-time">0s</span>
                            <span class="stat-label">Tiempo Promedio</span>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-sign-out-alt"></i>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value" id="stat-bounce-rate">0%</span>
                            <span class="stat-label">Tasa de Rebote</span>
                        </div>
                    </div>
                </div>
                
                <div class="stats-sections">
                    <div class="stats-section">
                        <h4>📈 Páginas Más Visitadas</h4>
                        <div class="pages-list" id="top-pages-list">
                            <div class="loading">Cargando...</div>
                        </div>
                    </div>
                    
                    <div class="stats-section">
                        <h4>🎯 Conversiones por Tipo</h4>
                        <div class="conversions-list" id="conversions-list">
                            <div class="loading">Cargando...</div>
                        </div>
                    </div>
                    
                    <div class="stats-section">
                        <h4>🕒 Sesiones Activas</h4>
                        <div class="sessions-info">
                            <span class="session-count" id="active-sessions">0</span>
                            <span>sesiones activas</span>
                        </div>
                    </div>
                </div>
                
                <div class="stats-actions">
                    <button id="export-stats" class="btn btn-outline">
                        <i class="fas fa-download"></i> Exportar Datos
                    </button>
                    <button id="reset-stats" class="btn btn-outline">
                        <i class="fas fa-trash"></i> Reiniciar Stats
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        this.injectPanelStyles();
    }

    injectPanelStyles() {
        if (document.getElementById('stats-panel-styles')) return;

        const styles = `
            .stats-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 800px;
                max-height: 80vh;
                background: white;
                border-radius: 12px;
                box-shadow: 0 20px 25px rgba(0,0,0,0.1);
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
            }

            .stats-panel.visible {
                opacity: 1;
                visibility: visible;
            }

            .stats-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                background: #2c3e50;
                color: white;
                border-radius: 12px 12px 0 0;
            }

            .stats-header h3 {
                margin: 0;
                font-size: 1.25rem;
            }

            .close-stats {
                background: none;
                border: none;
                color: white;
                font-size: 1.25rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: background 0.3s ease;
            }

            .close-stats:hover {
                background: rgba(255,255,255,0.1);
            }

            .stats-content {
                padding: 1.5rem;
                overflow-y: auto;
                flex: 1;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .stat-card {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #d4af37;
            }

            .stat-icon {
                width: 40px;
                height: 40px;
                background: #d4af37;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            }

            .stat-info {
                display: flex;
                flex-direction: column;
            }

            .stat-value {
                font-size: 1.5rem;
                font-weight: bold;
                color: #2c3e50;
            }

            .stat-label {
                font-size: 0.875rem;
                color: #6c757d;
            }

            .stats-sections {
                display: grid;
                gap: 1.5rem;
                margin-bottom: 2rem;
            }

            .stats-section h4 {
                margin: 0 0 1rem 0;
                color: #2c3e50;
                font-size: 1rem;
            }

            .pages-list, .conversions-list {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 1rem;
                max-height: 200px;
                overflow-y: auto;
            }

            .page-item, .conversion-item {
                display: flex;
                justify-content: space-between;
                padding: 0.5rem 0;
                border-bottom: 1px solid #dee2e6;
            }

            .page-item:last-child, .conversion-item:last-child {
                border-bottom: none;
            }

            .sessions-info {
                text-align: center;
                padding: 2rem;
                background: #f8f9fa;
                border-radius: 8px;
            }

            .session-count {
                font-size: 2rem;
                font-weight: bold;
                color: #d4af37;
                display: block;
            }

            .stats-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
            }

            .loading {
                text-align: center;
                color: #6c757d;
                font-style: italic;
            }

            @media (max-width: 768px) {
                .stats-grid {
                    grid-template-columns: 1fr 1fr;
                }
                
                .stats-actions {
                    flex-direction: column;
                }
            }

            @media (max-width: 480px) {
                .stats-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'stats-panel-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupPanelInteractions() {
        // Botón cerrar
        document.getElementById('close-stats')?.addEventListener('click', () => {
            this.hideStatsPanel();
        });

        // Cerrar al hacer clic fuera
        document.getElementById('stats-panel')?.addEventListener('click', (e) => {
            if (e.target.id === 'stats-panel') {
                this.hideStatsPanel();
            }
        });

        // Exportar datos
        document.getElementById('export-stats')?.addEventListener('click', () => {
            this.exportStats();
        });

        // Reiniciar estadísticas
        document.getElementById('reset-stats')?.addEventListener('click', () => {
            this.resetStats();
        });
    }

    setupStatsToggle() {
        // Crear botón toggle si no existe
        if (!document.querySelector('.stats-toggle')) {
            const toggle = document.createElement('button');
            toggle.className = 'stats-toggle';
            toggle.innerHTML = '<i class="fas fa-chart-bar"></i>';
            toggle.setAttribute('aria-label', 'Mostrar estadísticas');
            toggle.title = 'Estadísticas del Sitio';
            
            toggle.style.cssText = `
                position: fixed;
                bottom: 100px;
                left: 20px;
                width: 50px;
                height: 50px;
                background: #d4af37;
                color: white;
                border: none;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.25rem;
                cursor: pointer;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                z-index: 9999;
                transition: all 0.3s ease;
            `;

            toggle.addEventListener('mouseenter', () => {
                toggle.style.transform = 'scale(1.1)';
                toggle.style.boxShadow = '0 6px 8px rgba(0,0,0,0.15)';
            });

            toggle.addEventListener('mouseleave', () => {
                toggle.style.transform = 'scale(1)';
                toggle.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            });

            toggle.addEventListener('click', () => {
                this.toggleStatsPanel();
            });

            document.body.appendChild(toggle);
        }
    }

    // ==================== CONTROL DEL PANEL ====================
    toggleStatsPanel() {
        if (this.isPanelVisible) {
            this.hideStatsPanel();
        } else {
            this.showStatsPanel();
        }
    }

    showStatsPanel() {
        const panel = document.getElementById('stats-panel');
        if (panel) {
            panel.classList.add('visible');
            panel.removeAttribute('hidden');
            panel.setAttribute('aria-hidden', 'false');
            this.isPanelVisible = true;
            this.updateStatsDisplay();
        }
    }

    hideStatsPanel() {
        const panel = document.getElementById('stats-panel');
        if (panel) {
            panel.classList.remove('visible');
            panel.setAttribute('aria-hidden', 'true');
            this.isPanelVisible = false;
            
            setTimeout(() => {
                panel.hidden = true;
            }, 300);
        }
    }

    // ==================== ACTUALIZACIÓN DE DATOS ====================
    updateStatsDisplay() {
        this.updateBasicStats();
        this.updatePagesList();
        this.updateConversionsList();
        this.updateSessionsInfo();
    }

    updateBasicStats() {
        // Visitas totales
        const totalVisits = document.getElementById('stat-total-visits');
        if (totalVisits) {
            totalVisits.textContent = this.stats.totalVisits.toLocaleString();
        }

        // Conversiones
        const conversions = document.getElementById('stat-conversions');
        if (conversions) {
            conversions.textContent = this.stats.conversions.toLocaleString();
        }

        // Tiempo promedio
        const avgTime = document.getElementById('stat-avg-time');
        if (avgTime) {
            const seconds = Math.round(this.stats.avgSessionTime / 1000);
            avgTime.textContent = `${seconds}s`;
        }

        // Tasa de rebote
        const bounceRate = document.getElementById('stat-bounce-rate');
        if (bounceRate) {
            bounceRate.textContent = `${Math.round(this.stats.bounceRate)}%`;
        }
    }

    updatePagesList() {
        const pagesList = document.getElementById('top-pages-list');
        if (!pagesList) return;

        const topPages = Object.entries(this.stats.pageViews)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);

        if (topPages.length === 0) {
            pagesList.innerHTML = '<div class="loading">No hay datos disponibles</div>';
            return;
        }

        pagesList.innerHTML = topPages.map(([page, views]) => `
            <div class="page-item">
                <span class="page-name">${this.getPageDisplayName(page)}</span>
                <span class="page-views">${views.toLocaleString()} vistas</span>
            </div>
        `).join('');
    }

    updateConversionsList() {
        const conversionsList = document.getElementById('conversions-list');
        if (!conversionsList) return;

        if (!this.stats.conversionsByType || Object.keys(this.stats.conversionsByType).length === 0) {
            conversionsList.innerHTML = '<div class="loading">No hay conversiones registradas</div>';
            return;
        }

        conversionsList.innerHTML = Object.entries(this.stats.conversionsByType)
            .map(([type, conversions]) => `
                <div class="conversion-item">
                    <span class="conversion-type">${this.getConversionDisplayName(type)}</span>
                    <span class="conversion-count">${conversions.length}</span>
                </div>
            `).join('');
    }

    updateSessionsInfo() {
        const activeSessions = document.getElementById('active-sessions');
        if (activeSessions) {
            const activeCount = Object.values(this.stats.userSessions).filter(
                session => !session.endTime
            ).length;
            activeSessions.textContent = activeCount;
        }
    }

    // ==================== GESTIÓN DE DATOS ====================
    saveStats() {
        try {
            localStorage.setItem('academia-stats', JSON.stringify(this.stats));
        } catch (error) {
            console.error('Error guardando estadísticas:', error);
        }
    }

    loadStats() {
        try {
            const saved = localStorage.getItem('academia-stats');
            if (saved) {
                this.stats = { ...this.stats, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
        }
    }

    exportStats() {
        const dataStr = JSON.stringify(this.stats, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `estadisticas-academia-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.trackEvent('stats_exported');
    }

    resetStats() {
        if (confirm('¿Estás seguro de que quieres reiniciar todas las estadísticas? Esta acción no se puede deshacer.')) {
            this.stats = {
                totalVisits: 0,
                pageViews: {},
                userSessions: {},
                conversions: 0,
                bounceRate: 0,
                avgSessionTime: 0
            };
            
            this.saveStats();
            this.updateStatsDisplay();
            this.trackEvent('stats_reset');
        }
    }

    // ==================== TRACKING EN TIEMPO REAL ====================
    setupRealTimeTracking() {
        // Trackear clics en enlaces importantes
        this.trackImportantClicks();
        
        // Trackear formularios
        this.trackFormSubmissions();
        
        // Trackear scroll
        this.trackScrollBehavior();
        
        // Trackear tiempo en página
        this.trackTimeOnPage();
    }

    trackImportantClicks() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button');
            if (!target) return;

            // Trackear CTAs principales
            if (target.classList.contains('btn-primary') || 
                target.classList.contains('whatsapp-float')) {
                this.trackEvent('cta_click', {
                    text: target.textContent.trim(),
                    type: target.classList.contains('whatsapp-float') ? 'whatsapp' : 'button'
                });
            }

            // Trackear enlaces de navegación
            if (target.classList.contains('nav-link')) {
                this.trackEvent('navigation_click', {
                    linkText: target.textContent.trim(),
                    href: target.getAttribute('href')
                });
            }
        });
    }

    trackFormSubmissions() {
        document.addEventListener('submit', (e) => {
            const form = e.target;
            this.trackEvent('form_submission', {
                formId: form.id || 'unknown',
                formAction: form.getAttribute('action') || 'unknown'
            });
        });
    }

    trackScrollBehavior() {
        let maxScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            const maxPossibleScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = (currentScroll / maxPossibleScroll) * 100;
            
            if (scrollPercentage > maxScroll) {
                maxScroll = scrollPercentage;
                
                // Trackear hitos de scroll
                if (scrollPercentage >= 25 && maxScroll < 50) {
                    this.trackEvent('scroll_25_percent');
                } else if (scrollPercentage >= 50 && maxScroll < 75) {
                    this.trackEvent('scroll_50_percent');
                } else if (scrollPercentage >= 75 && maxScroll < 90) {
                    this.trackEvent('scroll_75_percent');
                } else if (scrollPercentage >= 90) {
                    this.trackEvent('scroll_90_percent');
                }
            }
        });
    }

    trackTimeOnPage() {
        let pageLoadTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - pageLoadTime;
            this.trackEvent('page_time', {
                duration: timeOnPage,
                page: this.currentPage
            });
        });
    }

    // ==================== UTILIDADES ====================
    getCurrentPage() {
        return window.location.pathname.split('/').pop() || 'index.html';
    }

    getPageDisplayName(page) {
        const pageNames = {
            'index.html': '🏠 Inicio',
            'clases.html': '🎵 Clases',
            'servicios.html': '⚡ Servicios',
            'instrumentos.html': '🎹 Instrumentos',
            'contacto.html': '📞 Contacto',
            'musica-en-vivo.html': '🎤 Música en Vivo'
        };
        return pageNames[page] || page;
    }

    getConversionDisplayName(type) {
        const conversionNames = {
            'contact_form': '📧 Formulario Contacto',
            'newsletter': '📰 Newsletter',
            'whatsapp': '💬 WhatsApp',
            'phone_call': '📞 Llamada',
            'class_signup': '🎵 Inscripción Clases'
        };
        return conversionNames[type] || type;
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getLatestSession() {
        const sessions = Object.values(this.stats.userSessions);
        return sessions.sort((a, b) => b.startTime - a.startTime)[0];
    }

    dispatchEvent(eventName, data) {
        const event = new CustomEvent(`stats:${eventName}`, { detail: data });
        document.dispatchEvent(event);
    }

    // ==================== API PÚBLICA ====================
    trackConversion(type, data = {}) {
        this.trackEvent('conversion', { type, ...data });
    }

    getStats() {
        return { ...this.stats };
    }

    // ==================== DESTRUCTOR ====================
    destroy() {
        // Limpiar event listeners si es necesario
        console.log('🧹 StatsSystem - Sistema limpiado');
    }
}

// ==================== INICIALIZACIÓN GLOBAL ====================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar sistema de estadísticas
    window.statsSystem = new StatsSystem();
    
    // Exponer API pública para otros scripts
    window.trackConversion = (type, data) => {
        if (window.statsSystem) {
            window.statsSystem.trackConversion(type, data);
        }
    };
    
    console.log('🚀 StatsSystem - Listo para trackear');
});

// ==================== COMPATIBILIDAD ====================
// Mantener compatibilidad con código existente
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StatsSystem;
}
