document.addEventListener('DOMContentLoaded', async function() {
    const btnRegresar = document.getElementById('btn-regresar');
    if (btnRegresar) {
        btnRegresar.addEventListener('click', e => { e.preventDefault(); history.back(); });
    }

    try {
        const response = await fetch('js/productos.json');
        const data = await response.json();
        const productos = data.lista_productos;

        const urlParams = new URLSearchParams(window.location.search);
        const productoId = parseInt(urlParams.get('id'));
        const producto = productos.find(p => p.id === productoId);

        if (producto) {
            document.title = `${producto.nombre} - MiStore22`;
            document.querySelector('.producto-titulo').textContent = producto.nombre;
            document.querySelector('.producto-precio').textContent = `$${producto.precio.toFixed(2)} MX`;
            document.querySelector('.producto-descripcion-corta').textContent = producto.descripcion;

            const costoEnvio = producto.costo_envio !== undefined ? producto.costo_envio : 0;
            document.getElementById('costo-envio-display').textContent = costoEnvio.toFixed(2);

            const imagenPrincipal = document.getElementById('imagen-principal');
            const galeriaMiniaturas = document.getElementById('galeria-miniaturas');

            if (producto.imagenes && producto.imagenes.length > 0) {
                imagenPrincipal.src = producto.imagenes[0].url;
                galeriaMiniaturas.innerHTML = '';
                producto.imagenes.forEach(img => {
                    const miniatura = document.createElement('img');
                    miniatura.src = img.url;
                    miniatura.classList.add('miniatura');
                    miniatura.onclick = () => { imagenPrincipal.src = img.url; };
                    galeriaMiniaturas.appendChild(miniatura);
                });
            } else {
                imagenPrincipal.alt = "Este producto no tiene imagen.";
            }

            const btnPedirWhatsappDirecto = document.getElementById('btn-pedir-whatsapp-directo');
            btnPedirWhatsappDirecto.addEventListener('click', (e) => {
                e.preventDefault();
                // RECUERDA CAMBIAR 'TUNUMERO' POR TU NÚMERO DE WHATSAPP REAL
                const mensaje = `Hola, me interesa comprar el producto: ${producto.nombre}.\nPrecio: $${producto.precio.toFixed(2)} MX.\nCosto de Envío: $${costoEnvio.toFixed(2)} MX.`;
                const whatsappUrl = `https://wa.me/8146456409?text=${encodeURIComponent(mensaje)}`;
                window.open(whatsappUrl, '_blank');
            });

            const btnAgregarCarrito = document.getElementById('btn-agregar-carrito');
            if (btnAgregarCarrito) {
                btnAgregarCarrito.addEventListener('click', () => {
                    agregarAlCarrito(producto);
                    alert(`${producto.nombre} ha sido agregado al carrito!`); // Puedes cambiar esto por algo más elegante
                    actualizarContadorCarrito(); // Llama a esta función para actualizar el contador
                });
            }

        } else {
            const detalleLayout = document.querySelector('.producto-detalle-layout');
            if (detalleLayout) {
                detalleLayout.innerHTML = '<h1>Producto no encontrado o error al cargar.</h1>';
            }
        }
    } catch (error) {
        console.error("Error al cargar el producto:", error);
        const detalleLayout = document.querySelector('.producto-detalle-layout');
        if (detalleLayout) {
            detalleLayout.innerHTML = '<h1>Error al cargar la información del producto.</h1>';
        }
    }
    // Llama a actualizarContadorCarrito al cargar la página de producto para reflejar el estado actual
    actualizarContadorCarrito();
});

// --- FUNCIONES GLOBALES PARA EL CARRITO ---
function getCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
}

function saveCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function agregarAlCarrito(producto) {
    let carrito = getCarrito();
    const productoExistente = carrito.find(item => item.id === producto.id);

    if (productoExistente) {
        productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;
    } else {
        producto.cantidad = 1;
        carrito.push(producto);
    }
    saveCarrito(carrito);
    console.log("Carrito actualizado:", carrito);
}

// Función para actualizar el contador del carrito en el header (también presente en carrito.js)
function actualizarContadorCarrito() {
    const carritoContadorDesktop = document.getElementById('carrito-contador');
    const carritoContadorMobile = document.getElementById('carrito-contador-mobile'); // Nuevo contador para móvil
    const carrito = getCarrito();
    const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
    if (carritoContadorDesktop) {
        carritoContadorDesktop.textContent = totalItems;
    }
    if (carritoContadorMobile) { // Actualiza también el contador móvil
        carritoContadorMobile.textContent = totalItems;
    }
}