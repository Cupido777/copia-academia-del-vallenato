// payment-integration.js - Archivo completo optimizado

// =============================================
// SECCIÓN DE SEGURIDAD - DataSecurity Class
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
// SECCIÓN DE VALIDACIÓN MEJORADA - FormValidator Class
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
// CLASE PRINCIPAL - PaymentIntegration
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
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadPayPalSDK();
        this.initializeStats();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.handlePaymentMethodChanges();
            this.setupFormValidation();
        });
    }

    loadPayPalSDK() {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${this.paypalClientId}&currency=COP`;
        script.addEventListener('load', () => this.initializePayPal());
        document.head.appendChild(script);
    }

    initializePayPal() {
        if (typeof paypal == 'undefined') return;
        
        try {
            paypal.Buttons({
                style: {
                    layout: 'vertical',
                    color: 'gold',
                    shape: 'rect',
                    label: 'paypal'
                },
                createOrder: (data, actions) => {
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
            qrContainer.innerHTML = `<img src="${qrUrl}" alt="QR Code ${method}" class="qr-code">`;
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
        this.showLoading();
        
        try {
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

    async processPayPalPayment(data) {
        return new Promise(resolve => {
            setTimeout(resolve, 1000);
        });
    }

    async processNequiPayment(data) {
        return new Promise(resolve => {
            setTimeout(() => {
                this.generateNequiInstructions(data);
                resolve();
            }, 1500);
        });
    }

    async processDaviplataPayment(data) {
        return new Promise(resolve => {
            setTimeout(() => {
                this.generateDaviplataInstructions(data);
                resolve();
            }, 1500);
        });
    }

    generateNequiInstructions(data) {
        const amount = this.getOrderTotal();
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
                        <span>Monto: <strong>$${this.formatCurrency(amount)} COP</strong></span>
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
                    <a href="https://wa.me/573006677447?text=Hola,%20acabo%20de%20realizar%20un%20pago%20por%20Nequi%20por%20valor%20de%20${amount}%20COP%20para%20las%20clases%20de%20vallenato" class="btn whatsapp-confirm" target="_blank">
                        <i class="fab fa-whatsapp"></i> Enviar Comprobante
                    </a>
                </div>
            </div>
        `;
        
        this.showPaymentInstructions(instructions, 'nequi');
    }

    generateDaviplataInstructions(data) {
        const amount = this.getOrderTotal();
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
                        <span>Monto: <strong>$${this.formatCurrency(amount)} COP</strong></span>
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
                    <a href="https://wa.me/573006677447?text=Hola,%20acabo%20de%20realizar%20un%20pago%20por%20Daviplata%20por%20valor%20de%20${amount}%20COP%20para%20las%20clases%20de%20vallenato" class="btn whatsapp-confirm" target="_blank">
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
            document.querySelector('.payment-details.active').appendChild(container);
        }
        
        container.innerHTML = instructions;
        this.generateQRCode(method);
    }

    handlePayPalSuccess(details) {
        const orderData = {
            paymentMethod: 'paypal',
            transactionId: details.id,
            payer: details.payer,
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
    }

    handlePaymentError(method, error) {
        console.error(`Payment error (${method}):`, error);
        this.showErrorNotification(`Error en el pago con ${method}. Por favor intenta nuevamente.`);
        this.trackEvent('payment_error', { method: method, error: error.message });
    }

    showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'payment-error-notification';
        notification.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
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
            notification.parentNode.removeChild(notification);
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
        return {
            firstName: document.getElementById('firstName')?.value || '',
            lastName: document.getElementById('lastName')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            address: document.getElementById('address')?.value || ''
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
        const orderId = this.saveOrderData({
            paymentMethod: method,
            status: status,
            amount: this.getOrderTotal()
        });
        
        window.location.href = `confirmacion-pago.html?status=${status}&method=${method}&order=${orderId}`;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 0
        }).format(amount);
    }

    trackEvent(eventName, data) {
        window.statsSystem && window.statsSystem.trackEvent(eventName, data);
        typeof gtag !== 'undefined' && gtag('event', eventName, data);
        console.log('Event tracked:', eventName, data);
    }
}

// =============================================
// ESTILOS CSS COMPLETOS
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
}

.loading-spinner {
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-left: 5px solid #d4af37;
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
}

.payment-instructions-container {
    margin-top: 1.5rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #25D366;
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
}

.qr-code {
    max-width: 200px;
    height: auto;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    background: #fff;
}

.whatsapp-confirmation {
    text-align: center;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #ddd;
}

.form-control.error {
    border-color: #c44536;
}

.form-control.success {
    border-color: #25D366;
}

.error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #c44536;
    font-size: .875rem;
    margin-top: .25rem;
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
}

.form-notification.success {
    background: #25D366;
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
}
`;

// Aplicar estilos al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = paymentStyles;
document.head.appendChild(styleSheet);

// Inicializar el sistema de pagos
document.addEventListener('DOMContentLoaded', () => {
    window.paymentSystem = new PaymentIntegration();
});
