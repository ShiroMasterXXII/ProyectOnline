document.addEventListener('DOMContentLoaded', function() {
    const itemsCarritoDiv = document.getElementById('items-carrito');
    const carritoVacioMensaje = document.getElementById('carrito-vacio-mensaje');
    const subtotalCarritoSpan = document.getElementById('subtotal-carrito');
    const envioTotalCarritoSpan = document.getElementById('envio-total-carrito');
    const totalCarritoSpan = document.getElementById('total-carrito');
    const btnVaciarCarrito = document.getElementById('btn-vaciar-carrito');
    const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');
    
    // Contadores del carrito (ya definidos y manejados en main.js, pero se incluyen para asegurar)
    const carritoContadorMobile = document.getElementById('carrito-contador-mobile');
    const carritoContadorDesktop = document.getElementById('carrito-contador-desktop');

    // Lógica para el botón "Regresar" en el carrito
    const btnRegresarCarrito = document.getElementById('btn-regresar-carrito');
    if (btnRegresarCarrito) {
        btnRegresarCarrito.addEventListener('click', e => {
            e.preventDefault(); 
            history.back(); 
        });
    }

    // --- CONSTANTES PARA EL ENVÍO GRATIS ---
    const LIMITE_ENVIO_GRATIS = 300; // Define tu umbral de envío gratis aquí
    const mensajeEnvioGratis = document.getElementById('mensaje-envio-gratis');
    // --- FIN CONSTANTES ---

    // Función para obtener el carrito del localStorage
    function getCarrito() {
        return JSON.parse(localStorage.getItem('carrito')) || [];
    }

    // Función para guardar el carrito en el localStorage
    function saveCarrito(carrito) {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    // Función para actualizar los contadores del carrito (duplicada de main.js para redundancia, idealmente solo en main.js)
    function actualizarContadorCarrito() {
        const carrito = getCarrito();
        const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
        
        if (carritoContadorMobile) { 
            carritoContadorMobile.textContent = totalItems;
        }
        if (carritoContadorDesktop) { 
            carritoContadorDesktop.textContent = totalItems;
        }
    }

    // Lógica de renderizado del carrito (solo si estamos en carrito.html)
    if (itemsCarritoDiv) { 
        function renderCarrito() {
            const carrito = getCarrito();
            itemsCarritoDiv.innerHTML = ''; 

            if (carrito.length === 0) {
                carritoVacioMensaje.style.display = 'block';
                const resumenCarritoDiv = document.querySelector('.resumen-carrito');
                if (resumenCarritoDiv) {
                    resumenCarritoDiv.style.display = 'none';
                }
                // --- LIMPIAR MENSAJE DE ENVÍO GRATIS CUANDO EL CARRITO ESTÁ VACÍO ---
                if (mensajeEnvioGratis) {
                    mensajeEnvioGratis.textContent = '';
                    mensajeEnvioGratis.classList.remove('envio-gratis-exito', 'envio-gratis-falta');
                }
                // --- FIN LIMPIEZA ---

            } else {
                carritoVacioMensaje.style.display = 'none';
                const resumenCarritoDiv = document.querySelector('.resumen-carrito');
                if (resumenCarritoDiv) {
                    resumenCarritoDiv.style.display = 'block';
                }

                let subtotal = 0;
                let costoEnvioNormal = 0; // Suma de envíos individuales si no hay envío gratis

                carrito.forEach(item => {
                    const cantidad = item.cantidad || 1;
                    const precioTotalProducto = item.precio * cantidad;
                    subtotal += precioTotalProducto;
                    // Suma el costo de envío individual para cada producto
                    costoEnvioNormal += (item.costo_envio !== undefined ? item.costo_envio : 0) * cantidad;
                });

                let costoEnvioFinal = costoEnvioNormal; // Inicialmente es el costo normal
                let mensajeEnvio = '';
                let claseMensaje = '';

                // --- LÓGICA DE ENVÍO GRATIS BASADA EN EL SUBTOTAL ---
                if (subtotal >= LIMITE_ENVIO_GRATIS) {
                    costoEnvioFinal = 0; // El envío es gratis
                    mensajeEnvio = '¡Felicidades! Tienes Envío GRATIS en tu pedido. 🎉';
                    claseMensaje = 'envio-gratis-exito';
                } else {
                    const faltaParaEnvioGratis = LIMITE_ENVIO_GRATIS - subtotal;
                    mensajeEnvio = `¡Te faltan $${faltaParaEnvioGratis.toFixed(2)} MX para Envío GRATIS!`;
                    claseMensaje = 'envio-gratis-falta';
                }
                // --- FIN LÓGICA DE ENVÍO GRATIS ---
                
                const total = subtotal + costoEnvioFinal;

                subtotalCarritoSpan.textContent = `$${subtotal.toFixed(2)} MX`;
                envioTotalCarritoSpan.textContent = `$${costoEnvioFinal.toFixed(2)} MX`; // ¡Usar el costo de envío FINAL!
                totalCarritoSpan.textContent = `$${total.toFixed(2)} MX`;

                // --- ACTUALIZAR EL MENSAJE DE ENVÍO GRATIS EN EL HTML ---
                if (mensajeEnvioGratis) {
                    mensajeEnvioGratis.textContent = mensajeEnvio;
                    mensajeEnvioGratis.className = 'mensaje-envio-gratis ' + claseMensaje;
                }
                // --- FIN ACTUALIZACIÓN MENSAJE ---

                // Generar el HTML para cada item del carrito
                carrito.forEach(item => {
                    const cantidad = item.cantidad || 1;
                    const precioTotalProducto = item.precio * cantidad;
                    const itemHTML = `
                        <div class="carrito-item">
                            <img src="${item.imagenes[0]?.url || 'img/placeholder.jpg'}" alt="${item.nombre}">
                            <div class="item-info">
                                <h4>${item.nombre}</h4>
                                <p>Precio Unitario: $${item.precio.toFixed(2)} MX</p>
                                <p>Cantidad: ${cantidad}</p>
                                <p>Envío Unitario: $${(item.costo_envio !== undefined ? item.costo_envio : 0).toFixed(2)} MX</p>
                                <p>Subtotal Artículo: $${precioTotalProducto.toFixed(2)} MX</p>
                                <button class="btn-remover-item" data-id="${item.id}">Remover</button>
                            </div>
                        </div>
                    `;
                    itemsCarritoDiv.innerHTML += itemHTML;
                });


                document.querySelectorAll('.btn-remover-item').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const idToRemove = parseInt(e.target.dataset.id);
                        let carritoActual = getCarrito();
                        carritoActual = carritoActual.filter(item => item.id !== idToRemove);
                        saveCarrito(carritoActual);
                        renderCarrito();
                        actualizarContadorCarrito(); // Llama a la función de actualización
                    });
                });
            }
            actualizarContadorCarrito(); // Llama a la función de actualización al final de renderizado
        }

        if (btnVaciarCarrito) {
            btnVaciarCarrito.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                    localStorage.removeItem('carrito');
                    renderCarrito();
                    actualizarContadorCarrito(); // Llama a la función de actualización
                }
            });
        }

        if (btnFinalizarCompra) {
            btnFinalizarCompra.addEventListener('click', () => {
                const carrito = getCarrito();
                if (carrito.length === 0) {
                    alert('Tu carrito está vacío. Agrega productos antes de finalizar la compra.');
                    return;
                }

                let mensajeWhatsApp = "¡Hola! Me gustaría hacer el siguiente pedido de MiStore22:\n\n";
                let subtotal = 0;
                let costoEnvioNormal = 0; 

                carrito.forEach((item, index) => {
                    const cantidad = item.cantidad || 1;
                    const precioTotalProducto = item.precio * cantidad;
                    subtotal += precioTotalProducto;
                    costoEnvioNormal += (item.costo_envio !== undefined ? item.costo_envio : 0) * cantidad;

                    mensajeWhatsApp += `${index + 1}. ${item.nombre} (x${cantidad})\n`;
                    mensajeWhatsApp += `   Precio Unitario: $${item.precio.toFixed(2)} MX\n`;
                    mensajeWhatsApp += `   Subtotal: $${precioTotalProducto.toFixed(2)} MX\n`;
                    mensajeWhatsApp += `   Envío por artículo: $${(item.costo_envio !== undefined ? item.costo_envio : 0).toFixed(2)} MX\n\n`;
                });

                let costoEnvioFinalWhatsApp = costoEnvioNormal;
                if (subtotal >= LIMITE_ENVIO_GRATIS) {
                    costoEnvioFinalWhatsApp = 0; // Envío gratis para WhatsApp también
                }

                mensajeWhatsApp += `---\n`;
                mensajeWhatsApp += `Resumen del Pedido:\n`;
                mensajeWhatsApp += `Subtotal de productos: $${subtotal.toFixed(2)} MX\n`;
                mensajeWhatsApp += `Costo total de envío: $${costoEnvioFinalWhatsApp.toFixed(2)} MX\n`; 
                mensajeWhatsApp += `TOTAL A PAGAR: $${(subtotal + costoEnvioFinalWhatsApp).toFixed(2)} MX\n\n`;
                mensajeWhatsApp += `¡Espero tu confirmación!`;

                // RECUERDA CAMBIAR 'TUNUMERO' POR TU NÚMERO DE WHATSAPP REAL
                const whatsappUrl = `https://wa.me/521TUNUMERO?text=${encodeURIComponent(mensajeWhatsApp)}`;
                window.open(whatsappUrl, '_blank');
            });
        }
        renderCarrito(); 
    }
    
    actualizarContadorCarrito(); // Llamada inicial al cargar la página
});