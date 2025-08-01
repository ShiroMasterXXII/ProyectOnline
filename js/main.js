// js/main.js

document.addEventListener('DOMContentLoaded', function() {
    const hamburgerButton = document.querySelector('.hamburger-menu');
    const menuPrincipal = document.querySelector('.menu-principal');
    const dropdownToggle = document.querySelector('.dropdown > a');
    const dropdownContent = document.querySelector('.dropdown-content');

    if (hamburgerButton && menuPrincipal) {
        hamburgerButton.addEventListener('click', () => {
            menuPrincipal.classList.toggle('is-active');
        });
    }

    if (dropdownToggle && dropdownContent) {
        dropdownToggle.addEventListener('click', function(event) {
            if (window.innerWidth > 768) {
                event.preventDefault();
                dropdownContent.classList.toggle('show');
            }
        });
    }

    window.addEventListener('click', function(event) {
        if (dropdownContent && dropdownContent.classList.contains('show') && !event.target.closest('.dropdown')) {
            dropdownContent.classList.remove('show');
        }
    });
});