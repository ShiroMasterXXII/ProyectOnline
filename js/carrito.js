document.addEventListener('DOMContentLoaded', function() {
    const itemsCarritoDiv = document.getElementById('items-carrito');
    const carritoVacioMensaje = document.getElementById('carrito-vacio-mensaje');
    const subtotalCarritoSpan = document.getElementById('subtotal-carrito');
    const envioTotalCarritoSpan = document.getElementById('envio-total-carrito');
    const totalCarritoSpan = document.getElementById('total-carrito');
    const btnVaciarCarrito = document.getElementById('btn-vaciar-carrito');
    const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');
    const carritoContadorDesktop = document.getElementById('carrito-contador');
    const carritoContadorMobile = document.getElementById('carrito-contador-mobile');

    const btnRegresarCarrito = document.getElementById('btn-regresar-carrito');
    if (btnRegresarCarrito) {
        btnRegresarCarrito.addEventListener('click', e => {
            e.preventDefault(); 
            history.back(); 
        });
    }

    const LIMITE_ENVIO_GRATIS = 300;
    const mensajeEnvioGratis = document.getElementById('mensaje-envio-gratis');

    function getCarrito() {
        return JSON.parse(localStorage.getItem('carrito')) || [];
    }

    function saveCarrito(carrito) {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function actualizarContadorCarrito() {
        const carrito = getCarrito();
        const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
        if (carritoContadorDesktop) { 
            carritoContadorDesktop.textContent = totalItems;
        }
        if (carritoContadorMobile) {
            carritoContadorMobile.textContent = totalItems;
        }
    }

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
                if (mensajeEnvioGratis) {
                    mensajeEnvioGratis.textContent = '';
                    mensajeEnvioGratis.classList.remove('envio-gratis-exito', 'envio-gratis-falta');
                }
            } else {
                carritoVacioMensaje.style.display = 'none';
                const resumenCarritoDiv = document.querySelector('.resumen-carrito');
                if (resumenCarritoDiv) {
                    resumenCarritoDiv.style.display = 'block';
                }

                let subtotal = 0;
                let costoEnvioNormal = 0;
                // --- AÑADIDO ---: Nuevo subtotal solo para productos físicos
                let subtotalParaEnvio = 0;

                carrito.forEach(item => {
                    const cantidad = item.cantidad || 1;
                    const precioTotalProducto = item.precio * cantidad;
                    subtotal += precioTotalProducto;
                    costoEnvioNormal += (item.costo_envio !== undefined ? item.costo_envio : 0) * cantidad;

                    // --- AÑADIDO ---: Sumamos a nuestro nuevo subtotal SOLO si el producto es físico
                    if (item.esFisico) {
                        subtotalParaEnvio += precioTotalProducto;
                    }
                });

                let costoEnvioFinal = costoEnvioNormal;
                let mensajeEnvio = '';
                let claseMensaje = '';

                // --- MODIFICADO ---: La lógica de envío gratis ahora usa el 'subtotalParaEnvio'
                // También nos aseguramos de que haya productos físicos en el carrito para ofrecerlo
                if (subtotalParaEnvio > 0 && subtotalParaEnvio >= LIMITE_ENVIO_GRATIS) {
                    costoEnvioFinal = 0;
                    mensajeEnvio = '¡Felicidades! Tienes Envío GRATIS en tus productos. 🎉';
                    claseMensaje = 'envio-gratis-exito';
                } else if (subtotalParaEnvio > 0) {
                    const faltaParaEnvioGratis = LIMITE_ENVIO_GRATIS - subtotalParaEnvio;
                    mensajeEnvio = `¡Te faltan $${faltaParaEnvioGratis.toFixed(2)} MX en productos físicos para Envío GRATIS!`;
                    claseMensaje = 'envio-gratis-falta';
                } else {
                    // Si solo hay productos digitales, no mostramos nada.
                    mensajeEnvio = '';
                }
                
                const total = subtotal + costoEnvioFinal;

                subtotalCarritoSpan.textContent = `$${subtotal.toFixed(2)} MX`;
                envioTotalCarritoSpan.textContent = `$${costoEnvioFinal.toFixed(2)} MX`;
                totalCarritoSpan.textContent = `$${total.toFixed(2)} MX`;

                if (mensajeEnvioGratis) {
                    mensajeEnvioGratis.textContent = mensajeEnvio;
                    if(mensajeEnvio) {
                        mensajeEnvioGratis.className = 'mensaje-envio-gratis ' + claseMensaje;
                    } else {
                        mensajeEnvioGratis.className = '';
                    }
                }

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
                        actualizarContadorCarrito();
                    });
                });
            }
            actualizarContadorCarrito();
        }

        if (btnVaciarCarrito) {
            btnVaciarCarrito.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                    localStorage.removeItem('carrito');
                    renderCarrito();
                    actualizarContadorCarrito();
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
                // --- AÑADIDO ---: Nuevo subtotal para el mensaje de WhatsApp
                let subtotalParaEnvioWhatsApp = 0;

                carrito.forEach((item, index) => {
                    const cantidad = item.cantidad || 1;
                    const precioTotalProducto = item.precio * cantidad;
                    subtotal += precioTotalProducto;
                    costoEnvioNormal += (item.costo_envio !== undefined ? item.costo_envio : 0) * cantidad;

                    // --- AÑADIDO ---: Sumamos al subtotal de envío SOLO si es físico
                    if (item.esFisico) {
                        subtotalParaEnvioWhatsApp += precioTotalProducto;
                    }

                    mensajeWhatsApp += `${index + 1}. ${item.nombre} (x${cantidad})\n`;
                    mensajeWhatsApp += `   Precio Unitario: $${item.precio.toFixed(2)} MX\n`;
                    mensajeWhatsApp += `   Subtotal: $${precioTotalProducto.toFixed(2)} MX\n`;
                    mensajeWhatsApp += `   Envío por artículo: $${(item.costo_envio !== undefined ? item.costo_envio : 0).toFixed(2)} MX\n\n`;
                });

                let costoEnvioFinalWhatsApp = costoEnvioNormal;
                // --- MODIFICADO ---: Usamos la nueva variable para la lógica de envío
                if (subtotalParaEnvioWhatsApp > 0 && subtotalParaEnvioWhatsApp >= LIMITE_ENVIO_GRATIS) {
                    costoEnvioFinalWhatsApp = 0;
                }

                mensajeWhatsApp += `---\n`;
                mensajeWhatsApp += `Resumen del Pedido:\n`;
                mensajeWhatsApp += `Subtotal de productos: $${subtotal.toFixed(2)} MX\n`;
                mensajeWhatsApp += `Costo total de envío: $${costoEnvioFinalWhatsApp.toFixed(2)} MX\n`;
                mensajeWhatsApp += `TOTAL A PAGAR: $${(subtotal + costoEnvioFinalWhatsApp).toFixed(2)} MX\n\n`;
                mensajeWhatsApp += `¡Espero tu confirmación!`;

                const whatsappUrl = `https://wa.me/521TUNUMERO?text=${encodeURIComponent(mensajeWhatsApp)}`;
                window.open(whatsappUrl, '_blank');
            });
        }
        renderCarrito();
    }
    
    actualizarContadorCarrito();
});

// Agrega este bloque al final de tu archivo js/carrito.js

window.addEventListener('pageshow', function(event) {
    // La propiedad 'persisted' es true si la página viene de la caché (botón 'regresar')
    // Esto asegura que actualicemos el contador solo cuando sea necesario.
    if (event.persisted) {
        console.log('Página cargada desde caché, actualizando contador de carrito.');
        actualizarContadorCarrito();
    }
});