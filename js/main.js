document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const menuPrincipal = document.querySelector('.menu-principal');
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');

    const carritoContador = document.getElementById('carrito-contador'); // El único ID del contador

    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', function() {
            menuPrincipal.classList.toggle('is-active');
        });
    }

    if (dropdown && dropdownContent) {
        dropdown.addEventListener('click', function(e) {
            e.preventDefault();
            dropdownContent.classList.toggle('show');
        });
    }

    // Esta función se hace global para que otros scripts (producto.js, carrito.js) puedan llamarla
    window.actualizarContadorCarrito = function() {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
        
        if (carritoContador) { 
            carritoContador.textContent = totalItems;
        }
    }

    // Llama a la función al cargar la página para inicializar el contador
    actualizarContadorCarrito();
});