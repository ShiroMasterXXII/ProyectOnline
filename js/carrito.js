document.addEventListener('DOMContentLoaded', function() {
    const itemsCarritoDiv = document.getElementById('items-carrito');
    const carritoVacioMensaje = document.getElementById('carrito-vacio-mensaje');
    const subtotalCarritoSpan = document.getElementById('subtotal-carrito');
    const envioTotalCarritoSpan = document.getElementById('envio-total-carrito');
    const totalCarritoSpan = document.getElementById('total-carrito');
    const btnVaciarCarrito = document.getElementById('btn-vaciar-carrito');
    const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');
    const carritoContador = document.getElementById('carrito-contador');

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

    // Función para renderizar los productos en la página del carrito
    function renderCarrito() {
        const carrito = getCarrito();
        itemsCarritoDiv.innerHTML = ''; // Limpiar contenido previo

        if (carrito.length === 0) {
            carritoVacioMensaje.style.display = 'block';
            document.querySelector('.resumen-carrito').style.display = 'none';
        } else {
            carritoVacioMensaje.style.display = 'none';
            document.querySelector('.resumen-carrito').style.display = 'block';

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

            // Opcional: Vaciar el carrito después de enviar el pedido
            // if (confirm('¿Deseas vaciar tu carrito después de enviar el pedido?')) {
            //     localStorage.removeItem('carrito');
            //     renderCarrito();
            //     actualizarContadorCarrito();
            // }
        });
    }

    // Inicializar el carrito al cargar la página
    renderCarrito();
});

// Nota: La función actualizarContadorCarrito también es global para que pueda ser llamada desde producto-detalle.js
// La definimos aquí de forma independiente para asegurar que siempre esté disponible para la página de carrito.html
// y para index.html si se carga este script después de main.js
// Si ya la tienes en producto-detalle.js y ese script se carga ANTES en index.html, no hay problema.
// Pero si carrito.js se carga primero, la versión de carrito.js se usará.
// Para máxima compatibilidad, ambas versiones son válidas.