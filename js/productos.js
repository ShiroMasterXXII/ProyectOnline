document.addEventListener('DOMContentLoaded', function() {
    const imagenPrincipal = document.getElementById('imagen-principal');
    const miniaturasContainer = document.getElementById('miniaturas-container');
    const productoNombre = document.getElementById('producto-nombre');
    const productoPrecio = document.getElementById('producto-precio');
    const productoCostoEnvio = document.getElementById('producto-costo-envio');
    const productoDescripcion = document.getElementById('producto-descripcion');
    const cantidadInput = document.getElementById('cantidad');
    const btnAgregarCarrito = document.getElementById('btn-agregar-carrito');
    const btnRegresar = document.getElementById('btn-regresar');

    // --- NUEVAS CONSTANTES PARA EL ENVÍO GRATIS ---
    const LIMITE_ENVIO_GRATIS = 300;
    const mensajeEnvioGratisProducto = document.getElementById('mensaje-envio-gratis-producto');
    // --- FIN NUEVAS CONSTANTES ---

    // Función para obtener el carrito del localStorage
    function getCarrito() {
        return JSON.parse(localStorage.getItem('carrito')) || [];
    }

    // Función para guardar el carrito en el localStorage
    function saveCarrito(carrito) {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    // Botón de regresar
    if (btnRegresar) {
        btnRegresar.addEventListener('click', e => {
            e.preventDefault(); 
            history.back(); 
        });
    }

    // Función para renderizar el producto
    function renderProducto(producto) {
        // Actualizar detalles del producto
        imagenPrincipal.src = producto.imagenes[0]?.url || 'img/placeholder.jpg';
        imagenPrincipal.alt = producto.nombre;
        productoNombre.textContent = producto.nombre;
        productoPrecio.textContent = `$${producto.precio.toFixed(2)} MX`;
        productoCostoEnvio.textContent = `$${(producto.costo_envio !== undefined ? producto.costo_envio : 0).toFixed(2)} MX`;
        productoDescripcion.textContent = producto.descripcion;

        // Limpiar miniaturas anteriores
        miniaturasContainer.innerHTML = '';
        // Crear miniaturas
        producto.imagenes.forEach(img => {
            const miniatura = document.createElement('img');
            miniatura.src = img.url;
            miniatura.alt = producto.nombre;
            miniatura.classList.add('miniatura');
            miniatura.addEventListener('click', () => {
                imagenPrincipal.src = img.url;
            });
            miniaturasContainer.appendChild(miniatura);
        });

        // Evento para agregar al carrito
        btnAgregarCarrito.onclick = () => {
            const cantidad = parseInt(cantidadInput.value);
            if (isNaN(cantidad) || cantidad < 1) {
                alert('Por favor, ingresa una cantidad válida.');
                return;
            }

            const carrito = getCarrito();
            const itemExistente = carrito.find(item => item.id === producto.id);

            if (itemExistente) {
                itemExistente.cantidad += cantidad;
            } else {
                carrito.push({ ...producto, cantidad: cantidad });
            }

            saveCarrito(carrito);
            // Llama a la función global para actualizar los contadores
            if (window.actualizarContadorCarrito) {
                window.actualizarContadorCarrito();
            }
            alert(`"${producto.nombre}" x${cantidad} ha sido agregado al carrito.`);
            window.location.href = 'carrito.html'; // Redirige al carrito después de agregar
        };

        // --- LÓGICA DE MENSAJE DE ENVÍO GRATIS EN PÁGINA DE PRODUCTO ---
        function actualizarMensajeEnvioGratis() {
            const carritoActual = getCarrito();
            let subtotalActualCarrito = carritoActual.reduce((sum, item) => 
                sum + (item.precio * (item.cantidad || 1)), 0
            );

            const precioProductoActual = producto.precio;
            
            let mensaje = '';
            let claseMensaje = '';

            if (subtotalActualCarrito >= LIMITE_ENVIO_GRATIS) {
                mensaje = '¡Tienes Envío GRATIS en tu pedido actual! 🎉';
                claseMensaje = 'envio-gratis-exito';
            } else {
                // Calcular subtotal si este producto se añade
                const subtotalConEsteProducto = subtotalActualCarrito + precioProductoActual;

                if (subtotalConEsteProducto >= LIMITE_ENVIO_GRATIS) {
                    mensaje = '¡Con este producto, tu envío es GRATIS! 🎉';
                    claseMensaje = 'envio-gratis-exito';
                } else {
                    const faltaParaEnvioGratis = LIMITE_ENVIO_GRATIS - subtotalConEsteProducto;
                    mensaje = `¡Agrega $${faltaParaEnvioGratis.toFixed(2)} MX más para Envío GRATIS!`;
                    claseMensaje = 'envio-gratis-falta';
                }
            }

            if (mensajeEnvioGratisProducto) {
                mensajeEnvioGratisProducto.textContent = mensaje;
                mensajeEnvioGratisProducto.className = 'mensaje-envio-gratis ' + claseMensaje;
            }
        }

        actualizarMensajeEnvioGratis(); // Llamar al cargar el producto
    }

    // Obtener el ID del producto de la URL
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));

    if (productId) {
        fetch('js/productos.json')
            .then(response => response.json())
            .then(productos => {
                const producto = productos.find(p => p.id === productId);
                if (producto) {
                    renderProducto(producto);
                } else {
                    console.error('Producto no encontrado.');
                    // Podrías redirigir a una página 404 o al inicio
                    window.location.href = 'index.html'; 
                }
            })
            .catch(error => console.error('Error al cargar productos:', error));
    } else {
        console.error('ID de producto no especificado.');
        // Redirigir si no hay ID
        window.location.href = 'index.html';
    }
});