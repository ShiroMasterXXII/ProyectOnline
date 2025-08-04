document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica del Menú Hamburguesa (ya existente, pero reconfirmada) ---
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const mainMenu = document.querySelector('.menu-principal');

    if (hamburgerBtn && mainMenu) {
        hamburgerBtn.addEventListener('click', function() {
            mainMenu.classList.toggle('is-active');
            // Opcional: Cerrar el dropdown de categorías si el menú principal se cierra
            const dropdownContent = document.querySelector('.dropdown-content');
            if (!mainMenu.classList.contains('is-active') && dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
            }
        });
    }

    // --- Lógica para el Dropdown de Categorías (NUEVA O MEJORADA) ---
    const dropdownToggle = document.querySelector('.dropdown > a'); // El enlace "Categorías"
    const dropdownContent = document.querySelector('.dropdown-content'); // El submenú real

    if (dropdownToggle && dropdownContent) {
        // Función para manejar el clic en "Categorías"
        dropdownToggle.addEventListener('click', function(event) {
            // Previene la navegación por defecto (ir a #)
            event.preventDefault(); 
            
            // Alterna la clase 'show' para mostrar/ocultar el dropdown
            dropdownContent.classList.toggle('show');
        });

        // Opcional: Cerrar el dropdown si el usuario hace clic fuera de él
        document.addEventListener('click', function(event) {
            if (!dropdownToggle.contains(event.target) && !dropdownContent.contains(event.target)) {
                if (dropdownContent.classList.contains('show')) {
                    dropdownContent.classList.remove('show');
                }
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    
    // --- CÓDIGO PARA EL MENÚ TRANSPARENTE AL HACER SCROLL ---
    const header = document.querySelector('header');

    if (header) { // Nos aseguramos que el header exista
        window.addEventListener('scroll', function() {
            // Si el scroll vertical es mayor a 50 píxeles...
            if (window.scrollY > 50) {
                // ...agregamos la clase 'scrolled' al header.
                header.classList.add('scrolled');
            } else {
                // ...si no, la quitamos.
                header.classList.remove('scrolled');
            }
        });
    }

    // (Aquí puede ir el resto de tu código de main.js, como el de la hamburguesa)
});