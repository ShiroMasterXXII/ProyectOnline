document.addEventListener('DOMContentLoaded', function() {
    async function cargarYRenderizarProductos() {
        try {
            const response = await fetch('js/productos.json');
            const data = await response.json();
            const productos = data.lista_productos; // <-- Leemos la lista
            
            const gridProductos = document.querySelector('.grid-productos');
            if (!gridProductos) return;
            gridProductos.innerHTML = '';

            productos.forEach(producto => {
                const mensaje = `Hola, me interesa comprar el producto: ${producto.nombre}`;
                const whatsappUrl = `https://wa.me/521TUNUMERO?text=${encodeURIComponent(mensaje)}`;

                const productoHTML = `
                    <div class="producto-card">
                        <img src="${producto.imagenes[0]?.url || ''}" alt="${producto.nombre}">
                        <h3>${producto.nombre}</h3>
                        <p class="precio">$${producto.precio.toFixed(2)}</p>
                        <a href="producto.html?id=${producto.id}" class="btn-ver-detalles">Ver Detalles</a>
                        <a href="${whatsappUrl}" target="_blank" class="btn-pedir-whatsapp">Pedir por WhatsApp</a>
                    </div>
                `;
                gridProductos.innerHTML += productoHTML;
            });
        } catch (error) {
            console.error("Error al cargar productos destacados:", error);
        }
    }
    cargarYRenderizarProductos();
    // La lógica de los menús se carga desde main.js
});