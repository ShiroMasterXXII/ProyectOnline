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

    // --- CONSTANTES PARA EL ENVÍO GRATIS ---
    const LIMITE_ENVIO_GRATIS = 300;
    const mensajeEnvioGratisProducto = document.getElementById('mensaje-envio-gratis-producto');
    // --- FIN CONSTANTES ---

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

    // Función para renderizar el producto en la página
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
            // Llama a la función global para actualizar el contador del carrito en el header
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
                const subtotalConEsteProducto = subtotalActualCarrito + (precioProductoActual * (cantidadInput.value || 1));

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

        // Llama a la función para actualizar el mensaje cuando cambia la cantidad
        cantidadInput.addEventListener('change', actualizarMensajeEnvioGratis);
        actualizarMensajeEnvioGratis(); // Llama al cargar el producto
    }

    // --- Lógica para cargar el producto al iniciar la página ---
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id')); // Obtiene el ID de la URL

    if (productId) { // Si hay un ID válido en la URL
        fetch('js/productos.json') // Carga tu archivo JSON de productos
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar productos.json');
                }
                return response.json();
            })
            .then(productos => {
                const producto = productos.find(p => p.id === productId); // Busca el producto por ID
                if (producto) {
                    renderProducto(producto); // Si lo encuentra, lo muestra
                } else {
                    console.error('Producto no encontrado con ID:', productId);
                    // Redirigir si el ID es válido pero no hay producto con ese ID
                    alert('Producto no encontrado. Volviendo al inicio.');
                    window.location.href = 'index.html'; 
                }
            })
            .catch(error => {
                console.error('Error al cargar productos o procesar JSON:', error);
                alert('Hubo un error al cargar los detalles del producto. Volviendo al inicio.');
                window.location.href = 'index.html'; 
            });
    } else {
        console.error('ID de producto no especificado en la URL.');
        // Si no hay ID en la URL o no es un número, redirige inmediatamente.
        alert('ID de producto no especificado. Volviendo al inicio.');
        window.location.href = 'index.html'; 
    }
});