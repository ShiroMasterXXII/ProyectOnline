document.addEventListener('DOMContentLoaded', function() {
    const itemsCarritoDiv = document.getElementById('items-carrito');
    const carritoVacioMensaje = document.getElementById('carrito-vacio-mensaje');
    const subtotalCarritoSpan = document.getElementById('subtotal-carrito');
    const envioTotalCarritoSpan = document.getElementById('envio-total-carrito');
    const totalCarritoSpan = document.getElementById('total-carrito');
    const btnVaciarCarrito = document.getElementById('btn-vaciar-carrito');
    const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');
    const carritoContador = document.getElementById('carrito-contador');

    // Lógica para el botón "Regresar" en el carrito
    const btnRegresarCarrito = document.getElementById('btn-regresar-carrito');
    if (btnRegresarCarrito) {
        btnRegresarCarrito.addEventListener('click', e => {
            e.preventDefault(); // Evita que el enlace recargue la página
            history.back(); // Regresa a la página anterior en el historial del navegador
        });
    }

    // Función para obtener el carrito del localStorage
    function getCarrito() {
        return JSON.parse(localStorage.getItem('carrito')) || [];
    }

    // Función para guardar el carrito en el localStorage
    function saveCarrito(carrito) {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    // Función para actualizar el contador del carrito en el header
    function actualizarContadorCarrito() {
        const carrito = getCarrito();
        const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
        if (carritoContador) { 
            carritoContador.textContent = totalItems;
        }
    }

    // Lógica de renderizado del carrito (solo si estamos en carrito.html)
    if (itemsCarritoDiv) { 
        function renderCarrito() {
            const carrito = getCarrito();
            itemsCarritoDiv.innerHTML = ''; // Limpiar contenido previo

            if (carrito.length === 0) {
                carritoVacioMensaje.style.display = 'block';
                // Asumo que .resumen-carrito ya está oculto por defecto si está vacío en tu CSS o por la lógica inicial.
                // Si necesitas ocultarlo aquí, asegúrate de que el selector sea correcto.
                const resumenCarritoDiv = document.querySelector('.resumen-carrito');
                if (resumenCarritoDiv) {
                    resumenCarritoDiv.style.display = 'none';
                }
            } else {
                carritoVacioMensaje.style.display = 'none';
                const resumenCarritoDiv = document.querySelector('.resumen-carrito');
                if (resumenCarritoDiv) {
                    resumenCarritoDiv.style.display = 'block';
                }

                let subtotal = 0;
                let costoEnvioTotal = 0;

                carrito.forEach(item => {
                    const cantidad = item.cantidad || 1;
                    const precioTotalProducto = item.precio * cantidad;
                    const costoEnvioProducto = (item.costo_envio !== undefined ? item.costo_envio : 0) * cantidad;

                    subtotal += precioTotalProducto;
                    costoEnvioTotal += costoEnvioProducto;

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

                const total = subtotal + costoEnvioTotal;
                subtotalCarritoSpan.textContent = `$${subtotal.toFixed(2)} MX`;
                envioTotalCarritoSpan.textContent = `$${costoEnvioTotal.toFixed(2)} MX`;
                totalCarritoSpan.textContent = `$${total.toFixed(2)} MX`;

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
                let costoEnvioTotal = 0;

                carrito.forEach((item, index) => {
                    const cantidad = item.cantidad || 1;
                    const precioTotalProducto = item.precio * cantidad;
                    const costoEnvioProducto = (item.costo_envio !== undefined ? item.costo_envio : 0) * cantidad;
                    
                    subtotal += precioTotalProducto;
                    costoEnvioTotal += costoEnvioProducto;

                    mensajeWhatsApp += `${index + 1}. ${item.nombre} (x${cantidad})\n`;
                    mensajeWhatsApp += `   Precio Unitario: $${item.precio.toFixed(2)} MX\n`;
H
                    mensajeWhatsApp += `   Subtotal: $${precioTotalProducto.toFixed(2)} MX\n`;
                    mensajeWhatsApp += `   Envío por artículo: $${(item.costo_envio !== undefined ? item.costo_envio : 0).toFixed(2)} MX\n\n`;
                });

                mensajeWhatsApp += `---\n`;
                mensajeWhatsApp += `Resumen del Pedido:\n`;
                mensajeWhatsApp += `Subtotal de productos: $${subtotal.toFixed(2)} MX\n`;
                mensajeWhatsApp += `Costo total de envío: $${costoEnvioTotal.toFixed(2)} MX\n`;
                mensajeWhatsApp += `TOTAL A PAGAR: $${(subtotal + costoEnvioTotal).toFixed(2)} MX\n\n`;
                mensajeWhatsApp += `¡Espero tu confirmación!`;

                // RECUERDA CAMBIAR 'TUNUMERO' POR TU NÚMERO DE WHATSAPP REAL
                const whatsappUrl = `https://wa.me/521TUNUMERO?text=${encodeURIComponent(mensajeWhatsApp)}`;
                window.open(whatsappUrl, '_blank');
            });
        }
        renderCarrito(); 
    }
    
    actualizarContadorCarrito();
});