document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const menuPrincipal = document.querySelector('.menu-principal');
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');

    // Contadores para las dos versiones del carrito
    const carritoContadorMobile = document.getElementById('carrito-contador-mobile');
    const carritoContadorDesktop = document.getElementById('carrito-contador-desktop');


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

    // Función para actualizar los contadores del carrito
    window.actualizarContadorCarrito = function() { // Hacerla global para que producto.js y carrito.js puedan llamarla
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
        
        if (carritoContadorMobile) { 
            carritoContadorMobile.textContent = totalItems;
        }
        if (carritoContadorDesktop) { 
            carritoContadorDesktop.textContent = totalItems;
        }
    }

    // Llama a la función al cargar la página
    actualizarContadorCarrito();
});