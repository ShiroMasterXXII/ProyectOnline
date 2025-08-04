document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('js/productos.json');
        const data = await response.json();
        const productos = data.lista_productos; // <-- Leemos la lista

        const gridProductos = document.querySelector('.grid-productos');
        const tituloCategoria = document.getElementById('titulo-categoria');
        const urlParams = new URLSearchParams(window.location.search);
        const categoria = urlParams.get('cat');

        if (categoria && tituloCategoria) {
            tituloCategoria.textContent = categoria;
            document.title = `${categoria} - MiStore22`;
            const productosFiltrados = productos.filter(p => p.categoria === categoria);
            
            gridProductos.innerHTML = '';
            if (productosFiltrados.length === 0) {
                gridProductos.innerHTML = '<p>No hay productos en esta categoría.</p>';
                return;
            }

            productosFiltrados.forEach(producto => {
                const mensaje = `Hola, me interesa comprar el producto: ${producto.nombre}`;
                const whatsappUrl = `https://wa.me/8146456409?text=${encodeURIComponent(mensaje)}`;
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
        }
    } catch (error) {
        console.error("Error al cargar la categoría:", error);
    }
});