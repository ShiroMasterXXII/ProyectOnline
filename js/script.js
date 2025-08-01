// js/script.js

document.addEventListener('DOMContentLoaded', function() {
    const gridProductos = document.querySelector('.grid-productos');

    function renderizarProductosDestacados() {
        if (!gridProductos) return;
        gridProductos.innerHTML = '';

        productos.forEach(producto => {
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
    renderizarProductosDestacados();
});