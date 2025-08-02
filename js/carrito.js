// Constante para la clave del carrito en localStorage
const CARRITO_KEY = 'carritoMiStore';
// Tu número de WhatsApp. ¡ACTUALÍZALO CON TU NÚMERO REAL!
const NUMERO_WHATSAPP = '521TUNUMERO'; // Ejemplo: '5215512345678' (Código de país + LADA + número)

// Umbral para envío gratis
const UMBRAL_ENVIO_GRATIS = 1000; // Por ejemplo, envío gratis a partir de $1000

// ===========================================
// Funciones de Gestión del Carrito
// ===========================================

/**
 * Obtiene el carrito del localStorage. Si no existe, devuelve un array vacío.
 * @returns {Array} El array de productos en el carrito.
 */
function getCarrito() {
    const carritoJSON = localStorage.getItem(CARRITO_KEY);
    return carritoJSON ? JSON.parse(carritoJSON) : [];
}

/**
 * Guarda el carrito en el localStorage.
 * @param {Array} carrito - El array de productos a guardar.
 */
function saveCarrito(carrito) {
    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
}

/**
 * Añade un producto al carrito.
 * @param {Object} producto - El objeto producto a añadir.
 */
function agregarAlCarrito(producto) {
    const carrito = getCarrito();
    // Verifica si el producto ya está en el carrito (para evitar duplicados exactos si solo quieres 1 por tipo)
    // En este caso, permitimos añadir el mismo producto varias veces.
    carrito.push(producto);
    saveCarrito(carrito);
    actualizarContadorCarrito();
    // Opcional: mostrar un mensaje de confirmación
    alert(`${producto.nombre} ha sido añadido al carrito.`);
}

/**
 * Remueve un producto del carrito por su ID.
 * Si hay múltiples instancias, remueve la primera que encuentre.
 * @param {string} idProducto - El ID del producto a remover.
 */
function removerDelCarrito(idProducto) {
    let carrito = getCarrito();
    const index = carrito.findIndex(p => p.id == idProducto); // Usar == para comparar número con string si es el caso
    if (index !== -1) {
        carrito.splice(index, 1); // Elimina solo una instancia
        saveCarrito(carrito);
        actualizarContadorCarrito();
        renderizarCarrito(); // Vuelve a dibujar el carrito en la página si estamos en carrito.html
    }
}

/**
 * Vacía completamente el carrito.
 */
function vaciarCarrito() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        saveCarrito([]);
        actualizarContadorCarrito();
        renderizarCarrito(); // Vuelve a dibujar el carrito
        alert('El carrito ha sido vaciado.');
    }
}

/**
 * Calcula el total de la compra sin considerar el costo de envío.
 * @returns {number} El subtotal de los productos en el carrito.
 */
function calcularSubtotal() {
    const carrito = getCarrito();
    return carrito.reduce((sum, item) => sum + item.precio, 0);
}

/**
 * Calcula el total de la compra incluyendo el costo de envío.
 * Aplica envío gratis si el subtotal supera el umbral.
 * @returns {number} El total final de la compra.
 */
function calcularTotalConEnvio() {
    const subtotal = calcularSubtotal();
    const costoEnvio = (subtotal >= UMBRAL_ENVIO_GRATIS) ? 0 : 100; // Costo de envío fijo si no es gratis
    return subtotal + costoEnvio;
}

/**
 * Genera el mensaje de WhatsApp para el pedido.
 * @returns {string} El mensaje formateado para WhatsApp.
 */
function generarMensajeWhatsApp() {
    const carrito = getCarrito();
    if (carrito.length === 0) {
        return "Hola, estoy interesado en hacer un pedido, pero mi carrito está vacío.";
    }

    let mensaje = "¡Hola! Me gustaría hacer un pedido de los siguientes productos:\n\n";
    let subtotal = 0;

    carrito.forEach((producto, index) => {
        mensaje += `${index + 1}. ${producto.nombre} - $${producto.precio.toFixed(2)}\n`;
        subtotal += producto.precio;
    });

    const costoEnvio = (subtotal >= UMBRAL_ENVIO_GRATIS) ? 0 : 100;
    const totalFinal = subtotal + costoEnvio;

    mensaje += `\nSubtotal: $${subtotal.toFixed(2)}\n`;
    mensaje += `Costo de envío: $${costoEnvio.toFixed(2)} ${costoEnvio === 0 ? "(¡Gratis!)" : ""}\n`;
    mensaje += `Total a pagar: $${totalFinal.toFixed(2)}\n\n`;
    mensaje += "¡Espero su confirmación! Gracias.";

    // Codifica el mensaje para que sea una URL válida
    return encodeURIComponent(mensaje);
}

/**
 * Abre el chat de WhatsApp con el mensaje del pedido.
 */
function finalizarCompra() {
    const mensaje = generarMensajeWhatsApp();
    const urlWhatsApp = `https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`;
    window.open(urlWhatsApp, '_blank');
    // Opcional: Vaciar el carrito después de enviar el pedido
    // vaciarCarrito(); 
}

// ===========================================
// Funciones de Actualización de UI
// ===========================================

/**
 * Actualiza el contador de productos en el carrito en el header/navegación.
 */
function actualizarContadorCarrito() {
    const carrito = getCarrito();
    const totalItems = carrito.length;

    // Actualiza el contador en el menú principal (si aún existe en el HTML)
    const contadorMenu = document.getElementById('contador-carrito');
    if (contadorMenu) {
        contadorMenu.textContent = totalItems;
    }

    // Actualiza el contador en el nuevo ícono móvil (el que está en el encabezado visible)
    const contadorMobile = document.getElementById('contador-carrito-mobile');
    if (contadorMobile) {
        contadorMobile.textContent = totalItems;
    }
}

/**
 * Renderiza la lista de productos en la página del carrito.
 */
function renderizarCarrito() {
    const itemsCarritoDiv = document.getElementById('items-carrito');
    const carritoVacioMensaje = document.getElementById('carrito-vacio-mensaje');
    const resumenCarritoDiv = document.querySelector('.resumen-carrito');

    const carrito = getCarrito();

    if (!itemsCarritoDiv || !carritoVacioMensaje || !resumenCarritoDiv) {
        // No estamos en la página del carrito, no hacemos nada.
        return;
    }

    // Vaciar el contenido actual
    itemsCarritoDiv.innerHTML = '';

    if (carrito.length === 0) {
        carritoVacioMensaje.style.display = 'block';
        resumenCarritoDiv.style.display = 'none'; // Ocultar el resumen si el carrito está vacío
    } else {
        carritoVacioMensaje.style.display = 'none';
        resumenCarritoDiv.style.display = 'block';

        carrito.forEach(producto => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('carrito-item');
            itemDiv.innerHTML = `
                <img src="${producto.imagenes[0].url}" alt="${producto.nombre}">
                <div class="item-info">
                    <h4>${producto.nombre}</h4>
                    <p>Precio: $${producto.precio.toFixed(2)}</p>
                </div>
                <button class="btn-remover-item" data-id="${producto.id}">Remover</button>
            `;
            itemsCarritoDiv.appendChild(itemDiv);
        });

        // Añadir listeners a los botones de remover después de renderizar
        document.querySelectorAll('.btn-remover-item').forEach(button => {
            button.addEventListener('click', (event) => {
                const idProducto = event.target.dataset.id;
                removerDelCarrito(idProducto);
            });
        });
    }

    // Actualizar el resumen de la compra
    actualizarResumenCarrito();
}

/**
 * Actualiza los totales y el mensaje de envío en el resumen del carrito.
 */
function actualizarResumenCarrito() {
    const subtotal = calcularSubtotal();
    const costoEnvio = (subtotal >= UMBRAL_ENVIO_GRATIS) ? 0 : 100;
    const totalFinal = subtotal + costoEnvio;

    const subtotalSpan = document.getElementById('subtotal-carrito');
    const costoEnvioSpan = document.getElementById('costo-envio-carrito');
    const totalFinalSpan = document.getElementById('total-final-carrito');
    const mensajeEnvioGratis = document.getElementById('mensaje-envio-gratis');

    if (subtotalSpan) subtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
    if (costoEnvioSpan) costoEnvioSpan.textContent = `$${costoEnvio.toFixed(2)}`;
    if (totalFinalSpan) totalFinalSpan.textContent = `$${totalFinal.toFixed(2)}`;

    // Mensaje de envío gratis
    if (mensajeEnvioGratis) {
        if (costoEnvio === 0 && subtotal > 0) {
            mensajeEnvioGratis.textContent = `¡Felicidades! Tu envío es GRATIS.`;
            mensajeEnvioGratis.classList.remove('envio-gratis-falta');
            mensajeEnvioGratis.classList.add('envio-gratis-exito');
            mensajeEnvioGratis.style.display = 'block';
        } else if (subtotal > 0 && subtotal < UMBRAL_ENVIO_GRATIS) {
            const faltaParaEnvioGratis = UMBRAL_ENVIO_GRATIS - subtotal;
            mensajeEnvioGratis.textContent = `Agrega $${faltaParaEnvioGratis.toFixed(2)} más para obtener envío gratis.`;
            mensajeEnvioGratis.classList.remove('envio-gratis-exito');
            mensajeEnvioGratis.classList.add('envio-gratis-falta');
            mensajeEnvioGratis.style.display = 'block';
        } else {
            mensajeEnvioGratis.style.display = 'none'; // Ocultar si el carrito está vacío
        }
    }
}


// ===========================================
// Event Listeners Globales
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    // Actualizar el contador del carrito al cargar cualquier página
    actualizarContadorCarrito();

    // Si estamos en la página del carrito, renderizarlo
    if (document.getElementById('items-carrito')) {
        renderizarCarrito();
    }

    // Listener para el botón "Vaciar Carrito" (solo si existe en la página)
    const btnVaciar = document.getElementById('btn-vaciar-carrito');
    if (btnVaciar) {
        btnVaciar.addEventListener('click', vaciarCarrito);
    }

    // Listener para el botón "Finalizar Compra" (solo si existe en la página)
    const btnFinalizar = document.getElementById('btn-finalizar-compra');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', finalizarCompra);
    }
});