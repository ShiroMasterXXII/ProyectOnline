// js/producto-detalle.js (VERSIÓN FINAL)

document.addEventListener('DOMContentLoaded', async function() {
    // --- LÓGICA PARA EL BOTÓN DE REGRESAR ---
    const btnRegresar = document.getElementById('btn-regresar');
    if (btnRegresar) {
        btnRegresar.addEventListener('click', function(event) {
            event.preventDefault();
            history.back();
        });
    }

    // --- LÓGICA PRINCIPAL ---
    try {
        // 1. Carga el "índice" de todos los productos generado por Decap CMS.
        // Netlify Functions se encarga de crearlo si está bien configurado.
        // O Decap puede generar un archivo JSON con todos los productos.
        // Asumiremos que tenemos un 'productos.json' en la raíz por simplicidad.
        const response = await fetch('/productos.json'); // Asumiendo que se genera un JSON
        if (!response.ok) throw new Error('No se encontró el archivo de productos.');
        
        const productos = await response.json();
        
        const urlParams = new URLSearchParams(window.location.search);
        const productoSlug = urlParams.get('id'); // Asumiendo que el ID es el slug
        
        // Busca el producto por su 'slug' o nombre único
        const producto = productos.find(p => p.slug === productoSlug);

        if (producto) {
            // Llenar datos del producto
            document.title = `${producto.nombre} - MiStore22`;
            // ... (resto del código para llenar la página, crear la galería, etc.) ...
            // Este código funcionará ahora que 'producto' se ha cargado correctamente.
        } else {
            throw new Error(`Producto con slug '${productoSlug}' no encontrado.`);
        }
    } catch (error) {
        console.error("Error al cargar el producto:", error);
        const detalleLayout = document.querySelector('.producto-detalle-layout');
        if (detalleLayout) {
            detalleLayout.innerHTML = '<h1>Error al cargar el producto.</h1>';
        }
    }
});