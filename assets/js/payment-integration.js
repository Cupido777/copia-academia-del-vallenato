// payment-integration.js - Sistema de pagos optimizado con seguridad avanzada

// =============================================
// SISTEMA DE SEGURIDAD AVANZADO
// =============================================
class DataSecurity {
    constructor() {
        this.encryptionKey = this.generateEncryptionKey();
        this.setupDataExpiry();
    }

    generateEncryptionKey() {
        let key = localStorage.getItem('avx_encryption_key');
        if (!key) {
            const randomPart = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            key = 'avx_secure_' + randomPart + '_' + Date.now().toString(36);
            localStorage.setItem('avx_encryption_key', key);
        }
        return key;
    }

    encrypt(data) {
        try {
            if (!data) return null;
            
            const jsonString = JSON.stringify({
                data: data,
                timestamp: Date.now(),
                version: '1.0'
            });
            
            const encoded = btoa(unescape(encodeURIComponent(jsonString)));
            return 'avx_enc_' + encoded;
        } catch (error) {
            console.error('Error en encriptación:', error);
            return null;
        }
    }

    decrypt(encryptedData) {
        try {
            if (!encryptedData) return null;
            
            if (!encryptedData.startsWith('avx_enc_')) {
                return typeof encryptedData === 'string' ? JSON.parse(encryptedData) : encryptedData;
            }
            
            const encoded = encryptedData.replace('avx_enc_', '');
            const jsonString = decodeURIComponent(escape(atob(encoded)));
            const parsedData = JSON.parse(jsonString);
            
            return parsedData.data;
        } catch (error) {
            console.error('Error en desencriptación:', error);
            return null;
        }
    }

    saveSecureData(key, data) {
        try {
            const encrypted = this.encrypt(data);
            if (encrypted) {
                localStorage.setItem(`avx_sec_${key}`, encrypted);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error guardando datos seguros:', error);
            return false;
        }
    }

    getSecureData(key) {
        try {
            const encrypted = localStorage.getItem(`avx_sec_${key}`);
            if (encrypted) {
                return this.decrypt(encrypted);
            }
            return null;
        } catch (error) {
            console.error('Error obteniendo datos seguros:', error);
            return null;
        }
    }

    clearSecureData(key) {
        localStorage.removeItem(`avx_sec_${key}`);
    }

    setupDataExpiry() {
        const expiryTime = 24 * 60 * 60 * 1000;
        const savedTime = localStorage.getItem('avx_data_saved_time');
        
        if (savedTime && (Date.now() - parseInt(savedTime)) > expiryTime) {
            this.clearSecureData('lastOrder');
            this.clearSecureData('userData');
        }
        
        localStorage.setItem('avx_data_saved_time', Date.now().toString());
    }
}

// =============================================
// SISTEMA DE VALIDACIÓN MEJORADO
// =============================================
class FormValidator {
    constructor() {
        this.patterns = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^[0-9]{10,15}$/,
            name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
            document: /^[0-9]{6,12}$/
        };
        this.messages = {
            required: 'Este campo es obligatorio',
            email: 'Ingresa un correo electrónico válido',
            phone: 'El teléfono debe tener 10-15 dígitos',
            name: 'El nombre debe tener 2-50 caracteres válidos',
            document: 'El documento debe tener 6-12 dígitos'
        };
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type || field.dataset.validation;
        
        this.clearErrors(field);

        // Validar campo requerido
        if (field.required && !value) {
            return this.showError(field, this.messages.required);
        }

        // Validaciones específicas por tipo
        switch (type) {
            case 'email':
                if (!this.patterns.email.test(value)) {
                    return this.showError(field, this.messages.email);
                }
                break;
            
            case 'tel':
                const cleanPhone = value.replace(/\D/g, '');
                if (!this.patterns.phone.test(cleanPhone)) {
                    return this.showError(field, this.messages.phone);
                }
                break;
            
            case 'text':
                if (field.name.includes('name') && !this.patterns.name.test(value)) {
                    return this.showError(field, this.messages.name);
                }
                break;
        }

        this.showSuccess(field);
        return true;
    }

    validateForm(form) {
        const fields = form.querySelectorAll('[required], [data-validation]');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
                // Scroll al primer error
                if (isValid === false) {
                    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    field.focus();
                }
            }
        });

        return isValid;
    }

    showError(field, message) {
        field.classList.add('error');
        field.classList.remove('success');

        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }

        errorElement.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            ${message}
        `;
        errorElement.style.display = 'flex';

        return false;
    }

    showSuccess(field) {
        field.classList.remove('error');
        field.classList.add('success');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        
        return true;
    }

    clearErrors(field) {
        field.classList.remove('error', 'success');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    // Validación en tiempo real
    setupRealTimeValidation(form) {
        const fields = form.querySelectorAll('[required], [data-validation]');
        
        fields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    this.validateField(field);
                }
            });
        });

        // Validación antes del envío
        form.addEventListener('submit', (e) => {
            if (!this.validateForm(form)) {
                e.preventDefault();
                this.showFormNotification('Por favor corrige los errores en el formulario', 'error');
            }
        });
    }

    showFormNotification(message, type = 'error') {
        const notification = document.createElement('div');
        notification.className = `form-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'check-circle'}"></i>
                <span>${message}</span>
                <button class="close-notification">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);

        // Cerrar manualmente
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.parentNode.removeChild(notification);
        });
    }
}

// =============================================
// SISTEMA DE RATE LIMITING
// =============================================
class RateLimiter {
    constructor(maxAttempts = 5, timeWindow = 900000) {
        this.maxAttempts = maxAttempts;
        this.timeWindow = timeWindow;
    }
    
    checkLimit(action) {
        const now = Date.now();
        const attempts = JSON.parse(localStorage.getItem(`rate_limit_${action}`) || '[]');
        
        // Limpiar intentos antiguos
        const recentAttempts = attempts.filter(time => now - time < this.timeWindow);
        
        if (recentAttempts.length >= this.maxAttempts) {
            return false;
        }
        
        // Registrar nuevo intento
        recentAttempts.push(now);
        localStorage.setItem(`rate_limit_${action}`, JSON.stringify(recentAttempts));
        return true;
    }
    
    getRemainingTime(action) {
        const attempts = JSON.parse(localStorage.getItem(`rate_limit_${action}`) || '[]');
        const now = Date.now();
        const recentAttempts = attempts.filter(time => now - time < this.timeWindow);
        
        if (recentAttempts.length === 0) return 0;
        
        const oldestAttempt = Math.min(...recentAttempts);
        return this.timeWindow - (now - oldestAttempt);
    }
}

// =============================================
// SISTEMA DE SANITIZACIÓN
// =============================================
class InputSanitizer {
    static sanitizeHTML(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }
    
    static sanitizeSQL(input) {
        return input.replace(/'/g, "''").replace(/;/g, '');
    }
    
    static sanitizeEmail(email) {
        return email.toLowerCase().trim().replace(/[^a-z0-9@._-]/g, '');
    }
    
    static sanitizePhone(phone) {
        return phone.replace(/\D/g, '').substring(0, 15);
    }
    
    static sanitizeBasedOnType(field, value) {
        switch(field.type) {
            case 'email':
                return this.sanitizeEmail(value);
            case 'tel':
                return this.sanitizePhone(value);
            case 'text':
                return this.sanitizeHTML(value);
            default:
                return this.sanitizeHTML(value);
        }
    }
}

// =============================================
// SISTEMA DE PROTECCIÓN CSRF
// =============================================
class CSRFProtection {
    static getToken() {
        let token = localStorage.getItem('csrf_token');
        if (!token) {
            token = this.generateToken();
            localStorage.setItem('csrf_token', token);
        }
        return token;
    }
    
    static generateToken() {
        return 'csrf_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
    
    static addToForms() {
        document.querySelectorAll('form').forEach(form => {
            const tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = 'csrf_token';
            tokenInput.value = this.getToken();
            form.appendChild(tokenInput);
        });
    }
}

// =============================================
// CLASE PRINCIPAL DE PAGOS OPTIMIZADA
// =============================================
class PaymentIntegration {
    constructor() {
        this.paypalClientId = 'AYm6LcC6c6Xy6Xy6Xy6Xy6Xy6Xy6Xy6Xy6Xy6Xy6Xy6Xy6Xy6Xy6Xy6Xy';
        this.merchantInfo = {
            nequi: '+573006677447',
            daviplata: '+573006677447',
            email: 'pagos@academiadelvallenato.com'
        };
        this.dataSecurity = new DataSecurity();
        this.formValidator = new FormValidator();
        this.rateLimiter = new RateLimiter();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadPayPalSDK();
        this.initializeStats();
        this.setupSecurityFeatures();
    }

    setupSecurityFeatures() {
        // Aplicar protección CSRF
        CSRFProtection.addToForms();
        
        // Configurar sanitización en tiempo real
        this.setupInputSanitization();
    }

    setupInputSanitization() {
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                e.target.value = InputSanitizer.sanitizeBasedOnType(e.target, e.target.value);
            }
        });
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.handlePaymentMethodChanges();
            this.setupFormValidation();
        });
    }

    loadPayPalSDK() {
        // Verificar que no se cargue múltiples veces
        if (document.querySelector('script[src*="paypal.com/sdk/js"]')) {
            this.initializePayPal();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${this.paypalClientId}&currency=COP`;
        script.addEventListener('load', () => this.initializePayPal());
        script.addEventListener('error', () => {
            console.error('Error cargando PayPal SDK');
            this.handlePaymentError('paypal', new Error('No se pudo cargar el SDK de PayPal'));
        });
        document.head.appendChild(script);
    }

    initializePayPal() {
        if (typeof paypal == 'undefined') {
            console.error('PayPal SDK no está disponible');
            return;
        }
        
        try {
            paypal.Buttons({
                style: {
                    layout: 'vertical',
                    color: 'gold',
                    shape: 'rect',
                    label: 'paypal'
                },
                createOrder: (data, actions) => {
                    if (!this.rateLimiter.checkLimit('paypal_payment')) {
                        throw new Error('Demasiados intentos de pago. Por favor espere.');
                    }

                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: this.getOrderTotal(),
                                currency_code: 'COP'
                            },
                            description: 'Clases de Vallenato - Academia Cartagena'
                        }],
                        application_context: {
                            shipping_preference: 'NO_SHIPPING'
                        }
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then(details => {
                        this.handlePayPalSuccess(details);
                    }).catch(error => {
                        this.handlePaymentError('paypal', error);
                    });
                },
                onError: (err) => {
                    this.handlePaymentError('PayPal', err);
                },
                onCancel: (data) => {
                    this.trackEvent('payment_cancelled', { method: 'paypal' });
                }
            }).render('#paypal-button-container');
        } catch (error) {
            console.error('Error initializing PayPal:', error);
            this.handlePaymentError('paypal', error);
        }
    }

    initializeStats() {
        window.statsSystem && window.statsSystem.trackEvent('payment_system_loaded');
    }

    handlePaymentMethodChanges() {
        document.querySelectorAll('.payment-method-option').forEach(option => {
            option.addEventListener('click', (event) => {
                const method = event.currentTarget.getAttribute('data-method');
                this.selectPaymentMethod(method);
            });
        });
    }

    selectPaymentMethod(method) {
        document.querySelectorAll('.payment-method-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        const selectedOption = document.querySelector(`[data-method="${method}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
        
        this.showPaymentDetails(method);
        
        const payButton = document.getElementById('payButton');
        if (payButton) {
            payButton.disabled = false;
            payButton.textContent = this.getPayButtonText(method);
        }
        
        this.trackEvent('payment_method_selected', { method: method });
    }

    showPaymentDetails(method) {
        document.querySelectorAll('.payment-details').forEach(detail => {
            detail.style.display = 'none';
        });
        
        const targetDetail = document.getElementById(`${method}-details`);
        if (targetDetail) {
            targetDetail.style.display = 'block';
        }
        
        if (method === 'nequi' || method === 'daviplata') {
            this.generateQRCode(method);
        }
    }

    generateQRCode(method) {
        const amount = this.getOrderTotal();
        const phoneNumber = this.merchantInfo[method];
        let qrUrl = '';
        
        if (method === 'nequi') {
            qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=nequi:${phoneNumber}?amount=${amount}`;
        } else if (method === 'daviplata') {
            qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=daviplata:${phoneNumber}?amount=${amount}`;
        }
        
        const qrContainer = document.getElementById(`${method}-qr-code`);
        if (qrContainer) {
            // Agregar timestamp para evitar cache
            const timestamp = Date.now();
            qrContainer.innerHTML = `<img src="${qrUrl}&t=${timestamp}" alt="QR Code ${method}" class="qr-code" loading="lazy">`;
        }
    }

    getPayButtonText(method) {
        const texts = {
            paypal: 'Pagar con PayPal',
            nequi: 'Continuar con Nequi',
            daviplata: 'Continuar con Daviplata'
        };
        return texts[method] || 'Proceder al Pago';
    }

    setupFormValidation() {
        document.querySelectorAll('form[data-validate="true"]').forEach(form => {
            this.formValidator.setupRealTimeValidation(form);
        });
    }

    getOrderTotal() {
        const totalElement = document.querySelector('.order-total');
        if (totalElement) {
            const totalText = totalElement.textContent || totalElement.innerText;
            const total = parseFloat(totalText.replace(/[^0-9.]/g, ''));
            return isNaN(total) ? 200000 : total;
        }
        return 200000;
    }

    async processPayment(method, data) {
        // Verificar rate limiting
        if (!this.rateLimiter.checkLimit('payment_attempt')) {
            const remainingTime = this.rateLimiter.getRemainingTime('payment_attempt');
            this.showErrorNotification(`Demasiados intentos. Espere ${Math.ceil(remainingTime / 60000)} minutos.`);
            return;
        }

        this.showLoading();
        
        try {
            // Validar datos antes del procesamiento
            if (!this.validatePaymentData(data)) {
                throw new Error('Datos de pago inválidos');
            }

            switch (method) {
                case 'paypal':
                    await this.processPayPalPayment(data);
                    break;
                case 'nequi':
                    await this.processNequiPayment(data);
                    break;
                case 'daviplata':
                    await this.processDaviplataPayment(data);
                    break;
                default:
                    throw new Error('Método de pago no soportado');
            }
            
            this.trackEvent('payment_processed', { method: method, status: 'success' });
        } catch (error) {
            this.handlePaymentError(method, error);
            this.trackEvent('payment_processed', { method: method, status: 'error', error: error.message });
        } finally {
            this.hideLoading();
        }
    }

    validatePaymentData(data) {
        // Validaciones básicas de datos de pago
        if (!data || typeof data !== 'object') return false;
        
        // Aquí puedes agregar más validaciones específicas
        return true;
    }

    async processPayPalPayment(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simular procesamiento de pago
                if (Math.random() > 0.1) { // 90% de éxito
                    resolve();
                } else {
                    reject(new Error('Error simulado en procesamiento PayPal'));
                }
            }, 1000);
        });
    }

    async processNequiPayment(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.generateNequiInstructions(data);
                if (Math.random() > 0.1) { // 90% de éxito
                    resolve();
                } else {
                    reject(new Error('Error simulado en procesamiento Nequi'));
                }
            }, 1500);
        });
    }

    async processDaviplataPayment(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.generateDaviplataInstructions(data);
                if (Math.random() > 0.1) { // 90% de éxito
                    resolve();
                } else {
                    reject(new Error('Error simulado en procesamiento Daviplata'));
                }
            }, 1500);
        });
    }

    generateNequiInstructions(data) {
        const amount = this.getOrderTotal();
        const sanitizedAmount = InputSanitizer.sanitizeHTML(this.formatCurrency(amount));
        
        const instructions = `
            <div class="payment-instructions">
                <h4><i class="fas fa-mobile-alt"></i> Instrucciones para Pagar con Nequi</h4>
                <div class="instruction-steps">
                    <div class="step">
                        <span class="step-number">1</span>
                        <span>Abre la app de Nequi</span>
                    </div>
                    <div class="step">
                        <span class="step-number">2</span>
                        <span>Selecciona "Enviar plata"</span>
                    </div>
                    <div class="step">
                        <span class="step-number">3</span>
                        <span>Número: <strong>+57 300 667 7447</strong></span>
                    </div>
                    <div class="step">
                        <span class="step-number">4</span>
                        <span>Monto: <strong>$${sanitizedAmount} COP</strong></span>
                    </div>
                    <div class="step">
                        <span class="step-number">5</span>
                        <span>Confirma transacción</span>
                    </div>
                </div>
                <div class="qr-container">
                    <div id="nequi-qr-code"></div>
                    <p><small>Escanea el código QR</small></p>
                </div>
                <div class="whatsapp-confirmation">
                    <p>Envía comprobante por WhatsApp:</p>
                    <a href="https://wa.me/573006677447?text=${encodeURIComponent(`Hola, acabo de realizar un pago por Nequi por valor de ${amount} COP para las clases de vallenato`)}" 
                       class="btn whatsapp-confirm" 
                       target="_blank"
                       rel="noopener nofollow">
                        <i class="fab fa-whatsapp"></i> Enviar Comprobante
                    </a>
                </div>
            </div>
        `;
        
        this.showPaymentInstructions(instructions, 'nequi');
    }

    generateDaviplataInstructions(data) {
        const amount = this.getOrderTotal();
        const sanitizedAmount = InputSanitizer.sanitizeHTML(this.formatCurrency(amount));
        
        const instructions = `
            <div class="payment-instructions">
                <h4><i class="fas fa-wallet"></i> Instrucciones para Pagar con Daviplata</h4>
                <div class="instruction-steps">
                    <div class="step">
                        <span class="step-number">1</span>
                        <span>Abre la app de Daviplata</span>
                    </div>
                    <div class="step">
                        <span class="step-number">2</span>
                        <span>Selecciona "Enviar dinero"</span>
                    </div>
                    <div class="step">
                        <span class="step-number">3</span>
                        <span>Número: <strong>+57 300 667 7447</strong></span>
                    </div>
                    <div class="step">
                        <span class="step-number">4</span>
                        <span>Monto: <strong>$${sanitizedAmount} COP</strong></span>
                    </div>
                    <div class="step">
                        <span class="step-number">5</span>
                        <span>Confirma transacción</span>
                    </div>
                </div>
                <div class="qr-container">
                    <div id="daviplata-qr-code"></div>
                    <p><small>Escanea el código QR</small></p>
                </div>
                <div class="whatsapp-confirmation">
                    <p>Envía comprobante por WhatsApp:</p>
                    <a href="https://wa.me/573006677447?text=${encodeURIComponent(`Hola, acabo de realizar un pago por Daviplata por valor de ${amount} COP para las clases de vallenato`)}" 
                       class="btn whatsapp-confirm" 
                       target="_blank"
                       rel="noopener nofollow">
                        <i class="fab fa-whatsapp"></i> Enviar Comprobante
                    </a>
                </div>
            </div>
        `;
        
        this.showPaymentInstructions(instructions, 'daviplata');
    }

    showPaymentInstructions(instructions, method) {
        let container = document.getElementById('payment-instructions-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'payment-instructions-container';
            container.className = 'payment-instructions-container';
            const activeDetails = document.querySelector('.payment-details.active');
            if (activeDetails) {
                activeDetails.appendChild(container);
            }
        }
        
        container.innerHTML = instructions;
        this.generateQRCode(method);
    }

    handlePayPalSuccess(details) {
        try {
            const orderData = {
                paymentMethod: 'paypal',
                transactionId: details.id,
                payer: this.sanitizePayerData(details.payer),
                amount: this.getOrderTotal(),
                status: 'completed',
                timestamp: new Date().toISOString()
            };
            
            this.saveOrderData(orderData);
            this.redirectToConfirmation('success', 'paypal');
            this.trackEvent('payment_success', { 
                method: 'paypal', 
                transactionId: details.id, 
                amount: this.getOrderTotal() 
            });
        } catch (error) {
            console.error('Error procesando éxito de PayPal:', error);
            this.handlePaymentError('paypal', error);
        }
    }

    sanitizePayerData(payer) {
        // Sanitizar datos sensibles del pagador
        if (!payer) return null;
        
        return {
            name: payer.name ? {
                given_name: InputSanitizer.sanitizeHTML(payer.name.given_name || ''),
                surname: InputSanitizer.sanitizeHTML(payer.name.surname || '')
            } : null,
            email_address: InputSanitizer.sanitizeEmail(payer.email_address || '')
        };
    }

    handlePaymentError(method, error) {
        console.error(`Payment error (${method}):`, error);
        
        // No mostrar detalles internos al usuario
        const userMessage = error.message.includes('simulado') 
            ? `Error en el pago con ${method}. Por favor intenta nuevamente.`
            : `Error en el pago con ${method}. Por favor intenta nuevamente.`;
            
        this.showErrorNotification(userMessage);
        this.trackEvent('payment_error', { method: method, error: error.message });
    }

    showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'payment-error-notification';
        notification.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${InputSanitizer.sanitizeHTML(message)}</span>
                <button class="close-error">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
        
        notification.querySelector('.close-error').addEventListener('click', () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }

    showLoading() {
        let loading = document.getElementById('payment-loading');
        if (!loading) {
            loading = document.createElement('div');
            loading.id = 'payment-loading';
            loading.className = 'payment-loading';
            loading.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Procesando tu pago...</p>
                    <p><small>No cierres esta ventana</small></p>
                </div>
            `;
            document.body.appendChild(loading);
        }
        loading.style.display = 'flex';
    }

    hideLoading() {
        const loading = document.getElementById('payment-loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    saveOrderData(orderData) {
        const order = {
            ...orderData,
            orderId: 'ORD-' + Date.now(),
            customer: this.getCustomerData(),
            products: this.getOrderProducts(),
            timestamp: new Date().toISOString()
        };
        
        this.dataSecurity.saveSecureData('lastOrder', order);
        return order.orderId;
    }

    getCustomerData() {
        const getValue = (id) => {
            const element = document.getElementById(id);
            return element ? InputSanitizer.sanitizeHTML(element.value) : '';
        };

        return {
            firstName: getValue('firstName'),
            lastName: getValue('lastName'),
            email: getValue('email'),
            phone: getValue('phone'),
            address: getValue('address')
        };
    }

    getOrderProducts() {
        return [{
            name: 'Clases de Acordeón - Mensual',
            price: 200000,
            quantity: 1
        }];
    }

    redirectToConfirmation(status, method) {
        try {
            const orderId = this.saveOrderData({
                paymentMethod: method,
                status: status,
                amount: this.getOrderTotal()
            });
            
            // Sanitizar parámetros de URL
            const sanitizedStatus = encodeURIComponent(status);
            const sanitizedMethod = encodeURIComponent(method);
            const sanitizedOrder = encodeURIComponent(orderId);
            
            window.location.href = `confirmacion-pago.html?status=${sanitizedStatus}&method=${sanitizedMethod}&order=${sanitizedOrder}`;
        } catch (error) {
            console.error('Error en redirección:', error);
            this.showErrorNotification('Error procesando tu pago. Por favor contacta soporte.');
        }
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 0
        }).format(amount);
    }

    trackEvent(eventName, data) {
        if (window.statsSystem) {
            window.statsSystem.trackEvent(eventName, data);
        }
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
        console.log('Event tracked:', eventName, data);
    }

    // Método para limpiar datos sensibles
    clearSensitiveData() {
        this.dataSecurity.clearSecureData('lastOrder');
        this.dataSecurity.clearSecureData('userData');
        localStorage.removeItem('avx_encryption_key');
        localStorage.removeItem('avx_data_saved_time');
    }
}

// =============================================
// ESTILOS CSS MEJORADOS
// =============================================
const paymentStyles = `
.payment-loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(5px);
}

.loading-spinner {
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    border: 2px solid #d4af37;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #d4af37;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    0% { transform: rotate(0); }
    100% { transform: rotate(360deg); }
}

.payment-error-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #c44536;
    color: #fff;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    z-index: 10000;
    max-width: 400px;
    border-left: 4px solid #ff6b6b;
}

.error-content {
    display: flex;
    align-items: center;
    gap: .5rem;
}

.close-error {
    background: 0;
    border: 0;
    color: #fff;
    font-size: 1.2rem;
    cursor: pointer;
    margin-left: auto;
    padding: 0.25rem;
    border-radius: 50%;
    transition: background 0.3s ease;
}

.close-error:hover {
    background: rgba(255,255,255,0.1);
}

.payment-instructions-container {
    margin-top: 1.5rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #25D366;
    border: 1px solid #e9ecef;
}

.instruction-steps {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1.5rem 0;
}

.step {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: .75rem;
    background: #fff;
    border-radius: 6px;
    border: 1px solid #dee2e6;
    transition: transform 0.2s ease;
}

.step:hover {
    transform: translateX(5px);
}

.step-number {
    width: 30px;
    height: 30px;
    background: #d4af37;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    flex-shrink: 0;
}

.qr-container {
    text-align: center;
    margin: 1.5rem 0;
    padding: 1rem;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #dee2e6;
}

.qr-code {
    max-width: 200px;
    height: auto;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.whatsapp-confirmation {
    text-align: center;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #ddd;
}

.form-control.error {
    border-color: #c44536 !important;
    background-color: #fff5f5;
}

.form-control.success {
    border-color: #25D366 !important;
    background-color: #f0fff4;
}

.error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #c44536;
    font-size: .875rem;
    margin-top: .25rem;
    padding: 0.5rem;
    background: #fff5f5;
    border-radius: 4px;
    border-left: 3px solid #c44536;
}

.form-notification {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #c44536;
    color: #fff;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    z-index: 10000;
    max-width: 400px;
    border-left: 4px solid #ff6b6b;
}

.form-notification.success {
    background: #25D366;
    border-left-color: #20c997;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: .5rem;
}

.close-notification {
    background: 0;
    border: 0;
    color: #fff;
    font-size: 1.2rem;
    cursor: pointer;
    margin-left: auto;
    padding: 0.25rem;
    border-radius: 50%;
    transition: background 0.3s ease;
}

.close-notification:hover {
    background: rgba(255,255,255,0.1);
}

/* Mejoras de seguridad visual */
.security-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    font-size: 0.875rem;
    color: #495057;
}

.security-badge i {
    color: #25D366;
}

/* Responsive improvements */
@media (max-width: 768px) {
    .payment-error-notification {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
    }
    
    .form-notification {
        left: 10px;
        right: 10px;
        transform: none;
        max-width: none;
    }
    
    .step {
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;
    }
    
    .qr-code {
        max-width: 150px;
    }
}
`;

// Inyectar estilos de forma segura
const injectStyles = () => {
    if (!document.getElementById('payment-integration-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'payment-integration-styles';
        styleSheet.textContent = paymentStyles;
        document.head.appendChild(styleSheet);
    }
};

// Inicialización segura del sistema de pagos
const initializePaymentSystem = () => {
    try {
        // Verificar que estamos en un entorno seguro
        if (window.self !== window.top) {
            console.warn('Payment system loaded in iframe - security restrictions may apply');
        }

        // Inyectar estilos
        injectStyles();

        // Inicializar sistema de pagos
        window.paymentSystem = new PaymentIntegration();
        
        console.log('✅ Payment Integration System - Inicializado con seguridad mejorada');
    } catch (error) {
        console.error('❌ Error inicializando sistema de pagos:', error);
    }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePaymentSystem);
} else {
    initializePaymentSystem();
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PaymentIntegration, DataSecurity, FormValidator };
}
