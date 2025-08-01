// js/producto-detalle.js

document.addEventListener('DOMContentLoaded', function() {

    // ===== LÓGICA PARA EL BOTÓN DE REGRESAR =====
    const btnRegresar = document.getElementById('btn-regresar');
    if (btnRegresar) {
        btnRegresar.addEventListener('click', function(event) {
            event.preventDefault(); // Previene que el enlace recargue la página
            history.back();       // Le dice al navegador que vaya a la página anterior
        });
    }
    // ===========================================

    const urlParams = new URLSearchParams(window.location.search);
    const productoId = parseInt(urlParams.get('id'));
    const producto = productos.find(p => p.id === productoId);

    if (producto) {
        document.title = `${producto.nombre} - MiStore22`;
        document.querySelector('.producto-titulo').textContent = producto.nombre;
        document.querySelector('.columna-imagen img').src = producto.img;
        document.querySelector('.columna-imagen img').alt = producto.nombre;
        document.querySelector('.producto-precio').textContent = `$${producto.precio.toFixed(2)} MX`;
        document.querySelector('.producto-descripcion-corta').textContent = producto.descripcion;
        
        const btnComprar = document.querySelector('.btn-anadir-carrito');
        btnComprar.addEventListener('click', (e) => {
            e.preventDefault();
            const mensaje = `Hola, me interesa comprar el producto: ${producto.nombre}`;
            // ¡¡IMPORTANTE!! Reemplaza 521TUNUMERO con tu número real
            const whatsappUrl = `https://wa.me/521TUNUMERO?text=${encodeURIComponent(mensaje)}`;
            window.open(whatsappUrl, '_blank');
        });

    } else {
        const detalleLayout = document.querySelector('.producto-detalle-layout');
        if (detalleLayout) {
            detalleLayout.innerHTML = '<h1>Producto no encontrado</h1>';
        }
    }
});