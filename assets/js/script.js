/**
 * ACADEMIA DEL VALLENATO CARTAGENA - SISTEMA PRINCIPAL
 * Versión: 2.0 | Optimizado para GitHub Pages
 * Funcionalidades: Navegación, Idioma, Estadísticas, Formularios
 */

class AcademiaVallenato {
    constructor() {
        this.currentLang = 'es';
        this.visitCount = 0;
        this.pageStats = {};
        this.isMenuOpen = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.setupLanguageSystem();
        this.setupStatsSystem();
        this.setupForms();
        this.trackVisit();
        
        console.log('✅ Academia Vallenato - Sistema inicializado');
    }

    // ==================== SISTEMA DE EVENTOS ====================
    setupEventListeners() {
        // Header scroll effect
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', this.handleOutsideClick.bind(this));
        
        // Teclado shortcuts
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
    }

    handleScroll() {
        const header = document.querySelector('.header');
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 100);
        }
    }

    handleOutsideClick(e) {
        const nav = document.querySelector('.nav');
        const menuToggle = document.getElementById('menu-toggle');
        
        if (this.isMenuOpen && 
            !nav.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            this.closeMobileMenu();
        }
    }

    handleKeyboard(e) {
        // Escape key cierra menús
        if (e.key === 'Escape') {
            this.closeMobileMenu();
            this.closeStatsPanel();
        }
    }

    // ==================== SISTEMA DE NAVEGACIÓN ====================
    setupNavigation() {
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupActiveLinks();
    }

    setupMobileMenu() {
        const toggle = document.getElementById('menu-toggle');
        const nav = document.querySelector('.nav');
        
        if (toggle && nav) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });
        }
    }

    toggleMobileMenu() {
        const nav = document.querySelector('.nav');
        const toggle = document.getElementById('menu-toggle');
        
        nav.classList.toggle('active');
        this.isMenuOpen = nav.classList.contains('active');
        
        // Actualizar ARIA attributes
        toggle.setAttribute('aria-expanded', this.isMenuOpen);
        
        // Animación de hamburguesa a X
        const spans = toggle.querySelectorAll('span');
        if (this.isMenuOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    closeMobileMenu() {
        const nav = document.querySelector('.nav');
        const toggle = document.getElementById('menu-toggle');
        
        nav.classList.remove('active');
        this.isMenuOpen = false;
        toggle.setAttribute('aria-expanded', 'false');
        
        // Reset hamburger animation
        const spans = toggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                // No aplicar smooth scroll para # solo
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Cerrar menú móvil después de hacer clic
                    if (this.isMenuOpen) {
                        this.closeMobileMenu();
                    }
                }
            });
        });
    }

    setupActiveLinks() {
        // Actualizar links activos basado en scroll
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href').includes(id)) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-100px 0px -100px 0px'
        });
        
        sections.forEach(section => observer.observe(section));
    }

    // ==================== SISTEMA DE IDIOMAS ====================
    setupLanguageSystem() {
        this.translations = {
            es: this.getSpanishTranslations(),
            en: this.getEnglishTranslations()
        };
        
        this.setupLanguageToggle();
        this.loadLanguagePreference();
    }

    getSpanishTranslations() {
        return {
            // Hero Section
            'hero.title': 'Descubre el Alma del Vallenato',
            'hero.subtitle': 'Aprende los secretos del acordeón, la caja y la guacharaca con los mejores maestros de la música colombiana.',
            'hero.cta1': 'Ver Clases',
            'hero.cta2': 'Contactar',
            
            // About Section
            'about.title': 'Sobre la Academia',
            'about.subtitle': 'Preservando y enseñando la tradición vallenata desde 2010',
            'about.mission.title': 'Nuestra Misión',
            'about.mission.text': 'Formar músicos integrales en el género vallenato, preservando sus raíces tradicionales mientras incorporamos técnicas modernas de enseñanza.',
            'about.vision.title': 'Nuestra Visión',
            'about.vision.text': 'Ser el centro de enseñanza de vallenato más reconocido de Colombia, formando a las nuevas generaciones de acordeoneros y músicos tradicionales.',
            'about.history.title': 'Nuestra Historia',
            'about.history.text': 'Fundada en 2010 por el maestro acordeonero Rafael Martínez, la Academia del Vallenato ha formado a más de 500 músicos que hoy en día llevan nuestra tradición por todo el mundo.',
            
            // Services Section
            'services.title': 'Nuestros Servicios',
            'services.subtitle': 'Todo lo que necesitas para tu formación musical',
            'services.pedagogy.title': 'Pedagogía Musical',
            'services.pedagogy.description': 'Metodología especializada para niños, jóvenes y adultos. Aprende a tu ritmo con nuestro sistema progresivo.',
            'services.classes.title': 'Clases de Música',
            'services.classes.description': 'Clases prácticas de acordeón, caja vallenata, guacharaca, bajo eléctrico y canto. Enfoque 100% práctico.',
            'services.liveMusic.title': 'Música en Vivo',
            'services.liveMusic.description': 'Contrata nuestras agrupaciones vallenatas para eventos privados, bodas, fiestas y presentaciones especiales.',
            'services.learnMore': 'Más información',
            
            // Instruments Section
            'instruments.title': 'Instrumentos Vallenatos',
            'instruments.subtitle': 'Encuentra los mejores instrumentos para tu práctica musical',
            'instruments.accordion.name': 'Acordeón Hohner Corona II',
            'instruments.accordion.description': 'Acordeón profesional de 34 notas, ideal para vallenato tradicional.',
            'instruments.accordion.price': '$4.500.000 COP',
            'instruments.caja.name': 'Caja Vallenata Profesional',
            'instruments.caja.description': 'Caja artesanal en madera de roble con parches de cuero natural.',
            'instruments.caja.price': '$350.000 COP',
            'instruments.guacharaca.name': 'Guacharaca Tradicional',
            'instruments.guacharaca.description': 'Guacharaca artesanal en madera de guayacán con rascador de metal.',
            'instruments.guacharaca.price': '$120.000 COP',
            'instruments.viewDetails': 'Ver detalles',
            'instruments.seeAll': 'Ver todos los instrumentos',
            
            // Testimonials
            'testimonials.title': 'Testimonios',
            'testimonials.subtitle': 'Lo que dicen nuestros estudiantes',
            'testimonials.testimonial1.text': '"La Academia del Vallenato transformó mi forma de entender la música. En 6 meses ya podía tocar varias canciones tradicionales."',
            'testimonials.testimonial1.author': 'Carlos Mendoza',
            'testimonials.testimonial1.role': 'Estudiante de acordeón',
            'testimonials.testimonial2.text': '"Los profesores son excelentes y la metodología es muy práctica. Mi hijo de 10 años ya toca la guacharaca como un profesional."',
            'testimonials.testimonial2.author': 'María González',
            'testimonials.testimonial2.role': 'Madre de estudiante',
            
            // CTA Section
            'cta.title': '¿Listo para comenzar tu viaje musical?',
            'cta.text': 'Únete a nuestra comunidad y descubre el fascinante mundo del vallenato.',
            'cta.contact': 'Contáctanos',
            'cta.classes': 'Ver clases',
            
            // Footer
            'footer.description': 'Formando a los músicos vallenatos del futuro desde 2010.',
            'footer.links.title': 'Enlaces rápidos',
            'footer.links.home': 'Inicio',
            'footer.links.services': 'Servicios',
            'footer.links.classes': 'Clases',
            'footer.links.instruments': 'Instrumentos',
            'footer.links.contact': 'Contacto',
            'footer.contact.title': 'Contacto',
            'footer.contact.address': 'Calle 45 # 12-34, Valledupar, Colombia',
            'footer.newsletter.title': 'Boletín informativo',
            'footer.newsletter.description': 'Suscríbete para recibir noticias sobre cursos y eventos.',
            'footer.newsletter.placeholder': 'Tu correo electrónico',
            'footer.newsletter.subscribe': 'Suscribirse',
            'footer.copyright': '© 2024 Academia del Vallenato. Todos los derechos reservados.',
            'footer.privacy': 'Política de privacidad',
            'footer.terms': 'Términos de servicio'
        };
    }

    getEnglishTranslations() {
        return {
            // Hero Section
            'hero.title': 'Discover the Soul of Vallenato',
            'hero.subtitle': 'Learn the secrets of the accordion, drum, and guacharaca with the best Colombian music teachers.',
            'hero.cta1': 'View Classes',
            'hero.cta2': 'Contact',
            
            // About Section
            'about.title': 'About the Academy',
            'about.subtitle': 'Preserving and teaching the vallenato tradition since 2010',
            'about.mission.title': 'Our Mission',
            'about.mission.text': 'Train well-rounded musicians in the vallenato genre, preserving its traditional roots while incorporating modern teaching techniques.',
            'about.vision.title': 'Our Vision',
            'about.vision.text': 'To be the most recognized vallenato teaching center in Colombia, training new generations of accordion players and traditional musicians.',
            'about.history.title': 'Our History',
            'about.history.text': 'Founded in 2010 by master accordionist Rafael Martínez, the Vallenato Academy has trained more than 500 musicians who now carry our tradition around the world.',
            
            // Services Section
            'services.title': 'Our Services',
            'services.subtitle': 'Everything you need for your musical training',
            'services.pedagogy.title': 'Music Pedagogy',
            'services.pedagogy.description': 'Specialized methodology for children, youth, and adults. Learn at your own pace with our progressive system.',
            'services.classes.title': 'Music Classes',
            'services.classes.description': 'Practical classes in accordion, vallenato drum, guacharaca, electric bass, and singing. 100% practical approach.',
            'services.liveMusic.title': 'Live Music',
            'services.liveMusic.description': 'Hire our vallenato groups for private events, weddings, parties, and special presentations.',
            'services.learnMore': 'Learn more',
            
            // Instruments Section
            'instruments.title': 'Vallenato Instruments',
            'instruments.subtitle': 'Find the best instruments for your musical practice',
            'instruments.accordion.name': 'Hohner Corona II Accordion',
            'instruments.accordion.description': 'Professional 34-note accordion, ideal for traditional vallenato.',
            'instruments.accordion.price': '$4,500,000 COP',
            'instruments.caja.name': 'Professional Vallenato Drum',
            'instruments.caja.description': 'Artisanal drum made of oak wood with natural leather patches.',
            'instruments.caja.price': '$350,000 COP',
            'instruments.guacharaca.name': 'Traditional Guacharaca',
            'instruments.guacharaca.description': 'Artisanal guacharaca made of guayacán wood with metal scraper.',
            'instruments.guacharaca.price': '$120,000 COP',
            'instruments.viewDetails': 'View details',
            'instruments.seeAll': 'View all instruments',
            
            // Testimonials
            'testimonials.title': 'Testimonials',
            'testimonials.subtitle': 'What our students say',
            'testimonials.testimonial1.text': '"The Vallenato Academy transformed my understanding of music. In 6 months I could already play several traditional songs."',
            'testimonials.testimonial1.author': 'Carlos Mendoza',
            'testimonials.testimonial1.role': 'Accordion student',
            'testimonials.testimonial2.text': '"The teachers are excellent and the methodology is very practical. My 10-year-old son already plays the guacharaca like a professional."',
            'testimonials.testimonial2.author': 'María González',
            'testimonials.testimonial2.role': 'Student\'s mother',
            
            // CTA Section
            'cta.title': 'Ready to Start Your Musical Journey?',
            'cta.text': 'Join our community and discover the fascinating world of vallenato.',
            'cta.contact': 'Contact Us',
            'cta.classes': 'View classes',
            
            // Footer
            'footer.description': 'Training the vallenato musicians of the future since 2010.',
            'footer.links.title': 'Quick Links',
            'footer.links.home': 'Home',
            'footer.links.services': 'Services',
            'footer.links.classes': 'Classes',
            'footer.links.instruments': 'Instruments',
            'footer.links.contact': 'Contact',
            'footer.contact.title': 'Contact',
            'footer.contact.address': 'Street 45 # 12-34, Valledupar, Colombia',
            'footer.newsletter.title': 'Newsletter',
            'footer.newsletter.description': 'Subscribe to receive news about courses and events.',
            'footer.newsletter.placeholder': 'Your email address',
            'footer.newsletter.subscribe': 'Subscribe',
            'footer.copyright': '© 2024 Vallenato Academy. All rights reserved.',
            'footer.privacy': 'Privacy Policy',
            'footer.terms': 'Terms of Service'
        };
    }

    setupLanguageToggle() {
        const toggle = document.getElementById('language-toggle');
        const dropdown = document.querySelector('.language-dropdown');
        const options = document.querySelectorAll('.language-option');
        
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('active');
            });
            
            // Cerrar dropdown al hacer clic fuera
            document.addEventListener('click', () => {
                dropdown.classList.remove('active');
            });
        }
        
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = option.getAttribute('data-lang');
                this.changeLanguage(lang);
                dropdown.classList.remove('active');
            });
        });
    }

    changeLanguage(lang) {
        if (this.currentLang !== lang && this.translations[lang]) {
            this.currentLang = lang;
            this.applyTranslations();
            this.saveLanguagePreference();
            this.updateLanguageUI();
        }
    }

    applyTranslations() {
        // Texto normal
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.translations[this.currentLang][key]) {
                element.textContent = this.translations[this.currentLang][key];
            }
        });
        
        // Placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (this.translations[this.currentLang][key]) {
                element.setAttribute('placeholder', this.translations[this.currentLang][key]);
            }
        });
    }

    updateLanguageUI() {
        const toggle = document.getElementById('language-toggle');
        if (toggle) {
            const flag = toggle.querySelector('.language-flag');
            const text = toggle.querySelector('.language-text');
            
            if (this.currentLang === 'es') {
                flag.textContent = '🇪🇸';
                text.textContent = 'ES';
            } else {
                flag.textContent = '🇺🇸';
                text.textContent = 'EN';
            }
        }
    }

    saveLanguagePreference() {
        localStorage.setItem('academia-lang', this.currentLang);
    }

    loadLanguagePreference() {
        const savedLang = localStorage.getItem('academia-lang');
        if (savedLang && this.translations[savedLang]) {
            this.changeLanguage(savedLang);
        }
    }

    // ==================== SISTEMA DE ESTADÍSTICAS ====================
    setupStatsSystem() {
        this.loadStats();
        this.setupStatsToggle();
        this.updateStatsDisplay();
    }

    setupStatsToggle() {
        const toggle = document.querySelector('.stats-toggle');
        const closeBtn = document.getElementById('close-stats');
        const panel = document.getElementById('stats-panel');
        
        if (toggle) {
            toggle.addEventListener('click', () => {
                panel.classList.toggle('visible');
                panel.removeAttribute('hidden');
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeStatsPanel();
            });
        }
        
        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (panel.classList.contains('visible') && 
                !panel.contains(e.target) && 
                !toggle.contains(e.target)) {
                this.closeStatsPanel();
            }
        });
    }

    closeStatsPanel() {
        const panel = document.getElementById('stats-panel');
        panel.classList.remove('visible');
        setTimeout(() => panel.setAttribute('hidden', 'true'), 300);
    }

    trackVisit() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Incrementar contadores
        this.visitCount = parseInt(localStorage.getItem('total-visits') || '0') + 1;
        this.pageStats[currentPage] = (parseInt(this.pageStats[currentPage]) || 0) + 1;
        
        // Guardar en localStorage
        localStorage.setItem('total-visits', this.visitCount.toString());
        localStorage.setItem('page-stats', JSON.stringify(this.pageStats));
        
        this.updateStatsDisplay();
    }

    loadStats() {
        this.visitCount = parseInt(localStorage.getItem('total-visits') || '0');
        this.pageStats = JSON.parse(localStorage.getItem('page-stats') || '{}');
    }

    updateStatsDisplay() {
        const totalVisits = document.getElementById('total-visits');
        const topPages = document.getElementById('top-pages');
        
        if (totalVisits) {
            totalVisits.textContent = this.visitCount.toLocaleString();
        }
        
        if (topPages) {
            // Ordenar páginas por visitas
            const sortedPages = Object.entries(this.pageStats)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5);
            
            topPages.innerHTML = sortedPages.map(([page, visits]) => `
                <li>
                    <span class="page-name">${this.getPageName(page)}</span>
                    <span class="page-views">${visits}</span>
                </li>
            `).join('');
        }
    }

    getPageName(page) {
        const pageNames = {
            'index.html': 'Inicio',
            'clases.html': 'Clases',
            'servicios.html': 'Servicios',
            'instrumentos.html': 'Instrumentos',
            'contacto.html': 'Contacto',
            'musica-en-vivo.html': 'Música en Vivo'
        };
        return pageNames[page] || page;
    }

    // ==================== SISTEMA DE FORMULARIOS ====================
    setupForms() {
        this.setupContactForm();
        this.setupNewsletterForm();
        this.setupNewsletterForms();
    }

    setupContactForm() {
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(form);
            });
        }
    }

    setupNewsletterForm() {
        const form = document.querySelector('.newsletter-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterForm(form);
            });
        }
    }

    setupNewsletterForms() {
        // Para múltiples formularios de newsletter
        document.querySelectorAll('.newsletter-form').forEach(form => {
            if (!form.hasAttribute('data-bound')) {
                form.setAttribute('data-bound', 'true');
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleNewsletterForm(form);
                });
            }
        });
    }

    handleContactForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validación básica
        if (!data.name || !data.email || !data.message) {
            this.showNotification('Por favor, completa todos los campos requeridos.', 'error');
            return;
        }
        
        // Simular envío (en producción conectar con backend)
        this.showNotification('¡Mensaje enviado! Te contactaremos pronto.', 'success');
        form.reset();
        
        // Tracking de conversión
        this.trackConversion('contact_form');
    }

    handleNewsletterForm(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        if (!this.isValidEmail(email)) {
            this.showNotification('Por favor, ingresa un email válido.', 'error');
            return;
        }
        
        // Simular suscripción
        this.showNotification('¡Gracias por suscribirte!', 'success');
        form.reset();
        
        // Tracking de conversión
        this.trackConversion('newsletter_subscription');
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type = 'info') {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Estilos para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 1rem;
            border-radius: 4px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
        
        // Cerrar manualmente
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
    }

    // ==================== ANALYTICS Y TRACKING ====================
    trackConversion(type) {
        console.log(`🎯 Conversión trackeada: ${type}`);
        
        // Aquí integrar con Google Analytics, Facebook Pixel, etc.
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                'event_category': 'engagement',
                'event_label': type
            });
        }
    }

    // ==================== UTILIDADES ====================
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ==================== DESTRUCTOR ====================
    destroy() {
        // Limpiar event listeners si es necesario
        console.log('🧹 Academia Vallenato - Sistema limpiado');
    }
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la aplicación
    window.academiaApp = new AcademiaVallenato();
    
    // Añadir estilos para animaciones de notificación
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: 1rem;
            }
        `;
        document.head.appendChild(styles);
    }
});

// ==================== COMPATIBILIDAD CON CÓDIGO EXISTENTE ====================
// Mantener compatibilidad con código legacy si existe
if (typeof translationSystem !== 'undefined') {
    console.warn('⚠️ translationSystem legacy detectado - Migrando a nuevo sistema');
    window.academiaApp.translations = translationSystem.translations;
}

// Exportar para uso modular (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AcademiaVallenato;
}
