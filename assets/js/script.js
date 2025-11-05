=== ARCHIVO: script.js ===
/* SISTEMA TRADUCCIÓN Y FUNCIONALIDADES - ACADEMIA VALLENATO CARTAGENA */
class TranslationSystem {
    constructor() {
        this.currentLang = 'es';
        this.translations = {
            es: {
                'hero.title':'Descubre el Alma del Vallenato','hero.subtitle':'Aprende los secretos del acordeón, la caja y la guacharaca con los mejores maestros de la música colombiana.','hero.cta1':'Ver Clases','hero.cta2':'Contactar','about.title':'Sobre la Academia','about.subtitle':'Preservando y enseñando la tradición vallenata desde 2010','about.mission.title':'Nuestra Misión','about.mission.text':'Formar músicos integrales en el género vallenato, preservando sus raíces tradicionales mientras incorporamos técnicas modernas de enseñanza.','about.vision.title':'Nuestra Visión','about.vision.text':'Ser el centro de enseñanza de vallenato más reconocido de Colombia, formando a las nuevas generaciones de acordeoneros y músicos tradicionales.','about.history.title':'Nuestra Historia','about.history.text':'Fundada en 2010 por el maestro acordeonero Rafael Martínez, la Academia del Vallenato ha formado a más de 500 músicos que hoy en día llevan nuestra tradición por todo el mundo.','services.title':'Nuestros Servicios','services.subtitle':'Todo lo que necesitas para tu formación musical','services.pedagogy.title':'Pedagogía Musical','services.pedagogy.description':'Metodología especializada para niños, jóvenes y adultos. Aprende a tu ritmo con nuestro sistema progresivo.','services.classes.title':'Clases de Música','services.classes.description':'Clases prácticas de acordeón, caja vallenata, guacharaca, bajo eléctrico y canto. Enfoque 100% práctico.','services.liveMusic.title':'Música en Vivo','services.liveMusic.description':'Contrata nuestras agrupaciones vallenatas para eventos privados, bodas, fiestas y presentaciones especiales.','services.learnMore':'Más información','instruments.title':'Instrumentos Vallenatos','instruments.subtitle':'Encuentra los mejores instrumentos para tu práctica musical','instruments.accordion.name':'Acordeón Hohner Corona II','instruments.accordion.description':'Acordeón profesional de 34 notas, ideal para vallenato tradicional.','instruments.accordion.price':'$4.500.000 COP','instruments.caja.name':'Caja Vallenata Profesional','instruments.caja.description':'Caja artesanal en madera de roble con parches de cuero natural.','instruments.caja.price':'$350.000 COP','instruments.guacharaca.name':'Guacharaca Tradicional','instruments.guacharaca.description':'Guacharaca artesanal en madera de guayacán con rascador de metal.','instruments.guacharaca.price':'$120.000 COP','instruments.viewDetails':'Ver detalles','instruments.seeAll':'Ver todos los instrumentos','testimonials.title':'Testimonios','testimonials.subtitle':'Lo que dicen nuestros estudiantes','testimonials.testimonial1.text':'"La Academia del Vallenato transformó mi forma de entender la música. En 6 meses ya podía tocar varias canciones tradicionales."','testimonials.testimonial1.author':'Carlos Mendoza','testimonials.testimonial1.role':'Estudiante de acordeón','testimonials.testimonial2.text':'"Los profesores son excelentes y la metodología es muy práctica. Mi hijo de 10 años ya toca la guacharaca como un profesional."','testimonials.testimonial2.author':'María González','testimonials.testimonial2.role':'Madre de estudiante','cta.title':'¿Listo para comenzar tu viaje musical?','cta.text':'Únete a nuestra comunidad y descubre el fascinante mundo del vallenato.','cta.contact':'Contáctanos','cta.classes':'Ver clases','footer.description':'Formando a los músicos vallenatos del futuro desde 2010.','footer.links.title':'Enlaces rápidos','footer.links.home':'Inicio','footer.links.services':'Servicios','footer.links.classes':'Clases','footer.links.instruments':'Instrumentos','footer.links.contact':'Contacto','footer.contact.title':'Contacto','footer.contact.address':'Calle 45 # 12-34, Valledupar, Colombia','footer.newsletter.title':'Boletín informativo','footer.newsletter.description':'Suscríbete para recibir noticias sobre cursos y eventos.','footer.newsletter.placeholder':'Tu correo electrónico','footer.newsletter.subscribe':'Suscribirse','footer.copyright':'© 2023 Academia del Vallenato. Todos los derechos reservados.','footer.privacy':'Política de privacidad','footer.terms':'Términos de servicio'
            },
            en: {
                'hero.title':'Discover the Soul of Vallenato','hero.subtitle':'Learn the secrets of the accordion, caja and guacharaca with the best teachers of Colombian music.','hero.cta1':'View Classes','hero.cta2':'Contact Us','about.title':'About the Academy','about.subtitle':'Preserving and teaching the vallenato tradition since 2010','about.mission.title':'Our Mission','about.mission.text':'To train comprehensive musicians in the vallenato genre, preserving its traditional roots while incorporating modern teaching techniques.','about.vision.title':'Our Vision','about.vision.text':'To be the most recognized vallenato teaching center in Colombia, training the new generations of accordionists and traditional musicians.','about.history.title':'Our History','about.history.text':'Founded in 2010 by master accordionist Rafael Martínez, the Vallenato Academy has trained more than 500 musicians who today carry our tradition around the world.','services.title':'Our Services','services.subtitle':'Everything you need for your musical training','services.pedagogy.title':'Music Pedagogy','services.pedagogy.description':'Specialized methodology for children, youth and adults. Learn at your own pace with our progressive system.','services.classes.title':'Music Classes','services.classes.description':'Practical classes in accordion, vallenato drum, guacharaca, electric bass and singing. 100% practical approach.','services.liveMusic.title':'Live Music','services.liveMusic.description':'Hire our vallenato groups for private events, weddings, parties and special presentations.','services.learnMore':'Learn More','instruments.title':'Vallenato Instruments','instruments.subtitle':'Find the best instruments for your musical practice','instruments.accordion.name':'Hohner Corona II Accordion','instruments.accordion.description':'Professional 34-note accordion, ideal for traditional vallenato.','instruments.accordion.price':'$4,500,000 COP','instruments.caja.name':'Professional Vallenato Drum','instruments.caja.description':'Artisanal drum made of oak wood with natural leather patches.','instruments.caja.price':'$350,000 COP','instruments.guacharaca.name':'Traditional Guacharaca','instruments.guacharaca.description':'Artisanal guacharaca made of guayacán wood with metal scraper.','instruments.guacharaca.price':'$120,000 COP','instruments.viewDetails':'View Details','instruments.seeAll':'See All Instruments','testimonials.title':'Testimonials','testimonials.subtitle':'What our students say','testimonials.testimonial1.text':'"The Vallenato Academy transformed my understanding of music. In 6 months I could already play several traditional songs."','testimonials.testimonial1.author':'Carlos Mendoza','testimonials.testimonial1.role':'Accordion Student','testimonials.testimonial2.text':'"The teachers are excellent and the methodology is very practical. My 10-year-old son already plays the guacharaca like a professional."','testimonials.testimonial2.author':'María González','testimonials.testimonial2.role':'Student\'s Mother','cta.title':'Ready to Start Your Musical Journey?','cta.text':'Join our community and discover the fascinating world of vallenato.','cta.contact':'Contact Us','cta.classes':'View Classes','footer.description':'Training the vallenato musicians of the future since 2010.','footer.links.title':'Quick Links','footer.links.home':'Home','footer.links.services':'Services','footer.links.classes':'Classes','footer.links.instruments':'Instruments','footer.links.contact':'Contact','footer.contact.title':'Contact','footer.contact.address':'Street 45 # 12-34, Valledupar, Colombia','footer.newsletter.title':'Newsletter','footer.newsletter.description':'Subscribe to receive news about courses and events.','footer.newsletter.placeholder':'Your email address','footer.newsletter.subscribe':'Subscribe','footer.copyright':'© 2023 Vallenato Academy. All rights reserved.','footer.privacy':'Privacy Policy','footer.terms':'Terms of Service'
            }
        };
        this.init();
    }

    init() {
        const savedLang = localStorage.getItem('academia-vallenato-lang');
        if (savedLang) this.currentLang = savedLang;
        this.applyTranslations();
        this.setupLanguageSelector();
    }

    setupLanguageSelector() {
        const toggle = document.getElementById('language-toggle');
        const options = document.querySelectorAll('.language-option');
        this.updateLanguageButton();
        options.forEach(o => o.addEventListener('click', () => {
            const lang = o.getAttribute('data-lang');
            this.changeLanguage(lang);
        }));
    }

    updateLanguageButton() {
        const t = document.getElementById('language-toggle');
        const f = t.querySelector('.language-flag'), tx = t.querySelector('.language-text');
        if (this.currentLang === 'es') { f.textContent = '🇪🇸'; tx.textContent = 'ES'; }
        else { f.textContent = '🇺🇸'; tx.textContent = 'EN'; }
    }

    changeLanguage(lang) {
        if (this.currentLang !== lang && this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('academia-vallenato-lang', lang);
            this.applyTranslations();
            this.updateLanguageButton();
        }
    }

    applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(e => {
            const k = e.getAttribute('data-i18n');
            if (this.translations[this.currentLang][k]) e.textContent = this.translations[this.currentLang][k];
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(e => {
            const k = e.getAttribute('data-i18n-placeholder');
            if (this.translations[this.currentLang][k]) e.setAttribute('placeholder', this.translations[this.currentLang][k]);
        });
    }
}

/* SISTEMA NAVEGACIÓN Y SCROLL OPTIMIZADO */
class NavigationSystem {
    constructor(){this.init();}
    init(){this.setupMobileMenu();this.setupScrollEffects();this.setupActiveNavLinks();}

    setupMobileMenu(){
        const m=document.getElementById('menu-toggle'),n=document.querySelector('.nav');
        if(m&&n)m.addEventListener('click',()=>{n.classList.toggle('active');m.classList.toggle('active');});
        document.querySelectorAll('.nav-link').forEach(l=>l.addEventListener('click',()=>{n.classList.remove('active');m.classList.remove('active');}));
    }

    setupScrollEffects(){
        const h=document.querySelector('.header');
        let ticking=false;
        const updateHeader=()=>{window.scrollY>100?h.classList.add('scrolled'):h.classList.remove('scrolled');ticking=false;};
        const requestTick=()=>{if(!ticking){requestAnimationFrame(updateHeader);ticking=true;}};
        window.addEventListener('scroll',requestTick,{passive:true});
    }

    setupActiveNavLinks(){
        const s=document.querySelectorAll('section[id]'),l=document.querySelectorAll('.nav-link');
        let ticking=false;
        const updateActive=()=>{
            let c='';s.forEach(s=>{if(scrollY>=s.offsetTop-150)c=s.getAttribute('id');});
            l.forEach(l=>{l.classList.remove('active');if(l.getAttribute('data-section')===c)l.classList.add('active');});
            ticking=false;
        };
        const requestTick=()=>{if(!ticking){requestAnimationFrame(updateActive);ticking=true;}};
        window.addEventListener('scroll',requestTick,{passive:true});
    }
}

/* SISTEMA FORMULARIOS OPTIMIZADO */
class FormSystem {
    constructor(){this.init();}
    init(){this.setupNewsletterForm();}
    setupNewsletterForm(){
        const f=document.querySelector('.newsletter-form');
        if(f)f.addEventListener('submit',e=>{
            e.preventDefault();
            const e=f.querySelector('input[type="email"]').value;
            if(this.validateEmail(e)){alert('¡Gracias por suscribirte!');f.reset();}
            else alert('Email inválido.');
        });
    }
    validateEmail(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);}
}

/* INICIALIZACIÓN GLOBAL OPTIMIZADA */
document.addEventListener('DOMContentLoaded',()=>{
    new TranslationSystem();new NavigationSystem();new FormSystem();
    if(typeof StatsSystem!=='undefined')new StatsSystem();
    
    // ANIMACIONES SCROLL OPTIMIZADAS
    const a=document.querySelectorAll('.service-card,.instrument-card,.testimonial');
    a.forEach(e=>{
        e.style.opacity='0';
        e.style.transform='translateY(20px)';
        e.style.transition='opacity .6s ease,transform .6s ease';
    });
    
    let ticking=false;
    const animateOnScroll=()=>{
        a.forEach(e=>{
            if(e.getBoundingClientRect().top<window.innerHeight-100){
                e.style.opacity='1';
                e.style.transform='translateY(0)';
            }
        });
        ticking=false;
    };
    
    const requestTick=()=>{
        if(!ticking){
            requestAnimationFrame(animateOnScroll);
            ticking=true;
        }
    };
    
    window.addEventListener('scroll',requestTick,{passive:true});
    animateOnScroll(); // Ejecutar una vez al cargar
});
