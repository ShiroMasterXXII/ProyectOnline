document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const menuPrincipal = document.querySelector('.menu-principal');
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');

    // Ambos contadores del carrito móvil y de escritorio
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

    // Función para actualizar ambos contadores del carrito (se hizo global para que otros scripts puedan llamarla)
    window.actualizarContadorCarrito = function() {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
        
        if (carritoContadorMobile) { 
            carritoContadorMobile.textContent = totalItems;
        }
        if (carritoContadorDesktop) { 
            carritoContadorDesktop.textContent = totalItems;
        }
    }

    // Llama a la función al cargar la página para inicializar los contadores
    actualizarContadorCarrito();
});