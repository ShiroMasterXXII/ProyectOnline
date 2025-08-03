document.addEventListener('DOMContentLoaded', function() {
    async function cargarYRenderizarProductos() {
        try {
            const response = await fetch('js/productos.json');
            const data = await response.json();
            
            const todosLosProductos = data.lista_productos;
            
            const productosFiltradosDestacados = todosLosProductos.filter(producto => producto.es_destacado === true);
            
            const productosDestacadosParaMostrar = productosFiltradosDestacados.slice(0, 4);
            
            const gridProductos = document.querySelector('.grid-productos');
            if (!gridProductos) return; 
            
            gridProductos.innerHTML = '';

            if (productosDestacadosParaMostrar.length > 0) {
                productosDestacadosParaMostrar.forEach(producto => {
                    
                    // Maneja costos de envío vacíos o no numéricos, convirtiéndolos en 0
                    const costoEnvio = Number(producto.costo_envio) || 0;
                    
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
                    gridProductos.innerHTML += productoHTML;
                });
            } else {
                gridProductos.innerHTML = '<p>No hay productos destacados para mostrar en este momento.</p>';
            }
        } catch (error) {
            console.error("Error al cargar productos destacados:", error);
            const gridProductos = document.querySelector('.grid-productos');
            if (gridProductos) {
                gridProductos.innerHTML = '<p>Error al cargar los productos. Por favor, intente de nuevo más tarde.</p>';
            }
        }
    }

    cargarYRenderizarProductos();
});