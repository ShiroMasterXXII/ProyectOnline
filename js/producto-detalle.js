document.addEventListener('DOMContentLoaded', async function() {
    // Lógica del botón de regresar (se queda igual)
    const btnRegresar = document.getElementById('btn-regresar');
    if (btnRegresar) {
        btnRegresar.addEventListener('click', e => { e.preventDefault(); history.back(); });
    }

    try {
        const response = await fetch('js/productos.json');
        const data = await response.json();
        const productos = data.lista_productos; // <-- Leemos la lista

        const urlParams = new URLSearchParams(window.location.search);
        const productoId = parseInt(urlParams.get('id'));
        const producto = productos.find(p => p.id === productoId);

        if (producto) {
            document.title = `${producto.nombre} - MiStore22`;
            document.querySelector('.producto-titulo').textContent = producto.nombre;
            document.querySelector('.producto-precio').textContent = `$${producto.precio.toFixed(2)} MX`;
            document.querySelector('.producto-descripcion-corta').textContent = producto.descripcion;

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

            const btnComprar = document.querySelector('.btn-anadir-carrito');
            btnComprar.addEventListener('click', (e) => {
                e.preventDefault();
                const mensaje = `Hola, me interesa comprar el producto: ${producto.nombre}`;
                const whatsappUrl = `https://wa.me/521TUNUMERO?text=${encodeURIComponent(mensaje)}`;
                window.open(whatsappUrl, '_blank');
            });
        }
    } catch (error) {
        console.error("Error al cargar el producto:", error);
        const detalleLayout = document.querySelector('.producto-detalle-layout');
        if (detalleLayout) {
            detalleLayout.innerHTML = '<h1>Producto no encontrado o error al cargar.</h1>';
        }
    }
});