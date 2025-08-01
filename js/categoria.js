// js/categoria.js

document.addEventListener('DOMContentLoaded', function() {
    const gridProductos = document.querySelector('.grid-productos');
    const tituloCategoria = document.getElementById('titulo-categoria');
    const urlParams = new URLSearchParams(window.location.search);
    const categoria = urlParams.get('cat');

    if (categoria && tituloCategoria) {
        tituloCategoria.textContent = categoria;
        document.title = `${categoria} - MiStore22`;
        const productosFiltrados = productos.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
        renderizarProductos(productosFiltrados);
    } else if (tituloCategoria) {
        tituloCategoria.textContent = "Categoría no encontrada";
    }

    function renderizarProductos(listaDeProductos) {
        if (!gridProductos) return;
        gridProductos.innerHTML = '';

        if (listaDeProductos.length === 0) {
            gridProductos.innerHTML = '<p>No hay productos en esta categoría.</p>';
            return;
        }

        listaDeProductos.forEach(producto => {
            const mensaje = `Hola, me interesa comprar el producto: ${producto.nombre}`;
            // ¡¡IMPORTANTE!! Reemplaza 521TUNUMERO con tu número real
            const whatsappUrl = `https://wa.me/521TUNUMERO?text=${encodeURIComponent(mensaje)}`;

            const productoHTML = `
                <div class="producto-card" data-id="${producto.id}">
                    <img src="${producto.img}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <p class="precio">$${producto.precio.toFixed(2)}</p>
                    <a href="producto.html?id=${producto.id}" class="btn-ver-detalles">Ver Detalles</a>
                    <a href="${whatsappUrl}" target="_blank" class="btn-pedir-whatsapp">Pedir por WhatsApp</a>
                </div>
            `;
            gridProductos.innerHTML += productoHTML;
        });
    }
});