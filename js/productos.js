document.addEventListener('DOMContentLoaded', function() {
    async function cargarYRenderizarProductos() {
        try {
            const response = await fetch('js/productos.json'); // Asegúrate que esta ruta sea correcta
            const data = await response.json();
            
            const todosLosProductos = data.lista_productos;
            
            // 1. Filtramos todos los productos que tienen 'es_destacado' marcado como true
            const productosFiltradosDestacados = todosLosProductos.filter(producto => producto.es_destacado === true);
            
            // 2. Luego, tomamos solo los primeros 4 de esa lista filtrada para mostrarlos
            const productosDestacadosParaMostrar = productosFiltradosDestacados.slice(0, 4);
            
            const gridProductos = document.querySelector('.grid-productos');
            // Si el contenedor no existe (ej. en la página de detalle), el script no hace nada.
            // Esto es importante para que este script solo actúe en index.html
            if (!gridProductos) return; 
            
            gridProductos.innerHTML = ''; // Limpiamos el contenedor antes de añadir los productos

            // Iteramos SOLAMENTE sobre la lista de productos destacados que hemos preparado
            if (productosDestacadosParaMostrar.length > 0) {
                productosDestacadosParaMostrar.forEach(producto => {
                    const costoEnvio = producto.costo_envio !== undefined ? producto.costo_envio : 0;
                    
                    // Generamos el mensaje de WhatsApp con los detalles del producto y envío
                    // RECUERDA CAMBIAR 'TUNUMERO' POR TU NÚMERO DE WHATSAPP REAL
                    const mensaje = `Hola, me interesa comprar el producto: ${producto.nombre}.\nPrecio: $${producto.precio.toFixed(2)} MX.\nCosto de Envío: $${costoEnvio.toFixed(2)} MX.`;
                    const whatsappUrl = `https://wa.me/521TUNUMERO?text=${encodeURIComponent(mensaje)}`;

                    const productoHTML = `
                        <div class="producto-card">
                            <img src="${producto.imagenes[0]?.url || 'img/placeholder.jpg'}" alt="${producto.nombre}">
                            <h3>${producto.nombre}</h3>
                            <p class="precio">$${producto.precio.toFixed(2)} MX</p>
                            ${costoEnvio > 0 ? `<p class="envio-card">Envío: $${costoEnvio.toFixed(2)} MX</p>` : '<p class="envio-card">Envío: Gratis</p>'}
                            <a href="producto.html?id=${producto.id}" class="btn-ver-detalles">Ver Detalles</a>
                            <a href="${whatsappUrl}" target="_blank" class="btn-pedir-whatsapp">Pedir por WhatsApp</a>
                        </div>
                    `;
                    gridProductos.innerHTML += productoHTML; // Agregamos la tarjeta al HTML
                });
            } else {
                gridProductos.innerHTML = '<p>No hay productos destacados para mostrar en este momento.</p>';
            }
        } catch (error) {
            // Manejo de errores en caso de que la carga de productos falle
            console.error("Error al cargar productos destacados:", error);
            const gridProductos = document.querySelector('.grid-productos');
            if (gridProductos) {
                gridProductos.innerHTML = '<p>Error al cargar los productos. Por favor, intente de nuevo más tarde.</p>';
            }
        }
    }
    cargarYRenderizarProductos(); // Ejecutamos la función al cargar el DOM
});