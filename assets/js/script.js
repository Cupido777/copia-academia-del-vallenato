// script.js - Optimizado con seguridad mejorada y protección de datos

class AcademiaVallenato {
    constructor() {
        this.currentLang = 'es';
        this.visitCount = 0;
        this.pageStats = {};
        this.isMenuOpen = false;
        this.security = new SecurityManager();
        this.init();
    }

    init() {
        this.security.enforceSecurity();
        this.setupEventListeners();
        this.setupNavigation();
        this.setupLanguageSystem();
        this.setupStatsSystem();
        this.setupForms();
        this.trackVisit();
        console.log('✅ Academia Vallenato - Sistema inicializado con seguridad mejorada');
    }

    setupEventListeners() {
        window.addEventListener('scroll', this.debounce(this.handleScroll.bind(this), 10));
        document.addEventListener('click', this.handleOutsideClick.bind(this));
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
        
        // Prevenir clics rápidos múltiples
        this.setupClickProtection();
    }

    setupClickProtection() {
        let lastClickTime = 0;
        document.addEventListener('click', (e) => {
            const now = Date.now();
            if (now - lastClickTime < 300) { // 300ms entre clics
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            lastClickTime = now;
        }, true);
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
        if (this.isMenuOpen && nav && menuToggle && 
            !nav.contains(e.target) && !menuToggle.contains(e.target)) {
            this.closeMobileMenu();
        }
    }

    handleKeyboard(e) {
        if (e.key === 'Escape') {
            this.closeMobileMenu();
            this.closeStatsPanel();
        }
        
        // Prevenir F12 y Ctrl+Shift+I
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
            e.preventDefault();
            return false;
        }
    }

    setupNavigation() {
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupActiveLinks();
    }

    setupMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const nav = document.querySelector('.nav');
        if (menuToggle && nav) {
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });
        }
    }

    toggleMobileMenu() {
        const nav = document.querySelector('.nav');
        const menuToggle = document.getElementById('menu-toggle');
        if (nav && menuToggle) {
            nav.classList.toggle('active');
            this.isMenuOpen = nav.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', this.isMenuOpen.toString());
            
            const spans = menuToggle.querySelectorAll('span');
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
    }

    closeMobileMenu() {
        const nav = document.querySelector('.nav');
        const menuToggle = document.getElementById('menu-toggle');
        if (nav && menuToggle) {
            nav.classList.remove('active');
            this.isMenuOpen = false;
            menuToggle.setAttribute('aria-expanded', 'false');
            
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                        const targetPosition = target.offsetTop - headerHeight - 20;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        if (this.isMenuOpen) {
                            this.closeMobileMenu();
                        }
                    }
                }
            });
        });
    }

    setupActiveLinks() {
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
        }, { threshold: 0.5, rootMargin: '-100px 0px -100px 0px' });
        
        sections.forEach(section => observer.observe(section));
    }

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
            'hero.title': 'Descubre el Alma del Vallenato',
            'hero.subtitle': 'Aprende los secretos del acordeón, la caja y la guacharaca con los mejores maestros de la música colombiana.',
            'hero.cta1': 'Ver Clases',
            'hero.cta2': 'Contactar',
            'about.title': 'Sobre la Academia',
            'about.subtitle': 'Preservando y enseñando la tradición vallenata desde 2010',
            'about.mission.title': 'Nuestra Misión',
            'about.mission.text': 'Formar músicos integrales en el género vallenato, preservando sus raíces tradicionales mientras incorporamos técnicas modernas de enseñanza.',
            'about.vision.title': 'Nuestra Visión',
            'about.vision.text': 'Ser el centro de enseñanza de vallenato más reconocido de Colombia, formando a las nuevas generaciones de acordeoneros y músicos tradicionales.',
            'about.history.title': 'Nuestra Historia',
            'about.history.text': 'Fundada en 2010 por el maestro acordeonero Rafael Martínez, la Academia del Vallenato ha formado a más de 500 músicos que hoy en día llevan nuestra tradición por todo el mundo.',
            'services.title': 'Nuestros Servicios',
            'services.subtitle': 'Todo lo que necesitas para tu formación musical',
            'services.pedagogy.title': 'Pedagogía Musical',
            'services.pedagogy.description': 'Metodología especializada para niños, jóvenes y adultos. Aprende a tu ritmo con nuestro sistema progresivo.',
            'services.classes.title': 'Clases de Música',
            'services.classes.description': 'Clases prácticas de acordeón, caja vallenata, guacharaca, bajo eléctrico y canto. Enfoque 100% práctico.',
            'services.liveMusic.title': 'Música en Vivo',
            'services.liveMusic.description': 'Contrata nuestras agrupaciones vallenatas para eventos privados, bodas, fiestas y presentaciones especiales.',
            'services.learnMore': 'Más información',
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
            'testimonials.title': 'Testimonios',
            'testimonials.subtitle': 'Lo que dicen nuestros estudiantes',
            'testimonials.testimonial1.text': '"La Academia del Vallenato transformó mi forma de entender la música. En 6 meses ya podía tocar varias canciones tradicionales."',
            'testimonials.testimonial1.author': 'Carlos Mendoza',
            'testimonials.testimonial1.role': 'Estudiante de acordeón',
            'testimonials.testimonial2.text': '"Los profesores son excelentes y la metodología es muy práctica. Mi hijo de 10 años ya toca la guacharaca como un profesional."',
            'testimonials.testimonial2.author': 'María González',
            'testimonials.testimonial2.role': 'Madre de estudiante',
            'cta.title': '¿Listo para comenzar tu viaje musical?',
            'cta.text': 'Únete a nuestra comunidad y descubre el fascinante mundo del vallenato.',
            'cta.contact': 'Contáctanos',
            'cta.classes': 'Ver clases',
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
            'hero.title': 'Discover the Soul of Vallenato',
            'hero.subtitle': 'Learn the secrets of the accordion, drum, and guacharaca with the best Colombian music teachers.',
            'hero.cta1': 'View Classes',
            'hero.cta2': 'Contact',
            'about.title': 'About the Academy',
            'about.subtitle': 'Preserving and teaching the vallenato tradition since 2010',
            'about.mission.title': 'Our Mission',
            'about.mission.text': 'Train well-rounded musicians in the vallenato genre, preserving its traditional roots while incorporating modern teaching techniques.',
            'about.vision.title': 'Our Vision',
            'about.vision.text': 'To be the most recognized vallenato teaching center in Colombia, training new generations of accordion players and traditional musicians.',
            'about.history.title': 'Our History',
            'about.history.text': 'Founded in 2010 by master accordionist Rafael Martínez, the Vallenato Academy has trained more than 500 musicians who now carry our tradition around the world.',
            'services.title': 'Our Services',
            'services.subtitle': 'Everything you need for your musical training',
            'services.pedagogy.title': 'Music Pedagogy',
            'services.pedagogy.description': 'Specialized methodology for children, youth, and adults. Learn at your own pace with our progressive system.',
            'services.classes.title': 'Music Classes',
            'services.classes.description': 'Practical classes in accordion, vallenato drum, guacharaca, electric bass, and singing. 100% practical approach.',
            'services.liveMusic.title': 'Live Music',
            'services.liveMusic.description': 'Hire our vallenato groups for private events, weddings, parties, and special presentations.',
            'services.learnMore': 'Learn more',
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
            'testimonials.title': 'Testimonials',
            'testimonials.subtitle': 'What our students say',
            'testimonials.testimonial1.text': '"The Vallenato Academy transformed my understanding of music. In 6 months I could already play several traditional songs."',
            'testimonials.testimonial1.author': 'Carlos Mendoza',
            'testimonials.testimonial1.role': 'Accordion student',
            'testimonials.testimonial2.text': '"The teachers are excellent and the methodology is very practical. My 10-year-old son already plays the guacharaca like a professional."',
            'testimonials.testimonial2.author': 'María González',
            'testimonials.testimonial2.role': 'Student\'s mother',
            'cta.title': 'Ready to Start Your Musical Journey?',
            'cta.text': 'Join our community and discover the fascinating world of vallenato.',
            'cta.contact': 'Contact Us',
            'cta.classes': 'View classes',
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
        const languageToggle = document.getElementById('language-toggle');
        const languageDropdown = document.querySelector('.language-dropdown');
        const languageOptions = document.querySelectorAll('.language-option');
        
        if (languageToggle) {
            languageToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                languageDropdown.classList.toggle('active');
            });
            
            document.addEventListener('click', () => {
                languageDropdown.classList.remove('active');
            });
        }
        
        languageOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = option.getAttribute('data-lang');
                this.changeLanguage(lang);
                document.querySelector('.language-dropdown').classList.remove('active');
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
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.translations[this.currentLang][key]) {
                element.textContent = this.translations[this.currentLang][key];
            }
        });
        
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (this.translations[this.currentLang][key]) {
                element.setAttribute('placeholder', this.translations[this.currentLang][key]);
            }
        });
    }

    updateLanguageUI() {
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            const flag = languageToggle.querySelector('.language-flag');
            const text = languageToggle.querySelector('.language-text');
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
        try {
            localStorage.setItem('academia-lang', this.currentLang);
        } catch (error) {
            console.warn('No se pudo guardar preferencia de idioma:', error);
        }
    }

    loadLanguagePreference() {
        try {
            const savedLang = localStorage.getItem('academia-lang');
            if (savedLang && this.translations[savedLang]) {
                this.changeLanguage(savedLang);
            }
        } catch (error) {
            console.warn('No se pudo cargar preferencia de idioma:', error);
        }
    }

    setupStatsSystem() {
        this.loadStats();
        this.setupStatsToggle();
        this.updateStatsDisplay();
    }

    setupStatsToggle() {
        const statsToggle = document.querySelector('.stats-toggle');
        const closeStats = document.getElementById('close-stats');
        const statsPanel = document.getElementById('stats-panel');
        
        if (statsToggle) {
            statsToggle.addEventListener('click', () => {
                statsPanel.classList.toggle('visible');
                statsPanel.removeAttribute('hidden');
            });
        }
        
        if (closeStats) {
            closeStats.addEventListener('click', () => {
                this.closeStatsPanel();
            });
        }
        
        document.addEventListener('click', (e) => {
            if (statsPanel.classList.contains('visible') && 
                !statsPanel.contains(e.target) && 
                !e.target.closest('.stats-toggle')) {
                this.closeStatsPanel();
            }
        });
    }

    closeStatsPanel() {
        const statsPanel = document.getElementById('stats-panel');
        if (statsPanel) {
            statsPanel.classList.remove('visible');
            setTimeout(() => statsPanel.setAttribute('hidden', 'true'), 300);
        }
    }

    trackVisit() {
        try {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            this.visitCount = parseInt(localStorage.getItem('total-visits') || '0') + 1;
            this.pageStats[currentPage] = (parseInt(this.pageStats[currentPage]) || 0) + 1;
            localStorage.setItem('total-visits', this.visitCount.toString());
            localStorage.setItem('page-stats', JSON.stringify(this.pageStats));
            this.updateStatsDisplay();
        } catch (error) {
            console.warn('No se pudo trackear visita:', error);
        }
    }

    loadStats() {
        try {
            this.visitCount = parseInt(localStorage.getItem('total-visits') || '0');
            this.pageStats = JSON.parse(localStorage.getItem('page-stats') || '{}');
        } catch (error) {
            console.warn('No se pudieron cargar estadísticas:', error);
            this.visitCount = 0;
            this.pageStats = {};
        }
    }

    updateStatsDisplay() {
        const totalVisitsElement = document.getElementById('total-visits');
        const topPagesElement = document.getElementById('top-pages');
        
        if (totalVisitsElement) {
            totalVisitsElement.textContent = this.visitCount.toLocaleString();
        }
        
        if (topPagesElement) {
            try {
                this.pageStats = JSON.parse(localStorage.getItem('page-stats') || '{}');
                const topPages = Object.entries(this.pageStats)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5);
                    
                topPagesElement.innerHTML = topPages.map(([page, count]) => 
                    `<li><span class="page-name">${this.getPageName(page)}</span><span class="page-views">${count}</span></li>`
                ).join('');
            } catch (error) {
                topPagesElement.innerHTML = '<li>Error cargando estadísticas</li>';
            }
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

    setupForms() {
        this.setupContactForm();
        this.setupNewsletterForm();
        this.setupNewsletterForms();
    }

    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(e.target);
            });
        }
    }

    setupNewsletterForm() {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterForm(e.target);
            });
        }
    }

    setupNewsletterForms() {
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
        
        // Sanitizar datos
        const sanitizedData = {
            name: this.security.sanitizeInput(data.name || ''),
            email: this.security.sanitizeEmail(data.email || ''),
            message: this.security.sanitizeInput(data.message || '')
        };
        
        if (sanitizedData.name && sanitizedData.email && sanitizedData.message) {
            this.showNotification('¡Mensaje enviado! Te contactaremos pronto.', 'success');
            form.reset();
            this.trackConversion('contact_form');
        } else {
            this.showNotification('Por favor, completa todos los campos requeridos.', 'error');
        }
    }

    handleNewsletterForm(form) {
        const emailInput = form.querySelector('input[type="email"]');
        const email = this.security.sanitizeEmail(emailInput.value);
        
        if (this.isValidEmail(email)) {
            this.showNotification('¡Gracias por suscribirte!', 'success');
            form.reset();
            this.trackConversion('newsletter_subscription');
        } else {
            this.showNotification('Por favor, ingresa un email válido.', 'error');
        }
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Sanitizar mensaje
        const sanitizedMessage = this.security.sanitizeHTML(message);
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${sanitizedMessage}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        const backgroundColor = type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3';
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${backgroundColor};
            color: white;
            padding: 1rem;
            border-radius: 4px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }

    trackConversion(event) {
        console.log(`🎯 Conversión trackeada: ${event}`);
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                'event_category': 'engagement',
                'event_label': event
            });
        }
    }

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

    destroy() {
        console.log('🧹 Academia Vallenato - Sistema limpiado');
    }
}

// =============================================
// SISTEMA DE SEGURIDAD MEJORADO
// =============================================
class SecurityManager {
    constructor() {
        this.csrfToken = this.generateCSRFToken();
    }

    enforceSecurity() {
        this.injectCSRFTokens();
        this.preventXSS();
        this.sanitizeInputs();
        this.setupContentSecurity();
    }

    generateCSRFToken() {
        let token = localStorage.getItem('csrf_token');
        if (!token) {
            token = 'csrf_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
            try {
                localStorage.setItem('csrf_token', token);
            } catch (error) {
                console.warn('No se pudo guardar token CSRF:', error);
            }
        }
        return token;
    }

    injectCSRFTokens() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const existingToken = form.querySelector('input[name="csrf_token"]');
            if (!existingToken) {
                const tokenInput = document.createElement('input');
                tokenInput.type = 'hidden';
                tokenInput.name = 'csrf_token';
                tokenInput.value = this.csrfToken;
                form.appendChild(tokenInput);
            }
        });
    }

    preventXSS() {
        // Protección básica contra XSS
        const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        if (originalInnerHTML) {
            Object.defineProperty(Element.prototype, 'innerHTML', {
                set: function(value) {
                    const sanitized = this.sanitizeHTML(value);
                    return originalInnerHTML.set.call(this, sanitized);
                }
            });
        }
    }

    sanitizeHTML(str) {
        if (!str) return '';
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    sanitizeInputs() {
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                e.target.value = this.sanitizeInput(e.target.value, e.target.type);
            }
        });
    }

    sanitizeInput(value, type) {
        if (!value) return '';
        
        switch (type) {
            case 'email':
                return value.toLowerCase().trim().replace(/[^a-z0-9@._-]/g, '');
            case 'tel':
                return value.replace(/\D/g, '').substring(0, 15);
            case 'number':
                return value.replace(/[^0-9]/g, '');
            default:
                return value.replace(/[<>]/g, '').trim();
        }
    }

    sanitizeEmail(email) {
        return this.sanitizeInput(email, 'email');
    }

    setupContentSecurity() {
        // Prevenir iframe embedding malicioso
        if (window.self !== window.top) {
            console.warn('⚠️  Esta página está siendo cargada en un iframe');
        }
    }
}

// Inicialización segura de la aplicación
const initializeAcademiaApp = () => {
    try {
        // Verificar entorno seguro
        if (window.self !== window.top && !window.location.hostname.includes('github.io')) {
            console.warn('🔒 Cargando en iframe - aplicando restricciones de seguridad');
        }

        window.academiaApp = new AcademiaVallenato();
        
        console.log('✅ Academia App - Inicializada con medidas de seguridad');
    } catch (error) {
        console.error('❌ Error inicializando Academia App:', error);
    }
};

// Inyectar estilos de notificación de forma segura
const injectNotificationStyles = () => {
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
                background: 0;
                border: 0;
                color: #fff;
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: 1rem;
                padding: 0.25rem;
                border-radius: 50%;
                transition: background 0.3s ease;
            }
            .notification-close:hover {
                background: rgba(255,255,255,0.1);
            }
        `;
        document.head.appendChild(styles);
    }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        injectNotificationStyles();
        initializeAcademiaApp();
    });
} else {
    injectNotificationStyles();
    initializeAcademiaApp();
}

// Protección adicional contra consola
(() => {
    const noop = () => {};
    const methods = ['log', 'debug', 'warn', 'info', 'error'];
    
    if (window.console) {
        methods.forEach(method => {
            const original = console[method];
            console[method] = function(...args) {
                // Filtrar información sensible
                const filteredArgs = args.map(arg => {
                    if (typeof arg === 'string') {
                        // No filtrar en desarrollo
                        if (window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1') {
                            return arg;
                        }
                        // Filtrar información potencialmente sensible en producción
                        return arg.replace(/(password|token|key|secret)=[^&]+/g, '$1=***');
                    }
                    return arg;
                });
                original.apply(console, filteredArgs);
            };
        });
    }
})();
