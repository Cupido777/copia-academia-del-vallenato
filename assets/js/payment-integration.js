/**
 * Sistema de Integración de Pagos - Academia del Vallenato Cartagena
 * Versión: 1.0 | Optimizado para producción
 * Métodos: PayPal, Nequi, Daviplata
 * WhatsApp: +57 300 667 7447
 */

class PaymentIntegration {
    constructor() {
        this.paypalClientId = 'AYm6LcC6c6Xy6Xy6Xy6Xy6Xy6Xy6Xy6Xy6Xy6Xy6Xy6Xy6Xy6Xy6Xy6Xy';
        this.merchantInfo = {
            nequi: '+57 300 667 7447',
            daviplata: '+57 300 667 7447',
            email: 'pagos@academiadelvallenato.com'
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadPayPalSDK();
        this.initializeStats();
    }

    setupEventListeners() {
        // Detectar cambios en métodos de pago
        document.addEventListener('DOMContentLoaded', () => {
            this.handlePaymentMethodChanges();
            this.setupFormValidation();
        });
    }

    loadPayPalSDK() {
        // Cargar SDK de PayPal solo cuando sea necesario
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${this.paypalClientId}&currency=COP`;
        script.addEventListener('load', () => this.initializePayPal());
        document.head.appendChild(script);
    }

    initializePayPal() {
        if (typeof paypal === 'undefined') return;

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
                    return actions.order.capture().then((details) => {
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
        // Inicializar sistema de estadísticas si existe
        if (typeof window.statsSystem !== 'undefined') {
            window.statsSystem.trackEvent('payment_system_loaded');
        }
    }

    handlePaymentMethodChanges() {
        const paymentMethods = document.querySelectorAll('.payment-method-option');
        
        paymentMethods.forEach(method => {
            method.addEventListener('click', (e) => {
                const methodType = e.currentTarget.getAttribute('data-method');
                this.selectPaymentMethod(methodType);
            });
        });
    }

    selectPaymentMethod(method) {
        // Remover selección anterior
        document.querySelectorAll('.payment-method-option').forEach(el => {
            el.classList.remove('selected');
        });

        // Activar selección actual
        const selectedMethod = document.querySelector(`[data-method="${method}"]`);
        if (selectedMethod) {
            selectedMethod.classList.add('selected');
        }

        // Mostrar detalles del método seleccionado
        this.showPaymentDetails(method);

        // Habilitar botón de pago
        const payButton = document.getElementById('payButton');
        if (payButton) {
            payButton.disabled = false;
            payButton.textContent = this.getPayButtonText(method);
        }

        this.trackEvent('payment_method_selected', { method: method });
    }

    showPaymentDetails(method) {
        // Ocultar todos los detalles primero
        document.querySelectorAll('.payment-details').forEach(el => {
            el.style.display = 'none';
        });

        // Mostrar detalles del método seleccionado
        const detailsElement = document.getElementById(`${method}-details`);
        if (detailsElement) {
            detailsElement.style.display = 'block';
        }

        // Generar QR codes para métodos colombianos
        if (method === 'nequi' || method === 'daviplata') {
            this.generateQRCode(method);
        }
    }

    generateQRCode(method) {
        const amount = this.getOrderTotal();
        const phone = this.merchantInfo[method];
        
        let qrData = '';
        if (method === 'nequi') {
            qrData = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=nequi:${phone}?amount=${amount}`;
        } else if (method === 'daviplata') {
            qrData = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=daviplata:${phone}?amount=${amount}`;
        }

        const qrContainer = document.getElementById(`${method}-qr-code`);
        if (qrContainer) {
            qrContainer.innerHTML = `<img src="${qrData}" alt="QR Code ${method}" class="qr-code">`;
        }
    }

    getPayButtonText(method) {
        const texts = {
            'paypal': 'Pagar con PayPal',
            'nequi': 'Continuar con Nequi',
            'daviplata': 'Continuar con Daviplata'
        };
        return texts[method] || 'Proceder al Pago';
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form[data-validate="true"]');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                    this.showFormErrors(form);
                }
            });

            // Validación en tiempo real
            const inputs = form.querySelectorAll('input[required], select[required]');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('input[required], select[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remover errores previos
        this.clearFieldError(field);

        // Validaciones específicas por tipo
        switch (field.type) {
            case 'email':
                if (!this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Por favor ingresa un correo electrónico válido';
                }
                break;
            
            case 'tel':
                if (!this.isValidPhone(value)) {
                    isValid = false;
                    errorMessage = 'Por favor ingresa un número de teléfono válido (10 dígitos)';
                }
                break;
            
            default:
                if (!value) {
                    isValid = false;
                    errorMessage = 'Este campo es obligatorio';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.showFieldSuccess(field);
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length >= 10;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    showFieldSuccess(field) {
        field.classList.remove('error');
        field.classList.add('success');
    }

    showFormErrors(form) {
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }

    getOrderTotal() {
        // Obtener el total del pedido desde el DOM o calcularlo
        const totalElement = document.querySelector('.order-total');
        if (totalElement) {
            const totalText = totalElement.textContent || totalElement.innerText;
            const total = parseFloat(totalText.replace(/[^0-9.]/g, ''));
            return isNaN(total) ? 200000 : total; // Valor por defecto
        }
        return 200000; // Valor por defecto en COP
    }

    async processPayment(method, orderData) {
        this.showLoading();
        
        try {
            switch (method) {
                case 'paypal':
                    await this.processPayPalPayment(orderData);
                    break;
                
                case 'nequi':
                    await this.processNequiPayment(orderData);
                    break;
                
                case 'daviplata':
                    await this.processDaviplataPayment(orderData);
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

    async processPayPalPayment(orderData) {
        // La lógica de PayPal se maneja through el SDK
        // Esta función es para procesamiento adicional si es necesario
        return new Promise((resolve) => {
            setTimeout(resolve, 1000); // Simular procesamiento
        });
    }

    async processNequiPayment(orderData) {
        // Simular procesamiento de Nequi
        return new Promise((resolve) => {
            setTimeout(() => {
                this.generateNequiInstructions(orderData);
                resolve();
            }, 1500);
        });
    }

    async processDaviplataPayment(orderData) {
        // Simular procesamiento de Daviplata
        return new Promise((resolve) => {
            setTimeout(() => {
                this.generateDaviplataInstructions(orderData);
                resolve();
            }, 1500);
        });
    }

    generateNequiInstructions(orderData) {
        const instructions = `
            <div class="payment-instructions">
                <h4><i class="fas fa-mobile-alt"></i> Instrucciones para Pagar con Nequi</h4>
                <div class="instruction-steps">
                    <div class="step">
                        <span class="step-number">1</span>
                        <span>Abre la app de Nequi en tu celular</span>
                    </div>
                    <div class="step">
                        <span class="step-number">2</span>
                        <span>Selecciona "Enviar plata"</span>
                    </div>
                    <div class="step">
                        <span class="step-number">3</span>
                        <span>Ingresa el número: <strong>+57 300 667 7447</strong></span>
                    </div>
                    <div class="step">
                        <span class="step-number">4</span>
                        <span>Monto: <strong>$${this.formatCurrency(this.getOrderTotal())} COP</strong></span>
                    </div>
                    <div class="step">
                        <span class="step-number">5</span>
                        <span>Confirma la transacción</span>
                    </div>
                </div>
                <div class="qr-container">
                    <div id="nequi-qr-code"></div>
                    <p><small>Escanea el código QR con la app de Nequi</small></p>
                </div>
                <div class="whatsapp-confirmation">
                    <p>Después de realizar el pago, envía el comprobante por WhatsApp:</p>
                    <a href="https://wa.me/573006677447?text=Hola,%20acabo%20de%20realizar%20un%20pago%20por%20Nequi%20por%20valor%20de%20${this.getOrderTotal()}%20COP%20para%20las%20clases%20de%20vallenato" 
                       class="btn whatsapp-confirm" 
                       target="_blank">
                        <i class="fab fa-whatsapp"></i> Enviar Comprobante
                    </a>
                </div>
            </div>
        `;
        
        this.showPaymentInstructions(instructions, 'nequi');
    }

    generateDaviplataInstructions(orderData) {
        const instructions = `
            <div class="payment-instructions">
                <h4><i class="fas fa-wallet"></i> Instrucciones para Pagar con Daviplata</h4>
                <div class="instruction-steps">
                    <div class="step">
                        <span class="step-number">1</span>
                        <span>Abre la app de Daviplata en tu celular</span>
                    </div>
                    <div class="step">
                        <span class="step-number">2</span>
                        <span>Selecciona "Enviar dinero"</span>
                    </div>
                    <div class="step">
                        <span class="step-number">3</span>
                        <span>Ingresa el número: <strong>+57 300 667 7447</strong></span>
                    </div>
                    <div class="step">
                        <span class="step-number">4</span>
                        <span>Monto: <strong>$${this.formatCurrency(this.getOrderTotal())} COP</strong></span>
                    </div>
                    <div class="step">
                        <span class="step-number">5</span>
                        <span>Confirma la transacción</span>
                    </div>
                </div>
                <div class="qr-container">
                    <div id="daviplata-qr-code"></div>
                    <p><small>Escanea el código QR con la app de Daviplata</small></p>
                </div>
                <div class="whatsapp-confirmation">
                    <p>Después de realizar el pago, envía el comprobante por WhatsApp:</p>
                    <a href="https://wa.me/573006677447?text=Hola,%20acabo%20de%20realizar%20un%20pago%20por%20Daviplata%20por%20valor%20de%20${this.getOrderTotal()}%20COP%20para%20las%20clases%20de%20vallenato" 
                       class="btn whatsapp-confirm" 
                       target="_blank">
                        <i class="fab fa-whatsapp"></i> Enviar Comprobante
                    </a>
                </div>
            </div>
        `;
        
        this.showPaymentInstructions(instructions, 'daviplata');
    }

    showPaymentInstructions(html, method) {
        // Crear o actualizar contenedor de instrucciones
        let container = document.getElementById('payment-instructions-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'payment-instructions-container';
            container.className = 'payment-instructions-container';
            document.querySelector('.payment-details.active').appendChild(container);
        }
        
        container.innerHTML = html;
        this.generateQRCode(method); // Generar QR code
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
        
        this.trackEvent('payment_error', {
            method: method,
            error: error.message
        });
    }

    showErrorNotification(message) {
        // Crear notificación de error
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
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
        
        // Cerrar manualmente
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
        // Guardar datos en localStorage para la página de confirmación
        const order = {
            ...orderData,
            orderId: 'ORD-' + Date.now(),
            customer: this.getCustomerData(),
            products: this.getOrderProducts(),
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('lastOrder', JSON.stringify(order));
        return order.orderId;
    }

    getCustomerData() {
        // Obtener datos del cliente del formulario
        return {
            firstName: document.getElementById('firstName')?.value || '',
            lastName: document.getElementById('lastName')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            address: document.getElementById('address')?.value || ''
        };
    }

    getOrderProducts() {
        // Obtener productos del pedido (simulado)
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
        // Integración con sistema de estadísticas
        if (typeof window.statsSystem !== 'undefined') {
            window.statsSystem.trackEvent(eventName, data);
        }
        
        // Google Analytics (si está disponible)
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
        
        console.log('Event tracked:', eventName, data);
    }
}

// Estilos CSS para los componentes de pago
const paymentStyles = `
    .payment-loading {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }
    
    .loading-spinner {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
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
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .payment-error-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #c44536;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
    }
    
    .error-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .close-error {
        background: none;
        border: none;
        color: white;
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
        padding: 0.75rem;
        background: white;
        border-radius: 6px;
    }
    
    .step-number {
        width: 30px;
        height: 30px;
        background: #d4af37;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
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
        background: white;
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
        color: #c44536;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: none;
    }
`;

// Inyectar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = paymentStyles;
document.head.appendChild(styleSheet);

// Inicializar el sistema de pagos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.paymentSystem = new PaymentIntegration();
});

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaymentIntegration;
}
