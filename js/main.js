document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const menuPrincipal = document.querySelector('.menu-principal');
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');

    const carritoContador = document.getElementById('carrito-contador'); // Vuelve a un solo ID

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

    // Función para actualizar el contador del carrito (solo un ID)
    window.actualizarContadorCarrito = function() { // Hacerla global
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
        
        if (carritoContador) { 
            carritoContador.textContent = totalItems;
        }
    }

    // Llama a la función al cargar la página
    actualizarContadorCarrito();
});